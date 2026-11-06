#!/bin/bash
# Kullanım: proto_smoke.sh [html]   (varsayılan: build/kodkent-prototip.html)
# Prototipi artifact iskeletiyle sarar, headless Edge ile "#selftest" hash'iyle açar ve sayfanın yazdığı
# <pre id="selftest-out"> sonucunu (her ekran için {token, ok, ms, hata} satırları) ekrana basar.
# Sözleşme (brief/04-prototip-sozlesmesi.md §8): #selftest → tüm kayıtlı ekranlar hızlı kurulum durumuyla sırayla render edilir,
# hatalar yakalanır ve sayfa sonuna <pre id="selftest-out"> yazılır; window.onerror/unhandledrejection hataları da dâhildir.
set -e
PROJ="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${KK_WORK:-/c/Users/uuray/AppData/Local/Temp/claude/C--Users-uuray-OneDrive-Masa-st--A--Oyun/7f8a7e11-0061-462a-aaf8-e2ec7e91569b/scratchpad}"
SRC="${1:-$PROJ/build/kodkent-prototip.html}"
NAME=$(basename "$SRC" .html)
TAG=$(basename "$(cd "$(dirname "$SRC")" && pwd)")
WR="$WORK/_wrapped/$TAG"; mkdir -p "$WR" "$WORK/shots"
python "$PROJ/tools/wrap.py" "$SRC" "$WR" >/dev/null
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
PROFILE="$WORK/shots/.edge-profile-smoke-$$"
WIN=$(cygpath -w "$WR/$NAME.light.html")
"$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir="$(cygpath -w "$PROFILE")" \
  --virtual-time-budget=20000 --allow-file-access-from-files --window-size=1280,800 \
  --dump-dom "file:///$WIN#selftest" 2>/dev/null > "$WR/$NAME.dom.html" || true
rm -rf "$PROFILE" 2>/dev/null
python - "$WR/$NAME.dom.html" <<'PY'
import re, sys, html
t = open(sys.argv[1], encoding='utf-8', errors='replace').read()
m = re.search(r'<pre id="selftest-out"[^>]*>(.*?)</pre>', t, re.S)
if not m:
    print('SELFTEST: çıktı yok (sayfa yüklenmedi, betik hatası var ya da #selftest desteklenmiyor)'); sys.exit(2)
print(html.unescape(m.group(1)))
PY
