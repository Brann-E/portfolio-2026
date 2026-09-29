/* ------------------------------------------------------------------
   Frise des terrains, pour les sommaires des etudes de cas.
   <span class="tfrise" data-on="i,j" data-arrow="from-to">.
   Les cinq terrains sont nommes (largeur naturelle, repartis sur la ligne),
   l'actif en clair (--paper), les autres eteints (--muted). Dessous : une
   fleche droite du terrain de depart a l'arrivee (mouvement), sinon un point
   sous chaque terrain mobilise. Les fleches et points sont positionnes sur
   les centres REELS des mots (mesures), et recalcules au redimensionnement.
   Ordre : 0 personne | 1 outil | 2 parcours | 3 organisation | 4 ecosysteme
------------------------------------------------------------------ */
(function () {
  "use strict";

  var NAMES = ["personne", "outil", "parcours", "organisation", "\u00e9cosyst\u00e8me"];
  var built = [];

  function nums(span, attr) {
    return (span.getAttribute(attr) || "").split(",")
      .filter(function (s) { return s !== ""; }).map(Number);
  }

  function centers(labels) {
    var base = labels.getBoundingClientRect().left;
    var kids = labels.children, c = [];
    for (var i = 0; i < kids.length; i++) {
      var r = kids[i].getBoundingClientRect();
      c.push(r.left + r.width / 2 - base);
    }
    return c;
  }

  function layout(span) {
    var labels = span.querySelector(".tf-labels");
    var mark = span.querySelector(".tf-mark");
    if (!labels || !mark) return;
    var c = centers(labels);
    var on = nums(span, "data-on");
    var arrow = span.getAttribute("data-arrow");
    mark.textContent = "";
    if (arrow) {
      var p = arrow.split("-").map(Number);
      var xa = c[p[0]], xb = c[p[1]];
      var bar = document.createElement("i");
      bar.className = "tf-a " + (xb > xa ? "r" : "l");
      bar.style.left = Math.min(xa, xb) + "px";
      bar.style.width = Math.abs(xb - xa) + "px";
      mark.appendChild(bar);
    } else {
      on.forEach(function (i) {
        var d = document.createElement("i");
        d.className = "tf-d";
        d.style.left = c[i] + "px";
        mark.appendChild(d);
      });
    }
  }

  function build(span) {
    var on = nums(span, "data-on");
    var labels = document.createElement("span");
    labels.className = "tf-labels";
    for (var i = 0; i < 5; i++) {
      var w = document.createElement("span");
      w.className = "tf-w" + (on.indexOf(i) > -1 ? " on" : "");
      w.textContent = NAMES[i];
      labels.appendChild(w);
    }
    span.appendChild(labels);
    var mark = document.createElement("span");
    mark.className = "tf-mark";
    span.appendChild(mark);
    span.setAttribute("data-built", "1");
    built.push(span);
    layout(span);
  }

  function relayout() { for (var i = 0; i < built.length; i++) layout(built[i]); }

  function run() {
    var list = document.querySelectorAll(".tfrise:not([data-built])");
    for (var i = 0; i < list.length; i++) build(list[i]);
  }

  var timer;
  window.addEventListener("resize", function () {
    clearTimeout(timer); timer = setTimeout(relayout, 120);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
