/* Entegrasyon testi 7: XSS (takma ad, sohbet, serbest cevap, kod, arkadas ekle -> kacissiz innerHTML YOK), Pazar yetersiz bakiye, 15-17 Cip kapali, Sozlesme Karti / Hasan Abi istegi = KANON §5.1 */
(async function () {
  const out = [];
  const log = function (k, ok, d) { out.push((ok ? 'OK   ' : 'FAIL ') + k + (d ? ' :: ' + d : '')); };
  const T = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const root = document.getElementById('screen');
  const ctx = function () { return ekranBaglami(KK_UI.mevcut, root, {}); };
  const $q = function (s) { return document.querySelector(s); };
  const $$q = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  const metin = function () { return root.textContent.replace(/\s+/g, ' '); };
  const adim = async function (ad, fn) {
    const h0 = KK_UI.hatalar.length;
    try { await fn(); const yeni = KK_UI.hatalar.slice(h0); if (yeni.length) log(ad, false, 'betik hatasi: ' + yeni[0].mesaj); else log(ad, true); }
    catch (e) { log(ad, false, String((e && e.message) || e)); }
    try { KK_UI.modalTemizle(); } catch (x) { /* yoksa */ }
  };
  const git = async function (t) { go(t); await T(220); if (KK_UI.mevcut !== t) throw new Error('go(' + t + ') sonrasi ekran ' + KK_UI.mevcut); };
  const bas = function () { sifirla(); hizliKurulum(); };
  KK_UI.hizliMod = true;

  /* ---------------- XSS ---------------- */
  const P1 = '<img src=x onerror="window.__xss=(window.__xss||0)+1">', P2 = '"><svg onload="window.__xss=(window.__xss||0)+1"></svg>', P3 = '<' + 'script>window.__xss=(window.__xss||0)+1<' + '/script>';
  const PAYLOAD = P1 + P2 + P3;
  const tara = async function (nerede) {
    await T(250);
    if (window.__xss) throw new Error(nerede + ': kullanici girdisi CALISTI (window.__xss=' + window.__xss + ')');
    const kotu = $$q('#app img[src="x"], #app [onerror*="__xss"], #app [onload*="__xss"], #app script');
    if (kotu.length) throw new Error(nerede + ': enjekte DOM: ' + kotu[0].outerHTML.slice(0, 90));
  };
  const tokenlar = Object.keys(KK_UI.ekranlar).filter(function (t) { return t !== 'galeri'; });
  await adim('XSS: takma ad "' + P1.slice(0, 18) + '…" tum ' + tokenlar.length + ' ekranda ve HUD\'da metin olarak gorunur', async function () {
    bas(); state.ad = PAYLOAD; save(); for (let i = 0; i < tokenlar.length; i++) { go(tokenlar[i]); await T(150); KK_UI.modalTemizle(); await tara('ekran ' + tokenlar[i]); }
  });
  await adim('XSS: avatar ekraninda takma ad girdisi (av-ad)', async function () {
    bas(); await git('avatar'); const g = $q('[data-input="av-ad"]'); if (!g) throw new Error('av-ad girdisi yok'); await ctx().yaz(g, PAYLOAD); await tara('avatar'); await git('meydan'); await tara('meydan (takma ad sonrasi)'); await git('profil'); await tara('profil');
  });
  await adim('XSS: Sohbet serbest metin + Arkadas ekle', async function () {
    bas(); state.dogumYili = 1995; state.ayarlar.guvenliMod = false; save(); await git('sohbet'); await T(150);
    const gir = $q('[data-input="sh-yaz"]'); if (!gir) throw new Error('sohbet yazma kutusu yok'); await ctx().yaz(gir, PAYLOAD); const f = gir.closest('form'); if (!f) throw new Error('form yok'); f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await T(300); await tara('sohbet mesaji');
    const f2 = $q('form[data-submit="sh-arkadas-ekle"]'); if (f2) { const i2 = f2.querySelector('input'); if (i2) { await ctx().yaz(i2, PAYLOAD); f2.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await T(300); await tara('arkadas ekle'); } }
    const t = metin(); log('   (bilgi) sohbet mesaji metin olarak gorunuyor mu', true, /<img src=x/.test(t) ? 'evet, kacisli' : 'gorunmuyor (temizlenmis/reddedilmis)');
  });
  await adim('XSS: Kurul serbest cevap + sonuc karti', async function () {
    bas(); await git('kurul'); await ctx().yaz('#kurul-cevap', PAYLOAD + ' imza parametre donus turu sozlesme'); await ctx().tikla('[data-action="gonder"]'); await ctx().bekleSecici('.kurul-karti', 4000); await T(500); KK_UI.modalTemizle(); await tara('kurul sonuc karti');
  });
  await adim('XSS: kod girdisi — Atolye editoru', async function () {
    bas(); state.ruhsat.otopark = 3; save(); await git('atolye'); await ctx().bekleSecici('#atl-kod', 3000); await ctx().yaz('#atl-kod', '// ' + PAYLOAD + '\npublic static int X(){ return 1; }'); await ctx().tikla('[data-action="calistir"]'); await T(900); KK_UI.modalTemizle(); await tara('atolye kod');
  });
  const kodTokenlari = ['is-emri', 'editor', 'savunma', 'panel', 'vitrin', 'sokak'];
  for (let i = 0; i < kodTokenlari.length; i++) {
    await adim('XSS: ekran ' + kodTokenlari[i] + ' — isletmeler.otopark.kod icinde ham HTML', async function () {
      bas(); state.ruhsat.otopark = 3; const o = state.isletmeler.otopark; o.durum = 'deneme'; o.kod = '// ' + PAYLOAD + '\npublic static int UcretHesapla(int dakika) { return ' + JSON.stringify(PAYLOAD) + '.Length; }'; save();
      await git(kodTokenlari[i]); KK_UI.modalTemizle(); await tara('ekran ' + kodTokenlari[i]);
      const ta = $q('#screen textarea'); if (ta) { await ctx().yaz(ta, PAYLOAD + ' ' + PAYLOAD); await tara(kodTokenlari[i] + ' yazma kutusu'); }
    });
  }
  await adim('XSS: state\'te kullanici kaynakli listeler (envanter, rozet, oda, ziyaretci, ekran verisi) ham HTML ile bozulmaz', async function () {
    bas(); state.envanter = [PAYLOAD].concat(state.envanter); state.rozetler = [PAYLOAD]; state.oda.esyalar = [PAYLOAD]; state.oda.ziyaretci = [PAYLOAD]; state.giyili = { aksesuar: PAYLOAD, emote: [PAYLOAD] }; save();
    for (const t of ['dolap', 'oda', 'profil', 'pazar', 'ayarlar']) { go(t); await T(200); KK_UI.modalTemizle(); await tara('ekran ' + t + ' (envanter/rozet/oda)'); }
  });

  /* ---------------- Pazar yetersiz bakiye ---------------- */
  const magaza = KK_CORE.DATA.magaza, minB = Math.min.apply(null, magaza.filter(function (x) { return x.para === 'bayt' && x.fiyat > 0; }).map(function (x) { return x.fiyat; })), bedava = magaza.filter(function (x) { return x.para === 'bayt' && x.fiyat === 0; }).length, minC = Math.min.apply(null, magaza.filter(function (x) { return x.para === 'cip'; }).map(function (x) { return x.fiyat; }));
  const pazarDene = async function (sekme, ad, kural) {
    await git('pazar'); await T(100); if (sekme) { const t = $q(sekme); if (t) { t.click(); await T(150); } }
    const ids = $$q('[data-action="pz-sec"]').slice(0, 8).map(function (el) { return el.getAttribute('data-urun'); }).filter(Boolean); if (!ids.length) throw new Error(ad + ': urun karti yok'); let denendi = 0; const env0 = state.envanter.length;
    const act = KK_UI.ekranlar.pazar.actions['pz-al'];
    for (let i = 0; i < ids.length; i++) {
      /* 1) arayuz: dugme varsa zorlanmis tik; 2) her durumda eylemi dogrudan cagir (savunma derinligi: arayuz kapaliyken bile reddetmeli) */
      const kart = $$q('[data-action="pz-sec"]')[i]; if (kart) { kart.click(); await T(60); const al = $q('[data-action="pz-al"]'); if (al) { al.removeAttribute('disabled'); al.removeAttribute('aria-disabled'); al.click(); await T(100); const ev = $q('[data-veri="onayla-evet"], [data-veri="pz-onay"]'); if (ev) { ev.click(); await T(130); } KK_UI.modalTemizle(); } }
      act({ getAttribute: function (k) { return k === 'data-urun' ? ids[i] : null; } }, null); await T(100); const on = $q('[data-veri="pz-onay"]'); if (on) { on.click(); await T(150); } KK_UI.modalTemizle(); denendi++;
      if (!(state.bayt >= 0) || !(state.cip >= 0)) throw new Error(ad + ': bakiye eksiye dustu (bayt ' + state.bayt + ', cip ' + state.cip + ') urun ' + ids[i]);
      kural(i, env0);
    }
    return denendi;
  };
  await adim('Pazar: Bayt yetersizken (' + (minB - 1) + ' B < en ucuz ' + minB + ' B) zorlanmis satin alma reddedilir, bakiye eksiye dusmez, envanter ayni', async function () {
    bas(); state.bayt = minB - 1; state.cip = 0; save(); const b0 = state.bayt; const d = await pazarDene(null, 'bayt', function (i, env0) { if (state.bayt !== b0 || state.envanter.length - env0 > bedava) throw new Error('yetersiz Bayt ile urun alindi (#' + i + ', envanter ' + env0 + '->' + state.envanter.length + ', bayt ' + b0 + '->' + state.bayt + ')'); });
    if (!d) throw new Error('hic satin alma denenemedi');
  });
  await adim('Pazar: Cip yetersizken (0 Cip < en ucuz ' + minC + ') Butik satin alma reddedilir', async function () {
    bas(); state.cip = 0; state.bayt = 5000; save(); const c0 = state.cip; await pazarDene('#pz-sekme-butik', 'cip', function (i, env0) { if (state.cip !== c0) throw new Error('Cip degisti #' + i + ': ' + c0 + '->' + state.cip); if (state.cip < 0) throw new Error('Cip eksi'); });
  });
  /* ---------------- 15-17: Cip harcamasi kapali ---------------- */
  const genc = function (veli) { sifirla(); hizliKurulum(); state.dogumYili = new Date().getFullYear() - 16; state.veli = { durum: veli, telefon: '5551112233' }; state.ayarlar.guvenliMod = true; state.ekran.giris = { yasBandi: '15-17', dogrulama: true, izin: {}, yasBekleme: null }; state.cip = 500; save(); };
  const veliDurumlari = ['yok', 'bekliyor', 'onayli'];
  for (let i = 0; i < veliDurumlari.length; i++) {
    await adim('15-17 (veli ' + veliDurumlari[i] + '): 500 Cip varken Butik\'te zorlanmis satin alma Cip HARCAMAZ', async function () {
      genc(veliDurumlari[i]); await pazarDene('#pz-sekme-butik', 'butik/' + veliDurumlari[i], function (k) { if (state.cip !== 500) throw new Error('15-17 Cip harcandi #' + k + ': 500->' + state.cip); });
    });
  }

  /* ---------------- Sozlesme Karti / Hasan Abi = KANON §5.1 ---------------- */
  const nor = function (s) { return String(s || '').toLowerCase().replace(/[`*"“”«»'’]/g, '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim(); };
  const KANON_ISTEK = '2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum.';
  const KANON_MADDE = ['Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL',
    'Dilimi **ham kalış süresi** belirler: `dakika < 120` → 1. dilim; `120 ≤ dakika ≤ 360` → 2. dilim (sınırlar dâhil); `dakika > 360` → günlük',
    'Başlayan saat tam sayılır: `saat = ceil(dakika / 60)`; 1. dilim `saat × 100`, 2. dilim `saat × 40`',
    '24 saati aşan kalış: her **başlayan gün** 250 (`gun = ceil(dakika / 1440)`, `gun × 250`)',
    'İmza: `public static int Otopark.UcretHesapla(int dakika)`; dönüş TL, tam sayı',
    'Anomali (119 → 200, 120 → 80) müşterinin bilinçli kararıdır; fark eden oyuncu **Keskin Göz** (+50 XP)'];
  const OTO = KK_CORE.DATA.otopark;
  await adim('Otopark: hasanIstegi KANON §5.1 ile birebir (musteri alintisi)', async function () {
    if (nor(OTO.hasanIstegi).indexOf(nor(KANON_ISTEK)) < 0) throw new Error('fark: ' + OTO.hasanIstegi);
  });
  await adim('Otopark: Sozlesme Karti 6 madde KANON §5.1 ile ayni', async function () {
    if (!Array.isArray(OTO.sozlesme) || OTO.sozlesme.length !== 6) throw new Error('madde sayisi ' + (OTO.sozlesme && OTO.sozlesme.length));
    for (let i = 0; i < 6; i++) if (nor(OTO.sozlesme[i].kural) !== nor(KANON_MADDE[i])) throw new Error('madde ' + (i + 1) + ' farkli: [' + nor(OTO.sozlesme[i].kural) + '] <> [' + nor(KANON_MADDE[i]) + ']');
  });
  await adim('Otopark: 6 acik + 14 gizli test KANON tablosu ile ayni, otoparkUcret ayni', async function () {
    const A = [[30, 100], [61, 200], [120, 80], [121, 120], [361, 250], [1441, 500]], G = [[0, 0], [1, 100], [59, 100], [60, 100], [119, 200], [180, 120], [359, 240], [360, 240], [720, 250], [1439, 250], [1440, 250], [2880, 500], [2881, 750], [100000, 17500]];
    if (OTO.publicTestler.length !== 6) throw new Error('acik test sayisi ' + OTO.publicTestler.length); if (OTO.gizliTestler.length !== 14) throw new Error('gizli test sayisi ' + OTO.gizliTestler.length);
    A.forEach(function (a, i) { const t = OTO.publicTestler[i]; if (t.dakika !== a[0] || t.beklenen !== a[1]) throw new Error('acik test ' + i + ': ' + t.dakika + '->' + t.beklenen + ' (KANON ' + a[0] + '->' + a[1] + ')'); });
    G.forEach(function (a, i) { const t = OTO.gizliTestler[i]; if (t.dakika !== a[0] || t.beklenen !== a[1]) throw new Error('gizli test ' + i + ': ' + t.dakika + '->' + t.beklenen + ' (KANON ' + a[0] + '->' + a[1] + ')'); });
    A.concat(G).forEach(function (a) { if (KK_CORE.otoparkUcret(a[0]) !== a[1]) throw new Error('otoparkUcret(' + a[0] + ') = ' + KK_CORE.otoparkUcret(a[0]) + ', beklenen ' + a[1]); });
  });
  await adim('Otopark: Sozlesme Karti (6 madde) ve Hasan Abi alintisi ekranda gorunur (Is Emri / Editor / Sokak)', async function () {
    bas(); state.ruhsat.otopark = 3; state.isletmeler.otopark.durum = 'kapali'; state.isletmeler.otopark.netlestirme = { sorulanlar: OTO.netlestirmeSorulari.map(function (q) { return q.id; }), maddeler: [1, 2, 3, 4, 5, 6] }; save(); const bulunan = {};
    for (const t of ['is-emri', 'editor', 'sokak', 'savunma', 'panel']) { await git(t); KK_UI.modalTemizle(); const m = nor(root.textContent); bulunan[t] = OTO.sozlesme.filter(function (x) { return m.indexOf(nor(x.kural)) >= 0; }).length + (m.indexOf(nor(KANON_ISTEK)) >= 0 ? '+alinti' : ''); }
    const tam = Object.keys(bulunan).filter(function (t) { return bulunan[t] === '6+alinti'; }); log('   (bilgi) madde sayisi + alinti, ekran bazinda', true, JSON.stringify(bulunan));
    if (!tam.length) throw new Error('hicbir ekranda 6 madde + alinti birlikte yok: ' + JSON.stringify(bulunan));
  });
  await adim('Uzun metin: 300 karakterlik bosluksuz takma ad ve sohbet mesaji yatay tasma yapmaz', async function () {
    bas(); state.dogumYili = 1995; state.ayarlar.guvenliMod = false; save(); const uzun = 'W'.repeat(300);
    await git('avatar'); const g = $q('[data-input="av-ad"]'); if (!g) throw new Error('av-ad yok'); await ctx().yaz(g, uzun); await T(150); const adUz = state.ad.length;
    await git('sohbet'); const gir = $q('[data-input="sh-yaz"]'); if (gir) { await ctx().yaz(gir, uzun); gir.closest('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await T(250); }
    const tasma = []; for (const t of ['meydan', 'sohbet', 'profil', 'liderlik', 'ayarlar', 'avatar']) { await git(t); KK_UI.modalTemizle(); const de = document.documentElement; if (de.scrollWidth > window.innerWidth + 1 || root.scrollWidth > root.clientWidth + 1) tasma.push(t + ' ' + Math.max(de.scrollWidth, root.scrollWidth) + '>' + window.innerWidth); }
    if (tasma.length) throw new Error('yatay tasma: ' + tasma.join('; ') + ' (takma ad uzunlugu ' + adUz + ')');
  });
  const pre = document.createElement('pre'); pre.id = 'e2e-out'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
})();
