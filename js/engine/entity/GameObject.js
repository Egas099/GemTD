class GameObject {
    /**Массив компонентов */
    components = {};
    constructor(_position = new Vector2(0,0), _size = new Vector2(0,0), _depth = 0) {
        game.addPrototypeOfGameObject(this);
        this.position = _position;
        this.size = _size;
        this.depth = _depth
        this.dataCreate = Date.now();
    }
    /**
     * Изменение позиции GameObject
     * @param newPosition Vector2 or null - новые координаты GameObject
     * @param addPosition Vector2 or null - приращение координат GameObject
     */
    setPosition(newPosition = null, addPosition = null) {
        if (newPosition)
            this.position = newPosition;
        else {
            this.position.x += addPosition.x;
            this.position.y += addPosition.y;
        }
    }
    /**
     * Добавление нового компонента в GameObject.
     * Компонент уже должен быть создан
     * @param _component Прототип класса компонента
     */
    addComponent(_component) {
        var newComponent = {
            [_component.className]: _component,
        }
        this.components = Object.assign(this.components, newComponent);
    }
    /**
     * Поиск компонента по имени класса
     * @param _componentName Имя компонента (класса)
     */
    findComponentByName(_componentName) {
        for(var comp in this.components)
        {
            if (comp == _componentName)
                return this.components[comp];
        }
        return null;
    }
    /**
     * Создание GameObject из заготовки(префаба).
     * @param _object Прототип класса компонента
     */
    static Instantiate(_object) {
        const position = _object.position;
        const size = _object.size;
        var obj = new GameObject(new Vector2(position.x, position.y), new Vector2(size.x, size.y), _object.depth);
        const comp = _object.createComponentsFor(obj);
        comp.forEach(element => {
            obj.addComponent(element);
        });
        comp.forEach(element => {
            element.Start();
        });
        return obj;
    }
    static Destroy(_object){
        for(let component in _object.components){
            for(var mono in game.prototypesMonoBehavior) {
                if (game.prototypesMonoBehavior[mono] === _object.components[component]) {
                    game.prototypesMonoBehavior.splice(mono, 1);
                }
            }
        }
        for(let object in game.prototypesGameObject){
            if (game.prototypesGameObject[object] === _object) {
                game.prototypesGameObject.splice(object, 1);
            }
        }
    }
    static IsExist(_object){
        let i = 0;
        let exist = false;
        if (_object === undefined)
            return false;
        for (const object in game.prototypesGameObject) {
            if (_object == game.prototypesGameObject[object])
                return true;
        }
    }
    static Find(_object){
        for (const object in Game.prototypesGameObject) {
            if (Game.prototypesGameObject[object] === _object) {
                return Game.prototypesGameObject[object];
            }
        }
        return undefined;
    }
}