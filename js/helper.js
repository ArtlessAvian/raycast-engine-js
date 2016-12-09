// Gross TODO FIXME etc.
function angleDistance(a, b)
{
	var thing = Math.abs((a - b) % (2 * Math.PI));
	if (thing > Math.PI)
	{
		thing = 2 * Math.PI - thing;
	}
	return Math.abs(thing);
}

function Vec2D(x, y)
{
	this.x = x;
	this.y = y;
}

Vec2D.prototype.set = function(x, y)
{
	this.x = x;
	this.y = y;
}

Vec2D.prototype.add = function(x, y)
{
	this.x += x;
	this.y += y;
}

Vec2D.prototype.addPol = function(mag, theta)
{
	this.x += Math.cos(theta) * mag;
	this.y += Math.sin(theta) * mag;
}

Vec2D.prototype.scl = function(a)
{
	this.x *= a;
	this.y *= a;
}

Vec2D.prototype.dst = function()
{
	return Math.sqrt(this.dst2())
}

Vec2D.prototype.dst2 = function()
{
	return this.x * this.x + this.y * this.y;
}

Vec2D.prototype.atan2 = function()
{
	return Math.atan2(this.y, this.x);
}

function Rectangle(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}

Rectangle.prototype.set = function(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}

Rectangle.prototype.isInside = function(v)
{
	if (0 <= v.x - this.x <= this.width)
	{
		if (0 <= v.y - this.y <= this.height)
		{
			return true;
		}	
	}
	return false;
}