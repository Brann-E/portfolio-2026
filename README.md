# Portfolio 2026 - Brann Etienne

Le code source de [brannetienne.com](https://brannetienne.com), le portfolio de Brann Etienne, product design strategist à Lyon.

Le site présente des études de cas, une façon de travailler et un parcours, autour d'une idée : regarder ce qui circule entre les gens qui utilisent un outil, pas seulement l'outil.

## Ce que contient le dépôt

| Élément | Rôle |
| --- | --- |
| `index.html`, `a-propos.html`, `contact.html`, `etudes-de-cas.html`... | Pages du site (français) |
| `cas-*.html` | Les études de cas |
| `01-` à `06-*.html` | Les six chapitres du paradigme « circulation » |
| `en/`, `i18n/`, `i18n.js` | Version anglaise et mécanisme de traduction |
| `styles.css` | Feuille de style unique, variables par rôle (texte, grille, couleurs) |
| `nav.js`, `footer.js`, `grille.js`, `reveal.js`... | Scripts de comportement, un fichier par responsabilité |
| `assets/` | Images, logos, illustrations |
| `prototypes/` | Pistes de direction artistique, non publiées |
| `_redirects` | Redirections de l'hébergeur |

## Stack

HTML, CSS et JavaScript purs. Pas de framework, pas d'étape de build, pas de dépendance à installer.

Pour voir le site en local, il suffit de servir le dossier avec n'importe quel serveur statique :

```powershell
py -3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Licence

**Tous droits réservés.** Ce dépôt est public pour être lu, pas pour être repris.

- Textes, études de cas, images, schémas, logo, portraits, CV, design du site et code sont protégés par le droit d'auteur.
- Interdit sans accord écrit : copier, republier, réutiliser le design ou le code pour un autre site, s'en servir pour entraîner ou alimenter une IA, ou s'en attribuer le travail.
- Autorisé : lire, cloner pour un usage personnel non commercial, citer un court extrait avec le nom de l'auteur et le lien vers le site.

Le texte complet, en français et en anglais, est dans [LICENSE](LICENSE). Les polices et ressources tierces gardent leur propre licence. Les marques et éléments des organisations citées dans les études de cas restent à leurs titulaires.

Une demande d'autorisation ? Passer par la [page contact](https://brannetienne.com/contact).

## Auteur

Brann Etienne - [brannetienne.com](https://brannetienne.com)

---

# Portfolio 2026 - Brann Etienne (EN)

Source code of [brannetienne.com](https://brannetienne.com), the portfolio of Brann Etienne, product design strategist based in Lyon, France.

Built with plain HTML, CSS and JavaScript: no framework, no build step, no dependencies.

**All rights reserved.** This repository is public to be read, not reused. Copying, republishing, reusing the design or code, or using any of it to train or feed an AI model is not allowed without written permission. See [LICENSE](LICENSE) for the full terms, and the [contact page](https://brannetienne.com/contact) to ask.
