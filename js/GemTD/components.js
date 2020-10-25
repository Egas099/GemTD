class MoveController extends MonoBehavior {
    speed = 10;
    constructor(_parent, _movePath = []) {
        super();
        this.parent = _parent;
        this.className = "MoveController";
        this.lastStep = performance.now();
        this.movePath = _movePath;
        this.targetPos = this.movePath.shift();
    }
    moveToTargen() {
        if (Vector2.Equal(this.parent.position, this.targetPos)) {
            if (Math.sqrt(movePath) != []) {
                this.targetPos = this.movePath.shift();
            } else {
                this.targetPos = null;
            }
        } else {
            if (Vector2.Distance(this.parent.position, this.targetPos) < this.speed) {
                this.parent.setPosition(this.targetPos);
            } else {
                // let direction = Vector2.Direction(new Vector2(
                //     this.targetPos.x - this.parent.position.x,
                //     this.targetPos.y - this.parent.position.y
                // ));
                // this.parent.setPosition(null, Vector2.Mult(direction, new Vector2(
                //     Math.sqrt(this.speed),
                //     Math.sqrt(this.speed))));
                this.parent.setPosition(null, new Vector2(
                    (this.targetPos.x - this.parent.position.x)/10,
                    (this.targetPos.y - this.parent.position.y)/10
                ));
            }
        }
    }
    Start() {}
    Update() {
        if (this.targetPos) {
            if (this.lastStep + deltaTime < performance.now()) {
                this.moveToTargen();
                this.lastStep = performance.now();
            }
        }
    }
}
class CheckedEnemy extends MonoBehavior {
    constructor(_parent) {
        super();
        this.parent = _parent;
        this.className = "CheckedEnemy";
    }
    Start() {}
    Update() {}
}
class PointMove extends MonoBehavior {
    constructor(_parent) {
        super();
        this.parent = _parent;
        this.className = "PointMove";
    }
    Start() {}
    Update() {}
}