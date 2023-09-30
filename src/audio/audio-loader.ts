import * as Tone from "tone";

import { BeaterName } from "../types/beater-name";
import { BrickName } from "../types/brick-name";
import { eventListener } from "../events/event-listener";
import { TrackName } from "../types/track-types";

export class AudioLoader {
  loaded = false;
  playerMap = new Map<string, Tone.Player>();

  private audioFileMap = new Map<string, string>([
    [
      TrackName.CLAP_03,
      "/audio/drum-loops/claps/SH_TCH_125_Drum_Loop_Clap_03.wav",
    ],
  ]);

  getPlayer(name: string) {
    return this.playerMap.get(name);
  }

  load() {
    this.audioFileMap.forEach((fileName, clipName) => {
      // Hack for published build
      let actualFileName = fileName;
      if (!window.location.href.includes("localhost")) {
        actualFileName = "/brick-beats" + actualFileName;
      }

      const url = new URL(actualFileName, import.meta.url).href;
      const player: Tone.Player = new Tone.Player(url, () =>
        this.onLoadPlayer(clipName, player)
      ).toDestination();
    });
  }

  private onLoadPlayer(clipName: string, player: Tone.Player) {
    // Add the player to the map
    this.playerMap.set(clipName, player);

    // Check if all players are now loaded
    if (this.playerMap.size === this.audioFileMap.size) {
      this.loaded = true;
      eventListener.fire("audio-loaded", null);
    }
  }
}
