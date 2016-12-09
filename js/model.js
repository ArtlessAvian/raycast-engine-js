var colors = ["64", "96", "AF", "BB", "C1", "C8"]

function Wall(ax, ay, normal)
{
	this.normal = normal;

	this.portalA = null;
	this.portalB = null;

	this.color = "#";
	this.color += colors[Math.floor(Math.random() * colors.length)];
	this.color += colors[Math.floor(Math.random() * colors.length)];
	this.color += colors[Math.floor(Math.random() * colors.length)];

	// y - ay = -inv(normal) (x - ax)
	// y - 0  =    normal   (x - 0)
	// normal x + inv(normal) x  = inv(normal) ax + ay
	// x = (inv(normal) + ax + ay) / (normal + inv(normal))

	if (Math.tan(normal) == 0)
	{
		var x = ax;
		var y = 0;
	}
	else
	if (1/Math.tan(normal) == 0)
	{
		var x = 0;
		var y = ay;
	}
	else
	{
		var x = (ax / Math.tan(normal) + ay) / (Math.tan(normal) + 1/Math.tan(normal));
		var y = Math.tan(normal) * x;
	}

	// distance to origin	
	this.distance = Math.sqrt(x * x + y * y);

	// console.log(x,y);
	// console.log(normal, Math.atan2(y, x));
	// console.log(angleDistance(normal, Math.atan2(y, x)));
	if (angleDistance(normal, Math.atan2(y, x)) < Math.PI/2)
	{
		this.distance *= -1;
	}
}

Wall.prototype.makePortal = function(aRoom, bRoom)
{
	this.portalA = aRoom;
	this.portalB = bRoom;
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

function Room()
{
	this.walls = new Array();

}

function Entity(pos, theta, r)
{
	this.controller = new Controller();

	this.pos = pos;
	this.theta = theta;
	this.room = r;
}

function Model()
{
	// // Rooms
	this.rooms = new Array();

	var room = new Room();
	var portal = new Wall(1, 0, Math.PI)
	room.walls.push(portal);
	room.walls.push(new Wall(0, 3, 3/2 * Math.PI));
	room.walls.push(new Wall(-3, 0, 0));
	room.walls.push(new Wall(0, -2, 1/4 * Math.PI));
	this.rooms.push(room);

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