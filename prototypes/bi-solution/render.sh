#!/usr/bin/env bash
# Exporte chaque écran en PNG (x2) dans assets/, rogné à la hauteur du contenu.
# Usage : bash render.sh [recap margin rfc bkg bill project sls supply]
cd "$(dirname "$0")" || exit 1
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
ROOT="$(cd ../.. && pwd)"
URLROOT="file:///$(pwd -W | sed 's#\\#/#g')"
PY="$ROOT/.venv/Scripts/python.exe"
PAGES="${@:-recap margin rfc bkg bill project sls supply}"
for p in $PAGES; do
  tmp="$ROOT/prototypes/bi-solution/_$p.png"
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=${SCALE:-2} \
    --window-size=1280,2200 --virtual-time-budget=6000 \
    --screenshot="$(cygpath -w "$tmp")" "$URLROOT/bi.html#$p" >/dev/null 2>&1
  "$PY" -I - "$tmp" "$ROOT/assets/bi-$p.webp" "$p" <<'PYEOF'
import sys, io
from PIL import Image, ImageChops
src, dst, page = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert("RGB")
w, h = im.size
bbox = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).getbbox()
bottom = bbox[3]
if page in ("menu", "card", "fiche"):
    pad = round(28 * w / 1280)  # 28 px css
    w2 = round(560 * w / 1280) if page == "menu" else w
    out = im.crop((0, 0, w2, min(h, bottom + pad)))
else:
    out = im.crop((0, 0, w, bottom))
# sans perte, sauf si le fichier dépasse 150 Ko (au-delà, certains téléchargements locaux sont coupés)
buf = io.BytesIO()
out.save(buf, "WEBP", lossless=True, method=6)
if buf.tell() > 150 * 1024:
    buf = io.BytesIO()
    out.save(buf, "WEBP", quality=92, method=6)
open(dst, "wb").write(buf.getvalue())
print(dst, out.size, buf.tell() // 1024, "KB")
PYEOF
  [ -n "$KEEP" ] || rm -f "$tmp"
done
