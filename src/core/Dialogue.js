const overlay = document.querySelector("#dialogue");
const title = document.querySelector("#dialogue-title");
const subtitle = document.querySelector("#dialogue-subtitle");
const content = document.querySelector("#dialogue-content");
const actions = document.querySelector("#dialogue-actions");

export function closeDialogue() {
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

export function showDialogue({ title: t, subtitle: s = "", html = "", buttons = [] }) {
  title.textContent = t;
  subtitle.textContent = s;
  content.innerHTML = html;
  actions.innerHTML = "";
  for (const button of buttons) {
    const el = document.createElement("button");
    el.textContent = button.label;
    el.className = button.className || "";
    el.addEventListener("click", button.action);
    actions.append(el);
  }
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

document.querySelector("#dialogue-close").addEventListener("click", closeDialogue);
