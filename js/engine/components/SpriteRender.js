class SpriteRender extends MonoBehavior {
	constructor(_parent = GameObject, _renderImage, _depth = 0, _events = {
		onClick: undefined,
		onHover: undefined,
		onHoverEnter: undefined,
		onHoverLeave: undefined,
	}) {
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
		let events = {
			onClick: undefined,
			onHover: undefined,
			onHoverEnter: undefined,
			onHoverLeave: undefined,
		}
		for (const key in events) {
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
	}
	render() {
		if (this.renderImage) RenderInterface.drawImage(this.depth + this.parent.depth, this.renderImage, this.sx, this.sy, this.sWidth, this.sHeight, this.parent.position.x - this.parent.size.x / 2, this.parent.position.y - this.parent.size.y / 2, this.parent.size.x, this.parent.size.y, );
	}
	Start() {}
	Update() {
		this.render();
	}
}