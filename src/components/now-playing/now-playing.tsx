import { observer } from "mobx-react-lite";
import "./now-playing.scss";

import React from "react";
import { AppState } from "../../app-state";
import { Brick } from "../brick/brick";
import { BrickName } from "../../types/brick-name";

interface NowPlayingProps {
  appState: AppState;
}

export const NowPlaying: React.FC<NowPlayingProps> = observer(
  ({ appState }) => {
    return (
      <div className="now-playing">
        <div className="header">Now Playing</div>
        <div className="bricks-area">
          <Brick brickName={BrickName.RED} />
        </div>
      </div>
    );
  }
);
