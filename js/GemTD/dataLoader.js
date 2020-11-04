var game;
class GameData {
    static buttonBuild;
    static gameState = "view";
    static stateNames = ["view", "build", "defense"];
    static buildCount = 5;
    static lastSpawn = Date.now();
    static enemyCount = 10;

    static gemNames = [];
    static gems;

    static chances;
    static quality = [];
    static curentQalityLevel = 8;

    static infoList;
    
    static amountGold  = 20;
    static wale = 1;
}
GameSystem.readTextFile("js/dataFiles/chances.json", function(text){
    GameData.chances = JSON.parse(text);
    for (const quality in GameData.chances.levels[0].chances) {
        GameData.quality.push(quality);
    }
});
GameSystem.readTextFile("js/dataFiles/gems.json", function(text){
    GameData.gems = JSON.parse(text);
    for (const quality in GameData.gems.types) {
        GameData.gemNames.push(quality);
    }
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
                new SpriteRender(_parent, sprites.button, 1, GameSystem.InstantHuman),
                new TextRender(_parent, "Создать человечка", 2),
            ];
        },
    },
    
}
var objectPrefabs = initialInstancesOfGameObjects;

