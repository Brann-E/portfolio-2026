/* Visuels 3D des cartes d'études de cas (Three.js).
   Rien ne tourne au repos : une image fixe au chargement, l'animation seulement au survol.
   Sur tactile ou avec « réduire les animations », la scène reste dans son état assemblé. */

const THREE_URL = new URL('./assets/vendor/three/three.module.min.js', import.meta.url).href;
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
const tactile = matchMedia('(hover: none)').matches;
const statique = reduit || tactile;
const DUREE = 0.8; // secondes : la durée du trait animé « Un comité exécutif → ses équipes » sous le titre (0,7 s, plus le point d'arrivée)


/* une ressource qui échoue (connexion coupée) est retentée deux fois avant d'abandonner */
async function avecRetries(charger) {
  for (let essai = 1; ; essai++) {
    try { return await charger(essai); }
    catch (e) { if (essai === 3) throw e; await new Promise((ok) => setTimeout(ok, 600 * essai)); }
  }
}

let T; // Three.js, chargé à la première carte visible
const scenes = {}; // nom de scène -> fabrique

/* ───────── noyau commun : une même matière pour toutes les cartes ───────── */

const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const mix = (a, b, t) => a + (b - a) * t;

function roundedShape(w, h, r) {
  const s = new T.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/* une dalle : corps sombre, liseré lumineux à la couleur du cas, face dessinée en 2D.
   Retourne le groupe et la liste de ses matériaux (pour en régler l'opacité d'un bloc). */
function slab({ w, h, d = 0.12, r, accent, face, corps = 0x14171c, basique = false, sansLiseré = false }) {
  const g = new T.Group();
  const bevel = 0.014;
  const body = new T.Mesh(
    new T.ExtrudeGeometry(roundedShape(w, h, r), { depth: d, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 10 }).translate(0, 0, -d / 2),
    basique
      ? new T.MeshBasicMaterial({ color: corps, transparent: true })
      : new T.MeshStandardMaterial({ color: corps, roughness: 0.5, metalness: 0.25, transparent: true })
  );
  const rim = new T.Mesh(
    new T.ExtrudeGeometry(roundedShape(w + 0.045, h + 0.045, r + 0.022), { depth: d * 0.4, bevelEnabled: false, curveSegments: 10 }).translate(0, 0, -d / 2 - 0.02),
    new T.MeshBasicMaterial({ color: accent, transparent: true })
  );
  const plan = new T.Mesh(
    new T.PlaneGeometry(w, h),
    new T.MeshBasicMaterial({ map: face.tex, transparent: true, toneMapped: false })
  );
  plan.position.z = d / 2 + bevel + 0.004;
  rim.visible = !sansLiseré;
  g.add(rim, body, plan);
  return { group: g, rim, mats: [body.material, rim.material, plan.material] };
}

/* une face dessinée en canvas 2D, redessinable (l'écran du téléphone s'allume) */
function face(cw, ch, radiusPx, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d');
  const tex = new T.CanvasTexture(canvas);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  const redraw = (...args) => {
    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.beginPath(); ctx.roundRect(0, 0, cw, ch, radiusPx); ctx.clip();
    draw(ctx, cw, ch, ...args);
    ctx.restore();
    tex.needsUpdate = true;
  };
  redraw();
  return { tex, redraw };
}

function halo(color) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d');
  const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, color); gr.addColorStop(1, 'transparent');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
  return new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
}

/* ───────── Healthanea : le patient, et ce qui gravite autour de lui ─────────
   Tout vient du prototype de l'étude de cas : cartes et icônes de la carte d'écosystème
   (prototypes/healthanea-suite), châssis et écrans du parcours patient (prototypes/healthanea-parcours). */

const S = 3; // finesse des textures : 3 pixels par unité de dessin
const FONT_UI = 'Inter, system-ui, sans-serif';
const FONT_SERIF = '"DM Serif Display", Georgia, serif';
const FONT_CARTE = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';


/* six acteurs de la carte : libellé et icône réels. `sens` : 1 vers le patient, -1 depuis lui.
   pos = position assemblée [x, y, z, rotation y] ; repos = [x, y, z, rotation z, rotation y] quand le patient est seul */
const ACTEURS = [
  { nom: 'Médecin traitant',  icone: 'physician', sens: 1, pos: [-2.55, 1.85, -0.5, 0.3],  repos: [-3.2, 2.1, -1.8, 0.3, 0.45] },
  { nom: 'Nutritionniste',    icone: 'nutrition', sens: 1, pos: [-2.65, 0, 0.3, 0.3],      repos: [-3.4, -0.1, -2.2, -0.22, 0.5] },
  { nom: 'Coach de vie',      icone: 'coach',     sens: 1, pos: [-2.55, -1.85, -0.5, 0.3], repos: [-3.0, -2.2, -1.7, 0.26, 0.35] },
  { nom: 'Communauté',        icone: 'community', sens: 1, pos: [2.55, 1.85, -0.5, -0.3],  repos: [3.1, 2.2, -2.0, -0.26, -0.45] },
  { nom: 'Thérapeute',        icone: 'therapist', sens: 1, pos: [2.65, 0, 0.3, -0.3],      repos: [3.4, 0.1, -1.8, 0.2, -0.5] },
  { nom: 'Objets connectés',  icone: 'wearables', sens: 1, pos: [2.55, -1.85, -0.5, -0.3], repos: [3.0, -2.2, -2.0, -0.3, -0.35] },
];
const TUILE_COMMUNAUTE = 3; // l'arrivée de la communauté déclenche l'écran « mise en relation avec un pair »

/* charge une icône et mesure son motif (hors fond blanc ou transparent), pour les ramener toutes à la même emprise */
const chargerIcone = (nom, dossier = './prototypes/healthanea-suite/icons/') => avecRetries((essai) => new Promise((ok, ko) => {
  const i = new Image();
  i.onload = () => {
    const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight;
    const x = c.getContext('2d'); x.drawImage(i, 0, 0);
    const { data, width, height } = x.getImageData(0, 0, c.width, c.height);
    let x0 = width, y0 = height, x1 = 0, y1 = 0;
    for (let py = 0; py < height; py++) for (let px = 0; px < width; px++) {
      const o = (py * width + px) * 4;
      if (data[o + 3] > 16 && (data[o] < 240 || data[o + 1] < 240 || data[o + 2] < 240)) {
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
      }
    }
    ok({ img: i, sx: x0, sy: y0, sw: x1 - x0 + 1, sh: y1 - y0 + 1 });
  };
  i.onerror = ko;
  const adresse = new URL(`${dossier}${nom}.png`, import.meta.url).href;
  i.src = essai === 1 ? adresse : `${adresse}?r=${essai}`;
}));

function coupe(c, texte, largeur) {
  const lignes = []; let ligne = '';
  for (const m of texte.split(' ')) {
    const essai = ligne ? ligne + ' ' + m : m;
    if (ligne && c.measureText(essai).width > largeur) { lignes.push(ligne); ligne = m; } else ligne = essai;
  }
  if (ligne) lignes.push(ligne);
  return lignes;
}

/* libellé de la carte d'écosystème : lignes de 14 caractères au plus */
function lignes14(texte) {
  const lignes = []; let ligne = '';
  for (const m of texte.split(' ')) {
    const essai = ligne ? ligne + ' ' + m : m;
    if (ligne && essai.length > 14) { lignes.push(ligne); ligne = m; } else ligne = essai;
  }
  lignes.push(ligne);
  return lignes;
}

/* la carte d'un acteur : 141 × 172, rayon 10, trait 2, icône 84, libellé 17 */
function dessinerCarte(c, icone, nom) {
  c.save(); c.scale(S, S);
  c.fillStyle = '#fff'; c.fillRect(0, 0, 141, 172);
  c.strokeStyle = '#ebd9d6'; c.lineWidth = 2;
  c.beginPath(); c.roundRect(1, 1, 139, 170, 9); c.stroke();
  /* même poids visuel pour toutes les icônes : on égalise la surface du motif (côté équivalent de 72),
     sans dépasser 84 dans aucun sens, et on les centre dans la zone haute (16 à 100) */
  const { img, sx, sy, sw, sh } = icone, k = Math.min(72 / Math.sqrt(sw * sh), 84 / Math.max(sw, sh));
  c.drawImage(img, sx, sy, sw, sh, 70.5 - (sw * k) / 2, 58 - (sh * k) / 2, sw * k, sh * k);
  /* libellé centré dans la zone basse (100 à 172) : une ligne a autant d'air au-dessus qu'en dessous */
  c.fillStyle = '#000071'; c.font = `500 17px ${FONT_CARTE}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  const lignes = lignes14(nom);
  lignes.forEach((l, i) => c.fillText(l, 70.5, 136 + (i - (lignes.length - 1) / 2) * 22));
  c.restore();
}

/* le téléphone : châssis, barre d'état, deux écrans réels du parcours patient (vide, puis action « pair ») */
const NAV = {
  home: '<path d="M4 11l8-6 8 6M6 10v8h12v-8"/>',
  circle: '<circle cx="9" cy="9" r="3"/><circle cx="15.5" cy="9" r="3"/><path d="M4 18c0-2.5 2-4 4.5-4M13 14c2.5 0 4.5 1.5 4.5 4"/>',
  chat: '<path d="M5 5h14v10H9l-4 4z"/>',
};
const trace = (c, svg, x, y, couleur) => {
  c.save(); c.translate(x, y); c.strokeStyle = couleur; c.lineWidth = 1.7; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const d of svg.match(/d="[^"]+"/g) ?? []) c.stroke(new Path2D(d.slice(3, -1)));
  for (const m of svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"\/>/g)) { c.beginPath(); c.arc(+m[1], +m[2], +m[3], 0, 7); c.stroke(); }
  c.restore();
};

function dessinerNav(c, actif) {
  c.fillStyle = '#fff'; c.fillRect(9, 535, 268, 56);
  c.fillStyle = '#ebd9d6'; c.fillRect(9, 535, 268, 1);
  [['home', 'Accueil'], ['circle', 'Mon cercle'], ['chat', 'Messages']].forEach(([ic, l], i) => {
    const on = i === actif, cx = 9 + 268 / 6 + i * (268 / 3), col = on ? '#ff5f68' : '#6e6470';
    trace(c, NAV[ic], cx - 10, 541, col);
    c.fillStyle = col; c.font = `400 10px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.fillText(l, cx, 580);
  });
  c.textAlign = 'left';
}

/* l'écran « Mon traitement » du prototype : le patient seul face à son ordonnance */
function ecranTraitement(c) {
  c.fillStyle = '#ff5f68'; c.beginPath(); c.arc(30.5, 62, 3.5, 0, 7); c.fill();
  c.fillStyle = '#000071'; c.font = `600 13px ${FONT_UI}`; c.textBaseline = 'middle'; c.fillText('Mon traitement', 42, 62);
  c.textBaseline = 'alphabetic';
  c.fillStyle = '#d9434c'; c.font = `600 12px ${FONT_UI}`; c.fillText('Mon traitement', 27, 97);
  c.fillStyle = '#000071'; c.font = `400 23px ${FONT_SERIF}`;
  coupe(c, 'Metformine, matin et soir.', 232).forEach((l, i) => c.fillText(l, 27, 128 + i * 26.5));
  c.fillStyle = '#d9434c'; c.font = `400 13px ${FONT_UI}`;
  c.fillText('Pourquoi ce changement ?', 27, 190);
  c.fillRect(27, 193, c.measureText('Pourquoi ce changement ?').width, 1);
  c.fillStyle = '#6e6470'; c.font = `600 12px ${FONT_UI}`; c.fillText("Adapter l'heure de prise", 27, 224);
  ['Matin', 'Midi', 'Soir'].forEach((m, i) => {
    c.font = `400 13px ${FONT_UI}`;
    const w = c.measureText(m).width + 24, x = 27 + [0, 1, 2].slice(0, i).reduce((s, j) => s + c.measureText(['Matin', 'Midi', 'Soir'][j]).width + 24 + 7, 0);
    c.fillStyle = '#fff'; c.strokeStyle = '#ebd9d6'; c.lineWidth = 1;
    c.beginPath(); c.roundRect(x + 0.5, 238.5, w, 38, 12); c.fill(); c.stroke();
    c.fillStyle = '#000071'; c.textBaseline = 'middle'; c.fillText(m, x + 12.5, 257.5); c.textBaseline = 'alphabetic';
  });
  dessinerNav(c, 0);
}

function ecranPair(c) {
  c.fillStyle = '#ff5f68'; c.beginPath(); c.arc(30.5, 62, 3.5, 0, 7); c.fill();
  c.fillStyle = '#000071'; c.font = `600 13px ${FONT_UI}`; c.textBaseline = 'middle'; c.fillText('Mon cercle', 42, 62);
  c.textBaseline = 'alphabetic';
  c.fillStyle = '#d9434c'; c.font = `600 12px ${FONT_UI}`; c.fillText('Un relais humain', 27, 97);
  c.fillStyle = '#000071'; c.font = `400 23px ${FONT_SERIF}`;
  coupe(c, "Quelqu'un qui a fait le chemin.", 232).forEach((l, i) => c.fillText(l, 27, 128 + i * 26.5));
  c.fillStyle = '#fff'; c.strokeStyle = '#ebd9d6'; c.lineWidth = 1;
  c.beginPath(); c.roundRect(27.5, 183.5, 231, 62, 14); c.fill(); c.stroke();
  c.fillStyle = '#ff5f68'; c.beginPath(); c.arc(57, 214.5, 19, 0, 7); c.fill();
  c.fillStyle = '#fff'; c.font = `600 15px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('M', 57, 215); c.textAlign = 'left';
  c.textBaseline = 'alphabetic'; c.fillStyle = '#000071'; c.font = `600 14px ${FONT_UI}`; c.fillText('Marc', 87, 211);
  c.fillStyle = '#6e6470'; c.font = `400 12px ${FONT_UI}`; c.fillText('diabète type 2 depuis 4 ans', 87, 228);
  c.fillStyle = '#fdedea'; c.beginPath(); c.roundRect(27, 446, 232, 79, 12); c.fill();
  c.fillStyle = '#000071'; c.font = `400 13px ${FONT_UI}`;
  coupe(c, "« J'ai mis du temps, mais on s'en sort. Écris-moi quand tu veux. »", 208).forEach((l, i) => c.fillText(l, 39, 468 + i * 19.5));
  c.fillStyle = '#ff5f68'; c.beginPath(); c.roundRect(27, 396, 232, 40, 20); c.fill();
  c.fillStyle = '#fff'; c.font = `500 13px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Faire connaissance', 143, 416); c.textAlign = 'left';
  dessinerNav(c, 1);
}

function dessinerTelephone(c, k) {
  c.save(); c.scale(S, S);
  c.fillStyle = '#000071'; c.fillRect(0, 0, 286, 600);
  c.save();
  c.beginPath(); c.roundRect(9, 9, 268, 582, 34); c.clip();
  c.fillStyle = '#fff8f2'; c.fillRect(9, 9, 268, 582);
  c.fillStyle = '#000071'; c.font = `600 11px ${FONT_UI}`; c.textBaseline = 'alphabetic'; c.fillText('9:41', 31, 40);
  [[4, 4], [6, 6], [8, 8], [10, 10]].forEach(([h], i) => { c.fillRect(204 + i * 5, 41 - h - 1, 3, h + 1); });
  c.beginPath(); c.roundRect(240, 31, 18, 10, 3); c.stroke();
  c.globalAlpha = 1 - k; ecranTraitement(c);
  c.globalAlpha = k; ecranPair(c);
  c.globalAlpha = 1;
  c.restore();
  c.fillStyle = '#000071'; c.beginPath(); c.roundRect(85, 9, 116, 20, [0, 0, 13, 13]); c.fill();
  c.restore();
}

/* le fil : une vague de lumière qui voyage, 100 % au centre, 0 sur le plateau, 100 % au raccord suivant */
const FIL_VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const FIL_FRAG = `
  uniform vec3 uCouleur; uniform float uTemps, uOpacite, uSens; varying vec2 vUv;
  void main(){
    float x = uSens > 0.0 ? vUv.x : 1.0 - vUv.x;
    float t = fract(x - uTemps * 0.4);
    float d = min(t, 1.0 - t); // distance au raccord : 0 au raccord, 0.5 à l'opposé
    float vague = 1.0 - smoothstep(0.0, 0.32, d); // 100, 0, 0, 100 : le raccord se fait sans coupure
    float bord = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    vec3 couleur = uCouleur; // la couleur du liseré de la carte, sans autre teinte
    gl_FragColor = vec4(couleur, (0.16 + 0.84 * vague) * bord * uOpacite);
    #include <colorspace_fragment>
  }`;

scenes.healthanea = async ({ accent }) => {
  const icones = await Promise.all(ACTEURS.map((a) => chargerIcone(a.icone)));

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
  const racine = new T.Group();
  scene.add(racine);
  scene.add(new T.AmbientLight(0xffffff, 0.9));
  const lampe = new T.DirectionalLight(0xffffff, 1.3);
  lampe.position.set(-3, 5, 7);
  scene.add(lampe);

  const lueur = halo(accent);
  lueur.scale.set(8, 8, 1); lueur.position.z = -1.5;
  racine.add(lueur);

  /* le téléphone du patient */
  const ecran = face(286 * S, 600 * S, 42 * S, (c, W, H, k = 0) => dessinerTelephone(c, k));
  const telephone = slab({ w: 2.4, h: 5.035, d: 0.2, r: 0.352, accent: new T.Color(accent), face: ecran, corps: 0x000071, basique: true });
  racine.add(telephone.group);

  /* les acteurs : la carte du prototype, à l'identique */
  const tuiles = ACTEURS.map((a, i) => {
    const f = face(141 * S, 172 * S, 10 * S, (c) => dessinerCarte(c, icones[i], a.nom));
    const s = slab({ w: 1.3, h: 1.586, d: 0.05, r: 0.092, accent: new T.Color(accent), face: f, corps: 0xebd9d6, basique: true, sansLiseré: true });
    racine.add(s.group);

    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(new Float32Array(12), 3));
    geo.setAttribute('uv', new T.BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]), 2));
    geo.setIndex([0, 1, 2, 2, 1, 3]);
    const fil = new T.Mesh(geo, new T.ShaderMaterial({
      vertexShader: FIL_VERT, fragmentShader: FIL_FRAG, transparent: true, depthWrite: false, side: T.DoubleSide,
      uniforms: { uCouleur: { value: new T.Color(accent) },uTemps: { value: 0 }, uOpacite: { value: 0 }, uSens: { value: a.sens } },
    }));
    fil.frustumCulled = false;
    racine.add(fil);
    return { ...s, a, fil, geo };
  });

  let kPrecedent = -1;
  const A = new T.Vector3(), B = new T.Vector3();

  return {
    scene, camera,
    resize(aspect) {
      camera.aspect = aspect;
      camera.position.set(0, 0.7, 3.78 / (Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * aspect));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    },
    update(p, t, pointeur) {
      racine.rotation.y = pointeur.x * 0.2;
      racine.rotation.x = -pointeur.y * 0.1;
      telephone.group.rotation.y = -0.1 + Math.sin(t * 0.6) * 0.03 * p;
      telephone.group.position.y = Math.sin(t * 0.9) * 0.05 * p;
      lueur.material.opacity = mix(0.12, 0.38, p);

      let kEcran = 0;
      tuiles.forEach((u, i) => {
        const k = ease(p * 1.7 - i * 0.14);
        const [x, y, z, ry] = u.a.pos, [rx0, ry0, rz0, rrz, rry] = u.a.repos;
        u.group.position.set(mix(rx0, x, k), mix(ry0, y, k) + Math.sin(t * 1.1 + i) * 0.05 * k, mix(rz0, z, k));
        u.group.rotation.set(0, mix(rry, ry, k), mix(rrz, 0, k));
        u.group.scale.setScalar(mix(0.82, 1, k));
        u.mats[0].opacity = u.mats[2].opacity = mix(0.45, 1, k);

        const cote = Math.sign(x), py = u.group.position.y;
        A.set(u.group.position.x - cote * 0.7, py, u.group.position.z);
        B.set(cote * 1.24, py, 0);
        const e = 0.04; // demi-épaisseur du fil
        const pos = u.geo.attributes.position;
        pos.setXYZ(0, A.x, A.y + e, A.z); pos.setXYZ(1, A.x, A.y - e, A.z);
        pos.setXYZ(2, B.x, B.y + e, B.z); pos.setXYZ(3, B.x, B.y - e, B.z);
        pos.needsUpdate = true;
        const m = u.fil.material.uniforms;
        m.uOpacite.value = k * k; m.uTemps.value = t;
        if (i === TUILE_COMMUNAUTE) kEcran = k;
      });
      if (Math.abs(kEcran - kPrecedent) > 0.02) { ecran.redraw(kEcran); kPrecedent = kEcran; }
    },
  };
};

/* ───────── SHIFT Prime : un comité exécutif, et ses équipes six étages plus bas ─────────
   La pyramide de l'étude de cas (assets/shift-pyramide.png), reconstruite à ses mesures. Au repos elle est coupée
   à la ligne « Décision et Arbitrage / Action » ; au survol les deux moitiés se rejoignent et la lumière descend. */

const U = 0.00787;               // unités 3D par pixel de l'image d'origine (940 de large)
const P = (px, py) => [(px - 470) * U, (385 - py) * U];
const DEMI = (py) => 0.555 * (py - 45); // demi-largeur de la pyramide à la hauteur py (une seule pente pour tous les niveaux)

const COUCHES = [
  { nom: ['CEO &', 'EXCOM'], haut: 45, bas: 220, couleur: '#e4d05d', moitie: 'haut', cy: 165 },
  { nom: ['Business Group'], haut: 227, bas: 328, couleur: '#e49c5d', moitie: 'haut', cy: 277 },
  { nom: ['Business Unit'], haut: 333, bas: 432, couleur: '#e49c5d', moitie: 'haut', cy: 382 },
  { nom: ['Program Owner', '(Shift Leader)'], haut: 443, bas: 538, couleur: '#e45d5d', moitie: 'bas', cy: 490 },
  { nom: ['Project Manager'], haut: 545, bas: 635, couleur: '#e45d5d', moitie: 'bas', cy: 590 },
  { nom: ['Team members'], haut: 640, bas: 726, couleur: '#e45d5d', moitie: 'bas', cy: 683 },
];

/* les quatre fonctions autour du sommet : quatre parallélogrammes */
const FONCTIONS = [
  { nom: ['Global', 'Offer'], couleur: '#3fbfc6', pts: [[150, 168], [270, 168], [215, 270], [97, 270]] },
  { nom: ['Local', 'Offer'], couleur: '#3fbfc6', pts: [[273, 168], [395, 168], [340, 270], [222, 270]] },
  { nom: ['Finance'], couleur: '#ff31a0', pts: [[553, 168], [668, 168], [724, 270], [606, 270]] },
  { nom: ['Design'], couleur: '#6330fa', pts: [[678, 168], [795, 168], [850, 270], [730, 270]] },
];

/* polygone aux angles arrondis (points en unités 3D) */
function polygone(pts, r) {
  const s = new T.Shape(), n = pts.length, at = (i) => pts[(i + n) % n];
  const vers = (a, b, d) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = Math.min(d, L / 2) / L; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
  for (let i = 0; i < n; i++) {
    const p = at(i), a = vers(p, at(i - 1), r), b = vers(p, at(i + 1), r);
    if (i === 0) s.moveTo(a[0], a[1]); else s.lineTo(a[0], a[1]);
    s.quadraticCurveTo(p[0], p[1], b[0], b[1]);
  }
  s.closePath();
  return s;
}

/* une pièce pleine : couleur à plat sur les faces, un ton plus sombre sur la tranche */
function piece(pts, couleur) {
  const c = new T.Color(couleur);
  return new T.Mesh(
    new T.ExtrudeGeometry(polygone(pts, 0.07), { depth: 0.14, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 1, curveSegments: 6 }).translate(0, 0, -0.07),
    [new T.MeshBasicMaterial({ color: c }), new T.MeshBasicMaterial({ color: c.clone().multiplyScalar(0.7) })]
  );
}

/* un texte posé sur la scène (fond transparent) */
function etiquette({ lignes, w, h, px, couleur = '#fff', align = 'center' }) {
  const PX = 220, cv = document.createElement('canvas');
  cv.width = Math.round(w * PX); cv.height = Math.round(h * PX);
  const c = cv.getContext('2d');
  c.font = `600 ${px}px Inter, system-ui, sans-serif`; c.fillStyle = couleur; c.textBaseline = 'middle'; c.textAlign = align;
  const x = align === 'left' ? 4 : cv.width / 2;
  lignes.forEach((l, i) => c.fillText(l, x, cv.height / 2 + (i - (lignes.length - 1) / 2) * px * 1.25));
  const tex = new T.CanvasTexture(cv); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
  return new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
}

/* le puzzle : où chaque pièce gît quand l'organisation est en tas, au milieu, sans ordre [x, y, z, rotation z, rotation y, rotation x].
   Le CEO & EXCOM est le plus en avant : c'est la seule pièce qu'on reconnaît tout de suite. */
const TAS = [
  [0.2, 0.3, 1.3, 0.5, 0.15, 0.1],       // CEO & EXCOM (au premier plan)
  [-0.6, 0.6, 0.2, -0.4, -0.3, 0.2],     // Business Group
  [0.7, -0.2, 0.5, 0.7, 0.3, -0.2],      // Business Unit
  [-0.4, -0.5, -0.1, -0.8, -0.3, 0.15],  // Program Owner
  [0.5, 0.5, -0.3, 1.0, 0.35, -0.1],     // Project Manager
  [-0.1, -0.1, -0.6, -0.5, 0.2, 0.25],   // Team members
  [-0.9, 0.0, 0.7, 0.9, 0.4, 0.2],       // Global Offer
  [0.9, 0.7, 0.3, -0.9, -0.4, -0.2],     // Local Offer
  [-0.3, 0.9, 0.8, -0.3, 0.3, 0.1],      // Finance
  [0.4, -0.7, 0.9, 0.4, -0.3, -0.15],    // Design
];

/* retour en place avec un léger rebond */
const claque = (x) => { x = Math.min(1, Math.max(0, x)); return 1 + 2.1 * Math.pow(x - 1, 3) + 1.1 * Math.pow(x - 1, 2); };

scenes.shift = async ({ accent }) => {
  const DEMI_LARGEUR = 3.4; // la pyramide occupe presque toute la largeur de la carte
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
  const racine = new T.Group();
  scene.add(racine);

  const lueur = halo(accent);
  lueur.scale.set(9, 9, 1); lueur.position.z = -1.5;
  racine.add(lueur);

  /* chaque pièce tourne autour de son propre centre : on la monte dans un groupe posé sur son centroïde */
  const pieces = [];
  const ajouter = (pts3d, couleur, nom, taille, centre, repos) => {
    const mesh = piece(pts3d, couleur);
    const cx = pts3d.reduce((s, p) => s + p[0], 0) / pts3d.length;
    const cy = pts3d.reduce((s, p) => s + p[1], 0) / pts3d.length;
    mesh.position.set(-cx, -cy, 0);
    const e = etiquette({ lignes: nom, w: taille[0], h: taille[1], px: taille[2] });
    e.position.set(centre[0] - cx, centre[1] - cy, 0.1);
    const g = new T.Group();
    g.add(mesh, e);
    racine.add(g);
    pieces.push({ g, cx, cy, repos: [repos[0] - cx, repos[1] - cy, repos[2], repos[3], repos[4], repos[5]] }); // de la position en tas à la place finale
  };

  COUCHES.forEach((n, i) => {
    const pts = n.haut === 45
      ? [P(470, 45), P(470 + DEMI(n.bas), n.bas), P(470 - DEMI(n.bas), n.bas)]
      : [P(470 - DEMI(n.haut), n.haut), P(470 + DEMI(n.haut), n.haut), P(470 + DEMI(n.bas), n.bas), P(470 - DEMI(n.bas), n.bas)];
    ajouter(pts, n.couleur, n.nom, [2.6, 0.8, 34], P(472, n.cy), TAS[i]);
  });
  FONCTIONS.forEach((f, i) => {
    const cx = f.pts.reduce((s, p) => s + p[0], 0) / 4, cy = f.pts.reduce((s, p) => s + p[1], 0) / 4;
    ajouter(f.pts.map(([x, y]) => P(x, y)), f.couleur, f.nom, [1.3, 0.7, 30], P(cx, cy), TAS[COUCHES.length + i]);
  });

  /* la ligne décision / action et ses mentions : elles n'existent qu'une fois la pyramide reconstituée, derrière elle */
  const [ax, ay] = P(90, 437), [bx] = P(858, 437);
  const ligne = new T.Line(
    new T.BufferGeometry().setFromPoints([new T.Vector3(ax, ay, 0), new T.Vector3(bx, ay, 0)]),
    new T.LineDashedMaterial({ color: 0xece7ff, dashSize: 0.1, gapSize: 0.07, transparent: true, opacity: 0 })
  );
  ligne.computeLineDistances();
  const mention = (lignes, w, [x, y], decalX) => {
    const e = etiquette({ lignes, w, h: 0.3, px: 28, couleur: '#ece7ff', align: 'left' });
    e.position.set(x + decalX, y, 0); e.material.opacity = 0; return e;
  };
  const decision = mention(['Décision et Arbitrage'], 2.2, P(88, 418), 1.1);
  const action = mention(['Action'], 1.0, P(88, 458), 0.5);
  const marketing = mention(['Marketing'], 1.6, P(207, 150), 0.8);
  const fond = new T.Group();
  fond.add(ligne, decision, action, marketing);
  fond.position.z = -0.14;
  racine.add(fond);

  return {
    scene, camera,
    resize(aspect) {
      camera.aspect = aspect;
      camera.position.set(0, 0.5, DEMI_LARGEUR / (Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * aspect));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    },
    update(p, t, pointeur) {
      racine.rotation.y = pointeur.x * 0.15;
      racine.rotation.x = -pointeur.y * 0.08;
      lueur.material.opacity = mix(0.12, 0.34, p);
      pieces.forEach((u, i) => {
        const r = 1 - claque(p * 1.5 - i * 0.05);
        const [dx, dy, dz, rz, ry, rx] = u.repos;
        u.g.position.set(u.cx + dx * r, u.cy + dy * r, dz * r);
        u.g.rotation.set(rx * r, ry * r, rz * r);
      });
      const a = ease((p - 0.65) / 0.35);
      ligne.material.opacity = 0.55 * a;
      decision.material.opacity = action.material.opacity = marketing.material.opacity = a;
    },
  };
};

/* ───────── B.I Solution : de la surcharge à la décision ─────────
   Au repos : un mur d'Excel plein cadre (les captures floutées) et un chiffre rouge qui ne veut rien dire, sans unité ni référence.
   Au survol : le mur disparaît tout à fait. Le même chiffre se pose sur sa carte, à côté de l'autre, en trois étapes : la
   question, la lecture des chiffres, l'action. */

const FEUILLES = 6; // assets/bi-solution/excel-1.jpg … excel-6.jpg : captures de l'Excel d'origine, floutées
const FONT_ITALIQUE = '"Instrument Serif", Georgia, serif';

/* un hasard qui ne change jamais : le mur est le même à chaque visite */
const graine = (s) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

const chargerFeuille = (n) => avecRetries((essai) => new Promise((ok, ko) => {
  const adresse = new URL(`./assets/bi-solution/excel-${n}.jpg`, import.meta.url).href;
  new T.TextureLoader().load(essai === 1 ? adresse : `${adresse}?r=${essai}`, (tex) => {
    tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4; ok(tex);
  }, undefined, ko);
}));

/* un plan dont la texture est redessinée à la taille exacte où il s'affiche : texte net, sans rééchantillonnage */
function nette(w, h, dw, dh, dessiner) {
  const cv = document.createElement('canvas'), c = cv.getContext('2d');
  const tex = new T.CanvasTexture(cv);
  tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
  /* sans écriture de profondeur et avec un ordre de dessin fixe : deux plans transparents proches ne se disputent plus la place d'une image à l'autre */
  const mesh = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  mesh.renderOrder = 100;
  let px = 0;
  mesh.userData.redessiner = (largeurPx) => {
    const W = Math.max(96, Math.round(largeurPx));
    if (W === px) return;
    px = W; cv.width = W; cv.height = Math.round(W * dh / dw);
    c.setTransform(W / dw, 0, 0, W / dw, 0, 0); c.clearRect(0, 0, dw, dh);
    dessiner(c);
    tex.dispose(); tex.needsUpdate = true;
  };
  return mesh;
}

/* une carte de chiffre : la question à laquelle il répond, le chiffre, son évolution, ses deux lignes (couleurs de la fiche).
   Marges égales sur les trois côtés (16), y compris sous la dernière ligne. */
function dessinerChiffre(c, { titre, note, valeur, evolution, bon, ligne1, ligne2 }) {
  c.fillStyle = '#efefef'; c.beginPath(); c.roundRect(0, 0, 320, 222, 12); c.fill();
  c.textBaseline = 'alphabetic';
  c.fillStyle = '#333'; c.font = `600 14px ${FONT_UI}`; c.fillText(titre, 16, 27);
  c.fillStyle = '#6a6a6a'; c.font = `400 11px ${FONT_UI}`; c.fillText(note, 16, 44);
  c.fillStyle = '#222'; c.font = `600 52px ${FONT_UI}`; c.fillText(valeur, 14, 100);
  c.fillStyle = bon ? '#9af09a' : '#f8c9c9'; c.beginPath(); c.roundRect(16, 114, 140, 21, 10.5); c.fill();
  c.fillStyle = bon ? '#1b6e1b' : '#b3261e'; c.font = `500 11px ${FONT_UI}`; c.textBaseline = 'middle'; c.fillText(evolution, 25, 124.5);
  c.fillStyle = '#c9e4d9'; c.beginPath(); c.roundRect(16, 148, 288, 26, 6); c.fill();
  c.fillStyle = '#333'; c.font = `400 13px ${FONT_UI}`; c.fillText(ligne1[0], 26, 161.5);
  c.textAlign = 'right'; c.fillText(ligne1[1], 294, 161.5); c.textAlign = 'left';
  c.fillStyle = '#444'; c.beginPath(); c.roundRect(16, 180, 288, 26, 6); c.fill();
  c.fillStyle = '#fff'; c.fillText(ligne2[0], 26, 193.5);
  c.textAlign = 'right'; c.fillText(ligne2[1], 294, 193.5); c.textAlign = 'left';
}

/* le titre : ce que l'écran explique, en grand et en blanc, aligné à gauche sur le bord des cartes */
const TITRE_SURVOL = 'Des chiffres structurés pour poser les bonnes questions et décider.';
function dessinerTitre(c) {
  c.fillStyle = '#fff'; c.font = `400 36px ${FONT_ITALIQUE}`; c.textAlign = 'left'; c.textBaseline = 'middle';
  coupe(c, TITRE_SURVOL, 470).forEach((l, i, a) => c.fillText(l, 11.5, 22 + i * 40));
}

/* le contenu parle d'une seule voix : la question et la réponse ont exactement la même fonte (famille, graisse, taille, couleur) */
const fonteContenu = (c) => { c.fillStyle = '#fff'; c.font = `600 22px ${FONT_UI}`; c.textAlign = 'left'; c.textBaseline = 'middle'; };

/* la question concrète que les chiffres tranchent, en deux lignes : on coupe après la virgule */
function dessinerQuestion(c) {
  fonteContenu(c);
  c.fillText('Pousser le volume maintenant,', 11.5, 17);
  c.fillText('ou protéger la marge du contrat\u202f?', 11.5, 47);
}

/* la réponse : la règle posée comme une question en gris, puis ce qu'on en fait, alignés à gauche */
function dessinerAction(c) {
  c.textAlign = 'left'; c.textBaseline = 'middle';
  c.fillStyle = 'rgba(255,255,255,0.74)'; c.font = `400 16px ${FONT_UI}`;
  c.fillText("Chiffre d'affaires au-dessus de 100\u202f% et marge sous le plan\u202f?", 11.5, 14);
  fonteContenu(c);
  c.fillText('Revoir les prix avant de pousser davantage.', 11.5, 48);
}

/* le chiffre sans contexte : rouge, avec son contour blanc de papier collé, ce qu'il mesure, et ce qui lui manque */
function dessinerChiffreRouge(c) {
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = `600 150px ${FONT_UI}`;
  c.lineWidth = 16; c.strokeStyle = '#fff'; c.strokeText('116 %', 200, 92);
  c.fillStyle = '#e0201a'; c.fillText('116 %', 200, 92);
  /* ce que le chiffre mesure, tel qu'il est */
  c.font = `600 21px ${FONT_UI}`;
  const mesure = 'CA réel / budget du mois', L = c.measureText(mesure).width + 36;
  c.fillStyle = 'rgba(255,255,255,0.95)'; c.beginPath(); c.roundRect(200 - L / 2, 164, L, 42, 14); c.fill();
  c.fillStyle = '#222'; c.fillText(mesure, 200, 185.5);
  /* ce qui manque : le contexte, et la décision */
  c.save(); c.translate(200, 258); c.rotate(-0.03);
  c.font = `italic 600 24px ${FONT_UI}`;
  const q1 = 'Avec quel contexte ?', q2 = 'Pour quelle décision ?', m = Math.max(c.measureText(q1).width, c.measureText(q2).width) + 44;
  c.fillStyle = '#e0201a'; c.beginPath(); c.roundRect(-m / 2, -36, m, 72, 8); c.fill();
  c.fillStyle = '#fff'; c.fillText(q1, 0, -12); c.fillText(q2, 0, 14); c.restore();
  c.restore();
}

scenes.bi = async ({ accent }) => {
  const feuilles = await Promise.all(Array.from({ length: FEUILLES }, (_, i) => chargerFeuille(i + 1)));
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
  const racine = new T.Group();
  scene.add(racine);
  const DEMI = 3.6;

  const lueur = halo(accent);
  lueur.scale.set(9, 9, 1); lueur.position.z = -3;
  racine.add(lueur);

  /* la surcharge : un mur de tableaux plein cadre, puis quelques feuilles posées par-dessus */
  const mur = new T.Group();
  racine.add(mur);
  const hasard = graine(5);
  const toutes = [];
  const feuille = (i, x, y, z, w, rz) => {
    const tex = feuilles[i], h = w * tex.image.height / tex.image.width;
    const s = slab({ w, h, d: 0.04, r: 0.05, accent: new T.Color(accent), face: { tex }, corps: 0x2a2a2a, basique: true, sansLiseré: true });
    s.group.position.set(x, y, z); s.group.rotation.z = rz;
    s.mats[2].color.setScalar(0.8); s.mats[0].color.setScalar(0.8);
    /* ordre de dessin fixé feuille par feuille : deux feuilles qui se recouvrent ne changent plus de dessus */
    const rang = toutes.length;
    s.group.traverse((o) => { if (o.isMesh) o.renderOrder = rang * 3 + (o === s.group.children[2] ? 2 : o === s.group.children[1] ? 1 : 0); }); /* sur les maillages seulement : un groupe qui a un ordre l'impose à tout ce qu'il contient, avant leur ordre propre */
    mur.add(s.group);
    toutes.push(s);
  };
  [[-1.95, 2.55], [1.95, 2.55], [-1.95, 0], [1.95, 0], [-1.95, -2.55], [1.95, -2.55]]
    .forEach(([x, y], i) => feuille(i, x, y, (i % 2) * 0.3 - 0.3, 3.95, (hasard() - 0.5) * 0.05));
  [[-1.3, 0.9, 4, 3.3], [1.4, -0.8, 1, 3.2], [-0.4, -1.7, 5, 3.4], [0.9, 1.7, 2, 3.2]]
    .forEach(([x, y, i, w]) => feuille(i, x, y, 0.45 + hasard() * 0.2, w, (hasard() - 0.5) * 0.3));
  mur.rotation.set(0.06, -0.14, 0);

  /* le chiffre rouge, puis le titre, la question, les deux chiffres et la réponse */
  const rouge = nette(4.2, 4.2 * 300 / 400, 400, 300, dessinerChiffreRouge);
  rouge.renderOrder = 120;
  const carteA = nette(3.05, 3.05 * 222 / 320, 320, 222, (c) => dessinerChiffre(c, { titre: "Performance du chiffre d'affaires", note: 'Vend-on au rythme du budget ?', valeur: '116 %', evolution: '↓ 8 % vs mois dernier', bon: false, ligne1: ['CA réel', 'CHF 290 k'], ligne2: ['Budget', 'CHF 250 k'] }));
  const carteB = nette(3.05, 3.05 * 222 / 320, 320, 222, (c) => dessinerChiffre(c, { titre: 'Marge commerciale réelle', note: 'Le CA est-il acheté à coups de baisse de prix ?', valeur: '22 %', evolution: '↑ 12 % vs mois dernier', bon: true, ligne1: ['Marge commerciale', 'CHF 63,8 k'], ligne2: ["Chiffre d'affaires", 'CHF 290 k'] }));
  const titre = nette(6.4, 6.4 * 84 / 640, 640, 84, dessinerTitre);
  const question = nette(6.4, 6.4 * 64 / 640, 640, 64, dessinerQuestion);
  const action = nette(6.4, 6.4 * 66 / 640, 640, 66, dessinerAction);
  [rouge, carteA, carteB, titre, question, action].forEach((m) => racine.add(m));
  [carteA, carteB, titre, question, action].forEach((m) => { m.material.opacity = 0; m.visible = false; });

  /* la pile, centrée en hauteur : le titre, la question, les deux chiffres, la réponse */
  const HT = 6.4 * 84 / 640, HQ = 6.4 * 64 / 640, HC = 3.05 * 222 / 320, HA = 6.4 * 66 / 640, G0 = 0.4, G1 = 0.26, G2 = 0.3;
  const T0 = (HT + G0 + HQ + G1 + HC + G2 + HA) / 2;
  const Y_T = T0 - HT / 2, Y_Q = T0 - HT - G0 - HQ / 2, Y_C = T0 - HT - G0 - HQ - G1 - HC / 2, Y_A = T0 - HT - G0 - HQ - G1 - HC - G2 - HA / 2;
  const plans = [[rouge, 4.2, 1.1], [carteA, 3.05, 1.07], [carteB, 3.05, 1.07], [titre, 6.4, 1.07], [question, 6.4, 1.07], [action, 6.4, 1.07]];

  return {
    scene, camera,
    resize(aspect, ecran) {
      camera.aspect = aspect;
      const dist = DEMI / (Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * aspect);
      camera.position.set(0, 0.1, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      const pxParUnite = ((ecran?.px ?? 600) / (2 * DEMI)) * (ecran?.dpr ?? 1);
      plans.forEach(([m, w, zoom]) => m.userData.redessiner(w * pxParUnite * zoom));
    },
    update(p, t, pointeur) {
      /* pas d'inclinaison au pointeur ici : du texte net doit rester parallèle à l'écran, sans scintiller */
      lueur.material.opacity = mix(0.1, 0.22, p);

      /* 1. le mur s'efface tout à fait, et le chiffre rouge s'en va avec lui : plus rien du chaos quand l'ordre arrive */
      const fondu = 1 - ease(p * 3.2);
      mur.visible = fondu > 0.01;
      mur.scale.setScalar(mix(1.12, 1, fondu)); mur.position.z = mix(-2.5, 0, fondu);
      toutes.forEach((s) => { s.mats[0].opacity = s.mats[2].opacity = fondu; });
      const sortie = ease(p * 2.8);
      rouge.visible = sortie < 0.995;
      rouge.position.set(mix(0, -1.6, sortie), mix(0.1, Y_C + 0.2, sortie), mix(1.5, 0.9, sortie));
      rouge.scale.setScalar(mix(1, 0.3, sortie));
      rouge.material.opacity = 1 - sortie;

      const aff = (m, o) => { const v = Math.min(1, Math.max(0, o)); m.material.opacity = v; m.visible = v > 0.005; };
      const monte = (m, y, d) => m.position.set(0, y - (1 - d) * 0.35, 0.8);
      /* 2. le titre, puis la question qu'il éclaire */
      const dt = ease((p - 0.28) / 0.25), dq = ease((p - 0.38) / 0.25);
      monte(titre, Y_T, dt); aff(titre, dt);
      monte(question, Y_Q, dq); aff(question, dq);
      /* 3. les deux chiffres */
      const dA = ease((p - 0.45) / 0.25), kB = claque((p - 0.55) / 0.4);
      carteA.position.set(-1.6, Y_C, 0.8); aff(carteA, dA);
      carteB.position.set(mix(4.6, 1.6, kB), Y_C, 0.8); aff(carteB, kB * 1.6);
      /* 4. la réponse, qui arrive en dernier */
      const da = ease((p - 0.72) / 0.28);
      monte(action, Y_A, da); aff(action, da);
    },
  };
};

/* ───────── Proshop : de l'affrontement à l'alliance ─────────
   Trois pièces identiques, au repos comme au survol : le commercial, le ProShop, le client.
   Au repos : le commercial et le ProShop s'affrontent (deux épées entre eux) ; le client, dessous, se demande lequel choisir.
   Au survol : l'affrontement s'arrête. Le commercial et le ProShop sont dans une même pièce, qui tourne, deux faces d'un même objet ;
   la pièce du client tourne dans l'autre sens, avec un gros cœur au dos. La liaison descend tout en bas.
   Les icônes sont celles de assets/proshop/. */

const R_PIECE = 0.92; // le rayon de toutes les pièces : elles ont toutes la même taille

function dessinerCoeur(c) {
  c.lineJoin = 'round';
  const trace = () => { c.beginPath(); c.moveTo(64, 112); c.bezierCurveTo(8, 74, 14, 22, 64, 44); c.bezierCurveTo(114, 22, 120, 74, 64, 112); c.closePath(); };
  trace(); c.lineWidth = 12; c.strokeStyle = '#fff'; c.stroke();
  trace(); c.fillStyle = '#ff3b6b'; c.fill();
  c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(40, 54, 9, 14, -0.7, 0, 7); c.fill();
}

/* la bulle du client : la question qu'un installateur se pose vraiment au moment de commander */
function dessinerBulle(c) {
  c.fillStyle = '#fff'; c.beginPath(); c.roundRect(2, 2, 296, 84, 22); c.fill();
  c.beginPath(); c.moveTo(134, 85); c.lineTo(150, 112); c.lineTo(166, 85); c.closePath(); c.fill();
  c.fillStyle = '#0b0d10'; c.font = `600 24px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('Pour cette commande,', 150, 31); c.fillText('je choisis lequel ?', 150, 60);
}

/* les deux épées entre les deux adversaires, sans fond */
function dessinerEpees(c, icone) {
  const { img, sx, sy, sw, sh } = icone, k = Math.min(190 / sw, 190 / sh);
  c.drawImage(img, sx, sy, sw, sh, 100 - (sw * k) / 2, 100 - (sh * k) / 2, sw * k, sh * k);
}

/* les deux faces d'une pièce : un disque blanc avec le seul pictogramme, ou un gros cœur */
function dessinerFacePiece(c, icone) {
  const { img, sx, sy, sw, sh } = icone, R = 128;
  c.fillStyle = '#fff'; c.beginPath(); c.arc(R, R, R, 0, 7); c.fill();
  const k = Math.min(168 / sw, 168 / sh);
  c.drawImage(img, sx, sy, sw, sh, R - (sw * k) / 2, R - (sh * k) / 2, sw * k, sh * k);
}
function dessinerFaceCoeur(c) {
  c.fillStyle = '#fff'; c.beginPath(); c.arc(128, 128, 128, 0, 7); c.fill();
  c.save(); c.translate(128, 134); c.scale(1.7, 1.7); c.translate(-64, -76); dessinerCoeur(c); c.restore();
}

/* les petites légendes du repos, sous chaque pièce */
const dessinerLegende = (texte) => (c) => {
  c.fillStyle = 'rgba(255,255,255,0.92)'; c.font = `500 17px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(texte, 100, 15);
};

/* le titre, et la liaison tout en bas */
function dessinerTitreAlliance(c) {
  c.fillStyle = '#fff'; c.font = `italic 400 46px ${FONT_ITALIQUE}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('Le meilleur des deux mondes.', 320, 26);
}
function dessinerLienAlliance(c) {
  c.fillStyle = '#fff'; c.font = `500 27px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('Le commercial et le ProShop', 320, 24);
  c.fillText('au service du client et de sa satisfaction.', 320, 60);
}

const ROND = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, '#fff'); g.addColorStop(0.4, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c; })();

scenes.proshop = async ({ accent }) => {
  const [iCom, iCli, iSite, iEpees] = await Promise.all(['commercial', 'client', 'site', 'epees'].map((n) => chargerIcone(n, './assets/proshop/')));
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
  const racine = new T.Group();
  scene.add(racine);
  scene.add(new T.AmbientLight(0xffffff, 0.8));
  const lampe = new T.DirectionalLight(0xffffff, 1.5);
  lampe.position.set(-3, 5, 7);
  scene.add(lampe);

  const lueur = halo(accent);
  lueur.scale.set(9, 9, 1); lueur.position.z = -3;
  racine.add(lueur);

  /* une pièce : un disque blanc de chaque côté, une tranche à la couleur du cas */
  const piece = (dessinerA, dessinerB) => {
    const g = new T.Group();
    const tranche = new T.Mesh(new T.CylinderGeometry(R_PIECE, R_PIECE, 0.18, 56), new T.MeshStandardMaterial({ color: new T.Color(accent), roughness: 0.35, metalness: 0.5 }));
    tranche.rotation.x = Math.PI / 2;
    const faceDe = (dessiner, sens) => {
      const f = face(256, 256, 128, dessiner);
      const m = new T.Mesh(new T.CircleGeometry(R_PIECE - 0.045, 56), new T.MeshBasicMaterial({ map: f.tex, transparent: true, toneMapped: false }));
      m.position.z = sens * 0.095; if (sens < 0) m.rotation.y = Math.PI;
      return m;
    };
    g.add(tranche, faceDe(dessinerA, 1), faceDe(dessinerB, -1));
    racine.add(g);
    return g;
  };
  /* le commercial et le ProShop : chacun a le pictogramme de l'autre au dos, pour que la pièce qui les réunit ait ses deux faces */
  const pieceCom = piece((c) => dessinerFacePiece(c, iCom), (c) => dessinerFacePiece(c, iSite));
  const pieceSite = piece((c) => dessinerFacePiece(c, iSite), (c) => dessinerFacePiece(c, iCom));
  const pieceCli = piece((c) => dessinerFacePiece(c, iCli), dessinerFaceCoeur);

  const plan = (w, h, dw, dh, dessiner) => { const m = nette(w, h, dw, dh, dessiner); racine.add(m); return m; };
  const epees = plan(0.95, 0.95, 200, 200, (c) => dessinerEpees(c, iEpees));
  const bulle = plan(2.3, 2.3 * 112 / 300, 300, 112, dessinerBulle);
  const legCom = plan(1.9, 1.9 * 30 / 200, 200, 30, dessinerLegende('Le commercial'));
  const legSite = plan(1.9, 1.9 * 30 / 200, 200, 30, dessinerLegende('Le ProShop'));
  const legCli = plan(1.9, 1.9 * 30 / 200, 200, 30, dessinerLegende('Le client'));
  const titre = plan(6.4, 6.4 * 52 / 640, 640, 52, dessinerTitreAlliance);
  const lien = plan(6.4, 6.4 * 84 / 640, 640, 84, dessinerLienAlliance);
  [titre, lien].forEach((m) => { m.material.opacity = 0; m.visible = false; });
  const plansNets = [[epees, 0.95, 1.07], [bulle, 2.3, 1.07], [legCom, 1.9, 1.07], [legSite, 1.9, 1.07], [legCli, 1.9, 1.07], [titre, 6.4, 1.07], [lien, 6.4, 1.07]];

  /* le feu d'artifice : quatre gerbes de particules, qui repartent en boucle tant que le survol dure */
  const GERBES = [[-2.7, 1.5, 0], [2.7, 1.8, 1], [2.6, -1.3, 2], [-2.6, -1.2, 3], [-0.1, 2.3, 4, 0.5]]; // x, y, décalage de départ, profondeur (la gerbe du haut passe derrière le titre)
  const PAR = 26, couleurs = [0x28e6ff, 0xffea4d, 0xf968a7, 0x2fffb4, 0x9f6eff].map((c) => new T.Color(c));
  const geoF = new T.BufferGeometry();
  geoF.setAttribute('position', new T.BufferAttribute(new Float32Array(GERBES.length * PAR * 3), 3));
  geoF.setAttribute('color', new T.BufferAttribute(new Float32Array(GERBES.length * PAR * 3), 3));
  const artifice = new T.Points(geoF, new T.PointsMaterial({ size: 0.34, map: new T.CanvasTexture(ROND), vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
  artifice.frustumCulled = false; artifice.renderOrder = 50;
  racine.add(artifice);
  const hs = graine(21), direction = Array.from({ length: GERBES.length * PAR }, (_, i) => [(i % PAR) / PAR * Math.PI * 2 + hs() * 0.25, 0.7 + hs() * 0.9, Math.floor(hs() * couleurs.length)]);

  /* repos : la rangée des deux adversaires en haut, le client dessous ; survol : la pièce commune, le client, la liaison en bas */
  const Y_RANGEE = 1.78, X_RANGEE = 1.95, Y_CLIENT = -1.42, Y_SURVOL = 0.2, X_PAIRE = -1.3, X_CLIENT_SURVOL = 1.3;
  let tPrec = 0, rotation = 0;
  return {
    scene, camera,
    resize(aspect, ecran) {
      camera.aspect = aspect;
      const dist = 3.6 / (Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * aspect);
      camera.position.set(0, 0.1, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      const pxParUnite = ((ecran?.px ?? 600) / (2 * 3.6)) * (ecran?.dpr ?? 1);
      plansNets.forEach(([m, w, zoom]) => m.userData.redessiner(w * pxParUnite * zoom));
    },
    update(p, t) {
      lueur.material.opacity = mix(0.12, 0.3, p);
      const aff = (m, o) => { const vv = Math.min(1, Math.max(0, o)); m.material.opacity = vv; m.visible = vv > 0.005; };
      /* la rotation n'avance que pendant le survol, et revient à plat au repos : les pièces se présentent toujours de face */
      rotation += Math.max(0, Math.min(0.05, t - tPrec)) * p; tPrec = t;
      /* l'angle est ramené à la face la plus proche quand on quitte le survol : au plus un demi-tour, jamais le rembobinage de tous les tours accumulés.
         Et les pièces ne se mettent à tourner qu'une fois la fusion faite. */
      const brut = rotation * 0.9, face0 = Math.round(brut / (2 * Math.PI)) * 2 * Math.PI;
      const spin = face0 + (brut - face0) * ease((p - 0.4) / 0.35);

      /* 1. l'affrontement s'arrête : les épées s'effacent, la bulle aussi, les légendes aussi */
      const fin = ease(p * 3.2);
      epees.position.set(0, Y_RANGEE, 0.5); epees.scale.setScalar(mix(1, 1.6, fin)); aff(epees, 1 - fin);
      bulle.position.set(0, -0.03, 0.4); aff(bulle, 1 - ease(p * 3.5));
      const leg = 1 - ease(p * 3.5);
      legCom.position.set(-X_RANGEE, Y_RANGEE - R_PIECE - 0.21, 0.4); aff(legCom, leg);
      legSite.position.set(X_RANGEE, Y_RANGEE - R_PIECE - 0.21, 0.4); aff(legSite, leg);
      legCli.position.set(0, Y_CLIENT - R_PIECE - 0.21, 0.4); aff(legCli, leg);

      /* 2. le commercial et le ProShop glissent l'un vers l'autre et ne font plus qu'une pièce */
      const m = ease((p - 0.15) / 0.4);
      pieceCom.position.set(mix(-X_RANGEE, X_PAIRE, m), mix(Y_RANGEE, Y_SURVOL, m), 0.3);
      pieceCom.rotation.set(0.1 * m, spin, 0);
      pieceSite.position.set(mix(X_RANGEE, X_PAIRE, m), mix(Y_RANGEE, Y_SURVOL, m), mix(0.3, -0.3, m));
      pieceSite.rotation.set(0.1 * m, spin, 0);
      pieceSite.scale.setScalar(Math.max(0.001, 1 - ease((m - 0.55) / 0.45)));
      pieceSite.visible = pieceSite.scale.x > 0.01;

      /* 3. le client monte vers la pièce commune et tourne dans l'autre sens : son envers est un gros cœur */
      const c1 = ease((p - 0.3) / 0.35);
      pieceCli.position.set(mix(0, X_CLIENT_SURVOL, c1), mix(Y_CLIENT, Y_SURVOL, c1), 0.3);
      pieceCli.rotation.set(0.1 * c1, -spin, 0);

      /* 4. le titre au-dessus, la liaison tout en bas, puis le feu d'artifice */
      const dt = ease((p - 0.55) / 0.3);
      titre.position.set(0, 1.95 - (1 - dt) * 0.3, 0.6); aff(titre, dt);
      lien.position.set(0, -1.75, 0.6); aff(lien, ease((p - 0.62) / 0.3));
      const intens = ease((p - 0.6) / 0.3);
      artifice.visible = intens > 0.01;
      const pos = geoF.attributes.position, col = geoF.attributes.color;
      GERBES.forEach(([gx, gy, n, gz = 0.7], g) => {
        const u = ((t * 0.55 + n * 0.37 + 0.4) % 1);
        for (let j = 0; j < PAR; j++) {
          const i = g * PAR + j, [th, vit, ci] = direction[i];
          const r = vit * u * 1.5;
          pos.setXYZ(i, gx + Math.cos(th) * r, gy + Math.sin(th) * r - 0.9 * u * u, gz);
          const fade = 1.7 * Math.pow(1 - u, 1.1) * intens, c = couleurs[(ci + g) % couleurs.length];
          col.setXYZ(i, c.r * fade, c.g * fade, c.b * fade);
        }
      });
      pos.needsUpdate = true; col.needsUpdate = true;
    },
  };
};

/* ───────── Chalon dans la rue : le festivalier dans le brouillard ─────────
   Le fond est la carte de l'application (capture de l'écran Carte, recadrée), avec ses repères numérotés.
   Au repos : la ville est noyée dans le brouillard, le festivalier seul dans une petite clairière, avec une recherche large en haut (« jeudi soir »).
   Au survol : le brouillard se dissipe lentement, en partant de lui, et laisse voir les lieux ; puis le tracé de l'application
   (ronds jaune et ciel cernés de noir) suit les rues jusqu'à la place choisie, et le bandeau jaune d'itinéraire descend sous la recherche.
   Tout est dessiné aux dimensions de l'application (390 px de large). */

const DW = 390;                    // largeur de dessin : celle de l'application
const CARTE = { x: 0, y: 144, w: 828, h: 736 }; // fenêtre de la capture assets/chalon/carte.jpg (828 px de large) reprise ici
const KC = DW / CARTE.w;           // pixels de dessin par pixel de capture
const SUR_CARTE = ([x, y]) => [(x - CARTE.x) * KC, (y - CARTE.y) * KC];
const FESTIVALIER = [160, 772];    // à l'ouest du quartier Saint-Vincent, sur la grande rue en diagonale
/* les rues de la capture : la grande diagonale, la rue qui remonte vers le nord-ouest, puis celle qui repart vers le nord-est, jusqu'à la place du Théâtre (repère 44) */
const TRAJET = [FESTIVALIER, [306, 694], [369, 669], [287, 562], [228, 495], [269, 469], [300, 455]];
const DESTINATION = { repere: [330, 441], nom: 'Place du Théâtre' };
const PAS = 16;                    // distance entre deux ronds du tracé, en pixels de dessin

const chargerImage = (url) => avecRetries((essai) => new Promise((ok, ko) => {
  const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = essai === 1 ? url : `${url}?r=${essai}`;
}));

/* bruit de valeurs, pour les volutes du brouillard */
const alea = (x, y, s) => { const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); };
const bruit = (x, y, s) => {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  return mix(mix(alea(ix, iy, s), alea(ix + 1, iy, s), ux), mix(alea(ix, iy + 1, s), alea(ix + 1, iy + 1, s), ux), uy);
};
const volutes = (x, y, s) => 0.55 * bruit(x / 70, y / 70, s) + 0.3 * bruit(x / 34, y / 34, s + 5) + 0.15 * bruit(x / 16, y / 16, s + 9);

scenes.chalon = async () => {
  const [carte, cloche, iFest, iFermer] = await Promise.all([
    chargerImage(new URL('./assets/chalon/carte.jpg', import.meta.url).href),
    chargerImage(new URL('./prototypes/chalon-dans-la-rue/assets/notification.svg', import.meta.url).href),
    chargerIcone('festivalier', './assets/chalon/'),
    chargerIcone('fermer', './prototypes/chalon-dans-la-rue/assets/'),
  ]);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
  const racine = new T.Group();
  scene.add(racine);

  /* un seul plan, qui recouvre toute la zone, repeint quand la progression change */
  const cv = document.createElement('canvas'), c = cv.getContext('2d');
  const tex = new T.CanvasTexture(cv);
  tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearFilter; tex.generateMipmaps = false;
  const plan = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  racine.add(plan);

  /* le tracé, découpé en ronds régulièrement espacés le long des rues */
  const pts = TRAJET.map(SUR_CARTE), ronds = [];
  let reste = PAS, longueur = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0);
    longueur += L;
    let t = reste;
    while (t < L) { ronds.push([x0 + (x1 - x0) * t / L, y0 + (y1 - y0) * t / L]); t += PAS; }
    reste = t - L;
  }
  const rondsVisibles = ronds;
  const metres = Math.round(longueur / KC / 10) * 10;   // un pixel de capture vaut environ un mètre (carte au zoom 15,6)
  const minutes = Math.max(1, Math.round(metres / 75)); // 4,5 km/h, comme l'application

  /* le brouillard : calculé en basse définition, puis agrandi, donc doux */
  const fogCv = document.createElement('canvas'), fog = fogCv.getContext('2d');
  let champ = null, aspect = 1, pCourant = 0, pPeint = -1;
  const batirBrouillard = () => {
    const DH = DW / aspect, gw = 156, gh = Math.round(gw / aspect);
    fogCv.width = gw; fogCv.height = gh;
    const [fx, fy] = SUR_CARTE(FESTIVALIER);
    champ = { d: new Float32Array(gw * gh), a: new Float32Array(gw * gh), b: new Float32Array(gw * gh), img: fog.createImageData(gw, gh) };
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
      const x = (i + 0.5) / gw * DW, y = (j + 0.5) / gh * DH, o = j * gw + i;
      champ.d[o] = Math.hypot(x - fx, y - fy); champ.a[o] = volutes(x, y, 1); champ.b[o] = volutes(x + 90, y - 40, 7);
    }
  };
  const lisse = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };

  const peindre = (p) => {
    pPeint = p;
    const k = cv.width / DW, DH = DW / aspect;
    c.setTransform(k, 0, 0, k, 0, 0); c.clearRect(0, 0, DW, DH);
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    const [ux, uy] = SUR_CARTE(FESTIVALIER);

    /* 1. la carte de l'application */
    c.drawImage(carte, 0, 0, CARTE.w, CARTE.h, 0, 0, DW, DW * CARTE.h / CARTE.w); // le fichier est déjà recadré sur la fenêtre

    /* 2. le tracé : ronds de 10 px, jaune et ciel en alternance, cernés de noir, qui suivent les rues */
    const n = Math.min(1, Math.max(0, (p - 0.3) / 0.42)) * (rondsVisibles.length + 1);
    rondsVisibles.forEach(([x, y], i) => {
      const s = ease(n - i); if (s <= 0.01) return;
      c.fillStyle = i % 2 ? '#c7f3fe' : '#ffff99'; c.beginPath(); c.arc(x, y, 5 * s, 0, 7); c.fill();
      c.strokeStyle = '#000'; c.lineWidth = 2; c.stroke();
    });
    const [dx, dy] = SUR_CARTE(DESTINATION.repere), a = claque((p - 0.7) / 0.1);
    if (a > 0.01) { c.strokeStyle = '#ffff99'; c.lineWidth = 3; c.beginPath(); c.arc(dx, dy, 13 * (0.8 + 0.2 * a), 0, 7); c.stroke(); }

    /* la cloche des actualités : rond blanc à droite de la recherche, 44 px, icône de 28 px, pastille du nombre de nouveautés. Elle est sous le brouillard. */
    const cx0 = DW - 18 - 44;
    c.save(); c.shadowColor = 'rgba(0,0,0,0.25)'; c.shadowBlur = 4; c.shadowOffsetY = 4;
    c.fillStyle = '#fbfbfb'; c.beginPath(); c.arc(cx0 + 22, 16 + 22, 22, 0, 7); c.fill(); c.restore();
    c.drawImage(cloche, cx0 + 8, 16 + 8, 28, 28);
    c.fillStyle = '#fbfbfb'; c.beginPath(); c.arc(cx0 + 44 - 2 - 9, 16 + 2 + 9, 11, 0, 7); c.fill();
    c.fillStyle = '#f4a1a0'; c.beginPath(); c.arc(cx0 + 44 - 2 - 9, 16 + 2 + 9, 9, 0, 7); c.fill();
    c.fillStyle = '#000'; c.font = `700 10px ${FONT_UI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('8', cx0 + 44 - 2 - 9, 16 + 2 + 9.5);

    /* 3. le brouillard, qui se retire à partir du festivalier */
    const w = Math.min(1, p / 0.72), f = 1 - Math.pow(1 - w, 2), R = mix(46, 480, f), { d, a: na, b: nb, img } = champ;
    for (let o = 0; o < d.length; o++) {
      const v = mix(na[o], nb[o], w), alpha = lisse(R - 50, R + 50, d[o] + (v - 0.5) * 120) * 0.97;
      const q = o * 4, l = 222 + 33 * v; // gris très clair, plus blanc dans les volutes
      img.data[q] = l; img.data[q + 1] = l + 2; img.data[q + 2] = l + 4; img.data[q + 3] = alpha * 255;
    }
    fog.putImageData(img, 0, 0);
    c.drawImage(fogCv, 0, 0, DW, DH);

    /* 4. le festivalier, au centre de sa clairière */
    const { img: ifst, sx, sy, sw, sh } = iFest, hF = 42, wF = hF * sw / sh;
    c.drawImage(ifst, sx, sy, sw, sh, ux - wF / 2, uy - hF / 2, wF, hF);

    /* 5. le bandeau d'itinéraire, tel que dans l'application : jaune, sous la recherche, durée et distance en gras, destination, croix */
    const b = ease((p - 0.74) / 0.14);
    if (b > 0.005) {
      const bx = 18, bw = DW - 36, bh = 44, by = mix(16, 73, b);
      c.save(); c.globalAlpha = b;
      c.shadowColor = 'rgba(0,0,0,0.25)'; c.shadowBlur = 4; c.shadowOffsetY = 4;
      c.fillStyle = '#ffff99'; c.beginPath(); c.roundRect(bx, by, bw, bh, 8); c.fill();
      c.shadowColor = 'transparent';
      c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#000';
      c.font = `700 14px ${FONT_UI}`; c.fillText(`${minutes} min · ${metres} m`, bx + 12, by + 14.5);
      c.font = `400 12px ${FONT_UI}`; c.fillText(`À pied vers ${DESTINATION.nom}`, bx + 12, by + 30.5);
      const cx = bx + bw - 4 - 22; // bouton de 44 px, croix de 22 px : l'image entière, marges comprises, comme dans l'application
      c.drawImage(iFermer.img, cx - 11, by + bh / 2 - 11, 22, 22);
      c.restore();
    }

    /* 6. la recherche de l'application, au-dessus de tout : ce que cherche le festivalier, et rien de précis */
    const sw2 = DW - 18 - 18 - 44 - 8; // laisse la place de la cloche, sur la même ligne
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(18, 16, sw2, 45, 22.5); c.fill();
    c.strokeStyle = '#c7f3fe'; c.lineWidth = 5; c.beginPath(); c.roundRect(20.5, 18.5, sw2 - 5, 40, 20); c.stroke();
    const lx = 18 + sw2 - 16 - 24, tw = lx - 28 - 34; // le texte s'arrête avant la loupe, comme le champ de l'application
    c.save(); c.beginPath(); c.rect(34, 16, tw, 45); c.clip();
    c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#2a292b'; c.font = `400 16px ${FONT_UI}`; c.fillText('jeudi soir, tout public, cirque', 34, 39);
    c.restore();
    c.strokeStyle = '#2a292b'; c.lineWidth = 2; c.lineCap = 'round';
    c.beginPath(); c.arc(lx + 11, 38, 7.5, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(lx + 16.5, 43.5); c.lineTo(lx + 21, 48); c.stroke(); c.lineCap = 'butt';

    /* 7. la mention de la source de la carte */
    c.font = `400 10px ${FONT_UI}`;
    const mention = 'OpenFreeMap © OpenStreetMap', mw = c.measureText(mention).width + 14;
    c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.roundRect(8, DH - 26, mw, 18, 9); c.fill();
    c.fillStyle = '#333'; c.textBaseline = 'middle'; c.fillText(mention, 15, DH - 17);
    tex.needsUpdate = true;
  };

  return {
    scene, camera,
    duree: 2.5, // secondes : le brouillard prend le temps de se retirer
    resize(a, ecran) {
      aspect = a; camera.aspect = a;
      const dist = 3.6 / (Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * a);
      camera.position.set(0, 0, dist); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
      plan.scale.set(7.2, 7.2 / a, 1);
      const W = Math.round((ecran?.px ?? 600) * (ecran?.dpr ?? 1));
      cv.width = W; cv.height = Math.round(W / a);
      tex.dispose(); batirBrouillard();
      peindre(pCourant);
    },
    update(p) {
      pCourant = p;
      if (Math.abs(p - pPeint) > 0.002) peindre(p);
    },
  };
};

/* ───────── cycle de vie : image fixe au repos, animation au survol ───────── */

/* Three.js se charge une seule fois pour toutes les cartes, avec trois tentatives si la connexion coupe */
let pThree;
function chargerThree() {
  pThree ??= (async () => {
    for (let essai = 1; ; essai++) {
      try { return await import(essai === 1 ? THREE_URL : `${THREE_URL}?r=${essai}`); } // un échec de chargement reste en mémoire pour la même adresse
      catch (e) { if (essai === 3) { pThree = null; throw e; } await new Promise((ok) => setTimeout(ok, 800 * essai)); }
    }
  })();
  return pThree;
}

async function monter(zone) {
  const nom = zone.dataset.scene;
  if (!scenes[nom]) return;
  try {
    T ??= await chargerThree();
    await Promise.all([
      document.fonts.load('400 12px Inter'), document.fonts.load('500 13px Inter'), document.fonts.load('600 13px Inter'),
      document.fonts.load('400 24px "DM Serif Display"'), document.fonts.load('italic 400 28px "Instrument Serif"'),
    ]);
    const canvas = zone.querySelector('canvas');
    /* la mise en page ne doit jamais dépendre du canevas, même si la feuille de style n'est pas (encore) chargée : sinon sa taille de dessin,
       mesurée par la zone, la fait grandir sans fin. On le pose donc nous-mêmes hors du flux, sur la zone. */
    if (getComputedStyle(zone).position === 'static') zone.style.position = 'relative';
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const accent = getComputedStyle(zone).color;
    const vue = await scenes[nom]({ accent });

    let p = statique ? 1 : 0, cible = p, enCours = false, derniere = 0, t = 0;
    const pointeur = { x: 0, y: 0, cx: 0, cy: 0 };

    const dessiner = () => { vue.update(p, t, pointeur); renderer.render(vue.scene, vue.camera); };
    const calibrer = () => {
      const { width, height } = zone.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio, 2), 3)); // au moins le double : le rendu est sur-échantillonné, donc net même sur un écran standard
      renderer.setSize(width, height, false);
      vue.resize(width / height, { px: width, dpr: renderer.getPixelRatio() });
      dessiner();
    };
    const boucle = (now) => {
      const dt = Math.min(0.05, (now - derniere) / 1000 || 0.016);
      derniere = now; t += dt;
      p = Math.min(1, Math.max(0, p + Math.sign(cible - p) * dt / (vue.duree ?? DUREE))); // minuteur linéaire : chaque scène applique sa propre courbe
      pointeur.x += (pointeur.cx - pointeur.x) * 0.08;
      pointeur.y += (pointeur.cy - pointeur.y) * 0.08;
      dessiner();
      if (cible === 1 || Math.abs(cible - p) > 0.003 || Math.abs(pointeur.x) > 0.003) requestAnimationFrame(boucle);
      else { p = cible; pointeur.x = pointeur.y = 0; dessiner(); enCours = false; }
    };
    const lancer = () => { if (!enCours) { enCours = true; derniere = performance.now(); requestAnimationFrame(boucle); } };
    zone.piloter = (valeur) => { p = cible = valeur; dessiner(); }; // fige la scène à une progression donnée (0 à 1), pour examiner une transition image par image

    zone.classList.add('is-3d');
    new ResizeObserver(calibrer).observe(zone);
    calibrer();

    if (!statique) {
      const carte = zone.closest('.carte');
      const entrer = () => { cible = 1; lancer(); };
      const sortir = () => { cible = 0; pointeur.cx = pointeur.cy = 0; lancer(); };
      carte.addEventListener('pointerenter', entrer);
      carte.addEventListener('pointerleave', sortir);
      carte.addEventListener('focusin', entrer);
      carte.addEventListener('focusout', sortir);
      carte.addEventListener('pointermove', (e) => {
        const r = zone.getBoundingClientRect();
        pointeur.cx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        pointeur.cy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
    }
  } catch (e) {
    zone.classList.remove('is-3d'); // WebGL indisponible : l'image de repli reste en place
    console.warn('cartes-3d :', e);
  }
}

const vus = new IntersectionObserver((entrees) => {
  entrees.forEach((e) => { if (e.isIntersecting) { vus.unobserve(e.target); monter(e.target); } });
}, { rootMargin: '200px' });
document.querySelectorAll('.carte-visuel[data-scene]').forEach((z) => vus.observe(z));
