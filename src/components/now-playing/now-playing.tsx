import "./now-playing.scss";
import { observer } from "mobx-react-lite";
import React from "react";
import { AppState } from "../../app-state";
import { Brick } from "../brick/brick";

interface NowPlayingProps {
  appState: AppState;
}

export const NowPlaying: React.FC<NowPlayingProps> = observer(
  ({ appState }) => {
    return (
      <div className="now-playing">
        <div className="header">Now Playing</div>
        <div className="bricks-area">
          {appState.nowPlaying.map((brickName) => (
            <Brick brickName={brickName} />
          ))}
        </div>
      </div>
    );
  }
);
