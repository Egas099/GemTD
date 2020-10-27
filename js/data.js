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

var initialInstancesOfGameObjects = {
    objectMap: {
        position: createVector2(canvas.width/2, canvas.height/2),
        size: createVector2(800, 800),
        createComponentsFor(_parent) {
            return [
                new TileMap( _parent, new Vector2(20, 20), sprites.tile),
            ];
        },
    },
    human: {
        position: createVector2(0, 200),
        size: createVector2(30, 30),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent, sprites.human),
                new MoveController(_parent, movePath()),
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
    empty: {
        position: createVector2(0, 0),
        size: createVector2(0, 0),
        createComponentsFor(_parent) {
            return [
            ];
        },
    },
}
var objectPrefabs = {
    human: {
        name: "human",
        position: createVector2(0, 0),
        size: createVector2(30, 30),
        createComponentsFor(_parent) {
            return [
                new SpriteRender(_parent,   sprites.human),
                new MoveController(_parent, movePath()),
            ];
        },
    },
}
var sprites = {
    human: "img/human.png",
    tile: "img/tile.png",
    backInterface: "backInterface",
}
