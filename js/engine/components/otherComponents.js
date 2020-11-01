class TileMap extends MonoBehavior {
    constructor(_parent, _tileSize = Vector2, _renderImage = "", _depth = 0) {
        super(_parent);
        if (_renderImage) {
            this.renderImage = _renderImage;
        }
        this.tileSize = _tileSize;
        this.className = "TileMapRender";
        this.amountX = Math.round(this.parent.size.x / this.tileSize.x);
        this.amountY = Math.round(this.parent.size.y / this.tileSize.y);
        this.depth = _depth;
    }
    render() {
        for (let x = 0; x <= this.amountX; x++) {
            for (let y = 0; y <= this.amountY; y++) {
                RenderInterface.drawImage(this.renderImage, x * this.tileSize.x, y * this.tileSize.y, this.tileSize.x, this.tileSize.y, this.depth);
            }
        }
    }
    changeTile(_tile = Vector2) {}
    setRenderImage(_renderImage) {
        this.renderImage = new Image();
        this.renderImage.src = _renderImage;
    }
    Start() {}
    Update() {
        if (this.renderImage)
            this.render();
    }
}

