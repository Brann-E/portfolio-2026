/* ------------------------------------------------------------------
   Navigation partagée - SOURCE UNIQUE de la barre de nav, pour toutes les pages.
   Pour modifier la nav partout : éditer le HTML ci-dessous (entre backticks).

   Chaque page ne contient qu'un <script src="nav.js"></script>, posé à
   l'emplacement de la nav : le script s'exécute tout de suite et la pose à sa
   place (aucun clignotement : la barre est fixe, visible dès l'arrivée).
   Livré par SCRIPT (et non par fetch) : fonctionne en ligne, avec Live Server,
   et en ouvrant le .html en local (file://).

   La page active est déduite de l'adresse (avec ou sans .html).
   Le comportement (bouton hamburger, effet holographique) reste dans site-nav.js,
   chargé en fin de page.
------------------------------------------------------------------ */
(function () {
  "use strict";

  var HTML = `<nav class="site-nav" aria-label="Navigation principale">
  <a class="site-brand" href="/"><img class="site-mark" src="assets/logo_256.png" alt=""><span class="site-name">Brann Etienne <span class="site-role">&middot; Product design strategist</span></span></a>
  <div class="site-links">
    <a href="/etudes-de-cas" data-section="cases">&Eacute;tudes de cas</a>
    <a href="/comment-je-travaille" data-section="pratique">Comment je travaille</a>
    <a href="/a-propos" data-section="apropos">&Agrave; propos</a>
    <a class="site-contact" href="/contact">Contact</a>
  </div>
</nav>`;

  /* page courante -> entrée active (celles qui n'y figurent pas n'en ont aucune) */
  function sectionActive() {
    var page = location.pathname.replace(/\/+$/, "").split("/").pop().replace(/\.html$/, "");
    if (page === "etudes-de-cas" || page.indexOf("cas-") === 0) return "cases";
    if (page === "comment-je-travaille") return "pratique";
    if (page === "a-propos") return "apropos";
    if (page === "contact") return "contact";
    return "";
  }

  var tpl = document.createElement("template");
  tpl.innerHTML = HTML;
  var nav = tpl.content.firstElementChild;

  var actif = sectionActive();
  if (actif) {
    var lien = actif === "contact"
      ? nav.querySelector(".site-contact")
      : nav.querySelector('[data-section="' + actif + '"]');
    if (lien) lien.classList.add("active");
  }

  var s = document.currentScript;
  if (s && s.parentNode) {
    s.parentNode.insertBefore(nav, s);
    s.parentNode.removeChild(s);
  } else {
    document.body.insertBefore(nav, document.body.firstChild);
  }
})();
