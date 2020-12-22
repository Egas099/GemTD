class RenderInterface {
	static times = [];
	static debugInfo = true;
	static nextFrame = [];
	static context = canvas.getContext("2d");

	static drawImage(_depth = 0, _renderObject = {
		style: {},
		image: undefined,
		sx: undefined,
		sy: undefined,
		sWidth: undefined,
		sHeight: undefined,
		x: undefined,
		y: undefined,
		width: undefined,
		height: undefined,
	},) {
		_renderObject["type"] = "image";
		_renderObject["depth"] = _depth;
		this.nextFrame.push(_renderObject);
	}
	static fillText(_depth = 0, _textObject = {
		text: textLine,
		x: this.parent.position.x - this.size.x,
		y: this.parent.position.y - this.size.y + 20 * i,
		maxWidth: this.parent.size.x
	}) {
		_textObject["type"] = "text";
		_textObject["depth"] = _depth;
		this.nextFrame.push(_textObject);
	}
	static arc(_depth = 0, _x, _y, _radius, _startAngle = 0, _endAngle, _anticlockwise) {
		this.nextFrame.push({
			type: "arc",
			x: _x,
			y: _y,
			radius: _radius,
			startAngle: _startAngle,
			endAngle: _endAngle,
			anticlockwise: _anticlockwise,
			depth: _depth,
		});
	}
	/**
	 * Отрисовка следующего кадра
	 */
	static renderNextFrame() {
		this.context.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
		this.nextFrame.sort((a, b) => a.depth !== b.depth ? (a.depth > b.depth ? 1 : -1) : (a.y >= b.y ? 1 : -1));
		this.nextFrame.forEach(renderObj => {
			switch (renderObj.type) {
				case "image":
					try {
						this.context.save();
						for (const option in renderObj.style)
							this.context[option] = renderObj.style[option];
						if (renderObj.sx !== undefined && renderObj.sy !== undefined && renderObj.sWidth !== undefined && renderObj.sHeight !== undefined)
							this.context.drawImage(renderObj.image, renderObj.sx, renderObj.sy, renderObj.sWidth, renderObj.sHeight, renderObj.x, renderObj.y, renderObj.width, renderObj.height);
						else this.context.drawImage(renderObj.image, renderObj.x, renderObj.y, renderObj.width, renderObj.height);
					} catch (error) {
						console.error(error, renderObj);
					}
					this.context.restore();
					break;
				case "text":
					try {
						this.context.save();
						for (const option in renderObj.style)
							this.context[option] = renderObj.style[option];
						this.context.fillText(
							renderObj.text,
							renderObj.x,
							renderObj.y,
							renderObj.maxWidth);
					} catch (error) {
						console.error(error, renderObj);
					}
					this.context.restore();
					break;
				case "arc":
					this.context.beginPath();
					this.context.arc(renderObj.x, renderObj.y, renderObj.radius, renderObj.startAngle, renderObj.endAngle, renderObj.anticlockwise);
					this.context.stroke();
					break;
				default:
					break;
			}
		});
		if (this.debugInfo) this.renderDebugInfo();
		this.nextFrame = [];
	}
	/**
	 * Отрисовка данных для отдладки
	 */
	static renderDebugInfo() {
		this.context.save();
		this.context.font = "20px serif";
		this.context.fillStyle = "#800080";
		this.context.fillText("Обьектов: " + game.prototypesGameObject.length, 10, 20);
		this.context.fillText("Компонентов: " + game.prototypesMonoBehavior.length, 10, 40);
		this.context.fillText("Спрайтов: " + this.nextFrame.length, 10, 60);
		window.requestAnimationFrame(() => {
			const now = performance.now();
			while (this.times.length > 0 && this.times[0] <= now - 1000) {
				this.times.shift();
			}
			this.times.push(now);
		});
		this.context.fillText("Fps: " + this.times.length, 10, 80);
		this.context.fillText("Состояние: " + GameData.game.state, 10, canvas.height - 40);
		this.context.fillText("Волна: " + GameData.wale, 10, canvas.height - 20);
		this.context.restore();
	}
	static Start() {
		canvas.getContext('2d').globalAlpha = 0;
		for (const style in GameData.config.style.global)
			this.context[style] = GameData.config.style.global[style];
		setTimeout(RenderInterface.setGlobalAlpha, 17)
	}
	static Update() {
		this.renderNextFrame();
	}
	static setGlobalAlpha() {
		if (canvas.getContext('2d').globalAlpha + 0.05 > 1) {
			canvas.getContext('2d').globalAlpha = 1;
		} else {
			canvas.getContext('2d').globalAlpha += 0.05;
			setTimeout(RenderInterface.setGlobalAlpha, 20);
		}
	}
}