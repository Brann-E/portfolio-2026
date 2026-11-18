/* Comportement de la barre de navigation (le HTML vient de nav.js, le choix du visiteur est déjà posé sur <html>) :
   - la couleur d'accent : un curseur de teinte (0 à 359) sous le bouton, que l'on fait glisser de haut en bas ;
   - le mode clair ou sombre ;
   - le menu en hamburger sous 1100 px.
   Le choix du visiteur est gardé (clés be-theme et be-accent) ; chaque changement prévient les pages qui dessinent
   avec ces couleurs (le héros, les blobs) par l'événement « grille:refresh ». */
(function () {
  "use strict";

  var D = document.documentElement, KT = "be-theme", KA = "be-accent";   // KA garde la teinte (un nombre) ; les anciens noms sont lus par nav.js

  var T = window.navTextes || { sombre: "Mode sombre", clair: "Mode clair", ouvrir: "Ouvrir le menu", fermer: "Fermer le menu" };   // les libellés dans la langue de la page (voir nav.js)
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
  function prevenir() { window.dispatchEvent(new Event("grille:refresh")); }

  // En local (localhost, fichier ouvert), les adresses propres du site (« /contact ») n'existent pas : on pointe vers les fichiers.
  // En ligne, rien ne change.
  function liensLocaux() {
    var local = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (!local) return;
    var prefixe = /\/en\/[^\/]*$/.test(location.pathname) ? "../" : "";   // une page de /en/ remonte d'un cran pour retrouver les pages du site
    document.querySelectorAll('a[href^="/"]').forEach(function (a) {
      var m = /^\/([^#?]*)([#?].*)?$/.exec(a.getAttribute("href"));
      if (!m || /^\/\//.test(a.getAttribute("href"))) return;
      var nom = m[1].replace(/\/+$/, "");
      var cible = nom === "en" ? "en/index.html" : (nom ? nom + (/\.[a-z0-9]+$/i.test(nom) ? "" : ".html") : "index.html");
      a.setAttribute("href", prefixe + cible + (m[2] || ""));
    });
  }

  function init() {
    liensLocaux();
    window.addEventListener("load", liensLocaux);
    var barre = document.querySelector(".bar");
    if (!barre) return;

    // la cible du lien « Aller au contenu » : le contenu de la page
    var corps = document.querySelector("main, .wrap");
    if (corps && !corps.id) corps.id = "contenu";

    // ----- couleur d'accent -----
    var cBtn = barre.querySelector(".couleur-btn"), curseur = barre.querySelector(".teinte");
    function fermerListe() { if (cBtn) cBtn.setAttribute("aria-expanded", "false"); }
    function theme() { return D.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
    // la barre du curseur montre les vraies couleurs, de 0 à 359, pour le thème en cours (clair ou sombre)
    function peindreBarre() {
      if (!curseur || !window.accentDe) return;
      var arrets = [];
      for (var h = 0; h <= 360; h += 20) arrets.push(window.accentDe(h % 360, theme()) + " " + (h / 360 * 100).toFixed(1) + "%");
      curseur.style.setProperty("--barre", "linear-gradient(to right, " + arrets.join(", ") + ")");
    }
    if (curseur && window.poserAccent) {
      curseur.value = String(window.teinteLue(D.style.getPropertyValue("--teinte")));
      peindreBarre();
      // en glissant, la couleur change tout de suite sur la page ; à la fin du geste, les pages qui dessinent (héros, scènes 3D) la relisent
      curseur.addEventListener("input", function () { window.poserAccent(+curseur.value, theme()); });
      curseur.addEventListener("change", function () { ecrire(KA, curseur.value); prevenir(); });
    }
    if (cBtn) {
      cBtn.addEventListener("click", function (e) { e.stopPropagation(); cBtn.setAttribute("aria-expanded", String(cBtn.getAttribute("aria-expanded") !== "true")); });
      document.addEventListener("click", function (e) { if (!e.target.closest(".couleur")) fermerListe(); });
    }

    // ----- mode clair ou sombre -----
    var tBtn = barre.querySelector(".theme-btn");
    function montrerTheme(nom) {
      if (!tBtn) return;
      tBtn.setAttribute("aria-pressed", String(nom === "dark"));
      tBtn.setAttribute("aria-label", nom === "dark" ? T.clair : T.sombre);
    }
    montrerTheme(D.getAttribute("data-theme"));
    if (tBtn) tBtn.addEventListener("click", function () {
      var nom = D.getAttribute("data-theme") === "dark" ? "light" : "dark";
      D.setAttribute("data-theme", nom); montrerTheme(nom); ecrire(KT, nom);
      if (window.poserAccent) { window.poserAccent(window.teinteLue(D.style.getPropertyValue("--teinte")), nom); peindreBarre(); }   // la même teinte, à la clarté du thème
      prevenir();
    });

    // ----- menu (mobile) -----
    var tog = barre.querySelector(".nav-toggle"), nav = barre.querySelector(".nav");
    function ouvrir(oui) {
      barre.classList.toggle("nav-open", oui);
      document.body.classList.toggle("nav-locked", oui);
      tog.setAttribute("aria-expanded", String(oui));
      tog.setAttribute("aria-label", oui ? T.fermer : T.ouvrir);
    }
    if (tog && nav) {
      tog.addEventListener("click", function (e) { e.stopPropagation(); ouvrir(!barre.classList.contains("nav-open")); });
      nav.addEventListener("click", function (e) { if (e.target.closest("a")) ouvrir(false); });
      document.addEventListener("click", function (e) { if (barre.classList.contains("nav-open") && !barre.contains(e.target)) ouvrir(false); });
      window.addEventListener("resize", function () { if (window.innerWidth > 1100) ouvrir(false); });
    }

    // ----- clavier -----
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      fermerListe();
      if (tog && barre.classList.contains("nav-open")) { ouvrir(false); tog.focus(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
