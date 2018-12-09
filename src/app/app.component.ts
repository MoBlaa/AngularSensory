import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { SceneService } from './scene.service';

@Component({
  selector: 'app-root',
  template: `<phaser-component [gameConfig]="gameConfig" (gameReady)="onGameReady($event)" [Phaser]="phaser"></phaser-component>`,
  providers: [SceneService]
})
export class AppComponent {
  public game: Phaser.Game;

  public readonly gameConfig: GameConfig = {
    title: environment.title,
    version: environment.version,
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#ffffff', // White background
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { z: 200 }
      }
    }
  };

  public readonly phaser = Phaser;

  public constructor(public sceneService: SceneService) { }

  public onGameReady(game: Phaser.Game): void {
    this.game = game;
    this.game.scene.add('Scene', this.sceneService, true);
  }
}
