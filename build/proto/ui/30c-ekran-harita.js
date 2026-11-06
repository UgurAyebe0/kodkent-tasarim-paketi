/* ==== ui/30c-ekran-harita.js — Şehir Haritası (P5) ====
   Kaynak: B8 §6.5, B1 §2 (şehir makro planı, kilitli semtler: inşaat halinde + turist modu), KANON §2.2, brief/02 §E.2 (5).
   Çizilmiş izometrik harita: 7 semt + Derleyici Meydanı + Bloklar; kilitli semtler vinç/bariyerle "inşaat halinde"; Satılık "S" tabelası;
   hedef işaretçisi; semt kartı (Usta, konu kümesi, açılış şartı, neden kilitli, Git / Gezmeye gir); "Liste görünümü" erişilebilir eşdeğer. */
(function () {
  const VERI = function () { return (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}; };
  const ID = function (id) { return document.getElementById(id); };
  const nk = function (v) { return Math.round(v * 10) / 10; };
  const aktif = function () { return KK_UI.current() === 'harita'; };
  const W = 960, H = 730, S = 0.82, Z = 12;
  const POZ = { 'kampus': [170, 172], 'bulut-tepesi': [480, 152], 'finans-bolgesi': [790, 172], 'atolyeler': [170, 382], 'meydan': [480, 362], 'carsi': [790, 382], 'veri-vadisi': [170, 592], 'bloklar': [480, 577], 'liman': [790, 592] };
  const HAT = ['meydan', 'carsi', 'liman', 'bloklar', 'veri-vadisi', 'atolyeler', 'kampus', 'finans-bolgesi', 'meydan'];
  const MEYDAN = { id: 'meydan', ad: 'Derleyici Meydanı', tema: "Şehrin oturma odası: çeşme, LED pano, Akademi'nin ön cephesi", renk: '#D9C9A3', tier: 0, durum: 'acik', acilis: { seviye: 1, sinav: null }, konular: ['Akademi', 'Pazar', 'Liderlik Panosu', 'Belediye Köşkü', 'Tramvay'], usta: null };
  const BLOKLAR = { id: 'bloklar', ad: 'Bloklar', tema: 'Konut sokakları: Oda, posta kutuları, bir kedi', renk: '#8A93B8', tier: 0, durum: 'acik', acilis: { seviye: 2, sinav: null }, konular: ['Oda', 'Ziyaretçi defteri', 'Alkış'], usta: null };
  /* ada tarifleri: bloklar [gx,gy,w,d,h,renk(0..2)], proplar [tür,gx,gy] — 4×4 hücrelik ada */
  const TARIF = {
    'carsi': { b: [[0, 0, 2, 1, 36, 0], [2, 0, 2, 1, 30, 1], [0, 3, 1, 1, 28, 2], [2, 3, 1, 1, 22, 1]], p: [['tente', 1, 2], ['agac', 0, 2], ['kasa', 3, 2]] },
    'meydan': { b: [[3, 0, 1, 1, 10, 1]], p: [['cesme', 1, 1], ['bank', 3, 2], ['lamba', 0, 0], ['lamba', 3, 3], ['agac', 0, 3]] },
    'liman': { b: [[0, 0, 2, 1, 18, 0], [2, 0, 2, 1, 18, 1], [0, 1, 2, 1, 18, 2], [2, 1, 1, 1, 18, 0], [0, 3, 1, 1, 30, 1]], p: [['vinc', 3, 3], ['kutu', 2, 2]] },
    'atolyeler': { b: [[0, 0, 2, 2, 38, 0], [2, 1, 1, 1, 66, 1], [3, 3, 1, 1, 52, 2], [0, 3, 1, 1, 24, 1]], p: [['lamba', 3, 0]] },
    'kampus': { b: [[1, 1, 2, 2, 24, 0]], p: [['agac', 0, 0], ['agac', 3, 0], ['agac', 0, 3], ['agac', 3, 3], ['bank', 3, 2]] },
    'finans-bolgesi': { b: [[0, 0, 1, 1, 104, 0], [2, 0, 1, 1, 80, 1], [1, 2, 1, 1, 122, 2], [3, 3, 1, 1, 64, 0]], p: [['lamba', 3, 1]] },
    'veri-vadisi': { b: [[0, 0, 3, 1, 18, 0], [0, 1, 3, 1, 18, 1], [0, 2, 3, 1, 18, 0], [3, 0, 1, 3, 32, 2]], p: [['lamba', 3, 3]] },
    'bulut-tepesi': { b: [[0, 0, 4, 4, 10, 2], [1, 1, 2, 2, 24, 0], [1, 1, 1, 1, 40, 1]], p: [['bayrak', 2, 2]] },
    'bloklar': { b: [[0, 0, 1, 2, 52, 0], [2, 0, 1, 2, 64, 1], [1, 3, 2, 1, 44, 2]], p: [['agac', 3, 3], ['bank', 0, 3]] }
  };
  const faz = function () { const sa = (new Date().getUTCHours() + 3) % 24; return sa >= 6 && sa < 10 ? 'Sabah' : sa >= 10 && sa < 17 ? 'Gün' : sa >= 17 && sa < 20 ? 'Akşam' : 'Gece'; };
  let HS = null;

  /* ---------- veri ---------- */
  function semtler() {
    const D = VERI().semtler;
    if (!D || !D.length) return null;
    const sv = seviyeBilgi().seviye, b = Object.assign({}, BLOKLAR, { durum: sv >= 2 ? 'acik' : 'kilitli', insaatNotu: 'Bloklar: Sev. 2 gerekir' });
    return [MEYDAN].concat(D.map(function (s) { return Object.assign({}, s); }), [b]);
  }
  function eksik(s) {
    const sv = seviyeBilgi().seviye, a = s.acilis || {}, ls = VERI().semtler || [], on = ls.filter(function (x) { return x.id === a.sinav; })[0], p = [];
    p.push('Sev. ' + a.seviye + ' — sen Sev. ' + sv + (sv >= a.seviye ? ' (tamam)' : ''));
    if (on) p.push(on.ad + ' Sınavı — henüz değil');
    return p.join(' · ');
  }
  function otoparkEksik() {
    const sv = seviyeBilgi().seviye, e = [];
    if (state.bayt < 300) e.push('Bayt ' + fmt(state.bayt) + '/300 B'); if (sv < 3) e.push('Sev. ' + sv + '/3'); if (state.ruhsat.otopark < 3) e.push('Ruhsat ' + state.ruhsat.otopark + '/3');
    return e;
  }
  function hedefSemt() { const g = KK_UI.siradakiGorev(); return g && g.ekran === 'sokak' ? 'carsi' : 'meydan'; }

  /* ---------- çizim ---------- */
  function pal(s, acik) {
    const R = iso.renk, baz = acik ? s.renk : R.karistir(s.renk, '#5C668F', 0.62);
    return { r: [baz, R.acik(baz, 0.22), R.koyu(baz, 0.22)], zemin: acik ? R.koyu(s.renk, 0.6) : '#2F3759', ust: acik ? R.koyu(s.renk, 0.42) : '#3A4368' };
  }
  function adaIc(s, acik) {
    const p = pal(s, acik), t = TARIF[s.id] || { b: [], p: [] }, oge = [];
    let g = iso.tile(0, 0, p.zemin, { w: 4, d: 4, h: Z }) + iso.tile(0, 0, p.ust, { w: 4, d: 4, z: Z }) + iso.tile(1, 1, iso.renk.acik(p.ust, 0.08), { w: 2, d: 2, z: Z });
    t.b.forEach(function (b) { oge.push({ gx: b[0], gy: b[1], w: b[2], d: b[3], svg: iso.blok(b[0], b[1], { w: b[2], d: b[3], h: b[4], renk: p.r[b[5]], z: Z, kenar: 'rgba(8,13,28,.3)' }) }); });
    t.p.concat(acik ? [] : [['vinc', 3, 0]]).forEach(function (x) { const m = iso.PROP_META[x[0]] || { w: 1, d: 1 }; oge.push({ gx: x[1], gy: x[2], w: m.w, d: m.d, svg: iso.prop(x[0], x[1], x[2], { gz: Z / 48 }) }); });
    g += iso.sirala(oge);
    if (!acik) g += iso.blok(0, 3.78, { w: 4, d: 0.22, h: 9, renk: '#E8B31D', z: Z, kenar: '#1A1204' }) + iso.blok(0, 0, { w: 0.22, d: 4, h: 9, renk: '#E8B31D', z: Z, kenar: '#1A1204' });
    if (s.id === 'bulut-tepesi') g += '<ellipse cx="-92" cy="20" rx="46" ry="14" fill="#fff" opacity=".28"/><ellipse cx="96" cy="8" rx="52" ry="15" fill="#fff" opacity=".26"/><ellipse cx="20" cy="140" rx="60" ry="14" fill="#fff" opacity=".2"/>';
    return g;
  }
  /** Dalgalı çizgi: sahne kenarlarının DIŞINA da uzanır (svg overflow:visible, .sahne kırpar); deniz sahneyi baştan başa doldurur. */
  function dalga(y, a) { let d = 'M-2880 ' + y + ' Q -2760 ' + (y - a) + ' -2640 ' + y; for (let x = -2400; x <= 3840; x += 240) d += ' T ' + x + ' ' + y; return d; }
  function otoparkRozet() {
    const o = isletmeKaydi('otopark'), sahip = o.durum !== 'yok' && o.durum !== 'satilik';
    const renk = sahip ? ({ acik: '#45D98D', deneme: '#FFBE3D', kapali: '#FF7A66', kararmis: '#7C87A8' }[o.durum] || '#45D98D') : '#7D9BFF', yazi = sahip ? 'P' : 'S';
    return '<g class="har-satilik' + (sahip ? ' sahip' : '') + '" data-action="har-satilik" tabindex="0" role="button" aria-label="' + (sahip ? 'Otopark: ' + o.durum : 'Satılık arsa: Otopark, 300 B') + '"><title>' + (sahip ? 'Otopark' : 'Satılık: Otopark · 300 B') + '</title>' +
      '<line x1="0" y1="96" x2="0" y2="62" stroke="#C5CEE4" stroke-width="3"/><circle cx="0" cy="48" r="17" fill="' + renk + '" stroke="#0B1330" stroke-width="3"/><text x="0" y="56" text-anchor="middle" class="har-s-yazi">' + yazi + '</text></g>';
  }
  function adaHtml(s, secili) {
    const c = POZ[s.id], acik = s.durum === 'acik', kilit = ikon('kilit', 20);
    const durumYazi = s.id === 'meydan' ? 'Açık' : acik ? 'Açık' : 'İnşaat halinde';
    return '<g class="har-ada ' + (acik ? 'acik' : 'kilitli') + (secili ? ' secili' : '') + '" data-action="har-sec" data-semt="' + s.id + '" tabindex="0" role="button" aria-pressed="' + !!secili + '" aria-label="' + esc(s.ad) + ': ' + durumYazi + '"><title>' + esc(s.ad) + ' — ' + durumYazi + '</title>' +
      '<g class="har-ada-ic" transform="translate(' + c[0] + ' ' + c[1] + ') scale(' + S + ') translate(0 -64)">' + adaIc(s, acik) + (secili ? '<polygon class="har-halka" points="0,-4 134,64 0,132 -134,64" fill="none" stroke="#fff" stroke-width="3.5" stroke-dasharray="9 7"/>' : '') + (s.id === 'carsi' ? otoparkRozet() : '') + '</g>' +
      '<text class="har-ad" x="' + c[0] + '" y="' + (c[1] + 88) + '" text-anchor="middle">' + esc(s.ad) + '</text>' +
      (acik ? '' : '<g class="har-kilit" transform="translate(' + (c[0] - 11) + ' ' + (c[1] + 94) + ')">' + kilit + '</g><text class="har-durum" x="' + (c[0] + 18) + '" y="' + (c[1] + 108) + '">inşaat halinde</text>') + '</g>';
  }
  function haritaSvg(liste) {
    let hat = ''; HAT.forEach(function (id, i) { const c = POZ[id]; hat += (i ? 'L' : 'M') + c[0] + ' ' + (c[1] + 8) + ' '; });
    let adalar = ''; liste.slice().sort(function (a, b) { return POZ[a.id][1] - POZ[b.id][1] || POZ[a.id][0] - POZ[b.id][0]; }).forEach(function (s) { adalar += adaHtml(s, HS.sec === s.id); });
    const h = POZ[hedefSemt()];
    return '<svg id="har-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Şehir haritası. Bir semte dokun, bilgi kartı açılır. Liste görünümü için Liste sekmesini kullan.">' +
      '<defs><linearGradient id="har-gok" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="' + H + '"><stop offset="0" stop-color="#0B1230"/><stop offset="1" stop-color="#1B2A5E"/></linearGradient><linearGradient id="har-deniz" gradientUnits="userSpaceOnUse" x1="0" y1="676" x2="0" y2="' + H + '"><stop offset="0" stop-color="#1F5AA6"/><stop offset="1" stop-color="#12306A"/></linearGradient></defs>' +
      '<rect x="-3000" y="-3000" width="' + (W + 6000) + '" height="' + (H + 6000) + '" fill="url(#har-gok)"/>' +
      '<path d="' + dalga(690, 22) + ' L3840 ' + (H + 3000) + ' L-2880 ' + (H + 3000) + ' Z" fill="url(#har-deniz)"/><path d="' + dalga(704, 20) + '" fill="none" stroke="#7DB4F0" stroke-width="2" opacity=".35"/>' +
      '<path d="M480 150 L480 360" stroke="#F4EFE6" stroke-width="3" stroke-dasharray="3 9" opacity=".4" fill="none"/>' +
      '<path class="har-hat" d="' + hat + '" fill="none" stroke="#F4EFE6" stroke-width="4" stroke-dasharray="10 10" stroke-linecap="round" opacity=".5"/>' + adalar +
      '<g transform="translate(' + h[0] + ' ' + (h[1] - 30) + ')" pointer-events="none"><g class="har-hedef"><polygon points="0,16 -13,0 0,-16 13,0" fill="#FFBE3D" stroke="#3A2400" stroke-width="3"/><path d="M0 -20 L0 -34" stroke="#FFBE3D" stroke-width="4" stroke-linecap="round"/><text x="22" y="6" class="har-hedef-yazi">HEDEF</text></g></g></svg>';
  }
  function kartHtml(s) {
    const D = VERI(), u = s.usta ? (D.ustalar || {})[s.usta] : null, acik = s.durum === 'acik';
    const durum = acik ? '<span class="durum durum-acik">Açık</span>' : '<span class="durum durum-kapali">İnşaat halinde</span>';
    let govde;
    if (HS.satilik) {
      const e = otoparkEksik(), o = isletmeKaydi('otopark'), sahip = o.durum !== 'yok' && o.durum !== 'satilik';
      govde = '<h2>Çarşı · Otopark</h2><div class="sira-s"><span class="durum durum-satilik">' + (sahip ? 'Senin işletmen' : 'Satılık') + '</span>' + (sahip ? isletmeDurumHtml(o.durum) : '') + '</div>' +
        '<p><b>Otopark — 300 B · Sev. 3 · Ruhsat 3/3</b></p><p class="kucuk soluk">Çarşı\'nın ilk işletmesi: Hasan Abi\'nin müşteri isteğini kodla, ücret hesaplayan metodu yaz, Müfettiş\'i geç.</p>' +
        (sahip ? '' : '<div class="har-eksik ' + (e.length ? 'var' : 'yok') + '">' + (e.length ? ikon('uyari', 18) + '<span>Şu an eksik: <b>' + e.join(' · ') + '</b>. ' + (state.ruhsat.otopark < 3 ? 'Ruhsat için kalan Atölye görevlerini tamamla.' : 'Bayt biriktir ya da seviye atla.') + '</span>' : ikon('tik', 18) + '<span>Şartların tamam: 320 B, Sev. 3, Ruhsat 3/3. Tapuyu alabilirsin.</span>') + '</div>') +
        '<div class="kart-alt"><button type="button" class="btn btn-birincil" data-action="har-satilik-git">' + ikon('bina', 18) + 'Parseli Gör</button></div>';
    } else {
      const sart = s.id === 'meydan' ? 'Baştan açık: doğma noktası.' : acik ? (s.acilis.seviye <= 1 ? 'Sev. 1 · ilk semt, baştan açık.' : 'Sev. ' + s.acilis.seviye + ' · açık (sen Sev. ' + seviyeBilgi().seviye + ').') : null;
      govde = '<div class="har-baslik">' + (u ? '<span class="portre">' + ustaSvg(s.usta, { boyut: 76, kadraj: 'bust', aria: u.ad }) + '</span>' : '<span class="har-nuran">' + ikon(s.id === 'bloklar' ? 'ev' : 'bina', 30) + '</span>') + '<div><h2>' + esc(s.ad) + '</h2><div class="sira-s">' + durum + (s.tier ? chipHtml('Tier ' + s.tier, 'mor') : '') + (u ? chipHtml(u.ad, 'amber') : '') + '</div></div></div>' +
        '<p class="soluk">' + esc(s.tema) + '</p><div class="har-konular" aria-label="Konu kümesi">' + (s.konular || []).map(function (k) { return '<span class="chip chip-gri">' + esc(k) + '</span>'; }).join('') + '</div>' +
        (acik ? '<p class="har-sart">' + ikon('tik', 16) + '<span>' + esc(sart) + '</span></p>' :
          '<div class="har-eksik var">' + ikon('kilit', 18) + '<span><b>' + esc(s.insaatNotu || (s.ad + ' henüz açılmadı')) + " açılıyor.</b><br><small>" + esc(eksik(s)) + '</small></span></div>');
      const git = s.id === 'meydan' ? '<button type="button" class="btn btn-birincil" data-action="har-git" data-semt="meydan">' + ikon('ev', 18) + "Meydan'a Git</button>" : s.id === 'carsi' ? '<button type="button" class="btn btn-birincil" data-action="har-git" data-semt="carsi">' + ikon('tramvay', 18) + "Çarşı'ya Git</button>" : s.id === 'bloklar' && acik ? '<button type="button" class="btn btn-birincil" data-action="har-git" data-semt="bloklar">' + ikon('ev', 18) + "Oda'na Git</button>" : '';
      govde += '<div class="kart-alt">' + git + (acik ? '' : '<button type="button" class="btn btn-hayalet" data-action="har-gez" data-semt="' + s.id + '">' + ikon('goz', 18) + 'Gezmeye gir</button>') + '</div>';
    }
    return '<section class="kart har-kart" style="--semt:' + s.renk + '" aria-live="polite" aria-label="Semt bilgi kartı">' + govde + '</section>';
  }
  function listeHtml(liste) {
    return '<ol class="liste har-liste" aria-label="Semtler (liste görünümü)">' + liste.map(function (s, i) {
      const acik = s.durum === 'acik';
      return '<li><button type="button" class="satir satir-tikla' + (acik ? '' : ' satir-kilitli') + (HS.sec === s.id ? ' satir-ben' : '') + '" data-action="har-sec" data-semt="' + s.id + '"><span class="sira-no">' + (i + 1) + '</span><span class="satir-ana"><span class="satir-baslik">' + esc(s.ad) + '</span><span class="satir-alt">' + (acik ? esc(s.tema) : esc(s.insaatNotu || '')) + '</span></span><span class="satir-sag">' + (acik ? '<span class="durum durum-acik">Açık</span>' : '<span class="durum durum-kapali">İnşaat halinde</span>') + '</span></button></li>';
    }).join('') + '</ol>';
  }
  function lejant() {
    return '<div class="har-lejant" aria-label="Lejant"><span class="durum durum-satilik">Satılık</span><span class="durum durum-kapali">İnşaat halinde</span><span class="durum durum-acik">Açık</span><span class="durum durum-kararmis">Kararmış</span><span class="har-lej-hedef"><i></i>Hedef</span></div>';
  }
  function ciz(root) {
    const liste = semtler();
    if (!liste) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Harita yüklenemedi.', { tekrar: 'har-tekrar' }) + '</div>'; return; }
    if (!HS.sec || !liste.some(function (s) { return s.id === HS.sec; })) HS.sec = 'carsi';
    const sec = liste.filter(function (s) { return s.id === HS.sec; })[0], dk = 60 - new Date().getMinutes();
    root.innerHTML = '<div class="sayfa sayfa-genis har-kok"><div class="sayfa-baslik"><h1>Şehir Haritası</h1><span class="chip chip-kobalt">' + ikon('saat', 14) + faz() + ' · Meydan Sorusu ' + dk + ' dk sonra</span>' +
      '<div class="sekmeler" role="tablist" aria-label="Görünüm"><button type="button" role="tab" id="har-sekme-harita" class="sekme' + (HS.gorunum === 'harita' ? ' aktif' : '') + '" aria-selected="' + (HS.gorunum === 'harita') + '" data-action="har-sekme" data-g="harita">' + ikon('harita', 18) + 'Harita</button><button type="button" role="tab" id="har-sekme-liste" class="sekme' + (HS.gorunum === 'liste' ? ' aktif' : '') + '" aria-selected="' + (HS.gorunum === 'liste') + '" data-action="har-sekme" data-g="liste">' + ikon('liste', 18) + 'Liste görünümü</button></div></div>' +
      (navigator.onLine === false ? '<div class="mey-cevrimdisi">' + ikon('uyari', 18) + 'Çevrimdışı harita: durumlar güncel olmayabilir.</div>' : '') +
      '<div class="har-govde"><div class="har-sol">' + (HS.gorunum === 'harita' ? '<div class="sahne har-sahne">' + haritaSvg(liste) + '</div>' + lejant() : listeHtml(liste)) + '</div><div class="har-sag">' + kartHtml(sec) + '</div></div></div>';
    sigdir(root);
    if (!HS.resize) { HS.resize = function () { const r = ID('screen'); if (r && aktif()) sigdir(r); }; window.addEventListener('resize', HS.resize); }
  }
  function sigdir(root) {
    const sh = root.querySelector('.har-sahne'), svg = sh && sh.querySelector('svg'); if (!svg) return;
    const w = sh.clientWidth || 600, ideal = w * H / W, dar = (root.clientWidth || 1000) < 980;
    const ust = (root.querySelector('.sayfa-baslik') || {}).offsetHeight || 60, alt = (root.querySelector('.har-lejant') || {}).offsetHeight || 40;
    svg.style.height = Math.round(dar ? ideal : Math.max(380, Math.min(ideal, (root.clientHeight || 700) - ust - alt - 76))) + 'px';
  }
  async function vinyet(hedef, ad) {
    const md = modal({ sinif: 'scr-harita', baslik: '', html: '<div class="mey-vinyet" role="status">' + ikon('tramvay', 40) + '<b>Kapı kapanıyor…</b><span>' + esc(ad) + ' durağına doğru, vagon camında şehir kayıyor.</span></div>', butonlar: [], kapatilabilir: false });
    await bekle(1400); md.kapat(); go(hedef);
  }
  KK_UI.screen('harita', {
    ad: 'Şehir Haritası',
    render(root, ctx) { if (ctx.ilk || !HS) HS = { sec: hedefSemt() === 'carsi' ? 'carsi' : 'carsi', satilik: false, gorunum: 'harita' }; try { ciz(root); } catch (e) { console.error(e); root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Harita yüklenemedi.', { tekrar: 'har-tekrar' }) + '</div>'; } },
    leave() { if (HS && HS.resize) { window.removeEventListener('resize', HS.resize); HS.resize = null; } },
    actions: {
      'har-tekrar': function () { refresh(); },
      'har-sec': function (el) { HS.sec = el.getAttribute('data-semt'); HS.satilik = false; refresh(); },
      'har-satilik': function () { HS.sec = 'carsi'; HS.satilik = true; refresh(); },
      'har-satilik-git': function () { go('sokak'); },
      'har-sekme': function (el) { HS.gorunum = el.getAttribute('data-g'); refresh(); },
      'har-git': function (el) {
        const id = el.getAttribute('data-semt');
        if (id === 'meydan') { go('meydan'); return; }
        vinyet(id === 'bloklar' ? 'oda' : 'sokak', id === 'bloklar' ? 'Bloklar' : 'Çarşı');
      },
      async 'har-gez'(el) {
        const s = semtler().filter(function (x) { return x.id === el.getAttribute('data-semt'); })[0], u = (VERI().ustalar || {})[s.usta];
        const evet = await onayla('Turist modunda sokakları gezebilir, vitrinlere bakabilirsin; görev ve arsa alma ' + s.ad + ' açılınca başlar. Gezmeye girelim mi?', 'Gezmeye gir', 'Vazgeç');
        if (!evet || !aktif()) return;
        modal({ sinif: 'scr-harita', baslik: 'Turist modu: ' + s.ad, ikon: 'goz', html: '<div class="har-turist"><div class="sira-s"><span class="chip chip-kobalt">TURİST</span><span class="soluk kucuk">HUD\'da mavi band görünür</span></div>' +
          '<div class="diyalog">' + (u ? '<div class="diyalog-portre">' + ustaSvg(s.usta, { boyut: 72, kadraj: 'bust' }) + '<b>' + esc(u.ad) + '</b></div>' : '') + '<div class="balon balon-usta balon-kuyruk">' + (u ? esc(String(u.selam || '').replace(/\{ad\}/g, state.ad || 'Deniz')) : '') + '</div></div>' +
          "<ul class=\"har-turist-liste\"><li>Saha Atölyesi'nin kapısında zincir var: \"Görevler " + esc(s.insaatNotu ? s.insaatNotu.split(':')[1].trim() : 'sınavdan sonra') + "\".</li><li>Belediye Tapu Masası: \"Bu semtte arsa alamazsın (henüz).\"</li><li>Alkış verebilir, sohbet edebilirsin.</li></ul>" +
          '<div class="har-eksik var">' + ikon('kilit', 18) + '<span><b>Neden alamıyorum?</b><br><small>' + esc(eksik(s)) + '</small></span></div><p class="ipucu-yazi">Demo: semt sahneleri henüz çizilmedi; turist modu burada özetlenir.</p></div>', butonlar: [{ ad: 'Haritaya dön', birincil: true }] });
      }
    },
    async selftest(root, ctx) {
      await ctx.bekleSecici('#har-svg');
      const sv = function (sel) { const el = document.querySelector(sel); if (!el) throw new Error('öğe yok: ' + sel); el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); };
      if (document.querySelectorAll('#har-svg .har-ada').length !== 9) throw new Error('haritada 9 ada (7 semt + Meydan + Bloklar) olmalı');
      sv('.har-ada[data-semt="liman"]'); await ctx.bekle(60);
      if (!/Çarşı Sınavı/.test(ctx.metin('.har-kart')) || !/İnşaat halinde/.test(ctx.metin('.har-kart'))) throw new Error('kilitli semt nedeni gösterilmedi: ' + ctx.metin('.har-kart'));
      await ctx.tikla('[data-action="har-gez"]'); await ctx.bekleSecici('[data-veri="onayla-evet"]'); await ctx.tikla('[data-veri="onayla-evet"]'); await ctx.bekleSecici('.har-turist');
      if (!/Neden alamıyorum/.test(ctx.metin('.har-turist'))) throw new Error('turist modu nedeni yok'); await ctx.tikla('.modal .btn-birincil'); await ctx.bekle(60);
      sv('.har-satilik'); await ctx.bekle(60);
      if (!/300 B · Sev\. 3 · Ruhsat 3\/3/.test(ctx.metin('.har-kart')) || !/Ruhsat 2\/3/.test(ctx.metin('.har-kart'))) throw new Error('Satılık kartı eksik nedeni göstermedi: ' + ctx.metin('.har-kart'));
      await ctx.tikla('#har-sekme-liste'); await ctx.bekleSecici('.har-liste'); await ctx.tikla('.har-liste [data-semt="carsi"]');
      await ctx.tikla('[data-action="har-git"]'); await ctx.bekle(100);
      if (ctx.gidilen() !== 'sokak') throw new Error('Çarşı\'ya Git sokak ekranına götürmedi');
    }
  });
})();
