
function VisualText(text)
{
	this.text = text;
}

{
	VisualText.prototype.draw = function(universe, world, display, drawable)
	{
		display.drawText(this.text, drawable.pos);
	}
}
