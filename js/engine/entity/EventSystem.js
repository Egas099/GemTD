class EventSystem {
	static hoveredObject = {};
	static SortingObjectsByDepth(objects) {
		objects.sort((a, b) => a.depth !== b.depth ?
			(a.depth < b.depth ? 1 : -1) :
			(a.position.y < b.position.y ? 1 : -1));
		return objects;
	}
	static FindObjectsOnPosition(_clickPos) {
		var objects = [];
		game.prototypesGameObject.forEach(object => {
			if ((object.IsEnable()) && EventSystem.IsInclude(_clickPos, object)
				&& (object.getComponent("SpriteRender"))) {
				objects.push(object);
			}
		});
		return objects;
	}
	static IsInclude(_clickPos, _object) {
		if (Math.abs(_clickPos.x - _object.position.x) <= _object.size.x / 2)
			if (Math.abs(_clickPos.y - _object.position.y) <= _object.size.y / 2) return true;
		return false;
	}
	static calcMousePosition(_event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: (_event.clientX - rect.left) * (canvas.width / canvas.clientWidth),
			y: (_event.clientY - rect.top) * (canvas.height / canvas.clientHeight)
		};
	}
	static mouseMoveEvent(_event) {
		if (Date.now() - GameData.mouse.lastMove < GameData.mouse.moveDelay) {
			return;
		}
		GameData.mouse.lastMove = Date.now();
		var mousePos = EventSystem.calcMousePosition(_event);
		var objects = EventSystem.FindObjectsOnPosition(mousePos);
		if (objects.length != 0) {
			objects = EventSystem.SortingObjectsByDepth(objects);
			if (this.hoveredObject !== objects[0]) {
				if (this.hoveredObject) {
					this.hoveredObject.getComponent("SpriteRender").onHoverLeave(this.hoveredObject);
					objects[0].getComponent("SpriteRender").onHoverEnter(objects[0]);
				}
				this.hoveredObject = objects[0];
			}
			if (!objects[0].getComponent("SpriteRender").onHover(objects[0])) {
				Events.hover.global(mousePos);
			}
		}
	}
	static clickEvent(_event) {
		let clickPos = EventSystem.calcMousePosition(_event);
		var objects = EventSystem.FindObjectsOnPosition(clickPos);
		if (objects.length != 0) {
			objects = EventSystem.SortingObjectsByDepth(objects);
			if (!objects[0].getComponent("SpriteRender").onClick(objects[0])) {
				Events.click.global(clickPos);
			}
		}
	}
	static KeyEvent(_event) {
		let keyCode = _event.code;
		if (keyCode.slice(0, 3) === "Key") {
			keyCode = _event.code.slice(3, _event.code.length);
		}
		switch (keyCode) {
			case "B":
				Events.click.button.build();
				break;
			case "D":
				Events.click.button.destroy();
				break;
			case "R":
				Events.click.button.rebuild();
				break;
			case "Space":
				Events.click.button.keep();
				break;
			default:
				break;
		}
	}
	static Start() {
		canvas.addEventListener('click', EventSystem.clickEvent, false);
		canvas.addEventListener('mousemove', EventSystem.mouseMoveEvent, false);
		document.addEventListener('keypress', EventSystem.KeyEvent, false);
	}
}