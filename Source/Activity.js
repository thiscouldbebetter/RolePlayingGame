
// classes

function Activity(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}

{
	Activity.prototype.defn = function(world)
	{
		return world.activityDefns[this.defnName];
	}
	
	Activity.prototype.perform = function(universe, world, venue, actor)
	{
		this.defn(world).perform(universe, world, venue, actor, this);
	}
}
