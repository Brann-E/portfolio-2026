/* Le fil de lecture du résumé d'une étude de cas : sur le bord gauche de la liste, une perle par ligne ; la ligne lue s'agrandit,
   le fil se remplit jusqu'à elle. Rien ne change dans la mise en page : le fil est dessiné hors de la liste. */
(function () {
  "use strict";

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var resume = document.querySelector(".summary");
  if (resume && !(window.matchMedia && matchMedia("(max-width: 700px)").matches)) {
    var NS = "http://www.w3.org/2000/svg";
    var el = function (n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; };
    var clamp = function (x, a, c) { return Math.max(a, Math.min(c, x)); };
    var rows = [].slice.call(resume.querySelectorAll(".row")), svg, perles, fil, base, H, R = 8, hover = -1, actif = false, raf = 0;

    var geometrie = function () {
      if (svg) resume.removeChild(svg);
      var r0 = resume.getBoundingClientRect(); H = resume.offsetHeight;
      svg = el("svg", { "class": "fil-resume", viewBox: "0 0 28 " + H, width: 28, height: H, "aria-hidden": "true", focusable: "false" });
      var defs = el("defs", {}), f = el("filter", { id: "fusion-resume", filterUnits: "userSpaceOnUse", x: -20, y: -10, width: 80, height: H + 20, "color-interpolation-filters": "sRGB" });
      f.appendChild(el("feGaussianBlur", { "in": "SourceGraphic", stdDeviation: 3, result: "flou" }));
      f.appendChild(el("feColorMatrix", { "in": "flou", type: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" }));
      defs.appendChild(f); svg.appendChild(defs);
      var ys = rows.map(function (r) { var n = r.querySelector(".num").getBoundingClientRect(); return Math.round(n.top - r0.top + n.height / 2); });
      base = el("path", { "class": "base", d: "M14 " + ys[0] + "V" + ys[ys.length - 1] }); svg.appendChild(base);
      var gE = el("g", {}), gA = el("g", { filter: "url(#fusion-resume)" }); svg.appendChild(gE); svg.appendChild(gA);
      fil = el("path", { "class": "fil", "stroke-width": 5, d: "M14 0V0" }); gA.appendChild(fil);
      perles = ys.map(function (y) {
        var a = el("circle", { "class": "accent", cx: 14, cy: y, r: 0 }), e = el("circle", { "class": "encre", cx: 14, cy: y, r: 0 });
        gA.appendChild(a); gE.appendChild(e); return { y: y, a: a, e: e, ra: 0, re: 0 };
      });
      resume.appendChild(svg);
      tick();
    };

    var pos = null;
    var tick = function () {
      if (!perles) return;
      var r0 = resume.getBoundingClientRect(), lect = window.innerHeight * 0.5 - r0.top, i, cur = -1;
      var y0 = perles[0].y, yN = perles[perles.length - 1].y;
      var cible = clamp(lect, y0, yN);
      if (pos === null) pos = cible;
      pos += (cible - pos) * (reduce ? 1 : 0.08);                 // le fil avance en continu, il rattrape la lecture sans à-coup
      for (i = 0; i < perles.length; i++) if (perles[i].y <= pos + 2) cur = i;
      fil.setAttribute("d", "M14 " + y0 + "V" + pos.toFixed(1));
      perles.forEach(function (p, k) {
        var ta = k === cur ? R : k < cur ? R * 0.6 : 0, te = k > cur ? 3 : 0;
        p.ra += (ta - p.ra) * (reduce ? 1 : 0.1); p.re += (te - p.re) * (reduce ? 1 : 0.1);
        p.a.setAttribute("r", p.ra.toFixed(2)); p.e.setAttribute("r", p.re.toFixed(2));
      });
    };
    var boucle = function () { raf = 0; if (!actif) return; tick(); raf = requestAnimationFrame(boucle); };
    var demarrer = function () { actif = true; if (!raf) raf = requestAnimationFrame(boucle); };

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(geometrie); else geometrie();
    window.addEventListener("load", geometrie);
    var t = 0; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(geometrie, 200); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) demarrer(); else actif = false; }).observe(resume); else demarrer();
  }
})();
