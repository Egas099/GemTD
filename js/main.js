// JavaScript
window = document.defaultView;
window.onload = function initialisation() {
    game = new Game();
    game.Start();
}
function stop(){
    if (game.getGameStop()) {
        game.Continue();
    } else {
        game.Stop();
    }
}
function changeFrameTime(){
    time = document.getElementById("frameTime").value;
    game.changeFrameTime(Math.round(1000/time));
}

