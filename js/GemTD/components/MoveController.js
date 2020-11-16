class MoveController extends MonoBehavior {
	constructor(_parent, _speed, _movePath = [], _onEndPath) {
		super(_parent);
		this.className = "MoveController";
		this.lastStep = Date.now();
		this.movePath = _movePath;
		this.targetPos = this.movePath.shift();
		this.onEndPath = _onEndPath;
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
	eventOnEndPath(_object) {
		if (this.onEndPath) {
			this.onEndPath(_object);
		}
	}
	Start() {
		if (this.parent.speed) {
			this.speed = this.parent.speed
		} else {
			this.speed = 0;
		}
	}
	Update() {
		if (this.targetPos) {
			this.moveToTarget();
		}
	}
}