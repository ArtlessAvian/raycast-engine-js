
function ViewFirstPerson(model, r)
{
	this.model = model;
	this.bounds = r;

	this.minimap = new ViewMinimap(new Rectangle(r.x + 50, r.y + 50, 200, 200));
	//this.subdivisions = 1;
	this.setRectangleWidth(20);
	this.fov = Math.PI/3;
	this.fisheye = false;
	this.near = 500; // px height 1 world unit away

	this.entityID = 0;
}

ViewFirstPerson.prototype.resize = function()
{
	// TODO
	this.minimap.resize();
}

ViewFirstPerson.prototype.setRectangles = function(n)
{
	this.subdivisions = n;
}

ViewFirstPerson.prototype.setRectangleWidth = function(n)
{
	this.subdivisions = Math.floor(this.bounds.width / n);
}

ViewFirstPerson.prototype.render = function()
{
	// context.save();

	// context.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	// context.clip();

	// Draw Floor TEMP
	context.fillStyle="#605F5D";
	context.fillRect(0, this.bounds.height/2, this.bounds.width, this.bounds.height/2);

	var delta = this.bounds.width/this.subdivisions;

//	for (var i = 0; i < this.subdivisions - 1; i++)
	for (var i = this.subdivisions - 1; i >= 0; i--)
	{
		var deltaTheta = (i - this.subdivisions/2 + 1/2) * -this.fov/this.subdivisions;

		var distances = this.model.entities[this.entityID].raycastEntity(deltaTheta); // distance
		var distance = distances[0]
		if (distance == Infinity)
		{
			continue;
		}

		if (!this.fisheye)
		{
			distance *= Math.cos(deltaTheta); // remove fisheye
		}
		height = this.near/distance; // distance is inversely proportional to size (if distance is 1, height is this.near)

		context.fillRect(this.bounds.x + i * delta - 1, this.bounds.height/2 - height/2, delta + 2, height);
	}

	// for (i = 0; i < Math.PI * 4 * 10; i++)
	// {
	// 	context.fillStyle="#FF0000";
	// 	context.fillRect(i * 10, this.bounds.height/2 + 50 * angleDistance(i/10, 0), 10, 10)
	// }

	this.minimap.render(this.model, this.model.entities[this.entityID]);

	// context.restore();
}



