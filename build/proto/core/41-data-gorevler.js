/* ==== core/41-data-gorevler.js — görev kataloğu (P4). Kaynak: B4 §3 Görev Atlası + §4 (Çarşı prova görevleri), B6 §2.4–2.5, B5 §7.2.
   `ruhsat:true` yalnızca Otopark Ruhsatı parçalarıdır (Dakikadan Saate 1/3, Kademeli Karar 2/3, Taksimetre 3/3); Meydan Saati öğreticidir (Ruhsat yok).
   `acilisSeviye`: göreve erişim seviyesi (kartı açan şey Ders Mührü'dür). Dört Çarşı prova görevinin `editor` alanı TAM: başlangıç kodu, testler
   (her testte `desen` = kodda EŞLEŞMELİ, `yasak` = kodda EŞLEŞMEMELİ düzenli ifade dizeleri; yorum satırları yok sayılır), ipucu merdiveni, çözüm.
   Not: B6 §2.4'teki G03/G04 sayıları (13/25 yaş, metre) B4 §4 ile çelişir; ders sahibi B4 olduğundan B4 içeriği aynen kullanıldı. ==== */

const D_T = function (id, girdi, beklenen, etiket, desen, yasak) {
  return Object.assign({ id: id, girdi: girdi, beklenen: beklenen, etiket: etiket }, desen ? { desen: desen } : {}, yasak ? { yasak: yasak } : {});
};
const D_G = function (id, ad, tip, dersId, kosul, xp, bayt, sev, ruhsat, aciklama, ek) {
  return Object.assign({ id: id, ad: ad, tip: tip, semt: 'carsi', dersId: dersId, kosul: kosul, odul: { xp: xp, bayt: bayt }, acilisSeviye: sev, ruhsat: ruhsat, aciklama: aciklama }, ek || {});
};

const D_gorevler = [
  /* ---- Otopark Ruhsat hattı (G01–G04) ---- */
  D_G('meydan-saati', 'Meydan Saati', 'Tamamlama', '1.1', 'Ders 1.1 Mührü; 3 açık test yeşil', 60, 40, 1, false,
    "Derleyici Meydanı'ndaki saat panosu bozuldu; ekranda `Saat 14:05` yazmalı. Üç satırı tamamla: `saat` adlı `int` değişken (14), `dakika` adlı `string` değişken (`\"05\"`), sonra `$\"...\"` ile yazdır.", {
      ogretici: true, defneNotu: "Dakikayı neden `string` yaptık? `int` olsaydı baştaki sıfır kaybolur, panoda `14:5` görürdün.", teslimMesaji: "Testler yeşil. +60 XP, +40 B. İlk Bayt'ın.",
      editor: {
        baslangicKod: '// Meydan Saati — üç satırı tamamla\n// 1) saat: int, değeri 14\n// 2) dakika: string, değeri "05"\n// 3) $"..." ile  Saat 14:05  yazdır',
        beklenenCikti: 'Saat 14:05',
        testler: [
          D_T('t1', '—', 'derleme hatasız', 'Derleme',
            '^(?=[\\s\\S]*\\bint\\s+saat\\s*=\\s*14\\s*;)(?=[\\s\\S]*\\bstring\\s+dakika\\s*=\\s*"05"\\s*;)(?=[\\s\\S]*Console\\.WriteLine\\s*\\([^;]*\\)\\s*;)'),
          D_T('t2', '—', 'Saat 14:05', 'Çıktı',
            'Console\\.WriteLine\\s*\\(\\s*(\\$"Saat \\{\\s*saat\\s*\\}:\\{\\s*dakika\\s*\\}"|"Saat\\s*"\\s*\\+\\s*saat\\s*\\+\\s*":"\\s*\\+\\s*dakika)\\s*\\)'),
          D_T('t3', '—', 'kaynakta int saat, string dakika ve $" var', 'Değişken kullanımı',
            '^(?=[\\s\\S]*\\bint\\s+saat\\b)(?=[\\s\\S]*\\bstring\\s+dakika\\b)(?=[\\s\\S]*\\$")', '"[^"]*Saat\\s+14:05[^"]*"')
        ],
        ipuclari: {
          pusula: 'Üç iş var: iki değişken kutusu kur, sonra ikisini tek satırda metne yerleştir. `dakika` neden `string`? Baştaki sıfır kaybolmasın diye.',
          fener: 'Kutular: `int saat = 14;` ve `string dakika = "05";`. Yazdırırken `$` işareti ve süslü parantez gerekir: boşluklar `{saat}` ve `{dakika}`.',
          taslak: 'int saat = ___;\nstring dakika = ___;\nConsole.WriteLine($"Saat {___}:{___}");',
          ornek: '// Benzer ama farklı bir problem — tarih panosu\nint gun = 3;\nstring ay = "09";\nConsole.WriteLine($"Tarih: {gun}.{ay}");'
        },
        cozum: 'int saat = 14;\nstring dakika = "05";\nConsole.WriteLine($"Saat {saat}:{dakika}");'
      } }),
  D_G('dakikadan-saate', 'Dakikadan Saate', 'Sıralama', '1.2', 'Ders 1.2 Mührü; 3 açık test yeşil', 60, 50, 1, true,
    "Hasan Abi'nin pano sistemi dakikayı başlayan saate çevirmeli. Önce karışmış satırları sırala (iki çeldirici var), sonra eksik sayıyı yaz.", {
      tipNotu: 'Sıralama + Tamamlama', ruhsatIsletme: 'otopark', ruhsatSira: 1, defneNotu: '`dakika / 60 + 1` neden olmaz? Tam 120 dakikada 3 yazar, oysa tam 2 saat.',
      teslimMesaji: 'Ruhsat 1/3. İki görev kaldı.',
      editor: {
        baslangicKod: '// Dakikadan Saate — satırları doğru sıraya diz, 2 çeldiriciyi sil, ___ yerine sayıyı yaz.\nConsole.WriteLine(baslayanSaat);\nint baslayanSaat = dakika / 60 + 1;\nint baslayanSaat = (dakika + ___) / 60;\ndouble baslayanSaat = dakika / 60;\nint dakika = 130;',
        beklenenCikti: '3',
        testler: [
          D_T('t1', '30', '1', 'Başlayan 1. saat', '^(?=[\\s\\S]*\\bint\\s+dakika\\s*=\\s*\\d+\\s*;[\\s\\S]*\\bint\\s+baslayanSaat\\s*=[^;]*\\bdakika\\b[^;]*;[\\s\\S]*Console\\.WriteLine\\s*\\(\\s*baslayanSaat\\s*\\))', '___|double\\s+baslayanSaat\\s*='),
          D_T('t2', '61', '2', 'Başlayan 2. saat', '^(?=[\\s\\S]*\\bint\\s+dakika\\s*=\\s*\\d+\\s*;[\\s\\S]*\\bint\\s+baslayanSaat\\s*=[^;]*/\\s*60[^;]*;[\\s\\S]*Console\\.WriteLine\\s*\\(\\s*baslayanSaat\\s*\\))', '___|double\\s+baslayanSaat\\s*='),
          D_T('t3', '120', '2', 'Tam 2 saat, 3. başlamadı', '^(?=[\\s\\S]*\\bint\\s+dakika\\s*=\\s*\\d+\\s*;[\\s\\S]*\\bint\\s+baslayanSaat\\s*=\\s*(\\(\\s*dakika\\s*\\+\\s*59\\s*\\)\\s*/\\s*60|\\(int\\)\\s*Math\\.Ceiling\\s*\\(\\s*dakika\\s*/\\s*60\\.0\\s*\\))\\s*;[\\s\\S]*Console\\.WriteLine\\s*\\(\\s*baslayanSaat\\s*\\))', '___|dakika\\s*/\\s*60\\s*\\+\\s*1|double\\s+baslayanSaat\\s*=')
        ],
        ipuclari: {
          pusula: "Hasan Abi'nin pano sistemi dakikayı başlayan saate çevirmeli. Önce yalnızca ilk kısmı düşün: 61 dakika kaç başlayan saattir? 120 dakika?",
          fener: 'Satırları sıraya koy: önce `dakika` kutusu, sonra hesap, sonra yazdırma. Hesap için Ders 1.2 kalıbı: bölmeden önce 59 ekle. `dakika / 60 + 1` tam 120 dakikada 3 yazar; oysa tam 2 saat.',
          taslak: 'int dakika = ___;\nint baslayanSaat = (dakika + ___) / 60;\nConsole.WriteLine(___);',
          ornek: '// Benzer ama farklı bir problem — bisiklet: başlayan her 15 dakika bir blok\nint dakika = 47;\nint blok = (dakika + 14) / 15;\nConsole.WriteLine(blok);'
        },
        cozum: 'int dakika = 130;\nint baslayanSaat = (dakika + 59) / 60;\nConsole.WriteLine(baslayanSaat);'
      } }),
  D_G('kademeli-karar', 'Kademeli Karar', 'Tamamlama', '1.3', 'Ders 1.3 Mührü; 3 açık test yeşil', 60, 60, 1, true,
    'Sinema bileti üç kademeli: 12 yaş altı 40 TL, 12–64 yaş 70 TL, 65 ve üstü 50 TL. Üç boşluğu doldur.', {
      ruhsatIsletme: 'otopark', ruhsatSira: 2, defneNotu: 'Üç kademeyi üç turnike say; 12 ve 65, turnikenin kapı eşiği.', teslimMesaji: 'Ruhsat 2/3. Bir görev kaldı.',
      editor: {
        baslangicKod: 'int yas = 30;\nint fiyat = 0;\nif (yas < 12)\n{\n    fiyat = ___;\n}\nelse if (___)\n{\n    fiyat = 70;\n}\nelse\n{\n    fiyat = ___;\n}\nConsole.WriteLine(fiyat);',
        beklenenCikti: '70',
        testler: [
          D_T('t1', '8', '40', 'Çocuk kademesi', 'if\\s*\\(\\s*yas\\s*<\\s*12\\s*\\)\\s*\\{\\s*fiyat\\s*=\\s*40\\s*;', '___'),
          D_T('t2', '12', '70', 'Alt sınır tam kademeye girer',
            'else\\s+if\\s*\\(\\s*(yas\\s*<\\s*65|yas\\s*<=\\s*64|yas\\s*>=\\s*12\\s*&&\\s*yas\\s*<\\s*65|yas\\s*>=\\s*12\\s*&&\\s*yas\\s*<=\\s*64|yas\\s*<\\s*65\\s*&&\\s*yas\\s*>=\\s*12)\\s*\\)\\s*\\{\\s*fiyat\\s*=\\s*70\\s*;', '___'),
          D_T('t3', '65', '50', 'Üst sınır yaşlı kademesine girer',
            '^(?=[\\s\\S]*else\\s*\\{\\s*fiyat\\s*=\\s*50\\s*;)(?=[\\s\\S]*else\\s+if\\s*\\([^)]*(yas\\s*<\\s*65|yas\\s*<=\\s*64))', '___|yas\\s*<=\\s*65')
        ],
        ipuclari: {
          pusula: 'Üç turnike var: çocuk, yetişkin, yaşlı. Hangi sayı hangi turnikeden geçer? Önce 12 ve 65 gibi eşik değerlerine bak.',
          fener: '`yas < 12` çocuk; 12 çocuk değil. Ortadaki kademenin üst sınırı 65\'i içermez: `yas < 65`. En sondaki `else` 65 ve üstünü yakalar.',
          taslak: 'if (yas < 12) { fiyat = ___; }\nelse if (yas < ___) { fiyat = 70; }\nelse { fiyat = ___; }',
          ornek: '// Benzer ama farklı bir problem — kargo ücreti\nif (kg < 5) { ucret = 20; }\nelse if (kg < 20) { ucret = 35; }\nelse { ucret = 60; }'
        },
        cozum: 'int yas = 30;\nint fiyat = 0;\nif (yas < 12)\n{\n    fiyat = 40;\n}\nelse if (yas < 65)\n{\n    fiyat = 70;\n}\nelse\n{\n    fiyat = 50;\n}\nConsole.WriteLine(fiyat);'
      } }),
  D_G('taksimetre', 'Taksimetre', 'Sıfırdan', '1.4', 'Ders 1.4 Mührü; 3 açık test yeşil', 60, 80, 1, true,
    'Taksimetre imzası hazır; gövdeyi sen yaz. Açılış ücreti 40 TL, her kilometre 15 TL. Hiç yol gitmeyen (0 km) yolcu ödemez.', {
      ruhsatIsletme: 'otopark', ruhsatSira: 3, defneNotu: "İmza Otopark'ta da aynı: `UcretHesapla(int dakika)`. Kapıdaki tabela hazır, sıra içeride.",
      teslimMesaji: "Ruhsat 3/3. Belediye teşviki +100 B. Otopark için 'Satılık' tabelası yandı.", ruhsatTesviki: 100,
      editor: {
        baslangicKod: '// km: gidilen yol (0 veya daha büyük, tam sayı)\n// dönüş: ödenecek ücret, TL (tam sayı)\nstatic int TaksiUcreti(int km)\n{\n    // kodun buraya\n}',
        beklenenCikti: 'metodun dönüş değeri testlerdeki gibi',
        testler: [
          D_T('t1', '0', '0', 'Binmeyen yolcu ödemez',
            '^(?=[\\s\\S]*(return\\s+0\\s*;|:\\s*0\\s*;))(?=[\\s\\S]*km\\s*(<=|<|==|>|>=|!=)\\s*[01]\\b)', 'NotImplementedException'),
          D_T('t2', '1', '55', 'Açılış + 1 km',
            '^(?=[\\s\\S]*\\breturn\\b)(?=[\\s\\S]*\\b40\\b)(?=[\\s\\S]*(km\\s*\\*\\s*15|15\\s*\\*\\s*km))', 'NotImplementedException'),
          D_T('t3', '10', '190', '40 + 10 × 15',
            '(40\\s*\\+\\s*(km\\s*\\*\\s*15|15\\s*\\*\\s*km)|(km\\s*\\*\\s*15|15\\s*\\*\\s*km)\\s*\\+\\s*40|\\+=\\s*(km\\s*\\*\\s*15|15\\s*\\*\\s*km))', 'NotImplementedException|\\*\\s*40\\b|\\b40\\s*\\*')
        ],
        ipuclari: {
          pusula: 'İmza hazır: `km` gelir, ücret (`int`) çıkar. İki iş var: (1) hiç yol gitmeyen yolcu, (2) açılış ücreti + kilometre ücreti.',
          fener: 'Açılış 40 TL, her km 15 TL: 1 km → 40 + 1 × 15 = 55. 0 km ayrı bir durum: sözleşme `km` ≥ 0 diyor ve 0 km ödemez. Metot `return` ile değer geri vermeli (CS0161 buradan gelir).',
          taslak: 'km 0 veya altındaysa -> 0 dön\naksi halde -> ___ + km * ___ dön',
          ornek: '// Benzer ama farklı bir problem — scooter kiralama\npublic static int ScooterUcreti(int saat)\n{\n    if (saat <= 0) return 0;\n    return 10 + saat * 8;\n}'
        },
        cozum: '// km: gidilen yol (0 veya daha büyük, tam sayı)\n// dönüş: ödenecek ücret, TL (tam sayı)\nstatic int TaksiUcreti(int km)\n{\n    if (km <= 0) return 0;\n    return 40 + km * 15;\n}'
      } }),

  /* ---- Çarşı: Büfe ve Manav hatları, kapanış (G05–G13) ---- */
  D_G('bufe-fisi', 'Büfe Fişi', 'Sıralama', '1.5', 'Ders 1.5 Mührü', 60, 50, 4, false, '`decimal` ile fiyat × adet − ödenen = para üstü satırlarını sırala (`m` soneki, `Math.Round`); 4 açık test.', { ruhsatIsletme: 'bufe', ruhsatSira: 1 }),
  D_G('bozukluk-sayaci', 'Bozukluk Sayacı', 'Tamamlama', '1.6', 'Ders 1.6 Mührü', 60, 60, 4, false, '`while` ile 20 / 10 / 5 TL banknot ayrıştırma; sayaç ve toplayıcı ifadelerini tamamla.', { ruhsatIsletme: 'bufe', ruhsatSira: 2 }),
  D_G('bozukluk-kasasi', 'Bozukluk Kasası', 'Sıfırdan', '1.7', 'Ders 1.7 Mührü', 60, 80, 4, false, '`for` ile para üstündeki bozuk paraları say; 4 açık + 2 gizli test.', { ruhsatIsletme: 'bufe', ruhsatSira: 3 }),
  D_G('meyve-etiketi', 'Meyve Etiketi', 'Sıralama', '1.8', 'Ders 1.8 Mührü', 60, 50, 5, false, '`switch` ile ürün kodu → etiket satırlarını sırala.', { ruhsatIsletme: 'manav', ruhsatSira: 1 }),
  D_G('toptan-indirim', 'Toptan İndirim', 'Tamamlama', '1.9', 'Ders 1.9 Mührü', 60, 60, 5, false, 'Eşik tablosu: 1–4 kg %0, 5–9 kg %5, 10+ kg %10; yüzdeyi `decimal` ile uygula.', { ruhsatIsletme: 'manav', ruhsatSira: 2 }),
  D_G('sepet-fisi', 'Sepet Fişi', 'Sıfırdan', '1.10', 'Ders 1.10 Mührü', 60, 80, 5, false, 'Kademe metodunu her kalem için çağır, topla, biçimli yazdır; 4 açık + 2 gizli test.', { ruhsatIsletme: 'manav', ruhsatSira: 3 }),
  D_G('fis-hizasi', 'Fiş Hizası', 'Tamamlama', '1.11', 'Ders 1.11 Mührü', 60, 60, 4, false, '`PadLeft` / `PadRight` ve `ToUpper` ile hizalı fiş satırı.', {}),
  D_G('yerelde-calistir', 'Yerelde Çalıştır', 'Tamamlama', '1.12', 'Ders 1.12 Mührü', 60, 40, 3, false, '`dotnet run` çıktısını ve CS hata satırını okuyup eksik ifadeyi tamamla.', {}),
  D_G('carsi-sinavi', 'Çarşı Sınavı', 'Semt Sınavı', null, 'Çarşı 1.1–1.12 Mühürleri; 3/3 kod + soru ortalaması ≥70', 200, 500, 1, false, '20 dk, 3 kod + 3 Usta sorusu. Geçersen Liman kapısı Sev. 6 ile açılır.', { cip: 10, sureDk: 20, madalya: 'Çarşı Madalyası', odul: { xp: 200, bayt: 500, cip: 10 } }),

  /* ---- İşletme, günlük ve Hata Bildirimi ---- */
  D_G('is-emri-otopark', 'Otopark İş Emri', 'İş Emri', null, 'Tapu (300 B, Sev. 3, Ruhsat 3/3); 4 netleştirme sorusu; 6 açık + 14 gizli test; Savunma ≥70', 300, 0, 3, false,
    "Hasan Abi: 'Burada bir ücret sistemi lazım, yapan var mı?' Tapu → İş Emri → Gereksinim Netleştirme → Kod → Müfettiş → Savunma → Açılış.", { isletme: 'otopark', teslimMesaji: 'Açılış! +300 XP. LED panoda adın akıyor.' }),
  D_G('gunluk-tekrar', 'Günlük Tekrar', 'Günlük Tekrar', null, 'Her gün 5 soru, hedef 3 dk', 15, 20, 1, false, '5 soru, 3 dakika. Seri 7 günü bulunca tekrar başına 30 B.', { seriBonus: 30 }),
  D_G('hata-otopark-1440', 'Hata Bildirimi: 1.440 dakika → 500 TL', 'Hata Bildirimi', '1.4', 'İlk Açılıştan sonra; günde en çok 3', 40, 40, 3, false,
    'Müfettiş dosya bıraktı: bir müşteri 1.440 dakika için 500 TL ödemiş. Hatalı satırı bul ve düzelt.', {
      isletme: 'otopark',
      hata: { sikayet: 'Müşteri 1.440 dakika için 500 TL ödemiş.', kod: D_otopark.yaygınHatalar[8].tamKod, hataliSatir: 'int gun = dakika / 1440 + 1;', cozumSatiri: 'int gun = (dakika + 1439) / 1440;',
        anahtarlar: ['1440|1.440', 'gün', '+ 1|bir ekle|fazla', 'tam gün|tam katı|1439|yukarı yuvarla|başlayan gün'],
        ornekIyiCevap: "Hata gün hesabında: `dakika / 1440 + 1` tam 1.440 dakikada da 1 ekliyor, 2 gün çıkıyor. Doğrusu başlayan gün için `(dakika + 1439) / 1440`; böylece 1.440 → 1 gün, 250 TL.",
        zayifCevap: 'Ücret hesabı yanlış.' } }),
  D_G('hata-otopark-120', 'Hata Bildirimi: 120 dakika → 200 TL', 'Hata Bildirimi', '1.3', 'İlk Açılıştan sonra', 40, 60, 3, false, 'Dilim yuvarlanmış saatle karşılaştırılmış (`saat < 2`); ham dakikayla düzelt.', { isletme: 'otopark' }),
  D_G('hata-otopark-0', 'Hata Bildirimi: 0 dakika → 100 TL', 'Hata Bildirimi', '1.4', 'İlk Açılıştan sonra', 40, 40, 3, false, '`dakika <= 0` koruması yok; sınır girdisi.', { isletme: 'otopark' }),
  D_G('hata-otopark-361', 'Hata Bildirimi: 361 dakika → 360 TL', 'Hata Bildirimi', '1.3', 'İlk Açılıştan sonra', 40, 90, 3, false, 'Üst sınır yanlış; günlük tarife atlanıyor.', { isletme: 'otopark' }),

  /* ---- Liman (kilitli; Çarşı Sınavı sonrası) ---- */
  D_G('abone-listesi', 'Abone Listesi', 'Tamamlama', '2.1', 'Ders 2.1 Mührü', 60, 50, 6, false, '`List<string>` abone plakaları: `Add`, `Count`, `Contains`; 4 açık test.', { semt: 'liman', ruhsatIsletme: 'kargo-deposu', ruhsatSira: 1 }),
  D_G('konteyner-sirasi', 'Konteyner Sırası', 'Sıralama', '2.2', 'Ders 2.2 Mührü', 60, 60, 6, false, '`int[]` dizisi ve indeks: diziyi gezen `for` satırlarını sırala.', { semt: 'liman', ruhsatIsletme: 'kargo-deposu', ruhsatSira: 2 }),
  D_G('depo-sayimi', 'Depo Sayımı', 'Sıfırdan', '2.3', 'Ders 2.3 Mührü', 60, 80, 6, false, '`foreach` ile toplam, sayım, en büyük; boş liste → 0 (gizli test).', { semt: 'liman', ruhsatIsletme: 'kargo-deposu', ruhsatSira: 3 })
];
