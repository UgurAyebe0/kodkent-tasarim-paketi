#!/usr/bin/env python3
"""build/proto/ parçalarından tek dosyalık prototipi üretir: build/kodkent-prototip.html

Kullanım: python tools/assemble_proto.py [--out YOL]

Parça düzeni (hepsi build/proto/ altında; dosya adlarına göre SIRALI birleştirilir):
  head.html        <title>, <meta>, <link> satırları (style/script YOK)
  css/*.css        tek <style> bloğuna birleşir
  sprite.html      satır içi SVG <symbol> sprite (isteğe bağlı)
  shell.html       demo çubuğu + #app iskeleti
  core/*.js        1. <script> (DOM'a dokunmaz; KK_CORE'u tanımlar; 'use strict' otomatik eklenir)
  ui/*.js          2. <script> (arayüz; 'use strict' otomatik eklenir)
Parçalarda ayrıca 'use strict' yazma, '</script' geçirme. Hatalar çıkışı 1 yapar.
"""
import argparse
import pathlib
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
P = ROOT / "build" / "proto"


def cat(folder, pattern):
    files = sorted((P / folder).glob(pattern)) if (P / folder).exists() else []
    if folder == "core" and (P / "core" / "99-export.js").exists():
        files = [f for f in files if "stub" not in f.name]  # geçici çekirdek taslakları, gerçek dışa aktarım gelince atlanır
    parts = []
    for f in files:
        txt = f.read_text(encoding="utf-8")
        parts.append(f"/* ==== {folder}/{f.name} ==== */\n{txt.rstrip()}\n")
    return "".join(parts), files


def main():
    ap = argparse.ArgumentParser(description="Prototip parçalarını tek HTML dosyasında birleştirir.")
    ap.add_argument("--out", help="çıktı yolu (varsayılan: build/kodkent-prototip.html)")
    a = ap.parse_args()
    errs = []

    def opt(name):
        p = P / name
        return p.read_text(encoding="utf-8").strip() if p.exists() else ""

    head = opt("head.html")
    if not head.startswith("<title>"):
        errs.append("head.html '<title>' ile başlamalı")
    css, cssf = cat("css", "*.css")
    core, coref = cat("core", "*.js")
    ui, uif = cat("ui", "*.js")
    if not coref:
        errs.append("core/*.js yok")
    if not uif:
        errs.append("ui/*.js yok")
    for f in coref + uif:
        t = f.read_text(encoding="utf-8")
        if re.search(r"</script", t, re.I):
            errs.append(f"{f.name}: '</script' geçiyor (örn. '<\\/script' yaz)")
        if re.search(r"^\s*['\"]use strict['\"]", t):
            errs.append(f"{f.name}: parçada 'use strict' yazma (birleştirici ekler)")
    if errs:
        print("HATA:\n - " + "\n - ".join(errs))
        raise SystemExit(1)
    html = f"""{head}
<style>
{css}</style>
{opt("sprite.html")}
{opt("shell.html")}
<script>
'use strict';
{core}</script>
<script>
'use strict';
{ui}</script>
"""
    out = pathlib.Path(a.out) if a.out else ROOT / "build" / "kodkent-prototip.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"yazıldı: {out} — {out.stat().st_size // 1024} KB (css {len(cssf)}, core {len(coref)}, ui {len(uif)} parça)")


if __name__ == "__main__":
    main()
