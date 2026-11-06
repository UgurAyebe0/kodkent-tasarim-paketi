/* ==== core/50-offline.js — çevrimdışı yedekler (P4). Saf: DOM/window/localStorage YOK, eval/new Function YOK.
   cevrimdisiPuanla (şeffaf rubrik kuralı), sezgiselTest (C# alt kümesi için küçük yorumlayıcı + sezgisel yedek), gorevTestEt (desen/yasak),
   savunmaDegerlendir, kodIncele, Müfettiş şikâyet balonları, tohumlu testler. ==== */

/* ---------- metin yardımcıları ---------- */
const O_FOLD = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
/** Katlama: NFKC, Türkçe küçük harf, ç→c ğ→g ı→i ö→o ş→s ü→u; ters tırnak/tırnaklar silinir; boşluklar daralır. Semboller ($ { } ( ) = < > + - * / % . ;) KORUNUR. */
function O_katla(s) {
  return String(s == null ? '' : s).normalize('NFKC').replace(/[​-‏‪-‮⁠-⁤﻿]/g, '')
    .replace(/İ/g, 'i').replace(/I/g, 'ı').toLocaleLowerCase('tr-TR').replace(/[çğıöşüâîû]/g, function (c) { return O_FOLD[c]; })
    .replace(/[`'’"]/g, '').replace(/\s+/g, ' ').trim();
}
function O_reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
/** Bir kavram grubu ('|' ile eşanlamlılar) metinde var mı? Harf/rakam/boşluktan oluşan anahtar kelime BAŞINDA eşleşir (ek alabilir); sembollü anahtar boşluksuz karşılaştırılır. */
function O_anahtarVar(t, kompakt, anahtar) {
  const alt = String(anahtar).split('|');
  for (let i = 0; i < alt.length; i++) {
    const a = O_katla(alt[i]);
    if (!a) continue;
    if (/^[a-z0-9 ]+$/.test(a) && /[a-z]/.test(a)) { if (new RegExp('(?:^|[^a-z0-9])' + O_reEsc(a)).test(t)) return true; }
    else { const ak = a.replace(/\s+/g, ''); if (ak && kompakt.indexOf(ak) >= 0) return true; }
  }
  return false;
}
function O_etiket(anahtar) { return String(anahtar).split('|')[0].replace(/`/g, '').trim(); }
function O_yorumsuz(k) { return String(k || '').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' '); }
function O_dizi(x) { return x == null ? [] : (Array.isArray(x) ? x : [x]); }

/* ---------- Kurul: enjeksiyon süzgeci (cevap her zaman VERİdir) ---------- */
const O_ENJEKSIYON = [
  /\bpuan(i|ini|imi)?\s+ver(in|sene|sen)?\b/, /\bpuan\s*[=:]\s*(100|yuz)\b/, /\b(100|yuz)\s*(puan|ver\b|olsun)/, /\btam\s*puan\b/, /\b(en\s*yuksek|maksimum)\s*puan\b/,
  /ignore\s+(all\s+|the\s+|any\s+|your\s+)?(previous|prior|above|earlier)/, /\bdisregard\b/, /\byou\s+are\s+now\b/, /system\s*prompt/, /\bgive\s+(me\s+)?(100|full|max)/,
  /\bonceki\s+(talimat|komut|yonerge)/, /\btalimat(lar)?(i|ini)?\s*(yok\s*say|unut|gormezden)/, /\bsistem\s*(istemi|promptu?|mesaji)/, /\bkurul(a|u)?\s+(100|yuz|puan)/
];

/** Çevrimdışı Kurul (B3 §10.4 ruhu): Doğruluk = anahtar kavram kapsamı (0–50), Tamlık = ayrı kavram grupları + uzunluk (0–30), Açıklık = cümle yapısı/okunaklılık (0–20).
 *  girdi: { soruTipi, soru, rubrik, cevap, anahtarlar, ad }. Çıktı: Kurul JSON'u (kaynak:'cevrimdisi', guven 0,45). */
function cevrimdisiPuanla(g) {
  g = g || {};
  const cevap = String(g.cevap == null ? '' : g.cevap), ad = g.ad ? g.ad + ', ' : '';
  const t = O_katla(cevap), kompakt = t.replace(/\s+/g, ''), kel = t ? t.split(' ').filter(Boolean) : [];
  const sifir = function (kopya, fb, uyari) {
    return { puan: 0, olcutler: [{ ad: 'Doğruluk', puan: 0, not: 'Puanlanacak içerik yok.' }, { ad: 'Tamlık', puan: 0, not: 'Soruyla ilgili kavram bulunamadı.' }, { ad: 'Açıklık', puan: 0, not: 'Cevap bir açıklama içermiyor.' }],
      geri_bildirim: fb, takip_sorusu: '', guven: kopya ? 0.9 : 0.45, kopya_suphesi: kopya, uyari: uyari, kaynak: 'cevrimdisi' };
  };
  if (O_ENJEKSIYON.some(function (r) { return r.test(t); })) {
    return sifir(true, ad + 'Kurul pazarlık etmez: cevabın puan istiyor, çözüm değil. Bu deneme 0 puan; kendi cümlelerinle yeniden yaz. İlk adım olarak sorudaki anahtar kavramı bir cümlede açıkla.', 'enjeksiyon');
  }
  if (g.soruTipi !== 'Çıktı Tahmini' && (cevap.trim().length < 8 || kel.length < 2)) {
    return sifir(false, ad + 'Cevap çok kısa. Birkaç cümle yeterli: soruda geçen kavramı kendi sözcüklerinle açıkla, sonra bir örnek ver.', 'bos');
  }
  if (kel.length >= 20 && new Set(kel).size / kel.length < 0.15) return sifir(false, ad + 'Aynı sözcük tekrar edilmiş. Bir cümleyle başla; rubrik yukarıda.', 'bos');
  let anah = O_dizi(g.anahtarlar).map(String).filter(Boolean), gerekOran = 0.7;
  if (anah.length > 12) { const seen = {}; anah = anah.map(O_katla).filter(function (w) { if (w.length < 5 || seen[w]) return false; seen[w] = 1; return true; }); gerekOran = 0.35; }
  const n = anah.length, eslesen = [], eksik = [];
  anah.forEach(function (a) { (O_anahtarVar(t, kompakt, a) ? eslesen : eksik).push(a); });
  const gerek = Math.max(1, Math.ceil(n * gerekOran)), kapsam = n ? eslesen.length / n : 0;
  const dog = n ? Math.round(50 * Math.min(1, eslesen.length / gerek)) : Math.min(25, kel.length);
  const uz = kel.length < 5 ? 0 : kel.length < 10 ? 3 : kel.length < 18 ? 5 : kel.length <= 120 ? 8 : 5;
  const tam = Math.min(30, Math.round(22 * kapsam) + uz);
  const cumleler = cevap.split(/[.!?…]+(?=\s|$)/).filter(function (s) { return s.trim().split(/\s+/).filter(Boolean).length >= 2; }).length;
  let acik = 0;
  if (kel.length >= 6) acik += 5;
  acik += cumleler >= 2 ? 5 : (cumleler === 1 && kel.length >= 6 ? 3 : 0);
  if (cumleler >= 1 && kel.length / cumleler >= 5 && kel.length / cumleler <= 28) acik += 4;
  if (/(^|[^a-z0-9])(cunku|yani|bu yuzden|boylece|ama|oysa|sonra|once|icin|oldugu|ise)([^a-z0-9]|$)/.test(t)) acik += 4;
  if (kel.length >= 6 && new Set(kel).size / kel.length >= 0.6) acik += 2;
  acik = Math.min(acik, Math.round(6 + 14 * Math.min(1, kapsam * 1.25)), 20);
  const puan = Math.max(0, Math.min(100, dog + tam + acik));
  const iyi = eslesen.length ? ad + 'cevabında "' + O_etiket(eslesen[0]) + '" kavramını yakalamışsın.' : ad + 'cevabı yazmaya cesaret etmen güzel.';
  const eks = eksik.length ? ' Eksik kalan: "' + O_etiket(eksik[0]) + '" kavramına da değinmelisin.' : ' Eksik kalan belirgin bir kavram görünmüyor.';
  const adim = puan >= 70 ? ' Sonraki adım: aynı fikri kendi örneğinle pekiştir.' : ' Sonraki adım: ders kartına dönüp ilgili örneği yeniden incele, sonra cevabını bir cümle daha genişlet.';
  return { puan: puan,
    olcutler: [{ ad: 'Doğruluk', puan: dog, not: n + ' anahtar kavramdan ' + eslesen.length + ' tanesi bulundu.' },
      { ad: 'Tamlık', puan: tam, not: kel.length + ' kelimelik cevap kavramların ' + (kapsam >= 0.8 ? 'çoğunu' : kapsam >= 0.4 ? 'bir kısmını' : 'çok azını') + ' kapsıyor.' },
      { ad: 'Açıklık', puan: acik, not: acik >= 14 ? 'Cümleler okunaklı ve bağlantılı.' : 'Cümle yapısı ve bağlaçlar geliştirilebilir.' }],
    geri_bildirim: iyi + eks + adim,
    takip_sorusu: (puan >= 40 && puan < 85 && eksik.length) ? 'Peki "' + O_etiket(eksik[0]) + '" bu durumda ne işe yarıyor?' : '',
    guven: 0.45, kopya_suphesi: false, kaynak: 'cevrimdisi' };
}

/* ====================================================================
   C# alt kümesi için küçük yorumlayıcı (Otopark UcretHesapla vb.). eval YOK.
   Destek: sınıf/metot/alan, int/double/decimal/var/bool/string, if/else, for, while, foreach, switch deyimi ve ifadesi (ilişkisel örüntüler),
   ?:, (int)/(double) dönüşümü, Math.Ceiling/Floor/Round (bankacı yuvarlaması)/Max/Min/Abs, int bölmesi, CS0121/CS0161/CS0266 benzeri hatalar.
   Desteklenmeyen sözdizimi → { csTur:'desteklenmiyor' } fırlatır; sezgiselTest sezgisel yedeğe düşer.
   ==================================================================== */
function O_Dbl(v) { this.v = v; }
const O_TIPLER = { int: 1, long: 1, short: 1, byte: 1, double: 1, decimal: 1, float: 1, bool: 1, string: 1, char: 1, var: 1, void: 1 };
const O_MOD = { 'public': 1, 'private': 1, 'protected': 1, 'internal': 1, 'static': 1, 'readonly': 1, 'const': 1, 'async': 1, 'override': 1, 'virtual': 1, 'sealed': 1 };
function O_destek(m) { return { csTur: 'desteklenmiyor', mesaj: m }; }
function O_derleme(kod, mesaj) { return { csTur: 'derleme', kod: kod, mesaj: mesaj }; }
function O_calisma(kod, mesaj) { return { csTur: 'calisma', kod: kod, mesaj: mesaj || kod }; }
const O_sv = function (x) { return x instanceof O_Dbl ? x.v : x; };
const O_sayi = function (x) { return typeof x === 'number' || x instanceof O_Dbl; };

function O_csTokenle(src) {
  const t = [], n = src.length, ID0 = /[A-Za-z_çğıöşüÇĞİÖŞÜ]/, ID1 = /[A-Za-z0-9_çğıöşüÇĞİÖŞÜ]/;
  const IKI = ['<=', '>=', '==', '!=', '&&', '||', '=>', '+=', '-=', '*=', '/=', '%=', '++', '--'];
  let i = 0;
  while (i < n) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '"' || ((c === '$' || c === '@') && src[i + 1] === '"')) {
      if (c !== '"') i++;
      i++; let s = '';
      while (i < n && src[i] !== '"') { if (src[i] === '\\') i++; s += src[i]; i++; }
      i++; t.push({ k: 'str', v: s }); continue;
    }
    if (c === "'") { i++; let s = ''; while (i < n && src[i] !== "'") { if (src[i] === '\\') i++; s += src[i]; i++; } i++; t.push({ k: 'str', v: s }); continue; }
    if (/[0-9]/.test(c)) {
      let j = i; while (j < n && /[0-9_]/.test(src[j])) j++;
      let d = false;
      if (src[j] === '.' && /[0-9]/.test(src[j + 1] || '')) { d = true; j++; while (j < n && /[0-9]/.test(src[j])) j++; }
      const num = parseFloat(src.slice(i, j).replace(/_/g, ''));
      if (/[dDmMfF]/.test(src[j] || '') && !ID1.test(src[j + 1] || ' ')) { d = true; j++; } else if (/[lL]/.test(src[j] || '') && !ID1.test(src[j + 1] || ' ')) j++;
      t.push({ k: 'num', v: num, d: d }); i = j; continue;
    }
    if (ID0.test(c)) { let j = i + 1; while (j < n && ID1.test(src[j])) j++; t.push({ k: 'id', v: src.slice(i, j) }); i = j; continue; }
    const iki = src.substr(i, 2);
    if (IKI.indexOf(iki) >= 0) { t.push({ k: 'op', v: iki }); i += 2; continue; }
    t.push({ k: 'op', v: c }); i++;
  }
  return t;
}

/** Kaynağı ayrıştırır; { metotlar, alanlar, calistir(ad, args) } döndürür. */
function O_csDerle(src) {
  const T = O_csTokenle(src), BIN = { '||': 1, '&&': 2, '==': 3, '!=': 3, '<': 4, '>': 4, '<=': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6 };
  let p = 0;
  const al = function () { if (p >= T.length) throw O_destek('beklenmedik son'); return T[p++]; };
  const op = function (v) { return T[p] && T[p].k === 'op' && T[p].v === v; };
  const opN = function (k, v) { return T[p + k] && T[p + k].k === 'op' && T[p + k].v === v; };
  const idv = function (v) { return T[p] && T[p].k === 'id' && T[p].v === v; };
  const bekle = function (v) { if (!op(v)) throw O_destek("'" + v + "' bekleniyor"); p++; };
  const metotlar = {}, alanlar = {};

  /* ---- ifadeler ---- */
  function parseTernary() {
    const c = parseBin(1);
    if (op('?')) { p++; const a = parseTernary(); bekle(':'); const b = parseTernary(); return { t: 'ucil', c: c, a: a, b: b }; }
    return c;
  }
  function parseBin(min) {
    let sol = parseUnary();
    for (;;) {
      const o = T[p]; if (!o || o.k !== 'op' || !BIN[o.v] || BIN[o.v] < min) return sol;
      p++; const sag = parseBin(BIN[o.v] + 1); sol = { t: 'ikili', op: o.v, a: sol, b: sag };
    }
  }
  function parseUnary() {
    if (op('-')) { p++; return { t: 'tekli', op: '-', a: parseUnary() }; }
    if (op('!')) { p++; return { t: 'tekli', op: '!', a: parseUnary() }; }
    if (op('+')) { p++; return parseUnary(); }
    if (op('(') && T[p + 1] && T[p + 1].k === 'id' && O_TIPLER[T[p + 1].v] && opN(2, ')')) { const tip = T[p + 1].v; p += 3; return { t: 'cast', tip: tip, a: parseUnary() }; }
    let e = parsePrimary();
    while (idv('switch') && opN(1, '{')) e = parseSwitchIfade(e);
    return e;
  }
  function parsePrimary() {
    const k = al();
    if (k.k === 'num') return { t: 'sayi', v: k.v, d: k.d };
    if (k.k === 'str') return { t: 'str', v: k.v };
    if (k.k === 'op' && k.v === '(') { const e = parseTernary(); bekle(')'); return e; }
    if (k.k === 'id') {
      if (k.v === 'true' || k.v === 'false') return { t: 'bool', v: k.v === 'true' };
      if (k.v === 'new') throw O_destek('new');
      let ad = k.v;
      while (op('.') && T[p + 1] && T[p + 1].k === 'id') { p++; ad += '.' + al().v; }
      if (op('(')) { p++; const args = []; if (!op(')')) { do { args.push(parseTernary()); } while (op(',') && (p++, true)); } bekle(')'); return { t: 'cagri', ad: ad, args: args }; }
      return { t: 'id', ad: ad };
    }
    throw O_destek("beklenmeyen '" + k.v + "'");
  }
  function parseDesenTek() {
    if (idv('_')) { p++; return { t: 'hepsi' }; }
    const r = T[p];
    if (r && r.k === 'op' && (r.v === '<' || r.v === '<=' || r.v === '>' || r.v === '>=')) { p++; return { t: 'rel', op: r.v, e: parseBin(5) }; }
    return { t: 'esit', e: parseBin(5) };
  }
  function parseDesen() {
    let d = parseDesenTek();
    while (idv('and') || idv('or')) { const o = al().v; d = { t: o, a: d, b: parseDesenTek() }; }
    return d;
  }
  function parseSwitchIfade(e) {
    p++; bekle('{'); const kollar = [];
    while (!op('}')) { const d = parseDesen(); bekle('=>'); const s = parseTernary(); kollar.push({ d: d, s: s }); if (op(',')) p++; else break; }
    bekle('}'); return { t: 'switch', e: e, kollar: kollar };
  }

  /* ---- deyimler ---- */
  function parseIfade() {
    if (op('++') || op('--')) { const o = al().v; return { t: 'art', ad: al().v, d: o === '++' ? 1 : -1 }; }
    if (T[p] && T[p].k === 'id' && T[p + 1] && T[p + 1].k === 'op') {
      const o2 = T[p + 1].v;
      if (['=', '+=', '-=', '*=', '/=', '%='].indexOf(o2) >= 0) { const ad = al().v; p++; return { t: 'ata', ad: ad, op: o2, e: parseTernary() }; }
      if (o2 === '++' || o2 === '--') { const ad = al().v; p++; return { t: 'art', ad: ad, d: o2 === '++' ? 1 : -1 }; }
    }
    return { t: 'ifade', e: parseTernary() };
  }
  function parseBildir() {
    if (idv('const')) p++;
    const tip = al().v, d = [];
    do { const ad = al().v; let e = null; if (op('=')) { p++; e = parseTernary(); } d.push({ ad: ad, e: e }); } while (op(',') && (p++, true));
    bekle(';'); return { t: 'bildir', tip: tip, d: d };
  }
  function parseBlok() { bekle('{'); const s = []; while (!op('}')) s.push(parseStmt()); p++; return { t: 'blok', s: s }; }
  function parseStmt() {
    if (p >= T.length) throw O_destek('beklenmedik son');
    if (op('{')) return parseBlok();
    if (op(';')) { p++; return { t: 'bos' }; }
    const k = T[p];
    if (k.k === 'id') {
      if (k.v === 'if') { p++; bekle('('); const c = parseTernary(); bekle(')'); const a = parseStmt(); let b = null; if (idv('else')) { p++; b = parseStmt(); } return { t: 'if', c: c, a: a, b: b }; }
      if (k.v === 'return') { p++; let e = null; if (!op(';')) e = parseTernary(); bekle(';'); return { t: 'ret', e: e }; }
      if (k.v === 'while') { p++; bekle('('); const c = parseTernary(); bekle(')'); return { t: 'while', c: c, g: parseStmt() }; }
      if (k.v === 'for') {
        p++; bekle('('); let init = null, c = null; const adim = [];
        if (op(';')) p++; else if (T[p].k === 'id' && O_TIPLER[T[p].v] && T[p + 1] && T[p + 1].k === 'id') init = parseBildir(); else { init = parseIfade(); bekle(';'); }
        if (!op(';')) c = parseTernary(); bekle(';');
        if (!op(')')) { do { adim.push(parseIfade()); } while (op(',') && (p++, true)); } bekle(')');
        return { t: 'for', init: init, c: c, adim: adim, g: parseStmt() };
      }
      if (k.v === 'foreach') {
        p++; bekle('('); al(); const adlar = [];
        if (op('(')) { p++; do { adlar.push(al().v); } while (op(',') && (p++, true)); bekle(')'); } else adlar.push(al().v);
        if (!idv('in')) throw O_destek('foreach in'); p++; const kol = al().v; bekle(')');
        return { t: 'foreach', adlar: adlar, kol: kol, g: parseStmt() };
      }
      if (k.v === 'switch') {
        p++; bekle('('); const e = parseTernary(); bekle(')'); bekle('{'); const kollar = []; let cur = null;
        while (!op('}')) {
          if (idv('case')) { p++; const lab = parseTernary(); bekle(':'); if (!cur || cur.g.length) { cur = { et: [], g: [] }; kollar.push(cur); } cur.et.push(lab); }
          else if (idv('default')) { p++; bekle(':'); if (!cur || cur.g.length) { cur = { et: [], g: [] }; kollar.push(cur); } cur.et.push(null); }
          else { if (!cur) throw O_destek('switch'); cur.g.push(parseStmt()); }
        }
        p++; return { t: 'switchd', e: e, kollar: kollar };
      }
      if (k.v === 'throw') { p++; let ad = 'Exception'; if (idv('new')) { p++; ad = al().v; while (op('.')) { p++; ad = al().v; } if (op('(')) { let d = 0; do { if (op('(')) d++; if (op(')')) d--; p++; } while (d > 0); } } bekle(';'); return { t: 'at', ad: ad }; }
      if (k.v === 'break') { p++; bekle(';'); return { t: 'kes' }; }
      if (k.v === 'continue') { p++; bekle(';'); return { t: 'devam' }; }
      if ((k.v === 'const' && T[p + 1] && O_TIPLER[T[p + 1].v]) || (O_TIPLER[k.v] && T[p + 1] && T[p + 1].k === 'id')) return parseBildir();
    }
    const s = parseIfade(); bekle(';'); return s;
  }

  /* ---- üyeler (alan / metot) ---- */
  function tipAtla() {
    let ilk = null;
    if (op('(')) { let d = 0; do { if (op('(')) d++; if (op(')')) d--; p++; } while (d > 0); ilk = 'tuple'; }
    else { ilk = al().v; while (op('.') && T[p + 1] && T[p + 1].k === 'id') { p++; al(); } if (op('<')) { let d = 0; do { if (op('<')) d++; if (op('>')) d--; p++; } while (d > 0); } }
    while (op('[') && opN(1, ']')) p += 2;
    if (op('?')) p++;
    return ilk;
  }
  function parseDiziLit() {
    bekle('{'); const o = [];
    while (!op('}')) {
      if (op('(')) { p++; const og = []; do { og.push(parseTernary()); } while (op(',') && (p++, true)); bekle(')'); o.push({ t: 'demet', og: og }); } else o.push(parseTernary());
      if (op(',')) p++; else break;
    }
    bekle('}'); return { t: 'dizi', o: o };
  }
  function parseUye() {
    if (idv('using')) { while (!op(';')) p++; p++; return; }
    while (T[p] && T[p].k === 'id' && O_MOD[T[p].v]) p++;
    const donus = tipAtla(), ad = al().v;
    if (op('(')) {
      p++; const ps = [];
      while (!op(')')) { while (idv('ref') || idv('out') || idv('in') || idv('params')) p++; const tip = tipAtla(), pad = al().v; if (op('=')) { p++; parseTernary(); } ps.push({ ad: pad, tip: tip }); if (op(',')) p++; else break; }
      bekle(')');
      let govde; if (op('=>')) { p++; const e = parseTernary(); bekle(';'); govde = { t: 'ret', e: e }; } else govde = parseBlok();
      metotlar[ad] = { ad: ad, donus: donus, ps: ps, govde: govde };
    } else if (op('=')) { p++; const e = op('{') ? parseDiziLit() : parseTernary(); bekle(';'); alanlar[ad] = e; }
    else if (op(';')) p++;
    else throw O_destek('üye');
  }
  const ci = T.findIndex(function (x) { return x.k === 'id' && x.v === 'class'; });
  if (ci >= 0) { p = ci; while (p < T.length && !op('{')) p++; p++; } else p = 0;
  while (p < T.length && !op('}')) parseUye();

  /* ---- çalıştırma ---- */
  let adim = 0; const alanDeger = {};
  function adimSay() { if (++adim > 200000) throw O_calisma('ZAMAN_ASIMI', 'Zaman aşımı: sonsuz döngü olabilir'); }
  function bankaci(x) { const r = Math.round(x); return Math.abs(x % 1) === 0.5 ? 2 * Math.round(x / 2) : r; }
  function ikili(o, a, b) {
    if (o === '+' && (typeof a === 'string' || typeof b === 'string')) return String(O_sv(a)) + String(O_sv(b));
    if (o === '==' || o === '!=') { const e = (O_sayi(a) && O_sayi(b)) ? O_sv(a) === O_sv(b) : a === b; return o === '==' ? e : !e; }
    if (!O_sayi(a) || !O_sayi(b)) throw O_derleme('CS0019', "'" + o + "' işleci bu türlere uygulanamaz");
    const x = O_sv(a), y = O_sv(b), dbl = a instanceof O_Dbl || b instanceof O_Dbl, W = function (v) { return dbl ? new O_Dbl(v) : v; };
    switch (o) {
      case '+': return W(x + y); case '-': return W(x - y); case '*': return W(x * y);
      case '/': if (dbl) return new O_Dbl(x / y); if (y === 0) throw O_calisma('DivideByZeroException', 'Sıfıra bölme'); return Math.trunc(x / y);
      case '%': if (y === 0 && !dbl) throw O_calisma('DivideByZeroException', 'Sıfıra bölme'); return W(x % y);
      case '<': return x < y; case '>': return x > y; case '<=': return x <= y; case '>=': return x >= y;
    }
    throw O_destek(o);
  }
  function ata(env, ad, d) {
    const tip = env.t[ad];
    if (tip === 'int' || tip === 'long' || tip === 'short' || tip === 'byte') { if (d instanceof O_Dbl) throw O_derleme('CS0266', "'double' türü 'int' türüne örtük olarak dönüştürülemez"); if (typeof d !== 'number') throw O_derleme('CS0029', "'" + typeof d + "' türü 'int' türüne dönüştürülemez"); }
    else if (tip === 'double' || tip === 'decimal' || tip === 'float') { if (typeof d === 'number') d = new O_Dbl(d); else if (!(d instanceof O_Dbl)) throw O_derleme('CS0029', "Tür dönüştürülemez"); }
    else if (tip === 'bool' && typeof d !== 'boolean') throw O_derleme('CS0029', "Tür dönüştürülemez");
    else if (tip === 'string' && typeof d !== 'string') throw O_derleme('CS0029', "Tür dönüştürülemez");
    env.v[ad] = d;
  }
  function alanOku(ad) {
    if (!(ad in alanlar)) return undefined;
    if (!(ad in alanDeger)) { const n = alanlar[ad]; alanDeger[ad] = n.t === 'dizi' ? n.o.map(function (e) { return e.t === 'demet' ? e.og.map(function (x) { return ev(x, { v: {}, t: {} }); }) : ev(e, { v: {}, t: {} }); }) : ev(n, { v: {}, t: {} }); }
    return alanDeger[ad];
  }
  function eslesir(d, v, env) {
    switch (d.t) {
      case 'hepsi': return true;
      case 'rel': return ikili(d.op, v, ev(d.e, env));
      case 'esit': return ikili('==', v, ev(d.e, env));
      case 'and': return eslesir(d.a, v, env) && eslesir(d.b, v, env);
      case 'or': return eslesir(d.a, v, env) || eslesir(d.b, v, env);
    }
    return false;
  }
  function cagir(ad, args) {
    const m = metotlar[ad]; if (!m) throw O_derleme('CS0103', "'" + ad + "' adı geçerli bağlamda yok");
    const env = { v: {}, t: {} };
    m.ps.forEach(function (pr, i) { env.t[pr.ad] = pr.tip; if (pr.tip === 'int' && args[i] instanceof O_Dbl) throw O_derleme('CS1503', "Bağımsız değişken 'double' türünden 'int' türüne dönüştürülemez"); ata(env, pr.ad, args[i]); });
    const r = exec(m.govde, env);
    if (!r || !('ret' in r) || r.ret === undefined) throw O_derleme('CS0161', 'Tüm kod yolları bir değer döndürmüyor');
    if ((m.donus === 'int' || m.donus === 'long') && r.ret instanceof O_Dbl) throw O_derleme('CS0266', "'double' türü 'int' türüne örtük olarak dönüştürülemez");
    return r.ret;
  }
  function ev(n, env) {
    switch (n.t) {
      case 'sayi': return n.d ? new O_Dbl(n.v) : n.v;
      case 'str': return n.v;
      case 'bool': return n.v;
      case 'id': {
        if (n.ad in env.t) { if (env.v[n.ad] === undefined) throw O_derleme('CS0165', 'Atanmamış yerel değişken kullanımı'); return env.v[n.ad]; }
        if (n.ad === 'int.MaxValue') return 2147483647; if (n.ad === 'int.MinValue') return -2147483648;
        const f = alanOku(n.ad); if (f !== undefined) return f;
        throw O_derleme('CS0103', "'" + n.ad + "' adı geçerli bağlamda yok");
      }
      case 'tekli': { const v = ev(n.a, env); if (n.op === '!') { if (typeof v !== 'boolean') throw O_derleme('CS0023', "'!' işleci bu türe uygulanamaz"); return !v; } if (!O_sayi(v)) throw O_derleme('CS0023', "'-' işleci bu türe uygulanamaz"); return v instanceof O_Dbl ? new O_Dbl(-v.v) : -v; }
      case 'ikili': {
        if (n.op === '&&' || n.op === '||') { const a = ev(n.a, env); if (typeof a !== 'boolean') throw O_derleme('CS0019', "'" + n.op + "' işleci bu türlere uygulanamaz"); if (n.op === '&&' ? !a : a) return a; const b = ev(n.b, env); if (typeof b !== 'boolean') throw O_derleme('CS0019', "'" + n.op + "' işleci bu türlere uygulanamaz"); return b; }
        return ikili(n.op, ev(n.a, env), ev(n.b, env));
      }
      case 'ucil': { const c = ev(n.c, env); if (typeof c !== 'boolean') throw O_derleme('CS0029', 'Koşul bool olmalı'); return c ? ev(n.a, env) : ev(n.b, env); }
      case 'cast': { const v = ev(n.a, env); if (!O_sayi(v)) throw O_derleme('CS0030', 'Tür dönüştürülemez'); return (n.tip === 'double' || n.tip === 'decimal' || n.tip === 'float') ? new O_Dbl(O_sv(v)) : Math.trunc(O_sv(v)); }
      case 'switch': { const v = ev(n.e, env); for (let i = 0; i < n.kollar.length; i++) if (eslesir(n.kollar[i].d, v, env)) return ev(n.kollar[i].s, env); throw O_calisma('SwitchExpressionException', 'Eşleşen kol yok'); }
      case 'cagri': {
        const args = n.args.map(function (a) { return ev(a, env); });
        switch (n.ad) {
          case 'Math.Ceiling': case 'Math.Floor': case 'Math.Round': case 'Math.Truncate': {
            if (!(args[0] instanceof O_Dbl)) throw O_derleme('CS0121', "Çağrı şu yöntem veya özellikler arasında belirsiz: 'System.Math." + n.ad.slice(5) + "(decimal)' ve 'System.Math." + n.ad.slice(5) + "(double)'");
            const x = args[0].v; return new O_Dbl(n.ad === 'Math.Ceiling' ? Math.ceil(x) : n.ad === 'Math.Floor' ? Math.floor(x) : n.ad === 'Math.Truncate' ? Math.trunc(x) : bankaci(x));
          }
          case 'Math.Max': case 'Math.Min': { const d = args[0] instanceof O_Dbl || args[1] instanceof O_Dbl, r = n.ad === 'Math.Max' ? Math.max(O_sv(args[0]), O_sv(args[1])) : Math.min(O_sv(args[0]), O_sv(args[1])); return d ? new O_Dbl(r) : r; }
          case 'Math.Abs': return args[0] instanceof O_Dbl ? new O_Dbl(Math.abs(args[0].v)) : Math.abs(args[0]);
          case 'Math.Pow': return new O_Dbl(Math.pow(O_sv(args[0]), O_sv(args[1])));
          case 'Math.Sqrt': return new O_Dbl(Math.sqrt(O_sv(args[0])));
          case 'Console.WriteLine': case 'Console.Write': return undefined;
        }
        return cagir(n.ad, args);
      }
    }
    throw O_destek(n.t);
  }
  function exec(n, env) {
    adimSay();
    switch (n.t) {
      case 'blok': for (let i = 0; i < n.s.length; i++) { const r = exec(n.s[i], env); if (r) return r; } return undefined;
      case 'bos': return undefined;
      case 'bildir': n.d.forEach(function (d) { let v = d.e ? ev(d.e, env) : undefined, tip = n.tip; if (tip === 'var') { tip = v instanceof O_Dbl ? 'double' : typeof v === 'number' ? 'int' : typeof v === 'boolean' ? 'bool' : 'string'; } env.t[d.ad] = tip; if (v !== undefined) ata(env, d.ad, v); else env.v[d.ad] = undefined; }); return undefined;
      case 'ata': {
        if (!(n.ad in env.t)) throw O_derleme('CS0103', "'" + n.ad + "' adı geçerli bağlamda yok");
        let d = ev(n.e, env);
        if (n.op !== '=') { if (env.v[n.ad] === undefined) throw O_derleme('CS0165', 'Atanmamış yerel değişken kullanımı'); d = ikili(n.op.slice(0, -1), env.v[n.ad], d); }
        ata(env, n.ad, d); return undefined;
      }
      case 'art': { if (!(n.ad in env.t)) throw O_derleme('CS0103', "'" + n.ad + "' adı geçerli bağlamda yok"); ata(env, n.ad, ikili('+', env.v[n.ad], n.d)); return undefined; }
      case 'ifade': ev(n.e, env); return undefined;
      case 'if': { const c = ev(n.c, env); if (typeof c !== 'boolean') throw O_derleme('CS0029', "'int' türü 'bool' türüne dönüştürülemez"); if (c) return exec(n.a, env); return n.b ? exec(n.b, env) : undefined; }
      case 'ret': return { ret: n.e ? ev(n.e, env) : undefined };
      case 'while': while (ev(n.c, env)) { adimSay(); const r = exec(n.g, env); if (r) { if (r.kes) break; if (!r.devam) return r; } } return undefined;
      case 'for': {
        if (n.init) exec(n.init, env);
        while (n.c ? ev(n.c, env) : true) { adimSay(); const r = exec(n.g, env); if (r) { if (r.kes) break; if (!r.devam) return r; } n.adim.forEach(function (a) { exec(a, env); }); }
        return undefined;
      }
      case 'foreach': {
        const kol = n.kol in env.t ? env.v[n.kol] : alanOku(n.kol); if (!Array.isArray(kol)) throw O_derleme('CS1579', 'foreach bir koleksiyon gerektirir');
        for (let i = 0; i < kol.length; i++) {
          adimSay(); const oge = kol[i];
          n.adlar.forEach(function (ad, j) { const v = n.adlar.length > 1 ? oge[j] : oge; env.t[ad] = v instanceof O_Dbl ? 'double' : 'int'; env.v[ad] = v; });
          const r = exec(n.g, env); if (r) { if (r.kes) break; if (!r.devam) return r; }
        }
        return undefined;
      }
      case 'switchd': {
        const v = ev(n.e, env); let basla = -1;
        for (let i = 0; i < n.kollar.length && basla < 0; i++) n.kollar[i].et.forEach(function (e) { if (basla < 0 && e !== null && ikili('==', v, ev(e, env))) basla = i; });
        if (basla < 0) for (let i = 0; i < n.kollar.length; i++) if (n.kollar[i].et.indexOf(null) >= 0) basla = i;
        if (basla < 0) return undefined;
        for (let i = basla; i < n.kollar.length; i++) for (let j = 0; j < n.kollar[i].g.length; j++) { const r = exec(n.kollar[i].g[j], env); if (r) { if (r.kes) return undefined; return r; } }
        return undefined;
      }
      case 'at': throw O_calisma(n.ad, n.ad);
      case 'kes': return { kes: true };
      case 'devam': return { devam: true };
    }
    throw O_destek(n.t);
  }
  return { metotlar: metotlar, alanlar: alanlar, calistir: function (ad, args) { adim = 0; return cagir(ad, args); } };
}

/** Çalıştırılamayan (desteklenmeyen sözdizimi) kodlar için sezgisel yedek (brief E.3 kuralları). */
function O_sezgisel(kod, testler) {
  const k = O_yorumsuz(kod);
  const bos = /NotImplementedException/.test(k) && !/\breturn\b[^;]*;/.test(k.replace(/throw[^;]*;/g, ''));
  const f = { s100: /\b100\b/.test(k), s40: /\b40\b/.test(k), s250: /\b250\b/.test(k), dal: /\b(if|switch)\b|\?[^?]/.test(k),
    yuvarla: /Ceiling|\+\s*59\b|\+\s*60\s*-\s*1/.test(k) && /60/.test(k), gun: /\b1440\b|\bgun\b|\bgün\b/.test(k) && /1439|Ceiling|\+\s*1\b/.test(k),
    ilkEsit: /<=\s*120\b/.test(k), ikinciEksik: /<\s*360\b/.test(k) && !/<=\s*360\b/.test(k) };
  return (testler || []).map(function (t) {
    const d = Number(t.dakika), b = t.beklenen;
    if (bos) return { id: t.id, gecti: false, gercek: 'NotImplementedException' };
    let ok = true, yanlis = null;
    if (d <= 0) ok = f.dal || f.yuvarla;
    else if (d < 120) ok = f.s100 && f.dal && f.yuvarla;
    else if (d <= 360) { ok = f.s40 && f.dal && f.yuvarla; if (ok && d === 120 && f.ilkEsit) { ok = false; yanlis = Math.ceil(d / 60) * 100; } if (ok && d === 360 && f.ikinciEksik) { ok = false; yanlis = 250; } }
    else if (d <= 1440) ok = f.s250 && f.dal;
    else ok = f.s250 && f.gun;
    if (ok) return { id: t.id, gecti: true, gercek: String(b) };
    const yk = yanlis != null ? yanlis : (d <= 0 ? 100 : d < 120 ? Math.floor(d / 60) * 100 : d <= 360 ? Math.floor(d / 60) * 40 : 250);
    return { id: t.id, gecti: false, gercek: String(yk === b ? yk + 40 : yk) };
  });
}

/** Otopark testleri: önce yorumlayıcı (kod gerçekten çalıştırılır), desteklenmeyen sözdiziminde sezgisel yedek. [{ id, gecti, gercek, hata? }] */
function sezgiselTest(kod, testler) {
  testler = testler || [];
  let prog = null;
  try { prog = O_csDerle(String(kod || '')); } catch (e) { prog = null; }
  if (!prog) return O_sezgisel(kod, testler);
  if (!prog.metotlar['UcretHesapla']) {
    return testler.map(function (t) { return { id: t.id, gecti: false, gercek: 'İmza sözleşmesi: UcretHesapla(int dakika) olmalı' }; });
  }
  return testler.map(function (t) {
    try {
      const v = prog.calistir('UcretHesapla', [Math.floor(Number(t.dakika) || 0)]);
      return { id: t.id, gecti: O_sayi(v) && O_sv(v) === t.beklenen, gercek: O_sayi(v) ? String(O_sv(v)) : String(v) };
    } catch (e) {
      if (e && e.csTur === 'desteklenmiyor') return O_sezgisel(kod, [t])[0];
      const ad = e && e.kod ? e.kod : 'Hata';
      return { id: t.id, gecti: false, gercek: e && e.csTur === 'derleme' ? 'Derleme hatası ' + ad : ad, hata: e && e.mesaj ? String(e.mesaj) : String(e) };
    }
  });
}

/** Ruhsat görevleri: her testin `desen` (kodda EŞLEŞMELİ) ve `yasak` (EŞLEŞMEMELİ) düzenli ifade dizeleriyle. Yorum satırları yok sayılır. [{ id, gecti, gercek }] */
function gorevTestEt(gorevId, kod) {
  const g = D_gorevler.filter(function (x) { return x.id === gorevId; })[0];
  if (!g || !g.editor) return [];
  const k = O_yorumsuz(kod), bosluk = /___/.test(k), kalan = /NotImplementedException/.test(k) || (g.editor.baslangicKod && O_yorumsuz(g.editor.baslangicKod).trim() === k.trim());
  return g.editor.testler.map(function (t) {
    let desenOk = true, yasakVar = false;
    try { desenOk = O_dizi(t.desen).every(function (p) { return new RegExp(p).test(k); }); yasakVar = O_dizi(t.yasak).some(function (p) { return new RegExp(p).test(k); }); } catch (e) { desenOk = false; }
    const gecti = desenOk && !yasakVar;
    let gercek = String(t.beklenen);
    if (!gecti) gercek = bosluk && yasakVar ? 'Boşluk (___) hâlâ duruyor' : (kalan && yasakVar) ? 'Başlangıç kodu hâlâ duruyor' : yasakVar ? 'Çeldirici ya da yanlış ifade duruyor' : !/\S/.test(k) ? 'Kod boş' : 'Beklenen çıktı üretilemiyor';
    return { id: t.id, gecti: gecti, gercek: gercek };
  });
}

/** Savunma: açıklama, sorunun anahtar kavram gruplarından en az %40'ını (en az 2) içermeli ve en az 6 kelime olmalı. { kabul, gerekce } */
function savunmaDegerlendir(g) {
  g = g || {};
  const t = O_katla(g.aciklama), kompakt = t.replace(/\s+/g, ''), kel = t ? t.split(' ').filter(Boolean).length : 0;
  const anah = O_dizi(g.anahtarlar).map(String).filter(Boolean), isabet = anah.filter(function (a) { return O_anahtarVar(t, kompakt, a); }), gerek = Math.min(anah.length || 2, Math.max(2, Math.ceil(anah.length * 0.4)));
  const kabul = isabet.length >= gerek && kel >= 6;
  return { kabul: kabul, isabet: isabet.length, gerek: gerek,
    gerekce: kabul ? 'Açıklaman seçilen satırın işini doğru bağlıyor (' + isabet.length + ' anahtar kavram).'
      : kel < 6 ? 'Açıklama çok kısa; satırın ne yaptığını ve neden orada olduğunu en az bir cümleyle anlat.'
      : 'Henüz değil: satırın asıl işini belirleyen kavramlar eksik' + (anah.length && isabet.length < anah.length ? ' (örn. "' + O_etiket(anah.filter(function (a) { return isabet.indexOf(a) < 0; })[0]) + '")' : '') + '. Satırı tekrar oku ve somut bir girdiyle hesapla.' };
}

/** Usta Yorumu (kod incelemesi): 3 madde — okunabilirlik, sihirli sayılar, sınır mantığı. [{ baslik, not }] */
function kodIncele(kod) {
  const k = O_yorumsuz(kod);
  const tekHarf = /\b(?:int|var|string|double|decimal)\s+([A-Za-z_çğıöşüÇĞİÖŞÜ])\s*[=;,)]/.test(k), kalip = /\(\s*dakika\s*\+\s*59\s*\)\s*\/\s*60/.test(k), cift = /\bdouble\b|Math\.Ceiling|Math\.Round/.test(k);
  const sabit = /\bconst\b|static\s+readonly/.test(k), sayilar = (k.match(/\b(100|40|250)\b/g) || []).length, sinir = /<=\s*360/.test(k) && /<\s*120/.test(k), tablo = /\bswitch\b|Tarife|foreach/.test(k);
  return [
    { baslik: 'Okunabilirlik', not: tekHarf ? 'Tek harfli değişken adların var; `saat`, `gun` gibi anlamlı adlar kodu kendi kendine anlatır.'
      : cift ? '`double` kullanmak zorunda değildin; tam sayı bölmesiyle aynı sonucu alırsın: `(dakika + 59) / 60`.'
      : kalip ? 'Başlayan saati `(dakika + 59) / 60` kalıbıyla kendi başına kurman süreç olarak güzel.' : 'Adlandırma temiz: değişken adları ne tuttuğunu söylüyor.' },
    { baslik: 'Sihirli sayılar', not: sabit ? 'Tarife sayılarını adlandırılmış sabitlerle tutman, fiyat değişince tek yerden düzeltmeni sağlar.'
      : sayilar >= 3 ? '100, 40 ve 250 sayıları kodun içinde anlamsız duruyor; yarın Hasan Abi fiyatı değiştirirse hepsini aramak zorunda kalırsın. Müşterinin sözcükleriyle adlandırılmış `const int` değerlere çevir.'
      : 'Sabit sayıları az ve anlaşılır kullanmışsın; tarifeleri adlandırmak yine de bakımı kolaylaştırır.' },
    { baslik: 'Sınır mantığı', not: sinir ? 'Sınırları (`dakika < 120`, `dakika <= 360`) Sözleşme Kartı\'ndaki dâhil/hariç kuralıyla uyumlu seçmişsin.'
      : tablo ? 'Tarifeyi veri ya da `switch` olarak yazmak yeni dilim eklemeyi kolaylaştırır (Otopark L2–L4).'
      : 'Sınır satırlarında `<` ile `<=` seçimini Sözleşme Kartı\'yla karşılaştır; en çok hata orada çıkar.' }
  ];
}

/* ---------- Müfettiş: şikâyet balonları ve tohumlu testler ---------- */
/** Dakikayı Müfettiş kategorisine yerleştirir (B5 §7.1). */
function sikayetKategorisi(dakika) {
  const d = Math.max(0, Math.floor(Number(dakika) || 0)), k = D_otopark.kategoriler;
  for (let i = 0; i < k.length; i++) if (d >= k[i].aralik[0] && (k[i].aralik[1] == null || d <= k[i].aralik[1])) return k[i].id;
  return 'gunu-asanlar';
}
/** Başarısız gizli test için balon: girdi/miktar söylenmez, yalnızca bölge ve yön. gercek === null → istisna; 'zaman' → zaman aşımı. */
function sikayetMetni(dakika, gercek, beklenen) {
  if (gercek === 'zaman') return D_otopark.sikayetZamanAsimi;
  if (gercek == null || isNaN(Number(gercek))) return D_otopark.sikayetIstisna;
  const kat = sikayetKategorisi(dakika);
  return Number(gercek) > Number(beklenen) ? D_otopark.sikayetler[kat] : D_otopark.sikayetlerEksik[kat];
}
/** Oyuncuya özel 6 tohumlu test (B5 §1.7 katmanları). tohum: oyuncu adı + gün gibi bir dize; aynı tohum aynı kümeyi verir. */
function tohumluTestler(tohum) {
  let h = 2166136261; const s = String(tohum || 'kodkent');
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  let a = h >>> 0;
  const rnd = function () { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const aralik = function (lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); };
  const K = D_otopark.tohumluKatmanlar, dk = [aralik(K[0].aralik[0], K[0].aralik[1]), aralik(K[1].aralik[0], K[1].aralik[1]), aralik(K[2].aralik[0], K[2].aralik[1]), aralik(K[3].aralik[0], K[3].aralik[1]), 60 * aralik(3, 6), 1440 * aralik(2, 12) + 1];
  return dk.map(function (d, i) { return { id: K[i].id, katman: K[i].katman, dakika: d, beklenen: otoparkUcret(d), etiket: sikayetKategorisi(d) }; });
}
