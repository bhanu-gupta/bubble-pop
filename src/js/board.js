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
        document.getElementById("score-val").innerHTML = this.game.score;
    }

    render() {
        this.ctx.clearRect(0, 0, 640, 500);
        this.drawBubbles();
        this.drawMoveCount();
        this.drawScore();
    }

    checkCollision() {
        const shooterX = this.bubbleShooter.x;
        const shooterY = this.bubbleShooter.y;
        const allBubbles = this.bubbles.flat();
        for (let i = 0; i < allBubbles.length; i++) {
            if (allBubbles[i].removed === false && this.checkTwoBubblesIntersection(allBubbles[i], { x: shooterX, y: shooterY })) {
                this.resetBubbles();
                return true;
            }
        }
        return false;
    }

    resetBubbles() {
        const grid = this.getClosestValidPosition(this.bubbleShooter);
        const dim = this.bubbleShooter.getBubbleDimensions(grid.row, grid.col);
        const newBubble = new Bubble('bubble', dim.x, dim.y, this.bubbleShooter.color, grid.row, grid.col);
        this.bubbles[grid.row] = this.bubbles[grid.row] ? this.bubbles[grid.row] : [];
        this.bubbles[grid.row][grid.col] = newBubble;
        this.removeAllMatchingBubbles(grid, newBubble.color);
        this.clusterCount = 0;
        this.bananaCount = 0;
        this.render();
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
            result = this.getOtherPossiblePosition(row-1, col) || result;
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

        // if (!this.bubbles[row][col - 1] && this.bubbles[row][col - 1].removed === false) { //0,-1
        //     return {row: row, col: col-1};
        // } else if (!this.bubbles[row][col + 1] && this.bubbles[row][col + 1].removed === false) {  //0,1
        //     return { row: row, col: col + 1 };
        // } else if (!this.bubbles[row + 1][col] && !this.bubbles[row + 1][col].removed === false) { //1,0
        //     return { row: row+1, col: col };
        // } else if (!this.bubbles[row + 1][col - 1] && !this.bubbles[row + 1][col - 1].removed === false) { //1,-1
        //     return { row: row+1, col: col - 1 };
        // } else if (!this.bubbles[row + 1][col + 1] && !this.bubbles[row + 1][col + 1].removed === false) { //1,1
        //     return { row: row+1, col: col + 1 };
        // }
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

    removeAllMatchingBubbles(grid, color) {
        const rowType = (grid.row) % 2;
        const possibilities = ADJ_DIFFS[rowType];
        for (let i = 0; i < possibilities.length; i++) {
            const col = grid.col + possibilities[i][0];
            const row = grid.row + possibilities[i][1];
            if (col >= 0 && col < this.columns && row >= 0 && row < this.bubbles.length) {
                if(this.bubbles[row] && this.bubbles[row][col]) {
                    const adjBubble = this.bubbles[row][col];
                    if ((adjBubble.type === 'banana' || adjBubble.color === color) 
                        && adjBubble.removed === false && !this.checkObjectinArray(this.tempClusters, {row, col})) {
                        this.clusterCount += 1;
                        if (this.clusterCount < 3) {
                            if (this.bubbles[grid.row][grid.col].removed == false) {
                                this.clusterCount += 1;
                                this.tempClusters.push({row: grid.row, col: grid.col});
                            }
                            this.tempClusters.push({ row, col});
                        } else {
                            if(this.tempClusters.length >= 2) {
                                for (let i = 0; i< this.tempClusters.length; i++) {
                                    const clusterGrid = this.tempClusters[i];
                                    this.bubbles[clusterGrid.row][clusterGrid.col].removed = true;
                                }
                                this.tempClusters = [];
                            }
                            this.bubbles[grid.row][grid.col].removed = true;
                            this.bubbles[row][col].removed = true;
                        }
                        this.removeAllMatchingBubbles({row, col}, color);
                        if (this.clusterCount > 2) {
                            //this.removeAllLooseBubbles();          
                        }
                    }
                }
            }
        }
    }

    checkObjectinArray(array, obj) {
        return array.some((val) => {
            return (val.row === obj.row && val.col === obj.col);
        })
    }

    removeAllLooseBubbles() {
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.columns; j++) {
                if (this.bubbles[i] && this.bubbles[i][j] && this.bubbles[i][j].removed === false) {
                    const bubbleTree = this.findBubbleTree(this.bubbles[i][j].row, this.bubbles[i][j].col);
                }
            }
        }
    }

    //BFS using queue
    findBubbleTree(row, col) {
        let allNodes = [this.bubbles[row][col]];
        let bubbleTree = [];
        let processed = [];
        while (allNodes.length > 0) {
            const currentNode = allNodes.shift();
            if (!processed.includes(currentNode)) {
                processed.push(currentNode);
                const adjBubbles = this.getAllAdjacentBubbles(currentNode);
                this.foundClusters.push(currentNode);
                allNodes = allNodes.concat(adjBubbles);
                bubbleTree.push(currentNode);
            }
        }
        return bubbleTree;
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
            const bananaRow = Math.floor(Math.random() * this.rows);
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