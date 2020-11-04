class SpriteRender extends MonoBehavior {
    constructor(_parent = GameObject, _renderImage, _depth = 0, _onClickFunc = undefined) {
        super(_parent);
        if (_renderImage.src !== undefined) {
            if (_renderImage) {
                this.renderImage = _renderImage;
            }
        } else {
            this.renderImage = _renderImage.img;
            this.sx = _renderImage.sx;
            this.sy = _renderImage.sy;
            this.sWidth = _renderImage.sWidth;
            this.sHeight = _renderImage.sHeight;
        }
        if (_onClickFunc)
            this.onClickFunc = _onClickFunc;
        this.className = "SpriteRender";
        this.depth = _depth;
    }
    render() {
        if (this.renderImage)
            RenderInterface.drawImage(
                this.depth + this.parent.depth,
                this.renderImage,
                this.sx,
                this.sy,
                this.sWidth,
                this.sHeight,
                this.parent.position.x - this.parent.size.x / 2,
                this.parent.position.y - this.parent.size.y / 2,
                this.parent.size.x,
                this.parent.size.y,
                );
    }
    onClick(_object){
        if (this.onClickFunc)
        {
            this.onClickFunc(_object);
            return true;
        }
        else
            return false;
    }
    Start() {}
    Update() {
        this.render();
    }
}