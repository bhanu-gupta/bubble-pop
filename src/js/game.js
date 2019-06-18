import Board from './board';

var colOffset = 70;

var levelSettings = {
    1: { bananaTarget: 5, movesAllowed: 15 },
    2: { bananaTarget: 7, movesAllowed: 20 },
    3: { bananaTarget: 9, movesAllowed: 25 }
}

var allColors = ['red', 'orange', 'yellow', 'green', 'seagreen', 'blue', 'purple', 'pink'];

class Game {
    constructor(ctx, canvas) {
        this.canvas = canvas;
        this.level = 1;
        this.playAngle = null;
        this.ready = false;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.shooterMoving = false;
        this.gameOver = false;
        this.won = false;
        this.ctx = ctx;
        this.board = new Board(this, ctx);
        this.disabled = true;
    }

    play() {
        this.makeMove();
    }

    setGameStatus() {
        if(this.board.bananaCount === 0) {
            this.won = true;
        } else if (this.board.currentMoveCount >= this.board.movesAllowed) {
            this.gameOver = true;
        } else if (this.board.bubbles.length >=11) {
            this.gameOver = true;
        }
        this.alertGameStatus();
    }

    alertGameStatus() {
        const gameStatus = document.getElementById('game-status-heading');
        const finalScore = document.getElementById('final-score');
        const statusBox = document.getElementById('game-status');
        const gameActions = document.getElementById('game-actions');
        let statusChange = false;
        if (this.gameOver) {    
            gameStatus.innerHTML = "You Lose!";
            statusChange = true;
            gameActions.innerHTML = '<i class="fas fa-sync" id="replay-btn"></i>';
        } else if(this.won) {
            gameStatus.innerHTML = "You Won!";
            finalScore.innerHTML = `Score: ${this.board.score}`;
            statusChange = true;
            if (this.level < 3) {
                gameActions.innerHTML = '<i class="fas fa-sync" id="replay-btn"></i><i class="fas fa-forward" id="next-level"></i>';
            }
        }
        if (statusChange === true) {
            const replayBtn = document.getElementById('replay-btn');
            const nextLevelBtn = document.getElementById('next-level');
            if (replayBtn) {
                replayBtn.onclick = () => this.loadLevel();
            }
            if (nextLevelBtn) {
                nextLevelBtn.onclick = () => this.loadNextLevel();
            }
            this.disabled = true;
            statusBox.style.visibility = 'visible';
        } else {
            gameActions.innerHTML = "";
            gameStatus.innerHTML = "";
            finalScore.innerHTML = "";
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
        this.loadBubblesImage();
        this.board.loadGame();
    }

    radToDeg(angle) {
        return angle * (180 / Math.PI);
    }

    degToRad(angle) {
        return angle * (Math.PI / 180);
    }

    onMouseMove(e) {
        if (this.disabled === false && this.shooterMoving === false) {
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
        if (this.disabled === false && this.playAngle && this.shooterMoving === false) {
            if (this.ready) { 
                this.shooterMoving = true;
                this.board.currentMoveCount += 1;
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

    loadNextLevel() {
        this.level += 1;
        this.loadLevel();
    }

    loadLevel() {
        this.board = new Board(this, this.ctx, levelSettings[this.level].bananaTarget, levelSettings[this.level].movesAllowed);
        this.board.render();
        this.board.drawBubbleShooter();
        const statusBox = document.getElementById('game-status');
        statusBox.style.visibility = "hidden";
        this.disabled = false;
        this.won = false;
        this.gameOver = false;
    }

    loadBubblesImage() {
        this.image = new Image();
        this.image.src = "assets/images/bubbles.png";
        this.image.sprites = {};
        const game = this;
        this.image.onload = () => {
            for (let i = 0; i < 8; i++) {
                game.image.sprites[allColors[i]] = ({ x: i * 42, y: 0, w: 40, h: 40 });
            }
            game.board.drawBubbles();
            game.board.drawBubbleShooter();
            game.ready = true;
        }
    }
}

export default Game;