/* ==== ui/20-iso.js — izometrik ilkeller (2:1, 64×32), avatarSvg, ustaSvg, walker ====
   iso.*, avatarSvg ve ustaSvg DOM'suz SAF dizge üreticileridir (document/window/state kullanmaz, renkler sabit hex'tir, CSS değişkeni yok): belge sayfalarında da kullanılır.
   tools/proto_export.mjs bu dosyayı Node'da çalıştırıp avatarlar/portreler/proplar/ikonlar için bağımsız SVG dosyaları üretir. Bu dosya başka ui parçalarına bağımlı DEĞİLDİR (walker yalnızca çağrılınca DOM kullanır). */

const isoEsc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
const isoN = function (v) { return Math.round(v * 10) / 10; };
const isoPts = function (a) { return a.map(function (p) { return isoN(p[0]) + ',' + isoN(p[1]); }).join(' '); };
/** Renk yardımcıları (saf): karistir(a, b, t) iki hex rengi karıştırır; koyu(hex, t) siyaha-laciverte, acik(hex, t) beyaza doğru. */
const isoRenk = (function () {
  const rgb = function (h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.replace(/(.)/g, '$1$1'); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
  const hex = function (a) { return '#' + a.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join('').toUpperCase(); };
  const karistir = function (a, b, t) { const x = rgb(a), y = rgb(b); return hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); };
  return { rgb: rgb, hex: hex, karistir: karistir, koyu: function (h, t) { return karistir(h, '#0A0F24', t); }, acik: function (h, t) { return karistir(h, '#FFFFFF', t); } };
})();

/** İzometrik ilkeller. Yatay: 64×32 tile (2:1); dikey: 1 kat = KAT = 48 px. xy/hucre B1 §1.2 ile aynıdır (gz KAT cinsindendir; blok/prop yükseklikleri px'tir). */
const iso = (function () {
  const W = 64, H = 32, KAT = 48, R = isoRenk;
  const poly = function (p, fill, stroke, sw) { return '<polygon points="' + isoPts(p) + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 1) + '" stroke-linejoin="round"' : '') + '/>'; };
  /** Dünya hücresi → ekran noktası { x, y } (orijin: { x, y } ekran ofseti). */
  function xy(gx, gy, gz, orijin) { const o = orijin || {}; return { x: (o.x || 0) + (gx - gy) * W / 2, y: (o.y || 0) + (gx + gy) * H / 2 - (gz || 0) * KAT }; }
  /** Ekran noktası → hücre { gx, gy } (tıklama eşlemesi; zemin düzleminde). */
  function hucre(x, y, orijin) { const o = orijin || {}, a = (x - (o.x || 0)) / (W / 2), b = (y - (o.y || 0)) / (H / 2); return { gx: Math.floor((a + b) / 2), gy: Math.floor((b - a) / 2) }; }
  /** Zemin karosu (üst yüz elması). opt: { w, d (hücre), h (kalınlık px), z (px), kenar (çizgi rengi), orijin, sinif }. */
  function tile(gx, gy, renk, opt) {
    const o = opt || {}, w = o.w || 1, d = o.d || 1, h = o.h || 0, z = o.z || 0, c = renk || '#26325A';
    const A = function (u, v, e) { const p = xy(gx + u, gy + v, 0, o.orijin); return [p.x, p.y - z - e]; };
    let s = '<g' + (o.sinif ? ' class="' + isoEsc(o.sinif) + '"' : '') + '>';
    if (h > 0) s += poly([A(0, d, 0), A(w, d, 0), A(w, d, h), A(0, d, h)], R.koyu(c, 0.22)) + poly([A(w, 0, 0), A(w, d, 0), A(w, d, h), A(w, 0, h)], R.koyu(c, 0.4));
    return s + poly([A(0, 0, h), A(w, 0, h), A(w, d, h), A(0, d, h)], c, o.kenar, 1) + '</g>';
  }
  /** Prizma: w×d hücre ayak izi, h px yükseklik; üst = renk, sol yüz biraz, sağ yüz daha koyu (ışık kuzeybatıdan). opt: { w, d, h, renk, z, ust, sol, sag, kenar, orijin, sinif }. */
  function blok(gx, gy, opt) {
    const o = opt || {}, w = o.w || 1, d = o.d || 1, h = o.h == null ? KAT : o.h, z = o.z || 0, c = o.renk || '#7D9BFF';
    const A = function (u, v, e) { const p = xy(gx + u, gy + v, 0, o.orijin); return [p.x, p.y - z - e]; };
    return '<g' + (o.sinif ? ' class="' + isoEsc(o.sinif) + '"' : '') + '>' + poly([A(0, d, 0), A(w, d, 0), A(w, d, h), A(0, d, h)], o.sol || R.koyu(c, 0.22), o.kenar, 1) +
      poly([A(w, 0, 0), A(w, d, 0), A(w, d, h), A(w, 0, h)], o.sag || R.koyu(c, 0.4), o.kenar, 1) + poly([A(0, 0, h), A(w, 0, h), A(w, d, h), A(0, d, h)], o.ust || c, o.kenar, 1) + '</g>';
  }
  /** z-sıralama: ogeler [{ gx, gy, w, d, gz, svg }] → derinlik anahtarı (gx+w-1)+(gy+d-1)+gz×0,001'e göre sıralı birleşik svg dizgesi (B1 §1.2). */
  function sirala(ogeler) {
    return (ogeler || []).map(function (o, i) { return { o: o, i: i, k: (o.gx + (o.w || 1) - 1) + (o.gy + (o.d || 1) - 1) + (o.gz || 0) * 0.001 }; })
      .sort(function (a, b) { return a.k - b.k || a.i - b.i; }).map(function (x) { return x.o.svg; }).join('');
  }
  /** cols×rows ızgaralı zemin (dama). renkler: [a, b] ya da tek renk. opt: { orijin, kenar, h }. */
  function zemin(cols, rows, renkler, opt) {
    const o = opt || {}, r = Array.isArray(renkler) ? renkler : [renkler || '#26325A', renkler || '#26325A']; let s = '';
    for (let k = 0; k < cols + rows - 1; k++) for (let gx = 0; gx < cols; gx++) { const gy = k - gx; if (gy < 0 || gy >= rows) continue; s += tile(gx, gy, r[(gx + gy) % r.length], { orijin: o.orijin, kenar: o.kenar, h: o.h }); }
    return s;
  }
  /** cols×rows ızgara için sahne ölçüsü: { orijin, genislik, yukseklik, viewBox }. opt: { yukari (px, yüksek nesneler için), kenar (px) }. */
  function alan(cols, rows, opt) {
    const o = opt || {}, pad = o.kenar == null ? 24 : o.kenar, up = o.yukari || 0, g = (cols + rows) * W / 2 + 2 * pad, y = (cols + rows) * H / 2 + up + 2 * pad;
    return { orijin: { x: rows * W / 2 + pad, y: pad + up }, genislik: g, yukseklik: y, viewBox: '0 0 ' + g + ' ' + y };
  }
  return { W: W, H: H, KAT: KAT, xy: xy, hucre: hucre, tile: tile, blok: blok, sirala: sirala, zemin: zemin, alan: alan, poly: poly, renk: R };
})();

/* ---- iso.prop: 25 sahne/oda nesnesi (sözleşme §5) ---- */
(function () {
  const R = isoRenk;
  const META = { kutu: { w: 1, d: 1, yuk: 36 }, koltuk: { w: 1, d: 1, yuk: 50 }, masa: { w: 2, d: 1, yuk: 36 }, bitki: { w: 1, d: 1, yuk: 80 }, lamba: { w: 1, d: 1, yuk: 120 }, hali: { w: 2, d: 2, yuk: 6 }, raf: { w: 1, d: 1, yuk: 56 }, tv: { w: 1, d: 1, yuk: 66 },
    yatak: { w: 2, d: 1, yuk: 48 }, kitaplik: { w: 1, d: 1, yuk: 84 }, tabela: { w: 2, d: 1, yuk: 104 }, neon: { w: 2, d: 1, yuk: 96 }, agac: { w: 1, d: 1, yuk: 104 }, bank: { w: 2, d: 1, yuk: 42 }, cesme: { w: 2, d: 2, yuk: 100 }, tram: { w: 3, d: 1, yuk: 80 },
    araba: { w: 2, d: 1, yuk: 44 }, vinc: { w: 2, d: 2, yuk: 170 }, tente: { w: 2, d: 1, yuk: 92 }, 'led-pano': { w: 3, d: 1, yuk: 100 }, kapi: { w: 1, d: 1, yuk: 92 }, kasa: { w: 1, d: 1, yuk: 70 }, bariyer: { w: 2, d: 1, yuk: 92 }, bayrak: { w: 1, d: 1, yuk: 120 }, hediye: { w: 1, d: 1, yuk: 56 } };
  function baglam(gx, gy, o) {
    const a = iso.xy(gx, gy, o.gz || 0, o.orijin), z = o.z || 0, P = iso.poly;
    const E = function (u, v, e) { return [a.x + (u - v) * 32, a.y + (u + v) * 16 - (e || 0) - z]; };
    return {
      o: o, E: E, pg: function (p, fill, op) { return '<polygon points="' + isoPts(p) + '" fill="' + fill + '"' + (op != null ? ' fill-opacity="' + op + '"' : '') + '/>'; },
      B: function (u, v, w, d, h, renk, e0, ren) {
        e0 = e0 || 0; ren = ren || {};
        return P([E(u, v + d, e0), E(u + w, v + d, e0), E(u + w, v + d, e0 + h), E(u, v + d, e0 + h)], ren.sol || R.koyu(renk, 0.22)) + P([E(u + w, v, e0), E(u + w, v + d, e0), E(u + w, v + d, e0 + h), E(u + w, v, e0 + h)], ren.sag || R.koyu(renk, 0.4)) + P([E(u, v, e0 + h), E(u + w, v, e0 + h), E(u + w, v + d, e0 + h), E(u, v + d, e0 + h)], ren.ust || renk);
      },
      L: function (u, v, w, d, e0, s0, s1, t0, t1, fill) { const vv = v + d; return P([E(u + s0, vv, e0 + t0), E(u + s1, vv, e0 + t0), E(u + s1, vv, e0 + t1), E(u + s0, vv, e0 + t1)], fill); },
      Rr: function (u, v, w, d, e0, s0, s1, t0, t1, fill) { const uu = u + w; return P([E(uu, v + s0, e0 + t0), E(uu, v + s1, e0 + t0), E(uu, v + s1, e0 + t1), E(uu, v + s0, e0 + t1)], fill); },
      gol: function (u, v, w, d, k) { return '<polygon points="' + isoPts([E(u, v, 0), E(u + w, v, 0), E(u + w, v + d, 0), E(u, v + d, 0)]) + '" fill="#050814" fill-opacity="' + (k || 0.3) + '"/>'; },
      el: function (cx, cy, rx, ry, fill, op, rot) { return '<ellipse cx="' + isoN(cx) + '" cy="' + isoN(cy) + '" rx="' + isoN(rx) + '" ry="' + isoN(ry) + '" fill="' + fill + '"' + (op != null ? ' fill-opacity="' + op + '"' : '') + (rot ? ' transform="rotate(' + rot + ' ' + isoN(cx) + ' ' + isoN(cy) + ')"' : '') + '/>'; },
      cz: function (p, q, st, sw, ek) { return '<line x1="' + isoN(p[0]) + '" y1="' + isoN(p[1]) + '" x2="' + isoN(q[0]) + '" y2="' + isoN(q[1]) + '" stroke="' + st + '" stroke-width="' + (sw || 1.5) + '" stroke-linecap="round"' + (ek || '') + '/>'; },
      cil: function (u, v, r, h, renk, e0) {
        const p = E(u, v, e0 || 0), x = p[0], y = p[1];
        return '<path d="M' + isoN(x - r) + ' ' + isoN(y) + 'L' + isoN(x - r) + ' ' + isoN(y - h) + 'A' + r + ' ' + isoN(r / 2) + ' 0 0 1 ' + isoN(x + r) + ' ' + isoN(y - h) + 'L' + isoN(x + r) + ' ' + isoN(y) + 'A' + r + ' ' + isoN(r / 2) + ' 0 0 1 ' + isoN(x - r) + ' ' + isoN(y) + 'Z" fill="' + R.koyu(renk, 0.3) + '"/><ellipse cx="' + isoN(x) + '" cy="' + isoN(y - h) + '" rx="' + r + '" ry="' + isoN(r / 2) + '" fill="' + renk + '"/>';
      },
      disk: function (p, r, fill, ek) { return '<circle transform="matrix(1 .5 0 1 ' + isoN(p[0]) + ' ' + isoN(p[1]) + ')" r="' + r + '" fill="' + fill + '"' + (ek || '') + '/>'; },
      ysol: function (u, v, w, d, e0, s, t, metin, boy, fill, aile) { const p = E(u + s, v + d, e0 + t); return '<text transform="matrix(1 .5 0 1 ' + isoN(p[0]) + ' ' + isoN(p[1]) + ')" font-family="' + (aile || 'Fredoka,Nunito,Segoe UI,sans-serif') + '" font-weight="700" font-size="' + boy + '" fill="' + fill + '">' + isoEsc(metin) + '</text>'; }
    };
  }
  const KITAP = ['#FF7A66', '#22C9CE', '#FFBE3D', '#9B86FF', '#45D98D', '#7D9BFF'];
  const PROPLAR = {
    kutu: function (c) { const r = c.o.renk || '#C98A4B', k = R.koyu(r, 0.35), E = c.E; return c.gol(0.05, 0.05, 0.95, 0.95) + c.B(0.1, 0.1, 0.8, 0.8, 30, r) + c.cz(E(0.1, 0.5, 30), E(0.9, 0.5, 30), k, 1.4) + c.cz(E(0.5, 0.1, 30), E(0.5, 0.9, 30), k, 1.4) + c.cz(E(0.1, 0.9, 15), E(0.9, 0.9, 15), k, 1.4) + c.cz(E(0.9, 0.1, 15), E(0.9, 0.9, 15), R.koyu(r, 0.5), 1.4); },
    koltuk: function (c) { const r = c.o.renk || '#6D7CFF'; return c.gol(0, 0, 1, 1) + c.B(0.06, 0.06, 0.88, 0.26, 42, r) + c.B(0.06, 0.32, 0.88, 0.62, 14, R.koyu(r, 0.15)) + c.B(0.22, 0.32, 0.56, 0.62, 22, R.acik(r, 0.1)) + c.B(0.06, 0.32, 0.16, 0.62, 32, R.koyu(r, 0.08)) + c.B(0.78, 0.32, 0.16, 0.62, 32, R.koyu(r, 0.08)); },
    masa: function (c) { const r = c.o.renk || '#B9854F', l = '#6B4A33'; return c.gol(0, 0.05, 2, 0.95) + c.B(0.1, 0.12, 0.1, 0.1, 24, l) + c.B(0.1, 0.78, 0.1, 0.1, 24, l) + c.B(1.8, 0.12, 0.1, 0.1, 24, l) + c.B(1.8, 0.78, 0.1, 0.1, 24, l) + c.B(0, 0.05, 2, 0.9, 6, r, 24); },
    bitki: function (c) {
      const p = c.E(0.5, 0.5, 16), g = ['#2E9E5F', '#3FB571', '#52C985', '#3FB571', '#2E9E5F'], ang = [-54, -27, 0, 27, 54]; let s = c.gol(0.15, 0.15, 0.7, 0.7, 0.25) + c.cil(0.5, 0.5, 13, 16, c.o.renk || '#C8603F', 0);
      ang.forEach(function (a, i) { s += '<ellipse cx="' + isoN(p[0]) + '" cy="' + isoN(p[1] - 17) + '" rx="6.5" ry="' + (17 + (i % 2) * 4) + '" fill="' + g[i] + '" transform="rotate(' + a + ' ' + isoN(p[0]) + ' ' + isoN(p[1]) + ')"/>'; });
      return s;
    },
    lamba: function (c) {
      const p = c.E(0.5, 0.5, 0), ak = c.o.acik !== false, ab = c.o.renk || '#FFD27A';
      let s = c.gol(0.3, 0.3, 0.4, 0.4, 0.25) + c.cil(0.5, 0.5, 9, 3, '#3A4466', 0) + c.cz(c.E(0.5, 0.5, 3), c.E(0.5, 0.5, 76), '#98A2C2', 3);
      if (ak) s += c.el(p[0], p[1] - 86, 44, 36, ab, 0.07) + c.el(p[0], p[1] - 86, 30, 25, ab, 0.1) + c.el(p[0], p[1] - 86, 18, 15, ab, 0.16);
      return s + c.pg([[p[0] - 8, p[1] - 96], [p[0] + 8, p[1] - 96], [p[0] + 15, p[1] - 72], [p[0] - 15, p[1] - 72]], ab) + c.pg([[p[0] - 8, p[1] - 96], [p[0] + 8, p[1] - 96], [p[0] + 6, p[1] - 89], [p[0] - 6, p[1] - 89]], R.acik(ab, 0.55));
    },
    hali: function (c) {
      const r = c.o.renk || '#B04E6B', E = c.E, q = function (m, f) { return c.pg([E(m, m, 0), E(2 - m, m, 0), E(2 - m, 2 - m, 0), E(m, 2 - m, 0)], f); }, o = E(1, 1, 0);
      return q(0.04, R.koyu(r, 0.3)) + q(0.1, r) + q(0.28, R.acik(r, 0.55)) + q(0.36, r) + c.el(o[0], o[1], 24, 12, R.acik(r, 0.3)) + c.el(o[0], o[1], 12, 6, R.koyu(r, 0.15));
    },
    raf: function (c) {
      const r = c.o.renk || '#B9854F', ic = '#2A1E14', L = function (a, b, t0, t1, f) { return c.L(0.1, 0.3, 0.8, 0.42, 0, a, b, t0, t1, f); };
      return c.gol(0.08, 0.3, 0.84, 0.5, 0.22) + c.B(0.1, 0.3, 0.8, 0.42, 52, r) + L(0.06, 0.74, 4, 24, ic) + L(0.06, 0.74, 29, 49, ic) + L(0.1, 0.22, 4, 17, KITAP[1]) + L(0.25, 0.37, 4, 21, KITAP[2]) + L(0.42, 0.56, 4, 14, KITAP[0]) + L(0.12, 0.34, 29, 40, KITAP[3]) + L(0.5, 0.64, 29, 42, KITAP[4]);
    },
    tv: function (c) {
      const ak = c.o.acik !== false, E = c.E;
      return c.gol(0.2, 0.25, 0.6, 0.5, 0.25) + c.B(0.3, 0.35, 0.4, 0.3, 3, '#2A3358') + c.B(0.46, 0.46, 0.08, 0.08, 16, '#2A3358', 3) + c.B(0.08, 0.4, 0.84, 0.12, 36, '#151B38', 17) + c.L(0.08, 0.4, 0.84, 0.12, 17, 0.05, 0.79, 3, 33, ak ? '#22C9CE' : '#0B1024') +
        (ak ? c.pg([E(0.14, 0.52, 20), E(0.36, 0.52, 20), E(0.28, 0.52, 49), E(0.14, 0.52, 49)], '#C9F7F8', 0.5) + c.L(0.08, 0.4, 0.84, 0.12, 17, 0.46, 0.7, 4, 8, '#FFBE3D') : '');
    },
    yatak: function (c) { const r = c.o.renk || '#4F8BEA'; return c.gol(0, 0.05, 2, 0.95) + c.B(0, 0.05, 0.1, 0.9, 36, '#6B4A33') + c.B(0.08, 0.08, 1.9, 0.86, 10, '#8A5E3E') + c.B(0.1, 0.1, 1.86, 0.82, 12, '#EDEFF7', 10) + c.B(0.62, 0.08, 1.38, 0.86, 14, r, 10) + c.B(0.14, 0.18, 0.42, 0.64, 9, '#FFFFFF', 22); },
    kitaplik: function (c) {
      const r = c.o.renk || '#9C6B3E'; let s = c.gol(0.05, 0.5, 0.9, 0.45, 0.25) + c.B(0.05, 0.55, 0.9, 0.4, 80, r);
      for (let i = 0; i < 4; i++) { const t0 = 5 + i * 19; s += c.L(0.05, 0.55, 0.9, 0.4, 0, 0.06, 0.84, t0, t0 + 16, '#2A1E14'); for (let j = 0; j < 9; j++) s += c.L(0.05, 0.55, 0.9, 0.4, 0, 0.08 + j * 0.085, 0.08 + j * 0.085 + 0.06, t0, t0 + 8 + ((j * 7 + i * 3) % 5) * 1.6, KITAP[(i + j) % 6]); }
      return s;
    },
    tabela: function (c) {
      const r = c.o.renk || '#FFBE3D', t = String(c.o.etiket || 'KOD').slice(0, 10), boy = Math.min(14, Math.round(52 / Math.max(2, t.length * 0.62)));
      return c.gol(0.4, 0.35, 0.3, 0.3, 0.25) + c.cil(0.2, 0.5, 3.5, 66, '#6B7280', 0) + c.cil(1.8, 0.5, 3.5, 66, '#6B7280', 0) + c.B(0.05, 0.46, 1.9, 0.08, 30, r, 62) + c.ysol(0.05, 0.46, 1.9, 0.08, 62, 0.16, 11 + (14 - boy) / 3, t, boy, R.koyu(r, 0.72));
    },
    neon: function (c) {
      const k = c.o.renk || '#FF4FD8', t = String(c.o.etiket || 'AÇIK').slice(0, 9), E = c.E, f = function (s, tt) { return E(0.1 + s, 0.52, 22 + tt); };
      const kutu = [f(0.18, 6), f(1.62, 6), f(1.62, 34), f(0.18, 34)], boy = Math.min(14, Math.round(48 / Math.max(2, t.length * 0.62)));
      return c.gol(0.2, 0.4, 1.6, 0.3, 0.2) + c.cil(0.2, 0.5, 3, 22, '#4A4E69', 0) + c.cil(1.8, 0.5, 3, 22, '#4A4E69', 0) + c.B(0.1, 0.46, 1.8, 0.06, 40, '#12183A', 22) +
        '<polygon points="' + isoPts(kutu) + '" fill="none" stroke="' + k + '" stroke-opacity=".28" stroke-width="8" stroke-linejoin="round"/><polygon points="' + isoPts(kutu) + '" fill="none" stroke="' + k + '" stroke-width="2.6" stroke-linejoin="round"/>' + c.ysol(0.1, 0.46, 1.8, 0.06, 22, 0.28, 16 + (14 - boy) / 3, t, boy, k);
    },
    agac: function (c) { const p = c.E(0.5, 0.5, 0), g = c.o.renk || '#3FB571'; return c.gol(0.2, 0.2, 0.6, 0.6, 0.25) + c.cil(0.5, 0.5, 6, 36, '#8A5A3C', 0) + c.el(p[0] - 15, p[1] - 44, 17, 15, R.koyu(g, 0.25)) + c.el(p[0] + 15, p[1] - 46, 18, 16, R.koyu(g, 0.25)) + c.el(p[0], p[1] - 64, 25, 23, g) + c.el(p[0] - 7, p[1] - 72, 12, 9, R.acik(g, 0.22)) + c.el(p[0] + 11, p[1] - 57, 8, 6, R.acik(g, 0.12)); },
    bank: function (c) { const r = c.o.renk || '#B9854F'; return c.gol(0, 0.25, 2, 0.5, 0.25) + c.B(0.14, 0.34, 0.08, 0.32, 14, '#4A4E69') + c.B(1.78, 0.34, 0.08, 0.32, 14, '#4A4E69') + c.B(0.04, 0.3, 1.92, 0.08, 18, R.koyu(r, 0.1), 18) + c.B(0.04, 0.3, 1.92, 0.42, 5, r, 14); },
    cesme: function (c) {
      const p = c.E(1, 1, 0), x = p[0], y = p[1], n = isoN;
      return '<path d="M' + n(x - 58) + ' ' + n(y) + 'L' + n(x - 58) + ' ' + n(y + 10) + 'A58 29 0 0 0 ' + n(x + 58) + ' ' + n(y + 10) + 'L' + n(x + 58) + ' ' + n(y) + 'A58 29 0 0 1 ' + n(x - 58) + ' ' + n(y) + 'Z" fill="#9D947D"/>' + c.el(x, y, 58, 29, '#D9CFB6') + c.el(x, y + 1, 49, 24.5, '#4FA3D1') + c.el(x, y + 2, 38, 19, '#6FB8E0', 0.55) + c.cil(1, 1, 7, 38, '#CFC6B0', 0) + c.el(x, y - 38, 21, 10.5, '#D9CFB6') + c.el(x, y - 37, 15, 7.5, '#6FB8E0') +
        '<path d="M' + n(x) + ' ' + n(y - 40) + 'Q' + n(x - 22) + ' ' + n(y - 84) + ' ' + n(x - 36) + ' ' + n(y - 30) + 'M' + n(x) + ' ' + n(y - 40) + 'Q' + n(x + 22) + ' ' + n(y - 84) + ' ' + n(x + 36) + ' ' + n(y - 30) + 'M' + n(x) + ' ' + n(y - 40) + 'L' + n(x) + ' ' + n(y - 74) + '" fill="none" stroke="#BFE6FF" stroke-width="3" stroke-linecap="round" stroke-opacity=".85"/>';
    },
    tram: function (c) {
      const r = c.o.renk || '#FFD36A', E = c.E; let s = c.gol(0, 0.05, 3, 0.95) + c.B(0.1, 0.12, 2.8, 0.76, 8, '#2B2F45') + c.B(0.04, 0.08, 2.92, 0.84, 38, r, 8) + c.L(0.04, 0.08, 2.92, 0.84, 8, 0.02, 2.9, 12, 16, '#E8553E');
      for (let i = 0; i < 6; i++) { const s0 = 0.14 + i * 0.46; s += c.L(0.04, 0.08, 2.92, 0.84, 8, s0, s0 + 0.34, 21, 35, '#16204A') + c.L(0.04, 0.08, 2.92, 0.84, 8, s0 + 0.04, s0 + 0.12, 23, 33, '#3C4E96'); }
      return s + c.Rr(0.04, 0.08, 2.92, 0.84, 8, 0.12, 0.72, 14, 34, '#16204A') + c.B(0, 0.04, 3, 0.92, 5, R.koyu(r, 0.12), 46) + c.cz(E(1.5, 0.5, 51), E(1.5, 0.5, 66), '#6B7280', 2) + c.cz(E(1.1, 0.5, 67), E(1.9, 0.5, 67), '#6B7280', 2.6);
    },
    araba: function (c) {
      const r = c.o.renk || '#FF7A66'; let s = c.gol(0, 0.08, 2, 0.84, 0.28) + c.B(0.05, 0.12, 1.9, 0.76, 13, r, 6) + c.B(0.5, 0.18, 0.95, 0.64, 14, R.acik(r, 0.08), 19);
      s += c.L(0.5, 0.18, 0.95, 0.64, 19, 0.08, 0.42, 3, 11, '#BFE6FF') + c.L(0.5, 0.18, 0.95, 0.64, 19, 0.5, 0.87, 3, 11, '#BFE6FF') + c.Rr(0.5, 0.18, 0.95, 0.64, 19, 0.1, 0.54, 3, 11, '#9ED3F2');
      [0.5, 1.55].forEach(function (u) { const p = c.E(u, 0.88, 0); s += c.el(p[0], p[1] - 6, 7.5, 7.5, '#1B1F33') + c.el(p[0], p[1] - 6, 3.2, 3.2, '#9AA7C7'); });
      const f = c.E(1.95, 0.3, 11), g = c.E(1.95, 0.7, 11); return s + c.el(f[0], f[1], 3.2, 3.2, '#FFE9A8') + c.el(g[0], g[1], 3.2, 3.2, '#FFE9A8');
    },
    vinc: function (c) {
      const y = '#FFC83D', k = '#7A5A00', e = c.E; let s = c.gol(0.2, 0.2, 0.8, 0.8, 0.25) + c.B(0.35, 0.35, 0.3, 0.3, 150, y);
      for (let i = 0; i < 5; i++) s += c.cz(e(0.35, 0.65, i * 30), e(0.65, 0.65, i * 30 + 30), k, 1.4) + c.cz(e(0.65, 0.65, i * 30), e(0.65, 0.35, i * 30 + 30), k, 1.4);
      return s + c.B(-0.5, 0.45, 2.3, 0.1, 8, y, 150) + c.B(-0.5, 0.4, 0.3, 0.2, 16, '#4A4E69', 142) + c.cz(e(1.6, 0.5, 150), e(1.6, 0.5, 100), '#C5CEE4', 1.6) + c.cz(e(1.55, 0.5, 100), e(1.6, 0.5, 100), '#C5CEE4', 1.6) + c.B(1.45, 0.38, 0.3, 0.24, 18, '#D9653B', 82) + c.cz(e(1.6, 0.5, 100), e(1.45, 0.5, 100), '#C5CEE4', 1.4);
    },
    tente: function (c) {
      const E = c.E; let s = c.gol(0, 0.1, 2, 0.9, 0.22) + c.B(0.1, 0.1, 0.06, 0.06, 86, '#6B4A33') + c.B(1.84, 0.1, 0.06, 0.06, 86, '#6B4A33') + c.B(0.1, 0.45, 1.8, 0.45, 22, '#B9854F') + c.B(0.1, 0.88, 0.06, 0.06, 68, '#6B4A33') + c.B(1.84, 0.88, 0.06, 0.06, 68, '#6B4A33');
      for (let i = 0; i < 6; i++) { const u0 = i / 3, u1 = (i + 1) / 3, f = i % 2 ? '#F4EFE6' : '#E8553E'; s += c.pg([E(u0, 0.08, 86), E(u1, 0.08, 86), E(u1, 1, 66), E(u0, 1, 66)], f) + c.pg([E(u0, 1, 66), E(u1, 1, 66), E((u0 + u1) / 2, 1, 58)], f); }
      return s + c.cz(E(0.2, 0.7, 22), E(0.2, 0.7, 36), '#FFBE3D', 5) + c.el(E(1.4, 0.7, 30)[0], E(1.4, 0.7, 30)[1], 7, 4, '#45D98D');
    },
    'led-pano': function (c) {
      const t = String(c.o.etiket || 'YENİ İŞLETME: OTOPARK').slice(0, 24), boy = Math.min(14, Math.round(86 / Math.max(2, t.length * 0.62)));
      return c.gol(0.1, 0.4, 2.8, 0.3, 0.2) + c.B(0.2, 0.5, 0.08, 0.08, 58, '#4A4E69') + c.B(2.7, 0.5, 0.08, 0.08, 58, '#4A4E69') + c.B(0.1, 0.44, 2.8, 0.1, 36, '#0B0F1F', 58) + c.L(0.1, 0.44, 2.8, 0.1, 58, 0.06, 2.74, 3, 33, '#1A1330') + c.ysol(0.1, 0.44, 2.8, 0.1, 58, 0.18, 12 + (14 - boy) / 3, t, boy, '#FFB02E', 'JetBrains Mono,Consolas,monospace');
    },
    kapi: function (c) {
      const w = c.o.renk || '#C9BBA0', ac = !!c.o.acik, d = ac ? '#0B0F1F' : '#8A5E3E', p = c.E(0.62, 0.6, 30);
      return c.gol(0, 0.4, 1, 0.3, 0.25) + c.B(0, 0.4, 1, 0.2, 86, w) + c.L(0, 0.4, 1, 0.2, 0, 0.26, 0.74, 0, 62, d) + c.L(0, 0.4, 1, 0.2, 0, 0.3, 0.7, 62, 70, d) + c.L(0, 0.4, 1, 0.2, 0, 0.2, 0.8, 72, 80, R.koyu(w, 0.25)) + (ac ? '' : c.L(0, 0.4, 1, 0.2, 0, 0.32, 0.68, 36, 38, R.koyu(d, 0.3)) + c.disk(p, 2.4, '#FFD36A'));
    },
    kasa: function (c) {
      const r = c.o.renk || '#7A8BA8', p = c.E(0.5, 0.8, 17);
      let s = c.gol(0.15, 0.15, 0.7, 0.7, 0.25) + c.B(0.2, 0.2, 0.6, 0.6, 34, r) + c.L(0.2, 0.2, 0.6, 0.6, 0, 0.08, 0.52, 5, 29, R.koyu(r, 0.3)) + c.disk(p, 7.5, '#C5CEE4', ' stroke="#4A5878" stroke-width="2"') + c.disk(p, 2, '#4A5878') + c.L(0.2, 0.2, 0.6, 0.6, 0, 0.44, 0.5, 12, 22, '#FFD36A');
      if (c.o.dolu) { const t = c.E(0.5, 0.5, 52); s += '<circle cx="' + isoN(t[0]) + '" cy="' + isoN(t[1]) + '" r="9" fill="#FFBE3D" stroke="#B7790A" stroke-width="1.6"/><text x="' + isoN(t[0]) + '" y="' + isoN(t[1] + 4.2) + '" text-anchor="middle" font-family="Fredoka,Nunito,sans-serif" font-weight="700" font-size="12" fill="#7A4A00">B</text>'; }
      return s;
    },
    bariyer: function (c) {
      const ak = !!c.o.acik, e = c.E, p = e(0.32, 0.5, 26), q = ak ? e(0.8, 0.5, 90) : e(1.92, 0.5, 26);
      return c.gol(0.05, 0.3, 1.9, 0.4, 0.2) + c.B(0.14, 0.36, 0.22, 0.28, 30, '#E8553E') + c.B(0.14, 0.36, 0.22, 0.28, 6, '#F4EFE6', 12) + c.cz(p, q, '#F4EFE6', 7) + c.cz(p, q, '#E8553E', 7, ' stroke-dasharray="9 9"') + c.el(p[0], p[1], 4.5, 4.5, '#2A3358');
    },
    bayrak: function (c) {
      const p = c.E(0.5, 0.5, 100), x = p[0], y = p[1], r = c.o.renk || '#FF7A66', n = isoN;
      return c.gol(0.35, 0.35, 0.3, 0.3, 0.22) + c.cz(c.E(0.5, 0.5, 0), p, '#C5CEE4', 3) + c.el(x, y - 2, 4, 4, '#FFBE3D') + '<path d="M' + n(x + 1) + ' ' + n(y + 2) + 'q14 -9 28 0t28 0v26q-14 9 -28 0t-28 0z" fill="' + r + '"/><path d="M' + n(x + 1) + ' ' + n(y + 2) + 'q14 -9 28 0t28 0v8q-14 9 -28 0t-28 0z" fill="#FFFFFF" fill-opacity=".18"/>' + c.el(x + 22, y + 16, 5, 5, '#FFFFFF', 0.85);
    },
    hediye: function (c) {
      const r = c.o.renk || '#9B86FF', E = c.E, rb = '#FFD36A', t = E(0.5, 0.5, 28), x = t[0], y = t[1];
      return c.gol(0.1, 0.1, 0.8, 0.8, 0.25) + c.B(0.15, 0.15, 0.7, 0.7, 28, r) + c.pg([E(0.46, 0.15, 28), E(0.54, 0.15, 28), E(0.54, 0.85, 28), E(0.46, 0.85, 28)], rb) + c.pg([E(0.15, 0.46, 28), E(0.85, 0.46, 28), E(0.85, 0.54, 28), E(0.15, 0.54, 28)], R.acik(rb, 0.15)) +
        c.L(0.15, 0.15, 0.7, 0.7, 0, 0.31, 0.39, 0, 28, R.koyu(rb, 0.15)) + c.Rr(0.15, 0.15, 0.7, 0.7, 0, 0.31, 0.39, 0, 28, R.koyu(rb, 0.35)) + c.el(x - 8, y - 5, 8, 4.5, rb, null, -25) + c.el(x + 8, y - 5, 8, 4.5, rb, null, 25) + c.el(x - 8, y - 5, 4, 2, R.koyu(rb, 0.25), 0.7, -25) + c.el(x + 8, y - 5, 4, 2, R.koyu(rb, 0.25), 0.7, 25) + c.el(x, y - 2, 3.4, 3, '#E5B84B');
    }
  };
  /** Nesne türleri (25). */
  iso.PROP_TURLERI = ['kutu', 'koltuk', 'masa', 'bitki', 'lamba', 'hali', 'raf', 'tv', 'yatak', 'kitaplik', 'tabela', 'neon', 'agac', 'bank', 'cesme', 'tram', 'araba', 'vinc', 'tente', 'led-pano', 'kapi', 'kasa', 'bariyer', 'bayrak', 'hediye'];
  /** Her türün ayak izi (hücre) ve yüksekliği (px): { w, d, yuk }. */
  iso.PROP_META = META;
  /**
   * Nesne çizer (svg dizgesi, <g>). tur: iso.PROP_TURLERI; (gx, gy) ayak izinin kuzey köşe hücresi. opt: { orijin:{x,y}, gz (kat), z (px), renk, etiket (tabela/neon/led-pano), acik (lamba/tv/kapi/bariyer), dolu (kasa) }.
   * Çok hücreli nesneler (META.w × META.d) gx,gy'den güneydoğuya doğru kaplar; z-sıralama için iso.sirala({ gx, gy, w, d, svg }) kullan.
   */
  iso.prop = function (tur, gx, gy, opt) {
    const f = PROPLAR[tur]; if (!f) return '';
    return '<g class="iso-prop iso-prop-' + tur + '" data-tur="' + tur + '">' + f(baglam(gx, gy, opt || {})) + '</g>';
  };
  /** Tek başına gösterilebilen tam <svg> (kart önizlemesi). opt: { boyut (genişlik px, 120), zemin:true, renk, etiket, acik, dolu, aria }. */
  iso.propSvg = function (tur, opt) {
    const o = opt || {}, m = META[tur] || { w: 1, d: 1, yuk: 60 }, pad = 10, minX = -m.d * 32 - pad, maxX = m.w * 32 + pad, minY = -m.yuk - pad, maxY = (m.w + m.d) * 16 + pad, W = maxX - minX, H = maxY - minY, b = o.boyut || 120;
    let zm = ''; if (o.zemin !== false) for (let i = 0; i < m.w; i++) for (let j = 0; j < m.d; j++) zm += iso.tile(i, j, ((i + j) % 2) ? '#2F3F86' : '#2A3878');
    return '<svg viewBox="' + minX + ' ' + minY + ' ' + W + ' ' + H + '" width="' + b + '" height="' + Math.round(b * H / W) + '" role="img" aria-label="' + isoEsc(o.aria || tur) + '">' + zm + iso.prop(tur, 0, 0, o) + '</svg>';
  };
})();

/* ================= avatar: katmanlı (ten 6, sacStil 8, sacRenk 6, kiyafet 6, aksesuar, emote) ================= */
/** Avatar seçenekleri (Avatar Atölyesi/Dolap/Pazar için): ten, sacStil, sacRenk, kiyafet birer dizi; aksesuar = tanımlı aksesuar kimlikleri. */
const AVATAR_SECENEK = {
  ten: [{ ad: 'Açık', hex: '#F6D7BC' }, { ad: 'Buğday', hex: '#EBBE94' }, { ad: 'Bal', hex: '#D9A06E' }, { ad: 'Bronz', hex: '#B97A4E' }, { ad: 'Kahve', hex: '#8D5A3A' }, { ad: 'Koyu', hex: '#5E3A27' }],
  sacRenk: [{ ad: 'Siyah', hex: '#1F1B24' }, { ad: 'Kestane', hex: '#5A3825' }, { ad: 'Kumral', hex: '#8A5A32' }, { ad: 'Sarı', hex: '#E3B04B' }, { ad: 'Kızıl', hex: '#C2562B' }, { ad: 'Mavi', hex: '#3E6FD1' }],
  sacStil: ['Kısa', 'Uzun', 'Kıvırcık', 'Topuz', 'At kuyruğu', 'Dik', 'Küt', 'Örgü'].map(function (ad, i) { return { id: i, ad: ad }; }),
  kiyafet: [
    { ad: 'Tişört ve kot', tur: 'tisort', ust: '#4F8BEA', ust2: '#3A6BC2', alt: '#34456E', ayak: '#F2F2F2', kol: 'kisa' }, { ad: 'Turuncu hırka', tur: 'hirka', ust: '#F29A4A', ust2: '#C97226', alt: '#4A4E69', ayak: '#7B5E48', kol: 'uzun' },
    { ad: 'Mor kapüşon', tur: 'kapuson', ust: '#8A6CFF', ust2: '#6A4EE0', alt: '#2E3350', ayak: '#E8E8E8', kol: 'uzun' }, { ad: 'Kahve önlük', tur: 'onluk', ust: '#E9DFC9', ust2: '#8A5E3E', alt: '#3F3A52', ayak: '#5A4331', kol: 'uzun' },
    { ad: 'Lacivert blazer', tur: 'blazer', ust: '#2D3A7A', ust2: '#1E2757', alt: '#262B45', ayak: '#14161F', kol: 'uzun' }, { ad: 'Sarı yağmurluk', tur: 'yagmurluk', ust: '#FFC83D', ust2: '#D9A21B', alt: '#3A4466', ayak: '#2F3D70', kol: 'uzun' }],
  aksesuar: [{ id: 'sapka', ad: 'Çırak Şapkası' }, { id: 'bere', ad: 'Bere' }, { id: 'kasket', ad: 'Kasket' }, { id: 'baret', ad: 'Baret' }, { id: 'kaptan', ad: 'Kaptan Şapkası' }, { id: 'gozluk', ad: 'Gözlük' }, { id: 'kulaklik', ad: 'Kulaklık' }, { id: 'kolye', ad: 'Kolye' }, { id: 'rozet', ad: 'Rozet İğnesi' }],
  emote: [{ id: 'el-salla', ad: 'El Salla' }, { id: 'alkisla', ad: 'Alkışla' }, { id: 'gul', ad: 'Gül' }, { id: 'dusun', ad: 'Düşün' }, { id: 'dans', ad: 'Dans' }, { id: 'evet', ad: 'Evet' }, { id: 'hayir', ad: 'Hayır' }, { id: 'kalp', ad: 'Kalp' }, { id: 'tuslama', ad: 'Tuşlama' }, { id: 'omuz', ad: 'Omuz Silk' }]
};
/** Avatarın metin tarifi: "Bal ten, kıvırcık siyah saç, turuncu hırka, gözlük." */
function avatarTarif(av) {
  av = av || {}; const S = AVATAR_SECENEK, k = function (a, i) { return a[Math.max(0, Math.min(a.length - 1, Math.floor(Number(i) || 0)))]; };
  const acc = (av.aksesuar || []).map(function (id) { const x = S.aksesuar.filter(function (a) { return a.id === id; })[0]; return x ? x.ad.toLowerCase() : null; }).filter(Boolean);
  return k(S.ten, av.ten).ad + ' ten, ' + k(S.sacStil, av.sacStil).ad.toLowerCase() + ' ' + k(S.sacRenk, av.sacRenk).ad.toLowerCase() + ' saç, ' + k(S.kiyafet, av.kiyafet).ad.toLowerCase() + (acc.length ? ', ' + acc.join(', ') : '') + '.';
}
/** Belge sayfaları ve galeri için 6 örnek avatar (dışa aktarımda avatarlar.json'a gider). */
const AVATAR_ORNEKLERI = [
  { id: 'deniz', ad: 'Deniz', av: { ten: 2, sacStil: 3, sacRenk: 1, kiyafet: 2, aksesuar: [] } }, { id: 'ayse', ad: 'Ayşe', av: { ten: 1, sacStil: 2, sacRenk: 0, kiyafet: 1, aksesuar: ['gozluk'] } },
  { id: 'mert', ad: 'Mert', av: { ten: 3, sacStil: 5, sacRenk: 3, kiyafet: 0, aksesuar: ['kasket'] } }, { id: 'zeynep', ad: 'Zeynep', av: { ten: 0, sacStil: 1, sacRenk: 4, kiyafet: 4, aksesuar: ['kolye'] } },
  { id: 'can', ad: 'Can', av: { ten: 4, sacStil: 0, sacRenk: 0, kiyafet: 5, aksesuar: ['baret'] } }, { id: 'elif', ad: 'Elif', av: { ten: 5, sacStil: 4, sacRenk: 1, kiyafet: 3, aksesuar: ['kulaklik'] } }
];
/**
 * Katmanlı avatar (saf dizge, 96×132 tam boy). av: { ten 0–5, sacStil 0–7, sacRenk 0–5, kiyafet 0–5, aksesuar:[id…] } (state.avatar şekli).
 * opt: { boyut (yükseklik px, 96), kadraj:'tam'|'bust'|'yuz', emote:'el-salla'|'alkisla'|'gul'|'dusun'|'dans'|'evet'|'hayir'|'kalp'|'tuslama'|'omuz', golge:true, yon:'sol' (aynalar), aria }.
 */
const avatarSvg = (function () {
  const R = isoRenk, S = AVATAR_SECENEK, n = isoN;
  const k = function (a, i) { return a[Math.max(0, Math.min(a.length - 1, Math.floor(Number(i) || 0)))]; };
  const P = function (d, f, ek) { return '<path d="' + d + '" fill="' + f + '"' + (ek || '') + '/>'; };
  const C = function (x, y, r, f, ek) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + f + '"' + (ek || '') + '/>'; };
  const El = function (x, y, rx, ry, f, ek) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + f + '"' + (ek || '') + '/>'; };
  const Ln = function (x1, y1, x2, y2, st, w, ek) { return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" stroke="' + st + '" stroke-width="' + w + '" stroke-linecap="round"' + (ek || '') + '/>'; };
  const Pl = function (d, st, w, ek) { return '<path d="' + d + '" fill="none" stroke="' + st + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (ek || '') + '/>'; };
  const aynala = function (x) { return 96 - x; };
  function sacArka(stil, h) {
    switch (stil) {
      case 1: return P('M24 34C18 52 20 80 28 94L68 94C76 80 78 52 72 34Z', h);
      case 4: return P('M64 22C86 20 92 46 80 70C78 58 72 50 64 44Z', h) + P('M80 70C78 58 72 50 64 44L66 38C76 46 84 58 80 70Z', R.koyu(h, 0.2), ' fill-opacity=".5"');
      case 6: return P('M23 34C21 52 24 63 31 64L65 64C72 63 75 52 73 34Z', h);
      case 7: return Pl('M28 42C22 54 24 68 27 80', h, 8) + Pl('M68 42C74 54 72 68 69 80', h, 8) + C(27, 82, 3.4, R.koyu(h, 0.35)) + C(69, 82, 3.4, R.koyu(h, 0.35));
      default: return '';
    }
  }
  function sacOn(stil, h) {
    const d = R.koyu(h, 0.28), kisa = P('M26.5 36C24 18 38 11 48 11C60 11 72 18 69.5 36C67 29 63 25 58 24C54 28 42 28 38 24C33 25 29 29 26.5 36Z', h);
    switch (stil) {
      case 1: return P('M26 36C23 17 38 11 48 11C60 11 73 17 70 36C66 27 58 22 48 22C38 22 30 27 26 36Z', h) + Pl('M48 12C47 18 44 22 40 25', d, 1.4, ' stroke-opacity=".6"');
      case 2: return [[27, 27, 9], [36, 18, 10], [48, 13, 11], [60, 18, 10], [69, 27, 9], [24, 38, 7], [72, 38, 7], [38, 25, 7], [49, 23, 7], [59, 25, 7]].map(function (c) { return C(c[0], c[1], c[2], h); }).join('') + C(44, 14, 3.4, R.acik(h, 0.25), ' fill-opacity=".6"') + C(63, 19, 3, R.acik(h, 0.25), ' fill-opacity=".6"');
      case 3: return C(48, 8, 10, h) + C(45, 5.5, 3.2, R.acik(h, 0.25), ' fill-opacity=".6"') + kisa;
      case 5: return P('M26.5 36L27 20L35 26L36 9L44 22L50 6L55 21L63 8L64 25L71 15L69.5 36C64 29 58 26 48 26C38 26 32 29 26.5 36Z', h);
      case 6: return P('M26 38C23 16 38 10 48 10C60 10 73 16 70 38L70 31C60 28 36 28 26 31Z', h) + Pl('M32 30C44 27 56 27 66 30', d, 1.2, ' stroke-opacity=".5"');
      default: return kisa + Pl('M35 21C40 17 47 15 52 16', R.acik(h, 0.3), 2, ' stroke-opacity=".5"');
    }
  }
  function kiyafetCiz(kf, ten, kolPoz) {
    const u = kf.ust, u2 = kf.ust2, s = '', gov = [];
    const kolRenk = kf.kol === 'uzun' ? u : u, ala = kf.kol === 'uzun' ? u : ten;
    let ust = '', arka = '';
    switch (kf.tur) {
      case 'kapuson': arka = P('M32 62C36 50 60 50 64 62L62 70C56 64 40 64 34 70Z', u2); break;
      case 'yagmurluk': arka = P('M32 62C36 50 60 50 64 62L62 70C56 64 40 64 34 70Z', u2); break;
      default: break;
    }
    // gövde
    const govde = kf.tur === 'yagmurluk' ? 'M31 70Q31 62 40 61L56 61Q65 62 65 70L67 110Q67 113 63 113L33 113Q29 113 29 110Z' : 'M31 70Q31 62 40 61L56 61Q65 62 65 70L66 99Q66 103 62 103L34 103Q30 103 30 99Z';
    ust += P(govde, kf.tur === 'onluk' ? '#F1E7D2' : u);
    switch (kf.tur) {
      case 'tisort': ust += Pl('M42 61Q48 68 54 61', u2, 2.4) + P('M30 84L66 84L66 88L30 88Z', u2, ' fill-opacity=".45"'); break;
      case 'hirka': ust += P('M42 61L54 61L54 103L42 103Z', '#F5EBD7') + P('M31 70Q31 62 40 61L42 61L44 103L34 103Q30 103 30 99Z', u) + P('M65 70Q65 62 56 61L54 61L52 103L62 103Q66 103 66 99Z', u) + Ln(44, 62, 44, 103, u2, 1.6) + Ln(52, 62, 52, 103, u2, 1.6) + C(49.5, 78, 1.5, '#7A4A2A') + C(49.5, 88, 1.5, '#7A4A2A') + C(49.5, 98, 1.5, '#7A4A2A'); break;
      case 'kapuson': ust += Pl('M42 61Q48 69 54 61', u2, 3) + P('M39 86L57 86L58 96L38 96Z', u2, ' fill-opacity=".7"') + Ln(45, 66, 44, 78, '#F2F2F2', 1.6) + Ln(51, 66, 52, 78, '#F2F2F2', 1.6); break;
      case 'onluk': ust += P('M38 66L58 66L61 103L35 103Z', u2) + Ln(38, 66, 33, 62, u2, 2.4) + Ln(58, 66, 63, 62, u2, 2.4) + P('M41 88L55 88L55 98L41 98Z', R.koyu(u2, 0.25), ' fill-opacity=".6"'); break;
      case 'blazer': ust += P('M43 61L48 80L53 61Z', '#F4F6FB') + P('M40 61L48 82L44 101L34 100Q30 98 30 94L31 70Q31 62 40 61Z', u2) + P('M56 61L48 82L52 101L62 100Q66 98 66 94L65 70Q65 62 56 61Z', u2) + P('M48 66L51 72L48 80L45 72Z', '#FF7A66') + C(48, 90, 1.5, '#C5CEE4'); break;
      case 'yagmurluk': ust += Ln(48, 62, 48, 112, '#8A6A00', 1.8) + C(48, 84, 1.6, '#8A6A00') + C(48, 96, 1.6, '#8A6A00') + Pl('M42 61Q48 69 54 61', u2, 3) + P('M30 104L66 104L67 110Q67 113 63 113L33 113Q29 113 29 110Z', u2, ' fill-opacity=".5"'); break;
      default: break;
    }
    return { arka: arka, ust: ust, kolRenk: kolRenk, ala: ala };
  }
  function kollar(kf, tenHex, poz) {
    const ten = tenHex, kolu = kf.ust, ala = kf.kol === 'uzun' ? kf.ust : ten, kenar = R.koyu(kf.ust, 0.18);
    const kol = function (a, b, c) { // a: omuz, b: dirsek, c: el  (sol kol; sağ kol aynalanır)
      return Ln(a[0], a[1], b[0], b[1], kolu, 9.5) + Ln(b[0], b[1], c[0], c[1], ala, kf.kol === 'uzun' ? 9 : 7.5) + C(c[0], c[1] + 1.6, 4.8, ten) + (kf.kol === 'uzun' ? Ln(b[0], b[1], c[0], c[1], kenar, 9, ' stroke-opacity=".0"') : '');
    }, ayna = function (p) { return [aynala(p[0]), p[1]]; };
    const set = function (sol, sag) { return kol(sol[0], sol[1], sol[2]) + kol(ayna(sag[0]), ayna(sag[1]), ayna(sag[2])); };
    switch (poz) {
      case 'el-salla': return kol([30, 68], [24, 85], [24, 97]) + kol([66, 68], [77, 58], [80, 42]) + Pl('M86 36Q90 40 86 46M91 32Q97 40 91 50', '#E8EDF8', 2, ' stroke-opacity=".7"');
      case 'alkisla': return set([[30, 68], [33, 85], [45, 88]], [[30, 68], [33, 85], [45, 88]]) + Pl('M44 78L40 74M48 77L48 72M52 78L56 74', '#FFD36A', 2);
      case 'dans': return set([[30, 66], [22, 54], [17, 40]], [[30, 66], [22, 54], [17, 40]]);
      case 'dusun': return kol([30, 68], [24, 85], [24, 97]) + kol([66, 70], [72, 82], [60, 62]);
      case 'tuslama': return set([[30, 68], [31, 86], [41, 93]], [[30, 68], [31, 86], [41, 93]]);
      case 'omuz': return set([[30, 68], [20, 82], [15, 72]], [[30, 68], [20, 82], [15, 72]]);
      default: return set([[30, 68], [24, 85], [24, 97]], [[30, 68], [24, 85], [24, 97]]);
    }
  }
  function aksesuarCiz(id, ten, sacRenk) {
    switch (id) {
      case 'sapka': return P('M27 26C27 9 69 9 69 26Z', '#F5EBD7') + P('M27 22L69 22L69 27L27 27Z', '#F29A4A') + El(48, 27.5, 23, 4, '#E3D7BC');
      case 'bere': return P('M26 30C26 7 70 7 70 30Z', '#2FB5B0') + P('M25 26L71 26L71 33L25 33Z', '#1E8E8A') + C(48, 9, 5.5, '#F5EBD7');
      case 'kasket': return P('M27 29C27 12 69 12 69 29Z', '#6B7280') + P('M50 28C62 25 74 28 77 32C66 34 54 33 50 32Z', '#4A5060') + C(48, 14, 2, '#4A5060');
      case 'baret': return P('M25 29C25 5 71 5 71 29Z', '#FFC83D') + P('M45 8L51 8L51 28L45 28Z', '#E0A800') + P('M21 28L75 28L75 33C60 35 36 35 21 33Z', '#E0A800');
      case 'kaptan': return P('M28 25C28 10 68 10 68 25Z', '#F4F6FB') + P('M27 23L69 23L69 30L27 30Z', '#26356E') + El(48, 30, 24, 4.6, '#161C3C') + C(48, 23.5, 3.4, '#FFC83D');
      case 'gozluk': return C(40, 38, 7.4, '#CFE8FF', ' fill-opacity=".28" stroke="#2B2233" stroke-width="2"') + C(56, 38, 7.4, '#CFE8FF', ' fill-opacity=".28" stroke="#2B2233" stroke-width="2"') + Ln(47.4, 38, 48.6, 38, '#2B2233', 2) + Ln(32.6, 37, 27, 35.5, '#2B2233', 1.8) + Ln(63.4, 37, 69, 35.5, '#2B2233', 1.8);
      case 'kulaklik': return Pl('M25 38C23 6 73 6 71 38', '#2B3358', 4.4) + P('M19 32L29 32L29 46Q29 50 25 50L23 50Q19 50 19 46Z', '#FF7A66') + P('M67 32L77 32L77 46Q77 50 73 50L71 50Q67 50 67 46Z', '#FF7A66');
      case 'kolye': return Pl('M39 62Q48 76 57 62', '#FFD36A', 1.8) + C(48, 72, 3.2, '#22C9CE', ' stroke="#0E7C80" stroke-width="1"');
      case 'rozet': return C(57, 80, 4.6, '#FFD36A', ' stroke="#B7790A" stroke-width="1.2"') + C(57, 80, 1.8, '#E8553E');
      default: return '';
    }
  }
  function emoteUst(e) {
    switch (e) {
      case 'kalp': return P('M80 24C72 18 69 14 69 10C69 6.5 71.8 4.5 75 4.5C77.2 4.5 79 5.6 80 7.6C81 5.6 82.8 4.5 85 4.5C88.2 4.5 91 6.5 91 10C91 14 88 18 80 24Z', '#FF5C7A');
      case 'dusun': return C(79, 14, 9, '#F4F6FB', ' stroke="#2B3358" stroke-width="1.6"') + '<text x="79" y="19.5" text-anchor="middle" font-family="Fredoka,Nunito,sans-serif" font-weight="700" font-size="14" fill="#2B3358">?</text>' + C(70, 29, 2.2, '#F4F6FB') + C(66, 34, 1.4, '#F4F6FB');
      case 'dans': return Pl('M78 16L78 6L86 8', '#FFD36A', 2.4) + C(76, 17, 3, '#FFD36A') + Pl('M16 16L16 8L10 10', '#22C9CE', 2.2) + C(18, 17, 2.6, '#22C9CE');
      case 'evet': return C(80, 14, 9, '#45D98D') + Pl('M75.5 14l3.4 3.6 6.2-7', '#0B3B25', 2.6);
      case 'hayir': return C(80, 14, 9, '#FF7A66') + Pl('M75.5 9.5l9 9M84.5 9.5l-9 9', '#3F1410', 2.6);
      case 'tuslama': return C(80, 14, 10, '#2B3A78') + '<text x="80" y="18.2" text-anchor="middle" font-family="JetBrains Mono,Consolas,monospace" font-weight="700" font-size="11" fill="#7FE8B3">{ }</text>';
      default: return '';
    }
  }
  function agiz(e) { return e === 'gul' ? P('M41.5 47C43 55 53 55 54.5 47Z', '#8A2F3F', ' stroke="#8A2F3F" stroke-width="1.4" stroke-linejoin="round"') + P('M44 52C46 54.5 50 54.5 52 52C50 51 46 51 44 52Z', '#FF8FA0') : Pl('M42.5 48.5Q48 53.5 53.5 48.5', '#8A3F44', 2.1); }
  return function avatarSvg(av, opt) {
    av = av || {}; opt = opt || {};
    const tenO = k(S.ten, av.ten), sacO = k(S.sacRenk, av.sacRenk), kf = k(S.kiyafet, av.kiyafet), stil = Math.max(0, Math.min(7, Math.floor(Number(av.sacStil) || 0)));
    const kadraj = opt.kadraj || 'tam', e = opt.emote || '', b = opt.boyut || 96, ten = tenO.hex, gol = R.koyu(ten, 0.2), h = sacO.hex, hd = R.koyu(h, 0.32);
    const vb = { tam: [0, 0, 96, 132], bust: [8, -4, 80, 80], yuz: [20, 8, 56, 56] }[kadraj] || [0, 0, 96, 132], tam = kadraj === 'tam';
    const w = tam ? Math.round(b * 96 / 132) : b;
    const kiy = kiyafetCiz(kf, ten), sapkali = (av.aksesuar || []).some(function (id) { return ['sapka', 'bere', 'kasket', 'baret', 'kaptan'].indexOf(id) >= 0; });
    const poz = ['el-salla', 'alkisla', 'dans', 'dusun', 'tuslama', 'omuz'].indexOf(e) >= 0 ? e : '';
    const acc = (av.aksesuar || []).map(function (id) { return aksesuarCiz(id, ten, h); });
    const yuz = El(48, 36, 21, 22, ten) + El(27.2, 38, 4, 5, ten) + El(68.8, 38, 4, 5, ten) + El(27.6, 38.4, 1.8, 2.6, gol, ' fill-opacity=".55"') + El(68.4, 38.4, 1.8, 2.6, gol, ' fill-opacity=".55"');
    const ozellik = (e === 'gul' ? Pl('M37 38Q40 34.5 43 38M53 38Q56 34.5 59 38', '#2B2233', 2.2) : [40, 56].map(function (x) { return El(x, e === 'dusun' ? 37 : 38, 2.7, 3.5, '#2B2233') + C(x + 0.9, e === 'dusun' ? 35.2 : 36.8, 1, '#FFFFFF'); }).join('')) +
      Pl('M36.4 31.4Q40 29.4 43.6 30.8M52.4 30.8Q56 29.4 59.6 31.4', hd, 1.9) + Pl('M48 40.6Q46.2 44 48.4 44.8', gol, 1.4) + agiz(e) + C(35.6, 46, 3.7, '#FF8FA0', ' fill-opacity=".34"') + C(60.4, 46, 3.7, '#FF8FA0', ' fill-opacity=".34"');
    const sirt = tam ? (opt.golge === false ? '' : El(48, 126, 24, 5, '#050814', ' fill-opacity=".3"')) : '';
    const bacaklar = Ln(41, 102, 41, 117, kf.alt, 11.5) + Ln(55, 102, 55, 117, kf.alt, 11.5) + El(40, 121, 9.5, 5.2, kf.ayak) + El(56, 121, 9.5, 5.2, kf.ayak) + El(37, 119.5, 4, 2, '#FFFFFF', ' fill-opacity=".25"');
    const govde = sirt + sacArka(stil, h) + kiy.arka + (tam ? bacaklar : '') + kiy.ust + kollar(kf, ten, poz) + P('M42 54L54 54L54 65Q48 69 42 65Z', gol) + yuz + ozellik + (sapkali ? '<clipPath id="kk-av-sac"><rect x="0" y="27" width="96" height="110"/></clipPath><g clip-path="url(#kk-av-sac)">' + sacOn(stil, h) + '</g>' : sacOn(stil, h)) + acc.join('') + emoteUst(e) +
      (e === 'tuslama' ? '<rect x="29" y="95" width="38" height="8" rx="2.4" fill="#2B3358"/><path d="M33 98.5h4M40 98.5h4M47 98.5h4M54 98.5h4M60 98.5h3" stroke="#6F7AA0" stroke-width="1.6" stroke-linecap="round"/>' : '') +
      (e === 'omuz' ? Pl('M10 66L7 62M13 63L11 58', '#E8EDF8', 1.8, ' stroke-opacity=".6"') : '');
    return '<svg class="avatar" viewBox="' + vb.join(' ') + '" width="' + w + '" height="' + b + '" role="img" aria-label="' + isoEsc(opt.aria || 'Avatar') + '">' + (opt.yon === 'sol' ? '<g transform="translate(96 0) scale(-1 1)">' + govde + '</g>' : govde) + '</svg>';
  };
})();

/* ================= Usta portreleri: 7 Usta + Hasan Abi + Müfettiş + Kurul (96×96, düz şekilli dost portre) ================= */
/** Portre kimliği → { ad, renk }. renk: semt/Usta vurgu rengi (B1 §8 görünüşleri). */
const USTA_BILGI = {
  defne: { ad: 'Usta Defne', renk: '#F29A4A' }, kerem: { ad: 'Usta Kerem', renk: '#3F8FD0' }, nehir: { ad: 'Usta Nehir', renk: '#D9654B' }, baran: { ad: 'Usta Baran', renk: '#5BC27A' },
  elif: { ad: 'Usta Elif', renk: '#E05BC8' }, selin: { ad: 'Usta Selin', renk: '#3FC7BE' }, yusuf: { ad: 'Usta Yusuf', renk: '#9DB7FF' },
  hasan: { ad: 'Hasan Abi', renk: '#C9A25B' }, mufettis: { ad: 'Müfettiş', renk: '#8F9AAE' }, kurul: { ad: 'Kurul', renk: '#3A4C9E' }
};
/**
 * Usta portresi (saf dizge, kare). id: defne|kerem|nehir|baran|elif|selin|yusuf|hasan|mufettis|kurul. opt: { boyut (px, 96), aria }.
 * Her portre: renkli yuvarlak zemin + omuz/bust + ayırt edici aksesuar (B1 §8.2: tik nesnesi ve giysi); Kurul'un bedeni yoktur, mühürlü karttır.
 */
const ustaSvg = (function () {
  const R = isoRenk, n = isoN;
  const P = function (d, f, ek) { return '<path d="' + d + '" fill="' + f + '"' + (ek || '') + '/>'; };
  const C = function (x, y, r, f, ek) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + f + '"' + (ek || '') + '/>'; };
  const El = function (x, y, rx, ry, f, ek) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + f + '"' + (ek || '') + '/>'; };
  const Rc = function (x, y, w, h, rx, f, ek) { return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" rx="' + n(rx) + '" fill="' + f + '"' + (ek || '') + '/>'; };
  const Pl = function (d, st, w, ek) { return '<path d="' + d + '" fill="none" stroke="' + st + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (ek || '') + '/>'; };
  const KOSE = 'M29 41C25 24 36 16 48 16C60 16 71 24 67 41C65 34 62 30 57 28C53 31 43 31 39 28C34 30 31 34 29 41Z'; // kısa saç başlığı (yüz çerçevesinde)
  function kafa(o) {
    const t = o.ten, g = R.koyu(t, 0.2), gozY = o.gozY || 43, bas = o.kas || '#2B2233';
    return El(48, 42, 18, 20, t) + El(29.6, 44, 3.6, 4.6, t) + El(66.4, 44, 3.6, 4.6, t) + El(30, 44.4, 1.6, 2.4, g, ' fill-opacity=".5"') + El(66, 44.4, 1.6, 2.4, g, ' fill-opacity=".5"') +
      (o.goz === 'kis' ? Pl('M38 ' + gozY + 'L44 ' + gozY + 'M52 ' + gozY + 'L58 ' + gozY, '#2B2233', 2.4) : [41, 55].map(function (x) { return El(x, gozY, 2.2, 3, '#2B2233') + C(x + 0.8, gozY - 1.3, 0.85, '#FFFFFF'); }).join('')) +
      Pl('M37.6 37.4Q41 35.6 44.4 37M51.6 37Q55 35.6 58.4 37.4', bas, 1.7) + Pl('M48 45Q46.4 48 48.4 48.8', g, 1.3) + (o.agiz === 'duz' ? Pl('M43.5 53.5L52.5 53.5', '#8A3F44', 1.8) : Pl('M43 52.5Q48 57 53 52.5', '#8A3F44', 1.9)) +
      C(36.6, 50, 3.2, '#FF8FA0', ' fill-opacity=".3"') + C(59.4, 50, 3.2, '#FF8FA0', ' fill-opacity=".3"');
  }
  function omuz(renk) { return P('M4 100C4 80 22 71 48 71C74 71 92 80 92 100Z', renk); }
  function boyun(t) { return P('M41 57L55 57L55 72Q48 77 41 72Z', R.koyu(t, 0.2)); }
  const CIZ = {
    defne: function () {
      const t = '#EBBE94', h = '#6B3A1E';
      return [[31, 32, 8], [65, 32, 8], [28, 45, 7], [68, 45, 7], [37, 24, 8.5], [59, 24, 8.5], [48, 21, 9.5], [48, 12, 7.5]].map(function (c) { return C(c[0], c[1], c[2], h); }).join('') + omuz('#F29A4A') + P('M40 72L48 90L56 72Z', '#F5EBD7') + Pl('M40 72L46 98M56 72L50 98', '#C97226', 2) + boyun(t) + kafa({ ten: t, kas: h }) +
        [[39, 30, 6], [48, 28, 6], [57, 30, 6]].map(function (c) { return C(c[0], c[1], c[2], h); }).join('') + C(44, 26, 2.4, '#8F5A33', ' fill-opacity=".7"') + C(62, 33, 2.4, '#8F5A33', ' fill-opacity=".7"') + C(68, 87, 5.2, t) + Rc(66, 79, 14, 5.4, 2, '#F4F6FB', ' transform="rotate(-30 72 82)"');
    },
    kerem: function () {
      const t = '#D9A06E', h = '#B8BEC8';
      return omuz('#25376B') + Pl('M24 80L22 98M32 76L30 98M40 74L39 98M56 74L57 98M64 76L66 98M72 80L74 98', '#35498A', 1.6, ' stroke-opacity=".7"') + P('M62 74L90 88L90 100L58 100Z', '#FFC83D') + P('M62 74L90 88L88 91L60 78Z', '#E0A800') + boyun(t) + kafa({ ten: t, kas: R.koyu(h, 0.4) }) +
        P(KOSE, h) + Pl('M36 24C42 20 52 20 60 24', R.acik(h, 0.3), 1.4, ' stroke-opacity=".5"') + Rc(64, 84, 18, 14, 2.6, '#9AA7C7', ' stroke="#4A5878" stroke-width="1.2"') + Rc(66, 86, 14, 4.6, 1, '#16204A') + [[67.5, 94], [72, 94], [76.5, 94]].map(function (c) { return C(c[0], c[1], 1.3, '#4A5878'); }).join('') + Pl('M31 91q6 3 11 0', '#E8D3A6', 2.6);
    },
    nehir: function () {
      const t = '#E3B38A', h = '#2B2438';
      return omuz('#8F9AAE') + P('M38 72L58 72L66 100L30 100Z', '#8A5A3C') + Pl('M38 72L34 71M58 72L62 71', '#6B4A33', 3) + Rc(40, 82, 16, 9, 2, R.koyu('#8A5A3C', 0.25), ' fill-opacity=".7"') + boyun(t) + kafa({ ten: t, kas: h }) + P(KOSE, h) +
        P('M29 41C27 37 28 33 31 31L33 37ZM67 41C69 37 68 33 65 31L63 37Z', '#3E8BFF') + Pl('M40 27C44 24.4 50 24.4 54 27', '#3E8BFF', 2.6) + Rc(28, 27, 40, 4.4, 2, '#3A3A46') + C(40, 29, 7, '#4A4E5A') + C(56, 29, 7, '#4A4E5A') + C(40, 29, 4.4, '#FFA33A') + C(56, 29, 4.4, '#FFA33A') + C(38.4, 27.4, 1.4, '#FFE9A8') + C(54.4, 27.4, 1.4, '#FFE9A8') +
        Rc(64, 80, 5, 22, 1, '#E3C58C', ' transform="rotate(-18 66 90)"') + Pl('M66 84l3-1M65 89l3-1M64 94l3-1', '#8A6A3C', 1.2, ' transform="rotate(-0 66 90)"');
    },
    baran: function () {
      const t = '#C98E63', h = '#2A2230';
      return omuz('#5BC27A') + P('M40 72L48 82L56 72Z', '#F4F6FB') + Pl('M40 72L48 82L56 72', '#3E9C5E', 2.2) + boyun(t) + kafa({ ten: t, kas: h }) + P('M29 41L28 25L35 30L36 14L43 26L48 11L54 25L61 13L62 29L68 22L67 41C62 34 56 31 48 31C40 31 34 34 29 41Z', h) +
        C(41, 43, 7.6, '#CFE8FF', ' fill-opacity=".25" stroke="#2B2233" stroke-width="1.8"') + C(55, 43, 7.6, '#CFE8FF', ' fill-opacity=".25" stroke="#2B2233" stroke-width="1.8"') + Pl('M48.6 43L47.4 43', '#2B2233', 1.8) +
        Rc(60, 80, 24, 17, 3, '#16204A', ' stroke="#7D9BFF" stroke-width="1.6" transform="rotate(-10 72 88)"') + Rc(64, 90, 4, 5, 1, '#22C9CE', ' transform="rotate(-10 72 88)"') + Rc(70, 86, 4, 9, 1, '#FFBE3D', ' transform="rotate(-10 72 88)"') + Rc(76, 88, 4, 7, 1, '#FF7A66', ' transform="rotate(-10 72 88)"');
    },
    elif: function () {
      const t = '#E6B992', h = '#1E1A24';
      return P('M56 22C72 8 90 18 82 42C80 30 72 26 62 29Z', h) + omuz('#2B2F45') + P('M40 72L48 92L56 72Z', '#F4F6FB') + P('M40 72L48 94L44 100L30 100L34 76Z', '#3A4066') + P('M56 72L48 94L52 100L66 100L62 76Z', '#3A4066') + boyun(t) + kafa({ ten: t, kas: h }) + P(KOSE, h) + Pl('M20 36C22 30 28 27 34 27', R.acik(h, 0.3), 1.6, ' stroke-opacity=".6"') +
        Pl('M42 74Q48 90 54 74', '#FFC83D', 1.2) + C(48, 88, 7, '#E8EDF8', ' stroke="#FFC83D" stroke-width="2"') + Rc(46.6, 80, 2.8, 3, 1, '#FFC83D') + Pl('M48 88L48 84.5M48 88L51 89.6', '#2B3358', 1.4);
    },
    selin: function () {
      const t = '#DDAA82', h = '#5B3A2A';
      let kare = ''; for (let i = 0; i < 5; i++) kare += Pl('M' + (8 + i * 18) + ' 72L' + (8 + i * 18) + ' 100', '#B7F0EA', 1.4, ' stroke-opacity=".5"') + Pl('M6 ' + (76 + i * 7) + 'L92 ' + (76 + i * 7), '#B7F0EA', 1.4, ' stroke-opacity=".5"');
      return omuz('#2E9E98') + kare + P('M40 72L48 82L56 72Z', '#F4F6FB') + boyun(t) + kafa({ ten: t, kas: h }) + P(KOSE, h) + P('M29 41C25 49 27 56 32 55L33 43ZM67 41C71 49 69 56 64 55L63 43Z', h) +
        Rc(25, 34, 4, 17, 1.6, '#FFC83D', ' transform="rotate(-16 27 42)"') + Rc(25.4, 32.6, 4, 3.4, 1.4, '#FF8FA0', ' transform="rotate(-16 27 42)"') + Rc(58, 82, 26, 11, 5.5, '#F4EFE6', ' stroke="#C9BFA6" stroke-width="1.2" transform="rotate(-14 71 88)"') + Pl('M63 86h16M63 90h12', '#7D9BFF', 1.2, ' transform="rotate(-14 71 88)"');
    },
    yusuf: function () {
      const t = '#D6A57A', h = '#E6EAF0';
      return omuz('#7C8AA3') + Pl('M48 74L48 100', '#5F6B82', 1.8) + P('M38 72L48 80L58 72L62 76L48 86L34 76Z', '#6A7791') + boyun(t) + kafa({ ten: t, kas: R.koyu(h, 0.45), agiz: 'duz' }) + P(KOSE, h, ' transform="translate(0 1)"') +
        P('M31 46C31 66 42 70 48 70C54 70 65 66 65 46C62 56 56 58 48 58C40 58 34 56 31 46Z', '#F2F4F8') + Pl('M43 55Q48 58.4 53 55', '#B8BEC8', 1.8) + C(38, 86, 6.4, '#2B3358') + C(58, 86, 6.4, '#2B3358') + C(38, 86, 3, '#7D9BFF') + C(58, 86, 3, '#7D9BFF') + Rc(41, 83, 14, 5, 2, '#2B3358') + Pl('M40 75L38 82M56 75L58 82', '#2B3358', 1.8);
    },
    hasan: function () {
      const t = '#D3A074', h = '#2A2024';
      return omuz('#EEF2FA') + Pl('M10 82L86 82M12 90L84 90M10 98L86 98M22 74L22 100M38 74L38 100M58 74L58 100M74 74L74 100', '#7D9BFF', 1.2, ' stroke-opacity=".55"') + P('M4 100C4 82 20 73 40 71L44 100Z', '#8C7B4A') + P('M92 100C92 82 76 73 56 71L52 100Z', '#8C7B4A') + boyun(t) + kafa({ ten: t, kas: h }) +
        P('M33 49C38 46 44 47 48 49C52 47 58 46 63 49C60 55 52 54 48 52C44 54 36 55 33 49Z', h) + P('M24 32C22 16 74 16 72 32C66 24 30 24 24 32Z', '#6B7280') + P('M50 28C64 25 80 28 84 33C72 35 56 34 50 32Z', '#4A5060') + C(48, 19, 2.2, '#4A5060') +
        Rc(62, 80, 20, 18, 2.4, '#FFFDF4', ' stroke="#C9BFA6" stroke-width="1.2" transform="rotate(8 72 89)"') + Pl('M66 85h12M66 89h12M66 93h12', '#7D9BFF', 1, ' transform="rotate(8 72 89)"') + Rc(66, 41, 3, 14, 1.2, '#FFC83D', ' transform="rotate(14 67 48)"');
    },
    mufettis: function () {
      const t = '#E6B992';
      return omuz('#C8B48A') + P('M40 72L48 94L40 100L24 100L30 78Z', '#B09B72') + P('M56 72L48 94L56 100L72 100L66 78Z', '#B09B72') + P('M43 72L48 82L53 72Z', '#F4F6FB') + Rc(14, 90, 68, 5, 1, '#8A7752') + boyun(t) + kafa({ ten: t, kas: '#2B2233', goz: 'kis', gozY: 44, agiz: 'duz' }) +
        P('M31 32C31 12 65 12 65 32Z', '#9C8B6B') + Rc(31, 25, 34, 5, 1, '#3A3226') + El(48, 32, 32, 6.4, '#8A7A5E') + El(48, 31, 32, 5.4, '#A39370') + Rc(10, 76, 28, 22, 3, '#45D98D', ' stroke="#1E9E5F" stroke-width="1.4" transform="rotate(-8 24 87)"') + Rc(10, 72, 12, 5, 2, '#45D98D', ' transform="rotate(-8 24 87)"') + Pl('M16 84h16M16 89h12', '#1E9E5F', 1.4, ' transform="rotate(-8 24 87)"');
    },
    kurul: function () {
      return Rc(24, 12, 48, 70, 8, '#243066', ' stroke="#FFD36A" stroke-width="1.8"') + Rc(28, 16, 40, 62, 5, 'none', ' stroke="#FFD36A" stroke-opacity=".4" stroke-width="1"') + Rc(34, 21, 28, 3.4, 1.7, '#FFD36A') +
        [['#22C9CE', 38, 30], ['#FFBE3D', 28, 41], ['#9B86FF', 20, 52]].map(function (b) { return Rc(34, b[2], 28, 3, 1.5, '#E8EDF8', ' fill-opacity=".5"') + Rc(34, b[2] + 6, 28, 6, 3, '#16204A') + Rc(34, b[2] + 6, b[1], 6, 3, b[0]); }).join('') +
        P('M54 80L50 92L58 88L64 94L62 82Z', '#C2493A') + C(58, 74, 13, '#FFD36A', ' stroke="#B7790A" stroke-width="1.8"') + C(58, 74, 9, 'none', ' stroke="#B7790A" stroke-width="1.2"') + Pl('M53 74l3.4 3.6L63.5 70', '#7A4A00', 2.4);
    }
  };
  return function ustaSvg(id, opt) {
    opt = opt || {}; const b = opt.boyut || 96, bilgi = USTA_BILGI[id] || { ad: String(id || 'Usta'), renk: '#8F9AAE' }, f = CIZ[id], cid = 'kkp-' + String(id || 'x').replace(/[^a-z-]/g, '');
    const zemin = id === 'kurul' ? '#1B2650' : R.koyu(bilgi.renk, 0.5), isik = id === 'kurul' ? '#2A3870' : R.karistir(bilgi.renk, '#0A0F24', 0.28);
    return '<svg class="usta-portre" viewBox="0 0 96 96" width="' + b + '" height="' + b + '" role="img" aria-label="' + isoEsc(opt.aria || bilgi.ad) + '"><clipPath id="' + cid + '"><circle cx="48" cy="48" r="46"/></clipPath>' +
      C(48, 48, 46, zemin) + '<g clip-path="url(#' + cid + ')">' + C(48, 40, 38, isik, ' fill-opacity=".85"') + (f ? f() : Pl('M36 40a12 12 0 1 1 18 10', '#E8EDF8', 4)) + '</g>' + C(48, 48, 46, 'none', ' stroke="' + R.koyu(bilgi.renk, 0.62) + '" stroke-width="3"') + C(48, 48, 43.2, 'none', ' stroke="#FFFFFF" stroke-opacity=".22" stroke-width="1.2"') + '</svg>';
  };
})();

/**
 * Mağaza/dolap ürün önizlemesi (saf dizge): onizleSvg(urun.onizleme, { boyut, av }). onizleme: { tur:'prop'|'avatar', anahtar }.
 * prop → iso.propSvg(anahtar); avatar → anahtar bir aksesuar kimliği, 'kiyafet-N' (0–5) ya da 'emote-AD' olabilir. opt.av: önizlemede giydirilecek taban avatar.
 */
function onizleSvg(on, opt) {
  opt = opt || {}; on = on || {}; const b = opt.boyut || 96, a = String(on.anahtar || '');
  if (on.tur === 'prop') return iso.propSvg(a, { boyut: Math.round(b * 1.2), aria: opt.aria });
  const av = Object.assign({ ten: 2, sacStil: 0, sacRenk: 1, kiyafet: 0, aksesuar: [] }, opt.av || {}); let emote = '', kadraj = 'bust';
  const m = /^kiyafet-(\d)$/.exec(a);
  if (m) { av.kiyafet = Number(m[1]); kadraj = 'tam'; } else if (/^emote-/.test(a)) { emote = a.slice(6); kadraj = 'tam'; } else av.aksesuar = [a];
  return avatarSvg(av, { boyut: b, kadraj: kadraj, emote: emote, aria: opt.aria });
}

/* ================= walker: öğeyi ekran noktaları boyunca yürütür (tek DOM kullanan parça) ================= */
/**
 * walker(el, noktalar, ms) → Promise<boolean> (varışta true, iptalde false). el: SVG <g> (transform özniteliği) ya da HTML öğesi (style.transform); noktalar: [{x,y}] ya da [[x,y]] (ilk nokta başlangıçtır).
 * Yürürken hafif zıplar, el.dataset.yon = 'sol'|'sag' ayarlar. Yeni walker çağrısı öncekini iptal eder. prefers-reduced-motion'da anında son noktaya gider.
 */
function walker(el, noktalar, ms) {
  return new Promise(function (coz) {
    const pts = (noktalar || []).map(function (p) { return Array.isArray(p) ? { x: p[0], y: p[1] } : p; });
    if (!el || pts.length === 0) { coz(false); return; }
    if (el.__walkIptal) el.__walkIptal();
    const svg = typeof SVGElement !== 'undefined' && el instanceof SVGElement;
    const koy = function (x, y) { if (svg) el.setAttribute('transform', 'translate(' + isoN(x) + ' ' + isoN(y) + ')'); else el.style.transform = 'translate(' + isoN(x) + 'px,' + isoN(y) + 'px)'; };
    const son = pts[pts.length - 1];
    if (pts.length === 1 || reducedMotion()) { koy(son.x, son.y); el.__walkIptal = null; coz(true); return; }
    const uz = [0]; for (let i = 1; i < pts.length; i++) uz.push(uz[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    const toplam = uz[uz.length - 1] || 1, sure = Math.max(80, ms || 600), adim = Math.max(1, Math.round(toplam / 28));
    let iptal = false, t0 = null;
    el.__walkIptal = function () { iptal = true; el.__walkIptal = null; coz(false); };
    koy(pts[0].x, pts[0].y);
    const kare = function (t) {
      if (iptal) return; if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / sure), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, d = e * toplam; let i = 1; while (i < uz.length - 1 && uz[i] < d) i++;
      const a = pts[i - 1], b = pts[i], f = uz[i] === uz[i - 1] ? 1 : (d - uz[i - 1]) / (uz[i] - uz[i - 1]);
      const x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f - (p < 1 ? Math.abs(Math.sin(p * adim * Math.PI)) * 3 : 0);
      if (b.x !== a.x) el.dataset.yon = b.x < a.x ? 'sol' : 'sag';
      koy(x, y);
      if (p < 1) requestAnimationFrame(kare); else { koy(son.x, son.y); el.__walkIptal = null; coz(true); }
    };
    requestAnimationFrame(kare);
  });
}
