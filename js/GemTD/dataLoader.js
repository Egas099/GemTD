var game = "";
const GD = GameData = class GameData {
	static config;
	static game = {
		state: "view",
		stateNames: ["view", "build", "choice", "defense"],
	};
	static buttons = {
		build: undefined,
		upgradeChances: undefined,
		keep: undefined,
	};
	static enemies = {
		type: "ground",
		info: {},
		groundWay: undefined,
		lastSpawn: Date.now(),
		left: 0,
		flyWay: () => [
			new Vector2(170, 90), //→
			new Vector2(170, 450), //↓
			new Vector2(650, 450), //→
			new Vector2(650, 90), //↑
			new Vector2(390, 90), //←
			new Vector2(390, 690), //↓
			new Vector2(790, 690), //→
		],
	};
	static gems = {
		info: {},
		gemNames: [],
		chances: {},
		qualities: [],
		curentQalityLevel: 0,
	};
	static build = {
		protectedCells: [],
		prompt: undefined,
		count: undefined,
		gems: [],
		gemsPrompts: [],
		map: [],
	};
	static choice = {
		gem: undefined,
	}
	static infoList;
	static amountGold;
	static lives = 100;
	static wale = 1;
	static mouse = {
		lastMove: Date.now(),
		moveDelay: 20,
	}
	static notTranslated = [];
}
for (let i = 0; i <= 39; i++)
	GameData.build.map.push([]);
DataSystem.readTextFile("js/dataFiles/config.json", function (inputData) {
	GameData.language = inputData.config.system.language;
	if (GameData.language != "en") {
		DataSystem.readTextFile(`js/localization/${GameData.language}.json`, function (inputData) {
			GameData.localisation = inputData;
		});
	}
	GameData.config = inputData.config;

	GameData.enemies.spawnCount = GameData.config.game.enemiesPerWave;
	GameData.amountGold = GameData.config.game.startAmountGold;
	GameData.build.count = GameData.config.game.buildCountPerWave;

	GameData.enemies.MovePoint = inputData.map.pointCell;
	AddProtecteCells();
});
DataSystem.readTextFile("js/dataFiles/chances.json", function (inputData) {
	GameData.gems.chances = inputData;
	for (const quality in GameData.gems.chances.levels[0].chances) {
		GameData.gems.qualities.push(quality);
	}
});
DataSystem.readTextFile("js/dataFiles/gems.json", function (inputData) {
	GameData.gems.info = inputData;
	GameData.gems.names = [];
	for (const type in GameData.gems.info.types) {
		GameData.gems.names.push(type);
	}
});
DataSystem.readTextFile("js/dataFiles/enemies.json", function (inputData) {
	GameData.enemies.info = inputData;
});

class Prefabs {
	static initialInstancesOfGameObjects = () => {
		return {
			BattleBackground: {
				attributes: {
					name: "BattleBackground"
				},
				depth: 0,
				position: new Vector2(400, 400),
				size: new Vector2(800, 800),
				createComponentsFor(parent) {
					return [new SpriteRender(parent, sprites.buttleBackground, 0)];
				},
			},
			BuildPrompt: {
				attributes: {
					name: "BuildPrompt"
				},
				depth: 1,
				position: vector2(0, 0),
				size: new Vector2(40, 40),
				createComponentsFor(parent) {
					return [
						new SpriteRender(parent, sprites.randomGem, 0),
					];
				},
			},
			GUIBack: {
				attributes: {
					name: "GUIBack"
				},
				depth: 100,
				position: new Vector2(1000, 400),
				size: new Vector2(400, 800),
				createComponentsFor(parent) {
					return [new SpriteRender(parent, sprites.backInterface, 0, undefined, {
						shadowBlur: 10,
						shadowColor: 'rgba(0, 0, 1, .5)',
					})];
				},
				children: {
					ButtonBuild: {
						attributes: {
							name: "ButtonBuild"
						},
						depth: 101,
						position: new Vector2(0, -200),
						size: new Vector2(350, 50),
						createComponentsFor(parent) {
							return [
								new SpriteRender(parent,
									sprites.button,
									0,
									{
										onClick: Events.click.button.build,
										onHoverEnter: Events.hoverEnter.button,
										onHoverLeave: Events.hoverLeave.button,
									},
									GD.config.style.button),
								new TextRender(parent,
									`${upFirst(DS.translate("build"))}`,
									2,
									GD.config.style.textMain),
							];
						},
					},
					ButtonUpgradeChances: {
						attributes: {
							name: "ButtonUpgradeChances"
						},
						depth: 101,
						position: new Vector2(0, -137),
						size: new Vector2(350, 50),
						createComponentsFor(parent) {
							return [
								new SpriteRender(parent, sprites.button, 0, {
									onClick: Events.click.button.upgradeChances,
									onHover: Events.hover.button.chances,
									onHoverEnter: Events.hoverEnter.button,
									onHoverLeave: Events.hoverLeave.button,
								}, GD.config.style.button),
								new TextRender(parent,
									`${upFirst(DS.translate("upgrade chances"))}`,
									2,
									GD.config.style.textMain),
							];
						},
					},
					ButtonKeep: {
						attributes: {
							name: "ButtonKeep"
						},
						depth: 101,
						position: new Vector2(0, 245),
						size: new Vector2(350, 50),
						createComponentsFor(parent) {
							return [
								new SpriteRender(parent, sprites.button, 1, {
									onClick: Events.click.button.keep,
									onHoverEnter: Events.hoverEnter.button,
									onHoverLeave: Events.hoverLeave.button,
								}, GD.config.style.button),
								new TextRender(parent,
									`${upFirst(DS.translate("keep"))}`,
									2,
									GD.config.style.textMain),
							];
						},
					},
					ButtonRebuild: {
						attributes: {
							name: "ButtonRebuild"
						},
						depth: 101,
						position: new Vector2(0, -200),
						size: new Vector2(350, 50),
						createComponentsFor(parent) {
							return [
								new SpriteRender(parent, sprites.button, 0, {
									onClick: Events.click.button.rebuild,
									onHoverEnter: Events.hoverEnter.button,
									onHoverLeave: Events.hoverLeave.button,
								}, GD.config.style.button),
								new TextRender(parent,
									`${upFirst(DS.translate("rebuild"))}`,
									2,
									GD.config.style.textMain),
							];
						},
					},
					ButtonUpgrade: {
						attributes: {
							name: "ButtonUpgrade"
						},
						depth: 101,
						position: new Vector2(0, 355),
						size: new Vector2(350, 50),
						createComponentsFor(parent) {
							return [
								new SpriteRender(parent, sprites.button, 1, {
									onClick: Events.click.button.upgrade,
									onHoverEnter: Events.hoverEnter.button,
									onHoverLeave: Events.hoverLeave.button,
								}, GD.config.style.button),
								new TextRender(parent,
									`${upFirst(DS.translate("upgrade"))}`,
									2,
									GD.config.style.textMain),
							];
						},
					},
					ButtonDestroy: {
						attributes: {
							name: "ButtonDestroy"
						},
						depth: 101,
						position: new Vector2(0, 245),
						size: new Vector2(350, 50),
						createComponentsFor(parent) {
							return [
								new SpriteRender(parent, sprites.button, 0, {
									onClick: Events.click.button.destroy,
									onHoverEnter: Events.hoverEnter.button,
									onHoverLeave: Events.hoverLeave.button,
								}, GD.config.style.button),
								new TextRender(parent,
									`${upFirst(DS.translate("destroy"))}`,
									2,
									GD.config.style.textMain),
							];
						},
					},
					GoldLabel: {
						depth: 101,
						position: new Vector2(-90, -300),
						size: new Vector2(130, 50),
						createComponentsFor(parent) {
							return [new SpriteRender(parent, sprites.labelBack, 0, undefined, {
								shadowBlur: 10,
								shadowColor: 'rgba(1, 1, 1, .5)',
								shadowOffsetY: 5,
							})]
						},
						children: {
							GoldCount: {
								depth: 101,
								position: new Vector2(0, 5),
								size: new Vector2(130, 50),
								createComponentsFor(parent) {
									return [
										new TextRender(parent, () => {
											return `${GameData.amountGold}`;
										}, 2)];
								},
							},
							GoldIcon: {
								depth: 101,
								position: new Vector2(40, 0),
								size: new Vector2(40, 40),
								createComponentsFor(parent) {
									return [new SpriteRender(parent, sprites.icons.coin, 0)];
								},
							},
						}
					},
					LivesLabel: {
						x: 1090,
						y: 80,
						depth: 101,
						position: new Vector2(90, -300),
						size: new Vector2(130, 50),
						createComponentsFor(parent) {
							return [new SpriteRender(parent, sprites.labelBack, 0, undefined, {
								shadowBlur: 10,
								shadowColor: 'rgba(1, 1, 1, .5)',
								shadowOffsetY: 5,
							})]
						},
						children: {
							LivesCount: {
								depth: 101,
								position: new Vector2(0, 5),
								size: new Vector2(130, 50),
								createComponentsFor(parent) {
									return [
										new TextRender(parent, () => {
											return `${GameData.lives}`;
										}, 2)];
								},
							},
							LivesIcon: {
								depth: 101,
								position: new Vector2(40, 0),
								size: new Vector2(40, 40),
								createComponentsFor(parent) {
									return [new SpriteRender(parent, sprites.icons.heart, 0)];
								},
							},
						}
					},
					WaleLabel: {
						x: 1090,
						y: 80,
						depth: 101,
						position: new Vector2(0, -370),
						size: new Vector2(160, 40),
						createComponentsFor(parent) {
							return [new SpriteRender(parent, sprites.labelBack, 0, undefined, {
								shadowBlur: 10,
								shadowColor: 'rgba(1, 1, 1, .5)',
								shadowOffsetY: 5,
							})]
						},
						children: {
							LivesCount: {
								depth: 101,
								position: new Vector2(0, 3),
								size: new Vector2(160, 50),
								createComponentsFor(parent) {
									return [
										new TextRender(parent, () => {
											return `${upFirst(DS.translate("wale"))}: ${GameData.wale - 1}`;
										}, 2)];
								},
							},
						}
					},
				},
			},
		};
	}
	static other = {
	}
}

function AddProtecteCells() {
	GameData.build.protectedCells.push(vector2(0, 4));
	GameData.build.protectedCells.push(vector2(39, 34));
	for (let x = 5; x < 11; x++) {
		for (let y = 4; y < 6; y++) {
			GameData.build.protectedCells.push(vector2(x, y));
		}
	}
	GameData.build.protectedCells.push(vector2(7, 6));
	GameData.build.protectedCells.push(vector2(8, 6));
	GameData.build.protectedCells.push(vector2(7, 7));
	GameData.build.protectedCells.push(vector2(8, 7));
	for (let x = 17; x < 23; x++) {
		for (let y = 4; y < 6; y++) {
			GameData.build.protectedCells.push(vector2(x, y));
		}
	}
	GameData.build.protectedCells.push(vector2(19, 6));
	GameData.build.protectedCells.push(vector2(20, 6));
	GameData.build.protectedCells.push(vector2(19, 7));
	GameData.build.protectedCells.push(vector2(20, 7));
	for (let x = 29; x < 35; x++) {
		for (let y = 4; y < 6; y++) {
			GameData.build.protectedCells.push(vector2(x, y));
		}
	}
	GameData.build.protectedCells.push(vector2(31, 6));
	GameData.build.protectedCells.push(vector2(32, 6));
	GameData.build.protectedCells.push(vector2(31, 7));
	GameData.build.protectedCells.push(vector2(32, 7));
	for (let y = 19; y < 25; y++) {
		for (let x = 7; x < 9; x++) {
			GameData.build.protectedCells.push(vector2(x, y));
		}
	}
	GameData.build.protectedCells.push(vector2(9, 21));
	GameData.build.protectedCells.push(vector2(10, 21));
	GameData.build.protectedCells.push(vector2(9, 22));
	GameData.build.protectedCells.push(vector2(10, 22));
	for (let y = 19; y < 25; y++) {
		for (let x = 31; x < 33; x++) {
			GameData.build.protectedCells.push(vector2(x, y));
		}
	}
	GameData.build.protectedCells.push(vector2(29, 21));
	GameData.build.protectedCells.push(vector2(30, 21));
	GameData.build.protectedCells.push(vector2(29, 22));
	GameData.build.protectedCells.push(vector2(30, 22));
	for (let x = 17; x < 23; x++) {
		for (let y = 33; y < 35; y++) {
			GameData.build.protectedCells.push(vector2(x, y));
		}
	}
	GameData.build.protectedCells.push(vector2(19, 31));
	GameData.build.protectedCells.push(vector2(20, 32));
	GameData.build.protectedCells.push(vector2(19, 31));
	GameData.build.protectedCells.push(vector2(20, 32));
}

function vector2(_x, _y) {
	return {
		x: _x,
		y: _y
	}
}

function upFirst(str) {
	return (str) ? str[0].toUpperCase() + str.slice(1) : str;
}
function getWidth(_text) {
	return canvas.getContext('2d').measureText(_text).width;
}