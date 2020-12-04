// JavaScript
loading();
function loading() {
  console.log("load");
  load.onload = () => {
    canvas.getContext("2d").drawImage(load, 0, 0, canvas.width, canvas.height);
  }
}
window.onload = function initialisation() {
  setTimeout(() => {
    game = new Game()
    game.Start()
  }, 0)
}
function stop() {
  if (game.gameStop) {
    game.Continue()
  } else { 
    game.Stop()
  }
}