
function VisualPolygon(vertices, colorFill, colorBorder)
{
	this.vertices = vertices;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
	
	this.verticesTransformed = this.vertices.clone();
}

{
	VisualPolygon.prototype.draw = function(universe, world, display, drawable)
	{
		for (var i = 0; i < this.vertices.length; i++)
		{
			var vertex = this.vertices[i];
			var vertexTransformed = this.verticesTransformed[i];
			
			vertexTransformed.overwriteWith
			(
				vertex
			).add
			(
				drawable.pos
			);
		}
		
		display.drawPolygon(this.verticesTransformed, this.colorFill, this.colorBorder);
	}
}
