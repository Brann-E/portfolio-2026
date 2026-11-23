import { h } from "../dom.js";
import { createScreen } from "../ui/screen.js";

import { tr } from "../i18n.js";
/** Écran provisoire des onglets pas encore reconstruits. */
export function renderPlaceholder(id, title) {
  return createScreen({ id, title, body: h("p", { class: "placeholder" }, tr("Écran en cours de reconstruction.")) });
}
