"use strict";
class VisualDirectional2 {
    constructor(visualAtRest, visualsForDirections) {
        this.visualAtRest = visualAtRest;
        this.visualsForDirections = visualsForDirections;
        this.polar = Polar.create();
    }
    draw(universe, world, place, drawable, display) {
        var visualToDraw = null;
        var vel = Mappable.fromEntity(drawable).velInCellsPerTick;
        if (vel.magnitude() == 0) {
            visualToDraw = this.visualAtRest;
        }
        else {
            this.polar.fromCoords(vel);
            var azimuthInTurns = this.polar.azimuthInTurns;
            var directionIndex = Math.floor(azimuthInTurns * this.visualsForDirections.length);
            visualToDraw = this.visualsForDirections[directionIndex];
        }
        visualToDraw.draw(universe, world, place, drawable, display);
    }
    // Visual
    clone() { return this; }
    overwriteWith(other) { return this; }
    transform(transformToApply) { return this; }
}
