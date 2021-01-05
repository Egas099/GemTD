class Events {
	static click = {
		button: {
			build() {
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
			},
			upgradeChances() {
				var updateCost = GameData.gems.chances.levels[GameData.gems.curentQalityLevel].upgrageCost;
				if (updateCost <= GameData.amountGold) {
					GameData.amountGold -= updateCost;
					GameData.gems.curentQalityLevel++;
				}
			},
			keep() {
				if (GameData.game.state === "choice") {
					if (!DS.existInBuildList()) return;
					GameData.build.gems.forEach(gem => {
						if (gem !== GameData.choice.obj) {
							Creator.InstantStone(gem.position);
							DS.takeMapSquare(gem.position, "stone");
							GameObject.Destroy(gem);
						}
					});
					GameData.build.gems = [];
					DS.clearInfoList();
					DS.clearGemsPrompt();
					GameData.buttons.rebuild.Disable();
					GameData.buttons.keep.Disable();
					GS.action.newWale();
				}
			},
			rebuild() {
				if (GameData.game.state === "choice") {
					let gem;
					GameData.amountGold -= GameData.config.game.rebuilCost;
					GameData.build.gems.forEach(gem => {
						DS.clearMapSquare(gem.position);
						GameObject.Destroy(gem);
					});
					GameData.build.gems = [];
					DS.clearInfoList();
					DS.clearGemsPrompt();
					GameData.buttons.rebuild.Disable();
					GameData.buttons.keep.Disable();
					GameData.game.state = "build";
					GameData.buttons.build.Enable();
				}
			},
			destroy() {
				if (GameData.choice.obj) {
					if (GameData.choice.obj.tag === "stone") {
						GameObject.Destroy(GameData.choice.obj);
						DS.clearMapSquare(GameData.choice.obj.position);
						DS.clearInfoList();
						GameData.buttons.destroy.Disable();
					}
				}
			},
			upgrade() {
				if (GameData.game.state === "choice") {
					const oldGem = GameData.build.gems.splice(GameData.build.gems.indexOf(GameData.choice.obj), 1)[0];
					const newQuality = GameData.gems.qualities[GameData.gems.qualities.indexOf(oldGem.quality) + 1];
					const atribytes = {
						gem: oldGem.name,
						quality: newQuality
					};
					const newGem = Creator.InstantGem(vector2(oldGem.position.x, oldGem.position.y + 5), atribytes);

					GameObject.Destroy(oldGem);
					Creator.createInfoList(newGem);
					// GameData.choice.obj = newGem;
					Events.click.button.keep();
				}
			},
		},
		object: {
			stone(_object) {
				Creator.createInfoList(_object);
				GameData.buttons.destroy.Enable();
			},
			enemy(_object) {
				Creator.createInfoList(_object);
			},
			gem(_object) {
				Creator.createInfoList(_object);
				if (GameData.game.state === "choice") {
					if (GameData.build.gems.find(gem => gem === _object)) {
						const count = GameData.build.gems.filter(
							gem => gem.name === _object.name && gem.quality === _object.quality).length;
						if (count > 1) {
							GameData.buttons.upgrade.Enable();
							return;
						}
					}
				}
			},
		},
		global(_clickPos) {
			DS.clearInfoList();
			if (GameData.game.state == "build")
				if (DS.checkBuildPlace(_clickPos))
					if (GameData.build.count > 0) {
						DS.takeMapSquare(_clickPos, "build");
						if (Algo.calcPath()) GS.action.build(_clickPos);
						else DS.clearMapSquare(_clickPos);
					}
		}
	}
	static hover = {
		button: {
			chances() {
				Creator.createInfoList({
					tag: "chances"
				});
			},
		},
		global(_mousePos) {
			if (GameData.game.state == "build" && _mousePos.x <= 800) {
				GameData.build.prompt.setPosition(Algo.roundPos(_mousePos));
				GameData.build.prompt.Enable();
			}
		}
	}
	static hoverEnter = {
		button(_object) {
			_object.getComponent("SpriteRender").setStyle({
				shadowBlur: 10,
				shadowColor: "rgba(50, 85, 139, 0.7)",
			});
		}
	}
	static hoverLeave = {
		button(_object) {
			_object.getComponent("SpriteRender").restoreStyle();
		}
	}
}
const GS = GameSystem = class GameSystem {
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
		GameData.buttons.upgrade = GameObject.Find("ButtonUpgrade");
		GameData.buttons.upgrade.Disable();
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
						if (GD.wale % 4 === 0) {
							Creator.InstantBat();
						} else {
							Creator.InstantHuman();
						}
						GameData.enemies.spawnCount--;
						GameData.enemies.lastSpawn = Date.now();
					}
				} else if (GameData.enemies.left == 0) {
					GS.action.endWale();
				}
				break;
			default:
				break;
		}
	}
	static action = {
		build(_position) {
			let buildPos = Algo.roundPos(_position);
			let gem = Creator.InstantGem(buildPos)
			DS.takeMapSquare(_position, "gem");
			GameData.build.count--;
			GameData.build.gemsPrompts.push(Creator.InstantBuiltGemOutline(gem));
			Events.click.object.gem(gem);
		},
		newWale() {
			GameData.enemies.groundWay = Algo.calcPath();
			GameData.game.state = "defence";
		},
		endWale() {
			GameData.wale++;
			GameData.game.state = "view";
			GameData.enemies.spawnCount = GameData.config.game.enemiesPerWave;
			GameData.buttons.build.Enable();
		},
		enemyDie(_object) {
			GameObject.Destroy(_object);
			GameData.enemies.left--;
			GameData.amountGold += Math.round(GameData.wale * 1.1);
		},
		enemyEscape(_object) {
			GameData.lives -= _object.state.damage;
			_object.Disable();
			GameObject.Destroy(_object);
			GameData.enemies.left--;
		},
	}
}
const DS = DataSystem = class DataSystem {
	static translate(_word) {
		try {
			if (GameData.localisation[_word]) {
				return GameData.localisation[_word];
			}
		} catch { }
		if (!GameData.notTranslated.find(word => word == _word)) {
			GameData.notTranslated.push(_word);
			console.warn(`Translation error: Can't translate "${_word}"`);
		}
		return _word;
	}
	static clearInfoList() {
		if (GameData.infoList) {
			GameData.infoList.forEach((object) => {
				GameObject.Destroy(object);
			});
		}
		GameData.choice.obj = undefined;
		GameData.infoList = [];
		GameData.buttons.destroy.Disable();
		GameData.buttons.upgrade.Disable();
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
		let pos = DS.fromGlobalToMapPos(_clickPos);
		if (GameData.build.protectedCells.find(cell => Vector2.Equal(pos, cell))) return false;
		else if (GameData.build.protectedCells.find(cell => Vector2.Equal(Vector2.goFront(pos), cell))) return false;
		else if (GameData.build.protectedCells.find(cell => Vector2.Equal(Vector2.goRight(pos), cell))) return false;
		else if (GameData.build.protectedCells.find(cell => Vector2.Equal(new Vector2(pos.x + 1, pos.y + 1), cell))) return false;

		if ((DS.isFreePlace(pos)) &&
			(DS.isFreePlace(Vector2.goFront(pos))) &&
			(DS.isFreePlace(Vector2.goRight(pos))) &&
			(DS.isFreePlace(new Vector2(pos.x + 1, pos.y + 1)))) {
			return true;
		}
		return false;
	}
	static clearMapSquare(_position) {
		let pos = DS.fromGlobalToMapPos(_position);
		GameData.build.map[pos.x][pos.y] = undefined;
		GameData.build.map[pos.x + 1][pos.y] = undefined;
		GameData.build.map[pos.x][pos.y + 1] = undefined;
		GameData.build.map[pos.x + 1][pos.y + 1] = undefined;
	}
	static takeMapSquare(_position, _name) {
		let pos = DS.fromGlobalToMapPos(_position);
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
		DS.clearInfoList();
		let infoText;
		GameData.choice.obj = _object;
		switch (_object.tag) {
			case "stone":
				infoText = [`${upFirst(DS.translate("stone"))}`];
				GameData.infoList.push(Creator.InstantSelectionOutline(_object));
				break;
			case "gem":
				infoText = [
					`${upFirst(DS.translate(_object.quality))} ${DS.translate(_object.name)}`,
					"",
					(_object.state.damageMin !== _object.state.damageMax) ?
						`${upFirst(DS.translate("damage"))}: ${_object.state.damageMin}-${_object.state.damageMax}` :
						`${upFirst(DS.translate("damage"))}: ${_object.state.damageMin}`,
					`${upFirst(DS.translate("rate of fire"))}: ${_object.state.fireRate}`,
					`${upFirst(DS.translate("range"))}: ${_object.state.range}`,
				];
				infoText.push(`${upFirst(DS.translate("skills"))}:`)
				let i = 1;
				for (const skill in _object.state.skills) {
					if (Object.hasOwnProperty.call(_object.state.skills, skill)) {
						const element = _object.state.skills[skill];
						infoText.push(`${i}. ${DS.translate(element.title)}`);
						i++;
					}
				}
				GameData.infoList.push(Creator.InstantGemRange(_object));
				GameData.infoList.push(Creator.InstantSelectionOutline(_object));
				break;
			case "enemy":
				infoText = () => {
					let text = [
						`${upFirst(DS.translate("enemy"))}`,
						"",
						`${upFirst(DS.translate("health"))}: ${_object.state.health}`,
						`${upFirst(DS.translate("speed"))}: ${Math.round10(_object.state.speed, -2)}`,
						`${upFirst(DS.translate("damage"))}: ${_object.state.damage}`,
					];
					text.push(`${upFirst(DS.translate("effects"))}:`)
					let curI = 1;
					for (const effect in _object.state.effects) {
						if (Object.hasOwnProperty.call(_object.state.effects, effect)) {
							text.push(`${curI}. ${DS.translate(_object.state.effects[effect].name)}: ${Math.round(_object.state.effects[effect].timeLeft() / 100) / 10}`);
							curI++;
						}
					}
					if (curI === 1) {
						text.push(`none`);
					}
					return text;
				};
				break;
			case "chances":
				infoText = () => {
					let chances = GameData.gems.chances.levels[GameData.gems.curentQalityLevel].chances;
					return [
						`${upFirst(DS.translate("chances"))}`,
						"",
						`${DS.translate("chipped")}:      ${chances["chipped"]}%`,
						`${DS.translate("flawed")}:  ${chances["flawed"]}% `,
						`${DS.translate("normal")}:   ${chances["normal"]}%`,
						`${DS.translate("flawless")}:  ${chances["flawless"]}%`,
						`${DS.translate("perfect")}:     ${chances["perfect"]}%`,
					]
				};
				break;
			default:
				break;
		}
		GameData.infoList.push(Creator.InstantInfoListBack(infoText));
		return true;
	}
	static InstantInfoListBack(_infoText) {
		return GameObject.Instantiate({
			name: "infoListBack",
			depth: 101,
			infoText: _infoText,
			position: new Vector2(1000, 450),
			size: vector2(350, 300),
			createComponentsFor(_parent) {
				return [
					new TextRender(_parent, this.infoText, 11, GD.config.style.textMain),
					new SpriteRender(_parent, sprites.windowBack, 11, undefined),
				];
			},
		})
	}
	static InstantGemRange(_object) {
		return GameObject.Instantiate({
			name: "gemRange",
			depth: _object.depth,
			radius: _object.state.range,
			position: _object.position,
			size: new Vector2(0, 0),
			createComponentsFor(_parent) {
				return [new ArcRender(_parent, this.radius, 5)];
			},
		})
	}
	static InstantSelectionOutline(_object) {
		return GameObject.Instantiate({
			name: "selectionOutline",
			depth: _object.depth - 1,
			position: new Vector2(_object.position.x, _object.position.y + 6),
			size: new Vector2(50, 50),
			createComponentsFor(_parent) {
				return [new SpriteRender(_parent, sprites.selectionOutline, 0)];
			},
		});
	}
	static InstantHuman() {
		GameData.enemies.left++;
		return GameObject.Instantiate({
			stats: GameData.enemies.info.human,
			health: Math.round(GameData.enemies.info.human.health + 10 * (Math.floor(GameData.wale * 1.9) - 1)),
			attributes: {
				tag: "enemy",
			},
			depth: 10,
			position: new Vector2(10, 90),
			size: new Vector2(40, 50),
			createComponentsFor(_parent) {
				return [
					new State(_parent,),
					new EnemyController(_parent, {
						health: {
							value: this.health,
							props: {
								max: this.health,
								min: 0,
							}
						},
						damage: this.stats.damage + Math.round(GameData.wale / 10),
						type: this.stats.type,
					}),
					new SpriteRender(_parent,
						sprites.enemies.human,
						0,
						{
							onClick: Events.click.object.enemy,
						}),
					new MoveController(_parent, {
						speed: {
							value: (this.stats.speed + (GameData.wale / 20)),
							props: {
								min: 0,
							}
						},
					}, GameData.enemies.groundWay, GS.action.enemyEscape),
					new HealthBar(_parent),
				];
			},
		});
	}
	static InstantBat() {
		GameData.enemies.left++;
		return GameObject.Instantiate({
			stats: GameData.enemies.info.bat,
			health: Math.round(GameData.enemies.info.human.health + 10 * (Math.floor(GameData.wale * 1.5) - 1)),
			attributes: {
				tag: "enemy",
			},
			depth: 11,
			position: new Vector2(10, 90),
			size: new Vector2(40, 50),
			createComponentsFor(_parent) {
				return [
					new State(_parent),
					new EnemyController(_parent, {
						health: {
							value: this.health,
							props: {
								max: this.health,
								min: 0,
							}
						},
						damage: this.stats.damage + Math.round(GameData.wale / 10),
						type: this.stats.type,
					}),
					new SpriteRender(_parent,
						sprites.enemies.bat,
						0,
						{
							onClick: Events.click.object.enemy,
						},
						GD.config.style.bat),
					new MoveController(_parent, {
						speed: (this.stats.speed + (GameData.wale / 20)),
					}, GameData.enemies.flyWay(), GS.action.enemyEscape),
					new HealthBar(_parent),
				];
			},
		});
	}
	static InstantShell(_owner, _target, _damage) {
		GameObject.Instantiate({
			shellSpeed: Math.floor(_owner.state.range / 11),
			owner: _owner,
			target: _target,
			damage: _damage,
			attributes: {
				tag: "shell",
			},
			position: _owner.position,
			size: new Vector2(20, 20),
			createComponentsFor(_parent) {
				return [
					new State(_parent),
					new SpriteRender(_parent, sprites.shells[this.owner.name], 100),
					new ShellController(_parent, this.owner, this.target, this.damage, 10),
					new MoveController(_parent, {
						speed: this.shellSpeed,
					}, [this.target.position]),
				];
			},
		});
	}
	static InstantGem(_position, _character) {
		let dropped;
		if (_character) {
			dropped = _character;
		} else {
			dropped = Algo.getRandomGem();
		}
		const stats = GameData.gems.info.qualitiesPools[dropped.quality][dropped.gem];
		const gem = GameObject.Instantiate({
			attributes: {
				name: dropped.gem,
				quality: dropped.quality,
				tag: "gem",
			},
			depth: 10,
			position: new Vector2(_position.x, _position.y - 5),
			size: new Vector2(40, 50),
			stats: stats,
			createComponentsFor(_parent) {
				return [
					new EventController(_parent),
					new State(_parent, this.stats.skills),
					new SpriteRender(_parent,
						sprites.gems[dropped.gem + dropped.quality],
						0,
						{
							onClick: Events.click.object.gem,
						},
						GD.config.style.gem),
					new GemController(_parent),
					new AttackEnemy(_parent, {
						damage: {
							value: 0,
							props: {
								min: this.stats.minDamage,
								max: this.stats.maxDamage,
							}
						},
						range: this.stats.fireRange * 1.5,
						fireRate: this.stats.fireRate,
						targetType: this.stats.targetType,
					}),
				];
			},
		})
		GameData.build.gems.push(gem);
		return gem;
	}
	static InstantStone(_position) {
		return GameObject.Instantiate({
			attributes: {
				tag: "stone",
			},
			depth: 10,
			position: vector2(_position.x, _position.y),
			size: new Vector2(40, 50),
			createComponentsFor(_parent) {
				return [
					new SpriteRender(_parent,
						sprites.stones[Math.floor(Math.random() * 4)],
						0,
						{
							onClick: Events.click.object.stone,
						},
						GD.config.style.stone),
				];
			},
		})
	}
	static InstantBuiltGemOutline(_object) {
		return GameObject.Instantiate({
			depth: _object.depth - 1.1,
			position: new Vector2(_object.position.x, _object.position.y + 6),
			size: new Vector2(50, 50),
			createComponentsFor(_parent) {
				return [new SpriteRender(_parent, sprites.selectionOutlineBlack, 0)];
			},
		});
	}
}
class Algo {
	static getRandomGem() {
		var droppedQuality, droppedGem;
		let arrChance = GameData.gems.chances.levels[GameData.gems.curentQalityLevel].chances;
		var chance = arrChance[GameData.gems.qualities[0]];
		var luck = Math.random() * 100;
		for (let i = 0; i <= GameData.gems.qualities.length; i++) {
			if (luck <= chance) {
				droppedQuality = GameData.gems.qualities[i];
				break;
			}
			chance += arrChance[GameData.gems.qualities[i + 1]];
		}
		let gemNames = Object.keys(GameData.gems.info.qualitiesPools[droppedQuality]);
		droppedGem = gemNames[Math.floor(Math.random() * gemNames.length)];

		////debug///////////////////////////
		let debugQuality = ["chipped"];
		droppedQuality = debugQuality[Math.floor(Math.random() * debugQuality.length)];
		// let debugGems = ["diamond"];
		// droppedGem = debugGems[Math.floor(Math.random() * debugGems.length)];
		////debug///////////////////////////

		return {
			gem: droppedGem,
			quality: droppedQuality
		};
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
			if (DS.isFreePlace(curPos = Vector2.goFront(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos)))
					paths.push(newNode);
			if (DS.isFreePlace(curPos = Vector2.goBack(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos)))
					paths.push(newNode);
			if (DS.isFreePlace(curPos = Vector2.goLeft(parentNode.position)))
				if (!existInPath(newNode = new Node(parentNode, curPos)))
					paths.push(newNode);
			if (DS.isFreePlace(curPos = Vector2.goRight(parentNode.position)))
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
					console.error("The limit of the climbed vertices is reached (Algorithm A *)");
				}
			}
		}

		function algo() {
			if (Vector2.Equal(_startPos, _targetPos)) return [];
			let node = new Node(undefined, _startPos, 0);
			checkedPaths.push(node);

			if (findVay(node)) {
				let finishPoint = paths.pop();
				returnPath.push(DS.fromMapToGlobalPos(finishPoint.position));
				let nextNode = finishPoint.parent;

				while (nextNode !== undefined) {
					returnPath.push(DS.fromMapToGlobalPos(nextNode.position));
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