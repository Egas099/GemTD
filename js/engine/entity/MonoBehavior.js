class MonoBehavior {
    constructor(_parent) {
        game.addPrototypeOfMonoBehavior(this);
        this.parent = _parent;
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
            if (element.parent.IsEnable()) {
                element.Update();
            }
        });
    }
}