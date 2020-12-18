// JavaScript
loading();

function loading() {
  canvas.getContext("2d").font = "40px serif";
  canvas.getContext("2d").fillText("Loading...", canvas.width/2 - 50, canvas.height-20);
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