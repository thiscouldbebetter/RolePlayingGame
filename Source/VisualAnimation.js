
function VisualAnimation(framesPerSecond, frames)
{
	this.framesPerSecond = framesPerSecond;
	this.frames = frames;
	
	this.durationInSeconds = this.frames.length / this.framesPerSecond;
}

{
	VisualAnimation.prototype.draw = function(universe, world, display, drawable)
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
		
		drawable.secondsSinceAnimationStarted += universe.secondsPerTimerTick;
		if (drawable.secondsSinceAnimationStarted >= this.durationInSeconds)
		{
			drawable.secondsSinceAnimationStarted -= this.durationInSeconds;
		}
	}
}
