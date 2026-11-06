/* ==== ui/99-boot.js — açılış, demo çubuğu, hash, #selftest ====
   Sıra: galeri kaydı → demo çubuğu → kayıt yükle → hashchange dinle → ekranı aç. Parçalardan biri yüklenirken fırlatsa bile 00-base.js'in güvenlik ağı bootBaslat()'ı çağırır. */

/** Demo çubuğu: 24 ekranlı seçici, Baştan başla (sayfa içi onay), Hızlı kurulum, AI rozeti. */
function demoCubukKur() {
  const sel = $('#demo-screen'); if (!sel || sel.options.length) return;
  sel.innerHTML = EKRANLAR.map(function (e, i) { return '<option value="' + e.token + '">' + String(i + 1).padStart(2, '0') + ' · ' + esc(e.ad) + '</option>'; }).join('');
  sel.addEventListener('change', function () { demoGit(sel.value); });
  $('#demo-sifirla').addEventListener('click', function () {
    onayla('Tüm ilerleme silinecek ve Giriş ekranından yeniden başlayacaksın. Devam edilsin mi?', 'Baştan başla', 'Vazgeç').then(function (ok) { if (!ok) return; sifirla(); go('giris'); toast('Her şey sıfırlandı. Yeni bir oyuncu olarak başlayabilirsin.', 'bilgi'); });
  });
  $('#demo-hizli').addEventListener('click', function () {
    KK_UI.modalTemizle(); hizliKurulum(); const t = KK_UI.mevcut; go(!t || GIRIS_AKISI.indexOf(t) >= 0 ? 'meydan' : t);
    toast('Demo oyuncusu hazır: Deniz, Sev. 3, 320 B, Çarşı 1.1–1.3 tamam, Ruhsat 2/3.', 'basari');
  });
}
/** Demo seçicisinden ekrana git: kurulum yoksa ve ekran giriş akışı değilse hızlı kurulumu otomatik uygular. */
/** Demo oyuncusu şartı henüz sağlanmamış bir işletme ekranına atlayınca (demo seçici ya da doğrudan #hash) gereken ara durumu hazırlar.
    Gerçek ilerlemeye DOKUNMAZ: yalnızca state.ui.demo === true iken ve işletme henüz açılmamışken çalışır. → bilgi metni ('' = değişiklik yok). */
const DEMO_ISLETME = ['is-emri', 'editor', 'savunma', 'panel', 'vitrin'];
function demoHazirla(token) {
  if (!state.ui || !state.ui.demo || DEMO_ISLETME.indexOf(token) < 0) return '';
  const o = isletmeKaydi('otopark'), I = KK_UI.isl, ot = (KK_CORE.DATA || {}).otopark || {};
  if (o.durum === 'acik' || o.durum === 'deneme' || o.durum === 'kararmis' || !I) return '';
  let not = '';
  /* Gerçek akışın ara durumunu YAZAR (tutarlı bakiye/XP): Taksimetre tamam (+60 XP, +80 B, +100 B teşvik), Ruhsat 3/3, Tapu −300 B. */
  if (o.durum !== 'kapali') {
    const gk = gorevKaydi('taksimetre');
    if (!gk.tamam) { gk.tamam = true; gk.ipucu = 0; gk.ipucusuz = true; state.xp += 60; state.bayt += 80 + 100; }
    state.ruhsat.otopark = 3; state.bayt = Math.max(0, state.bayt - 300); o.durum = 'kapali';
    not = 'Demo: Taksimetre tamam, Ruhsat 3/3, Tapu alındı (−300 B).';
  }
  if ((token === 'editor' || token === 'savunma') && !(o.netlestirme && o.netlestirme.sorulanlar && o.netlestirme.sorulanlar.length >= 4)) { o.netlestirme = { sorulanlar: ['S1', 'S2', 'S3', 'S4'], maddeler: [2, 3, 4, 1] }; not = (not ? not + ' ' : 'Demo: ') + 'İş Emri tamam sayıldı.'; }
  if (token === 'savunma') {
    o.kod = ot.referansKod || o.kod; o.testler = { acik: I.acikTestler().map(function (t) { return t.id; }), gizli: I.gizliTestler().concat(I.tohumlu()).map(function (t) { return t.id; }) };
    not = (not ? not + ' ' : 'Demo: ') + 'Müfettiş 26/26 geçti sayıldı (referans çözüm).';
  }
  if (token === 'panel' || token === 'vitrin') {
    if (!o.kod) o.kod = ot.referansKod || ''; I.isletmeAc('acik'); o.acilisOdul = true; state.xp += 300; state.bayt += 100;
    not = (not ? not + ' ' : 'Demo: ') + 'Savunma geçildi, Otopark açıldı (+300 XP, +100 B).';
  }
  save(); hud(); return not;
}
function demoGit(token) {
  KK_UI.modalTemizle(); if (!state.kurulumTamam && GIRIS_AKISI.indexOf(token) < 0) hizliKurulum();
  let not = ''; try { not = demoHazirla(token); } catch (e) { KK_UI.hataKaydet(e, 'demoHazirla'); }
  go(token); if (not) toast(not, 'bilgi', 4200);
}

function bootBaslat() {
  if (KK_UI.acildi) return; KK_UI.acildi = true;
  if (typeof galeriKaydet === 'function') { try { galeriKaydet(); } catch (e) { KK_UI.hataKaydet(e, 'galeriKaydet'); } }
  demoCubukKur(); load(); aiRozetGuncelle(); KK_UI.hashDinle();
  try { if (KK_UI.sosyal && KK_UI.sosyal.tercihUygula) KK_UI.sosyal.tercihUygula(); } catch (e) { KK_UI.hataKaydet(e, 'tercihUygula'); }
  if (location.hash === '#selftest') { selftestCalistir(); return; }
  const h = hashToken();
  if (h) { if (!state.kurulumTamam && GIRIS_AKISI.indexOf(h) < 0) hizliKurulum(); try { demoHazirla(h); } catch (e) { KK_UI.hataKaydet(e, 'demoHazirla'); } go(h); }
  else go(state.kurulumTamam ? 'meydan' : 'giris');
}

/* ---- #selftest: her ekran için taze durum (sifirla + hizliKurulum) → render → varsa def.selftest(root, ctx) ---- */
function zamanAsimi(p, ms, mesaj) {
  return new Promise(function (coz, red) { const id = setTimeout(function () { red(new Error(mesaj)); }, ms); Promise.resolve(p).then(function (v) { clearTimeout(id); coz(v); }, function (e) { clearTimeout(id); red(e); }); });
}
async function selftestCalistir() {
  KK_UI.selftestAktif = true; KK_UI.hizliMod = true;
  const sonuc = [], root = $('#screen'), t00 = performance.now(), ilkH = KK_UI.hatalar.length;
  for (let i = 0; i < EKRANLAR.length; i++) {
    const e = EKRANLAR[i], t0 = performance.now(), h0 = KK_UI.hatalar.length; let ok = true, hata = null;
    try {
      KK_UI.modalTemizle(); sifirla(); hizliKurulum(); ai.fn = null; ai.durum = 'cevrimdisi'; aiRozetGuncelle();
      const def = KK_UI.ekranlar[e.token]; KK_UI.mevcut = e.token; state.ui.ekran = e.token;
      root.className = 'scr scr-' + e.token; root.innerHTML = ''; hudGoster(def ? def.hud !== false : true);
      if (!def) { ok = false; hata = 'kayıtsız'; }
      else {
        const ctx = ekranBaglami(e.token, root, { ilk: true }), r = cizEkran(e.token, root, ctx);
        if (r.bekle) { const s = await zamanAsimi(r.bekle, 10000, 'render zaman aşımı (10 sn)'); if (s && s.ok === false) throw new Error(s.hata || 'render hatası'); }
        if (!r.ok) throw new Error(r.hata || 'render hatası');
        if (!root.firstElementChild) throw new Error('boş çıktı: ekran hiçbir öğe çizmedi');
        if (typeof def.selftest === 'function') await zamanAsimi(def.selftest(root, ctx), 20000, 'selftest zaman aşımı (20 sn)');
      }
    } catch (err) { ok = false; hata = String((err && err.message) || err); }
    const yeni = KK_UI.hatalar.slice(h0); if (ok && yeni.length) { ok = false; hata = yeni[0].mesaj + (yeni[0].kaynak ? ' [' + yeni[0].kaynak + ']' : ''); }
    try { ekranTemizle(KK_UI.ekranlar[e.token]); KK_UI.modalTemizle(); } catch (x) { /* temizlik hatası önemsiz */ }
    sonuc.push({ token: e.token, ok: ok, ms: Math.round(performance.now() - t0), hata: hata });
  }
  await new Promise(function (r) { setTimeout(r, 50); });
  const pencere = KK_UI.hatalar.filter(function (h) { return h.tur === 'error' || h.tur === 'unhandledrejection'; });
  pencere.forEach(function (h) { sonuc.push({ token: '#hata', ok: false, ms: 0, hata: h.tur + ': ' + h.mesaj + (h.kaynak ? ' [' + h.kaynak + ']' : '') }); });
  const kayitsiz = sonuc.filter(function (s) { return s.hata === 'kayıtsız'; }).length, basarili = sonuc.filter(function (s) { return s.ok && s.token.charAt(0) !== '#'; }).length, hatali = sonuc.filter(function (s) { return !s.ok && s.hata !== 'kayıtsız'; }).length;
  sonuc.push({ token: '#ozet', ok: hatali === 0, ms: Math.round(performance.now() - t00), hata: null, ozet: { toplam: EKRANLAR.length, ok: basarili, kayitsiz: kayitsiz, hatali: hatali } });
  const pre = document.createElement('pre'); pre.id = 'selftest-out';
  pre.setAttribute('style', 'position:fixed;left:0;right:0;bottom:0;max-height:45%;overflow:auto;margin:0;padding:8px;background:#000;color:#9fe8b0;font:11px/1.4 monospace;z-index:9999;white-space:pre-wrap');
  pre.textContent = sonuc.map(function (s) { return JSON.stringify(s); }).join('\n');
  document.body.appendChild(pre);
  KK_UI.selftestAktif = false; KK_UI.hizliMod = false;
}
bootBaslat();
