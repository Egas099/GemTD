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

        ["onFire", "onHit"].forEach(event => {
            this[event] = [];
        });
    }
    addLocalEventListener(_event, _callback) {
        this[_event].push(_callback);
    }
    localEvent(_eventName, _eventData) {
        this[_eventName].forEach(event => {
            event.call(this, _eventData);
        });
    }

    findOneTarget = () => {
        let newTarget, distance, minDist = this.parent.state.range;
        game.prototypesGameObject.forEach(object => {
            if (object.getComponent("EnemyController")) {
                if (this.parent.state.targetType === "all" || this.parent.state.targetType === object.type) {
                    distance = Vector2.Distance(this.parent.position, object.position);
                    if (distance <= this.parent.state.range) {
                        if (distance < minDist) {
                            newTarget = object;
                            minDist = distance;
                        }
                    }
                }
            }
        });
        return newTarget;
    }
    tryAttack() {
        if (this.parent.state.fireRate < Date.now() - this.lastFire) {
            this.lastFire = Date.now();
            this.fire(this.target);
            this.localEvent("onFire");
        }
    }
    fire(_target) {
        Creator.InstantShell(
            this.parent,
            _target,
            Math.randomIntRange(this.parent.state.damageMin, this.parent.state.damageMax)
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
            this.target = this.findOneTarget();
        } else {
            if ((GameObject.IsExist(this.target) == true) &&
                (Vector2.Distance(this.parent.position, this.target.position) <= this.parent.state.range)) {
                this.tryAttack();
            } else {
                this.target = this.findOneTarget();
            }

        }
    }
}