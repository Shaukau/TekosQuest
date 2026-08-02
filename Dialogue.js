import { quests } from "../data/quests.js";
import { gameState } from "./GameState.js";

export class QuestEngine {
  static current() {
    return quests[gameState.data.activeQuest] || null;
  }

  static canInteract(targetId) {
    const quest = this.current();
    if (!quest) return { allowed: true };
    if (!quest.requiredTarget) return { allowed: true };
    return {
      allowed: quest.requiredTarget === targetId,
      reason: quest.requiredTarget === targetId
        ? ""
        : `Suis d'abord l'objectif : ${quest.title}`
    };
  }

  static interact(targetId) {
    const quest = this.current();
    if (!quest || quest.requiredTarget !== targetId) return false;
    quest.onComplete?.();
    return true;
  }
}
