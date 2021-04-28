"use strict";
class Mover extends Entity {
    constructor(name, visual, activity, posInCells) {
        super(name, [
            new Actor(activity),
            Drawable.fromVisual(visual),
            Locatable.create(),
            new Mappable(posInCells)
        ]);
    }
    updateForTimerTick(universe, world, venueAsPlace) {
        var mappable = Mappable.fromEntity(this);
        mappable.posInCellsNext.overwriteWith(mappable.posInCells).add(mappable.velInCellsPerTick);
        var venue = venueAsPlace;
        var map = venue.map;
        mappable.posInCellsNextFloor.overwriteWith(mappable.posInCellsNext).floor();
        var mapTerrain = map.terrainAtPosInCells(mappable.posInCellsNextFloor);
        if (mapTerrain.blocksMovement == false) {
            mappable.posInCells.overwriteWith(mappable.posInCellsNext);
        }
        this.locatable().loc.pos.overwriteWith(mappable.posInCells).multiply(map.cellSizeInPixels);
        this.actor().activity.perform(universe, world, venue, this);
        return this;
    }
    // drawable
    draw(universe, world, visualCamera) {
        visualCamera.child = this.drawable().visual;
        visualCamera.draw(universe, world, null, this, universe.display);
    }
}
