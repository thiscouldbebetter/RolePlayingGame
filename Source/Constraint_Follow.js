
function Constraint_Follow(target)
{
	this.target = target;
}

{
	Constraint_Follow.prototype.apply = function(constrainable)
	{
		constrainable.pos.overwriteWith(this.target.pos);
	}
}
