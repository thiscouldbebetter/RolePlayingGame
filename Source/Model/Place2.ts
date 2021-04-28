
class Place2 extends Place
{
	camera2: Camera;
	map: MapOfCells2;
	portals: Portal2[];
	movers: Mover[];

	moversToRemove: Mover[];

	constraintCameraFollowPlayer: Constraint_Follow;

	constructor
	(
		name: string, camera2: Camera, map: MapOfCells2,
		portals: Portal2[], movers: Mover[]
	)
	{
		super
		(
			name,
			null, // defnName
			null, // size
			movers // entities
		);

		this.camera2 = camera2;
		this.map = map;
		this.portals = portals;
		this.movers = movers;

		this.moversToRemove = [];
	}

	initialize(universe: Universe, world: World): void
	{
		this.constraintCameraFollowPlayer = new Constraint_Follow
		(
			this.movers[0]
		);

		this.updateForTimerTick(universe, world);
	}

	updateForTimerTick(universe: Universe, world: World)
	{
		for (var i = 0; i < this.portals.length; i++)
		{
			var portal = this.portals[i];
			portal.updateForTimerTick(universe, world, this);
		}

		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.updateForTimerTick(universe, world, this);
		}

		for (var i = 0; i < this.moversToRemove.length; i++)
		{
			var mover = this.moversToRemove[i];
			if (mover == this.constraintCameraFollowPlayer.target)
			{
				this.constraintCameraFollowPlayer.target = null; // this.camera;
			}
			ArrayHelper.remove(this.movers, mover);
		}
		this.moversToRemove.length = 0;
	}

	// drawable

	draw(universe: Universe, world: World2): void
	{
		this.constraintCameraFollowPlayer.apply(this.camera2);

		universe.display.clear();

		var visualCamera = new VisualCamera(this.camera2, null);

		this.map.draw
		(
			universe, universe.world, universe.display, visualCamera
		);

		for (var i = 0; i < this.portals.length; i++)
		{
			var portal = this.portals[i];
			portal.draw(universe, world, visualCamera);
		}

		for (var i = 0; i < this.movers.length; i++)
		{
			var mover = this.movers[i];
			mover.draw(universe, world, visualCamera);
		}
	}

}
