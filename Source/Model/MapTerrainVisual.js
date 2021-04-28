"use strict";
class MapTerrainVisual {
    constructor(children) {
        this.children = children;
        var childNames = MapTerrainVisual.ChildNames;
        this.childrenByName = new Map();
        for (var i = 0; i < childNames.length; i++) {
            var childName = childNames[i];
            var child = this.children[i];
            this.childrenByName.set(childName, child);
        }
    }
    static TestInstance() {
        // Helpful for debugging.
        var radius = 3;
        var size = Coords.fromXY(5, 5);
        var colorBlack = Color.byName("Black");
        return new MapTerrainVisual([
            VisualRectangle.fromSizeAndColorFill(size, colorBlack),
            VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Red")),
            VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Orange")),
            VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Yellow")),
            VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Green")),
            VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Blue")),
            VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Violet")),
            VisualCircle.fromRadiusAndColorFill(radius, Color.byName("Gray")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("Red")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("Orange")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("Yellow")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("Green")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("Blue")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("Violet")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("Gray")),
            VisualRectangle.fromSizeAndColorFill(size, Color.byName("White")), // 1111 // Never
        ]);
    }
    draw(universe, world, place, drawable, display) {
        var childCenter = this.childrenByName.get("Center");
        childCenter.draw(universe, world, place, drawable, display);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Transformable.
    transform(transformToApply) { return this; }
}
MapTerrainVisual.ChildNames = [
    "Center",
    "InsideSE",
    "InsideSW",
    "EdgeN",
    "InsideNE",
    "EdgeW",
    "DiagonalSlash",
    "OutsideSE",
    "InsideNW",
    "DiagonalBackslash",
    "EdgeE",
    "OutsideSW",
    "EdgeS",
    "OutsideNE",
    "OutsideNW"
];
