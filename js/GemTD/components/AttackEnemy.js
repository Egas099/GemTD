class AttackEnemy extends MonoBehavior {
    target;
    lastFire;
    constructor(_parent, _damage, _range, _fireRate) {
        super(_parent);
        this.className = "AttackEnemy";
        this.damage = _damage;
        this.range = _range;
        this.fireRate = _fireRate;
        this.lastFire = Date.now();
    }
    findEnemy() {
        let distance, minDist = this.range;
        game.prototypesGameObject.forEach(object => {
            if (object.findComponentByName("EnemyController")) {
                distance = Vector2.Distance(this.parent.position, object.position);
                if (distance <= this.range) {
                    if (distance < minDist) {
                        this.target = object;
                        minDist = distance;
                    }
                }
            }
        });
    }
    attackTarget() {
        if (this.lastFire + this.fireRate < Date.now()) {
            this.lastFire = Date.now();
            this.fire();
        }
    }
    fire() {
        Creator.InstantShell(this.parent.position, this.target, this.damage)
    }
    Start() {}
    Update() {
        if (this.target === undefined) {
            this.findEnemy();
        } else {
            if ((GameObject.IsExist(this.target) == true)&&(Vector2.Distance(this.parent.position, this.target.position)<=this.range)) {
                this.attackTarget();
            } else {
                this.target = undefined;
                this.findEnemy();
            }

        }
    }
}