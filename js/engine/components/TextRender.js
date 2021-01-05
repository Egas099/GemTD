class TextRender extends MonoBehavior {
	constructor(_parent, _textInput, _depth = 0, _options) {
		super(_parent);
		if (_textInput) {
			this.textInput = _textInput;
		}
		this.className = "TextRender";
		this.depth = _depth;
		this.renderLineText = [];
		this.size = {
			x: this.parent.size.x / 2 - 10,
			y: this.parent.size.y / 2 - 30,
		}
		this.style = _options;
	}
	calcPositionString() {
		this.renderLineText = [];
		let str;
		do {
			str = this.drawText.slice(0, this.parent.size.x / 10);
			this.drawText = this.drawText.slice(this.parent.size.x / 10, this.drawText.length);
			this.renderLineText.push(str);
		} while (this.drawText.length !== 0);
	}
	renderText() {
		let i = 0;
		this.renderLineText.forEach(textLine => {
			RenderInterface.fillText(
				this.depth + this.parent.depth,
				{
					style: this.style,
					text: textLine,
					x: this.parent.position.x - this.size.x,
					y: this.parent.position.y - this.size.y + 25 * i,
					maxWidth: this.parent.size.x
				}
			);
			i++;
		});
	}
	renderFuncResult() {
		this.drawText = this.textInput();
		switch (typeof this.drawText) {
			case "string":
				this.calcPositionString();
				this.renderText();
				break;
			case "object":
				this.renderLineText = this.drawText;
				this.renderText();
				break;
			default:
				break;
		}
	}
	Start() {
		switch (typeof this.textInput) {
			case "string":
				this.drawText = this.textInput;
				this.calcPositionString();
				this.renderFunc = this.renderText;
				break;
			case "object":
				this.renderLineText = this.textInput;
				this.renderFunc = this.renderText;
				break;
			case "function":
				this.drawText = this.textInput();
				this.renderFunc = this.renderFuncResult;
				break;
			default:
				break;
		}
	}
	Update() {
		this.renderFunc();
	}
}