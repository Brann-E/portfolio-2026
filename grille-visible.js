/* Montre ou cache la grille de la page (colonnes et lignes), par-dessus les composants.
   Le dessin est en CSS (html[data-grille] .page::before, dans styles.css) ; ce script ne fait que poser l'attribut.
   Touche G, ou le bouton [data-grille-bouton]. Réservé à la page des composants. */
(function () {
  "use strict";
  var racine = document.documentElement;
  var bouton = document.querySelector("[data-grille-bouton]");
  function bascule() {
    var actif = racine.hasAttribute("data-grille");
    if (actif) racine.removeAttribute("data-grille"); else racine.setAttribute("data-grille", "");
    if (bouton) bouton.setAttribute("aria-pressed", String(!actif));
  }
  if (bouton) bouton.addEventListener("click", bascule);
  document.addEventListener("keydown", function (e) {
    if ((e.key === "g" || e.key === "G") && !e.ctrlKey && !e.metaKey && !e.altKey && !e.target.closest("input, textarea, select, [contenteditable]")) bascule();
  });
})();
