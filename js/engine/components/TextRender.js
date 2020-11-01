class TextRender extends MonoBehavior {
    constructor(_parent = GameObject, _renderText, _depth = 0, _parametersText = null, _onClickFunc = null) {
        super(_parent);
        if (_renderText) {
            this.renderText = _renderText;
        }
        if (_onClickFunc)
            this.onClickFunc = _onClickFunc;
        this.className = "TextRender";
        this.depth = _depth;
        this.renderLineText = [];
        this.size = {
            x: this.parent.size.x/2 - 10,
            y: this.parent.size.y/2 - 30,
        }
    }
    calcPositionString(){
        let str;
        do {
            str = this.renderText.slice(0, this.parent.size.x/10);
            this.renderText = this.renderText.slice(this.parent.size.x/10, this.renderText.length);
            this.renderLineText.push(str);
        } while (this.renderText.length !== 0);
    }
    calcPositionObject(){
        this.renderLineText = this.renderText;
    }
    render() {
        let i = 0;
        this.renderLineText.forEach(text => {
            RenderInterface.fillText(
                text,
                this.parent.position.x - this.size.x,
                this.parent.position.y - this.size.y + 20 * i,
                this.parent.size.x,
                this.depth + this.parent.depth);
                i++;
        });
    }
    Start() {
        switch (typeof this.renderText) {
            case "string":
                this.calcPositionString();
                break;
            case "object":
                this.calcPositionObject();
                break;
             default:
                break;
        }
    }
    Update() {
        this.render();
    }
}