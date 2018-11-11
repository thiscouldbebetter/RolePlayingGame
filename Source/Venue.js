
function Venue(name, camera, map, portals, movers)
{
	this.name = name;
	this.camera = camera;
	this.map = map;
	this.portals = portals;
	this.movers = movers;
	
	this.moversToRemove = [];	
}

{
	Venue.prototype.initialize = function(universe, world)
	{
		this.constraintCameraFollowPlayer = new Constraint_Follow
		(
			this.movers[0]
		);

		this.updateForTimerTick(universe, world);
	}

	Venue.prototype.updateForTimerTick = function(universe, world)
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
				this.constraintCameraFollowPlayer.target = this.camera;
			}
			this.movers.remove(mover);
		}		
		this.moversToRemove.length = 0;
	}
	
	// drawable
	
	Venue.prototype.draw = function(universe, world)
	{
		this.constraintCameraFollowPlayer.apply(this.camera);
	
		universe.display.clear();
	
		var visualCamera = new VisualCamera(this.camera);
		
		this.map.draw(universe, this, universe.display, visualCamera);
				
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
