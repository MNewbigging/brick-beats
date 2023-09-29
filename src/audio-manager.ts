import * as Tone from "tone";

import { AudioLoader } from "./audio-loader";
import {
  BeaterBeaterCollision,
  BeaterBrickCollision,
} from "./events/event-map";
import { BeaterName } from "./types/beater-name";
import { BrickName } from "./types/brick-name";
import { eventListener } from "./events/event-listener";

interface AudioPlayer {
  scheduleId: number;
  player: Tone.Player;
  toBeRemoved: boolean;
}

/**
 * All audio to be controlled by this class.
 * Appropriate audio lib needs installing first, then play in response to game events.
 */
export class AudioManager {
  // Stores joinedName and id of scheduled callback for audio currently playing
  private playingMap = new Map<string, AudioPlayer>();

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
    // Each beater+brick name results in a single layer
    const joinedName = event.beaterName.concat(event.brickName);

    // Get id of audio already playing for this name
    const audioPlayer = this.playingMap.get(joinedName);

    if (audioPlayer) {
      this.stopAudio(joinedName, audioPlayer);
    } else {
      this.startAudio(joinedName);
    }
  };

  private startAudio(name: string) {
    // First get the audio player for this name
    const player = this.audioLoader.getPlayer(name);
    if (!player) {
      return;
    }

    // Loop it every 4 measures (8 beats), start at next measure
    const scheduleId = Tone.Transport.scheduleRepeat(
      () => {
        player.start();
      },
      "4m",
      "@1m"
    );

    // Add it to the map to be stopped later
    this.playingMap.set(name, { player, scheduleId });
  }

  private stopAudio(name: string, audioPlayer: AudioPlayer) {
    // If already scheduled for removal, can stop
    if (audioPlayer.toBeRemoved) {
      return;
    }

    // Schedule for removal
    audioPlayer.toBeRemoved = true;

    Tone.Transport.scheduleOnce(() => {
      // Remove the scheduled repeat
      Tone.Transport.clear(audioPlayer.scheduleId);
      // Stop it playing on next measure
      audioPlayer.player.stop("@1m");
      // Remove from map
      this.playingMap.delete(name);
    }, "@1m");
  }

  private onBeaterBeaterCollision = (event: BeaterBeaterCollision) => {
    // Play random one shot
  };
}
