class Game {
    #gameStop = false;
    gameLoop;
    constructor() {
        /**Массив прототипов класса MonoBehavior*/
        this.prototypesMonoBehavior = [];
        /**Массив прототипов класса GameObject*/
        this.prototypesGameObject = [];
    }
    /**
     * Добавление нового прототипа MonoBehavior
     * @param _MonoBehavior MonoBehavior - новый прототип класса
     */
    addPrototypeOfMonoBehavior(_MonoBehavior) {
        this.prototypesMonoBehavior.push(_MonoBehavior);
    }
    /**
     * Добавление нового прототипа GameObject
     * @param _GameObject GameObject - новый прототип класса
     */
    addPrototypeOfGameObject(_GameObject) {
        this.prototypesGameObject.push(_GameObject);
    }
    /**
     * Создание начальных прототипов GameObject
     */
    initInstant(){
        for(let object in initialInstancesOfGameObjects) {
            GameObject.Instantiate(initialInstancesOfGameObjects[object]);
        }
    }
    getGameStop(){
        return this.#gameStop;
    }
    Start(){
        this.initInstant();
        MonoBehavior.Start();
        this.gameLoop = setInterval(game.Update, 17);
    }
    Stop(){
        clearInterval(this.gameLoop);
        this.#gameStop = true;
    }
    Continue(){
        this.#gameStop = false;
        this.gameLoop = setInterval(game.Update, 17);
    }
    Update(){
        MonoBehavior.Update();
        RenderInterface.renderNextFrame();
    }
}
class MonoBehavior {
    constructor() {
        game.addPrototypeOfMonoBehavior(this);
        this.className = "MonoBehavior";
    }
    static Start() {
        game.prototypesMonoBehavior.forEach(element => {
            element.Start();
        });
    }
    /**Функция, выполняющаяся при каждой отрисовке кадра*/
    static Update() {
        game.prototypesMonoBehavior.forEach(element => {
            element.Update();
        });
    }
}
class GameObject {
    /**Массив компонентов */
    components = {};
    constructor(_position = Vector2, _size = Vector2) {
        game.addPrototypeOfGameObject(this);
        this.position = _position;
        this.size = _size;
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
        if (_componentName in this.components) {
            return this.components._componentName;
        } else {
            return null;
        }
    }
    /**
     * Создание GameObject из заготовки(префаба).
     * @param _object Прототип класса компонента
     */
    static Instantiate(_object) {
        const position = _object.position;
        const size = _object.size;
        var obj = new GameObject(new Vector2(position.x, position.y), new Vector2(size.x, size.y));
        const comp = _object.createComponentsFor(obj);
        comp.forEach(element => {
            obj.addComponent(element);
        });
        // this.components.forEach(comp => {
        //     comp.Start();
        // });
        return obj;
    }
}
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Проверка эквивалентности двух векторов.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Equal(_firstVector, _secondVector) {
        let firstVector = createVector2(Math.round(_firstVector.x), Math.round(_firstVector.y));
        let secondVector = createVector2(Math.round(_secondVector.x), Math.round(_secondVector.y));
        if ((firstVector.x == secondVector.x)&&(firstVector.y == secondVector.y))
            return true;
        else return false;
    }
    /**
     * Приведение вектора к направляющему
     * @param _ector Vector2 - Вектор
     */
    static Direction(_vector) {
        let x = Math.floor(_vector.x);
        let y = Math.floor(_vector.y);
        while ((x>1 || x<-1) && (y>1 || y<-1)) {
            x = x/10;
            y = y/10;
        }
        return new Vector2(x, y);
    }
    /**
     * Перемножение двух векторов.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Mult(_firstVector, _secondVector)
    {
        return new Vector2(_firstVector.x * _secondVector.x, _firstVector.y * _secondVector.y);
    }
    /**
     * Сложение двух векторов.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Sum()
    {
        return new Vector2(_firstVector.x + _secondVector.x, _firstVector.y + _secondVector.y);
    }
    /**
     * Дистанция между двумя векторами.
     * @param _firstVector Vector2 - Первый вектор
     * @param _secondVector Vector2 - Второй вектор
     */
    static Distance(_firstVector, _secondVector){
        return Math.sqrt((_secondVector.x - _firstVector.x)**2 + (_secondVector.y - _firstVector.y)**2)
    }
}
class RenderInterface {
    static times = [];
    static debugInfo = true;
    static nextFrame = [];
    static canvas = document.getElementById("canvas");
    static context = canvas.getContext("2d");
    constructor(){
        this.canvas = document.getElementById("canvas"); // Получаем ссылку на canvas
        this.context = canvas.getContext("2d"); // Создаём и получаем контекст рисования на 2d холсте
    }
    /**
     * Добавление изображения в список отрисовываемых элементов
     * @param {*} _image - изображение
     * @param {*} _x - позиия x
     * @param {*} _y - позиия y
     * @param {*} _width - ширина
     * @param {*} _height - длина
     * @param {*} _depth - глубина отрисовки (элементы с большей глубиной отрисовываются первыми)
     */
    static drawImage(_image, _x, _y, _width, _height, _depth = 0){
        this.nextFrame.push({
            type: "image",
            depth: _depth,
            image:_image,
            x: _x,
            y: _y,
            width: _width,
            height: _height,
        });
    }
    /**
     * Отрисовка следующени кадра
     */
    static renderNextFrame(){
        this.context.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
        this.nextFrame.sort((a, b) => a.depth > b.depth ? 1 : -1);
        this.nextFrame.forEach(object => {
            switch (object.type) {
                case "image":
                    this.context.drawImage(object.image, object.x, object.y, object.width, object.height);
                    break;
                default:
                    break;
            }
        });
        if (this.debugInfo) 
            this.renderDebugInfo();
        this.nextFrame = [];
    }
    /**
     * Отрисовка данных для отдладки
     */
    static renderDebugInfo(){
        this.context.font = "20px serif";
        this.context.fillText("Обьектов: " + game.prototypesGameObject.length, canvas.width - 150, 20);
        this.context.fillText("Компонентов: " + game.prototypesMonoBehavior.length, canvas.width - 150, 40);
        window.requestAnimationFrame(() => {
            const now = performance.now();
            while (this.times.length > 0 && this.times[0] <= now - 1000) {
            this.times.shift();
            }
            this.times.push(now);
        });
        this.context.fillText("Fps: " + this.times.length, canvas.width - 150, 60);
    }
}
class GUIObject {
    components = {};
    constructor(_position = Vector2, _size = Vector2) {
        this.position = _position;
        this.size = _size;
    }
}