function mainOld()
{
	var display = new Display([new Coords(200, 200)]);
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

function main()
{
	// It may be necessary to clear local storage to prevent errors on
	// deserialization of existing saved items after the schema changes.
	// localStorage.clear();

	var mediaLibrary = new MediaLibrary.fromFileNames
	(
		"../Content/",
		[ "Title.png", ],
		[ "Sound.wav" ],
		[ "Music.mp3" ],
		[ "Movie.webm" ],
		[ "Font.ttf" ],
		[ "Conversation.json", "Instructions.txt" ]
	);

	var displaySizesAvailable =
	[
		new Coords(400, 300, 1),
		new Coords(640, 480, 1),
		new Coords(800, 600, 1),
		new Coords(1200, 900, 1),
		// Wrap.
		new Coords(200, 150, 1),
	];

	var display = new Display
	(
		displaySizesAvailable,
		"Font", // fontName
		10, // fontHeightInPixels
		"Gray", "White" // colorFore, colorBack
	);

	var timerHelper = new TimerHelper(20);

	var universe = Universe.new
	(
		"Role-Playing Game", "0.0.0-20200215-1050", timerHelper, display, mediaLibrary, null
	);
	universe.initialize
	(
		function() { universe.start(); }
	);
}
