"use strict";
class Image3 {
    constructor(name, size, systemImage) {
        this.name = name;
        this.size = size;
        this.systemImage = systemImage;
        this.sizeHalf = this.size.clone().half();
    }
    static fromStrings(name, colorsByCode, pixelsAsStrings) {
        var size = Coords.fromXY(pixelsAsStrings[0].length, pixelsAsStrings.length);
        var canvas = document.createElement("canvas");
        canvas.width = size.x;
        canvas.height = size.y;
        var graphics = canvas.getContext("2d");
        for (var y = 0; y < size.y; y++) {
            var pixelRowAsString = pixelsAsStrings[y];
            for (var x = 0; x < size.x; x++) {
                var pixelColorCode = pixelRowAsString[x];
                var pixelColor = colorsByCode.get(pixelColorCode);
                graphics.fillStyle = pixelColor.systemColor();
                graphics.fillRect(x, y, 1, 1);
            }
        }
        var systemImage = document.createElement("img");
        systemImage.src = canvas.toDataURL();
        var returnValue = new Image3(name, size, systemImage);
        return returnValue;
    }
    toImage2(universe) {
        if (this._image2 == null) {
            var display = Display2D.fromSizeAndIsInvisible(this.size, true);
            display.initialize(universe);
            display.graphics.drawImage(this.systemImage, 0, 0);
            this._image2 = display.toImage();
        }
        return this._image2;
    }
}
