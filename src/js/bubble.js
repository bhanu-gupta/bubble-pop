var level1Colors = [
    'red',
    'green',
    'yellow'
];

var level2Colors = [
    '#FFBC00',
    '#DD4E00',
    '#00BD00',
    '#1dd186'
];

var level3Colors = [
    '#FFBC00',
    '#DD4E00',
    '#00BD00',
    '#1dd186',
    '#616a77'
];

class Bubble {

    //type = shooter, bubble, monkey
    constructor(type, x, y, color) {
        this.removed = false;
        this.type = type;
        this.color = color || this.getRandomColour();
        this.x = x;
        this.y = y;
        this.diameter = 40;
    }

    draw(ctx, bubbleSprite) {
        ctx.beginPath();
        const spr = bubbleSprite.sprites[this.color];
        const w = spr.w;
        const h = spr.h;
        ctx.drawImage(bubbleSprite, spr.x, spr.y, w, h, this.x, this.y, w, h);
        ctx.closePath();
    }

    clearBubble() {
        this.removed = true;
    }

    getRandomColour() {
        return level1Colors[Math.floor(Math.random() * level1Colors.length)];
    }

    clearArc(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.clearRect(this.x, this.y, this.diameter, this.diameter);
        ctx.fill();
        ctx.restore();
    }

    drawBanana(ctx) {
        var bananaImg = document.createElement('img');
        this.type= 'bananaImg';
        bananaImg.src = 'assets/images/banana.png';
        bananaImg.onload = () => {
            this.clearArc(ctx);
            const radius = (this.diameter/2)-1;
            ctx.arc(this.x + radius + 2, this.y + radius + 2, radius, 0, Math.PI * 2, true);
            ctx.fillStyle = "#70D434";
            ctx.fill();
            ctx.drawImage(bananaImg, 0, 0, bananaImg.width, bananaImg.height, this.x + 5, this.y+5, 27, 27);
        };
    }
}

export default Bubble;
