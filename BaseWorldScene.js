import { WORLD } from "../data/world.js";
import { QuestEngine } from "../core/QuestEngine.js";
import { gameState } from "../core/GameState.js";
import { events } from "../core/EventBus.js";
import { showDialogue, closeDialogue } from "../core/Dialogue.js";

export class BaseWorldScene extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.sceneKey = key;
  }

  create(data = {}) {
    this.definition = WORLD[this.sceneKey];
    gameState.setScene(this.sceneKey);
    this.cameras.main.setBackgroundColor(this.definition.floor);

    this.makeTextures();
    this.physics.world.setBounds(0, 0, ...this.definition.size);
    this.cameras.main.setBounds(0, 0, ...this.definition.size);

    this.staticGroup = this.physics.add.staticGroup();
    this.interactions = [];

    this.drawEnvironment();
    this.createObjects();

    const spawn = this.definition.spawns[data.spawn] || this.definition.spawns.default || [120, 120];
    this.player = this.physics.add.sprite(spawn[0], spawn[1], "player");
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(24, 24).setOffset(4, 18);
    this.player.setDepth(20);
    this.physics.add.collider(this.player, this.staticGroup);
    this.cameras.main.startFollow(this.player, true, .12, .12);
    this.cameras.main.setZoom(Math.min(innerWidth < 700 ? 1 : 1.15, 1.2));

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("Z,Q,S,D,E,SPACE,ENTER");
    this.lastInteract = 0;

    this.prompt = this.add.text(0, 0, "", {
      fontFamily: "Courier New", fontSize: "16px", color: "#ffffff",
      backgroundColor: "#09283d", padding: { x: 8, y: 5 }
    }).setDepth(50).setVisible(false);

    events.on("scene:travel", ({ scene, spawn }) => this.scene.start(scene, { spawn }));
    events.on("mission:start", ({ id }) => this.startMission(id));
  }

  makeTextures() {
    if (!this.textures.exists("player")) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0x7a422b).fillRect(8, 0, 16, 12);
      g.fillStyle(0xf2be8d).fillRect(7, 12, 18, 12);
      g.fillStyle(0x21c8e8).fillRect(5, 24, 22, 18);
      g.fillStyle(0x17263b).fillRect(6, 42, 8, 12).fillRect(18, 42, 8, 12);
      g.generateTexture("player", 32, 56);
      g.destroy();
    }
  }

  drawEnvironment() {
    const graphics = this.add.graphics();
    if (this.definition.roads) {
      graphics.fillStyle(0xd8c995);
      for (const road of this.definition.roads) graphics.fillRect(...road);
    }
    for (const wall of this.definition.walls || []) {
      graphics.fillStyle(0x394353).fillRect(...wall);
      const zone = this.add.zone(wall[0] + wall[2]/2, wall[1] + wall[3]/2, wall[2], wall[3]);
      this.physics.add.existing(zone, true);
      this.staticGroup.add(zone);
    }
  }

  createObjects() {
    for (const item of this.definition.objects) {
      const group = this.add.container(item.x, item.y);
      const width = item.w || 48, height = item.h || 62;
      let bodyColor = item.color || 0x9a7650;

      if (item.type === "building") {
        const shadow = this.add.rectangle(10, 12, width, height, 0x000000, .18).setOrigin(0);
        const base = this.add.rectangle(0, 0, width, height, 0xf6f4e8).setOrigin(0).setStrokeStyle(6, 0x273348);
        const roof = this.add.triangle(width/2, 0, 0, 70, width/2, 0, width, 70, bodyColor).setOrigin(.5, .5);
        const sign = this.add.text(width/2, height-45, item.label, {
          fontFamily: "Courier New", fontSize: "20px", color: "#ffffff",
          backgroundColor: "#23334a", padding: { x: 10, y: 5 }
        }).setOrigin(.5);
        group.add([shadow, base, roof, sign]);
      } else if (item.type === "npc") {
        const head = this.add.rectangle(0, 0, 30, 24, 0xf0b783).setStrokeStyle(3, 0x192234);
        const hair = this.add.rectangle(0, -10, 32, 9, item.color).setStrokeStyle(2, 0x192234);
        const body = this.add.rectangle(0, 30, 34, 34, item.color).setStrokeStyle(3, 0x192234);
        const label = this.add.text(0, -35, item.label, { fontFamily:"Courier New",fontSize:"16px",color:"#fff"}).setOrigin(.5);
        group.add([head,hair,body,label]);
      } else {
        const box = this.add.rectangle(0, 0, width, height, item.type === "portal" ? 0xe74c69 : bodyColor)
          .setOrigin(.5).setStrokeStyle(4, 0x1d283a);
        const label = this.add.text(0, 0, item.label, {
          fontFamily:"Courier New",fontSize:"15px",color:"#fff",align:"center",
          wordWrap:{width:Math.max(width-12,80)}
        }).setOrigin(.5);
        group.add([box,label]);
      }

      if (["furniture","computer","building"].includes(item.type)) {
        const zone = this.add.zone(item.x + (item.type === "building" ? width/2 : 0), item.y + (item.type === "building" ? height/2 : 0), width, height);
        this.physics.add.existing(zone, true);
        this.staticGroup.add(zone);
      }

      if (["portal","npc","computer"].includes(item.type)) {
        this.interactions.push({ ...item, group });
      }
    }
  }

  update(time) {
    const speed = 190;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.keys.Q.isDown) vx = -speed;
    if (this.cursors.right.isDown || this.keys.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.keys.Z.isDown) vy = -speed;
    if (this.cursors.down.isDown || this.keys.S.isDown) vy = speed;
    this.player.setVelocity(vx, vy);
    if (vx && vy) this.player.body.velocity.normalize().scale(speed);

    const nearest = this.findNearest();
    if (nearest) {
      this.prompt.setText(`[ESPACE] ${nearest.label}`)
        .setPosition(this.player.x - 65, this.player.y - 75)
        .setVisible(true);
    } else this.prompt.setVisible(false);

    const pressed = Phaser.Input.Keyboard.JustDown(this.keys.SPACE) ||
      Phaser.Input.Keyboard.JustDown(this.keys.ENTER) ||
      Phaser.Input.Keyboard.JustDown(this.keys.E);

    if (pressed && nearest && time - this.lastInteract > 250) {
      this.lastInteract = time;
      this.interact(nearest);
    }
  }

  findNearest() {
    let result = null, best = 85;
    for (const item of this.interactions) {
      const dx = this.player.x - item.x;
      const dy = this.player.y - item.y;
      const distance = Math.hypot(dx, dy);
      if (distance < best) { result = item; best = distance; }
    }
    return result;
  }

  interact(item) {
    const allowed = QuestEngine.canInteract(item.id);
    if (!allowed.allowed && item.type !== "portal") {
      events.emit("toast", { message: allowed.reason });
      return;
    }

    if (item.type === "portal") {
      if (QuestEngine.interact(item.id)) return;
      this.scene.start(item.to, { spawn: item.spawn });
      return;
    }

    if (QuestEngine.interact(item.id)) return;

    if (item.type === "npc") {
      showDialogue({
        title: item.label,
        html: `<p>${item.label} n'a rien de nouveau à te confier pour le moment.</p>`,
        buttons: [{ label: "Fermer", action: closeDialogue }]
      });
    } else if (item.type === "computer") {
      showDialogue({
        title: item.label,
        html: `<p>Cet équipement est disponible, mais aucune mission active ne le concerne.</p>`,
        buttons: [{ label: "Fermer", action: closeDialogue }]
      });
    }
  }

  startMission(id) {
    if (id !== "sim001") return;
    let selected = null;
    showDialogue({
      title: "SIM-001 — PC sans accès réseau",
      subtitle: "Première action",
      html: `<p><strong>Symptôme :</strong> le poste n'accède plus à l'intranet.</p>
        <button class="choice" data-choice="0">A. Exécuter ipconfig /all</button>
        <button class="choice" data-choice="1">B. Réinstaller Windows</button>
        <button class="choice" data-choice="2">C. Désactiver le pare-feu définitivement</button>
        <div id="mission-feedback"></div>`,
      buttons: [{
        label: "Valider",
        className: "success",
        action: () => {
          if (selected === null) return;
          if (selected === 0) {
            gameState.setFlag("sim001Completed");
            gameState.completeQuest("sim001");
            gameState.reward({ xp: 120, credits: 60 });
            gameState.setQuest("free_play");
            closeDialogue();
            events.emit("toast", { message: "SIM-001 validé : +120 XP, +60 crédits" });
          }
        }
      }]
    });

    document.querySelectorAll("[data-choice]").forEach(button => {
      button.addEventListener("click", () => {
        selected = Number(button.dataset.choice);
        document.querySelectorAll("[data-choice]").forEach(b => b.classList.remove("good","bad"));
        button.classList.add(selected === 0 ? "good" : "bad");
        document.querySelector("#mission-feedback").innerHTML = selected === 0
          ? `<div class="feedback"><strong>Bonne méthode.</strong><p>ipconfig /all permet de vérifier l'adresse, le masque, la passerelle, les DNS et l'état DHCP avant toute modification.</p></div>`
          : `<div class="feedback"><strong>Mauvaise méthode.</strong><p>Cette action est disproportionnée ou risquée. Il faut d'abord observer et tester.</p></div>`;
      });
    });
  }
}
