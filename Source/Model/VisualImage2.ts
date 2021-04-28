
class VisualImage2 implements Visual
{
	image: Image3;
	size: Coords;

	sizeHalf: Coords;
	drawPos: Coords;

	constructor(image: Image3)
	{
		this.image = image;

		var size = image.size;
		this.size = (size == null ? this.image.size : size);

		this.sizeHalf = this.size.clone().half();

		this.drawPos = Coords.create();
	}

	static manyFromImages(images: Image3[]): VisualImage2[]
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

	draw
	(
		universe: Universe, world: World, place: Place, drawable: Entity,
		display: Display
	): void
	{
		var drawablePos = drawable.locatable().loc.pos;
		var drawPos = this.drawPos.overwriteWith
		(
			drawablePos
		).subtract
		(
			this.sizeHalf
		);

		var image = this.image.toImage2(universe);
		display.drawImage(image, drawPos);
	}

	// Clonable.
	clone(): VisualImage2 { return this; }
	overwriteWith(other: VisualImage2): VisualImage2 { return this; }

	// Transformable.
	transform(transformToApply: Transform): VisualImage2 { return this; }

}
