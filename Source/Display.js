
function Display(sizeInPixels)
{
	this.sizeInPixels = sizeInPixels;
	this.fontSizeInPixels = Math.floor(this.sizeInPixels.y / 32);
	
	this.sizeInPixelsHalf = this.sizeInPixels.clone().half();
	
	this.drawPos = new Coords();
}

{
	Display.prototype.initialize = function()
	{
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;
		this.graphics = this.canvas.getContext("2d");
		this.graphics.font = this.fontSizeInPixels + "px sans-serif";
		return this;
	}
	
	Display.prototype.toImage = function(name)
	{
		var dataURL = this.canvas.toDataURL();
		var systemImage = document.createElement("img");
		systemImage.src = dataURL;
		var returnValue = new Image(name, this.sizeInPixels, systemImage);
		return returnValue;
	}
	
	// drawing
	
	Display.prototype.clear = function()
	{
		this.graphics.fillStyle = "White";
		this.graphics.fillRect(0, 0, this.sizeInPixels.x, this.sizeInPixels.y);
		this.graphics.strokeStyle = "Gray";
		this.graphics.strokeRect(0, 0, this.sizeInPixels.x, this.sizeInPixels.y);

		return this;		
	}
		
	Display.prototype.clearRectangle = function(pos, size)
	{
		this.graphics.clearRect(pos.x, pos.y, size.x, size.y);
		return this; 
	}
	
	Display.prototype.drawCircle = function(center, radius, colorFill, colorBorder)
	{
		this.graphics.beginPath();		
		this.graphics.arc(center.x, center.y, radius, 0, Polar.RadiansPerTurn);

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fill();	
		}
		
		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.stroke();	
		}
		
		return this;
	}
	
	Display.prototype.drawImage = function(image, pos)
	{
		this.graphics.drawImage(image.systemImage, pos.x, pos.y);
		
		return this;
	}
	
	Display.prototype.drawImageRegion = function(image, sourcePos, sourceSize, targetPos)
	{
		var targetSize = sourceSize;
	
		this.graphics.drawImage
		(
			image.systemImage, 
			sourcePos.x, sourcePos.y,
			sourceSize.x, sourceSize.y,
			targetPos.x, targetPos.y,
			targetSize.x, targetSize.y
		);
		
		return this;
	}
		
	Display.prototype.drawPolygon = function(vertices, colorFill, colorBorder)
	{
		this.graphics.beginPath();
		var vertex = vertices[0];
		this.graphics.moveTo(vertex.x, vertex.y);
		for (var i = 1; i < vertices.length; i++)
		{
			vertex = vertices[i];
			this.graphics.lineTo(vertex.x, vertex.y);
		}
		this.graphics.closePath();

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fill();	
		}
		
		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.stroke();	
		}
		
		return this;
	}
		
	Display.prototype.drawRectangle = function(pos, size, colorFill, colorBorder)
	{
		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fillRect(pos.x, pos.y, size.x, size.y);
		}
		
		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.strokeRect(pos.x, pos.y, size.x, size.y);
		}
		
		return this;
	}
	
	Display.prototype.drawText = function(text, pos, colorFill, colorBorder)
	{
		if (colorBorder != null)
		{
			this.graphics.strokeStyle = color;
			this.graphics.strokeString(text, pos.x, pos.y);
		}
	
		if (colorFill != null)
		{
			this.graphics.fillStyle = color;
			this.graphics.fillString(text, pos.x, pos.y);
		}
		
		return this;
	}
}
