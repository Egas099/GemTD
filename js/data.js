const deltaTime = 17;
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
/**Класс игры */
var game;

var initialInstancesOfGameObjects = {
    human: {
        name: "human",
        position: createVector2(0, 200),
        size: createVector2(10, 10),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(sprites.human, _parent),
                new MoveController(_parent, movePath()),
            ];
        },
    },
}

var objectPrefabs = {
    human: {
        name: "human",
        position: createVector2(100, 100),
        size: createVector2(10, 10),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(sprites.human, _parent),
                new MoveController(_parent),
            ];
        },
    },
}
var sprites = {
    human: "img/human.png",
}
