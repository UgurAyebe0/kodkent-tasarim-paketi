#!/usr/bin/env python3
"""build/kodkent-*.html içindeki `data-doc="<anahtar>"` bağlantılarına brief/urls.json'daki gerçek adresleri yazar.
Kullanım: python tools/link_docs.py [kodkent-teknik.html ...]   (isteğe bağlı dosya filtresi; idempotent; yayınlamadan önce çalıştırılır; sayfalar yeniden üretilirse tekrar çalıştır)"""
import json
import pathlib
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
urls = json.loads((ROOT / "brief" / "urls.json").read_text(encoding="utf-8"))
pat = re.compile(r'<a\b[^>]*\bdata-doc="(\w+)"[^>]*>')


def fix(m):
    tag, key = m.group(0), m.group(1)
    url = urls.get(key)
    if not url:
        return tag
    if re.search(r'\bhref="[^"]*"', tag):
        return re.sub(r'\bhref="[^"]*"', f'href="{url}"', tag, count=1)
    return tag.replace("<a ", f'<a href="{url}" ', 1)


only = set(sys.argv[1:])
for f in sorted((ROOT / "build").glob("kodkent-*.html")):
    if only and f.name not in only:
        continue
    t = f.read_text(encoding="utf-8")
    n = len(pat.findall(t))
    t2 = pat.sub(fix, t)
    if t2 != t:
        f.write_text(t2, encoding="utf-8")
    print(f"{f.name}: {n} data-doc bağlantısı, {'güncellendi' if t2 != t else 'değişmedi'}")
