"""KodKent Oyun Tasarımı sayfası: PAGE bildirimi (python tools/build_page.py tasarim).

Metin spec'ten AYNEN gelir (VİZYON, KANON, B1, B2, B3, B6, B9); bu dosya yalnızca (a) hangi bölümün nereden alınacağını,
(b) tablolardan türetilen görselleri (zaman çizelgesi, Usta kartları, XP eğrisi, haftalık ızgara, Gantt, risk rozetleri),
(c) elle yazılan diyagramları ve izlenebilirlik tablosunu, (d) bölüm girişlerini tanımlar. Sayılar tablolardan okunur.
"""
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import make_skeleton as ms  # noqa: E402
import md2html as M  # noqa: E402

VIZ, B1, B2, B3, B4, B6, B9, KANON = (
    "A-vizyon-FINAL.md", "B1-dunya-sehir.md", "B2-ilerleme-ekonomi.md", "B3-egitim-ai.md",
    "B4-mufredat.md", "B6-gorevler-sosyal-liveops.md", "B9-urun-yol-haritasi.md", "KANON.md",
)


def jsj(o):
    return json.dumps(o, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def tmpl(s, **kv):
    for k, v in kv.items():
        s = s.replace("%%" + k + "%%", v)
    return s


def fmt_tr(n, d=0):
    s = f"{n:,.{d}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def warn(msg):
    print("UYARI:", msg, file=sys.stderr)


def tbl(path, a, b, first_headers):
    for t in M.tables(M.extract(path, a, b)):
        if t.headers[: len(first_headers)] == first_headers:
            return t
    raise SystemExit(f"tablo bulunamadı: {path} {a} {first_headers}")


def link(sec, text):
    return f'<a href="#{sec}">{text}</a>'


def doc(key, text):
    return f'<a href="#" data-doc="{key}">{text}</a>'


# ------------------------------------------------------------------ veri: spec tablolarından
t_kimlik = tbl(KANON, "## 1.", "## 2.", ["Öğe", "Sabit değer", "Kural"])
KIM = {r[0]: r[1] for r in t_kimlik.rows}
SLOGAN = KIM["Slogan"].strip('"“” ')
ALT_SLOGAN = KIM["Alt slogan"].strip('"“” ')
_m = re.search(r'\*\*Vaat:\*\* \*"(.+?)"\*', M.extract(VIZ, "## 1.", "## 2."))
VAAT = _m.group(1) if _m else ""
if not VAAT:
    warn("VİZYON §1 vaat cümlesi bulunamadı")

t_kapak = tbl(KANON, "### 12.4", "### 12.5", ["Sayı", "Değer", "Kaynak"])
KAPAK = {r[0]: r[1] for r in t_kapak.rows}
N_DERS, N_MOD = re.match(r"(\d+) ders, (\d+) modül", KAPAK["Ders / modül"]).groups()
N_ISL, N_SEV_BASLIK = re.match(r"(\d+) \((\d+) seviye başlığı\)", KAPAK["İşletme"]).groups()
N_SEMT = re.match(r"(\d+)", KAPAK["Semt / Usta / Semt Sınavı"]).group(1)
MVP_HAFTA = re.match(r"(\d+) hafta", KAPAK["MVP süresi"]).group(1)
_n_b4 = sum(len(t.rows) for t in M.tables(M.extract(B4, "## 3.", "## 4.")) if t.headers[:2] == ["id", "başlık"])
if _n_b4 != int(N_DERS):
    warn(f"B4 tabloları {_n_b4} ders, KANON §12.4 {N_DERS} ders diyor")

t_semt = tbl(KANON, "### 2.1", "### 2.2", ["#", "Semt", "Tema / atmosfer"])
t_biz = tbl(KANON, "## 5.", "### 5.1", ["#", "İşletme", "Semt"])
if len(t_semt.rows) != int(N_SEMT) or len(t_biz.rows) != int(N_ISL):
    warn(f"KANON tabloları {len(t_semt.rows)} semt / {len(t_biz.rows)} işletme, kapak sayıları {N_SEMT} / {N_ISL}")


# ------------------------------------------------------------------ 1. kapak
def kapak_html():
    svg = ms.logo_svg()
    return (
        f'<div class="cover"><div class="logo-lg">{svg}<span class="eyebrow">Belge 1 · KodKent oyun tasarımı</span></div>'
        f'<h1>KodKent Oyun Tasarımı</h1><p class="slogan">{M.esc(SLOGAN)}</p>'
        f'<p class="sub"><strong>{M.esc(ALT_SLOGAN)}</strong> {M.esc(VAAT)}</p></div>'
        '<div class="docbox"><p><strong>Bu belge ne anlatır, kim okumalı.</strong> Kurucu, yatırımcı ve oyun ekibi için: KodKent\'in oyun tasarımını '
        '(vizyon, çekirdek döngü, dünya, ilerleme, ekonomi, öğrenme sistemi, işletmeler, görevler, sosyal katman) ve ürün stratejisini '
        '(rakipler, MVP, yol haritası, bütçe, uyum, risk) tek sayfada toplar. Metinler spec belgelerinden aynen alınmıştır; sayılar KANON ile birebir tutarlıdır. '
        f'Teknik ayrıntı {doc("teknik", "Teknik Mimari")}, müfredat ve işletme kodu {doc("mufredat", "Müfredat ve İşletmeler")}, '
        f'ekranlar {doc("ekranlar", "Ekran Tasarımları")} sayfasındadır. <strong>Yaş kuralı:</strong> KANON v2 (§12.2) ile asgari kayıt yaşı 15\'tir; '
        'spec metinlerinde geçen eski 13 yaş ifadeleri bu kararla geçersizdir.</p></div>'
    )


def stat(v, l):
    return f'<div class="stat"><div class="v">{v}</div><div class="l">{l}</div></div>'


def stats_html():
    return (
        '<div class="grid stats">'
        + stat(N_DERS, f"ders ({N_MOD} modül, C#)")
        + stat(N_ISL, f"işletme ({N_SEV_BASLIK} seviye başlığı)")
        + stat(N_SEMT, "semt, her birinde bir Usta ve bir Semt Sınavı")
        + stat(f"{MVP_HAFTA} hafta", "MVP süresi (kapalı beta H9–H10)")
        + "</div>"
    )


# ------------------------------------------------------------------ 3. izlenebilirlik (elle yazılan tablo)
IZ_ROWS = [
    ("Telefon numarasıyla kayıt",
     "Giriş ekranı: tek buton \"Telefonla gir\", 6 haneli SMS kodu (90 sn, 5 deneme/saat), şifre yok. v2 ile doğum yılından sonra e-Devlet yaş doğrulaması ve 15–17 için veli onayı eklendi.",
     f"KANON §6 (ekran 1), §12.2 · VİZYON §4 · bu sayfada: {link('ilk-30-dakika', 'İlk 30 dakika')}, {link('urun', 'Ürün')} (hukuki ve uyum)"),
    ("Programlama dili seçimi",
     "Dil Seçimi ekranı: 6 kart; yalnızca C# açık, Python, JavaScript, Java, Kotlin ve Go \"yakında — haber ver\"; bekleme listesi sonraki dil kararını besler.",
     f"KANON §6 (ekran 2) · B9 §11 (gelecek diller) · bu sayfada: {link('ilk-30-dakika', 'İlk 30 dakika')}"),
    ("Sanalika tarzı sosyal şehir",
     "İzometrik şehir: 7 semt, Derleyici Meydanı, Akademi ve Bloklar; avatar ve kıyafet, kendi Odan, ziyaret ve Alkış, Vitrin, balon sohbet.",
     f"KANON §2 · B1 (§12 Sanalika hissi kontrol listesi) · B6 §6–§7 · bu sayfada: {link('dunya', 'Dünya')}, {link('sosyal', 'Sosyal')}"),
    ("Yapay zekânın soru sorup puanlaması",
     "Akademi'de Usta sorusu ve Kurul Kartı: 4 soru tipi, rubrik 50 / 30 / 20 (Doğruluk, Tamlık, Açıklık), 0–100 puan, gerekçeli kart, itiraz ve kalibrasyon.",
     f"KANON §9 · B3 §3–§6 · bu sayfada: {link('ogrenme', 'Öğrenme sistemi')}"),
    ("XP ve seviye",
     "XP(L) = yuvarla10(80 × L^1,35); seviye 1–60, sekiz unvan (Çırak … Efsane); Seviye Hediyesi yalnızca kozmetik ya da kapasitedir.",
     f"KANON §3 · B2 §2–§4 · bu sayfada: {link('ilerleme', 'İlerleme')}"),
    ("İşletme satın alma",
     "20 işletme: Ruhsat (3 görev) + Bayt + seviye + boş slot ile Tapu alınır, bina \"KAPALI — yazılım bekliyor\" tabelasıyla açılır; ilk işletme her zaman Otopark'tır.",
     f"KANON §5, §10 · B2 §7 · B5 §2 · bu sayfada: {link('ilerleme', 'İlerleme')} (kilit zinciri), {link('isletmeler', 'İşletmeler')}"),
    ("Otopark kuralları",
     "Hasan Abi'nin cümlesi birebir iş emridir; Gereksinim Netleştirme (en az 4 soru) altı maddelik Sözleşme Kartı üretir; 26 testle doğrulanır (6 açık, 14 gizli, 6 tohumlu); 119 dk = 200 TL, 120 dk = 80 TL anomalisini fark edene Keskin Göz rozeti (+50 XP).",
     f"KANON §5.1 · VİZYON §7 · B5 §3 · bu sayfada: {link('isletmeler', 'İşletmeler')}; ayrıntı {doc('mufredat', 'Müfredat sayfasında')}"),
    ("Kodla para",
     "Oyuncunun C# kodu sunucuda gerçekten derlenir ve test edilir (Roslyn + gVisor); işletme geliri kodun ürettiği TL ÷ 10 = Bayt, referans çözümle tavanlı; Otopark L1 ≈ 220 B/gün, kasa 8 saatte dolar.",
     f"KANON §4 · B2 §8 · B3 §9 · bu sayfada: {link('ekonomi', 'Ekonomi')}; mimari {doc('teknik', 'Teknik sayfasında')}"),
    ("Para ile kozmetik",
     "Pazar: Bayt rafları (Sıradan, Şık, Nadir), Çip'le Butik (Premium) ve yalnızca beceriyle kazanılan Nişan (Rütbe Rafı, satılmaz). Çip ile XP, Bayt, ipucu, test hakkı, süre, işletme ya da Ruhsat alınamaz.",
     f"KANON §2.2, §4, §8 · B2 §9–§10 · bu sayfada: {link('ekonomi', 'Ekonomi')}"),
    ("Slogan",
     f"\"{M.esc(SLOGAN)}\" karşılama ekranı, mağaza sayfası ve video açılışının cümlesidir; alt slogan \"{M.esc(ALT_SLOGAN)}\" tabela ve Pazar dilidir.",
     f"KANON §1 · VİZYON §1 · bu sayfada: {link('kapak', 'Kapak')}"),
]


def izlenebilirlik_html():
    rows = "".join(
        f'<tr><td class="num">{i}</td><th scope="row">{M.esc(o)}</th><td>{k}</td><td>{b}</td></tr>'
        for i, (o, k, b) in enumerate(IZ_ROWS, 1)
    )
    return (
        '<div class="tablewrap"><table class="iz"><thead><tr><th class="num">#</th><th>Kurucunun öğesi</th><th>Oyundaki karşılığı</th><th>Belge ve bölüm</th></tr></thead>'
        f"<tbody>{rows}</tbody></table></div>"
    )


# ------------------------------------------------------------------ 4. çekirdek döngü ve işletme alt akışı
_adimlar = [M.strip_md(r[1]).split(" (")[0] for r in tbl(VIZ, "## 3.", "## 4.", ["#", "Adım"]).rows]
if _adimlar != ["Öğren", "Uygula", "İnşa Et", "Kazan", "Harca", "Göster"]:
    warn(f"VİZYON §3 adımları beklenenden farklı: {_adimlar}")

DONGU = dict(
    width=960, height=392, minWidth=820,
    title="Çekirdek döngü: Öğren, Uygula, İnşa Et, Kazan, Harca, Göster; her adım ödüllü bir köprüyle sonrakine bağlanır",
    nodes=[
        dict(id="o", x=30, y=30, w=210, h=84, label="1 · Öğren", sub="Akademi · 6–10 dk · Ders XP'si ve Ders Mührü", tone="cobalt"),
        dict(id="u", x=375, y=30, w=210, h=84, label="2 · Uygula", sub="Atölye · 3–8 dk · 60 XP + 40–80 B + Ruhsat parçası", tone="accent"),
        dict(id="i", x=720, y=30, w=210, h=84, label="3 · İnşa Et", sub="İşletme binası · 15–40 dk · Açılış, 300 XP", tone="violet"),
        dict(id="k", x=720, y=270, w=210, h=84, label="4 · Kazan", sub="Kasa · 10 sn · Otopark L1 ≈ 220 B/gün", tone="amber"),
        dict(id="h", x=375, y=270, w=210, h=84, label="5 · Harca", sub="Pazar, Oda, yükseltme · 1–3 dk", tone="coral"),
        dict(id="g", x=30, y=270, w=210, h=84, label="6 · Göster", sub="Meydan, Vitrin, lig · 2–5 dk · Alkış", tone="mint"),
        dict(id="c", x=345, y=150, w=270, h=84, label="Bir oturumda en az bir tam tur", sub="Mikro 2–3 dk · Mezo 15–20 dk · Makro 1–2 hafta", tone="n", shape="pill"),
    ],
    edges=[
        dict(**{"from": "o", "to": "u"}, label="köprü kartı ≤ 60 sn"),
        dict(**{"from": "u", "to": "i"}, label="Ruhsat 3/3 → Tapu"),
        dict(**{"from": "i", "to": "k"}, label="Açılış: kasa dolmaya başlar"),
        dict(**{"from": "k", "to": "h"}, label="hedef çubuğu"),
        dict(**{"from": "h", "to": "g"}, label="avatar, Oda, tabela"),
        dict(**{"from": "g", "to": "o"}, label="Vitrin: kodu oku"),
    ],
)

_NW, _GAP, _X0 = 120, 24, 10
_alt = [
    ("tapu", "Tapu", "Arsa alınır; tabela: KAPALI — yazılım bekliyor", "violet"),
    ("is", "İş Emri", "Hasan Abi'nin isteği, kurucunun kuralları birebir", "cobalt"),
    ("gn", "Gereksinim Netleştirme", "en az 4 soru → Sözleşme Kartı", "amber"),
    ("kod", "Kod", "Monaco; yalnızca metodun içi; 6 açık test", "accent"),
    ("muf", "Müfettiş", "14 gizli + 6 tohumlu test, şikâyet balonları", "coral"),
    ("sav", "Savunma", "Kurul bir satır seçer, oyuncu açıklar", "violet"),
    ("ac", "Açılış", "tam gelir, konfeti, LED pano", "mint"),
]
ISLETME_AKIS = dict(
    width=_X0 * 2 + 7 * _NW + 6 * _GAP, height=214, minWidth=900,
    title="İşletme alt akışı: Tapu, İş Emri, Gereksinim Netleştirme, Kod, Müfettiş, Savunma, Açılış",
    nodes=[dict(id=i, x=_X0 + n * (_NW + _GAP), y=18, w=_NW, h=100, label=l, sub=s, tone=t) for n, (i, l, s, t) in enumerate(_alt)],
    edges=[dict(**{"from": a[0], "to": b[0]}) for a, b in zip(_alt, _alt[1:])]
    + [dict(**{"from": "muf", "to": "ac"}, label="gizli test ya da Savunma kalırsa: Deneme modu, gelir %50", dashed=True, tone="coral",
            fromSide="b", toSide="b", via=[[_X0 + 4 * (_NW + _GAP) + _NW / 2, 150], [_X0 + 6 * (_NW + _GAP) + _NW / 2, 150]], ly=24)],
)

DONGU_JS = (
    "KK.flow(document.getElementById('d-dongu'), %s);\nKK.flow(document.getElementById('d-isletme-akis'), %s);" % (jsj(DONGU), jsj(ISLETME_AKIS))
)

DONGU_FIG = (
    '<figure><div id="d-dongu"></div><figcaption>Altı adım bir halka kurar; oklardaki etiketler adımları birbirine bağlayan ödüllü köprüdür '
    '(VİZYON §3). Oturumun ortasındaki rozet, hiçbir oturumun yarım bitmemesi kuralını hatırlatır.</figcaption></figure>'
)
ALT_AKIS_FIG = (
    '<h3 id="isletme-alt-akisi">İşletme alt akışı</h3>'
    '<p>Döngünün üçüncü adımı olan İnşa Et kendi içinde yedi adımdır. Tapu ile arsa alınır, İş Emri müşteri isteğini getirir, Gereksinim Netleştirme olmadan '
    'kod yazılamaz; testleri Müfettiş çalıştırır, Savunma kodun sahibini doğrular ve Açılış tam geliri başlatır.</p>'
    '<figure><div id="d-isletme-akis"></div><figcaption>Yedi adım soldan sağa akar; kesikli ok, gizli test ya da Savunma kaldığında işletmenin yine de açıldığı '
    'Deneme modunu gösterir (KANON §4: gelir %50, 24 saat sonra yeni hak).</figcaption></figure>'
)


# ------------------------------------------------------------------ 5. ilk 30 dakika (tablo -> dikey zaman çizelgesi)
def hook_timeline(headers, rows, ctx=None):
    if headers[:2] != ["Dakika", "Ekran / olay"] or len(headers) < 4:
        return None
    items = []
    for p, r in zip(rows, ctx["raw_rows"]):
        m = re.match(r"(\d+:\d+)", p[0])
        if not m:
            return None
        oyuncu, odul = r[2], r[3]
        if not M.strip_md(odul).strip():  # kaynak satırında "Oyuncu ne yapar" hücresi yok; kalan tek hücre ödüldür
            oyuncu, odul = "", r[2]
        satir = "".join(
            f'<p class="tl-r"><span class="lbl">{lab}</span>{M.inline(txt)}</p>' for lab, txt in (("Oyuncu", oyuncu), ("Ödül", odul)) if M.strip_md(txt).strip()
        )
        items.append(f'<li><span class="t">{m.group(1)}</span><div class="tl-b"><p class="tl-h">{M.inline(r[1])}<small>{M.esc(p[0])}</small></p>{satir}</div></li>')
    return (
        '<ol class="timeline tl30">' + "".join(items) + "</ol>"
        '<details class="acc"><summary>Tablo görünümü: ilk 30 dakika</summary>' + M.table_html(ctx["raw_headers"], ctx["raw_rows"]) + "</details>"
    )


_girus = next(r for r in tbl(KANON, "### 12.2", "### 12.3", ["Konu"]).raw_rows if M.strip_md(r[0]) == "Giriş akışı")
YAS_NOTU = (
    '<div class="callout amber" id="yas-notu"><p><strong>Güncelleme (KANON v2, §12.2).</strong> Yukarıdaki tablo VİZYON\'un ilk sürümünden aynen alınmıştır; '
    'yaş kuralları sonradan değişti: asgari kayıt yaşı <strong>15</strong>, hedef kitle 15–25. Giriş akışı artık şöyledir: ' + M.inline(_girus[1]) +
    '. Tablodaki "13 altı" ve "13–17" ifadeleri bu nedenle geçersizdir.</p></div>'
)


# ------------------------------------------------------------------ 6. dünya: Usta kartları ve izometrik kroki
def hook_semt(headers, rows, ctx=None):
    if headers[:3] != ["#", "Semt", "Tema / atmosfer"] or len(headers) < 7:
        return None
    rh, rr = ctx["raw_headers"], ctx["raw_rows"]
    cards = []
    for p, r in zip(rows, rr):
        n = int(p[0])
        trait, _, quote = r[6].partition(': "')
        quote = quote.rstrip('"')
        tier = re.search(r"Tier ([\d–]+)", p[2])
        cards.append(
            f'<article class="card usta" data-s="{n}"><div class="usta-h"><span class="semt" data-s="{n}">{M.esc(p[1])}</span>'
            f'<span class="badge">{"Tier " + tier.group(1) if tier else ""}</span></div>'
            f'<p class="usta-ad">{M.inline(r[5])}</p><p class="usta-trait">{M.inline(trait)}</p>'
            f'<p class="replik">“{M.inline(quote)}”</p></article>'
        )
    return (
        M.table_html(rh[:-1], [r[:-1] for r in rr])
        + '<h4 id="ustalar">Yedi Usta</h4><p>Her semtin bir Ustası vardır; kişiliği ve tipik cümlesi aşağıdadır (KANON §2.1).</p>'
        + '<div class="grid usta-grid">' + "".join(cards) + "</div>"
    )


def sehir_veri():
    """KANON §2.1'den (ad, kolon, sıra, yükseklik, renk, alt yazı); yükseklik = açılış seviyesi."""
    yer = {"Bulut Tepesi": (1, 0), "Kampüs": (0, 1), "Finans Bölgesi": (2, 1), "Atölyeler": (0, 2), "Çarşı": (2, 2),
           "Veri Vadisi": (0, 3), "Liman": (2, 3)}
    renk = {"Çarşı": "var(--s1)", "Liman": "var(--s2)", "Atölyeler": "var(--s3)", "Kampüs": "var(--s4)",
            "Finans Bölgesi": "var(--s5)", "Veri Vadisi": "var(--s6)", "Bulut Tepesi": "var(--fg-2)"}
    out = []
    for r in t_semt.rows:
        ad = r[1]
        sev = int(re.search(r"Sev\. (\d+)", r[4]).group(1))
        tier = re.search(r"Tier ([\d–]+)", r[2]).group(1)
        c, s = yer[ad]
        out.append([ad, c, s, round(10 + sev * 1.4), renk[ad], f"Sev. {sev} · T{tier}"])
    out.append(["Akademi", 1, 1, 38, "var(--cobalt-soft)", "7 Kürsü · Atölye · Lobi"])
    out.append(["Derleyici Meydanı", 1, 2, 4, "var(--accent-soft)", "doğma noktası"])
    out.append(["Bloklar", 1, 3, 13, "var(--surface-3)", "konut · Sev. 2"])
    return out


SEHIR_JS = r"""
const c = document.getElementById('d-sehir');
const D = %%D%%;
const SP = 3.4, BW = 2.6, P = (a, b, z) => KK.iso.xy(a, b, z || 0);
const pts = a => a.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const ground = (x0, y0, x1, y1, fill, ex) => '<polygon points="' + pts([P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]) + '" fill="' + fill + '" ' + ex + '/>';
let s = ground(-0.5, -0.5, 9.9, 13.3, 'var(--surface-2)', 'stroke="var(--line-2)" stroke-width="1.2"');
s += ground(-0.5, 13.3, 9.9, 16.3, 'var(--cobalt-soft)', 'stroke="var(--line)" stroke-width="1"');
s += '<polyline points="' + pts([[1.3, 12.95], [4.7, 13.05], [8.1, 13.05], [8.1, 13.7]].map(q => P(q[0], q[1]))) + '" fill="none" stroke="var(--cobalt)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>';
const sea = P(5, 14.9);
s += '<text x="' + sea[0].toFixed(1) + '" y="' + sea[1].toFixed(1) + '" text-anchor="middle" class="dg-g">Deniz</text>';
D.slice().sort((a, b) => (a[1] + a[2]) - (b[1] + b[2])).forEach(d => {
  s += '<g stroke="var(--line-2)" stroke-width="1" stroke-linejoin="round">' + KK.iso.block(d[1] * SP, d[2] * SP, BW, BW, d[3], {top: d[4], left: 'var(--surface-3)', right: 'var(--line-2)'}) + '</g>';
});
D.forEach(d => {
  const q = P(d[1] * SP + BW / 2, d[2] * SP + BW / 2, d[3]);
  s += '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] - 1).toFixed(1) + '" text-anchor="middle" class="iso-n">' + KK.esc(d[0]) + '</text>' +
       '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] + 13).toFixed(1) + '" text-anchor="middle" class="iso-s">' + KK.esc(d[5]) + '</text>';
});
const pusula = '<g transform="translate(64,168)"><line x1="0" y1="0" x2="56" y2="-28" stroke="var(--fg-2)" stroke-width="2"/><polygon points="56,-28 44,-28 49,-18" fill="var(--fg-2)"/>' +
  '<text x="-4" y="16" class="dg-g">Kuzey</text></g>';
c.classList.add('diag');
c.innerHTML = '<svg viewBox="0 0 920 560" role="img" aria-label="Şehir krokisi: Bulut Tepesi kuzeyde, Akademi ve Meydan ortada, Liman güneydoğuda; blok yüksekliği semtin açılış seviyesidir"><g transform="translate(560,112)">' + s + '</g>' + pusula + '</svg>';
c.querySelector('svg').style.minWidth = '780px';
"""


def sehir_html():
    chips = "".join(
        f'<span class="kk-leg"><span class="semt" data-s="{r[0]}">{M.esc(r[1])}</span></span>' for r in t_semt.rows
    )
    return (
        '<figure><div id="d-sehir"></div><figcaption>Şehir, Derleyici Meydanı\'ndan dışa açılan halkalardır (B1 §2.1). Blok yüksekliği semtin açılış seviyesini gösterir '
        '(Çarşı Sev. 1, Bulut Tepesi Sev. 40); doygun renkler semt renkleridir, soluk bloklar semt olmayan ortak yapılardır (Akademi Meydan\'ın kuzeyinde, Bloklar güneyinde); nehir Veri Vadisi\'nden doğar ve Liman\'da denize dökülür.</figcaption></figure>'
        f'<div class="kk-legend">{chips}</div>'
    )


# ------------------------------------------------------------------ 7. ilerleme: XP eğrisi ve kilit zinciri
def hook_xp_egri(headers, rows, ctx=None):
    if headers[:1] != ["Sev."] or len(headers) < 3 or not headers[1].startswith("XP(L)"):
        return None
    xs, ys = [], []
    for r in rows:
        if not re.search(r"\d", r[1]):
            continue
        lv, v = int(M.parse_num(r[0])), int(M.parse_num(r[1]))
        calc = int(round(80 * lv ** 1.35 / 10.0)) * 10
        if calc != v:
            warn(f"B2 §2.2 seviye {lv}: tablo {v}, formül yuvarla10(80 × L^1,35) = {calc}")
        xs.append(str(lv))
        ys.append(v)
    fig = (
        f'<figure><div id="c-xp"></div><figcaption>Seviye başına gereken XP düzgün artar: seviye 1\'de {fmt_tr(ys[0])}, seviye {xs[-1]}\'da {fmt_tr(ys[-1])} XP '
        f'(XP(L) = yuvarla10(80 × L^1,35)); 60. seviye tavan olduğundan son geçiş 59 → 60\'tır. Tablo görünümü grafiğin altındadır.</figcaption></figure>'
    )
    js = (
        "KK.lineChart(document.getElementById('c-xp'), {x:%s, series:[{name:'XP(L)', values:%s}], yLabel:'XP (L → L+1)', format:v => KK.fmt(v), height:300, "
        "title:'XP eğrisi: seviye 1 ile %s arası, seviye başına gereken XP'});" % (jsj(xs), jsj(ys), xs[-1])
    )
    return fig + '<details class="acc"><summary>Seviye tablosu: 1–60</summary>' + M.table_html(ctx["raw_headers"], ctx["raw_rows"]) + "</details>", js


KILIT = dict(
    width=960, height=292, minWidth=800,
    title="Kilit zinciri: Ders Mührü, prova görevi, Ruhsat, Tapu, Açılış ve Semt Sınavı",
    nodes=[
        dict(id="m", x=30, y=20, w=240, h=82, label="Ders Mührü", sub="3 Usta sorusundan 2'sinde ≥ 70", tone="cobalt"),
        dict(id="g", x=360, y=20, w=240, h=82, label="Prova görevi", sub="60 XP + 40–80 B + Ruhsat parçası", tone="accent"),
        dict(id="r", x=690, y=20, w=240, h=82, label="Ruhsat", sub="3 görev = 1 Ruhsat; +100 B Belediye teşviki", tone="amber"),
        dict(id="t", x=30, y=190, w=240, h=82, label="Tapu", sub="Bayt + seviye + boş slot; bina KAPALI — yazılım bekliyor", tone="violet"),
        dict(id="a", x=360, y=190, w=240, h=82, label="Açılış", sub="kod + testler + Savunma → tam gelir", tone="mint"),
        dict(id="s", x=690, y=190, w=240, h=82, label="Semt Sınavı", sub="tüm semt dersleri + seviye eşiği; 20 dk, 3 kod + 3 soru", tone="coral"),
    ],
    edges=[
        dict(**{"from": "m", "to": "g"}, label="görev açılır"),
        dict(**{"from": "g", "to": "r"}, label="3 görev"),
        dict(**{"from": "r", "to": "t"}, label="Ruhsat 3/3 + Bayt + seviye", fromSide="b", toSide="t", via=[[810, 146], [150, 146]]),
        dict(**{"from": "t", "to": "a"}, label="kod yaz"),
        dict(**{"from": "a", "to": "s"}, label="hak kazanılır"),
    ],
)
KILIT_JS = "KK.flow(document.getElementById('d-kilit'), %s);" % jsj(KILIT)
KILIT_FIG = (
    '<h3 id="kilit-zinciri">Kilit zinciri</h3>'
    '<p>Oyunda hiçbir şey zamanla kilitlenmez; her kapı bir beceri kanıtıyla açılır. Ders Mührü görevi açar, üç görev Ruhsat olur, Ruhsat + Bayt + seviye Tapu getirir, '
    'işletmenin Açılışı ve semt dersleri Semt Sınavı\'na, sınav yeni semte götürür.</p>'
    '<figure><div id="d-kilit"></div><figcaption>Kilit zinciri soldan sağa ve yukarıdan aşağıya okunur; her ok, bir sonraki kapıyı açan koşulu adlandırır '
    '(KANON §4, §5; B4 §6).</figcaption></figure>'
)


# ------------------------------------------------------------------ 8. ekonomi: akış şeması ve 30 günlük simülasyon
def _sim():
    seri = []
    for tag, nxt, ad in (("### 11.2", "### 11.3", "Hafif"), ("### 11.3", "### 11.4", "Normal"), ("### 11.4", "### 11.5", "Yoğun")):
        t = tbl(B2, tag, nxt, ["Gün", "Sev.", "Toplam XP", "Bayt bakiyesi"])
        v = [int(M.parse_num(r[3])) for r in t.rows]
        if len(v) != 30:
            warn(f"B2 {tag}: {len(v)} satır (30 beklenir)")
        seri.append((ad, v))
    return seri


SIM = _sim()
SIM_FIG = (
    '<figure><div id="c-sim"></div><figcaption>30 günün sonunda Bayt bakiyesi hafif oyuncuda ' + fmt_tr(SIM[0][1][-1]) + ', normal oyuncuda ' + fmt_tr(SIM[1][1][-1]) +
    ' ve yoğun oyuncuda ' + fmt_tr(SIM[2][1][-1]) + ' B\'dir. Hafif ≈10 dk/gün, normal 35 dk/gün, yoğun 90 dk/gün oynar; çizgiler arasındaki açılma, tapu ve yükseltme anlarında '
    'kırılır (B2 §11). Tablo görünümü altta.</figcaption></figure>'
)
SIM_JS = (
    "KK.lineChart(document.getElementById('c-sim'), {x:%s, series:%s, yLabel:'Bayt bakiyesi', format:v => KK.fmt(v) + ' B', height:320, "
    "title:'30 günlük Bayt bakiyesi: hafif, normal ve yoğun oyuncu'});"
    % (jsj([str(i) for i in range(1, 31)]), jsj([dict(name=a, values=v) for a, v in SIM]))
)

_t106 = tbl(B2, "### 10.6", "## 11.", ["Büyüklük", "Hafif", "Normal", "Yoğun"])
KAYNAK_N = M.parse_num(_t106.rows[0][2])  # normal oyuncu, 30 günde Bayt kaynağı
GIDER_N = M.parse_num(_t106.rows[1][2])
_pay = re.search(r"işletme %(\d+), görev %(\d+), Günlük Tekrar ve seri %(\d+), lig %(\d+), sosyal \(alkış\) %(\d+)", M.extract(B2, "### 5.1", "### 5.2"))
PAYLAR = [int(x) for x in _pay.groups()] if _pay else [60, 20, 8, 7, 5]
if sum(PAYLAR) != 100:
    warn(f"B2 §5.1 kaynak payları toplamı {sum(PAYLAR)}")
_lav = tbl(B2, "### 6.3", "## 7.", ["Lavabo", "Fiyat", "Açılış"])
LAVABO = []
for r in _lav.rows:
    sayilar = re.findall(r"([\d.]+) B", r[3])
    LAVABO.append((r[0], int(M.parse_num(sayilar[-1]))))
LAV_TOPLAM = sum(v for _, v in LAVABO)
KALAN = KAYNAK_N - GIDER_N - LAV_TOPLAM
_SRC_AD = [("İşletme geliri", "cobalt"), ("Görev ve Ruhsat", "accent"), ("Günlük Tekrar ve seri", "mint"), ("Haftalık lig", "violet"), ("Alkış ve sosyal", "amber")]
SRC = [[ad, f"%{p} · ≈{fmt_tr(KAYNAK_N * p / 100)} B", KAYNAK_N * p / 100, tone] for (ad, tone), p in zip(_SRC_AD, PAYLAR)]
_SNK_TONE = ["violet", "amber", "cobalt", "mint"]
SNK = [["Mevcut giderler", f"tapu, yükseltme, Daire, kozmetik · {fmt_tr(GIDER_N)} B", GIDER_N, "coral"]]
SNK += [[ad, f"hedef {fmt_tr(v)} B/ay", v, _SNK_TONE[i]] for i, (ad, v) in enumerate(LAVABO)]
SNK += [["Kalan bakiye", f"{fmt_tr(KALAN)} B", KALAN, "n"]]

EKO_JS = r"""
const SRC = %%SRC%%, SNK = %%SNK%%, TOP = %%TOP%%;
const el = document.getElementById('d-ekonomi');
const W = 960, H = 410, K = 0.0034, CX = 420, CW = 120, LX = 20, LW = 235, RX = 705, RW = 235;
const total = SRC.reduce((s, a) => s + a[2], 0);
const ch = Math.round(total * K + 36), cy0 = Math.round((H - ch) / 2);
const nodes = [];
SRC.forEach((s, i) => nodes.push({id: 's' + i, x: LX, y: 20 + i * 74, w: LW, h: 56, label: s[0], sub: s[1], tone: s[3]}));
SNK.forEach((s, i) => nodes.push({id: 'k' + i, x: RX, y: 10 + i * 65, w: RW, h: 52, label: s[0], sub: s[1], tone: s[3]}));
nodes.push({id: 'b', x: CX, y: cy0, w: CW, h: ch, label: 'Bayt', sub: 'cüzdan, 30 gün', tone: 'amber'});
KK.flow(el, {width: W, height: H, minWidth: 820, title: TOP, nodes: nodes, edges: []});
const NS = 'http://www.w3.org/2000/svg', svg = el.querySelector('svg'), first = svg.querySelector('g');
const band = (x1, y1, x2, y2, amt, tone, ad) => {
  const p = document.createElementNS(NS, 'path'), xm = (x1 + x2) / 2, t = document.createElementNS(NS, 'title');
  p.setAttribute('d', 'M' + x1 + ',' + y1.toFixed(1) + ' C' + xm + ',' + y1.toFixed(1) + ' ' + xm + ',' + y2.toFixed(1) + ' ' + x2 + ',' + y2.toFixed(1));
  p.setAttribute('fill', 'none'); p.setAttribute('stroke', tone === 'n' ? 'var(--muted)' : 'var(--' + tone + ')');
  p.setAttribute('stroke-width', Math.max(2, amt * K).toFixed(1)); p.setAttribute('opacity', '0.55');
  t.textContent = ad + ': ' + KK.fmt(Math.round(amt)) + ' B'; p.appendChild(t); svg.insertBefore(p, first);
};
let yL = cy0 + (ch - total * K) / 2, yR = yL;
SRC.forEach((s, i) => { const w = s[2] * K; band(LX + LW, 20 + i * 74 + 28, CX, yL + w / 2, s[2], s[3], s[0]); yL += w; });
SNK.forEach((s, i) => { const w = s[2] * K; band(CX + CW, yR + w / 2, RX, 10 + i * 65 + 26, s[2], s[3], s[0]); yR += w; });
"""

EKO_FIG = (
    '<figure><div id="d-ekonomi"></div><figcaption>Bayt akışı, normal oyuncunun 30 gününde (B2 §11.3): kaynak ' + fmt_tr(KAYNAK_N) + ' B, kalınlık miktarla orantılıdır. '
    'Kaynak payları B2 §5.1\'in olgun oyuncu hedef dağılımıdır (işletme %' + str(PAYLAR[0]) + ', görev %' + str(PAYLAR[1]) + ', Günlük Tekrar ve seri %' + str(PAYLAR[2]) +
    ', lig %' + str(PAYLAR[3]) + ', alkış %' + str(PAYLAR[4]) + '). Giderler simülasyondaki ' + fmt_tr(GIDER_N) + ' B ile B2 §6.3\'ün dört yeni lavabosunun hedef hacmi ' +
    fmt_tr(LAV_TOPLAM) + ' B\'dir; gider/kaynak ≈ ' + fmt_tr((GIDER_N + LAV_TOPLAM) / KAYNAK_N, 2) + ' olur (hedef 0,7–0,9).</figcaption></figure>'
)
EKO_JS_FILLED = tmpl(
    EKO_JS, SRC=jsj(SRC), SNK=jsj(SNK),
    TOP=jsj("Bayt akışı: beş kaynak, Bayt cüzdanı ve altı çıkış; kalınlık miktarla orantılı"),
)


# ------------------------------------------------------------------ 9. öğrenme sistemi: PRIMM şeması ve soru tipi kartları
_t_primm = tbl(B3, "### 2.2", "### 2.3", ["PRIMM", "Ders bölümü", "Oyuncu eylemi", "Ölçülen sinyal"])
_PW, _PG, _PX0 = 148, 64, 20
_PTONE = ["cobalt", "accent", "violet", "amber", "mint"]
_PEDGE = ["çalıştır", "neden?", "dene", "köprü"]
PRIMM = dict(
    width=_PX0 * 2 + 5 * _PW + 4 * _PG, height=170, minWidth=900,
    title="PRIMM: Tahmin et, Çalıştır, İncele, Değiştir, Yap; ilk dördü derstedir, Yap dersin dışındaki görevdir",
    groups=[
        dict(x=10, y=6, w=836, h=150, tone="cobalt", label="Ders: 5 bölüm, 6–10 dakika"),
        dict(x=_PX0 + 4 * (_PW + _PG) - 12, y=6, w=_PW + 24, h=150, tone="mint", label="Ders dışı"),
    ],
    nodes=[
        dict(id=f"p{i}", x=_PX0 + i * (_PW + _PG), y=34, w=_PW, h=110, label=r[0],
             sub=(r[1] + ". Sinyal: " + r[3]) if i < 4 else ("Görev (Atölye). Sinyal: " + r[3]), tone=_PTONE[i])
        for i, r in enumerate(_t_primm.rows)
    ],
    edges=[dict(**{"from": f"p{i}", "to": f"p{i + 1}"}, label=_PEDGE[i]) for i in range(4)],
)
PRIMM_JS = "KK.flow(document.getElementById('d-primm'), %s);" % jsj(PRIMM)
PRIMM_FIG = (
    '<h3 id="primm-semasi">PRIMM şeması</h3>'
    '<p>Her ders PRIMM\'in beş adımına oturur: dersin dört bölümü ilk dört adımı taşır, Yap adımı dersin dışındaki Görev\'dir (B3 §2.2). '
    'Özet\'teki köprü kartı Öğren → Uygula geçişini 60 saniyenin altında tutar.</p>'
    '<figure><div id="d-primm"></div><figcaption>Beş adım soldan sağa akar; her düğüm hangi ders bölümünde yaşadığını ve hangi sinyalin ölçüldüğünü söyler (B3 §2.2).</figcaption></figure>'
)

_b3_0 = M.extract(B3, "## 0.", "## 1.")
for _s in ("Kavram %100 Kurul", "Çıktı Tahmini 40 makine + 60 Kurul", "Hata Avı 58 + 42", "Kod Yazma %100 makine"):
    if _s not in _b3_0:
        warn(f"B3 §0 puanlayıcı payı bulunamadı: {_s}")
_QPAY = {"Kavram Sorusu": (0, 100), "Çıktı Tahmini": (40, 60), "Hata Avı": (58, 42), "Kod Yazma": (100, 0)}  # (makine, Kurul)
_QORNEK = {
    "Kavram Sorusu": "`int yas = 17;` satırında `yas`, `17` ve `int` ne işe yarıyor? Kendi cümlelerinle anlat.",
    "Çıktı Tahmini": "`double ucret = 7 / 2;` programı ekrana ne yazdırır? Önce çıktıyı, sonra nedenini yaz. (Sayılar oyuncuya özel tohumdan gelir.)",
    "Hata Avı": "Bu kod derlenmiyor. Hatalı satırı seç, düzelt ve nedenini bir cümleyle yaz.",
    "Kod Yazma": "1–6 satırlık ifade ya da küçük bir metot yazılır; puanın tamamı açık ve gizli testlerden gelir, LLM çağrılmaz.",
}


def qcards_html():
    t = tbl(B3, "### 3.5", "## 4.", ["Tip", "Zayıf", "Orta", "İyi"])
    xp = re.compile(r"\*\*(\d+) XP\*\*")
    cards = []
    for raw in t.raw_rows:
        tip = M.strip_md(raw[0])
        ad = tip.split(" (")[0]
        ad = "Kavram Sorusu" if ad == "Kavram" else ad
        qid = re.search(r"\(([^)]+)\)", tip)
        z, o, i = (xp.findall(raw[k])[-1] for k in (1, 2, 3))
        mk, ku = _QPAY[ad]
        bar = "".join(
            f'<span class="{cls}" style="flex-grow:{w}">{lab} {w}</span>' for cls, lab, w in (("mk", "Makine", mk), ("ku", "Kurul", ku)) if w
        )
        cards.append(
            f'<article class="card qtip"><h4>{M.esc(ad)}</h4><div class="qpay" role="img" aria-label="Puanı veren: Makine {mk}, Kurul {ku}">{bar}</div>'
            f'<p class="qex">{M.inline(_QORNEK[ad])}</p>'
            f'<p class="qxp"><span class="lbl">T1 XP, 1. deneme</span> zayıf <strong>{z}</strong> · orta <strong>{o}</strong> · iyi <strong>{i}</strong>'
            f'{" <small>(" + M.esc(qid.group(1)) + ")</small>" if qid else ""}</p></article>'
        )
    return (
        '<h3 id="soru-tipi-kartlari">Soru tipi kartları</h3>'
        '<p>Hepsi aynı rubrikle puanlanır: Doğruluk 50, Tamlık 30, Açıklık 20. Değişen tek şey puanı kimin verdiğidir: Kurul (yapay zekâ puanlayıcı) ya da makine (derleyici ve testler).</p>'
        '<div class="rubrik" role="img" aria-label="Rubrik: Doğruluk 50, Tamlık 30, Açıklık 20"><span class="d" style="flex-grow:50">Doğruluk 50</span>'
        '<span class="t" style="flex-grow:30">Tamlık 30</span><span class="a" style="flex-grow:20">Açıklık 20</span></div>'
        '<div class="grid q-grid">' + "".join(cards) + "</div>"
    )


ORGENME_BAGLANTI = (
    '<div class="docbox"><p><strong>Ayrıntı nerede.</strong> Soru bankası, 100 dersin tablosu ve Ders Mührü / Günlük Tekrar kuralları '
    + doc("mufredat", "Müfredat ve İşletmeler") + ' sayfasında; puanlama hattı, anti-cheat ve maliyet modelinin teknik tarafı '
    + doc("teknik", "Teknik Mimari") + ' sayfasındadır.</p></div>'
)


# ------------------------------------------------------------------ 10. işletmeler: Otopark yolculuğu
_k51 = M.extract(KANON, "### 5.1", "## 6.")
_i_test, _i_sonra = _k51.index("**Testler:"), _k51.index("**Sonraki seviyeler:**")
K51_A, K51_B = _k51[:_i_test], _k51[_i_sonra:]
ANOMALI = (
    '<div class="callout amber"><p><strong>Keskin Göz (Sözleşme madde 6).</strong> 119 dakika kalan 200 TL, 120 dakika kalan 80 TL öder: uzun kalan kazanır. '
    'Bu, müşterinin bilinçli kararıdır; Usta anomaliyi söylemez, fark edip soran oyuncu <strong>Keskin Göz</strong> rozetiyle +50 XP kazanır '
    '(VİZYON §7, KANON §5.1). Ders: gereksinimi görünür biçimde sorgula, müşterinin kararına saygı duy.</p></div>'
)
YOLCULUK_AC = (
    '<div class="card yolculuk"><h3 id="otopark-yolculugu">Otopark yolculuğu</h3>'
    '<p>Kanonik ilk işletme Otopark\'tır: Tapu alınınca Hasan Abi bir iş emri uzatır, kurucunun kuralları müşteri ağzından birebir gelir; '
    'oyuncu önce sorar (Gereksinim Netleştirme), Sözleşme Kartı kuralları sabitler, sonra kod yazılır.</p>'
)
YOLCULUK_KAPAT = (
    '<p>Testler, referans çözüm, ücret kademesi grafiği ve gerçek çalıştırma çıktısı ' + doc("mufredat", "Müfredat ve İşletmeler") + ' sayfasındaki "Otopark: tam ayrıntı" bölümündedir.</p></div>'
)


# ------------------------------------------------------------------ 11. görevler: haftalık ızgara
def hook_hafta(headers, rows, ctx=None):
    if headers[:1] != ["Gün"] or len(headers) < 5 or not headers[1].startswith("Sabah"):
        return None
    rr = ctx["raw_rows"]
    ph_re = re.compile(r"\((MVP|v1\.1|v1\.2|v2)\)")

    def cell(raw):
        if M.strip_md(raw) in ("—", "-", ""):
            return '<div class="wk-c empty">—</div>'
        evs = []
        for e in [x.strip() for x in raw.split(" · ") if x.strip()]:
            ph = ph_re.search(e)
            evs.append(f'<p class="ev"{(" data-ph=" + chr(34) + ph.group(1) + chr(34)) if ph else ""}>{M.inline(e)}</p>')
        return '<div class="wk-c">' + "".join(evs) + "</div>"

    slots = [h.split(" (") for h in headers[1:4]]
    days = [r for r in rr if M.strip_md(r[0]) != "Her gün"]
    ever = next((r for r in rr if M.strip_md(r[0]) == "Her gün"), None)
    out = ['<div class="tablewrap wk-wrap" id="d-hafta"><div class="wk" aria-label="Haftalık etkinlik ritmi: yedi gün, üç zaman dilimi">', '<div class="wk-h"></div>']
    out += [f'<div class="wk-day">{M.inline(r[0])}<small>{M.inline(r[4])}</small></div>' for r in days]
    for si, (ad, saat) in enumerate(slots, 1):
        out.append(f'<div class="wk-slot">{M.esc(ad)}<small>{M.esc(saat.rstrip(")"))}</small></div>')
        out += [cell(r[si]) for r in days]
    if ever:
        out.append('<div class="wk-slot">Her gün</div><div class="wk-all">' + "".join(
            f'<div><small>{M.esc(slots[k][0])}</small>{cell(ever[k + 1])}</div>' for k in range(3)) + "</div>")
    out.append("</div></div>")
    leg = (
        '<div class="kk-legend"><span class="kk-leg"><i style="background:var(--s1)"></i>MVP</span><span class="kk-leg"><i style="background:var(--s2)"></i>v1.1</span>'
        '<span class="kk-leg"><i style="background:var(--s3)"></i>v1.2</span><span class="kk-leg"><i style="background:var(--line-2)"></i>sürüm etiketi yok</span></div>'
    )
    return "".join(out) + leg + '<details class="acc"><summary>Tablo görünümü: haftalık ritim</summary>' + M.table_html(ctx["raw_headers"], rr) + "</details>"


# ------------------------------------------------------------------ 13. ürün: persona, Gantt, risk
def hook_persona(headers, rows, ctx=None):
    if headers[:2] != ["Alan", "Değer"]:
        return None
    dl = "".join(f"<dt>{M.inline(a)}</dt><dd>{M.inline(b)}</dd>" for a, b in ctx["raw_rows"])
    return f'<div class="card persona"><dl class="kv">{dl}</dl></div>'


def hook_gantt(headers, rows, ctx=None):
    if headers[:2] != ["İş paketi", "Faz"] or len(headers) < 4:
        return None
    gr = []
    for r in rows:
        ad = re.sub(r"\s+", " ", r[0])
        kisa = ad if len(ad) <= 44 else ad[:43].rstrip(" ,(") + "…"
        gr.append(dict(label=kisa, start=int(M.parse_num(r[2])) - 1, len=int(M.parse_num(r[3])), faz=r[1]))
    son = max(g["start"] + g["len"] for g in gr)
    if son > 52:
        warn(f"Gantt {son}. haftaya uzanıyor (52 beklenir)")
    fig = (
        '<figure><div id="c-gantt"></div><figcaption>30 iş paketi 52 haftaya yayılır: MVP (H1–H12) renkli çubukların ilk bloğudur, v1.1 H13–H24, v1.2 H25–H36, v2 H37–H52. '
        'Çubuk uzunluğu hafta sayısıdır; tam iş paketi adları ve bağımlılıklar tabloda.</figcaption></figure>'
    )
    js = (
        "KK.gantt(document.getElementById('c-gantt'), {weeks:52, width:1000, labelWidth:310, rows:%s, title:'Yol haritası: 30 iş paketi, 52 hafta, dört faz'});" % jsj(gr)
    )
    return fig + '<details class="acc"><summary>Tablo görünümü: Gantt verisi</summary>' + M.table_html(ctx["raw_headers"], ctx["raw_rows"]) + "</details>", js


def hook_risk(headers, rows, ctx=None):
    if headers[:2] != ["ID", "Risk"] or "Önem" not in headers:
        return None
    ad = {"kritik": "kritik", "yuksek": "yüksek", "orta": "orta", "dusuk": "düşük"}
    sayac = {k: 0 for k in ad}
    for r in rows:
        k = M.strip_md(r[headers.index("Önem")])
        if k in sayac:
            sayac[k] += 1
    html = M.table_html(ctx["raw_headers"], ctx["raw_rows"])
    html = re.sub(r"<td([^>]*)><code>(kritik|yuksek|orta|dusuk)</code></td>",
                  lambda m: f'<td{m.group(1)}><span class="sev {m.group(2)}" aria-hidden="true"></span>{ad[m.group(2)]}</td>', html)
    leg = '<div class="kk-legend">' + "".join(
        f'<span class="kk-leg"><span class="sev {k}" aria-hidden="true"></span>{sayac[k]} {ad[k]}</span>' for k in ad) + "</div>"
    return leg + html


HUKUKI_NOT = (
    '<div class="callout coral" id="hukuki-not"><p><strong>Hukuk teyidi şart.</strong> Asgari kayıt yaşı <strong>15</strong>\'tir (<code>min_kayit_yasi = 15</code>, hedef kitle 15–25). '
    '7578 sayılı Kanun ve 10 Ekim 2026 tarihli Resmî Gazete yönetmeliği 1 Kasım 2026\'da yürürlüktedir; bu bilgi haber ve hukuk bürosu özetlerine dayanır, '
    'Resmî Gazete sayısı ve madde numaraları kaynaklarda tutarsızdır. Birincil metin ve yazılı hukuk görüşü şarttır (B9 G0, H2); '
    'hukuki zorunluluk KANON\'un üstündedir (KANON §12.2).</p></div>'
)


# ------------------------------------------------------------------ 14. kaynaklar, açık sorular, sözlük
_kimlik = {r[0]: r for r in tbl(KANON, "### 12.5", "### 12.6", ["id"]).rows}
_BU_SAYFADA = {
    "VİZYON": f"{link('vizyon', 'Vizyon')}, {link('cekirdek-dongu', 'Çekirdek döngü')}, {link('ilk-30-dakika', 'İlk 30 dakika')}",
    "KANON": f"{link('izlenebilirlik', 'İzlenebilirlik')}, {link('dunya', 'Dünya')}, {link('isletmeler', 'İşletmeler')}, {link('kaynaklar', 'Sözlük')}",
    "B1": link("dunya", "Dünya"),
    "B2": f"{link('ilerleme', 'İlerleme')}, {link('ekonomi', 'Ekonomi')}",
    "B3": link("ogrenme", "Öğrenme sistemi"),
    "B4": f"özet; ayrıntı {doc('mufredat', 'Müfredat ve İşletmeler')}",
    "B5": f"özet; ayrıntı {doc('mufredat', 'Müfredat ve İşletmeler')}",
    "B6": f"{link('gorevler', 'Görevler')}, {link('sosyal', 'Sosyal')}",
    "B7": f"yok; ayrıntı {doc('teknik', 'Teknik Mimari')}",
    "B8": f"yok; ayrıntı {doc('ekranlar', 'Ekran Tasarımları')}",
    "B9": link("urun", "Ürün"),
}


def kaynaklar_html():
    rows = []
    for k in ("VİZYON", "KANON", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9"):
        r = _kimlik.get(k)
        if not r:
            warn(f"KANON §12.5'te {k} yok")
            continue
        rows.append(f"<tr><th scope=\"row\">{M.esc(k)}</th><td><code>{M.esc(r[1])}</code></td><td>{M.esc(r[2])}{(' · ' + M.esc(r[3])) if r[3] else ''}</td><td>{_BU_SAYFADA[k]}</td></tr>")
    return (
        '<h3 id="kaynak-belgeler">Kaynak belgeler</h3>'
        '<p>Bu sayfadaki metin, aşağıdaki spec belgelerinden aynen alınmıştır. Bir belge KANON ile çelişirse KANON geçerlidir; hukuki zorunluluk KANON\'un da üstündedir.</p>'
        '<div class="tablewrap"><table><thead><tr><th>Belge</th><th>Dosya</th><th>Konu</th><th>Bu sayfada</th></tr></thead><tbody>' + "".join(rows) + "</tbody></table></div>"
        '<p class="doc-links"><strong>Belge ailesi:</strong> ' + doc("tasarim", "Oyun Tasarımı") + ' (bu sayfa) · ' + doc("teknik", "Teknik Mimari") + ' · '
        + doc("mufredat", "Müfredat ve İşletmeler") + ' · ' + doc("ekranlar", "Ekran Tasarımları") + ' · ' + doc("prototip", "Oyun Prototipi") + "</p>"
    )


ACIK_SORU_GIRIS = (
    '<h3 id="acik-sorular">Açık sorular</h3>'
    '<p>Aşağıdaki on soru kurucu kararı bekler; metin KANON §12.6\'dan aynen alınmıştır.</p>'
)

SOZLUK_SECIM = ["Bayt (B)", "Çip", "Derleyici Meydanı", "Ders Mührü", "Ruhsat", "Tapu", "İş Emri", "Gereksinim Netleştirme", "Sözleşme Kartı", "Müfettiş",
                "Savunma", "Açılış", "Deneme modu", "Kasa", "Kurul", "Usta", "Günlük Tekrar", "Semt Sınavı", "Nişan", "Vitrin"]


def sozluk_html():
    t = tbl(KANON, "## 10.", "## 11.", ["Terim", "Tanım"])
    by = {M.strip_md(r[0]): r for r in t.raw_rows}
    eksik = [s for s in SOZLUK_SECIM if s not in by]
    if eksik:
        warn(f"KANON §10'da bulunamayan terimler: {eksik}")
    secim = [by[s] for s in SOZLUK_SECIM if s in by]
    return (
        '<h3 id="sozluk">Sözlük</h3><p>KANON §10\'dan seçilen ' + str(len(secim)) + ' terim; tam sözlük KANON\'dadır.</p>'
        + M.table_html(t.raw_headers, secim)
    )


# ------------------------------------------------------------------ sayfa CSS
CSS = """
.semt{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;font-weight:600}
.semt::before{content:"";width:10px;height:10px;border-radius:3px;background:var(--c,var(--muted));flex:0 0 auto}
.semt[data-s="1"],.card[data-s="1"]{--c:var(--s1)}.semt[data-s="2"],.card[data-s="2"]{--c:var(--s2)}.semt[data-s="3"],.card[data-s="3"]{--c:var(--s3)}
.semt[data-s="4"],.card[data-s="4"]{--c:var(--s4)}.semt[data-s="5"],.card[data-s="5"]{--c:var(--s5)}.semt[data-s="6"],.card[data-s="6"]{--c:var(--s6)}
.semt[data-s="7"],.card[data-s="7"]{--c:var(--fg-2)}
.usta-grid{grid-template-columns:repeat(auto-fill,minmax(236px,1fr));gap:14px;margin:12px 0 16px}
.card.usta{display:grid;gap:6px;align-content:start;padding:14px 16px;border-top:3px solid var(--c,var(--line))}
.usta-h{display:flex;justify-content:space-between;align-items:center;gap:8px}
.usta-ad{margin:0;font-family:var(--font-display);font-size:18px;font-weight:700}
.usta-trait{margin:0;color:var(--muted);font-size:13.5px}
.replik{margin:4px 0 0;padding-left:10px;border-left:3px solid var(--c,var(--line-2));font-style:italic;color:var(--fg-2);font-size:14px}
.iso-n{font:700 12.5px var(--font-body);fill:var(--fg);paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}
.iso-s{font:600 11px var(--font-body);fill:var(--fg-2);paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}
table.iz th[scope=row]{text-align:left;min-width:150px}
table.iz td:not(.num){min-width:200px}
table.iz td.num{width:2.5em;text-align:center}
.tl30{margin:14px 0 18px}
.tl30 li{align-items:start;grid-template-columns:0 minmax(0,1fr);gap:0 20px}
.tl30 .tl-b{min-width:0}
.tl30 .tl-h{margin:0 0 4px}
.tl30 .tl-h small{margin-left:8px;color:var(--muted);font-family:var(--font-mono);font-size:12px}
.tl30 .tl-r{margin:3px 0;font-size:14.5px;color:var(--fg-2)}
.lbl{display:inline-block;min-width:54px;margin-right:6px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.wk{display:grid;grid-template-columns:84px repeat(7,minmax(122px,1fr));min-width:940px;font-size:13px}
.wk>div{padding:8px 9px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);min-width:0}
.wk .wk-day{font-weight:700;background:var(--surface-2)}
.wk small{display:block;font-weight:500;color:var(--muted);font-size:11.5px}
.wk .wk-slot{background:var(--surface-2);color:var(--fg-2);font-size:12px;font-weight:700}
.wk .wk-c{padding:0}.wk .wk-c.empty{color:var(--muted)}
.wk .ev{margin:0 0 7px;padding-left:8px;border-left:3px solid var(--ph,var(--line-2));line-height:1.38}
.wk .ev[data-ph="MVP"]{--ph:var(--s1)}.wk .ev[data-ph="v1.1"]{--ph:var(--s2)}.wk .ev[data-ph="v1.2"]{--ph:var(--s3)}.wk .ev[data-ph="v2"]{--ph:var(--s5)}
.wk .wk-all{grid-column:2/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:0 14px}
.rubrik{display:flex;gap:2px;margin:10px 0 14px;max-width:560px}
.rubrik span{display:block;padding:7px 9px;font-size:12.5px;font-weight:700;color:var(--fg);border-bottom:3px solid var(--c);background:var(--cs)}
.rubrik .d{--c:var(--accent);--cs:var(--accent-soft)}.rubrik .t{--c:var(--amber);--cs:var(--amber-soft)}.rubrik .a{--c:var(--cobalt);--cs:var(--cobalt-soft)}
.rubrik span:first-child{border-radius:6px 0 0 6px}.rubrik span:last-child{border-radius:0 6px 6px 0}
.q-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,205px),1fr));gap:14px;margin:6px 0 12px}
.card.qtip{display:grid;gap:8px;align-content:start}
.card.qtip h4{margin:0}
.qpay{display:flex;gap:2px}
.qpay span{display:block;padding:4px 8px;font-size:12px;font-weight:700;color:var(--fg)}
.qpay .mk{background:var(--mint-soft);border-bottom:3px solid var(--mint);border-radius:6px 0 0 6px}
.qpay .ku{background:var(--violet-soft);border-bottom:3px solid var(--violet);border-radius:0 6px 6px 0}
.qpay span:only-child{border-radius:6px}
.qex,.qxp{margin:0;font-size:14px}.qxp{color:var(--fg-2)}
.card.yolculuk{border-left:4px solid var(--amber);margin-block:14px}
.card.yolculuk>h3{margin-top:0}
.card.yolculuk .callout{margin:14px 0}
.card.persona{margin:8px 0 12px;padding:14px 16px}
.card.persona .kv dd{min-width:0;overflow-wrap:anywhere}
.doc-links{margin-top:12px}
#d-sehir svg{min-width:780px}
"""

# ------------------------------------------------------------------ PAGE
SECS = []


def sec(**kw):
    SECS.append(kw)


sec(
    id="kapak",
    html_top=kapak_html(),
    title="Bir bakışta KodKent",
    intro="<p>Aşağıdaki dört sayı KANON'un \"Sayfa kapak sayıları\" tablosundan (§12.4) gelir ve tüm belgelerde aynıdır. Bölümler sırayla vizyondan ürün stratejisine ilerler.</p>",
    html_before=stats_html(),
)
sec(
    id="vizyon",
    title="Vizyon ve oyuncu fantezisi",
    intro="<p>Kapaktaki vaadin oyuncu için ne anlama geldiği üç katmanda anlatılır: yetkinlik, mülkiyet ve statü. Oyuncu ders bitirmez, semt fetheder (VİZYON §2).</p>",
    sources=[{"file": VIZ, "from": "## 2.", "to": "## 3.", "skip_heading": True}],
)
sec(
    id="izlenebilirlik",
    title="Kurucu fikrinden ürüne",
    intro="<p>Kurucunun özgün fikri on öğeden oluşuyordu. Tablo her öğenin oyundaki karşılığını ve nerede ayrıntılandığını gösterir; hiçbir öğe düşmemiştir, yalnızca telefon kaydı v2 kararıyla e-Devlet yaş doğrulamasıyla genişlemiştir.</p>",
    html_before=izlenebilirlik_html(),
)
sec(
    id="cekirdek-dongu",
    title="Çekirdek döngü",
    intro="<p>Oyunun omurgası altı adımlı bir döngüdür; her adım bir sonrakine ödüllü bir köprüyle bağlanır. Aşağıda önce halka, sonra her adımın yeri, süresi ve ödülü, en sonda döngünün en derin adımı olan işletme kurmanın alt akışı gelir.</p>",
    js=DONGU_JS,
    parts=[
        {"html": DONGU_FIG},
        {"file": VIZ, "from": "## 3.", "to": "## 4.", "skip_heading": True},
        {"html": ALT_AKIS_FIG},
    ],
)
sec(
    id="ilk-30-dakika",
    title="İlk 30 dakika",
    intro="<p>Her satır bir dakika aralığını, o sırada açılan ekranı ya da olayı, oyuncunun yaptığını ve aldığı ödülü gösterir; çizelge VİZYON §4'ten aynen alınmıştır.</p>",
    sources=[{"file": VIZ, "from": "## 4.", "to": "## 5.", "skip_heading": True}],
    html_after=YAS_NOTU,
)
sec(
    id="dunya",
    title="Dünya: şehir, semtler ve Ustalar",
    intro="<p>Şehir, Derleyici Meydanı'ndan dışa açılan yedi semttir; her semtin bir Ustası, bir Semt Sınavı ve bir tier'ı vardır. Önce kroki ve semt tablosu, sonra yedi Usta, ardından B1'in makro planı, Akademi, Oyuncu Odası ve işletme arsaları gelir. Uzun anlatımlar kapalı başlıklar altındadır.</p>",
    js=SEHIR_JS.replace("%%D%%", jsj(sehir_veri())),
    parts=[
        {"html": sehir_html()},
        {"file": KANON, "from": "### 2.1", "to": "### 2.2", "demote": 0},
        {"file": KANON, "from": "### 2.2", "to": "## 3.", "demote": 0},
        {"file": B1, "from": "## 2.", "to": "## 3.", "collapse_over": 2000},
        {"file": B1, "from": "## 3.", "to": "## 4.", "collapse_over": 800},
        {"file": B1, "from": "## 4.", "to": "## 5.", "collapse_over": 1200},
        {"file": B1, "from": "## 5.", "to": "## 6.", "collapse_over": 1500},
        {"file": B1, "from": "## 6.", "to": "## 7.", "collapse_over": 2000},
        {"file": B1, "from": "## 8.", "to": "## 9.", "collapse_over": 2000},
    ],
)
sec(
    id="ilerleme",
    title="İlerleme: XP, unvanlar ve kilitler",
    intro="<p>Oyuncunun ilerlemesi üç şeyle ölçülür: XP eğrisiyle seviye (1–60), unvan bantlarıyla semt kimliği ve kilit zinciriyle açılan içerik. Eğri KANON'dur; B2 tam 1–60 tablosunu, süre varsayımlarını ve XP kaynaklarını verir.</p>",
    js=KILIT_JS,
    parts=[
        {"file": B2, "from": "## 2.", "to": "## 3.", "collapse_over": 7000},
        {"file": B2, "from": "## 3.", "to": "## 4."},
        {"file": B2, "from": "## 4.", "to": "## 5.", "collapse_over": 2800},
        {"html": KILIT_FIG},
    ],
)
sec(
    id="ekonomi",
    title="Ekonomi: Bayt, işletmeler ve Çip",
    intro="<p>Ekonomi bir musluk-lavabo sistemidir: Bayt yalnızca çalışan koddan ve öğrenme eylemlerinden akar; tapu, yükseltme ve kozmetik olarak harcanır. Önce akış şeması, sonra B2'nin musluk ve gider tabloları, işletme gelir kataloğu, pasif gelir formülü, kozmetik fiyatları, Çip ilkeleri, enflasyon önlemleri ve 30 günlük simülasyon gelir.</p>",
    js=EKO_JS_FILLED + "\n" + SIM_JS,
    parts=[
        {"html": EKO_FIG},
        {"file": B2, "from": "## 5.", "to": "## 6.", "collapse_over": 2500},
        {"file": B2, "from": "## 6.", "to": "## 7.", "collapse_over": 2500},
        {"file": B2, "from": "## 7.", "to": "## 8.", "collapse_over": 4000},
        {"file": B2, "from": "## 8.", "to": "## 9.", "collapse_over": 3000},
        {"file": B2, "from": "## 9.", "to": "## 10.", "collapse_over": 3000},
        {"file": B2, "from": "## 10.", "to": "## 11.", "collapse_over": 1500},
        {"file": B2, "from": "## 11.", "to": "### 11.1"},
        {"html": SIM_FIG},
        {"file": B2, "from": "### 11.1", "to": "## 12.", "top": 2, "collapse_over": 2200},
    ],
)
sec(
    id="ogrenme",
    title="Öğrenme sistemi (özet)",
    intro="<p>Ders anatomisi, dört soru tipi, Kurul ve Usta ayrımı, ipucu merdiveni ve itiraz akışı özet düzeyde verilir; uzun alt bölümler kapalıdır. Müfredatın kendisi ve teknik hat başka sayfalardadır.</p>",
    js=PRIMM_JS,
    parts=[
        {"html": PRIMM_FIG},
        {"file": B3, "from": "## 0.", "to": "## 1."},
        {"file": B3, "from": "## 2.", "to": "## 3.", "collapse_over": 1800},
        {"html": qcards_html()},
        {"file": B3, "from": "## 3.", "to": "## 4.", "collapse_over": 3000},
        {"file": B3, "from": "## 4.", "to": "## 5.", "collapse_over": 1500},
        {"file": B3, "from": "### 8.1", "to": "### 8.2", "demote": 0, "top": 2, "collapse_over": 3000},
        {"file": B3, "from": "### 6.5", "to": "### 6.6", "demote": 0, "top": 2, "collapse_over": 3000},
        {"file": B3, "from": "### 9.2", "to": "### 9.3", "demote": 0, "top": 2, "collapse_over": 2000},
        {"html": ORGENME_BAGLANTI},
    ],
)
sec(
    id="isletmeler",
    title="İşletmeler (özet)",
    intro="<p>20 işletme tek tabloda: semt, açılış seviyesi, fiyat, seviye sayısı ve L1'in öğrettiği konu (KANON §5). Otopark kanonik ilk işletmedir; yolculuğu aşağıdaki kutuda Hasan Abi'nin cümlesinden Sözleşme Kartı'na kadar anlatılır.</p>",
    parts=[
        {"file": KANON, "from": "## 5.", "to": "### 5.1", "skip_heading": True},
        {"html": YOLCULUK_AC},
        {"md": K51_A, "id_prefix": "kanon-"},
        {"html": ANOMALI},
        {"md": K51_B, "id_prefix": "kanon-"},
        {"html": YOLCULUK_KAPAT},
    ],
)
sec(
    id="gorevler",
    title="Görevler ve canlı operasyon",
    intro="<p>Görev tipleri, ödül formülü ve 61 görevlik katalog; Günlük Tekrar ile seri; haftalık etkinlik ritmi, aylık perde ve sezon yapısı (B6 §2–§4). Haftalık ritim aşağıda ızgara olarak da okunur.</p>",
    parts=[
        {"file": B6, "from": "## 2.", "to": "## 3.", "collapse_over": 4000},
        {"file": B6, "from": "## 3.", "to": "## 4.", "collapse_over": 2500},
        {"file": B6, "from": "## 4.", "to": "## 5.", "collapse_over": 2600},
    ],
)
sec(
    id="sosyal",
    title="Sosyal katman",
    intro="<p>Oda ziyareti, Alkış ve Vitrin; sohbet ve moderasyon basamakları ile 15–17 yaş güvenli modu; Liderlik Panosu ve ligler; Kod Düellosu, Arena, akran incelemesi ve Kalfa Yardımı (B6 §6–§9).</p>",
    parts=[
        {"file": B6, "from": "## 6.", "to": "## 7.", "collapse_over": 2000},
        {"file": B6, "from": "## 7.", "to": "## 8.", "collapse_over": 3500},
        {"file": B6, "from": "## 8.", "to": "## 9.", "collapse_over": 3000},
        {"file": B6, "from": "## 9.", "to": "## 10.", "collapse_over": 3500},
    ],
)
sec(
    id="urun",
    title="Ürün stratejisi, yol haritası ve risk",
    intro="<p>Rakipler ve konum, üç persona, MVP kapsamı, 52 haftalık yol haritası, ekip ve bütçe, hukuki uyum, KPI'lar ve risk kaydı (B9). Gantt grafiği yol haritasının sonundadır; risk kaydında önem rozetleri kullanılır.</p>",
    js="",
    parts=[
        {"file": B9, "from": "## 1.", "to": "## 2.", "collapse_over": 7000},
        {"file": B9, "from": "## 2.", "to": "## 3.", "collapse_over": 7000},
        {"file": B9, "from": "## 3.", "to": "## 4.", "collapse_over": 4000},
        {"file": B9, "from": "## 4.", "to": "## 5.", "collapse_over": 3000},
        {"file": B9, "from": "## 5.", "to": "## 6.", "collapse_over": 2500},
        {"file": B9, "from": "## 6.", "to": "## 7.", "collapse_over": 4000},
        {"html": HUKUKI_NOT},
        {"file": B9, "from": "## 8.", "to": "## 9.", "collapse_over": 2500},
        {"file": B9, "from": "## 9.", "to": "## 10.", "collapse_over": 2500},
        {"file": B9, "from": "## 10.", "to": "## 11.", "collapse_over": 9000},
    ],
)
sec(
    id="kaynaklar",
    title="Kaynak belgeler, açık sorular ve sözlük",
    intro="<p>Bu sayfanın dayandığı belgeler, kurucu kararı bekleyen açık sorular ve KANON sözlüğünden seçilen 20 terim.</p>",
    parts=[
        {"html": kaynaklar_html()},
        {"html": ACIK_SORU_GIRIS},
        {"file": KANON, "from": "### 12.6", "to": "### 12.7", "skip_heading": True},
        {"html": sozluk_html()},
    ],
)

PAGE = {
    "hooks": [hook_timeline, hook_semt, hook_xp_egri, hook_hafta, hook_persona, hook_gantt, hook_risk],
    "reserved_ids": [
        "yas-notu", "isletme-alt-akisi", "ustalar", "kilit-zinciri", "primm-semasi", "soru-tipi-kartlari", "d-hafta", "otopark-yolculugu", "hukuki-not",
        "kaynak-belgeler", "acik-sorular", "sozluk", "d-dongu", "d-isletme-akis", "d-sehir", "d-kilit", "d-ekonomi", "d-primm", "c-xp", "c-sim", "c-gantt",
    ],
    "css": CSS,
    "sections": SECS,
}
