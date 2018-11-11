
function MapTerrainVisual(children)
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

{
	MapTerrainVisual.TestInstance = function()
	{
		// Helpful for debugging.	
		var radius = 3;
		var size = new Coords(5, 5);
		return new MapTerrainVisual
		(
			[
				new VisualRectangle(size, null, "Black"), // 0000 - center
				new VisualCircle(radius, "Red", "Black"), // 0001 - inside se
				new VisualCircle(radius, "Orange", "Black"), // 0010 - inside sw
				new VisualCircle(radius, "Yellow","Black"), // 0011 - edge n
				new VisualCircle(radius, "Green", "Black"), // 0100 - inside ne
				new VisualCircle(radius, "Blue", "Black"),  // 0101 - edge w
				new VisualCircle(radius, "Violet", "Black"), // 0110 - diagonal
				new VisualCircle(radius, "Gray", "Black"),  // 0111 - outside se
				new VisualRectangle(size, "Red", "Black"), // 1000 - inside nw
				new VisualRectangle(size, "Orange", "Black"), // 1001 - diagonal?
				new VisualRectangle(size, "Yellow", "Black"), // 1010 - edge e
				new VisualRectangle(size, "Green", "Black"), // 1011 - outside sw
				new VisualRectangle(size, "Blue", "Black"), // 1100 - edge s
				new VisualRectangle(size, "Violet", "Black"), // 1101 - outside ne
				new VisualRectangle(size, "Gray", "Black"), // 1110 - outside nw
				new VisualRectangle(size, null, "Red"), // 1111 // Never
			]
		);
	}
	
	MapTerrainVisual.ChildNames = 
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


	MapTerrainVisual.prototype.draw = function(universe, world, display, drawable)
	{
		this.children["Center"].draw(universe, world, display, drawable);
	}
}
