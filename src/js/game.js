import Board from './board';

class Game {
    constructor(ctx, canvas) {
        this.board = new Board(this,ctx);
        this.canvas = canvas;
        this.score = 0;
        this.level = 1;
        this.bananaTarget = 5;
        this.playAngle = null;
        this.ready = false;
        this.currentMoveCount = 0;
        this.movesAllowed = 20;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.shooterMoving = false;
    }

    play() {
        this.makeMove();
    }

    won() {
        if (this.board.caughtBananas === this.bananaTarget) {
            return true;
        }
        return false;
    }

    gameOver() {
        if (this.board.currentMoveCount > this.movesAllowed) {
            return true;
        }
        return false;
    }

    makeMove() {

        const rads = this.degToRad(this.playAngle);
        const speed = 500;
        let dx = Math.cos(rads) * speed / 60;
        let dy = Math.sin(rads) * speed / 60;

        var interval = setInterval(() => {
            if (this.board.bubbleShooter.x + dx <= 0) {
                this.playAngle = 180 - this.playAngle;
                dx = -dx;
            } else if (this.board.bubbleShooter.x + dx + this.board.bubbleDiameter >= this.canvas.width) {
                this.playAngle = 180 - this.playAngle;
                dx = -dx;
            }

            if (this.board.checkCollision()) {
                this.board.bubbles.push(this.board.bubbleShooter);
                this.board.bubbleShooter = null;
                this.shooterMoving = false;
                clearInterval(interval);
            } else {
                this.board.bubbleShooter.clearArc(this.board.ctx);
                this.board.bubbleShooter.x = this.board.bubbleShooter.x + dx;
                this.board.bubbleShooter.y = this.board.bubbleShooter.y - dy;
            }
            this.board.drawBubbleShooter();

        }, 1000 / 60);
    }

    start() {
        this.board.render();
    }

    radToDeg(angle) {
        return angle * (180 / Math.PI);
    }

    degToRad(angle) {
        return angle * (Math.PI / 180);
    }

    onMouseMove(e) {
        if (this.shooterMoving === false) {
            const pos = this.getMousePos(this.canvas, e);
            let mouseangle = this.radToDeg(
                Math.atan2(
                    (this.board.bubbleShooterY + this.board.bubbleDiameter) - pos.y, 
                    pos.x - (this.board.bubbleShooterX + this.board.bubbleDiameter)
                )
            );
            if (mouseangle < 0) {
                mouseangle = 180 + (180 + mouseangle);
            }
            const lbound = 8;
            const ubound = 172;
            if (mouseangle > 90 && mouseangle < 270) {
                if (mouseangle > ubound) {
                    mouseangle = ubound;
                }
            } else {
                if (mouseangle < lbound || mouseangle >= 270) {
                    mouseangle = lbound;
                }
            }
            this.playAngle = mouseangle;
        }
    }

    onMouseDown(e) {
        if (this.shooterMoving ===  false) {
            if(this.gameOver) {
                this.loadNewGame();
            }
            if (this.ready) { 
                this.shooterMoving = true;
                this.play();
                this.currentMoveCount += 1;
            }
        }
    }

    getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }

    loadNewGame() {

    }
}

export default Game;