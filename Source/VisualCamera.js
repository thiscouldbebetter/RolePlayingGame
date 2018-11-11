
function VisualCamera(camera, child)
{
	this.camera = camera;
	this.child = child;
	
	this.drawablePosOriginal = new Coords();
}

{
	VisualCamera.prototype.draw = function(universe, world, display, drawable)
	{
		this.drawablePosOriginal.overwriteWith(drawable.pos);
		drawable.pos.subtract
		(
			this.camera.pos
		).add
		(
			display.sizeInPixelsHalf
		);
		this.child.draw(universe, world, display, drawable);
		drawable.pos.overwriteWith(this.drawablePosOriginal);
	}
}
