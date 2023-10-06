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
    [
      TrackName.CLAP_04,
      "/audio/drum-loops/claps/SH_TCH_125_Drum_Loop_Clap_04.wav",
    ],
    [
      TrackName.CLAP_05,
      "/audio/drum-loops/claps/SH_TCH_125_Drum_Loop_Clap_05.wav",
    ],
    [
      TrackName.CLAP_06,
      "/audio/drum-loops/claps/SH_TCH_125_Drum_Loop_Clap_06.wav",
    ],
    [
      TrackName.CLAP_07,
      "/audio/drum-loops/claps/SH_TCH_125_Drum_Loop_Clap_07.wav",
    ],
    [
      TrackName.KICK_01,
      "/audio/drum-loops/kick/SH_TCH_125_Drum_Loop_Kick_01.wav",
    ],
    [
      TrackName.KICK_02,
      "/audio/drum-loops/kick/SH_TCH_125_Drum_Loop_Kick_02.wav",
    ],
    [
      TrackName.KICK_03,
      "/audio/drum-loops/kick/SH_TCH_125_Drum_Loop_Kick_03.wav",
    ],
    [
      TrackName.KICK_04,
      "/audio/drum-loops/kick/SH_TCH_125_Drum_Loop_Kick_04.wav",
    ],
    [
      TrackName.KICK_05,
      "/audio/drum-loops/kick/SH_TCH_125_Drum_Loop_Kick_05.wav",
    ],
    [
      TrackName.KICK_06,
      "/audio/drum-loops/kick/SH_TCH_125_Drum_Loop_Kick_06.wav",
    ],
    [
      TrackName.KICK_07,
      "/audio/drum-loops/kick/SH_TCH_125_Drum_Loop_Kick_07.wav",
    ],
    [
      TrackName.HATS_01,
      "/audio/drum-loops/hats/SH_TCH_125_Drum_Loop_Hats_01.wav",
    ],
    [
      TrackName.HATS_02,
      "/audio/drum-loops/hats/SH_TCH_125_Drum_Loop_Hats_02.wav",
    ],
    [
      TrackName.HATS_03,
      "/audio/drum-loops/hats/SH_TCH_125_Drum_Loop_Hats_03.wav",
    ],
    [
      TrackName.HATS_04,
      "/audio/drum-loops/hats/SH_TCH_125_Drum_Loop_Hats_04.wav",
    ],
    [
      TrackName.HATS_05,
      "/audio/drum-loops/hats/SH_TCH_125_Drum_Loop_Hats_05.wav",
    ],
    [
      TrackName.HATS_06,
      "/audio/drum-loops/hats/SH_TCH_125_Drum_Loop_Hats_06.wav",
    ],
    [
      TrackName.HATS_07,
      "/audio/drum-loops/hats/SH_TCH_125_Drum_Loop_Hats_07.wav",
    ],
    [
      TrackName.PERC_FX_02,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_02.wav",
    ],
    [
      TrackName.PERC_FX_03,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_03.wav",
    ],
    [
      TrackName.PERC_FX_04,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_04.wav",
    ],
    [
      TrackName.PERC_FX_05,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_05.wav",
    ],
    [
      TrackName.PERC_FX_06,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_06.wav",
    ],
    [
      TrackName.PERC_FX_07,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_07.wav",
    ],
    [
      TrackName.PERC_FX_08,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_08.wav",
    ],
    [
      TrackName.PERC_FX_09,
      "/audio/drum-loops/perc-fx/SH_TCH_125_Perc_Loop_09.wav",
    ],
    [
      TrackName.BASS_A_SHARP,
      "/audio/bass-loops/SH_TCH_125_Bass_Loop_A_SHARP.wav",
    ],
    [TrackName.BASS_E, "/audio/bass-loops/SH_TCH_125_Bass_Loop_E.wav"],
    [TrackName.BASS_F_01, "/audio/bass-loops/SH_TCH_125_Bass_Loop_F_01.wav"],
    [
      TrackName.BASS_F_02,
      "/audio/bass-loops/FL_FUR_Kit2_Bass_Loop_Synths_Drop_125_F.wav",
    ],
    [TrackName.BASS_G_01, "/audio/bass-loops/SH_TCH_125_Bass_Loop_G_01.wav"],
    [TrackName.BASS_G_02, "/audio/bass-loops/SH_TCH_125_Bass_Loop_G_02.wav"],
    [
      TrackName.BASS_G_SHARP_01,
      "/audio/bass-loops/SH_TCH_125_Bass_Loop_G_SHARP_01.wav",
    ],
    [
      TrackName.BASS_G_SHARP_02,
      "/audio/bass-loops/SH_TCH_125_Bass_Loop_G_SHARP_02.wav",
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
