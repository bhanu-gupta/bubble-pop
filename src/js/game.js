import Board from './board';

var rowOffset = 20;
var colOffset = 70;

class Game {
    constructor(ctx, canvas) {
        this.canvas = canvas;
        this.level = 1;
        this.bananaTarget = 5;
        this.playAngle = null;
        this.ready = false;
        this.currentMoveCount = 0;
        this.movesAllowed = 15;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.shooterMoving = false;
        this.gameOver = false;
        this.won = false;
        this.board = new Board(this, ctx);
    }

    play() {
        this.makeMove();
    }

    setGameStatus() {
        if(this.board.bananaCount === 0) {
            this.won = true;
        } else if (this.currentMoveCount >= this.movesAllowed) {
            this.gameOver = true;
        } else if (this.board.bubbles.length >=11) {
            this.gameOver = true;
        }
        this.alertGameStatus();
    }

    alertGameStatus() {
        if (this.gameOver) {
            alert('Game Over!');
            document.location.reload();
        } else if(this.won) {
            alert(`Congratulations! You Won. Your score is ${this.board.score}`);
            document.location.reload();
        }
    }

    resetAfterCollision() {
        this.setGameStatus();
        this.board.bubbleShooter = null;
        this.shooterMoving = false;
        this.playAngle = null;
        this.board.foundClusters = [];
        this.board.clusterCount = 0;
        this.board.bananaCount = 0;
        this.board.tempClusters = [];
    }

    drawLevel() {

    }

    makeMove() {
        const rads = this.degToRad(this.playAngle);
        const speed = 500;
        let dx = Math.cos(rads) * speed / 60;
        let dy = Math.sin(rads) * speed / 60;
        var interval = setInterval(() => {
            const shooter = this.board.bubbleShooter;
            if ((shooter.x + dx <= 0) || (shooter.x + dx + this.board.bubbleDiameter >= this.canvas.width)) {
                this.playAngle = 180 - this.playAngle;
                dx = -dx;
            }
            let touchTop = false;
            if ((shooter.y + dy <= colOffset)) {
                shooter.y = colOffset;
                dx = 0;
                dy = 0;
                touchTop = true;
            }
            const isCollision = this.board.checkCollision();
            if (isCollision || touchTop) {
                this.resetAfterCollision();
                clearInterval(interval);
            } else {
                shooter.clearArc(this.board.ctx);
                shooter.x = shooter.x + dx;
                shooter.y = shooter.y - dy;
            }
            
            this.board.drawBubbleShooter();
        }, 1000 / 60);
    }

    start() {
        this.board.loadInitialGame();
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
            const lbound = 15;
            const ubound = 165;
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
            this.drawMouseLine();
        }
    }

    onMouseDown(e) {
        if (this.playAngle && this.shooterMoving ===  false) {
            if(this.gameOver) {
                this.loadNewGame();
            }
            if (this.ready) { 
                this.shooterMoving = true;
                this.currentMoveCount += 1;
                this.play();
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

    drawMouseLine() {
        var centerx = 230 + this.board.bubbleDiameter / 2;
        var centery = 550 + this.board.bubbleDiameter / 2;
        var ctx = this.board.ctx;
        ctx.clearRect(150, 480, 200, 90);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.setLineDash([5,10]);
        ctx.moveTo(centerx, centery);
        ctx.lineTo(
            centerx + 2 * this.board.bubbleDiameter * Math.cos(this.degToRad(this.playAngle)),
            centery - 2 * this.board.bubbleDiameter * Math.sin(this.degToRad(this.playAngle)));
        ctx.stroke();
    }
}

export default Game;