"""KodKent Ekran Tasarımları sayfası: spec'ten veri çıkarımı ve ortak yardımcılar (B8, KANON, prototip dışa aktarımları).

Metin spec'ten AYNEN gelir; bu modül yalnızca (a) tablolardan veri okur (ekran envanteri, geçiş kenarları, ikonlar), (b) küçük HTML yardımcıları sağlar.
"""
import collections
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE.parent))
import md2html as M  # noqa: E402

B8, KANON = "B8-istemci-ui.md", "KANON.md"
EXPORT = ROOT / "build" / "proto" / "export"


def jsj(o):
    return json.dumps(o, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def tmpl(s, **kv):
    for k, v in kv.items():
        s = s.replace("%%" + k + "%%", v)
    return s


def esc(s):
    return M.esc(s)


def tr_lower(s):
    return s.replace("İ", "i").replace("I", "ı").lower()


def tbl(path, a, b, first_headers, nth=0):
    hits = [t for t in M.tables(M.extract(path, a, b)) if t.headers[: len(first_headers)] == first_headers]
    if len(hits) <= nth:
        raise SystemExit(f"tablo bulunamadı: {path} {a} {first_headers}")
    return hits[nth]


def hex_ink(hexc):
    """Verilen zemin rengi üstünde okunur yazı rengi (koyu lacivert ya da beyaz)."""
    h = hexc.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4  # noqa: E731
    L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    dark = (L + 0.05) / (0.006 + 0.05)
    white = 1.05 / (L + 0.05)
    return "#0A1024" if dark >= white else "#FFFFFF"


# ------------------------------------------------------------------ 24 ekran envanteri
T41 = tbl(B8, "### 4.1", "### 4.2", ["#", "Ekran (KANON §6)", "Kimlik", "Tür", "HUD", "Arka plan", "MVP"])
TK = tbl(KANON, "## 6.", "## 7.", ["#", "Ekran", "İçerik", "MVP"])
_det = {}
_hl = M.headings(B8)
for _lv, _t, _sz in _hl:
    _m = re.match(r"6\.(\d+) .*?\(`([a-z-]+)`\)(.*)$", _t)
    if _lv == 3 and _m:
        _det[_m.group(2)] = "ayrıntılı" in _m.group(3)
SCREENS = []
for _r, _k in zip(T41.rows, TK.rows):
    tok = _r[2]
    tur = _r[3]
    cat = "akis" if tur.startswith("Tam ekran") else "sahne" if tur.startswith("Sahne") else "panel"
    if _r[1] != M.strip_md(_k[1]):
        print(f"UYARI: ekran adı B8 §4.1 ({_r[1]}) ile KANON §6 ({M.strip_md(_k[1])}) farklı", file=sys.stderr)
    SCREENS.append(dict(no=int(_r[0]), name=_k[1].strip("*"), token=tok, tur=tur, cat=cat, hud=_r[4], bg=_r[5], mvp=_r[6],
                        icerik=_k[2], detay=_det.get(tok, False)))
if len(SCREENS) != 24 or len(_det) != 24:
    raise SystemExit(f"beklenmeyen ekran sayısı: {len(SCREENS)} / {len(_det)}")
TOKENS = [s["token"] for s in SCREENS]
BY_TOKEN = {s["token"]: s for s in SCREENS}
MOCK_TOKENS = ["meydan", "kurul", "is-emri", "editor", "savunma", "pazar"]
CAT_COUNT = collections.Counter(s["cat"] for s in SCREENS)
CAT_NAME = {"akis": "Tam ekran akış", "sahne": "Sahne ekranı", "panel": "Panel ekranı"}

# ------------------------------------------------------------------ navigasyon kenarları (B8 §7.1)
GROUPS = [("A", "Kayıt ve onboarding", "violet"), ("B", "Meydan merkezli", "accent"), ("C", "Akademi ve ders akışı", "cobalt"),
          ("D", "İşletme akışı", "amber"), ("E", "Kozmetik, oda ve sosyal", "mint"), ("H", "HUD kenarları", "coral")]
POS = {
    "giris": (0, 0), "dil-sec": (1, 0), "avatar": (2, 0), "meydan": (3, 0), "harita": (4, 0), "liderlik": (5, 0),
    "metro": (0, 1), "tekrar": (1, 1), "akademi": (2, 1), "derslik": (3, 1), "kurul": (4, 1), "atolye": (5, 1),
    "profil": (0, 2), "vitrin": (1, 2), "sokak": (2, 2), "is-emri": (3, 2), "editor": (4, 2), "savunma": (5, 2),
    "sohbet": (0, 3), "oda": (1, 3), "dolap": (2, 3), "pazar": (3, 3), "panel": (4, 3), "ayarlar": (5, 3),
}
assert set(POS) == set(TOKENS), "ızgara yerleşimi 24 ekranı kapsamıyor"
_t71 = M.tables(M.extract(B8, "### 7.1", "### 7.2"))
if len(_t71) != 6:
    raise SystemExit(f"§7.1 altı tablo bekleniyordu: {len(_t71)}")
NAV_EDGES, NAV_SKIPPED, N_EDGE_ROWS = [], [], 0
HUD_ROWS = _t71[5].rows  # H1–H8: HUD ekran değil sabit katmandır; haritada düğüm yerine not olarak verilir
LABEL_MAP = {"13": {d: "HUD / Menü (#13)" for d in ("dolap", "metro", "profil", "sohbet", "ayarlar")},
             "60": {"vitrin": "İşletme kartı", "sokak": "İşletme kartı", "dolap": "Etiketimde Göster", "sohbet": "Arkadaş Ekle"}}
for _g, _t in zip([g[0] for g in GROUPS], _t71):
    for _r in _t.rows:
        N_EDGE_ROWS += 1
        if _g == "H":
            continue
        n, src, dst, lab = _r[0], _r[1], _r[2], _r[3]
        dsts = [d.strip() for d in re.split(r"\s*[,/]\s*", dst) if d.strip()]
        if src not in POS or any(d not in POS for d in dsts):
            NAV_SKIPPED.append((n, src, dst, lab))
            continue
        labs = [x.strip() for x in lab.split(" / ")]
        for i, d in enumerate(dsts):
            if n in LABEL_MAP:
                l = LABEL_MAP[n].get(d, "#" + n)
            elif len(dsts) == 1 or len(labs) == 1:
                l = lab
            elif len(labs) == len(dsts):
                l = labs[i]
            else:
                l = "#" + n
            NAV_EDGES.append(dict(n=n, s=src, t=d, l=l, g=_g, dash=(n == "13")))
N_NAV_ROWS = N_EDGE_ROWS
NAV_JSON = dict(
    nodes=[dict(id=s["token"], name=s["name"], type=s["cat"], c=POS[s["token"]][0], r=POS[s["token"]][1]) for s in SCREENS],
    edges=NAV_EDGES,
    groups=[dict(id=g, name=n, tone=t, count=sum(1 for e in NAV_EDGES if e["g"] == g)) for g, n, t in GROUPS if g != "H"],
)

# ------------------------------------------------------------------ prototip dışa aktarımları (ikon, avatar, usta, prop)
ICONS = json.load(open(EXPORT / "ikonlar.json", encoding="utf-8"))
AVATARS = json.load(open(EXPORT / "avatarlar.json", encoding="utf-8"))
USTALAR = {u["id"]: u for u in json.load(open(EXPORT / "ustalar.json", encoding="utf-8"))}
PROPS = json.load(open(EXPORT / "proplar.json", encoding="utf-8"))
AVATARS_B8 = json.load(open(EXPORT / "avatarlar-b8.json", encoding="utf-8"))  # B8 §10.2 tarifleri, prototip avatar sistemiyle (tools/proto_export.mjs)
for _a in AVATARS_B8:
    _a["tarif"] = _a["tarif"].replace("\u0307", "")  # JS toLowerCase, İ harfinden birleşik nokta üretir
T102 = M.tables(M.extract(B8, "### 10.2", "### 10.3"))[0]
if len(T102.rows) != 6 or len(AVATARS_B8) != 6:
    raise SystemExit("B8 §10.2 altı oyuncu ve avatarlar-b8.json altı kayıt bekleniyordu")


def ik(name, size=24, cls=""):
    """Satır içi ikon (prototip ikonlar.json): class="ik", boyut ayarlı."""
    svg = ICONS[name]
    svg = svg.replace('width="24" height="24"', f'width="{size}" height="{size}"', 1)
    return svg.replace("<svg ", f'<svg class="ik{(" " + cls) if cls else ""}" ', 1)


_UID = [0]


def uniq_ids(svg):
    """Satır içi SVG'deki id'leri (ve url(#…) / href="#…" başvurularını) çağrı başına tekilleştirir: aynı çizim sayfada birden çok kez kullanılabilir."""
    ids = re.findall(r' id="([^"]+)"', svg)
    if not ids:
        return svg
    _UID[0] += 1
    for i in set(ids):
        n = f"{i}-u{_UID[0]}"
        svg = svg.replace(f' id="{i}"', f' id="{n}"').replace(f"url(#{i})", f"url(#{n})").replace(f'href="#{i}"', f'href="#{n}"')
    return svg


def avatar_svg(av_id, size=None, label=None, lst=None):
    a = next(x for x in (lst or AVATARS) if x["id"] == av_id)
    svg = a["svg"]
    if size:
        w = int(size * 96 / 132)
        svg = re.sub(r'width="\d+" height="\d+"', f'width="{w}" height="{size}"', svg, count=1)
    return uniq_ids(svg)


def usta_svg(uid, size=64):
    svg = USTALAR[uid]["svg"]
    return uniq_ids(re.sub(r'width="\d+" height="\d+"', f'width="{size}" height="{size}"', svg, count=1))


def prop_svg(pid, w=None):
    svg = uniq_ids(PROPS[pid])
    if w:
        m = re.search(r'width="(\d+)" height="(\d+)"', svg)
        if m:
            h = int(int(m.group(2)) * w / int(m.group(1)))
            svg = svg.replace(m.group(0), f'width="{w}" height="{h}"', 1)
    return svg
