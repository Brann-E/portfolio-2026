/* ------------------------------------------------------------------
   Footer partagé — SOURCE UNIQUE du footer, pour toutes les pages.
   Pour modifier le footer partout : éditer le HTML ci-dessous (entre backticks).

   Livré par SCRIPT (et non par fetch d'un .html) : fonctionne dans TOUS les
   contextes — site en ligne (Statichost), Live Server, et même en ouvrant le
   .html en local (file://). Chaque page ne contient qu'un
   <div id="site-footer"></div> que ce script remplace.
------------------------------------------------------------------ */
(function () {
  "use strict";

  var HTML = `<footer class="ft">
  <div class="ft-inner">

    <div class="ft-top">

      <div class="ft-sign">
        <div class="ft-mark">
          <img src="assets/logo_256.png" alt="" aria-hidden="true">
          <div>
            <div class="ft-name">Brann Etienne</div>
            <div class="ft-role">Designer relationnel</div>
            <div class="ft-role3">Concepteur de dispositifs num&eacute;riques, organisationnels et m&eacute;thodologiques</div>
          </div>
        </div>
        <p class="ft-claim">&Agrave; toutes les &eacute;chelles, tout tient par <em>le m&ecirc;me fil</em>.</p>
        <div class="ft-place">Lyon &middot; en remote et sur site</div>
      </div>

      <nav class="ft-cols" aria-label="Plan du site">

        <div class="ft-col ft-cases">
          <div class="ft-h">Les cas</div>
          <ul>
            <li style="--d:var(--c1)"><a href="cas-axa.html">Healthanea <span class="ft-tag">Sant&eacute;</span></a></li>
            <li style="--d:var(--c2)"><a href="cas-shift-prime.html">SHIFT Prime <span class="ft-tag">Industrie</span></a></li>
            <li style="--d:var(--c4)"><a href="cas-bi-solution.html">B.I Solution <span class="ft-tag">Data</span></a></li>
            <li style="--d:var(--c3)"><a href="cas-proshop.html">Proshop &amp; Beyond <span class="ft-tag">Commerce</span></a></li>
            <li style="--d:var(--c5)"><span class="ft-soon">TiBillet <span class="ft-tag">Bient&ocirc;t</span></span></li>
          </ul>
          <a class="ft-more" href="etudes-de-cas.html">Tous les cas <span aria-hidden="true">&rarr;</span></a>
        </div>

        <div class="ft-col">
          <div class="ft-h">La s&eacute;rie</div>
          <ul class="ft-num">
            <li style="--d:var(--c1)"><a href="rien-ne-tient-tout-seul.html"><b>01</b> Rien ne tient tout seul</a></li>
            <li style="--d:var(--c2)"><a href="les-relations-ne-se-voient-que-dun-certain-endroit.html"><b>02</b> Les relations ne se voient pas</a></li>
            <li style="--d:var(--c3)"><a href="la-metaliminalite.html"><b>03</b> La m&eacute;taliminalit&eacute;</a></li>
            <li style="--d:var(--c4)"><a href="le-lien-importe-plus-que-le-bien.html"><b>04</b> Le lien importe plus que le bien</a></li>
            <li style="--d:var(--c5)"><a href="ce-qui-ne-circule-plus-casse.html"><b>05</b> Ce qui ne circule plus casse</a></li>
            <li style="--d:var(--c1)"><a href="ce-qui-fait-circuler.html"><b>06</b> Ce qui fait circuler</a></li>
          </ul>
          <a class="ft-more" href="circulation-paradigme-du-design.html">La s&eacute;rie compl&egrave;te <span aria-hidden="true">&rarr;</span></a>
        </div>

        <div class="ft-col">
          <div class="ft-h">Ailleurs</div>
          <ul>
            <li><a href="parcours-interactif.html">Le parcours</a></li>
            <li><a href="la-pratique.html">La pratique</a></li>
            <li><a href="circulation-paradigme-du-design.html">La th&eacute;orie</a></li>
            <li><a href="explorations.html">Explorations</a></li>
            <li><a href="a-propos.html">&Agrave; propos</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
          <a class="ft-more ft-mail" href="mailto:brann.etienne@gmail.com">brann.etienne@gmail.com</a>
        </div>

      </nav>
    </div>

    <div class="ft-bottom">
      <span>&copy; 2026 Brann Etienne</span>
      <span class="ft-spectrum" aria-hidden="true"><i style="background:var(--c1)"></i><i style="background:var(--c2)"></i><i style="background:var(--c3)"></i><i style="background:var(--c5)"></i><i style="background:var(--c4)"></i></span>
      <a class="ft-up" href="#top">Retour en haut <span aria-hidden="true">&uarr;</span></a>
    </div>

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
