var colorRange = ["64", "96", "AF", "BB", "C1", "C8"];

function getRandomColor()
{
	var color = "#";
	color += colorRange[Math.floor(Math.random() * colorRange.length)];
	color += colorRange[Math.floor(Math.random() * colorRange.length)];
	color += colorRange[Math.floor(Math.random() * colorRange.length)];

	return color;
}

function Wall(ax, ay, bx, by)
{
	this.ax = ax;
	this.ay = ay;
	this.bx = bx;
	this.by = by;
	this.aIsEndpoint = false;
	this.bIsEndpoint = false;

	this.color = getRandomColor();

	this.normal = Math.atan2((by - ay),(bx - ax)) + Math.PI/2;

	var normalSlope = -(bx - ax) / (by - ay);

	this.portalA = null;
	this.portalB = null;
	this.isPortal = false;

	if (normalSlope == 0)
	{
		var x = ax;
		var y = 0;
	}
	else if (1/normalSlope == 0)
	{
		var x = 0;
		var y = ay;
	}
	else
	{
		// y - ay = -inv(normal) (x - ax)
		// y - 0  =    normal   (x - 0)
		// normal x + inv(normal) x  = inv(normal) ax + ay
		// x = (inv(normal) + ax + ay) / (normal + inv(normal))
		var x = (ax / normalSlope + ay) / (normalSlope + 1/normalSlope);
		var y = normalSlope * x;
	}

	// distance to origin	
	this.distance = Math.sqrt(x * x + y * y);

	// console.log(x,y);
	// console.log(normal, Math.atan2(y, x));
	// console.log(angleDistance(normal, Math.atan2(y, x)));
	if (angleDistance(this.normal, Math.atan2(y, x)) < Math.PI/2)
	{
		this.distance *= -1;
	}
}

Wall.prototype.makePortal = function(aRoom, bRoom)
{
	this.portalA = aRoom;
	this.portalB = bRoom;
	this.isPortal = true;
}

Wall.prototype.getNormal = function(aRoom)
{
	if (this.isPortal && aRoom === this.portalB)
	{
		return this.normal + Math.PI;
	}
	return this.normal;
}

Wall.prototype.getOther = function(someRoom)
{
	if (someRoom === this.portalA)
	{
		return this.portalB;
	}
	if (someRoom === this.portalB)
	{
		return this.portalA;
	}
	return null;
}

Wall.prototype.translate = function(v, aRoom)
{
	if (aRoom === this.portalB)
	{
		// same as negating the entire expression
		return -this.distance - Math.cos(angleDistance(v.atan2(), this.getNormal(aRoom) + Math.PI)) * v.dst();
	}
	return this.distance - Math.cos(angleDistance(v.atan2(), this.getNormal(aRoom) + Math.PI)) * v.dst();
}

Wall.prototype.raycast = function(aPos, aRoom, theta)
{

	if (this.translate(aPos, aRoom) < 0)
	{
		// if (Math.random() < 0.005)
		// {
		// 	console.log("aaa " + aWall.translate(aPos));
		// }
		return Infinity;
	}

	if (angleDistance(theta, this.getNormal(aRoom)) < Math.PI/2)
	{
		// if (Math.random() < 0.005)
		// {
		// 	console.log("bbb " + angleDistance(theta,aWall.normal));
		// }
		return Infinity;
	}

	return this.translate(aPos, aRoom)/Math.cos(theta - this.getNormal(aRoom) - Math.PI);
}

function Room()
{
	this.walls = new Array();
	this.name = Math.random() + "";

}

Room.prototype.raycastRoom = function(aPos, theta, fromPortal)
{
	var minimum = Infinity;
	var minimumWall = null;
	for (var wall of this.walls)
	{
		if (wall === fromPortal)
		{
			continue;
		}
		var temp = Math.min(minimum, wall.raycast(aPos, this, theta));
		if (temp < minimum)
		{
			minimum = temp;
			minimumWall = wall;
			context.fillStyle = wall.color;
		}
	}

	if (minimumWall === null || !minimumWall.isPortal)
	{
		return [minimum];
	}
	else
	{
		var other = minimumWall.getOther(this);
		if (other === null)
		{
			return [minimum];
		}

		var distances = other.raycastRoom(aPos, theta, minimumWall);
		distances.push(minimum);
		return distances;
	}
}

function Space()
{
	this.rooms = new Array();

	// hardcodeee
	var room = new Room();
	var portal = new Wall(-1,-1,1,-1);
	room.walls.push(portal);
	room.walls.push(new Wall(1,-1,3,4));
	room.walls.push(new Wall(3,4,-1,2));
	room.walls.push(new Wall(-1,2,-1,-1));
	this.rooms.push(room);

	var room2 = new Room();
	
	room2.walls.push(portal);
	room2.walls.push(new Wall(-1,-1,-2,-3));
	room2.walls.push(new Wall(-2,-3,2,-3));
	room2.walls.push(new Wall(2,-3,1,-1));
	this.rooms.push(room2);


	portal.makePortal(room, room2);
}