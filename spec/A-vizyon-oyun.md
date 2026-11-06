# KodKent — Vizyon Belgesi A (Oyun Tasarımı Bakışı)

> Rol: Kıdemli F2P sosyal oyun tasarımcısı. Öncelik sırası: eğlence ve ritim → sosyal gösteriş → ilerleme hissi → retention; öğrenme bu dördünün içine gömülür, üstüne yapıştırılmaz. Belgedeki tüm sayılar ilk ayar (tuning) değerleridir, canlı veriyle değişir. SABİT kararlar (KodKent, Bayt/Çip/XP, .NET backend, Claude API, gerçek sandbox, pay-to-learn yok) aynen korunur.

## 1. Tek cümlelik vaat ve ürün tanımı

**Vaat:** *"KodKent'te yazdığın her gerçek C# satırı şehirde sana ait bir şeyi çalıştırır — ve kazandığını herkes görür."*

**Ürün tanımı (3 cümle):**
1. KodKent, 13–25 yaş arası Türkiyeli yeni başlayanların telefon numarasıyla girip bir avatarla izometrik bir şehre adım attığı, web-öncelikli (masaüstü + mobil tarayıcı/PWA) bir sosyal sanal şehir oyunudur.
2. Oyuncu Akademi'de "Usta" adlı yapay zeka öğretmenlerle kısa dersler görür, sorulara kendi cümleleriyle cevap verip XP kazanır; sonra semtlerde işletmeler satın alır (ilki otopark) ve bu işletmeleri sunucuda gerçekten derlenip test edilen C# koduyla çalıştırarak Bayt kazanır.
3. Bayt ile kozmetik, oda eşyası ve yeni işletme alınır; Çip yalnızca görünüm ve konfor içindir, Bayt satın alınamaz ve hiçbir ders, ipucu ya da test hiçbir zaman paralı değildir.

Slogan: **"Oyunlarla yazılım öğreniyorum."** Alt slogan (tabela ve mağaza dilinde): **"Kod yaz, şehrini kur."**

## 2. Oyuncu fantezisi

Oyuncunun tek cümlelik kimliği: **"Ben, bu şehre sıfır bilgiyle tramvayla gelen ve yazdığım her programla bir dükkânın daha ışığını yakan genç bir yazılımcı-girişimciyim; işletmelerim benim yerime konuşur."**

Fantezi üç katmandır ve her katman farklı bir F2P referansından beslenir:

| Katman | His | Referans | KodKent'teki karşılığı |
|---|---|---|---|
| Yetkinlik | "Bunu gerçekten ben yaptım" | Codewars, Zachtronics | Kod gerçekten derleniyor; otoparkın kasası senin `UcretHesapla` metodunun hesapladığı parayla doluyor |
| Mülkiyet | "Burası benim" | Hay Day, Habbo odası | Tabelada adın, içeride senin döşediğin oda, vitrinde senin kodun |
| Statü | "Bakın ben kimim" | Sanalika kıyafet/oda gösterişi, Duolingo ligleri | Unvan, rozet, neon tabela, Meydan panosunda akan çıktın, lig sıran |

Sanalika'nın "havalı odası olan çocuk" fantezisi burada "çalışan işletmesi olan çocuk" fantezisine dönüşür. Kritik fark: Sanalika'da statü satın alınır; KodKent'te en pahalı görünen şeyler (neon tabela, Düello ceketi, "Şehir Mimarı" unvanı) **yalnızca beceriyle** kazanılır. Oyuncu kendi profiline baktığında aslında bir portföye bakıyordur: her işletme çalışan bir C# projesidir, isterse Vitrin'den kodu açıp CV'sine koyabilir.

Yolculuk arkı: **Çırak** (Çarşı'da otopark işleten) → **Kalfa** (Liman'da deposu olan) → **Mühendis** (Kampüs'te sinemasıyla övünen) → **Şehir Mimarı** (Bulut Tepesi'nde kendi işletmelerini tek API'de birleştiren). Oyuncu "ders bitirmez", "semt fetheder".

## 3. Çekirdek döngü

Döngü altı adımdır; bir oturumda (hedef 15–20 dk) en az bir tam tur kapanır. Hiçbir oturum yarım bitmemeli: oyuncu her çıkışında bir şey kazanmış, almış ya da açmış olmalı.

| # | Adım | Nerede | Süre | Ödül | Bir sonrakine köprü |
|---|---|---|---|---|---|
| 1 | **Öğren** | Akademi (semt Ustası) | 6–10 dk: 4–6 "kart" (≤60 kelime + 1 mini kod) + 3 Usta sorusu | Ders XP'si (T1: 100 XP), ders rozeti | Son kart her zaman bir iş emri önizlemesidir: "Hasan Abi'nin otoparkı tam bunu istiyor" → Görev butonu |
| 2 | **Uygula** (görev) | Semt sokağı / Akademi atölyesi | 3–8 dk: tek metot, 2–4 açık test | 60 XP + 30–60 B + **Ruhsat parçası** (3 parça = 1 işletme ruhsatı) | Ruhsat 3/3 olunca haritada "Satılık" tabelası yanar |
| 3 | **İnşa et** (işletme kodu) | İşletme binası, Monaco editör | 15–40 dk (otopark L1 ≈ 25 dk) | İşletme açılır, pasif gelir başlar, Açılış anı (konfeti, Meydan panosunda duyuru) | Kasa dolmaya başlar; ilk toplama 1 saat sonra → geri dönüş kancası |
| 4 | **Kazan** | Kasa (işletme önü) | 10 sn tıklama; kasa 8 saatte dolar | Bayt (otopark L1 ≈ 214 B/gün) | HUD'da hedef çubuğu: "Hedef: Büfe 600 B" |
| 5 | **Harca** | Mağaza / Oda / İşletme yükseltme | 1–3 dk | Kıyafet, eşya, yeni işletme, işletme seviyesi | Yükseltme yeni müşteri isteği getirir → yeni konu → Öğren |
| 6 | **Göster** | Meydan, oda ziyaretleri, lig | 2–5 dk | Alkış, ziyaretçi sayısı, lig puanı, tabela | Başkasının işletmesi "bunu nasıl yapmış?" sorusunu doğurur → Vitrin'de kodu oku → Akademi |

Üç ölçekte döngü:
- **Mikro (2–3 dk):** soru → Usta puanı → XP tik sesi. Duolingo'nun yeşil tik dopamini; her sorudan sonra çubuk kıpırdar.
- **Mezo (15–20 dk, bir oturum):** ders → görev → kasayı topla → bir şey al/giy. Oturum bittiğinde avatar görünür biçimde değişmiştir.
- **Makro (1–2 hafta):** ruhsat biriktir → işletme aç → yükselt → Semt Sınavı → yeni semt: yeni Usta, yeni müzik, yeni kıyafet teması.

Geri dönüş kancaları (günde 2–3 oturum hedefi): kasa dolumu (4–8 saat), **Günlük Usta Sorusu** (24 saat, seri sayacı), Alkış/ziyaretçi bildirimi, haftalık lig kapanışı (Pazar 21:00), Cumartesi 20:00 Meydan etkinliği. Dersler ve testler **asla** zamanlayıcıyla kilitlenmez; bekleme yalnızca gelire uygulanır.

## 4. İlk 30 dakika: dakika dakika onboarding

Hedef: 20. dakikada ilk Bayt'ını almış, 27. dakikada otoparkı görmüş ve "yarın benim" demiş bir oyuncu. Onboarding boyunca tek bir görev işaretçisi vardır; harita, mağaza ve sohbet kademeli açılır.

| Dakika | Ekran / olay | Oyuncu ne yapar | Ödül / his |
|---|---|---|---|
| 0:00–0:45 | Karşılama: arka planda izometrik şehir akıyor, tek buton "Telefonla gir" | Numara girer, 6 haneli SMS OTP (90 sn geçerli) | Hesap yok, şifre yok: sürtünme sıfır |
| 0:45–1:15 | Doğum yılı | 13 altı → nazik red ekranı; 13–17 → veli telefonu alınır, oyun **kilitsiz** başlar, 72 saat içinde veli OTP onayı gelmezse sosyal özellikler kapanır | "Seni bekletmiyoruz" |
| 1:15–2:00 | Dil seçimi: 6 kart | C# kartı "Şehir açık" ışıklı; Python/JavaScript/Java/Kotlin/Go kartları "yakında — haber ver" (bekleme listesi = talep ölçümü) | "C# Kenti'ne hoş geldin" |
| 2:00–4:00 | Avatar: 3 adım (yüz, saç, kıyafet), 12 başlangıç kombinasyonu, takma ad | Seçer; ad moderasyondan geçer (haiku + sözlük) | "Sonra her şeyi değiştirebilirsin" rozeti |
| 4:00–5:30 | Şehre giriş sineması (atlanabilir, 40 sn): tramvay Meydan'a iner, **Usta Defne** karşılar | İzler | Defne: "Işığı yanan her dükkân birinin yazdığı kodla çalışıyor. Şu otopark, 3 gün önce senin gibi başlayan birinin." (gerçek bir oyuncunun tabelası gösterilir) |
| 5:30–6:30 | HUD açılır: XP çubuğu (Sev. 1), Bayt cüzdanı (0 B), tek işaretçi: Akademi | Avatarı tıklayarak yürütür | Kalabalık Meydan: konuşma balonları, NPC'ler |
| 6:30–12:00 | **Ders 1.1 "Merhaba KodKent"**: değişkenler, `int`/`string`, `Console.WriteLine`; 4 kart | Son kartta Monaco editörde ilk kodu yazar: `Console.WriteLine("Merhaba KodKent");` — gerçekten derlenir | Çıktı Meydan'daki LED panoda 10 sn akar (moderasyonlu). Sosyal gösteriş anı #1 |
| 12:00–14:00 | **İlk Usta sorusu**: "`int yas = 17;` yazdın. `yas` ne, `17` ne, `int` ne? Kendi cümlelerinle anlat." | 1–3 cümle yazar | Defne: "82/100 — 'kutu' benzetmen güzel; türün neden önemli olduğunu ekle." +90 XP → **Seviye 2** (eşik 80 XP). İlk seviye atlama 14. dakikada |
| 14:00–20:00 | **İlk görev "Meydan Saati"**: `saat` ve `dakika` değişkenleriyle "Saat 14:05" formatında yazdır; 3 açık test | Kodlar, testleri çalıştırır (yeşil çubuk) | +60 XP, **+40 B** (para çeşmesi animasyonu), **Otopark Ruhsatı 1/3** |
| 20:00–23:00 | Mağaza teaser (yalnızca 1 raf) | 30 B'ye "Çırak Şapkası" alır, anında giyilir | Avatar değişti; harcama döngüsü öğrenildi |
| 23:00–27:00 | Harita açılır → Çarşı → **"Satılık Otopark"** tabelası (300 B + Ruhsat 3/3 + Sev. 3) | İçeri girer: boş arsa, NPC **Hasan Abi**: "Burada bir ücret sistemi lazım, yapan var mı?" | HUD'da hedef çubuğu: "Otopark: 40/300 B — Ruhsat 1/3 — tahmini: yarın" |
| 27:00–29:00 | Keşfet: gerçek bir oyuncunun çalışan otoparkı | Ziyaret eder, "Alkışla" basar; tabela: "Sahibi: @ayse_kod — Kalfa, Sev. 8" | "Bu ben olabilirim" |
| 29:00–30:00 | Günlük giriş takvimi + bildirim izni ("Kasan dolunca haber verelim mi?") | İzin verir/vermez | Çıkış ekranı: "Yarın: Koşullar dersi → Ruhsat 2/3" |

Onboarding başarı ölçütleri: ilk Bayt ≤20 dk (%70 hedef), Ders 1.1 tamamlama %85, D1 geri dönüş %40, 72 saat içinde otopark açma: kayıt olanların %35'i.

## 5. Dünya iskeleti

Şehir, Meydan'dan dışa doğru halkalar hâlinde açılan 8 semt ve merkezden oluşur. Her semt bir C# konu kümesi, bir Usta, bir müzik teması ve bir kıyafet/eşya stilidir. Semtler uzaklaştıkça konu soyutlaşır: Çarşı'da simit ve otopark, Bulut Tepesi'nde API.

| Semt | Tier | C# konu kümesi | Örnek oyuncu işletmeleri | Açılış | Atmosfer |
|---|---|---|---|---|---|
| **Meydan** (merkez) | — | — | Akademi, Mağaza, Liderlik Panosu, LED pano, Düello Arenası, tramvay durağı | Baştan | Kalabalık, çeşmeli, akşam ışıkları |
| **Çarşı** | 1 | Değişkenler, türler, operatörler, `if/else`, `switch`, döngüler, metotlar, `string` işlemleri | **Otopark** (kanonik), Büfe (kasa ve para üstü), Manav (tartı ve indirim) | Sev. 1 | Tenteli dükkânlar, pazar sesleri |
| **Liman** | 1–2 | Diziler, `List<T>`, `Dictionary`, `foreach`, sıralama, arama, `string.Split` | Kargo Deposu (envanter), Balık Hali (fiyat listesi), Gümrük (plaka/beyan sorgusu) | Sev. 6 + Çarşı Sınavı | Konteynerler, martı, vinç |
| **Atölyeler** | 2 | Sınıf, nesne, kapsülleme, kalıtım, `interface`, `enum`, `struct`, `exception` | Oto Tamirhane (araç hiyerarşisi), Mobilya Atölyesi (sipariş nesneleri), Trafo (interface'li cihazlar) | Sev. 12 + Liman Sınavı | Tuğla, kıvılcım, çekiç sesi |
| **Kampüs** | 2–3 | Generics, LINQ, delegate/event, lambda, extension, `record`, pattern matching | Kütüphane (LINQ sorguları), Sinema (koltuk rezervasyonu), Haber Ajansı (event akışı) | Sev. 18 + Atölye Sınavı | Çimen, amfi, Lonca Binası |
| **Finans Bölgesi** | 3 | `async/await`, `Task`, dosya ve JSON, `HttpClient`, hata dayanıklılığı, **unit test yazma** | Banka (async işlem kuyruğu), Borsa Panosu (veri akışı), Sigorta (kural motoru + testleri) | Sev. 25 + Kampüs Sınavı | Cam kuleler, gece neonu |
| **Veri Vadisi** | 3–4 | SQL temelleri, EF Core, migration, repository, ilişkiler | Hastane Kayıt, Otel Rezervasyon, Nüfus Dairesi | Sev. 32 + Finans Sınavı | Sunucu çiftliği, nehir |
| **Bulut Tepesi** | 4 | ASP.NET Core Web API, REST, DTO, auth temelleri, middleware, dağıtım kavramları | Yemek Sipariş Platformu (API), Hava Durumu Servisi, **Şehir Uygulaması** (capstone: kendi işletmelerini tek API'de birleştir) | Sev. 40 + Veri Sınavı | Bulutların üstünde, şehir manzarası |
| **Bloklar** (konut) | — | — | Oyuncu odası (başlangıç: stüdyo, 6×6 ızgara) | Sev. 2 | Meydan'ın arka sokakları |

**Akademi**, Meydan'ın en büyük binasıdır: her Usta'nın kendi derslik kapısı, bir Atölye (görev alanı) ve bir Lobi (Kalfa Yardımı, soru-cevap). Dersler Akademi'de anlatılır ama görevler semt sokaklarında geçer: Çarşı görevi Büfe'nin tezgâhında, Liman görevi vinçle konteyner sayarken yapılır.

**Ev/oda:** Sanalika'nın kalbi odadır; KodKent'te de öyle. Stüdyo 6×6 ızgara, 25 başlangıç eşyası; Sev. 10'da 8×8'e, Sev. 20'de iki odaya genişler (Bayt ile). İki özel eşya: "Çalışma Masası" oyuncunun en son geçtiği testi küçük bir ekranda gösterir; "Rozet Duvarı" kazanılan rozetleri asar.

**Sanalika hissini veren 8 öğe:**
1. Tıkla-yürü izometrik avatar, kafasının üstünde konuşma balonu.
2. Oda ve işletme içinde ızgaraya eşya yerleştirme, döndürme, istifleme.
3. Kapıdan kapıya ziyaret: "Odada kim var?" listesi, ziyaretçi defteri, ayak izi.
4. Emote/dans çarkı (8 başlangıç, kozmetikle genişler).
5. Kıyafet dolabı ve Meydan podyumu (saatin en çok alkış alan avatarı panoda).
6. Meydan kalabalığı: 40 avatarlık shard, saat başı "Meydan Sorusu" (herkes aynı anda cevaplar, en hızlı 3 kişi panoda).
7. Tabela sistemi: her işletmede sahibin adı, unvanı, seviyesi ve açık/kapalı ışığı.
8. **Vitrin:** işletme içinde çerçeveli ekran; sahibi isterse kodunu sergiler, ziyaretçiler okur ve "Not bırak" ile yorum yazar. Habbo'daki kupa vitrininin kodlu hâli.

## 6. İlerleme iskeleti

**XP eğrisi.** Bir sonraki seviye için gereken XP: `XP(L) = 80 × L^1.35` (10'a yuvarlanır). İlk seviye 80 XP'dir ve ilk ders içinde atlanır; **seviye tavanı 60**.

| Seviye | O seviye için XP | Toplam XP (yaklaşık) | Günlük aktif oyuncu için tahmini gün | Açılan |
|---|---|---|---|---|
| 2 | 80 | 80 | 1 (14. dk) | Oda |
| 6 | 900 | 1.850 | 3–4 | Liman, 2. işletme ruhsatı |
| 12 | 2.290 | 10.600 | ~20 | Atölyeler, 3. işletme, Lonca kurma |
| 18 | 3.980 | 28.400 | ~50 | Kampüs, Kalfa Yardımı (mentorluk) |
| 25 | 6.230 | 62.900 | ~90 | Finans Bölgesi |
| 32 | 8.740 | 113.900 | ~125 | Veri Vadisi |
| 40 | 11.640 | 194.400 | ~170 | Bulut Tepesi |
| 60 | 19.680 | ~513.000 | ~315 | Tavan; "Efsane" unvanı |

Günlük XP kaynakları tier ile büyür (T1 dersi 100 XP, T2 180, T3 280, T4 400); günlük aktif oyuncu T1'de ≈500, T4'te ≈2.000 XP kazanır. Böylece tüm C# yolculuğu günde 20–40 dakikayla ~6 ayda Tier 4'e, ~1 yılda tavana ulaşır.

**Unvanlar** (ismin yanında ve tabelada görünür): Çırak (1–5) → Kalfa (6–11) → Zanaatkâr (12–17) → Mühendis (18–24) → Baş Mühendis (25–31) → Mimar (32–39) → Şehir Mimarı (40–59) → Efsane (60).

**Kilit mantığı — üç kapı:**
1. **Ders → Görev:** Her görev bir dersin sonunda açılır; dersin 3 Usta sorusundan en az 2'si ≥70 puan olmalıdır.
2. **Görev → İşletme:** 3 görev = 1 **Ruhsat**; işletme almak için ruhsat + fiyat + seviye eşiği. Aynı anda işletilebilecek işletme sayısı `1 + ⌊seviye/6⌋` (Sev. 1'de 1, Sev. 12'de 3, Sev. 40'ta 7).
3. **İşletme → Semt:** Yeni semt için seviye eşiği **ve** **Semt Sınavı**: önceki semtte en az bir işletmeyi L2'ye çıkarmış olmak + 20 dakikalık karma sınav (3 kod görevi + 3 Usta sorusu). Çift kapı, XP kasıp beceri kazanmadan ilerlemeyi engeller.

**Yetenek ağacı** metro haritası gibi çizilir: her semt bir hat, her ders bir durak, aktarma durakları konuların kesiştiği yerler (ör. "Döngüler" durağı Çarşı ve Liman hatlarının kesişimi). Oyuncu ders listesi değil hat haritası görür.

**İşletme seviyesi (L1–L5):** her seviye yeni bir müşteri isteği (yeni kod gereksinimi), ×1,6 gelir ve binaya görünür bir ek getirir (otopark: bariyer → tabela → kat → gece ışığı → otomat).

## 7. Öğrenme ↔ oyun bağı: otoparkın yolculuğu

İlke: **"Öğrenmek XP, yapmak Bayt getirir."** Ders hiçbir zaman Bayt vermez; Bayt yalnızca çalışan koddan gelir. Böylece ders "izlenip geçilen" değil "işe yarayan" şeydir.

**Hangi derslerden sonra alınır?** Otopark L1 için gereken ruhsat parçaları ve onları veren dersler:

| Ruhsat parçası (görev) | Ders | Kazandırdığı beceri |
|---|---|---|
| 1/3 "Meydan Saati" | 1.1 Değişkenler ve çıktı | `int`, `string`, string interpolation |
| 2/3 "Kademeli Karar" | 1.2 Koşullar | `if / else if / else`, karşılaştırma, sınır değerleri |
| 3/3 "Fonksiyon Sözleşmesi" | 1.3 Metotlar | Parametre, dönüş değeri, imzaya uymak, `Math.Ceiling` ile yukarı yuvarlama |

Tipik oyuncu bunu 2. günün sonunda, Sev. 3'te tamamlar; 300 B görev ve günlük ödüllerden birikmiştir.

**İş emri nasıl geliyor?** Otoparka girince NPC Hasan Abi bir **iş emri** uzatır; kurucunun kuralları birebir, müşteri ağzından:

> "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum."

Kodlamadan önce zorunlu **Gereksinim Netleştirme** adımı gelir: oyuncu Hasan Abi'ye 4 soru sorar (diyalog seçenekleri; Usta Defne kenardan "Müşteriye sormadan kod yazan, iki kere yazar" der):

| Oyuncunun sorusu | Hasan Abi'nin cevabı | Kabul kriteri |
|---|---|---|
| "1 saat 10 dakika kalan ne öder?" | "Başlayan saat tam sayılır." | Yukarı yuvarlama |
| "Tam 2 saat kalan?" | "O artık 2–6 dilimi: 2 × 40." | Alt sınır dâhil |
| "Tam 6 saat kalan?" | "6 saat hâlâ 2–6 dilimi; 6'yı geçen güne girer." | Üst sınır dâhil |
| "24 saati aşan?" | "Her başlayan gün 250." | Çok günlük kalış |

Oyuncu 119 dakikanın 200 TL, 120 dakikanın 80 TL olduğunu fark edip sorarsa Hasan Abi "Biliyorum, uzun kalan kazanıyor; kampanya böyle" der ve oyuncu **Keskin Göz** rozeti + 50 XP alır. Bu, "gereksinimi sorgula ama müşterinin kararına saygı duy" dersidir.

**Kod nasıl isteniyor?** Editör şu iskeletle açılır; oyuncu yalnızca metodun içini yazar:

```csharp
// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi
public static class Otopark
{
    // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)
    // dönüş: ödenecek ücret, TL
    public static int UcretHesapla(int dakika)
    {
        // kodun buraya
    }
}
```

Açık testler (6) ekranda yeşil/kırmızı kutular olarak görünür; gizli testler (10) "Müfettiş" tarafından çalıştırılır. Kabul kriterlerinden türeyen örnek vakalar:

| Dakika | Beklenen TL | Açıklama |
|---|---|---|
| 30 | 100 | Başlayan 1. saat |
| 61 | 200 | Başlayan 2. saat, hâlâ "2 saatten az" dilimi |
| 120 | 80 | Tam 2 saat → 2 × 40 |
| 121 | 120 | Başlayan 3. saat → 3 × 40 |
| 360 | 240 | Tam 6 saat → 6 × 40 |
| 361 | 250 | 6'yı aştı → günlük |
| 1.440 | 250 | Tam 24 saat → 1 gün |
| 1.441 | 500 | 2. gün başladı |

Tüm testler geçince **Açılış**: bariyer kalkar, ilk NPC araba girer, Meydan panosunda "Yeni işletme: @ad'ın Otoparkı" akar. Gizli testlerden biri kalırsa işletme "Deneme açılışı" yapar: gelir %40, binanın üstünde şikâyet balonu ("Bir müşteri yanlış ücret ödediğini söylüyor; 6 saat civarı kalanlar"), kategori söylenir ama gizli girdi söylenmez.

**Para nasıl akıyor?** Tasarımın kalbi şu: **otoparkın geliri, oyuncunun kendi metodunun hesapladığı paradır.**
1. Sunucu her gün (deterministik tohumla) işletmeye sentetik trafik üretir: L1'de 12 araç; dağılım %45 (<2 sa), %35 (2–6 sa), %18 (6–24 sa), %2 (>24 sa).
2. Oyuncunun derlenmiş `UcretHesapla` metodu sandbox'ta bu 12 araç için bir kez toplu çalıştırılır (günde 1 batch, sonuç önbelleğe).
3. Toplam TL, **10 TL = 1 B** kuruyla Bayt'a çevrilir: araç başı beklenen ≈178 TL → ≈214 B/gün.
4. Gelir saatlik olarak **kasaya** akar; kasa 8 saatte dolar (≈71 B); oyuncu gelip toplar. Günde 3 toplama = tam gelir, 1 toplama = üçte biri: Hay Day ritmi.
5. Güvenlik: günlük gelir, referans çözümün aynı trafikte ürettiği tutarla tavanlanır; fazlası "fazla ücret şikâyeti"ne döner. Böylece testleri geçen ama kenar durumlarda hatalı kod, Müfettiş etkinliğiyle öğretici biçimde yakalanır.

**Otoparkın sonraki seviyeleri** (her biri başka semtin dersini çeker; ilk işletme oyuncuyu tüm şehirde gezdirir):

| Seviye | Müşteri isteği | Gereken konu (semt) | Trafik | Gelir/gün |
|---|---|---|---|---|
| L2 | "Aylık abonelerin plakaları listede; onlar ödemesin" | `List<string>`, `Contains` (Liman) | 20 araç | ≈340 B |
| L3 | "Engelli ve elektrikli araçlara %50 indirim" | `enum`, metot aşırı yükleme (Atölyeler) | 30 | ≈550 B |
| L4 | "22:00–06:00 gece tarifesi sabit 150" | `DateTime`, `TimeSpan` (Kampüs) | 40 | ≈880 B |
| L5 | "Kapasite 50; doluysa reddet, bekleyenleri sırala" | durum, kuyruk, exception (Atölyeler/Finans) | 50 | ≈1.400 B |

## 8. Ekonomi iskeleti

**Bayt musluklar (gelir).** Olgun oyuncuda hedef dağılım: işletme %60, görev %20, günlük/seri %8, lig ve düello %7, sosyal (alkış bonusu) %5.

| Kaynak | Miktar (T1) | Sıklık | Not |
|---|---|---|---|
| Görev | 30–60 B | Ders başına 1 | Tier ile ×2, ×4, ×8 |
| İşletme geliri | 200–300 B/gün (L1) | Saatlik, kasa tavanı 8 saat | Ana kaynak |
| Günlük giriş | 10/15/20/25/30/40/100 B | 7 günlük takvim | 7. gün ek kozmetik |
| Günlük Usta Sorusu | 20 B + seri bonusu | Günde 1 | Seri 7 → ×1,5; Seri Dondurucu 50 B (Bayt ile, asla Çip'le) |
| Haftalık lig | 0–300 B | Pazar | Lig sırasına göre |
| Alkış bonusu | 2 B/alkış, günde en çok 40 B | Ziyaretçi başına | Sosyal pasif gelir |
| Semt Sınavı | 500 B + 10 Çip | Semt başına | Tek seferlik |

**Bayt lavabolar (gider):**

| Gider | Fiyat aralığı | Rol |
|---|---|---|
| İşletme satın alma | T1 300–900 B · T2 1.500–6.000 · T3 10.000–30.000 · T4 50.000–120.000 | En büyük lavabo; geri ödeme T1'de 1,5–3 gün, T4'te 8–12 gün |
| İşletme yükseltme | L2 500 · L3 1.200 · L4 2.500 · L5 5.000 B (+ kod) | Orta vadeli hedef |
| Kıyafet/aksesuar | 30–800 B | Hızlı tatmin |
| Oda eşyası ve genişletme | Eşya 40–400 B; 8×8 genişletme 2.000 B | Mülkiyet |
| Tabela/neon özelleştirme | 150–600 B | Gösteriş |
| Haftalık bakım | İşletme gelirinin %5'i, otomatik | Enflasyon freni |
| Lonca kuruluşu | 500 B | Sosyal |

Enflasyon kontrolü: tier'e endeksli fiyatlar, işletme sayısı tavanı (`1 + ⌊seviye/6⌋`), kasa tavanı, %5 bakım ve haftalık ekonomi raporu (B/oyuncu/gün dolaşımı; hedef: olgun oyuncuda gelirin %70'i 10 gün içinde harcanmış olsun).

**Çip'in rolü:** yalnızca görünüm ve konfor. Satılabilenler: premium kıyafet setleri, oda temaları, emote paketleri, neon renk paleti, isim rengi, ikinci avatar görünümü kaydı, ek kıyafet dolabı slotu. **Asla satılmayanlar:** XP, Bayt, ipucu, ek test hakkı, zaman atlama, işletme, ruhsat. Çip az miktarda kazanılabilir de (Semt Sınavı 10 Çip; 100 Çip ≈ bir premium set): ödeme yapmayan oyuncu premiumun tadını alır.

**Kozmetik felsefesi — "Kazanılan gösterilir, satın alınan süslenir":**
- Statü taşıyan her nesne (unvan, rozet, Düello ceketi, "Otopark Ustası" neon tabela, Semt Sınavı madalyası) yalnızca beceriyle gelir; Çip ile alınan hiçbir şey beceri sinyali vermez.
- Görsel dil bunu okunur kılar: kazanılan nesneler altın çerçeveli ve animasyonlu, satın alınanlar şık ama statik.
- Sanalika Plus'ın "parayı veren havalı olur" algısının tersi: KodKent'te "kodu yazan havalı olur".

## 9. Sosyal katman

Sosyal önce **pasif** (herkes için, senkron gerektirmez), sonra **aktif** (isteğe bağlı) kurulur; böylece ilk haftaların az nüfusu soğukluk üretmez.

| Katman | Özellik | Ayrıntı |
|---|---|---|
| Ziyaret | Oda ve işletme ziyareti, ziyaretçi defteri, Alkış (yer başına günde 1), ayak izi | "En çok ziyaret edilen işletmeler" haftalık listesi Meydan panosunda |
| Sohbet | Meydan açık sohbeti (balon, 40 kişilik shard), oda sohbeti, arkadaşlar arası DM | haiku ön filtre + Türkçe sözlük + raporlama; 13–17 varsayılan "güvenli mod": yalnızca arkadaş DM'i, Meydan'da hazır cümle + emoji |
| Arkadaş | Takip/arkadaş, çevrimiçi listesi, "arkadaşın işletme açtı / kasası doldu" akışı | Arkadaş ligi: 30 kişilik haftalık gruplar |
| Lonca ("Yazılım Ekibi") | 5–30 üye, Sev. 10+, Kampüs'te Lonca Binası | Haftalık lonca görevi ("ekipçe 500 test geçin"), lonca içi kod incelemesi (inceleyen ve incelenen 20'şer XP), lonca ligi |
| Liderlik | Haftalık ligler (Bronz → Gümüş → Altın → Elmas, 30 kişilik kovalar), semt bazlı "en kazançlı işletme", Düello ELO | Duolingo lig modeli: terfi ilk 7, düşme son 5 |
| **Kod Düellosu** | Aynı problem, 5 dk, tüm testleri ilk geçen kazanır; ELO | Cumartesi 20:00 Meydan Arenası turnuvası; seyirciler kodu değil test çubuklarını izler; maç sonunda iki taraf birbirinin kodunu görür (öğrenme anı); haftalık şampiyon ceketi yalnızca buradan |
| Mentorluk | Sev. 18+ "Kalfa Yardımı": Akademi Lobisi'nde yeni başlayan sorularına cevap | Cevap kalitesini haiku değerlendirir; "Usta Yardımcısı" rozeti; cevaplayana 15 XP |
| Vitrin ve akran incelemesi | İşletme kodunu sergile, not bırak, "bu kodu incele" görevi | Usta notları özetler; iki tarafa XP |

Sosyal güvenlik: kullanıcı üretimi metin yalnızca takma ad, sohbet, ziyaretçi defteri ve vitrin notlarıdır; hepsi moderasyondan geçer ve raporlanabilir. Hediye ve ticaret MVP dışındadır (ekonomi ve güvenlik riski).

## 10. Yapay zeka öğretmen: "Usta" NPC'ler

Her semtin bir Ustası vardır; Akademi'de ders anlatır, semtte dolaşır, iş emirlerinde müşteri ile oyuncu arasında tercümanlık yapar.

| Usta | Semt | Kişilik | Tipik cümle |
|---|---|---|---|
| Defne | Çarşı | Sıcak, sabırlı, benzetmeci ("kutu", "tarif") | "Değişken bir kutu; `int` kutunun üstündeki etiket." |
| Kerem | Liman | Pratik, hızlı, liman jargonu | "Liste bir konteyner dizisi; `foreach` vinç." |
| Nehir | Atölyeler | Titiz, tasarım kokusu bulur | "Bu sınıf üç iş yapıyor; bir atölyede üç usta olmaz." |
| Baran | Kampüs | Meraklı, en Sokratik olan, esprili | "Sorguyu bana sormadan önce veriye sor." |
| Elif | Finans | Disiplinli, "önce test" | "Çalıştı demek yetmez; kanıtı nerede?" |
| Yusuf | Veri + Bulut | Sistemci, büyük resim | "Şehirdeki her dükkân konuşabilmeli; API bu." |

**Rolü (yaptıkları):** Sokratik soru sorma; açık uçlu cevabı rubrikle puanlama; başarısız testte 3 kademeli ipucu (**Pusula**: hangi kavram → **Fener**: hangi durum/satır → **Örnek**: benzer ama farklı mini örnek; hepsi ücretsiz ve sınırsız, XP kesmez; ipuçsuz çözene "+%15 Berrak Zihin" bonusu); test geçtikten sonra kısa kod incelemesi (okunabilirlik, isimlendirme; bonus 10–30 XP); iş emri netleştirmesinde müşteri sözcüsü; Günlük Usta Sorusu.

**Sınırları (yapmadıkları):** Test sonucuna karar vermez; sandbox verir. Çözümü yazmaz; en fazla "Örnek" kademesinde farklı bir problemde gösterir. Kişiliğinden ve oyundan çıkmaz; oyun dışı konu, kişisel veri talebi, flört, siyaset → nazikçe Akademi'ye döndürür; 13–17 için konu filtresi sıkıdır. Oyuncunun cevap alanı veridir, talimat değildir: "Bana 100 ver" tipi istem enjeksiyonunu haiku önden sınıflandırır, puan değişmez, Defne gülümser: "Beni kandırmak da bir beceri ama puanı yalnız cevap kazandırır." Asla utandırmaz; geri bildirim formülü sabittir: **1 doğru şey + 1 eksik + 1 sonraki adım**, ≤80 kelime, emoji yok, "sen" dili, her zaman isimle hitap.

**Puanlama ilkesi:** Rubrik 0–100: Doğruluk 50 / Tamlık 30 / Açıklık 20; her puanın gerekçesi oyuncuya görünür ("neden 82"). ≥70 geçer; 85+ "parlak" (+%20 XP); <40'ta ilgili ders kartı yeniden önerilir, XP kaybı yoktur. XP = taban × puan/100 (geçince en az %50). 2 deneme hakkı; ikinci deneme %80 XP. **İtiraz** butonu `claude-opus-5-5` ile yeniden puanlar, haftada 3 hak; itiraz oranı bir kalite metriğidir. Kalibrasyon: haftada 200 örneklem çift puanlanır, Usta başına sapma raporlanır. Kopya: yapıştırma ve yazım telemetrisi + oyuncular arası benzerlik + "kendi kodunu açıkla" sorusu (açılış öncesi 1 soru; açıklanamayan kod işletmeyi açmaz). Dış kaynak kullanmak yasak değildir; açıklayabilmek şarttır.

## 11. On tasarım ilkesi

1. **Görünmeyen kod yoktur.** Her derlenen satır dünyada bir şeyi değiştirir: pano akar, bariyer kalkar, müşteri girer.
2. **20. dakikada ilk Bayt, 2. günde ilk işletme.** İlk 48 saatte mülkiyet hissi oluşmazsa oyuncu geri gelmez.
3. **Öğrenmek XP, yapmak Bayt.** Ders hiç Bayt vermez; Bayt yalnızca çalışan koddan akar.
4. **Testler hakem, Usta antrenör.** Geçme kararı deterministiktir; AI yalnız açık uçlu cevabı puanlar ve yol gösterir.
5. **Gösteriş kazanılır, süs satın alınır.** Statü taşıyan hiçbir nesne Çip ile alınamaz.
6. **Her oturum bir tur kapatır.** 15 dakikada ders + görev + topla + al; yarım kalan oturum tasarım hatasıdır.
7. **Zorluk müşteri isteği kılığında gelir.** "Generics" değil, "Kütüphaneci Ayşe'nin her türden raf isteği".
8. **Hata ceza değil hikâyedir.** Kırmızı test = şikâyet balonu; tekrar sınırsız, XP asla geri alınmaz.
9. **Önce pasif sosyal, sonra aktif.** Ziyaret/alkış/tabela herkese; sohbet ve düello isteğe bağlı; 13–17 varsayılan korumalı.
10. **Zamanlayıcı kasada durur, derste değil.** Bekleme yalnızca gelire uygulanır; hiçbir ders, ipucu veya test zamanla ya da parayla kilitlenmez.

## 12. En büyük 5 risk ve karşı önlem

| # | Risk | Belirti | Karşı önlem |
|---|---|---|---|
| 1 | **"Okul gibi" hissetmesi** | Ders terk oranı >%20; oturum süresi dersle ters orantılı | Oturumun ≤%40'ı ders; kart ≤60 kelime; her dersin sonunda görünür iş emri; dersi NPC diyaloğu olarak anlatma; A/B ile ders terk oranı <%15 hedefi |
| 2 | **Boş şehir** (ilk haftalar) | Meydan'da <10 avatar, sohbet sessiz | 40 kişilik shard'lar (kalabalık hissi), NPC işletmeler ve dolaşan Ustalar, asenkron sosyal (defter, alkış, vitrin), kohort bazlı açılış (okul/sınıf davet kodları) |
| 3 | **Kodu dışarıdan yapıştırma** | Yazım telemetrisi anomalisi, açıklama sorusunda düşük puan | Açılış öncesi "kendi kodunu açıkla" sorusu, yapıştırma tespiti, oyuncuya göre değişen gizli test girdileri, mülkiyet motivasyonu; dış kaynak yasak değil, açıklamak şart |
| 4 | **Tier 2→3 zorluk uçurumu** (OOP → LINQ/async) | Sev. 18–25 arasında terk sıçraması | "Kalfa Köprüsü" ara görevleri, adaptif ipucu yoğunluğu, lonca ve Kalfa Yardımı tam bu seviyede açılır, tier geçiş terk oranı haftalık izlenir |
| 5 | **Ekonominin kırılması** | Bayt birikimi, kozmetiğin değersizleşmesi, pasif gelir patlaması | İşletme sayısı tavanı, kasa tavanı, %5 bakım, tier'e endeksli fiyat, lansman öncesi 10.000 bot oyunculu ekonomi simülasyonu, haftalık dolaşım raporu |

## 13. MVP kapsamı taslağı

**Kesinlikle içinde:**
- Telefon + OTP kayıt, doğum yılı, 13–17 veli onayı akışı.
- Dil seçimi: C# açık; 5 dil "yakında + haber ver" bekleme listesi.
- Avatar (3 adım, 12 kombinasyon), takma ad moderasyonu.
- Meydan + **Çarşı** + **Liman** + Bloklar (tek oda); Akademi; Mağaza; Liderlik Panosu; LED pano.
- 12 Çarşı dersi + 6 Liman dersi; her derste 3 Usta sorusu; Usta Defne ve Usta Kerem.
- 3 işletme: **Otopark (L1–L2, tam ayrıntılı)**, Büfe, Kargo Deposu; gerçek sandbox derleme/test; günlük sentetik trafik ve kasa.
- XP/seviye 1–15, unvanlar Çırak/Kalfa/Zanaatkâr; Ruhsat sistemi; Çarşı Semt Sınavı.
- Bayt ekonomisi: görev, günlük giriş, Günlük Usta Sorusu ve seri, işletme geliri, bakım; 40 kozmetik, 25 oda eşyası.
- Sosyal: ziyaret, alkış, ziyaretçi defteri, arkadaş, Meydan sohbeti (moderasyonlu, 13–17 güvenli mod), haftalık arkadaş ligi, Vitrin (salt okunur).
- Küçük Çip mağazası (2 premium set, 1 oda teması): ödeme isteğini doğrulamak için.
- İtiraz akışı, kopya telemetrisi, Usta puan kalibrasyon paneli (iç araç).

**Kesinlikle dışında (MVP+1 ve sonrası):**
- Lonca, gerçek zamanlı Kod Düellosu ve turnuva, mentorluk (Kalfa Yardımı), akran kod incelemesi notları.
- Atölyeler ve sonrası semtler (OOP, LINQ, async, EF Core, Web API).
- Sezonlar, etkinlik takvimi, sezon bileti.
- Oda genişletme, ikinci oda, hediye gönderme, oyuncular arası ticaret.
- Diğer programlama dilleri, mobil uygulama sarmalayıcısı, ses sohbeti, kullanıcı üretimi ders içeriği.

MVP başarı ölçütleri: ilk Bayt ≤20 dk (%70), 72 saatte otopark açma (%35), D1/D7/D30 = %40/%20/%10, Usta puanına itiraz oranı <%5, ders terk oranı <%15.

## 14. Varsayımlar ve Açık Sorular

**Varsayımlar**
1. Oyun içi kur 10 TL = 1 B; otopark L1 trafiği 12 araç/gün; tüm sayılar lansman öncesi simülasyonla yeniden ayarlanacak.
2. Veli onayı 72 saat içinde gelmezse yalnızca sosyal özellikler kapanır; öğrenme ve işletme açık kalır (KVKK/hukuk ekibi doğrulayacak).
3. `UcretHesapla(0)` için ücret 0 TL kabul edildi ("aynı dakika çıkan ödemez"); netleştirme adımında Hasan Abi bunu söyler.
4. İşletme simülasyonu günde 1 toplu çalıştırma + önbellekle sandbox maliyetini sınırlar; saatlik kasa akışı bu günlük sonucun paylaştırılmasıdır.
5. Metot imzası Tier 1'de `int dakika` alır; `DateTime` tabanlı imza otopark L4'te gelir.
6. Meydan shard kapasitesi 40, oda kapasitesi 20 eşzamanlı avatar.
7. İstemci izometrik PixiJS + React + Monaco (brief'teki yön); mobil tarayıcıda editör yatay modda açılır.
8. Değişken ve metot adları ilk iki semtte Türkçe (`UcretHesapla`), Atölyeler'den itibaren İngilizce konvansiyona geçiş bir ders olarak işlenir.
9. Çip paket fiyatlandırması ve Çip kazanım oranları ürün/ekonomi belgesinde kesinleşir; burada yalnızca "ne satılır / ne satılmaz" sabitlendi.
10. Usta cevapları `claude-sonnet-5-5`, itirazlar `claude-opus-5-5`, ön eleme ve moderasyon `claude-haiku-5-5` ile; soru başına yanıt süresi hedefi <4 sn.

**Açık Sorular**
1. 119 dk → 200 TL / 120 dk → 80 TL anomalisini Usta kendisi mi işaret etmeli, yoksa yalnızca fark eden oyuncu mu ödüllendirilmeli? (Öneri: ilk 1.000 oyuncuda A/B.)
2. 13–17 için Meydan sohbeti varsayılan "güvenli mod" yeterli mi, yoksa veli onayına kadar tamamen kapalı mı olmalı?
3. Gerçek zamanlı Düello MVP+1'de mi kalmalı, yoksa asenkron "aynı problem, en iyi süre" sürümü MVP'ye mi alınmalı?
4. İşletmeler satılabilmeli mi (ikinci el piyasa): mülkiyet hissi mi, ekonomi riski mi ağır basar?
5. Kasa tavanı 8 saat; Bayt ile alınan "Büyük Kasa" eşyasıyla 12 saate çıksın mı? (Çip ile asla.)
6. Semt Sınavı başarısızlığında bekleme süresi olsun mu? (Öneri: hayır, yalnızca farklı soru seti.)
7. "KodKent" adının marka ve alan adı uygunluğu (alternatif isimler yalnızca ek bölüm için: Kodşehir, BaytKent, DerleKent).
8. Vitrin'de kod paylaşımı kopyayı kolaylaştırır mı; vitrin yalnızca L2+ işletmelerde ve "açıkla" sorusuyla birlikte mi açılmalı?
