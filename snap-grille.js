/* Règle unique : tout bloc se pose sur la grille de la page. Sa hauteur est un multiple de la ligne (28 px), donc ce qui suit retombe sur une ligne.
   Le texte, lui, est déjà sur la grille (interlignes, marges et paddings sont des multiples d'une ligne : voir styles.css).
   Ce script arrondit à la ligne supérieure tout bloc dont la hauteur dépend d'un contenu qu'on ne maîtrise pas (images, schémas, prototypes, retours à la ligne).
   Sont laissés tels quels : les éléments remplacés (img, svg, canvas, iframe, video), les inlines, les éléments sortis du flux (absolute, fixed) et le décor. */
(function () {
  "use strict";

  // Les pages de la série (01 à 06), Réciprocités et « circulation » n'ont pas de <main> : le script ne les touchait pas du tout.
  // Sans <main>, il prend tout le corps de la page (hors barre et navigation). Les blocs propres à ces pages (définitions, cercles, terrains...)
  // gardent d'anciennes marges en pixels : ce filet les remet sur la ligne, en attendant qu'ils soient refaits un par un.
  var BLOCS = document.querySelector("main") ? "main *, .pied, .pied *" : "body *";
  var SANS = "svg, canvas, picture, .hero-scene, .don-zone, .lvaxis, [data-sans-grille], .bar, nav, script, style";
  var NON_BLOCS = /^(script|style|img|svg|canvas|video|iframe|picture|br|input|select|textarea|source|track|noscript|link|meta|use|path)$/;
  var timer = 0, occupe = false;

  function ligne() {
    var p = document.createElement("div");
    p.style.cssText = "position:absolute;visibility:hidden;width:var(--ligne)";
    document.body.appendChild(p);
    var L = p.offsetWidth || 28;
    document.body.removeChild(p);
    return L;
  }

  function estBloc(e) {
    if (NON_BLOCS.test(e.tagName.toLowerCase())) return false;
    if (e.closest(SANS)) return false;
    var c = getComputedStyle(e);
    if (!/^(block|flex|grid|list-item|flow-root)$/.test(c.display)) return false;
    if (c.position === "absolute" || c.position === "fixed") return false;
    return true;
  }

  function arrondir(el, L) {
    el.style.minHeight = "";
    var h = el.getBoundingClientRect().height;
    if (!h) return;
    var cible = Math.ceil(h / L - 0.005) * L;   // au moindre doute, on arrondit au-dessus
    if (cible - h > 0.5) {
      var c = getComputedStyle(el), reste = 0;
      if (c.boxSizing === "content-box") reste = (parseFloat(c.paddingTop) || 0) + (parseFloat(c.paddingBottom) || 0) + (parseFloat(c.borderTopWidth) || 0) + (parseFloat(c.borderBottomWidth) || 0);
      el.style.minHeight = (cible - reste) + "px";
    }
  }

  // Pages sans <main> (série 01 à 06, Réciprocités, « circulation ») : leurs composants ont des marges et des paddings verticaux en pixels
  // (10, 13, 18, 22, 26, 32, 34, 54 px...). Le filet les ramène aussi à des lignes entières, sinon une hauteur arrondie ne suffit pas :
  // le contenu reste décalé à l'intérieur. Les pages refaites à la main (avec <main>) n'en ont pas besoin et ne sont pas touchées.
  var ANCIEN = !document.querySelector("main");
  var touches = [];
  var PROPS = ["marginTop", "marginBottom", "paddingTop", "paddingBottom"];

  function ligner(el, L) {
    var c = getComputedStyle(el);
    var v = {};
    PROPS.forEach(function (p) { v[p] = parseFloat(c[p]) || 0; });
    var bt = parseFloat(c.borderTopWidth) || 0, bb = parseFloat(c.borderBottomWidth) || 0;
    var cible = {
      marginTop: v.marginTop < L / 2 ? 0 : Math.round(v.marginTop / L) * L,
      marginBottom: v.marginBottom < L / 2 ? 0 : Math.round(v.marginBottom / L) * L,
      paddingTop: v.paddingTop < 10 ? 0 : Math.max(L, Math.round(v.paddingTop / L) * L),
      paddingBottom: v.paddingBottom < 10 ? 0 : Math.max(L, Math.round(v.paddingBottom / L) * L)
    };
    // un filet de 1 px en bordure prend de la place : on le retire du padding pour que le contenu parte d'une ligne (la hauteur de la boîte, bordures comprises, est arrondie plus bas)
    if (bt > 0 && cible.paddingTop >= bt) cible.paddingTop -= bt;
    if (bb > 0 && cible.paddingBottom >= bb) cible.paddingBottom -= bb;
    PROPS.forEach(function (p) {
      if (v[p] <= 0 && cible[p] >= 0) return;
      if (Math.abs(cible[p] - v[p]) > 0.5) { el.style[p] = cible[p] + "px"; touches.push([el, p]); }
    });
  }

  // Figures (captures, schémas) : comme dans le livre de Müller-Brockmann, une image occupe un nombre entier de lignes et ses bords haut et bas
  // tombent sur les lignes. On ne l'étire pas et on ne la rogne pas : on retire à sa hauteur l'excédent (moins d'une ligne) et elle se
  // réduit dans la même proportion, centrée. Avant, c'était le cadre qui s'arrondissait vers le haut et laissait du vide sous l'image.
  var FIGURES = ".figure img, .figure svg, figure img, figure svg, .livre-cover";
  function caler(m, L) {
    var h = m.getBoundingClientRect().height;
    if (h < L * 2) return;
    var cible = Math.floor(h / L + 0.005) * L;
    if (h - cible > 0.5) {
      var w0 = m.getBoundingClientRect().width;
      m.style.height = cible + "px"; touches.push([m, "height"]);
      if (m.tagName === "IMG") { m.style.width = "auto"; touches.push([m, "width"]); }   // l'attribut width="800" fixerait la largeur : l'image serait déformée
      // la couverture d'un livre a une largeur de colonnes : réduite, elle rend la différence en marge pour que le texte à côté reste sur sa colonne
      if (m.classList.contains("livre-cover")) {
        var perdu = w0 - m.getBoundingClientRect().width;
        if (perdu > 0.5) { m.style.marginRight = perdu + "px"; touches.push([m, "marginRight"]); }
      }
    }
  }

  // Puces (verbes des étapes, équipe) : leur largeur suit leur texte, donc leur bord gauche et celui de la suivante tombent n'importe où. Chaque puce
  // s'élargit jusqu'au multiple de 14 px (une demi-ligne, la demi-gouttière) suivant, comme les colonnes et les cases du reste de la page.
  var PUCES = ".verbs span, .equipe-liste li";
  function largeur(p, L) {
    var demi = L / 2, w = p.getBoundingClientRect().width;
    if (!w) return;
    var cible = Math.ceil(w / demi - 0.005) * demi;
    if (cible - w > 0.5) {
      var c = getComputedStyle(p), reste = 0;
      if (c.boxSizing === "content-box") reste = (parseFloat(c.paddingLeft) || 0) + (parseFloat(c.paddingRight) || 0) + (parseFloat(c.borderLeftWidth) || 0) + (parseFloat(c.borderRightWidth) || 0);
      p.style.minWidth = (cible - reste) + "px"; touches.push([p, "minWidth"]);
    }
  }

  function appliquer() {
    timer = 0; occupe = true;
    var L = ligne();
    touches.forEach(function (t) { t[0].style[t[1]] = ""; }); touches = [];   // on repart du CSS : une fenêtre redimensionnée change les valeurs
    [].slice.call(document.querySelectorAll(PUCES)).forEach(function (p) { largeur(p, L); });
    [].slice.call(document.querySelectorAll(FIGURES)).forEach(function (m) { if (!m.closest(".bar, nav, .logos")) caler(m, L); });
    // du plus profond au moins profond : les blocs imbriqués d'abord, puis ceux qui les contiennent
    var tous = [].slice.call(document.querySelectorAll(BLOCS)).filter(estBloc);
    // on retire d'abord TOUS les minHeight de la passe précédente : un bloc étiré par son parent (grille, flex) mesurait sinon la hauteur déjà arrondie
    // de ce parent et grandissait d'une ligne à chaque passe (l'axe « Facile / Complexe » de Réciprocités étirait la page à l'infini)
    tous.forEach(function (e) { e.style.minHeight = ""; });
    tous.sort(function (a, b) { return depth(b) - depth(a); });
    if (ANCIEN) tous.forEach(function (e) { ligner(e, L); });
    tous.forEach(function (e) { arrondir(e, L); });
    occupe = false;
  }

  function depth(e) { var d = 0; while (e && (e = e.parentNode)) d++; return d; }
  function planifier() { if (occupe) return; clearTimeout(timer); timer = setTimeout(appliquer, 60); }

  window.addEventListener("load", planifier);
  window.addEventListener("resize", planifier);
  document.addEventListener("load", planifier, true);   // chaque image qui finit de charger
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(planifier);
  if ("ResizeObserver" in window) new ResizeObserver(planifier).observe(document.body);
  setTimeout(planifier, 1200); setTimeout(planifier, 3500);
  planifier();
})();
