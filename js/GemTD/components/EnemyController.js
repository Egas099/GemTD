class EnemyController extends MonoBehavior {
    constructor(_parent, _stat = {
        health: 0,
        healthMax: 0,
        damage: 0,
        speed: 0,
        type: "ground",
    }) {
        super(_parent);
        this.className = "EnemyController";
        for (const key in _stat) {
            this.parent[key] = _stat[key];
        }
    }
    takeDamage(_damage) {
        if (_damage > 0) {
            this.parent.health -= _damage;
            if (this.parent.health <= 0) {
                this.parent.health = 0;
                this.Death();
            }
        }
    }
    Death() {
        GameSystem.action.enemyDie(this.parent);
    }
    Start() {}
    Update() {}
}