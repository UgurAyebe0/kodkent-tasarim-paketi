#!/usr/bin/env python3
"""Belge sayfasını parçalardan birleştirir: build/kodkent-<anahtar>.html

Kullanım: python tools/assemble_doc.py <tasarim|teknik|mufredat|ekranlar> [--out YOL]

Parçalar build/parts/<anahtar>/ altında, dosya adına göre SIRALI birleştirilir:
  NN-ad.html   bölüm HTML'i (<section id="…">…); <style>/<script> İÇERMEZ
  NN-ad.css    sayfaya özel CSS (yalnızca tokenlar)
  NN-ad.js     sayfaya özel JS (KK.* hazırdır; elementler yüklenmiş olur)
Çatı (title, token bloğu, ortak CSS/JS, üst şerit, içindekiler, alt bilgi) tools/make_skeleton.py'den gelir.
Birden çok ajan aynı sayfayı yazıyorsa her biri KENDİ numara aralığındaki dosyaları yazar (çakışma olmaz);
test için herkes --out ile kendi klasörüne birleştirir, nihai dosyayı koordinatör üretir.
"""
import argparse
import pathlib
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import make_skeleton as ms  # noqa: E402

ROOT = HERE.parent


def read_all(files, label):
    return "\n".join(f"{label % f.name}\n{f.read_text(encoding='utf-8').rstrip()}\n" for f in files)


def main():
    ap = argparse.ArgumentParser(description="Belge sayfasını build/parts/<anahtar>/ parçalarından birleştirir.")
    ap.add_argument("key", choices=sorted(ms.PAGES))
    ap.add_argument("--out", help="çıktı yolu (varsayılan: build/kodkent-<anahtar>.html)")
    ap.add_argument("--parts", help="parça klasörü (varsayılan: build/parts/<anahtar>)")
    a = ap.parse_args()
    P = pathlib.Path(a.parts) if a.parts else ROOT / "build" / "parts" / a.key
    htmls, csss, jss = sorted(P.glob("*.html")), sorted(P.glob("*.css")), sorted(P.glob("*.js"))
    errs = []
    if not htmls:
        errs.append(f"{P} içinde *.html parçası yok")
    for f in htmls:
        t = f.read_text(encoding="utf-8")
        if re.search(r"<(script|style)\b", t, re.I):
            errs.append(f"{f.name}: <script>/<style> içeriyor (JS'i *.js, CSS'i *.css parçasına yaz)")
        if re.search(r"<!doctype|<html|<head|<body", t, re.I):
            errs.append(f"{f.name}: iskelet etiketi (doctype/html/head/body) içeriyor")
    for f in jss:
        if re.search(r"</script", f.read_text(encoding="utf-8"), re.I):
            errs.append(f"{f.name}: '</script' geçiyor")
    if errs:
        print("HATA:\n - " + "\n - ".join(errs))
        raise SystemExit(1)
    html = ms.build(a.key)
    for marker, text in (
        ("<!-- BOLUMLER -->", read_all(htmls, "<!-- %s -->")),
        ("/* SAYFA-CSS */", read_all(csss, "/* %s */")),
        ("/* SAYFA-JS */", read_all(jss, "/* %s */")),
    ):
        if html.count(marker) != 1:
            raise SystemExit(f"iskelette {marker} işareti bulunamadı/tekrarlı")
        html = html.replace(marker, text)
    out = pathlib.Path(a.out) if a.out else ROOT / "build" / f"kodkent-{a.key}.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"yazıldı: {out} — {out.stat().st_size // 1024} KB ({len(htmls)} bölüm, {len(csss)} css, {len(jss)} js parçası)")


if __name__ == "__main__":
    main()
