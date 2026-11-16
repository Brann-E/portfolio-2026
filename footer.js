/* ------------------------------------------------------------------
   Footer partagé - SOURCE UNIQUE du footer, pour toutes les pages.
   Pour modifier le footer partout : éditer le HTML ci-dessous (entre backticks).

   Livré par SCRIPT (et non par fetch d'un .html) : fonctionne dans TOUS les
   contextes - site en ligne (Statichost), Live Server, et même en ouvrant le
   .html en local (file://). Chaque page ne contient qu'un
   <div id="site-footer"></div> que ce script remplace.
------------------------------------------------------------------ */
(function () {
  "use strict";

  var HTML = `<footer class="pied">
  <div class="pied-in page">
    <div class="pied-grille c-12">
      <div>
        <p class="pied-nom">Brann Etienne<span>Product designer<br>Design strategist</span></p>
        <p>12 ans de produit, de design,<br>et de stratégie.</p>
        <p class="lieu">📍 Lyon, à distance et sur site</p>
      </div>
      <div>
        <h4>Me retrouver</h4>
        <ul>
          <li><a href="https://www.linkedin.com/in/brann-etienne" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="https://github.com/Brann-E" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="cv-brann-etienne.pdf">Mon CV</a></li>
        </ul>
      </div>
      <div>
        <h4><a href="index.html#cas">Études de cas</a></h4>
        <ul>
          <li><a href="cas-healthanea.html">Healthanea</a></li>
          <li><a href="cas-shift-prime.html">SHIFT Prime</a></li>
          <li><a href="cas-bi-solution.html">B.I Solution</a></li>
          <li><a href="cas-proshop.html">Proshop</a></li>
          <li><a href="cas-chalon-dans-la-rue.html">Chalon dans la rue</a></li>
        </ul>
      </div>
      <div>
        <h4>Pour aller plus loin</h4>
        <ul>
          <li><a href="parcours-interactif.html">Regarder autrement</a></li>
          <li><a href="circulation-paradigme-du-design.html">La circulation, paradigme du design</a></li>
          <li><a href="reciprocites.html">Les Réciprocités</a></li>
        </ul>
      </div>
    </div>
    <div class="pied-bas c-12 sp-3"><a href="mentions-legales.html">Mentions légales</a><a href="#top">Retour en haut ↑</a><span>© 2026 Brann Etienne</span></div>
  </div>
</footer>`;

  function inject() {
    var mount = document.getElementById("site-footer");
    if (mount) mount.outerHTML = HTML;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
