import { SaveSystem } from "./SaveSystem.js";
import { events } from "./EventBus.js";

const DEFAULT_STATE = {
  currentScene: "HomeScene",
  player: { name: "Tekos", xp: 0, credits: 250 },
  flags: {
    prologueStarted: false,
    metDora: false,
    metDom: false,
    sim001Completed: false,
    diploma: false,
    careerUnlocked: false
  },
  activeQuest: "first_day",
  completedQuests: [],
  legacyImported: false
};

class GameState {
  constructor() {
    this.data = SaveSystem.load(DEFAULT_STATE);
  }

  get level() {
    return Math.min(100, 1 + Math.floor(this.data.player.xp / 250));
  }

  setScene(scene) {
    this.data.currentScene = scene;
    this.save();
  }

  setFlag(name, value = true) {
    this.data.flags[name] = value;
    this.save();
    events.emit("state:changed", this.snapshot());
  }

  hasFlag(name) {
    return Boolean(this.data.flags[name]);
  }

  setQuest(id) {
    this.data.activeQuest = id;
    this.save();
    events.emit("quest:changed", { id });
  }

  completeQuest(id) {
    if (!this.data.completedQuests.includes(id)) this.data.completedQuests.push(id);
    this.save();
  }

  reward({ xp = 0, credits = 0 }) {
    this.data.player.xp += xp;
    this.data.player.credits += credits;
    this.save();
    events.emit("state:changed", this.snapshot());
  }

  save() {
    SaveSystem.save(this.data);
  }

  snapshot() {
    return structuredClone({ ...this.data, level: this.level });
  }
}

export const gameState = new GameState();
