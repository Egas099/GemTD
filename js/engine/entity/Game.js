class Game {
    constructor() {
        /**Массив прототипов класса MonoBehavior*/
        this.prototypesMonoBehavior = [];
        /**Массив прототипов класса GameObject*/
        this.prototypesGameObject = [];
        /**Массив прототипов класса GUIObject*/
        this.prototypesGUIObject = [];
        this.gameStop = false;
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
    initInstant() {
        let instObj = Prefabs.initialInstancesOfGameObjects();
        for (let object in instObj) {
            if (instObj.hasOwnProperty(object)) {
                GameObject.Instantiate(instObj[object]);
            }
        }
    }
    get standFrameTime() {
        return 17;
    }
    changeFrameTime(_time) {
        game.Stop();
        this.frameTime = _time;
        game.Continue();
    }
    Start() {
        this.gameStop = false;
        this.frameTime = 17;
        this.deltaTime = 1;
        this.initInstant();
        RenderInterface.Start();
        GameSystem.Start();
        EventSystem.Start();
        this.gameLoop = setInterval(game.Update, game.frameTime);
        this.timeLastFrame = Date.now();
    }
    Stop() {
        this.gameStop = true;
    }
    Continue() {
        if (this.gameStop) {
            this.gameStop = false;
        }
    }
    Update() {
        game.deltaTime = (Date.now() - game.timeLastFrame) / game.standFrameTime;
        game.timeLastFrame = Date.now();
        if (!game.gameStop) {
            RenderInterface.Update();
            MonoBehavior.Update();
            GameSystem.Update();
        }
    }
}