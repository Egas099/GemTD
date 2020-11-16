var delay = 50;
var lastAlgo = Date.now();
var pathObjects = [];
var dx = 20,
	dy = 20;

function calcPos(_clickPos) {
	return {
		x: Math.round(_clickPos.x / dx) * dx,
		y: Math.round(_clickPos.y / dy) * dy
	};
}
class EventSystem {
	static addEventListeners() {
		canvas.addEventListener('click', ClickHandler.clickEvent, false);
		canvas.addEventListener('mousemove', ClickHandler.mouseMoveEvent, false);
		document.addEventListener('keypress', ClickHandler.KeyEvent, false);
	}
	static buildClick(_clickPos) {
		DataSystem.ClearInfoList();
		if (GameData.game.state == "build" && _clickPos.x <= 800) {
			if (DataSystem.checkBuildPlace(_clickPos)) {
				let newPos = calcPos(_clickPos);
				GameSystem.ActionBuild(newPos);
			}
		}
		if (delay + lastAlgo < Date.now()) {
			lastAlgo = Date.now();
			if (GameData.game.state == "view" && _clickPos.x <= 800) {
				let pos = {
					x: Math.floor((_clickPos.x) / dx),
					y: Math.floor((_clickPos.y) / dy)
				}
				Algo.AStar(pos, new Vector2(19, 19));
			}
		}
	}
	static buttonBuildClick() {
		switch (GameData.game.state) {
			case "view":
				GameData.game.state = "build";
				break;
			case "build":
				GameData.build.prompt.Disable();
				GameData.game.state = "view";
				break;
			default:
				break;
		}
	}
	static buttonUpgradeChancesClick() {
		var updateCost = GameData.gems.chances.levels[GameData.gems
			.curentQalityLevel].upgrageCost;
		if (updateCost <= GameData.amountGold) {
			GameData.amountGold -= updateCost;
			GameData.gems.curentQalityLevel++;
		}
	}
	static buttonKeepClick() {
		if (GameData.game.state === "choice") {
			if (!GameData.build.isExist()) return;
			let gem;
			let len = GameData.build.gems.length;
			for (let i = 0; i < len; i++) {
				gem = GameData.build.gems.pop();
				if (gem !== GameData.choice.obj) {
					Creator.InstantStone(gem.position);
					DataSystem.takeMapSquare(gem.position, "stone");
					GameObject.Destroy(gem);
				}
			}
			GameData.build.gems = [];
			DataSystem.ClearInfoList();
			GameData.buttons.keep.Disable();
			GameData.game.state = "defence";
		}
	}
	static buildHover(_mousePos) {
		if (GameData.game.state == "build" && _mousePos.x <= 800) {
			let newPos = calcPos(_mousePos);
			GameData.build.prompt.setPosition(newPos);
			GameData.build.prompt.Enable();
		}
		// if (delay + lastAlgo < Date.now()) {
		// 	lastAlgo = Date.now();
		// 	if (GameData.game.state == "view" && _mousePos.x <= 800) {
		// 		let pos = {
		// 			x: Math.floor((_mousePos.x - 10) / dx),
		// 			y: Math.floor((_mousePos.y - 10) / dy)
		// 		}
		// 		Algo.AStar(pos, new Vector2(19, 19));
		// 	}
		// }
	}
	static buttonDestroyClick() {
		if (GameData.choice.obj) {
			if (GameData.choice.obj.name === "stone") {
				GameObject.Destroy(GameData.choice.obj);
				DataSystem.clearMapSquare(GameData.choice.obj);
				DataSystem.ClearInfoList();
				GameData.buttons.destroy.Disable();
			}
		}
	}
	static stoneClick(_object) {
		Creator.CreateInfoList(_object);
		GameData.buttons.destroy.Enable();
	}
	static enemyClick(_object) {
		Creator.CreateInfoList(_object);
	}
}
class GameSystem {
	static Start() {
		EventSystem.addEventListeners();
		GameData.buttons.build = Creator.InstantButtonBuild();
		GameData.buttons.keep = Creator.InstantButtonKeep();
		GameData.buttons.keep.Disable();
		GameData.build.prompt = Creator.InstantPrompt();
		GameData.build.prompt.Disable();
		GameData.buttons.destroy = Creator.InstantButtonDestroy();
		GameData.buttons.destroy.Disable();
		Creator.InstantButtonUpgradeChances();

		// DataSystem.takeMapSquare(new Vector2(20, 20), "gem");
	}
	static Update() {
		switch (GameData.game.state) {
			case "build":
				if (GameData.build.count === 0) {
					GameData.buttons.build.Disable();
					GameData.game.state = "choice";
					GameData.build.prompt.Disable();
					GameData.build.count = 5;
				}
				break;
			case "choice":
				if ((GameData.choice.obj) && (Algo.IsExist(GameData.choice
						.obj, GameData.build.gems))) {
					GameData.buttons.keep.Enable();
				} else {
					GameData.buttons.keep.Disable();
				}
				break;
			case "defence":
				if (GameData.enemies.spawnCount > 0) {
					if (Date.now() - GameData.enemies.lastSpawn > GameData
						.enemies.spawnDelay) {
						Creator.InstantHuman();
						GameData.enemies.spawnCount--;
						GameData.enemies.lastSpawn = Date.now();
					}
				} else if (GameData.enemies.left == 0) {
					GameData.wale++;
					GameData.game.state = "view";
					GameData.enemies.spawnCount = GameData.enemies.perWave;
					GameData.buttons.build.Enable();
				}
				break;
			default:
				break;
		}
	}
	static ActionBuild(_position) {
		if (GameData.build.count > 0) {
			Creator.CreateInfoList(Creator.InstantRandomGem(_position));
			DataSystem.takeMapSquare(_position, "gem");
			GameData.build.count--;
		}
	}
}
class DataSystem {
	static ClearInfoList() {
		if (GameData.infoList) {
			GameData.infoList.forEach((object) => {
				GameObject.Destroy(object);
			});
		}
		GameData.choice.obj = undefined;
		GameData.infoList = [];
		GameData.buttons.destroy.Disable();
	}
	static readTextFile(file, callback) {
		var rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", file, true);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				callback(JSON.parse(rawFile.responseText));
			}
		};
		rawFile.send(null);
	}
	static checkBuildPlace(_clickPos) {
		let pos = {
			x: Math.floor((_clickPos.x - 10) / dx),
			y: Math.floor((_clickPos.y - 10) / dy)
		}
		if ((pos.x > 38) || (pos.y > 38) || (pos.x < 0) || (pos.y < 0)) {
			return false;
		} else if ((!GameData.build.map[pos.x][pos.y])
			&& (!GameData.build.map[pos.x + 1][pos.y])
			&& (!GameData.build.map[pos.x][pos.y + 1])
			&& (!GameData.build.map[pos.x + 1][pos.y + 1])) {
			return true;
		}
		return false;
	}
	static clearMapSquare(_object) {
		let pos = {
			x: Math.floor((_object.position.x - 10) / dx),
			y: Math.floor((_object.position.y - 10) / dy)
		}
		GameData.build.map[pos.x][pos.y] = undefined;
		GameData.build.map[pos.x + 1][pos.y] = undefined;
		GameData.build.map[pos.x][pos.y + 1] = undefined;
		GameData.build.map[pos.x + 1][pos.y + 1] = undefined;
	}
	static takeMapSquare(_position, _name) {
		let pos = {
			x: Math.floor((_position.x - 10) / dx),
			y: Math.floor((_position.y - 10) / dy)
		}
		GameData.build.map[pos.x][pos.y] = _name;
		GameData.build.map[pos.x + 1][pos.y] = _name;
		GameData.build.map[pos.x][pos.y + 1] = _name;
		GameData.build.map[pos.x + 1][pos.y + 1] = _name;
	}

}
class Creator {
	static CreateInfoList(_object) {
		DataSystem.ClearInfoList();
		let text;
		GameData.choice.obj = _object;
		switch (_object.name) {
			case "gem":
				const AE = _object.findComponentByName("AttackEnemy");
				text = [
					"Урон: " + AE.damage,
					"Скорострельность: " + AE.fireRate,
					"Растояние: " + AE.range,
				];
				GameData.infoList.push(GameObject.Instantiate({
					depth: _object.depth,
					radius: AE.range,
					position: _object.position,
					size: createVector2(0, 0),
					createComponentsFor(_parent) {
						return [new ArcRender(_parent, this.radius, 5)];
					},
				}));
				break;
			case "stone":
				text = ["Камень"];
				break;
			case "enemy":
				const EC = _object.findComponentByName("EnemyController");
				text = () => {
					return [
						"Здоровье: " + EC.health,
						"Скорость: " + EC.speed,
						"Урон: " + EC.damage,
					]
				};
				break;
			default:
				break;
		}
		if (_object.name === "gem" || _object.name === "stone") {
			GameData.infoList.push(GameObject.Instantiate({
				depth: _object.depth - 1,
				position: new Vector2(_object.position.x, _object.position.y),
				size: createVector2(60, 60),
				createComponentsFor(_parent) {
					return [new SpriteRender(_parent, sprites.selectionOutline, 0)];
				},
			}));
		}
		GameData.infoList.push(GameObject.Instantiate({
			depth: 101,
			text: text,
			position: createVector2(1000, 500),
			size: createVector2(350, 200),
			createComponentsFor(_parent) {
				return [
					new TextRender(_parent, this.text, 11),
					new SpriteRender(_parent, sprites.windowBack, 11),
				];
			},
		}));
		return true;
	}
	static InstantButtonUpgradeChances() {
		return GameObject.Instantiate({
			depth: 101,
			position: createVector2(1000, 351),
			size: createVector2(350, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.button, 0,
						EventSystem.buttonUpgradeChancesClick),
					new TextRender(_parent, "Улучшить шансы",
						2),
				];
			},
		});
	}
	static InstantButtonBuild() {
		return GameObject.Instantiate({
			depth: 101,
			name: "ButtonBuild",
			position: createVector2(1000, 300),
			size: createVector2(350, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.button, 0,
						EventSystem.buttonBuildClick,
						EventSystem.btnHover),
					new TextRender(_parent, "Строить", 2),
				];
			},
		});
	}
	static InstantButtonImproveQality() {
		return GameObject.Instantiate({
			depth: 101,
			position: createVector2(1000, 700),
			size: createVector2(350, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.button,
						1),
					new TextRender(_parent, "Улучшить", 2),
				];
			},
		});
	}
	static InstantButtonCombine() {
		return GameObject.Instantiate({
			depth: 101,
			position: createVector2(1000, 755),
			size: createVector2(350, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.button,
						1),
					new TextRender(_parent, "Комбинировать", 2),
				];
			},
		});
	}
	static InstantButtonKeep() {
		return GameObject.Instantiate({
			depth: 101,
			position: createVector2(1000, 645),
			size: createVector2(350, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.button, 1,
						EventSystem.buttonKeepClick),
					new TextRender(_parent, "Оставить", 2),
				];
			},
		});
	}
	static InstantHuman() {
		GameData.enemies.left++;
		return GameObject.Instantiate({
			depth: 10,
			name: "enemy",
			speed: 1 * (GameData.wale / 10 + 1),
			health: 10 * GameData.wale,
			position: createVector2(10, 90),
			size: createVector2(40, 40),
			createComponentsFor(_parent) {
				return [
					new EnemyController(_parent, this.health, this.health, 10, this.speed),
					new SpriteRender(_parent, sprites.human, 1, EventSystem.enemyClick),
					new MoveController(_parent, 1, GameData.enemies.movePath(), (obj) => {
						GameData.lives--;
						GameObject.Destroy(obj);
						GameData.DieEnemy();
					}),
					new HealthBar(_parent),
				];
			},
		});
	}
	static InstantShell(_position, _target, _damage) {
		GameObject.Instantiate({
			target: _target,
			damage: _damage,
			name: "shell",
			position: _position,
			size: createVector2(20, 20),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.gemShell, 100),
					new ShellController(_parent, this.target, this.damage, 10),
					new MoveController(_parent, 15, [this.target.position]),
				];
			},
		});
	}
	static InstantRandomGem(_position) {
		const gemType = Algo.GetRandomGem();
		const stat = GameData.gems.info.types[gemType[0]].quality[gemType[1]];
		const gem = GameObject.Instantiate({
			name: "gem",
			damage: Math.round(stat.minDamage + Math.random() * (stat.maxDamage - stat.minDamage)),
			fireRate: stat.fireRate,
			fireRange: stat.fireRange,
			depth: 10,
			position: {
				x: _position.x,
				y: _position.y
			},
			size: createVector2(40, 40),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sritesGems[gemType[0] + gemType[1]], 0,
						Creator.CreateInfoList),
					new GemController(_parent),
					new AttackEnemy(_parent, this.damage,
						this.fireRange * 1.5, this.fireRate
					),
				];
			},
		})
		GameData.build.gems.push(gem);
		return gem;
	}
	static InstantStone(_position) {
		return GameObject.Instantiate({
			name: "stone",
			depth: 10,
			position: {
				x: _position.x,
				y: _position.y
			},
			size: createVector2(40, 40),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.stone, 0, EventSystem.stoneClick),
				];
			},
		})
	}
	static InstantPrompt() {
		return GameObject.Instantiate({
			name: "Prompt",
			depth: 10,
			position: {
				x: 0,
				y: 0
			},
			size: createVector2(40, 40),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.stone, 0),
				];
			},
		})
	}
	static InstantButtonDestroy() {
		return GameObject.Instantiate({
			depth: 101,
			name: "ButtonDestroy",
			position: createVector2(1000, 645),
			size: createVector2(350, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.button, 0,
						EventSystem.buttonDestroyClick),
					new TextRender(_parent, "Разрушить", 2),
				];
			},
		});
	}
	static InstantSqvare(_position, _color = "stone") {
		return GameObject.Instantiate({
			name: "sq",
			depth: (_color === "red") ? 99 : 100,
			position: {
				x: _position.x,
				y: _position.y
			},
			size: createVector2(20, 20),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent,
						(_color === "green")? sprites.greenPixel :((_color === "red") ? sprites.redPixel : sprites.stone) , 0),
				];
			},
		})
	}
}
class Algo {
	static GetRandomGem() {
		var droppedQuality, droppedGem;
		let arrChance = GameData.gems.chances.levels[GameData.gems
			.curentQalityLevel].chances;
		var chance = arrChance[GameData.gems.quality[0]];
		var luck = Math.random() * 100;
		for (let i = 0; i <= GameData.gems.quality.length; i++) {
			if (luck <= chance) {
				droppedQuality = GameData.gems.quality[i];
				break;
			}
			chance += arrChance[GameData.gems.quality[i + 1]];
		}
		droppedGem = GameData.gems.names[Math.floor(Math.random() * GameData
			.gems.names.length)];
		return [droppedGem, droppedQuality];
	}
	static IsExist(_object, _objects) {
		for (const key in _objects) {
			if (_object == _objects[key]) {
				return true;
			}
		}
		return false;
	}
	static AStar(_startPos, _targetPos) {
		let checkedPaths = [];
		let paths = [];
		let predel = 0;
		class Node {
			constructor(_parent, _position) {
				this.parent = _parent;
				this.position = _position;
				this.rD = Vector2.Distance(_position, _targetPos); //remaining distance
			}
		}

		function existInPath(_node) {
			for (const i in paths) {
				if (Vector2.Equal(_node.position, paths[i].position)) {
					return true;
				}
			}
			for (const i in checkedPaths) {
				if (Vector2.Equal(_node.position, checkedPaths[i].position)) {
					return true;
				}
			}
			return false;
		}

		function findVay(parentNode) {
			let curPos, newNode;
			pathObjects.push(Creator.InstantSqvare(calcPos(parentNode.position), "green"));
			if (GameData.build.mapGet(curPos = Vector2.goFront(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos))) {
					pathObjects.push(Creator.InstantSqvare(calcPos(newNode.position), "red"));
					paths.push(newNode);
				}
			if (GameData.build.mapGet(curPos = Vector2.goBack(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos))) {
					pathObjects.push(Creator.InstantSqvare(calcPos(newNode.position), "red"));
					paths.push(new Node(parentNode, curPos));
				}
			if (GameData.build.mapGet(curPos = Vector2.goLeft(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos))) {
					pathObjects.push(Creator.InstantSqvare(calcPos(newNode.position), "red"));
					paths.push(new Node(parentNode, curPos));
				}
			if (GameData.build.mapGet(curPos = Vector2.goRight(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos))) {
					pathObjects.push(Creator.InstantSqvare(calcPos(newNode.position), "red"));
					paths.push(new Node(parentNode, curPos));
				}

			paths.sort((a, b) => (a.rD < b.rD) ? 1 : -1);
			if (paths[paths.length - 1].rD === 0) {
				pathObjects.push(Creator.InstantSqvare(calcPos(paths[paths.length - 1].position)));
				return;
			} else {
				checkedPaths.push(newNode = paths.pop());
				if (predel < 1599) {
					predel++;
					findVay(newNode);
				} else {
					console.log("Предел количества обходимых вершин");
				}
			}
		}

		function calcPos(_pos = new Vector2(39, 39)) {
			return {
				x: _pos.x * 20 + 10,
				y: _pos.y * 20 + 10,
			}
		}

		function algo() {
			// console.clear();
			for (let i = 0; i < pathObjects.length; i++) {
				GameObject.Destroy(pathObjects[i]);
			}
			let node;
			// console.log(_startPos);
			node = new Node(undefined, _startPos);
			if (node.rD === 0) {
				return;
			}
			checkedPaths.push(node);
			findVay(node);
			// console.log("Пройдено путей: ", checkedPaths.length, checkedPaths);
			// console.log("Непроверенные пути: ", paths.length, paths);
			let ePath = [];
			let rd = paths[paths.length - 1].rD;
			let p = paths[paths.length - 1].parent;
		}
		algo();
	}
}