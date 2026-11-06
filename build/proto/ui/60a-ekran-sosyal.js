/* ==== ui/60a-ekran-sosyal.js — P3 (2/4): Oda (6×6 izometrik, yerleştir/kaldır/taşı/döndür, ziyaret + Alkış) ve Dolap (giy, emote çarkı, Nişan, görünüm) ====
   Döngü: Pazar → state.envanter → Dolap'ta giy (state.avatar + state.giyili; HUD ve Profil anında güncellenir) → Oda'ya yerleştir (state.oda.esyalar = [{ urun, gx, gy, yon }]). */
(function () {
  const S = KK_UI.sosyal;
  const urunBul = S.urunBul;

  /* ================= ODA ================= */
  const OD = { mod: 'gez', env: null, yer: -1, gecmis: [], ziyaret: null, giris: 0, og: null, kabul: {} };
  const C = 6, R = 6, TABAN = 25, DUVAR_H = 96;
  const SABIT = [{ gx: 3, gy: 0, w: 2, d: 1, sabit: true }];
  const IZIN = { herkes: 'Herkese açık', arkadaslar: 'Arkadaşlara', zilli: 'Zilli' };
  const meta = function (t) { return (iso.PROP_META && iso.PROP_META[t]) || { w: 1, d: 1, yuk: 60 }; };
  const propTur = function (e) { const u = urunBul(e.urun); return u && u.onizleme ? u.onizleme.anahtar : 'kutu'; };
  const ayak = function (e) { const m = meta(propTur(e)); return e.yon ? { w: m.d, d: m.w } : { w: m.w, d: m.d }; };

  function odaKapasite() {
    let k = TABAN; const L = S.seviye();
    for (let i = 2; i <= L; i++) { const h = seviyeHediyesi(i), m = h && /kapasite\w*\s*\+(\d+)/i.exec(h.ad || ''); if (m) k += Number(m[1]); }
    return k;
  }
  function odaDurum() {
    const o = state.oda;
    if (!Array.isArray(o.esyalar)) o.esyalar = [];
    if (!Array.isArray(o.ziyaretci)) o.ziyaretci = [];
    if (typeof o.alkis !== 'number') o.alkis = 0;
    if (!o.izin) o.izin = S.yasBandi() === 'genc' ? 'arkadaslar' : 'herkes';
    if (S.yasBandi() === 'genc' && o.izin === 'herkes') o.izin = 'arkadaslar';
    if (!o.defterTohum) {
      o.defterTohum = true;
      if (!o.ziyaretci.length) {
        o.ziyaretci = [{ ad: 'ayse_kod', unvan: 'Kalfa', saat: 'Dün 21:14', not: 'Odan çok güzel.', alkis: true }, { ad: 'mert_yaz', unvan: 'Kalfa', saat: 'Dün 18:40', not: 'Merhaba!', alkis: false }, { ad: 'elif_bit', unvan: 'Kalfa', saat: 'Pzt 12:05', not: 'Alkışladım!', alkis: true }];
        o.alkis = 2;
      }
      save();
    }
    if (!state.ekran.oda) state.ekran.oda = { alkislar: {}, ilkAlkis: false };
    return o;
  }
  function cakisir(gx, gy, w, d, haric, tur) {
    if (gx < 0 || gy < 0 || gx + w > C || gy + d > R) return true;
    const yeniHali = tur === 'hali', kutular = SABIT.map(function (k) { return { gx: k.gx, gy: k.gy, w: k.w, d: k.d, sabit: true }; });
    state.oda.esyalar.forEach(function (e, i) { if (i === haric) return; const f = ayak(e); kutular.push({ gx: e.gx, gy: e.gy, w: f.w, d: f.d, hali: propTur(e) === 'hali' }); });
    return kutular.some(function (k) {
      if (!(gx < k.gx + k.w && gx + w > k.gx && gy < k.gy + k.d && gy + d > k.gy)) return false;
      if (k.sabit) return true;
      return !!k.hali === yeniHali; // halı ile eşya üst üste durabilir; halı+halı ve eşya+eşya çakışır
    });
  }
  function esyaBul(gx, gy) {
    const L = state.oda.esyalar; let b = -1;
    L.forEach(function (e, i) { const f = ayak(e); if (gx >= e.gx && gx < e.gx + f.w && gy >= e.gy && gy < e.gy + f.d) { if (b < 0 || propTur(L[b]) === 'hali') b = i; } });
    return b;
  }
  function gecmisKaydet() { OD.gecmis.push(JSON.stringify(state.oda.esyalar)); if (OD.gecmis.length > 30) OD.gecmis.shift(); }
  function sonTest() {
    const G = (S.veri().gorevler || []).filter(function (g) { return g.ruhsat && (state.gorevler[g.id] || {}).tamam; }), g = G[G.length - 1];
    if (!g) return null;
    const n = g.editor && g.editor.testler ? g.editor.testler.length : 3;
    return { ad: g.ad, yesil: n, toplam: n };
  }
  function svgNokta(ev, svg) {
    try { const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; const m = svg.getScreenCTM(); if (!m) return null; const r = p.matrixTransform(m.inverse()); return { x: r.x, y: r.y }; } catch (e) { return null; }
  }
  /** Ziyaret edilen oyuncunun (arkadaş / liste) odası: ad'dan belirlenimli bir yerleşim. */
  function ziyaretOdasi(ad) {
    const veri = S.veri(), dostlar = (veri.sohbet && veri.sohbet.arkadaslar) || [], liste = (veri.liderlik && veri.liderlik.haftalik) || [];
    const di = dostlar.map(function (x) { return x.ad; }).indexOf(ad);
    const kim = dostlar.filter(function (x) { return x.ad === ad; })[0] || liste.filter(function (x) { return x.ad === ad; })[0] || { ad: ad, seviye: 4, avatar: { ten: S.hash(ad) % 6, sacStil: S.hash(ad + 's') % 8, sacRenk: S.hash(ad + 'r') % 6, kiyafet: S.hash(ad + 'k') % 6, aksesuar: [] } };
    const izin = ['herkes', 'arkadaslar', 'zilli', 'herkes'][di >= 0 ? di % 4 : S.hash(ad) % 3];
    const tek = S.urunler().filter(function (u) { if (!u.onizleme || u.onizleme.tur !== 'prop') return false; const m = meta(u.onizleme.anahtar); return m.w === 1 && m.d === 1 && u.onizleme.anahtar !== 'hali'; });
    const hali = S.urunler().filter(function (u) { return u.onizleme && u.onizleme.anahtar === 'hali'; })[0];
    const yerler = [[0, 2], [0, 4], [5, 1], [5, 4], [2, 5], [4, 5], [1, 0]], h = S.hash(ad), esyalar = [];
    if (hali) esyalar.push({ urun: hali.id, gx: 2, gy: 2, yon: 0 });
    for (let i = 0; i < 5 && tek.length; i++) esyalar.push({ urun: tek[(h >> (i * 3)) % tek.length].id, gx: yerler[i][0], gy: yerler[i][1], yon: 0 });
    return { ad: ad, seviye: kim.seviye, avatar: kim.avatar, izin: izin, esyalar: esyalar };
  }

  function sahneSvg(o) {
    const a = iso.alan(C, R, { yukari: 132, kenar: 22 }), og = a.orijin;
    OD.og = og;
    const pt = function (gx, gy, e) { const p = iso.xy(gx, gy, 0, og); return [p.x, p.y - (e || 0)]; };
    const poly = function (pts, fill, ek) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="' + fill + '"' + (ek || '') + '/>'; };
    const duvar = function (taraf, t0, t1, e0, e1, fill, ek) { const P = taraf === 'L' ? function (t, e) { return pt(0, t, e); } : function (t, e) { return pt(t, 0, e); }; return poly([P(t0, e0), P(t1, e0), P(t1, e1), P(t0, e1)], fill, ek); };
    const nok = function (taraf, t, e) { return taraf === 'L' ? pt(0, t, e) : pt(t, 0, e); };
    let s = duvar('L', 0, R, 0, DUVAR_H, '#3B4983') + duvar('R', 0, C, 0, DUVAR_H, '#2E3A73') + duvar('L', 0, R, 0, 7, '#27316A') + duvar('R', 0, C, 0, 7, '#1F2956');
    // pencere (sağ duvar): gece manzarası
    s += duvar('R', 1.7, 3.2, 40, 86, '#0C1544') + duvar('R', 1.7, 3.2, 40, 86, 'none', ' stroke="#C5CEE4" stroke-width="3" stroke-linejoin="round"');
    const ay = nok('R', 2.9, 76), y1 = nok('R', 2.1, 70), y2 = nok('R', 2.5, 52), y3 = nok('R', 2.7, 64);
    s += '<circle cx="' + ay[0].toFixed(1) + '" cy="' + ay[1].toFixed(1) + '" r="5" fill="#FFE9A8"/><circle cx="' + y1[0].toFixed(1) + '" cy="' + y1[1].toFixed(1) + '" r="1.6" fill="#E8EDF8"/><circle cx="' + y2[0].toFixed(1) + '" cy="' + y2[1].toFixed(1) + '" r="1.4" fill="#E8EDF8"/><circle cx="' + y3[0].toFixed(1) + '" cy="' + y3[1].toFixed(1) + '" r="1.2" fill="#9AA7C7"/>';
    const m0 = nok('R', 2.45, 40), m1 = nok('R', 2.45, 86);
    s += '<line x1="' + m0[0].toFixed(1) + '" y1="' + m0[1].toFixed(1) + '" x2="' + m1[0].toFixed(1) + '" y2="' + m1[1].toFixed(1) + '" stroke="#C5CEE4" stroke-width="2"/>';
    // kapı (sol duvar)
    s += duvar('L', 4.05, 5.2, 0, 74, '#7A5236') + duvar('L', 4.22, 5.03, 9, 66, '#8E6445');
    const kn = nok('L', 4.95, 36); s += '<circle cx="' + kn[0].toFixed(1) + '" cy="' + kn[1].toFixed(1) + '" r="2.8" fill="#FFD36A"/>';
    // Ziyaretçi Defteri (sol duvar, kapının yanında)
    s += '<g class="oda-sabit" data-action="oda-defter" tabindex="0" role="button" aria-label="Ziyaretçi Defteri: son 20 ziyaretçi">' + duvar('L', 2.6, 3.7, 36, 72, '#B9854F') + duvar('L', 2.6, 3.7, 36, 72, 'none', ' stroke="#6B4A33" stroke-width="2"') + duvar('L', 2.78, 3.52, 60, 61.5, '#6B4A33') + duvar('L', 2.78, 3.52, 52, 53.5, '#6B4A33') + duvar('L', 2.78, 3.3, 44, 45.5, '#6B4A33') + '</g>';
    s += iso.zemin(C, R, ['#3A4670', '#343F66'], { orijin: og, kenar: 'rgba(255,255,255,.05)' });
    const ogeler = [];
    if (!o.ziyaret) ogeler.push({ gx: 3, gy: 0, w: 2, d: 1, svg: '<g class="oda-sabit" data-action="oda-masa" tabindex="0" role="button" aria-label="Çalışma Masası: son geçilen testi göster">' + iso.prop('masa', 3, 0, { orijin: og }) + iso.prop('tv', 3, 0, { orijin: og, z: 36, acik: true }) + '</g>' });
    else ogeler.push({ gx: 3, gy: 0, w: 2, d: 1, svg: iso.prop('masa', 3, 0, { orijin: og }) + iso.prop('tv', 3, 0, { orijin: og, z: 36, acik: true }) });
    o.esyalar.forEach(function (e, i) {
      const u = urunBul(e.urun); if (!u || !u.onizleme) return;
      const t = u.onizleme.anahtar, f = ayak(e);
      let g = iso.prop(t, e.gx, e.gy, { orijin: og, etiket: (t === 'neon' || t === 'tabela') ? 'KODKENT' : undefined, acik: true });
      if (e.yon) g = '<g transform="translate(' + (2 * iso.xy(e.gx, e.gy, 0, og).x).toFixed(1) + ' 0) scale(-1 1)">' + g + '</g>';
      ogeler.push({ gx: e.gx, gy: e.gy, w: f.w, d: f.d, gz: t === 'hali' ? -1 : 0, svg: '<g class="oda-esya' + (o.duzenle && i === o.yer ? ' oda-esya-secili' : '') + '" data-idx="' + i + '">' + g + '</g>' });
    });
    s += iso.sirala(ogeler);
    // avatar (Gez modunda tıklanan hücreye yürür)
    const av = o.avatar || state.avatar, mc = iso.xy(o.avGx != null ? o.avGx : 2.5, o.avGy != null ? o.avGy : 3.5, 0, og);
    if (!o.duzenle) s += '<g id="oda-av" class="oda-av" transform="translate(' + (mc.x - 26).toFixed(1) + ' ' + (mc.y - 68).toFixed(1) + ')">' + avatarSvg(av, { boyut: 72, kadraj: 'tam', aria: o.ziyaret ? o.ziyaret + ' (ziyaret edilen oyuncu)' : 'Avatarın' }) + '</g>';
    if (o.duzenle) {
      let ek = '';
      const sec = o.yer >= 0 ? state.oda.esyalar[o.yer] : null, envU = o.env ? urunBul(o.env) : null;
      if (sec) { const f = ayak(sec); ek += poly([pt(sec.gx, sec.gy), pt(sec.gx + f.w, sec.gy), pt(sec.gx + f.w, sec.gy + f.d), pt(sec.gx, sec.gy + f.d)], 'rgba(255,190,61,.18)', ' stroke="#FFBE3D" stroke-width="2.5" stroke-dasharray="6 4" pointer-events="none"'); }
      for (let gx = 0; gx < C; gx++) for (let gy = 0; gy < R; gy++) {
        const bi = esyaBul(gx, gy), t = envU ? envU.onizleme.anahtar : (sec ? propTur(sec) : null), mm = envU ? meta(t) : (sec ? ayak(sec) : null);
        const uygun = mm ? !cakisir(gx, gy, mm.w, mm.d, envU ? -1 : o.yer, t) : false;
        ek += '<polygon id="oda-h-' + gx + '-' + gy + '" class="hucre' + (uygun ? ' hucre-uygun' : '') + (bi >= 0 ? ' hucre-dolu' : '') + '" points="' + [pt(gx, gy), pt(gx + 1, gy), pt(gx + 1, gy + 1), pt(gx, gy + 1)].map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="rgba(0,0,0,0)" data-action="oda-hucre" data-gx="' + gx + '" data-gy="' + gy + '" tabindex="0" role="button" aria-label="Sütun ' + (gx + 1) + ', satır ' + (gy + 1) + (bi >= 0 ? ', ' + esc((urunBul(state.oda.esyalar[bi].urun) || {}).ad || 'eşya') : (uygun ? ', yerleştirilebilir' : '')) + '"/>';
      }
      s += ek;
    }
    return '<svg class="oda-svg" viewBox="' + a.viewBox + '" role="group" aria-label="' + esc(o.aria || 'Oda') + '"' + (o.duzenle ? '' : ' data-action="oda-yuru"') + '>' + s + '</svg>';
  }

  function odaKilitli(root) {
    const sv = seviyeBilgi();
    root.innerHTML = '<div class="sayfa sayfa-dar"><div class="sayfa-baslik"><h1>Oda</h1></div>' + bosHtml({ ikon: 'kilit', baslik: "Oda Sev. 2'de açılır", metin: 'Şu an Sev. ' + sv.seviye + ' (' + fmt(sv.gereken - sv.kalan) + ' XP kaldı). Bir ders ya da görev bitirince Stüdyon hazır olur.', buton: { ad: "Akademi'ye git", aksiyon: 'oda-akademi', sinif: 'btn-birincil' } }) + '</div>';
  }
  function envanterHtml(yer) {
    const L = S.urunler().filter(function (u) { return u.onizleme && u.onizleme.tur === 'prop' && S.sahip(u.id) && !state.oda.esyalar.some(function (e) { return e.urun === u.id; }); });
    let govde = '';
    if (!L.length) govde = bosHtml({ ikon: 'kutu', baslik: 'Yerleştirilecek eşya yok', metin: "Envanterinde odaya konabilecek bir eşya kalmadı. Pazar'dan alabilirsin.", buton: { ad: "Pazar'a git", aksiyon: 'oda-pazar', sinif: 'btn-altin' } });
    else govde = '<div class="oda-env-izgara">' + L.map(function (u) { return S.kart(u, { eylem: 'oda-env-sec', secili: OD.env === u.id, boyut: 70, alt: '<span class="urun-durum gri">' + (OD.env === u.id ? 'Seçili: hücreye dokun' : 'Yerleştir') + '</span>', aria: u.ad + ', ' + u.nadirlik + ', odaya yerleştirmek için seç' }); }).join('') + '</div>';
    const yerl = state.oda.esyalar.map(function (e, i) { const u = urunBul(e.urun); return '<li><button type="button" class="satir satir-tikla' + (i === yer ? ' satir-ben' : '') + '" data-action="oda-esya-sec" data-idx="' + i + '" aria-pressed="' + (i === yer) + '"><span class="satir-ana"><span class="satir-baslik">' + esc(u ? u.ad : 'Eşya') + '</span><span class="satir-alt">Sütun ' + (e.gx + 1) + ' · satır ' + (e.gy + 1) + (e.yon ? ' · döndürüldü' : '') + '</span></span><span class="satir-sag">' + (i === yer ? chipHtml('Seçili', 'amber') : '') + '</span></button></li>'; }).join('');
    return '<div class="kart oda-env"><h2 class="kart-baslik">' + ikon('kutu', 20) + 'Envanter <span class="chip chip-gri">' + L.length + ' yerleştirilebilir</span></h2>' + govde + (yerl ? '<h3 class="oda-alt-baslik">Yerleştirilenler (' + state.oda.esyalar.length + '/' + odaKapasite() + ')</h3><ul class="liste oda-yerl">' + yerl + '</ul>' : '') + '</div>';
  }
  function defterHtml(o, genc) {
    const L = o.ziyaretci.slice(0, 20);
    const ic = L.length ? '<ul class="liste">' + L.map(function (z) { return '<li class="satir"><span class="satir-ana"><span class="satir-baslik">@' + esc(z.ad) + ' ' + chipHtml(z.unvan || 'Çırak', 'gri') + '</span><span class="satir-alt">' + esc(z.saat) + (z.not ? ' · "' + esc(z.not) + '"' : '') + '</span></span><span class="satir-sag" title="' + (z.alkis ? 'Alkış bıraktı' : 'Alkışsız ziyaret') + '">' + (z.alkis ? ikon('kalp', 20) : '') + '</span></li>'; }).join('') + '</ul>'
      : '<p class="soluk">Defter henüz boş. Odanı ' + (genc ? 'Arkadaşlarına açık tut' : 'Arkadaşlara ya da Herkese aç') + ', ilk ziyaretçini bekle.</p>';
    return '<div class="kart oda-defter" id="oda-defter"><h2 class="kart-baslik">' + ikon('defter', 20) + 'Ziyaretçi Defteri <span class="chip chip-amber">' + ikon('kalp', 14) + o.alkis + ' Alkış</span></h2>' + ic + '<p class="mini soluk">Son 20 ziyaret. Ziyaret ödül vermez; sosyal ödül Alkış\'tır (sahibe 2 B, günlük en çok 40 B).</p></div>';
  }
  function izinHtml(o) {
    const genc = S.yasBandi() === 'genc';
    return '<fieldset class="kart oda-izin"><legend class="kart-baslik">' + ikon('kapi' === 'x' ? 'ev' : 'kalkan', 20) + 'Oda izni</legend><div class="yigin-s">' + Object.keys(IZIN).map(function (k) {
      const kapali = genc && k === 'herkes';
      return '<label class="secim-kart' + (kapali ? ' devre' : '') + '"><input type="radio" name="oda-izin" id="oda-izin-' + k + '" value="' + k + '" data-input="oda-izin"' + (o.izin === k ? ' checked' : '') + (kapali ? ' disabled' : '') + '><span><b>' + IZIN[k] + '</b>' + (kapali ? '<br><small class="soluk">Hukuk teyidine kadar 15–17 yaş için kapalı.</small>' : '') + '</span></label>';
    }).join('') + '</div>' + (genc ? '<p class="mini soluk">Odan Arkadaşlara açık.</p>' : '') + '</fieldset>';
  }
  function odaBenim(root, ctx) {
    const o = odaDurum(), duzenle = OD.mod === 'duzenle', genc = S.yasBandi() === 'genc', kap = odaKapasite(), st = sonTest();
    if (OD.yer >= o.esyalar.length) OD.yer = -1;
    const sahne = sahneSvg({ esyalar: o.esyalar, duzenle: duzenle, yer: OD.yer, env: OD.env, avatar: state.avatar, aria: (state.ad || 'Oyuncu') + ' adlı oyuncunun Stüdyo odası, ' + o.esyalar.length + ' eşya' });
    const bos = !o.esyalar.length;
    root.innerHTML = '<div class="sayfa sayfa-genis oda-sayfa">' +
      '<div class="sayfa-baslik"><h1>Oda</h1><div class="sekmeler" role="group" aria-label="Oda modu"><button type="button" class="sekme' + (!duzenle ? ' aktif' : '') + '" aria-pressed="' + (!duzenle) + '" data-action="oda-mod" data-mod="gez">' + ikon('goz', 18) + 'Gez</button><button type="button" class="sekme' + (duzenle ? ' aktif' : '') + '" aria-pressed="' + duzenle + '" data-action="oda-mod" data-mod="duzenle">' + ikon('kalem', 18) + 'Düzenle</button></div></div>' +
      '<div class="oda-duzen"><section class="oda-sol">' +
      '<div class="oda-bilgi"><b>' + esc(state.ad || 'Oyuncu') + '\'nin Odası</b>' + chipHtml(IZIN[o.izin], o.izin === 'herkes' ? 'nane' : 'turkuaz', 'kalkan') + chipHtml('Stüdyo 6×6', 'gri') + chipHtml(o.esyalar.length + '/' + kap + ' eşya', o.esyalar.length >= kap ? 'mercan' : 'gri', 'kutu') + chipHtml('0/20 kişi', 'gri', 'kullanicilar') + '</div>' +
      '<div class="sahne oda-sahne' + (duzenle ? ' oda-duzenleme' : '') + '" id="oda-sahne">' + sahne + '</div>' +
      (bos && !duzenle ? '<div class="oda-bos">' + ikon('kutu', 22) + '<p>Odan şimdilik bomboş. Pazar\'dan bir şey al ya da envanterinden bir eşya yerleştir.</p><div class="sira-s"><button type="button" class="btn btn-altin btn-kucuk" data-action="oda-pazar">Pazar\'a git</button><button type="button" class="btn btn-birincil btn-kucuk" data-action="oda-mod" data-mod="duzenle">Düzenle</button></div></div>' : '') +
      (duzenle ? '<div class="oda-arac" role="toolbar" aria-label="Düzenleme araçları"><button type="button" class="btn btn-kucuk" data-action="oda-dondur"' + (OD.yer < 0 ? ' aria-disabled="true"' : '') + '>' + ikon('yenile', 16) + 'Döndür (R)</button><button type="button" class="btn btn-kucuk btn-tehlike" data-action="oda-kaldir"' + (OD.yer < 0 ? ' aria-disabled="true"' : '') + '>' + ikon('cop', 16) + 'Kaldır</button><button type="button" class="btn btn-kucuk btn-hayalet" data-action="oda-geri"' + (!OD.gecmis.length ? ' aria-disabled="true"' : '') + '>' + ikon('ok-sol', 16) + 'Geri al</button></div><p class="mini soluk oda-ipucu" role="status">' + (OD.env ? 'Seçili eşya: ' + esc((urunBul(OD.env) || {}).ad || '') + '. Yeşil hücrelerden birine dokun.' : OD.yer >= 0 ? 'Eşya seçili: başka bir hücreye dokunarak taşı; ok tuşları hücre hücre taşır, R döndürür, Delete kaldırır.' : 'Envanterden bir eşya seç, sonra hücreye dokun. Yerleştirdiğin bir eşyayı taşımak için ona dokun.') + '</p>' + envanterHtml(OD.yer) : '<p class="mini soluk">Odanın boş bir yerine dokunarak avatarını yürüt. Çalışma Masası ve Ziyaretçi Defteri tıklanabilir.</p>') +
      '</section><aside class="oda-sag">' + defterHtml(o, genc) +
      '<div class="kart oda-masa" id="oda-masa-kart"><h2 class="kart-baslik">' + ikon('kod', 20) + 'Çalışma Masası</h2>' + (st ? '<p>Son geçilen test: <b>' + esc(st.ad) + '</b> · ' + st.yesil + '/' + st.toplam + ' yeşil</p>' : '<p class="soluk">Henüz geçilmiş test yok. İlk görevini bitirince burada görünür.</p>') + '<button type="button" class="btn btn-birincil btn-kucuk" data-action="oda-atolye">Atölye\'ye git</button></div>' +
      izinHtml(o) + '</aside></div></div>';
    const sahneEl = $('#oda-sahne', root);
    if (sahneEl) sahneEl.addEventListener('keydown', tusIsle);
  }
  function odaZiyaret(root) {
    const ad = OD.ziyaret, oda = ziyaretOdasi(ad), hizli = KK_UI.hizliMod || KK_UI.selftestAktif;
    const durum = odaDurum(), bugun = S.gunAnahtari(), verdi = (state.ekran.oda.alkislar || {})[ad] === bugun;
    let govde;
    if (oda.izin === 'zilli' && !OD.kabul[ad]) {
      govde = '<div class="kart oda-kapi">' + ikon('zil', 36) + '<h2>' + esc(ad) + ' odasını Zilli tutuyor</h2><p>Kapıyı çaldın. ' + esc(ad) + ' çevrimiçiyse kabul edebilir; yanıt gelmezse 2 dakika sonra kapanır.</p><button type="button" class="btn btn-birincil" data-action="oda-kapi-cal">Kapıyı çal</button></div>';
    } else {
      if (!OD.giris) OD.giris = Date.now();
      const sure = hizli ? 20 : Math.min(20, Math.floor((Date.now() - OD.giris) / 1000));
      const hazir = sure >= 20;
      govde = '<div class="sahne oda-sahne" id="oda-sahne">' + sahneSvg({ esyalar: oda.esyalar, duzenle: false, avatar: oda.avatar, ziyaret: ad, aria: ad + ' adlı oyuncunun odası, ' + oda.esyalar.length + ' eşya', avGx: 3.5, avGy: 3.5 }) + '</div>';
      govde += '<div class="oda-ziyaret-bar kart"><div><b>@' + esc(ad) + '</b> · Sev. ' + oda.seviye + ' ' + chipHtml(IZIN[oda.izin], oda.izin === 'herkes' ? 'nane' : 'turkuaz', 'kalkan') + '</div>' +
        (verdi ? '<p class="mini soluk">Bu odaya bugün zaten Alkış bıraktın. Yarın 04:00\'ten sonra yenisini verebilirsin.</p><button type="button" class="btn" aria-disabled="true">Alkışlandı</button>'
          : '<button type="button" id="oda-alkis" class="btn btn-altin" data-action="oda-alkis"' + (hazir ? '' : ' aria-disabled="true"') + '>' + ikon('kalp', 18) + '<span id="oda-alkis-yazi">' + (hazir ? 'Alkışla' : 'Alkış için ' + (20 - sure) + ' sn') + '</span></button><p class="mini soluk" id="oda-alkis-not">' + (hazir ? 'Sahibe 2 B gider (günlük tavan 40 B). Günde bir kez.' : 'Alkış için odada birkaç saniye daha kal.') + '</p>') + '</div>';
    }
    root.innerHTML = '<div class="sayfa sayfa-genis oda-sayfa"><div class="sayfa-baslik"><h1>@' + esc(ad) + '\'nin Odası</h1><button type="button" class="btn btn-hayalet btn-kucuk" data-action="oda-ziyaret-bitir">' + ikon('ok-sol', 16) + 'Odama dön</button></div><div class="oda-ziyaret">' + govde + '</div></div>';
    if (!verdi && !hizli && OD.giris && !(oda.izin === 'zilli' && !OD.kabul[ad])) {
      KK_UI.aralik(function () {
        const sure = Math.min(20, Math.floor((Date.now() - OD.giris) / 1000)), b = $('#oda-alkis'), y = $('#oda-alkis-yazi'), n = $('#oda-alkis-not');
        if (!b || !y) return;
        if (sure >= 20) { b.removeAttribute('aria-disabled'); y.textContent = 'Alkışla'; if (n) n.textContent = 'Sahibe 2 B gider (günlük tavan 40 B). Günde bir kez.'; } else y.textContent = 'Alkış için ' + (20 - sure) + ' sn';
      }, 1000);
    }
  }
  function tusIsle(ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target instanceof SVGElement && ev.target.hasAttribute('data-action')) { ev.preventDefault(); ev.stopPropagation(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); return; }
    if (OD.mod !== 'duzenle') return;
    const o = odaDurum(), k = ev.key;
    if ((ev.ctrlKey || ev.metaKey) && k.toLowerCase() === 'z') { ev.preventDefault(); ODA_ACTIONS['oda-geri'](); return; }
    const e = OD.yer >= 0 ? o.esyalar[OD.yer] : null; if (!e) return;
    if (k === 'Delete' || k === 'Backspace') { ev.preventDefault(); ODA_ACTIONS['oda-kaldir'](); return; }
    if (k === 'r' || k === 'R') { ev.preventDefault(); ODA_ACTIONS['oda-dondur'](); return; }
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k]; if (!d) return;
    ev.preventDefault();
    const f = ayak(e);
    if (cakisir(e.gx + d[0], e.gy + d[1], f.w, f.d, OD.yer, propTur(e))) { toast('Buraya sığmaz.', 'uyari'); return; }
    gecmisKaydet(); e.gx += d[0]; e.gy += d[1]; S.kaydet('Oda kaydedilemedi. Son düzenin cihazında saklandı.'); refresh();
  }
  const ODA_ACTIONS = {
    'oda-akademi': function () { go('akademi'); },
    'oda-pazar': function () { go('pazar'); },
    'oda-atolye': function () { go('atolye'); },
    'oda-mod': function (el) { OD.mod = el.getAttribute('data-mod') === 'duzenle' ? 'duzenle' : 'gez'; OD.env = null; OD.yer = -1; refresh(); },
    'oda-env-sec': function (el) { const id = el.getAttribute('data-urun'); OD.env = OD.env === id ? null : id; OD.yer = -1; refresh(); },
    'oda-esya-sec': function (el) { OD.yer = Number(el.getAttribute('data-idx')); OD.env = null; refresh(); },
    'oda-hucre': function (el) {
      const gx = Number(el.getAttribute('data-gx')), gy = Number(el.getAttribute('data-gy')), o = odaDurum();
      if (OD.env) {
        const u = urunBul(OD.env); if (!u) { OD.env = null; return; }
        const t = u.onizleme.anahtar, m = meta(t), kap = odaKapasite();
        if (o.esyalar.length >= kap) { toast('Oda dolu: ' + o.esyalar.length + '/' + kap + ' eşya. Seviye atladıkça kapasite artar.', 'uyari'); return; }
        if (cakisir(gx, gy, m.w, m.d, -1, t)) { toast('Buraya sığmaz.', 'uyari'); return; }
        gecmisKaydet(); o.esyalar.push({ urun: u.id, gx: gx, gy: gy, yon: 0 }); OD.yer = o.esyalar.length - 1; OD.env = null;
        S.kaydet('Oda kaydedilemedi. Son düzenin cihazında saklandı.'); refresh(); return;
      }
      const b = esyaBul(gx, gy);
      if (OD.yer >= 0 && o.esyalar[OD.yer]) {
        if (b >= 0 && b !== OD.yer) { OD.yer = b; refresh(); return; }
        const e = o.esyalar[OD.yer], f = ayak(e);
        if (b === OD.yer) { return; }
        if (cakisir(gx, gy, f.w, f.d, OD.yer, propTur(e))) { toast('Buraya sığmaz.', 'uyari'); return; }
        gecmisKaydet(); e.gx = gx; e.gy = gy; S.kaydet('Oda kaydedilemedi. Son düzenin cihazında saklandı.'); refresh(); return;
      }
      if (b >= 0) { OD.yer = b; refresh(); } else toast('Boş hücre. Envanterden bir eşya seç ya da yerleştirdiğin bir eşyaya dokun.', 'bilgi');
    },
    'oda-dondur': function () {
      const o = odaDurum(), e = o.esyalar[OD.yer]; if (!e) { toast('Önce yerleştirdiğin bir eşyaya dokun.', 'bilgi'); return; }
      const m = meta(propTur(e)), yeni = e.yon ? { w: m.w, d: m.d } : { w: m.d, d: m.w };
      if (cakisir(e.gx, e.gy, yeni.w, yeni.d, OD.yer, propTur(e))) { toast('Dönmeye yer yok.', 'uyari'); return; }
      gecmisKaydet(); e.yon = e.yon ? 0 : 1; S.kaydet('Oda kaydedilemedi. Son düzenin cihazında saklandı.'); refresh();
    },
    'oda-kaldir': function () {
      const o = odaDurum(); if (OD.yer < 0 || !o.esyalar[OD.yer]) { toast('Önce yerleştirdiğin bir eşyaya dokun.', 'bilgi'); return; }
      gecmisKaydet(); const u = urunBul(o.esyalar[OD.yer].urun); o.esyalar.splice(OD.yer, 1); OD.yer = -1;
      S.kaydet('Oda kaydedilemedi. Son düzenin cihazında saklandı.'); toast((u ? u.ad : 'Eşya') + ' envantere döndü.', 'bilgi'); refresh();
    },
    'oda-geri': function () {
      if (!OD.gecmis.length) { toast('Geri alınacak bir düzenleme yok.', 'bilgi'); return; }
      try { state.oda.esyalar = JSON.parse(OD.gecmis.pop()); } catch (e) { return; }
      OD.yer = -1; S.kaydet('Oda kaydedilemedi. Son düzenin cihazında saklandı.'); refresh();
    },
    'oda-masa': function () { const st = sonTest(); toast(st ? 'Son geçilen test: ' + st.ad + ' · ' + st.yesil + '/' + st.toplam + ' yeşil.' : 'Henüz geçilmiş test yok.', 'bilgi'); const k = $('#oda-masa-kart'); if (k) { try { k.scrollIntoView({ block: 'nearest' }); k.classList.add('vurgu'); } catch (e) { /* kaydırma yok */ } } },
    'oda-defter': function () { const k = $('#oda-defter'); if (k) { try { k.scrollIntoView({ block: 'nearest' }); k.classList.add('vurgu'); } catch (e) { /* kaydırma yok */ } } },
    'oda-yuru': function (el, ev) {
      const svg = el.closest ? (el.tagName && el.tagName.toLowerCase() === 'svg' ? el : el.closest('svg')) : el, g = document.getElementById('oda-av');
      if (!svg || !g || !OD.og || !ev) return;
      const p = svgNokta(ev, svg); if (!p) return;
      const h = iso.hucre(p.x, p.y, OD.og);
      if (h.gx < 0 || h.gy < 0 || h.gx >= C || h.gy >= R) return;
      const hedef = iso.xy(h.gx + 0.5, h.gy + 0.5, 0, OD.og), t = (g.getAttribute('transform') || '').match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      walker(g, [{ x: t ? Number(t[1]) : hedef.x - 26, y: t ? Number(t[2]) : hedef.y - 68 }, { x: hedef.x - 26, y: hedef.y - 68 }], 600);
    },
    'oda-izin': function (el) {
      const o = odaDurum(), v = el.value; if (!IZIN[v]) return;
      if (S.yasBandi() === 'genc' && v === 'herkes') { toast('Odan Arkadaşlara açık. "Herkese açık" hukuk teyidine kadar kapalı.', 'uyari'); return; }
      o.izin = v; S.kaydet(); toast('Oda izni: ' + IZIN[v] + '.', 'basari'); refresh();
    },
    'oda-ziyaret-bitir': function () { OD.ziyaret = null; OD.giris = 0; refresh(); },
    'oda-kapi-cal': function () {
      const ad = OD.ziyaret; toast('Kapıyı çaldın. ' + ad + ' çevrimiçiyse kabul edebilir.', 'bilgi');
      KK_UI.gecikme(function () { OD.kabul[ad] = true; OD.giris = Date.now(); toast(ad + ' kapıyı açtı. Hoş geldin!', 'basari'); refresh(); }, KK_UI.hizliMod ? 0 : 1800);
    },
    'oda-alkis': function (el) {
      const ad = OD.ziyaret, hizli = KK_UI.hizliMod || KK_UI.selftestAktif, st = state.ekran.oda;
      if ((st.alkislar || {})[ad] === S.gunAnahtari()) { toast('Bu odaya bugün zaten Alkış bıraktın. Yarın 04:00\'ten sonra yenisini verebilirsin.', 'bilgi'); return; }
      if (!hizli && (Date.now() - OD.giris) < 20000) { toast('Alkış için odada birkaç saniye daha kal.', 'bilgi'); return; }
      st.alkislar = st.alkislar || {}; st.alkislar[ad] = S.gunAnahtari();
      toast('Alkışın ' + ad + '\'a ulaştı.', 'basari');
      if (!st.ilkAlkis) { st.ilkAlkis = true; save(); award({ bayt: 10, etiket: 'İlk Alkışın!', kaynak: el }); toast('İlk Alkışın! +10 B.', 'basari'); } else save();
      refresh();
    }
  };
  KK_UI.screen('oda', {
    ad: 'Oda', hud: true,
    render(root, ctx) {
      root.classList.add('scr-sosyal');
      if (ctx.ilk) {
        const p = ctx.parametre || {};
        OD.ziyaret = p.oda || null; OD.giris = 0; OD.env = null; OD.yer = -1; OD.mod = p.duzenle ? 'duzenle' : 'gez';
        if (p.sec && S.sahip(p.sec)) OD.env = p.sec;
      }
      if (S.seviye() < 2) { odaKilitli(root); return; }
      if (OD.ziyaret) odaZiyaret(root); else odaBenim(root, ctx);
    },
    actions: ODA_ACTIONS,
    async selftest(root, ctx) {
      const u = S.urunler().filter(function (x) { if (!x.onizleme || x.onizleme.tur !== 'prop' || x.para !== 'bayt' || x.nadirlik !== 'Sıradan') return false; const m = meta(x.onizleme.anahtar); return m.w === 1 && m.d === 1 && x.onizleme.anahtar !== 'hali'; })[0];
      if (!u) throw new Error('yerleştirilebilir 1×1 Sıradan eşya yok');
      if (!S.sahip(u.id)) state.envanter.push(u.id);
      OD.mod = 'duzenle'; OD.env = null; OD.yer = -1; refresh();
      await ctx.tikla('[data-action="oda-env-sec"][data-urun="' + u.id + '"]');
      { const hz = document.getElementById('oda-h-1-3'); if (!hz) throw new Error('hucre yok'); hz.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); await ctx.bekle(40); }
      if (state.oda.esyalar.length !== 1 || state.oda.esyalar[0].urun !== u.id) throw new Error('eşya odaya yerleşmedi');
      await ctx.tikla('[data-action="oda-dondur"]');
      await ctx.tikla('[data-action="oda-kaldir"]');
      if (state.oda.esyalar.length !== 0) throw new Error('eşya kaldırılamadı');
      await ctx.tikla('[data-action="oda-geri"]');
      if (state.oda.esyalar.length !== 1) throw new Error('geri al çalışmadı');
      OD.mod = 'gez'; refresh();
      await ctx.bekleSecici('#oda-av');
      // ziyaret: arkadaşın odasına gir, Alkış ver
      OD.ziyaret = 'ayse_kod'; OD.giris = 0; refresh();
      await ctx.tikla('#oda-alkis');
      if (!state.ekran.oda.ilkAlkis) throw new Error('Alkış kaydedilmedi');
      OD.ziyaret = null; OD.mod = 'gez'; state.oda.esyalar = []; refresh();
    }
  });

  /* ================= DOLAP ================= */
  const DL = { sekme: 'kiyafet', sec: null, yon: 'sol' };
  const DL_SEKME = [['kiyafet', 'Kıyafet'], ['aksesuar', 'Aksesuar'], ['emote', 'Emote'], ['nisan', 'Nişan'], ['gorunum', 'Görünüm']];
  const dlUrun = function (id) {
    const u = urunBul(id); if (u) return u;
    const f = S.SERBEST_EMOTE.filter(function (e) { return e.id === id; })[0];
    return f ? { id: f.id, ad: f.ad, kategori: 'emote', nadirlik: 'Sıradan', fiyat: 0, para: 'bayt', onizleme: { tur: 'avatar', anahtar: 'emote-' + f.id }, ucretsiz: true } : null;
  };
  function cark() { const g = S.giyiliDurum(); return g.emote.length ? g.emote.slice() : S.SERBEST_EMOTE.map(function (e) { return e.id; }); }
  const emoteKod = function (id) { const u = urunBul(id); return u ? String(u.onizleme.anahtar).slice(6) : id; };
  function sahipler(tur) {
    if (tur === 'emote') return S.SERBEST_EMOTE.map(function (e) { return dlUrun(e.id); }).concat(S.urunler().filter(function (u) { return S.altTur(u) === 'emote' && S.sahip(u.id); }));
    return S.urunler().filter(function (u) { return S.altTur(u) === tur && S.sahip(u.id); }).sort(function (a, b) { return (S.NAD_SIRA[a.nadirlik] - S.NAD_SIRA[b.nadirlik]) || a.ad.localeCompare(b.ad, 'tr'); });
  }
  const dlGiyili = function (u) { return u.id && (S.giyiliMi(u.id) || (S.altTur(u) === 'emote' && cark().indexOf(u.id) >= 0)); };
  function dlGrid(tur) {
    const L = sahipler(tur);
    if (!L.length) return bosHtml({ ikon: 'kutu', baslik: tur === 'kiyafet' ? 'Henüz kıyafetin yok' : 'Bu sekmede henüz bir şeyin yok.', metin: 'Pazar\'dan alınan eşyalar burada görünür; giydiğinde avatarın ve Profil anında güncellenir.', buton: { ad: "Pazar'a git", aksiyon: 'dl-pazar', sinif: 'btn-altin' } });
    return '<div class="dl-izgara" role="group" aria-label="' + (tur === 'emote' ? 'Emote' : tur === 'kiyafet' ? 'Kıyafet' : 'Aksesuar') + ' listesi">' + L.map(function (u) {
      const giy = dlGiyili(u);
      return S.kart(u, { eylem: 'dl-sec', secili: DL.sec === u.id, boyut: 84, alt: giy ? '<span class="urun-durum nane">' + ikon('test-gecti', 16) + (tur === 'emote' ? 'Çarkta' : 'Giyili') + '</span>' : '<span class="urun-durum gri">' + (u.ucretsiz ? 'Ücretsiz' : 'Sende var') + '</span>', aria: u.ad + ', ' + u.nadirlik + (giy ? ', giyili' : '') });
    }).join('') + '</div>';
  }
  function dlNisan() {
    const R2 = (S.veri().rozetler) || [], kz = S.rozetIdler(), secili = state.giyili.nisan || null;
    const ust = kz.length ? '' : '<div class="dl-nisan-not">' + ikon('muhur', 22) + '<p><b>Nişanlar satın alınmaz, kazanılır.</b> İlk hedefin: Keskin Göz.</p><button type="button" class="btn btn-kucuk btn-hayalet" data-action="dl-demo-nisan">Demo: Keskin Göz Nişanı ver</button></div>';
    return ust + '<div class="dl-nisanlar">' + R2.map(function (r) {
      const k = kz.indexOf(r.id) >= 0, s = secili === r.id;
      return '<div class="dl-nisan' + (k ? ' kazanildi' : '') + '"><span class="rozet rozet-buyuk ' + (k ? 'rozet-nisan' : 'rozet-kilitli') + '">' + ikon(r.ikon || 'madalya', 34) + '</span><div><b>' + esc(r.ad) + '</b><p class="mini soluk">' + esc(k ? r.aciklama : r.nasil) + '</p>' +
        (k ? '<button type="button" class="btn btn-kucuk ' + (s ? 'btn-basari' : 'btn-hayalet') + '" data-action="dl-nisan" data-id="' + esc(r.id) + '" aria-pressed="' + s + '">' + (s ? 'Etiketimde görünüyor' : 'Etiketimde göster') + '</button>' : '<span class="chip chip-gri">' + ikon('kilit', 14) + 'Kazanılmadı</span>') + '</p></div></div>';
    }).join('') + '</div>';
  }
  function dlGorunum() {
    const SE = AVATAR_SECENEK, av = state.avatar;
    const grup = function (ad, ozellik, liste, sw) {
      return '<fieldset class="dl-grup"><legend>' + ad + '</legend><div class="dl-sec-satir">' + liste.map(function (x, i) {
        const sel = Number(av[ozellik]) === i;
        return '<button type="button" class="dl-sw' + (sw ? ' dl-sw-renk' : '') + (sel ? ' secili' : '') + '" data-action="dl-gorunum" data-ozellik="' + ozellik + '" data-deger="' + i + '" aria-pressed="' + sel + '" aria-label="' + esc(ad + ': ' + x.ad) + '"' + (sw ? ' style="--sw:' + x.hex + '"' : '') + '>' + (sw ? '' : esc(x.ad)) + '</button>';
      }).join('') + '</div></fieldset>';
    };
    return '<p class="soluk">Yüz, saç ve vücut tipi burada ücretsiz ve sınırsız değişir.</p>' + grup('Ten', 'ten', SE.ten, true) + grup('Saç stili', 'sacStil', SE.sacStil, false) + grup('Saç rengi', 'sacRenk', SE.sacRenk, true);
  }
  function dlEmoteSekme() {
    const c = cark();
    const slot = []; for (let i = 0; i < 8; i++) {
      const id = c[i];
      slot.push(id ? '<button type="button" class="dl-slot dolu" data-action="dl-slot" data-i="' + i + '" aria-label="Yuva ' + (i + 1) + ': ' + esc((dlUrun(id) || {}).ad || id) + '. Çarktan çıkarmak için dokun"><i>' + (i + 1) + '</i>' + esc((dlUrun(id) || {}).ad || id) + ikon('carpi', 14) + '</button>' : '<span class="dl-slot bos" aria-label="Yuva ' + (i + 1) + ': boş"><i>' + (i + 1) + '</i>Boş yuva</span>');
    }
    return '<div class="dl-cark"><h3>Emote çarkı <span class="chip chip-gri">' + c.length + '/8</span></h3><div class="dl-slotlar">' + slot.join('') + '</div></div>' + dlGrid('emote');
  }
  function dlDetay() {
    const u = DL.sec ? dlUrun(DL.sec) : null;
    if (!u) return '<p class="soluk dl-detay-bos">Bir öğe seç: önizlemede anında görürsün. [Giy] dersen avatarın, HUD ve Profil güncellenir.</p>';
    const tur = S.altTur(u), giy = dlGiyili(u);
    let eylem;
    if (tur === 'emote') eylem = '<button type="button" class="btn ' + (giy ? 'btn-hayalet' : 'btn-birincil') + '" data-action="dl-emote-cark" data-urun="' + esc(u.id) + '">' + (giy ? 'Çarktan çıkar' : 'Çarka ekle') + '</button>';
    else if (tur === 'prop') eylem = '<button type="button" class="btn btn-birincil" data-action="dl-oda" data-urun="' + esc(u.id) + '">Odaya yerleştir</button>';
    else eylem = '<button type="button" class="btn ' + (giy ? 'btn-hayalet' : 'btn-birincil') + '" data-action="dl-giy" data-urun="' + esc(u.id) + '">' + (giy ? 'Çıkar' : 'Giy') + '</button>';
    const kaynak = u.ucretsiz ? 'Ücretsiz emote' : u.nadirlik === 'Nişan' ? 'Nişan: kazanıldı' : "Pazar'dan alındı";
    return '<div class="dl-detay-ust"><div><h3>' + esc(u.ad) + '</h3><div class="sira-s">' + S.nadRozet(u) + chipHtml(S.katYazi(u), 'gri') + (giy ? chipHtml(tur === 'emote' ? 'Çarkta' : 'Giyili', 'nane', 'tik') : '') + '</div><p class="mini soluk">' + esc(kaynak) + '</p></div><div class="sira-s">' + eylem + (u.ucretsiz ? '' : '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="dl-pazarda" data-urun="' + esc(u.id) + '">Pazar\'da gör</button>') + '</div></div>';
  }
  function dlCiz(root) {
    const g = S.giyiliDurum();
    let onizU = DL.sec && DL.sekme !== 'nisan' && DL.sekme !== 'gorunum' ? dlUrun(DL.sec) : null;
    const t = onizU ? S.onizAvatar(onizU) : { av: S.avBaz(), emote: '' };
    const giyilenAd = []; if (g.kiyafet) giyilenAd.push((urunBul(g.kiyafet) || {}).ad); g.aksesuarlar.forEach(function (p) { giyilenAd.push((urunBul(p) || {}).ad); });
    const onizDurum = onizU && !dlGiyili(onizU) ? 'Önizleme: ' + onizU.ad + ' (henüz giymedin)' : 'Şu an giydiklerin';
    const icerik = DL.sekme === 'emote' ? dlEmoteSekme() : DL.sekme === 'nisan' ? dlNisan() : DL.sekme === 'gorunum' ? dlGorunum() : dlGrid(DL.sekme);
    root.innerHTML = '<div class="sayfa sayfa-genis dl-sayfa"><div class="sayfa-baslik"><h1>Dolap</h1>' + chipHtml(sahipler('kiyafet').length + sahipler('aksesuar').length + ' parça', 'gri', 'kutu') + '</div><div class="dl-duzen">' +
      '<section class="kart dl-sahne" aria-label="Avatar önizleme"><div class="dl-av av-sahne" role="img" aria-label="' + esc(avatarTarif(t.av)) + '">' + avatarSvg(t.av, { boyut: 250, kadraj: 'tam', emote: t.emote, yon: DL.yon, aria: avatarTarif(t.av) }) + '</div><p class="dl-onizdurum" role="status">' + esc(onizDurum) + '</p>' +
      '<div class="sira-s dl-yon"><button type="button" class="btn btn-kucuk btn-ikon btn-hayalet" data-action="dl-yon" data-yon="sol" aria-label="Sola dön">' + ikon('ok-sol', 18) + '</button><button type="button" class="btn btn-kucuk btn-ikon btn-hayalet" data-action="dl-yon" data-yon="" aria-label="Sağa dön">' + ikon('ok-sag', 18) + '</button></div>' +
      '<p class="mini soluk dl-giyilen">' + (giyilenAd.length ? 'Giyili: ' + esc(giyilenAd.filter(Boolean).join(', ')) : 'Üzerinde satın alınan bir parça yok.') + (g.nisan ? ' · Etiket Nişan\'ı: ' + esc(((S.veri().rozetler || []).filter(function (r) { return r.id === g.nisan; })[0] || {}).ad || '') : '') + '</p>' +
      '<div class="sira-s"><button type="button" class="btn btn-kucuk" data-action="dl-sifirla">Sıfırla</button><button type="button" class="btn btn-kucuk btn-mor" data-action="dl-rastgele">Rastgele</button></div></section>' +
      '<section class="dl-sag"><div class="sekmeler sekmeler-kaydir" role="tablist" aria-label="Dolap sekmeleri">' + DL_SEKME.map(function (s) { return '<button type="button" role="tab" id="dl-sekme-' + s[0] + '" class="sekme" aria-selected="' + (DL.sekme === s[0]) + '" data-action="dl-sekme" data-sekme="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="dl-icerik" role="tabpanel">' + icerik + '</div>' + (DL.sekme === 'nisan' || DL.sekme === 'gorunum' ? '' : '<div class="kart dl-detay" aria-live="polite">' + dlDetay() + '</div>') + '</section></div></div>';
  }
  KK_UI.screen('dolap', {
    ad: 'Dolap', hud: true,
    render(root, ctx) {
      root.classList.add('scr-sosyal');
      if (ctx.ilk) {
        const p = ctx.parametre || {};
        DL.sec = null; DL.yon = 'sol';
        if (p.sec) { const u = dlUrun(p.sec); if (u && S.sahip(u.id)) { DL.sec = u.id; const t = S.altTur(u); DL.sekme = t === 'kiyafet' ? 'kiyafet' : t === 'emote' ? 'emote' : t === 'aksesuar' ? 'aksesuar' : DL.sekme; } }
      }
      try { dlCiz(root); } catch (e) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Dolap yüklenemedi.', { baslik: 'Dolap açılamadı', tekrar: 'dl-yenile' }) + '</div>'; KK_UI.hataKaydet(e, 'dolap'); }
    },
    actions: {
      'dl-yenile': function () { refresh(); },
      'dl-pazar': function () { go('pazar'); },
      'dl-sekme': function (el) { DL.sekme = el.getAttribute('data-sekme'); DL.sec = null; refresh(); },
      'dl-sec': function (el) { DL.sec = el.getAttribute('data-urun'); refresh(); },
      'dl-yon': function (el) { DL.yon = el.getAttribute('data-yon') || ''; refresh(); },
      'dl-giy': function (el) {
        const u = urunBul(el.getAttribute('data-urun') || DL.sec); if (!u) return;
        if (S.giyiliMi(u.id)) { S.cikar(u); toast(u.ad + ' çıkarıldı.', 'bilgi'); }
        else if (S.giy(u)) toast(u.ad + ' giyildi. Avatarın ve Profil güncellendi.', 'basari');
        refresh();
      },
      'dl-emote-cark': function (el) {
        const id = el.getAttribute('data-urun'), g = S.giyiliDurum(), c = cark();
        if (c.indexOf(id) >= 0) { g.emote = c.filter(function (x) { return x !== id; }); toast('Emote çarktan çıkarıldı.', 'bilgi'); }
        else if (c.length >= 8) { toast('Çark dolu (8/8). Önce bir yuvayı boşalt.', 'uyari'); return; }
        else { g.emote = c.concat([id]); toast('Emote çarka eklendi: yuva ' + g.emote.length + '.', 'basari'); }
        S.kaydet('Kaydedilemedi, tekrar dene.'); refresh();
      },
      'dl-slot': function (el) { const i = Number(el.getAttribute('data-i')), g = S.giyiliDurum(), c = cark(); c.splice(i, 1); g.emote = c; if (!c.length) g.emote = []; S.kaydet(); refresh(); },
      'dl-nisan': function (el) { const g = S.giyiliDurum(), id = el.getAttribute('data-id'); g.nisan = g.nisan === id ? null : id; S.kaydet(); toast(g.nisan ? 'Nişan isim etiketinde görünecek.' : 'Nişan etiketten kaldırıldı.', 'basari'); refresh(); },
      'dl-demo-nisan': function () { if (S.rozetIdler().indexOf('keskin-goz') < 0) state.rozetler.push('keskin-goz'); S.kaydet(); toast('Demo: Keskin Göz Nişanı eklendi. Altın çerçeveyi görebilirsin.', 'basari'); refresh(); },
      'dl-gorunum': function (el) { state.avatar[el.getAttribute('data-ozellik')] = Number(el.getAttribute('data-deger')); if (S.giyiliDurum().kiyafet) { /* giyili kıyafet korunur */ } S.kaydet(); hud(); refresh(); },
      'dl-oda': function (el) { go('oda', { parametre: { duzenle: true, sec: el.getAttribute('data-urun') } }); },
      'dl-pazarda': function (el) { go('pazar', { parametre: { urun: el.getAttribute('data-urun') } }); },
      'dl-sifirla': function () {
        const g = S.giyiliDurum();
        g.aksesuarlar.slice().forEach(function (p) { const u = urunBul(p); if (u) S.cikar(u); });
        if (g.kiyafet) { const u = urunBul(g.kiyafet); if (u) S.cikar(u); }
        g.emote = []; DL.sec = null; S.kaydet(); hud(); toast('Dolap sıfırlandı: parçalar envanterde duruyor.', 'bilgi'); refresh();
      },
      'dl-rastgele': function () {
        const k = sahipler('kiyafet'), a = sahipler('aksesuar');
        if (!k.length && !a.length) { toast('Rastgele denemek için önce Pazar\'dan bir şey almalısın.', 'bilgi'); return; }
        if (k.length) S.giy(k[Math.floor(Math.random() * k.length)]);
        const alt = a.filter(function () { return Math.random() < 0.6; }); alt.forEach(function (u) { S.giy(u); });
        toast('Rastgele bir görünüm giydin.', 'basari'); refresh();
      }
    },
    async selftest(root, ctx) {
      let u = S.urunler().filter(function (x) { return (S.altTur(x) === 'aksesuar' || S.altTur(x) === 'kiyafet') && S.sahip(x.id); })[0];
      if (!u) { u = S.urunler().filter(function (x) { return S.altTur(x) === 'aksesuar' && x.para === 'bayt'; })[0]; if (!u) throw new Error('giyilebilir ürün yok'); state.envanter.push(u.id); save(); }
      const tur = S.altTur(u);
      DL.sekme = tur === 'kiyafet' ? 'kiyafet' : 'aksesuar'; DL.sec = null; refresh();
      await ctx.tikla('[data-action="dl-sec"][data-urun="' + u.id + '"]');
      await ctx.tikla('[data-action="dl-giy"]');
      const a = u.onizleme.anahtar;
      if (tur === 'aksesuar' && state.avatar.aksesuar.indexOf(a) < 0) throw new Error('aksesuar avatara giydirilmedi: ' + a);
      if (tur === 'kiyafet' && state.giyili.kiyafet !== u.id) throw new Error('kıyafet giyilmedi');
      if (!S.giyiliMi(u.id)) throw new Error('giyili durumu yazılmadı');
      await ctx.tikla('[data-action="dl-giy"]');
      if (S.giyiliMi(u.id)) throw new Error('çıkar çalışmadı');
      await ctx.tikla('#dl-sekme-nisan');
      if (!/Nişanlar satın alınmaz/.test(ctx.metin('.dl-icerik'))) throw new Error('Nişan boş durumu eksik');
    }
  });
})();
