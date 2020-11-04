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
        GameSystem.InstantShell(this.parent.position, this.target, this.damage)
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
class HealthBar extends MonoBehavior {
    constructor(_parent = GameObject) {
        super(_parent);
        this.className = "HealthBar";
        this.loadLines();
    }
    loadLines() {
        this.redLine = sprites.redPixel;
        this.greenLine = sprites.greenPixel;
    }
    render() {
        RenderInterface.drawImage(
            this.depth + 1,
            this.redLine,
            this.sx,
            this.sy,
            this.sWidth,
            this.sHeight,
            this.parent.position.x - this.parent.size.x / 2,
            this.parent.position.y - this.parent.size.y / 2,
            this.parent.size.x,
            this.parent.size.y / 10,
            );
        RenderInterface.drawImage(
            this.depth + 2,
            this.greenLine,
            this.sx,
            this.sy,
            this.sWidth,
            this.sHeight,
            this.parent.position.x - this.parent.size.x / 2,
            this.parent.position.y - this.parent.size.y / 2,
            this.parent.size.x / (this.maxHealth / this.parent.findComponentByName("EnemyController").health),
            this.parent.size.y / 10,
            );
    }
    Start() {
        this.depth = this.parent.findComponentByName("SpriteRender").depth;
        this.maxHealth = this.parent.findComponentByName("EnemyController").maxHealth;
    }
    Update() {
        this.render();
    }
}
class ShellController extends MonoBehavior {
    constructor(_parent, _target, _damage) {
        super(_parent);
        this.damage = _damage;
        this.target = _target;
        this.className = "ShellController";
    }
    collision() {
        console.log("kolision");
    }
    Start() {
        this.parent.findComponentByName("MoveController").onEndPath = function(_object){
            const Sc = _object.findComponentByName("ShellController");
            const target = Sc.target;
            const damage = Sc.damage;
            target.findComponentByName("EnemyController").takeDamage(damage);
            GameObject.Destroy(_object);
        };
    }
    Update() {}
}