/* ==== ui/50b-ekran-isletme-panel.js — P2 (3/3): `panel` (İşletme Paneli) ve `vitrin` ====
   Panel: 7 günlük gelir (TL ve B ayrı, tek seri), Kasa, yükseltme listesi L2–L5, Hata Bildirimi, Vitrin ayarı. Vitrin: salt okunur kod sergisi. */
(function () {
  const I = KK_UI.isl;
  const YUKSELTME = [
    { l: 2, istek: 'Aylık abonelerin plakaları listede; onlar ödemesin.', fiyat: 500, xp: 150, gelir: 350, ek: 'Metal çerçeveli tabela, ikinci şerit, plaka okuyucu; Vitrin açılır', dersler: ['2.1'], dersAd: 'Ders 2.1 Liste Kur: List<T> (Liman)' },
    { l: 3, istek: 'Engelli ve elektrikli araçlara %50 indirim; bozuk bariyer kaydı gelirse hata ver.', fiyat: 1200, xp: 250, gelir: 560, ek: 'İkinci kat, şarj direği', dersler: ['3.1', '3.2', '3.3', '3.4'], dersAd: 'Dersler 3.1–3.4 (Atölyeler: enum, exception)' },
    { l: 4, istek: '22:00–06:00 gece tarifesi sabit 150.', fiyat: 2500, xp: 400, gelir: 900, ek: 'Aydınlatma direkleri, neon şerit', dersler: ['4.7'], dersAd: 'Ders 4.7 (Kampüs: DateTime)' },
    { l: 5, istek: 'Kapasite 50; doluysa reddet, bekleyenleri sırala.', fiyat: 5000, xp: 600, gelir: 1440, ek: 'Otomat, DOLU/BOŞ sayacı', dersler: ['6.1', '6.2', '6.3'], dersAd: 'Dersler 6.1–6.3 (Finans: durum, kuyruk, async)' }
  ];
  const HB_KOD = ['public static int UcretHesapla(int dakika)', '{', '    if (dakika <= 0) return 0;', '    int saat = (dakika + 59) / 60;', '    if (dakika < 120) return saat * 100;', '    if (dakika <= 360) return saat * 40;', '    int gun = dakika / 1440 + 1;', '    return gun * 250;', '}'];
  const HB_HATA = 7, HB_ID = 'hb-0412', HB_IYI = '1440 dakika tam bir gün, ama dakika / 1440 + 1 onu 2 gün sayıyor; başlayan günü bulmak için (dakika + 1439) / 1440 yazılmalı.';
  let hbSecim = 0, hbBekle = false;

  function P() { return I.ekran('panel', { sekme: 'gelir', tablo: { tl: false, b: false }, hb: {}, hbAcik: false, vitrinAcik: false, vitrinIlk: false }); }
  function gunAd(g, tam) { const d = new Date(g + 'T12:00:00'); return d.toLocaleDateString('tr-TR', { weekday: 'short' }) + (tam ? ' ' + d.getDate() + ' ' + d.toLocaleDateString('tr-TR', { month: 'short' }) : ''); }

  /* ---------- gelir grafiği (tek seri, çizgi; erişilebilir: odaklanabilir noktalar + tablo alternatifi) ---------- */
  function grafikHtml(tur, veri) {
    const W = 560, H = 214, L = 54, R = 16, T = 18, B = 32, vals = veri.map(function (x) { return x[tur]; }), adim = tur === 'tl' ? 100 : 10, birim = tur === 'tl' ? 'TL' : 'B';
    const mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals); let lo = Math.max(0, Math.floor(mn / adim) * adim - adim), hi = Math.ceil(mx / adim) * adim + adim;
    const step = Math.max(adim, Math.ceil((hi - lo) / 4 / adim) * adim); hi = lo + step * 4;
    const X = function (i) { return L + (W - L - R) * (veri.length > 1 ? i / (veri.length - 1) : 0.5); }, Y = function (v) { return T + (H - T - B) * (1 - (v - lo) / (hi - lo)); };
    let grid = ''; for (let k = 0; k <= 4; k++) { const v = lo + step * k, y = Y(v).toFixed(1); grid += '<line class="pn-gl" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"/><text class="pn-eksen" x="' + (L - 8) + '" y="' + (Number(y) + 4) + '" text-anchor="end">' + fmt(v) + '</text>'; }
    const pts = veri.map(function (x, i) { return X(i).toFixed(1) + ',' + Y(x[tur]).toFixed(1); }), poly = pts.join(' ');
    let uzun = 0; for (let i = 1; i < veri.length; i++) uzun += Math.hypot(X(i) - X(i - 1), Y(veri[i][tur]) - Y(veri[i - 1][tur]));
    const alan = tur === 'b' ? '<polygon class="pn-alan" points="' + X(0).toFixed(1) + ',' + (H - B) + ' ' + poly + ' ' + X(veri.length - 1).toFixed(1) + ',' + (H - B) + '"/>' : '';
    const noktalar = veri.map(function (x, i) {
      const cx = X(i).toFixed(1), cy = Y(x[tur]).toFixed(1), im = tur === 'tl' ? '<circle class="pn-isaret tl" cx="' + cx + '" cy="' + cy + '" r="5"/>' : '<rect class="pn-isaret b" x="' + (cx - 5) + '" y="' + (cy - 5) + '" width="10" height="10" transform="rotate(45 ' + cx + ' ' + cy + ')"/>';
      return '<g class="pn-nokta" tabindex="0" role="button" data-action="nokta" data-seri="' + tur + '" data-i="' + i + '" aria-label="' + esc(gunAd(x.gun, true) + ': ' + fmt(x[tur]) + ' ' + birim) + '"><circle cx="' + cx + '" cy="' + cy + '" r="22" fill="transparent"/>' + im + '</g>';
    }).join('');
    const etiket = veri.map(function (x, i) { return '<text class="pn-eksen" x="' + X(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(gunAd(x.gun)) + '</text>'; }).join('');
    return '<svg class="pn-svg ' + tur + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Son ' + veri.length + ' gün günlük gelir, ' + fmt(mn) + ' ile ' + fmt(mx) + ' ' + birim + ' arası">' + grid + alan + '<polyline class="pn-cizgi ' + tur + '" style="--len:' + Math.ceil(uzun) + '" points="' + poly + '"/>' + noktalar + etiket + '</svg>';
  }
  function tabloHtml(tur, veri) {
    const birim = tur === 'tl' ? 'TL' : 'B';
    return '<div class="tablo-kap"><table class="tablo"><caption class="sr">Son ' + veri.length + ' gün günlük gelir (' + birim + ')</caption><thead><tr><th>Gün</th><th class="sag">' + birim + '</th></tr></thead><tbody>' + veri.map(function (x) { return '<tr><td>' + esc(gunAd(x.gun, true)) + '</td><td class="sag">' + fmt(x[tur]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function grafikKart(tur, veri, p) {
    const baslik = tur === 'tl' ? 'Günlük gelir — TL' : 'Günlük gelir — Bayt', son = veri[veri.length - 1];
    return '<section class="kart pn-grafik ' + tur + '" aria-label="' + baslik + '"><h2 class="kart-baslik">' + ikon(tur === 'tl' ? 'liste' : 'coin', 22) + baslik + '</h2>' + grafikHtml(tur, veri) +
      '<p class="mini pn-nokta-yazi" id="pn-nokta-' + tur + '" aria-live="polite">' + esc(gunAd(son.gun, true)) + ' · ' + fmt(son.tl) + ' TL · ' + fmt(son.b) + ' B</p>' +
      '<button type="button" class="btn-baglanti" data-action="tabloAc" data-seri="' + tur + '" aria-expanded="' + !!p.tablo[tur] + '">' + (p.tablo[tur] ? 'Tabloyu gizle' : 'Veriyi tablo olarak göster') + '</button>' + (p.tablo[tur] ? tabloHtml(tur, veri) : '') + '</section>';
  }
  function yukseltmeHtml(o) {
    const sv = o.seviye || 1, acik = o.durum === 'acik' || o.durum === 'deneme';
    return '<div class="liste pn-yuk-liste">' + YUKSELTME.map(function (u) {
      const dersYok = u.dersler.filter(function (id) { return !(state.dersler[id] && state.dersler[id].tamam); }), onceki = sv >= u.l - 1, hazir = acik && onceki && !dersYok.length;
      let durum, neden;
      if (!acik) { durum = 'Kilitli'; neden = 'Önce Otopark\'u aç (Savunma).'; }
      else if (!onceki) { durum = 'Kilitli'; neden = 'Önce L' + (u.l - 1) + '.'; }
      else if (dersYok.length) { durum = 'Şart eksik'; neden = u.dersAd + ' henüz tamamlanmadı (Liman/Atölyeler inşaat halinde).'; }
      else if (state.bayt < u.fiyat) { durum = 'Hazır'; neden = fmt(u.fiyat - state.bayt) + ' B daha gerekir.'; }
      else { durum = 'Hazır'; neden = 'Şart tamam.'; }
      const tur = durum === 'Hazır' ? 'nane' : (durum === 'Şart eksik' ? 'amber' : 'gri'), uygun = hazir && state.bayt >= u.fiyat;
      return '<div class="satir pn-yuk' + (uygun ? ' hazir' : '') + '"><span class="satir-ana"><span class="satir-baslik">L' + u.l + ' · ' + fmt(u.fiyat) + ' B · ' + u.xp + ' XP · ≈' + fmt(u.gelir) + ' B/gün</span><span class="satir-alt">“' + esc(u.istek) + '”</span><span class="satir-alt">' + esc(u.ek) + '</span><span class="satir-alt pn-neden">' + ikon(durum === 'Hazır' ? 'tik' : 'kilit', 14) + esc(neden) + '</span></span><span class="satir-sag">' + chipHtml(durum, tur) +
        '<button type="button" class="btn btn-kucuk btn-altin" data-action="yukselt" data-l="' + u.l + '"' + (uygun ? '' : ' aria-disabled="true"') + '>Yükselt</button></span></div>';
    }).join('') + '</div>';
  }
  function hbKart(p) {
    const k = p.hb[HB_ID];
    if (k && k.tamam) return '<div class="pn-hb kapandi"><b>HB-0412 · Otopark</b><span>Dosya kapandı: ' + k.puan + '/100 puan · ' + (k.odul ? '+' + k.odul.bayt + ' B +' + k.odul.xp + ' XP' : 'ödül yok (ceza da yok)') + '.</span><span class="mini soluk">Müfettiş yarın yeni bir dosya bırakır (günde en çok 3).</span></div>';
    return '<div class="pn-hb"><div class="sira-s">' + chipHtml('Hata Bildirimi', 'amber', 'mektup') + chipHtml('Orta', 'gri') + '</div><b>HB-0412 · Otopark</b><span>“Müşteri 1.440 dakika için 500 TL ödemiş.”</span><span class="mini soluk">Başkasının hatalı kodu: şüpheli satırı bul, düzelt, nedenini tek cümleyle yaz. Ödül 60 B + 40 XP.</span>' +
      '<button type="button" class="btn btn-altin btn-kucuk" data-action="hbAc">' + ikon('goz', 18) + 'Hatayı Bul</button></div>';
  }

  /* ================= PANEL ================= */
  KK_UI.screen('panel', {
    ad: 'İşletme Paneli', hud: true,
    render(root, ctx) {
      try {
        const o = I.kayit(), p = P(), d = o.durum, ad = state.ad || 'Deniz';
        if (d === 'yok' || d === 'satilik' || !d) {
          root.innerHTML = '<div class="sayfa sayfa-dar"><div class="sayfa-baslik"><h1>İşletme Paneli</h1></div>' + bosHtml({ ikon: 'bina', baslik: 'Henüz işletmen yok', metin: 'İlk tapun Çarşı\'da seni bekliyor: Otopark 300 B, Sev. 3 ve Ruhsat 3/3.', buton: { ad: 'Haritayı Aç', aksiyon: 'haritaAc', sinif: 'btn-birincil' } }) + '</div>'; return;
        }
        const b = I.kasaBilgi(o), cevrimdisi = typeof navigator !== 'undefined' && navigator.onLine === false, veri = o.gelir7, acik = d === 'acik' || d === 'deneme', son = veri.length ? veri[veri.length - 1] : null, c = d === 'deneme' ? 0.5 : 1;
        const kalan = I.savunmaKalanSn(o), vitrinKilit = (o.seviye || 1) < 2;
        const serit = d === 'deneme' ? '<p class="pn-serit amber" role="status">' + ikon('saat', 18) + 'Deneme modu: gelir %50. ' + (kalan > 0 ? 'Savunma hakkın ' + zamanKalan(kalan) + ' sonra.' : 'Yeni Savunma hakkın hazır.') + ' <button type="button" class="btn-baglanti" data-go="' + (kalan > 0 ? 'editor' : 'savunma') + '">' + (kalan > 0 ? 'Editörü aç' : 'Savunma\'ya git') + '</button></p>' :
          (d === 'kararmis' ? '<p class="pn-serit kirmizi" role="status">' + ikon('uyari', 18) + 'İşletmen kararmış. Müfettişin dosyasına bak. <button type="button" class="btn-baglanti" data-go="editor">Editörü Aç</button></p>' :
            (d === 'kapali' ? '<p class="pn-serit amber" role="status">' + ikon('bina', 18) + 'Otopark henüz açılmadı: yazılım bekliyor. Gelir ve kasa Açılış\'tan sonra başlar. <button type="button" class="btn-baglanti" data-go="' + (o.netlestirme.sorulanlar.length >= 4 ? 'editor' : 'is-emri') + '">Devam et</button></p>' : ''));
        const ozet = '<div class="pn-ozet" aria-label="Bugün"><div class="pn-stat"><span class="mini soluk">Bugün</span><b>' + (acik ? Math.round(12 * c) : 0) + ' araç</b></div><div class="pn-stat"><span class="mini soluk">Gelir</span><b>' + fmt(son && acik ? son.tl : 0) + ' TL</b></div><div class="pn-stat"><span class="mini soluk">Bayt</span><b>' + fmt(son && acik ? son.b : 0) + ' B</b></div></div>';
        const grafikler = veri.length && acik ? '<div class="pn-gelir izgara-2">' + grafikKart('tl', veri, p) + grafikKart('b', veri, p) + '</div>' + (veri[0].demo ? '<p class="mini soluk pn-demo">Demo: gelir geçmişi örnek veridir (B8 §6.14).</p>' : '') : '<div class="pn-gelir">' + bosHtml({ ikon: 'liste', baslik: 'İlk gelir yarın sabah burada', metin: acik ? 'Açılıştan yeni sonra grafikler ilk günün sayılarıyla dolar.' : 'Otopark açılınca günlük gelir (TL ve B) burada çizilir.' }) + '</div>';
        const kasaKart = '<section class="kart pn-kasa" aria-label="Kasa"><h2 class="kart-baslik">' + ikon('kasa', 22) + 'Kasa</h2>' + I.vaultHtml(o, b) + '<div class="kart-alt"><button type="button" class="btn btn-altin" data-action="kasaTopla"' + (b.calisiyor && b.deger >= 1 ? '' : ' aria-disabled="true"') + '>' + ikon('coin', 20) + 'Kasayı Topla' + (b.calisiyor ? ' (' + fmt(b.deger) + ' B)' : '') + '</button>' + (b.calisiyor ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="saatIleri">Demo: +1 saat</button>' : '') + '</div>' +
          (cevrimdisi ? '<p class="mini soluk">Çevrimdışısın. Kasayı toplamak için bağlantı gerekiyor.</p>' : '<p class="mini soluk">Kasa 8 saatlik üretimi tutar; günde 3 toplama tam gelirdir. Kalan kesir kasada kalır.</p>') + '</section>';
        const vitrinKart = '<section class="kart pn-vitrin" aria-label="Vitrin ayarı"><h2 class="kart-baslik">' + ikon('goz', 22) + 'Vitrin</h2><label class="anahtar"><input type="checkbox" id="pn-vitrin" data-input="vitrinAnahtar"' + (p.vitrinAcik && !vitrinKilit ? ' checked' : '') + (vitrinKilit ? ' disabled' : '') + '><span class="anahtar-iz"></span><span>Kodumu sergile</span></label>' +
          '<p class="mini soluk">' + (vitrinKilit ? 'Vitrin, işletmen L2 olunca açılır.' : (p.vitrinAcik ? 'Kodun ve Savunma cevabın Vitrin\'de görünüyor.' : 'Açınca kodun ve Savunma cevabın Vitrin\'de görünür.')) + '</p><button type="button" class="btn btn-hayalet btn-kucuk" data-action="vitrineGit" data-sahip="komsu">' + ikon('kitap', 18) + 'Komşunun Vitrini\'ne bak</button></section>';
        root.innerHTML = '<div class="sayfa sayfa-genis pn pn-sek-' + esc(p.sekme) + '"><div class="sayfa-baslik"><h1>İşletme Paneli</h1><label class="sr" for="pn-sec">İşletme seç</label><select id="pn-sec" class="girdi pn-secici" data-input="isletmeSec"><option value="otopark" selected>Otopark · Çarşı · Tente Sokak No: 3</option>' +
          (veri_isletmeler().map(function (x) { return '<option value="' + esc(x.id) + '" disabled>' + esc(x.ad) + ' — tapu yok (Sev. ' + x.seviye + ', ' + fmt(x.fiyat) + ' B)</option>'; }).join('')) + '</select>' + isletmeDurumHtml(d) + '<span class="chip chip-gri">L' + (o.seviye || 1) + '</span></div>' + serit +
          '<div class="sekmeler pn-sekmeler" role="tablist" aria-label="Panel bölümleri">' + [['gelir', 'Gelir', 'liste'], ['yuk', 'Yükseltme', 'ok-yukari'], ['dosya', 'Dosyalar', 'mektup'], ['vitrin', 'Vitrin', 'goz']].map(function (t) { return '<button type="button" role="tab" class="sekme' + (p.sekme === t[0] ? ' aktif' : '') + '" aria-selected="' + (p.sekme === t[0]) + '" data-action="sekme" data-s="' + t[0] + '">' + ikon(t[2], 18) + t[1] + '</button>'; }).join('') + '</div>' + ozet +
          '<div class="pn-izgara">' + (p.hbAcik && !(p.hb[HB_ID] && p.hb[HB_ID].tamam) ? '<section class="kart pn-hb-calisma" id="pn-hb-calisma" aria-label="Hata Bildirimi çalışma alanı">' + hbGovde() + '</section>' : '') + '<div class="pn-ust">' + grafikler + '</div><div class="pn-alt-izgara">' + kasaKart + '<section class="kart pn-yuk-kart" aria-label="Yükseltme listesi"><h2 class="kart-baslik">' + ikon('ok-yukari', 22) + 'Yükseltmeler (L2–L5)</h2>' + yukseltmeHtml(o) + '</section><div class="pn-sag yigin"><section class="kart pn-dosya" aria-label="Hata Bildirimi dosyaları"><h2 class="kart-baslik">' + ikon('mektup', 22) + 'Hata Bildirimi</h2>' + hbKart(p) + '</section>' + vitrinKart + '</div></div></div>' +
          '<div class="pn-alt-cubuk"><button type="button" class="btn btn-altin btn-blok" data-action="kasaTopla"' + (b.calisiyor && b.deger >= 1 ? '' : ' aria-disabled="true"') + '>' + ikon('coin', 20) + 'Kasayı Topla' + (b.calisiyor ? ' (' + fmt(b.deger) + ' B)' : '') + '</button></div></div>';
      } catch (e) {
        KK_UI.hataKaydet(e, 'panel');
        root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Panel yüklenemedi.', { tekrar: 'yenile', tekrarAd: 'Tekrar Dene' }) + '</div>';
      }
    },
    actions: {
      yenile() { refresh(); }, haritaAc() { go('harita'); },
      sekme(el) { P().sekme = el.getAttribute('data-s') || 'gelir'; save(); refresh(); },
      isletmeSec() { refresh(); },
      tabloAc(el) { const p = P(), s = el.getAttribute('data-seri'); p.tablo[s] = !p.tablo[s]; save(); refresh(); },
      nokta(el) {
        const o = I.kayit(), i = Number(el.getAttribute('data-i')), x = o.gelir7[i], k = document.getElementById('pn-nokta-' + el.getAttribute('data-seri')); if (x && k) k.textContent = gunAd(x.gun, true) + ' · ' + fmt(x.tl) + ' TL · ' + fmt(x.b) + ' B';
      },
      async kasaTopla(el) { const n = await I.kasaTopla(el); if (n) refresh(); },
      saatIleri() { const o = I.kayit(); if (o.kasa && o.kasa.sonTopla) { o.kasa.sonTopla -= 3600000; save(); refresh(); } },
      vitrinAnahtar(el) {
        const p = P(), o = I.kayit(); if ((o.seviye || 1) < 2) { el.checked = false; toast('Vitrin, işletmen L2 olunca açılır.', 'uyari'); return; }
        p.vitrinAcik = !!el.checked; save();
        if (p.vitrinAcik) { toast('Kodun ve Savunma cevabın Vitrin\'de görünecek.', 'basari'); if (!p.vitrinIlk) { p.vitrinIlk = true; save(); award({ bayt: 50, etiket: 'İlk Vitrin' }); } }
        refresh();
      },
      vitrineGit(el) { go('vitrin', { parametre: { sahip: el.getAttribute('data-sahip') === 'ben' ? 'ben' : 'komsu' } }); },
      async yukselt(el) {
        const l = Number(el.getAttribute('data-l')), u = YUKSELTME.filter(function (x) { return x.l === l; })[0]; if (!u) return;
        if (!(await onayla('L' + l + ' için ' + fmt(u.fiyat) + ' B ve yeni bir müşteri isteği: “' + u.istek + '” Başlayalım mı?', 'Başlayalım', 'Vazgeç'))) return;
        toast('Yeni müşteri isteği kaydedildi. L' + l + ' kod görevi Liman/Atölyeler dersleriyle açılır.', 'bilgi');
      },
      /* ---- Hata Bildirimi (HB-0412) ---- */
      hbAc() {
        const p = P(); if (p.hb[HB_ID] && p.hb[HB_ID].tamam) { toast('Bu dosya kapandı; Müfettiş yarın yeni bir dosya bırakır.', 'bilgi'); return; }
        hbSecim = 0; hbBekle = false; p.hbAcik = true; save(); refresh();
        const kk = document.getElementById('pn-hb-calisma'); if (kk && kk.scrollIntoView) kk.scrollIntoView({ block: 'nearest' });
      },
      hbKapat() { P().hbAcik = false; save(); refresh(); },
      hbSatir(el) { hbSecim = Number(el.getAttribute('data-n')); $$('.pn-hb-satir').forEach(function (b) { const on = Number(b.getAttribute('data-n')) === hbSecim; b.classList.toggle('secili', on); b.setAttribute('aria-pressed', String(on)); }); },
      async hbGonder() {
        if (hbBekle) return;
        const sat = document.getElementById('hb-duzelt'), neden = document.getElementById('hb-neden'), duzelt = ((sat && sat.value) || '').trim(), nedenMetin = ((neden && neden.value) || '').trim();
        if (!hbSecim) { toast('Önce şüpheli satırı işaretle.', 'uyari'); return; }
        if (nedenMetin.length < 20) { toast('Nedeni tek cümleyle yaz (en az 20 karakter).', 'uyari'); return; }
        hbBekle = true; hbYaz(hbGovde(duzelt, nedenMetin, true)); const ac = ai.yeniIptal();
        const satirPuan = hbSecim === HB_HATA ? 30 : (Math.abs(hbSecim - HB_HATA) === 1 ? 15 : 0);
        const dz = duzelt.replace(/\s+/g, ' '), duzPuan = /\(\s*dakika\s*\+\s*1439\s*\)\s*\/\s*1440|Math\.Ceiling\s*\(\s*dakika\s*\/\s*1440\.0\s*\)|\(\s*dakika\s*\+\s*1440\s*-\s*1\s*\)\s*\/\s*1440/.test(dz) ? 40 : (/1440/.test(dz) && !/\+\s*1\s*;/.test(dz) ? 20 : 0);
        const r = await aiPuanla({ usta: (I.veri().ustalar || {}).defne || { ad: 'Usta Defne', kisilik: 'sıcak' }, ders: { baslik: 'Hata Bildirimi: HB-0412' }, soruTipi: 'Hata Avı', soru: 'Bu satır neden yanlış sonuç veriyor? Tek cümleyle açıkla.', rubrik: [{ ad: 'Doğruluk', agirlik: 50 }, { ad: 'Tamlık', agirlik: 30 }, { ad: 'Açıklık', agirlik: 20 }], cevap: nedenMetin, ornekIyiCevap: HB_IYI, anahtarlar: ['1440', 'gün', '+ 1', '1439', 'başlayan', 'tam'], signal: ac.signal });
        hbBekle = false; if (!r) { hbYaz(hbGovde(duzelt, nedenMetin)); toast('Değerlendirme durduruldu.', 'bilgi'); return; }
        const nedenPuan = Math.round(r.puan * 0.3), toplam = satirPuan + duzPuan + nedenPuan, odul = toplam >= 70 ? { bayt: 60, xp: 40 } : (toplam >= 40 ? { bayt: 30, xp: 20 } : null);
        const p = P(); p.hb[HB_ID] = { tamam: true, puan: toplam, odul: odul }; save();
        hbYaz('<div class="pn-hb-sonuc" role="status"><div class="sira">' + halkaHtml(toplam, { tur: toplam >= 70 ? 'nane' : 'amber', alt: 'PUAN', boyut: 84 }) + '<div class="yigin-s"><b>' + (toplam >= 70 ? 'Dosya kapandı: tam ödül' : (toplam >= 40 ? 'Dosya kapandı: yarım ödül' : 'Dosya kapandı: bu sefer ödül yok (ceza da yok)')) + '</b><span class="mini soluk">' + chipHtml(r.kaynak === 'claude' ? 'Claude' : 'Çevrimdışı demo', r.kaynak === 'claude' ? 'mor' : 'amber', 'muhur').replace('class="chip', 'class="chip') + '</span></div></div>' +
          '<ul class="liste"><li class="satir"><span class="satir-ana"><span class="satir-baslik">Satır bulma · ' + satirPuan + '/30</span><span class="satir-alt">Hatalı satır: ' + HB_HATA + '. satır <code class="kod-ic">int gun = dakika / 1440 + 1;</code></span></span></li><li class="satir"><span class="satir-ana"><span class="satir-baslik">Düzeltme · ' + duzPuan + '/40</span><span class="satir-alt">Beklenen: <code class="kod-ic">int gun = (dakika + 1439) / 1440;</code></span></span></li><li class="satir"><span class="satir-ana"><span class="satir-baslik">Neden (Kurul) · ' + nedenPuan + '/30</span><span class="satir-alt">' + esc(r.geri_bildirim || '') + '</span></span></li></ul>' +
          '<p class="mini soluk">İyi açıklama örneği: “' + esc(HB_IYI) + '”</p>' + (odul ? '<p>' + sayacHtml('bayt', odul.bayt, { kucuk: true }) + ' ' + sayacHtml('xp', odul.xp, { kucuk: true }) + ' hesabına işlendi.</p>' : '') + '<div class="sira"><button type="button" class="btn btn-birincil" data-action="hbKapat">Tamam</button></div></div>');
        if (odul) await award({ bayt: odul.bayt, xp: odul.xp, etiket: 'Hata Bildirimi HB-0412' });
      }
    },
    async selftest(root, ctx) {
      if (!/Henüz işletmen yok|Haritayı Aç/.test(root.textContent)) throw new Error('İşletmesi olmayan oyuncuya boş durum gösterilmeli');
      const o = state.isletmeler.otopark; I.isletmeAc('acik'); refresh();
      await ctx.bekleSecici('.pn-svg.tl'); if (!root.querySelector('.pn-svg.b')) throw new Error('Bayt grafiği çizilmedi');
      if (root.querySelectorAll('.pn-yuk').length !== 4) throw new Error('Yükseltme listesinde L2–L5 (4 satır) olmalı');
      await ctx.tikla('[data-action="tabloAc"][data-seri="tl"]'); await ctx.bekleSecici('.pn-grafik.tl .tablo');
      const b0 = state.bayt; await ctx.tikla('.pn-kasa [data-action="kasaTopla"]'); await ctx.bekle(60); KK_UI.modalTemizle();
      if (state.bayt <= b0) throw new Error('Kasayı Topla Bayt artırmadı');
      const x0 = state.xp, b1 = state.bayt; await ctx.tikla('[data-action="hbAc"]'); await ctx.bekleSecici('.pn-hb-satir[data-n="7"]'); await ctx.tikla('.pn-hb-satir[data-n="7"]');
      await ctx.yaz('#hb-duzelt', 'int gun = (dakika + 1439) / 1440;'); await ctx.yaz('#hb-neden', HB_IYI); await ctx.tikla('#hb-gonder'); await ctx.bekleSecici('.pn-hb-sonuc', 4000);
      await ctx.bekle(120); KK_UI.modalTemizle(); if (state.xp - x0 < 40 || state.bayt - b1 < 60) throw new Error('Hata Bildirimi ödülü işlenmedi (xp +' + (state.xp - x0) + ', bayt +' + (state.bayt - b1) + ')');
    }
  });
  function veri_isletmeler() { return (I.veri().isletmeler || []).filter(function (x) { return x.id !== 'otopark'; }).slice(0, 3); }
  function hbYaz(h) { const k = document.getElementById('pn-hb-calisma'); if (k) k.innerHTML = h; }
  function hbGovde(duzelt, neden, bekle) {
    return '<h2 class="kart-baslik">' + ikon('mektup', 22) + 'Hata Bildirimi · HB-0412 <button type="button" class="btn btn-hayalet btn-kucuk" data-action="hbKapat" style="margin-left:auto">Vazgeç</button></h2><p class="pn-hb-musteri"><b>Müfettiş:</b> “Müşteri 1.440 dakika için 500 TL ödemiş.”</p><p class="mini soluk">1) Şüpheli satırı işaretle  2) Düzeltilmiş satırı yaz  3) Nedeni tek cümleyle açıkla.</p><div class="pn-hb-kod" role="group" aria-label="Hatalı kod; bir satır seç">' +
      HB_KOD.map(function (s, i) { const n = i + 1; return '<button type="button" class="pn-hb-satir' + (hbSecim === n ? ' secili' : '') + '" data-action="hbSatir" data-n="' + n + '" aria-pressed="' + (hbSecim === n) + '"><span class="ln">' + n + '</span><span class="kod-ic">' + csHl(s) + '</span></button>'; }).join('') + '</div>' +
      '<label class="etiket" for="hb-duzelt">Düzeltilmiş satır</label><input id="hb-duzelt" class="girdi mono" type="text" autocomplete="off" spellcheck="false" placeholder="int gun = …;" value="' + esc(duzelt || '') + '">' +
      '<label class="etiket" for="hb-neden">Neden? (tek cümle)</label><textarea id="hb-neden" class="girdi" rows="2" maxlength="300" placeholder="Bu satır neden yanlış sonuç veriyor?">' + esc(neden || '') + '</textarea>' +
      '<div class="sira"><button type="button" class="btn btn-birincil' + (bekle ? ' yukleniyor' : '') + '" id="hb-gonder" data-action="hbGonder"' + (bekle ? ' aria-disabled="true"' : '') + '>' + ikon('gonder', 18) + 'Gönder</button>' + (bekle ? '<span class="mini soluk" role="status">Kurul okuyor…</span>' : '') + '</div>';
  }

  /* ================= VİTRİN ================= */
  const KOMSU = {
    ad: 'ayse_kod', seviye: 2, ziyaret: 63, alkis: 18, puan: 94,
    kod: ['using System.Collections.Generic;', '', 'public static class Otopark', '{', '    static readonly List<string> Aboneler = new List<string> { "34 KOD 34", "06 CS 06" };', '', '    public static int UcretHesapla(int dakika, string plaka)', '    {', '        if (Aboneler.Contains(plaka)) return 0;   // aylık abone ödemez', '        if (dakika <= 0) return 0;', '        int saat = (dakika + 59) / 60;            // başlayan saat', '        if (dakika < 120) return saat * 100;', '        if (dakika <= 360) return saat * 40;', '        int gun = (dakika + 1439) / 1440;         // başlayan gün', '        return gun * 250;', '    }', '}'].join('\n'),
    cevap: '121 dakika 120’den büyük ve 360’tan küçük olduğu için 2. dilimde. Bu dilimde ücret başlayan saat × 40. 121 dakika 2 saati bir dakika geçtiği için 3. saat başlamış sayılıyor: (121 + 59) / 60 = 3. Yani 3 × 40 = 120. Dilimi seçen satır if (dakika <= 360), ücreti veren satır return saat * 40;.'
  };
  function vitrinSatir(kod) { const s = kod.split('\n'); for (let i = 0; i < s.length; i++) if (/dakika\s*<=\s*360/.test(s[i])) return i + 1; return 1; }
  KK_UI.screen('vitrin', {
    ad: 'Vitrin', hud: true,
    render(root, ctx) {
      try {
        const o = I.kayit(), p = P(), ev = I.ekran('vitrin', { gun: '', okunan: 0, kodGun: '', alkisGun: '', alkis: 0, sekme: 'kod' });
        if (ctx && ctx.ilk !== false) ev.ben = !!(ctx.parametre && ctx.parametre.sahip === 'ben');
        const ben = !!ev.ben, acilmis = ['acik', 'deneme', 'kararmis'].indexOf(o.durum) >= 0 || !!o.acilisOdul;
        if (ev.gun !== I.bugun()) { ev.gun = I.bugun(); ev.okunan = 0; }
        const ad = ben ? (state.ad || 'Deniz') : KOMSU.ad, baslikAd = ben ? '@' + I.iyelik(ad) + ' Otoparkı' : '@' + I.iyelik(KOMSU.ad) + ' Otoparkı', seviye = ben ? (o.seviye || 1) : KOMSU.seviye;
        const secici = '<div class="sekmeler vt-sec" role="group" aria-label="Vitrin seç"><button type="button" class="sekme' + (!ben ? ' aktif' : '') + '" aria-pressed="' + !ben + '" data-action="vitrineGit" data-sahip="komsu">Komşu: @' + KOMSU.ad + '</button><button type="button" class="sekme' + (ben ? ' aktif' : '') + '" aria-pressed="' + ben + '" data-action="vitrineGit" data-sahip="ben">Benim Vitrinim</button></div>';
        const bas = '<div class="sayfa-baslik"><h1>Vitrin</h1>' + secici + '</div>';
        if (ben && seviye < 2) { root.innerHTML = '<div class="sayfa sayfa-genis vt">' + bas + bosHtml({ ikon: 'kilit', baslik: 'Vitrin, işletme L2 olunca açılır', metin: 'Otopark\'un şu an L' + seviye + '. L2 yükseltmesi (Ders 2.1 şartı) tamamlanınca kodun burada sergilenir.', buton: { ad: 'İşletme Paneli', aksiyon: 'panelAc', sinif: 'btn-birincil' } }) + '</div>'; return; }
        if (ben && !p.vitrinAcik) { root.innerHTML = '<div class="sayfa sayfa-genis vt">' + bas + bosHtml({ ikon: 'kilit', baslik: 'Bu işletmenin sahibi kodunu sergilemiyor', metin: 'Panel\'deki “Kodumu sergile” anahtarını açarsan kodun burada görünür.', buton: { ad: 'İşletme Paneli', aksiyon: 'panelAc', sinif: 'btn-birincil' } }) + '</div>'; return; }
        const kod = ben ? (o.kod || '') : KOMSU.kod, sv = ben ? (o.savunma || null) : { soru: 'Ayşe, 121 dakika kalan müşteri neden 120 TL ödüyor? Hangi satır belirliyor, ben de bakayım.', aciklama: KOMSU.cevap, puan: KOMSU.puan }, sat = vitrinSatir(kod), spoiler = !ben && !acilmis;
        const durumChip = chipHtml('Açık', 'nane', 'tik'), kalanOdul = 3 - ev.okunan;
        const kodBolum = spoiler ? '<section class="kart vt-spoiler" role="status"><h2 class="kart-baslik">' + ikon('kilit', 22) + 'Önce kendin dene</h2><p>Bu işletmeyi henüz sen açmadın. Önce kendin dene; sonra buraya dönüp kodları karşılaştır.</p><p class="mini soluk">Şu an yalnızca tabela ve Savunma cevabı görünür.</p><div class="kart-alt"><button type="button" class="btn btn-birincil" data-go="sokak">' + ikon('bina', 18) + 'İşletme Sokağı</button></div></section>' :
          '<section class="vt-kod-kap" aria-label="C# kodu"><div class="kod-baslik">' + ikon('kod', 14) + 'Otopark.cs · salt okunur</div><pre class="kod kod-no vt-kod" id="vt-kod" tabindex="0" role="region" aria-label="C# kodu, ' + kod.split('\n').length + ' satır, salt okunur"><code>' + csHlSatir(kod, { vurgu: [sat] }) + '</code></pre><p class="vt-isaret"><mark>Kurul\'un Savunma\'da sorduğu satır: ' + sat + '</mark> <button type="button" class="btn-baglanti" data-action="satiraBak">Satıra bak</button></p></section>';
        const cevap = sv ? '<section class="kart vt-cevap" aria-label="Savunma cevabı"><h2 class="kart-baslik">' + ikon('kalkan', 22) + 'Savunma cevabı</h2><div class="diyalog"><div class="diyalog-portre"><span class="portre">' + ustaSvg('hasan', { boyut: 56, aria: 'Hasan Abi' }) + '</span><b>Hasan Abi</b></div>' + balonHtml(sv.soru, { tur: 'usta', kuyruk: true }) + '</div>' + balonHtml(sv.aciklama, { tur: 'ben', ad: '@' + ad }) + '<div class="sira-s">' + chipHtml('Kurul: ' + sv.puan + '/100', 'mor', 'muhur') + '</div></section>' :
          '<section class="kart vt-cevap"><h2 class="kart-baslik">' + ikon('kalkan', 22) + 'Savunma cevabı</h2><p class="soluk">Henüz Savunma cevabı yok.</p></section>';
        const notlar = '<section class="kart vt-notlar" aria-label="Notlar"><h2 class="kart-baslik">' + ikon('defter', 22) + 'Notlar</h2><button type="button" class="btn btn-hayalet" aria-disabled="true" title="v1.1\'de geliyor">Not bırak — v1.1\'de geliyor</button></section>';
        const okuBtn = ben ? '' : '<button type="button" class="btn btn-birincil" id="vt-oku" data-action="kodOkudum" aria-disabled="true">' + ikon('goz', 18) + '<span id="vt-oku-yazi">Kodu Okudum (+10 XP)</span></button>';
        const istat = '<div class="vt-istat" role="group" aria-label="İstatistikler"><span class="chip chip-gri">' + ikon('kullanici', 14) + (ben ? 'Ziyaretçi 0' : 'Ziyaretçi ' + KOMSU.ziyaret) + '</span><span class="chip chip-amber">' + ikon('kutlama', 14) + 'Alkış ' + (ben ? 0 : KOMSU.alkis + (ev.alkisGun === I.bugun() ? 1 : 0)) + '</span>' + (ben ? '' : '<span class="mini soluk" id="vt-sayac" aria-live="polite">Bugün ' + ev.okunan + '/3</span>') + okuBtn + '</div>' + (!ben && kalanOdul <= 0 ? '<p class="mini soluk">Bugünkü kod okuma ödüllerini aldın (3/3). Okumaya devam edebilirsin.</p>' : '');
        const sek = ev.sekme || 'kod';
        root.innerHTML = '<div class="sayfa sayfa-genis vt vt-sek-' + esc(sek) + '">' + bas + '<div class="vt-baslik kart"><div><div class="vt-ad">' + esc(baslikAd) + ' <span class="mini soluk">· L' + seviye + ' · Çarşı · Tente Sokak No: 3</span></div></div>' + durumChip + (ben ? '' : '<button type="button" class="btn btn-altin btn-kucuk" data-action="alkisla">' + ikon('kutlama', 18) + 'Alkışla</button>') + '</div>' +
          '<div class="sekmeler vt-sekmeler" role="tablist" aria-label="Vitrin bölümleri">' + [['kod', 'Kod', 'kod'], ['sav', 'Savunma', 'kalkan'], ['not', 'Notlar', 'defter']].map(function (t) { return '<button type="button" role="tab" class="sekme' + (sek === t[0] ? ' aktif' : '') + '" aria-selected="' + (sek === t[0]) + '" data-action="sekme" data-s="' + t[0] + '">' + ikon(t[2], 18) + t[1] + '</button>'; }).join('') + '</div>' +
          '<div class="vt-izgara"><div class="vt-sol">' + kodBolum + '</div><div class="vt-sag yigin">' + cevap + notlar + '<div class="kart vt-alt">' + istat + '</div></div></div></div>';
        if (!spoiler && !ben) okumaIzle(ev);
      } catch (e) {
        KK_UI.hataKaydet(e, 'vitrin');
        root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Vitrin yüklenemedi.', { tekrar: 'yenile', tekrarAd: 'Tekrar Dene' }) + '</div>';
      }
    },
    actions: {
      yenile() { refresh(); }, panelAc() { go('panel'); },
      sekme(el) { I.ekran('vitrin', {}).sekme = el.getAttribute('data-s') || 'kod'; save(); refresh(); },
      vitrineGit(el) { I.ekran('vitrin', {}).ben = el.getAttribute('data-sahip') === 'ben'; save(); refresh(); },
      satiraBak() { const k = document.getElementById('vt-kod'); const m = k && k.querySelector('.kl.vurgu'); if (m) { k.scrollTop = Math.max(0, m.offsetTop - 60); } },
      alkisla() {
        const ev = I.ekran('vitrin', {}); if (ev.alkisGun === I.bugun()) { toast('Bugünkü alkışını verdin; yarın yine gel.', 'bilgi'); return; }
        ev.alkisGun = I.bugun(); ev.alkis = (ev.alkis || 0) + 1; save(); toast('Alkışladın! Sahibine 2 B gider.', 'basari'); refresh();
      },
      async kodOkudum(el) {
        const ev = I.ekran('vitrin', {}); if (ev.kodGun === I.bugun()) { toast('Bu kodu bugün okudun; yarın yeni bir kod seç.', 'bilgi'); return; }
        if (ev.okunan >= 3) { toast('Bugünkü kod okuma ödüllerini aldın (3/3). Okumaya devam edebilirsin.', 'bilgi'); return; }
        ev.okunan++; ev.kodGun = I.bugun(); save(); refresh(); await award({ xp: 10, etiket: 'Kod okudun', kaynak: el });
      }
    },
    async selftest(root, ctx) {
      if (!/Önce kendin dene/.test(root.textContent)) throw new Error('Açılmamış işletmede “Önce kendin dene” kartı beklenirdi');
      if (root.querySelector('#vt-kod')) throw new Error('Spoiler kuralı: kod gizli olmalı');
      const o = state.isletmeler.otopark; o.durum = 'acik'; o.acilisOdul = true; save(); refresh();
      await ctx.bekleSecici('#vt-kod'); const k = root.querySelector('#vt-kod'); k.scrollTop = k.scrollHeight; k.dispatchEvent(new Event('scroll'));
      if (root.querySelector('[data-action="kopyala"]')) throw new Error('Vitrin\'de kopyala düğmesi olmamalı');
      await ctx.bekleSecici('#vt-oku:not([aria-disabled="true"])', 6000);
      const x0 = state.xp; await ctx.tikla('#vt-oku'); await ctx.bekle(80); KK_UI.modalTemizle(); if (state.xp - x0 < 10) throw new Error('Kodu Okudum +10 XP vermedi (+' + (state.xp - x0) + ')');
      if (!/Bugün 1\/3/.test(root.textContent)) throw new Error('Günlük sayaç 1/3 olmalı');
    }
  });
  /** "Kodu Okudum": kod ≥20 sn görünür kalıp sonuna kaydırılınca etkinleşir (demo hızlı kipinde 1 sn). */
  function okumaIzle(ev) {
    const k = document.getElementById('vt-kod'), b = document.getElementById('vt-oku'), y = document.getElementById('vt-oku-yazi'); if (!k || !b) return;
    const esik = KK_UI.hizliMod ? 1 : 20; let gecen = 0, sonaGeldi = k.scrollHeight <= k.clientHeight + 6;
    k.addEventListener('scroll', function () { if (k.scrollTop + k.clientHeight >= k.scrollHeight - 6) sonaGeldi = true; });
    const guncelle = function () {
      const bitti = ev.kodGun === I.bugun(), tamam = gecen >= esik && sonaGeldi && !bitti;
      if (tamam) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true');
      if (y) y.textContent = bitti ? 'Bu kodu bugün okudun' : (tamam ? 'Kodu Okudum (+10 XP)' : 'Kodu Okudum (' + (gecen < esik ? Math.max(0, esik - Math.floor(gecen)) + ' sn' : 'sonuna kaydır') + ')');
    };
    guncelle(); KK_UI.aralik(function () { gecen += 0.5; guncelle(); }, 500);
  }
})();
