/* Page « Études de cas » : un cas à la fois, toujours au milieu de l'écran, le titre fixé à droite.
   - Chaque carte se verrouille exactement au centre de la zone sous la barre (--haut, calculé pour la hauteur de la fenêtre et celle de la carte).
     La page commence directement sur le premier cas, déjà verrouillé : plus de héros au-dessus.
   - L'écart entre deux cartes est calculé pour que la suivante reste hors de l'écran tant que la précédente est verrouillée : on ne voit jamais deux cas à la fois, sauf pendant la transition.
   - Quand la suivante arrive, elle remonte les précédentes d'un onglet chacune (--monte) et se pose au centre ; la carte recouverte s'éteint (--couvert) et ne laisse voir que son onglet.
   - Le titre et son sous-titre sont fixés à droite des cartes, à la hauteur de la carte active (--haut-texte) : les cas sont ce qu'il y a de plus important sur la page.
   - Un petit aimant : quand on s'arrête près du verrouillage d'un cas, la page se cale dessus. Il ne retient que de près : on ne se perd pas, on n'est jamais bloqué.
   - Un clic sur l'onglet d'une carte recouverte la ramène à l'écran, centrée.
   Le CSS fait le reste (voir « LES CARTES SE DÉPOSENT COMME UN JEU DE CARTES » dans styles.css). */
(function () {
  "use strict";
  var cartes = [].slice.call(document.querySelectorAll(".carte"));
  if (cartes.length < 2) return;
  var conteneur = cartes[0].parentElement;
  var racine = document.documentElement;
  var reduit = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;   // sans animation : le retour à la carte se fait sans défilement animé
  var tactile = window.matchMedia && matchMedia("(hover: none)").matches;   // pas de survol : c'est la carte du devant qui joue son animation (is-active), à la place du survol
  window.__pileCas = function () { return !normal(); };                     // dit à cartes-3d.js si la pile s'occupe de l'animation des cartes sur tactile (non : home sous 1028 px, les cartes défilent normalement et jouent d'elles-mêmes)
  var tagsCas = [].slice.call(document.querySelectorAll(".cas-tags[data-cas]"));   // les pastilles de chaque cas (home) : seules celles du cas du devant sont visibles
  var FREIN = 168;
  var racineTags = tagsCas.length ? tagsCas[0].parentElement : null;
  // Sur la home, sous 1028 px, la pile ne s'empile plus : les cartes défilent normalement, sans aimant, et chaque liste de pastilles passe sous sa carte.
  function normal() { return !!conteneur.closest(".section-cas") && window.innerWidth < 1028; }
  // Les pastilles de chaque cas sont DANS leur carte. Mobile (carte verticale) : dans le bloc du texte, juste en dessous, un seul bloc. Bureau (carte à plat) : à côté du
  // texte, la grille les place en bas de la case de gauche. Voir « Home, bureau » dans styles.css.
  function placerTags() {
    if (!racineTags) return;
    var bas = normal();
    tagsCas.forEach(function (ul, i) {
      var q = cartes[i].querySelector(".carte-face .q");
      if (!q) return;
      if (bas) { if (ul.parentElement !== q) q.appendChild(ul); }
      else if (ul.parentElement === q || ul.previousElementSibling !== q) q.insertAdjacentElement("afterend", ul);
    });
  }   // trois mailles de défilement de plus entre deux cas
  var BARRE = 56, NB_ONGLETS = 3, LARGE = 1028;   // la barre du haut (une maille) ; au plus trois onglets au-dessus de la carte du devant ; en dessous de 1028 px le titre reste au-dessus des cartes
  var DEPASSE = BARRE / 4, NB_DEPASSE = 1;    // home : de combien une carte recouverte dépasse (14 px : un liseré, avec l'arrondi de la carte) et combien de bandes on voit derrière la carte du devant

  function ligne() { return 1.75 * parseFloat(getComputedStyle(racine).fontSize); }
  var nbOnglets = NB_ONGLETS;
  var hauts = [], verrous = [];       // où chaque carte se verrouille (px depuis le haut de la fenêtre) ; la position de défilement qui y amène

  // où se verrouille chaque carte : au milieu de la zone sous la barre ; l'écart entre cartes qui garde la suivante hors écran ; le titre à droite
  function mesurer() {
    placerTags();
    if (normal()) {   // défilement normal : rien à verrouiller
      conteneur.style.removeProperty("--ecart-px");
      cartes.forEach(function (c) { c.style.removeProperty("--haut"); });
      verrous = [];
      return;
    }
    var vh = window.innerHeight, L = ligne(), hmax = 0, large = window.innerWidth >= LARGE;
    cartes.forEach(function (c) { hmax = Math.max(hmax, c.offsetHeight); });
    // même hauteur de verrouillage pour toutes les cartes (celle de la plus haute) : les onglets empilés font tous la même épaisseur, quelle que soit la hauteur de leur carte
    // sur mobile les cartes sont presque aussi hautes que l'écran : un seul onglet dépasse au-dessus de la carte du devant (celui de la précédente), au lieu de trois
    // la hauteur d'un onglet est mesurée (56 px sur la page Études de cas, 84 px sur la home : deux lignes et une marge) : chaque carte recouverte remonte d'un onglet entier (--onglet,
    // lu par le CSS), et le nombre d'onglets visibles est ajusté pour que la place prise au-dessus de la carte du devant reste celle de trois onglets de 56 px (168 px)
    var meta = cartes[0].querySelector(".meta"), onglet = (meta && meta.offsetHeight) || BARRE;
    // Home : plus d'empilement d'onglets. La carte précédente ne dépasse au-dessus de la carte du devant que de DEPASSE (un quart de carré de la grille, 14 px) : on sait qu'elle
    // est là, derrière, et la bande reste cliquable. Les cartes plus anciennes sont cachées derrière elle. Un seul réglage : DEPASSE (px) et NB_DEPASSE (combien de bandes).
    var home = !!conteneur.closest(".section-cas");
    if (home) onglet = DEPASSE;
    conteneur.style.setProperty("--onglet", onglet + "px");
    nbOnglets = large ? (home ? NB_DEPASSE : Math.max(1, Math.round(NB_ONGLETS * BARRE / onglet))) : 1;
    var lock = BARRE + Math.max(nbOnglets * onglet, (vh - BARRE - hmax) / 2);   // toujours assez bas pour que les onglets empilés restent sous la barre
    hauts = cartes.map(function () { return lock; });
    // le frein : en plus de l'écart qui cache la suivante, FREIN de défilement pendant lequel le cas reste en place avant que le suivant ne commence à arriver
    var ecart = Math.max(5 * L, vh - lock - hmax + 2 * L) + FREIN;
    conteneur.style.setProperty("--ecart-px", ecart + "px");
    cartes.forEach(function (c, i) { c.style.setProperty("--haut", hauts[i] + "px"); });

    // le début de la page : la première carte démarre verrouillée au milieu (sans héros au-dessus)
    if (large && conteneur.closest(".corps-cartes")) {   // seulement sur la page Études de cas (sur la home, les cartes suivent les sections qui les précèdent)
      var marge = parseFloat(getComputedStyle(conteneur).marginTop) || 0;
      var base = conteneur.getBoundingClientRect().top + window.pageYOffset - marge;
      conteneur.style.setProperty("--debut-px", Math.max(0, hauts[0] - base) + "px");
    } else conteneur.style.removeProperty("--debut-px");

    // le titre : à droite des cartes, deux mailles (112 px) après la carte, jusqu'au bord droit de la page
    var cr = cartes[0].getBoundingClientRect(), page = (cartes[0].closest(".wrap") || conteneur).getBoundingClientRect();
    var x = cr.right + 2 * (2 * L), l = Math.max(240, page.right - x);
    racine.style.setProperty("--texte-x", x + "px");
    racine.style.setProperty("--texte-l", l + "px");

    // les positions de défilement qui verrouillent chaque carte (pour l'aimant et le retour au clic)
    var ecartPx = parseFloat(getComputedStyle(conteneur).rowGap) || 0, y = conteneur.getBoundingClientRect().top + window.pageYOffset;
    verrous = cartes.map(function (c, i) { var v = y - hauts[i]; y += c.offsetHeight + ecartPx; return Math.max(0, v); });
  }

  var ticking = false, actifPrecedent = -1;
  function maj() {
    ticking = false;
    if (normal()) { cartes.forEach(function (c) { c.style.setProperty("--monte", "0"); c.style.setProperty("--couvert", "0"); }); return; }
    var vh = window.innerHeight, arrivee = [], actif = 0;
    // l'arrivée de la carte k : 0 quand son haut est au bord bas de l'écran, 1 quand elle est verrouillée au centre
    for (var k = 0; k < cartes.length; k++) {
      var t = cartes[k].getBoundingClientRect().top, d = vh - hauts[k];
      arrivee[k] = k === 0 ? 1 : (d > 0 ? Math.min(1, Math.max(0, (vh - t) / d)) : 1);
      if (arrivee[k] >= 0.5) actif = k;
    }
    // une carte est remontée d'un onglet par carte qui l'a recouverte (au plus trois)
    for (var j = 0; j < cartes.length; j++) {
      var monte = 0;
      for (var m = j + 1; m < cartes.length; m++) monte += arrivee[m];
      cartes[j].style.setProperty("--monte", Math.min(nbOnglets, monte).toFixed(3));
      cartes[j].style.setProperty("--couvert", Math.min(1, monte).toFixed(3));
    }
    racine.style.setProperty("--haut-texte", hauts[actif] + "px");   // le titre suit la hauteur de la carte active
    tagsCas.forEach(function (ul) { ul.classList.toggle("is-actif", +ul.getAttribute("data-cas") === actif); });
    // tactile : la carte du devant joue (trait, disque, scène 3D), les autres se remettent au repos ; elles rejouent quand elles reviennent devant
    if (tactile && actif !== actifPrecedent) {
      actifPrecedent = actif;
      cartes.forEach(function (c, i) {
        c.classList.toggle("is-active", i === actif);
        var z = c.querySelector(".is-3d");
        if (z && z.activer) z.activer(i === actif); else if (z) z.__actif = i === actif;
      });
    }
  }
  function demander() { if (!ticking) { ticking = true; requestAnimationFrame(maj); } }
  function tout() { mesurer(); demander(); }

  // L'aimant : quand le défilement s'arrête à moins de RAYON du verrouillage d'un cas, la page se cale dessus. Au-delà, rien : le visiteur reste libre.
  var attente = 0;
  function aimanter() {
    if (reduit || normal()) return;
    var y = window.pageYOffset, rayon = Math.min(260, window.innerHeight * 0.22), meilleur = -1, d0 = 1e9;
    // l'aimant ne tire que vers l'avant : un cas qu'on est en train d'atteindre (il est devant nous, à moins de RAYON). Jamais en arrière : sinon il ramènerait au verrouillage celui qui avance dans le frein, et la page ne bougerait plus.
    verrous.forEach(function (v, i) { var d = v - y; if (d >= 0 && d < d0) { d0 = d; meilleur = i; } });
    if (meilleur >= 0 && d0 > 2 && d0 < rayon) window.scrollTo({ top: verrous[meilleur], behavior: "smooth" });
  }
  function auDefilement() { demander(); clearTimeout(attente); attente = setTimeout(aimanter, 160); }

  // Cliquer sur l'onglet d'une carte RECOUVERTE la ramène à l'écran, centrée ; cliquer sur une carte qui est devant ouvre le projet, comme avant.
  document.addEventListener("click", function (e) {
    var onglet = e.target.closest && e.target.closest(".carte .meta");
    if (!onglet) return;
    var i = cartes.indexOf(onglet.closest(".carte"));
    if (i < 0 || (parseFloat(cartes[i].style.getPropertyValue("--couvert")) || 0) < 0.02) return;
    e.preventDefault(); e.stopImmediatePropagation();
    window.scrollTo({ top: verrous[i], behavior: reduit ? "auto" : "smooth" });
  }, true);

  window.addEventListener("scroll", auDefilement, { passive: true });
  window.addEventListener("resize", tout);
  window.addEventListener("load", tout);
  if ("ResizeObserver" in window) new ResizeObserver(tout).observe(conteneur);
  tout();
})();
