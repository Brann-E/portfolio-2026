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

  var HTML = `<footer class="ft">
  <div class="ft-inner">

    <div class="ft-top">

      <div class="ft-sign">
        <div class="ft-mark">
          <img src="assets/logo_256.png" alt="" aria-hidden="true">
          <div>
            <div class="ft-ligne">
              <div class="ft-name">Brann Etienne</div>
              <div class="ft-role2"><em>Designer relationnel</em></div>
            </div>
            <div class="ft-role3">Concepteur de dispositifs relationnels&nbsp;: outils, parcours et fa&ccedil;ons de travailler ensemble</div>
          </div>
        </div>
        <div class="ft-place"><svg class="ft-pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg><span class="ft-ville">Lyon</span><span>&middot; en remote et sur site</span></div>
        <div class="ft-social">
          <a href="https://www.linkedin.com/in/brann-etienne" target="_blank" rel="noopener"><svg class="ft-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg><span class="ft-social-txt">LinkedIn</span></a>
          <a href="https://medium.com/@brann.etienne" target="_blank" rel="noopener"><svg class="ft-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg><span class="ft-social-txt">Medium</span></a>
        </div>
      </div>

      <nav class="ft-cols" aria-label="Plan du site">

        <div class="ft-col ft-cases">
          <div class="ft-h">Les cas</div>
          <ul>
            <li style="--d:var(--c1)"><a href="/cas-healthanea">Healthanea <span class="ft-tag">Sant&eacute;</span></a></li>
            <li style="--d:var(--c2)"><a href="/cas-shift-prime">SHIFT Prime <span class="ft-tag">Industrie</span></a></li>
            <li style="--d:var(--c4)"><a href="/cas-bi-solution">B.I Solution <span class="ft-tag">Data</span></a></li>
            <li style="--d:var(--c3)"><a href="/cas-proshop">Proshop &amp; Beyond <span class="ft-tag">Commerce</span></a></li>
            <li style="--d:var(--c5)"><span class="ft-soon">TiBillet <span class="ft-tag">Bient&ocirc;t</span></span></li>
          </ul>
          <a class="ft-more" href="/etudes-de-cas">Tous les cas <span aria-hidden="true">&rarr;</span></a>
        </div>

        <div class="ft-col">
          <div class="ft-h">La s&eacute;rie</div>
          <ul class="ft-num">
            <li style="--d:var(--c1)"><a href="/01-rien-ne-tient-tout-seul"><b>01</b> Rien ne tient tout seul</a></li>
            <li style="--d:var(--c2)"><a href="/02-les-relations-ne-se-voient-que-dun-certain-endroit"><b>02</b> Les relations ne se voient pas</a></li>
            <li style="--d:var(--c3)"><a href="/03-la-metaliminalite"><b>03</b> La m&eacute;taliminalit&eacute;</a></li>
            <li style="--d:var(--c4)"><a href="/04-le-lien-importe-plus-que-le-bien"><b>04</b> Le lien importe plus que le bien</a></li>
            <li style="--d:var(--c5)"><a href="/05-ce-qui-ne-circule-plus-casse"><b>05</b> Ce qui ne circule plus casse</a></li>
            <li style="--d:var(--c1)"><a href="/06-ce-qui-fait-circuler"><b>06</b> Ce qui fait circuler</a></li>
          </ul>
          <a class="ft-more" href="/circulation-paradigme-du-design">La s&eacute;rie compl&egrave;te <span aria-hidden="true">&rarr;</span></a>
        </div>

        <div class="ft-col">
          <div class="ft-h">Ailleurs</div>
          <ul>
            <li><a href="/parcours-interactif">Le parcours</a></li>
            <li><a href="/la-pratique">La pratique</a></li>
            <li><a href="/circulation-paradigme-du-design">La th&eacute;orie</a></li>
            <li><a href="/explorations">Explorations</a></li>
            <li><a href="/a-propos">&Agrave; propos</a></li>
          </ul>
          <a class="ft-pill" href="/contact"><span class="holo"></span><span class="holo-label">Contact</span></a>
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
