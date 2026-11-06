# KodKent — Kurucu Fikri, Sabit Kararlar ve Genişletme Yönü

> Bu dosya, çok-ajanlı tasarım ekibinin ortak referansıdır. Buradaki "SABİT" maddeler tartışmaya kapalıdır; "YÖN" maddeleri geliştirilmeye açıktır.

## 1. Kullanıcının (kurucunun) orijinal fikri — birebir öz
- Herkes **telefon numarası ile kayıt** olur (SMS OTP).
- Kayıt sonrası **öğrenmek istediği programlama dilini seçer**; başlangıçta **sadece C#** açık olur, diğerleri "yakında".
- Oyun dünyası **Sanalika tarzı**: Türkiye'nin Habbo benzeri, avatarlı, odalı/sokaklı, sosyal sanal şehir oyunu. Avatar, kıyafet/kozmetik, kendi mekânın, diğer oyuncuları ziyaret.
- İçeride **eğitimler** ve **görevler** var.
  - Bir **eğitim** içinde sorular sorulur, kullanıcı cevap verir. **Yapay zeka soru sorar ve cevabı puanlar.** Kullanıcı böylece **XP** kazanır; **level/seviye** mantığı vardır.
- Sonrasında **C# ile yazılacak gerçek yazılım işleri** gelir. Örnek: Oyuncu bir **otopark** satın alır. Sonra otopark için bir **park ücreti hesaplama sistemi** yazar. Şartları oyun verir:
  - "2 saatten az kalanlar: saati 100 TL"
  - "2–6 saat arası: her saat 40 TL"
  - "6–24 saat arası kalanlar: günlük ödeme 250 TL"
  - Oyuncu bu kuralları C# ile kodlar; kod çalışırsa işletme çalışır ve oyuncu **oyun içi para kazanır**.
- Kazanılan **para ile kozmetikler** (ve benzeri şeyler) alınır.
- Ürün sloganı/konsepti: **"Oyunlarla yazılım öğreniyorum."**
- İstenen çıktı: A'dan Z'ye **mimari + yazılım + oyun içi ekran görünümleri**, **aşırı detaylı**; fikir geliştirilsin.

## 2. SABİT kararlar (tüm belgelerde aynen kullanılacak)
- **Ürün adı (çalışma adı): KodKent.** Alternatif isimler yalnızca bir "ek" bölümünde önerilebilir; metin gövdesinde her yerde KodKent kullanılır.
- **Para birimleri:** Yumuşak (oyun içi kazanılan) para: **Bayt** (çoğul: Bayt; kısaltma: ₿ yerine "B" veya madeni para ikonu). Premium (satın alınan) para: **Çip**. Deneyim puanı: **XP**.
- **Dil:** Tüm oyun metinleri ve bu belgeler **Türkçe**; teknik terimler (API, sandbox, container, LINQ vb.) İngilizce kalabilir.
- **Hedef kitle:** 15–25 yaş ağırlıklı, Türkiye; yazılıma sıfırdan başlayanlar ve lise/üniversite öğrencileri. 15 yaş altı kayıt olamaz; 15–17 için veli onayı akışı.
- **Platform:** Web-öncelikli (masaüstü tarayıcı + mobil tarayıcı/PWA). Sonraki sürümde mobil uygulama sarmalayıcı.
- **Backend teknolojisi:** .NET (ASP.NET Core) + PostgreSQL + Redis. Gerekçe: ürün C# öğretiyor; ekip C# bilir; sandbox ile aynı ekosistem.
- **Yapay zeka:** Claude API. Model kimlikleri: `claude-sonnet-5-5` (varsayılan puanlama/diyalog), `claude-haiku-5-5` (hızlı sınıflandırma, moderasyon, kopya tespiti ön eleme), `claude-opus-5-5` (içerik üretimi, zor itirazlar). Structured output (JSON şema) ve prompt caching kullanılır.
- **Kod çalıştırma:** Oyuncunun C# kodu **gerçekten derlenir ve test edilir** (sunucu tarafı izole sandbox). Yapay zeka test sonucunu belirlemez; sadece geri bildirim/ipucu/kod incelemesi yapar.
- **Para kazanma ilkesi:** Öğrenme asla paralı değildir (pay-to-learn yok). Çip yalnızca kozmetik/konfor içindir. Bayt satın alınamaz.
- **Otopark örneği kanonik ilk işletmedir** ve kullanıcının verdiği kurallar "müşteri isteği" olarak birebir korunur; belirsizlikler (saat yukarı yuvarlama, tam 2 ve 6 saat sınırları, 24 saati aşan kalışlar) açık bir "gereksinim netleştirme" adımıyla çözülür ve bu, bir öğretim anı olarak kullanılır.

## 3. YÖN — geliştirilmesi istenen alanlar
- Şehir yapısı: semtler/bölgeler, binalar, Akademi, oyuncu işletmeleri, ev/oda, meydan; Sanalika hissi (avatar, oda, ziyaret, sohbet) ama öğrenme odaklı.
- Çekirdek döngü: Öğren (Akademi dersi, AI soru-cevap) → Uygula (görev) → İnşa et (işletme kodu) → Kazan (Bayt) → Harca (kozmetik/işletme/ev) → Göster (sosyal) → tekrar.
- İlerleme: XP eğrisi, seviye, unvanlar, yetenek ağacı (C# konu haritası), semt/işletme kilitleri.
- Eğitim sistemi: ders formatı, soru tipleri (kavram, çıktı tahmini, hata düzeltme, kod yazma), Sokratik AI öğretmen (NPC "Usta" karakterleri), rubrik tabanlı puanlama, kalibrasyon, itiraz, kopya/istem enjeksiyonu savunması, maliyet modeli.
- Müfredat: tam C# yolculuğu (değişkenlerden LINQ, OOP, async, EF Core, Web API'ye); her ders bir semt/işletme ile eşleşir.
- İşletme kataloğu: 15–20 işletme; her biri gerçek bir yazılım projesi, kademeli zorlukla (Tier 1→4). Otopark tam ayrıntılı (test vakaları, gizli testler, referans çözüm).
- Görevler: günlük/haftalık/hikâye görevleri; etkinlikler; sezonlar.
- Sosyal: arkadaş, ziyaret, sohbet (moderasyonlu), loncalar ("Yazılım Ekibi"), liderlik tabloları, Kod Düellosu (aynı problem, en hızlı doğru), akran kod incelemesi, mentorluk.
- Ekonomi: musluklar/giderler, enflasyon kontrolü, fiyat tabloları, pasif gelir formülü, çevrimdışı gelir tavanı.
- Teknik mimari: servisler, veri modeli, API, gerçek zamanlı (SignalR), kuyruklar, sandbox güvenliği, KVKK, anti-cheat, gözlemlenebilirlik, DevOps.
- İstemci: oyun motoru seçimi (PixiJS izometrik + React arayüz + Monaco editör), ekran listesi ve her ekranın yerleşimi, HUD, mobil uyum.
- Ürün: MVP kapsamı, yol haritası, ekip, maliyet, KPI, riskler, rakip analizi (Sanalika, Duolingo, Codecademy, CodeCombat, Codewars, Exercism, Screeps, Mimo).

## 4. Çıktı standartları (tüm ajanlar)
- Türkçe yaz. Somut ol: sayılar, tablolar, isimler, örnekler. Genel geçer tavsiye yazma.
- Her belgenin sonunda "Varsayımlar" ve "Açık Sorular" bölümü olsun.
- Dosyaları Write aracıyla UTF-8 Markdown olarak yaz.
- Soru sorma; karar ver, varsayımı belgele.

## 5. Güncelleme (3 Kasım 2026) — yasal uyum
7578 sayılı Kanun ve 10 Ekim 2026 tarihli Resmî Gazete yönetmeliği (1 Kasım 2026'da yürürlükte; haber ve hukuk bürosu özetleriyle doğrulandı, HUKUK TEYİDİ ŞART): 15 yaş altına sosyal ağ hizmeti verilemez, yaş doğrulaması e-Devlet belirteciyle yapılır. Bu yüzden hedef kitle 15–25, asgari kayıt yaşı 15 (`min_kayit_yasi=15`); 15 altına nazik ret + bekleme listesi; 13–14 için veli onaylı yol MVP DIŞI; 15–17'ye güvenli mod ve veli bilgilendirmesi. Ayrıntı: spec/KANON.md §12.
