
function Color(name, code, componentsRGBA)
{
	this.name = name;
	this.code = code;
	this.componentsRGBA = componentsRGBA;
	
	this.systemColor = 
		"rgba(" 
		+ Math.floor(this.componentsRGBA[0] * Color.ComponentMax) + ","
		+ Math.floor(this.componentsRGBA[1] * Color.ComponentMax) + ","
		+ Math.floor(this.componentsRGBA[2] * Color.ComponentMax) + ","
		+ this.componentsRGBA[3] // ?
		+ ")";	
}

{
	Color.ComponentMax = 255;

	Color.Instances = function()
	{
		if (Color._instances == null)
		{
			Color._instances = new Color_Instances();
		}
		return Color._instances;
	}
	
	function Color_Instances()
	{
		this._Transparent = new Color("Transparent", ".", [0, 0, 0, 0]);
		this.Black 	= new Color("Black", "k", [0, 0, 0, 1]);
		this.Blue 	= new Color("Blue", "b", [0, 0, 1, 1]);
		this.Cyan 	= new Color("Cyan", "c", [0, 1, 1, 1]);	
		this.Gray 	= new Color("Gray", "a", [.5, .5, .5, 1]);
		this.GrayDark = new Color("GrayDark", "A", [.25, .25, .25, 1]);
		this.GrayLight = new Color("GrayLight", "-", [.75, .75, .75, 1]);		
		this.Green 	= new Color("Green", "g", [0, 1, 0, 1]);
		this.Orange = new Color("Orange", "o", [1, .5, 0, 1]);
		this.Red 	= new Color("Red", "r", [1, 0, 0, 1]);
		this.Violet = new Color("Violet", "v", [1, 0, 1, 1]);
		this.White 	= new Color("White", "w", [1, 1, 1, 1]);
		this.Yellow = new Color("Yellow", "y", [1, 1, 0, 1]);		

		this._All = 
		[
			this._Transparent,
			this.Black,
			this.Blue,
			this.Cyan,
			this.Gray,
			this.GrayDark,
			this.GrayLight,
			this.Green,
			this.Orange,
			this.Red,
			this.Violet,
			this.White,
			this.Yellow,
		].addLookups("code");
	}
}
