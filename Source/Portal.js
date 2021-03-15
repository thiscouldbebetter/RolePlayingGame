
class Portal
{
	constructor(defnName, posInCells, destinationVenueName, destinationPosInCells)
	{
		this.defnName = defnName;
		this.posInCells = posInCells.addDimensions(.5, .5, 0);
		this.destinationVenueName = destinationVenueName;
		this.destinationPosInCells = destinationPosInCells;

		this.pos = new Coords();
		this._locatable = new Locatable(new Disposition(this.pos));
	}

	activate(universe, world, venue, actor)
	{
		var mover = actor;
		venue.moversToRemove.push(mover);
		var venueNext = world.venues[this.destinationVenueName];
		venueNext.movers.splice(0, 0, mover);
		mover.posInCells.overwriteWith(this.destinationPosInCells);
		world.venueNext = venueNext;
	}

	defn(world)
	{
		return world.portalDefns[this.defnName];
	}

	locatable()
	{
		return this._locatable;
	}

	updateForTimerTick(universe, world, venue)
	{
		this.pos.overwriteWith(this.posInCells).multiply(venue.map.cellSizeInPixels);
	}

	// drawable

	draw(universe, world, visualCamera)
	{
		var defn = this.defn(world);
		var visual = defn.visual;
		visualCamera.child = visual;
		visualCamera.draw(universe, world, null, this, universe.display);
	}
}
