function ViewMinimap(r)
{
	this.bounds = r;
	this.unitLength = 30; // in pixels
	this.blipSize = 4; // in pixels

	this.blips = [];
}

ViewMinimap.prototype.resize = function()
{
	// TODO
}

ViewMinimap.prototype.render = function(aModel, anEntity)
{
	context.save();

	context.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	context.clip();

	context.fillStyle="#009900";
	context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

	for (var room of aModel.rooms)
	{
		this.drawRoom(anEntity, room);
	}

	context.beginPath();
	this.moveToWrap(anEntity, anEntity.pos.x + Math.cos(anEntity.theta), anEntity.pos.y + Math.sin(anEntity.theta));
	this.lineToWrap(anEntity, anEntity.pos.x, anEntity.pos.y);
	context.stroke();

	context.fillStyle="#FF0000";
	this.fillRectWrap(anEntity,0,0);

	for (var i = 0; i < this.blips.length; i += 2)
	{
		this.fillRectWrap(anEntity, this.blips[i], this.blips[i+1]);
	}

	this.blips = [];

	context.restore();
}

ViewMinimap.prototype.drawRoom = function(anEntity, aRoom)
{
	for (var wall of aRoom.walls)
	{
		this.drawWall(anEntity, wall);
	}
}

ViewMinimap.prototype.drawWall = function(anEntity, aWall)
{
	context.strokeStyle = aWall.color;
	context.fillStyle = aWall.color;
	context.beginPath();
	this.moveToWrap(anEntity, aWall.ax, aWall.ay);
	this.lineToWrap(anEntity, aWall.bx, aWall.by);
	context.stroke();

	this.fillRectWrap(anEntity, aWall.ax, aWall.ay);
	this.fillRectWrap(anEntity, aWall.bx, aWall.by);
}

ViewMinimap.prototype.fillRectWrap = function(anEntity, x, y)
{
	var xOffset = this.bounds.x + this.bounds.width/2;
	var yOffset = this.bounds.y + this.bounds.height/2;

	x -= anEntity.pos.x;
	y -= anEntity.pos.y;

	context.fillRect(xOffset + this.unitLength * x - this.blipSize/2, yOffset - this.unitLength * y - this.blipSize/2, this.blipSize, this.blipSize);
}

ViewMinimap.prototype.moveToWrap = function(anEntity, x, y)
{
	var xOffset = this.bounds.x + this.bounds.width/2;
	var yOffset = this.bounds.y + this.bounds.height/2;

	x -= anEntity.pos.x;
	y -= anEntity.pos.y;

	context.moveTo(xOffset + this.unitLength * x, yOffset - this.unitLength * y);
}

ViewMinimap.prototype.lineToWrap = function(anEntity, x, y)
{
	var xOffset = this.bounds.x + this.bounds.width/2;
	var yOffset = this.bounds.y + this.bounds.height/2;

	x -= anEntity.pos.x;
	y -= anEntity.pos.y;

	context.lineTo(xOffset + this.unitLength * x, yOffset - this.unitLength * y);
}