
function Portal(defnName, posInCells, destinationVenueName, destinationPosInCells)
{
	this.defnName = defnName;
	this.posInCells = posInCells.addXY(.5, .5);
	this.destinationVenueName = destinationVenueName;
	this.destinationPosInCells = destinationPosInCells;
	
	this.pos = new Coords();
}

{
	Portal.prototype.defn = function(world)
	{
		return world.portalDefns[this.defnName];
	}

	Portal.prototype.activate = function(universe, world, venue, actor)
	{
		var mover = actor;
		venue.moversToRemove.push(mover);
		var venueNext = world.venues[this.destinationVenueName];
		venueNext.movers.splice(0, 0, mover);
		mover.posInCells.overwriteWith(this.destinationPosInCells);
		world.venueNext = venueNext;
	}
	
	Portal.prototype.updateForTimerTick = function(universe, world, venue)
	{
		this.pos.overwriteWith(this.posInCells).multiply(venue.map.cellSizeInPixels);	
	}
	
	// drawable
		
	Portal.prototype.draw = function(universe, world, visualCamera)
	{
		var defn = this.defn(world);
		var visual = defn.visual;
		visualCamera.child = visual;
		visualCamera.draw(universe, world, universe.display, this);
	}
}
