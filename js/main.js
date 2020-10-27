// JavaScript
window = document.defaultView;
window.onload = function initialisation() {
    game = new Game();
    game.Start();
}
function buttonClick(){
    GameObject.Instantiate(objectPrefabs.human);
}
function stop(){
    if (game.getGameStop()) {
        game.Continue();
    } else {
        game.Stop();
    }
}

