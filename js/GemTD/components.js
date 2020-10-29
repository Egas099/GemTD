class MoveController extends MonoBehavior {
    constructor(_parent, _speed, _movePath = []) {
        super(_parent);
        this.className = "MoveController";
        this.lastStep = Date.now();
        this.speed = _speed;
        this.movePath = _movePath;
        this.targetPos = this.movePath.shift();
    }
    moveToTarget() {
        if (Vector2.Equal(this.parent.position, this.targetPos)) {
            if (Math.sqrt(movePath) != []) {
                this.targetPos = this.movePath.shift();
            } else {
                this.targetPos = null;
            }
        } else {
            this.parent.setPosition(null, new Vector2(
                (this.targetPos.x - this.parent.position.x) * this.speed / Vector2.Distance(this.parent.position, this.targetPos),
                (this.targetPos.y - this.parent.position.y) * this.speed / Vector2.Distance(this.parent.position, this.targetPos)
            ));
        }
    }
    Start() {}
    Update() {
        if (this.targetPos) {
            if (this.lastStep + deltaTime < Date.now()) {
                this.moveToTarget();
                this.lastStep = Date.now();
            }
        }
    }
}
class AttackEnemy extends MonoBehavior {
    target;
    lastFire;
    constructor(_parent, _damage, _range, _fireRate) {
        super(_parent);
        this.className = "EnemyFinder";
        this.damage = _damage;
        this.range = _range;
        this.fireRate = _fireRate;
        this.lastFire = Date.now();
    }
    findEnemy() {
        game.prototypesGameObject.forEach(object => {
            if (object.findComponentByName("EnemyController")) {
                if (Vector2.Distance(this.parent.position, object.position) <= this.range) {
                    this.target = object;
                    this.attackTarget();
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
        GameObject.Instantiate({
            target: this.target.position,
            damage:  this.damage,
            name: "shell",
            position: this.parent.position,
            size: createVector2(10, 10),
            createComponentsFor(_parent) {
                return [
                    new SpriteRender(_parent, sprites.gemShell, 100, destroyObject),
                    new ShellController(_parent, this.target, this.damage),
                ];
            },
        }, );
    }
    Start() {}
    Update() {
        this.findEnemy();
    }
}
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
            if (this.health < 0) {
                this.Death();
            }
        }
    }
    Death() {
        GameObject.Destroy(this.parent);
    }
    Start() {}
    Update() {}
}
class GemController extends MonoBehavior {
    constructor(_parent) {
        super(_parent);
        this.className = "GemController";
    }
    Start() {}
    Update() {}
}
class HealthBar extends MonoBehavior {
    constructor(_parent = GameObject) {
        super(_parent);
        this.className = "HealthBar";
        this.loadLines();
    }
    loadLines() {
        this.redLine = new Image();
        this.redLine.src = sprites.healthBar.redLine;
        this.greenLine = new Image();
        this.greenLine.src = sprites.healthBar.greenLine;
    }
    render() {
        RenderInterface.drawImage(
            this.redLine,
            this.parent.position.x - this.parent.size.x / 2,
            this.parent.position.y - this.parent.size.y / 2 - 5,
            this.parent.size.x,
            this.parent.size.y / 10,
            this.depth + 1);
        RenderInterface.drawImage(
            this.greenLine,
            this.parent.position.x - this.parent.size.x / 2,
            this.parent.position.y - this.parent.size.y / 2 - 5,
            this.parent.size.x / (this.maxHealth / this.parent.findComponentByName("EnemyController").health),
            this.parent.size.y / 10,
            this.depth + 2);
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
    speed = 20;
    constructor(_parent, _target, _damage) {
        super(_parent);
        this.damage = _damage;
        this.target = _target;
        this.className = "ShellController";
    }
    moveToTarget() {
        if (Vector2.Distance(this.parent.position, this.target) < this.speed/2) {
            game.prototypesGameObject.forEach(object => {
                if(object.position == this.target){
                    object.findComponentByName("EnemyController").takeDamage(this.damage);
                }
            });
            GameObject.Destroy(this.parent);
        } else {
            this.parent.setPosition(null, new Vector2(
                (this.target.x - this.parent.position.x) * this.speed / Vector2.Distance(this.parent.position, this.target),
                (this.target.y - this.parent.position.y) * this.speed / Vector2.Distance(this.parent.position, this.target)
            ));
        }
    }
    Start() {}
    Update() {
        if (this.target) {
            this.moveToTarget();
        }
    }
}