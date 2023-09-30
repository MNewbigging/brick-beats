import * as Tone from "tone";

import { AudioLoader } from "./audio-loader";
import {
  BeaterBeaterCollision,
  BeaterBrickCollision,
} from "../events/event-map";
import { BeaterName } from "../types/beater-name";
import { BrickName } from "../types/brick-name";
import { eventListener } from "../events/event-listener";
import {
  Track,
  TrackName,
  TrackType,
  getBrickTrackType,
  getRandomTrack,
} from "../types/track-types";

export class AudioManager {
  // Brick name and corresponding active track
  private currentTracks = new Map<string, Track>();

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
    // Get any existing track for this brick
    const track = this.currentTracks.get(event.brickName);

    // todo - allow for multiple tracks per brick

    // If there is no such item, can add a new track for this brick
    if (!track) {
      this.addTrack(event.brickName);

      return;
    }

    // If the item has already started and NOT been scheduled for removal, can stop it
    if (track.started && !track.toBeRemoved) {
      this.removeTrack(event.brickName, track);
    }
  };

  private addTrack(brickName: BrickName) {
    // Get the track type for this brick
    const trackType = getBrickTrackType(brickName);

    // Then get a track name for this track type
    const trackName = getRandomTrack(trackType);

    // Then get the associated player for it
    const player = this.audioLoader.getPlayer(trackName);
    if (!player) {
      return;
    }

    // Start it
    this.startAudio(brickName, trackType, player);
  }

  private startAudio(
    brickName: BrickName,
    trackType: TrackType,
    player: Tone.Player
  ) {
    // When it starts, do this once
    Tone.Transport.scheduleOnce(() => {
      // This player has now started
      const track = this.currentTracks.get(brickName);
      if (track) {
        track.started = true;
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
    this.currentTracks.set(brickName, {
      type: trackType,
      started: false,
      toBeRemoved: false,
      scheduleId,
      player,
    });
  }

  private removeTrack(brickName: BrickName, track: Track) {
    // Schedule for removal
    track.toBeRemoved = true;

    // Prevent further looping
    Tone.Transport.clear(track.scheduleId);

    // When it stops
    track.player.onstop = () => {
      // Remove track from map
      this.currentTracks.delete(brickName);
    };
  }

  // private onBeaterBeaterCollision = (event: BeaterBeaterCollision) => {
  // };
}
