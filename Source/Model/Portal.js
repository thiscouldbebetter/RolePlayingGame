"use strict";
class Portal2 extends Entity {
    constructor(defnName, posInCells, destinationVenueName, destinationPosInCells) {
        super(Portal2.name, []);
        this.defnName = defnName;
        this.posInCells = posInCells.addDimensions(.5, .5, 0);
        this.destinationVenueName = destinationVenueName;
        this.destinationPosInCells = destinationPosInCells;
        this.pos = Coords.create();
        this._locatable = Locatable.fromPos(this.pos);
    }
    activate(universe, world, venue, actor) {
        var mover = actor;
        venue.moversToRemove.push(mover);
        var venueNext = world.venuesByName.get(this.destinationVenueName);
        venueNext.movers.splice(0, 0, mover);
        Mappable.fromEntity(mover).posInCells.overwriteWith(this.destinationPosInCells);
        world.venueNext = venueNext;
    }
    defn(world) {
        return world.portalDefnsByName.get(this.defnName);
    }
    locatable() {
        return this._locatable;
    }
    updateForTimerTick(universe, world, venue) {
        this.pos.overwriteWith(this.posInCells).multiply(venue.map.cellSizeInPixels);
        return this;
    }
    // drawable
    draw(universe, world, visualCamera) {
        var defn = this.defn(world);
        var visual = defn.visual;
        visualCamera.child = visual;
        visualCamera.draw(universe, world, null, this, universe.display);
    }
}
