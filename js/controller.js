// Controller Manager
function ControllerManager()
{
	this.controllers = new Array();	
}

ControllerManager.prototype.instance = new ControllerManager();

// Boring Stuff
ControllerManager.prototype.keydownHandler = function(key)
{
	console.log(key);
	for (controllerID = 0; controllerID < this.controllers.length; controllerID++)
	{
		this.controllers[controllerID].keydownHandler(key);
	}
}

ControllerManager.prototype.keyupHandler = function(key)
{
	for (controllerID = 0; controllerID < this.controllers.length; controllerID++)
	{
		this.controllers[controllerID].keyupHandler(key);
	}
}

// Controller
function Controller(aReciever)
{
	ControllerManager.prototype.instance.controllers.push(this);

	this.binds = new Object(); // Used as Map (Key --> Field Name)
	this.fields = new Object();
	this.reciever = aReciever;
}

Controller.prototype.bind = function(key, name)
{
	this.binds[key] = name;
	this.fields[name] = false;
}

Controller.prototype.keydownHandler = function(key)
{
	this.fields[this.binds[key]] = true;
}

Controller.prototype.keyupHandler = function(key)
{
	this.fields[this.binds[key]] = false;
}