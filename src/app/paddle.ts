import { ElementRef } from '@angular/core';
import { Colors } from './colors.enum';
import { KeyCode } from './key-code.enum';

export const Paddle_Movement_Speed = 7;

export interface IPaddleParams {
    height: number;
    width: number;
    canvasSize: number;
    x: number;
}

export function Default_IPaddleParams(canvasSize = 1000): IPaddleParams {
    return {
        height: 10,
        width: 150,
        canvasSize,
        x: (canvasSize - 75) / 2
    };
}

export class Paddle {
    readonly height: number;
    readonly width: number;
    readonly canvasSize: number;
    x: number;

    private rightPressed = false;
    private leftPressed = false;

    constructor(
        readonly ctx: CanvasRenderingContext2D,
        params: IPaddleParams
    ) {
        this.height = params.height;
        this.width = params.width;
        this.canvasSize = params.canvasSize;
        this.x = params.x;
    }

    keyDownHandler(event: KeyboardEvent) {
        if (event.keyCode === KeyCode.ARROW_RIGHT) {
            this.rightPressed = true;
        } else if (event.keyCode === KeyCode.ARROW_LEFT) {
            this.leftPressed = true;
        }
        // console.log(`Updating to leftPressed=${this.leftPressed}`);
    }

    keyUpHandler(event: KeyboardEvent) {
        if (event.keyCode === KeyCode.ARROW_RIGHT) {
            this.rightPressed = false;
        } else if (event.keyCode === KeyCode.ARROW_LEFT) {
            this.leftPressed = false;
        }
        // console.log(`Updating to rightPressed=${this.rightPressed}`);
    }

    draw() {
        // Update coordinates
        if (this.rightPressed && this.x < this.canvasSize - this.width) {
            this.x += Paddle_Movement_Speed;
        } else if (this.leftPressed && this.x > 0) {
            this.x -= Paddle_Movement_Speed;
        }
        // console.log(`Drawing Paddle @ x: ${this.x}`);

        this.ctx.beginPath();
        this.ctx.rect(this.x, this.canvasSize - this.height, this.width, this.height);
        this.ctx.fillStyle = Colors.GREY;
        this.ctx.fill();
        this.ctx.closePath();
    }
}
