
class Mover extends Entity
{
	secondsSinceAnimationStarted: number;

	constructor
	(
		name: string, visual: Visual, activity: Activity, posInCells: Coords
	)
	{
		super
		(
			name,
			[
				new Actor(activity),
				Drawable.fromVisual(visual),
				Locatable.create(),
				new Mappable(posInCells)
			]
		);
	}

	updateForTimerTick(universe: Universe, world: World, venueAsPlace: Place): Entity
	{
		var mappable = Mappable.fromEntity(this);
		mappable.posInCellsNext.overwriteWith
		(
			mappable.posInCells
		).add
		(
			mappable.velInCellsPerTick
		);

		var venue = venueAsPlace as Place2;
		var map = venue.map;
		mappable.posInCellsNextFloor.overwriteWith(mappable.posInCellsNext).floor();
		var mapTerrain =
			map.terrainAtPosInCells(mappable.posInCellsNextFloor);
		if (mapTerrain.blocksMovement == false)
		{
			mappable.posInCells.overwriteWith(mappable.posInCellsNext);
		}

		this.locatable().loc.pos.overwriteWith
		(
			mappable.posInCells
		).multiply
		(
			map.cellSizeInPixels
		);

		this.actor().activity.perform(universe, world, venue, this);

		return this;
	}

	// drawable

	draw(universe: Universe, world: World, visualCamera: VisualCamera): void
	{
		visualCamera.child = this.drawable().visual;
		visualCamera.draw(universe, world, null, this, universe.display);
	}
}
