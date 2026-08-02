import { HomeScene } from "./scenes/HomeScene.js";
import { CampusScene } from "./scenes/CampusScene.js";
import { ShopScene } from "./scenes/ShopScene.js";
import { BackroomScene } from "./scenes/BackroomScene.js";
import { HospitalScene } from "./scenes/HospitalScene.js";
import { gameState } from "./core/GameState.js";
import { HUD } from "./ui/HUD.js";

const config={
  type:Phaser.AUTO,parent:"game-container",width:1100,height:720,
  backgroundColor:"#07131f",pixelArt:true,roundPixels:true,antialias:false,
  physics:{default:"arcade",arcade:{debug:false}},
  render:{pixelArt:true,roundPixels:true},
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
  scene:[HomeScene,CampusScene,ShopScene,BackroomScene,HospitalScene]
};
const game=new Phaser.Game(config);
new HUD();
window.tekosEngine={version:"0.2.0",codename:"Visual Foundation",game,state:gameState,save:()=>gameState.save()};
console.info("Tekos Quest Engine V0.2 — Visual Foundation");
