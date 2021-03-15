
class Constraint_Follow
{
	constructor(target)
	{
		this.target = target;
	}

	apply(constrainable)
	{
		constrainable.pos.overwriteWith(this.target.pos);
	}
}
