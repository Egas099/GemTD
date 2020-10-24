var prototypesMonoBehavior = [];
var prototypesGameObjects = [];
var Entity = [];
var Ent;

function addSomeObgects() {}
var createdGameObjects = {
    human: {
        name: "human",
        position: {
            x: 250,
            y: 250,
        },
        size: {
            x: 10,
            y: 10,
        },
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