/* ==== ui/00-base.js — KodKent prototip temel katmanı (P0) ====
   state · localStorage · yönlendirme (KK_UI) · tek delege olay sistemi · HUD · toast · modal · onayla · award · yardımcılar · kodEditor.
   Ekran parçaları bu dosyadaki adları doğrudan kullanır; gerçek imzalar build/proto/API.md'dedir. */

const KK_UI = { sifirlaKancalari: [],
  surum: '1.0', ekranlar: {}, actions: {}, hatalar: [], zamanlar: new Set(),
  acildi: false, hizliMod: false, selftestAktif: false, sonGit: null, mevcut: null
};
window.addEventListener('error', function (e) { KK_UI.hatalar.push({ tur: 'error', mesaj: String(e.message || e.error || 'bilinmeyen hata'), kaynak: (e.filename || '') + ':' + (e.lineno || 0) }); });
window.addEventListener('unhandledrejection', function (e) { const r = e.reason; KK_UI.hatalar.push({ tur: 'unhandledrejection', mesaj: String((r && r.message) || r || 'reddedilen söz'), kaynak: '' }); });

//#SAF-BASLA  (DOM'suz saf dizge üreticileri; tools/proto_export.mjs bu bloğu alır — document/window/state kullanma)
/** HTML kaçış: &, <, >, ", ' karakterlerini dönüştürür. null/undefined → ''. */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
/** tr-TR sayı biçimi: fmt(1234.5, 1) → "1.234,5". */
function fmt(n, d) { d = d || 0; return Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }); }
/** Sprite ikonu: ikon('coin', 20, 'ek-sinif') → <svg…><use href="#i-coin"/></svg>. Çizgi ikonlar currentColor kullanır; renk üst öğenin color'ıdır. */
function ikon(ad, boyut, sinif) {
  const b = Number(boyut) || 20;
  return '<svg class="ik' + (sinif ? ' ' + esc(sinif) : '') + '" width="' + b + '" height="' + b + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use href="#i-' + esc(ad) + '"/></svg>';
}
const CS_KW = new Set(('abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile while async await record init required get set value yield when with nameof').split(' '));
const CS_HARF = /[A-Za-z_@À-ɏİıŞşĞğÜüÖöÇç]/, CS_HARF2 = /[A-Za-z0-9_À-ɏİıŞşĞğÜüÖöÇç]/;
/** C# renklendirme: sınıflar .k (anahtar sözcük) .s (metin) .n (sayı) .c (yorum) .t (tür). Çıktıdaki hiçbir <span> satır sonunu aşmaz (satır satır bölünebilir). */
function csHl(kod) {
  const code = String(kod == null ? '' : kod); let out = '', i = 0;
  const bas = function (cls, txt) { txt.split('\n').forEach(function (p, k) { if (k) out += '\n'; if (p) out += cls ? '<span class="' + cls + '">' + esc(p) + '</span>' : esc(p); }); };
  while (i < code.length) {
    const ch = code[i], nx = code[i + 1];
    if (ch === '/' && nx === '/') { let j = code.indexOf('\n', i); if (j < 0) j = code.length; bas('c', code.slice(i, j)); i = j; continue; }
    if (ch === '/' && nx === '*') { let j = code.indexOf('*/', i + 2); j = j < 0 ? code.length : j + 2; bas('c', code.slice(i, j)); i = j; continue; }
    if (ch === '"' || ch === "'" || ((ch === '$' || ch === '@') && (nx === '"' || ((nx === '$' || nx === '@') && code[i + 2] === '"')))) {
      let j = i; while (j < code.length && code[j] !== '"' && code[j] !== "'") j++;
      const verbatim = code.slice(i, j).indexOf('@') >= 0, q = code[j]; let k = j + 1;
      while (k < code.length) {
        const c = code[k];
        if (c === '\\' && !verbatim) { k += 2; continue; }
        if (c === q) { if (verbatim && code[k + 1] === q) { k += 2; continue; } k++; break; }
        if (c === '\n' && !verbatim) break;
        k++;
      }
      bas('s', code.slice(i, k)); i = k; continue;
    }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(nx || ''))) { let j = i + 1; while (j < code.length && /[0-9A-Za-z_.]/.test(code[j]) && !(code[j] === '.' && code[j + 1] === '.')) j++; bas('n', code.slice(i, j)); i = j; continue; }
    if (CS_HARF.test(ch)) {
      let j = i + 1; while (j < code.length && CS_HARF2.test(code[j])) j++;
      const w = code.slice(i, j);
      bas(CS_KW.has(w) ? 'k' : (/^[A-Z][A-Za-z0-9]*$/.test(w) ? 't' : ''), w); i = j; continue;
    }
    bas('', ch); i++;
  }
  return out;
}
/** Satır numaralı salt okunur kod gövdesi: <pre class="kod kod-no"><code>…csHlSatir(kod)…</code></pre> içine konur. opt: { vurgu:[satırNo…], baslangic:1 }. */
function csHlSatir(kod, opt) {
  const o = opt || {}, bas = Number(o.baslangic) || 1, v = {};
  (o.vurgu || []).forEach(function (n) { v[Number(n)] = true; });
  return csHl(kod).split('\n').map(function (h, k) { return '<span class="kl' + (v[k + bas] ? ' vurgu' : '') + '"><span class="ln" aria-hidden="true">' + (k + bas) + '</span>' + (h || ' ') + '</span>'; }).join('');
}
/** Geri sayım biçimi: 90 → "01:30"; 3725 → "1 sa 02 dk"; 200000 → "2 gün 7 sa". */
function zamanKalan(sn) {
  sn = Math.max(0, Math.floor(Number(sn) || 0));
  const g = Math.floor(sn / 86400), s = Math.floor((sn % 86400) / 3600), d = Math.floor((sn % 3600) / 60), x = sn % 60;
  const p2 = function (n) { return String(n).padStart(2, '0'); };
  if (g > 0) return g + ' gün ' + s + ' sa';
  if (s > 0) return s + ' sa ' + p2(d) + ' dk';
  return p2(d) + ':' + p2(x);
}
//#SAF-BITIR

/* ---- DOM / zaman yardımcıları ---- */
/** İlk eşleşen öğe (varsayılan kök: document). */
function $(sel, kok) { return (kok || document).querySelector(sel); }
/** Tüm eşleşenler (dizi). */
function $$(sel, kok) { return Array.prototype.slice.call((kok || document).querySelectorAll(sel)); }
/** Düşük hareket tercihi ya da selftest hızlı kipi. */
function reducedMotion() { try { return KK_UI.hizliMod || window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return KK_UI.hizliMod; } }
/** bekle(ms) → Promise. Selftest kipinde en çok 20 ms bekler (animasyon gecikmeleri hızlanır). */
function bekle(ms) { return new Promise(function (r) { setTimeout(r, KK_UI.hizliMod ? Math.min(ms, 20) : ms); }); }
/** Panoya kopyalar → Promise<boolean>. Tıklama içinde çağır; hata yakalanır, true/false döner. */
async function kopyala(metin) {
  metin = String(metin == null ? '' : metin);
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(metin); return true; } } catch (e) { /* yedek yola geç */ }
  try {
    const ta = document.createElement('textarea'); ta.value = metin; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return !!ok;
  } catch (e) { return false; }
}
/** Yardımcı: ekran bitince kendiliğinden temizlenen aralık/zaman aşımı (leave/refresh/yeni ekran). */
KK_UI.aralik = function (fn, ms) { const id = setInterval(fn, ms); KK_UI.zamanlar.add(id); return id; };
KK_UI.gecikme = function (fn, ms) { const id = setTimeout(function () { KK_UI.zamanlar.delete(id); fn(); }, ms); KK_UI.zamanlar.add(id); return id; };
KK_UI.hataKaydet = function (e, nerede) { KK_UI.hatalar.push({ tur: 'yakalandi', mesaj: String((e && e.message) || e), kaynak: nerede || '' }); try { console.error('[KodKent]', nerede || '', e); } catch (x) { /* konsol yok */ } };

/* ================= durum (state) ================= */
const DEPO_ANAHTARI = 'kodkent-proto-v1';
/** Sözleşme §4 şeması (anahtar adları sabit). Her çağrıda taze nesne döndürür. */
function defaultState() {
  return {
    v: 1, kurulumTamam: false,
    telefon: '', dogumYili: 0, veli: { durum: 'yok', telefon: '' },
    dil: 'csharp', ad: '',
    avatar: { ten: 0, sacStil: 0, sacRenk: 0, kiyafet: 0, aksesuar: [] },
    xp: 0, bayt: 0, cip: 0,
    dersler: { '1.1': { tamam: false, mohur: false, puanlar: {}, denemeler: {} } },
    gorevler: { 'meydan-saati': { tamam: false, ipucu: 0, ipucusuz: true } },
    ruhsat: { otopark: 0 },
    isletmeler: { otopark: { durum: 'yok', seviye: 1, kod: '', netlestirme: { sorulanlar: [], maddeler: [] }, keskinGoz: false, testler: { acik: [], gizli: [] }, savunma: null, kasa: { bayt: 0, sonTopla: 0 }, gelir7: [] } },
    envanter: [], giyili: { aksesuar: null, emote: [] },
    oda: { esyalar: [], ziyaretci: [], alkis: 0 },
    tekrar: { seri: 0, son: '', dondurma: 1, bugunTamam: false },
    rozetler: [],
    ayarlar: { derinDegerlendirme: false, guvenliMod: false, ses: false, bildirim: { gorev: true, seri: true, etkinlik: false } },
    bekleme: {}, itiraz: { kalan: 3 },
    ekran: {}, ui: { ekran: 'giris' }
  };
}
const state = defaultState();
function duzNesne(x) { return x !== null && typeof x === 'object' && !Array.isArray(x); }
function derinBirlestir(taban, ek) {
  if (!duzNesne(taban) || !duzNesne(ek)) return ek === undefined ? taban : ek;
  const s = {}; Object.keys(taban).forEach(function (k) { s[k] = taban[k]; });
  Object.keys(ek).forEach(function (k) { s[k] = (k in taban) ? derinBirlestir(taban[k], ek[k]) : ek[k]; });
  return s;
}
/** `state` nesnesinin içeriğini yerinde değiştirir (başka yerde tutulan başvurular geçerli kalır). */
function durumUygula(yeni) { Object.keys(state).forEach(function (k) { delete state[k]; }); Object.assign(state, yeni); }
/** state'i localStorage'a yazar (her hata yakalanır; kayıt yoksa oyun yine çalışır). */
function save() { try { localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(state)); return true; } catch (e) { return false; } }
/** load() için tip denetimli birleştirme: bozuk/elle değiştirilmiş kayıttaki yanlış tipli değerler (xp:'abc', dersler:[], envanter:'x'…) varsayılanla değiştirilir; ekranlar çökmez. */
function tipliBirlestir(taban, ek) {
  if (ek === undefined) return taban;
  if (duzNesne(taban)) {
    if (!duzNesne(ek)) return taban;
    const s = {}; Object.keys(taban).forEach(function (k) { s[k] = taban[k]; });
    Object.keys(ek).forEach(function (k) { if (k === '__proto__' || k === 'constructor' || k === 'prototype') return; s[k] = (k in taban) ? tipliBirlestir(taban[k], ek[k]) : ek[k]; });
    return s;
  }
  if (Array.isArray(taban)) return Array.isArray(ek) ? ek : taban;
  if (typeof taban === 'number') return (typeof ek === 'number' && isFinite(ek)) ? ek : taban;
  if (typeof taban === 'string') return typeof ek === 'string' ? ek : taban;
  if (typeof taban === 'boolean') return typeof ek === 'boolean' ? ek : taban;
  return ek;
}
/** localStorage'tan yükler; eksik anahtarlar defaultState ile tamamlanır. → boolean (kayıt bulundu mu). */
function load() {
  try {
    const ham = localStorage.getItem(DEPO_ANAHTARI); if (!ham) return false;
    const kayit = JSON.parse(ham); if (!duzNesne(kayit) || kayit.v !== 1) return false;
    const s = tipliBirlestir(defaultState(), kayit); ['xp', 'bayt', 'cip'].forEach(function (k) { s[k] = Math.max(0, Math.floor(s[k])); }); ['dersler', 'gorevler', 'isletmeler'].forEach(function (k) { Object.keys(s[k]).forEach(function (id) { if (!duzNesne(s[k][id])) delete s[k][id]; }); }); durumUygula(s); return true;
  } catch (e) { return false; }
}
/** Kaydı siler ve state'i sıfırlar (ardından çağıran go('giris') der). */
function sifirla() {
  try { localStorage.removeItem(DEPO_ANAHTARI); } catch (e) { /* kayıt yok */ }
  durumUygula(defaultState()); KK_UI.sifirlaKancalari.forEach(function (f) { try { f(); } catch (e) { /* kanca hatası sıfırlamayı engellemesin */ } }); KK_UI.mevcut = null; hud(); demoCubukGuncelle();
}
/** Örnek oyuncu "Deniz": Sev. 3 (340 XP), 320 B, Çarşı 1.1–1.3 tamam + mühürlü, Ruhsat 2/3, Taksimetre AÇIK, 2 Sıradan kozmetik, seri 2. */
function hizliKurulum() {
  const ds = defaultState(), D = (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {};
  const dun = new Date(Date.now() - 86400000), dunS = dun.getFullYear() + '-' + String(dun.getMonth() + 1).padStart(2, '0') + '-' + String(dun.getDate()).padStart(2, '0');
  const sir = (D.magaza || []).filter(function (u) { return u.nadirlik === 'Sıradan' && u.para === 'bayt'; }).slice(0, 2).map(function (u) { return u.id; });
  Object.assign(ds, { kurulumTamam: true, telefon: '5XX XXX XX XX', dogumYili: 2004, ad: 'Deniz', xp: 340, bayt: 320, cip: 0,
    avatar: { ten: 2, sacStil: 3, sacRenk: 1, kiyafet: 2, aksesuar: [] }, envanter: sir.length ? sir : ['cirak-sapkasi', 'bere'],
    tekrar: { seri: 2, son: dunS, dondurma: 1, bugunTamam: false } });
  ds.dersler = {};
  ['1.1', '1.2', '1.3'].forEach(function (id) { ds.dersler[id] = { tamam: true, mohur: true, puanlar: { [id + '-s1']: 88, [id + '-s2']: 76, [id + '-s3']: 92 }, denemeler: { [id + '-s1']: 1, [id + '-s2']: 1, [id + '-s3']: 1 } }; });
  ds.gorevler = {};
  ['meydan-saati', 'dakikadan-saate', 'kademeli-karar'].forEach(function (id) { ds.gorevler[id] = { tamam: true, ipucu: 0, ipucusuz: true }; });
  ds.gorevler.taksimetre = { tamam: false, ipucu: 0, ipucusuz: true };
  ds.ruhsat = { otopark: 2 };
  ds.ui = { ekran: 'meydan', demo: true };
  durumUygula(ds); save(); demoCubukGuncelle();
  return state;
}
/** Ders kaydı (yoksa varsayılanla oluşturur ve döndürür). */
function dersKaydi(id) { return state.dersler[id] || (state.dersler[id] = { tamam: false, mohur: false, puanlar: {}, denemeler: {} }); }
/** Görev kaydı (yoksa oluşturur). */
function gorevKaydi(id) { return state.gorevler[id] || (state.gorevler[id] = { tamam: false, ipucu: 0, ipucusuz: true }); }
/** İşletme kaydı (yoksa oluşturur). Otopark için state.isletmeler.otopark ile aynı şekil. */
function isletmeKaydi(id) {
  return state.isletmeler[id] || (state.isletmeler[id] = { durum: 'yok', seviye: 1, kod: '', netlestirme: { sorulanlar: [], maddeler: [] }, keskinGoz: false, testler: { acik: [], gizli: [] }, savunma: null, kasa: { bayt: 0, sonTopla: 0 }, gelir7: [] });
}
/** Seviye bilgisi: seviyeHesapla(state.xp) + unvan + yuzde (0–100) + sonrakiUnvan. */
function seviyeBilgi(xp) {
  const sv = seviyeHesapla(xp == null ? state.xp : xp);
  return Object.assign({}, sv, { unvan: unvan(sv.seviye), yuzde: sv.gereken ? Math.max(0, Math.min(100, Math.round(100 * sv.kalan / sv.gereken))) : 100 });
}
/** Sıradaki görev kartı (HUD): Ruhsat görevleri → dersler → Otopark → Günlük Tekrar. Ekranlar KK_UI.siradakiGorev = fn ile değiştirebilir. */
KK_UI.siradakiGorev = function () {
  const D = (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}, sv = seviyeBilgi().seviye;
  const acikGorev = (D.gorevler || []).filter(function (g) { return g.ruhsat && g.acilisSeviye <= sv && !(state.gorevler[g.id] || {}).tamam; });
  const acikDers = (D.dersler || []).filter(function (d) { return d.durum === 'acik' && !(state.dersler[d.id] || {}).tamam; });
  const sayi = acikGorev.length + acikDers.length;
  if (acikGorev.length) return { ad: acikGorev[0].ad, ekran: 'atolye', sayi: sayi };
  if (acikDers.length) return { ad: 'Ders ' + acikDers[0].id + ': ' + acikDers[0].baslik, ekran: 'akademi', sayi: sayi };
  if (state.ruhsat.otopark >= 3 && (isletmeKaydi('otopark').durum === 'yok' || isletmeKaydi('otopark').durum === 'satilik')) return { ad: 'Otopark Tapusu', ekran: 'sokak', sayi: 1 };
  return { ad: state.tekrar.bugunTamam ? 'Meydan Sorusu' : 'Günlük Tekrar', ekran: state.tekrar.bugunTamam ? 'meydan' : 'tekrar', sayi: state.tekrar.bugunTamam ? 0 : 1 };
};
/** HUD hedef çubuğu: { metin, yuzde }. Ekranlar KK_UI.hedef = fn ile değiştirebilir. */
KK_UI.hedef = function () {
  const o = isletmeKaydi('otopark'), sv = seviyeBilgi().seviye;
  if (o.durum === 'yok' || o.durum === 'satilik') {
    const k = [Math.min(1, state.bayt / 300), Math.min(1, state.ruhsat.otopark / 3), Math.min(1, sv / 3)];
    return { metin: 'Hedef: Otopark · ' + fmt(Math.min(state.bayt, 9999)) + '/300 B · Ruhsat ' + state.ruhsat.otopark + '/3 · Sev. ' + sv + '/3', yuzde: Math.round(100 * (k[0] + k[1] + k[2]) / 3) };
  }
  if (o.durum === 'kapali') return { metin: "Hedef: Otopark'ı kodla · İş Emri'ni aç", yuzde: 25 };
  if (o.durum === 'deneme') return { metin: "Hedef: Gizli testleri geç, Açılış'a ulaş", yuzde: 70 };
  if (o.durum === 'kararmis') return { metin: "Hedef: Otopark'ı onar · Müfettiş'in dosyasına bak", yuzde: 40 };
  return { metin: 'Hedef: Büfe · ' + fmt(Math.min(state.bayt, 9999)) + '/600 B · Sev. ' + sv + '/4', yuzde: Math.round(100 * (Math.min(1, state.bayt / 600) + Math.min(1, sv / 4)) / 2) };
};

/* ================= HTML parça üreticileri (saf dizge) ================= */
/** Sayaç hapı. tur: 'bayt'|'cip'|'xp'|'alev'; opt: { kucuk:bool, baslik:string }. */
function sayacHtml(tur, deger, opt) {
  const o = opt || {}, ic = { bayt: 'coin', cip: 'chip', xp: 'xp', alev: 'alev' }[tur] || 'coin', birim = { bayt: 'B', cip: '', xp: 'XP', alev: 'gün' }[tur] || '';
  return '<span class="sayac sayac-' + esc(tur) + (o.kucuk ? ' sayac-kucuk' : '') + '"' + (o.baslik ? ' title="' + esc(o.baslik) + '"' : '') + '>' + ikon(ic, 28) + '<b data-sayac="' + esc(tur) + '">' + fmt(deger) + '</b>' + (birim ? '<small>' + birim + '</small>' : '') + '</span>';
}
/** İlerleme çubuğu. opt: { tur:'xp'|'bayt'|'nane'|'mercan'|'cip'|'' , ince, kalin, sessiz (parlamasız), etiket }. */
function cubukHtml(yuzde, opt) {
  const o = opt || {}, y = Math.max(0, Math.min(100, Math.round(Number(yuzde) || 0)));
  return '<div class="cubuk' + (o.tur ? ' cubuk-' + esc(o.tur) : '') + (o.ince ? ' cubuk-ince' : '') + (o.kalin ? ' cubuk-kalin' : '') + (o.sessiz ? ' cubuk-sessiz' : '') + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + y + '"' + (o.etiket ? ' aria-label="' + esc(o.etiket) + '"' : '') + '><i style="width:' + y + '%"></i></div>';
}
/** Dairesel ilerleme halkası (SVG). opt: { boyut:96, tur:'mor'|'nane'|'amber'|'mercan'|'', metin, alt, etiket }. */
function halkaHtml(yuzde, opt) {
  const o = opt || {}, y = Math.max(0, Math.min(100, Number(yuzde) || 0)), C = 2 * Math.PI * 42, b = Number(o.boyut) || 96, metin = o.metin != null ? o.metin : Math.round(y);
  return '<svg class="halka' + (o.tur ? ' halka-' + esc(o.tur) : '') + '" width="' + b + '" height="' + b + '" viewBox="0 0 100 100" role="img" aria-label="' + esc(o.etiket || ('%' + Math.round(y))) + '"><circle class="halka-iz" cx="50" cy="50" r="42"/><circle class="halka-dolgu" cx="50" cy="50" r="42" transform="rotate(-90 50 50)" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + (C * (1 - y / 100)).toFixed(2) + '"/><text class="halka-metin" x="50" y="' + (o.alt ? 45 : 51) + '">' + esc(metin) + '</text>' + (o.alt ? '<text class="halka-alt" x="50" y="68">' + esc(o.alt) + '</text>' : '') + '</svg>';
}
/** Chip: chipHtml('Nadir', 'mor', 'xp'). tur: turkuaz|amber|mercan|nane|mor|kobalt|gri. */
function chipHtml(metin, tur, ikonAd) { return '<span class="chip' + (tur ? ' chip-' + esc(tur) : '') + '">' + (ikonAd ? ikon(ikonAd, 14) : '') + esc(metin) + '</span>'; }
/** İşletme durumu (KANON §8): durum 'yok'|'satilik'|'kapali'|'deneme'|'acik'|'kararmis' → şekil + metin. */
function isletmeDurumHtml(durum) {
  const e = { yok: 'Arsa yok', satilik: 'Satılık', kapali: 'Kapalı — yazılım bekliyor', deneme: 'Deneme (%50 gelir)', acik: 'Açık', kararmis: 'Kararmış' };
  return '<span class="durum durum-' + esc(durum) + '">' + esc(e[durum] || durum) + '</span>';
}
/** Boş/hata durumu. o: { ikon, baslik, metin, buton:{ ad, aksiyon, sinif }, hata:bool }. */
function bosHtml(o) {
  o = o || {};
  return '<div class="bos' + (o.hata ? ' bos-hata' : '') + '" role="status"><div class="bos-ik">' + ikon(o.ikon || (o.hata ? 'uyari' : 'kutu'), 30) + '</div>' + (o.baslik ? '<h3>' + esc(o.baslik) + '</h3>' : '') + (o.metin ? '<p>' + esc(o.metin) + '</p>' : '') +
    (o.buton ? '<button type="button" class="btn ' + esc(o.buton.sinif || 'btn-birincil') + '" data-action="' + esc(o.buton.aksiyon) + '">' + esc(o.buton.ad) + '</button>' : '') + '</div>';
}
/** Yükleniyor satırı (dönen simge + metin). */
function yukleniyorHtml(mesaj) { return '<div class="yukleniyor-kutu" role="status" aria-live="polite"><span class="donus" aria-hidden="true"></span><span>' + esc(mesaj || 'Yükleniyor…') + '</span></div>'; }
/** Hata kutusu: hataHtml('Kayıt okunamadı', { tekrar:'aksiyon-adi' }). */
function hataHtml(mesaj, o) { o = o || {}; return bosHtml({ hata: true, baslik: o.baslik || 'Bir sorun çıktı', metin: mesaj, buton: o.tekrar ? { ad: o.tekrarAd || 'Tekrar dene', aksiyon: o.tekrar, sinif: 'btn-mor' } : null }); }
/** Salt okunur kod bloğu: kodHtml(kod, { vurgu:[3], satirNo:true, baslik:'Otopark.cs' }). */
function kodHtml(kod, o) {
  o = o || {}; const no = o.satirNo !== false;
  return (o.baslik ? '<div class="kod-baslik">' + ikon('kod', 14) + esc(o.baslik) + '</div>' : '') + '<pre class="kod' + (no ? ' kod-no' : '') + '" tabindex="0"><code>' + (no ? csHlSatir(kod, o) : csHl(kod)) + '</code></pre>';
}
/** Test satırı. t: { ad, durum:'gecti'|'kaldi'|'hata'|'bekliyor', girdi, beklenen, gercek, hata }. */
function testSatirHtml(t) {
  const d = t.durum || 'bekliyor', ik = { gecti: 'test-gecti', kaldi: 'test-kaldi', hata: 'uyari', bekliyor: 'saat' }[d] || 'saat';
  const etiket = { gecti: ['Geçti', 'nane'], kaldi: ['Kaldı', 'mercan'], hata: ['Hata', 'amber'], bekliyor: ['Bekliyor', 'gri'] }[d] || ['', 'gri'];
  const det = [];
  if (t.girdi != null) det.push('girdi: <b>' + esc(t.girdi) + '</b>'); if (t.beklenen != null) det.push('beklenen: <b>' + esc(t.beklenen) + '</b>'); if (t.gercek != null) det.push('gerçek: <b>' + esc(t.gercek) + '</b>');
  return '<div class="test-satir ' + esc(d) + '"><span class="test-ik">' + ikon(ik, 24, d === 'hata' ? '' : '') + '</span><span class="test-ad">' + esc(t.ad || t.id || '') + '</span><span class="test-sag">' + chipHtml(etiket[0], etiket[1]) + '</span>' + (det.length || t.hata ? '<div class="test-detay">' + det.join(' · ') + (t.hata ? (det.length ? '<br>' : '') + esc(t.hata) : '') + '</div>' : '') + '</div>';
}
/** Sohbet balonu: balonHtml('Selam', { tur:'ben'|'usta'|'sistem'|'', ad:'ayse_kod' }). */
function balonHtml(metin, o) { o = o || {}; return '<div class="balon' + (o.tur ? ' balon-' + esc(o.tur) : '') + (o.kuyruk ? ' balon-kuyruk' : '') + '">' + (o.ad ? '<div class="balon-ad">' + esc(o.ad) + '</div>' : '') + esc(metin) + '</div>'; }

/* ================= HUD (sabit katman) ================= */
/** HUD'u gösterir/gizler (gösterirken yeniden çizer). */
function hudGoster(goster) { const h = $('#hud'); if (!h) return; h.hidden = !goster; if (goster) hud(); }
/** HUD'u state'e göre yeniden çizer (gizliyse çizmez). Ekranlar state değiştirince hud() çağırır; award() bunu kendisi yapar. */
function hud() {
  const h = $('#hud'); if (!h || h.hidden) return;
  const sv = seviyeBilgi(), gorev = KK_UI.siradakiGorev(), hedef = KK_UI.hedef(), C = 2 * Math.PI * 23, ad = state.ad || 'Misafir';
  const av = (typeof avatarSvg === 'function') ? avatarSvg(state.avatar, { boyut: 40, kadraj: 'bust' }) : '';
  const xpYazi = sv.gereken ? fmt(sv.kalan) + ' / ' + fmt(sv.gereken) + ' XP' : 'MAKS';
  const sonraki = sv.gereken ? 'Sev. ' + (sv.seviye + 1) + "'e " + fmt(sv.gereken - sv.kalan) + ' XP' : 'Seviye tavanı';
  const btn = function (hedefEkran, ic, yazi, ad2, ek, rozet) { return '<button type="button" class="hud-btn' + (ek || '') + '" data-go="' + hedefEkran + '" title="' + esc(ad2) + '" aria-label="' + esc(ad2) + '">' + ikon(ic, 24) + (rozet ? '<span class="hud-rozet">' + rozet + '</span>' : '') + '<span class="hud-btn-yazi">' + yazi + '</span></button>'; };
  h.innerHTML = '<div class="hud-satir"><button type="button" class="hud-kimlik" data-go="profil" aria-label="Profil: ' + esc(ad) + ', ' + esc(sv.unvan) + ', Seviye ' + sv.seviye + '">' +
    '<span class="hud-avatar"><svg class="hud-halka" viewBox="0 0 52 52" aria-hidden="true"><circle class="halka-iz" cx="26" cy="26" r="23" fill="none" stroke-width="5"/><circle class="halka-dolgu" data-hud="halka" cx="26" cy="26" r="23" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + (C * (1 - sv.yuzde / 100)).toFixed(2) + '"/></svg>' +
    '<span class="hud-av">' + av + '</span><b class="hud-sev" data-hud="sev">' + sv.seviye + '</b></span>' +
    '<span class="hud-metin"><span class="hud-ad">' + esc(ad) + '</span><span class="hud-unvan">' + esc(sv.unvan) + ' · Sev. ' + sv.seviye + '</span><span class="hud-xp-mini">' + cubukHtml(sv.yuzde, { tur: 'xp', ince: true, etiket: 'XP' }).replace('<i ', '<i data-hud="xpbar" ') + '</span></span></button>' +
    '<div class="hud-xp">' + cubukHtml(sv.yuzde, { tur: 'xp', etiket: 'XP' }).replace('<i ', '<i data-hud="xpbar" ') + '<div class="hud-xp-yazi"><span>' + ikon('xp', 14) + '<b data-hud="xpyazi">' + xpYazi + '</b></span><span>' + sonraki + '</span></div></div>' +
    '<div class="hud-sayaclar">' + sayacHtml('bayt', state.bayt, { baslik: 'Bayt' }) + sayacHtml('cip', state.cip, { baslik: 'Çip' }) + '</div>' +
    '<nav class="hud-nav" aria-label="Kısayollar">' + btn(gorev.ekran, 'gorev', 'Görev', 'Görev kartı: ' + gorev.ad, ' hud-gorev', gorev.sayi || '') + btn('pazar', 'pazar', 'Pazar', 'Pazar') + btn('liderlik', 'kupa', 'Liderlik', 'Liderlik Panosu') + btn('sohbet', 'sohbet', 'Sohbet', 'Sohbet ve Arkadaşlar') + btn('ayarlar', 'disli', 'Ayarlar', 'Ayarlar ve Hesap') + '</nav></div>' +
    '<div class="hud-hedef">' + ikon('hedef', 16) + '<span class="hud-hedef-yazi">' + esc(hedef.metin) + '</span>' + cubukHtml(hedef.yuzde, { tur: 'bayt', ince: true, sessiz: true, etiket: 'Hedef ilerlemesi' }) + '</div>';
}

/* ================= toast ================= */
const TOAST_TUR = { ok: 'basari', success: 'basari', warn: 'uyari', error: 'hata', info: 'bilgi' };
/** Geçici bildirim: toast('Kaydedildi', 'basari'). tur: 'bilgi'|'basari'|'uyari'|'hata'. → { kapat() } */
function toast(mesaj, tur, sureMs) {
  const kok = $('#toast-root'); if (!kok) return null;
  tur = TOAST_TUR[tur] || tur || 'bilgi';
  const ic = { bilgi: 'bilgi', basari: 'test-gecti', uyari: 'uyari', hata: 'test-kaldi' }[tur] || 'bilgi';
  $$('.toast', kok).forEach(function (t) { if (t.dataset.mesaj === String(mesaj)) t.remove(); });
  const el = document.createElement('div'); el.className = 'toast toast-' + tur; el.dataset.mesaj = String(mesaj);
  el.setAttribute('role', tur === 'hata' ? 'alert' : 'status');
  el.innerHTML = ikon(ic, 22) + '<span>' + esc(mesaj) + '</span>';
  kok.prepend(el); while (kok.children.length > 3) kok.lastElementChild.remove();
  let bitti = false;
  const kapat = function () { if (bitti) return; bitti = true; el.classList.add('cikiyor'); setTimeout(function () { el.remove(); }, KK_UI.hizliMod ? 0 : 260); };
  el.addEventListener('click', kapat);
  if (!KK_UI.selftestAktif) setTimeout(kapat, sureMs || (tur === 'hata' ? 5200 : 3600));
  return { kapat: kapat, el: el };
}

/* ================= modal / onayla ================= */
const modalYigin = [];
let modalSayac = 0;
function modalEngelle() { const var_ = modalYigin.length > 0; ['#screen', '#hud'].forEach(function (s) { const e = $(s); if (e) { try { e.inert = var_; } catch (x) { /* inert yok */ } } }); }
/**
 * Sayfa içi modal. o: { baslik, html, ikon, butonlar:[{ ad, aksiyon (fonksiyon ya da data-action adı), birincil, tehlike, kapat:false (kapatma), veri }], kapatilabilir:true, genis, sinif, onKapat(deger) }.
 * Varsayılan butonlar: [{ ad:'Tamam', birincil:true }]. → { kapat(deger), el, govde, guncelle(html), kapandi:Promise }. Esc / dış tık / X ile kapanır (kapatilabilir:false hariç).
 */
function modal(o) {
  o = o || {};
  const kok = $('#modal-root'), kapatilabilir = o.kapatilabilir !== false, id = 'modal-' + (++modalSayac);
  const butonlar = o.butonlar !== undefined ? o.butonlar : [{ ad: 'Tamam', birincil: true }];
  const arka = document.createElement('div'); arka.className = 'modal-arka';
  arka.innerHTML = '<div class="modal' + (o.genis ? ' modal-genis' : '') + (o.sinif ? ' ' + esc(o.sinif) : '') + '" role="dialog" aria-modal="true" ' + (o.baslik ? 'aria-labelledby="' + id + '-b"' : 'aria-label="İletişim kutusu"') + ' tabindex="-1">' +
    (kapatilabilir ? '<button type="button" class="modal-kapat" data-modal-kapat aria-label="Kapat">' + ikon('carpi', 20) + '</button>' : '') +
    (o.baslik ? '<div class="modal-baslik" id="' + id + '-b">' + (o.ikon ? ikon(o.ikon, 26) : '') + '<span>' + esc(o.baslik) + '</span></div>' : '') +
    '<div class="modal-govde">' + (o.html || '') + '</div>' +
    (butonlar.length ? '<div class="modal-alt">' + butonlar.map(function (b, i) { return '<button type="button" class="btn' + (b.birincil ? ' btn-birincil' : '') + (b.tehlike ? ' btn-tehlike' : '') + (b.sinif ? ' ' + esc(b.sinif) : '') + '" data-modal-btn="' + i + '"' + (b.veri ? ' data-veri="' + esc(b.veri) + '"' : '') + '>' + esc(b.ad) + '</button>'; }).join('') + '</div>' : '') + '</div>';
  const oncekiOdak = document.activeElement; let kapandi = false, coz;
  const sozu = new Promise(function (r) { coz = r; });
  const nesne = { el: arka, govde: $('.modal-govde', arka), kapandi: sozu, kapatilabilir: kapatilabilir,
    guncelle: function (html) { nesne.govde.innerHTML = html; },
    kapat: function (deger) {
      if (kapandi) return; kapandi = true;
      const i = modalYigin.indexOf(nesne); if (i >= 0) modalYigin.splice(i, 1);
      arka.remove(); modalEngelle();
      try { if (oncekiOdak && oncekiOdak.isConnected && oncekiOdak.focus) oncekiOdak.focus({ preventScroll: true }); } catch (e) { /* odak yok */ }
      if (typeof o.onKapat === 'function') { try { o.onKapat(deger); } catch (e) { KK_UI.hataKaydet(e, 'modal.onKapat'); } }
      coz(deger);
    } };
  arka.addEventListener('click', function (ev) {
    if (ev.target === arka) { if (kapatilabilir) nesne.kapat(false); return; }
    if (ev.target.closest('[data-modal-kapat]')) { nesne.kapat(false); return; }
    const b = ev.target.closest('[data-modal-btn]'); if (!b) return;
    const tanim = butonlar[Number(b.dataset.modalBtn)]; let sonuc;
    try {
      if (tanim && typeof tanim.aksiyon === 'function') sonuc = tanim.aksiyon(nesne, b);
      else if (tanim && typeof tanim.aksiyon === 'string') { const fn = actionBul(tanim.aksiyon); if (fn) sonuc = fn(b, ev); }
    } catch (e) { KK_UI.hataKaydet(e, 'modal.aksiyon'); }
    if (!tanim || (tanim.kapat !== false && sonuc !== false)) nesne.kapat(tanim ? tanim.ad : undefined);
  });
  kok.appendChild(arka); modalYigin.push(nesne); modalEngelle();
  const ilk = $('[data-modal-btn].btn-birincil', arka) || $('[data-modal-btn]', arka) || $('.modal', arka);
  try { ilk.focus({ preventScroll: true }); } catch (e) { /* odak yok */ }
  return nesne;
}
/** Sayfa içi onay (confirm YOK): onayla('Silinsin mi?', 'Sil', 'Vazgeç') → Promise<boolean>. Düğmeler: [data-veri="onayla-evet"] / [data-veri="onayla-hayir"]. */
function onayla(mesaj, evetAd, hayirAd) {
  return new Promise(function (coz) {
    modal({ baslik: 'Emin misin?', ikon: 'bilgi', html: '<p>' + esc(mesaj) + '</p>', butonlar: [
      { ad: hayirAd || 'Vazgeç', veri: 'onayla-hayir', aksiyon: function () { coz(false); } },
      { ad: evetAd || 'Evet', birincil: true, veri: 'onayla-evet', aksiyon: function () { coz(true); } }], onKapat: function () { coz(false); } });
  });
}
KK_UI.modalTemizle = function () { modalYigin.slice().forEach(function (m) { m.kapat(false); }); };
KK_UI.acikModalSayisi = function () { return modalYigin.length; };

/* ================= ödül / harcama / seviye atlama ================= */
/** B2 §3.2 Seviye Hediyesi: HİÇBİR ZAMAN Bayt/Çip/XP değildir (dolap slotu, emote, oda kapasitesi, kıyafet, tabela rengi). */
function seviyeHediyesi(L) {
  const D = (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}, k = (D.seviyeHediyeleri || []).filter(function (h) { return h.seviye === L; })[0];
  if (k) return k;
  const band = L < 12 ? 0 : L < 25 ? 1 : L < 40 ? 2 : 3;
  switch (L % 5) {
    case 1: { const n = [2, 4, 6, 8][band]; return { seviye: L, ad: 'Dolap slotu +' + n, aciklama: 'Dolabında ' + n + ' yeni yer açıldı.' }; }
    case 2: return { seviye: L, ad: 'Yeni emote', aciklama: 'Emote çarkına bir yuva ve yeni bir emote eklendi.' };
    case 3: { const n = [3, 5, 5, 10][band]; return { seviye: L, ad: 'Oda kapasitesi +' + n, aciklama: 'Odana ' + n + ' eşya daha sığar.' }; }
    case 4: return { seviye: L, ad: 'Kıyafet parçası', aciklama: (band === 0 ? 'Sıradan' : 'Şık') + ' bir kıyafet parçası dolabına eklendi.' };
    default: return { seviye: L, ad: 'Tabela rengi', aciklama: 'Tabelan ve profil çerçeven için yeni bir renk açıldı.' };
  }
}
function seviyeAtlaGoster(eski, yeni) {
  const terfi = yeni.unvan !== eski.unvan, hediyeler = [];
  for (let L = eski.seviye + 1; L <= yeni.seviye && hediyeler.length < 3; L++) hediyeler.push(seviyeHediyesi(L));
  const html = '<div class="seviye-atla">' + halkaHtml(100, { boyut: 132, tur: 'mor', metin: yeni.seviye, alt: 'SEVİYE', etiket: 'Seviye ' + yeni.seviye }) +
    (terfi ? '<div class="seviye-unvan">' + ikon('madalya', 22) + 'Yeni unvan: ' + esc(yeni.unvan) + '</div>' : '') +
    (yeni.seviye - eski.seviye > 1 ? '<p class="soluk">' + (yeni.seviye - eski.seviye) + ' seviye birden atladın.</p>' : '') +
    hediyeler.map(function (h) { return '<div class="hediye-kart">' + ikon('hediye', 32) + '<div><b>Seviye Hediyesi: ' + esc(h.ad) + '</b><small>' + esc(h.aciklama) + '</small></div></div>'; }).join('') + '</div>';
  const m = modal({ baslik: terfi ? 'Unvan terfisi!' : 'Seviye ' + yeni.seviye + '!', ikon: terfi ? 'madalya' : 'xp', html: html, butonlar: [{ ad: 'Harika!', birincil: true, veri: 'seviye-tamam' }] });
  konfeti({ adet: terfi ? 70 : 36 });
  return m;
}
function sayacAnim(tur, a, b, sure) {
  const els = $$('[data-sayac="' + tur + '"]'); if (!els.length) return;
  const t0 = performance.now();
  const adim = function (t) { const p = Math.min(1, (t - t0) / sure), v = Math.round(a + (b - a) * (1 - Math.pow(1 - p, 3))); els.forEach(function (e) { e.textContent = fmt(v); }); if (p < 1) requestAnimationFrame(adim); };
  requestAnimationFrame(adim);
  els.forEach(function (e) { const s = e.closest('.sayac'); if (s) { s.classList.remove('zipla'); void s.offsetWidth; s.classList.add('zipla'); } });
}
function merkezNokta(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
/**
 * Ödül: state'e EKLER (çağıran ayrıca state.xp/bayt/cip artırmaz), kaydeder, HUD sayaçlarını canlandırır, uçan etiket gösterir, seviye atlanırsa modal açar.
 * o: { xp, bayt, cip, etiket, kaynak:Element }. Negatif değerler düşer (harcama için harca() kullan). → Promise<{ seviyeAtladi, eskiSeviye, yeniSeviye, unvanTerfisi, yeniUnvan }>
 * Seviye atlama modalı kapanana kadar sözü bekler (selftest kipinde beklemez).
 */
async function award(o) {
  o = o || {};
  const dxp = Math.round(Number(o.xp) || 0), dbayt = Math.round(Number(o.bayt) || 0), dcip = Math.round(Number(o.cip) || 0);
  const once = { xp: state.xp, bayt: state.bayt, cip: state.cip, bilgi: seviyeBilgi() };
  state.xp = Math.max(0, state.xp + dxp); state.bayt = Math.max(0, state.bayt + dbayt); state.cip = Math.max(0, state.cip + dcip);
  const sonra = seviyeBilgi(); save();
  const sonuc = { seviyeAtladi: sonra.seviye > once.bilgi.seviye, eskiSeviye: once.bilgi.seviye, yeniSeviye: sonra.seviye, unvanTerfisi: sonra.unvan !== once.bilgi.unvan, yeniUnvan: sonra.unvan };
  const h = $('#hud'), kok = $('#float-root');
  if (reducedMotion() || !h || h.hidden || !kok) {
    hud();
  } else {
    const bas = o.kaynak && o.kaynak.getBoundingClientRect ? merkezNokta(o.kaynak) : { x: window.innerWidth / 2, y: window.innerHeight * 0.42 };
    const liste = [];
    if (o.etiket) liste.push({ sinif: 'ucan-etiket', html: esc(o.etiket), hedef: null });
    if (dxp) liste.push({ sinif: dxp > 0 ? 'ucan-xp' : 'ucan-eksi', html: ikon('xp', 26) + (dxp > 0 ? '+' : '−') + fmt(Math.abs(dxp)) + ' XP', hedef: '[data-hud="xpyazi"]' });
    if (dbayt) liste.push({ sinif: dbayt > 0 ? 'ucan-bayt' : 'ucan-eksi', html: ikon('coin', 26) + (dbayt > 0 ? '+' : '−') + fmt(Math.abs(dbayt)) + ' B', hedef: '[data-sayac="bayt"]' });
    if (dcip) liste.push({ sinif: dcip > 0 ? 'ucan-cip' : 'ucan-eksi', html: ikon('chip', 26) + (dcip > 0 ? '+' : '−') + fmt(Math.abs(dcip)) + ' Çip', hedef: '[data-sayac="cip"]' });
    liste.forEach(function (e, i) {
      const el = document.createElement('div'); el.className = 'ucan ' + e.sinif; el.innerHTML = e.html;
      const y0 = bas.y + (i - (liste.length - 1) / 2) * 50; el.style.left = bas.x + 'px'; el.style.top = y0 + 'px'; kok.appendChild(el);
      const hd = e.hedef ? $(e.hedef) : null, hp = hd ? merkezNokta(hd) : { x: bas.x, y: y0 - 90 }, dx = hp.x - bas.x, dy = hp.y - y0, P = 'translate(-50%,-50%) ';
      const a = el.animate([{ transform: P + 'translate(0,12px) scale(.6)', opacity: 0 }, { transform: P + 'translate(0,-4px) scale(1.12)', opacity: 1, offset: 0.16 }, { transform: P + 'translate(0,-26px) scale(1)', opacity: 1, offset: 0.5 }, { transform: P + 'translate(' + dx + 'px,' + dy + 'px) scale(.5)', opacity: 0.1 }], { duration: 1100, delay: i * 140, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' });
      a.onfinish = function () { el.remove(); };
    });
    await bekle(520 + liste.length * 100);
    if (dxp) { const yz = $('[data-hud="xpyazi"]'); if (yz && !sonuc.seviyeAtladi) yz.textContent = sonra.gereken ? fmt(sonra.kalan) + ' / ' + fmt(sonra.gereken) + ' XP' : 'MAKS'; }
    if (dbayt) sayacAnim('bayt', once.bayt, state.bayt, 800);
    if (dcip) sayacAnim('cip', once.cip, state.cip, 800);
    const yuzde = sonuc.seviyeAtladi ? 100 : sonra.yuzde, C = 2 * Math.PI * 23;
    $$('[data-hud="xpbar"]').forEach(function (b) { b.style.width = yuzde + '%'; });
    const hl = $('[data-hud="halka"]'); if (hl) hl.style.strokeDashoffset = (C * (1 - yuzde / 100)).toFixed(2);
    await bekle(950);
    hud();
  }
  if (sonuc.seviyeAtladi) { const m = seviyeAtlaGoster(once.bilgi, sonra); if (!KK_UI.selftestAktif) await m.kapandi; hud(); }
  return sonuc;
}
/** Harcama: yeterli bakiye varsa düşer ve HUD'u canlandırır → true; yoksa Türkçe toast gösterir → false. o: { bayt, cip, etiket, kaynak }. */
function harca(o) {
  o = o || {}; const bayt = Math.round(Number(o.bayt) || 0), cip = Math.round(Number(o.cip) || 0);
  if (state.bayt < bayt) { toast('Yetersiz bakiye: ' + fmt(bayt) + ' B gerekir, sende ' + fmt(state.bayt) + ' B var.', 'uyari'); return false; }
  if (state.cip < cip) { toast('Yetersiz Çip: ' + fmt(cip) + ' Çip gerekir, sende ' + fmt(state.cip) + ' Çip var.', 'uyari'); return false; }
  award({ bayt: -bayt, cip: -cip, etiket: o.etiket, kaynak: o.kaynak });
  return true;
}
/** Konfeti (reduced-motion'da çalışmaz). o: { adet:48 }. */
function konfeti(o) {
  if (reducedMotion()) return; const kok = $('#float-root'); if (!kok) return;
  const renkler = ['#22C9CE', '#FFBE3D', '#FF7A66', '#45D98D', '#9B86FF', '#7D9BFF'], n = (o && o.adet) || 48, h = window.innerHeight;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'); p.className = 'konfeti'; p.style.left = (Math.random() * 100) + '%'; p.style.background = renkler[i % renkler.length]; kok.appendChild(p);
    const a = p.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 }, { transform: 'translate(' + ((Math.random() - 0.5) * 260) + 'px,' + (h + 40) + 'px) rotate(' + ((Math.random() - 0.5) * 900) + 'deg)', opacity: 1 }], { duration: 1300 + Math.random() * 1300, delay: Math.random() * 350, easing: 'cubic-bezier(.3,.1,.6,1)', fill: 'forwards' });
    a.onfinish = function () { p.remove(); };
  }
}

/* ================= yönlendirme + tek delege olay sistemi ================= */
const GIRIS_AKISI = ['giris', 'dil-sec', 'avatar'];
const EKRANLAR = [
  ['giris', 'Giriş', 'Telefon, SMS kodu, doğum yılı ve veli onayı'], ['dil-sec', 'Dil Seçimi', '6 dil kartı: C# açık, diğerleri yakında'], ['avatar', 'Avatar Atölyesi', 'Yüz, saç, kıyafet ve takma ad'],
  ['meydan', 'Derleyici Meydanı', 'İzometrik meydan, LED pano ve hızlı erişim'], ['harita', 'Şehir Haritası', '7 semt, inşaat halindeki kilitler, Satılık tabelaları'], ['akademi', 'Akademi Lobisi', 'Kürsü kapıları ve ders listesi'],
  ['derslik', 'Derslik', 'Kart akışı, PRIMM adımları, mini editör'], ['kurul', 'Kurul Kartı', 'Usta sorusu, rubrik, puan ve geri bildirim'], ['atolye', 'Atölye', 'Görev editörü, açık testler, ipucu merdiveni'],
  ['sokak', 'İşletme Sokağı', 'Otopark dış görünümü, tabela, kasa ve Tapu'], ['is-emri', 'İş Emri', 'Hasan Abi, Müşteriye Sor, Sözleşme Kartı'], ['editor', 'İşletme Editörü', 'İskelet kod, açık testler, Müfettiş'],
  ['savunma', 'Savunma', "Kurul'un seçtiği satır ve açıklama"], ['panel', 'İşletme Paneli', 'Gelir grafiği, kasa ve yükseltmeler'], ['metro', 'Metro Haritası', '7 hat, duraklar, altın durak sayacı'],
  ['tekrar', 'Günlük Tekrar', '5 soru, 3 dakika, seri ve dondurma'], ['oda', 'Oda', '6×6 ızgara, eşya yerleştirme, ziyaretçi defteri'], ['dolap', 'Dolap', 'Kıyafet, aksesuar, emote ve Nişan vitrini'],
  ['pazar', 'Pazar', 'Bayt rafları, Butik ve Rütbe Rafı'], ['vitrin', 'Vitrin', 'Kod sergisi ve Savunma cevabı'], ['profil', 'Profil & Rozet Duvarı', "Unvan, seviye, Nişan'lar ve portföy"],
  ['liderlik', 'Liderlik Panosu', 'Haftalık lig, Kalıcılık Ligi, En Hızlı Otopark'], ['sohbet', 'Sohbet & Arkadaşlar', 'Meydan sohbeti, arkadaşlar, DM ve davet kodu'], ['ayarlar', 'Ayarlar & Hesap', 'Bildirim, veli durumu, KVKK ve veri silme']
].map(function (e) { return { token: e[0], ad: e[1], ozet: e[2] }; });
KK_UI.EKRANLAR = EKRANLAR;
KK_UI.GIRIS_AKISI = GIRIS_AKISI;

/** Ekran kaydı: KK_UI.screen('kurul', { ad, hud:true|false, render(root, ctx), actions:{ 'ad': (el, ev) => {} }, leave?(), selftest?: async (root, ctx) => {} }). */
KK_UI.screen = function (token, def) {
  if (!/^[a-z-]+$/.test(String(token))) { console.warn('[KodKent] geçersiz ekran adı: ' + token); return; }
  if (!def || typeof def.render !== 'function') { console.warn('[KodKent] ekran tanımında render yok: ' + token); return; }
  KK_UI.ekranlar[token] = def;
};
/** Geçerli ekranın token'ı. */
KK_UI.current = function () { return KK_UI.mevcut; };
function actionBul(ad) { const def = KK_UI.ekranlar[KK_UI.mevcut]; return (def && def.actions && def.actions[ad]) || KK_UI.actions[ad] || null; }
function eylemCagir(ad, el, ev) {
  const fn = actionBul(ad);
  if (!fn) { console.warn('[KodKent] data-action bulunamadı: ' + ad); return; }
  const hata = function (e) { KK_UI.hataKaydet(e, 'action:' + ad); if (!KK_UI.selftestAktif) toast('Bir şeyler ters gitti. Tekrar dene.', 'hata'); };
  try { const r = fn(el, ev); if (r && typeof r.then === 'function') r.catch(hata); } catch (e) { hata(e); }
}
function ekranTemizle(def) {
  try { if (def && typeof def.leave === 'function') def.leave(); } catch (e) { KK_UI.hataKaydet(e, 'leave'); }
  KK_UI.zamanlar.forEach(function (id) { clearInterval(id); clearTimeout(id); }); KK_UI.zamanlar.clear();
}
/** Rozet/Nişan verir (bir kez): state.rozetler'e ekler, save() eder, toast gösterir. → true: yeni verildi. */
function rozetVer(id) {
  if (!id || state.rozetler.indexOf(id) >= 0) return false;
  state.rozetler.push(id); save();
  const r = (((typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}).rozetler || []).filter(function (x) { return x.id === id; })[0];
  toast('Yeni rozet: ' + (r && r.ad ? r.ad : id), 'basari'); return true;
}
/** Ekran bağlamı (render ve selftest'e verilir): { token, root, state, ilk, parametre, tikla, yaz, bekle, bekleSecici, metin, gidilen }. */
function ekranBaglami(token, root, ekstra) {
  const bul = function (s) { if (s && s.nodeType === 1) return s; return $(String(s), $('#app') || document); };
  const ad = function (s) { return s && s.nodeType === 1 ? '<' + s.tagName.toLowerCase() + '>' : String(s); };
  return Object.assign({
    token: token, root: root, state: state, ilk: true, parametre: null,
    /** Öğeye gerçek tıklama gönderir (data-action delegesi çalışır). Öğe yoksa/devre dışıysa ya da eylem hata verirse fırlatır. */
    tikla: async function (s) {
      const el = bul(s); if (!el) throw new Error('tikla: öğe bulunamadı: ' + ad(s));
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') throw new Error('tikla: öğe devre dışı: ' + ad(s));
      const once = KK_UI.hatalar.length; if (typeof el.click === 'function') el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); await new Promise(function (r) { setTimeout(r, 30); });
      if (KK_UI.hatalar.length > once) throw new Error('tikla sonrası hata (' + ad(s) + '): ' + KK_UI.hatalar[KK_UI.hatalar.length - 1].mesaj);
    },
    /** input/textarea/select değerini ayarlar ve input + change olayı gönderir (onay kutusu için true/false). */
    yaz: async function (s, metin) {
      const el = bul(s); if (!el) throw new Error('yaz: öğe bulunamadı: ' + ad(s));
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!metin;
      else { const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype, set = Object.getOwnPropertyDescriptor(proto, 'value'); if (set && set.set) set.set.call(el, String(metin)); else el.value = String(metin); }
      el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise(function (r) { setTimeout(r, 10); });
    },
    /** Gerçek zamanlı bekleme (global bekle() gibi sıkıştırılmaz). */
    bekle: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
    /** Seçici belirene dek bekler (varsayılan 3000 ms); yoksa fırlatır. → öğe */
    bekleSecici: async function (s, ms) {
      const bit = Date.now() + (ms || 3000);
      for (;;) { const el = bul(s); if (el) return el; if (Date.now() > bit) throw new Error('bekleSecici: zaman aşımı (' + (ms || 3000) + ' ms): ' + ad(s)); await new Promise(function (r) { setTimeout(r, 20); }); }
    },
    /** Öğenin görünen metni (input/textarea/select için value). Öğe yoksa fırlatır. */
    metin: function (s) {
      const el = bul(s); if (!el) throw new Error('metin: öğe bulunamadı: ' + ad(s));
      return (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) ? el.value : el.textContent).replace(/\s+/g, ' ').trim();
    },
    /** Selftest kipinde go() çağrıları gezinmez; son hedef burada okunur (okuyunca sıfırlanır). */
    gidilen: function () { const g = KK_UI.sonGit; KK_UI.sonGit = null; return g; }
  }, ekstra || {});
}
function yerTutucuHtml(token) {
  const e = EKRANLAR.filter(function (x) { return x.token === token; })[0], ad = e ? e.ad : token;
  return '<div class="sayfa sayfa-dar"><div class="bos"><div class="bos-ik">' + ikon('bina', 30) + '</div><h2>Bu ekran hazırlanıyor</h2><p><b>' + esc(ad) + '</b>' + (e ? ': ' + esc(e.ozet) + '.' : '') + " Şimdilik Derleyici Meydanı'na dönebilir ya da demo çubuğundan başka bir ekran seçebilirsin.</p>" + '<button type="button" class="btn btn-birincil" data-go="meydan">' + "Meydan'a dön" + '</button></div></div>';
}
function ekranHatasi(root, token, e) {
  KK_UI.hataKaydet(e, 'render:' + token);
  root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Bu ekran çizilirken bir sorun çıktı: ' + ((e && e.message) || e), { baslik: 'Ekran açılamadı' }) + '<button type="button" class="btn btn-birincil" data-go="meydan">' + "Meydan'a dön" + '</button></div>';
}
/** Ekranı root'a çizer (try/catch'li). → { ok, hata?, bekle:Promise|null } (render söz döndürürse bekle onu izler). */
function cizEkran(token, root, ctx) {
  const def = KK_UI.ekranlar[token];
  if (!def) { root.innerHTML = yerTutucuHtml(token); return { ok: false, hata: 'kayıtsız', bekle: null }; }
  try {
    const r = def.render(root, ctx);
    if (r && typeof r.then === 'function') return { ok: true, bekle: r.then(function () { return { ok: true }; }, function (e) { ekranHatasi(root, token, e); return { ok: false, hata: (e && e.message) || String(e) }; }) };
    return { ok: true, bekle: null };
  } catch (e) { ekranHatasi(root, token, e); return { ok: false, hata: (e && e.message) || String(e), bekle: null }; }
}
function demoCubukGuncelle() {
  const c = $('#demo-oyuncu'); if (c) c.hidden = !(state.ui && state.ui.demo);
  const s = $('#demo-screen');
  if (s && KK_UI.mevcut) { if (s.querySelector('option[value="' + KK_UI.mevcut + '"]')) s.value = KK_UI.mevcut; else s.selectedIndex = -1; }
}
function goster(token, opt) {
  opt = opt || {};
  const root = $('#screen'); if (!root) return null;
  ekranTemizle(KK_UI.ekranlar[KK_UI.mevcut]);
  KK_UI.mevcut = token; state.ui.ekran = token; save();
  const def = KK_UI.ekranlar[token];
  root.classList.remove('scr'); void root.offsetWidth; root.className = 'scr scr-' + token; root.setAttribute('data-ekran', token);
  hudGoster(def ? def.hud !== false : !!state.kurulumTamam);
  root.innerHTML = '';
  const sonuc = cizEkran(token, root, ekranBaglami(token, root, { ilk: true, parametre: opt.parametre || null }));
  root.scrollTop = 0; demoCubukGuncelle();
  try { root.focus({ preventScroll: true }); } catch (e) { /* odak yok */ }
  return sonuc;
}
/** Ekrana git: go('kurul'). Hash'e yalnızca [a-z-]+ yazılır. → boolean. İsteğe bağlı opt.parametre ctx.parametre olarak ekrana iletilir. */
function go(token, opt) {
  token = String(token || '').toLowerCase();
  if (!/^[a-z-]+$/.test(token)) { console.warn('[KodKent] go: geçersiz ekran adı: ' + token); return false; }
  if (KK_UI.selftestAktif) { KK_UI.sonGit = token; return true; }
  if (location.hash.slice(1) !== token) { try { location.hash = token; } catch (e) { /* hash yazılamadı */ } }
  goster(token, opt); return true;
}
/** Geçerli ekranı yeniden çizer (leave + render), kaydırma ve odaklı girdi korunur. */
function refresh() {
  const token = KK_UI.mevcut, root = $('#screen'); if (!token || !root) return null;
  const sy = root.scrollTop, aktif = document.activeElement, aktifId = aktif && aktif.id && root.contains(aktif) ? aktif.id : null;
  let secim = null; try { if (aktifId && aktif.selectionStart != null) secim = [aktif.selectionStart, aktif.selectionEnd]; } catch (e) { /* seçim yok */ }
  ekranTemizle(KK_UI.ekranlar[token]); hud(); root.innerHTML = '';
  const sonuc = cizEkran(token, root, ekranBaglami(token, root, { ilk: false }));
  root.scrollTop = sy;
  if (aktifId) { const y = document.getElementById(aktifId); if (y) { try { y.focus({ preventScroll: true }); if (secim && y.setSelectionRange) y.setSelectionRange(secim[0], secim[1]); } catch (e) { /* odak yok */ } } }
  return sonuc;
}
function hashToken() { const h = (location.hash || '').replace(/^#/, ''); return /^[a-z-]+$/.test(h) ? h : ''; }
/** Adres çubuğu/geri tuşu gezinmesi: kurulum yoksa ve ekran giriş akışı değilse hızlı kurulum uygulanır. */
function disaridanGit(token) {
  if (!state.kurulumTamam && GIRIS_AKISI.indexOf(token) < 0) hizliKurulum();
  goster(token);
}
KK_UI.hashDinle = function () {
  if (KK_UI.hashDinleniyor) return; KK_UI.hashDinleniyor = true;
  window.addEventListener('hashchange', function () { if (KK_UI.selftestAktif) return; const t = hashToken(); if (!t || t === 'selftest' || t === KK_UI.mevcut) return; disaridanGit(t); });
};
function olayKur() {
  const app = $('#app'); if (!app || app.getAttribute('data-olay')) return; app.setAttribute('data-olay', '1');
  app.addEventListener('click', function (ev) {
    const h = ev.target.closest('[data-action],[data-go]'); if (!h || !app.contains(h)) return;
    if (h.disabled || h.getAttribute('aria-disabled') === 'true') { ev.preventDefault(); return; }
    if (h.tagName === 'A') ev.preventDefault();
    const ad = h.getAttribute('data-action');
    if (ad) eylemCagir(ad, h, ev); else go(h.getAttribute('data-go'));
  });
  const girdi = function (ev) {
    const el = ev.target.closest('[data-input]'); if (!el) return;
    const degisim = el.matches('select,input[type="checkbox"],input[type="radio"],input[type="file"],input[type="date"],input[type="color"]');
    if (degisim ? ev.type !== 'change' : ev.type !== 'input') return;
    eylemCagir(el.getAttribute('data-input'), el, ev);
  };
  app.addEventListener('input', girdi); app.addEventListener('change', girdi);
  app.addEventListener('submit', function (ev) { ev.preventDefault(); const f = ev.target.closest('form[data-submit]'); if (f) eylemCagir(f.getAttribute('data-submit'), f, ev); });
  app.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches && ev.target.matches('[data-action]:not(button):not(a):not(input):not(select):not(textarea):not(summary)')) { ev.preventDefault(); const t = ev.target; if (typeof t.click === 'function') t.click(); else t.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
  });
  document.addEventListener('keydown', function (ev) {
    if (!modalYigin.length) return;
    const ust = modalYigin[modalYigin.length - 1];
    if (ev.key === 'Escape' && ust.kapatilabilir) { ev.preventDefault(); ust.kapat(false); return; }
    if (ev.key !== 'Tab') return;
    const od = $$('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', ust.el);
    if (!od.length) { ev.preventDefault(); return; }
    const ilk = od[0], son = od[od.length - 1];
    if (!ust.el.contains(document.activeElement)) { ev.preventDefault(); ilk.focus(); }
    else if (ev.shiftKey && document.activeElement === ilk) { ev.preventDefault(); son.focus(); }
    else if (!ev.shiftKey && document.activeElement === son) { ev.preventDefault(); ilk.focus(); }
  });
}

/* ================= kodEditor: satır numaralı textarea + renklendirilmiş pre altlığı ================= */
/**
 * kodEditor(kap, { kod, salt, vurgu, onDegis, yukseklik, etiket, id }) → { getir(), koy(kod), odakla(), vurgula(satirlar, { kaydir }), el, kaldir() }.
 * kap: öğe ya da seçici (içeriği değiştirilir). Tab = 4 boşluk (Esc ardından Tab odaktan çıkar), Enter girinti korur, mobilde { } ( ) ; " = + yardım çubuğu.
 * salt:true → salt okunur; vurgu:[satırNo] → o satırlar işaretlenir. onDegis(kod) yalnızca kullanıcı yazınca çağrılır (koy() çağırmaz).
 */
function kodEditor(kap, o) {
  o = o || {};
  if (typeof kap === 'string') kap = $(kap);
  if (!kap) throw new Error('kodEditor: kapsayıcı bulunamadı');
  const salt = !!o.salt, yardimTuslari = [['{', 'Sol süslü parantez'], ['}', 'Sağ süslü parantez'], ['(', 'Sol parantez'], [')', 'Sağ parantez'], [';', 'Noktalı virgül'], ['"', 'Çift tırnak'], ['=', 'Eşittir'], ['+', 'Artı'], ['    ', 'Girinti (Tab)']];
  kap.innerHTML = '<div class="kodedit' + (salt ? ' salt' : '') + '"' + (o.yukseklik ? ' style="--kod-yuk:' + esc(o.yukseklik) + '"' : '') + '><div class="kodedit-govde"><div class="kodedit-ic"><div class="kodedit-no" aria-hidden="true"></div>' +
    '<div class="kodedit-alan"><pre class="kodedit-pre" aria-hidden="true"><code></code></pre><textarea class="kodedit-ta"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + ' spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="' + esc(o.etiket || 'C# kod düzenleyici') + '"' + (salt ? ' readonly' : '') + '></textarea></div></div></div>' +
    (salt ? '' : '<div class="kodedit-yardim" role="toolbar" aria-label="Kod yardımcı tuşları">' + yardimTuslari.map(function (t) { return '<button type="button" data-ekle="' + esc(t[0]) + '" aria-label="' + t[1] + '">' + (t[0].trim() ? esc(t[0]) : 'Tab') + '</button>'; }).join('') + '</div>') + '</div>';
  const kok = $('.kodedit', kap), govde = $('.kodedit-govde', kok), no = $('.kodedit-no', kok), kod = $('.kodedit-pre code', kok), ta = $('.kodedit-ta', kok);
  let satirSayisi = -1, vurgulu = {};
  function ciz() {
    const v = ta.value;
    kod.innerHTML = csHl(v).split('\n').map(function (h, k) { return '<span class="kl' + (vurgulu[k + 1] ? ' vurgu' : '') + '">' + (h || ' ') + '</span>'; }).join('');
    const n = v.split('\n').length;
    if (n !== satirSayisi) { satirSayisi = n; let s = ''; for (let i = 1; i <= n; i++) s += (i > 1 ? '\n' : '') + i; no.textContent = s; }
  }
  function ekle(metin) {
    ta.focus({ preventScroll: true });
    let ok = false; try { ok = document.execCommand('insertText', false, metin); } catch (e) { ok = false; }
    if (!ok) { ta.setRangeText(metin, ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input', { bubbles: true })); }
  }
  function girintile(geri) {
    const v = ta.value, s = ta.selectionStart; let e = ta.selectionEnd;
    if (e > s && v[e - 1] === '\n') e--;
    const bas = v.lastIndexOf('\n', s - 1) + 1; let son = v.indexOf('\n', e); if (son < 0) son = v.length;
    const yeni = v.slice(bas, son).split('\n').map(function (l) { return geri ? l.replace(/^( {1,4}|\t)/, '') : '    ' + l; }).join('\n');
    ta.setRangeText(yeni, bas, son, 'select'); ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
  ta.addEventListener('input', function () { ciz(); if (typeof o.onDegis === 'function') o.onDegis(ta.value); });
  if (!salt) {
    ta.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { ta.dataset.tabSerbest = '1'; return; }
      if (ev.key === 'Tab' && !ev.ctrlKey && !ev.altKey && !ev.metaKey) {
        if (ta.dataset.tabSerbest === '1') return;
        ev.preventDefault();
        const coklu = ta.selectionEnd > ta.selectionStart && ta.value.slice(ta.selectionStart, ta.selectionEnd).indexOf('\n') >= 0;
        if (ev.shiftKey || coklu) girintile(ev.shiftKey); else ekle('    ');
        return;
      }
      ta.dataset.tabSerbest = '';
      if (ev.key === 'Enter' && !ev.shiftKey && !ev.ctrlKey && !ev.metaKey && !ev.altKey && ta.selectionStart === ta.selectionEnd) {
        const v = ta.value, s = ta.selectionStart, bas = v.lastIndexOf('\n', s - 1) + 1, girinti = (v.slice(bas, s).match(/^[ \t]*/) || [''])[0], onceki = v[s - 1], sonraki = v[s];
        const ek = girinti + (onceki === '{' ? '    ' : '');
        if (onceki === '{' && sonraki === '}') { ev.preventDefault(); ekle('\n' + ek + '\n' + girinti); ta.selectionStart = ta.selectionEnd = s + 1 + ek.length; }
        else if (ek) { ev.preventDefault(); ekle('\n' + ek); }
      }
    });
    $$('.kodedit-yardim button', kok).forEach(function (b) {
      b.addEventListener('pointerdown', function (ev) { ev.preventDefault(); });
      b.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
      b.addEventListener('click', function () { ekle(b.getAttribute('data-ekle')); });
    });
  }
  ta.value = o.kod == null ? '' : String(o.kod);
  (o.vurgu || []).forEach(function (n) { vurgulu[n] = true; });
  ciz();
  return {
    el: ta, kok: kok,
    getir: function () { return ta.value; },
    koy: function (k) { ta.value = k == null ? '' : String(k); ciz(); },
    odakla: function () { try { ta.focus({ preventScroll: true }); } catch (e) { /* odak yok */ } },
    vurgula: function (satirlar, opt) {
      vurgulu = {}; (satirlar || []).forEach(function (n) { vurgulu[Number(n)] = true; }); ciz();
      if (satirlar && satirlar.length && opt && opt.kaydir) govde.scrollTop = Math.max(0, (Number(satirlar[0]) - 1) * 22 - 44);
    },
    kaldir: function () { kap.innerHTML = ''; }
  };
}

/* ================= dışa verilenler ve güvenlik ağı ================= */
Object.assign(KK_UI, { go: go, refresh: refresh, goster: goster, state: state, save: save, load: load, sifirla: sifirla, hizliKurulum: hizliKurulum, toast: toast, modal: modal, onayla: onayla, award: award, harca: harca, hud: hud, hudGoster: hudGoster, kodEditor: kodEditor, konfeti: konfeti, seviyeBilgi: seviyeBilgi, ikon: ikon, esc: esc, fmt: fmt, csHl: csHl, csHlSatir: csHlSatir, bekle: bekle, kopyala: kopyala });
olayKur();
/* Bir ekran parçası yüklenirken fırlatırsa 99-boot.js'in son satırı çalışmaz; yine de uygulamayı aç (hata KK_UI.hatalar'a düşer, selftest raporlar). */
setTimeout(function () { if (!KK_UI.acildi && typeof bootBaslat === 'function') { try { bootBaslat(); } catch (e) { KK_UI.hataKaydet(e, 'kurtar'); } } }, 0);
