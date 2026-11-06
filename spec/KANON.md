# KodKent KANON — Sabitler Sayfası

**Sürüm: v2 (v1 + §12)** · Tarih: 2026-11-02 (v1) / 2026-11-03 (§12) · Sahibi: Baş tasarımcı · Kaynak: `A-vizyon-FINAL.md` (Jüri Kararları bölümü)

> Bu sayfa, sonraki tüm ajanların ve belge yazarlarının **uymak zorunda olduğu** sabitlerdir. Bir belge bu sayfayla çelişirse KANON geçerlidir. Değişiklik yalnızca yeni sürüm numarası ve Değişiklik Günlüğü kaydıyla yapılır. Buradaki sayılar lansman öncesi simülasyonla "ayarlanabilir" olsa da, ayar yapılana kadar her belge bu değerleri kullanır.

## 1. Kimlik

| Öğe | Sabit değer | Kural |
|---|---|---|
| Ürün adı | **KodKent** | Metin gövdesinde her yerde "KodKent"; alternatif adlar yalnızca ek bölümde |
| Slogan | **"Oyunlarla yazılım öğreniyorum."** | Karşılama ekranı, mağaza sayfası, video açılışı |
| Alt slogan | **"Kod yaz, şehrini kur."** | Tabela ve Pazar dili |
| Yumuşak para | **Bayt** (çoğul: Bayt) | Kısaltma **B** (ör. "300 B"); ikon: madeni para; ₿ kullanılmaz; satın alınamaz, transfer edilemez |
| Premium para | **Çip** (çoğul: Çip) | Kısaltma yok, hep "Çip" yazılır; ikon: turkuaz mikroçip; yalnızca kozmetik/konfor |
| Deneyim puanı | **XP** | Büyük harf; ikon: yıldız; "Sev. N" seviye kısaltması |
| Oyun içi para birimi (simülasyon) | **TL** | Yalnızca işletme simülasyonunda; kur **10 TL = 1 B** |
| Dil | Türkçe | Teknik terimler İngilizce kalabilir (API, sandbox, LINQ); C# tanımlayıcıları Çarşı–Liman'da Türkçe, Atölyeler'den itibaren İngilizce |
| Hedef kitle | 13–25, Türkiye | 13 altı kayıt olamaz; 13–17 veli onayı (SMS linki, 72 saat; onaya kadar serbest metin sohbet kapalı) |
| Platform | Web-öncelikli (masaüstü + mobil tarayıcı/PWA) | "Mobilde okunur, masaüstünde yazılır" |
| Backend / AI / sandbox | .NET (ASP.NET Core) + PostgreSQL + Redis / Claude API (`claude-sonnet-5-5`, `claude-haiku-5-5`, `claude-opus-5-5`) / gVisor + Roslyn | SABİT (brief) |

## 2. Şehir

### 2.1 Semt listesi

| # | Semt | Tema / atmosfer | C# konu kümesi | Açılış | Usta NPC | Kişiliği (1 cümle) |
|---|---|---|---|---|---|---|
| 1 | **Çarşı** | Tenteli dükkânlar, pazar sesleri (Tier 1) | Değişkenler, türler, operatörler, tam sayı bölmesi, `Math`, `if/else if/else`, `switch`, döngüler, metotlar, `string` | Sev. 1 | **Usta Defne** | Sıcak, sabırlı, benzetmeci: "Değişken bir kutu; `int` kutunun üstündeki etiket." |
| 2 | **Liman** | Konteynerler, martı, vinç (Tier 1–2) | Diziler, `List<T>`, `Dictionary`, `foreach`, sıralama/arama, `string.Split`, hata ayıklama temelleri | Sev. 6 + Çarşı Sınavı | **Usta Kerem** | Pratik, hızlı, liman jargonu: "Liste bir konteyner dizisi; `foreach` vinç." |
| 3 | **Atölyeler** | Tuğla, kıvılcım, çekiç sesi (Tier 2) | Sınıf, nesne, kapsülleme, kalıtım, `interface`, `enum`, `struct`, `record`, `exception`; İngilizce adlandırmaya geçiş | Sev. 12 + Liman Sınavı | **Usta Nehir** | Titiz, tasarım kokusu bulur: "Bu sınıf üç iş yapıyor; bir atölyede üç usta olmaz." |
| 4 | **Kampüs** | Çimen, amfi, Lonca Binası (Tier 2–3) | Generics, LINQ, delegate/event, lambda, extension, pattern matching, `DateTime`, dosya ve JSON | Sev. 18 + Atölye Sınavı | **Usta Baran** | Meraklı, en Sokratik, esprili: "Sorguyu bana sormadan önce veriye sor." |
| 5 | **Finans Bölgesi** | Cam kuleler, gece neonu (Tier 3) | `async/await`, `Task`, `HttpClient`, hata dayanıklılığı, unit test, Git temelleri | Sev. 25 + Kampüs Sınavı | **Usta Elif** | Disiplinli, "önce test": "Çalıştı demek yetmez; kanıtı nerede?" |
| 6 | **Veri Vadisi** | Sunucu çiftliği, nehir (Tier 3–4) | SQL temelleri, EF Core, migration, repository, ilişkiler, transaction | Sev. 32 + Finans Sınavı | **Usta Selin** | Düzenli, şemacı: "Veri yalan söylemez; şema söyler." |
| 7 | **Bulut Tepesi** | Bulutların üstünde, şehir manzarası (Tier 4) | ASP.NET Core Web API, REST, DTO, DI, middleware, auth, SignalR temelleri, dağıtım | Sev. 40 + Veri Sınavı | **Usta Yusuf** | Sistemci, büyük resim: "Şehirdeki her dükkân konuşabilmeli; API bu." |

"Usta" sözcüğü yalnızca NPC öğretmenler için kullanılır; oyuncu unvanı değildir. Otopark müşterisi NPC: **Hasan Abi**. Gizli testleri çalıştıran ve Hata Bildirimi getiren NPC: **Müfettiş**. Puanlayıcı: **Kurul** (kişiliksiz, görünmez; ekranda mühürlü kart).

### 2.2 Ortak yapılar

| Yapı | Resmî ad | Yapısı |
|---|---|---|
| Meydan | **Derleyici Meydanı** (kısaca Meydan) | Doğma noktası; tramvay durağı, LED pano, Liderlik Panosu, Pazar, Arena (v1.2); 40 avatarlık shard; saat başı "Meydan Sorusu" |
| Akademi | **Akademi** | Meydan'ın kuzeyinde tek bina; semt başına bir **Kürsü** (derslik), bir **Atölye** (görev alanı) ve ortak **Lobi** (Kalfa Yardımı, v1.2); kürsüler semt açılmadan gezilebilir, dersler kilitli |
| Oyuncu evi | **Oda** (konut bölgesi: **Bloklar**) | Başlangıç tipi **Stüdyo** (6×6 ızgara, 25 eşya, Sev. 2); **Daire** (8×8, 2.000 B, Sev. 10); **Çatı Katı** (iki oda, 6.000 B, Sev. 20); kapasite 20 avatar |
| Mağaza | **Pazar** | Bayt rafları (Sıradan/Şık/Nadir) + **Butik** (Çip; Premium) + **Rütbe Rafı** (yalnızca Nişan sergisi, satılmaz); haftalık rotasyon |
| Kod sergisi | **Vitrin** | L2+ işletmede çerçeveli ekran; kod + Savunma cevabı; "Not bırak" (v1.1) |
| Yetenek ağacı | **Metro Haritası** | Semt = hat, ders = durak; renkler gri → sarı → yeşil → altın |
| Kilitli semt görünümü | **İnşaat halinde** + **Turist modu** | Vinç/iskele + "X: Y Sınavı'ndan sonra açılıyor" tabelası; gezilebilir, arsa alınamaz |

## 3. İlerleme

### 3.1 Unvan bantları ve tavan

| Seviye aralığı | Unvan | Not |
|---|---|---|
| 1–5 | **Çırak** | Çarşı |
| 6–11 | **Kalfa** | Liman |
| 12–17 | **Zanaatkâr** | Atölyeler |
| 18–24 | **Mühendis** | Kampüs |
| 25–31 | **Baş Mühendis** | Finans Bölgesi |
| 32–39 | **Mimar** | Veri Vadisi |
| 40–59 | **Şehir Mimarı** | Bulut Tepesi |
| 60 | **Efsane** | Sev. 60 **ve** en az 10 Mentor kilometre taşı (v1.2) |

Seviye tavanı **60**. Günlük XP tavanı yok; tekrar edilen görev/ders 0 XP.

### 3.2 XP eğrisi

- Seviye L'den L+1'e geçiş: **`XP(L) = yuvarla10(80 × L^1,35)`**
- Seviye L'ye ulaşmak için toplam: **`Toplam(L) = Σ XP(k), k = 1..L−1`**; `Toplam(60) = 503.680`

| Seviye L | XP(L) (L → L+1) | Toplam(L) | Unvan |
|---|---|---|---|
| 1 | 80 | 0 | Çırak |
| 2 | 200 | 80 | Çırak |
| 3 | 350 | 280 | Çırak |
| 4 | 520 | 630 | Çırak |
| 5 | 700 | 1.150 | Çırak |
| 6 | 900 | 1.850 | Kalfa |
| 7 | 1.110 | 2.750 | Kalfa |
| 8 | 1.330 | 3.860 | Kalfa |
| 9 | 1.550 | 5.190 | Kalfa |
| 10 | 1.790 | 6.740 | Kalfa |
| 12 | 2.290 | 10.570 | Zanaatkâr |
| 18 | 3.960 | 28.380 | Mühendis |
| 25 | 6.170 | 62.590 | Baş Mühendis |
| 32 | 8.610 | 112.990 | Mimar |
| 40 | 11.640 | 192.330 | Şehir Mimarı |
| 60 | — | 503.680 | Efsane |

### 3.3 XP kaynakları

| Kaynak | T1 | T2 | T3 | T4 | Kural |
|---|---|---|---|---|---|
| Ders (toplam) | **100** | 180 | 280 | 400 | Kartlar 10 + 3 Usta sorusu (3 × 30 taban); **ilk ders (1.1) = 100 XP**; ortalama T1 dersi 100 XP |
| AI sorusu (Kavram / Çıktı Tahmini / Hata Avı) | 30 taban | 54 | 84 | 120 | **XP = taban × puan/100**; geçince (≥70) en az %50; denediyse en az 5; 85+ parlak ×1,2 (T1 aralığı **5–36 XP**); 2. deneme %80 |
| Görev (ilk tamamlama) | 60 | 100 | 160 | 250 | Tekrar 0 |
| İşletme açılışı (Savunma dâhil) | 300 | 600 | 1.200 | 2.000 | Deneme açılışı %50 |
| İşletme yükseltme (L2–L5) | 150 / 250 / 400 / 600 | — | — | — | Tier'dan bağımsız |
| Günlük Tekrar | 15 | | | | Günde 1 |
| Semt Sınavı | 200 | | | | Semt başına 1 |
| Keskin Göz / Berrak Zihin / kod incelemesi | 50 / +%15 / 10–30 | | | | Bonus |
| Hata Bildirimi | 40 | 60 | 100 | 150 | Günde 3 |
| Mentor kilometre taşı (v1.2) | 50 | | | | Menti Semt Sınavı geçince |

## 4. Ekonomi sabitleri

| Öğe | Değer |
|---|---|
| Başlangıç bakiyesi | **0 B, 0 Çip**; ilk Bayt ≈20. dakikada "Meydan Saati" görevinden (40 B) |
| Görev ödülleri (Çarşı 1.1–1.4) | Meydan Saati 40 B · Dakikadan Saate 50 B · Kademeli Karar 60 B · Taksimetre 80 B; T1 aralığı 40–80 B, tier ile ×2/×4/×8 |
| Ruhsat | 3 görev = 1 Ruhsat; tamamlanınca **+100 B Belediye teşviki** |
| İşletme geliri | Oyuncunun kodunun sentetik trafikte ürettiği TL / 10, **referans çözümle tavanlı**; AI çarpanı yok |
| Kasa | 8 saatlik üretimi tutar; dolunca üretim durur (kayıp yok); günde 3 toplama = tam gelir |
| Otopark L1 | 12 araç/gün (dağılım %45 / %35 / %18 / %2), ≈2.220 TL → **≈220 B/gün**, kasa ≈73 B; L2–L5 trafik 20/30/40/50 araç, gelir ×1,6/seviye |
| Deneme modu | Gizli test kalan veya Savunma başarısız → gelir %50; 24 saat sonra yeni hak |
| Eşzamanlı işletme | `1 + ⌊seviye/6⌋`; her türden 1 |
| Yükseltme fiyatları | L2 500 · L3 1.200 · L4 2.500 · L5 5.000 B |
| Günlük Tekrar | 5 soru, 3 dk, 20 B + 15 XP + seri; seri 7 → ×1,5; haftada 1 ücretsiz dondurma; Seri Dondurucu 50 B |
| Hata Bildirimi | 40–120 B, günde 3 |
| Semt Sınavı ödülü | 500 B + 10 Çip + 200 XP + Semt Madalyası |
| Lig ödülü | 0–300 B (Pazar 21:00); alkış 2 B, günde en çok 40 B |
| Giderler | Bakım, kira, bozulma **yok**; Bayt transferi, hediye, ticaret, bahis **yok** |
| Çip | 100 Çip ≈ 60 TL (varsayım); kazanım yalnızca Semt Sınavı (10 Çip); Çip ile asla: XP, Bayt, ipucu, test hakkı, süre, işletme, Ruhsat, kasa tavanı |
| Oda eşyası / kıyafet | 40–400 B / 30–800 B; tabela-neon 150–600 B; takma ad değişimi 500 B; işletme adı 200 B |

## 5. İşletme kataloğu

| # | İşletme | Semt | Açılış sev. | Fiyat (B) | Seviye sayısı (L) | L1'in öğrettiği konu |
|---|---|---|---|---|---|---|
| 1 | **Otopark** (kanonik ilk) | Çarşı | 3 (+ Ruhsat 3/3) | 300 | 5 | `if/else if`, metot, başlayan saati yukarı yuvarlama |
| 2 | Büfe | Çarşı | 4 | 600 | 4 | Aritmetik, `decimal`, para üstü ve döngüyle bozukluk |
| 3 | Manav | Çarşı | 5 | 900 | 4 | Döngüler, `switch`, miktara göre indirim kademesi (otopark şemasının 2. yüzeyi) |
| 4 | Kargo Deposu | Liman | 6 | 1.500 | 4 | Diziler, `List<T>`, envanter sayımı |
| 5 | Balık Hali | Liman | 8 | 2.200 | 4 | `Dictionary` fiyat listesi, `string.Split` |
| 6 | Oto Yıkama | Liman | 9 | 2.500 | 3 | `List` + paket ve ek hizmet listesiyle kademeli fiyat (3. yüzey) |
| 7 | Gümrük | Liman | 10 | 3.000 | 4 | Arama, sıralama, plaka doğrulama |
| 8 | Oto Tamirhane | Atölyeler | 12 | 5.000 | 4 | Sınıf, kalıtım (araç hiyerarşisi) |
| 9 | Mobilya Atölyesi | Atölyeler | 14 | 6.500 | 4 | Nesne, kapsülleme, sipariş nesneleri |
| 10 | Trafo Merkezi | Atölyeler | 16 | 8.000 | 4 | `interface`, `enum`, `exception` |
| 11 | Kütüphane | Kampüs | 18 | 10.000 | 4 | LINQ sorguları, gün bazlı gecikme cezası (4. yüzey) |
| 12 | Sinema | Kampüs | 20 | 14.000 | 4 | Generics, `DateTime`, koltuk rezervasyonu |
| 13 | Haber Ajansı | Kampüs | 23 | 18.000 | 3 | delegate/event, JSON akışı |
| 14 | Banka | Finans Bölgesi | 25 | 25.000 | 4 | `async/await`, `Task`, işlem kuyruğu |
| 15 | Sigorta | Finans Bölgesi | 28 | 30.000 | 4 | Kural motoru + unit test |
| 16 | Borsa Panosu | Finans Bölgesi | 30 | 35.000 | 3 | `HttpClient`, veri akışı, dayanıklılık |
| 17 | Hastane Kayıt | Veri Vadisi | 32 | 50.000 | 4 | EF Core, migration |
| 18 | Otel | Veri Vadisi | 36 | 65.000 | 4 | İlişkiler, repository, transaction |
| 19 | Yemek Sipariş Platformu | Bulut Tepesi | 40 | 90.000 | 4 | Web API, REST, DTO |
| 20 | Şehir Uygulaması (capstone) | Bulut Tepesi | 45 | 120.000 | 3 | DI, auth, middleware; lonca sürümü (v2) |

MVP'de açık: #1 (L1–L2), #2, #4. Diğerleri "inşaat halinde" görünür.

### 5.1 Otopark Tier 1 — müşteri isteği (birebir, Hasan Abi)

> "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum."

**Sözleşme Kartı (Gereksinim Netleştirme sonrası, sabit):**

| Madde | Kural |
|---|---|
| 1 | Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL |
| 2 | Dilimi **ham kalış süresi** belirler: `dakika < 120` → 1. dilim; `120 ≤ dakika ≤ 360` → 2. dilim (sınırlar dâhil); `dakika > 360` → günlük |
| 3 | Başlayan saat tam sayılır: `saat = ceil(dakika / 60)`; 1. dilim `saat × 100`, 2. dilim `saat × 40` |
| 4 | 24 saati aşan kalış: her **başlayan gün** 250 (`gun = ceil(dakika / 1440)`, `gun × 250`) |
| 5 | İmza: `public static int Otopark.UcretHesapla(int dakika)`; dönüş TL, tam sayı |
| 6 | Anomali (119 → 200, 120 → 80) müşterinin bilinçli kararıdır; fark eden oyuncu **Keskin Göz** (+50 XP) |

**Testler: 6 açık + 14 gizli + 6 tohumlu (oyuncuya özel rastgele) = 26.**

| Dakika | TL | Tür |
|---|---|---|
| 30 / 61 / 120 / 121 / 361 / 1.441 | 100 / 200 / 80 / 120 / 250 / 500 | Açık |
| 0 / 1 / 59 / 60 / 119 / 180 / 359 / 360 | 0 / 100 / 100 / 100 / 200 / 120 / 240 / 240 | Gizli |
| 720 / 1.439 / 1.440 / 2.880 / 2.881 / 100.000 | 250 / 250 / 250 / 500 / 750 / 17.500 | Gizli |

**Referans çözüm (yalnızca sunucuda):**

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

**Sonraki seviyeler:** L2 abone listesi (`List<string>`, Liman) · L3 indirim + bozuk kayıtta `ArgumentOutOfRangeException` (`enum`, Atölyeler) · L4 gece tarifesi (`DateTime`, Kampüs) · L5 kapasite/kuyruk (Finans).

## 6. Ekran listesi (adlar sabittir)

| # | Ekran | İçerik | MVP |
|---|---|---|---|
| 1 | **Giriş** | Telefon + SMS OTP (6 hane, 90 sn, 60 sn'de yeniden gönder, 5 deneme/saat), doğum yılı, veli onayı adımı | ✓ |
| 2 | **Dil Seçimi** | 6 kart: C# açık; Python, JavaScript, Java, Kotlin, Go "yakında — haber ver" | ✓ |
| 3 | **Avatar Atölyesi** | Yüz, saç, kıyafet (12 kombinasyon), takma ad (moderasyon) | ✓ |
| 4 | **Derleyici Meydanı** | İzometrik sokak, 40 avatarlık shard, LED pano, balon sohbet | ✓ |
| 5 | **Şehir Haritası** | Semtler, inşaat halinde kilitler, "Satılık" tabelaları, hedef işaretçisi | ✓ |
| 6 | **Akademi Lobisi** | Kürsü kapıları, Atölye girişi, Lobi (v1.2) | ✓ |
| 7 | **Derslik** | Kart akışı (≤60 kelime), PRIMM adımları, 1 satırlık mini editör | ✓ |
| 8 | **Kurul Kartı** | Usta sorusu, rubrik (üstte), cevap kutusu, kriter gerekçeli puan, itiraz butonu | ✓ |
| 9 | **Atölye** | Görev editörü (Monaco), açık testler, ipucu merdiveni, Türkçe hata paneli | ✓ |
| 10 | **İşletme Sokağı** | İşletme dış görünümü, tabela, kasa, NPC trafiği, Alkış | ✓ |
| 11 | **İş Emri** | Müşteri diyaloğu, "Müşteriye Sor" paneli, Sözleşme Kartı | ✓ |
| 12 | **İşletme Editörü** | İskelet kod, açık testler, Müfettiş (gizli test) paneli, şikâyet balonları | ✓ |
| 13 | **Savunma** | Kurul'un seçtiği satır, açıklama kutusu, sonuç (Açılış / Deneme) | ✓ |
| 14 | **İşletme Paneli** | Gelir grafiği (TL ve B), kasa, yükseltme listesi, Hata Bildirimi dosyaları, Vitrin ayarı | ✓ |
| 15 | **Metro Haritası** | Hatlar, duraklar, renkler, altın durak sayacı | ✓ |
| 16 | **Günlük Tekrar** | 5 soru, 3 dk, seri sayacı, dondurma | ✓ |
| 17 | **Oda** | 6×6 ızgara, eşya yerleştirme, ziyaretçi defteri | ✓ |
| 18 | **Dolap** | Kıyafet, aksesuar, emote çarkı, Nişan vitrini | ✓ |
| 19 | **Pazar** | Bayt rafları, Butik (Çip), Rütbe Rafı, haftalık rotasyon | ✓ |
| 20 | **Vitrin** | Kod sergisi, Savunma cevabı, notlar (v1.1) | ✓ (salt okunur) |
| 21 | **Profil & Rozet Duvarı** | Unvan, seviye, Nişan'lar, işletme portföyü, "kodu dışa aktar" | ✓ |
| 22 | **Liderlik Panosu** | Haftalık lig, Kalıcılık Ligi, En Hızlı Otopark, en kazançlı işletme | ✓ |
| 23 | **Sohbet & Arkadaşlar** | Meydan/oda sohbeti, DM (arkadaş), davet kodu, güvenli mod | ✓ |
| 24 | **Ayarlar & Hesap** | Bildirim, veli durumu, KVKK metinleri, veri silme, dil kartları bekleme listesi | ✓ |

HUD (XP çubuğu, Bayt, Çip, görev kartı, hedef çubuğu) ekran değil, sabit katmandır. Arena (v1.2) ve Lonca Binası (v1.1) sonraki sürüm ekranlarıdır.

## 7. Çekirdek döngü — resmî adlar

**Öğren → Uygula → İnşa Et → Kazan → Harca → Göster.** Günlük mini döngü: **Günlük Tekrar**. İşletme alt akışı: **Tapu → İş Emri → Gereksinim Netleştirme → Kod → Müfettiş → Savunma → Açılış**.

## 8. Tipler ve kademeler

| Küme | Sabit adlar |
|---|---|
| Soru tipleri (4) | **Kavram Sorusu** · **Çıktı Tahmini** · **Hata Avı** · **Kod Yazma** |
| Görev tipleri | **Sıralama** (Parsons) · **Tamamlama** · **Sıfırdan** · **Hata Bildirimi** · **İş Emri** (işletme kodu) · **Semt Sınavı** · **Günlük Tekrar** · **Lonca Görevi** (v1.1) |
| İpucu merdiveni (4) | **Pusula** → **Fener** → **Taslak** → **Örnek** (içerik bankasından; ücretsiz, sınırsız) |
| Kozmetik nadirlik (5) | **Sıradan** (Bayt, gri) · **Şık** (Bayt, mavi) · **Nadir** (Bayt/rotasyon, mor) · **Premium** (Çip, turkuaz, statik) · **Nişan** (yalnızca kazanılır, altın çerçeve + animasyon) |
| İşletme durumları | **Satılık** · **Kapalı — yazılım bekliyor** · **Deneme** (%50 gelir) · **Açık** · **Kararmış** (kod bozuk) |
| Lig kademeleri | Bronz → Gümüş → Altın → Elmas (30 kişilik kova; terfi ilk 7, düşme son 5) |
| Durak renkleri | Gri → Sarı → Yeşil → Altın |

## 9. AI ve puanlama sabitleri

| Öğe | Değer |
|---|---|
| Modeller | Puanlama/diyalog `claude-sonnet-5-5`; ön eleme/moderasyon `claude-haiku-5-5`; itiraz/içerik üretimi `claude-opus-5-5`; structured output + prompt caching |
| Rubrik | 0–100: Doğruluk 50 / Tamlık 30 / Açıklık 20; cevap kutusunun üstünde görünür |
| Eşikler | ≥70 geçer; 85+ parlak (+%20 XP); <40 ders kartı önerisi; Ders Mührü = 3 sorudan 2'si ≥70; Telafi Turu 10 dk sonra |
| Deneme | Soru başına 2 (2. deneme %80 XP); Usta takip sorusu en çok +10 telafi puanı |
| Güven | <0,65 veya 70 ± 5 → Opus kör ikinci okuma; ≥15 puan ayrışma → oyuncu lehine |
| İtiraz | Soru başına 1, günde 3; Opus kör; fark ≥15 ise geçerli; ceza yok |
| Kalibrasyon | Soru tipi başına 300 cevaplık altın küme (2 eğitmen); kappa ≥ 0,75; |AI − insan| ≤ 10 puan %85; haftada 200 örneklem |
| Kota | Günde 30 AI puanlamalı etkileşim; aşımda gece Batch API ile puanlama, ders kilitlenmez |
| Maliyet hedefi | ≈0,0033 $/puanlama; ≈0,05 $/DAU/gün; alarm 0,08 $ |
| Geri bildirim formülü | 1 doğru şey + 1 eksik + 1 sonraki adım; ≤80 kelime; emoji yok; isimle hitap |
| Enjeksiyon | Oyuncu metni her zaman veri; "puan ver" talimatı → 0 puan + mizahi uyarı; Usta'nın aracı yok; cevap ≤1.500 karakter |
| Kopya | AST benzerliği >%95 veya yazım <30 sn → Savunma zorunlu, Bayt sonra ödenir |
| Sandbox | gVisor (runsc), ağ yok, 256 MB / 2 vCPU / 10 sn duvar saati, salt okunur FS, Roslyn bellek içi derleme, 20 ısıtılmış container, Redis kuyruğu; p95 < 6 sn |
| Hata çevirisi | En sık 50 CS kodu statik Türkçe tablo; kalanı Haiku |

## 10. Sözlük

| Terim | Tanım |
|---|---|
| **Akademi** | Derslerin anlatıldığı bina; Kürsü, Atölye ve Lobi'den oluşur |
| **Açılış** | Tüm testler + Savunma geçince işletmenin tam gelirle çalışmaya başladığı an |
| **Alkış** | Ziyaretçinin bir oda/işletmeye günde 1 kez verdiği beğeni; 2 B bonus |
| **Bayt (B)** | Kazanılan yumuşak para; satın alınamaz, transfer edilemez |
| **Belediye teşviki** | Ruhsat tamamlanınca verilen 100 B |
| **Berrak Zihin** | İpuçsuz ilk denemede +%15 XP bonusu |
| **Butik** | Pazar'ın Çip rafı (Premium kozmetik) |
| **Çip** | Premium para; yalnızca kozmetik/konfor |
| **Deneme modu** | Gizli test kalan ya da Savunma'sı başarısız işletmenin %50 gelirle çalışması |
| **Ders Mührü** | Dersin 3 Usta sorusundan 2'sinde ≥70 alınınca açılan görev kilidi |
| **Derleyici Meydanı** | Şehrin merkezi, doğma noktası |
| **Gereksinim Netleştirme** | Kod yazmadan önce müşteriye en az 4 soru sorulan zorunlu adım; Sözleşme Kartı üretir |
| **Günlük Tekrar** | Aralıklı tekrar (1-3-7-21 gün) kuyruğundan 5 soruluk günlük 3 dakikalık görev |
| **Hasan Abi** | Otoparkın NPC müşterisi; kurucunun kurallarını birebir söyler |
| **Hata Bildirimi** | Müfettiş'in getirdiği, sentetik hatalı kodu ayıklama görevi |
| **İş Emri** | İşletme için müşteri isteğini taşıyan görev kartı |
| **Kalfa Yardımı** | Sev. 18+ oyuncuların Akademi Lobisi'nde yaptığı mentorluk (v1.2) |
| **Kalıcılık Ligi** | Altın durak sayısına göre ikinci liderlik tablosu |
| **Kasa** | İşletme gelirinin biriktiği, 8 saatlik üretimi tutan nesne |
| **Keskin Göz** | 119/120 anomalisini fark eden oyuncunun rozeti (+50 XP) |
| **Kurul** | Kişiliksiz, rubrik tabanlı AI puanlayıcı; ekranda mühürlü kart |
| **Metro Haritası** | C# konu haritası (yetenek ağacı) |
| **Müfettiş** | Gizli testleri çalıştıran, şikâyet balonlarını ve Hata Bildirimi dosyalarını getiren NPC |
| **Nişan** | Yalnızca beceriyle kazanılan, satın alınamayan kozmetik kademesi |
| **Pazar** | Kozmetik ve eşya mağazası |
| **Referans çözüm** | Sunucudaki doğru çözüm; gelir tavanı ve mutasyon kaynağı |
| **Ruhsat** | 3 görev parçasından oluşan işletme satın alma ön koşulu |
| **Savunma** | Açılış öncesi Kurul'un oyuncunun kendi kodundan seçtiği satırı açıklatması |
| **Semt Sınavı** | Yeni semt kapısı: 20 dk, 3 kod + 3 Usta sorusu, interleaving |
| **Seri Dondurucu** | 50 B'ye alınan, seriyi 1 gün koruyan eşya |
| **Sözleşme Kartı** | Gereksinim Netleştirme'nin ürettiği sabit kabul kriterleri listesi |
| **Tapu** | İşletme arsasının satın alınması; kod yazılmadan "Kapalı — yazılım bekliyor" |
| **Telafi Turu** | Ders Mührü alınamayınca 10 dk sonra açılan farklı 3 soruluk tur |
| **Tier** | Semt zorluk katmanı (1–4); XP ve Bayt çarpanlarını belirler |
| **Turist modu** | Kilitli semtin gezilebilir ama arsa alınamaz hâli |
| **Usta** | Semt başına bir AI öğretmen NPC; yalnızca NPC unvanıdır |
| **Vitrin** | İşletme içindeki kod sergisi |

## 11. Değişiklik Günlüğü

| Sürüm | Tarih | Değişiklik |
|---|---|---|
| v1 | 2026-11-02 | İlk yayın. Üç vizyon belgesi ve iki jüri turu birleştirildi; 22 çelişki karara bağlandı (`A-vizyon-FINAL.md` §14). Otopark dilim yorumu (ham dakika), 24+ saat kuralı (başlayan gün 250), imza (`Otopark.UcretHesapla(int) : int`), XP eğrisi (80 × L^1,35, tavan 60), gelir kaynağı (oyuncu kodu, referans tavanlı), fiyat ve kapı (300 B + Sev. 3 + Ruhsat), Kurul/Usta ayrımı, Günlük Tekrar, bakım ve transfer yasağı sabitlendi. |
| v2 | 2026-11-03 | 7578 sayılı Kanun nedeniyle asgari kayıt yaşı 15 (`min_kayit_yasi`), hedef kitle 15–25, 13–14 yolu MVP dışı; belgeler arası 22 çelişki tek değere bağlandı; B1–B9 Ek A kabul / ret; kapak sayıları ve belge kimlikleri tek kaynak. §1 (Hedef kitle) ve §6 (Giriş içeriği) §12.2 ile okunur; diğer v1 sabitleri değişmedi (§12). |

Sonraki sürüm kuralı: Sayısal bir sabit değişirse sürüm `v1.1`, yapısal bir sabit (semt, imza, döngü adı, ekran adı) değişirse `v2` olur; her değişiklik bu tabloya gerekçesiyle yazılır.

## 12. v2 Kararları (3 Kasım 2026)

> **Okuma kuralı.** Bu bölüm §1–§11'i (v1) silmez ve yeniden yazmaz; çelişkide **§12 geçerlidir**. **§5.1 (Otopark Tier 1: müşteri isteği, Sözleşme Kartı, 26 test, referans çözüm) DEĞİŞMEZ.** Korunan ilkeler: çekirdek akış **satın al → kodla → kazan**, otopark kuralları birebir, öğrenme asla paralı değildir (pay-to-learn yok), **Bayt satılmaz**. Kaynak: B1–B9 "Ek A" ve "Açık Sorular" bölümleri ile belgeler arası tutarlılık taraması; yama listesi `spec/_KANON-v2-degisiklikler.md`.

### 12.1 Beş ana karar (özet)

1. Asgari kayıt yaşı **15** (`min_kayit_yasi=15`), hedef kitle **15–25** (§12.2).
2. 13–14 yolu MVP dışı ve hukuk teyidine bağlı; 15–17 için güvenli mod + veli onayı + e-Devlet yaş doğrulama.
3. Ekran sayısı **24** kalır; Ebeveyn Paneli ekran değil, SMS linkiyle açılan ayrı web sayfasıdır.
4. MVP **12 hafta** (+2 hafta yalnızca G0 kararıyla); 100 ders / 11 modül / 20 işletme / 7 semt tek kaynak tablosundadır (§12.4).
5. Ek A: gap-filling sabitler kabul; ekonomiyi oynatan öneriler (Staj modu, Mesai Bonusu, Büyük Kasa, tier'li fiyat, XP eğrisi) MVP'ye alınmadı (§12.3).

### 12.2 Yasal karar: kayıt yaşı (7578 sayılı Kanun)

**Dayanak.** 7578 sayılı Kanun (5651 sayılı Kanun'a oyun / oyun platformu / sosyal ağ yükümlülükleri) ve 10 Ekim 2026 tarihli Resmî Gazete yönetmeliği, **1 Kasım 2026**'da yürürlüktedir: 15 yaş altına sosyal ağ hizmeti yasaktır; hesap açılışında e-Devlet yaş doğrulama belirteci (yalnızca 15 ve 18 eşik bilgisi) gerekir; 15–18 yaş için "ayrıştırılmış hizmet" ve ebeveyn kontrol araçları (süre sınırı, harcama limiti, satın alma onayı) zorunludur; mevcut hesaplarda doğrulama son tarihi **31 Mart 2027**'dir (doğrulanamayan hesap kapatılır, verisi silinir). Bu bilgi haber ve hukuk bürosu özetlerine dayanır; Resmî Gazete sayısı ve madde numaraları kaynaklarda tutarsızdır (B9 §8.1). **Birincil metin ve yazılı hukuk görüşü şarttır (B9 G0, H2).** KodKent sohbetli sosyal oyun olduğundan hem "sosyal ağ sağlayıcı" hem "oyun platformu" kapsamına girebilir; kabul edilen çalışma varsayımı: girer. Hukuki zorunluluk KANON'un üstündedir.

| Konu | v2 değeri (KANON §1 "Hedef kitle" satırının yerine geçer) |
|---|---|
| Yapılandırma bayrağı | `min_kayit_yasi = 15` (B9'daki `age_gate_min` ile aynı bayrak; sabit kodlanmaz, sürüm beklemeden ayarlanır) |
| Hedef kitle | **15–25**, Türkiye |
| 15 yaş altı | Hesap açılmaz. Nazik ret kartı + bekleme listesi (yalnızca e-posta, tercihen veli e-postası; telefon alınmaz, pazarlama iletisi yok; KVKK teyidine tabi) |
| 13–14 yaş | Veli onaylı yol (KANON v1 akışı; sosyal özelliksiz "Akademi Modu": ders, görev, kendi işletmesi) **hukuk teyidine bağlıdır ve MVP DIŞIdır.** Bayrak kapalı; açılırsa `min_kayit_yasi=13` ile, en erken v1.1 |
| 15–17 yaş | **Güvenli mod** (ayrıştırılmış hizmet; B6 §7.5, varsayılanlar B9 §8.2 tablosu) + e-Devlet yaş doğrulama + veli onayı (SMS linki, 72 saat). Onaya kadar kapalı: serbest metin sohbet, DM, ziyaret kabulü, Vitrin görünürlüğü, Çip harcaması. Yaş duvarı: 15–17 ↔ 18+ DM yok |
| 15–17 varsayılanları | Profil / Rozet Duvarı yalnız arkadaşlar; Vitrin kodu yalnız arkadaş / kulüp; tabela takma ad + unvan, Turist modunda gizli; Meydan sohbeti emote + hazır cümle (serbest metin veli izniyle); DM yalnız karşılıklı arkadaş, "görüldü" yok; arkadaş önerisi ve rehber eşleştirme hiçbir yaşta yok; sessiz saat 21:00–08:00; **Oda yalnızca "Arkadaşlara"** ("Herkese açık" hukuk teyidine kadar kapalı) |
| 18+ | Tam hizmet; e-Devlet yaş doğrulaması aynen uygulanır |
| Giriş akışı | telefon → SMS kodu → doğum yılı (öz beyan, saklanmaz) → **e-Devlet yaş doğrulama** → [15–17: veli telefonu] → Dil Seçimi. Saklanan: yalnızca eşik (<15 / 15–17 / 18+) ve doğrulama tarihi. §6'daki ekran adı ve sırası değişmez |
| Çip (15–17) | Aylık limit varsayılan **0**; veli SMS linki / Ebeveyn Paneli ile limit koyar (platform üst sınırı 300 Çip/ay); Sandık ve Konteyner her zaman veli onayı ister (B2 §9.3 revize) |
| Ebeveyn Paneli | **Ekran değildir**; SMS linkiyle açılan hesapsız hafif web sayfası (MVP: onay, Çip limiti, süre limiti, sohbet / DM izni; v1.1: haftalık özet). Oyun içi giriş noktası "Ayarlar & Hesap → veli durumu" satırıdır. Ekran sayısı 24 kalır |
| Yaş derecelendirmesi | KodKent beyanı **15+** |
| Mevcut / beta hesaplar | 31 Mart 2027'den önce e-Devlet doğrulaması; kapalı beta (H9–H10) bu takvimle çakışır |
| Belirteç erişilemezse | B9 Seçenek C: yalnızca 18+ kapalı beta, belirteç hazır olunca 15–17 açılır (kurucu kararı, §12.6) |

### 12.3 Çelişki kararları (tek değer) ve Ek A kabul / ret

**a) Çelişki kararları**

| # | Konu | Çelişen değerler | KARAR | Kaynak | Gerekçe |
|---|---|---|---|---|---|
| C1 | Kayıt yaşı, veli onayı | KANON §1: 13–25, 13–17; B1/B2/B3/B5/B6/B7/B8: 13–17; B9: 15 | §12.2 | B9 §8 | Kanun KANON'un üstünde |
| C2 | Ekran sayısı | KANON §6 ve B8: 24; B9 Ek A: 25 (Ebeveyn Paneli) | **24** | KANON §6 | Panel ekran değil, ayrı web sayfası (B8 §Ayarlar zaten böyle) |
| C3 | Ders / modül / saat | B4: 100 ders, 11 modül; B2: 100; B9: 18 → 46 → 62 → 84 → 100; B3: MVP 18 | **100 ders, 11 modül**; 84 yalnızca v2 sonu birikimidir | B4 | Tarama: çelişki yok; "84" B9 rakip tablosundaki v2 hedefi |
| C4 | Toplam süre | yalnızca B4 | ders 1.125 dk (18,75 sa); ders + görev + sınav 2.191 dk (36,5 sa) | B4 §0 | Tek sahip |
| C5 | AI maliyeti | KANON §9: ≈0,05 $/DAU/gün, alarm 0,08; B3: 0,057 (1k DAU), 0,049 (10k); B7: 12 etkileşim ≈0,053; B9: ≤0,045 → 0,035 → 0,02 → 0,01 | ≈0,05 yalnız **≥10k DAU**'da hedef; lansman (1k DAU) kabul bandı ≤0,057; sarı alarm 0,065, kırmızı 0,08; Kurul çağrısı ≈0,0033 $ (Haiku + Opus payı dâhil ≈0,0044) | KANON §9, B3 Ek A | Önbellek ölçeği; B9 yol haritası hedef olarak kalır |
| C6 | Çip paketleri | B2 §9.3 = B8 = B9 | Avuç 100 / 59,99 TL · Kutu 260 / 149,99 (+%4) · Sandık 560 / 299,99 (+%12) · Konteyner 1.200 / 599,99 (+%20) | B2 §9.3 | Çelişki yok; B9 sepeti "≈205" taban Çip (bonus dâhil ≈219), 123 TL hesabı değişmez |
| C7 | MVP süresi | VİZYON / KANON: 12 hafta; B9: 12, uyum sığmazsa 14 | **12 hafta** (H1–H12, Oca–Mar 2027); +2 hafta yalnızca G0 (H2) yazılı kararıyla | VİZYON §13, B9 | Yaş kapısı bayrak arkasında; kesme sırası B9 §3 |
| C8 | Sürüm etiketleri | B9 §4.1 ↔ B6 ↔ KANON | MVP H1–H12 · v1.1 H13–H24 · v1.2 H25–H36 · v2 H37–H52. v1.1: Lonca, Lonca Görevi, Kod Düellosu, Vitrin notu, Daire; v1.2: Arena, Kalfa Yardımı / Mentor, Çatı Katı; v2: Lonca Projesi | B9 §4.1 | B6 etiketleri aynı pencereyle uyumlu |
| C9 | Sev. 2 eşiği | VİZYON §4, B2, B7: "ilk Usta sorusunda 60 → 85 XP, 14. dk"; B4 §4.1: kartlar 10 XP, eşik 3. soruda | Sev. 2 (80 XP) **Ders 1.1'in 3. Usta sorusunda** aşılır (10 + ≈25 + ≈25 = 60 → +25 = 85); "14. dakika" ölçülecek hedeftir (H4 kâğıt testi) | KANON §3.3, B4 | KANON: kartlar 10 + 3 × 30 taban; "ilk soru" ifadesi 3. soru olarak okunur |
| C10 | Otopark L3 kapısı | B2, B5: 3.2; B4: 3.4 | **3.4** (3.2 `enum` + 3.3 `exception` + 3.4 aşırı yükleme) | B4 | Ders listesinin sahibi B4 |
| C11 | Sezon süresi | B2: 8 hafta; B6: iki takvim ayı | **İki takvim ayı (8–9 hafta)** | B6 | Sezon sahibi B6 |
| C12 | Günlük Tekrar vadesi | B4: sabit takvim; açık soru: genişleyen aralık | Mühür gününe göre sabit T0+1 / +3 / +7 / +21; gün sınırı 04:00 TR | B4 §8, B6 | KANON "1-3-7-21" tek okuma |
| C13 | Kozmetik fiyatları | B1: Şapka Çıkar 150 B (Şık), Tuşlama 100 B (Sıradan), Nadir oda eşyası 120–130 B; B2: Şık 120, Sıradan 60, Nadir oda eşyası 300–400 B | **B2 değerleri** | B2 §9 | Fiyat sahibi B2; B1 düzeltildi |
| C14 | Yürüme | B1: 8 yönlü serbest; B7 §6.5: 4 komşulu | **4 komşulu**, çapraz adım yok | B7 §6.5 | Sunucu otoritesi |
| C15 | Ceza adları | B3 `ceza_kademeleri` (3 kademe) ↔ B6 Ç0–Ç6 | İki ayrı merdiven: **Puanlama İhlal Kademesi PK1–PK3** (B3; yalnız puanlama) ve **Ç0–Ç6** (B6; yalnız sosyal yüzey) | B3, B6 | Öğrenme hiçbirinde kapanmaz |
| C16 | Kurul JSON | B3 = B8; brief/02 §E.3: `guven` yok, "en çok 60 kelime" | B3 şeması bağlayıcı: `puan`, `olcutler[{ad,puan,not}]`, `geri_bildirim` (≤80 kelime), `takip_sorusu`, `guven`, `kopya_suphesi` | B3 | Alan adları değişmez; prototip uyumu §12.7 |
| C17 | İşletme fiyat / seviye / gelir | KANON §5 ↔ B2 §7 ↔ B5 §2 | 20 işletmenin fiyat, açılış seviyesi, L sayısı (toplam 77) ve L1 geliri üç belgede aynı (tarama 20 / 20) | KANON §5 | Otopark L2–L5 geliri: KANON ×1,6 kuralı hedef, B5 profilleri ±%3 uygular |
| C18 | XP / seviye | KANON §3 ↔ B2 ↔ B4 | `XP(L)=yuvarla10(80×L^1,35)` doğrulandı: Toplam(25) 62.590, Toplam(40) 192.330, Toplam(60) 503.680. B4 tek seferlik müfredat XP'si 41.350 (tier karışımı: Kampüs −640, Veri Vadisi −1.470 XP, B2 §4.5'e göre) | KANON §3.2, B4 | B4 tier karışımı geçerli |
| C19 | Büyük Kasa | B7 kod yorumu: 12 saat (B2 önerisi); KANON: Kasa 8 saat | MVP'de **8 saat**; Büyük Kasa v1.1 | KANON §4 | B9 lavabo paketi v1.1 |
| C20 | Hata Bildirimi Bayt'ı | KANON: 40–120 B, XP 40 / 60 / 100 / 150; B5: 40 / 60 / 90 / 120 | B5 değerleri (KANON aralığında) | B5 §7 | Mutasyon ortalaması 63,75 B |
| C21 | Uç nokta sayısı | B7 §5.3: 138; B8 §17.11: 6 eksik uç; B7 §11.5: 7 Yaş Kapısı ucu; B7 §0/§12.3: 151 | **151** (138 temel katalog + 6 B8 talebi + 7 Yaş Kapısı v2; B7 §12.3) | B7 | Sahibi B7; B7 tamamlandı, yeniden sayıldı |
| C22 | Meydan Sorusu | KANON: saat başı; B6: 08:00–23:00 (16 soru) | Saat başı, 08:00–23:00 arası | B6 | Uyku saatleri |

**b) Ek A kabul / ret** (ölçüt: akışı koru; Bayt satılmaz; pay-to-learn yok; §5.1 değişmez)

| Belge | Öneri | Karar | Gerekçe / koşul |
|---|---|---|---|
| B1 §14 | 28 görsel / kapasite sabiti | **KABUL** | KANON'un tanımsız bıraktığı boşluk; `LOD_FULL_MAX` için B8 (24 / 16 / 8) |
| B2 | A-1 Staj modu | ERTELE v1.1 | "satın al → kodla" sırasını esnetir; B9 karar kapısı |
| B2 | A-2 Düello XP tier'li | RET | B6: 15 B + 50 XP sabit |
| B2 | A-3 Lonca görev XP, A-5 Lonca gelir bonusu | ERTELE v1.1 | B6 §5 ile birlikte |
| B2 | A-4 Mesai Bonusu (×1,15) | RET | Gelir kaynağı yalnız oyuncu kodu (§4); giriş takvimi yok |
| B2 | A-6 Yükseltme fiyatı × tier | ERTELE | MVP'de T1–T2; 500 / 1.200 / 2.500 / 5.000 B sabit; v1.2 öncesi simülasyon |
| B2 | A-7 Semt pazarı çarpanı | ERTELE | Kıyafet 30–800 B aralığı korunur |
| B2 | A-8 Büyük Kasa | ERTELE v1.1 | MVP kasası 8 saat; Bayt ile, asla Çip |
| B2 | A-9 Hata Bildirimi tavanı 5 | ERTELE v1.1 | İçerik pisti verisi (B9 AS5) |
| B2 | A-10 Semt Sınavı XP tier'li | RET | B4 toplamları 200'e göre |
| B2 | A-11 Lavabolar | KISMEN | Nadir haftalık rotasyon 6 slot **KABUL**; dekorasyon, Belediye Projeleri ERTELE v1.1 |
| B2 | A-12 XP eğrisi alternatifleri | RET | Yapısal (§3.2); pacing sorusu §12.6 |
| B3 | 19 satır | **KABUL** | `ceza_kademeleri` PK1–PK3 adıyla; `opus_bant` ERTELE (kalibre güven kanıtlanınca); `haiku_lite` KOŞULLU (QWK ≥0,75, itiraz <%3); `telafi_parlak` varsayılan sınırsız (A/B) |
| B4 | 11 satır | **KABUL** | `otopark.l3_kapisi`=3.4; `semt_sinavi.giris` MVP'de Liman Sınavı 2.1–2.6 |
| B5 | 11 satır | **KABUL** | `ust_sinir` harness girdi doğrulaması (§5.1 metni değişmez); `ekonomi.referans_tavani.biçim` ERTELE (B2 §8.2 + B7 §9 yeniden koşulunca; MVP: B2 formülü) |
| B6 | 20 satır | **KABUL** | `YAS_DUVARI`, `BILDIRIM_BUTCESI` 15–17; `SERI_*` A/B ile doğrulanır; `LONCA_*`, `DUELLO_*` v1.1 |
| B8 | 22 satır | **KABUL** | `WALK_PATHING` 4 komşulu; `EDITOR_STACK` (Monaco masaüstü, CodeMirror 6 dokunmatik; H2 ölçümü); `DISPLAY_NAME` isteğe bağlı + moderasyon; `CONSENT_DEFAULTS` kapalı |
| B9 | `hedef_kitle_alt_yas`, `veli_onayi_akisi`, `cip_15_17_kural` | **KABUL** | §12.2 |
| B9 | `ekran_listesi` | KISMEN | e-Devlet adımı KABUL; 25. ekran **RET**; Öğretmen Paneli ERTELE v1.1 (ekran değil) |
| B9 | `para_kazanma_ilkesi` (okul / kulüp lisansı) | KABUL, **kurucu onayı** | Ders, ipucu, test, AI kotası, Savunma hakkı hiçbir kanalda satılmaz (§12.6) |
| B9 | `ai_maliyet_hedefi`, `mvp_suresi`, `mvp_isletme_seviyeleri`, `kpi_taban_tanimi`, `kuzey_yildizi` (HKO), `icerik_damlasi`, `yas_derecelendirmesi`, `ders_semt_takvimi` | **KABUL** | C5, C7, C8; "MVP'de açık: #1 (L1–L2), #2, #4" ile uyumlu |

### 12.4 Sayfa kapak sayıları — tek kaynak

| Sayı | Değer | Kaynak |
|---|---|---|
| Ders / modül | **100 ders, 11 modül** (semt payı 12 / 12 / 14 / 16 / 16 / 14 / 16); birikim: MVP 18 → v1.1 46 → v1.2 62 → v2 84 → 100 (A15) | B4 §0, B9 §4.1 |
| Süre | ders 1.125 dk (18,75 sa); ders + görev + sınav 2.191 dk (36,5 sa); tek seferlik müfredat XP'si 41.350 | B4 §0 |
| MVP dilimi | 18 ders (1.1–1.12 + 2.1–2.6) = 144 dk, 1.800 XP, 18 Metro durağı | B4 §0 |
| Semt / Usta / Semt Sınavı | **7** / 7 / 7 (her biri 200 XP + 500 B + 10 Çip + Madalya) | KANON §2.1, §4 |
| İşletme | **20** (77 seviye başlığı); MVP'de açık #1 (L1–L2), #2, #4 | KANON §5, B5 |
| Ekran | **24** + HUD (ekran değil); Ebeveyn Paneli ekran değil | KANON §6, §12.2 |
| Seviye | tavan 60; 8 unvan; Toplam(60) = 503.680 | KANON §3 |
| Otopark L1 testi | 26 (6 açık + 14 gizli + 6 tohumlu); B5 doğrulaması 229 / 229 vaka | KANON §5.1, B5 |
| Çip paketi | 4 (Avuç, Kutu, Sandık, Konteyner) | B2 §9.3 |
| Görev kataloğu | 61 görev | B6 |
| Uç nokta | 151 (138 temel + 6 B8 talebi + 7 Yaş Kapısı v2); backend 14 modül + Platform çekirdeği, 15 şema | B7 §3–§5, §12.3 |
| AI | ≈0,0033 $/puanlama; ≈0,05 $/DAU/gün (≥10k DAU); alarm 0,065 sarı / 0,08 kırmızı; 4 soru tipi | KANON §9, B3 |
| MVP içerik hacmi | 18 ders için 162 şablon, 486 altın örnek, 648 ipucu | B3 §12 |
| MVP süresi | **12 hafta** (H1–H12); kapalı beta 200 kişi H9–H10 | VİZYON §13, B9 |
| Yol haritası | 52 hafta, 26 sprint, 12 epik, 30 iş paketi | B9 §0 |
| Ekip / bütçe | 5,5 → 11,5 FTE; 12 aylık gider baz 24,5 M TL (545 bin $) | B9 §0, §6 |
| Ölçüm / risk | HKO kuzey yıldızı; 21 MVP başarı ölçütü, 5 kapı (G0–G4); 61 analitik olay, 7 pano, 11 deney; 25 risk (6 kritik) | B9 §0 |

### 12.5 Belge kimlikleri

| id | Dosya (`spec/`) | Konu | Not |
|---|---|---|---|
| KANON | `KANON.md` | Sabitler (v2 = v1 + §12) | Bağlayıcı |
| VİZYON | `A-vizyon-FINAL.md` | Birleştirilmiş vizyon, çekirdek döngü | Salt okunur |
| B1 | `B1-dunya-sehir.md` | Dünya & şehir | Eski numaralama düzeltildi |
| B2 | `B2-ilerleme-ekonomi.md` | İlerleme & ekonomi | C1 / C2 / D1 → B7 / B8 / B9 |
| B3 | `B3-egitim-ai.md` | Eğitim & yapay zekâ öğretmen | Kurul JSON sahibi |
| B4 | `B4-mufredat.md` | C# müfredatı | Ders listesi sahibi |
| B5 | `B5-isletmeler-kod.md` | İşletmeler & kod projeleri | Challenge Spec sahibi |
| B6 | `B6-gorevler-sosyal-liveops.md` | Görevler, sosyal, canlı operasyon | Moderasyon, sezon sahibi |
| B7 | `B7-backend-mimari.md` | Backend & veri modeli | Yazımı sürüyor; hizalama listesi §12.7 |
| B8 | `B8-istemci-ui.md` | İstemci, motor, 24 ekran | |
| B9 | `B9-urun-yol-haritasi.md` | Ürün, MVP, yol haritası | Yaş / hukuk kaynağı |
| B10 | `B10-ek-tamamlayici.md` | Prototip örnek veri seti, eksikler | Sonra yazılır |
| İNDEKS | `MASTER-INDEX.md` | Belge haritası | Sonra yazılır |

Eski numaralama (yalnızca B1'in ilk sürümünde): çekirdek döngü → VİZYON; ilerleme, ekonomi → B2; eğitim / AI → B3; müfredat → B4; işletme kataloğu → B5; görevler, sosyal → B6; teknik mimari → B7; istemci / ekranlar → B8; ürün → B9. Geçersizdir.

### 12.6 Kurucu kararı gerektiren açık sorular

1. **13–14 yaş:** "Akademi Modu" için yazılı hukuk görüşü beklenip v1.1'e mi bırakılsın, yoksa bu yaş tamamen bırakılsın mı? (Kitle ≈%25–30 küçülür; lise kanalı etkilenir.)
2. **e-Devlet belirteci** küçük servislere 2027 ilk çeyrekte açık değilse B9 Seçenek C (yalnızca 18+ kapalı beta) kabul mü?
3. **Hukuki sınıf:** KodKent "sosyal ağ sağlayıcı", "oyun platformu" ya da ikisi mi? Meydan sohbeti, DM, Oda, Vitrin 15–17'de kısılırsa hangisi vazgeçilmez?
4. **Okul / kulüp lisansı** (B9 Ek A `para_kazanma_ilkesi`), 00-fikir §2 ilkesine "ders, ipucu, test, AI kotası, Savunma hakkı satılmaz" şartıyla eklensin mi?
5. **15–17 Çip limiti 0** (dönüşüm kaybı) kalıcı mı; hukuk "limit + onay aracı sunmak yeterli" derse B2'nin 300 Çip/ay modeline dönülsün mü?
6. **15–17 Oda "Herkese açık"** kalıcı kapalı mı, hukuk teyidi sonrası veli onayıyla açılsın mı?
7. **Geç oyun pacing (B2 §14.1):** KANON eğrisiyle normal oyuncu Sev. 40'a 233, Sev. 60'a 500 günde varır; VİZYON'un "~6 ay Tier 4, ~1 yıl tavan" hedefi tutmuyor. Eğri mi (A-12 reddedildi) hedef metni mi değişsin?
8. **Staj modu** (B2 A-1) v1.1'de "satın al → kodla → kazan" sırasını esneten bir A/B olarak denensin mi?
9. **MVP 14 hafta:** uyum paketi (yaş kapısı + veli onay sayfası) 12 haftaya sığmazsa +2 hafta kabul mü (G0, H2–H3)?
10. **Barındırma konumu:** Türkiye içi sağlayıcı mı, B7 ADR-15'in Hetzner Falkenstein önerisi mi (B9 §8.3, KVKK aktarımı)?

### 12.7 Uygulama notları (prototip, sayfa yazarları, B7)

- **Prototip `ai` modülü** (`brief/02` §E.3, salt okunur): çıktı şemasına `guven` (0–1) eklenir; `geri_bildirim` "en çok 80 kelime" (brief'te 60); `guven` yoksa 0,7 varsayılır (prototip varsayımı). Diğer alan adları B3 ile aynıdır.
- **Sayfa yazarları:** yaş metni "15–25"; "13–17" yalnızca KANON v1'e tarihsel atıfta kullanılır; Giriş akışı §12.2'dedir; Ebeveyn Paneli bir ekran olarak çizilmez.
- **B7 hizalama listesi** (bu tarama B7'ye dokunmadı): `AGE_TOO_LOW` iletisi "KodKent 15 yaş ve üzeri içindir."; `birth_month` yalnızca 15 sınır yılında; `par` gerekli: 15–17; JWT `age_band` değerleri <15 / 15–17 / 18+; e-Devlet belirteç, bekleme listesi ve veli onay sayfası uç noktaları kataloğa (138 → yeniden say); Büyük Kasa 12 saat → MVP'de 8; §5.4.8 "ilk soru → 85 XP" → 3. soru; `min_kayit_yasi` yapılandırma bayrağı.
