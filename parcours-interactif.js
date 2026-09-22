/* Parcours interactif - « Éprouver / Faire l'expérience »
   Données + navigation à écrans. Classes préfixées pi- (voir styles.css).
   Les liens « pour aller plus loin » sont volontairement désactivés pour
   l'instant : gateHTML() renvoie '' - les données gate* restent en place,
   il suffira de rétablir gateHTML pour les recâbler. */
const S=[
{c:"var(--c1)",lieu:"Entre un produit et ses usagers",
 tag:"une plateforme et ceux qui la font tourner",
 factLine:"Ça circule encore. Mais au bout, il n'y a personne.",
 center:{nm:"Le produit",sub:"ce qui les relie"},
 title:"4 personnes répondent à 70% des questions.",
 scene:`<p>L'entreprise vend une plateforme de billetterie à des organisateurs d'événements - festivals, salons, petites salles de concert. L'outil est puissant, donc un peu technique, il faut un peu de temps pour l'apprivoiser.</p>
 <p>Officiellement, il y a un support. Officieusement, ce sont les organisateurs eux-mêmes qui s'entraident. Une poignée de vétérans a ouvert un forum : ils accueillent les nouveaux, écrivent les tutoriels qui manquent, et dépannent le samedi soir quand une billetterie plante à 2 heures de l'ouverture des portes.</p>
 <p>4 d'entre eux, à eux seuls, traitent 70% des questions. Personne ne les paie pour ça. Résultat : le coût de support de l'entreprise est l'un des plus bas du secteur et l'équipe en est fière.</p>`,
 q:"Une question pour vous : Le support de cette plateforme, qu'est-ce qui le fait vraiment tenir ?",
 opts:["solide","exemplaire","à formaliser","à valoriser"],
 answers:[
  {label:"Un bon produit ?",
   reply:`Non, pas tout à fait. Le produit, l'entreprise le regarde déjà. Ce qui fait tenir ce forum n'est pas dedans.`},
  {label:"Une communauté qui s'auto-gère ?",
   reply:`Presque. Mais une communauté ne s'auto-gère jamais toute seule : quelques-uns portent le reste, en silence.`},
  {label:"Une réduction des coûts ?",
   reply:`C'est exactement ce que voit l'entreprise - et c'est le piège. Une économie, on s'en félicite ; une dépendance, on la répare.`},
  {label:"La générosité de quelques-uns ?", good:true,
   reply:`Oui. L'entreprise voit un coût qui baisse ; vous, vous avez vu des gens qui donnent. C'est précisément ce qui ne figure sur aucun tableau - et c'est le plus difficile à remarquer.`}
 ],
 turnTitle:"Les mois passent.",
 hit:"Une dépendance qu'on ne compte pas ressemble exactement à une économie.",
 timeline:[
  {t:"Après 1 mois", body:`<p>L'un des 4 se fait un peu plus rare. 
    Le forum tourne, les indicateurs restent au vert. 
    Personne ne le remarque.</p>`},
  {t:"Après 3 mois", body:`<p>Ils sont 2 à avoir cessé. Les réponses tardent, quelques nouveaux se plaignent, on met ça sur le compte d'un pic d'activité.</p>`},
  {t:"Après 6 mois", body:`<p>3 des 4 ont arrêté, sans un mot. Le coût de support triple. Et personne ne sait pourquoi : ces 4 là n'apparaissaient dans aucun tableau de bord, aucun contrat, aucune ligne de budget.</p>`}
 ],
 turn:`<p>3 des 4 ont cessé de répondre. Pas de départ, pas de plainte, pas de message, ils ont simplement arrêté. Le coût de support triple en un trimestre.</p>
 <p>Dans l'entreprise, personne ne sait pourquoi, et personne ne peut savoir : ces 4 personnes n'apparaissaient dans aucun tableau de bord, aucun contrat, aucune ligne de budget.</p>
 <p>Le chiffre était là depuis le début. Vous l'avez lu comme une performance.</p>
 <span class="pi-hit">Une dépendance qu'on ne compte pas ressemble exactement à une économie.</span>`,
 v:[{c:"var(--c1)",nm:"Sonia",rl:"une des 4 · elle a arrêté en mars",
   sh:"Sonia",
   pnote:"Nommée chaque mois, elle existe quelque part. Ce qu'elle donne a enfin une adresse, et un fil se tend vers elle.",
   read:`<p>"J'ai donné 3 ans - du temps, des réponses, les samedis soir, sans que ça porte un nom. Le jour où je me suis tue, aucun fil ne s'est tendu vers moi."</p>`,
   title:"Elle a arrêté un mardi.",
   body:`<p>Un salarié de la plateforme est passé sur le forum et a corrigé publiquement une de ses réponses. Sur le fond il avait raison. Elle n'a rien dit.</p>
   <p>Elle a répondu 2 fois de moins la semaine suivante, puis plus du tout. Personne ne lui a écrit, et elle ne s'y attendait pas,  elle n'était liée à eux par rien.</p>
   <p>Elle donnait depuis 3 ans quelque chose qui n'avait jamais eu de nom.</p>`},
  {c:"var(--c2)",nm:"Le responsable produit",rl:"ses indicateurs sont bons",
   sh:"Le responsable",
   pnote:"Un endroit, dans ses outils, où « 4 bénévoles nous tiennent » peut enfin s'inscrire. Il voit des gens, plus seulement une courbe.",
   read:`<p>"Je vois des courbes, pas des gens. Nulle part, dans mes outils, un endroit où « 4 bénévoles nous tiennent » pourrait s'inscrire - alors ça n'arrive pas jusqu'à moi."</p>`,
   title:"Il regarde une courbe de coût.",
   body:`<p>Elle est excellente et il en est légitimement fier. Il n'existe, dans aucun de ses outils, de champ où pourrait s'inscrire « 4 personnes que nous ne payons pas tiennent notre support ».</p>
   <p>Le trimestre suivant, quand la courbe s'inverse, il cherchera l'explication là où il a des données : dans le produit.</p>`},
  {c:"var(--c4)",nm:"Un nouvel organisateur",rl:"il vient d'arriver",
   sh:"Le nouveau",
   pnote:"Au bout de sa question, quelqu'un. Il n'arrive plus 6 mois trop tard&#8239;: ce qui circule finit par l'atteindre.",
   read:`<p>"J'ai posé une question, un soir, et j'ai attendu. Au bout, personne. J'en ai conclu, faute de mieux, que le produit était mal accompagné."</p>`,
   title:"Il pose une question. Rien ne vient.",
   body:`<p>Il attend 2 jours, relance, puis se débrouille seul. Il en conclut, raisonnablement, que ce produit est mal accompagné.</p>
   <p>Il ne saura jamais qu'il est arrivé 6 mois trop tard, ni que quelqu'un lui aurait répondu le samedi soir.</p>`}],
 between:[
  {label:"Sonia ↔ le nouveau", text:"Elle aurait répondu à sa question - elle l'a fait 3 ans. Mais quand il arrive, elle s'est déjà tue, et rien ne les relie."},
  {label:"le nouveau ↔ le responsable", text:"Sa déception ne remonte jamais jusqu'au responsable : elle se perd, au mieux classée « produit mal accompagné »."},
  {label:"le responsable ↔ Sonia", text:"Elle porte le support à bout de bras. Il ne le verra jamais - aucun canal ne dit « 4 bénévoles nous tiennent »."}
 ],
 betweenAfter:[
  {label:"Sonia → le nouveau", text:"Ce qu'elle donne arrive de nouveau à qui en a besoin. Et lui découvre qu'au bout, il y a quelqu'un."},
  {label:"le nouveau → le responsable", text:"Ce que vit le nouveau remonte enfin. Le responsable voit des gens, plus seulement une courbe."},
  {label:"le responsable → Sonia", text:"Nommée chaque mois, Sonia existe dans ses yeux. On sait, désormais, qui tient le support."}
 ],
 app:"Ce qui tenait ce produit n'était pas dans le produit - et n'était nulle part ailleurs non plus.",
 appMore:`Le forum tenait sur 4 personnes que rien ne nommait : ni contrat, ni budget, ni ligne dans un tableau de bord. Quand elles se sont tues, l'entreprise a cherché la panne dans le produit, le seul endroit qu'elle savait regarder. Ce qui circulait vraiment, lui, n'avait aucune adresse où être vu.`,
 gateEnd:{q:"Sonia n'a pas claqué la porte. Elle a cessé.",min:"10 min",href:"article-05.html"},
 pisteLead:`On rebranche le seul fil qui manquait&#8239;: ce que les 4 bénévoles donnaient trouve enfin une adresse. Voici ce qui se remet à circuler entre eux : Sonia qu'on nomme, le nouveau à qui l'on répond, le responsable qui voit enfin des gens.`,
 fixLead:"Imaginons.",
 fix:`Un message par mois - écrit par une personne, pas par un outil - qui dirait ce qui a été corrigé le mois passé, et grâce à qui, nommément. Aucune fonctionnalité, aucun budget, aucune réorganisation : juste un endroit où ce qui circulait déjà finirait par arriver à quelqu'un. Est-ce que 2 des 3 reviendraient&#8239;? Peut-être. Ce n'est pas la réponse, c'est le genre de fil que je tirerais en premier.`},

{c:"var(--c3)",lieu:"Au sein d'une équipe et ses métiers",
 tag:"un atelier et un bureau d'études",
 center:{nm:"La production",sub:"ce qui devrait les relier"},
 between:[
  {label:"le chef d'atelier ↔ le logiciel", text:"Il y dépose 43 remontées, datées, précises. Elles y restent&#8239;: personne, de l'autre côté, n'est branché sur ce champ."},
  {label:"le logiciel ↔ le bureau d'études", text:"Le logiciel a tout gardé, horodaté. Mais rien n'a jamais prévu que le bureau d'études vienne l'ouvrir."},
  {label:"le bureau d'études ↔ l'atelier", text:"L'atelier corrige en silence&#8239;; le bureau croit ses plans parfaits. Entre les 2, aucun fil ne relie ce qui cloche à qui dessine."}
 ],
 betweenAfter:[
  {label:"le chef d'atelier → le logiciel", text:"Ce qu'il dépose ne dort plus dans le champ&#8239;: c'est relu, de l'autre côté, par quelqu'un."},
  {label:"le logiciel → le bureau d'études", text:"Le bureau vient lire ce que le champ contient. L'absence de retour n'était pas une preuve, juste un canal resté fermé."},
  {label:"le bureau d'études → l'atelier", text:"L'erreur remonte enfin à qui dessine. On la répare une fois, en amont, au lieu de 43 fois à la main."}
 ],
 appMore:`43 remontées, écrites, datées, précises - dans un champ que personne, à l'autre bout, n'était chargé d'ouvrir. L'atelier a fini par écrire pour l'archive, et le bureau d'études a pris le silence pour la preuve que sa méthode tenait. Ce qui circulait n'a jamais manqué de clarté&#8239;: il lui manquait un destinataire.`,
 title:"L'atelier qui ne remonte jamais les erreurs de plans.",
 scene:`<p>Une PME industrielle conçoit et fabrique des machines spéciales : des équipements sur mesure, un par client, jamais tout à fait les mêmes. Les plans naissent au bureau d'études, puis descendent à l'atelier, où on les transforme en acier.</p>
 <p>Presque chaque dossier arrive avec ses défauts&#8239;: une cote qui ne tombe pas juste, un perçage posé sur une soudure, 2 pièces pensées pour s'emboîter et qui refusent. L'atelier ne s'en émeut plus. On reprend, on recale, on ajuste à la main. Ils appellent ça « rattraper », et c'est presque un point d'honneur&#8239;: le client attend, la machine sortira à l'heure.</p>
 <p>Et ça marche. Les délais sont tenus depuis 2 ans, la direction industrielle est satisfaite, et au bureau d'études, l'ingénieur qui signe les plans n'a jamais entendu dire que quoi que ce soit clochait.</p>`,
 q:"Une question pour vous : pourquoi l'atelier ne remonte-t-il jamais ces erreurs ?",
 opts:["pas le temps","ça ne servirait à rien","ils ne veulent pas dénoncer","ce n'est pas leur rôle"],
 answers:[
  {label:"Ils n'ont pas le temps",
   reply:`Plausible, mais c'est une raison qui est chez eux. Et si le problème n'était pas de leur côté ?`},
  {label:"Ce n'est pas leur rôle",
   reply:`Peut-être. Encore une explication du côté des gens : leur poste, leur périmètre. Ce n'est sans doute pas là que ça se joue.`},
  {label:"Ça ne servirait à rien",
   reply:`Vous supposez leur résignation. C'est toujours une lecture de leur état d'esprit, pas de ce qui, autour d'eux, ne fonctionne pas.`},
  {label:"Et s'ils remontaient, sans que ça n'arrive nulle part ?", good:true,
   reply:`Oui. Vous n'avez pas cherché la faute chez eux, vous avez senti qu'il manque peut-être un endroit où ce qu'ils disent puisse arriver. C'est exactement là qu'il faut regarder.`}
 ],
 turnTitle:"Le compteur monte.",
 hit:"Ce n'est pas qu'ils ne parlent pas. C'est qu'il n'existe aucun endroit où ce qu'ils disent puisse arriver.",
 timeline:[
  {t:"6 mois - 11 remontées", body:`<p>Le chef d'atelier vérifie encore si quelqu'un les a lues. Les délais sont tenus, la direction industrielle est satisfaite. Personne n'ouvre le champ.</p>`},
  {t:"1 an - 24 remontées", body:`<p>Il a cessé de vérifier&#8239;; il continue d'écrire, par acquit de conscience. En face, le bureau d'études forme les nouveaux à sa méthode&#8239;: aucun retour négatif, donc elle est bonne.</p>`},
  {t:"2 ans - 43 remontées", body:`<p>43 commentaires datés, horodatés, jamais perdus, jamais lus. Les délais tiennent toujours&#8239;: l'atelier « rattrape ». Tout le monde est satisfait.</p>`}
 ],
 v:[{c:"var(--c3)",nm:"Le chef d'atelier",rl:"43 commentaires",
   pnote:"Ce qu'il écrit arrive à quelqu'un. Il n'écrit plus pour l'archive, mais pour être lu  et il l'est.",
   read:`<p>"J'ai écrit 43 fois ce qui coince. Personne n'a jamais répondu, alors j'ai cessé de vérifier, mais je continue d'écrire, pour que ce soit quelque part."</p>`,
   title:"Il continue à écrire.",
   body:`<p>Les 6 premiers mois, il vérifiait si quelqu'un avait lu. Ensuite il a cessé de vérifier, et il a continué d'écrire, par acquit de conscience, pour que ce soit quelque part.</p>
   <p>Si on lui demandait aujourd'hui pourquoi il ne remonte pas, il répondrait sans doute : « à quoi bon ». Et on l'inscrirait comme un problème d'état d'esprit.</p>`},
  {c:"var(--c2)",nm:"L'ingénieur du bureau d'études",rl:"il n'a jamais reçu une remontée",
   pnote:"Il reçoit enfin ce qui cloche. Le silence n'était pas la qualité de sa méthode, c'était son étanchéité.",
   read:`<p>"4 ans sans un seul retour négatif sur mes plans. J'en conclus qu'ils sont bons, et je l'enseigne aux nouveaux. Le silence, pour moi, c'est la preuve."</p>`,
   title:"Il forme les nouveaux à sa méthode.",
   body:`<p>En 4 ans, aucun retour négatif sur ses plans. Il en tire la conclusion qui s'impose : sa méthode est bonne. Il l'enseigne aux arrivants.</p>
   <p>L'absence de signal est devenue, pour lui, une preuve de qualité. Elle est en réalité une preuve d'étanchéité.</p>`},
  {c:"var(--c5)",nm:"Le logiciel",rl:"personne ne le regarde en face",
   pnote:"Le champ est relié. Ce qu'il gardait sans lecteur trouve un œil de l'autre côté.",
   read:`<p>"J'ai tout gardé&#8239;: 43 commentaires, datés, intacts. Simplement, personne n'a jamais prévu qu'un autre que leur auteur vienne les lire."</p>`,
   title:"Le champ existe. Le lien, non.",
   body:`<p>43 commentaires enregistrés, horodatés, jamais perdus. Le système a tout gardé.</p>
   <p>Il n'a simplement jamais été prévu que ce champ soit lu par quelqu'un d'autre que celui qui l'écrit. Rien n'est cassé, rien n'a été relié.</p>`}],
 app:"L'information circulait depuis 2 ans. Il n'y avait aucune oreille au bout.",
 pisteLead:`On relie enfin le champ à une oreille&#8239;: ce que l'atelier écrit depuis 2 ans arrive jusqu'au bureau d'études. Voici ce qui se remet à circuler entre eux : l'erreur qui remonte, la méthode qui se corrige, celui qui écrit enfin lu.`,
 fixLead:"Ce qui a suffi.",
 fix:`Un quart d'heure hebdomadaire où chaque métier nomme ce que le travail de l'autre lui a coûté cette semaine. Ni outil, ni compte rendu, ni budget. Le rattrapage a coûté l'équivalent d'un poste et demi sur les 2 années précédentes. La personne qui a installé ce quart d'heure est partie depuis 18 mois : Ce point a lieu toujours lieu.`,
 gateFix:{q:"Un quart d'heure par semaine. Pourquoi ça tient.",min:"11 min",href:"article-04.html"}},

{c:"var(--c4)",lieu:"Autour d'un parcours et ses moments",
 tag:"6 rendez-vous depuis janvier",
 center:{nm:"L'accompagnement",sub:"ce qui devrait les relier"},
 between:[
  {label:"elle ↔ le tableau de bord", text:"Tous ses voyants sont au vert. Nulle part une case pour dire qu'elle a déjà donné, 5 fois, ce qu'on lui redemande."},
  {label:"le tableau de bord ↔ le professionnel", text:"Il enregistre un entretien de plus, « peu coopérante » en marge. Jamais ce qui s'est usé entre le premier rendez-vous et le sixième."},
  {label:"le professionnel ↔ elle", text:"Elle a déjà tout dit, ailleurs, avant lui. Il la découvre à zéro&#8239;: rien de ce qu'elle a donné n'arrive jusqu'à lui."}
 ],
 betweenAfter:[
  {label:"elle → le tableau de bord", text:"Ce qu'elle a déjà donné cesse d'être invisible&#8239;: il en reste une trace, d'un rendez-vous au suivant."},
  {label:"le tableau de bord → le professionnel", text:"Ce qui compte n'est plus le nombre d'entretiens, mais ce qui se transmet vraiment de l'un à l'autre."},
  {label:"le professionnel → elle", text:"La demi-page arrive avant elle. Il sait déjà ce qu'elle a dit, elle n'a pas à tout recommencer."}
 ],
 appMore:`À chaque rendez-vous elle redit ce qu'elle a déjà dit, et chaque fois ça retombe dans le même trou&#8239;: rien ne passe d'un interlocuteur au suivant. Ce qu'on a fini par prendre pour de la fermeture n'était que la fatigue de donner à vide. Ce qui circulait - son histoire, ses demandes - n'avait aucun endroit pour apparaître.`,
 title:"Elle répond par phrases courtes.",
 scene:`<p>C'est un rendez-vous d'accompagnement comme il s'en tient des centaines. Le sixième depuis janvier, dans le même dossier, et, à chaque fois, un interlocuteur différent&#8239;: mutation, planning, congés,... personne n'y peut rien.</p>
 <p>En face du professionnel, une femme d'une quarantaine d'années. Elle répond, mais de manière sommaire&#8239;: oui, non, ça va. Elle ne développe pas, ne donne aucun détail, regarde la porte plus souvent que lui. Elle a gardé son manteau posé sur ses genoux.</p>
 <p>Lui a 40 minutes, un dossier de 2 pages et 6 autres rendez-vous derrière celui-là. Il fait ce qu'il peut, honnêtement, avec ce qu'il a sous les yeux. À la fin, dans la case prévue, il écrit ce qu'il a vu&#8239;: "peu coopérante".</p>`,
 q:"Une question pour vous : que se passe-t-il chez cette personne qui vient au rendez-vous ?",
 opts:["elle est découragée","elle est méfiante","elle protège quelque chose","elle a renoncé"],
 answers:[
  {label:"Elle est méfiante",
   reply:`Une lecture de son caractère. Et si ce que vous prenez pour de la méfiance ne venait pas d'elle ?`},
  {label:"Elle est découragée",
   reply:`Peut-être. Mais encore une fois, vous décrivez son état intérieur. Le sujet est peut-être ailleurs qu'en elle.`},
  {label:"Elle protège quelque chose",
   reply:`Vous cherchez toujours en elle une intention, une défense. Et si ça se jouait avant elle ?`},
  {label:"Elle a peut-être déjà tout dit, ailleurs", good:true,
   reply:`Oui. Vous n'avez pas cherché qui elle est - vous avez entendu qu'elle a peut-être déjà donné, avant vous, sans que rien ne reste. C'est exactement ce que son dossier va montrer.`}
 ],
 turnTitle:"Ces derniers mois.",
 hit:"Ce que vous preniez pour sa personnalité est la trace de son parcours.",
 timeline:[
  {t:"Janvier", body:`<p>Premier rendez-vous. 3 pages&#8239;: elle raconte tout, les dates, les détails, l'ordre des choses. On la note investie.</p>`},
  {t:"Février", body:`<p> 2 pages. Elle donne encore, un peu moins. Rien qui alerte&#8239;: un dossier qui se met en place.</p>`},
  {t:"Mars", body:`<p>Une page. Les réponses se resserrent. On y lit une situation qui se stabilise.</p>`},
  {t:"Mai", body:`<p> 2 paragraphes. Presque plus de détails. En marge, pour la première fois, un mot&#8239;: « distante ».</p>`}
 ],
 gateTurn:{q:"Ce qu'elle vous a laissé prendre pour son caractère.",min:"8 min",href:"article-01.html"},
 v:[{c:"var(--c4)",nm:"Elle",rl:"sixième fois depuis janvier",
   pnote:"Elle n'a pas à tout reprendre. Pour la première fois, ce qu'elle a donné l'attend déjà de l'autre côté.",
   read:`<p>"La première fois, j'ai tout raconté, et ça a servi. À la quatrième, j'avais compris que rien ne passait d'un rendez-vous à l'autre. J'ai cessé de donner ce qui ne reste pas."</p>`,
   title:"Elle a appris que ça ne restait pas.",
   body:`<p>La première fois, tout dire a été dur et ça a servi : quelqu'un l'a écoutée.</p>
   <p>À la quatrième, elle a compris que rien ne passait d'un rendez-vous à l'autre - que ce qu'elle donnait tombait chaque fois dans un trou.</p>
   <p>Elle n'a pas cessé de donner. Elle a cessé de donner ce qui ne restait pas.</p>`},
  {c:"var(--c2)",nm:"Le professionnel d'aujourd'hui",rl:"il la voit pour la première fois",
   pnote:"Il ouvre la demi-page avant elle. Il ne la découvre plus à zéro&#8239;: il continue une histoire au lieu d'en rouvrir une.",
   read:`<p>"40 minutes, 2 pages de dossier, une personne qui se ferme. Je note ce que je vois honnêtement, et c'est cette note-là qui va rester."</p>`,
   title:"Il note ce qu'il observe.",
   body:`<p>40 minutes, 2 pages de dossier, une personne qui se ferme. Il consigne honnêtement, avec les mots dont il dispose.</p>
   <p>Cette note suivra le dossier. C'est la seule chose de cette matinée qui va rester - et elle décrit un effet en le nommant comme une cause.</p>`},
  {c:"var(--c5)",nm:"Le tableau de bord",rl:"tous les voyants sont au vert",
   pnote:"Ce qui se transmet cesse d'être invisible. Le lien d'un rendez-vous au suivant a enfin une trace.",
   read:`<p>"6 entretiens réalisés, tous mes voyants au vert. Aucune case pour ce qui s'est usé entre le premier et le sixième. Donc, pour moi, ça n'a pas eu lieu."</p>`,
   title:"6 entretiens réalisés.",
   body:`<p>Taux de contact excellent. Délai moyen entre 2 rendez-vous : conforme. Aucune de ces lignes n'est fausse.</p>
   <p>Il n'existe nulle part de case pour ce qui s'est usé entre le premier rendez-vous et le sixième. Donc, pour l'organisation, cela n'a pas eu lieu.</p>`}],
 app:"Ce qu'elle a donné 6 fois n'est allé nulle part. Chaque fois, elle a repayé le prix d'entrée d'une relation qui recommence.",
 pisteLead:`On glisse une demi-page d'un rendez-vous au suivant&#8239;: ce qu'elle a déjà donné cesse de se perdre. Voici ce qui se remet à circuler entre eux - son histoire qui la précède, le professionnel qui la continue, le suivi qui garde une trace.`,
 fixLead:"Ce qui a suffi.",
 fix:`Une demi-page transmise d'un rendez-vous au suivant : ce qu'elle a déjà dit, et ce qu'elle a déjà demandé. Pas de logiciel, pas de projet, pas de réunion supplémentaire. Au rendez-vous suivant, on ne lui a pas demandé de recommencer.`}
];

const GATE_PLACES={q:"Ce que vous venez de faire porte un nom.",min:"10 min",href:"article-03.html"};

const done=[false,false,false]; const seen=[new Set(),new Set(),new Set()];
const choseGood=[null,null,null]; // mémorise si la réponse lucide a été choisie (pour rappel au « Fond »)
let ansSeen=new Set(); // réponses déjà explorées sur le mur courant
let cs=0, placesGateShown=false;

/* Liens « pour aller plus loin » désactivés pour l'instant. */
function gateHTML(g){return '';}

/* Barre du haut : retour à l'accueil du parcours + fil des 4 étapes du scénario. */
const STEP_LABELS=['La situation','Plus tard','Ailleurs','Le fond','La piste'];
const STEP_OF={'s-mur':0,'s-turn':1,'s-places':2,'s-vue':2,'s-end':3,'s-piste':4};
const SCREEN_OF_STEP=['s-mur','s-turn','s-places','s-end','s-piste'];
let piMax=0; // étape la plus avancée atteinte dans le scénario courant (cliquable jusque-là)
function updateChrome(id){
 const top=document.querySelector('.pi-top');
 const exit=document.getElementById('pi-exit'), back=document.getElementById('pi-back'), steps=document.getElementById('pi-steps');
 if(id in STEP_OF){
  const cur=STEP_OF[id];
  if(cur>piMax) piMax=cur;
  top.style.setProperty('--ac',S[cs].c);
  exit.hidden=true; back.hidden=false; steps.hidden=false;
  steps.innerHTML=STEP_LABELS.map((lb,i)=>{
   const reach=i<=piMax;
   const cls='pi-step'+(i===cur?' pi-cur':(reach?' pi-done':''))+(reach?' pi-clickable':'');
   return '<li class="'+cls+'"'+(reach?' data-step="'+i+'"':'')+'><span class="n">'+(i+1)+'</span><span class="lb">'+lb+'</span></li>';
  }).join('');
  steps.querySelectorAll('.pi-clickable').forEach(li=>{ li.onclick=()=>go(SCREEN_OF_STEP[+li.dataset.step]); });
 }else{
  top.style.removeProperty('--ac');
  exit.hidden=false; back.hidden=true; steps.hidden=true;
 }
}

function go(id){document.querySelectorAll('.pi-screen').forEach(s=>s.classList.remove('pi-on'));
 document.getElementById(id).classList.add('pi-on');updateChrome(id);window.scrollTo(0,0);if(id==='s-home')home();}
function home(){
 document.querySelectorAll('#home .pi-card').forEach(card=>{
  const i=+card.dataset.sit;
  card.classList.toggle('pi-done',done[i]);
  card.onclick=()=>mur(i);
 });
 // « aller plus loin » : seulement une fois les 3 parcours traversés
 const further=document.getElementById('pi-further');
 if(further) further.hidden=!(done[0]&&done[1]&&done[2]);
}
function mur(i){cs=i;piMax=0;const s=S[i];const el=document.getElementById('s-mur');
 el.style.setProperty('--ac',s.c);
 document.getElementById('m-kick').innerHTML='<b>'+s.lieu+'</b> · '+s.tag;
 document.getElementById('m-title').textContent=s.title;
 document.getElementById('m-scene').innerHTML=s.scene;
 document.getElementById('m-q').textContent=s.q;
 const o=document.getElementById('m-opts');o.innerHTML='';
 const mnext=document.getElementById('m-next'); if(mnext) mnext.hidden=true;
 ansSeen=new Set();
 if(s.answers){
  o.className='pi-answers';
  s.answers.forEach((a,k)=>{const block=document.createElement('div');block.className='pi-ans-block';block.dataset.k=k;
   block.innerHTML='<button class="pi-ans-head" type="button"><span class="pi-ans-label">'+a.label+'</span><span class="pi-ans-plus" aria-hidden="true"></span></button>'
    +'<div class="pi-ans-body" hidden><div class="pi-ans-reply">'+a.reply+'</div><span class="pi-ans-cue"></span></div>';
   block.querySelector('.pi-ans-head').onclick=()=>toggleAnswer(k,block,a);
   o.appendChild(block);});
 }else{
  o.className='pi-opts';
  s.opts.forEach(x=>{const b=document.createElement('button');b.className='pi-opt';b.type='button';b.textContent=x;
   b.onclick=()=>turn();o.appendChild(b);});
 }
 go('s-mur');}
function toggleAnswer(k,block,a){
 const open=block.classList.toggle('pi-open');
 block.querySelector('.pi-ans-body').hidden=!open;
 if(!open) return;
 ansSeen.add(k);
 block.classList.remove('pi-good','pi-miss');
 block.classList.add(a.good?'pi-good':'pi-miss');
 const cueEl=block.querySelector('.pi-ans-cue');
 if(a.good){ cueEl.textContent='Vous tenez le fil. Maintenant, laissez le temps passer et regardez ce qu\'il en reste.'; choseGood[cs]=true; document.getElementById('m-next').hidden=false; }
 else{ cueEl.textContent=''; }}
function turn(){const s=S[cs];const el=document.getElementById('s-turn');
 el.style.setProperty('--ac',s.c);
 document.getElementById('t-kick').innerHTML='<b>'+s.lieu+'</b> · plus tard';
 document.getElementById('t-title').textContent=s.turnTitle;
 const body=document.getElementById('t-body');
 const nextBtn=document.getElementById('t-next');
 if(s.timeline){
  const N=s.timeline.length;
  body.innerHTML='<div class="pi-timeline">'+s.timeline.map((tl,i)=>
    '<div class="pi-tl-node'+(i>0?' pi-pending':'')+'" data-i="'+i+'">'
    +'<button class="pi-tl-head" type="button"><span class="pi-tl-dot"></span><span class="pi-tl-label">'+tl.t+'</span></button>'
    +'<div class="pi-tl-body">'+tl.body+'</div>'
    +'</div>'
  ).join('')+'</div>'
  +'<div class="pi-turn-hit" id="t-hit" hidden><span class="pi-hit">'+s.hit+'</span></div>'
  +'<button class="pi-btn pi-tl-reveal" id="t-reveal" type="button" hidden>Ce que ces chiffres disaient vraiment</button>';
  nextBtn.hidden=true;
  const nodes=[...body.querySelectorAll('.pi-tl-node')];
  const reveal=document.getElementById('t-reveal');
  reveal.onclick=()=>{ reveal.hidden=true; const h=document.getElementById('t-hit'); if(h) h.hidden=false; nextBtn.hidden=false; };
  nodes.forEach(node=>{
   node.querySelector('.pi-tl-head').onclick=()=>{
    const i=+node.dataset.i;
    const firstOpen=!node.classList.contains('pi-open');
    node.classList.toggle('pi-open');
    if(firstOpen){
     const nx=nodes[i+1];
     if(nx) nx.classList.remove('pi-pending');
     if(i===N-1){ reveal.hidden=false; }
    }
   };
  });
 }else{
  body.innerHTML=s.turn;
  nextBtn.hidden=false;
 }
 document.getElementById('t-gate').innerHTML=gateHTML(s.gateTurn);
 go('s-turn');}
function toPlaces(){const s=S[cs];const el=document.getElementById('s-places');
 el.style.setProperty('--ac',s.c);
 document.getElementById('p-kick').innerHTML='<b>'+s.lieu+'</b> · les regards';
 const p=document.getElementById('places');p.className='pi-cercle';
 const dots=[['410','167'],['182','542'],['638','542']]; // Sonia haut, responsable bas-g, nouveau bas-d
 const arcs=['M 472 187 A 248 248 0 0 1 632 522','M 618 538 A 248 248 0 0 1 202 538','M 188 522 A 248 248 0 0 1 348 187'];
 const svg='<svg class="pi-cscene-svg" viewBox="0 0 820 820" aria-hidden="true">'
   +'<defs><marker id="pi-arr" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto"><path class="pi-arrhead" d="M1,1.5 L8,4.5 L1,7.5 Z"/></marker></defs>'
   +'<circle class="pi-cscene-ring" cx="410" cy="415" r="248"/>'
   +'<g class="pi-links">'+arcs.map(d=>'<path class="pi-link" d="'+d+'" marker-end="url(#pi-arr)"/>').join('')+'</g>'
   +'</svg>';
 const ic='<span class="pi-role-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.3"/><path d="M5.5 19c0-3.7 2.9-6.2 6.5-6.2s6.5 2.5 6.5 6.2"/></svg></span>';
 const roleCls=['pi-role--a','pi-role--b','pi-role--c'];
 const roles=s.v.map((v,k)=>'<div class="pi-role '+roleCls[k]+'" data-k="'+k+'" style="--cc:'+v.c+'">'
   +'<button class="pi-role-btn" type="button"><span class="pi-role-head">'+ic+'<span class="pi-role-nm">'+v.nm+'</span></span><span class="pi-role-invite">D&eacute;couvrir</span></button>'
   +'<div class="pi-role-reveal">'+(v.read||v.body)+'</div>'
   +'</div>').join('');
 const betCls=['pi-bet--r','pi-bet--b','pi-bet--l'];
 const bet=(s.between||[]).map((bb,i)=>'<div class="pi-bet '+betCls[i]+'"><span class="pi-bet-label">'+bb.label+'</span><p>'+bb.text+'</p></div>').join('');
 p.innerHTML='<div class="pi-cscene">'+svg
   +'<span class="pi-produit"><span class="pi-produit-nm">'+((s.center&&s.center.nm)||'Le produit')+'</span><span class="pi-produit-sub">'+((s.center&&s.center.sub)||'ce qui les relie')+'</span></span>'
   +roles+bet+'</div>'
   +'<p class="pi-cercle-hint" id="pi-cercle-hint">Autour du produit, 3 rôles. Ouvrez-les pour découvrir ce que chacun vit.</p>'
   +'<button class="pi-btn pi-cercle-see" id="pi-cercle-see" type="button" hidden>Voir ce qui les relie</button>';
 const scene=p.querySelector('.pi-cscene');
 const hint=document.getElementById('pi-cercle-hint');
 const seeBtn=document.getElementById('pi-cercle-see');
 const pnext=document.getElementById('p-next'); pnext.hidden=true;
 scene.querySelectorAll('.pi-role').forEach(role=>{ const k=+role.dataset.k;
   role.querySelector('.pi-role-btn').onclick=()=>{ if(role.classList.contains('pi-open')) return;
     role.classList.add('pi-open'); seen[cs].add(k);
     if(seen[cs].size>=3){ hint.hidden=true; seeBtn.hidden=false; } };
 });
 seeBtn.onclick=()=>{ scene.classList.add('pi-linked'); seeBtn.hidden=true; pnext.hidden=false; };
 document.getElementById('p-gate').innerHTML='';
 if(seen[cs].size>=3){ scene.querySelectorAll('.pi-role').forEach(r=>r.classList.add('pi-open')); hint.hidden=true; scene.classList.add('pi-linked'); pnext.hidden=false; }
 go('s-places');}
function vue(k){const s=S[cs],v=s.v[k];const el=document.getElementById('s-vue');
 el.style.setProperty('--ac',v.c);
 document.getElementById('v-kick').innerHTML='<b>'+s.lieu+'</b> · par les yeux de '+v.nm.toLowerCase();
 document.getElementById('v-title').textContent=v.title;
 document.getElementById('v-body').innerHTML=v.body;
 seen[cs].add(k);go('s-vue');}
function toEnd(){const s=S[cs];const el=document.getElementById('s-end');
 el.style.setProperty('--ac',s.c);
 document.getElementById('e-kick').innerHTML='<b>'+s.lieu+'</b> · le fond';
 document.getElementById('e-app').textContent=s.app;
 const more=document.getElementById('e-more'); more.innerHTML=s.appMore||''; more.hidden=!s.appMore;
 document.getElementById('e-gate').innerHTML=gateHTML(s.gateEnd);
 done[cs]=true;
 const btn=document.getElementById('e-next');
 btn.textContent='Un début de solution ?';btn.onclick=()=>toPiste();
 go('s-end');}
function toPiste(){const s=S[cs];const el=document.getElementById('s-piste');
 el.style.setProperty('--ac',s.c);
 document.getElementById('pt-kick').innerHTML='<b>'+s.lieu+'</b> · la piste';
 document.getElementById('pt-lead').innerHTML=s.pisteLead||'';
 // le cercle RÉPARÉ : mêmes acteurs, mais la valeur se remet à circuler entre eux
 const cont=document.getElementById('pt-cercle');
 const arcs=['M 472 187 A 248 248 0 0 1 632 522','M 618 538 A 248 248 0 0 1 202 538','M 188 522 A 248 248 0 0 1 348 187'];
 const svg='<svg class="pi-cscene-svg" viewBox="0 0 820 820" aria-hidden="true">'
   +'<defs><marker id="pi-arr2" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto"><path class="pi-arrhead" d="M1,1.5 L8,4.5 L1,7.5 Z"/></marker></defs>'
   +'<circle class="pi-cscene-ring" cx="410" cy="415" r="248"/>'
   +'<g class="pi-links">'+arcs.map(d=>'<path class="pi-link" d="'+d+'" marker-end="url(#pi-arr2)"/>').join('')+'</g>'
   +'</svg>';
 const ic='<span class="pi-role-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.3"/><path d="M5.5 19c0-3.7 2.9-6.2 6.5-6.2s6.5 2.5 6.5 6.2"/></svg></span>';
 const roleCls=['pi-role--a','pi-role--b','pi-role--c'];
 const roles=s.v.map((v,k)=>'<div class="pi-role pi-role--mini '+roleCls[k]+'" style="--cc:'+v.c+'"><div class="pi-role-head">'+ic+'<span class="pi-role-nm">'+v.nm+'</span></div>'+'<p class="pi-role-mininote">'+(v.pnote||'[À compléter : ce qui change pour '+v.nm.toLowerCase()+'.]')+'</p></div>').join('');
 const bet=(s.betweenAfter||s.between||[]).map((bb,i)=>'<div class="pi-bet '+['pi-bet--r','pi-bet--b','pi-bet--l'][i]+'"><span class="pi-bet-label">'+bb.label+'</span><p>'+bb.text+'</p></div>').join('');
 cont.className='pi-cscene pi-alive';
 cont.innerHTML=svg+'<span class="pi-produit"><span class="pi-produit-nm">'+((s.center&&s.center.nm)||'Le produit')+'</span><span class="pi-produit-sub">'+((s.center&&s.center.sub)||'ce qui les relie')+'</span></span>'+roles+bet;
 requestAnimationFrame(()=>requestAnimationFrame(()=>cont.classList.add('pi-linked')));
 // le texte de piste, en accompagnement dessous
 document.getElementById('pt-body').innerHTML='<h3 class="pi-piste-title">'+(s.fixLead||'Ce qui a suffi')+'</h3>'+s.fix;
 document.getElementById('pt-gate').innerHTML=gateHTML(s.gateFix);
 const n=done.filter(Boolean).length;
 const elsewhere=document.getElementById('pt-elsewhere');
 const btn=document.getElementById('pt-next');
 if(n===3){ elsewhere.hidden=true; btn.textContent='Ce que les 3 ont en commun'; btn.onclick=()=>go('s-synth'); }
 else{ elsewhere.hidden=false; btn.textContent="Explorer d'autres endroits"; btn.onclick=()=>go('s-home'); }
 go('s-piste');}
home();
