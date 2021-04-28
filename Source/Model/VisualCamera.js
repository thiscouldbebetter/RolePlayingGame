"use strict";
class VisualCamera {
    constructor(camera, child) {
        this.camera = camera;
        this.child = child;
        this.drawablePosOriginal = Coords.create();
    }
    draw(universe, world, place, drawable, display) {
        var drawablePos = drawable.locatable().loc.pos;
        this.drawablePosOriginal.overwriteWith(drawablePos);
        drawablePos.subtract(this.camera.loc.pos).add(display.sizeInPixels.clone().half());
        this.child.draw(universe, world, place, drawable, display);
        drawablePos.overwriteWith(this.drawablePosOriginal);
    }
}
