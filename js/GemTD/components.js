class MoveController extends MonoBehavior{
    constructor(_parent){
        super();
        this.parent = _parent;
    }
    randomMovement(){
        var x = y = 5;
        this.parent.setPosition(null, new Vector2(Math.random() * x - x/2,Math.random()*y - y/2));
    }
    Start(){
    }
    Update(){
        this.randomMovement();
    }
}