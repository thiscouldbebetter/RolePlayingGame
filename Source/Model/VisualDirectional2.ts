
class VisualDirectional2 implements Visual
{
	visualAtRest: Visual;
	visualsForDirections: Visual[];

	polar: Polar;

	constructor(visualAtRest: Visual, visualsForDirections: Visual[])
	{
		this.visualAtRest = visualAtRest;
		this.visualsForDirections = visualsForDirections;

		this.polar = Polar.create();
	}

	draw
	(
		universe: Universe, world: World, place: Place, drawable: Entity,
		display: Display
	): void
	{
		var visualToDraw = null;
		var vel = Mappable.fromEntity(drawable).velInCellsPerTick;
		if (vel.magnitude() == 0)
		{
			visualToDraw = this.visualAtRest;
		}
		else
		{
			this.polar.fromCoords(vel);
			var azimuthInTurns = this.polar.azimuthInTurns;
			var directionIndex = Math.floor(azimuthInTurns * this.visualsForDirections.length);
			visualToDraw = this.visualsForDirections[directionIndex];
		}
		visualToDraw.draw(universe, world, place, drawable, display);
	}

	// Visual
	clone(): Visual { return this; }
	overwriteWith(other: Visual): Visual { return this; }
	transform(transformToApply: Transform): Transformable { return this; }
}
