var diameter = 40;
var rowOffset = 20;
var colOffset = 70;

class Bubble {

    constructor(type, x, y, color, row, col) {
        this.removed = false;
        this.type = type;
        this.color = color || null;
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
    }

    getBubbleDimensions(row, column) {
        let bubbleX = (column * diameter) + rowOffset;
        if(row%2 === 1) {
            bubbleX += diameter/2;
        }
        let bubbleY = (row* diameter) + colOffset;
        return {x: bubbleX, y:bubbleY};
    }

    draw(ctx, bubbleSprite, colors) {
        ctx.beginPath();
        this.color = this.color || this.getRandomColour(colors);
        const spr = bubbleSprite.sprites[this.color];
        const w = spr.w;
        const h = spr.h;
        ctx.drawImage(bubbleSprite, spr.x, spr.y, w, h, this.x, this.y, w, h);
        ctx.closePath();
    }

    clearBubble() {
        this.removed = true;
    }

    getRandomColour(colors) {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    clearArc(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.clearRect(this.x, this.y, diameter, diameter);
        ctx.fill();
        ctx.restore();
    }

    drawBanana(ctx) {
        var bananaImg = document.createElement('img');
        bananaImg.src = 'assets/images/banana.png';
        bananaImg.onload = () => {
            this.clearArc(ctx);
            const radius = (diameter/2)-1;
            ctx.arc(this.x + radius + 2, this.y + radius + 2, radius, 0, Math.PI * 2, true);
            ctx.fillStyle = "#70D434";
            ctx.fill();
            ctx.drawImage(bananaImg, 0, 0, bananaImg.width, bananaImg.height, this.x + 5, this.y+5, 27, 27);
        };
    }
}

export default Bubble;
