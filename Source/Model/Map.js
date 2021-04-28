"use strict";
class MapOfCells2 {
    constructor(cellSizeInPixels, terrains, cellsAsStrings) {
        this.cellSizeInPixels = cellSizeInPixels;
        this.terrains = terrains;
        this.terrainsByCode =
            ArrayHelper.addLookups(this.terrains, x => x.code);
        this.cellsAsStrings = cellsAsStrings;
        this.sizeInCells = Coords.fromXY(cellsAsStrings[0].length, cellsAsStrings.length);
        this.sizeInCellsMinusOnes = this.sizeInCells.clone().addDimensions(-1, -1, 0);
        this.cellPos = Coords.create();
    }
    terrainAtPosInCells(posInCells) {
        var terrainCode = this.cellsAsStrings[posInCells.y][posInCells.x];
        var terrain = this.terrainsByCode.get(terrainCode);
        return terrain;
    }
    // drawable
    draw(universe, world, display, visualCamera) {
        var cell = new MapCell2();
        var drawPos = cell.locatable().loc.pos;
        var halves = Coords.fromXY(.5, .5);
        var ones = Coords.fromXY(1, 1);
        var camera = visualCamera.camera;
        var cameraPos = camera.loc.pos;
        var cameraViewSizeHalf = camera.viewSizeHalf;
        var cellPosMin = cameraPos.clone().subtract(cameraViewSizeHalf).divide(this.cellSizeInPixels).floor().trimToRangeMax(this.sizeInCellsMinusOnes);
        var cellPosMax = cameraPos.clone().add(cameraViewSizeHalf).divide(this.cellSizeInPixels).ceiling().trimToRangeMax(this.sizeInCellsMinusOnes);
        var cellPos = this.cellPos;
        for (var y = cellPosMin.y; y <= cellPosMax.y; y++) {
            cellPos.y = y;
            for (var x = cellPosMin.x; x <= cellPosMax.x; x++) {
                cellPos.x = x;
                drawPos.overwriteWith(cellPos).add(halves).multiply(this.cellSizeInPixels);
                var terrain = this.terrainAtPosInCells(cellPos);
                var terrainVisual = terrain.visual;
                visualCamera.child = terrainVisual;
                visualCamera.draw(universe, world, null, cell, display);
            }
        }
        var sizeDiminished = this.sizeInCellsMinusOnes.clone().addDimensions(-1, -1, 0);
        var cornerPosMin = cellPosMin.clone().addDimensions(-1, -1, 0).trimToRangeMax(this.sizeInCells);
        var cornerPosMax = cellPosMax.trimToRangeMax(sizeDiminished);
        var cornerPos = Coords.create();
        var neighborOffsets = [
            Coords.fromXY(0, 0),
            Coords.fromXY(1, 0),
            Coords.fromXY(0, 1),
            Coords.fromXY(1, 1)
        ];
        var neighborPos = Coords.create();
        for (var y = cornerPosMin.y; y <= cornerPosMax.y; y++) {
            cornerPos.y = y;
            for (var x = cornerPosMin.x; x <= cornerPosMax.x; x++) {
                cornerPos.x = x;
                var neighborOffset = neighborOffsets[0];
                neighborPos.overwriteWith(cornerPos).add(neighborOffset);
                var terrainHighestSoFar = this.terrainAtPosInCells(neighborPos);
                for (var n = 1; n < neighborOffsets.length; n++) {
                    var neighborOffset = neighborOffsets[n];
                    neighborPos.overwriteWith(cornerPos).add(neighborOffset);
                    var neighborTerrain = this.terrainAtPosInCells(neighborPos);
                    var zLevelDifference = neighborTerrain.zLevelForOverlays
                        - terrainHighestSoFar.zLevelForOverlays;
                    if (zLevelDifference > 0) {
                        terrainHighestSoFar = neighborTerrain;
                    }
                }
                var terrainHighest = terrainHighestSoFar;
                var visualChildIndexSoFar = 0;
                for (var n = 0; n < neighborOffsets.length; n++) {
                    var neighborOffset = neighborOffsets[n];
                    neighborPos.overwriteWith(cornerPos).add(neighborOffset);
                    var neighborTerrain = this.terrainAtPosInCells(neighborPos);
                    if (neighborTerrain != terrainHighest) {
                        visualChildIndexSoFar |= (1 << n);
                    }
                }
                if (visualChildIndexSoFar > 0) {
                    drawPos.overwriteWith(cornerPos).add(ones).multiply(this.cellSizeInPixels);
                    var terrainHighestVisual = terrainHighest.visual;
                    var terrainVisual = terrainHighestVisual.children[visualChildIndexSoFar];
                    if (terrainVisual != null) // hack
                     {
                        visualCamera.child = terrainVisual;
                        visualCamera.draw(universe, world, null, cell, display);
                    }
                }
            }
        }
    }
}
class MapCell2 extends Entity {
    constructor() {
        super(MapCell2.name, [
            Locatable.create(),
            new Mappable(Coords.create())
        ]);
    }
}
