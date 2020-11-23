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
		prompt: undefined,
		count: undefined,
		gems: [],
		protectedCell: [],
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

	GameData.build.protectedCell = inputData.map.pointCell;
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