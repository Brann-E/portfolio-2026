/* Menu hamburger pour la navigation principale.
   Aucune modification du HTML n'est nécessaire : le bouton est créé ici.
   Il n'apparaît que sous le point de rupture défini en CSS (760 px) ;
   au-dessus, le menu reste affiché en ligne et le bouton est masqué. */
(function () {
  function init() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var links = nav.querySelector('.site-links');
    if (!links || nav.querySelector('.nav-toggle')) return;

    if (!links.id) links.id = 'site-links';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-label', 'Ouvrir le menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', links.id);
    btn.innerHTML = '<span class="nav-bars" aria-hidden="true"></span>';
    nav.appendChild(btn);

    function ouvrir(oui) {
      nav.classList.toggle('nav-open', oui);
      // le menu couvre la page : on bloque le défilement derrière
      document.body.classList.toggle('nav-locked', oui);
      btn.setAttribute('aria-expanded', oui ? 'true' : 'false');
      btn.setAttribute('aria-label', oui ? 'Fermer le menu' : 'Ouvrir le menu');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      ouvrir(!nav.classList.contains('nav-open'));
    });

    // un clic sur un lien referme
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) ouvrir(false);
    });

    // clic en dehors
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('nav-open') && !nav.contains(e.target)) ouvrir(false);
    });

    // touche Échap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
        ouvrir(false);
        btn.focus();
      }
    });

    // repasser en grand écran referme le panneau
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) ouvrir(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
