/* ------------------------------------------------------------------
   Révélation au scroll — globale à tout le portfolio.
   Chaque bloc apparaît en fondu, en glissant légèrement depuis le bas.
   (Même grammaire que le bloc .spiral des Réciprocités : la classe .rv.)

   Principes :
   - SÛR : l'état caché (.js-rv .rv en CSS) n'est actif que si CE script tourne.
     Sans JS, ou si le script échoue, rien n'est masqué : aucun bloc ne disparaît.
   - SANS FLASH : ce script est chargé en <head> (bloquant). Il pose js-rv +
     js-rv-hold AVANT le premier rendu ; le conteneur est masqué le temps de
     marquer les blocs, puis relâché. On ne voit jamais le contenu « nu » puis caché.
   - RESPECTUEUX : désactivé si prefers-reduced-motion, et sur parcours-interactif
     (qui a son propre système d'écrans).
   - NON INVASIF : ne touche jamais un élément qui contient un sommaire sticky
     (.toc) — un transform casserait le position:sticky. Idem pour [data-no-rv].
------------------------------------------------------------------ */
(function () {
  "use strict";

  var d = document;
  var D = d.documentElement;

  // Pages / préférences où l'on n'anime rien du tout.
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  if (/parcours-interactif/.test(location.pathname)) return;
  if (!("IntersectionObserver" in window)) return; // pas d'observer → on ne masque rien

  // Active l'état caché (gaté en CSS par .js-rv) et masque brièvement le conteneur.
  D.classList.add("js-rv");
  D.classList.add("js-rv-hold");

  // Filet de sécurité : quoi qu'il arrive, on relâche le conteneur.
  var released = false;
  function release() {
    if (released) return;
    released = true;
    D.classList.remove("js-rv-hold");
  }
  var failsafe = setTimeout(release, 1200);

  // Conteneurs de contenu et blocs à révéler (sans double-imbrication).
  var SELECTOR = [
    ".wrap > *:not(section)",   // blocs autonomes (préliminaire, erratum, clôture…)
    ".wrap > section > *",      // sous-blocs des sections (héros, bandes, série…)
    ".chapters > .chapter",     // chapitres des études de cas
    ".chapters > .ancrage",     // bloc d'ancrage final des cas
    ".article > *"              // blocs internes des essais / la pratique
  ].join(",");

  function eligible(el) {
    if (el.nodeType !== 1) return false;
    if (el.classList.contains("toc")) return false;      // le sommaire lui-même
    if (el.closest(".toc, [data-no-rv]")) return false;  // dans un sommaire / opt-out
    if (el.querySelector(".toc")) return false;          // ancêtre d'un sommaire sticky
    return true;
  }

  function setup() {
    var found = d.querySelectorAll(SELECTOR);
    var targets = [];
    var i, el;
    for (i = 0; i < found.length; i++) {
      el = found[i];
      if (!eligible(el)) continue;
      el.classList.add("rv");
      targets.push(el);
    }
    // Inclut aussi les .rv déjà présents dans le HTML (spirale, stations…),
    // au cas où leur page n'aurait pas son propre observer.
    var authored = d.querySelectorAll(".rv");
    for (i = 0; i < authored.length; i++) {
      el = authored[i];
      if (targets.indexOf(el) === -1 && !el.closest("[data-no-rv]")) targets.push(el);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

    for (i = 0; i < targets.length; i++) io.observe(targets[i]);

    clearTimeout(failsafe);
    release(); // conteneur visible ; les blocs restent en opacity:0 puis apparaissent
  }

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
