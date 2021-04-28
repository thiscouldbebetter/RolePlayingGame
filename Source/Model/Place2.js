"use strict";
class Place2 extends Place {
    constructor(name, camera2, map, portals, movers) {
        super(name, null, // defnName
        null, // size
        movers // entities
        );
        this.camera2 = camera2;
        this.map = map;
        this.portals = portals;
        this.movers = movers;
        this.moversToRemove = [];
    }
    initialize(universe, world) {
        this.constraintCameraFollowPlayer = new Constraint_Follow(this.movers[0]);
        this.updateForTimerTick(universe, world);
    }
    updateForTimerTick(universe, world) {
        for (var i = 0; i < this.portals.length; i++) {
            var portal = this.portals[i];
            portal.updateForTimerTick(universe, world, this);
        }
        for (var i = 0; i < this.movers.length; i++) {
            var mover = this.movers[i];
            mover.updateForTimerTick(universe, world, this);
        }
        for (var i = 0; i < this.moversToRemove.length; i++) {
            var mover = this.moversToRemove[i];
            if (mover == this.constraintCameraFollowPlayer.target) {
                this.constraintCameraFollowPlayer.target = null; // this.camera;
            }
            ArrayHelper.remove(this.movers, mover);
        }
        this.moversToRemove.length = 0;
    }
    // drawable
    draw(universe, world) {
        this.constraintCameraFollowPlayer.apply(this.camera2);
        universe.display.clear();
        var visualCamera = new VisualCamera(this.camera2, null);
        this.map.draw(universe, universe.world, universe.display, visualCamera);
        for (var i = 0; i < this.portals.length; i++) {
            var portal = this.portals[i];
            portal.draw(universe, world, visualCamera);
        }
        for (var i = 0; i < this.movers.length; i++) {
            var mover = this.movers[i];
            mover.draw(universe, world, visualCamera);
        }
    }
}
