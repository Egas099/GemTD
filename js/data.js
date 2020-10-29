const deltaTime = 20;
var movePath = () => {
    return [
        new Vector2(200, 200),  //→
        new Vector2(200, 400),  //↓
        new Vector2(600, 400),  //→
        new Vector2(600, 200),  //↑
        new Vector2(400, 200),  //←
        new Vector2(400, 600),  //↓
        new Vector2(790, 600),  //→
    ]
}

function createVector2(x, y) {
    return {
        x: x,
        y: y,
    };
}

var game;

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
    human: {
        position: createVector2(10, 200),
        size: createVector2(40, 40),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.human, 1, dam),
                new MoveController(_parent, 5, movePath()),
                new EnemyController(_parent, 10, 10, 10),
                new HealthBar(_parent),
            ];
        },
    },
    gem: {
        position: createVector2(300, 300),
        size: createVector2(40, 40),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.gem, 1),
                new GemController(_parent),
                new AttackEnemy(_parent, 1, 200, 200),

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
        position: createVector2(1000, 400),
        size: createVector2(400, 800),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.backInterface, -1, al),
            ];
        },
    },
    button1: {
        position: createVector2(1000, 700),
        size: createVector2(300, 50),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.button, 1, buttonClick),
                new TextRender(_parent, "Создать человечка", 2),
            ];
        },
    }
}
var objectPrefabs = initialInstancesOfGameObjects;
const spritesPath = "sprites/";
var sprites = {
    human: spritesPath + "heroes/human.png",
    tile: spritesPath + "tile.png",
    backInterface: spritesPath + "UI/backInterface.jpg",
    button: spritesPath + "UI/rockButton.png",
    healthBar: {
        redLine: spritesPath + "UI/HealthBar/RedSqvare.bmp",
        greenLine: spritesPath + "UI/HealthBar/GreenSqvare.bmp",
        blackLine: spritesPath + "UI/HealthBar/BlackSqvare.bmp",
    },
    gemShell: spritesPath + "heroes/gemShell.png",
    gem: spritesPath + "heroes/gem.png",

}
var UIOutput = {

}
