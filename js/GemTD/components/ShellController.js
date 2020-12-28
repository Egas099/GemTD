class ShellController extends MonoBehavior {
    constructor(_parent, _owner, _target, _damage, _speed) {
        super(_parent);
        this.className = "ShellController";
        this.owner = _owner;
        this.target = _target;
        this.damage = _damage;
        this.parent.speed = _speed;
    }
    Start() {
        this.parent.getComponent("MoveController").onEndPath = function (_object) {
            const Sc = _object.getComponent("ShellController");
            const target = Sc.target;
            const damage = Sc.damage;
            if (GameObject.IsExist(target)) {
                target.getComponent("EnemyController").takeDamage(damage);
            }
            Sc.owner.getComponent("AttackEnemy").localEvent("onHit", { target: target, damage: damage });
            GameObject.Destroy(_object);
        };
    }
    Update() { }
}