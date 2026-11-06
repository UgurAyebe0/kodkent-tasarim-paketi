/* ==== ui/30-ekran-dunya.js — Giriş akışı: giris, dil-sec, avatar (P5) ====
   Kaynak: KANON §6 + §12.2 (kayıt yaşı), B8 §6.1–6.3, B7 §11.1/§11.5, brief/02 §E.2.
   Akış: telefon (+90, maske) → KVKK → OTP (6 kutu, 90 sn, 60 sn'de yeniden gönder, saatte 5 deneme, demo kodu 123456) → doğum yılı
   → (<15: nazik ret + bekleme) → e-Devlet yaş doğrulama (demoda simüle) → (15–17: veli telefonu + "veli onayı bekleniyor") → dil-sec → avatar → meydan. */
(function () {
  const VERI = function () { return (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}; };
  const DEMO_KOD = '123456';
  const ID = function (id) { return document.getElementById(id); };
  const yazHtml = function (id, h) { const e = ID(id); if (e) e.innerHTML = h; return e; };
  const yazMetin = function (id, t) { const e = ID(id); if (e) e.textContent = t; return e; };
  const aktif = function (token) { return KK_UI.current() === token; };
  const mesgul = function (btn, metin) { if (!btn) return; btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.innerHTML = '<span class="donus" aria-hidden="true"></span><span>' + esc(metin) + '</span>'; };

  /* ---------- izometrik yardımcılar (marka sahnesi) ---------- */
  const nk = function (v) { return Math.round(v * 10) / 10; };
  function pt(og, gx, gy, z) { const p = iso.xy(gx, gy, 0, og); return [p.x, p.y - (z || 0)]; }
  function poli(nok, dolgu, ek) { return '<polygon points="' + nok.map(function (p) { return nk(p[0]) + ',' + nk(p[1]); }).join(' ') + '" fill="' + dolgu + '"' + (ek || '') + '/>'; }
  function solYuz(og, gx0, gx1, gy, z0, z1) { return [pt(og, gx0, gy, z0), pt(og, gx1, gy, z0), pt(og, gx1, gy, z1), pt(og, gx0, gy, z1)]; }
  function pencereler(og, gx, gy, w, d, h, tohum) {
    let s = '';
    for (let c = 0; c < w * 2; c++) for (let r = 0; (24 + r * 28 + 14) < h - 8; r++) {
      const yanik = ((c * 7 + r * 5 + tohum) % 4) !== 0, a = gx + c * 0.5 + 0.12, z0 = 22 + r * 28;
      s += poli(solYuz(og, a, a + 0.26, gy + d, z0, z0 + 14), yanik ? '#FFD27A' : '#2B3768', yanik ? ' opacity=".92"' : ' opacity=".8"');
    }
    return s;
  }
  function bina(og, gx, gy, w, d, h, renk, tohum) {
    return { gx: gx, gy: gy, w: w, d: d, svg: iso.blok(gx, gy, { w: w, d: d, h: h, renk: renk, orijin: og }) + pencereler(og, gx, gy, w, d, h, tohum || 0) };
  }
  function propOge(tur, gx, gy, og, opt) { const m = iso.PROP_META[tur] || { w: 1, d: 1 }; return { gx: gx, gy: gy, w: m.w, d: m.d, svg: iso.prop(tur, gx, gy, Object.assign({ orijin: og }, opt || {})) }; }
  function markaSahne() {
    const a = iso.alan(10, 7, { yukari: 170, kenar: 18 }), og = a.orijin;
    let zemin = iso.zemin(10, 7, ['#1B2550', '#202B5A'], { orijin: og });
    for (let gx = 0; gx < 10; gx++) zemin += iso.tile(gx, 5, '#141B3A', { orijin: og });
    let ray = '';
    [0.3, 0.7].forEach(function (k) { const p1 = pt(og, 0, 5 + k, 0), p2 = pt(og, 10, 5 + k, 0); ray += '<line x1="' + nk(p1[0]) + '" y1="' + nk(p1[1]) + '" x2="' + nk(p2[0]) + '" y2="' + nk(p2[1]) + '" stroke="#5B6A9C" stroke-width="1.6" opacity=".8"/>'; });
    const ogeler = [
      bina(og, 0, 0, 2, 2, 150, '#3B4F9E', 1), bina(og, 2, 0, 2, 2, 108, '#4F3F9A', 2), bina(og, 4, 0, 2, 2, 134, '#2F6D86', 3), bina(og, 6, 0, 2, 2, 96, '#7A4C8F', 4), bina(og, 8, 1, 2, 2, 74, '#3F5FA8', 5),
      propOge('cesme', 4, 3, og), propOge('agac', 1, 3, og), propOge('agac', 9, 6, og), propOge('lamba', 2, 6, og, { acik: true }), propOge('lamba', 7, 4, og, { acik: true }), propOge('bank', 6, 3, og), propOge('tabela', 8, 4, og, { etiket: 'KODKENT' })
    ];
    let yildiz = '';
    for (let i = 0; i < 34; i++) yildiz += '<circle cx="' + nk((i * 97 % 100) / 100 * a.genislik) + '" cy="' + nk(((i * 53 + 11) % 60) / 100 * a.yukseklik * 0.55) + '" r="' + (i % 5 === 0 ? 1.8 : 1) + '" fill="#E8EDF8" opacity="' + (0.35 + (i % 4) * 0.15) + '"/>';
    const tram = '<g class="gir-tram">' + iso.prop('tram', 0, 5, { orijin: og }) + '</g>';
    return '<svg class="gir-svg" viewBox="' + a.viewBox + '" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Gece şehri: tramvay Derleyici Meydanı yönünde ilerliyor">' +
      '<defs><linearGradient id="gir-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070B1C"/><stop offset=".75" stop-color="#16204A"/><stop offset="1" stop-color="#22306A"/></linearGradient></defs>' +
      '<rect width="100%" height="100%" fill="url(#gir-gok)"/>' + yildiz + '<circle cx="' + nk(a.genislik * 0.82) + '" cy="' + nk(a.yukseklik * 0.16) + '" r="22" fill="#F4EFE6" opacity=".92"/><circle cx="' + nk(a.genislik * 0.82 + 8) + '" cy="' + nk(a.yukseklik * 0.16 - 4) + '" r="20" fill="#0B1230"/>' +
      zemin + ray + iso.sirala(ogeler) + tram + '</svg>';
  }

  /* ================= 1) GİRİŞ ================= */
  const ADIM_ETIKET = { tel: 'Telefon', otp: 'Doğrulama kodu', yas: 'Doğum yılı', edevlet: 'Yaş doğrulama', veli: 'Veli onayı' };
  let G = null;
  function gSifirla() {
    G = { adim: 'tel', tel: '', kvkk: false, izin: { analitik: false, pazarlama: false, kalibrasyon: false }, gonderim: 0, kodBitis: 0, yenidenAcilis: 0, yanlis: 0, kilitli: false, yil: 0, bant: '', dogrulandi: false, veliGonderildi: false, bekleme: false, eposta: '', gen: 0 };
  }
  const telRakam = function (s) { let d = String(s || '').replace(/\D/g, ''); if (d.indexOf('90') === 0 && d.length > 10) d = d.slice(2); if (d.charAt(0) === '0') d = d.slice(1); return d.slice(0, 10); };
  const telMaske = function (d) { return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean).join(' '); };
  const telGecerli = function (d) { return /^5\d{9}$/.test(d); };
  const buYil = function () { return new Date().getFullYear(); };
  function alanHata(id, metin) { const e = ID(id); if (e) e.textContent = metin; const g = ID(id.replace(/-hata$/, '')); if (g) { g.classList.toggle('girdi-hata', !!metin); if (metin) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid'); } }
  function titret(el) { if (!el) return; el.classList.remove('gir-titre'); void el.offsetWidth; el.classList.add('gir-titre'); }

  function adimBasi() {
    const dizi = G.bant === '15-17' ? ['tel', 'otp', 'yas', 'edevlet', 'veli'] : ['tel', 'otp', 'yas', 'edevlet'], i = dizi.indexOf(G.adim);
    if (i < 0) return '';
    return '<div class="gir-adimlar" role="group" aria-label="Adım ' + (i + 1) + '/' + dizi.length + '"><span class="gir-adim-yazi">' + (i + 1) + '/' + dizi.length + ' · ' + ADIM_ETIKET[G.adim] + '</span><span class="gir-noktalar" aria-hidden="true">' +
      dizi.map(function (a, k) { return '<i class="' + (k < i ? 'bitti' : k === i ? 'su-an' : '') + '"></i>'; }).join('') + '</span></div>';
  }
  function telAdimi() {
    const M = (VERI().metinler || {}).kvkk || {}, aydinlatma = M.aydinlatma || 'KodKent, telefon numaranı yalnızca hesabını doğrulamak ve güvenliğini sağlamak için işler.';
    const izin = function (k, ad) { return '<label class="onay"><input type="checkbox" data-input="gir-izin" data-izin="' + k + '"' + (G.izin[k] ? ' checked' : '') + '><span class="onay-kutu"></span><span>' + ad + '</span></label>'; };
    return '<form class="gir-form" data-submit="gir-kod-gonder" novalidate>' +
      '<h2 class="gir-baslik">Şehre giriş</h2><p class="soluk">Şifre yok: telefon numaranla gir. Sana 6 haneli bir kod göndereceğiz.</p>' +
      '<div class="alan"><label class="etiket" for="gir-tel">Telefon numaran</label><div class="girdi-grup"><span class="girdi-onek" aria-hidden="true">+90</span>' +
      '<input id="gir-tel" class="girdi" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="5XX XXX XX XX" maxlength="13" value="' + esc(telMaske(G.tel)) + '" data-input="gir-tel" data-odak aria-describedby="gir-tel-hata"></div>' +
      '<div id="gir-tel-hata" class="hata-yazi" role="alert"></div></div>' +
      '<details class="gir-aydinlatma"><summary>Aydınlatma Metni ve Kullanım Koşulları (özet)</summary><p>' + esc(aydinlatma) + '</p>' +
      '<p>Kullanım Koşulları (özet): KodKent\'i 15 yaş ve üzeri kullanabilir. Hesabın sana aittir; başkalarının hesabına, kodlarına ya da kişisel verilerine zarar veremezsin. Bayt satılmaz; öğrenme hiçbir zaman paralı değildir.</p></details>' +
      '<label class="onay"><input type="checkbox" id="gir-kvkk" data-input="gir-kvkk"' + (G.kvkk ? ' checked' : '') + ' aria-describedby="gir-kvkk-hata"><span class="onay-kutu"></span><span>Aydınlatma Metni\'ni okudum, Kullanım Koşulları\'nı kabul ediyorum. <b>(Zorunlu)</b></span></label>' +
      '<div id="gir-kvkk-hata" class="hata-yazi" role="alert"></div>' +
      '<fieldset class="gir-izinler"><legend>İsteğe bağlı izinler (hepsi kapalı başlar)</legend>' + izin('analitik', 'Ürün analitiği: anonim kullanım ölçümü') + izin('pazarlama', 'Pazarlama iletileri') + izin('kalibrasyon', 'Yapay zekâ kalibrasyonu: cevaplarım puanlama kalitesini iyileştirmek için kullanılabilir') + '</fieldset>' +
      '<button type="submit" id="gir-gonder" class="btn btn-birincil btn-buyuk btn-blok">Kod Gönder</button>' +
      (state.kurulumTamam ? '<button type="button" class="btn btn-hayalet btn-blok" data-go="meydan">Kayıtlı oyuncuyum: Meydan\'a dön</button>' : '') + '</form>';
  }
  function otpAdimi() {
    const kalan = Math.max(0, 5 - G.gonderim);
    return '<div class="gir-form"><h2 class="gir-baslik">Kodu gir</h2><p class="soluk">+90 ' + esc(telMaske(G.tel)) + ' numarasına 6 haneli bir kod gönderdik. SMS gelmezse aşağıdan yeniden isteyebilirsin.</p>' +
      '<div class="gir-demo-not">' + ikon('bilgi', 16) + '<span>Demo: kod <b class="mono">' + DEMO_KOD + '</b></span></div>' +
      '<div class="alan"><label class="etiket" for="gir-otp-girdi">6 haneli doğrulama kodu</label><div class="otp gir-otp-kap" id="gir-otp-kap">' +
      [0, 1, 2, 3, 4, 5].map(function (i) { return '<span class="otp-kutu" data-i="' + i + '" aria-hidden="true"></span>'; }).join('') +
      '<input id="gir-otp-girdi" class="gir-otp-girdi" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" aria-label="6 haneli doğrulama kodu" data-input="gir-otp" data-odak' + (G.kilitli ? ' disabled' : '') + '></div></div>' +
      '<div id="gir-otp-hata" class="hata-yazi" role="alert">' + (G.kilitli ? 'Çok fazla deneme yaptın. 1 saat sonra tekrar deneyebilirsin.' : '') + '</div>' +
      '<div class="gir-sayac" id="gir-sayac" role="timer">Kod 01:30 geçerli</div>' +
      '<div class="sira"><button type="button" id="gir-tekrar" class="btn btn-hayalet btn-kucuk" data-action="gir-tekrar" disabled>Yeni kod için 60 saniye bekle</button><button type="button" class="btn btn-hayalet btn-kucuk" data-action="gir-geri">Numarayı değiştir</button></div>' +
      '<p class="ipucu-yazi">Saatte en çok 5 yanlış deneme hakkın var (kalan: <b id="gir-hak">' + Math.max(0, 5 - G.yanlis) + '</b>). Bu saat içinde ' + kalan + ' kod hakkın daha var.</p></div>';
  }
  function yasAdimi() {
    return '<form class="gir-form" data-submit="gir-yil-devam" novalidate><h2 class="gir-baslik">Doğum yılın</h2><p class="soluk">Yaşına uygun bir deneyim kurmak için soruyoruz. Yalnızca yaş eşiğini kullanırız; doğum yılın ve ayın saklanmaz.</p>' +
      '<div class="alan"><label class="etiket" for="gir-yil">Doğum yılın</label><input id="gir-yil" class="girdi" type="text" inputmode="numeric" autocomplete="bday-year" maxlength="4" placeholder="ör. 2008" value="' + (G.yil ? esc(G.yil) : '') + '" data-input="gir-yil" data-odak aria-describedby="gir-yil-hata">' +
      '<div id="gir-yil-hata" class="hata-yazi" role="alert"></div><div id="gir-yil-not" class="gir-yil-not" aria-live="polite"></div></div>' +
      '<button type="submit" class="btn btn-birincil btn-buyuk btn-blok">Devam</button></form>';
  }
  function retAdimi() {
    return '<div class="gir-form gir-ret"><div class="gir-ret-ik">' + ikon('kalp', 30) + '</div><h2 class="gir-baslik">Seni biraz sonra bekliyoruz</h2>' +
      '<p>KodKent 15 yaşından itibaren. Büyüyünce seni burada bekleriz. İstersen e-postanı bırak, kapıyı açınca haber verelim.</p>' +
      (G.bekleme ? '<div class="gir-basari">' + ikon('tik', 20) + '<span>Listeye yazıldın. Yaşın gelince <b>' + esc(G.eposta) + '</b> adresine haber vereceğiz.</span></div>' :
        '<form class="gir-form" data-submit="gir-bekleme" novalidate><div class="alan"><label class="etiket" for="gir-eposta">E-posta (tercihen veli e-postası)</label><input id="gir-eposta" class="girdi" type="email" inputmode="email" autocomplete="email" placeholder="ad@ornek.com" data-odak aria-describedby="gir-eposta-hata"><div id="gir-eposta-hata" class="hata-yazi" role="alert"></div>' +
        '<div class="ipucu-yazi">Yalnızca bu haber için kullanılır; pazarlama iletisi göndermeyiz. Telefon numaranı ve doğum yılını kaydetmedik.</div></div><button type="submit" class="btn btn-birincil btn-blok">Yaşım gelince haber verin</button></form>') +
      '<button type="button" class="btn btn-hayalet btn-blok" data-action="gir-basa">Başa dön</button></div>';
  }
  function edevletAdimi() {
    const hazir = G.dogrulandi, bantYazi = G.bant === '15-17' ? '15–17 yaş' : '18 yaş ve üzeri';
    return '<div class="gir-form"><h2 class="gir-baslik">Yaş doğrulama</h2>' +
      '<div class="gir-edevlet"><span class="gir-ik">' + ikon('kalkan', 28) + '</span><div><b>e-Devlet belirteci</b><p class="soluk kucuk">Hesap açılışında yalnızca yaş eşiği (15 ve 18) e-Devlet üzerinden doğrulanır. Ad, T.C. kimlik no ya da profil bilgisi KodKent\'e geçmez.</p></div></div>' +
      '<div class="gir-demo-not">' + ikon('bilgi', 16) + '<span>Demo: e-Devlet yaş doğrulaması simüle edildi; gerçek ürünün teknik şartnamesi netleşince bağlanır.</span></div>' +
      (hazir ? '<div class="gir-basari" role="status">' + ikon('tik', 20) + '<span>Eşik doğrulandı: <b>' + bantYazi + '</b>. Saklanan tek bilgi bu eşik ve doğrulama tarihidir.</span></div>' +
        '<button type="button" class="btn btn-birincil btn-buyuk btn-blok" data-action="gir-edevlet-devam" data-odak>Devam</button>' :
        '<button type="button" class="btn btn-birincil btn-buyuk btn-blok" data-action="gir-edevlet" data-odak>e-Devlet ile Doğrula</button>') + '</div>';
  }
  function veliAdimi() {
    const bekliyor = state.veli.durum === 'bekliyor', onayli = state.veli.durum === 'onayli';
    const rozet = onayli ? chipHtml('Veli onayladı', 'nane', 'tik') : chipHtml('Veli onayı bekleniyor (72 saat)', 'amber', 'saat');
    return '<div class="gir-form"><h2 class="gir-baslik">Veli onayı</h2><p class="soluk">15–17 yaşında hesap için velinin onayı gerekir. Velinin telefonuna 72 saat geçerli bir onay bağlantısı göndeririz.</p>' +
      ((bekliyor || onayli) && G.veliGonderildi ?
        '<div class="gir-veli-rozet">' + rozet + '<span class="kucuk soluk">+90 ' + esc((state.veli.telefon || '').replace(/^\+90 /, '')) + '</span></div>' +
        '<div class="gir-guvenli">' + ikon('kalkan', 22) + '<div><b>Güvenli mod açık</b><p class="kucuk">Oyun kilitsiz: ders, görev, işletme, lig ve Günlük Tekrar açık. Veli onaylayana kadar serbest metin sohbet, DM, ziyaret kabulü, Vitrin görünürlüğü ve Çip harcaması kapalı. Meydan sohbetinde hazır cümle ve emote kullanabilirsin.</p></div></div>' +
        '<button type="button" class="btn btn-birincil btn-buyuk btn-blok" data-action="gir-veli-devam" data-odak>Devam</button>' +
        (onayli ? '' : '<button type="button" class="btn btn-hayalet btn-blok" data-action="gir-veli-onay">Demo: veli onayını simüle et</button>') :
        '<form class="gir-form" data-submit="gir-veli-gonder" novalidate><div class="alan"><label class="etiket" for="gir-veli-tel">Veli telefonu</label><div class="girdi-grup"><span class="girdi-onek" aria-hidden="true">+90</span>' +
        '<input id="gir-veli-tel" class="girdi" type="tel" inputmode="tel" autocomplete="off" placeholder="5XX XXX XX XX" maxlength="13" data-input="gir-veli-tel" data-odak aria-describedby="gir-veli-hata"></div><div id="gir-veli-hata" class="hata-yazi" role="alert"></div>' +
        '<div class="ipucu-yazi">Senin numarandan farklı olmalı. SMS bağlantısı 72 saat geçerlidir.</div></div><button type="submit" class="btn btn-birincil btn-buyuk btn-blok">Veliye SMS Gönder</button></form>') + '</div>';
  }
  function otpHucre() {
    const g = ID('gir-otp-girdi'); if (!g) return;
    const v = g.value;
    Array.prototype.forEach.call(document.querySelectorAll('#gir-otp-kap .otp-kutu'), function (k, i) { k.textContent = v.charAt(i) || ''; k.classList.toggle('dolu', i < v.length); k.classList.toggle('aktif', i === Math.min(v.length, 5)); });
  }
  function otpTick() {
    const kalan = Math.max(0, Math.ceil((G.kodBitis - Date.now()) / 1000)), s = ID('gir-sayac');
    if (s) { s.textContent = kalan > 0 ? 'Kod ' + zamanKalan(kalan) + ' geçerli' : 'Kodun süresi doldu. Yeni kod iste.'; s.classList.toggle('son', kalan > 0 && kalan <= 10); s.classList.toggle('bitti', kalan === 0); }
    const t = ID('gir-tekrar'); if (t && !t.getAttribute('aria-busy')) { const bk = Math.max(0, Math.ceil((G.yenidenAcilis - Date.now()) / 1000)); t.disabled = bk > 0 || G.kilitli; t.textContent = bk > 0 ? 'Yeni kod için ' + bk + ' saniye bekle' : 'Kod gelmedi mi? Tekrar gönder'; }
  }
  function girisCiz(root, ctx) {
    if (!G) gSifirla();
    const govde = { tel: telAdimi, otp: otpAdimi, yas: yasAdimi, edevlet: edevletAdimi, veli: veliAdimi, ret: retAdimi }[G.adim]();
    root.innerHTML = '<div class="gir-kok"><aside class="gir-marka" aria-label="KodKent tanıtımı">' + markaSahne() +
      '<div class="gir-logo">' + ikon('logo', 46) + '<b>KodKent</b></div><div class="gir-slogan"><p class="gir-slogan-1">Oyunlarla yazılım öğreniyorum.</p><p class="gir-slogan-2">Kod yaz, şehrini kur.</p></div></aside>' +
      '<section class="gir-form-kap" aria-label="Giriş formu"><div class="kart gir-kart">' + adimBasi() + '<div class="gir-adim" data-adim="' + G.adim + '">' + govde + '</div></div></section></div>';
    if (G.adim === 'otp') { KK_UI.aralik(otpTick, 500); otpTick(); otpHucre(); }
    if (!ctx.ilk) { const o = root.querySelector('[data-odak]'); if (o && !o.disabled) { try { o.focus({ preventScroll: true }); } catch (e) { /* odak yok */ } } }
  }
  function adimGit(adim) { G.adim = adim; G.gen++; refresh(); }
  function yasBandiYaz() {
    state.telefon = '+90 ' + telMaske(G.tel); state.dogumYili = G.yil;
    state.ekran.giris = Object.assign({}, state.ekran.giris, { yasBandi: G.bant, dogrulama: new Date().toISOString().slice(0, 10), izin: Object.assign({}, G.izin) });
    state.ayarlar.guvenliMod = G.bant === '15-17';
    if (G.bant !== '15-17') state.veli = { durum: 'yok', telefon: '' };
    save();
  }
  const girisEylem = {
    'gir-tel': function (el) { const d = telRakam(el.value), m = telMaske(d); G.tel = d; if (el.value !== m) el.value = m; alanHata('gir-tel-hata', ''); },
    'gir-kvkk': function (el) { G.kvkk = !!el.checked; if (el.checked) yazMetin('gir-kvkk-hata', ''); },
    'gir-izin': function (el) { G.izin[el.getAttribute('data-izin')] = !!el.checked; },
    async 'gir-kod-gonder'(form) {
      const btn = ID('gir-gonder');
      if (navigator.onLine === false) { alanHata('gir-tel-hata', 'Giriş için internet gerekiyor. Bağlanınca tekrar dene.'); return; }
      if (!telGecerli(G.tel)) { alanHata('gir-tel-hata', 'Bu numara geçerli görünmüyor. Başında 0 olmadan 10 haneyi yaz.'); titret(ID('gir-tel')); return; }
      if (!G.kvkk) { yazMetin('gir-kvkk-hata', 'Devam etmek için Aydınlatma Metni ve Kullanım Koşulları onayı gerekir.'); return; }
      if (G.gonderim >= 5) { alanHata('gir-tel-hata', 'Çok fazla deneme yaptın. 1 saat sonra tekrar deneyebilirsin.'); return; }
      mesgul(btn, 'Kod gönderiliyor…'); const gen = ++G.gen; await bekle(700);
      if (gen !== G.gen || !aktif('giris')) return;
      G.gonderim++; G.kodBitis = Date.now() + 90000; G.yenidenAcilis = Date.now() + 60000; G.kilitli = G.yanlis >= 5; adimGit('otp');
    },
    async 'gir-otp'(el) {
      const v = el.value.replace(/\D/g, '').slice(0, 6); if (v !== el.value) el.value = v;
      otpHucre(); yazMetin('gir-otp-hata', '');
      if (v.length < 6) return;
      if (G.kilitli) { yazMetin('gir-otp-hata', 'Çok fazla deneme yaptın. 1 saat sonra tekrar deneyebilirsin.'); return; }
      if (Date.now() > G.kodBitis) { yazMetin('gir-otp-hata', 'Kodun süresi doldu. Yeni kod iste.'); el.value = ''; otpHucre(); titret(ID('gir-otp-kap')); return; }
      if (v === DEMO_KOD) {
        el.disabled = true; Array.prototype.forEach.call(document.querySelectorAll('#gir-otp-kap .otp-kutu'), function (k) { k.classList.add('tamam'); });
        yazHtml('gir-otp-hata', '<span class="gir-tik">' + ikon('tik', 22) + '</span> Kod doğrulandı');
        const gen = ++G.gen; await bekle(650);
        if (gen !== G.gen || !aktif('giris')) return;
        adimGit('yas');
      } else {
        G.yanlis++; const kalan = Math.max(0, 5 - G.yanlis); yazMetin('gir-hak', String(kalan));
        if (kalan === 0) { G.kilitli = true; el.disabled = true; yazMetin('gir-otp-hata', 'Çok fazla deneme yaptın. 1 saat sonra tekrar deneyebilirsin.'); }
        else yazMetin('gir-otp-hata', 'Kod yanlış. Bu saat içinde ' + kalan + ' hakkın kaldı.');
        el.value = ''; otpHucre(); titret(ID('gir-otp-kap'));
      }
    },
    async 'gir-tekrar'(el) {
      const bk = Math.ceil((G.yenidenAcilis - Date.now()) / 1000);
      if (G.gonderim >= 5) { yazMetin('gir-otp-hata', 'Çok fazla deneme yaptın. 1 saat sonra tekrar deneyebilirsin.'); return; }
      if (bk > 0) { yazMetin('gir-otp-hata', 'Yeni kod için ' + bk + ' saniye beklemelisin.'); return; }
      mesgul(el, 'Gönderiliyor…'); const gen = ++G.gen; await bekle(500);
      if (gen !== G.gen || !aktif('giris')) return;
      G.gonderim++; G.kodBitis = Date.now() + 90000; G.yenidenAcilis = Date.now() + 60000; toast('Yeni kod gönderildi. Demo: ' + DEMO_KOD, 'bilgi'); refresh();
    },
    'gir-geri': function () { adimGit('tel'); },
    'gir-basa': function () { gSifirla(); refresh(); },
    'gir-yil': function (el) {
      const v = el.value.replace(/\D/g, '').slice(0, 4); if (v !== el.value) el.value = v; alanHata('gir-yil-hata', '');
      const yas = buYil() - Number(v); let not = '';
      if (v.length === 4 && yas >= 15 && yas <= 17) not = chipHtml('15–17 yaş: güvenli mod ve veli onayı gerekir', 'amber', 'kalkan');
      else if (v.length === 4 && yas >= 18 && yas < 110) not = chipHtml('18 yaş ve üzeri: tam hizmet', 'nane', 'tik');
      yazHtml('gir-yil-not', not);
    },
    'gir-yil-devam': function () {
      const el = ID('gir-yil'), yil = Number(el ? el.value : 0), yas = buYil() - yil;
      if (!el || !/^\d{4}$/.test(el.value) || yil < 1920 || yil > buYil()) { alanHata('gir-yil-hata', 'Geçerli bir doğum yılı yaz (ör. 2008).'); titret(el); return; }
      if (yas < 15) { G.tel = ''; G.yil = 0; G.bant = 'lt15'; state.telefon = ''; state.dogumYili = 0; state.kurulumTamam = false; G.adim = 'ret'; G.gen++; refresh(); return; }
      G.yil = yil; G.bant = yas <= 17 ? '15-17' : '18+'; adimGit('edevlet');
    },
    'gir-bekleme': function () {
      const el = ID('gir-eposta'), v = (el ? el.value : '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { alanHata('gir-eposta-hata', 'Geçerli bir e-posta adresi yaz ya da bu adımı atlayıp başa dön.'); titret(el); return; }
      G.bekleme = true; G.eposta = v; state.ekran.giris = Object.assign({}, state.ekran.giris, { yasBekleme: { eposta: v } }); save();
      toast('Listeye yazıldın. Yaşın gelince haber vereceğiz.', 'basari'); refresh();
    },
    async 'gir-edevlet'(el) {
      mesgul(el, 'e-Devlet\'e bağlanılıyor…'); const gen = ++G.gen; await bekle(900);
      if (gen !== G.gen || !aktif('giris')) return;
      G.dogrulandi = true; yasBandiYaz(); refresh();
    },
    'gir-edevlet-devam': function () { if (G.bant === '15-17') adimGit('veli'); else go('dil-sec'); },
    'gir-veli-tel': function (el) { const d = telRakam(el.value), m = telMaske(d); if (el.value !== m) el.value = m; alanHata('gir-veli-hata', ''); },
    async 'gir-veli-gonder'() {
      const el = ID('gir-veli-tel'), d = telRakam(el ? el.value : '');
      if (!telGecerli(d)) { alanHata('gir-veli-hata', 'Bu numara geçerli görünmüyor. Başında 0 olmadan 10 haneyi yaz.'); titret(el); return; }
      if (d === G.tel) { alanHata('gir-veli-hata', 'Veli numarası senin numaranla aynı olamaz.'); titret(el); return; }
      const btn = document.querySelector('.gir-adim button[type="submit"]'); mesgul(btn, 'SMS gönderiliyor…'); const gen = ++G.gen; await bekle(700);
      if (gen !== G.gen || !aktif('giris')) return;
      state.veli = { durum: 'bekliyor', telefon: '+90 ' + telMaske(d) }; state.ayarlar.guvenliMod = true; G.veliGonderildi = true; save(); toast('Veli onay bağlantısı gönderildi.', 'basari'); refresh();
    },
    'gir-veli-onay': function () { state.veli.durum = 'onayli'; save(); toast('Demo: veli onayı verildi. Kısıtlar veli kontrollerine göre açılır.', 'basari'); refresh(); },
    'gir-veli-devam': function () { go('dil-sec'); }
  };
  KK_UI.screen('giris', {
    ad: 'Giriş', hud: false,
    render(root, ctx) { if (ctx.ilk) gSifirla(); girisCiz(root, ctx); },
    actions: girisEylem,
    leave() { /* zamanlayıcılar KK_UI.aralik ile kendiliğinden temizlenir */ },
    async selftest(root, ctx) {
      state.kurulumTamam = false;
      // 1) telefon + KVKK: geçersiz numara ve onaysız deneme neden söylemeli
      await ctx.yaz('#gir-tel', '0532 111 22 33');
      if (ctx.metin('#gir-tel') !== '532 111 22 33') throw new Error('telefon maskesi yanlış: ' + ctx.metin('#gir-tel'));
      await ctx.tikla('#gir-gonder');
      if (!/Aydınlatma/.test(ctx.metin('#gir-kvkk-hata'))) throw new Error('KVKK onayı eksikse neden söylenmedi');
      await ctx.yaz('#gir-kvkk', true); await ctx.tikla('#gir-gonder');
      // 2) OTP: yanlış kod → hak azalır; 123456 → doğum yılı
      await ctx.bekleSecici('#gir-otp-girdi');
      await ctx.yaz('#gir-otp-girdi', '000000');
      if (!/4 hakkın kaldı/.test(ctx.metin('#gir-otp-hata'))) throw new Error('yanlış kod mesajı: ' + ctx.metin('#gir-otp-hata'));
      await ctx.yaz('#gir-otp-girdi', DEMO_KOD); await ctx.bekleSecici('#gir-yil');
      // 3) 15 yaş altı: nazik ret + bekleme listesi
      await ctx.yaz('#gir-yil', String(buYil() - 12)); await ctx.tikla('.gir-adim button[type="submit"]');
      await ctx.bekleSecici('.gir-ret');
      if (!/KodKent 15 yaşından itibaren/.test(ctx.metin('.gir-ret'))) throw new Error('ret metni yok');
      if (state.telefon || state.dogumYili) throw new Error('15 yaş altında telefon/doğum yılı saklanmamalı');
      await ctx.yaz('#gir-eposta', 'veli@ornek.com'); await ctx.tikla('.gir-ret button[type="submit"]'); await ctx.bekleSecici('.gir-basari');
      // 4) 15–17: e-Devlet (demo) → veli telefonu → rozet → dil-sec
      await ctx.tikla('[data-action="gir-basa"]');
      await ctx.yaz('#gir-tel', '532 111 22 33'); await ctx.yaz('#gir-kvkk', true); await ctx.tikla('#gir-gonder');
      await ctx.bekleSecici('#gir-otp-girdi'); await ctx.yaz('#gir-otp-girdi', DEMO_KOD); await ctx.bekleSecici('#gir-yil');
      await ctx.yaz('#gir-yil', String(buYil() - 16)); await ctx.tikla('.gir-adim button[type="submit"]');
      await ctx.tikla('[data-action="gir-edevlet"]'); await ctx.bekleSecici('[data-action="gir-edevlet-devam"]');
      if (!/Demo: e-Devlet yaş doğrulaması simüle edildi/.test(ctx.metin('.gir-demo-not'))) throw new Error('e-Devlet demo etiketi yok');
      await ctx.tikla('[data-action="gir-edevlet-devam"]'); await ctx.bekleSecici('#gir-veli-tel');
      await ctx.yaz('#gir-veli-tel', '532 111 22 33'); await ctx.tikla('.gir-adim button[type="submit"]');
      if (!/senin numaranla aynı/.test(ctx.metin('#gir-veli-hata'))) throw new Error('veli numarası aynıysa uyarı yok');
      await ctx.yaz('#gir-veli-tel', '541 222 33 44'); await ctx.tikla('.gir-adim button[type="submit"]');
      await ctx.bekleSecici('.gir-veli-rozet');
      if (!/Veli onayı bekleniyor/.test(ctx.metin('.gir-veli-rozet')) || state.veli.durum !== 'bekliyor') throw new Error('veli rozeti/durumu yanlış');
      await ctx.tikla('[data-action="gir-veli-devam"]');
      if (ctx.gidilen() !== 'dil-sec') throw new Error('dil-sec\'e gidilmedi');
    }
  });

  /* ================= 2) DİL SEÇİMİ ================= */
  const DILLER = [
    { id: 'csharp', ad: 'C#', glif: 'C#', renk: '#9B86FF', ozet: 'Oyun, uygulama ve web arka uçları için güçlü ve okunaklı bir dil. Şehir bu dille inşa ediliyor.' },
    { id: 'python', ad: 'Python', glif: 'Py', renk: '#4F8BEA', ozet: 'Veri, otomasyon ve yapay zekâ işleri için.', bekleyen: 1842 },
    { id: 'javascript', ad: 'JavaScript', glif: 'JS', renk: '#FFC83D', ozet: 'Tarayıcıda çalışan her şeyin dili.', bekleyen: 1377 },
    { id: 'java', ad: 'Java', glif: 'Jv', renk: '#FF7A66', ozet: 'Kurumsal sistemler ve köklü Android dünyası.', bekleyen: 904 },
    { id: 'kotlin', ad: 'Kotlin', glif: 'Kt', renk: '#B58CFF', ozet: 'Modern Android ve sunucu uygulamaları.', bekleyen: 512 },
    { id: 'go', ad: 'Go', glif: 'Go', renk: '#22C9CE', ozet: 'Hızlı ve sade sunucu, altyapı yazılımı.', bekleyen: 436 }
  ];
  function dilKart(d) {
    const ac = d.id === 'csharp', listede = !!state.bekleme[d.id];
    const ust = '<div class="dil-ust"><span class="dil-glif" style="--dil:' + d.renk + '" aria-hidden="true">' + esc(d.glif) + '</span><div class="dil-ad"><h2>' + esc(d.ad) + '</h2>' + (ac ? chipHtml('ŞEHİR AÇIK', 'nane', 'tik') : chipHtml('Yakında', 'gri')) + '</div></div>';
    if (ac) return '<article class="kart dil-kart dil-acik">' + ust + '<p>' + esc(d.ozet) + '</p><p class="kucuk soluk">Çarşı\'dan Bulut Tepesi\'ne 7 semt, 100 ders, 20 işletme.</p><button type="button" id="dil-csharp" class="btn btn-birincil btn-buyuk btn-blok" data-action="dil-csharp">C# ile Başla</button></article>';
    return '<article class="kart dil-kart">' + ust + '<p class="kucuk">' + esc(d.ozet) + '</p><p class="mini soluk"><span class="tab">' + fmt(d.bekleyen + (listede ? 1 : 0)) + '</span> kişi bekliyor</p>' +
      '<button type="button" id="dil-haber-' + d.id + '" class="btn ' + (listede ? 'btn-basari' : 'btn-hayalet') + ' btn-blok" data-action="dil-haber" data-dil="' + d.id + '" aria-pressed="' + listede + '" aria-label="' + esc(d.ad) + ', yakında. ' + (listede ? 'Haber vereceğiz, geri almak için dokun.' : 'Haber ver.') + '">' + (listede ? ikon('tik', 18) + 'Haber vereceğiz' : 'Haber Ver') + '</button></article>';
  }
  function dilCiz(root) {
    let kartlar;
    try { if (!DILLER.length) throw new Error('bos'); kartlar = DILLER.map(dilKart).join(''); }
    catch (e) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Dil kartları yüklenemedi.', { tekrar: 'dil-tekrar' }) + '</div>'; return; }
    root.innerHTML = '<div class="sayfa dil-kok"><header class="dil-bas"><h1>Hangi dille başlıyoruz?</h1><p class="soluk">Şimdilik şehir yalnızca C# ile açık. Diğerleri yolda.</p></header>' +
      '<div class="dil-izgara">' + kartlar + '</div><p class="dil-alt kucuk soluk">' + ikon('bilgi', 16) + ' "Haber Ver" dersen hazır olunca bildirim göndeririz. İstediğin zaman Ayarlar\'dan vazgeçebilirsin.</p></div>';
  }
  KK_UI.screen('dil-sec', {
    ad: 'Dil Seçimi', hud: false,
    render(root, ctx) {
      if (!ctx.ilk) { dilCiz(root); return; }
      root.innerHTML = '<div class="sayfa dil-kok" aria-busy="true"><header class="dil-bas"><h1>Hangi dille başlıyoruz?</h1><p class="soluk">Şimdilik şehir yalnızca C# ile açık. Diğerleri yolda.</p></header><div class="dil-izgara">' +
        '<div class="kart dil-kart"><span class="iskelet" style="height:150px"></span></div>'.repeat(6) + '</div></div>';
      return bekle(300).then(function () { if (aktif('dil-sec')) dilCiz(root); });
    },
    actions: {
      'dil-csharp': function () { state.dil = 'csharp'; save(); go('avatar'); },
      'dil-haber': function (el) {
        const id = el.getAttribute('data-dil'), ad = (DILLER.filter(function (d) { return d.id === id; })[0] || {}).ad || id;
        if (state.bekleme[id]) { delete state.bekleme[id]; toast(ad + ' listesinden çıkarıldın.', 'bilgi'); }
        else { state.bekleme[id] = true; toast(navigator.onLine === false ? 'Bağlanınca listeye yazacağız.' : 'Listeye yazıldın. Hazır olunca haber vereceğiz.', 'basari'); }
        const AY = state.ayarlar; AY.dilBekleme = (Array.isArray(AY.dilBekleme) ? AY.dilBekleme : []).filter(function (x) { return x !== id; }); if (state.bekleme[id]) AY.dilBekleme.push(id);
        save(); refresh();
      },
      'dil-tekrar': function () { refresh(); }
    },
    async selftest(root, ctx) {
      await ctx.bekleSecici('#dil-haber-python');
      const once = state.bekleme.python;
      await ctx.tikla('#dil-haber-python');
      if (!state.bekleme.python) throw new Error('Haber Ver bekleme listesine yazmadı');
      if (!/Haber vereceğiz/.test(ctx.metin('#dil-haber-python'))) throw new Error('düğme "Haber vereceğiz" olmadı');
      await ctx.tikla('#dil-haber-python');
      if (state.bekleme.python !== once && state.bekleme.python) throw new Error('ikinci dokunuş kaydı geri almadı');
      await ctx.tikla('#dil-csharp');
      if (state.dil !== 'csharp' || ctx.gidilen() !== 'avatar') throw new Error('C# seçimi avatar\'a götürmedi');
    }
  });

  /* ================= 3) AVATAR ATÖLYESİ ================= */
  const SEKMELER = [['ten', 'Ten'], ['sac', 'Saç'], ['kiyafet', 'Kıyafet']];
  const YASAK = ['admin', 'yonetici', 'moderator', 'destek', 'kodkent', 'kurul', 'mufettis', 'nuran', 'hasanabi', 'aptal', 'salak', 'gerizekali'];
  const USTA_AD = ['defne', 'kerem', 'nehir', 'baran', 'elif', 'selin', 'yusuf'];
  let ST = null;
  const sadelestir = function (s) { return String(s).toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[._]/g, ''); };
  function adKontrol(ad) {
    const kural = '3–16 karakter; harf, rakam, nokta ve alt çizgi.';
    if (!ad) return { durum: 'bos', mesaj: kural };
    if (ad.length < 3 || ad.length > 16 || !/^[\p{L}\p{N}._]+$/u.test(ad)) return { durum: 'hata', mesaj: kural };
    const s = sadelestir(ad);
    if (YASAK.some(function (y) { return s.indexOf(y) >= 0; }) || (USTA_AD.indexOf(s) >= 0)) return { durum: 'hata', mesaj: 'Bu takma ad kullanılamıyor. Başka bir tane dene.' };
    const alinmis = ((VERI().liderlik || {}).haftalik || []).map(function (o) { return sadelestir(String(o.ad || '').replace(/^@/, '')); });
    if (s !== sadelestir(ST.baslangicAd || '') && alinmis.indexOf(s) >= 0) return { durum: 'hata', mesaj: 'Bu takma ad alınmış. ' + ad + '_cs2 nasıl?' };
    return { durum: 'uygun', mesaj: 'Uygun. Bu takma adı kullanabilirsin.' };
  }
  const durumHtml = function (k) { return k.durum === 'uygun' ? ikon('tik', 18) + '<span>' + esc(k.mesaj) + '</span>' : k.durum === 'denetleniyor' ? '<span class="donus" aria-hidden="true"></span><span>Denetleniyor…</span>' : '<span>' + esc(k.mesaj) + '</span>'; };
  function avSecenekHtml() {
    const S = AVATAR_SECENEK, av = state.avatar;
    const swatch = function (alan, dizi, secili) { return dizi.map(function (o, i) { return '<button type="button" role="radio" aria-checked="' + (secili === i) + '" aria-label="' + esc(o.ad) + '" class="av-sec av-renk" style="--c:' + o.hex + '" data-action="av-sec" data-alan="' + alan + '" data-i="' + i + '"><i></i><span>' + esc(o.ad) + '</span></button>'; }).join(''); };
    if (ST.sekme === 'ten') return '<div class="av-izgara" role="radiogroup" aria-label="Ten rengi">' + swatch('ten', S.ten, av.ten) + '</div>';
    if (ST.sekme === 'sac') return '<div class="av-alt-baslik">Stil</div><div class="av-izgara av-izgara-8" role="radiogroup" aria-label="Saç stili">' + S.sacStil.map(function (o) { return '<button type="button" role="radio" aria-checked="' + (av.sacStil === o.id) + '" aria-label="' + esc(o.ad) + '" class="av-sec av-mini" data-action="av-sec" data-alan="sacStil" data-i="' + o.id + '">' + avatarSvg(Object.assign({}, av, { sacStil: o.id }), { boyut: 64, kadraj: 'bust', aria: o.ad }) + '<span>' + esc(o.ad) + '</span></button>'; }).join('') + '</div>' +
      '<div class="av-alt-baslik">Renk</div><div class="av-izgara" role="radiogroup" aria-label="Saç rengi">' + swatch('sacRenk', S.sacRenk, av.sacRenk) + '</div>';
    return '<div class="av-izgara" role="radiogroup" aria-label="Kıyafet seti">' + S.kiyafet.map(function (o, i) { return '<button type="button" role="radio" aria-checked="' + (av.kiyafet === i) + '" aria-label="' + esc(o.ad) + '" class="av-sec av-mini" data-action="av-sec" data-alan="kiyafet" data-i="' + i + '">' + avatarSvg(Object.assign({}, av, { kiyafet: i }), { boyut: 64, kadraj: 'bust', aria: o.ad }) + '<span>' + esc(o.ad) + '</span></button>'; }).join('') + '</div>';
  }
  function avOnizleme() {
    const e = ID('av-sahne'); if (e) e.innerHTML = avatarSvg(state.avatar, { boyut: 270, emote: ST.emote, yon: ST.cevir ? 'sol' : undefined, golge: true, aria: 'Avatar önizlemesi' });
    yazMetin('av-tarif', avatarTarif(state.avatar));
  }
  function rastgeleAv() {
    const S = AVATAR_SECENEK, r = function (n) { return Math.floor(Math.random() * n); };
    state.avatar = { ten: r(S.ten.length), sacStil: r(S.sacStil.length), sacRenk: r(S.sacRenk.length), kiyafet: r(S.kiyafet.length), aksesuar: [] };
  }
  function avCiz(root) {
    const k = ST.durumObj || adKontrol(ST.ad);
    root.innerHTML = '<div class="av-kok"><header class="av-bas"><h1>Avatarını yap</h1>' + chipHtml('3/4 adım', 'mor') + '</header><div class="av-govde">' +
      '<section class="kart av-onizleme" aria-label="Önizleme"><div class="av-sahne av-buyuk" id="av-sahne" data-action="av-selam" tabindex="0" role="button" aria-label="Avatarına dokun, el sallasın"></div>' +
      '<p id="av-tarif" class="av-tarif" aria-live="polite"></p><div class="sira av-kontrol"><button type="button" class="btn btn-hayalet btn-kucuk" data-action="av-cevir">' + ikon('yenile', 16) + 'Çevir</button><button type="button" class="btn btn-hayalet btn-kucuk" data-action="av-rastgele">Rastgele</button><button type="button" class="btn btn-hayalet btn-kucuk" data-action="av-sifirla">Sıfırla</button></div></section>' +
      '<section class="av-secenek" aria-label="Seçenekler"><div class="sekmeler" role="tablist" aria-label="Avatar parçaları">' + SEKMELER.map(function (s) { return '<button type="button" role="tab" id="av-sekme-' + s[0] + '" aria-selected="' + (ST.sekme === s[0]) + '" class="sekme' + (ST.sekme === s[0] ? ' aktif' : '') + '" data-action="av-sekme" data-sekme="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="kart av-panel" role="tabpanel" aria-labelledby="av-sekme-' + ST.sekme + '">' + avSecenekHtml() + '</div>' +
      '<div class="alan av-ad-alan"><label class="etiket" for="av-ad">Takma ad</label><div class="girdi-grup"><span class="girdi-onek" aria-hidden="true">@</span><input id="av-ad" class="girdi" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="16" placeholder="takma_adin" value="' + esc(ST.ad) + '" data-input="av-ad" aria-describedby="av-durum"></div>' +
      '<div id="av-durum" class="av-durum" data-durum="' + k.durum + '" role="status">' + durumHtml(k) + '</div></div>' +
      '<button type="button" id="av-gir" class="btn btn-altin btn-buyuk btn-blok" data-action="av-sehre-gir">Şehre Gir</button><p class="mini soluk ortala">Sonra her şeyi değiştirebilirsin. Yüz, saç ve vücut Dolap\'ta ücretsizdir; takma ad değişimi 500 B.</p></section></div></div>';
    avOnizleme();
  }
  KK_UI.screen('avatar', {
    ad: 'Avatar Atölyesi', hud: false,
    render(root, ctx) {
      if (ctx.ilk || !ST) {
        ST = { sekme: 'ten', ad: state.ad || '', baslangicAd: state.ad || '', emote: '', cevir: false, zaman: 0, durumObj: null };
        const a = state.avatar;
        if (!state.kurulumTamam && !a.ten && !a.sacStil && !a.sacRenk && !a.kiyafet) { const o = AVATAR_ORNEKLERI[Math.floor(Math.random() * AVATAR_ORNEKLERI.length)]; state.avatar = Object.assign({}, o.av, { aksesuar: [] }); save(); }
      }
      avCiz(root);
    },
    leave() { clearTimeout(ST && ST.zaman); },
    actions: {
      'av-sekme': function (el) { ST.sekme = el.getAttribute('data-sekme'); refresh(); },
      'av-sec': function (el) { state.avatar[el.getAttribute('data-alan')] = Number(el.getAttribute('data-i')); save(); refresh(); },
      'av-cevir': function () { ST.cevir = !ST.cevir; avOnizleme(); },
      'av-rastgele': function () { rastgeleAv(); save(); refresh(); },
      'av-sifirla': function () { state.avatar = { ten: 2, sacStil: 0, sacRenk: 1, kiyafet: 0, aksesuar: [] }; save(); refresh(); },
      'av-selam': function () { ST.emote = 'el-salla'; avOnizleme(); clearTimeout(ST.zaman); ST.zaman = KK_UI.gecikme(function () { ST.emote = ''; avOnizleme(); }, 1600); },
      'av-ad': function (el) {
        ST.ad = el.value.replace(/^@/, '').replace(/\s/g, ''); if (el.value !== ST.ad) el.value = ST.ad;
        ST.durumObj = { durum: 'denetleniyor' }; const d = ID('av-durum'); if (d) { d.setAttribute('data-durum', 'denetleniyor'); d.innerHTML = durumHtml(ST.durumObj); }
        clearTimeout(ST.zaman);
        ST.zaman = KK_UI.gecikme(function () { const k = adKontrol(ST.ad); ST.durumObj = k; const e = ID('av-durum'); if (e) { e.setAttribute('data-durum', k.durum); e.innerHTML = durumHtml(k); } }, 400);
      },
      async 'av-sehre-gir'(el) {
        if (navigator.onLine === false) { toast('Takma adı denetlemek için internet gerekiyor.', 'uyari'); return; }
        const k = adKontrol(ST.ad); ST.durumObj = k;
        if (k.durum !== 'uygun') { const d = ID('av-durum'); if (d) { d.setAttribute('data-durum', k.durum === 'bos' ? 'hata' : k.durum); d.innerHTML = durumHtml(k.durum === 'bos' ? { durum: 'hata', mesaj: 'Önce bir takma ad seç. ' + k.mesaj } : k); } const i = ID('av-ad'); if (i) { i.classList.add('girdi-hata'); i.focus(); } return; }
        state.ad = ST.ad; state.kurulumTamam = true; state.dil = state.dil || 'csharp'; state.ekran.meydan = Object.assign({}, state.ekran.meydan, { karsilandi: false }); save();
        konfeti({ adet: 60 }); toast('Şehre hoş geldin, ' + state.ad + '!', 'basari'); go('meydan', { parametre: { ilkGiris: true } });
      }
    },
    async selftest(root, ctx) {
      await ctx.tikla('#av-sekme-sac'); await ctx.tikla('[data-alan="sacStil"][data-i="2"]');
      if (state.avatar.sacStil !== 2) throw new Error('saç stili seçilmedi');
      await ctx.tikla('#av-sekme-kiyafet'); await ctx.tikla('[data-alan="kiyafet"][data-i="4"]');
      if (state.avatar.kiyafet !== 4 || !/lacivert blazer/i.test(ctx.metin('#av-tarif'))) throw new Error('kıyafet/tarif güncellenmedi: ' + ctx.metin('#av-tarif'));
      await ctx.yaz('#av-ad', 'admin_x'); await ctx.bekleSecici('.av-durum[data-durum="hata"]');
      await ctx.tikla('#av-gir'); if (state.kurulumTamam && ctx.gidilen() === 'meydan') throw new Error('yasak takma adla Şehre Gir geçti');
      await ctx.yaz('#av-ad', 'deniz_cs'); await ctx.bekleSecici('.av-durum[data-durum="uygun"]');
      await ctx.tikla('#av-gir');
      if (state.ad !== 'deniz_cs' || !state.kurulumTamam || ctx.gidilen() !== 'meydan') throw new Error('Şehre Gir akışı tamamlanmadı');
    }
  });
})();
