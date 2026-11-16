/* Une seule grille pour toute la page.
   - La grille a une unité (--demi-ligne) et une origine communes : le bord gauche du contenu et le haut du document.
     Des points la rappellent partout (fond de page) ; elle ne se montre en filets que dans les blocs qui
     accueillent des blobs (.hote) : ils absorbent la grille entière, alignée sur la même trame.
   - Les blobs sont des disques posés sur certains noeuds de cette trame, autour des mots à mettre en valeur
     (data-accroche). Ils peuvent dépasser, et se connecter plus ou moins entre eux (fusion).
   - Le texte reste en encre, posé sur la couleur : l'AAA prime. La figure est stable : graine = le texte.
   Le contenu apparaît d'abord ; la grille et les blobs suivent (délais en CSS et ici). */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var uid = 0;

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function mod(a, m) { return ((a % m) + m) % m; }

  // Positions mesurées sur le rendu (getBoundingClientRect), jamais par la chaîne des offsetLeft, que les navigateurs ne calculent pas tous
  // pareil dans une grille. Seul le décalage vertical du fondu d'apparition (translateY) est retiré, pour ne pas fausser la position.
  function tyOf(node) {
    var ty = 0;
    for (var n = node; n && n.nodeType === 1; n = n.parentNode) {
      var t = getComputedStyle(n).transform;
      if (t && t !== "none") { var m = /matrix\(([^)]+)\)/.exec(t); if (m) { var v = m[1].split(","); ty += parseFloat(v[5]) || 0; } }
    }
    return ty;
  }
  function docPos(node) {
    var r = node.getBoundingClientRect();
    return { x: r.left + (window.pageXOffset || 0), y: r.top + (window.pageYOffset || 0) - tyOf(node) };
  }
  function relPos(node, host) {
    // l'origine des blobs, des filets et du halo est le bord intérieur de la boîte (position:absolute se compte depuis le padding-box) :
    // on retire donc la bordure de l'hôte, sinon un hôte à bordure (la citation, 14 px à gauche) décale tout de sa bordure
    var a = node.getBoundingClientRect(), h = host.getBoundingClientRect();
    return { x: a.left - (h.left + host.clientLeft), y: (a.top - tyOf(node)) - (h.top + host.clientTop - tyOf(host)) };
  }

  function unitPx() {
    var probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;width:var(--demi-ligne)";
    document.body.appendChild(probe);
    var u = probe.offsetWidth || 40;
    document.body.removeChild(probe);
    return u;
  }

  function targetRects(target, host) {
    var out = [], A = target.closest(".rv"), hr = host.getBoundingClientRect();
    var rects = target.getClientRects();
    for (var i = 0; i < rects.length; i++) {
      var r = rects[i];
      if (r.width < 4 || r.height < 4) continue;
      var x, y;
      if (A && A !== host && host.contains(A)) {
        var ar = A.getBoundingClientRect(), p = relPos(A, host);
        x = p.x + (r.left - ar.left); y = p.y + (r.top - ar.top);
      } else {
        x = r.left - (hr.left + host.clientLeft); y = r.top - (hr.top + host.clientTop);
      }
      out.push({ x: x, y: y, w: r.width, h: r.height });
    }
    return out;
  }

  /* Moteur des souffles : un petit signal qui respire AU CENTRE du texte flaggé, pour attirer le regard.
     (Le réseau de blobs liés, la croissance en bourgeons et la fusion restent réservés au héros.)
     1. La grille de la page (filets tous les 28 px, 14 px à gauche du bord de page, jamais modifiée) a des cases d'une ligne.
     2. Un texte sur plusieurs lignes : on n'en garde qu'une, la plus longue. La zone = les cases que cette ligne touche.
     3. Le coeur : une seule rangée de points de la grille, celle qui est le plus près du milieu de la ligne, et seulement les points
        proches du centre (au plus 1,5 case, ou 20 % de la largeur, de chaque côté). Rien ne se disperse.
     4. Un souffle : un blob naît AU CENTRE, grossit depuis l'intérieur, tient, rétrécit, disparaît. Rien entre deux souffles.
        Il peut ensuite se déplacer d'un point voisin du coeur.
     5. Taille à l'échelle de la grille de 28 px : diamètre 56 pour un texte courant ou un chapeau ; à partir du titre de cellule (autre
        police) plus gros (84, 112, 140) et plus lent, et il n'est plus borné par la zone : il respire de l'intérieur du mot.
     6. Lenteur : trois vitesses. C = douce (2,5 s pour grossir), B = lente (x1,8), A = très lente (x3). Plus le texte est grand, plus
        c'est lent. Aucune naissance n'est brusque : on distingue un mouvement seulement au bout de plusieurs secondes.
     7. Texte serif (data-marge) : jamais de blob derrière les lettres. Un petit blob (diamètre 28) respire dans la marge, sur la ligne
        de la grille qui précède le début de la ligne, à hauteur de la première ligne du texte : il tient dans la gouttière.
     8. Vitesse retenue : B (x1,8). Chaque texte a son propre rythme ; rien ne bouge hors écran ; avec prefers-reduced-motion, un blob fixe
        par texte. */
  var sims = new WeakMap();
  // le chef d'orchestre : au plus 2 séries de souffles en même temps sur toute la page, une seule par bloc ; les autres attendent leur tour,
  // tirées au hasard, avec en plus une chance sur huit de laisser passer leur tour. Peu de blobs à la fois, mais on les regarde.
  var ORCHESTRE = { n: 0, max: 2 };
  function rand(a, b) { return a + Math.random() * (b - a); }
  function stopSim(host) { var s = sims.get(host); if (s) { s.stop(); sims.delete(host); } }
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }

  function makeSim(host, g, fields, reduce) {
    var alive = true, visible = true, io = null, raf = 0, timers = [], blobs = [], miens = 0;
    var halo = host.querySelector(":scope > .halo");
    function T(fn, ms) { timers.push(setTimeout(function () { if (alive) fn(); }, ms)); }
    function ready() {
      if (host.classList.contains("situation")) return !!host.querySelector(".slide.is-active");
      return host.classList.contains("in") || !!host.querySelector(".in");
    }
    function actif(f) {
      if (!(visible && ready())) return false;
      if (!f || !f.quand) return true;
      var s = host.querySelector(".slide.is-active");   // « ferme » : avant le clic, où il faut cliquer ; « ouvert » : après le clic, ce qui apparaît
      if (!s) return false;
      var ouvert = s.classList.contains("is-revealed");
      return f.quand === "ouvert" ? ouvert : !ouvert;
    }

    // un souffle : rayon = R x enveloppe(t) ; R est limité par la place autour du point
    function souffle(f, p, R, up, hold, down, libre) {
      var r = libre ? R : Math.max(14, Math.min(R, p.room + f.cell / 2));
      var node = el("circle", { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 0 });
      g.appendChild(node);
      var b = { node: node, R: r, t0: performance.now(), up: up, hold: hold, down: down };
      blobs.push(b);
      if (reduce) { node.setAttribute("r", (r * 0.8).toFixed(1)); b.fixe = true; }
      return b;
    }
    function frame(now) {
      raf = 0;
      if (!alive) return;
      for (var i = blobs.length - 1; i >= 0; i--) {
        var b = blobs[i];
        if (b.fixe) continue;
        var t = now - b.t0, e;
        if (t < b.up) e = ease(t / b.up);
        else if (t < b.up + b.hold) e = 1;
        else if (t < b.up + b.hold + b.down) e = 1 - ease((t - b.up - b.hold) / b.down);
        else { if (b.node.parentNode) b.node.parentNode.removeChild(b.node); blobs.splice(i, 1); continue; }
        b.node.setAttribute("r", (b.R * e).toFixed(1));
        b.e = e;
      }
      // le halo : la grille n'apparaît qu'autour des blobs, à peine, et s'éteint avec eux
      if (halo) {
        var parts = [];
        for (var q = 0; q < blobs.length; q++) {
          var bl = blobs[q], rr = bl.R * (bl.e || 0);
          if (rr < 1) continue;
          var al = Math.min(1, (bl.e || 0)).toFixed(2), x = bl.node.getAttribute("cx"), y = bl.node.getAttribute("cy");
          parts.push("radial-gradient(circle at " + x + "px " + y + "px, rgba(0,0,0," + al + ") 0, rgba(0,0,0," + al + ") " + rr.toFixed(0) + "px, rgba(0,0,0,0) " + (rr + 56).toFixed(0) + "px)");
        }
        halo.style.setProperty("--m", parts.length ? parts.join(",") : "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))");
      }
      raf = requestAnimationFrame(frame);
    }

    function clamp(i, n) { return Math.max(0, Math.min(n - 1, i)); }
    function pause(f) { return rand(f.pause[0], f.pause[1]) * Math.sqrt(f.k) * 0.55; }
    function hasard(f) { return f.nodes[f.centre]; }

    // un point au centre qui respire 1 à 3 fois, puis qui se déplace d'un point voisin du coeur
    function dir(f, idx) {
      if (!actif(f)) { T(function () { dir(f, idx); }, 600); return; }
      if (!f.go) { f.go = true; T(function () { dir(f, idx); }, rand(200, 2500)); return; }   // chaque motif part à son heure, jamais tous ensemble
      if (ORCHESTRE.n >= ORCHESTRE.max || miens >= 1 || Math.random() < 0.12) { T(function () { dir(f, idx); }, rand(500, 2200)); return; }
      ORCHESTRE.n++; miens++;
      var n = f.nodes.length;
      if (idx === undefined) idx = Math.floor(Math.random() * n);   // et d'un point de départ tiré au hasard dans le coeur
      else if (n > 1) { var nx; do { nx = Math.floor(Math.random() * n); } while (nx === idx); idx = nx; }   // un autre point du coeur, jamais le même
      var p = f.nodes[idx], reps = f.variante === "A" ? 1 : f.variante === "B" ? 1 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 2), t = 0;
      for (var k = 0; k < reps; k++) {
        (function () {
          var up = Math.min(12000, rand(2200, 2800) * f.k), hold = Math.min(8000, rand(1200, 2000) * f.k), down = Math.min(12000, rand(2200, 2800) * f.k);
          T(function () { souffle(f, p, f.R, up, hold, down, f.libre); }, t);
          t += up + hold + down + rand(400, 800) * f.k;
        })();
      }
      T(function () { ORCHESTRE.n--; miens--; }, t);   // la série est finie : la place est libre
      T(function () { dir(f, idx); }, t + pause(f));
    }

    fields.forEach(function (f) {
      var d = dir;
      for (var i = 0; i < f.instances; i++) {
        (function (i) {
          if (reduce) { souffle(f, hasard(f), f.R, 0, 0, 0, f.libre); return; }
          T(function () { d(f); }, f.delay * 1000 + rand(0, 2500));
        })(i);
      }
    });
    if (!reduce) raf = requestAnimationFrame(frame);
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.05 });
      io.observe(host);
    }
    return { stop: function () { alive = false; ORCHESTRE.n -= miens; miens = 0; timers.forEach(clearTimeout); if (raf) cancelAnimationFrame(raf); if (io) io.disconnect(); } };
  }

  function buildHost(host, u, docX0) {
    stopSim(host);
    var old = host.querySelector(":scope > .blobs");
    if (old) host.removeChild(old);
    var oldH = host.querySelector(":scope > .halo");
    if (oldH) host.removeChild(oldH);

    var hp = docPos(host);
    var cell = u * 2;   // une case de la grille = une ligne de texte (28 px)
    var offX = mod(docX0 - u - (hp.x + host.clientLeft), cell), offY = mod(-(hp.y + host.clientTop), cell);   // lignes au milieu des gouttières : 14 px à gauche du bord de page ; l'origine du motif est le padding-box, pas la bordure
    host.style.setProperty("--gx", offX.toFixed(2) + "px");
    host.style.setProperty("--gy", offY.toFixed(2) + "px");

    var targets = host.querySelectorAll("[data-accroche]");
    if (!targets.length) return;

    var W = host.offsetWidth, H = host.offsetHeight;
    var svg = el("svg", { class: "blobs", width: W, height: H, "aria-hidden": "true", focusable: "false" });
    var g = el("g", {});
    var k = 0;

    var fields = [];
    Array.prototype.forEach.call(targets, function (target) {
      if (target.closest(".slide") && !target.closest(".slide.is-active")) return;   // une seule diapositive vit à la fois
      var rects = targetRects(target, host);
      if (!rects.length) return;
      var base = parseFloat(target.getAttribute("data-delay") || "1.2");
      var variante = (target.getAttribute("data-souffle") || "B").toUpperCase();
      var quand = target.getAttribute("data-quand") || "";

      if (target.hasAttribute("data-marge")) {
        // texte serif : un blob dans la marge, sur la ligne de grille qui précède la première ligne, à sa hauteur
        var r0 = rects[0], gi = Math.floor((r0.x - offX) / cell), gj = Math.round((r0.y + Math.min(r0.h * 0.55, u) - offY) / cell);
        var pt = { i: gi, j: gj, x: offX + gi * cell, y: offY + gj * cell, room: u };
        fields.push({ nodes: [pt], centre: 0, cell: cell, R: 14, pause: [4500, 9000], k: (variante === "A" ? 3 : variante === "B" ? 1.8 : 1), instances: 1, libre: true, variante: variante, delay: base, quand: quand });
        return;
      }

      // 2. une ligne à la fois : chaque ligne du texte a son propre motif (une série se joue sur une seule ligne, sans se disperser)
      rects.forEach(function (rect) {
      var hraw = rect.h;
      var zr = rect;
      if (zr.h > 40) { var pd = zr.h * 0.17; zr = { x: zr.x, y: zr.y + pd, w: zr.w, h: zr.h - 2 * pd }; }
      var cells = {};
      var i0 = Math.floor((zr.x - offX) / cell), i1 = Math.ceil((zr.x + zr.w - offX) / cell) - 1;
      var j0 = Math.floor((zr.y - offY) / cell), j1 = Math.ceil((zr.y + zr.h - offY) / cell) - 1;
      for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) cells[i + "," + j] = 1;
      var cx = zr.x + zr.w / 2, cy = zr.y + zr.h * 0.55;   // le milieu des lettres est un peu sous le milieu de la boîte

      // les points possibles : intersections intérieures, ou les coins des cases pour une seule ligne
      var nodes = [], byKey = {};
      function addNode(i, j, room) {
        var key = i + "," + j;
        if (byKey[key]) return;
        var nd = { i: i, j: j, x: offX + i * cell, y: offY + j * cell, room: room };
        byKey[key] = nd; nodes.push(nd);
      }
      Object.keys(cells).forEach(function (key) {
        var p = key.split(","), i = +p[0], j = +p[1];
        if (cells[(i - 1) + "," + (j - 1)] && cells[i + "," + (j - 1)] && cells[(i - 1) + "," + j]) {
          var L = 0, Rr = 0, U = 0, D = 0;
          while (cells[(i - 1 - L) + "," + (j - 1)] && cells[(i - 1 - L) + "," + j]) L++;
          while (cells[(i + Rr) + "," + (j - 1)] && cells[(i + Rr) + "," + j]) Rr++;
          while (cells[(i - 1) + "," + (j - 1 - U)] && cells[i + "," + (j - 1 - U)]) U++;
          while (cells[(i - 1) + "," + (j + D)] && cells[i + "," + (j + D)]) D++;
          addNode(i, j, Math.min(L, Rr, U, D) * cell);
        }
      });
      Object.keys(cells).forEach(function (key) {   // les autres sommets des cases touchées : le point le plus proche du centre est ainsi toujours à une demi-case au plus
        var p = key.split(","), i = +p[0], j = +p[1];
        addNode(i, j, u); addNode(i + 1, j, u); addNode(i, j + 1, u); addNode(i + 1, j + 1, u);
      });
      // 3. le coeur : la rangée la plus proche du milieu de la ligne, et les points proches du centre
      var best = nodes[0];
      nodes.forEach(function (nd) { if (Math.abs(nd.y - cy) < Math.abs(best.y - cy) - 0.5) best = nd; });
      var rang = best.y, ecart = Math.max(cell * 2, zr.w * 0.32);
      var coeur = nodes.filter(function (nd) { return Math.abs(nd.y - rang) < 1 && Math.abs(nd.x - cx) <= ecart; });
      if (!coeur.length) {
        coeur = [nodes.reduce(function (m, nd) { return Math.hypot(nd.x - cx, nd.y - cy) < Math.hypot(m.x - cx, m.y - cy) ? nd : m; }, nodes[0])];
      }
      coeur.sort(function (p, q) { return p.x - q.x; });
      var centre = 0;
      coeur.forEach(function (nd, q) { if (Math.abs(nd.x - cx) < Math.abs(coeur[centre].x - cx)) centre = q; });

      // 5. taille, lenteur et pauses selon la taille du texte ; vitesse selon la version (C douce, B lente, A très lente)
      var R, pause, role, libre = false;
      if (hraw < 28) { R = 28; pause = [4000, 8000]; role = 1; }                         // étiquette, petit texte, texte courant, chapeau
      else if (hraw < 40) { R = 42; pause = [4500, 9000]; role = 1.2; libre = true; }    // titre de cellule
      else if (hraw < 70) { R = 56; pause = [5000, 10000]; role = 1.4; libre = true; }   // titre de section
      else { R = 70; pause = [5000, 10000]; role = 1.6; libre = true; }                  // chiffre, titre du héros
      var vit = variante === "A" ? 3 : variante === "B" ? 1.8 : 1;
      fields.push({ rect: rect, cy: cy, offY: offY, nodes: coeur, centre: centre, cell: cell, R: R, pause: pause, k: vit * role, instances: 1, libre: libre, variante: variante, delay: base, quand: quand });
      });
    });

    svg.appendChild(g);
    host.insertBefore(svg, host.firstChild);
    var halo = document.createElement("div");
    halo.className = "halo"; halo.setAttribute("aria-hidden", "true");
    host.insertBefore(halo, svg.nextSibling);

    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    host.__champs = fields;   // pour le contrôle : les points possibles de chaque ligne
    sims.set(host, makeSim(host, g, fields, reduce));
  }

  function all() {
    var u = unitPx();
    var first = document.querySelector(".page");
    var docX0 = first ? docPos(first).x : 0;
    var hosts = document.querySelectorAll("[data-hote]");
    for (var i = 0; i < hosts.length; i++) buildHost(hosts[i], u, docX0);
  }

  var t = 0;
  function later() { clearTimeout(t); t = setTimeout(all, 120); }

  window.addEventListener("grille:refresh", all);
  window.addEventListener("resize", later);
  if ("ResizeObserver" in window) new ResizeObserver(later).observe(document.body);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all); else window.addEventListener("load", all);
})();
