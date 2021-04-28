
class MapTerrainVisual implements Visual
{
	children: Visual[];

	childrenByName: Map<string, Visual>;

	constructor(children: Visual[])
	{
		this.children = children;

		var childNames = MapTerrainVisual.ChildNames;

		this.childrenByName = new Map<string, Visual>();
		for (var i = 0; i < childNames.length; i++)
		{
			var childName = childNames[i];
			var child = this.children[i];
			this.childrenByName.set(childName, child);
		}
	}

	static TestInstance()
	{
		// Helpful for debugging.
		var radius = 3;
		var size = Coords.fromXY(5, 5);
		var colorBlack = Color.byName("Black");
		return new MapTerrainVisual
		(
			[
				VisualRectangle.fromSizeAndColorFill(size, colorBlack ), // 0000 - center
				VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Red") ), // 0001 - inside se
				VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Orange") ), // 0010 - inside sw
				VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Yellow") ), // 0011 - edge n
				VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Green") ), // 0100 - inside ne
				VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Blue") ),  // 0101 - edge w
				VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Violet") ), // 0110 - diagonal
				VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Gray") ),  // 0111 - outside se
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("Red") ), // 1000 - inside nw
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("Orange") ), // 1001 - diagonal?
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("Yellow") ), // 1010 - edge e
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("Green") ), // 1011 - outside sw
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("Blue") ), // 1100 - edge s
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("Violet") ), // 1101 - outside ne
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("Gray") ), // 1110 - outside nw
				VisualRectangle.fromSizeAndColorFill(size, Color.byName("White") ), // 1111 // Never
			]
		);
	}

	static ChildNames = 
	[
		"Center",
		"InsideSE",
		"InsideSW",
		"EdgeN",
		"InsideNE",
		"EdgeW",
		"DiagonalSlash",
		"OutsideSE",
		"InsideNW",
		"DiagonalBackslash",
		"EdgeE",
		"OutsideSW",
		"EdgeS",
		"OutsideNE",
		"OutsideNW"
	]

	draw
	(
		universe: Universe, world: World, place: Place, drawable: Entity,
		display: Display
	): void
	{
		var childCenter = this.childrenByName.get("Center");
		childCenter.draw(universe, world, place, drawable, display);
	}

	// Clonable.
	clone(): MapTerrainVisual { return this; }
	overwriteWith(other: MapTerrainVisual): MapTerrainVisual { return this; }

	// Transformable.
	transform(transformToApply: Transform): MapTerrainVisual { return this; }
}
