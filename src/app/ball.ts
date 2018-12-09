import { Colors } from './colors.enum';
import { Coordinates, between } from './acceleration/acceleration.component';

export const BALLINTERTIA = 5;
export const BALLFRICTION = 5;

export const MAXACCEL = 10;

export class Ball {
    readonly r: number;
    readonly innertia: Coordinates;

    speed: Coordinates;

    constructor(
        private ctx: CanvasRenderingContext2D,
        public x: number,
        public y: number
    ) {
        this.r = 20;
        this.innertia = {
            x: BALLINTERTIA,
            y: BALLINTERTIA
        };
    }

    draw(phoneTilt: Coordinates) {
        // console.log(`Drawing ball: x=${this.x}, y=${this.y}, r=${this.r}`);

        this.speed = {
            x: (this.speed.x + phoneTilt.x) * BALLFRICTION,
            y: (this.speed.y + phoneTilt.y) * BALLFRICTION
        };

        if (this.speed.x > MAXACCEL) {
            this.speed.x = MAXACCEL;
        } else if (this.speed.x < -MAXACCEL) {
            this.speed.x = -MAXACCEL;
        }
        if (this.speed.y > MAXACCEL) {
            this.speed.y = MAXACCEL;
        } else if (this.speed.y < -MAXACCEL) (
            this.speed.y = -MAXACCEL;
        )

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 4);
        this.ctx.fillStyle = Colors.GREY;
        this.ctx.fill();
        this.ctx.closePath();
    }
}
