import { gameState } from "../core/GameState.js";
import { showDialogue, closeDialogue } from "../core/Dialogue.js";
import { events } from "../core/EventBus.js";

export const quests = {
  first_day: {
    title: "Premier jour de formation",
    detail: "Quitte ta maison et rends-toi à Tekos Tech.",
    requiredTarget: "home_exit",
    onComplete() {
      gameState.setFlag("prologueStarted");
      gameState.setQuest("meet_dora");
      events.emit("scene:travel", { scene: "CampusScene", spawn: "house" });
    }
  },
  meet_dora: {
    title: "Présente-toi à Dora",
    detail: "Entre dans Tekos Tech et parle à Dora.",
    requiredTarget: "dora",
    onComplete() {
      showDialogue({
        title: "Dora — Accueil",
        subtitle: "Bienvenue à Tekos Tech",
        html: `<p>Bonjour Tekos ! Aujourd'hui commence ta formation TSSR.</p>
               <p>Dom, ton formateur, t'attend dans l'arrière-boutique. Il va te présenter ton parcours.</p>`,
        buttons: [{
          label: "Aller voir Dom",
          className: "primary",
          action() {
            gameState.setFlag("metDora");
            gameState.setQuest("meet_dom");
            closeDialogue();
          }
        }]
      });
    }
  },
  meet_dom: {
    title: "Rencontre ton formateur",
    detail: "Passe dans l'arrière-boutique et parle à Dom.",
    requiredTarget: "dom",
    onComplete() {
      showDialogue({
        title: "Dom — Formateur TSSR",
        subtitle: "Présentation du parcours",
        html: `<p>Bienvenue dans ta formation.</p>
               <p>Tu vas apprendre le support, les réseaux, Windows, Linux, PowerShell, Active Directory, la sécurité et la sauvegarde.</p>
               <p>Ta première mission sera un diagnostic réseau sur le PC de formation.</p>`,
        buttons: [{
          label: "Commencer SIM-001",
          className: "success",
          action() {
            gameState.setFlag("metDom");
            gameState.setQuest("sim001");
            closeDialogue();
          }
        }]
      });
    }
  },
  sim001: {
    title: "SIM-001 — PC sans accès réseau",
    detail: "Utilise le PC GLPI de formation dans l'arrière-boutique.",
    requiredTarget: "training_pc",
    onComplete() {
      events.emit("mission:start", { id: "sim001" });
    }
  },
  free_play: {
    title: "Formation libre",
    detail: "Explore Tekos Tech et le campus.",
    requiredTarget: null
  }
};
