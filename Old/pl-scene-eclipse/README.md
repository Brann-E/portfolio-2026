# pl-scene — effet éclipse (archive)

Snapshot complet du site pris **avant** le remplacement de l'ancienne
`pl-scene` (disque central qui morphe + révélation « éclipse ») par le
nouveau gros bouton holographique rectangulaire.

Conservé ici parce que l'effet éclipse a demandé beaucoup de travail et
ne doit pas être perdu.

## Fichiers

- `index.snapshot.html` — copie intégrale de `index.html` à cette date.
- `styles.snapshot.css` — copie intégrale de `styles.css` à cette date.
- `logo-empty.png` — le logo « vide » utilisé par la scène.

## Où vit l'effet éclipse

Dans `index.snapshot.html` :
- Bloc HTML : `<div class="pl-scene" id="scene">` (~lignes 298-321) —
  contient `pl-disc`, `pl-bg-spectre`, `pl-flash`, `pl-burst`, `pl-logo`
  (logo en data-URI base64), `pl-etincelle`, `pl-invite` / `pl-cta`.
- Script inline de la scène (~lignes 323-337) : gère le clic sur le logo
  (`flashing` → `revealed`) et le suivi de la souris.

Dans `styles.snapshot.css` :
- Règles `.pl-*` en deux régions (~1893-2217 et ~6446-6619).
- Keyframes clés : `pl-liquid` (morph du disque), `pl-glowDim` /
  `pl-glowBright` (halo 5 couleurs), `pl-discPulse`.

## Pour restaurer

Récupérer le bloc `.pl-scene` + le script inline depuis
`index.snapshot.html`, et toutes les règles `.pl-*` + keyframes depuis
`styles.snapshot.css`, puis les réinjecter dans les fichiers de prod.
