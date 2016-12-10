
function MessageBox(r)
{
	this.bounds = r;

	this.font = "20px Verdana"
	this.borderSize = 10; // in px
	this.fontSpacer = 22;

	this.messages = new Array();
	this.messagesInbox = new Array();

	this.queue("J C to turn");
	this.queue("WASD to move");
}

MessageBox.prototype.queue = function(s)
{
	console.log(s);
	this.messagesInbox.push(s);
}

MessageBox.prototype.dequeue = function()
{
	if (this.messages.isEmpty)
	{
		for (var s of this.messagesInbox)
		{
			// wow now i can pass interviews
			this.messages.push(this.messagesInbox.pop());
		}
	}
	return this.messages.pop();
}

MessageBox.prototype.resize = function()
{
	// TODO
}

MessageBox.prototype.render = function()
{
	context.save();

	context.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	context.clip();

	context.fillStyle="#CCCCCC";
	context.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

	context.fillStyle="#222222";
	context.font = this.font;

	var i = 0;
	for (var y = this.bounds.y + this.bounds.height - this.borderSize; y >= this.bounds.y - this.fontSpacer; y -= this.fontSpacer)
	{
		var s = "";

		if (i < this.messagesInbox.length)
		{
			s = this.messagesInbox[this.messagesInbox.length-1 - i];

		}
		else if (i < this.messagesInbox.length + this.messages.length)
		{
			s = this.messages[i - this.messagesInbox.length];
		}
		else
		{
			break;
		}
		context.fillText(s, this.bounds.x + this.borderSize, y);
		i++;
	}

	context.restore();
}