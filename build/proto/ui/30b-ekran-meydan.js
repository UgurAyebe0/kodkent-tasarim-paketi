/* ==== ui/30b-ekran-meydan.js — Derleyici Meydanı (P5) ====
   Kaynak: B8 §6.4, B1 §3.0 / §8 / §9, brief/02 §E.2 (4). İzometrik SVG sahne (13×11 hücre), tıkla-yürü (600 ms), LED pano, NPC avatarlar,
   Usta Defne karşılama balonları (ilk giriş), emote + hazır cümle balonu, gün fazı, saat başı Meydan Sorusu (XP/Bayt vermez). */
(function () {
  const VERI = function () { return (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}; };
  const COLS = 13, ROWS = 11;
  const AL = iso.alan(COLS, ROWS, { yukari: 178, kenar: 24 }), OG = AL.orijin, VBW = AL.genislik, VBH = AL.yukseklik;
  const BOY = 64, DX = 23, DY = 59;               // avatar boyutu ve ayak noktası (walker için)
  const ID = function (id) { return document.getElementById(id); };
  const nk = function (v) { return Math.round(v * 10) / 10; };
  const aktif = function () { return KK_UI.current() === 'meydan'; };
  const ad = function () { return state.ad || 'Deniz'; };
  const upper = function (s) { return String(s).toLocaleUpperCase('tr-TR'); };

  /* ---------- geometri ---------- */
  function P(gx, gy, z) { const p = iso.xy(gx, gy, 0, OG); return [p.x, p.y - (z || 0)]; }
  function poli(arr, fill, ek) { return '<polygon points="' + arr.map(function (p) { return nk(p[0]) + ',' + nk(p[1]); }).join(' ') + '" fill="' + fill + '"' + (ek || '') + '/>'; }
  function sol(gx0, gx1, gy, z0, z1) { return [P(gx0, gy, z0), P(gx1, gy, z0), P(gx1, gy, z1), P(gx0, gy, z1)]; }
  function sag(gx, gy0, gy1, z0, z1) { return [P(gx, gy0, z0), P(gx, gy1, z0), P(gx, gy1, z1), P(gx, gy0, z1)]; }
  const ENGEL = [[2, 0, 8, 2], [9, 0, 11, 2], [0, 0, 2, 2], [0, 3, 2, 8], [10, 3, 13, 4], [10, 5, 12, 7], [7, 9, 10, 10], [0, 8, 2, 11], [10, 8, 13, 10], [5, 5, 7, 7], [2, 9, 10, 11]];
  function engelli(gx, gy) { if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return true; return ENGEL.some(function (r) { return gx >= r[0] && gx < r[2] && gy >= r[1] && gy < r[3]; }); }
  function serbest(gx, gy) {
    if (!engelli(gx, gy)) return [gx, gy];
    for (let r = 1; r <= 4; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; if (!engelli(gx + dx, gy + dy)) return [gx + dx, gy + dy]; }
    return null;
  }
  function ayak(gx, gy) { const p = iso.xy(gx + 0.5, gy + 0.5, 0, OG); return { x: p.x - DX, y: p.y - DY }; }

  /* ---------- zaman: gün fazı (Türkiye saati) ve saat başı soru ---------- */
  function faz() {
    const sa = (new Date().getUTCHours() + 3) % 24;
    if (sa >= 6 && sa < 10) return { id: 'sabah', ad: 'Sabah', renk: '#DDE8F5', op: 0.1, isik: false };
    if (sa >= 10 && sa < 17) return { id: 'gun', ad: 'Gün', renk: '#FFFFFF', op: 0.04, isik: false };
    if (sa >= 17 && sa < 20) return { id: 'aksam', ad: 'Akşam', renk: '#F2B134', op: 0.13, isik: true };
    return { id: 'gece', ad: 'Gece', renk: '#1B2440', op: 0.3, isik: true };
  }
  const soruDk = function () { return 60 - new Date().getMinutes(); };

  /* ---------- sahne parçaları ---------- */
  function pencereler(gx, gy, w, d, h, tohum, isik) {
    let s = '';
    for (let c = 0; c < w * 2; c++) for (let r = 0; (24 + r * 28 + 14) < h - 8; r++) {
      const yanik = isik && ((c * 7 + r * 5 + tohum) % 4) !== 0, a = gx + c * 0.5 + 0.12, z0 = 22 + r * 28;
      s += poli(sol(a, a + 0.26, gy + d, z0, z0 + 14), yanik ? '#FFD27A' : '#2B3768', ' opacity="' + (yanik ? 0.95 : 0.75) + '"');
    }
    return s;
  }
  function bina(gx, gy, w, d, h, renk, tohum, isik) { return iso.blok(gx, gy, { w: w, d: d, h: h, renk: renk, orijin: OG }) + pencereler(gx, gy, w, d, h, tohum, isik); }
  function nesne(id, ariaAd, svg) { return '<g class="mey-nesne" data-action="mey-nesne" data-nesne="' + id + '" tabindex="0" role="button" aria-label="' + esc(ariaAd) + '"><title>' + esc(ariaAd) + '</title>' + svg + '</g>'; }
  function etiket(metin, gx, gy, z) { const p = P(gx, gy, z); return '<text class="mey-etiket" x="' + nk(p[0]) + '" y="' + nk(p[1]) + '" text-anchor="middle">' + esc(metin) + '</text>'; }
  function propOge(tur, gx, gy, opt) { const m = iso.PROP_META[tur] || { w: 1, d: 1 }; return { gx: gx, gy: gy, w: m.w, d: m.d, svg: iso.prop(tur, gx, gy, Object.assign({ orijin: OG }, opt || {})) }; }

  function ledGrup(metin, y0) {
    const a = P(2.7, 2, 128), W = 147, H = 38;
    return '<g class="mey-nesne mey-led" data-action="mey-nesne" data-nesne="led" tabindex="0" role="button" aria-label="Şehir panosu. Geçmişi aç"><title>Şehir panosu</title>' +
      '<g transform="translate(' + nk(a[0]) + ' ' + nk(a[1]) + ') skewY(26.565)"><rect x="-3" y="-3" width="' + (W + 6) + '" height="' + (H + 6) + '" rx="3" fill="#2A1612" stroke="#7A4A2A" stroke-width="2"/><rect width="' + W + '" height="' + H + '" fill="#160807"/>' +
      '<g clip-path="url(#mey-led-klip)"><text id="mey-led-yazi" class="mey-led-yazi" x="' + M.led.x + '" y="26">' + esc(metin) + '</text></g><rect width="' + W + '" height="' + H + '" fill="url(#mey-led-izgara)" pointer-events="none"/></g></g>';
  }
  function sahneSvg() {
    const f = faz(), isik = f.isik, M2 = M;
    // zemin
    let z = '<g id="mey-zemin" data-action="mey-zemin">' + iso.zemin(COLS, ROWS, ['#29336A', '#2E3972'], { orijin: OG });
    for (let gx = 3; gx < 10; gx++) for (let gy = 3; gy < 9; gy++) z += iso.tile(gx, gy, (gx + gy) % 2 ? '#3E4A86' : '#38447F', { orijin: OG });
    for (let gx = 2; gx < 10; gx++) for (let gy = 9; gy < 11; gy++) z += iso.tile(gx, gy, '#171E40', { orijin: OG });
    [9.35, 9.65, 10.35, 10.65].forEach(function (g) { const a = P(2, g, 0), b = P(10, g, 0); z += '<line x1="' + nk(a[0]) + '" y1="' + nk(a[1]) + '" x2="' + nk(b[0]) + '" y2="' + nk(b[1]) + '" stroke="#6C7AAE" stroke-width="1.6" opacity=".8"/>'; });
    z += '</g>';
    const oge = [];
    // Akademi + LED + kapı
    const kap = sol(4.55, 5.45, 2, 0, 46), kule = iso.blok(4.6, 0.4, { w: 1.4, d: 1.2, h: 56, z: 150, renk: '#C9B98F', orijin: OG }), saat = P(5.3, 1.6, 150 + 30);
    oge.push({ gx: 2, gy: 0, w: 6, d: 2, svg: nesne('akademi', 'Akademi: ana kapı', bina(2, 0, 6, 2, 150, '#B9A57F', 3, isik) + kule + '<circle cx="' + nk(saat[0]) + '" cy="' + nk(saat[1]) + '" r="8" fill="#F4EFE6" stroke="#6B5B3A" stroke-width="2"/>' + poli(kap, '#1A1030', ' stroke="#F4EFE6" stroke-width="2"') + iso.blok(4.2, 2, { w: 1.6, d: 0.5, h: 6, renk: '#8A93B8', orijin: OG })) + ledGrup(M2.led.liste[0]) });
    // Belediye Köşkü
    oge.push({ gx: 9, gy: 0, w: 2, d: 2, svg: nesne('belediye', 'Belediye Köşkü: Memur Nuran', bina(9, 0, 2, 2, 74, '#6E7FB8', 5, isik) + poli(sol(9.7, 10.3, 2, 0, 30), '#1A1030') + '<text class="mey-tabela" transform="translate(' + nk(P(9.15, 2, 62)[0]) + ' ' + nk(P(9.15, 2, 62)[1]) + ') skewY(26.565)" x="0" y="0">BELEDİYE</text>') });
    // Arena (iskeleli, v1.2)
    oge.push({ gx: 0, gy: 0, w: 2, d: 2, svg: nesne('arena', 'Arena: v1.2', iso.blok(0, 0, { w: 2, d: 2, h: 40, renk: '#7C86AE', orijin: OG }) + poli(sol(0.1, 1.9, 2, 4, 14), '#FFC83D') + poli(sol(0.1, 0.5, 2, 4, 14), '#161B33') + poli(sol(0.9, 1.3, 2, 4, 14), '#161B33') + poli(sol(1.5, 1.9, 2, 4, 14), '#161B33') + iso.prop('vinc', 0, 1, { orijin: OG })) });
    // Pazar (sağ yüz üzerinde tente şeritleri + mankenler)
    let tente = ''; for (let k = 0; k < 10; k++) tente += poli(sag(2, 3 + k * 0.5, 3.5 + k * 0.5, 36, 54), k % 2 ? '#F4EFE6' : '#C8453A');
    const mk = function (gy, ki) { const p = iso.xy(2.5, gy, 0, OG); return '<g transform="translate(' + nk(p.x - 18) + ' ' + nk(p.y - 52) + ')">' + avatarSvg({ ten: 2, sacStil: 1, sacRenk: 1, kiyafet: ki, aksesuar: [] }, { boyut: 52, kadraj: 'tam' }) + '</g>'; };
    oge.push({ gx: 0, gy: 3, w: 2, d: 5, svg: nesne('pazar', 'Pazar', iso.blok(0, 3, { w: 2, d: 5, h: 62, renk: '#A9694B', orijin: OG }) + tente + poli(sag(2, 3.2, 7.8, 0, 8), '#5B3A2C') + mk(4.2, 2) + mk(6.4, 4)) });
    // Liderlik Panosu + Podyum
    const lid = ((VERI().liderlik || {}).haftalik || []).slice(0, 3), ls = P(10.2, 4, 84);
    let lt = ''; lid.forEach(function (o, i) { lt += '<text class="mey-lig" x="3" y="' + (22 + i * 10) + '">' + (i + 1) + '. ' + esc(String(o.ad).slice(0, 11)) + '</text>'; });
    oge.push({ gx: 10, gy: 3, w: 3, d: 1, svg: nesne('liderlik', 'Liderlik Panosu', iso.blok(10, 3, { w: 3, d: 1, h: 92, renk: '#2B3B7C', orijin: OG }) + poli(sol(10.15, 12.85, 4, 38, 84), '#0C1330', ' stroke="#9B86FF" stroke-width="2"') + '<g transform="translate(' + nk(ls[0]) + ' ' + nk(ls[1]) + ') skewY(26.565)"><text class="mey-lig-baslik" x="3" y="11">LİDERLİK</text>' + lt + '</g>') });
    const pd = P(10.5, 6, 12);
    oge.push({ gx: 10, gy: 5, w: 2, d: 2, svg: nesne('podyum', 'Podyum', iso.tile(10, 5, '#D9C9A3', { w: 2, d: 2, h: 12, orijin: OG }) + '<ellipse class="mey-spot" cx="' + nk(pd[0] + 32) + '" cy="' + nk(pd[1] - 6) + '" rx="40" ry="20" fill="#FFF3C4" opacity=".35"/>') });
    // Çeşme
    oge.push({ gx: 5, gy: 5, w: 2, d: 2, svg: nesne('cesme', 'Çeşme: sonraki Meydan Sorusu ' + soruDk() + ' dk sonra', iso.prop('cesme', 5, 5, { orijin: OG })) });
    // Tramvay Durağı
    let tt = ''; for (let k = 0; k < 6; k++) tt += poli(sol(7 + k * 0.5, 7.5 + k * 0.5, 10, 30, 40), k % 2 ? '#F4EFE6' : '#E8912D');
    oge.push({ gx: 7, gy: 9, w: 3, d: 1, svg: nesne('tramvay', 'Tramvay Durağı: Meydan', iso.blok(7, 9, { w: 3, d: 1, h: 40, renk: '#3A4A8A', orijin: OG }) + tt + poli(sol(7.3, 9.7, 10, 4, 28), '#141B3A', ' opacity=".8"')) });
    oge.push({ gx: 3, gy: 9, w: 3, d: 1, svg: '<g class="mey-tram">' + iso.prop('tram', 3, 9, { orijin: OG }) + '</g>' });
    // Bloklar merdiveni
    oge.push({ gx: 0, gy: 8, w: 2, d: 3, svg: nesne('bloklar', 'Bloklar: merdivenle aşağı', iso.blok(0, 8, { w: 2, d: 1, h: 24, renk: '#8A93B8', orijin: OG }) + iso.blok(0, 9, { w: 2, d: 1, h: 16, renk: '#9AA3C4', orijin: OG }) + iso.blok(0, 10, { w: 2, d: 1, h: 8, renk: '#AAB2CE', orijin: OG })) });
    // Meydan Otoparkı
    oge.push({ gx: 10, gy: 8, w: 3, d: 2, svg: nesne('otopark', 'Meydan Otoparkı', bina(10, 8, 3, 2, 52, '#3F6FA0', 2, isik) + '<text class="mey-tabela" transform="translate(' + nk(P(10.2, 10, 40)[0]) + ' ' + nk(P(10.2, 10, 40)[1]) + ') skewY(26.565)" x="0" y="0">P · OTOPARK</text>') });
    oge.push(propOge('bariyer', 9, 8, { acik: true }), propOge('araba', 11, 10.2), propOge('agac', 2, 2), propOge('agac', 8, 2), propOge('agac', 9, 7), propOge('lamba', 3, 3, { acik: isik }), propOge('lamba', 9, 3, { acik: isik }), propOge('lamba', 3, 8, { acik: isik }), propOge('bank', 4, 8), propOge('bank', 8, 6));
    return { zemin: z, oge: oge };
  }
  function ustaOge() {
    const p = iso.xy(8.5, 7.5, 0, OG);
    return { gx: 8, gy: 7, w: 1, d: 1, svg: '<g class="mey-nesne mey-defne-nes" data-action="mey-nesne" data-nesne="defne" tabindex="0" role="button" aria-label="Usta Defne: konuş"><title>Usta Defne</title>' +
      '<ellipse cx="' + nk(p.x) + '" cy="' + nk(p.y) + '" rx="20" ry="9" fill="rgba(0,0,0,.38)"/><path d="M' + nk(p.x) + ' ' + nk(p.y) + ' L' + nk(p.x) + ' ' + nk(p.y - 34) + '" stroke="#F29A4A" stroke-width="5" stroke-linecap="round"/>' +
      '<g transform="translate(' + nk(p.x - 34) + ' ' + nk(p.y - 100) + ')">' + ustaSvg('defne', { boyut: 68, aria: 'Usta Defne' }) + '</g>' +
      (M.df.adim >= 0 && M.df.adim < 3 ? '<g transform="translate(' + nk(p.x + 32) + ' ' + nk(p.y - 100) + ')"><g class="mey-unlem"><circle r="11" fill="#FFBE3D" stroke="#3A2400" stroke-width="2"/><text y="5" text-anchor="middle">!</text></g></g>' : '') + '</g>' };
  }
  function kisiOge(k) {
    const p = ayak(k.gx, k.gy), av = avatarSvg(k.av, { boyut: BOY, golge: true, aria: k.ad });
    return '<g class="mey-oge mey-kisi' + (k.figuran ? ' mey-figuran' : '') + '" id="mey-k-' + k.id + '" data-k="' + (k.gx + k.gy + 0.25) + '"><g class="mey-yuruyen" transform="translate(' + nk(p.x) + ' ' + nk(p.y) + ')">' + av + (k.figuran ? '' : '<text class="mey-kisi-ad" x="' + DX + '" y="-4" text-anchor="middle">' + esc(k.ad) + '</text>') + '</g></g>';
  }
  function sahneHtml() {
    const s = sahneSvg(), f = faz();
    const tumu = s.oge.concat([ustaOge()]).map(function (o) { const k = (o.gx + (o.w || 1) - 1) + (o.gy + (o.d || 1) - 1); return { k: k, h: '<g class="mey-oge" data-k="' + k + '">' + o.svg + '</g>' }; });
    M.kisiler.forEach(function (k) { tumu.push({ k: k.gx + k.gy + 0.25, h: kisiOge(k) }); });
    tumu.push({ k: M.oy.gx + M.oy.gy + 0.25, h: '<g class="mey-oge mey-oyuncu-oge" id="mey-oyuncu-oge" data-k="' + (M.oy.gx + M.oy.gy + 0.25) + '"><g class="mey-yuruyen" id="mey-oyuncu" transform="translate(' + nk(ayak(M.oy.gx, M.oy.gy).x) + ' ' + nk(ayak(M.oy.gx, M.oy.gy).y) + ')">' + avatarSvg(state.avatar, { boyut: BOY, golge: true, emote: M.emote, aria: 'Sen: ' + ad() }) + '<text class="mey-kisi-ad mey-ben" x="' + DX + '" y="-4" text-anchor="middle">' + esc(ad()) + '</text></g></g>' });
    let govde = ''; tumu.map(function (x, i) { return { x: x, i: i }; }).sort(function (a, b) { return a.x.k - b.x.k || a.i - b.i; }).forEach(function (e) { govde += e.x.h; });
    const hedefler = (function () { const g = KK_UI.siradakiGorev(); return g && g.ekran === 'sokak' ? [10.4, 9.2, 62] : [5, 2.2, 66]; })(), hp = P(hedefler[0], hedefler[1], hedefler[2]);
    const etk = etiket('AKADEMİ', 5, 2, -16) + etiket('PAZAR', 2, 5.6, 74) + etiket('LİDERLİK', 11.5, 3, 108) + etiket('PODYUM', 11, 7.4, -4) + etiket('ÇEŞME', 6, 7.1, -2) + etiket('TRAMVAY', 8.5, 10.2, 0) + etiket('OTOPARK', 11.5, 10.2, -6) + etiket('BLOKLAR', 2.2, 11.4, -2) + etiket('BELEDİYE', 10, 1, 86) + etiket('ARENA · v1.2', 1, 1, 52);
    return '<svg id="mey-svg" viewBox="0 0 ' + nk(VBW) + ' ' + nk(VBH) + '" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Derleyici Meydanı: izometrik sahne. Bir yere dokun, avatarın yürür.">' +
      '<defs><clipPath id="mey-led-klip"><rect x="0" y="0" width="147" height="38"/></clipPath><pattern id="mey-led-izgara" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><rect x="2.4" width="1" height="3.4" fill="#120606" opacity=".7"/><rect y="2.4" width="3.4" height="1" fill="#120606" opacity=".7"/></pattern>' +
      '<linearGradient id="mey-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1030"/><stop offset="1" stop-color="#1A2658"/></linearGradient></defs>' +
      '<rect x="-1200" width="' + nk(VBW + 2400) + '" height="100%" fill="url(#mey-gok)"/>' + s.zemin + '<g id="mey-isaret"></g><g id="mey-ogeler">' + govde + '</g>' +
      '<rect class="mey-faz" x="-1200" width="' + nk(VBW + 2400) + '" height="100%" fill="' + f.renk + '" opacity="' + f.op + '" pointer-events="none"/>' + etk +
      '<g transform="translate(' + nk(hp[0]) + ' ' + nk(hp[1]) + ')" pointer-events="none"><g class="mey-isaretci"><polygon points="0,16 -11,0 0,-16 11,0" fill="#FFBE3D" stroke="#3A2400" stroke-width="2"/><path d="M0 -26 L0 -40" stroke="#FFBE3D" stroke-width="3"/></g></g></svg>';
  }

  /* ---------- durum ---------- */
  let M = null;
  const NPC = [
    { id: 'zeynep', ad: '@zeynep_cs', gx: 4, gy: 4, av: AVATAR_ORNEKLERI[3].av, gez: false }, { id: 'mert', ad: '@mert_py', gx: 8, gy: 4, av: AVATAR_ORNEKLERI[2].av, gez: true },
    { id: 'ayse', ad: '@ayse_kod', gx: 4, gy: 7, av: AVATAR_ORNEKLERI[1].av, gez: true }, { id: 'can', ad: '@can_dev', gx: 3, gy: 5, av: AVATAR_ORNEKLERI[4].av, gez: false },
    { id: 'f1', ad: '', gx: 6, gy: 3, av: { ten: 1, sacStil: 5, sacRenk: 2, kiyafet: 3, aksesuar: [] }, figuran: true, gez: false }, { id: 'f2', ad: '', gx: 9, gy: 5, av: { ten: 4, sacStil: 6, sacRenk: 0, kiyafet: 5, aksesuar: [] }, figuran: true, gez: true }
  ];
  function mSifirla() {
    const ek = state.ekran.meydan || {};
    const mesajlar = (function () {
      const D = VERI(), l = ['YENİ: @AYSE_KOD OTOPARK ÇARŞI', 'MEYDAN SORUSU: İLK 3 BURADA', 'LİG KAPANIŞI PAZAR 21:00'];
      const top = ((D.liderlik || {}).haftalik || [])[0]; if (top) l.splice(2, 0, '1. ' + upper(String(top.ad).slice(0, 10)) + ' · ' + fmt(top.xp) + ' XP');
      if ((state.dersler['1.1'] || {}).tamam) l.push('@' + upper(ad()) + ': MERHABA, KODKENT!');
      return l.map(upper);
    })();
    M = { oy: { gx: 6, gy: 8 }, kisiler: NPC.map(function (n) { return Object.assign({}, n); }), emote: '', df: { adim: ek.karsilandi ? 3 : 0, replik: 0 }, led: { liste: mesajlar, i: 0, x: 6, duraklat: false, gecmis: mesajlar.slice(0, 3).map(function (m, i) { return { m: m, dk: (i + 1) * 4 }; }) }, yuk: 0, konus: null, resize: null, mesgul: 0 };
  }

  /* ---------- hareket ---------- */
  function yerlestir(kap, gx, gy) {
    const k = gx + gy + 0.25, ust = kap.parentNode; kap.setAttribute('data-k', k); ust.removeChild(kap);
    const kardes = Array.prototype.slice.call(ust.children).filter(function (c) { return Number(c.getAttribute('data-k')) > k; })[0];
    ust.insertBefore(kap, kardes || null);
  }
  function mevcutKonum(el) { const t = /translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(el.getAttribute('transform') || ''); return t ? { x: Number(t[1]), y: Number(t[2]) } : { x: 0, y: 0 }; }
  async function yuru(gx, gy, ms) {
    const el = ID('mey-oyuncu'); if (!el) return false;
    const h = serbest(gx, gy); if (!h) return false;
    const hp = ayak(h[0], h[1]);
    isaretKoy(h[0], h[1]);
    const ok = await walker(el, [mevcutKonum(el), hp], ms || 600);
    if (ok) { M.oy.gx = h[0]; M.oy.gy = h[1]; const kap = ID('mey-oyuncu-oge'); if (kap) yerlestir(kap, h[0], h[1]); }
    return ok;
  }
  function isaretKoy(gx, gy) {
    const g = ID('mey-isaret'); if (!g) return;
    const a = P(gx, gy, 0), b = P(gx + 1, gy, 0), c = P(gx + 1, gy + 1, 0), d = P(gx, gy + 1, 0);
    g.innerHTML = poli([a, b, c, d], 'rgba(255,255,255,.55)', ' class="mey-elmas"'); KK_UI.gecikme(function () { const e = ID('mey-isaret'); if (e) e.innerHTML = ''; }, 1000);
  }
  function svgNokta(ev) {
    const svg = ID('mey-svg'); if (!svg) return null;
    const m = svg.getScreenCTM(); if (!m) return null;
    const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; return pt.matrixTransform(m.inverse());
  }
  function gezinti() {
    if (!aktif() || reducedMotion() || M.mesgul) return;
    const n = M.kisiler.filter(function (k) { return k.gez; })[Math.floor(Math.random() * 2)]; if (!n) return;
    const gx = 3 + Math.floor(Math.random() * 7), gy = 3 + Math.floor(Math.random() * 6), h = serbest(gx, gy); if (!h || (h[0] === M.oy.gx && h[1] === M.oy.gy)) return;
    const el = ID('mey-k-' + n.id), iç = el && el.querySelector('.mey-yuruyen'); if (!iç) return;
    walker(iç, [mevcutKonum(iç), ayak(h[0], h[1])], 1800).then(function (ok) { if (ok && ID('mey-k-' + n.id)) { n.gx = h[0]; n.gy = h[1]; yerlestir(el, h[0], h[1]); } });
  }

  /* ---------- LED pano ---------- */
  function ledTick() {
    const y = ID('mey-led-yazi'); if (!y || M.led.duraklat) return;
    const L = M.led;
    if (reducedMotion()) { L.sayac = (L.sayac || 0) + 1; if (L.sayac % 60 === 1) { L.i = (L.i + 1) % L.liste.length; y.textContent = L.liste[L.i]; y.setAttribute('x', 5); } return; }
    L.x -= 4.6; const gen = L.liste[L.i].length * 10.9;
    if (L.x < -gen) { L.i = (L.i + 1) % L.liste.length; L.x = 147; y.textContent = L.liste[L.i]; L.gecmis.unshift({ m: L.liste[L.i], dk: 0 }); L.gecmis = L.gecmis.slice(0, 20); const sr = ID('mey-led-sr'); if (sr) sr.textContent = L.liste[L.i]; }
    y.setAttribute('x', nk(L.x));
  }
  function ledModal() {
    const L = M.led; let md;
    const liste = function () { return '<ol class="liste mey-pano-liste">' + L.gecmis.concat(L.liste.map(function (m) { return { m: m, dk: 12 }; })).slice(0, 20).map(function (g, i) { return '<li class="satir"><span class="satir-ana"><span class="satir-baslik mono">' + esc(g.m) + '</span><span class="satir-alt">' + (g.dk ? g.dk + ' dk önce' : 'şimdi') + '</span></span></li>'; }).join('') + '</ol>'; };
    md = modal({ sinif: 'scr-meydan', baslik: 'Şehir panosu', ikon: 'bina', html: '<p class="kucuk soluk">Son mesajlar: yarısı bu Meydan\'dan, yarısı tüm şehirden. Her mesaj en çok 8 saniye görünür.</p>' + liste(), butonlar: [{ ad: L.duraklat ? 'Devam et' : 'Duraklat', kapat: false, aksiyon: function (m, b) { L.duraklat = !L.duraklat; b.textContent = L.duraklat ? 'Devam et' : 'Duraklat'; } }, { ad: 'Kapat', birincil: true }] });
  }

  /* ---------- konuşma balonu (oyuncunun üstünde) ---------- */
  function konus(metin) {
    const el = ID('mey-oyuncu'); if (!el) return;
    const eski = el.querySelector('.mey-konus'); if (eski) eski.remove();
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'mey-konus'); g.setAttribute('transform', 'translate(' + DX + ' -22)');
    g.innerHTML = '<rect rx="9" ry="9"/><path class="mey-konus-ok"/><text text-anchor="middle"></text>'; el.appendChild(g);
    const t = g.querySelector('text'); t.textContent = metin; let b; try { b = t.getBBox(); } catch (e) { b = { x: -40, y: -12, width: 80, height: 14 }; }
    const r = g.querySelector('rect'); r.setAttribute('x', nk(b.x - 8)); r.setAttribute('y', nk(b.y - 5)); r.setAttribute('width', nk(b.width + 16)); r.setAttribute('height', nk(b.height + 10));
    g.querySelector('path').setAttribute('d', 'M-5 ' + nk(b.y + b.height + 5) + ' L0 ' + nk(b.y + b.height + 12) + ' L5 ' + nk(b.y + b.height + 5) + ' Z');
    clearTimeout(M.konusZ); M.konusZ = KK_UI.gecikme(function () { const e = ID('mey-oyuncu'); const k = e && e.querySelector('.mey-konus'); if (k) k.remove(); }, 6000);
  }
  async function emoteOyna(id) {
    M.emote = id; const el = ID('mey-oyuncu'); if (el) { const eski = el.querySelector('svg'); if (eski) { const t = document.createElement('div'); t.innerHTML = avatarSvg(state.avatar, { boyut: BOY, golge: true, emote: id, aria: 'Sen: ' + ad() }); eski.replaceWith(t.firstChild); } }
    KK_UI.gecikme(function () { M.emote = ''; const e = ID('mey-oyuncu'); if (e) { const o = e.querySelector('svg'); const t = document.createElement('div'); t.innerHTML = avatarSvg(state.avatar, { boyut: BOY, golge: true, aria: 'Sen: ' + ad() }); if (o) o.replaceWith(t.firstChild); } }, 2200);
  }

  /* ---------- panel parçaları ---------- */
  function defneHtml() {
    const D = (VERI().ustalar || {}).defne || {}, n = ad(), df = M.df;
    const METIN = ['Işığı yanan her dükkân birinin yazdığı kodla çalışıyor. Şu otopark, 3 gün önce senin gibi başlayan birinin.', 'Önce yürümeyi dene, ' + n + ': bir yere tıkla.', "Akademi'ye gel; ilk dersimiz seni bekliyor."];
    let metin, dugme;
    if (df.adim < 3) {
      metin = METIN[df.adim];
      dugme = df.adim === 0 ? '<button type="button" class="btn btn-birincil btn-kucuk" data-action="mey-df-ileri">Sonraki</button>' :
        df.adim === 1 ? '<span class="kucuk soluk">Sahnede boş bir yere tıkla…</span><button type="button" class="btn btn-hayalet btn-kucuk" data-action="mey-df-ileri">Atla</button>' :
        '<button type="button" class="btn btn-birincil btn-kucuk" data-action="mey-df-akademi">' + ikon('akademi', 18) + "Akademi'ye git</button><button type=\"button\" class=\"btn btn-hayalet btn-kucuk\" data-action=\"mey-df-kapat\">Sonra</button>";
    } else {
      const rep = (D.repliklar || [])[df.replik % Math.max(1, (D.repliklar || []).length)];
      metin = df.replik ? String(rep || D.selam || '').replace(/\{ad\}/g, n) : String(D.selam || 'Hoş geldin, {ad}!').replace(/\{ad\}/g, n);
      dugme = '<button type="button" class="btn btn-birincil btn-kucuk" data-action="mey-df-akademi">' + ikon('akademi', 18) + "Akademi'ye git</button>";
    }
    return '<section class="kart mey-defne" aria-label="Usta Defne"><div class="diyalog"><div class="diyalog-portre">' + ustaSvg('defne', { boyut: 76, aria: 'Usta Defne' }) + '<b>Usta Defne</b></div><div class="balon balon-usta balon-kuyruk" role="status" aria-live="polite">' + esc(metin).replace(/`([^`]+)`/g, '<code>$1</code>') + '</div></div><div class="kart-alt">' + dugme + '</div>' +
      (df.adim < 3 ? '<div class="mey-adimlar" aria-hidden="true">' + [0, 1, 2].map(function (i) { return '<i class="' + (i < df.adim ? 'bitti' : i === df.adim ? 'su-an' : '') + '"></i>'; }).join('') + '</div>' : '') + '</section>';
  }
  function sohbetHtml() {
    const S = VERI().sohbet || {}, son = (S.meydan || []).slice(-3), cumleler = S.hazirCumleler && S.hazirCumleler.length ? S.hazirCumleler : ['Merhaba!', 'İyi şanslar!', 'Çarşı Sınavı\'na hazır olan var mı?'];
    const emotes = [['el-salla', 'Selam'], ['alkisla', 'Alkış'], ['gul', 'Gül'], ['dans', 'Dans'], ['kalp', 'Kalp']];
    return '<section class="kart mey-sohbet" aria-label="Meydan sohbeti"><h2 class="kart-baslik">' + ikon('sohbet', 20) + 'Meydan sohbeti</h2><div class="mey-mesajlar" role="log" aria-live="polite">' +
      (son.length ? son.map(function (m) { return '<div class="sohbet-satir">' + balonHtml(m.metin, { ad: m.ad + ' · ' + m.saat }) + '</div>'; }).join('') : '<p class="soluk kucuk">Meydan sessiz. İlk selamı sen ver.</p>') + '</div>' +
      '<div class="sira-s mey-emote" role="group" aria-label="Emote çarkı">' + emotes.map(function (e) { return '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="mey-emote" data-emote="' + e[0] + '" aria-label="Emote: ' + e[1] + '">' + e[1] + '</button>'; }).join('') + '</div>' +
      '<div class="alan"><label class="etiket" for="mey-cumle">' + (state.ayarlar.guvenliMod ? 'Hazır cümle (güvenli mod)' : 'Hazır cümle') + '</label><select id="mey-cumle" class="girdi" data-input="mey-cumle"><option value="">Bir cümle seç…</option>' + cumleler.map(function (c, i) { return '<option value="' + i + '">' + esc(c) + '</option>'; }).join('') + '</select></div></section>';
  }
  function dockHtml() {
    const f = faz();
    return '<nav class="mey-dock" id="mey-dock" aria-label="Hızlı erişim"><div class="mey-dock-dugmeler">' +
      [['akademi', 'akademi', 'Akademi'], ['harita', 'harita', 'Harita'], ['sokak', 'bina', 'İşletmelerim'], ['tekrar', 'alev', 'Günlük Tekrar'], ['oda', 'ev', 'Oda']].map(function (d) { return '<button type="button" class="btn btn-kucuk mey-dock-btn" data-go="' + d[0] + '">' + ikon(d[1], 18) + '<span>' + d[2] + '</span></button>'; }).join('') + '</div>' +
      '<div class="mey-bilgi"><span class="chip chip-kobalt">' + ikon('saat', 14) + f.ad + '</span><span class="kucuk soluk" id="mey-soru-dk">Meydan Sorusu ' + soruDk() + ' dk sonra</span><button type="button" class="btn btn-hayalet btn-kucuk" data-action="mey-soru-ac">Demo: soruyu şimdi aç</button>' +
      '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="mey-pano-gecmis">Pano geçmişi</button></div></nav>';
  }
  function ciz(root) {
    root.innerHTML = '<div class="mey-kok"><div class="mey-ana"><div class="sahne mey-sahne" id="mey-sahne">' + sahneHtml() + '<div class="mey-yukle" id="mey-yukle" role="status"><span class="donus" aria-hidden="true"></span><span>Şehir hazırlanıyor… %<b id="mey-yuzde">0</b></span><small>Bir yere tıkla, avatarın yürür.</small></div><div class="sr" id="mey-led-sr" aria-live="off"></div></div>' +
      (navigator.onLine === false ? '<div class="mey-cevrimdisi">' + ikon('uyari', 18) + "Çevrimdışısın. Meydan'ı yalnız başına gezebilirsin; diğer oyuncular bağlanınca görünür.</div>" : '') + dockHtml() + '</div><aside class="mey-yan" id="mey-yan">' + defneHtml() + sohbetHtml() + '</aside></div>';
    sigdir(root);
    if (!M.resize) { M.resize = function () { const r = ID('screen'); if (r && aktif()) sigdir(r); }; window.addEventListener('resize', M.resize); }
    KK_UI.aralik(ledTick, 80); KK_UI.aralik(gezinti, 5200);
    KK_UI.aralik(function () { const e = ID('mey-soru-dk'); if (e) e.textContent = 'Meydan Sorusu ' + soruDk() + ' dk sonra'; }, 30000);
    const y = ID('mey-yukle'); const yz = ID('mey-yuzde');
    if (y && M.yuk < 100) {
      const adim = function () { M.yuk = Math.min(100, M.yuk + 25); const z = ID('mey-yuzde'); if (z) z.textContent = M.yuk; if (M.yuk >= 100) { const e = ID('mey-yukle'); if (e) e.hidden = true; } };
      if (yz) yz.textContent = '0'; for (let i = 1; i <= 4; i++) KK_UI.gecikme(adim, i * (reducedMotion() ? 10 : 130));
    } else if (y) y.hidden = true;
  }
  function sigdir(root) {
    const s = ID('mey-sahne'), svg = s && s.querySelector('svg'); if (!svg) return;
    const w = s.clientWidth || 600, ideal = w * (VBH / VBW), dar = (root.clientWidth || 1000) < 980;
    const dock = (ID('mey-dock') || {}).offsetHeight || 0, maks = (root.clientHeight || 600) - dock - 64;
    svg.style.height = Math.round(dar ? ideal : Math.max(360, Math.min(ideal, maks))) + 'px';
  }
  function ac(id) { return KK_UI.gecikme && id; }

  /* ---------- nesne eylemleri ---------- */
  const YAKLAS = { akademi: [5, 2], led: [5, 2], pazar: [2, 5], liderlik: [11, 4], podyum: [9, 6], belediye: [10, 2], tramvay: [6, 8], otopark: [9, 8], cesme: [7, 6], bloklar: [2, 8], arena: [1, 2], defne: [8, 8] };
  async function vinyet(hedef, ad2) {
    const md = modal({ sinif: 'scr-meydan', baslik: '', html: '<div class="mey-vinyet" role="status">' + ikon('tramvay', 40) + '<b>Kapı kapanıyor…</b><span>' + esc(ad2) + ' durağına doğru, vagon camında şehir kayıyor.</span></div>', butonlar: [], kapatilabilir: false });
    await bekle(1400); md.kapat(); go(hedef);
  }
  function kapiModal(baslik, ikonAd, html, butonlar) { return modal({ sinif: 'scr-meydan', baslik: baslik, ikon: ikonAd, html: html, butonlar: butonlar }); }
  const EYLEM = {
    akademi: function () { go('akademi'); },
    led: function () { ledModal(); },
    pazar: function () { go('pazar'); },
    liderlik: function () { go('liderlik'); },
    otopark: function () { toast("Öne çıkan: @ayse_kod'un Otoparkı. Turist olarak içeri giriyorsun.", 'bilgi'); go('sokak'); },
    bloklar: function () { toast("Bloklar: merdivenden Oda'na iniyorsun.", 'bilgi'); go('oda'); },
    arena: function () { kapiModal('Arena · v1.2', 'bina', '<p>Arena şimdilik iskeleli: 60 seyircilik canlı düello alanı v1.2\'de açılacak. Şimdilik Liderlik Panosu\'ndan haftalık ligi izleyebilirsin.</p>', [{ ad: 'Tamam', birincil: true }]); },
    podyum: function () {
      toast('Podyumdasın: 30 saniye spot ışığı altında dönüyorsun, kıyafetini herkes görüyor.', 'basari'); emoteOyna('dans'); konus('Bu kıyafet nasıl?');
      const s = document.querySelector('.mey-spot'); if (s) { s.classList.add('acik'); KK_UI.gecikme(function () { s.classList.remove('acik'); }, 30000); }
    },
    cesme: function () { const dk = soruDk(); if (dk >= 59) EYLEM.soru(); else toast('Çeşme: sonraki Meydan Sorusu ' + dk + ' dk sonra. Saat başı su 10 saniye yükselir.', 'bilgi'); },
    belediye: function () {
      const r = state.ruhsat.otopark, sv = seviyeBilgi().seviye, eksik = [];
      if (state.bayt < 300) eksik.push('Bayt ' + fmt(state.bayt) + '/300'); if (sv < 3) eksik.push('Sev. ' + sv + '/3'); if (r < 3) eksik.push('Ruhsat ' + r + '/3');
      kapiModal('Belediye Köşkü', 'bina', '<div class="diyalog"><div class="diyalog-portre"><span class="mey-nuran">' + ikon('bina', 34) + '</span><b>Memur Nuran</b></div><div class="balon balon-usta balon-kuyruk">' + (r >= 3 ? 'Ruhsatın tamam, ' + esc(ad()) + '! Çarşı\'daki Satılık parsel seni bekliyor.' : 'Ruhsatın ' + r + '/3; ' + (3 - r) + ' görev kaldı.') + '</div></div>' +
        '<h3 class="mey-alt-baslik">Satılık arsalar</h3><div class="satir"><span class="satir-ana"><span class="satir-baslik">Çarşı · Otopark</span><span class="satir-alt">300 B · Sev. 3 · Ruhsat 3/3</span></span><span class="satir-sag">' + (eksik.length ? chipHtml('Eksik: ' + eksik.join(' · '), 'amber') : chipHtml('Hazırsın', 'nane', 'tik')) + '</span></div>',
        [{ ad: 'Kapat' }, { ad: "Otopark parseline bak", birincil: true, aksiyon: function () { go('sokak'); } }]);
    },
    tramvay: function () {
      const sv = seviyeBilgi().seviye;
      kapiModal('Tramvay · Meydan durağı', 'tramvay', '<div class="yigin"><div class="satir"><span class="satir-ana"><span class="satir-baslik">T1 Çevre Hattı</span><span class="satir-alt">Meydan → Çarşı → Liman → Bloklar → Veri Vadisi → Atölyeler → Kampüs → Finans → Meydan</span></span></div>' +
        '<div class="satir satir-kilitli"><span class="satir-ana"><span class="satir-baslik">T2 Tepe Hattı</span><span class="satir-alt">Akademi arka kapısından Bulut Tepesi\'ne füniküler. Sev. 40 gerekir; şu an Sev. ' + sv + '.</span></span></div>' +
        '<p class="kucuk soluk">Hedef seçince 1,5 saniyelik tramvay vinyeti oynar. Kilitli semtlere yalnızca turist olarak gidilir.</p></div>',
        [{ ad: 'Haritayı aç', aksiyon: function () { go('harita'); } }, { ad: "Çarşı'ya git", birincil: true, aksiyon: function (m) { m.kapat(); vinyet('sokak', 'Çarşı'); return false; } }]);
    },
    defne: function () { M.df.replik = M.df.adim >= 3 ? M.df.replik + 1 : M.df.replik; yan(); },
    soru: function () { soruModal(); }
  };
  function yan() { const y = ID('mey-yan'); if (y) { y.innerHTML = defneHtml() + sohbetHtml(); } }
  function soruModal() {
    const D = VERI(), havuz = (D.tekrar || []).filter(function (q) { return q.tip === 'coktan' && q.secenekler && q.secenekler.length; });
    const q = havuz.length ? havuz[Math.floor(Math.random() * havuz.length)] : { soru: 'Hangi anahtar kelime tam sayı tutan bir kutu açar?', secenekler: ['string', 'int', 'bool', 'char'], dogru: 1, aciklama: '`int` tam sayı kutusudur.' };
    const di = typeof q.dogru === 'number' ? q.dogru : q.secenekler.indexOf(q.dogru);
    M.soru = { q: q, di: di, bitti: false };
    const html = function () { return '<p class="mey-soru-metin">' + esc(q.soru) + '</p><div class="mey-soru-cizgi" aria-hidden="true"><i></i></div><div class="yigin-s" role="group" aria-label="Seçenekler">' + q.secenekler.map(function (s, i) { return '<button type="button" class="btn btn-hayalet btn-blok mey-soru-sec" data-action="mey-soru-cevap" data-i="' + i + '">' + esc(s) + '</button>'; }).join('') + '</div><p class="mini soluk">Meydan Sorusu XP ya da Bayt vermez; ödülü görünürlüktür: en hızlı 3 kişi panoya çıkar. Katılmak zorunlu değil, kartı kapatabilirsin.</p>'; };
    M.soruModal = modal({ sinif: 'scr-meydan', baslik: 'MEYDAN SORUSU', ikon: 'saat', html: html(), butonlar: [{ ad: 'Kapat' }] });
  }
  KK_UI.screen('meydan', {
    ad: 'Derleyici Meydanı',
    render(root, ctx) {
      if (ctx.ilk || !M) mSifirla();
      try { ciz(root); } catch (e) { console.error(e); root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Meydan şu an açılamadı.', { tekrar: 'mey-tekrar' }) + '</div>'; }
    },
    leave() { if (M && M.resize) { window.removeEventListener('resize', M.resize); M.resize = null; } },
    actions: {
      'mey-tekrar': function () { mSifirla(); refresh(); },
      async 'mey-zemin'(el, ev) {
        const p = svgNokta(ev); if (!p) return;
        const h = iso.hucre(p.x, p.y, OG), hedef = serbest(h.gx, h.gy);
        if (!hedef) { toast('Oraya yürüyemezsin.', 'bilgi'); return; }
        M.mesgul = 1; const ok = await yuru(hedef[0], hedef[1], 600); M.mesgul = 0;
        if (ok && M.df.adim === 1) { M.df.adim = 2; yan(); }
      },
      async 'mey-nesne'(el) {
        const id = el.getAttribute('data-nesne'), yk = YAKLAS[id] || [6, 8];
        if (!EYLEM[id]) return;
        M.mesgul = 1; const ok = await yuru(yk[0], yk[1], 600); M.mesgul = 0;
        if (ok && aktif()) EYLEM[id]();
      },
      'mey-df-ileri': function () { M.df.adim = Math.min(3, M.df.adim + 1); if (M.df.adim >= 3) { state.ekran.meydan = Object.assign({}, state.ekran.meydan, { karsilandi: true }); save(); } yan(); },
      'mey-df-kapat': function () { M.df.adim = 3; state.ekran.meydan = Object.assign({}, state.ekran.meydan, { karsilandi: true }); save(); yan(); },
      async 'mey-df-akademi'() { state.ekran.meydan = Object.assign({}, state.ekran.meydan, { karsilandi: true }); save(); M.mesgul = 1; const ok = await yuru(5, 2, 600); M.mesgul = 0; if (ok && aktif()) go('akademi'); },
      'mey-emote': function (el) { const e = el.getAttribute('data-emote'); emoteOyna(e); konus((AVATAR_SECENEK.emote.filter(function (x) { return x.id === e; })[0] || {}).ad || ''); },
      'mey-cumle': function (el) {
        const S = VERI().sohbet || {}, c = S.hazirCumleler && S.hazirCumleler.length ? S.hazirCumleler : ['Merhaba!', 'İyi şanslar!', "Çarşı Sınavı'na hazır olan var mı?"], i = Number(el.value);
        if (el.value !== '' && c[i]) { konus(c[i]); toast('Balon 6 saniye görünür.', 'bilgi'); el.value = ''; }
      },
      'mey-pano-gecmis': function () { ledModal(); },
      'mey-soru-ac': function () { soruModal(); },
      'mey-soru-cevap': function (el) {
        const S = M.soru; if (!S || S.bitti) return; S.bitti = true; const i = Number(el.getAttribute('data-i')), dogru = i === S.di;
        if (dogru) { M.led.liste.splice(1, 0, upper('Meydan Sorusu: @' + ad())); M.led.gecmis.unshift({ m: upper('Meydan Sorusu: @' + ad() + ' doğru'), dk: 0 }); }
        const butonlar = Array.prototype.map.call(document.querySelectorAll('.mey-soru-sec'), function (b, k) { b.disabled = true; b.classList.toggle('btn-basari', k === S.di); b.classList.toggle('btn-tehlike', k === i && !dogru); return b; });
        const govde = document.querySelector('.mey-soru-metin'); if (govde) govde.insertAdjacentHTML('afterend', '<div class="mey-soru-sonuc ' + (dogru ? 'dogru' : 'yanlis') + '" role="status">' + (dogru ? 'Doğru! Panoya adın yazıldı. ' : 'Yanlış; ikinci hak yok. Doğru cevap: ' + esc(S.q.secenekler[S.di]) + '. ') + esc(String(S.q.aciklama || '').replace(/`/g, '')) + '</div>');
        void butonlar;
      }
    },
    async selftest(root, ctx) {
      await ctx.bekleSecici('#mey-sahne svg');
      if (!/Işığı yanan/.test(ctx.metin('.mey-defne .balon'))) throw new Error('Defne karşılama balonu yok');
      const svg = ID('mey-svg'), tik = function (el, gx, gy) { const m = svg.getScreenCTM(), p = iso.xy(gx + 0.5, gy + 0.5, 0, OG), r = svg.getBoundingClientRect(); const pt = svg.createSVGPoint(); pt.x = p.x; pt.y = p.y; const q = m ? pt.matrixTransform(m) : { x: r.left + 10, y: r.top + 10 }; el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: q.x, clientY: q.y })); };
      await ctx.tikla('[data-action="mey-df-ileri"]');
      if (!/yürümeyi dene/.test(ctx.metin('.mey-defne .balon'))) throw new Error('2. balon (yürümeyi dene) gelmedi');
      const once = ID('mey-oyuncu').getAttribute('transform'); tik(ID('mey-zemin'), 4, 5); await ctx.bekle(80);
      if (ID('mey-oyuncu').getAttribute('transform') === once) throw new Error('avatar tıklanan noktaya yürümedi');
      if (!/Akademi'ye gel/.test(ctx.metin('.mey-defne .balon'))) throw new Error('yürüyünce 3. balon gelmedi');
      await ctx.tikla('[data-action="mey-emote"][data-emote="alkisla"]'); if (!document.querySelector('#mey-oyuncu .mey-konus')) throw new Error('emote balonu yok');
      tik(document.querySelector('[data-nesne="led"]'), 5, 2); await ctx.bekleSecici('.modal'); if (!/Şehir panosu/.test(ctx.metin('.modal'))) throw new Error('LED pano geçmişi açılmadı');
      await ctx.tikla('.modal-kapat'); await ctx.bekle(60);
      await ctx.tikla('[data-action="mey-soru-ac"]'); await ctx.bekleSecici('.mey-soru-sec');
      await ctx.tikla('.mey-soru-sec'); await ctx.bekleSecici('.mey-soru-sonuc'); await ctx.tikla('.modal-kapat'); await ctx.bekle(60);
      tik(document.querySelector('[data-nesne="akademi"]'), 5, 2); await ctx.bekle(120);
      if (ctx.gidilen() !== 'akademi') throw new Error('Akademi kapısı akademi ekranına götürmedi');
      await ctx.tikla('[data-go="harita"]'); if (ctx.gidilen() !== 'harita') throw new Error('Harita kısayolu çalışmadı');
    }
  });
})();
