
function Universe(timerTicksPerSecond, display, world)
{
	this.timerTicksPerSecond = timerTicksPerSecond;
	this.display = display;
	this.world = world;
	
	this.secondsPerTimerTick = 1 / this.timerTicksPerSecond;
}

{
	Universe.prototype.start = function()
	{
		var divMain = document.getElementById("divMain");
		divMain.appendChild(this.display.initialize().canvas);
				
		var timerTicksPerSecond = 10;
		var msPerSecond = 1000;
		var msPerTimerTick = Math.floor(msPerSecond / timerTicksPerSecond);
		this.timer = setInterval
		(
			this.updateForTimerTick.bind(this),
			msPerTimerTick
		);

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize();
		
		this.world.initialize(this);		
	}
	
	Universe.prototype.updateForTimerTick = function()
	{
		this.world.draw(this);		
		this.world.updateForTimerTick(this);
	}
}
