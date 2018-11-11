
function World(name, portalDefns, activityDefns, venues)
{
	this.name = name;
	this.portalDefns = portalDefns.addLookups("name");
	this.activityDefns = activityDefns.addLookups("name");
	this.venues = venues.addLookups("name");
	
	this.venueNext = this.venues[0];
}
{
	World.demo = function(displaySizeInPixels, cellSizeInPixels)
	{				
		var portalSize = cellSizeInPixels.clone().multiplyScalar(.75);;
		var portalDefns = 
		[
			new PortalDefn
			(
				"PortalTown",
				new VisualPolygon
				(
					[
						new Coords(-.5, 0).multiply(portalSize),
						new Coords(.5, 0).multiply(portalSize),
						new Coords(.5, -.5).multiply(portalSize),
						new Coords(0, -1).multiply(portalSize),
						new Coords(-.5, -.5).multiply(portalSize),
					],
					"LightGreen", "Green"
				)
			),
			new PortalDefn
			(
				"PortalExit",
				new VisualPolygon
				(
					[
						new Coords(-.5, 0).multiply(portalSize),
						new Coords(0, -.5).multiply(portalSize),
						new Coords(0, -.25).multiply(portalSize),
						new Coords(.5, -.25).multiply(portalSize),
						new Coords(.5, .25).multiply(portalSize),
						new Coords(0, .25).multiply(portalSize),
						new Coords(0, .5).multiply(portalSize),
					],
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
							directionToMove.overwriteWithXY(0, 1);
						}
						else if (heading == 1)
						{
							directionToMove.overwriteWithXY(-1, 0);
						}
						else if (heading == 2)
						{
							directionToMove.overwriteWithXY(1, 0);
						}
						else if (heading == 3)
						{
							directionToMove.overwriteWithXY(0, -1);
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
					var inputsActive = inputHelper.inputsActive;
					for (var i = 0; i < inputsActive.length; i++)
					{
						var input = inputsActive[i];
						if (input == null)
						{
							// do nothing
						}
						else if (input.startsWith("Arrow") == true)
						{
							if (input == "ArrowDown")
							{
								actorVel.overwriteWithXY(0, 1);
							}
							else if (input == "ArrowLeft")
							{
								actorVel.overwriteWithXY(-1, 0);
							}
							else if (input == "ArrowRight")
							{
								actorVel.overwriteWithXY(1, 0);
							}
							else if (input == "ArrowUp")
							{
								actorVel.overwriteWithXY(0, -1);
							}
							
							var speedInCellsPerTick = 0.1;
							actorVel.multiplyScalar(speedInCellsPerTick);							
						}
						else if (input == "Enter")
						{
							inputHelper.inputInactivate(input);
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

		var mapTerrainVisualDesert = new MapTerrainVisual(VisualImage.manyFromImages
		([
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
			Image.fromStrings
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
		
		var mapTerrainVisualRock = new MapTerrainVisual(VisualImage.manyFromImages
		([
			Image.fromStrings
			(
				"RockCenter", 
				colors, 
				[ 
					"--AA--AA--AA--AA",
					"-AA--AA--AA--AA-",
					"AA--AA--AA--AA--",
					"A--AA--AA--AA--A",
					"--AA--AA--AA--AA",
					"-AA--AA--AA--AA-",
					"AA--AA--AA--AA--",
					"A--AA--AA--AA--A",
					"--AA--AA--AA--AA",
					"-AA--AA--AA--AA-",
					"AA--AA--AA--AA--",
					"A--AA--AA--AA--A",
					"--AA--AA--AA--AA",
					"-AA--AA--AA--AA-",
					"AA--AA--AA--AA--",
					"A--AA--AA--AA--A",
				]
			),
			Image.fromStrings
			(
				"RockInsideSE", 
				colors, 
				[ 
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"aaaaA--A........",
					"--AA--AA........",
					"-AA--AA-........",
					"AA--AA--........",
					"A--AA--A........",
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
			Image.fromStrings
			(
				"RockInsideSW", 
				colors, 
				[ 
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aaaaa",
					"........--AA--AA",
					"........-AA--AA-",
					"........AA--AA--",
					"........A--AA--A",
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
			Image.fromStrings
			(
				"RockEdgeN", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"aaaaaaaaaaaaaaaa",
					"--AA--AA--AA--AA",
					"-AA--AA--AA--AA-",
					"AA--AA--AA--AA--",
					"A--AA--AA--AA--A",
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
			Image.fromStrings
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
					"--AA--AA........",
					"-AA--AA-........",
					"AA--AA--........",
					"A--AA--A........",
					"aaaa--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
				]
			),
			Image.fromStrings
			(
				"RockEdgeW", 
				colors, 
				[ 
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
				]
			),			
			Image.fromStrings
			(
				"RockDiagonalBackslash", 
				colors, 
				[ 
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aaaaa",
					"........--AA--AA",
					"........-AA--AA-",
					"........AA--AA--",
					"........A--AA--A",
					"--AA--AA........",
					"-AA--AA-........",
					"AA--AA--........",
					"A--AA--A........",
					"aaaa--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
				]
			),
			Image.fromStrings
			(
				"RockOutsideNW", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"...aaaaaaaaaaaaa",
					"...a--AA--AA--AA",
					"...a-AA--AA--AA-",
					"...aAA--AA--AA--",
					"...aA--AA--AA--A",
					"...a--AA-.......",
					"...a-AA--.......",
					"...aAA--A.......",
					"...aA--AA.......",
					"...a--AA-.......",
					"...a-AA--.......",
					"...aAA--A.......",
					"...aA--AA.......",
				]
			),
			Image.fromStrings
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
					"........--AA--AA",
					"........-AA--AA-",
					"........AA--AA--",
					"........A--AA--A",
					"........--AAaaaa",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
				]
			),
			Image.fromStrings
			(
				"RockDiagonalSlash", 
				colors, 
				[ 
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"aaaaA--A........",
					"--AA--AA........",
					"-AA--AA-........",
					"AA--AA--........",
					"A--AA--A........",
					"........--AA--AA",
					"........-AA--AA-",
					"........AA--AA--",
					"........A--AA--A",
					"........--AAaaaa",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
				]
			),
			Image.fromStrings
			(
				"RockEdgeE", 
				colors, 
				[ 
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
				]
			),			
			Image.fromStrings
			(
				"RockOutsideNE", 
				colors, 
				[ 
					"................",
					"................",
					"................",
					"aaaaaaaaaaaaa...",
					"--AA--AA--AAa...",
					"-AA--AA--AA-a...",
					"AA--AA--AA--a...",
					"A--AA--AA--Aa...",
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
				]
			),
			Image.fromStrings
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
					"--AA--AA--AA--AA",
					"-AA--AA--AA--AA-",
					"AA--AA--AA--AA--",
					"A--AA--AA--AA--A",
					"aaaaaaaaaaaaaaaa",
					"................",
					"................",
					"................",
				]
			),
			Image.fromStrings
			(
				"RockOutsideSW", 
				colors, 
				[ 
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
					"...a--AA........",
					"...a-AA-........",
					"...aAA--........",
					"...aA--A........",
					"...a--AA--AA--AA",
					"...a-AA--AA--AA-",
					"...aAA--AA--AA--",
					"...aA--AA--AA--A",
					"...aaaaaaaaaaaaa",
					"................",
					"................",
					"................",
				]
			),
			Image.fromStrings
			(
				"RockOutsideSE", 
				colors, 
				[ 
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
					"........--AAa...",
					"........-AA-a...",
					"........AA--a...",
					"........A--Aa...",
					"--AA--AA--AAa...",
					"-AA--AA--AA-a...",
					"AA--AA--AA--a...",
					"A--AA--AA--Aa...",
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
				new MapTerrainVisual([new VisualImage
				(
					Image.fromStrings
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
					
		var moverVisual = new VisualDirectional
		(
			// visualAtRest
			new VisualGroup
			([
				new VisualPolygon
				(
					[
						new Coords(0, -1).multiply(cellSizeInPixels),
						new Coords(-.5, 0).multiply(cellSizeInPixels),
						new Coords(.5, 0).multiply(cellSizeInPixels),
					],
					"Gray", null
				),
				new VisualOffset
				(
					new Coords(0, -cellSizeInPixels.y / 2),
					new VisualCircle(cellSizeInPixels.x / 4, "Tan", null)
				)
			]),
			// visualsForDirections
			[
				// east
				new VisualAnimation
				(
					4, // framesPerSecond
					[
						new VisualPolygon
						(
							[
								new Coords(.4, -1).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							],
							"Gray", null
						),
						new VisualPolygon
						(
							[
								new Coords(.5, -.9).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							],
							"Gray", null
						),						
					]
				),
				
				// south
				new VisualAnimation
				(
					4, // framesPerSecond
					[
						new VisualGroup
						([
							new VisualPolygon
							(
								[
									new Coords(0, -1).multiply(cellSizeInPixels),
									new Coords(-.5, 0).multiply(cellSizeInPixels),
									new Coords(.5, 0).multiply(cellSizeInPixels),
								],
								"Gray", null
							),
							new VisualOffset
							(
								new Coords(0, -cellSizeInPixels.y * .5),
								new VisualCircle(cellSizeInPixels.x / 4, "Tan", null)
							)
						]),

						new VisualGroup
						([
							new VisualPolygon
							(
								[
									new Coords(0, -.9).multiply(cellSizeInPixels),
									new Coords(-.5, 0).multiply(cellSizeInPixels),
									new Coords(.5, 0).multiply(cellSizeInPixels),
								],
								"Gray", null
							),
							new VisualOffset
							(
								new Coords(0, -cellSizeInPixels.y * .4),							
								new VisualCircle(cellSizeInPixels.x / 4, "Tan", null)
							)
						]),							
					]
				),

				// west
				new VisualAnimation
				(
					4, // framesPerSecond
					[
						new VisualPolygon
						(
							[
								new Coords(-.4, -1).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							],
							"Gray", null
						),
						new VisualPolygon
						(
							[
								new Coords(-.5, -.9).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							],
							"Gray", null
						),						
					]
				),

				// north
				new VisualAnimation
				(
					4, // framesPerSecond
					[
						new VisualPolygon
						(
							[
								new Coords(0, -1).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							],
							"Gray", null
						),
						
						new VisualPolygon
						(
							[
								new Coords(0, -.9).multiply(cellSizeInPixels),
								new Coords(-.5, 0).multiply(cellSizeInPixels),
								new Coords(.5, 0).multiply(cellSizeInPixels),
							],
							"Gray", null
						),							
					]
				),
			]
		);
						
		var venues = 
		[ 
			new Venue
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
			
			new Venue
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
