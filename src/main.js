import Game from './js/game';

document.addEventListener("DOMContentLoaded", function () {
    let canvas = document.getElementById("bubble-shooter-game");
    const ctx = canvas.getContext("2d");
    const game = new Game(ctx, canvas);
    game.start();
    
    canvas.addEventListener("mousemove", game.onMouseMove);
    canvas.addEventListener("mousedown", game.onMouseDown);
    const instructions = document.getElementById('instructions');
    const gamePlayBtn = document.getElementById('play');
    if (instructions && gamePlayBtn) {
        gamePlayBtn.onclick = () => {
            instructions.style.display = 'none';
            game.disabled = false;
        }
    }
});