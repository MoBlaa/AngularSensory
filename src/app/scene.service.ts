import { Injectable, HostListener, Renderer2 } from '@angular/core';
import { BlendModes } from 'phaser';

const TOLERANCE = 2;

@Injectable({
  providedIn: 'root'
})
export class SceneService extends Phaser.Scene {
  direction: [boolean, boolean, boolean, boolean];

  platforms: Phaser.Physics.Arcade.StaticGroup;

  player: Phaser.Physics.Arcade.Sprite;

  cursors: any;

  debugText: Phaser.GameObjects.Text;

  motionX = 0;
  motionY = 0;

  constructor(private renderer: Renderer2) {
    super({ key: 'Scene' });
    this.direction = [false, false, false, false];

    this.handleOrientation = this.handleOrientation.bind(this);

    this.renderer.listen(window, 'deviceorientation', this.handleOrientation);
    // this.renderer.listen(window, 'devicemotion', this.handleMotion);
  }

  public preload(): void {
    // Preload some assets
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  public create(): void {
    // Initialize the platforms
    this.platforms = this.physics.add.staticGroup();
    // this.createPlatform(window.innerWidth / 2, window.innerHeight / 2, 2);
    // this.createPlatform(window.innerWidth / 2, window.innerHeight, 5);
    this.createPlatform(window.innerWidth / 4, 0, 1);

    //// Create the player
    this.player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 3, 'dude');

    // It should bounce and onle be in the world
    // this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    // It should bounce from the platforms
    this.physics.add.collider(this.player, this.platforms);

    //// Some controls
    this.cursors = this.input.keyboard.createCursorKeys();

    //// Some Debugging text
    this.debugText = this.add.text(16, 16, 'No Velocity', {
      fontSize: '10px', fill: '#000'
    });

    this.player.anims.play('turn');
  }

  public update() {
    //// Check some controls
    if (this.cursors.left.isDown || this.motionX < 0) {
      this.moveLeft();
    } else if (this.cursors.right.isDown || this.motionX > 0) {
      this.moveRight();
    } else {
      this.dontMoveX();
    }

    if (this.cursors.up.isDown || this.motionY < 0) {
      this.moveUp();
    } else if (this.cursors.down.isDown || this.motionY > 0) {
      this.moveDown();
    } else {
      this.dontMoveY();
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  public moveUp() {
    this.player.setVelocityY(-160);
  }

  public moveDown() {
    this.player.setVelocityY(160);
  }

  public moveLeft() {
    this.player.setVelocityX(-160);

    // this.player.anims.play('left', true);
  }

  public moveRight() {
    this.player.setVelocityX(160);

     // this.player.anims.play('right', true);
  }

  public dontMoveX() {
    this.player.setVelocityX(0);
    // this.player.anims.play('turn');
  }

  public dontMoveY() {
    this.player.setVelocityY(0);
  }

  public createPlatform(x: number, y: number, scale: number) {
    // In Phaser 3 every object is placed by its center - only x and y of the center is needed
    this.platforms.create(x, y, 'ground').setScale(scale).refreshBody();
  }

  // Handle orientation
  public handleOrientation(event: DeviceOrientationEvent) {
    const x = event.gamma;
    const y = event.beta;

    this.debugText.setText(`x : ${x}, y: ${y}`);

    if (x > TOLERANCE) {
      this.motionX = 1;
    } else if (x < -TOLERANCE) {
      this.motionX = -1;
    } else {
      this.motionX = 0;
    }

    if (y > TOLERANCE) {
      this.motionY = 1;
    } else if (y < -TOLERANCE) {
      this.motionY = -1;
    } else {
      this.motionY = 0;
    }
  }
}
