import { Component, OnInit, Renderer, Renderer2, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { createText } from '@angular/core/src/view/text';
import { Ball } from '../ball';

export interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

const GREY_COLOR = '#A9A9A9';
const WHITE_COLOR = '#ffffff';

function between(value: number, min: number, max: number): boolean {
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

  orientation: Orientation;
  renderer: Renderer2;
  width: number;
  height: number;
  ball: Ball;
  deltas: {dx: number, dy: number};

  constructor(renderer: Renderer2) {
    this.renderer = renderer;
    this.orientation = {
      alpha: 1,
      beta: 1,
      gamma: 1
    };
    this.deltas = {
      dx: 2,
      dy: -2
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
    this.init();

    setInterval(this.draw, 10);
  }

  init() {
    this.ball = new Ball(this.canvas.nativeElement.getContext('2d'), 500, 500);
  }

  draw() {
    this.ball.draw();

    // Only update if not exceeding the screen
    let dx = this.deltas.dx;
    let dy = this.deltas.dy;

    if (this.ball.x + dx > this.width - this.ball.r || this.ball.x + dx < this.ball.r) {
      dx = -dx;
    }
    if (this.ball.y + dy > this.height - this.ball.r || this.ball.y + dy < this.ball.r) {
      dy = -dy;
    }
    this.deltas = {dx, dy};

    if (between(this.ball.x + dx, this.ball.r, this.width - this.ball.r)) {
      this.ball.x = this.ball.x + dx;
    }
    if (between(this.ball.y + dy, this.ball.r, this.height - this.ball.r)) {
      this.ball.y = this.ball.y + dy;
    }
  }

}
