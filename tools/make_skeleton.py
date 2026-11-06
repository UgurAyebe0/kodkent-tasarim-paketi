#!/usr/bin/env python3
"""KodKent belge sayfası iskeleti üretir: build/kodkent-<anahtar>.html

Kullanım:
  python tools/make_skeleton.py <tasarim|teknik|mufredat|ekranlar> [--force] [--out YOL]

İskelet; <title>, meta, font bağlantısı, <style> (brief/01 §2 token bloğu + brief/shared.css + brief/shared-diagram.css + SAYFA-CSS işareti),
üst şerit (logomark + belge ailesi), .layout (içindekiler + main), alt bilgi ve <script> (brief/shared.js + brief/shared-diagram.js + SAYFA-JS işareti +
KK başlatma satırları) içerir. Yazarlar yalnızca şu işaretleri Edit ile doldurur:
  <!-- BOLUMLER -->   (main içinde; bölüm HTML'i + işaretin kendisi eklenir, en sonda işaret silinir)
  /* SAYFA-CSS */     (sayfaya özel CSS)
  /* SAYFA-JS */      (sayfaya özel JS: grafik çağrıları vb.; KK.* hazırdır)
Var olan bir dosyanın üzerine yazmaz (--force ile yazar).
"""
import argparse
import re
import sys
import pathlib

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
BRIEF = ROOT / "brief"

PAGES = {
    "tasarim": ("KodKent Oyun Tasarımı", "Oyun Tasarımı"),
    "teknik": ("KodKent Teknik Mimari", "Teknik Mimari"),
    "mufredat": ("KodKent Müfredat ve İşletmeler", "Müfredat ve İşletmeler"),
    "ekranlar": ("KodKent Ekran Tasarımları", "Ekran Tasarımları"),
}
FAMILY = [("tasarim", "Tasarım"), ("teknik", "Teknik"), ("mufredat", "Müfredat"), ("ekranlar", "Ekranlar"), ("prototip", "Prototip")]

FONT_LINK = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800'
    '&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">'
)

# Ortak iskelet eki: sayfalar arası tutarlı kapak, belge giriş kutusu, mobil içindekiler, küçük yardımcılar (yalnızca tokenlar).
EXTRA_CSS = """
/* ---- İskelet eki ---- */
.topbar{padding-inline:max(0px,calc((100% - 1240px)/2))}
.cover{display:grid;gap:14px;padding-block:8px 24px}
.cover .logo-lg{display:flex;align-items:center;gap:14px}
.cover .logo-lg svg{width:56px;height:56px;flex:0 0 auto}
.cover h1{font-size:clamp(34px,6vw,58px)}
.cover .slogan{font-family:var(--font-display);font-size:clamp(19px,2.6vw,26px);font-weight:700;color:var(--cobalt)}
.cover .sub{font-size:17px;color:var(--fg-2);max-width:62ch;margin:0}
.docbox{border:1px solid var(--line);border-left:4px solid var(--cobalt);background:var(--surface);border-radius:var(--radius);padding:14px 18px;max-width:78ch}
.docbox p{margin:0;max-width:none}
.src-list{columns:2 260px;column-gap:28px;font-size:14px;padding-left:18px;margin:8px 0}
.kv{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:6px 16px;margin:0}
.kv dt{color:var(--muted);font-size:13px}.kv dd{margin:0}
#toc-m ol{list-style:none;margin:0 0 12px;padding:0}
#toc-m li a{display:block;padding:6px 4px;color:var(--fg-2);text-decoration:none}
#toc-m li.h3 a{padding-left:18px;font-size:13px;color:var(--muted)}
footer.site nav.family{margin-left:auto}
"""


def read(p):
    return (BRIEF / p).read_text(encoding="utf-8")


def token_block():
    md = read("01-tasarim-sistemi.md")
    i = md.index("## 2.")
    m = re.search(r"```css\n(.*?)\n```", md[i:], re.S)
    if not m:
        raise SystemExit("01-tasarim-sistemi.md içinde §2 css bloğu bulunamadı")
    return m.group(1)


def logo_svg():
    txt = read("logo.svg.txt")
    m = re.search(r"<svg.*?</svg>", txt, re.S)
    return re.sub(r"\s*\n\s*", "", m.group(0))


def family_nav(current, label=None):
    links = "".join(
        '<a href="#" data-doc="%s"%s>%s</a>' % (k, ' class="current"' if k == current else "", t) for k, t in FAMILY
    )
    return '<nav class="family"%s>%s</nav>' % (' aria-label="%s"' % label if label else "", links)


def build(key):
    title, short = PAGES[key]
    svg = logo_svg()
    html = f"""<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
{FONT_LINK}
<style>
{token_block()}
{read("shared.css")}
{read("shared-diagram.css")}
{EXTRA_CSS}
/* SAYFA-CSS */
</style>
<header class="topbar">
  <a class="brand" href="#">{svg}<span>KodKent</span> <small>{short}</small></a>
  {family_nav(key)}
</header>
<div class="layout">
  <nav class="toc" id="toc" aria-label="İçindekiler"></nav>
  <main>
    <details class="acc toc-mobile"><summary>İçindekiler</summary><nav id="toc-m" aria-label="İçindekiler (mobil)"></nav></details>
<!-- BOLUMLER -->
  </main>
</div>
<footer class="site"><span>KodKent tasarım paketi · Sürüm 1.0 · 2 Kasım 2026</span>{family_nav(key, "Belge ailesi")}</footer>
<script>
{read("shared.js")}
{read("shared-diagram.js")}
/* SAYFA-JS */
KK.wireCode(); KK.buildToc(document.getElementById('toc')); KK.buildToc(document.getElementById('toc-m')); KK.openHash();
</script>
"""
    return html


def main():
    ap = argparse.ArgumentParser(description="KodKent belge sayfası iskeleti üretir (build/kodkent-<anahtar>.html).")
    ap.add_argument("key", choices=sorted(PAGES), help="sayfa anahtarı")
    ap.add_argument("--force", action="store_true", help="var olan dosyanın üzerine yaz (içeriği siler!)")
    ap.add_argument("--out", help="çıktı yolu (varsayılan: build/kodkent-<anahtar>.html)")
    a = ap.parse_args()
    path = pathlib.Path(a.out) if a.out else ROOT / "build" / f"kodkent-{a.key}.html"
    if path.exists() and not a.force:
        raise SystemExit(f"{path} zaten var; üzerine yazmak için --force kullan (içeriği siler!)")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(build(a.key), encoding="utf-8")
    print(f"iskelet yazıldı: {path} ({path.stat().st_size} bayt)")


if __name__ == "__main__":
    main()
