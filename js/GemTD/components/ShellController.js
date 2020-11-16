class ShellController extends MonoBehavior {
    constructor(_parent, _target, _damage, _speed) {
        super(_parent);
        this.parent.speed = _speed;
        this.damage = _damage;
        this.target = _target;
        this.className = "ShellController";
    }
    Start() {
        this.parent.findComponentByName("MoveController").onEndPath = function(_object){
            const Sc = _object.findComponentByName("ShellController");
            const target = Sc.target;
            const damage = Sc.damage;
            if (GameObject.IsExist(target)) {
                target.findComponentByName("EnemyController").takeDamage(damage);
            }
            GameObject.Destroy(_object);
        };
    }
    Update() {}
}