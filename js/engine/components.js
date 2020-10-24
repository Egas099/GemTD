class SpriteRender extends MonoBehavior{
    constructor(_renderImage = null, _parent){
        super();
        if (_renderImage) {
            this.renderImage = new Image();
            this.renderImage.src = _renderImage;
        }
        this.parent = _parent;
    }
    render(){
        if (this.renderImage)
            ctx.drawImage(this.renderImage, this.parent.position.x, this.parent.position.y, this.parent.size.x, this.parent.size.y);
    }
    setRenderImage(_renderImage) {
        this.renderImage = new Image();
        this.renderImage.src = _renderImage;
    }
    Start(){
    }
    Update(){
        this.render();
    }
}