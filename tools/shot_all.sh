#!/bin/bash
# Kullanım: shot_all.sh <sayfa.html> [bolum-id ...]
# Sayfayı artifact iskeletiyle sarar ve $WORK/shots/ altına şunları üretir:
#   <ad>-desktop-light.png, <ad>-desktop-dark.png, <ad>-mobile.png
#   verilen her bölüm id'si için <ad>-sec-<id>.png (masaüstü, açık tema, o bölüme kaydırılmış)
# WORK (OneDrive DIŞI) varsayılanı bu oturumun scratchpad klasörüdür; KK_WORK ile değiştirilebilir.
# Boyutlar (ortam değişkeniyle): KK_H masaüstü yüksekliği (3000), KK_MH mobil yükseklik (3000), KK_SH bölüm yüksekliği (1800).
#   Tek ekranlık uygulama (prototip) için ör.: KK_H=800 KK_MH=844 KK_SH=800 bash tools/shot_all.sh build/kodkent-prototip.html meydan kurul
set -e
PROJ="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${KK_WORK:-/c/Users/uuray/AppData/Local/Temp/claude/C--Users-uuray-OneDrive-Masa-st--A--Oyun/7f8a7e11-0061-462a-aaf8-e2ec7e91569b/scratchpad}"
H="${KK_H:-3000}"; MH="${KK_MH:-3000}"; SH="${KK_SH:-1800}"
SRC="$1"; shift || true
NAME=$(basename "$SRC" .html)
TAG=$(basename "$(cd "$(dirname "$SRC")" && pwd)")   # kaynağın klasör adı: aynı anda çalışan ajanların çıktıları karışmaz
WR="$WORK/_wrapped/$TAG"; OUT="$WORK/shots/$TAG"; mkdir -p "$WR" "$OUT"
python "$PROJ/tools/wrap.py" "$SRC" "$WR" >/dev/null
cat > "$WR/$NAME.mobile-host.html" <<EOF
<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#888}iframe{display:block;width:400px;height:${MH}px;border:0;background:#fff}</style></head><body><iframe src="$NAME.light.html"></iframe></body></html>
EOF
"$PROJ/tools/shot.sh" "$WR/$NAME.light.html" "$OUT/$NAME-desktop-light.png" 1280 "$H"
"$PROJ/tools/shot.sh" "$WR/$NAME.dark.html"  "$OUT/$NAME-desktop-dark.png"  1280 "$H"
"$PROJ/tools/shot.sh" "$WR/$NAME.mobile-host.html" "$OUT/$NAME-mobile.png" 420 "$MH"
for id in "$@"; do
  cat > "$WR/$NAME.sec-$id.html" <<EOF
<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#888}iframe{display:block;width:1280px;height:${SH}px;border:0;background:#fff}</style></head><body><iframe src="$NAME.light.html#$id"></iframe></body></html>
EOF
  "$PROJ/tools/shot.sh" "$WR/$NAME.sec-$id.html" "$OUT/$NAME-sec-$id.png" 1280 "$SH"
done
echo "Ekran görüntüleri: $OUT/$NAME-*.png"
