/* ==== ui/50a-ekran-isletme-editor.js — P2 (2/3): `editor` (İşletme Editörü + Müfettiş) ve `savunma` ====
   Yapay zekâ çağrıları (aiTestSimule, aiKodIncele, aiSavunma) YALNIZCA düğme tıklamasıyla; çevrimdışı yedek KK_CORE'dan gelir (10-ai.js). */
(function () {
  const I = KK_UI.isl;
  const IMZA_RE = /public\s+static\s+int\s+UcretHesapla\s*\(\s*int\s+dakika\s*\)/;
  const IPUCU_YEDEK = {
    pusula: 'Bu iş emrinde üç ayrı iş var: (1) dakikayı “başlayan saat”e çevirmek, (2) süreye göre tarife dilimini seçmek, (3) dilimin birim fiyatıyla çarpmak. Önce yalnızca ilkini çöz: 61 dakika kaç başlayan saattir? 120 dakika? 121 dakika?',
    fener: 'Dilimi yuvarlanmış saat değil, ham dakika belirler (Sözleşme madde 2): 119 dakika hâlâ “2 saatten az”, 120 dakika artık “2–6 saat”. Başlayan saat için Ders 1.2’deki kalıbı kullan: tam sayı bölmesinden önce bölenin bir eksiğini ekle. 24 saatten sonrası için aynı kalıp 1440 ile gerekir.',
    taslak: 'dakika 0 veya altındaysa -> 0 dön\nsaat = ___   (başlayan saat, Ders 1.2 kalıbı)\ndakika < 120 ise -> saat x ___\ndakika <= 360 ise -> saat x ___\naksi halde: gun = ___   (başlayan gün) -> gun x ___',
    ornek: 'Bisiklet kiralama (benzer ama farklı bir problem): 45 dakikadan az, başlayan her 15 dakika 10 TL; 45–180 dakika (sınırlar dâhil), başlayan her 30 dakika 15 TL; 180 dakikayı aşan, başlayan gün × 120 TL.\n\npublic static int BisikletUcreti(int dakika)\n{\n    if (dakika <= 0) return 0;\n    if (dakika < 45)   return (dakika + 14) / 15 * 10;\n    if (dakika <= 180) return (dakika + 29) / 30 * 15;\n    return (dakika + 1439) / 1440 * 120;\n}'
  };
  const BASAMAK = [['pusula', 'Pusula', 'Hangi kavram?', 'pusula'], ['fener', 'Fener', 'Hangi durum, hangi satır?', 'fener'], ['taslak', 'Taslak', 'Sözde kod, eksik satırlar', 'kalem'], ['ornek', 'Örnek', 'Benzer ama farklı bir problem', 'kitap']];
  const SABLON_YEDEK = 'public static class Otopark\n{\n    public static int UcretHesapla(int dakika)\n    {\n        /* kodun buraya */\n        throw new NotImplementedException();\n    }\n}';

  /* ---------- ortak ---------- */
  let ed = null, ac = null, calisiyor = false, zm = 0;
  function E() { return I.ekran('editor', { sekme: 'soz', calistirma: 0, basarisiz: 0, oneri: false, mufGun: '', mufSayi: 0, sonAcik: null, etiket: '', muf: null, yorum: null, yorumXp: 0, yazAcik: false, sorgu: '' }); }
  function sablon() { return I.op().templateKod || SABLON_YEDEK; }
  function dokunmatik() { try { return window.matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } }
  function $id(id) { return document.getElementById(id); }
  function gecenAcik() { const e = E(); return !!(e.sonAcik && e.sonAcik.length >= 6 && e.sonAcik.every(function (g) { return g.gecti; })); }
  function gizliSayisi() { return I.gizliTestler().length + 6; }
  function tumGecti(o) { return o.testler.acik.length >= 6 && o.testler.gizli.length >= gizliSayisi(); }
  function ipucuMetin(k) { const d = I.op().ipuclari; return (d && d[k]) || IPUCU_YEDEK[k]; }
  function sayiMi(x) { return /^-?\d+$/.test(String(x == null ? '' : x).trim()); }
  function rakamli(x) { return sayiMi(x) ? fmt(Number(x)) + ' TL' : String(x == null ? '' : x); }

  /** Basit derleme denetimi (CS1002 eksik `;`, parantez dengesi). Gerçek ürün sandbox'ta derler; burada yalnızca belirgin yazım hataları yakalanır. */
  function derlemeKontrol(kod) {
    const sat = String(kod).split('\n').map(function (s) { return s.replace(/\/\/.*$/, ''); }); let a = 0, p = 0;
    for (let i = 0; i < sat.length; i++) {
      const t = sat[i].trim().replace(/"(?:[^"\\]|\\.)*"/g, '""'); if (!t) continue;
      a += (t.match(/\{/g) || []).length - (t.match(/\}/g) || []).length; p += (t.match(/\(/g) || []).length - (t.match(/\)/g) || []).length;
      if (/^(return\b|(int|var|string|double|decimal|bool|long)\s+\w+\s*(=|;))/.test(t) && !/[;{},(]\s*$/.test(t)) return { kod: 'CS1002', satir: i + 1, mesaj: 'Satır sonunda `;` eksik.' };
    }
    if (a > 0) return { kod: 'CS1513', satir: sat.length, mesaj: '} bekleniyor: süslü parantezlerin sayısı tutmuyor.' };
    if (a < 0) return { kod: 'CS1022', satir: sat.length, mesaj: 'Fazladan } var: süslü parantezlerin sayısı tutmuyor.' };
    if (p !== 0) return { kod: 'CS1026', satir: sat.length, mesaj: (p > 0 ? ') bekleniyor' : 'Fazladan )') + ': parantezlerin sayısı tutmuyor.' };
    return null;
  }
  function yorumXp(kod) {
    const k = String(kod).replace(/\/\/.*$/gm, ''), tek = (k.match(/\b(int|var|string|double)\s+[a-zA-Z_]\b/g) || []).length;
    return Math.min(30, 10 + (/\bconst\b|static\s+readonly/.test(k) ? 10 : 0) + (tek === 0 ? 10 : 0));
  }
  function sokratik(e, kod) {
    const kirmizi = (e.sonAcik || []).filter(function (g) { return !g.gecti; }).map(function (g) { return String(g.id).toLowerCase(); }), has = function (x) { return kirmizi.indexOf(x) >= 0; };
    if (!kirmizi.length) return 'Açık testlerin hepsi yeşil; şimdi Müfettiş\'i çağırabilirsin. Gizli testler hangi sınırları yoklar, sence?';
    if (/NotImplementedException/.test(kod) && kirmizi.length >= 6) return 'Henüz yazılmış bir kod görünmüyor. Önce 30 dakika için 100 TL döndüren en kısa yolu dene; sonra Sözleşme Kartı\'ndaki dilimlere bak.';
    if (has('a1') && has('a2') && has('a4')) return '61 dakikada saat kaç çıkıyor? Hasan Abi “başlayan saat” demişti; başlayan ne demek?';
    if (has('a3') && kirmizi.length === 1) return 'Hasan Abi tam 2 saat için ne demişti? Kartı oku ya da yeniden sor.';
    if (has('a2') && kirmizi.length === 1) return '119 dakikada saat kaç, dakika kaç? Hasan Abi\'nin cümlesi hangisine bakıyor?';
    if (has('a6') || has('a5')) return '1.441 dakika kaç gün? Kartta Madde 4 ne diyor? 361 dakikada gün kaç çıkıyor?';
    return 'Henüz değil; kırmızı satıra bak: beklenen ile gerçek arasındaki farkı yan yana yaz, sonra hangi koşulun çalıştığını adım adım izle.';
  }

  /* ---------- parça çizimleri (yerel güncelleme: editör içeriği kaybolmaz) ---------- */
  function hataGoster(h) {
    const k = $id('ed-hata'); if (!k) return;
    k.innerHTML = '<div class="ed-hata" role="alert">' + ikon('uyari', 20) + '<span>' + (h.satir ? 'Satır ' + h.satir + ': ' : '') + esc(h.mesaj) + ' (' + esc(h.kod) + ')</span>' + (h.satir ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="satiraGit" data-satir="' + h.satir + '">Satıra Git</button>' : '') + '</div>';
    if (h.satir && ed) ed.vurgula([h.satir], { kaydir: true });
  }
  function hataTemizle() { const k = $id('ed-hata'); if (k && k.innerHTML) k.innerHTML = ''; if (ed) ed.vurgula([]); }
  function sonucCiz(g) {
    g = g || {}; const e = E(), testler = I.acikTestler(), kok = $id('ed-sonuc'), oz = $id('ed-ozet'), et = $id('ed-etiket'); if (!kok) return;
    const liste = g.liste || e.sonAcik || [], harita = {}; liste.forEach(function (x) { harita[x.id] = x; });
    const bekle = g.ilerle != null; let gecen = 0;
    kok.innerHTML = testler.map(function (t, i) {
      const s = harita[t.id], ad = String(t.id).toUpperCase() + ' · ' + fmt(t.dakika) + ' dakika', girdi = fmt(t.dakika) + ' dk', beklenen = fmt(t.beklenen) + ' TL';
      if (s && (!bekle || i < g.ilerle)) { if (s.gecti) gecen++; return testSatirHtml({ ad: ad, durum: s.gecti ? 'gecti' : 'kaldi', girdi: girdi, beklenen: beklenen, gercek: s.gecti ? null : rakamli(s.gercek), hata: s.hata || '' }); }
      const h = testSatirHtml({ ad: ad, durum: 'bekliyor', girdi: girdi, beklenen: beklenen });
      return bekle && i === g.ilerle ? '<div class="ed-calisan" aria-label="çalışıyor">' + h + '</div>' : h;
    }).join('');
    const var_ = liste.length > 0 && !bekle;
    if (oz) {
      oz.setAttribute('data-bitti', var_ ? '1' : '0');
      oz.innerHTML = bekle ? ikon('saat', 24) + '<span>Testler çalışıyor… ' + g.ilerle + '/' + testler.length + '</span>' + cubukHtml(100 * g.ilerle / testler.length, { tur: 'mor', ince: true }) :
        (var_ ? ikon(gecen === testler.length ? 'test-gecti' : 'test-kaldi', 26) + '<span>' + gecen + '/' + testler.length + ' geçti</span>' + cubukHtml(100 * gecen / testler.length, { tur: 'nane', ince: true }) : ikon('saat', 24) + '<span class="soluk">Henüz çalıştırmadın: 0/' + testler.length + '</span>');
    }
    if (et) et.textContent = var_ && e.etiket ? e.etiket : '';
    const nt = $id('ed-not'); if (nt) nt.hidden = !(var_ && gecen === testler.length);
  }
  function dugmeCiz() {
    const k = $id('ed-eylem'); if (!k) return;
    const o = I.kayit(), e = E(), acikTamam = gecenAcik(), bugunSay = e.mufGun === I.bugun() ? e.mufSayi : 0, muf = e.muf;
    k.innerHTML = '<button type="button" class="btn btn-birincil' + (calisiyor ? ' yukleniyor' : '') + '" data-action="calistir"' + (calisiyor ? ' aria-disabled="true"' : '') + '>' + ikon('oynat', 20) + 'Testleri Çalıştır</button>' +
      '<button type="button" class="btn btn-mor' + (acikTamam && !calisiyor ? ' ed-parla' : '') + '" data-action="mufettis"' + (acikTamam && !calisiyor ? '' : ' aria-disabled="true" aria-describedby="ed-muf-neden"') + '>' + ikon('goz', 20) + 'Müfettişi Çağır <small>Bugün ' + bugunSay + '/10</small></button>' +
      (calisiyor ? '<button type="button" class="btn btn-hayalet" data-action="durdur">' + ikon('dur', 18) + 'Durdur</button>' : '') +
      '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="ornek">' + ikon('kitap', 18) + 'Örnek Çözümü Yükle</button><button type="button" class="btn btn-hayalet btn-kucuk" data-action="sifirla">' + ikon('yenile', 18) + 'Sıfırla</button>' +
      '<p class="mini soluk ed-ipucu-yazi" id="ed-muf-neden">' + (acikTamam ? 'Açık testler gizli testlerin hepsini söylemez.' : 'Müfettiş yalnızca açık testler 6/6 iken gelir. Ctrl+Enter ile de çalıştırabilirsin.') + '</p>' +
      (muf && muf.tum && !calisiyor ? '<button type="button" class="btn btn-altin btn-buyuk ed-savunma" data-action="savunmayaGec">' + ikon('kalkan', 22) + 'Savunma\'ya Geç</button>' : '') +
      (muf && !muf.tum && !calisiyor && o.durum === 'kapali' ? '<button type="button" class="btn btn-hayalet" data-action="denemeAc">' + ikon('bina', 18) + 'Deneme Modunda Aç (%50 gelir)</button>' : '');
  }
  function sozSekme(o) {
    const acik = o.netlestirme.maddeler.concat([5]), eksik = I.maddeler().filter(function (m) { return acik.indexOf(m.madde) < 0; }).length;
    return '<ol class="liste ie-maddeler">' + I.maddeler().map(function (m) {
      const a = acik.indexOf(m.madde) >= 0;
      return '<li><div class="ie-madde' + (a ? ' acik' : ' soluk') + '"><span class="ie-madde-no">' + (a ? ikon('muhur', 18) : m.madde) + '</span><span class="ie-madde-ic"><b>Madde ' + m.madde + (m.madde === 5 && o.netlestirme.maddeler.indexOf(5) < 0 ? ' · imza (iskeletten)' : '') + '</b><span class="ie-madde-kural">' + esc(a ? m.kural : 'Bu madde için müşteriye sormadın.') + '</span></span></div></li>';
    }).join('') + '</ol>' + (eksik ? '<p class="mini soluk">' + eksik + ' madde soluk: sorulmayan maddenin gizli testleri Müfettiş\'te kırmızı çıkabilir. <button type="button" class="btn-baglanti" data-go="is-emri">Hasan Abi\'ye sor</button></p>' : '');
  }
  function testSekme() {
    const e = E(), h = {}; (e.sonAcik || []).forEach(function (x) { h[x.id] = x; });
    return '<ul class="liste ed-test-liste">' + I.acikTestler().map(function (t) {
      const s = h[t.id];
      return '<li class="satir"><span class="satir-ana"><span class="satir-baslik">' + esc(String(t.id).toUpperCase()) + ' · ' + fmt(t.dakika) + ' dakika</span><span class="satir-alt">beklenen: ' + fmt(t.beklenen) + ' TL</span></span><span class="satir-sag">' + (s ? chipHtml(s.gecti ? 'Geçti' : 'Kaldı', s.gecti ? 'nane' : 'mercan') : chipHtml('Bekliyor', 'gri')) + '</span></li>';
    }).join('') + '</ul><p class="mini soluk">Açık testler ipucudur ama gizli testlerin hepsini söylemez: Müfettiş 14 gizli ve 6 tohumlu test daha çalıştırır.</p>';
  }
  function ipucuSekme() {
    const gk = gorevKaydi('is-emri-otopark'), e = E(), n = gk.ipucu || 0;
    return (e.oneri && n === 0 ? '<p class="ed-oneri" role="status">' + ikon('pusula', 18) + 'Üç kez denedin. Pusula ister misin? (Zorunlu değil; ücretsiz ve sınırsız.)</p>' : '') +
      '<div class="ipucu-merdiven">' + BASAMAK.map(function (b, i) {
        const no = i + 1, gorundu = no <= n, siradaki = no === n + 1, sinif = gorundu ? 'gorundu' : (siradaki ? 'acik' : 'kilitli'), m = ipucuMetin(b[0]);
        return '<div class="ipucu-basamak ' + sinif + '" style="--adim:' + i + '"><span class="ipucu-ik">' + ikon(gorundu ? 'tik' : (siradaki ? b[3] : 'kilit'), 22) + '</span><span><b class="ipucu-ad">' + b[1] + '</b><span class="ipucu-aciklama"> · ' + b[2] + '</span></span>' +
          (siradaki ? '<button type="button" class="btn btn-altin btn-kucuk" data-action="ipucuAc" data-i="' + no + '">Aç</button>' : (gorundu ? chipHtml('açıldı', 'nane') : '<span></span>')) +
          (gorundu ? '<div class="ipucu-icerik">' + (/\n/.test(m) ? '<pre class="kod ed-pre"><code>' + esc(m) + '</code></pre>' : '<p>' + esc(m) + '</p>') + '</div>' : '') + '</div>';
      }).join('') + '</div><p class="mini soluk">İpucu kullanımı gelire, Savunma\'ya ve rozetlere etki etmez; ipucusuz çözüm Berrak Zihin (+%15 XP) tutar.</p>';
  }
  function mufSekme(g) {
    const o = I.kayit(), e = E(), m = e.muf, bugunSay = e.mufGun === I.bugun() ? e.mufSayi : 0, ust = '<div class="ed-muf-ust"><span class="portre">' + ustaSvg('mufettis', { boyut: 72, aria: 'Müfettiş' }) + '</span><div><b>Müfettiş</b><div class="mini soluk">Bugün ' + bugunSay + '/10 çağrı · 14 gizli + 6 tohumlu test</div></div></div>';
    if (g && g.ilerle != null) return ust + '<div class="ed-kapi" id="ed-muf-ilerleme" role="status">Müfettiş ' + g.toplam + ' test çalıştırıyor… ' + g.ilerle + '/' + g.toplam + '</div>' + cubukHtml(100 * g.ilerle / g.toplam, { tur: 'mor' });
    if (!m) return ust + '<p class="soluk">' + (gecenAcik() ? 'Açık testler yeşil. Müfettiş kapıyı çalmaya hazır: “Müfettişi Çağır”.' : 'Müfettiş yalnızca açık testler 6/6 olunca gelir. Önce 6 açık testi geçir.') + '</p>' + (o.durum === 'kararmis' ? '<p class="soluk">Kırmızı dosya kapıda: kodu düzelt, açık testleri geçir, yeniden çağır.</p>' : '');
    return ust + '<div id="ed-muf-ozet" data-bitti="1" class="ed-muf-ozet"><div class="ed-muf-satir">' + ikon('test-gecti', 18) + 'Açık <b>' + Math.min(6, o.testler.acik.length) + '/6</b></div><div class="ed-muf-satir">' + ikon(m.gizliGecen === m.gizliToplam ? 'test-gecti' : 'test-kaldi', 18) + 'Gizli <b>' + m.gizliGecen + '/' + m.gizliToplam + '</b></div><div class="ed-muf-satir">' + ikon(m.tohGecen === m.tohToplam ? 'test-gecti' : 'test-kaldi', 18) + 'Tohumlu <b>' + m.tohGecen + '/' + m.tohToplam + '</b></div></div>' +
      balonHtml('Dosya bıraktım.', { tur: 'usta', ad: 'Müfettiş' }) + '<p class="mini soluk">' + (m.tum ? 'Hepsi yeşil: Savunma\'ya geçebilirsin.' : 'Şikâyetler sağdaki balonlarda; girdi söylenmez, yalnızca bölge.') + '</p>';
  }
  function bilgiCiz(g) {
    const k = $id('ed-bilgi'); if (!k) return; const o = I.kayit(), e = E(), s = e.sekme || 'soz';
    const tabs = [['soz', 'Sözleşme', 'defter'], ['test', 'Açık Testler', 'liste'], ['ipucu', 'İpuçları', 'fener'], ['muf', 'Müfettiş', 'goz']];
    k.innerHTML = '<div class="sekmeler ed-sekmeler" role="tablist" aria-label="Bilgi paneli">' + tabs.map(function (t) { return '<button type="button" role="tab" class="sekme' + (s === t[0] ? ' aktif' : '') + '" aria-selected="' + (s === t[0]) + '" data-action="sekme" data-s="' + t[0] + '">' + ikon(t[2], 18) + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="sekme-panel ed-panel" role="tabpanel">' + (s === 'soz' ? sozSekme(o) : s === 'test' ? testSekme() : s === 'ipucu' ? ipucuSekme() : mufSekme(g)) + '</div>';
  }
  function yanCiz(yukleniyor) {
    const k = $id('ed-yan'); if (!k) return; const o = I.kayit(), e = E(), m = e.muf, kod = ed ? ed.getir() : o.kod, usta = '<span class="portre">' + ustaSvg('defne', { boyut: 56, aria: 'Usta Defne' }) + '</span>';
    let yorum;
    if (yukleniyor) yorum = yukleniyorHtml('Usta Defne kodu okuyor…') + '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="durdur">' + ikon('dur', 16) + 'Durdur</button>';
    else if (e.yorum) yorum = '<ol class="ed-yorum">' + e.yorum.maddeler.map(function (x) { return '<li class="ed-yorum-madde"><b>' + esc(x.baslik) + '</b><span>' + esc(x.not) + '</span></li>'; }).join('') + '</ol><div class="sira-s">' + chipHtml(e.yorum.kaynak === 'claude' ? 'Claude' : 'Çevrimdışı demo', e.yorum.kaynak === 'claude' ? 'mor' : 'amber', 'muhur') + (e.yorumXp ? chipHtml('+' + e.yorumXp + ' XP', 'mor', 'xp') : '') + '</div>' + (e.yorum.uyari ? '<p class="mini soluk">' + esc(e.yorum.uyari) + '</p>' : '');
    else if (m && m.tum) yorum = '<p>Bütün testler yeşil. Usta Defne kodunu okuyup 3 maddede yorumlar (okunabilirlik, sihirli sayılar, sınır mantığı).</p><button type="button" class="btn btn-mor" data-action="yorumIste">' + ikon('muhur', 20) + 'Usta Yorumunu İste (+10–30 XP)</button>';
    else if (e.sonAcik && !gecenAcik()) yorum = '<p>' + esc(e.sorgu || 'Kırmızı testler var. İstersen Usta Defne yalnızca bir soru sorar; çözümü yazmaz.') + '</p><button type="button" class="btn btn-hayalet" data-action="ustayaSor">' + ikon('sohbet', 18) + 'Usta\'ya sor</button>';
    else yorum = '<p class="soluk">Testleri çalıştır; Müfettiş\'ten geçince Usta Defne kodunu inceler. Kırmızı testlerde “Usta\'ya sor” çıkar.</p>';
    const balonlar = m && m.balonlar && m.balonlar.length ? '<div role="list" class="ed-balonlar">' + m.balonlar.map(function (b) { return '<div role="listitem" class="ed-balon">' + ikon('mektup', 18) + '<span>' + esc(b.metin) + '</span></div>'; }).join('') + '</div>' + (m.balonlar.length ? '<p class="mini soluk">Her balon bir bölgeyi söyler; girdiyi söylemez.</p>' : '') :
      (m && m.tum ? '<p class="soluk">Müşteriler memnun: şikâyet yok.</p>' : (o.durum === 'kararmis' ? '<div class="ed-balon kirmizi">' + ikon('uyari', 18) + '<span>' + esc(I.sikayetMetni('bir-gun-civari', 'fazla')) + '</span></div>' : '<p class="soluk">Henüz şikâyet yok. Müfettiş gelince bölge balonları burada görünür.</p>'));
    k.innerHTML = '<section class="kart ed-usta"><h2 class="kart-baslik">' + usta + 'Usta Yorumu</h2>' + yorum + '</section><section class="kart ed-sik"><h2 class="kart-baslik">' + ikon('mektup', 22) + 'Şikâyet balonları</h2>' + balonlar + '</section>';
  }

  /* ---------- editör ekranı ---------- */
  KK_UI.screen('editor', {
    ad: 'İşletme Editörü', hud: true,
    render(root, ctx) {
      ed = null; calisiyor = false;
      try {
        const o = I.kayit(), e = E(), d = o.durum;
        if (d === 'yok' || d === 'satilik' || !d) {
          root.innerHTML = '<div class="sayfa sayfa-dar"><div class="sayfa-baslik"><button type="button" class="btn btn-hayalet btn-kucuk" data-go="sokak">' + ikon('ok-sol', 18) + 'Sokak</button><h1>İşletme Editörü</h1></div>' +
            bosHtml({ ikon: 'kilit', baslik: 'Editör tapu alınınca açılır', metin: 'Otopark\'un kodunu yazmak için önce tapu (300 B; Sev. 3 ve Ruhsat 3/3) ve Hasan Abi\'nin iş emri gerekir.', buton: { ad: 'İşletme Sokağı\'na git', aksiyon: 'sokagaGit', sinif: 'btn-birincil' } }) + '</div>';
          return;
        }
        if (!o.kod) { o.kod = sablon(); save(); }
        const salt = dokunmatik() && !e.yazAcik, durumChip = { kapali: chipHtml('Kapalı — yazılım bekliyor', 'mercan'), deneme: chipHtml('Deneme', 'amber'), acik: chipHtml('Açık', 'nane'), kararmis: chipHtml('Kararmış', 'gri') }[d] || '';
        const sorulmayan = I.maddeler().filter(function (m) { return o.netlestirme.maddeler.concat([5]).indexOf(m.madde) < 0; }).length;
        root.innerHTML = '<div class="sayfa sayfa-genis ed"><div class="sayfa-baslik"><button type="button" class="btn btn-hayalet btn-kucuk" data-go="is-emri">' + ikon('ok-sol', 18) + 'İş Emri</button><h1>İş Emri #1 — Otopark · Editör</h1>' + durumChip + '</div>' +
          (d === 'kararmis' ? '<p class="ed-serit kirmizi" role="status">' + ikon('uyari', 18) + 'İşletmen kararmış. Müfettişin dosyasına bak: kodu düzelt, testleri geçir, yeniden Savunma yap.</p>' : '') +
          (sorulmayan && d === 'kapali' ? '<p class="ed-serit" role="status">' + ikon('bilgi', 18) + sorulmayan + ' Sözleşme maddesi soluk: müşteriye sormadığın yerlerde gizli testler kırmızı çıkabilir.</p>' : '') +
          '<div class="ed-izgara"><section class="ed-kod yigin" aria-label="Kod">' +
          (salt ? '<div class="kart ed-mobil"><b>Bu işletmenin kodu masaüstünde daha rahat yazılır.</b><p class="mini soluk">Bağlantıyı kendine gönder, bilgisayarda aç. Test çalıştırma ve Müfettiş burada da çalışır.</p><div class="sira-s"><button type="button" class="btn btn-hayalet btn-kucuk" data-action="baglantiKopyala">' + ikon('kopyala', 18) + 'Bağlantıyı Kopyala</button><button type="button" class="btn btn-hayalet btn-kucuk" data-action="yazAc">Yine de Burada Yaz</button></div></div>' : '') +
          '<div id="ed-kap" class="ed-kap"></div><div id="ed-hata"></div><div class="sira ed-eylem" id="ed-eylem"></div>' +
          '<section class="kart ed-sonuc" aria-label="Test sonuçları"><div class="test-ozet" id="ed-ozet" role="status"></div><div class="liste ed-satirlar" id="ed-sonuc"></div><p class="mini soluk" id="ed-etiket"></p><p class="mini soluk" id="ed-not" hidden>Altı yeşil, bitti değil: Müfettiş gizli testlerle sınar.</p></section></section>' +
          '<aside class="kart ed-bilgi" id="ed-bilgi" aria-label="Bilgi paneli"></aside><aside class="ed-yan yigin" id="ed-yan"></aside></div></div>';
        ed = kodEditor('#ed-kap', { kod: o.kod, id: 'kod-ta', salt: salt, yukseklik: '340px', etiket: 'Otopark.cs — C# kod düzenleyici (UcretHesapla)', onDegis: degisti });
        ed.el.addEventListener('keydown', function (ev) { if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); calistir(); } });
        bilgiCiz(); sonucCiz(); dugmeCiz(); yanCiz();
      } catch (err) {
        KK_UI.hataKaydet(err, 'editor');
        root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Editör açılamadı: ' + ((err && err.message) || err), { tekrar: 'yenile', tekrarAd: 'Tekrar Dene' }) + '</div>';
      }
    },
    leave() { if (ac) { try { ac.abort(); } catch (x) { /* iptal edilmiş */ } } ed = null; calisiyor = false; },
    actions: {
      yenile() { refresh(); }, sokagaGit() { go('sokak'); },
      sekme(el) { const e = E(); e.sekme = el.getAttribute('data-s') || 'soz'; save(); bilgiCiz(); },
      satiraGit(el) { if (ed) { const n = Number(el.getAttribute('data-satir')); ed.vurgula([n], { kaydir: true }); ed.odakla(); } },
      baglantiKopyala() { kopyala(location.href).then(function (ok) { toast(ok ? 'Bağlantı kopyalandı.' : 'Kopyalanamadı.', ok ? 'basari' : 'uyari'); }); },
      yazAc() { E().yazAcik = true; save(); refresh(); },
      calistir() { return calistir(); },
      mufettis() { return mufettis(); },
      durdur() { ai.durdur(); },
      ipucuAc(el) { const gk = gorevKaydi('is-emri-otopark'), i = Number(el.getAttribute('data-i')); if (i !== (gk.ipucu || 0) + 1) return; gk.ipucu = i; gk.ipucusuz = false; save(); bilgiCiz(); },
      ustayaSor() { const e = E(); e.sorgu = sokratik(e, ed ? ed.getir() : ''); if (e.basarisiz >= 3 && !(gorevKaydi('is-emri-otopark').ipucu)) e.oneri = true; save(); yanCiz(); bilgiCiz(); },
      async yorumIste(el) {
        if (calisiyor) return; const e = E(), kod = ed ? ed.getir() : ''; calisiyor = true; ac = ai.yeniIptal(); yanCiz(true); dugmeCiz();
        const r = await aiKodIncele({ kod: kod, sozlesme: I.sozlesmeMetni(), usta: I.veri().ustalar ? I.veri().ustalar.defne : null, signal: ac.signal });
        calisiyor = false; dugmeCiz();
        if (!r) { yanCiz(); toast('Usta Yorumu durduruldu.', 'bilgi'); return; }
        e.yorum = { maddeler: r.maddeler || [], kaynak: r.kaynak, uyari: r.uyari || (r.hataKodu && typeof aiHataMesaji === 'function' ? aiHataMesaji(r.hataKodu) : '') };
        const ilk = !e.yorumXp, xp = yorumXp(kod); if (ilk) e.yorumXp = xp; save(); yanCiz();
        if (ilk) await award({ xp: Math.round(xp * (gorevKaydi('is-emri-otopark').ipucusuz ? 1.15 : 1)), etiket: 'Usta Yorumu', kaynak: el });
      },
      async ornek() {
        if (!ed) return; const o = I.kayit(), e = E(), ref = I.op().referansKod; if (!ref) { toast('Örnek çözüm bulunamadı.', 'uyari'); return; }
        ed.koy(ref); o.kod = ref; o.testler = { acik: [], gizli: [] }; e.sonAcik = null; e.muf = null; save(); hataTemizle(); sonucCiz(); dugmeCiz(); yanCiz(); bilgiCiz();
        toast('Örnek çözüm yüklendi (yalnızca demo). Şimdi “Testleri Çalıştır”.', 'bilgi');
      },
      async sifirla() {
        if (!ed || !(await onayla('Kodun iskelete dönecek ve test sonuçları silinecek. Devam edilsin mi?', 'Sıfırla', 'Vazgeç'))) return;
        const o = I.kayit(), e = E(); ed.koy(sablon()); o.kod = sablon(); o.testler = { acik: [], gizli: [] }; e.sonAcik = null; e.muf = null; e.yorum = null; save(); hataTemizle(); sonucCiz(); dugmeCiz(); yanCiz(); bilgiCiz();
      },
      savunmayaGec() { go('savunma'); },
      async denemeAc() {
        if (!(await onayla('İşletmen Deneme modunda açılır: gelir %50, şikâyet balonları sahibine görünür. Düzeltince Savunma ile tam Açılış\'a ulaşırsın. Devam?', 'Deneme\'de Aç', 'Vazgeç'))) return;
        I.isletmeAc('deneme'); toast('Otopark Deneme modunda açıldı (%50 gelir).', 'bilgi'); refresh();
      }
    },
    async selftest(root, ctx) {
      const o = state.isletmeler.otopark; o.durum = 'kapali'; o.netlestirme = { sorulanlar: ['S1', 'S2', 'S3', 'S4'], maddeler: [2, 3, 4, 1] }; save(); refresh();
      await ctx.bekleSecici('#kod-ta');
      await ctx.tikla('[data-action="calistir"]'); await ctx.bekleSecici('#ed-ozet[data-bitti="1"]', 4000);
      if (!/0\/6 geçti/.test(ctx.metin('#ed-ozet'))) throw new Error('İskelet kodda 0/6 beklenirdi: ' + ctx.metin('#ed-ozet'));
      if (root.querySelector('[data-action="mufettis"]:not([aria-disabled="true"])')) throw new Error('Açık testler yeşil değilken Müfettişi Çağır kilitli olmalı');
      await ctx.tikla('[data-action="ornek"]'); await ctx.tikla('[data-action="calistir"]'); await ctx.bekleSecici('#ed-ozet[data-bitti="1"]', 4000);
      if (!/6\/6 geçti/.test(ctx.metin('#ed-ozet'))) throw new Error('Örnek çözümde 6/6 beklenirdi: ' + ctx.metin('#ed-ozet'));
      /* E6 hatası: 360 dakika dışarıda → yalnızca Müfettiş yakalar, balon bölgeyi söyler, girdiyi söylemez */
      await ctx.yaz('#kod-ta', I.op().referansKod.replace('dakika <= 360', 'dakika < 360'));
      await ctx.tikla('[data-action="calistir"]'); await ctx.bekleSecici('#ed-ozet[data-bitti="1"]', 4000);
      await ctx.tikla('[data-action="mufettis"]'); await ctx.bekleSecici('.ed-balon', 4000);
      const bal = ctx.metin('.ed-balonlar'); if (!/6 saat civarı kalanlar/.test(bal) || /\d{3}/.test(bal.replace(/24|2–6|6–24/g, ''))) throw new Error('Şikâyet balonu bölgeyi söylemeli, girdiyi değil: ' + bal);
      if (!E().muf || E().muf.tum) throw new Error('Hatalı kodda Müfettiş tüm testleri geçmemeliydi');
      await ctx.tikla('[data-action="ornek"]'); await ctx.tikla('[data-action="calistir"]'); await ctx.bekleSecici('#ed-ozet[data-bitti="1"]', 4000);
      await ctx.tikla('[data-action="mufettis"]'); await ctx.bekleSecici('[data-action="savunmayaGec"]', 4000);
      if (o.testler.gizli.length < gizliSayisi()) throw new Error('Gizli+tohumlu testlerin hepsi kaydedilmedi: ' + o.testler.gizli.length);
      const xp0 = state.xp; await ctx.tikla('[data-action="yorumIste"]'); await ctx.bekleSecici('.ed-yorum-madde', 4000);
      if (root.querySelectorAll('.ed-yorum-madde').length !== 3) throw new Error('Usta Yorumu 3 madde olmalı');
      await ctx.bekle(60); KK_UI.modalTemizle(); if (state.xp <= xp0) throw new Error('Usta Yorumu XP vermedi');
    }
  });

  function degisti(kod) {
    const o = I.kayit(), e = E(); o.kod = kod;
    if (o.testler.acik.length || o.testler.gizli.length || e.sonAcik || e.muf) { o.testler = { acik: [], gizli: [] }; e.sonAcik = null; e.muf = null; sonucCiz(); dugmeCiz(); yanCiz(); if (e.sekme === 'muf' || e.sekme === 'test') bilgiCiz(); }
    hataTemizle(); clearTimeout(zm); zm = setTimeout(save, 350);
  }
  async function calistir() {
    if (calisiyor || !ed) return;
    const o = I.kayit(), e = E(), kod = ed.getir(); hataTemizle();
    if (!IMZA_RE.test(kod)) { hataGoster({ kod: 'İmza', mesaj: 'İmza sözleşmesi: `UcretHesapla(int dakika)` olmalı.' }); return; }
    const h = derlemeKontrol(kod); if (h) { hataGoster(h); return; }
    calisiyor = true; ac = ai.yeniIptal(); dugmeCiz(); e.sonAcik = null; sonucCiz({ liste: [], ilerle: 0 });
    const testler = I.acikTestler(), r = await aiTestSimule({ kod: kod, testler: testler, sozlesme: I.sozlesmeMetni(), signal: ac.signal });
    if (!r) { calisiyor = false; dugmeCiz(); sonucCiz(); toast('Test çalıştırma durduruldu.', 'bilgi'); return; }
    const harita = {}; (r.sonuclar || []).forEach(function (x) { harita[x.id] = x; });
    const liste = testler.map(function (t) { const x = harita[t.id] || {}; return { id: t.id, gecti: !!x.gecti, gercek: x.gercek, hata: x.hata || '' }; });
    for (let i = 0; i < testler.length; i++) { sonucCiz({ liste: liste, ilerle: i }); await bekle(120); }
    e.sonAcik = liste; e.etiket = r.etiket || ''; o.testler.acik = liste.filter(function (x) { return x.gecti; }).map(function (x) { return x.id; }); o.testler.gizli = []; e.muf = null; e.calistirma++;
    const hepsi = liste.every(function (x) { return x.gecti; }); if (!hepsi) { e.basarisiz++; if (e.basarisiz >= 3 && !e.oneri && !gorevKaydi('is-emri-otopark').ipucu) { e.oneri = true; toast('Üç kez denedin: Pusula ister misin? (İpuçları sekmesi, ücretsiz.)', 'bilgi'); } } else e.basarisiz = 0;
    calisiyor = false; save(); sonucCiz(); dugmeCiz(); yanCiz(); bilgiCiz();
    if (hepsi) toast('Altı yeşil! Ama açık testler gizli testlerin hepsini söylemez: Müfettiş\'i çağır.', 'basari');
  }
  async function mufettis() {
    if (calisiyor || !ed) return;
    const o = I.kayit(), e = E();
    if (!gecenAcik()) { toast('Müfettiş, açık testler 6/6 olunca gelir.', 'uyari'); return; }
    if (e.mufGun !== I.bugun()) { e.mufGun = I.bugun(); e.mufSayi = 0; }
    if (e.mufSayi >= 10) { toast('Müfettiş bugünlük çok çalıştı (10/10). Yarın tekrar çağırabilirsin.', 'uyari'); return; }
    e.mufSayi++; e.sekme = 'muf'; e.muf = null; save();
    const kod = ed.getir(), gizli = I.gizliTestler(), toh = I.tohumlu(), hepsi = gizli.concat(toh);
    calisiyor = true; ac = ai.yeniIptal(); dugmeCiz(); yanCiz(); bilgiCiz({ ilerle: 0, toplam: hepsi.length });
    const anim = (async function () { for (let k = 0; k <= hepsi.length; k += 2) { bilgiCiz({ ilerle: k, toplam: hepsi.length }); await bekle(70); } })();
    const r = await aiTestSimule({ kod: kod, testler: hepsi, sozlesme: I.sozlesmeMetni(), signal: ac.signal }); await anim;
    calisiyor = false;
    if (!r) { dugmeCiz(); bilgiCiz(); yanCiz(); toast('Müfettiş çağrısı durduruldu.', 'bilgi'); return; }
    const harita = {}; (r.sonuclar || []).forEach(function (x) { harita[x.id] = x; });
    const gecer = function (t) { return !!(harita[t.id] && harita[t.id].gecti); }, kirmizi = hepsi.filter(function (t) { return !gecer(t); }), gor = {}, balonlar = [];
    kirmizi.forEach(function (t) {
      const kat = I.kategori(t); if (gor[kat]) return; gor[kat] = 1; const gercek = harita[t.id] ? harita[t.id].gercek : null;
      const yon = sayiMi(gercek) ? (Number(gercek) > Number(t.beklenen) ? 'fazla' : 'eksik') : 'hata'; balonlar.push({ kat: kat, yon: yon, metin: I.sikayetMetni(kat, yon) });
    });
    e.muf = { gizliGecen: gizli.filter(gecer).length, gizliToplam: gizli.length, tohGecen: toh.filter(gecer).length, tohToplam: toh.length, balonlar: balonlar, tum: kirmizi.length === 0, toplam: hepsi.length };
    o.testler.gizli = hepsi.filter(gecer).map(function (t) { return t.id; }); save();
    bilgiCiz(); yanCiz(); dugmeCiz();
    if (e.muf.tum) { konfeti({ adet: 36 }); toast('Müfettiş: ' + hepsi.length + '/' + hepsi.length + '. “Dosya bıraktım.” Savunma\'ya geçebilirsin.', 'basari'); }
    else toast('Müfettiş ' + balonlar.length + ' şikâyet bıraktı. Bölgeyi oku, kodu düzelt, yeniden çağır.', 'uyari');
  }

  /* ================= SAVUNMA ================= */
  function satirBul(temiz, q) {
    const ip = String(q.satirIpucu || '').replace(/\s+/g, ' ').trim(); if (!ip) return 0;
    for (let i = 0; i < temiz.length; i++) if (temiz[i] && temiz[i].replace(/\s+/g, ' ').indexOf(ip) >= 0) return i + 1;
    try { const re = new RegExp(ip); for (let i = 0; i < temiz.length; i++) if (re.test(temiz[i])) return i + 1; } catch (x) { /* düz metin ipucu */ }
    return 0;
  }
  function secimYap(o) {
    const kod = String(o.kod || ''), temiz = kod.split('\n').map(function (l) { return l.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '').trim(); }), qs = I.op().savunmaSorulari || [], h = I.hash((state.ad || '') + '|' + kod), n = qs.length;
    for (let k = 0; k < n; k++) { const q = qs[(h + k) % n], no = satirBul(temiz, q); if (no) return { id: q.id, satir: no, soru: q.soru, anahtarlar: q.anahtarlar || [] }; }
    let no = 0; for (let i = 0; i < temiz.length; i++) { if (/\breturn\b.*\d/.test(temiz[i])) { no = i + 1; if (/40/.test(temiz[i])) break; } }
    if (!no) for (let i = 0; i < temiz.length; i++) if (/\breturn\b/.test(temiz[i])) { no = i + 1; break; }
    return { id: 'genel', satir: no || 1, soru: 'Kodun 121 dakika için kaç TL döndürüyor ve bu sayıyı hangi ifade belirliyor?', anahtarlar: ['121', '120', '40', '3', 'saat', 'başlayan', 'yukarı'] };
  }
  function kodluMetin(m) { return esc(m).replace(/`([^`]+)`/g, '<code class="kod-ic">$1</code>'); }
  function satirMetni(o, n) { return String(o.kod || '').split('\n')[n - 1] || ''; }
  function kurulKart(sn) {
    return '<div class="puan-kart' + (sn.kabul ? ' parli' : '') + '"><div class="puan-kart-etiket">Kurul Kartı</div><div class="puan-kart-ust">' + halkaHtml(sn.puan, { tur: sn.kabul ? 'nane' : 'amber', alt: 'PUAN', boyut: 92 }) + '<div class="sira-s" style="flex:1 1 220px">' +
      chipHtml(sn.kabul ? 'Açılış' : 'Deneme', sn.kabul ? 'nane' : 'amber', sn.kabul ? 'tik' : 'saat') + chipHtml(sn.kaynak === 'claude' ? 'Claude' : 'Çevrimdışı demo', sn.kaynak === 'claude' ? 'mor' : 'amber', 'muhur') + '</div></div>' +
      '<div class="sv-kriterler">' + sn.olcutler.map(function (k, i) { const mx = [50, 30, 20][i]; return '<div class="kriter"><span class="kriter-ad">' + esc(k.ad) + '</span><span class="kriter-puan">' + k.puan + ' / ' + mx + '</span>' + cubukHtml(100 * k.puan / mx, { tur: ['nane', 'xp', 'bayt'][i], ince: true }) + '<span class="kriter-not">' + esc(k.not) + '</span></div>'; }).join('') + '</div>' +
      '<div class="diyalog sv-hasan"><div class="diyalog-portre"><span class="portre">' + ustaSvg('hasan', { boyut: 56, aria: 'Hasan Abi' }) + '</span><b>Hasan Abi</b></div>' + balonHtml(sn.hasan, { tur: 'usta', kuyruk: true }) + '</div>' +
      (sn.uyari ? '<p class="mini soluk">' + esc(sn.uyari) + '</p>' : '') + '</div>';
  }
  async function acilisOdulu() {
    const o = I.kayit(); if (o.acilisOdul || !o.savunma || !o.savunma.kabul) return; o.acilisOdul = true; gorevKaydi('is-emri-otopark').tamam = true; save();
    konfeti({ adet: 70 }); await award({ xp: 300, bayt: 100, etiket: 'Açılış: Otopark' });
  }
  KK_UI.screen('savunma', {
    ad: 'Savunma', hud: true,
    render(root, ctx) {
      try {
        const o = I.kayit(), s = I.ekran('savunma', { taslak: '', secim: null, kodHash: 0, tamKod: false, sinema: false }), d = o.durum, geri = '<button type="button" class="btn btn-hayalet btn-kucuk" data-go="editor">' + ikon('ok-sol', 18) + 'Editör</button>';
        if (d === 'yok' || d === 'satilik' || !d) { root.innerHTML = '<div class="sayfa sayfa-dar"><div class="sayfa-baslik"><button type="button" class="btn btn-hayalet btn-kucuk" data-go="sokak">' + ikon('ok-sol', 18) + 'Sokak</button><h1>Savunma</h1></div>' + bosHtml({ ikon: 'kilit', baslik: 'Savunma tapu ve kod sonrasıdır', metin: 'Önce tapu (300 B), iş emri ve kod. Müfettiş 26/26 verince Kurul kodundan bir satır seçer.', buton: { ad: 'İşletme Sokağı\'na git', aksiyon: 'sokagaGit', sinif: 'btn-birincil' } }) + '</div>'; return; }
        const sn = o.savunma, hazir = tumGecti(o);
        if (!hazir && !sn) {
          root.innerHTML = '<div class="sayfa sayfa-dar"><div class="sayfa-baslik">' + geri + '<h1>Savunma</h1></div>' + bosHtml({ ikon: 'kalkan', baslik: 'Savunma, Müfettiş 26/26 olunca açılır', metin: 'Şu an açık testler ' + Math.min(6, o.testler.acik.length) + '/6, gizli ve tohumlu testler ' + Math.min(gizliSayisi(), o.testler.gizli.length) + '/' + gizliSayisi() + '. Önce editörde hepsini yeşile çevir.', buton: { ad: 'Editöre dön', aksiyon: 'editoreGit', sinif: 'btn-birincil' } }) + '</div>'; return;
        }
        if (s.sinema && !KK_UI.hizliMod && !reducedMotion()) {
          root.innerHTML = '<div class="sayfa sayfa-genis sv"><div class="sayfa-baslik"><h1>Otopark Açılıyor…</h1><button type="button" class="btn btn-hayalet btn-kucuk" data-action="atla">Atla</button></div><div class="kart sv-sinema" role="img" aria-label="Açılış sinematiği: bariyer yuvaya oturuyor, park yeri çizgileri çiziliyor, ilk araba giriyor">' + I.sahneHtml('acik', { sinema: true, kasaDolu: true }) + '<p class="sv-led" aria-hidden="true">Yeni işletme: ' + esc('@' + I.iyelik(state.ad || 'Deniz') + ' Otoparkı — Çarşı') + '</p></div></div>';
          KK_UI.gecikme(function () { s.sinema = false; save(); refresh(); }, 6200); return;
        }
        if (!s.secim || s.kodHash !== I.hash(o.kod)) { s.secim = secimYap(o); s.kodHash = I.hash(o.kod); s.taslak = ''; save(); }
        const sec = s.secim, satir = satirMetni(o, sec.satir), ad = state.ad || 'Deniz', kodSatirSay = String(o.kod).split('\n').length, dar = window.innerWidth < 760 && !s.tamKod && kodSatirSay > 12;
        let kodBlok;
        if (dar) { const bas = Math.max(1, sec.satir - 5), parca = String(o.kod).split('\n').slice(bas - 1, sec.satir + 5).join('\n'); kodBlok = kodHtml(parca, { baslik: 'Otopark.cs', vurgu: [sec.satir], baslangic: bas }) + '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="tamKod">' + ikon('kod', 18) + 'Tüm Kodu Gör</button>'; }
        else kodBlok = kodHtml(o.kod, { baslik: 'Otopark.cs', vurgu: [sec.satir] });
        const kodKart = '<section class="sv-kod yigin" aria-label="C# kodu, ' + kodSatirSay + ' satır, salt okunur"><div class="sv-kod-ust"><span class="chip chip-gri">' + ikon('kilit', 14) + 'Kodun kilitli</span><mark class="sv-isaret">Kurul\'un seçtiği satır: ' + sec.satir + '. satır</mark></div>' + kodBlok + '</section>';
        const soruKart = '<div class="diyalog sv-soru"><div class="diyalog-portre"><span class="portre">' + ustaSvg('hasan', { boyut: 72, aria: 'Hasan Abi' }) + '</span><b>Hasan Abi</b></div>' + '<div class="balon balon-usta balon-kuyruk"><div class="balon-ad">Hasan Abi</div>' + kodluMetin(ad + ', ' + sec.soru) + '</div>' + '</div>';
        let sag;
        if (sn) {
          const kalan = I.savunmaKalanSn(o);
          sag = soruKart + kurulKart(sn) + (sn.kabul ?
            '<div class="kart sv-acilis kart-parla" role="status"><h2 class="kart-baslik">' + ikon('kutlama', 24) + 'Otopark Açıldı!</h2><p>Bariyer kalktı, ilk araba giriyor. <b>+300 XP</b> ve Açılış Kurdelesi <b>+100 B</b> hesabına işlendi; LED panoda duyuruldu.</p><div class="kart-alt"><button type="button" class="btn btn-altin" data-go="sokak">' + ikon('bina', 20) + 'İşletmeyi Gör</button><button type="button" class="btn btn-hayalet" data-go="panel">İşletme Paneli</button></div></div>' :
            '<div class="kart sv-deneme kart-amber" role="status"><h2 class="kart-baslik">' + ikon('saat', 24) + 'Deneme modunda açıldı</h2><p>İşletmen Deneme modunda açıldı. Gelir %50; ' + (kalan > 0 ? 'yeni Savunma hakkın ' + zamanKalan(kalan) + ' sonra.' : 'yeni Savunma hakkın hazır.') + '</p><p class="mini">Satırı yeniden oku: ' + (/121/.test(sec.soru) ? '121 dakika hangi koşula giriyor?' : 'bu satır hangi koşulda, hangi değeri döndürüyor?') + '</p><div class="kart-alt">' +
            (sn.puan >= 65 && (state.itiraz.kalan > 0) ? '<button type="button" class="btn btn-hayalet" data-action="itiraz">' + ikon('kalkan', 18) + 'İtiraz Et (' + state.itiraz.kalan + '/3)</button>' : '') + (kalan > 0 ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="yirmiDortSaat">Demo: 24 saat geçti</button>' : '<button type="button" class="btn btn-birincil" data-action="yenidenDene">' + ikon('yenile', 18) + 'Yeniden Savunma Yap</button>') + '<button type="button" class="btn btn-hayalet btn-kucuk" data-go="sokak">İşletme Sokağı</button></div></div>');
        } else {
          const n = (s.taslak || '').length;
          sag = soruKart + '<div class="kart sv-cevap"><p class="sv-rubrik"><b>Doğruluk 50</b> (satırı doğru anladın mı?) · <b>Tamlık 30</b> (sınır değerleri ve nedeni) · <b>Açıklık 20</b> (anlaşılır mı?)</p>' +
            '<label class="etiket" for="sv-aciklama">Satırın ne yaptığını kendi cümlelerinle anlat</label><textarea id="sv-aciklama" class="girdi sv-ta" rows="6" maxlength="1500" placeholder="Satırın ne yaptığını kendi cümlelerinle anlat." data-input="yazildi">' + esc(s.taslak || '') + '</textarea>' +
            '<div class="sira sv-alt"><span class="mini soluk' + (n >= 1400 ? ' sv-amber' : '') + '" id="sv-sayac" aria-live="polite">' + n + '/1500 · en az 40 karakter</span><span class="mini soluk">Yapıştırma kapalı · zamanlayıcı yok</span></div>' +
            '<div class="sira" id="sv-gonder-kap"><button type="button" class="btn btn-birincil btn-buyuk" id="sv-gonder" data-action="gonder"' + (n >= 40 ? '' : ' aria-disabled="true"') + '>' + ikon('gonder', 22) + 'Cevabı Gönder</button></div>' +
            (typeof navigator !== 'undefined' && navigator.onLine === false ? '<p class="mini soluk">Çevrimdışısın. Cevabın taslak olarak kaydedildi; bağlanınca gönderebilirsin.</p>' : '') + '<p class="mini soluk">Kodun kilitli. Bayt, Savunma\'dan sonra hesabına geçer.</p></div>';
        }
        root.innerHTML = '<div class="sayfa sayfa-genis sv"><div class="sayfa-baslik">' + geri + '<h1>Savunma — Otopark</h1>' + chipHtml('26/26 test geçti', 'nane', 'tik') + '</div><div class="sv-izgara">' + kodKart + '<div class="sv-sag yigin">' + sag + '</div></div></div>';
        const ta = $id('sv-aciklama');
        if (ta) ta.addEventListener('paste', function (ev) { ev.preventDefault(); toast('Burada kendi cümlelerin lazım.', 'uyari'); });
        if (sn && sn.kabul && !o.acilisOdul) KK_UI.gecikme(function () { acilisOdulu(); }, 80);
      } catch (err) {
        KK_UI.hataKaydet(err, 'savunma');
        root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Savunma sorusu alınamadı.', { tekrar: 'yenile', tekrarAd: 'Tekrar Dene' }) + '</div>';
      }
    },
    leave() { if (ac) { try { ac.abort(); } catch (x) { /* iptal edilmiş */ } } },
    actions: {
      yenile() { refresh(); }, sokagaGit() { go('sokak'); }, editoreGit() { go('editor'); },
      tamKod() { I.ekran('savunma', {}).tamKod = true; refresh(); },
      atla() { const s = I.ekran('savunma', {}); s.sinema = false; save(); refresh(); },
      yazildi(el) {
        const s = I.ekran('savunma', {}), n = (el.value || '').length; s.taslak = el.value; clearTimeout(zm); zm = setTimeout(save, 300);
        const sy = $id('sv-sayac'); if (sy) { sy.textContent = n + '/1500 · en az 40 karakter'; sy.classList.toggle('sv-amber', n >= 1400); }
        const b = $id('sv-gonder'); if (b) { if (n >= 40) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true'); }
      },
      durdur() { ai.durdur(); },
      async gonder(el) {
        const o = I.kayit(), s = I.ekran('savunma', {}), sec = s.secim, ta = $id('sv-aciklama'), aciklama = ((ta && ta.value) || '').trim(); if (!sec || calisiyor) return;
        if (aciklama.length < 40) { toast('Cevap en az 40 karakter olmalı.', 'uyari'); return; }
        calisiyor = true; ac = ai.yeniIptal(); const kap = $id('sv-gonder-kap');
        if (kap) kap.innerHTML = '<div class="sv-bekle" role="status"><span class="muhur muhur-bekle" aria-hidden="true">' + ikon('muhur', 34) + '</span><span>Kurul değerlendiriyor…</span><button type="button" class="btn btn-hayalet" data-action="durdur">' + ikon('dur', 18) + 'Durdur</button></div>';
        const r = await aiSavunma({ satir: satirMetni(o, sec.satir).trim(), soru: sec.soru, aciklama: aciklama, kod: o.kod, anahtarlar: sec.anahtarlar, signal: ac.signal });
        calisiyor = false;
        if (!r) { toast('Savunma durduruldu; taslağın korundu.', 'bilgi'); refresh(); return; }
        let ol; try { ol = KK_CORE.cevrimdisiPuanla({ soruTipi: 'Kod Yazma', soru: sec.soru, rubrik: [{ ad: 'Doğruluk', agirlik: 50 }, { ad: 'Tamlık', agirlik: 30 }, { ad: 'Açıklık', agirlik: 20 }], cevap: aciklama, anahtarlar: sec.anahtarlar, ad: state.ad }); } catch (x) { ol = null; }
        const om = (ol && ol.olcutler) || [{ ad: 'Doğruluk', puan: 20, not: 'Satırın rolü kısmen anlatıldı.' }, { ad: 'Tamlık', puan: 12, not: 'Sınır değerleri eksik.' }, { ad: 'Açıklık', puan: 10, not: 'Cümleler okunaklı.' }];
        const mx = [50, 30, 20], lift = [35, 21, 14];
        const olcutler = om.slice(0, 3).map(function (k, i) { return { ad: k.ad, not: k.not, puan: r.kabul ? Math.max(k.puan, lift[i]) : Math.min(k.puan, lift[i] - 1) }; });
        const puan = olcutler.reduce(function (t, k) { return t + k.puan; }, 0), g = String(r.gerekce || '').trim();
        const hasan = (g.indexOf(state.ad || '') === 0 ? '' : (state.ad || 'Deniz') + ', ') + g + (r.kabul ? ' Bariyeri kaldırıyorum, ilk araba geliyor.' : ' Bugün dükkânı yarı gelirle açıyoruz; 24 saat sonra yeniden anlatırsın. Önce satırı elle izle.');
        const ilkAcilis = r.kabul && !o.acilisOdul;
        o.savunma = { soruId: sec.id, satir: sec.satir, soru: sec.soru, aciklama: aciklama, puan: puan, olcutler: olcutler, kabul: !!r.kabul, hasan: hasan, kaynak: r.kaynak, uyari: r.uyari || (r.hataKodu ? 'Kurul şu an ulaşılamıyor, çevrimdışı demo kullanıldı.' : ''), zaman: Date.now() };
        I.isletmeAc(r.kabul ? 'acik' : 'deneme'); s.taslak = ''; s.sinema = ilkAcilis; if (r.kabul) rozetVer('ilk-acilis'); save(); hud(); refresh();
        if (r.kabul && !s.sinema) await acilisOdulu();
      },
      itiraz() {
        const o = I.kayit(), sn = o.savunma; if (!sn || sn.kabul || state.itiraz.kalan < 1) return; state.itiraz.kalan--;
        if (sn.puan >= 65) { sn.kabul = true; sn.puan = Math.max(70, sn.puan); sn.olcutler[0].puan = Math.max(sn.olcutler[0].puan, 35); sn.hasan = (state.ad || 'Deniz') + ', ikinci okumada satırı doğru bağladığını gördüm. Bariyeri kaldırıyorum, ilk araba geliyor.'; I.isletmeAc('acik'); I.ekran('savunma', {}).sinema = true; toast('Kurul cevabı bir kez daha okudu: Açılış!', 'basari'); }
        else toast('Kurul cevabı bir kez daha okudu; karar değişmedi.', 'bilgi');
        save(); refresh();
      },
      yirmiDortSaat() { const o = I.kayit(); if (o.savunma) o.savunma.zaman = Date.now() - 86400000 - 1000; save(); refresh(); },
      yenidenDene() { const o = I.kayit(), s = I.ekran('savunma', {}); o.savunma = null; s.secim = null; s.taslak = ''; save(); refresh(); }
    },
    async selftest(root, ctx) {
      const o = state.isletmeler.otopark; o.durum = 'kapali'; o.kod = I.op().referansKod; o.testler = { acik: [], gizli: [] }; save(); refresh();
      if (!/Müfettiş 26\/26/.test(root.textContent)) throw new Error('Testler yeşil değilken Savunma kilitli olmalı ve nedeni söylenmeli');
      o.testler = { acik: I.acikTestler().map(function (t) { return t.id; }), gizli: I.gizliTestler().concat(I.tohumlu()).map(function (t) { return t.id; }) }; save(); refresh();
      await ctx.bekleSecici('#sv-aciklama');
      const sec = state.ekran.savunma.secim; if (!sec || !sec.satir) throw new Error('Kurul bir satır seçmedi');
      if (!root.querySelector('.kl.vurgu, mark')) throw new Error('Seçilen satır vurgulanmadı');
      await ctx.yaz('#sv-aciklama', 'Bu satır ' + (sec.anahtarlar || []).slice(0, 4).join(' ve ') + ' mantığıyla hesabı yapıyor; yani başlayan saat yukarı yuvarlanıp birim fiyatla çarpılıyor, böylece ücret çıkıyor.');
      await ctx.tikla('#sv-gonder'); await ctx.bekleSecici('.sv-acilis', 4000);
      if (o.durum !== 'acik') throw new Error('Kabul sonrası durum açık olmalı: ' + o.durum);
      await ctx.bekle(200); KK_UI.modalTemizle(); if (state.xp < 640) throw new Error('Açılış +300 XP işlenmedi (xp ' + state.xp + ')');
    }
  });
})();
