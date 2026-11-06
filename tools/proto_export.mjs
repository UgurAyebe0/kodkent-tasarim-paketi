// Prototip SVG dışa aktarımı: avatar / Usta portresi / ikon / iso nesnesi çizimlerini belge sayfaları için bağımsız SVG dizgeleri olarak yazar.
// Kullanım: node tools/proto_export.mjs [--out KLASÖR]      (varsayılan çıktı: build/proto/export/)
// Çıktılar: avatarlar.json  [{ id, ad, tarif, svg }] ×6      ustalar.json  [{ id, ad, svg }] ×10
//           ikonlar.json    { ikonAdı: svg } (sprite'taki tümü)   proplar.json  { nesneTürü: svg } ×25
// Yöntem: ui/00-base.js'teki "//#SAF-BASLA … //#SAF-BITIR" bloğu (esc, ikon, csHl …) + ui/20-iso.js, document/window/localStorage OLMAYAN boş bir
// Node vm bağlamında çalıştırılır; bir üretici DOM'a ya da state'e dokunursa burada ReferenceError ile patlar (saflık testi). Renkler sabit hex'tir.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROTO = path.join(KOK, 'build', 'proto');
const oi = process.argv.indexOf('--out');
const CIKTI = oi > 0 && process.argv[oi + 1] ? path.resolve(process.argv[oi + 1]) : path.join(PROTO, 'export');
const oku = (g) => fs.readFileSync(path.join(PROTO, g), 'utf8');
const hata = (m) => { console.error('HATA: ' + m); process.exit(1); };

// 1) saf kaynakları yükle (DOM yok)
const base = oku('ui/00-base.js');
const a = base.indexOf('//#SAF-BASLA'), b = base.indexOf('//#SAF-BITIR');
if (a < 0 || b < 0 || b < a) hata("ui/00-base.js içinde //#SAF-BASLA ... //#SAF-BITIR bloğu bulunamadı");
const baglam = vm.createContext({ console });
try {
  vm.runInContext("'use strict';\n" + base.slice(a, b) + '\n' + oku('ui/20-iso.js') +
    '\n;globalThis.__KK = { iso, avatarSvg, ustaSvg, ikon, AVATAR_ORNEKLERI, AVATAR_SECENEK, avatarTarif, USTA_BILGI, onizleSvg };', baglam, { filename: 'proto-saf.js' });
} catch (e) { hata('saf kaynaklar değerlendirilemedi (DOM kullanıyor olabilir): ' + e.message); }
const K = baglam.__KK;

// 2) üret
const xmlns = (s) => s.replace(/^<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ');
const avatarlar = K.AVATAR_ORNEKLERI.map((x) => ({ id: x.id, ad: x.ad, tarif: K.avatarTarif(x.av), svg: xmlns(K.avatarSvg(x.av, { boyut: 192, aria: 'Avatar: ' + x.ad })) }));
// B8 §10.2 oyuncu tarifleri için en yakın prototip katmanları (tools/pages/ekranlar_avatar_b8.json; yoksa atlanır) → avatarlar-b8.json
const b8Harita = path.join(KOK, 'tools', 'pages', 'ekranlar_avatar_b8.json');
const avatarlarB8 = fs.existsSync(b8Harita) ? JSON.parse(fs.readFileSync(b8Harita, 'utf8')).map((x) => ({ id: x.id, no: x.no, tarif: K.avatarTarif(x.av), fark: x.fark, svg: xmlns(K.avatarSvg(x.av, { boyut: 192, aria: 'Avatar: @' + x.id })) })) : [];
const ustalar = Object.keys(K.USTA_BILGI).map((id) => ({ id, ad: K.USTA_BILGI[id].ad, svg: xmlns(K.ustaSvg(id, { boyut: 128 })) }));
const etiket = { tabela: 'BÜFE', neon: 'AÇIK', 'led-pano': 'YENİ İŞLETME: OTOPARK' };
const proplar = Object.fromEntries(K.iso.PROP_TURLERI.map((t) => [t, xmlns(K.iso.propSvg(t, { boyut: 180, etiket: etiket[t], dolu: true, aria: t }))]));
const sprite = oku('sprite.html');
const ikonlar = {};
for (const m of sprite.matchAll(/<symbol id="i-([a-z0-9-]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g)) {
  const [, ad, vb, ic] = m;
  ikonlar[ad] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ic + '</svg>';
}

// 3) doğrula: bağımsız (CSS değişkeni yok), eksiksiz, geçerli görünümlü
const tum = [...avatarlar.map((x) => ['avatar:' + x.id, x.svg]), ...avatarlarB8.map((x) => ['avatarB8:' + x.id, x.svg]), ...ustalar.map((x) => ['usta:' + x.id, x.svg]), ...Object.entries(proplar).map(([k, v]) => ['prop:' + k, v]), ...Object.entries(ikonlar).map(([k, v]) => ['ikon:' + k, v])];
for (const [ad, svg] of tum) {
  if (!/^<svg [^>]*xmlns=/.test(svg) || !svg.endsWith('</svg>')) hata(ad + ': <svg …> ile başlamıyor ya da </svg> ile bitmiyor');
  if (/var\(--/.test(svg)) hata(ad + ': CSS değişkenine bağımlı');
  if (/NaN|undefined|\[object/.test(svg)) hata(ad + ': geçersiz sayı/metin içeriyor');
}
if (avatarlar.length !== 6 || ustalar.length !== 10 || Object.keys(proplar).length !== 25 || Object.keys(ikonlar).length < 32) hata('beklenen sayılar tutmuyor (avatar 6, usta 10, prop 25, ikon ≥32)');

fs.mkdirSync(CIKTI, { recursive: true });
const yaz = (ad, veri) => { fs.writeFileSync(path.join(CIKTI, ad), JSON.stringify(veri, null, 2) + '\n', 'utf8'); return fs.statSync(path.join(CIKTI, ad)).size; };
const boyut = { 'avatarlar.json': yaz('avatarlar.json', avatarlar), 'ustalar.json': yaz('ustalar.json', ustalar), 'ikonlar.json': yaz('ikonlar.json', ikonlar), 'proplar.json': yaz('proplar.json', proplar) };
if (avatarlarB8.length) boyut['avatarlar-b8.json'] = yaz('avatarlar-b8.json', avatarlarB8);
console.log('yazıldı: ' + CIKTI);
for (const [ad, n] of Object.entries(boyut)) console.log('  ' + ad.padEnd(15) + String(Math.round(n / 1024)).padStart(4) + ' KB');
console.log('  avatar ' + avatarlar.length + ' · usta ' + ustalar.length + ' · ikon ' + Object.keys(ikonlar).length + ' · prop ' + Object.keys(proplar).length);
