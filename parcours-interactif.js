/* Parcours interactif — « Éprouver / Faire l'expérience »
   Données + navigation à écrans. Classes préfixées pi- (voir styles.css).
   Les liens « pour aller plus loin » sont volontairement désactivés pour
   l'instant : gateHTML() renvoie '' — les données gate* restent en place,
   il suffira de rétablir gateHTML pour les recâbler. */
const S=[
{c:"var(--c1)",lieu:"Entre un produit et ses usagers",
 tag:"une plateforme et ceux qui la font tourner",
 title:"Quatre personnes répondent à soixante-dix pour cent des questions.",
 scene:`<p>Une plateforme utilisée par des organisateurs d'événements. Les plus anciens ont ouvert un forum d'entraide : ils répondent aux nouveaux, écrivent des tutoriels, dépannent le samedi soir.</p>
 <p>Quatre d'entre eux traitent soixante-dix pour cent des questions. Le coût de support de l'entreprise est parmi les plus bas du secteur, et l'équipe en est fière.</p>`,
 q:"Une question pour vous : ce forum, qu'est-ce qui le fait vraiment tenir ?",
 opts:["solide","exemplaire","à formaliser","à valoriser"],
 answers:[
  {label:"Un bon produit ?",
   reply:`Non — pas tout à fait. Le produit, l'entreprise le regarde déjà. Ce qui fait tenir ce forum n'est pas dedans. Les mois vont le montrer.`},
  {label:"Une communauté qui s'auto-gère ?",
   reply:`Presque. Mais une communauté ne s'auto-gère jamais toute seule : quelques-uns portent le reste, en silence. Les mois vont le montrer.`},
  {label:"Une économie de support ?",
   reply:`C'est exactement ce que voit l'entreprise — et c'est le piège. Une économie, on s'en félicite ; une dépendance, on la répare. Les mois vont le montrer.`},
  {label:"La générosité de quelques-uns ?", good:true,
   reply:`Oui. L'entreprise voit un coût qui baisse ; vous, vous avez vu des gens qui donnent. C'est précisément ce qui ne figure sur aucun tableau — et c'est le plus difficile à remarquer.`}
 ],
 turnTitle:"Les mois passent.",
 hit:"Une dépendance qu'on ne compte pas ressemble exactement à une économie.",
 timeline:[
  {t:"1 mois", body:`<p>L'un des quatre se fait un peu plus rare. Le forum tourne, les indicateurs restent au vert. Personne ne le remarque.</p>`},
  {t:"3 mois", body:`<p>Ils sont deux à avoir cessé. Les réponses tardent, quelques nouveaux se plaignent — on met ça sur le compte d'un pic d'activité.</p>`},
  {t:"6 mois", body:`<p>Trois des quatre ont arrêté, sans un mot. Le coût de support triple. Et personne ne sait pourquoi : ces quatre-là n'apparaissaient dans aucun tableau de bord, aucun contrat, aucune ligne de budget.</p>`}
 ],
 turn:`<p>Trois des quatre ont cessé de répondre. Pas de départ, pas de plainte, pas de message — ils ont simplement arrêté. Le coût de support triple en un trimestre.</p>
 <p>Dans l'entreprise, personne ne sait pourquoi, et personne ne peut savoir : ces quatre personnes n'apparaissaient dans aucun tableau de bord, aucun contrat, aucune ligne de budget.</p>
 <p>Le chiffre était là depuis le début. Vous l'avez lu comme une performance.</p>
 <span class="pi-hit">Une dépendance qu'on ne compte pas ressemble exactement à une économie.</span>`,
 v:[{c:"var(--c1)",nm:"Sonia",rl:"une des quatre · elle a arrêté en mars",
   title:"Elle a arrêté un mardi.",
   body:`<p>Un salarié de la plateforme est passé sur le forum et a corrigé publiquement une de ses réponses. Sur le fond il avait raison. Elle n'a rien dit.</p>
   <p>Elle a répondu deux fois de moins la semaine suivante, puis plus du tout. Personne ne lui a écrit, et elle ne s'y attendait pas — elle n'était liée à eux par rien.</p>
   <p>Elle donnait depuis trois ans quelque chose qui n'avait jamais eu de nom.</p>`},
  {c:"var(--c2)",nm:"Le responsable produit",rl:"ses indicateurs sont bons",
   title:"Il regarde une courbe de coût.",
   body:`<p>Elle est excellente et il en est légitimement fier. Il n'existe, dans aucun de ses outils, de champ où pourrait s'inscrire « quatre personnes que nous ne payons pas tiennent notre support ».</p>
   <p>Le trimestre suivant, quand la courbe s'inverse, il cherchera l'explication là où il a des données : dans le produit.</p>`},
  {c:"var(--c4)",nm:"Un nouvel organisateur",rl:"il vient d'arriver",
   title:"Il pose une question. Rien ne vient.",
   body:`<p>Il attend deux jours, relance, puis se débrouille seul. Il en conclut, raisonnablement, que ce produit est mal accompagné.</p>
   <p>Il ne saura jamais qu'il est arrivé six mois trop tard, ni que quelqu'un lui aurait répondu le samedi soir.</p>`}],
 app:"Ce qui tenait ce produit n'était pas dans le produit — et n'était nulle part ailleurs non plus.",
 gateEnd:{q:"Sonia n'a pas claqué la porte. Elle a cessé.",min:"10 min",href:"article-05.html"},
 fix:`<b>Ce qui a suffi, dix-huit mois plus tard.</b> Un message par mois, écrit par une personne, qui dit ce qui a été corrigé et grâce à qui, nommément. Aucune fonctionnalité, aucun budget, aucune réorganisation. Deux des trois sont revenus.`},

{c:"var(--c3)",lieu:"Au sein d'une équipe et ses métiers",
 tag:"un atelier et un bureau d'études",
 title:"L'atelier ne remonte jamais les erreurs de plans.",
 scene:`<p>Dans une PME industrielle, les plans arrivent à l'atelier avec des erreurs — des cotes qui ne tombent pas, des pièces qui ne s'assemblent pas dans l'ordre prévu.</p>
 <p>L'atelier corrige et n'en parle pas. Ils appellent ça « rattraper ». Les délais sont tenus depuis deux ans, et la direction industrielle est satisfaite.</p>`,
 q:"Pourquoi l'atelier ne remonte-t-il pas ?",
 opts:["pas le temps","ça ne servirait à rien","ils ne veulent pas dénoncer","ce n'est pas leur rôle"],
 turnTitle:"Ils remontent.",
 turn:`<p>Quarante-trois fois en deux ans. Écrit, daté, précis — dans le champ commentaire du logiciel de production.</p>
 <p>Le bureau d'études n'ouvre jamais ce champ. Ce n'est pas son outil, et aucune notification n'a jamais été branchée dessus.</p>
 <p>Vous venez de chercher une explication du côté des gens : le temps, la loyauté, le rôle. Toutes plausibles. Aucune n'était le sujet.</p>
 <span class="pi-hit">Ce n'est pas qu'ils ne parlent pas. C'est qu'il n'existe aucun endroit où ce qu'ils disent puisse arriver.</span>`,
 v:[{c:"var(--c3)",nm:"Le chef d'atelier",rl:"quarante-trois commentaires",
   title:"Il continue à écrire.",
   body:`<p>Les six premiers mois, il vérifiait si quelqu'un avait lu. Ensuite il a cessé de vérifier, et il a continué d'écrire — par acquit de conscience, pour que ce soit quelque part.</p>
   <p>Si on lui demandait aujourd'hui pourquoi il ne remonte pas, il répondrait sans doute : « à quoi bon ». Et on l'inscrirait comme un problème d'état d'esprit.</p>`},
  {c:"var(--c2)",nm:"L'ingénieur du bureau d'études",rl:"il n'a jamais reçu une remontée",
   title:"Il forme les nouveaux à sa méthode.",
   body:`<p>En quatre ans, aucun retour négatif sur ses plans. Il en tire la conclusion qui s'impose : sa méthode est bonne. Il l'enseigne aux arrivants.</p>
   <p>L'absence de signal est devenue, pour lui, une preuve de qualité. Elle est en réalité une preuve d'étanchéité.</p>`},
  {c:"var(--c5)",nm:"Le logiciel",rl:"personne ne le regarde en face",
   title:"Le champ existe. Le lien, non.",
   body:`<p>Quarante-trois commentaires enregistrés, horodatés, jamais perdus. Le système a tout gardé.</p>
   <p>Il n'a simplement jamais été prévu que ce champ soit lu par quelqu'un d'autre que celui qui l'écrit. Rien n'est cassé — rien n'a été relié.</p>`}],
 app:"L'information circulait depuis deux ans. Il n'y avait aucune oreille au bout.",
 fix:`<b>Ce qui a suffi.</b> Un quart d'heure hebdomadaire où chaque métier nomme ce que le travail de l'autre lui a coûté cette semaine. Ni outil, ni compte rendu, ni budget. Le rattrapage a coûté l'équivalent d'un poste et demi sur les deux années précédentes. La personne qui a installé ce quart d'heure est partie depuis dix-huit mois : il a lieu toujours.`,
 gateFix:{q:"Un quart d'heure par semaine. Pourquoi ça tient.",min:"11 min",href:"article-04.html"}},

{c:"var(--c4)",lieu:"Autour d'un parcours et ses moments",
 tag:"six rendez-vous depuis janvier",
 title:"Elle répond par phrases courtes.",
 scene:`<p>Sixième rendez-vous d'accompagnement depuis janvier. Sixième interlocuteur.</p>
 <p>En face, une femme qui ne développe pas, ne donne aucun détail, regarde la porte. Le professionnel a quarante minutes et un dossier de deux pages. À la fin, il note : peu coopérante.</p>`,
 q:"Que se passe-t-il, chez cette personne ?",
 opts:["elle est découragée","elle est méfiante","elle protège quelque chose","elle a renoncé"],
 turnTitle:"Ouvrez les cinq comptes rendus précédents.",
 turn:`<p>Janvier, premier rendez-vous : trois pages. Elle raconte tout, dans le détail, avec les dates.</p>
 <p>Février : deux pages. Mars : une. Mai : deux paragraphes. Aujourd'hui : six lignes.</p>
 <p>Vous venez de chercher ce qui se passe <strong>chez elle</strong>. Les quatre réponses parlaient de son caractère. La courbe était dans le dossier depuis le début.</p>
 <span class="pi-hit">Ce que vous preniez pour sa personnalité est la trace de son parcours.</span>`,
 gateTurn:{q:"Ce qu'elle vous a laissé prendre pour son caractère.",min:"8 min",href:"article-01.html"},
 v:[{c:"var(--c4)",nm:"Elle",rl:"sixième fois depuis janvier",
   title:"Elle a appris que ça ne restait pas.",
   body:`<p>La première fois, tout dire a été dur et ça a servi : quelqu'un l'a écoutée.</p>
   <p>À la quatrième, elle a compris que rien ne passait d'un rendez-vous à l'autre — que ce qu'elle donnait tombait chaque fois dans un trou.</p>
   <p>Elle n'a pas cessé de donner. Elle a cessé de donner ce qui ne restait pas.</p>`},
  {c:"var(--c2)",nm:"Le professionnel d'aujourd'hui",rl:"il la voit pour la première fois",
   title:"Il note ce qu'il observe.",
   body:`<p>Quarante minutes, deux pages de dossier, une personne qui se ferme. Il consigne honnêtement, avec les mots dont il dispose.</p>
   <p>Cette note suivra le dossier. C'est la seule chose de cette matinée qui va rester — et elle décrit un effet en le nommant comme une cause.</p>`},
  {c:"var(--c5)",nm:"Le tableau de bord",rl:"tous les voyants sont au vert",
   title:"Six entretiens réalisés.",
   body:`<p>Taux de contact excellent. Délai moyen entre deux rendez-vous : conforme. Aucune de ces lignes n'est fausse.</p>
   <p>Il n'existe nulle part de case pour ce qui s'est usé entre le premier rendez-vous et le sixième. Donc, pour l'organisation, cela n'a pas eu lieu.</p>`}],
 app:"Ce qu'elle a donné six fois n'est allé nulle part. Chaque fois, elle a repayé le prix d'entrée d'une relation qui recommence.",
 fix:`<b>Ce qui a suffi.</b> Une demi-page transmise d'un rendez-vous au suivant : ce qu'elle a déjà dit, et ce qu'elle a déjà demandé. Pas de logiciel, pas de projet, pas de réunion supplémentaire. Au rendez-vous suivant, on ne lui a pas demandé de recommencer.`}
];

const GATE_PLACES={q:"Ce que vous venez de faire porte un nom.",min:"10 min",href:"article-03.html"};

const done=[false,false,false]; const seen=[new Set(),new Set(),new Set()];
const choseGood=[null,null,null]; // mémorise si la réponse lucide a été choisie (pour rappel au « Fond »)
let ansSeen=new Set(); // réponses déjà explorées sur le mur courant
let cs=0, placesGateShown=false;

/* Liens « pour aller plus loin » désactivés pour l'instant. */
function gateHTML(g){return '';}

/* Barre du haut : retour à l'accueil du parcours + fil des 4 étapes du scénario. */
const STEP_LABELS=['La situation','Plus tard','Ailleurs','Le fond'];
const STEP_OF={'s-mur':0,'s-turn':1,'s-places':2,'s-vue':2,'s-end':3};
const SCREEN_OF_STEP=['s-mur','s-turn','s-places','s-end'];
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
  const sit=card.dataset.sit;
  if(sit==='meta'){ card.onclick=()=>go('s-synth'); return; }
  const i=+sit;
  card.classList.toggle('pi-done',done[i]);
  card.onclick=()=>mur(i);
 });
}
function mur(i){cs=i;piMax=0;const s=S[i];const el=document.getElementById('s-mur');
 el.style.setProperty('--ac',s.c);
 document.getElementById('m-kick').innerHTML='<b>'+s.lieu+'</b> · '+s.tag;
 document.getElementById('m-title').textContent=s.title;
 document.getElementById('m-scene').innerHTML=s.scene;
 document.getElementById('m-q').textContent=s.q;
 const o=document.getElementById('m-opts');o.innerHTML='';
 const verdict=document.getElementById('m-verdict'); if(verdict){verdict.hidden=true;verdict.innerHTML='';}
 const mnext=document.getElementById('m-next'); if(mnext) mnext.hidden=true;
 ansSeen=new Set();
 if(s.answers){
  s.answers.forEach((a,k)=>{const b=document.createElement('button');b.className='pi-opt';b.type='button';b.textContent=a.label;
   b.onclick=()=>answer(k);o.appendChild(b);});
 }else{
  s.opts.forEach(x=>{const b=document.createElement('button');b.className='pi-opt';b.type='button';b.textContent=x;
   b.onclick=()=>turn();o.appendChild(b);});
 }
 go('s-mur');}
function answer(k){const s=S[cs],a=s.answers[k];
 ansSeen.add(k);
 const alreadyGood=!!choseGood[cs];
 document.querySelectorAll('#m-opts .pi-opt').forEach((b,j)=>{
  b.classList.toggle('pi-chosen',j===k);
  if(ansSeen.has(j)) b.classList.add('pi-seen');
 });
 const cue=a.good
  ? '<span class="pi-verdict-cue">Et maintenant, regardez ce qui se cache derrière les autres réponses.</span>'
  : (alreadyGood ? '' : '<span class="pi-verdict-cue">Essayez encore.</span>');
 const v=document.getElementById('m-verdict');
 v.className='pi-verdict '+(a.good?'pi-good':'pi-miss');
 v.innerHTML=a.reply+cue;
 v.hidden=false;
 if(a.good){ choseGood[cs]=true; document.getElementById('m-next').hidden=false; }}
function turn(){const s=S[cs];const el=document.getElementById('s-turn');
 el.style.setProperty('--ac',s.c);
 document.getElementById('t-kick').innerHTML='<b>'+s.lieu+'</b> · plus tard';
 document.getElementById('t-title').textContent=s.turnTitle;
 const body=document.getElementById('t-body');
 const nextBtn=document.getElementById('t-next');
 if(s.timeline){
  body.innerHTML='<div class="pi-timeline">'+s.timeline.map((tl,i)=>
    '<button class="pi-tl-node" type="button" data-i="'+i+'"><span class="pi-tl-dot"></span><span class="pi-tl-label">'+tl.t+'</span><span class="pi-tl-cue">cliquer</span><span class="pi-tl-body">'+tl.body+'</span></button>'
  ).join('')+'</div><div class="pi-turn-hit" id="t-hit" hidden><span class="pi-hit">'+s.hit+'</span></div>';
  nextBtn.hidden=true;
  const opened=new Set();
  body.querySelectorAll('.pi-tl-node').forEach(node=>{
   node.onclick=()=>{
    node.classList.toggle('pi-open');
    if(node.classList.contains('pi-open')) opened.add(node.dataset.i);
    if(opened.size===s.timeline.length && nextBtn.hidden){
     setTimeout(()=>{ const h=document.getElementById('t-hit'); if(h) h.hidden=false; nextBtn.hidden=false; },1600);
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
 document.getElementById('p-kick').innerHTML='<b>'+s.lieu+'</b> · les places';
 const p=document.getElementById('places');p.innerHTML='';
 s.v.forEach((v,k)=>{
  const col=document.createElement('div');
  col.className='pi-profile'+(seen[cs].has(k)?' pi-open':'');
  col.style.setProperty('--cc',v.c);
  col.innerHTML='<button class="pi-profile-head" type="button">'
   +'<span class="pi-profile-nm">'+v.nm+'</span>'
   +'<span class="pi-profile-rl">'+v.rl+'</span>'
   +'<span class="pi-profile-cue">R&eacute;v&eacute;ler</span>'
   +'</button>'
   +'<div class="pi-profile-body"><span class="pi-profile-title">'+v.title+'</span>'+v.body+'</div>';
  col.querySelector('.pi-profile-head').onclick=()=>{
   col.classList.toggle('pi-open');
   if(col.classList.contains('pi-open')) seen[cs].add(k);
   document.getElementById('p-next').hidden=!(seen[cs].size>0);
  };
  p.appendChild(col);
 });
 document.getElementById('p-gate').innerHTML='';
 document.getElementById('p-next').hidden=!(seen[cs].size>0);
 go('s-places');}
function vue(k){const s=S[cs],v=s.v[k];const el=document.getElementById('s-vue');
 el.style.setProperty('--ac',v.c);
 document.getElementById('v-kick').innerHTML='<b>'+s.lieu+'</b> · par les yeux de '+v.nm.toLowerCase();
 document.getElementById('v-title').textContent=v.title;
 document.getElementById('v-body').innerHTML=v.body;
 seen[cs].add(k);go('s-vue');}
function toEnd(){const s=S[cs];const el=document.getElementById('s-end');
 el.style.setProperty('--ac',s.c);
 document.getElementById('e-kick').innerHTML='<b>'+s.lieu+'</b>';
 document.getElementById('e-app').textContent=s.app;
 document.getElementById('e-gate').innerHTML=gateHTML(s.gateEnd);
 document.getElementById('e-fix').innerHTML=s.fix+gateHTML(s.gateFix);
 done[cs]=true;
 const n=done.filter(Boolean).length;
 const btn=document.getElementById('e-next');
 if(n===3){btn.textContent='Ce que les trois ont en commun';btn.onclick=()=>go('s-synth');}
 else{btn.textContent='La même chose se produit ailleurs';btn.onclick=()=>go('s-home');}
 go('s-end');}
home();
