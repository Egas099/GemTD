class SpriteRender extends MonoBehavior {
	constructor(_parent, _renderImage, _depth = 0, _events = {
		onClick: undefined,
		onHover: undefined,
		onHoverEnter: undefined,
		onHoverLeave: undefined,
	}, _style) {
		super(_parent);
		this.className = "SpriteRender";
		if (_renderImage.src !== undefined) {
			if (_renderImage)
				this.renderImage = _renderImage;
		} else {
			this.renderImage = _renderImage.img;
			this.sx = _renderImage.sx;
			this.sy = _renderImage.sy;
			this.sWidth = _renderImage.sWidth;
			this.sHeight = _renderImage.sHeight;
		}
		let allEvents = {
			onClick: undefined,
			onHover: undefined,
			onHoverEnter: undefined,
			onHoverLeave: undefined,
		}
		for (const key in allEvents) {
			if (typeof _events[key] === "function") {
				this[key] = (_object) => {
					_events[key](_object);
					return true;
				}
			} else {
				this[key] = (_object) => {
					return false;
				}
			}
		}
		this.depth = _depth;
		this.style = {};
		for (const style in _style)
			this.style[style] = _style[style];

		this.defaultStyle = {};
		for (const style in this.style)
			this.defaultStyle[style] = this.style[style];
	}
	render() {
		if (this.renderImage) {
			RenderInterface.drawImage(this.depth + this.parent.depth, {
				style: this.style,
				image: this.renderImage,
				sx: this.sx,
				sy: this.sy,
				sWidth: this.sWidth,
				sHeight: this.sHeight,
				x: this.parent.position.x - this.parent.size.x / 2,
				y: this.parent.position.y - this.parent.size.y / 2,
				width: this.parent.size.x,
				height: this.parent.size.y
			});
		}
	}
	setStyle(_newStyle) {
		// console.log("Было",this.style, this.defaultStyle);
		for (const style in _newStyle) {
			this.style[style] = _newStyle[style];
		}
		// console.log("Было",this.style, this.defaultStyle);
	}
	restoreStyle() {
		this.setStyle(this.defaultStyle);
	}
	clearStyle() {
		this.style = {};
	}

	Start() {
	}
	Update() {
		this.render();
	}
}