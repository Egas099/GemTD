class Game {
    #gameStop = false;
    constructor() {
        /**Массив прототипов класса MonoBehavior*/
        this.prototypesMonoBehavior = [];
        /**Массив прототипов класса GameObject*/
        this.prototypesGameObject = [];
        /**Массив прототипов класса GUIObject*/
        this.prototypesGUIObject = [];
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
    get standFrameTime() {
        return 17;
    }
    changeFrameTime(_time){
        game.Stop();
        this.frameTime = _time;
        game.Continue();
    }
    Start(){
        this.frameTime = 17;
        this.deltaTime = 1;
        this.initInstant();
        GameSystem.Start();
        this.gameLoop = setInterval(game.Update, game.frameTime);
        this.timeLastFrame = Date.now();
    }
    Stop(){
        if (!this.#gameStop) {
            clearInterval(this.gameLoop);
            this.#gameStop = true;
        }
    }
    Continue(){
        if (this.#gameStop) {
            game.timeLastFrame = Date.now();
            this.#gameStop = false;
            this.gameLoop = setInterval(game.Update, game.frameTime);
        }
    }
    Update(){
        game.deltaTime = (Date.now() - game.timeLastFrame)/game.standFrameTime;
        game.timeLastFrame = Date.now();
        RenderInterface.renderNextFrame();
        MonoBehavior.Update();
        GameSystem.Update();
    }
}