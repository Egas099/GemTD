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
            const ShellController = _object.getComponent("ShellController");
            const target = ShellController.target;
            const damage = ShellController.damage;
            if (GameObject.IsExist(target)) {
                target.getComponent("EnemyController").takeDamage(damage);
            }
            ShellController.owner.events.callEvent("onHit", { target: target, damage: damage });
            GameObject.Destroy(_object);
        };
    }
    Update() { }
}