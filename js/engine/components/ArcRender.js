class ArcRender extends MonoBehavior {
    constructor(_parent, _radius, _depth, _onClickFunc) {
        super(_parent);
        this.radius = _radius;
        this.className = "ArcRender";
        this.depth = _depth;
    }
    render() {
        RenderInterface.arc(
            this.depth + this.parent.depth,
            this.parent.position.x,
            this.parent.position.y,
            this.radius,
            0,
            2 * Math.PI,
            false,
        );
    }
    onClick(_object) {
        if (this.onClickFunc)
            this.onClickFunc(_object);
    }
    Start() { }
    Update() {
        this.render();
    }
}