import { Component, OnInit, Renderer, Renderer2 } from '@angular/core';

export interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

@Component({
  selector: 'app-acceleration',
  templateUrl: './acceleration.component.html',
  styleUrls: ['./acceleration.component.scss']
})
export class AccelerationComponent implements OnInit {
  orientation: Orientation;
  renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.renderer = renderer;
    this.orientation = {
      alpha: 1,
      beta: 1,
      gamma: 1
    };
  }

  ngOnInit() {
    this.renderer.listen('window', 'deviceorientation', (e: DeviceOrientationEvent) => {
      const alpha = e.alpha, beta = e.beta, gamma = e.gamma;
      this.orientation = { alpha, beta, gamma };
      console.log(`Changing orientation to: { alpha: ${alpha}, beta: ${beta}, gamma: ${gamma} }`);
    });
  }
}
