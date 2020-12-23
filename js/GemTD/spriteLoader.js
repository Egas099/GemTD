const spritesPath = "sprites/";
var sprites = {}

function loadSpriteSheet(_spriteSheet) {
	var sprites = {
		type: "spriteSheet"
	};
	const image = createImg(_spriteSheet.path);
	const amountX = _spriteSheet.column.length;
	const amountY = _spriteSheet.rows.length;
	const spWidth = _spriteSheet.width;
	const spHeight = _spriteSheet.height;
	for (var x = 0; x < amountX; x++) {
		for (let y = 0; y < amountY; y++) {
			sprites[_spriteSheet.rows[y] + _spriteSheet.column[x]] = {
				img: createImg(_spriteSheet.path),
				sx: x * spWidth,
				sy: y * spHeight,
				sWidth: spWidth,
				sHeight: spHeight,
			}
		}
	}
	return sprites;
}
var spritesInfo = {
	backInterface: spritesPath + "UI/backInterface.jpg",
	button: spritesPath + "UI/button.png",
	windowBack: spritesPath + "UI/windowBack.bmp",
	buttleBackground: spritesPath + "buttleBackground.bmp",
	randomGem: spritesPath + "heroes/randomGem.bmp",
	selectionOutline: spritesPath + "selectionOutline.png",
	selectionOutlineBlack: spritesPath + "squareBlack.png",
	labelBack: spritesPath + "UI/back.png",
	enemies: {
		type: "spriteSheet",
		path: spritesPath + "heroes/enemies.png",
		width: 40,
		height: 50,
		column: ["human", "bat"],
		rows: [""],
	},
	shells: {
		type: "spriteSheet",
		path: spritesPath + "heroes/gemShells.png",
		width: 20,
		height: 20,
		column: ["emerald", "aquamarine", "opal", "ruby", "diamond", "sapphire", "amethyst", "topaz",],
		rows: [""],
	},
	healthBars: {
		type: "spriteSheet",
		path: spritesPath + "UI/healthBars.bmp",
		width: 4,
		height: 2,
		column: ["green", "lime", "red", "black"],
		rows: [""],
	},
	gems: {
		type: "spriteSheet",
		path: spritesPath + "heroes/gems.png",
		width: 40,
		height: 50,
		rows: ["emerald", "aquamarine", "opal", "ruby", "diamond", "sapphire", "amethyst", "topaz",],
		column: ["chipped", "flawed", "normal", "flawless", "perfect", "greate",],
	},
	stones: {
		type: "spriteSheet",
		path: spritesPath + "heroes/stones.png",
		width: 40,
		height: 50,
		column: ["0", "1", "2", "3"],
		rows: [""],
	},
	icons: {
		type: "spriteSheet",
		path: spritesPath + "UI/icons.png",
		width: 40,
		height: 40,
		column: ["heart", "coin"],
		rows: [""],
	},
}

function loadSprites() {
	for (const sprite in spritesInfo) {
		if (typeof spritesInfo[sprite] === "string") {
			sprites[sprite] = createImg(spritesInfo[sprite]);
		} else if (typeof spritesInfo[sprite] === "object" && spritesInfo[sprite].type === "spriteSheet") {
			sprites[sprite] = loadSpriteSheet(spritesInfo[sprite]);
		}
	}
}

function createImg(_path) {
	const newImg = new Image();
	newImg.src = _path;
	return newImg;
}
loadSprites();
