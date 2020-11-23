class ClickHandler {
	static SortingObjectsByDepth(objects) {
		objects.sort((a, b) => a.depth !== b.depth ? (a.depth < b.depth ? 1 : -1) : (a.position
			.y < b.position.y ? 1 : -1));
		return objects;
	}
	static FindObjectsOnPosition(_clickPos) {
		var objects = [];
		game.prototypesGameObject.forEach(object => {
			if ((object.IsEnable()) && ClickHandler.IsInclude(_clickPos, object) && (
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
		var mousePos = ClickHandler.calcMousePosition(_event);
		var objects = ClickHandler.FindObjectsOnPosition(mousePos);
		if (objects.length != 0) {
			objects = ClickHandler.SortingObjectsByDepth(objects);
			if (!objects[0].findComponentByName("SpriteRender").onHover(objects[0])) {
				EventSystem.buildHover(mousePos);
			}
		}
	}
	static clickEvent(_event) {
		let clickPos = ClickHandler.calcMousePosition(_event);
		var objects = ClickHandler.FindObjectsOnPosition(clickPos);
		if (objects.length != 0) {
			objects = ClickHandler.SortingObjectsByDepth(objects);
			if (!objects[0].findComponentByName("SpriteRender").onClick(objects[0])) {
				EventSystem.globalClick(clickPos);
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
				EventSystem.buttonBuildClick();
				break;
			case "D":
				EventSystem.buttonDestroyClick();
				break;
			case "Space":
				EventSystem.buttonKeepClick();
				break;
			default:
				break;
		}
	}
}