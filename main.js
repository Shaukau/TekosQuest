import { HomeScene } from "./scenes/HomeScene.js";
import { CampusScene } from "./scenes/CampusScene.js";
import { ShopScene } from "./scenes/ShopScene.js";
import { BackroomScene } from "./scenes/BackroomScene.js";
import { HospitalScene } from "./scenes/HospitalScene.js";
import { gameState } from "./core/GameState.js";
import { HUD } from "./ui/HUD.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 1100,
  height: 720,
  backgroundColor: "#0b1724",
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [HomeScene, CampusScene, ShopScene, BackroomScene, HospitalScene]
};

const game = new Phaser.Game(config);
new HUD();

game.events.once("ready", () => {
  console.info("Tekos Quest Engine ready");
});

window.tekosEngine = {
  version: "0.1.0",
  game,
  state: gameState,
  save: () => gameState.save()
};
