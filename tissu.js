/* Le texte d'un titre est peint sur une toile, puis déformé comme un tissu accroché à gauche qu'on agite.
   - Chaque image est reconstruite colonne par colonne : la colonne est décalée par une onde qui avance (et une seconde, plus fine), sa largeur
     diminue avec la pente (le tissu ne s'étire pas), et un voile clair ou sombre suit le pli.
   - [data-tissu] : onde continue (le blob de ce bloc est peint sur la même toile, donc déformé avec le texte). Pas de grille sur la toile.
     [data-tissu="une-fois"] : une seule vague qui traverse le texte, puis le texte reprend sa forme et sa place exactes.
   - Le vrai texte reste dans le HTML (lecture d'écran, sélection) ; il est seulement rendu transparent pendant l'onde. Avec
     prefers-reduced-motion, rien n'est changé : le texte reste normal. */
(function () {
  "use strict";

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var AMP = 9, LAMBDA = 380, PERIODE = 3.6, OMBRE = 0.18, REF = 48;   // la version « douce », calée sur un texte de 48 px ; tout est proportionnel à la taille
  var DUREE = 8;                                                      // la vague unique : durée en secondes
  var FONDU = 0.15;                                                   // fondu entre le vrai texte et la toile, au début et à la fin de la vague unique (secondes)
  var inst = [], raf = 0, t0 = performance.now();

  // position mesurée sur le rendu (pas par les offsetLeft), sans le décalage vertical du fondu d'apparition
  function tyOf(node) {
    var ty = 0;
    for (var n = node; n && n.nodeType === 1; n = n.parentNode) {
      var tr = getComputedStyle(n).transform;
      if (tr && tr !== "none") { var m = /matrix\(([^)]+)\)/.exec(tr); if (m) ty += parseFloat(m[1].split(",")[5]) || 0; }
    }
    return ty;
  }
  function relPos(node, ancre) {
    var a = node.getBoundingClientRect(), h = ancre.getBoundingClientRect();
    return { x: a.left - h.left, y: (a.top - tyOf(node)) - (h.top - tyOf(ancre)) };
  }

  function retirer(t) {
    if (t.c.parentNode) t.c.parentNode.removeChild(t.c);
    t.el.classList.remove("tissu-actif");
    if (t.host) t.host.classList.remove("tissu-hote");
    t.io.disconnect();
  }
  function nettoyer() { inst.forEach(retirer); inst = []; }

  // les lignes du texte (même s'il contient des <br> ou des balises) : le texte de chaque ligne, sa position à gauche et son haut, relatifs au bloc de référence
  function lignesDe(el, base) {
    var br = base.getBoundingClientRect(), out = [], cur = null, top0 = null;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), node, rg = document.createRange();
    while ((node = walker.nextNode())) {
      for (var i = 0; i < node.length; i++) {
        rg.setStart(node, i); rg.setEnd(node, i + 1);
        var r = rg.getBoundingClientRect();
        if (!r.width && node.data[i] !== " ") continue;
        if (top0 === null || Math.abs(r.top - top0) > 12) { cur = { txt: "", x: r.left - br.left, y: r.top - br.top, h: r.height, w: 0 }; out.push(cur); top0 = r.top; }
        cur.txt += node.data[i];
        cur.w = r.right - br.left - cur.x;
      }
    }
    out.forEach(function (l) { l.txt = l.txt.replace(/^\s+|\s+$/g, ""); });
    return out.filter(function (l) { return l.txt; });
  }

  function construire() {
    nettoyer();
    Array.prototype.forEach.call(document.querySelectorAll("[data-tissu]"), function (el) {
      var une = el.getAttribute("data-tissu") === "une-fois";
      var host = el.closest("[data-hote]");
      var base = el.closest(".rv") || el.parentNode;
      var lignes = lignesDe(el, base);
      if (!lignes.length) return;
      var cs = getComputedStyle(el), fs = parseFloat(cs.fontSize), k = fs / REF;
      var dpr = Math.min(window.devicePixelRatio || 1, 2), amp = AMP * k, marge = Math.ceil(amp * 1.35) + 6;
      var mx = host ? 90 : 28, my = host ? Math.max(marge, 90) : marge;   // avec un blob, la toile déborde du texte pour ne pas le couper (rayon max 70 + onde)
      var x0 = Math.min.apply(null, lignes.map(function (l) { return l.x; })) - mx;
      var x1 = Math.max.apply(null, lignes.map(function (l) { return l.x + l.w; })) + mx;
      var y0 = Math.min.apply(null, lignes.map(function (l) { return l.y; })) - my;
      var y1 = Math.max.apply(null, lignes.map(function (l) { return l.y + l.h; })) + my;
      var W = Math.ceil(x1 - x0), H = Math.ceil(y1 - y0);

      // le canvas est dans le bloc de référence (il en suit l'apparition)
      if (getComputedStyle(base).position === "static") base.style.position = "relative";
      var c = document.createElement("canvas");
      c.className = "tissu-toile"; c.setAttribute("aria-hidden", "true");
      c.width = W * dpr; c.height = H * dpr;
      c.style.left = x0 + "px"; c.style.top = y0 + "px"; c.style.width = W + "px"; c.style.height = H + "px";
      base.appendChild(c);
      var off = document.createElement("canvas");
      off.width = W * dpr; off.height = H * dpr;

      var pb = host ? relPos(base, host) : { x: 0, y: 0 };
      var t = { el: el, host: host, c: c, ctx: c.getContext("2d"), off: off, o: off.getContext("2d"), W: W, H: H, dpr: dpr, ox: pb.x + x0, oy: pb.y + y0,
        amp: amp, lambda: LAMBDA * k, periode: PERIODE, une: une, depart: null, couleurs: null, n: 0, visible: true,
        lignes: lignes.map(function (l) { return { txt: l.txt, x: l.x - x0, y: l.y - y0, h: l.h }; }),
        tx0: Math.min.apply(null, lignes.map(function (l) { return l.x; })) - x0, tw: Math.max.apply(null, lignes.map(function (l) { return l.w; })),
        font: cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily, ls: cs.letterSpacing };
      t.io = new IntersectionObserver(function (es) {
        t.visible = es[0].isIntersecting;
      }, { threshold: 0.3 });
      t.io.observe(c);
      // vague unique : la toile naît transparente et apparaît en fondu (le vrai texte s'efface en même temps) ; sans cela, le passage d'un rendu à l'autre
      // (décalage de moins d'un pixel, un peu de flou) se voit comme un tremblement
      if (une) { c.style.opacity = "0"; c.style.transition = "opacity " + FONDU + "s linear"; }
      if (!une) el.classList.add("tissu-actif");
      if (host && !une) host.classList.add("tissu-hote");
      inst.push(t);
    });
    if (inst.length && !raf) raf = requestAnimationFrame(boucle);
  }

  // le déplacement vertical d'une colonne : une onde qui avance, plus une seconde plus fine ; nulle à gauche, de plus en plus forte vers la droite
  function dy(t, x, temps, g) {
    var env = Math.pow(Math.max(0, Math.min(1, (x - t.tx0) / Math.max(1, t.tw))), 0.85);
    var k = 2 * Math.PI / t.lambda, w = 2 * Math.PI / t.periode;
    return g * env * t.amp * (Math.sin(k * x - w * temps) + 0.35 * Math.sin(2.3 * k * x - 1.7 * w * temps + 1.2));
  }

  function lireCouleurs(t) {
    var r = getComputedStyle(document.documentElement);
    t.couleurs = { ink: r.getPropertyValue("--encre").trim() || "#2D2F32", accent: r.getPropertyValue("--accent-fond").trim() || "#00ff00" };
  }

  function peindre(t) {
    var o = t.o, d = t.dpr, i;
    o.setTransform(d, 0, 0, d, 0, 0);
    o.clearRect(0, 0, t.W, t.H);
    // le blob de ce bloc (les disques que fait vivre grille.js), dans les coordonnées de la toile
    if (t.host) {
      o.fillStyle = t.couleurs.accent;
      var circles = t.host.querySelectorAll(".blobs g circle");
      for (i = 0; i < circles.length; i++) {
        var r = parseFloat(circles[i].getAttribute("r"));
        if (!(r > 0.5)) continue;
        var cx = parseFloat(circles[i].getAttribute("cx")) - t.ox, cy = parseFloat(circles[i].getAttribute("cy")) - t.oy;
        if (cx + r < 0 || cx - r > t.W || cy + r < 0 || cy - r > t.H) continue;
        o.beginPath(); o.arc(cx, cy, r, 0, 6.2832); o.fill();
      }
    }
    // le texte, par-dessus
    o.font = t.font; if ("letterSpacing" in o) o.letterSpacing = t.ls; o.fillStyle = t.couleurs.ink; o.textBaseline = "alphabetic";
    var asc = o.measureText("M").fontBoundingBoxAscent || parseFloat(t.font.split(" ")[1]) * 0.9;
    t.lignes.forEach(function (l) { o.fillText(l.txt, l.x, l.y + asc); });
  }

  function deformer(t, temps, g) {
    var ctx = t.ctx, d = t.dpr, xd = 0, prev = dy(t, 0, temps, g);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, t.c.width, t.c.height);
    for (var sx = 0; sx < t.W; sx++) {
      var cur = dy(t, sx + 1, temps, g), pente = cur - prev;
      var w = 1 / Math.sqrt(1 + pente * pente);                 // le tissu ne s'étire pas
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(t.off, sx * d, 0, d, t.H * d, xd * d, prev * d, (w + 0.6) * d, t.H * d);
      var a = Math.min(0.5, Math.abs(pente) * 1.4) * OMBRE * 2;   // lumière et ombre dans les plis
      if (a > 0.004) {
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = pente < 0 ? "rgba(255,255,255," + a.toFixed(3) + ")" : "rgba(0,0,0," + (a * 0.6).toFixed(3) + ")";
        ctx.fillRect(xd * d, 0, (w + 0.6) * d, t.H * d);
      }
      xd += w; prev = cur;
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function boucle(now) {
    raf = 0;
    var s = (now - t0) / 1000;
    for (var i = inst.length - 1; i >= 0; i--) {
      var t = inst[i];
      var g = 1;
      if (t.une) {
        if (t.depart === null) {                                  // la vague unique part quand le titre est réellement vu à l'écran
          var vr = t.el.getBoundingClientRect();
          if (vr.height > 0 && vr.top < window.innerHeight * 0.8 && vr.bottom > window.innerHeight * 0.1 && !document.hidden) t.depart = s + 0.6;
          continue;
        }                                                         // en attendant : le texte normal, la toile est vide
        var u = (s - t.depart) / DUREE;
        if (u < 0) continue;
        if (u >= 1) { retirer(t); inst.splice(i, 1); continue; }  // la vague est passée : le texte revient, exact
        // la couleur ne change jamais : le vrai texte reste plein pendant que la toile apparaît par-dessus (même encre), puis il devient transparent
        // une fois la toile pleine ; à la fin, il revient plein sous la toile, qui s'efface ensuite
        if (!t.fin && u >= 1 - FONDU / DUREE) {
          t.fin = true; t.el.classList.remove("tissu-actif"); if (t.host) t.host.classList.remove("tissu-hote"); t.c.style.opacity = "0";
        } else if (!t.fin && !t.on) {
          t.on = true; t.t1 = s;
          if (!t.couleurs) lireCouleurs(t);
          peindre(t); deformer(t, s, 0); t.c.getBoundingClientRect(); t.c.style.opacity = "1";
        }
        if (t.on && !t.fin && !t.actif && s - t.t1 >= FONDU) {
          t.actif = true; t.el.classList.add("tissu-actif"); if (t.host) t.host.classList.add("tissu-hote");
        }
        g = Math.pow(Math.sin(Math.PI * u), 1.4);                // la vague naît, traverse, s'éteint
      } else if (!t.visible) continue;
      if (document.hidden) continue;
      if (!t.couleurs || (t.n++ % 20) === 0) lireCouleurs(t);
      peindre(t); deformer(t, s, g);
    }
    if (inst.length) raf = requestAnimationFrame(boucle);
  }

  var tm = 0;
  function plusTard() { clearTimeout(tm); tm = setTimeout(construire, 180); }
  window.addEventListener("resize", plusTard);
  window.addEventListener("grille:refresh", plusTard);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(construire); else window.addEventListener("load", construire);
})();
