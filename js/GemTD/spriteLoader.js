const spritesPath = "sprites/";
var sprites = {}

function loadSpriteSheet(_spriteSheet) {
	var sprites = {
		type: "sheet"
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
var sritesGems = {
	path: spritesPath + "heroes/gems.png",
	width: 40,
	height: 50,
	rows: ["emerald", "aquamarine", "opal", "ruby", "diamond", "sapphire", "amethyst", "topaz", ],
	column: ["chipped", "flawed", "normal", "flawless", "perfect", "greate", ],
}
sritesGems = loadSpriteSheet(sritesGems);
var spritesPaths = {
	backInterface: spritesPath + "UI/backInterface.jpg",
	button: spritesPath + "UI/rockButton.png",
	gemShell: spritesPath + "heroes/gemShell.png",
	greenPixel: spritesPath + "UI/HealthBar/GreenPixel.bmp",
	redPixel: spritesPath + "UI/HealthBar/RedPixel.bmp",
	limePixel: spritesPath + "UI/HealthBar/LimePixel.bmp",
	blackPixel: spritesPath + "UI/HealthBar/BlackPixel.bmp",
	human: spritesPath + "heroes/human.png",
	tile: spritesPath + "tile.png",
	windowBack: spritesPath + "UI/windowBack.bmp",
	buttleBackground: spritesPath + "buttleBackground.bmp",
	randomGem: spritesPath + "heroes/randomGem.bmp",
	selectionOutline: spritesPath + "selectionOutline.png",
	selectionOutlineBlack: spritesPath + "squareBlack.png",
	stone: spritesPath + "heroes/stone.png",
}

function loadSprites() {
	for (const sprite in spritesPaths) {
		sprites[sprite] = createImg(spritesPaths[sprite]);
	}
}

function createImg(_path) {
	const newImg = new Image();
	newImg.src = _path;
	return newImg;
}
loadSprites();