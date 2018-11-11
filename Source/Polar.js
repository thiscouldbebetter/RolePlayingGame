
function Polar(azimuthInTurns, radius)
{
	this.azimuthInTurns = azimuthInTurns;
	this.radius = radius;
}

{
	Polar.RadiansPerTurn = Math.PI * 2.0;

	Polar.prototype.fromCoords = function(coords)
	{
		var azimuthInRadians = Math.atan2(coords.y, coords.x);
		var azimuthInTurns = azimuthInRadians / Polar.RadiansPerTurn;
		if (azimuthInTurns < 0)
		{
			azimuthInTurns += 1;
		}
		this.azimuthInTurns = azimuthInTurns;
		this.radius = coords.magnitude();
		return this;
	}
}
