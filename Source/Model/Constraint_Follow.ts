
class Constraint_Follow
{
	target: any;

	constructor(target: any)
	{
		this.target = target;
	}

	apply(constrainable: any): void
	{
		if (this.target != null)
		{
			var targetPos = this.target.locatable().loc.pos;
			constrainable.loc.pos.overwriteWith(targetPos);
		}
	}
}
