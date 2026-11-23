#!/usr/bin/env python3
"""Génère les pages anglaises (/en/) à partir des pages françaises.

Le français reste la source : on continue de le corriger dans les .html du site.
Les traductions vivent dans i18n/en/<page>.json : une liste de paires {"fr": ..., "en": ...},
où "fr" est un morceau EXACT du HTML français (un titre, une phrase avec ses balises, une ligne) et "en" son remplacement.

    py -3 i18n/build_en.py            construit toutes les pages qui ont un fichier de paires, puis contrôle
    py -3 i18n/build_en.py index      construit une seule page

Si le français a changé et qu'une paire ne retrouve plus son morceau, le script le dit (« PÉRIMÉE ») : il n'écrit rien de faux en silence.
Le contrôle final liste le français qui reste dans les pages anglaises (accents, mots français), hors i18n/allow.txt (noms propres).
"""
import html as html_
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAIRES = ROOT / "i18n" / "en"
SITE = "https://brannetienne.com"
ABSOLU = ("/", "#", "http://", "https://", "data:", "mailto:", "tel:", "javascript:")


def pages_a_construire(args):
    if args:
        return args
    return pages_traduites()


def pages_traduites():
    """Une page = un fichier i18n/en/<page>.json ; les js-*.json sont les dictionnaires des scripts."""
    return sorted(p.stem for p in PAIRES.glob("*.json") if not p.stem.startswith(("js-", "script-", "fichier-")))


def url_fr(page):
    return SITE + "/" if page == "index" else SITE + "/" + page


def url_en(page):
    return SITE + "/en/" if page == "index" else SITE + "/en/" + page


def sortie(page):
    return ROOT / "en" / (page + ".html")


def appliquer_paires(html, page):
    fichier = PAIRES / (page + ".json")
    paires = json.loads(fichier.read_text(encoding="utf-8"))["pairs"]
    perimees = 0
    for p in paires:
        if p["fr"] not in html:
            perimees += 1
            print("  PÉRIMÉE (%s) : %s" % (page, p["fr"][:90].replace("\n", " ")))
            continue
        html = html.replace(p["fr"], p["en"])
    return html, perimees


def prefixer(valeur):
    return valeur if valeur.startswith(ABSOLU) else "/" + valeur


def chemins_absolus(html):
    """Les pages anglaises vivent dans /en/ : les ressources relatives (styles.css, assets/...) deviennent absolues."""
    def simple(m):
        return '%s="%s"' % (m.group(1), prefixer(m.group(2)))

    html = re.sub(r'\b(src|href|data-src|poster)="([^"]*)"', simple, html)

    def liste(m):
        entrees = [e.strip() for e in m.group(2).split(",")]
        sortie_ = []
        for e in entrees:
            morceaux = e.split(None, 1)
            morceaux[0] = prefixer(morceaux[0])
            sortie_.append(" ".join(morceaux))
        return '%s="%s"' % (m.group(1), ", ".join(sortie_))

    return re.sub(r'\b(srcset|data-srcset)="([^"]*)"', liste, html)


def liens_de_pages(html, existantes):
    """Un lien vers une page qui existe en anglais pointe vers sa version anglaise ; les autres restent sur le français."""
    def lien(m):
        cible, ancre = m.group(1), m.group(2) or ""
        nom = cible.strip("/")
        if nom == "" or nom in existantes:
            return 'href="/en/%s%s"' % (nom, ancre) if nom else 'href="/en/%s"' % ancre
        return m.group(0)

    return re.sub(r'href="(/[a-z0-9-]*)(#[^"]*)?"', lien, html)


def donnees_structurees(html, existantes):
    """JSON-LD : la langue de la page, et l'adresse anglaise de la page elle-même et des pages qui existent en anglais."""
    html = html.replace('"inLanguage": "fr-FR"', '"inLanguage": "en"')

    def adresse(m):
        nom = m.group(2)
        if nom in existantes or nom == "":
            return '"%s": "%s/en/%s"' % (m.group(1), SITE, nom)
        return m.group(0)

    return re.sub(r'"(url|mainEntityOfPage)": "%s/([a-z0-9-]*)"' % re.escape(SITE), adresse, html)


def tete(html, page):
    html = html.replace('<html lang="fr">', '<html lang="en">')
    html = re.sub(r'<link rel="alternate" href="[^"]*" hreflang="[^"]*"[^>]*>\n?', "", html)
    html = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?', "", html)
    html = html.replace('<link rel="canonical" href="%s">' % url_fr(page),
                        '<link rel="canonical" href="%s">\n'
                        '<link rel="alternate" hreflang="fr" href="%s">\n'
                        '<link rel="alternate" hreflang="en" href="%s">\n'
                        '<link rel="alternate" hreflang="x-default" href="%s">' % (url_en(page), url_fr(page), url_en(page), url_fr(page)))
    html = html.replace('<meta property="og:url" content="%s">' % url_fr(page), '<meta property="og:url" content="%s">' % url_en(page))
    html = html.replace('<meta property="og:locale" content="fr_FR">',
                        '<meta property="og:locale" content="en_US">\n<meta property="og:locale:alternate" content="fr_FR">')
    # le dictionnaire des scripts et la fonction t(), avant tout autre script
    vue = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    html = html.replace(vue, vue + '\n<script src="/i18n/en-js.js"></script>\n<script src="/i18n.js"></script>', 1)
    return html


def scripts_traduits():
    """Un script avec beaucoup de texte (données du parcours...) a son fichier i18n/en/script-<nom>.json : on en produit une copie anglaise en/<nom>.js."""
    return sorted(p.stem[len("script-"):] for p in PAIRES.glob("script-*.json"))


def construire_script(nom):
    source = ROOT / (nom + ".js")
    js = source.read_text(encoding="utf-8").replace(chr(13) + chr(10), chr(10))
    js, perimees = appliquer_paires(js, "script-" + nom)
    cible = ROOT / "en" / (nom + ".js")
    cible.parent.mkdir(exist_ok=True)
    cible.write_text(js, encoding="utf-8", newline=chr(10))
    print("OK script %s -> %s%s" % (nom, cible.relative_to(ROOT), " (%d paire(s) périmée(s))" % perimees if perimees else ""))


def construire_fichier(f):
    """Un fichier à part (prototype...) : i18n/en/fichier-<nom>.json dit d'où il vient et où écrire la version anglaise."""
    meta = json.loads(f.read_text(encoding="utf-8"))
    source = ROOT / meta["source"]
    texte = source.read_text(encoding="utf-8").replace(chr(13) + chr(10), chr(10))
    texte, perimees = appliquer_paires(texte, f.stem)
    texte = texte.replace('<html lang="fr">', '<html lang="en">')
    cible = ROOT / meta["output"]
    cible.parent.mkdir(parents=True, exist_ok=True)
    cible.write_text(texte, encoding="utf-8", newline=chr(10))
    print("OK fichier %s -> %s%s" % (f.stem, meta["output"], " (%d paire(s) périmée(s))" % perimees if perimees else ""))


def images_anglaises(html):
    """Une image dont une variante « -en » existe (même dossier, même extension) passe à sa version anglaise."""
    def remplacer(m):
        chemin, nom, ext = m.group(1), m.group(2), m.group(3)
        if nom.endswith("-en"):
            return m.group(0)
        if (ROOT / (chemin + nom + "-en." + ext)).exists():
            return chemin + nom + "-en." + ext
        return m.group(0)
    return re.sub(r"(assets/(?:[\w.-]+/)*)([\w.-]+?)\.(png|jpg|webp)", remplacer, html)


def construire(page, existantes):
    source = ROOT / (page + ".html")
    html = source.read_text(encoding="utf-8").replace("\r\n", "\n")
    html, perimees = appliquer_paires(html, page)
    html = images_anglaises(html)
    html = tete(html, page)
    html = donnees_structurees(html, existantes | {page})
    html = chemins_absolus(html)
    html = liens_de_pages(html, existantes)
    cible = sortie(page)
    cible.parent.mkdir(exist_ok=True)
    cible.write_text(html, encoding="utf-8", newline="\n")
    print("OK %s -> %s%s" % (page, cible.relative_to(ROOT), " (%d paire(s) périmée(s))" % perimees if perimees else ""))
    return perimees


# ---------------------------------------------------------------- contrôle : le français qui reste

LITTERAUX = re.compile(r'"([^"\n]{6,})"' + "|" + r"'([^'\n]{6,})'" + "|" + r"`([^`]{6,})`")
ACCENTS = re.compile(r"[àâçéèêëîïôûùüÿœÀÂÇÉÈÊËÎÏÔÛÙÜŒ]")
MOTS = re.compile(r"\b(le|la|les|des|du|une|est|pas|pour|qui|que|dans|avec|sur|vous|nous|je|mon|mes|aux|ce|cette|ces|ne|et|ou|au|en)\b", re.I)
MOTS_FORTS = re.compile(r"\b(le|la|les|des|du|une|est|pas|pour|qui|que|dans|avec|sur|vous|nous|je|mon|mes|aux|cette|ces|ne)\b", re.I)


def segments(html):
    """Le texte visible et les attributs lus par l'écran (alt, aria-label, title, placeholder, content)."""
    html = re.sub(r"(?s)<style\b.*?</style>", "", html)
    html = re.sub(r"(?s)<script(?![^>]*ld\+json)\b.*?</script>", "", html)
    html = re.sub(r"(?s)<!--.*?-->", "", html)
    html = re.sub(r'(?s)<span class="(?:ti|pub|a)">.*?</span>', "", html)   # les références citent des œuvres et des éditions françaises : on ne les contrôle pas
    out = []
    for m in re.finditer(r'\b(?:alt|aria-label|title|placeholder|content)="([^"]+)"', html):
        out.append(m.group(1))
    texte = re.sub(r"<[^>]+>", "\n", html)
    for ligne in texte.split("\n"):
        ligne = ligne.strip()
        if ligne:
            out.append(ligne)
    return out


def controler(pages):
    allow = []
    f = ROOT / "i18n" / "allow.txt"
    if f.exists():
        allow = [l.strip() for l in f.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]
    total = 0
    for page in pages:
        html = sortie(page).read_text(encoding="utf-8")
        for seg in segments(html):
            seg = html_.unescape(seg)
            s = re.sub(r"https?://\S+", "", seg)   # les adresses portent le titre français de la page
            for a in allow:
                s = s.replace(a, "")
            if ACCENTS.search(s) or len(MOTS_FORTS.findall(s)) >= 2:   # un seul mot isolé (« pour in ») est le plus souvent de l'anglais
                total += 1
                print("  FRANÇAIS (%s) : %s" % (page, seg[:110]))
        for m in re.finditer(r"(?s)<script(?![^>]*(?:ld\+json|src=))[^>]*>(.*?)</script>", html):
            code = re.sub(r"(?m)^\s*//.*$", "", m.group(1))
            code = re.sub(r"(?s)/\*.*?\*/", "", code)
            for t in re.findall(LITTERAUX, code):
                x = " ".join(t)
                for a_ in allow:
                    x = x.replace(a_, "")
                if ACCENTS.search(x) or len(MOTS_FORTS.findall(x)) >= 2:
                    total += 1
                    print("  FRANÇAIS dans un script (%s) : %s" % (page, x[:110]))
    print("Contrôle : %d segment(s) à vérifier." % total)
    return total


def lier(page, src, source=None, sortie_fichier=None):
    """Écrit i18n/en/<page>.json à partir d'un fichier de traduction compact (numéros de ligne du HTML français).

        12: ligne entière traduite (balises comprises)
        12#: seulement le texte entre la première balise ouvrante et la dernière fermante de la ligne 12 (ancré : >texte<)
        12@: seulement la valeur de content="..." de la ligne 12 (meta description)
        * morceau français => morceau anglais        (remplace partout dans la page : alt, aria-label...)
        X 30-48                                      supprime ces lignes (bloc propre au français)
        <<30-48 puis des lignes, puis >>             remplace ces lignes par le bloc écrit juste après
    Un remplacement par #, @ ou * vaut pour toutes les occurrences. Pour un texte repris dans le titre, og:title et twitter:title, utiliser * (sans ancre).
    """
    if source:
        fichier = ROOT / source
    else:
        fichier = ROOT / (page[len("script-"):] + ".js") if page.startswith("script-") else ROOT / (page + ".html")
    lignes = fichier.read_text(encoding="utf-8").replace(chr(13) + chr(10), chr(10)).split(chr(10))
    paires = []
    entree = Path(src).read_text(encoding="utf-8").splitlines()
    i_ligne = 0
    while i_ligne < len(entree):
        brut = entree[i_ligne]
        i_ligne += 1
        if not brut.strip() or brut.lstrip().startswith("//"):
            continue
        mb = re.match(r"^<<(\d+)-(\d+)$", brut)   # un bloc de lignes remplacé d'un coup, jusqu'à une ligne >>
        if mb:
            bloc = []
            while i_ligne < len(entree) and entree[i_ligne] != ">>":
                bloc.append(entree[i_ligne])
                i_ligne += 1
            i_ligne += 1
            paires.append({"fr": chr(10).join(lignes[int(mb.group(1)) - 1:int(mb.group(2))]), "en": chr(10).join(bloc)})
            continue
        m = re.match(r"^\*\s*(.+?)\s*=>\s*(.*)$", brut)
        if m:
            paires.append({"fr": m.group(1), "en": m.group(2)})
            continue
        m = re.match(r"^X\s*(\d+)-(\d+)\s*$", brut)
        if m:
            paires.append({"fr": chr(10).join(lignes[int(m.group(1)) - 1:int(m.group(2))]), "en": ""})
            continue
        m = re.match(r"^(\d+)([#@]?):\s?(.*)$", brut)
        if not m:
            sys.exit("Ligne illisible : " + brut[:80])
        n, mode, en = int(m.group(1)), m.group(2), m.group(3)
        ligne = lignes[n - 1]
        if mode == "#":
            i, j = ligne.find(">"), ligne.rfind("<")
            fr, en = ligne[i:j + 1], ">" + en + "<"   # ancré entre les balises : un texte court ne s'insère pas dans une phrase plus longue
        elif mode == "@":
            mm = re.search(r'content="([^"]*)"', ligne)
            fr = mm.group(1)
        else:
            fr, en = ligne.strip(), en.strip()
        if not fr:
            sys.exit("Rien à traduire à la ligne %d" % n)
        paires.append({"fr": fr, "en": en})
    texte_source = chr(10).join(lignes)
    gardees = [p for p in paires if p["fr"] in texte_source]
    if len(gardees) < len(paires):   # les blocs communs (navigation de la série...) contiennent des variantes qui n'existent pas dans toutes les pages
        print("  %d paire(s) sans objet dans cette page, écartée(s)" % (len(paires) - len(gardees)))
    paires = gardees
    PAIRES.mkdir(parents=True, exist_ok=True)
    contenu = {"pairs": paires}
    if source:
        contenu = {"source": source, "output": sortie_fichier, "pairs": paires}
    (PAIRES / (page + ".json")).write_text(json.dumps(contenu, ensure_ascii=False, indent=1) + chr(10), encoding="utf-8")
    print("%s : %d paires écrites" % (page, len(paires)))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    args = sys.argv[1:]
    if args and args[0] == "--lier":
        lier(args[1], args[2])
        args = [] if args[1].startswith("script-") else [args[1]]
    elif args and args[0] == "--lier-fichier":   # --lier-fichier NOM SOURCE SORTIE FICHIER_DE_TRADUCTION
        lier("fichier-" + args[1], args[4], args[2], args[3])
        args = []
    pages = pages_a_construire(args)
    existantes = set(pages_traduites())
    existantes.discard("index")
    for p in pages:
        construire(p, existantes)
    for nom in scripts_traduits():
        construire_script(nom)
    for f in sorted(PAIRES.glob("fichier-*.json")):
        construire_fichier(f)
    controler(pages)
    controler_scripts()
    ecrire_dictionnaire()
    controler_js()


def controler_scripts():
    """Le français qui reste dans les copies anglaises des scripts (chaînes de caractères)."""
    allow = []
    f = ROOT / "i18n" / "allow.txt"
    if f.exists():
        allow = [l.strip() for l in f.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]
    total = 0
    for nom in scripts_traduits():
        code = (ROOT / "en" / (nom + ".js")).read_text(encoding="utf-8")
        code = re.sub(r"(?m)^\s*//.*$", "", code)
        code = re.sub(r"(?s)/\*.*?\*/", "", code)
        for t in re.findall(LITTERAUX, code):
            x = re.sub(r"/[a-z0-9/-]+", "", html_.unescape(" ".join(t)))   # les adresses de pages portent le titre français
            for a_ in allow:
                x = x.replace(a_, "")
            if ACCENTS.search(x) or len(MOTS_FORTS.findall(x)) >= 2:
                total += 1
                print("  FRANÇAIS (script %s) : %s" % (nom, x[:110]))
    print("Contrôle des copies de scripts : %d chaîne(s) à vérifier." % total)


def lire_js():
    """Fusionne les dictionnaires des scripts : i18n/en/js-*.json -> ({français: anglais}, {nom de carte: carte})."""
    strings, dons = {}, {}
    for f in sorted(PAIRES.glob("js-*.json")):
        j = json.loads(f.read_text(encoding="utf-8"))
        strings.update(j.get("strings", {}))
        dons.update(j.get("dons", {}))
    return strings, dons


def ecrire_dictionnaire():
    strings, dons = lire_js()
    contenu = ("/* Généré par i18n/build_en.py à partir de i18n/en/js-*.json : ne pas modifier à la main. */\n"
               "window.I18N = %s;\nwindow.I18N_DONS = %s;\n") % (json.dumps(strings, ensure_ascii=False), json.dumps(dons, ensure_ascii=False))
    (ROOT / "i18n" / "en-js.js").write_text(contenu, encoding="utf-8", newline="\n")
    print("Dictionnaire des scripts : %d phrases, %d cartes." % (len(strings), len(dons)))


def controler_js():
    """Les phrases passées par tr("...") dans les scripts qui n'ont pas de traduction."""
    strings, _ = lire_js()
    motif = re.compile(r'\btr\(\s*("(?:[^"\\\n]|\\.)*")')
    manque = 0
    for f in sorted(ROOT.glob("*.js")):
        if f.name == "i18n.js":   # son commentaire donne un exemple
            continue
        for m in motif.finditer(f.read_text(encoding="utf-8", errors="ignore")):
            cle = json.loads(m.group(1))
            if cle not in strings:
                manque += 1
                print("  MANQUE (%s) : %s" % (f.name, cle[:90]))
    print("Contrôle des scripts : %d phrase(s) sans traduction." % manque)


if __name__ == "__main__":
    main()
