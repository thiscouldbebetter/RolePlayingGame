
function VisualAnimation2(framesPerSecond, frames)
{
	this.framesPerSecond = framesPerSecond;
	this.frames = frames;

	this.durationInSeconds = this.frames.length / this.framesPerSecond;
}

{
	VisualAnimation2.prototype.draw = function(universe, world, display, drawable)
	{
		if (drawable.secondsSinceAnimationStarted == null)
		{
			drawable.secondsSinceAnimationStarted = 0;
		}
		
		var frameIndexCurrent = Math.floor
		(
			drawable.secondsSinceAnimationStarted * this.framesPerSecond
		);
		
		var frameCurrent = this.frames[frameIndexCurrent];
		frameCurrent.draw(universe, world, display, drawable);

		var secondsPerTick = universe.timerHelper.millisecondsPerTick / 1000;
		drawable.secondsSinceAnimationStarted += secondsPerTick;
		if (drawable.secondsSinceAnimationStarted >= this.durationInSeconds)
		{
			drawable.secondsSinceAnimationStarted -= this.durationInSeconds;
		}
	}
}
