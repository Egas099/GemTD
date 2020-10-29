class SpriteRender extends MonoBehavior {
    constructor(_parent = GameObject, _renderImage = null, _depth = 0, _onClickFunc = undefined) {
        super(_parent);
        if (_renderImage) {
            this.renderImage = new Image();
            this.renderImage.src = _renderImage;
        }
        if (_onClickFunc)
            this.onClickFunc = _onClickFunc;
        this.className = "SpriteRender";
        this.depth = _depth;
    }
    render() {
        if (this.renderImage)
            RenderInterface.drawImage(this.renderImage,
                this.parent.position.x - this.parent.size.x / 2,
                this.parent.position.y - this.parent.size.y / 2,
                this.parent.size.x,
                this.parent.size.y,
                this.depth);
    }
    setRenderImage(_renderImage) {
        this.renderImage = new Image();
        this.renderImage.src = _renderImage;
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
class TileMap extends MonoBehavior {
    constructor(_parent, _tileSize = Vector2, _renderImage = "", _depth = 0) {
        super(_parent);
        if (_renderImage) {
            this.renderImage = new Image();
            this.renderImage.src = _renderImage;
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
class ClickHandler extends MonoBehavior {
    constructor(_parent) {
        super(_parent);
    }
    static clickEvent(_clickPos){
        var objects = [];
        game.prototypesGameObject.forEach(object => {
            if (object.findComponentByName("SpriteRender")) {
                if (ClickHandler.isInclude(_clickPos, object.position, object.size)) {
                    objects.push(object);
                }
            }
        });
        if (objects.length != 0) {
            objects.sort((a, b) => a.depth > b.depth ? 1 : -1);
            objects[0].findComponentByName("SpriteRender").onClick(objects[0]);
        }
    }
    static isInclude(_clickPos, _objPos, _objSize){
        if (Math.abs(_clickPos.x - _objPos.x) <= _objSize.x/2)
            if (Math.abs(_clickPos.y - _objPos.y) <= _objSize.y/2)
                return true;
        return false;
    }
    Start() {
        canvas.addEventListener('click', function (evt) {
            var rect = canvas.getBoundingClientRect();
            var mousePos = {
                x: (evt.clientX - rect.left)*(canvas.width/canvas.clientWidth),
                y: (evt.clientY - rect.top)*(canvas.height/canvas.clientHeight)
            };
            ClickHandler.clickEvent(mousePos);
        }, false);
    }
    Update() {}
}
class TextRender extends MonoBehavior {
    constructor(_parent = GameObject, _renderText = null, _depth = 0, _parametersText = null, _onClickFunc = null) {
        super(_parent);
        if (_renderText) {
            this.renderText = _renderText;
        }
        if (_onClickFunc)
            this.onClickFunc = _onClickFunc;
        this.className = "TextRender";
        this.depth = _depth;
    }
    calcPosition(){
        this.size = {
            x: this.renderText.length * 10,
            y: 0,
        }
    }
    render() {
        this.calcPosition();
        if (this.renderText)
            RenderInterface.fillText(
                this.renderText,
                this.parent.position.x - this.size.x / 2,
                this.parent.position.y,
                this.parent.size.x,
                this.depth);
    }
    setRenderText(_renderText) {
        this.renderText = new Image();
        this.renderText.src = _renderText;
    }
    onClick(_object){
    }
    Start() {}
    Update() {
        this.render();
    }
}