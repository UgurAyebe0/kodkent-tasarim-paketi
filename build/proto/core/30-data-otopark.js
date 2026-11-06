/* ==== core/30-data-otopark.js — Otopark Tier 1 (İş Emri #1). P4. Kaynak: KANON §5.1 (testler/sözleşme/referans BİREBİR), B5 §3.1–3.11, §7.1, §8.3. ==== */

/** Verilen gövdeyi Otopark sınıfının içine yerleştirir (yaygın hata ve alternatif çözüm kodları için). */
function D_otoparkSinif(govde) {
  return '// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi\npublic static class Otopark\n{\n    public static int UcretHesapla(int dakika)\n    {\n' +
    govde.split('\n').map(function (s) { return s ? '        ' + s : s; }).join('\n') + '\n    }\n}';
}
const D_opHata = function (kod, ad, satir, govde, kalanAcik, kalanGizli, tohumlu, dusunur, usta) {
  return { kod: kod, ad: ad, satir: satir, tamKod: D_otoparkSinif(govde), kalanAcik: kalanAcik, kalanGizli: kalanGizli, tohumluYakalama: tohumlu, oyuncuDusunur: dusunur, ustaYonlendirme: usta };
};

const D_opRef = `// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi
public static class Otopark
{
    // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)
    // dönüş: ödenecek ücret, TL (tam sayı)
    public static int UcretHesapla(int dakika)
    {
        if (dakika <= 0) return 0;
        int saat = (dakika + 59) / 60;        // başlayan saat
        if (dakika < 120) return saat * 100;  // 2 saatten az kalanlar
        if (dakika <= 360) return saat * 40;  // 2–6 saat, sınırlar dâhil
        int gun = (dakika + 1439) / 1440;     // başlayan gün
        return gun * 250;
    }
}`;
const D_opTemplate = `// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi
public static class Otopark
{
    // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)
    // dönüş: ödenecek ücret, TL (tam sayı)
    public static int UcretHesapla(int dakika)
    {
        // kodun buraya
        throw new NotImplementedException();
    }
}`;

const D_otopark = {
  hasanIstegi: '2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum.',
  imza: 'public static int Otopark.UcretHesapla(int dakika)',
  /** 6 açık test (KANON §5.1). `etiket` = Müfettiş şikâyet kategorisi. */
  publicTestler: [
    { id: 'A1', dakika: 30, beklenen: 100, etiket: 'iki-saatten-az', gerekce: 'Başlayan 1. saat; en kısa yoldan 1. dilim' },
    { id: 'A2', dakika: 61, beklenen: 200, etiket: 'iki-saatten-az', gerekce: 'Başlayan 2. saat ama dilim hâlâ "2 saatten az"; dilimi yuvarlanmış saatle seçen çözümü kırar' },
    { id: 'A3', dakika: 120, beklenen: 80, etiket: 'iki-saat-civari', gerekce: 'Tam 2 saat: 2. dilimin alt sınırı dâhil; `<=` tuzağı' },
    { id: 'A4', dakika: 121, beklenen: 120, etiket: 'iki-saat-civari', gerekce: 'Başlayan 3. saat, 3 × 40; 2. dilimde yukarı yuvarlama' },
    { id: 'A5', dakika: 361, beklenen: 250, etiket: 'alti-saat-civari', gerekce: '6 saati bir dakika aştı → günlük; sınırın öte yakası' },
    { id: 'A6', dakika: 1441, beklenen: 500, etiket: 'bir-gun-civari', gerekce: 'İkinci gün başladı; "günlük sabit 250" hatasını kırar' }
  ],
  /** 14 gizli test (KANON §5.1). Yalnızca Müfettiş çalıştırır; oyuncuya sayı değil kategori söylenir. */
  gizliTestler: [
    { id: 'G1', dakika: 0, beklenen: 0, etiket: 'hemen-cikanlar', gerekce: 'Madde 1: 0 → 0; "en az 1 saat" varsayımını yakalar' },
    { id: 'G2', dakika: 1, beklenen: 100, etiket: 'hemen-cikanlar', gerekce: 'En küçük pozitif kalış; yukarı yuvarlama yoksa 0 TL döner' },
    { id: 'G3', dakika: 59, beklenen: 100, etiket: 'iki-saatten-az', gerekce: 'Saat başından bir önce; taban bölme 0 TL verir' },
    { id: 'G4', dakika: 60, beklenen: 100, etiket: 'iki-saatten-az', gerekce: 'Tam 1 saat: (dakika + 60) / 60 bunu 2 saat sayar' },
    { id: 'G5', dakika: 119, beklenen: 200, etiket: 'iki-saat-civari', gerekce: 'Anomali tepesi: 119 → 200; dilimi saate göre seçen çözüm 80 verir' },
    { id: 'G6', dakika: 180, beklenen: 120, etiket: 'iki-alti-arasi', gerekce: '2. dilimde tam saat katı' },
    { id: 'G7', dakika: 359, beklenen: 240, etiket: 'alti-saat-civari', gerekce: '2. dilimin son dakikaları' },
    { id: 'G8', dakika: 360, beklenen: 240, etiket: 'alti-saat-civari', gerekce: 'Üst sınır dâhil: 6 × 40, günlük 250 değil' },
    { id: 'G9', dakika: 720, beklenen: 250, etiket: 'gunluk-tarife', gerekce: 'Günlük dilimin içi; gün tabanı 0 TL verir' },
    { id: 'G10', dakika: 1439, beklenen: 250, etiket: 'bir-gun-civari', gerekce: 'Günün son dakikası' },
    { id: 'G11', dakika: 1440, beklenen: 250, etiket: 'bir-gun-civari', gerekce: 'Tam gün katı; `dakika / 1440 + 1` 500 verir' },
    { id: 'G12', dakika: 2880, beklenen: 500, etiket: 'gunu-asanlar', gerekce: 'Tam 2 gün' },
    { id: 'G13', dakika: 2881, beklenen: 750, etiket: 'gunu-asanlar', gerekce: '3. gün başladı; sabit günlük 250 verir' },
    { id: 'G14', dakika: 100000, beklenen: 17500, etiket: 'gunu-asanlar', gerekce: 'Büyük girdi: (100000 + 1439) / 1440 = 70' }
  ],
  /** 6 tohumlu test: oyuncuya özel rastgele (KK_CORE.tohumluTestler). Katman aralıkları B5 §1.7 örneklerinden. */
  tohumluKatmanlar: [
    { id: 'T1', katman: 'dilim-1-ic', aralik: [2, 119] }, { id: 'T2', katman: 'dilim-2-ic', aralik: [121, 359] }, { id: 'T3', katman: 'gunluk-ic', aralik: [381, 1399] },
    { id: 'T4', katman: 'cok-gunlu-ic', aralik: [1441, 20000] }, { id: 'T5', katman: 'saat-siniri', kural: '60 × k, k = 3..6' }, { id: 'T6', katman: 'gun-siniri', kural: '1440 × k + 1, k = 2..12' }
  ],
  referansKod: D_opRef,
  templateKod: D_opTemplate,
  /** Sözleşme Kartı (KANON §5.1, aynen). `acanSorular`: maddeyi açan netleştirme soruları. */
  sozlesme: [
    { madde: 1, kural: 'Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL', acanSorular: ['S5', 'S6'] },
    { madde: 2, kural: 'Dilimi ham kalış süresi belirler: dakika < 120 → 1. dilim; 120 ≤ dakika ≤ 360 → 2. dilim (sınırlar dâhil); dakika > 360 → günlük', acanSorular: ['S1', 'S2', 'S3'] },
    { madde: 3, kural: 'Başlayan saat tam sayılır: saat = ceil(dakika / 60); 1. dilim saat × 100, 2. dilim saat × 40', acanSorular: ['S1'] },
    { madde: 4, kural: '24 saati aşan kalış: her başlayan gün 250 (gun = ceil(dakika / 1440), gun × 250)', acanSorular: ['S4', 'S8'] },
    { madde: 5, kural: 'İmza: public static int Otopark.UcretHesapla(int dakika); dönüş TL, tam sayı', acanSorular: ['S6', 'S7'] },
    { madde: 6, kural: 'Anomali (119 → 200, 120 → 80) müşterinin bilinçli kararıdır; fark eden oyuncu Keskin Göz (+50 XP)', acanSorular: [] }
  ],
  /** Gereksinim Netleştirme: 8 hazır soru (B5 §3.2). `madde` = ana madde (tek sayı); `maddeler` = açtığı tüm maddeler. En az 4 soru sorulmadan koda geçilmez. */
  netlestirmeSorulari: [
    { id: 'S1', soru: '1 saat 10 dakika kalan ne öder?', cevap: 'Başlayan saat tam sayılır; 2 saatten az kaldı: 200.', madde: 3, maddeler: [2, 3], ogretim: 'yukarı yuvarlama; dilimi ham sürenin belirlemesi' },
    { id: 'S2', soru: 'Tam 2 saat kalan ne öder?', cevap: 'O artık 2–6 dilimi: 2 × 40 = 80.', madde: 2, maddeler: [2], ogretim: 'alt sınır dâhil' },
    { id: 'S3', soru: 'Tam 6 saat kalan ne öder?', cevap: "Hâlâ 2–6 dilimi: 240; 6'yı geçen güne girer.", madde: 2, maddeler: [2], ogretim: 'üst sınır dâhil' },
    { id: 'S4', soru: '24 saati aşan ne öder?', cevap: 'Her başlayan gün 250.', madde: 4, maddeler: [4], ogretim: 'çok günlü kalış (1.441 → 500)' },
    { id: 'S5', soru: 'Girip aynı dakika çıkan ne öder?', cevap: 'Ödemez. Bariyer eksi süre göndermez.', madde: 1, maddeler: [1], ogretim: 'sıfır girdisi; girdi ≥ 0' },
    { id: 'S6', soru: 'Süreyi nasıl göndereceksin: dakika mı, saat mi, kesirli mi?', cevap: 'Dakika, tam sayı. Kesir yok.', madde: 1, maddeler: [1, 5], ogretim: 'girdi türü (int)' },
    { id: 'S7', soru: 'Ücret kuruşlu olabilir mi?', cevap: 'TL, tam sayı. Kuruş yok.', madde: 5, maddeler: [5], ogretim: 'dönüş türü (int)' },
    { id: 'S8', soru: 'Tam 24 saat kalan ne öder?', cevap: 'Bir gün: 250. Bir dakika fazlası ikinci gün.', madde: 4, maddeler: [4], ogretim: 'gün sınırı (1.440)' }
  ],
  /** Keskin Göz (+50 XP): hazır soru yok; oyuncu serbest metinle 119/120 anomalisini sorarsa tetiklenir. */
  keskinGoz: {
    soru: '119 dakika 200 TL ama 120 dakika 80 TL, bu doğru mu?',
    cevap: 'Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle.',
    madde: 6, xp: 50, rozet: 'keskin-goz',
    tetik: 'Aynı mesajda 119 ve 120 sayıları geçer ya da "uzun kalan daha az ödüyor" anlamı bulunur.',
    ustaNotu: 'Müşterinin kararına saygı duy; ama soruyu sorman doğruydu.'
  },
  /** Savunma: Kurul oyuncunun kodunda `satirIpucu` (regex) ile eşleşen İLK satırı seçer; eşleşme yoksa D1'in genel sürümü sorulur. */
  savunmaSorulari: [
    { id: 'D1', soru: '121 dakika neden 120 TL? Hangi satır belirliyor?', satirIpucu: '(<=|<)\\s*360|\\*\\s*40', satirAciklama: 'dilimi seçen (`dakika <= 360`) ya da ücreti veren (`saat * 40`) satır',
      genelSoru: 'Kodun 121 için kaç TL döndürüyor ve bu sayıyı hangi ifade ya da tablo satırı belirliyor?',
      anahtarlar: ['2. dilim|ikinci dilim|120 ile 360|120–360|2-6|2–6|360', '3|üç|başlayan saat|3. saat', '40', '120', 'dakika <= 360|saat * 40|dilimi seç|dilimi belirl'],
      ornekIyiCevap: "121 dakika 120'den büyük ve 360'tan küçük olduğu için 2. dilimde. Bu dilimde ücret başlayan saat × 40. 121 dakika 2 saati bir dakika geçtiği için 3. saat başlamış sayılıyor: (121 + 59) / 60 = 3. Yani 3 × 40 = 120. Dilimi seçen satır `if (dakika <= 360)`, ücreti veren satır `return saat * 40;`.",
      zayifCevap: 'Test böyle istiyor.' },
    { id: 'D2', soru: '`(dakika + 59) / 60` ne işe yarıyor? Neden 59?', satirIpucu: '\\+\\s*59', satirAciklama: 'başlayan saati hesaplayan `(dakika + 59) / 60` satırı',
      genelSoru: 'Dakikayı başlayan saate çeviren ifade hangisi ve neden küsurat bir sonraki saate sayılıyor?',
      anahtarlar: ['tam sayı bölmesi|tam sayı|küsurat|keser|atar|attığı|ondalık', '59', 'yukarı yuvarla|sonraki saat|başlayan saat|taşı|bir sonraki|artığı|fazlalık', '60|61|örnek'],
      ornekIyiCevap: "Tam sayı bölmesi küsuratı atar, ben ise artan 1 dakika bile olsa bir sonraki saati saymak istiyorum. 59 eklersem 60'ın tam katlarında sonuç değişmez, bir fazlasında yükselir: (60 + 59) / 60 = 1, (61 + 59) / 60 = 2. 60 ekleseydim 60 dakika da 2 saat çıkardı.",
      zayifCevap: 'Saati hesaplıyor.' },
    { id: 'D3', soru: '119 dakika 200 TL ama 120 dakika 80 TL. Kodunda bunu hangi satır sağlıyor?', satirIpucu: '<\\s*120', satirAciklama: '1. dilimi ayıran `dakika < 120` satırı',
      genelSoru: 'Kodun 119 için kaç, 120 için kaç TL döndürüyor ve bu farkı hangi satır yaratıyor?',
      anahtarlar: ['dakika < 120|< 120|1. dilim|ilk dilim|2 saatten az', '119', '120', '200|2 × 100|2 x 100|100|80|40', 'bilinçli|müşteri|madde 6|kampanya|karar'],
      ornekIyiCevap: "119 dakika `dakika < 120` koşuluna giriyor, yani 1. dilim: başlayan saat 2, 2 × 100 = 200. 120 dakika bu koşula girmiyor, 2. dilimin alt sınırı: 2 × 40 = 80. Hasan Abi bunu bilinçli istedi, sözleşmenin 6. maddesi.",
      zayifCevap: 'Kodda hata var, 120 dakika daha ucuz olmamalı.' },
    { id: 'D4', soru: '1.440 dakika ile 1.441 dakika arasında kodun davranışı nasıl değişiyor?', satirIpucu: '1439|1440', satirAciklama: 'başlayan günü hesaplayan `(dakika + 1439) / 1440` satırı',
      genelSoru: 'Kodun 1.440 ve 1.441 dakika için kaç gün hesaplıyor ve hangi ifade bunu belirliyor?',
      anahtarlar: ['1440|1.440', '1441|1.441', 'gün', '1439', 'başlayan gün|yukarı yuvarla|ikinci gün|2 gün|iki gün', '250|500'],
      ornekIyiCevap: '(1440 + 1439) / 1440 = 1, yani 1 gün, 250 TL. (1441 + 1439) / 1440 = 2, ikinci gün başladı, 500 TL. 1439 eklemek, saat için 59 eklemenin günlük hâli.',
      zayifCevap: '1441 için de 250 öder.' },
    { id: 'D5', soru: '`dakika <= 0` satırını silsen 0 dakika için ne döner? Satır neden duruyor?', satirIpucu: '<=\\s*0', satirAciklama: 'sıfır ve negatif girdiyi karşılayan `dakika <= 0` satırı',
      genelSoru: 'Kodun 0 dakika için ne döndürüyor ve bu sonucu hangi satır belirliyor?',
      anahtarlar: ['0|sıfır', 'saat = 0|(0 + 59) / 60|0 × 100|yine 0|değişmez|aynı', 'negatif|eksi|koruma|güvenlik|niyet|sözleşme|girdi ≥ 0|girdi >= 0|madde 1'],
      ornekIyiCevap: "Silsem de 0 dönerdi: saat = (0 + 59) / 60 = 0, 0 × 100 = 0. Satır sözleşmedeki 'girdi ≥ 0' varsayımını koda yazıyor; negatif bir kayıt gelirse eksi ücret hesaplamak yerine 0 döndürüyor.",
      zayifCevap: 'Silersem program çöker.' }
  ],
  /** İpucu merdiveni (B5 §3.9, tam metin): Pusula → Fener → Taslak → Örnek. Ücretsiz, sınırsız, AI maliyeti yok. */
  ipuclari: {
    pusula: "Bu iş emrinde üç ayrı iş var: (1) dakikayı 'başlayan saat'e çevirmek, (2) süreye göre tarife dilimini seçmek, (3) dilimin birim fiyatıyla çarpmak. Önce yalnızca ilkini çöz: 61 dakika kaç başlayan saattir? 120 dakika? 121 dakika?",
    fener: "Dilimi yuvarlanmış saat değil, ham dakika belirler (Sözleşme madde 2): 119 dakika hâlâ '2 saatten az', 120 dakika artık '2–6 saat'. Başlayan saat için Ders 1.2'deki kalıbı kullan: tam sayı bölmesinden önce bölenin bir eksiğini ekle. 24 saatten sonrası için aynı kalıp 1440 ile gerekir.",
    taslak: `dakika 0 veya altındaysa -> 0 dön
saat = ___   (başlayan saat, Ders 1.2 kalıbı)
dakika < 120 ise -> saat x ___
dakika <= 360 ise -> saat x ___
aksi halde: gun = ___   (başlayan gün) -> gun x ___`,
    ornek: `// Benzer ama farklı bir problem — Bisiklet kiralama:
// 45 dakikadan az: başlayan her 15 dakika 10 TL; 45–180 dakika (sınırlar dâhil): başlayan her 30 dakika 15 TL;
// 180 dakikayı aşan: başlayan gün × 120 TL.
public static int BisikletUcreti(int dakika)
{
    if (dakika <= 0) return 0;
    if (dakika < 45)   return (dakika + 14) / 15 * 10;
    if (dakika <= 180) return (dakika + 29) / 30 * 15;
    return (dakika + 1439) / 1440 * 120;
}`
  },
  /** Müfettiş kategorileri (B5 §7.1). `aralik` = [min, max] dakika (max null: sonsuz). */
  kategoriler: [
    { id: 'hemen-cikanlar', ad: 'Girip hemen çıkanlar', aralik: [0, 5] }, { id: 'iki-saatten-az', ad: '2 saatten az kalanlar', aralik: [6, 99] },
    { id: 'iki-saat-civari', ad: '2 saat civarı kalanlar', aralik: [100, 140] }, { id: 'iki-alti-arasi', ad: '2–6 saat arası kalanlar', aralik: [141, 340] },
    { id: 'alti-saat-civari', ad: '6 saat civarı kalanlar', aralik: [341, 380] }, { id: 'gunluk-tarife', ad: '6–24 saat arası kalanlar', aralik: [381, 1399] },
    { id: 'bir-gun-civari', ad: '24 saat civarı kalanlar', aralik: [1400, 1480] }, { id: 'gunu-asanlar', ad: '24 saati aşanlar', aralik: [1481, null] }
  ],
  /** Şikâyet balonları: kategori → "fazla ücret" balonu (gerçek > beklenen). Girdi/miktar söylenmez. Yön ve diğer türler için `sikayetlerEksik`, `sikayetIstisna`, `sikayetZamanAsimi`. */
  sikayetler: {
    'hemen-cikanlar': 'Bir müşteri: "girip hemen çıkan müşteriler için fazla ücret ödedim."',
    'iki-saatten-az': 'Bir müşteri: "2 saatten az kalanlar için fazla ücret ödedim."',
    'iki-saat-civari': 'Bir müşteri: "2 saat civarı kalanlar için fazla ücret ödedim."',
    'iki-alti-arasi': 'Bir müşteri: "2–6 saat arası kalanlar için fazla ücret ödedim."',
    'alti-saat-civari': 'Bir müşteri: "6 saat civarı kalanlar için fazla ücret ödedim."',
    'gunluk-tarife': 'Bir müşteri: "6–24 saat arası kalanlar için fazla ücret ödedim."',
    'bir-gun-civari': 'Bir müşteri: "24 saat civarı kalanlar için fazla ücret ödedim."',
    'gunu-asanlar': 'Bir müşteri: "24 saati aşanlar için fazla ücret ödedim."'
  },
  sikayetlerEksik: {
    'hemen-cikanlar': 'Bir müşteri: "girip hemen çıkan müşteriler için ücret eksik hesaplanmış."',
    'iki-saatten-az': 'Bir müşteri: "2 saatten az kalanlar için ücret eksik hesaplanmış."',
    'iki-saat-civari': 'Bir müşteri: "2 saat civarı kalanlar için ücret eksik hesaplanmış."',
    'iki-alti-arasi': 'Bir müşteri: "2–6 saat arası kalanlar için ücret eksik hesaplanmış."',
    'alti-saat-civari': 'Bir müşteri: "6 saat civarı kalanlar için ücret eksik hesaplanmış."',
    'gunluk-tarife': 'Bir müşteri: "6–24 saat arası kalanlar için ücret eksik hesaplanmış."',
    'bir-gun-civari': 'Bir müşteri: "24 saat civarı kalanlar için ücret eksik hesaplanmış."',
    'gunu-asanlar': 'Bir müşteri: "24 saati aşanlar için ücret eksik hesaplanmış."'
  },
  sikayetIstisna: 'Bariyer ekranı: "2 saat civarı kalanlar için sistem hata verdi."',
  sikayetZamanAsimi: 'Bariyer ekranı: "2 saat civarı kalanlar için cevap gelmedi."',
  /** Yaygın öğrenci hataları (B5 §3.8, 13 hata; kalan test kümeleri dotnet ile ölçülmüştür). `tamKod` editöre yüklenebilir. */
  'yaygınHatalar': [
    D_opHata('E1', 'Yukarı yuvarlama yok', 'int saat = dakika / 60;', 'if (dakika <= 0) return 0;\nint saat = dakika / 60;\nif (dakika < 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nint gun = (dakika + 1439) / 1440;\nreturn gun * 250;',
      ['A1', 'A2', 'A4'], ['G2', 'G3', 'G5', 'G7'], 100, 'Saat zaten dakikanın 60\'a bölümü', "61 dakikada saat kaç çıkıyor? Hasan Abi \"başlayan saat\" demişti; başlayan ne demek?"),
    D_opHata('E2', 'Ceiling ama bölme önce tam sayıda', 'int saat = (int)Math.Ceiling((double)(dakika / 60));', 'if (dakika <= 0) return 0;\nint saat = (int)Math.Ceiling((double)(dakika / 60));\nif (dakika < 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nint gun = (int)Math.Ceiling((double)(dakika / 1440));\nreturn gun * 250;',
      ['A1', 'A2', 'A4', 'A5', 'A6'], ['G2', 'G3', 'G5', 'G7', 'G9', 'G10', 'G13', 'G14'], 100, 'Ceiling yukarı yuvarlar, güvendeyim', "Parantezin içindeki bölme hangi türde yapılıyor? Ceiling'e gelen sayı zaten ne?"),
    D_opHata('E3', 'Math.Round kullanmak', 'int saat = (int)Math.Round(dakika / 60.0);', 'if (dakika <= 0) return 0;\nint saat = (int)Math.Round(dakika / 60.0);\nif (dakika < 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nint gun = (int)Math.Round(dakika / 1440.0);\nreturn gun * 250;',
      ['A1', 'A2', 'A4', 'A5', 'A6'], ['G2', 'G9', 'G13', 'G14'], 95.6, 'En yakın saate yuvarlarım', 'Müşteri "en yakın" mı dedi, "başlayan" mı? 30 dakikada Round kaç döndürüyor?'),
    D_opHata('E4', 'Dilimi yuvarlanmış saatle seçmek', 'if (saat < 2) return saat * 100;', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (saat < 2) return saat * 100;\nif (dakika <= 360) return saat * 40;\nint gun = (dakika + 1439) / 1440;\nreturn gun * 250;',
      ['A2'], ['G5'], 51, '2 saatten az = saat < 2', "119 dakikada saat kaç, dakika kaç? Hasan Abi'nin cümlesi hangisine bakıyor?"),
    D_opHata('E5', '2 saat sınırını 1. dilime katmak', 'if (dakika <= 120) return saat * 100;', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (dakika <= 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nint gun = (dakika + 1439) / 1440;\nreturn gun * 250;',
      ['A3'], [], 0, '"2 saatten az", 2 de dâhil olmalı', 'Hasan Abi tam 2 saat için ne demişti? Kartı oku ya da yeniden sor.'),
    D_opHata('E6', '6 saat sınırını dışarıda bırakmak', 'if (dakika < 360) return saat * 40;', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (dakika < 120) return saat * 100;\nif (dakika < 360) return saat * 40;\nint gun = (dakika + 1439) / 1440;\nreturn gun * 250;',
      [], ['G8'], 0, '6 saat günlük dilime girer', 'Tam 6 saat için S3\'ün cevabı kartta yazıyor.'),
    D_opHata('E7', '24 saatten sonrasını hep 250 saymak', 'return 250;', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (dakika < 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nreturn 250;',
      ['A6'], ['G12', 'G13', 'G14'], 100, 'Günlük 250, bitti', '1.441 dakika kaç gün? Kartta Madde 4 ne diyor?'),
    D_opHata('E8', 'Gün hesabında yukarı yuvarlama yok', 'int gun = dakika / 1440;', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (dakika < 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nint gun = dakika / 1440;\nreturn gun * 250;',
      ['A5', 'A6'], ['G9', 'G10', 'G13', 'G14'], 100, 'Gün = dakika / 1440', '361 dakikada gün kaç çıkıyor? 0 gün kaç TL?'),
    D_opHata('E9', 'Gün için dakika / 1440 + 1', 'int gun = dakika / 1440 + 1;', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (dakika < 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nint gun = dakika / 1440 + 1;\nreturn gun * 250;',
      [], ['G11', 'G12'], 49.8, 'Yukarı yuvarlamanın kolayı: bir ekle', '1.440 dakika kaç gün? "Bir dakika fazlası ikinci gün" demişti; tam gün için?'),
    D_opHata('E10', 'Asgari ücret varsayımı', 'if (dakika < 120) return Math.Max(saat, 1) * 100;', 'int saat = (dakika + 59) / 60;\nif (dakika < 120) return Math.Max(saat, 1) * 100;\nif (dakika <= 360) return saat * 40;\nint gun = (dakika + 1439) / 1440;\nreturn gun * 250;',
      [], ['G1'], 0, 'En az bir saat ödenir', 'S5\'in cevabını oku: aynı dakika çıkan ödemez.'),
    D_opHata('E11', 'Geniş koşulu önce yazmak', 'if (dakika <= 360) …; else if (dakika < 120) …', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (dakika <= 360) return saat * 40;\nelse if (dakika < 120) return saat * 100;\nint gun = (dakika + 1439) / 1440;\nreturn gun * 250;',
      ['A1', 'A2'], ['G2', 'G3', 'G4', 'G5'], 100, 'Koşulların sırası fark etmez', '30 dakikada hangi `if` çalışıyor? Koşulları yukarıdan aşağı izle.'),
    D_opHata('E12', '&& yerine ||', 'if (dakika >= 120 || dakika <= 360) return saat * 40;', 'if (dakika <= 0) return 0;\nint saat = (dakika + 59) / 60;\nif (dakika >= 120 || dakika <= 360) return saat * 40;\nint gun = (dakika + 1439) / 1440;\nreturn gun * 250;',
      ['A1', 'A2', 'A5', 'A6'], ['G2', 'G3', 'G4', 'G5', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14'], 100, 've / veya aynı şey', 'Hangi sayı bu koşulu sağlamaz? 5\'i dene.'),
    D_opHata('E13', 'Açık testleri ezberlemek', 'switch (dakika) { case 30: return 100; … default: return 0; }', 'switch (dakika)\n{\n    case 30: return 100;\n    case 61: return 200;\n    case 120: return 80;\n    case 121: return 120;\n    case 361: return 250;\n    case 1441: return 500;\n    default: return 0;\n}',
      [], ['G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14'], 100, 'Kırmızıyı yeşile çevirmek', 'Müfettiş 59 dakika için ne söyleyecek? Müşteri yalnızca 6 kişi mi?')
  ],
  /** Doğru ama farklı biçimde yazılmış çözümler (B5 §8.3: B switch ifadesi, C tablo, D döngü sayacı, E double+Ceiling, F üçlü koşul). 26/26 geçer. */
  alternatifCozumler: [
    { id: 'B', ad: 'switch ifadesi', kod: D_otoparkSinif('int saat = (dakika + 59) / 60;\nint gun = (dakika + 1439) / 1440;\nreturn dakika switch\n{\n    <= 0 => 0,\n    < 120 => saat * 100,\n    <= 360 => saat * 40,\n    _ => gun * 250\n};') },
    { id: 'C', ad: 'tablo / aralık', kod: `public static class Otopark
{
    private static readonly (int UstSinir, int Birim, int BirimUcret)[] Tarife =
    {
        (119,          60,  100),   // 1. dilim: 1–119 dk, başlayan saat × 100
        (360,          60,   40),   // 2. dilim: 120–360 dk, başlayan saat × 40
        (int.MaxValue, 1440, 250),  // günlük: başlayan gün × 250
    };

    public static int UcretHesapla(int dakika)
    {
        if (dakika <= 0) return 0;
        foreach (var (ust, birim, ucret) in Tarife)
            if (dakika <= ust)
                return (dakika + birim - 1) / birim * ucret;
        return 0; // erişilmez
    }
}` },
    { id: 'D', ad: 'döngü sayacı', kod: D_otoparkSinif('if (dakika <= 0) return 0;\nint birim, ucret;\nif (dakika < 120) { birim = 60; ucret = 100; }\nelse if (dakika <= 360) { birim = 60; ucret = 40; }\nelse { birim = 1440; ucret = 250; }\nint sayac = 0;\nfor (int gecen = 0; gecen < dakika; gecen += birim)\n    sayac++;\nreturn sayac * ucret;') },
    { id: 'E', ad: 'double + Math.Ceiling', kod: D_otoparkSinif('if (dakika <= 0) return 0;\nint saat = (int)Math.Ceiling(dakika / 60.0);\nif (dakika < 120) return saat * 100;\nif (dakika <= 360) return saat * 40;\nreturn (int)Math.Ceiling(dakika / 1440.0) * 250;') },
    { id: 'F', ad: 'iç içe üçlü koşul', kod: `public static class Otopark
{
    public static int UcretHesapla(int dakika) =>
        dakika <= 0 ? 0
        : dakika < 120 ? (dakika + 59) / 60 * 100
        : dakika <= 360 ? (dakika + 59) / 60 * 40
        : (dakika + 1439) / 1440 * 250;
}` }
  ],
  /** Usta Yorumu örnekleri (B5 §3.10): yeşil olmayan (E5) ve tamamı yeşil çözüm. */
  ustaYorumlari: {
    hatali: 'Ayşe, `(dakika + 59) / 60` kalıbıyla başlayan saati doğru saymışsın; işin zor yarısını bitirdin. Henüz değil ama: 120 dakikada kodun 200 TL döndürüyor, Sözleşme Kartı 80 diyor. Sınır satırına dön: tam 2 saat hangi dilimde? `<` ile `<=` arasındaki seçimi iki sayıyı yan yana yazarak yeniden yap.',
    dogru: 'Ayşe, bütün testler yeşil; `(dakika + 59) / 60` kalıbını kendi başına kurman süreç olarak güzel. Eksik: 100, 40 ve 250 sayıları kodun içinde anlamsız duruyor; yarın Hasan Abi fiyatı değiştirirse hepsini aramak zorunda kalırsın. Sonraki adım: bu sayıları müşterinin sözcükleriyle adlandırılmış `const int` değerlere çevir.',
    xp: 20
  }
};
D_otopark.yayginHatalar = D_otopark['yaygınHatalar'];
