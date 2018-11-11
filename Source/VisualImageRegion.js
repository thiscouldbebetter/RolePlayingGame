
function VisualImageRegion(image, offset, size)
{
	this.image = image;
	this.offset = offset;
	this.size = size;
	
	this.sizeHalf = this.size.clone().half();
	
	this.drawPos = new Coords();
}

{
	VisualImageRegion.prototype.draw = function(universe, world, display, drawable)
	{		
		var drawPos = this.drawPos.overwriteWith
		(
			drawable.pos
		).subtract
		(
			this.sizeHalf
		);
	
		display.drawImageRegion(this.image, this.offset, this.size, drawPos);
	}
}
