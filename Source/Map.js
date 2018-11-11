
function Map(cellSizeInPixels, terrains, cellsAsStrings)
{
	this.cellSizeInPixels = cellSizeInPixels;
	this.terrains = terrains.addLookups("code");
	this.cellsAsStrings = cellsAsStrings;
	
	this.sizeInCells = new Coords
	(
		cellsAsStrings[0].length, cellsAsStrings.length
	);
	
	this.sizeInCellsMinusOnes = this.sizeInCells.clone().addXY
	(
		-1, -1
	);
	
	this.cellPos = new Coords();
	this.drawPos = new Coords();
}

{
	Map.prototype.terrainAtPosInCells = function(posInCells)
	{
		var terrainCode = this.cellsAsStrings[posInCells.y][posInCells.x];
		var terrain = this.terrains[terrainCode];
		return terrain;
	}

	// drawable

	Map.prototype.draw = function(universe, world, display, visualCamera)
	{
		var cellPos = this.cellPos;
		var drawPos = this.drawPos;
		var cell = {};
		cell.pos = drawPos;
		cell.velInCellsPerTick = new Coords(0, 0); // hack
		var halves = new Coords(.5, .5);
		var ones = new Coords(1, 1);
		
		var camera = visualCamera.camera;
		var cameraPos = camera.pos;
		var cameraViewSizeHalf = camera.viewSizeHalf;
		var cellPosMin = cameraPos.clone().subtract
		(
			cameraViewSizeHalf
		).divide
		(
			this.cellSizeInPixels
		).floor().trimToRangeMax
		(
			this.sizeInCellsMinusOnes
		);
		var cellPosMax = cameraPos.clone().add
		(
			cameraViewSizeHalf
		).divide
		(
			this.cellSizeInPixels
		).ceiling().trimToRangeMax
		(
			this.sizeInCellsMinusOnes
		);
						
		for (var y = cellPosMin.y; y <= cellPosMax.y; y++)
		{
			cellPos.y = y;
			
			for (var x = cellPosMin.x; x <= cellPosMax.x; x++)
			{
				cellPos.x = x;
				
				drawPos.overwriteWith
				(
					cellPos
				).add(halves).multiply
				(
					this.cellSizeInPixels
				);
				
				var terrain = this.terrainAtPosInCells(cellPos);
				var terrainVisual = terrain.visual;
				visualCamera.child = terrainVisual;				
				visualCamera.draw
				(
					universe, world, display, cell
				);
			}
		}

		var sizeDiminished = this.sizeInCellsMinusOnes.clone().addXY(-1, -1);
		
		var cornerPosMin = cellPosMin.clone().addXY(-1, -1).trimToRangeMax(this.sizeInCells);
		var cornerPosMax = cellPosMax.trimToRangeMax(sizeDiminished);
		var cornerPos = new Coords();
		var neighborOffsets = 
		[
			new Coords(0, 0),		
			new Coords(1, 0),
			new Coords(0, 1),			
			new Coords(1, 1),
		];
		var neighborPos = new Coords();
		var neighborTerrains = [];
				
		for (var y = cornerPosMin.y; y <= cornerPosMax.y; y++)
		{
			cornerPos.y = y;
			
			for (var x = cornerPosMin.x; x <= cornerPosMax.x; x++)
			{
				cornerPos.x = x;
				
				var neighborOffset = neighborOffsets[0];
				neighborPos.overwriteWith(cornerPos).add(neighborOffset);
				var terrainHighestSoFar = this.terrainAtPosInCells(neighborPos);
				
				for (var n = 1; n < neighborOffsets.length; n++)
				{
					var neighborOffset = neighborOffsets[n];
					neighborPos.overwriteWith(cornerPos).add(neighborOffset);
					var neighborTerrain = this.terrainAtPosInCells(neighborPos);
					var zLevelDifference = 
						neighborTerrain.zLevelForOverlays 
						- terrainHighestSoFar.zLevelForOverlays;
					if (zLevelDifference > 0)
					{
						terrainHighestSoFar = neighborTerrain;
					}
				}
				
				var terrainHighest = terrainHighestSoFar;
				var visualChildIndexSoFar = 0;
		
				for (var n = 0; n < neighborOffsets.length; n++)
				{
					var neighborOffset = neighborOffsets[n];
					neighborPos.overwriteWith(cornerPos).add(neighborOffset);
					var neighborTerrain = this.terrainAtPosInCells(neighborPos);
					if (neighborTerrain != terrainHighest)
					{
						visualChildIndexSoFar |= (1 << n);
					}
				}
				
				if (visualChildIndexSoFar > 0)
				{
					drawPos.overwriteWith
					(
						cornerPos
					).add(ones).multiply
					(
						this.cellSizeInPixels
					);
					
					var terrainVisual = terrainHighest.visual.children[visualChildIndexSoFar];
					if (terrainVisual != null) // hack
					{
						visualCamera.child = terrainVisual;				
						visualCamera.draw
						(
							universe, world, display, cell
						);
					}
				}
			}
		}
	}
}
