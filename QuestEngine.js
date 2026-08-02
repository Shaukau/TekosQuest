const SAVE_KEY = "tekos_quest_engine_save_v1";
const LEGACY_KEY = "tekos_infraquest_save_v13";

export class SaveSystem {
  static load(defaultState) {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return { ...defaultState, ...JSON.parse(raw) };

      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const old = JSON.parse(legacy);
        return {
          ...defaultState,
          player: {
            ...defaultState.player,
            name: old.player?.name || "Tekos",
            xp: Number(old.xp) || 0,
            credits: Number(old.credits) || 250
          },
          legacyImported: true
        };
      }
    } catch (error) {
      console.error("Chargement impossible", error);
    }
    return structuredClone(defaultState);
  }

  static save(state) {
    const payload = {
      ...state,
      saveVersion: 1,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  }

  static reset() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
}
