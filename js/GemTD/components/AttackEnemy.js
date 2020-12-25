class AttackEnemy extends MonoBehavior {
    constructor(_parent, _values = {
        damage: {
            value: 0,
            props: {
                min: 0,
                max: 0,
            }
        },
        range: 0,
        fireRate: 0,
        targetType: "all",
    }) {
        super(_parent);
        this.className = "AttackEnemy";
        this.values = _values;
        this.lastFire = Date.now();
        this.target = undefined;
    }
    findEnemy() {
        let distance, minDist = this.parent.state.range;
        game.prototypesGameObject.forEach(object => {
            if (object.getComponent("EnemyController")) {
                if (this.parent.state.targetType === "all" || this.parent.state.targetType === object.type) {
                    distance = Vector2.Distance(this.parent.position, object.position);
                    if (distance <= this.parent.state.range) {
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
        if (this.parent.state.fireRate < Date.now() - this.lastFire) {
            this.lastFire = Date.now();
            this.fire();
        }
    }
    fire() {
        Creator.InstantShell(this.parent,
            this.target,
            Math.round(this.parent.state.damageMin + Math.random() *
                (this.parent.state.damageMax - this.parent.state.damageMin))
        );
    }
    Start() {
        for (const value in this.values) {
            if (this.values[value].value !== undefined) {
                this.parent.state.addProperty(value, this.values[value].value, this.values[value].props);
            } else {
                this.parent.state.addProperty(value, this.values[value]);
            }
        }
    }
    Update() {
        if (this.target === undefined) {
            this.findEnemy();
        } else {
            if ((GameObject.IsExist(this.target) == true) &&
                (Vector2.Distance(this.parent.position, this.target.position) <= this.parent.state.range)) {
                this.attackTarget();
            } else {
                this.target = undefined;
                this.findEnemy();
            }

        }
    }
}