import { gameState } from "../core/GameState.js";
import { quests } from "../data/quests.js";
import { events } from "../core/EventBus.js";
import { SaveSystem } from "../core/SaveSystem.js";
import { showDialogue, closeDialogue } from "../core/Dialogue.js";

export class HUD {
  constructor() {
    this.toastTimer = null;
    this.bind();
    this.render();
  }

  bind() {
    events.on("state:changed", () => this.render());
    events.on("quest:changed", () => this.render());
    events.on("toast", ({ message }) => this.toast(message));

    document.querySelector("#btn-save").addEventListener("click", () => {
      gameState.save();
      this.toast("Partie sauvegardée");
    });

    document.querySelector("#btn-reset").addEventListener("click", () => {
      if (confirm("Créer une nouvelle partie ?")) SaveSystem.reset();
    });

    document.querySelector("#btn-journal").addEventListener("click", () => {
      const quest = quests[gameState.data.activeQuest];
      showDialogue({
        title: "Journal de Tekos",
        subtitle: "Progression actuelle",
        html: `<p><strong>Objectif :</strong> ${quest?.title || "Aucun"}</p>
               <p>${quest?.detail || ""}</p>
               <p><strong>Quêtes terminées :</strong> ${gameState.data.completedQuests.length}</p>
               <p><strong>Mode carrière :</strong> ${gameState.hasFlag("careerUnlocked") ? "Débloqué" : "Verrouillé"}</p>`,
        buttons: [{ label: "Fermer", action: closeDialogue }]
      });
    });
  }

  render() {
    const state = gameState.snapshot();
    const quest = quests[state.activeQuest];
    document.querySelector("#player-name").textContent = state.player.name;
    document.querySelector("#player-level").textContent = state.level;
    document.querySelector("#player-level").textContent = state.level;
    document.querySelector("#xp-value").textContent = state.player.xp;
    document.querySelector("#credits-value").textContent = state.player.credits;
    document.querySelector("#xp-bar").style.width = `${(state.player.xp % 250) / 2.5}%`;
    document.querySelector("#objective-title").textContent = quest?.title || "Aucun objectif";
    document.querySelector("#objective-detail").textContent = quest?.detail || "";
  }

  toast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.add("hidden"), 2600);
  }
}
