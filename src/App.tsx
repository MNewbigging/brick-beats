import "./app.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppState } from "./app-state";
import { IntroDialog } from "./intro-dialog/intro-dialog";

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  return (
    <div className="app">
      {/* The canvas is injected here */}
      <div id="game-mount"></div>

      <div className="sidebar"></div>

      {/* Intro dialog shows at start */}
      <IntroDialog appState={appState} />
    </div>
  );
});
