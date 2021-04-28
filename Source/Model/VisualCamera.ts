
class VisualCamera
{
	camera: Camera;
	child: Visual;

	drawablePosOriginal: Coords;

	constructor(camera: Camera, child: Visual)
	{
		this.camera = camera;
		this.child = child;

		this.drawablePosOriginal = Coords.create();
	}

	draw
	(
		universe: Universe, world: World, place: Place, drawable: Entity,
		display: Display
	): void
	{
		var drawablePos = drawable.locatable().loc.pos
		this.drawablePosOriginal.overwriteWith(drawablePos);
		drawablePos.subtract
		(
			this.camera.loc.pos
		).add
		(
			display.sizeInPixels.clone().half()
		);
		this.child.draw(universe, world, place, drawable, display);
		drawablePos.overwriteWith(this.drawablePosOriginal);
	}
}
