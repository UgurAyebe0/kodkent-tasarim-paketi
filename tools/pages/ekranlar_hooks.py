"""Ekranlar sayfası: tablo kancaları (spec tablosu -> görsel) ve küçük HTML üreticileri.

Her kanca özgün tabloyu <details> içinde geri koyar; metin spec'ten aynen kalır, görsel yalnızca tablodaki veriden türer.
"""
import re
import sys

from ekranlar_data import *  # noqa: F401,F403  (M, esc, ik, SCREENS, BY_TOKEN, hex_ink, tr_lower ...)
from ekranlar_data import M, esc, BY_TOKEN, ik, hex_ink, tr_lower, tbl, B8

try:  # 2. aşama: mockup'lar ve bileşen örnekleri
    import ekranlar_mock as MK
except ImportError:  # pragma: no cover
    MK = None

HEXRE = re.compile(r"#[0-9A-Fa-f]{6}\b")
WIRES = {}


def details(summary, inner, open_=False):
    return f'<details class="acc"{" open" if open_ else ""}><summary>{summary}</summary>{inner}</details>'


def orig_table(ctx, title="Özgün tablo (B8)"):
    return details(esc(title), M.table_html(ctx["raw_headers"], ctx["raw_rows"]))


def link_screens(s):
    """Ham hücredeki `token` ifadelerini #token bağlantısına çevirir."""
    return re.sub(r"`([a-z-]+)`", lambda m: "[`%s`](#%s)" % (m.group(1), m.group(1)) if m.group(1) in BY_TOKEN else m.group(0), s)


# ------------------------------------------------------------------ wireframe (bölge tablosu -> KK.wirePair)
BOX = re.compile(r"^(-?\d+)\s*,\s*(-?\d+)\s*,\s*(\d+)\s*,\s*(\d+)$")
KIND_RULES = [
    ("modal", ["modal", "örtü", "perde", "alt sayfa", "toast", "bildirim bandı"]),
    ("hud", ["hud", "xp", "bayt", "çip", "kimlik kartı", "hedef çubuğu", "görev kartı", "dock", "simge kümesi", "para pil", "seviye halkası", "bağlam eylemi"]),
    ("chat", ["sohbet", "balon", "usta", "hasan", "konuşma", "mesaj", "müşteri", "diyalog", "kurul"]),
    ("action", ["düğme", "buton", "eylem", "cta", "kaydet", "gönder", "satın al", "çalıştır"]),
    ("nav", ["gezin", "sekme", "menü", "üst şerit", "başlık", "adım", "ilerleme", "kategori", "filtre", "arama", "sıralama", "geri"]),
    ("media", ["illüstrasyon", "sahne", "canvas", "önizleme", "avatar", "portre", "harita", "görsel", "kroki", "ızgara", "oda", "led", "pano", "çizim", "vitrin", "kod", "editör"]),
]


def zone_kind(label):
    s = tr_lower(label)
    for kind, keys in KIND_RULES:
        if any(k in s for k in keys):
            return kind
    return "content"


def hook_wire(headers, rows, ctx):
    if len(headers) != 4 or headers[0] != "bölge" or not headers[1].startswith("masaüstü"):
        return None
    m = re.search(r"\(([a-z-]+)\)", ctx.get("heading", ""))
    token = m.group(1) if m and m.group(1) in BY_TOKEN else "hud"
    name = BY_TOKEN[token]["name"] if token in BY_TOKEN else "HUD"
    names = [r[0] for r in rows]
    isch = [n.startswith("↳") for n in names]
    labels = [n.lstrip("↳ ").strip() for n in names]
    par = [(not isch[i]) and i + 1 < len(rows) and isch[i + 1] for i in range(len(rows))]

    def build(col):
        out, ok = [], False
        for i, r in enumerate(rows):
            b = BOX.match(r[col].strip())
            if not b:
                if r[col].strip() not in ("—", "-", "–", ""):
                    print(f"UYARI: wireframe hücresi ayrıştırılamadı ({token}): {r[col]!r}", file=sys.stderr)
                out.append([-9999, -9999, 10, 10, "", "content", 0, ""])  # bu cihazda yok: dizin hizası için görünmez yer tutucu
                continue
            ok = True
            x, y, w, h = map(int, b.groups())
            out.append([x, y, w, h, "" if par[i] else labels[i], zone_kind(labels[i]), 1 if par[i] else 0, labels[i]])
        return out if ok else None

    WIRES[token] = dict(t=name + (" ekranı" if token != "hud" else " katmanı") + " wireframe", d=build(1), p=build(2), dims=(token == "hud"))
    if token == "hud":
        cap = "HUD ölçüleri CSS pikselidir: solda masaüstü 1280×800 (kenar boşluğu 16 px), sağda telefon 390×844 (kenar boşluğu 8 px). Her bölgenin sağ altındaki sayı genişlik×yüksekliktir."
    else:
        cap = f"{name}: solda masaüstü 1280×800, sağda telefon 390×844. Renk bölge türünü, tablodaki sıra numarası küçük bölgeleri gösterir."
    table = M.table_html(["#"] + ctx["raw_headers"], [[str(i + 1)] + list(r) for i, r in enumerate(ctx["raw_rows"])])
    html = (f'<figure class="wf"><div id="w-{token}"></div><figcaption>{esc(cap)}</figcaption></figure>'
            + details("Wireframe bölge tablosu (özgün, x,y,w,h; sıra numaralı)", table))
    if token == "hud":
        html += ('<figure class="wf"><div id="w-hud-zoom" class="hudzoom"></div><figcaption>Ölçülü yakın görünüm: her bölgede ad, sol üst köşe (x,y) ve boyut (genişlik×yükseklik) piksel olarak yazılıdır; üstteki cetvel 160 px (telefonda 50 px) aralıklıdır.</figcaption></figure>')
    if MK is not None and token in MK.MOCKUPS:
        html += MK.MOCKUPS[token]
    return html, ""


def hook_types(headers, rows, ctx):
    if headers[:3] != ["#", "Ekran (KANON §6)", "Kimlik"]:
        return None
    rr = [[r[0], r[1], "[%s](#%s)" % (r[2], r[2].strip("`"))] + r[3:] for r in ctx["raw_rows"]]
    return details("Ekran türü, HUD modu ve arka plan tablosu (B8 §4.1, 24 satır)", M.table_html(ctx["raw_headers"], rr))


# ------------------------------------------------------------------ kullanıcı akışı: tablo -> yatay adım şeridi
def hook_steps(headers, rows, ctx):
    if headers[:3] != ["Adım", "Ekran", "Oyuncu eylemi"]:
        return None
    last = ctx["raw_headers"][-1]
    steps = []
    for r in ctx["raw_rows"]:
        steps.append(
            '<div class="step" role="listitem"><b><span class="no">%s</span><span class="scr">%s</span></b>'
            '<p><span class="lbl">Oyuncu</span>%s</p><p><span class="lbl">Sistem</span>%s</p><p class="meta"><span class="lbl">%s</span>%s</p></div>'
            % (esc(r[0]), M.inline(link_screens(r[1])), M.inline(r[2]), M.inline(r[3]), esc(last), M.inline(r[4])))
    h = ctx.get("heading", "Kullanıcı akışı")
    return ('<div class="steps" role="list" tabindex="0" aria-label="%s: %d adım, yatay kaydırılır">%s</div>' % (esc(h), len(steps), "".join(steps))
            + orig_table(ctx, "Adım tablosu (özgün)"))


# ------------------------------------------------------------------ palet, nötr rampa, tipografi
def sw(hexc, label="", extra=""):
    return (f'<div class="sw" style="background:{hexc};color:{hex_ink(hexc)}"><small>{esc(label)}</small><code>{hexc}</code>{extra}</div>')


def hook_palette(headers, rows, ctx):
    if headers[:3] != ["Renk", "Rol", "300"]:
        return None
    cards = []
    for r in rows:
        h3, h5, h67 = (HEXRE.findall(r[2]) or ["#000000"])[0], (HEXRE.findall(r[3]) or ["#000000"])[0], HEXRE.findall(r[4])
        sws = sw(h3, "300") + sw(h5, "500") + "".join(sw(h, lab) for h, lab in zip(h67, ("600", "700")))
        cards.append(f'<div class="pal"><div class="pal-h"><b>{esc(r[0])}</b><span>{esc(r[1])}</span></div><div class="pal-sw">{sws}</div><p class="pal-n">{esc(r[5])}</p></div>')
    return '<div class="pal-grid">' + "".join(cards) + "</div>" + orig_table(ctx, "Palet tablosu (özgün, kontrast oranlarıyla)")


def hook_neutral(headers, rows, ctx):
    if headers[:3] != ["Token", "Hex", "Kullanım"]:
        return None
    cells = []
    for r in rows:
        names = [x.strip() for x in re.split(r"\s*/\s*", r[0])]
        hexes = HEXRE.findall(r[1])
        if len(names) != len(hexes):
            names = [r[0]] * len(hexes)
        for n, h in zip(names, hexes):
            cells.append(sw(h, n, f"<em>{esc(r[2])}</em>"))
    return '<div class="sw-strip">' + "".join(cells) + "</div>" + orig_table(ctx, "Gece nötr rampası tablosu (özgün)")


TY_SAMPLE = {
    "display": "Oyunlarla yazılım öğreniyorum.", "h1": "Derleyici Meydanı", "h2": "Kurul Kartı", "hud-num": "1.240 B · Sev. 7",
    "hud-lbl": "@zeynep_cs · Kalfa", "body": "Tahmin et, çalıştır, sonra sonucu kendi cümlenle açıkla.", "body-sm": "Dersi başlatmak için Akademi kapısına yaklaş.",
    "caption": "Merhaba KodKent!", "code": "int yas = 17;", "code-sm": "A5 · 361 dk · beklenen 250 TL",
}
TY_FONT = {
    "Fredoka": "'Fredoka','Baloo 2','Trebuchet MS','Segoe UI',system-ui,sans-serif",
    "Nunito": "'Nunito','Segoe UI',system-ui,sans-serif",
    "JetBrains Mono": "'JetBrains Mono',Consolas,'Courier New',monospace",
}


def hook_typescale(headers, rows, ctx):
    if headers[:3] != ["Token", "Yazı tipi", "Masaüstü"]:
        return None
    out = []
    for r in rows:
        tok, font, dsk, mob, wgt, use = r[:6]
        m = re.match(r"(\d+)/(\d+)", dsk)
        w = (re.findall(r"\d{3}", wgt) or ["400"])[0]
        meta = f'<div class="ty-meta"><code>{esc(tok)}</code><span>{esc(font)} · {esc(dsk)} px · mobil {esc(mob)} · ağırlık {esc(wgt)}</span><small>{esc(use)}</small></div>'
        if m and font in TY_FONT and tok in TY_SAMPLE:
            smp = f'<div class="ty-smp" style="font:{w} {m.group(1)}px/{m.group(2)}px {TY_FONT[font]}">{esc(TY_SAMPLE[tok])}</div>'
        else:
            smp = '<div class="ty-smp ty-na">Özel piksel yazı tipi; dünya içinde (tabela, LED pano) çizilir, DOM metni değildir.</div>'
        out.append(f'<div class="ty">{meta}{smp}</div>')
    return '<div class="ty-list game-surface">' + "".join(out) + "</div>" + orig_table(ctx, "Tipografi tablosu (özgün)")


# ------------------------------------------------------------------ ikon galerisi (prototip ikonlar.json) + B8 ikon tarifleri
def hook_icons(headers, rows, ctx):
    if headers[:3] != ["#", "Ad", "Anlam"]:
        return None
    from ekranlar_data import ICONS
    cells = "".join(f'<div class="ik-cell">{ik(n, 28)}<code>{esc(n)}</code></div>' for n in ICONS)
    head = (f'<p class="muted">Prototipin satır içi ikon seti: {len(ICONS)} SVG, 24 px ızgara, 2 px çizgi, yuvarlak uç ve birleşim; çizgi rengi <code>currentColor</code>, '
            'anlamsal ikonların (Bayt, Çip, XP, test durumları) sabit dolgusu vardır. Aşağıdaki tablo B8\'in hedef ikon tariflerini (42 satır) verir.</p>')
    return head + '<div class="ik-grid game-surface" role="list" aria-label="İkon galerisi">' + cells + "</div>" + orig_table(ctx, "İkon tarifleri tablosu (özgün, 42 satır)")


# ------------------------------------------------------------------ semt renk şemaları
def hook_semt(headers, rows, ctx):
    if headers[:3] != ["Semt", "B1 palet (vurgular)", "UI hat rengi"]:
        return None
    cards = []
    for r in rows:
        name, pal, hat, no, ink, music = r[:6]
        hatc = (HEXRE.findall(hat) or ["#8A97B8"])[0]
        inkc = (HEXRE.findall(ink) or ["#FFFFFF"])[0]
        items, prev = [], ""
        for n_, h_ in re.findall(r"([^,#]+?)\s*(#[0-9A-Fa-f]{6})", pal):
            n_ = n_.strip()
            if n_ in ("/", ""):  # "konteyner #A / #B / #C": ortak ad, sıra numarasıyla
                items.append((f"{prev} ({sum(1 for x in items if x[0].startswith(prev)) + 1})", h_))
            else:
                prev = n_
                items.append((n_, h_))
        sws = "".join(f'<div class="sw sw-s" style="background:{h};color:{hex_ink(h)}"><small>{esc(n.strip())}</small><code>{h}</code></div>' for n, h in items)
        badge = (f'<span class="hat" style="background:{hatc};color:{inkc}">{esc(no)}</span>' if no.strip().isdigit()
                 else f'<span class="hat hat-n" style="border-color:{hatc}"></span>')
        cards.append(f'<div class="semt-card"><div class="semt-h">{badge}<b>{esc(name)}</b><code>{hatc}</code></div><div class="sw-row">{sws}</div><p class="muted">{esc(music)}</p></div>')
    return '<div class="semt-grid">' + "".join(cards) + "</div>" + orig_table(ctx, "Semt renk tablosu (özgün)")


# ------------------------------------------------------------------ işletme durum renkleri
def state_shape(key, c):
    s = '<svg viewBox="0 0 28 28" width="30" height="30" aria-hidden="true" focusable="false">'
    if key.startswith("Satılık"):
        return s + f'<rect x="3" y="3" width="22" height="22" rx="7" fill="{c}"/><text x="14" y="19.5" text-anchor="middle" font-size="15" font-weight="800" fill="#0B1330">S</text></svg>'
    if key.startswith("Kapalı"):
        return s + f'<circle cx="14" cy="14" r="10" fill="none" stroke="{c}" stroke-width="3"/><line x1="7" y1="21" x2="21" y2="7" stroke="{c}" stroke-width="3"/></svg>'
    if key.startswith("Deneme"):
        return s + f'<circle cx="14" cy="14" r="10" fill="none" stroke="{c}" stroke-width="3"/><path d="M14 4 A10 10 0 0 1 14 24 Z" fill="{c}"/></svg>'
    if key.startswith("Açık"):
        return s + f'<circle cx="14" cy="14" r="11" fill="{c}"/></svg>'
    return s + f'<circle cx="14" cy="14" r="11" fill="{c}"/><path d="M9.500 9.500 L18.500 18.500 M18.500 9.500 L9.500 18.500" stroke="#10162B" stroke-width="3" stroke-linecap="round"/></svg>'


def hook_states(headers, rows, ctx):
    if not headers[0].startswith("Durum (KANON"):
        return None
    cards = []
    for r in rows:
        hexes = HEXRE.findall(r[1])
        c = hexes[0] if hexes else "#8A97B8"
        extra = f'<span class="stripe" aria-hidden="true"></span>' if "bant" in r[1] else ""
        cards.append(
            f'<div class="state-card" style="--sc:{c}"><div class="state-sign">{state_shape(r[0], c)}<b>{esc(r[3])}</b>{extra}</div>'
            f'<dl class="kv"><dt>Durum</dt><dd>{esc(r[0])}</dd><dt>Renk</dt><dd>{esc(r[1])}</dd><dt>Şekil</dt><dd>{esc(r[2])}</dd><dt>Sahne</dt><dd>{esc(r[4])}</dd><dt>Ses</dt><dd>{esc(r[5])}</dd></dl></div>')
    return '<div class="state-grid">' + "".join(cards) + "</div>" + orig_table(ctx, "Durum tablosu (özgün)")


def kasa_levels_html():
    lv = [("Boş", 0, "var(--line-2)", "gri çerçeve"), ("Çeyrek", 25, "#FFD27A", "amber-300"), ("Yarım", 50, "#FFBE3D", "amber-500"), ("Dolu", 100, "#FFBE3D", "amber-500 + zıplayan Bayt ikonu, \"Kasa dolu\"")]
    cells = []
    for n, p, c, note in lv:
        cells.append(f'<div class="kasa"><div class="kasa-bar" role="img" aria-label="Kasa {n.lower()}: %{p}"><i style="width:{p}%;background:{c}"></i></div><b>{n}</b><small>{esc(note)}</small></div>')
    return '<figure><div class="kasa-row">' + "".join(cells) + '</div><figcaption>Kasa doluluğunun dört kademesi (VaultGauge sahne nesnesi); çubuk rengi ve etiket birlikte okunur.</figcaption></figure>'


# ------------------------------------------------------------------ avatar: nadirlik, unvan, emote
def rar_shape(kind, edge, fill):
    s = '<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false">'
    k = tr_lower(kind)
    if "kare" in k:
        return s + f'<rect x="8" y="8" width="48" height="48" rx="12" fill="{fill}" stroke="{edge}" stroke-width="4"/></svg>'
    if "elmas" in k:
        return s + f'<polygon points="32,5 59,32 32,59 5,32" fill="{fill}" stroke="{edge}" stroke-width="4" stroke-linejoin="round"/></svg>'
    if "altıgen" in k:
        return s + f'<polygon points="32,5 56,18 56,46 32,59 8,46 8,18" fill="{fill}" stroke="{edge}" stroke-width="4" stroke-linejoin="round"/><text x="32" y="37" text-anchor="middle" font-size="11" font-weight="800" fill="{edge}">037/200</text></svg>'
    if "mikro" in k:
        pins = "".join(f'<line x1="{x}" y1="3" x2="{x}" y2="9" stroke="{edge}" stroke-width="3"/>' for x in (22, 32, 42))
        return s + f'{pins}<path d="M10 10 H54 V36 Q54 52 32 60 Q10 52 10 36 Z" fill="{fill}" stroke="{edge}" stroke-width="4" stroke-linejoin="round"/><rect x="25" y="22" width="14" height="14" rx="3" fill="none" stroke="{edge}" stroke-width="3"/></svg>'
    return s + (f'<circle cx="32" cy="32" r="26" fill="{fill}" stroke="{edge}" stroke-width="4"/><circle cx="32" cy="32" r="20" fill="none" stroke="{edge}" stroke-width="1.5" stroke-dasharray="3 3"/>'
                f'<polygon points="32,17 36,28 48,28 38,35 42,47 32,40 22,47 26,35 16,28 28,28" fill="{edge}"/></svg>')


def hook_rarity(headers, rows, ctx):
    if headers[:3] != ["Kademe", "Para", "Renk (kenar / zemin / yazı)"]:
        return None
    cards = []
    for r in rows:
        hx = HEXRE.findall(r[2])
        if len(hx) < 3:
            return None
        edge, fill, ink = hx[:3]
        nm = r[0].upper().replace("İ", "İ")
        cards.append(
            f'<div class="rar">{rar_shape(r[3], edge, fill)}<span class="rar-chip" style="background:{fill};border-color:{edge};color:{ink}">{esc(r[0])}</span>'
            f'<small>{esc(r[1])}</small><small>{esc(r[3])}</small><small class="muted">{esc(r[5])}</small></div>')
    return '<div class="rar-grid game-surface">' + "".join(cards) + "</div>" + orig_table(ctx, "Nadirlik tablosu (özgün, kontrast oranlarıyla)")


def hook_titles(headers, rows, ctx):
    if headers[:2] != ["Unvan (KANON §3.1)", "Seviye"]:
        return None
    plates = []
    for r in ctx["raw_rows"]:
        pl = [M.strip_md(c) for c in r]
        rc = (HEXRE.findall(pl[3]) or ["#E5B84B"])[0]
        nc = (HEXRE.findall(pl[4]) or ["#E5B84B"])[0]
        plates.append(f'<span class="plate"><i style="background:{rc}"></i><b style="color:{nc}">@zeynep_cs</b><small>{esc(pl[0])} · Sev. {esc(pl[1])}</small></span>')
    return M.table_html(ctx["raw_headers"], ctx["raw_rows"]) + '<div class="plates game-surface" aria-label="İsim etiketi örnekleri (rozet rengi ve isim rengi)">' + "".join(plates) + "</div>"


def hook_emotes(headers, rows, ctx):
    if headers[:3] != ["#", "Emote", "Kaynak"]:
        return None
    cells = "".join(f'<div class="emote"><span class="no">{esc(r[0])}</span><b>{esc(r[1])}</b><small>{esc(r[2])} · {esc(r[3])}</small></div>' for r in rows)
    return '<div class="emote-grid game-surface">' + cells + "</div>" + orig_table(ctx, "Emote tablosu (özgün, 18 satır)")


def hook_components(headers, rows, ctx):
    """B8 §9 bileşen tablosu -> canlı örnek + özgün tablo (2. aşama: ekranlar_mock.DEMOS)."""
    if headers[:2] != ["Varyant / durum / boyut", "Tanım"] or MK is None:
        return None
    key = re.split(r"[ (]", ctx.get("heading", ""))[0]
    demo = MK.DEMOS.get(key)
    if not demo:
        return None
    return demo + details("Tanım tablosu (B8 §9, özgün)", M.table_html(ctx["raw_headers"], ctx["raw_rows"]))


HOOKS = [hook_wire, hook_types, hook_steps, hook_palette, hook_neutral, hook_typescale, hook_icons, hook_semt, hook_states, hook_rarity, hook_titles, hook_emotes, hook_components]
