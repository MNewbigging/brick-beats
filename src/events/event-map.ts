import { BeaterName } from "../types/beater-name";
import { BrickName } from "../types/brick-name";

export interface BeaterBrickCollision {
  beaterName: BeaterName;
  brickName: BrickName;
  speed: number;
  position: { x: number; y: number };
}

export interface BeaterBeaterCollision {
  beaterAName: BeaterName;
  beaterBName: BeaterName;
  speed: number;
  position: { x: number; y: number };
}

export interface EventMap {
  "game-loaded": null;
  "audio-loaded": null;
  "game-start": null;
  "beater-brick-collision": BeaterBrickCollision;
  "beater-beater-collision": BeaterBeaterCollision;
  "audio-scheduled-on": BeaterBrickCollision;
  "audio-started": BrickName;
  "audio-scheduled-off": BrickName;
  "audio-stopped": BrickName;
}
