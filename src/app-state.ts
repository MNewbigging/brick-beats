import * as Tone from "tone";
import Phaser from "phaser";
import { action, makeAutoObservable, observable } from "mobx";

import { AudioLoader } from "./audio/audio-loader";
import { AudioManager } from "./audio/audio-manager";
import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { eventListener } from "./events/event-listener";

export class AppState {
  @observable loading = true;
  @observable gameStarted = false;

  private game?: Phaser.Game;
  private gameLoaded = false;
  private gameScene = new GameScene();
  private audioLoader = new AudioLoader();
  private audioManager = new AudioManager(this.audioLoader);

  constructor() {
    makeAutoObservable(this);

    // Allow time for UI to mount
    setTimeout(() => this.setupGame(), 100);
  }

  @action startGame = async () => {
    // Must start tone from a user interaction
    await Tone.start();

    this.gameStarted = true;
    eventListener.fire("game-start", null);
  };

  private setupGame() {
    eventListener.on("game-loaded", this.onGameLoaded);
    eventListener.on("audio-loaded", this.onAudioLoaded);

    // Load audio
    this.audioLoader.load();

    // Load game assets
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: "game-mount",
        mode: Phaser.Scale.RESIZE,
      },
      transparent: true,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
      fps: {
        min: 30,
        target: 60,
        smoothStep: true,
      },
      scene: [new BootScene(), this.gameScene],
    };

    this.game = new Phaser.Game(config);
  }

  @action private onGameLoaded = () => {
    this.gameLoaded = true;

    // Check if audio is also loaded
    if (this.audioLoader.loaded) {
      // Done loading
      this.loading = false;
    }
  };

  @action private onAudioLoaded = () => {
    // Check if game is also loaded
    if (this.gameLoaded) {
      this.loading = false;
    }
  };
}
