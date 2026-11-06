// Prototip çekirdek mantığı birim testi.
// Kullanım: node proto_core_test.mjs <kodkent-prototip.html>
// Sözleşme: sayfanın İLK <script> bloğu DOM'a dokunmaz ve global `KK_CORE` nesnesini tanımlar:
//   KK_CORE.DATA.otopark.publicTestler : [{ id, dakika, beklenen }]
//   KK_CORE.DATA.otopark.referansKod   : string (C# referans çözüm)
//   KK_CORE.DATA.otopark.templateKod   : string (NotImplementedException içeren başlangıç kodu)
//   KK_CORE.DATA.dersler               : [{ id, baslik, sorular:[{ id, tip, metin, rubrik:[{ad, agirlik}], anahtarlar:[string] }] }]
//   KK_CORE.DATA.isletmeler            : [{ id, ad, fiyat, gelirSaat, seviye }]
//   KK_CORE.DATA.magaza                : [{ id, ad, kategori, nadirlik, fiyat, para:'bayt'|'cip' }]
//   KK_CORE.xpGereken(seviye) -> number (o seviyeye geçmek için gereken XP)
//   KK_CORE.seviyeHesapla(toplamXp) -> { seviye, kalan, gereken }
//   KK_CORE.otoparkUcret(dakika) -> number (referans; KANON/B5 kurallarına göre)
//   KK_CORE.cevrimdisiPuanla({ soruTipi, soru, rubrik, cevap, anahtarlar }) -> { puan:0-100, olcutler:[], geri_bildirim, kaynak:'cevrimdisi' }
//   KK_CORE.sezgiselTest(kod, testler) -> [{ id, gecti:boolean, gercek:string }]
import fs from 'node:fs';
const html = fs.readFileSync(process.argv[2], 'utf8');
const m = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/i.exec(html);
if (!m) { console.error('FAIL: script bulunamadı'); process.exit(1); }
const sandbox = {}; let CORE;
try { CORE = new Function('window', 'document', 'localStorage', m[1] + '\n;return (typeof KK_CORE!=="undefined")?KK_CORE:(window.KK_CORE);')(sandbox, undefined, undefined); }
catch (e) { console.error('FAIL: ilk script DOM\'suz çalışmıyor →', e.message); process.exit(1); }
let fails = 0; const ok = (c, msg) => { if (!c) { fails++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
ok(CORE && CORE.DATA, 'KK_CORE.DATA var');
const D = CORE.DATA || {};
ok(Array.isArray(D.dersler) && D.dersler.length >= 5, `en az 5 ders (${D.dersler && D.dersler.length})`);
ok((D.dersler || []).every(d => Array.isArray(d.sorular) && d.sorular.length >= 2 && d.sorular.every(s => s.rubrik && s.rubrik.length)), 'her derste ≥2 soru ve rubrik');
ok(Array.isArray(D.isletmeler) && D.isletmeler.length >= 6 && D.isletmeler.every(i => typeof i.fiyat === 'number' && typeof i.gelirSaat === 'number'), 'işletmeler fiyat/gelir ile');
ok(Array.isArray(D.magaza) && D.magaza.length >= 20, `mağazada ≥20 ürün (${D.magaza && D.magaza.length})`);
ok(D.otopark && Array.isArray(D.otopark.publicTestler) && D.otopark.publicTestler.length >= 6, 'otopark ≥6 public test');
ok(typeof D.otopark?.referansKod === 'string' && /UcretHesapla/.test(D.otopark.referansKod), 'referans kod UcretHesapla içeriyor');
for (let L = 2; L <= 15; L++) ok(CORE.xpGereken(L) > CORE.xpGereken(L - 1) || L === 2, `xpGereken artan (${L})`);
const sv = CORE.seviyeHesapla(0); ok(sv && sv.seviye === 1, 'seviyeHesapla(0) → seviye 1');
ok(CORE.otoparkUcret(30) === 100, 'otoparkUcret(30) = 100');
ok(CORE.otoparkUcret(361) === 250, 'otoparkUcret(361) = 250');
ok(CORE.otoparkUcret(1440) === 250, 'otoparkUcret(1440) = 250');
for (const t of (D.otopark?.publicTestler || [])) ok(CORE.otoparkUcret(t.dakika) === t.beklenen, `referans public test ${t.id}: ${t.dakika} dk → ${t.beklenen} (gerçek ${CORE.otoparkUcret(t.dakika)})`);
ok(Array.isArray(D.otopark?.gizliTestler) && D.otopark.gizliTestler.length >= 6, `otopark ≥6 gizli test (${D.otopark?.gizliTestler?.length || 0})`);
for (const t of (D.otopark?.gizliTestler || [])) ok(CORE.otoparkUcret(t.dakika) === t.beklenen, `referans gizli test ${t.id}: ${t.dakika} dk → ${t.beklenen} (gerçek ${CORE.otoparkUcret(t.dakika)})`);
// KANON §5.1 sözleşme kartı doğrulaması (ham dakika dilimi, başlayan saat, başlayan gün)
const kanon = [[0, 0], [1, 100], [59, 100], [60, 100], [61, 200], [119, 200], [120, 80], [121, 120], [180, 120], [359, 240], [360, 240], [361, 250], [720, 250], [1439, 250], [1440, 250], [1441, 500], [2880, 500], [2881, 750], [100000, 17500]];
for (const [dk, tl] of kanon) ok(CORE.otoparkUcret(dk) === tl, `KANON: ${dk} dk → ${tl} (gerçek ${CORE.otoparkUcret(dk)})`);
if (typeof CORE.unvan === 'function') { ok(CORE.unvan(1) === 'Çırak' && CORE.unvan(6) === 'Kalfa' && CORE.unvan(12) === 'Zanaatkâr' && CORE.unvan(18) === 'Mühendis', 'unvan bantları KANON ile aynı'); }
ok(Array.isArray(D.otopark?.netlestirmeSorulari) && D.otopark.netlestirmeSorulari.length >= 4, 'İş Emri: ≥4 netleştirme sorusu');
ok(Array.isArray(D.otopark?.savunmaSorulari) && D.otopark.savunmaSorulari.length >= 2, 'Savunma: ≥2 soru');
const r1 = CORE.sezgiselTest(D.otopark.referansKod, D.otopark.publicTestler); ok(r1.every(x => x.gecti), 'sezgiselTest(referans) hepsi geçer');
const r2 = CORE.sezgiselTest(D.otopark.templateKod, D.otopark.publicTestler); ok(r2.every(x => !x.gecti), 'sezgiselTest(template) hepsi kalır');
const soru = D.dersler[0].sorular[0];
const p1 = CORE.cevrimdisiPuanla({ soruTipi: soru.tip, soru: soru.metin, rubrik: soru.rubrik, cevap: (soru.anahtarlar || []).join(' ') + ' çünkü değişken bir kutu gibidir ve tipi önemlidir.', anahtarlar: soru.anahtarlar });
const p2 = CORE.cevrimdisiPuanla({ soruTipi: soru.tip, soru: soru.metin, rubrik: soru.rubrik, cevap: 'bilmiyorum', anahtarlar: soru.anahtarlar });
ok(p1 && p1.puan >= 0 && p1.puan <= 100 && p2.puan >= 0 && p2.puan <= 100, 'cevrimdisiPuanla 0-100');
ok(p1.puan > p2.puan, `anahtarlı cevap daha yüksek (${p1.puan} > ${p2.puan})`);
ok(typeof p1.geri_bildirim === 'string' && p1.geri_bildirim.length > 10, 'geri bildirim metni var');
console.log(fails ? `SONUÇ: ${fails} hata` : 'SONUÇ: tüm çekirdek testleri geçti');
process.exit(fails ? 1 : 0);
