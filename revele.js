/* Apparition du contenu en fondu depuis le bas : même grammaire que reveal.js du site
   (IntersectionObserver, état caché posé seulement si ce script tourne, rien d'animé si prefers-reduced-motion).
   Copie de prototype : le reveal.js du site réel n'est pas touché.
   Les petits motifs de disques naissent ensuite, avec leur propre délai (voir accueil.css). */
(function () {
  "use strict";

  var d = document, D = d.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  D.classList.add("js-rv", "js-rv-hold");

  var released = false;
  function release() { if (released) return; released = true; D.classList.remove("js-rv-hold"); }
  var failsafe = setTimeout(release, 1200);

  function setup() {
    var found = d.querySelectorAll(".section .page > *:not(.cellules):not(.cartes), .cellules > *, .pied-in > *, .defile, .cartes > .carte");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    for (var i = 0; i < found.length; i++) {
      found[i].classList.add("rv");
      io.observe(found[i]);
    }
    clearTimeout(failsafe);
    release();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", setup); else setup();
})();
