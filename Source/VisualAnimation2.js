
class VisualAnimation2
{
	constructor(framesPerSecond, frames)
	{
		this.framesPerSecond = framesPerSecond;
		this.frames = frames;

		this.durationInSeconds = this.frames.length / this.framesPerSecond;
	}

	draw(universe, world, place, drawable, display)
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
		frameCurrent.draw(universe, world, place, drawable, display);

		var secondsPerTick = universe.timerHelper.millisecondsPerTick / 1000;
		drawable.secondsSinceAnimationStarted += secondsPerTick;
		if (drawable.secondsSinceAnimationStarted >= this.durationInSeconds)
		{
			drawable.secondsSinceAnimationStarted -= this.durationInSeconds;
		}
	}
}
