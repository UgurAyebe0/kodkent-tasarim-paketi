/* ==== core/40-data-genel.js — işletmeler, Pazar, liderlik, Günlük Tekrar, sohbet, rozetler, metinler, Seviye Hediyeleri (P4). ====
   Kaynak: KANON §4–§5, §12.2 (v2 yaş kapısı), B2 §3, §7.1, §9, B3 §13, B5 §2.1, B6 §14, B8 ekran metinleri. Saf veri; DOM yok. ==== */

/* ---------- İşletmeler (KANON §5; 20 işletme, 77 seviye). gelirSaat = L1 B/gün ÷ 24 (B2 §7.1). MVP'de açık: #1 (L1–L2), #2, #4. ---------- */
const D_I = function (id, ad, semt, tier, seviye, fiyat, gunluk, gelirSaat, seviyeSayisi, konu, musteri, durum) {
  return { id: id, ad: ad, semt: semt, tier: tier, seviye: seviye, fiyat: fiyat, gunlukGelir: gunluk, gelirSaat: gelirSaat, seviyeSayisi: seviyeSayisi, konu: konu, musteri: musteri, durum: durum };
};
const D_isletmeler = [
  D_I('otopark', 'Otopark', 'carsi', 1, 3, 300, 220, 9.2, 5, '`if/else if`, metot, başlayan saati yukarı yuvarlama', 'Hasan Abi', 'mvp'),
  D_I('bufe', 'Büfe', 'carsi', 1, 4, 600, 300, 12.5, 4, 'Aritmetik, `decimal`, para üstü ve döngüyle bozukluk', 'Büfeci Melek Abla', 'mvp'),
  D_I('manav', 'Manav', 'carsi', 1, 5, 900, 380, 15.8, 4, 'Döngüler, `switch`, miktara göre indirim kademesi (otopark şemasının 2. yüzeyi)', 'Manav Nuriye Teyze', 'insaat'),
  D_I('kargo-deposu', 'Kargo Deposu', 'liman', 1, 6, 1500, 500, 20.8, 4, 'Diziler, `List<T>`, envanter sayımı', 'Kaptan Rıza', 'mvp'),
  D_I('balik-hali', 'Balık Hali', 'liman', 1, 8, 2200, 620, 25.8, 4, '`Dictionary` fiyat listesi, `string.Split`', 'Balıkçı Gülsüm', 'insaat'),
  D_I('oto-yikama', 'Oto Yıkama', 'liman', 1, 9, 2500, 680, 28.3, 3, '`List` + paket ve ek hizmet listesiyle kademeli fiyat (3. yüzey)', 'Yıkamacı Murat', 'insaat'),
  D_I('gumruk', 'Gümrük', 'liman', 1, 10, 3000, 750, 31.2, 4, 'Arama, sıralama, plaka doğrulama', 'Gümrük Memuru Faruk', 'insaat'),
  D_I('oto-tamirhane', 'Oto Tamirhane', 'atolyeler', 2, 12, 5000, 1000, 41.7, 4, 'Sınıf, kalıtım (araç hiyerarşisi)', 'Tamirci Sadık Abi', 'insaat'),
  D_I('mobilya-atolyesi', 'Mobilya Atölyesi', 'atolyeler', 2, 14, 6500, 1200, 50.0, 4, 'Nesne, kapsülleme, sipariş nesneleri', 'Marangoz Rüstem', 'insaat'),
  D_I('trafo-merkezi', 'Trafo Merkezi', 'atolyeler', 2, 16, 8000, 1400, 58.3, 4, '`interface`, `enum`, `exception`', 'Trafo Şefi Kenan', 'insaat'),
  D_I('kutuphane', 'Kütüphane', 'kampus', 2, 18, 10000, 1650, 68.8, 4, 'LINQ sorguları, gün bazlı gecikme cezası (4. yüzey)', 'Kütüphaneci Ayşe', 'insaat'),
  D_I('sinema', 'Sinema', 'kampus', 2, 20, 14000, 2150, 89.6, 4, 'Generics, `DateTime`, koltuk rezervasyonu', 'Sinemacı Leyla Hanım', 'insaat'),
  D_I('haber-ajansi', 'Haber Ajansı', 'kampus', 3, 23, 18000, 2600, 108.3, 3, 'delegate/event, JSON akışı', 'Editör Cengiz', 'insaat'),
  D_I('banka', 'Banka', 'finans-bolgesi', 3, 25, 25000, 3300, 137.5, 4, '`async/await`, `Task`, işlem kuyruğu', 'Müdür Feride Hanım', 'insaat'),
  D_I('sigorta', 'Sigorta', 'finans-bolgesi', 3, 28, 30000, 3750, 156.2, 4, 'Kural motoru + unit test', 'Eksper Tolga', 'insaat'),
  D_I('borsa-panosu', 'Borsa Panosu', 'finans-bolgesi', 3, 30, 35000, 4100, 170.8, 3, '`HttpClient`, veri akışı, dayanıklılık', 'Pano Sorumlusu Ece', 'insaat'),
  D_I('hastane-kayit', 'Hastane Kayıt', 'veri-vadisi', 3, 32, 50000, 5300, 220.8, 4, 'EF Core, migration', 'Kayıt Memuru Sevim', 'insaat'),
  D_I('otel', 'Otel', 'veri-vadisi', 4, 36, 65000, 6500, 270.8, 4, 'İlişkiler, repository, transaction', 'Otelci Nazan Hanım', 'insaat'),
  D_I('yemek-siparis-platformu', 'Yemek Sipariş Platformu', 'bulut-tepesi', 4, 40, 90000, 8200, 341.7, 4, 'Web API, REST, DTO', 'Kurye Şefi Bora', 'insaat'),
  D_I('sehir-uygulamasi', 'Şehir Uygulaması', 'bulut-tepesi', 4, 45, 120000, 10000, 416.7, 3, 'DI, auth, middleware; lonca sürümü (v2)', 'Belediye Memuru Nuran', 'insaat')
];
D_isletmeler[0].ruhsatGerekir = true; D_isletmeler[0].ruhsatSayisi = 3; D_isletmeler[0].tapuNotu = '300 B · Sev. 3 · Ruhsat 3/3';
/** Otopark yükseltmeleri (KANON §4: 500 / 1.200 / 2.500 / 5.000 B; XP 150 / 250 / 400 / 600). `kapiDers`: B4/B6'daki yükseltme kapısı dersi (bilinmiyorsa null). */
const D_otoparkYukseltmeler = [
  { seviye: 2, fiyat: 500, xp: 150, konu: 'Abone listesi (`List<string>`)', kapiSemt: 'liman', kapiDers: '2.1', gunlukGelir: 350 },
  { seviye: 3, fiyat: 1200, xp: 250, konu: 'İndirim ve bozuk kayıtta `ArgumentOutOfRangeException` (`enum`)', kapiSemt: 'atolyeler', kapiDers: '3.4', gunlukGelir: 560 },
  { seviye: 4, fiyat: 2500, xp: 400, konu: 'Gece tarifesi (`DateTime`)', kapiSemt: 'kampus', kapiDers: null, gunlukGelir: 900 },
  { seviye: 5, fiyat: 5000, xp: 600, konu: 'Kapasite ve kuyruk', kapiSemt: 'finans-bolgesi', kapiDers: null, gunlukGelir: 1440 }
];
D_isletmeler[0].yukseltmeler = D_otoparkYukseltmeler;

/* ---------- Pazar (B2 §9.1 fiyat bantları; onizleme.anahtar: iso.PROP_TURLERI ya da avatarSvg aksesuar/kiyafet-N/emote-AD) ---------- */
const D_M = function (id, ad, kategori, nadirlik, fiyat, para, tur, anahtar, aciklama, ek) {
  return Object.assign({ id: id, ad: ad, kategori: kategori, nadirlik: nadirlik, fiyat: fiyat, para: para, onizleme: { tur: tur, anahtar: anahtar }, aciklama: aciklama }, ek || {});
};
const D_magaza = [
  /* Sıradan — Bayt, gri, kalıcı raf */
  D_M('cirak-sapkasi', 'Çırak Şapkası', 'aksesuar', 'Sıradan', 30, 'bayt', 'avatar', 'sapka', 'Her çırağın ilk şapkası.'),
  D_M('bere', 'Bere', 'aksesuar', 'Sıradan', 45, 'bayt', 'avatar', 'bere', 'Soğuk akşamlar için yün bere.'),
  D_M('kasket', 'Kasket', 'aksesuar', 'Sıradan', 60, 'bayt', 'avatar', 'kasket', 'Hasan Abi tarzı kasket.'),
  D_M('kot-tisort', 'Tişört ve Kot', 'kiyafet', 'Sıradan', 80, 'bayt', 'avatar', 'kiyafet-0', 'Günlük, rahat set.'),
  D_M('mor-kapuson', 'Mor Kapüşon', 'kiyafet', 'Sıradan', 110, 'bayt', 'avatar', 'kiyafet-2', 'Gece kodlayanların seçimi.'),
  D_M('omuz-silk', 'Omuz Silk', 'emote', 'Sıradan', 60, 'bayt', 'avatar', 'emote-omuz', '"Bilmiyorum ama deneyeceğim."'),
  D_M('puf', 'Puf', 'esya', 'Sıradan', 50, 'bayt', 'prop', 'koltuk', 'Odanın en rahat köşesi.'),
  D_M('hali', 'Halı', 'esya', 'Sıradan', 70, 'bayt', 'prop', 'hali', 'Zemini ısıtır.'),
  D_M('masa-lambasi', 'Masa Lambası', 'esya', 'Sıradan', 45, 'bayt', 'prop', 'lamba', 'Geç saat kodlama ışığı.'),
  D_M('buyuk-bitki', 'Büyük Bitki', 'esya', 'Sıradan', 85, 'bayt', 'prop', 'bitki', 'Odaya yeşil katar.'),
  D_M('kitaplik', 'Kitaplık', 'esya', 'Sıradan', 110, 'bayt', 'prop', 'kitaplik', 'C# kitaplarının evi.'),
  D_M('kutu-sehpa', 'Kutu Sehpa', 'esya', 'Sıradan', 40, 'bayt', 'prop', 'kutu', 'Değişken gibi: içine ne koyarsan o.'),
  D_M('tabela-yazi-amber', 'Tabela Yazı Rengi: Amber', 'tabela', 'Sıradan', 150, 'bayt', 'prop', 'tabela', 'İşletme tabelanın yazısına sıcak amber.'),
  /* Şık — Bayt, mavi */
  D_M('yuvarlak-gozluk', 'Yuvarlak Gözlük', 'aksesuar', 'Şık', 150, 'bayt', 'avatar', 'gozluk', 'Kod okurken ciddi görünürsün.'),
  D_M('kulaklik', 'Kulaklık', 'aksesuar', 'Şık', 180, 'bayt', 'avatar', 'kulaklik', 'Odaklanma modu.'),
  D_M('kaptan-sapkasi', 'Kaptan Şapkası', 'aksesuar', 'Şık', 220, 'bayt', 'avatar', 'kaptan', 'Liman havası.'),
  D_M('turuncu-hirka', 'Turuncu Hırka', 'kiyafet', 'Şık', 240, 'bayt', 'avatar', 'kiyafet-1', 'Usta Defne tarzı.'),
  D_M('lacivert-blazer', 'Lacivert Blazer', 'kiyafet', 'Şık', 380, 'bayt', 'avatar', 'kiyafet-4', 'Savunmaya şık gir.'),
  D_M('kalp-emote', 'Kalp', 'emote', 'Şık', 120, 'bayt', 'avatar', 'emote-kalp', 'Teşekkür etmenin tatlı yolu.'),
  D_M('ikili-koltuk', 'İkili Koltuk', 'esya', 'Şık', 160, 'bayt', 'prop', 'koltuk', 'Misafirler için.'),
  D_M('calisma-masasi', 'Çalışma Masası', 'esya', 'Şık', 200, 'bayt', 'prop', 'masa', 'Kodun yazıldığı yer.'),
  D_M('yatak', 'Yatak', 'esya', 'Şık', 260, 'bayt', 'prop', 'yatak', 'Önce uyu, sonra debug et.'),
  D_M('tv-unitesi', 'TV Ünitesi', 'esya', 'Şık', 380, 'bayt', 'prop', 'tv', 'Hata ayıklama molası.'),
  D_M('neon-yazi', 'Neon Yazı', 'tabela', 'Şık', 300, 'bayt', 'prop', 'neon', 'Kapının üstünde parlayan yazı.'),
  /* Nadir — Bayt, mor, haftalık rotasyon (6 slot) */
  D_M('sari-baret', 'Sarı Baret', 'aksesuar', 'Nadir', 450, 'bayt', 'avatar', 'baret', 'Şantiye havası; haftalık rotasyon.', { rotasyon: true }),
  D_M('sari-yagmurluk', 'Sarı Yağmurluk', 'kiyafet', 'Nadir', 520, 'bayt', 'avatar', 'kiyafet-5', 'Liman yağmurunda şık kal.', { rotasyon: true }),
  D_M('robot-dansi', 'Robot Dansı', 'emote', 'Nadir', 250, 'bayt', 'avatar', 'emote-dans', 'Bip bop; haftalık rotasyon.', { rotasyon: true }),
  D_M('carsi-tentesi', 'Çarşı Tentesi', 'oda', 'Nadir', 320, 'bayt', 'prop', 'tente', 'Odana pazar yeri havası.', { rotasyon: true }),
  D_M('mini-cesme', 'Mini Çeşme', 'esya', 'Nadir', 380, 'bayt', 'prop', 'cesme', 'Su sesi eşliğinde kodla.', { rotasyon: true }),
  D_M('bonsai-agac', 'Bonsai Ağacı', 'esya', 'Nadir', 340, 'bayt', 'prop', 'agac', 'Sabır ağacı.', { rotasyon: true }),
  D_M('led-pano-tabela', 'LED Kayan Pano', 'tabela', 'Nadir', 600, 'bayt', 'prop', 'led-pano', 'Tabelanda kayan yazı.', { rotasyon: true }),
  /* Premium — Çip, turkuaz, Butik (statik) */
  D_M('neon-cirak-seti', 'Neon Çırak Seti', 'kiyafet', 'Premium', 100, 'cip', 'avatar', 'kiyafet-2', 'Neon çizgili 4 parçalı set.'),
  D_M('gece-odasi', 'Gece Odası Teması', 'oda', 'Premium', 120, 'cip', 'prop', 'lamba', 'Duvar + zemin + pencere temalı oda.'),
  D_M('dans-paketi', 'Dans Paketi I', 'emote', 'Premium', 40, 'cip', 'avatar', 'emote-dans', '8 emote\'luk paket.'),
  D_M('bulut-kolye', 'Bulut Kolyesi', 'aksesuar', 'Premium', 40, 'cip', 'avatar', 'kolye', 'Hafif, parlak, statik.'),
  D_M('neon-paleti', 'Neon Paleti', 'tabela', 'Premium', 30, 'cip', 'prop', 'neon', 'Tabela için 6 neon rengi.'),
  /* Nişan — yalnızca kazanılır; Rütbe Rafı'nda sergilenir (satılmaz) */
  D_M('otopark-ustasi-sapkasi', 'Otopark Ustası Şapkası', 'aksesuar', 'Nişan', 0, 'bayt', 'avatar', 'sapka', 'Otopark gizli testlerini ilk 3 denemede geçenlere.', { nasil: "Müfettiş'i en çok 3 denemede geç." }),
  D_M('keskin-goz-nisani', 'Keskin Göz Nişanı', 'aksesuar', 'Nişan', 0, 'bayt', 'avatar', 'rozet', '119/120 anomalisini fark edenlere.', { nasil: "İş Emri'nde 119 ve 120 dakika arasındaki fiyat farkını müşteriye sor." }),
  D_M('otopark-kupasi', 'Otopark Kupası', 'esya', 'Nişan', 0, 'bayt', 'prop', 'bayrak', 'İlk Açılış kupası.', { nasil: "Otopark'ın Savunma'sını geç ve Açılış yap." }),
  D_M('sampiyon-alkisi', 'Şampiyon Alkışı', 'emote', 'Nişan', 0, 'bayt', 'avatar', 'emote-alkisla', 'Lig şampiyonlarına.', { nasil: 'Haftalık ligde ilk 3 ol.' })
];

/* ---------- Liderlik (Türkçe isimli örnek oyuncular; Bronz kova 30 kişi) ---------- */
const D_AV = function (ten, sacStil, sacRenk, kiyafet, aksesuar) { return { ten: ten, sacStil: sacStil, sacRenk: sacRenk, kiyafet: kiyafet, aksesuar: aksesuar || [] }; };
const D_liderlik = {
  lig: { ad: 'Bronz Ligi', kova: 30, sifirlanma: 'Pazar 21:00', terfi: 7, dusme: 5 },
  haftalik: [
    ['ayse_kod', 9, 1420, D_AV(1, 2, 3, 1, ['gozluk'])], ['mert_yaz', 8, 1310, D_AV(3, 0, 0, 0)], ['zeynep.cs', 8, 1195, D_AV(0, 3, 4, 2)], ['can_derle', 7, 1090, D_AV(4, 5, 2, 3, ['kasket'])],
    ['elif_bit', 7, 980, D_AV(2, 4, 1, 4)], ['burak_byte', 6, 905, D_AV(5, 6, 0, 5)], ['selin_syntax', 6, 840, D_AV(1, 1, 5, 1, ['kulaklik'])], ['emre_loop', 5, 760, D_AV(3, 7, 2, 0)],
    ['defne_if', 5, 702, D_AV(0, 2, 3, 2)], ['kaan_main', 4, 610, D_AV(4, 0, 1, 3)], ['ece_void', 4, 548, D_AV(2, 3, 4, 4, ['bere'])], ['onur_null', 3, 470, D_AV(5, 5, 0, 5)]
  ].map(function (r) { return { ad: r[0], seviye: r[1], xp: r[2], avatar: r[3] }; }),
  kalicilik: [['mert_yaz', 8, 14], ['ayse_kod', 9, 12], ['zeynep.cs', 8, 11], ['elif_bit', 7, 9], ['can_derle', 7, 8], ['selin_syntax', 6, 6], ['burak_byte', 6, 5], ['emre_loop', 5, 3]]
    .map(function (r) { return { ad: r[0], seviye: r[1], altinDurak: r[2], avatar: D_AV(r[2] % 6, r[2] % 8, r[2] % 6, r[2] % 6) }; }),
  hizliOtopark: [['mert_yaz', '4 dk 12 sn'], ['ayse_kod', '5 dk 40 sn'], ['can_derle', '7 dk 03 sn'], ['elif_bit', '8 dk 31 sn'], ['zeynep.cs', '9 dk 55 sn']].map(function (r) { return { ad: r[0], sure: r[1] }; }),
  kazancliIsletme: [["ayse_kod'un Otoparkı", 3320], ["mert_yaz'ın Büfesi", 2870], ["can_derle'nin Otoparkı", 2410], ["elif_bit'in Otoparkı", 2190], ["zeynep.cs'in Otoparkı", 1975]].map(function (r) { return { ad: r[0], gelir: r[1] }; })
};

/* ---------- Günlük Tekrar (20 soru; 1-3-7-21). coktan: dogru = seçenek indeksi; kisa: dogru = kabul edilen cevaplar ('|' ile ayrılır, büyük/küçük harf ve Türkçe karakter farkı yok sayılır) ---------- */
const D_R2 = function (id, dersId, tip, soru, secenekler, dogru, aciklama) { return Object.assign({ id: id, dersId: dersId, tip: tip, soru: soru }, secenekler ? { secenekler: secenekler } : {}, { dogru: dogru, aciklama: aciklama }); };
const D_tekrar = [
  D_R2('tk-01', '1.1', 'coktan', 'Hangisi metin (`string`) tutar?', ['int', 'string', 'bool'], 1, '`string` metin tutar; `int` tam sayı, `bool` doğru/yanlış tutar.'),
  D_R2('tk-02', '1.1', 'coktan', '`Console.WriteLine($"Merhaba {ad}");` satırında `$` ne işe yarar?', ['Satırı yorum yapar', 'Süslü parantezin içine değişkenin değerini yerleştirir', 'Sayıyı dolara çevirir'], 1, '`$` metni tarif kartına çevirir; `{ad}` kutunun değeriyle dolar.'),
  D_R2('tk-03', '1.1', 'kisa', '`int yas = 17;` satırında `int` hangi tür değeri tutar? (iki sözcük)', null, 'tam sayı|tamsayı', '`int` tam sayı tutan türdür; kutunun üstündeki etikettir.'),
  D_R2('tk-04', '1.1', 'coktan', '`int yas = "17";` neden derlenmez (CS0029)?', ['`int` kutusuna metin girmez', '`yas` sözcüğü yasak', 'Noktalı virgül fazla'], 0, 'Tırnaklı `"17"` metindir; `int` kutusuna yalnızca tam sayı girer.'),
  D_R2('tk-05', '1.1', 'kisa', 'Ekrana bir satır duyuran komut `Console.` ile başlar. Devamı nedir?', null, 'writeline', '`Console.WriteLine` ekrana bir satır yazar.'),
  D_R2('tk-06', '1.2', 'coktan', 'İki `int` olan `7 / 2` kaç eder?', ['3', '3,5', '4'], 0, 'Tam sayı bölmesi kalanı keser: 3.'),
  D_R2('tk-07', '1.2', 'kisa', '`130 % 60` kaç eder?', null, '10', '`%` kalanı verir: 130 = 2 × 60 + 10.'),
  D_R2('tk-08', '1.2', 'coktan', 'Başlayan saati veren ifade hangisi?', ['`dakika / 60`', '`(dakika + 59) / 60`', '`dakika % 60`'], 1, 'Bölmeden önce 59 eklemek artan dakikayı bir sonraki saate taşır.'),
  D_R2('tk-09', '1.2', 'kisa', '`(61 + 59) / 60` kaç eder?', null, '2', '120 / 60 = 2: 61 dakika, 2. saatin içindedir.'),
  D_R2('tk-10', '1.2', 'coktan', '`double saat = 150 / 60;` sonrası `saat` kaçtır?', ['2.5', '2', '3'], 1, '`150 / 60` iki `int`: sonuç 2 olarak kesilir, sonra `double` kutusuna girer.'),
  D_R2('tk-11', '1.2', 'coktan', 'Otopark\'ta 121 dakika kaç başlayan saattir?', ['2', '3', '4'], 1, '(121 + 59) / 60 = 3.'),
  D_R2('tk-12', '1.3', 'coktan', '`yas` 12 iken `yas < 12` ifadesi nedir?', ['true', 'false', 'Derleme hatası'], 1, '`<` sınırın kendisini dışarıda bırakır; 12 < 12 yanlıştır.'),
  D_R2('tk-13', '1.3', 'coktan', 'Hangisi karşılaştırır?', ['`=`', '`==`', '`=>`'], 1, '`=` atar, `==` karşılaştırır.'),
  D_R2('tk-14', '1.3', 'kisa', '`if / else if / else` zincirinde ilk doğru koşuldan sonra kaç dal daha çalışır?', null, '0|sıfır|hiç|hiçbiri|yok', 'Yalnızca ilk doğru dal çalışır; kalanlara bakılmaz.'),
  D_R2('tk-15', '1.3', 'coktan', '`puan >= 50` koşulu `puan >= 85` koşulundan önce yazılırsa 90 puan için hangi dal çalışır?', ['`>= 85` dalı', '`>= 50` dalı', 'İkisi birden'], 1, 'İlk doğru koşul kazanır; dar koşulu öne almak gerekir.'),
  D_R2('tk-16', '1.3', 'coktan', 'Otopark\'ta tam 120 dakika hangi dilimdedir?', ['1. dilim (2 saatten az)', '2. dilim (2–6 saat)', 'Günlük'], 1, 'Sözleşme: 120 ≤ dakika ≤ 360 → 2. dilim; 2 × 40 = 80.'),
  D_R2('tk-17', '1.4', 'coktan', '`public static int Kare(int x)` imzasında baştaki `int` neyi söyler?', ['Metodun adını', 'Geri verdiği değerin türünü', 'Parametre sayısını'], 1, 'Baştaki tür, metodun `return` ile geri vereceği değerin türüdür.'),
  D_R2('tk-18', '1.4', 'kisa', 'Metodun değeri çağırana geri vermesini sağlayan sözcük nedir?', null, 'return', '`return` değeri teslim eder; `Console.WriteLine` yalnızca ekrana yazar.'),
  D_R2('tk-19', '1.4', 'coktan', '`Console.WriteLine(Topla(2, 3) * 10);` ekrana ne yazar? (`Topla` iki sayıyı toplar)', ['5', '50', '23'], 1, 'Önce `Topla(2, 3)` 5 döndürür, sonra 10 ile çarpılır: 50.'),
  D_R2('tk-20', '1.4', 'kisa', 'Hiçbir değer döndürmeyen metodun dönüş türü nedir?', null, 'void', 'Değer döndürmeyen metot `void` ile işaretlenir.')
];

/* ---------- Sohbet ve arkadaşlar (statik örnek) ---------- */
const D_sohbet = {
  meydan: [
    { ad: 'ayse_kod', metin: "Çarşı Sınavı'na hazırlanan var mı?", saat: '14:02' }, { ad: 'mert_yaz', metin: 'Ben Otopark kodunu bitirdim, Savunma kaldı.', saat: '14:03' },
    { ad: 'can_derle', metin: 'Savunmada hangi satırı seçiyorlar?', saat: '14:05' }, { ad: 'mert_yaz', metin: 'Bana saat * 40 satırını sordular.', saat: '14:06' },
    { ad: 'elif_bit', metin: 'Günlük Tekrar serim 7 oldu!', saat: '14:09' }, { ad: 'zeynep.cs', metin: "Pazar'da yeni Nadir ürünler var.", saat: '14:10' }
  ],
  hazirCumleler: ['Merhaba!', 'Selam, nasılsın?', 'Yardım eder misin?', 'Teşekkürler!', 'Güzel çözüm.', 'Ben de aynı soruda takıldım.', 'Hangi dersteyiz?', 'Görüşürüz!'],
  arkadaslar: [
    { ad: 'ayse_kod', seviye: 9, durum: 'çevrimiçi', avatar: D_AV(1, 2, 3, 1, ['gozluk']) }, { ad: 'mert_yaz', seviye: 8, durum: 'Otoparkta', avatar: D_AV(3, 0, 0, 0) },
    { ad: 'can_derle', seviye: 7, durum: 'çevrimdışı', avatar: D_AV(4, 5, 2, 3) }, { ad: 'elif_bit', seviye: 7, durum: 'çevrimiçi', avatar: D_AV(2, 4, 1, 4) }
  ],
  dm: [
    { kimden: 'ayse_kod', metin: 'Otopark kodun nasıl gidiyor?', saat: '13:40' }, { kimden: 'ben', metin: "İş Emri'ndeyim, 4 soru sordum.", saat: '13:42' },
    { kimden: 'ayse_kod', metin: '119 ile 120 dakikaya dikkat et :)', saat: '13:43' }
  ],
  davetKodu: 'KODKENT-DENIZ7'
};

/* ---------- Rozetler / Nişan'lar (ikon: sprite.html sembolleri) ---------- */
const D_rozetler = [
  { id: 'keskin-goz', ad: 'Keskin Göz', aciklama: '119/120 dakika anomalisini fark ettin.', nasil: "İş Emri'nde 119 ve 120 dakika arasındaki fiyat farkını müşteriye sor.", ikon: 'goz', odul: { xp: 50 } },
  { id: 'berrak-zihin', ad: 'Berrak Zihin', aciklama: 'Bir görevi ipucusuz, ilk denemede geçtin (+%15 XP).', nasil: "Görevi Pusula'ya bakmadan tamamla.", ikon: 'isik' },
  { id: 'ilk-bayt', ad: 'İlk Bayt', aciklama: 'İlk Baytını kazandın.', nasil: 'Meydan Saati görevini tamamla.', ikon: 'coin' },
  { id: 'ders-muhru', ad: 'Ders Mührü', aciklama: 'Bir dersin 3 sorusundan 2\'sinde 70 ve üstü aldın.', nasil: "Bir Usta sorusu setini ≥70 ile geç.", ikon: 'muhur' },
  { id: 'ruhsat', ad: 'Ruhsat Sahibi', aciklama: 'Üç görevi bitirip Otopark Ruhsatı\'nı aldın.', nasil: "Çarşı'nın üç Ruhsat görevini tamamla.", ikon: 'bayrak' },
  { id: 'ilk-acilis', ad: 'İlk Açılış', aciklama: 'İlk işletmeni açtın.', nasil: "Bir işletmenin Savunma'sını geç ve Açılış yap.", ikon: 'kutlama' },
  { id: 'otopark-ustasi', ad: 'Otopark Ustası', aciklama: 'Gizli testlerin tamamını ilk 3 denemede geçtin.', nasil: "Müfettiş'i en çok 3 denemede geç.", ikon: 'kupa' },
  { id: 'kurul-parlak', ad: 'Parlak Cevap', aciklama: 'Kurul kartında 85 ve üstü aldın.', nasil: 'Bir Usta sorusunda 85+ puan al.', ikon: 'parlak' },
  { id: 'savunma-ustasi', ad: 'Savunma Ustası', aciklama: "Kodunu Kurul'a ilk denemede savundun.", nasil: "Savunma'yı ilk denemede ≥70 ile geç.", ikon: 'kalkan' },
  { id: 'seri-7', ad: 'Yedi Gün', aciklama: 'Günlük Tekrar serin 7 güne ulaştı.', nasil: '7 gün üst üste Günlük Tekrar yap.', ikon: 'alev' },
  { id: 'ilk-alkis', ad: 'İlk Alkış', aciklama: 'İlk Alkışını aldın ya da verdin.', nasil: 'Bir arkadaşının odasına ya da işletmesine Alkış bırak.', ikon: 'kalp' },
  { id: 'carsi-madalyasi', ad: 'Çarşı Madalyası', aciklama: 'Çarşı Sınavı\'nı geçtin.', nasil: 'Çarşı Sınavı\'nda 3/3 kod ve ≥70 soru ortalaması.', ikon: 'madalya' },
  { id: 'hata-avcisi', ad: 'Hata Avcısı', aciklama: 'İlk Hata Bildirimi dosyasını çözdün.', nasil: 'Müfettiş\'in bıraktığı bir dosyadaki hatayı bul.', ikon: 'arama' }
];

/* ---------- Metinler (Türkçe, emojisiz, "henüz değil" tonu). Yaş kapısı: KANON §12.2 (asgari 15). ---------- */
const D_metinler = {
  bos: {
    akademi: 'Bu kürsü henüz açılmadı. Önceki semtin sınavını geçince kapısı açılır.',
    oda: "Odan boş. Pazar'dan eşya alıp yerleştirebilirsin.",
    ziyaretci: 'Defter henüz boş. Odanı Arkadaşlara aç, ilk ziyaretçini bekle.',
    dolap: "Dolabında bu kategoride eşya yok. Pazar'a göz at.",
    bildirim: 'Yeni bildirimin yok.',
    arkadas: "Henüz arkadaşın yok. Davet kodunu paylaş; arkadaşın ilk Bayt'ını kazanınca ikiniz de 100 B alırsınız.",
    meydanSohbet: 'Burası şimdilik sessiz. İlk selamı sen ver.',
    liderlik: "Bu haftanın ligi ilk XP'ni kazandığında başlar. Bir görev bitir, kovan oluşsun.",
    kalicilik: "Henüz altın durağın yok. Günlük Tekrar'da bir durağı 3 kez üst üste doğru bilirsen altın olur.",
    hizliOtopark: "Henüz süre yok. Otopark'ı açan ilk oyuncular burada görünür.",
    tekrar: 'Henüz tekrar edilecek bir şey yok. İlk dersini bitir, yarın burada olacağım.',
    kurulGecmisi: 'Henüz Kurul kartın yok. İlk Usta sorusuna cevap verince burada görünecek.',
    isletme: 'Henüz işletmen yok. Ruhsat 3/3, 300 B ve Sev. 3 olunca Otopark tapusunu alabilirsin.',
    vitrin: 'Vitrin açık bir işletmenin kodunu sergiler. Önce bir işletmeni aç.',
    gorev: 'Bugün açık görevin yok. Bir ders bitir, yeni görev açılsın.',
    nisan: 'Henüz Nişan kazanmadın. Rütbe Rafı\'nda nasıl kazanılacağını görebilirsin.'
  },
  hata: {
    ag: 'Bağlantı kurulamadı. Biraz sonra tekrar dene.',
    kayit: 'Kayıt okunamadı; yeni oyun başlatıldı.',
    kurul: 'Kurul şu an ulaşılamıyor, çevrimdışı demo kullanıldı.',
    kurulYogun: 'Kurul şu an yoğun, biraz sonra tekrar dene.',
    oturum: 'Oturum süresi doldu, sayfayı yenile.',
    gecersizCikti: 'Kurul kartı düzgün yazılamadı. Cevabın kayıtlı; Tekrar dene düğmesi deneme hakkını yakmaz.',
    bosCevap: 'Cevap kutusu boş. Birkaç cümle yeterli; rubrik yukarıda seni bekliyor.',
    cokKisa: 'Bu cevap çok kısa. Kutu, etiket ya da değer gibi kendi sözcüklerini kullan.',
    cokUzun: 'Cevap 1.500 karakteri aştı; fazlası değerlendirmeye alınmaz. Anlatımı kısaltır mısın?',
    dersKopyasi: 'Bu cümleler ders kartından aynen gelmiş. Kartı kapat, kutuyu kendi cümlenle anlat; benzetme kullanmak serbest.',
    savunmaYapistirma: 'Savunma kutusunda yapıştırma kapalı; kodunu kendi cümlelerinle anlatmanı istiyoruz.',
    kayitHizi: 'Çok hızlı. Birkaç saniye bekleyip tekrar dene.',
    yasDusuk: 'KodKent 15 yaş ve üzeri içindir.',
    kodHatali: 'Kod okunamadı. Parantezleri ve noktalı virgülleri kontrol et.',
    yetersizBayt: 'Bayt yetersiz. Görev ve Günlük Tekrar ile kazanabilirsin.',
    yetersizCip: 'Çip yetersiz. Çip yalnızca Semt Sınavı\'ndan kazanılır ya da Butik\'ten alınır.'
  },
  kurul: {
    bekleme: 'Kurul değerlendiriyor…', enjeksiyon: "Kurul kandırılmaz. Cevabın içinde Kurul'a talimat veren bir cümle buldum. Bu deneme 0 puan; hakkın yanmadı, kendi cümlelerinle yeniden dene.",
    rica: "Kurul pazarlık etmez, ama Usta yardım eder. Pusula'ya bakmak ister misin?", denemeBitti: 'İki deneme de kullanıldı; en yüksek puanın geçerli. Telafi Turu 10 dakika sonra açılır.',
    itirazHakSoru: 'Bu soru için itiraz hakkını kullandın. Cevabını değiştirmek istersen 2. denemen duruyor.', itirazHakGun: "Bugünkü 3 itiraz hakkını kullandın. Yarın 04:00'te yenilenir. Bu arada Pusula'ya bakabilirsin.",
    itirazDegismedi: 'Kurul cevabı ikinci kez okudu: puan değişmedi (fark 15\'in altında). Gerekçeler kartta.', itirazDegisti: 'Kurul ikinci kez okudu ve puanı güncelledi: {eski} → {yeni}. XP farkı hesabına yazıldı.',
    takipYok: "Bu cevap için Usta'nın ek sorusu yok. Sonraki soruya geçebilirsin.", takipAcik: "Usta'nın sorusu bu ders bitene kadar açık. İstersen şimdi yanıtla, istersen geç.",
    kotaDolu: 'Kurul bugünlük kapandı. Cevabın kaydedildi; sabaha kartın hazır olur ve XP\'n hesabına yazılır. Dersler, görevler ve ipuçları açık.',
    cevrimdisi: 'Çevrimdışı demo: sezgisel kontrol.', testSimule: 'Demo: testler yapay zekâ tarafından simüle edildi — gerçek üründe gVisor sandbox\'ında derlenir.',
    muhurAlindi: 'Ders Mührü alındı. Görev açıldı.', telafi: '3 sorudan 2\'sinde 70 ve üstü alamadın; Telafi Turu 10 dakika sonra açılır.'
  },
  bildirim: ['Günlük Tekrar seni bekliyor.', "Haftalık lig Pazar 21:00'de kapanıyor.", "Pazar'da yeni rotasyon başladı.", 'Ruhsatın 2/3; bir görev kaldı.', "Otopark'ın kasasında Bayt birikti.", 'Serin 7 güne yaklaşıyor; bugün tekrarı atlama.'],
  giris: {
    karsilama: 'Oyunlarla yazılım öğreniyorum.', altSlogan: 'Kod yaz, şehrini kur.', telefonIpucu: '+90 sabit; 5XX XXX XX XX biçiminde yaz.', demoKod: 'Demo: kod 123456', otpSure: 'Kod 90 saniye geçerli.',
    tekrarGonder: '60 saniye sonra tekrar gönderebilirsin.', denemeNotu: 'Saatte en fazla 5 deneme hakkın var.', dogumYili: 'Doğum yılın yalnızca yaş eşiğini belirlemek için kullanılır ve saklanmaz.',
    veliTelefon: "Velinin telefon numarası: onay bağlantısı oraya gidecek (72 saat geçerli)."
  },
  kvkk: {
    aydinlatma: 'KodKent, telefon numaranı yalnızca hesabını doğrulamak ve güvenliğini sağlamak için işler. Doğum yılını yaş eşiğini (15 altı / 15–17 / 18 ve üzeri) belirlemek için kullanırız ve saklamayız; e-Devlet yaş doğrulamasından yalnızca eşik bilgisi ve doğrulama tarihi kaydedilir. Yazdığın kodlar ve Kurul cevapların eğitim amacıyla değerlendirilir; üçüncü kişilerle paylaşılmaz. Verilerini istediğin an indirebilir ya da silebilirsin.',
    veli: 'KodKent 15 yaş ve üzeri içindir. 15–17 yaş arası oyuncular için güvenli mod açılır ve veli onayı gerekir: velinin telefonuna bir onay bağlantısı gönderilir, bağlantı 72 saat geçerlidir. Onay gelene kadar serbest metin sohbet, özel mesaj, ziyaret kabulü, Vitrin görünürlüğü ve Çip harcaması kapalı kalır; hazır cümleler ve emote açıktır. Bu yaş grubunda Çip limiti varsayılan olarak 0\'dır; veli, onay sayfasından limit ve süre sınırı koyabilir.',
    onayKutusu: 'Aydınlatma metnini okudum, anladım.', demoNotu: 'Bu metin prototip içindir; gerçek ürün metni hukuk onayından sonra yayımlanır.'
  },
  veli: {
    baslik: 'Veli onayı bekleniyor', bekliyor: 'Velinin telefonuna onay bağlantısı gönderildi. Bağlantı 72 saat geçerli. Onay gelene kadar serbest sohbet kapalı; hazır cümleler ve emote açık.',
    onayli: 'Veli onayı alındı. Serbest sohbet ve özel mesaj (yalnızca karşılıklı arkadaşlarla) açıldı.', hatirlat: 'Veline bağlantıyı yeniden göndermemizi ister misin?',
    kapaliOzellikler: ['Serbest metin sohbet', 'Özel mesaj (DM)', 'Ziyaret kabulü', 'Vitrin görünürlüğü', 'Çip harcaması'], limit: 'Çip limiti: 0 (veli koyabilir; üst sınır 300 Çip/ay)', sessizSaat: 'Bildirimler 21:00–08:00 arası sessizdir.',
    demoNotu: 'Demo: veli onayı tek tıkla simüle edilir.'
  },
  yasKapisi: {
    asgari: 15,
    kucukRet: { baslik: 'KodKent 15 yaş ve üzeri içindir', metin: "Şimdilik hesap açamıyoruz; ama seni unutmayacağız. Yaşın geldiğinde haber vermemizi istersen bir e-posta bırak (tercihen velinin e-postası). Telefon numarası almıyoruz, pazarlama iletisi göndermiyoruz.",
      dugme: 'Beni bekleme listesine yaz', alan: 'E-posta adresi', tesekkur: 'Kaydedildi. Yaşın geldiğinde sana tek bir e-posta göndereceğiz.' },
    guvenliMod: { baslik: 'Güvenli mod açık', metin: '15–17 yaş için KodKent güvenli modda çalışır: serbest sohbet ve özel mesajlar veli onayına kadar kapalı, profilin ve Vitrin kodun yalnızca arkadaşlarına görünür, Oda yalnızca arkadaşlara açıktır, bildirimler 21:00–08:00 arası sessizdir.' },
    eDevlet: { baslik: 'e-Devlet yaş doğrulama', metin: 'Yasa gereği hesap açılırken e-Devlet üzerinden yaşını doğrulaman gerekir. KodKent yalnızca 15 ve 18 eşik bilgisini alır; doğum tarihini ya da T.C. kimlik numaranı görmez.',
      demoNotu: 'Demo: e-Devlet doğrulaması simüle edilir; gerçek kimlik bilgisi girmezsin.', dugme: 'e-Devlet ile doğrula (demo)', basari: 'Yaş eşiğin doğrulandı (demo).' }
  },
  onboarding: [
    'Telefon numaranı gir; sana altı haneli bir kod gönderelim. (Demo: kod 123456)',
    'Doğum yılını yaz. Yaş eşiğini belirlemek için kullanırız, saklamayız.',
    'e-Devlet yaş doğrulaması (demoda simüle edilir). 15 yaş altına hesap açılmaz; 15–17 yaşta güvenli mod ve veli onayı devreye girer.',
    'Dilini seç: şimdilik C# açık, diğerleri yolda.',
    'Avatarını kur, takma adını seç ve şehre gir.',
    "Derleyici Meydanı'nda Usta Defne seni karşılar; ilk görevin Meydan Saati."
  ],
  csHata: [
    { kod: 'CS0029', mesaj: "'string' türü örtük olarak 'int' türüne dönüştürülemez", aciklama: 'int kutusuna metin koymaya çalışıyorsun. Tırnakları kaldır ya da türü string yap.' },
    { kod: 'CS1002', mesaj: '; bekleniyor', aciklama: 'Satırın sonunda noktalı virgül unutulmuş.' },
    { kod: 'CS0103', mesaj: "'x' adı geçerli bağlamda yok", aciklama: 'Bu isimde bir değişken tanımlamadın ya da yanlış yazdın.' },
    { kod: 'CS0161', mesaj: 'Tüm kod yolları bir değer döndürmüyor', aciklama: 'Metot int dönüyor ama bazı yollarda return yok.' },
    { kod: 'CS0266', mesaj: "'double' türü 'int' türüne örtük olarak dönüştürülemez", aciklama: 'Ondalıklı sonucu int kutusuna koyamazsın; (int) ile açıkça dönüştür.' },
    { kod: 'CS0121', mesaj: "Çağrı şu yöntem veya özellikler arasında belirsiz: 'System.Math.Ceiling(decimal)' ve 'System.Math.Ceiling(double)'", aciklama: '`int` değeri Ceiling\'e veriyorsun; decimal mi double mı olduğunu derleyici seçemiyor. Önce double\'a çevir (ör. dakika / 60.0).' },
    { kod: 'CS0019', mesaj: "'==' işleci 'int' ve 'string' türündeki işlenenlere uygulanamaz", aciklama: 'Farklı türleri karşılaştırıyorsun; iki tarafın türü aynı olmalı.' },
    { kod: 'CS0165', mesaj: 'Atanmamış yerel değişken kullanımı', aciklama: 'Değişkene değer vermeden kullanıyorsun; önce bir değer ata.' },
    { kod: 'CS0128', mesaj: "'saat' adlı yerel değişken bu kapsamda zaten tanımlanmış", aciklama: 'Aynı isimde iki kutu açmışsın; ikincide türü yazma, yalnızca değer ata.' },
    { kod: 'CS1525', mesaj: "İfade teriminde '}' geçersiz", aciklama: 'Eksik ya da fazla bir işaret var; parantez ve süslü parantezleri say.' },
    { kod: 'CS0246', mesaj: "'Console' tür veya ad alanı adı bulunamadı", aciklama: 'Yazım hatası olabilir: Console, büyük C ile başlar.' },
    { kod: 'CS1003', mesaj: "Sözdizimi hatası, ',' bekleniyor", aciklama: 'Parametre ya da değer listesinde virgül eksik.' }
  ]
};

/* ---------- Seviye Hediyeleri (B2 §3.2): Bayt/Çip/XP DEĞİL; L mod 5 dönüşümlü, bant büyüklükleri B2 §3.2 örnekleriyle (Sev. 11: +4 dolap, Sev. 13: +10 oda). ---------- */
const D_kilometreTaslari = {
  6: "Kalfa Töreni: 'Kalfa Yakası' Nişan'ı, 2. işletme slotu, Liman kapısı (Çarşı Sınavı sonrası).", 12: "Zanaatkâr Önlüğü Nişan'ı, 3. işletme slotu, Atölyeler kapısı (Liman Sınavı sonrası).",
  18: "Mühendis Baretı Nişan'ı, 4. işletme slotu, Kampüs kapısı (Atölye Sınavı sonrası).", 24: '5. işletme slotu.', 25: "Baş Mühendis Rozeti Nişan'ı, Finans Bölgesi kapısı (Kampüs Sınavı sonrası).",
  30: '6. işletme slotu.', 32: "Mimar unvanı, Veri Vadisi kapısı (Finans Sınavı sonrası).", 36: '7. işletme slotu.', 40: "Şehir Mimarı unvanı, Bulut Tepesi kapısı (Veri Sınavı sonrası).",
  42: 'Yeni oda teması açılır.', 45: 'Şehir Uygulaması (capstone) tapusu açılır.', 48: 'Profil çerçevesi koleksiyonu genişler.', 54: 'Yeni emote çarkı sayfası açılır.',
  60: "Efsane adayı: Sev. 60 ve 10 Mentor kilometre taşı ile 'Efsane' unvanı (v1.2)."
};
function D_seviyeHediyeleriUret() {
  const out = [];
  for (let L = 2; L <= 60; L++) {
    const k = L % 5, b = L >= 18 ? 3 : L >= 12 ? 2 : L >= 6 ? 1 : 0;
    let ad, aciklama, tur;
    if (k === 1) { ad = 'Dolap slotu'; tur = 'dolap'; aciklama = '+' + [2, 4, 6, 8][b] + ' dolap slotu.'; }
    else if (k === 2) { ad = 'Yeni emote'; tur = 'emote'; aciklama = 'Emote çarkına +1 slot ve yeni bir emote.'; }
    else if (k === 3) { ad = 'Oda eşya kapasitesi'; tur = 'oda'; aciklama = 'Oda eşya kapasitesi +' + [3, 5, 10, 10][b] + '.'; }
    else if (k === 4) { ad = 'Kıyafet parçası'; tur = 'kiyafet'; aciklama = L < 12 ? 'Yeni bir Sıradan kıyafet parçası.' : L < 40 ? 'Yeni bir Şık kıyafet parçası.' : 'Yeni bir Şık, animasyonlu kıyafet parçası.'; }
    else { ad = 'Tabela rengi / profil çerçevesi'; tur = 'tabela'; aciklama = 'Yeni bir tabela / neon rengi ya da profil çerçevesi.'; }
    const h = { seviye: L, ad: ad, aciklama: aciklama, tur: tur };
    if (D_kilometreTaslari[L]) { h.kilometreTasi = D_kilometreTaslari[L]; h.aciklama = aciklama + ' ' + D_kilometreTaslari[L]; }
    out.push(h);
  }
  return out;
}
const D_seviyeHediyeleri = D_seviyeHediyeleriUret();
