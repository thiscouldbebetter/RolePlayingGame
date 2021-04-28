"use strict";
class Constraint_Follow {
    constructor(target) {
        this.target = target;
    }
    apply(constrainable) {
        if (this.target != null) {
            var targetPos = this.target.locatable().loc.pos;
            constrainable.loc.pos.overwriteWith(targetPos);
        }
    }
}
