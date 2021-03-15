
class Mover
{
	constructor(name, visual, activity, posInCells)
	{
		this.name = name;
		this.visual = visual;
		this.activity = activity;
		this.posInCells = posInCells;

		this.pos = new Coords();
		this.posInCellsNext = new Coords();
		this.posInCellsNextFloor = new Coords();
		this.velInCellsPerTick = new Coords(0, 0);

		this._locatable = new Locatable(new Disposition(this.pos));
	}

	locatable()
	{
		return this._locatable;
	}

	updateForTimerTick(universe, world, venue)
	{
		this.posInCellsNext.overwriteWith
		(
			this.posInCells
		).add
		(
			this.velInCellsPerTick
		);

		var map = venue.map;
		this.posInCellsNextFloor.overwriteWith(this.posInCellsNext).floor();
		var mapTerrain = map.terrainAtPosInCells(this.posInCellsNextFloor);
		if (mapTerrain.blocksMovement == false)
		{
			this.posInCells.overwriteWith(this.posInCellsNext);
		}

		this.pos.overwriteWith
		(
			this.posInCells
		).multiply
		(
			map.cellSizeInPixels
		);

		this.activity.perform(universe, world, venue, this);
	}

	// drawable

	draw(universe, world, visualCamera)
	{
		visualCamera.child = this.visual;
		visualCamera.draw(universe, world, null, this, universe.display);
	}
}
