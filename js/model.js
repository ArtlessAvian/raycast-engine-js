function Model()
{
	this.space = new Space();

	// this.engine = new Engine();

	// // Entities
	this.entities = new Array();
	this.entities.push(new Entity(new Vec2D(0,0), 0, this.space.rooms[0]));
	this.entities[0].addControls();
	this.entities[0].addView();

	// // temp = new Room.Entity(new Vector(20,20), Math.PI/2);
	// // temp.room = this.rooms[0];
	// // temp.room.entities.push(temp);

	// this.entities.push(temp);
}

Model.prototype.update = function(timeStep)
{
	for (var entity of this.entities)
	{
		entity.doMovement(timeStep);
		entity.doCollision(null);
	}
}