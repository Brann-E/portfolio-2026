/* Contact — la machine à dons.
   La page donne d'abord, sans condition : on tire des cartes à l'infini.
   Le contre-don (le formulaire) reste facultatif, plus bas. */
(function () {
  "use strict";

  var G =
    '<svg viewBox="0 0 48 48" fill="none" stroke="url(#donGrad)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
  var Gd = 'fill="url(#donGrad)" stroke="none"';

  var dons = [
    {
      origine: "Côte nord-ouest de l'Amérique",
      nom: "Le potlatch",
      savoir:
        "Chez ces peuples, on assoit son rang non en accumulant, mais en donnant — parfois en détruisant publiquement plus de biens que ses rivaux. Le prestige va au plus généreux, pas au plus riche.",
      lecon: "Le don est une puissance, pas une perte.",
      lien: "https://fr.wikipedia.org/wiki/Potlatch",
      svg: G + '<path d="M6 20 q6 -8 12 0 t12 0 t12 0"/><path d="M6 30 q6 -8 12 0 t12 0 t12 0"/></svg>'
    },
    {
      origine: "Îles Trobriand, Mélanésie",
      nom: "La kula",
      savoir:
        "Des colliers et des bracelets de coquillages, sans usage ni valeur marchande, circulent d'île en île sur des milliers de kilomètres. On ne les garde jamais : les posséder, c'est les faire passer, en nouant au passage des alliances à vie.",
      lecon: "On ne possède pas un lien. On le fait circuler.",
      lien: "https://fr.wikipedia.org/wiki/Kula_(Nouvelle-Guin%C3%A9e)",
      svg:
        G +
        '<circle cx="24" cy="24" r="13"/><circle cx="24" cy="11" r="2.2" ' + Gd + '/><circle cx="37" cy="24" r="2.2" ' + Gd + '/><circle cx="24" cy="37" r="2.2" ' + Gd + '/><circle cx="11" cy="24" r="2.2" ' + Gd + '/></svg>'
    },
    {
      origine: "Culture maorie, Nouvelle-Zélande",
      nom: "Le hau",
      savoir:
        "Les Maoris disent que la chose donnée contient le hau, l'esprit du donneur, qui cherche toujours à retourner à son origine. C'est ce souffle, attaché à l'objet, qui oblige celui qui reçoit à rendre.",
      lecon: "Ce qu'on te donne garde en lui une part de celui qui a donné.",
      lien: "https://fr.wikipedia.org/wiki/Hau_(cadeau)",
      svg:
        G +
        '<path d="M24 24 C24 21 27 21 27 24 C27 29 20 29 20 23 C20 16 30 16 30 24 C30 33 16 33 15 24"/></svg>'
    },
    {
      origine: "Melpa, Papouasie–Nouvelle-Guinée",
      nom: "Le moka",
      savoir:
        "On y gagne en importance non par ce qu'on possède, mais par ce qu'on distribue. Offrir plus qu'on ne peut recevoir en retour place l'autre en dette — et fait de soi un « grand homme ».",
      lecon: "Le prestige se mesure à ce qu'on a donné, jamais à ce qu'on garde.",
      lien: "https://fr.wikipedia.org/wiki/Moka_(anthropologie)",
      svg: G + '<path d="M24 38 V12"/><path d="M15 21 L24 11 L33 21"/></svg>'
    },
    {
      origine: "Monde indien",
      nom: "Le dāna",
      savoir:
        "Le don rituel désintéressé, sans attente de retour, est tenu pour une élévation de celui qui donne. Donner purifie et libère — c'est un acte spirituel autant que social.",
      lecon: "Donner sans attendre n'est pas s'appauvrir : c'est s'élever.",
      lien: "https://fr.wikipedia.org/wiki/D%C4%81na",
      svg:
        G +
        '<path d="M24 36 C16 28 16 18 24 12 C32 18 32 28 24 36 Z"/><path d="M24 35 C18 32 13 28 12 21 C19 21 23 27 24 33"/><path d="M24 35 C30 32 35 28 36 21 C29 21 25 27 24 33"/></svg>'
    },
    {
      origine: "Droit germanique médiéval",
      nom: "La Morgengabe",
      savoir:
        "Le « don du matin » était remis à l'épouse au lendemain des noces, devant témoins. Sa valeur dépassait de loin ce que la coutume exigeait : le lien se scellait par un excès, non par un juste échange.",
      lecon: "Un lien se scelle par ce qu'on donne en trop, pas par ce qu'on doit.",
      lien: "https://fr.wikipedia.org/wiki/Morgengabe",
      svg:
        G +
        '<line x1="8" y1="34" x2="40" y2="34"/><path d="M14 34 a10 10 0 0 1 20 0"/><line x1="24" y1="12" x2="24" y2="16"/><line x1="12.5" y1="19" x2="15" y2="21.5"/><line x1="35.5" y1="19" x2="33" y2="21.5"/></svg>'
    },
    {
      origine: "Droit romain & germanique ancien",
      nom: "Le nexum & le wadium",
      savoir:
        "Bien avant nos contrats, un objet transmis suffisait à lier durablement deux personnes. Le gage n'était pas une garantie matérielle : il portait une part de celui qui l'engageait. Nos contrats descendent, à la lettre, d'un geste de don.",
      lecon: "Nos contrats sont d'anciens dons qui ont oublié leur origine.",
      lien: "https://fr.wikipedia.org/wiki/Nexum",
      svg:
        G +
        '<rect x="9" y="18" width="17" height="12" rx="6"/><rect x="22" y="18" width="17" height="12" rx="6"/></svg>'
    },
    {
      origine: "Alain Caillé & le MAUSS",
      nom: "L'endettement mutuel positif",
      savoir:
        "Le contre-don n'égale jamais le don — il diffère toujours, par le moment, la nature ou la valeur. Cette dette jamais tout à fait soldée est précisément ce qui donne envie de se revoir.",
      lecon: "Une relation qu'on solde est une relation qui se termine.",
      lien: "https://fr.wikipedia.org/wiki/Mouvement_anti-utilitariste_dans_les_sciences_sociales",
      svg:
        G +
        '<path d="M13 31 C11 20 21 16 26 23"/><path d="M22 19.5 L26.5 22.5 L23 27"/><path d="M35 17 C37 28 27 32 22 25"/><path d="M26 28.5 L21.5 25.5 L25 21"/></svg>'
    },
    {
      origine: "Marcel Mauss, Essai sur le don (1925)",
      nom: "Le lien avant le bien",
      savoir:
        "Dans le don, ce qui compte n'est jamais l'objet transmis — c'est la relation qu'il ouvre, entretient ou répare. On croit échanger des choses ; on échange des liens.",
      lecon: "Ce n'est jamais le bien qui compte. C'est le lien qu'il noue.",
      lien: "https://fr.wikipedia.org/wiki/Essai_sur_le_don",
      svg:
        G +
        '<circle cx="12" cy="31" r="3" ' + Gd + '/><circle cx="36" cy="17" r="3" ' + Gd + '/><path d="M14 29 C22 21 26 27 34 19"/></svg>'
    },
    {
      origine: "Alain Caillé",
      nom: "L'inconditionnalité conditionnelle",
      savoir:
        "Tout lien vivant commence par un pari sans garantie — on donne d'abord, on fait confiance avant preuve. Mais ce pari ne tient dans la durée que s'il est, parfois, honoré en retour. On s'ouvre sans condition ; on se protège avec quelques-unes.",
      lecon: "On donne d'abord sans condition. On dure à quelques conditions.",
      lien: "https://fr.wikipedia.org/wiki/Alain_Caill%C3%A9",
      svg:
        G +
        '<rect x="11" y="12" width="14" height="24"/><path d="M25 13 L35 17 V31 L25 35"/><circle cx="28" cy="24" r="1.1" ' + Gd + '/></svg>'
    },
    {
      origine: "Régis Debray, médiologie",
      nom: "Communiquer n'est pas transmettre",
      savoir:
        "Communiquer, c'est transporter une information dans l'espace, vite et large. Transmettre, c'est faire durer une chose dans le temps, à travers les gens. La plupart des outils font passer un message ; rares sont ceux qui font tenir un lien.",
      lecon: "Faire passer un message est facile. Faire durer un lien est un métier.",
      lien: "https://fr.wikipedia.org/wiki/M%C3%A9diologie",
      svg:
        G +
        '<circle cx="24" cy="31" r="2.6" ' + Gd + '/><path d="M17 27 a10 10 0 0 1 14 0"/><path d="M13 23 a16 16 0 0 1 22 0"/></svg>'
    },
    {
      origine: "Michael Chwe, théorie des jeux",
      nom: "Le savoir commun",
      savoir:
        "Il ne suffit pas que chacun sache. Il faut que chacun sache que les autres savent — et le sache en cascade. C'est cette connaissance partagée, et non l'information seule, qui rend un groupe capable d'agir ensemble.",
      lecon: "Un groupe n'agit pas quand chacun sait. Il agit quand chacun sait que les autres savent.",
      lien: "https://fr.wikipedia.org/wiki/Connaissance_commune_(logique)",
      svg:
        G +
        '<circle cx="24" cy="24" r="2.6" ' + Gd + '/><circle cx="12" cy="14" r="2" ' + Gd + '/><circle cx="36" cy="14" r="2" ' + Gd + '/><circle cx="12" cy="34" r="2" ' + Gd + '/><circle cx="36" cy="34" r="2" ' + Gd + '/><path d="M13.5 15.5 L22 22.5 M34.5 15.5 L26 22.5 M13.5 32.5 L22 25.5 M34.5 32.5 L26 25.5"/></svg>'
    },
    {
      origine: "Une question",
      nom: "À vous, maintenant",
      savoir:
        "Dans votre organisation, qui donne quelque chose que personne ne compte — et que se passerait-il le jour où il s'arrête ?",
      lecon: "Ce qui n'est pas compté est souvent ce qui tient tout.",
      lien: "",
      svg:
        G +
        '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    },
    {
      origine: "Une question",
      nom: "À vous, encore",
      savoir:
        "Quand une information ne remonte jamais, cherchez l'oreille qui manque — pas le messager qui se tait.",
      lecon: "Le silence est rarement un défaut des gens. C'est un défaut de canal.",
      lien: "",
      svg:
        G +
        '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    }
  ];

  // familles → dos de carte (cf. spec) : anthropologie 1-7, auteurs 8-12, questions 13-14
  var FAMILLES = [
    "anthropologie", "anthropologie", "anthropologie", "anthropologie",
    "anthropologie", "anthropologie", "anthropologie",
    "auteurs", "auteurs", "auteurs", "auteurs", "auteurs",
    "questions", "questions"
  ];
  FAMILLES.forEach(function (f, i) {
    if (dons[i]) dons[i].famille = f;
  });

  // symbole du dos, propre à chaque famille (trait fin holographique, statique)
  var svgOpen =
    '<svg viewBox="0 0 48 48" fill="none" stroke="url(#donGrad)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
  var BACKS = {
    // l'origine qui rayonne : cercles concentriques
    anthropologie:
      svgOpen +
      '<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="8"/><circle cx="24" cy="24" r="2.2" fill="url(#donGrad)" stroke="none"/></svg>',
    // la pensée bâtie : polygone régulier tracé au complet (arêtes)
    auteurs:
      svgOpen +
      '<path d="M24 9 L37 16.5 L37 31.5 L24 39 L11 31.5 L11 16.5 Z"/></svg>',
    // la pensée en construction : les sommets du même polygone, sans arêtes
    concepts:
      '<svg viewBox="0 0 48 48" fill="url(#donGrad)" stroke="none">' +
      '<circle cx="24" cy="9" r="1.9"/><circle cx="37" cy="16.5" r="1.9"/><circle cx="37" cy="31.5" r="1.9"/><circle cx="24" cy="39" r="1.9"/><circle cx="11" cy="31.5" r="1.9"/><circle cx="11" cy="16.5" r="1.9"/></svg>',
    // l'adresse ouverte : un simple demi-arc
    questions: svgOpen + '<path d="M9 25 A15 15 0 0 1 39 25"/></svg>'
  };
  function backFor(d) {
    return BACKS[d && d.famille] || BACKS.anthropologie;
  }
  var N = 6; // cartes affichées (sur 14 dons) — « une nouvelle donne » redistribue
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var grid = document.getElementById("don-grid");
  var modal = document.getElementById("don-modal");
  if (!grid || !modal) return;

  var elGlyph = document.getElementById("don-glyph");
  var elOrigine = document.getElementById("don-origine");
  var elNom = document.getElementById("don-nom");
  var elSavoir = document.getElementById("don-savoir");
  var elLecon = document.getElementById("don-lecon");
  var elLien = document.getElementById("don-lien");
  var btnClose = document.getElementById("don-close");
  var backdrop = document.getElementById("don-backdrop");
  var note = document.getElementById("don-note");

  var cells = []; // { flip, glyph, nom, lecon, more, don }
  var flips = 0;
  var opener = null;

  function shuffled() {
    var a = [];
    for (var i = 0; i < dons.length; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = a[j];
      a[j] = a[k];
      a[k] = t;
    }
    return a;
  }

  function buildGrid() {
    grid.innerHTML = "";
    cells = [];
    for (var i = 0; i < N; i++) {
      var cell = document.createElement("div");
      cell.className = "don-cell";
      // respiration propre à chaque carte : durée et phase désynchronisées
      cell.style.setProperty("--bd", (6 + Math.random() * 3.5).toFixed(2) + "s");
      cell.style.setProperty("--bdelay", (-Math.random() * 9).toFixed(2) + "s");
      cell.innerHTML =
        '<div class="don-flip" role="button" tabindex="0" aria-label="Retourner la carte">' +
        '<div class="don-flip-inner">' +
        '<div class="don-face don-face--back don-holo"><span class="don-seal"></span></div>' +
        '<div class="don-face don-face--front don-holo">' +
        '<div class="don-fglyph" aria-hidden="true"></div>' +
        '<div class="don-fnom"></div>' +
        '<div class="don-flecon"></div>' +
        '<button class="don-plus" type="button" tabindex="-1" aria-label="En savoir plus"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7 V17 M7 12 H17"/></svg></button>' +
        "</div></div></div>";
      grid.appendChild(cell);
      var rec = {
        flip: cell.querySelector(".don-flip"),
        inner: cell.querySelector(".don-flip-inner"),
        seal: cell.querySelector(".don-seal"),
        glyph: cell.querySelector(".don-fglyph"),
        nom: cell.querySelector(".don-fnom"),
        lecon: cell.querySelector(".don-flecon"),
        more: cell.querySelector(".don-plus"),
        don: null
      };
      cells.push(rec);
      bindCell(rec);
    }
  }

  function bindCell(rec) {
    rec.flip.addEventListener("click", function () {
      toggle(rec);
    });
    rec.flip.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(rec);
      }
    });
    rec.more.addEventListener("click", function (e) {
      e.stopPropagation();
      openModal(rec.don, rec.more);
    });
  }

  function toggle(rec) {
    var flipped = rec.flip.classList.toggle("is-flipped");
    rec.more.tabIndex = flipped ? 0 : -1;
    if (flipped) {
      flips++;
      if (flips >= 3) revealNote();
    }
  }

function revealNote() {
    if (!note || !note.hidden) return;
    note.innerHTML =
      "<b></b>";
    note.hidden = false;
    // laisse le navigateur enregistrer l'état avant de déclencher la transition
    requestAnimationFrame(function () {
      note.classList.add("is-shown");
    });
  }

  function deal() {
    var order = shuffled();
    for (var i = 0; i < cells.length; i++) {
      var d = dons[order[i]];
      var rec = cells[i];
      rec.don = d;
      rec.seal.innerHTML = backFor(d);
      rec.glyph.innerHTML = d.svg;
      rec.nom.textContent = d.nom;
      rec.lecon.textContent = d.lecon;
    }
  }

  var dealing = false;
  function reshuffle() {
    if (dealing) return;
    flips = 0;
    if (note) {
      note.classList.remove("is-shown");
      note.hidden = true;
    }

    if (reduce) {
      cells.forEach(function (rec) {
        rec.flip.classList.remove("is-flipped");
        rec.more.tabIndex = -1;
      });
      deal();
      return;
    }

    dealing = true;
    var step = 0.075; // décalage de la vague, en secondes, de gauche à droite
    cells.forEach(function (rec, i) {
      var d = i * step;
      rec.flip.style.setProperty("--wd", d + "s");
      // relance l'animation même si elle vient de tourner
      rec.flip.classList.remove("is-waving");
      rec.inner.classList.remove("is-dealing");
      void rec.flip.offsetWidth;
      rec.flip.classList.add("is-waving");
      rec.inner.classList.add("is-dealing");
    });

    // à mi-parcours (cartes de dos pendant le flip), on redistribue en douce
    setTimeout(function () {
      cells.forEach(function (rec) {
        rec.flip.classList.remove("is-flipped");
        rec.more.tabIndex = -1;
      });
      deal();
    }, 300);

    // fin de la vague : on nettoie les classes d'animation
    var total = (N - 1) * step * 1000 + 640;
    setTimeout(function () {
      cells.forEach(function (rec) {
        rec.flip.classList.remove("is-waving");
        rec.inner.classList.remove("is-dealing");
        rec.flip.style.removeProperty("--wd");
      });
      dealing = false;
    }, total);
  }

  /* --- la modale (le don en entier) ------------------------------------ */
  function openModal(d, from) {
    if (!d) return;
    opener = from || null;
    elGlyph.innerHTML = d.svg;
    elOrigine.textContent = d.origine;
    elNom.textContent = d.nom;
    elSavoir.textContent = d.savoir;
    elLecon.textContent = d.lecon;
    if (d.lien) {
      elLien.href = d.lien;
      elLien.hidden = false;
    } else {
      elLien.hidden = true;
      elLien.removeAttribute("href");
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    btnClose.focus();
    document.addEventListener("keydown", onKey);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (opener && opener.focus) opener.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") closeModal();
  }

  btnClose.addEventListener("click", function () {
    if (reduce) {
      closeModal();
      return;
    }
    // petite pulsation « clic » avant de fermer (retour visuel)
    btnClose.classList.remove("is-pressed");
    void btnClose.offsetWidth;
    btnClose.classList.add("is-pressed");
    setTimeout(function () {
      btnClose.classList.remove("is-pressed");
      closeModal();
    }, 150);
  });
  backdrop.addEventListener("click", closeModal);

  var btnReshuffle = document.getElementById("don-reshuffle");
  if (btnReshuffle) btnReshuffle.addEventListener("click", reshuffle);

  buildGrid();
  deal();

  /* --- le contre-don : envoi via Formspree (sans quitter la page) -------
     Tant que l'identifiant n'est pas renseigné dans l'attribut action du
     formulaire (VOTRE_ID), on retombe proprement sur le client mail. */
  var form = document.getElementById("don-form");
  var status = document.getElementById("don-status");

  function setStatus(msg, isErr) {
    if (!status) return;
    if (!msg) {
      status.hidden = true;
      status.textContent = "";
      return;
    }
    status.textContent = msg;
    status.classList.toggle("is-error", !!isErr);
    status.hidden = false;
  }

  function mailtoFallback() {
    var nom = (form.nom.value || "").trim();
    var email = (form.email.value || "").trim();
    var msg = (form.message.value || "").trim();
    var sujet = "Un contre-don" + (nom ? " — " + nom : "");
    var corps =
      (msg || "") + "\n\n— " + (nom || "") + (email ? " (" + email + ")" : "");
    window.location.href =
      "mailto:brann.etienne@gmail.com?subject=" +
      encodeURIComponent(sujet) +
      "&body=" +
      encodeURIComponent(corps);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // validation : rien ne part si nom / email / message manquent ou si
      // l'email est mal formé (espaces seuls compris → on trim)
      var nomV = (form.nom.value || "").trim();
      var emailV = (form.email.value || "").trim();
      var msgV = (form.message.value || "").trim();
      form.nom.value = nomV;
      form.email.value = emailV;
      form.message.value = msgV;
      if (!nomV || !emailV || !msgV || !form.checkValidity()) {
        if (typeof form.reportValidity === "function") form.reportValidity();
        setStatus(
          "Merci de renseigner votre nom, un email valide et un message.",
          true
        );
        return;
      }

      var endpoint = form.getAttribute("action") || "";
      if (!endpoint || endpoint.indexOf("VOTRE_ID") !== -1) {
        mailtoFallback(); // Formspree pas encore configuré
        return;
      }
      var btn = form.querySelector(".don-submit");
      var labelEl = btn.querySelector(".don-submit-t") || btn;
      var label = labelEl.textContent;
      btn.disabled = true;
      labelEl.textContent = "Envoi…";
      setStatus("", false);
      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            setStatus(
              "Merci — votre message est parti. Je vous réponds vite.",
              false
            );
          } else {
            throw new Error("send failed");
          }
        })
        .catch(function () {
          setStatus(
            "L'envoi a échoué. Écrivez-moi directement à brann.etienne@gmail.com.",
            true
          );
        })
        .then(function () {
          btn.disabled = false;
          labelEl.textContent = label;
        });
    });
  }
})();
