
function VisualDirectional2(visualAtRest, visualsForDirections)
{
	this.visualAtRest = visualAtRest;
	this.visualsForDirections = visualsForDirections;

	this.polar = new Polar();
}

{
	VisualDirectional2.prototype.draw = function(universe, world, display, drawable)
	{
		var visualToDraw = null;
		var vel = drawable.velInCellsPerTick;
		if (vel.magnitude() == 0)
		{
			visualToDraw = this.visualAtRest;
		}
		else
		{
			this.polar.fromCoords(vel);
			var azimuthInTurns = this.polar.azimuthInTurns;
			var directionIndex = Math.floor(azimuthInTurns * this.visualsForDirections.length);
			visualToDraw = this.visualsForDirections[directionIndex];
		}
		visualToDraw.draw(universe, world, display, drawable);
	}
}
