/* Agrandissement des figures : au clic, l'image s'ouvre dans une lightbox
   centrée sur fond noir, à sa définition réelle (jamais étirée). Clic à côté,
   Échap, ou le bouton rond en bas ferment. Le HTML n'a pas besoin d'être
   modifié : le script enveloppe chaque <img> d'un .figure dans un bouton. */
(function () {
  "use strict";

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var overlay, imgEl, closeBtn, opener;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "fig-lb";
    overlay.hidden = true;

    var backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "fig-lb-backdrop";
    backdrop.setAttribute("aria-label", "Fermer");

    imgEl = document.createElement("img");
    imgEl.className = "fig-lb-img";
    imgEl.alt = "";

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "don-close-btn fig-lb-close";
    closeBtn.setAttribute("aria-label", "Fermer");
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7 L17 17 M17 7 L7 17"/></svg>';

    overlay.appendChild(backdrop);
    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    backdrop.addEventListener("click", close);
    closeBtn.addEventListener("click", pressClose);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function open(img, from) {
    if (!overlay) build();
    opener = from || null;
    imgEl.src = img.currentSrc || img.src;
    var ss = img.getAttribute("srcset");
    if (ss) imgEl.setAttribute("srcset", ss);
    else imgEl.removeAttribute("srcset");
    var sz = img.getAttribute("sizes");
    if (sz) imgEl.setAttribute("sizes", sz);
    else imgEl.removeAttribute("sizes");
    imgEl.alt = img.alt || "";
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (opener && opener.focus) opener.focus();
  }

  function pressClose() {
    if (reduce) {
      close();
      return;
    }
    closeBtn.classList.remove("is-pressed");
    void closeBtn.offsetWidth;
    closeBtn.classList.add("is-pressed");
    setTimeout(function () {
      closeBtn.classList.remove("is-pressed");
      close();
    }, 150);
  }

  function init() {
    var imgs = document.querySelectorAll(".figure > img");
    if (!imgs.length) return;
    Array.prototype.forEach.call(imgs, function (img) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fig-btn";
      btn.setAttribute("aria-label", "Agrandir l'image");
      img.parentNode.insertBefore(btn, img);
      btn.appendChild(img);
      btn.addEventListener("click", function () {
        open(img, btn);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
