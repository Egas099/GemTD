class AttackEnemy extends MonoBehavior {
    constructor(_parent, _stat = {
        damageMin: 0,
        damageMax: 0,
        range: 0,
        fireRate: 0,
        targetType: "all",
    }) {
        super(_parent);
        this.className = "AttackEnemy";
        for (const key in _stat) {
            this.parent[key] = _stat[key];
        } 
        this.lastFire = Date.now();
        this.target = undefined;
    }
    findEnemy() {
        let distance, minDist = this.parent.range;
        game.prototypesGameObject.forEach(object => {
            if (object.findComponentByName("EnemyController")) {
                if (this.parent.targetType === "all" || this.parent.targetType === object.type) {
                    distance = Vector2.Distance(this.parent.position, object.position);
                    if (distance <= this.parent.range) {
                        if (distance < minDist) {
                            this.target = object;
                            minDist = distance;
                        }
                    }
                }
            }
        });
    }
    attackTarget() {
        if (this.parent.fireRate < Date.now() - this.lastFire) {
            this.lastFire = Date.now();
            this.fire();
        }
    }
    fire() {
        Creator.InstantShell(this.parent,
            this.target,
            Math.round(this.parent.damageMin + Math.random() * (this.parent.damageMax - this.parent.damageMin))
        );
    }
    Start() {}
    Update() {
        if (this.target === undefined) {
            this.findEnemy();
        } else {
            if ((GameObject.IsExist(this.target) == true) &&
                (Vector2.Distance(this.parent.position, this.target.position) <= this.parent.range)) {
                this.attackTarget();
            } else {
                this.target = undefined;
                this.findEnemy();
            }

        }
    }
}