class MonoBehavior {
    constructor(){
        prototypesMonoBehavior.push(this);
    }
    static Start() {
        prototypesMonoBehavior.forEach(element => {
            element.Start();
        });
    }
    static Update() {
        prototypesMonoBehavior.forEach(element => {
            element.Update();
        });
    }
}
class GameObject{
    components = [];
    constructor(_position = new Vector2(0, 0), _size = new Vector2(0, 0)) {
        prototypesGameObjects.push(this);
        this.position = _position;
        this.size = _size;
    }
    setPosition(newPosition = null, addPosition = null) {
        if (newPosition) 
            this.position = newPosition;
        else {
            this.position.x += addPosition.x;
            this.position.y += addPosition.y;
        }
    }
    /**
     * Добавление нового компонента в GameObject
     * @param _component Прототип класса
     */
    addComponent(_component){
        var type = typeof _component;
        this.components.push({[String(type)]: _component});
        console.log(String(type));
        this.components.forEach(element => {
            console.log(element);
        });
    }
    findComponentByName(_componentName){
    }
    static Instantiate(_object){
        const position = _object.position;
        const size = _object.size;
        var obj = new GameObject(new Vector2(position.x, position.y),new Vector2(size.x, size.y));
        const comp = _object.createComponentsFor(obj);
        comp.forEach(element => {
            obj.addComponent(element);
        });
        return obj;
    }
}
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}