// class GUIComponent extends MonoBehavior {
//     constructor(_position, _size) {
//         super();
//         this.position = _position;
//         this.size = _size;
//     }
// }
class SpriteRender extends MonoBehavior {
    constructor(_parent, _renderImage = null) {
        super();
        if (_renderImage) {
            this.renderImage = new Image();
            this.renderImage.src = _renderImage;
        }
        this.parent = _parent;
        this.className = "SpriteRender";
    }
    render() {
        if (this.renderImage)
            RenderInterface.drawImage(this.renderImage,
                this.parent.position.x - this.parent.size.x / 2,
                this.parent.position.y - this.parent.size.y / 2,
                this.parent.size.x,
                this.parent.size.y,
                2);
    }
    setRenderImage(_renderImage) {
        this.renderImage = new Image();
        this.renderImage.src = _renderImage;
    }
    Start() {}
    Update() {
        this.render();
    }
}
class TileMap extends MonoBehavior {
    constructor(_parent, _tileSize = Vector2, _renderImage = "") {
        super();
        if (_renderImage) {
            this.renderImage = new Image();
            this.renderImage.src = _renderImage;
        }
        this.parent = _parent;
        this.tileSize = _tileSize;
        this.className = "TileMapRender";
        this.amountX = Math.round(this.parent.size.x / this.tileSize.x);
        this.amountY = Math.round(this.parent.size.y / this.tileSize.y);
        this.map = [, ];
    }
    render() {
        for (let x = 0; x <= this.amountX; x++) {
            for (let y = 0; y <= this.amountY; y++) {
                RenderInterface.drawImage(this.renderImage, x * this.tileSize.x, y * this.tileSize.y, this.tileSize.x, this.tileSize.y, 0);
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
class ClickHandler extends MonoBehavior {
    constructor(_parent) {
        super();
    }
    Start() {
        canvas.addEventListener('click', function (evt) {
            var rect = canvas.getBoundingClientRect();
            var mousePos = {
                x: (evt.clientX - rect.left)*(canvas.width/canvas.clientWidth),
                y: (evt.clientY - rect.top)*(canvas.height/canvas.clientHeight)
            };
            console.log(mousePos);
        }, false);
    }
    Update() {}
}
// class Button extends GUIComponent {

// }