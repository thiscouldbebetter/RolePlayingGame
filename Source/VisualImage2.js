
class VisualImage2
{
	constructor(image, size)
	{
		this.image = image;
		this.size = (size == null ? this.image.size : size);

		this.sizeHalf = this.size.clone().half();

		this.drawPos = new Coords();
	}

	static manyFromImages(images)
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

	draw(universe, world, place, drawable, display)
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
