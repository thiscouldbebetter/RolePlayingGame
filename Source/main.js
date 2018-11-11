function main()
{
	var display = new Display(new Coords(200, 200));
	var mapCellSizeInPixels = new Coords(16, 16);
	var world = World.demo(display.sizeInPixels, mapCellSizeInPixels);
	var universe = new Universe
	(
		10, // timerTicksPerSecond
		display, 
		world
	);
	universe.start();
}
