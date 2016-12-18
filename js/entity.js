function Entity(pos, theta, r)
{
	this.controller = new Controller();

	this.pos = pos;
	this.oldPos = new Vec2D(pos.x, pos.y);
	this.vel = new Vec2D(0,0);

	this.radius = 0.2;

	this.theta = theta;
	this.room = r;
}

Entity.prototype.raycastEntity = function(deltaTheta)
{
	return this.room.raycastRoom(this.pos, this.theta + deltaTheta, null)
}

Entity.prototype.addControls = function()
{
	this.controller.bind("F", "turnRight");
	this.controller.bind("C", "turnLeft");
	this.controller.bind("W", "forward");
	this.controller.bind("S", "back");
	this.controller.bind("A", "strafeLeft");
	this.controller.bind("D", "strafeRight");
}

Entity.prototype.addView = function()
{
	this.view = new ViewFirstPerson(theModel, this);
	theView.push(this.view);
	resizeHandler();
}

Entity.prototype.doMovement = function(timeStep)
{
	this.oldPos.set(this.pos.x, this.pos.y);

	if (this.controller.fields["turnLeft"])
	{
		this.theta += timeStep;
	}
	if (this.controller.fields["turnRight"])
	{
		this.theta -= timeStep;
	}
	if (this.controller.fields["forward"])
	{
		this.pos.addPol(timeStep, this.theta);
	}
	if (this.controller.fields["back"])
	{
		this.pos.addPol(timeStep, this.theta + Math.PI);
	}
	if (this.controller.fields["strafeLeft"])
	{
		this.pos.addPol(timeStep, this.theta + Math.PI/2);
	}
	if (this.controller.fields["strafeRight"])
	{
		this.pos.addPol(timeStep, this.theta - Math.PI/2);
	}
}

Entity.prototype.doCollision = function(fromPortal)
{
	for (var wall of this.room.walls)
	{
		var distance = wall.translate(this.pos);

		if (wall.isPortal)
		{
			if (wall != fromPortal)
			{
				var oldDistance = wall.translate(this.oldPos);
				if (distance * oldDistance < 0)
				{
					this.room = wall.getOther(this.room);
					messages.queue("Portal! " + this.room.name);
					this.doCollision(wall);
					return undefined;
				}
			}
		}
		else
		{
			if (distance < this.radius)
			{
				this.pos.x += (this.radius-distance) * Math.cos(wall.normal);
				this.pos.y += (this.radius-distance) * Math.sin(wall.normal);
			}
		}
	}
}