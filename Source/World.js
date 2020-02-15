
function World(name, portalDefns, activityDefns, venues)
{
	this.name = name;
	this.portalDefns = portalDefns.addLookupsByName();
	this.activityDefns = activityDefns.addLookupsByName();
	this.venues = venues.addLookupsByName();

	this.venueNext = this.venues[0];
}
{
	World.new = function()
	{
		// hack
		var displaySizeInPixels = new Coords(400, 300);
		var cellSizeInPixels = new Coords(16, 16);

		var portalSize = cellSizeInPixels.clone().multiplyScalar(.75);
		var portalDefns = 
		[
			new PortalDefn
			(
				"PortalTown",
				new VisualPolygon
				(
					new Path
					([
						new Coords(-.5, 0).multiply(portalSize),
						new Coords(.5, 0).multiply(portalSize),
						new Coords(.5, -.5).multiply(portalSize),
						new Coords(0, -1).multiply(portalSize),
						new Coords(-.5, -.5).multiply(portalSize),
					]),
					"LightGreen", "Green"
				)
			),
			new PortalDefn
			(
				"PortalExit",
				new VisualPolygon
				(
					new Path
					([
						new Coords(-.5, 0).multiply(portalSize),
						new Coords(0, -.5).multiply(portalSize),
						new Coords(0, -.25).multiply(portalSize),
						new Coords(.5, -.25).multiply(portalSize),
						new Coords(.5, .25).multiply(portalSize),
						new Coords(0, .25).multiply(portalSize),
						new Coords(0, .5).multiply(portalSize),
					]),
					"LightGreen", "Green"
				)
			)
			
		];
		
		var activityDefns = 
		[
			new ActivityDefn
			(
				"DoNothing", 
				function perform(universe, world, venue, actor, activity) 
				{
					// Do nothing.
				} 
			),
			
			new ActivityDefn
			(
				"MoveRandomly",
				function perform(universe, world, venue, actor, activity) 
				{
					while (activity.target == null)
					{
						actor.posInCells.round();
						var directionToMove = new Coords();
						var heading = Math.floor(4 * Math.random());
						if (heading == 0)
						{
							directionToMove.overwriteWithDimensions(0, 1, 0);
						}
						else if (heading == 1)
						{
							directionToMove.overwriteWithDimensions(-1, 0, 0);
						}
						else if (heading == 2)
						{
							directionToMove.overwriteWithDimensions(1, 0, 0);
						}
						else if (heading == 3)
						{
							directionToMove.overwriteWithDimensions(0, -1, 0);
						}
						
						var target = actor.posInCells.clone().add
						(
							directionToMove
						);
						
						if (target.isInRangeMax(venue.map.sizeInCells) == true)
						{
							var terrainAtTarget = venue.map.terrainAtPosInCells(target);
							if (terrainAtTarget.blocksMovement == false)
							{
								activity.target = target;
							}
						}
					}
					
					var target = activity.target;
					
					var displacementToTarget = target.clone().subtract
					(
						actor.posInCells
					);
					
					var distanceToTarget = displacementToTarget.magnitude();

					var speedInCellsPerTick = 0.1;
					
					if (distanceToTarget <= speedInCellsPerTick)
					{
						actor.posInCells.overwriteWith(target);
						activity.target = null;
					}
					else
					{
						var directionToTarget = displacementToTarget.divideScalar
						(
							distanceToTarget
						);
						actor.velInCellsPerTick.overwriteWith
						(
							directionToTarget
						).multiplyScalar
						(
							speedInCellsPerTick
						);
					}
				}
			),
			
			new ActivityDefn
			(
				"UserInputAccept", 
				function perform(universe, world, venue, actor, activity) 
				{
					var actorVel = actor.velInCellsPerTick;
					actorVel.clear();
					var inputHelper = universe.inputHelper;
					var inputsActive = inputHelper.inputsActive();
					for (var i = 0; i < inputsActive.length; i++)
					{
						var inputActive = inputsActive[i];
						var input = (inputActive == null ? null : inputActive.name);
						if (input == null || input.startsWith("Mouse"))
						{
							// Do nothing.
						}
						else if (input.startsWith("Arrow") == true)
						{
							if (input == "ArrowDown")
							{
								actorVel.overwriteWithDimensions(0, 1, 0);
							}
							else if (input == "ArrowLeft")
							{
								actorVel.overwriteWithDimensions(-1, 0, 0);
							}
							else if (input == "ArrowRight")
							{
								actorVel.overwriteWithDimensions(1, 0, 0);
							}
							else if (input == "ArrowUp")
							{
								actorVel.overwriteWithDimensions(0, -1, 0);
							}
							
							var speedInCellsPerTick = 0.1;
							actorVel.multiplyScalar(speedInCellsPerTick);
						}
						else if (input == "Enter")
						{
							inputHelper.inputRemove(input);
							var displacement = new Coords();
							var portals = venue.portals;
							for (var i = 0; i < portals.length; i++)
							{
								var portal = portals[i];
								var distance = displacement.overwriteWith
								(
									portal.pos
								).subtract
								(
									actor.pos
								).magnitude();
								var distanceMax = venue.map.cellSizeInPixels.x;
								if (distance <= distanceMax)
								{
									portal.activate(universe, world, venue, actor);
								}
							}
						}
					}
				} 
			),
			
		];
		
		var colors = Color.Instances()._All;

		var mapTerrainVisualDesert = new MapTerrainVisual(VisualImage2.manyFromImages
		([
			Image2.fromStrings
			(
				"DesertCenter", 
				colors, 
				[ 
					"yywwyywwyywwyyww",
					"ywwyywwyywwyywwy",
					"wwyywwyywwyywwyy",
					"wyywwyywwyywwyyw",
					"yywwyywwyywwyyww",
					"ywwyywwyywwyywwy",
					"wwyywwyywwyywwyy",
					"wyywwyywwyywwyyw",
					"yywwyywwyywwyyww",
					"ywwyywwyywwyywwy",
					"wwyywwyywwyywwyy",
					"wyywwyywwyywwyyw",
					"yywwyywwyywwyyww",
					"ywwyywwyywwyywwy",
					"wwyywwyywwyywwyy",
					"wyywwyywwyywwyyw",
				]
			),
			Image2.fromStrings
			(
				"DesertInsideSE", 
				colors, 
				[ 
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"aaaawyyw........",
					"yywwyyww........",
					"ywwyywwy........",
					"wwyywwyy........",
					"wyywwyyw........",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
				]
			),			
			Image2.fromStrings
			(
				"DesertInsideSW", 
				colors, 
				[ 
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywaaaa",
					"........yywwyyww",
					"........ywwyywwy",
					"........wwyywwyy",
					"........wyywwyyw",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
				]
			),			
			Image2.fromStrings
			(
				"DesertEdgeN", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"aaaaaaaaaaaaaaaa",
					"yywwyywwyywwyyww",
					"ywwyywwyywwyywwy",
					"wwyywwyywwyywwyy",
					"wyywwyywwyywwyyw",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
				]
			),
			Image2.fromStrings
			(
				"DesertInsideNE", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"yywwyyww........",
					"ywwyywwy........",
					"wwyywwyy........",
					"wyywwyyw........",
					"aaaayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
				]
			),
			Image2.fromStrings
			(
				"DesertEdgeW", 
				colors, 
				[ 
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
				]
			),			
			Image2.fromStrings
			(
				"DesertDiagonalBackslash", 
				colors, 
				[ 
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywaaaa",
					"........yywwyyww",
					"........ywwyywwy",
					"........wwyywwyy",
					"........wyywwyyw",
					"yywwyyww........",
					"ywwyywwy........",
					"wwyywwyy........",
					"wyywwyyw........",
					"aaaayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
				]
			),
			Image2.fromStrings
			(
				"DesertOutsideNW", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"...aaaaaaaaaaaaa",
					"...ayywwyywwyyww",
					"...aywwyywwyywwy",
					"...awwyywwyywwyy",
					"...awyywwyywwyyw",
					"...ayywwy.......",
					"...aywwyy.......",
					"...awwyyw.......",
					"...awyyww.......",
					"...ayywwy.......",
					"...aywwyy.......",
					"...awwyyw.......",
					"...awyyww.......",
				]
			),
			Image2.fromStrings
			(
				"DesertInsideNW", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"........yywwyyww",
					"........ywwyywwy",
					"........wwyywwyy",
					"........wyywwyyw",
					"........yywwaaaa",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
				]
			),
			Image2.fromStrings
			(
				"DesertDiagonalSlash", 
				colors, 
				[ 
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"aaaawyyw........",
					"yywwyyww........",
					"ywwyywwy........",
					"wwyywwyy........",
					"wyywwyyw........",
					"........yywwyyww",
					"........ywwyywwy",
					"........wwyywwyy",
					"........wyywwyyw",
					"........yywwaaaa",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
				]
			),
			Image2.fromStrings
			(
				"DesertEdgeE", 
				colors, 
				[ 
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
				]
			),			
			Image2.fromStrings
			(
				"DesertOutsideNE", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"aaaaaaaaaaaaa...",
					"yywwyywwyywwa...",
					"ywwyywwyywwya...",
					"wwyywwyywwyya...",
					"wyywwyywwyywa...",
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
				]
			),
			Image2.fromStrings
			(
				"DesertEdgeS", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"yywwyywwyywwyyww",
					"ywwyywwyywwyywwy",
					"wwyywwyywwyywwyy",
					"wyywwyywwyywwyyw",
					"aaaaaaaaaaaaaaaa",
					"................",
					"................",
					"................",
				]
			),
			Image2.fromStrings
			(
				"DesertOutsideSW", 
				colors, 
				[ 
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
					"...ayyww........",
					"...aywwy........",
					"...awwyy........",
					"...awyyw........",
					"...ayywwyywwyyww",
					"...aywwyywwyywwy",
					"...awwyywwyywwyy",
					"...awyywwyywwyyw",
					"...aaaaaaaaaaaaa",
					"................",
					"................",
					"................",
				]
			),
			Image2.fromStrings
			(
				"DesertOutsideSE", 
				colors, 
				[ 
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
					"........yywwa...",
					"........ywwya...",
					"........wwyya...",
					"........wyywa...",
					"yywwyywwyywwa...",
					"ywwyywwyywwya...",
					"wwyywwyywwyya...",
					"wyywwyywwyywa...",
					"aaaaaaaaaaaaa...",
					"................",
					"................",
					"................",
				]
			),
		]));
		
		var mapTerrainVisualRock = new MapTerrainVisual(VisualImage2.manyFromImages
		([
			Image2.fromStrings
			(
				"RockCenter", 
				colors, 
				[ 
					"@@AA@@AA@@AA@@AA",
					"@AA@@AA@@AA@@AA@",
					"AA@@AA@@AA@@AA@@",
					"A@@AA@@AA@@AA@@A",
					"@@AA@@AA@@AA@@AA",
					"@AA@@AA@@AA@@AA@",
					"AA@@AA@@AA@@AA@@",
					"A@@AA@@AA@@AA@@A",
					"@@AA@@AA@@AA@@AA",
					"@AA@@AA@@AA@@AA@",
					"AA@@AA@@AA@@AA@@",
					"A@@AA@@AA@@AA@@A",
					"@@AA@@AA@@AA@@AA",
					"@AA@@AA@@AA@@AA@",
					"AA@@AA@@AA@@AA@@",
					"A@@AA@@AA@@AA@@A",
				]
			),
			Image2.fromStrings
			(
				"RockInsideSE", 
				colors, 
				[ 
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"aaaaA@@A........",
					"@@AA@@AA........",
					"@AA@@AA@........",
					"AA@@AA@@........",
					"A@@AA@@A........",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
				]
			),			
			Image2.fromStrings
			(
				"RockInsideSW", 
				colors, 
				[ 
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aaaaa",
					"........@@AA@@AA",
					"........@AA@@AA@",
					"........AA@@AA@@",
					"........A@@AA@@A",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
				]
			),			
			Image2.fromStrings
			(
				"RockEdgeN", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"aaaaaaaaaaaaaaaa",
					"@@AA@@AA@@AA@@AA",
					"@AA@@AA@@AA@@AA@",
					"AA@@AA@@AA@@AA@@",
					"A@@AA@@AA@@AA@@A",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
				]
			),
			Image2.fromStrings
			(
				"RockInsideNE", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"@@AA@@AA........",
					"@AA@@AA@........",
					"AA@@AA@@........",
					"A@@AA@@A........",
					"aaaa@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
				]
			),
			Image2.fromStrings
			(
				"RockEdgeW", 
				colors, 
				[ 
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
				]
			),			
			Image2.fromStrings
			(
				"RockDiagonalBackslash", 
				colors, 
				[ 
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aaaaa",
					"........@@AA@@AA",
					"........@AA@@AA@",
					"........AA@@AA@@",
					"........A@@AA@@A",
					"@@AA@@AA........",
					"@AA@@AA@........",
					"AA@@AA@@........",
					"A@@AA@@A........",
					"aaaa@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
				]
			),
			Image2.fromStrings
			(
				"RockOutsideNW", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"...aaaaaaaaaaaaa",
					"...a@@AA@@AA@@AA",
					"...a@AA@@AA@@AA@",
					"...aAA@@AA@@AA@@",
					"...aA@@AA@@AA@@A",
					"...a@@AA@.......",
					"...a@AA@@.......",
					"...aAA@@A.......",
					"...aA@@AA.......",
					"...a@@AA@.......",
					"...a@AA@@.......",
					"...aAA@@A.......",
					"...aA@@AA.......",
				]
			),
			Image2.fromStrings
			(
				"RockInsideNW", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"........@@AA@@AA",
					"........@AA@@AA@",
					"........AA@@AA@@",
					"........A@@AA@@A",
					"........@@AAaaaa",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
				]
			),
			Image2.fromStrings
			(
				"RockDiagonalSlash", 
				colors, 
				[ 
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"aaaaA@@A........",
					"@@AA@@AA........",
					"@AA@@AA@........",
					"AA@@AA@@........",
					"A@@AA@@A........",
					"........@@AA@@AA",
					"........@AA@@AA@",
					"........AA@@AA@@",
					"........A@@AA@@A",
					"........@@AAaaaa",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
				]
			),
			Image2.fromStrings
			(
				"RockEdgeE", 
				colors, 
				[ 
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
				]
			),			
			Image2.fromStrings
			(
				"RockOutsideNE", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"aaaaaaaaaaaaa...",
					"@@AA@@AA@@AAa...",
					"@AA@@AA@@AA@a...",
					"AA@@AA@@AA@@a...",
					"A@@AA@@AA@@Aa...",
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
				]
			),
			Image2.fromStrings
			(
				"RockEdgeS", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"................",
					"@@AA@@AA@@AA@@AA",
					"@AA@@AA@@AA@@AA@",
					"AA@@AA@@AA@@AA@@",
					"A@@AA@@AA@@AA@@A",
					"aaaaaaaaaaaaaaaa",
					"................",
					"................",
					"................",
				]
			),
			Image2.fromStrings
			(
				"RockOutsideSW", 
				colors, 
				[ 
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
					"...a@@AA........",
					"...a@AA@........",
					"...aAA@@........",
					"...aA@@A........",
					"...a@@AA@@AA@@AA",
					"...a@AA@@AA@@AA@",
					"...aAA@@AA@@AA@@",
					"...aA@@AA@@AA@@A",
					"...aaaaaaaaaaaaa",
					"................",
					"................",
					"................",
				]
			),
			Image2.fromStrings
			(
				"RockOutsideSE", 
				colors, 
				[ 
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
					"........@@AAa...",
					"........@AA@a...",
					"........AA@@a...",
					"........A@@Aa...",
					"@@AA@@AA@@AAa...",
					"@AA@@AA@@AA@a...",
					"AA@@AA@@AA@@a...",
					"A@@AA@@AA@@Aa...",
					"aaaaaaaaaaaaa...",
					"................",
					"................",
					"................",
				]
			),
		]));
		
		//mapTerrainVisualDesert = MapTerrainVisual.TestInstance();
				
		var mapTerrains = 
		[
			new MapTerrain
			(
				"Desert", 
				".", 
				false, // blocksMovement
				1, // zLevelForOverlays
				mapTerrainVisualDesert
			),
			new MapTerrain
			(
				"Rocks", 
				"x", 
				true, // blocksMovement 
				2, // zLevelForOverlays
				mapTerrainVisualRock
			),
			
			new MapTerrain
			(
				"Water", 
				"~", 
				true, // blocksMovement 
				0, // zLevelForOverlays
				new MapTerrainVisual([new VisualImage2
				(
					Image2.fromStrings
					(
						"Water", 
						colors, 
						[ 
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",
							"cccccccccccccccc",								
						]
					)
				)])
			)
		];

		var moverVisual = new VisualDirectional2
		(
			// visualAtRest
			new VisualGroup
			([
				new VisualPolygon
				(
					new Path
					([
						new Coords(0, -1).multiply(cellSizeInPixels),
						new Coords(-.5, 0).multiply(cellSizeInPixels),
						new Coords(.5, 0).multiply(cellSizeInPixels),
					]),
					"Gray", null
				),
				new VisualOffset
				(
					new VisualCircle(cellSizeInPixels.x / 4, "Tan", null),
					new Coords(0, -cellSizeInPixels.y / 2)
				)
			]),
			// visualsForDirections
			[
				// east
				new VisualAnimation2
				(
					4, // framesPerSecond
					[
						new VisualPolygon
						(
							new Path
							([
								new Coords(.4, -1).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							]),
							"Gray", null
						),
						new VisualPolygon
						(
							new Path
							([
								new Coords(.5, -.9).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							]),
							"Gray", null
						),
					]
				),
				
				// south
				new VisualAnimation2
				(
					4, // framesPerSecond
					[
						new VisualGroup
						([
							new VisualPolygon
							(
								new Path
								([
									new Coords(0, -1).multiply(cellSizeInPixels),
									new Coords(-.5, 0).multiply(cellSizeInPixels),
									new Coords(.5, 0).multiply(cellSizeInPixels),
								]),
								"Gray", null
							),
							new VisualOffset
							(
								new VisualCircle(cellSizeInPixels.x / 4, "Tan", null),
								new Coords(0, -cellSizeInPixels.y * .5)
							)
						]),

						new VisualGroup
						([
							new VisualPolygon
							(
								new Path
								([
									new Coords(0, -.9).multiply(cellSizeInPixels),
									new Coords(-.5, 0).multiply(cellSizeInPixels),
									new Coords(.5, 0).multiply(cellSizeInPixels),
								]),
								"Gray", null
							),
							new VisualOffset
							(
								new VisualCircle(cellSizeInPixels.x / 4, "Tan", null),
								new Coords(0, -cellSizeInPixels.y * .4)
							)
						]),
					]
				),

				// west
				new VisualAnimation2
				(
					4, // framesPerSecond
					[
						new VisualPolygon
						(
							new Path
							([
								new Coords(-.4, -1).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							]),
							"Gray", null
						),
						new VisualPolygon
						(
							new Path
							([
								new Coords(-.5, -.9).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							]),
							"Gray", null
						),
					]
				),

				// north
				new VisualAnimation2
				(
					4, // framesPerSecond
					[
						new VisualPolygon
						(
							new Path
							([
								new Coords(0, -1).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							]),
							"Gray", null
						),
						
						new VisualPolygon
						(
							new Path
							([
								new Coords(0, -.9).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							]),
							"Gray", null
						),
					]
				),
			]
		);
						
		var venues = 
		[ 
			new Place2
			(
				"Overworld",
				new Camera(displaySizeInPixels, new Coords(0, 0)),
				new Map
				(
					cellSizeInPixels,
					mapTerrains,
					[
						"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
						"~....x.........................~",
						"~..........~~..................~",
						"~.........~~~~.................~",
						"~.........~~~~...xx............~",
						"~..........~~....x...xx........~",
						"~..............xxxx.x.x........~",
						"~................x.............~",
						"~.........~.~.......x..........~",
						"~..........~...................~",
						"~..............................~",
						"~..............................~",
						"~..............................~",
						"~..............................~",
						"~..............................~",
						"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
					]
				),
				[
					new Portal
					(
						"PortalTown", 
						new Coords(17, 9),
						"Lonelytown", // destinationVenueName
						new Coords(1, 4) // destinationPosInCells
					)
				],
				[
					new Mover
					(
						"Player",
						moverVisual,
						new Activity("UserInputAccept", null), 
						new Coords(16, 8) // posInCells
					),
				]
			),
			
			new Place2
			(
				"Lonelytown",
				new Camera(displaySizeInPixels, new Coords(0, 0)),
				new Map
				(
					cellSizeInPixels,
					mapTerrains,
					[
						"xxxxxxxxxxxxxxxx",
						"x..............x",
						"x..............x",
						"x..............x",
						"x..............x",
						"x..............x",
						"x..............x",
						"xxxxxxxxxxxxxxxx",
					]
				),
				[
					new Portal
					(
						"PortalExit", 
						new Coords(1, 4), // posInCells
						"Overworld", // destinationVenueName
						new Coords(17, 9) // destinationPosInCells
					)
				],
				[
					new Mover
					(
						"Stranger",
						moverVisual,
						new Activity("MoveRandomly", null), 
						new Coords(4, 4) // posInCells
					),
				]
			),
			
		];
	
		var returnValue = new World
		(
			"WorldDemo",
			portalDefns,
			activityDefns,
			venues
		);
		
		return returnValue;
	}
	
	// instance methods
	
	World.prototype.initialize = function(universe)
	{
		this.updateForTimerTick(universe);
	}
		
	World.prototype.updateForTimerTick = function(universe)
	{
		if (this.venueNext != null)
		{
			this.venueCurrent = this.venueNext;
			this.venueCurrent.initialize(universe, this);
			this.venueNext = null;
		}
		this.venueCurrent.updateForTimerTick(universe, this);
	}
	
	World.prototype.draw = function(universe)
	{
		this.venueCurrent.draw(universe, this, universe.display);
	}
		
}
