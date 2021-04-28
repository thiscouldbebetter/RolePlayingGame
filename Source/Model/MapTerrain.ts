
class MapTerrain
{
	name: string;
	code: string;
	blocksMovement: boolean;
	zLevelForOverlays: number;
	visual: Visual;

	constructor
	(
		name: string, code: string, blocksMovement: boolean,
		zLevelForOverlays: number, visual: Visual
	)
	{
		this.name = name;
		this.code = code;
		this.blocksMovement = blocksMovement;
		this.zLevelForOverlays = zLevelForOverlays;
		this.visual = visual;
	}
}
