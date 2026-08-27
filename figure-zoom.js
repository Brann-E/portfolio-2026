/* Agrandissement des figures au clic.
   Aucune modification du HTML n'est nécessaire : le script enveloppe lui-même
   chaque <img> contenue dans un .figure par un <button>, et calcule au clic
   la largeur réellement disponible dans le conteneur de la page. */
(function () {
  var SEUIL = 900; // sous cette largeur l'image occupe déjà toute la place
  var ouvert = null;

  function conteneur(fig) {
    return fig.closest('.wrap') || fig.closest('main') || document.body;
  }

  function ouvrir(fig, btn) {
    var cible = conteneur(fig);
    var rc = cible.getBoundingClientRect();
    var cs = getComputedStyle(cible);
    // bord intérieur du conteneur (on reste dans ses marges de page)
    var gauche = rc.left + parseFloat(cs.paddingLeft);
    var droite = rc.right - parseFloat(cs.paddingRight);
    var rf = fig.getBoundingClientRect();

    fig.style.marginLeft = Math.min(0, gauche - rf.left) + 'px';
    fig.style.marginRight = Math.min(0, rf.right - droite) + 'px';
    fig.classList.add('is-zoomed');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', "Réduire l'image");
    ouvert = { fig: fig, btn: btn };
  }

  function fermer() {
    if (!ouvert) return;
    ouvert.fig.style.marginLeft = '';
    ouvert.fig.style.marginRight = '';
    ouvert.fig.classList.remove('is-zoomed');
    ouvert.btn.setAttribute('aria-expanded', 'false');
    ouvert.btn.setAttribute('aria-label', "Agrandir l'image");
    ouvert = null;
  }

  function init() {
    var imgs = document.querySelectorAll('.figure > img');
    if (!imgs.length) return;

    Array.prototype.forEach.call(imgs, function (img) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fig-btn';
      btn.setAttribute('aria-label', "Agrandir l'image");
      btn.setAttribute('aria-expanded', 'false');
      img.parentNode.insertBefore(btn, img);
      btn.appendChild(img);

      btn.addEventListener('click', function () {
        var fig = btn.closest('.figure');
        if (ouvert && ouvert.fig === fig) { fermer(); return; }
        fermer();
        if (window.innerWidth < SEUIL) return;
        ouvrir(fig, btn);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fermer();
    });
    window.addEventListener('resize', fermer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
