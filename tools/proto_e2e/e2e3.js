/* Entegrasyon testi 3: AI arayuz yollari (Durdur, invalid_json), 15-17 guvenli mod (KANON v2 §12.2), Tapu bakiye ipucu */
(async function () {
  const out = [];
  const log = function (k, ok, d) { out.push((ok ? 'OK   ' : 'FAIL ') + k + (d ? ' :: ' + d : '')); };
  const T = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const root = document.getElementById('screen');
  const ctx = function () { return ekranBaglami(KK_UI.mevcut, root, {}); };
  const adim = async function (ad, fn) {
    const h0 = KK_UI.hatalar.length;
    try { await fn(); const yeni = KK_UI.hatalar.slice(h0); if (yeni.length) log(ad, false, 'betik hatasi: ' + yeni[0].mesaj); else log(ad, true); }
    catch (e) { log(ad, false, String((e && e.message) || e)); }
    try { KK_UI.modalTemizle(); } catch (x) { /* yoksa */ }
  };
  const git = async function (t) { go(t); await T(250); if (KK_UI.mevcut !== t) throw new Error('go(' + t + ') sonrasi ekran ' + KK_UI.mevcut); };
  const $q = function (s) { return document.querySelector(s); };
  const metin = function () { return root.textContent.replace(/\s+/g, ' '); };
  KK_UI.hizliMod = true;
  sifirla(); hizliKurulum();
  const cevap = { puan: 80, olcutler: [{ ad: 'Doğruluk', puan: 40, not: 'a' }, { ad: 'Tamlık', puan: 24, not: 'b' }, { ad: 'Açıklık', puan: 16, not: 'c' }], geri_bildirim: '{ad}, iyi gidiyorsun.', takip_sorusu: '', guven: 0.9, kopya_suphesi: false };
  const uzun = 'Fonksiyon bir tarif kartı gibidir: ad, parametre ve dönüş türü sözleşmeyi oluşturur; imza ne aldığını ve ne verdiğini söyler.';

  await adim('kurul + Claude: bekleme -> Durdur (AbortController) -> arayuz toparlanir, XP yok', async function () {
    await git('kurul'); const x0 = state.xp, ac = []; ai.fn = { json: function (p, o) { ac.push(o); return new Promise(function (res, rej) { o.signal.addEventListener('abort', function () { rej({ code: 'cancelled' }); }); setTimeout(function () { res(cevap); }, 60000); }); } }; ai.durum = 'bagli';
    const ta = $q('#kurul-cevap'); if (!ta) throw new Error('#kurul-cevap yok'); await ctx().yaz(ta, uzun); await ctx().tikla('[data-action="gonder"]');
    await ctx().bekleSecici('[data-action="durdur"]', 3000); if (!/değerlendiriyor/i.test(metin())) throw new Error('"Kurul degerlendiriyor" metni yok');
    if (ac.length !== 1 || !(ac[0].signal instanceof AbortSignal) || ac[0].cache !== false) throw new Error('cagri secenekleri');
    await ctx().tikla('[data-action="durdur"]'); await T(300);
    if ($q('.kurul-karti')) throw new Error('durdurunca sonuc karti cikti'); if (state.xp !== x0) throw new Error('durdurunca XP degisti');
    const ta2 = $q('#kurul-cevap'); if (!ta2 || ta2.value.length < 20) throw new Error('cevap metni kayboldu'); const g = $q('[data-action="gonder"]'); if (!g || g.disabled) throw new Error('Gonder yeniden etkin degil');
    if (ac.length !== 1) throw new Error('otomatik yeniden deneme: ' + ac.length);
  });
  await adim('kurul + Claude basarili: puan karti kaynak "Claude", {ad} adla degisir', async function () {
    await git('kurul'); const x0 = state.xp; ai.fn = { json: async function () { return cevap; } }; ai.durum = 'bagli';
    await ctx().yaz('#kurul-cevap', uzun); await ctx().tikla('[data-action="gonder"]'); await ctx().bekleSecici('.kurul-karti', 4000); await T(300); KK_UI.modalTemizle();
    if (!/Claude/.test($q('.kurul-karti').textContent)) throw new Error('kaynak etiketi Claude degil'); if (/\{ad\}/.test(metin())) throw new Error('{ad} yer tutucusu degismedi'); if (state.xp <= x0) throw new Error('XP artmadi');
  });
  await adim('kurul + invalid_json: yedek puan + "Tekrar dene" yolu', async function () {
    sifirla(); hizliKurulum(); await git('kurul'); ai.fn = { json: async function () { throw { code: 'invalid_json' }; } }; ai.durum = 'bagli';
    await ctx().yaz('#kurul-cevap', uzun); await ctx().tikla('[data-action="gonder"]'); await T(500); KK_UI.modalTemizle();
    const t = metin(); if (!/Tekrar dene/i.test(t)) throw new Error('invalid_json icin "Tekrar dene" yok: ' + t.slice(0, 160));
  });
  await adim('atolye + rate_limited: testler yedekle calisir, toast', async function () {
    sifirla(); hizliKurulum(); await git('atolye'); ai.fn = { json: async function () { throw { code: 'rate_limited' }; } }; ai.durum = 'bagli';
    const g = KK_CORE.DATA.gorevler.filter(function (x) { return x.id === 'taksimetre'; })[0]; await ctx().bekleSecici('#atl-kod', 3000); await ctx().yaz('#atl-kod', g.editor.cozum); await ctx().tikla('[data-action="calistir"]'); await ctx().bekleSecici('.atl-basari, .test-satir', 5000); await T(400);
    if (!/yoğun/.test(document.getElementById('toast-root').textContent) && !/Çevrimdışı demo/.test(metin())) throw new Error('rate_limited toast/yedek etiketi yok');
  });
  ai.fn = null; ai.durum = 'cevrimdisi';

  /* ---- 15-17 guvenli mod (KANON v2 §12.2) ---- */
  const genc = function (veli) { sifirla(); hizliKurulum(); state.dogumYili = 2010; state.veli = { durum: veli, telefon: '5551112233' }; state.ayarlar.guvenliMod = true; state.ekran.giris = { yasBandi: '15-17', dogrulama: true, izin: {}, yasBekleme: null }; state.cip = 0; save(); };
  await adim('15-17 (veli onayi bekleniyor): Pazar Butik Cip harcamasi kapali, veli nedeni soylenir', async function () {
    genc('bekliyor'); await git('pazar'); await ctx().bekleSecici('#pz-sekme-butik', 3000); await ctx().tikla('#pz-sekme-butik'); await T(150);
    const t = metin(); if (!/veli/i.test(t)) throw new Error('Butik sayfasinda veli onayi/limit aciklamasi yok: ' + t.slice(0, 200));
    const urun = $q('[data-action="pz-sec"]'); if (urun) { urun.click(); await T(100); const al = $q('[data-action="pz-al"]'); if (al && !al.disabled && al.getAttribute('aria-disabled') !== 'true') { al.click(); await T(150); if (state.cip > 0 || /Satın al.*onay/i.test(document.querySelector('.modal') ? document.querySelector('.modal').textContent : '') && !/veli/i.test(document.querySelector('.modal').textContent)) throw new Error('15-17 icin Cip satin alma acik gorunuyor'); } }
    if (state.cip !== 0) throw new Error('Cip bakiyesi degisti');
  });
  await adim('15-17 (veli bekliyor): Sohbet serbest metin kapali / hazir cumle, DM kapali', async function () {
    genc('bekliyor'); await git('sohbet'); await T(200); const gir = $q('input[maxlength="200"], textarea[maxlength="200"], #sh-yaz, input[data-input="sh-yaz"]'); const t = metin();
    const serbestAcik = gir && !gir.disabled && gir.getAttribute('aria-disabled') !== 'true'; if (serbestAcik) throw new Error('serbest metin kutusu 15-17 (veli onaysiz) icin acik');
    if (!/hazır cümle/i.test(t) && !/Güvenli mod/i.test(t)) throw new Error('guvenli mod / hazir cumle metni yok');
  });
  await adim('15-17: Oda izni yalniz "Arkadaslara" (Herkese acik kapali)', async function () {
    genc('onayli'); await git('oda'); await T(200); const t = metin(); if (/Herkese açık/.test(t) && !/kapalı|hukuk|teyit/i.test(t)) throw new Error('Oda "Herkese acik" 15-17 icin gorunuyor: ' + (t.match(/.{40}Herkese açık.{40}/) || [''])[0]);
  });
  await adim('Ayarlar: veli durumu satiri ve Cip limiti 0 anlatimi', async function () {
    genc('bekliyor'); await git('ayarlar'); const b = Array.prototype.filter.call(document.querySelectorAll('button, [data-action]'), function (x) { return /Veli Durumu/.test(x.textContent); })[0]; if (!b) throw new Error('Veli Durumu sekmesi yok'); b.click(); await T(200);
    const t = metin(); if (!/limit 0|Çip.*0/i.test(t)) throw new Error('Cip limiti 0 anlatimi yok'); if (!/Onay bekleniyor/.test(t)) throw new Error('veli onayi rozeti yok');
  });
  await adim('sokak: Bayt yetersizse eksik tutar ve yol soylenir', async function () {
    sifirla(); hizliKurulum(); state.ruhsat.otopark = 3; state.bayt = 180; save(); await git('sokak'); await T(200); const t = metin();
    if (!/120 B|180/.test(t)) throw new Error('eksik Bayt tutari gorunmuyor: ' + t.slice(0, 260)); if (!/Günlük Tekrar|Bayt kazan|Hata Bildirimi|Meydan Sorusu|görev/i.test(t)) throw new Error('Bayt kazanma yolu soylenmiyor');
  });
  const pre = document.createElement('pre'); pre.id = 'e2e-out'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
})();
