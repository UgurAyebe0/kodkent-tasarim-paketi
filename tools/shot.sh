#!/bin/bash
# kullanım: shot.sh <wrapped.html> <out.png> <genişlik> <yükseklik>
# Her çağrı kendi geçici Edge profilini kullanır (aynı anda birden çok ajan çalışabilir) ve sonunda siler.
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
PROFILE="$(dirname "$2")/.edge-profile-$$"
WINPATH=$(cygpath -w "$1"); OUT=$(cygpath -w "$2")
"$EDGE" --headless=new --disable-gpu --no-first-run --no-default-browser-check --hide-scrollbars --user-data-dir="$(cygpath -w "$PROFILE")" --virtual-time-budget=6000 --allow-file-access-from-files --window-size=$3,$4 --screenshot="$OUT" "file:///$WINPATH" >/dev/null 2>&1
rm -rf "$PROFILE" 2>/dev/null
ls -la "$2" 2>/dev/null || echo "screenshot FAILED: $2"
