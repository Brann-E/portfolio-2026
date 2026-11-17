/* Hero vivant (l'en-tête, le thème et la couleur d'accent sont dans nav.js et site-nav.js ; ici, seulement le héros).
   Une grille rigide, des disques posés sur ses noeuds, uniquement à droite du texte.
   Règle : rien ne tient tout seul.
   - Un disque isolé finit par s'éteindre. Un disque relié tient.
   - Un disque bourgeonne depuis un voisin vers un noeud libre : il en sort, puis s'en détache.
   - Un disque qui n'a plus de noeud libre autour de lui, ou qui est très ancien, se retire.
   Le temps est organique : un seul changement à la fois, à intervalles irréguliers,
   chaque disque ayant sa propre durée de pousse et de retrait. Pas de pas synchronisé.
   Le visiteur pose un disque (clic, doigt, survol à la souris) : près d'un amas il s'y fond, loin il s'éteint seul. */
(function () {
  "use strict";

  var hero = document.querySelector("[data-vivant]");
  if (!hero) return;
  // data-vivant="page" : le fond couvre toute la page (du haut du <main> au pied de page), pas seulement le héros. Les toiles sont alors collées à l'écran
  // (position: fixed, taille de la fenêtre) et ne dessinent que ce qui est visible ; les disques vivent PARTOUT, y compris sous le texte et sous tous les éléments (règle de Brann, 2026-11-17).
  var pageMode = hero.getAttribute("data-vivant") === "page";
  var region = pageMode ? (hero.closest("main") || document.body) : hero;
  var VW = 0, VH = 0, lastW = 0, lastH = 0, lastVH = 0;

  // les pages qui n'ont pas déjà le filtre de fusion des disques (la home l'écrit dans son HTML) le reçoivent ici
  if (!document.getElementById("fusion")) {
    var defs = document.createElement("div");
    defs.innerHTML = '<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><filter id="fusion" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="flou"/><feColorMatrix in="flou" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"/></filter></svg>';
    document.body.insertBefore(defs.firstChild, document.body.firstChild);
  }

  var cvD = document.getElementById("cv-disques");
  var cvG = document.getElementById("cv-grille");
  var cD = cvD.getContext("2d");
  var cG = cvG.getContext("2d");
  var btnFiger = document.getElementById("figer");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== RÈGLE ABSOLUE (Brann, 2026-11-17) : LES DISQUES VIVENT PARTOUT. =====
  // Sous le texte, sous les cartes, sous le portrait, sous tous les éléments de la page, sur mobile comme sur ordinateur. Il n'existe aucune zone interdite,
  // aucune distance à respecter avec le texte. Le but est que ça soit vivant. Ne JAMAIS ajouter d'exclusion, de marge autour du texte ou de colonne réservée.
  // ===== RÉGLAGES : tout ce qui change la densité et la vie du motif se change ici =====
  var POINTS = 20;           // nombre de disques au départ et au repos (une vingtaine)
  var MAXI = 1.5;            // jamais plus de 1,5 fois ce nombre
  var VIE_MIN = 70000, VIE_MAX = 130000;   // durée de vie d'un disque, en ms (avant : 26 à 52 s)
  var DIAGONALE = 0.3;       // chance de bourgeonner en diagonale : les liens ne suivent plus seulement la grille
  var VISITEUR_MAX = 60;     // disques dessinés par le visiteur, en même temps ; au-delà, le plus ancien s'efface pour laisser la place au nouveau
  var VIE_VISITEUR_MIN = 90000, VIE_VISITEUR_MAX = 150000;   // durée de vie d'un disque dessiné, en ms (1 min 30 à 2 min 30) ; ils ne comptent pas dans la cible et ne sont jamais retirés avant l'heure
  var CHANCE = 0.6;          // chance qu'une intersection croisée par le curseur fasse naître un disque (60 %) ; le clic, lui, pose toujours un disque

  // Départ tranquille (la home seulement) : au lieu de peupler une vingtaine de disques d'un coup, quelques petits amas, trois au plus, loin du texte et du portrait,
  // qui naissent un par un, très doucement, puis évoluent lentement (peu de disques, rythme lent).
  var CALME = document.body.classList.contains("accueil");
  var AMAS = 3;                          // nombre d'amas au départ, au plus
  var AMAS_DISQUES = [3, 5];             // disques par amas, au départ
  var AMAS_DELAI = [4000, 7000];         // délai entre la naissance de deux amas, en ms
  // Départ sur tactile (la home) : personne n'attend dix secondes devant un fond vide. Un petit nombre d'amas naissent à des moments tirés au hasard dans les premières secondes,
  // et vite ; ensuite le rythme calme habituel reprend.
  var AMAS_TACTILE = 5;                  // amas au départ (au plus)
  var HASARD_TACTILE = 0.35;             // sur tactile, au repos : un geste sur trois fait naître un disque ailleurs, au hasard, sans parent (il se reliera ensuite à ce qui l'entoure)
  var AMAS_DISQUES_TACTILE = [1, 3];     // disques par amas
  var DEPART_TACTILE = { premier: 250, fenetre: 3500, naissance: [1000, 1800], bourgeon: [400, 900], fin: 6000, rythme: [400, 900] };   // ms : le premier amas au plus tôt à 0,25 s, tous avant 3,75 s ; un disque naît en 1 à 1,8 s ; un bourgeon part 0,4 à 0,9 s après son parent ; jusqu'à 6 s, tant qu'on est sous la cible, un nouveau disque toutes les 0,4 à 0,9 s, puis le rythme calme reprend
  var POINTS_CALME = 11, MAXI_CALME = 1.25;   // disques au repos et plafond (les amas grossissent à peine)
  // « tactile » = pas de survol, OU mise en page mobile (859 px et moins, comme le CSS) : une fenêtre étroite sur ordinateur a la mise en page du téléphone et doit se comporter comme lui.
  // Relu à chaque mise en page : si la fenêtre franchit les 859 px, le comportement change avec.
  var MQ_TACTILE = window.matchMedia ? matchMedia("(hover: none), (max-width: 859px)") : null;
  var TACTILE = !!(MQ_TACTILE && MQ_TACTILE.matches);
  var DENSITE_TACTILE = 1.3;             // sur tactile, 30 % de disques de plus au repos (14 au lieu de 11 sur la home, 26 au lieu de 20 ailleurs) : ni curseur ni survol, le fond doit se suffire
  var RYTHME_TACTILE = 0.4;             // sur tactile (ni curseur ni survol : le fond doit vivre seul), le délai entre deux gestes est multiplié par 0,4 : un geste 2,5 fois plus souvent
  var LENTEUR = 1.8;                     // une naissance dure 1,8 fois plus longtemps

  var W = 0, H = 0, DPR = 1, S = 56, ox = 0, oy = 0, cols = 0, rows = 0;
  var state, tStart, dur, tEnd, ddur, src, lifeEnd, fx, zone, zoneCount, gsz, szc, vis, lastExp = 0;
  var rects = [];
  var colors = { ink: [45, 47, 50], accent: [0, 255, 0], fond: [0, 255, 0] };
  var paused = false, visible = true, raf = 0, lastFrame = 0, lastMove = 0;
  var vt = 0;               // horloge du motif : n'avance que lorsqu'il tourne
  var nextEvent = 0, emptySince = 0, enDessous = true;
  var gestes = [];          // gestes en cours : { at, run } (la suite d'un geste, quelques secondes plus tard)

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  function parseColor(s) {
    s = (s || "").trim();
    var m = /^#([0-9a-f]{6})$/i.exec(s);
    if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
    m = /rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(s);
    return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
  }

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    colors.ink = parseColor(cs.getPropertyValue("--encre"));
    colors.accent = parseColor(cs.getPropertyValue("--accent"));
    colors.fond = parseColor(cs.getPropertyValue("--accent-fond"));
  }


  function nx(i) { return ox + (i - 1) * S; }
  function ny(j) { return oy + (j - 1) * S; }

  function layout() {
    TACTILE = !!(MQ_TACTILE && MQ_TACTILE.matches);
    var hr = region.getBoundingClientRect();
    W = Math.round(hr.width); H = Math.round(hr.height);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    if (pageMode) {
      VW = window.innerWidth; VH = window.innerHeight; lastW = W; lastH = H; lastVH = VH;
      [cvD, cvG].forEach(function (c) { c.width = Math.round(VW * DPR); c.height = Math.round(VH * DPR); });
      if (cvD.parentNode !== document.body) {
        document.body.insertBefore(cvG, document.body.firstChild); document.body.insertBefore(cvD, document.body.firstChild);
        cvD.classList.add("vivant-fond"); cvG.classList.add("vivant-fond");
      }
    } else {
      [cvD, cvG].forEach(function (c) { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); });
      cD.setTransform(DPR, 0, 0, DPR, 0, 0);
      cG.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    var probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;width:var(--maille)";
    hero.appendChild(probe); S = probe.offsetWidth || 56; hero.removeChild(probe);

    rects = [];
    (pageMode ? region.querySelectorAll("[data-texte], .carte, .cartes-titre") : hero.querySelectorAll("[data-texte]")).forEach(function (el) {
      if (pageMode && getComputedStyle(el.closest(".hero-texte") || el).position === "fixed") return;   // le titre fixé à droite ne réserve aucune place : le vivant couvre toute la page
      var r = el.getBoundingClientRect();
      if (pageMode && el.hasAttribute("data-texte")) { var rg = document.createRange(); rg.selectNodeContents(el); var tr = rg.getBoundingClientRect(); if (tr.width) r = tr; }   // l'étendue du texte, pas la boîte (le titre occupe toute la largeur de la page)
      rects.push({ x0: r.left - hr.left, y0: r.top - hr.top, x1: r.right - hr.left, y1: r.bottom - hr.top });
    });

    // la grille du héros s'amarre sur les lignes de la grille de la page (14 px à gauche du bord de page, multiples de la maille depuis le haut
    // du document), comme les cadres : les points tombent sur des lignes, pas sur le texte
    var page = hero.querySelector(".hero-texte") || hero;
    var pl = page.getBoundingClientRect().left;
    // en mode page, le titre est fixé à droite : le bord gauche de la carte est sur une ligne du quadrillage (14 px à gauche du bord de page)
    var carte0 = pageMode ? region.querySelector(".carte") : null;
    if (carte0) pl = carte0.getBoundingClientRect().left + S / 4;
    ox = ((((pl - S / 4) - hr.left) % S) + S) % S;
    oy = (((-(hr.top + window.pageYOffset)) % S) + S) % S;

    var ancCols = cols;
    cols = Math.ceil((W - ox) / S) + 2; rows = Math.ceil((H - oy) / S) + 2;
    var n = cols * rows;
    gestes.length = 0;
    var anc = (state && !pageMode && cols === ancCols) ? { n: state.length, state: state, tStart: tStart, dur: dur, tEnd: tEnd, ddur: ddur, src: src, lifeEnd: lifeEnd, vis: vis, gsz: gsz, szc: szc } : null;   // la grille garde ses colonnes : on garde les disques
    state = new Uint8Array(n); tStart = new Float64Array(n); dur = new Float32Array(n);
    tEnd = new Float64Array(n); ddur = new Float32Array(n); src = new Int32Array(n).fill(-1);
    lifeEnd = new Float64Array(n); vis = new Uint8Array(n); gsz = new Float32Array(n); szc = new Float32Array(n);

    // LA ZONE DU VIVANT, c'est toute la région, sans exception : les disques vivent PARTOUT, sous le texte, sous les cartes, sous tous les éléments de la page.
    // Aucune colonne réservée, aucune distance au texte, aucune case interdite. (Règle de Brann, 2026-11-17 : « Les blobs peuvent vivre sous tous les éléments de
    // vivant.js. Il peut vivre partout. C'est le but, c'est que ça soit vivant. ») Ne jamais réintroduire d'exclusion : les couleurs s'adaptent au texte, pas l'inverse.
    var z = { x0: 0.3 * S, y0: 0.3 * S, x1: W - 0.3 * S, y1: H - 0.3 * S };
    zone = new Uint8Array(n); zoneCount = 0;
    fx = new Float32Array(n);
    var i, j, k, x, y;
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
      k = j * cols + i; x = nx(i); y = ny(j);
      if (x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1) { zone[k] = 1; zoneCount++; }
      fx[k] = 1;   // aucune case n'est meilleure qu'une autre : plus de préférence pour « loin du texte »
    }
    // Les polices ou une image qui arrivent déplacent un peu le texte et refont la mise en page : sans cela, tout le motif repartait de zéro à ce moment-là,
    // et rien ne se voyait avant (sur téléphone : plusieurs secondes). On garde donc les disques déjà nés ; ceux qui se retrouvent sous le texte s'effacent.
    var gardes = 0;
    if (anc) {
      var m = Math.min(n, anc.n);
      for (k = 0; k < m; k++) {
        if (!anc.state[k]) continue;
        state[k] = anc.state[k]; tStart[k] = anc.tStart[k]; dur[k] = anc.dur[k]; tEnd[k] = anc.tEnd[k]; ddur[k] = anc.ddur[k]; src[k] = anc.src[k];
        lifeEnd[k] = anc.lifeEnd[k]; vis[k] = anc.vis[k]; gsz[k] = anc.gsz[k]; szc[k] = anc.szc[k];
        if (state[k] === 1) {
          gardes++;
          if (!zone[k]) { state[k] = 2; tEnd[k] = vt; ddur[k] = rand(3200, 5800); src[k] = -1; }   // il n'a plus sa place : il s'efface
        }
      }
    }
    if (gardes) scheduleNext(); else startMotif();
  }

  function solid(k) { return state[k] === 1 && vt - tStart[k] > dur[k] * 0.4; }

  function neighborsOf(k) {
    var i = k % cols, j = (k - i) / cols, out = [];
    if (i > 0) out.push(k - 1);
    if (i < cols - 1) out.push(k + 1);
    if (j > 0) out.push(k - cols);
    if (j < rows - 1) out.push(k + cols);
    return out;
  }

  // les 8 cases autour (diagonales comprises) : un disque est relié s'il en touche un, même en diagonale
  function neighbors8(k) {
    var i = k % cols, j = (k - i) / cols, out = [], di, dj, ii, jj;
    for (dj = -1; dj <= 1; dj++) for (di = -1; di <= 1; di++) {
      if (!di && !dj) continue;
      ii = i + di; jj = j + dj;
      if (ii >= 0 && ii < cols && jj >= 0 && jj < rows) out.push(jj * cols + ii);
    }
    return out;
  }

  function nbCount(k) {
    var c = 0, nb = neighbors8(k);
    for (var a = 0; a < nb.length; a++) if (solid(nb[a])) c++;
    return c;
  }

  // Tailles : chaque disque a un gabarit propre (gsz) ; il enfle quand il est bien relié,
  // se tasse quand il est seul ou quand il approche de sa fin. Les gros mettent plus de temps à naître.
  function born(k, parent, d, startAt, extraLife, size) {
    var g = size || 0.58 + 0.42 * Math.pow(Math.random(), 0.8);
    vis[k] = 0; state[k] = 1; tStart[k] = startAt === undefined ? vt : startAt;
    dur[k] = d || rand(2200, 3600) * (0.7 + 0.6 * g) * (CALME ? LENTEUR : 1);
    gsz[k] = g; szc[k] = 0.5 * g;
    src[k] = parent === undefined ? -1 : parent;
    lifeEnd[k] = tStart[k] + rand(VIE_MIN, VIE_MAX) + (extraLife || 0);
  }

  function sizeTarget(k) {
    var conn = Math.min(nbCount(k), 3) / 3, t = gsz[k] * (0.72 + 0.38 * conn);
    var left = lifeEnd[k] - vt;
    if (left < 8000) t *= 0.65 + 0.35 * Math.max(0, left / 8000);
    return t;
  }

  function retire(k) {
    var nb = neighborsOf(k), best = -1, a;
    for (a = 0; a < nb.length; a++) if (solid(nb[a]) && (best < 0 || Math.random() < 0.5)) best = nb[a];
    state[k] = 2; tEnd[k] = vt; ddur[k] = vis[k] ? rand(1800, 3000) : rand(3200, 5800); src[k] = best;
  }

  function seedGroup(y0, y1) {
    // une petite forme de départ, à droite du titre : trois disques qui sortent l'un de l'autre (en mode page : dans la bande de hauteur y0 à y1)
    var best = -1, bd = 1e9, k, i, j, cx, cy, x, y, d;
    var zoneIdx = [];
    for (k = 0; k < zone.length; k++) if (zone[k] && (y0 === undefined || (ny((k - (k % cols)) / cols) >= y0 && ny((k - (k % cols)) / cols) < y1))) zoneIdx.push(k);
    if (!zoneIdx.length) return;
    // un point de départ tiré au hasard dans toute la zone libre (plus de « centre de la zone, un peu à gauche et plus haut que le milieu » : il fallait toujours commencer au même endroit)
    var libresDepart = zoneIdx.filter(function (q) { return state[q] === 0; });
    if (libresDepart.length) best = libresDepart[Math.floor(Math.random() * libresDepart.length)];
    if (best < 0) return;
    born(best, -1, 1800, vt);
    var nb = neighborsOf(best).filter(function (q) { return zone[q] && state[q] === 0; });
    if (nb.length) {
      var second = nb[Math.floor(Math.random() * nb.length)];
      born(second, best, 2600, vt + 700);
      var nb2 = neighborsOf(second).filter(function (q) { return zone[q] && state[q] === 0 && q !== best; });
      if (nb2.length) born(nb2[Math.floor(Math.random() * nb2.length)], second, 3200, vt + 1800);
    }
  }

  // Le départ tranquille : des amas éloignés les uns des autres (au moins 3,5 mailles), sur des cases à l'écart du texte et du portrait ; chaque amas naît d'un disque,
  // les autres en bourgeonnent un à un avec un long retard. Le premier amas apparaît après une seconde et demie, les suivants quelques secondes plus tard.
  function semerAmas(nb) {
    if (TACTILE && nb > 1) nb = AMAS_TACTILE;
    var cand = [], k;
    for (k = 0; k < zone.length; k++) if (zone[k] && fx[k] >= (TACTILE ? 0.5 : 0.7)) cand.push(k);
    if (!cand.length) { seedGroup(); return; }
    var X = function (q) { return nx(q % cols); }, Y = function (q) { return ny((q - (q % cols)) / cols); };
    var centres = [], essais = 0;
    // sur tactile, les trois premiers amas naissent dans ce qu'on voit à l'ouverture de la page (la hauteur de l'écran moins une barre de navigateur), s'il y a la place
    var visibles = (TACTILE && !pageMode) ? cand.filter(function (q) { return Y(q) <= window.innerHeight - 100 - region.getBoundingClientRect().top; }) : [];
    while (centres.length < nb && essais++ < 80) {
      var pool = (visibles.length >= 3 && centres.length < 3) ? visibles : cand;
      var q = pool[Math.floor(Math.random() * pool.length)];
      if (centres.every(function (c) { return Math.hypot(X(q) - X(c), Y(q) - Y(c)) >= (TACTILE ? 2 : 3.5) * S; })) centres.push(q);
    }
    centres.forEach(function (c, n) {
      var DT = DEPART_TACTILE, DQ = TACTILE ? AMAS_DISQUES_TACTILE : AMAS_DISQUES;
      var t0 = TACTILE ? vt + (n === 0 ? 60 : DT.premier + rand(0, DT.fenetre)) : vt + 1500 + n * rand(AMAS_DELAI[0], AMAS_DELAI[1]);   // sur tactile : un tirage au hasard, pas une file
      var taille = Math.round(rand(DQ[0], DQ[1])), membres = [{ k: c, t: t0 }];
      born(c, -1, TACTILE ? (n === 0 ? rand(600, 1000) : rand(DT.naissance[0], DT.naissance[1])) : rand(4500, 6500), t0);   // sur tactile, le premier amas naît tout de suite
      for (var m = 1; m < taille; m++) {
        var par = membres[Math.floor(Math.random() * membres.length)];
        var libresAutour = libres(par.k, Math.random() < DIAGONALE).filter(function (q) { return fx[q] >= 0.4; });
        if (!libresAutour.length) continue;
        var q2 = libresAutour[Math.floor(Math.random() * libresAutour.length)], t = par.t + (TACTILE ? rand(DT.bourgeon[0], DT.bourgeon[1]) : rand(1800, 3200));
        born(q2, par.k, TACTILE ? rand(DT.naissance[0], DT.naissance[1]) : rand(4500, 6500), t);
        membres.push({ k: q2, t: t });
      }
    });
  }

  function scheduleNext() {
    if (TACTILE && CALME && enDessous && vt < DEPART_TACTILE.fin) { nextEvent = vt + rand(DEPART_TACTILE.rythme[0], DEPART_TACTILE.rythme[1]); return; }   // départ rapide sur tactile
    // sous la cible : on remplit vite ; à la cible : un changement de temps en temps (le motif respire, il ne clignote pas)
    // au repos, un geste de temps en temps (toutes les 7 à 13 s sur la home, 4,5 à 8,5 s ailleurs), et le calme entre deux
    var f = (!enDessous && TACTILE) ? RYTHME_TACTILE : 1;   // le rythme plus soutenu ne vaut qu'au repos : le peuplement du départ garde le sien
    if (CALME) nextEvent = vt + (enDessous ? rand(2500, 4500) : rand(7000, 13000) * f);
    else nextEvent = vt + (enDessous ? rand(500, 1300) : rand(4500, 8500) * f);
  }

  function cibleN() {
    var n = pageMode ? Math.round(POINTS * 0.6 * H / Math.max(1, VH)) : (CALME ? POINTS_CALME : POINTS);   // 20 dans le héros (11 sur la home) ; en mode page, 12 par hauteur d'écran
    if (TACTILE) n = Math.round(n * DENSITE_TACTILE);
    return Math.max(8, Math.min(n, Math.floor(zoneCount * 0.3)));
  }

  function event() {
    var list = [], k;
    for (k = 0; k < state.length; k++) if (solid(k) && !vis[k]) list.push(k);   // les disques dessinés par le visiteur ne comptent pas : ni dans la cible, ni parmi ceux qui peuvent disparaître
    var A = list.length, target = cibleN(), maxA = Math.ceil(target * (CALME ? MAXI_CALME : MAXI));

    if (A === 0) {
      var growing = false;
      for (k = 0; k < state.length; k++) if (state[k] === 1) { growing = true; break; }
      if (!growing) { if (!emptySince) emptySince = vt; if (vt - emptySince > 3000) { if (CALME && !pageMode) semerAmas(1); else seedGroup(); emptySince = 0; } }
      return;
    }
    emptySince = 0;
    enDessous = A < target;

    // homéostasie : sous la cible, le motif ne fait que naître ; à la cible, il ne retire un disque (un isolé, ou un ancien) que s'il dépasse un peu,
    // et il naît aussitôt autre chose : le nombre de disques reste stable, la forme change doucement.
    if (A < target) { grow(list); return; }
    if (A >= maxA) { die(list); return; }
    if (A > target * 1.12) { if (Math.random() < 0.6) die(list); else geste(list); return; }
    geste(list);   // au repos, plus d'apparition ni de disparition au hasard : un disque prend l'initiative
  }

  // Une naissance : on part d'un disque (de préférence un disque isolé, pour qu'il se relie), vers une case libre. La case choisie est le plus souvent
  // celle qui touche le plus de disques (les amas se rejoignent) ; de temps en temps une diagonale, pour des liens moins raides.
  function libres(k, diag) {
    var nb = diag ? neighbors8(k) : neighborsOf(k);
    return nb.filter(function (q) { return zone[q] && state[q] === 0; });
  }
  function grow(list) {
    var seuls = list.filter(function (q) { return nbCount(q) === 0; });
    for (var t = 0; t < 14; t++) {
      var k = (seuls.length && Math.random() < 0.75) ? seuls[Math.floor(Math.random() * seuls.length)] : list[Math.floor(Math.random() * list.length)];
      var free = libres(k, Math.random() < DIAGONALE);
      if (!free.length) free = libres(k, true);
      if (!free.length) continue;
      var pick;
      if (Math.random() < 0.6) {
        var best = -1; free.forEach(function (q) { var n = nbCount(q) + Math.random() * 0.9; if (n > best) { best = n; pick = q; } });
      } else pick = free[Math.floor(Math.random() * free.length)];
      born(pick, k, (TACTILE && CALME && vt < DEPART_TACTILE.fin) ? rand(DEPART_TACTILE.naissance[0], DEPART_TACTILE.naissance[1]) : undefined);
      return;
    }
  }

  // Un geste : de temps en temps, un disque prend l'initiative. Le nombre de disques ne bouge presque pas, c'est la forme qui change.
  //  - il tend la main : un bourgeon sort de lui vers la case qui touche un autre disque ; le lien se fait et reste ;
  //  - il déménage : un bourgeon sort de lui vers une case libre, puis lui-même se retire dans ce bourgeon : le disque a changé de case ;
  //  - il hésite : un bourgeon sort sans rien trouver, reste un instant, puis se retire. Jamais un disque bien relié au cœur d'un amas ne déménage.
  function nbCountSans(k, ex) {
    var c = 0, nb = neighbors8(k);
    for (var a = 0; a < nb.length; a++) if (nb[a] !== ex && solid(nb[a])) c++;
    return c;
  }
  function choisir(l) { return l[Math.floor(Math.random() * l.length)]; }
  function semerUn() {
    var cand = [];
    for (var k = 0; k < zone.length; k++) if (zone[k] && state[k] === 0 && fx[k] >= 0.35 && nbCount(k) === 0) cand.push(k);
    if (!cand.length) return false;
    born(choisir(cand), -1, rand(1800, 3200));
    return true;
  }
  function geste(list) {
    if (TACTILE && Math.random() < HASARD_TACTILE && semerUn()) return;   // un disque naît au hasard, sans parent
    var cand = list.filter(function (q) { return !vis[q] && vt - tStart[q] > 6000; });
    if (!cand.length) { grow(list); return; }
    // le geste est tiré d'abord (déménager 45 %, tendre la main 35 %, hésiter 20 %), puis on cherche un disque qui peut le faire ; sinon on essaie le suivant
    var r = Math.random(), type = r < 0.45 ? "demenage" : (r < 0.8 ? "main" : "hesite");
    for (var t = 0; t < 24; t++) {
      var a = choisir(cand);
      if (type === "demenage" && nbCount(a) > 1) continue;            // un disque bien relié ne quitte pas son amas
      var free = libres(a, Math.random() < DIAGONALE);
      if (!free.length) free = libres(a, true);
      if (!free.length) continue;
      var touche = free.filter(function (q) { return nbCountSans(q, a) > 0; });    // les cases qui touchent un autre disque que lui
      var seule = free.filter(function (q) { return nbCountSans(q, a) === 0; });   // les cases où il serait seul avec son bourgeon
      var d = rand(3200, 5000) * (CALME ? LENTEUR : 1), b;
      if (type === "main") {
        if (!touche.length) continue;
        b = choisir(touche); born(b, a, d);                                         // le lien se fait et reste
        return;
      }
      if (type === "hesite") {
        if (!seule.length) continue;
        b = choisir(seule); born(b, a, d);
        (function (a, b) { gestes.push({ at: vt + d + rand(2500, 4500), run: function () { if (state[b] === 1 && !vis[b] && nbCountSans(b, a) === 0) { retire(b); if (state[a] === 1) src[b] = a; } } }); })(a, b);
        return;
      }
      b = (touche.length && Math.random() < 0.6) ? choisir(touche) : choisir(free);  // il déménage, de préférence vers d'autres disques
      born(b, a, d);
      (function (a, b) { gestes.push({ at: vt + d * 0.9, run: function () { if (state[a] === 1 && state[b] === 1) { retire(a); src[a] = b; } } }); })(a, b);
      return;
    }
    grow(list);
  }

  // Une disparition : d'abord ce qui est isolé (il ne tient à rien), puis ce qui est le plus ancien. Jamais un disque bien relié au cœur de l'amas.
  function die(list) {
    var lonely = [], old = [], a, k;
    for (a = 0; a < list.length; a++) {
      k = list[a];
      if (nbCount(k) === 0) lonely.push(k);
      if (vt > lifeEnd[k]) old.push(k);
    }
    var pool = null;
    if (lonely.length && Math.random() < 0.7) pool = lonely;
    else if (old.length) pool = old;
    else if (lonely.length) pool = lonely;
    else pool = list.slice().sort(function (p, q) { return lifeEnd[p] - lifeEnd[q]; }).slice(0, 3);
    if (!pool || !pool.length) return;
    retire(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Au départ, le motif se peuple en quelques secondes : chaque nouveau disque sort d'un disque déjà né (jamais de disque qui apparaît seul),
  // avec un retard qui s'ajoute à celui de son parent. Il y en a assez d'emblée pour que les liens se fassent.
  function peupler() {
    var nodes = [], k;
    for (k = 0; k < state.length; k++) if (state[k] === 1) nodes.push({ k: k, t: tStart[k] });
    if (!nodes.length) return;
    var voulu = cibleN() - 1;
    for (var n = 0; n < voulu * 3 && nodes.length < voulu; n++) {
      var par = nodes[Math.floor(Math.random() * nodes.length)];
      var free = libres(par.k, Math.random() < DIAGONALE);
      if (!free.length) continue;
      var q = free[Math.floor(Math.random() * free.length)], t = par.t + rand(350, 900);
      born(q, par.k, undefined, t);
      nodes.push({ k: q, t: t });
    }
  }

  function startMotif() {
    vt = 0; emptySince = 0;
    if (pageMode) {
      var yh = S * 4;   // une première bande courte, puis une bande par hauteur d'écran
      seedGroup(0, yh);
      for (var b = yh; b < H; b += VH) seedGroup(b, b + VH);
    } else if (CALME) semerAmas(AMAS);
    else seedGroup();
    if (!CALME) peupler();
    scheduleNext();
    if (reduce) {
      for (var n = 0; n < 16; n++) { vt += 9000; event(); }
      vt += 9000;
      for (var q = 0; q < state.length; q++) if (state[q] === 1) szc[q] = sizeTarget(q);
    }
  }

  // Le visiteur ne dessine pas, il sème : chaque case traversée a une chance de faire naître un disque, jamais trop vite,
  // jamais plus de quelques-uns à la fois. Le disque naît lentement, comme un bourgeon de son voisin s'il en a un,
  // avec une taille propre, puis s'efface de lui-même.
  var lastP = null, lastCell = -1, lastBirth = 0;

  function effacerLePlusAncien() {
    var o = -1;
    for (var q = 0; q < state.length; q++) if (vis[q] && state[q] === 1 && (o < 0 || tStart[q] < tStart[o])) o = q;
    if (o >= 0) retire(o);
  }
  function visitorCount() { var n = 0; for (var q = 0; q < state.length; q++) if (vis[q] && state[q] === 1) n++; return n; }

  function place(x, y, force) {
    var i = Math.round((x - ox) / S) + 1, j = Math.round((y - oy) / S) + 1;
    if (i < 0 || j < 0 || i >= cols || j >= rows) return;
    var k = j * cols + i;
    if (!zone[k] || state[k] !== 0) return;
    if (k === lastCell && !force) return;        // une case n'est tentée qu'une fois par passage
    lastCell = k;
    var now = performance.now();
    if (!force) {
      if (now - lastBirth < 35) return;                 // un souffle entre deux naissances
      if (Math.random() > CHANCE) return;                // la chance de naître
      if (visitorCount() >= VISITEUR_MAX) effacerLePlusAncien();                    // jamais plus que quelques-uns : le plus ancien s'efface
    }
    lastBirth = now;
    var nb = neighborsOf(k).filter(function (q) { return solid(q); });
    var parent = nb.length ? nb[Math.floor(Math.random() * nb.length)] : -1;
    born(k, parent, rand(380, 650), vt, 0, rand(0.6, 1));   // le disque du visiteur naît en une demi-seconde : il répond au geste
    szc[k] = gsz[k] * 0.9;
    vis[k] = 1; lifeEnd[k] = vt + rand(VIE_VISITEUR_MIN, VIE_VISITEUR_MAX);
    startLoop();
  }

  function trace(x, y) {
    if (lastP) {
      var dx = x - lastP.x, dy = y - lastP.y, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (S * 0.6)));
      for (var t = 1; t <= n; t++) place(lastP.x + dx * t / n, lastP.y + dy * t / n, false);
    }
    lastP = { x: x, y: y };
  }

  function prog(k) {
    if (state[k] === 1) { var u = clamp((vt - tStart[k]) / dur[k], 0, 1); return vis[k] ? 1 - Math.pow(1 - u, 3) : ease(u); }   // sans départ lent pour les disques du visiteur
    if (state[k] === 2) return 1 - ease((vt - tEnd[k]) / ddur[k]);
    return 0;
  }

  function mixc(a, b, t) {
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," + Math.round(a[1] + (b[1] - a[1]) * t) + "," + Math.round(a[2] + (b[2] - a[2]) * t) + ")";
  }

  function placeOmbre() {}
  function clipOmbre() {}
  var discs = [];

  var pr; // progression par noeud pour le dessin de la grille

  function draw() {
    var i, j, k, x, y, r, p, s, sx, sy, e;
    if (!pr || pr.length !== state.length) pr = new Float32Array(state.length);
    var j0 = 0, j1 = rows, ox0 = 0, oy0 = 0;
    if (pageMode) {
      // la toile est la fenêtre : on décale le repère de la page (haut du <main>) et on ne dessine que les rangées visibles
      var rr = region.getBoundingClientRect(); ox0 = rr.left; oy0 = rr.top;
      cD.setTransform(DPR, 0, 0, DPR, ox0 * DPR, oy0 * DPR); cG.setTransform(DPR, 0, 0, DPR, ox0 * DPR, oy0 * DPR);
      j0 = Math.max(0, Math.floor((-oy0 - oy) / S) - 1); j1 = Math.min(rows, Math.ceil((VH - oy0 - oy) / S) + 3);
      for (k = 0; k < state.length; k++) if (state[k] === 2 && vt - tEnd[k] > ddur[k]) { state[k] = 0; pr[k] = 0; }   // les disques éteints se libèrent partout, vus ou non
      cD.clearRect(-ox0, -oy0, VW, VH);
      cD.save(); cD.beginPath(); cD.rect(0, 0, W, H); cD.clip();
    } else cD.clearRect(0, 0, W, H);
    discs.length = 0;
    for (j = j0; j < j1; j++) for (i = 0; i < cols; i++) {
      k = j * cols + i;
      if (state[k] === 0) { pr[k] = 0; continue; }
      if (state[k] === 2 && vt - tEnd[k] > ddur[k]) { state[k] = 0; pr[k] = 0; continue; }
      p = prog(k); pr[k] = p;
      if (p < 0.01) continue;
      x = nx(i); y = ny(j); e = (vis[k] && state[k] === 1) ? p : ease(p);
      s = src[k];
      if (s >= 0) {
        sx = nx(s % cols); sy = ny((s - (s % cols)) / cols);
        x = sx + (x - sx) * e; y = sy + (y - sy) * e;
      }
      if (state[k] === 1) szc[k] += (sizeTarget(k) - szc[k]) * (vis[k] ? 0.08 : 0.02);
      r = S * 0.56 * e * szc[k];
      cD.fillStyle = mixc(colors.fond, colors.accent, fx[k]);
      cD.beginPath(); cD.arc(x, y, r, 0, 6.2832); cD.fill();
      if (r > 0.5) discs.push([x, y, r]);
    }
    clipOmbre();
    if (pageMode) cD.restore();

    if (pageMode) { cG.clearRect(-ox0, -oy0, VW, VH); cG.save(); cG.beginPath(); cG.rect(0, 0, W, H); cG.clip(); } else cG.clearRect(0, 0, W, H);
    var ink = colors.ink, base = 0.014, a, cap, v, kk;   // la grille est à peine discernable ; elle s'assombrit quand un disque s'active
    cG.lineWidth = 1;
    for (j = j0; j < j1; j++) for (i = 0; i < cols; i++) {
      k = j * cols + i; x = nx(i); y = ny(j);
      if (i < cols - 1) {
        kk = k + 1; v = Math.max(pr[k], pr[kk]); cap = 0.045 + 0.075 * (fx[k] + fx[kk]) / 2;
        a = base + (cap - base) * v;
        cG.strokeStyle = "rgba(" + ink[0] + "," + ink[1] + "," + ink[2] + "," + a.toFixed(3) + ")";
        cG.beginPath(); cG.moveTo(Math.round(x), Math.round(y) + 0.5); cG.lineTo(Math.round(nx(i + 1)), Math.round(y) + 0.5); cG.stroke();
      }
      if (j < rows - 1) {
        kk = k + cols; v = Math.max(pr[k], pr[kk]); cap = 0.045 + 0.075 * (fx[k] + fx[kk]) / 2;
        a = base + (cap - base) * v;
        cG.strokeStyle = "rgba(" + ink[0] + "," + ink[1] + "," + ink[2] + "," + a.toFixed(3) + ")";
        cG.beginPath(); cG.moveTo(Math.round(x) + 0.5, Math.round(y)); cG.lineTo(Math.round(x) + 0.5, Math.round(ny(j + 1))); cG.stroke();
      }
      cG.fillStyle = "rgba(" + ink[0] + "," + ink[1] + "," + ink[2] + "," + (0.04 + 0.13 * pr[k]).toFixed(3) + ")";
      cG.beginPath(); cG.arc(x, y, 1.4, 0, 6.2832); cG.fill();
    }
    if (pageMode) cG.restore();
  }

  function frame(now) {
    raf = 0;
    if (paused || !visible || document.hidden || reduce) return;
    var dt = lastFrame ? Math.min(now - lastFrame, 100) : 16.7; lastFrame = now;
    vt += dt;
    while (vt >= nextEvent) { event(); scheduleNext(); if (nextEvent <= vt) nextEvent = vt + 800; }
    for (var g = gestes.length - 1; g >= 0; g--) if (vt >= gestes[g].at) { var o = gestes[g]; gestes.splice(g, 1); o.run(); }
    if (vt - lastExp > 250) { lastExp = vt; for (var e = 0; e < state.length; e++) if (vis[e] && state[e] === 1 && vt > lifeEnd[e]) retire(e); }
    draw();
    raf = requestAnimationFrame(frame);
  }

  function startLoop() { if (!raf && !paused && visible && !document.hidden && !reduce) { lastFrame = 0; raf = requestAnimationFrame(frame); } }

  // ----- interaction -----
  var down = false;
  function pos(e) { var r = region.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  var evtHost = pageMode ? document : hero;
  evtHost.addEventListener("pointerdown", function (e) {
    if (e.target.closest("a,button")) return;
    if (e.pointerType === "mouse") return;   // à la souris, seul le survol dessine : le clic (maintenu ou non) ne pose rien
    down = true; lastP = null; lastCell = -1; var p = pos(e); place(p.x, p.y, true); lastP = { x: p.x, y: p.y };
  });
  window.addEventListener("pointerup", function () { down = false; });
  evtHost.addEventListener("pointermove", function (e) {
    if (e.target.closest("a,button")) { lastP = null; return; }
    if (e.pointerType === "touch" && !down) return;
    var p = pos(e); trace(p.x, p.y);   // le survol de la souris, ou le glissé d'un doigt
  });
  (pageMode ? document.documentElement : hero).addEventListener("pointerleave", function () { lastP = null; });

  if (btnFiger) {
    if (reduce) { btnFiger.hidden = true; }
    btnFiger.addEventListener("click", function () {
      paused = !paused;
      btnFiger.setAttribute("aria-pressed", String(paused));
      var en = document.documentElement.lang === "en";
      btnFiger.textContent = paused ? (en ? "Let it link up again" : "Laisser se relier") : (en ? "Hold the thread" : "Retenir le fil");
      if (!paused) startLoop();
    });
  }

  // ----- cycle de vie -----
  if ("IntersectionObserver" in window && !pageMode) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) startLoop(); }).observe(hero);
  }
  if (pageMode) window.addEventListener("scroll", function () { if (state && (paused || reduce)) draw(); }, { passive: true });   // figé ou sans animation : le fond suit tout de même le défilement
  document.addEventListener("visibilitychange", function () { if (!document.hidden) startLoop(); });

  var resizeT = 0;
  function relayout() {
    // en mode page, une hauteur qui bouge de quelques pixels (image qui se charge) ne doit pas remettre le motif à zéro
    if (pageMode && state && Math.abs(region.getBoundingClientRect().width - lastW) < 2 && Math.abs(region.getBoundingClientRect().height - lastH) < 60 && window.innerHeight === lastVH) return;
    layout(); placeOmbre(); readColors(); draw(); startLoop();
  }
  if ("ResizeObserver" in window) {
    new ResizeObserver(function () { clearTimeout(resizeT); resizeT = setTimeout(relayout, 140); }).observe(region);
  } else { window.addEventListener("resize", function () { clearTimeout(resizeT); resizeT = setTimeout(relayout, 140); }); }
  if (pageMode) window.addEventListener("resize", function () { clearTimeout(resizeT); resizeT = setTimeout(relayout, 140); });

  // mesure d'accessibilité : pire contraste de l'encre sur ce qui passe sous le texte (trait de grille compris)
  function lum(c) { var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); }
  window.__aaa = function () {
    var bg = parseColor(getComputedStyle(document.documentElement).getPropertyValue("--bg"));
    var worst = 99, n = 0, li = lum(colors.ink);
    rects.forEach(function (r) {
      for (var y = r.y0; y < r.y1; y += 6) for (var x = r.x0; x < r.x1; x += 6) {
        var d = cD.getImageData(Math.round(x * DPR), Math.round(y * DPR), 1, 1).data, al = d[3] / 255;
        var c = [d[0] * al + bg[0] * (1 - al), d[1] * al + bg[1] * (1 - al), d[2] * al + bg[2] * (1 - al)];
        var w = [c[0] * 0.88 + colors.ink[0] * 0.12, c[1] * 0.88 + colors.ink[1] * 0.12, c[2] * 0.88 + colors.ink[2] * 0.12];
        var lo = lum(w), ratio = (Math.max(lo, li) + 0.05) / (Math.min(lo, li) + 0.05);
        if (ratio < worst) worst = ratio; n++;
      }
    });
    return { pireContraste: +worst.toFixed(2), echantillons: n, accent: document.documentElement.getAttribute("data-accent") };
  };
  window.__etat = function () {
    var a = 0, g = 0, d = 0;
    for (var k = 0; k < state.length; k++) { if (state[k] === 1) { if (solid(k)) a++; else g++; } else if (state[k] === 2) d++; }
    return { tenus: a, enPousse: g, enRetrait: d, zone: zoneCount, t: Math.round(vt) };
  };

  // le visiteur change de couleur ou de thème (site-nav.js) : le héros relit les couleurs et se redessine
  window.addEventListener("grille:refresh", function () { readColors(); if (state) draw(); });

  function init() {
    layout(); placeOmbre(); readColors(); draw();
    if (!reduce) startLoop();
  }
  init();   // on démarre tout de suite : attendre les polices retardait l'apparition de plusieurs secondes sur téléphone
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { relayout(); });   // quand elles arrivent, la mise en page se recalcule, sans perdre les disques
})();
