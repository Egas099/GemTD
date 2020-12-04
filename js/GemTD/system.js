class Events {
	static buttonClick = {
		buttonBuildClick() {
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
	}
	static globalClick(_clickPos) {
		DataSystem.clearInfoList();
		if (GameData.game.state == "build")
			if (DataSystem.checkBuildPlace(_clickPos))
				if (GameData.build.count > 0) {
					DataSystem.takeMapSquare(_clickPos, "build");
					if (Algo.calcPath()) GameSystem.actionBuild(_clickPos);
					else DataSystem.clearMapSquare(_clickPos);
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
			if (!DataSystem.existInBuildList()) return;
			let gem;
			GameData.build.gems.forEach(gem => {
				if (gem !== GameData.choice.obj) {
					Creator.InstantStone(gem.position);
					DataSystem.takeMapSquare(gem.position, "stone");
					GameObject.Destroy(gem);
				}
			});
			GameData.build.gems = [];
			DataSystem.clearInfoList();
			DataSystem.clearGemsPrompt();
			GameData.buttons.rebuild.Disable();
			GameData.buttons.keep.Disable();
			GameSystem.actionNewWale();
		}
	}
	static buttonRebuildClick() {
		if (GameData.game.state === "choice") {
			let gem;
			GameData.amountGold -= GameData.config.game.rebuilCost;
			GameData.build.gems.forEach(gem => {
				DataSystem.clearMapSquare(gem.position);
				GameObject.Destroy(gem);

			});
			GameData.build.gems = [];
			DataSystem.clearInfoList();
			DataSystem.clearGemsPrompt();
			GameData.buttons.rebuild.Disable();
			GameData.buttons.keep.Disable();
			GameData.game.state = "build";
			GameData.buttons.build.Enable();
		}
	}
	static buttonCombineClick() {
		console.log("хи"); //////////////
	}
	static buildHover(_mousePos) {
		if (GameData.game.state == "build" && _mousePos.x <= 800) {
			GameData.build.prompt.setPosition(Algo.roundPos(_mousePos));
			GameData.build.prompt.Enable();
		}
	}
	static buttonDestroyClick() {
		if (GameData.choice.obj) {
			if (GameData.choice.obj.name === "stone") {
				GameObject.Destroy(GameData.choice.obj);
				DataSystem.clearMapSquare(GameData.choice.obj.position);
				DataSystem.clearInfoList();
				GameData.buttons.destroy.Disable();
			}
		}
	}
	static stoneClick(_object) {
		Creator.createInfoList(_object);
		GameData.buttons.destroy.Enable();
	}
	static enemyClick(_object) {
		Creator.createInfoList(_object);
	}
}
class GameSystem {
	static Start() {
		GameData.buttons.build = GameObject.Find("ButtonBuild");
		GameData.buttons.keep = GameObject.Find("ButtonKeep");
		GameData.buttons.keep.Disable();
		GameData.build.prompt = GameObject.Find("BuildPrompt");
		GameData.build.prompt.Disable();
		GameData.buttons.destroy = GameObject.Find("ButtonDestroy");
		GameData.buttons.destroy.Disable();
		GameData.buttons.rebuild = GameObject.Find("ButtonRebuild");
		GameData.buttons.rebuild.Disable();
		GameData.buttons.combine = GameObject.Find("ButtonCombine");
		GameData.buttons.combine.Disable();
	}
	static Update() {
		switch (GameData.game.state) {
			case "build":
				if (GameData.build.count === 0) {
					GameData.buttons.build.Disable();
					GameData.game.state = "choice";
					GameData.build.prompt.Disable();
					GameData.build.count = GameData.config.game.buildCountPerWave;
					if (GameData.config.game.rebuilCost <= GameData.amountGold)
						GameData.buttons.rebuild.Enable();
				}
				break;
			case "choice":
				if ((GameData.choice.obj) && (Algo.thereIs(GameData.choice.obj, GameData.build.gems))) {
					GameData.buttons.keep.Enable();
				} else {
					GameData.buttons.keep.Disable();
				}
				break;
			case "defence":
				if (GameData.enemies.spawnCount > 0) {
					if (Date.now() - GameData.enemies.lastSpawn > GameData.config.game.enemiesSpawnTimeOut) {
						Creator.InstantHuman();
						GameData.enemies.spawnCount--;
						GameData.enemies.lastSpawn = Date.now();
					}
				} else if (GameData.enemies.left == 0) {
					GameSystem.actionEndWale();
				}
				break;
			default:
				break;
		}
	}
	static actionBuild(_position) {
		let gem;
		let buildPos = Algo.roundPos(_position);
		Creator.createInfoList(gem = Creator.InstantRandomGem(buildPos));
		DataSystem.takeMapSquare(_position, "gem");
		GameData.build.count--;
		Creator.InstantGemPrompt(gem);
	}
	static actionNewWale() {
		GameData.enemies.groundWay = Algo.calcPath();
		GameData.game.state = "defence";
	}
	static actionEndWale() {
		GameData.wale++;
		GameData.game.state = "view";
		GameData.enemies.spawnCount = GameData.config.game.enemiesPerWave;
		GameData.buttons.build.Enable();
	}
	static actionEnemyDie(_object) {
		GameObject.Destroy(_object);
		GameData.enemies.left--;
		GameData.amountGold += Math.round(GameData.wale * 1.1);
	}
	static actionEnemyEscape(_object) {
		GameData.lives -= _object.damage;
		GameObject.Destroy(_object);
		GameData.enemies.left--;
	}
}
class DataSystem {
	static clearInfoList() {
		if (GameData.infoList) {
			GameData.infoList.forEach((object) => {
				GameObject.Destroy(object);
			});
		}
		GameData.choice.obj = undefined;
		GameData.infoList = [];
		GameData.buttons.destroy.Disable();
	}
	static clearGemsPrompt() {
		if (GameData.build.gemsPrompts) {
			GameData.build.gemsPrompts.forEach((object) => {
				GameObject.Destroy(object);
			});
		}
		GameData.build.gemsPrompts = [];
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
		let pos = DataSystem.fromGlobalToMapPos(_clickPos);
		if (GameData.build.protectedCells.find(cell => Vector2.Equal(pos, cell))) return false;
		else if (GameData.build.protectedCells.find(cell => Vector2.Equal(Vector2.goFront(pos), cell))) return false;
		else if (GameData.build.protectedCells.find(cell => Vector2.Equal(Vector2.goRight(pos), cell))) return false;
		else if (GameData.build.protectedCells.find(cell => Vector2.Equal(new Vector2(pos.x + 1, pos.y + 1), cell))) return false;

		if ((DataSystem.isFreePlace(pos)) &&
			(DataSystem.isFreePlace(Vector2.goFront(pos))) &&
			(DataSystem.isFreePlace(Vector2.goRight(pos))) &&
			(DataSystem.isFreePlace(new Vector2(pos.x + 1, pos.y + 1)))) {
			return true;
		}
		return false;
	}
	static clearMapSquare(_position) {
		let pos = DataSystem.fromGlobalToMapPos(_position);
		GameData.build.map[pos.x][pos.y] = undefined;
		GameData.build.map[pos.x + 1][pos.y] = undefined;
		GameData.build.map[pos.x][pos.y + 1] = undefined;
		GameData.build.map[pos.x + 1][pos.y + 1] = undefined;
	}
	static takeMapSquare(_position, _name) {
		let pos = DataSystem.fromGlobalToMapPos(_position);
		GameData.build.map[pos.x][pos.y] = _name;
		GameData.build.map[pos.x + 1][pos.y] = _name;
		GameData.build.map[pos.x][pos.y + 1] = _name;
		GameData.build.map[pos.x + 1][pos.y + 1] = _name;
	}
	static existInBuildList() {
		return GameData.build.gems.find(gem => gem === GameData.choice.obj);
	}
	static fromMapToGlobalPos(_mapPos) {
		return {
			x: _mapPos.x * 20 + 10,
			y: _mapPos.y * 20 + 10
		};
	}
	static fromGlobalToMapPos(_globalPos) {
		return new Vector2(Math.floor((_globalPos.x - 10) / 20), Math.floor((_globalPos.y - 10) / 20));
	}
	static isFreePlace(_placePos) {
		if ((_placePos.x > 39) || (_placePos.x < 0) || (_placePos.y > 39) || (_placePos.y < 0)) {
			return false;
		} else if (GameData.build.map[_placePos.x][_placePos.y]) {
			return false;
		} else return true;
	}
}
class Creator {
	static createInfoList(_object) {
		DataSystem.clearInfoList();
		let text;
		GameData.choice.obj = _object;
		switch (_object.name) {
			case "gem":
				text = [
					"Драгоценный камень",
					"",
					(_object.damageMin !== _object.damageMax) ?
					"Урон: " + _object.damageMin + "-" + _object.damageMax :
					"Урон: " + _object.damageMin,
					"Скорострельность: " + _object.fireRate,
					"Растояние: " + _object.range,
				];
				GameData.infoList.push(GameObject.Instantiate({
					depth: _object.depth,
					radius: _object.range,
					position: _object.position,
					size: new Vector2(0, 0),
					createComponentsFor(_parent) {
						return [new ArcRender(_parent, this.radius, 5)];
					},
				}));
				break;
			case "stone":
				text = ["Камень"];
				break;
			case "enemy":
				text = () => {
					return [
						"Враг",
						"",
						"Здоровье: " + _object.health,
						"Скорость: " + _object.speed,
						"Урон: " + _object.damage,
					]
				};
				break;
			default:
				break;
		}
		if (_object.name === "gem" || _object.name === "stone") {
			GameData.infoList.push(GameObject.Instantiate({
				depth: _object.depth - 1,
				position: new Vector2(_object.position.x, _object.position.y + 6),
				size: new Vector2(50, 50),
				createComponentsFor(_parent) {
					return [new SpriteRender(_parent, sprites.selectionOutline, 0)];
				},
			}));
		}
		GameData.infoList.push(GameObject.Instantiate({
			depth: 101,
			text: text,
			position: new Vector2(1000, 500),
			size: new Vector2(350, 200),
			createComponentsFor(_parent) {
				return [
					new TextRender(_parent, this.text, 11),
					new SpriteRender(_parent, sprites.windowBack, 11),
				];
			},
		}));
		return true;
	}
	static InstantHuman() {
		GameData.enemies.left++;
		return GameObject.Instantiate({
			stat: GameData.enemies.info.human,
			health: Math.round(GameData.enemies.info.human.health + 10 * (Math.floor(GameData.wale * 1.9) - 1)),
			name: "enemy",
			depth: 10,
			position: new Vector2(10, 90),
			size: new Vector2(40, 40),
			createComponentsFor(_parent) {
				return [
					new EnemyController(_parent, {
						health: this.health,
						healthMax: this.health,
						damage: this.stat.damage + Math.round(GameData.wale / 10),
						speed: (this.stat.speed + (GameData.wale / 11)) * Math.ceil(GameData.wale / 10),
						type: this.stat.type,
					}),
					new SpriteRender(_parent, sprites.human, 0, Events.enemyClick),
					new MoveController(_parent, 1, GameData.enemies.groundWay, GameSystem.actionEnemyEscape),
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
			size: new Vector2(20, 20),
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
		const gemType = Algo.getRandomGem();
		const stat = GameData.gems.info.types[gemType[0]].quality[gemType[1]];
		const gem = GameObject.Instantiate({
			name: "gem",
			depth: 10,
			position: new Vector2(_position.x, _position.y - 5),
			size: new Vector2(40, 50),
			stat: stat,
			targetType: GameData.gems.info.types[gemType[0]].targetType,
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sritesGems[gemType[0] + gemType[1]], 0, Creator.createInfoList),
					new GemController(_parent),
					new AttackEnemy(_parent, {
						damageMin: this.stat.minDamage,
						damageMax: this.stat.maxDamage,
						range: this.stat.fireRange * 1.5,
						fireRate: this.stat.fireRate,
						targetType: this.targetType,
					}),
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
			size: new Vector2(40, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent, sprites.stone, 0, Events.stoneClick),
				];
			},
		})
	}
	static InstantGemPrompt(_object) {
		let prompt;
		GameData.build.gemsPrompts.push(prompt = GameObject.Instantiate({
			depth: _object.depth - 1.1,
			position: new Vector2(_object.position.x, _object.position.y + 6),
			size: new Vector2(50, 50),
			createComponentsFor(_parent) {
				return [new SpriteRender(_parent, sprites.selectionOutlineBlack, 0)];
			},
		}));
		return prompt;
	}
}
class Algo {
	static getRandomGem() {
		var droppedQuality, droppedGem;
		let arrChance = GameData.gems.chances.levels[GameData.gems.curentQalityLevel].chances;
		var chance = arrChance[GameData.gems.quality[0]];
		var luck = Math.random() * 100;
		for (let i = 0; i <= GameData.gems.quality.length; i++) {
			if (luck <= chance) {
				droppedQuality = GameData.gems.quality[i];
				break;
			}
			chance += arrChance[GameData.gems.quality[i + 1]];
		}
		droppedGem = GameData.gems.names[Math.floor(Math.random() * GameData.gems.names.length)];
		return [droppedGem, droppedQuality];
	}
	static thereIs(_object, _objects) {
		if (_objects.find(obj => obj == _object)) return true;
		else return false;
	}
	static roundPos(_position) {
		return {
			x: Math.round(_position.x / 20) * 20,
			y: Math.round(_position.y / 20) * 20
		};
	}
	static AStar(_startPos, _targetPos) {
		let returnPath = [];
		let checkedPaths = [];
		let paths = [];
		let predel = 0;
		class Node {
			constructor(_parent, _position, _tD = _parent.tD + .6) {
				this.parent = _parent;
				this.position = _position;
				this.tD = _tD; // travel distance
				this.rD = Vector2.Distance(_position, _targetPos); // remaining distance
				this.c = this.rD + this.tD; // travel + remaining distance
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
			if (DataSystem.isFreePlace(curPos = Vector2.goFront(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos)))
					paths.push(newNode);
			if (DataSystem.isFreePlace(curPos = Vector2.goBack(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos)))
					paths.push(newNode);
			if (DataSystem.isFreePlace(curPos = Vector2.goLeft(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos)))
					paths.push(newNode);
			if (DataSystem.isFreePlace(curPos = Vector2.goRight(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos)))
					paths.push(newNode);

			paths.sort((a, b) => (a.c !== b.c) ? ((a.c < b.c) ? 1 : -1) : Math.round(Math.random()));

			if (!paths[paths.length - 1])
				return false;
			if (paths[paths.length - 1].rD === 0) {
				return true;
			} else {
				checkedPaths.push(newNode = paths.pop());
				if (predel < 1600) {
					predel++;
					return findVay(newNode);
				} else {
					console.log("Предел количества обходимых вершин");
				}
			}
		}

		function algo() {
			if (Vector2.Equal(_startPos, _targetPos)) return [];
			let node = new Node(undefined, _startPos, 0);
			checkedPaths.push(node);

			if (findVay(node)) {
				let finishPoint = paths.pop();
				returnPath.push(DataSystem.fromMapToGlobalPos(finishPoint.position));
				let nextNode = finishPoint.parent;

				while (nextNode !== undefined) {
					returnPath.push(DataSystem.fromMapToGlobalPos(nextNode.position));
					nextNode = nextNode.parent;
				}
				return returnPath.reverse();
			} else {
				return false;
			}
		}
		return algo();
	}
	static calcPath() {
		let path = [];
		let curPath = [];
		for (let i = 1; i < GameData.enemies.MovePoint.length; i++) {
			curPath = Algo.AStar(GameData.enemies.MovePoint[i - 1], GameData.enemies.MovePoint[i]);
			if (curPath) {
				path = path.concat(curPath);
			} else {
				return false;
			}
		}
		let change;
		do {
			change = false;
			for (let i = 1; i < path.length - 1; i++) {
				if (path[i - 1].x == path[i].x && path[i].x == path[i + 1].x) {
					path.splice(i, 1);
					change = true;
					break;
				} else if (path[i - 1].y == path[i].y && path[i].y == path[i + 1].y) {
					path.splice(i, 1);
					change = true;
					break;
				}
			}
		} while (change);
		return path;
	}
}