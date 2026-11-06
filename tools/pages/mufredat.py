"""KodKent Müfredat ve İşletmeler sayfası: PAGE bildirimi (python tools/build_page.py mufredat).

Metin spec'ten AYNEN gelir (B3, B4, B5, KANON); bu dosya yalnızca (a) hangi bölümün nereden alınacağını, (b) tablolardan
türetilen veri görsellerini (metro, ders tablosu, grafikler, kartlar) ve (c) bölüm girişlerini tanımlar.
"""
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import make_skeleton as ms  # noqa: E402
import md2html as M  # noqa: E402

B3, B4, B5, KANON = "B3-egitim-ai.md", "B4-mufredat.md", "B5-isletmeler-kod.md", "KANON.md"
SEMTLER = ["Çarşı", "Liman", "Atölyeler", "Kampüs", "Finans Bölgesi", "Veri Vadisi", "Bulut Tepesi"]
HAT_RENK = ["s1", "s2", "s3", "s4", "s5", "s6", "fg-2"]  # 7 hat = 7 semt: --s1..--s6 + ek ton (--fg-2)


def jsj(o):
    return json.dumps(o, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def tmpl(s, **kv):
    for k, v in kv.items():
        s = s.replace("%%" + k + "%%", v)
    return s


def tr_upper(s):
    return s.replace("i", "İ").replace("ı", "I").upper()


def fmt_tr(n, d=0):
    s = f"{n:,.{d}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


# ------------------------------------------------------------------ veri: spec tablolarından
def tbl(path, a, b, first_headers):
    for t in M.tables(M.extract(path, a, b)):
        if t.headers[: len(first_headers)] == first_headers:
            return t
    raise SystemExit(f"tablo bulunamadı: {path} {a} {first_headers}")


t_harita = tbl(B4, "## 2.", "## 3.", ["M", "Ad"])
t_dk = tbl(B4, "## 11.", "## 12.", ["Modül", "Kısa ad", "Ders"])
t_xp = tbl(B4, "## 11.", "## 12.", ["Modül", "Kısa ad", "Toplam XP"])
t_biz = tbl(B5, "## 2.", "## 3.", ["#", "İşletme (slug)"])
KISA = {r[0]: r[1] for r in t_dk.rows}

MODULES = []
for r in t_harita.rows:
    m, ad, su, tier, dersler, adet, zincir = r[:7]
    mm = re.match(r"(.+?) \((.+)\)$", su)
    chains = []
    for part in zincir.split(" · "):
        mc = re.match(r"(.+?)\s+(\d+\.\d+–\d+\.\d+)$", part.strip())
        chains.append((mc.group(1), mc.group(2)))
    MODULES.append(dict(m=m, ad=ad, semt=mm.group(1), usta=mm.group(2), tier=tier, dersler=dersler, adet=int(adet), zincir=chains))

DERSLER = []  # [id, başlık, [hedefler], ön koşul, semt, tier, xp, dk, soru karışımı, bağlı işletme, modül]
for t in M.tables(M.extract(B4, "## 3.", "## 4.")):
    if t.headers[:2] != ["id", "başlık"]:
        continue
    mcode = re.match(r"(M\d+) —", t.heading).group(1)
    for raw, pl in zip(t.raw_rows, t.rows):
        goals = [g.strip().rstrip(";").strip() for g in re.split(r"\(\d\)\s*", raw[2]) if g.strip()]
        DERSLER.append([pl[0], raw[1], goals, raw[3], pl[4], pl[5], M.parse_num(pl[6]), M.parse_num(pl[7]), pl[8], raw[9], mcode])

_b4_0 = M.extract(B4, "## 0.", "## 1.")
_m = re.search(r"ders \+ görev \+ sınav ([\d.]+) dk \(([\d,]+) sa\)", _b4_0)
TOPLAM_DK, TOPLAM_SA = _m.group(1), _m.group(2)
XP_TOPLAM = re.search(r"müfredat XP'si (\d{1,3}(?:\.\d{3})+|\d+)", _b4_0).group(1)
N_MOD, N_DERS, N_BIZ = len(MODULES), len(DERSLER), len(t_biz.rows)
N_SEVIYE = sum(M.parse_num(r[5]) for r in t_biz.rows)
_b5 = re.search(r"(\d+) seviye başlığı", M.extract(B5, "## 0.", "## 1.") + " " + M.extract(B5, "### 2.1", "### 2.2"))
if _b5 and int(_b5.group(1)) != N_SEVIYE:
    print(f"UYARI: B5 metni {_b5.group(1)} seviye diyor, tablo toplamı {N_SEVIYE}", file=sys.stderr)
if N_DERS != 100 or N_MOD != 11 or N_BIZ != 20:
    print(f"UYARI: beklenmeyen sayılar: {N_MOD} modül, {N_DERS} ders, {N_BIZ} işletme", file=sys.stderr)


# ------------------------------------------------------------------ 1. kapak
def kapak_html():
    svg = ms.logo_svg()
    return (
        f'<div class="cover"><div class="logo-lg">{svg}<span class="eyebrow">Belge 3 · Müfredat ve işletmeler</span></div>'
        '<h1>KodKent Müfredat ve İşletmeler</h1><p class="slogan">Oyunlarla yazılım öğreniyorum.</p>'
        '<p class="sub">Kod yaz, şehrini kur. Bu belge o şehri kuran müfredatı ve işletmeleri toplar: modüller, dersler, soru tipleri, '
        'Ders Mührü ve Günlük Tekrar, 20 işletmelik kod projeleri kataloğu ve Otopark\'ın tam ayrıntısı.</p></div>'
        '<div class="docbox"><p><strong>Bu belge ne anlatır, kim okumalı.</strong> İçerik ekibi, eğitmenler ve challenge yazarları için: '
        'C# müfredatını (B4), eğitim ve yapay zekâ öğretmen sistemini (B3) ve işletme kod projelerini (B5) tek sayfada okunur hâle getirir. '
        'Metinler spec belgelerinden aynen alınmıştır; sayılar KANON ile birebir tutarlıdır. Uzun bölümler kapalı başlıklar altındadır.</p></div>'
    )


def stat(v, l):
    return f'<div class="stat"><div class="v">{v}</div><div class="l">{l}</div></div>'


def stats_html():
    return (
        '<div class="grid stats">'
        + stat(N_MOD, "modül")
        + stat(N_DERS, "ders")
        + stat(f"{TOPLAM_SA} sa", f"toplam süre (ders + görev + sınav; {TOPLAM_DK} dk)")
        + stat(N_BIZ, "işletme")
        + stat(N_SEVIYE, f"challenge (işletme seviyesi; {N_BIZ} işletme)")
        + stat(XP_TOPLAM, "XP: tek seferlik müfredat")
        + "</div>"
    )


# ------------------------------------------------------------------ 2. metro
def metro_lines(W=880, XL=130, XR=730, Y0=60, DY=72, DIAG=70):
    interiors = []
    for k, semt in enumerate(SEMTLER):
        st = []
        for mod in [m for m in MODULES if m["semt"] == semt]:
            st.append(dict(label=f'{mod["m"]} {KISA[mod["m"]]}', kind=None))
            for ad, ar in mod["zincir"]:
                st.append(dict(label=f'{ad.replace(" Platformu", "")} {ar}', kind="is"))
        st.append(dict(label=f"{semt} Sınavı", kind="altin" if k == len(SEMTLER) - 1 else "aktar"))
        interiors.append(st)
    lines, prev = [], None
    for r, st in enumerate(interiors):
        y, ltr, n = Y0 + r * DY, r % 2 == 0, len(st)
        a, b = (XL, XR) if r == 0 else ((XL + DIAG, XR) if ltr else (XR - DIAG, XL))
        xs = [a + j * (b - a) / (n - 1) for j in range(n)]
        side = [None] * n
        side[n - 1] = "up"
        for j in range(n - 2, -1, -1):
            side[j] = "dn" if side[j + 1] == "up" else "up"
        stops = [dict(x=prev[0], y=prev[1], kind="aktar")] if prev else []
        for j, (s, x) in enumerate(zip(st, xs)):
            o = dict(x=round(x), y=y, label=s["label"], dx=0, anchor="middle", dy=-16 if side[j] == "up" else 28)
            if s["kind"]:
                o["kind"] = s["kind"]
            if j == 0 and r > 0 and side[j] == "up":  # gelen çapraz hattan uzaklaş
                o["anchor"], o["dx"] = ("end", 8) if not ltr else ("start", -8)
            stops.append(o)
        prev = (stops[-1]["x"], y)
        name = tr_upper(SEMTLER[r])
        lines.append(dict(name=name, color=HAT_RENK[r], stops=stops, nx=18 if ltr else -round(len(name) * 8.6 + 18), ny=4))
    return W, Y0 + (len(SEMTLER) - 1) * DY + 50, lines


def metro_html():
    return (
        '<figure><div id="d-metro"></div><figcaption>Yedi hat yedi semttir; küçük halkalar modül durakları, amber kareler işletmenin Ruhsat zinciri (ders aralığıyla), '
        'kalın halkalar bir sonraki semte geçiren Semt Sınavıdır. Hatlar Çarşı\'dan Bulut Tepesi\'ne yılan gibi uzanır.</figcaption></figure>'
        '<div class="kk-legend metro-leg"><span class="kk-leg"><i class="dot"></i>Modül durağı</span>'
        '<span class="kk-leg"><i class="sq" style="background:var(--amber)"></i>İşletme açılış noktası (Ruhsat zinciri)</span>'
        '<span class="kk-leg"><i class="ring"></i>Aktarma: Semt Sınavı</span>'
        '<span class="kk-leg"><i class="dot gold"></i>Bulut Tepesi: mezuniyet sınavı</span></div>'
    )


METRO_JS_T = "KK.metro(document.getElementById('d-metro'), {width:%%W%%, height:%%H%%, title:'Metro haritası: 7 semt hattı, 11 modül, 20 işletme', lines:%%LINES%%});"


# ------------------------------------------------------------------ 3. ders tablosu
FILTER_HTML = """
<div class="filters" role="search">
  <label for="f-modul">Modül<select id="f-modul"></select></label>
  <label for="f-semt">Semt<select id="f-semt"></select></label>
  <label for="f-ara">Ara<input id="f-ara" type="search" placeholder="başlık, hedef, işletme…" autocomplete="off"></label>
  <button type="button" id="f-temizle" class="btn-lite">Süzgeçleri temizle</button>
</div>
<p id="f-sayac" class="muted" aria-live="polite"></p>
<div class="tablewrap"><table id="t-dersler">
<thead><tr><th>id</th><th>başlık</th><th>öğrenme hedefleri</th><th>ön koşul</th><th>semt</th><th class="num">XP</th><th class="num">dk</th><th>soru tipi karışımı</th><th>bağlı işletme / seviye</th></tr></thead>
<tbody id="t-dersler-body"></tbody></table></div>
"""

DERS_JS_T = r"""
const MODS = %%MODS%%, DERS = %%DERS%%, SEMTLER = %%SEMTLER%%;
const QT = {K:['accent','Kavram Sorusu'], 'Ç':['cobalt','Çıktı Tahmini'], H:['coral','Hata Avı'], Y:['violet','Kod Yazma']};
const esc = KK.esc, md = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const fold = s => String(s).toLocaleLowerCase('tr').replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u');
const modOf = k => MODS.find(m => m[0] === k);
const semtNo = s => SEMTLER.indexOf(s) + 1;
const fm = document.getElementById('f-modul'), fs = document.getElementById('f-semt'), fa = document.getElementById('f-ara'), cnt = document.getElementById('f-sayac'), body = document.getElementById('t-dersler-body');
fm.innerHTML = '<option value="">Tüm modüller (' + MODS.length + ')</option>' + MODS.map(m => `<option value="${m[0]}">${m[0]} · ${esc(m[1])}</option>`).join('');
fs.innerHTML = '<option value="">Tüm semtler (' + SEMTLER.length + ')</option>' + SEMTLER.map(s => `<option>${esc(s)}</option>`).join('');
const qm = q => q.split(',').map(c => { const t = QT[c] || ['n', c]; return `<span class="badge ${t[0]}" title="${esc(t[1])}">${esc(c)}</span>`; }).join(' ');
body.innerHTML = DERS.map((d, i) => {
  const m = modOf(d[10]);
  return `<tr class="ders" data-i="${i}" tabindex="0" role="button" aria-expanded="false" aria-controls="det-${i}">` +
    `<td class="id"><strong>${esc(d[0])}</strong></td><td>${md(d[1])}</td>` +
    `<td class="hedef"><div>${md(d[2].map((g, k) => (k + 1) + ') ' + g).join('; '))}</div></td><td>${md(d[3])}</td>` +
    `<td><span class="semt" data-s="${semtNo(d[4])}">${esc(d[4])} <small>${esc(d[5])}</small></span></td>` +
    `<td class="num">${KK.fmt(d[6])}</td><td class="num">${KK.fmt(d[7])}</td><td class="qt">${qm(d[8])}</td><td class="bag">${md(d[9])}</td></tr>` +
    `<tr class="detay" id="det-${i}" hidden><td colspan="9"><div class="detay-in"><dl class="kv">` +
    `<dt>Modül</dt><dd>${esc(m[0])} · ${esc(m[1])} <span class="muted">(${esc(m[2])}, ${esc(m[3])}, Usta ${esc(m[4])})</span></dd>` +
    `<dt>Öğrenme hedefleri</dt><dd><ol class="hedefler">${d[2].map(g => '<li>' + md(g) + '</li>').join('')}</ol></dd>` +
    `<dt>Ön koşul</dt><dd>${md(d[3])}</dd><dt>Soru tipleri</dt><dd>${d[8].split(',').map(c => esc((QT[c] || [0, c])[1])).join(' · ')}</dd>` +
    `<dt>Bağlı işletme</dt><dd>${md(d[9])}</dd><dt>Süre ve XP</dt><dd>${KK.fmt(d[7])} dk · ${KK.fmt(d[6])} XP</dd></dl></div></td></tr>`;
}).join('');
const rows = [...body.querySelectorAll('tr.ders')], dets = [...body.querySelectorAll('tr.detay')];
const hay = DERS.map(d => fold([d[0], d[1], d[2].join(' '), d[3], d[4], d[5], d[8], d[9], d[10]].join(' ')));
function apply() {
  const mod = fm.value, semt = fs.value, q = fold(fa.value.trim()).split(/\s+/).filter(Boolean);
  let n = 0, dk = 0, xp = 0;
  rows.forEach((tr, i) => {
    const d = DERS[i], ok = (!mod || d[10] === mod) && (!semt || d[4] === semt) && q.every(w => hay[i].includes(w));
    tr.hidden = !ok; if (!ok) dets[i].hidden = true; else dets[i].hidden = tr.getAttribute('aria-expanded') !== 'true';
    if (ok) { n++; dk += d[7]; xp += d[6]; }
  });
  cnt.textContent = n ? `${n} / ${DERS.length} ders · ${KK.fmt(dk)} dk · ${KK.fmt(xp)} XP` : 'Eşleşen ders yok; süzgeçleri gevşetin.';
}
function toggle(tr) { const open = tr.getAttribute('aria-expanded') !== 'true'; tr.setAttribute('aria-expanded', open); dets[+tr.dataset.i].hidden = !open; }
body.addEventListener('click', e => { const tr = e.target.closest('tr.ders'); if (tr) toggle(tr); });
body.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tr.ders')) { e.preventDefault(); toggle(e.target); } });
[fm, fs].forEach(x => x.addEventListener('change', apply)); fa.addEventListener('input', apply);
document.getElementById('f-temizle').addEventListener('click', () => { fm.value = ''; fs.value = ''; fa.value = ''; apply(); });
apply();
"""


# ------------------------------------------------------------------ 4. zorluk eğrisi (tablo -> grafik kancası)
def _ids_at(vals, labels, target):
    return [l for v, l in zip(vals, labels) if v == target]


def _chart_fig(cid, labels, vals, name, ylab, unit, title, claim):
    key = " · ".join(f"{m} {KISA[m]}" for m in labels)
    html = f'<figure><div id="{cid}"></div><figcaption>{claim} Modül anahtarı: {M.esc(key)}.</figcaption></figure>'
    js = (
        f"KK.barChart(document.getElementById('{cid}'), {{labels:{jsj(labels)}, series:[{{name:{jsj(name)}, values:{jsj(vals)}}}], "
        f"yLabel:{jsj(ylab)}, format:v => KK.fmt(v, Number.isInteger(v) ? 0 : 1) + {jsj(unit)}, height:280, title:{jsj(title)}}});"
    )
    return html, js


def hook_zorluk(headers, rows):
    if headers[:2] != ["Modül", "Kısa ad"]:
        return None
    labels = [r[0] for r in rows]
    if headers[-1] == "Ort. dk":
        v = [M.parse_num(r[-1]) for r in rows]
        lo, hi = min(v), max(v)
        claim = (f"Ortalama ders süresi {fmt_tr(lo, 1)} dk ({', '.join(_ids_at(v, labels, lo))}) ile {fmt_tr(hi, 1)} dk "
                 f"({', '.join(_ids_at(v, labels, hi))}) arasında, semt semt uzar.")
        return _chart_fig("c-dk", labels, v, "Ortalama ders süresi", "dk / ders", " dk", "Modül bazında ortalama ders süresi (dk)", claim)
    if headers[-1] == "Ort. XP":
        v = [M.parse_num(r[-1]) for r in rows]
        lo, hi = min(v), max(v)
        claim = (f"Ders başına ortalama XP {fmt_tr(lo)} ({', '.join(_ids_at(v, labels, lo))}) ile {fmt_tr(hi)} "
                 f"({', '.join(_ids_at(v, labels, hi))}) arasında; tier ile birlikte basamak basamak artar.")
        return _chart_fig("c-xp", labels, v, "Ortalama ders XP'si", "XP / ders", " XP", "Modül bazında ortalama ders XP'si", claim)
    return None


# ------------------------------------------------------------------ 6. Mühür / Telafi / Günlük Tekrar akış diyagramı
MUHUR_JS = r"""
KK.flow(document.getElementById('d-muhur'), {width:980, height:450, title:'Ders Mührü kararı, Telafi Turu ve 1-3-7-21 tekrar takvimi',
 groups:[{x:10,y:8,w:960,h:252,tone:'cobalt',label:'Ders Mührü ve Telafi Turu'},{x:10,y:290,w:960,h:152,tone:'accent',label:'Günlük Tekrar'}],
 nodes:[
  {id:'kart',x:30,y:100,w:120,h:60,label:'Kartlar',sub:'Tahmin et → Yap'},
  {id:'soru',x:215,y:100,w:140,h:60,label:'S1 → S2 → S3',sub:'soru başına 2 deneme'},
  {id:'deg',x:420,y:100,w:140,h:60,label:'Değerlendir',sub:'3 sorudan ikisi 70 ve üstü mü?',tone:'amber'},
  {id:'muh',x:690,y:30,w:240,h:56,label:'Muhurlu',sub:'görev açılır, takvim başlar',tone:'mint'},
  {id:'tel',x:690,y:102,w:240,h:56,label:'TelafiBekliyor',sub:'10 dk sonra, farklı 3 soru; sınırsız',tone:'coral'},
  {id:'pua',x:690,y:174,w:240,h:56,label:'PuanBekliyor',sub:'günlük kota doldu; gece Batch ile puanlanır',tone:'violet'},
  {id:'t0',x:80,y:340,w:150,h:56,label:'T0',sub:'mühür günü',tone:'cobalt',shape:'pill'},
  {id:'p1',x:280,y:340,w:130,h:56,label:'+1 gün',tone:'accent',shape:'pill'},
  {id:'p3',x:450,y:340,w:130,h:56,label:'+3 gün',tone:'accent',shape:'pill'},
  {id:'p7',x:620,y:340,w:150,h:56,label:'+7 gün',sub:'3 doğru: altın',tone:'accent',shape:'pill'},
  {id:'p21',x:810,y:340,w:150,h:56,label:'+21 gün',sub:'altın: bakım sorusu',tone:'amber',shape:'pill'}],
 edges:[
  {from:'kart',to:'soru',label:'sırayla'},
  {from:'soru',to:'deg',label:'3 puan'},
  {from:'deg',to:'muh',label:'≥ 70: iki soru',tone:'mint'},
  {from:'deg',to:'tel',label:'< 70: iki soru',tone:'coral'},
  {from:'deg',to:'pua',label:'puan yok (kota)',tone:'violet'},
  {from:'muh',to:'t0',label:'takvim başlar',tone:'mint',fromSide:'r',toSide:'t',via:[[950,58],[950,275],[155,275]]},
  {from:'t0',to:'p1'},{from:'p1',to:'p3'},{from:'p3',to:'p7'},{from:'p7',to:'p21'},
  {from:'p7',to:'t0',dashed:true,tone:'coral',label:'yanlış: T0 = bugün',fromSide:'b',toSide:'b'}]});
"""


# ------------------------------------------------------------------ 7. işletme kartları (B5 §2.1 tablosu -> kart ızgarası)
def hook_isletme_kartlari(headers, rows, ctx):
    if headers[:2] != ["#", "İşletme (slug)"]:
        return None
    cards = []
    for r in ctx["raw_rows"]:
        no, ad, semt, sev, fiyat, seviye, l1, npc, konu = [c.strip() for c in r[:9]]
        sname = M.strip_md(semt).split(" (")[0]
        tier = re.search(r"\((T[\d–]+)\)", semt)
        sn = SEMTLER.index(sname) + 1 if sname in SEMTLER else 0
        cards.append(
            f'<article class="card biz"><div class="biz-h"><span class="semt" data-s="{sn}">{M.esc(sname)}'
            f'{" <small>" + tier.group(1) + "</small>" if tier else ""}</span><span class="badge">#{M.esc(no)}</span></div>'
            f'<p class="biz-ad">{M.inline(ad)}</p><dl class="kv"><dt>Açılış</dt><dd>Sev. {M.inline(sev)} · {M.inline(fiyat)} B</dd>'
            f'<dt>Seviye</dt><dd>{M.inline(seviye)} seviye · L1 {M.inline(l1)} B/gün</dd><dt>Müşteri</dt><dd>{M.inline(npc)}</dd>'
            f'<dt>L1 konusu</dt><dd>{M.inline(konu)}</dd></dl></article>'
        )
    html = (
        '<div class="grid biz-grid">' + "".join(cards) + "</div>"
        '<details class="acc"><summary>Tablo görünümü: 20 işletme</summary>' + M.table_html(ctx["raw_headers"], ctx["raw_rows"]) + "</details>"
    )
    return html, ""


# ------------------------------------------------------------------ 8. Otopark ücret kademesi (KANON §5.1)
def otopark_ucret(m):
    if m <= 0:
        return 0
    saat = (m + 59) // 60
    if m < 120:
        return saat * 100
    if m <= 360:
        return saat * 40
    return ((m + 1439) // 1440) * 250


def kanon_test_noktalari():
    """KANON §5.1 'Dakika | TL | Tür' tablosundan (dakika, TL) çiftleri."""
    t = next(t for t in M.tables(M.extract(KANON, "### 5.1", "## 6.")) if t.headers[:2] == ["Dakika", "TL"])
    pairs = []
    for r in t.rows:
        dk, tl = r[0].split(" / "), r[1].split(" / ")
        pairs += list(zip([int(M.parse_num(x)) for x in dk], [int(M.parse_num(x)) for x in tl]))
    return pairs


TESTLER = kanon_test_noktalari()
_yanlis = [(m, tl, otopark_ucret(m)) for m, tl in TESTLER if otopark_ucret(m) != tl]
if _yanlis:
    raise SystemExit(f"KANON §5.1 testleri ile ücret fonksiyonu uyuşmuyor: {_yanlis}")


def adim_noktalari(xmax):
    pts, prev = [], None
    for m in range(0, xmax + 1):
        v = otopark_ucret(m)
        if v != prev:
            pts.append([m, v])
            prev = v
    pts.append([xmax, otopark_ucret(xmax)])  # eksen sonu
    return pts


UCRET_FIG = (
    '<figure><div id="c-ucret"></div><figcaption>Ücret süreyle düzgün artmaz: 2 saatte (120 dk) 80 TL\'ye <em>düşer</em>, 6 saati (360 dk) aşınca '
    'günlüğe geçer, her başlayan gün 250 TL ekler. Noktalar KANON §5.1\'in %d testiyle doğrulanmış kuraldan türetilmiştir.</figcaption></figure>'
    '<figure><div id="c-ucret-zoom"></div><figcaption>İlk 12 saatin yakın görünümü: 119 dk 200 TL, 120 dk 80 TL öder.</figcaption></figure>'
    '<div class="callout amber"><p><strong>Anomali (Sözleşme madde 6).</strong> 119 dakika kalan 200 TL, 120 dakika kalan 80 TL öder. '
    'Bu, müşterinin bilinçli kararıdır; fark eden oyuncu <strong>Keskin Göz</strong> rozetiyle +50 XP kazanır.</p></div>'
) % len(TESTLER)

UCRET_JS = (
    "KK.stepChart(document.getElementById('c-ucret'), {points:%s, xLabel:'kalış süresi (dk)', yLabel:'ücret (TL)', "
    "format:v => KK.fmt(v, Number.isInteger(v) ? 0 : 1) + ' TL', xFormat:v => KK.fmt(v) + ' dk', height:300, "
    "title:'Otopark ücret kademesi, 0 ile 1500 dakika', marks:[{x:120,label:'2 sa'},{x:360,label:'6 sa'},{x:1440,label:'24 sa'}]});\n"
    "KK.stepChart(document.getElementById('c-ucret-zoom'), {points:%s, xLabel:'kalış süresi (dk)', yLabel:'ücret (TL)', "
    "format:v => KK.fmt(v, Number.isInteger(v) ? 0 : 1) + ' TL', xFormat:v => KK.fmt(v) + ' dk', height:280, "
    "title:'Otopark ücret kademesi, ilk 12 saat; 119 dakikada 200 TL, 120 dakikada 80 TL', marks:[{x:120,label:'2 sa: 200→80'},{x:360,label:'6 sa'}]});"
) % (jsj(adim_noktalari(1500)), jsj(adim_noktalari(720)))


# ------------------------------------------------------------------ bölüm 11 yardımcı HTML
KAYNAKLAR = """
<h3 id="kaynak-belgeler">Kaynak belgeler</h3>
<ul class="src-list">
<li><strong>B3</strong> Eğitim Sistemi ve Yapay Zekâ Öğretmen: soru tipleri (§3), Kurul Kartı ve Sokratik takip (§4), içerik üretim pipeline'ı (§12).</li>
<li><strong>B4</strong> C# Müfredatı: modül haritası (§2), ders tabloları (§3), Çarşı 1.1–1.4 (§4), Ders Mührü, Semt Sınavları, Günlük Tekrar (§6–§8), kavram eşlemesi (§9), zorluk eğrisi (§11).</li>
<li><strong>B5</strong> İşletmeler ve Kod Projeleri Kataloğu: Challenge Spec (§1), katalog (§2), Otopark (§3), L1 spec'leri (§4–§5), dört yüzey (§6), Müfettiş (§7), kopya (§8), çalıştırma çıktısı (§9).</li>
<li><strong>KANON</strong> Sabitler: adlar, sayılar ve Otopark Sözleşme Kartı (§5.1). Bir belge KANON ile çelişirse KANON geçerlidir.</li>
<li><strong>B2</strong> İlerleme ve ekonomi: XP, Bayt ve işletme geliri (B4 §11 ve B5 §2 rakamlarının kaynağı).</li>
<li><strong>VİZYON</strong> A-vizyon-FINAL: ilk 30 dakika ve Çarşı Ruhsat zinciri.</li>
</ul>
<h3 id="acik-sorular">Açık sorular</h3>
<p>Müfredat (B4) ve işletme kataloğu (B5) için henüz kapanmamış kararlar aşağıdadır; metin spec'ten aynen alınmıştır.</p>
"""

# ------------------------------------------------------------------ sayfa CSS
CSS = """
.filters{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:end;margin:12px 0 6px}
.filters label{display:grid;gap:4px;font-size:13px;color:var(--muted);min-width:0}
.filters select,.filters input{font:inherit;padding:8px 10px;border:1px solid var(--line-2);border-radius:var(--radius);background:var(--surface);color:var(--fg);min-width:170px;max-width:100%}
.filters input{min-width:230px}
.btn-lite{font:inherit;font-weight:600;padding:8px 14px;border:1px solid var(--line-2);border-radius:var(--radius);background:var(--surface-2);color:var(--fg);cursor:pointer}
.btn-lite:hover{background:var(--surface-3)}
#f-sayac{margin:4px 0 8px;font-size:13.5px}
#t-dersler{font-size:13px}
#t-dersler th,#t-dersler td{padding:7px 9px}
#t-dersler td.hedef{min-width:200px;max-width:250px}
#t-dersler td.qt{white-space:nowrap}
#t-dersler td.hedef div{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;color:var(--fg-2)}
#t-dersler td.bag{min-width:170px;max-width:230px}
#t-dersler tr.ders{cursor:pointer}
#t-dersler tr.ders:hover td{background:var(--surface-2)}
#t-dersler tr.ders[aria-expanded="true"] td{background:var(--accent-soft)}
#t-dersler tr.detay td{background:var(--surface-2);padding:12px 16px}
#t-dersler .detay-in{max-width:80ch}
#t-dersler .hedefler{margin:0;padding-left:20px}
#t-dersler .hedefler li{margin:2px 0}
.semt{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;font-weight:600}
.semt::before{content:"";width:10px;height:10px;border-radius:3px;background:var(--c,var(--muted));flex:0 0 auto}
.semt small{font-weight:500;color:var(--muted)}
.semt[data-s="1"],.sem[data-s="1"]{--c:var(--s1)}.semt[data-s="2"]{--c:var(--s2)}.semt[data-s="3"]{--c:var(--s3)}.semt[data-s="4"]{--c:var(--s4)}
.semt[data-s="5"]{--c:var(--s5)}.semt[data-s="6"]{--c:var(--s6)}.semt[data-s="7"]{--c:var(--fg-2)}
.biz-grid{grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin:10px 0 14px}
.card.biz{display:grid;gap:8px;align-content:start;padding:14px 16px}
.biz-h{display:flex;justify-content:space-between;align-items:center;gap:8px}
.biz-ad{margin:0;font-family:var(--font-display);font-size:17px;font-weight:700}
.card.biz .kv{gap:3px 12px;font-size:13.5px}
.card.biz .kv dd{min-width:0;overflow-wrap:anywhere}
.metro-leg .dot{background:var(--surface);border:3px solid var(--fg-2);border-radius:50%;width:10px;height:10px}
.metro-leg .dot.gold{background:var(--amber)}
.metro-leg .ring{background:var(--surface);border:4px solid var(--fg-2);border-radius:50%;width:12px;height:12px}
.metro-leg .sq{border-radius:3px}
#d-metro svg{min-width:760px}
"""

# ------------------------------------------------------------------ PAGE
W_M, H_M, LINES_M = metro_lines()

PAGE = {
    "hooks": [hook_zorluk, hook_isletme_kartlari],
    "reserved_ids": ["ozet-mufredat", "ozet-isletmeler", "f-modul", "f-semt", "f-ara", "f-sayac", "f-temizle", "t-dersler", "t-dersler-body", "d-metro", "d-muhur", "c-dk", "c-xp", "c-ucret", "c-ucret-zoom", "kaynak-belgeler", "acik-sorular"],
    "css": CSS,
    "sections": [
        {
            "id": "kapak",
            "html_top": kapak_html(),
            "title": "Sayılarla müfredat",
            "intro": "<p>Aşağıdaki sayılar B4 ve B5 tablolarından hesaplanır ve KANON ile birebir tutarlıdır; yönetici özetleri spec'ten aynen aktarılmıştır.</p>",
            "html_before": stats_html(),
            "parts": [
                {"html": '<h3 id="ozet-mufredat">Müfredat: yönetici özeti (B4)</h3>'},
                {"file": B4, "from": "## 0.", "to": "## 1.", "skip_heading": True},
                {"html": '<h3 id="ozet-isletmeler">İşletmeler ve kod projeleri: yönetici özeti (B5)</h3>'},
                {"file": B5, "from": "## 0.", "to": "## 1.", "skip_heading": True},
            ],
        },
        {
            "id": "metro",
            "title": "Metro Haritası",
            "intro": "<p>Müfredat bir metro ağı gibi okunur: her semt bir hat, her modül bir durak, her Ruhsat zinciri o hattaki bir işletmenin açılış noktasıdır. Harita B4 §2'deki modül haritasından çizildi.</p>",
            "html_before": metro_html(),
            "js": tmpl(METRO_JS_T, W=str(W_M), H=str(H_M), LINES=jsj(LINES_M)),
            "sources": [{"file": B4, "from": "## 2.", "to": "## 3.", "collapse_over": 2500}],
        },
        {
            "id": "dersler",
            "title": "Modül ve ders tablosu",
            "intro": f"<p>{N_DERS} dersin tamamı B4 §3'teki {N_MOD} modül tablosundan okunur. Modüle, semte ya da sözcüğe göre süzün; hedefleri ve bağlı işletmeyi görmek için satıra tıklayın (ya da Enter'a basın).</p>",
            "html_before": FILTER_HTML,
            "js": tmpl(DERS_JS_T, MODS=jsj([[m["m"], m["ad"], m["semt"], m["tier"], m["usta"]] for m in MODULES]), DERS=jsj(DERSLER), SEMTLER=jsj(SEMTLER)),
            "parts": [
                {"html": '<details class="acc"><summary>Görev Atlası: Çarşı ve Liman prova görevleri</summary>'},
                {"file": B4, "from": "### Görev Atlası", "to": "## 4.", "skip_heading": True, "demote": 1},
                {"html": "</details>"},
                {"file": B4, "from": "## 5.", "to": "## 6."},
            ],
        },
        {
            "id": "zorluk",
            "title": "Zorluk eğrisi",
            "intro": "<p>Ders süresi ve XP semt semt artar. İki büyüklük ayrı grafiklerdedir (çift eksen yok); değerler B4 §11'deki tablolardan gelir, tablo görünümü her grafiğin altındadır.</p>",
            "sources": [{"file": B4, "from": "## 11.", "to": "## 12."}],
        },
        {
            "id": "soru-tipleri",
            "title": "Soru tipleri rehberi",
            "intro": "<p>Dört soru tipi, rubrik ve puan → XP kuralları ile Kurul Kartı ve Sokratik takip B3'ten; Çarşı 1.1–1.4 derslerinin tam içeriği B4 §4'ten gelir. Uzun alt bölümler kapalıdır, başlığa tıklayarak açın.</p>",
            "sources": [
                {"file": B3, "from": "## 3.", "to": "## 4.", "collapse_over": 5000},
                {"file": B3, "from": "## 4.", "to": "## 5."},
                {"file": B4, "from": "## 4.", "to": "## 5.", "collapse_over": 3000},
            ],
        },
        {
            "id": "muhur-tekrar",
            "title": "Ders Mührü, Telafi Turu, Semt Sınavları ve Günlük Tekrar",
            "intro": "<p>Mühür kararı, Telafi Turu ve 1-3-7-21 tekrar takvimi tek akışta özetlenir (B4 §6 ve §8'den çizildi); ardından kurallar, Semt Sınavları ve algoritma spec'ten aynen gelir.</p>",
            "html_before": '<figure><div id="d-muhur"></div><figcaption>Üç sorudan ikisi 70 ve üstüyse Mühür verilir ve takvim başlar; değilse Telafi Turu aynı kavramı farklı sorularla yeniden açar. Yanlış cevap tekrar saatini sıfırlar.</figcaption></figure>',
            "js": MUHUR_JS,
            "sources": [
                {"file": B4, "from": "## 6.", "to": "## 7."},
                {"file": B4, "from": "## 7.", "to": "## 8."},
                {"file": B4, "from": "## 8.", "to": "## 9.", "collapse_over": 3500},
            ],
        },
        {
            "id": "isletmeler",
            "title": "İşletme kataloğu",
            "intro": "<p>20 işletmenin her biri semt, açılış seviyesi, fiyat, seviye sayısı, L1 konusu ve müşteri hikâyesiyle verilir (B5 §2); kavram → işletme eşlemesi B4 §9'dandır. Aynı şemanın dört yüzeyi (Otopark → Manav → Oto Yıkama → Kütüphane) B5 §6'da anlatılır.</p>",
            "sources": [
                {"file": B5, "from": "## 2.", "to": "## 3."},
                {"file": B5, "from": "## 6.", "to": "## 7."},
                {"file": B4, "from": "## 9.", "to": "## 10."},
            ],
        },
        {
            "id": "otopark",
            "title": "Otopark: tam ayrıntı",
            "intro": "<p>Otopark hem katalogun ilk işletmesi hem şemanın örneğidir: Hasan Abi'nin cümlesi birebir, ardından Gereksinim Netleştirme, Sözleşme Kartı, ücret kademesi, kod, testler ve gerçek çalıştırma çıktısı. L2–L5 kapalıdır.</p>",
            "parts": [
                {"file": B5, "from": "## 3.", "to": "### 3.4"},
                {"html": "<h4 id=\"ucret-kademesi\">Ücret kademesi grafiği</h4>" + UCRET_FIG},
                {"file": B5, "from": "### 3.4", "to": "## 4.", "top": 2, "collapse_over": 5000,
                 "collapse": ["### 3.13", "### 3.14", "### 3.15", "### 3.16"]},
                {"file": B5, "from": "## 7.", "to": "## 8."},
                {"file": B5, "from": "## 8.", "to": "## 9."},
                {"file": B5, "from": "## 9.", "to": "## 10.", "terminal": True},
            ],
            "js": UCRET_JS,
        },
        {
            "id": "diger-isletmeler",
            "title": "Diğer işletmelerin L1 spec'leri",
            "intro": "<p>Büfe, Manav ve Kargo Deposu L1 spec'leri tamdır (B5 §4); kalan 16 işletmenin L1 özeti B5 §5'tedir. Her işletme kapalı bir başlıktır.</p>",
            "sources": [
                {"file": B5, "from": "## 4.", "to": "## 5.", "collapse_over": 3000},
                {"file": B5, "from": "## 5.", "to": "## 6.", "collapse_over": 500},
            ],
        },
        {
            "id": "challenge-spec",
            "title": "Challenge Spec formatı",
            "intro": "<p>Her challenge tek bir JSON dosyasıdır. Şema, Otopark L1'in tam örneği, test harness'ı ve içerik yazarının 22 kuralı B5 §1'dedir; içerik CI doğrulayıcısı bu kontrol listesini otomatik uygular.</p>",
            "sources": [{"file": B5, "from": "## 1.", "to": "## 2.", "collapse_over": 4000}],
        },
        {
            "id": "pipeline-kaynaklar",
            "title": "İçerik üretim pipeline'ı, kaynaklar ve açık sorular",
            "intro": "<p>İçerik insan + Opus taslağıyla üretilir, incelemeden ve kalibrasyon altın kümesinden geçer, A/B ile ölçülür (B3 §12). Sayfanın sonunda kaynak belgeler ve açık sorular yer alır.</p>",
            "parts": [
                {"file": B3, "from": "## 12.", "to": "## 13."},
                {"html": KAYNAKLAR},
                {"file": B4, "from": "## 15.", "to": "## 16.", "demote": 2},
                {"file": B5, "from": "## 11.", "to": "## 12.", "demote": 2},
            ],
        },
    ],
}
