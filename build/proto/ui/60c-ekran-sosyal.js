/* ==== ui/60c-ekran-sosyal.js — P3 (4/4): Sohbet & Arkadaşlar (güvenli mod, hazır cümleler, moderasyon kuralları) ve Ayarlar & Hesap (KVKK, veli durumu, veri indirme/silme) ====
   Sohbet kuralları: 1 mesaj/3 sn, ≤200 karakter (güvenli modda ≤120), link/telefon/e-posta yok (B6 §7). Ceza sosyal yüzeyi kapatır, öğrenmeyi asla. */
(function () {
  const S = KK_UI.sosyal;
  const veri = S.veri;
  const FOLD = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
  const fold = function (s) { return String(s || '').toLocaleLowerCase('tr-TR').replace(/[çğıöşüâîû]/g, function (c) { return FOLD[c]; }); };

  /* ================= SOHBET ================= */
  const SH = { kanal: 'meydan', sekme: 'sohbet', bitis: 0, kategori: 0, hata: '', kriz: false };
  const HAZIR = [
    { ad: 'Selam', c: ['Merhaba!', 'Selam, ben {ad}.', 'Günaydın!', 'İyi akşamlar!', 'Selam, nasılsın?'] },
    { ad: 'Yardım', c: ["Bu görevde takıldım.", "Pusula'ya baktın mı?", 'Bunu birlikte düşünelim mi?', 'Yardım edebilir misin?', 'Yardım eder misin?'] },
    { ad: 'Oyun ve kod', c: ['Testlerim yeşil oldu!', 'Bugünkü Meydan Sorusu zordu.', 'Hangi derse geldin?', 'Otoparkım açıldı!', 'Hangi dersteyiz?', 'Ben de aynı soruda takıldım.'] },
    { ad: 'Tebrik', c: ['Tebrikler!', 'Harika bir işletme!', 'Seviye atlamışsın, helal olsun!', 'Odan çok güzel.', 'Güzel çözüm, aferin.'] },
    { ad: 'Teşekkür ve özür', c: ['Teşekkürler!', 'Çok sağ ol.', 'Özür dilerim, yanlışlıkla oldu.', 'Sorun değil.'] },
    { ad: 'Ziyaret ve veda', c: ['Odana bakabilir miyim?', 'Alkışladım!', 'Görüşürüz!', 'İyi geceler.'] }
  ];
  const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|tr|io|gg|me)\b|@\w+|\b0?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}\b|\S+@\S+\.\S+)/i;
  const YASAK = ['aptal', 'salak', 'gerizekali', 'budala', 'embesil'];
  const KRIZ_RE = /(intihar|kendimi\s+(oldur|bitir)|olmek\s+istiyorum|yasamak\s+istemiyorum)/;
  const KRIZ_METNI = 'Zor bir şey yaşıyor olabilirsin ve bunu tek başına taşımak zorunda değilsin. Güvendiğin bir yetişkinle konuş. Acil durumda 112\'yi, destek için ALO 183\'ü arayabilirsin.';
  const ALF = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const sohbetDurum = function () { const e = state.ekran; if (!e.sohbet) e.sohbet = { mesajlar: {}, istekler: [], engel: [] }; const d = e.sohbet; if (!d.mesajlar) d.mesajlar = {}; if (!d.istekler) d.istekler = []; if (!d.engel) d.engel = []; return d; };
  function kip() {
    const band = S.yasBandi(), veli = S.veliDurumu(), genc = band === 'genc';
    return { genc: genc, veli: veli, serbest: genc ? veli === 'onayli' : !state.ayarlar.guvenliMod, maks: genc ? 120 : 200, dm: genc ? veli === 'onayli' : true };
  }
  function davetKodu() {
    let h = S.hash((state.ad || 'oyuncu') + ':kodkent'), s = '';
    for (let i = 0; i < 8; i++) { s += ALF.charAt(h % ALF.length); h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0; if (i === 3) s += '-'; }
    return s;
  }
  S.davetKodu = davetKodu;
  function qrSvg(kod) {
    const n = 21, g = []; let h = S.hash(kod);
    for (let y = 0; y < n; y++) { g.push([]); for (let x = 0; x < n; x++) { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; h ^= h >>> 13; g[y].push((h & 7) < 3 ? 1 : 0); } }
    [[0, 0], [n - 7, 0], [0, n - 7]].forEach(function (p) { for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) g[p[1] + y][p[0] + x] = (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) ? 1 : 0; });
    let d = ''; g.forEach(function (satir, y) { satir.forEach(function (v, x) { if (v) d += 'M' + x + ' ' + y + 'h1v1h-1z'; }); });
    return '<svg class="sh-qr" viewBox="-2 -2 25 25" width="128" height="128" role="img" aria-label="Davet kodu için QR görseli (demo)"><rect x="-2" y="-2" width="25" height="25" fill="#fff"/><path d="' + d + '" fill="#0D1326"/></svg>';
  }
  function kanalMesajlari(kanal) {
    const d = sohbetDurum(), v = veri().sohbet || {}; let taban = [];
    if (kanal === 'meydan') taban = (v.meydan || []).map(function (m) { return { ad: m.ad, metin: m.metin, saat: m.saat }; });
    else if (kanal === 'dm:ayse_kod') taban = (v.dm || []).map(function (m) { return { ad: m.kimden === 'ben' ? (state.ad || 'sen') : m.kimden, metin: m.metin, saat: m.saat, ben: m.kimden === 'ben' }; });
    return taban.concat(d.mesajlar[kanal] || []).filter(function (m) { return d.engel.indexOf(m.ad) < 0; });
  }
  function hataGoster(m) { SH.hata = m; const e = $('#sh-hata'); if (e) e.textContent = m; }
  /** Gönderim: istemci bağlam kuralları (asıl denetim sunucudadır). → boolean */
  function gonder(metin, hazir) {
    const k = kip(), d = sohbetDurum(); metin = String(metin || '').trim();
    if (!metin) { hataGoster('Önce bir mesaj yaz.'); return false; }
    if (!hazir) {
      if (!k.serbest) { hataGoster(k.genc ? 'Serbest sohbet, veli onayından sonra açılır. O zamana kadar hazır cümlelerle sohbet edebilirsin.' : 'Güvenli mod açık: yalnızca hazır cümleler gönderilir.'); return false; }
      if (metin.length > k.maks) { hataGoster('En çok ' + k.maks + ' karakter yazabilirsin.'); return false; }
      if (KRIZ_RE.test(fold(metin))) { SH.kriz = true; SH.hata = ''; refresh(); return false; }
      if (LINK_RE.test(metin)) { hataGoster('Burada bağlantı ve kişisel bilgi paylaşılamaz. Arkadaşlık için davet kodunu kullanabilirsin.'); return false; }
      if (fold(metin).split(/[^a-z0-9]+/).some(function (t) { return YASAK.indexOf(t) >= 0; })) { hataGoster('Bu mesaj şehir kurallarına uymuyor, gönderilmedi. Kuralları görmek için Topluluk Kuralları\'na bak.'); return false; }
    }
    if (!KK_UI.hizliMod && Date.now() < SH.bitis) { hataGoster('Biraz yavaş: her 3 saniyede bir mesaj yazabilirsin.'); return false; }
    if (SH.kanal.indexOf('dm:') === 0 && !k.dm) { hataGoster('Bu oyuncuyla özel mesajlaşma açık değil. Odasını ziyaret edip Alkış bırakabilirsin.'); return false; }
    (d.mesajlar[SH.kanal] = d.mesajlar[SH.kanal] || []).push({ ad: state.ad || 'sen', metin: metin.replace(/\{ad\}/g, state.ad || 'oyuncu'), saat: S.saatMetni(), ben: true });
    SH.bitis = Date.now() + 3000; SH.hata = ''; SH.kriz = false; S.kaydet('Mesaj gönderilemedi. Tekrar dene.'); refresh(); return true;
  }
  function mesajHtml(m, i) {
    const ben = !!m.ben;
    return '<div class="sohbet-satir sh-mesaj' + (ben ? ' ben' : '') + '"><div class="balon' + (ben ? ' balon-ben' : '') + '"><div class="balon-ad">' + (ben ? esc(m.ad) + ' (sen)' : '@' + esc(m.ad)) + ' · ' + esc(m.saat) + '</div>' + esc(m.metin) + '</div>' + (ben ? '' : '<button type="button" class="btn btn-hayalet btn-kucuk btn-ikon sh-menu" data-action="sh-mesaj-menu" data-ad="' + esc(m.ad) + '" aria-label="' + esc(m.ad + ' mesajı için menü: bildir ya da engelle') + '">' + ikon('nokta-uc', 18) + '</button>') + '</div>';
  }
  function dostHtml(f) {
    const cev = f.durum === 'çevrimdışı' ? 'gri' : f.durum === 'çevrimiçi' ? 'nane' : 'turkuaz';
    return '<li class="satir sh-dost"><span class="ld-av" aria-hidden="true">' + avatarSvg(f.avatar || {}, { boyut: 40, kadraj: 'bust' }) + '</span><span class="satir-ana"><span class="satir-baslik">@' + esc(f.ad) + '</span><span class="satir-alt">' + esc(unvan(f.seviye)) + ' · Sev. ' + f.seviye + ' ' + chipHtml(f.durum, cev) + '</span></span><span class="satir-sag"><button type="button" class="btn btn-kucuk btn-ikon" data-action="sh-dm" data-ad="' + esc(f.ad) + '" aria-label="' + esc(f.ad + ' ile özel mesaj') + '">' + ikon('sohbet', 16) + '</button><button type="button" class="btn btn-kucuk btn-ikon btn-hayalet" data-action="sh-dost-oda" data-ad="' + esc(f.ad) + '" aria-label="' + esc(f.ad + ' odasına git') + '">' + ikon('ev', 16) + '</button><button type="button" class="btn btn-kucuk btn-ikon btn-hayalet" data-action="sh-dost-profil" data-ad="' + esc(f.ad) + '" aria-label="' + esc(f.ad + ' profili') + '">' + ikon('kullanici', 16) + '</button></span></li>';
  }
  function sohbetCiz(root) {
    const k = kip(), d = sohbetDurum(), v = veri().sohbet || {}, F = (v.arkadaslar || []).filter(function (f) { return d.engel.indexOf(f.ad) < 0; }), kod = davetKodu();
    const msgs = kanalMesajlari(SH.kanal), dm = SH.kanal.indexOf('dm:') === 0, hizli = KK_UI.hizliMod || KK_UI.selftestAktif, bekliyor = !hizli && Date.now() < SH.bitis;
    const kanalBtn = function (id, ad, ik) { return '<button type="button" class="sh-kanal' + (SH.kanal === id ? ' aktif' : '') + '" aria-pressed="' + (SH.kanal === id) + '" data-action="sh-kanal" data-kanal="' + esc(id) + '">' + ikon(ik, 18) + '<span>' + esc(ad) + '</span></button>'; };
    const kat = HAZIR[SH.kategori] || HAZIR[0];
    const akis = msgs.length ? msgs.map(mesajHtml).join('') : '<p class="soluk sh-bos">' + (dm ? 'Henüz mesaj yok. ' + (k.dm ? 'İlk selamı sen ver.' : 'DM, veli onayından sonra açılır.') : 'Burası şimdilik sessiz. İlk selamı sen ver.' + (k.serbest ? '' : ' Aşağıdaki hazır cümlelerden birini seçebilirsin.')) + '</p>';
    const girisKapali = !k.serbest || (dm && !k.dm);
    const baslik = SH.kanal === 'meydan' ? 'Meydan · shard 07 · 23 kişi' : SH.kanal === 'oda' ? 'Oda sohbeti' : '@' + SH.kanal.slice(3) + ' ile özel mesaj';
    root.innerHTML = '<div class="sayfa sayfa-genis sh-sayfa"><div class="sayfa-baslik"><h1>Sohbet &amp; Arkadaşlar</h1>' + (k.genc ? chipHtml('Güvenli mod · 15–17', 'turkuaz', 'kalkan') : '<label class="anahtar sh-guvenli" for="sh-guvenli"><input type="checkbox" role="switch" id="sh-guvenli" data-input="sh-guvenli"' + (state.ayarlar.guvenliMod ? ' checked' : '') + '><span class="anahtar-iz"></span><span>Güvenli mod</span></label>') + '</div>' +
      '<div class="sekmeler sh-sekmeler" role="tablist" aria-label="Sohbet bölümleri">' + [['sohbet', 'Sohbet'], ['arkadaslar', 'Arkadaşlar'], ['davet', 'Davet']].map(function (s) { return '<button type="button" role="tab" id="sh-sekme-' + s[0] + '" class="sekme" aria-selected="' + (SH.sekme === s[0]) + '" data-action="sh-sekme" data-sekme="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="sh-duzen" data-gor="' + SH.sekme + '"><nav class="sh-kanallar" aria-label="Kanallar">' + kanalBtn('meydan', 'Meydan', 'harita') + kanalBtn('oda', 'Oda', 'ev') + F.map(function (f) { return kanalBtn('dm:' + f.ad, f.ad, 'mektup'); }).join('') + '</nav>' +
      '<section class="sh-orta kart" aria-label="Mesajlar"><h2 class="sh-baslik">' + esc(baslik) + '</h2><div class="sh-akis" id="sh-akis" role="log" aria-live="polite" aria-label="Mesaj akışı">' + akis + (SH.kriz ? '<div class="sh-kriz" role="alert">' + balonHtml(KRIZ_METNI, { tur: 'sistem', ad: 'Yalnızca sana görünür' }) + '</div>' : '') + '</div>' +
      (!k.serbest && !dm ? '<p class="mini soluk sh-not">' + ikon('kilit', 14) + (k.genc ? 'Serbest sohbet, veli onayından sonra açılır. O zamana kadar hazır cümlelerle sohbet edebilirsin. Veline gönderilen bağlantı 72 saat geçerli.' : 'Güvenli mod açık: yalnızca hazır cümleler gönderilir.') + '</p>' : '') +
      (dm && !k.dm ? '<p class="pz-neden">' + ikon('kilit', 16) + 'Bu oyuncuyla özel mesajlaşma açık değil. Odasını ziyaret edip Alkış bırakabilirsin. (DM, veli onayından sonra yalnız 15–17 arkadaşlarla açılır.)</p>' : '') +
      '<form class="sh-giris" data-submit="sh-gonder" autocomplete="off"><label class="sr" for="sh-girdi">Mesajın</label><input id="sh-girdi" class="girdi" type="text" maxlength="' + k.maks + '" data-input="sh-yaz" placeholder="' + (girisKapali ? 'Serbest metin kapalı: hazır cümle seç' : 'Mesajını yaz (en çok ' + k.maks + ' karakter)') + '"' + (girisKapali ? ' disabled' : '') + '><button type="submit" id="sh-btn" class="btn btn-birincil"' + (girisKapali || bekliyor ? ' aria-disabled="true"' : '') + '>' + ikon('gonder', 18) + '<span id="sh-btn-yazi">' + (bekliyor ? '3 sn' : 'Gönder') + '</span></button></form>' +
      '<div class="sh-alt"><span class="mini soluk" id="sh-say">0/' + k.maks + '</span><span class="hata-yazi" id="sh-hata" role="alert">' + esc(SH.hata) + '</span></div>' +
      '<div class="sh-hazir"><div class="sekmeler sekmeler-kaydir" role="group" aria-label="Hazır cümle kategorileri">' + HAZIR.map(function (c, i) { return '<button type="button" class="sekme' + (SH.kategori === i ? ' aktif' : '') + '" aria-pressed="' + (SH.kategori === i) + '" data-action="sh-kategori" data-i="' + i + '">' + esc(c.ad) + '</button>'; }).join('') + '</div><div class="sh-cumleler">' + kat.c.map(function (c) { return '<button type="button" class="chip chip-buyuk sh-cumle" data-action="sh-hazir" data-metin="' + esc(c) + '"' + (dm && !k.dm ? ' aria-disabled="true"' : '') + '>' + esc(c.replace(/\{ad\}/g, state.ad || 'oyuncu')) + '</button>'; }).join('') + '</div></div></section>' +
      '<aside class="sh-yan"><section class="kart sh-arkadas" aria-label="Arkadaşlar"><h2 class="kart-baslik">' + ikon('kullanicilar', 20) + 'Arkadaşlar <span class="chip chip-gri">' + F.length + '/100</span></h2>' +
      (F.length ? '<ul class="liste">' + F.map(dostHtml).join('') + '</ul>' : '<p class="soluk">Henüz arkadaşın yok. Davet kodun ' + kod + '. Arkadaşın ilk Bayt\'ını kazanınca ikiniz de 100 B alırsınız.</p>') +
      (d.istekler.length ? '<p class="mini soluk">Bekleyen istek (' + d.istekler.length + '/20): ' + d.istekler.map(function (x) { return '@' + esc(x); }).join(', ') + '</p>' : '') +
      '<form class="sh-ekle" data-submit="sh-arkadas-ekle"><label class="etiket" for="sh-arkadas-girdi">Arkadaş ekle: takma ad ya da davet kodu</label><div class="girdi-grup"><input id="sh-arkadas-girdi" class="girdi" type="text" maxlength="17" placeholder="ör. ayse_kod ya da 7H3Q-9XM2"><button type="submit" class="btn btn-birincil">Ekle</button></div><p class="hata-yazi" id="sh-ekle-hata" role="alert"></p></form>' +
      '<p class="mini soluk">Arkadaş Ligi: arkadaşlarının haftalık XP tablosu <button type="button" class="btn-baglanti" data-action="sh-lig">Liderlik\'te gör</button></p></section>' +
      '<section class="kart sh-davet" aria-label="Davet kodu"><h2 class="kart-baslik">' + ikon('hediye', 20) + 'Davet Kodu</h2><div class="sh-davet-ic">' + qrSvg(kod) + '<div><div class="sh-kod" aria-label="Davet kodun: ' + kod + '">' + kod + '</div><div class="sira-s"><button type="button" class="btn btn-kucuk btn-altin" data-action="sh-kopyala">' + ikon('kopyala', 16) + 'Kopyala</button><button type="button" class="btn btn-kucuk btn-hayalet" data-action="sh-paylas">Paylaş</button></div></div></div><p class="mini soluk">Arkadaşın kayıtta kodu girip ilk Bayt\'ını kazanınca ikiniz de 100 B alırsınız (ayda en çok 5 davet). QR görseli demodur.</p></section></aside></div></div>';
    const akisEl = $('#sh-akis', root); if (akisEl) akisEl.scrollTop = akisEl.scrollHeight;
    if (bekliyor) {
      KK_UI.aralik(function () {
        const kalan = Math.ceil((SH.bitis - Date.now()) / 1000), b = $('#sh-btn'), y = $('#sh-btn-yazi');
        if (!b || !y) return;
        if (kalan <= 0) { if (!(girisKapali)) b.removeAttribute('aria-disabled'); y.textContent = 'Gönder'; } else y.textContent = kalan + ' sn';
      }, 250);
    }
  }
  KK_UI.screen('sohbet', {
    ad: 'Sohbet & Arkadaşlar', hud: true,
    async render(root, ctx) {
      root.classList.add('scr-sosyal');
      if (ctx.ilk) {
        SH.hata = ''; SH.kriz = false;
        root.innerHTML = '<div class="sayfa sayfa-genis sh-sayfa" aria-busy="true"><div class="sayfa-baslik"><h1>Sohbet &amp; Arkadaşlar</h1></div>' + yukleniyorHtml('Sohbet bağlanıyor…') + '<div class="yigin">' + Array.apply(null, Array(5)).map(function () { return '<span class="iskelet" style="height:48px"></span>'; }).join('') + '</div></div>';
        await bekle(260);
        if (KK_UI.current() !== 'sohbet') return;
      }
      try { sohbetCiz(root); } catch (e) { KK_UI.hataKaydet(e, 'sohbet'); root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Mesaj gönderilemedi. Tekrar dene.', { baslik: 'Sohbet açılamadı', tekrar: 'sh-yenile' }) + '</div>'; }
    },
    actions: {
      'sh-yenile': function () { refresh(); },
      'sh-sekme': function (el) { SH.sekme = el.getAttribute('data-sekme'); refresh(); },
      'sh-kanal': function (el) { SH.kanal = el.getAttribute('data-kanal'); SH.sekme = 'sohbet'; SH.hata = ''; SH.kriz = false; refresh(); },
      'sh-kategori': function (el) { SH.kategori = Number(el.getAttribute('data-i')) || 0; refresh(); },
      'sh-yaz': function (el) { const s = $('#sh-say'); if (s) s.textContent = el.value.length + '/' + kip().maks; if (SH.hata) hataGoster(''); },
      'sh-gonder': function () { const g = $('#sh-girdi'); if (!g || g.disabled) { hataGoster('Serbest metin kapalı: hazır cümle seç.'); return; } gonder(g.value, false); },
      'sh-hazir': function (el) { const k = kip(); if (SH.kanal.indexOf('dm:') === 0 && !k.dm) { hataGoster('Bu oyuncuyla özel mesajlaşma açık değil.'); return; } gonder(el.getAttribute('data-metin'), true); },
      'sh-guvenli': function (el) { state.ayarlar.guvenliMod = !!el.checked; S.kaydet(); toast(el.checked ? 'Güvenli mod açık: yalnızca hazır cümleler.' : 'Güvenli mod kapalı.', 'bilgi'); refresh(); },
      'sh-dm': function (el) { SH.kanal = 'dm:' + el.getAttribute('data-ad'); SH.sekme = 'sohbet'; refresh(); },
      'sh-dost-oda': function (el) { go('oda', { parametre: { oda: el.getAttribute('data-ad') } }); },
      'sh-dost-profil': function (el) { go('profil', { parametre: { oyuncu: el.getAttribute('data-ad') } }); },
      'sh-lig': function () { go('liderlik'); },
      'sh-mesaj-menu': function (el) {
        const ad = el.getAttribute('data-ad');
        modal({ sinif: 'scr-sosyal', baslik: '@' + ad + ' mesajı', ikon: 'nokta-uc', html: '<p class="soluk">Bu mesajla ne yapmak istersin?</p>', butonlar: [{ ad: 'Vazgeç' },
          { ad: 'Bildir', veri: 'sh-bildir', aksiyon: function (m) { m.kapandi.then(function () { S.bildirModal('Mesajı bildir'); }); } },
          { ad: 'Engelle', tehlike: true, veri: 'sh-engelle', aksiyon: function () { const d = sohbetDurum(); if (d.engel.indexOf(ad) < 0) d.engel.push(ad); S.kaydet(); toast(ad + ' engellendi. Mesajlarını artık görmezsin. İstersen Ayarlar > Gizlilik ve KVKK > Engellenenler\'den kaldırabilirsin.', 'bilgi'); refresh(); } }] });
      },
      'sh-arkadas-ekle': function () {
        const g = $('#sh-arkadas-girdi'), h = $('#sh-ekle-hata'), d = sohbetDurum(), v = g ? g.value.trim() : '';
        const hata = function (m) { if (h) h.textContent = m; };
        if (!v) { hata('Bir takma ad ya da davet kodu yaz.'); return; }
        const kodMu = /^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/i.test(v), adMu = /^[A-Za-z0-9_.ğüşöçıİĞÜŞÖÇ]{3,16}$/.test(v);
        if (!kodMu && !adMu) { hata('3–16 karakterlik bir takma ad ya da XXXX-XXXX biçiminde davet kodu yaz.'); return; }
        if (kodMu && v.toUpperCase() === davetKodu()) { hata('Bu senin kendi davet kodun.'); return; }
        if (d.istekler.length >= 20) { hata('Bekleyen istek sınırı doldu (20).'); return; }
        const ad = kodMu ? v.toUpperCase() : v; d.istekler.push(ad); S.kaydet();
        toast(ad + ' için istek gönderildi. Karşılıklı onay gerekir.', 'basari'); refresh();
      },
      'sh-kopyala': function () { const kod = davetKodu(); kopyala(kod).then(function (ok) { toast(ok ? "Kod kopyalandı. Arkadaşın ilk Bayt'ını kazandığında ikiniz de 100 B alırsınız (ayda en çok 5 davet)." : 'Kopyalanamadı; kodu elle seçip kopyalayabilirsin: ' + kod, ok ? 'basari' : 'uyari'); }); },
      'sh-paylas': function () {
        const kod = davetKodu(), metin = 'KodKent davet kodum: ' + kod;
        if (navigator.share) { navigator.share({ title: 'KodKent', text: metin }).catch(function () { /* paylaşım iptal edildi */ }); }
        else kopyala(metin).then(function (ok) { toast(ok ? 'Paylaşım metni kopyalandı.' : 'Paylaşım bu cihazda desteklenmiyor.', ok ? 'basari' : 'uyari'); });
      }
    },
    leave() { /* zamanlayıcılar KK_UI.aralik ile temizlenir */ },
    async selftest(root, ctx) {
      await ctx.bekleSecici('#sh-girdi');
      const n0 = (sohbetDurum().mesajlar.meydan || []).length;
      await ctx.yaz('#sh-girdi', 'Merhaba, Çarşı Sınavı için hazır mısınız?'); await ctx.tikla('#sh-btn');
      if ((sohbetDurum().mesajlar.meydan || []).length !== n0 + 1) throw new Error('mesaj gönderilmedi');
      await ctx.yaz('#sh-girdi', 'bak www.ornek.com adresine'); await ctx.tikla('#sh-btn');
      if (!/bağlantı/.test(ctx.metin('#sh-hata'))) throw new Error('bağlantı engeli çalışmadı');
      if ((sohbetDurum().mesajlar.meydan || []).length !== n0 + 1) throw new Error('bağlantılı mesaj gönderildi');
      await ctx.tikla('[data-action="sh-hazir"]');
      if ((sohbetDurum().mesajlar.meydan || []).length !== n0 + 2) throw new Error('hazır cümle gönderilmedi');
      await ctx.yaz('#sh-arkadas-girdi', '7H3Q-9XM2'); await ctx.tikla('.sh-ekle button[type="submit"]');
      if (sohbetDurum().istekler.length !== 1) throw new Error('arkadaş isteği eklenmedi');
      await ctx.tikla('[data-action="sh-dm"]');
      if (SH.kanal.indexOf('dm:') !== 0) throw new Error('DM kanalı açılmadı');
      SH.kanal = 'meydan';
    }
  });

  /* ================= AYARLAR ================= */
  const AY = { bolum: 'genel', mobil: false, sil: null, indir: null };
  const BOLUMLER = [['genel', 'Genel', 'disli'], ['bildirim', 'Bildirimler', 'zil'], ['ses', 'Ses ve Görüntü', 'ses'], ['erisim', 'Erişilebilirlik', 'goz'], ['gizlilik', 'Gizlilik ve KVKK', 'kalkan'], ['veli', 'Veli Durumu', 'kullanicilar'], ['dil', 'Dil Kartları', 'kod'], ['hesap', 'Hesap', 'kullanici']];
  const EK0 = { muzik: 50, efekt: 80, ortam: 50, titresim: true, dusukCihaz: false, hareketAzalt: 'sistem', veriTasarrufu: false, metinBoyutu: 100, yuksekKontrast: false, renkKorlugu: false, wasd: false, sahneListesi: false, sessizSaat: true, bildirim: { kasa: true, hata: true, alkis: true, lig: true, arkadas: true }, izin: { analitik: false, pazarlama: false, aiKalibrasyon: false }, dilBekleme: [], veliGonderim: 0 };
  const DIL_AD = { python: 'Python', javascript: 'JavaScript', java: 'Java', kotlin: 'Kotlin', go: 'Go' };
  function ek() {
    const a = state.ayarlar; if (!a.ek) a.ek = JSON.parse(JSON.stringify(EK0));
    Object.keys(EK0).forEach(function (k) { if (!(k in a.ek)) a.ek[k] = JSON.parse(JSON.stringify(EK0[k])); });
    ['bildirim', 'izin'].forEach(function (k) { Object.keys(EK0[k]).forEach(function (x) { if (!(x in a.ek[k])) a.ek[k][x] = EK0[k][x]; }); });
    if (!Array.isArray(a.dilBekleme)) a.dilBekleme = [];
    return a.ek;
  }
  const yolAl = function (yol) { return yol.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, state.ayarlar); };
  function yolYaz(yol, deger) { const p = yol.split('.'), son = p.pop(); let o = state.ayarlar; p.forEach(function (k) { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; }); o[son] = deger; }
  function tercihUygula() {
    const e = ek(), sc = document.getElementById('screen'), r = document.documentElement.style;
    if (sc) sc.style.zoom = e.metinBoyutu === 100 ? '' : String(e.metinBoyutu / 100);
    if (e.yuksekKontrast) { r.setProperty('--muted', '#C5CEE4'); r.setProperty('--line-2', '#6F82BD'); } else { r.removeProperty('--muted'); r.removeProperty('--line-2'); }
  }
  S.tercihUygula = tercihUygula;
  const anahtar = function (yol, etiket, not, devre) {
    const id = 'ay-' + yol.replace(/\./g, '-');
    return '<label class="anahtar ay-satir" for="' + id + '"><input type="checkbox" role="switch" id="' + id + '" data-input="ay-anahtar" data-ayar="' + yol + '"' + (yolAl(yol) ? ' checked' : '') + (devre ? ' disabled' : '') + '><span class="anahtar-iz"></span><span class="ay-etiket"><b>' + etiket + '</b>' + (not ? '<small>' + not + '</small>' : '') + '</span></label>';
  };
  const kaydirici = function (yol, etiket, devre) {
    const id = 'ay-' + yol.replace(/\./g, '-');
    return '<div class="ay-satir ay-kaydirici"><label for="' + id + '"><b>' + etiket + '</b> <span class="mini soluk" id="' + id + '-d">' + (yolAl(yol) | 0) + '</span></label><input type="range" id="' + id + '" min="0" max="100" step="5" value="' + (yolAl(yol) | 0) + '" data-input="ay-kaydirici" data-ayar="' + yol + '"' + (devre ? ' disabled' : '') + '></div>';
  };
  const maskeTel = function (t) { const d = String(t || '').replace(/\D/g, ''); return d.length >= 10 ? '+90 ' + d.charAt(d.length - 10) + '•• ••• •• ' + d.slice(-2) : '+90 5•• ••• •• ••'; };
  function bolumHtml(b) {
    const e = ek(), a = state.ayarlar, band = S.yasBandi(), genc = band === 'genc', v = veri(), kv = (v.metinler && v.metinler.kvkk) || {};
    switch (b) {
      case 'genel':
        return '<div class="ay-satir"><span class="ay-etiket"><b>Takma ad</b><small>@' + esc(state.ad || 'misafir') + '</small></span><button type="button" class="btn btn-kucuk" data-action="ay-ad-degistir">Değiştir — 500 B</button></div>' +
          '<div class="ay-satir"><span class="ay-etiket"><b>Telefon</b><small>' + esc(maskeTel(state.telefon)) + '</small></span></div>' +
          anahtar('derinDegerlendirme', 'Derin değerlendirme', 'Daha yavaş, daha isabetli Kurul puanı (' + esc(aiDurumMetni()) + ').') + anahtar('guvenliMod', 'Güvenli mod', genc ? '15–17 yaş hesaplarda zorunludur.' : 'Sohbette yalnızca hazır cümleler gönderilir.', genc) +
          '<div class="ay-satir"><button type="button" class="btn btn-hayalet" data-action="ay-cikis">' + ikon('cikis', 18) + 'Çıkış Yap</button></div>';
      case 'bildirim':
        return '<p class="soluk">Tarayıcı bildirim izni bu demoda istenmez. Günlük bildirim sayısı sınırlıdır; sessiz saatlerde bildirim gelmez.</p>' + anahtar('ek.bildirim.kasa', 'Kasa doldu') + anahtar('bildirim.seri', 'Günlük Tekrar ve seri') + anahtar('ek.bildirim.hata', 'Hata Bildirimi') + anahtar('ek.bildirim.alkis', 'Alkış ve ziyaretçi') + anahtar('ek.bildirim.lig', 'Lig kapanışı') + anahtar('ek.bildirim.arkadas', 'Arkadaş') + anahtar('bildirim.gorev', 'Görev hatırlatması') + anahtar('bildirim.etkinlik', 'Etkinlik duyuruları') + anahtar('ek.sessizSaat', 'Sessiz saatler', genc ? '21:00–08:00 (15–17 varsayılanı)' : '22:00–08:00');
      case 'ses':
        return anahtar('ses', 'Ses', 'Varsayılan kapalı. Açınca kaydırıcılar etkinleşir.') + kaydirici('ek.muzik', 'Müzik', !a.ses) + kaydirici('ek.efekt', 'Efekt', !a.ses) + kaydirici('ek.ortam', 'Ortam', !a.ses) + anahtar('ek.titresim', 'Titreşim') + anahtar('ek.dusukCihaz', 'Düşük cihaz modu', 'Animasyonları sadeleştirir (otomatik önerilir).') + anahtar('ek.veriTasarrufu', 'Veri tasarrufu') +
          '<div class="ay-satir"><label for="ay-hareket"><b>Hareketi azalt</b></label><select id="ay-hareket" class="girdi ay-secim" data-input="ay-secim" data-ayar="ek.hareketAzalt">' + [['sistem', 'Sistem'], ['acik', 'Açık'], ['kapali', 'Kapalı']].map(function (o) { return '<option value="' + o[0] + '"' + (e.hareketAzalt === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>';
      case 'erisim':
        return '<fieldset class="ay-grup"><legend><b>Metin boyutu</b></legend><div class="ay-radyo">' + [100, 125, 150].map(function (p) { return '<label class="secim-kart"><input type="radio" name="ay-boyut" value="' + p + '" data-input="ay-boyut"' + (e.metinBoyutu === p ? ' checked' : '') + '><span><b>%' + p + '</b></span></label>'; }).join('') + '</div></fieldset>' +
          anahtar('ek.yuksekKontrast', 'Yüksek kontrast') + anahtar('ek.renkKorlugu', 'Renk körü modu', 'Renk yerine desen ve şekil vurgulanır.') + anahtar('ek.wasd', 'WASD ile yürü') + anahtar('ek.sahneListesi', 'Sahne listesi', 'Erişilebilir Dünya Katmanı: sahnedeki nesneler liste olarak da sunulur.') +
          '<div class="ay-satir"><button type="button" class="btn btn-kucuk btn-hayalet" data-action="ay-kisayol">Kısayol yardımı</button></div>';
      case 'gizlilik': {
        const engel = sohbetDurum().engel;
        return '<div class="yigin"><details class="kart ay-yasal"><summary>Aydınlatma Metni <small class="soluk">v1.0 · 2 Kasım 2026</small></summary><article><p>' + esc(kv.aydinlatma || 'KodKent yalnızca hesabını doğrulamak için telefon numaranı işler.') + '</p></article></details>' +
          '<details class="kart ay-yasal"><summary>Gizlilik Politikası <small class="soluk">v1.0</small></summary><article><p>Telefon numaran yalnızca giriş doğrulaması içindir ve düz metin saklanmaz. Cevapların ve kodların öğrenme amacıyla değerlendirilir. Yapay zekâya gerçek ad, telefon ya da konum gitmez. Verilerini istediğin an Hesap bölümünden indirebilir ya da silebilirsin.</p></article></details>' +
          '<details class="kart ay-yasal"><summary>Kullanım Koşulları <small class="soluk">v1.0</small></summary><article><p>KodKent 15+ bir öğrenme oyunudur. Bayt satın alınamaz; Çip yalnızca kozmetiktir. Sohbette bağlantı, telefon ve kişisel bilgi paylaşılamaz. Ceza sosyal yüzeyi kapatır, öğrenmeyi asla kapatmaz.</p></article></details></div>' +
          '<h3 class="ay-alt-baslik">İzinler <small class="soluk">(hepsi varsayılan kapalı)</small></h3>' + anahtar('ek.izin.analitik', 'Ürün analitiği', 'Anonim kullanım ölçümü.') + anahtar('ek.izin.pazarlama', 'Pazarlama iletileri', genc ? '18 yaş altına pazarlama iletisi gönderilmez.' : 'Kampanya ve yenilik haberleri.', genc) + anahtar('ek.izin.aiKalibrasyon', 'Yapay zekâ kalibrasyonu', 'Puanlama kalitesini iyileştirmek için cevapların anonim kullanılır.') +
          '<h3 class="ay-alt-baslik">Engellenenler</h3>' + (engel.length ? '<ul class="liste">' + engel.map(function (ad) { return '<li class="satir"><span class="satir-ana"><span class="satir-baslik">@' + esc(ad) + '</span></span><button type="button" class="btn btn-kucuk btn-hayalet" data-action="ay-engel-kaldir" data-ad="' + esc(ad) + '">Kaldır</button></li>'; }).join('') + '</ul>' : '<p class="soluk">Kimseyi engellemedin.</p>');
      }
      case 'veli': {
        const durum = S.veliDurumu();
        const demo = '<fieldset class="kart ay-demo"><legend class="kart-baslik">' + ikon('parlak', 18) + 'Demo: yaş bandını dene</legend><p class="mini soluk">Gerçek üründe yaş e-Devlet doğrulamasıyla belirlenir. Burada Sohbet, Oda, Pazar ve Çip davranışını görmek için değiştirebilirsin.</p><div class="ay-radyo">' + [['yetiskin', '18+'], ['genc-bekliyor', '15–17 · veli onayı bekliyor'], ['genc-onayli', '15–17 · veli onaylı']].map(function (o) { const sec = o[0] === 'yetiskin' ? !genc : (genc && (o[0] === 'genc-onayli') === (durum === 'onayli')); return '<label class="secim-kart"><input type="radio" name="ay-yas" value="' + o[0] + '" data-input="ay-yas"' + (sec ? ' checked' : '') + '><span><b>' + o[1] + '</b></span></label>'; }).join('') + '</div></fieldset>';
        if (!genc) return '<p class="kart kart-nane">' + ikon('test-gecti', 20) + ' Bu hesap için veli onayı gerekmiyor.</p>' + demo;
        const onayli = durum === 'onayli', g = e.veliGonderim || 0;
        return '<div class="kart ' + (onayli ? 'kart-nane' : 'kart-amber') + '"><div class="sira"><b>Veli onayı</b>' + chipHtml(onayli ? 'Onaylandı' : 'Onay bekleniyor (72 sa içinde)', onayli ? 'nane' : 'amber', onayli ? 'tik' : 'saat') + '</div><div class="tablo-kap"><table class="tablo"><thead><tr><th scope="col">Özellik</th><th scope="col">Durum</th></tr></thead><tbody>' +
          [['Öğrenme, görev, işletme, lig', 'Açık'], ['Hazır cümle ve emote', 'Açık'], ['Serbest metin sohbet', onayli ? 'Açık (≤120 karakter)' : 'Kapalı'], ['DM', onayli ? 'Yalnız 15–17 arkadaşlar' : 'Kapalı'], ['Çip alışverişi', 'Kapalı (aylık limit 0; veli açar)'], ['Oda izni', 'Arkadaşlara']].map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
          (onayli ? '' : '<div class="kart-alt"><button type="button" class="btn btn-birincil" data-action="ay-veli-gonder"' + (g >= 3 ? ' aria-disabled="true"' : '') + '>Veliye Tekrar Gönder</button><span class="mini soluk">7 günde en çok 3 gönderim · bu hafta ' + g + '/3</span></div>') + '<p class="mini soluk">Veli paneli, SMS bağlantısıyla açılan ve hesap gerektirmeyen ayrı bir sayfadır: süre ve harcama limiti, sohbet ve DM izni.</p></div>' + demo;
      }
      case 'dil': {
        Object.keys(state.bekleme || {}).forEach(function (k) { if (state.bekleme[k] && a.dilBekleme.indexOf(k) < 0) a.dilBekleme.push(k); }); const L = a.dilBekleme, diger = Object.keys(DIL_AD).filter(function (k) { return L.indexOf(k) < 0; });
        return (L.length ? '<ul class="liste">' + L.map(function (k) { return '<li class="satir"><span class="satir-ana"><span class="satir-baslik">' + esc(DIL_AD[k] || k) + '</span><span class="satir-alt">Listedesin: hazır olunca haber verilir.</span></span><button type="button" class="btn btn-kucuk btn-hayalet" data-action="ay-dil-vazgec" data-dil="' + esc(k) + '">Vazgeç</button></li>'; }).join('') + '</ul>' : '<p class="soluk">Hiçbir dil için bekleme listesinde değilsin.</p>') +
          (diger.length ? '<div class="ay-satir"><label for="ay-dil-sec"><b>Listeye ekle</b></label><select id="ay-dil-sec" class="girdi ay-secim">' + diger.map(function (k) { return '<option value="' + k + '">' + DIL_AD[k] + '</option>'; }).join('') + '</select><button type="button" class="btn btn-kucuk" data-action="ay-dil-ekle">Ekle</button></div>' : '') + '<p class="mini soluk">Şimdilik C# açık. Diğer diller yolda; telefon numaran bu liste için kullanılmaz.</p>';
      }
      default: {
        const t = a.silmeTalebi;
        return (t ? '<div class="kart kart-mercan" role="status"><b>Hesap silme talebin alındı.</b><p>' + esc(new Date(t.bitis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })) + ' tarihine kadar vazgeçebilirsin; bu sürede hesabın açık kalır.</p><button type="button" class="btn btn-kucuk" data-action="ay-sil-vazgec">Vazgeç</button></div>' : '') +
          '<div class="ay-tehlike"><h3>' + ikon('uyari', 20) + 'Hesap işlemleri</h3><p class="soluk">Verilerin sana aittir (KVKK). İkisi de telefon koduyla yeniden doğrulama ister.</p><div class="sira-s"><button type="button" class="btn" data-action="ay-indir-baslat">' + ikon('indir', 18) + 'Verilerimi İndir</button><button type="button" class="btn btn-tehlike" data-action="ay-sil-baslat">' + ikon('cop', 18) + 'Hesabımı Sil</button></div></div>';
      }
    }
  }
  function ayarlarCiz(root) {
    const bolum = BOLUMLER.filter(function (b) { return b[0] === AY.bolum; })[0] || BOLUMLER[0];
    root.innerHTML = '<div class="sayfa sayfa-genis ay-sayfa"><div class="sayfa-baslik"><h1>Ayarlar &amp; Hesap</h1></div><div class="ay-duzen" data-gor="' + (AY.mobil ? 'detay' : 'menu') + '"><nav class="ay-menu" aria-label="Ayar bölümleri"><ul class="liste">' +
      BOLUMLER.map(function (b) { return '<li><button type="button" class="satir satir-tikla ay-menu-oge' + (b[0] === bolum[0] ? ' secili' : '') + '" id="ay-bolum-' + b[0] + '" data-action="ay-bolum" data-bolum="' + b[0] + '" aria-current="' + (b[0] === bolum[0] ? 'page' : 'false') + '">' + ikon(b[2], 20) + '<span class="satir-ana"><span class="satir-baslik">' + b[1] + '</span></span>' + ikon('ok-sag', 16) + '</button></li>'; }).join('') + '</ul></nav>' +
      '<section class="kart ay-detay" aria-labelledby="ay-baslik"><div class="ay-ust"><button type="button" class="btn btn-hayalet btn-kucuk ay-geri" data-action="ay-geri">' + ikon('ok-sol', 16) + 'Ayarlar</button><h2 id="ay-baslik">' + bolum[1] + '</h2></div><div class="ay-form" id="ay-form">' + bolumHtml(bolum[0]) + '</div></section></div></div>';
  }
  /* ---- OTP + silme + indirme sihirbazı ---- */
  const otpHtml = function (tur, hata) {
    return '<div class="ay-sihirbaz"><p>' + (tur === 'sil' ? 'Hesabı silmek için' : 'Verilerini indirmek için') + ' telefonuna gelen kodu gir.</p><div class="alan"><label class="etiket" for="ay-otp">Doğrulama kodu</label><input id="ay-otp" class="girdi" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6 haneli kod"></div><p class="mini soluk">Demo: kod 123456</p><p class="hata-yazi" id="ay-otp-hata" role="alert">' + esc(hata || '') + '</p><div class="modal-alt ay-alt"><button type="button" class="btn btn-hayalet" data-action="ay-sihirbaz-kapat">Vazgeç</button><button type="button" class="btn btn-birincil" data-action="ay-otp-tamam" data-tur="' + tur + '">Doğrula</button></div></div>';
  };
  const silAdim1 = function () {
    return '<div class="ay-sihirbaz"><p><b>Adım 1/4 · Ne silinir, ne saklanır?</b></p><div class="izgara-2"><div><h4>Silinir</h4><ul class="ay-liste">' + ['Telefon numaran', 'Takma ad ve profil', 'Cevapların ve Kurul kayıtların', 'Kodların ve Vitrin', 'Sohbet mesajların', 'Oda ve envanter görünümün'].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div><div><h4>Yasal olarak saklanır</h4><ul class="ay-liste"><li>Çip satın alma ve fatura kayıtları (vergi mevzuatı, 10 yıl)</li><li>Defter satırları, kimliksiz (ekonomi bütünlüğü, 2 yıl)</li></ul></div></div><p class="pz-neden">' + ikon('uyari', 16) + 'Kalan Çip\'in TL karşılığı iade edilmez. Silme, 7 günlük bekleme süresinden sonra uygulanır.</p><div class="modal-alt ay-alt"><button type="button" class="btn btn-hayalet" data-action="ay-sihirbaz-kapat">Vazgeç</button><button type="button" class="btn btn-tehlike" data-action="ay-sil-devam">Devam</button></div></div>';
  };
  const silAdim3 = function () {
    return '<div class="ay-sihirbaz"><p><b>Adım 3/4 · Onayla</b></p><p>Silme talebini göndermek için aşağıya <b>HESABIMI SİL</b> yaz.</p><div class="alan"><label class="etiket" for="ay-onay-metin">Onay metni</label><input id="ay-onay-metin" class="girdi" type="text" autocomplete="off" data-input="ay-sil-yaz" aria-describedby="ay-onay-not"></div><p class="mini soluk" id="ay-onay-not">Yazım tam eşleşmeli: HESABIMI SİL</p><div class="modal-alt ay-alt"><button type="button" class="btn btn-hayalet" data-action="ay-sihirbaz-kapat">Vazgeç</button><button type="button" class="btn btn-tehlike" id="ay-sil-gonder" data-action="ay-sil-gonder" aria-disabled="true">Silme talebini gönder</button></div></div>';
  };
  function veriPaketi() {
    const kopya = JSON.parse(JSON.stringify(state)); kopya.telefon = maskeTel(state.telefon);
    return JSON.stringify({ paket: 'KodKent veri paketi (Demo)', olusturma: new Date().toISOString(), icerik: kopya }, null, 2);
  }
  KK_UI.screen('ayarlar', {
    ad: 'Ayarlar & Hesap', hud: true,
    render(root, ctx) {
      root.classList.add('scr-sosyal');
      if (ctx.ilk) { AY.mobil = false; }
      try { ek(); tercihUygula(); ayarlarCiz(root); } catch (e) { KK_UI.hataKaydet(e, 'ayarlar'); root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Ayarlar kaydedilemedi. Değişikliğin cihazında saklandı.', { baslik: 'Ayarlar açılamadı', tekrar: 'ay-yenile' }) + '</div>'; }
    },
    actions: {
      'ay-yenile': function () { refresh(); },
      'ay-bolum': function (el) { AY.bolum = el.getAttribute('data-bolum'); AY.mobil = true; refresh(); },
      'ay-geri': function () { AY.mobil = false; refresh(); },
      'ay-anahtar': function (el) {
        const yol = el.getAttribute('data-ayar'); yolYaz(yol, !!el.checked); S.kaydet('Ayarlar kaydedilemedi. Değişikliğin cihazında saklandı.');
        if (yol === 'ek.yuksekKontrast') tercihUygula();
        toast('Kaydedildi', 'basari', 1400); if (yol === 'ses' || yol === 'guvenliMod' || yol === 'derinDegerlendirme') refresh();
      },
      'ay-kaydirici': function (el) { const yol = el.getAttribute('data-ayar'); yolYaz(yol, Number(el.value)); const d = document.getElementById(el.id + '-d'); if (d) d.textContent = el.value; save(); },
      'ay-secim': function (el) { yolYaz(el.getAttribute('data-ayar'), el.value); S.kaydet(); toast('Kaydedildi', 'basari', 1400); },
      'ay-boyut': function (el) { ek().metinBoyutu = Number(el.value); S.kaydet(); tercihUygula(); toast('Metin boyutu %' + el.value, 'basari', 1400); },
      'ay-kisayol': function () {
        modal({ sinif: 'scr-sosyal', baslik: 'Kısayol yardımı', ikon: 'bilgi', html: '<div class="tablo-kap"><table class="tablo"><tbody>' + [['Tab / Shift+Tab', 'Gezin'], ['Enter / Boşluk', 'Seç ya da çalıştır'], ['Esc', 'Pencereyi kapat'], ['Oda (Düzenle): ok tuşları', 'Seçili eşyayı hücre hücre taşı'], ['Oda (Düzenle): R', 'Eşyayı döndür'], ['Oda (Düzenle): Delete', 'Eşyayı kaldır'], ['Oda (Düzenle): Ctrl+Z', 'Geri al'], ['Sohbet: Enter', 'Mesajı gönder']].map(function (r) { return '<tr><th scope="row"><kbd>' + esc(r[0]) + '</kbd></th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' });
      },
      'ay-engel-kaldir': function (el) { const d = sohbetDurum(), ad = el.getAttribute('data-ad'); d.engel = d.engel.filter(function (x) { return x !== ad; }); S.kaydet(); toast('@' + ad + ' engelden çıkarıldı.', 'bilgi'); refresh(); },
      'ay-yas': function (el) {
        const v = el.value, yil = new Date().getFullYear();
        if (v === 'yetiskin') { state.dogumYili = yil - 22; state.veli.durum = 'yok'; }
        else { state.dogumYili = yil - 16; state.veli.durum = v === 'genc-onayli' ? 'onayli' : 'bekliyor'; state.ayarlar.guvenliMod = true; if (state.oda && state.oda.izin === 'herkes') state.oda.izin = 'arkadaslar'; }
        S.kaydet(); hud(); toast('Demo yaş bandı: ' + (v === 'yetiskin' ? '18+' : v === 'genc-onayli' ? '15–17, veli onaylı' : '15–17, veli onayı bekliyor') + '.', 'bilgi'); refresh();
      },
      'ay-veli-gonder': function () {
        const e = ek(); if ((e.veliGonderim || 0) >= 3) { toast('Bu hafta 3 kez gönderdin. 7 günde en çok 3 gönderim yapılabilir.', 'uyari'); return; }
        e.veliGonderim = (e.veliGonderim || 0) + 1; S.kaydet(); toast('Veline onay bağlantısı yeniden gönderildi (72 saat geçerli).', 'basari'); refresh();
      },
      'ay-dil-ekle': function () { const s = document.getElementById('ay-dil-sec'); if (!s || !s.value) return; ek(); state.ayarlar.dilBekleme.push(s.value); state.bekleme[s.value] = true; S.kaydet(); toast((DIL_AD[s.value] || s.value) + ' için bekleme listesindesin.', 'basari'); refresh(); },
      'ay-dil-vazgec': function (el) { const k = el.getAttribute('data-dil'); ek(); state.ayarlar.dilBekleme = state.ayarlar.dilBekleme.filter(function (x) { return x !== k; }); delete state.bekleme[k]; S.kaydet(); toast('Bekleme listesinden çıkarıldın.', 'bilgi'); refresh(); },
      'ay-cikis': function () { onayla('Çıkış yapınca Giriş ekranına dönersin. Bu demoda ilerleme bu cihazda saklı kalır.', 'Çıkış Yap', 'Vazgeç').then(function (ok) { if (ok) { save(); go('giris'); } }); },
      'ay-ad-degistir': function () {
        modal({ sinif: 'scr-sosyal', baslik: 'Takma adı değiştir', ikon: 'kalem', html: '<p class="soluk">Takma ad değişimi <b>500 B</b>. Şu an ' + fmt(state.bayt) + ' B var. 3–16 karakter; "KodKent", "Usta", "Müfettiş", "Kurul", "Admin" gibi taklit adlar yasaktır.</p><div class="alan"><label class="etiket" for="ay-yeni-ad">Yeni takma ad</label><input id="ay-yeni-ad" class="girdi" type="text" maxlength="16" autocomplete="off"></div><p class="hata-yazi" id="ay-ad-hata" role="alert"></p>',
          butonlar: [{ ad: 'Vazgeç' }, { ad: 'Değiştir — 500 B', birincil: true, veri: 'ay-ad-onay', aksiyon: function () {
            const v = ($('#ay-yeni-ad').value || '').trim(), h = $('#ay-ad-hata'), hata = function (m) { if (h) h.textContent = m; return false; };
            if (v.length < 3 || v.length > 16 || !/^[A-Za-z0-9_.ğüşöçıİĞÜŞÖÇ]+$/.test(v)) return hata('3–16 karakter olmalı; harf, rakam, alt çizgi ve nokta kullanabilirsin.');
            if (/(kodkent|usta|m[uü]fetti[sş]|kurul|admin)/i.test(v)) return hata('Bu ad kullanılamaz: KodKent, Usta, Müfettiş, Kurul, Admin ve benzer taklit adlar yasaktır.');
            if (v === state.ad) return hata('Bu zaten senin takma adın.');
            if (state.bayt < 500) return hata('500 B gerekir, sende ' + fmt(state.bayt) + ' B var. Bayt koddan kazanılır.');
            if (!harca({ bayt: 500, etiket: 'Takma ad' })) return false;
            state.ad = v; S.kaydet(); hud(); toast('Takma adın @' + v + ' oldu.', 'basari'); refresh();
          } }] });
      },
      'ay-sihirbaz-kapat': function () { if (AY.m) { AY.m.kapat(false); AY.m = null; } },
      'ay-sil-baslat': function () { AY.m = modal({ sinif: 'scr-sosyal', baslik: 'Hesabımı sil', ikon: 'uyari', html: silAdim1(), butonlar: [] }); },
      'ay-sil-devam': function () { if (AY.m) AY.m.guncelle(otpHtml('sil')); },
      'ay-indir-baslat': function () { AY.m = modal({ sinif: 'scr-sosyal', baslik: 'Verilerimi indir', ikon: 'indir', html: otpHtml('indir'), butonlar: [] }); },
      'ay-otp-tamam': function (el) {
        const tur = el.getAttribute('data-tur'), g = document.getElementById('ay-otp'), h = document.getElementById('ay-otp-hata');
        if (!g || g.value.trim() !== '123456') { if (h) h.textContent = 'Kod hatalı. Demo kodu 123456.'; return; }
        if (!AY.m) return;
        if (tur === 'sil') AY.m.guncelle(silAdim3());
        else {
          const json = veriPaketi(), kb = Math.max(1, Math.round(json.length / 1024));
          AY.m.guncelle('<div class="ay-sihirbaz"><p><b>Talebin alındı.</b> Gerçek üründe paket 24 saat içinde hazırlanır (yasal süre 30 gün), 7 gün geçerli tek kullanımlık bağlantıyla indirilir. Bu demoda hazır:</p><div class="kart"><b>kodkent-verilerim.json</b><br><span class="soluk">≈ ' + kb + ' KB · profil, ilerleme, envanter, oda, ayarlar</span></div><div class="modal-alt ay-alt"><button type="button" class="btn btn-hayalet" data-action="ay-sihirbaz-kapat">Kapat</button><button type="button" class="btn btn-birincil" data-action="ay-indir-dosya">' + ikon('indir', 18) + 'İndir</button></div></div>');
        }
      },
      'ay-indir-dosya': function () {
        indirDosya('kodkent-verilerim.json', veriPaketi(), veriPaketi());
      },
      'ay-sil-yaz': function (el) { const b = document.getElementById('ay-sil-gonder'); if (!b) return; if (el.value === 'HESABIMI SİL') b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true'); },
      'ay-sil-gonder': function () {
        const g = document.getElementById('ay-onay-metin'); if (!g || g.value !== 'HESABIMI SİL') { toast('Onay metnini tam yaz: HESABIMI SİL', 'uyari'); return; }
        const simdi = new Date(), bitis = new Date(simdi.getTime() + 7 * 86400000);
        state.ayarlar.silmeTalebi = { tarih: simdi.toISOString(), bitis: bitis.toISOString() }; S.kaydet();
        if (AY.m) AY.m.guncelle('<div class="ay-sihirbaz"><p><b>Adım 4/4 · Talebin alındı.</b></p><div class="kart kart-amber"><b>7 gün bekleme</b><p>' + esc(bitis.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })) + ' tarihine kadar vazgeçebilirsin. Bu sürede giriş yapman talebi iptal eder.</p></div><div class="modal-alt ay-alt"><button type="button" class="btn btn-birincil" data-action="ay-sil-kapat">Tamam</button></div></div>');
      },
      'ay-sil-kapat': function () { if (AY.m) { AY.m.kapat(true); AY.m = null; } refresh(); },
      'ay-sil-vazgec': function () { delete state.ayarlar.silmeTalebi; S.kaydet(); toast('Silme talebinden vazgeçtin. Hesabın olduğu gibi duruyor.', 'basari'); refresh(); }
    },
    leave() { AY.m = null; },
    async selftest(root, ctx) {
      await ctx.bekleSecici('[data-action="ay-bolum"]');
      await ctx.tikla('#ay-bolum-ses');
      const once = !!state.ayarlar.ses; await ctx.tikla('#ay-ses');
      if (!!state.ayarlar.ses === once) throw new Error('Ses anahtarı durumu değiştirmedi');
      await ctx.tikla('#ay-bolum-gizlilik'); if (!/Aydınlatma/.test(ctx.metin('.ay-form'))) throw new Error('KVKK metinleri yok');
      await ctx.tikla('#ay-bolum-veli'); if (!/veli onayı gerekmiyor/.test(ctx.metin('.ay-form'))) throw new Error('18+ veli durumu yok');
      await ctx.tikla('#ay-bolum-genel'); await ctx.tikla('[data-action="ay-ad-degistir"]'); await ctx.yaz('#ay-yeni-ad', 'DenizKod'); await ctx.tikla('[data-veri="ay-ad-onay"]');
      if (state.ad !== 'Deniz' || !/500 B gerekir/.test(ctx.metin('#ay-ad-hata'))) throw new Error('yetersiz Bayt ile takma ad değişti');
      KK_UI.modalTemizle();
      await ctx.tikla('#ay-bolum-hesap');
      await ctx.tikla('[data-action="ay-indir-baslat"]'); await ctx.yaz('#ay-otp', '123456'); await ctx.tikla('[data-action="ay-otp-tamam"]'); await ctx.bekleSecici('[data-action="ay-indir-dosya"]'); KK_UI.modalTemizle();
      await ctx.tikla('[data-action="ay-sil-baslat"]'); await ctx.tikla('[data-action="ay-sil-devam"]');
      await ctx.yaz('#ay-otp', '123456'); await ctx.tikla('[data-action="ay-otp-tamam"]');
      await ctx.yaz('#ay-onay-metin', 'HESABIMI SİL'); await ctx.tikla('#ay-sil-gonder');
      if (!state.ayarlar.silmeTalebi) throw new Error('silme talebi kaydedilmedi');
      await ctx.tikla('[data-action="ay-sil-kapat"]');
      await ctx.tikla('[data-action="ay-sil-vazgec"]');
      if (state.ayarlar.silmeTalebi) throw new Error('silme talebinden vazgeçilemedi');
    }
  });
})();
