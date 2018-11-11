
function Coords(x, y)
{
	this.x = x;
	this.y = y;
}

{
	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		return this;
	}
	
	Coords.prototype.addXY = function(x, y)
	{
		this.x += x;
		this.y += y;
		return this;
	}
	
	Coords.prototype.ceiling = function()
	{
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}
		
	Coords.prototype.clear = function()
	{
		this.x = 0;
		this.y = 0;
		return this;
	}
	
	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y);
	}
	
	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		return this;
	}
		
	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}
	
	Coords.prototype.floor = function()
	{
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}
		
	Coords.prototype.half = function()
	{
		return this.divideScalar(2);
	}
	
	Coords.prototype.isInRangeMax = function(max)
	{
		var returnValue = 
		(
			this.x >= 0
			&& this.x <= max.x
			&& this.y >= 0
			&& this.y <= max.y
		);
		
		return returnValue;
	}
		
	Coords.prototype.magnitude = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		return this;
	}
	
	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}
	
	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		return this;
	}
	
	Coords.prototype.overwriteWithXY = function(x, y)
	{
		this.x = x;
		this.y = y;
		return this;
	}
	
	Coords.prototype.round = function()
	{
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}
			
	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}
	
	Coords.prototype.trimToRangeMax = function(max)
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > max.x)
		{
			this.x = max.x;
		}
		
		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > max.y)
		{
			this.y = max.y;
		}
		
		return this;
	}
}
