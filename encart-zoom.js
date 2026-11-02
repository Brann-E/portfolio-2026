/* Encarts interactifs : dans la page on montre la toile ENTIÈRE, réduite pour
   tenir dans une vignette (quitte à n'être pas lisible), sans défilement, avec
   le bouton "Voir en grand" au centre. Le bouton ouvre l'encart en plein écran,
   dans une surface dédiée posée directement sous <body> (hors des chapitres
   animés, dont le will-change/transform piégerait un position:fixed), où la
   toile est mise à l'échelle pour tenir entièrement dans l'écran.

   On ne déplace pas l'iframe de l'aperçu (un déplacement la rechargerait, de
   façon peu fiable) : la fenêtre plein écran reçoit sa propre iframe, créée à
   la première ouverture puis réutilisée. L'aperçu reste vivant à sa place.
   Échap ou le bouton ferment. Le HTML n'a pas besoin d'être modifié. */
(function () {
  "use strict";
  var encarts = document.querySelectorAll(".encart-interactif");
  if (!encarts.length) return;

  var BASE_MAX = 1280; /* largeur de mise en page "desktop" de l'app, plafond */

  /* Donne à la toile une largeur de mise en page, lit sa hauteur réelle, puis
     la réduit (transform: scale) pour qu'elle tienne ENTIÈREMENT dans boxW x
     boxH. Renvoie l'échelle appliquée (0 si la hauteur n'est pas encore là). */
  function scaleFrame(frame, boxW, boxH) {
    if (boxW <= 0 || boxH <= 0) return 0;
    var baseW = Math.min(boxW, BASE_MAX);
    frame.style.width = baseW + "px";
    var contentH = frame.offsetHeight; /* = --embed-height posée par l'app */
    if (!contentH) return 0;
    var scale = Math.min(1, boxW / baseW, boxH / contentH);
    frame.style.transform = "scale(" + scale + ")";
    return scale;
  }

  /* L'app republie --embed-height quand son contenu change (reflow après
     changement de largeur, toggle de la carte, insight du repository). On
     recale à chaque VRAIE mise à jour de hauteur, en ignorant nos propres
     écritures de width/transform (qui ne touchent pas --embed-height). */
  function watchHeight(frame, onChange) {
    var last = frame.style.getPropertyValue("--embed-height");
    var mo = new MutationObserver(function () {
      var now = frame.style.getPropertyValue("--embed-height");
      if (now !== last) {
        last = now;
        onChange();
      }
    });
    mo.observe(frame, { attributes: true, attributeFilter: ["style"] });
    return mo;
  }

  /* ---- Aperçu (vignette dans la page) ------------------------------------ */
  /* Hauteur paysage de l'apercu (meme mise en page que le plein ecran, en plus
     petit). Format large, jamais tout en longueur. */
  var APERCU_H = 560;

  function fitApercu(encart) {
    var frame = encart.querySelector(".encart-frame");
    if (!frame) return;
    if (isRepo(frame)) {
      /* L'apercu EST la vue plein ecran en reduit : meme mise en page paysage
         (.nova-full) rendue directement a la taille de la carte, sans scale. */
      try {
        frame.contentDocument.documentElement.classList.add("nova-full");
      } catch (e) {}
      encart.style.height = APERCU_H + "px";
      frame.style.transform = "";
      frame.style.width = "100%";
      frame.style.height = APERCU_H + "px";
    } else {
      /* Carte : vignette de la toile entiere dans la boite (hauteur CSS). */
      scaleFrame(frame, encart.clientWidth, encart.clientHeight);
    }
  }

  /* ---- Plein écran ------------------------------------------------------- */
  var overlay, closeBtn, current, opener, fsObserver;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "encart-lb";
    overlay.hidden = true;

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "don-close-btn encart-plein-close";
    closeBtn.setAttribute("aria-label", "Fermer le plein écran");
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7 L17 17 M17 7 L7 17"/></svg>';
    closeBtn.addEventListener("click", close);

    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function isRepo(frame) {
    return (frame.getAttribute("src") || "").indexOf("vue=repository") !== -1;
  }

  /* Tous les liens de l'app (iframe, même origine) s'ouvrent dans un nouvel
     onglet. Un <base target="_blank"> ne suffit pas : l'app intercepte le clic
     sur ses liens et navigue elle-même (ce qui remplace l'onglet courant). On
     capture donc le clic sur tout <a href> AVANT le handler de l'app, et on
     ouvre l'URL dans un nouvel onglet nous-mêmes. */
  function blankLinks(frame) {
    try {
      var d = frame.contentDocument;
      var w = frame.contentWindow;
      if (!d || d._blankDone) return;
      d._blankDone = true;
      if (d.head && !d.head.querySelector("base[data-blank]")) {
        var b = d.createElement("base");
        b.setAttribute("target", "_blank");
        b.setAttribute("data-blank", "");
        d.head.appendChild(b);
      }
      d.addEventListener(
        "click",
        function (e) {
          var a = e.target.closest ? e.target.closest("a[href]") : null;
          if (!a || !a.href) return;
          e.preventDefault();
          e.stopPropagation();
          var nw = w.open(a.href, "_blank");
          if (nw) {
            try {
              nw.opener = null;
            } catch (_) {}
          }
        },
        true
      );
    } catch (e) {}
  }

  function fitFullscreen() {
    if (!current || overlay.hidden) return;
    var cs = getComputedStyle(overlay);
    var w = overlay.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var h = overlay.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (isRepo(current) && w >= 760) {
      /* Le repository REMPLIT la page : l'app se met en page à 100 % de
         hauteur (classe .nova-full), pas de mise à l'échelle. */
      try {
        current.contentDocument.documentElement.classList.add("nova-full");
      } catch (e) {}
      current.style.transform = "";
      current.style.width = w + "px";
      current.style.height = h + "px";
    } else {
      /* Carte (ou repository très étroit) : mise à l'échelle pour tenir. */
      try {
        current.contentDocument.documentElement.classList.remove("nova-full");
      } catch (e) {}
      current.style.height = "";
      scaleFrame(current, w, h);
    }
  }

  /* Une iframe plein écran par encart, créée à la première ouverture puis
     réutilisée (jamais rechargée ensuite). */
  function ensureFrame(encart) {
    if (encart._lbFrame) return encart._lbFrame;
    var src = encart.querySelector(".encart-frame");
    var f = document.createElement("iframe");
    f.className = "encart-frame";
    f.setAttribute("src", src.getAttribute("src"));
    if (src.getAttribute("title")) f.setAttribute("title", src.getAttribute("title"));
    f.hidden = true;
    f.addEventListener("load", function () {
      blankLinks(f);
      fitFullscreen();
    });
    overlay.insertBefore(f, closeBtn);
    encart._lbFrame = f;
    return f;
  }

  function open(encart, from) {
    if (!overlay) build();
    var frame = ensureFrame(encart);
    if (current && current !== frame) current.hidden = true;
    current = frame;
    frame.hidden = false;
    opener = from || null;
    overlay.hidden = false;
    document.body.classList.add("bilan-lock");
    if (fsObserver) fsObserver.disconnect();
    fsObserver = watchHeight(frame, fitFullscreen);
    fitFullscreen();
    closeBtn.focus();
  }

  function close() {
    if (!current) return;
    if (fsObserver) {
      fsObserver.disconnect();
      fsObserver = null;
    }
    current.hidden = true; /* on garde l'iframe vivante pour la réutiliser */
    current = null;
    overlay.hidden = true;
    document.body.classList.remove("bilan-lock");
    if (opener && opener.focus) opener.focus();
  }

  /* ---- Mise en place ----------------------------------------------------- */
  window.addEventListener("resize", function () {
    Array.prototype.forEach.call(encarts, fitApercu);
    fitFullscreen();
  });

  Array.prototype.forEach.call(encarts, function (encart) {
    encart.classList.add("encart-apercu");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "encart-zoom";
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5 M20 9V4h-5 M4 15v5h5 M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> Voir en grand';
    btn.addEventListener("click", function () {
      open(encart, btn);
    });
    encart.appendChild(btn);

    var frame = encart.querySelector(".encart-frame");
    if (frame) {
      frame.addEventListener("load", function () {
        blankLinks(frame);
        fitApercu(encart);
      });
      watchHeight(frame, function () {
        fitApercu(encart);
      });
      blankLinks(frame);
      fitApercu(encart);
    }
  });
})();
