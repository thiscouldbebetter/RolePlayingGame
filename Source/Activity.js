
// classes

class Activity
{
	constructor(defnName, target)
	{
		this.defnName = defnName;
		this.target = target;
	}

	defn(world)
	{
		return world.activityDefns[this.defnName];
	}

	perform(universe, world, venue, actor)
	{
		this.defn(world).perform(universe, world, venue, actor, this);
	}
}
