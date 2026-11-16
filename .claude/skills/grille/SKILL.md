---
name: grille
description: Comment fonctionne la grille du portfolio (ligne de 28 px, demi-gouttière de 14 px, 12 colonnes). À lire AVANT de placer, aligner, dimensionner ou espacer quoi que ce soit : bloc, image, portrait, boîte, texte, titre. Les valeurs sont fixes, ne pas les recalculer ni les remesurer.
---

# La grille du portfolio

Les nombres ci-dessous ne changent jamais. Les appliquer, ne pas les redécouvrir.

## 1. Les constantes (dans `:root`, `styles.css`)

| Variable | Valeur | Sens |
|---|---|---|
| `--ligne` | 28 px (1.75rem) | une ligne. Tout est un multiple de la ligne |
| `--demi-ligne` | 14 px | une demi-ligne = la demi-gouttière = le pas des points |
| `--gut` | 28 px | gouttière entre colonnes |
| `--col` | 84, 70, 56 ou 42 px | largeur d'une colonne, selon l'écran |
| `--cols` | 12 | colonnes (4 sur mobile) |
| `--page` | 12 colonnes + 11 gouttières | largeur de la page |
| `--rule-w` | 1 px | épaisseur d'un filet |

Paliers de `--col` (page, largeur de 12 colonnes) :

| Écran | `--col` | Page |
|---|---|---|
| 1364 px et plus | 84 | 1316 |
| 1196 à 1363 | 70 | 1148 |
| 1028 à 1195 | 56 | 980 |
| 860 à 1027 | 42 | 812 |
| 859 et moins (mobile) | 4 colonnes, `round(down, (100vw - 5L) / 4, 14px)` : 56 à 375 px | page alignée à gauche, 28 px de marge |

Largeur de N colonnes = N x `--col` + (N - 1) x 28. Ne pas la calculer à la main : `calc(var(--col) * N + var(--gut) * (N - 1))`.

## 2. Où sont les lignes (le fond quadrillé)

- Verticalement : une ligne tous les 28 px depuis le HAUT DU DOCUMENT (y multiple de 28).
- Horizontalement : une ligne tous les 28 px, la première à 14 px À GAUCHE du bord de la page. Les points sont tous les 14 px.
- Le bord gauche du TEXTE (le bord de la page) est donc sur un point, PAS sur une ligne. Il est à 14 px d'une ligne.
- C'est pour ça que tout encadré, image ou aplat qui doit tomber sur les lignes DÉBORDE de 14 px : `margin-inline: calc(var(--demi-ligne) * -1)`. Le texte à l'intérieur a alors un padding de 28 px (ou 56) et retombe sur le bord de page.
- Le fond du héros est dessiné par `vivant.js` (canvas), les sections `.hote` par `grille.js` (`--gx`/`--gy`). Les deux suivent cette règle. Ne pas la redéfinir.

## 3. Règles de dimension (à appliquer sans se reposer la question)

1. **Hauteur d'un bloc = un nombre entier de lignes.** Pas de demi-ligne verticale. Interligne du texte : `var(--ligne)`.
2. **Espaces verticaux : 0, 1 ou 2 lignes** (ou plus, toujours entières). Jamais de px, de `vh`, de `clamp()`.
3. **Filets : ombre interne** (`box-shadow: inset 0 0 0 var(--rule-w) ...`), JAMAIS `border` ni `gap: 1px` : un filet de 1 px en bordure décale tout ce qui suit de 1 px, et l'erreur s'ajoute à chaque rangée.
4. **Image / portrait :** (le portrait de la home est un cercle, `border-radius: 50%`, de `--portrait-cases` cases sur autant (3 cases = 168 px). ATTENTION : la « case » du fond du HÉROS est la maille, `--maille` = 56 px (2 lignes), pas 28 px : les lignes du fond du héros sont à pageLeft - 14 px + k x 56 en x, et k x 56 depuis le haut du document en y (vivant.js), flex à gauche du texte, débord de 14 px : bords sur les lignes, vérifié) un carré de 4 colonnes fait 420, 364, 308 ou 252 px (15, 13, 11 ou 9 lignes) : toujours un multiple de 28. Pour que ses bords tombent sur les lignes : largeur = multiple de 28, `margin-left: calc(var(--demi-ligne) * -1)`, hauteur en lignes entières.
5. **Boîtes en grille de cases collées :** 2, 3, 4 ou 6 colonnes, avec le débord de 14 px, tombent juste à chaque palier. 5 colonnes ne tombent pas, sauf en 84 px.
6. **Colonne du numéro, de l'icône, du chiffre :** 2 lignes (56 px) ou 3 (84 px), jamais 34, 48 ou 52 px.
7. **Texte :** la largeur d'un texte est en colonnes et dépend de sa taille. Repères : chapeau 21 px = 5 colonnes (50 caractères par ligne) ; titre 72 px = 6 colonnes ; h2 48 px = 7 colonnes.
8. **Un bloc dont on réduit la cellule dans la grille laisse la place à son voisin** : le titre qui passe de 12 à 6 colonnes fait remonter son sous-titre à côté. Pour limiter la largeur d'un texte, garder `grid-column: 1 / -1` et poser un `max-width`.

## 3 bis. Comportement des composants et comment les placer

### Les deux familles

- **Sur le texte** : un bloc qui suit le texte (paragraphe, titre, liste, signature, boutons). Son bord gauche est le bord de la page (sur un point). Il se pose sur des colonnes avec `grid-column`.
- **Sur les lignes** : un bloc encadré ou en aplat (boîte, carte, logos, liste à filets, encadré). Son cadre DÉBORDE de 14 px de chaque côté pour tomber sur les lignes ; le texte à l'intérieur a un padding d'une ligne (28 px) et retombe donc sur le bord de la page.

### Comment chaque composant se comporte

| Composant | Cadre | Padding | Hauteur | Largeur |
|---|---|---|---|---|
| Boîte, encadré (`.boite`, `.erratum`, `.cercle`, `.prelim`) | ombre interne 1 px, débord de 14 px | 1 ligne (2 pour `.prelim` au bureau) | lignes entières | pleine, ou N colonnes |
| Carte 3D (`.carte`) | ombre interne, débord de 14 px | 1 ligne | 24, 21, 18, 15 ou 13 lignes selon l'écran | `--carte-largeur` (7 colonnes + 1 ligne) |
| Logos (`.logos`) | grille 3 x 3, ombre interne, débord de 14 px | aucun | chaque case 4 lignes | pleine, 3 cases égales |
| Ligne de liste (`.liste-da .ligne`, `.etapes li`, `.deliverables li`, `.biblio li`, `.corresp-row`...) | filet en ombre interne sous la ligne | 1 ligne en haut et en bas | lignes entières | pleine |
| Case d'une grille de cases collées (`.lvl`, `.vgrid > .v`, `.metric`...) | trait à droite et en bas, cadre sur le conteneur | 1 ligne | `min-height` en lignes | 2, 3, 4 ou 6 colonnes avec débord |
| Image, schéma, portrait | aucun | aucun | lignes entières (le filet `snap-grille.js` réduit à la ligne inférieure) | multiple de 28 px, débord de 14 px si ses bords doivent tomber sur les lignes |
| Puce, bouton (`.verbs span`, `.equipe-liste li`) | ombre interne | demi-ligne à gauche et à droite | 1 ligne | multiple de 14 px (arrondi par le filet) |
| Titre (h1, h2, h3) | aucun | aucun | interligne en lignes entières | bloc sur toute la ligne de la grille, largeur de TEXTE limitée par `max-width` |
| Section (`.section`) | aucun | 3 lignes en haut et en bas | lignes entières | `.page` |
| Séparateur de section | barre courte de 2 colonnes x 1 demi-ligne, couleur d'accent | | | alignée sur le bord gauche du texte (ligne pleine seulement sur `.hote`) |

### Règle des séparateurs de section (home, à étendre aux autres pages)

- Séparateur = « le fil et le nœud » : un filet pleine largeur sur une ligne de la grille (boîte de 2 lignes de haut, débord de 14 px) avec un disque d'accent de 28 px posé dessus.
- **Le disque change de place à chaque séparateur : gauche, milieu, droite, milieu, gauche, milieu, droite...** Retrait du bord : 56 px (2 lignes) à gauche et à droite ; le milieu tombe sur une intersection à chaque palier.
- Pas de séparateur sous le héros (le premier séparateur est après la première section). La section finale `.hote` garde sa ligne pleine.
- Code : dans `styles.css` (bloc après `NOUVELLE DA`), `--noeud-x` par `:nth-of-type(4n + k)` sur `.section` ; le dessin est le fond de `.section::after` (radial-gradient + linear-gradient).
- Les couleurs d'accent viennent de `--c-vert`, `--c-jaune`, `--c-magenta` (`#FD2FD9`, le fuchsia), `--c-orange`.

### Règle des remplissages d'accent (survol, case qui s'allume)

Quand la couleur d'accent remplit une case (animation de gauche à droite : `background-size: 0% 100%` vers `100% 100%`), **le contour noir de la case reste TOUJOURS visible**, tout autour, du début à la fin.

- Le remplissage est un fond : il recouvre tout ce qui est dessiné DESSOUS (le cadre du conteneur, l'ombre interne d'un parent). Seul ce que la case dessine elle-même avec `box-shadow: inset` ou `border` reste au-dessus.
- Donc **chaque case dessine ses propres traits** : jamais de trait « prêté » par le conteneur ou le parent. Si deux cases voisines se touchent, un seul des deux dessine le trait commun (droite et bas partout ; gauche en première colonne ; haut en première rangée), sinon le trait fait 2 px.
- Cas déjà traités : `.logos div` (neuf cases : traits propres, plus de cadre emprunté au conteneur), `.liste-da .ligne` (traits sur `.ligne`, pas sur `<li>`), `.carte-face` (calque `::after` au-dessus du remplissage), `.btn` (bordure de 1 px), `.champ-da` (ombre interne complète).
- À chaque nouveau composant qui se remplit : forcer `background-size: 100% 100%`, regarder les quatre côtés, et vérifier qu'aucun trait ne disparaît.

### Comment on écrit la mise en page d'une page (exemple : la home, bloc `HOME : MISE EN PAGE` en bas de `styles.css`)

Jamais de classe de mise en page dans le HTML. Les réglages sont des nombres nommés en tête du bloc de la page ; les règles dessous les lisent.

```css
:root {
  --home-titre: 12;      /* colonnes (sur 12) */
  --home-section: 7;
  --home-chapeau: 5;
  --home-espace: 2;      /* lignes (1 ligne = 28 px) */
}
.accueil .page > h2 { grid-column: 1 / span var(--home-section); }
.accueil .page > * + * { margin-top: calc(var(--ligne) * var(--home-espace)); }
@media (max-width: 859px) { :root { --home-section: 4; ... } }   /* 4 colonnes sur mobile */
```

- Chaque bloc part de la **colonne 1** (`1 / span N`) : il a donc sa propre ligne et rien ne se glisse à côté.
- Mobile : tous les nombres de colonnes passent à 4 (sinon la grille crée des colonnes en trop).
- Un titre est suivi à 1 ligne de son bloc (`--home-espace-titre`), les autres blocs à 2 lignes.
- Pour modifier une largeur ou un espace : changer le nombre dans `:root`, rien d'autre.

### Pour placer un composant (toujours dans cet ordre)

1. **Choisir la famille** (sur le texte ou sur les lignes) d'après le tableau ci-dessus.
2. **Choisir la largeur en colonnes** avec le tableau du chapitre 1 (jamais en px). Un texte : selon sa taille (règle 7). Une boîte en grille de cases : 2, 3, 4 ou 6.
3. **La poser sur sa propre ligne** de la grille : `grid-column: 1 / -1` plus `max-width` pour limiter un texte. Réduire `grid-column` à moins de 12 libère de la place et fait remonter le bloc suivant à côté.
4. **Le cadre** : ombre interne, jamais de bordure. S'il doit tomber sur les lignes : `margin-inline: calc(var(--demi-ligne) * -1)`.
5. **L'espace autour** : 0, 1 ou 2 lignes, par `margin-block` en lignes entières, ou par la règle générale du conteneur. Jamais `px`, `vh` ou `clamp()`.
6. **Le texte à l'intérieur** : `line-height: var(--ligne)`, marges à 0 ou en lignes entières.
7. **Largeurs et espaces réglables** : une variable nommée dans le bloc `RÉGLAGES` en bas de `styles.css`, jamais de valeur écrite dans le HTML.
8. **Mobile (859 px et moins)** : tout prend `grid-column: 1 / -1` ; vérifier qu'aucun `max-width` en colonnes ne reste.

### Ce qu'un composant ne fait JAMAIS

- Décider de sa largeur ou de son espace dans le HTML (`c-N`, `sp-N`, `style=""`).
- Avoir un filet en `border` ou un écart de 1 px.
- Avoir une hauteur, une marge ou un padding qui ne soit pas un multiple de 14 px (de 28 px en vertical).
- Redéfinir une classe déjà utilisée ailleurs (`.v`, `.s`, `.l`, `.r`, `.h`) : scoper par le parent.

### Tailles de police : une seule échelle, sans alias

Il n'y a que **sept rôles** : `--fs-xs` (14 px), `--fs-s` (17), `--fs-s` (18), `--fs-m` (21), `--fs-l` (24), `--fs-2xl` (48), `--fs-3xl` (72), plus leur interligne (`--lh-*`) et leur version mobile (bloc `max-width: 859px`). On écrit `font-size: var(--fs-s)`, jamais `var(--fs-...)` : les `--fs-*` (alias de variables) ont été supprimés le 2026-11-12 (364 usages remplacés, 16 définitions retirées). Restent 8 `--fs-*` à usage unique (`--fs-nav`, `--fs-xs`, `--fs-sig-*`, `--fs-ft-*`), à remplacer par un rôle `--t-*` quand on y touche. Le détail visible : `typographie.html`.

### Statut « question » (8e statut de texte, créé le 2026-11-12)

`.t-question` (et `.carte .q`, qui l'emploie) : la phrase d'accroche d'un cas (« Et si la meilleure façon de soigner, c'était de mieux relier ? »). Police du corps de texte (**Newsreader**), graisse des titres (`--title-weight`, 700), **italique**, taille du H3 (`--fs-l`, 24 px), interligne d'une ligne. Pour que la graisse 700 existe vraiment, le lien Google Fonts de la page doit demander `Newsreader ... 400..700` (fait sur `etudes-de-cas.html` ; à faire sur toute autre page qui emploie ce statut, sinon le navigateur retombe à 600).

### Carte d'étude de cas : quatre rangées

Une carte = une boîte (filet en ombre interne) de quatre rangées séparées par des filets, comme les « situations » : client · domaine · année (2 lignes), la question (statut ci-dessus), la relation en trois cellules (terme, fil, terme), le visuel. Au survol (ou `.is-active`) : la cellule de gauche se remplit d'accent, un blob part de son bord et glisse le long du fil, la cellule de droite se remplit à son arrivée. Les contours restent visibles pendant le remplissage. Bloc `CARTE D'ÉTUDE DE CAS` en bas de `styles.css`.

### Un composant, un seul bloc dans `styles.css`

Avant d'ajouter une règle : `grep -n "^\.nom-du-composant" styles.css`. S'il existe déjà, on MODIFIE sa règle, on n'en ajoute pas une deuxième plus bas (la dernière gagne : trois définitions de `.signature` à trois endroits rendaient le CSS illisible). `.signature` est maintenant un seul bloc (fin de la couche DA). Les doublons déclaration par déclaration ont été retirés le 2026-11-12 (339 déclarations) et vérifiés sur 19 pages en 2 largeurs.

## 4. Où vit le code

| Fichier | Rôle |
|---|---|
| `styles.css` | tout le CSS. La couche actuelle est entre `NOUVELLE DA : début` et `NOUVELLE DA : fin`. La DERNIÈRE occurrence d'une règle gagne. Ajouter en bas, avant `fin` |
| `snap-grille.js` | filet de sécurité : arrondit à la ligne les hauteurs, les marges, les paddings, les figures, la largeur des puces |
| `grille.js` | motifs de lignes des `.hote` et des blobs |
| `vivant.js` | fond du héros (canvas) |
| `grille-visible.js` | touche **G** : affiche la grille (utile pour regarder à l'oeil) |
| `composants.html` | page de référence des composants avec leurs vraies classes |

Réglages de la home : bloc `RÉGLAGES DE LA HOME` en bas de `styles.css` (`--largeur-titre`, `--largeur-titre-section`).

## 5. Pièges déjà rencontrés (ne pas les refaire)

- `.v` et `.s` sont aussi des classes d'autres pages (chiffres-clés) : scoper les règles (`.vgrid > .v`), jamais `.v` seul.
- `snap-grille.js` : un bloc étiré par son parent (grille, flex) bouclait à l'infini. Les `minHeight` sont remis à zéro avant chaque passe. Garder ça.
- Les classes `c-N` (largeur en colonnes) et `sp-N` (espace en lignes) sont retirées de `index.html` (2026-11-12) ; elles restent dans les autres pages en attendant leur tour (125 usages, 19 fichiers). Brann veut largeur et espace dans le CSS, par variables. Ne JAMAIS en ajouter.
- Pas de `style="..."` dans le HTML ni dans les composants.
- Cache : après un changement, `fetch('/styles.css', {cache: 'reload'})` puis recharger. Dire à Brann de faire Ctrl+Shift+R.

## 6. Vérifier (une seule méthode)

La page vivante est FAUSSE pour mesurer : les révélations (`.rv`) déplacent les blocs de quelques pixels. Mesurer dans un iframe caché :
1. iframe de la page, largeur voulue, `link[href^="styles.css"]` rechargé avec `?b=<timestamp>`.
2. Y injecter `*{transition:none!important;animation:none!important}.rv{opacity:1!important;transform:none!important}`.
3. Attendre 2,5 s (le filet `snap-grille.js` passe à 60 ms, 1200 ms et 3500 ms).
4. Pour un élément : `((haut + scrollY) % 28)` doit valoir 0, et `((gauche - (gauchePage - 14)) % 28)` doit valoir 0 s'il déborde, ou 14 s'il est sur le texte.
5. Largeurs de test : 375, 768, 1000, 1280, 1440.

Mais ne pas mesurer ce qui est déjà garanti par les règles du chapitre 3. Si une règle du chapitre 3 est respectée, le résultat est juste.

## 7. Manière de travailler avec Brann

- Français, tirets normaux (jamais de tiret long).
- Diagnostiquer ne veut pas dire corriger : attendre le feu vert.
- Fichiers critiques (`index.html`, `package.json`, `vite.config.*`, `.env`...) : demande explicite + diff complet + validation.
- Pas de commit sans demande.
- Le bouton « Regarder autrement » de la nav est figé : ne pas y toucher.
- Ne jamais supprimer une règle CSS qui n'existe qu'à un endroit.
- Expliquer ce qu'on AJOUTE, pas seulement ce qu'on enlève.

## Apparition du contenu : fondu obligatoire sur TOUTES les pages

Une page qui se charge n'apparaît jamais d'un coup. Tout le contenu entre en fondu depuis le bas, par `reveal.js` (classe `.rv`, puis `.in` posée par un IntersectionObserver ; l'état caché n'existe que si le script tourne : `html.js-rv`).

- Chaque page charge `reveal.js` dans le `<head>`. Vérifier sa présence sur toute nouvelle page.
- `reveal.js` ne révèle que ce que son sélecteur couvre : `.wrap > *`, `.wrap > section > *`, `.chapters > .chapter`, `.article > *`, et `[data-vivant="page"] .hero-texte > *`. **Un bloc hors de ces conteneurs (héros posé hors de `.wrap`, élément fixe, section sans `.wrap`) n'est PAS révélé.** Après toute mise en page nouvelle, vérifier que titre, sous-titre, cartes et visuels portent bien `.rv` puis `.in` au chargement.
- Ne jamais forcer `opacity: 1 !important` ou `transform: none !important` sur un `.rv` : ça supprime le fondu. Ne jamais poser `.in` à la main en JS pour « éviter un flash ».
- Un très grand bloc (pile de 6000 px) n'atteint jamais le seuil de visibilité (10 %) : révéler ses enfants un par un, pas le conteneur (`.cartes` est exclu de la révélation d'un bloc).
- Pas de `transform` sur un parent de `position: sticky` une fois révélé (`.in` remet `transform: none`).
- Test : charger la page et lire l'opacité des éléments pendant la première seconde ; elle doit monter de 0 à 1. Panneau masqué = transitions figées, vérifier alors les classes `.rv` / `.in`.

## Pages à chapitres (Comment je travaille, À propos) - ajouts du 2026-11-13

- **Piège `pratique`** : la classe `pratique` sur `<body>` décale le héros de 27 px (règle de la couche des essais : `body.has-site-nav.pratique .hero { margin-left: ... }`), son texte n'est alors plus aligné sur les chapitres. Ne pas la mettre sur une page à chapitres (retirée de `comment-je-travaille.html`).
- **Séparateurs des chapitres** : le « fil et nœud » de la home s'applique aussi à `.chapitre::before` (bloc `COMMENT JE TRAVAILLE`). Pas de séparateur sous le héros (`.hero + .chapitre`), puis nœud à gauche, milieu, droite, milieu selon le rang de la section dans `<main>` (`:nth-of-type(4n + k)`). Un chapitre ajouté ou retiré décale le cycle : normal.
- **Pas d'images des études de cas** pour « meubler » une page de texte : essayé le 2026-11-13 (carte, pyramide, roadmap, atelier à droite du texte), Brann les a trouvées laides et hors sujet. Les visuels d'une page viennent de sa propre DA (grille, disques, typographie), pas des livrables des cas.
- **Citation** (`.citation-da`) : un cadre sur les lignes (ombre interne, débord de 14 px), texte à 2 lignes du bord, la grille et le disque viennent de `.hote`. Pas de barre verte à gauche, jamais.
- **Révélation** : `reveal.js` couvre maintenant `.chapitre .page > *`, `.bandeau-accent .page > *` et `.hero--page .hero-texte > *`. Ne pas écrire `in` à la main dans le HTML (un `hote in` écrit en dur supprime le fondu).
- **Bouton du bandeau d'accent** : le survol est le même que partout (le remplissage glisse via `background-size`), jamais un changement de `background-color` d'un coup.
- **Numéros de chapitre** : sur `comment-je-travaille.html` (`<main data-numeros>`), un grand chiffre « 01 » à « 05 » à droite du texte (colonnes 9 à 12), pris dans un compteur CSS sur `.chapitre .page::after` : rien dans le HTML. Essayé avant : images des cas, puis motifs de disques (`motifs.js`), refusés par Brann. Pour la page À propos, ajouter `data-numeros` à son `<main>`.

## La nav : une seule, `nav.js`

Toute page du site pose `<script src="nav.js"></script>` juste après `<body ...>` (il fabrique `header.bar` et marque la page active, `cas-*` = « Études de cas »), puis charge `site-nav.js` en fin de page. Jamais de `<nav class="site-nav">` écrite à la main (ancienne nav : retirée de `cas-bi-solution.html` le 2026-11-13). Contrôle : charger chaque page dans un iframe et vérifier `header.bar` présent et `nav.site-nav` absent. Pages volontairement sans nav : `parcours-interactif`, `footer-lab`, `signature`.

## La couleur d'accent : une teinte, pas six couleurs (2026-11-13)

- Le visiteur règle l'accent avec un **curseur de teinte** (0 à 359) dans la nav (`input.teinte`, que l'on fait glisser de haut en bas). Plus de pastilles ni de `data-accent`.
- Pour chaque teinte, `accentDe` prend la couleur la **plus vive** que l'écran sait afficher (OKLCH, hors gamut sRGB ramené) tout en gardant le texte en AAA : clair, luminance d'au moins 0,51 (encre dessus, au pire **7,14 : 1** sur 360 teintes) ; sombre, luminance d'au plus 0,084 (papier clair dessus, au pire **7,05 : 1**). Résultat : vert, jaune, cyan fluo (`#51FE00`, `#D8FE00`, `#00FEDF`) ; rouge, rose, bleu plus clairs (un bleu vif est trop sombre pour du texte sombre). Une première version à clarté fixe (0,84) donnait des couleurs ternes : Brann l'a refusée.
- Le calcul est dans `nav.js` (`accentDe`, `poserAccent`, `teinteLue`, exposés sur `window`), pose `--accent`, `--accent-fond` (hexadécimal, lu tel quel par `vivant.js` et les scènes 3D) et `--teinte` sur `<html>` ; `site-nav.js` branche le curseur (`input` = couleur en direct, `change` = mémorisation `be-accent` et événement `grille:refresh`) et recalcule au changement de thème.
- Défaut sans JavaScript : `--accent: var(--c-vert)` dans `:root`. Les anciens noms mémorisés (« vert », « jaune »...) sont convertis en teinte (vert 142, jaune 120, magenta 329, orange 72, menthe 166, cyan 195, citron 110). Les `--c-*` restent pour les usages historiques, ne plus en ajouter.
- Ne jamais écrire une couleur d'accent en dur ; ne jamais dépendre de la clarté d'une teinte précise (le jaune et le bleu n'ont plus de clarté propre).
