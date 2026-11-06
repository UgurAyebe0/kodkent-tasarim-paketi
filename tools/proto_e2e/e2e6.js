/* Entegrasyon testi 6: depo (bos/bozuk/yanlis tip/dolu/engelli), "Bastan basla" artigi, cifte odul (hizli cift tik, gorev tekrari, Gunluk Tekrar, Tapu),
   ai modulu deseni (brief 02 §E.3: cache:false, AbortController, hata kodlari, otomatik yeniden deneme yok, yalnizca tiklamayla) */
(async function () {
  const out = [];
  const log = function (k, ok, d) { out.push((ok ? 'OK   ' : 'FAIL ') + k + (d ? ' :: ' + d : '')); };
  const T = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const root = document.getElementById('screen');
  const ctx = function () { return ekranBaglami(KK_UI.mevcut, root, {}); };
  const $q = function (s) { return document.querySelector(s); };
  const adim = async function (ad, fn) {
    const h0 = KK_UI.hatalar.length;
    try { await fn(); const yeni = KK_UI.hatalar.slice(h0); if (yeni.length) log(ad, false, 'betik hatasi: ' + yeni[0].mesaj); else log(ad, true); }
    catch (e) { log(ad, false, String((e && e.message) || e)); }
    try { KK_UI.modalTemizle(); } catch (x) { /* yoksa */ }
  };
  const git = async function (t) { go(t); await T(250); if (KK_UI.mevcut !== t) throw new Error('go(' + t + ') sonrasi ekran ' + KK_UI.mevcut); };
  const bas = function () { sifirla(); hizliKurulum(); };
  KK_UI.hizliMod = true;
  const KEY = DEPO_ANAHTARI;
  const sagliklimi = function (n) {
    const kotu = [];
    ['xp', 'bayt', 'cip'].forEach(function (k) { if (typeof state[k] !== 'number' || !isFinite(state[k]) || state[k] < 0) kotu.push(k + '=' + String(state[k])); });
    ['envanter', 'rozetler'].forEach(function (k) { if (!Array.isArray(state[k])) kotu.push(k + ' dizi degil'); });
    ['dersler', 'gorevler', 'isletmeler', 'ayarlar', 'ruhsat', 'tekrar', 'oda', 'giyili', 'avatar', 'veli', 'ekran', 'ui'].forEach(function (k) { if (!state[k] || typeof state[k] !== 'object' || Array.isArray(state[k])) kotu.push(k + ' nesne degil'); });
    if (typeof state.ad !== 'string') kotu.push('ad dize degil'); if (!state.isletmeler || !state.isletmeler.otopark) kotu.push('isletmeler.otopark yok');
    if (kotu.length) throw new Error((n || 'state') + ': ' + kotu.join(', '));
  };

  /* ---------------- depo ---------------- */
  await adim('depo: kayit yok -> load() false, ekranlar acilir', async function () {
    sifirla(); localStorage.removeItem(KEY); if (load() !== false) throw new Error('load() false degil'); sagliklimi('bos'); hizliKurulum(); await git('meydan'); await git('pazar');
  });
  const bozukDenemeleri = [['{bozuk json', 'bozuk JSON'], ['null', 'null'], ['[]', 'dizi'], ['"metin"', 'dize'], ['123', 'sayi'],
    [JSON.stringify({ v: 1, xp: 'abc', bayt: null, cip: -5, dersler: [], gorevler: 'x', avatar: 5, envanter: 'oops', rozetler: 7, ayarlar: null, ruhsat: null, isletmeler: null, tekrar: 5, oda: null, giyili: null, veli: 3, ui: null, ekran: [], ad: 123, kurulumTamam: true }), 'yanlis tipler']];
  for (let i = 0; i < bozukDenemeleri.length; i++) {
    const d = bozukDenemeleri[i];
    await adim('depo: ' + d[1] + ' -> load() atmaz, state saglikli, HUD/Pazar/Profil/Sokak cizilir', async function () {
      sifirla(); localStorage.setItem(KEY, d[0]); let r; try { r = load(); } catch (e) { throw new Error('load() firlatti: ' + e.message); }
      sagliklimi(d[1]); state.kurulumTamam = true; hud(); await git('meydan'); await git('pazar'); await git('profil'); await git('sokak');
    });
  }
  await adim('depo: kota dolu (setItem atar) -> save() false, award calisir, oyun kirilmaz', async function () {
    bas(); const orj = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new DOMException('Quota', 'QuotaExceededError'); };
    try { if (save() !== false) throw new Error('save() false donmedi'); const x0 = state.xp; await award({ xp: 5, bayt: 5, etiket: 'kota testi' }); if (state.xp !== x0 + 5) throw new Error('award XP isleyemedi'); await git('meydan'); }
    finally { Storage.prototype.setItem = orj; }
  });
  await adim('depo: localStorage erisimi engelli (getter atar) -> save/load/sifirla atmaz', async function () {
    bas(); const d = Object.getOwnPropertyDescriptor(window, 'localStorage'); Object.defineProperty(window, 'localStorage', { configurable: true, get: function () { throw new DOMException('blocked', 'SecurityError'); } });
    try { if (save() !== false) throw new Error('save() false donmedi'); load(); sifirla(); hizliKurulum(); await git('meydan'); }
    finally { if (d) Object.defineProperty(window, 'localStorage', d); else delete window.localStorage; }
  });

  /* ---------------- Bastan basla artigi ---------------- */
  await adim('sifirla(): state === defaultState(), kayit silinir, ekran verisi temizlenir', async function () {
    bas(); state.bayt = 999; state.xp = 5000; state.envanter = ['x', 'y']; state.ekran = { kurul: { a: 1 }, oda: { b: 2 } }; state.oda.ziyaretci = ['z']; state.rozetler = ['keskin-goz']; state.isletmeler.otopark.kod = 'kod'; save();
    sifirla(); const a = JSON.stringify(state), b = JSON.stringify(defaultState()); if (a !== b) throw new Error('artik veri: ' + a.slice(0, 200)); if (localStorage.getItem(KEY) != null) throw new Error('kayit silinmedi');
  });
  await adim('demo "Bastan basla" dugmesi: onay -> Giris, XP/Bayt/rozet sifir, kaydedilmis taslak kalmaz', async function () {
    bas(); await git('kurul'); await ctx().yaz('#kurul-cevap', 'Bu yazdigim taslak, bastan basla sonrasi kalmamali; en az kirk karakter olsun diye uzun yaziyorum.'); await T(150);
    const b = $q('#demo-sifirla'); if (!b) throw new Error('#demo-sifirla yok'); b.click(); await T(250); const ev = $q('[data-veri="onayla-evet"]'); if (!ev) throw new Error('onay penceresi acilmadi'); ev.click(); await T(500);
    if (KK_UI.mevcut !== 'giris') throw new Error('Giris ekranina donulmedi: ' + KK_UI.mevcut); if (state.xp !== 0 || state.bayt !== 0 || state.kurulumTamam || state.rozetler.length || state.envanter.length) throw new Error('artik veri xp/bayt/kurulum/rozet/envanter');
    if (JSON.stringify(state) !== JSON.stringify(defaultState()) && Object.keys(state.ekran || {}).length > 0 && JSON.stringify(state.ekran).indexOf('Bu yazdigim') >= 0) throw new Error('taslak state.ekran icinde kaldi');
    hizliKurulum(); await git('kurul'); const ta = $q('#kurul-cevap'); if (ta && ta.value) throw new Error('eski taslak Kurul kutusunda duruyor: ' + ta.value.slice(0, 40));
  });

  await adim('Bastan basla: Sohbette gonderilen mesaj ve Atolye kodu yeni oyuncuya sizmaz', async function () {
    bas(); state.dogumYili = 1995; state.ayarlar.guvenliMod = false; save(); await git('sohbet'); const gir = $q('[data-input="sh-yaz"]'); if (!gir) throw new Error('sohbet kutusu yok'); await ctx().yaz(gir, 'GIZLI-MESAJ-123'); gir.closest('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await T(250);
    if (root.textContent.indexOf('GIZLI-MESAJ-123') < 0) throw new Error('on kosul: mesaj gonderilemedi');
    await git('atolye'); await ctx().bekleSecici('#atl-kod', 3000); await ctx().yaz('#atl-kod', '// GIZLI-KOD-456'); await T(150);
    sifirla(); hizliKurulum(); await git('sohbet'); if (root.textContent.indexOf('GIZLI-MESAJ-123') >= 0) throw new Error('eski sohbet mesaji yeni oyuncuda gorunuyor');
    await git('atolye'); await ctx().bekleSecici('#atl-kod', 3000); const k = $q('#atl-kod'); if (k && k.value.indexOf('GIZLI-KOD-456') >= 0) throw new Error('eski Atolye kodu yeni oyuncuda gorunuyor');
  });

  /* ---------------- cifte odul ---------------- */
  const uzun = 'Fonksiyon bir tarif kartı gibidir: ad, parametre ve dönüş türü sözleşmeyi oluşturur; imza ne aldığını ve ne verdiğini söyler.';
  const kurulBir = async function (cift) {
    bas(); await git('kurul'); const x0 = state.xp, b0 = state.bayt; await ctx().yaz('#kurul-cevap', uzun); const g = $q('[data-action="gonder"]'); g.click(); if (cift) { g.click(); g.click(); }
    await ctx().bekleSecici('.kurul-karti', 4000); await T(600); KK_UI.modalTemizle(); return { xp: state.xp - x0, bayt: state.bayt - b0 };
  };
  await adim('cifte odul: Kurul "Gonder"e hizli uc tik = tek tik ile ayni XP/Bayt', async function () {
    const tek = await kurulBir(false), cok = await kurulBir(true);
    if (tek.xp <= 0) throw new Error('tek tikta XP gelmedi'); if (cok.xp !== tek.xp || cok.bayt !== tek.bayt) throw new Error('tek tik ' + JSON.stringify(tek) + ' / uc tik ' + JSON.stringify(cok));
  });
  await adim('cifte odul: Atolye gorevi cozulduktan sonra ayni cozumle tekrar calistirmak yeniden XP/Bayt vermez', async function () {
    sifirla(); state.ad = 'Deniz'; state.kurulumTamam = true; state.xp = 472; ['1.1', '1.2', '1.3', '1.4'].forEach(function (l) { const k = dersKaydi(l); k.tamam = true; k.mohur = true; }); save();
    const id = 'meydan-saati', g = KK_CORE.DATA.gorevler.filter(function (x) { return x.id === id; })[0];
    go('atolye'); await T(300); KK_UI.modalTemizle(); await ctx().bekleSecici('#atl-kod', 4000);
    const aktif = $q('#atl-gorev') ? $q('#atl-gorev').textContent : ''; if (aktif.indexOf(g.ad) < 0) { await ctx().tikla('[data-action="gorev-sec"][data-id="' + id + '"]'); await T(300); await ctx().bekleSecici('#atl-kod', 3000); }
    await ctx().yaz('#atl-kod', g.editor.cozum); await ctx().tikla('[data-action="calistir"]'); await ctx().bekleSecici('.atl-basari', 5000); await T(300); KK_UI.modalTemizle(); await T(100);
    if (!state.gorevler[id].tamam) throw new Error('gorev tamam degil'); const x1 = state.xp, b1 = state.bayt, r1 = state.ruhsat.otopark;
    for (let k = 0; k < 2; k++) { go('atolye'); await T(300); KK_UI.modalTemizle(); try { await ctx().tikla('[data-action="gorev-sec"][data-id="' + id + '"]'); } catch (x) { /* secili olabilir */ } await T(250); const ta = $q('#atl-kod'); if (!ta) break; await ctx().yaz('#atl-kod', g.editor.cozum); const c = $q('[data-action="calistir"]'); if (c) c.click(); await T(1200); KK_UI.modalTemizle(); }
    if (state.xp !== x1 || state.bayt !== b1 || state.ruhsat.otopark !== r1) throw new Error('tekrarda odul degisti: XP ' + x1 + '->' + state.xp + ', Bayt ' + b1 + '->' + state.bayt + ', Ruhsat ' + r1 + '->' + state.ruhsat.otopark);
  });
  await adim('cifte odul: Gunluk Tekrar ikinci kez oynanirsa XP/Bayt/seri artmaz', async function () {
    bas(); await git('tekrar'); await KK_UI.ekranlar.tekrar.selftest(root, ctx()); await T(500); KK_UI.modalTemizle();
    const x1 = state.xp, b1 = state.bayt, s1 = state.tekrar.seri; if (!(x1 > 340)) throw new Error('ilk tur XP vermedi (' + x1 + ')');
    await git('tekrar'); try { await KK_UI.ekranlar.tekrar.selftest(root, ctx()); } catch (e) { /* ikinci turda baslat dugmesi yoksa beklenen */ } await T(500); KK_UI.modalTemizle();
    if (state.xp !== x1 || state.bayt !== b1 || state.tekrar.seri !== s1) throw new Error('ikinci turda degisti: XP ' + x1 + '->' + state.xp + ', Bayt ' + b1 + '->' + state.bayt + ', seri ' + s1 + '->' + state.tekrar.seri);
  });
  await adim('cifte odul / eksi bakiye: Tapu iki kez (hizli cift tik + zorlanmis ikinci) tek kez satin alinir, Bayt eksiye dusmez', async function () {
    bas(); state.ruhsat.otopark = 3; state.bayt = 500; save(); await git('sokak'); const b = $q('[data-action="tapuAl"]'); if (!b) throw new Error('tapuAl yok');
    b.click(); await T(120); const e1 = $q('[data-veri="onayla-evet"]'); if (e1) e1.click(); await T(300); const b2 = state.bayt; if (b2 !== 200) throw new Error('ilk alim sonrasi Bayt ' + b2 + ' (200 bekleniyordu)');
    const k = $q('[data-action="tapuAl"]'); if (k) { k.removeAttribute('disabled'); k.removeAttribute('aria-disabled'); k.click(); await T(150); const e2 = $q('[data-veri="onayla-evet"]'); if (e2) { e2.click(); await T(250); } }
    if (state.bayt < 0 || state.bayt !== 200) throw new Error('ikinci alim Bayt ' + state.bayt + ' (200 kalmali)');
  });

  /* ---------------- ai deseni (brief 02 §E.3) ---------------- */
  const sig = function () { return new AbortController().signal; };
  const gecerli = { puan: { puan: 80, olcutler: [{ ad: 'Doğruluk', puan: 40, not: 'a' }, { ad: 'Tamlık', puan: 24, not: 'b' }, { ad: 'Açıklık', puan: 16, not: 'c' }], geri_bildirim: 'İyi gidiyorsun.', takip_sorusu: '', guven: 0.9, kopya_suphesi: false },
    kod: [{ baslik: 'a', not: 'x' }, { baslik: 'b', not: 'y' }, { baslik: 'c', not: 'z' }], savunma: { kabul: true, gerekce: 'Doğru.' } };
  const testler = KK_CORE.DATA.otopark.publicTestler;
  gecerli.test = testler.map(function (t) { return { id: t.id, gecti: true, gercek: t.beklenen }; });
  const cagrilar = {
    puan: function (s) { return aiPuanla({ usta: { ad: 'Usta Defne', kisilik: 'sıcak' }, ders: { baslik: 'Fonksiyonlar' }, soruTipi: 'Kavram Sorusu', soru: 'Sözleşme nedir?', rubrik: [{ ad: 'Doğruluk', agirlik: 50 }, { ad: 'Tamlık', agirlik: 30 }, { ad: 'Açıklık', agirlik: 20 }], cevap: uzun, ornekIyiCevap: 'x', anahtarlar: ['imza'], signal: s }); },
    kod: function (s) { return aiKodIncele({ kod: 'public static int UcretHesapla(int dakika) { return dakika * 2; }', sozlesme: 'x', usta: { ad: 'Usta Defne' }, signal: s }); },
    test: function (s) { return aiTestSimule({ kod: 'public static int UcretHesapla(int dakika) { return dakika * 2; }', testler: testler, sozlesme: 'x', signal: s }); },
    savunma: function (s) { return aiSavunma({ satir: 'return gun * 250;', soru: 'Neden?', aciklama: 'Her başlayan gün 250 TL olduğu için gün sayısını yukarı yuvarlıyorum.', kod: 'x', anahtarlar: ['gün'], signal: s }); } };
  const adlar = Object.keys(cagrilar);
  for (let i = 0; i < adlar.length; i++) {
    const ad = adlar[i];
    await adim('ai.' + ad + ': basarili cagri = TEK cagri, cache:false, verilen signal, kaynak claude', async function () {
      const s = sig(), acik = []; ai.fn = { json: async function (p, o) { acik.push(o); return gecerli[ad]; } }; ai.durum = 'bagli'; const r = await cagrilar[ad](s);
      if (acik.length !== 1) throw new Error('cagri sayisi ' + acik.length); if (acik[0].cache !== false) throw new Error('cache:false degil'); if (acik[0].signal !== s) throw new Error('signal iletilmedi');
      if (!r || r.kaynak !== 'claude') throw new Error('kaynak ' + (r && r.kaynak));
    });
    await adim('ai.' + ad + ': hata kodlarinda (rate_limited, invalid_json, session_expired, upstream_error, refused, empty_completion) TEK cagri + cevrimdisi yedek; cancelled -> null', async function () {
      const kodlar = ['rate_limited', 'invalid_json', 'session_expired', 'upstream_error', 'refused', 'empty_completion', 'cancelled'];
      for (let j = 0; j < kodlar.length; j++) {
        let n = 0; ai.fn = { json: async function () { n++; throw { code: kodlar[j] }; } }; ai.durum = 'bagli'; const r = await cagrilar[ad](sig());
        if (n !== 1) throw new Error(kodlar[j] + ': cagri sayisi ' + n + ' (otomatik yeniden deneme?)');
        if (kodlar[j] === 'cancelled') { if (r !== null) throw new Error('cancelled null donmedi'); } else if (!r || r.kaynak !== 'cevrimdisi') throw new Error(kodlar[j] + ': cevrimdisi yedek yok (' + (r && r.kaynak) + ')');
        else if (r.hataKodu !== kodlar[j]) throw new Error(kodlar[j] + ': hataKodu ' + r.hataKodu);
      }
    });
  }
  await adim('ai: ekran acmak/gezinmek hicbir ai cagrisi baslatmaz (yalnizca tiklamayla)', async function () {
    bas(); let n = 0; ai.fn = { json: async function () { n++; return gecerli.puan; } }; ai.durum = 'bagli'; const tokenlar = Object.keys(KK_UI.ekranlar).filter(function (t) { return t !== 'galeri'; });
    for (let i = 0; i < tokenlar.length; i++) { go(tokenlar[i]); await T(120); KK_UI.modalTemizle(); } if (n !== 0) throw new Error(n + ' otomatik ai cagrisi');
  });
  await adim('ai: cagri surerken ekran degisimi -> hata yok, takili "degerlendiriyor" kalmaz, Gonder yeniden kullanilabilir', async function () {
    bas(); await git('kurul'); await ctx().yaz('#kurul-cevap', uzun); let bit = null; ai.fn = { json: function (p, o) { return new Promise(function (res, rej) { o.signal.addEventListener('abort', function () { rej({ code: 'cancelled' }); }); setTimeout(function () { res(gecerli.puan); }, 500); }); } }; ai.durum = 'bagli';
    await ctx().tikla('[data-action="gonder"]'); await T(100); go('akademi'); await T(900); KK_UI.modalTemizle(); sagliklimi('ekran degisimi sonrasi');
    await git('kurul'); await T(300); KK_UI.modalTemizle(); if (/değerlendiriyor/i.test(root.textContent)) throw new Error('"degerlendiriyor" takili kaldi'); const g = $q('#kurul-gonder'); const kart = $q('.kurul-karti');
    if (!kart && (!g || g.disabled)) throw new Error('Gonder devre disi kaldi (kutu degeri ' + (($q('#kurul-cevap') || {}).value || '').length + ' kr)');
  });
  ai.fn = null; ai.durum = 'cevrimdisi';

  await adim('Kurul: ipucu + sayac + Gonder dugmesi birbirine binmez, hepsi gorunur alanda (sticky yok)', async function () {
    bas(); await git('kurul'); await ctx().bekleSecici('#kurul-cevap', 3000); const f = $q('.kurul-form'); f.scrollIntoView({ block: 'end' }); await T(150);
    const r = function (s) { const e = $q(s); if (!e) throw new Error(s + ' yok'); const b = e.getBoundingClientRect(); return { t: b.top, b: b.bottom, l: b.left, r: b.right, e: e }; };
    const h = r('#kurul-dogrula'), s = r('#kurul-sayac'), g = r('#kurul-gonder'), ta = r('#kurul-cevap');
    const kes = function (a, b) { return a.l < b.r - 0.5 && b.l < a.r - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5; };
    [['ipucu', h, 'sayac', s], ['ipucu', h, 'dugme', g], ['sayac', s, 'dugme', g], ['ipucu', h, 'kutu', ta], ['sayac', s, 'kutu', ta], ['dugme', g, 'kutu', ta]].forEach(function (p) { if (kes(p[1], p[3])) throw new Error(p[0] + ' ile ' + p[2] + ' ust uste'); });
    const vh = root.getBoundingClientRect(); [['ipucu', h], ['sayac', s], ['dugme', g]].forEach(function (p) { if (p[1].t < vh.top - 1 || p[1].b > vh.bottom + 1) throw new Error(p[0] + ' gorunur alanin disinda (' + Math.round(p[1].t) + '-' + Math.round(p[1].b) + ' / ' + Math.round(vh.top) + '-' + Math.round(vh.bottom) + ')'); });
    if (getComputedStyle(g.e.parentElement).position === 'sticky') throw new Error('Gonder satiri hala sticky');
  });
  const pre = document.createElement('pre'); pre.id = 'e2e-out'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
})();
