
function VisualOffset(offset, child)
{
	this.offset = offset;
	this.child = child;
	
	this.drawablePosOriginal = new Coords();
}

{
	VisualOffset.prototype.draw = function(universe, world, display, drawable)
	{
		this.drawablePosOriginal.overwriteWith(drawable.pos);
		drawable.pos.add(this.offset);
		this.child.draw(universe, world, display, drawable);
		drawable.pos.overwriteWith(this.drawablePosOriginal);
	}
}
