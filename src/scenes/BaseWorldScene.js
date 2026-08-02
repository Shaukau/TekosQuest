import { WORLD } from "../data/world.js";
import { QuestEngine } from "../core/QuestEngine.js";
import { gameState } from "../core/GameState.js";
import { events } from "../core/EventBus.js";
import { showDialogue, closeDialogue } from "../core/Dialogue.js";

export class BaseWorldScene extends Phaser.Scene {
  constructor(key){super(key);this.sceneKey=key}

  create(data={}){
    this.definition=WORLD[this.sceneKey];
    gameState.setScene(this.sceneKey);
    this.makeTextures();
    this.physics.world.setBounds(0,0,...this.definition.size);
    this.cameras.main.setBounds(0,0,...this.definition.size);
    this.staticGroup=this.physics.add.staticGroup();
    this.interactions=[];
    this.drawFloor();
    this.drawEnvironment();
    this.drawDecorations();
    this.createObjects();

    const spawn=this.definition.spawns[data.spawn]||this.definition.spawns.default||[120,120];
    this.player=this.physics.add.sprite(spawn[0],spawn[1],"player1");
    this.player.setCollideWorldBounds(true).setDepth(50);
    this.player.body.setSize(22,20).setOffset(5,34);
    this.physics.add.collider(this.player,this.staticGroup);
    this.playerShadow=this.add.ellipse(spawn[0],spawn[1]+24,28,12,0x102033,.26).setDepth(20);
    this.cameras.main.startFollow(this.player,true,.12,.12);
    this.cameras.main.setZoom(innerWidth<700?.92:1.04);

    this.cursors=this.input.keyboard.createCursorKeys();
    this.keys=this.input.keyboard.addKeys("Z,Q,S,D,E,SPACE,ENTER");
    this.lastInteract=0;this.stepFrame=0;

    this.prompt=this.add.text(0,0,"",{fontFamily:"Courier New",fontSize:"15px",color:"#fff",backgroundColor:"#082c40",padding:{x:8,y:5},stroke:"#00d7e7",strokeThickness:1}).setDepth(100).setVisible(false);
    this.add.text(20,18,this.definition.title,{fontFamily:"Courier New",fontSize:"18px",color:"#fff",backgroundColor:"#14263e",padding:{x:10,y:6}}).setScrollFactor(0).setDepth(200);

    events.on("scene:travel",({scene,spawn})=>this.scene.start(scene,{spawn}));
    events.on("mission:start",({id})=>this.startMission(id));
    this.cameras.main.fadeIn(220,0,0,0);
  }

  makeTextures(){
    if(this.textures.exists("player1"))return;
    const make=(key,leg)=>{
      const g=this.make.graphics({add:false});
      g.fillStyle(0x172033).fillRect(6,0,20,4);
      g.fillStyle(0x73402d).fillRect(7,3,18,11);
      g.fillStyle(0xf2bb88).fillRect(8,12,16,13);
      g.fillStyle(0x1fcbe4).fillRect(5,25,22,17);
      g.fillStyle(0xf2bb88).fillRect(2,27,4,13).fillRect(26,27,4,13);
      g.fillStyle(0x1f3f70).fillRect(7,42+leg,7,12-leg).fillRect(18,42,7,12);
      g.fillStyle(0x111827).fillRect(6,52,9,4).fillRect(17,52,9,4);
      g.generateTexture(key,32,56);g.destroy();
    };
    make("player1",0);make("player2",2);
  }

  drawFloor(){
    const g=this.add.graphics().setDepth(0);
    const [w,h]=this.definition.size;
    const floor=this.definition.palette?.floor||0x3f5368;
    g.fillStyle(floor).fillRect(0,0,w,h);
    const pattern=this.definition.floorPattern;
    if(pattern==="grass"){
      g.lineStyle(1,0x5f9f5c,.22);
      for(let x=0;x<w;x+=32)g.lineBetween(x,0,x,h);
      for(let y=0;y<h;y+=32)g.lineBetween(0,y,w,y);
    }else if(pattern==="wood"){
      for(let y=0;y<h;y+=44){
        g.fillStyle(y%88===0?0xd8c991:0xe1d49f).fillRect(0,y,w,42);
        g.lineStyle(2,0xb9a875,.45).lineBetween(0,y,w,y);
      }
    }else{
      const tile=54;
      for(let y=0;y<h;y+=tile)for(let x=0;x<w;x+=tile){
        const c=((x/tile+y/tile)%2===0)?floor:Phaser.Display.Color.ValueToColor(floor).darken(6).color;
        g.fillStyle(c).fillRect(x,y,tile-2,tile-2);
      }
    }
  }

  drawEnvironment(){
    const g=this.add.graphics().setDepth(2);
    if(this.definition.roads){
      g.fillStyle(this.definition.palette?.road||0xd5c791);
      for(const r of this.definition.roads){g.fillRect(...r);g.lineStyle(3,0xc2b37c,.7).strokeRect(...r)}
    }
    for(const w of this.definition.walls||[]){
      g.fillStyle(this.definition.palette?.wall||0x394353).fillRect(...w);
      g.lineStyle(3,0x1e2734).strokeRect(...w);
      const z=this.add.zone(w[0]+w[2]/2,w[1]+w[3]/2,w[2],w[3]);this.physics.add.existing(z,true);this.staticGroup.add(z);
    }
  }

  drawDecorations(){
    for(const d of this.definition.decorations||[]){
      const c=this.add.container(d.x,d.y).setDepth(8);
      if(d.type==="tree"){
        c.add([this.add.ellipse(0,18,52,18,0x173226,.23),this.add.rectangle(0,4,16,42,0x7a4a2a).setStrokeStyle(3,0x3a2d20),this.add.circle(0,-24,30,0x3f9a62).setStrokeStyle(4,0x24583b),this.add.circle(-18,-12,21,0x58b66f).setStrokeStyle(3,0x24583b),this.add.circle(18,-12,21,0x55aa68).setStrokeStyle(3,0x24583b)]);
      }else if(d.type==="lamp"){
        c.add([this.add.circle(0,-35,24,0x7ef4ff,.18),this.add.rectangle(0,0,8,58,0x25364a),this.add.rectangle(0,-35,24,14,0x9af6ff).setStrokeStyle(3,0x25364a)]);
      }else if(d.type==="bench"){
        c.add([this.add.rectangle(0,0,70,14,0x8a5a32).setStrokeStyle(3,0x352a24),this.add.rectangle(-25,16,8,28,0x354254),this.add.rectangle(25,16,8,28,0x354254)]);
      }else if(d.type==="flower"){
        c.add([this.add.circle(-8,0,6,0xffe76a),this.add.circle(8,0,6,0xff6aa7),this.add.circle(0,8,6,0x7bdc77)]);
      }else if(d.type==="plant"){
        c.add([this.add.ellipse(0,6,34,18,0x10251d,.18),this.add.rectangle(0,9,24,24,0xd94f68).setStrokeStyle(3,0x2c2b38),this.add.circle(-8,-8,14,0x42a66a),this.add.circle(8,-12,13,0x59bd76)]);
      }else if(d.type==="neonLine"){
        c.add([this.add.rectangle(0,0,d.w,5,d.color,.28),this.add.rectangle(0,0,d.w,2,d.color,1)]);
      }else if(d.type==="serverRack"){
        c.add(this.makeServerRack());
      }else if(d.type==="displayWall"){
        const p=this.add.rectangle(0,0,d.w,d.h,0x1b2434).setStrokeStyle(4,0x0ed9df);c.add(p);
        [0xff176d,0x27d9e8,0xf5c33a,0x53c77e].forEach((color,i)=>c.add(this.add.rectangle(-d.w/2+35+i*48,0,24,32,color)));
      }else if(d.type==="rug"){
        c.add(this.add.rectangle(0,0,d.w,d.h,d.color,.72).setStrokeStyle(4,0x2c3d55));
      }else if(d.type==="window"){
        c.add(this.add.rectangle(0,0,d.w,d.h,0x9edcff).setStrokeStyle(6,0x2c3a50));
      }else if(d.type==="hospitalBanner"){
        c.add([this.add.rectangle(0,0,d.w,d.h,0xdff7ff).setStrokeStyle(5,0x2e5371),this.add.text(0,0,"CONFIDENTIALITÉ · TRAÇABILITÉ · DISPONIBILITÉ",{fontFamily:"Courier New",fontSize:"20px",color:"#35577a"}).setOrigin(.5)]);
      }else if(d.type==="chairRow"){
        for(let i=-2;i<=2;i++)c.add(this.add.rectangle(i*74,0,54,28,0x66798f).setStrokeStyle(3,0x27364b));
      }
    }
  }

  makeServerRack(){
    const c=this.add.container();
    c.add(this.add.rectangle(0,0,94,128,0x3c465b).setStrokeStyle(5,0x161c29));
    for(let i=0;i<5;i++){c.add(this.add.rectangle(0,-42+i*20,66,10,0x65758d));c.add(this.add.rectangle(-34,-42+i*20,8,8,i===2?0xe6585d:0x6fd16c))}
    return c;
  }

  createObjects(){
    for(const item of this.definition.objects){
      const group=this.add.container(item.x,item.y).setDepth(15);
      const w=item.w||48,h=item.h||62;
      if(item.type==="building")this.drawBuilding(group,item,w,h);
      else if(item.type==="npc")this.drawNpc(group,item);
      else if(item.type==="computer")this.drawComputer(group,item,w,h);
      else if(item.type==="portal")this.drawPortal(group,item,w,h);
      else this.drawFurniture(group,item,w,h);

      if(["furniture","computer","building"].includes(item.type)){
        const z=this.add.zone(item.x+(item.type==="building"?w/2:0),item.y+(item.type==="building"?h/2:0),w,h);
        this.physics.add.existing(z,true);this.staticGroup.add(z);
      }
      if(["portal","npc","computer"].includes(item.type))this.interactions.push({...item,group});
    }
  }

  drawBuilding(group,item,w,h){
    group.add([this.add.rectangle(12,14,w,h,0x000000,.18).setOrigin(0),this.add.rectangle(0,0,w,h,0xf3f5ee).setOrigin(0).setStrokeStyle(6,0x263348),this.add.triangle(w/2,-22,0,85,w/2,0,w,85,item.color||0x5ba8d4).setOrigin(.5,.5)]);
    const windows=item.windows||2;
    for(let i=0;i<windows;i++){const wx=65+i*((w-130)/Math.max(1,windows-1));group.add(this.add.rectangle(wx,120,54,48,0x9fd7ff).setStrokeStyle(5,0x243349))}
    group.add([this.add.rectangle(w/2,h-42,62,84,0x7c3d28).setStrokeStyle(5,0x2b2530),this.add.text(w/2,h-54,item.label,{fontFamily:"Courier New",fontSize:"19px",color:"#fff",backgroundColor:"#24364e",padding:{x:10,y:6}}).setOrigin(.5)]);
    if(item.emblem==="cross"){group.add([this.add.rectangle(w/2,82,64,42,0xffffff).setStrokeStyle(4,0xd94060),this.add.rectangle(w/2,82,38,10,0xe84267),this.add.rectangle(w/2,82,10,38,0xe84267)])}
  }

  drawNpc(group,item){
    group.add([this.add.ellipse(0,42,34,14,0x0d1f2d,.32),this.add.rectangle(0,-11,34,11,item.hair||0x6f3f2f).setStrokeStyle(3,0x172033),this.add.rectangle(0,3,28,28,0xf0b783).setStrokeStyle(3,0x172033),this.add.rectangle(0,33,34,36,item.color).setStrokeStyle(3,0x172033),this.add.rectangle(-8,58,8,18,0x223551),this.add.rectangle(8,58,8,18,0x223551),this.add.text(0,-44,item.label,{fontFamily:"Courier New",fontSize:"16px",color:"#fff",backgroundColor:"#203247",padding:{x:5,y:2}}).setOrigin(.5)]);
  }

  drawComputer(group,item,w,h){
    group.add([this.add.rectangle(0,20,w,h,0xb77c43).setStrokeStyle(5,0x422f24),this.add.rectangle(0,-5,w-42,h-46,0xf5f3e9).setStrokeStyle(4,0x344155),this.add.rectangle(0,-12,74,52,item.screen||0x5ca3d9).setStrokeStyle(6,0x172033),this.add.rectangle(0,22,38,8,0x63748a),this.add.text(0,h/2-12,item.label,{fontFamily:"Courier New",fontSize:"14px",color:"#27334a"}).setOrigin(.5)]);
  }

  drawPortal(group,item,w,h){
    group.add([this.add.rectangle(0,0,w+18,h+18,0xff1b78,.14),this.add.rectangle(0,0,w,h,0xe74768).setStrokeStyle(4,0x1d283a),this.add.text(0,0,item.label,{fontFamily:"Courier New",fontSize:"15px",color:"#fff",align:"center",wordWrap:{width:Math.max(w-12,80)}}).setOrigin(.5)]);
  }

  drawFurniture(group,item,w,h){
    if(item.subtype==="bed")group.add([this.add.rectangle(0,0,w,h,0x5b83b1).setStrokeStyle(5,0x263348),this.add.rectangle(-45,-18,65,38,0xe8f4ff).setStrokeStyle(3,0x263348)]);
    else if(item.subtype==="desk")group.add([this.add.rectangle(0,0,w,h,0x9a6539).setStrokeStyle(5,0x3f2d22),this.add.rectangle(0,-18,72,46,0x2d4259).setStrokeStyle(4,0x182334)]);
    else group.add([this.add.rectangle(0,0,w,h,0x9a7650).setStrokeStyle(4,0x1d283a),this.add.text(0,0,item.label,{fontFamily:"Courier New",fontSize:"15px",color:"#fff",align:"center",wordWrap:{width:Math.max(w-12,80)}}).setOrigin(.5)]);
  }

  update(time){
    const speed=190;let vx=0,vy=0;
    if(this.cursors.left.isDown||this.keys.Q.isDown)vx=-speed;
    if(this.cursors.right.isDown||this.keys.D.isDown)vx=speed;
    if(this.cursors.up.isDown||this.keys.Z.isDown)vy=-speed;
    if(this.cursors.down.isDown||this.keys.S.isDown)vy=speed;
    this.player.setVelocity(vx,vy);if(vx&&vy)this.player.body.velocity.normalize().scale(speed);
    if(vx||vy){this.stepFrame=Math.floor(time/170)%2;this.player.setTexture(this.stepFrame?"player2":"player1")}
    this.playerShadow.setPosition(this.player.x,this.player.y+24);

    const nearest=this.findNearest();
    if(nearest)this.prompt.setText(`[ESPACE] ${nearest.label}`).setPosition(this.player.x-70,this.player.y-78).setVisible(true);
    else this.prompt.setVisible(false);

    const pressed=Phaser.Input.Keyboard.JustDown(this.keys.SPACE)||Phaser.Input.Keyboard.JustDown(this.keys.ENTER)||Phaser.Input.Keyboard.JustDown(this.keys.E);
    if(pressed&&nearest&&time-this.lastInteract>250){this.lastInteract=time;this.interact(nearest)}
  }

  findNearest(){
    let result=null,best=88;
    for(const item of this.interactions){const d=Math.hypot(this.player.x-item.x,this.player.y-item.y);if(d<best){result=item;best=d}}
    return result;
  }

  interact(item){
    const allowed=QuestEngine.canInteract(item.id);
    if(!allowed.allowed&&item.type!=="portal"){events.emit("toast",{message:allowed.reason});return}
    if(item.type==="portal"){
      if(QuestEngine.interact(item.id))return;
      this.cameras.main.fadeOut(180,0,0,0);this.time.delayedCall(190,()=>this.scene.start(item.to,{spawn:item.spawn}));return;
    }
    if(QuestEngine.interact(item.id))return;
    if(item.type==="npc")showDialogue({title:item.label,html:`<p>${item.label} n'a rien de nouveau à te confier pour le moment.</p>`,buttons:[{label:"Fermer",action:closeDialogue}]});
    else if(item.type==="computer")showDialogue({title:item.label,html:`<p>Cet équipement est disponible, mais aucune mission active ne le concerne.</p>`,buttons:[{label:"Fermer",action:closeDialogue}]});
  }

  startMission(id){
    if(id!=="sim001")return;
    let selected=null;
    showDialogue({
      title:"SIM-001 — PC sans accès réseau",
      subtitle:"Première action",
      html:`<p><strong>Symptôme :</strong> le poste n'accède plus à l'intranet.</p>
        <button class="choice" data-choice="0">A. Exécuter ipconfig /all</button>
        <button class="choice" data-choice="1">B. Réinstaller Windows</button>
        <button class="choice" data-choice="2">C. Désactiver le pare-feu définitivement</button>
        <div id="mission-feedback"></div>`,
      buttons:[{label:"Valider",className:"success",action:()=>{
        if(selected===0){
          gameState.setFlag("sim001Completed");gameState.completeQuest("sim001");
          gameState.reward({xp:120,credits:60});gameState.setQuest("free_play");
          closeDialogue();events.emit("toast",{message:"SIM-001 validé : +120 XP, +60 crédits"});
        }
      }}]
    });
    document.querySelectorAll("[data-choice]").forEach(button=>button.addEventListener("click",()=>{
      selected=Number(button.dataset.choice);
      document.querySelectorAll("[data-choice]").forEach(b=>b.classList.remove("good","bad"));
      button.classList.add(selected===0?"good":"bad");
      document.querySelector("#mission-feedback").innerHTML=selected===0
        ?`<div class="feedback"><strong>Bonne méthode.</strong><p>ipconfig /all permet de vérifier l'adresse, le masque, la passerelle, les DNS et l'état DHCP avant toute modification.</p></div>`
        :`<div class="feedback"><strong>Mauvaise méthode.</strong><p>Cette action est disproportionnée ou risquée. Il faut d'abord observer et tester.</p></div>`;
    }));
  }
}
