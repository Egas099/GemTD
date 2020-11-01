class SpriteRender extends MonoBehavior {
    constructor(_parent = GameObject, _renderImage = null, _depth = 0, _onClickFunc = undefined) {
        super(_parent);
        if (_renderImage) {
            this.renderImage = _renderImage;
        }
        if (_onClickFunc)
            this.onClickFunc = _onClickFunc;
        this.className = "SpriteRender";
        this.depth = _depth;
    }
    render() {
        if (this.renderImage)
            RenderInterface.drawImage(
                this.renderImage,
                this.parent.position.x - this.parent.size.x / 2,
                this.parent.position.y - this.parent.size.y / 2,
                this.parent.size.x,
                this.parent.size.y,
                this.depth + this.parent.depth);
    }
    onClick(_object){
        if (this.onClickFunc)
            this.onClickFunc(_object);
    }
    Start() {}
    Update() {
        this.render();
    }
}