/* Parcours interactif - « Éprouver / Faire l'expérience »
   Données + navigation à écrans. Classes préfixées pi- (voir styles.css).
   Les liens « pour aller plus loin » sont volontairement désactivés pour
   l'instant : gateHTML() renvoie '' - les données gate* restent en place,
   il suffira de rétablir gateHTML pour les recâbler. */
const S=[
{c:"var(--c1)",lieu:"Between a product and its users",
 tag:"a platform and the people who keep it running",
 factLine:"It still circulates. But at the end, there is nobody.",
 center:{nm:"The product",sub:"what connects them"},
 title:"4 people answer 70% of the questions.",
 scene:`<p>The company sells a ticketing platform to event organizers - festivals, trade shows, small concert halls. The tool is powerful, and therefore a little technical, so it takes a bit of time to tame.</p>
 <p>Officially, there is a support team. Unofficially, it is the organizers themselves who help each other. A handful of veterans opened a forum: they welcome newcomers, write the tutorials that are missing, and troubleshoot on Saturday night when a ticketing page crashes 2 hours before the doors open.</p>
 <p>4 of them alone handle 70% of the questions. Nobody pays them for it. Result: the company's support cost is one of the lowest in the sector and the team is proud of it.</p>`,
 q:"A question for you: What is it that really holds this platform's support together?",
 opts:["solid","exemplary","to formalize","to value"],
 answers:[
  {label:"A good product?",
   reply:`No, not quite. The product is something the company already looks at. What holds this forum together isn't in it.`},
  {label:"A self-managing community?",
   reply:`Almost. But a community never manages itself entirely alone: a few carry the rest, in silence.`},
  {label:"A cost reduction?",
   reply:`That is exactly what the company sees - and that's the trap. A saving, we congratulate ourselves on; a dependency, we repair.`},
  {label:"The generosity of a few?", good:true,
   reply:`Yes. The company sees a cost going down; you saw people who give. That is precisely what appears on no dashboard - and it is the hardest thing to notice.`}
 ],
 turnTitle:"The months go by.",
 hit:"A dependency that isn't counted looks exactly like a saving.",
 timeline:[
  {t:"After 1 month", body:`<p>One of the 4 shows up a little less. 
    The forum runs, the indicators stay green. 
    Nobody notices.</p>`},
  {t:"After 3 months", body:`<p>2 of them have stopped. Answers are late, a few newcomers complain, it's put down to a spike in activity.</p>`},
  {t:"After 6 months", body:`<p>3 of the 4 have stopped, without a word. The support cost triples. And nobody knows why: these 4 appeared on no dashboard, no contract, no budget line.</p>`}
 ],
 turn:`<p>3 of the 4 stopped answering. No departure, no complaint, no message, they simply stopped. The support cost triples in a quarter.</p>
 <p>In the company, nobody knows why, and nobody can know: these 4 people appeared on no dashboard, no contract, no budget line.</p>
 <p>The number had been there from the start. You read it as a performance.</p>
 <span class="pi-hit">A dependency that isn't counted looks exactly like a saving.</span>`,
 v:[{c:"var(--c1)",nm:"Sonia",rl:"one of the 4 · she stopped in March",
   sh:"Sonia",
   pnote:"Named every month, she exists somewhere. What she gives finally has an address, and a thread stretches toward her.",
   read:`<p>"I gave 3 years - time, answers, Saturday nights, with nothing ever naming it. The day I fell silent, no thread stretched toward me."</p>`,
   title:"She stopped on a Tuesday.",
   body:`<p>A platform employee came onto the forum and publicly corrected one of her answers. On the substance he was right. She said nothing.</p>
   <p>She answered 2 times less the following week, then not at all. Nobody wrote to her, and she didn't expect it, she was tied to them by nothing.</p>
   <p>For 3 years she had been giving something that had never had a name.</p>`},
  {c:"var(--c2)",nm:"The product manager",rl:"his indicators are good",
   sh:"The manager",
   pnote:"A place, in his tools, where “4 volunteers hold us up” can finally be recorded. He sees people, no longer just a curve.",
   read:`<p>"I see curves, not people. Nowhere in my tools is there a place where “4 volunteers hold us up” could be recorded - so it never reaches me."</p>`,
   title:"He looks at a cost curve.",
   body:`<p>It is excellent and he is legitimately proud of it. In none of his tools is there a field where “4 people we don't pay hold up our support” could be recorded.</p>
   <p>Next quarter, when the curve reverses, he will look for the explanation where he has data: in the product.</p>`},
  {c:"var(--c4)",nm:"A new organizer",rl:"he just arrived",
   sh:"The newcomer",
   pnote:"At the end of his question, someone. He no longer arrives 6 months too late&#8239;: what circulates ends up reaching him.",
   read:`<p>"I asked a question one evening, and I waited. At the other end, nobody. I concluded, for lack of anything better, that the product was poorly supported."</p>`,
   title:"He asks a question. Nothing comes.",
   body:`<p>He waits 2 days, follows up, then manages alone. He concludes, reasonably, that this product is poorly supported.</p>
   <p>He will never know that he arrived 6 months too late, nor that someone would have answered him on Saturday night.</p>`}],
 between:[
  {label:"Sonia ↔ the newcomer", text:"She would have answered his question - she did for 3 years. But when he arrives, she has already gone quiet, and nothing connects them."},
  {label:"the newcomer ↔ the manager", text:"His disappointment never reaches the manager: it gets lost, at best filed as “poorly supported product”."},
  {label:"the manager ↔ Sonia", text:"She carries the support single-handedly. He will never see it - no channel says “4 volunteers hold us up”."}
 ],
 betweenAfter:[
  {label:"Sonia → the newcomer", text:"What she gives reaches whoever needs it again. And he discovers that at the other end, there is someone."},
  {label:"the newcomer → the manager", text:"What the newcomer lives finally travels back up. The manager sees people, no longer just a curve."},
  {label:"the manager → Sonia", text:"Named every month, Sonia exists in his eyes. We now know who holds up the support."}
 ],
 app:"What held this product together wasn't in the product - and wasn't anywhere else either.",
 appMore:`The forum rested on 4 people that nothing named: no contract, no budget, no line in a dashboard. When they fell silent, the company looked for the fault in the product, the only place it knew how to look. What was really circulating had no address where it could be seen.`,
 gateEnd:{q:"Sonia didn't slam the door. She stopped.",min:"10 min",href:"/en/05-ce-qui-ne-circule-plus-casse"},
 pisteLead:`We reconnect the only thread that was missing&#8239;: what the 4 volunteers gave finally finds an address. Here is what starts circulating again between them: Sonia who is named, the newcomer who gets an answer, the manager who finally sees people.`,
 fixLead:"Let's imagine.",
 fix:`One message per month - written by a person, not by a tool - that would say what was fixed last month, and thanks to whom, by name. No feature, no budget, no reorganization: just a place where what was already circulating would finally arrive somewhere. Would 2 of the 3 come back&#8239;? Maybe. It isn't the answer, it's the kind of thread I would pull first.`},

{c:"var(--c3)",lieu:"Within a team and its trades",
 tag:"a workshop and an engineering office",
 center:{nm:"Production",sub:"what should connect them"},
 between:[
  {label:"the shop foreman ↔ the software", text:"He drops 43 reports there, dated, precise. They stay there&#8239;: nobody, on the other side, is plugged into that field."},
  {label:"the software ↔ the engineering office", text:"The software kept everything, timestamped. But nothing ever planned for the engineering office to come and open it."},
  {label:"the engineering office ↔ the workshop", text:"The workshop corrects in silence&#8239;; the office believes its drawings are perfect. Between the two, no thread connects what's wrong to whoever draws."}
 ],
 betweenAfter:[
  {label:"the shop foreman → the software", text:"What he drops no longer sleeps in the field&#8239;: it is reread, on the other side, by someone."},
  {label:"the software → the engineering office", text:"The office comes to read what the field contains. The absence of feedback wasn't proof, just a channel left closed."},
  {label:"the engineering office → the workshop", text:"The error finally travels back to whoever draws. It is fixed once, upstream, instead of 43 times by hand."}
 ],
 appMore:`43 reports, written, dated, precise - in a field that nobody, at the other end, was in charge of opening. The workshop ended up writing for the archive, and the engineering office took the silence as proof that its method held. What circulated never lacked clarity&#8239;: it lacked a recipient.`,
 title:"The workshop that never reports errors in the drawings.",
 scene:`<p>A small industrial company designs and builds special machines: custom equipment, one per customer, never quite the same. The drawings are born in the engineering office, then go down to the workshop, where they are turned into steel.</p>
 <p>Almost every file arrives with its defects&#8239;: a dimension that doesn't come out right, a hole drilled over a weld, 2 parts designed to fit together that refuse. The workshop no longer gets worked up about it. We rework, we recenter, we adjust by hand. They call it “catching up”, and it is almost a point of honor&#8239;: the customer is waiting, the machine will go out on time.</p>
 <p>And it works. Deadlines have been met for 2 years, industrial management is satisfied, and in the engineering office, the engineer who signs the drawings has never heard that anything was wrong.</p>`,
 q:"A question for you: why does the workshop never report these errors?",
 opts:["no time","it would be pointless","they don't want to blow the whistle","it's not their role"],
 answers:[
  {label:"They don't have the time",
   reply:`Plausible, but it's a reason that sits with them. What if the problem wasn't on their side?`},
  {label:"It's not their role",
   reply:`Maybe. Yet another explanation on the people's side: their post, their remit. That is probably not where it plays out.`},
  {label:"It would be pointless",
   reply:`You assume their resignation. It's always a reading of their state of mind, not of what, around them, doesn't work.`},
  {label:"What if they did report, and it went nowhere?", good:true,
   reply:`Yes. You didn't look for the fault in them, you sensed there may be no place where what they say can arrive. That is exactly where to look.`}
 ],
 turnTitle:"The counter climbs.",
 hit:"It's not that they don't speak. It's that there is no place where what they say can arrive.",
 timeline:[
  {t:"6 months - 11 reports", body:`<p>The shop foreman still checks whether anyone has read them. Deadlines are met, industrial management is satisfied. Nobody opens the field.</p>`},
  {t:"1 year - 24 reports", body:`<p>He has stopped checking&#8239;; he keeps writing, for his own conscience. Opposite, the engineering office trains newcomers in its method&#8239;: no negative feedback, so it's a good one.</p>`},
  {t:"2 years - 43 reports", body:`<p>43 comments, dated, timestamped, never lost, never read. Deadlines still hold&#8239;: the workshop “catches up”. Everyone is satisfied.</p>`}
 ],
 v:[{c:"var(--c3)",nm:"The shop foreman",rl:"43 comments",
   pnote:"What he writes reaches someone. He no longer writes for the archive, but to be read  and he is.",
   read:`<p>"I've written 43 times what's stuck. Nobody ever answered, so I stopped checking, but I keep writing, so that it's somewhere."</p>`,
   title:"He keeps writing.",
   body:`<p>For the first 6 months, he checked whether anyone had read. Then he stopped checking, and kept writing, for his own conscience, so that it's somewhere.</p>
   <p>If you asked him today why he doesn't report, he would probably answer: “what's the point”. And it would be filed as a mindset problem.</p>`},
  {c:"var(--c2)",nm:"The engineering office engineer",rl:"he has never received a report",
   pnote:"He finally receives what is wrong. The silence was not the quality of his method, it was its watertightness.",
   read:`<p>"4 years without a single negative feedback on my drawings. I conclude they're good, and I teach it to newcomers. Silence, for me, is proof."</p>`,
   title:"He trains newcomers in his method.",
   body:`<p>In 4 years, no negative feedback on his drawings. He draws the obvious conclusion: his method is good. He teaches it to newcomers.</p>
   <p>The absence of signal has become, for him, a proof of quality. It is in reality a proof of watertightness.</p>`},
  {c:"var(--c5)",nm:"The software",rl:"nobody looks at it head-on",
   pnote:"The field is connected. What it kept without a reader finds an eye on the other side.",
   read:`<p>"I kept everything&#8239;: 43 comments, dated, intact. It's just that nobody ever planned for anyone other than their author to come and read them."</p>`,
   title:"The field exists. The link doesn't.",
   body:`<p>43 comments recorded, timestamped, never lost. The system kept everything.</p>
   <p>It was simply never planned that this field would be read by anyone other than the person writing it. Nothing is broken, nothing was connected.</p>`}],
 app:"The information had been circulating for 2 years. There was no ear at the other end.",
 pisteLead:`We finally connect the field to an ear&#8239;: what the workshop has been writing for 2 years reaches the engineering office. Here is what starts circulating again between them: the error that travels back up, the method that corrects itself, the one who writes finally read.`,
 fixLead:"What was enough.",
 fix:`A weekly quarter of an hour where each trade names what the other's work cost them this week. No tool, no minutes, no budget. The catch-up work cost the equivalent of one and a half positions over the previous 2 years. The person who set up this quarter of an hour left 18 months ago: this meeting still takes place.`,
 gateFix:{q:"A quarter of an hour a week. Why it holds.",min:"11 min",href:"/en/04-le-lien-importe-plus-que-le-bien"}},

{c:"var(--c4)",lieu:"Around a journey and its moments",
 tag:"6 appointments since January",
 center:{nm:"The support process",sub:"what should connect them"},
 between:[
  {label:"she ↔ the dashboard", text:"All her indicators are green. Nowhere a box to say she has already given, 5 times, what is being asked of her again."},
  {label:"the dashboard ↔ the professional", text:"It records one more interview, “uncooperative” in the margin. Never what wore out between the first appointment and the sixth."},
  {label:"the professional ↔ she", text:"She has already said everything, elsewhere, before him. He meets her from zero&#8239;: nothing she gave reaches him."}
 ],
 betweenAfter:[
  {label:"she → the dashboard", text:"What she has already given stops being invisible&#8239;: a trace remains, from one appointment to the next."},
  {label:"the dashboard → the professional", text:"What counts is no longer the number of interviews, but what is really passed from one to the next."},
  {label:"the professional → she", text:"The half-page arrives before she does. He already knows what she said, she doesn't have to start over."}
 ],
 appMore:`At each appointment she says again what she has already said, and each time it falls into the same hole&#8239;: nothing passes from one contact to the next. What we ended up taking for closure was only the fatigue of giving into the void. What circulated - her story, her requests - had no place to appear.`,
 title:"She answers in short sentences.",
 scene:`<p>It is a support appointment like hundreds that take place. The sixth since January, in the same file, and, each time, a different contact&#8239;: transfer, schedule, leave,... nobody can help it.</p>
 <p>Facing the professional, a woman in her forties. She answers, but sparingly&#8239;: yes, no, fine. She doesn't elaborate, gives no detail, looks at the door more often than at him. She has kept her coat on her lap.</p>
 <p>He has 40 minutes, a 2-page file and 6 other appointments behind this one. He does what he can, honestly, with what he has in front of him. At the end, in the box provided, he writes what he saw&#8239;: "uncooperative".</p>`,
 q:"A question for you: what is going on in this person who comes to the appointment?",
 opts:["she is discouraged","she is wary","she is protecting something","she has given up"],
 answers:[
  {label:"She is wary",
   reply:`A reading of her character. What if what you take for wariness didn't come from her?`},
  {label:"She is discouraged",
   reply:`Maybe. But once again, you are describing her inner state. The subject may lie elsewhere than in her.`},
  {label:"She is protecting something",
   reply:`You always look in her for an intention, a defense. What if it was playing out before her?`},
  {label:"She may have already said everything, elsewhere", good:true,
   reply:`Yes. You didn't look for who she is - you heard that she may have already given, before you, with nothing remaining. That is exactly what her file will show.`}
 ],
 turnTitle:"These past months.",
 hit:"What you took for her personality is the trace of her journey.",
 timeline:[
  {t:"January", body:`<p>First appointment. 3 pages&#8239;: she tells everything, the dates, the details, the order of things. She is noted as invested.</p>`},
  {t:"February", body:`<p> 2 pages. She still gives, a little less. Nothing alarming&#8239;: a file taking shape.</p>`},
  {t:"March", body:`<p>One page. The answers tighten. We read a situation that is stabilizing.</p>`},
  {t:"May", body:`<p> 2 paragraphs. Almost no details left. In the margin, for the first time, a word&#8239;: “distant”.</p>`}
 ],
 gateTurn:{q:"What she let you take for her character.",min:"8 min",href:"/en/01-rien-ne-tient-tout-seul"},
 v:[{c:"var(--c4)",nm:"She",rl:"sixth time since January",
   pnote:"She doesn't have to start over. For the first time, what she has given is already waiting on the other side.",
   read:`<p>"The first time, I told everything, and it helped. By the fourth, I had understood that nothing passed from one appointment to the next. I stopped giving what doesn't last."</p>`,
   title:"She learned it didn't last.",
   body:`<p>The first time, saying everything was hard and it helped: someone listened to her.</p>
   <p>By the fourth, she understood that nothing passed from one appointment to the next - that what she gave fell into a hole each time.</p>
   <p>She didn't stop giving. She stopped giving what didn't last.</p>`},
  {c:"var(--c2)",nm:"Today's professional",rl:"he is seeing her for the first time",
   pnote:"He opens the half-page before she does. He no longer meets her from zero&#8239;: he continues a story instead of reopening one.",
   read:`<p>"40 minutes, 2 pages of file, a person who is closing up. I note what I see honestly, and that note is what will remain."</p>`,
   title:"He notes what he observes.",
   body:`<p>40 minutes, 2 pages of file, a person who is closing up. He records honestly, with the words he has.</p>
   <p>This note will follow the file. It is the only thing from this morning that will remain - and it describes an effect by naming it as a cause.</p>`},
  {c:"var(--c5)",nm:"The dashboard",rl:"all the indicators are green",
   pnote:"What gets passed on stops being invisible. The link from one appointment to the next finally has a trace.",
   read:`<p>"6 interviews completed, all my indicators green. No box for what wore out between the first and the sixth. So, for me, it didn't happen."</p>`,
   title:"6 interviews completed.",
   body:`<p>Contact rate excellent. Average time between 2 appointments: compliant. None of these lines is false.</p>
   <p>There is nowhere a box for what wore out between the first appointment and the sixth. So, for the organization, it did not happen.</p>`}],
 app:"What she gave 6 times went nowhere. Each time, she paid again the entry price of a relationship that starts over.",
 pisteLead:`We slip a half-page from one appointment to the next&#8239;: what she has already given stops getting lost. Here is what starts circulating again between them - her story that precedes her, the professional who continues it, the follow-up that keeps a trace.`,
 fixLead:"What was enough.",
 fix:`A half-page passed from one appointment to the next: what she has already said, and what she has already asked. No software, no project, no extra meeting. At the next appointment, she wasn't asked to start over.`}
];

const GATE_PLACES={q:"What you just did has a name.",min:"10 min",href:"/en/03-la-metaliminalite"};

const done=[false,false,false]; const seen=[new Set(),new Set(),new Set()];
const choseGood=[null,null,null]; // mémorise si la réponse lucide a été choisie (pour rappel au « Fond »)
let ansSeen=new Set(); // réponses déjà explorées sur le mur courant
let cs=0, placesGateShown=false;

/* Liens « pour aller plus loin » désactivés pour l'instant. */
function gateHTML(g){return '';}

/* Sous-barre (sous la navigation du site) : retour aux situations + fil des 5 étapes du scénario. Masquée sur l'accueil du parcours. */
const STEP_LABELS=['The situation','Later','Elsewhere','The core','The direction'];
const STEP_OF={'s-mur':0,'s-turn':1,'s-places':2,'s-vue':2,'s-end':3,'s-piste':4};
const SCREEN_OF_STEP=['s-mur','s-turn','s-places','s-end','s-piste'];
let piMax=0; // étape la plus avancée atteinte dans le scénario courant (cliquable jusque-là)
function updateChrome(id){
 const top=document.querySelector('.pi-top');
 const back=document.getElementById('pi-back'), steps=document.getElementById('pi-steps');
 if(id in STEP_OF){
  const cur=STEP_OF[id];
  if(cur>piMax) piMax=cur;
  top.style.setProperty('--ac',S[cs].c);
  top.hidden=false; back.hidden=false; steps.hidden=false;
  steps.innerHTML=STEP_LABELS.map((lb,i)=>{
   const reach=i<=piMax;
   const cls='pi-step'+(i===cur?' pi-cur':(reach?' pi-done':''))+(reach?' pi-clickable':'');
   return '<li class="'+cls+'"'+(i===cur?' aria-current="step"':'')+(reach?' data-step="'+i+'"':'')+'><span class="n">'+(i+1)+'</span><span class="lb">'+lb+'</span></li>';
  }).join('');
  steps.querySelectorAll('.pi-clickable').forEach(li=>{ li.onclick=()=>go(SCREEN_OF_STEP[+li.dataset.step]); });
 }else{
  top.style.removeProperty('--ac');
  top.hidden=true; back.hidden=true; steps.hidden=true;
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
 if(a.good){ cueEl.textContent='You hold the thread. Now let time pass and look at what remains.'; choseGood[cs]=true; document.getElementById('m-next').hidden=false; }
 else{ cueEl.textContent=''; }}
function turn(){const s=S[cs];const el=document.getElementById('s-turn');
 el.style.setProperty('--ac',s.c);
 document.getElementById('t-kick').innerHTML='<b>'+s.lieu+'</b> · later';
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
  +'<button class="pi-btn pi-tl-reveal" id="t-reveal" type="button" hidden>What these figures really said</button>';
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
 document.getElementById('p-kick').innerHTML='<b>'+s.lieu+'</b> · the perspectives';
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
   +'<button class="pi-role-btn" type="button"><span class="pi-role-head">'+ic+'<span class="pi-role-nm">'+v.nm+'</span></span><span class="pi-role-invite">Discover</span></button>'
   +'<div class="pi-role-reveal">'+(v.read||v.body)+'</div>'
   +'</div>').join('');
 const betCls=['pi-bet--r','pi-bet--b','pi-bet--l'];
 const bet=(s.between||[]).map((bb,i)=>'<div class="pi-bet '+betCls[i]+'"><span class="pi-bet-label">'+bb.label+'</span><p>'+bb.text+'</p></div>').join('');
 p.innerHTML='<div class="pi-cscene">'+svg
   +'<span class="pi-produit arrondi"><span class="pi-produit-nm">'+((s.center&&s.center.nm)||'The product')+'</span><span class="pi-produit-sub">'+((s.center&&s.center.sub)||'what connects them')+'</span></span>'
   +roles+bet+'</div>'
   +'<p class="pi-cercle-hint" id="pi-cercle-hint">Around the product, 3 roles. Open them to discover what each one lives.</p>'
   +'<button class="pi-btn pi-cercle-see" id="pi-cercle-see" type="button" hidden>See what connects them</button>';
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
 document.getElementById('v-kick').innerHTML='<b>'+s.lieu+'</b> · through the eyes of '+v.nm.toLowerCase();
 document.getElementById('v-title').textContent=v.title;
 document.getElementById('v-body').innerHTML=v.body;
 seen[cs].add(k);go('s-vue');}
function toEnd(){const s=S[cs];const el=document.getElementById('s-end');
 el.style.setProperty('--ac',s.c);
 document.getElementById('e-kick').innerHTML='<b>'+s.lieu+'</b> · the core';
 document.getElementById('e-app').textContent=s.app;
 const more=document.getElementById('e-more'); more.innerHTML=s.appMore||''; more.hidden=!s.appMore;
 document.getElementById('e-gate').innerHTML=gateHTML(s.gateEnd);
 done[cs]=true;
 const btn=document.getElementById('e-next');
 btn.textContent='The start of a solution?';btn.onclick=()=>toPiste();
 go('s-end');}
function toPiste(){const s=S[cs];const el=document.getElementById('s-piste');
 el.style.setProperty('--ac',s.c);
 document.getElementById('pt-kick').innerHTML='<b>'+s.lieu+'</b> · the direction';
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
 const roles=s.v.map((v,k)=>'<div class="pi-role pi-role--mini '+roleCls[k]+'" style="--cc:'+v.c+'"><div class="pi-role-head">'+ic+'<span class="pi-role-nm">'+v.nm+'</span></div>'+'<p class="pi-role-mininote">'+(v.pnote||'[To complete: what changes for '+v.nm.toLowerCase()+'.]')+'</p></div>').join('');
 const bet=(s.betweenAfter||s.between||[]).map((bb,i)=>'<div class="pi-bet '+['pi-bet--r','pi-bet--b','pi-bet--l'][i]+'"><span class="pi-bet-label">'+bb.label+'</span><p>'+bb.text+'</p></div>').join('');
 cont.className='pi-cscene pi-alive';
 cont.innerHTML=svg+'<span class="pi-produit arrondi"><span class="pi-produit-nm">'+((s.center&&s.center.nm)||'The product')+'</span><span class="pi-produit-sub">'+((s.center&&s.center.sub)||'what connects them')+'</span></span>'+roles+bet;
 requestAnimationFrame(()=>requestAnimationFrame(()=>cont.classList.add('pi-linked')));
 // le texte de piste, en accompagnement dessous
 document.getElementById('pt-body').innerHTML='<h3 class="pi-piste-title">'+(s.fixLead||'What was enough')+'</h3>'+s.fix;
 document.getElementById('pt-gate').innerHTML=gateHTML(s.gateFix);
 const n=done.filter(Boolean).length;
 const elsewhere=document.getElementById('pt-elsewhere');
 const btn=document.getElementById('pt-next');
 if(n===3){ elsewhere.hidden=true; btn.textContent='What the 3 have in common'; btn.onclick=()=>go('s-synth'); }
 else{ elsewhere.hidden=false; btn.textContent="Explore other places"; btn.onclick=()=>go('s-home'); }
 go('s-piste');}
home();
