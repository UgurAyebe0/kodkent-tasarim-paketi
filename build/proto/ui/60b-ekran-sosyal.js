/* ==== ui/60b-ekran-sosyal.js — P3 (3/4): Profil & Rozet Duvarı (kodu dışa aktar) ve Liderlik Panosu (6 pano) ====
   Profil, Dolap'ta giyilen parçaları anında gösterir (state.avatar). Liderlik: B6 §8 formülleri (Konum, OdulBayt, Hareket) birebir; LP = state.xp (demo: tek oturum = tek hafta). */
(function () {
  const S = KK_UI.sosyal;
  const veri = S.veri;
  const BANTLAR = [['Çırak', '1–5', 'Gri'], ['Kalfa', '6–11', 'Mavi'], ['Zanaatkâr', '12–17', 'Yeşil'], ['Mühendis', '18–24', 'Turuncu'], ['Baş Mühendis', '25–31', 'Kırmızı'], ['Mimar', '32–39', 'Mor'], ['Şehir Mimarı', '40–59', 'Altın'], ['Efsane', '60', 'Animasyonlu altın']];
  const BILDIR_NEDEN = ['Küfür / hakaret', 'Zorbalık / taciz', 'Uygunsuz içerik', 'Kişisel bilgi', 'Dışarı çağırma', 'Hile / dolandırıcılık', 'Spam', 'Diğer'];

  /** Ortak: Bildir modalı (Profil, Sohbet). */
  S.bildirModal = function (baslik) {
    modal({ sinif: 'scr-sosyal', baslik: baslik || 'Bildir', ikon: 'uyari', html: '<fieldset class="bildir-liste"><legend class="sr">Neden bildiriyorsun?</legend>' + BILDIR_NEDEN.map(function (n, i) { return '<label class="secim-kart"><input type="radio" name="bildir-neden" value="' + i + '"' + (i === 0 ? ' checked' : '') + '><span>' + esc(n) + '</span></label>'; }).join('') + '</fieldset><p class="mini soluk">Acil bir durumdaysan 112\'yi, destek için ALO 183\'ü arayabilirsin. Güvendiğin bir yetişkinle konuş.</p>',
      butonlar: [{ ad: 'Vazgeç' }, { ad: 'Bildir', birincil: true, veri: 'bildir-gonder', aksiyon: function () { toast('Bildirimin bize ulaştı. Her bildirim okunur; sonucu ayrıca yazamayabiliriz.', 'basari'); } }] });
  };
  const dostMu = function (ad) { return ((veri().sohbet && veri().sohbet.arkadaslar) || []).some(function (x) { return x.ad === ad; }); };
  function oyuncuBul(ad) {
    const v = veri(), L = (v.liderlik && v.liderlik.haftalik) || [], F = (v.sohbet && v.sohbet.arkadaslar) || [], K = (v.liderlik && v.liderlik.kalicilik) || [];
    return L.filter(function (x) { return x.ad === ad; })[0] || F.filter(function (x) { return x.ad === ad; })[0] || K.filter(function (x) { return x.ad === ad; })[0] || ekRakip(L.length).filter(function (x) { return x.ad === ad; })[0] || null;
  }
  const sayiTopla = function (a) { return (a || []).reduce(function (t, x) { return t + (typeof x === 'number' ? x : (x && typeof x.bayt === 'number' ? x.bayt : (x && typeof x.gelir === 'number' ? x.gelir : 0))); }, 0); };

  /* ---- kod dışa aktarma: Otopark.cs + Program.cs + .csproj (.zip, store) ---- */
  function crc32(u8) { let crc = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) { crc ^= u8[i]; for (let k = 0; k < 8; k++) crc = (crc & 1) ? (crc >>> 1) ^ 0xEDB88320 : (crc >>> 1); } return (crc ^ 0xFFFFFFFF) >>> 0; }
  function zipYap(dosyalar) {
    const enc = new TextEncoder(), parcalar = [], merkez = []; let ofs = 0;
    dosyalar.forEach(function (f) {
      const ad = enc.encode(f.ad), v = enc.encode(f.metin), crc = crc32(v), y = new DataView(new ArrayBuffer(30)), m = new DataView(new ArrayBuffer(46));
      y.setUint32(0, 0x04034b50, true); y.setUint16(4, 20, true); y.setUint16(6, 0x0800, true); y.setUint16(8, 0, true); y.setUint16(10, 0, true); y.setUint16(12, 0x21, true);
      y.setUint32(14, crc, true); y.setUint32(18, v.length, true); y.setUint32(22, v.length, true); y.setUint16(26, ad.length, true); y.setUint16(28, 0, true);
      parcalar.push(new Uint8Array(y.buffer), ad, v);
      m.setUint32(0, 0x02014b50, true); m.setUint16(4, 20, true); m.setUint16(6, 20, true); m.setUint16(8, 0x0800, true); m.setUint16(10, 0, true); m.setUint16(12, 0, true); m.setUint16(14, 0x21, true);
      m.setUint32(16, crc, true); m.setUint32(20, v.length, true); m.setUint32(24, v.length, true); m.setUint16(28, ad.length, true); m.setUint16(30, 0, true); m.setUint16(32, 0, true); m.setUint16(34, 0, true); m.setUint16(36, 0, true); m.setUint32(38, 0, true); m.setUint32(42, ofs, true);
      merkez.push(new Uint8Array(m.buffer), ad); ofs += 30 + ad.length + v.length;
    });
    let mb = 0; merkez.forEach(function (p) { mb += p.length; });
    const son = new DataView(new ArrayBuffer(22));
    son.setUint32(0, 0x06054b50, true); son.setUint16(4, 0, true); son.setUint16(6, 0, true); son.setUint16(8, dosyalar.length, true); son.setUint16(10, dosyalar.length, true); son.setUint32(12, mb, true); son.setUint32(16, ofs, true); son.setUint16(20, 0, true);
    return new Blob(parcalar.concat(merkez, [new Uint8Array(son.buffer)]), { type: 'application/zip' });
  }
  function projeDosyalari() {
    const o = isletmeKaydi('otopark'), v = veri(), ham = (o.kod && o.kod.trim()) || (v.otopark && (v.otopark.referansKod || v.otopark.templateKod)) || '';
    const cs = /class\s+Otopark/.test(ham) ? ham : 'public static class Otopark\n{\n' + ham.split('\n').map(function (s) { return '    ' + s; }).join('\n') + '\n}\n';
    return [
      { ad: 'Otopark.cs', metin: cs },
      { ad: 'Program.cs', metin: 'using System;\n\nforeach (int dakika in new[] { 30, 119, 120, 121, 360, 361, 1440 })\n{\n    Console.WriteLine($"{dakika} dk -> {Otopark.UcretHesapla(dakika)} TL");\n}\n' },
      { ad: 'Otopark.csproj', metin: '<Project Sdk="Microsoft.NET.Sdk">\n  <PropertyGroup>\n    <OutputType>Exe</OutputType>\n    <TargetFramework>net8.0</TargetFramework>\n    <Nullable>enable</Nullable>\n    <ImplicitUsings>enable</ImplicitUsings>\n  </PropertyGroup>\n</Project>\n' }
    ];
  }

  /* ================= PROFİL ================= */
  const PR = { sekme: 'istatistik', oyuncu: null };
  function istatistikler() {
    const dIds = Object.keys(state.dersler), puanlar = [];
    dIds.forEach(function (id) { Object.keys(state.dersler[id].puanlar || {}).forEach(function (k) { const p = state.dersler[id].puanlar[k]; if (typeof p === 'number') puanlar.push(p); }); });
    const gor = Object.keys(state.gorevler), gTam = gor.filter(function (g) { return state.gorevler[g].tamam; }).length;
    const gelir = Object.keys(state.isletmeler).reduce(function (t, k) { return t + sayiTopla(state.isletmeler[k].gelir7); }, 0);
    return { ders: dIds.filter(function (id) { return state.dersler[id].tamam; }).length, ort: puanlar.length ? Math.round(puanlar.reduce(function (a, b) { return a + b; }, 0) / puanlar.length) : null, muhur: dIds.filter(function (id) { return state.dersler[id].mohur; }).length, gTam: gTam, gTop: Math.max(gor.length, 4), seri: state.tekrar.seri || 0, gelir: gelir };
  }
  function rozetDuvari(kendi) {
    const R2 = veri().rozetler || [], kz = S.rozetIdler();
    const ust = kz.length ? '' : '<p class="pr-nisan-not">' + ikon('muhur', 20) + '<span><b>Nişanlar satın alınmaz, kazanılır.</b> İlk hedefin: Keskin Göz.</span></p>';
    return ust + '<div class="pr-rozetler">' + R2.map(function (r) {
      const k = kz.indexOf(r.id) >= 0;
      return '<button type="button" class="pr-rozet' + (k ? ' kazanildi' : '') + '" data-action="pr-rozet" data-id="' + esc(r.id) + '" aria-label="' + esc(r.ad + ', ' + (k ? 'kazanıldı' : 'kazanılmadı. ' + r.nasil)) + '"><span class="rozet rozet-buyuk ' + (k ? 'rozet-nisan' : 'rozet-kilitli') + '">' + ikon(r.ikon || 'madalya', 34) + '</span><b>' + esc(r.ad) + '</b><small>' + (k ? 'Kazanıldı' : 'Kilitli') + '</small></button>';
    }).join('') + '</div>';
  }
  function portfoy(kendi) {
    const L = (veri().isletmeler || []).filter(function (i) { const k = state.isletmeler[i.id]; return k && k.durum !== 'yok'; });
    if (!L.length) return bosHtml({ ikon: 'bina', baslik: 'Henüz işletmen yok', metin: "İlk tapun Çarşı'da seni bekliyor: Otopark, 300 B · Sev. 3 · Ruhsat 3/3.", buton: { ad: 'Işletme Sokağı\'na git'.replace('Işletme', 'İşletme'), aksiyon: 'pr-sokak', sinif: 'btn-birincil' } });
    return '<div class="yigin">' + L.map(function (i) {
      const k = state.isletmeler[i.id];
      return '<div class="kart pr-isletme"><div class="sira"><b class="pr-isletme-ad">' + esc(i.ad) + '</b>' + isletmeDurumHtml(k.durum) + chipHtml('L' + (k.seviye || 1), 'turkuaz') + '</div><div class="kart-alt"><button type="button" class="btn btn-kucuk btn-birincil" data-action="pr-panel">İşletme Paneli</button><button type="button" class="btn btn-kucuk btn-hayalet" data-action="pr-vitrin">Vitrin</button><button type="button" class="btn btn-kucuk btn-altin" data-action="pr-disa-aktar" data-id="' + esc(i.id) + '">' + ikon('kod', 16) + 'Kodu dışa aktar</button></div></div>';
    }).join('') + '</div>';
  }
  function hediyeKarti(sv) {
    const L = []; for (let i = Math.max(2, sv - 4); i <= sv; i++) L.push(seviyeHediyesi(i));
    const sonraki = seviyeHediyesi(sv + 1);
    return '<div class="kart pr-hediye"><h2 class="kart-baslik">' + ikon('hediye', 20) + 'Seviye Hediyeleri</h2><p class="mini soluk">Hediye Bayt, Çip ya da XP değildir: kozmetik ve kapasite.</p><ul class="liste">' + L.reverse().map(function (h) { return '<li class="satir"><span class="satir-ana"><span class="satir-baslik">Sev. ' + h.seviye + ' · ' + esc(h.ad) + '</span><span class="satir-alt">' + esc(h.aciklama) + '</span></span><span class="satir-sag">' + ikon('test-gecti', 18) + '</span></li>'; }).join('') + '<li class="satir satir-kilitli"><span class="satir-ana"><span class="satir-baslik">Sev. ' + sonraki.seviye + ' · ' + esc(sonraki.ad) + '</span><span class="satir-alt">Sıradaki hediye</span></span><span class="satir-sag">' + ikon('kilit', 18) + '</span></li></ul></div>';
  }
  function profilKendi(root) {
    const sv = seviyeBilgi(), st = istatistikler(), g = S.giyiliDurum(), kz = S.rozetIdler();
    const nisan = g.nisan ? (veri().rozetler || []).filter(function (r) { return r.id === g.nisan; })[0] : null;
    const tab = function (id, ad) { return '<button type="button" role="tab" id="pr-sekme-' + id + '" class="sekme" aria-selected="' + (PR.sekme === id) + '" data-action="pr-sekme" data-sekme="' + id + '">' + ad + '</button>'; };
    root.innerHTML = '<div class="sayfa sayfa-genis pr-sayfa"><div class="sayfa-baslik"><h1>Profil</h1></div><div class="sekmeler pr-sekmeler" role="tablist" aria-label="Profil bölümleri">' + tab('istatistik', 'İstatistik') + tab('rozetler', 'Rozetler') + tab('isletmeler', 'İşletmeler') + '</div><div class="pr-duzen">' +
      '<section class="kart pr-kimlik" aria-label="Kimlik kartı"><div class="av-sahne pr-av" role="img" aria-label="' + esc(avatarTarif(state.avatar)) + '">' + avatarSvg(state.avatar, { boyut: 200, kadraj: 'tam', aria: avatarTarif(state.avatar) }) + '</div>' +
      '<div class="pr-kimlik-metin"><h2 class="pr-ad">@' + esc(state.ad || 'misafir') + (nisan ? ' <span class="pr-nisan-ik" title="' + esc(nisan.ad) + '">' + ikon(nisan.ikon || 'madalya', 20) + '</span>' : '') + '</h2>' +
      '<button type="button" class="chip chip-mor chip-buyuk pr-unvan" data-action="pr-unvan" aria-label="Unvan: ' + esc(sv.unvan) + '. Unvan bantlarını göster">' + ikon('madalya', 16) + esc(sv.unvan) + ' · Sev. ' + sv.seviye + '</button>' +
      cubukHtml(sv.yuzde, { tur: 'xp', etiket: 'Seviye ilerlemesi' }) + '<p class="mini soluk">' + (sv.gereken ? fmt(sv.kalan) + ' / ' + fmt(sv.gereken) + ' XP · Sev. ' + (sv.seviye + 1) + '\'e ' + fmt(sv.gereken - sv.kalan) + ' XP' : 'Seviye tavanı') + '</p>' +
      '<p class="mini">Adres: <b>' + esc(state.ad || 'misafir') + '\'nin Odası</b></p><div class="sira-s"><button type="button" class="btn btn-kucuk btn-birincil" data-action="pr-oda">Odam</button><button type="button" class="btn btn-kucuk" data-action="pr-dolap">Dolap</button></div></div></section>' +
      '<section class="pr-panel pr-istat' + (PR.sekme === 'istatistik' ? ' aktif' : '') + '" aria-label="İstatistikler"><div class="kart"><h2 class="kart-baslik">' + ikon('liste', 20) + 'İstatistikler</h2><dl class="pr-dl"><div><dt>Tamamlanan ders</dt><dd>' + st.ders + '</dd></div><div><dt>Ortalama Kurul puanı</dt><dd>' + (st.ort == null ? '—' : st.ort + '/100') + '</dd></div><div><dt>Ders Mührü</dt><dd>' + st.muhur + '</dd></div><div><dt>Tamamlanan görev</dt><dd>' + st.gTam + '/' + st.gTop + '</dd></div><div><dt>Günlük Tekrar serisi</dt><dd>' + st.seri + ' gün</dd></div><div><dt>Toplam işletme geliri</dt><dd>' + (st.gelir ? fmt(st.gelir) + ' B' : 'Henüz yok') + '</dd></div></dl></div>' + hediyeKarti(sv.seviye) + '</section>' +
      '<section class="pr-panel pr-rozetp' + (PR.sekme === 'rozetler' ? ' aktif' : '') + '" aria-label="Rozet Duvarı"><div class="kart"><h2 class="kart-baslik">' + ikon('madalya', 20) + 'Rozet Duvarı <span class="chip chip-gri">' + kz.length + '/' + (veri().rozetler || []).length + '</span></h2>' + rozetDuvari(true) + '</div></section>' +
      '<section class="pr-panel pr-isl' + (PR.sekme === 'isletmeler' ? ' aktif' : '') + '" aria-label="İşletme portföyü"><div class="kart"><h2 class="kart-baslik">' + ikon('bina', 20) + 'İşletme portföyü</h2>' + portfoy(true) + '</div></section></div></div>';
  }
  function profilBaska(root, ad) {
    const p = oyuncuBul(ad), dost = dostMu(ad);
    if (!p) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Profil yüklenemedi.', { baslik: 'Oyuncu bulunamadı', tekrar: 'pr-geri' }) + '</div>'; return; }
    const sev = p.seviye || 4;
    if (S.yasBandi() === 'genc' && !dost) { root.innerHTML = '<div class="sayfa sayfa-dar"><div class="sayfa-baslik"><h1>@' + esc(ad) + '</h1></div>' + bosHtml({ ikon: 'kilit', baslik: 'Bu profil yalnızca arkadaşlara açık.', metin: '15–17 yaş güvenli modunda tanımadığın oyuncuların profili kapalıdır.', buton: { ad: 'Profilime dön', aksiyon: 'pr-geri', sinif: 'btn-birincil' } }) + '</div>'; return; }
    const atlari = ['Ayrıntılı profil bilgisi (cüzdan, Çip, son giriş) başkasına görünmez.'];
    root.innerHTML = '<div class="sayfa sayfa-dar pr-sayfa"><div class="sayfa-baslik"><h1>@' + esc(ad) + '</h1><button type="button" class="btn btn-hayalet btn-kucuk" data-action="pr-geri">' + ikon('ok-sol', 16) + 'Profilime dön</button></div>' +
      '<section class="kart pr-kimlik pr-baska"><div class="av-sahne pr-av" role="img" aria-label="' + esc(avatarTarif(p.avatar || {})) + '">' + avatarSvg(p.avatar || {}, { boyut: 190, kadraj: 'tam', aria: avatarTarif(p.avatar || {}) }) + '</div><div class="pr-kimlik-metin"><h2 class="pr-ad">@' + esc(ad) + '</h2><p>' + chipHtml(unvan(sev) + ' · Sev. ' + sev, 'mor', 'madalya') + (dost ? ' ' + chipHtml('Arkadaşın', 'nane', 'tik') : '') + '</p><p class="mini soluk">' + esc(atlari[0]) + '</p>' +
      '<div class="sira-s">' + (dost ? '' : '<button type="button" class="btn btn-kucuk btn-birincil" data-action="pr-arkadas" data-ad="' + esc(ad) + '">Arkadaş Ekle</button>') + '<button type="button" class="btn btn-kucuk" data-action="pr-oda-git" data-ad="' + esc(ad) + '">Odasına Git</button><button type="button" class="btn btn-kucuk btn-hayalet" data-action="pr-sikayet">Şikâyet Et</button></div></div></section></div>';
  }
  function disaAktarModal() {
    const d = projeDosyalari(), boyut = d.reduce(function (t, f) { return t + f.metin.length; }, 0), kb = Math.max(1, Math.round(boyut / 1024));
    modal({ sinif: 'scr-sosyal', baslik: 'Kodu dışa aktar: Otopark', ikon: 'kod', genis: true,
      html: '<p class="soluk">Kodun çalışan bir C# konsol projesidir: Visual Studio ya da <code>dotnet run</code> ile derlenir. Dışa aktarma ücretsizdir.</p>' + kodHtml(d[0].metin, { baslik: 'Otopark.cs', satirNo: true }) + '<p class="mini soluk">İndirme senin eylemin: Otopark.zip · ≈ ' + kb + ' KB · 3 dosya (Otopark.cs, Program.cs, Otopark.csproj).</p>',
      butonlar: [{ ad: 'Kapat' }, { ad: 'Panoya Kopyala', veri: 'pr-kopya', kapat: false, aksiyon: function () { kopyala(d[0].metin).then(function (ok) { toast(ok ? 'Panoya kopyalandı.' : 'Kopyalanamadı; kodu elle seçip kopyalayabilirsin.', ok ? 'basari' : 'uyari'); }); return false; } },
        { ad: 'Konsol Projesi (.zip) İndir', birincil: true, veri: 'pr-zip', kapat: false, aksiyon: function () {
          indirDosya('Otopark.zip', zipYap(d), d[0].metin);
          return false; } }] });
  }
  KK_UI.screen('profil', {
    ad: 'Profil & Rozet Duvarı', hud: true,
    render(root, ctx) {
      root.classList.add('scr-sosyal');
      if (ctx.ilk) { PR.oyuncu = ctx.parametre && ctx.parametre.oyuncu && ctx.parametre.oyuncu !== state.ad ? ctx.parametre.oyuncu : null; }
      try { if (PR.oyuncu) profilBaska(root, PR.oyuncu); else profilKendi(root); } catch (e) { KK_UI.hataKaydet(e, 'profil'); root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Profil yüklenemedi.', { baslik: 'Profil açılamadı', tekrar: 'pr-geri' }) + '</div>'; }
    },
    actions: {
      'pr-geri': function () { PR.oyuncu = null; refresh(); },
      'pr-sekme': function (el) { PR.sekme = el.getAttribute('data-sekme'); refresh(); },
      'pr-oda': function () { go('oda'); }, 'pr-dolap': function () { go('dolap'); }, 'pr-sokak': function () { go('sokak'); }, 'pr-panel': function () { go('panel'); }, 'pr-vitrin': function () { go('vitrin'); },
      'pr-unvan': function () {
        const sv = seviyeBilgi();
        modal({ sinif: 'scr-sosyal', baslik: 'Unvan bantları', ikon: 'madalya', html: '<p class="soluk">Unvan oyun avantajı vermez; tabelada, sohbette ve profilde görünür. "Usta" yalnızca NPC öğretmen unvanıdır.</p><div class="tablo-kap"><table class="tablo"><thead><tr><th scope="col">Unvan</th><th scope="col">Seviye</th><th scope="col">İsim rengi</th></tr></thead><tbody>' + BANTLAR.map(function (b) { return '<tr' + (b[0] === sv.unvan ? ' class="pr-bant-ben"' : '') + '><th scope="row">' + esc(b[0]) + (b[0] === sv.unvan ? ' ' + chipHtml('sen', 'amber') : '') + '</th><td>' + b[1] + '</td><td>' + b[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' });
      },
      'pr-rozet': function (el) {
        const r = (veri().rozetler || []).filter(function (x) { return x.id === el.getAttribute('data-id'); })[0]; if (!r) return;
        const k = S.rozetIdler().indexOf(r.id) >= 0, g = S.giyiliDurum();
        modal({ sinif: 'scr-sosyal', baslik: r.ad, ikon: r.ikon || 'madalya', html: '<div class="pr-rozet-modal"><span class="rozet rozet-buyuk ' + (k ? 'rozet-nisan' : 'rozet-kilitli') + '">' + ikon(r.ikon || 'madalya', 34) + '</span><div><p>' + esc(k ? r.aciklama : 'Henüz kazanılmadı.') + '</p><p class="soluk"><b>Nasıl kazanılır?</b> ' + esc(r.nasil) + '</p></div></div>', butonlar: [{ ad: 'Kapat' }].concat(k ? [{ ad: g.nisan === r.id ? 'Etiketten kaldır' : 'Etiketimde göster', birincil: true, veri: 'pr-etiket', aksiyon: function () { g.nisan = g.nisan === r.id ? null : r.id; S.kaydet(); toast(g.nisan ? 'Nişan isim etiketinde görünecek.' : 'Nişan etiketten kaldırıldı.', 'basari'); refresh(); } }] : []) });
      },
      'pr-disa-aktar': function () { disaAktarModal(); },
      'pr-arkadas': function (el) { const ad = el.getAttribute('data-ad'); toast('@' + ad + ' adlı oyuncuya istek gönderildi. Karşılıklı onay gerekir.', 'basari'); },
      'pr-oda-git': function (el) { go('oda', { parametre: { oda: el.getAttribute('data-ad') } }); },
      'pr-sikayet': function () { S.bildirModal('Oyuncuyu bildir'); }
    },
    async selftest(root, ctx) {
      const o = isletmeKaydi('otopark'), v = veri(); o.durum = 'acik'; o.kod = (v.otopark && (v.otopark.referansKod || v.otopark.templateKod)) || 'public static int UcretHesapla(int dakika) { return 0; }'; save(); PR.oyuncu = null; refresh();
      await ctx.tikla('[data-action="pr-disa-aktar"]');
      await ctx.bekleSecici('.modal');
      if (!/Otopark\.cs/.test(ctx.metin('.modal'))) throw new Error('dışa aktarma modalı Otopark.cs göstermiyor');
      const bayt = zipYap(projeDosyalari()).size; if (bayt < 100) throw new Error('zip üretilemedi');
      KK_UI.modalTemizle();
      await ctx.tikla('[data-action="pr-unvan"]'); await ctx.bekleSecici('.modal');
      if (!/Efsane/.test(ctx.metin('.modal'))) throw new Error('unvan bantları eksik'); KK_UI.modalTemizle();
      await ctx.tikla('[data-action="pr-rozet"]'); await ctx.bekleSecici('.modal'); KK_UI.modalTemizle();
      PR.oyuncu = 'ayse_kod'; refresh(); await ctx.bekleSecici('[data-action="pr-oda-git"]');
      await ctx.tikla('[data-action="pr-oda-git"]'); if (ctx.gidilen() !== 'oda') throw new Error('Odasına Git yönlenmedi');
      PR.oyuncu = null;
    }
  });

  /* ================= LİDERLİK ================= */
  const LD = { pano: 'haftalik', dilim: 'tum', segment: 'l12', sec: null, hpBas: 0 };
  const PANOLAR = [['haftalik', 'Haftalık Lig'], ['kalicilik', 'Kalıcılık Ligi'], ['hizli', 'En Hızlı Otopark'], ['kazanc', 'En Kazançlı İşletme'], ['arkadas', 'Arkadaşlar'], ['soru', 'Meydan Sorusu']];
  const HP = { soru: 'int x = 17 / 5; satırından sonra x kaç olur?', secenekler: ['3', '3,4', '4'], dogru: 0, aciklama: 'int bölmesi kesri atar: 17 / 5 = 3.' };
  /** B6 §8.2: ölçekli konum, ödül ve hareket (terfi/düşme) — C# referansının birebir karşılığı. */
  const konum = function (sira, n) { return 1 + Math.floor((sira - 1) * 30 / n); };
  const odulBayt = function (k) { return k === 1 ? 300 : k <= 3 ? 200 : k <= 7 ? 150 : k <= 12 ? 100 : k <= 20 ? 50 : k <= 25 ? 20 : 0; };
  const hareket = function (n) { return n < 6 ? [0, 0] : [Math.round(n * 7 / 30), Math.round(n * 5 / 30)]; };
  /** Bronz kova 30 kişidir (B6 §8.2): veri 12 rakip taşır, kalan 17'si gösterim için sabit örnek oyunculardır; böylece sıra = ödül konumu olur (oranlama yalnız n<30 için kalır). */
  const EK_AD = ['nur_array', 'tolga_if', 'irem_loop', 'batu_01', 'toprak_cs', 'mina_string', 'kerem_for', 'sude_int', 'arda_bool', 'ceren_var', 'yigit_try', 'pelin_dev', 'berk_class', 'asli_json', 'ozan_ram', 'duru_pixel', 'cem_ctrl'];
  const EK_XP = [455, 432, 408, 391, 372, 318, 296, 271, 244, 219, 197, 176, 158, 133, 112, 96, 71];
  const ekRakip = function (var_) { return EK_AD.slice(0, Math.max(0, 29 - var_)).map(function (ad, i) { return { ad: ad, seviye: i < 5 ? 4 : 3, xp: EK_XP[i], avatar: { ten: i % 6, sacStil: (i * 3) % 8, sacRenk: (i * 5) % 6, kiyafet: (i * 7) % 6, aksesuar: [] } }; }); };
  function haftalik() {
    const L = (veri().liderlik && veri().liderlik.haftalik) || [], ben = { ad: state.ad || 'sen', seviye: seviyeBilgi().seviye, xp: Number(state.xp) || 0, avatar: state.avatar, ben: true };
    const hepsi = L.map(function (x) { return Object.assign({}, x); }).concat(ekRakip(L.length)).concat([ben]);
    hepsi.sort(function (a, b) { return (b.xp - a.xp) || (a.ben ? 1 : b.ben ? -1 : 0); });
    hepsi.forEach(function (x, i) { x.sira = i + 1; });
    return hepsi;
  }
  const av32 = function (a, ad) { return '<span class="ld-av" aria-hidden="true">' + avatarSvg(a || {}, { boyut: 40, kadraj: 'bust' }) + '</span>'; };
  function satir(o) {
    return '<div role="row" class="satir ld-satir' + (o.ben ? ' satir-ben' : '') + (o.bolge ? ' bolge-' + o.bolge : '') + '" tabindex="0" data-action="ld-satir" data-ad="' + esc(o.ad) + '" aria-label="' + esc('Sıra ' + o.sira + ', ' + o.ad + ', ' + (o.unvanMetni || '') + ', ' + o.sagYazi + (o.bolge === 'terfi' ? ', terfi bölgesinde' : o.bolge === 'dusme' ? ', düşme bölgesinde' : '')) + '">' +
      '<span role="cell" class="sira-no' + (o.sira <= 3 ? ' s' + o.sira : '') + '">' + o.sira + '</span><span role="cell" class="ld-oyuncu">' + av32(o.avatar, o.ad) + '<span class="ld-ad"><b>' + (o.ben ? esc(o.ad) + ' (sen)' : '@' + esc(o.ad)) + '</b><small>' + esc(o.unvanMetni || '') + '</small></span></span>' +
      '<span role="cell" class="ld-sag">' + (o.etiket || '') + '<b class="sayi">' + o.sag + '</b>' + (o.bolge ? '<span class="ld-bolge ' + o.bolge + '">' + (o.bolge === 'terfi' ? '▲ Terfi' : '▼ Düşme') + '</span>' : '') + '</span></div>';
  }
  const unvanM = function (sev) { return unvan(sev) + ' · Sev. ' + sev; };
  function mini() {
    if (!LD.sec) return '';
    const ad = LD.sec, p = oyuncuBul(ad), ben = ad === (state.ad || 'sen');
    return '<div class="kart ld-mini" aria-live="polite"><div class="ld-mini-ust">' + av32((p && p.avatar) || state.avatar) + '<div><b>' + (ben ? esc(ad) + ' (sen)' : '@' + esc(ad)) + '</b><br><small class="soluk">' + (p ? esc(unvanM(p.seviye || 4)) : '') + '</small></div></div><div class="sira-s">' + (ben ? '<button type="button" class="btn btn-kucuk btn-birincil" data-action="ld-profil" data-ad="' + esc(ad) + '">Profil</button>' : '<button type="button" class="btn btn-kucuk btn-birincil" data-action="ld-profil" data-ad="' + esc(ad) + '">Profil</button><button type="button" class="btn btn-kucuk" data-action="ld-arkadas" data-ad="' + esc(ad) + '">Arkadaş Ekle</button>') + (LD.pano === 'hizli' && !ben ? '<button type="button" class="btn btn-kucuk btn-hayalet" data-action="ld-vitrin">Vitrin</button>' : '') + '<button type="button" class="btn btn-kucuk btn-hayalet btn-ikon" data-action="ld-mini-kapat" aria-label="Kartı kapat">' + ikon('carpi', 16) + '</button></div></div>';
  }
  function haftalikGovde() {
    const H = haftalik(), n = H.length, ben = H.filter(function (x) { return x.ben; })[0], hr = hareket(n), terfi = hr[0], dusme = 0 /* Bronz'da düşme yok */, kapanis = S.sonraki(0, 21);
    const sev = seviyeBilgi().seviye;
    let cumle;
    if (ben.xp < 100) cumle = 'Ödül ve terfi için en az 100 XP gerekiyor. Şu an ' + fmt(ben.xp) + ' XP\'sin.';
    else if (ben.sira <= terfi) cumle = 'Terfi bölgesindesin. Yerini korumak için ' + fmt(Math.max(0, (H[terfi] ? H[terfi].xp : 0) - ben.xp + 1)) + ' XP daha yeterli.';
    else cumle = 'Terfi bölgesine ' + fmt(Math.max(1, (H[terfi - 1] ? H[terfi - 1].xp : ben.xp) - ben.xp + 1)) + ' XP uzaktasın.';
    const odul = ben.xp >= 100 ? odulBayt(konum(ben.sira, n)) : 0;
    const satirlar = H.map(function (x) { return satir({ sira: x.sira, ad: x.ad, ben: x.ben, avatar: x.avatar, unvanMetni: unvanM(x.seviye), sag: fmt(x.xp), sagYazi: fmt(x.xp) + ' LP', etiket: '', bolge: x.sira <= terfi ? 'terfi' : (dusme && x.sira > n - dusme ? 'dusme' : '') }); }).join('');
    const odulTablo = [['1', '300 B'], ['2–3', '200 B'], ['4–7', '150 B'], ['8–12', '100 B'], ['13–20', '50 B'], ['21–25', '20 B'], ['26–30', '0 B']].map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td class="sag">' + r[1] + '</td></tr>'; }).join('');
    return { govde: '<div class="ld-duzen"><div class="ld-sol">' + (sev < 3 ? '<p class="pz-not">' + ikon('kilit', 16) + 'Lig girişi Sev. 3\'te açılır; şu an Sev. ' + sev + '. Tabloyu inceleyebilirsin, puanın ilk XP\'nden sonra işlenir.</p>' : '') + (n < 30 ? '<p class="pz-not pz-not-ince">' + ikon('bilgi', 16) + 'Kovanda şimdilik ' + n + ' oyuncu var. Yeni oyuncular katıldıkça dolar; ödüller sıranın oranına göre hesaplanır.</p>' : '') +
      '<div role="table" class="ld-tablo" aria-label="Haftalık Lig sıralaması, Bronz kova">' + satirlar + '</div>' + mini() + '</div><aside class="ld-sag-panel">' +
      '<div class="kart ld-ozet"><div class="sira"><span class="chip chip-buyuk ld-bronz">Bronz Lig</span>' + chipHtml('Kova ' + n + '/30', 'gri', 'kullanicilar') + '</div><p class="ld-sira">Sıran: <b class="sayi">' + ben.sira + '.</b> · LP <b class="sayi">' + fmt(ben.xp) + '</b></p><p>' + esc(cumle) + '</p><p class="mini soluk">' + (n < 30 ? 'Kova küçük: sıran ' + ben.sira + '/' + n + ', 30 kişilik tabloya oranlanınca ' + konum(ben.sira, n) + '. konum. ' : 'Sıran ' + ben.sira + '/30. ') + 'Bu haftaki ödülün: <b>' + odul + ' B</b> (tablo 0–300 B) · terfi ilk ' + terfi + ' · düşme son ' + hr[1] + ' (Bronz\'da düşme yok, kademen korunur).</p></div>' +
      '<div class="kart ld-kapanis" role="timer" aria-live="off">' + ikon('saat', 20) + '<span>Lig kapanışı: Pazar 21:00 · <b id="ld-sayac">' + esc(S.kalanMetin(kapanis)) + '</b></span></div>' +
      '<details class="kart ld-odul"><summary>Ödül ve kurallar</summary><div class="tablo-kap"><table class="tablo"><thead><tr><th scope="col">Konum</th><th scope="col" class="sag">Bayt</th></tr></thead><tbody>' + odulTablo + '</tbody></table></div><p class="mini soluk">LP = haftalık XP (Demo: tek oturumda toplam XP). Asgari LP 100. Bayt cezası yok. Pazar 21:00\'de puanlar donar, 21:05\'te sonuçlar gelir. Terfi ilk 7, düşme son 5 (Bronz\'da yok); küçük kovada oranlanır.</p></details></aside></div>' };
  }
  function kalicilikGovde() {
    const K = ((veri().liderlik && veri().liderlik.kalicilik) || []).map(function (x) { return Object.assign({}, x); });
    K.push({ ad: state.ad || 'sen', seviye: seviyeBilgi().seviye, altinDurak: 0, avatar: state.avatar, ben: true });
    K.sort(function (a, b) { return (b.altinDurak - a.altinDurak) || (a.ben ? 1 : -1); }); K.forEach(function (x, i) { x.sira = i + 1; });
    return { govde: '<div class="ld-sol"><p class="pz-not pz-not-ince">' + ikon('bilgi', 16) + 'Kalıcılık Ligi Bayt vermez; altın durak sayısına göre sıralanır (eşitlikte altın-gün toplamı). Henüz altın durağın yok. Günlük Tekrar\'da bir durağı 3 kez üst üste doğru bilirsen altın olur.</p><div role="table" class="ld-tablo" aria-label="Kalıcılık Ligi">' + K.map(function (x) { return satir({ sira: x.sira, ad: x.ad, ben: x.ben, avatar: x.avatar, unvanMetni: unvanM(x.seviye), sag: x.altinDurak, sagYazi: x.altinDurak + ' altın durak', etiket: ikon('yildiz', 16) }); }).join('') + '</div>' + mini() + '</div>' };
  }
  function hizliGovde() {
    const H0 = (veri().liderlik && veri().liderlik.hizliOtopark) || [], H = LD.dilim === 'tum' ? H0 : LD.dilim === 'ay' ? H0.slice(0, 3) : H0.slice(-2);
    const dilimler = [['tum', 'Tüm zamanlar'], ['ay', 'Bu ay'], ['yeni', 'Yeni oyuncular']];
    const o = isletmeKaydi('otopark');
    return { govde: '<div class="ld-sol"><div class="sekmeler" role="group" aria-label="Dilim">' + dilimler.map(function (d) { return '<button type="button" class="sekme' + (LD.dilim === d[0] ? ' aktif' : '') + '" aria-pressed="' + (LD.dilim === d[0]) + '" data-action="ld-dilim" data-dilim="' + d[0] + '">' + d[1] + '</button>'; }).join('') + '</div>' +
      (H.length ? '<div role="table" class="ld-tablo" aria-label="En Hızlı Otopark">' + H.map(function (x, i) { const gecti = H0.indexOf(x) < 4; return satir({ sira: i + 1, ad: x.ad, avatar: ((oyuncuBul(x.ad) || {}).avatar), unvanMetni: unvanM((oyuncuBul(x.ad) || {}).seviye || 5), sag: x.sure, sagYazi: x.sure, etiket: chipHtml(gecti ? 'Savunma geçti' : 'Savunma bekliyor', gecti ? 'nane' : 'gri') }); }).join('') + '</div>' : bosHtml({ ikon: 'kupa', baslik: 'Henüz süre yok', metin: 'Otopark\'ı açan ilk oyuncular burada görünür.' })) +
      '<p class="mini soluk">Süre = Gereksinim Netleştirme sonrası aktif kodlama süresi; yalnızca Savunma\'yı geçen kayıt "Savunma geçti" alır. ' + (o.durum === 'yok' || o.durum === 'satilik' ? 'Sen: henüz süre yok; Otopark\'ı açınca burada görünürsün.' : '') + '</p>' + mini() + '</div>' };
  }
  function kazancGovde() {
    const K = (veri().liderlik && veri().liderlik.kazancliIsletme) || [], l12 = LD.segment === 'l12';
    return { govde: '<div class="ld-sol"><div class="sekmeler" role="group" aria-label="Segment"><button type="button" class="sekme' + (l12 ? ' aktif' : '') + '" aria-pressed="' + l12 + '" data-action="ld-segment" data-segment="l12">Otopark L1–L2</button><button type="button" class="sekme' + (!l12 ? ' aktif' : '') + '" aria-pressed="' + (!l12) + '" data-action="ld-segment" data-segment="l35">Otopark L3–L5</button></div>' +
      (l12 && K.length ? '<div role="table" class="ld-tablo" aria-label="En Kazançlı İşletme, son 7 gün">' + K.map(function (x, i) { return satir({ sira: i + 1, ad: x.ad.split("'")[0], avatar: (oyuncuBul(x.ad.split("'")[0]) || {}).avatar, unvanMetni: x.ad, sag: fmt(x.gelir) + ' B', sagYazi: fmt(x.gelir) + ' Bayt' }); }).join('') + '</div>' : bosHtml({ ikon: 'bina', baslik: 'Bu segmentte henüz Açık işletme yok', metin: 'L3–L5 işletmeler ayrı tablodur; L5 ile L1 karşılaştırılmaz. Yükseltme fiyatları: L3 1.200 B, L4 2.500 B, L5 5.000 B.' })) +
      '<p class="mini soluk">Son 7 günde toplanan Bayt; yalnız Açık işletmeler girer, sahibi "Panoda göster"i kapatabilir. Bayt ödülü yok, görünürlük vardır.</p>' + mini() + '</div>' };
  }
  function arkadasGovde() {
    const F = (veri().sohbet && veri().sohbet.arkadaslar) || [], H = haftalik(), liste = F.map(function (f) { const h = H.filter(function (x) { return x.ad === f.ad; })[0]; return { ad: f.ad, seviye: f.seviye, xp: h ? h.xp : 0, avatar: f.avatar }; });
    const ben = H.filter(function (x) { return x.ben; })[0]; liste.push({ ad: ben.ad, seviye: ben.seviye, xp: ben.xp, avatar: ben.avatar, ben: true });
    liste.sort(function (a, b) { return b.xp - a.xp; }); liste.forEach(function (x, i) { x.sira = i + 1; });
    return { govde: '<div class="ld-sol"><p class="pz-not pz-not-ince">' + ikon('bilgi', 16) + 'Arkadaş Ligi: en çok 30 arkadaşın haftalık XP\'si. Bayt yok, yalnız dostça rekabet.</p><div role="table" class="ld-tablo" aria-label="Arkadaşlar haftalık XP">' + liste.map(function (x) { return satir({ sira: x.sira, ad: x.ad, ben: x.ben, avatar: x.avatar, unvanMetni: unvanM(x.seviye), sag: fmt(x.xp), sagYazi: fmt(x.xp) + ' LP' }); }).join('') + '</div>' + mini() + '</div>' };
  }
  function soruGovde() {
    const st = (state.ekran.liderlik = state.ekran.liderlik || {}), bugun = S.gunAnahtari(), hp = st.hp && st.hp.gun === bugun ? st.hp : null;
    if (!hp && !LD.hpBas) LD.hpBas = Date.now();
    const tablo = [{ ad: 'mert_yaz', ms: 1840 }, { ad: 'elif_bit', ms: 2150 }, { ad: 'ayse_kod', ms: 2610 }].concat(hp && hp.dogru ? [{ ad: state.ad || 'sen', ms: hp.ms, ben: true }] : []).sort(function (a, b) { return a.ms - b.ms; });
    const form = hp ? '<div class="kart ' + (hp.dogru ? 'kart-nane' : 'kart-mercan') + '" role="status"><b>' + (hp.dogru ? 'Doğru! ' + (hp.ms / 1000).toFixed(1).replace('.', ',') + ' sn' : 'Yanlış.') + '</b><p>' + esc(HP.aciklama) + '</p><p class="mini soluk">Meydan Sorusu günde bir kez çözülür. Yarın 04:00\'ten sonra yenisi gelir.</p></div>'
      : '<div class="kart" id="ld-soru"><h2 class="kart-baslik">' + ikon('yildirim', 20) + 'Hızlı Parmak</h2><p class="ld-soru-metin"><code>' + esc(HP.soru) + '</code></p><div class="ld-secenekler">' + HP.secenekler.map(function (s, i) { return '<button type="button" class="btn" data-action="ld-cevap" data-i="' + i + '">' + esc(s) + '</button>'; }).join('') + '</div><p class="mini soluk">Süre tutulur; yalnız doğru cevaplar tabloya girer. Ödül yok, sıralama görünürlüğü var.</p></div>';
    return { govde: '<div class="ld-sol">' + form + '<div role="table" class="ld-tablo" aria-label="Hızlı Parmak sıralaması">' + tablo.map(function (x, i) { return satir({ sira: i + 1, ad: x.ad, ben: x.ben, avatar: (oyuncuBul(x.ad) || {}).avatar || (x.ben ? state.avatar : null), unvanMetni: 'Meydan Sorusu', sag: (x.ms / 1000).toFixed(1).replace('.', ',') + ' sn', sagYazi: (x.ms / 1000).toFixed(1) + ' saniye' }); }).join('') + '</div></div>' };
  }
  function liderlikCiz(root) {
    const g = { haftalik: haftalikGovde, kalicilik: kalicilikGovde, hizli: hizliGovde, kazanc: kazancGovde, arkadas: arkadasGovde, soru: soruGovde }[LD.pano]();
    const kapanis = S.sonraki(0, 21);
    root.innerHTML = '<div class="sayfa sayfa-genis ld-sayfa"><div class="sayfa-baslik"><h1>Liderlik Panosu</h1></div><div class="sekmeler sekmeler-kaydir" role="tablist" aria-label="Panolar">' + PANOLAR.map(function (p) { return '<button type="button" role="tab" id="ld-pano-' + p[0] + '" class="sekme" aria-selected="' + (LD.pano === p[0]) + '" data-action="ld-pano" data-pano="' + p[0] + '">' + p[1] + '</button>'; }).join('') + '</div><div class="ld-govde" role="tabpanel">' + g.govde + '</div></div>';
    KK_UI.aralik(function () { const e = $('#ld-sayac'); if (e) e.textContent = S.kalanMetin(kapanis); }, 30000);
  }
  KK_UI.screen('liderlik', {
    ad: 'Liderlik Panosu', hud: true,
    async render(root, ctx) {
      root.classList.add('scr-sosyal');
      if (ctx.ilk) {
        LD.sec = null;
        root.innerHTML = '<div class="sayfa sayfa-genis ld-sayfa" aria-busy="true"><div class="sayfa-baslik"><h1>Liderlik Panosu</h1></div>' + yukleniyorHtml('Sıralama yükleniyor…') + '<div class="yigin">' + Array.apply(null, Array(8)).map(function () { return '<span class="iskelet" style="height:56px"></span>'; }).join('') + '</div></div>';
        await bekle(260);
        if (KK_UI.current() !== 'liderlik') return;
      }
      try { liderlikCiz(root); } catch (e) { KK_UI.hataKaydet(e, 'liderlik'); root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Liderlik Panosu yüklenemedi. Puanın ve sıran güvende; birazdan tekrar dene.', { baslik: 'Pano açılamadı', tekrar: 'ld-yenile' }) + '</div>'; }
    },
    actions: {
      'ld-yenile': function () { refresh(); },
      'ld-pano': function (el) { LD.pano = el.getAttribute('data-pano'); LD.sec = null; refresh(); },
      'ld-dilim': function (el) { LD.dilim = el.getAttribute('data-dilim'); refresh(); },
      'ld-segment': function (el) { LD.segment = el.getAttribute('data-segment'); refresh(); },
      'ld-satir': function (el) { LD.sec = el.getAttribute('data-ad'); refresh(); const m = $('.ld-mini'); if (m) { try { m.scrollIntoView({ block: 'nearest' }); } catch (e) { /* kaydırma yok */ } } },
      'ld-mini-kapat': function () { LD.sec = null; refresh(); },
      'ld-profil': function (el) { const ad = el.getAttribute('data-ad'); go('profil', { parametre: { oyuncu: ad } }); },
      'ld-arkadas': function (el) { toast('@' + el.getAttribute('data-ad') + ' adlı oyuncuya istek gönderildi. Karşılıklı onay gerekir.', 'basari'); },
      'ld-vitrin': function () { go('vitrin'); },
      'ld-cevap': function (el) {
        const st = (state.ekran.liderlik = state.ekran.liderlik || {}), ms = LD.hpBas ? Date.now() - LD.hpBas : 2400;
        st.hp = { gun: S.gunAnahtari(), ms: Math.max(300, Math.round(ms)), dogru: Number(el.getAttribute('data-i')) === HP.dogru };
        save(); refresh();
      }
    },
    leave() { LD.hpBas = 0; },
    async selftest(root, ctx) {
      await ctx.bekleSecici('[data-action="ld-satir"]');
      if (!/Bronz/.test(ctx.metin('.ld-ozet'))) throw new Error('Lig özeti yok');
      await ctx.tikla('#ld-pano-kalicilik');
      if (!/altın durak/i.test(ctx.metin('.ld-govde'))) throw new Error('Kalıcılık Ligi çizilmedi');
      await ctx.tikla('#ld-pano-hizli'); await ctx.tikla('#ld-pano-kazanc'); await ctx.tikla('#ld-pano-arkadas');
      await ctx.tikla('#ld-pano-soru'); await ctx.tikla('[data-action="ld-cevap"][data-i="0"]');
      if (!(state.ekran.liderlik && state.ekran.liderlik.hp && state.ekran.liderlik.hp.dogru)) throw new Error('Meydan Sorusu cevabı kaydedilmedi');
      await ctx.tikla('#ld-pano-haftalik');
      await ctx.tikla('[data-action="ld-satir"]:not(.satir-ben)');
      await ctx.tikla('[data-action="ld-profil"]');
      if (ctx.gidilen() !== 'profil') throw new Error('Mini kart Profil\'e gitmedi');
    }
  });
})();
