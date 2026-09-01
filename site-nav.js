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

/* ------------------------------------------------------------------
   Effet holographique — reprise exacte du bouton « Et si…? ».
   Point clé : l'écoute se fait sur un GRAND conteneur (ici la page),
   pas sur l'élément lui-même. La position du pointeur est normalisée
   sur ce conteneur, puis écrite dans --px / --py de chaque élément.
   C'est ce qui fait que le fond bouge quand on déplace la souris
   n'importe où, et pas seulement en survolant le bouton.
   Contrairement à la référence, on ne pilote PAS --tiltx / --tilty :
   aucune inclinaison.
   ------------------------------------------------------------------ */
(function () {
  const hotes = [...document.querySelectorAll('.holo')]
    .map(function (h) { return h.parentElement; })
    .filter(Boolean);
  if (!hotes.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let px = '50%', py = '50%', enAttente = false;

  function appliquer() {
    enAttente = false;
    for (const h of hotes) {
      h.style.setProperty('--px', px);
      h.style.setProperty('--py', py);
    }
  }

  addEventListener('pointermove', function (e) {
    const nx = Math.max(0, Math.min(1, e.clientX / innerWidth));
    const ny = Math.max(0, Math.min(1, e.clientY / innerHeight));
    px = (nx * 100).toFixed(1) + '%';
    py = (ny * 100).toFixed(1) + '%';
    if (!enAttente) { enAttente = true; requestAnimationFrame(appliquer); }
  }, { passive: true });
})();
