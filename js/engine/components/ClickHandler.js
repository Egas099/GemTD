class ClickHandler extends MonoBehavior {
    constructor(_parent) {
        super(_parent);
    }
    static clickEvent(_clickPos) {
        clickGlobalEvent(_clickPos);
        var objects = ClickHandler.FindObjectsOnClickPosiition(_clickPos);
        if (objects.length != 0) {
            objects = ClickHandler.SortingObjectsByDepth(objects);
            try {
                objects[0].findComponentByName("SpriteRender").onClick(objects[0]);
                } catch {}
        }
    }
    static SortingObjectsByDepth(objects) {
        objects.sort((a, b) => a.depth < b.depth ? 1 : -1);
        return objects;
    }
    static FindObjectsOnClickPosiition(_clickPos) {
        var objects = [];
        game.prototypesGameObject.forEach(object => {
            if (ClickHandler.IsInclude(_clickPos, object.position, object.size)) {
                objects.push(object);
            }
        });
        return objects;
    }
    static IsInclude(_clickPos, _objPos, _objSize) {
        if (Math.abs(_clickPos.x - _objPos.x) <= _objSize.x / 2)
            if (Math.abs(_clickPos.y - _objPos.y) <= _objSize.y / 2)
                return true;
        return false;
    }
    Start() {
        canvas.addEventListener('click', function (evt) {
            var rect = canvas.getBoundingClientRect();
            var mousePos = {
                x: (evt.clientX - rect.left) * (canvas.width / canvas.clientWidth),
                y: (evt.clientY - rect.top) * (canvas.height / canvas.clientHeight)
            };
            ClickHandler.clickEvent(mousePos);
        }, false);
    }
    Update() {}
}