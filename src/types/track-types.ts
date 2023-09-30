import * as Tone from "tone";
import { BrickName } from "./brick-name";

export enum TrackName {
  CLAP_03 = "clap-03",
  CLAP_04 = "clap-04",
  CLAP_05 = "clap-05",
  CLAP_06 = "clap-06",
  CLAP_07 = "clap-07",
  KICK_01 = "kick-01",
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
      return [TrackName.KICK_01];
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
