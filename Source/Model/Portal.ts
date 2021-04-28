
class Portal2 extends Entity
{
	defnName: string;
	posInCells: Coords;
	destinationVenueName: string;
	destinationPosInCells: Coords;

	pos: Coords;
	_locatable: Locatable;

	constructor
	(
		defnName: string, posInCells: Coords, destinationVenueName: string,
		destinationPosInCells: Coords
	)
	{
		super(Portal2.name, []);

		this.defnName = defnName;
		this.posInCells = posInCells.addDimensions(.5, .5, 0);
		this.destinationVenueName = destinationVenueName;
		this.destinationPosInCells = destinationPosInCells;

		this.pos = Coords.create();
		this._locatable = Locatable.fromPos(this.pos);
	}

	activate(universe: Universe, world: World2, venue: Place2, actor: Entity): void
	{
		var mover = actor as Mover;
		venue.moversToRemove.push(mover);
		var venueNext = world.venuesByName.get(this.destinationVenueName);
		venueNext.movers.splice(0, 0, mover);
		Mappable.fromEntity(mover).posInCells.overwriteWith
		(
			this.destinationPosInCells
		);
		world.venueNext = venueNext;
	}

	defn(world: World2): PortalDefn
	{
		return world.portalDefnsByName.get(this.defnName);
	}

	locatable(): Locatable
	{
		return this._locatable;
	}

	updateForTimerTick(universe: Universe, world: World, venue: Place2): Entity
	{
		this.pos.overwriteWith(this.posInCells).multiply(venue.map.cellSizeInPixels);
		return this;
	}

	// drawable

	draw(universe: Universe, world: World2, visualCamera: VisualCamera)
	{
		var defn = this.defn(world);
		var visual = defn.visual;
		visualCamera.child = visual;
		visualCamera.draw(universe, world, null, this, universe.display);
	}
}
