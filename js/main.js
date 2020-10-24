// JavaScript
const times = [];
let fps;
var obj;
function draw() { // Функция отрисовки одного такта
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
    MonoBehavior.Update();
    debugInfo();
    move();
}
function debugInfo(){
    ctx.font = "10px serif";
    ctx.fillText("Обьектов: " + prototypesGameObjects.length, 10, 20);
    ctx.fillText("Компонентов: " + prototypesMonoBehavior.length, 100, 20);
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
        }
        times.push(now);
        fps = times.length;
    });
    ctx.fillText("Fps: " + fps, 200, 20);
}
function init() { // Функция инициализации
    addSomeObgects();
    canvas = document.getElementById("canvas"); // Получаем ссылку на canvas
    ctx = canvas.getContext("2d"); // Создаём и получаем контекст рисования на 2d холсте
    timerId = setInterval(draw, 17); // Вызываем функцию отрисовки каждые 16 мсек (16 * 60 = 960) 60 кадров в секунду
}
function move() {
    var x = y = 5;
    // prototypesGameObjects.forEach(element => {
    //     element.setPosition(null, new Vector2(Math.random() * x - x/2,Math.random()*y - y/2));
    // });
    // if (obj) {
    //     obj.setPosition(null, new Vector2(Math.random() * x - x/2,Math.random()*y - y/2));
    // }
}
function act(){
    obj = GameObject.Instantiate(createdGameObjects.human);
}

