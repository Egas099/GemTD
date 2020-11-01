class RenderInterface {
    static times = [];
    static debugInfo = true;
    static nextFrame = [];
    static canvas = document.getElementById("canvas");
    static context = canvas.getContext("2d");
    constructor(){
        this.canvas = document.getElementById("canvas"); // Получаем ссылку на canvas
        this.context = canvas.getContext("2d"); // Создаём и получаем контекст рисования на 2d холсте
        this.context
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
    static drawImage(_image, _x = 0, _y = 0, _width = 0, _height = 0, _depth = 0){
        this.nextFrame.push({
            type: "image",
            image:_image,
            x: _x, y: _y,
            width: _width, height: _height,
            depth: _depth,
        });
    }
    static fillText(_text, _x = 0, _y = 0, _maxWidth = undefined, _depth = 0){
        this.nextFrame.push({
            type: "text",
            x: _x, y: _y,
            text: _text,
            maxWidth: _maxWidth,
            depth: _depth,
        });
    }
    static arc(_x, _y, _radius, _startAngle = 0, _endAngle = Math.PI*2, _anticlockwise, _depth = 0){
        this.nextFrame.push({
            type: "arc",
            x: _x, y: _y,
            radius:_radius,
            startAngle: _startAngle, endAngle: _endAngle,
            anticlockwise: _anticlockwise,
            depth: _depth,
        });
    }
    /**
     * Отрисовка следующего кадра
     */
    static renderNextFrame(){
        this.context.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
        this.nextFrame.sort((a, b) => a.depth !== b.depth ? (a.depth > b.depth ? 1 : -1) : (a.y > b.y ? 1 : -1));
        this.nextFrame.forEach(object => {
            switch (object.type) {
                case "image":
                    this.context.drawImage(object.image, object.x, object.y, object.width, object.height);
                    break;
                case "text":
                    this.context.fillStyle = "black";
                    this.context.fillText(object.text, object.x, object.y, object.maxWidth);
                    break;
                case "arc":
                    this.context.beginPath();
                    this.context.arc(object.x, object.y, object.radius, 0, 2 * Math.PI, object.anticlockwise);
                    this.context.stroke();
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
        this.context.fillStyle = "#800080";
        this.context.fillText("Обьектов: " + game.prototypesGameObject.length, 10, 20);
        this.context.fillText("Компонентов: " + game.prototypesMonoBehavior.length, 10, 40);
        this.context.fillText("Спрайтов: " + this.nextFrame.length, 10, 60);
        window.requestAnimationFrame(() => {
            const now = performance.now();
            while (this.times.length > 0 && this.times[0] <= now - 1000) {
            this.times.shift();
            }
            this.times.push(now);
        });
        this.context.fillText("Fps: " + this.times.length, 10, 80);
    }
}