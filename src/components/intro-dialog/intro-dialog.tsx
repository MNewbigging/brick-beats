import "./intro-dialog.scss";

import React from "react";
import { Button, Dialog, DialogBody } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

import { AppState } from "../../app-state";

interface IntroDialogProps {
  appState: AppState;
}

export const IntroDialog: React.FC<IntroDialogProps> = observer(
  ({ appState }) => {
    return (
      <Dialog
        title="How to play"
        isOpen={!appState.gameStarted}
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isCloseButtonShown={false}
      >
        <DialogBody>
          <p>Left click - add a beater</p>
          <p>Right click - add a brick</p>

          <Button
            loading={appState.loading}
            onClick={appState.startGame}
            text={"Start"}
          />
        </DialogBody>
      </Dialog>
    );
  }
);
