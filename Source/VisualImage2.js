
function VisualImage2(image, size)
{
	this.image = image;
	this.size = (size == null ? this.image.size : size);
	
	this.sizeHalf = this.size.clone().half();
	
	this.drawPos = new Coords();
}

{
	VisualImage2.manyFromImages = function(images)
	{
		var returnValues = [];
		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = (image == null ? null : new VisualImage2(image));
			returnValues.push(visual);
		}
		return returnValues;
	}

	VisualImage2.prototype.draw = function(universe, world, display, drawable)
	{
		var drawPos = this.drawPos.overwriteWith
		(
			drawable.pos
		).subtract
		(
			this.sizeHalf
		);
	
		display.drawImage(this.image, drawPos);
	}
}
