class EnemyController extends MonoBehavior {
    constructor(_parent, _values = {
        health: {
            value: 0,
            props: {
                max: 0
            }
        },
        damage: 0,
        speed: 0,
        type: "ground",
    }) {
        super(_parent);
        this.className = "EnemyController";
        this.values = _values;
    }
    takeDamage(_damage) {
        if (_damage > 0) {
            this.parent.state.health -= _damage;
            if (this.parent.state.health <= 0) {
                this.parent.state.health = 0;
                this.Death();
            }
        }
    }
    Death() {
        GameSystem.action.enemyDie(this.parent);
    }
    Start() {
        for (const value in this.values) {
            if (this.values[value].value !== undefined) {
                this.parent.state.addProperty(value, this.values[value].value, this.values[value].props);
            } else {
                this.parent.state.addProperty(value, this.values[value]);
            }
        }
        // this.gEffect = true;
        // setTimeout(, 1000);
    }
    Update() {
        // if (this.gEffect) {
        //     if (this.parent.state.speed !== undefined) {
        //         this.parent.state.addEffect();
        //         this.gEffect = false;
        //     }
        // }
    }
}