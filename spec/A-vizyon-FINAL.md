# KodKent — Vizyon Belgesi FINAL (Birleştirilmiş Vizyon, v1)

> Baş tasarımcı notu: Omurga, jürinin iki turda da birinci seçtiği **Oyun Tasarımı** vizyonudur (imza mekaniği: otoparkın geliri oyuncunun kendi derlenmiş kodunun hesapladığı paradır). Üzerine **Öğrenme Bilimi** vizyonundan pedagojik iskele (PRIMM rampası, Günlük Tekrar, Kurul/Usta ayrımı, Savunma, Hata Bildirimi) ve **Ürün/Teknoloji** vizyonundan yürütme planı (12 hafta, ekip, maliyet, GTM, KPI) aşılanmıştır. Jürinin işaret ettiği 22 çelişkinin her biri "Jüri Kararları" bölümünde tek tek karara bağlanmıştır. SABİT kararlar (KodKent, Bayt/Çip/XP, .NET backend, Claude API, gerçek sandbox, pay-to-learn yok, otopark kanonik ilk işletme) aynen korunur. Sayısal sabitler ayrıca `KANON.md` v1'de tablolaştırılmıştır; iki belge çelişirse KANON geçerlidir.

## 1. Tek cümlelik vaat ve ürün tanımı

**Vaat:** *"KodKent'te yazdığın her gerçek C# satırı şehirde sana ait bir şeyi çalıştırır — ve kazandığını herkes görür."*

**Slogan:** "Oyunlarla yazılım öğreniyorum." **Alt slogan (tabela dili):** "Kod yaz, şehrini kur."

**Ürün tanımı (3 cümle):**
1. KodKent, 13–25 yaş arası Türkiyeli yeni başlayanların telefon numarasıyla iki dakikada girip bir avatarla izometrik bir şehre adım attığı, web-öncelikli (masaüstü + mobil tarayıcı/PWA) bir sosyal sanal şehir oyunudur.
2. Oyuncu Akademi'de "Usta" adlı yapay zekâ öğretmenlerle 6–10 dakikalık dersler görür, sorulara kendi cümleleriyle cevap verip XP kazanır; sonra semtlerde işletmeler satın alır (ilki her zaman Otopark) ve bu işletmeleri sunucuda gerçekten derlenip test edilen C# koduyla çalıştırarak Bayt kazanır.
3. Bayt ile kozmetik, oda eşyası ve yeni işletme alınır; Çip yalnızca görünüm ve konfor içindir, Bayt satın alınamaz ve hiçbir ders, ipucu ya da test hiçbir zaman paralı ya da zamanlayıcıyla kilitli değildir.

"Aha" anları: (a) 12. dakikada LED panoda kendi `Console.WriteLine` çıktının akması; (b) 70. dakikada Otopark tapusu ve "KAPALI — yazılım bekliyor" tabelası — yalnızca senin kodunla açılır; (c) şehir dışında: Otopark kodu Visual Studio'ya yapıştırılınca **aynen derlenir**.

## 2. Oyuncu fantezisi

Oyuncunun tek cümlelik kimliği: **"Ben, bu şehre sıfır bilgiyle tramvayla gelen ve yazdığım her programla bir dükkânın daha ışığını yakan genç bir yazılımcı-girişimciyim; işletmelerim benim yerime konuşur."**

| Katman | His | Referans | KodKent'teki karşılığı |
|---|---|---|---|
| Yetkinlik | "Bunu gerçekten ben yaptım" | Codewars, Zachtronics | Kod gerçekten derlenir; otoparkın kasası senin `UcretHesapla` metodunun hesapladığı parayla dolar; kodun açıklamasını Savunma'da sen yaparsın |
| Mülkiyet | "Burası benim" | Hay Day, Habbo odası | Tabelada adın ve unvanın, içeride senin döşediğin oda, Vitrin'de senin kodun, bina kodun bozulursa kararır |
| Statü | "Bakın ben kimim" | Sanalika gösterişi, Duolingo ligleri | Unvan, Nişan rozetleri, neon tabela, LED panoda akan çıktın, lig sıran, metro haritanda altın duraklar |

Sanalika'nın "havalı odası olan çocuk" fantezisi "çalışan işletmesi olan çocuk" fantezisine dönüşür: Sanalika'da statü satın alınır; KodKent'te statü taşıyan her nesne (**Nişan** kademesi) yalnızca beceriyle kazanılır. Oyuncu profiline baktığında bir portföye bakar: her işletme çalışan bir C# projesidir.

Yolculuk arkı: **Çırak** (Çarşı'da otopark işleten) → **Kalfa** (Liman'da deposu olan) → **Mühendis** (Kampüs'te sinemasıyla övünen) → **Şehir Mimarı** (Bulut Tepesi'nde işletmelerini tek API'de birleştiren) → **Efsane** (öğreterek unvanını tamamlayan). Oyuncu "ders bitirmez", "semt fetheder". Üç katman Bandura'nın öz-yeterlik kaynaklarına oturur: ustalık deneyimi (test yeşile döner), dolaylı deneyim (başkasının otoparkını ziyaret), sözel ikna (Usta'nın süreç övgüsü).

## 3. Çekirdek döngü

Resmî adlar: **Öğren → Uygula → İnşa Et → Kazan → Harca → Göster.** Bir oturumda (hedef 15–20 dk) en az bir tam tur kapanır; hiçbir oturum "yarım" bitmez.

| # | Adım | Nerede | Süre | Ödül | Bir sonrakine köprü |
|---|---|---|---|---|---|
| 1 | **Öğren** | Akademi (semt Ustası'nın kürsüsü) | 6–10 dk: 4–6 kart (≤60 kelime + 1 mini kod, PRIMM sırası) + 3 Usta sorusu | Ders XP'si (T1: 100 XP), Ders Mührü | Son kart bir iş emri önizlemesidir: "Hasan Abi'nin otoparkı tam bunu istiyor" → Görev; Öğren→Uygula arası ≤60 sn |
| 2 | **Uygula** (görev) | Atölye / semt sokağı | 3–8 dk: tek metot, 2–4 açık test; Sıralama → Tamamlama → Sıfırdan | 60 XP + 40–80 B + **Ruhsat parçası** (3 parça = 1 Ruhsat) | Ruhsat 3/3 → "Satılık" tabelası yanar, +100 B Belediye teşviki |
| 3 | **İnşa Et** (işletme kodu) | İşletme binası, Monaco | 15–40 dk (Otopark L1 ≈ 25): İş Emri → Gereksinim Netleştirme → kod → testler → Savunma | Açılış anı (konfeti, LED pano), 300 XP (T1), pasif gelir başlar | Kasa dolmaya başlar; ilk toplama 1 saat sonra |
| 4 | **Kazan** | Kasa (işletme önü) | 10 sn; kasa 8 saatte dolar | Bayt (Otopark L1 ≈ 220 B/gün) | HUD hedef çubuğu: "Hedef: Büfe 600 B" |
| 5 | **Harca** | Pazar / Oda / yükseltme | 1–3 dk | Kıyafet, eşya, yeni işletme, işletme seviyesi | Yükseltme yeni müşteri isteği getirir → Öğren; kilitli tapu "2 ders eksik" der |
| 6 | **Göster** | Derleyici Meydanı, ziyaret, lig, Vitrin | 2–5 dk | Alkış, ziyaretçi, lig puanı, tabela | "Bunu nasıl yapmış?" → Vitrin'de kodu oku → Akademi |

Üç ölçekte döngü: **Mikro (2–3 dk)** soru → Kurul puanı → XP tik; **Mezo (15–20 dk)** ders → görev → kasa → bir şey al/giy, oturum sonunda avatar görünür biçimde değişmiştir; **Makro (1–2 hafta)** Ruhsat → işletme → yükseltme → Semt Sınavı → yeni semt (yeni Usta, müzik, kıyafet teması).

**Günlük mini döngü (3 dk): Günlük Tekrar.** Aralıklı tekrar kuyruğundan 5 karışık soru (her Ders Mührü 1-3-7-21. günlerde kuyruğa döner); 20 B + 15 XP + seri günü. 3 kez üst üste doğru cevaplanan durak **altın** ("kalıcı") olur; unutulan durak yeşile düşer. Seri: haftada 1 ücretsiz dondurma + Seri Dondurucu (50 B, asla Çip).

Geri dönüş kancaları (günde 2–3 oturum): kasa dolumu (8 saat), Günlük Tekrar (24 saat), Alkış/ziyaretçi bildirimi, Hata Bildirimi ("Müfettiş bir dosya bıraktı"), lig kapanışı (Pazar 21:00). Dersler, ipuçları ve testler **asla** zamanlayıcıyla kilitlenmez; bekleme yalnızca gelire uygulanır.

## 4. İlk 30 dakika: dakika dakika onboarding

Hedef: 20. dakikada ilk Bayt, 27. dakikada "Satılık Otopark" tabelası, ≈70. dakikada **tapu** (aynı oturum ya da 2. oturum), 2. oturumda Açılış. Onboarding boyunca tek görev işaretçisi vardır; harita, Pazar ve sohbet kademeli açılır. HUD ilk 30 dakikada yalnızca XP çubuğu + Bayt cüzdanı + görev kartı gösterir.

| Dakika | Ekran / olay | Oyuncu ne yapar | Ödül / his |
|---|---|---|---|
| 0:00–1:15 | **Giriş**: tek buton "Telefonla gir"; doğum yılı | 6 haneli SMS OTP (90 sn geçerli, 60 sn'de yeniden gönder, 5 deneme/saat). 13 altı → nazik red; 13–17 → veli telefonu, oyun **kilitsiz** başlar, veliye SMS onay linki (72 saat); onaya kadar serbest metin sohbet kapalı | Hesap yok, şifre yok; "Seni bekletmiyoruz" |
| 1:15–2:00 | **Dil Seçimi**: 6 kart | C# "Şehir açık"; Python / JavaScript / Java / Kotlin / Go "yakında — haber ver" | Bekleme listesi = ikinci dil kararı |
| 2:00–4:00 | **Avatar Atölyesi**: yüz, saç, kıyafet (12 kombinasyon), takma ad | Seçer; ad `claude-haiku-5-5` + sözlükle moderasyondan geçer | "Sonra her şeyi değiştirebilirsin" |
| 4:00–6:30 | Giriş sineması (atlanabilir, 40 sn): tramvay Derleyici Meydanı'na iner, **Usta Defne** karşılar; HUD açılır, tek işaretçi Akademi | Tıkla-yürü öğrenir | Defne: "Işığı yanan her dükkân birinin yazdığı kodla çalışıyor. Şu otopark, 3 gün önce senin gibi başlayan birinin." (gerçek oyuncunun tabelası) |
| 6:30–12:30 | **Ders 1.1 "Merhaba KodKent"** (PRIMM): (T) 4 satırlık kod, "çıktı ne?" çoktan seçmeli; (Ç) tek tıkla sandbox'ta çalışır; (İ) 2 kart: değişken = kutu, `int` = etiket; (D) editör **yalnızca 1 satır** düzenlenebilir: `string ad = "..."` kendi adıyla değiştirip çalıştırır | Çıktı LED panoda 10 sn akar (moderasyonlu). **Sosyal gösteriş anı #1** |
| 12:30–14:30 | **İlk Usta sorusu (Kavram Sorusu)**: rubrik cevap kutusunun ÜSTÜNDE (Doğruluk 50 / Tamlık 30 / Açıklık 20). Defne: "`int yas = 17;` yazdın. `yas` ne, `17` ne, `int` ne? Kendi cümlelerinle." | 1–3 cümle yazar | **Kurul Kartı**: "82/100 — Doğruluk 45/50: 'kutu' benzetmen doğru · Tamlık 22/30: türün neden önemli olduğu eksik · Açıklık 15/20". Defne: "Kutu benzetmen güzel; türün önemini ekle; sonraki kartta tam bunu göreceksin." +25 XP → 85 XP → **Seviye 2** (eşik 80) 14. dakikada |
| 14:30–20:00 | **İlk görev "Meydan Saati"** (Tamamlama: 3 satırı eksik program): "Saat 14:05" yazdır; 3 açık test; ilk derleyici hatası Türkçe (CS1002 → "satır sonunda `;` eksik") | Kodlar, testleri çalıştırır | +60 XP, **+40 B** (para çeşmesi). İlk Bayt yalnızca koddan |
| 20:00–23:00 | **Pazar** teaser (tek raf) | 30 B'ye "Çırak Şapkası", anında giyilir | Avatar değişti; cüzdan 10 B |
| 23:00–27:00 | **Şehir Haritası**: kilitli semtler **inşaat halinde** ("Liman: Çarşı Sınavı'ndan sonra açılıyor"); Çarşı → **"Satılık Otopark"** (300 B + Ruhsat 3/3 + Sev. 3) | İçeri girer: boş arsa, NPC **Hasan Abi**: "Burada bir ücret sistemi lazım, yapan var mı?" | HUD hedef çubuğu: "Otopark: 10/300 B — Ruhsat 0/3 — 3 ders" |
| 27:00–29:00 | **Turist modu**: gerçek bir oyuncunun çalışan otoparkı | NPC arabaların girişini izler, "Alkışla" basar; tabela: "Sahibi: @ayse_kod — Kalfa, Sev. 8" | "Bu ben olabilirim" |
| 29:00–30:00 | Bildirim izni, PWA "ana ekrana ekle" | İzin verir/vermez | Çıkış kartı: "Sıradaki: Ders 1.2 → Ruhsat 1/3" |

**30–75. dakika (devam eden oyuncu):** Ders 1.2 → görev "Dakikadan Saate" (+50 B, Ruhsat 1/3) → Ders 1.3 → görev "Kademeli Karar" (+60 B, Ruhsat 2/3) → Ders 1.4 → görev "Taksimetre" (+80 B, Ruhsat 3/3, +100 B Belediye teşviki). Cüzdan: 10 + 50 + 60 + 80 + 100 = **300 B** → **Tapu** ≈ 70. dakikada; bina "KAPALI — yazılım bekliyor" tabelasıyla haritada görünür. Kod (≈25 dk) aynı oturumda ya da 2. oturumda yazılır; çıkan oyuncu "Yarın: Hasan Abi'nin iş emri" kartını görür.

Onboarding başarı ölçütleri: ilk Bayt ≤20 dk (%70), Ders 1.1 tamamlama %85, tapu ≤ 2 oturum (%50), 72 saatte Otopark **AÇIK** (%35), D1 geri dönüş %45.

## 5. Dünya iskeleti

Şehir, **Derleyici Meydanı**'ndan dışa doğru halkalar hâlinde açılan 7 öğrenme semti + konut bölgesi **Bloklar**'dan oluşur. Her semt bir C# konu kümesi, bir Usta, bir müzik teması ve bir kıyafet/eşya stilidir. Kilitli semtler sis değil **inşaat halinde** gösterilir ve **turist modunda** gezilebilir: sokaklar, başkalarının çalışan işletmeleri ve tabelaları görünür; arsa alınamaz, atölye görevleri kilitlidir.

| Semt | Tier | C# konu kümesi | Örnek oyuncu işletmeleri | Açılış | Usta | Atmosfer |
|---|---|---|---|---|---|---|
| **Derleyici Meydanı** (merkez) | — | — | Akademi, Pazar, Liderlik Panosu, LED pano, Arena (v1.2), tramvay durağı | Baştan | (Defne karşılar) | Kalabalık, çeşmeli, akşam ışıkları |
| **Çarşı** | 1 | Değişkenler, türler, operatörler, tam sayı bölmesi, `Math`, `if/else if`, `switch`, döngüler, metotlar, `string` | **Otopark** (kanonik), Büfe, Manav | Sev. 1 | Defne | Tenteli dükkânlar, pazar sesleri |
| **Liman** | 1–2 | Diziler, `List<T>`, `Dictionary`, `foreach`, sıralama/arama, `string.Split`, hata ayıklama temelleri | Kargo Deposu, Balık Hali, Oto Yıkama, Gümrük | Sev. 6 + Çarşı Sınavı | Kerem | Konteynerler, martı, vinç |
| **Atölyeler** | 2 | Sınıf, nesne, kapsülleme, kalıtım, `interface`, `enum`, `struct`, `record`, `exception`; İngilizce adlandırmaya geçiş dersi | Oto Tamirhane, Mobilya Atölyesi, Trafo Merkezi | Sev. 12 + Liman Sınavı | Nehir | Tuğla, kıvılcım, çekiç |
| **Kampüs** | 2–3 | Generics, LINQ, delegate/event, lambda, extension, pattern matching, `DateTime`, dosya ve JSON | Kütüphane, Sinema, Haber Ajansı, Lonca Binası | Sev. 18 + Atölye Sınavı | Baran | Çimen, amfi |
| **Finans Bölgesi** | 3 | `async/await`, `Task`, `HttpClient`, hata dayanıklılığı, **unit test**, Git temelleri | Banka, Sigorta, Borsa Panosu | Sev. 25 + Kampüs Sınavı | Elif | Cam kuleler, gece neonu |
| **Veri Vadisi** | 3–4 | SQL temelleri, EF Core, migration, repository, ilişkiler, transaction | Hastane Kayıt, Otel | Sev. 32 + Finans Sınavı | Selin | Sunucu çiftliği, nehir |
| **Bulut Tepesi** | 4 | ASP.NET Core Web API, REST, DTO, DI, middleware, auth, SignalR temelleri, dağıtım | Yemek Sipariş Platformu, **Şehir Uygulaması** (capstone; lonca sürümü) | Sev. 40 + Veri Sınavı | Yusuf | Bulutların üstünde |
| **Bloklar** (konut) | — | — | Oyuncu Odası (başlangıç: Stüdyo, 6×6) | Sev. 2 | — | Meydan'ın arka sokakları |

**Akademi**, Meydan'ın kuzeyindeki en büyük binadır: her semt için bir **Kürsü** (derslik; semt açılmadan gezilebilir, dersler kilitli), bir **Atölye** (görev alanı; kalabalık, "yardım iste" balonu) ve **Lobi** (Kalfa Yardımı, v1.2). Dersler Akademi'de anlatılır, görevler semt sokaklarında geçer.

**Ev/Oda:** Başlangıç **Stüdyo** (6×6 ızgara, 25 eşya); Sev. 10'da **Daire** (8×8, 2.000 B), Sev. 20'de **Çatı Katı** (iki oda, 6.000 B) — genişleme MVP+1. İşlevsel eşyalar: "Çalışma Masası" son geçilen testi gösterir; "Rozet Duvarı" Nişan'ları asar.

**Sanalika hissini veren 8 öğe:** (1) tıkla-yürü izometrik avatar, başının üstünde balon; (2) ızgaraya eşya yerleştirme, döndürme, istifleme; (3) kapıdan kapıya ziyaret, ziyaretçi defteri, ayak izi; (4) emote/dans çarkı (8 başlangıç); (5) kıyafet dolabı ve Meydan podyumu; (6) 40 avatarlık Meydan shard'ı, saat başı "Meydan Sorusu" (en hızlı 3 kişi panoda); (7) tabela sistemi: sahibin adı, unvanı, seviyesi, açık/kapalı ışığı — kod bozulursa tabela kararır, NPC arabalar girmez; (8) **Vitrin**: işletme içinde çerçeveli ekran; sahibi isterse kodunu sergiler (L2+), ziyaretçi okur ve "Not bırak" ile yorum yazar; her mühür tıklanınca sahibinin Savunma cevabını gösterir.

## 6. İlerleme iskeleti

**XP eğrisi.** Seviye L'den L+1'e geçmek için gereken XP: **`XP(L) = yuvarla10(80 × L^1,35)`**; Seviye L'ye ulaşmak için gereken toplam XP `Toplam(L) = Σ XP(k), k = 1..L−1`. Seviye tavanı **60**; Toplam(60) ≈ 504.000 XP.

| Seviye | Bu seviyeden sonrakine XP(L) | Seviyeye ulaşmak için Toplam(L) | Tipik gün | Açılan |
|---|---|---|---|---|
| 1 | 80 | 0 | 0 | — |
| 2 | 200 | 80 | 1 (14. dk) | Oda |
| 3 | 350 | 280 | 1 | Otopark tapusu (Ruhsat ile) |
| 4 | 520 | 630 | 1–2 | Büfe |
| 6 | 900 | 1.850 | 3–4 | Liman (+ Çarşı Sınavı), 2. işletme |
| 12 | 2.290 | 10.570 | ~20 | Atölyeler, 3. işletme, Lonca kurma |
| 18 | 3.960 | 28.380 | ~50 | Kampüs, Kalfa Yardımı |
| 25 | 6.170 | 62.590 | ~90 | Finans Bölgesi |
| 32 | 8.610 | 112.990 | ~125 | Veri Vadisi |
| 40 | 11.640 | 192.330 | ~170 | Bulut Tepesi |
| 60 | — | 503.680 | ~315 | Tavan; Efsane |

XP kaynakları tier ile büyür (ders T1 100 / T2 180 / T3 280 / T4 400; görev 60 / 100 / 160 / 250; işletme açılışı 300 / 600 / 1.200 / 2.000; Günlük Tekrar 15; Semt Sınavı 200). Günlük XP tavanı **yoktur**; tekrar edilen görev 0 XP verir. Günlük aktif oyuncu T1'de ≈500, T4'te ≈2.000 XP kazanır: günde 20–40 dakikayla ~6 ayda Tier 4, ~1 yılda tavan.

**Unvanlar** (ismin yanında ve tabelada): Çırak (1–5) → Kalfa (6–11) → Zanaatkâr (12–17) → Mühendis (18–24) → Baş Mühendis (25–31) → Mimar (32–39) → Şehir Mimarı (40–59) → **Efsane** (60 + en az 10 Mentor kilometre taşı). "Usta" sözcüğü yalnızca NPC öğretmenler içindir; oyuncu unvanı olarak kullanılmaz. En üst unvanın bir kısmının öğretmeyle gelmesi bilinçlidir: içerik bittikten sonra son oyunu canlı tutar.

**Kilit mantığı — üç kapı (hiçbiri zamanla açılmaz):**
1. **Ders → Görev:** Ders Mührü = 3 Usta sorusundan en az 2'si ≥70. Altında ceza yok; 10 dk sonra **Telafi Turu** (aynı kavram, farklı 3 soru, sınırsız).
2. **Görev → İşletme:** 3 görev = 1 **Ruhsat**; işletme = Ruhsat + fiyat + seviye eşiği. Eşzamanlı işletme sayısı `1 + ⌊seviye/6⌋` (Sev. 12'de 3, Sev. 40'ta 7); her türden 1.
3. **İşletme → Semt:** Seviye eşiği **ve** önceki semtte bir işletme L2 **ve** **Semt Sınavı**: 20 dk, 3 kod + 3 Usta sorusu, konular karışık (interleaving); geçme = 3/3 kod + soru ortalaması ≥70. Başarısızlıkta bekleme yok, farklı soru seti; zayıf duraklar Günlük Tekrar kuyruğuna 3 kat ağırlıkla. Ödül: 500 B + 10 Çip + 200 XP + Semt Madalyası (Nişan).

**Metro Haritası (yetenek ağacı):** her semt bir hat, her ders bir durak, aktarma durakları konuların kesişimi. Durak renkleri: gri (kilitli) → sarı (başlandı) → yeşil (mühür) → **altın** (Günlük Tekrar'da 3 kez üst üste doğru = kalıcı; unutulan durak yeşile düşer). Dağıtılacak puan yoktur. Altın durak sayısı "Kalıcılık Ligi"nin puanı ve velilere gösterilebilir gerçek öğrenme KPI'ıdır.

**İşletme seviyesi (L1–L5):** her seviye yeni bir müşteri isteği (yeni kod gereksinimi), ×1,6 gelir ve binaya görünür bir ek (otopark: bariyer → tabela → kat → gece ışığı → otomat).

## 7. Öğrenme ↔ oyun bağı: Otopark'ın yolculuğu

İlke: **"Öğrenmek XP, yapmak Bayt getirir."** Ders Bayt vermez; Bayt'ın %85'i çalışan koddan (görev + işletme), kalanı öğrenme eylemine bağlı küçük musluklardan (Günlük Tekrar, Semt Sınavı, lig) akar. **"Aynı şema, üç yüzey":** otoparkın kademeli-fiyat şeması Manav (miktara göre indirim kademesi), Oto Yıkama (paket + ek hizmet listesi) ve Kütüphane'de (gün bazlı gecikme cezası) yeniden kurulur; transfer tasarlanır, umulmaz.

**Ders → prova görevi → otoparktaki karşılığı** (müfredat yazarının zorunlu şablonu):

| Ders | Kavram | Prova görevi (tip) | Otoparktaki karşılığı | Ruhsat |
|---|---|---|---|---|
| 1.1 Merhaba KodKent | `int`, `string`, interpolation, `Console.WriteLine` | Meydan Saati (Tamamlama) | Ücretin ekrana yazılması | — (tutorial) |
| 1.2 Sayılar ve Yuvarlama | tam sayı bölmesi, `double`/`decimal`, `Math.Ceiling`, `(dakika + 59) / 60` | Dakikadan Saate (Sıralama + Tamamlama) | Başlayan saatin tam sayılması | 1/3 |
| 1.3 Kararlar | `if / else if / else`, karşılaştırma, `&&`, sınır değerleri | Kademeli Karar: sinema bileti 3 kademe (Tamamlama) | Üç tarife dilimi | 2/3 |
| 1.4 Fonksiyon Sözleşmesi | metot, parametre, dönüş, imzaya uymak | Taksimetre (Sıfırdan) | `UcretHesapla(int dakika)` | 3/3 |

**İş emri.** Tapu alınınca NPC **Hasan Abi** bir iş emri uzatır; kurucunun kuralları birebir, müşteri ağzından:

> "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum."

**Gereksinim Netleştirme (zorunlu, öğretim anı).** Oyuncu kodlamaya geçemez; "Müşteriye Sor" panelinden en az 4 soru seçer (8 hazır soru + serbest metin). Usta Defne kenardan: "Müşteriye sormadan kod yazan, iki kere yazar." Cevaplar sabittir ve **Sözleşme Kartı**'na yazılır:

| Oyuncunun sorusu | Hasan Abi'nin cevabı | Sözleşme maddesi |
|---|---|---|
| "1 saat 10 dakika kalan ne öder?" | "Başlayan saat tam sayılır; 2 saatten az kaldı: 200." | Dilimi **ham kalış süresi** belirler; saat yukarı yuvarlanır |
| "Tam 2 saat kalan?" | "O artık 2–6 dilimi: 2 × 40 = 80." | Alt sınır dâhil |
| "Tam 6 saat kalan?" | "Hâlâ 2–6 dilimi: 240; 6'yı geçen güne girer." | Üst sınır dâhil |
| "24 saati aşan?" | "Her başlayan gün 250." | 1.441 dk → 500 |
| "Aynı dakika çıkan?" | "Ödemez. Bariyer eksi süre göndermez." | 0 → 0; girdi ≥ 0 garantili (bozuk kayıt L3'te `exception` ile gelir) |

Oyuncu **119 dakikanın 200 TL, 120 dakikanın 80 TL** olduğunu fark edip sorarsa Hasan Abi "Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle" der; oyuncu **Keskin Göz** rozeti + 50 XP alır. Ders: gereksinimi görünür biçimde sorgula, müşterinin kararına saygı duy. (Anomaliyi Usta söylemez; ilk 1.000 oyuncuda A/B.)

**Kod isteme biçimi.** Editör şu iskeletle açılır; oyuncu yalnızca metodun içini yazar:

```csharp
// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi
public static class Otopark
{
    // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)
    // dönüş: ödenecek ücret, TL (tam sayı)
    public static int UcretHesapla(int dakika)
    {
        // kodun buraya
    }
}
```

Açık testler (6) ekranda yeşil/kırmızı kutular; gizli testler (14) + oyuncuya özel tohumlu 6 rastgele vaka **Müfettiş** tarafından çalıştırılır.

| Dakika | TL | Açıklama | Test |
|---|---|---|---|
| 30 | 100 | Başlayan 1. saat | Açık |
| 61 | 200 | Başlayan 2. saat, hâlâ "2 saatten az" | Açık |
| 120 | 80 | Tam 2 saat → 2 × 40 | Açık |
| 121 | 120 | Başlayan 3. saat → 3 × 40 | Açık |
| 361 | 250 | 6'yı aştı → günlük | Açık |
| 1.441 | 500 | 2. gün başladı | Açık |
| 0 / 1 / 59 / 60 / 119 / 180 / 359 / 360 | 0 / 100 / 100 / 100 / 200 / 120 / 240 / 240 | Sıfır, saat sınırları, anomali | Gizli |
| 720 / 1.439 / 1.440 / 2.880 / 2.881 / 100.000 | 250 / 250 / 250 / 500 / 750 / 17.500 | Gün içi, çok günlü, büyük girdi | Gizli |

Referans çözüm (yalnızca sunucuda; gelir tavanı ve Hata Bildirimi mutasyonları için) `KANON.md`'dedir.

**Savunma (açılış öncesi).** Tüm testler geçince Kurul oyuncunun **kendi kodundan** bir satır seçer ve Hasan Abi'nin ağzından sorar: "121 dakika neden 120 TL? Hangi satır belirliyor?" Doğru açıklama (Kurul ≥70) → **Açılış**: bariyer kalkar, ilk NPC araba girer, LED panoda "Yeni işletme: @ad'ın Otoparkı" akar, +300 XP. Açıklayamazsa işletme **Deneme** modunda açılır (gelir %50, şikâyet balonu), 24 saat sonra yeni Savunma hakkı. Yapıştırma telemetrisi (AST benzerliği > %95 veya 30 sn altı yazım) Savunma'yı zorunlu kılar ve Bayt Savunma sonrası ödenir. Gizli testlerden biri kalırsa da Deneme açılışı: şikâyet balonu kategoriyi söyler ("6 saat civarı kalanlar"), gizli girdiyi söylemez.

**Para nasıl akıyor — tasarımın kalbi:** otoparkın geliri, oyuncunun kendi metodunun hesapladığı paradır.
1. Sunucu her gece (deterministik tohumla) sentetik trafik üretir: L1'de 12 araç; dağılım %45 (<2 sa), %35 (2–6 sa), %18 (6–24 sa), %2 (>24 sa).
2. Oyuncunun derlenmiş `UcretHesapla` metodu sandbox'ta bu 12 araç için bir kez toplu çalışır (günde 1 batch, sonuç önbelleğe).
3. Toplam TL **10 TL = 1 B** kuruyla Bayt'a çevrilir: araç başı ≈185 TL → ≈2.220 TL → **≈220 B/gün**.
4. Gelir saatlik kasaya akar; kasa 8 saatte dolar (≈73 B); dolu kasa üretimi durdurur (kayıp yok). Günde 3 toplama = tam gelir: Hay Day ritmi. Geri ödeme (300 B) tipik 2 gün.
5. Güvenlik: günlük gelir **referans çözümün aynı trafikte ürettiği tutarla tavanlanır**; sapma "fazla/eksik ücret şikâyeti" balonuna döner. Yapay zekâ gelire **hiç** dokunmaz.

**Hata Bildirimi görevleri (günde 3, 40–120 B):** Müfettiş oyuncuya sentetik bir "başkasının" otopark kodunu getirir (referans çözüme havuzdan rastgele enjekte edilmiş mutasyon): "Müşteri 1.440 dakika için 500 TL ödemiş." Oyuncu hatalı satırı bulur, düzeltir, nedenini 1 cümleyle yazar. Hata ayıklama (Bloom: Analiz) düzenli pratik edilir; içerik maliyeti sıfırdır; Lonca'da aynı motor lonca içi kod incelemesine dönüşür.

**Otoparkın sonraki seviyeleri** (her biri başka semtin dersini çeker; ilk işletme oyuncuyu tüm şehirde gezdirir):

| Seviye | Müşteri isteği | Gereken konu (semt) | Trafik | Gelir/gün |
|---|---|---|---|---|
| L2 | "Aylık abonelerin plakaları listede; onlar ödemesin" | `List<string>`, `Contains` (Liman) | 20 araç | ≈350 B |
| L3 | "Engelli ve elektrikli araçlara %50 indirim; bozuk bariyer kaydı gelirse hata ver" | `enum`, aşırı yükleme, `ArgumentOutOfRangeException` (Atölyeler) | 30 | ≈560 B |
| L4 | "22:00–06:00 gece tarifesi sabit 150" | `DateTime`, `TimeSpan` (Kampüs) | 40 | ≈900 B |
| L5 | "Kapasite 50; doluysa reddet, bekleyenleri sırala" | durum, kuyruk, async (Finans) | 50 | ≈1.440 B |

## 8. Ekonomi iskeleti

**Bayt musluklar (gelir).** Olgun oyuncuda hedef dağılım: işletme %60, görev %20, Günlük Tekrar ve seri %8, lig %7, sosyal (alkış) %5. Günlük giriş takvimi **yoktur**: Bayt veren her şeyin arkasında bir öğrenme ya da kod eylemi vardır.

| Kaynak | Miktar (T1) | Sıklık | Not |
|---|---|---|---|
| Görev (ilk tamamlama) | 40–80 B | Ders başına 1 | Tier ile ×2, ×4, ×8; tekrar 0 |
| Belediye teşviki | 100 B | Ruhsat başına | Tapuya son itiş |
| İşletme geliri | ≈220 B/gün (Otopark L1) | Saatlik, kasa 8 saat | Ana kaynak; referans tavanlı |
| Günlük Tekrar | 20 B + 15 XP | Günde 1 | Seri 7 → ×1,5 |
| Hata Bildirimi | 40–120 B | Günde 3 | Müfettiş getirir |
| Haftalık lig | 0–300 B | Pazar 21:00 | Sıraya göre |
| Alkış | 2 B, günde en çok 40 B | Ziyaretçi başına | Sosyal pasif gelir |
| Semt Sınavı | 500 B + 10 Çip + 200 XP | Semt başına 1 | Tek seferlik |
| Kod Düellosu (v1.1) | 15 B + 50 XP | Günde 5 | Sistemden; bahis yok |

**Bayt lavabolar (gider):**

| Gider | Fiyat | Rol |
|---|---|---|
| İşletme satın alma | T1 300–900 B · T2 1.500–8.000 · T3 10.000–35.000 · T4 50.000–120.000 | En büyük lavabo; geri ödeme T1'de 2–4 gün, T4'te 8–12 gün |
| İşletme yükseltme | L2 500 · L3 1.200 · L4 2.500 · L5 5.000 B (+ kod) | Orta vadeli hedef |
| Kıyafet/aksesuar | 30–800 B | Hızlı tatmin |
| Oda eşyası ve genişletme | Eşya 40–400 B; Daire 2.000; Çatı Katı 6.000 | Mülkiyet |
| Tabela/neon özelleştirme | 150–600 B | Gösteriş |
| Seri Dondurucu | 50 B | Alışkanlık sigortası |
| Takma ad değişimi / işletme adı | 500 / 200 B | Kimlik |
| Lonca kuruluşu (v1.1) | 500 B | Sosyal |

Kural: **bir sonraki tapu, o evredeki 3–5 günlük toplam gelire eşittir** (Otopark 1. gün, Büfe 3.–4. gün, Manav 6.–7. gün, Kargo Deposu ≈12. gün).

**Enflasyon kontrolü — cezasız:** Haftalık bakım, kira ve bozulma **yoktur** (kayıp kaygısı 13 yaşında motivasyon aracı değildir). Fren dört yapısal sınırdır: kasa tavanı, işletme sayısı tavanı (`1 + ⌊seviye/6⌋`, türden 1), referans çözüm tavanı ve tier'e endeksli fiyatlar; Pazar'da haftalık rotasyon sürekli yeni gider yaratır; haftalık ekonomi panosu (dolaşımdaki Bayt, gider/kaynak oranı hedefi 0,7–0,9, "gelirin %70'i 10 günde harcansın") ayar düğmesidir; lansman öncesi 10.000 bot simülasyonu zorunludur. **Bayt oyuncular arası transfer edilemez** (hediye, ticaret, düello bahsi yok): RMT kapısı kapalı, 13+ kitlede kumar benzeri mekanik yok.

**Çip'in rolü:** yalnızca Pazar'ın **Butik** rafı: premium kıyafet setleri, oda temaları, emote paketleri, neon paleti, isim rengi, ikinci avatar kaydı, ek dolap slotu. **Asla satılmayanlar:** XP, Bayt, ipucu, ek test hakkı, zaman atlama, işletme, Ruhsat, kasa tavanı, sandbox önceliği. Çip az miktarda kazanılabilir (Semt Sınavı 10 Çip; 100 Çip ≈ bir premium set). Varsayım: 100 Çip ≈ 60 TL; MVP'de küçük Butik (4 ürün) ödeme isteğini ölçer.

**Kozmetik felsefesi — "Kazanılan gösterilir, satın alınan süslenir."** Beş nadirlik kademesi: **Sıradan** ve **Şık** (Bayt), **Nadir** (Bayt, rotasyon), **Premium** (Çip; şık ama statik), **Nişan** (yalnızca kazanılır, Bayt'la bile alınamaz; altın çerçeve + animasyon: "Otopark Ustası" şapkası = gizli testlerin tamamı ilk 3 denemede, Semt Madalyası, Düello ceketi, Mentor rozeti). Sanalika Plus'ın "parayı veren havalı olur" algısının tersi.

## 9. Sosyal katman

Sosyal önce **pasif** (herkes için, senkron gerektirmez), sonra **aktif** (isteğe bağlı) kurulur; ilk haftaların az nüfusu soğukluk üretmez.

| Katman | Özellik | Ayrıntı | Sürüm |
|---|---|---|---|
| Ziyaret | Oda ve işletme ziyareti, ziyaretçi defteri (son 20), Alkış (yer başına günde 1), turist modu | "En çok ziyaret edilen işletmeler" LED panoda | MVP |
| Vitrin | L2+ işletmede kod sergisi; Kod Panosu okuma günde 3 × 10 XP | Kod okumak yazmak kadar öğretir | MVP (salt okunur), notlar v1.1 |
| Sohbet | Meydan (balon, 40 kişilik shard, 1 mesaj/3 sn, 200 karakter, link yok), oda sohbeti, arkadaş DM | Haiku ön filtre + sözlük + şikâyet (3 şikâyet → gizle + insan kuyruğu); 13–17 **güvenli mod** | MVP |
| Arkadaş | Takma ad veya kısa kod/QR, karşılıklı onay; "arkadaşın işletme açtı" akışı | Arkadaş ligi 30 kişilik; davet kodu iki tarafa 100 B | MVP |
| Liderlik | Haftalık ligler (Bronz → Elmas, 30 kişilik kova; terfi ilk 7, düşme son 5), **Kalıcılık Ligi** (altın durak), **En Hızlı Otopark** (ilk geçiş süresi), "en kazançlı işletme" | Pazar 21:00 kapanış | MVP |
| Kod Düellosu | **Asenkron**: 24 saat içinde aynı problem, sunucu zamanlaması, tüm testleri geçen en kısa süre kazanır; Elo farkı ≤200; 200+ problem, rastgele parametre | Bahis ve giriş ücreti yok; kazanan 15 B + 50 XP | v1.1 |
| Arena | Canlı 5 dk düello, seyirci test çubuklarını izler, sonunda kodlar karşılıklı görünür; Cumartesi 20:00 turnuva, şampiyon ceketi (Nişan) | — | v1.2 |
| Lonca ("Yazılım Ekibi") | 5–30 üye, Sev. 12+, Kampüs'te Lonca Binası; haftalık lonca görevi; lonca içi kod incelemesi (Hata Bildirimi motoru, iki tarafa 20 XP); **Lonca Projesi**: Şehir Uygulaması'nın çok dosyalı sürümü, her üye bir sınıfın sahibi, interface'ler ekip içi sözleşme, gizli entegrasyon testleri, pay 300–1.000 B | — | v1.1 (lonca), v2 (proje) |
| Mentorluk | Sev. 18+ **Kalfa Yardımı**: Akademi Lobisi'nde soru cevaplama; mentor kodu görür ve yorum yazar, kod yazamaz; cevabı Haiku süzer | Menti her Semt Sınavı'nı geçince mentora 50 XP + Mentor rozeti | v1.2 |
| Akran incelemesi | Kalfa+ anonim çözümleri 4 maddelik rubrikle inceler; AI incelemesiyle ≥%70 örtüşürse 10 XP | — | v1.2 |

Kullanıcı üretimi metin yalnızca takma ad, sohbet, ziyaretçi defteri ve Vitrin notlarıdır; hepsi moderasyonludur. Hediye ve ticaret hiçbir sürümde yoktur.

## 10. Yapay zekâ öğretmen: "Usta" NPC'ler ve Kurul

**Öğretmen ile puanlayıcı ayrıdır.** Ustalar sıcak ve kişiliklidir: ders anlatır, Sokratik soru sorar, ipucu verir, iş emrinde müşterinin sözcülüğünü yapar. **Kurul** kişiliksiz, rubrik tabanlı puanlayıcıdır; ekranda mühürlü bir kart olarak görünür. Oyuncu "Defne bana kızdı" değil "Kurul Tamlık'ta 22/30 verdi" der; güven öğretmende, hesap verebilirlik sistemde kalır; aynı cevaba aynı puan ligleri adil kılar.

| Usta | Semt | Kişilik | Tipik cümle | Tik |
|---|---|---|---|---|
| Defne | Çarşı | Sıcak, sabırlı, benzetmeci ("kutu", "tarif") | "Değişken bir kutu; `int` kutunun üstündeki etiket." | Tebeşir çevirir |
| Kerem | Liman | Pratik, hızlı, liman jargonu | "Liste bir konteyner dizisi; `foreach` vinç." | Hesap makinesi taşır |
| Nehir | Atölyeler | Titiz, tasarım kokusu bulur | "Bu sınıf üç iş yapıyor; bir atölyede üç usta olmaz." | İsimleri düzeltir |
| Baran | Kampüs | Meraklı, en Sokratik, esprili | "Sorguyu bana sormadan önce veriye sor." | Her şeyi tabloyla anlatır |
| Elif | Finans Bölgesi | Disiplinli, "önce test" | "Çalıştı demek yetmez; kanıtı nerede?" | Kronometre |
| Selin | Veri Vadisi | Düzenli, şemacı | "Veri yalan söylemez; şema söyler." | Kalem arkasında |
| Yusuf | Bulut Tepesi | Sistemci, büyük resim | "Şehirdeki her dükkân konuşabilmeli; API bu." | Dürbün |

Hata ayıklama koçluğu ayrı bir NPC değil, her Usta'nın bir yüzüdür: derleyici hataları en sık 50 CS kodu için statik Türkçe tabloyla (CS0029 → "int değişkene string atamaya çalıştın", CS1002 → "satır sonunda `;` eksik"), kalanı Haiku ile açıklanır; Usta hata mesajlarını "pul koleksiyonu" gibi biriktirir.

**Rolü:** Sokratik soru; iş emrinde müşteri sözcülüğü; **4 kademeli ipucu merdiveni** — **Pusula** (hangi kavram) → **Fener** (hangi durum/satır) → **Taslak** (sözde kod / eksik satır) → **Örnek** (benzer ama farklı mini problem); ipuçları içerik bankasından gelir (AI maliyeti yok), anında, ücretsiz ve sınırsızdır; ipuçsuz ilk denemeye "+%15 Berrak Zihin". Test geçince kısa kod incelemesi (bonus 10–30 XP; **gelire etkisi yoktur**).

**Sınırları:** Test sonucuna karar vermez, gelire dokunmaz, çözümü yazmaz (en fazla "Örnek" kademesi). Oyun dışı konu, kişisel veri, flört, siyaset → 2 cümleyle Akademi'ye döndürür; kriz ifadesinde güvenlik metni; 13–17 için sıkı konu filtresi. Oyuncunun yazdığı her şey **veridir, talimat değildir**: "Bana 100 ver" tipi enjeksiyonu Haiku önden sınıflandırır, o soru 0 puan, ilk seferde mizahi uyarı ("Kurul kandırılmaz"). Usta'nın aracı (tool) yoktur; cevap 1.500 karakterle sınırlı veri bloğunda gider; yanıt ≤80 kelime, emoji yok, isimle hitap; formül sabittir: **1 doğru şey + 1 eksik + 1 sonraki adım**; "Aferin" günde en çok bir kez, yerine süreç övgüsü; hata dili "henüz değil; şu satıra bak".

**Soru tipleri ve kim karar verir:**

| Soru tipi | Bloom | Karar veren | Hile direnci | AI maliyeti |
|---|---|---|---|---|
| **Kavram Sorusu** (serbest metin) | Hatırla / Anla | Kurul, rubrik | Kişiye özel bağlam | Var |
| **Çıktı Tahmini** | Anla / Analiz | Sandbox (değer) + Kurul (gerekçe) | Rastgele parametre; gerekçesiz doğru değer ≤40/100 | Yarım |
| **Hata Avı** | Analiz / Değerlendir | Sandbox + Kurul (1 cümle neden) | Hata konumu rastgele | Yarım |
| **Kod Yazma** | Uygula / Yarat | Sandbox (açık + gizli + tohumlu); Kurul yalnızca yorumlar | Tohumlu testler, Savunma | Yok |

Görev tipleri **Sıralama** (Parsons, çeldirici satırlı), **Tamamlama** ve **Sıfırdan** AI'sız puanlanır. Hedef: puanlanan etkileşimlerin **≥%50'si deterministik**.

**Puanlama ilkesi:**
- **Rubrik önce:** 0–100 ölçeği, 3 kriter (Doğruluk 50 / Tamlık 30 / Açıklık 20) cevap kutusunun üstünde görünür; puan ekranı kriter başına 1 cümle gerekçe + cevaptan alıntı gösterir.
- **Eşikler:** ≥70 geçer; 85+ "parlak" (+%20 XP); <40'ta ders kartı yeniden önerilir, XP kaybı yok. XP = 30 × puan/100 (geçince en az 15; denediyse en az 5; parlak en çok 36). 2 deneme; ikincisi %80 XP. Usta'nın canlı takip sorusu yalnızca telafi puanı verir (en çok +10).
- **Soru kaynağı:** puanlanan sorular canlı üretilmez; `claude-opus-5-5`'in ürettiği, eğitmenin onayladığı, 40 maddelik C# kavram yanılgısı listesine dayalı sürümlü bankadan gelir.
- **Boru hattı:** Haiku (boş / konu dışı / enjeksiyon / kopya, ~0,3 sn) → `claude-sonnet-5-5` (JSON şema `{puan, kriter_puanlari[], gerekce[], alinti[], geri_bildirim, sonraki_adim, guven}`, sıcaklık 0, rubrik + bağlam + persona prompt cache'te) → güven < 0,65 veya puan 70 eşiğine ±5 yakınsa `claude-opus-5-5` kör ikinci okuma (~%8); ≥15 puan ayrışmada oyuncu lehine. p95 < 4 sn.
- **Adalet:** yazım puan kırmaz; TR/EN terim kabul; kısmi puan var, negatif yok; aynı cevaba aynı puan.
- **Kalibrasyon:** soru tipi başına 300 cevaplık, iki eğitmenli altın küme; kappa ≥ 0,75 ve |AI − insan| ≤ 10 puan vakaların %85'inde; haftada 200 örneklem; sapması 5 puanı aşan soru yayından çekilir.
- **İtiraz:** soru başına 1, günde 3; Opus kör yeniden puanlar; fark ≥15 ise yeni puan geçerli ve vaka altın kümeye girer; ceza yok; KPI itiraz < %3.
- **Kota:** günde 30 AI puanlamalı etkileşim; dolunca ders **kilitlenmez**: cevap kaydedilir, gece Batch API ile puanlanır, XP sabah gelir ("Kurul bugünlük kapandı, cevabın sırada"); deterministik sorular, görevler, sandbox ve ipuçları devam eder.
- **Maliyet:** puanlama başına ≈ 2.500 önbellek + 400 giriş + 200 çıkış token ≈ **0,0033 $** (+ Haiku 0,0001 $, Opus payı 0,001 $); ortalama 12 etkileşim/gün → ≈0,05 $/DAU/gün, alarm 0,08 $; içerik üretimi Opus Batch API ile gece; Claude API'ye kişisel veri gitmez.

## 11. On tasarım ilkesi

1. **Görünmeyen kod yoktur.** Her derlenen satır dünyada bir şeyi değiştirir: pano akar, bariyer kalkar; kod bozulursa tabela kararır.
2. **20. dakikada ilk Bayt, 70. dakikada tapu, 2. oturumda açılış.** İlk 48 saatte mülkiyet hissi oluşmazsa oyuncu geri gelmez.
3. **Öğrenmek XP, yapmak Bayt.** Ders Bayt vermez; Bayt'ın %85'i çalışan koddan, kalanı bir öğrenme eyleminden akar; giriş takvimi yoktur.
4. **Testler hakem, Kurul puanlayıcı, Usta antrenör.** Geçme kararı deterministiktir; hiçbir AI gelire dokunmaz.
5. **Rubrik cevaptan önce görünür.** Her puanın kriter gerekçesi vardır.
6. **Önce oku, sonra tamamla, sonra yaz.** PRIMM sırası; ilk 3 derste sıfırdan kod yok; ders ≤3 yeni sembol, kart ≤60 kelime.
7. **Gösteriş kazanılır, süs satın alınır.** Nişan Bayt'la bile alınamaz; Çip stil verir, bilgi iddiası vermez.
8. **Her oturum bir tur kapatır; zorluk müşteri isteği kılığında gelir.** "Generics" değil, "Kütüphaneci Ayşe'nin her türden raf isteği".
9. **Hata ceza değil hikâyedir; kopyayı yakalamak yerine anlamsız kıl.** Kırmızı test = şikâyet balonu; XP geri alınmaz; bakım yok; tohumlu test + Savunma + referans tavanı kopyayı gelirsiz bırakır.
10. **Zamanlayıcı kasada durur, derste değil; unutmaya karşı takvim.** Hiçbir ders, ipucu, test zamanla ya da parayla kilitlenmez; her mühür 1-3-7-21 günde Günlük Tekrar'a döner.

## 12. En büyük 5 risk ve karşı önlem

| # | Risk | Belirti | Karşı önlem | Erken test |
|---|---|---|---|---|
| 1 | **"Okul gibi" hissetmesi / ilk oturumda boğulma** | Ders terk >%20; editörde 0 karakter | Oturumun ≤%40'ı ders; kart ≤60 kelime; PRIMM rampası; Türkçe derleyici hataları; her dersin sonunda görünür iş emri; HUD ilk 30 dk'da 3 öğe | H4: 20 öğrenciyle Otopark "kâğıt" testi; ders terk <%15 |
| 2 | **Sandbox güvenliği, gecikmesi, maliyeti** | Kuyruk birikimi, p95 >10 sn | gVisor (runsc), ağ yok, 256 MB / 2 vCPU / 10 sn, salt okunur FS; 20 ısıtılmış container; Roslyn bellek içi derleme + kendi test koşucusu (≈1,5 sn); Redis kuyruğu + 2 worker; gece batch aynı havuzda (1.000 DAU ≈ 150 $/ay) | H2: 500 eşzamanlı çalıştırma + kaçış listesi |
| 3 | **AI maliyeti ve adalet algısı** | $/DAU >0,08; itiraz >%5 | Deterministik pay ≥%50; prompt caching; 30/gün kota + gece batch; Haiku ön eleme; Opus yalnız itiraz/içerik; rubrik-önce + kriter gerekçesi; kappa ≥0,75; maliyet alarmı | H3: 1.000 sentetik cevapla maliyet/p95; H5: kırmızı takım (50 enjeksiyon) |
| 4 | **Boş şehir ve D7 kopuşu** | Meydan'da <10 avatar; D7 <%15 | 40 kişilik shard'lar, NPC işletmeler, asenkron sosyal, inşaat halinde semtler, kohort bazlı açılış (kulüp kodları aynı shard'a), tapu ilk oturumda, Günlük Tekrar + seri | H9–10 kapalı beta 200 kişi: D7 <%15 ise 2 hafta erteleme |
| 5 | **Kod kopyası ve ekonominin kırılması** | 30 sn'de geçen gizli testler; Bayt birikimi | Tohumlu testler, zorunlu Savunma, referans tavanı, yükseltmelerin ders gerektirmesi; işletme sayısı + kasa tavanı, tier fiyatları, 10.000 bot simülasyonu, haftalık dolaşım raporu | H6: ekonomi simülasyonu |

Altıncı izlenen risk: **Tier 2→3 uçurumu** (OOP → LINQ/async, Sev. 18–25) — "Kalfa Köprüsü" ara görevleri; Lonca ve Kalfa Yardımı tam bu seviyede açılır (MVP sonrası).

## 13. MVP kapsamı ve 12 haftalık plan

**Kesinlikle içinde:**
- Telefon + OTP kayıt, doğum yılı, 13–17 veli onayı (SMS linki, 72 saat); dil seçimi (C# açık, 5 dil "yakında"); avatar (12 kombinasyon) + takma ad moderasyonu.
- Derleyici Meydanı + **Çarşı** + **Liman** + Bloklar (Stüdyo); Akademi; Pazar; Liderlik Panosu; LED pano; inşaat halinde semtler + turist modu.
- **18 ders** (12 Çarşı + 6 Liman), her derste 3 Usta sorusu; Usta Defne ve Kerem; 4 soru tipi + 3 görev tipi; Türkçe hata tablosu (50 CS kodu).
- **3 işletme:** **Otopark (L1–L2, tam ayrıntılı: 26 test, referans çözüm, 4 ipucu, Savunma, 3 Hata Bildirimi mutasyonu)**, Büfe, Kargo Deposu; gerçek sandbox; gece sentetik trafik ve kasa.
- XP/seviye 1–15 (Çırak/Kalfa/Zanaatkâr); Ruhsat; Çarşı Semt Sınavı; Metro Haritası (18 durak, altın durak).
- Bayt ekonomisi (görev, Ruhsat teşviki, Günlük Tekrar + seri, Hata Bildirimi, referans tavanlı işletme geliri, haftalık lig); 40 kozmetik, 25 oda eşyası, 5 Nişan; küçük Çip Butiği (4 ürün).
- Kurul puanlaması: rubrik-önce, kriter gerekçesi, itiraz, 2 deneme, kota + gece batch, altın küme, kalibrasyon paneli (iç araç).
- Sosyal: ziyaret, alkış, ziyaretçi defteri, arkadaş + davet kodu, Meydan sohbeti (13–17 güvenli mod), arkadaş ligi + Kalıcılık Ligi + En Hızlı Otopark, Vitrin (salt okunur).
- Admin paneli (içerik, moderasyon, ekonomi panosu), KVKK metinleri ve veri silme akışı, PWA, "mobilde okunur, masaüstünde yazılır" (işletme kodu için "sonra masaüstünde devam et" kartı).

**Kesinlikle dışında:** Lonca ve asenkron Kod Düellosu ve Vitrin notları (v1.1); Arena/turnuva, mentorluk, akran incelemesi (v1.2); Atölyeler ve sonrası semtler (görünür ama kapalı); sezonlar, oda genişletme, diğer diller, mobil sarmalayıcı, sesli sohbet, kullanıcı üretimi ders, öğretmen paneli (v1.1 adayı); hediye/ticaret (hiçbir zaman).

**Üç faz:**

| Hafta | Faz | Teslimat | Kapı / erken test |
|---|---|---|---|
| 1–4 | İskelet | OTP; sandbox (gVisor + Roslyn) + yük testi; ders motoru (kart, 4 soru tipi, Parsons); Kurul puanlama (rubrik + şema + caching); PixiJS kabuk + React HUD + Monaco; ilk 6 ders; Otopark uçtan uca | H2 sandbox 500 eşzamanlı; H3 AI maliyet/p95; H4 kâğıt testi |
| 5–8 | Çarşı & Liman | 18 ders, 3 işletme, ekonomi + gece batch, Oda, Pazar + Butik, Günlük Tekrar + Metro Haritası, ligler, sohbet + moderasyon, admin, KVKK | H5 kırmızı takım; H6 10.000 bot simülasyonu |
| 9–12 | Beta → yayın | Kapalı beta 200 kişi (10 kulüp), D1/D7 ölçümü, denge, açık yayın, ilk 1.000 kayıt | H10: D7 <%15 ise 2 hafta erteleme |

**Ekip (5–6 kişi):** CTO/backend (.NET, sandbox), oyun istemcisi (PixiJS + React), full-stack (ders motoru, admin), müfredat yazarı (C# öğretmeni; haftada 3 ders + 3 görev; 2 sözleşmeli öğretmen gözden geçirir), yarı zamanlı piksel sanatçısı, kurucu (ürün + topluluk). İçerik hattı: Opus taslak → yazar → ikinci göz → JSON şablon.

**İlk 1.000 kullanıcı:** 10 lise/üniversite yazılım kulübü (20–40 kişi, kohort kodlarıyla aynı shard'a), 3 Türkçe yazılım YouTuber'ı ile "Otopark'ı yaz" videosu, Discord, davet kodu (iki tarafa 100 B).

**KPI eşikleri:** ilk Bayt ≤20 dk (%70); 72 saatte Otopark AÇIK (%35); D1 ≥ %45, D7 ≥ %20, D30 ≥ %8; AI p95 < 4 sn; sandbox p95 < 6 sn; AI ≤ 0,08 $/DAU/gün; itiraz < %3; ders terk < %15; moderasyon şikâyeti < %1 mesaj; Akademi/Pazar süre oranı > 1.

## 14. Jüri Kararları

| # | Çelişki | Karar | Gerekçe |
|---|---|---|---|
| 1 | Seviye tavanı ve XP eğrisi | Tavan **60**; `XP(L) = yuvarla10(80 × L^1,35)` (L→L+1), Toplam(60) ≈ 504.000; günlük XP tavanı yok | Kazananın eğrisi, indeks tanımı netleştirildi; 1 yıllık yolculuğa oturur; grind'i tekrar görevlerin 0 XP'si keser |
| 2 | Semt sayısı, adları, konu dağılımı | 7 öğrenme semti (Çarşı, Liman, Atölyeler, Kampüs, Finans Bölgesi, Veri Vadisi, Bulut Tepesi) + Meydan + Bloklar; LINQ ve DateTime/JSON Kampüs'te, async + unit test + Git Finans'ta | Kazananın adları en somut dünya hissi; Ürün'den Git, Eğitim'den exception'ın Atölyeler'de kalması |
| 3 | MVP kapsamı | Çarşı + Liman, 18 ders, 3 işletme (Otopark L1–L2, Büfe, Kargo Deposu) | 12 haftaya sığan tek kapsam; 24 ders / 6 işletme tek yazara ağır |
| 4 | Otopark dilim yorumu | Dilimi **ham kalış süresi** belirler, saat yukarı yuvarlanır: 61 → 200, 119 → 200, 120 → 80 | Müşteri "2 saatten az **kalanlar**" diyor; 61 dakika kalan 2 saatten az kalmıştır; anomali noktası 119/120 (Keskin Göz) |
| 5 | 24 saati aşan kalış | "Her başlayan gün 250": 1.441 → 500, 2.881 → 750 | "Başlayan birim tam sayılır" ile tutarlı; Ürün'ün karma formülü (1.441 → 350) öğretilmesi zor; ertelemek netleştirme adımının amacına aykırı |
| 6 | Metot imzası ve sınır girdileri | `Otopark.UcretHesapla(int dakika) : int`; 0 → 0; girdi ≥ 0 sözleşmeyle garantili; negatif kayıt L3'te `ArgumentOutOfRangeException`; 6 açık + 14 gizli + 6 tohumlu | Tier 1'de exception öğretilmemiştir; TL tam sayıdır; hata yönetimi ileride müşteri isteği olur |
| 7 | İşletme gelirinin kaynağı | Gelir = oyuncunun kodunun sentetik trafikte ürettiği TL / 10, **referans çözümle tavanlı**; AI kalite çarpanı **yok** | İmza mekaniği korunur (iki jüri de en özgün fikir dedi); tavan istismarı kapatır; "AI hakem değildir" gelire uzatıldı |
| 8 | Otopark fiyatı, kapısı, zamanı | 300 B + Sev. 3 + Ruhsat 3/3 (1.2–1.4); tapu ≈70. dk; Çay Ocağı yok | Brief: otopark kanonik İLK işletme; "tapu önce, kod sonra" ve "KAPALI — yazılım bekliyor" D1 kancası; Belediye teşviki fiyatı ilk oturuma taşır |
| 9 | Gelir ritmi | Üretim 24 saate yayılır, kasa 8 saatlik üretimi tutar, dolu kasa üretimi durdurur; L1 ≈220 B/gün tam toplamada | Hay Day ritmi geri dönüş kancasıdır; 8 saat tavanı aynı mekaniğin tek toplama hâli |
| 10 | Eşzamanlı işletme sınırı | `1 + ⌊seviye/6⌋`; türden 1 | Semt eşikleriyle (6, 12, 18…) aynı ritim |
| 11 | Giderler, ceza, Bayt transferi | Bakım/kira yok; Seri Dondurucu 50 B kalır; transfer, hediye, ticaret, düello bahsi **yok** | Kayıp kaygısı 13+ kitlede motivasyon aracı değil; bahis Eğitim'in kendi ilkesiyle çelişiyordu; RMT kapısı kapalı |
| 12 | Çip mağazası MVP'de mi | Evet, küçük Butik (4 ürün); Semt Sınavı 10 Çip; 100 Çip ≈ 60 TL (varsayım) | Ödeme isteği MVP'de ölçülmeli; kazanım ödemeyenlere premium tadı verir |
| 13 | Usta kadrosu ve puanlayıcı | Defne, Kerem, Nehir, Baran, Elif, Selin, Yusuf; müşteri Hasan Abi; puanlayıcı kişiliksiz **Kurul**; "Usta" yalnızca NPC | Kazananın kadrosu; Eğitim'in öğretmen–puanlayıcı ayrımı adalet algısı ve lig tutarlılığı için |
| 14 | Puanlama ölçeği, eşik, itiraz | 0–100, 50/30/20, ≥70 geçer, 85+ parlak, 2 deneme, itiraz soru başına 1 / günde 3, güven <0,65 → Opus, ≥15 fark oyuncu lehine, kappa ≥0,75 + 300'lük altın küme | Kazananın ölçeği; Eğitim'in rubrik-önce, kriter gerekçesi ve adalet kuralları; Ürün'ün güven eşiği |
| 15 | Geçiş kapıları | Ders Mührü (3'te 2 ≥70) + Telafi Turu; 3 görev = Ruhsat; Semt Sınavı 20 dk (3 kod + 3 soru, interleaving), bekleme yok | Çift kapı XP kasmayı engeller; 24 saat bekleme kopuş riski; Bitirme Projesi Semt Sınavı'nın kod görevlerine sıkıştırıldı |
| 16 | 13–17 veli onayı | Oyun kilitsiz; serbest metin sohbet ve DM onaya kadar kapalı (emote + hazır cümle açık); SMS linki 72 saat; onaylıda güvenli mod | "Kapalı başlar, onayla açılır" hukuken savunulabilir; öğrenme bekletilmez |
| 17 | Günlük kanca | **Günlük Tekrar** (SRS 5 soru, 1-3-7-21): 20 B + 15 XP + seri; 1 ücretsiz dondurma/hafta + 50 B; giriş takvimi kaldırıldı | Aynı kancayla kalıcılık; "her Bayt bir öğrenme eyleminin arkasında" tutarlı hâle gelir |
| 18 | Kod Düellosu | v1.1 asenkron (24 saat, bahis yok, 15 B + 50 XP), v1.2 canlı Arena + Cumartesi turnuvası; MVP'de "En Hızlı Otopark" | Eşleştirme/anti-cheat yükü olmadan erken test; Arena'nın gösteriş değeri korunur |
| 19 | Dil kartları ve kapasiteler | 6 dil kartı; Meydan shard 40, oda 20, işletme içi 15; OTP 90 sn | Daha çok talep sinyali; kulüp kohortu tek shard'a sığar |
| 20 | Unvan zinciri | Çırak → Kalfa → Zanaatkâr → Mühendis → Baş Mühendis → Mimar → Şehir Mimarı → Efsane (60 + 10 Mentor kilometre taşı) | Kazananın zinciri; "en üst unvan öğreterek" ilkesi Efsane'ye bağlandı |
| 21 | Ev/oda | Stüdyo 6×6 (MVP) → Daire 8×8 Sev. 10 (2.000 B) → Çatı Katı Sev. 20 (6.000 B) | Kazananın ızgarası; Ürün'ün kademeli fiyatları |
| 22 | Adlandırma dili | Çarşı + Liman Türkçe tanımlayıcılar; Atölyeler'in ilk dersi İngilizce konvansiyona geçiş; sonrası İngilizce | Üç belgenin ortak önerisi |

## 15. Varsayımlar ve Açık Sorular

**Varsayımlar**
1. Oyun içi kur 10 TL = 1 B; Otopark L1 trafiği 12 araç/gün, dilim içi dağılım tekdüze; tüm sayılar lansman öncesi 10.000 bot simülasyonuyla yeniden ayarlanır.
2. Veli onayı için SMS linki yeterli sayılmıştır; e-Devlet gereği çıkarsa akış değişir (hukuk/KVKK doğrulayacak).
3. İpuçları içerik bankasından geldiği için AI maliyeti üretmez; yalnızca Kavram Sorusu, Çıktı Tahmini gerekçesi, Hata Avı açıklaması, Savunma ve kod incelemesi kotaya sayılır.
4. İşletme simülasyonu günde 1 toplu çalıştırma + önbellek; saatlik kasa akışı günlük sonucun paylaştırılmasıdır.
5. Claude API liste fiyatları (Sonnet 5.5 2 $/10 $, önbellek okuma 0,20 $; Haiku 5.5 0,10 $/0,50 $; Opus 5.5 4 $/20 $ per MTok) ve ≈45 TL/$ kuru sabit; 1.000 DAU'da aylık AI gideri ≈1.500 $, sandbox ≈150 $.
6. Kayıtlıların ≈%30'u günlük aktif; SMS OTP ≈0,25 TL, kullanıcı başına ≈3 SMS; Roslyn derleme + test ≈1,5–3 sn CPU.
7. İstemci PixiJS izometrik + React HUD + Monaco; alt sınır 4 GB RAM telefon, masaüstü Chrome/Edge son 2 sürüm.
8. Tek müfredat yazarı haftada 3 ders + 3 görev üretir; işletme şablonu 2 günde dolar.
9. Çip paketi 100 Çip ≈ 60 TL; dönüşüm %2–3; gelir modeli ilk 6 ayda ikincildir.
10. Veri KVKK gereği Türkiye'de; Claude API'ye yalnızca cevap metni ve kod gider; sabit SRS aralıkları MVP'de yeterli, uyarlanabilir çizelgeleyici v2.

**Açık Sorular**
1. 119/120 anomalisini Usta mı işaret etmeli, yalnızca fark eden oyuncu mu ödüllenmeli? (Karar: oyuncu; ilk 1.000 oyuncuda A/B.)
2. Savunma başarısızlığında Deneme modunun %50 geliri doğru oran mı, işletme kapalı mı kalmalı?
3. Bayt ile alınan "Büyük Kasa" eşyasıyla kasa tavanı 12 saate çıksın mı? (Çip ile asla.)
4. İşletmeler satılabilmeli mi (ikinci el piyasa)? Bayt transferi yasağıyla nasıl bağdaşır?
5. Vitrin'de kod paylaşımı kopyayı kolaylaştırır mı; L2+ ve Savunma şartı yeterli mi?
6. Kalıcılık Ligi ana lig olabilir mi?
7. Öğretmen paneli v1.1'e alınmalı mı?
8. AI puanlama kayıtları kaç ay saklanacak; silme talebinde altın küme nasıl anonimleştirilecek?
9. İkinci dil Python mı JavaScript mi? ("Haber ver" sayaçları karar verdirecek.)
10. "KodKent" adının marka ve alan adı uygunluğu (alternatifler yalnızca ek için: Kodşehir, BaytKent, DerleKent).
