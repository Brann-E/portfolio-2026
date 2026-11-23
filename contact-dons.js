/* Contact - la machine à dons.
   La page donne d'abord, sans condition : on tire des cartes à l'infini.
   Le contre-don (le formulaire) reste facultatif, plus bas. */
(function () {
  "use strict";

  var tr = window.t || function (s) { return s; };   // les textes de l'interface, dans la langue de la page (voir i18n.js)

  var G =
    '<svg viewBox="0 0 48 48" fill="none" stroke="url(#donGrad)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
  var Gd = 'fill="url(#donGrad)" stroke="none"';

  var dons = [
    {
      famille: "anthropologie",
      origine: "Côte nord-ouest de l'Amérique (Kwakiutl, Haïda)",
      nom: "Le potlatch",
      savoir:
        "Chez ces peuples, on assoit son rang non en accumulant, mais en donnant, parfois en détruisant publiquement plus de biens que ses rivaux. Le prestige va au plus généreux, pas au plus riche.",
      lecon: "Le don est une puissance, pas une perte.",
      lien: "https://fr.wikipedia.org/wiki/Potlatch",
      svg:
        G + '<path d="M6 20 q6 -8 12 0 t12 0 t12 0"/><path d="M6 30 q6 -8 12 0 t12 0 t12 0"/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Îles Trobriand, Mélanésie",
      nom: "La kula",
      savoir:
        "Des colliers et des bracelets de coquillages, sans usage ni valeur marchande, circulent d'île en île sur des milliers de kilomètres. On ne les garde jamais : les posséder, c'est les faire passer, en nouant au passage des alliances à vie.",
      lecon: "On ne possède pas un lien. On le fait circuler.",
      lien: "https://fr.wikipedia.org/wiki/Kula_(Nouvelle-Guin%C3%A9e)",
      svg:
        G + '<circle cx="24" cy="24" r="13"/><circle cx="24" cy="11" r="2.2" ' + Gd + '/><circle cx="37" cy="24" r="2.2" ' + Gd + '/><circle cx="24" cy="37" r="2.2" ' + Gd + '/><circle cx="11" cy="24" r="2.2" ' + Gd + '/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Culture maorie (Nouvelle-Zélande)",
      nom: "Le hau",
      savoir:
        "Les Maoris disent que la chose donnée contient le hau, le pouvoir spirituel du donneur, qui cherche toujours à retourner à son origine. C'est ce souffle, attaché à l'objet, qui oblige celui qui reçoit à rendre.",
      lecon: "Ce qu'on te donne garde en lui une part de celui qui a donné.",
      lien: "https://fr.wikipedia.org/wiki/Essai_sur_le_don",
      svg:
        G + '<path d="M24 24 C24 21 27 21 27 24 C27 29 20 29 20 23 C20 16 30 16 30 24 C30 33 16 33 15 24"/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Melpa, hautes terres de Papouasie-Nouvelle-Guinée",
      nom: "Le moka",
      savoir:
        "On y gagne en importance non par ce qu'on possède, mais par ce qu'on distribue. Offrir plus qu'on ne peut recevoir en retour place l'autre en dette, et fait de soi un grand homme.",
      lecon: "Le prestige se mesure à ce qu'on a donné, jamais à ce qu'on garde.",
      lien: "https://en.wikipedia.org/wiki/Moka_exchange",
      svg:
        G + '<path d="M24 38 V12"/><path d="M15 21 L24 11 L33 21"/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Monde indien (hindouisme, bouddhisme, jaïnisme)",
      nom: "Le dāna",
      savoir:
        "Le don rituel désintéressé, sans attente de retour, est tenu pour une élévation de celui qui donne. Donner purifie et libère : c'est un acte spirituel autant que social.",
      lecon: "Donner sans attendre n'est pas s'appauvrir : c'est s'élever.",
      lien: "https://fr.wikipedia.org/wiki/D%C4%81na",
      svg:
        G + '<path d="M24 36 C16 28 16 18 24 12 C32 18 32 28 24 36 Z"/><path d="M24 35 C18 32 13 28 12 21 C19 21 23 27 24 33"/><path d="M24 35 C30 32 35 28 36 21 C29 21 25 27 24 33"/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Droit germanique médiéval",
      nom: "La Morgengabe",
      savoir:
        "Le don du matin était remis à l'épouse au lendemain des noces, devant témoins. Sa valeur dépassait de loin ce que la coutume exigeait : le lien se scellait par un excès, non par un juste échange.",
      lecon: "Un lien se scelle par ce qu'on donne en trop, pas par ce qu'on doit.",
      lien: "https://fr.wikipedia.org/wiki/Mariage_morganatique",
      svg:
        G + '<line x1="8" y1="34" x2="40" y2="34"/><path d="M14 34 a10 10 0 0 1 20 0"/><line x1="24" y1="12" x2="24" y2="16"/><line x1="12.5" y1="19" x2="15" y2="21.5"/><line x1="35.5" y1="19" x2="33" y2="21.5"/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Droit romain ancien et germanique",
      nom: "Le nexum et le wadium",
      savoir:
        "Bien avant nos contrats, un objet transmis suffisait à lier durablement deux personnes. Le gage n'était pas une garantie matérielle : il portait une part de celui qui l'engageait. Nos contrats descendent, à la lettre, d'un geste de don.",
      lecon: "Nos contrats sont d'anciens dons qui ont oublié leur origine.",
      lien: "https://fr.wikipedia.org/wiki/Nexum",
      svg:
        G + '<rect x="9" y="18" width="17" height="12" rx="6"/><rect x="22" y="18" width="17" height="12" rx="6"/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Grèce antique",
      nom: "La xenia",
      savoir:
        "L'hospitalité sacrée grecque, placée sous la protection de Zeus, obligeait à accueillir l'étranger, à le nourrir et à le protéger avant même de lui demander son nom. Le lien d'hospitalité se transmettait aux descendants et engageait sur des générations.",
      lecon: "Accueillir l'inconnu n'était pas une vertu : c'était un devoir sacré.",
      lien: "https://en.wikipedia.org/wiki/Xenia_(Greek)",
      svg:
        G + '<path d="M12 38 V22 a12 12 0 0 1 24 0 V38"/><path d="M8 38 H40"/><circle cx="24" cy="31" r="2.2" ' + Gd + '/></svg>'
    },
    {
      famille: "anthropologie",
      origine: "Afrique australe (philosophie bantoue)",
      nom: "L'ubuntu",
      savoir:
        "Ubuntu se traduit à peu près par « je suis parce que nous sommes ». La personne n'existe pas d'abord seule, puis en relation : elle devient elle-même à travers ses liens avec les autres.",
      lecon: "Je ne suis pleinement moi qu'à travers les autres.",
      lien: "https://fr.wikipedia.org/wiki/Ubuntu_(philosophie)",
      svg:
        G + '<circle cx="14" cy="16" r="2.6" ' + Gd + '/><path d="M9 30 a5 5 0 0 1 10 0"/><circle cx="24" cy="12" r="2.6" ' + Gd + '/><path d="M19 28 a5 5 0 0 1 10 0"/><circle cx="34" cy="16" r="2.6" ' + Gd + '/><path d="M29 30 a5 5 0 0 1 10 0"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "David Graeber, Dette : 5000 ans d'histoire (2011)",
      nom: "La dette",
      savoir:
        "Graeber montre que la dette précède la monnaie et le troc, et qu'elle est d'abord une relation morale entre les êtres avant d'être un montant. Réduire une dette à un chiffre à rembourser, c'est déjà avoir oublié le lien qu'elle scellait.",
      lecon: "Avant d'être une somme, une dette est un lien entre deux personnes.",
      lien: "https://fr.wikipedia.org/wiki/Dette_:_5000_ans_d%27histoire",
      svg:
        G + '<path d="M24 38 V12"/><path d="M17 38 H31"/><path d="M10 17 L38 23"/><path d="M10 17 L5 27 M10 17 L15 27"/><path d="M5 27 a5 4 0 0 0 10 0"/><path d="M38 23 L33 33 M38 23 L43 33"/><path d="M33 33 a5 4 0 0 0 10 0"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Elinor Ostrom, prix Nobel d'économie 2009",
      nom: "Les communs",
      savoir:
        "On croyait qu'une ressource partagée était condamnée à être pillée par chacun. Ostrom a prouvé le contraire sur des terrains réels : des communautés gouvernent durablement leurs biens communs, sans marché ni État, à condition de règles qu'elles se donnent elles-mêmes.",
      lecon: "Le partage ne mène pas à la ruine. Mal gouverné, si.",
      lien: "https://fr.wikipedia.org/wiki/Elinor_Ostrom",
      svg:
        G + '<circle cx="24" cy="24" r="5"/><circle cx="24" cy="24" r="16" stroke-dasharray="20 5.13"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Karl Polanyi, La Grande Transformation (1944)",
      nom: "L'encastrement",
      savoir:
        "Pendant presque toute l'histoire, l'économie était encastrée dans le social : un moyen au service des liens. La rupture moderne, c'est le moment où le marché se détache et somme la société d'entrer dans son ordre, plutôt que l'inverse.",
      lecon: "L'économie était au service du lien. Un jour, elle a voulu le contraire.",
      lien: "https://fr.wikipedia.org/wiki/La_Grande_Transformation",
      svg:
        G + '<circle cx="24" cy="24" r="15"/><circle cx="24" cy="32" r="7"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Karl Polanyi",
      nom: "Les trois formes d'échange",
      savoir:
        "Polanyi distingue trois façons dont les humains ont fait circuler les choses : la réciprocité (le don mutuel), la redistribution (par un centre qui redonne) et l'échange marchand. Le marché n'est qu'une des trois. Il a juste fini par croire qu'il était la seule.",
      lecon: "Le marché n'est qu'une des trois façons de faire circuler. Pas la nature des choses.",
      lien: "https://fr.wikipedia.org/wiki/La_Grande_Transformation",
      svg:
        G + '<path d="M24 10 L38 34 H10 Z"/><circle cx="24" cy="10" r="2.6" ' + Gd + '/><circle cx="38" cy="34" r="2.6" ' + Gd + '/><circle cx="10" cy="34" r="2.6" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Michael Chwe, Rational Ritual (2001)",
      nom: "Le savoir commun",
      savoir:
        "Il ne suffit pas que chacun sache. Il faut que chacun sache que les autres savent, et le sache en cascade. C'est cette connaissance partagée, et non l'information seule, qui rend un groupe capable d'agir ensemble.",
      lecon: "Un groupe agit non quand chacun sait, mais quand chacun sait que les autres savent.",
      lien: "https://fr.wikipedia.org/wiki/Connaissance_commune",
      svg:
        G + '<circle cx="24" cy="24" r="2.6" ' + Gd + '/><circle cx="12" cy="14" r="2" ' + Gd + '/><circle cx="36" cy="14" r="2" ' + Gd + '/><circle cx="12" cy="34" r="2" ' + Gd + '/><circle cx="36" cy="34" r="2" ' + Gd + '/><path d="M13.5 15.5 L22 22.5 M34.5 15.5 L26 22.5 M13.5 32.5 L22 25.5 M34.5 32.5 L26 25.5"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Régis Debray, médiologie",
      nom: "Communiquer n'est pas transmettre",
      savoir:
        "Communiquer, c'est transporter une information dans l'espace, vite et large. Transmettre, c'est faire durer une chose dans le temps, à travers les gens et les générations. La plupart des outils font passer un message ; rares sont ceux qui font tenir un lien.",
      lecon: "Faire passer un message est facile. Faire durer un lien est un métier.",
      lien: "https://fr.wikipedia.org/wiki/M%C3%A9diologie",
      svg:
        G + '<circle cx="24" cy="31" r="2.6" ' + Gd + '/><path d="M17 27 a10 10 0 0 1 14 0"/><path d="M13 23 a16 16 0 0 1 22 0"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Marshall McLuhan, Pour comprendre les médias (1964)",
      nom: "Le médium est le message",
      savoir:
        "La forme d'un canal compte plus que ce qu'il transporte : elle façonne l'échelle et la forme de nos liens. Un outil qui compte ce que chacun donne produit du calcul ; un outil qui le rend visible sans le chiffrer produit de la reconnaissance. Même contenu, deux mondes.",
      lecon: "Le support ne transporte pas la relation. Il la façonne.",
      lien: "https://fr.wikipedia.org/wiki/Marshall_McLuhan",
      svg:
        G + '<rect x="9" y="11" width="30" height="26" rx="3"/><path d="M24 17 L31 30 H17 Z"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Antonio Casilli, Les liaisons numériques (2010)",
      nom: "La sociabilité numérique",
      savoir:
        "Contre l'idée reçue d'un web qui isole, Casilli montre qu'il produit une sociabilité nouvelle, avec ses règles. Et il la relit à travers Mauss : en ligne aussi, on publie, on partage, on répond, dans des cycles de don et de contre-don.",
      lecon: "Le web ne détruit pas le lien. Il en fabrique un autre, régi par le don.",
      lien: "https://fr.wikipedia.org/wiki/Antonio_Casilli",
      svg:
        G + '<path d="M11 30 L20 13 L34 18 L37 35 L22 36 Z"/><path d="M20 13 L22 36 M34 18 L22 36"/><circle cx="11" cy="30" r="2.2" ' + Gd + '/><circle cx="20" cy="13" r="2.2" ' + Gd + '/><circle cx="34" cy="18" r="2.2" ' + Gd + '/><circle cx="37" cy="35" r="2.2" ' + Gd + '/><circle cx="22" cy="36" r="2.2" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Dominique Cardon, La démocratie Internet (2010)",
      nom: "Les régimes de visibilité",
      savoir:
        "Sur une plateforme, qui voit quoi, qui est mis en avant, ce qui reste caché, n'est jamais neutre : c'est un choix de conception. Le design décide de la forme des relations possibles. Rendre visible, c'est déjà agencer le lien.",
      lecon: "Décider qui voit quoi, c'est déjà décider quelles relations sont possibles.",
      lien: "https://fr.wikipedia.org/wiki/Dominique_Cardon",
      svg:
        G + '<path d="M6 24 C12 14 36 14 42 24 C36 34 12 34 6 24 Z"/><circle cx="24" cy="24" r="3" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Arnold van Gennep et Victor Turner",
      nom: "La liminalité",
      savoir:
        "Tout rite de passage comporte un entre-deux, la phase liminaire, où l'on n'est plus ce qu'on était et pas encore ce qu'on deviendra. Turner y voit le lieu même de la transformation, et la naissance d'un lien intense entre ceux qui la traversent ensemble : la communitas.",
      lecon: "Le seuil n'est pas ce qu'on traverse pour arriver ailleurs. C'est là que tout se transforme.",
      lien: "https://fr.wikipedia.org/wiki/Rite_de_passage",
      svg:
        G + '<path d="M15 10 V38 M33 10 V38"/><path d="M8 38 H40"/><circle cx="24" cy="24" r="2.6" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Pine et Gilmore, The Experience Economy (1999)",
      nom: "L'expérience mémorable",
      savoir:
        "Ce dont on se souvient d'un service, ce n'est pas sa fonction, c'est le moment qu'il a fait vivre. La valeur ne tient pas dans ce qui est délivré, mais dans l'expérience qui reste.",
      lecon: "On oublie ce qu'on nous a donné. On se souvient de ce qu'on a vécu.",
      lien: "https://fr.wikipedia.org/wiki/%C3%89conomie_de_l%27exp%C3%A9rience",
      svg:
        G + '<path d="M6 32 H17 L24 12 L31 32 H42"/><circle cx="24" cy="12" r="2.2" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Byung-Chul Han, La société de la fatigue (2010)",
      nom: "La société de la fatigue",
      savoir:
        "À force de tout transformer en performance et en activité, notre époque a effacé la contemplation, et s'épuise. Han rappelle que s'arrêter pour voir n'est pas le contraire d'agir : c'est la condition d'une action qui ait un sens.",
      lecon: "Contempler n'est pas ne rien faire. C'est ce sans quoi l'action n'est qu'agitation.",
      lien: "https://fr.wikipedia.org/wiki/Byung-Chul_Han",
      svg:
        G + '<path d="M36 13 A15 15 0 1 0 39 24"/><circle cx="39" cy="24" r="2.2" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Joan Tronto, Un monde vulnérable (1993)",
      nom: "Le care",
      savoir:
        "Le soin, l'attention aux autres et à ce qui les rend vulnérables, n'est pas une affaire privée ni secondaire : c'est ce qui fait tenir toute société. On ne le voit pas, précisément parce qu'il fonctionne.",
      lecon: "Ce qui prend soin est invisible tant que ça marche, et vital quand ça manque.",
      lien: "https://fr.wikipedia.org/wiki/%C3%89thique_du_care",
      svg:
        G + '<circle cx="24" cy="15" r="5"/><path d="M10 28 C14 38 22 38 24 32"/><path d="M38 28 C34 38 26 38 24 32"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Niklas Luhmann, La Confiance (1968)",
      nom: "La confiance comme réducteur de complexité",
      savoir:
        "Le monde est trop complexe pour qu'on vérifie tout. La confiance est ce qui nous permet d'agir malgré l'incertitude : un pari sur l'autre qui rend le futur praticable. Sans elle, plus rien ne circulerait, car tout devrait être garanti d'avance.",
      lecon: "La confiance est ce qui nous permet d'agir sans tout vérifier.",
      lien: "https://fr.wikipedia.org/wiki/Niklas_Luhmann",
      svg:
        G + '<path d="M5 24 H43"/><path d="M11 24 a13 11 0 0 0 26 0"/><path d="M5 24 V38 M43 24 V38"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Pierre Bourdieu et Robert Putnam",
      nom: "Le capital social",
      savoir:
        "La richesse d'une personne ou d'un groupe ne tient pas qu'à l'argent ou au savoir : elle tient aussi au réseau de relations mobilisables. Le lien est une ressource, et elle se cultive ou se dilapide comme une autre.",
      lecon: "Vos relations sont un capital. Invisible, mais bien réel.",
      lien: "https://fr.wikipedia.org/wiki/Capital_social_(sociologie)",
      svg:
        G + '<path d="M12 18 H36 M12 30 H36 M18 12 V36 M30 12 V36"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Edgar Morin",
      nom: "La reliance",
      savoir:
        "Penser, ce n'est pas seulement distinguer et séparer, c'est relier. Morin appelle reliance ce geste de rétablir les liens que la pensée moderne, en découpant tout en spécialités, a coupés. Comprendre un monde complexe suppose de le relier, pas de le fragmenter.",
      lecon: "La pensée moderne excelle à séparer. Il lui manque l'art de relier.",
      lien: "https://fr.wikipedia.org/wiki/Edgar_Morin",
      svg:
        G + '<path d="M8 14 C20 14 20 24 24 24"/><path d="M8 34 C20 34 20 24 24 24"/><path d="M40 14 C28 14 28 24 24 24"/><path d="M40 34 C28 34 28 24 24 24"/><circle cx="24" cy="24" r="3" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Mancur Olson, La Logique de l'action collective (1965)",
      nom: "Le passager clandestin",
      savoir:
        "Dans un groupe, chacun a intérêt à profiter du bien commun sans y contribuer, en espérant que les autres le feront. Si tous raisonnent ainsi, rien n'est produit. C'est le problème que toute coopération doit résoudre pour exister.",
      lecon: "Le plus grand danger d'un bien commun, c'est celui qui en profite sans y contribuer.",
      lien: "https://fr.wikipedia.org/wiki/Logique_de_l%27action_collective",
      svg:
        G + '<circle cx="12" cy="20" r="3.4" ' + Gd + '/><circle cx="24" cy="20" r="3.4" ' + Gd + '/><circle cx="36" cy="20" r="3.4" ' + Gd + '/><circle cx="38" cy="36" r="3.4"/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Théorie des jeux (Tucker, 1950)",
      nom: "Le dilemme du prisonnier",
      savoir:
        "Deux personnes gagneraient à se faire confiance, mais chacune, par peur d'être trahie, choisit de trahir : elles finissent toutes deux perdantes, alors que coopérer les aurait servies. C'est le modèle même de ce qui bloque une coopération, faute de confiance et de communication.",
      lecon: "Chacun a joué au plus malin. Tous ont perdu. C'est ce qui arrive sans confiance.",
      lien: "https://fr.wikipedia.org/wiki/Dilemme_du_prisonnier",
      svg:
        G + '<rect x="8" y="12" width="14" height="24"/><rect x="26" y="12" width="14" height="24"/><circle cx="15" cy="24" r="2" ' + Gd + '/><circle cx="33" cy="24" r="2" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Donella Meadows, Leverage Points (1999)",
      nom: "Les points de levier",
      savoir:
        "Dans tout système, il existe des endroits où une petite action produit un grand effet, et d'autres où l'on peut pousser fort sans rien changer. Le plus dur n'est pas d'agir : c'est de trouver où.",
      lecon: "Dans un système, une pression légère au bon endroit change tout.",
      lien: "https://fr.wikipedia.org/wiki/Donella_Meadows",
      svg:
        G + '<path d="M6 32 L42 20"/><path d="M24 26.5 L18 38 H30 Z"/><circle cx="10" cy="26" r="2.6" ' + Gd + '/></svg>'
    },
    {
      famille: "auteurs",
      origine: "Marcel Mauss, Essai sur le don (1925)",
      nom: "Le lien avant le bien",
      savoir:
        "Dans le don, ce qui compte n'est jamais l'objet transmis, c'est la relation qu'il ouvre, entretient ou répare. On croit échanger des choses ; on échange des liens.",
      lecon: "Ce n'est jamais le bien qui compte. C'est le lien qu'il noue.",
      lien: "https://fr.wikipedia.org/wiki/Essai_sur_le_don",
      svg:
        G + '<circle cx="12" cy="31" r="3" ' + Gd + '/><circle cx="36" cy="17" r="3" ' + Gd + '/><path d="M14 29 C22 21 26 27 34 19"/></svg>'
    },
    {
      famille: "questions",
      origine: "Une question",
      nom: "Qui, chez vous, donne quelque chose que personne ne compte ?",
      savoir:
        "Accueillir un nouveau, désamorcer une tension, garder la mémoire d'une décision : ce travail n'apparaît dans aucun tableau de bord. On ne le découvre que le jour où il s'arrête.",
      lecon: "Ce qui n'est pas compté est souvent ce qui tient tout.",
      lien: "",
      svg:
        G + '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    },
    {
      famille: "questions",
      origine: "Une question",
      nom: "À qui devez-vous quelque chose que vous ne rendrez jamais tout à fait ?",
      savoir:
        "Un conseil, une porte ouverte au bon moment : ces dettes-là ne se remboursent pas, on les rend ailleurs, à d'autres. C'est ainsi qu'un lien finit par faire tenir tout un milieu.",
      lecon: "Les plus beaux liens sont ceux qu'on ne solde pas.",
      lien: "",
      svg:
        G + '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    },
    {
      famille: "questions",
      origine: "Une question",
      nom: "Qu'est-ce qui tiendrait encore, chez vous, si vous partiez demain ?",
      savoir:
        "Ce qui ne repose que sur vous est une dépendance, pas un dispositif. Ce qui continue sans vous, c'est ce que vous avez vraiment transmis.",
      lecon: "Un dispositif réussi est celui qui n'a plus besoin de vous.",
      lien: "",
      svg:
        G + '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    },
    {
      famille: "questions",
      origine: "Une question",
      nom: "Quelle information ne remonte jamais, et où est l'oreille qui manque ?",
      savoir:
        "Quand un problème n'arrive jamais en haut, on accuse ceux qui se taisent. Le plus souvent, il manque simplement un endroit où le dire sans risque.",
      lecon: "Le silence est rarement un défaut des gens. C'est un défaut de canal.",
      lien: "",
      svg:
        G + '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    },
    {
      famille: "questions",
      origine: "Une question",
      nom: "Quel désaccord n'avez-vous jamais réussi à avoir ?",
      savoir:
        "Un sujet qu'on évite ne disparaît pas : il revient en réunions qui tournent en rond et en décisions qui ne s'appliquent pas. Pouvoir se dire un désaccord, c'est le signe d'une relation solide.",
      lecon: "Un conflit qu'on n'a pas pu tenir est un lien qu'on n'a pas pu réparer.",
      lien: "",
      svg:
        G + '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    },
    {
      famille: "questions",
      origine: "Une question",
      nom: "Qu'est-ce qui circule chez vous sans que personne l'ait décidé ?",
      savoir:
        "Une entraide entre deux services, un canal où passent les vraies nouvelles : aucun organigramme ne les montre. C'est pourtant souvent là que le travail se fait vraiment.",
      lecon: "Ce qui tient un collectif n'a presque jamais été conçu pour.",
      lien: "",
      svg:
        G + '<path d="M18 19 a6 6 0 1 1 8 5 c-2 1.4 -2 3 -2 5"/><circle cx="24" cy="35" r="1.7" ' + Gd + '/></svg>'
    }
  ];

  // en anglais, les cartes lisent leur texte dans le dictionnaire (clé : le nom français de la carte)
  if (window.I18N_DONS) dons.forEach(function (d) {
    var e = window.I18N_DONS[d.nom];
    if (e) { d.origine = e.origine; d.savoir = e.savoir; d.lecon = e.lecon; d.lien = e.lien; d.nom = e.nom; }
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
    // l'adresse ouverte : un simple demi-arc
    questions: svgOpen + '<path d="M9 25 A15 15 0 0 1 39 25"/></svg>'
  };
  function backFor(d) {
    return BACKS[d && d.famille] || BACKS.anthropologie;
  }
  var N = 6; // cartes affichées (sur 35 dons) : « une nouvelle donne » redistribue
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
        '<div class="don-flip" role="button" tabindex="0" aria-label="' + tr("Retourner la carte") + '">' +
        '<div class="don-flip-inner">' +
        '<div class="don-face don-face--back don-holo"><span class="don-seal"></span></div>' +
        '<div class="don-face don-face--front don-holo">' +
        '<div class="don-fglyph" aria-hidden="true"></div>' +
        '<div class="don-fnom"></div>' +
        '<div class="don-flecon"></div>' +
        '<button class="don-plus" type="button" tabindex="-1" aria-label="' + tr("En savoir plus") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7 V17 M7 12 H17"/></svg></button>' +
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
    note.textContent =
      tr("Vous avez reçu. Le don n'appelle pas un dû, mais il ouvre quelque chose. Si vous voulez rendre, c'est plus haut.");
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
  // La fenêtre est centrée : quand la largeur ou la hauteur de l'écran n'a pas la parité de celles de la carte, son bord tombe sur une demi-ligne de pixel
  // (500,5 px) et le filet de 1 px s'étale sur deux pixels : plus clair et plus épais que celui du haut ou du bas. On décale la carte pour la poser sur des pixels entiers.
  // À l'ouverture, on mesure AVANT l'animation d'apparition (qui déplace et réduit la carte) : le décalage est juste dès la première image, rien ne saute ensuite.
  function caleCarte(ouverture) {
    var carte = modal.querySelector(".don-card");
    if (!carte || modal.hidden) return;
    if (!ouverture && carte.getAnimations && carte.getAnimations().length) return;   // en cours d'apparition : le calage de l'ouverture fait foi
    if (ouverture) carte.style.animation = "none";
    carte.style.translate = "0 0";
    var dpr = window.devicePixelRatio || 1, r = carte.getBoundingClientRect();
    var dx = (Math.round(r.left * dpr) - r.left * dpr) / dpr, dy = (Math.round(r.top * dpr) - r.top * dpr) / dpr;
    carte.style.translate = dx.toFixed(3) + "px " + dy.toFixed(3) + "px";
    if (ouverture) { void carte.offsetWidth; carte.style.animation = ""; }   // l'apparition repart, avec le bon décalage
  }
  window.addEventListener("resize", function () { caleCarte(false); });

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
    modal.scrollTop = 0;   // la fenêtre défile sur petit écran : on l'ouvre toujours en haut de la carte
    btnClose.focus({ preventScroll: true });   // sans ça, le focus fait défiler jusqu'au bouton, en bas de la carte, et le haut disparaît
    caleCarte(true);
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
    var sujet = tr("Un message") + (nom ? " · " + nom : "");
    var corps =
      (msg || "") + "\n\n" + (nom || "") + (email ? " (" + email + ")" : "");
    window.location.href =
      "mailto:aloha@brannetienne.com?subject=" +
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
          tr("Merci de renseigner votre nom, un email valide et un message."),
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
      labelEl.textContent = tr("Envoi…");
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
              tr("Merci, votre message est parti. Je vous réponds vite."),
              false
            );
          } else {
            throw new Error("send failed");
          }
        })
        .catch(function () {
          setStatus(
            tr("L'envoi a échoué. Écrivez-moi directement à aloha@brannetienne.com."),
            true
          );
        })
        .then(function () {
          btn.disabled = false;
          labelEl.textContent = label;
        });
    });
  }

  // Le bloc des cartes se pose sur un pixel entier : la page est centrée, son bord gauche tombe parfois sur une demi-ligne de pixel (40,5 px),
  // et les traits de 1 px des cartes s'étalent alors sur deux pixels. On mesure la fraction et on décale le bloc (--snap-x, voir styles.css).
  (function () {
    var zone = document.querySelector(".don-zone"), bloc = document.querySelector(".don-corps");
    if (!zone || !bloc) return;
    function caler() {
      zone.style.setProperty("--snap-x", "0px");
      var dpr = window.devicePixelRatio || 1, x = bloc.getBoundingClientRect().left * dpr;
      zone.style.setProperty("--snap-x", ((Math.round(x) - x) / dpr).toFixed(3) + "px");
    }
    caler();
    window.addEventListener("resize", caler);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(caler);
  })();
})();
