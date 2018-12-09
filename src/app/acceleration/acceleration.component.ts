import { Component, OnInit, Renderer, Renderer2, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { createText } from '@angular/core/src/view/text';
import { Ball, BALLINTERTIA } from '../ball';
import { Paddle, Default_IPaddleParams } from '../paddle';
import { KeyCode } from '../key-code.enum';
import { R3_PATCH_COMPONENT_DEF_WTIH_SCOPE } from '@angular/core/src/ivy_switch/compiler';
import { Colors } from '../colors.enum';

export interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export function between(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2, dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

@Component({
  selector: 'app-acceleration',
  templateUrl: './acceleration.component.html',
  styleUrls: ['./acceleration.component.scss']
})
export class AccelerationComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;

  timer: any;

  orientation: Orientation;
  renderer: Renderer2;
  width: number;
  height: number;
  deltas: { dx: number, dy: number };

  ball: Ball;
  paddle: Paddle;

  paused = false;

  accel: Coordinates;
  lastAcc: Coordinates;
  phoneTilt: Coordinates;

  constructor(renderer: Renderer2) {
    this.renderer = renderer;
    this.orientation = {
      alpha: 1,
      beta: 1,
      gamma: 1
    };
    const ratio = Math.floor(Math.random() * 10);
    this.deltas = {
      dx: 2,
      dy: -2 * ratio
    };
    this.draw = this.draw.bind(this);
    this.height = 1000;
    this.width = 1000;
  }

  ngOnInit() {
    // Add acceleration listener
    this.renderer.listen('window', 'deviceorientation', (e: DeviceOrientationEvent) => {
      const alpha = e.alpha, beta = e.beta, gamma = e.gamma;
      this.orientation = { alpha, beta, gamma };
      console.log(`Changing orientation to: { alpha: ${alpha}, beta: ${beta}, gamma: ${gamma} }`);
    });
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.init();
  }

  init() {
    if (this.timer != null) {
      clearInterval(this.timer);
    }

    this.ball = new Ball(this.ctx, 500, 500);
    this.paddle = new Paddle(this.ctx, Default_IPaddleParams(this.height));

    this.clear();

    this.countdown();

    this.paddle.draw();

    setTimeout(() => {
      this.paused = true;
      this.timer = setInterval(() => {
        this.paused = false;
        this.draw();
      }, 10);
      // init elements
    }, 5 * 1000);
  }

  countdown(step = 5) {
    if (step !== 0) {
      // Clear view
      this.clear();
      this.paddle.draw();

      this.ctx.fillStyle = Colors.GREY;
      this.ctx.font = '40px Arial';
      this.ctx.fillText(`${step}`, 500, 500);

      console.log(`${step}`);
      // Countdown
      setTimeout(() => this.countdown(step - 1), 1000);
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownHandler(event: KeyboardEvent) {
    if (!this.paused) {
      this.paddle.keyDownHandler(event);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUpHandler(event: KeyboardEvent) {
    if (!this.paused) {
      this.paddle.keyUpHandler(event);
    }
  }

  @HostListener('window:devicemotion', ['$event'])
  handleOrientation(event: DeviceMotionEvent) {
    switch (window.orientation) {
      case 0: {
        this.accel = {
          x: event.accelerationIncludingGravity.x * (-1),
          y: event.accelerationIncludingGravity.y * (-1)
        };
        break;
      }
      case -90: {
        this.accel = {
          x: event.accelerationIncludingGravity.y * (-1),
          y: event.accelerationIncludingGravity.x
        };
        break;
      }
      case 90: {
        this.accel = {
          x: event.accelerationIncludingGravity.y,
          y: event.accelerationIncludingGravity.x * (-1)
        };
        break;
      }
      case 180: {
        this.accel = {
          x: event.accelerationIncludingGravity.x,
          y: event.accelerationIncludingGravity.y
        };
        break;
      }
    }
  }

  clear() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, 1000, 1000);
  }

  checkPaddleCollision(): boolean {
    if (between(this.ball.x, this.paddle.x, this.paddle.x + this.paddle.width)
      && this.ball.y + this.ball.r >= this.height - this.paddle.height) {
      console.log('Detected collision between ball and paddle');
      return true;
    } else {
      return false;
      // Here could be a game over
    }
  }

  draw() {
    // Clear the canvas before drawing on it
    this.clear();

    // Ball bewegt sich von der Wand weg, Ballträgheit zurücksetzen
    if (this.lastAcc.x * this.accel.x < 0) {
      this.ball.innertia.x = BALLINTERTIA;
    }
    if (this.lastAcc.y * this.accel.y < 0) {
      this.ball.innertia.y = BALLINTERTIA;
    }

    this.lastAcc = this.accel;

    this.phoneTilt = {
      x: this.accel.x * this.ball.innertia.x,
      y: this.accel.y * this.ball.innertia.y
    };

    // Draw elements
    this.ball.draw();
    this.paddle.draw();

    // Move things only if not paused
    if (!this.paused) {
      // Only update if not exceeding the screen
      let dx = this.deltas.dx;
      let dy = this.deltas.dy;

      if (this.ball.x + dx > this.width - this.ball.r || this.ball.x + dx < this.ball.r) {
        dx = -dx;
      }
      if (this.ball.y + dy < this.ball.r) {
        dy = -dy;
      } else if (this.ball.y + dy > this.height - this.ball.r) {
        if (this.checkPaddleCollision()) {
          dy = -dy;
        } else {
          this.init();
        }
      }
      this.deltas = { dx, dy };

      if (between(this.ball.x + dx, this.ball.r, this.width - this.ball.r)) {
        this.ball.x = this.ball.x + dx;
      }
      if (between(this.ball.y + dy, this.ball.r, this.height - this.ball.r)) {
        this.ball.y = this.ball.y + dy;
      }
    }
  }

}
