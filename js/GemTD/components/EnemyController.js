class EnemyController extends MonoBehavior {
    constructor(_parent, _stat = {
        health: 0,
        maxHealth: 0,
        damage: 0,
        speed: 0,
    }) {
        super(_parent);
        this.parent.speed = _stat.speed;
        this.health = _stat.health;
        this.maxHealth = _stat.maxHealth;
        this.damage = _stat.damage;
        this.speed = _stat.speed;
        this.className = "EnemyController";
        this.viewIncrement = this.health;
    }
    takeDamage(_damage) {
        if (_damage > 0) {
            this.health -= _damage;
            if (this.health <= 0) {
                this.health = 0;
                this.Death();
            }
        }
    }
    Death() {
        GameSystem.actionEnemyDie(this.parent);
    }
    Start() {}
    Update() {
        if (this.viewIncrement != this.health) {
            this.viewIncrement += (this.health - this.viewIncrement) / 10;
        }
    }
}