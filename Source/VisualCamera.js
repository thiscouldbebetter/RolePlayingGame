
class VisualCamera
{
	constructor(camera, child)
	{
		this.camera = camera;
		this.child = child;

		this.drawablePosOriginal = new Coords();
	}

	draw(universe, world, place, drawable, display)
	{
		this.drawablePosOriginal.overwriteWith(drawable.pos);
		drawable.pos.subtract
		(
			this.camera.pos
		).add
		(
			display.sizeInPixels.clone().half()
		);
		this.child.draw(universe, world, place, drawable, display);
		drawable.pos.overwriteWith(this.drawablePosOriginal);
	}
}
