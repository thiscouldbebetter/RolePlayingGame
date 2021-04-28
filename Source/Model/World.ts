
class World2 extends World
{
	name: string;
	portalDefns: PortalDefn[];
	activityDefns: ActivityDefn[];
	venues: Place2[];

	portalDefnsByName: Map<string, PortalDefn>;
	activityDefnsByName: Map<string, ActivityDefn>;
	venuesByName: Map<string, Place2>;

	venueCurrent: Place2;
	venueNext: Place2; 

	constructor
	(
		name: string, portalDefns: PortalDefn[],
		activityDefns: ActivityDefn[], venues: Place2[]
	)
	{
		super(name, DateTime.now(), World2.defnBuild(activityDefns), []);

		this.name = name;
		this.portalDefns = portalDefns;
		this.portalDefnsByName =
			ArrayHelper.addLookupsByName(this.portalDefns);
		this.activityDefns = activityDefns;
		this.activityDefnsByName =
			ArrayHelper.addLookupsByName(this.activityDefns);
		this.venues = venues;
		this.venuesByName = ArrayHelper.addLookupsByName(this.venues);

		this.venueNext = this.venues[0];
	}

	static create(): World2
	{
		// hack
		var cellSizeInPixels = Coords.fromXY(16, 16);

		var portalDefns = World2.create_PortalDefns(cellSizeInPixels);

		var activityDefns = World2.create_ActivityDefnsBuild();

		var venues = World2.create_VenuesBuild(cellSizeInPixels);

		var returnValue = new World2
		(
			"WorldDemo", portalDefns, activityDefns, venues
		);

		return returnValue;
	}

	static create_ActivityDefnsBuild(): ActivityDefn[]
	{
		var returnValues =
		[
			new ActivityDefn
			(
				"DoNothing", 
				(universe, world, venue, actor) => // perform
				{
					// Do nothing.
				} 
			),

			new ActivityDefn
			(
				"MoveRandomly",
				World2.create_ActivityDefnsBuild_MoveRandomlyPerform
			),

			new ActivityDefn
			(
				"UserInputAccept",
				World2.create_ActivityDefnsBuild_UserInputAcceptPerform
			)
		];

		return returnValues;
	}

	static create_ActivityDefnsBuild_MoveRandomlyPerform
	(
		universe: Universe, world: World, venue: Place, actor: Entity
	) 
	{
		var actorMappable = Mappable.fromEntity(actor);
		var actorPosInCells = actorMappable.posInCells;
		var activity = actor.actor().activity;
		while (activity.target() == null)
		{
			Mappable.fromEntity(actor).posInCells.round();
			var directionToMove = Coords.create();
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

			var targetPos = actorPosInCells.clone().add
			(
				directionToMove
			);

			var map = (venue as Place2).map;
			var mapSizeInCells = map.sizeInCells;
			if (targetPos.isInRangeMax(mapSizeInCells))
			{
				var terrainAtTarget =
					map.terrainAtPosInCells(targetPos);
				if (terrainAtTarget.blocksMovement == false)
				{
					activity.targetSet(targetPos);
				}
			}
		}

		var target = activity.target();

		var displacementToTarget = target.clone().subtract
		(
			actorPosInCells
		);

		var distanceToTarget = displacementToTarget.magnitude();

		var speedInCellsPerTick = 0.1;

		if (distanceToTarget <= speedInCellsPerTick)
		{
			actorPosInCells.overwriteWith(target);
			activity.targetSet(null);
		}
		else
		{
			var directionToTarget = displacementToTarget.divideScalar
			(
				distanceToTarget
			);

			actorMappable.velInCellsPerTick.overwriteWith
			(
				directionToTarget
			).multiplyScalar
			(
				speedInCellsPerTick
			);
		}
	}

	static create_ActivityDefnsBuild_UserInputAcceptPerform
	(
		universe: Universe, worldAsWorld: World, venueAsPlace: Place,
		actor: Entity
	)
	{
		var world = worldAsWorld as World2;
		var venue = venueAsPlace as Place2;

		var actorMappable = Mappable.fromEntity(actor);
		var actorVel = actorMappable.velInCellsPerTick;
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
				var displacement = Coords.create();
				var portals = venue.portals;
				for (var i = 0; i < portals.length; i++)
				{
					var portal = portals[i];
					var distance = displacement.overwriteWith
					(
						portal.pos
					).subtract
					(
						actor.locatable().loc.pos
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

	static create_VenuesBuild(cellSizeInPixels: Coords): Place2[]
	{
		var displaySizeInPixels = Coords.fromXY(400, 300);
		var mapTerrains = World2.create_VenuesBuild_MapTerrainsBuild();
		var moverVisual =
			World2.create_VenuesBuild_MoverVisualBuild(cellSizeInPixels);

		var venues = 
		[ 
			new Place2
			(
				"Overworld",
				new Camera
				(
					displaySizeInPixels,
					null, // focalLength
					Disposition.create(),
					null // entitiesInViewSort
				),
				new MapOfCells2
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
					new Portal2
					(
						"PortalTown", 
						Coords.fromXY(17, 9),
						"Lonelytown", // destinationVenueName
						Coords.fromXY(1, 4) // destinationPosInCells
					)
				],
				[
					new Mover
					(
						"Player",
						moverVisual,
						new Activity("UserInputAccept", null), 
						Coords.fromXY(16, 8) // posInCells
					),
				]
			),

			new Place2
			(
				"Lonelytown",
				new Camera
				(
					displaySizeInPixels,
					null, // focalLength
					Disposition.create(),
					null // entitiesInViewSort
				),
				new MapOfCells2
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
					new Portal2
					(
						"PortalExit", 
						Coords.fromXY(1, 4), // posInCells
						"Overworld", // destinationVenueName
						Coords.fromXY(17, 9) // destinationPosInCells
					)
				],
				[
					new Mover
					(
						"Stranger",
						moverVisual,
						new Activity("MoveRandomly", null), 
						Coords.fromXY(4, 4) // posInCells
					),
				]
			)
		];

		return venues;
	}

	static create_VenuesBuild_MapTerrainsBuild(): MapTerrain[]
	{
		var colors = Color.Instances()._AllByCode;

		var mapTerrainVisualDesert = new MapTerrainVisual(VisualImage2.manyFromImages
		([
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
			Image3.fromStrings
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
					Image3.fromStrings
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

		return mapTerrains;
	}

	static create_PortalDefns(cellSizeInPixels: Coords): PortalDefn[]
	{
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
						Coords.fromXY(-.5, 0).multiply(portalSize),
						Coords.fromXY(.5, 0).multiply(portalSize),
						Coords.fromXY(.5, -.5).multiply(portalSize),
						Coords.fromXY(0, -1).multiply(portalSize),
						Coords.fromXY(-.5, -.5).multiply(portalSize),
					]),
					Color.byName("GreenLight"),
					Color.byName("Green")
				)
			),
			new PortalDefn
			(
				"PortalExit",
				new VisualPolygon
				(
					new Path
					([
						Coords.fromXY(-.5, 0).multiply(portalSize),
						Coords.fromXY(0, -.5).multiply(portalSize),
						Coords.fromXY(0, -.25).multiply(portalSize),
						Coords.fromXY(.5, -.25).multiply(portalSize),
						Coords.fromXY(.5, .25).multiply(portalSize),
						Coords.fromXY(0, .25).multiply(portalSize),
						Coords.fromXY(0, .5).multiply(portalSize),
					]),
					Color.byName("GreenLight"),
					Color.byName("Green")
				)
			)
		];

		return portalDefns;
	}

	static create_VenuesBuild_MoverVisualBuild(cellSizeInPixels: Coords): Visual
	{
		var colorGray = Color.byName("Gray");
		var colorTan = Color.byName("Tan");

		var moverVisual = new VisualDirectional2
		(
			// visualAtRest
			new VisualGroup
			([
				new VisualPolygon
				(
					new Path
					([
						Coords.fromXY(0, -1).multiply(cellSizeInPixels),
						Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
						Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
					]),
					colorGray, null
				),
				new VisualOffset
				(
					VisualCircle.fromRadiusAndColorFill
					(
						cellSizeInPixels.x / 4, colorTan
					),
					Coords.fromXY(0, -cellSizeInPixels.y / 2)
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
								Coords.fromXY(.4, -1).multiply(cellSizeInPixels),
								Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
								Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
							]),
							colorGray, null
						),
						new VisualPolygon
						(
							new Path
							([
								Coords.fromXY(.5, -.9).multiply(cellSizeInPixels),
								Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
								Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
							]),
							colorGray, null
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
									Coords.fromXY(0, -1).multiply(cellSizeInPixels),
									Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
									Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
								]),
								colorGray, null
							),
							new VisualOffset
							(
								VisualCircle.fromRadiusAndColorFill
								(
									cellSizeInPixels.x / 4, colorTan
								),
								Coords.fromXY(0, -cellSizeInPixels.y * .5)
							)
						]),

						new VisualGroup
						([
							new VisualPolygon
							(
								new Path
								([
									Coords.fromXY(0, -.9).multiply(cellSizeInPixels),
									Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
									Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
								]),
								colorGray, null
							),
							new VisualOffset
							(
								VisualCircle.fromRadiusAndColorFill
								(
									cellSizeInPixels.x / 4, colorTan
								),
								Coords.fromXY(0, -cellSizeInPixels.y * .4)
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
								Coords.fromXY(-.4, -1).multiply(cellSizeInPixels),
								Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
								Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
							]),
							colorGray, null
						),
						new VisualPolygon
						(
							new Path
							([
								Coords.fromXY(-.5, -.9).multiply(cellSizeInPixels),
								Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
								Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
							]),
							colorGray, null
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
								Coords.fromXY(0, -1).multiply(cellSizeInPixels),
								Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
								Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
							]),
							colorGray, null
						),
						
						new VisualPolygon
						(
							new Path
							([
								Coords.fromXY(0, -.9).multiply(cellSizeInPixels),
								Coords.fromXY(-.5, 0).multiply(cellSizeInPixels),
								Coords.fromXY(.5, 0).multiply(cellSizeInPixels),
							]),
							colorGray, null
						),
					]
				),
			]
		);

		return moverVisual;
	}

	static defnBuild(activityDefns: ActivityDefn[]): WorldDefn
	{
		return new WorldDefn( [ activityDefns ] );
	}

	// instance methods

	initialize(universe: Universe): void
	{
		this.updateForTimerTick(universe);
	}

	updateForTimerTick(universe: Universe): void
	{
		if (this.venueNext != null)
		{
			this.venueCurrent = this.venueNext;
			this.venueCurrent.initialize(universe, this);
			this.venueNext = null;
		}
		this.venueCurrent.updateForTimerTick(universe, this);
	}

	draw(universe: Universe): void
	{
		this.venueCurrent.draw(universe, this);
	}

	toControl(): ControlBase
	{
		return new ControlNone();
	}
}
