
class MapTerrainVisual
{
	constructor(children)
	{
		this.children = children;

		var childNames = MapTerrainVisual.ChildNames;

		for (var i = 0; i < childNames.length; i++)
		{
			var childName = childNames[i];
			var child = this.children[i];
			this.children[childName] = child;
		}
	}

	static TestInstance()
	{
		// Helpful for debugging.
		var radius = 3;
		var size = new Coords(5, 5);
		var colorBlack = Color.byName("Black");
		return new MapTerrainVisual
		(
			[
				new VisualRectangle(size, null, colorBlack ), // 0000 - center
				new VisualCircle(radius, Color.byName("Red"), colorBlack ), // 0001 - inside se
				new VisualCircle(radius, Color.byName("Orange"), colorBlack ), // 0010 - inside sw
				new VisualCircle(radius, Color.byName("Yellow"), colorBlack ), // 0011 - edge n
				new VisualCircle(radius, Color.byName("Green"), colorBlack ), // 0100 - inside ne
				new VisualCircle(radius, Color.byName("Blue"), colorBlack ),  // 0101 - edge w
				new VisualCircle(radius, Color.byName("Violet"), colorBlack ), // 0110 - diagonal
				new VisualCircle(radius, Color.byName("Gray"), colorBlack ),  // 0111 - outside se
				new VisualRectangle(size, Color.byName("Red"), colorBlack ), // 1000 - inside nw
				new VisualRectangle(size, Color.byName("Orange"), colorBlack ), // 1001 - diagonal?
				new VisualRectangle(size, Color.byName("Yellow"), colorBlack ), // 1010 - edge e
				new VisualRectangle(size, Color.byName("Green"), colorBlack ), // 1011 - outside sw
				new VisualRectangle(size, Color.byName("Blue"), colorBlack ), // 1100 - edge s
				new VisualRectangle(size, Color.byName("Violet"), colorBlack ), // 1101 - outside ne
				new VisualRectangle(size, Color.byName("Gray"), colorBlack ), // 1110 - outside nw
				new VisualRectangle(size, null, Color.byName("Red") ), // 1111 // Never
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

	draw(universe, world, place, drawable, display)
	{
		this.children["Center"].draw(universe, world, place, drawable, display);
	}
}
