class EnemyController extends MonoBehavior {
    constructor(_parent, _health = 0, _maxHealth, _damage = 0, _speed = 0) {
        super(_parent);
        this.health = _health;
        this.maxHealth = _maxHealth;
        this.damage = _damage;
        this.speed = _speed;
        this.className = "EnemyController";
    }
    takeDamage(_damage) {
        if (_damage > 0) {
            this.health -= _damage;
            if (this.health <= 0) {
                this.Death();
            }
        }
    }
    Death() {
        GameSystem.DieEnemy(this.parent);
        GameObject.Destroy(this.parent);
    }
    Start() {
        this.parent.findComponentByName("MoveController").onEndPath;
    }
    Update() {}
}