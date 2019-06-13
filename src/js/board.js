import Bubble from './bubble';


class Board {
    constructor(game, ctx) {
        this.bubbles = [];
        this.bubbleShooter = null;
        this.nextShooterBubble = null;
        this.monkeys = [];
        this.ctx = ctx;
        this.game = game;
        this.caughtBananas = 0;
        this.DIM_X = 210;
        this.DIM_Y = 150;
        this.leftOffset = 20;
        this.topOffset = 70;
        this.rows = 5;
        this.columns = 11;
        this.bubbleDiameter = 40;
        this.colors = ['red', 'orange', 'yellow', 'green', 'seagreen', 'blue', 'purple', 'pink'];
        this.bubbleShooterX = 235;
        this.bubbleShooterY = 570;
        this.nextShooterX = 110;
        this.nextShooterY = 580;
        this.populate();
    }

    populate() {
        let y = this.topOffset;
        let shift = false;
        for (let i=0; i < this.rows; i++) {
            let x = this.leftOffset;
            if(shift) {
                x = x + (this.bubbleDiameter/2);
            }
            for(let j=0; j < this.columns; j++) {
                this.bubbles.push(new Bubble('bubble', x , y))
                x = x + (this.bubbleDiameter);
            }
            shift = !shift;
            y = y + (this.bubbleDiameter);
        }
        this.image = new Image();
        this.image.src = "assets/images/bubbles.png";
        this.image.sprites = {};
        this.getBubblesFromImage();
    }

    getBubblesFromImage() {
        const board = this;
        this.image.onload = () => {
            for (let i = 0; i < 8; i++) {
                board.image.sprites[board.colors[i]] = ({ x: i * 42, y: 0, w: 40, h: 40});
            }
            board.drawBubbles();
            board.drawBubbleShooter();
            board.game.ready = true;
        }
    }

    drawBubbles() {
        const board = this;
        board.bubbles.forEach((bubble) => {
            bubble.draw(board.ctx, board.image);
        });
        this.placeRandomBananas();
    }

    drawBubbleShooter() {
        if (!this.bubbleShooter) {
            if (this.nextShooterBubble) {
                this.bubbleShooter = this.nextShooterBubble;
                this.bubbleShooter.x = this.bubbleShooterX;
                this.bubbleShooter.y = this.bubbleShooterY;
            } else {
                this.bubbleShooter = new Bubble(
                                            'shooter', 
                                            this.bubbleShooterX, 
                                            this.bubbleShooterY, 
                                            this.selectRandomBubble(this.rows - 1, this.rows - 1).color);
            }
            this.nextShooterBubble = new Bubble(
                'shooter',
                this.nextShooterX,
                this.nextShooterY,
                this.selectRandomBubble(this.rows - 1, this.rows - 1).color);
            this.nextShooterBubble.draw(this.ctx, this.image);
        }
        this.bubbleShooter.draw(this.ctx, this.image);
    }

    render() {
    }

    checkCollision() {
        const shooterX = this.bubbleShooter.x;
        const shooterY = this.bubbleShooter.y;
        for (let i=0; i < this.bubbles.length; i++) {
            const bubble = this.bubbles[i];
            if (bubble.removed === false) {
                if (shooterX > bubble.x
                    && shooterX < bubble.x + this.bubbleDiameter 
                    && shooterY > bubble.y
                    && shooterY < bubble.y + this.bubbleDiameter ) {
                        return true;
                }
            }
        }
        return false;
    }

    getAdjacentBubbles(bubbleX, bubbleY, color) {
        const checkLeftX = bubbleX - (this.bubbleDiameter/2);
        const checkRightX = bubbleX + (this.bubbleDiameter / 2) + 1;
        const checkLeftY = bubbleY - 1;
        const checkRightY = bubbleY + (this.bubbleDiameter / 2) + 1;
        for (let i = 0; i < this.bubbles.length; i++) {
            const bubble = this.bubbles[i];
            if (color === bubble.color && bubble.removed === false) {
                if (checkLeftX > bubble.x
                    && checkLeftX < bubble.x + this.bubbleDiameter 
                    && chec > bubble.y
                    && shooterY < bubble.y + this.bubbleDiameter ) {
                    return true;
                }
            }
        }
        return false;
    }

    removeLooseBubbles() {

    }

    selectRandomBubble(rowStart, rowEnd) {
        const sampleData = this.bubbles.slice((rowStart-1)*this.columns, rowEnd*this.columns);
        return sampleData[Math.floor(Math.random() * sampleData.length)];
    }

    placeRandomBananas() {
        for (let i = 0; i < this.game.bananaTarget; i++) {
            const allocatedBubble = this.selectRandomBubble(2, this.rows-1);
            allocatedBubble.drawBanana(this.ctx);
        }
    }
}

export default Board;