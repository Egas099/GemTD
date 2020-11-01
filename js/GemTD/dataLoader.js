var game;
class GameData {
    static ClearInfoList(){
        if (GameData.infoList) {
            GameData.infoList.forEach(object => {
                GameObject.Destroy(object);
            });
        }
        GameData.infoList = [];
    }
    static quality = [];
    static infoList;
    static amountGold  = 20;
    static wale = 0;
}
GameSystem.readTextFile("js/dataFiles/chances.json", function(text){
    var data = JSON.parse(text);
    for (const quality in data.levels[1].chances) {
        GameData.quality.push(quality);
    }
    GameSystem.InstantRandomDem(data.levels[3].chances);
});

var buildLevel = 0;
// var buildChancesData = ;
var movePath = () => {
    return [
        new Vector2(170, 90),  //→
        new Vector2(150, 450),  //↓
        new Vector2(650, 450),  //→
        new Vector2(650, 90),  //↑
        new Vector2(390, 90),  //←
        new Vector2(390, 690),  //↓
        new Vector2(790, 690),  //→
    ]
}
function createVector2(x, y) {
    return {
        x: x,
        y: y,
    };
}
function func() {
    console.log("Hi");
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
    // human: {
    //     depth: 1,
    //     position: createVector2(10, 90),
    //     size: createVector2(40, 40),
    //     createComponentsFor(_parent) {
    //         return [
    //             new SpriteRender(_parent, sprites.human, 1),
    //             new MoveController(_parent, 10, movePath()),
    //             new EnemyController(_parent, 10, 10, 10),
    //             new HealthBar(_parent),
    //         ];
    //     },
    // },
    BattleBackground: {
        depth: 0,
        position: createVector2(400, 400),
        size: createVector2(800, 800),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.buttleBackground, 0),
            ];
        },
    },
    gem1: {
        depth: 1,
        position: createVector2(300, 260),
        size: createVector2(40, 50),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.gem, 0, GameSystem.CreateGemInfoList),
                new GemController(_parent),
                new AttackEnemy(_parent, 1, 300, 1000),
            ];
        },
    },
    gem2: {
        depth: 1,
        position: createVector2(300, 300),
        size: createVector2(40, 50),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.gem, 0, GameSystem.CreateGemInfoList),
                new GemController(_parent),
                new AttackEnemy(_parent, 1, 200, 400),
            ];
        },
    },
    
    clickHandler: {
        position: createVector2(0, 0),
        size: createVector2(0, 0),
        createComponentsFor(_parent) {
            return [
                new ClickHandler(_parent),
            ];
        },
    },
    GUIBack: {
        depth: 100,
        position: createVector2(1000, 400),
        size: createVector2(400, 800),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.backInterface),
            ];
        },
    },
    
    button1: {
        depth: 101,
        position: createVector2(1000, 750),
        size: createVector2(300, 50),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.button, 1, button1Click),
                new TextRender(_parent, "Создать человечка", 2),
            ];
        },
    }
}
var objectPrefabs = initialInstancesOfGameObjects;
const spritesPath = "sprites/";
var spritesPaths = {
    backInterface: spritesPath + "UI/backInterface.jpg",
    button: spritesPath + "UI/rockButton.png",
    gem: spritesPath + "heroes/gem.png",
    gemShell: spritesPath + "heroes/gemShell.png",
    greenPixel: spritesPath + "UI/HealthBar/GreenSqvare.bmp",
    human: spritesPath + "heroes/human.png",
    redPixel: spritesPath + "UI/HealthBar/RedSqvare.bmp",
    tile: spritesPath + "tile.png",
    windowBack: spritesPath + "UI/windowBack.bmp",
    buttleBackground: spritesPath + "buttleBackground.bmp",
    selectionOutline: spritesPath + "selectionOutline.png",
}
var sprites = {}
loadSprites();
function loadSprites(){
    for (const sprite in spritesPaths) {
        let newSprite = new Image();
        newSprite.src = spritesPaths[sprite];
        sprites[sprite] = newSprite;
    }
}
