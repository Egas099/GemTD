// JavaScript
window = document.defaultView
window.onload = function initialisation() {
  game = new Game()
  game.Start()
}
function stop() {
  if (game.gameStop) {
    game.Continue()
  } else {
    game.Stop()
  }
}