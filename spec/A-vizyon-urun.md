# KodKent — Vizyon Belgesi A: Ürün ve Teknoloji Liderliği Bakışı

> **Yazar rolü:** Startup CTO / ürün lideri. Önceliklerim sırasıyla: 12 haftada yayına çıkabilen bir MVP; yapay zeka ve sandbox maliyetinin kullanıcı başına tahmin edilebilir kalması; ilk 1.000 kayıtlı kullanıcıya ulaşıp onların en az beşte birini 7 gün tutmak; en büyük teknik riskleri ilk 4 haftada gerçek yükle test etmek. Bu belge kurucunun fikrini küçültmez, **sıraya koyar**: her öğe korunur, ama hangi sürümde geleceği yazılır.

---

## 1. Tek cümlelik vaat ve ürün tanımı

**Vaat:** *"KodKent'te yazdığın her C# satırı gerçekten derlenir, şehirdeki işletmeni çalıştırır ve sana Bayt kazandırır — oyunlarla yazılım öğreniyorsun."*

**Ürün tanımı (3 cümle):** KodKent, telefon numarasıyla iki dakikada girilen, avatarlı ve sokaklı bir sanal şehirdir; Akademi'deki derslerde yapay zeka "Usta" NPC'leri soru sorar, cevabı rubrikle puanlar ve oyuncu XP kazanarak seviye atlar. Yeterli dersi bitiren oyuncu şehirde bir işletme satın alır (kanonik ilk örnek: Otopark) ve işletmenin yazılımını gerçek C# ile yazar; kod sunucudaki izole sandbox'ta derlenip görünür ve gizli testleri geçerse işletme açılır ve saatlik Bayt üretir. Bayt ile kozmetik, mobilya, ev ve yeni işletme tapuları alınır; Çip yalnızca görünüm ve konfor içindir, öğrenme hiçbir zaman paralı değildir.

---

## 2. Oyuncu fantezisi

Oyuncu KodKent'te **"şehre sıfırdan gelmiş, kodla ayakta duran bir kent yazılımcısı"**dır. Öğrenci değildir: not defteri, sınıf, devamsızlık yoktur. Trenle gelir, yurt odasında başlar, ilk programını yazar, ilk tapusunu alır ve şehirde bir iz bırakır. Fantezinin üç katmanı vardır:

| Katman | Oyuncunun cümlesi | Oyunda karşılığı |
|---|---|---|
| **Kurucu** | "Bu otopark benim kodumla çalışıyor." | İşletme tabelasında `Yazılım: @rumuz` yazar; kod testleri geçmezse tabela kararır, işletme "kapalı" görünür. |
| **Çırak → Usta** | "Usta Ayşe cevabıma 85 verdi, Usta Demir'in atölyesine geçtim." | Unvan zinciri (Çırak, Kalfa, Usta…), her semtin kendi Usta'sı, kişisel geri bildirim. |
| **Görünür** | "Meydanda benim ceketimi sordular; evimi 40 kişi beğendi." | Avatar, oda, ziyaretçi defteri, haftalık liderlik, işletme önünden geçen oyuncular. |

"Aha" anı: oyuncu KodKent'teki Otopark kodunu kopyalayıp Visual Studio'ya yapıştırdığında **aynen derlenir**. Oyun, gerçek dünyaya açılan bir kapıdır; sahte bir kod dili değildir.

---

## 3. Çekirdek döngü

Döngünün motoru bir bağımlılıktır: **her işletme belirli dersleri şart koşar; her harcama yeni bir işletme ister; yeni işletme yeni ders ister.** Böylece "Harca" adımı oyuncuyu kendiliğinden "Öğren"e geri çeker.

| Adım | Ne olur | Süre | Anlık ödül | Sonrakine köprü |
|---|---|---|---|---|
| **Öğren** | Akademi dersi: 4–6 kısa kart + 3–5 soru (en az 1'i AI puanlı açık uçlu) | 8–12 dk | 60 XP + soru başına 0–30 XP + ders rozeti | Ders sonunda "Bu dersle açılan görev / işletme" kartı; tek tuşla göreve geçiş |
| **Uygula** | Görev: tek metot veya kısa program; Monaco editör; 3–5 görünür test | 5–10 dk | 80–150 XP + 30–80 Bayt | İşletme ilerleme çubuğu dolar ("Otopark: 3/4 ders tamam") |
| **İnşa et** | İşletme kodu: müşteri isteği → gereksinim netleştirme → kod → görünür + gizli testler → Usta kod incelemesi | 25–60 dk (Tier 1), 1–3 saat (Tier 3–4) | 400–2.500 XP, işletme AÇIK, kalite çarpanı 0,8–1,3 | Pasif gelir başlar; işletmenin "yükseltme görevleri" açılır |
| **Kazan** | Bayt saatlik birikir; oyuncu işletmeye uğrar, kasayı toplar | 10–20 sn / işletme, günde 1–2 kez | 12–120 Bayt/saat (tier'a göre), çevrimdışı tavan 8 saat | Günlük giriş alışkanlığı; yolda Pazar vitrini ve kilitli binalar görülür |
| **Harca** | Kozmetik, mobilya, ev yükseltme, yeni tapu | 1–3 dk | Anında görünür değişiklik | Yeni tapu kilitli → "2 ders eksik" → Akademi'ye dönüş |
| **Göster** | Meydan, ev/işletme ziyareti, beğeni, haftalık liderlik | 2–5 dk | Ziyaretçi defteri, beğeni sayacı, sıra | Başkasının işletmesini görmek → "bunu nasıl yaptı?" → ders |

İki ölçek: **mikro döngü** (günde 12–15 dk: topla → günlük görev → 1 ders → harca) ve **makro döngü** (haftada 2–4 saat: yeni işletme inşa et). Hedef: ilk 7 günde 5 mikro, 2 makro döngü tamamlanması.

---

## 4. İlk 30 dakika (dakika dakika onboarding)

Hedefler: 30. dakikada oyuncunun **en az 2 AI puanlı cevabı, derlenmiş 1 programı, 50+ Bayt'ı, odası ve HUD'da görünen tek bir sonraki hedefi (Otopark)** olmalı. OTP ≤ 90 sn, avatar ≤ 90 sn, ilk kod en geç 15. dakikada.

| Dakika | Ekran | Oyuncu ne yapar | Sistem ne yapar | Çıktı |
|---|---|---|---|---|
| 0:00–1:30 | Karşılama | Telefon numarası + 6 haneli OTP; doğum yılı | OTP SMS (60 sn'de yeniden gönder, 5 deneme/saat). 13 yaş altı reddedilir. 13–17: hesap açılır, "veli onayı bekleniyor" bayrağı (oyun açık, sohbet kapalı; veliye 72 saat içinde SMS onay linki) | Hesap |
| 1:30–2:30 | Dil seçimi | C# kartına basar; Python / JavaScript / Java kartları "Yakında — haber ver" | "Haber ver" tıklamaları ikinci dil kararı için sayılır | Yol: C# |
| 2:30–4:00 | Avatar | 3 adım: yüz/saç, kıyafet (6 başlangıç seti), rumuz | Rumuz filtresi (kelime listesi + `claude-haiku-5-5`), benzersizlik | Avatar |
| 4:00–6:00 | İstasyon | Trenden iner; Usta Ayşe 3 baloncukla karşılar; HUD (XP çubuğu, Bayt, görev paneli) tanıtılır; görev: "Akademi'ye yürü" | Tıkla-yürü, 1 emote öğretilir | 10 XP |
| 6:00–13:00 | Ders 1.1 "Merhaba KodKent" | 4 kart okur (Console.WriteLine, değişken, string interpolation); Soru 1 çoktan seçmeli, Soru 2 çıktı tahmini | İkisi de deterministik; anında sonuç | 60 XP |
| 13:00–15:00 | İlk AI sorusu | Usta Ayşe: "`var` yerine `int` yazmayı ne zaman tercih edersin? Kendi cümlelerinle." 1–3 cümle yazar | `claude-sonnet-5-5` rubrik puanı 0–100, 3 sn içinde; 1 cümle geri bildirim + 1 ipucu | 0–30 XP; Seviye 2, unvan **Çırak** |
| 15:00–22:00 | Görev "Dükkân Tabelası" | Editörde `string ad`, `int acilis` ile 2 satır çıktı üretir, "Çalıştır" | Sandbox derler (p95 < 6 sn), 3 görünür test yeşil | 100 XP + **50 Bayt** (ilk Bayt animasyonu) |
| 22:00–25:00 | Çarşı: Otopark | Usta Ayşe kilitli Otopark'a götürür; kart: "Seviye 4 · Ders 1.2–1.4 · 300 Bayt · Gelir 12 B/saat"; içeride giren çıkan NPC arabalar görünür | HUD'a hedef eklenir: "Otopark'a: 3 ders, 250 Bayt" | Hedef |
| 25:00–28:00 | Yurt odası | Odasına girer, hediye masayı yerleştirir | Oda düzenleme (grid) öğretilir | Oda |
| 28:00–30:00 | Günlük görevler | "Yarın: Ders 1.2 + günlük görev = 40 Bayt" kartı; PWA "ana ekrana ekle" | Streak sayacı başlar | Dönüş nedeni |

Oyuncu 30 dakikada hiçbir bekleme sayacı görmez, hiçbir ödeme ekranı görmez. Otopark, normal tempoda **60–75. dakikada** satın alınabilir (aynı gün ya da ikinci gün).

---

## 5. Dünya iskeleti

Şehir izometriktir; Meydan merkezde, Akademi kuzeyde, semtler çevrede halka halka açılır. Kilitli semtler sisle değil **inşaat halinde** gösterilir (vinçler, iskeleler, "Fabrika: 2 ders sonra açılıyor" tabelası) — oyuncu ufkunu görür.

| # | Semt | C# konu kümesi | Örnek işletmeler (Tier) | Giriş | Sürüm |
|---|---|---|---|---|---|
| 1 | **Çarşı** | Değişkenler, tipler, operatörler, string, Console I/O, koşullar, döngüler, ilk metot | Otopark (T1), Büfe (T1), Döviz Bürosu (T1) | L1 | MVP |
| 2 | **Atölye** | Metotlar, diziler, List/Dictionary, hata ayıklama, temel algoritmalar | Kargo Şubesi (T2), Kütüphane (T2), Market Stok (T2) | L7 + Çarşı Bitirme Projesi | MVP |
| 3 | **Fabrika** | Sınıf, nesne, kalıtım, interface, polimorfizm, enum, exception | Araç Kiralama (T2), Restoran Sipariş (T3), Üretim Hattı (T3) | L13 | v1.1 (görünür, kapalı) |
| 4 | **Veri Limanı** | LINQ, generics, dosya I/O, JSON, DateTime | Sinema (T3), Spor Salonu (T3), Gazete Arşivi (T3) | L19 | v1.2 |
| 5 | **Teknopark** | async/await, HttpClient, unit test, Git temelleri | Hava Durumu Kiosku (T3), Kurye Takip (T3), Borsa Panosu (T4) | L25 | v1.3 |
| 6 | **Veri Merkezi** | EF Core, SQL, migrations, minimal Web API | Otel Rezervasyon (T4), Hastane Randevu (T4), Banka Şubesi (T4) | L32 | v2 |
| 7 | **Kule** | DI, tasarım desenleri, SignalR, performans, mimari | Yazılım Şirketi (lonca merkezi), Stadyum (T4), Belediye (topluluk projeleri) | L40 | v2 |

**Ortak yapılar:** İstasyon (giriş, yeni oyuncular), Meydan (sosyal hub, duyuru panosu, liderlik tabelası, sokak NPC'leri), Akademi (her Usta'nın kendi sınıfı; dersler burada açılır), Konutlar (Yurt → Stüdyo → Daire → Villa), Pazar (Bayt kozmetik + Çip butiği), Arena (Kod Düellosu, v1.1).

**Sanalika hissini veren öğeler (somut liste):** tıkla-yürü avatar, balon sohbet, 12 emote (dans dahil), grid mobilya yerleşimi, kapı zili ve ziyaretçi defteri (son 20), oda kapasitesi 15 avatar, kıyafet dolabı, "beğen" butonu (günde 10 hak), 24 kişilik meydan instance'ları, işletme tabelasında yazılımcı adı, otoparka girip çıkan NPC arabalar gibi **canlı işletme animasyonları** (kod çalışıyorsa hareket vardır, çalışmıyorsa kapı kapalıdır).

---

## 6. İlerleme iskeleti

**XP eğrisi:** Seviye L'den L+1'e geçiş için gereken XP = `yuvarla10(100 × L^1,3)`. Erken seviyeler hızlı (ilk 3 seviye ilk oturumda), orta seviyeler haftalık ritme oturur.

| Seviye | Sonraki seviye için XP | Kümülatif XP | Unvan |
|---|---|---|---|
| 1 | 100 | 0 | Yeni Gelen |
| 2 | 250 | 100 | Çırak |
| 4 | 610 | 770 | Çırak |
| 5 | 810 | 1.380 | Kalfa |
| 7 | 1.260 | 3.220 | Kalfa |
| 10 | 2.000 | 7.710 | Usta Adayı |
| 15 | 3.380 | ≈20.400 | Usta Adayı |
| 20 | 4.600 | ≈40.300 | Usta |
| 30 | ≈8.300 | ≈104.000 | Mimar |
| 40 | ≈12.100 | ≈205.000 | Başmimar |
| 50 | tavan | ≈345.000 | Kent Efsanesi |

**XP kaynakları:** ders 60; AI sorusu `puan/100 × 30` (denerse en az 5); görev 80–150; işletme ilk geçişi T1 400 / T2 800 / T3 1.500 / T4 2.500; günlük görev 30; streak 7. gün +100; düello galibiyeti 50 (v1.1). Erken oyuncu saatte ≈350 XP kazanır; **MVP içeriği oyuncuyu ≈25–30 saatte L12 civarına taşır**, L13 Fabrika kapısıdır.

**Kilit mantığı (üç tip, hiçbiri zamanla açılmaz):**
1. **Ders kilidi:** semt içinde doğrusal ön koşul (1.3 için 1.2 gerekir); açık semtler arasında sıra serbest.
2. **İşletme kilidi:** seviye + ders seti + Bayt fiyatı. Örnek: Otopark = L4 + Ders 1.1–1.4 + 300 B; Büfe = L5 + Ders 1.5 + 600 B; Döviz Bürosu = L6 + Ders 1.6 + 900 B; Kargo Şubesi = L8 + Ders 2.1–2.3 + 1.500 B.
3. **Semt kilidi:** önceki semtte ≥2 işletme açık + seviye eşiği + **Bitirme Projesi** (semtin tüm konularını birleştiren 45 dk'lık görev, Usta'nın AI kod incelemesiyle).

**Yetenek ağacı:** C# konu haritası "Şehir Planı" olarak gösterilir; her düğüm bir ders, tamamlanan düğüm haritada binayı aydınlatır. Dağıtılacak puan yoktur (yanlış dal seçme kaygısı olmasın); harita bir **ilerleme haritasıdır**, karar ağacı değil.

**Seviye tavanı önerisi:** Yayında tavan 50 (içerikle ancak v2'de ulaşılır); MVP içeriği L12–15'te biter, XP birikmeye devam eder ve "Fabrika açılınca hazırsın" mesajı gösterilir. Prestij/sıfırlama yok; bunun yerine v1.2'den itibaren sezonluk unvanlar.

---

## 7. Öğrenme ↔ oyun bağı

İlke: **"Ders, işletmenin provasıdır."** Her dersin son görevi, bir sonraki işletme probleminin yaklaşık %40'ıdır; oyuncu işletmeye geldiğinde yapıyı tanır, sadece ölçek ve ayrıntı büyür.

**Otopark'a giden zincir (Çarşı, L1→L4, ≈60–75 dk):**

| Ders | Kavramlar | Görev (prova) |
|---|---|---|
| 1.1 Merhaba KodKent | Console, değişken, string interpolation | Dükkân Tabelası |
| 1.2 Sayılar ve Para | int/double/decimal farkı, Math.Ceiling, dakika→saat | "Dakikayı saate yuvarla" |
| 1.3 Koşullar | if / else if / else, karşılaştırma, && ve \|\| | "Yaşa göre bilet fiyatı" (3 dilimli — Otopark'ın yapısal ikizi) |
| 1.4 İlk Metodun | `static decimal Hesapla(int dakika)` imzası, parametre, return | "Taksimetre" (tek dilim) |

**Otopark yolculuğu adım adım:**

1. **Tapu (300 Bayt).** Oyuncunun o ana kadar ≈350–450 Bayt'ı vardır (4 görev + günlük). Satın alınca bina "KAPALI — yazılım bekliyor" görünür.
2. **Müşteri isteği.** Otopark sahibi NPC Kemal Abi, kurucunun kurallarını **birebir** söyler: "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL."
3. **Gereksinim netleştirme (zorunlu, 3–4 dk, öğretim anı).** Oyuncu Kemal Abi'ye soru kartları seçer; her cevap şartnameye bir madde ekler:
   - *Dakikalar nasıl sayılır?* → Başlayan saat tam sayılır (önce yukarı yuvarla, sonra dilime bak).
   - *Tam 2 ve tam 6 saat?* → "2'den az" = 2'den küçük; tam 2 ve tam 6 saat 2–6 dilimindedir; 6'dan büyük günlük tarifedir.
   - *24 saati aşarsa?* → Her tam 24 saat 250 TL; kalan süreye aynı tablo yeniden uygulanır.
   - *0 veya negatif dakika?* → `ArgumentOutOfRangeException`.
   - Usta Ayşe anomaliyi gösterir: 60 dk → 100 TL ama 61 dk → 80 TL. Kemal Abi: "Evet, uzun kalanı teşvik ediyorum." Ders: *müşteri isteği ile şartname aynı şey değildir; sen şartnameyi yazar, anomaliyi not edersin, kuralı değiştirmezsin.*
4. **Kod isteği.** Editörde iskelet verilir:

```csharp
public static class OtoparkUcret
{
    // dakika: aracın otoparkta kaldığı toplam süre (dakika)
    public static decimal Hesapla(int dakika)
    {
        // TODO: şartnameye göre ücreti döndür
    }
}
```

   Görünür testler (7): `30→100`, `61→80`, `150→120`, `360→240`, `361→250`, `1441→350`, `0→ArgumentOutOfRangeException`. Gizli testler (20): `60`, `119`, `120`, `1440`, `2880→500`, `2881→600`, `100000`, negatif değerler, `decimal` dönüş kontrolü.
5. **Sandbox.** Derleme + 27 test; her test için geçti/kaldı ve ilk 3 başarısız vakanın girdi-çıktısı gösterilir. 3 başarısız denemeden sonra Usta ipucu teklif eder (seviye 1: "Önce dakikayı saate çevir; 1.2'deki Math.Ceiling'i hatırla").
6. **Açılış.** Tüm testler geçince işletme AÇIK; arabalar animasyonla girmeye başlar. Usta Ayşe'nin AI kod incelemesi (10–20 sn, asenkron) **kalite çarpanını** belirler (okunabilirlik, sihirli sayı, isimlendirme; 0,8–1,3). Kararı testler verir, AI yalnızca çarpanı ve geri bildirimi.
7. **Para akışı.** `Bayt/saat = 12 × kalite × yükseltme`. İlk gün tipik: 8 saatlik tavanla ≈96–125 Bayt. Ekranda "Bugün 41 araç, 3.980 TL ciro" yazar; TL yalnızca simülasyon süsüdür, **Bayt asla oyuncunun kodunun çıktısından hesaplanmaz** (istismar kapısı kapalı).
8. **Yükseltmeler = yeni şartnameler.** v1.1 "Abone kartı" (yeni parametre, %50 indirim) → gelir +%25; v1.2 "Gece tarifesi" (`DateTime giris, cikis`) → çevrimdışı tavan 8→12 saat; v1.3 "Kapasite" (`List<Arac>`, dolu/boş) → gelir +%40. Tek işletme oyuncuyu üç ders boyunca taşır.

---

## 8. Ekonomi iskeleti

**Bayt kaynakları (erken oyuncu, L1–7, günlük):**

| Kaynak | Miktar | Not |
|---|---|---|
| Görevler | 30–80 B, günde ≈2 | İçerik bitince durur |
| İşletme pasif geliri | 12–24 B/saat × 8 saat tavan, günde 1–2 toplama | Ana musluk |
| Günlük görev | 20 B (+ 7. gün streak 50 B) | Alışkanlık |
| Haftalık liderlik | ilk 100: 200–1.000 B | Sosyal |
| İlk kez başarıları | 50–500 B, tek seferlik | Kılavuz görevi |

Erken toplam ≈300–400 B/gün, ≈2.000–2.800 B/hafta.

**Bayt giderleri (fiyat tabanı):** Otopark 300, Büfe 600, Döviz Bürosu 900; Atölye tapuları 1.500 / 2.200 / 3.000; Fabrika 5.000–8.000; Veri Limanı 10.000–15.000; Teknopark 20.000+. Ev: Yurt ücretsiz → Stüdyo 1.500 → Daire 6.000 → Villa 25.000. Kozmetik 50–600, mobilya 30–800, rumuz değişikliği 500, işletme adı 200, düello girişi 10 (v1.1). Kural: **bir sonraki tapu, o evredeki 3–5 günlük toplam gelire eşittir** (Otopark 1.–2. gün, Büfe 3.–4. gün, Döviz 6.–7. gün, ilk Atölye tapusu ≈12. gün).

**Enflasyon kontrolü:** çevrimdışı tavan; aynı tür ikinci işletme %60, üçüncü %40 gelir; Bayt oyuncular arası transfer edilemez (MVP ve v1 boyunca — RMT ve dolandırıcılık kapısı kapalı); haftalık ekonomi panosu (dolaşımdaki toplam Bayt, gider/kaynak oranı hedefi 0,7–0,9); Pazar'da haftalık rotasyon; tapu fiyatları seviye eğrisiyle birlikte ölçeklenir. Ceza yoktur (kira, bakım, bozulma yok); bu bir öğrenme oyunudur, kayıp kaygısı motivasyon aracı değildir.

**Çip'in rolü:** yalnızca Pazar'daki Çip butiği: premium kıyafet setleri 150–400 Çip, ev temaları 300, emote paketleri 100, ikinci avatar görünüm slotu 200, "Sezon Kartı" 400 (yalnızca kozmetik yol), isim rengi 50. Varsayılan paket: 100 Çip ≈ 60 TL (varsayım). Çip ile **asla** alınamayanlar: XP, Bayt, ipucu, ders veya işletme kilidi, sandbox önceliği, ek deneme hakkı, çevrimdışı tavan artışı.

**Kozmetik felsefesi — üç kategori:**
1. **Kazanılmış** (yalnızca başarıyla; Bayt'la bile alınamaz): "Otopark Ustası Şapkası" = gizli testlerin tamamı ilk 3 denemede. Statü yalnızca buradadır.
2. **Bayt kozmetikleri** (emek): geniş ve ucuz katalog.
3. **Çip kozmetikleri** (tarz): farklı görünür ama "daha güçlü" görünmez; altın taç, parlayan aura gibi statü sinyalleri Çip'te yoktur.

---

## 9. Sosyal katman

| Özellik | Tasarım | Sürüm |
|---|---|---|
| Arkadaş | Rumuz arama veya kısa kod/QR; karşılıklı onay. 13–17 veli onayı gelmeden yalnızca davet koduyla | MVP |
| Ziyaret | Ev ve işletme; ziyaretçi defteri; günde 10 beğeni; haftalık "en beğenilen ev" | MVP |
| Sohbet | Meydan (herkese açık, 1 mesaj/3 sn, 200 karakter, link yok), semt sohbeti, özel mesaj (yalnızca arkadaş). Moderasyon: kelime listesi + `claude-haiku-5-5` sınıflandırma + şikâyet butonu (3 şikâyet → otomatik gizle + insan kuyruğu). 13–17 veli onayı yoksa yalnızca emote ve hazır cümleler | MVP |
| Liderlik | Haftalık XP, haftalık Bayt kazancı, "en hızlı Otopark" (ilk geçiş süresi); Pazartesi 00:00 sıfırlanır; ilk 100'e Bayt | MVP |
| Lonca ("Yazılım Ekibi") | 5–20 üye, Teknopark'ta görünür ofis, haftalık Sprint ("toplam 60 görev, 4 işletme"), ödül lonca kasasına Bayt + ofis mobilyası | v1.1 |
| Kod Düellosu | Asenkron: meydan okuma gönder, 24 saat içinde aynı problem; kazanan tüm testleri geçen en kısa süre; Elo; giriş 10 B, kazanan 15 B + 50 XP; 200+ problem havuzu, sunucu zamanlaması | v1.1 |
| Akran kod incelemesi, mentorluk | İşletme sahibi "kodumu paylaş" açabilir; Usta unvanlılar çıraklara ipucu verir, "Mentör" rozeti | v1.2 |

Lonca ve düelloyu MVP dışında tutma gerekçem: ikisi de eşleştirme, anti-cheat ve ek moderasyon yüzeyi ister; ilk 1.000 kullanıcıda ise D7'yi belirleyen şey ilk işletmedir, rekabet değil.

---

## 10. Yapay zeka öğretmen: "Usta" NPC'ler

**Kadro:** Usta Ayşe (Çarşı; sabırlı, günlük hayattan örnek verir), Usta Demir (Atölye; kısa konuşur, "önce çalıştır, sonra güzelleştir"), Usta Nehir (Fabrika; titiz, isimlendirme takıntılı), Usta Barış (Veri Limanı; esprili, her şeyi tabloyla anlatır); sonraki semtler için Selin, Kerem, Leyla. MVP'de Ayşe ve Demir aktiftir, Nehir "izinde" görünür. Her Usta = ≈300 kelimelik persona + 15 örnek diyalog + rubrik şablonları, prompt caching ile önbellekte.

**Rolü (5 iş):** Sokratik soru sorar (cevabı vermez, bir sonraki soruyu sorar); açık uçlu cevapları puanlar; 3 seviyeli ipucu verir (yön → parça → örnek); geçen işletme kodunu inceler (kalite çarpanı); gereksinim netleştirmede müşterinin sözcülüğünü yapar.

**Sınırları:** işletme kodunun tam çözümünü asla yazmaz; ders dışı sohbeti 2 turdan sonra derse yönlendirir; kişisel veri sormaz, gerçek hayat tavsiyesi vermez; test sonucunu tartışmaz ("kararı sandbox verir"); oyuncu metnini her zaman **veri** olarak işler (istem enjeksiyonu savunması); yanıt ≤ 120 kelime; aynı soru dizisinde en fazla 6 tur.

**Puanlama ilkesi:**
- **Önce deterministik.** Çoktan seçmeli, çıktı tahmini, kodu düzelt ve kod görevleri AI'sız puanlanır (soruların ≈%55'i). AI yalnızca kavram açıklama, "neden" soruları ve kod incelemesinde çalışır.
- **Rubrik + yapısal çıktı.** 3 kriter (doğruluk 50, gerekçe 30, terim/dil 20); `claude-sonnet-5-5` JSON şema ile `{puan, kriter_puanlari[], geri_bildirim, ipucu, guven}` döndürür. `guven < 0,6` ise aynı anda `claude-opus-5-5` ile kör yeniden puanlama (vakaların ≈%8'i).
- **Bantlar:** 0–39 "tekrar dene" (aynı soru farklı ifadeyle, 1 ek hak); 40–69 kısmi XP; 70–100 tam XP; 90+ "Usta övgüsü" animasyonu.
- **Kalibrasyon:** 300 cevaplık altın set (2 insan puanlayıcı); hedef |AI − insan| ≤ 10 puan, vakaların %85'inde; haftalık 100 örnek denetim; sapma varsa prompt sürümü geri alınır.
- **İtiraz:** soru başına 1; `claude-opus-5-5` kör yeniden puanlar; fark ≥ 15 ise yeni puan geçerli olur ve örnek insan kuyruğuna düşer. KPI: itiraz oranı < %3.
- **Enjeksiyon savunması:** cevap sınırlandırılmış veri bloğunda, 1.500 karakter sınırı, `claude-haiku-5-5` ön eleme, şema dışı metin yok, Usta'nın hiçbir aracı yok.

**Maliyet modeli (liste fiyatlarıyla):** bir AI puanlama ≈ 2.500 token önbellekten okunan sistem (0,20 $/MTok → 0,0005 $) + 400 token giriş (2 $/MTok → 0,0008 $) + 200 token JSON çıktı (10 $/MTok → 0,002 $) = **≈0,0033 $**. Haiku ön eleme +0,0001 $, Opus yeniden puanlama payı +0,001 $. Günlük kota 30 AI etkileşimi/kullanıcı; gerçekleşen ortalama 12 → **≈0,05 $/aktif kullanıcı/gün**; 1.000 DAU'da ≈50 $/gün, ≈1.500 $/ay. Kota dolunca "Usta mola verdi", deterministik sorular ve sandbox çalışmaya devam eder. İçerik üretimi (ders taslakları, test vakaları) Opus ile Batch API üzerinden gece çalışır (%50 indirim).

---

## 11. On tasarım ilkesi

1. **Kod gerçektir.** Derlenmeyen hiçbir şey ödül vermez; her görev Visual Studio'da aynen çalışır.
2. **AI öğretir, hakem değildir.** Testin sonucunu sandbox, geri bildirimi Usta verir; ikisi asla yer değiştirmez.
3. **Her ders bir binaya çıkar.** Ders ekranının altında "bu dersle açılan görev/işletme" her zaman görünür.
4. **İlk kod 15. dakikadan önce çalışır.** Onboarding'de kod editörü ertelenmez.
5. **Bayt emekle, Çip tarzla.** Ödeme öğrenmeyi, ilerlemeyi veya puanı asla hızlandırmaz.
6. **Kilit yetkinliktir, zaman değildir.** Bekleme sayacı, enerji, günlük deneme limiti (AI kotası hariç) yoktur.
7. **Başarısızlık ucuzdur.** Kalan test Bayt götürmez; 3 başarısızlık ipucu getirir; itiraz tek tıktır.
8. **Şehir boş görünmez.** Her sokakta NPC, canlı işletme animasyonu ve son 24 saatte aktif oyuncu bilgisi vardır; 24 kişilik instance'lar kalabalık hissi için küçük tutulur.
9. **Mobilde okunur, masaüstünde yazılır.** Ders, sosyal, toplama ve kısa görevler mobilde tam; işletme kodu masaüstü öncelikli, mobilde "sonra masaüstünde devam et" kartı.
10. **Ölçülmeyen şey yoktur.** Her ders için tamamlanma, ortalama puan, bırakma noktası; her işletme için deneme sayısı ve ilk geçiş süresi haftalık içerik toplantısının gündemidir.

---

## 12. En büyük 5 risk ve karşı önlem

| # | Risk | Karşı önlem | Erken test |
|---|---|---|---|
| 1 | **Sandbox güvenliği ve gecikmesi** (kaçış, kaynak tüketimi, p95 > 10 sn) | Container + gVisor (runsc), ağ yok, 256 MB RAM, 2 vCPU, 10 sn duvar saati, salt okunur dosya sistemi; önceden ısıtılmış 20 container havuzu; `dotnet build` yerine Roslyn bellek içi derleme + kendi test koşucusu (≈1,5 sn); Redis kuyruğu + 2 worker VM. Maliyet: 1.000 DAU × 8 çalıştırma × 3 sn CPU ≈ 6,7 CPU-saat/gün → 2 × 4 vCPU VM ≈ 150 $/ay | Hafta 2: 500 eşzamanlı çalıştırma yük testi + bilinen kaçış denemeleri listesi |
| 2 | **AI maliyeti ve gecikmesi** | Deterministik oran ≥ %50, prompt caching, günlük kullanıcı kotası, Haiku ön eleme, Opus yalnızca itiraz/içerik; maliyet panosu ve alarm: $/DAU > 0,08 $ | Hafta 3: 1.000 sentetik cevapla maliyet ve p95 ölçümü |
| 3 | **İçerik darboğazı** (24 ders + 24 görev + 6 işletme × 27 test + referans çözüm) | Üretim hattı: Opus taslak → müfredat yazarı düzenler → ikinci göz; ders/görev/işletme JSON şablonları; haftada 3 ders hızı; 2 sözleşmeli C# öğretmeni gözden geçirir | Hafta 4: ilk 6 ders + Otopark'ın 20 gerçek öğrenciyle "kağıt" testi |
| 4 | **D7 tutundurma düşük** (öğrenme oyunlarının klasik ölümü) | İlk işletme 1. günde ulaşılabilir; pasif gelir toplama; 10 dk günlük görev; streak; izinli PWA bildirimi; "yarın ne açılıyor" kartı | Hafta 9–10 kapalı beta (200 kullanıcı): D7 < %15 ise yayın 2 hafta ertelenir |
| 5 | **Kopya, istem enjeksiyonu, dış AI ile çözüm** | Gizli testler; kod benzerlik taraması (token tabanlı, eşik 0,9) + yazma süresi anomalisi; yapıştırma loglanır (yasak değil, işaret); veri sınırlı promptlar; şema zorunlu çıktı. İlke: bireysel ilerlemede yumuşak (kopya oyuncunun kendine zararı), liderlik ve düelloda sıkı | Hafta 5: kırmızı takım günü (ekip içi 50 enjeksiyon denemesi) |

---

## 13. MVP kapsamı taslağı (12 hafta)

**Kesinlikle içinde:** telefon + OTP kayıt, yaş kapısı, basit veli onayı akışı; tek dil C# ("yakında" kartları ile ilgi ölçümü); avatar (6 başlangıç seti, 20 Bayt parçası); Çarşı ve Atölye semtleri; 24 ders, 24 görev, 6 işletme (Otopark tam ayrıntılı: 27 test, referans çözüm, 3 ipucu, 3 yükseltme); sandbox; AI puanlama ve 2 aktif Usta; XP/seviye/unvan (L1–15 içerik); Bayt ekonomisi ve ekonomi panosu; Yurt + Stüdyo; Pazar (30 Bayt, 10 Çip ürünü); meydan sohbeti (moderasyonlu), arkadaş, ziyaret, beğeni; haftalık liderlik; günlük görev + streak; PWA; admin paneli (içerik, moderasyon, ekonomi); KVKK metinleri ve veri silme akışı.

**Kesinlikle dışında:** diğer diller; lonca; düello; akran incelemesi ve mentorluk; oyuncu pazarı ve Bayt transferi; native mobil uygulama; ses/sesli sohbet; Fabrika ve sonrası (görünür ama kapalı); sezonlar ve etkinlikler; Çip ile hediye; işletmeye çalışan/NPC işe alma; kozmetik ticareti; okul/öğretmen paneli.

**Üç faz:**

| Hafta | Faz | Teslimat |
|---|---|---|
| 1–4 | İskelet | OTP auth, sandbox + yük testi, ders motoru, AI puanlama (rubrik + şema + caching), PixiJS şehir kabuğu + React HUD + Monaco, ilk 6 ders, Otopark uçtan uca |
| 5–8 | Çarşı & Atölye | 24 ders, 6 işletme, ekonomi, ev, Pazar, avatar, günlük görev, admin paneli, moderasyon |
| 9–12 | Beta → yayın | Kapalı beta 200 kişi (10 lise/üniversite kulübü), D1/D7 ölçümü, denge ayarı, açık yayın, ilk 1.000 kayıt |

**Ekip (5–6 kişi):** CTO/backend (.NET, sandbox), oyun istemcisi (PixiJS + React), full-stack (ders motoru, admin), müfredat yazarı (C# öğretmeni), yarı zamanlı piksel sanatçısı, kurucu (ürün + topluluk).

**İlk 1.000 kullanıcı:** 10 okul kulübü (her biri 20–40 kişi), 3 Türkçe yazılım YouTuber'ı ile "Otopark'ı yaz" videosu, Discord sunucusu, davet kodu (davet eden ve edilen 100 Bayt). **KPI'lar:** D1 ≥ %45, D7 ≥ %20, D30 ≥ %8; kayıt olanların %30'u 7 gün içinde Otopark'ı açar; AI puanlama p95 < 4 sn, sandbox p95 < 6 sn; AI maliyeti ≤ 0,08 $/DAU/gün; itiraz oranı < %3; moderasyon şikâyeti < %1 mesaj.

---

## 14. Varsayımlar ve Açık Sorular

**Varsayımlar**
- Claude API liste fiyatları (Sonnet 5.5: 2 $/10 $ per MTok, önbellek okuma 0,20 $; Haiku 5.5: 0,10 $/0,50 $; Opus 5.5: 4 $/20 $) planlama dönemi boyunca sabit kalır; kur ≈ 45 TL/$ (varsayım) ile 1.000 DAU'da aylık AI gideri ≈ 70.000 TL'yi aşmaz.
- Kayıtlı kullanıcının ≈%30'u günlük aktif olur (1.000 kayıt ≈ 300 DAU); SMS OTP birim maliyeti ≈ 0,25 TL ve kullanıcı başına ≈3 SMS.
- Roslyn bellek içi derleme + test ≈ 1,5–3 sn CPU; gVisor ek yükü %20'yi geçmez.
- Tek müfredat yazarı haftada 3 ders + 3 görev üretir; işletme şablonu 2 günde doldurulur.
- Çip paketi 100 Çip ≈ 60 TL; dönüşüm %2–3, ödeyen başına aylık ≈120 TL (gelir modeli ilk 6 ayda ikincil).
- Hedef cihaz: masaüstü Chrome/Edge son 2 sürüm + Android Chrome / iOS Safari; alt sınır 4 GB RAM telefon.
- Veri KVKK gereği Türkiye'deki bir veri merkezinde tutulur; Claude API çağrılarında kişisel veri (telefon, rumuz) gönderilmez, yalnızca cevap metni ve kod.

**Açık Sorular**
1. 13–17 yaş veli onayı için SMS linki yeterli mi, yoksa e-Devlet doğrulaması mı gerekir? (Hukuki görüş bekleniyor; MVP'de SMS linki varsayıldı.)
2. Bayt transferi ve oyuncu pazarı v2'de açılmalı mı, yoksa hiç açılmamalı mı? (Ekonomi ve dolandırıcılık riski.)
3. AI puanlama kayıtları (cevap + puan + geri bildirim) kaç ay saklanacak; kullanıcı silme talebinde kalibrasyon seti nasıl anonimleştirilecek?
4. İkinci dil Python mı JavaScript mi? Onboarding'deki "haber ver" sayaçları 1.000 kullanıcıda karar verdirecek.
5. Okul kanalı için öğretmen paneli (sınıf görünümü, ilerleme raporu) v1.1'e alınmalı mı? Bu, ilk 1.000 kullanıcı kanalını doğrudan etkiliyor.
6. Kod Düellosu'nda dış AI kullanımı nasıl sınırlanacak? (Zaman baskısı + problem havuzu yeterli mi, yoksa canlı düello şart mı?)
7. Ürün adı KodKent çalışma adı olarak kalıyor; marka tescili ve alan adı kontrolü yapılmadı.
