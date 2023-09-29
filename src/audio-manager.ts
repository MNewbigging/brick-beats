import * as Tone from "tone";

import { AudioLoader, OneShotNames } from "./audio-loader";
import {
  BeaterBeaterCollision,
  BeaterBrickCollision,
} from "./events/event-map";
import { BeaterName } from "./types/beater-name";
import { BrickName } from "./types/brick-name";
import { eventListener } from "./events/event-listener";

// If it exists in the map, it has been scheduled to start
interface AudioItem {
  started: boolean; // cannot be stopped if it hasn't started
  toBeRemoved: boolean; // removal has been scheduled or not
  scheduleId: number; // id for the scheduled repeat
  player: Tone.Player; // reference to audio-loader's player map
}

export class AudioManager {
  // Stores joinedName and above audio player object
  private audioItemMap = new Map<string, AudioItem>();
  private oneShotSet = new Set<OneShotNames>();

  constructor(private audioLoader: AudioLoader) {
    eventListener.on("game-start", this.onGameStart);
    eventListener.on("beater-brick-collision", this.onBeaterBrickCollision);
    //eventListener.on("beater-beater-collision", this.onBeaterBeaterCollision);
  }

  private onGameStart = () => {
    // Set the starting tempo
    Tone.Transport.bpm.value = 125;

    // Start the scheduler
    Tone.Transport.start();
  };

  private onBeaterBrickCollision = (event: BeaterBrickCollision) => {
    // Each beater+brick name results in a single player
    const joinedName = event.beaterName.concat(event.brickName);

    // Get any existing audio item for this name
    const item = this.audioItemMap.get(joinedName);

    // If there is no such item, can start the audio
    if (!item) {
      this.startAudio(joinedName);
      return;
    }

    // If the item has already started and NOT been scheduled for removal, can stop it
    if (item.started && !item.toBeRemoved) {
      this.stopAudio(joinedName, item);
    }
  };

  private startAudio(name: string) {
    // First get the audio player for this name
    const player = this.audioLoader.getPlayer(name);
    if (!player) {
      return;
    }

    Tone.Transport.scheduleOnce(() => {
      // This player has now started
      const item = this.audioItemMap.get(name);
      if (item) {
        item.started = true;
      }
    }, "@1m");

    // Repeat player every 4 measures (8 beats), beginning start of next measure
    const scheduleId = Tone.Transport.scheduleRepeat(
      () => {
        // Start playing the audio
        player.start();
      },
      "4m",
      "@1m"
    );

    // Add it to the map to be stopped later
    this.audioItemMap.set(name, {
      started: false,
      toBeRemoved: false,
      scheduleId,
      player,
    });
  }

  private stopAudio(name: string, audioItem: AudioItem) {
    // Schedule for removal
    audioItem.toBeRemoved = true;

    // Prevent looping further
    Tone.Transport.clear(audioItem.scheduleId);

    // When it stops
    audioItem.player.onstop = () => {
      // Remove from map so it can start again
      this.audioItemMap.delete(name);
    };
  }

  private onBeaterBeaterCollision = (event: BeaterBeaterCollision) => {
    // Get a random one shot that isn't currently playing
    const names = Object.values(OneShotNames).filter(
      (name) => !this.oneShotSet.has(name)
    );
    if (!names.length) {
      return;
    }

    const rnd = Math.floor(Math.random() * names.length);
    const oneShotName = names[rnd];

    // Play random one shot
    const player = this.audioLoader.getPlayer(oneShotName);
    if (!player) {
      return;
    }

    // Add to set so we don't play dupes
    this.oneShotSet.add(oneShotName);

    // On stop, remove from set to allow it to play again
    player.onstop = () => {
      this.oneShotSet.delete(oneShotName);
    };

    /**
     * When to play one-shots:
     * - start of next measure
     * - immediately
     * - both sound crap
     *
     * Give player control of one-shots?
     * They just unlock them when beaters collide or when certain bricks are hit?
     */
    Tone.Transport.scheduleOnce(() => {
      player.start();
    }, "@1m");
  };
}
