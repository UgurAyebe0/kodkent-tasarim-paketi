/* ==== ui/90-galeri.js — #galeri geliştirici ekranı (demo seçicide YOK) ====
   Bileşenler, ikonlar, avatar varyantları, 10 portre, iso prop galerisi, toast/modal/award denemeleri ve kodEditor örneği.
   Sekmeler ayrı hash'lerdir: #galeri · #galeri-ikon · #galeri-avatar · #galeri-usta · #galeri-iso · #galeri-etkilesim. */

function galeriKaydet() {
  if (KK_UI.ekranlar.galeri) return;
  const SEKMELER = [['galeri', 'Bileşenler', 'liste'], ['galeri-ikon', 'İkonlar', 'parlak'], ['galeri-avatar', 'Avatarlar', 'kullanici'], ['galeri-usta', 'Ustalar', 'akademi'], ['galeri-iso', 'İzometrik', 'bina'], ['galeri-etkilesim', 'Etkileşim', 'yildirim']];
  const bolum = function (baslik, ic, ik) { return '<section class="panel"><div class="panel-baslik">' + (ik ? ikon(ik, 20) : '') + '<span>' + esc(baslik) + '</span></div>' + ic + '</section>'; };
  const wrap = function (ic) { return '<div class="sira">' + ic + '</div>'; };
  const sekmeBar = function (aktif) { return '<div class="sekmeler sekmeler-kaydir" role="tablist" aria-label="Galeri bölümleri">' + SEKMELER.map(function (s) { return '<button type="button" role="tab" class="sekme' + (s[0] === aktif ? ' aktif' : '') + '" aria-selected="' + (s[0] === aktif) + '" data-go="' + s[0] + '">' + ikon(s[2], 18) + esc(s[1]) + '</button>'; }).join('') + '</div>'; };

  /* ---- Bileşenler ---- */
  function bilesenler() {
    const RENK = [['--bg', 'Zemin'], ['--surface', 'Yüzey'], ['--surface-2', 'Yüzey 2'], ['--surface-3', 'Yüzey 3'], ['--accent', 'Turkuaz'], ['--cobalt', 'Kobalt'], ['--amber', 'Amber'], ['--coral', 'Mercan'], ['--mint', 'Nane'], ['--violet', 'Mor'], ['--code-bg', 'Kod zemini'], ['--line-2', 'Çizgi']];
    const test = function (d, ad, ek) { return testSatirHtml(Object.assign({ durum: d, ad: ad }, ek)); };
    return [
      bolum('Renk tokenları', '<div class="gal-izgara">' + RENK.map(function (r) { return '<div class="gal-renk"><i style="background:var(' + r[0] + ')"></i><b>' + r[1] + '</b><code>' + r[0] + '</code></div>'; }).join('') + '</div>', 'parlak'),
      bolum('Tipografi', '<div class="yigin-s"><h1>Fredoka başlık 40</h1><h2>İkinci düzey başlık</h2><h3>Üçüncü düzey başlık</h3><p>Nunito gövde metni: Değişken bir kutudur; <code class="kod-ic">int</code> kutunun üstündeki etiket.</p><p class="soluk kucuk">Soluk yardımcı metin (muted) ve <span class="mono">JetBrains Mono</span> kod yazısı.</p><div class="sayi" style="font-size:34px">1.234.567 <small class="soluk">XP</small></div></div>', 'kalem'),
      bolum('Düğmeler (tombul 3B)', '<div class="yigin"><div class="sira">' + ['btn-birincil|Birincil', 'btn-ikincil|İkincil', 'btn-altin|Altın', 'btn-basari|Başarı', 'btn-tehlike|Tehlike', 'btn-mor|Mor', 'btn-hayalet|Hayalet'].map(function (x) { const p = x.split('|'); return '<button type="button" class="btn ' + p[0] + '">' + p[1] + '</button>'; }).join('') + '</div>' +
        '<div class="sira"><button type="button" class="btn btn-birincil btn-kucuk">Küçük</button><button type="button" class="btn btn-birincil">Normal</button><button type="button" class="btn btn-birincil btn-buyuk">Büyük</button><button type="button" class="btn btn-altin">' + ikon('coin', 22) + 'Tapuyu Al (300 B)</button><button type="button" class="btn btn-basari btn-ikon" aria-label="Onayla">' + ikon('tik', 22) + '</button></div>' +
        '<div class="sira"><button type="button" class="btn btn-birincil" disabled>Devre dışı</button><button type="button" class="btn btn-birincil yukleniyor">Çalışıyor</button><button type="button" class="btn-baglanti">Bağlantı düğmesi</button></div></div>', 'oynat'),
      bolum('Sayaç, chip, rozet, durum', '<div class="yigin"><div class="sira">' + sayacHtml('bayt', 1250) + sayacHtml('cip', 40) + sayacHtml('xp', 340) + sayacHtml('alev', 7) + sayacHtml('bayt', 320, { kucuk: true }) + '</div><div class="sira">' + ['turkuaz|Turkuaz|kod', 'amber|Amber|coin', 'mercan|Mercan|uyari', 'nane|Nane|tik', 'mor|Mor|xp', 'kobalt|Kobalt|bilgi', 'gri|Gri|kilit'].map(function (x) { const p = x.split('|'); return chipHtml(p[1], p[0], p[2]); }).join('') + '</div>' +
        '<div class="sira"><span class="rozet">' + ikon('kupa', 24) + '</span><span class="rozet rozet-nisan">' + ikon('goz', 24) + '</span><span class="rozet rozet-kilitli">' + ikon('kilit', 24) + '</span><span class="rozet">' + ikon('sohbet', 24) + '<span class="rozet-sayi">3</span></span><span class="rozet rozet-buyuk rozet-nisan">' + ikon('madalya', 34) + '</span></div>' +
        '<div class="sira">' + ['satilik', 'kapali', 'deneme', 'acik', 'kararmis'].map(isletmeDurumHtml).join('') + '</div><div class="sira">' + ['siradan|Sıradan', 'sik|Şık', 'nadir|Nadir', 'premium|Premium', 'nisan|Nişan'].map(function (x) { const p = x.split('|'); return '<span class="nad-' + p[0] + ' nad-etiket">' + p[1] + '</span>'; }).join('') + '</div></div>', 'madalya'),
      bolum('Kart ve panel', '<div class="izgara"><div class="kart"><h4 class="kart-baslik">' + ikon('kitap', 20) + 'Kart</h4>2px kenarlı, iç parlaklıklı yuvarlak kart.</div><div class="kart kart-turkuaz"><h4 class="kart-baslik">Turkuaz</h4>Vurgulu kart.</div><div class="kart kart-amber"><h4 class="kart-baslik">Amber</h4>Bayt ve ödül.</div><div class="kart kart-nane"><h4 class="kart-baslik">Nane</h4>Başarı.</div><div class="kart kart-mor"><h4 class="kart-baslik">Mor</h4>XP ve Kurul.</div>' +
        '<button type="button" class="kart kart-tikla"><h4 class="kart-baslik">' + ikon('harita', 20) + 'Tıklanır kart</h4>Üzerine gel ve bas.</button><div class="kart kart-kilitli"><h4 class="kart-baslik">' + ikon('kilit', 20) + 'Kilitli</h4>Sev. 6 gerekir; şu an Sev. 3.</div><div class="kart nad-nadir"><span class="nad-etiket">Nadir</span><h4 class="kart-baslik">Çarşı Tentesi</h4>130 B</div></div>', 'liste'),
      bolum('İlerleme çubuğu ve halka', '<div class="yigin"><div class="yigin-s">' + cubukHtml(62, { tur: 'xp' }) + cubukHtml(40, { tur: 'bayt' }) + cubukHtml(78, { tur: 'nane', kalin: true }) + cubukHtml(25, { tur: 'mercan', ince: true }) + cubukHtml(55, { tur: 'cip' }) + cubukHtml(90, {}) + '</div><div class="sira">' + halkaHtml(85, { tur: 'mor', alt: 'PUAN' }) + halkaHtml(62, { boyut: 80, tur: 'nane', metin: '5/8', alt: 'DURAK' }) + halkaHtml(30, { boyut: 80, tur: 'amber' }) + halkaHtml(12, { boyut: 64, tur: 'mercan' }) + '</div></div>', 'hedef'),
      bolum('Sekme ve liste', '<div class="yigin"><div class="sekmeler" role="tablist"><button type="button" role="tab" class="sekme aktif" aria-selected="true">Haftalık Lig</button><button type="button" role="tab" class="sekme" aria-selected="false">Kalıcılık</button><button type="button" role="tab" class="sekme" aria-selected="false">En Hızlı Otopark ' + chipHtml('yakında', 'gri') + '</button></div><div class="liste">' +
        [['s1', 1, 'ayse_kod', 'Mühendis · Sev. 9', 1420], ['s2', 2, 'mert_yaz', 'Kalfa · Sev. 8', 1310], ['s3', 3, 'zeynep.cs', 'Kalfa · Sev. 8', 1195]].map(function (r) { return '<div class="satir satir-tikla"><span class="sira-no ' + r[0] + '">' + r[1] + '</span><span class="portre">' + avatarSvg(AVATAR_ORNEKLERI[r[1]].av, { boyut: 44, kadraj: 'bust' }) + '</span><span class="satir-ana"><span class="satir-baslik">' + r[2] + '</span><span class="satir-alt">' + r[3] + '</span></span><span class="satir-sag">' + sayacHtml('xp', r[4], { kucuk: true }) + '</span></div>'; }).join('') +
        '<div class="satir satir-ben"><span class="sira-no">9</span><span class="satir-ana"><span class="satir-baslik">Deniz (sen)</span><span class="satir-alt">Çırak · Sev. 3</span></span><span class="satir-sag">' + sayacHtml('xp', 340, { kucuk: true }) + '</span></div></div></div>', 'kupa'),
      bolum('Sohbet balonu ve diyalog', '<div class="yigin"><div class="diyalog"><div class="diyalog-portre"><span class="portre">' + ustaSvg('defne', { boyut: 72 }) + '</span><b>Usta Defne</b></div><div class="balon balon-usta balon-kuyruk"><div class="balon-ad">Usta Defne</div>Deniz, <code class="kod-ic">int yas = 17;</code> satırında üç şey var: kutu, etiket, içindeki şey.</div></div>' +
        '<div class="sohbet-satir"><span class="portre">' + avatarSvg(AVATAR_ORNEKLERI[1].av, { boyut: 44, kadraj: 'bust' }) + '</span>' + balonHtml('Çarşı Sınavı\'na hazırlanan var mı?', { ad: 'ayse_kod' }) + '</div><div class="sohbet-satir ben">' + balonHtml('Ben varım, Savunma\'dayım!', { tur: 'ben' }) + '</div>' + balonHtml('Güvenli mod açık: yalnızca hazır cümleler.', { tur: 'sistem' }) + '<div class="balon"><span class="yaziyor"><i></i><i></i><i></i></span></div></div>', 'sohbet'),
      bolum('Kod bloğu ve test satırları', '<div class="yigin">' + kodHtml(KK_CORE.DATA.otopark.referansKod, { baslik: 'Otopark.cs', vurgu: [7] }) + '<p class="kucuk">Satır içi: <code class="kod-ic">dakika &lt;= 360</code> · tür <code class="kod-ic">decimal</code></p><div class="test-ozet">' + ikon('test-gecti', 26) + '4/6 geçti' + cubukHtml(66, { tur: 'nane', ince: true }) + '</div><div class="liste">' +
        test('gecti', 'Açık test 1 · 30 dk', { girdi: 30, beklenen: 100, gercek: 100 }) + test('kaldi', 'Açık test 3 · 120 dk', { girdi: 120, beklenen: 80, gercek: 200 }) + test('hata', 'Derleme', { hata: 'CS1002: ; bekleniyor (satır 5)' }) + test('bekliyor', 'Gizli testler', { hata: 'Önce açık testleri geçmelisin.' }) + '</div></div>', 'kod'),
      bolum('Boş durum, yükleniyor, hata', '<div class="izgara">' + bosHtml({ ikon: 'kutu', baslik: 'Odan boş', metin: "Pazar'dan eşya alıp yerleştirebilirsin.", buton: { ad: "Pazar'a git", aksiyon: 'gal-bos' } }) + '<div class="kart">' + yukleniyorHtml('Kurul değerlendiriyor…') + '</div>' + hataHtml('Bağlantı kurulamadı. Biraz sonra tekrar dene.', { tekrar: 'gal-bos' }) + '</div>', 'bilgi'),
      bolum('Form kontrolleri', '<div class="izgara"><div class="alan"><label class="etiket" for="gal-ad">Takma ad</label><input id="gal-ad" class="girdi" placeholder="3–16 karakter" value="Deniz"><span class="ipucu-yazi">Harf, rakam ve alt çizgi.</span></div><div class="alan"><label class="etiket" for="gal-tel">Telefon</label><div class="girdi-grup"><span class="girdi-onek">+90</span><input id="gal-tel" class="girdi" inputmode="tel" placeholder="5XX XXX XX XX"></div></div>' +
        '<div class="alan"><label class="etiket" for="gal-sec">Dil</label><select id="gal-sec" class="girdi"><option>C#</option><option>Python (yakında)</option></select></div><div class="alan"><label class="etiket" for="gal-hata">Hatalı alan</label><input id="gal-hata" class="girdi girdi-hata" value="x"><span class="hata-yazi">En az 3 karakter olmalı.</span></div><div class="alan"><label class="etiket" for="gal-ta">Cevabın</label><textarea id="gal-ta" class="girdi" placeholder="Cevabını buraya yaz"></textarea></div>' +
        '<div class="yigin-s"><label class="onay"><input type="checkbox" checked><span class="onay-kutu"></span><span>KVKK aydınlatma metnini okudum</span></label><label class="anahtar"><input type="checkbox" checked><span class="anahtar-iz"></span><span>Derin değerlendirme</span></label><label class="secim-kart"><input type="radio" name="gal-r" checked>' + ikon('kod', 22) + '<b>C#</b> ' + chipHtml('açık', 'nane') + '</label><div class="otp" role="group" aria-label="Doğrulama kodu">' + '123456'.split('').map(function (c, i) { return '<input class="otp-kutu" inputmode="numeric" maxlength="1" value="' + c + '" aria-label="Hane ' + (i + 1) + '">'; }).join('') + '</div></div></div>', 'gonder'),
      bolum('Tablo', '<div class="tablo-kap"><table class="tablo"><thead><tr><th>Dakika</th><th class="sag">Beklenen (TL)</th><th>Tür</th></tr></thead><tbody>' + KK_CORE.DATA.otopark.publicTestler.map(function (t) { return '<tr><td>' + fmt(t.dakika) + '</td><td class="sag">' + fmt(t.beklenen) + '</td><td>Açık</td></tr>'; }).join('') + '</tbody></table></div>', 'liste'),
      bolum('İpucu merdiveni', '<div class="ipucu-merdiven">' + [['Pusula', 'pusula', 'gorundu', 'Hangi dilimdesin? Üç dilim var.'], ['Fener', 'fener', 'acik', 'Başlayan saati nasıl bulursun?'], ['Taslak', 'kalem', 'kilitli', 'Kod iskeletini gösterir.'], ['Örnek', 'kitap', 'kilitli', 'Çözümün yapısını açar.']].map(function (x, i) { return '<div class="ipucu-basamak ' + x[2] + '" style="--adim:' + i + '"><span class="ipucu-ik">' + ikon(x[1], 24) + '</span><div><div class="ipucu-ad">' + x[0] + '</div><div class="ipucu-aciklama">' + x[3] + '</div></div>' + (x[2] === 'acik' ? '<button type="button" class="btn btn-altin btn-kucuk">Aç</button>' : x[2] === 'kilitli' ? ikon('kilit', 20) : chipHtml('görüldü', 'nane')) + (x[2] === 'gorundu' ? '<div class="ipucu-icerik">Üç dilim: 2 saatten az, 2–6 saat ve 6 saatten fazla.</div>' : '') + '</div>'; }).join('') + '</div>', 'fener'),
      bolum('Kurul kartı: mühür ve puan', '<div class="puan-kart parli"><div class="puan-kart-etiket">Kurul Kartı</div><div class="puan-kart-ust" style="margin-top:10px">' + halkaHtml(92, { boyut: 108, tur: 'mor', alt: 'PUAN' }) + '<div class="yigin-s" style="flex:1 1 220px"><div>' + chipHtml('+36 XP · parlak (85+ ×1,2)', 'amber', 'xp') + '</div><p class="soluk kucuk" style="margin:0">Deniz, kutu ve etiket ayrımını çok iyi yakalamışsın.</p></div><span class="muhur muhur-bas">' + ikon('muhur', 34) + 'Mühür</span></div><div style="margin-top:14px">' +
        [['Doğruluk', 46, 50, '#nane', 'Kutu, etiket ve değer doğru eşleşti.'], ['Tamlık', 26, 30, '#xp', 'Tür kavramına da değinildi.'], ['Açıklık', 20, 20, '#bayt', 'Cümleler net.']].map(function (k) { return '<div class="kriter"><span class="kriter-ad">' + k[0] + '</span><span class="kriter-puan">' + k[1] + ' / ' + k[2] + '</span>' + cubukHtml(100 * k[1] / k[2], { tur: k[3].slice(1), ince: true }) + '<span class="kriter-not">' + k[4] + '</span></div>'; }).join('') + '</div></div>', 'muhur')
    ].join('');
  }

  /* ---- İkonlar (sprite'tan okunur) ---- */
  function ikonlar() {
    const adlar = $$('symbol[id^="i-"]').map(function (s) { return s.id.slice(2); });
    return bolum(adlar.length + ' ikon (sprite)', '<div class="gal-izgara gal-ikonlar">' + adlar.map(function (a) { return '<div class="gal-ikon" title="ikon(\'' + a + '\')">' + ikon(a, 28) + '<code>' + a + '</code></div>'; }).join('') + '</div>', 'parlak') +
      bolum('Boyutlar ve renk', '<div class="sira">' + [16, 20, 24, 32, 48].map(function (b) { return ikon('coin', b); }).join('') + [16, 24, 32, 48].map(function (b) { return ikon('chip', b); }).join('') + [16, 24, 32, 48].map(function (b) { return ikon('xp', b); }).join('') + '<span style="color:var(--coral)">' + ikon('kalp', 32) + '</span><span style="color:var(--mint)">' + ikon('kalkan', 32) + '</span><span style="color:var(--amber)">' + ikon('kupa', 32) + '</span><span style="color:var(--cobalt)">' + ikon('harita', 32) + '</span></div>', 'goz');
  }

  /* ---- Avatarlar ---- */
  function avatarlar() {
    const S = AVATAR_SECENEK, kart = function (svg, alt) { return '<div class="av-kart"><div class="av-sahne">' + svg + '</div><span class="kucuk soluk">' + esc(alt) + '</span></div>'; };
    const taban = { ten: 2, sacStil: 0, sacRenk: 1, kiyafet: 0, aksesuar: [] };
    return bolum('6 örnek avatar (avatarSvg)', '<div class="sira" style="align-items:flex-start;gap:16px">' + AVATAR_ORNEKLERI.map(function (a) { return '<div class="av-kart">' + '<div class="av-sahne">' + avatarSvg(a.av, { boyut: 150 }) + '</div><b>' + a.ad + '</b><span class="kucuk soluk" style="max-width:150px">' + esc(avatarTarif(a.av)) + '</span></div>'; }).join('') + '</div>', 'kullanici') +
      bolum('Ten (6) × saç stili (8)', '<div class="sira" style="gap:8px">' + S.sacStil.map(function (s, i) { return kart(avatarSvg(Object.assign({}, taban, { ten: i % 6, sacStil: i, sacRenk: (i * 2) % 6 }), { boyut: 100, kadraj: 'bust' }), s.ad); }).join('') + '</div><div class="sira" style="margin-top:12px;gap:8px">' + S.ten.map(function (t, i) { return kart(avatarSvg(Object.assign({}, taban, { ten: i, sacStil: 3 }), { boyut: 72, kadraj: 'yuz' }), t.ad); }).join('') + S.sacRenk.map(function (t, i) { return kart(avatarSvg(Object.assign({}, taban, { sacRenk: i, sacStil: 2 }), { boyut: 72, kadraj: 'yuz' }), t.ad); }).join('') + '</div>', 'kalem') +
      bolum('Kıyafet (6)', '<div class="sira" style="gap:8px">' + S.kiyafet.map(function (k, i) { return kart(avatarSvg(Object.assign({}, taban, { kiyafet: i, sacStil: i + 1 }), { boyut: 130 }), k.ad); }).join('') + '</div>', 'kullanici') +
      bolum('Aksesuar (9)', '<div class="sira" style="gap:8px">' + S.aksesuar.map(function (a) { return kart(avatarSvg(Object.assign({}, taban, { aksesuar: [a.id], sacStil: 2 }), { boyut: 96, kadraj: 'bust' }), a.ad); }).join('') + '</div>', 'madalya') +
      bolum('Emote (10)', '<div class="sira" style="gap:8px">' + S.emote.map(function (e) { return kart(avatarSvg(Object.assign({}, taban, { sacStil: 3 }), { boyut: 120, emote: e.id }), e.ad); }).join('') + '</div>', 'kalp');
  }

  /* ---- Ustalar ---- */
  function ustalar() {
    const ids = Object.keys(USTA_BILGI);
    return bolum('10 portre (ustaSvg)', '<div class="sira" style="gap:18px;align-items:flex-start">' + ids.map(function (id) { return '<div class="av-kart"><span class="portre">' + ustaSvg(id, { boyut: 128 }) + '</span><b>' + esc(USTA_BILGI[id].ad) + '</b><span class="chip" style="background:' + USTA_BILGI[id].renk + ';color:#10162B;border-color:transparent">' + USTA_BILGI[id].renk + '</span></div>'; }).join('') + '</div>', 'akademi') +
      bolum('Küçük boyutlar (HUD, liste, balon)', '<div class="sira">' + ids.map(function (id) { return '<span class="portre">' + ustaSvg(id, { boyut: 48 }) + '</span>'; }).join('') + '</div><div class="sira" style="margin-top:12px">' + ids.map(function (id) { return '<span class="portre">' + ustaSvg(id, { boyut: 32 }) + '</span>'; }).join('') + '</div>', 'kullanicilar');
  }

  /* ---- İzometrik ---- */
  function izometrik() {
    const a = iso.alan(7, 6, { yukari: 130 }), og = a.orijin, K = iso.PROP_TURLERI;
    const ogeler = [['hali', 1, 1, { renk: '#B04E6B' }], ['yatak', 4, 0, {}], ['masa', 1, 4, {}], ['koltuk', 4, 3, { renk: '#FF7A66' }], ['lamba', 6, 1, {}], ['bitki', 0, 0, {}], ['tv', 3, 0, {}], ['kitaplik', 6, 4, {}], ['kasa', 3, 5, { dolu: true }], ['hediye', 5, 5, {}]].map(function (p) {
      const m = iso.PROP_META[p[0]];
      return { gx: p[1], gy: p[2], w: m.w, d: m.d, svg: iso.prop(p[0], p[1], p[2], Object.assign({ orijin: og }, p[3])) };
    });
    const yp = iso.xy(2.5, 2.5, 0, og), av = avatarSvg(AVATAR_ORNEKLERI[0].av, { boyut: 70, golge: true });
    const sahne = '<svg id="gal-sahne" viewBox="' + a.viewBox + '" role="img" aria-label="Örnek izometrik oda" data-action="gal-sahne-tikla" style="cursor:pointer">' + iso.zemin(7, 6, ['#2A3878', '#2F3F86'], { orijin: og }) + iso.sirala(ogeler) + '<g id="gal-yuruyen" transform="translate(' + (yp.x - 25) + ' ' + (yp.y - 64) + ')">' + av + '</g></svg>';
    return bolum('Örnek oda: zemin + sirala + avatar + walker (zemine dokun, avatar yürüsün)', '<div class="sahne" style="max-width:760px;margin:0 auto">' + sahne + '</div>', 'ev') +
      bolum(K.length + ' nesne (iso.prop / iso.propSvg)', '<div class="gal-izgara gal-proplar">' + K.map(function (t) { return '<div class="av-kart"><div class="av-sahne">' + iso.propSvg(t, { boyut: 150, etiket: t === 'tabela' ? 'BÜFE' : t === 'neon' ? 'AÇIK' : t === 'led-pano' ? 'YENİ İŞLETME: OTOPARK' : undefined, dolu: true }) + '</div><code>' + t + '</code></div>'; }).join('') + '</div>', 'kutu') +
      bolum('Durum varyantları', '<div class="sira" style="gap:12px">' + [['bariyer', {}, 'kapalı'], ['bariyer', { acik: true }, 'açık'], ['lamba', { acik: false }, 'söndü'], ['kapi', { acik: true }, 'kapı açık'], ['kasa', { dolu: true }, 'dolu'], ['araba', { renk: '#45D98D' }, 'yeşil'], ['agac', { renk: '#E8912D' }, 'sonbahar']].map(function (x) { return '<div class="av-kart"><div class="av-sahne">' + iso.propSvg(x[0], Object.assign({ boyut: 120 }, x[1])) + '</div><span class="kucuk soluk">' + x[0] + ' · ' + x[2] + '</span></div>'; }).join('') + '</div>', 'araba');
  }

  /* ---- Etkileşim ---- */
  const EDITOR_KOD = 'public static int UcretHesapla(int dakika)\n{\n    if (dakika <= 0) return 0;\n    int saat = (dakika + 59) / 60;  // başlayan saat\n    if (dakika < 120) return saat * 100;\n    return saat * 40;\n}';
  function etkilesim() {
    const d = function (a, ad, s) { return '<button type="button" class="btn ' + (s || 'btn-ikincil') + '" data-action="' + a + '">' + ad + '</button>'; };
    return bolum('Toast', wrap(d('gal-toast-bilgi', 'Bilgi') + d('gal-toast-basari', 'Başarı', 'btn-basari') + d('gal-toast-uyari', 'Uyarı', 'btn-altin') + d('gal-toast-hata', 'Hata', 'btn-tehlike')), 'zil') +
      bolum('Modal ve onay', wrap(d('gal-modal', 'Modal aç', 'btn-birincil') + d('gal-onayla', 'Onay iste', 'btn-mor') + d('gal-yetersiz', 'Yetersiz bakiye (harca)', 'btn-hayalet')) + '<p id="gal-onay-sonuc" class="kucuk soluk" role="status" style="margin-top:10px">Onay sonucu burada görünür.</p>', 'bilgi') +
      bolum('Ödül (award), harcama, seviye atlama, konfeti', wrap(d('gal-award', '+60 XP +40 B', 'btn-altin') + d('gal-award-cip', '+10 Çip', 'btn-birincil') + d('gal-seviye', 'Seviye atlat (+400 XP)', 'btn-mor') + d('gal-harca', '−50 B harca', 'btn-hayalet') + d('gal-konfeti', 'Konfeti', 'btn-basari')) + '<p class="kucuk soluk" style="margin-top:10px">HUD sayaçları canlanır, uçan etiket çıkar; seviye atlanırsa modal açılır (Seviye Hediyesi Bayt/Çip/XP içermez).</p>', 'hediye') +
      bolum('kodEditor (düzenlenebilir) ve salt okunur kod', '<div class="yigin"><div id="gal-editor"></div><div class="sira">' + d('gal-ed-vurgu', 'Satır 5\'i vurgula', 'btn-ikincil btn-kucuk') + d('gal-ed-yukle', 'Örnek çözümü yükle', 'btn-ikincil btn-kucuk') + d('gal-ed-oku', 'Kodu oku (toast)', 'btn-ikincil btn-kucuk') + '</div><div id="gal-editor-salt"></div></div>', 'kod') +
      bolum('Yapay zekâ modülü (yalnızca tıklamayla)', wrap(d('gal-ai', "Kurul'a sor", 'btn-mor') + d('gal-ai-durdur', 'Durdur', 'btn-hayalet') + '<span data-ai-rozet class="chip chip-gri">' + esc(aiDurumMetni()) + '</span>') + '<div id="gal-ai-sonuc" style="margin-top:12px"></div>', 'muhur');
  }
  const COZUM = 'public static int UcretHesapla(int dakika)\n{\n    if (dakika <= 0) return 0;\n    int saat = (dakika + 59) / 60;\n    if (dakika < 120) return saat * 100;\n    if (dakika <= 360) return saat * 40;\n    int gun = (dakika + 1439) / 1440;\n    return gun * 250;\n}';
  let editor = null;
  const actions = {
    'gal-bos': function () { toast('Boş durum düğmesine basıldı.', 'bilgi'); },
    'gal-toast-bilgi': function () { toast('Bilgi: Günlük Tekrar seni bekliyor.', 'bilgi'); }, 'gal-toast-basari': function () { toast('Kaydedildi. Ruhsat 3/3!', 'basari'); },
    'gal-toast-uyari': function () { toast('Sev. 3 ve Ruhsat 3/3 gerekir; şu an Sev. 2, Ruhsat 2/3.', 'uyari'); }, 'gal-toast-hata': function () { toast('Kurul şu an ulaşılamıyor, çevrimdışı demo kullanıldı.', 'hata'); },
    'gal-modal': function () { modal({ baslik: 'Örnek modal', ikon: 'bilgi', html: '<p>Modal sayfa içidir: Esc ya da dış tıkla kapanır, odak içeride kalır.</p><p class="soluk kucuk">İkinci düğme modalı açık tutar.</p>', butonlar: [{ ad: 'Açık tut', kapat: false, aksiyon: function () { toast('Modal açık kaldı.', 'bilgi'); } }, { ad: 'Tamam', birincil: true }] }); },
    'gal-onayla': function () { onayla('Bu işlem geri alınamaz. Devam edilsin mi?', 'Evet, devam', 'Vazgeç').then(function (ok) { const p = $('#gal-onay-sonuc'); if (p) p.textContent = 'Onay sonucu: ' + (ok ? 'EVET' : 'HAYIR'); }); },
    'gal-yetersiz': function () { harca({ bayt: 999999 }); },
    'gal-award': function (el) { award({ xp: 60, bayt: 40, etiket: 'Meydan Saati', kaynak: el }); }, 'gal-award-cip': function (el) { award({ cip: 10, etiket: 'Semt Sınavı', kaynak: el }); },
    'gal-seviye': function (el) { award({ xp: 400, etiket: 'Kurul geri bildirimi', kaynak: el }); }, 'gal-harca': function (el) { harca({ bayt: 50, etiket: 'Çırak Şapkası', kaynak: el }); }, 'gal-konfeti': function () { konfeti(); },
    'gal-ed-vurgu': function () { if (editor) editor.vurgula([5], { kaydir: true }); }, 'gal-ed-yukle': function () { if (editor) editor.koy(COZUM); },
    'gal-ed-oku': function () { if (editor) toast('Satır sayısı: ' + editor.getir().split('\n').length, 'bilgi'); },
    'gal-sahne-tikla': function (el, ev) {
      const svg = $('#gal-sahne'), g = $('#gal-yuruyen'); if (!svg || !g) return;
      const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const m = svg.getScreenCTM(); if (!m) return;
      const p = pt.matrixTransform(m.inverse()), og = iso.alan(7, 6, { yukari: 130 }).orijin, h = iso.hucre(p.x, p.y, og);
      if (h.gx < 0 || h.gy < 0 || h.gx > 6 || h.gy > 5) { toast('Zemin dışı.', 'bilgi'); return; }
      const hedef = iso.xy(h.gx + 0.5, h.gy + 0.5, 0, og), tr = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(g.getAttribute('transform')) || [0, 0, 0];
      walker(g, [{ x: Number(tr[1]), y: Number(tr[2]) }, { x: hedef.x - 25, y: hedef.y - 64 }], 600);
    },
    'gal-ai': async function () {
      const kok = $('#gal-ai-sonuc'); if (!kok) return; const ac = ai.yeniIptal(), D = KK_CORE.DATA, s = D.dersler[0].sorular[0];
      kok.innerHTML = yukleniyorHtml('Kurul değerlendiriyor…');
      const r = await aiPuanla({ usta: D.ustalar.defne, ders: D.dersler[0], soruTipi: s.tip, soru: s.metin, rubrik: s.rubrik, cevap: 'Kutunun adı yas, etiketi int, içindeki değer 17. Değişken değer saklayan adlı bir kutudur.', ornekIyiCevap: s.ornekIyiCevap, anahtarlar: s.anahtarlar, signal: ac.signal });
      if (!$('#gal-ai-sonuc')) return;
      if (!r) { kok.innerHTML = '<p class="soluk">Durduruldu.</p>'; return; }
      kok.innerHTML = '<div class="puan-kart"><div class="puan-kart-ust">' + halkaHtml(r.puan, { tur: 'mor', alt: 'PUAN', boyut: 92 }) + '<div class="yigin-s" style="flex:1 1 220px">' + chipHtml(r.kaynak === 'claude' ? 'Claude' : 'Çevrimdışı demo', r.kaynak === 'claude' ? 'mor' : 'amber', 'muhur') + '<p style="margin:0">' + esc(r.geri_bildirim) + '</p>' + (r.hataKodu ? '<p class="mini soluk" style="margin:0">' + esc(r.hataMesaji) + '</p>' : '') + '</div></div></div>';
    },
    'gal-ai-durdur': function () { ai.durdur(); }
  };
  const govdeler = { 'galeri': bilesenler, 'galeri-ikon': ikonlar, 'galeri-avatar': avatarlar, 'galeri-usta': ustalar, 'galeri-iso': izometrik, 'galeri-etkilesim': etkilesim };
  SEKMELER.forEach(function (s) {
    KK_UI.screen(s[0], {
      ad: 'Galeri · ' + s[1], hud: true, actions: actions,
      render: function (root) {
        root.innerHTML = '<div class="sayfa sayfa-genis"><div class="sayfa-baslik"><h1>Bileşen Galerisi</h1>' + chipHtml('geliştirici ekranı', 'gri', 'kod') + '</div><p class="soluk" style="margin:0">Tasarım sistemi, ikonlar, avatar/Usta çizimleri ve etkileşim denemeleri. Demo seçicide yoktur; adres: <code class="kod-ic">#' + s[0] + '</code></p>' + sekmeBar(s[0]) + govdeler[s[0]]() + '</div>';
        if (s[0] === 'galeri-etkilesim') {
          editor = kodEditor('#gal-editor', { kod: EDITOR_KOD, vurgu: [4], yukseklik: '240px' });
          kodEditor('#gal-editor-salt', { kod: COZUM, salt: true, yukseklik: '200px', etiket: 'Salt okunur çözüm' });
        }
      },
      selftest: async function (root, ctx) { if (!root.querySelector('.panel')) throw new Error('galeri bölümü çizilmedi'); }
    });
  });
}
galeriKaydet();
