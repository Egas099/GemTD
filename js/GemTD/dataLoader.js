var game;
class GameData {
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
		info: {},
		groundWay: undefined,
		lastSpawn: Date.now(),
		left: 0,
		flyWay: () => {
			return [
				new Vector2(170, 90), //→
				new Vector2(150, 450), //↓
				new Vector2(650, 450), //→
				new Vector2(650, 90), //↑
				new Vector2(390, 90), //←
				new Vector2(390, 690), //↓
				new Vector2(790, 690), //→
			];
		},
	};
	static gems = {
		info: {},
		gemNames: [],
		chances: {},
		quality: [],
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
}
for (let i = 0; i <= 39; i++)
	GameData.build.map.push([]);

DataSystem.readTextFile("js/dataFiles/config.json", function (inputData) {
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
		GameData.gems.quality.push(quality);
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
				name: "BattleBackground",
				depth: 0,
				position: new Vector2(400, 400),
				size: new Vector2(800, 800),
				createComponentsFor(_parent) {
					return [new SpriteRender(_parent, sprites.buttleBackground, 0)];
				},
			},
			GUIBack: {
				name: "GUIBack",
				depth: 100,
				position: new Vector2(1000, 400),
				size: new Vector2(400, 800),
				createComponentsFor(_parent) {
					return [new SpriteRender(_parent, sprites.backInterface)];
				},
			},
			goldLabel: {
				depth: 101,
				position: new Vector2(1030, 20),
				size: new Vector2(350, 50),
				createComponentsFor(_parent) {
					return [new TextRender(_parent, () => {
						return "Золото: " + GameData.amountGold;
					}, 2)];
				},
			},
			livesLabel: {
				depth: 101,
				position: new Vector2(1200, 20),
				size: new Vector2(350, 50),
				createComponentsFor(_parent) {
					return [new TextRender(_parent, () => {
						return "Жизни: " + GameData.lives;
					}, 2)];
				},
			},
		};
	}
}

function AddProtecteCells() {
	GameData.build.protectedCells.splice(0, 0, vector2(0, 4));
	GameData.build.protectedCells.splice(0, 0, vector2(39, 34));
	for (let x = 5; x < 11; x++) {
		for (let y = 4; y < 6; y++) {
			GameData.build.protectedCells.splice(0, 0, vector2(x, y));
		}
	}
	GameData.build.protectedCells.splice(0, 0, vector2(7, 6));
	GameData.build.protectedCells.splice(0, 0, vector2(8, 6));
	GameData.build.protectedCells.splice(0, 0, vector2(7, 7));
	GameData.build.protectedCells.splice(0, 0, vector2(8, 7));
	for (let x = 17; x < 23; x++) {
		for (let y = 4; y < 6; y++) {
			GameData.build.protectedCells.splice(0, 0, vector2(x, y));
		}
	}
	GameData.build.protectedCells.splice(0, 0, vector2(19, 6));
	GameData.build.protectedCells.splice(0, 0, vector2(20, 6));
	GameData.build.protectedCells.splice(0, 0, vector2(19, 7));
	GameData.build.protectedCells.splice(0, 0, vector2(20, 7));
	for (let x = 29; x < 35; x++) {
		for (let y = 4; y < 6; y++) {
			GameData.build.protectedCells.splice(0, 0, vector2(x, y));
		}
	}
	GameData.build.protectedCells.splice(0, 0, vector2(31, 6));
	GameData.build.protectedCells.splice(0, 0, vector2(32, 6));
	GameData.build.protectedCells.splice(0, 0, vector2(31, 7));
	GameData.build.protectedCells.splice(0, 0, vector2(32, 7));
	for (let y = 19; y < 25; y++) {
		for (let x = 7; x < 9; x++) {
			GameData.build.protectedCells.splice(0, 0, vector2(x, y));
		}
	}
	GameData.build.protectedCells.splice(0, 0, vector2(9, 21));
	GameData.build.protectedCells.splice(0, 0, vector2(10, 21));
	GameData.build.protectedCells.splice(0, 0, vector2(9, 22));
	GameData.build.protectedCells.splice(0, 0, vector2(10, 22));
	for (let y = 19; y < 25; y++) {
		for (let x = 31; x < 33; x++) {
			GameData.build.protectedCells.splice(0, 0, vector2(x, y));
		}
	}
	GameData.build.protectedCells.splice(0, 0, vector2(29, 21));
	GameData.build.protectedCells.splice(0, 0, vector2(30, 21));
	GameData.build.protectedCells.splice(0, 0, vector2(29, 22));
	GameData.build.protectedCells.splice(0, 0, vector2(30, 22));
	for (let x = 17; x < 23; x++) {
		for (let y = 33; y < 35; y++) {
			GameData.build.protectedCells.splice(0, 0, vector2(x, y));
		}
	}
	GameData.build.protectedCells.splice(0, 0, vector2(19, 31));
	GameData.build.protectedCells.splice(0, 0, vector2(20, 32));
	GameData.build.protectedCells.splice(0, 0, vector2(19, 31));
	GameData.build.protectedCells.splice(0, 0, vector2(20, 32));
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