class MoveController extends MonoBehavior {
	constructor(_parent, _speed, _movePath = [], _onEndPath) {
		super(_parent);
		this.className = "MoveController";
		this.movePath = _movePath;
		this.pointIndex = 0;

		this.targetPos = this.movePath[this.pointIndex];

		this.onEndPath = _onEndPath;
		this.moveIncrement = 0;
	}
	checkDist() {
		if (Vector2.accurateEqual(this.parent.position, this.targetPos)) {
			this.pointIndex++;
			if (this.movePath.length === this.pointIndex) {
				this.eventOnEndPath(this.parent);
				this.targetPos = undefined;
				return false;
			} else {

				this.targetPos = this.movePath[this.pointIndex];
			}
		}
		return true;
	}

	moveToTarget() {
		if (!this.checkDist()) {
			return;
		}
		let movePoints = 0;
		let distance = Vector2.Distance(this.parent.position, this.targetPos);
		if (this.moveIncrement) {
			if (distance <= (movePoints = this.moveIncrement)) {
				this.moveIncrement = this.moveIncrement - distance;
				this.parent.setPosition(this.targetPos);
				if (this.moveIncrement) {
					this.moveToTarget();
				}
			} else {
				this.moveIncrement = 0;
				this.parent.setPosition(null, new Vector2(
					((this.targetPos.x - this.parent.position.x) / distance) * movePoints,
					((this.targetPos.y - this.parent.position.y) / distance) * movePoints
				));
			}

		} else {
			if (distance < (movePoints = this.speed * game.deltaTime)) {
				this.moveIncrement += movePoints - distance;
				this.parent.setPosition(this.targetPos);
				this.moveToTarget();
			} else {
				this.parent.setPosition(null, new Vector2(
					Math.round(((this.targetPos.x - this.parent.position.x) / distance) * movePoints),
					Math.round(((this.targetPos.y - this.parent.position.y) / distance) * movePoints)
					));
			}
		}

	}
	eventOnEndPath(_object) {
		if (this.onEndPath) this.onEndPath(_object);
	}
	Start() {
		if (this.parent.speed) this.speed = this.parent.speed
		else this.speed = 0;
	}
	Update() {
		if (this.targetPos) {
			this.moveToTarget();
		}
	}
}