import { showToast } from "./toast.js";

import { tr } from "../i18n.js";
/**
 * Partage d'une représentation (un spectacle, tel jour, à telle heure, à tel endroit).
 * Sur téléphone, ouvre la feuille de partage du système ; ailleurs, copie le message dans le presse-papiers.
 * Le lien est celui de la fiche du spectacle sur le site officiel du festival.
 */
export async function shareRep(show, rep) {
  const text = tr("« {title} » ({company}) : {date} à {time}, {venue}.", { title: show.title, company: show.company, date: rep.date, time: rep.time, venue: rep.venue });
  const url = show.detail?.links?.show ?? "https://www.chalondanslarue.com/";

  if (navigator.share) {
    try {
      await navigator.share({ title: show.title, text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return; // l'utilisateur a fermé la feuille de partage
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    showToast({ message: tr("Lien copié : il ne reste plus qu'à le coller.") });
  } catch {
    showToast({ message: tr("Le partage n'est pas disponible sur cet appareil.") });
  }
}
