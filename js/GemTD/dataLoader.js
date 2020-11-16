var game;
class GameData {
	static config;
	static game = {
		state: "view",
		stateNames: ["view", "build", "choice", "defense"],
		elapsedTime: 0,

	};
	static buttons = {
		build: undefined,
		upgradeChances: undefined,
		keep: undefined,
	};
	static enemies = {
		spawnCount: undefined,
		lastSpawn: Date.now(),
		spawnDelay: 500,
		left: 0,
		movePath: () => {
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
		protectedCell: [],
		map: [],
		mapGet: (position) => {
			if ((position.x > 39) || (position.x < 0)  || (position.y > 39) || (position.y < 0)) {
				return false;
			} else if (this.build.map[position.x][position.y]) {
				return false;
			} else return true;
		},
		prompt: undefined,
		count: undefined,
		gems: [],
		isExist: () => {
			for (let i = 0; i < GameData.build.gems.length; i++) {
				if (GameData.build.gems[i] === GameData.choice.obj) {
					return true;
				}
			}
			return false;
		}
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
	static DieEnemy(_object) {
		GameData.enemies.left--;
		GameData.amountGold += Math.round(GameData.wale * 1.5);
	}
}
initMap();

function initMap(params) {
	for (let i = 0; i < 40; i++){
		GameData.build.map.push([]);
	}
}

DataSystem.readTextFile("js/dataFiles/config.json", function (inputData) {
	GameData.config = inputData;
	GameData.enemies.perWave = inputData.data.enemiesPerWave;
	GameData.enemies.spawnCount = inputData.data.enemiesPerWave;
	GameData.amountGold = inputData.data.startAmountGold;
	GameData.build.count = inputData.data.buildCountPerWave;
	GameData.build.protectedCell = inputData.map.protectedCell;
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

function createVector2(x, y) {
	return {
		x: x,
		y: y,
	};
}
var initialInstancesOfGameObjects = {
	// tileMap: {
	//     position: createVector2(canvas.width/2, canvas.height/2),
	//     size: createVector2(750, 750),
	//     createComponentsFor(_parent) {
	//         return [
	//             new TileMap( _parent, new Vector2(40, 40), sprites.tile, -100),
	//         ];
	//     },
	// },
	BattleBackground: {
		name: "BattleBackground",
		depth: 0,
		position: createVector2(400, 400),
		size: createVector2(800, 800),
		createComponentsFor(_parent) {
			return [new SpriteRender(_parent, sprites.buttleBackground, 0)];
		},
	},
	GUIBack: {
		name: "GUIBack",
		depth: 100,
		position: createVector2(1000, 400),
		size: createVector2(400, 800),
		createComponentsFor(_parent) {
			return [new SpriteRender(_parent, sprites.backInterface)];
		},
	},
	goldLabel: {
		depth: 101,
		position: createVector2(1030, 20),
		size: createVector2(350, 50),
		createComponentsFor(_parent) {
			return [new TextRender(_parent, () => {
				return "Золото: " + GameData.amountGold;
			}, 2)];
		},
	},
	livesLabel: {
		depth: 101,
		position: createVector2(1200, 20),
		size: createVector2(350, 50),
		createComponentsFor(_parent) {
			return [new TextRender(_parent, () => {
				return "Жизни: " + GameData.lives;
			}, 2)];
		},
	},
};