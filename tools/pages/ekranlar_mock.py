"""Ekranlar sayfası, 2. aşama: prototip CSS'inin `.mock` kapsamına alınması, cihaz çerçevesi, bileşen örnekleri (DEMOS) ve 6 mockup (MOCKUPS).

Stil kaynağı: build/proto/css/00-base.css ve 10-components.css (betikle `.mock` ön ekiyle kapsamlanır; genişlik tabanlı @media blokları `.mock.m` (mobil çerçeve)
sınıfına çevrilir, böylece belge penceresinin genişliği mockup görünümünü değiştirmez). Avatar ve ikon SVG'leri build/proto/export/*.json'dan satır içi gömülür.
"""
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from ekranlar_data import ROOT, M, esc, ik, avatar_svg, usta_svg, prop_svg, uniq_ids, AVATARS, B8, tbl  # noqa: E402

PROTO_CSS = ROOT / "build" / "proto" / "css"


# ------------------------------------------------------------------ CSS kapsamlama
def _top_split(s, sep=","):
    out, depth, cur = [], 0, []
    for ch in s:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth -= 1
        if ch == sep and depth == 0:
            out.append("".join(cur))
            cur = []
        else:
            cur.append(ch)
    out.append("".join(cur))
    return [x.strip() for x in out if x.strip()]


ID_MAP = {"#hud": ".mx-hud", "#screen": ".mx-screen", "#demo-bar": ".mx-demo", "#float-root": ".mx-float", "#toast-root": ".mx-toasts", "#modal-root": ".mx-modals"}


def _map_sel(sel, base):
    s = sel.strip()
    for k, v in ID_MAP.items():
        s = s.replace(k, v)
    if s in (":root", "html", "body", "html,body"):
        return base
    if s == "*":
        return f"{base} *"
    if s.startswith("*::") or s.startswith("*:"):
        return f"{base} {s}"
    s = re.sub(r"^(html|body|:root)\s+", "", s)
    return f"{base} {s}"


def scope_css(css, scope=".mock"):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

    def block_end(t, i):
        depth, n = 0, len(t)
        while i < n:
            c = t[i]
            if c in "\"'":
                q = c
                i += 1
                while i < n and t[i] != q:
                    i += 2 if t[i] == "\\" else 1
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return i + 1
            i += 1
        return n

    def parse(t, mobile=False):
        res, pos, n = [], 0, len(t)
        base = scope + (".m" if mobile else "")
        while pos < n:
            while pos < n and t[pos].isspace():
                pos += 1
            if pos >= n:
                break
            j = pos
            while j < n and t[j] not in "{;":
                j += 1
            prelude = t[pos:j].strip()
            if j < n and t[j] == ";":
                res.append(prelude + ";")
                pos = j + 1
                continue
            end = block_end(t, j)
            body = t[j + 1:end - 1]
            if prelude.startswith("@"):
                name = re.match(r"@([\w-]+)", prelude).group(1)
                if name == "media" and re.search(r"max-width|min-width|pointer", prelude):
                    res.append(parse(body, True))
                elif name in ("media", "supports"):
                    res.append(prelude + "{" + parse(body, mobile) + "}")
                else:  # keyframes, font-face ...
                    res.append(prelude + "{" + body + "}")
            else:
                res.append(",".join(_map_sel(s, base) for s in _top_split(prelude)) + "{" + body + "}")
            pos = end
        return "".join(res)

    return parse(css)


def proto_scoped():
    raw = "".join((PROTO_CSS / f).read_text(encoding="utf-8") for f in ("00-base.css", "10-components.css"))
    return scope_css(raw)


FRAME_CSS = r"""
/* ---- mockup çerçevesi (belge tokenları) ---- */
.devfig{margin-block:14px;display:grid;gap:10px}
.devrow{display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap}
.devframe{flex:1 1 100%;min-width:0;max-width:1100px;border:1px solid var(--line-2);border-radius:14px;background:var(--surface-3);box-shadow:var(--shadow);overflow:hidden}
.devframe.phone{flex:0 1 300px;max-width:300px;border-radius:34px;padding:10px 8px 14px;border-width:3px}
.devbar{display:flex;align-items:center;gap:6px;padding:7px 12px;background:var(--surface-2);border-bottom:1px solid var(--line-2);font-size:12px;color:var(--muted)}
.devbar i{width:10px;height:10px;border-radius:50%;background:var(--line-2);flex:0 0 auto}
.devbar span{margin-left:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.devbox{position:relative;overflow:hidden;background:#0D1326}
.devframe.phone .devbox{border-radius:22px}
.devscreen{position:absolute;left:0;top:0;transform-origin:0 0}
.mockcap{display:grid;gap:4px;font-size:13.5px;color:var(--muted)}
.mockcap b{color:var(--fg)}
.mockjson{margin:0}
.mk-tabs{flex:1 1 100%;display:flex;flex-wrap:wrap;gap:6px}
.mk-tabs button{font:inherit;font-size:13.5px;font-weight:600;padding:7px 12px;border:1px solid var(--line-2);border-radius:999px;background:var(--surface);color:var(--fg-2);cursor:pointer}
.mk-tabs button:hover{background:var(--surface-2)}
.mk-tabs button[aria-selected="true"]{background:var(--accent-soft);color:var(--accent-ink);border-color:var(--accent)}
.mk-pane{flex:1 1 100%;min-width:0;display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start}
.mk-pane[hidden]{display:none}
.mk-glow .btn{width:100%}
.mk-glow{display:flex;border-radius:14px;box-shadow:0 0 0 3px rgba(34,201,206,.6),0 0 24px 4px rgba(34,201,206,.5)}
.demo{margin:10px 0 6px}
.demo-in{padding:16px;border-radius:var(--radius-lg);border:1px solid var(--line-2)}
.demo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:14px;align-items:start}
.demo-cell{display:grid;gap:6px;align-content:start;min-width:0}
.demo-cell>small,.demo-lbl{font:700 11.5px/1.2 var(--font-body);letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}
.demo-row{display:flex;flex-wrap:wrap;gap:12px 14px;align-items:center}
.demo-stage{position:relative;height:300px;overflow:hidden;border-radius:var(--radius-lg)}
"""

# ---- .mock içi yardımcı sınıflar (kapsam elle yazıldı) ----
MOCK_EXTRA = r"""
.mock{background-attachment:scroll!important;overflow:hidden}
.mock p,.mock li{max-width:none}
.mock .demo-in-mock{display:grid;gap:14px}
.mock .abs{position:absolute}
.mock .ab-card{position:absolute;background:linear-gradient(180deg,#16204A,#101833);border:2px solid var(--line-2);border-radius:18px;box-shadow:var(--golge),var(--parla);overflow:hidden}
.mock .kl.dim{opacity:.45}
.mock .kl.edit{background:rgba(34,201,206,.09);box-shadow:inset 3px 0 0 var(--accent)}
.mock .kl.vurgu{background:rgba(255,190,61,.15);box-shadow:inset 3px 0 0 var(--amber)}
.mock .kl.ekle{background:rgba(69,217,141,.13)} .mock .kl.sil{background:rgba(255,122,102,.13)}
.mock .kl .isaret{display:inline-block;width:1.4em;font-weight:700}
.mock .kodblok .kl{position:relative}.mock .etiket-kl{position:absolute;right:8px;top:1px;padding:0 8px;border-radius:999px;background:#3B2F12;border:1px solid var(--amber-koyu);color:var(--amber-ink);font:800 11px/18px var(--font-body);letter-spacing:.03em}
.mock .kodblok{margin:0;padding:10px 0;background:var(--code-bg);border:2px solid var(--code-line);border-radius:var(--r);font:400 13px/1.62 var(--font-mono);white-space:pre;overflow:auto;box-shadow:inset 0 2px 6px rgba(0,0,0,.35)}
.mock .kodblok code{font:inherit}
.mock .kodblok .kl{display:block;padding:0 14px 0 6px;min-height:1.62em}
.mock .kodblok .ln{display:inline-block;width:2.4em;margin-right:12px;text-align:right;color:#55648C;user-select:none}
.mock .kodblok .k{color:#BDB0FF}.mock .kodblok .s{color:#7FE8B3}.mock .kodblok .n{color:#FFD27A}.mock .kodblok .c{color:#7F8DB0;font-style:italic}.mock .kodblok .t{color:#5FE0E3}
.mock .ust-sekme{display:flex;gap:6px;border-bottom:2px solid var(--line);margin:0}
.mock .ust-sekme span{padding:10px 14px;font:600 15px var(--font-display);color:var(--muted);border-bottom:3px solid transparent;margin-bottom:-2px}
.mock .ust-sekme span.on{color:var(--fg);border-bottom-color:var(--accent)}
.mock .nokta{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--amber);vertical-align:middle}
.mock .yz{opacity:.55}
.mock .kvl{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:14px}
.mock .kvl dt{color:var(--muted)}.mock .kvl dd{margin:0}
.mock .pk{display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:14px;background:var(--surface-2);border:2px solid var(--line);min-width:0}
.mock .pk.nad-siradan,.mock .pk.nad-sik,.mock .pk.nad-nadir{border-color:var(--nad)}
.mock .pk.secili{box-shadow:0 0 0 3px rgba(34,201,206,.35);border-color:var(--accent)}
.mock .pk .fiyat{display:inline-flex;align-items:center;gap:5px;font:600 16px var(--font-display);color:var(--amber-ink)}
.mock .pk .fiyat .ik{width:20px;height:20px}
.mock .pk .urun{height:54px;display:grid;place-items:center;border-radius:10px;background:radial-gradient(70% 70% at 50% 40%,#2A3870,#141C3E)}
.mock .pk b{font:600 14px/1.2 var(--font-display)}
.mock .pk small{font-size:12px;color:var(--muted)}
.mock .led{background:#05070F;border:3px solid #26325A;border-radius:6px;padding:6px 14px;font:700 15px/1 var(--font-mono);color:#FFBE3D;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 0 6px rgba(255,190,61,.6);white-space:nowrap;overflow:hidden}
.mock .pl{position:absolute;display:grid;justify-items:center;gap:1px;transform:translate(-50%,-100%)}
.mock .pl .ad{font:800 11px/1 var(--font-body);color:#fff;background:rgba(10,16,36,.78);padding:2px 7px;border-radius:999px;white-space:nowrap}
.mock .pl .ad i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px;vertical-align:-1px}
.mock .bln{position:absolute;transform:translate(-50%,-100%);max-width:200px;padding:5px 9px;border-radius:10px;background:#F4F6FA;color:#18213A;font:700 12px/1.3 var(--font-body);box-shadow:0 3px 0 rgba(4,7,16,.5)}
.mock .mx-flag{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font:800 12px/1 var(--font-body);background:var(--surface-3);color:var(--fg-2)}
.mock .toast{max-width:420px}
"""

MOCK_CSS = FRAME_CSS + "\n" + proto_scoped() + "\n" + MOCK_EXTRA

MOCK_JS = r"""
function fitAll() {
  document.querySelectorAll('.devframe').forEach(f => {
    const s = f.querySelector('.devscreen'), b = f.querySelector('.devbox'), w = +f.dataset.w, h = +f.dataset.h;
    if (!s || !b || !b.clientWidth) return;
    const k = Math.max(0.5, Math.min(1, b.clientWidth / w));
    s.style.transform = 'scale(' + k + ')'; b.style.height = Math.round(h * k) + 'px';
    b.style.overflowX = w * k > b.clientWidth + 1 ? 'auto' : 'hidden';   // dar ekranda okunur ölçek (≥ %50) ve yatay kaydırma
  });
}
if (window.ResizeObserver) { const ro = new ResizeObserver(fitAll); document.querySelectorAll('.devframe').forEach(f => ro.observe(f)); }
window.addEventListener('resize', fitAll); document.addEventListener('toggle', fitAll, true); window.addEventListener('load', fitAll); fitAll();
document.querySelectorAll('.mk-tabs').forEach(tl => {
  const tabs = [...tl.querySelectorAll('[role=tab]')], panes = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  const show = i => { tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; if (panes[k]) panes[k].hidden = k !== i; }); fitAll(); };
  tabs.forEach((t, i) => t.addEventListener('click', () => show(i)));
  tl.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement), n = tabs.length;
    const j = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (j >= 0) { e.preventDefault(); show(j); tabs[j].focus(); }
  });
  show(0);
});
"""

RESERVED_IDS = []  # ekranlar_mocks6 doldurur


# ------------------------------------------------------------------ küçük HTML üreticileri (prototip sınıflarıyla)
def I(name, size=20, cls=""):
    return ik(name, size, cls)


def cubuk(pct, tur="xp", ince=False, etiket="İlerleme"):
    return (f'<div class="cubuk cubuk-{tur}{" cubuk-ince" if ince else ""}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{pct}" aria-label="{esc(etiket)}"><i style="width:{pct}%"></i></div>')


def halka(pct, size=96, tur="", metin=None, alt=None, etiket=None):
    C = 2 * 3.14159265 * 42
    metin = metin if metin is not None else str(round(pct))
    t = f' halka-{tur}' if tur else ""
    return (f'<svg class="halka{t}" width="{size}" height="{size}" viewBox="0 0 100 100" role="img" aria-label="{esc(etiket or ("%" + str(round(pct))))}">'
            f'<circle class="halka-iz" cx="50" cy="50" r="42"/><circle class="halka-dolgu" cx="50" cy="50" r="42" transform="rotate(-90 50 50)" stroke-dasharray="{C:.2f}" stroke-dashoffset="{C * (1 - pct / 100):.2f}"/>'
            f'<text class="halka-metin" x="50" y="{45 if alt else 51}">{esc(metin)}</text>' + (f'<text class="halka-alt" x="50" y="68">{esc(alt)}</text>' if alt else "") + "</svg>")


SAYAC = {"bayt": ("coin", "B"), "cip": ("chip", "Çip"), "xp": ("xp", "XP")}


def sayac(kind, val, small=False, extra=""):
    ic, unit = SAYAC[kind]
    return f'<span class="sayac sayac-{kind}{" sayac-kucuk" if small else ""}"{extra}>{I(ic, 28)}{esc(val)}<small>{unit}</small></span>'


def chip(txt, tur="", ic=None):
    return f'<span class="chip{(" chip-" + tur) if tur else ""}">{I(ic, 14) if ic else ""}{esc(txt)}</span>'


def durum(d):
    e = {"yok": "Arsa yok", "satilik": "Satılık", "kapali": "Kapalı — yazılım bekliyor", "deneme": "Deneme (%50 gelir)", "acik": "Açık", "kararmis": "Kararmış"}
    return f'<span class="durum durum-{d}">{e[d]}</span>'


def btn(txt, cls="", ic=None, attrs=""):
    return f'<button type="button" class="btn {cls}"{attrs}>{I(ic, 20) if ic else ""}{esc(txt)}</button>'


def bubble(kind, who, html, portre=None):
    """Usta balonu (portre + ad) ya da oyuncu/sistem balonu."""
    if kind == "usta":
        return f'<div class="diyalog"><div class="diyalog-portre"><span class="portre">{usta_svg(portre or "defne", 56)}</span><b>{esc(who)}</b></div><div class="balon balon-usta balon-kuyruk">{html}</div></div>'
    cls = {"ben": "balon balon-ben", "sistem": "balon balon-sistem", "musteri": "balon balon-usta"}[kind]
    return f'<div class="{cls}"><div class="balon-ad">{esc(who)}</div>{html}</div>' if who else f'<div class="{cls}">{html}</div>'


def bust(av_id, size=44):
    """Avatar büstü (prototip avatarının baş-omuz kesiti)."""
    svg = avatar_svg(av_id)
    svg = re.sub(r'viewBox="[^"]+"', 'viewBox="16 8 64 64"', svg, count=1)
    svg = re.sub(r'width="\d+" height="\d+"', f'width="{size}" height="{size}"', svg, count=1)
    return svg


def pos(x, y, w=None, h=None, extra=""):
    s = f"left:{x}px;top:{y}px;" + (f"width:{w}px;" if w is not None else "") + (f"height:{h}px;" if h is not None else "")
    return f'style="{s}{extra}"'


CS_KW = set("public static class int return if else void string bool var new const foreach for while using namespace private double".split())
CS_TYPES = {"int", "string", "bool", "double"}


def hl_cs(line):
    out, i = [], 0
    for m in re.finditer(r'(//.*$)|("[^"]*")|(\b\d+\b)|(\b[A-Za-zÇĞİÖŞÜçğıöşü_]\w*\b)', line):
        out.append(esc(line[i:m.start()]))
        t = m.group(0)
        if m.group(1):
            out.append(f'<span class="c">{esc(t)}</span>')
        elif m.group(2):
            out.append(f'<span class="s">{esc(t)}</span>')
        elif m.group(3):
            out.append(f'<span class="n">{esc(t)}</span>')
        elif t in CS_TYPES or (t[0].isupper() and t not in CS_KW and t.isalpha() and len(t) > 3 and t == "Otopark"):
            out.append(f'<span class="t">{esc(t)}</span>')
        elif t in CS_KW:
            out.append(f'<span class="k">{esc(t)}</span>')
        else:
            out.append(esc(t))
        i = m.end()
    out.append(esc(line[i:]))
    return "".join(out)


def kod_satirlar(src, classes=None, start=1, label_line=None):
    """C# satırlarını `.kl` satırlarına çevirir; classes: {satır_no: 'dim'|'edit'|'vurgu'|'ekle'|'sil'}."""
    rows = []
    for k, ln in enumerate(src.rstrip("\n").split("\n"), start):
        c = (classes or {}).get(k, "")
        extra = f'<span class="etiket-kl">Kurul\'un seçtiği satır</span>' if label_line == k else ""
        rows.append(f'<span class="kl {c}"><span class="ln">{k}</span>{hl_cs(ln)}{extra}</span>')
    return "".join(rows)


def kodblok(src, classes=None, label_line=None, aria="C# kodu"):
    n = len(src.rstrip("\n").split("\n"))
    return f'<pre class="kodblok" role="region" aria-label="{esc(aria)}, {n} satır" tabindex="0"><code>{kod_satirlar(src, classes, label_line=label_line)}</code></pre>'


def frame(token, w, h, inner, title, mobile=False, cap=None, extra_class=""):
    bar = "" if mobile else f'<div class="devbar"><i></i><i></i><i></i><span>kodkent.app/#{token} · {esc(title)}</span></div>'
    cls = "devframe phone" if mobile else "devframe"
    return (f'<div class="{cls}" data-w="{w}" data-h="{h}">{bar}<div class="devbox" style="height:{int(h * 0.5)}px">'
            f'<div class="devscreen mock{" m" if mobile else ""} {extra_class}" style="width:{w}px;height:{h}px" role="group" aria-label="{esc(title)} mockup">{inner}</div></div></div>')


def figure(token, rows, caption, ident):
    RESERVED_IDS.append(ident)
    return (f'<figure class="devfig" id="{ident}"><div class="devrow">{rows}</div><figcaption class="mockcap">{caption}</figcaption></figure>')


# ------------------------------------------------------------------ bileşen örnekleri (B8 §9) — iki belge temasında aynı (oyun tek temalı)
def stage(inner, cls=""):
    return f'<div class="demo"><div class="mock demo-in {cls}"><div class="demo-in-mock">{inner}</div></div></div>'


def cell(lbl, html):
    return f'<div class="demo-cell"><small>{esc(lbl)}</small>{html}</div>'


def demo_button():
    r1 = "".join(cell(l, h) for l, h in [
        ("Birincil", btn("Kodu Gönder", "btn-birincil", "gonder")), ("İkincil", btn("Vazgeç")), ("Metin", '<button type="button" class="btn-baglanti">Kuralları Gör</button>'),
        ("Tehlike", btn("Hesabı Sil", "btn-tehlike")), ("Bayt / Ödül", btn("Kasayı Topla", "btn-altin", "coin")),
        ("Simge (44×44)", '<button type="button" class="btn btn-ikon" aria-label="Ayarlar">' + I("disli", 22) + "</button>")])
    r2 = "".join(cell(l, h) for l, h in [
        ("Boyut S 40", btn("Küçük", "btn-kucuk")), ("Boyut M 48 (varsayılan)", btn("Orta")), ("Boyut L 56", btn("Büyük birincil", "btn-birincil btn-buyuk")),
        ("Basılı", btn("Basılı", "btn-birincil basili")), ("Devre dışı", btn("Müfettişi Çağır", "", None, " disabled")),
        ("Yükleniyor", btn("Testler çalışıyor…", "btn-birincil yukleniyor")), ("Başarı", btn("4/6 test geçti", "btn-basari", "tik"))])
    return stage(f'<div class="demo-grid">{r1}</div><div class="demo-grid">{r2}</div>')


def demo_card():
    a = cell("Yüzey", '<div class="kart"><div class="kart-baslik">' + I("akademi", 22) + 'Çarşı Kürsüsü</div><p class="soluk kucuk" style="margin:0">Ders 1.1 · Merhaba KodKent · 8 dk</p></div>')
    b = cell("Vurgulu (seçili)", '<div class="kart kart-secili"><div class="kart-baslik">' + I("pazar", 22) + 'Bayt Rafları</div><p class="soluk kucuk" style="margin:0">Seçili sekme, önerilen raf</p></div>')
    c = cell("Nadirlik çerçeveli", '<div class="kart nad-nadir"><span class="nad-etiket">Nadir</span><div class="kart-baslik" style="margin:6px 0 0">Kaptan Şapkası</div><p class="soluk kucuk" style="margin:0">Seri No. 037/200</p></div>')
    d = cell("Durum şeritli", '<div class="kart kart-nane" style="border-top-width:6px">' + durum("acik") + '<div class="kart-baslik" style="margin:6px 0 0">Otopark</div></div>')
    e = cell("Kilitli", '<div class="kart kart-kilitli"><div class="kart-baslik">' + I("kilit", 22) + 'Oda</div><p class="soluk kucuk" style="margin:0">Bunun için Sev. 2 gerekiyor.</p></div>')
    f = cell("Yükleniyor (iskelet)", '<div class="kart"><span class="iskelet" style="height:18px;width:60%"></span><span class="iskelet" style="height:12px;width:90%;margin-top:10px"></span><span class="iskelet" style="height:12px;width:70%;margin-top:8px"></span></div>')
    return stage(f'<div class="demo-grid">{a}{b}{c}{d}{e}{f}</div>')


def demo_modal():
    onay = ('<div class="modal-arka" style="position:absolute"><div class="modal" role="dialog" aria-modal="true" aria-label="Satın alma onayı" style="width:min(100%,460px)">'
            '<div class="modal-baslik">Satın alma onayı</div><div class="modal-govde">Kaptan Şapkası\'nı 520 B\'ye almak üzeresin. Cüzdan: 1.240 B → 720 B.</div>'
            f'<div class="modal-alt">{btn("Vazgeç", "btn-hayalet")}{btn("Satın Al", "btn-altin", "coin")}</div></div></div>')
    sev = ('<div class="modal-arka" style="position:absolute"><div class="modal" role="dialog" aria-modal="true" aria-label="Seviye atlama" style="width:min(100%,420px)">'
           '<div class="modal-govde"><div class="seviye-atla">' + halka(100, 120, "mor", "2", "SEVİYE", "Seviye 2") + '<span class="seviye-unvan">Seviye 2 · Çırak</span>'
           '<p style="margin:0">Odan açıldı: Bloklar\'da kapını bul.</p><div class="hediye-kart">' + I("hediye", 32) + '<div><b>Hediyen: 1 emote çark yuvası.</b></div></div></div></div>'
           f'<div class="modal-alt">{btn("Devam", "btn-birincil")}</div></div></div>')
    return stage('<div class="demo-grid">' + cell("Onay (dışarı tıklayınca kapanmaz)", f'<div class="demo-stage" style="height:260px;background:#0B1230">{onay}</div>')
                 + cell("Ödül / seviye atlama", f'<div class="demo-stage" style="height:340px;background:#0B1230">{sev}</div>') + "</div>")


def demo_toast():
    def t(cls, ic, txt):
        return f'<div class="toast toast-{cls}" role="status">{I(ic, 22)}<span>{esc(txt)}</span></div>'
    rows = "".join([cell("Bilgi", t("bilgi", "bilgi", "Yeni sürüm hazır.")), cell("Başarı", t("basari", "tik", "Kaptan Şapkası senin. Dolap'ta.")),
                    cell("Uyarı", t("uyari", "uyari", "Çok hızlı gidiyorsun, birkaç saniye sonra tekrar dene.")), cell("Hata", t("hata", "carpi", "Sunucuya ulaşamadık.")),
                    cell("Ödül", '<div class="toast" style="border-color:var(--amber-koyu)">' + I("coin", 22) + '<span style="color:var(--amber-ink)">+40 B</span></div>')])
    return stage(f'<div class="demo-grid">{rows}</div>')


def demo_ring():
    items = [("Seviye", halka(42, 96, "mor", "7", "SEV.", "Seviye 7, yüzde 42")), ("İlerleme (ders)", halka(67, 96, "", "2/3", "KART", "Ders ilerlemesi 2/3")),
             ("Puan ≥ 70", halka(82, 96, "nane", "82", "PUAN", "Kurul puanı 82")), ("Puan < 70", halka(66, 96, "amber", "66", "PUAN", "Kurul puanı 66")),
             ("Süre", halka(40, 96, "amber", "0:41", "KALAN", "Kalan süre 41 saniye")), ("48 px", halka(42, 48, "mor", "7", None, "Seviye 7")),
             ("32 px", halka(70, 32, "", "", None, "Yüzde 70"))]
    return stage('<div class="demo-row">' + "".join(cell(l, h) for l, h in items) + "</div>")


def demo_xpbar():
    rows = [("HUD (208×10)", '<div style="width:208px">' + cubuk(42, "xp", False, "Seviye 7 ilerlemesi") + '</div><small class="soluk">465 / 1.110 XP (odakta)</small>'),
            ("Artış", '<div style="width:260px;position:relative">' + cubuk(60, "xp", False, "XP artışı") + '<span class="ucan ucan-xp" style="position:static;margin-top:8px;display:inline-flex">' + I("xp", 26) + "+25 XP</span></div>"),
            ("Panel (100%)", cubuk(85, "xp", False, "Seviye 1 ilerlemesi") + '<small class="soluk">85 → Sev. 2 (5 / 200)</small>'),
            ("Odak çizgisi (4 px)", '<div style="height:4px;border-radius:4px;background:linear-gradient(90deg,#6D8CFF 42%,#26325A 42%)"></div>')]
    return stage('<div class="demo-grid">' + "".join(cell(l, h) for l, h in rows) + "</div>")


def demo_sayac():
    rows = [("Bayt pili", sayac("bayt", "1.240")), ("Çip pili", sayac("cip", "10")), ("XP etiketi", sayac("xp", "465")), ("Satır içi (küçük)", sayac("bayt", "61", True)),
            ("Sayıyor + artış", '<div style="position:relative;display:inline-block;padding-top:34px">' + sayac("bayt", "1.280") + '<span class="ucan ucan-bayt" style="left:6px;top:0;position:absolute;font-size:16px">+40</span></div>'),
            ("Yükleniyor", sayac("bayt", "—")), ("Hata", '<span class="sayac sayac-bayt sayac-yetersiz">' + I("uyari", 28) + "!</span>"),
            ("Çevrimdışı (%55)", '<span style="opacity:.55">' + sayac("bayt", "1.240") + "</span>")]
    return stage('<div class="demo-grid">' + "".join(cell(l, h) for l, h in rows) + "</div>")


def test_row(state, ad, detay, sag=""):
    ic = {"gecti": "test-gecti", "kaldi": "test-kaldi", "hata": "uyari", "bekliyor": "saat"}[state]
    lab = {"gecti": "geçti", "kaldi": "kaldı", "hata": "hata", "bekliyor": "bekliyor"}[state]
    tur = {"gecti": "nane", "kaldi": "mercan", "hata": "amber", "bekliyor": "gri"}[state]
    return (f'<div class="test-satir {state}" aria-label="{esc(ad)}: {lab}"><span class="test-ik">{I(ic, 24)}</span><span class="test-ad">{esc(ad)}</span>'
            f'<span class="test-sag">{sag}{chip(lab, tur)}</span><div class="test-detay">{detay}</div></div>')


def demo_testrow():
    rows = [test_row("gecti", "A1 · 30 dk", "girdi <b>30</b> · beklenen <b>100</b> · gerçek <b>100</b>"), test_row("kaldi", "A5 · 361 dk", "girdi <b>361</b> · beklenen <b>250</b> · gerçek <b>280</b>"),
            test_row("hata", "A7 · derleme", "CS1002: ; bekleniyor (satır 9)"), test_row("bekliyor", "A6 · 1.441 dk", "henüz çalışmadı"),
            test_row("gecti", "G7 · gizli", "girdi ve beklenen hiçbir zaman gösterilmez"), test_row("gecti", "T3 · tohumlu", "girdi ve beklenen hiçbir zaman gösterilmez")]
    ozet = '<div class="test-ozet">' + I("test-gecti", 24) + "4/6 geçti" + cubuk(67, "nane", False, "Açık testler: 4/6") + "</div>"
    return stage(ozet + '<div class="demo-grid">' + "".join(f'<div class="demo-cell">{r}</div>' for r in rows) + "</div>")


def demo_chat():
    a = bubble("usta", "Usta Defne", "Zeynep, 'kutu' benzetmen çok yerinde: <code class=\"kod-ic\">yas</code> kutu, <code class=\"kod-ic\">17</code> içindeki değer.")
    b = bubble("ben", "@zeynep_cs", "<code class=\"kod-ic\">yas</code> bir kutu, <code class=\"kod-ic\">17</code> içine koyduğum değer.")
    c = bubble("musteri", "Hasan Abi", "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL.")
    k = ('<div class="puan-kart parli" style="max-width:460px"><div class="puan-kart-ust">' + halka(82, 64, "nane", "82", None, "Kurul puanı 82") +
         '<div><div class="puan-kart-etiket">Kurul</div><b>GEÇTİ</b></div></div></div>')
    s = bubble("sistem", None, "Yeniden bağlanıyor… (2/6)")
    return stage('<div class="chat-d" style="display:grid;gap:12px;max-width:640px">' + a + b + c + k + s + "</div>")


def demo_code():
    src = M.extract(B8, "### 8.6", "### 8.7")
    code = re.search(r"```csharp\n(.*?)```", src, re.S).group(1)
    lines = [re.sub(r"^\s*\d+\s{1,2}", "", l, count=1) for l in code.rstrip("\n").split("\n")]
    blok = kodblok("\n".join(lines), {11: "vurgu"}, 11, "C# kodu")
    ink = 'Satır içi: <code class="kod-ic">if (dakika &lt;= 360)</code>'
    diff = ('<pre class="kodblok" role="region" aria-label="Fark, 2 satır"><code><span class="kl sil"><span class="ln">11</span><span class="isaret">−</span>' + hl_cs("if (dakika < 360) return saat * 40;") +
            '</span><span class="kl ekle"><span class="ln">11</span><span class="isaret">+</span>' + hl_cs("if (dakika <= 360) return saat * 40;") + "</span></code></pre>")
    return stage('<div class="demo-grid"><div class="demo-cell" style="grid-column:1/-1">' + f"<small>Blok + vurgulu satır</small>{blok}</div>"
                 + cell("Satır içi", f"<div>{ink}</div>") + cell("Diff (renk + işaret)", diff) + "</div>")


def demo_tab():
    top = '<div class="ust-sekme" role="tablist" aria-label="Pazar"><span class="on" role="tab" aria-selected="true">Bayt Rafları</span><span role="tab">Butik</span><span role="tab">Rütbe Rafı</span></div>'
    hap = '<div class="sira-s">' + "".join(f'<span class="chip chip-buyuk{" chip-turkuaz" if i == 0 else ""}">{esc(t)}</span>' for i, t in enumerate(["Hepsi", "Kıyafet", "Aksesuar", "Evcil", "Oda", "Emote"])) + "</div>"
    alt = ('<div class="sekmeler" role="tablist" aria-label="Editör"><span class="sekme aktif" role="tab" aria-selected="true">Açık Testler</span><span class="sekme" role="tab">Sözleşme</span>'
           '<span class="sekme" role="tab">İpuçları</span><span class="sekme" role="tab">Müfettiş <span class="chip chip-amber">1</span></span></div>')
    return stage('<div class="demo-grid">' + cell("Üst sekme", top) + cell("Hap (kategori)", hap) + cell("Panel içi sekme (44 px, rozetli)", alt) + "</div>")


def demo_badge():
    dur = '<div class="sira">' + "".join(durum(d) for d in ["satilik", "kapali", "deneme", "acik", "kararmis"]) + "</div>"
    rar = '<div class="sira">' + "".join(f'<span class="chip nad-{c}" style="border-color:var(--nad);color:var(--nad)"><span class="nad-etiket" style="font-size:11px">{n}</span></span>' for c, n in [("siradan", "Sıradan"), ("sik", "Şık"), ("nadir", "Nadir"), ("premium", "Premium"), ("nisan", "Nişan")]) + "</div>"
    unv = '<div class="sira">' + chip("Çırak · Sev. 3", "gri") + chip("Kalfa · Sev. 7", "kobalt") + chip("Zanaatkâr", "nane") + "</div>"
    say = '<div class="sira"><span class="rozet" style="width:36px;height:36px">' + I("zil", 20) + '<span class="rozet-sayi">3</span></span><span class="nokta" title="yeni"></span></div>'
    etk = '<div class="sira">' + chip("Kavram Sorusu", "gri") + chip("Tamamlama", "gri") + chip("v1.1", "mor") + "</div>"
    return stage('<div class="demo-grid">' + cell("Durum (şekil + etiket)", dur) + cell("Nadirlik", rar) + cell("Unvan", unv) + cell("Sayaç", say) + cell("Etiket / tip", etk) + "</div>")


def bos(ic, baslik, metin, buton=None, hata=False):
    b = f'<div style="margin-top:6px">{buton}</div>' if buton else ""
    return f'<div class="bos{" bos-hata" if hata else ""}" role="status"><div class="bos-ik">{I(ic, 30)}</div><h3>{esc(baslik)}</h3><p>{esc(metin)}</p>{b}</div>'


def demo_empty():
    return stage('<div class="demo-grid">'
                 + cell("Boş", bos("bina", "Henüz işletmen yok", "İlk tapun Çarşı'da seni bekliyor.", btn("Haritayı Aç", "btn-birincil")))
                 + cell("Hata", bos("uyari", "Bir şeyler ters gitti", "Birazdan tekrar dene.", btn("Tekrar Dene", "btn-birincil"), True))
                 + cell("Çevrimdışı", bos("kutu", "Çevrimdışısın", "Bağlanınca kaldığın yerden devam edeceksin."))
                 + cell("Kilitli", bos("kilit", "Oda kilitli", "Bunun için Sev. 2 gerekiyor.", btn("Anladım")))
                 + "</div>")


def demo_vault():
    kart = ('<div class="kart"><div class="kart-baslik">' + I("kasa", 22) + 'Kasa</div><div role="meter" aria-valuenow="61" aria-valuemin="0" aria-valuemax="73" aria-label="Kasa">' + cubuk(84, "bayt", False, "Kasa 61/73 B") +
            '</div><div class="sira" style="margin-top:8px"><b class="sayi">61 / 73 B</b><span class="soluk kucuk">Dolmasına 1 sa 18 dk</span></div><div class="kart-alt">' + btn("Kasayı Topla", "btn-altin btn-kucuk", "coin") + "</div></div>")
    lv = []
    for n, p in [("Boş", 0), ("Çeyrek", 25), ("Yarım", 50), ("Dolu", 100)]:
        col = "#FFD27A" if p == 25 else "#FFBE3D" if p else "#36446E"
        lv.append(f'<div style="display:grid;justify-items:center;gap:4px"><svg viewBox="0 0 60 48" width="60" height="48" role="img" aria-label="Kasa {n.lower()}"><rect x="6" y="14" width="48" height="30" rx="6" fill="none" stroke="{col if p else "#6B7794"}" stroke-width="3"/>'
                  f'<rect x="10" y="{44 - 26 * p / 100 - 2:.0f}" width="40" height="{26 * p / 100:.0f}" rx="3" fill="{col}"/>' + ('<circle cx="30" cy="8" r="6" fill="#FFBE3D"/>' if p == 100 else "") + f'</svg><small class="soluk">{n}</small></div>')
    sah = '<div class="sira">' + "".join(lv) + "</div>"
    dur = '<div class="yigin-s">' + "".join(f'<div class="sira-s">{durum(d)}<small class="soluk">{t}</small></div>' for d, t in [("acik", "normal"), ("deneme", "%50 hız"), ("kararmis", "üretim durdu")]) + "</div>"
    return stage('<div class="demo-grid">' + cell("Kart", kart) + cell("Sahne nesnesi (4 kademe)", sah) + cell("Durumlar", dur) + "</div>")


def demo_avatar():
    sizes = [("S 48 (büst)", f'<span class="portre">{bust("zeynep", 48)}</span>'), ("M 96", f'<span class="av-sahne" style="padding:6px">{avatar_svg("zeynep", 96)}</span>'),
             ("L 168", f'<span class="av-sahne" style="padding:8px">{avatar_svg("zeynep", 168)}</span>')]
    return stage('<div class="demo-row" style="align-items:flex-end">' + "".join(cell(l, h) for l, h in sizes) + "</div>")


DEMOS = {"Button": demo_button(), "Card": demo_card(), "Modal": demo_modal(), "Toast": demo_toast(), "ProgressRing": demo_ring(), "XPBar": demo_xpbar(), "Bayt": demo_sayac(),
         "TestListRow": demo_testrow(), "ChatBubble": demo_chat(), "CodeBlock": demo_code(), "Tab": demo_tab(), "Badge": demo_badge(), "EmptyState": demo_empty(),
         "VaultGauge": demo_vault(), "AvatarPreview": demo_avatar()}

try:
    from ekranlar_mocks6 import build_mockups  # noqa: E402
    MOCKUPS = build_mockups(sys.modules[__name__])
except ImportError as _e:  # 6 mockup modülü henüz yoksa
    print("UYARI: ekranlar_mocks6 yok:", _e, file=sys.stderr)
    MOCKUPS = {}
