import Game from './js/game';
import Board from './js/board';

document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("bubble-shooter-game");

    const ctx = canvas.getContext("2d");

    const game = new Game(ctx, canvas);
    game.start();
    canvas.addEventListener("mousemove", game.onMouseMove);
    canvas.addEventListener("mousedown", game.onMouseDown);
});