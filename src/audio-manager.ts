import * as Tone from "tone";

import { AudioLoader } from "./audio-loader";
import {
  BeaterBeaterCollision,
  BeaterBrickCollision,
} from "./events/event-map";
import { BeaterName } from "./types/beater-name";
import { BrickName } from "./types/brick-name";
import { eventListener } from "./events/event-listener";

/**
 * Event flow:
 * (nothing playing at start)
 * - Beater hits brick, audio is scheduled to start
 * - Audio starts
 * - Beater hits brick again, audio is scheduled to stop
 * - Audio stops
 *
 * What if:
 * - A second beater hits the same brick before audio starts? It will stop before starting.
 * - A second beater hits before audio stops? It'll never stop
 *
 * Need:
 * - cooldown on starting and stopping
 * - cannot stop a sound that has yet to start
 * - cannot start a sound that has yet to stop
 * - + cooldown? don't want to result in too many 'dud hits'
 *
 * I need to know:
 * - when a player is scheduled to start
 * - when it actually starts playing
 * - when it is scheduled to stop
 * - when it actually stops playing
 */

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

  constructor(private audioLoader: AudioLoader) {
    eventListener.on("game-start", this.onGameStart);
    eventListener.on("beater-brick-collision", this.onBeaterBrickCollision);
    eventListener.on("beater-beater-collision", this.onBeaterBeaterCollision);
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

    // This player has been scheduled to start now
    console.log(`Scheduled to start`, name);

    Tone.Transport.scheduleOnce(() => {
      // This player has now started
      const item = this.audioItemMap.get(name);
      if (item) {
        item.started = true;
      }

      console.log("Actually started", name);
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

    console.log("Scheduled to stop", name);

    // When it stops
    audioItem.player.onstop = () => {
      // Remove from map so it can start again
      this.audioItemMap.delete(name);

      console.log("Actually stopped", name);
    };
  }

  private onBeaterBeaterCollision = (event: BeaterBeaterCollision) => {
    // Play random one shot
  };
}
