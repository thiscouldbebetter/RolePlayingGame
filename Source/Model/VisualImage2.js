"use strict";
class VisualImage2 {
    constructor(image) {
        this.image = image;
        var size = image.size;
        this.size = (size == null ? this.image.size : size);
        this.sizeHalf = this.size.clone().half();
        this.drawPos = Coords.create();
    }
    static manyFromImages(images) {
        var returnValues = [];
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            var visual = (image == null ? null : new VisualImage2(image));
            returnValues.push(visual);
        }
        return returnValues;
    }
    draw(universe, world, place, drawable, display) {
        var drawablePos = drawable.locatable().loc.pos;
        var drawPos = this.drawPos.overwriteWith(drawablePos).subtract(this.sizeHalf);
        var image = this.image.toImage2(universe);
        display.drawImage(image, drawPos);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Transformable.
    transform(transformToApply) { return this; }
}
