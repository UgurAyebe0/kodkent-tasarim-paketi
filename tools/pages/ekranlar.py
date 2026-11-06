"""KodKent Ekran Tasarımları sayfası: PAGE bildirimi (python tools/build_page.py ekranlar).

Metin spec'ten AYNEN gelir (B8, KANON); bu dosya yalnızca (a) hangi bölümün nereden alınacağını, (b) tablolardan türeyen görselleri
(envanter, navigasyon haritası, wireframe çiftleri, palet, ikon galerisi, avatar katmanları, bileşen örnekleri, mockup'lar) ve (c) bölüm girişlerini tanımlar.
Yardımcılar: ekranlar_data.py (veri), ekranlar_hooks.py (tablo kancaları), ekranlar_js.py (JS şablonları), ekranlar_mock.py (mockup + bileşen örnekleri).
"""
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent))
import make_skeleton as ms  # noqa: E402
import md2html as M  # noqa: E402
from ekranlar_data import (B8, KANON, SCREENS, TOKENS, BY_TOKEN, CAT_COUNT, CAT_NAME, MOCK_TOKENS, NAV_JSON, NAV_SKIPPED, N_NAV_ROWS, GROUPS,  # noqa: E402
                           ICONS, AVATARS, AVATARS_B8, T102, HUD_ROWS, esc, jsj, tmpl, tbl, avatar_svg)
import ekranlar_hooks as H  # noqa: E402
import ekranlar_js as J  # noqa: E402

MK = H.MK  # 2. aşama modülü (yoksa None)
SECTION_IDS = ["kapak", "navigasyon", "akislar", "ekran-spesifikasyonlari", "hud", "gorsel-stil", "avatar-sistemi", "bilesenler", "erisilebilirlik"]
IDS = set(SECTION_IDS)
HEXRE = H.HEXRE


def render_b8(frm, to, id_prefix, **kw):
    """B8'den bir parçayı kendimiz render eder (kancalar dâhil); sayfa genelinde tekil id için ortak IDS kümesi."""
    md = M.extract(B8, frm, to, keep_heading=kw.pop("keep_heading", True))
    return M.render(md, ids=IDS, id_prefix=id_prefix, hooks=H.HOOKS, source=B8, **kw)


# ------------------------------------------------------------------ 1. kapak + envanter
def kapak_html():
    svg = ms.logo_svg()
    font = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap">'
    return (
        font + f'<div class="cover"><div class="logo-lg">{svg}<span class="eyebrow">Belge 4 · Ekran tasarımları</span></div>'
        '<h1>KodKent Ekran Tasarımları</h1><p class="slogan">Oyunlarla yazılım öğreniyorum.</p>'
        '<p class="sub">Kod yaz, şehrini kur. Bu belge o şehrin 24 ekranını ve sabit HUD katmanını çizer: navigasyon haritası, üç kullanıcı akışı, '
        'her ekranın wireframe\'i, durumları ve etkileşimleri, altı yüksek sadakatli mockup, görsel stil, avatar sistemi ve bileşen kütüphanesi.</p></div>'
        '<div class="docbox"><p><strong>Bu belge ne anlatır, kim okumalı.</strong> UI/UX ve frontend ekibi için: istemci ve ekran tasarım spesifikasyonunu (B8) '
        'tek sayfada okunur hâle getirir. Metinler spec belgelerinden aynen alınmıştır; sayılar KANON ile birebir tutarlıdır. Wireframe\'ler B8\'deki bölge tablolarından '
        '(x, y, genişlik, yükseklik) çizilir, özgün tablolar her şeklin altında kapalı durur. Uzun bölümler kapalı başlıklar altındadır; bir ekranın kimliği (ör. <code>#meydan</code>) doğrudan o ekranı açar.</p></div>'
    )


def stat(v, l):
    return f'<div class="stat"><div class="v">{v}</div><div class="l">{l}</div></div>'


def stats_html():
    return (
        '<div class="grid stats">'
        + stat(len(SCREENS), f"ekran ({CAT_COUNT['panel']} panel · {CAT_COUNT['sahne']} sahne · {CAT_COUNT['akis']} tam ekran akış)")
        + stat(len(SCREENS) + 1, "wireframe çifti (24 ekran + HUD)")
        + stat(len(MOCK_TOKENS), "yüksek sadakatli mockup")
        + stat(4, "HUD modu (tam, kompakt, odak, gizli)")
        + stat(len(ICONS), "satır içi ikon (prototip)")
        + stat(2, "sonraki sürüm ekranı (Lonca Binası v1.1, Arena v1.2)")
        + "</div>"
    )


def callouts_html():
    kan6 = M.extract(KANON, "## 6.", "## 7.")
    hud = re.search(r"^HUD \(.*$", kan6, re.M).group(0)
    raw = {r[0]: r[1] for r in M.tables(M.extract(KANON, "### 12.2", "### 12.3"))[0].raw_rows}
    return (
        f'<div class="callout"><p><strong>Ekran sayısı (KANON §6).</strong> {M.inline(hud)} Ebeveyn Paneli ekran değildir: SMS linkiyle açılan hesapsız hafif web sayfasıdır; oyun içi giriş noktası '
        '<strong>Ayarlar &amp; Hesap → veli durumu</strong> satırıdır (KANON §12.2).</p></div>'
        f'<div class="callout amber"><p><strong>Kayıt yaşı kararı (KANON §12.2).</strong> Asgari kayıt yaşı <strong>15</strong> (<code>min_kayit_yasi=15</code>); hedef kitle: '
        f'{M.inline(raw["Hedef kitle"])}. Giriş ekranında 15 yaş altı için: {M.inline(raw["15 yaş altı"])}</p></div>'
    )


def inventory_html():
    rows = []
    for s in SCREENS:
        cat = {"akis": "violet", "sahne": "accent", "panel": "cobalt"}[s["cat"]]
        flags = ""
        if s["detay"]:
            flags += ' <span class="badge amber">ayrıntılı</span>'
        if s["token"] in MOCK_TOKENS:
            flags += ' <span class="badge mint">mockup</span>'
        rows.append(
            f'<tr><td class="num">{s["no"]}</td><td><strong>{esc(s["name"])}</strong>{flags}</td>'
            f'<td class="nw"><a href="#{s["token"]}"><code>{s["token"]}</code></a></td>'
            f'<td><span class="badge {cat}">{esc(s["tur"])}</span></td><td>{esc(s["hud"])}</td><td>{M.inline(s["icerik"])}</td></tr>')
    return ('<div class="tablewrap"><table class="inv"><thead><tr><th class="num">#</th><th>Ekran (KANON §6)</th><th>Kimlik</th><th>Tür</th><th>HUD</th><th>İçerik (KANON §6)</th></tr></thead><tbody>'
            + "".join(rows) + "</tbody></table></div>")


# ------------------------------------------------------------------ 2. navigasyon haritası
def hud_note_html():
    items = []
    for r in HUD_ROWS:
        dests = [d.strip() for d in r[2].split(",")]
        lnk = ", ".join(f'<a href="#{d}">{esc(BY_TOKEN[d]["name"])}</a>' if d in BY_TOKEN else esc(d) for d in dests)
        items.append(f'<li><b>{esc(r[0])}</b> <span aria-hidden="true">→</span> {lnk}<small>{esc(r[3])}</small></li>')
    skipped = "; ".join(f"#{n} ({esc(s)} → {esc(d)}: {esc(l)})" for n, s, d, l in NAV_SKIPPED)
    return ('<aside class="hud-note" aria-label="HUD kenarları"><p><b>HUD bir ekran değildir</b>: sahnenin üstündeki sabit katmandır, bu yüzden haritada düğüm olarak çizilmez. '
            'Kenarları her ekrandan geçerlidir (HUD modu izin verdikçe):</p><ul class="hud-edges">' + "".join(items) + "</ul>"
            f'<p class="muted">Ok olarak çizilmeyen tek satır: {skipped}; kaynağı “herhangi bir ekran” olduğu için tek bir okla gösterilemez. '
            "Kesik oklar #13 satırıdır (Meydan'dan HUD sağ kümesi / Menü ile açılan beş ekran).</p></aside>")


def nav_html():
    leg = (
        '<div class="kk-legend" aria-label="Gösterim">'
        '<span class="kk-leg"><i style="background:var(--violet-soft);border:2px solid var(--violet)"></i>Tam ekran akış</span>'
        '<span class="kk-leg"><i style="background:var(--accent-soft);border:2px solid var(--accent)"></i>Sahne ekranı</span>'
        '<span class="kk-leg"><i style="background:var(--cobalt-soft);border:2px solid var(--cobalt)"></i>Panel ekranı</span>'
        + "".join(f'<span class="kk-leg"><i style="background:var(--{t})"></i>ok: {esc(n)}</span>' for g, n, t in GROUPS if g != "H")
        + '<span class="kk-leg"><i style="background:transparent;border:2px dashed var(--accent)"></i>kesik ok: #13 HUD sağ küme / Menü</span></div>')
    return ('<div class="navtabs" id="nav-tabs" role="tablist" aria-label="Geçiş grubu"></div>'
            '<figure><div id="d-nav"></div><figcaption id="nav-note"></figcaption></figure>' + leg + hud_note_html())


# ------------------------------------------------------------------ 4. ekran spesifikasyonları
def screen_index_html():
    items = []
    for s in SCREENS:
        mk = ' <span class="badge mint">mockup</span>' if s["token"] in MOCK_TOKENS else ""
        items.append(f'<a href="#{s["token"]}" data-c="{s["cat"]}"><span class="no">{s["no"]:02d}</span><b>{esc(s["name"])}{mk}</b><small>#{s["token"]}</small></a>')
    leg = ('<div class="kk-legend" aria-label="Wireframe bölge türleri">'
           + "".join(f'<span class="kk-leg"><i style="background:var(--{bg});border:2px solid var(--{bd})"></i>{n}</span>' for n, bg, bd in
                     [("HUD", "accent-soft", "accent"), ("gezinti", "cobalt-soft", "cobalt"), ("içerik", "surface-2", "line-2"), ("eylem", "amber-soft", "amber"),
                      ("görsel / sahne", "violet-soft", "violet"), ("sohbet", "mint-soft", "mint"), ("modal / örtü", "coral-soft", "coral")]) + "</div>")
    return f'<nav class="scr-index" id="ekran-dizini" aria-label="Ekran dizini">{"".join(items)}</nav>{leg}'


def fix_summary_ids(html):
    """Ekran bölümlerinin <summary> id'sini ekran kimliğine (token) çevirir."""
    def rep(m):
        t = re.search(r"<code>([a-z-]+)</code>\)", m.group(2))
        if not t or t.group(1) not in BY_TOKEN:
            return m.group(0)
        IDS.add(t.group(1))
        return f'<summary id="{t.group(1)}"><span>{m.group(2)}</span></summary>'
    return re.sub(r'<summary id="(s-[^"]+)">(.*?)</summary>', rep, html)


SCREENS_HTML = fix_summary_ids(str(render_b8("### 6.1", "## 7.", "s-", demote=1, collapse=("### 6.",), top=2)))
if SCREENS_HTML.count('<summary id="') < 24:
    raise SystemExit("24 ekran bölümü bulunamadı")
HUD_HTML = str(render_b8("## 5.", "## 6.", "hud-", demote=1, keep_heading=False, top=2))
missing_w = [t for t in TOKENS + ["hud"] if t not in H.WIRES]
if missing_w:
    raise SystemExit(f"wireframe üretilemeyen ekranlar: {missing_w}")


# ------------------------------------------------------------------ 7. avatar katmanları (B8 §10.1 SVG şablonu)
def layers_html():
    sec = M.extract(B8, "### 10.1", "### 10.2")
    tpl = re.search(r"```svg\n(.*?)```", sec, re.S).group(1)
    cols = dict(TEN="#CC8F65", ALT="#3F6FB5", AYAK="#E8EDF8", UST="#1F2A44", SAC="#5C3A24")  # B8 §10.2 #1 (@zeynep_cs)
    for k, v in cols.items():
        tpl = tpl.replace(f'fill="{k}"', f'fill="{v}"')
    tpl = tpl.replace('<g id="bas"/>', '<g id="bas"><path d="M19 15 q13 -15 26 0 v3 h-26 z" fill="#C98500"/><rect x="17" y="16" width="30" height="3.500" rx="1.700" fill="#F4EFE6"/></g>')
    tpl = tpl.replace('<g id="sirt_arka"/>', '<g id="sirt_arka"><rect x="38" y="38" width="13" height="22" rx="4" fill="#26325A"/></g>')
    tpl = tpl.replace('<g id="sirt_on"/>', '<g id="sirt_on"><path d="M27 38 v20 M37 38 v20" stroke="#26325A" stroke-width="2.500" fill="none" stroke-linecap="round"/></g>')
    inner = re.search(r"<svg[^>]*>(.*)</svg>", tpl, re.S).group(1)
    parts = re.findall(r'(<ellipse id="golge"[^>]*/>|<g id="([a-z_]+)"(?:/>|>.*?</g>))', inner, re.S)
    cells = []
    for z, (frag, lid) in enumerate([(p[0], p[1] or "golge") for p in parts]):
        empty = re.fullmatch(r'<g id="[a-z_]+"/>', frag)
        body = '<text x="32" y="52" text-anchor="middle" class="dg-s">boş</text>' if empty else frag
        body = re.sub(r' id="[^"]+"', "", body)
        cells.append(f'<div class="layer{" layer-bos" if empty else ""}"><svg viewBox="0 0 64 96" width="64" height="96" aria-hidden="true">{body}</svg><b>{z}</b><code>{lid}</code></div>')
    comp = re.sub(r' id="[^"]+"', "", tpl).replace('width="64" height="96"', 'width="128" height="192"', 1).replace("<svg ", '<svg role="img" aria-label="Katmanlar birleşince @zeynep_cs avatarı" ', 1)
    return ('<figure><div class="layers-wrap game-surface"><div class="layers" role="list" aria-label="Avatar katmanları, alttan üste">' + "".join(cells)
            + f'</div><div class="layer-comp">{comp}<b>Birleşik</b><small>@zeynep_cs · §10.2 #1 renkleriyle</small></div></div>'
            '<figcaption>B8 §10.1 SVG şablonu katman katman ayrılmış hâlde: soldan sağa çizim sırası (Z), sağda hepsi üst üste. Renkler @zeynep_cs\'nin (§10.2 #1) '
            'ten, saç, üst, alt ve ayak değerleridir; baş (Çırak Şapkası) ve sırt (okul çantası) katmanları aynı kayıttan eklenmiştir.</figcaption></figure>')


def avatar_gallery_html():
    cards = []
    for i, a in enumerate(AVATARS_B8):
        r = T102.raw_rows[i]
        dl = "".join(f"<div><dt>{esc(h)}</dt><dd>{M.inline(c)}</dd></div>" for h, c in zip(T102.headers[2:], r[2:]))
        cards.append(f'<figure class="av-card" role="listitem"><div class="av-stage">{avatar_svg(a["id"], 168, lst=AVATARS_B8)}</div>'
                     f'<figcaption><p class="av-ad"><span class="av-no">#{esc(r[0])}</span> {M.inline(r[1])}</p><dl class="av-tarif">{dl}</dl>'
                     f'<p class="av-cizim"><span class="badge">prototip avatar sistemiyle çizildi</span> {esc(a["tarif"])}</p><p class="av-fark">{esc(a["fark"])}</p></figcaption></figure>')
    return ('<div class="av-gallery" role="list" aria-label="B8 §10.2 altı örnek oyuncu">' + "".join(cards) + "</div>"
            '<p class="muted">Altı kart, B8 §10.2’deki altı oyuncunun tarifidir (ad, rol ve katman seçenekleri tablodan aynen). Çizimler <b>prototip avatar sistemiyle</b> yapılmıştır: '
            'ten 6, saç stili 8, saç rengi 6, kıyafet 6 ve aksesuar 9 seçenekten B8 tarifine en yakın birleşim seçilmiştir; yüz şekilleri prototipte tek tiptir. '
            'Prototipte bulunmayan katmanlar (sırt, evcil, saat, nişan çerçevesi, özel renk bölgeleri) çizimde yoktur; fark her kartın son satırında yazılıdır. Tam tablo aşağıdadır.</p>')


# ------------------------------------------------------------------ 9. kaynak belgeler
KAYNAKLAR = """
<h3 id="kaynak-belgeler">Kaynak belgeler</h3>
<ul class="src-list">
<li><strong>B8</strong> İstemci, Oyun Motoru ve Ekran Tasarımları: ekran envanteri (§6), HUD (§5), görsel stil (§3), mockup içerik paketi (§8), bileşen kütüphanesi (§9), avatar sistemi (§10), animasyon (§11), erişilebilirlik (§12), mobil (§14).</li>
<li><strong>KANON</strong> Sabitler: 24 ekranın adı ve sırası (§6), kayıt yaşı kararı (§12.2), sayfa kapak sayıları (§12.4). Bir belge KANON ile çelişirse KANON geçerlidir.</li>
<li><strong>B1</strong> Dünya ve şehir: avatar paper-doll sistemi (§7), semt paletleri (§3), işletme durumlarının sahne işaretleri (§6), NPC ve Meydan.</li>
<li><strong>B3</strong> Eğitim ve yapay zekâ öğretmen: Kurul Kartı şeması (puan, ölçütler, geri bildirim, takip sorusu), rubrik ve ipucu merdiveni.</li>
<li><strong>B6</strong> Görevler, sosyal, canlı operasyon: Sohbet, arkadaşlar, güvenli mod, liderlik ve moderasyon hattı.</li>
<li><strong>B7</strong> Backend ve veri modeli: ekranların kullandığı <code>/v1</code> uç noktaları (B8'de her ekranın “Veri” satırı).</li>
<li><strong>Dolaylı:</strong> B2 (fiyat, XP, Bayt/Çip), B4 (ders adları), B5 (işletme ve Sözleşme Kartı), B9 (yaş ve hukuk), VİZYON (§4 zaman çizelgesi).</li>
</ul>
"""

# ------------------------------------------------------------------ sayfa CSS
CSS = r"""
/* ---- ortak ---- */
.btn-lite{font:inherit;font-weight:600;padding:8px 14px;border:1px solid var(--line-2);border-radius:var(--radius);background:var(--surface-2);color:var(--fg);cursor:pointer}
.btn-lite:hover{background:var(--surface-3)}
.game-surface{background:#0D1326;color:#E8EDF8;border:1px solid var(--line-2);border-radius:var(--radius-lg);padding:14px}
.game-surface code{font-family:var(--font-mono);font-size:11.5px;color:#9AA7C7;background:none;padding:0}
.game-surface .muted,.game-surface small{color:#9AA7C7}
.inv td:last-child{min-width:260px}
.inv td.nw code{font-size:12.5px}
.scr-index{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;margin:12px 0}
.scr-index a{display:grid;grid-template-columns:auto 1fr;gap:0 10px;align-items:center;padding:8px 12px;border:1px solid var(--line);border-left:4px solid var(--line-2);border-radius:var(--radius);background:var(--surface);text-decoration:none;color:var(--fg);min-width:0}
.scr-index a:hover{background:var(--surface-2)}
.scr-index a[data-c="akis"]{border-left-color:var(--violet)}.scr-index a[data-c="sahne"]{border-left-color:var(--accent)}.scr-index a[data-c="panel"]{border-left-color:var(--cobalt)}
.scr-index .no{grid-row:span 2;font-family:var(--font-mono);font-size:12px;color:var(--muted)}
.scr-index b{font-size:14px;line-height:1.25}.scr-index small{color:var(--muted);font-size:12px;font-family:var(--font-mono)}
.scr-index .badge{font-size:10.5px;padding:1px 7px}
figure.wf{margin-block:10px}
.hudzoom{display:grid;gap:10px}.hz-row{display:flex;gap:12px;flex-wrap:wrap}.hz-m{flex:1 1 300px;max-width:430px;min-width:0}.hudzoom figure{margin:0}.hudzoom .diag{padding:8px}
/* ---- navigasyon ---- */
.navtabs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 10px}
.navtabs button{font:inherit;font-size:13.5px;font-weight:600;padding:7px 12px;border:1px solid var(--line-2);border-radius:999px;background:var(--surface);color:var(--fg-2);cursor:pointer}
.navtabs button:hover{background:var(--surface-2)}
.navtabs button[aria-selected="true"]{background:var(--accent-soft);color:var(--accent-ink);border-color:var(--accent)}
.navtabs .n{font-family:var(--font-mono);font-size:11.5px;color:var(--muted);margin-left:4px}
#d-nav .dg-lab{font-size:12.5px}
.hud-note{margin:14px 0;padding:12px 16px;border:1px solid var(--amber);border-left-width:5px;border-radius:var(--radius);background:var(--amber-soft);color:var(--fg);font-size:14px}
.hud-note p{margin:0 0 8px;max-width:none}.hud-note .muted{color:var(--fg-2);margin:8px 0 0;font-size:13px}
.hud-edges{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:6px 18px}
.hud-edges li{display:block;line-height:1.35;min-width:0}.hud-edges small{display:block;color:var(--fg-2);font-size:12.5px}
/* ---- adım şeritleri ---- */
.steps{align-items:stretch;scroll-snap-type:x proximity;padding-bottom:10px;margin-block:10px}
.steps .step{flex:0 0 244px;display:grid;gap:7px;align-content:start;scroll-snap-align:start;font-size:13.5px;line-height:1.45}
.steps .step p{margin:0;max-width:none}
.steps .step b{display:flex;align-items:center;gap:8px;font-size:14px}
.steps .step .no{display:inline-grid;place-items:center;min-width:26px;height:26px;border-radius:50%;background:var(--cobalt-soft);color:var(--cobalt);font-size:13px}
.steps .step .lbl{display:block;font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:700}
.steps .step .meta{font-family:var(--font-mono);font-size:12px;color:var(--fg-2);border-top:1px dashed var(--line-2);padding-top:6px}
/* ---- görsel stil ---- */
.sw{display:flex;flex-direction:column;justify-content:flex-end;gap:2px;min-width:0;padding:8px 10px;border-radius:10px;border:1px solid rgba(128,128,128,.35);min-height:62px;font-size:12px}
.sw small{font-weight:700;opacity:.9}.sw code{font-family:var(--font-mono);font-size:12px;background:none;padding:0;color:inherit}
.sw em{font-style:normal;font-size:11px;opacity:.85;line-height:1.3}
.pal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:12px;margin:12px 0}
.pal{border:1px solid var(--line);border-radius:var(--radius-lg);padding:12px;background:var(--surface);min-width:0}
.pal-h{display:flex;flex-wrap:wrap;gap:2px 10px;align-items:baseline;margin-bottom:8px}.pal-h span{font-size:12.5px;color:var(--muted)}
.pal-sw{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.pal-n{margin:8px 0 0;font-size:12.5px;color:var(--muted)}
.sw-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:12px 0}
.sw-strip .sw{min-height:84px}
.ty-list{display:grid;gap:0;padding:6px 16px;margin:12px 0}
.ty{display:grid;grid-template-columns:minmax(0,230px) minmax(0,1fr);gap:6px 20px;align-items:center;padding:12px 0;border-bottom:1px dashed #2A3558}
.ty:last-child{border-bottom:0}
.ty-meta{display:grid;gap:2px;min-width:0}.ty-meta code{font-size:13px;color:#5FE0E3}.ty-meta span{font-size:12px;color:#C5CEE4}.ty-meta small{font-size:11.5px}
.ty-smp{min-width:0;overflow-wrap:anywhere;color:#E8EDF8}.ty-na{font-size:13px;color:#9AA7C7}
@media (max-width:700px){.ty{grid-template-columns:minmax(0,1fr)}}
.ik-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px;margin:12px 0}
.ik-cell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border-radius:12px;background:#151D36;border:1px solid #2A3558;min-width:0;color:#E8EDF8}
.ik-cell code{font-size:11px;overflow-wrap:anywhere;text-align:center}
.semt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:12px;margin:12px 0}
.semt-card{border:1px solid var(--line);border-radius:var(--radius-lg);padding:12px;background:var(--surface);min-width:0}
.semt-h{display:flex;align-items:center;gap:10px;margin-bottom:8px}.semt-h code{margin-left:auto;font-size:12px}
.hat{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;font-weight:800;font-size:13px}
.hat-n{border:3px solid;border-radius:7px;background:none}
.sw-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px}.sw-s{min-height:56px}
.semt-card p{margin:8px 0 0;font-size:12.5px}
.state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:12px;margin:12px 0}
.state-card{border:1px solid var(--line);border-top:5px solid var(--sc);border-radius:var(--radius-lg);padding:12px;background:var(--surface);min-width:0}
.state-sign{display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:8px 12px;border:2px solid var(--sc);border-radius:12px;background:var(--surface-2);position:relative;overflow:hidden}
.state-sign b{font-size:13px;letter-spacing:.03em;text-transform:uppercase}
.state-sign .stripe{position:absolute;inset:auto 0 0 0;height:5px;background:repeating-linear-gradient(135deg,#FFBE3D 0 8px,#0A1024 8px 16px)}
.state-card .kv{gap:3px 10px;font-size:12.5px}.state-card .kv dd{min-width:0;overflow-wrap:anywhere}
.kasa-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.kasa{display:grid;gap:4px}.kasa small{color:var(--muted);font-size:12px}
.kasa-bar{height:16px;border-radius:999px;border:2px solid var(--line-2);background:var(--surface-2);overflow:hidden}.kasa-bar i{display:block;height:100%}
.ez-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.ez-card{display:grid;gap:6px;justify-items:start;border:1px solid var(--line);border-radius:var(--radius-lg);padding:12px;background:var(--surface)}
.ez-card code{font-size:12px}.ez-track{position:relative;width:100%;height:18px;--ez-run:calc(100% - 18px)}
.ez-track::before{content:"";position:absolute;inset:8px 0;height:2px;background:var(--line-2)}
.ez-dot{position:absolute;left:0;top:0;width:18px;height:18px;border-radius:50%;background:var(--accent)}
.ez-dot.on{transform:translateX(calc(var(--ez-run)))}
.ez-durs{display:grid;gap:8px;margin-top:14px}
.ez-dur{display:grid;grid-template-columns:150px minmax(0,1fr) auto;gap:10px;align-items:center;font-size:13px}
.ez-dur i{display:block;height:12px;border-radius:6px;background:var(--cobalt)}.ez-dur small{color:var(--muted)}
@media (max-width:700px){.ez-dur{grid-template-columns:minmax(0,1fr)}}
/* ---- avatar ---- */
.av-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:14px;margin:12px 0}
.av-card{margin:0;display:grid;grid-template-rows:auto 1fr;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--surface);overflow:hidden;min-width:0}
.av-stage{display:grid;place-items:center;padding:12px 10px;background:radial-gradient(70% 70% at 50% 40%,#2A3870,#141C3E);border-bottom:1px solid var(--line-2)}
.av-card figcaption{display:grid;gap:8px;padding:12px 14px;font-size:13px;line-height:1.45;text-align:left;align-content:start}
.av-card figcaption p{margin:0;max-width:none}
.av-ad{font-size:15px}.av-no{font-family:var(--font-mono);font-size:12px;color:var(--muted);margin-right:4px}
.av-tarif{display:grid;gap:3px;margin:0}.av-tarif>div{display:grid;grid-template-columns:116px 1fr;gap:8px}
.av-tarif dt{color:var(--muted);font-size:12px}.av-tarif dd{margin:0;overflow-wrap:anywhere}
.av-cizim{color:var(--fg-2)}.av-cizim .badge{margin-right:6px}
.av-fark{color:var(--muted);font-size:12.5px}
.layers-wrap{display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap}
.layers{display:flex;gap:6px;flex-wrap:wrap;flex:1 1 420px;min-width:0}
.layer{display:grid;justify-items:center;gap:1px;padding:6px 4px;border-radius:10px;background:#151D36;border:1px solid #2A3558;width:76px}
.layer-bos{opacity:.5}.layer b{font-size:12px}.layer code{font-size:10.5px;text-align:center;overflow-wrap:anywhere}
.layer-comp{display:grid;justify-items:center;gap:2px}.layer-comp small{font-size:11.5px}
.rar-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:12px 0}
.rar{display:grid;justify-items:center;gap:6px;text-align:center;padding:12px 8px;border-radius:14px;background:#151D36;border:1px solid #2A3558}
.rar-chip{display:inline-block;padding:3px 12px;border-radius:999px;border:2px solid;font-weight:800;font-size:13px;letter-spacing:.04em;text-transform:uppercase}
.rar small{font-size:11.5px;line-height:1.35}
.plates{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.plate{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:#151D36;border:1px solid #2A3558}
.plate i{width:16px;height:16px;border-radius:50%}.plate small{color:#9AA7C7;font-size:11.5px}
.emote-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:12px 0}
.emote{display:grid;grid-template-columns:auto 1fr;gap:0 10px;padding:8px 12px;border-radius:12px;background:#151D36;border:1px solid #2A3558;align-items:center}
.emote .no{grid-row:span 2;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#26325A;font-weight:700;font-size:13px}
.emote small{font-size:11.5px}
"""

# ------------------------------------------------------------------ PAGE
EASE_DATA = None


def ease_data():
    css = M.extract(B8, "### 3.7", "## 4.")
    ez = [{"ad": f"ease-{m.group(1)}", "css": [float(x) for x in m.group(2).split(",")]} for m in re.finditer(r"--kk-ease-(\w+):cubic-bezier\(([^)]+)\)", css)]
    sinif = {1: "geri bildirim (≤ 160 ms)", 2: "geri bildirim (≤ 160 ms)", 3: "geçiş (240–400 ms)", 4: "geçiş (240–400 ms)", 5: "tören (≥ 800 ms)"}
    du = [{"ad": f"dur-{m.group(1)}", "ms": int(m.group(2)), "sinif": sinif[int(m.group(1))]} for m in re.finditer(r"--kk-dur-(\d):(\d+)ms", css)]
    if len(ez) != 3 or len(du) != 5:
        raise SystemExit(f"easing/süre token'ları ayrıştırılamadı: {len(ez)} / {len(du)}")
    return {"easings": ez, "durs": du}


def tiles_data():
    t = tbl(B8, "### 3.4", "### 3.5", ["Örnek tile", "Semt", "Ana renk", "Detay"])
    out = []
    for r in t.rows:
        out.append({"ad": r[0], "semt": r[1], "ana": HEXRE.findall(r[2])[0], "detay": (HEXRE.findall(r[3]) or ["#5C4630"])[0]})
    return out


def wires_js():
    return tmpl(J.WIRE_JS_T, WIRES=jsj(H.WIRES))


def src(frm, to, **kw):
    d = {"file": B8, "from": frm, "to": to}
    d.update(kw)
    return d


def mock_css():
    return MK.MOCK_CSS if MK is not None else ""


def mock_js():
    return MK.MOCK_JS if MK is not None else ""


SEC_AKIS_INTRO = ("<p>Üç yolculuk B8 §7.2–§7.4'ten alınmıştır. Her adım şeridi yatay kaydırılır; adımdaki ekran kimliği ilgili spesifikasyona bağlanır, özgün adım tablosu şeridin altında kapalı durur.</p>")

PAGE = {
    "hooks": H.HOOKS,
    "reserved_ids": (["d-nav", "nav-tabs", "nav-note", "d-iso", "d-ease", "ekran-dizini", "envanter-tablosu", "ozet-istemci", "ekran-kabugu", "envanter-sablonu", "kenar-listesi",
                      "kaynak-belgeler", "acik-sorular", "bagimliliklar", "erisilebilirlik-liste", "mobil-uyarlama", "hud-wire", "iso-kurallari", "easing-sema", "avatar-galeri", "avatar-katmanlari",
                      "kasa-kademeleri", "ikon-galeri"] + [f"w-{t}" for t in TOKENS] + ["w-hud", "w-hud-zoom"] + ([i for i in MK.RESERVED_IDS] if MK is not None else [])),
    "css": CSS,
    "sections": [
        {   # 1. Kapak + ekran envanteri
            "id": "kapak",
            "html_top": kapak_html(),
            "title": "Ekran envanteri",
            "intro": "<p>24 ekran ve sabit HUD katmanı. Adlar ve sıra KANON §6'dan, kimlikler (URL hash'i) B8 §4.1'den gelir; satırdaki kimlik ekranın spesifikasyonunu açar.</p>",
            "html_before": stats_html() + callouts_html(),
            "parts": [
                {"html": '<h3 id="envanter-tablosu">24 ekranın envanteri</h3>' + inventory_html()},
                {"html": '<h3 id="ozet-istemci">Yönetici özeti (B8 §0)</h3>'},
                src("## 0.", "## 1.", skip_heading=True),
                {"html": '<h3 id="ekran-kabugu">Ekran kabuğu ve ortak kurallar (B8 §4)</h3>'},
                src("## 4.", "## 5.", skip_heading=True, demote=1),
                {"html": '<h3 id="envanter-sablonu">Ekran envanteri: ortak şablon (B8 §6)</h3>'},
                src("## 6.", "### 6.1", skip_heading=True),
            ],
        },
        {   # 2. Navigasyon haritası
            "id": "navigasyon",
            "title": "Navigasyon haritası",
            "intro": (f"<p>24 ekranın hepsi bir düğümdür; {N_NAV_ROWS} geçiş satırından HUD ve “herhangi bir ekran” kaynaklı olanlar dışındakiler, tetikleyici etiketiyle ok olarak çizilir (B8 §7.1). Kutular KANON adlarını taşır. "
                      "HUD ekran olmadığı için düğüm değil, haritanın altındaki nottadır. Harita geniştir ve kendi kabında yatay kaydırılır; bir grup seçerek yalnızca o grubun oklarını görün.</p>"),
            "html_before": nav_html(),
            "js": tmpl(J.NAV_JS_T, NAV=jsj(NAV_JSON)),
            "parts": [
                {"html": '<details class="acc"><summary id="kenar-listesi">Geçiş kenar listesi (B8 §7.1, %d satır, koşullarıyla)</summary>' % N_NAV_ROWS},
                src("### 7.1", "### 7.2", skip_heading=True),
                {"html": "</details>"},
            ],
        },
        {   # 3. Kullanıcı akışları
            "id": "akislar",
            "title": "Kullanıcı akışları",
            "intro": SEC_AKIS_INTRO,
            "parts": [src("### 7.2", "### 7.3", demote=0), src("### 7.3", "### 7.4", demote=0), src("### 7.4", "## 8.", demote=0)],
        },
        {   # 4. Ekran spesifikasyonları (24) + wireframe + mockup
            "id": "ekran-spesifikasyonlari",
            "title": "Ekran spesifikasyonları",
            "intro": ("<p>24 ekranın her biri aynı şablonu izler: amaç, wireframe (masaüstü ve telefon), bileşenler, durumlar, etkileşimler, veri, mobil, mikro etkileşimler, erişilebilirlik. "
                      "Yedi ekran ayrıntılandırılmıştır; altısı yüksek sadakatli mockup içerir (Derleyici Meydanı, Kurul Kartı, İş Emri, İşletme Editörü, Savunma, Pazar). "
                      "Bir başlığa tıklayın ya da dizinden kimliğe gidin.</p>"),
            "html_before": screen_index_html(),
            "parts": [{"html": SCREENS_HTML}],
            "js": "{\n" + wires_js() + "\n}\n" + ("{\n" + mock_js() + "\n}" if mock_js() else ""),
            "css": mock_css(),
        },
        {   # 5. HUD
            "id": "hud",
            "title": "HUD spesifikasyonu",
            "intro": "<p>HUD ekran değil, sahnenin üstündeki sabit katmandır. Aşağıda ölçüleri B8 §5'in bölge tablosundan çizilmiştir (masaüstü ve telefon), ardından parçalar, kademeli açılış, durumlar ve etkileşimler gelir.</p>",
            "parts": [{"html": HUD_HTML}],
        },
        {   # 6. Görsel stil kılavuzu
            "id": "gorsel-stil",
            "title": "Görsel stil kılavuzu",
            "intro": "<p>Palet, tipografi, ikon seti, izometrik tile kuralları, semt şemaları, durum renkleri ve hareket ilkeleri. Hex değerleri ve oranlar B8 §3'ten okunur; örnekler tablolardan çizilir. Oyun arayüzü tek temalıdır (gece şehri), bu yüzden örnek yüzeyler iki belge temasında da koyu kalır.</p>",
            "js": "{\n" + tmpl(J.ISO_JS_T, TILES=jsj(tiles_data())) + "\n}\n{\n" + tmpl(J.EASE_JS_T, EASE=jsj(ease_data())) + "\n}",
            "parts": [
                src("## 3.", "### 3.1", skip_heading=True),
                src("### 3.1", "### 3.2", demote=0),
                src("### 3.2", "### 3.3", demote=0),
                src("### 3.3", "### 3.4", demote=0),
                src("### 3.4", "### 3.5", demote=0),
                {"html": '<figure id="iso-kurallari"><div id="d-iso"></div><figcaption>Tile geometrisi, bina ve avatar ölçeği ile altı örnek zemin tile\'ı; sayılar yukarıdaki kural ve örnek tablolarından, çizim KK.iso ilkelleriyle yapılmıştır.</figcaption></figure>'},
                src("### 3.5", "### 3.6", demote=0),
                src("### 3.6", "### 3.7", demote=0),
                {"html": H.kasa_levels_html()},
                src("### 3.7", "## 4.", demote=0),
                src("### 11.1", "### 11.2", demote=0),
                {"html": '<figure id="easing-sema"><div id="d-ease"></div><figcaption>Token\'lar B8 §3.7\'den: üç easing eğrisi ve beş süre. “Oynat” aynı eğriyle noktayı hareket ettirir; hareketi azalt açıksa nokta anında yer değiştirir.</figcaption></figure>'},
            ],
        },
        {   # 7. Avatar sistemi
            "id": "avatar-sistemi",
            "title": "Avatar sistemi",
            "intro": "<p>Katmanlar, altı örnek avatar, nadirlik rozetleri, unvan ve isim renkleri ile emote listesi B8 §10'dan; çizimler prototip avatar dışa aktarımı ve B8'in SVG şablonundandır.</p>",
            "parts": [
                {"html": '<h3 id="avatar-galeri">Altı örnek avatar</h3>' + avatar_gallery_html()},
                src("## 10.", "### 10.1", skip_heading=True),
                src("### 10.1", "### 10.2", demote=0, max_code_lines=20),
                {"html": '<span id="avatar-katmanlari"></span>' + layers_html()},
                src("### 10.2", "### 10.3", demote=0),
                src("### 10.3", "### 10.4", demote=0),
                src("### 10.4", "### 10.5", demote=0),
                src("### 10.5", "## 11.", demote=0),
            ],
        },
        {   # 8. Bileşen kütüphanesi
            "id": "bilesenler",
            "title": "Bileşen kütüphanesi",
            "intro": "<p>Bileşenler B8 §9'dan; her bileşenin canlı örneği oyun tokenlarıyla çizilir, özgün tanım tablosu altında kapalı durur. Oyun arayüzü tek temalı olduğundan örnek yüzeyler açık ve koyu belge temasında aynı görünür.</p>",
            "parts": [src("## 9.", "## 10.", skip_heading=True, demote=-1)],
        },
        {   # 9. Erişilebilirlik, mobil uyarlama, kaynaklar, açık sorular
            "id": "erisilebilirlik",
            "title": "Erişilebilirlik ve mobil uyarlama",
            "intro": "<p>WCAG 2.2 AA kontrol listesi ve erişilebilirlik kuralları (B8 §12), mobil uyarlama (B8 §14), kaynak belgeler ve açık sorular (B8 §18).</p>",
            "parts": [
                {"html": '<h3 id="erisilebilirlik-liste">Erişilebilirlik kontrol listeleri (B8 §12)</h3>'},
                src("## 12.", "## 13.", skip_heading=True, demote=1, collapse_over=2500, top=2),
                {"html": '<h3 id="mobil-uyarlama">Mobil uyarlama (B8 §14)</h3>'},
                src("## 14.", "## 15.", skip_heading=True, demote=1),
                {"html": KAYNAKLAR},
                {"html": '<details class="acc"><summary id="bagimliliklar">B8 §19: Diğer belgelere bağımlılıklar (özgün)</summary>'},
                src("## 19.", "## Ek A", skip_heading=True, demote=1),
                {"html": "</details>"},
                {"html": '<h3 id="acik-sorular">Açık sorular (B8 §18)</h3>'},
                src("## 18.", "## 19.", skip_heading=True),
            ],
        },
    ],
}
