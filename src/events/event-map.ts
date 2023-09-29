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
  "audio-scheduled-on": { beaterName: BeaterName; brickName: BrickName };
  "audio-started": { beaterName: BeaterName; brickName: BrickName };
  "audio-scheduled-off": { beaterName: BeaterName; brickName: BrickName };
  "audio-stopped": { beaterName: BeaterName; brickName: BrickName };
}
