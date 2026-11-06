# B5 — İşletmeler & Kod Projeleri Kataloğu (KodKent)

| Alan | Değer |
|---|---|
| Belge id | **B5** |
| Sürüm | v1 (2026-11-02) |
| Rol | Kıdemli C# geliştirici ve programlama görevleri (challenge) tasarımcısı |
| Bağlayıcı kaynaklar | `KANON.md` v1 (§5 işletme kataloğu, §5.1 Otopark sözleşmesi, §8 tipler ve kademeler, §9 AI ve puanlama), `A-vizyon-FINAL.md` (§7 Otopark yolculuğu, §8 ekonomi), `B2-ilerleme-ekonomi.md` (§7 işletme ekonomisi, §8 pasif gelir), `brief/03-ajan-talimati.md` §3 (Challenge Spec alan adları) |
| Kapsam | Challenge Spec formatı ve test harness'ı; tohumlu test üretimi; 20 işletmenin kataloğu (NPC, 77 seviye başlığı, gelir); Otopark L1–L5 tam ayrıntı; Büfe, Manav, Kargo Deposu L1 tam spec; kalan 16 işletmenin (#5–#20) L1'i; "aynı şema, dört yüzey"; Müfettiş şikâyet balonları ve Hata Bildirimi; kopya riskleri ve çözüm çeşitliliği; gerçek `dotnet` çıktısı |
| Kural | KANON ve B2'deki her sayı ve ad aynen kullanılır. Değiştirilmesi önerilen sabitler gövdede "(B5 önerisi)" etiketiyle ayrı tutulur ve **Ek A**'da toplanır; onaylanana kadar KANON geçerlidir. |
| Doğrulama | Bu belgedeki bütün referans çözümler, test beklenenleri, mutasyonlar ve profil sayıları .NET 10 (çalışma zamanı 10.0.8, SDK 10.0.300) ile çalıştırıldı: **229 vaka, 229 geçti**. Ham çıktı §9'dadır; kaynak proje oturumun WORK klasöründe (`dotnet-check/otopark`) durur. |

**Terim notu.** **L** işletmenin kendi seviyesidir (L1–L5); **T** semt zorluk katmanıdır (T1–T4), KANON §10 ve B2 ile aynı. "Açık test" oyuncunun editörde gördüğü, "gizli test" yalnızca **Müfettiş**'in çalıştırdığı, "tohumlu test" oyuncuya ve güne özel üretilen vakadır. "Hakem" test beklenenlerini tutan sunucu süreci, "koşucu" oyuncu kodunu çalıştıran sandbox sürecidir (§1.6). "Referans çözüm" yalnızca sunucudadır; bu belgede içerik tasarımı amacıyla gösterilir ve oyuncuya hiçbir yüzeyde (ipucu dâhil, "Örnek" kademesi başka bir problemdir) çıkmaz.

---

## 0. Yönetici özeti

1. **Challenge Spec** tek bir JSON dosyasıdır: talimat §3'teki 16 üst düzey alan, değişmeyen adlarla (`id` … `odul`). `imza` ve `musteri_istegi` nesnedir; test nesnesi `{id, girdi, beklenen, etiket}`. Otopark L1'in tam örneği §1.4'tedir ve içerik CI doğrulayıcısından 22 kuraldan 22'sini geçti (§1.8).
2. **Test harness'ı: sabit imzalı static metot.** Oyuncu `main` yazmaz; hakem girdiyi koşucuya gönderir, çıktıyı kendi tuttuğu beklenenle karşılaştırır. Beklenenler sandbox'a hiç girmez. `stdin/stdout` yalnızca konsol çıktısı öğreten görevlerde (Meydan Saati tipi) kullanılır (§1.5).
3. **Tohumlu test:** tohum = `SHA-256(oyuncuId | gün | challengeId)` ilk 8 bayt; 6 vaka = 4 "iç" (her dilimden 1) + 2 "sınır" (saat katı, gün katı). 10.000 oyuncuda her küme birbirinden farklı, 20 sabit vakayla çakışmaz, her sette tam bir tam-kat ve bir komşu vaka vardır (§1.7).
4. **Katalog:** 20 işletme, 77 seviye başlığı; fiyat ve L1–L5 geliri B2 §7.1'den **aynen**. Müşteri NPC'lerinin 6'sı mevcut belgelerden (Hasan Abi, Kütüphaneci Ayşe, Kaptan Rıza, Balıkçı Gülsüm, Gümrük Memuru Faruk, Belediye Memuru Nuran), 14'ü B5 önerisidir (§2).
5. **Otopark L1** tam ayrıntılı: 8 hazır soru + 6 maddelik Sözleşme Kartı, 6 açık + 14 gizli + 6 tohumlu test (KANON tablosu birebir), 5 Savunma sorusu, 13 yaygın hata, 4 kademeli ipucu, 8 mutasyon (+ 2 eşdeğer mutant), 6 doğru çözüm biçimi (KANON referansı + 5 alternatif). **L2–L5** her biri en az 4 açık + 3 gizli test ve referans kodla verildi (§3).
6. **Bulgu 1 — sınır hataları gelire yansımaz.** `<` yerine `<=` yazmak (M1) günde yalnızca +2,1 TL oynatır; gelir tavanı bu hatayı göremez, gizli test ve Savunma vazgeçilmezdir (§3.12).
7. **Bulgu 2 — KANON referans çözümü `int` taşar** (`dakika > 2.147.482.208`); üst sınır olarak 10.000.000 dakika önerildi (Ek A).
8. **Bulgu 3 — toplam tavan dengeleyici hatayı ödüllendirir:** B2 §8.2'nin `min(Σoyuncu, Σreferans)` biçimi bu çözüme referans gelirin %95,7'sini verir; araç başına tavan %88,1'e indirir (Ek A).
9. **Müfettiş:** açık testler yeşil olmadan çağrılmaz; sonuç 8 kategorili balondur, girdi asla yazılmaz; günde 10 çağrı önerildi (Ek A).
10. **Hata Bildirimi:** satır 30 + düzeltme 40 + neden 30 (Kurul × 0,30); ≥70 tam, 40–69 yarım, <40 sıfır; Bayt tabanı 40/60/90/120 (B5 önerisi).
11. **Aynı şema, dört yüzey:** üçü "ham girdi kademeyi belirler" şemasını yeniden kurar, Kütüphane aynı soruyu farklı cevapla sorar (artımlı ceza); transfer umulmaz, ölçülür (§6).
12. **KANON ile fark:** Manav L1'in "Döngüler" konusu, Çarşı'da dizi öğretilmediği için L1 koduna değil Ruhsat görevlerine (B4) bağlandı (§4.2).

---

## 1. Challenge Spec formatı

Bir Challenge Spec, bir işletme seviyesinin oyuncuya gösterilen yüzünü (müşteri isteği, sözleşme, iskelet, açık testler) ve sunucudaki hakemin kuralını (gizli testler, tohumlu üreteç, ödül) tek dosyada taşır. Bu bölüm dosyanın şemasını, test koşturma yaklaşımını ve tohumlu vaka kuralını tanımlar; B7 bunları sandbox altyapısına, B3 Savunma ve Usta Yorumu akışlarına bağlar.

### 1.1 Altı tasarım ilkesi

1. **Tek dosya, tek challenge.** `otopark-L1.json`; kimlik biçimi talimat §3'tedir (`isletme-slug` + `-L` + seviye). Dosya içerik deposunda sürümlenir (`otopark-L1.v3.json`); Açılış kaydı hangi sürümle geçildiğini saklar (ayrıntı B7).
2. **Beklenenler türetilir, elle yazılmaz.** Her `beklenen` referans çözümden gelir ve içerik CI her dosyada referansı çalıştırıp farkı reddeder (§1.8). Otopark L1'in 20 sabit vakası ayrıca KANON §5.1 tablosuyla birebir karşılaştırılır.
3. **Beklenenler oyuncu koduna asla girmez.** Hakem yalnızca girdiyi gönderir, koşucu çıktıyı döndürür, karşılaştırma sandbox dışında yapılır (§1.6).
4. **Yazar notu yayın verisi değildir.** Test gerekçeleri, mutasyon kataloğu ve referans çözüm Spec'in dışında, özel pakettedir (`challenge-private`); Spec'te yalnızca hakemin ve istemcinin ihtiyaç duyduğu alanlar bulunur.
5. **Müşteri diliyle yazılır, mühendis diliyle kapanır.** `musteri_istegi.metin` NPC'nin sözleridir (Otopark L1'de KANON §5.1 birebir); `sozlesme_karti` aynı isteğin kabul kriteri hâlidir.
6. **Dil-bağımsız protokol.** `girdi` ve `beklenen` JSON'dur; ikinci bir dil eklendiğinde (KANON: Python, JavaScript… "yakında") aynı Spec kullanılır, yalnızca `imza.tur` ve koşucu değişir.

### 1.2 Alan şeması

Üst düzey alan adları değişmez (talimat §3). Aşağıdaki tablo her alanın tipini ve kuralını verir.

| Alan | Tip | Anlam ve kurallar |
|---|---|---|
| `id` | string | `^[a-z0-9]+(-[a-z0-9]+)*-L[1-5]$`; Türkçe karaktersiz kebab-case slug + seviye. Örn. `otopark-L1`, `bufe-L1`, `kargo-deposu-L1` |
| `isletme` | string | KANON §5 slug'ı (`otopark`, `bufe`, `manav`, `kargo-deposu`, …); `id = isletme + "-L" + seviye` olmalı |
| `seviye` | int, 1–5 | İşletme seviyesi; üst sınır işletmenin L sayısıdır (KANON §5) |
| `baslik` | string, ≤ 60 karakter | İş Emri kartı ve editör sekmesi başlığı |
| `musteri_istegi` | nesne | `{npc, metin, netlestirme}`. `metin` NPC'nin sözleri; `netlestirme = {min_soru, sorular[{id, soru, cevap, madde[]}], keskin_goz?}` (KANON: en az 4 soru) |
| `sozlesme_karti` | dizi, `{madde, kural}` | Gereksinim Netleştirme'nin ürettiği sabit kabul kriterleri. Madde, ancak onu açan soru sorulunca karta yazılır; sorulmayan madde kartta kilitli kalır (§3.2) |
| `imza` | nesne | `{tur, sinif, ad, parametreler[{ad, tip}], donus, metin}`; `tur` ∈ {`static-metot`, `sinif-senaryo`, `konsol-cikti`}; `metin` kanonik C# imzası |
| `iskelet_kod` | string | Editör açılışı. Oyuncu yalnızca `//#BASLA` ile `//#BITIS` arasını düzenler (Monaco salt-okunur aralık işareti) |
| `public_tests[]` | dizi | Açık testler; girdi ve beklenen istemciye gider (KANON: Otopark L1'de 6) |
| `hidden_tests[]` | dizi | Gizli testler; yalnızca hakemde durur. İstemci adedini ve kategori balonunu görür (Otopark L1'de 14) |
| `seeded_tests` | `{kural, adet}` | `kural` üreteç tanımı (§1.7), `adet` KANON'a göre 6 |
| `edge_cases[]` | dizi, `{ad, test_ids[]}` | Yazarın düşündüğü kenar durumları; CI her birinin en az bir geçerli testle kapsandığını doğrular |
| `ipucu_merdiveni` | `{pusula, fener, taslak, ornek}` | Dört kademe, içerik bankası metni; ücretsiz ve sınırsız (KANON §8) |
| `savunma_sorulari[]` | dizi | `{id, soru, satir_deseni, kabul[], ret[], ornek_cevap}`; en az 4. `satir_deseni` Kurul'un oyuncu kodunda satır seçmek için kullandığı düzenli ifadedir |
| `rubrik` | nesne | `{savunma{dogruluk, tamlik, aciklik, esik}, berrak_zihin, usta_yorumu{xp_min, xp_max, gelire_etki}, acilis{kosullar[], deneme_carpani}}` |
| `odul` | `{xp, bayt}` | `xp` KANON §3.3'ten: T1 açılışı 300; yükseltme L2–L5 için 150 / 250 / 400 / 600. `bayt` her zaman 0'dır: Bayt gelirden ve B2 §5.2 ilk-kez bonuslarından akar, Spec'ten değil |

Test nesnesi `{id, girdi, beklenen, etiket}` biçimindedir. `id`: açık testler `A1…`, gizli testler `G1…`, tohumlu vakalar `T1…`. `etiket`: Müfettiş kategorisi slug'ı (§7.1); açık testlerde de doldurulur, böylece tek bir kategori fonksiyonu her vakayı sınıflar.

### 1.3 `girdi` ve `beklenen` biçimleri

`girdi` nesnesinin anahtarları metodun parametre adlarıdır. Tek bir karşılaştırma kuralı vardır: **tür tam eşitlik, ondalık sayısal eşitlik**. İlk dotnet çalıştırmasında `Order.Total` 900,0 döndürdü ve metin karşılaştırması 900 ile kırmızı verdi; bu yüzden `decimal` her zaman sayısal karşılaştırılır (ölçek önemsizdir).

| Tür | `girdi` | `beklenen` | Karşılaştırma |
|---|---|---|---|
| tamsayı | `{"dakika": 120}` | `80` | tam eşitlik |
| ondalık | `{"fiyat": 12.35, "verilen": 20}` | `"1x5 2x1 …"` ya da sayı | `decimal` sayısal; `double` kullanılmaz |
| metin | `{"siparis": "hamsi:2,levrek:1"}` | `"…"` | ordinal, kültürden bağımsız |
| mantıksal | `{"plaka": "34 ABC 123"}` | `true` | eşitlik |
| liste | `{"raflar": [5, 0, 12]}` | `[2, 5]` | eleman eleman, sıra önemli |
| enum | `{"tur": "Engelli"}` ya da `{"tur": 7}` | ad ya da sayı | sayı, tanımsız değer testi içindir |
| tarih | `{"giris": "2026-03-10T23:00"}` | ISO-8601 | `DateTime`, saniye 0 |
| istisna | herhangi | `{"hata": "ArgumentOutOfRangeException", "parametre": "dakika"}` | tip + parametre adı; ileti metni karşılaştırılmaz |
| senaryo | `{"kapasite": 2, "kuyruk": 1, "islemler": ["G:A", "C:A"]}` | `{"sonuclar": [...], "iceride": 2, "kuyruk": [...]}` | alan alan |

### 1.4 Tam örnek: `otopark-L1`

Aşağıdaki dosya Otopark L1'in tamamıdır. §1.8'deki 22 doğrulama kuralının hepsinden geçmiştir (çıktı: §9).

```json
{
  "id": "otopark-L1",
  "isletme": "otopark",
  "seviye": 1,
  "baslik": "Otopark Ücret Sistemi",
  "musteri_istegi": {
    "npc": "Hasan Abi",
    "metin": "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum.",
    "netlestirme": {
      "min_soru": 4,
      "sorular": [
        { "id": "S1", "soru": "1 saat 10 dakika kalan ne öder?", "cevap": "Başlayan saat tam sayılır; 2 saatten az kaldı: 200.", "madde": [2, 3] },
        { "id": "S2", "soru": "Tam 2 saat kalan ne öder?", "cevap": "O artık 2–6 dilimi: 2 × 40 = 80.", "madde": [2] },
        { "id": "S3", "soru": "Tam 6 saat kalan ne öder?", "cevap": "Hâlâ 2–6 dilimi: 240; 6'yı geçen güne girer.", "madde": [2] },
        { "id": "S4", "soru": "24 saati aşan ne öder?", "cevap": "Her başlayan gün 250.", "madde": [4] },
        { "id": "S5", "soru": "Girip aynı dakika çıkan ne öder?", "cevap": "Ödemez. Bariyer eksi süre göndermez.", "madde": [1] },
        { "id": "S6", "soru": "Süreyi nasıl göndereceksin: dakika mı, saat mi, kesirli mi?", "cevap": "Dakika, tam sayı. Kesir yok.", "madde": [1, 5] },
        { "id": "S7", "soru": "Ücret kuruşlu olabilir mi?", "cevap": "TL, tam sayı. Kuruş yok.", "madde": [5] },
        { "id": "S8", "soru": "Tam 24 saat kalan ne öder?", "cevap": "Bir gün: 250. Bir dakika fazlası ikinci gün.", "madde": [4] }
      ],
      "keskin_goz": {
        "madde": 6,
        "tetik": "serbest metin: aynı mesajda 119 ve 120 geçer ya da 'uzun kalan daha az ödüyor' anlamı (Haiku sınıflandırıcı, güven >= 0,8)",
        "cevap": "Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle.",
        "odul": { "rozet": "Keskin Göz", "xp": 50 }
      }
    }
  },
  "sozlesme_karti": [
    { "madde": 1, "kural": "Girdi dakika cinsinden tam sayı, >= 0 (bariyer negatif göndermez); 0 -> 0 TL" },
    { "madde": 2, "kural": "Dilimi ham kalış süresi belirler: dakika < 120 -> 1. dilim; 120 <= dakika <= 360 -> 2. dilim (sınırlar dâhil); dakika > 360 -> günlük" },
    { "madde": 3, "kural": "Başlayan saat tam sayılır: saat = ceil(dakika / 60); 1. dilim saat x 100, 2. dilim saat x 40" },
    { "madde": 4, "kural": "24 saati aşan kalış: her başlayan gün 250 (gun = ceil(dakika / 1440), gun x 250)" },
    { "madde": 5, "kural": "İmza: public static int Otopark.UcretHesapla(int dakika); dönüş TL, tam sayı" },
    { "madde": 6, "kural": "Anomali (119 -> 200, 120 -> 80) müşterinin bilinçli kararıdır; fark eden oyuncu Keskin Göz (+50 XP)" }
  ],
  "imza": {
    "tur": "static-metot",
    "sinif": "Otopark",
    "ad": "UcretHesapla",
    "parametreler": [ { "ad": "dakika", "tip": "int" } ],
    "donus": "int",
    "metin": "public static int Otopark.UcretHesapla(int dakika)"
  },
  "iskelet_kod": "// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi\npublic static class Otopark\n{\n    // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)\n    // dönüş: ödenecek ücret, TL (tam sayı)\n    public static int UcretHesapla(int dakika)\n    {\n        //#BASLA\n        // kodun buraya\n        //#BITIS\n    }\n}\n",
  "public_tests": [
    { "id": "A1", "girdi": { "dakika": 30 },   "beklenen": 100, "etiket": "iki-saatten-az" },
    { "id": "A2", "girdi": { "dakika": 61 },   "beklenen": 200, "etiket": "iki-saatten-az" },
    { "id": "A3", "girdi": { "dakika": 120 },  "beklenen": 80,  "etiket": "iki-saat-civari" },
    { "id": "A4", "girdi": { "dakika": 121 },  "beklenen": 120, "etiket": "iki-saat-civari" },
    { "id": "A5", "girdi": { "dakika": 361 },  "beklenen": 250, "etiket": "alti-saat-civari" },
    { "id": "A6", "girdi": { "dakika": 1441 }, "beklenen": 500, "etiket": "bir-gun-civari" }
  ],
  "hidden_tests": [
    { "id": "G1",  "girdi": { "dakika": 0 },      "beklenen": 0,     "etiket": "hemen-cikanlar" },
    { "id": "G2",  "girdi": { "dakika": 1 },      "beklenen": 100,   "etiket": "hemen-cikanlar" },
    { "id": "G3",  "girdi": { "dakika": 59 },     "beklenen": 100,   "etiket": "iki-saatten-az" },
    { "id": "G4",  "girdi": { "dakika": 60 },     "beklenen": 100,   "etiket": "iki-saatten-az" },
    { "id": "G5",  "girdi": { "dakika": 119 },    "beklenen": 200,   "etiket": "iki-saat-civari" },
    { "id": "G6",  "girdi": { "dakika": 180 },    "beklenen": 120,   "etiket": "iki-alti-arasi" },
    { "id": "G7",  "girdi": { "dakika": 359 },    "beklenen": 240,   "etiket": "alti-saat-civari" },
    { "id": "G8",  "girdi": { "dakika": 360 },    "beklenen": 240,   "etiket": "alti-saat-civari" },
    { "id": "G9",  "girdi": { "dakika": 720 },    "beklenen": 250,   "etiket": "gunluk-tarife" },
    { "id": "G10", "girdi": { "dakika": 1439 },   "beklenen": 250,   "etiket": "bir-gun-civari" },
    { "id": "G11", "girdi": { "dakika": 1440 },   "beklenen": 250,   "etiket": "bir-gun-civari" },
    { "id": "G12", "girdi": { "dakika": 2880 },   "beklenen": 500,   "etiket": "gunu-asanlar" },
    { "id": "G13", "girdi": { "dakika": 2881 },   "beklenen": 750,   "etiket": "gunu-asanlar" },
    { "id": "G14", "girdi": { "dakika": 100000 }, "beklenen": 17500, "etiket": "gunu-asanlar" }
  ],
  "seeded_tests": {
    "kural": {
      "uretec": "otopark-L1-v1",
      "tohum": "SHA-256(oyuncuId + '|' + yyyy-MM-dd + '|' + challengeId) ilk 8 bayt -> uint64 (little-endian)",
      "prng": "SplitMix64; ret örnekleme (yasak değer gelirse yeniden çek)",
      "katmanlar": [
        { "id": "T1", "ad": "dilim-1-ic",   "aralik": [2, 118],      "dislanan": "saat-komsulari + 20 sabit vaka" },
        { "id": "T2", "ad": "dilim-2-ic",   "aralik": [122, 358],    "dislanan": "saat-komsulari + 20 sabit vaka" },
        { "id": "T3", "ad": "gunluk-ic",    "aralik": [381, 1399],   "dislanan": "saat-komsulari + 20 sabit vaka" },
        { "id": "T4", "ad": "cok-gunlu-ic", "aralik": [1443, 20000], "dislanan": "gun-komsulari + 20 sabit vaka" },
        { "id": "T5", "ad": "saat-siniri",  "taban": [240, 300],     "sapma": [-1, 0, 1] },
        { "id": "T6", "ad": "gun-siniri",   "katlar": [3, 4, 5, 7, 10], "carpan": 1440, "sapma": [-1, 0, 1] }
      ],
      "garanti": [
        "6 değer birbirinden farklı",
        "20 sabit vakadan hiçbiriyle çakışmaz",
        "T5 ve T6'dan tam biri tam kat (sapma 0), diğeri komşu (-1 ya da +1)",
        "aynı (oyuncuId, gün, challengeId) -> aynı küme; küme ilk çalıştırmada Redis'e yazılır, gün boyu sabit"
      ]
    },
    "adet": 6
  },
  "edge_cases": [
    { "ad": "sıfır dakika", "test_ids": ["G1"] },
    { "ad": "en küçük pozitif kalış", "test_ids": ["G2"] },
    { "ad": "tam saat katı (1. ve 2. dilimde)", "test_ids": ["G4", "G6"] },
    { "ad": "anomali noktası 119/120", "test_ids": ["G5", "A3"] },
    { "ad": "6 saat sınırı ve komşuları", "test_ids": ["G7", "G8", "A5"] },
    { "ad": "tam gün katı", "test_ids": ["G11", "G12"] },
    { "ad": "günü aşan ilk dakika", "test_ids": ["A6", "G13"] },
    { "ad": "büyük girdi", "test_ids": ["G14"] }
  ],
  "ipucu_merdiveni": {
    "pusula": "Bu iş emrinde üç ayrı iş var: (1) dakikayı 'başlayan saat'e çevirmek, (2) süreye göre tarife dilimini seçmek, (3) dilimin birim fiyatıyla çarpmak. Önce yalnızca ilkini çöz: 61 dakika kaç başlayan saattir? 120 dakika? 121 dakika?",
    "fener": "Dilimi yuvarlanmış saat değil, ham dakika belirler (Sözleşme madde 2): 119 dakika hâlâ '2 saatten az', 120 dakika artık '2–6 saat'. Başlayan saat için Ders 1.2'deki kalıbı kullan: tam sayı bölmesinden önce bölenin bir eksiğini ekle. 24 saatten sonrası için aynı kalıp 1440 ile gerekir.",
    "taslak": "dakika 0 veya altındaysa -> 0 dön\nsaat = ___   (başlayan saat, Ders 1.2 kalıbı)\ndakika < 120 ise -> saat x ___\ndakika <= 360 ise -> saat x ___\naksi halde: gun = ___   (başlayan gün) -> gun x ___",
    "ornek": "Benzer ama farklı bir iş: bisiklet kiralama. 45 dakikadan az: başlayan her 15 dakika 10 TL; 45–180 dakika (sınırlar dâhil): başlayan her 30 dakika 15 TL; 180 dakikayı aşan: başlayan gün x 120 TL.\npublic static int BisikletUcreti(int dakika)\n{\n    if (dakika <= 0) return 0;\n    if (dakika < 45)   return (dakika + 14) / 15 * 10;\n    if (dakika <= 180) return (dakika + 29) / 30 * 15;\n    return (dakika + 1439) / 1440 * 120;\n}"
  },
  "savunma_sorulari": [
    {
      "id": "D1",
      "soru": "121 dakika neden 120 TL? Hangi satır belirliyor?",
      "satir_deseni": "(<=|<)\\s*360|\\*\\s*40",
      "kabul": ["121'in 2. dilimde (120–360) olduğunu söyler", "başlayan saatin 3 olduğunu gösterir", "3 x 40 = 120 hesabını yapar"],
      "ret": ["'Test böyle istiyor' (kodu açıklamıyor)", "dilimi yuvarlanmış saatten bulduğunu söyler"],
      "ornek_cevap": "121 dakika 120'den büyük ve 360'tan küçük olduğu için 2. dilimde. Bu dilimde ücret başlayan saat x 40. 121 dakika, 2 saati bir dakika geçtiği için 3. saat başlamış sayılıyor: (121 + 59) / 60 = 3. Yani 3 x 40 = 120. Dilimi seçen satır `if (dakika <= 360)`, ücreti veren satır `return saat * 40;`."
    },
    {
      "id": "D2",
      "soru": "`(dakika + 59) / 60` ne işe yarıyor? Neden 59?",
      "satir_deseni": "\\+\\s*59",
      "kabul": ["tam sayı bölmesinin küsuratı attığını söyler", "59 eklemenin artığı bir sonraki saate taşıdığını (yukarı yuvarlama) açıklar", "bir örnek verir (60 -> 1, 61 -> 2)"],
      "ret": ["'Saati hesaplıyor' deyip yuvarlamayı anlatmaz", "60 yerine neden 59 olduğunu açıklayamaz"],
      "ornek_cevap": "Tam sayı bölmesi küsuratı atar, ben ise artan 1 dakika bile olsa bir sonraki saati saymak istiyorum. 59 eklersem 60'ın tam katlarında sonuç değişmez, bir fazlasında yükselir: (60 + 59) / 60 = 1, (61 + 59) / 60 = 2. 60 ekleseydim 60 dakika da 2 saat çıkardı."
    },
    {
      "id": "D3",
      "soru": "119 dakika 200 TL ama 120 dakika 80 TL. Kodunda bunu hangi satır sağlıyor?",
      "satir_deseni": "<\\s*120",
      "kabul": ["`dakika < 120` satırını gösterir", "anomaliyi müşterinin kararı olarak bilir (Sözleşme madde 6)", "farkı oluşturan şeyin 100 TL ile 40 TL birim fiyatı olduğunu söyler"],
      "ret": ["119'un neden 200 olduğunu hesaplayamaz", "'Kodda hata var' diyerek sözleşmeyi suçlar"],
      "ornek_cevap": "119 dakika `dakika < 120` koşuluna giriyor, yani 1. dilim: başlayan saat 2, 2 x 100 = 200. 120 dakika bu koşula girmiyor, 2. dilimin alt sınırı: 2 x 40 = 80. Hasan Abi bunu bilinçli istedi, sözleşmenin 6. maddesi."
    },
    {
      "id": "D4",
      "soru": "1.440 dakika ile 1.441 dakika arasında kodun davranışı nasıl değişiyor?",
      "satir_deseni": "1439|1440",
      "kabul": ["1440 için gün sayısının 1, 1441 için 2 olduğunu hesaplar", "1439 eklemenin başlayan gün yuvarlaması olduğunu söyler"],
      "ret": ["gün hesabını saat hesabıyla karıştırır", "1441 için 250 sonucunu savunur"],
      "ornek_cevap": "(1440 + 1439) / 1440 = 1, yani 1 gün, 250 TL. (1441 + 1439) / 1440 = 2, ikinci gün başladı, 500 TL. 1439 eklemek, saat için 59 eklemenin günlük hâli."
    },
    {
      "id": "D5",
      "soru": "`dakika <= 0` satırını silsen 0 dakika için ne döner? Satır neden duruyor?",
      "satir_deseni": "<=\\s*0",
      "kabul": ["0 için saat = 0 ve 0 x 100 = 0 olduğunu hesaplar", "satırın negatif girdiye karşı koruma ve niyet belirtme olduğunu söyler"],
      "ret": ["'Silersem program çöker' der (yanlış)"],
      "ornek_cevap": "Silsem de 0 dönerdi: saat = (0 + 59) / 60 = 0, 0 x 100 = 0. Satır sözleşmedeki 'girdi >= 0' varsayımını koda yazıyor; negatif bir kayıt gelirse eksi ücret hesaplamak yerine 0 döndürüyor."
    }
  ],
  "rubrik": {
    "savunma": { "dogruluk": 50, "tamlik": 30, "aciklik": 20, "esik": 70 },
    "berrak_zihin": 0.15,
    "usta_yorumu": { "xp_min": 10, "xp_max": 30, "gelire_etki": false },
    "acilis": { "kosullar": ["public_tests 6/6", "hidden_tests 14/14", "seeded_tests 6/6", "savunma >= 70"], "deneme_carpani": 0.5 }
  },
  "odul": { "xp": 300, "bayt": 0 }
}
```

Dört not. **Birincisi**, `musteri_istegi.metin` KANON §5.1'in ve `A-vizyon-FINAL.md` §7'nin Hasan Abi cümlesidir; tek karakter değişmemiştir. **İkincisi**, `sozlesme_karti` altı maddedir ve KANON tablosuyla sözcük sözcük aynıdır (JSON'da "≥" ve "→" işaretleri ASCII karşılıklarıyla yazıldı: `>=`, `->`). **Üçüncüsü**, `etiket` değerleri §7.1'deki sekiz kategoridir ve CI, her etiketin `Kategori.Bul(dakika)` fonksiyonuyla aynı çıktığını doğrular. **Dördüncüsü**, `odul.bayt` sıfırdır: İş Emri'nin ödülü Açılış XP'si (300) ve gelirdir; Açılış Kurdelesi'nin 100 B'si B2 §5.2'de sunucu kuralıdır, Spec alanı değildir.

### 1.5 Test harness yaklaşımı ve karar

İki aday vardı: **A — sabit imzalı static metot** (oyuncu metodu yazar, harness çağırır; xUnit benzeri) ve **B — stdin/stdout** (oyuncu `Main` yazar, harness girdiyi standart girdiden verir, standart çıktıyı karşılaştırır).

| Ölçüt | A. Static metot | B. stdin/stdout |
|---|---|---|
| Oyuncunun yazdığı | Yalnızca metot gövdesi | `Main`, `Console.ReadLine`, ayrıştırma, biçimleme ve metot |
| Başlangıç yükü (15 yaş) | Düşük: "imza sözleşmedir" (Ders 1.4) | Yüksek: girdi ayrıştırma asıl konunun önüne geçer |
| İmza denetimi | Derleme zamanında; hata Türkçe hata tablosundan gelir | Yok; yanlış biçim "yanlış çıktı" gibi görünür |
| İstisna ve tür testi | Doğrudan (tip + parametre adı) | Yapılamaz; çıkış kodu ve hata metni kırılgandır |
| Zengin tipler (`List`, `enum`, `DateTime`, sınıf) | Doğrudan | Her tip için metinsel serileştirme gerekir |
| Kültür ve biçim | Etkisiz | Ondalık ayracı, satır sonu, boşluk farkı sahte kırmızı üretir |
| Hız | Tek süreç, 26 vaka milisaniyeler | Vaka başına süreç ya da döngü |
| Zaman aşımı | Vaka bazında günlük, toplam 10 sn (KANON §9) | Süreç bazında; hangi vakanın takıldığı belirsiz |
| Sızıntı yüzeyi | Beklenenler sandbox'a girmez | Girdi ve çıktı aynı kanaldan geçer; yazdırma ile test ezberlemek kolaylaşır |
| Gerçek dünya karşılığı | Servis metodu, birim testi | Komut satırı betiği |
| Öğretici değer | Fonksiyon sözleşmesi; Finans'taki unit test kültürüne köprü | `Console` giriş çıkışı (Ders 1.1'de zaten var) |

**Karar: A.** Tüm İş Emri'leri `static-metot` (tek çağrı) ya da `sinif-senaryo` (durumlu sınıf, işlem dizisi) olarak kurulur. B yalnızca `imza.tur = "konsol-cikti"` görevlerinde kalır: Meydan Saati gibi `Console.WriteLine` öğreten görevlerde koşucu `Console.SetOut` ile çıktıyı yakalar ve satır satır karşılaştırır. Gerekçenin özeti: B, 13–25 yaş yeni başlayanların dikkatini "kodun işi" yerine "girdiyi ayrıştırmaya" harcatır; A ise Hasan Abi'nin istediği şeyi, yani bir hesaplama sözleşmesini doğrudan modeller.

### 1.6 Hakem–koşucu ayrımı ve harness iskeleti

Üretimde iki süreç vardır. *Koşucu*, gVisor sandbox'ında (ağ yok, salt okunur dosya sistemi, 256 MB / 2 vCPU / 10 sn; KANON §9) oyuncu kodunu Roslyn ile bellek içinde derler ve yalnızca `{id, girdi}` ikililerini alır, `{id, cikti | hata | sure_ms}` döndürür. *Hakem*, sandbox dışında beklenenleri tutar ve karşılaştırır. Oyuncu kodu `beklenen` değerlerini ve henüz çağrılmamış girdileri göremez; çağrıldığı anda yalnızca o vakanın girdisini parametre olarak alır. Sandbox'ta ağ ve dosya yazma yoktur, koşucudan çıkan tek kanal hakemin okuduğu dönüş değeridir; bu yüzden bir vakanın girdisi oyuncu kodundan dışarı sızamaz ve koşucuda okunacak bir beklenen yoktur. Aşağıdaki iskelet anlaşılırlık için ikisini tek yöntemde gösterir.

```csharp
public static List<Sonuc> Kos(JsonElement spec, Func<int, int> oyuncu, string oyuncuId, DateOnly gun)
{
    var l = new List<Sonuc>();
    void Tek(string id, string tur, int dakika, int beklenen)
    {
        string gercek; bool ok; string yon = "";
        try
        {
            int g = oyuncu(dakika);
            gercek = g.ToString();
            ok = g == beklenen;
            if (!ok) yon = g > beklenen ? "fazla" : "eksik";
        }
        catch (Exception e) { gercek = e.GetType().Name; ok = false; yon = "hata"; }
        l.Add(new Sonuc(id, tur, dakika, beklenen, gercek, ok, Kategori.Bul(dakika), yon));
    }
    foreach (var t in spec.GetProperty("public_tests").EnumerateArray())
        Tek(t.GetProperty("id").GetString()!, "acik", t.GetProperty("girdi").GetProperty("dakika").GetInt32(), t.GetProperty("beklenen").GetInt32());
    foreach (var t in spec.GetProperty("hidden_tests").EnumerateArray())
        Tek(t.GetProperty("id").GetString()!, "gizli", t.GetProperty("girdi").GetProperty("dakika").GetInt32(), t.GetProperty("beklenen").GetInt32());
    foreach (var t in Tohumlu.Uret(oyuncuId, gun))                       // beklenen: sunucudaki referans çözüm
        Tek(t.Id, "tohumlu", t.Dakika, Otopark.UcretHesapla(t.Dakika));
    return l;
}
```

Beş koşucu kuralı:

1. **Vaka başına koruma.** Her çağrı kendi `try/catch`'indedir; istisna `hata` olarak döner, süreç düşmez.
2. **Satır satır akış.** Her vakadan sonra çıktı yıkanır (`Flush`). 10 sn dolup süreç öldürülürse hakem hangi vakanın takıldığını bilir ve `ZAMAN_ASIMI` yazar; önceki vakalar korunur.
3. **Saf fonksiyon denetimi.** Tüm takım iki kez, ikinci kez karıştırılmış sırayla koşturulur; sonuçlar farklıysa oyuncu kodu `static` alanla vakalar arası durum taşıyor demektir ve Türkçe uyarı çıkar ("Metodun önceki çağrıya bağlı davranıyor"). Derleme maliyeti (≈1,5 sn; A-vizyon-FINAL §12) baskındır, ikinci koşturma milisaniyedir.
4. **Sınıf senaryoları.** `sinif-senaryo` görevlerinde her senaryo için yeni örnek (`new KapasiteYoneticisi(...)`) oluşturulur; senaryolar arasında durum sızmaz.
5. **Müfettiş koşulu.** Hakem, gizli ve tohumlu vakaları ancak açık testler 6/6 yeşilken çalıştırır ve günde en çok 10 kez (B5 önerisi, Ek A). Aksi halde Müfettiş bir "oracle" olurdu: oyuncu kategori balonlarından ikili arama yapabilirdi.

### 1.7 Tohumlu test üretim kuralı

Tohumlu vakaların iki işi vardır: (1) ezberi ve paylaşımı kırmak (başkasının listesi sizin listeniz değildir) ve (2) her oyuncuda ortak ama sabit gizli testlerin dışında kalan bölgeleri taramak. Kural şudur:

- **Tohum.** `SHA-256(UTF-8: oyuncuId + "|" + yyyy-MM-dd + "|" + challengeId)` özetinin ilk 8 baytı, küçük-endian `uint64`. `oyuncuId` hesap kimliğidir (takma ad değil; takma ad değişince küme değişmesin). **Gün**, B2 §4.4'teki günlük sınırlarla aynı biçimde TR saatiyle 04:00'te değişen oyun günüdür (B5 önerisi).
- **Üreteç.** SplitMix64; yasak değer çıkarsa yeniden çekilir (ret örnekleme). Üreteç sürümlüdür (`otopark-L1-v1`); sürüm değişince Spec sürümü de değişir.
- **Küme gün boyu sabit.** Küme oyuncunun o günkü ilk Müfettiş çağrısında üretilir ve Redis'e `seed:{oyuncuId}:{challengeId}:{gün}` anahtarıyla yazılır; aynı gün tekrar denemede oyuncu aynı vakalarla karşılaşır (hata ayıklarken hedef oynamaz). Ertesi gün yeni küme çıkar.
- **Beklenen.** Sunucuda referans çözümle üretilir ve oyuncuya yazılmaz; kırmızı olursa yalnızca kategori ve yön (fazla/eksik) söylenir.

**Hangi dilimden kaç tane?** Altı vaka: dört "iç" vaka (her tarife diliminden ve çok günlü bölgeden birer tane) ve iki "sınır komşuluğu" vakası.

| Vaka | Katman | Üretim kuralı | Yakaladığı hata türü |
|---|---|---|---|
| T1 | `dilim-1-ic` | [2, 118]; saat komşuları ve 20 sabit vaka hariç | yukarı yuvarlama yok; dilimi yuvarlanmış saatle seçmek |
| T2 | `dilim-2-ic` | [122, 358]; aynı dışlama | 2. dilimde yukarı yuvarlama |
| T3 | `gunluk-ic` | [381, 1399]; aynı dışlama | günlük dilimde gün sayısı |
| T4 | `cok-gunlu-ic` | [1443, 20000]; gün komşuları ve sabitler hariç | çok günlü yuvarlama, büyük girdi |
| T5 | `saat-siniri` | taban ∈ {240, 300}, sapma ∈ {−1, 0, +1} | 2. dilimde tam saat katı kayması (sabit testler 60/120/180/360'ı kapsar) |
| T6 | `gun-siniri` | n ∈ {3, 4, 5, 7, 10}, n × 1440 + sapma | 1'den fazla tam gün kayması (sabit testler 1440/2880'i kapsar) |

*Saat komşusu*: `v mod 60 ∈ {0, 1, 59}`; *gün komşusu*: `v mod 1440 ∈ {0, 1, 1439}`. İç katmanlar komşuları dışlar, böylece her katmanın amacı ayrı kalır.

**Sınır değerlerinin garantisi üç katmanlıdır.** (1) Sabit 20 vaka tarife sınırlarını (119/120/121, 359/360/361, 1439/1440/1441) tohumdan bağımsız kapsar. (2) Tohumlu T5 ve T6 **eş-zamanlı** üretilir: ikisinden tam biri tam kat (sapma 0), diğeri komşudur (−1 ya da +1); böylece her sette hem "tam kat" hem "komşu" davranışı yoklanır. (3) Hiçbir tohumlu değer sabit vakalarla çakışmaz, altı değer birbirinden farklıdır.

```csharp
public static List<TVaka> Uret(string oyuncuId, DateOnly gun)
{
    ulong s = Tohum(oyuncuId, gun);
    var l = new List<TVaka>();
    int t1 = Sec(ref s, 2, 118, v => Sabit.Contains(v) || SaatKomsu(v));
    int t2 = Sec(ref s, 122, 358, v => Sabit.Contains(v) || SaatKomsu(v));
    int t3 = Sec(ref s, 381, 1399, v => Sabit.Contains(v) || SaatKomsu(v));
    int t4 = Sec(ref s, 1443, 20000, v => Sabit.Contains(v) || GunKomsu(v));

    // sınır komşuluğu: biri tam kat (0), diğeri komşu (−1/+1)
    bool saatTam = (Sonraki(ref s) & 1) == 0;
    int sapma = (Sonraki(ref s) & 1) == 0 ? -1 : +1;
    int saatTaban = (Sonraki(ref s) & 1) == 0 ? 240 : 300;
    int[] gunKatlari = { 3, 4, 5, 7, 10 };
    int n = gunKatlari[(int)(Sonraki(ref s) % (ulong)gunKatlari.Length)];
    int t5 = saatTaban + (saatTam ? 0 : sapma);
    int t6 = n * 1440 + (saatTam ? sapma : 0);

    l.Add(new("T1", t1, "dilim-1-ic"));
    l.Add(new("T2", t2, "dilim-2-ic"));
    l.Add(new("T3", t3, "gunluk-ic"));
    l.Add(new("T4", t4, "cok-gunlu-ic"));
    l.Add(new("T5", t5, "saat-siniri"));
    l.Add(new("T6", t6, "gun-siniri"));
    return l;
}
```

Ölçüm (10.000 oyuncu, 2026-11-02): her küme altı farklı değer içerir, sabit 20 vakayla çakışmaz, katman aralıklarına uyar, T5/T6'dan tam biri tam kattır ve aynı tohum aynı kümeyi verir (10.000 / 10.000); **10.000 küme de birbirinden farklıdır**; referans çözüm bağımsız döngü çözümüyle tüm tohumlu vakalarda uyuştu. Tohumlu setin tek başına yakaladığı hata oranları §3.8'dedir; dilim sınırı hataları (`<` ↔ `<=`) tohumlu setle **yakalanmaz**, onları sabit gizli testler yakalar.

### 1.8 İçerik CI doğrulayıcısı (22 kural)

İçerik deposuna giren her Spec için CI şunları çalıştırır; Otopark L1 için sonuç §9'dadır (22/22).

1. Üst düzey alanlar tam, sıralı ve fazlası yok. 2. `id` biçimi. 3. `id = isletme-L{seviye}`. 4. Açık test sayısı. 5. Gizli test sayısı. 6. `seeded_tests.adet`. 7. Test kimlikleri benzersiz. 8. Her `beklenen` referans çözümle uyuşuyor. 9. Her `etiket` kategori fonksiyonuyla uyuşuyor. 10. Otopark L1'de testler KANON §5.1 tablosuyla birebir. 11. Sözleşme maddesi sayısı. 12. `netlestirme.min_soru ≥ 4`. 13. Hazır soru sayısı. 14. Her `edge_cases` girdisi en az bir geçerli teste bağlı. 15. İpucu merdiveninde dört kademe. 16. Kademeler boş değil. 17. En az 4 Savunma sorusu. 18. Rubrik ağırlıkları 50 + 30 + 20 = 100. 19. Rubrik eşiği KANON §9 (70). 20. `odul.xp` KANON §3.3. 21. Mutasyon kataloğundaki her mutasyon en az bir sabit testle yakalanıyor (yakalanmayan eşdeğer mutant katalogdan çıkar). 22. 10.000 sentetik oyuncuda her kategori sabit + tohumlu toplamda en az 2 vaka içeriyor.

### 1.9 İstemci ve sunucu görünümü

| Alan | İstemci (editör, İş Emri) | Hakem (sunucu) | Özel paket |
|---|---|---|---|
| `baslik`, `imza`, `iskelet_kod` | evet | evet | — |
| `musteri_istegi.metin` | evet | evet | — |
| `netlestirme.sorular` | soru metinleri; cevap ve ilgili `sozlesme_karti` maddesi soru sorulunca | evet | — |
| `sozlesme_karti` | yalnızca açılmış maddeler | evet | — |
| `public_tests` | tam | evet | — |
| `hidden_tests` | adet ve kategori balonu | tam | — |
| `seeded_tests` | adet | tam (üreteç) | — |
| `edge_cases` | hayır | hayır | evet (CI) |
| `ipucu_merdiveni` | kademe istenince tek kademe | evet | — |
| `savunma_sorulari` | Savunma anında tek soru + rubrik (rubrik cevap kutusunun üstünde, KANON §9) | tam | `kabul/ret` Kurul istemine girer |
| `rubrik`, `odul` | evet | evet | — |
| referans çözüm, mutasyonlar | hayır | hayır | evet (`challenge-private`) |

### 1.10 Staj modu uyumu

B2 §7.4'teki Staj modu (slotu olmayan oyuncu Ruhsat'lı işletmenin İş Emri'ni Akademi Atölyesi'nde kodlar) Spec'te değişiklik gerektirmez. Aynı dosya aynı hakemle çalışır; değişen yalnızca sunucu akışıdır: Müfettiş ve Savunma aynen koşar, `odul.xp` ödenir, gelir ve kasa hiç oluşmaz, tapu alınınca işletme anında Açık olur. Staj açılışında üretilen tohumlu küme Redis'te işletme–oyuncu çiftine bağlı kalır, böylece tapu sonrası ilk gece batch'i aynı kodu aynı referans tavanıyla çalıştırır.


---

## 2. İşletme kataloğu (20 işletme)

Katalog, KANON §5'in 20 işletmesini seviyelere ve müşterilere açar. Üç kaynağı vardır: semt, açılış seviyesi, fiyat ve seviye sayısı KANON §5'ten; L1–L5 günlük geliri B2 §7.1'den (saatlik = günlük ÷ 24, tek ondalık; B2'nin yuvarlamasıyla aynı); seviye başlıkları, müşteri hikâyeleri ve kavram atamaları B5'in tasarımıdır. Tabloların hiçbirinde bir KANON ya da B2 sayısı değiştirilmedi.

Dört kural katalogu yönetir.

1. **Bir seviye üç şey getirir:** yeni müşteri isteği, yeni kavram, yeni test seti. Yeni seviye önceki çözümü kırmaz, yeniden kullanır; Otopark L2'nin referans çözümü `UcretHesapla(dakika)`'yı çağırır ve bu yüzden L1'in 20 sabit vakası L2 için de geçerli kalır.
2. **Yükseltme kavramı çoğunlukla işletmenin semtinden sonraki semtin dersinden gelir** (Otopark L2 Liman, L3 Atölyeler, L4 Kampüs, L5 Finans; A-vizyon-FINAL §7): ilk işletme oyuncuyu bütün şehirde gezdirir. İstisna B2 varsayımı 8'dir: Büfe L2 yalnızca Çarşı içeriğiyle yapılabilir. Her satırdaki "(semt)" B4'ün "yükseltme kapısı" etiketine girdidir.
3. **Adlandırma geçişi.** KANON §1: C# tanımlayıcıları Çarşı–Liman'da Türkçe, Atölyeler'den itibaren İngilizce. Bu yüzden `Otopark.UcretHesapla` Türkçe, `Vehicle.MaintenanceFee` ve `Order.Total` İngilizcedir.
4. **Gelir B2'ye bağlıdır.** B2 §15, her işletmenin referans çözümünün sentetik trafikte ürettiği TL toplamının hedeften en çok %5 sapmasını ister. Otopark L1–L5, Büfe, Manav ve Kargo L1 için profiller bu belgededir (§3.12, §4); kalan 16 işletmenin profili sandbox şablonlarıyla birlikte ayarlanır (Açık Soru 7).

Müşteri NPC'lerinden altısı mevcut belgelerden gelir (Hasan Abi, Kütüphaneci Ayşe: A-vizyon; Kaptan Rıza, Balıkçı Gülsüm, Gümrük Memuru Faruk, Belediye Memuru Nuran: B1), on dördü B5 önerisidir ve B6 ile hizalanır. "Usta" sözcüğü yalnızca öğretmen NPC'ler için ayrıldığından (KANON §2.1) Tamirci, Marangoz ve Şef unvanları kullanıldı.

### 2.1 Özet tablo

| # | İşletme (slug) | Semt | Açılış sev. | Fiyat (B) | Seviye (L) | L1 B/gün | Müşteri NPC | L1'in öğrettiği konu (KANON §5) |
|---|---|---|---|---|---|---|---|---|
| 1 | **Otopark** (`otopark`) | Çarşı (T1) | 3 (+ Ruhsat 3/3) | 300 | 5 | 220 | Hasan Abi | `if/else if`, metot, başlayan saati yukarı yuvarlama |
| 2 | **Büfe** (`bufe`) | Çarşı (T1) | 4 | 600 | 4 | 300 | Büfeci Melek Abla | aritmetik, `decimal`, para üstü ve döngüyle bozukluk |
| 3 | **Manav** (`manav`) | Çarşı (T1) | 5 | 900 | 4 | 380 | Manav Nuriye Teyze | `switch`, miktara göre indirim kademesi |
| 4 | **Kargo Deposu** (`kargo-deposu`) | Liman (T1–2) | 6 | 1.500 | 4 | 500 | Kaptan Rıza | diziler, `List<T>`, envanter sayımı |
| 5 | **Balık Hali** (`balik-hali`) | Liman (T1–2) | 8 | 2.200 | 4 | 620 | Balıkçı Gülsüm | `Dictionary` fiyat listesi, `string.Split` |
| 6 | **Oto Yıkama** (`oto-yikama`) | Liman (T1–2) | 9 | 2.500 | 3 | 680 | Yıkamacı Murat | `List` + paket ve ek hizmet listesiyle kademeli fiyat (3. yüzey) |
| 7 | **Gümrük** (`gumruk`) | Liman (T1–2) | 10 | 3.000 | 4 | 750 | Gümrük Memuru Faruk | arama, sıralama, plaka doğrulama |
| 8 | **Oto Tamirhane** (`oto-tamirhane`) | Atölyeler (T2) | 12 | 5.000 | 4 | 1.000 | Tamirci Sadık Abi | sınıf, kalıtım (araç hiyerarşisi) |
| 9 | **Mobilya Atölyesi** (`mobilya-atolyesi`) | Atölyeler (T2) | 14 | 6.500 | 4 | 1.200 | Marangoz Rüstem | nesne, kapsülleme, sipariş nesneleri |
| 10 | **Trafo Merkezi** (`trafo-merkezi`) | Atölyeler (T2) | 16 | 8.000 | 4 | 1.400 | Trafo Şefi Kenan | `interface`, `enum`, `exception` |
| 11 | **Kütüphane** (`kutuphane`) | Kampüs (T2–3) | 18 | 10.000 | 4 | 1.650 | Kütüphaneci Ayşe | LINQ sorguları, gün bazlı gecikme cezası (4. yüzey) |
| 12 | **Sinema** (`sinema`) | Kampüs (T2–3) | 20 | 14.000 | 4 | 2.150 | Sinemacı Leyla Hanım | generics, `DateTime`, koltuk rezervasyonu |
| 13 | **Haber Ajansı** (`haber-ajansi`) | Kampüs (T2–3) | 23 | 18.000 | 3 | 2.600 | Editör Cengiz | `delegate`/`event`, JSON akışı |
| 14 | **Banka** (`banka`) | Finans Bölgesi (T3) | 25 | 25.000 | 4 | 3.300 | Müdür Feride Hanım | `async/await`, `Task`, işlem kuyruğu |
| 15 | **Sigorta** (`sigorta`) | Finans Bölgesi (T3) | 28 | 30.000 | 4 | 3.750 | Eksper Tolga | kural motoru + unit test |
| 16 | **Borsa Panosu** (`borsa-panosu`) | Finans Bölgesi (T3) | 30 | 35.000 | 3 | 4.100 | Pano Sorumlusu Ece | `HttpClient`, veri akışı, dayanıklılık |
| 17 | **Hastane Kayıt** (`hastane-kayit`) | Veri Vadisi (T3–4) | 32 | 50.000 | 4 | 5.300 | Kayıt Memuru Sevim | EF Core, migration |
| 18 | **Otel** (`otel`) | Veri Vadisi (T3–4) | 36 | 65.000 | 4 | 6.500 | Otelci Nazan Hanım | ilişkiler, repository, transaction |
| 19 | **Yemek Sipariş Platformu** (`yemek-siparis-platformu`) | Bulut Tepesi (T4) | 40 | 90.000 | 4 | 8.200 | Kurye Şefi Bora | Web API, REST, DTO |
| 20 | **Şehir Uygulaması** (`sehir-uygulamasi`) | Bulut Tepesi (T4) | 45 | 120.000 | 3 | 10.000 | Belediye Memuru Nuran | DI, auth, middleware; lonca sürümü (v2) |

Sonraki alt bölümler her işletmeyi müşteri hikâyesi ve seviye tablosuyla verir. "B/gün (B/saat)" sütunu B2 §7.1'in L1–L5 günlük gelirini ve bunun 24'e bölünmüş saatlik karşılığını gösterir; kasa 8 saatlik üretimi tutar (KANON §4).

### 2.2 #1 Otopark — Çarşı (T1), Sev. 3 (+ Ruhsat 3/3), 300 B, 5 seviye

**Müşteri: Hasan Abi.** Hasan Abi, Çarşı girişinde yirmi yıldır kareli defterle otopark işletiyor; saat hesabını kafasından yapınca her akşam bir müşteriyle tartışıyor. Kuralları kâğıda hiç dökmediği için ne istediğini ancak sorulunca söylüyor. Her seviyede yeni bir dertle döner: aboneler, engelliler, gece gelenler, kalabalık.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Ücret Sistemi | "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL." | `if / else if`, metot, tam sayı bölmesiyle yukarı yuvarlama (Çarşı) | 220 (9,2) |
| L2 | Abone Listesi | "Aylık abonelerin plakaları listede; onlar ödemesin." | `List<string>`, `Contains`, metot aşırı yükleme, bir metodu başka metottan çağırma (Liman) | 350 (14,6) |
| L3 | İndirim ve Bozuk Kayıt | "Engelli ve elektrikli araçlara %50 indirim; bozuk bariyer kaydı gelirse sistem hata versin." | `enum`, `ArgumentOutOfRangeException`, `Enum.IsDefined`, doğrulama sırası (Atölyeler) | 560 (23,3) |
| L4 | Gece Tarifesi | "22:00–06:00 gece tarifesi sabit 150." | `DateTime`, `TimeSpan`, gece yarısını aşan aralık (Kampüs) | 900 (37,5) |
| L5 | Kapasite ve Kuyruk | "Kapasite 50; doluysa kuyruğa al, kuyruk da doluysa reddet; biri çıkınca sıradaki girsin." | durum taşıyan sınıf, `Queue<T>`/`List<T>`, `Task` ile bekleme (Finans) | 1.440 (60,0) |

### 2.3 #2 Büfe — Çarşı (T1), Sev. 4, 600 B, 4 seviye

**Müşteri: Büfeci Melek Abla.** Melek Abla, Çarşı köşesindeki camekânlı büfede simit, ayran ve tost satıyor; sabahları 200 TL'lik uzatan müşterilere bozuk bulmak her seferinde telaş. Para üstünü ezberden veriyor, kuruşlarda şaşırıyor. Kasaya fiyatı ve verilen parayı yazınca hangi kupürlerle vereceğini görmek istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Para Üstü | "Müşteri 20'lik uzatıyor; para üstünü en az parçayla say." | `decimal`, aritmetik, `while` ile bozukluk, `double` tuzağı (Çarşı) | 300 (12,5) |
| L2 | Fiş Yazıcı | "Fişte ürün, adet ve tutar hizalı çıksın." | `string` biçimleme, `PadLeft`, enterpolasyon (Çarşı) | 480 (20,0) |
| L3 | Günün Kasası | "Akşam hangi üründen kaç tane sattım, kasada ne kalmalı?" | `Dictionary<string,int>`, `List<T>`, `foreach` (Liman) | 770 (32,1) |
| L4 | Menü ve Kampanya | "Sabah menüsü ile öğle kampanyası ayrı fiyatlansın." | `record`, `enum`, `switch` ifadesi (Atölyeler) | 1.230 (51,2) |

### 2.4 #3 Manav — Çarşı (T1), Sev. 5, 900 B, 4 seviye

**Müşteri: Manav Nuriye Teyze.** Nuriye Teyze tezgâhında domates, elma ve muz satarken "çok alana kampanya" da yapıyor; ama tartıyı ve indirimi elle çarptığı için pazarın en uzun kuyruğu onda. Hesabın kimseye hak yedirmeden, kuruşsuz çıkmasını istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Tartı ve Kademeli İndirim | "5 kiloya kadar normal; 5–10 kilo arası %10; 10 kilodan fazlası %20 indirimli." | `switch` ifadesi, ilişkisel desen, işlem sırası (önce çarp sonra böl), kademe sınırları (Çarşı) | 380 (15,8) |
| L2 | Sepet | "Müşteri birkaç çeşit alıyor; sepet toplamını ver." | `List<int>`, `foreach`, döngüde birikim (Liman) | 610 (25,4) |
| L3 | Sezon Fiyat Tablosu | "Fiyatlar her sabah tahtada değişiyor." | `Dictionary<string,decimal>`, `TryGetValue` (Liman) | 970 (40,4) |
| L4 | Sadakat Kartı | "Sık alan müşterinin puanı birikir." | sınıf, kapsülleme, `private set` (Atölyeler) | 1.560 (65,0) |

### 2.5 #4 Kargo Deposu — Liman (T1–2), Sev. 6, 1.500 B, 4 seviye

**Müşteri: Kaptan Rıza.** Kaptan Rıza, Liman'daki sac depoyu işletiyor ve her akşam rafları tek tek sayıp faturayı kesiyor; sayım şaşınca gemi düdüğü kadar yüksek sesle tartışıyor. Raflara en çok 20 koli sığıyor, fazlası taşkın sayılıyor. Hesabı bir sistemin yapmasını, kendisinin yalnızca imzalamasını istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Raf Sayımı | "Gün sonu rafları sayıp faturayı kes." | `List<int>`/dizi, `foreach`, `Count`, kapasite sınırı (Liman) | 500 (20,8) |
| L2 | Hareket Defteri | "Gelen ve giden kolileri deftere yazıyorum." | `List<string>`, `Add`/`Remove`, `string.Split` (Liman) | 800 (33,3) |
| L3 | Yük Dengeleme | "En dolu raftan en boş rafa koli taşı." | sıralama (`Sort`, `OrderBy`), arama (Liman) | 1.280 (53,3) |
| L4 | Manifesto | "Gemi manifestosunu rafa göre grupla." | `Dictionary<string, List<T>>`, gruplama, `Split` (Liman) | 2.050 (85,4) |

### 2.6 #5 Balık Hali — Liman (T1–2), Sev. 8, 2.200 B, 4 seviye

**Müşteri: Balıkçı Gülsüm.** Gülsüm Abla'nın fiyat tahtası her sabah hal fiyatlarına göre silinip yeniden yazılıyor; siparişler ise "hamsi:2,levrek:1" gibi acele tutulmuş satırlar hâlinde geliyor. Tahtayı sözlük, satırı sipariş gibi okuyan bir sistemle tutarı anında görmek istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Fiyat Tahtası | "Siparişi 'hamsi:2,levrek:1' diye yazıyorum; tahtadaki fiyatlarla toplamı söyle." | `Dictionary<string,decimal>`, `string.Split`, `int.Parse` (Liman) | 620 (25,8) |
| L2 | Gün Sonu Stoku | "Satılan kadar stok düşsün." | `Dictionary` güncelleme, `TryGetValue` (Liman) | 990 (41,2) |
| L3 | Tezgâh Sırası | "En çok satılan üstte dursun." | `List.Sort(Comparison<T>)`, karşılaştırma (Liman) | 1.590 (66,2) |
| L4 | Hal Raporu | "Tür bazında günlük rapor çıksın." | gruplama, `StringBuilder`, biçimli çıktı (Liman) | 2.540 (105,8) |

### 2.7 #6 Oto Yıkama — Liman (T1–2), Sev. 9, 2.500 B, 3 seviye

**Müşteri: Yıkamacı Murat.** Murat'ın tünel yıkamasında üç paket (Hızlı, Standart, Detay) ve beş ek hizmet var; müşteriler "iki hizmet alırsam indirim var mı" diye soruyor. Ek hizmet sayısına göre indirim vermek istiyor ama kasada hesabı kimse yapamıyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Paket ve Ek Hizmet | "Üç paket, beş ek hizmet; ek hizmet sayısına göre indirim." | `List<string>`, `switch`, ham adetle kademe (Liman) | 680 (28,3) |
| L2 | Boyut Çarpanı | "Küçük, orta, büyük araç farklı fiyat." | `enum`, `switch` ifadesi, aşırı yükleme (Atölyeler) | 1.090 (45,4) |
| L3 | Abonelik Kartı | "Aylık yıkama kartı." | sınıf, kapsülleme, `DateTime` (Atölyeler) | 1.740 (72,5) |

### 2.8 #7 Gümrük — Liman (T1–2), Sev. 10, 3.000 B, 4 seviye

**Müşteri: Gümrük Memuru Faruk.** Faruk, kabin barikatında gün boyu plakalara bakıyor; elle kontrol ederken il kodunu atlayanı ya da harfi yanlış yazanı gözden kaçırıyor. Plakayı okuyup "geçerli mi" diye cevap veren bir sistem, sonra da kara liste taraması ve sıra düzeni istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Plaka Doğrulama | "Biçime uymayan plaka geçmesin: il kodu, 1–3 harf, 2–4 rakam." | `string.Split`, karakter denetimi, `bool` dönüş (Liman) | 750 (31,2) |
| L2 | Kara Liste Taraması | "Aranan plakalar listesinde olanı durdur." | `List<string>` arama, `Contains`, `BinarySearch` (Liman) | 1.200 (50,0) |
| L3 | Sıra Yönetimi | "Önce gelen önce geçsin; ağır yük ayrı kapıdan." | sıralama, kararlı sıra, karşılaştırma (Liman) | 1.920 (80,0) |
| L4 | Beyan Eşleştirme | "Beyan ile yük uyuşuyor mu?" | `Dictionary`, `TryGetValue`, `HashSet` (Liman) | 3.070 (127,9) |

### 2.9 #8 Oto Tamirhane — Atölyeler (T2), Sev. 12, 5.000 B, 4 seviye

**Müşteri: Tamirci Sadık Abi.** Sadık Abi'nin garajında otomobiller, kamyonetler, bazen traktörler aynı bakım formunu dolduruyor; ama taban ücretleri ve kilometre katsayıları farklı. Her tür için ayrı form yazmak istemiyor: ortak bir "araç" formu, türe göre farklı taban ücret.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Araç Hiyerarşisi | "Otomobil ve kamyonet aynı formu kullansın, taban ücretleri farklı olsun." | sınıf, `abstract`, kalıtım, `override`; İngilizce adlandırma (Atölyeler) | 1.000 (41,7) |
| L2 | İş Emri Nesnesi | "İş emri açıkken parça eklensin, kapanınca değişmesin." | kapsülleme, kurucu doğrulaması (Atölyeler) | 1.600 (66,7) |
| L3 | Parça Kataloğu | "Her parçanın kendi garanti kuralı var." | `interface`, çok biçimlilik (Atölyeler) | 2.560 (106,7) |
| L4 | Servis Raporu | "Rapor yazılsın; parça bulunamazsa anlamlı hata." | `record`, `override ToString`, özel istisna (Atölyeler) | 4.100 (170,8) |

### 2.10 #9 Mobilya Atölyesi — Atölyeler (T2), Sev. 14, 6.500 B, 4 seviye

**Müşteri: Marangoz Rüstem.** Rüstem sandalye, masa ve dolap siparişlerini defterde kalem kalem tutuyor; 1.000 TL üstü siparişe %10 indirim yapıyor ama toplamı her seferinde yeniden hesaplıyor. Sipariş bir nesne olsun, kalemlerini kendi içinde tutsun, toplamı kendisi söylesin istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Sipariş Nesnesi | "Siparişe kalem ekleyeyim; toplam 1.000 TL ve üstündeyse %10 indirim." | sınıf, nesne, kapsülleme (Atölyeler) | 1.200 (50,0) |
| L2 | Ölçüye Göre Fiyat | "Genişlik × yükseklik × malzeme katsayısı." | `struct`/`record struct` ölçü tipi (Atölyeler) | 1.920 (80,0) |
| L3 | Üretim Hattı | "Kesim, birleştirme, boya sırası değişmesin." | `abstract`, şablon metot, `interface` (Atölyeler) | 3.070 (127,9) |
| L4 | Teslimat Takvimi | "Üretim süresine göre teslim günü." | `DateOnly`, `TimeSpan`, iş günü hesabı (Atölyeler/Kampüs) | 4.920 (205,0) |

### 2.11 #10 Trafo Merkezi — Atölyeler (T2), Sev. 16, 8.000 B, 4 seviye

**Müşteri: Trafo Şefi Kenan.** Kenan, merkeze bağlı cihazların açık, beklemede ya da kapalı olduğunu panodaki lambalardan okuyor; yük kapasiteyi aşınca sigorta atıyor ve mahalle karanlıkta kalıyor. Cihazların ortak bir arayüzü olsun, yük kendiliğinden toplansın, aşırı yük sigortaya varmadan hata versin istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Cihaz Yükü | "Açıksa tam watt, beklemedeyse onda biri, kapalıysa sıfır." | `interface`, `enum`, `switch` ifadesi (Atölyeler) | 1.400 (58,3) |
| L2 | Aşırı Yük Koruması | "Yük kapasiteyi aşarsa sigorta atsın." | `exception`, özel istisna, `try/catch` (Atölyeler) | 2.240 (93,3) |
| L3 | Faz Dengesi | "Cihazları üç faza dengeli dağıt." | `struct`, `record`, karşılaştırma (Atölyeler) | 3.580 (149,2) |
| L4 | Arıza Zinciri | "Bir arıza ötekini tetiklerse kayıt altına al." | istisna hiyerarşisi, `finally` (Atölyeler) | 5.730 (238,8) |

### 2.12 #11 Kütüphane — Kampüs (T2–3), Sev. 18, 10.000 B, 4 seviye

**Müşteri: Kütüphaneci Ayşe.** Ayşe, Kampüs Kütüphanesi'nin nazik ama kuralcı sorumlusu: kitabı 14 gün ödünç veriyor, gecikene gün başı ceza kesiyor; ilk günlerde müsamahalı, sonra giderek sert. Üye başına ceza, konuya göre katalog ve bekleme sırası istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Gecikme Cezası | "Gecikene gün başı ceza: ilk 3 gün 2 TL, 4.–10. günler 5 TL, sonrası 10 TL." | LINQ `Sum`, `DateTime`, artımlı kademe (Kampüs) | 1.650 (68,8) |
| L2 | Katalog Sorguları | "Konuya göre, yazara göre listele." | LINQ `Where`/`OrderBy`/`Select` (Kampüs) | 2.640 (110,0) |
| L3 | Rezervasyon Sırası | "Her türden raf; kitabı bekleyenlerin sırası." | generics, `Queue<T>`, extension metot (Kampüs) | 4.220 (175,8) |
| L4 | Okuyucu Raporu | "Üye başına ödünç ve ceza." | `GroupBy`, `Join`, anonim tip (Kampüs) | 6.760 (281,7) |

### 2.13 #12 Sinema — Kampüs (T2–3), Sev. 20, 14.000 B, 4 seviye

**Müşteri: Sinemacı Leyla Hanım.** Leyla Hanım'ın en büyük derdi aynı koltuğun aynı seansa iki kez satılması; defterdeki "A4" iki kişide çıkınca salonda sıra kavgası çıkıyor. Her salon, her koltuk türü ve her seans için tek tip bir rezervasyon defteri istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Koltuk Rezervasyonu | "Aynı koltuk aynı seansa iki kez satılmasın." | generics (`ReservationBook<TSeat>`), `DateTime` anahtarı (Kampüs) | 2.150 (89,6) |
| L2 | Seans Takvimi | "Seanslar çakışmasın; arada temizlik payı olsun." | `TimeSpan`, aralık çakışması (Kampüs) | 3.440 (143,3) |
| L3 | Bilet Fiyat Politikası | "Öğrenci, tam, hafta içi indirimli." | desen eşleştirme, `switch` ifadesi (Kampüs) | 5.500 (229,2) |
| L4 | Bilet Kayıtları | "Satışlar dosyaya yazılsın, geri okunsun." | dosya, JSON serileştirme (Kampüs) | 8.810 (367,1) |

### 2.14 #13 Haber Ajansı — Kampüs (T2–3), Sev. 23, 18.000 B, 3 seviye

**Müşteri: Editör Cengiz.** Cengiz, ajansın kayan haber bandının editörü; telgraf yağmuru gibi gelen JSON'lardan "son dakika" olanları ayırıp aboneleri uyandırması gerekiyor. Her abone yalnızca kendi konusunu dinlesin, önemli haber geldiğinde ilgili abonelere haber gitsin istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Haber Yayıncısı | "Önemli haber geldiğinde abonelere haber ver." | `event`, `delegate`, JSON ayrıştırma (Kampüs) | 2.600 (108,3) |
| L2 | Abone Filtreleri | "Her abone kendi konusunu seçsin." | lambda, `Func<T,bool>` (Kampüs) | 4.160 (173,3) |
| L3 | Akış Birleştirici | "İki kaynağın akışını tek bantta birleştir." | olay zinciri, `System.Text.Json` serileştirme (Kampüs) | 6.660 (277,5) |

### 2.15 #14 Banka — Finans Bölgesi (T3), Sev. 25, 25.000 B, 4 seviye

**Müşteri: Müdür Feride Hanım.** Feride Hanım, cam kulenin üçüncü katındaki şubenin müdürü; havale onay servisini beklerken gişedeki kuyruk uzuyor. Onay gelene kadar öteki işlemler beklemesin ama bakiye hiçbir zaman eksiye düşmesin istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Havale Kuyruğu | "Havaleleri sırayla işle; onay servisi 'evet' derse düş." | `async/await`, `Task<T>` (Finans) | 3.300 (137,5) |
| L2 | Eşzamanlı Hesap | "İki işlem aynı anda gelirse bakiye bozulmasın." | `lock`, `SemaphoreSlim`, yarış durumu (Finans) | 5.280 (220,0) |
| L3 | Zaman Aşımı ve İptal | "Onay servisi cevap vermezse vazgeç." | `CancellationToken`, `Task.WhenAny` (Finans) | 8.450 (352,1) |
| L4 | Toplu İşlem | "Gün sonu toplu havale." | `Task.WhenAll`, üretici–tüketici (Finans) | 13.520 (563,3) |

### 2.16 #15 Sigorta — Finans Bölgesi (T3), Sev. 28, 30.000 B, 4 seviye

**Müşteri: Eksper Tolga.** Tolga prim hesabını yıllardır yaşa, hasar geçmişine ve kapsama göre defterden yapıyor; her yeni kuralda biri bir yeri yanlış değiştirip müşteriye yanlış prim yazıyor. Kurallar koda geçsin, her kuralın bir testi olsun, "çalıştı" yetmesin, kanıtı olsun istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Prim Kuralları | "Yaş, hasar geçmişi ve kapsama göre prim." | kural motoru, `decimal` (Finans) | 3.750 (156,2) |
| L2 | Kural Testleri | "Her kuralın testi olsun." | unit test yazma, `Assert`, sınır değerleri (Finans) | 6.000 (250,0) |
| L3 | Hasar Değerlendirme | "Kurallar zincir hâlinde çalışsın." | `interface IKural`, zincir, test çiftleri (Finans) | 9.600 (400,0) |
| L4 | Poliçe Sürümleri | "Poliçe değişince eski sürüm kalsın." | `record`, `with`, değişmezlik, Git temelleri (Finans) | 15.360 (640,0) |

### 2.17 #16 Borsa Panosu — Finans Bölgesi (T3), Sev. 30, 35.000 B, 3 seviye

**Müşteri: Pano Sorumlusu Ece.** Ece, şehrin gerçek lig ve işletme verisini akıtan dev panonun sorumlusu; veri servisi bazen 500 veriyor, bazen hiç cevap vermiyor. Pano boş kalmasın, servis aksayınca birkaç kez denesin, çökerse son bilinen fiyatı göstersin istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Fiyat Çekici | "Fiyatı servisten çek." | `HttpClient`, JSON, sahte işleyici (Finans) | 4.100 (170,8) |
| L2 | Yeniden Deneme | "Servis aksarsa tekrar dene." | retry, geri çekilme (Finans) | 6.560 (273,3) |
| L3 | Devre Kesici | "Servis çöktüyse bir süre sorma; son fiyatı göster." | dayanıklılık, önbellek (Finans) | 10.500 (437,5) |

### 2.18 #17 Hastane Kayıt — Veri Vadisi (T3–4), Sev. 32, 50.000 B, 4 seviye

**Müşteri: Kayıt Memuru Sevim.** Sevim Hanım her yıl yeni kayıt defteri açıp eskisini rafa kaldıran son kuşak memur; bir hastayı aramak yarım gününü alıyor. Veri Bahçıvanı'nın önerisiyle kayıtları veritabanına taşımak, yeni bilgi (doğum tarihi gibi) eklenince eski kayıtları bozmadan şemayı büyütmek istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Hasta Kaydı | "Yeni hasta kaydı; kimlik kendiliğinden gelsin." | EF Core `DbContext`, `DbSet`, `SaveChangesAsync` (Veri Vadisi) | 5.300 (220,8) |
| L2 | Randevu İlişkisi | "Her hastanın birden çok randevusu var." | 1–n ilişki, `Include` (Veri Vadisi) | 8.480 (353,3) |
| L3 | Şema Değişimi | "Kayda doğum tarihi eklensin." | migration, yeni kolon (Veri Vadisi) | 13.570 (565,4) |
| L4 | Arşiv Sorguları | "Binlerce kayıtta hızlı arama." | sayfalama, indeks, `AsNoTracking` (Veri Vadisi) | 21.710 (904,6) |

### 2.19 #18 Otel — Veri Vadisi (T3–4), Sev. 36, 65.000 B, 4 seviye

**Müşteri: Otelci Nazan Hanım.** Nazan Hanım'ın otelinde oda "dolu" işaretlenip misafir kaydı yarıda kalınca, hem dolu görünen boş oda hem de odasız kalan misafir çıkıyor. Ya ikisini birlikte yapan ya da hiç yapmayan bir rezervasyon istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Tek İşlemde İki Kayıt | "Oda dolu işaretlendi ama misafir yazılamadıysa geri al." | repository, `try/catch`, geri alma (Veri Vadisi) | 6.500 (270,8) |
| L2 | Oda–Misafir İlişkisi | "Bir odada birden çok misafir kalabilir." | n–n ilişki, anahtarlar (Veri Vadisi) | 10.400 (433,3) |
| L3 | Rezervasyon Deposu | "Rezervasyon kodunu depodan al." | repository deseni, arayüz (Veri Vadisi) | 16.640 (693,3) |
| L4 | Çakışma Kontrolü | "Aynı oda aynı geceler iki kez satılmasın." | tarih aralığı, `transaction`, eşzamanlılık belirteci (Veri Vadisi) | 26.620 (1109,2) |

### 2.20 #19 Yemek Sipariş Platformu — Bulut Tepesi (T4), Sev. 40, 90.000 B, 4 seviye

**Müşteri: Kurye Şefi Bora.** Bora, şehrin drone ve motokurye ağını yönetiyor; restoranlardan gelen siparişlerin kapıda doğru karşılanması gerekiyor. Her siparişin "geçti", "hatalı istek" ya da "öyle bir ürün yok" diye net cevap almasını, bu dilin bütün dükkânlarla aynı olmasını istiyor.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Sipariş Uç Noktası | "Sipariş gelsin: 201, 400 ya da 404 dön." | REST, DTO, durum kodu (Bulut Tepesi) | 8.200 (341,7) |
| L2 | Menü Kaynağı | "Restoran menüsünü listele, güncelle, sil." | route, `GET`/`PUT`/`DELETE` (Bulut Tepesi) | 13.120 (546,7) |
| L3 | Doğrulama ve Hata Gövdesi | "Hatalı istek anlamlı cevap alsın." | DTO doğrulama, `ProblemDetails` (Bulut Tepesi) | 20.990 (874,6) |
| L4 | Sipariş Durumu Akışı | "Kurye yola çıkınca müşteriye anında haber." | SignalR temelleri (Bulut Tepesi) | 33.590 (1399,6) |

### 2.21 #20 Şehir Uygulaması — Bulut Tepesi (T4), Sev. 45, 120.000 B, 3 seviye

**Müşteri: Belediye Memuru Nuran.** Nuran Hanım, Ruhsat ve tapu masasından şehrin bütün dükkânlarını tek kapıdan görmek istiyor: Otopark'tan Yemek Sipariş'e herkes aynı kimlik kapısından geçsin, herkes servisini aynı defterden alsın. Oyuncunun Sev. 3'te yazdığı ilk metot burada binanın bir parçası olarak durur.

| L | Başlık | Müşteri isteği | Öğrettiği kavram (semt) | B/gün (B/saat) |
|---|---|---|---|---|
| L1 | Servis Defteri | "Her işletme servisini bir defterden alsın." | DI: kayıt, çözümleme, ömür (singleton) (Bulut Tepesi) | 10.000 (416,7) |
| L2 | Kimlik Kapısı | "Kimliksiz istek içeri girmesin." | auth, token doğrulama, middleware (Bulut Tepesi) | 16.000 (666,7) |
| L3 | Şehir Entegrasyonu | "Bütün işletmelerim tek API'den konuşsun." | işletmeleri tek uygulamada birleştirme; lonca sürümü (v2) | 25.600 (1066,7) |

---

## 3. Otopark — L1'den L5'e tam ayrıntı

Otopark KANON'un kanonik ilk işletmesidir (300 B, Sev. 3 + Ruhsat 3/3, 5 seviye). L1 burada sıfır hata toleransıyla belgelenir: müşteri cümlesi, netleştirme diyaloğu, sözleşme, testler, referans çözüm, Savunma, hatalar, ipuçları, Usta Yorumu ve mutasyonlar. L2–L5 daha kısa ama aynı şablonla verilir. Her kod parçası ve her beklenen değer §9'daki çalıştırmada doğrulanmıştır.

### 3.1 İş Emri: Hasan Abi'nin isteği

Tapu alınır alınmaz oyuncunun **İş Emri** kartı (ekran #11) Hasan Abi'nin elinden gelir. Metin KANON §5.1'dir ve hiçbir yüzeyde kısaltılmaz ya da düzeltilmez:

> "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum."

Cümle bilerek eksiktir: saat yukarı mı yuvarlanır? Tam 2 ve tam 6 saat hangi dilimde? 24 saati aşan ne öder? Süre eksi gelebilir mi? Bu eksikler **Gereksinim Netleştirme** ile kapanır ve **Sözleşme Kartı**'na yazılır. Kodu yazmadan önce müşteriye sormak bu işletmenin ilk dersidir (00-fikir §2: belirsizlikler bir "öğretim anı"dır).

Akış KANON §7'dir: Tapu → İş Emri → Gereksinim Netleştirme → Kod → Müfettiş → Savunma → Açılış.

| Adım | Ekran | Tipik süre | Çıktı ve kazanç |
|---|---|---|---|
| İş Emri | #11 İş Emri | 1 dk | Hasan Abi'nin cümlesi, "Müşteriye Sor" paneli |
| Gereksinim Netleştirme | #11 İş Emri | ≈4 dk | En az 4 soru; açılan maddelerle Sözleşme Kartı; isteğe bağlı Keskin Göz (+50 XP) |
| Kod | #12 İşletme Editörü | ≈15 dk | 6 açık test yeşil; ipucu merdiveni serbest; ipuçsuz ilk deneme için Berrak Zihin +%15 |
| Müfettiş | #12 İşletme Editörü | ≈1 dk | 14 gizli + 6 tohumlu vaka; kategori balonları |
| Savunma | #13 Savunma | ≈3 dk | Kurul'un seçtiği satır, Hasan Abi'nin sorusu; ≥70 → Açılış |
| Açılış | #10 İşletme Sokağı | — | 300 XP; Açılış Kurdelesi 100 B (B2 §5.2); gelir başlar |

Toplam ≈25 dakikadır (A-vizyon-FINAL §3). Savunma başarısız ya da gizli test kalırsa işletme **Deneme** modunda (%50 gelir) açılır; 24 saat sonra yeni Savunma hakkı doğar (KANON §4).

### 3.2 Gereksinim Netleştirme diyaloğu

Oyuncu "Müşteriye Sor" panelinde **8 hazır soru** ve bir serbest metin kutusu görür. Kodlamaya geçmek için **en az 4 soru** sormak zorundadır (KANON §10); üst sınır, ücret ya da süre baskısı yoktur. Cevaplar sabittir ve Hasan Abi'nin ağzından yazılmıştır; ilk beşi `A-vizyon-FINAL.md` §7'den aynen alınmıştır.

| # | Oyuncunun sorusu | Hasan Abi'nin cevabı | Açtığı madde | Öğretim amacı |
|---|---|---|---|---|
| S1 | "1 saat 10 dakika kalan ne öder?" | "Başlayan saat tam sayılır; 2 saatten az kaldı: 200." | 2, 3 | yukarı yuvarlama; dilimi ham sürenin belirlemesi |
| S2 | "Tam 2 saat kalan ne öder?" | "O artık 2–6 dilimi: 2 × 40 = 80." | 2 | alt sınır dâhil |
| S3 | "Tam 6 saat kalan ne öder?" | "Hâlâ 2–6 dilimi: 240; 6'yı geçen güne girer." | 2 | üst sınır dâhil |
| S4 | "24 saati aşan ne öder?" | "Her başlayan gün 250." | 4 | çok günlü kalış (1.441 → 500) |
| S5 | "Girip aynı dakika çıkan ne öder?" | "Ödemez. Bariyer eksi süre göndermez." | 1 | sıfır girdisi; girdi ≥ 0 |
| S6 | "Süreyi nasıl göndereceksin: dakika mı, saat mi, kesirli mi?" | "Dakika, tam sayı. Kesir yok." | 1, 5 | girdi türü (`int`) |
| S7 | "Ücret kuruşlu olabilir mi?" | "TL, tam sayı. Kuruş yok." | 5 | dönüş türü (`int`) |
| S8 | "Tam 24 saat kalan ne öder?" | "Bir gün: 250. Bir dakika fazlası ikinci gün." | 4 | gün sınırı (1.440) |

**Maddeler soruyla açılır.** Sözleşme Kartı, editör açıldığında yalnızca iskeletten gelen imza satırını (Madde 5'in imza yarısı) gösterir; diğer maddeler karttaki soluk satırlardır ("Bu madde için müşteriye sormadın"). Oyuncu bir soru sorduğunda ilgili madde parlayarak karta yazılır. Böylece "sormadan yazan iki kere yazar" (Usta Defne'nin cümlesi) bir cümle olmaktan çıkar, ölçülür bir sonuç doğurur: sorulmayan maddenin gizli testleri kırmızı çıkar ve Müfettiş balonu o bölgeyi söyler (§7.1). Açık testler de ipucudur (120 → 80, 121 → 120, 1.441 → 500), ama gizli testlerin tamamı açık testlerden çıkarılamaz: 0 dakika (G1), saat başı komşuluğu (G3, G4), gün başı komşuluğu (G10, G11) ve 2.880/2.881 yalnızca sorarak ya da sözleşmeyi dikkatle okuyarak bulunur.

**Dört sorudan sonra.** "Koda geç" düğmesi açılır; Usta Defne kenardan "Müşteriye sormadan kod yazan, iki kere yazar" der (A-vizyon-FINAL §7) ve karar oyuncuya kalır; düğme kilitlenmez.

**Serbest metin.** `claude-haiku-5-5` sınıflandırıcı mesajı en yakın hazır soruya eşler (≈0,0001 $); eşleşme yoksa Hasan Abi "Onu bilmiyorum evladım, şunlara bak" der. Oyuncunun metni veridir, talimat değildir (KANON §9).

**Keskin Göz.** Madde 6 (119 → 200, 120 → 80 müşterinin bilinçli kararıdır) hiçbir hazır soruda yoktur ve Usta bunu söylemez (A-vizyon-FINAL §7; ilk 1.000 oyuncuda A/B). Anomaliyi fark eden oyuncu serbest metinle sorar; tetik iki yoldan biridir: (a) aynı mesajda 119 ve 120 sayıları geçer; (b) sınıflandırıcı "uzun kalan daha az ödüyor" anlamını güven ≥ 0,8 ile bulur. Hasan Abi'nin cevabı sabittir: "Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle." Oyuncu **Keskin Göz** rozetini ve +50 XP'yi bir kez alır; Madde 6 karta yazılır. Ders: gereksinimi görünür biçimde sorgula, müşterinin kararına saygı duy. Rozet yalnızca kodlamadan önce serbest metinle sorana verilir; Savunma'daki D3 sorusu anomaliyi herkese gösterdiği için rozet vermez (öğretir, ödüllendirmez).

Örnek diyalog (kısaltılmış):

> **Hasan Abi:** İş emri bu evladım. Aklına takılan olursa sor.
>
> **Oyuncu (S1):** 1 saat 10 dakika kalan ne öder?
>
> **Hasan Abi:** Başlayan saat tam sayılır; 2 saatten az kaldı: 200.
>
> **Oyuncu (serbest):** 119 dakika 200 TL ama 120 dakika 80 TL, bu doğru mu?
>
> **Hasan Abi:** Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle.
>
> **Sistem:** Keskin Göz rozeti kazandın, +50 XP. Sözleşme Kartı'na madde 6 yazıldı.
>
> **Usta Defne (kenardan):** Müşterinin kararına saygı duy; ama soruyu sorman doğruydu.

### 3.3 Sözleşme Kartı (KANON §5.1, aynen)

| Madde | Kural | Açan sorular |
|---|---|---|
| 1 | Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL | S5, S6 |
| 2 | Dilimi **ham kalış süresi** belirler: `dakika < 120` → 1. dilim; `120 ≤ dakika ≤ 360` → 2. dilim (sınırlar dâhil); `dakika > 360` → günlük | S1, S2, S3 |
| 3 | Başlayan saat tam sayılır: `saat = ceil(dakika / 60)`; 1. dilim `saat × 100`, 2. dilim `saat × 40` | S1 |
| 4 | 24 saati aşan kalış: her **başlayan gün** 250 (`gun = ceil(dakika / 1440)`, `gun × 250`) | S4, S8 |
| 5 | İmza: `public static int Otopark.UcretHesapla(int dakika)`; dönüş TL, tam sayı | iskelet, S6, S7 |
| 6 | Anomali (119 → 200, 120 → 80) müşterinin bilinçli kararıdır; fark eden oyuncu **Keskin Göz** (+50 XP) | serbest metin |

### 3.4 İmza ve iskelet

Editör şu iskeletle açılır; oyuncu yalnızca işaretli aralığı yazar. Sınıf adı, metot adı ve parametre adı değişirse hakemin derleme adımı Türkçe uyarı verir ("İmza sözleşmesi: `UcretHesapla(int dakika)` olmalı").

```csharp
// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi
public static class Otopark
{
    // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)
    // dönüş: ödenecek ücret, TL (tam sayı)
    public static int UcretHesapla(int dakika)
    {
        //#BASLA
        // kodun buraya
        //#BITIS
    }
}
```

### 3.5 Test vakaları: 6 açık + 14 gizli + 6 tohumlu = 26

KANON §5.1'in tablosu aşağıda birebir yer alır; "Kategori" sütunu Müfettiş balonunun söyleyeceği bölgedir (§7.1), "Gerekçe" sütunu testin neden orada durduğunu ve hangi hatayı yakaladığını söyler (mutasyon kodları §3.11'dedir).

**Açık testler (6).** Oyuncu girdiyi, beklenen değeri ve gerçek değeri görür.

| Id | Dakika | TL | Kategori | Gerekçe |
|---|---|---|---|---|
| A1 | 30 | 100 | `iki-saatten-az` | Başlayan 1. saat; en kısa yoldan 1. dilim |
| A2 | 61 | 200 | `iki-saatten-az` | Başlayan 2. saat ama dilim hâlâ "2 saatten az"; dilimi yuvarlanmış saatle seçen çözümü kırar (M5) |
| A3 | 120 | 80 | `iki-saat-civari` | Tam 2 saat: 2. dilimin alt sınırı dâhil; `<=` tuzağı (M1, E5) |
| A4 | 121 | 120 | `iki-saat-civari` | Başlayan 3. saat, 3 × 40; 2. dilimde yukarı yuvarlama (M7, E1) |
| A5 | 361 | 250 | `alti-saat-civari` | 6 saati bir dakika aştı → günlük; sınırın öte yakası |
| A6 | 1.441 | 500 | `bir-gun-civari` | İkinci gün başladı; "günlük sabit 250" hatasını kırar (M6, E7) |

**Gizli testler (14).** Yalnızca Müfettiş çalıştırır; oyuncu sayıyı değil kategoriyi görür.

| Id | Dakika | TL | Kategori | Gerekçe |
|---|---|---|---|---|
| G1 | 0 | 0 | `hemen-cikanlar` | Madde 1: 0 → 0; "en az 1 saat" varsayımını yakalar (E10). Gelir trafiği 0 dakikalık araç üretmediği için yalnızca bu test görür |
| G2 | 1 | 100 | `hemen-cikanlar` | En küçük pozitif kalış; yukarı yuvarlama yoksa 0 TL döner (E1, E3) |
| G3 | 59 | 100 | `iki-saatten-az` | Saat başından bir önce; `dakika / 60` (taban) 0 TL verir. `+ 60` hatasında hâlâ doğrudur, o hatayı G4 ayırır |
| G4 | 60 | 100 | `iki-saatten-az` | Tam 1 saat: `(dakika + 60) / 60` bunu 2 saat sayar (M3) |
| G5 | 119 | 200 | `iki-saat-civari` | Anomali tepesi: 119 → 200; dilimi saate göre seçen çözüm 80 verir (M5, E4) |
| G6 | 180 | 120 | `iki-alti-arasi` | 2. dilimde tam saat katı; `+ 60` hatası 160 verir (M3) |
| G7 | 359 | 240 | `alti-saat-civari` | 2. dilimin son dakikalarından; `dakika / 60 × 40` 200 verir (M7) |
| G8 | 360 | 240 | `alti-saat-civari` | Üst sınır dâhil: 6 × 40, günlük 250 değil (M2, M8) |
| G9 | 720 | 250 | `gunluk-tarife` | Günlük dilimin içi; gün yuvarlamasında taban (E8) 0 TL verir |
| G10 | 1.439 | 250 | `bir-gun-civari` | Günün son dakikası; gün tabanı yine 0 |
| G11 | 1.440 | 250 | `bir-gun-civari` | Tam gün katı; `dakika / 1440 + 1` 500 verir (M4): Müfettiş'in klasik dosyası |
| G12 | 2.880 | 500 | `gunu-asanlar` | Tam 2 gün; M4 750 verir |
| G13 | 2.881 | 750 | `gunu-asanlar` | 3. gün başladı; sabit günlük (M6) 250 verir |
| G14 | 100.000 | 17.500 | `gunu-asanlar` | Büyük girdi: `(100000 + 1439) / 1440 = 70`; sabit günlük (M6) ve `Math.Round` (E3: 17.250) burada kırılır |

Sekiz kategori ve aralıkları §7.1'dedir; tablodaki kategori adları JSON'daki `etiket` değerleriyle aynıdır.

**Tohumlu testler (6).** Kural ve üreteç §1.7'dedir. Örnek: oyuncu `ayse_kod`, gün 2026-11-02, tohum `0x9D8D74B21D8FC748` (ham çıktı §9):

| Id | Katman | Dakika | TL |
|---|---|---|---|
| T1 | `dilim-1-ic` | 34 | 100 |
| T2 | `dilim-2-ic` | 218 | 160 |
| T3 | `gunluk-ic` | 1.205 | 250 |
| T4 | `cok-gunlu-ic` | 18.539 | 3.250 |
| T5 | `saat-siniri` | 240 | 160 |
| T6 | `gun-siniri` | 14.401 | 2.750 |

Her tohumlu vakanın gerekçesi, katmanının §1.7 tablosundaki "yakaladığı hata türü" sütunudur (T1 ve T2 floor-bölme ve dilim hatalarını, T3 ve T4 gün hesabını, T5 ve T6 tam kat komşuluğunu yoklar). Aynı gün başka oyuncular başka kümeler görür: `mert.k` [75, 190, 1.306, 19.448, 239, 5.760], `deniz07` [69, 321, 953, 5.513, 300, 7.199]; `ayse_kod` ertesi gün [94, 332, 776, 3.521, 240, 5.761] alır.

### 3.6 Referans çözüm

Aşağıdaki kod KANON §5.1'in referans çözümüdür, karakter karakter aynıdır; yalnızca sunucuda durur. Çalıştırma sonuçları: 20 sabit vaka KANON tablosuyla birebir geçti; 10.000 oyuncunun tohumlu kümesinde bağımsız (döngü tabanlı) ikinci bir çözümle uyuştu; beş alternatif çözüm 0–300.000 dakika süpürmesinde referansla sıfır sapmayla uyuştu (§8.3).

```csharp
public static int UcretHesapla(int dakika)
{
    if (dakika <= 0) return 0;
    int saat = (dakika + 59) / 60;        // başlayan saat
    if (dakika < 120) return saat * 100;  // 2 saatten az kalanlar
    if (dakika <= 360) return saat * 40;  // 2–6 saat, sınırlar dâhil
    int gun = (dakika + 1439) / 1440;     // başlayan gün
    return gun * 250;
}
```

Satır satır: `dakika <= 0` Madde 1'i kodlar (girdi ≥ 0 sözleşmesi altında davranışı değiştirmez, çünkü `(0 + 59) / 60 = 0`; satır negatif kayıtlara ve niyet belirtmeye hizmet eder, §3.11'deki eşdeğer mutant EQ1). `(dakika + 59) / 60` tam sayı bölmesiyle `ceil(dakika / 60)`'tır (Ders 1.2 kalıbı). `dakika < 120` ve `dakika <= 360` Madde 2'nin ham süre sınırlarıdır; `saat <= 6` yazmak `dakika <= 360` ile **eşdeğerdir** (EQ2) ama niyeti gizler, bu yüzden referans ham dakikayı kullanır. Son iki satır Madde 4'ün başlayan günüdür.

**Bilinen sınır.** `dakika + 1439` ifadesi `int` taşar: `dakika = 2.147.482.209` için sonuç **−372.827.000 TL**'dir (§9). KANON v1 girdi için üst sınır koymaz; bu belge üst sınır olarak 10.000.000 dakikayı (≈19 yıl) önerir (Ek A). Sınır konana kadar hiçbir test bu bölgeyi sınamaz.

### 3.7 Savunma soruları

Tüm testler yeşil olunca **Kurul** oyuncunun kendi kodunda `satir_deseni` ile bir satır seçer ve soruyu **Hasan Abi**'nin ağzından sorar (KANON §10: Savunma). Açıklama kutusunun üstünde rubrik görünür (Doğruluk 50 / Tamlık 30 / Açıklık 20); ≥70 geçer, <70 Deneme açılışıdır (KANON §9). Soru her zaman oyuncunun **kendi** satırı ve **somut bir girdi** üzerindendir; ezberlenmiş genel cevap işe yaramaz. Yapıştırma telemetrisi (AST benzerliği > %95 ya da 30 sn altı yazım; KANON §9) Savunma'yı zorunlu kılar ve Bayt'ı Savunma sonrasına bırakır; ayrıntı §8.

Beş soru tanımlıdır (`min 4`). Kurul, oyuncunun kodunda eşleşen ilk deseni seçer; eşleşme yoksa D1'in genel sürümü sorulur.

**D1 — "121 dakika neden 120 TL? Hangi satır belirliyor?"** Desen: `(<=|<)\s*360|\*\s*40`. Kabul: 121'in 2. dilimde (120–360) olduğunu söyler; başlayan saatin 3 olduğunu gösterir; 3 × 40 = 120 hesabını yapar. Ret: "Test böyle istiyor" gibi kodu açıklamayan cevap; dilimi yuvarlanmış saatten bulduğunu söylemek (ham süre ilkesini bilmediğini gösterir). Örnek iyi cevap: *"121 dakika 120'den büyük ve 360'tan küçük olduğu için 2. dilimde. Bu dilimde ücret başlayan saat × 40. 121 dakika 2 saati bir dakika geçtiği için 3. saat başlamış sayılıyor: (121 + 59) / 60 = 3. Yani 3 × 40 = 120. Dilimi seçen satır `if (dakika <= 360)`, ücreti veren satır `return saat * 40;`."* Örnek puanlar: bu cevap 48 + 28 + 18 = **94**; "3 saat sayılıyor, 40 ile çarpılıyor" cevabı 40 + 18 + 16 = **74** (geçer, Tamlık'ta dilim açıklaması eksik); "Çünkü 121, 120'den büyük" cevabı 22 + 8 + 12 = **42** (kalır).

**D2 — "`(dakika + 59) / 60` ne işe yarıyor? Neden 59?"** Desen: `\+\s*59`. Kabul: tam sayı bölmesinin küsuratı attığını söyler; 59 eklemenin artığı bir sonraki saate taşıdığını açıklar; örnek verir (60 → 1, 61 → 2). Ret: "Saati hesaplıyor" deyip yuvarlamayı anlatmayan cevap; 60 yerine neden 59 olduğunu açıklayamama. Örnek: *"Tam sayı bölmesi küsuratı atar, ben ise artan 1 dakika bile olsa bir sonraki saati saymak istiyorum. 59 eklersem 60'ın tam katlarında sonuç değişmez, bir fazlasında yükselir: (60 + 59) / 60 = 1, (61 + 59) / 60 = 2. 60 ekleseydim 60 dakika da 2 saat çıkardı."*

**D3 — "119 dakika 200 TL ama 120 dakika 80 TL. Kodunda bunu hangi satır sağlıyor?"** Desen: `<\s*120`. Kabul: `dakika < 120` satırını gösterir; anomaliyi müşterinin kararı olarak bilir (Madde 6); farkın 100 TL ile 40 TL birim fiyatından geldiğini söyler. Ret: 119'un neden 200 olduğunu hesaplayamama; "kodda hata var" diyerek sözleşmeyi suçlama. Örnek: *"119 dakika `dakika < 120` koşuluna giriyor, yani 1. dilim: başlayan saat 2, 2 × 100 = 200. 120 dakika bu koşula girmiyor, 2. dilimin alt sınırı: 2 × 40 = 80. Hasan Abi bunu bilinçli istedi, sözleşmenin 6. maddesi."*

**D4 — "1.440 dakika ile 1.441 dakika arasında kodun davranışı nasıl değişiyor?"** Desen: `1439|1440`. Kabul: 1440 için gün sayısının 1, 1441 için 2 olduğunu hesaplar; 1439 eklemenin başlayan gün yuvarlaması olduğunu söyler. Ret: gün hesabını saat hesabıyla karıştırma; 1441 için 250 savunma. Örnek: *"(1440 + 1439) / 1440 = 1, yani 1 gün, 250 TL. (1441 + 1439) / 1440 = 2, ikinci gün başladı, 500 TL. 1439 eklemek, saat için 59 eklemenin günlük hâli."*

**D5 — "`dakika <= 0` satırını silsen 0 dakika için ne döner? Satır neden duruyor?"** Desen: `<=\s*0`. Kabul: 0 için saat = 0 ve 0 × 100 = 0 olduğunu hesaplar; satırın negatif girdiye karşı koruma ve niyet belirtme olduğunu söyler. Ret: "Silersem program çöker" (yanlış). Örnek: *"Silsem de 0 dönerdi: saat = (0 + 59) / 60 = 0, 0 × 100 = 0. Satır sözleşmedeki 'girdi ≥ 0' varsayımını koda yazıyor; negatif bir kayıt gelirse eksi ücret hesaplamak yerine 0 döndürüyor."*

**Çözüm biçimine uyarlama.** Tablo tabanlı ya da `switch` ifadeli çözümlerde (§8.3) `+ 59` deseni bulunmayabilir; Kurul bu durumda satırı değil değeri sorar: "Kodun 121 için kaç TL döndürüyor ve bu sayıyı hangi ifade ya da tablo satırı belirliyor?" Aynı rubrik uygulanır. Savunma sorusunun AI maliyeti Kurul kotasına sayılır; kota dolsa bile Savunma kilitlenmez, cevap kaydedilir ve gece Batch API ile puanlanır (KANON §9).

### 3.8 Yaygın hatalar (13) ve hangi testlerin kaldığı

Aşağıdaki 13 hata Otopark L1'de beklenen öğrenci hatalarıdır. Hepsi çalıştırıldı; sütunlar ölçümdür, tahmin değildir. E4, E5, E6, E7 ve E9 aynı zamanda Hata Bildirimi mutasyonlarıdır (sırasıyla M5, M1, M2, M6, M4; §3.11): aynı satır bir gün oyuncunun kendi hatası, bir gün başkasının kodunda ayıklayacağı hata olarak karşısına çıkar.

*Kalan açık*, oyuncunun editörde zaten gördüğü kırmızı kutulardır. *Kalan gizli* yalnızca Müfettiş'in gördüğüdür. *Tohumlu yakalama*, 10.000 sentetik oyuncudan kaçının altı tohumlu vakasının en az birinde hatanın göründüğünü verir.

| Kod | Hata ve örnek satır | Oyuncu ne düşünür | Kalan açık | Kalan gizli | Tohumlu yakalama | Usta'nın yönlendirmesi |
|---|---|---|---|---|---|---|
| E1 | Yukarı yuvarlama yok: `int saat = dakika / 60;` | Saat zaten dakikanın 60'a bölümü | A1, A2, A4 | G2, G3, G5, G7 | %100 | 61 dakikada saat kaç çıkıyor? Hasan Abi "başlayan saat" demişti; başlayan ne demek? |
| E2 | `Math.Ceiling` ama bölme önce tam sayıda: `(int)Math.Ceiling((double)(dakika / 60))` | Ceiling yukarı yuvarlar, güvendeyim | A1, A2, A4, A5, A6 | G2, G3, G5, G7, G9, G10, G13, G14 | %100 | Parantezin içindeki bölme hangi türde yapılıyor? Ceiling'e gelen sayı zaten ne? |
| E3 | `Math.Round`: `(int)Math.Round(dakika / 60.0)` | En yakın saate yuvarlarım | A1, A2, A4, A5, A6 | G2, G9, G13, G14 | %95,6 | 30 dakikada Round kaç döndürüyor? Müşteri "en yakın" mı dedi, "başlayan" mı? |
| E4 | Dilimi yuvarlanmış saatle seçmek: `if (saat < 2)` (= M5) | 2 saatten az = saat < 2 | A2 | G5 | %51 | 119 dakikada saat kaç, dakika kaç? Hasan Abi'nin cümlesi hangisine bakıyor? |
| E5 | 2 saat sınırını 1. dilime katmak: `if (dakika <= 120)` (= M1) | "2 saatten az", 2 de dâhil olmalı | A3 | — | %0 | Hasan Abi tam 2 saat için ne demişti? Kartı oku ya da yeniden sor. |
| E6 | 6 saat sınırını dışarıda bırakmak: `if (dakika < 360)` (= M2) | 6 saat günlük dilime girer | — | G8 | %0 | Tam 6 saat için S3'ün cevabı kartta yazıyor. |
| E7 | 24 saatten sonrasını hep 250 saymak: `return 250;` (= M6) | Günlük 250, bitti | A6 | G12, G13, G14 | %100 | 1.441 dakika kaç gün? Kartta Madde 4 ne diyor? |
| E8 | Gün hesabında yukarı yuvarlama yok: `int gun = dakika / 1440;` | Gün = dakika / 1440 | A5, A6 | G9, G10, G13, G14 | %100 | 361 dakikada gün kaç çıkıyor? 0 gün kaç TL? |
| E9 | Gün için `dakika / 1440 + 1` (= M4) | Yukarı yuvarlamanın kolayı: bir ekle | — | G11, G12 | %49,8 | 1.440 dakika kaç gün? "Bir dakika fazlası ikinci gün" demişti; tam gün için? |
| E10 | Asgari ücret varsayımı: `Math.Max(saat, 1) * 100` | En az bir saat ödenir | — | G1 | %0 | S5'in cevabını oku: aynı dakika çıkan ödemez. |
| E11 | Geniş koşulu önce yazmak: `if (dakika <= 360) …; else if (dakika < 120) …` | Koşulların sırası fark etmez | A1, A2 | G2, G3, G4, G5 | %100 | 30 dakikada hangi `if` çalışıyor? Koşulları yukarıdan aşağı izle. |
| E12 | `&&` yerine `\|\|`: `if (dakika >= 120 \|\| dakika <= 360)` | ve / veya aynı şey | A1, A2, A5, A6 | G2, G3, G4, G5, G9, G10, G11, G12, G13, G14 | %100 | Hangi sayı bu koşulu sağlamaz? 5'i dene. |
| E13 | Açık testleri ezberlemek: `switch (dakika) { case 30: return 100; … default: return 0; }` | Kırmızıyı yeşile çevirmek | — | G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12, G13, G14 | %100 | Müfettiş 59 dakika için ne söyleyecek? Müşteri yalnızca 6 kişi mi? |

Üç gözlem:

1. **13 hatanın 9'u en az bir açık testi kırar;** E6, E9, E10 ve E13 açık testleri geçer ve yalnızca Müfettiş yakalar. "Altı yeşil, bitti" hissi bu yüzden tehlikelidir; editördeki "Müfettiş'e gönder" düğmesi açık testler yeşil olur olmaz parlar.
2. **E6 (`< 360`) ve E10 ("en az 1 saat") tohumlu setle de yakalanmaz** (0 / 10.000); onları yalnızca G8 ve G1 görür. Sabit gizli testlerin sınır bölgelerini (0 dakika, 6 saat sınırı, tam gün katları) tutması bu yüzden vazgeçilmezdir; tohumlu set bu bölgeleri yoklamak için tasarlanmamıştır.
3. **E13 (ezber) 26 vakadan yalnızca 7'sini geçer** (6 açık + G1) ve altı tohumlu vakanın hiçbirini geçemez; ezberleyen oyuncu Deneme'den öteye geçemez ve gelirinin tamamını kaybeder (§3.12).

"Usta'nın yönlendirmesi" sütunu Sokratik sorudur: çözümü yazmaz, yalnızca bakılacak yeri gösterir (KANON §8: en fazla "Örnek" kademesi). Cümle, kırmızı vaka kümesinin imzasından seçilir (yalnızca A3 kırmızıysa E5, A1-A2-A4 kırmızıysa E1 gibi); bu arama deterministiktir ve AI maliyeti sıfırdır. İmza tablodaki hiçbir hatayla eşleşmezse B3'ün Haiku tabanlı genel Sokratik ipucu devreye girer. E2'nin yazımı `Math.Ceiling(dakika / 60)` olduğunda derleme hatasına dönüşür; gerçek derleyici iletisi: *"error CS0121: Çağrı şu yöntem veya özellikler arasında belirsiz: 'System.Math.Ceiling(decimal)' ve 'System.Math.Ceiling(double)'"*. Bu kod Türkçe hata tablosunun adayıdır (B3 sahibidir): "`int` değeri `Ceiling`'e veriyorsun; `decimal` mi `double` mı olduğunu derleyici seçemiyor. Önce `double`'a çevir."

### 3.9 İpucu merdiveni (tam metin)

KANON §8: **Pusula → Fener → Taslak → Örnek**; içerik bankasından gelir, ücretsiz ve sınırsızdır, AI maliyeti yoktur. Kural şudur: her kademe bir öncekinin açılmasından sonra istenebilir (atlama yok), bekleme süresi yoktur; üç başarısız çalıştırmadan sonra Usta "Pusula ister misin?" diye *önerir* ama zorlamaz. İpucu istemeyen ilk deneme için **Berrak Zihin** (+%15 XP) kalır; ipucu kullanımı gelire, Savunma'ya ve rozetlere hiçbir etki yapmaz.

> **Pusula (hangi kavram).** "Bu iş emrinde üç ayrı iş var: (1) dakikayı 'başlayan saat'e çevirmek, (2) süreye göre tarife dilimini seçmek, (3) dilimin birim fiyatıyla çarpmak. Önce yalnızca ilkini çöz: 61 dakika kaç başlayan saattir? 120 dakika? 121 dakika?"

> **Fener (hangi durum, hangi satır).** "Dilimi yuvarlanmış saat değil, ham dakika belirler (Sözleşme madde 2): 119 dakika hâlâ '2 saatten az', 120 dakika artık '2–6 saat'. Başlayan saat için Ders 1.2'deki kalıbı kullan: tam sayı bölmesinden önce bölenin bir eksiğini ekle. 24 saatten sonrası için aynı kalıp 1440 ile gerekir."

> **Taslak (sözde kod, eksik satırlar).**
> ```
> dakika 0 veya altındaysa -> 0 dön
> saat = ___   (başlayan saat, Ders 1.2 kalıbı)
> dakika < 120 ise -> saat x ___
> dakika <= 360 ise -> saat x ___
> aksi halde: gun = ___   (başlayan gün) -> gun x ___
> ```

> **Örnek (benzer ama farklı bir problem).** "Bisiklet kiralama: 45 dakikadan az, başlayan her 15 dakika 10 TL; 45–180 dakika (sınırlar dâhil), başlayan her 30 dakika 15 TL; 180 dakikayı aşan, başlayan gün × 120 TL."
> ```csharp
> public static int BisikletUcreti(int dakika)
> {
>     if (dakika <= 0) return 0;
>     if (dakika < 45)   return (dakika + 14) / 15 * 10;
>     if (dakika <= 180) return (dakika + 29) / 30 * 15;
>     return (dakika + 1439) / 1440 * 120;
> }
> ```

Örnek, Otopark'ın cevabı değil aynı şemanın başka bir yüzüdür: birim, eşikler ve fiyatlar değişmiştir. Kod çalıştırıldı: 20 dk → 20 TL, 44 → 30, 45 → 30, 180 → 90, 181 → 120, 1.441 → 240 (§9, `ORN-OP`). Oyuncu bu kalıbı Otopark'a çevirirken sınırları ve birimleri kendisi yeniden kurmak zorundadır; ipucu merdiveni cevabı vermez, desen verir.

### 3.10 Usta Yorumu örnekleri

Usta Yorumu iki yerde çıkar: (1) oyuncu kırmızı testlerle "Usta'ya sor" derse Sokratik bir yönlendirme (Kurul kotasına sayılır, çözüm yazmaz); (2) tüm testler yeşil olunca otomatik **kod incelemesi** (bonus 10–30 XP, gelire etkisi yok; KANON §3.3). Biçim sabittir: **1 doğru şey + 1 eksik + 1 sonraki adım**, ≤80 kelime, isimle hitap, emoji yok; "Aferin" yerine süreç övgüsü; hata dili "henüz değil; şu satıra bak" (A-vizyon-FINAL §10). Usta gizli girdiyi bilmez; yalnızca açık testleri ve Müfettiş kategorisini kullanır.

**Hatalı çözüm için (E5, yalnızca A3 kırmızı).**

> **Usta Defne → Ayşe.** "Ayşe, `(dakika + 59) / 60` kalıbıyla başlayan saati doğru saymışsın; işin zor yarısını bitirdin. Henüz değil ama: 120 dakikada kodun 200 TL döndürüyor, Sözleşme Kartı 80 diyor. Sınır satırına dön: tam 2 saat hangi dilimde? `<` ile `<=` arasındaki seçimi iki sayıyı yan yana yazarak yeniden yap."

**Doğru çözüm için (26/26 yeşil, kod incelemesi, +20 XP).**

> **Usta Defne → Ayşe.** "Ayşe, bütün testler yeşil; `(dakika + 59) / 60` kalıbını kendi başına kurman süreç olarak güzel. Eksik: 100, 40 ve 250 sayıları kodun içinde anlamsız duruyor; yarın Hasan Abi fiyatı değiştirirse hepsini aramak zorunda kalırsın. Sonraki adım: bu sayıları müşterinin sözcükleriyle adlandırılmış `const int` değerlere çevir."

İki örnek de 80 kelimenin altındadır (kelime sayımı: 48 ve 46). İkincisinin XP'si (20) B3'ün kod incelemesi rubriğine bağlıdır; bu belge yalnızca 10–30 aralığını sabitler.

### 3.11 Hata Bildirimi mutasyon kataloğu

Hata Bildirimi görevleri (günde 3; KANON §3.3, §4) referans çözüme havuzdan **tek bir mutasyon** enjekte ederek üretilir (A-vizyon-FINAL §7). Otopark L1 kataloğu **8 mutasyon** ve **2 eşdeğer mutant** içerir. Her mutasyonun bir Müfettiş cümlesi (Müfettiş'in tek resmî cümlesi biçiminde: B1 §8.3), bir beklenen açıklama ve bir zorluk/ödül sınıfı vardır. "Yanlış sonuç veren girdiler" sütunu 0–4.400 dakika taranarak ölçülmüştür (§9).

| Kod | Sınıf · Bayt | Değişen satır | Müfettiş cümlesi | Beklenen açıklama |
|---|---|---|---|---|
| M1 | Kolay · 40 B | `if (dakika < 120)` → `if (dakika <= 120)` | "Müşteri tam 2 saat için 200 TL ödemiş." | 2 saatten az sınırı dâhil sayılmış; tam 120 dakika 2. dilime girmeli (alt sınır dâhil), oysa 1. dilimde 2 × 100 = 200 hesaplanıyor. |
| M2 | Kolay · 40 B | `if (dakika <= 360)` → `if (dakika < 360)` | "Müşteri tam 6 saat için 250 TL ödemiş." | 6 saat üst sınırı dâhil olmalı; 360 günlük dilime düşüp 250 hesaplanıyor, 6 × 40 = 240 olmalı. |
| M6 | Kolay · 40 B | `int gun = (dakika + 1439) / 1440; return gun * 250;` → `return 250;` | "Müşteri 2.880 dakika için 250 TL ödemiş." | Günlük dilimde başlayan gün sayılmıyor; 24 saati aşan her kalış tek gün ücretiyle kapanıyor. |
| M3 | Orta · 60 B | `int saat = (dakika + 59) / 60;` → `(dakika + 60) / 60` | "Müşteri tam 1 saat için 200 TL ödemiş." | Tam saat katlarında bir fazla saat sayılıyor; 60 eklemek artık yokken de yukarı yuvarlar. Doğru kalıp 59. |
| M4 | Orta · 60 B | `int gun = (dakika + 1439) / 1440;` → `int gun = dakika / 1440 + 1;` | "Müşteri 1.440 dakika için 500 TL ödemiş." | Tam gün katlarında fazladan gün sayılıyor; "taban + 1" yalnızca artık varken doğrudur. |
| M7 | Orta · 60 B | `return saat * 40;` → `return dakika / 60 * 40;` (2. dilimde) | "Müşteri 121 dakika için 80 TL ödemiş." | 2. dilimde yukarı yuvarlama atlanmış; `saat` değişkeni dururken ham bölme kullanılmış. |
| M5 | Zor · 90 B | `if (dakika < 120)` → `if (saat < 2)` | "Müşteri 61 dakika için 80 TL ödemiş." | Dilim yuvarlanmış saatle seçilmiş; 61–119 dakika 2 saat sayıldığı için 2. dilime düşüyor, oysa dilimi ham dakika belirler (Madde 2). |
| M8 | Uzman · 120 B | `if (dakika <= 360)` → `if (dakika > 120 && dakika < 360)` | "İki müşteri: biri tam 2 saat, biri tam 6 saat için 250 TL ödemiş." | İki sınır birden dışarıda: 120 ve 360 ne 1. ne 2. dilimde, ikisi de günlük dilime düşüyor. |

Ölçüm (dotnet, §9): hangi vakaların kaldığı, tohumlu setin yakalama oranı ve yanlış sonuç veren girdiler.

| Kod | Kalan açık | Kalan gizli | Yanlış sonuç veren girdiler (0–4.400 dk) | Tohumlu setle yakalanma |
|---|---|---|---|---|
| M1 | A3 | — | n = 1: 120 | %0 |
| M2 | — | G8 | n = 1: 360 | %0 |
| M6 | A6 | G12, G13, G14 | n = 2.960: 1.441–4.400 | %100 |
| M3 | A3 | G4, G6, G8 | n = 6: 60, 120, 180, 240, 300, 360 | %50,2 |
| M4 | — | G11, G12 | n = 3: 1.440, 2.880, 4.320 | %49,8 |
| M7 | A4 | G7 | n = 236: 121–179, 181–239, 241–299, 301–359 | %100 |
| M5 | A2 | G5 | n = 59: 61–119 | %51 |
| M8 | A3 | G8 | n = 2: 120, 360 | %0 |

**Eşdeğer mutantlar.** Katalog yalnızca *öldürülebilen* mutantları barındırır. İki mutant hiçbir testle ve 0–300.000 dakika süpürmesinde bile öldürülemedi: **EQ1** `if (dakika <= 0) return 0;` satırını siler (girdi ≥ 0 iken `(0 + 59) / 60 = 0` olduğundan davranış aynıdır; yalnızca sözleşme dışı `-200` girdisinde fark çıkar: −200 TL). **EQ2** `dakika <= 360` yerine `saat <= 6` yazar (`ceil(d / 60) ≤ 6 ⟺ d ≤ 360`). İkisi de katalogdan çıkarılır; EQ2 ayrıca D1 Savunma sorusundaki "ham dakikayı neden seçtin" tartışmasına örnek olur.

**Seçim kuralları.** (1) Aynı oyuncuya aynı mutasyon 7 gün içinde tekrar etmez. (2) Günlük 3 görev farklı zorluk sınıflarından çekilir; sekiz mutasyonun Bayt ortalaması (3 × 40 + 3 × 60 + 90 + 120) ÷ 8 = **63,75 B**'dir, B2 §5.1'in "ortalama ≈60 B" varsayımına uyar. (3) Oyuncunun düzeltmesi derlenir ve 26 vakanın hepsini (6 açık + 14 gizli + görev tohumundan 6 tohumlu) geçmek zorundadır. (4) Mutasyon operatörleri beş sınıftır: ilişkisel operatör (`<` ↔ `<=`), sabit kayması (`+59` → `+60`), yuvarlama yöntemi (`ceil` → `taban + 1`), değişken ikamesi (`saat` → `dakika / 60`) ve koşul ikamesi (`dakika` → `saat`). Aynı operatörler Manav, Oto Yıkama ve Kütüphane'de yeniden kullanılır (§6.3).

### 3.12 Sentetik trafik ve gelir

İşletme geliri, oyuncu kodunun sentetik trafikte ürettiği TL'dir ve referans çözümle tavanlanır (KANON §4; B2 §8.2). Bu bölüm iki iş yapar: B2'nin L1–L5 hedeflerini (220 / 350 / 560 / 900 / 1.440 B/gün) üreten **trafik profillerini** tanımlar ve hataların gelire **yansıma** miktarını ölçer.

Trafik, `SHA-256(işletme + gün)` tohumundan her gece üretilir: araç başına dilim kümülatif olasılıkla seçilir ve dakika dilim içinde tekdüze çekilir (1–119, 120–360, 361–1.440, 1.441–2.880). Aşağıdaki değerler **beklenen** değerdir (tam sayımla, örnekleme gürültüsüz); B2 hedefi de beklenen değerdir. L1 için ek olarak 5.000 günlük deterministik simülasyon da çalıştırıldı (aşağıda).

| Profil | Parametreler | E[TL/araç] | Beklenen TL/gün | Beklenen B/gün | B2 hedefi (B/gün) | Sapma |
|---|---|---|---|---|---|---|
| Otopark L1 | 12 araç; dilim 45/35/18/2; dakika dilim içinde tekdüze (1–119, 120–360, 361–1.440, 1.441–2.880) | 185,17 | 2.222 | 222,2 | 220 | +%1,0 |
| Otopark L2 | 20 araç; L1 dilimleri; %5 abone (ücretsiz) → çarpan 0,95 | 185,17 | 3.518 | 351,8 | 350 | +%0,5 |
| Otopark L3 | 30 araç; dilim 40/33/22/5; %85 Normal, %8 Engelli, %7 Elektrikli (yarı fiyat) → çarpan 0,925 | 199,10 | 5.525 | 552,5 | 560 | −%1,3 |
| Otopark L4 | 40 araç; dilim 27/30/31/12 (son dilim 1.441–2.880); giriş dakikası tekdüze 0–1.439; gece sabit 150 | 231,08 | 9.243 | 924,3 | 900 | +%2,7 |
| Otopark L5 | 50 araç; dilim 15/25/40/20 (son dilim 1.441–4.320); kapasite aşımı yok sayıldı | 292,33 | 14.617 | 1.461,7 | 1.440 | +%1,5 |
| Büfe L1 | 100 satış; menü: su 7,50 (%13), çay 10,00 (%19), simit 12,50 (%20), ayran 15,00 (%10), tost 45,00 (%16), sandviç 60,00 (%13), kahvaltı tabağı 95,00 (%9) | 30,42 (ortalama) | 3.042 | 304,2 | 300 | +%1,4 |
| Manav L1 | 28 müşteri; kiloFiyati {25, 30, 40, 60} eşit; kilo 1 (%20), 2 (%25), 3 (%20), 5 (%15), 7 (%10), 10 (%6), 12 (%4) | 136,72 (ortalama) | 3.828 | 382,8 | 380 | +%0,7 |
| Kargo L1 | 60 raf; 0 koli %8, 1–20 koli %72, 21–30 koli %20 (tekdüze) | 81,56 (ortalama) | 4.894 | 489,4 | 500 | −%2,1 |

Okuma: L1 profili A-vizyon-FINAL §7'nin sayısını doğrular (araç başına ≈185 TL, 12 araçla 2.222 TL, 222 B; hedef 220 B). L2'nin %5 abonesi 20 araçta ortalama 1 ücretsiz araçtır. L3–L5 profilleri **B5 önerisidir**: ×1,6 kuralına uyması için kalış dağılımı uzun kalışa kaydırıldı (çok katlı otoparkın uzun park çekmesi, kapasite 50'li otoparkın günlük kalışlarla dolması). Kaydırmalar Ek A'dadır.

**Günlük dalgalanma.** L1'de araç başına σ = 71,8 TL, 12 araçlık günün σ'sı 249 TL'dir (±%11,2); 7 günlük ortalamada ±%4,2'ye iner. Yani B2'nin "≈220 B/gün" değeri bir gün için garanti değil, haftalık beklentidir. Kasa ritmi (8 saat, günde 3 toplama; B2 §8.3) bu gürültüyü zaten emer.

**5.000 günlük simülasyon** (deterministik tohum, 12 araç/gün): referans ortalama **2.220 TL/gün (σ = 248 TL), 222,0 B/gün**.

**Hataların gelire yansıması.** Aşağıdaki tablo her hatanın L1 trafiğinde günde ortalama kaç TL fark yarattığını ve gün içinde en az bir araçta farklı ücret çıkma olasılığını verir (şikâyet balonunun görünme olasılığı).

| Kod | Hata | Gelir etkisi (TL/gün) | Günde en az bir araçta farklı ücret | Gelire görünürlüğü |
|---|---|---|---|---|
| M1 | `<` → `<=` (2 saat) | 2,1 | %1,7 | fazla ücret; görünmez |
| M2 | `<=` → `<` (6 saat) | 0,2 | %1,7 | fazla ücret; görünmez |
| M3 | `+59` → `+60` | 8,0 | %12,5 | fazla ücret; ara sıra |
| M4 | gün: `taban + 1` | 0,5 | %0,2 | fazla ücret; görünmez |
| M5 | dilim yuvarlanmış saatle | -321,3 | %95,2 | eksik ücret; her gün |
| M6 | günlük sabit 250 | -60,0 | %21,5 | eksik ücret; ara sıra |
| M7 | 2. dilimde `dakika / 60` | -164,5 | %99,4 | eksik ücret; her gün |
| M8 | iki sınır birden | 3,1 | %3,4 | fazla ücret; görünmez |
| E1 | saat: `dakika / 60` | -700,0 | %100 | eksik ücret; her gün |
| E2 | `Ceiling((double)(d / 60))` | -1.299,4 | %100 | eksik ücret; her gün |
| E3 | `Math.Round` | -559,9 | %99,9 | eksik ücret; her gün |
| E8 | gün: `dakika / 1440` | -599,5 | %93,1 | eksik ücret; her gün |
| E10 | en az 1 saat | 0 | %0 | —; görünmez |
| E11 | `else if` sırası | -484,6 | %99,9 | eksik ücret; her gün |
| E12 | `&&` yerine `\|\|` | 545,0 | %100 | fazla ücret; her gün |
| E13 | ezber | -2.204,3 | %100 | eksik ücret; her gün |

Üç sonuç. **(1) Sınır hataları gelire yansımaz.** M1, M2, M4, M8 ve E10 günde en çok +3,1 TL oynatır ve şikâyet olasılıkları %0–3,4'tür. Gelir tavanı ve gece batch'inin şikâyet balonu bu hataları göremez; yalnızca sabit gizli testler ve Hata Bildirimi görür. **Gizli testler ve Savunma, "gelir güvenliği"nden bağımsız olarak "öğrenme güvenliği" için vazgeçilmezdir.** **(2) Yuvarlama ve dilim hataları gelire fazlasıyla yansır:** M5 −321 TL/gün (≈%14), E1 −700 TL/gün (≈%31); oyuncu bu hatayı kasasından anlar ve eksik ücret şikâyeti alır. **(3) Fazla ücret yazan hatalar tavana çarpar:** M3 (+8), E12 (+545) fazla kazanç getirmez, "fazla ücret şikâyeti" doğurur (B2 §8.2 kural 3).

**Tavan biçimi ve dengeleyici hata.** B2 §8.2 tavanı toplamda uygular: `min(Σoyuncu, Σreferans)`. Bu, bir dilimde eksik, diğerinde fazla ücret yazan *dengeleyici* bir çözümü ödüllendirir. Deney: 61–119 dakika için 100 TL (eksik) ve 361–1.440 dakika için 374 TL (fazla) döndüren çözüm ham toplamda referansla aynı düzeydedir (2.224 ve 2.220 TL/gün). Toplam tavan ona referans gelirin **%95,7**'sini (2.124 TL/gün) verir; araç başına tavan `Σ min(oyuncu_i, ref_i)` **%88,1**'ine (1.956 TL/gün) indirir. Gece batch'inde araç başına `Math.Min` zaten aynı döngüdedir, yani önlem bedelsizdir; B2 §8.2'nin buna çevrilmesi **Ek A**'da önerildi.

### 3.13 Otopark L2 — Abone Listesi

**Kapı.** Yükseltme 500 B, 150 XP (KANON §3.3, §4); kavram Liman dersi (`List<T>`; B2 varsayımı 8: Liman 2.1). Gelir 350 B/gün (14,6 B/saat). Görsel ek: ikinci şerit ve plaka okuyucu, Vitrin açılır (B1 §6.3).

> **Hasan Abi:** "Aylık abonelerimin plakaları bir listede duruyor. Onlar ödemesin; diğerleri eskisi gibi."

**Sözleşme.**

1. İmza: `public static int Otopark.UcretHesapla(int dakika, string plaka, List<string> aboneler)`. L1 metodu aynen kalır (aşırı yükleme).
2. `plaka` boş olmayan, büyük harfli, boşluksuz bir dizedir (plaka okuyucu normalleştirir): `"34ABC123"`.
3. `aboneler` hiçbir zaman `null` değildir (boş liste olabilir); aynı plaka birden çok kez yazılmış olabilir.
4. Plaka `aboneler` içinde **tam eşleşmeyle** bulunuyorsa ücret **0**'dır: süre ne olursa olsun, 24 saati aşan dâhil.
5. Aksi halde L1 tarifesi aynen uygulanır (L1 Sözleşme maddeleri 1–4).
6. Eşleşme tam eşitliktir: `"34ABC12"` ve `"34ABC1234"`, abone `"34ABC123"` ile eşleşmez.

| Açık | dakika | plaka | aboneler | TL | Gerekçe |
|---|---|---|---|---|---|
| A1 | 30 | 34ABC123 | [34ABC123] | 0 | abone, kısa kalış |
| A2 | 30 | 06XYZ789 | [34ABC123] | 100 | abone değil → L1 |
| A3 | 121 | 34ABC123 | [06XYZ789, 34ABC123] | 0 | listenin sonundaki abone |
| A4 | 361 | 35DEF456 | [] | 250 | boş liste |
| A5 | 120 | 06XYZ789 | [34ABC123, 35DEF456] | 80 | iki aboneli listede abone olmayan |

| Gizli | dakika | plaka | aboneler | TL | Gerekçe |
|---|---|---|---|---|---|
| G1 | 1.441 | 34ABC123 | [34ABC123] | 0 | 24 saati aşan abone yine ödemez |
| G2 | 120 | 34ABC12 | [34ABC123] | 80 | önek eşleşmesi değil |
| G3 | 0 | 06XYZ789 | [06XYZ789] | 0 | abone ve sıfır süre |
| G4 | 2.881 | 34ABC1234 | [34ABC123] | 750 | abone plakası içinde geçen daha uzun plaka |

| Kademe | İpucu |
|---|---|
| Pusula | "İki iş var: plakanın abone listesinde olup olmadığına bakmak, olmadıysa eski tarifeyi kullanmak. Bir listede değer var mı diye soran hazır bir metot düşün." |
| Fener | "`List<string>` tipinin 'içeriyor mu' sorusunu cevaplayan metoduna bak. Abone ise süre hiç önemli değil; abone değilse zaten yazdığın `UcretHesapla(dakika)` işe yarar." |
| Taslak | `abone ise -> 0 dön` / `değilse -> L1 ücretini dön` |
| Örnek | "Yasaklı kelime listesi: `bool Yasakli(string kelime, List<string> liste) => liste.Contains(kelime);` `Yasakli("kedi", …)` true, `"kuş"` false, `"kediler"` false." (doğrulandı: `ORN-L2`) |

**Referans çözüm** (`Otopark` sınıfında, L1 metodunun yanına eklenen aşırı yükleme; L1 metodu aynen durur).

```csharp
public static int UcretHesapla(int dakika, string plaka, List<string> aboneler)
{
    if (aboneler.Contains(plaka)) return 0;   // abone: kalış süresi ne olursa olsun ödemez
    return UcretHesapla(dakika);              // diğerleri: L1 tarifesi aynen
}
```

**Tuzaklar.** En sık hata yönü tersine çevirmektir: `aboneler.Any(a => plaka.Contains(a))` abone plakasını *içeren* her plakayı abone sayar. Dotnet çalıştırması: bu hata G4'te 0 TL döndürür (beklenen 750) ve G2'de doğru çıkar (80); yani G2 tek başına yetmez, G4 gereklidir (§9).

### 3.14 Otopark L3 — İndirim ve Bozuk Kayıt

**Kapı.** Yükseltme 1.200 B, 250 XP; kavram Atölyeler dersi (`enum`, `exception`; B4 kapısı: Atölyeler 3.4 (KANON §12.3)). Gelir 560 B/gün (23,3 B/saat). Görsel ek: ikinci kat, engelli ve şarj yerleri.

> **Hasan Abi:** "Engelli ve elektrikli araçlara yarı fiyat. Bir de bariyer bazen bozuk kayıt gönderiyor: eksi süre ya da bilmediğim bir tür kodu gelirse sistem hata versin, sessizce para yazmasın."

**Sözleşme.**

1. `public enum AracTuru { Normal, Engelli, Elektrikli }` ve `public static int Otopark.UcretHesapla(int dakika, AracTuru tur)`.
2. **Önce `dakika` doğrulanır:** `dakika < 0` → `ArgumentOutOfRangeException`, parametre adı `"dakika"`. 0 geçerlidir.
3. **Sonra `tur` doğrulanır:** tanımlı olmayan değer → `ArgumentOutOfRangeException`, parametre adı `"tur"`.
4. `Normal`: L1 ücreti aynen. `Engelli` ve `Elektrikli`: L1 ücretinin %50'si.
5. Yuvarlama sorusu çıkmaz: L1 ücretleri 0–300.000 dakikada hep çifttir (tek sayı sayısı 0, §9), yarısı tam sayıdır. Oyuncu bunu Gereksinim Netleştirme'de "yarım TL çıkar mı?" diye sorarak bulabilir; cevap verilerden doğrulanır.
6. İleti metni serbesttir; test yalnızca tipi ve parametre adını arar.

| Açık | dakika | tur | Beklenen | Gerekçe |
|---|---|---|---|---|
| A1 | 120 | Normal | 80 | indirimsiz |
| A2 | 120 | Engelli | 40 | yarı fiyat |
| A3 | 61 | Elektrikli | 100 | 200'ün yarısı |
| A4 | 1.441 | Engelli | 250 | 500'ün yarısı |
| A5 | −1 | Normal | `ArgumentOutOfRangeException("dakika")` | bozuk kayıt |

| Gizli | dakika | tur | Beklenen | Gerekçe |
|---|---|---|---|---|
| G1 | 0 | Engelli | 0 | sıfır geçerli |
| G2 | 60 | `(AracTuru)7` | `ArgumentOutOfRangeException("tur")` | tanımsız tür |
| G3 | −5 | `(AracTuru)7` | `ArgumentOutOfRangeException("dakika")` | doğrulama sırası: önce dakika |
| G4 | 360 | Elektrikli | 120 | üst sınır dâhil, yarısı |
| G5 | 30 | Engelli | 50 | 100'ün yarısı |

| Kademe | İpucu |
|---|---|
| Pusula | "Üç şey var: araç türünü bir `enum` ile ifade etmek, indirimi uygulamak, geçersiz girdide hata fırlatmak. Hangisinin önce kontrol edileceği sözleşmede yazıyor." |
| Fener | "Önce `dakika`, sonra `tur` kontrol edilir (madde 2–3). Hata için `throw new ArgumentOutOfRangeException(nameof(dakika))` kalıbı; tanımsız `enum` değeri için `Enum.IsDefined`." |
| Taslak | `dakika < 0 ise -> hata(dakika)` / `tur tanımsızsa -> hata(tur)` / `ucret = L1(dakika)` / `Normal ise ucret, değilse ucret / 2` |
| Örnek | "Yaş kontrolü: `if (yas < 0) throw new ArgumentOutOfRangeException(nameof(yas));` `YasKontrol(-1)` hata verir, `YasKontrol(0)` geçer." (doğrulandı: `ORN-L3`) |

**Referans çözüm** (`Otopark` sınıfında, L1 metodunun yanına eklenen aşırı yükleme; L1 metodu aynen durur).

```csharp
public enum AracTuru { Normal, Engelli, Elektrikli }
```

```csharp
public static int UcretHesapla(int dakika, AracTuru tur)
{
    if (dakika < 0)
        throw new ArgumentOutOfRangeException(nameof(dakika), dakika, "Süre negatif olamaz.");
    if (!Enum.IsDefined(tur))
        throw new ArgumentOutOfRangeException(nameof(tur), tur, "Bilinmeyen araç türü.");

    int ucret = UcretHesapla(dakika);
    return tur == AracTuru.Normal ? ucret : ucret / 2;   // L1 ücretleri hep çift: yarısı tam sayı
}
```

**Tuzaklar.** `ucret * 0.5` yazan oyuncu `double` → `int` dönüşüm hatası (CS0266) alır; `(int)` ekleyince çalışır, çünkü L1 ücretleri çifttir. `if (tur == Engelli || tur == Elektrikli)` yazıp tanımsız türü sessizce normal saymak G2'yi kırar; doğrulama sırasını ters yazmak G3'ü kırar. İstisna testinde ileti metni karşılaştırılmadığından Türkçe ileti yazan oyuncu cezalandırılmaz.

### 3.15 Otopark L4 — Gece Tarifesi

**Kapı.** Yükseltme 2.500 B, 400 XP; kavram Kampüs dersi (`DateTime`, `TimeSpan`). Gelir 900 B/gün (37,5 B/saat). Görsel ek: dört aydınlatma direği, "GECE TARİFESİ 150" neon şeridi.

> **Hasan Abi:** "Gece 22:00'den sabah 06:00'ya kadar gelenlere sabit 150. Gece gelen kısa durmaz zaten; ne kadar kalırsa kalsın sabaha kadar 150. Sabahı aşarsa normal tarife."

**Sözleşme.**

1. İmza: `public static int Otopark.UcretHesapla(DateTime giris, DateTime cikis)`.
2. Saniye ve milisaniye 0'dır; saat Türkiye saatidir (UTC+3, yaz saati uygulaması yok), `DateTime.Kind` önemsizdir.
3. `cikis < giris` → `ArgumentOutOfRangeException`, parametre adı `"cikis"`.
4. Süre `dakika = (int)(cikis - giris).TotalMinutes`; `dakika == 0` → 0.
5. **Gece girişi:** giriş saati `22:00 ≤ t` ya da `t < 06:00` (22:00 dâhil, 06:00 hariç).
6. Gece girişi **ve** çıkış, girişten sonraki ilk 06:00'ı aşmıyorsa (`cikis ≤ 06:00`, 06:00 dâhil) ücret **sabit 150**'dir; süre kaç olursa olsun, kısa gece kalışı da 150.
7. Diğer her durumda L1 tarifesi, *toplam* süreye göre.

| Açık | giriş | çıkış | Beklenen | Gerekçe |
|---|---|---|---|---|
| A1 | 03-10 23:00 | 03-11 05:00 | 150 | gece yarısını aşan gece kalışı (L1 olsaydı 240) |
| A2 | 03-10 14:00 | 03-10 14:30 | 100 | gündüz → L1 |
| A3 | 03-10 21:59 | 03-11 05:00 | 250 | giriş gece penceresinin bir dakika öncesi (421 dk → günlük) |
| A4 | 03-10 22:00 | 03-11 06:00 | 150 | iki sınır birden dâhil |
| A5 | 03-10 12:00 | 03-10 11:00 | `ArgumentOutOfRangeException("cikis")` | çıkış girişten önce |

| Gizli | giriş | çıkış | Beklenen | Gerekçe |
|---|---|---|---|---|
| G1 | 03-10 23:00 | 03-11 06:01 | 250 | sabahı bir dakika aşıyor → normal tarife (421 dk) |
| G2 | 03-10 00:30 | 03-10 05:30 | 150 | gece yarısından *sonra* giren (aynı takvim günü) |
| G3 | 03-10 06:00 | 03-10 08:00 | 80 | 06:00 gündüzdür; pencere dışı |
| G4 | 03-10 18:00 | 03-10 18:00 | 0 | sıfır süre |
| G5 | 03-10 23:00 | 03-12 23:00 | 500 | gece girişi ama sabahı çok aşan 2 gün → L1 |
| G6 | 03-10 05:59 | 03-10 06:00 | 150 | gece penceresinin son dakikası, çıkış 06:00 dâhil |

(Tüm tarihler 2026; `giris`/`cikis` JSON'da ISO-8601, saniye 0.)

| Kademe | İpucu |
|---|---|
| Pusula | "İki iş: iki `DateTime` arasındaki farkı dakikaya çevirmek ve girişin gece penceresinde olup olmadığına karar vermek. Pencere gece yarısını aşıyor: ya `22:00` ve sonrası ya da `06:00`'dan önce." |
| Fener | "`giris.TimeOfDay` ile `TimeSpan.FromHours(22)` karşılaştır. 'Girişten sonraki ilk 06:00' için `giris.Date.AddHours(6)` kur; giriş 22:00'den sonraysa bir gün ekle. Çıkış bu sabahı aşmıyorsa 150." |
| Taslak | `cikis < giris -> hata(cikis)` / `dakika = fark` / `dakika == 0 -> 0` / `geceGirisi mi?` / `sabah = ilk 06:00` / `cikis <= sabah -> 150` / `aksi: L1(dakika)` |
| Örnek | "Mesai saati (09:00–18:00): `t.TimeOfDay >= TimeSpan.FromHours(9) && t.TimeOfDay < TimeSpan.FromHours(18)`. 08:59 false, 09:00 true, 17:59 true, 18:00 false." (doğrulandı: `ORN-L4`) |

**Referans çözüm** (`Otopark` sınıfında, L1 metodunun yanına eklenen aşırı yükleme; L1 metodu aynen durur).

```csharp
public static int UcretHesapla(DateTime giris, DateTime cikis)
{
    if (cikis < giris)
        throw new ArgumentOutOfRangeException(nameof(cikis), cikis, "Çıkış girişten önce olamaz.");

    int dakika = (int)(cikis - giris).TotalMinutes;
    if (dakika == 0) return 0;

    TimeSpan saat = giris.TimeOfDay;
    bool geceGirisi = saat >= TimeSpan.FromHours(22) || saat < TimeSpan.FromHours(6);
    if (geceGirisi)
    {
        DateTime sabah = giris.Date.AddHours(6);          // girişten sonraki ilk 06:00
        if (saat >= TimeSpan.FromHours(22)) sabah = sabah.AddDays(1);
        if (cikis <= sabah) return 150;                   // gece tarifesi: sabit
    }
    return UcretHesapla(dakika);                          // aksi halde L1 tarifesi
}
```

**Tuzaklar** (dotnet'te çalıştırıldı, §9). `giris.Hour >= 22 && giris.Hour < 6` hiçbir saati kapsamaz (gece yarısı boşluğu) ve gece vakalarının hepsini kırar: kalan A1, A4, G2, G6. `cikis < sabah` (06:00 çıkışını dışarıda bırakmak) yalnızca A4 ve G6'yı kırar. `(cikis - giris).Minutes` (toplam değil bileşen) A1, A3, A4, G1, G2, G3, G5'i kırar. Gece girişini yalnızca aynı takvim gününde tanımak A1 ve A4'ü kırar (gece yarısını aşan kalış). Referans çözümün `DateTime` sürümü 200 çift üzerinde aritmetik bir eşdeğeriyle (trafik profili hesabında kullanılan) karşılaştırıldı: fark 0.

### 3.16 Otopark L5 — Kapasite ve Kuyruk

**Kapı.** Yükseltme 5.000 B, 600 XP; kavram Finans dersi (durum taşıyan sınıf, `Queue<T>`, `Task`). Gelir 1.440 B/gün (60 B/saat). Görsel ek: otomat, "DOLU/BOŞ" sayacı, bekleme şeridi.

> **Hasan Abi:** "Kapasitem 50 araç. Doluysa kapıda bekleyenler sıraya girsin, en fazla 10 araç; sıra da doluysa 'yer yok' deyip çevir. Biri çıkınca sıradaki ilk araç içeri girsin. Sıradan vazgeçen olursa onu sıradan sil."

İş Emri iki parçadır: **(a)** senkron yönetici ve **(b)** `Task` ile bekleme. İkisi de 600 XP'ye dâhildir.

**Sözleşme (a).**

1. Sınıf `KapasiteYoneticisi(int kapasite = 50, int kuyrukLimiti = 10)`. `Giris(string plaka) : GirisSonucu { Kabul, Kuyrukta, Reddedildi, Zaten }`. `Cikis(string plaka) : CikisSonucu { Cikti, KuyrukVazgecti, Bilinmiyor }`. Özellikler: `Iceride` (int) ve `Kuyruk` (sıralı, salt okunur liste).
2. Plaka içeride ya da kuyruktaysa `Zaten`; durum değişmez.
3. Yer varsa `Kabul`; yer yoksa ve kuyruk limiti dolmamışsa `Kuyrukta`; ikisi de doluysa `Reddedildi`.
4. İçerideki araç çıkınca `Cikti`; kuyruk boş değilse **ilk gelen** araç içeri alınır (ilk giren ilk çıkar).
5. Kuyruktaki plaka `Cikis` çağırırsa `KuyrukVazgecti`, kalan sıra korunur. Hiçbirinde olmayan plaka `Bilinmiyor`.
6. Her senaryo yeni örnekle başlar (durum sızmaz).

| Açık | kap/kuyruk | işlemler (G giriş, C çıkış) | Beklenen sonuçlar · içeride · kuyruk |
|---|---|---|---|
| A1 | 2 / 1 | G:A G:B | Kabul, Kabul · 2 · [] |
| A2 | 2 / 1 | G:A G:B G:C | Kabul, Kabul, Kuyrukta · 2 · [C] |
| A3 | 2 / 1 | G:A G:B G:C G:D | Kabul, Kabul, Kuyrukta, Reddedildi · 2 · [C] |
| A4 | 2 / 2 | G:A G:B G:C G:D C:A | Kabul, Kabul, Kuyrukta, Kuyrukta, Cikti · 2 · [D] |
| A5 | 1 / 1 | G:A G:A | Kabul, Zaten · 1 · [] |

| Gizli | kap/kuyruk | işlemler | Beklenen sonuçlar · içeride · kuyruk |
|---|---|---|---|
| G1 | 1 / 3 | G:A G:B G:C G:D C:A C:B | Kabul, Kuyrukta, Kuyrukta, Kuyrukta, Cikti, Cikti · 1 · [D] (FIFO) |
| G2 | 1 / 2 | G:A G:B G:C C:B C:A | Kabul, Kuyrukta, Kuyrukta, KuyrukVazgecti, Cikti · 1 · [] |
| G3 | 2 / 1 | C:X | Bilinmiyor · 0 · [] |
| G4 | varsayılan 50 / 10 | 61 farklı plaka girişi | Kabul = 50, Kuyrukta = 10, Reddedildi = 1 · içeride 50 · kuyruk 10 |
| G5 | 1 / 2 | G:A G:B G:B | Kabul, Kuyrukta, Zaten · 1 · [B] |

**Sözleşme (b).** `AsyncKapasite(int kapasite)`; `Task<GirisSonucu> GirisBekleAsync()` yer varsa tamamlanmış `Kabul` döner, yoksa yer açılana kadar tamamlanmaz; `void Cikis()` bekleyenlerin ilkini (ilk giren ilk çıkar) tamamlar, yoksa yeri boşaltır. Testler: kap = 1 iken ilk giriş `IsCompleted = true`; ikinci giriş `IsCompleted = false`; `Cikis()` sonrası ikincisi `Kabul` ile tamamlanır (A1–A3); üç bekleyen ve iki çıkışta yalnızca ilk iki bekleyen sırayla tamamlanır (G1).

| Kademe | İpucu |
|---|---|
| Pusula | "Bu iş bir *durum* tutuyor: içeride kim var, sırada kim bekliyor. Tek bir metot değil, bir nesne yazıyorsun." |
| Fener | "İçeridekiler için `HashSet<string>`, sıra için 'ilk giren ilk çıkar' mantığı: `Queue<string>` ya da baştan silen bir `List<string>`. Sıradan vazgeçen ortadan çıkabilir; hangi tip bunu kolay yapıyor?" |
| Taslak | `Giris: içeride/kuyrukta -> Zaten; yer var -> Kabul; kuyruk boş yer -> Kuyrukta; yoksa Reddedildi` / `Cikis: içerideyse çıkar, kuyruğun ilkini al; kuyruktaysa sil; değilse Bilinmiyor` |
| Örnek | "Asansör kuyruğu: `Queue<string>`; `Enqueue("a")`, `Enqueue("b")`, `Dequeue()` → `"a"`, geriye `Count = 1`." (doğrulandı: `ORN-L5`) |

**Referans çözüm.**

```csharp
public enum GirisSonucu { Kabul, Kuyrukta, Reddedildi, Zaten }
```

```csharp
public enum CikisSonucu { Cikti, KuyrukVazgecti, Bilinmiyor }
```

```csharp
public sealed class KapasiteYoneticisi
{
    private readonly int _kapasite;
    private readonly int _kuyrukLimiti;
    private readonly HashSet<string> _iceride = new();
    private readonly List<string> _kuyruk = new();   // FIFO: başa ekleme yok, baştan alma var

    public KapasiteYoneticisi(int kapasite = 50, int kuyrukLimiti = 10)
    {
        _kapasite = kapasite;
        _kuyrukLimiti = kuyrukLimiti;
    }

    public int Iceride => _iceride.Count;
    public IReadOnlyList<string> Kuyruk => _kuyruk;

    public GirisSonucu Giris(string plaka)
    {
        if (_iceride.Contains(plaka) || _kuyruk.Contains(plaka)) return GirisSonucu.Zaten;
        if (_iceride.Count < _kapasite) { _iceride.Add(plaka); return GirisSonucu.Kabul; }
        if (_kuyruk.Count < _kuyrukLimiti) { _kuyruk.Add(plaka); return GirisSonucu.Kuyrukta; }
        return GirisSonucu.Reddedildi;
    }

    public CikisSonucu Cikis(string plaka)
    {
        if (_iceride.Remove(plaka))
        {
            if (_kuyruk.Count > 0)
            {
                _iceride.Add(_kuyruk[0]);   // sıradaki ilk araç içeri
                _kuyruk.RemoveAt(0);
            }
            return CikisSonucu.Cikti;
        }
        if (_kuyruk.Remove(plaka)) return CikisSonucu.KuyrukVazgecti;
        return CikisSonucu.Bilinmiyor;
    }
}
```

```csharp
public sealed class AsyncKapasite
{
    private readonly int _kapasite;
    private int _iceride;
    private readonly Queue<TaskCompletionSource<GirisSonucu>> _bekleyen = new();
    private readonly object _kilit = new();

    public AsyncKapasite(int kapasite) => _kapasite = kapasite;

    public Task<GirisSonucu> GirisBekleAsync()
    {
        lock (_kilit)
        {
            if (_iceride < _kapasite) { _iceride++; return Task.FromResult(GirisSonucu.Kabul); }
            var tcs = new TaskCompletionSource<GirisSonucu>(TaskCreationOptions.RunContinuationsAsynchronously);
            _bekleyen.Enqueue(tcs);
            return tcs.Task;
        }
    }

    public void Cikis()
    {
        lock (_kilit)
        {
            if (_bekleyen.Count > 0) _bekleyen.Dequeue().SetResult(GirisSonucu.Kabul);   // yer doğrudan devredilir
            else _iceride--;
        }
    }
}
```

**Tuzaklar.** `Queue<T>` ortadan silmeyi desteklemez; vazgeçen aracı silmek için kuyruğu yeniden kurmak ya da `List<T>` kullanmak gerekir (G2). Çıkışta kuyruktan *son* geleni almak G1'i kırar: dotnet çalıştırmasında sonuç `[Kabul, Kuyrukta, Kuyrukta, Kuyrukta, Cikti, KuyrukVazgecti]`, içeride 1, kuyruk `[C]` çıktı (beklenen `[…, Cikti, Cikti]`, kuyruk `[D]`). Varsayılan değerleri 50 ve 10 yapmamak G4'ü kırar. Asenkron tarafta `TaskCompletionSource` senkron devam ettirirse kilit altında beklenmedik yeniden giriş olur; referans çözüm `RunContinuationsAsynchronously` kullanır.

---

## 4. Büfe, Manav ve Kargo Deposu — L1 tam spec

Bu üç işletme MVP'de açıktır (KANON §5: #1 L1–L2, #2, #4; Manav "inşaat halinde" kalır ama Çarşı'nın üçüncü işletmesi olarak burada tam belgelenmiştir). Her biri Otopark L1'in şablonunu izler: İş Emri → Gereksinim Netleştirme (4 hazır soru) → Sözleşme Kartı → imza ve iskelet → açık ve gizli testler → ipuçları → referans çözüm → sentetik trafik. XP ve fiyatlar KANON'dandır: açılış 300 XP (T1), Deneme açılışı %50; hata bildirimi ve Savunma kuralları Otopark ile aynıdır. Tüm beklenen değerler ve hata kümeleri §9'daki çalıştırmada doğrulanmıştır.

### 4.1 Büfe L1 — Para Üstü (`bufe-L1`)

**Kapı.** Sev. 4, 600 B, Ruhsat 3/3 (B2 varsayımı: Çarşı 1.5–1.7). Gelir hedefi 300 B/gün (12,5 B/saat). Kavram: `decimal`, aritmetik, `while` ile bozukluk.

> **Melek Abla:** "Müşteri bir şey alıyor; ben fiyatı yazıyorum, müşterinin verdiği parayı da yazıyorum. Para üstünü en az parçayla, büyükten küçüğe söyle: 20, 10, 5 liralık; sonra bir lira, elli, yirmi beş, on, beş kuruş."

**Gereksinim Netleştirme (4 hazır soru).**

| # | Soru | Melek Abla'nın cevabı | Madde |
|---|---|---|---|
| S1 | "Hangi kupürler var?" | "20, 10, 5 liralık; 1 lira; 50, 25, 10, 5 kuruş. Bir kuruş yok." | 3 |
| S2 | "Fiyat kuruşlu olabilir mi?" | "Beş kuruşun katı: 12 lira 35 gibi." | 1 |
| S3 | "Para üstü yoksa ne yazacağım?" | "Boş bırak." | 4 |
| S4 | "Çıktı nasıl görünsün?" | "Adet, x, kupür: '2x1'. Aralarında tek boşluk." | 4 |

**Sözleşme Kartı.**

1. `fiyat` ve `verilen` `decimal`'dir; `fiyat > 0`, `verilen ≥ fiyat`, ikisi de 0,05'in katıdır, `verilen ≤ 200`.
2. Para üstü = `verilen − fiyat`.
3. Kupür sırası ve adları: `20`, `10`, `5`, `1`, `50kr`, `25kr`, `10kr`, `5kr`; en az parçayla, büyükten küçüğe.
4. Çıktı: `adet` + `x` + kupür adı, sıfır adetli kupür yazılmaz, parçalar tek boşlukla ayrılır; para üstü 0 ise boş dize.
5. İmza: `public static string Bufe.ParaUstu(decimal fiyat, decimal verilen)`.
6. Para `decimal` ile hesaplanır; `double` kullanılması sözleşme ihlalidir (testler `4,90 → 5` gibi vakalarda ayırt eder).

```csharp
// İş emri — Büfe (Çarşı) — Müşteri: Melek Abla
public static class Bufe
{
    // fiyat, verilen: TL (decimal). dönüş: "adet x kupür" parçaları, örn. "1x5 2x1 1x50kr"
    public static string ParaUstu(decimal fiyat, decimal verilen)
    {
        //#BASLA
        // kodun buraya
        //#BITIS
    }
}
```

| Açık | fiyat | verilen | Beklenen | Gerekçe |
|---|---|---|---|---|
| A1 | 12,35 | 20 | `"1x5 2x1 1x50kr 1x10kr 1x5kr"` | her tür kupürden bir miktar |
| A2 | 10 | 10 | `""` | para üstü yok |
| A3 | 3,50 | 5 | `"1x1 1x50kr"` | 1,50 |
| A4 | 99,95 | 100 | `"1x5kr"` | en küçük kupür; `double` ile `""` döner |
| A5 | 45 | 100 | `"2x20 1x10 1x5"` | yalnızca banknotlar |

| Gizli | fiyat | verilen | Beklenen | Gerekçe | Balon kategorisi |
|---|---|---|---|---|---|
| G1 | 4,90 | 5 | `"1x10kr"` | `double` tuzağı: 5 − 4,9 = 0,0999… | kuruşlu fiyatlar |
| G2 | 0,30 | 1 | `"1x50kr 2x10kr"` | 0,70 = 50 + 10 + 10 | küçük para üstleri |
| G3 | 0,05 | 200 | `"9x20 1x10 1x5 4x1 1x50kr 1x25kr 2x10kr"` | tüm kupürler, en büyük para üstü (199,95) | büyük para üstleri |
| G4 | 17,65 | 20 | `"2x1 1x25kr 1x10kr"` | 2,35 = 2 + 25kr + 10kr | kuruşlu fiyatlar |
| G5 | 6,40 | 10 | `"3x1 1x50kr 1x10kr"` | 3,60 | kuruşlu fiyatlar |

| Kademe | İpucu |
|---|---|
| Pusula | "Üç iş var: para üstünü bulmak (`verilen − fiyat`), en büyük kupürden başlamak, her kupürden kaç tane gerektiğini saymak." |
| Fener | "Parayı `decimal` yaz (`12.35m`); `double` kuruşları kaydırır. Her kupür için `while (kalan >= birim)` döngüsü: çıkar, sayacı artır. Sıfır adetli kupürü yazma." |
| Taslak | `kalan = verilen - fiyat` / `her kupür için (20, 10, 5, 1, 0,50, 0,25, 0,10, 0,05): adet = 0; kalan >= kupür olduğu sürece kalan -= kupür, adet++; adet > 0 ise sonuca "adetxkupür" ekle` |
| Örnek | "Rozet dağıtımı: 87 puanı 25'lik rozetlere böl. `while (puan >= 25) { puan -= 25; rozet++; }` sonucu 3 rozet, kalan 12." (doğrulandı: `ORN-BF`) |

**Referans çözüm.** Sekiz kupür tek `for` döngüsüyle gezilir; Çarşı düzeyinde `switch` ifadeleri kupür bilgisini taşır (dizi Liman'da öğrenilir; Büfe L2'nin başlığı bu yüzden "tekrarı diziye topla" iyileştirmesine bağlanabilir).

```csharp
public static string ParaUstu(decimal fiyat, decimal verilen)
{
    decimal kalan = verilen - fiyat;
    string sonuc = "";

    for (int i = 0; i < 8; i++)
    {
        decimal birim = i switch { 0 => 20m, 1 => 10m, 2 => 5m, 3 => 1m, 4 => 0.50m, 5 => 0.25m, 6 => 0.10m, _ => 0.05m };
        string etiket = i switch { 0 => "20", 1 => "10", 2 => "5", 3 => "1", 4 => "50kr", 5 => "25kr", 6 => "10kr", _ => "5kr" };

        int adet = 0;
        while (kalan >= birim)
        {
            kalan -= birim;
            adet++;
        }
        if (adet > 0)
            sonuc += (sonuc == "" ? "" : " ") + adet + "x" + etiket;
    }
    return sonuc;
}
```

**Doğrulama.** 5 açık + 5 gizli test geçti. `double` ile yazılan sürüm A4, G1, G2, G3 ve G5'te kalır (5 vaka). Sunucu tarafı gelir bağdaştırıcısı çıktı dizesini tutara çevirir ve `verilen − fiyat` ile eşleştirdi: sapma 0. Açgözlü yaklaşımın 0,05 TL adımıyla 0,05–200 TL arası **4.000 para üstü tutarının tümünde** en az parça sayısını verdiği dinamik programlamayla doğrulandı (en iyi olmayan: 0); kupür kümesi 5, 10, 25, 50, 100, 500, 1000, 2000 kuruştur.

**Sentetik trafik ve gelir.** Günde 100 satış; menü ağırlıkları: su 7,50 (%13), çay 10,00 (%19), simit 12,50 (%20), ayran 15,00 (%10), tost 45,00 (%16), sandviç 60,00 (%13), kahvaltı tabağı 95,00 (%9). Müşteri en küçük yeterli banknotu uzatır. Ortalama sepet 30,42 TL; **beklenen 3.042 TL/gün = 304,2 B** (hedef 300, sapma +%1,4). **Gelir bağdaştırıcısı:** her satış için `kasaNet = verilen − DizeTutari(oyuncuÇıktısı)` hesaplanır ve `min(kasaNet, fiyat)` toplanır. Fazla para üstü verirse kasa zarar eder (gelir düşer); eksik verirse tavan devreye girer ve "eksik para üstü şikâyeti" balonu çıkar.

**Savunma sorusu.** *"`4,90 → 5` için `decimal` yerine `double` kullansaydın ne olurdu?"* Kabul: `5 − 4,9` ikilik tabanda 0,0999… çıktığı için `>= 0,10` karşılaştırmasının başarısız olacağını ve sonucun `"1x5kr"` çıkıp para üstünün 10 kuruş yerine 5 kuruş verileceğini söyler. Ret: "daha yavaş olurdu" gibi ilgisiz cevap.

### 4.2 Manav L1 — Tartı ve Kademeli İndirim (`manav-L1`)

**Kapı.** Sev. 5, 900 B, Ruhsat 3/3 (B2: Çarşı 1.8–1.10). Gelir 380 B/gün (15,8 B/saat). Kavram: `switch` ifadesi, ilişkisel desen, işlem sırası. Otopark şemasının **ikinci yüzeyi** (§6).

> **Nuriye Teyze:** "Domatesin kilosu 40 lira diyelim. 5 kiloya kadar normal fiyat. 5 kilo ve 10 kilo arası alana, 10 dahil, yüzde 10 indirim. 10 kilodan fazla alana yüzde 20 indirim. Toplamı kuruşsuz söyle."

**Gereksinim Netleştirme.** Sorular Otopark'tan tanıdık kalıplardır; bu bilerek böyledir (§6.3).

| # | Soru | Nuriye Teyze'nin cevabı | Madde |
|---|---|---|---|
| S1 | "Tam 5 kilo alana indirim var mı?" | "Beş kiloda başlar: yüzde 10." | 2 |
| S2 | "7 kilo alanın hepsine mi indirim, yalnızca beşi geçen kısma mı?" | "Hepsine. Kaç kilo aldığına bakarım, hepsini ona göre keserim." | 2 |
| S3 | "Tam 10 kilo?" | "Hâlâ yüzde 10; on birinci kilo yüzde 20." | 2 |
| S4 | "Kuruş çıkarsa?" | "Kuruşu atarım, müşteri lehine." | 3 |
| S5 | "0 kilo?" | "Ödemez." | 1 |

Anomali (serbest metinle sorulursa cevaplanır; **Keskin Göz** KANON §10'a göre yalnızca Otopark'ın 119/120 anomalisi içindir, burada ödül yoktur): 10 kilo 360 TL, 11 kilo 352 TL; Nuriye Teyze: "Biliyorum, kasa dolsun diye." Usta Defne bunu "Otopark'ta da görmüştün" diye bağlar (§6.3).

**Sözleşme Kartı.**

1. `kilo ≥ 0` tam sayı, `kiloFiyati` 1–500 arası tam sayı TL; 0 kilo → 0 TL.
2. Kademeyi **ham kilo** belirler ve **tüm kiloya** uygulanır: `kilo < 5` → %0; `5 ≤ kilo ≤ 10` → %10; `kilo > 10` → %20.
3. `tutar = kilo × kiloFiyati × (100 − indirim) / 100`; **önce çarpılır, sonra bölünür**; tam sayı bölmesiyle aşağı yuvarlanır (kuruş yok, müşteri lehine).
4. İmza: `public static int Manav.Tutar(int kilo, int kiloFiyati)`.
5. Kademe sınırları: 4, 5, 10, 11 kilo ayrı davranır.

```csharp
// İş emri — Manav (Çarşı) — Müşteri: Nuriye Teyze
public static class Manav
{
    // kilo: alınan kilo (0 veya daha büyük); kiloFiyati: TL (tam sayı)
    // dönüş: ödenecek tutar, TL (tam sayı)
    public static int Tutar(int kilo, int kiloFiyati)
    {
        //#BASLA
        // kodun buraya
        //#BITIS
    }
}
```

| Açık | kilo | kiloFiyati | Beklenen | Gerekçe |
|---|---|---|---|---|
| A1 | 3 | 40 | 120 | kademe yok |
| A2 | 5 | 40 | 180 | alt sınır dâhil (%10) |
| A3 | 7 | 35 | 220 | 245 × 90 / 100 = 220,5 → 220; sıra hatalarını yakalar |
| A4 | 12 | 25 | 240 | %20 kademesi |
| A5 | 0 | 40 | 0 | sıfır |

| Gizli | kilo | kiloFiyati | Beklenen | Gerekçe |
|---|---|---|---|---|
| G1 | 4 | 40 | 160 | kademe sınırının bir altı |
| G2 | 10 | 40 | 360 | üst sınır dâhil |
| G3 | 11 | 40 | 352 | anomali: 11 kilo 10 kilodan ucuz |
| G4 | 9 | 33 | 267 | 297 × 90 / 100 = 267,3 → 267 (aşağı yuvarlama) |

| Kademe | İpucu |
|---|---|
| Pusula | "İki iş: kiloya göre indirim yüzdesini seçmek ve tutarı hesaplamak. Önce yalnızca yüzdeyi çöz: 4, 5, 10 ve 11 kilo kaç yüzde?" |
| Fener | "Kademeyi ham kilo belirler ve tüm kiloya uygulanır (madde 2). Yüzdeyi `switch` ifadesiyle seç. Tutarda önce çarp sonra böl: `kilo * kiloFiyati * (100 - indirim) / 100`; önce bölersen kuruşlar kaybolur." |
| Taslak | `indirim = kilo < 5 ise 0; kilo <= 10 ise 10; değilse 20` / `dön kilo * kiloFiyati * (100 - indirim) / 100` |
| Örnek | "Koli ücreti: `kg switch { < 5 => 30, <= 10 => 50, _ => 80 }`; 4 kg 30, 5 kg 50, 10 kg 50, 11 kg 80." (doğrulandı: `ORN-MN`) |

**Referans çözüm.**

```csharp
public static int Tutar(int kilo, int kiloFiyati)
{
    int indirim = kilo switch
    {
        < 5 => 0,
        <= 10 => 10,
        _ => 20
    };
    return kilo * kiloFiyati * (100 - indirim) / 100;   // önce çarp, sonra böl
}
```

**Hata kümeleri** (dotnet): önce `/ 100` yapan sürüm (`kilo * fiyat / 100 * oran`) A1, A3, G1, G3, G4'te kalır; birim fiyatı önce kırpan (`fiyat * oran / 100 * kilo`) A3 ve G4'te kalır; 5 kilo dışarıda bırakan (`kilo <= 5`) yalnızca A2'de kalır; indirimi yalnızca fazlaya uygulayan *artımlı* sürüm A2, A3, A4, G2, G3, G4'te kalır. A3 ve G4'ün işlem sırasını ayırt etmek için seçildiğine dikkat: ikisi de küsuratlı sonuç verir.

**"Döngüler" notu (KANON ile fark).** KANON §5 Manav L1 konusunu "Döngüler, `switch`, miktara göre indirim kademesi" olarak yazar. Çarşı'da dizi öğretilmediği için çok kalemli sepet (döngü gerektirir) Manav L2'ye (Liman, `List<int>`) bırakıldı; L1 kodu döngüsüzdür ve döngü, Manav Ruhsat görevlerinde (B4) çalışılır. Taslak kademesi isteyen oyuncuya "kilo kilo toplamı" alternatifini de gösterebilir. Bu fark Açık Soru 1'dedir.

**Sentetik trafik ve gelir.** Günde 28 müşteri; kiloFiyati {25, 30, 40, 60} eşit olasılıkla; kilo dağılımı 1 (%20), 2 (%25), 3 (%20), 5 (%15), 7 (%10), 10 (%6), 12 (%4). Ortalama sepet 136,72 TL; **beklenen 3.828 TL/gün = 382,8 B** (hedef 380, sapma +%0,7). Bağdaştırıcı kimliktir: gelir `Σ Tutar(kilo, fiyat)`, referans tavanıyla `Σ min(oyuncu_i, ref_i)`.

**Savunma sorusu.** *"`kilo * kiloFiyati * (100 - indirim) / 100` neden bu sırada?"* Kabul: tam sayı bölmesinin küsuratı attığını, önce bölmenin 7 kilo 35 TL'de 245 / 100 = 2 ile 180 verdiğini (beklenen 220) örnekler. Ret: "matematikte aynı" demek.

### 4.3 Kargo Deposu L1 — Raf Sayımı (`kargo-deposu-L1`)

**Kapı.** Sev. 6, 1.500 B, Ruhsat 3/3 (B2: Liman 2.1–2.3), Çarşı Sınavı sonrası. Gelir 500 B/gün (20,8 B/saat). Kavram: `List<int>` (ve diziler), `foreach`, envanter sayımı.

> **Kaptan Rıza:** "Her akşam rafları sayıyorum; her rafın üstündeki koli sayısını bir listeye yazıyorum. Boş rafın kirası 15 lira. Rafta 20 koliye kadar koli başı 6 lira depolama. Yirmiden fazlası taşkın: ilk yirmi 6 lira, fazlası koli başı 10 lira. Bütün rafların toplamını fatura yaz."

**Gereksinim Netleştirme.**

| # | Soru | Kaptan Rıza'nın cevabı | Madde |
|---|---|---|---|
| S1 | "Tam 20 koli taşkın mı?" | "Hayır, yirmi tamam." | 3 |
| S2 | "Boş rafa kira mı, depolama mı?" | "Yalnızca kira: 15." | 2 |
| S3 | "Liste boşsa?" | "Fatura sıfır." | 5 |
| S4 | "Bir rafa en çok kaç koli konur?" | "Altmışı geçmez." | 1 |

**Sözleşme Kartı.**

1. `raflar` `null` değildir, boş olabilir; her eleman 0–60 koli.
2. 0 koli (boş raf): 15 TL kira.
3. 1–20 koli: koli başı 6 TL. **20 dâhil**, taşkın değildir.
4. 20'den fazla: ilk 20 koli 6 TL, fazlası (taşkın) koli başı 10 TL.
5. Fatura = tüm rafların toplamı, TL, tam sayı; boş liste → 0.
6. İmza: `public static int Depo.GunSonuFatura(List<int> raflar)`.

*Liste ve dizi.* İmza `List<int>` alır; Ders 2.1'in dizi (`int[]`) ve `List<int>`'i yan yana öğrettiği varsayımıyla (B4 ile hizalanır) oyuncu `foreach` ile ikisini de gezebilir, `ToArray()` ile dizi sürümünü deneyebilir. Hakem her zaman `List<int>` geçirir.

```csharp
// İş emri — Kargo Deposu (Liman) — Müşteri: Kaptan Rıza
public static class Depo
{
    // raflar: her rafın üstündeki koli sayısı (0–60)
    // dönüş: gün sonu faturası, TL (tam sayı)
    public static int GunSonuFatura(List<int> raflar)
    {
        //#BASLA
        // kodun buraya
        //#BITIS
    }
}
```

| Açık | raflar | Beklenen | Gerekçe |
|---|---|---|---|
| A1 | [5, 0, 12] | 117 | 30 + 15 + 72 |
| A2 | [20] | 120 | tam 20 koli, taşkın değil |
| A3 | [21] | 130 | 120 + 10, bir taşkın koli |
| A4 | [] | 0 | boş liste |
| A5 | [0, 0, 0] | 45 | yalnızca kira |

| Gizli | raflar | Beklenen | Gerekçe |
|---|---|---|---|
| G1 | [1] | 6 | en küçük dolu raf |
| G2 | [30, 20, 21, 19, 0] | 599 | 220 + 120 + 130 + 114 + 15; hepsi bir arada |
| G3 | [60] | 520 | 120 + 40 × 10 |
| G4 | 60 raf × 20 koli | 7.200 | tam kapasite, uzun liste |

| Kademe | İpucu |
|---|---|
| Pusula | "Üç durum var: boş raf, normal raf, taşkın raf. Her rafı sırayla gezip ücretini toplamalısın." |
| Fener | "`foreach (int koli in raflar)` listeyi gezer. Taşkında ilk 20 koli 6 TL, fazlası 10 TL: iki parçayı ayrı hesapla. 20 koli tam sınırdır, taşkın değildir." |
| Taslak | `fatura = 0` / `her raf için: koli == 0 -> +15; koli <= 20 -> +koli*6; değilse -> +20*6 + (koli-20)*10` / `dön fatura` |
| Örnek | "Not toplamı: `int[] notlar = {70, 85, 40}; int toplam = 0; foreach (int n in notlar) toplam += n;` sonuç 195." (doğrulandı: `ORN-KG`) |

**Referans çözüm.**

```csharp
public static int GunSonuFatura(List<int> raflar)
{
    int fatura = 0;
    foreach (int koli in raflar)
    {
        if (koli == 0) fatura += 15;                      // boş raf kirası
        else if (koli <= 20) fatura += koli * 6;         // depolama
        else fatura += 20 * 6 + (koli - 20) * 10;        // ilk 20 koli 6 TL, taşkın 10 TL
    }
    return fatura;
}
```

**Hata kümeleri.** Taşkında tüm kolilere 10 TL yazan sürüm A3, G2, G3'te kalır; boş raf kirasını unutan sürüm A1, A5, G2'de kalır; `koli < 20` ile taşkın dalını birleştiren sürüm 20 koli için de 120 TL verir (iki yolda aynı sonuç) ve **eşdeğer mutanttır**; Kargo'nun Hata Bildirimi havuzuna alınmaz.

**Sentetik trafik ve gelir.** Günde 60 raflık sayım (B2 §7.1 örneğindeki "60 kargo hareketi" bu belgede 60 sayım kaydı olarak somutlaştırılmıştır); raf başına koli: 0 koli %8, 1–20 koli %72 (tekdüze), 21–30 koli %20 (tekdüze). Ortalama raf 81,56 TL; **beklenen 4.894 TL/gün = 489,4 B** (hedef 500, sapma −%2,1). Bağdaştırıcı kimliktir; tavan fatura toplamındadır (tek çağrı).

**Savunma sorusu.** *"Neden `koli <= 20` ve `koli < 20` değil?"* Kabul: Sözleşme Madde 3'ü (20 koli taşkın değil) ve 20'nin ilk 120 TL'lik parçanın son kolisi olduğunu gösterir. Ret: "alışkanlık" cevabı.

---

## 5. Kalan 16 işletme (#5–#20) — L1 özeti

Görev metni "kalan 13 işletme" demişti; Otopark, Büfe, Manav ve Kargo Deposu çıkınca KANON §5'ten **16** işletme kalır (#5–#20). Hepsi burada ele alınmıştır. Her işletme için seviye başlıkları ve kavramlar §2'dedir; burada L1 için müşteri isteği, imza, kısa sözleşme ve en az iki test verilir. Her test dotnet'te çalıştırıldı (§9, "KALAN 16 İŞLETME"); çalıştırılan referans, her işletmenin L1 taslağıdır ve tam spec'i (açık/gizli ayrımı, ipucu merdiveni, Savunma) B5'in sonraki sürümünde Otopark şablonuyla genişler. Atölyeler'den itibaren kod İngilizce adlandırılır (KANON §1).

### 5.1 #5 Balık Hali — Fiyat Tahtası (`balik-hali-L1`)

> **Gülsüm Abla:** "Tahtada her balığın kilosu yazılı. Siparişi 'hamsi:2,levrek:1' diye yazıyorum: balık adı, iki nokta, kilo; virgülle ayrılıyor. Toplamı söyle."

`public static decimal BalikHali.Tutar(string siparis, Dictionary<string, decimal> fiyatlar)` — Sözleşme: `siparis` boş ya da `ad:kilo` çiftlerinin virgülle ayrılmış listesi; kilo tam sayı; her ad `fiyatlar`'da vardır; boş sipariş 0; sonuç `decimal`.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | `"hamsi:2,levrek:1"`, {hamsi 80, levrek 250} | 410 |
| 2 | `"palamut:3"`, {palamut 120} | 360 |
| 3 | `""` | 0 |

### 5.2 #6 Oto Yıkama — Paket ve Ek Hizmet (`oto-yikama-L1`, 3. yüzey)

> **Murat:** "Üç paket: Hızlı 150, Standart 250, Detay 450. Ek hizmetler: Cila 120, Koltuk 180, Motor 100, Lastik 60, Koku 40. Ek hizmet sayısı 2 ya da 3 ise ek hizmetlere yüzde 10, 4 ve üstüyse yüzde 20 indirim."

`public static int OtoYikama.Ucret(string paket, List<string> ekHizmetler)` — Sözleşme: paket ∈ {Hızlı, Standart, Detay}; her ek hizmet en çok bir kez; **kademeyi ham ek hizmet adedi belirler** (0–1 → %0, 2–3 → %10, 4 ve üstü → %20) ve yalnızca ek hizmet toplamına uygulanır; ücret = paket + ek × (100 − indirim) / 100; tutarlar 20'nin katı olduğundan yuvarlama çıkmaz.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | Standart + [Cila] | 370 |
| 2 | Hızlı + [Cila, Koltuk] | 420 (2 adet: %10) |
| 3 | Detay + [Cila, Koltuk, Motor, Lastik] | 818 (4 adet: %20) |
| 4 | Standart + [Cila, Koltuk, Motor] → + Koku | 610 → 602 (daha çok alan daha az öder) |

### 5.3 #7 Gümrük — Plaka Doğrulama (`gumruk-L1`)

> **Faruk:** "Plaka şöyle: il kodu, boşluk, bir ile üç harf, boşluk, iki ile dört rakam. İl kodu 01'den 81'e. Q, W, X harfleri yok. Büyük harf. Uymayan geçmesin."

`public static bool Gumruk.PlakaGecerliMi(string plaka)` — Sözleşme: üç parça, tek boşlukla; il kodu iki rakam, 01–81; 1–3 harf (A–Z, Q W X hariç, büyük); 2–4 rakam; `+4` gibi işaretli parça geçersizdir.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | `"34 ABC 123"` | true |
| 2 | `"34 ABQ 123"` | false (Q yok) |
| 3 | `"82 AB 123"` | false (il kodu 82) |
| 4 | `"+4 AB 123"` | false (işaretli parça) |

### 5.4 #8 Oto Tamirhane — Araç Hiyerarşisi (`oto-tamirhane-L1`)

> **Sadık Abi:** "Her araç bakıma geliyor. Bakım ücreti = aracın taban ücreti + her 1.000 km için 50 lira. Otomobilin tabanı 500, kamyonetin 800."

`sinif-senaryo`: oyuncu `abstract class Vehicle` (`abstract int BaseFee`, `int MaintenanceFee(int km)`), `class Car : Vehicle` ve `class Pickup : Vehicle` yazar. Sözleşme: `km ≥ 0`; `MaintenanceFee(km) = BaseFee + (km / 1000) × 50` (tam sayı bölmesi); `Car.BaseFee = 500`, `Pickup.BaseFee = 800`; yeni araç türü yeni sınıftır, `MaintenanceFee` değişmez.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | `new Car().MaintenanceFee(15000)` | 1.250 |
| 2 | `new Pickup().MaintenanceFee(20000)` | 1.800 |

### 5.5 #9 Mobilya Atölyesi — Sipariş Nesnesi (`mobilya-atolyesi-L1`)

> **Rüstem:** "Siparişe kalem ekliyorum: ad, adet, birim fiyat. Toplam 1.000 lira ve üstündeyse yüzde 10 indirim."

`public sealed class Order { void Add(string name, int qty, decimal price); decimal Total { get; } }` — Sözleşme: kalemler sınıfın içinde saklanır, dışarıdan değiştirilemez; `Total` her çağrıda hesaplanır; indirim toplam ≥ 1.000 için (1.000 dâhil).

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | Sandalye 4 × 250 | 900 (1.000 dâhil indirim) |
| 2 | Masa 1 × 800 | 800 |

### 5.6 #10 Trafo Merkezi — Cihaz Yükü (`trafo-merkezi-L1`)

> **Kenan:** "Cihaz açıksa tam watt çeker, beklemedeyse onda biri, kapalıysa hiç. Toplam yükü söyle."

İskelette `enum PowerState { Off, Standby, On }` ve `interface IDevice { int Watts { get; } PowerState State { get; } }` hazırdır; oyuncu `public static int Substation.CurrentLoad(IReadOnlyList<IDevice> devices)` yazar. Sözleşme: `On` → `Watts`; `Standby` → `Watts / 10` (tam sayı); `Off` → 0; boş liste → 0.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | [1000 On, 500 Standby, 200 Off] | 1.050 |
| 2 | [] | 0 |

### 5.7 #11 Kütüphane — Gecikme Cezası (`kutuphane-L1`, 4. yüzey)

> **Ayşe:** "Kitabı 14 gün ödünç veriyorum, son gün dâhil. Gecikene gün başı ceza: ilk 3 gün 2 lira, 4. günden 10. güne 5 lira, 11. günden sonra 10 lira. Bir kitap için ceza 120 lirayı geçmesin. Saat önemli değil, takvim günü sayılır. İade edilmediyse bugüne kadar say."

`public sealed record Odunc(string Uye, DateTime Verilis, DateTime? Iade);` ve `public static int Kutuphane.ToplamCeza(List<Odunc> oduncler, DateTime bugun)` (LINQ `Sum`). Sözleşme: son gün = veriliş + 14 gün; gecikme = iade (ya da `bugun`) tarihi − son gün, takvim günü; **artımlı:** her gün kendi oranıyla (1–3: 2, 4–10: 5, 11+: 10); kitap başına tavan 120; toplam tüm ödünçlerin cezasıdır.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | veriliş 01-01, iade 01-20 (5 gün gecikme) | 16 (3 × 2 + 2 × 5) |
| 2 | veriliş 01-01, iade 01-15 (son gün) | 0 |
| 3 | veriliş 01-01, iade 03-01 | 120 (tavan) |
| 4 | A: 01-01 → 01-20, B: 01-05 → açık; bugün 01-25 | 37 (16 + 21) |

### 5.8 #12 Sinema — Koltuk Rezervasyonu (`sinema-L1`)

> **Leyla Hanım:** "Aynı koltuk aynı seansa bir kez satılsın; başka seansa satılabilir. Koltuk 'A4' gibi metin de olur, (sıra, numara) ikilisi de."

`public sealed class ReservationBook<TSeat> where TSeat : notnull { bool Reserve(TSeat seat, DateTime show); int Count(DateTime show); }` — Sözleşme: yeni (koltuk, seans) için `true`, aynısı için `false`; seans `DateTime` tam eşitliği; bilinmeyen seansın `Count`'u 0; genel tür hem `string` hem `(int, int)` ile çalışır.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | `Reserve("A1", 20:00)` | true |
| 2 | `Reserve("A1", 20:00)` tekrar | false |
| 3 | `Reserve("A1", 22:00)` | true |
| 4 | `Count(20:00)` | 1 |
| 5 | `ReservationBook<(int, int)>`: `Reserve((3, 4), 20:00)` | true |

### 5.9 #13 Haber Ajansı — Haber Yayıncısı (`haber-ajansi-L1`)

> **Cengiz:** "Haber JSON olarak geliyor: başlık ve öncelik. Öncelik 2 ve üstü son dakikadır; abonelere olayla haber ver. Düşük öncelikli haber kimseyi uyandırmasın."

`public sealed class NewsDesk { event Action<string>? Breaking; void Publish(string json); }` — Sözleşme: JSON `{"title": string, "priority": int}`; `priority ≥ 2` → `Breaking(title)`; `< 2` → olay yok.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | `{"title":"Köprü açıldı","priority":2}` | abone `"Köprü açıldı"` alır |
| 2 | `{"title":"Hava açık","priority":1}` | olay yok (abone listesi `["Köprü açıldı"]` kalır) |

### 5.10 #14 Banka — Havale Kuyruğu (`banka-L1`)

> **Feride Hanım:** "Havaleleri sırayla işle. Bakiye yetiyorsa ve onay servisi evet derse düş; yetmiyorsa servisi hiç arama."

`public static async Task<decimal> Bank.ProcessTransfersAsync(decimal balance, IReadOnlyList<decimal> transfers, Func<decimal, Task<bool>> approve)` — Sözleşme: sırayla (paralel değil); `balance >= tutar` değilse `approve` çağrılmaz; onay `true` ise düşülür, `false` ise atlanır; son bakiye döner.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | 1.000, [300, 800, 200], onay ≤ 500 | 500 |
| 2 | onay hiç verilmez | 1.000 |
| 3 | aynı girdi, onay çağrı sayısı | 2 (800 > 700, servis aranmaz) |

### 5.11 #15 Sigorta — Prim Kuralları (`sigorta-L1`)

> **Tolga:** "Baz prim 1.000 lira. 25 yaşından küçüğe 1,5 kat. Hasarsıza yüzde 10 indirim; 3 ve üzeri hasar geçmişine 1,4 kat. Geniş kapsam seçerse 400 lira ekle."

`public static decimal Insurance.Premium(int age, int claims, bool fullCover)` — Sözleşme: sırayla yaş çarpanı → hasar çarpanı → kapsam eki; 1–2 hasarda çarpan yok; kapsam eki çarpanlardan sonra eklenir.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | (30, 0, dar kapsam) | 900 |
| 2 | (22, 3, geniş kapsam) | 2.500 (1.000 × 1,5 × 1,4 + 400) |
| 3 | (40, 1, geniş kapsam) | 1.400 |

### 5.12 #16 Borsa Panosu — Fiyat Çekici (`borsa-panosu-L1`)

> **Ece:** "Fiyatı /price/{sembol} adresinden çek; cevap {"price": 12.5} gibi. Servis 500 verirse en çok 3 deneme yap, olmazsa boş dön."

`public static async Task<decimal?> Ticker.FetchPriceAsync(HttpClient http, string symbol)` — Sözleşme: en çok 3 istek; başarılı cevapta JSON'daki `price`; 3 denemede de başarısızsa `null`; sandbox'ta ağ yoktur, testler sahte `HttpMessageHandler` ile koşar.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | 500, sonra 200 `{"price":12.5}` | 12,5 (2 çağrı) |
| 2 | hep 500 | `null` (3 çağrı) |

### 5.13 #17 Hastane Kayıt — Hasta Kaydı (`hastane-kayit-L1`)

> **Sevim Hanım:** "Yeni hastayı kaydet, kimliği kendiliğinden ver. Adı boş olan kayıt olmaz."

`public static async Task<int> Registry.RegisterAsync(HospitalContext db, string name, DateTime now)`. İskelette `Patient` (Id, Name, RegisteredAt) ve `HospitalContext : DbContext` hazırdır; testler EF Core InMemory sağlayıcısıyla koşar. Sözleşme: boş ya da boşluk ad → `ArgumentException` (parametre `name`); ad kırpılır; `RegisteredAt = now`; dönüş yeni kimlik. *Migration*, Veri Bahçıvanı'nın İş Emri girişinde hazır bir `InitialCreate` migration dosyasını okuma (Hata Avı) olarak öğretilir; şema değişimi L3'tür.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | iki hasta kaydı | kimlikler 1, 2 |
| 2 | `"  "` | `ArgumentException("name")` |
| 3 | `db.Patients.Count()` | 2 |

### 5.14 #18 Otel — Tek İşlemde İki Kayıt (`otel-L1`)

> **Nazan Hanım:** "Oda dolu işaretlenecek, misafir yazılacak. İkisi birlikte olsun; biri patlarsa ikisi de geri alınsın."

`public interface IRoomStore { void MarkOccupied(int roomId); void AddGuest(string name, int roomId); void Rollback(); }` ve `public static bool Hotel.Book(IRoomStore store, int roomId, string guest)` — Sözleşme: sırayla `MarkOccupied`, `AddGuest`; herhangi biri istisna fırlatırsa `Rollback()` çağrılır ve `false` döner; başarıda `true`, `Rollback` çağrılmaz.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | iki kayıt da başarılı | true; dolu oda 1, misafir 1 |
| 2 | ikinci kayıt patlar | false; dolu oda 0, misafir 0 |

### 5.15 #19 Yemek Sipariş Platformu — Sipariş Uç Noktası (`yemek-siparis-platformu-L1`)

> **Bora:** "Sipariş gelince: kalem yoksa ya da adet 0'sa 400; menüde olmayan ürün varsa 404; yoksa 201 ve toplam tutar."

`public static (int Status, OrderResultDto? Body) OrdersApi.Create(CreateOrderDto dto, IReadOnlyDictionary<int, decimal> menu)`; DTO'lar `OrderLineDto(ItemId, Qty)`, `CreateOrderDto(RestaurantId, Lines)`, `OrderResultDto(Total)`. Sözleşme: satırlar sırayla denetlenir, ilk hata kazanır; `Lines` boş → 400; `Qty ≤ 0` → 400; menüde yok → 404; hepsi geçerse 201 ve `Total = Σ fiyat × adet`.

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | [(1, 2)], menü {1: 50} | 201, 100 |
| 2 | [(9, 1)] | 404 |
| 3 | [] | 400 |
| 4 | [(1, 0)] | 400 |

### 5.16 #20 Şehir Uygulaması — Servis Defteri (`sehir-uygulamasi-L1`)

> **Nuran Hanım:** "Her servis bir defterden alınsın. Defter her servisten bir tane tutsun; bir servis başkasına ihtiyaç duyuyorsa onu da defterden alsın."

`public sealed class ServiceRegistry { void AddSingleton<T>(Func<ServiceRegistry, T> factory) where T : class; T Get<T>() where T : class; }` — Sözleşme: `Get<T>` her çağrıda aynı örneği döndürür (singleton); fabrika `ServiceRegistry` alır (bağımlılık çözümü).

| Test | Girdi | Beklenen |
|---|---|---|
| 1 | iki `Get<ReportService>()` | aynı örnek (true) |
| 2 | `report.Clock.Now` (bağımlı `IClock` çözüldü) | 2026-11-02T09:00:00 |

---

## 6. Aynı şema, dört yüzey

A-vizyon-FINAL §7: "Otoparkın kademeli-fiyat şeması Manav (miktara göre indirim kademesi), Oto Yıkama (paket + ek hizmet listesi) ve Kütüphane'de (gün bazlı gecikme cezası) yeniden kurulur; transfer tasarlanır, umulmaz." Bu bölüm o cümleyi uygulanabilir hâle getirir: hangi parçanın nasıl yeniden kullanıldığını, hangisinin bilerek tersine çevrildiğini ve transferin nasıl ölçüleceğini söyler. Dört yüzeydeki beklenen değerlerin hepsi dotnet'te doğrulandı (§9, "AYNI ŞEMA", 24 vaka).

### 6.1 Şemanın beş parçası

Kademeli Fiyat Şeması beş parçadan oluşur: **(1) ham girdi ve birimi**, **(2) kademe seçici** (eşikler ve sınır semantiği), **(3) kademe başına kural** (birim fiyat ya da yüzde), **(4) hesap sırası ve yuvarlama**, **(5) sıfır ve sınır girdileri**. Dört yüzey bu beş parçanın farklı doldurulmasıdır. Üç yüzey (Otopark, Manav, Oto Yıkama) kademeyi *ham girdiden* seçer ve kuralı *bütüne* uygular; dördüncüsü (Kütüphane) kademeyi *her birim için ayrı* uygular. Bu fark bilerek bırakılmıştır (§6.3).

### 6.2 Eşleme tablosu

| Parça | Otopark L1 | Manav L1 | Oto Yıkama L1 | Kütüphane L1 |
|---|---|---|---|---|
| Ham girdi | `dakika` (`int`) | `kilo` (`int`) | `ekHizmetler.Count` | gecikme günü (takvim farkı) |
| Eşikler | 120, 360 (ve gün 1.440) | 5, 10 | 2, 4 | 3, 10 (ve tavan 120 TL) |
| Sınır semantiği | `< 120`, `≤ 360` | `< 5`, `≤ 10` | `< 2`, `< 4` | `≤ 3`, `≤ 10` |
| Kural neye uygulanır | tüm süreye (tek tarife) | tüm kiloya | yalnızca ek hizmet toplamına | **her güne ayrı** (artımlı) |
| Birim ve yuvarlama | başlayan saat/gün **yukarı** | tam sayı bölmesi **aşağı** (önce çarp) | yuvarlama çıkmaz (20'nin katı) | takvim günü, saat önemsiz |
| Sıfır girdi | 0 → 0 | 0 kilo → 0 | boş liste → paket fiyatı | son gün → 0 |
| Anomali | 119 → 200, 120 → 80 | 10 kg 360, 11 kg 352 | 3 ek 610, +Koku 602 | **yok** (monoton), tavan 18. günde |
| Yeni kavram | `if/else if`, metot, tam sayı bölmesi | `switch` ifadesi, işlem sırası | `List<string>`, `switch` | LINQ `Sum`, `DateTime`, artımlı toplam |
| Tipik hata | `<` ↔ `<=`, `+59` → `+60` | önce `/ 100`, `<= 5` | `Count` yerine tutarla kademe | tüm gecikmeye tek oran |
| Sınır üçlüsü (doğrulandı) | 119 / 120 / 121 → 200 / 80 / 120 | 4 / 5 / 6 kg (40 TL) → 160 / 180 / 216 | 1 / 2 / 3 ek → 370 / 520 / 610 | gecikme 3 / 4 / 10 / 11 gün → 6 / 11 / 41 / 51 |

Kademe seçicisinin dört yüzeydeki biçimi aynı kalıbı izler (doğrulanmış kodlardan alıntı):

```csharp
// Otopark    : dilim = f(dakika), ücret = birim(dilim) × başlayan(dakika)
if (dakika < 120) return saat * 100;
// Manav      : indirim = f(kilo), tutar = kilo × fiyat × (100 − indirim) / 100
int indirim = kilo switch { < 5 => 0, <= 10 => 10, _ => 20 };
// Oto Yıkama : indirim = f(adet), yalnızca ek hizmet toplamına
int indirim = ekHizmetler.Count switch { < 2 => 0, < 4 => 10, _ => 20 };
// Kütüphane  : oran = f(gün), her gün kendi oranıyla toplanır
ceza += g switch { <= 3 => 2, <= 10 => 5, _ => 10 };
```

### 6.3 Transfer nasıl tasarlanır

**Aynı soru, aynı sıra.** Manav'ın hazır soruları Otopark'tan tanıdık kalıplardır: "tam eşikte ne olur?" (Manav S1, S3; Otopark S2, S3), "sıfır?" (S5; Otopark S5), "yuvarlama?" (S4; Otopark S1). Yeni olan "hepsine mi, fazlasına mı?" sorusudur (S2); Otopark'ta cevabı ilk sorunun içine gömülüydü ("dilimi ham süre belirler"), Manav'da açıkça sorulur. Oyuncu Otopark'ta bu soruları sormayı öğrenmiştir; Manav'da Usta Defne bir cümle ekler: "Bu soruyu daha önce Otopark'ta sormuştun." Soruyu hatırlatmak transferin kendisidir; cevabı vermek değil. Oto Yıkama'da aynı sorular üçüncü kez gelir ve Usta hatırlatma yapmaz.

**Aynı test deseni.** Her yüzeyde sınır üçlüsü (n−1, n, n+1) açık/gizli testlere yerleştirilmiştir (tablodaki son satır). Oyuncu kendi testlerini yazmayı Finans'a kadar öğrenmez, ama bu desenin görüldüğü yerde ("hangi sayıyı deneyeyim?") sınır üçlüsü kullanılır.

**Aynı hata bankası.** Beş mutasyon operatörü dört yüzeyde yeniden kullanılır; Hata Bildirimi motoru (§7.2) operatörü seçer, yüzey şablonu koda uygular:

| Operatör | Otopark | Manav | Oto Yıkama | Kütüphane |
|---|---|---|---|---|
| ilişkisel (`<` ↔ `<=`) | `dakika < 120` → `<=` (M1) | `kilo <= 10` → `< 10` | `Count < 2` → `<= 2` | `g <= 3` → `< 3` |
| yuvarlama ya da işlem sırası | `ceil` → `taban + 1` (M4) | önce `/ 100` (sıra hatası) | indirimi paketin üzerine de uygulamak | gece yarısı yerine saat sayımı |
| değişken ikamesi | `saat` → `dakika / 60` (M7) | `kilo` → `kilo - 1` | `ek` → `taban` | `gun` → `gecikme` |
| koşul ikamesi | `dakika < 120` → `saat < 2` (M5) | `kilo` → `kilo * kiloFiyati` ile kademe | `Count` → toplam tutar | gün yerine ay |
| satır silme | günlük `gun` hesabı silinir (M6) | `0 kilo` koruması | boş liste koruması | tavan satırı |

Tabloda yalnızca Otopark sütunu ve Manav'ın "önce `/ 100`" hatası §3.11 ve §4.2'deki dotnet çıktısıyla doğrulanmıştır; kalan hücreler operatör taslağıdır ve ilgili işletmenin Hata Bildirimi havuzu yazılırken (B6) çalıştırılıp doğrulanır.

**Bilerek tersine çevrilen yüzey: Kütüphane.** Oto Yıkama'ya kadar "kademeyi ham girdi belirler ve kural bütüne uygulanır" doğrudur; Kütüphane'de doğru değildir. Ayşe "gün başı ceza: ilk 3 gün 2 lira, 4–10. günler 5 lira, sonrası 10 lira" der; oyuncu "hepsine mi, fazlasına mı?" diye sorarsa cevap "her güne kendi oranı"dır (artımlı). Alışkanlıkla tüm gecikmeye tek oran uygulayan oyuncu 5 gün gecikme için 16 TL yerine **25 TL** hesaplar (5 gün × 5), 11 gün için 51 TL yerine **110 TL** (§9). Bu, transferin ölçüldüğü yerdir: soruyu sormayan, önceki yüzeyin cevabını varsayar ve gizli testlerde kırılır. Kütüphane'de anomali yoktur (artımlı ceza monotondur), bu yüzden "Keskin Göz" benzeri bir ödül de yoktur; yerine tavan satırı (18. günde 121 → 120) Savunma sorusuna konu olur.

**Transfer ölçümü (B9'a öneri).** Hipotez: Otopark L1'i ipucusuz (Berrak Zihin) geçenlerin Manav L1'i ilk denemede geçme oranı ≥ %60, ipuçlu geçenlerde ≥ %45. Kütüphane'de "hepsine mi, fazlasına mı?" sorusunu soranların ilk deneme başarısı sormayanlarla karşılaştırılır. Eşikler B5 önerisidir; kapalı betada (H9–10) ayarlanır.

---

## 7. Müfettiş şikâyet balonları ve Hata Bildirimi

**Müfettiş** gizli testleri çalıştırır, şikâyet balonlarını ve Hata Bildirimi dosyalarını getirir (KANON §10). B1 §8.3 onu sessiz, bej trençkotlu ve elinde renkli dosyalı bir NPC olarak çizer (yeşil: geçti, kırmızı: Kararmış, sarı: Hata Bildirimi). Bu bölüm iki şeyi belirler: gizli test kalınca oyuncuya **ne söylendiğini** (girdi söylenmeden) ve **Hata Bildirimi** görevinin tam akışını.

### 7.1 Şikâyet kategorileri ve balon metinleri

Bir balon tek bir girdiyi değil, müşterinin kendi sözcükleriyle bir **bölgeyi** söyler. Otopark L1 için sekiz kategori vardır ve `Kategori.Bul(dakika)` her açık, gizli ve tohumlu vakayı bunlardan birine yerleştirir. Aşağıdaki tablo dotnet çıktısından alınmıştır (§9).

| Kategori | Aralık (dk) | Sabit vakalar | "Fazla ücret" balonu | "Eksik ücret" balonu |
|---|---|---|---|---|
| `hemen-cikanlar` | 0–5 | G1, G2 | Bir müşteri: "girip hemen çıkan müşteriler için fazla ücret ödedim." | Bir müşteri: "girip hemen çıkan müşteriler için ücret eksik hesaplanmış." |
| `iki-saatten-az` | 6–99 | A1, A2, G3, G4 | Bir müşteri: "2 saatten az kalanlar için fazla ücret ödedim." | Bir müşteri: "2 saatten az kalanlar için ücret eksik hesaplanmış." |
| `iki-saat-civari` | 100–140 | A3, A4, G5 | Bir müşteri: "2 saat civarı kalanlar için fazla ücret ödedim." | Bir müşteri: "2 saat civarı kalanlar için ücret eksik hesaplanmış." |
| `iki-alti-arasi` | 141–340 | G6 | Bir müşteri: "2–6 saat arası kalanlar için fazla ücret ödedim." | Bir müşteri: "2–6 saat arası kalanlar için ücret eksik hesaplanmış." |
| `alti-saat-civari` | 341–380 | A5, G7, G8 | Bir müşteri: "6 saat civarı kalanlar için fazla ücret ödedim." | Bir müşteri: "6 saat civarı kalanlar için ücret eksik hesaplanmış." |
| `gunluk-tarife` | 381–1399 | G9 | Bir müşteri: "6–24 saat arası kalanlar için fazla ücret ödedim." | Bir müşteri: "6–24 saat arası kalanlar için ücret eksik hesaplanmış." |
| `bir-gun-civari` | 1400–1480 | A6, G10, G11 | Bir müşteri: "24 saat civarı kalanlar için fazla ücret ödedim." | Bir müşteri: "24 saat civarı kalanlar için ücret eksik hesaplanmış." |
| `gunu-asanlar` | 1481+ | G12, G13, G14 | Bir müşteri: "24 saati aşanlar için fazla ücret ödedim." | Bir müşteri: "24 saati aşanlar için ücret eksik hesaplanmış." |

- **İstisna balonu** (tüm kategoriler için aynı kalıp): Bariyer ekranı: "2 saat civarı kalanlar için sistem hata verdi."
- **Zaman aşımı balonu** (tüm kategoriler için aynı kalıp): Bariyer ekranı: "2 saat civarı kalanlar için cevap gelmedi."

**Sızıntı kuralları.**

1. Balon metni yalnızca müşterinin cümlesindeki sözcükleri kullanır ("2 saat", "6 saat", "24 saat", "girip hemen çıkan"). Hiçbir yüzeyde 119, 359 gibi bir **sayısal girdi** yazılmaz.
2. Bir kategori, sabit 20 vaka ve oyuncunun tohumlu 6 vakası birlikte sayıldığında **en az 2 vaka** içerir (CI kuralı 22; 10.000 oyuncuda 0 ihlal). Tek vakalı bir kategori girdiyi ele verirdi. Dikkat: `iki-alti-arasi` ve `gunluk-tarife` yalnızca bir sabit vaka içerir (G6; G9); onları T5 ve T3 tohumlu vakaları tamamlar (T3 aralığı bu yüzden [381, 1.399] seçildi).
3. Balon **yönü** söyler (fazla ücret / eksik ücret), **miktarı** söylemez. İstisna fırlatan çözüm için "sistem hata verdi", zaman aşımı için "cevap gelmedi" balonu çıkar.
4. Aynı gün aynı kategori için tek balon çıkar; balonun tonu hiç sertleşmez (A-vizyon-FINAL ilke 9: hata ceza değil, hikâyedir).
5. Balon yalnızca **Deneme** durumunda ve yalnızca sahibe görünür, 20 saniyede bir (B1 §6.3); ziyaretçi "DENEME" bandını görür, balonu görmez.
6. Müfettiş yalnızca açık testler 6/6 iken ve günde en çok 10 kez çağrılır (§1.6); aksi halde balon bir "oracle" olurdu.

**Bir Müfettiş raporu nasıl görünür?** Aşağıda M4 mutasyonuyla (gün: `taban + 1`) yazılmış bir çözümün raporu verilmiştir: açık ve tohumlu testler yeşil, iki gizli vaka kırmızı; oyuncu yalnızca iki balonu görür, "sunucu günlüğü" satırları istemciye gitmez.

```txt
   [M4 gün: ceil→'taban+1'] açık 6/6 · gizli 12/14 · tohumlu 6/6 → durum: DENEME (%50 gelir)
      balon (girdi gizli): Bir müşteri: "24 saat civarı kalanlar için fazla ücret ödedim."
      balon (girdi gizli): Bir müşteri: "24 saati aşanlar için fazla ücret ödedim."
      sunucu günlüğü (istemciye gitmez): G11 gizli dakika=1440 beklenen=250 gercek=500
      sunucu günlüğü (istemciye gitmez): G12 gizli dakika=2880 beklenen=500 gercek=750
```

Aynı çalıştırmada açık testi kırmızı olan çözümler (M1, M5, E1) Müfettiş'e gönderilemez; yalnızca açık testler gösterilir. Açık testleri ezberleyen çözüm (E13) 8 balonun hepsini alır: ezberi kırmak için her bölgeden en az bir vaka vardır.

### 7.2 Hata Bildirimi görevi: tam örnek

**Akış.** Müfettiş oyuncunun posta kutusuna sarı bir dosya bırakır (B1: Hurdacı Avlusu teslim noktası); dosyada tek resmî cümle vardır. Oyuncu (1) sentetik hatalı kodu okur, (2) şüpheli satırı işaretler, (3) düzeltir, (4) nedenini **tek cümleyle** yazar. Kod "başkasının" gibi sunulur ama sistem tarafından üretilir; gerçek oyuncu kodu hiçbir zaman kullanılmaz. Süre 4–6 dakikadır (B2 §4.1).

**Örnek: `otopark-HB-M4` (Orta, 60 B, 40 XP).** Müfettiş: *"Müşteri 1.440 dakika için 500 TL ödemiş."* Oyuncuya gösterilen hatalı kod referans çözüme tek mutasyon enjekte edilmiş hâldir:

```csharp
public static int M4(int dakika)   // 'ceil' → 'taban + 1' (gün hesabı)
{
    if (dakika <= 0) return 0;
    int saat = (dakika + 59) / 60;
    if (dakika < 120) return saat * 100;
    if (dakika <= 360) return saat * 40;
    int gun = dakika / 1440 + 1;
    return gun * 250;
}
```

Hatalı satır: `int gun = dakika / 1440 + 1;` (işaretlenecek satır). Beklenen düzeltme: `int gun = (dakika + 1439) / 1440;`. Beklenen açıklama (iyi cevap): *"1440 dakika tam bir gün, ama `dakika / 1440 + 1` onu 2 gün sayıyor; başlayan günü bulmak için `(dakika + 1439) / 1440` yazılmalı."* Bu hata yalnızca tam gün katlarında (1.440, 2.880, 4.320…) yanlış sonuç verir; 1.441 ve 2.881 doğru çıkar (§9, HB-1…HB-5). Bu yüzden müşteri cümlesi, oyuncuya hatanın nerede olduğunu söyleyen *tek* ipucudur.

**Puanlama.** Toplam 100 puandır; üç bileşenin ikisi deterministiktir, biri Kurul'dur.

| Bileşen | Puan | Kim karar verir | Kural |
|---|---|---|---|
| Satır bulma | 30 | sandbox (deterministik) | işaretlenen satır mutasyon satırıyla aynı → 30; ±1 satır → 15; başka → 0 |
| Düzeltme | 40 | sandbox | düzeltilmiş kod 26 vakanın hepsini geçerse 40; açıklar yeşil ama gizli kırmızıysa 20; derlenmezse 0 |
| Neden | 30 | Kurul | tek cümle, rubrik (Doğruluk 50 / Tamlık 30 / Açıklık 20) puanı × 0,30 |

**Ödül.** Toplam ≥ 70 → tam ödül; 40–69 → yarım ödül; < 40 → 0 (ceza yok, XP geri alınmaz). XP T1'de 40'tır (KANON §3.3; yarımda 20). Bayt tabanı mutasyonun zorluk sınıfına bağlıdır (B5 önerisi): Kolay 40, Orta 60, Zor 90, Uzman 120 B (§3.11); sekiz mutasyonun ortalaması 63,75 B'dir (B2 §5.1: ortalama ≈60). Günde 3 görev × en çok 120 B = 360 B üst sınırı B2 §5.1'in "günlük üst sınır 360" değeriyle aynıdır.

Dört örnek oyuncu (dotnet'te hesaplandı, §9 `HB-P`; Kurul puanları açıklayıcı değerlerdir ve altın kümeye aday olarak işaretlenir):

| Oyuncu | Satır | Düzeltme | Neden cevabı (Kurul) | Toplam | Ödül |
|---|---|---|---|---|---|
| A | doğru (30) | tam (40) | "1440 dakika tam bir gün, ama `+ 1` onu 2 gün sayıyor; … `(dakika + 1439) / 1440` …" (90 → 27) | 97 | tam: 60 B, 40 XP |
| B | doğru (30) | tam (40) | "Gün yanlış hesaplanıyordu." (20 → 6) | 76 | tam: 60 B, 40 XP |
| C | ±1 satır (15) | gizli kırmızı (20) | "Gün hesabında artı bir var, fazla." (50 → 15) | 50 | yarım: 30 B, 20 XP |
| D | yanlış satır (0) | derlenmedi (0) | "Bilmiyorum, bir yeri değiştirdim." (35 → 11) | 11 | yok: 0 B, 0 XP |

B oyuncusu bilinçli bir tasarımı gösterir: satırı ve düzeltmesi doğru, nedeni zayıf olan oyuncu yine de 76 puanla tam ödül alır, çünkü hata ayıklamanın asıl kanıtı düzeltmenin tüm testleri geçmesidir; ama "neden" Kurul'a gittiği için zayıf cevaba Kurul'un geri bildirimi (1 doğru + 1 eksik + 1 sonraki adım) gelir.

**Maliyet ve kötüye kullanım.** Günde 3 görev, Kurul kotasından günde en çok 3 çağrı alır (≈3 × 0,0033 = 0,01 $). Aynı mutasyon aynı oyuncuya 7 gün içinde tekrarlanmaz. Düzeltme sandbox'ta 26 vakayla (görev tohumundan 6 tohumlu dâhil) çalışır: yalnızca açık testleri geçiren bir yama 20 puan alır. Sekiz mutasyonun Müfettiş cümlelerinin hepsi dotnet'te doğrulandı (§9, `HB-M1`…`HB-M8`; cümleler §3.11 tablosundadır).

---

## 8. Kopya, paylaşım ve çözüm çeşitliliği

A-vizyon-FINAL ilke 9: "kopyayı yakalamak yerine anlamsız kıl". Otopark L1 gibi kısa ve herkesin bildiği bir problemde çözüm sızar; bunu önlemek mümkün değildir. Bu bölüm iki soruya cevap verir: sızan çözümün oyuncuya ve ekonomiye kazandıracağı şey nedir, ve **doğru çözümler birbirine ne kadar benzer olabilir** (kopya dedektörünü yanıltmaması için).

### 8.1 Risk tablosu

| # | Risk | Etki | Karşı önlem | Kalıntı |
|---|---|---|---|---|
| R1 | Vitrin'den (L2+) çözüm kopyalama | Kopyalayan açılış XP'si alır | Savunma satırı **kopyalayanın kendi** kodundan seçilir ve somut girdiyle sorulur; AST benzerliği > %95 ya da yazım < 30 sn → Savunma zorunlu, Bayt sonra ödenir (KANON §9); tohumlu vakalar oyuncuya özel | Kopyalayıp kodu gerçekten okuyup açıklayan geçer; bu "öğrenme" sayılır |
| R2 | Discord, video ya da forumda çözüm paylaşımı | Çözüm kamusal olur | Aynı: Savunma + tohumlu + referans tavanı (kopya gelir *artırmaz*, doğruysa aynı geliri verir). "En Hızlı Otopark" tablosu (Liderlik #22) yalnızca `kopya_suphesi = false` kayıtları alır | Kısa problemde sızıntı kaçınılmaz |
| R3 | AI asistanına "Otopark ücreti yaz" demek | Doğru kod saniyeler içinde gelir | Müşteri isteği + sözleşme + Savunma + Semt Sınavı (3 kod + 3 soru, 20 dk, interleaving); Hata Bildirimi ve Günlük Tekrar kodu *okumayı* ister; kod yazmak tek ölçü değildir | Yüksek; ağırlık Savunma ve sınavdadır |
| R4 | Açık testleri ezberleme (E13) | Açık testler yeşil | 14 gizli + 6 tohumlu vaka; ezber çözüm 26 vakadan 7'sini geçer (6 açık + G1), 8 balonun hepsini alır, sentetik trafikte günde −2.204 TL (gelir ≈ 0) | Yok |
| R5 | Gizli testlerin zamanla toplanması | 14 sabit vaka herkese bilinir | Sabit gizli vakalar KANON'dur (değişmez); tohumlu 6 vaka her gün ve oyuncuya özeldir; ezberlenen 20 değer gerçek trafikte nadir görülür | Düşük |
| R6 | Müfettiş'i "oracle" yapma | Kategori balonlarından gizli girdiyi bulma | Müfettiş açık testler yeşil olmadan çalışmaz, günde 10 çağrı (Ek A), balon yalnızca kategori ve yön söyler (§7.1). Tek bir gizli girdiyi 1.400 dakikalık bir aralıkta ikili aramayla bulmak ≈ 10–11 çağrı ister: günde bir girdi | Düşük |
| R7 | Dengeleyici hata ile tavandan yararlanma | Eksik ve fazla ücret birbirini götürür | Toplam tavan referansın %95,7'sini verir; araç başına tavan %88,1 (§3.12, Ek A) | Düşük |
| R8 | Yapıştırma telemetrisinin yanlış pozitifi | Dürüst oyuncuya "Bayt sonra" | Kısa metotta dürüst çözümler birbirinin aynısı olabilir (§8.2); AST tek başına karar vermez | Orta |

### 8.2 AST benzerliği L1'de neden tek başına yetmez

Referans çözümün gövdesi altı deyimdir ve ipucu merdiveni "Taslak" kademesinde aynı iskeleti verir. Taslak'tan yazan iki dürüst oyuncunun kodu, tanımlayıcı ve sabitler maskelenerek karşılaştırıldığında neredeyse özdeş olur. KANON'un "AST benzerliği > %95" kuralı bu yüzden Otopark L1'de çok sayıda dürüst oyuncuyu "şüpheli" işaretler. Maliyet düşüktür (Savunma zaten zorunludur; yalnızca Bayt Savunma'ya kadar bekler), ama iki yan etki önlenmelidir: (1) `kopya_suphesi` bayrağı yalnızca AST benzerliği **ve** telemetri birlikte (yapıştırma olayı kodun ≥ %80'ini tek seferde getirmişse ya da yazım < 30 sn) konmalı; AST tek başına yalnızca "önce Savunma"yı tetiklemeli; (2) "En Hızlı Otopark" tablosuna yalnızca bayraksız kayıtlar girmeli. Öneri B3 (kopya tespiti) ve B7 (telemetri) ile hizalanır (Açık Soru 3).

### 8.3 Çözüm çeşitliliği: altı doğru çözüm biçimi

KANON'un if/else referansının (A) yanında beş doğru çözüm daha yazıldı (B–F). Altısı da 26 vakanın (20 sabit + 6 tohumlu) 26'sını geçti ve 0–300.000 dakika süpürmesinde referansla **sıfır sapma** verdi.

| Biçim | Yapı | Vaka (26) | 0–300.000 dk süpürmesi, referansla sapma |
|---|---|---|---|
| A — KANON referansı | `if` zinciri, `(dakika + 59) / 60` | 26 / 26 | — (referansın kendisi) |
| B — switch ifadesi | `switch` ifadesi, ilişkisel desenler | 26 / 26 | 0 |
| C — tablo / aralık | tablo + tek döngü | 26 / 26 | 0 |
| D — döngü sayacı | döngü sayacı (`for`) | 26 / 26 | 0 |
| E — double + Ceiling | `double` + `Math.Ceiling` | 26 / 26 | 0 |
| F — üçlü koşul | iç içe `? :` | 26 / 26 | 0 |

**B — `switch` ifadesi (ilişkisel desenler).** Koşul zinciri yerine değer ifadesi.

```csharp
public static int SwitchIfadesi(int dakika)
{
    int saat = (dakika + 59) / 60;
    int gun = (dakika + 1439) / 1440;
    return dakika switch
    {
        <= 0 => 0,
        < 120 => saat * 100,
        <= 360 => saat * 40,
        _ => gun * 250
    };
}
```

**C — tablo / aralık tabanlı.** Tarife veridir; algoritma tek döngüdür. Yeni dilim eklemek tek satırdır (Otopark L2–L4'te evrilmeye en yatkın biçim).

```csharp
private static readonly (int UstSinir, int Birim, int BirimUcret)[] Tarife =
{
    (119,          60,  100),   // 1. dilim: 1–119 dk, başlayan saat × 100
    (360,          60,   40),   // 2. dilim: 120–360 dk, başlayan saat × 40
    (int.MaxValue, 1440, 250),  // günlük: başlayan gün × 250
};
```

```csharp
public static int Tablo(int dakika)
{
    if (dakika <= 0) return 0;
    foreach (var (ust, birim, ucret) in Tarife)
        if (dakika <= ust)
            return (dakika + birim - 1) / birim * ucret;
    return 0; // erişilmez
}
```

**D — döngü sayacı.** Başlayan birimi `ceil` yerine sayarak bulur; Çarşı'nın `for` döngüsüyle çözülür.

```csharp
public static int Dongu(int dakika)
{
    if (dakika <= 0) return 0;
    int birim, ucret;
    if (dakika < 120) { birim = 60; ucret = 100; }
    else if (dakika <= 360) { birim = 60; ucret = 40; }
    else { birim = 1440; ucret = 250; }
    int sayac = 0;
    for (int gecen = 0; gecen < dakika; gecen += birim)
        sayac++;
    return sayac * ucret;
}
```

**E — `double` ve `Math.Ceiling`.** Doğru çalışır (n / 60,0 tam katlarda tam sayı verir); CS0121 hatası çıkmaması için `/ 60.0` yazımı şarttır.

```csharp
public static int CiftHassasiyet(int dakika)
{
    if (dakika <= 0) return 0;
    int saat = (int)Math.Ceiling(dakika / 60.0);
    if (dakika < 120) return saat * 100;
    if (dakika <= 360) return saat * 40;
    return (int)Math.Ceiling(dakika / 1440.0) * 250;
}
```

**F — iç içe üçlü koşul.** Tek ifade.

```csharp
public static int Uclu(int dakika) =>
    dakika <= 0 ? 0
    : dakika < 120 ? (dakika + 59) / 60 * 100
    : dakika <= 360 ? (dakika + 59) / 60 * 40
    : (dakika + 1439) / 1440 * 250;
```

Tasarım sonuçları. **(1)** Altı çözüm dört ayrı yapıyı temsil eder (koşul zinciri ya da üçlü koşul, `switch` ifadesi, veri tablosu, döngü) ve biri kayan noktayla yazılmıştır; AST benzerliği ölçüsü bu altısını negatif kontrol olarak kullanmalıdır: hiçbiri öbürünün kopyası olarak işaretlenmemeli (benzerlik ölçümü bu belgede **yapılmadı**, Roslyn gerektirir; Açık Soru 3). **(2)** Savunma sorusu çözüm biçimine uyarlanır (§3.7): tablo tabanlı çözümde Kurul `+59` değil "kodun 121 için kaç TL döndürüyor ve bu sayıyı hangi satır belirliyor?" sorar. **(3)** C ve B, L2–L4 yükseltmelerinde (abone, indirim, gece) daha kolay evrilir; oyuncuya biçim seçtirmek bir tasarım kararıdır, bir tavsiye değil. **(4)** E'nin varlığı Usta Yorumu'na malzeme verir: *"`double` kullanmak zorunda değildin; tam sayı bölmesiyle aynı sonucu alırsın."* (kod incelemesi, XP bonusu).

### 8.4 Özet politika

Kısa problemde kopya tamamen engellenemez; sistem (1) kopyanın **ödülünü** küçültür (gelir referans tavanlı, rozetler Savunma ister, bayraklı kayıtta Bayt sonradır), (2) **bedelini** yükseltir (Savunma kendi satırından ve somut girdiyle sorulur), (3) **kodu okumayı** da ölçer (Hata Bildirimi, Vitrin, Günlük Tekrar), (4) Müfettiş'in sızıntısını kapatır ve (5) yanlış pozitifi pahalı yapmaz (ceza yok, XP geri alınmaz).

---

## 9. Gerçek Çalıştırma Çıktısı

Aşağıdaki çıktı `dotnet run -c Release` ile üretilmiştir. Ana program `Program.cs`'tir; yardımcı dosyalar `Otopark.cs` (referans çözüm, alternatifler, mutasyonlar, hatalar, tohumlu üreteç), `Seviyeler.cs` (L2–L5), `Isletmeler.cs` (Büfe, Manav, Kargo ve diğer 16 işletme), `Harness.cs` (hakem, Müfettiş, Spec doğrulayıcı), `Profil.cs` (trafik profilleri), `Rapor.cs` ve `otopark-L1.json`'dur. Ortam: .NET SDK 10.0.300, çalışma zamanı 10.0.8, `net10.0`, EF Core InMemory 10.0.14. **Hiçbir satır elle düzenlenmedi.** Çıktının bu belgede kullanıldığı yerler: mutasyon/hata matrisi (§3.8, §3.11), profil tablosu ve gelir etkisi (§3.12), kategori tablosu (§7.1), alternatif çözüm kanıtı (§8.3), tüm test tabloları (§3–§5).

Okuma rehberi: `PASS`/`FAIL` satırı bir vakadır (`beklenen` KANON ya da Spec'ten, `gercek` kodun ürettiği değer). `==` başlıklı bloklar grup başlığıdır; `--` satırı grup özetidir; satır başında boşlukla başlayan satırlar bilgi satırlarıdır (sayım, ölçüm, tablo). Son satır toplamı verir.

```txt
KodKent B5 — dotnet doğrulama çalıştırması
Çalışma zamanı: .NET 10.0.8

== OTOPARK L1 — 6 açık test (referans çözüm) ==
PASS A1     dakika=    30 | beklenen=100 gercek=100
PASS A2     dakika=    61 | beklenen=200 gercek=200
PASS A3     dakika=   120 | beklenen=80 gercek=80
PASS A4     dakika=   121 | beklenen=120 gercek=120
PASS A5     dakika=   361 | beklenen=250 gercek=250
PASS A6     dakika=  1441 | beklenen=500 gercek=500
-- OTOPARK L1 — 6 açık test (referans çözüm): 6/6 geçti

== OTOPARK L1 — 14 gizli test (referans çözüm) ==
PASS G1     dakika=     0 | beklenen=0 gercek=0
PASS G2     dakika=     1 | beklenen=100 gercek=100
PASS G3     dakika=    59 | beklenen=100 gercek=100
PASS G4     dakika=    60 | beklenen=100 gercek=100
PASS G5     dakika=   119 | beklenen=200 gercek=200
PASS G6     dakika=   180 | beklenen=120 gercek=120
PASS G7     dakika=   359 | beklenen=240 gercek=240
PASS G8     dakika=   360 | beklenen=240 gercek=240
PASS G9     dakika=   720 | beklenen=250 gercek=250
PASS G10    dakika=  1439 | beklenen=250 gercek=250
PASS G11    dakika=  1440 | beklenen=250 gercek=250
PASS G12    dakika=  2880 | beklenen=500 gercek=500
PASS G13    dakika=  2881 | beklenen=750 gercek=750
PASS G14    dakika=100000 | beklenen=17500 gercek=17500
-- OTOPARK L1 — 14 gizli test (referans çözüm): 14/14 geçti

== OTOPARK L1 — 6 tohumlu test (oyuncu=ayse_kod, gün=2026-11-02, tohum=0x9D8D74B21D8FC748) ==
PASS T1     dakika=    34 katman=dilim-1-ic | beklenen=100 gercek=100
PASS T2     dakika=   218 katman=dilim-2-ic | beklenen=160 gercek=160
PASS T3     dakika=  1205 katman=gunluk-ic | beklenen=250 gercek=250
PASS T4     dakika= 18539 katman=cok-gunlu-ic | beklenen=3250 gercek=3250
PASS T5     dakika=   240 katman=saat-siniri | beklenen=160 gercek=160
PASS T6     dakika= 14401 katman=gun-siniri | beklenen=2750 gercek=2750
-- OTOPARK L1 — 6 tohumlu test (oyuncu=ayse_kod, gün=2026-11-02, tohum=0x9D8D74B21D8FC748): 6/6 geçti

== OTOPARK L1 — tohumlu kümelerin özellikleri (10.000 oyuncu) ==
   ayse_kod  2026-11-02  [34, 218, 1205, 18539, 240, 14401]  beklenen TL [100, 160, 250, 3250, 160, 2750]
   mert.k    2026-11-02  [75, 190, 1306, 19448, 239, 5760]  beklenen TL [200, 160, 250, 3500, 160, 1000]
   deniz07   2026-11-02  [69, 321, 953, 5513, 300, 7199]  beklenen TL [200, 240, 250, 1000, 200, 1250]
   ayse_kod  2026-11-03  [94, 332, 776, 3521, 240, 5761]  beklenen TL [200, 240, 250, 750, 160, 1250]
   10000 oyuncu: 6 değer birbirinden farklı = 10000/10000; 20 sabit testle çakışmayan = 10000/10000; katman aralıkları uygun = 10000/10000
   T5/T6'dan tam biri tam kat (biri komşu) = 10000/10000; aynı tohum → aynı küme (belirleyici) = 10000/10000; farklı küme sayısı = 10000
   referans çözüm ile bağımsız (döngü tabanlı) çözüm tüm tohumlu vakalarda uyuşuyor = True

== OTOPARK L1 — alternatif doğru çözümler (20 sabit + 6 tohumlu = 26 vaka her biri) ==
PASS B      B switch ifadesi   vaka=26/26 süpürme[0..300000] sapma=0 | beklenen=26/26 sapma=0 gercek=26/26 sapma=0
PASS C      C tablo/aralık     vaka=26/26 süpürme[0..300000] sapma=0 | beklenen=26/26 sapma=0 gercek=26/26 sapma=0
PASS D      D döngü sayacı     vaka=26/26 süpürme[0..300000] sapma=0 | beklenen=26/26 sapma=0 gercek=26/26 sapma=0
PASS E      E double+Ceiling   vaka=26/26 süpürme[0..300000] sapma=0 | beklenen=26/26 sapma=0 gercek=26/26 sapma=0
PASS F      F üçlü koşul       vaka=26/26 süpürme[0..300000] sapma=0 | beklenen=26/26 sapma=0 gercek=26/26 sapma=0
-- OTOPARK L1 — alternatif doğru çözümler (20 sabit + 6 tohumlu = 26 vaka her biri): 5/5 geçti

== CHALLENGE SPEC doğrulama (otopark-L1.json, içerik CI kuralları) ==
PASS SPEC   üst düzey alanlar tam ve sıralı | beklenen=id,isletme,seviye,baslik,musteri_istegi,sozlesme_karti,imza,iskelet_kod,public_tests,hidden_tests,seeded_tests,edge_cases,ipucu_merdiveni,savunma_sorulari,rubrik,odul gercek=id,isletme,seviye,baslik,musteri_istegi,sozlesme_karti,imza,iskelet_kod,public_tests,hidden_tests,seeded_tests,edge_cases,ipucu_merdiveni,savunma_sorulari,rubrik,odul
PASS SPEC   id biçimi ^[a-z0-9]+(-[a-z0-9]+)*-L[1-5]$ | beklenen=True gercek=True
PASS SPEC   id = isletme-L{seviye} | beklenen=otopark-L1 gercek=otopark-L1
PASS SPEC   public_tests sayısı | beklenen=6 gercek=6
PASS SPEC   hidden_tests sayısı | beklenen=14 gercek=14
PASS SPEC   seeded_tests.adet | beklenen=6 gercek=6
PASS SPEC   test kimlikleri benzersiz | beklenen=True gercek=True
PASS SPEC   tüm beklenenler referans çözümle uyuşuyor (uyuşmayan) | beklenen=0 gercek=0
PASS SPEC   tüm etiketler kategori fonksiyonuyla uyuşuyor (uyuşmayan) | beklenen=0 gercek=0
PASS SPEC   JSON testleri KANON §5.1 tablosuyla birebir | beklenen=True gercek=True
PASS SPEC   sozlesme_karti madde sayısı | beklenen=6 gercek=6
PASS SPEC   netlestirme.min_soru ≥ 4 | beklenen=True gercek=True
PASS SPEC   hazır soru sayısı | beklenen=8 gercek=8
PASS SPEC   edge_cases: her biri ≥1 geçerli teste bağlı (bağlanmayan) | beklenen=0 gercek=0
PASS SPEC   ipucu_merdiveni anahtarları | beklenen=pusula,fener,taslak,ornek gercek=pusula,fener,taslak,ornek
PASS SPEC   ipucu kademeleri boş değil | beklenen=True gercek=True
PASS SPEC   savunma_sorulari ≥ 4 | beklenen=True gercek=True
PASS SPEC   rubrik ağırlıkları 50+30+20 = 100 | beklenen=100 gercek=100
PASS SPEC   rubrik eşiği KANON §9 (70) | beklenen=70 gercek=70
PASS SPEC   odul.xp = 300 (KANON §3.3, T1 işletme açılışı) | beklenen=300 gercek=300
PASS SPEC   her mutasyon ≥1 sabit testle yakalanıyor (yakalanmayan) | beklenen=0 gercek=0
   bilgi: açık testlerle yakalanmayıp yalnızca gizli testle yakalanan mutasyon sayısı = 2/8
   kategori → sabit vaka kimlikleri:
      hemen-cikanlar   G1,G2
      iki-saatten-az   A1,A2,G3,G4
      iki-saat-civari  A3,A4,G5
      iki-alti-arasi   G6
      alti-saat-civari A5,G7,G8
      gunluk-tarife    G9
      bir-gun-civari   A6,G10,G11
      gunu-asanlar     G12,G13,G14
   kategori başına sabit vaka: hemen-cikanlar=2, iki-saatten-az=4, iki-saat-civari=3, iki-alti-arasi=1, alti-saat-civari=3, gunluk-tarife=1, bir-gun-civari=3, gunu-asanlar=3
   2'den az sabit vakalı kategori (tohumlu T2/T3/T5 ile tamamlanır): [iki-alti-arasi,gunluk-tarife]
PASS SPEC   10.000 oyuncuda her kategori (sabit+tohumlu) ≥ 2 vaka (eksik kalan oyuncu) | beklenen=0 gercek=0
-- CHALLENGE SPEC doğrulama (otopark-L1.json, içerik CI kuralları): 22/22 geçti

== HARNESS + MÜFETTİŞ — oyuncu çözümüne göre rapor (oyuncu=ayse_kod, gün=2026-11-02) ==
   [referans çözüm] açık 6/6 · gizli 14/14 · tohumlu 6/6 → durum: AÇILIŞ (Savunma'ya geçer)
   [M4 gün: ceil→'taban+1'] açık 6/6 · gizli 12/14 · tohumlu 6/6 → durum: DENEME (%50 gelir)
      balon (girdi gizli): Bir müşteri: "24 saat civarı kalanlar için fazla ücret ödedim."
      balon (girdi gizli): Bir müşteri: "24 saati aşanlar için fazla ücret ödedim."
      sunucu günlüğü (istemciye gitmez): G11 gizli dakika=1440 beklenen=250 gercek=500
      sunucu günlüğü (istemciye gitmez): G12 gizli dakika=2880 beklenen=500 gercek=750
   [M1 '<'→'<=' 2 saat] açık 5/6 → Müfettiş'e gönderilemez (önce açık testler yeşil olmalı)
      oyuncunun gördüğü: A3 dakika=120 beklenen=80 gercek=200
   [E13 açık testleri ezberleme] açık 6/6 · gizli 1/14 · tohumlu 0/6 → durum: DENEME (%50 gelir)
      balon (girdi gizli): Bir müşteri: "girip hemen çıkan müşteriler için ücret eksik hesaplanmış."
      balon (girdi gizli): Bir müşteri: "2 saatten az kalanlar için ücret eksik hesaplanmış."
      balon (girdi gizli): Bir müşteri: "2 saat civarı kalanlar için ücret eksik hesaplanmış."
      balon (girdi gizli): Bir müşteri: "2–6 saat arası kalanlar için ücret eksik hesaplanmış."
      balon (girdi gizli): Bir müşteri: "6 saat civarı kalanlar için ücret eksik hesaplanmış."
      balon (girdi gizli): Bir müşteri: "6–24 saat arası kalanlar için ücret eksik hesaplanmış."
      balon (girdi gizli): Bir müşteri: "24 saat civarı kalanlar için ücret eksik hesaplanmış."
      balon (girdi gizli): Bir müşteri: "24 saati aşanlar için ücret eksik hesaplanmış."
      sunucu günlüğü (istemciye gitmez): G2 gizli dakika=1 beklenen=100 gercek=0
      sunucu günlüğü (istemciye gitmez): G3 gizli dakika=59 beklenen=100 gercek=0
      sunucu günlüğü (istemciye gitmez): G4 gizli dakika=60 beklenen=100 gercek=0
      sunucu günlüğü: (+16 kalan vaka daha)
   [E1 saat: dakika/60 (taban)] açık 3/6 → Müfettiş'e gönderilemez (önce açık testler yeşil olmalı)
      oyuncunun gördüğü: A1 dakika=30 beklenen=100 gercek=0
      oyuncunun gördüğü: A2 dakika=61 beklenen=200 gercek=100
      oyuncunun gördüğü: A4 dakika=121 beklenen=120 gercek=80
   [M5 dilim yuvarlanmış saate göre] açık 5/6 → Müfettiş'e gönderilemez (önce açık testler yeşil olmalı)
      oyuncunun gördüğü: A2 dakika=61 beklenen=200 gercek=80
   [M2 '<=' → '<' 6 saat sınırı] açık 6/6 · gizli 13/14 · tohumlu 6/6 → durum: DENEME (%50 gelir)
      balon (girdi gizli): Bir müşteri: "6 saat civarı kalanlar için fazla ücret ödedim."
      sunucu günlüğü (istemciye gitmez): G8 gizli dakika=360 beklenen=240 gercek=250

== OTOPARK L1 — mutasyon ve yaygın hata matrisi (kalan vaka kimlikleri) ==
kod  | açıklama                       | açık kalan     | gizli kalan                                    | tohumlu yakalama | gelir etkisi   | şikâyet/gün | tahmin
M1   | '<'→'<=' 2 saat sınırı         | A3             | -                                              | 0/10000          | +2.1 TL/gün    | 1.7%        | uyuştu
M2   | '<='→'<' 6 saat sınırı         | -              | G8                                             | 0/10000          | +0.2 TL/gün    | 1.7%        | uyuştu
M3   | '+59'→'+60' saat yuvarlama     | A3             | G4,G6,G8                                       | 5021/10000       | +8.0 TL/gün    | 12.5%       | uyuştu
M4   | gün: ceil→'taban+1'            | -              | G11,G12                                        | 4979/10000       | +0.5 TL/gün    | 0.2%        | uyuştu
M5   | dilim yuvarlanmış saate göre   | A2             | G5                                             | 5101/10000       | -321.3 TL/gün  | 95.2%       | uyuştu
M6   | günlük sabit 250               | A6             | G12,G13,G14                                    | 10000/10000      | -60.0 TL/gün   | 21.5%       | uyuştu
M7   | 2. dilimde dakika/60           | A4             | G7                                             | 10000/10000      | -164.5 TL/gün  | 99.4%       | uyuştu
M8   | '>120 && <360' iki sınır       | A3             | G8                                             | 0/10000          | +3.1 TL/gün    | 3.4%        | uyuştu
E1   | saat: dakika/60 (taban)        | A1,A2,A4       | G2,G3,G5,G7                                    | 10000/10000      | -700.0 TL/gün  | 100.0%      | uyuştu
E2   | Ceiling((double)(d/60))        | A1,A2,A4,A5,A6 | G2,G3,G5,G7,G9,G10,G13,G14                     | 10000/10000      | -1299.4 TL/gün | 100.0%      | (hesaplandı)
E3   | Math.Round saat/gün            | A1,A2,A4,A5,A6 | G2,G9,G13,G14                                  | 9559/10000       | -559.9 TL/gün  | 99.9%       | (hesaplandı)
E8   | gün: dakika/1440 (taban)       | A5,A6          | G9,G10,G13,G14                                 | 10000/10000      | -599.5 TL/gün  | 93.1%       | uyuştu
E10  | en az 1 saat varsayımı         | -              | G1                                             | 0/10000          | 0.0 TL/gün     | 0.0%        | uyuştu
E11  | else-if sırası bozuk           | A1,A2          | G2,G3,G4,G5                                    | 10000/10000      | -484.6 TL/gün  | 99.9%       | uyuştu
E12  | '&&' yerine '||' yazıldı       | A1,A2,A5,A6    | G2,G3,G4,G5,G9,G10,G11,G12,G13,G14             | 10000/10000      | +545.0 TL/gün  | 100.0%      | (hesaplandı)
E13  | açık testleri ezberleme        | -              | G2,G3,G4,G5,G6,G7,G8,G9,G10,G11,G12,G13,G14    | 10000/10000      | -2204.3 TL/gün | 100.0%      | uyuştu

   yanlış sonuç veren girdiler (dakika 0–4400):
   M1   n=1: 120
   M2   n=1: 360
   M3   n=6: 60, 120, 180, 240, 300, 360
   M4   n=3: 1440, 2880, 4320
   M5   n=59: 61–119
   M6   n=2960: 1441–4400
   M7   n=236: 121–179, 181–239, 241–299, 301–359
   M8   n=2: 120, 360
   E1   n=354: 1–59, 61–119, 121–179, 181–239, 241–299, 301–359
   E2   n=4391: 1–59, 61–119, 121–179, 181–239, 241–299, 301–359, 361–1439, 1441–2879, 2881–4319, 4321–4400
   E3   n=2056: 1–30, 61–89, 121–150, 181–209, 241–270, 301–329, 361–720, 1441–2159, 2881–3600, 4321–4400
   E8   n=4037: 361–1439, 1441–2879, 2881–4319, 4321–4400
   E10  n=1: 0
   E11  n=119: 1–119
   E12  n=4159: 1–119, 361–4400
   E13  n=4394: 1–29, 31–60, 62–119, 122–360, 362–1440, 1442–4400

EQ1  'dakika <= 0' satırı silindi   açık kalan=- gizli kalan=- süpürme[0..300000] fark=0  → eşdeğer mutant, katalogdan elenir
EQ2  'dakika <= 360' → 'saat <= 6'  açık kalan=- gizli kalan=- süpürme[0..300000] fark=0  → eşdeğer mutant, katalogdan elenir
     (sözleşme dışı girdi: Esdeger(-200)=-200 TL, referans 0 TL — satır yalnızca negatif girdi içindir)
     (taşma kontrolü: UcretHesapla(2147482208)=372827000 TL; UcretHesapla(2147482209)=-372827000 TL; UcretHesapla(int.MaxValue)=-372826750 TL → KANON v1'de üst sınır yok; Ek A önerisi 10.000.000)

== HATA BİLDİRİMİ örneği — M4 (Müfettiş: 'Müşteri 1.440 dakika için 500 TL ödemiş.') ==
PASS HB-1   hatalı kod, dakika=1440 | beklenen=500 gercek=500
PASS HB-2   doğru kod, dakika=1440 | beklenen=250 gercek=250
PASS HB-3   hatalı kod, dakika=1441 (hata görünmez) | beklenen=500 gercek=500
PASS HB-4   hatalı kod, dakika=2880 | beklenen=750 gercek=750
PASS HB-5   doğru kod, dakika=2880 | beklenen=500 gercek=500
-- HATA BİLDİRİMİ örneği — M4 (Müfettiş: 'Müşteri 1.440 dakika için 500 TL ödemiş.'): 5/5 geçti

== HATA BİLDİRİMİ — Müfettiş cümleleri (8 mutasyon: hatalı kodun verdiği ücret / doğru ücret) ==
PASS HB-M1  tam 2 saat: hatalı kod → doğru ücret 80 | beklenen=200 gercek=200
PASS HB-M2  tam 6 saat: hatalı kod → doğru ücret 240 | beklenen=250 gercek=250
PASS HB-M3  tam 1 saat: hatalı kod → doğru ücret 100 | beklenen=200 gercek=200
PASS HB-M4  1.440 dakika: hatalı kod → doğru ücret 250 | beklenen=500 gercek=500
PASS HB-M5  61 dakika: hatalı kod → doğru ücret 200 | beklenen=80 gercek=80
PASS HB-M6  2.880 dakika: hatalı kod → doğru ücret 500 | beklenen=250 gercek=250
PASS HB-M7  121 dakika: hatalı kod → doğru ücret 120 | beklenen=80 gercek=80
PASS HB-M8  tam 2 saat: hatalı kod → doğru ücret 80 | beklenen=250 gercek=250
PASS HB-M8  tam 6 saat: hatalı kod → doğru ücret 240 | beklenen=250 gercek=250
-- HATA BİLDİRİMİ — Müfettiş cümleleri (8 mutasyon: hatalı kodun verdiği ücret / doğru ücret): 9/9 geçti

== HATA BİLDİRİMİ puanlama örnekleri (satır 30 + düzeltme 40 + neden 30; M4 = Orta, taban 60 B, XP 40) ==
PASS HB-P   A: satır doğru, düzeltme tam, Kurul 90 | beklenen=97 tam 60 B 40 XP gercek=97 tam 60 B 40 XP
PASS HB-P   B: satır doğru, düzeltme tam, Kurul 20 | beklenen=76 tam 60 B 40 XP gercek=76 tam 60 B 40 XP
PASS HB-P   C: satır ±1, gizli kırmızı, Kurul 50 | beklenen=50 yarım 30 B 20 XP gercek=50 yarım 30 B 20 XP
PASS HB-P   D: satır yanlış, derlenmedi, Kurul 35 | beklenen=11 yok 0 B 0 XP gercek=11 yok 0 B 0 XP
-- HATA BİLDİRİMİ puanlama örnekleri (satır 30 + düzeltme 40 + neden 30; M4 = Orta, taban 60 B, XP 40): 4/4 geçti

== OTOPARK L2 — açık testler ==
PASS A1     dakika=   30 plaka=34ABC123  aboneler=[34ABC123] | beklenen=0 gercek=0
PASS A2     dakika=   30 plaka=06XYZ789  aboneler=[34ABC123] | beklenen=100 gercek=100
PASS A3     dakika=  121 plaka=34ABC123  aboneler=[06XYZ789,34ABC123] | beklenen=0 gercek=0
PASS A4     dakika=  361 plaka=35DEF456  aboneler=[] | beklenen=250 gercek=250
PASS A5     dakika=  120 plaka=06XYZ789  aboneler=[34ABC123,35DEF456] | beklenen=80 gercek=80
-- OTOPARK L2 — açık testler: 5/5 geçti

== OTOPARK L2 — gizli testler ==
PASS G1     dakika= 1441 plaka=34ABC123  aboneler=[34ABC123] | beklenen=0 gercek=0
PASS G2     dakika=  120 plaka=34ABC12   aboneler=[34ABC123] | beklenen=80 gercek=80
PASS G3     dakika=    0 plaka=06XYZ789  aboneler=[06XYZ789] | beklenen=0 gercek=0
PASS G4     dakika= 2881 plaka=34ABC1234 aboneler=[34ABC123] | beklenen=750 gercek=750
   hata örneği: plaka.Contains(abone) → G4 sonucu 0 (beklenen 750), G2 sonucu 80 (beklenen 80)
-- OTOPARK L2 — gizli testler: 4/4 geçti

== OTOPARK L3 — açık testler ==
PASS A1     dakika=  120 tur=Normal | beklenen=80 gercek=80
PASS A2     dakika=  120 tur=Engelli | beklenen=40 gercek=40
PASS A3     dakika=   61 tur=Elektrikli | beklenen=100 gercek=100
PASS A4     dakika= 1441 tur=Engelli | beklenen=250 gercek=250
PASS A5     dakika=   -1 tur=Normal | beklenen=ArgumentOutOfRangeException(dakika) gercek=ArgumentOutOfRangeException(dakika)
-- OTOPARK L3 — açık testler: 5/5 geçti

== OTOPARK L3 — gizli testler ==
PASS G1     dakika=    0 tur=Engelli | beklenen=0 gercek=0
PASS G2     dakika=   60 tur=7 | beklenen=ArgumentOutOfRangeException(tur) gercek=ArgumentOutOfRangeException(tur)
PASS G3     dakika=   -5 tur=7 | beklenen=ArgumentOutOfRangeException(dakika) gercek=ArgumentOutOfRangeException(dakika)
PASS G4     dakika=  360 tur=Elektrikli | beklenen=120 gercek=120
PASS G5     dakika=   30 tur=Engelli | beklenen=50 gercek=50
   L1 ücretlerinden tek sayı olan = 0 (0..300000) → %50 indirimde yuvarlama sorusu çıkmaz
-- OTOPARK L3 — gizli testler: 5/5 geçti

== OTOPARK L4 — açık testler ==
PASS A1     giriş=2026-03-10 23:00 çıkış=2026-03-11 05:00 | beklenen=150 gercek=150
PASS A2     giriş=2026-03-10 14:00 çıkış=2026-03-10 14:30 | beklenen=100 gercek=100
PASS A3     giriş=2026-03-10 21:59 çıkış=2026-03-11 05:00 | beklenen=250 gercek=250
PASS A4     giriş=2026-03-10 22:00 çıkış=2026-03-11 06:00 | beklenen=150 gercek=150
PASS A5     giriş=2026-03-10 12:00 çıkış=2026-03-10 11:00 | beklenen=ArgumentOutOfRangeException(cikis) gercek=ArgumentOutOfRangeException(cikis)
-- OTOPARK L4 — açık testler: 5/5 geçti

== OTOPARK L4 — gizli testler ==
PASS G1     giriş=2026-03-10 23:00 çıkış=2026-03-11 06:01 | beklenen=250 gercek=250
PASS G2     giriş=2026-03-10 00:30 çıkış=2026-03-10 05:30 | beklenen=150 gercek=150
PASS G3     giriş=2026-03-10 06:00 çıkış=2026-03-10 08:00 | beklenen=80 gercek=80
PASS G4     giriş=2026-03-10 18:00 çıkış=2026-03-10 18:00 | beklenen=0 gercek=0
PASS G5     giriş=2026-03-10 23:00 çıkış=2026-03-12 23:00 | beklenen=500 gercek=500
PASS G6     giriş=2026-03-10 05:59 çıkış=2026-03-10 06:00 | beklenen=150 gercek=150
   DateTime sürümü ile aritmetik sürüm (Profil.L4Ucret) karşılaştırması: 200 çift, fark=0
-- OTOPARK L4 — gizli testler: 6/6 geçti

== OTOPARK L4 — hatalı çözümler (hangi vakalar kalır) ==
   referans çözüm                                       → kalan [-]
   hata: Hour >= 22 && Hour < 6 (boş pencere)             → kalan [A1,A4,G2,G6]
   hata: 'cikis < sabah' (06:00 çıkışı dışarıda)           → kalan [A4,G6]
   hata: (cikis - giris).Minutes (bileşen, toplam değil)  → kalan [A1,A3,A4,G1,G2,G3,G5]
   hata: yalnızca aynı takvim gününde gece sayılır         → kalan [A1,A4]

== OTOPARK L5 — hatalı çözüm: çıkışta kuyruğun SON gelenini içeri almak ==
   G1 senaryosu, LIFO sürüm: sonuclar=[Kabul,Kuyrukta,Kuyrukta,Kuyrukta,Cikti,KuyrukVazgecti] iceride=1 kuyruk=[C]
   beklenen (FIFO)         : sonuclar=[Kabul,Kuyrukta,Kuyrukta,Kuyrukta,Cikti,Cikti] iceride=1 kuyruk=[D]

== OTOPARK L5 — açık testler ==
PASS A1     kap=2 kuyruk=1 [G:A G:B] | beklenen=sonuclar=[Kabul,Kabul] iceride=2 kuyruk=[] gercek=sonuclar=[Kabul,Kabul] iceride=2 kuyruk=[]
PASS A2     kap=2 kuyruk=1 [G:A G:B G:C] | beklenen=sonuclar=[Kabul,Kabul,Kuyrukta] iceride=2 kuyruk=[C] gercek=sonuclar=[Kabul,Kabul,Kuyrukta] iceride=2 kuyruk=[C]
PASS A3     kap=2 kuyruk=1 [G:A G:B G:C G:D] | beklenen=sonuclar=[Kabul,Kabul,Kuyrukta,Reddedildi] iceride=2 kuyruk=[C] gercek=sonuclar=[Kabul,Kabul,Kuyrukta,Reddedildi] iceride=2 kuyruk=[C]
PASS A4     kap=2 kuyruk=2 [G:A G:B G:C G:D C:A] | beklenen=sonuclar=[Kabul,Kabul,Kuyrukta,Kuyrukta,Cikti] iceride=2 kuyruk=[D] gercek=sonuclar=[Kabul,Kabul,Kuyrukta,Kuyrukta,Cikti] iceride=2 kuyruk=[D]
PASS A5     kap=1 kuyruk=1 [G:A G:A] | beklenen=sonuclar=[Kabul,Zaten] iceride=1 kuyruk=[] gercek=sonuclar=[Kabul,Zaten] iceride=1 kuyruk=[]
-- OTOPARK L5 — açık testler: 5/5 geçti

== OTOPARK L5 — gizli testler ==
PASS G1     kap=1 kuyruk=3 [G:A G:B G:C G:D C:A C:B] | beklenen=sonuclar=[Kabul,Kuyrukta,Kuyrukta,Kuyrukta,Cikti,Cikti] iceride=1 kuyruk=[D] gercek=sonuclar=[Kabul,Kuyrukta,Kuyrukta,Kuyrukta,Cikti,Cikti] iceride=1 kuyruk=[D]
PASS G2     kap=1 kuyruk=2 [G:A G:B G:C C:B C:A] | beklenen=sonuclar=[Kabul,Kuyrukta,Kuyrukta,KuyrukVazgecti,Cikti] iceride=1 kuyruk=[] gercek=sonuclar=[Kabul,Kuyrukta,Kuyrukta,KuyrukVazgecti,Cikti] iceride=1 kuyruk=[]
PASS G3     kap=2 kuyruk=1 [C:X] | beklenen=sonuclar=[Bilinmiyor] iceride=0 kuyruk=[] gercek=sonuclar=[Bilinmiyor] iceride=0 kuyruk=[]
PASS G5     kap=1 kuyruk=2 [G:A G:B G:B] | beklenen=sonuclar=[Kabul,Kuyrukta,Zaten] iceride=1 kuyruk=[B] gercek=sonuclar=[Kabul,Kuyrukta,Zaten] iceride=1 kuyruk=[B]
PASS G4     varsayılan 50/10, 61 farklı plaka | beklenen=Kabul=50 Kuyrukta=10 Reddedildi=1 iceride=50 kuyruk=10 gercek=Kabul=50 Kuyrukta=10 Reddedildi=1 iceride=50 kuyruk=10
-- OTOPARK L5 — gizli testler: 5/5 geçti

== OTOPARK L5-b — Task'lı bekleme (async) ==
PASS A1     kap=1: ilk giriş | beklenen=IsCompleted=True sonuc=Kabul gercek=IsCompleted=True sonuc=Kabul
PASS A2     kap=1: ikinci giriş (dolu) | beklenen=IsCompleted=False gercek=IsCompleted=False
PASS A3     Cikis() sonrası ikinci giriş | beklenen=IsCompleted=True sonuc=Kabul gercek=IsCompleted=True sonuc=Kabul
PASS G1     FIFO: iki çıkış | beklenen=b=True c=False → b=True c=True gercek=b=True c=False → b=True c=True
-- OTOPARK L5-b — Task'lı bekleme (async): 4/4 geçti

== BÜFE L1 — açık testler ==
PASS A1     fiyat= 12.35 verilen=  20 | beklenen="1x5 2x1 1x50kr 1x10kr 1x5kr" gercek="1x5 2x1 1x50kr 1x10kr 1x5kr"
PASS A2     fiyat=    10 verilen=  10 | beklenen="" gercek=""
PASS A3     fiyat=  3.50 verilen=   5 | beklenen="1x1 1x50kr" gercek="1x1 1x50kr"
PASS A4     fiyat= 99.95 verilen= 100 | beklenen="1x5kr" gercek="1x5kr"
PASS A5     fiyat=    45 verilen= 100 | beklenen="2x20 1x10 1x5" gercek="2x20 1x10 1x5"
-- BÜFE L1 — açık testler: 5/5 geçti

== BÜFE L1 — gizli testler ==
PASS G1     fiyat=  4.90 verilen=   5 | beklenen="1x10kr" gercek="1x10kr"
PASS G2     fiyat=  0.30 verilen=   1 | beklenen="1x50kr 2x10kr" gercek="1x50kr 2x10kr"
PASS G3     fiyat=  0.05 verilen= 200 | beklenen="9x20 1x10 1x5 4x1 1x50kr 1x25kr 2x10kr" gercek="9x20 1x10 1x5 4x1 1x50kr 1x25kr 2x10kr"
PASS G4     fiyat= 17.65 verilen=  20 | beklenen="2x1 1x25kr 1x10kr" gercek="2x1 1x25kr 1x10kr"
PASS G5     fiyat=  6.40 verilen=  10 | beklenen="3x1 1x50kr 1x10kr" gercek="3x1 1x50kr 1x10kr"
   hata örneği: 'double' ile yazılan sürümde kalan vakalar = [A4,G1,G2,G3,G5]
   gelir bağdaştırıcısı: dizenin TL değeri (verilen − fiyat) ile uyuşmayan vaka = 0
   açgözlü çözüm, 0,05 TL adımıyla 4000 para üstü tutarının tümünde en az parça sayısını veriyor mu? en iyi olmayan = 0
-- BÜFE L1 — gizli testler: 5/5 geçti

== MANAV L1 — açık testler ==
PASS A1     kilo=  3 kiloFiyati= 40 | beklenen=120 gercek=120
PASS A2     kilo=  5 kiloFiyati= 40 | beklenen=180 gercek=180
PASS A3     kilo=  7 kiloFiyati= 35 | beklenen=220 gercek=220
PASS A4     kilo= 12 kiloFiyati= 25 | beklenen=240 gercek=240
PASS A5     kilo=  0 kiloFiyati= 40 | beklenen=0 gercek=0
-- MANAV L1 — açık testler: 5/5 geçti

== MANAV L1 — gizli testler ==
PASS G1     kilo=  4 kiloFiyati= 40 | beklenen=160 gercek=160
PASS G2     kilo= 10 kiloFiyati= 40 | beklenen=360 gercek=360
PASS G3     kilo= 11 kiloFiyati= 40 | beklenen=352 gercek=352
PASS G4     kilo=  9 kiloFiyati= 33 | beklenen=267 gercek=267
   hata: önce /100 (kilo*fiyat/100*oran)     → kalan [A1,A3,G1,G3,G4]
   hata: birim fiyat önce kırpılıyor          → kalan [A3,G4]
   hata: 5 kg kademe dışında (kilo <= 5)      → kalan [A2]
   hata: artımlı (yalnızca fazlasına) indirim → kalan [A2,A3,A4,G2,G3,G4]
   anomali: 10 kg = 360 TL, 11 kg = 352 TL (çok alan daha az öder)
-- MANAV L1 — gizli testler: 4/4 geçti

== KARGO DEPOSU L1 — açık testler ==
PASS A1     raflar=[5,0,12] | beklenen=117 gercek=117
PASS A2     raflar=[20] | beklenen=120 gercek=120
PASS A3     raflar=[21] | beklenen=130 gercek=130
PASS A4     raflar=[] | beklenen=0 gercek=0
PASS A5     raflar=[0,0,0] | beklenen=45 gercek=45
-- KARGO DEPOSU L1 — açık testler: 5/5 geçti

== KARGO DEPOSU L1 — gizli testler ==
PASS G1     raflar=[1] | beklenen=6 gercek=6
PASS G2     raflar=[30,20,21,19,0] | beklenen=599 gercek=599
PASS G3     raflar=[60] | beklenen=520 gercek=520
PASS G4     raflar=[20,20,20,...] | beklenen=7200 gercek=7200
   hata: taşkın için tüm koli 10 TL            → kalan [A3,G2,G3]
   hata: boş raf kirası unutuldu               → kalan [A1,A5,G2]
   eşdeğer: 'k < 20' + taşkın dalı (20 → 120)  → kalan [-] (20 koli iki biçimde de 120 TL)
-- KARGO DEPOSU L1 — gizli testler: 4/4 geçti

== KALAN 16 İŞLETME (#5–#20) — L1 için 2+ örnek test (referans taslağıyla) ==
PASS balik-hali-L1/1 "hamsi:2,levrek:1" | beklenen=410 gercek=410
PASS balik-hali-L1/2 "palamut:3" | beklenen=360 gercek=360
PASS balik-hali-L1/3 "" | beklenen=0 gercek=0
PASS oto-yikama-L1/1 Standart + [Cila] | beklenen=370 gercek=370
PASS oto-yikama-L1/2 Hızlı + [Cila,Koltuk] (2 adet: %10) | beklenen=420 gercek=420
PASS oto-yikama-L1/3 Detay + 4 ek hizmet (%20) | beklenen=818 gercek=818
PASS gumruk-L1/1 "34 ABC 123" | beklenen=true gercek=true
PASS gumruk-L1/2 "34 ABQ 123" (Q yok) | beklenen=false gercek=false
PASS gumruk-L1/3 "82 AB 123" (il kodu 82) | beklenen=false gercek=false
PASS gumruk-L1/4 "+4 AB 123" | beklenen=false gercek=false
PASS oto-tamirhane-L1/1 new Car().MaintenanceFee(15000) | beklenen=1250 gercek=1250
PASS oto-tamirhane-L1/2 new Pickup().MaintenanceFee(20000) | beklenen=1800 gercek=1800
PASS mobilya-atolyesi-L1/1 Sandalye 4×250 | beklenen=900 gercek=900
PASS mobilya-atolyesi-L1/2 Masa 1×800 | beklenen=800 gercek=800
PASS trafo-merkezi-L1/1 [1000 On, 500 Standby, 200 Off] | beklenen=1050 gercek=1050
PASS trafo-merkezi-L1/2 [] | beklenen=0 gercek=0
PASS kutuphane-L1/1 Ceza(01-01 → 01-20) | beklenen=16 gercek=16
PASS kutuphane-L1/2 Ceza(01-01 → 01-15) son gün | beklenen=0 gercek=0
PASS kutuphane-L1/3 Ceza(01-01 → 03-01) tavan | beklenen=120 gercek=120
PASS kutuphane-L1/4 ToplamCeza([A 01-01→01-20, B 01-05→açık], bugün 01-25) | beklenen=37 gercek=37
PASS sinema-L1/1 Reserve(A1, 20:00) | beklenen=true gercek=true
PASS sinema-L1/2 Reserve(A1, 20:00) tekrar | beklenen=false gercek=false
PASS sinema-L1/3 Reserve(A1, 22:00) başka seans | beklenen=true gercek=true
PASS sinema-L1/4 Count(20:00) | beklenen=1 gercek=1
PASS sinema-L1/5 ReservationBook<(int,int)> (genel tür) | beklenen=true gercek=true
PASS haber-ajansi-L1/1 priority 2 → olay, priority 1 → olay yok | beklenen=["Köprü açıldı"] gercek=["Köprü açıldı"]
PASS banka-L1/1 1000, [300,800,200], onay ≤500 | beklenen=500 gercek=500
PASS banka-L1/2 onay hiç verilmez | beklenen=1000 gercek=1000
PASS banka-L1/3 yetmeyen havale için onay servisi aranmaz (800 > 700) | beklenen=500 çağrı=2 gercek=500 çağrı=2
PASS sigorta-L1/1 (30, 0 hasar, dar kapsam) | beklenen=900 gercek=900
PASS sigorta-L1/2 (22, 3 hasar, geniş kapsam) | beklenen=2500 gercek=2500
PASS sigorta-L1/3 (40, 1 hasar, geniş kapsam) | beklenen=1400 gercek=1400
PASS borsa-panosu-L1/1 500 sonra 200 {price:12.5} | beklenen=12.5 çağrı=2 gercek=12.5 çağrı=2
PASS borsa-panosu-L1/2 hep 500 | beklenen=null çağrı=3 gercek=null çağrı=3
PASS hastane-kayit-L1/1 iki hasta kaydı → kimlikler | beklenen=1,2 gercek=1,2
PASS hastane-kayit-L1/2 ad boş | beklenen=ArgumentException(name) gercek=ArgumentException(name)
PASS hastane-kayit-L1/3 Patients.Count() | beklenen=2 gercek=2
PASS otel-L1/1 Book: iki kayıt da başarılı | beklenen=true dolu=1 misafir=1 gercek=true dolu=1 misafir=1
PASS otel-L1/2 Book: 2. kayıt patlar → geri al | beklenen=false dolu=0 misafir=0 gercek=false dolu=0 misafir=0
PASS yemek-siparis-platformu-L1/1 1 kalem, 2 adet × 50 | beklenen=201 100 gercek=201 100
PASS yemek-siparis-platformu-L1/2 menüde olmayan ürün | beklenen=404 gercek=404
PASS yemek-siparis-platformu-L1/3 boş sepet | beklenen=400 gercek=400
PASS yemek-siparis-platformu-L1/4 adet 0 | beklenen=400 gercek=400
PASS sehir-uygulamasi-L1/1 iki Get<ReportService>() aynı örnek mi | beklenen=true gercek=true
PASS sehir-uygulamasi-L1/2 bağımlılık çözüldü mü (Clock.Now) | beklenen=2026-11-02T09:00:00 gercek=2026-11-02T09:00:00
-- KALAN 16 İŞLETME (#5–#20) — L1 için 2+ örnek test (referans taslağıyla): 45/45 geçti

== İPUCU MERDİVENİ 'Örnek' kademesi kodları (oyuncuya gösterilen kod doğru mu?) ==
PASS ORN-OP BisikletUcreti(20) | beklenen=20 gercek=20
PASS ORN-OP BisikletUcreti(44) | beklenen=30 gercek=30
PASS ORN-OP BisikletUcreti(45) | beklenen=30 gercek=30
PASS ORN-OP BisikletUcreti(180) | beklenen=90 gercek=90
PASS ORN-OP BisikletUcreti(181) | beklenen=120 gercek=120
PASS ORN-OP BisikletUcreti(1441) | beklenen=240 gercek=240
PASS ORN-MN Koli(4) kademe örneği | beklenen=30 gercek=30
PASS ORN-MN Koli(5) kademe örneği | beklenen=50 gercek=50
PASS ORN-MN Koli(10) kademe örneği | beklenen=50 gercek=50
PASS ORN-MN Koli(11) kademe örneği | beklenen=80 gercek=80
PASS ORN-BF 87 puan → 25'lik rozet sayısı, kalan | beklenen=3 12 gercek=3 12
PASS ORN-KG not listesi toplamı (foreach) | beklenen=195 gercek=195
PASS ORN-1.2 (dakika + 59) / 60 kalıbı: 60, 61, 119, 120, 121 | beklenen=1,2,2,2,3 gercek=1,2,2,2,3
PASS ORN-L2 Yasakli(kedi / kuş / kediler) | beklenen=True,False,False gercek=True,False,False
PASS ORN-L3 YasKontrol(-1) / YasKontrol(0) | beklenen=ArgumentOutOfRangeException(yas) "ok" gercek=ArgumentOutOfRangeException(yas) "ok"
PASS ORN-L4 Mesai 08:59 / 09:00 / 17:59 / 18:00 | beklenen=False,True,True,False gercek=False,True,True,False
PASS ORN-L5 Queue: Enqueue(a), Enqueue(b), Dequeue(), Count | beklenen=a 1 gercek=a 1
-- İPUCU MERDİVENİ 'Örnek' kademesi kodları (oyuncuya gösterilen kod doğru mu?): 17/17 geçti

== MÜFETTİŞ ŞİKÂYET KATEGORİLERİ (otopark-L1): aralık | sabit vaka | balon metinleri ==
hemen-cikanlar   | 0–5       | G1,G2       | fazla: Bir müşteri: "girip hemen çıkan müşteriler için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "girip hemen çıkan müşteriler için ücret eksik hesaplanmış."
iki-saatten-az   | 6–99      | A1,A2,G3,G4 | fazla: Bir müşteri: "2 saatten az kalanlar için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "2 saatten az kalanlar için ücret eksik hesaplanmış."
iki-saat-civari  | 100–140   | A3,A4,G5    | fazla: Bir müşteri: "2 saat civarı kalanlar için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "2 saat civarı kalanlar için ücret eksik hesaplanmış."
iki-alti-arasi   | 141–340   | G6          | fazla: Bir müşteri: "2–6 saat arası kalanlar için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "2–6 saat arası kalanlar için ücret eksik hesaplanmış."
alti-saat-civari | 341–380   | A5,G7,G8    | fazla: Bir müşteri: "6 saat civarı kalanlar için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "6 saat civarı kalanlar için ücret eksik hesaplanmış."
gunluk-tarife    | 381–1399  | G9          | fazla: Bir müşteri: "6–24 saat arası kalanlar için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "6–24 saat arası kalanlar için ücret eksik hesaplanmış."
bir-gun-civari   | 1400–1480 | A6,G10,G11  | fazla: Bir müşteri: "24 saat civarı kalanlar için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "24 saat civarı kalanlar için ücret eksik hesaplanmış."
gunu-asanlar     | 1481+     | G12,G13,G14 | fazla: Bir müşteri: "24 saati aşanlar için fazla ücret ödedim."
                 |           |             | eksik: Bir müşteri: "24 saati aşanlar için ücret eksik hesaplanmış."
hata    : Bariyer ekranı: "2 saat civarı kalanlar için sistem hata verdi."
zaman   : Bariyer ekranı: "2 saat civarı kalanlar için cevap gelmedi."

== AYNI ŞEMA, DÖRT YÜZEY — sınır üçlüleri (Otopark → Manav → Oto Yıkama → Kütüphane) ==
PASS OTOPARK UcretHesapla(119) | beklenen=200 gercek=200
PASS OTOPARK UcretHesapla(120) | beklenen=80 gercek=80
PASS OTOPARK UcretHesapla(121) | beklenen=120 gercek=120
PASS MANAV  Tutar(4, 40) | beklenen=160 gercek=160
PASS MANAV  Tutar(5, 40) | beklenen=180 gercek=180
PASS MANAV  Tutar(6, 40) | beklenen=216 gercek=216
PASS MANAV  Tutar(10, 40) | beklenen=360 gercek=360
PASS MANAV  Tutar(11, 40) | beklenen=352 gercek=352
PASS OTOYIKAMA Standart + [Cila] | beklenen=370 gercek=370
PASS OTOYIKAMA Standart + [Cila,Koltuk] | beklenen=520 gercek=520
PASS OTOYIKAMA Standart + [Cila,Koltuk,Motor] | beklenen=610 gercek=610
PASS OTOYIKAMA Standart + [Cila,Koltuk,Motor,Koku] | beklenen=602 gercek=602
PASS OTOYIKAMA Standart + [Cila,Koltuk,Motor,Lastik] | beklenen=618 gercek=618
PASS KUTUPHANE gecikme=0 gün | beklenen=0 gercek=0
PASS KUTUPHANE gecikme=1 gün | beklenen=2 gercek=2
PASS KUTUPHANE gecikme=3 gün | beklenen=6 gercek=6
PASS KUTUPHANE gecikme=4 gün | beklenen=11 gercek=11
PASS KUTUPHANE gecikme=10 gün | beklenen=41 gercek=41
PASS KUTUPHANE gecikme=11 gün | beklenen=51 gercek=51
PASS KUTUPHANE gecikme=17 gün | beklenen=111 gercek=111
PASS KUTUPHANE gecikme=18 gün | beklenen=120 gercek=120
PASS KUTUPHANE-HATA tüm gecikmeye tek oran (5 gün: 5 × 5); doğru artımlı değer 16 | beklenen=25 16 gercek=25 16
PASS KUTUPHANE-HATA tüm gecikmeye tek oran (11 gün: 10 × 11 = 110); doğru artımlı değer 51 | beklenen=110 51 gercek=110 51
PASS KUTUPHANE saat önemsiz: iade 23:59 / 00:01 aynı gün | beklenen=2 2 gercek=2 2
-- AYNI ŞEMA, DÖRT YÜZEY — sınır üçlüleri (Otopark → Manav → Oto Yıkama → Kütüphane): 24/24 geçti

== SENTETİK TRAFİK PROFİLLERİ — beklenen günlük gelir (tam sayım) vs B2 §7.1 ==
L1 dilim ortalamaları (TL/araç): 149.58 | 179.59 | 250.00 | 500.00
L1  araç=12  ağırlık=45/35/18/2             E[TL/araç]= 185.17 çarpan=1.000 → beklenen TL/gün=    2222  B/gün=  222.2  hedef=  220 sapma=   1.0%
L2  araç=20  ağırlık=45/35/18/2             E[TL/araç]= 185.17 çarpan=0.950 → beklenen TL/gün=    3518  B/gün=  351.8  hedef=  350 sapma=   0.5%
L3  araç=30  ağırlık=40/33/22/5             E[TL/araç]= 199.10 çarpan=0.925 → beklenen TL/gün=    5525  B/gün=  552.5  hedef=  560 sapma=  -1.3%
L4  araç=40  ağırlık=27/30/31/12            E[TL/araç]= 231.08 çarpan=1.000 → beklenen TL/gün=    9243  B/gün=  924.3  hedef=  900 sapma=   2.7%
L5  araç=50  ağırlık=15/25/40/20            E[TL/araç]= 292.33 çarpan=1.000 → beklenen TL/gün=   14617  B/gün= 1461.7  hedef= 1440 sapma=   1.5%
L1 araç başına σ=71.8 TL; 12 araçlık günün σ=249 TL (±%11.2); 7 günlük ortalamanın σ=±%4.2
Büfe L1  : 100 satış/gün, menü ağırlık toplamı=1.00, ortalama sepet=30.42 TL → beklenen TL/gün=3042  B/gün=304.2  hedef=300 sapma=+1.4%
Manav L1 : 28 müşteri/gün, kilo ağırlık toplamı=1.00, ortalama sepet=136.72 TL → beklenen TL/gün=3828  B/gün=382.8  hedef=380 sapma=+0.7%
Kargo L1 : 60 raf/gün (0 koli %8, 1–20 %72, 21–30 %20), ortalama raf=81.56 TL → beklenen TL/gün=4894  B/gün=489.4  hedef=500 sapma=-2.1%
Gece batch simülasyonu (5000 gün × 12 araç, tohum=işletme+gün): referans ort. = 2220 TL/gün (σ = 248 TL), 222.0 B/gün
Dengeleyici hatalı çözüm (61–119 dk eksik, 361–1440 dk fazla): ham toplam ort. = 2224 TL/gün
   B2 §8.2 toplam tavanı  min(Σoyuncu, Σreferans)  → gelir ort. = 2124 TL/gün (95.7% referansın)
   araç başına tavan       Σ min(oyuncu_i, ref_i)    → gelir ort. = 1956 TL/gün (88.1% referansın)

== ÖZET ==
OK     6/6   OTOPARK L1 — 6 açık test (referans çözüm)
OK    14/14  OTOPARK L1 — 14 gizli test (referans çözüm)
OK     6/6   OTOPARK L1 — 6 tohumlu test (oyuncu=ayse_kod, gün=2026-11-02, tohum=0x9D8D74B21D8FC748)
OK     5/5   OTOPARK L1 — alternatif doğru çözümler (20 sabit + 6 tohumlu = 26 vaka her biri)
OK    22/22  CHALLENGE SPEC doğrulama (otopark-L1.json, içerik CI kuralları)
OK     5/5   HATA BİLDİRİMİ örneği — M4 (Müfettiş: 'Müşteri 1.440 dakika için 500 TL ödemiş.')
OK     9/9   HATA BİLDİRİMİ — Müfettiş cümleleri (8 mutasyon: hatalı kodun verdiği ücret / doğru ücret)
OK     4/4   HATA BİLDİRİMİ puanlama örnekleri (satır 30 + düzeltme 40 + neden 30; M4 = Orta, taban 60 B, XP 40)
OK     5/5   OTOPARK L2 — açık testler
OK     4/4   OTOPARK L2 — gizli testler
OK     5/5   OTOPARK L3 — açık testler
OK     5/5   OTOPARK L3 — gizli testler
OK     5/5   OTOPARK L4 — açık testler
OK     6/6   OTOPARK L4 — gizli testler
OK     5/5   OTOPARK L5 — açık testler
OK     5/5   OTOPARK L5 — gizli testler
OK     4/4   OTOPARK L5-b — Task'lı bekleme (async)
OK     5/5   BÜFE L1 — açık testler
OK     5/5   BÜFE L1 — gizli testler
OK     5/5   MANAV L1 — açık testler
OK     4/4   MANAV L1 — gizli testler
OK     5/5   KARGO DEPOSU L1 — açık testler
OK     4/4   KARGO DEPOSU L1 — gizli testler
OK    45/45  KALAN 16 İŞLETME (#5–#20) — L1 için 2+ örnek test (referans taslağıyla)
OK    17/17  İPUCU MERDİVENİ 'Örnek' kademesi kodları (oyuncuya gösterilen kod doğru mu?)
OK    24/24  AYNI ŞEMA, DÖRT YÜZEY — sınır üçlüleri (Otopark → Manav → Oto Yıkama → Kütüphane)
TOPLAM: 229 vaka çalıştırıldı, 229 geçti, 0 kaldı.
```

---

## 10. Varsayımlar

1. **Çalışma zamanı ve dil sürümü.** Sandbox Roslyn derleyicisi .NET 10 / C# 14 ile aynı sürümdedir; bu belgede kullanılan ilişkisel desenler (C# 9), `switch` ifadesi ve genel `Enum.IsDefined<T>` bu sürümde derlenir. Çarşı dersleri `switch` ifadesini ve ilişkisel desenleri öğretir varsayılmıştır (B4 doğrular).
2. **Test kimlikleri** `A…` (açık), `G…` (gizli), `T…` (tohumlu); Challenge Spec UTF-8 JSON'dur ve içerik deposunda `isletme-L{n}.vX.json` adıyla sürümlenir (ayrıntı B7).
3. **Oyun günü** TR saatiyle 04:00'te değişir (B2 §4.4 ile aynı); tohumlu küme o gün için Redis'te sabittir.
4. **Keskin Göz A/B'si** (A-vizyon-FINAL açık soru 1) sürer: varsayılan kolda Usta anomaliyi söylemez, yalnızca serbest metinle soran ödüllendirilir. Serbest metin eşlemesi Haiku sınıflandırıcıdır (güven ≥ 0,8; ≈0,0001 $).
5. **Sentetik trafik** dilimler içinde dakikaları tekdüze çeker; B2 hedefi *beklenen* günlük gelirdir (tek günde ±%11 dalgalanma normaldir, 7 günlük ortalama ±%4). L3–L5 kalış ağırlıkları ve L2'nin %5 abone oranı B5 önerisidir.
6. **NPC adları.** Altısı mevcut belgelerden, on dördü B5 önerisidir (§2); B6 çakışmayı çözer. "Usta" sözcüğü kullanılmadı.
7. **Büfe, Manav ve Kargo L1 kuralları** (kupür kümesi, 5/10 kilo eşikleri ve %10/%20, kargo 15/6/10 TL ve 20 koli kapasitesi) B5 önerisidir; B2'nin yalnızca günlük gelir hedefi vardır.
8. **Hata Bildirimi puanlaması** (30/40/30, eşikler 70 ve 40, Bayt tabanı 40/60/90/120) B5 önerisidir; XP KANON §3.3'tür (40/60/100/150).
9. **Müfettiş** günde 10 çağrı ve açık testler yeşilken çalışır (B5 önerisi).
10. **Kurul puanları** (Savunma örnekleri, Hata Bildirimi nedenleri) açıklayıcıdır; gerçek puanlar B3'ün altın kümesiyle kalibre edilir (kappa ≥ 0,75, KANON §9).
11. **Yükseltme dersleri** B2 varsayımı 8 ile aynıdır (Otopark L2 Liman 2.1, L3 Atölyeler 3.4, Büfe L2 Çarşı 1.11, L3 Liman 2.5); B4 kesinleştirir.
12. **EF Core InMemory** yalnızca sandbox testleri içindir; transaction desteklemediğinden Otel L1 geri alma mantığını saf C# arayüzüyle sınar (gerçek veritabanı transaction'ı Otel L4'te (çakışma kontrolü) bellek içi SQLite ile denenir; B7 karar verir).
13. **Görev metnindeki "13 işletme"** bir sayım hatası kabul edilmiştir: Otopark, Büfe, Manav, Kargo çıkınca 16 işletme kalır ve hepsi §5'te ele alınmıştır.
14. **Manav L1'de döngü yoktur** (§4.2): Çarşı'da dizi öğretilmediği için çok kalemli sepet L2'ye bırakıldı.
15. **Örnek oyuncular** (`ayse_kod`, `mert.k`, `deniz07`) kurgusaldır; tohumlu küme örnekleri yalnızca tohum kuralını gösterir.

---

## 11. Açık Sorular

Önem sırasıyla (en çok 10):

1. **Manav L1 ve "Döngüler".** KANON §5 Manav L1 konusunu "Döngüler, `switch`, miktara göre indirim kademesi" diye yazar; Çarşı'da dizi olmadığı için L1 kodu döngüsüz bırakıldı (§4.2). Döngü Ruhsat görevinde (B4) mi çalışılacak, yoksa Manav L1'e döngü gerektiren bir kural (ör. "her 5 kiloda 1 kilo hediye") eklenecek mi?
2. **Gece tarifesi semantiği (Otopark L4).** "22:00–06:00 sabit 150" kısa gece kalışları için de 150 mi (B5'in seçimi, müşteri kararı), yoksa `min(L1, 150)` tavanı mı? İkincisi 30 dakikalık gece kalışını 100 TL'ye düşürür ve yeni anomali yaratmaz.
3. **Kopya bayrağı.** AST benzerliği L1'in altı deyimlik çözümünde dürüst oyuncuları da yakalar (§8.2). Bayrak yalnızca AST + telemetri birleşimiyle mi konmalı? Benzerlik ölçüsü B7'de Roslyn ile yazıldığında altı doğru çözüm (§8.3) negatif kontrol olarak kullanılacak mı?
4. **Müfettiş çağrı sınırı.** Günde 10 çağrı (Ek A) 14 gizli vakalık L1 için yeterli mi, 30 vakalık Sigorta L2 için fazla mı? Sınır challenge başına mı, hesap başına mı?
5. **Referans tavanı biçimi.** B2 §8.2'nin toplam tavanı yerine araç başına `Σ min(oyuncu_i, ref_i)` (§3.12) benimsenecek mi? Evet ise B2'nin motor kodu ve §7.1 doğrulaması yeniden koşulmalı.
6. **Hata Bildirimi'nde "neden" bileşeni.** %30 ağırlık ve Kurul çağrısı (günde ≤ 3, ≈0,01 $) B3 ve B6 ile uyumlu mu? Alternatif: neden alanını yalnızca geri bildirime çevirip puandan çıkarmak (ağırlık satır 40 / düzeltme 60).
7. **Kalan işletmelerin trafik profilleri.** Otopark, Büfe, Manav ve Kargo L1 için profiller B2 hedefine ±%5 içinde kalibre edildi; #5–#20 profilleri B2 ile mi, sandbox şablon yazımıyla mı (B7) yapılacak?
8. **Girdi üst sınırı.** KANON v1'de `dakika` için üst sınır yoktur; referans çözüm `int` taşar (§3.6). 10.000.000 dakika (≈19 yıl) uygun mu?
9. **L2'nin MVP'deki test derinliği.** MVP'de Otopark L2 açıktır (KANON); burada 5 açık + 4 gizli vaka tanımlı. L1'in 14 gizli vakası düzeyine çıkarılmalı mı (en az 8 gizli öneri)?
10. **Tohumlu kümenin gün boyu sabit kalması.** Aynı gün tekrar denemede aynı vakaları görmek hata ayıklamayı kolaylaştırır; ama Müfettiş çağrılarıyla günün kümesini keşfedip ezberlemeye de izin verir (günde 10 çağrı). Her çağrıda yeni küme mi, gün başına sabit mi?

---

## 12. Diğer Belgelere Bağımlılıklar

| Belge | Bu belgenin beklediği / verdiği | Uyum koşulu |
|---|---|---|
| **KANON** | §5 (20 işletme, fiyat, L sayısı), §5.1 (Otopark sözleşmesi, 26 test, referans çözüm) aynen kullanıldı; §8 ipucu merdiveni, §9 rubrik ve sandbox sabitleri; Ek A'daki 11 öneri v2 adayıdır | Bir sabit değişirse Spec'ler yeniden üretilir; CI kural 10 (KANON tablosuyla birebir) kırılır ve uyarır |
| **VİZYON** (A-vizyon-FINAL) | §7 Otopark yolculuğu ve L2–L5 istekleri, §8 ekonomi; "aynı şema, üç yüzey" ilkesi §6'da uygulandı | Keskin Göz A/B sonucu §3.2'yi değiştirebilir |
| **B1 — Dünya & şehir** | Müfettiş görünüşü ve cümleleri (§8.3), Deneme durumunda şikâyet balonu (§6.3), Hurdacı Avlusu, NPC adları (Kaptan Rıza, Balıkçı Gülsüm, Gümrük Memuru Faruk, Veri Bahçıvanı, Belediye Memuru Nuran), işletme iç mekânı | Balon 20 sn'de bir, yalnızca sahibe; kategori metinleri §7.1 |
| **B2 — İlerleme & ekonomi** | §7.1 L1–L5 gelirleri ve fiyatlar **aynen**; §8.2 motor ve tavan formülü; §4.1 XP; §5.1 Hata Bildirimi 40–120 B, ortalama ≈60, günlük üst sınır 360. B5 geri verir: Otopark L1–L5, Büfe, Manav, Kargo L1 için trafik profilleri (beklenen B ±%3 içinde), Hata Bildirimi Bayt ortalaması 63,75 | Tavan biçimi (araç başına) B2 §8.2'yi değiştirir (Ek A); #5–#20 profilleri açık |
| **B3 — Eğitim & AI** | Kurul JSON şeması ve Savunma istemi (rubrik 50/30/20, eşik 70); Usta Yorumu istemi ve kod incelemesi rubriği (XP 10–30); Hata Bildirimi "neden" puanı (Kurul × 0,30); kopya tespiti (AST + telemetri); Türkçe hata tablosu (CS0121, CS0266 adayları); ipucu içerik bankası biçimi (§3.9) | Savunma `satir_deseni` sözleşmesi (§1.2) ve çözüm biçimi uyarlaması (§3.7) B3 istemine girmeli |
| **B4 — Müfredat** | Ders kimlikleri; Ruhsat gruplamaları (Otopark 1.2–1.4, Büfe 1.5–1.7, Manav 1.8–1.10, Kargo 2.1–2.3 …); her L2–L5 satırı için "yükseltme kapısı" dersi (§2 tablolarındaki "(semt)" etiketi); Manav "Döngüler" kararı; `switch` ifadesi, ilişkisel desen ve `Enum.IsDefined` Çarşı/Atölyeler dersleri | Ders sırası §2'deki kavram sırasını bozmamalı |
| **B6 — Görevler, sosyal, canlı operasyon** | Hata Bildirimi havuzu ve günlük 3 sınırı; mutasyon operatör sınıfları (§3.11, §6.3) diğer işletmelere yayılacak; NPC adı çakışmaları; Lonca Projesi'nde Şehir Uygulaması | Her işletme için 6–8 mutasyon hedefi |
| **B7 — Backend mimari** | Challenge Spec depolama ve sürümleme; hakem–koşucu ayrımı (§1.6); sandbox protokolü (`{id, girdi}` → `{id, cikti}`); Redis `seed:{oyuncuId}:{challengeId}:{gün}`; Müfettiş çağrı sınırı; gece batch'te araç başına tavan; API adları `/v1/businesses/{id}/runs` ile hizalanır | İçerik CI kuralları (§1.8) pipeline'a girer |
| **B8 — İstemci & UI** | İş Emri (#11) "Müşteriye Sor" paneli ve kilitli Sözleşme Kartı satırları; İşletme Editörü (#12) Müfettiş paneli ve balonlar; Savunma (#13) rubrik gösterimi; Monaco salt-okunur aralık (`//#BASLA`/`//#BITIS`) | Sözleşme maddesi açılma animasyonu (§3.2) |
| **B9 — Ürün & MVP** | MVP: Otopark L1–L2, Büfe, Kargo Deposu açık; transfer hipotezi ve KPI'lar (§6.3); L2 test derinliği (Açık Soru 9) | H4 kâğıt testi §3.2 diyaloğunu içermeli |

---

## Ek A. Sabit Önerileri (KANON v2 adayları)

Hepsi onaylanana kadar KANON v1 geçerlidir; bu belge gövdede "(B5 önerisi)" etiketiyle kullandı. Sayısal değişiklikler KANON v1.1, yapısal olanlar v2 kuralına tabidir (KANON §11).

| Anahtar | KANON v1 değeri | Önerilen değer | Gerekçe |
|---|---|---|---|
| `otopark.dakika.ust_sinir` | yok | 10.000.000 dakika (≈19 yıl) | Referans çözüm `dakika > 2.147.482.208` için `int` taşar: `UcretHesapla(2.147.482.209) = −372.827.000 TL` (§3.6, §9) |
| `ekonomi.referans_tavani.biçim` | "referans çözümle tavanlı" (B2 §8.2: `min(Σoyuncu, Σreferans)`) | araç başına: `Σ min(oyuncu_i, ref_i)` | Dengeleyici hatalı çözüm toplam tavanda referansın %95,7'sini, araç başına tavanda %88,1'ini alır (§3.12) |
| `muefettis.gunluk_cagri` | yok | challenge başına günde 10; açık testler 6/6 değilse çağrılamaz | Müfettiş'in oracle olmasını önler (§1.6, §8.1 R6) |
| `tohumlu.dagilim` | "6 tohumlu (oyuncuya özel rastgele)" | 4 iç (her dilimden 1) + 2 sınır (T5 saat katı, T6 gün katı); ikisinden tam biri tam kat, diğeri komşu | Sınır garantisi ve 10.000 oyuncuda 10.000 farklı küme (§1.7) |
| `tohumlu.gun_tanimi` | yok | TR 04:00'te değişen oyun günü; küme gün boyu Redis'te sabit | B2 §4.4 günlük sıfırlamasıyla uyum (§1.7, Açık Soru 10) |
| `hata_bildirimi.puanlama` | "40–120 B"; XP 40/60/100/150 | satır 30 + düzeltme 40 + neden 30; ≥70 tam, 40–69 yarım, <40 sıfır; Bayt tabanı Kolay 40 / Orta 60 / Zor 90 / Uzman 120 | Sekiz mutasyonun ortalaması 63,75 B (B2: ≈60); günlük 3 × 120 = 360 B üst sınırıyla uyumlu (§7.2) |
| `muefettis.kategori` | "kategoriyi söyler, gizli girdiyi söylemez" | Otopark L1: 8 kategori; her kategori sabit + tohumlu toplamda ≥ 2 vaka; balon yön (fazla/eksik) söyler, miktar söylemez | Sızıntıyı kapatır (§7.1) |
| `otopark.L4.gece_tarifesi` | "22:00–06:00 gece tarifesi sabit 150" | giriş penceresi `[22:00, 06:00)`; çıkış girişten sonraki ilk 06:00'ı (dâhil) aşmıyorsa süreden bağımsız sabit 150 | Belirsizliği kapatır (§3.15, Açık Soru 2) |
| `otopark.L5.kuyruk` | "Kapasite 50; kapasite/kuyruk (Finans)" | kapasite 50, kuyruk limiti 10, FIFO, kuyruktan vazgeçme | VİZYON §7'deki "doluysa reddet, bekleyenleri sırala" cümlesinin somutlaştırılması (§3.16) |
| `trafik.profil.otopark` | "L2–L5 trafik 20/30/40/50 araç, gelir ×1,6/seviye" | L2: %5 abone; L3: dilim 40/33/22/5, %15 indirimli; L4: dilim 27/30/31/12, giriş saati tekdüze; L5: dilim 15/25/40/20 | Beklenen B hedefe ±%3 içinde: 351,8 / 552,5 / 924,3 / 1.461,7 (§3.12) |
| `isletme.L1.kurallari` | yok (yalnızca konu ve günlük gelir) | Büfe: 8 kupür, 0,05 adım, ≤ 200 TL; Manav: 5/10 kilo eşikleri, %10/%20, önce çarp sonra böl; Kargo: boş raf 15, ilk 20 koli 6, taşkın 10 | B2 hedeflerini ±%5 içinde üretir: 304,2 / 382,8 / 489,4 B (§4) |

Bu önerilerin hiçbiri bir KANON sayısını *değiştirmez*; tümü KANON'un tanımsız bıraktığı bir boşluğu doldurur ya da (ikinci satır) B2'nin motor formülünü sıkılaştırır.

---

**Revizyon Notu (3 Kasım).** KANON v2 (§12) uyumu: Otopark L3 kapısı 3.4 (B4); persona yaşı 13 → 15; Ek A satırları KANON §12.3'te kabul edildi — istisna: `ekonomi.referans_tavani.biçim` ertelendi (B2 §8.2 ve B7 §9 motoru yeniden koşulmadan KANON'a işlenmez); `otopark.dakika.ust_sinir` harness girdi doğrulaması olarak kabul (KANON §5.1 metni ve 26 test değişmez). Ayrıntı: `_KANON-v2-degisiklikler.md`.
