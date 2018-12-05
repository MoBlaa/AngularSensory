
export class Ball {
    readonly r: number;

    constructor(
        private ctx: CanvasRenderingContext2D,
        public x: number,
        public y: number
    ) {
        this.r = 20;
    }

    draw() {
        console.log(`Drawing ball: x=${this.x}, y=${this.y}, r=${this.r}`);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, 1000, 1000);

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 4);
        this.ctx.fillStyle = '#A9A9A9';
        this.ctx.fill();
        this.ctx.closePath();
    }
}
