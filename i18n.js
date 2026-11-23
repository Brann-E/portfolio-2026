/* Textes de l'interface dans la langue de la page.
   Les pages anglaises (/en/) chargent d'abord i18n/en-js.js (le dictionnaire, généré par i18n/build_en.py à partir de i18n/en/js-*.json),
   puis ce fichier. Un script écrit ses textes en français et les passe par la fonction ci-dessous :
       var tr = window.t || function (s) { return s; };
       bouton.textContent = tr("Envoyer");
   En français, ou si la phrase n'est pas dans le dictionnaire, on garde le français : rien ne casse, et le contrôle de build_en.py liste les phrases manquantes. */
(function () {
  "use strict";
  var EN = document.documentElement.lang === "en";
  window.t = function (fr) {
    var d = window.I18N;
    return EN && d && Object.prototype.hasOwnProperty.call(d, fr) ? d[fr] : fr;
  };
})();
