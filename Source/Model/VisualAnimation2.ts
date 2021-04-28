
class VisualAnimation2 implements Visual
{
	framesPerSecond: number;
	frames: Visual[];

	durationInSeconds: number;

	constructor(framesPerSecond: number, frames: Visual[])
	{
		this.framesPerSecond = framesPerSecond;
		this.frames = frames;

		this.durationInSeconds = this.frames.length / this.framesPerSecond;
	}

	draw
	(
		universe: Universe, world: World, place: Place, drawableAsEntity: Entity,
		display: Display
	): void
	{
		var drawable = drawableAsEntity as Mover;

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

	// Visual
	clone(): Visual { return this; }
	overwriteWith(other: Visual): Visual { return this; }
	transform(transformToApply: Transform): Transformable { return this; }
}
