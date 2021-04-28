"use strict";
class Mappable {
    constructor(posInCells) {
        this.posInCells = posInCells;
        this.posInCellsNext = Coords.create();
        this.posInCellsNextFloor = Coords.create();
        this.velInCellsPerTick = Coords.create();
    }
    static fromEntity(entity) {
        return entity.propertiesByName.get(Mappable.name);
    }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
