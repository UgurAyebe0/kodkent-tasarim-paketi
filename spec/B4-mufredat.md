# B4 — C# Müfredatı (KodKent)

| Alan | Değer |
|---|---|
| Belge id | **B4** |
| Sürüm | v1 (2026-11-02) |
| Sahibi | Müfredat tasarımcısı ve kıdemli .NET eğitmeni |
| Bağlayıcı kaynaklar | `KANON.md` v1 (§2.1 semtler ve konu kümeleri, §3.3 XP kaynakları, §4 görev ödülleri, §5 ve §5.1 işletmeler ve Otopark, §9 eşikler), `A-vizyon-FINAL.md` (§4 ilk 30 dakika, §7 Çarşı ve Ruhsat zinciri), `A-vizyon-egitim.md` (PRIMM, müfredat), `B2-ilerleme-ekonomi.md` (§2, §4, §11–§12), `brief/03-ajan-talimati.md` |
| Kapsam | 11 modül, 100 ders (ders kimlikleri, hedefler, ön koşullar, tier, XP, dakika, soru karışımı); Çarşı 1.1–1.4 tam içerik; Liman 2.1–2.12 ders kartı özetleri; Ders Mührü ve Telafi Turu; 7 Semt Sınavı; Günlük Tekrar algoritması; kavram → işletme eşlemesi; Otopark yolculuğu; zorluk eğrisi verisi; ön koşul grafı; kavram sözlüğü |
| Kural | KANON'daki her sayı ve ad aynen kullanılır. Değiştirilmesi önerilen sabitler gövdede "**(B4 önerisi)**" etiketiyle ayrı tutulur ve Ek A'da toplanır; onaylanana kadar KANON geçerlidir. B4, ders listesinin ve ders kimliklerinin SAHİBİDİR. |

**Terim notu.** *Tier* yalnızca semt zorluk katmanıdır (T1–T4); işletme kademesi *L1–L5* ile yazılır (B2 ile aynı kullanım). *Ders* = Akademi Kürsüsü'nde 7–15 dakikalık kart akışı + 3 Usta sorusu; *görev* = dersin Atölye'deki prova görevi; *Ruhsat zinciri* = bir işletmenin L1 konusunu prova eden 3 ardışık dersin görevleri. PRIMM kartları hep açık adıyla yazılır (Tahmin et, Çalıştır, İncele, Değiştir, Yap); tek harfli **K / Ç / H / Y** yalnızca soru tipidir (Kavram Sorusu, Çıktı Tahmini, Hata Avı, Kod Yazma). *Mühür* = Ders Mührü. Kod örneklerinde tanımlayıcılar Çarşı–Liman'da Türkçe ve karaktersizdir (`ucret`, `dakika`), Atölyeler'den itibaren İngilizcedir (KANON §1). Çıktılar sandbox'ın `InvariantCulture` ayarıyla verilir (ondalık ayracı nokta).

---

## 0. Yönetici özeti

1. **Ölçek:** 11 modül · 100 ders · 7 Semt Sınavı. Ders süresi 1.125 dk (18,75 sa); ders + görev + sınav 2.191 dk (36,5 sa); tek seferlik müfredat XP'si 41.350. Semt payları 12 / 12 / 14 / 16 / 16 / 14 / 16 (B2 §13 ile aynı).
2. **Kimlik:** ders `m.n`; modül sınırı semt sınırıdır (1.x Çarşı, 2.x Liman, 3.x Atölyeler). VİZYON §7 ve B2 atıfları aynen geçerlidir.
3. **Çarşı 1.1–1.4 tam içerik** (§4): 24 kart, 12 Usta sorusu (alt ölçütlü rubrik, anahtarlar, çapa cevaplar), 4 görev, 12 açık test; tüm çıktılar `dotnet` ile doğrulandı.
4. **Kapılar:** Otopark L1 için 1.1–1.4 yeter (32 dk; tapu ≈72. dk); L2 2.1 · L3 3.4 · L4 4.7 · L5 5.1 + 6.3. Tüm işletmelerin zincirleri ve kapıları §2, §9 ve §12'dedir.
5. **Mekanikler:** Ders Mührü ve Telafi Turu (§6), yedi Semt Sınavı (§7), Günlük Tekrar 1-3-7-21 (§8; C# iskeleti derlenip denendi).
6. **B2 uyumu:** 7 semtin 5'inde tek seferlik XP birebir; Kampüs −640, Veri Vadisi −1.470 (tier karışımı); Otopark L3 kapısı 3.2 yerine 3.4 (§11).
7. **MVP kesiti:** 18 ders (1.1–1.12 + 2.1–2.6) = 144 dk, 1.800 XP, 18 Metro durağı (VİZYON §13).

---

## 1. Yapı: kimlikler, ders anatomisi, soru karışımı

### 1.1 Birimler ve kimlik kuralı

Ders kimliği `m.n` (modül numarası . modül içi sıra, talimat §3). **Modül sınırları semt sınırlarıyla çakışır:** M1 Çarşı, M2 Liman, M3 Atölyeler, M4–M5 Kampüs, M6–M7 Finans Bölgesi, M8–M9 Veri Vadisi, M10–M11 Bulut Tepesi. Böylece VİZYON §7'deki 1.1–1.4 ve B2'deki 1.11 / 2.1 / 2.5 atıfları aynen geçerlidir.

| Nesne | Biçim | Örnek |
|---|---|---|
| Modül | `M{n}` | `M3` |
| Ders | `{modül}.{sıra}` | `1.2` |
| Prova görevi | `gorev-{ders}` | `gorev-1.2` |
| Usta sorusu | `S-{ders}-{tip}{n}`, varyant a / b / c (B3 §2.6; kimliklerde Ç yerine C) | `S-1.2-K1` (hedef), `S-1.2-C2` (Telafi) |
| Semt Sınavı | `sinav-{semt-slug}` | `sinav-carsi` |
| Günlük Tekrar kartı | `t-{ders}-{n}` | `t-1.2-2` |

(B7 §4.3.6 `learning.lessons`: `id` = `m.n`, `module_id` = `M{n}`, `seq` = n; `UNIQUE (module_id, seq)`.)

### 1.2 Ders anatomisi

| Sıra | Öğe | Kural |
|---|---|---|
| 1 | 4–6 PRIMM kartı | Tahmin et → Çalıştır → İncele (1–2) → Değiştir → Yap; kart ≤60 kelime, ders ≤3 yeni sembol; Usta sesiyle |
| 2 | "Dene" | Değiştir kartında 1 satırlık mini editör |
| 3 | 3 Usta sorusu (S1–S3) | Rubrik (50/30/20) cevap kutusunun üstünde; soru başına 2 deneme; Kurul puanlar |
| 4 | Ders özeti | ≤40 kelime, 2–3 madde |
| 5 | Prova görevi | Ders biter bitmez (≤60 sn); Sıralama → Tamamlama → Sıfırdan merdiveni |

Ders dakikası = kartlar + 3 soru; görev dakikası ayrıdır (T1 6 · T2 8 · T3 10 · T4 12, **B4 önerisi**). Ders XP'si = 10 (kartlar: 2 + 2 + 4 + 2, B3 §2.1) + Σ soru XP'si; planlama değeri T1 100 · T2 180 · T3 280 · T4 400, tavan `10 + 3 × 1,2 × taban` = 118 / 204 / 312 / 442 (KANON §3.3, B2 §4.3). Ders başına 6 soru şablonu (3 hedef + 3 Telafi) × 3 varyant = 18 soru gövdesi (B3 §2.6) ve **en az 3 Günlük Tekrar kartı** üretilir (§6).

### 1.3 Soru tipi karışımı ve AI ağırlığı

Tablolardaki harfler S1, S2, S3 sırasıdır; kural (B3 §2.5): derste en az 1 K, en çok 1 Y, varsayılan sıra K → Ç → H. İlk 4 derste (1.1–1.4) **Y yoktur**: VİZYON "ilk 3 derste sıfırdan kod yok" der ve prototipin `cevrimdisiPuanla` işlevi yalnızca metin puanlar. **Y** sorusu 1–6 satır koddur; sandbox 3 açık + 2 gizli test koşar, puan = geçen test yüzdesi, AI'sızdır (B3 ile hizalanır, **B4 önerisi**: XP formülü K/Ç/H ile aynı). AI ağırlığı: K = 1, Ç = 0,5, H = 0,5, Y = 0 (VİZYON §10); gerçekleşen dağılım §11'dedir.

**Yanılgı dağılımı (B3 §12.5, Y-id → ders).** 1.1 Y04 · 1.2 Y02, Y03 · 1.3 Y01, Y08–Y11, Y19 · 1.4 Y15–Y17 · 1.5 Y07, Y22 · 1.6 Y14 · 1.7 Y13, Y18 · 1.8 Y12 · 1.11 Y05, Y06, Y20, Y21 · 2.1–2.2 Y23, Y24 · 2.5 Y26 · 2.6 Y27 · 2.7 Y25 · 2.8 Y28 · 2.10 Y30 · 2.11 Y29 · 3.5 Y31, Y33 · 3.6 Y32 · 3.10 Y35 (B3: Kampüs; `struct` B4'te 3.10) · 3.13 Y34 · 4.4 Y36 · 6.1–6.2 Y37 · 7.1 Y38 · 8.5 ve 9.5 Y39 · 11.1 Y40. Y-id'si olmayan dersler (ör. 1.9, 1.10, 1.12, 2.3, 2.9) önceki derslerin Y-id'lerini yeni yüzeyde yeniden sorar (B3 §2.3, kural 6).

### 1.4 Adlandırma dili ve kod stili

Çarşı–Liman: Türkçe, karaktersiz (`ucret`, `baslayanSaat`); yerel değişken `camelCase`, tür ve metot `PascalCase`. **3.1'den itibaren İngilizce** (`fee`, `CalculateFee`). Çıktı metinleri ve yorumlar Türkçe kalır. Çarşı–Liman kartları üst düzey ifadelerle yazılır; sınıf + metot iskeleti 1.4'te "dükkânın tabelası" diye tanıtılır. `using System;` ve benzerleri sandbox'ta örtük eklenir (ImplicitUsings).

---

## 2. Modül haritası

| M | Ad | Semt (Usta) | Tier | Dersler | Adet | Ruhsat zincirleri (ders aralığı) |
|---|---|---|---|---|---|---|
| M1 | Merhaba KodKent: Temeller | Çarşı (Defne) | T1 | 1.1–1.12 | 12 | Otopark 1.2–1.4 · Büfe 1.5–1.7 · Manav 1.8–1.10 |
| M2 | Konteynerler: Koleksiyonlar ve Metin | Liman (Kerem) | T1–T2 | 2.1–2.12 | 12 | Kargo Deposu 2.1–2.3 · Balık Hali 2.4–2.6 · Oto Yıkama 2.7–2.9 · Gümrük 2.10–2.12 |
| M3 | Atölye: Tür Güvenliği ve Nesneler | Atölyeler (Nehir) | T2 | 3.1–3.14 | 14 | Oto Tamirhane 3.5–3.7 · Mobilya Atölyesi 3.8–3.10 · Trafo Merkezi 3.11–3.13 |
| M4 | Kampüs I: LINQ'e Giden Yol | Kampüs (Baran) | T2–T3 | 4.1–4.8 | 8 | Kütüphane 4.6–4.8 |
| M5 | Kampüs II: Genel Tipler, Olay, Dosya | Kampüs (Baran) | T2–T3 | 5.1–5.8 | 8 | Sinema 5.1–5.3 · Haber Ajansı 5.4–5.6 |
| M6 | Finans I: Asenkron ve Ağ | Finans Bölgesi (Elif) | T3 | 6.1–6.8 | 8 | Banka 6.1–6.3 · Borsa Panosu 6.5–6.7 |
| M7 | Finans II: Test, Kalıp, Git | Finans Bölgesi (Elif) | T3 | 7.1–7.8 | 8 | Sigorta 7.1–7.3 |
| M8 | Veri Vadisi I: SQL ve EF Core | Veri Vadisi (Selin) | T3 | 8.1–8.7 | 7 | Hastane Kayıt 8.4–8.6 |
| M9 | Veri Vadisi II: İlişkiler ve Güvenli Veri | Veri Vadisi (Selin) | T4 | 9.1–9.7 | 7 | Otel 9.1–9.3 |
| M10 | Bulut Tepesi I: Minimal API ve REST | Bulut Tepesi (Yusuf) | T4 | 10.1–10.8 | 8 | Yemek Sipariş Platformu 10.2–10.4 |
| M11 | Bulut Tepesi II: DI, Güvenlik, Gerçek Zamanlı | Bulut Tepesi (Yusuf) | T4 | 11.1–11.8 | 8 | Şehir Uygulaması 11.1–11.3 |

Toplam **11 modül, 100 ders**; B2 §13 varsayım 1'in envanteriyle (12 / 12 / 14 / 16 / 16 / 14 / 16) semt semt aynıdır. Zincirler ardışık 3 derstir; 60 ders Ruhsat parçasıdır, 40 ders zincir dışıdır (temel, köprü ve prova dersleri).

**Kapsam denetimi (zorunlu konu → dersler).**

| Konu | Dersler |
|---|---|
| Giriş ve araçlar | 1.1, 1.12 |
| Değişkenler ve tipler | 1.1, 1.2, 1.5 |
| Operatörler | 1.2, 1.3, 1.6 |
| Koşullar | 1.3, 1.8, 1.9 |
| Döngüler | 1.6, 1.7, 1.10 |
| Metotlar | 1.4, 3.4, 4.2 |
| Diziler ve List | 2.1–2.3, 2.7 |
| String işlemleri | 1.11, 2.6, 2.12 |
| Koleksiyonlar | 2.1–2.5, 5.1 |
| Hata yönetimi | 2.9, 3.3, 3.13, 6.4, 10.6 |
| OOP | 3.5–3.14 |
| Records ve pattern matching | 3.10, 5.7 |
| Generics | 4.1, 5.2 |
| Delegate, event, lambda | 4.2, 5.4 |
| LINQ | 4.4–4.6, 4.8 |
| DateTime | 4.7, 5.3 |
| Dosya I/O ve JSON | 5.5, 5.6 |
| async/await | 6.1–6.4, 6.8 |
| Unit test | 7.1, 7.2, 7.4, 10.7 |
| Tasarım kalıpları (temel) | 5.4 (Observer), 7.3 (Strategy), 7.5 (Factory, Decorator), 9.2 (Repository), 11.2 (zincir) |
| EF Core ve veritabanı | 8.1–8.7, 9.1–9.7 |
| Minimal Web API | 10.2–10.8, 11.1–11.8 |

KANON'un ek konuları da yerindedir: `HttpClient` 6.5, Git 7.6–7.7, DI 11.1, auth 11.3, SignalR 11.6, dağıtım 11.7.

---

## 3. Ders tabloları (M1–M11)

Tüm tablolar aynı 10 sütunu taşır ve tam ders listesinin tek kaynağıdır (Görev Atlası, §5 ve §10.2 yardımcı tablolardır). `dk` = ders süresi (kartlar + 3 soru); `XP` = planlama değeri (KANON §3.3). **R n/3** = Ruhsat parçası; **"Ln kapısı"** = o işletme seviyesinin yükseltme kapısı olan ders (kapı ataması **B4 önerisidir**, B5 ile hizalanır; Otopark ve Büfe kapıları B2 §7.3 ve §13 (varsayım 8) ile aynıdır, tek fark Otopark L3'tür, bkz. §11); **"n. yüzey"** = kademeli fiyat şemasının tekrarı. Sınav adı (ör. "Çarşı Sınavı") semtin ilk dersinin kapısıdır. Soru harfleri: K Kavram · Ç Çıktı Tahmini · H Hata Avı · Y Kod Yazma.

### M1 — Merhaba KodKent: Temeller (Çarşı, T1, Usta Defne)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 | Merhaba KodKent | (1) `Console.WriteLine` ile ekrana yazar; (2) değişkeni tür + ad + değer olarak okur (`string`, `int`); (3) `$"..."` ile değeri metne yerleştirir | — | Çarşı | T1 | 100 | 8 | K,Ç,H | Öğretici (Ruhsat yok) · Otopark: ücretin ekrana yazılması |
| 1.2 | Sayılar ve Yuvarlama | (1) `int`, `double`, `decimal` farkını söyler; (2) tam sayı bölmesini (`/`) ve kalanı (`%`) hesaplar; (3) `(dakika + 59) / 60` ile yukarı yuvarlar | 1.1 | Çarşı | T1 | 100 | 8 | K,Ç,H | Otopark L1 · R 1/3 |
| 1.3 | Kararlar | (1) karşılaştırma ve `bool` ifadeleri kurar; (2) `if / else if / else` zincirinde sıranın sonucu değiştirdiğini görür; (3) `&&`, `\|\|` ve sınır değerlerini (`<` / `<=`) seçer | 1.2 | Çarşı | T1 | 100 | 8 | K,Ç,H | Otopark L1 · R 2/3 |
| 1.4 | Fonksiyon Sözleşmesi | (1) metot imzasını (dönüş türü, ad, parametre) okur; (2) `return` ile değer döndürür, yazdırmayla karıştırmaz; (3) imzaya ve girdi kuralına uyan metot yazar | 1.3 | Çarşı | T1 | 100 | 8 | K,Ç,H | Otopark L1 · R 3/3 → Ruhsat → Tapu |
| 1.5 | Para Hesabı: decimal | (1) paranın neden `decimal` olduğunu açıklar; (2) `m` soneki ve `Math.Round` kullanır; (3) fiyat × adet − ödenen = para üstü hesaplar | 1.2, 1.4 | Çarşı | T1 | 100 | 8 | K,H,Y | Büfe L1 · R 1/3 |
| 1.6 | Tekrar: while Döngüsü | (1) `while` koşulunu ve sayacı kurar; (2) toplayıcı (`+=`, `++`) ile sonuç biriktirir; (3) sonsuz döngüyü (koşulu güncellememe) tanır | 1.3, 1.5 | Çarşı | T1 | 100 | 8 | K,Ç,Y | Büfe L1 · R 2/3 |
| 1.7 | Sayaçlı Döngü: for | (1) `for` başlık üçlüsünü (başlangıç; koşul; adım) yazar; (2) `break` ve `continue` kullanır; (3) bozuklukları sayan döngü kurar | 1.6 | Çarşı | T1 | 100 | 8 | K,Ç,Y | Büfe L1 · R 3/3 → Ruhsat |
| 1.8 | Seçim: switch | (1) `switch` deyimi (`case`, `default`, `break`) ve ifadesiyle değere göre dal seçer; (2) ilişkisel örüntüyle (`< 5 =>`, `>= 10 =>`) aralığa göre dal seçer; (3) zincir mi `switch` mi seçimini gerekçelendirir | 1.3 | Çarşı | T1 | 100 | 7 | K,Ç,Y | Manav L1 · R 1/3 |
| 1.9 | Kademeli Fiyat | (1) eşik tablosunu `switch` ifadesi ya da `if / else if` ile kurar; (2) yüzde indirimde işlem sırasını (önce çarp, sonra böl) ve `decimal`'i kullanır; (3) aynı şemayı Otopark ve Manav yüzeyinde tanır | 1.3, 1.5, 1.8 | Çarşı | T1 | 100 | 9 | K,H,Y | Manav L1 · R 2/3 · 2. yüzey |
| 1.10 | Sepet Toplamı | (1) döngü ve metodu birleştirir; (2) kademe metodunu her kalem için çağırıp toplar; (3) toplamı biçimli yazdırır | 1.7, 1.9 | Çarşı | T1 | 100 | 9 | K,Ç,Y | Manav L1 · R 3/3 → Ruhsat |
| 1.11 | Metinle Çalışmak: string | (1) `Length`, indeks (`s[0]`), `Substring` kullanır; (2) `Trim`, `ToUpper`, `Contains`, `Replace` ile metni temizler; (3) `PadLeft` / `PadRight` ile hizalı fiş yazar | 1.1, 1.7 | Çarşı | T1 | 100 | 8 | K,Ç,Y | Büfe L2 kapısı |
| 1.12 | Şehirden Çıkış: dotnet ve Visual Studio | (1) `dotnet new console` ve `dotnet run` ile yerel proje çalıştırır; (2) `Program.cs` yapısını (üst düzey ifade, `using`) tanır; (3) derleyici hatasını (CS kodu, satır) okuyup düzeltir | 1.4, 1.11 | Çarşı | T1 | 100 | 7 | K,Ç,H | Otopark kodu yerelde aynen derlenir (Aha c) · Çarşı Sınavı provası |

### M2 — Konteynerler: Koleksiyonlar ve Metin (Liman, T1–T2, Usta Kerem)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 2.1 | Liste Kur: List<T> | (1) `List<string>` oluşturur, `Add` / `Count` / `[i]` kullanır; (2) `Contains` ile üyelik sorar; (3) listenin dizi değil esnek koleksiyon olduğunu söyler | Çarşı Sınavı; 1.7, 1.11 | Liman | T1 | 100 | 9 | K,Ç,Y | Kargo Deposu L1 · R 1/3 · Otopark L2 kapısı |
| 2.2 | Diziler ve İndeks | (1) `int[]` kurar, indeksin 0'dan başladığını uygular; (2) `Length` ile `for` döngüsünü sınırlar; (3) `IndexOutOfRangeException`'ı sınır hatası olarak tanır | 2.1 | Liman | T1 | 100 | 8 | K,H,Y | Kargo Deposu L1 · R 2/3 |
| 2.3 | foreach ve Envanter Sayımı | (1) `foreach` ile koleksiyonu gezer; (2) toplam, sayım, en büyük kalıplarını yazar; (3) `for` ile `foreach` seçimini gerekçelendirir | 2.1, 2.2 | Liman | T1 | 100 | 8 | K,Ç,Y | Kargo Deposu L1 · R 3/3 → Ruhsat · Manav L2 kapısı |
| 2.4 | Sözlük: Dictionary | (1) anahtar–değer ilişkisini kurar (`Dictionary<string, decimal>`); (2) `Add`, `[anahtar]`, `ContainsKey` kullanır; (3) listeden farkını söyler | 2.3 | Liman | T1 | 100 | 8 | K,Ç,Y | Balık Hali L1 · R 1/3 |
| 2.5 | Sözlükle Fiyat Listesi | (1) `TryGetValue` ile güvenle arar; (2) var olan anahtarı günceller, adet sayar (frekans); (3) `foreach (var kv in sozluk)` ile gezer | 2.4 | Liman | T1 | 100 | 8 | K,Ç,Y | Balık Hali L1 · R 2/3 · Büfe L3, Manav L3, Balık Hali L2 kapısı |
| 2.6 | Metni Böl: Split ve Parse | (1) `Split` ile "Hamsi:120;Levrek:210" gibi metni ayrıştırır; (2) `int.Parse` ve `TryParse` ile metni sayıya çevirir; (3) bozuk girdide `TryParse` ile çökmeyi önler | 2.5, 1.11 | Liman | T1 | 100 | 7 | K,H,Y | Balık Hali L1 · R 3/3 → Ruhsat · Kargo Deposu L2 kapısı |
| 2.7 | Liste Kalıpları | (1) `Insert`, `RemoveAt`, `IndexOf` kullanır; (2) filtre, sayma ve toplama kalıplarını `List<T>` üzerinde yazar; (3) döngü içinde listeyi değiştirme tuzağını tanır | 2.3 | Liman | T2 | 180 | 10 | K,Ç,Y | Oto Yıkama L1 · R 1/3 · Kargo Deposu L4 kapısı |
| 2.8 | Paket ve Ek Hizmet | (1) paket (`switch`) + ek hizmet listesi fiyatını birleştirir; (2) koleksiyonu metoda parametre verir (referans davranışı); (3) kademeli şemayı üçüncü yüzeyde kurar | 2.7, 1.9 | Liman | T2 | 180 | 11 | K,Ç,Y | Oto Yıkama L1 · R 2/3 · 3. yüzey |
| 2.9 | Hata Ayıklama Temelleri | (1) derleme, çalışma zamanı ve mantık hatasını ayırır; (2) breakpoint, adım adım izleme ve izleme çıktısı kullanır; (3) CS hata mesajından satırı ve nedeni bulur | 2.8 | Liman | T2 | 180 | 10 | K,H,H | Oto Yıkama L1 · R 3/3 → Ruhsat (görev biçimi: hata ayıklama) |
| 2.10 | Arama | (1) doğrusal aramayı elle yazar; (2) `IndexOf` / `Contains` ile karşılaştırır; (3) ikili aramanın fikrini (`BinarySearch`) anlatır ve `HashSet<T>` ile hızlı üyelik sorgusunu tanır | 2.3 | Liman | T2 | 180 | 10 | K,Ç,Y | Gümrük L1 · R 1/3 · Gümrük L2, L4 kapısı |
| 2.11 | Sıralama | (1) `Sort` ve `CompareTo` ile sıralar; (2) seçme sıralamasını elle izler; (3) sıralamanın aramayı hızlandırdığını açıklar | 2.10 | Liman | T2 | 180 | 10 | K,Ç,Y | Gümrük L1 · R 2/3 · Kargo Deposu L3, Balık Hali L3, Gümrük L3 kapısı |
| 2.12 | Plaka Doğrulama | (1) `char.IsDigit` / `IsLetter` ile metni karakter karakter tarar; (2) uzunluk, bölge kodu ve harf kuralını doğrular; (3) boş girdiyi eler (`string.IsNullOrWhiteSpace`) ve çıktıyı `StringBuilder` ile kurar | 1.11, 2.10 | Liman | T2 | 180 | 9 | K,H,Y | Gümrük L1 · R 3/3 → Ruhsat · Balık Hali L4 kapısı |

### M3 — Atölye: Tür Güvenliği ve Nesneler (Atölyeler, T2, Usta Nehir)

Bu modülde kod İngilizce adlandırmaya geçer (3.1). Otopark `UcretHesapla` imzası KANON'a göre sabit kalır; çeviri yardımcı kodda yapılır.

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 3.1 | Adlandırma: Türkçeden İngilizceye | (1) PascalCase / camelCase kuralını uygular; (2) Türkçe tanımlayıcıyı anlamı koruyarak İngilizceye çevirir; (3) iyi isimle yorum ihtiyacının azaldığını gösterir | Liman Sınavı; 2.12 | Atölyeler | T2 | 180 | 8 | K,H,Y | Tüm işletme kodları (imzalar sabit kalır) |
| 3.2 | enum: Adı Olan Seçenekler | (1) `enum` tanımlar ve değer olarak kullanır; (2) `switch` ile enum'a göre dal seçer, `Enum.IsDefined` ile tanımsız değeri eler; (3) sihirli sayı / metin yerine enum kullanmanın nedenini söyler | 1.8, 3.1 | Atölyeler | T2 | 180 | 9 | K,Ç,Y | Otopark L3 kapısı (1/3: indirim türü) |
| 3.3 | Sözleşmeyi Korumak: throw ve exception | (1) `throw new ArgumentOutOfRangeException(...)` ile geçersiz girdiyi reddeder; (2) exception'ın akışı kestiğini görür; (3) hangi girdinin sözleşme dışı olduğunu belirler | 1.4, 3.2 | Atölyeler | T2 | 180 | 9 | K,H,Y | Otopark L3 kapısı (2/3: bozuk kayıt) |
| 3.4 | Aşırı Yükleme ve İsimli Parametreler | (1) aynı adlı metotları farklı parametrelerle yazar (overload); (2) isimli ve varsayılan parametre kullanır; (3) çağrıda hangi aşırı yüklemenin seçildiğini tahmin eder | 1.4, 3.3 | Atölyeler | T2 | 180 | 10 | K,Ç,Y | Otopark L3 kapısı (3/3, son ders) · Oto Yıkama L2 kapısı |
| 3.5 | Sınıf ve Nesne | (1) `class`, alan ve `new` ile nesne üretir; (2) nesne durumunun kopyalar arasında bağımsız olduğunu görür; (3) yapıcı metot (constructor) yazar | 3.4 | Atölyeler | T2 | 180 | 10 | K,Ç,Y | Oto Tamirhane L1 · R 1/3 |
| 3.6 | Kapsülleme ve Property | (1) `private` alan + `public` property kurar; (2) `set` içinde doğrulama yapar; (3) kapsüllemenin nesneyi tutarlı tuttuğunu açıklar | 3.5 | Atölyeler | T2 | 180 | 10 | K,H,Y | Oto Tamirhane L1 · R 2/3 · Manav L4, Oto Tamirhane L2 kapısı |
| 3.7 | Kalıtım | (1) `: Base` ile türetir; `virtual` / `abstract` ve `override` yazar; (2) `base` ile üst sınıfı çağırır; (3) "is-a" ilişkisini kalıtımın ölçütü olarak kullanır | 3.6 | Atölyeler | T2 | 180 | 11 | K,Ç,H | Oto Tamirhane L1 · R 3/3 → Ruhsat |
| 3.8 | Nesne Listeleri | (1) `List<Order>` gibi nesne koleksiyonu kurar; (2) koleksiyonda arar, toplar, filtreler; (3) nesne listesini metoda taşır | 2.3, 3.5 | Atölyeler | T2 | 180 | 10 | K,Ç,Y | Mobilya Atölyesi L1 · R 1/3 |
| 3.9 | Nesneler Birlikte Çalışır | (1) bir nesnenin başka nesne tuttuğu (composition, "has-a") yapıyı kurar; (2) sipariş → kalemler hesabını nesneler arası kurar; (3) "is-a" ile "has-a" seçimini gerekçelendirir | 3.8 | Atölyeler | T2 | 180 | 10 | K,Ç,Y | Mobilya Atölyesi L1 · R 2/3 |
| 3.10 | struct ve record | (1) değer tipi (`struct`) ile referans tipi (`class`) kopyalama farkını izler; (2) `record` ile değişmez veri tanımlar, `with` kullanır; (3) record'un eşitlik davranışını tahmin eder | 3.6, 3.9 | Atölyeler | T2 | 180 | 11 | K,Ç,H | Mobilya Atölyesi L1 · R 3/3 → Ruhsat · Büfe L4, Mobilya Atölyesi L2, Trafo Merkezi L3 kapısı |
| 3.11 | interface: Sözleşme Tipi | (1) `interface` tanımlar ve sınıfa uygular; (2) arayüz tipiyle değişken / parametre kullanır; (3) interface ile soyut sınıf seçimini gerekçelendirir | 3.7 | Atölyeler | T2 | 180 | 10 | K,H,Y | Trafo Merkezi L1 · R 1/3 |
| 3.12 | Polimorfizm ve Soyut Sınıf | (1) `abstract` sınıf ve metot yazar; (2) karışık listede doğru `override`'ın çalıştığını izler; (3) `switch` zinciri yerine polimorfizmi seçer | 3.7, 3.11 | Atölyeler | T2 | 180 | 11 | K,Ç,Y | Trafo Merkezi L1 · R 2/3 · Oto Tamirhane L3, Mobilya Atölyesi L3 kapısı |
| 3.13 | Hata Yönetimi: try, catch, finally | (1) `try / catch / finally` akışını izler; (2) özel exception sınıfı yazar; (3) ne zaman yakalanacağına, ne zaman fırlatılacağına karar verir | 3.3, 3.11 | Atölyeler | T2 | 180 | 10 | K,Ç,Y | Trafo Merkezi L1 · R 3/3 → Ruhsat · Trafo Merkezi L2, L4, Oto Tamirhane L4 kapısı |
| 3.14 | Sorumluluk Ayrımı | (1) "bir sınıf bir iş" ilkesinin (SRP) ihlalini bulur; (2) üç işi yapan sınıfı üçe böler; (3) bağımlılığı somut sınıf yerine arayüz üzerinden kurar | 3.9, 3.12, 3.13 | Atölyeler | T2 | 180 | 11 | K,H,Y | Atölyeler Sınavı provası |

### M4 — Kampüs I: LINQ'e Giden Yol (Kampüs, T2–T3, Usta Baran)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 4.1 | Generics 1: Genel Tipler | (1) `List<T>`'deki `T` yer tutucusunu açıklar; (2) genel sınıf (`Box<T>`) ve genel metot (`Swap<T>`) yazar; (3) generics'in tür güvenliğini `object`'e karşı savunur | Atölyeler Sınavı; 2.1, 3.5 | Kampüs | T2 | 180 | 10 | K,Ç,Y | LINQ yolu (Kütüphane) |
| 4.2 | Delegate ve Lambda | (1) `Func<>`, `Action<>`, `Predicate<>` ile metodu değer gibi taşır; (2) `x => x > 5` lambda'sını okur ve yazar; (3) metoda davranış parametresi geçirir | 4.1, 3.11 | Kampüs | T3 | 280 | 12 | K,Ç,Y | LINQ yolu · Haber Ajansı L2 kapısı |
| 4.3 | Extension Method | (1) `this` parametreli genişletme metodu yazar; (2) `IEnumerable<T>` üzerindeki metodun her koleksiyonda çalıştığını görür; (3) LINQ'in genişletme metotlarından oluştuğunu söyler | 3.5, 4.1 | Kampüs | T3 | 280 | 11 | K,Ç,Y | LINQ yolu |
| 4.4 | LINQ 1: Where ve Select | (1) `Where` ile süzer, `Select` ile dönüştürür; (2) sorgunun ertelenmiş çalıştığını (`ToList`) gösterir; (3) döngü yerine sorguyu seçtiği yeri bulur | 2.3, 4.2, 4.3 | Kampüs | T3 | 280 | 12 | K,Ç,Y | LINQ yolu (Kütüphane) |
| 4.5 | LINQ 2: Sırala ve Özetle | (1) `OrderBy`, `ThenBy` kullanır; (2) `Count`, `Sum`, `Average`, `Max`, `Any`, `First` ile özetler; (3) `FirstOrDefault` ile boş sonucu güvenle ele alır | 4.4 | Kampüs | T3 | 280 | 12 | K,Ç,Y | LINQ yolu · Kütüphane L2 kapısı |
| 4.6 | LINQ 3: Grupla ve Birleştir | (1) `GroupBy` ile kategori başına özet çıkarır; (2) `ToDictionary` ve `Join` ile iki listeyi bağlar; (3) sorgu zincirini okunur adımlara böler | 4.5, 2.5 | Kampüs | T3 | 280 | 13 | K,Ç,Y | Kütüphane L1 · R 1/3 · Kütüphane L4 kapısı |
| 4.7 | DateTime ve TimeSpan | (1) `DateTime` oluşturur, karşılaştırır, `TimeSpan` farkı alır; (2) `.TotalMinutes`, `.Days` ile süreyi sayıya çevirir; (3) gece tarifesi (22:00–06:00) gibi saat aralığını denetler | 3.10 | Kampüs | T2 | 180 | 10 | K,H,Y | Kütüphane L1 · R 2/3 · Otopark L4, Sinema L2, Oto Yıkama L3, Mobilya Atölyesi L4 kapısı |
| 4.8 | Gecikme Cezası: Dördüncü Yüzey | (1) gün bazlı gecikmeyi `TimeSpan` ile bulur; (2) kademeli ceza şemasını LINQ ile raporlar; (3) Otopark–Manav–Oto Yıkama–Kütüphane yüzeylerini karşılaştırır | 4.6, 4.7, 1.9 | Kampüs | T3 | 280 | 12 | K,H,Y | Kütüphane L1 · R 3/3 → Ruhsat · 4. yüzey |

### M5 — Kampüs II: Genel Tipler, Olay, Dosya (Kampüs, T2–T3, Usta Baran)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 5.1 | Kuyruk, Yığın ve Küme | (1) `Queue<T>` ile `Enqueue` / `Dequeue` / `Peek` kullanır; (2) `Stack<T>` ve `HashSet<T>` farkını söyler; (3) sıra, geri al ve benzersizlik problemlerine doğru koleksiyonu seçer | 4.1 | Kampüs | T2 | 180 | 10 | K,Ç,Y | Sinema L1 · R 1/3 · Otopark L5 (kuyruk), Kütüphane L3 kapısı |
| 5.2 | Generics 2: Kısıtlar | (1) `where T : IComparable<T>` kısıtını yazar; (2) genel `Max<T>` / `Repository<T>` iskeleti kurar; (3) kısıtın derleyiciye ne söylediğini açıklar | 4.1, 3.11 | Kampüs | T3 | 280 | 12 | K,H,Y | Sinema L1 · R 2/3 |
| 5.3 | Koltuk Rezervasyonu | (1) koltuk haritasını `Dictionary<string, Seat>` ile modeller; (2) seans saatlerini `DateTime` ile çakışma kontrolüne sokar; (3) aynı koltuğun iki kez satılmasını engeller | 4.7, 5.1, 5.2 | Kampüs | T3 | 280 | 13 | K,H,Y | Sinema L1 · R 3/3 → Ruhsat |
| 5.4 | Event: Yayıncı ve Abone | (1) `event` ve `EventHandler` tanımlar, abone olur; (2) yayıncı–abone ilişkisini (Observer) çizer; (3) abonelikten çıkmayı (`-=`) unutmanın sonucunu açıklar | 4.2, 3.6 | Kampüs | T3 | 280 | 12 | K,Ç,Y | Haber Ajansı L1 · R 1/3 |
| 5.5 | Dosya Okuma ve Yazma | (1) `File.ReadAllText`, `WriteAllLines`, `Path` kullanır; (2) `using` ile akışı kapatır; (3) olmayan dosya için `FileNotFoundException`'ı ele alır | 3.13, 2.6 | Kampüs | T2 | 180 | 10 | K,H,Y | Haber Ajansı L1 · R 2/3 |
| 5.6 | JSON: Nesne ↔ Metin | (1) `JsonSerializer.Serialize` / `Deserialize` kullanır; (2) record ve property adlarının JSON anahtarına etkisini görür; (3) bozuk JSON'da `JsonException`'ı yakalar | 5.5, 3.10 | Kampüs | T3 | 280 | 12 | K,H,Y | Haber Ajansı L1 · R 3/3 → Ruhsat · Sinema L4, Haber Ajansı L3 kapısı |
| 5.7 | Pattern Matching | (1) `is` ve `switch` ifadesiyle tür / değer örüntüsü eşler; (2) özellik ve ilişkisel örüntü (`> 5 and < 10`) yazar; (3) record çözümlemeyle yapıyı açar | 3.10, 1.8 | Kampüs | T3 | 280 | 12 | K,Ç,Y | Sinema L3 kapısı |
| 5.8 | Null Güvenliği | (1) `string?`, `?.`, `??` ve `??=` kullanır; (2) `NullReferenceException`'ın nedenini bulur; (3) nullable uyarılarını anlamlı biçimde giderir | 3.6, 5.7 | Kampüs | T3 | 280 | 10 | K,H,Y | Kampüs Sınavı provası |

### M6 — Finans I: Asenkron ve Ağ (Finans Bölgesi, T3, Usta Elif)

Sandbox'ta ağ yoktur; `HttpClient` dersleri sahte bir `HttpMessageHandler` ile çalışır (B7 ile hizalanır, Varsayımlar).

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 6.1 | async/await 1: Beklemeden Çalışmak | (1) senkron ile asenkron bekleme farkını anlatır; (2) `async Task` ve `await Task.Delay` yazar; (3) `async void` tuzağını tanır | Kampüs Sınavı; 4.2, 5.4 | Finans Bölgesi | T3 | 280 | 12 | K,Ç,H | Banka L1 · R 1/3 |
| 6.2 | async/await 2: Task<T> ve WhenAll | (1) `Task<T>` döndürür ve `await` ile değeri alır; (2) `Task.WhenAll` ile işleri birlikte başlatır; (3) asenkron kodda exception'ın `await` noktasında yakalandığını gösterir | 6.1, 3.13 | Finans Bölgesi | T3 | 280 | 13 | K,Ç,Y | Banka L1 · R 2/3 · Banka L4 kapısı |
| 6.3 | İşlem Kuyruğu ve lock | (1) `Queue<T>` + asenkron işleyici döngüsü kurar; (2) iki işlemin aynı bakiyeyi bozduğu yarış durumunu (race condition) gösterir; (3) `lock` ya da `SemaphoreSlim` ile kritik bölümü korur | 6.2, 5.1 | Finans Bölgesi | T3 | 280 | 13 | K,H,Y | Banka L1 · R 3/3 → Ruhsat · Otopark L5, Banka L2 kapısı |
| 6.4 | İptal ve Zaman Aşımı | (1) `CancellationToken` ile işi iptal eder; (2) `CancelAfter` ve `Task.WhenAny` ile zaman aşımı kurar; (3) iptalin `OperationCanceledException` olarak göründüğünü bilir | 6.2 | Finans Bölgesi | T3 | 280 | 11 | K,Ç,Y | Banka L3 kapısı |
| 6.5 | HttpClient: İstek Atmak | (1) `HttpClient` ile GET isteği atar, durum kodunu okur; (2) yanıtı `GetFromJsonAsync` ile nesneye çevirir; (3) `HttpClient`'ı her seferinde `new`'lememenin sebebini açıklar | 6.2, 5.6 | Finans Bölgesi | T3 | 280 | 12 | K,Ç,Y | Borsa Panosu L1 · R 1/3 |
| 6.6 | Veri Akışı: JSON Yanıtı ve Sayfalama | (1) sayfa sayfa gelen veriyi `while` + `await` ile toplar; (2) yanıtı nesne listesine çevirip süzer; (3) toplanan fiyat serisinde ortalama hesaplar | 6.5 | Finans Bölgesi | T3 | 280 | 13 | K,H,Y | Borsa Panosu L1 · R 2/3 |
| 6.7 | Dayanıklılık: Retry ve Backoff | (1) geçici hatada yeniden deneme (retry) döngüsü yazar; (2) üstel bekleme (backoff) ve en çok deneme sınırı koyar; (3) hangi hatanın tekrar denenmeye değer olduğunu ayırır | 6.6, 6.4 | Finans Bölgesi | T3 | 280 | 12 | K,H,Y | Borsa Panosu L1 · R 3/3 → Ruhsat · Borsa Panosu L2 kapısı |
| 6.8 | Zamanlayıcı ve Arka Plan İşi | (1) `PeriodicTimer` ile belirli aralıkla iş çalıştırır; (2) "saatlik kasa akışı"nı modeller ve son bilinen değeri önbelleğe alır; (3) devre kesici (circuit breaker) fikrini anlatır, arka plan işinde hata ve iptal yönetir | 6.4, 6.7 | Finans Bölgesi | T3 | 280 | 10 | K,Ç,Y | Borsa Panosu L3 kapısı |

### M7 — Finans II: Test, Kalıp, Git (Finans Bölgesi, T3, Usta Elif)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 7.1 | Birim Testi 1: İlk Test | (1) xUnit `[Fact]` ve `Assert.Equal` ile test yazar; (2) Arrange–Act–Assert düzenini kullanır; (3) kırmızı → yeşil döngüsünü izler | 3.13 | Finans Bölgesi | T3 | 280 | 12 | K,Ç,Y | Sigorta L1 · R 1/3 |
| 7.2 | Birim Testi 2: Theory ve Sınır Değerleri | (1) `[Theory]` ve `[InlineData]` ile tablo testi yazar; (2) sınır değerlerini (`n-1`, `n`, `n+1`) seçer; (3) `Assert.Throws` ile beklenen exception'ı sınar | 7.1 | Finans Bölgesi | T3 | 280 | 12 | K,H,Y | Sigorta L1 · R 2/3 · Sigorta L2 kapısı |
| 7.3 | Kural Motoru: Strategy | (1) kuralı `IRule` arayüzü arkasına koyar; (2) kural listesini sırayla uygulayan motor yazar; (3) yeni kural eklemenin motoru değiştirmediğini gösterir | 7.2, 3.11, 4.2 | Finans Bölgesi | T3 | 280 | 13 | K,Ç,Y | Sigorta L1 · R 3/3 → Ruhsat |
| 7.4 | Test Edilebilir Tasarım: Fake Bağımlılık | (1) bağımlılığı yapıcıdan arayüzle alır; (2) elle yazılmış fake ile testi dış dünyadan yalıtır; (3) kodun içinde nesne yaratmanın testi neden zorlaştırdığını söyler | 7.3 | Finans Bölgesi | T3 | 280 | 12 | K,H,Y | Sigorta L3 kapısı |
| 7.5 | Factory ve Decorator | (1) `Create` metodu ile nesne üretimini tek yere toplar; (2) Decorator ile fiyat / özellik katmanı ekler; (3) hangi kalıbın hangi problemi çözdüğünü ayırır | 7.3 | Finans Bölgesi | T3 | 280 | 12 | K,Ç,Y | — |
| 7.6 | Git 1: init, add, commit | (1) `git init`, `add`, `commit`, `log` ile geçmiş kurar; (2) çalışma ağacı – hazırlık – depo ayrımını anlatır; (3) iyi commit mesajı yazar | 1.12 | Finans Bölgesi | T3 | 280 | 11 | K,Ç,H | — |
| 7.7 | Git 2: branch ve merge | (1) `branch`, `switch`, `merge` ile paralel iş yürütür; (2) birleştirme çakışmasını okuyup çözer; (3) `.gitignore` ile derleme çıktısını dışarıda bırakır | 7.6 | Finans Bölgesi | T3 | 280 | 12 | K,Ç,H | Sigorta L4 kapısı · Lonca Projesi hazırlığı (v1.1–v2) |
| 7.8 | Finans Provası: Dayanıklı İşlem Hattı | (1) async, retry ve testi tek akışta birleştirir; (2) işlem hattını test edilebilir parçalara böler; (3) başarısızlık senaryolarını testle kanıtlar | 6.3, 6.7, 7.2, 7.3 | Finans Bölgesi | T3 | 280 | 12 | K,H,Y | Finans Sınavı provası |

### M8 — Veri Vadisi I: SQL ve EF Core (Veri Vadisi, T3, Usta Selin)

SQL dersleri sandbox'ta bellek içi SQLite ile çalışır (B7 ile hizalanır, Varsayımlar).

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 8.1 | İlişkisel Veri: SELECT ve WHERE | (1) tabloyu satır–sütun olarak okur; (2) `SELECT`, `WHERE`, `ORDER BY` yazar; (3) birincil anahtarın satırı tekil kıldığını söyler | Finans Sınavı; 4.5 | Veri Vadisi | T3 | 280 | 11 | K,Ç,Y | — |
| 8.2 | SQL: INSERT, UPDATE, GROUP BY | (1) `INSERT`, `UPDATE`, `DELETE`'i `WHERE` ile güvenle yazar; (2) `COUNT`, `SUM`, `GROUP BY` ile özet çıkarır; (3) `WHERE`siz `UPDATE`'in sonucunu tahmin eder | 8.1 | Veri Vadisi | T3 | 280 | 12 | K,H,Y | — |
| 8.3 | Anahtarlar ve JOIN | (1) yabancı anahtarla iki tabloyu bağlar; (2) `INNER JOIN` ile `LEFT JOIN` farkını sonuçtan okur; (3) tekrar eden veriyi tablolara bölmenin (normalleştirme) nedenini açıklar | 8.2 | Veri Vadisi | T3 | 280 | 12 | K,Ç,Y | — |
| 8.4 | EF Core 1: DbContext ve Entity | (1) entity sınıfını ve `DbContext`'i yazar; (2) `DbSet<T>` ile tabloyu koda bağlar; (3) bağlantıyı yapılandırır (bellek içi SQLite) | 8.3, 3.6 | Veri Vadisi | T3 | 280 | 12 | K,Ç,Y | Hastane Kayıt L1 · R 1/3 |
| 8.5 | EF Core 2: CRUD ve LINQ | (1) `Add`, `Remove`, `SaveChangesAsync` ile kaydı yönetir; (2) LINQ sorgusunun SQL'e çevrildiğini görür; (3) `FirstOrDefault` ile `Find` farkını söyler | 8.4, 4.5 | Veri Vadisi | T3 | 280 | 13 | K,H,Y | Hastane Kayıt L1 · R 2/3 |
| 8.6 | Migration | (1) `migrations add` ve `database update` akışını izler; (2) kod → migration → veritabanı zincirini anlatır; (3) eski veriyi koruyan şema değişikliği tasarlar | 8.5 | Veri Vadisi | T3 | 280 | 12 | K,H,Y | Hastane Kayıt L1 · R 3/3 → Ruhsat · Hastane Kayıt L3 kapısı |
| 8.7 | Kısıtlar ve Doğrulama | (1) `[Required]`, `[MaxLength]` ve benzersiz indeks ekler; (2) Fluent API ile aynı kuralı yazar; (3) kuralın hangi katmanda (kod mu veritabanı mı) korunacağını seçer | 8.6, 3.6 | Veri Vadisi | T3 | 280 | 12 | K,H,Y | — |

### M9 — Veri Vadisi II: İlişkiler ve Güvenli Veri (Veri Vadisi, T4, Usta Selin)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 9.1 | İlişkiler: Bire-çok ve Çoka-çok | (1) bire-çok ilişkiyi navigation property ile kurar; (2) çoka-çok ilişkiyi bağlantı tablosuyla çözer; (3) `Include` ile ilişkili veriyi yükler | 8.3, 8.5 | Veri Vadisi | T4 | 400 | 15 | K,Ç,Y | Otel L1 · R 1/3 · Hastane Kayıt L2, Otel L2 kapısı |
| 9.2 | Repository ve Unit of Work | (1) repository arayüzünü yazar, EF Core'u arkasına saklar; (2) Unit of Work ile değişiklikleri tek `SaveChanges`'ta toplar; (3) soyutlamanın testi kolaylaştırdığını gösterir | 9.1, 3.11 | Veri Vadisi | T4 | 400 | 14 | K,H,Y | Otel L1 · R 2/3 · Otel L3 kapısı |
| 9.3 | Transaction | (1) "hep ya da hiç" ilkesini (ACID) anlatır; (2) `BeginTransaction` / `Commit` / `Rollback` kullanır; (3) iki adımlı rezervasyonda yarım kalan işlemi geri alır | 8.6, 9.1 | Veri Vadisi | T4 | 400 | 14 | K,Ç,Y | Otel L1 · R 3/3 → Ruhsat |
| 9.4 | Eşzamanlılık Çakışması | (1) iyimser eşzamanlılık (`RowVersion`) mantığını anlatır; (2) `DbUpdateConcurrencyException`'ı yakalar; (3) aynı odayı iki kişinin almasını engelleyen tasarım seçer | 6.3, 9.3 | Veri Vadisi | T4 | 400 | 14 | K,H,Y | Otel L4 kapısı |
| 9.5 | Sorgu Performansı: N+1 | (1) N+1 sorgu problemini günlük çıktısından tanır; (2) `Include`, `AsNoTracking` ve projeksiyonla düzeltir; (3) indeksin okumayı hızlandırıp yazmayı yavaşlattığını söyler | 4.5, 9.1 | Veri Vadisi | T4 | 400 | 14 | K,H,Y | Hastane Kayıt L4 kapısı |
| 9.6 | Veri Güvenliği: Parametreli Sorgu | (1) SQL injection'ı bozuk bir sorguda gösterir; (2) parametreli sorgu ve EF Core'un güvenli yolunu seçer; (3) kişisel veriyi (KVKK) gereksiz saklamama ilkesini uygular | 8.2, 9.3 | Veri Vadisi | T4 | 400 | 13 | K,H,Y | — |
| 9.7 | Veri Vadisi Provası | (1) şema, EF Core ve transaction'ı tek senaryoda birleştirir; (2) yavaş ya da hatalı sorguyu tanılar; (3) veri katmanı tasarımını savunur | 9.2, 9.3, 9.5 | Veri Vadisi | T4 | 400 | 14 | K,H,Y | Veri Vadisi Sınavı provası |

### M10 — Bulut Tepesi I: Minimal API ve REST (Bulut Tepesi, T4, Usta Yusuf)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 10.1 | HTTP ve REST'e Giriş | (1) istek–yanıt, yöntem ve durum kodlarını okur; (2) kaynak adlandırma kuralını uygular (`/orders/12`); (3) JSON gövdeli bir isteği anlatır | Veri Vadisi Sınavı; 6.5 | Bulut Tepesi | T4 | 400 | 12 | K,Ç,H | — |
| 10.2 | İlk Minimal API | (1) `WebApplication.CreateBuilder` ve `MapGet` ile uç nokta yazar; (2) rota parametresi alır (`/orders/{id}`); (3) `Results.Ok` / `NotFound` döndürür | 10.1, 4.2 | Bulut Tepesi | T4 | 400 | 14 | K,Ç,Y | Yemek Sipariş Platformu L1 · R 1/3 |
| 10.3 | Kaynaklar ve Durum Kodları | (1) GET / POST / PUT / DELETE'i kaynak işlemlerine eşler; (2) 200, 201, 204, 400, 404 kodlarını doğru seçer; (3) güvenli ve idempotent yöntem farkını söyler | 10.2 | Bulut Tepesi | T4 | 400 | 15 | K,H,Y | Yemek Sipariş Platformu L1 · R 2/3 · Yemek Sipariş L2 kapısı |
| 10.4 | DTO ve Doğrulama | (1) entity yerine `record` DTO döndürür; (2) istek modelini doğrular ve 400 üretir; (3) aşırı veri paylaşımını (over-posting) önler | 10.3, 3.10 | Bulut Tepesi | T4 | 400 | 15 | K,Ç,Y | Yemek Sipariş Platformu L1 · R 3/3 → Ruhsat |
| 10.5 | API'ye Veri Bağlamak | (1) `DbContext`'i servis olarak kaydeder; (2) uç noktada EF Core sorgusu çalıştırır; (3) asenkron uç nokta yazar | 8.5, 10.4 | Bulut Tepesi | T4 | 400 | 14 | K,H,Y | — |
| 10.6 | Hata Yanıtları: ProblemDetails | (1) tutarlı hata gövdesi (`ProblemDetails`) döndürür; (2) global hata yakalayıcı kurar; (3) iç hatayı istemciye sızdırmaz | 3.13, 10.5 | Bulut Tepesi | T4 | 400 | 14 | K,H,Y | Yemek Sipariş L3 kapısı |
| 10.7 | API Testi | (1) `WebApplicationFactory` ile uç noktayı test eder; (2) başarılı ve hatalı yanıtı ayrı testle kanıtlar; (3) `.http` dosyasıyla elle deneme yapar | 7.2, 10.4 | Bulut Tepesi | T4 | 400 | 14 | K,Ç,Y | — |
| 10.8 | Sayfalama ve Sürümleme | (1) `skip` / `take` ile sayfalama yapar; (2) filtre ve sıralama parametresi ekler; (3) sürümlemenin (`/v1`) sözleşmeyi koruduğunu açıklar | 4.5, 10.5 | Bulut Tepesi | T4 | 400 | 14 | K,Ç,Y | — |

### M11 — Bulut Tepesi II: DI, Güvenlik, Gerçek Zamanlı (Bulut Tepesi, T4, Usta Yusuf)

| id | başlık | öğrenme hedefleri | ön koşul | semt | tier | XP | dk | soru tipi karışımı | bağlı işletme/seviye |
|---|---|---|---|---|---|---|---|---|---|
| 11.1 | Dependency Injection | (1) servisi arayüzle kaydeder, yapıcıdan alır; (2) Singleton / Scoped / Transient ömrünü seçer; (3) `new` yerine DI'nın testi kolaylaştırdığını gösterir | 3.11, 10.2 | Bulut Tepesi | T4 | 400 | 15 | K,Ç,Y | Şehir Uygulaması L1 · R 1/3 |
| 11.2 | Middleware | (1) istek hattını (pipeline) çizer; (2) özel middleware yazar; (3) sıranın sonucu değiştirdiğini gösterir | 11.1 | Bulut Tepesi | T4 | 400 | 14 | K,Ç,Y | Şehir Uygulaması L1 · R 2/3 |
| 11.3 | JWT ile Kimlik Doğrulama | (1) JWT'nin üç parçasını ve imzayı anlatır; (2) `AddAuthentication` + `RequireAuthorization` kurar; (3) token'ı doğrulamadan güvenmemenin nedenini söyler | 11.2 | Bulut Tepesi | T4 | 400 | 14 | K,H,Y | Şehir Uygulaması L1 · R 3/3 → Ruhsat · Şehir Uygulaması L2 kapısı |
| 11.4 | Yetkilendirme: Rol ve Politika | (1) kimlik doğrulama ile yetkilendirmeyi ayırır; (2) rol ve politika (`policy`) tanımlar; (3) kaynak sahipliğini (kendi siparişim) denetler | 11.3 | Bulut Tepesi | T4 | 400 | 14 | K,H,Y | — |
| 11.5 | Yapılandırma ve Sırlar | (1) `appsettings`, ortam değişkeni ve User Secrets'ı ayırır; (2) `IOptions<T>` ile ayar okur; (3) sırrı koda ve depoya yazmaz | 11.1 | Bulut Tepesi | T4 | 400 | 13 | K,Ç,H | Şehir Uygulaması L2 kapısı |
| 11.6 | SignalR: Canlı Pano | (1) `Hub` yazar, istemci–sunucu çağrısı kurar; (2) gruplara yayın yapar; (3) bağlantı kopmasını ele alır | 6.1, 11.2 | Bulut Tepesi | T4 | 400 | 15 | K,Ç,Y | Yemek Sipariş L4 kapısı |
| 11.7 | Dağıtım: publish ve Docker | (1) `dotnet publish` çıktısını okur; (2) Dockerfile ile imaj tanımlar; (3) ortam değişkeniyle ortamlar arası ayar taşır | 10.7, 11.5 | Bulut Tepesi | T4 | 400 | 13 | K,Ç,H | Şehir Uygulaması L3 kapısı |
| 11.8 | Şehir Uygulaması Provası | (1) DI, auth ve middleware'i tek uygulamada birleştirir; (2) katmanlı mimariyi (API–servis–veri) savunur; (3) güvenlik ve dayanıklılık kontrol listesi çıkarır | 11.3, 11.6, 11.7 | Bulut Tepesi | T4 | 400 | 14 | K,H,Y | Şehir Uygulaması L3 kapısı · Bulut Tepesi Sınavı provası |

### Görev Atlası (Çarşı ve Liman prova görevleri)

Her derste bir görev vardır. XP tier'a bağlıdır (60 / 100 / 160 / 250); Bayt, T1'de 50 / 60 / 80 deseninin tier çarpanıdır (×1, ×2, ×4, ×8; KANON §4). Ruhsat zincirinde tip merdiveni Sıralama → Tamamlama → Sıfırdan'dır; görevler AI'sız puanlanır.

| Ders | Görev | Tip | XP | Bayt | Ruhsat |
|---|---|---|---|---|---|
| 1.1 | Meydan Saati | Tamamlama | 60 | 40 | — (öğretici) |
| 1.2 | Dakikadan Saate | Sıralama + Tamamlama | 60 | 50 | Otopark 1/3 |
| 1.3 | Kademeli Karar | Tamamlama | 60 | 60 | Otopark 2/3 |
| 1.4 | Taksimetre | Sıfırdan | 60 | 80 | Otopark 3/3 → +100 B Belediye teşviki |
| 1.5 | Büfe Fişi | Sıralama | 60 | 50 | Büfe 1/3 |
| 1.6 | Bozukluk Sayacı | Tamamlama | 60 | 60 | Büfe 2/3 |
| 1.7 | Bozukluk Kasası | Sıfırdan | 60 | 80 | Büfe 3/3 → +100 B |
| 1.8 | Meyve Etiketi | Sıralama | 60 | 50 | Manav 1/3 |
| 1.9 | Toptan İndirim | Tamamlama | 60 | 60 | Manav 2/3 |
| 1.10 | Sepet Fişi | Sıfırdan | 60 | 80 | Manav 3/3 → +100 B |
| 1.11 | Fiş Hizası | Tamamlama | 60 | 60 | — |
| 1.12 | Yerelde Çalıştır | Tamamlama (CLI çıktısını okuma) | 60 | 40 | — |
| 2.1 | Abone Listesi | Tamamlama | 60 | 50 | Kargo Deposu 1/3 |
| 2.2 | Konteyner Sırası | Sıralama | 60 | 60 | Kargo Deposu 2/3 |
| 2.3 | Depo Sayımı | Sıfırdan | 60 | 80 | Kargo Deposu 3/3 → +100 B |
| 2.4 | Fiyat Panosu | Tamamlama | 60 | 50 | Balık Hali 1/3 |
| 2.5 | Hal Fiyatı | Tamamlama | 60 | 60 | Balık Hali 2/3 |
| 2.6 | Gelen Sipariş | Sıfırdan | 60 | 80 | Balık Hali 3/3 → +100 B |
| 2.7 | Paket Listesi | Tamamlama | 100 | 100 | Oto Yıkama 1/3 |
| 2.8 | Yıkama Fiyatı | Tamamlama | 100 | 120 | Oto Yıkama 2/3 |
| 2.9 | Hata Dosyası | Hata ayıklama (Tamamlama biçimi) | 100 | 160 | Oto Yıkama 3/3 → +100 B |
| 2.10 | Konteyner Bul | Tamamlama | 100 | 100 | Gümrük 1/3 |
| 2.11 | Sıra Numarası | Sıralama + Tamamlama | 100 | 120 | Gümrük 2/3 |
| 2.12 | Plaka Kontrol | Sıfırdan | 100 | 160 | Gümrük 3/3 → +100 B |

Çarşı görevleri toplam **710 B**, Liman görevleri **1.140 B** verir (Çarşı ortalaması 59 B; B2 §5.1 T1 aralığı 40–80 B ile uyumlu). Atölyeler ve sonrası görev adları B6 görev kataloğunda üretilir; tip ve ödül kuralı yukarıdaki gibidir.

---

## 4. Çarşı 1.1–1.4 tam içerik (prototip bu bölümü aynen kullanır)

Ses kuralı: Usta Defne sıcak ve benzetmecidir (kutu, etiket, tarif kartı, turnike, tabela, megafon); kart ≤60 kelime; emoji yok; "Aferin" günde en çok bir kez; hata dili "henüz değil; şu satıra bak". Rubrik Kurul JSON'unun üç ölçütüdür (Doğruluk 50 / Tamlık 30 / Açıklık 20); parantezdeki sayılar alt ölçüt puanlarıdır ve ölçüt toplamına eşittir. Çıktı Tahmini'nde gerekçesiz doğru değer en çok 40/100 alır. İyi cevap çapaları 90+, zayıf cevap çapaları 10–55 alır (kalibrasyon). Görev testleri `{id, girdi, beklenen, etiket}` biçimindedir; girdi, program başındaki değişken satırının değeridir. Tüm çıktılar `dotnet` ile doğrulanmıştır.

### 4.1 Ders 1.1 — Merhaba KodKent

T1 · 100 XP · 8 dk · ön koşul yok · soru karışımı K,Ç,H · görev: Meydan Saati. Kartlar 10 XP, sorular toplam 90 XP'ye kadar; Sev. 2 eşiği (80 XP) üçüncü soruda aşılır.

**Kartlar**

1. **Tahmin et** — "Önce oku, sonra çalıştır. Bu dört satır ekrana ne yazar? Çalıştırmadan tahmin et: kaç satır çıkar, hangi sözlerle? Yanılmak serbest. Tahminle sonuç ayrıldığı yerde öğrenme başlar." *Seçenekler:* A) `Merhaba KodKent!` / `Ben Misafir, 17 yaşındayım.` (doğru) · B) `Merhaba KodKent!` / `Ben {ad}, {yas} yaşındayım.` · C) tek satır: `Ben Misafir, 17 yaşındayım.`
2. **Çalıştır** — "Çalıştır'a bas. Ekran bir megafon gibi: `Console.WriteLine`'a verdiğin her söz şehre bir satır olarak duyurulur. Tahminin tuttu mu? Tutmadıysa sevin; neyi yanlış okuduğunu artık biliyorsun."
3. **İncele** — "Değişken, üstüne etiket yapıştırılmış bir kutudur. `string ad = "Misafir";` diyor ki: etiket `string` (metin tutar), kutunun adı `ad`, içindeki değer `"Misafir"`. `int yas = 17;` da aynı: etiket `int` (tam sayı tutar), ad `yas`, değer `17`. Etikete uymayan şey kutuya girmez."
4. **İncele** — "Tırnağın önündeki `$` işareti metni tarif kartına çevirir. Süslü parantezdeki `{ad}` boşluktur; KodKent çalışırken oraya kutunun değerini koyar. `$`'ı unutursan boşluk doldurulmaz ve parantez ekrana olduğu gibi çıkar."
5. **Değiştir** — "Kutunun içini değiştir. Yalnızca ilk satır açık: `"Misafir"` yerine kendi adını yaz, Çalıştır'a bas. Çıktın Meydan'daki LED panoda 10 saniye akacak; şehir seni ilk kez okuyacak."
6. **Yap** — "Meydan'daki saat panosu bozuldu, üç satırı eksik. Onu sıradaki görevde sen onaracaksın. Önce Kurul'un üç sorusu var; kendi cümlelerinle cevap ver. Rubrik her zaman cevap kutusunun üstünde, kurallar açık."

**Canlı örnek kod** (kartlar 1–2; çalışır)

```csharp
string ad = "Misafir";
int yas = 17;
Console.WriteLine("Merhaba KodKent!");
Console.WriteLine($"Ben {ad}, {yas} yaşındayım.");
```

Çıktı: `Merhaba KodKent!` ⏎ `Ben Misafir, 17 yaşındayım.`

**Dene (1 satır):** `string ad = "Misafir";` → `string ad = "Ece";` (Çalıştır → `Ben Ece, 17 yaşındayım.`).

**Usta soruları**

**S1 · Kavram Sorusu** — "`int yas = 17;` yazdın. `yas` ne, `17` ne, `int` ne? Kendi cümlelerinle anlat."
- Rubrik: Doğruluk 50 = `yas` kutunun adı / değişken (15) + `17` kutudaki değer (15) + `int` tam sayı tutan tür, etiket (20). Tamlık 30 = üç parçanın üçü de açıklandı (20) + türün neden önemli olduğu, yalnızca tam sayı girer (10). Açıklık 20 = kendi cümleleri ya da benzetme (10) + sıralı, anlaşılır (10).
- Anahtarlar: değişken, ad, değer, tür, tam sayı.
- İyi cevap (≈92): "`yas` kutunun adı, yani değişken. `17` kutunun içine koyduğum değer. `int` kutunun etiketi: bu kutuya yalnızca tam sayı girer, `"on yedi"` gibi yazı giremez. Tür bu yüzden önemli."
- Zayıf cevap (≈40): "`yas` yaşı gösterir, `17` bir sayı, `int` de bir şey." — `int` açıklanmamış, tür kavramı ve benzetme yok.

**S2 · Çıktı Tahmini** — `string ad = "Ece";` / `Console.WriteLine("Selam {ad}");` / `Console.WriteLine($"Selam {ad}");` — "Bu program ne yazdırır? İki satırın neden farklı olduğunu açıkla."
- Rubrik: Doğruluk 50 = 1. satır `Selam {ad}` (15) + 2. satır `Selam Ece` (15) + farkın nedeni `$` (20). Tamlık 30 = iki satırın gerekçesi ayrı ayrı (20) + `{ad}`'ın boşluk olarak doldurulduğu (10). Açıklık 20 = kısa ve ayrım net (20).
- Anahtarlar: `$`, interpolation, süslü parantez, düz metin.
- İyi cevap (≈92): "İlk satır `Selam {ad}` yazar, çünkü başında `$` yok; parantez düz metin sayılır. İkinci satırda `$` var, `{ad}` kutunun değeriyle dolar: `Selam Ece`."
- Zayıf cevap (≈15): "İkisi de `Selam Ece` yazar." — çıktı yanlış, `$`'ın rolü bilinmiyor.

**S3 · Hata Avı** — `int yas = "17";` / `Console.WriteLine(yas);` — "Derleyici bu programı reddediyor (CS0029). Hatalı satırı bul, nedenini tek cümleyle yaz ve düzelt."
- Rubrik: Doğruluk 50 = hatalı satır 1. satır (10) + neden: `int` kutusuna metin (`"17"`) girmez (25) + geçerli düzeltme (15). Tamlık 30 = tür–değer uyumsuzluğunu açıklar (15) + `int yas = 17;` ile `string yas = "17";` arasındaki seçimi söyler (15). Açıklık 20 = neden tek cümle (10) + düzeltilmiş satırı yazar (10).
- Anahtarlar: tür uyumsuzluğu, CS0029, tırnak = metin.
- İyi cevap (≈90): "Hata 1. satırda: `int` kutusuna tırnaklı, yani metin olan `"17"` konmuş. Sayı istiyorsam `int yas = 17;`, metin kalacaksa `string yas = "17";` yazarım."
- Zayıf cevap (≈20): "`Console.WriteLine` yanlış yazılmış." — hata yanlış satıra bağlanmış, neden yok.

**Ders özeti.** `Console.WriteLine` ekrana bir satır duyurur. Değişken = tür (etiket) + ad + değer. `$"...{ad}..."` kutunun değerini metne yerleştirir; `$` unutulursa parantez düz metin kalır.

**Prova görevi: Meydan Saati** (Tamamlama · +60 XP · +40 B · öğretici, Ruhsat parçası yok)

Görev metni: "Derleyici Meydanı'ndaki saat panosu bozuldu; ekranda `Saat 14:05` yazmalı. Üç satırı tamamla: `saat` adlı `int` değişken (14), `dakika` adlı `string` değişken (`"05"`), sonra `$"..."` ile yazdır." Defne: "Dakikayı neden `string` yaptık? `int` olsaydı baştaki sıfır kaybolur, panoda `14:5` görürdün."

```csharp
// Meydan Saati — üç satırı tamamla
// 1) saat: int, değeri 14
// 2) dakika: string, değeri "05"
// 3) $"..." ile  Saat 14:05  yazdır
```

| id | girdi | beklenen | etiket |
|---|---|---|---|
| t1 | — | derleme hatasız | Derleme |
| t2 | — | çıktı `Saat 14:05` | Çıktı |
| t3 | — | kaynakta `int saat`, `string dakika` ve `$"` var; `Saat 14:05` düz metin olarak yazılmamış | Değişken kullanımı |

Beklenen çıktı: `Saat 14:05`. Referans çözüm: `int saat = 14;` / `string dakika = "05";` / `Console.WriteLine($"Saat {saat}:{dakika}");`. Satır sonunda `;` unutulursa Türkçe hata tablosu CS1002'yi "satır sonunda `;` eksik" diye çevirir.

### 4.2 Ders 1.2 — Sayılar ve Yuvarlama

T1 · 100 XP · 8 dk · ön koşul 1.1 · soru karışımı K,Ç,H · görev: Dakikadan Saate (Ruhsat 1/3).

**Kartlar**

1. **Tahmin et** — "130 dakika kalan araç için bu program ne yazar? Üç sayıyı tahmin et: tam saat, artan dakika, başlayan saat. Sonuncuya dikkat; Otopark'ın kasası orada gizli." *Seçenekler:* A) `2 saat 10 dk; başlayan saat: 2` · B) `2 saat 10 dk; başlayan saat: 3` (doğru) · C) `3 saat 10 dk; başlayan saat: 3`
2. **Çalıştır** — "Çalıştır'a bas: `2 saat 10 dk; başlayan saat: 3`. Üçüncü sayıyı tutturduysan harika. Tutturamadıysan şaşırma; sıradaki iki kart pastayı nasıl kestiğimizi gösterecek."
3. **İncele** — "İki `int`'i bölünce sonuç da `int` olur ve kalan yuvarlanmaz, kesilir: `130 / 60` iki eder. Pastayı dilimlerken artan kırıntıyı `%` verir: `130 % 60` on. Ondalıklı sonuç istiyorsan en az bir tarafı `60.0` yaz."
4. **İncele** — "Yukarı yuvarlamanın tarifi: bölmeden önce 59 ekle. `(130 + 59) / 60` = 189 / 60 = 3. 120 için `179 / 60` = 2: tam iki saat, üçüncü saat başlamadı. Kırıntı bir dakika bile olsa kasa yeni saati yazar."
5. **Değiştir** — "`dakika` değerini önce 61, sonra 120 yap. Çalıştırmadan tahmin et: başlayan saat kaç olacak? Sonra bas ve tahminini sına."
6. **Yap** — "Dakikadan Saate görevinde karışık satırları doğru sıraya dizeceksin. Hasan Abi'nin otoparkı bu hesapla başlıyor; ücret sistemi bu parçasız çalışmaz."

**Canlı örnek kod**

```csharp
int dakika = 130;
int tamSaat = dakika / 60;              // 2  (kalan kesilir)
int artanDk = dakika % 60;              // 10 (kalan)
int baslayanSaat = (dakika + 59) / 60;  // 3  (başlayan saat)
Console.WriteLine($"{tamSaat} saat {artanDk} dk; başlayan saat: {baslayanSaat}");
```

Çıktı: `2 saat 10 dk; başlayan saat: 3`

**Dene (1 satır):** `int dakika = 130;` → `int dakika = 61;` (başlayan saat: 2).

**Usta soruları**

**S1 · Kavram Sorusu** — "`(dakika + 59) / 60` neden başlayan saati verir? 61 ve 120 dakika için kendi cümlelerinle göster."
- Rubrik: Doğruluk 50 = bölmeden önce 59 eklemek kalan 1–59 dakikayı sonraki saate taşır (20) + 61 → 120 / 60 = 2 (15) + 120 → 179 / 60 = 2 (15). Tamlık 30 = tam saatte artmadığını gerekçelendirir (15) + tam sayı bölmesinin kesmesine dayandığını söyler (15). Açıklık 20 = örnekli anlatım (10) + sıralı, anlaşılır (10).
- Anahtarlar: tam sayı bölmesi, +59, başlayan saat, kesme.
- İyi cevap (≈92): "Bölmeden önce 59 eklersem bir dakikalık fazlalık bile sonraki saate geçer: 61 → 120 / 60 = 2. 120 → 179 / 60 = 2, çünkü tam iki saat; üçüncü başlamadı. Tam sayı bölmesi küsuratı attığı için çalışır."
- Zayıf cevap (≈40): "59 ekleyince yukarı yuvarlıyor." — özet doğru ama örnek ve neden yok.

**S2 · Çıktı Tahmini** — `int x = 7;` / `int y = 2;` / `Console.WriteLine(x / y);` — "Ne yazdırır, neden?"
- Rubrik: Doğruluk 50 = değer `3` (20) + iki `int`'in bölümü `int` olur (15) + ondalık kısım yuvarlanmaz, atılır (15). Tamlık 30 = `7.0 / 2` olsaydı `3.5` çıkacağını söyler (15) + "kesme ≠ yuvarlama" ya da `x % y` = 1 örneği (15). Açıklık 20 = kısa, nedenli (10) + doğru terim (10).
- Anahtarlar: tam sayı bölmesi, `int`, kesme, `double`.
- İyi cevap (≈93): "`3` yazar. İki `int`'i bölünce sonuç da `int` olur; 3,5'in ondalık kısmı yuvarlanmaz, atılır. `7.0 / 2` yazsaydım bir taraf `double` olacağı için `3.5` çıkardı."
- Zayıf cevap (≈55): "3 yazar, çünkü yuvarlıyor." — değer doğru, kavram yanılgısı (yuvarlasa 4 olurdu).

**S3 · Hata Avı** — `int dakika = 150;` / `double saat = dakika / 60;` / `Console.WriteLine(saat);` — "Ekranda `2.5` beklerken `2` yazıyor. Hatayı bul, nedenini yaz, düzelt."
- Rubrik: Doğruluk 50 = hatalı satır `double saat = dakika / 60;` (10) + bölme `int / int`, `double`'a atamadan önce kesilir (25) + düzeltme `60.0` ya da `(double)dakika / 60` (15). Tamlık 30 = `double` kutu yazmanın bölmeyi değiştirmediğini söyler (15) + beklenen–gerçek farkını (2.5 / 2) açıklar (15). Açıklık 20 = tek net neden (10) + düzeltilmiş satır (10).
- Anahtarlar: tam sayı bölmesi, `double`, `60.0`, atama sırası.
- İyi cevap (≈90): "Hata ikinci satırda. `dakika / 60` iki `int`'i böldüğü için sonuç `2` olarak kesiliyor; sonra bu `2`, `double` kutusuna giriyor. Bir tarafı `60.0` yaparsam `2.5` çıkar."
- Zayıf cevap (≈20): "`double` yerine `int` yazmalıydım." — yanlış teşhis, bölmenin kesmesi görülmemiş.

**Ders özeti.** `int / int` kalanı keser, `%` kalanı verir. Ondalık sonuç için bir taraf `double` ya da `decimal` olmalı. Başlayan saat: `(dakika + 59) / 60`.

**Prova görevi: Dakikadan Saate** (Sıralama + Tamamlama · +60 XP · +50 B · Ruhsat 1/3)

Görev metni: "Hasan Abi'nin pano sistemi dakikayı **başlayan saate** çevirmeli. Önce karışmış satırları sırala (iki çeldirici var), sonra eksik sayıyı yaz."

- Doğru sıra: `int dakika = 130;` → `int baslayanSaat = (dakika + 59) / 60;` → `Console.WriteLine(baslayanSaat);`
- Çeldiriciler: `int baslayanSaat = dakika / 60 + 1;` (tam 120 dakikada 3 verir, yanlış) ve `double baslayanSaat = dakika / 60;`.
- Tamamlama: `int baslayanSaat = (dakika + ___) / 60;` → `59`.

| id | girdi (`dakika`) | beklenen | etiket |
|---|---|---|---|
| t1 | 30 | `1` | Başlayan 1. saat |
| t2 | 61 | `2` | Başlayan 2. saat |
| t3 | 120 | `2` | Tam 2 saat, 3. başlamadı |

Beklenen çıktı: tek satır, sayı. Defne: "`dakika / 60 + 1` neden olmaz? Tam 120 dakikada 3 yazar, oysa tam 2 saat."

### 4.3 Ders 1.3 — Kararlar

T1 · 100 XP · 8 dk · ön koşul 1.2 · soru karışımı K,Ç,H · görev: Kademeli Karar (Ruhsat 2/3).

**Kartlar**

1. **Tahmin et** — "Sinema gişesi: 12 yaş altı çocuk, 65 yaş altı tam bilet, gerisi yaşlı bileti. `yas` 12 iken hangi söz çıkar? Tahminini sınır değerine bakarak yap." *Seçenekler:* A) `Çocuk` · B) `Tam` (doğru) · C) `Yaşlı`
2. **Çalıştır** — "Çalıştır: `Tam`. Şaşırdıysan tam yerindesin. `yas < 12`, on iki için yanlış, çünkü `<` sınırın kendisini dışarıda bırakır. Gişe turnikesi 12'yi çocuk saymadı."
3. **İncele** — "`if / else if / else` bir turnike dizisidir: koşullara yukarıdan aşağı sorulur, ilk 'evet' geçirir, kalanlara hiç bakılmaz. Sıra bu yüzden önemli. `==` karşılaştırır, `=` atar; ikisini karıştırma."
4. **İncele** — "`&&` 'hem şu hem bu', `||` 'şu ya da bu' demek. `yas >= 12 && yas < 65` yetişkin aralığını tam çizer. `<` mi `<=` mi diye müşteriye sormak, kodu sonradan onarmaktan ucuzdur."
5. **Değiştir** — "`yas` değerini 11, 12, 64, 65 yap. Her biri için önce tahmin et, sonra çalıştır. Hatalar sınır değerlerinde saklanır; iyi programcı önce oraları yoklar."
6. **Yap** — "Kademeli Karar görevinde bilet fiyatını üç kademeye bölen boşlukları dolduracaksın. Aynı şema, Otopark'ın üç tarife diliminde de karşına çıkacak."

**Canlı örnek kod**

```csharp
int yas = 12;
if (yas < 12)
    Console.WriteLine("Çocuk");
else if (yas < 65)
    Console.WriteLine("Tam");
else
    Console.WriteLine("Yaşlı");
```

Çıktı: `Tam`

**Dene (1 satır):** `int yas = 12;` → `int yas = 11;` (`Çocuk`).

**Usta soruları**

**S1 · Kavram Sorusu** — "`yas < 12` ile `yas <= 12` arasındaki fark nedir? 12 yaşındaki biri için hangisinde hangi dal çalışır? Sınır değerini müşteriyle neden konuşmak gerekir?"
- Rubrik: Doğruluk 50 = `<` sınırı dışarıda bırakır, `<=` içeri alır (25) + 12 için `<` yanlış, `<=` doğru (25). Tamlık 30 = sınırın hangi kademeye ait olduğunun iş kuralı olduğunu söyler (15) + sınır değerini test etmeyi önerir (15). Açıklık 20 = 12 örneğiyle anlatır (10) + sıralı, anlaşılır (10).
- Anahtarlar: sınır değeri, `<` / `<=`, kademe, iş kuralı.
- İyi cevap (≈92): "`<` 12'yi saymaz, `<=` sayar. 12 yaşındaki biri için `yas < 12` yanlış kalır, çocuk dalına girmez; `<=` ile girer. Hangisinin doğru olduğu müşterinin kuralı; sormazsam yanlış kademede bilet satarım, bu yüzden 11, 12, 13'ü test ederim."
- Zayıf cevap (≈35): "Biri küçük, biri küçük eşit." — tanım var, 12 örneği ve sonuç yok.

**S2 · Çıktı Tahmini** — `int puan = 85;` / `if (puan >= 50) Console.WriteLine("Geçti");` / `else if (puan >= 85) Console.WriteLine("Parlak");` / `else Console.WriteLine("Kaldı");` — "Ne yazdırır? `Parlak` neden hiç yazılmıyor?"
- Rubrik: Doğruluk 50 = çıktı `Geçti` (20) + ilk doğru koşul çalışır, kalanlar atlanır (30). Tamlık 30 = `Parlak` dalına hiç ulaşılmadığını söyler (15) + düzeltme: dar koşulu (`>= 85`) öne al (15). Açıklık 20 = nedenli anlatım (10) + doğru terim: koşul, dal (10).
- Anahtarlar: sıra, ilk doğru koşul, `else if`, erişilemeyen dal.
- İyi cevap (≈92): "`Geçti` yazar. `puan >= 50` doğru olduğu için zincir orada biter, `else if` hiç denenmez. `Parlak` hiçbir zaman çıkmaz; `>= 85` koşulunu en üste almak gerekir."
- Zayıf cevap (≈20): "`Parlak` yazar, çünkü 85 en büyük." — koşulların sırası ve ilk doğru dal görülmemiş.

**S3 · Hata Avı** — `int yas = 18;` / `if (yas = 18)` / `{ Console.WriteLine("Reşit"); }` — "Derleyici CS0029 veriyor. Hatayı bul, nedenini yaz, düzelt."
- Rubrik: Doğruluk 50 = hatalı satır `if (yas = 18)` (10) + `=` atar, `==` karşılaştırır (25) + düzeltme `yas == 18` ya da `yas >= 18` (15). Tamlık 30 = `if` `bool` bekler, atama `int` üretir (15) + iki işaretin farkını örnekler (15). Açıklık 20 = tek net neden (10) + düzeltilmiş satır (10).
- Anahtarlar: atama, karşılaştırma, `bool`, CS0029.
- İyi cevap (≈90): "`if (yas = 18)` satırında `=` atama yapar ve geriye `int` verir; `if` ise `true` ya da `false` ister. Karşılaştırmak için `yas == 18` yazılır."
- Zayıf cevap (≈10): "Parantez fazla." — yanlış teşhis.

**Ders özeti.** Koşullar yukarıdan aşağı sorulur, ilk doğru dal çalışır. `=` atar, `==` karşılaştırır. Sınır değerinde `<` / `<=` bir iş kuralıdır; müşteriye sor, testle yokla.

**Prova görevi: Kademeli Karar** (Tamamlama · +60 XP · +60 B · Ruhsat 2/3)

Görev metni: "Sinema bileti üç kademeli: 12 yaş altı 40 TL, 12–64 yaş 70 TL, 65 ve üstü 50 TL. Üç boşluğu doldur."

```csharp
int yas = 30;
int fiyat = 0;
if (yas < 12)
{
    fiyat = ___;
}
else if (___)
{
    fiyat = 70;
}
else
{
    fiyat = ___;
}
Console.WriteLine(fiyat);
```

Çözüm: `40`, `yas < 65`, `50`.

| id | girdi (`yas`) | beklenen | etiket |
|---|---|---|---|
| t1 | 8 | `40` | Çocuk kademesi |
| t2 | 12 | `70` | Alt sınır tam kademeye girer |
| t3 | 65 | `50` | Üst sınır yaşlı kademesine girer |

Beklenen çıktı: tek satır, fiyat. Defne: "Üç kademeyi üç turnike say; 12 ve 65, turnikenin kapı eşiği."

### 4.4 Ders 1.4 — Fonksiyon Sözleşmesi

T1 · 100 XP · 8 dk · ön koşul 1.3 · soru karışımı K,Ç,H · görev: Taksimetre (Ruhsat 3/3 → +100 B Belediye teşviki → Tapu).

**Kartlar**

1. **Tahmin et** — "`Kare` bir tarif kartı: içine bir sayı verirsin, karesini geri alırsın. `Hesap.Kare(5)` ekrana ne yazar? Sınıf ve `static` sözlerini şimdilik tabela say; asıl iş içeride." *Seçenekler:* A) `10` · B) `25` (doğru) · C) `55`
2. **Çalıştır** — "Çalıştır: `25`. Metodu çağırdın, `5` malzeme olarak girdi, `return` ile `25` tabağa konup sana geri geldi. Çağrı artık bir sayı gibi: yazdırabilir, toplayabilir, çarpabilirsin."
3. **İncele** — "İmza dükkânın tabelasıdır: `public static int Kare(int x)`. Baştaki `int` geri vereceğin tür, `Kare` tarifin adı, `int x` istenen malzeme. Tabela ne diyorsa o: yanlış malzemeyle çağırırsan derleyici kapıdan çevirir."
4. **İncele** — "Sözleşme: imza ne istediğini ve ne vereceğini söyler, sen ona uyarsın. `return` değeri teslim eder; `Console.WriteLine` yalnızca ekrana yazar. Yazdırmak vitrine bakmaktır, geri vermek malı teslim almak."
5. **Değiştir** — "`return x * x;` satırını `return x * x * x;` yap. Çalıştırmadan tahmin et: `Kare(5)` şimdi kaç verir? Adı yalan söylemeye başladı; iyi isim de sözleşmenin parçasıdır."
6. **Yap** — "Taksimetre görevinde imzayı ben veriyorum, gövdeyi sen yazacaksın: kilometreyi alıp ücreti geri verecek. İlk sıfırdan kodun; ama dört parçayı biliyorsun: `if`, aritmetik, `return`, imza."

**Canlı örnek kod**

```csharp
Console.WriteLine(Hesap.Kare(5));

public static class Hesap
{
    public static int Kare(int x)
    {
        return x * x;
    }
}
```

Çıktı: `25`

**Dene (1 satır):** `return x * x;` → `return x * x * x;` (`125`).

**Usta soruları**

**S1 · Kavram Sorusu** — "`public static int TaksiUcreti(int km)` imzasındaki parçalar ne iş yapar? 'Sözleşme' derken ne kastediyoruz?"
- Rubrik: Doğruluk 50 = `int km` metoda verilen girdi, parametre (15) + baştaki `int` geri verilen değerin türü (15) + `TaksiUcreti` metodun adı (10) + sözleşme = imzanın ve kuralın vaadi (10). Tamlık 30 = `return` ile değer geri verilir (10) + girdi kuralı (ör. `km` ≥ 0) sözleşmenin parçasıdır (20). Açıklık 20 = parçaları tek tek anlatır (10) + doğru terimler (10).
- Anahtarlar: parametre, dönüş türü, imza, `return`, sözleşme.
- İyi cevap (≈92): "`int km` metodun aldığı girdi, yani parametre. Baştaki `int` geri verdiği değerin türü; `return` ile verir. `TaksiUcreti` adı. Sözleşme: imzaya ve kurala (km ≥ 0) uyarsam metot ücreti tam sayı olarak verir."
- Zayıf cevap (≈30): "İmza metodun adı ve parantezli kısmı." — parçalar açıklanmamış, sözleşme yok.

**S2 · Çıktı Tahmini** — `Console.WriteLine(Topla(2, 3) * 10);` / `static int Topla(int a, int b) { return a + b; }` — "Ne yazdırır? Adım adım anlat."
- Rubrik: Doğruluk 50 = çıktı `50` (20) + `Topla(2, 3)` `5` döndürür (15) + sonra 10 ile çarpılır (15). Tamlık 30 = çağrının bir değere dönüşüp ifadede kullanıldığını söyler (15) + parametre sırası a = 2, b = 3 (15). Açıklık 20 = adımlı anlatım (10) + doğru terim (10).
- Anahtarlar: çağrı, dönüş değeri, `return`, parametre.
- İyi cevap (≈92): "`50` yazar. Önce `Topla(2, 3)` çalışır ve `return` ile `5` geri verir; bu `5` artık bir sayı gibi `10` ile çarpılır: 50."
- Zayıf cevap (≈25): "5 yazar, çünkü `Topla` 5 veriyor." — çarpma adımı atlanmış, çağrının değer olduğu görülmemiş.

**S3 · Hata Avı** — `public static class Hesap { public static int Yari(int x) { Console.WriteLine(x / 2); } }` — "Derleyici CS0161 diyor. Sorun ne? Düzelt."
- Rubrik: Doğruluk 50 = `return` yok (15) + imza `int` vaat ediyor ama gövde değer vermiyor (20) + düzeltme `return x / 2;` (15). Tamlık 30 = yazdırmak ≠ geri vermek (15) + yalnız yazdırılacaksa dönüş türü `void` olur (15). Açıklık 20 = tek net neden (10) + düzeltilmiş satır (10).
- Anahtarlar: `return`, dönüş türü, `void`, CS0161.
- İyi cevap (≈92): "Metot `int` döndüreceğini söylüyor ama `Console.WriteLine` yalnızca ekrana yazıyor, hiçbir değer geri vermiyor. `return x / 2;` yazmalıyım; yalnızca yazdırmak istiyorsam dönüş türü `void` olmalı."
- Zayıf cevap (≈15): "`x / 2` yanlış." — hata hesapta aranmış, imza–gövde uyumsuzluğu görülmemiş.

**Ders özeti.** İmza = dönüş türü + ad + parametreler; metodun sözleşmesidir. `return` değeri geri verir, `Console.WriteLine` yalnızca yazar. Sözleşmeye uyan metot, çağıranın beklediği türü verir.

**Prova görevi: Taksimetre** (Sıfırdan · +60 XP · +80 B · Ruhsat 3/3 → +100 B Belediye teşviki)

Görev metni: "Taksimetre imzası hazır; gövdeyi sen yaz. Açılış ücreti 40 TL, her kilometre 15 TL. Hiç yol gitmeyen (0 km) yolcu ödemez."

```csharp
public static class Taksimetre
{
    // km: gidilen yol (0 veya daha büyük, tam sayı)
    // dönüş: ödenecek ücret, TL (tam sayı)
    public static int TaksiUcreti(int km)
    {
        // kodun buraya
    }
}
```

Referans çözüm (yalnızca sunucuda): `if (km <= 0) return 0;` / `return 40 + km * 15;`

| id | girdi (`km`) | beklenen | etiket |
|---|---|---|---|
| t1 | 0 | `0` | Binmeyen yolcu ödemez |
| t2 | 1 | `55` | Açılış + 1 km |
| t3 | 10 | `190` | 40 + 10 × 15 |

Beklenen çıktı: metodun dönüş değeri testlerdeki gibi. Üç test yeşil olunca Ruhsat 3/3 tamamlanır; cüzdan 10 + 50 + 60 + 80 + 100 = **300 B**, "Satılık Otopark" tabelası yanar (VİZYON §4). Defne: "İmza Otopark'ta da aynı: `UcretHesapla(int dakika)`. Kapıdaki tabela hazır, sıra içeride."

---

## 5. Liman 2.1–2.12 ders kartı özetleri

Usta Kerem pratik ve hızlıdır, liman jargonuyla konuşur ("Liste bir konteyner dizisi; `foreach` vinç."). Kart akışı her derste Tahmin et → Çalıştır → İncele → Değiştir → Yap'tır; aşağıda her adım tek satırdadır. Başlık, hedef, süre ve XP §3 M2 tablosundadır; 2.1–2.6 T1, 2.7–2.12 T2'dir (B2 §13). Y sorularında sandbox 3 açık + 2 gizli test koşar.

| Ders | Kart akışı | Usta soruları (S1 · S2 · S3) | Hedeflenen kavram yanılgısı | Görev (tip · XP · Bayt · Ruhsat) |
|---|---|---|---|---|
| 2.1 Liste Kur | Tahmin: üç `Add` sonrası `Count` ve `[0]` · Çalıştır · İncele: `List<string>` numaralı konteyner dizisi, `Contains` · Değiştir: kendi plakanı ekle · Yap | K: liste ile tek değişkenin farkı · Ç: `Add` / `Remove` / `Count` sonrası değerler · Y: `AboneMi(List<string>, string)` | İndeks 1'den başlar; liste sabit boyutludur | Abone Listesi · Tamamlama · 60 · 50 · Kargo 1/3 |
| 2.2 Diziler ve İndeks | Tahmin: `kasa[5]` · Çalıştır: kırmızı `IndexOutOfRangeException` · İncele: boyut sabit, indeks 0..`Length`−1 · Değiştir: `Length - 1` · Yap | K: dizi ile listenin farkı (sabit boyut) · H: `i <= dizi.Length` (bir fazla) · Y: `EnBuyuk(int[])` | Son indeks `Length`'tir | Konteyner Sırası · Sıralama · 60 · 60 · Kargo 2/3 |
| 2.3 foreach ve Envanter Sayımı | Tahmin: `foreach` toplamı · Çalıştır · İncele: toplayıcı, sayaç, en büyük kalıpları · Değiştir: `if` ile koşullu sayım · Yap | K: `for` yerine `foreach` ne zaman · Ç: koşullu sayımın izlenmesi · Y: `ToplamAdet(List<int>)` | `foreach` değişkenine atayarak listeyi değiştirebilirim | Depo Sayımı · Sıfırdan · 60 · 80 · Kargo 3/3 |
| 2.4 Sözlük: Dictionary | Tahmin: `fiyat["hamsi"]` · Çalıştır · İncele: anahtar benzersiz, sıra yok, `KeyNotFoundException` · Değiştir: yeni ürün ekle · Yap | K: liste yerine sözlük ne zaman · Ç: aynı anahtarı iki kez yazmanın sonucu · Y: `Fiyat(Dictionary<string, decimal>, string)` | Anahtar tekrar edebilir; sözlükte sıra vardır | Fiyat Panosu · Tamamlama · 60 · 50 · Balık Hali 1/3 |
| 2.5 Sözlükle Fiyat Listesi | Tahmin: olmayan anahtar · Çalıştır · İncele: `TryGetValue` kalıbı, adet sayma · Değiştir: anahtarı yanlış yaz · Yap | K: neden `TryGetValue` · Ç: frekans sayımının sonucu · Y: `KelimeSay(string[])` | Olmayan anahtar `0` ya da `null` döner | Hal Fiyatı · Tamamlama · 60 · 60 · Balık Hali 2/3 |
| 2.6 Metni Böl | Tahmin: `"a:1;b:2".Split(';')` kaç eleman · Çalıştır · İncele: `Split`, `int.Parse`, `TryParse` (kalıp olarak) · Değiştir: bozuk sayı ekle · Yap | K: neden `TryParse` · H: `int.Parse("12a")` hatası · Y: `SiparisToplami(string)` | `Split` sayı üretir; boşluklar kendiliğinden temizlenir | Gelen Sipariş · Sıfırdan · 60 · 80 · Balık Hali 3/3 |
| 2.7 Liste Kalıpları | Tahmin: `RemoveAt` sonrası indeksler · Çalıştır · İncele: filtre / say / topla, döngüde silme tuzağı · Değiştir: ters döngü · Yap | K: filtre / say / topla kalıbı ne zaman · Ç: `Insert` / `RemoveAt` sonrası liste · Y: `PahaliyiSil(List<int>, int)` | Silince indeksler kaymaz | Paket Listesi · Tamamlama · 100 · 100 · Oto Yıkama 1/3 |
| 2.8 Paket ve Ek Hizmet | Tahmin: paket + ek hizmet toplamı · Çalıştır · İncele: `switch` ile paket fiyatı, listeyi metoda vermek = aynı listeyi göstermek · Değiştir: ek hizmet ekle · Yap | K: kademeli şema neden "aynı şema, 3. yüzey" · Ç: metot içi `Add`'in dışarıdaki etkisi · Y: `YikamaFiyati(string, List<string>)` | Metoda verilen liste kopyalanır | Yıkama Fiyatı · Tamamlama · 100 · 120 · Oto Yıkama 2/3 |
| 2.9 Hata Ayıklama Temelleri | Tahmin: hatalı kodun çıktısı · Çalıştır: izleme çıktısı · İncele: üç hata türü, breakpoint, adım adım ("Hatayı aramayacaksın, daraltacaksın.") · Değiştir: izleme satırı koy · Yap | K: üç hata türü ve ilk adım · H: derleme hatası (CS kodu) · H: mantık hatası | Hata hep son yazdığım satırdadır; derleyici mantık hatasını da yakalar | Hata Dosyası · Hata ayıklama · 100 · 160 · Oto Yıkama 3/3 |
| 2.10 Arama | Tahmin: sırasız listede en kötü adım sayısı · Çalıştır · İncele: doğrusal arama, `IndexOf` bulamazsa `-1`, ikili arama sıralı ister · Değiştir: `-1` denetimi · Yap | K: ikili arama neden hızlı · Ç: `IndexOf` sonuçları · Y: `KonteynerBul(List<string>, string)` | Bulamazsa `0` döner ya da hata fırlatır | Konteyner Bul · Tamamlama · 100 · 100 · Gümrük 1/3 |
| 2.11 Sıralama | Tahmin: `Sort` sonrası liste · Çalıştır · İncele: `Sort`, `CompareTo`, seçme sıralaması adım adım · Değiştir: azalan sırala · Yap | K: sıralama aramayı neden hızlandırır · Ç: seçme sıralamasının 2. adımından sonra dizi · Y: `EnPahali3(List<int>)` | `Sort` yeni liste döndürür | Sıra Numarası · Sıralama + Tamamlama · 100 · 120 · Gümrük 2/3 |
| 2.12 Plaka Doğrulama | Tahmin: `"34ABC123"` hangi karakterler rakam · Çalıştır · İncele: `char.IsDigit` / `IsLetter`, uzunluk ve konum kuralı, boş girdi ("Gümrükte kimlik kontrolü gibi.") · Değiştir: küçük harfi `ToUpper` ile kabul et · Yap | K: neden önce boş / uzunluk denetimi · H: indeks sınırını aşan doğrulama · Y: `PlakaGecerliMi(string)` | Girdi hep düzgün gelir | Plaka Kontrol · Sıfırdan · 100 · 160 · Gümrük 3/3 |

**Ders içi AI yükü (M2):** 36 sorunun 11'i Y; AI ağırlığı ders başına 1,54 (§11).

---

## 6. Ders Mührü ve Telafi Turu

| Kural | Değer | Kaynak |
|---|---|---|
| Soru sayısı | 3 Usta sorusu (S1–S3) | KANON §10 |
| Mühür | 3 sorudan 2'si ≥70; soru puanı = iki denemenin yükseği | KANON §9, B2 §4.2 |
| Deneme | Soru başına 2; 2. deneme %80 XP; Usta takip sorusu en çok +10 | KANON §9 |
| Puan < 40 | Usta ilgili kartı yeniden açmayı önerir; XP kaybı yok | KANON §9 |
| Telafi Turu | Mühür alınamazsa 10 dk sonra; aynı kavram, **farklı 3 soru**; sınırsız | KANON §10 |
| XP tavanı | Ders toplamı 118 / 204 / 312 / 442'yi aşamaz; Telafi mühür içindir, XP için değil | B2 §4.3 |
| Kota | Günde 30 AI puanlaması; dolunca cevap kaydedilir, gece Batch ile puanlanır, mühür sabah düşer (ders kilitlenmez) | KANON §9 |
| Kilit | Mühür prova görevini açar; kartlar mühürden sonra da gezilebilir | VİZYON §6 |

**Durumlar.** `Kartlar → S1 → S2 → S3 → Değerlendir`; sonuç `Muhurlu` (görev açılır, 1-3-7-21 takvimi başlar, §8), `TelafiBekliyor` (10 dk sayacı, Meydan'a dönülebilir) ya da `PuanBekliyor` (kota). Üçüncü Telafi'de de mühür yoksa Usta ön koşul dersini önerir (A-vizyon-egitim §6; cezasızdır).

**Soru bankası (B3 §2.6).** Her ders 6 şablon taşır: S1–S3 hedef havuzu (`S-1.2-K1`, `S-1.2-C1`, `S-1.2-H1`), 3 şablon Telafi havuzu (`S-1.2-K2`…). Her şablonun 3 varyantı vardır (yüzey ve sayılar değişir, beceri aynı kalır); varyant `hash(oyuncuId ‖ soruId) mod 3` ile seçilir. Telafi Turu telafi şablonlarını çeker; Telafi sınırsız olduğundan sonraki turlar aynı şablonların sıradaki varyantını (a → b → c → a) sorar. Yeni şablon gecelik Opus Batch ile üretilir (B3 §12.3). Her şablon bir yanılgı kimliği (Y-id, B3 §12.5) taşır.

```csharp
public enum MuhurDurumu { Muhurlu, TelafiBekliyor, PuanBekliyor }

public static MuhurDurumu DersMuhru(IReadOnlyList<int?> puanlar)
{
    if (puanlar.Any(p => p is null)) return MuhurDurumu.PuanBekliyor;   // kota: gece Batch
    return puanlar.Count(p => p >= 70) >= 2 ? MuhurDurumu.Muhurlu : MuhurDurumu.TelafiBekliyor;
}

public static DateTime TelafiAcilis(DateTime sonCevapUtc) => sonCevapUtc.AddMinutes(10);

public static IReadOnlyList<string> TelafiSorulari(string dersId, string oyuncuId, int tur, ISoruBankasi banka)
{
    // tur 1 = ilk Telafi; sınırsız tur için varyant a → b → c → a döner
    return banka.Sablonlar(dersId, havuz: "telafi")                    // 3 şablon (K2, C2, H2)
                .Select(s => $"{s.Id}-{Varyant(oyuncuId, s.Id, tur)}")
                .ToList();
}

static char Varyant(string oyuncuId, string soruId, int tur)
{
    uint h = 2166136261;                                               // FNV-1a
    foreach (char c in oyuncuId + soruId) h = (h ^ c) * 16777619;
    return (char)('a' + (h + (uint)(tur - 1)) % 3);
}
```

---

## 7. Semt Sınavları

### 7.1 Ortak tasarım

| Öğe | Kural |
|---|---|
| Biçim | 20 dk: **3 Kod Yazma** (her biri ≈4 dk) + **3 Usta sorusu** (1 Kavram, 1 Çıktı Tahmini, 1 Hata Avı; ≈2 dk) + 2 dk geçiş. Sayaç görünür; süre dolunca teslim edilmeyen madde 0 |
| Interleaving | Maddeler konu bloklarıyla değil dönüşümlü (Y, K, Y, Ç, Y, H) sıralanır; her sınav ≥3 farklı modülden madde alır, Liman'dan itibaren en az 2 madde önceki semtlerden gelir |
| Kod maddesi | 3 açık + 3 gizli test; 2'si oyuncuya özel tohumlu; imza verilir (iskelet) |
| Geçme | **3/3 kod maddesi** (tüm testler) **ve** 3 Usta sorusunun ortalaması ≥70 |
| Giriş | Semtin tüm derslerinde Ders Mührü; seviye eşiğinden bağımsız açılır, semt kapısı ikisini birden ister (B2 §11.1) |
| Başarısızlık | Bekleme yok; yeni set (A → B → C → parametre varyantı); zayıf maddelerin dersleri Günlük Tekrar kuyruğuna **3 kat ağırlıkla** girer (§8) |
| Ödül (ilk geçiş) | 500 B + 10 Çip + 200 XP + Semt Madalyası (Nişan); tekrar geçiş 0 |
| Maliyet | AI ağırlığı sınav başına 2,0 (K 1 + Ç 0,5 + H 0,5); kod maddeleri AI'sız |

### 7.2 Yedi sınavın kalemleri

| Sınav (Usta) | Kod 1 | Kod 2 | Kod 3 | U1 · U2 · U3 | Önceki semtlerden |
|---|---|---|---|---|---|
| Çarşı (Defne) | Yeni tarife yüzeyi: hamam ücreti, 3 süre kademesi (1.3, 1.4) | Para üstünde bozukluk adedi, `decimal` + döngü (1.5–1.7) | Miktara göre indirim ve hizalı fiş (1.9, 1.11) | K: tam sayı bölmesi neden keser (1.2) · Ç: `while` izleme (1.6) · H: `=` / `==` ve sınır (1.3) | — (ilk sınav; modüller arası karışım) |
| Liman (Kerem) | Envanterde en çok stok: `Dictionary` (2.4, 2.5) | Manifesto metni: `Split` + `TryParse` toplamı (2.6) | Yıkama paketi kademeli fiyat (1.9 + 2.8) | K: `List` mi `Dictionary` mi (2.4) · H: bir fazla indeks (2.2) · Ç: `Sort` sonrası liste (2.11) | Çarşı: kademeli şema (Kod 3), tam sayı bölmesi |
| Atölyeler (Nehir) | Kalıtım: `Vehicle`, `override Fee()` (3.7) | `ArgumentOutOfRangeException` ile sözleşmeyi koru (3.3) | `interface IDiscount` iki uygulama + liste (3.11, 3.8) | K: kapsülleme neden (3.6) · Ç: `virtual` / `override` çıktısı (3.7) · H: üç iş yapan sınıf (3.14) | Çarşı: kademe hesabı (Kod 2); Liman: `List<T>` (Kod 3) |
| Kampüs (Baran) | LINQ `GroupBy` raporu (4.6) | Gece tarifesi: `DateTime` / `TimeSpan` (4.7) | Record'u JSON'a çevir ve geri oku (5.6) | K: `Func<>` ve lambda (4.2) · Ç: LINQ ertelenmiş çalışma (4.4) · H: `NullReferenceException` (5.8) | Atölyeler: `record`, `interface`; Liman: `Dictionary` |
| Finans Bölgesi (Elif) | `Task.WhenAll` ile iki işi birlikte bekle (6.2) | Sınır değerleri için `[Theory]` testi yaz (7.2) | Retry + backoff (6.7) | K: neden `lock` (6.3) · H: yarış durumu (6.3) · Ç: `await` sırası (6.1) | Kampüs: LINQ / JSON; Atölyeler: exception |
| Veri Vadisi (Selin) | JOIN + GROUP BY sorgusu (8.3) | EF Core ile ekle, güncelle, `Include` ile oku (8.5, 9.1) | Transaction ve `Rollback` senaryosu (9.3) | K: migration neden (8.6) · H: N+1 (9.5) · Ç: `Include` olmadan navigation (9.1) | Finans: async; Kampüs: LINQ |
| Bulut Tepesi (Yusuf) | Minimal API: GET / POST + DTO + 404 (10.2–10.4) | DI ile servis kaydı ve yapıcıdan enjeksiyon (11.1) | JWT'li uç noktada yetki denetimi (11.3, 11.4) | K: REST durum kodu seçimi (10.3) · H: sırrı koda yazmak (11.5) · Ç: middleware sırası (11.2) | Veri Vadisi: EF Core; Finans: test |

Bulut Tepesi'nin ardında açılacak semt yoktur; KANON "semt başına 1 sınav" der. Bu sınav **mezuniyet** niteliğindedir: ödül aynıdır ve yedinci Semt Madalyası verilir; kapı işlevi yoktur, Şehir Mimarı unvanı seviyeyle gelir (Ek A).

---

## 8. Günlük Tekrar algoritması (1-3-7-21)

### 8.1 Kurallar

| Öğe | Kural |
|---|---|
| Oturum | 5 soru, hedef 3 dk (yumuşak: sayaç görünür, dolunca ceza yok); 20 B + 15 XP; günde 1 ödüllü oturum; seri ≥7 iken Bayt ×1,5 (30 B), XP sabit (KANON §4). Tamamlama ölçütü beş *cevap*tır, doğruluk aranmaz (B6 §3.1) |
| Soru biçimi | AI'sız mikro soru: çoktan seçmeli çıktı tahmini, satır seçmeli hata avı, boşluk doldurma / eşleştirme; ders başına ≥3 kart; cevap ≈35 sn; turda en çok 1 serbest cevaplı kart (B6 §3.1 uzlaşması, Kurul kotasına sayılır) |
| Vade | Mühür günü T0'dan **+1, +3, +7, +21 gün** (sabit takvim); geç cevap vadeyi kaydırmaz, en erken ertesi gündür |
| Altın | 3 ardışık doğru (T0+7'de); altın duraklar 21 günde bir bakım sorusu alır |
| Yanlış | Ardışık sıfırlanır, altın → yeşil, T0 := bugün, ertesi gün yeniden başlar |
| Semt Sınavı başarısızlığı | Zayıf maddelerin dersleri `Agirlik = 3` alır, vade bugündür; doğru cevapta ağırlık 1'e döner |
| Seri | Gün sınırı TR 04:00. ≥1 tamamlanmış oturum seriyi 1 artırır. Kaçırılan her gün için 1 dondurma tüketilir (önce haftalık ücretsiz, sonra Seri Dondurucu 50 B, stok ≤2 [B6]); yetmezse seri 0 olur, "en uzun seri" saklanır; ceza yok |
| İlk gün | Kuyruk boştur (mühür vadesi ertesi gün); çıkış kartı "Yarın: Günlük Tekrar 3 dk" der (VİZYON §4) |

### 8.2 Veri yapısı (B7 §4.2 tablolarıyla eşleme)

| B4 alanı | B7 karşılığı | Not |
|---|---|---|
| `t0` (mühür günü; yanlışta bugüne çekilir) | `progress.metro_stops.sealed_at` | B7'de `sealed_at` değişmez; **B4 önerisi:** ayrı `anchor_on` (date) alanı |
| `ardisik_dogru`, `altin` | `metro_stops.correct_streak`, `state = 'altin'` | aynı |
| `asama`, `sonraki`, `agirlik` | `progress.review_queue.stage`, `due_on`, `weight` | B7 anahtarı `(player_id, question_id)`; B4 **durak başına satır** ister: PK `(player_id, lesson_id)` (**B4 önerisi**). Kart seçimi oturum katmanındadır |
| `gun`, `en_uzun`, `son_tamamlanan` | `progress.streaks.current`, `longest`, `last_active_on` | aynı |
| `haftalik_hak`, `dondurucu_adedi` | `streaks.freezes_available`, `last_freeze_on` | B4 iki sayaç ister: haftalık hak (≤1) ve Seri Dondurucu stoku (≤2) (**B4 önerisi**) |
| günde tek ödül | ledger türü `DAILY_REVIEW_REWARD`, anahtar `dr:{oyuncu}:{iş günü}` | aynı |

Uç noktalar: `GET /v1/reviews/daily` (5 soru) ve `POST /v1/reviews/daily/answers` (B7 §5.3).

### 8.3 Oturum kurulumu (sözde kod)

```text
Oturum(oyuncu, bugun):
  vadeli  ← kayitlar WHERE sonraki ≤ bugun
  skor(k) = k.agirlik × (1 + 0,15 × gecikmeGunu(k)) × (k.altin ? 0,5 : 1)
  tur 1:  skor azalan; aynı modülden art arda en çok 2  →  secilen (en çok 5)
  tur 2:  eksikse kalan vadelileri kısıtsız ekle
  tur 3:  hâlâ eksikse vadesi gelmemiş en eski mühürleri ekle (vade değişmez)
  her durak için kart: son 14 günde görülmeyen ve son kartla farklı tipte olan; yoksa rastgele
  sonuç: durak başına 1 soru → o sonuç; aynı duraktan 2 soru gerekirse ikisi de doğru olmalı
```

### 8.4 C# iskeleti (derlenip denendi)

```csharp
public sealed class TekrarKaydi
{
    public string DersId = "";
    public DateOnly T0;            // mühür günü (yanlışta bugüne çekilir)
    public int Asama;              // 0..3: sıradaki vade V[Asama]
    public int ArdisikDogru;       // 3 → altın
    public bool Altin;
    public DateOnly Sonraki;
    public int Agirlik = 1;        // Semt Sınavı başarısızlığında 3
}

public sealed class Seri
{
    public int Gun, EnUzun, DondurucuAdedi;
    public bool HaftalikHak = true;
    public DateOnly SonTamamlanan;
}

public static class TekrarPlanlayici
{
    static readonly int[] V = { 1, 3, 7, 21 };   // mühür gününe göre vade (gün)

    public static TekrarKaydi Yeni(string dersId, DateOnly muhurGunu) =>
        new() { DersId = dersId, T0 = muhurGunu, Sonraki = muhurGunu.AddDays(V[0]) };

    public static void Cevapla(TekrarKaydi k, bool dogru, DateOnly bugun)
    {
        if (!dogru)
        {
            k.T0 = bugun; k.Asama = 0; k.ArdisikDogru = 0; k.Altin = false;  // altın → yeşil
            k.Sonraki = bugun.AddDays(1);                                    // takvim bugünden yeniden
            return;
        }
        k.ArdisikDogru = Math.Min(3, k.ArdisikDogru + 1);
        k.Altin = k.ArdisikDogru >= 3;
        if (k.Asama < V.Length - 1)
        {
            k.Asama++;
            var hedef = k.T0.AddDays(V[k.Asama]);
            k.Sonraki = hedef > bugun ? hedef : bugun.AddDays(1);            // geç cevapta takvim kaymaz
        }
        else k.Sonraki = bugun.AddDays(21);                                  // altın bakım
        k.Agirlik = 1;
    }

    static double Skor(TekrarKaydi k, DateOnly bugun) =>
        k.Agirlik * (1 + 0.15 * Math.Max(0, bugun.DayNumber - k.Sonraki.DayNumber)) * (k.Altin ? 0.5 : 1.0);

    public static List<TekrarKaydi> Oturum(IReadOnlyList<TekrarKaydi> hepsi, DateOnly bugun,
                                           Func<string, int> modulOf, int adet = 5)
    {
        var vadeli = hepsi.Where(x => x.Sonraki <= bugun).OrderByDescending(x => Skor(x, bugun)).ToList();
        var secilen = new List<TekrarKaydi>();
        foreach (var k in vadeli)                                   // tur 1: aynı modülden art arda ≤ 2
        {
            if (secilen.Count == adet) break;
            int m = modulOf(k.DersId);
            if (secilen.Count >= 2 && modulOf(secilen[^1].DersId) == m && modulOf(secilen[^2].DersId) == m) continue;
            secilen.Add(k);
        }
        foreach (var k in vadeli.Except(secilen))                   // tur 2: kısıtı gevşet
            if (secilen.Count < adet) secilen.Add(k);
        foreach (var k in hepsi.Except(secilen).OrderBy(x => x.T0)) // tur 3: en eski mühürler
            if (secilen.Count < adet) secilen.Add(k);
        return secilen;
    }

    public static void SeriGuncelle(Seri s, DateOnly bugun)          // oturumdan önce çağrılır
    {
        int kacirilan = bugun.DayNumber - s.SonTamamlanan.DayNumber - 1;
        if (kacirilan <= 0 || s.Gun == 0) return;
        int hak = (s.HaftalikHak ? 1 : 0) + s.DondurucuAdedi;
        if (hak < kacirilan) { s.Gun = 0; return; }                  // ceza yok; EnUzun saklanır
        int kullan = kacirilan;
        if (s.HaftalikHak) { s.HaftalikHak = false; kullan--; }
        s.DondurucuAdedi -= kullan;
        s.SonTamamlanan = s.SonTamamlanan.AddDays(kacirilan);        // dondurulan günler seriyi korur
    }

    public static void Tamamla(Seri s, DateOnly bugun, out int bayt, out int xp)
    {
        s.Gun++; s.EnUzun = Math.Max(s.EnUzun, s.Gun); s.SonTamamlanan = bugun;
        bayt = s.Gun >= 7 ? 30 : 20;                                 // seri ≥ 7 → ×1,5
        xp = 15;
    }
}
```

Doğrulama (2026-11-02'de mühürlenen ders): D1 doğru → sonraki D3; D3 doğru → D7; D7 doğru → **altın**, sonraki D21; D21 doğru → D42; D42 yanlış → yeşil, ertesi gün. Seri 5 iken 1 gün kaçırma haftalık dondurmayla korunur; 3 gün kaçırma (hak yok) seriyi 0'lar ve `EnUzun = 5` kalır; Seri Dondurucu'lu 8'lik seri 9'a çıkar ve 30 B verir.

---

## 9. Kavram → işletme eşlemesi

L1 konuları KANON §5'tendir; L2+ kapısı, B5 §2'deki seviye kavramlarının son öğretildiği derstir (**B4 önerisi**, B5 doğrular). Otopark ve Büfe kapıları B2 §7.3 / §13 ile uyumludur (Otopark L3: bkz. §11). Ruhsat zincirleri §2 tablosundadır.

| # | İşletme (semt · seviye sayısı) | L1 konusu → dersler | Yükseltme kapıları |
|---|---|---|---|
| 1 | Otopark (Çarşı · 5) | `if/else if`, metot, yukarı yuvarlama → 1.2–1.4 | L2 2.1 · L3 3.2–3.4 · L4 4.7 · L5 5.1 + 6.3 |
| 2 | Büfe (Çarşı · 4) | aritmetik, `decimal`, para üstü, döngü → 1.5–1.7 | L2 1.11 · L3 2.5 · L4 3.10 |
| 3 | Manav (Çarşı · 4) | döngü, `switch`, indirim kademesi → 1.8–1.10 | L2 2.3 · L3 2.5 · L4 3.6 |
| 4 | Kargo Deposu (Liman · 4) | dizi, `List<T>`, envanter sayımı → 2.1–2.3 | L2 2.6 · L3 2.11 · L4 2.7 |
| 5 | Balık Hali (Liman · 4) | `Dictionary`, `Split` → 2.4–2.6 | L2 2.5 · L3 2.11 · L4 2.12 |
| 6 | Oto Yıkama (Liman · 3) | `List` + paket / ek hizmet kademesi → 2.7–2.9 | L2 3.4 · L3 4.7 |
| 7 | Gümrük (Liman · 4) | arama, sıralama, plaka doğrulama → 2.10–2.12 | L2 2.10 · L3 2.11 · L4 2.5 + 2.10 |
| 8 | Oto Tamirhane (Atölyeler · 4) | sınıf, kalıtım → 3.5–3.7 | L2 3.6 · L3 3.12 · L4 3.13 |
| 9 | Mobilya Atölyesi (Atölyeler · 4) | nesne, kapsülleme, sipariş nesneleri → 3.8–3.10 | L2 3.10 · L3 3.12 · L4 4.7 |
| 10 | Trafo Merkezi (Atölyeler · 4) | `interface`, `enum`, `exception` → 3.11–3.13 | L2 3.13 · L3 3.10 · L4 3.13 |
| 11 | Kütüphane (Kampüs · 4) | LINQ, gecikme cezası → 4.6–4.8 (önkoşul 4.4–4.5) | L2 4.5 · L3 5.1 · L4 4.6 |
| 12 | Sinema (Kampüs · 4) | generics, `DateTime`, rezervasyon → 5.1–5.3 | L2 4.7 · L3 5.7 · L4 5.6 |
| 13 | Haber Ajansı (Kampüs · 3) | delegate / event, JSON akışı → 5.4–5.6 | L2 4.2 · L3 5.6 |
| 14 | Banka (Finans Bölgesi · 4) | `async/await`, `Task`, işlem kuyruğu → 6.1–6.3 | L2 6.3 · L3 6.4 · L4 6.2 |
| 15 | Sigorta (Finans Bölgesi · 4) | kural motoru + unit test → 7.1–7.3 | L2 7.2 · L3 7.4 · L4 7.7 |
| 16 | Borsa Panosu (Finans Bölgesi · 3) | `HttpClient`, veri akışı, dayanıklılık → 6.5–6.7 | L2 6.7 · L3 6.8 |
| 17 | Hastane Kayıt (Veri Vadisi · 4) | EF Core, migration → 8.4–8.6 | L2 9.1 · L3 8.6 · L4 9.5 |
| 18 | Otel (Veri Vadisi · 4) | ilişkiler, repository, transaction → 9.1–9.3 | L2 9.1 · L3 9.2 · L4 9.4 |
| 19 | Yemek Sipariş Platformu (Bulut Tepesi · 4) | Web API, REST, DTO → 10.2–10.4 | L2 10.3 · L3 10.6 · L4 11.6 |
| 20 | Şehir Uygulaması (Bulut Tepesi · 3) | DI, auth, middleware → 11.1–11.3 | L2 11.3 · L3 11.8 |

**Kavram → işletmeler (ters bakış).**

| Kavram (ilk ders) | Kullanıldığı işletme / seviye |
|---|---|
| Kademeli şema: `if/else if` (1.3), kademe (1.9) | Otopark L1 → Manav L1 (2. yüzey) → Oto Yıkama L1 (3.) → Kütüphane L1 (4. yüzey) |
| `List<T>` (2.1) | Otopark L2, Kargo Deposu L1–L2, Manav L2, Oto Yıkama L1 |
| `Dictionary`, `Split` (2.4–2.6) | Balık Hali L1–L2, Büfe L3, Manav L3, Kargo Deposu L2 |
| Sıralama, arama (2.10, 2.11) | Gümrük L1–L3, Kargo Deposu L3, Balık Hali L3 |
| `enum` (3.2) | Otopark L3, Büfe L4, Oto Yıkama L2, Trafo Merkezi L1 |
| `exception` (3.3, 3.13) | Otopark L3, Trafo Merkezi L2 ve L4, Oto Tamirhane L4 |
| Sınıf, kalıtım, `interface` (3.5–3.12) | Oto Tamirhane L1–L3, Mobilya Atölyesi L1 ve L3, Trafo Merkezi L1, Manav L4 |
| LINQ (4.4–4.6) | Kütüphane L1, L2, L4 |
| `DateTime` (4.7) | Otopark L4, Kütüphane L1, Sinema L1–L2, Oto Yıkama L3, Mobilya Atölyesi L4 |
| Generics, kuyruk (5.1, 5.2) | Sinema L1, Kütüphane L3, Otopark L5 |
| Delegate, event, dosya, JSON (4.2, 5.4–5.6) | Haber Ajansı L1–L3, Sinema L4 |
| `async/await` (6.1–6.4) | Banka L1–L4, Otopark L5 |
| EF Core, ilişki, transaction (8.4–9.4) | Hastane Kayıt L1–L4, Otel L1–L4 |
| Web API, DTO, DI, JWT (10.2–11.3) | Yemek Sipariş Platformu L1–L3, Şehir Uygulaması L1–L2 |

---

## 10. Otopark yolculuğu

### 10.1 L1'den önce: gerekli dersler ve süre

Otopark L1 için **yalnızca 1.1–1.4** (4 ders, 32 dk) ve Ruhsat 3/3 gerekir; Ruhsat sırası 1.2 → 1.3 → 1.4'tür.

| Adım | Süre (dk) | Kümülatif (dk) | Bayt bakiyesi |
|---|---|---|---|
| Onboarding (giriş → Defne, VİZYON §4) | 6,5 | 6,5 | 0 |
| 1.1 + Meydan Saati (ilk Bayt, Sev. 2) | 8 + 6 | 20,5 | 40 |
| Pazar teaser (Çırak Şapkası −30), harita, turist modu, çıkış kartı | ≈10 | 30,5 | **10** |
| 1.2 + Dakikadan Saate (Ruhsat 1/3) | 8 + 6 | 44,5 | 60 |
| 1.3 + Kademeli Karar (Ruhsat 2/3) | 8 + 6 | 58,5 | 120 |
| 1.4 + Taksimetre (Ruhsat 3/3) + Belediye teşviki | 8 + 6 | 72,5 | 200 + 100 = **300 → Tapu** |

Tapu ≈72. dakikadadır (VİZYON §4: ≈70; kâğıt testinde ölçülür).

### 10.2 Ders → görev → Otopark karşılığı (VİZYON §7 tablosunun genişlemesi)

Otopark kodu 15 derse dokunur; kalan 85 ders diğer işletmelerin ve genel yetkinliğin içindir.

| Ders | Kavram | Prova görevi | Otoparktaki karşılığı |
|---|---|---|---|
| 1.1 | `int`, `string`, interpolation, `Console.WriteLine` | Meydan Saati | Ücretin ekrana yazılması; imzadaki `int` |
| 1.2 | tam sayı bölmesi, `Math.Ceiling`, `(dakika + 59) / 60` | Dakikadan Saate (Ruhsat 1/3) | Başlayan saatin tam sayılması: `saat = ceil(dakika / 60)` |
| 1.3 | `if / else if / else`, `&&`, sınır değerleri | Kademeli Karar (2/3) | Üç tarife dilimi; `< 120` ve `<= 360` sınırları |
| 1.4 | metot, parametre, dönüş, imza | Taksimetre (3/3) | `UcretHesapla(int dakika) : int` |
| 1.9 | kademe tablosu, `decimal` | Toptan İndirim | "Aynı şema, 2. yüzey" (Manav) |
| 1.10 | döngü + metot | Sepet Fişi | 12 araçlık günlük toplam (gece batch'i aynı kalıp) |
| 1.11 | `string` | Fiş Hizası | Plakayı temizleme (`Trim`, `ToUpper`): L2 abone eşleşmesinin ön adımı |
| 1.12 | `dotnet`, Visual Studio | Yerelde Çalıştır | Aha (c): kod yapıştırılınca aynen derlenir |
| 2.1 | `List<string>`, `Contains` | Abone Listesi | **L2 kapısı:** "aylık abonelerin plakaları listede; onlar ödemesin" |
| 3.2 | `enum` + `switch` | — | **L3 (1/3):** Normal / Engelli / Elektrikli tarife türü |
| 3.3 | `throw`, `ArgumentOutOfRangeException` | — | **L3 (2/3):** bozuk bariyer kaydı → hata (girdi ≥ 0 sözleşmesi) |
| 3.4 | aşırı yükleme | — | **L3 (3/3):** `UcretHesapla(int, IndirimTuru)` yanında eski imza |
| 4.7 | `DateTime`, `TimeSpan` | — | **L4 kapısı:** 22:00–06:00 gece tarifesi sabit 150 |
| 5.1 | `Queue<T>` | — | **L5 (1/2):** bekleyen araç kuyruğu |
| 6.3 | asenkron kuyruk, `lock` | — | **L5 (2/2):** kapasite 50, doluysa reddet, bekleyenleri sırala |

---

## 11. Zorluk eğrisi verisi

Aşağıdaki iki tablo, Müfredat sayfasının modül grafiklerinin kaynağıdır (§3 tablolarından hesaplanmıştır; çift eksen yoktur, iki ayrı grafik). Ders dakikası T1 8 · T2 10 · T3 12 · T4 14 ortalamasına oturur (B2 §2.3).

**Tablo A — Modül bazında ortalama ders süresi (dk)**

| Modül | Kısa ad | Ders | Toplam dk | Ort. dk |
|---|---|---|---|---|
| M1 | Temeller | 12 | 96 | 8,0 |
| M2 | Koleksiyonlar | 12 | 108 | 9,0 |
| M3 | Nesneler | 14 | 140 | 10,0 |
| M4 | LINQ yolu | 8 | 92 | 11,5 |
| M5 | Tipler, olay, dosya | 8 | 91 | 11,4 |
| M6 | Asenkron ve ağ | 8 | 96 | 12,0 |
| M7 | Test, kalıp, Git | 8 | 96 | 12,0 |
| M8 | SQL ve EF Core | 7 | 84 | 12,0 |
| M9 | İlişkiler, güvenli veri | 7 | 98 | 14,0 |
| M10 | Minimal API | 8 | 112 | 14,0 |
| M11 | DI, güvenlik, SignalR | 8 | 112 | 14,0 |

**Tablo B — Modül bazında ortalama ders XP'si**

| Modül | Kısa ad | Toplam XP | Ort. XP |
|---|---|---|---|
| M1 | Temeller | 1.200 | 100 |
| M2 | Koleksiyonlar | 1.680 | 140 |
| M3 | Nesneler | 2.520 | 180 |
| M4 | LINQ yolu | 2.040 | 255 |
| M5 | Tipler, olay, dosya | 2.040 | 255 |
| M6 | Asenkron ve ağ | 2.240 | 280 |
| M7 | Test, kalıp, Git | 2.240 | 280 |
| M8 | SQL ve EF Core | 1.960 | 280 |
| M9 | İlişkiler, güvenli veri | 2.800 | 400 |
| M10 | Minimal API | 3.200 | 400 |
| M11 | DI, güvenlik, SignalR | 3.200 | 400 |

**Semt tablosu ve toplamlar**

| Semt | Ders | Ders dk | Görev dk | Sınav dk | Toplam dk | Ders XP | Görev XP |
|---|---|---|---|---|---|---|---|
| Çarşı | 12 | 96 | 72 | 20 | 188 | 1.200 | 720 |
| Liman | 12 | 108 | 84 | 20 | 212 | 1.680 | 960 |
| Atölyeler | 14 | 140 | 112 | 20 | 272 | 2.520 | 1.400 |
| Kampüs | 16 | 183 | 152 | 20 | 355 | 4.080 | 2.320 |
| Finans Bölgesi | 16 | 192 | 160 | 20 | 372 | 4.480 | 2.560 |
| Veri Vadisi | 14 | 182 | 154 | 20 | 356 | 4.760 | 2.870 |
| Bulut Tepesi | 16 | 224 | 192 | 20 | 436 | 6.400 | 4.000 |
| **Toplam** | **100** | **1.125 (18,75 sa)** | **926** | **140** | **2.191 (36,5 sa)** | **25.120** | **14.830** |

Tek seferlik müfredat XP'si (ders + görev + 7 × 200 sınav) **41.350 XP**'tir; Sev. 40 eşiğinin (192.330) %21,5'idir. Geri kalan XP işletme açılış / yükseltmesinden, Hata Bildirimi ve Günlük Tekrar'dan gelir (B2 §4.5). İşletme kodlama süreleri (B5) bu toplama dâhil değildir.

**Soru dağılımı ve AI yükü.** 300 ders sorusunda K 100 · Ç 61 · H 53 · Y 86 (Y %28,7). AI ağırlığı 157 (soru başına 0,52; ders başına 1,50 [M4, M5, M8, M9] – 1,71 [M1]). 100 görev ve 21 sınav kod maddesi AI'sızdır; 21 sınav Usta sorusu ağırlığı 14'tür. Tüm puanlanan 442 etkileşimde deterministik pay ≈ **%61** (VİZYON hedefi ≥%50; yalnızca ders soruları %48). Yoğun profil (günde 3 ders + Telafi + Savunma) en çok ≈20 AI etkileşimi üretir; 30'luk kotanın altında kalır.

**B2 uyumu.**

| Semt | B2 ders | B4 ders | B2 tek seferlik (ders + görev) | B4 | Fark |
|---|---|---|---|---|---|
| Çarşı | 12 | 12 | 2.040 | 2.040 | 0 |
| Liman | 12 | 12 | 2.844 | 2.844 | 0 |
| Atölyeler | 14 | 14 | 4.130 | 4.130 | 0 |
| Kampüs | 16 | 16 | 7.280 (hepsi T3) | 6.640 (4 T2 + 12 T3) | −640 (band talebinin %1,9'u) |
| Finans Bölgesi | 16 | 16 | 7.280 | 7.280 | 0 |
| Veri Vadisi | 14 | 14 | 9.310 (hepsi T4) | 7.840 (7 T3 + 7 T4) | −1.470 (%1,9) |
| Bulut Tepesi | 16 | 16 | 10.640 | 10.640 | 0 |

(Görev başına B2 bonusu eklenmiştir: Çarşı 10, Liman 17, diğerleri 15.) Fark, KANON §2.1'in Kampüs "Tier 2–3" ve Veri Vadisi "Tier 3–4" aralıklarının B2'de üst tier'a yuvarlanmasından doğar; B2 §4.5 bu karışımla yeniden üretilmelidir (Ek A). Otopark L3 kapısı B2'de 3.2, B4'te **3.4**; Oto Tamirhane Ruhsat'ı B2'de Atölyeler'in ilk 3 dersinden sonra, B4'te 3.7'den sonra gelir; B2 §11 yoğun profilinde iki olay 29–30. günden 30–32. güne kayar.

---

## 12. Ön koşul grafı ve kapı haritası

### 12.1 Kurallar

1. Ön koşul sütunu (§3) yönlü bir graf kurar; her kenar daha önceki bir derse gider. 100 ders için betikle doğrulandı: ileri atıf yok, döngü yok, tüm kimlikler tanımlı.
2. Her semtin ilk dersi bir önceki semtin **Semt Sınavı**na bağlıdır (altı kapı); sınav o semtin tüm derslerini ister. Bu yüzden semt içindeki her ders, önceki semtlerin tamamını örtük olarak ister.
3. Görev, İş Emri ve sınav kod maddesi yalnızca **mühürlü derslerin** ön koşul kapanışındaki kavramları kullanır; İş Emri'nin koşulu ayrıca Ruhsat + fiyat + seviye eşiğidir (KANON §5).
4. Ders başına ≤3 yeni sembol (VİZYON ilke 6); her ders `yeni_semboller` listesi taşır ve challenge spec'in `kullanilan_semboller` kümesi bu listelerin birleşiminin içinde kalmalıdır. İçerik hattı bunu otomatik denetler:

```csharp
// bir challenge öğretilmemiş sembol istemesin
bool GorevGecerli(IEnumerable<string> kullanilan, string dersId, DersGrafi g)
{
    var ogretilen = g.OncekiDersler(dersId).Append(dersId)
                     .SelectMany(g.YeniSemboller).ToHashSet();
    return kullanilan.All(ogretilen.Contains);
}
```

### 12.2 Kapı haritası: Otopark L1–L5 ve diğer işletmelerin L1'i

"Önceki semtlerden" Semt Sınavı kapıları nedeniyle gelen ders sayısıdır; son sütun gereken tüm derslerin süresidir (görev ve sınav hariç).

| Kapı | Semt içi gerekli dersler | Önceki semtlerden | Toplam ders | Ders süresi dk (sa) |
|---|---|---|---|---|
| Otopark L1 | 1.1–1.4 | 0 | 4 | 32 (0,5) |
| Otopark L2 | 2.1 | 12 | 13 | 105 (1,8) |
| Otopark L3 | 3.1–3.4 | 24 | 28 | 240 (4,0) |
| Otopark L4 | 4.7 | 38 | 39 | 354 (5,9) |
| Otopark L5 | 6.1–6.3 | 54 | 57 | 565 (9,4) |
| Büfe L1 | 1.1–1.7 | 0 | 7 | 56 (0,9) |
| Manav L1 | 1.1–1.10 | 0 | 10 | 81 (1,4) |
| Kargo Deposu L1 | 2.1–2.3 | 12 | 15 | 121 (2,0) |
| Balık Hali L1 | 2.1–2.6 | 12 | 18 | 144 (2,4) |
| Oto Yıkama L1 | 2.1–2.3, 2.7–2.9 | 12 | 18 | 152 (2,5) |
| Gümrük L1 | 2.1–2.3, 2.10–2.12 | 12 | 18 | 150 (2,5) |
| Oto Tamirhane L1 | 3.1–3.7 | 24 | 31 | 271 (4,5) |
| Mobilya Atölyesi L1 | 3.1–3.6, 3.8–3.10 | 24 | 33 | 291 (4,8) |
| Trafo Merkezi L1 | 3.1–3.7, 3.11–3.13 | 24 | 34 | 302 (5,0) |
| Kütüphane L1 | 4.1–4.8 | 38 | 46 | 436 (7,3) |
| Sinema L1 | 4.1, 4.7, 5.1–5.3 | 38 | 43 | 399 (6,7) |
| Haber Ajansı L1 | 4.1, 4.2, 5.4–5.6 | 38 | 43 | 400 (6,7) |
| Banka L1 | 6.1–6.3 | 54 | 57 | 565 (9,4) |
| Borsa Panosu L1 | 6.1, 6.2, 6.4–6.7 | 54 | 60 | 600 (10,0) |
| Sigorta L1 | 7.1–7.3 | 54 | 57 | 564 (9,4) |
| Hastane Kayıt L1 | 8.1–8.6 | 70 | 76 | 791 (13,2) |
| Otel L1 | 8.1–8.6, 9.1–9.3 | 70 | 79 | 834 (13,9) |
| Yemek Sipariş Platformu L1 | 10.1–10.4 | 84 | 88 | 957 (15,9) |
| Şehir Uygulaması L1 | 10.1, 10.2, 11.1–11.3 | 84 | 89 | 970 (16,2) |

---

## 13. Kavram sözlüğü (Çarşı–Liman, 41 satır, 50'ye yakın terim)

Çarşı–Liman'da örnek tanımlayıcılar Türkçe ve karaktersizdir: `ucret`, `dakika`, `baslayanSaat`, `aboneler`, `fiyatlar`; Atölyeler'den itibaren İngilizcedir (KANON §1).

| Kavram | C# karşılığı | Ders |
|---|---|---|
| Değişken | variable | 1.1 |
| Tür | type (`int`, `string`) | 1.1 |
| Tam sayı | `int` | 1.1 |
| Metin | `string` | 1.1 |
| Değer | value | 1.1 |
| Atama | `=` | 1.1 |
| Çıktı | `Console.WriteLine` | 1.1 |
| Metne değer yerleştirme | interpolation `$"{x}"` | 1.1 |
| Derleyici hatası | compiler error, `CS0029` | 1.1 |
| Ondalıklı sayı | `double` | 1.2 |
| Tam sayı bölmesi | integer division `/` | 1.2 |
| Kalan | `%` | 1.2 |
| Yukarı yuvarlama | `Math.Ceiling`, `(x + 59) / 60` | 1.2 |
| Mantıksal değer | `bool` (`true` / `false`) | 1.3 |
| Karşılaştırma | `==`, `!=`, `<`, `<=`, `>`, `>=` | 1.3 |
| Koşul, dal | `if`, `else if`, `else` | 1.3 |
| Ve / veya / değil | `&&`, `\|\|`, `!` | 1.3 |
| Sınır değeri | boundary value | 1.3 |
| Metot | method | 1.4 |
| İmza | method signature | 1.4 |
| Parametre, argüman | parameter, argument | 1.4 |
| Dönüş değeri, boş dönüş | `return`, `void` | 1.4 |
| Kesin ondalık (para) | `decimal`, `1.5m` | 1.5 |
| Döngü | `while`, `for` | 1.6 |
| Sayaç, toplayıcı | `i++`, `toplam += x` | 1.6 |
| Çık, atla | `break`, `continue` | 1.7 |
| Seçim yapısı | `switch`, `case`, `default` | 1.8 |
| Kademe, eşik | tier / threshold tablosu | 1.9 |
| Metin parçalama, temizleme | `Length`, `Substring`, `Trim`, `ToUpper` | 1.11 |
| Yerel çalıştırma | `dotnet new console`, `dotnet run` | 1.12 |
| Liste, eleman | `List<T>`, `Add`, `Count` | 2.1 |
| Üyelik sorgusu | `Contains` | 2.1 |
| Dizi, indeks | `int[]`, `[i]` (0'dan başlar) | 2.2 |
| Her biri için | `foreach` | 2.3 |
| Sözlük, anahtar / değer | `Dictionary<TKey, TValue>` | 2.4 |
| Güvenli arama | `TryGetValue`, `ContainsKey` | 2.5 |
| Bölmek | `string.Split` | 2.6 |
| Ayrıştırma | `int.Parse`, `int.TryParse` | 2.6 |
| Hata türleri, hata ayıklama | derleme / çalışma / mantık hatası, breakpoint | 2.9 |
| Doğrusal ve ikili arama | `IndexOf`, `BinarySearch` | 2.10 |
| Sıralama | `Sort`, `CompareTo` | 2.11 |
| Karakter denetimi | `char.IsDigit`, `char.IsLetter` | 2.12 |

---

## 14. Varsayımlar

1. Ders süresi T1 8 · T2 10 · T3 12 · T4 14 dk; görev süresi T1 6 · T2 8 · T3 10 · T4 12 dk (**B4 önerisi**; B2 yalnızca T1–T2 görev süresini verir). 1.1–1.4 ve görevleri tapuya ≈72. dakikada götürür (§10).
2. Her derste 1 prova görevi vardır (B2 §13). Ruhsat zincirleri ardışık üç dersin görevidir; Finans'ta sıra Banka → Borsa Panosu → Sigorta'dır.
3. Yükseltme kapıları B5 §2'deki seviye kavramlarına göre atanmıştır ve **B4 önerisidir**; Otopark L3 = 3.4 de öyledir. B5 kesinleştirir.
4. Ders içi Y sorusu: sandbox 3 açık + 2 gizli test, puan = geçen test yüzdesi, XP ve mühür kuralı K / Ç / H ile aynı (B3 doğrular).
5. Sandbox `InvariantCulture` ile çalışır ve ağsızdır: `HttpClient` dersleri sahte `HttpMessageHandler`, SQL / EF dersleri bellek içi SQLite, test dersleri önceden yüklü xUnit kullanır (B7).
6. Günlük Tekrar'ın "1-3-7-21. günlerde" ifadesi mühür gününe göre sabit takvim olarak okunmuştur; mikro sorular AI'sızdır; 3 dk yumuşak hedeftir.
7. Her derse 6 şablon × 3 varyant (18 soru gövdesi) ve ≥3 tekrar kartı yazılır: 100 ders için 600 şablon, 1.800 gövde, ≥300 kart. Üretim hattı: Opus taslağı → yazar → ikinci göz (VİZYON §13: haftada 3 ders).
8. Kod örnekleri .NET 10 / C# ile `ImplicitUsings` açık derlenmiştir. 1.1–1.4 örnekleri, görev çözümleri ve testleri `dotnet` ile koşulmuş (31 kontrol), hata kodları (CS0029, CS1002, CS0161) derleyiciden doğrulanmış, Günlük Tekrar ve Mühür iskeletleri derlenip denenmiştir.
9. Kartlarda ondalık virgül (3,5), sandbox çıktısında nokta (3.5) kullanılır.
10. Sev. 2 anı 1.1'in üçüncü sorusunda gelir (10 + 25 + 32 + 24 = 91 XP; ≈14.–15. dakika, VİZYON §4 ile uyumlu).

---

## 15. Açık Sorular

1. **Otopark L3 kapısı:** 3.4 (B2: 3.2). **ÇÖZÜLDÜ (KANON §12.3): 3.4; B2 ve B5 3.4'e çekildi.** VİZYON §7 L3'e `enum`, aşırı yükleme ve `ArgumentOutOfRangeException` yazar; B5 aşırı yüklemeyi L2'ye (Liman) koyar ve L3'ü 3.3'te bitirir. B5 aşırı yüklemeyi L3'e alırsa kapı 3.4 kalır; almazsa 3.3 olur. (B2, B5)
2. **Tier karışımı:** Kampüs (4 T2 + 12 T3) ve Veri Vadisi (7 T3 + 7 T4) için B2 §4.5 yeniden mi üretilecek, yoksa semt tek tier'a mı yuvarlanacak? (fark −2.110 XP)
3. **Günlük Tekrar vadesi:** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.3: mühür gününe göre sabit takvim; B6 uyumlu.)* mühür gününe göre sabit takvim mi (altın 7. gün), son doğru cevaba göre genişleyen aralık mı (altın 11. gün)? (B3, B6)
4. **Y sorusunun mühürdeki ağırlığı** AI puanıyla eşit mi? (B3)
5. **Hafif oyuncu:** 10 dakikalık günde 8 dk ders + 6 dk görev + 3 dk Günlük Tekrar sığmaz (B2 §14 s.11). "Önce Günlük Tekrar" akışı mı, 4 kartlı T1 ders mi?
6. **Keskin Göz A/B ölçümü:** 1.3 S3 "sınırı müşteriye sor" mesajını verir; anomaliyi söylemez ama ölçümü kirletebilir mi?
7. **Sandbox paketleri:** SQLite, xUnit ve ASP.NET test host'u 256 MB'lık ısıtılmış container'a sığar mı? (B7)
8. **MVP kesiti:** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.3: Liman Sınavı MVP'de 2.1–2.6 ile yapılır; tam kural v1.1'den itibaren.)* Liman 2.7–2.12 (T2) MVP dışıdır; Liman Sınavı MVP'de 2.1–2.6 ile yetinebilir mi?
9. **Mezuniyet:** Bulut Tepesi Sınavı'nın kapı işlevi yok; ek Nişan ya da unvan gerekir mi?
10. **3 soru kuralı:** 15 dakikalık T4 derslerde de 3 Usta sorusu yeterli mi (KANON sabit)?

---

## 16. Diğer Belgelere Bağımlılıklar

| Belge | B4'ün beklediği / verdiği | Uyum koşulu |
|---|---|---|
| KANON | Tüm sayı ve adlar (§2.1, §3.3, §4, §5, §9); Ek A önerileri | Onaylanan öneri §3–§12'yi yeniden üretir |
| VİZYON | §4 ilk 30 dk, §7 Çarşı ve Ruhsat zinciri, §10 soru tipleri | 1.1–1.4 başlıkları ve görev adları aynen |
| B1 | Kürsü / Derslik sahnesi, Mühür Duvarı, Usta replikleri | 7 Kürsü, 100 ders kapısı; Defne ve Kerem sesi §4–§5 ile tutarlı |
| B2 | Ders sayıları (12 / 12 / 14 / 16 / 16 / 14 / 16), görev XP / Bayt, kapı dersleri | §11 uyum tablosu; B2 §4.5 yeniden üretimi; Otopark L3 = 3.4 |
| B3 | Kurul rubriği, Y sorusu puanı, 3 setlik soru bankası, Telafi kuralı, Günlük Tekrar mikro soru biçimi | Rubrik alt ölçütleri toplamı 50 / 30 / 20; 300 cevaplık altın küme 1.1–1.4'ün çapa cevaplarıyla başlar |
| B5 | L1 konuları, Ruhsat zincirleri, L2–L5 kapı dersleri (B5 §2'nin seviye kavramlarına göre atandı); Challenge Spec'e `kullanilan_semboller` ve `on_kosul_dersler[]` alanları (**B4 önerisi**) | Her challenge öğretilmemiş sembol istemez (§12.1). B5 varsayımları karşılandı: `switch` ifadesi + ilişkisel desen + işlem sırası 1.8–1.9, `Enum.IsDefined` 3.2, `abstract` 3.7, `HashSet` 2.10, `StringBuilder` 2.12, `SemaphoreSlim` 6.3, `WhenAny` 6.4; Manav döngüsü Ruhsat görevinde (1.10). Farklar: Otopark L2'deki aşırı yükleme (B5) 3.4'tedir (VİZYON §7: L3); Oto Yıkama L3 `DateTime` 4.7'dedir (Kampüs) |
| B6 | Atölyeler ve sonrası görev adları, Hata Bildirimi motoru (2.9'un biçimi), Günlük Tekrar ödül / seri metinleri | Görev tipi ve ödül kuralı §3 Görev Atlası |
| B7 | `progress.metro_stops`, `review_queue`, `streaks` (eşleme §8.2); `learning.lessons` (§4.3.6); `GET /v1/reviews/daily`; sandbox paketleri | `review_queue` durak başına satır, `anchor_on` alanı, iki dondurma sayacı (**B4 önerisi**) |
| B8 | Derslik, Kurul Kartı, Günlük Tekrar, Metro Haritası ekranları | 11 modül, 100 durak, kart ≤60 kelime, durak renkleri; B8'in 1.1 örnek kartı (`Merhaba ad`) §4.1 kartıyla değiştirilir |
| B9 | İçerik kapasitesi: 600 soru şablonu (1.800 varyant gövdesi), ≥300 tekrar kartı; MVP kesiti 18 ders (1.1–1.12 + 2.1–2.6: 144 dk, 1.800 XP) | VİZYON §13 ile aynı |
| B10 | 1.1–1.4 kartları, soruları ve çapa cevapları örnek veri setine girer | §4 aynen kullanılır |

---

## Ek A. Sabit Önerileri (KANON v2 adayları)

| anahtar | KANON v1 değeri | önerilen değer | gerekçe |
|---|---|---|---|
| `mufredat.ders_sayisi` | yok | 100 ders, 11 modül (12 / 12 / 14 / 16 / 16 / 14 / 16 semt payı) | B2 §13 envanteri ve pacing ile uyumlu |
| `ders.kimlik_bicimi` | yok | `{modül}.{sıra}`; M1–M3 tek semt, M4–M11 semt başına 2 modül | VİZYON §7 ve B2 atıfları (1.11, 2.1, 2.5) korunur |
| `ders.dakika_tier` | yok (B2 §2.3'te örtük) | ders T1 8 · T2 10 · T3 12 · T4 14 dk; görev 6 · 8 · 10 · 12 dk | Pacing tablosu |
| `ders.tier_karisimi` | Liman "Tier 1–2", Kampüs "2–3", Veri Vadisi "3–4" | Liman 6 T1 + 6 T2; Kampüs 4 T2 + 12 T3; Veri Vadisi 7 T3 + 7 T4 | Aralıkların derse indirilmesi |
| `gorev.bayt_deseni_t1` | "40–80 B" | 1.1 = 40; Ruhsat zincirinde 50 / 60 / 80; T2 ×2 | Tip merdiveni Sıralama → Tamamlama → Sıfırdan |
| `ruhsat.zincir` | "3 görev = 1 Ruhsat" | işletmenin L1 konusunu prova eden ardışık 3 dersin görevi | Ruhsat zincirleri §2 |
| `ders_muhuru.y_sorusu` | Kod Yazma AI sorusu listesinde yok | ders içi Kod Yazma: sandbox, puan = geçen test %, K / Ç / H ile aynı XP ve mühür kuralı | VİZYON §10 "Kod Yazma: sandbox" |
| `gunluk_tekrar.vade` | "1-3-7-21 gün" | mühür gününe göre sabit T0+1 / +3 / +7 / +21; altın = 3 ardışık doğru; yanlışta T0 := bugün; 3 dk yumuşak hedef | İfade tek okumaya bağlanır (§8) |
| `semt_sinavi.giris` | "Sev. N + önceki sınav" | semtin tüm dersleri mühürlü; seviye eşiği kapıyı açar, sınavı değil | B2 §11.1 ile aynı okuma |
| `semt_sinavi.bulut_tepesi` | "semt başına 1"; 7. semtin ardı yok | mezuniyet sınavı: ödül aynı, kapı işlevi yok, 7. Semt Madalyası | Tanım boşluğu |
| `otopark.l3_kapisi` | "enum, Atölyeler" (B2: 3.2) | 3.2 `enum` + 3.3 `exception` + 3.4 aşırı yükleme; kapı = 3.4 | VİZYON L3 üç kavram ister |

---

**Revizyon Notu (3 Kasım).** KANON v2 (§12) uyumu: Açık Soru 1, 3, 8 çözüldü (Otopark L3 kapısı 3.4; Günlük Tekrar sabit takvim; Liman Sınavı MVP'de 2.1–2.6); Ek A satırlarının tümü KANON §12.3'te kabul edildi; B2/B5'teki 3.2 → 3.4 düzeltildi; Sev. 2 eşiği = Ders 1.1'in 3. Usta sorusu (KANON §12.3). Sayılar değişmedi: 11 modül, 100 ders, 1.125 dk ders / 2.191 dk toplam (36,5 sa). Ayrıntı: `_KANON-v2-degisiklikler.md`.
