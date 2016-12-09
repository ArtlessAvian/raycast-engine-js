var colors = ["64", "96", "AF", "BB", "C1", "C8"]

function Wall(ax, ay, bx, by)
{
	this.ax = ax;
	this.ay = ay;
	this.bx = bx;
	this.by = by;
	this.aIsEndpoint = false;
	this.bIsEndpoint = false;

	this.normal = Math.atan2((by - ay),(bx - ax)) + Math.PI/2;

	var normalSlope = -(bx - ax) / (by - ay);

	this.portalA = null;
	this.portalB = null;
	this.isPortal = true;

	this.color = "#";
	this.color += colors[Math.floor(Math.random() * colors.length)];
	this.color += colors[Math.floor(Math.random() * colors.length)];
	this.color += colors[Math.floor(Math.random() * colors.length)];

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

Wall.prototype.translate = function(v)
{
	// TODO
	return this.distance - Math.cos(angleDistance(v.atan2(), this.normal + Math.PI)) * v.dst();
}

Wall.prototype.raycast = function(aPos, theta)
{

	if (this.translate(aPos) < 0)
	{
		// if (Math.random() < 0.005)
		// {
		// 	console.log("aaa " + aWall.translate(aPos));
		// }
		return Infinity;
	}

	if (angleDistance(theta, this.normal) < Math.PI/2)
	{
		// if (Math.random() < 0.005)
		// {
		// 	console.log("bbb " + angleDistance(theta,aWall.normal));
		// }
		return Infinity;
	}

	return this.translate(aPos)/Math.cos(theta - this.normal - Math.PI);
}

function Room()
{
	this.walls = new Array();

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
		var temp = Math.min(minimum, wall.raycast(aPos, theta));
		if (temp < minimum)
		{
			minimum = temp;
			minimumWall = wall;
			context.fillStyle = wall.color;
		}
	}

	if (minimumWall === null || !minimumWall.isPortal)
	{
		return minimum;
	}
	else
	{
		var other = minimumWall.getOther(this);
		if (other === null)
		{
			return minimum;
		}
		return other.raycastRoom(aPos, theta, minimumWall);
	}
}

function Entity(pos, theta, r)
{
	this.controller = new Controller();

	this.pos = pos;
	this.theta = theta;
	this.room = r;
}

Entity.prototype.raycastEntity = function(deltaTheta)
{
	return this.room.raycastRoom(this.pos, this.theta + deltaTheta, null)
}

function Model()
{
	// // Rooms
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

	// this.engine = new Engine();

	// // Entities
	this.entities = new Array();
	this.entities.push(new Entity(new Vec2D(0,0), 0, room));
	this.entities[0].controller.bind("F", "turnRight");
	this.entities[0].controller.bind("C", "turnLeft");
	this.entities[0].controller.bind("W", "forward");
	this.entities[0].controller.bind("S", "back");
	this.entities[0].controller.bind("A", "strafeLeft");
	this.entities[0].controller.bind("D", "strafeRight");


	// // temp = new Room.Entity(new Vector(20,20), Math.PI/2);
	// // temp.room = this.rooms[0];
	// // temp.room.entities.push(temp);

	// this.entities.push(temp);
}

Model.prototype.update = function(timeStep)
{
	for (var entity of this.entities)
	{
		if (entity.controller.fields["turnLeft"])
		{
			entity.theta += timeStep;
		}
		if (entity.controller.fields["turnRight"])
		{
			entity.theta -= timeStep;
		}
		if (entity.controller.fields["forward"])
		{
			entity.pos.addPol(timeStep, entity.theta);
		}
		if (entity.controller.fields["back"])
		{
			entity.pos.addPol(timeStep, entity.theta + Math.PI);
		}
		if (entity.controller.fields["strafeLeft"])
		{
			entity.pos.addPol(timeStep, entity.theta + Math.PI/2);
		}
		if (entity.controller.fields["strafeRight"])
		{
			entity.pos.addPol(timeStep, entity.theta - Math.PI/2);
		}
	}
}