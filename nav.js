/* ------------------------------------------------------------------
   Navigation partagée - SOURCE UNIQUE de la barre de nav, pour toutes les pages.
   Pour modifier la nav partout : éditer le HTML ci-dessous (entre backticks).

   Chaque page ne contient qu'un <script src="nav.js"></script>, posé à
   l'emplacement de la nav : le script s'exécute tout de suite et la pose à sa
   place. Livré par SCRIPT (et non par fetch) : fonctionne en ligne, avec Live
   Server, et en ouvrant le .html en local (file://).

   Il lit aussi le choix du visiteur (mode clair ou sombre, couleur d'accent) AVANT
   l'affichage, pour que la page n'ait pas de clignotement. Le comportement
   (couleur, thème, menu mobile) est dans site-nav.js, chargé en fin de page.
   La page active est déduite de l'adresse (avec ou sans .html).
------------------------------------------------------------------ */
(function () {
  "use strict";

  var D = document.documentElement, KT = "be-theme", KA = "be-accent";
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* La couleur d'accent : une seule teinte (0 à 359, l'angle de la roue des couleurs, espace OKLCH). Pour chaque teinte on prend la couleur la PLUS VIVE que l'écran sait afficher
     tout en gardant le texte lisible en AAA dessus : clair, le texte d'encre dessus fait au moins 7 : 1 (luminance relative de la couleur d'au moins 0,51) ; sombre, le texte
     clair dessus fait au moins 7 : 1 (luminance d'au plus 0,084). Le vert, le jaune et le cyan sortent fluo ; le rouge, le rose et le bleu sont plus clairs, parce qu'un bleu
     vif est trop sombre pour porter du texte sombre, c'est physique. Les couleurs sont posées en hexadécimal sur <html> (--accent, --accent-fond) : le héros (canvas) et les
     scènes 3D les lisent telles quelles. */
  var LUM_MIN_CLAIR = 0.51, LUM_MAX_SOMBRE = 0.084, TEINTE_DEFAUT = 142;
  var ANCIENS = { vert: 142, jaune: 120, magenta: 329, orange: 72, menthe: 166, cyan: 195, citron: 110 };   // les anciens noms gardés par les visiteurs
  function lin(L, C, h) {
    var a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
    var l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3), m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3), s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }
  function dedans(v) { return v[0] >= -0.0005 && v[0] <= 1.0005 && v[1] >= -0.0005 && v[1] <= 1.0005 && v[2] >= -0.0005 && v[2] <= 1.0005; }
  function lum(v) { function c(x) { return Math.max(0, Math.min(1, x)); } return 0.2126 * c(v[0]) + 0.7152 * c(v[1]) + 0.0722 * c(v[2]); }
  function chromaMax(L, h) { var bas = 0, haut = 0.37; for (var i = 0; i < 20; i++) { var mi = (bas + haut) / 2; if (dedans(lin(L, mi, h))) bas = mi; else haut = mi; } return bas; }
  function hex(v) {
    return "#" + v.map(function (x) {
      x = Math.max(0, Math.min(1, x)); x = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
      return ("0" + Math.round(x * 255).toString(16)).slice(-2);
    }).join("").toUpperCase();
  }
  function accentDe(teinte, theme) {
    var sombre = theme === "dark", meilleur = null;
    for (var i = 0; i <= 100; i++) {
      var L = sombre ? 0.20 + i * 0.008 : 0.55 + i * 0.0045, C = chromaMax(L, teinte), v = lin(L, C, teinte), y = lum(v);
      if ((sombre ? y <= LUM_MAX_SOMBRE : y >= LUM_MIN_CLAIR) && (!meilleur || C > meilleur.c)) meilleur = { c: C, v: v };
    }
    return hex(meilleur ? meilleur.v : lin(sombre ? 0.4 : 0.9, 0, teinte));
  }
  function teinteLue(x) {
    if (x === null || x === undefined || x === "") return TEINTE_DEFAUT;
    if (ANCIENS.hasOwnProperty(x)) return ANCIENS[x];
    var n = parseFloat(x);
    return isFinite(n) ? ((Math.round(n) % 360) + 360) % 360 : TEINTE_DEFAUT;
  }
  /* Plus de curseur : une couleur par page. Un cas la pose sur <body data-accent="#RRGGBB">, les autres pages prennent la couleur du site.
     Cette couleur est celle du mode clair ; le mode sombre en calcule le pendant (même teinte, assez sombre pour le texte clair en AAA). */
  var COULEUR_SITE = "#CFBEFF";
  function accentFixe() { var c = document.body && document.body.getAttribute("data-accent"); return /^#[0-9a-fA-F]{6}$/.test(c || "") ? c : COULEUR_SITE; }
  function teinteDe(hexa) {   // la teinte (0 à 359, espace OKLCH) d'une couleur #RRGGBB
    function c(x) { x = x / 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }
    var r = c(parseInt(hexa.slice(1, 3), 16)), g = c(parseInt(hexa.slice(3, 5), 16)), b = c(parseInt(hexa.slice(5, 7), 16));
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), n = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * n, k = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * n;
    return ((Math.atan2(k, a) * 180 / Math.PI) % 360 + 360) % 360;
  }
  function poserAccent(teinte, theme) {
    var clair = accentFixe();
    var c = theme === "dark" ? accentDe(teinteDe(clair), "dark") : clair;   // en sombre : le pendant foncé de la même teinte, texte clair dessus en AAA
    D.style.setProperty("--accent", c); D.style.setProperty("--accent-fond", c);
    return c;
  }
  window.accentDe = accentDe; window.poserAccent = poserAccent; window.teinteLue = teinteLue;

  var q = new URLSearchParams(location.search);
  var theme = q.get("theme") || lire(KT) || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  var teinte = teinteLue(q.get("accent") || q.get("teinte") || lire(KA));
  D.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  poserAccent(teinte, theme);

  var HTML = `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="bar" id="top">
  <div class="bar-in">
    <a class="brand" href="/"><span class="logo" role="img" aria-label="Brann Etienne"></span><span class="brand-texte">Brann Etienne</span></a>
    <div class="bar-droite">
      <nav class="nav" id="menu-nav" aria-label="Navigation principale">
        <a href="/etudes-de-cas" data-section="cases">Études de cas</a>
        <a href="/a-propos" data-section="apropos">À propos</a>
        <a href="/contact" data-section="contact">Contact</a>
      </nav>
      <div class="reglages">
        <div class="theme"><button class="theme-btn" type="button" aria-pressed="false" aria-label="Mode sombre"><svg class="lune" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg><svg class="soleil" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button></div>
        <button class="nav-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu-nav"><span class="nav-bars" aria-hidden="true"></span></button>
      </div>
    </div>
  </div>
</header>`;

  /* page courante -> entrée active (celles qui n'y figurent pas n'en ont aucune) */
  function sectionActive() {
    var page = location.pathname.replace(/\/+$/, "").split("/").pop().replace(/\.html$/, "");
    if (page === "etudes-de-cas" || page.indexOf("cas-") === 0) return "cases";
    if (page === "a-propos") return "apropos";
    if (page === "contact") return "contact";
    return "";
  }

  var tpl = document.createElement("template");
  tpl.innerHTML = HTML;
  var frag = tpl.content;

  var actif = sectionActive();
  if (actif) {
    var lien = frag.querySelector('[data-section="' + actif + '"]');
    if (lien) lien.setAttribute("aria-current", "page");
  }

  var s = document.currentScript;
  if (s && s.parentNode) {
    s.parentNode.insertBefore(frag, s);
    s.parentNode.removeChild(s);
  } else {
    document.body.insertBefore(frag, document.body.firstChild);
  }
})();
