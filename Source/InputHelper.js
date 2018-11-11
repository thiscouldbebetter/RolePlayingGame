
function InputHelper()
{
	this.inputsPressed = [];
	this.inputsActive = [];
}

{
	InputHelper.prototype.initialize = function()
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
	}
	
	InputHelper.prototype.inputActivate = function(input)
	{
		if (this.inputsActive[input] == null)
		{
			this.inputsActive[input] = input;
			this.inputsActive.push(input);
		}	
	}	
	
	InputHelper.prototype.inputAdd = function(input)
	{
		if (this.inputsPressed[input] == null)
		{
			this.inputsPressed[input] = input;
			this.inputsPressed.push(input);
			this.inputActivate(input);
		}	
	}
	
	InputHelper.prototype.inputInactivate = function(input)
	{
		if (this.inputsActive[input] != null)
		{
			delete this.inputsActive[input];
			this.inputsActive.remove(input);
		}
	}
	
	InputHelper.prototype.inputRemove = function(input)
	{
		this.inputInactivate(input);
		if (this.inputsPressed[input] != null)
		{
			delete this.inputsPressed[input];
			this.inputsPressed.remove(input);
		}
	}
	
	// events
	
	InputHelper.prototype.handleEventKeyDown = function(event)
	{
		this.inputAdd(event.key);
	}
	
	InputHelper.prototype.handleEventKeyUp = function(event)
	{
		this.inputRemove(event.key);
	}	
}
