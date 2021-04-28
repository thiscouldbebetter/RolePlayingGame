
class Mappable implements EntityProperty
{
	posInCells: Coords;

	posInCellsNext: Coords;
	posInCellsNextFloor: Coords;
	velInCellsPerTick: Coords;

	constructor(posInCells: Coords)
	{
		this.posInCells = posInCells;

		this.posInCellsNext = Coords.create();
		this.posInCellsNextFloor = Coords.create();
		this.velInCellsPerTick = Coords.create();
	}

	static fromEntity(entity: Entity): Mappable
	{
		return entity.propertiesByName.get(Mappable.name) as Mappable;
	}

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
