
function ViewFirstPerson(model, entity)
{
	this.model = model;
	this.bounds = new Rectangle(0,0,0,0);

	this.minimap = new ViewMinimap();
	//this.subdivisions = 1;
	this.setRectangles(200);
	this.fov = Math.PI/3;
	this.fisheye = false;
	this.near = 250; // px / worldU / heightU

	this.entity = entity;
}

ViewFirstPerson.prototype.resize = function(id, amount)
{
	// TODO
	
	var verticalScreens = Math.ceil(Math.sqrt(amount));
	var horizontalScreens = Math.ceil(amount / verticalScreens);

	this.bounds.width = canvas.width / horizontalScreens;
	this.bounds.height = canvas.height / verticalScreens;

	this.bounds.x = this.bounds.width * (id % horizontalScreens);
	this.bounds.y = this.bounds.height * Math.floor(id / horizontalScreens);

	this.minimap.resize(this.bounds);
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

	// Draw Floor TEMP
	context.fillStyle="#605F5D";
	context.fillRect(this.bounds.x, this.bounds.y + this.bounds.height/2, this.bounds.width, this.bounds.height/2);

	var delta = this.bounds.width/this.subdivisions;

	for (var i = this.subdivisions - 1; i >= 0; i--)
	{
		var deltaTheta = (i - this.subdivisions/2 + 1/2) * -this.fov/this.subdivisions;

		var distances = this.entity.raycastEntity(deltaTheta); // distance
		var distance = distances[0];

		if (!this.fisheye)
		{
			distance *= Math.cos(deltaTheta); // remove fisheye
		}

		height = this.near/distance; // distance is inversely proportional to size (if distance is 1, height is this.near)

		context.fillRect(this.bounds.x + i * delta-1, this.bounds.y + this.bounds.height/2 - height, delta+1, height * 2);
	}

	// for (i = 0; i < Math.PI * 4 * 10; i++)
	// {
	// 	context.fillStyle="#FF0000";
	// 	context.fillRect(i * 10, this.bounds.height/2 + 50 * angleDistance(i/10, 0), 10, 10)
	// }

	this.minimap.render(theModel, this.entity);
}
