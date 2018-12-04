import { Component, OnInit } from '@angular/core';

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

  constructor() {
    this.orientation = {
      alpha: 1,
      beta: 1,
      gamma: 1
    };
  }

  ngOnInit() {
    window.addEventListener('deviceorientation', this.handleOrientationEvent, false);
  }

  handleOrientationEvent(e: DeviceOrientationEvent) {
    const alpha = e.alpha, beta = e.beta, gamma = e.gamma;
    this.orientation = { alpha, beta, gamma };
  }

}
