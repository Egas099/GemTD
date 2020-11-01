class MoveController extends MonoBehavior {
    onEndPath;
    constructor(_parent, _speed, _movePath = []) {
        super(_parent);
        this.className = "MoveController";
        this.lastStep = Date.now();
        this.speed = _speed;
        this.movePath = _movePath;
        this.targetPos = this.movePath.shift();
    }
    moveToTarget() {
        if (Vector2.Equal(this.parent.position, this.targetPos)) {
            if (this.movePath.length != 0) {
                this.targetPos = this.movePath.shift();
            } else {
                this.targetPos = null;
                this.eventOnEndPath(this.parent);
            }
        } else {
            let distance = Vector2.Distance(this.parent.position, this.targetPos);
            let movePoints;
            if (distance < (movePoints = this.speed * game.deltaTime)) {
                this.parent.setPosition(this.targetPos);
            } else {
                this.parent.setPosition(null, new Vector2(
                    ((this.targetPos.x - this.parent.position.x) / distance) * movePoints,
                    ((this.targetPos.y - this.parent.position.y) / distance) * movePoints
                ));
            }
        }
    }
    eventOnEndPath(_object){
        if (this.onEndPath){
            this.onEndPath(_object);
        }
    }
    Start() {}
    Update() {
        if (this.targetPos) {
            this.moveToTarget();
        }
    }
}