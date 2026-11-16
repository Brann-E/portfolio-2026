/* Accueil : le carrousel des situations, avec la mécanique de l'original.
   Les diapositives sont superposées (la plus haute fixe la hauteur) ; le passage masqué de « Dans l'angle mort » est un bouton :
   on le lève sur place, et chaque situation garde son état. Glisser du doigt change de situation. */
(function () {
  "use strict";

  var root = document.getElementById("situations");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
  var dots = Array.prototype.slice.call(root.querySelectorAll(".points button"));
  var masques = Array.prototype.slice.call(root.querySelectorAll(".sit-masque"));
  var num = root.querySelector("[data-num]");
  var pistes = root.querySelector(".sit-pistes");
  var cur = 0;

  function refresh() { window.dispatchEvent(new Event("grille:refresh")); }

  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) {
      s.classList.toggle("is-active", k === cur);
      s.setAttribute("aria-hidden", String(k !== cur));
      s.querySelectorAll("button").forEach(function (b) { b.tabIndex = k === cur ? 0 : -1; });
    });
    dots.forEach(function (d, k) { d.setAttribute("aria-current", String(k === cur)); });
    if (num) num.textContent = (cur + 1) + " / " + slides.length;
    refresh();
    setTimeout(refresh, 280);   // une fois la diapositive en place
  }

  masques.forEach(function (m) {
    m.addEventListener("click", function () {
      var s = m.closest(".slide"), on = !s.classList.contains("is-revealed");
      s.classList.toggle("is-revealed", on);
      m.setAttribute("aria-expanded", String(on));
      refresh();
    });
  });
  root.querySelector("[data-prev]").addEventListener("click", function () { show(cur - 1); });
  root.querySelector("[data-next]").addEventListener("click", function () { show(cur + 1); });
  dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); }); });

  // glisser du doigt
  var x0 = null, y0 = 0;
  pistes.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") { x0 = e.clientX; y0 = e.clientY; } });
  pistes.addEventListener("pointerup", function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0, dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
  });
  pistes.addEventListener("pointercancel", function () { x0 = null; });

  show(0);
})();

/* Logos des clients : toutes les 5 secondes, une case au hasard s'allume avec le remplissage de l'accent (comme un bouton au survol), puis s'éteint.
   Jamais deux fois de suite la même case. Rien ne bouge hors écran, onglet masqué, ou avec prefers-reduced-motion. */
(function () {
  "use strict";
  var boite = document.querySelector(".logos");
  if (!boite) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var cases = Array.prototype.slice.call(boite.children).filter(function (c) { return c.querySelector("img"); });
  if (cases.length < 2) return;
  var visible = true, derniere = -1, eteindre = 0;

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.2 }).observe(boite);
  }

  function allumer() {
    if (!visible || document.hidden) return;
    var i;
    do { i = Math.floor(Math.random() * cases.length); } while (i === derniere);
    derniere = i;
    cases.forEach(function (c) { c.classList.remove("allume"); });
    cases[i].classList.add("allume");
    clearTimeout(eteindre);
    eteindre = setTimeout(function () { cases[i].classList.remove("allume"); }, 2600);
  }

  setInterval(allumer, 5000);
})();

/* Accueil : le bandeau de logos. Il défile tout seul, lentement ; la main le reprend (molette, doigt, glisser à la souris)
   et il repart quelques secondes après. Les logos sont doublés pour que la boucle ne se voie pas. Sans mouvement réduit, il reste déplaçable à la main. */
(function () {
  "use strict";

  var bande = document.querySelector(".defile");
  var piste = bande && bande.querySelector(".defile-piste");
  if (!piste) return;

  Array.prototype.slice.call(piste.children).forEach(function (logo) {
    var copie = logo.cloneNode(true);
    copie.setAttribute("aria-hidden", "true");
    copie.querySelector("img").alt = "";
    piste.appendChild(copie);
  });

  var reduit = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var VITESSE = 0.035;      // pixels par milliseconde
  var ATTENTE = 3000;       // le défilement repart trois secondes après la dernière action
  var pos = 0, dernier = 0, reprise = 0, survol = false, glisse = null;

  function moitie() { return piste.scrollWidth / 2; }
  function main() { reprise = performance.now() + ATTENTE; }

  bande.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") survol = true; });
  bande.addEventListener("pointerleave", function () { survol = false; });
  bande.addEventListener("wheel", main, { passive: true });
  bande.addEventListener("touchstart", main, { passive: true });
  bande.addEventListener("keydown", main);
  bande.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    glisse = { x: e.clientX, depart: bande.scrollLeft };
    bande.classList.add("is-drag"); main();
  });
  window.addEventListener("pointermove", function (e) {
    if (!glisse) return;
    bande.scrollLeft = glisse.depart - (e.clientX - glisse.x); main();
  });
  window.addEventListener("pointerup", function () { glisse = null; bande.classList.remove("is-drag"); });

  function image(t) {
    var dt = dernier ? Math.min(t - dernier, 100) : 0; dernier = t;
    var m = moitie();
    if (survol || glisse || t < reprise || reduit) {
      pos = bande.scrollLeft;                       // la main a la priorité : on repart d'où elle s'est arrêtée
    } else {
      pos += dt * VITESSE;
      if (pos >= m) pos -= m;
      bande.scrollLeft = pos;
    }
    if (bande.scrollLeft >= m) { bande.scrollLeft -= m; pos = bande.scrollLeft; }   // la main est allée au bout : on boucle
    else if (bande.scrollLeft <= 0 && (glisse || t < reprise)) { bande.scrollLeft += m; pos = bande.scrollLeft; }   // ou revient au début
    requestAnimationFrame(image);
  }
  requestAnimationFrame(image);
})();

/* Le portrait vit : les trois pastilles flottent au repos, et tout (portrait compris) rebondit quand on défile.
   Chaque élément est un ressort à ses propres réglages (raideur, amortissement, coup reçu, sens) : ils ne bougent jamais ensemble.
   Le mouvement passe par la propriété `translate`, qui s'ajoute au `transform: rotate()` des pastilles sans le remplacer. */
(function () {
  "use strict";

  var fig = document.querySelector(".portrait-hero");
  if (!fig || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;

  // RÉGLAGES (px et secondes) : amp = flottement au repos ; coup = élan reçu par pixel défilé ; raideur et frein = le ressort
  var ELEMENTS = [
    { el: fig.querySelector("img"),                amp: 0,   periode: 1,   phase: 0,   coup: 0.05,  raideur: 90, frein: 11 },
    { el: fig.querySelector(".portrait-dispo"),    amp: 0,   periode: 1,   phase: 0,   coup: 0.05,  raideur: 90, frein: 11 },   // « Disponible » : les mêmes réglages que le portrait, il le suit exactement
    { el: fig.querySelector(".portrait-bulle"),    amp: 3.5, periode: 5.2, phase: 0.0, coup: -0.13, raideur: 60, frein: 6 },
    { el: fig.querySelector(".portrait-lyon"),     amp: 3,   periode: 4.1, phase: 2.1, coup: 0.17,  raideur: 75, frein: 7 },
    { el: fig.querySelector(".portrait-distance"), amp: 4,   periode: 6.6, phase: 4.2, coup: -0.09, raideur: 50, frein: 5 }
  ].filter(function (e) { return e.el; });
  var LIMITE = 12;   // décalage maximal dû au scroll, en px

  var etat = ELEMENTS.map(function () { return { d: 0, v: 0 }; });
  var visible = true, raf = 0, dernier = 0, scrollPrec = window.pageYOffset;

  window.addEventListener("scroll", function () {
    var y = window.pageYOffset, dy = y - scrollPrec; scrollPrec = y;
    ELEMENTS.forEach(function (e, i) { etat[i].v += dy * e.coup * 8; });
    demarrer();
  }, { passive: true });

  function image(t) {
    raf = 0;
    if (!visible || document.hidden) { dernier = 0; return; }
    var dt = dernier ? Math.min((t - dernier) / 1000, 0.05) : 0.016; dernier = t;
    ELEMENTS.forEach(function (e, i) {
      var s = etat[i];
      s.v += (-e.raideur * s.d - e.frein * s.v) * dt;     // le ressort
      s.d += s.v * dt;
      s.d = Math.max(-LIMITE, Math.min(LIMITE, s.d));
      var flotte = e.amp * Math.sin((t / 1000) * 6.2832 / e.periode + e.phase);
      e.el.style.translate = "0 " + (s.d + flotte).toFixed(2) + "px";
    });
    raf = requestAnimationFrame(image);
  }
  function demarrer() { if (!raf && visible && !document.hidden) { dernier = 0; raf = requestAnimationFrame(image); } }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) demarrer(); }).observe(fig);
  }
  document.addEventListener("visibilitychange", demarrer);
  demarrer();
})();

/* Le bloc des situations est collant, au milieu de l'écran (voir « Le bloc des situations » dans styles.css). On mesure ici le bloc (.page de la section) :
   --sit-bloc sa hauteur, --sit-zone sa hauteur plus le vide en haut et en bas de la section, --sit-haut où il se colle. data-colle est posé à partir de 1028 px,
   comme la pile des cas. */
(function () {
  "use strict";
  var car = document.getElementById("situations");
  var page = car && car.closest(".page");
  var section = page && page.closest(".section");
  if (!section) return;
  function mesurer() {
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize), barre = 3.5 * rem;   // la barre du haut : une maille
    var cs = getComputedStyle(section), h = page.offsetHeight;
    section.style.setProperty("--sit-bloc", h + "px");
    section.style.setProperty("--sit-zone", (h + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)) + "px");
    // le haut du collage : le bloc au milieu de la zone sous la barre ; s'il est plus haut que cette zone, c'est son bas qui se cale sur le bas de la fenêtre
    // (le titre passe alors sous la barre, mais le carrousel, les commandes et le lien restent entiers à l'écran)
    var vh = window.innerHeight;
    section.style.setProperty("--sit-haut", (h + barre <= vh ? (vh + barre - h) / 2 : vh - h) + "px");
    if (window.innerWidth >= 1028) section.setAttribute("data-colle", "");
    else section.removeAttribute("data-colle");
  }
  if ("ResizeObserver" in window) new ResizeObserver(mesurer).observe(page);
  window.addEventListener("resize", mesurer);
  mesurer();
})();
