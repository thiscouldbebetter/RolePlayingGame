
// extensions

function ArrayExtensions()
{
	// Extension class.
}

{
	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var key = element[keyName];
			this[key] = element;
		}
		return this;
	}
	
	Array.prototype.clone = function()
	{
		var returnValues = [];
		for (var i = 0; i < this.length; i++)
		{
			var element = this[i];
			var elementCloned = element.clone();
			returnValues.push(elementCloned);
		}
		return returnValues;
	}
	
	Array.prototype.remove = function(element)
	{
		var elementIndex = this.indexOf(element);
		if (elementIndex >= 0)
		{
			this.splice(elementIndex, 1);
		}
		return this;
	}
}
