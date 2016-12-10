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

	context.fillStyle="#00CC00";
	context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	context.fillStyle="#002200";
	context.fillRect(this.bounds.x+10, this.bounds.y+10, this.bounds.width-20, this.bounds.height-20);

	this.drawSpace(anEntity, aModel.space);

	context.beginPath();
	this.moveToWrap(anEntity, anEntity.pos.x + Math.cos(anEntity.theta), anEntity.pos.y + Math.sin(anEntity.theta));
	this.lineToWrap(anEntity, anEntity.pos.x, anEntity.pos.y);
	context.stroke();

	context.fillStyle="#FF0000";
	this.fillRectWrap(anEntity,0,0);

	for (var i = -Math.PI/6; i <= Math.PI/6; i += Math.PI/36)
	{
		var ray = anEntity.raycastEntity(i);
		for (var dst of ray)
		{
			this.blips.push(anEntity.pos.x + dst * Math.cos(anEntity.theta + i));
			this.blips.push(anEntity.pos.y + dst * Math.sin(anEntity.theta + i));
		}
	}

	context.fillStyle="#FF0000";
	for (var i = 0; i < this.blips.length; i += 2)
	{
		this.fillRectWrap(anEntity, this.blips[i], this.blips[i+1]);
	}

	this.blips = [];

	context.restore();
}

ViewMinimap.prototype.drawSpace = function(anEntity, aSpace)
{
	for (var room of aSpace.rooms)
	{
		this.drawRoom(anEntity, room);
	}
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

	// draw infinite ish
	context.globalAlpha = 0.5;
	var x = -Math.cos(aWall.normal) * aWall.distance;
	var y = -Math.sin(aWall.normal) * aWall.distance;

	context.beginPath();
	this.moveToWrap(anEntity, x + Math.cos(aWall.normal + Math.PI/2) * 400, y + Math.sin(aWall.normal + Math.PI/2) * 400);
	this.lineToWrap(anEntity, x - Math.cos(aWall.normal + Math.PI/2) * 400, y - Math.sin(aWall.normal + Math.PI/2) * 400);
	context.stroke();

	context.globalAlpha = 1;

	// draw line segment
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