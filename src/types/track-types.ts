import * as Tone from "tone";
import { BrickName } from "./brick-name";

export enum TrackName {
  CLAP_03 = "clap-03",
  CLAP_04 = "clap-04",
  CLAP_05 = "clap-05",
  CLAP_06 = "clap-06",
  CLAP_07 = "clap-07",
  KICK_01 = "kick-01",
  KICK_02 = "kick-02",
  KICK_03 = "kick-03",
  KICK_04 = "kick-04",
  KICK_05 = "kick-05",
  KICK_06 = "kick-06",
  KICK_07 = "kick-07",
  HATS_01 = "hats-01",
  HATS_02 = "hats-02",
  HATS_03 = "hats-03",
  HATS_04 = "hats-04",
  HATS_05 = "hats-05",
  HATS_06 = "hats-06",
  HATS_07 = "hats-07",
  PERC_FX_02 = "perc-fx-02",
  PERC_FX_03 = "perc-fx-03",
  PERC_FX_04 = "perc-fx-04",
  PERC_FX_05 = "perc-fx-05",
  PERC_FX_06 = "perc-fx-06",
  PERC_FX_07 = "perc-fx-07",
  PERC_FX_08 = "perc-fx-08",
  PERC_FX_09 = "perc-fx-09",
  BASS_A_SHARP = "bass-a-sharp",
  BASS_E = "bass-e",
  BASS_F_01 = "bass-f-01",
  BASS_F_02 = "bass-f-02",
  BASS_G_01 = "bass-g-01",
  BASS_G_02 = "bass-g-02",
  BASS_G_SHARP_01 = "bass-g#-01",
  BASS_G_SHARP_02 = "bass-g#-02",
}

export enum TrackType {
  CLAP = "clap",
  HATS = "hats",
  KICK = "kick",
  PERC_FX = "perc-fx",
  BASS = "bass",
  SYNTH = "synth",
  FX = "fx",
  VOCALS = "vocals",
}

// A looping audio track
export interface Track {
  type: TrackType; // what sort of track this is
  started: boolean; // cannot be stopped if it hasn't started
  toBeRemoved: boolean; // removal has been scheduled or not
  scheduleId: number; // id for the scheduled repeat
  player: Tone.Player; // reference to audio-loader's player map
}

export function getBrickTrackType(brickName: BrickName) {
  switch (brickName) {
    case BrickName.BLUE:
      return TrackType.CLAP;
    case BrickName.BLUE_DARK:
      return TrackType.KICK;
    case BrickName.BLUE_ICE:
      return TrackType.HATS;
    case BrickName.BLUE_MID:
      return TrackType.PERC_FX;
    case BrickName.RED:
      return TrackType.BASS;
    default:
      return TrackType.CLAP;
  }
}

export function getTracksForType(trackType: TrackType) {
  switch (trackType) {
    case TrackType.CLAP:
      return [
        TrackName.CLAP_03,
        TrackName.CLAP_04,
        TrackName.CLAP_05,
        TrackName.CLAP_06,
        TrackName.CLAP_07,
      ];
    case TrackType.KICK:
      return [
        TrackName.KICK_01,
        TrackName.KICK_02,
        TrackName.KICK_03,
        TrackName.KICK_04,
        TrackName.KICK_05,
        TrackName.KICK_06,
        TrackName.KICK_07,
      ];
    case TrackType.HATS:
      return [
        TrackName.HATS_01,
        TrackName.HATS_02,
        TrackName.HATS_03,
        TrackName.HATS_04,
        TrackName.HATS_05,
        TrackName.HATS_06,
        TrackName.HATS_07,
      ];
    case TrackType.PERC_FX:
      return [
        TrackName.PERC_FX_02,
        TrackName.PERC_FX_03,
        TrackName.PERC_FX_04,
        TrackName.PERC_FX_05,
        TrackName.PERC_FX_06,
        TrackName.PERC_FX_07,
        TrackName.PERC_FX_08,
        TrackName.PERC_FX_09,
      ];
    case TrackType.BASS:
      return [
        TrackName.BASS_A_SHARP,
        TrackName.BASS_E,
        TrackName.BASS_F_01,
        TrackName.BASS_F_02,
        TrackName.BASS_G_01,
        TrackName.BASS_G_02,
        TrackName.BASS_G_SHARP_01,
        TrackName.BASS_G_SHARP_02,
      ];

    default:
      return [TrackName.CLAP_03];
  }
}

export function getRandomTrack(trackType: TrackType) {
  // Get all tracks for this type
  const trackNames: TrackName[] = getTracksForType(trackType);

  // Pick a random one
  const rnd = Math.floor(Math.random() * trackNames.length);

  return trackNames[rnd];
}
