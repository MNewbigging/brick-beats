import Phaser from "phaser";

import { Beater, ShapeBodies } from "../types/phaser-aliases";
import { BeaterName, beaterNames } from "../types/beater-name";
import { BrickName } from "../types/brick-name";
import { eventListener } from "../events/event-listener";
import { getRandomBrickName, randomRange } from "../utils/utils";

export class GameScene extends Phaser.Scene {
  beaters: Beater[] = [];
  shapes!: ShapeBodies;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    // Create group for shapes, set it to collide with all beaters
    this.shapes = this.physics.add.staticGroup();
    this.physics.add.collider(this.beaters, this.shapes, this.beaterHitBrick);

    this.input.mouse?.disableContextMenu();

    this.input.on("pointerdown", (e: MouseEvent) => {
      // Left click
      if (e.button === 0) {
        this.addBeater();
        // Right click
      } else if (e.button === 2) {
        this.addBrick(this.input.x, this.input.y);
      }
    });
  }

  private addBeater() {
    // Random image for beater
    const randomBallFrame = Math.floor(Math.random() * beaterNames.length);
    const beater = this.physics.add
      .image(this.input.x, this.input.y, "balls", randomBallFrame)
      .setCollideWorldBounds(true)
      .setBounce(1);

    // Random direction, same speed
    const direction = new Phaser.Math.Vector2(
      randomRange(-1, 1),
      randomRange(-1, 1)
    );
    const speed = 100;
    const velocity = direction.normalize().scale(speed);
    beater.setVelocity(velocity.x, velocity.y);

    // Beaters collide with each other
    this.physics.add.collider(beater, this.beaters, this.beaterHitBeater);

    beater.setData("name", beaterNames[randomBallFrame]);

    this.beaters.push(beater);
  }

  private addBrick(x: number, y: number) {
    const randomBrickName = getRandomBrickName();
    const rect = this.physics.add.staticSprite(x, y, "bricks", randomBrickName);

    rect.setData("name", randomBrickName);

    this.shapes.add(rect);
  }

  private readonly beaterHitBrick = (
    beater:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    shape: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) => {
    if (
      beater instanceof Phaser.Tilemaps.Tile ||
      shape instanceof Phaser.Tilemaps.Tile
    ) {
      return;
    }

    const beaterName = beater.getData("name") as BeaterName;
    const brickName = shape.getData("name") as BrickName;
    const speed = beater.body.velocity.length();
    const position = normaliseCanvasPosition(
      beater.body.position.x,
      beater.body.position.y
    );

    eventListener.fire("beater-brick-collision", {
      beaterName,
      brickName,
      speed,
      position,
    });
  };

  private readonly beaterHitBeater = (
    beaterA:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    beaterB:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile
  ) => {
    if (
      beaterA instanceof Phaser.Tilemaps.Tile ||
      beaterB instanceof Phaser.Tilemaps.Tile
    ) {
      return;
    }

    const beaterAName = beaterA.getData("name") as BeaterName;
    const beaterBName = beaterB.getData("name") as BeaterName;
    const speed =
      beaterA.body?.velocity.length() + beaterB.body.velocity.length();
    const position = normaliseCanvasPosition(
      beaterA.body.position.x,
      beaterA.body.position.y
    );

    eventListener.fire("beater-beater-collision", {
      beaterAName,
      beaterBName,
      speed,
      position,
    });
  };
}

function normaliseCanvasPosition(
  x: number,
  y: number
): { x: number; y: number } {
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Get size of canvas
  const canvasMount = document.getElementById("game-mount");
  if (canvasMount) {
    width = canvasMount.clientWidth;
    height = canvasMount.clientHeight;
  }

  return {
    x: (x / width) * 2 - 1,
    y: -(y / height) * 2 + 1,
  };
}
