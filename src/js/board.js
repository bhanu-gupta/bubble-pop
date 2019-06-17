import Bubble from './bubble';

var ADJ_DIFFS = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],
                        [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];

class Board {
    constructor(game, ctx) {
        this.bubbles = [];
        this.bubbleShooter = null;
        this.nextShooterBubble = null;
        this.ctx = ctx;
        this.game = game;
        this.bananaCount = 0;
        this.rows = 5;
        this.columns = 11;
        this.bubbleDiameter = 40;
        this.colors = ['red', 'orange', 'yellow', 'green', 'seagreen', 'blue', 'purple', 'pink'];
        this.bubbleShooterX = 235;
        this.bubbleShooterY = 570;
        this.nextShooterX = 110;
        this.nextShooterY = 580;
        this.clusterCount = 0;
        this.tempClusters = [];
        this.foundClusters = [];
        this.score = 0;
        this.populate();
        window.bubbles = this.bubbles;
    }

    loadBubblesImage() {
        this.image = new Image();
        this.image.src = "assets/images/bubbles.png";
        this.image.sprites = {};
        const board = this;
        this.image.onload = () => {
            for (let i = 0; i < 8; i++) {
                board.image.sprites[board.colors[i]] = ({ x: i * 42, y: 0, w: 40, h: 40 });
            }
            board.drawBubbles();
            board.drawBubbleShooter();
            board.game.ready = true;
        }
    }

    loadInitialGame() {
        this.loadBubblesImage();
        this.drawScore();
        this.drawMoveCount();
    }

    populate() {
        for(let i=0; i < this.rows; i++) {
            this.bubbles[i] = [];
            for(let j=0; j< this.columns; j++) {
                let newBubble = new Bubble('bubble',null, null, null, i , j);
                let dim = newBubble.getBubbleDimensions(i, j);
                newBubble.x = dim.x;
                newBubble.y = dim.y;
                this.bubbles[i].push(newBubble);
            }
        }
        this.placeRandomBananas();
    }

    drawBubbles() {
        for (let i = 0; i < this.bubbles.length; i++) {
            for (let j = 0; j < this.columns; j++) {
                if(this.bubbles[i][j] && this.bubbles[i][j].removed === false) {
                    const bubble = this.bubbles[i][j];
                    if(bubble.type === 'banana') {
                        bubble.drawBanana(this.ctx);
                        this.bananaCount += 1;
                    } else {
                        bubble.draw(this.ctx, this.image);
                    }
                }
            }
        }
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
                                            this.selectRandomBubble(this.rows - 1).color);
            }
            this.nextShooterBubble = new Bubble(
                'shooter',
                this.nextShooterX,
                this.nextShooterY,
                this.selectRandomBubble(this.rows - 1).color);
            this.nextShooterBubble.draw(this.ctx, this.image);
        }
        this.bubbleShooter.draw(this.ctx, this.image);
    }

    drawMoveCount() {
        document.getElementById("moves-val").innerHTML = this.game.movesAllowed - this.game.currentMoveCount;
    }

    drawScore() {
        document.getElementById("score-val").innerHTML = this.score;
    }

    calculateScore() {
        let score = 0;
        if (this.clusterCount > 2) {
            score = this.clusterCount * 10;
            if ((this.game.bananaTarget - this.bananaCount) > 0) {
                score += ((this.game.bananaTarget - this.bananaCount) * 20);
            }
        }
        this.score += score;
    }

    render() {
        this.ctx.clearRect(0, 0, 640, 500);
        this.calculateScore();
        this.drawBubbles();
        this.drawMoveCount();
        this.drawScore();
    }

    checkCollision() {
        const shooterX = this.bubbleShooter.x;
        const shooterY = this.bubbleShooter.y;
        const allBubbles = this.bubbles.flat();
        let collision = false;
        for (let i = 0; i < allBubbles.length; i++) {
            if (allBubbles[i].removed === false && this.checkTwoBubblesIntersection(allBubbles[i], { x: shooterX, y: shooterY })) {
                // debugger
                collision = true;
                break;
            }
        }
        if (collision === true || shooterY === 70) {
            this.setBubbleShooter();
            this.resetBubbles();
        }
        return collision;
    }

    resetBubbles() {
        this.removeAllMatchingBubbles(this.bubbleShooter);
        if (this.clusterCount > 2) {
            this.markRemoved(this.tempClusters);
            this.removeAllLooseBubbles();
        }
        this.render();
    }

    setBubbleShooter() {
        const grid = this.getClosestValidPosition(this.bubbleShooter);
        const dim = this.bubbleShooter.getBubbleDimensions(grid.row, grid.col);
        const newBubble = new Bubble('bubble', dim.x, dim.y, this.bubbleShooter.color, grid.row, grid.col);
        this.bubbles[grid.row] = this.bubbles[grid.row] ? this.bubbles[grid.row] : [];
        this.bubbles[grid.row][grid.col] = newBubble;
        this.bubbleShooter = newBubble;
    }

    checkTwoBubblesIntersection(bubble1, bubble2) {
        const dx = bubble1.x - bubble2.x;
        const dy = bubble1.y - bubble2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (this.bubbleDiameter)) {
            return true;
        }
        return false;
    }

    // 70 - 1 0
    //110 - 2 40
    //150 - 3 80   
    //190 - 4 120
    //230 - 5 160
    //270 - 6 200
    //260 - 6 
    //

//70 + 40*row = x
//0-90 - 1
//90-130 -2
//130-170-3
//170-210 - 4
    getClosestValidPosition(bubble) {
        const x = bubble.x;
        const y = bubble.y;
        const row = Math.floor((y) / this.bubbleDiameter);
        const rowOffset = (row%2 === 1) ? this.bubbleDiameter/2 : 0;
        const col = Math.floor((x - rowOffset) / this.bubbleDiameter);
        let result = { row: row - 1, col };
        if (this.bubbles[row - 1] && this.bubbles[row - 1][col] && this.bubbles[row-1][col].removed === false) {
            result = this.getOtherPossiblePosition(row-1, col-1) || result;
        }
        return result;
    }

    getOtherPossiblePosition(currentRow, currentCol) {
        const rowType = (currentRow) % 2;
        const possibilities = ADJ_DIFFS[rowType];

        for (let i = 0; i < possibilities.length; i++) {
            const col = currentCol + possibilities[i][0];
            const row = currentRow + possibilities[i][1];

            if (col >= 0 && col < this.columns && row >= 0) {
                if ((!this.bubbles[row]) || !this.bubbles[row][col] || 
                    (this.bubbles[row][col] && this.bubbles[row][col].removed === true)) {
                    return {row, col};
                }
            }
        }
    }

    getAllAdjacentBubbles(bubble) {
        var rowType = (bubble.row) % 2;
        var neighbors = [];
        var possibilities = ADJ_DIFFS[rowType];
        for (var i = 0; i < possibilities.length; i++) {
            var col = bubble.col + possibilities[i][0];
            var row = bubble.row + possibilities[i][1];

            if (col >= 0 && col < this.columns && row >= 0 && row < this.bubbles.length) {
                if (this.bubbles[row] && this.bubbles[row][col] && this.bubbles[row][col].removed === false) {
                    neighbors.push(this.bubbles[row][col]);
                }
            }
        }

        return neighbors;
    }

    removeAllMatchingBubbles(targetBubble) {
        this.tempClusters.push(targetBubble);
        this.clusterCount += 1;
        const rowType = (targetBubble.row) % 2;
        const possibilities = ADJ_DIFFS[rowType];
        for (let i = 0; i < possibilities.length; i++) {
            const col = targetBubble.col + possibilities[i][0];
            const row = targetBubble.row + possibilities[i][1];
            if (col >= 0 && col < this.columns && row >= 0 && row < this.bubbles.length) {
                if(this.bubbles[row] && this.bubbles[row][col]) {
                    const adjBubble = this.bubbles[row][col];
                    if ((adjBubble.type === 'banana' || (adjBubble.type != 'banana' && adjBubble.color === this.bubbleShooter.color)) 
                        && adjBubble.removed === false && !this.tempClusters.includes(adjBubble)) {
                        this.removeAllMatchingBubbles(adjBubble);
                    }
                }
            }
        }
    }

    removeAllLooseBubbles() {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.columns; j++) {
                if (this.bubbles[i] && this.bubbles[i][j] && this.bubbles[i][j].removed === false) {
                    const bubble = this.bubbles[i][j];
                    if (!this.foundClusters.includes(`${bubble.row}-${bubble.col}`)) {
                        this.findBubbleTree(bubble.row, bubble.col);
                    }
                }
            }
        }
    }

    //BFS using queue
    findBubbleTree(row, col) {
        let allNodes = [this.bubbles[row][col]];
        let bubbleTree = [];
        let processed = [];
        let looseBubble = true;
        while (allNodes.length > 0) {
            const currentNode = allNodes.shift();
            if (!processed.includes(currentNode)) {
                processed.push(currentNode);
                if (currentNode.row === 0) {
                    looseBubble = false;
                }
                this.foundClusters.push(`${currentNode.row}-${currentNode.col}`);
                allNodes = allNodes.concat(this.getAllAdjacentBubbles(currentNode));
                bubbleTree.push(currentNode);
            }
        }
        if (looseBubble) {
            this.markRemoved(bubbleTree);
        }
        return bubbleTree;
    }

    markRemoved(bubbles) {
        for(let i=0; i < bubbles.length; i++) {
            this.bubbles[bubbles[i].row][bubbles[i].col].removed = true;
        }
    }

    selectRandomBubble(rowStart = 0, rowEnd = this.rows, colStart = 0, colEnd = this.columns) {
        const sampleData = this.getSelectedBubbles(rowStart, rowEnd, colStart, colEnd);
        return sampleData[Math.floor(Math.random() * sampleData.length)];
    }

    getSelectedBubbles(rowStart = 0, rowEnd = this.rows, colStart = 0, colEnd = this.columns) {
        let sampleData = [];
        for (let i = rowStart; i < rowEnd; i++) {
            for (let j = colStart; j < colEnd; j++) {
                sampleData.push(this.bubbles[i][j]);
            }
        }
        return sampleData;
    }

    placeRandomBananas() {
        for (let i = 0; i < this.game.bananaTarget; i++) {
            const bananaRow = Math.floor(Math.random() * (this.rows-1));
            const bananaCol = Math.floor(Math.random() * this.columns);
            const banana = new Bubble('banana');
            const dim = banana.getBubbleDimensions(bananaRow, bananaCol);
            banana.x = dim.x;
            banana.y = dim.y;
            banana.row = bananaRow;
            banana.col = bananaCol;
            this.bubbles[bananaRow][bananaCol] = banana;
        }
    }
}

export default Board;