class RenderInterface {
	static times = [];
	static debugInfo = true;
	static nextFrame = [];
	static context = canvas.getContext("2d");
	/**
	 * Добавление изображения в список отрисовываемых элементов
	 * @param {*} _image - изображение
	 * @param {*} _x - позиия x
	 * @param {*} _y - позиия y
	 * @param {*} _width - ширина
	 * @param {*} _height - длина
	 * @param {*} _depth - глубина отрисовки (элементы с большей глубиной отрисовываются первыми)
	 */
	static drawImage(_depth = 0, _image, _sx, _sy, _sWidth, _sHeight, _x, _y, _width, _height) {
		this.nextFrame.push({
			type: "image",
			image: _image,
			sx: _sx,
			sy: _sy,
			sWidth: _sWidth,
			sHeight: _sHeight,
			x: _x,
			y: _y,
			width: _width,
			height: _height,
			depth: _depth,
		});
	}
	static fillText(_depth = 0, _text, _x = 0, _y = 0, _maxWidth = undefined) {
		this.nextFrame.push({
			type: "text",
			x: _x,
			y: _y,
			text: _text,
			maxWidth: _maxWidth,
			depth: _depth,
		});
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
		this.nextFrame.forEach(object => {
			switch (object.type) {
				case "image":
					if (object.sx !== undefined && object.sy !== undefined && object.sWidth !== undefined && object.sHeight !== undefined) this.context.drawImage(object.image, object.sx, object.sy, object.sWidth, object.sHeight, object.x, object.y, object.width, object.height);
					else this.context.drawImage(object.image, object.x, object.y, object.width, object.height);
					break;
				case "text":
					this.context.fillStyle = "black";
					this.context.fillText(object.text, object.x, object.y, object.maxWidth);
					break;
				case "arc":
					this.context.beginPath();
					this.context.arc(object.x, object.y, object.radius, object.startAngle, object.endAngle, object.anticlockwise);
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
	}
	static Start() {
		canvas.getContext('2d').globalAlpha = 0;
		setTimeout(RenderInterface.changeGlobalAlpha, 17)
	}
	static Update(){
		this.renderNextFrame();
	}
	static changeGlobalAlpha() {
		canvas.getContext('2d').globalAlpha += 0.05
		if (canvas.getContext('2d').globalAlpha < 1) {
			setTimeout(RenderInterface.changeGlobalAlpha, 17)
		} else {
			canvas.getContext('2d').globalAlpha = 1;
		}
	}
}