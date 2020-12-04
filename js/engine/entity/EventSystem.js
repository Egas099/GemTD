class EventSystem {
	static SortingObjectsByDepth(objects) {
		objects.sort((a, b) => a.depth !== b.depth ?
			(a.depth < b.depth ? 1 : -1) :
			(a.position.y < b.position.y ? 1 : -1));
		return objects;
	}
	static FindObjectsOnPosition(_clickPos) {
		var objects = [];
		game.prototypesGameObject.forEach(object => {
			if ((object.IsEnable()) && EventSystem.IsInclude(_clickPos, object) && (
					object.findComponentByName("SpriteRender"))) {
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
			if (!objects[0].findComponentByName("SpriteRender").onHover(objects[0])) {
				Events.buildHover(mousePos);
			}
		}
	}
	static clickEvent(_event) {
		let clickPos = EventSystem.calcMousePosition(_event);
		var objects = EventSystem.FindObjectsOnPosition(clickPos);
		if (objects.length != 0) {
			objects = EventSystem.SortingObjectsByDepth(objects);
			if (!objects[0].findComponentByName("SpriteRender").onClick(objects[0])) {
				Events.globalClick(clickPos);
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
				Events.buttonBuildClick();
				break;
			case "D":
				Events.buttonDestroyClick();
				break;
			case "R":
				Events.buttonRebuildClick();
				break;
			case "Space":
				Events.buttonKeepClick();
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