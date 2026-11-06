# B6 — Görevler, Sosyal Katman & Canlı Operasyon (KodKent)

| Alan | Değer |
|---|---|
| Belge id | **B6** |
| Sürüm | v1 (2026-11-02) |
| Rol | Live-ops ve sosyal sistemler tasarımcısı (MMO / sosyal oyun) |
| Sahibi olduğu kararlar | Görev kataloğu, etkinlikler ve sezon, lonca, sohbet/moderasyon basamakları, liderlik, retention (`03-ajan-talimati.md` §2) |
| Bağlayıcı kaynaklar | `KANON.md` v1 (§3.3, §4, §6, §8, §9), `A-vizyon-FINAL.md` (§3, §4, §9, §12), `00-fikir.md`; uyum için okunanlar: B1 §9 ve §11, B2 §4–§6, §10, §12 |
| Kapsam | Görev tipleri ve 61 görevlik katalog, Çarşı/Otopark hattı ve ilk hafta, Günlük Tekrar ve seri, haftalık ritim / sezon / Türkiye takvimi ve üç ayrıntılı etkinlik, Loncalar (v1.1), arkadaşlık / Oda ziyareti / Alkış / Vitrin, sohbet ve moderasyon (ceza basamakları, 15–17 güvenli mod, KVKK log süreleri), Liderlik Panosu ve hile tespiti, Kod Düellosu (v1.1), Arena / akran incelemesi / Kalfa Yardımı (v1.2), bildirim ve retention, canlı operasyon süreçleri, topluluk kuralları, ekran metinleri |
| Kural | KANON'daki her sayı ve ad aynen kullanılır. Değiştirilmesi istenen sabitler gövdede "**(B6 önerisi)**" etiketiyle ayrı tutulur ve **Ek A**'da toplanır; onaylanana kadar KANON geçerlidir. Sahibi başka belge olan konular id ile atıfla bırakılır (ders listesi B4, işletme / İş Emri içerikleri B5, XP ve ödül sayıları B2). |

**Terim notu.**

- **Görev** ile **ders** ayrıdır: ders Akademi'de anlatılır (B4), görev dersin Uygula adımıdır. **Tier** (T1–T4) semt zorluk katmanıdır, **L1–L5** işletme seviyesidir (KANON §10).
- **Oyun günü:** 04:00 TR → ertesi 04:00 TR. Günlük sınırların hepsi bu sınırda sıfırlanır (B2 §10.3 ile aynı; §1.2).
- **Lig haftası:** Pazar 21:00 → Pazar 21:00 (KANON §4). **Yaş duvarı:** 15–17 ("genç") ile 18+ ("yetişkin") arasındaki iletişim kuralları (§1.3).
- **LP** haftalık lig puanı, **LoP** lonca puanı, **SP** sezon puanıdır. LP yalnızca XP'dir; SP ve LoP ise Bayt ya da XP vermeyen sayaçlardır.
- **"Pazar"** hem mağaza (KANON §2.2) hem haftanın günüdür. Bu belgede gün anlamında "Pazar günü" ya da saatle birlikte ("Pazar 21:00"), mağaza anlamında "Pazar (mağaza)" ya da "Pazar rotasyonu" yazılır.
- Evre etiketleri VİZYON §13'e uyar: **MVP**, **v1.1**, **v1.2**, **v2**.
- Ders numaraları: 1.1–1.4 ve adları VİZYON §7'den; 1.5 ve sonrası B2 §13 varsayım 1'deki sıradan alınmıştır ("1.5 (Büfe: decimal)" gibi yazılır, **konu** doğrudur, **ad ve tam numara B4'ündür**).
- Yazı kuralı: oyuncuya dönük metinlerde emoji yoktur, "sen" dili kullanılır, hata dili "henüz değil" tonundadır (KANON §9).

---

## 0. Yönetici özeti

1. **Görev sistemi KANON §8'in sekiz tipidir.** XP KANON §3.3'tendir; Bayt tek formüldür: `Bayt = 40 × K(tier) × Z(konum)` (K = 1/2/4/8, Z = 1,00–2,00) ve KANON'un 40 / 50 / 60 / 80 B değerlerini birebir tutar. §2.4 tek tabloda 61 görev verir (Çarşı ve Liman B4 Görev Atlası'ndan aynen, Atölyeler'in 14 görevi bu belgeden).
2. **Çarşı hattı** 12 ders görevi + Çarşı Sınavı'dır: 710 B görev + 300 B teşvik = 1.010 B. İlk hafta gün gün ve üç profille §2.6'dadır; B2 §11 kilometre taşlarını izler (normal oyuncu: tapu 2. gün, Açılış 3. gün, Kalfa 7. gün).
3. **Günlük Tekrar** 5 soru / 3 dk hedef / 20 B + 15 XP'dir; seri 04:00 TR'ye bağlıdır. KANON'daki dondurmalara **(B6 önerisi)** Onarım Turu, Bayram koruması ve Seri Molası eklenir; hiçbiri Çip'e bağlanmaz (§3).
4. **Haftanın şekli** sabittir: Pazartesi Pazar (mağaza) rotasyonu, Salı içerik, Çarşamba Vitrin saati, Perşembe Düello, Cuma Kulüp Buluşması, Cumartesi Müfettiş Günü (+ Arena), Pazar günü Açık Ev ve 21:00 lig kapanışı; her saat başı Meydan Sorusu (§4.2).
5. **Sezon (v1.1)** iki takvim ayıdır (8–9 hafta), her ay bir **Perde**; Sezon Yolu 30 basamak × 150 SP, ücretsiz tek şerit, Çip → XP/SP köprüsü yok (§4.4–§4.5). Türkiye takvimi 2027 tarihleriyle verilmiş, üç etkinlik ayrıntılıdır (§4.6–§4.7).
6. **Loncalar** (v1.1): Sev. 12 ve 500 B ile kurulur, üyelik Sev. 6'dan **(B6 önerisi)**; 5–30 üye; haftalık Lonca Görevi = Ekip Hedefi + Çapraz İnceleme; Lonca Projesi v2 (§5).
7. **Sohbet ve moderasyon** dört katmandır (istemci → sözlük → Haiku → insan); yedi basamaklı ceza merdiveni yalnızca sosyal yüzeyleri kapatır. 15–17 için yaş duvarı, 72 hazır cümle ve KVKK log süreleri tanımlıdır (§7).
8. **Liderlik:** lig puanı = haftalık XP; kovalar *kademe × unvan grubu* ekseninde kurulur (B2 Açık Soru 12'nin cevabı); hile tespiti ceza değil *doğrulama* üretir (§8).
9. **Kod Düellosu** (v1.1) asenkrondur ve Hayalet Rakip içerir; Arena, akran incelemesi ve Kalfa Yardımı (v1.2) yaş duvarına bağlıdır (§9).
10. **Bildirim:** 18+ günde 2, 15–17 günde 1 push; kayıp oyuncuya 30 günde en çok 3 mesaj (§10–§11). **Canlı operasyon:** Perşembe Treni, Pazar lig penceresinde deploy yasağı, SLA'lı destek, üç seviyeli olay iletişimi (§12).

---

## 1. Tasarım ilkeleri ve ortak kurallar

### 1.1 Yedi ilke

1. **Çarpan değil çeşitleme.** Hiçbir etkinlik Bayt ya da XP çarpanı uygulamaz (B2 §5.3). Etkinlik yeni bir eylem biçimi, yeni bir sahne ya da bir kozmetik hedefi getirir; "2× hafta sonu" yoktur.
2. **Öğrenme etkinliğe kilitlenmez.** Ders, ipucu, test ve Savunma hiçbir takvim noktasına bağlı değildir. Kaçırılan etkinlik yalnızca kozmetik kaybettirir ve her takvim etkinliği ertesi yıl aynı noktada geri döner (numaralı sezon statü nesneleri hariç, B2 §10.4).
3. **Pasif önce, aktif sonra** (VİZYON §9). İlk haftalarda ziyaret, Alkış, defter, hayalet rakip ve figüran NPC sosyal hissi taşır; eşzamanlı oyuncu gerektiren hiçbir mekanik MVP'de zorunlu değildir.
4. **Cezasız alışkanlık.** Seri dondurma, Onarım Turu, Bayram koruması ve molalar vardır; kayıp dili yoktur: "serin bozuldu" değil, "serin durdu, geri alabilirsin".
5. **Çocuk güvenliği tasarımın parçasıdır**, sonradan eklenen özellik değil: 15–17 için varsayılan korumalı katman, yaş duvarı, hazır cümleler, veli kanalı (§1.3, §7.5).
6. **Dikkat sınırlı bir kaynaktır:** bildirim bütçesi ve sessiz saatler sunucuda uygulanır (§10).
7. **Her sistemin bir ölçüsü ve kill-switch'i vardır;** etkinlikler altı şablondan biriyle kurulur ve ≤5 kişi-günü hedefler (§4.1, §12.6).

### 1.2 Zaman kuralları

Oyun saati gerçek Türkiye saatidir (UTC+3, yaz/kış saati yok; B1 §9.1). Sunucu saati tek gerçektir; cihaz saati yalnızca gösterim içindir.

| Kavram | Tanım | Bu sınırda sıfırlananlar |
|---|---|---|
| **Oyun günü** | 04:00 TR → ertesi 04:00 TR | Günlük Tekrar 1, Hata Bildirimi 3, Vitrin kod okuma 3, Alkış 40 B tavanı, Düello ödülü 5, lonca incelemesi 3, akran incelemesi 5 (B2 §4.4, §10.3) |
| **Seri haftası** | Pazartesi 04:00 | Ücretsiz dondurma hakkı (stok en çok 1) |
| **Lig haftası** | Pazar 21:00 → Pazar 21:00 | Lig puanı ve kova; Lonca Görevi; Hafta Kartı (v1.1) |
| **Pazar (mağaza) rotasyonu** | Pazartesi 09:00 | Nadir raf, İlan Panosu (B1 §9.3) |
| **Podyum** | Pazartesi 00:00 | Haftanın lig birincilerinin heykelleri (B1 §3.0) |
| **Meydan Sorusu** | Her gün 08:00–23:00, saat başı (16 soru) | — |
| **Sezon** | İki takvim ayı; ayların son Pazar 21:00'i | Sezon lig puanı, sezon görev zinciri, Düello Elo'su %50 sıkışır (B2 §10.3) |

```csharp
public static class OyunTakvimi
{
    static readonly TimeSpan Tr = TimeSpan.FromHours(3);        // UTC+3
    static readonly TimeSpan GunSiniri = TimeSpan.FromHours(4); // oyun günü 04:00'te döner

    // Verilen anın ait olduğu oyun günü
    public static DateOnly OyunGunu(DateTimeOffset an)
        => DateOnly.FromDateTime(an.UtcDateTime + Tr - GunSiniri);

    // Lig haftası: Pazar 21:00 sınırı; dönüş = haftanın Pazartesi tarihi (kimlik)
    public static DateOnly LigHaftasi(DateTimeOffset an)
    {
        var kay = an.UtcDateTime + Tr + TimeSpan.FromHours(3);   // Pazar 21:00 → Pazartesi 00:00
        int geri = ((int)kay.DayOfWeek + 6) % 7;                  // Pazartesi = 0
        return DateOnly.FromDateTime(kay.Date.AddDays(-geri));
    }
}
```

Kod .NET SDK 10.0.300 ile derlenip denendi; sınır örnekleri:

```text
2026-11-03 03:59 TR            → oyun günü 2026-11-02
2026-11-03 04:00 TR            → oyun günü 2026-11-03
2026-11-03 01:59 +01:00 (Berlin cihazı) → oyun günü 2026-11-02   (aynı an: 03:59 TR)
2026-11-01 Paz 20:59 TR        → lig haftası 2026-10-26
2026-11-01 Paz 21:00 TR        → lig haftası 2026-11-02
```

Yurt dışındaki oyuncuya (diaspora) sınır, kendi saatiyle yazılır; örneğin Almanya'da kışın: "Lig Pazar 19:00'da kapanır (senin saatinle)". Sınır kaydırma (kişisel saat dilimi) yoktur; Açık Soru 9.

### 1.3 Yaş duvarı: genç (15–17) ve yetişkin (18+)

15 altı kayıt olamaz; 15–17 hesaplar veli onayıyla açılır (KANON §1 → §12.2: `min_kayit_yasi=15`). Aşağıdaki kurallar iki grubun aynı şehirde güvenle yaşaması içindir; öğrenme ve işletme tarafı iki grup için aynıdır.

| Konu | 15–17 (genç) | 18+ (yetişkin) | Etkileşim kuralı |
|---|---|---|---|
| Serbest metin | Onay bekliyor: kapalı (hazır cümle + emote açık). Onaylı güvenli mod: ≤120 karakter, **görüntü öncesi** süzgeç | ≤200 karakter, görüntü öncesi sözlük + Haiku (§7.2) | Meydan'da aynı shard'da bulunabilirler; balonlar herkese görünür ve süzgeçten geçer |
| DM | Yalnızca 15–17 arkadaşla (onaylı modda) | Yalnızca 18+ arkadaşla | **15–17 ↔ 18+ arasında DM yoktur**, arkadaş olsalar da |
| Arkadaşlık isteği | Gönderebilir (davet kodu kendi elinden çıkar) | 15–17'ye **gönderemez**; 15–17'den gelen isteği kabul edebilir | Karşılıklı onay şart (VİZYON §9) |
| Oda izni | Varsayılan **Arkadaşlara**; "Herkese açık" 15–17'ye kapalıdır (7578 ayrıştırılmış hizmet; hukuk teyidi sonrası veli onayıyla yalnızca 15–17'ye açılabilir) | Varsayılan Herkese açık | 18+, 15–17 odasına yalnızca arkadaşsa girer; 15–17, 18+ Zilli odaya giremez (B1 Açık Soru 6'nın cevabı) |
| Lonca | Yaş modu seçilir: **Genç / Yetişkin / Karma**; Karma'da sohbet genç kurallarındadır | aynı | Genç üyeye 18+ üyeden birebir mesaj yoktur |
| Mentorluk (v1.2) | Yalnızca 15–17 mentor ↔ 15–17 menti | Yalnızca 18+ ↔ 18+ | §9.4 |
| Liderlik | Takma ad + unvan; kova karma | aynı | Yaş görünmez |
| Push | Günde 1; hafta içi 15:30–20:30 | Günde 2; 09:00–22:30 | §10 |
| Çip | Aylık 300 Çip tavanı, velice değişir (B2 §9.3) | Tavan yok | — |

**Yaş eşiği notu.** KANON §12.2 (v2, 3 Kasım 2026) eşiği 15 yapmıştır (7578 sayılı Kanun; `min_kayit_yasi=15`; B9 §8): "genç" grup 15–17'dir, 13–14 yolu MVP dışıdır ve kurallar aynen geçerlidir. B9'un genç varsayılanları (profil yalnızca arkadaşlara, Vitrin kodu arkadaş / kulübe, işletme Turist modunda gizli, arkadaş ya da rehber önerisi yok) §6.4, §8.5 ve §9.4'ün tabanıdır; sessiz saat tabanı B9'un 21:00–08:00'idir, B6 okul saatlerini ekler (§10).

---

## 2. Görev sistemi

### 2.1 Görev katmanları

Kurucunun "günlük / haftalık / hikâye görevleri" ayrımı KANON §8'in tiplerine şöyle oturur:

| Katman | İçerik | KANON tipi | Sıfırlanma | Evre |
|---|---|---|---|---|
| **Hikâye** | Ders görevleri (Ruhsat hattı), İş Emri zinciri, Semt Sınavı | Sıralama · Tamamlama · Sıfırdan · İş Emri · Semt Sınavı | Tek seferlik | MVP |
| **Günlük** | Günlük Tekrar; Hata Bildirimi (3 dosya); Meydan Sorusu (ödülsüz) | Günlük Tekrar · Hata Bildirimi | 04:00 TR | MVP |
| **Haftalık** | Lonca Görevi; Hafta Kartı (3 madde, yalnızca SP); lig | Lonca Görevi | Pazar 21:00 | v1.1 |
| **Etkinlik** | Takvim etkinliklerinin görev zinciri (en çok 5 görev) | Mevcut tiplerin etkinlik sürümü | Etkinlik süresi | v1.1 |
| **Sezon** | Sezon Yolu basamakları | — (ayrı tip yok) | Sezon sonu | v1.1 |

HUD tek aktif görev kartı gösterir (VİZYON §4). Günlük ve haftalık katmanlar "Görevler" panelinde ayrı sekmelerdedir; kart önceliği Hikâye > Günlük > Haftalık > Etkinlik'tir ve günlük katman kartın köşesinde sayaç olarak kalır ("Tekrar 0/5", "Dosya 2/3").

### 2.2 Sekiz görev tipi

| Tip | Üretim kuralı | Ödül aralığı (T1 → T4) | İlk-tamamlama XP (T1 / T2 / T3 / T4) | İlk-tamamlama Bayt | Tekrar | Evre |
|---|---|---|---|---|---|---|
| **Sıralama** (Parsons) | Çözüm satırları + 1–3 çeldirici, 5–9 satır; puan = sıra eşleşmesi + sandbox'ta çalıştırma (AI yok) | Ruhsat zincirinde 1. ve 2. konum, Z = 1,25–1,50: T1 50–60 · T2 100–120 · T3 200–240 · T4 400–480 B | 60 / 100 / 160 / 250 | Formül §2.3 | 0 XP, 0 B | MVP |
| **Tamamlama** | 3–10 eksik ifade ya da satır; 2–4 açık test; yazar elle yazar, Opus yalnızca varyant üretir | Z = 1,00–1,50: T1 40–60 · T2 80–120 · T3 160–240 · T4 320–480 B | aynı | Formül §2.3 | 0 | MVP |
| **Sıfırdan** | Boş metot + imza; 2–4 açık + 2 gizli test; ilk 3 derste yoktur (VİZYON §11 ilke 6), ilk örnek Ders 1.4'te (B4 §1.3) | Ruhsat zincirinin 3. konumu, Z = 2,00: T1 80 · T2 160 · T3 320 · T4 640 B | aynı | Formül §2.3 | 0 | MVP |
| **Hata Bildirimi** | Referans çözüme havuzdan tek mutasyon (B5 §3.11); günde 3 dosya, 04:00'te düşer; puan = satır 30 + düzeltme 40 + neden 30 (≥70 tam, 40–69 yarım, <40 sıfır; ceza yok) | Bayt tabanı 40 / 60 / 90 / 120 (B5); T1 ortalama ≈60 (B2 §5.1); T2 ≈80 · T3 ≈110 · T4 ≈150 | 40 / 60 / 100 / 150 | 40–120 | Aynı dosya kimliği 0 | MVP |
| **İş Emri** | Challenge Spec (B5) → müşteri diyaloğu → Gereksinim Netleştirme → kod → Müfettiş → Savunma | Doğrudan Bayt yok; gelir akar. Açılış Kurdelesi 100 B (ilk işletme, bir kez; B2 §5.2) | Açılış 300 / 600 / 1.200 / 2.000 (Deneme açılışı %50); yükseltme L2–L5 150 / 250 / 400 / 600 | — | Yükseltme başına 1 | MVP |
| **Semt Sınavı** | 20 dk, 3 kod + 3 Usta sorusu, karışık (interleaving); başarısızlıkta bekleme yok, farklı set | Sabit | 200 | 500 B + 10 Çip + Semt Madalyası | İlk geçişte; sonra 0 | MVP |
| **Günlük Tekrar** | SRS kuyruğundan 5 soru (1-3-7-21 gün; algoritma B4) | Sabit | 15 | 20 B; seri ≥7 → 30 B | Günde 1 | MVP |
| **Lonca Görevi** | Haftalık: Ekip Hedefi (LoP) + Çapraz İnceleme (§5.4) | Bayt payı 100 / 150 / 200 / 300 B (B2 §5.1: 100–300) | KANON görev XP'si 60 / 100 / 160 / 250; B2 Ek A-3 onaylanırsa 300 / 500 / 800 / 1.200 | 100–300 B (haftada 1) | Her hafta yenilenir | v1.1 |

**Üretim hattı.** Görev şablonları Opus taslak → müfredat yazarı → ikinci göz → JSON şablon hattından çıkar (VİZYON §13). Ders–görev eşleşmesi B4'ün, İş Emri'nin Challenge Spec'i B5'in işidir. Sıralama, Tamamlama ve Sıfırdan AI'sız puanlanır: açık testler istemcide yeşil/kırmızı kutudur, karar sandbox'tadır (KANON §9); görev puanında Kurul yoktur. Test geçince Usta'nın kısa kod incelemesi 10–30 XP bonus verir ve gelire etkisi yoktur.

**Hata Bildirimi dosyası.** Her oyun günü 04:00'te üç dosya posta kutusuna düşer (B1 §9.3 "Müfettiş turu"); saat kısıtı yoktur. Dosya = müşteri şikâyeti cümlesi + en çok 30 satır kod + testler; oyuncu hatalı satırı işaretler, düzeltir ve nedenini bir cümleyle yazar. Şikâyet *belirtiyi* söyler, satırı söylemez ("Müşteri 1.440 dakika için 500 TL ödemiş"). Bayt tabanı B5'in sınıflarıdır (40 / 60 / 90 / 120 B); konum ve düzeltme makineden, "neden" Kurul'dan puanlanır (B3 §9.4) ve atlanamaz. B5 §3.11 kuralları: aynı mutasyon 7 gün içinde dönmez, günlük üç dosya farklı zorluktan çekilir. **Açık çelişki:** Otopark L1'in 8 mutasyonu haftada 21 dosyayı taşıyamaz; Büfe / Manav / Kargo katalogları gelene dek yasak 3 güne iner ya da farklı girdi tohumu "yeni dosya" sayılır (§17, B5). Kapı: ilk Açılış (Otopark L1).

### 2.3 Ödül formülü ve görev yaşam döngüsü

XP, KANON §3.3'tür ve tier ile büyür. Bayt tek formüldür; Z, Ruhsat zincirindeki konumu taşır (B4 §3 Görev Atlası: 1. konum Z = 1,25 → 50 B, 2. konum 1,50 → 60 B, 3. konum Sıfırdan 2,00 → 80 B). Zincir dışı görevlerde Z, öğretici ve CLI görevlerinde 1,00, diğerlerinde 1,50'dir:

```csharp
// Görev Bayt'ı = 40 B × tier çarpanı (1,2,4,8) × adım zorluğu
public static int GorevBayt(int tier, double z)
    => (int)Math.Round(40 * Math.Pow(2, tier - 1) * z, MidpointRounding.AwayFromZero);
```

| Tier \ Z | 1,00 | 1,25 | 1,50 | 2,00 | KANON / B2 doğrulaması |
|---|---|---|---|---|---|
| T1 (K=1) | 40 | 50 | 60 | 80 | Meydan Saati 40 · Dakikadan Saate 50 · Kademeli Karar 60 · Taksimetre 80 |
| T2 (K=2) | 80 | 100 | 120 | 160 | B2 §5.1: 80–160 |
| T3 (K=4) | 160 | 200 | 240 | 320 | B2 §5.1: 160–320 |
| T4 (K=8) | 320 | 400 | 480 | 640 | B2 §5.1: 320–640 |

Yaşam döngüsü: **Gizli → Kilitli → Açık → Devam → Teslim → Tamamlandı.**

- **Kilitli** durumda kartta kapı nedeni her zaman yazılır ("Ders 1.3 Mührü gerekli: 3 sorudan 2'si ≥70"). Gizli koşul yoktur. Turist modunda kilitli semtin görev listesi görünür ama kilitlidir.
- **Devam:** kod taslağı sunucuda saklanır, yarım kalan görev süresiz bekler. Görev "iptal edilmez"; bırakılır, ceza yoktur.
- **Teslim:** açık testler yeşil olunca; Sıfırdan'ın gizli testleri aynı anda döner.
- **Tamamlandı:** XP + Bayt + Ruhsat parçası tek animasyonda gelir. **Berrak Zihin** (+%15 XP) ipuçsuz ilk denemeye verilir; ipucu merdiveni (Pusula → Fener → Taslak → Örnek) ücretsiz ve sınırsızdır, XP kesmez.
- **Tekrar çözüm:** 0 XP, 0 B; kartta "Serbest çözüm" yazar.
- **Ruhsat:** aynı işletme paketinden 3 görev = 1 Ruhsat, tamamlanınca +100 B Belediye teşviki (KANON §4). Slot (`1 + ⌊seviye/6⌋`) yoksa Ruhsat saklanır ve tapu bekler; görev XP'si yine alınır.

### 2.4 Görev kataloğu (61 görev)

Okuma kılavuzu: **Kimlik** B4'ün `gorev-{ders}` biçimidir (B4 §1.1); G-numarası bu belgedeki sıra numarasıdır ve Çarşı–Liman'da ders sırasını izler. Görev adı, tipi ve Bayt'ı Çarşı ve Liman için **B4 §3 Görev Atlası'ndan aynen** alınmıştır (ders listesinin sahibi B4'tür); Atölyeler görev adlarını B4'ün isteği üzerine bu belge üretir (B4 §3 sonu), Kampüs ve sonrası için dört örnek tier ölçeğini gösterir, kalanı içerik hattında (§12.2) aynı Z deseniyle çıkar. **Sev.**, görevin bağlı olduğu işletmenin ya da semtin KANON §5 açılış seviyesidir; görev kartını açan şey Ders Mührü'dür (§2.3), seviye yalnızca tapu içindir. **Bağlı ders** adları B4'ten, *kapı* notları B4 §3'ten alınmıştır. Her Ruhsat zinciri 50 / 60 / 80 × K örüntüsünü izler. Etkinlik satırları (E) XP ve Bayt vermez, çünkü etkinlik ödülü büyütmez (B2 §5.3); ödülleri kozmetik ve SP'dir.

| # · kimlik | Görev | Tip | Koşul (testler yeşil) | Ödül | Sev. | Bağlı ders (B4) | Not |
|---|---|---|---|---|---|---|---|
| G01 `gorev-1.1` | Meydan Saati | Tamamlama | 3 satırlık programdaki 3 eksiği doldur; çıktı "Saat 14:05"; 3 açık test | 60 XP · 40 B | 1 | 1.1 Merhaba KodKent | Öğretici; ilk Bayt (≈20. dk); Ruhsat yok |
| G02 `gorev-1.2` | Dakikadan Saate | Sıralama + Tamamlama | 7 satırı sırala (1 çeldirici), `(dakika + 59) / 60` ifadesini tamamla; 4 açık test: 30→1, 61→2, 120→2, 121→3 | 60 XP · 50 B | 3 | 1.2 Sayılar ve Yuvarlama | Otopark Ruhsatı 1/3 |
| G03 `gorev-1.3` | Kademeli Karar | Tamamlama | Sinema bileti üç kademe: yaş <13 → 30 TL, 13–25 → 50 TL, 26+ → 80 TL; `if / else if / else` zincirini tamamla; 5 açık test (12/13 ve 25/26 sınırları dâhil) | 60 XP · 60 B | 3 | 1.3 Kararlar | Ruhsat 2/3 |
| G04 `gorev-1.4` | Taksimetre | Sıfırdan | `Taksimetre(int metre)`: açılış 30 TL (ilk 1.000 m dâhil), sonrası her başlayan 500 m için 12 TL; 4 açık + 2 gizli test (1.001 m → 42 TL) | 60 XP · 80 B | 3 | 1.4 Fonksiyon Sözleşmesi | Ruhsat 3/3 → +100 B Belediye teşviki |
| G05 `gorev-1.5` | Büfe Fişi | Sıralama | `decimal` ile fiyat × adet − ödenen = para üstü satırlarını sırala (`m` soneki, `Math.Round`); 4 açık test | 60 XP · 50 B | 4 | 1.5 Para Hesabı: decimal | Büfe Ruhsatı 1/3 |
| G06 `gorev-1.6` | Bozukluk Sayacı | Tamamlama | `while` ile 20 / 10 / 5 TL banknot ayrıştırma; sayaç ve toplayıcı ifadelerini tamamla | 60 XP · 60 B | 4 | 1.6 Tekrar: while Döngüsü | Büfe 2/3 |
| G07 `gorev-1.7` | Bozukluk Kasası | Sıfırdan | `for` ile para üstündeki bozuk paraları say; 4 açık + 2 gizli test | 60 XP · 80 B | 4 | 1.7 Sayaçlı Döngü: for | Büfe 3/3 → +100 B |
| G08 `gorev-1.8` | Meyve Etiketi | Sıralama | `switch` ile ürün kodu → etiket satırlarını sırala | 60 XP · 50 B | 5 | 1.8 Seçim: switch | Manav Ruhsatı 1/3 |
| G09 `gorev-1.9` | Toptan İndirim | Tamamlama | Eşik tablosu: 1–4 kg %0, 5–9 kg %5, 10+ kg %10; yüzdeyi `decimal` ile uygula | 60 XP · 60 B | 5 | 1.9 Kademeli Fiyat | Manav 2/3 (Otopark şemasının 2. yüzeyi) |
| G10 `gorev-1.10` | Sepet Fişi | Sıfırdan | Kademe metodunu her kalem için çağır, topla, biçimli yazdır; 4 açık + 2 gizli test | 60 XP · 80 B | 5 | 1.10 Sepet Toplamı | Manav 3/3 → +100 B; slot yoksa Ruhsat saklanır |
| G11 `gorev-1.11` | Fiş Hizası | Tamamlama | `PadLeft` / `PadRight` ve `ToUpper` ile hizalı fiş satırı | 60 XP · 60 B | 4 | 1.11 Metinle Çalışmak: string | Ruhsat yok; Büfe L2 kapısı |
| G12 `gorev-1.12` | Yerelde Çalıştır | Tamamlama (CLI çıktısını okuma) | `dotnet run` çıktısını ve CS hata satırını okuyup eksik ifadeyi tamamla | 60 XP · 40 B | 3 | 1.12 Şehirden Çıkış: dotnet ve Visual Studio | Ruhsat yok; Otopark kodu yerelde aynen derlenir (VİZYON "Aha c"); Çarşı Sınavı provası |
| G13 `sinav-carsi` | Çarşı Sınavı | Semt Sınavı | 20 dk, 3 kod + 3 Usta sorusu; geçme: 3/3 kod + soru ortalaması ≥70 | 200 XP · 500 B · 10 Çip · Semt Madalyası | 6 | 1.1–1.12 (hepsinde Mühür) | Seviyeden bağımsız açılır (B4 §7.1); Liman kapısı Sev. 6 ile birlikte |
| G14 `gorev-2.1` | Abone Listesi | Tamamlama | `List<string>` abone plakaları: `Add`, `Count`, `Contains`; 4 açık test | 60 XP · 50 B | 6 | 2.1 Liste Kur: List<T> | Kargo Deposu Ruhsatı 1/3; Otopark L2 kapısı |
| G15 `gorev-2.2` | Konteyner Sırası | Sıralama | `int[]` dizisi ve indeks: diziyi gezen `for` satırlarını sırala | 60 XP · 60 B | 6 | 2.2 Diziler ve İndeks | Kargo 2/3 |
| G16 `gorev-2.3` | Depo Sayımı | Sıfırdan | `foreach` ile toplam, sayım, en büyük; boş liste → 0 (gizli test) | 60 XP · 80 B | 6 | 2.3 foreach ve Envanter Sayımı | Kargo 3/3 → +100 B; Manav L2 kapısı |
| G17 `gorev-2.4` | Fiyat Panosu | Tamamlama | `Dictionary<string, decimal>`: ekle, ara | 60 XP · 50 B | 8 | 2.4 Sözlük: Dictionary | Balık Hali Ruhsatı 1/3 |
| G18 `gorev-2.5` | Hal Fiyatı | Tamamlama | `TryGetValue` ile güvenli arama; adet sayımı | 60 XP · 60 B | 8 | 2.5 Sözlükle Fiyat Listesi | Balık Hali 2/3; Büfe L3 kapısı |
| G19 `gorev-2.6` | Gelen Sipariş | Sıfırdan | `Split` + `TryParse` ile "Hamsi:120;Levrek:210" toplamı | 60 XP · 80 B | 8 | 2.6 Metni Böl: Split ve Parse | Balık Hali 3/3 → +100 B |
| G20 `gorev-2.7` | Paket Listesi | Tamamlama | `Insert`, `RemoveAt`, `IndexOf`; filtre ve sayma kalıbı | 100 XP · 100 B | 9 | 2.7 Liste Kalıpları | Oto Yıkama Ruhsatı 1/3 (T2) |
| G21 `gorev-2.8` | Yıkama Fiyatı | Tamamlama | Paket (`switch`) + ek hizmet listesi fiyatı | 100 XP · 120 B | 9 | 2.8 Paket ve Ek Hizmet | Oto Yıkama 2/3 (Otopark şemasının 3. yüzeyi) |
| G22 `gorev-2.9` | Hata Dosyası | Hata ayıklama (Hata Bildirimi biçimi) | Derleme / çalışma zamanı / mantık hatasını ayır; CS hata mesajından satırı bul | 100 XP · 160 B | 9 | 2.9 Hata Ayıklama Temelleri | Oto Yıkama 3/3 → +100 B |
| G23 `gorev-2.10` | Konteyner Bul | Tamamlama | Doğrusal aramayı elle yaz | 100 XP · 100 B | 10 | 2.10 Arama | Gümrük Ruhsatı 1/3 |
| G24 `gorev-2.11` | Sıra Numarası | Sıralama + Tamamlama | `Sort` ve `CompareTo`; seçme sıralamasını izle | 100 XP · 120 B | 10 | 2.11 Sıralama | Gümrük 2/3; Kargo Deposu L2 kapısı |
| G25 `gorev-2.12` | Plaka Kontrol | Sıfırdan | `char.IsDigit` / `IsLetter` ile plaka doğrula; boş girdiyi ele | 100 XP · 160 B | 10 | 2.12 Plaka Doğrulama | Gümrük 3/3 → +100 B; Balık Hali L2 kapısı |
| G26 `sinav-liman` | Liman Sınavı | Semt Sınavı | 20 dk, 3 kod + 3 Usta sorusu; interleaving (Çarşı'dan ≥2 madde) | 200 XP · 500 B · 10 Çip · Semt Madalyası | 12 | 2.1–2.12 (hepsinde Mühür) | Atölyeler kapısı Sev. 12 ile; MVP'de Liman'ın 6 dersi var, sınav tüm Mühürlerle (MVP sonrası) |
| G27 `gorev-3.1` | Rename Day | Tamamlama | Türkçe yardımcı adları İngilizceye çevir (`dakika` → `minutes`); `UcretHesapla` imzası sabit kalır; testler yeşil kalmalı | 100 XP · 80 B | 12 | 3.1 Adlandırma: Türkçeden İngilizceye | Zincir dışı (Z = 1,00); Atölyeler girişi |
| G28 `gorev-3.2` | İndirim Türü | Tamamlama | `enum` tanımla, `switch` ile türe göre indirim uygula | 100 XP · 100 B | 12 | 3.2 enum: Adı Olan Seçenekler | Otopark L3 kapısı 1/3; Oto Yıkama L2 ve Manav L3 kapısı |
| G29 `gorev-3.3` | Bozuk Kayıt | Tamamlama | Negatif dakikada `ArgumentOutOfRangeException` fırlat (KANON §5.1 L3) | 100 XP · 120 B | 12 | 3.3 Sözleşmeyi Korumak: throw ve exception | Otopark L3 kapısı 2/3; Gümrük L2 kapısı |
| G30 `gorev-3.4` | İndirimli Tarife | Sıfırdan | Aşırı yükleme: `UcretHesapla(int)` ve indirim türü alan sürüm | 100 XP · 160 B | 12 | 3.4 Aşırı Yükleme ve İsimli Parametreler | Otopark L3 kapısı 3/3 (son ders) |
| G31 `gorev-3.5` | Araç Kartı | Sıralama | `class`, alan, `new` ve yapıcı metot satırlarını sırala | 100 XP · 100 B | 12 | 3.5 Sınıf ve Nesne | Oto Tamirhane Ruhsatı 1/3 |
| G32 `gorev-3.6` | Kapalı Alan | Tamamlama | `private` alan + property; `set` içinde doğrulama | 100 XP · 120 B | 12 | 3.6 Kapsülleme ve Property | Oto Tamirhane 2/3; Balık Hali L3 kapısı |
| G33 `gorev-3.7` | Kamyon Sınıfı | Sıfırdan | `Truck : Vehicle`, `virtual` / `override` ile `Fee()` | 100 XP · 160 B | 12 | 3.7 Kalıtım | Oto Tamirhane 3/3 → +100 B |
| G34 `gorev-3.8` | Sipariş Listesi | Sıralama | `List<Order>` kurma ve arama satırlarını sırala | 100 XP · 100 B | 14 | 3.8 Nesne Listeleri | Mobilya Atölyesi Ruhsatı 1/3; Kargo Deposu L3 kapısı |
| G35 `gorev-3.9` | Sipariş ve Kalemler | Tamamlama | "Has-a": siparişin kalemlerini nesneler arası topla | 100 XP · 120 B | 14 | 3.9 Nesneler Birlikte Çalışır | Mobilya 2/3 |
| G36 `gorev-3.10` | Değişmez Sipariş | Sıfırdan | `record` ve `with` ile değişmez sipariş; eşitlik davranışı | 100 XP · 160 B | 14 | 3.10 struct ve record | Mobilya 3/3 → +100 B |
| G37 `gorev-3.11` | İndirim Sözleşmesi | Sıralama | `interface IDiscount` ve uygulayan sınıf satırlarını sırala | 100 XP · 100 B | 16 | 3.11 interface: Sözleşme Tipi | Trafo Merkezi Ruhsatı 1/3; Oto Tamirhane L2, Oto Yıkama L3 kapısı |
| G38 `gorev-3.12` | Karışık Liste | Tamamlama | `abstract` sınıf; karışık listede doğru `override`'ı çalıştır | 100 XP · 120 B | 16 | 3.12 Polimorfizm ve Soyut Sınıf | Trafo 2/3; Mobilya Atölyesi L2 kapısı |
| G39 `gorev-3.13` | Güvenli Ödeme | Sıfırdan | `try / catch / finally` ve özel exception sınıfı | 100 XP · 160 B | 16 | 3.13 Hata Yönetimi: try, catch, finally | Trafo 3/3 → +100 B |
| G40 `gorev-3.14` | Üçe Böl | Tamamlama | Üç iş yapan sınıfı üçe böl, bağımlılığı arayüzle kur | 100 XP · 120 B | 12 | 3.14 Sorumluluk Ayrımı | Ruhsat yok; Atölyeler Sınavı provası |
| G41 `sinav-atolyeler` | Atölyeler Sınavı | Semt Sınavı | 20 dk, 3 kod + 3 Usta sorusu (B4 §7.2) | 200 XP · 500 B · 10 Çip · Semt Madalyası | 18 | 3.1–3.14 (hepsinde Mühür) | Kampüs kapısı Sev. 18 ile |
| G42 `gorev-4.6` | Kategori Raporu | Sıfırdan | `GroupBy` ile kategori başına özet (Kütüphane L1) | 160 XP · 320 B | 18 | 4.6 LINQ 3: Grupla ve Birleştir | Kütüphane 3/3 → +100 B; T3 örneği |
| G43 `gorev-6.3` | Bakiye Kilidi | Sıfırdan | İki işlemin aynı bakiyeyi bozmasını `lock` ile önle (Banka L1) | 160 XP · 320 B | 25 | 6.3 İşlem Kuyruğu ve lock | Banka 3/3 → +100 B; Usta Elif |
| G44 `gorev-7.1` | İlk Kırmızı Test | Sıralama | xUnit `[Fact]`: önce kırmızı, sonra yeşil satırlarını sırala | 160 XP · 200 B | 28 | 7.1 Birim Testi 1: İlk Test | Sigorta Ruhsatı 1/3 |
| G45 `gorev-10.4` | Sipariş Uç Noktası | Sıfırdan | `POST` + DTO + doğrulama; geçersiz istekte 400 üret | 250 XP · 640 B | 40 | 10.4 DTO ve Doğrulama | Yemek Sipariş 3/3 → +100 B; T4 örneği; Usta Yusuf |
| H1 `hb-otopark-…` | "1.440 dakika → 500 TL" | Hata Bildirimi | `gun = dakika / 1440 + 1` → `(dakika + 1439) / 1440`; 1.440 → 250 TL | 40 XP · 40 B | 3 (ilk Açılış sonrası) | 1.4 | Başlayan gün hatası; kesin liste B5 §3.11 |
| H2 | "120 dakika → 200 TL" | Hata Bildirimi | Dilim saatle karşılaştırılmış (`saat < 2`); ham dakikayla düzelt | 40 XP · 60 B | 3 | 1.3 | Sözleşme Kartı madde 2 |
| H3 | "0 dakika → 100 TL" | Hata Bildirimi | `dakika <= 0` koruması yok | 40 XP · 40 B | 3 | 1.4 | Sınır girdisi |
| H4 | "361 dakika → 360 TL" | Hata Bildirimi | Üst sınır yanlış (`<= 480`), günlük tarife atlanıyor | 40 XP · 90 B | 3 | 1.3 | İnce sınır |
| H5 | Büfe: "Para üstü 5 kuruş eksik" | Hata Bildirimi | `double` yuvarlama hatası → `decimal` | 40 XP · 90 B | 4 (Büfe Açılış sonrası) | 1.5 | Tür seçimi |
| H6 | Kargo: "Boş manifesto sistemi çökertti" | Hata Bildirimi | Boş listede `Max()` + yanlış toplam (çift mutasyon) | 40 XP · 120 B | 6 (Kargo Açılış sonrası) | 2.3 | Çift mutasyon |
| T1 | Günlük Tekrar | Günlük Tekrar | 5 soru, hedef 3 dk | 15 XP · 20 B (seri ≥7: 30 B) | 1 (ilk Mührü izleyen oyun günü) | Tüm Mühürler | Günde 1 |
| L1 | Ekip Hedefi | Lonca Görevi | Haftalık LoP ≥ 14 × aktif üye (§5.4) | Üye tier'ına göre XP (KANON 60–250) · 100–300 B | 12 (kurma), 6 (üyelik) | — | v1.1; Lonca Bonusu'nu tetikler |
| L2 | Çapraz İnceleme | Lonca Görevi | "Kod Eşi"nin kodunda mutasyonu bul (günde ≤3) | 20 XP (iki tarafa) | 6 | — | v1.1; Hata Bildirimi motoru (B2 §4.1) |
| L3 | Haftalık Tema | Lonca Görevi | Kaptan seçer: Hata Avcıları / Mühür Haftası / Tekrar Haftası; seçilen kaynağın LoP'u ×2 sayılır | Ek ödül yok (LoP tavanı aynı) | 12 | — | v1.1 |
| E1 | Bayram Mesajı | Tamamlama | 23 Nisan: mesajı `Console.WriteLine` ile yazdır; çıktı süzgeçten geçip LED panoda akar | Bayrak Kokardı (Sıradan) · 40 SP | 1 | 1.1 | v1.1; XP/Bayt yok |
| E2 | Gençlik Koşusu | Sıfırdan | 19 Mayıs: 3 mini problem, toplam süre; her unvan grubunda ilk 3'e Kupa | Kupa (Nişan, ilk 3) · Koşu Numarası (Sıradan) · 60 SP | 6 | Mühürlü konular (B4) | v1.1; Hız Kupası şablonu |
| E3 | Bir Saat Kod | Tamamlama | Kod Haftası: Ders 1.1 + G01 + G02 (60 dk rotası), kohort kodlu | Kod Haftası Kartı (Sıradan) · 50 SP | 1 | 1.1–1.2 | v1.1; §4.7 |
| E4 | Şehir Işıkları | Topluluk hedefi | 29 Ekim: şehir toplamı öğrenme eylemi sayacı | Işık Yakıcı Kokardı (Sıradan) · 40 SP | 1 | — | v1.1; §4.7 |
| E5 | Bayramlaşma | Ziyaret Defteri | Bayram: arkadaş Odalarına Bayram Kartı bırak (12 farklı ziyaret) | Bayram Şekeri emote · Harçlık Zarfı · Bayramlık Yelek · 80 SP | 2 | — | v1.1; §4.7 |
| E6 | Yeni Yıl Kararı | Koleksiyon | 31 Aralık–2 Ocak: hedefini seç (seviye / altın durak / işletme); Profil'e damgalanır | Karar Defteri sayfası (profil çerçevesi) · 20 SP | 2 | — | v1.1 |

Çarşı'nın on iki ders görevi toplam **710 B** (G01–G12; B4 §3 ile aynı) ve üç Ruhsat teşviki **300 B** verir; Çarşı Sınavı'nın 500 B'si ayrıdır. Liman'ın T1 altı görevi 380 B, T2 altı görevi 760 B (toplam 1.140 B; B4 ile aynı). Atölyeler'in 14 görevi 1.720 B ve üç Ruhsat teşviki (Oto Tamirhane, Mobilya Atölyesi, Trafo Merkezi) 300 B verir; Otopark L3'ün üç görevi (G28–G30) Ruhsat değil yükseltme kapısıdır, teşvik yoktur.

### 2.5 Çarşı hattı ve Otopark yolu

Çarşı hattı dört kademeli bir akıştır ve her kademede oyuncu tek bir açık görev görür.

1. **Ruhsat hattı (G01–G04).** Defne'nin Saha Atölyesi'nde (B1 §3.1) başlar. Atölye listesi her zaman *bir açık, bir kilitli* görev gösterir; kilidin nedeni kartta yazar. G01 tutorial'dır ve Ruhsat sayacı taşımaz; sayaç G02 ile "Ruhsat 1/3" olarak belirir. Belediye Tapu Masası'ndaki Nuran, sayaç 3/3 olunca "Satılık" tabelasını yakar ve +100 B teşviki verir.
2. **Tapu ve İş Emri #1.** 300 B + Sev. 3 + Ruhsat 3/3 → Tapu → "KAPALI — yazılım bekliyor". Hasan Abi'nin Tezgâhı'nda İş Emri açılır: Gereksinim Netleştirme (en az 4 soru) → Sözleşme Kartı → kod (≈25 dk) → Müfettiş → Savunma → Açılış. İçerik ve test ayrıntısı B5'indir; B6 kart durumlarını ve bildirimleri sahiplenir.
3. **Büfe ve Manav hatları (G05–G10).** Aynı örüntü. Büfe tapusu 600 B / Sev. 4; Manav için slot yoksa (Sev. 6'ya dek) Ruhsat saklanır, görev XP'si yine alınır (B2 §7.4).
4. **Kapanış (G11–G13).** G11 Fiş Hizası Büfe L2'nin kapısıdır (Ruhsat vermez); G12 Yerelde Çalıştır, Otopark kodunun oyuncunun kendi bilgisayarında aynen derlendiği "Aha" anıdır (VİZYON §1) ve Çarşı Sınavı provasıdır; G13 Çarşı Sınavı'dır. Sınav seviyeden bağımsız açılır (B4 §7.1); geçen oyuncuda Liman, Sev. 6 ile birlikte açılır.

| Kart | Alt metin | Düğmeler | Teslim / geçiş mesajı |
|---|---|---|---|
| Meydan Saati | "Meydan'daki saat bozuk. 'Saat 14:05' yazdıran üç satırı tamamla." | Atölye'ye git · Pusula | "Testler yeşil. +60 XP, +40 B. İlk Bayt'ın." |
| Dakikadan Saate | "Hasan Abi'nin sayacı dakikayı sayıyor ama ücreti başlayan saate göre yazıyor. 61 dakika kaç saat? Satırları sıraya diz." | Atölye'ye git · Pusula · Fener | "Ruhsat 1/3. İki görev kaldı." |
| Kademeli Karar | "Sinema biletinde üç fiyat var: çocuk, öğrenci, tam. Hangi yaş hangi kademede?" | Atölye'ye git · Pusula · Fener | "Ruhsat 2/3. Bir görev kaldı." |
| Taksimetre | "Bu sefer sayfa boş: metodu sen yaz. İmza hazır, içini sen doldur." | Atölye'ye git · Pusula · Fener · Taslak | "Ruhsat 3/3. Belediye teşviki +100 B. Otopark için 'Satılık' tabelası yandı." |
| Satılık Otopark | "Tapu 300 B. Belediye Tapu Masası'nda Nuran seni bekliyor." | Haritada göster | "Tapu senin. Tabelada yazıyor: KAPALI — yazılım bekliyor." |
| İş Emri #1 | "Hasan Abi: 'Burada bir ücret sistemi lazım, yapan var mı?'" | Hasan Abi'yle konuş | "Açılış! +300 XP. LED panoda adın akıyor." |

### 2.6 İlk hafta, gün gün

Gün numaraları B2 §11'deki gibi kayıt gününden başlar (Gün 1 = D0, Gün 2 = D1 …). Tablo **normal oyuncuyu** (35 dk/gün) gösterir; kilometre taşları B2 §11.3 ile aynıdır. "HUD" sütunu, oyuncunun o gün hangi görevi gördüğünü (açık / kilitli + neden) söyler.

| Gün | Oturum akışı | HUD'da görev kartı | Ödül ve kilometre taşı | Sosyal açılım ve kanca |
|---|---|---|---|---|
| **1** (D0) ≈40 dk | Giriş, dil, avatar (dk 0–4) → sinema → Ders 1.1 (dk 6:30) → ilk Usta sorusu → G01 (dk 14:30–20:00) → Pazar (mağaza) teaser → Harita ve "Satılık Otopark" (dk 23) → Turist modu (dk 27) → bildirim izni (dk 29) → Ders 1.2 → G02 | İlk 30 dk: yalnızca XP çubuğu, Bayt, görev kartı. G01 açık; G02 kilitli ("Ders 1.2 Mührü gerekli"); dk 23'te "Ruhsat 0/3" belirir | 40 B (dk 20), şapka −30 B, G02 +50 B → cüzdan 60 B; Sev. 3 | Turist modu Alkışı bonus vermez; Meydan balon sohbeti 1.2 Mührü'nden sonra (hazır cümleli). Çıkış kartı: "Yarın: Ders 1.3 → Ruhsat 2/3" |
| **2** (D1) | 04:00'te ilk Günlük Tekrar belirir; 18:30 push (N02). GT → Ders 1.3 → G03 → Ders 1.4 → G04 → "Satılık" tabelası → Tapu Masası → Tapu | G03 açık; G04 kilitli; sonra "Satılık Otopark". Görevler panelinde ilk kez "Günlük" sekmesi (Tekrar 0/5) | GT +20 B, G03 +60, G04 +80, teşvik +100; Tapu −300 B; Sev. 4 | Sev. 3'ten itibaren Arkadaşlar sekmesi ve davet kodu; Lig sekmesi (Bronz kovası) |
| **3** (D2) | İş Emri #1: Gereksinim Netleştirme → Sözleşme Kartı → kod → Müfettiş → Savunma → Açılış | İş Emri #1 açık; Açılış sonrası Ders 1.5 kartı | Açılış +300 XP; Açılış Kurdelesi +100 B (B2 §5.2); kasa üretimi başlar. 72 saat KPI'ının içinde | LED panoda "Yeni işletme: @ad'ın Otoparkı"; Cadde Arsası rotasyonuna girer; işletme Alkışı açılır (Oda Alkışı Sev. 2'den beri açıktır; her ikisi +2 B) |
| **4** (D3) | İlk hasat (kasa 8 saatte ≈73 B dolar; N01) → Ders 1.5 + G05 → ilk Müfettiş dosyası | G05 açık; posta kutusu "Dosya 0/3" | 2 toplamayla ≈147 B; ilk HB +20 B (B2 §5.2) | İlk gerçek Alkış verme +10 B (B2 §5.2; tapudan sonra); davet kodu hatırlatması (uygulama içi, bir kez) |
| **5** (D4) | Ders 1.6 + G06 → HB 1–3 → GT | G06 açık; Büfe Ruhsatı 2/3 | Sev. 5 | Lig sıralaması görünür: "Terfi bölgesine {x} XP" |
| **6** (D5) | Ders 1.7 + G07 → Ruhsat Büfe 3/3 | G07 açık; ardından "Satılık Büfe" | Teşvik +100 B | Arkadaş etkinlik akışı (varsa) |
| **7** (D6) | Sev. 6: Kalfa → Büfe tapusu | Büfe Satılık kartı; Ders 1.8 kartı (Manav) | Unvan Töreni, 2. slot; Tapu −600 B; Pazar 21:00'e denk gelirse ilk lig kapanışı | Kalfa Töreni LED'de; ilk lig ödülü ≈100 B |
| **8** (D7) | Büfe İş Emri → Açılış | Büfe İş Emri açık | Açılış +300 XP; GT serisi 7 → "İlk 7 gün serisi" +100 B (B2 §5.2) | **Hafta Özeti** kartı (uygulama içi); D7 kancası; Çarşı Sınavı'na 4 ders |

İlk lig kapanışı kayıt gününe bağlıdır: kayıttan sonraki ilk Pazar 21:00'e 48 saatten az varsa o hafta *Isınma* sayılır, ödül ve terfi hesaplanmaz (§8.2).

Üç profilin ilk sekiz günü yan yana (B2 §11.2–§11.4):

| Gün | Yoğun (90 dk) | Normal (35 dk) | Hafif (10 dk) |
|---|---|---|---|
| 1 | Ders 1.1–1.4 + dört görev, Ruhsat, Tapu (≈70. dk), Otopark Açılış aynı oturumda; Sev. 4 | Ders 1.1–1.2, G01, G02; Sev. 3 | Ders 1.1 + G01, şapka |
| 2 | 3 ders, 3 HB, Büfe Ruhsatı; Sev. 5 | Ders 1.3–1.4, G03–G04, Ruhsat, Tapu; GT başlar | Ders 1.2 |
| 3 | Kalfa (Sev. 6), Büfe tapusu ve Açılış | Otopark Açılış | G02 (Ruhsat 1/3); GT başlar |
| 4 | Büfe L2; Sev. 7 | İlk hasat, Ders 1.5, HB başlar | Ders 1.3 |
| 5 | Çarşı Sınavı → Liman; Sev. 8 | Ders 1.6 | G03 (Ruhsat 2/3) |
| 6 | Otopark L2 | Büfe Ruhsatı 3/3 | Ders 1.4; Sev. 4 |
| 7 | Büfe L3; lig (≈250 B) | Kalfa; Büfe tapusu; lig | G04 → Ruhsat 3/3; Tapu (30 dk hafta sonu oturumu) |
| 8 | Liman dersleri biter; Daire | Büfe Açılış; seri 7 | Otopark Açılış |

Hafif profilde ders ile Günlük Tekrar 10 dakikaya sığmaz (B2 §11.5 bulgu 4); çözüm "Mikro Mod"dur (§3.5).

## 3. Günlük Tekrar ve seri

KANON §4: 5 soru, 3 dk, 20 B + 15 XP + seri; seri 7 → ×1,5; haftada 1 ücretsiz dondurma; Seri Dondurucu 50 B. Soru kuyruğunun veri yapısı ve 1-3-7-21 çizelgeleyicisi B4'ündür; bu bölüm oyuncunun yaşadığı deneyimi, seri kurallarını ve kenar durumları tanımlar.

### 3.1 Oturum deneyimi (ekran #16)

Giriş noktaları HUD görev kartı ("Tekrar 0/5"), Metro Haritası'ndaki Tekrar düğmesi ve Oda'daki Seri Takvimi eşyasıdır (B1 §5.3 #5). **Açılış kartı** seri alevini, dondurma ikonunu ve "Başla"yı gösterir; **beş soru** tek ekranda gelir, cevaptan hemen sonra doğru / yanlış ve tek cümlelik açıklama görünür, hız bonusu yoktur; **bitiş** 2 saniyelik ödül animasyonu (+20 B, +15 XP) ve Metro Haritası'nın küçük görünümüyle kapanır: altın olan (yeşil → altın) ve yeşile düşen duraklar işaretlenir, "Yarın 4 soru vadesi gelecek" önizlemesi eklenir. **Serbest Tekrar** ödülsüzdür ve altın hesabına girmez, çünkü altın durak yalnızca aralıklı tekrarın kanıtıdır.

Üç dakika **hedef süredir, sınır değil**: sayaç yukarı sayar, 3:00'ı geçince amber olur ve "Acele yok" der, tur kesilmez (B8 §6.16); ödül süreye bağlı değildir. Soru başına hedef ≈35 saniyedir (B4 §8.1). Kart biçimi B4'tedir: AI'sız mikro sorular (çoktan seçmeli çıktı tahmini, satır seçmeli hata avı, boşluk doldurma / eşleştirme). B3 §5.9 ve §11.4 ise turda ortalama 1,4 serbest cevap öngörür ve bunu Kurul kotasına sayar. B6 uzlaşması: **turda en çok bir serbest cevaplı kart**, kotaya sayılır; kota dolarsa tur yine tamamlanır, o kart gece puanlanır ve oyuncu B3 §13'ün `kota_dolu` metnini ("Kurul bugünlük kapandı…") görür. Beş sorunun karışımı B4'ündür; B6 yalnızca bu üst sınırı koyar.

**Tamamlama ölçütü beş sorunun *cevaplanmasıdır*, doğru olması değil.** Ödül öğrenme eylemine bağlıdır; yanlış cevaplanan durağın 1-3-7-21 takvimi ertesi günden yeniden başlar ve altın durak yeşile düşer (B4 §8.1). Üç kat ağırlık yalnızca Semt Sınavı'nda zayıf çıkan duraklara uygulanır. Bot ve refleks tıklamasına karşı, bir soru en az 3 saniye ekranda kalmadan cevap kabul edilmez.

### 3.2 Seri kuralları

| Kural | Değer | Not |
|---|---|---|
| Ödül | 20 B + 15 XP; seri ≥7 → 30 B | ×1,5 yalnızca Bayt'ı çarpar (B2 §4.1); 7. günün turu 30 B verir |
| Günlük sınır | Oyun günü başına 1 ödüllü tur | 04:00 TR |
| Seri artışı | Ödüllü tur tamamlanınca +1 | Dondurulan gün seriyi artırmaz, bozmaz |
| İlk 7 gün serisi | +100 B, bir kez | B2 §5.2 |
| Ücretsiz dondurma | Haftada 1; Pazartesi 04:00'te yenilenir; birikmez (stok ≤1) | KANON "haftada 1"; birikmeme B6 yorumu |
| Seri Dondurucu | 50 B, Bayt rafından, **asla Çip**; stok ≤2 | KANON fiyatı; stok sınırı B6 önerisi |
| Dondurma sırası | Önce ücretsiz, sonra Seri Dondurucu; 04:00'te otomatik | Oyuncu kullanmayı seçmez |
| **Onarım Turu (B6 önerisi)** | Seri kırıldıktan sonra 48 saat içinde 10 soru (≈6 dk); tamamlanırsa seri kırılmadan önceki değere döner, aradaki yeni günler eklenir; Bayt ve XP yok | Kırılma kaybı öğrenme eylemiyle geri alınır, parayla değil |
| **Bayram koruması (B6 önerisi)** | Resmî bayram günlerinde (arife dâhil) seri korunur, dondurma hakkı harcanmaz | Yılda ≈9–10 gün |
| **Seri Molası (B6 önerisi)** | Yılda 2 kez, en çok 7 gün; Ayarlar'dan açılır; bildirim susar; sınav ya da hastalık için | Mola ödül kazandırmaz |
| Serbest Tekrar | Ödül yok, altın hesabı yok | Alıştırma |

Seri yalnızca kişisel bir göstergedir: panoda görünmez, Bayt etkisi en çok +10 B/gün'dür; yumuşatmalar ekonomiyi bozmaz ve "kayıp kaygısı motivasyon aracı değildir" ilkesine uyar (VİZYON §14 karar 11).

```csharp
public sealed record SeriDurumu(int Seri, int UcretsizDondurma, int DondurucuStok, int OnarimIcinEskiSeri = 0);

public static class SeriMotoru
{
    // 5. soru bitince anında çalışır
    public static (SeriDurumu yeni, int bayt, int xp) TekrarTamamla(SeriDurumu s)
    {
        var yeni = s with { Seri = s.Seri + 1, OnarimIcinEskiSeri = 0 };
        return (yeni, yeni.Seri >= 7 ? 30 : 20, 15);   // 20 B × 1,5 = 30 B; XP sabit
    }

    // 04:00'te biten ve tekrar YAPILMAMIŞ oyun günü için
    public static (SeriDurumu yeni, string olay) YapilmayanGun(SeriDurumu s, bool bayram)
    {
        if (s.Seri == 0) return (s, "seri_yok");
        if (bayram) return (s, "bayram_korumasi");
        if (s.UcretsizDondurma > 0) return (s with { UcretsizDondurma = s.UcretsizDondurma - 1 }, "ucretsiz_dondurma");
        if (s.DondurucuStok > 0) return (s with { DondurucuStok = s.DondurucuStok - 1 }, "seri_dondurucu");
        return (s with { Seri = 0, OnarimIcinEskiSeri = s.Seri }, "seri_kirildi_onarim_acik");
    }
}
```

Denenmiş çıktı (.NET 10.0.300): seri 6 → 7 turunda `30 B + 15 XP`; ardından kaçan gün `ucretsiz_dondurma` (seri 7 kalır, hak 0); sonraki kaçan gün `seri_kirildi_onarim_acik` (seri 0, onarım için eski seri 7); bayramda `bayram_korumasi` (Seri Dondurucu stoğu 2 olarak kalır); seri 0'dan ilk tur `20 B`.

### 3.3 Kenar durumları

| Durum | Kural | Oyuncunun gördüğü |
|---|---|---|
| Gece yarısı | 00:00–03:59'da yapılan tur önceki oyun gününe yazılır | Kart başlığı "Dünün turu"; 04:00'te sayaç yenilenir |
| Saat dilimi | Tüm sınırlar TR saatidir; cihaz saat dilimi yok sayılır | Yurt dışı oyuncuya sınır "senin saatinle" yazılır |
| Cihaz saatini oynama | İstemci saati yalnızca gösterimdir; sunucu saati esas | — |
| İki cihaz | İlk bitiren sayılır; ikinci cihaz "Bugünkü tekrar tamam" der; cevaplar birleşmez | Çakışma uyarısı yok |
| Yarıda bırakma | Cevaplanan sorular kaydedilir; aynı oyun günü devam edilir; 04:00'te yarım tur kapanır, cevaplanmayan sorular kuyruğa döner | "Kaldığın soruda devam edebilirsin" |
| Kuyruk az | B4 §8.3 sırası: tur 1 vadeliler (skor sırası, aynı modülden art arda en çok 2); tur 2 kalan vadeliler; tur 3 vadesi gelmemiş en eski Mühürler (vade değişmez). Mühür günü kuyruk boştur; ilk tur ertesi gün | "Bugün vadesi gelen soru az; yakın zamanda öğrendiklerinden tamamladık" |
| AI kotası dolu | Turdaki tek serbest cevaplı kart gece puanlanır; tur tamamlanır | B3 §13 `kota_dolu` metni |
| Bağlantı yok | Günlük Tekrar bağlantı gerektirir (B8 §6.16); çevrimdışıyken oynanmaz; sunucuda kayıtlı yarım tur bağlanınca devam eder | "Çevrimdışısın. Günlük Tekrar için bağlantı gerekiyor." |
| Dondurma stoğu | Seri 0 iken dondurma harcanmaz; stok yoksa seri kırılır | Kırılma ekranı Onarım Turu'nu önerir |
| Bayram + dondurma | Bayram günü hak tüketmez; bayramın ertesi günü normal işler | "Bayramınız kutlu olsun. Bu günler serini bozmaz" |
| Onarım penceresi | Kırılmadan 48 saat; yeni seri başlamış olsa da onarım eski serinin üstüne ekler; süre dolarsa teklif kaybolur | Geri sayım yok, yalnızca "48 saatin var" |
| Hızlı bitirme | Beş soru <20 sn'de bitirilirse ödül yine verilir (20 B küçük bir risktir), Şüphe Puanı'na eklenir (§8.6) | — |
| 15–17 | Kurallar aynı; yalnızca bildirim penceresi farklı | — |

### 3.4 Bildirim anları

| Anı | Koşul | Metin | Sınır |
|---|---|---|---|
| Günlük hatırlatma (N02) | Kişisel saat = son 7 turun medyanından 30 dk önce; varsayılan 18:30 (18+), 17:30 (15–17, hafta içi) | "Bugünün 5 sorusu hazır. 3 dakika, 20 B, 15 XP." | Günde ≤1; kasa doluysa N01 ile birleşir |
| Seri riski (N03) | Seri ≥3 ve 20:00'ye (15–17: 19:30) kadar tur yok | "12 günlük serin hâlâ seninle. Bugün 5 soru yeterli." | Günde ≤1; geri sayım ve "kaybedeceksin" dili yok |
| Dondurma kullanıldı | Ertesi gün ilk girişte | "Dün yoktun; ücretsiz dondurma serini korudu." | Push yok, uygulama içi kart |
| Seri kırıldı | Seri ≥14 ise tek push | "Serin 21 günde durdu. Onarım Turu için 48 saatin var." | Günde ≤1 |
| 7. gün | Uygulama içi | "7 gün üst üste. Bundan sonra tekrar başına 30 B." | Push yok |

### 3.5 Hafif oyuncu: Mikro Mod

B2 §11.5 bulgu 4 (hafif oyuncuya ders + Günlük Tekrar 10 dakikaya sığmıyor) ve Açık Soru 11'in B6 cevabı: **Günlük Tekrar derse bağlı değildir.** Son 7 günün ortalama oturumu 12 dakikanın altındaki oyuncuya HUD "Bugün kısa mı?" kartı çıkarır: 3 dakikalık Günlük Tekrar + 1 Hata Bildirimi (toplam ≈8 dk). Mikro Mod ek ödül vermez, yalnızca yol gösterir; ders akışında kart 3'ten sonra "Mola Noktası" B4'e bağımlılıktır (§17). Hedef: hafif profilde seri medyanı ≥10 gün.

## 4. Etkinlikler, takvim ve sezon

### 4.1 Etkinlik şablonları

Küçük ekibin altı şablonla çalışması yeni etkinliği "yeni kod" değil "yeni yapılandırma" yapar. Her etkinlik; başlangıç/bitiş zaman damgası, özellik bayrağı, kozmetik kimlikleri, Türkçe metin anahtarları, tek KPI ve kill-switch taşır.

| Şablon | Mekanik | Sunucu ihtiyacı | Örnek | Yük (kişi-günü) |
|---|---|---|---|---|
| **T1 Topluluk Hedefi** | Şehir ya da kohort geneli ortak sayaç; dört eşikte sahne dekoru açılır | Redis sayaç, eşik olayları | 29 Ekim Şehir Işıkları | 4 |
| **T2 Ziyaret Defteri** | Farklı oyunculara ziyaret + hazır kart bırakma | Ziyaretçi defteri + kart sözlüğü | Bayramlaşma | 3 |
| **T3 Görev Zinciri** | 3–5 görev; mevcut tiplerin etkinlik sürümü | Görev motoru, etkinlik bayrağı | 23 Nisan Bayram Mesajı | 3 |
| **T4 Hız Kupası** | Aynı problem seti, toplam süre; unvan grubu başına ilk 3 | Challenge/Düello motoru, süre ölçümü | 19 Mayıs Gençlik Koşusu | 5 |
| **T5 Koleksiyon** | N damga ya da parça (Festival Defteri); eşiklerde kozmetik | Damga tablosu | Semt Festivali, Kod Festivali, Yeni Yıl Kararı | 3 |
| **T6 Kohort** | Kohort kodu + sınıf sayacı + Rehber rolü | Kohort kodu (B7), shard önceliği (B1 §11.2) | Kod Haftası | 5 |

```json
{
  "id": "2027-10-sehir-isiklari",
  "sablon": "T1_topluluk_hedefi",
  "baslangic": "2027-10-28T18:00:00+03:00",
  "bitis": "2027-10-30T04:00:00+03:00",
  "ozellik_bayragi": "ev_sehir_isiklari",
  "hedef": { "olcu": "ogrenme_eylemi", "kisi_basi": 3, "taban": "dau_7gun_ortalama", "oyuncu_tavani": 12 },
  "esikler": [25, 50, 75, 100],
  "kozmetik": ["isik_yakici_kokard"],
  "yas_kurali": "herkes",
  "kpi": "reaktivasyon_orani",
  "kill_switch": true
}
```

### 4.2 Haftalık ritim

Haftanın her gününün tek bir kimliği vardır ve İlan Panosu'nda (B1 §3.0) haftalık olarak yayınlanır. Akşam etkinlikleri 15–17'nin bildirim penceresine (20:30'a dek) sığacak biçimde 18:00–20:00 arasına konur; Arena (20:00) ve lig kapanışı (21:00) KANON'un sabitleridir.

| Gün | Sabah (04:00–12:00) | Öğleden sonra (12:00–18:00) | Akşam (18:00–24:00) | Kimlik |
|---|---|---|---|---|
| **Pazartesi** | 00:00 Podyum heykelleri yenilenir · 04:00 ücretsiz dondurma + yeni oyun günü · 09:00 **Pazar (mağaza) rotasyonu** (MVP) | Hafta Kartı (Pazar 21:00'de verilmiş) üzerinde ilk ilerleme (v1.1) | 19:00 ekonomi kararı yürürlüğe girer (fiyat değişikliği ≥7 gün önceden duyurulmuş; B2 §10.5) | Yeni hafta, alışveriş |
| **Salı** | 10:00 **içerik yayını**: haftada 3 ders + 3 görev (MVP sonrası, B4) | — | — | Öğren |
| **Çarşamba** | — | — | 19:00 **Vitrin Saati** (v1.1): haftanın en çok okunan 3 kodu LED panoda; "Not bırak" daveti | Göster, kod oku |
| **Perşembe** | — | — | 18:00 **Düello Perşembesi** (v1.1): haftanın problem teması duyurulur (örn. "Dizgi ve Döngü"); ödül aynı | Yarış |
| **Cuma** | — | 16:00 hafta sonu planı İlan Panosu'nda | 19:00 **Kulüp Buluşması**: kohort kodlu shard'lar Meydan'da toplanır, kohort bayrakları açılır (MVP) | Sosyal |
| **Cumartesi** | 04:00–04:00 **Müfettiş Günü**: Hata Bildirimi tavanı 3 → 5, birim ödül aynı (B2 §5.3) (MVP) | — | 19:30 kayıt, **20:00 Arena turnuvası** (v1.2) | Hata avı, yarış |
| **Pazar günü** | — | 14:00–20:00 **Açık Ev** (v1.1): "Açık Ev" işaretli Odalar İlan Panosu'nda, Bloklar sokağı süslü | 19:30 lig durumu bildirimi · **21:00 lig kapanışı**: havai fişek 20 sn, pano ilk 3'ü akıtır (B1 §9.3), Bayt 21:05'te gelir · Lonca Görevi ve Hafta Kartı kapanır | Gösteriş, kapanış |
| **Her gün** | 04:00 günlük sınırlar · 3 Hata Bildirimi dosyası | 08:00–23:00 saat başı **Meydan Sorusu** | 17:00–20:00 şehrin en kalabalık saati (B1 §9.1) | — |

Pazartesi–Cuma hafif, hafta sonu ağır tutulur: okul haftasında oyuncunun tek zorunlu ritmi Günlük Tekrar'dır, etkinlik katılımı isteğe bağlıdır. MVP'de çalışanlar: Meydan Sorusu, Pazar (mağaza) rotasyonu, Podyum, Müfettiş Günü, Kulüp Buluşması ve lig kapanışı; diğerleri v1.1–v1.2'dir.

### 4.3 Meydan Sorusu

Meydan Sorusu (KANON §2.2, B1 §9.3) şehrin saat başı "buluşma" kancasıdır ve MVP'de çalışır. Her gün 08:00–23:00 arası saat başı bir soru gelir (16 soru/gün). Çeşme 10 saniye yükselir, çan üç nota çalar, pano "MEYDAN SORUSU" yazar ve soru 60 saniye açık kalır.

- **Soru:** deterministik (Çıktı Tahmini ya da kısa Hata Avı), AI maliyeti sıfır; havuz en az 480 soru (30 gün × 16). Soru küreseldir ama üç zorluk varyantı vardır; oyuncu kendi unvan grubunun varyantını görür (A: Çırak–Kalfa, B: Zanaatkâr–Mühendis, C: Baş Mühendis ve üstü).
- **Sıralama:** doğru cevap + en kısa sunucu süresi; her grupta ilk 3 LED panoda akar ve haftalık "Hızlı Parmak" sayacına yazılır. Soru paneli yalnızca o shard'da görünür, sıralama küreseldir (B1 §11.3).
- **Ödül:** XP ve Bayt yok (B2 §4.1); görünürlük ve (v1.1) ilk 3'e 5 SP.
- **Hile:** "soru gösterildi" onay zamanından sonra 0,8 sn'den kısa cevap elenir; ardışık %100 doğruluk + sabit gecikme Şüphe Puanı'na eklenir (§8.6).

### 4.4 Aylık Perde ve Sezon (v1.1)

B2 §10.3 sezonu 8 hafta olarak varsaydı; sezon kararı B6'nın olduğundan sezon **takvim aylarına hizalanır (B6 önerisi)**: bir sezon *iki takvim ayıdır* (8 ya da 9 hafta) ve ayların son Pazar 21:00'inde, yani lig kapanışıyla birlikte biter. Her takvim ayı bir **Perde**dir; aylık ritim (Semt Festivali, Ay Zinciri) Perde'ye bağlıdır. Böylece yılda altı sezon çıkar ve her biri okul takvimi ile bayramlardan en az bir çapa taşır. Bayt ve XP kaynakları değişmez; B2 §10.3'ün sıfırlama tablosu aynen geçerlidir (Bayt, işletme, kasa, XP, Nişan, altın durak asla sıfırlanmaz).

| Yuva | Takvim ayları | 2027 sınırları (Pazar 21:00) | Hafta | Tema | Takvim çapaları |
|---|---|---|---|---|---|
| **Kış** | Ocak–Şubat | 27 Ara 2026 → 28 Şub 2027 | 9 | Kar pisti (B1 §9.2) | Yılbaşı, yarıyıl tatili (25 Oca–5 Şub), Ramazan başlangıcı (8 Şub) |
| **Bahar** | Mart–Nisan | 28 Şub → 25 Nis | 8 | Çiçek Meydanı | Ramazan Bayramı (9–11 Mart), 2. ara tatil (8–12 Mart), 23 Nisan |
| **Gençlik** | Mayıs–Haziran | 25 Nis → 27 Haz | 9 | Spor Meydanı | Kurban Bayramı (16–19 Mayıs), 19 Mayıs, YKS (19–20 Haz), okulların kapanışı (25 Haz) |
| **Yaz Kampı** | Temmuz–Ağustos | 27 Haz → 29 Ağu | 9 | Liman Şenliği | Yaz tatili |
| **Kod Festivali** | Eylül–Ekim | 29 Ağu → 31 Eki | 9 | Okula dönüş, Kampüs sonbaharı | 30 Ağustos, okul açılışı, Kod Festivali, 29 Ekim |
| **Yılsonu** | Kasım–Aralık | 31 Eki → 26 Ara | 8 | Işıklar | 10 Kasım, 24 Kasım, Kod Haftası, Yılbaşı |

Tablo altı **yuvayı** adlandırır; canlı sezon numaraları B9'dadır. B9 yol haritası (§4.1, §7.5) v1.1 yayınını Haziran 2027 sonuna (H23–H24) ve v1.2'yi Eylül 2027'ye koyar: **Sezon 1 = Yaz Kampı yuvası** (27 Haz–29 Ağu), **Sezon 2 = Kod Festivali yuvası** (29 Ağu–31 Eki); yuvalar sonraki yıllarda sırayla tekrarlanır ve sezon tabelası yuva adı + yıl taşır ("Yaz Kampı Sezonu 2027"). Her sezon B2 §10.3'ün üçlüsünü getirir: numaralı seri tabela, bir Nadir set, bir Belediye Projesi. İki Perde şöyle çalışır: ayın ilk tam haftası **Semt Festivali** (T5; Festival Defteri beş damgadır: semtin bir görevi — ilk ya da serbest çözüm —, bir Hata Bildirimi, bir Günlük Tekrar, semtte bir işletme ziyareti, bir Alkış; dolduran Nadir bir parça alır, Bayt ve XP aynı kalır, B2 §5.3); ayın dört Hafta Kartı **Ay Zinciri**'ni oluşturur; son Cumartesi **Şehir Günü** sezon tabelası törenini, topluluk sayaçlarını ve sezon Nişan'larını LED panoda gösterir. Festival semti, açık oyuncu payı en yüksek üç semt arasından sırayla seçilir (ilk yıl Çarşı ve Liman).

### 4.5 Sezon Yolu: kozmetik, ücretsiz, tek şerit

Sezon Yolu **30 basamaktır ve her basamak 150 SP'dir** (toplam 4.500 SP). Tek şerittir; ücretli şerit, Çip ile basamak atlatma ya da SP satın alma yoktur. SP, XP'ye ya da Bayt'a dönüşmez; Çip → XP/SP köprüsü yoktur ("pay-to-learn" yok, KANON §1). Butik'teki sezonluk Premium set yoldan bağımsız, statik ve ayrı satılır (B2 §9.2).

**Hafta Kartı (v1.1)** her lig haftasının başında (Pazar 21:00) oyuncuya açık içeriğine göre havuzdan çekilen üç maddedir; örnekler: "5 gün Günlük Tekrar yap", "1 Ders Mührü al", "2 Hata Bildirimi çöz", "Bir arkadaşının Odasına Alkış bırak", "Meydan Sorusu'na 3 kez katıl", "Vitrin'de 1 kod oku". Maddeler yalnızca mevcut eylemleri sayar, yeni Bayt ya da XP kaynağı yaratmaz; her biri 20 SP, üçü birden 40 SP bonus verir. 15–17 için sosyal maddeler yalnızca arkadaş ziyaretidir.

| Kaynak | SP | Sınır |
|---|---|---|
| Günlük Tekrar | 8 | Günde 1 |
| Hata Bildirimi | 3 | Günde 3 dosya |
| Ders Mührü | 12 | İçerik sınırlı |
| Görev (ilk tamamlama) | 12 | İçerik sınırlı |
| İş Emri (Açılış / yükseltme) | 30 | İşletme × seviye başına 1 |
| Semt Sınavı | 80 | Semt başına 1 |
| Hafta Kartı | 3 madde × 20 + tamamlama 40 = 100 | Haftada 1 kart |
| Lig sonucu (haftalık, asgari LP 100) | 80 / 60 / 45 / 30 / 20 / 10 / 0 (konum 1 / 2–3 / 4–7 / 8–12 / 13–20 / 21–25 / 26–30) | Haftada 1 |
| Kod Düellosu galibiyeti | 6 | Günde 5 |
| Meydan Sorusu ilk 3 | 5 | Grup başına saatte 3 |
| Etkinlik görevi | 20–80 | Etkinlik başına |

Tahmini haftalık SP: hafif ≈130, normal ≈360, yoğun ≈765; 8,5 haftalık sezonda 1.105 / 3.060 / 6.500 SP, yani basamak **7 / 20 / 30**: normal oyuncu yolun üçte ikisini bitirir, yoğun oyuncu 6. haftada tamamlar. Kazanılmış basamak ödülü sezon bittikten sonra 14 gün toplanabilir, SP kazanımı kapanır.

| Basamak | Ödül | Adet |
|---|---|---|
| 3, 6, 9, 12, 15, 18, 21, 24 | 125 B (toplam 1.000 B; B2 §10.3 "sezon görev zinciri") | 8 |
| 10, 20, 27 | Nadir sezon koleksiyonu parçası (kıyafet, oda eşyası, tabela) | 3 |
| 1, 13, 29 | Profil çerçevesi ya da tabela rengi | 3 |
| 2, 4, 5, 17 | Sıradan: şapka, oda eşyası, emote, eşya | 4 |
| 7, 8, 11, 14, 16, 19, 22, 23, 26, 28 | Şık: kıyafet, oda eşyası, emote, neon | 10 |
| 25 | Dolap slotu +2 (konfor) | 1 |
| 30 | **Sezon Tabelası** (numaralı, kalıcı statü nesnesi; Çip'le alınamaz, B2 §10.4) | 1 |

**Nişan** hâlâ yalnızca beceriyle kazanılır: "Sezon Ustası" (altın çerçeveli tabela) için yolu bitirmek *ve* sezon boyunca en az 5 lig haftasında ilk 12'de kalmak ya da bir Semt Sınavı'nı geçmek gerekir. Böylece yolu bitirmek katılım ödülüdür, Nişan ise beceri ödülü olarak ayrı kalır.

### 4.6 Türkiye takvimi

Tarihler Ekim 2026 itibarıyla yayımlanmış Diyanet, MEB ve ÖSYM takvimlerinden alınmıştır; hareketli tarihler her yıl Ocak'ta yeniden teyit edilir. Dinî bayram ile resmî bayram aynı güne düşerse **dinî bayram önceliklidir**: 2027'de Kurban Bayramı'nın son günü 19 Mayıs'a denk gelir, Gençlik Koşusu bayramdan sonraki hafta sonuna (22–23 Mayıs) kayar ve 19 Mayıs'ta yalnızca sahne bayrakları ile LED mesajı kalır.

| Etkinlik | Tarih kuralı | 2027 tarihi | Biçim | Evre |
|---|---|---|---|---|
| Yılbaşı | 31 Aralık–2 Ocak | 31 Ara 2026–2 Oca 2027 | T5 **Yeni Yıl Kararı**; 23:59 Meydan geri sayımı | v1.1 |
| Yarıyıl tatili | MEB takvimi | 25 Oca–5 Şub (bitiş MEB genelgesiyle teyit) | T5 "Kamp Defteri": tatil boyunca Hafta Kartı teması | v1.1 |
| Ramazan | Diyanet | 8 Şub–8 Mar (Kadir Gecesi 5 Mar) | **Mahya Geceleri**: akşam LED akışında oyuncu çıktıları ışıklı yazı gibi akar; **Ramazan modu** bildirim penceresi (§10) | v1.1 |
| Ramazan Bayramı | Arife + 3 gün | 8 Mar (arife) – 11 Mar | T2 **Bayramlaşma** (§4.7) | v1.1 |
| 23 Nisan | Sabit | Cuma | T3 **Bayram Mesajı**: LED panoda oyuncu mesajları, Meydan bayraklı | v1.1 |
| Kurban Bayramı | Arife + 4 gün | 15 May (arife) – 19 May | T2 Bayramlaşma II, tema "Bayram Sofrası" (lokum, çay; hayvan görseli yok) | v1.1 |
| 19 Mayıs | Sabit | Çarşamba (bayramla çakışır) | T4 **Gençlik Koşusu**, 22–23 Mayıs'a kayar | v1.1 |
| Sınav haftaları | ÖSYM / MEB | YKS 19–20 Haz; LGS Haziran (tarih açıklanmadı) | Etkinlik yok, bildirimler susar, Seri Molası hatırlatılır | v1.1 |
| 30 Ağustos | Sabit | Pazartesi | Ambient: Meydan bayrakları, LED mesajı | v1.1 |
| Kod Festivali | Sonbahar, 1 hafta (B1 §9.3) | 20–26 Eylül (varsayım) | T5 **Vitrin Turu Defteri**: 5 farklı Vitrin'de kod oku + 1 not bırak | v1.1 |
| 29 Ekim | Sabit | Cuma | T1 **Şehir Işıkları** (§4.7) | v1.1 |
| 10 Kasım | Sabit | Çarşamba | Saygı: 09:05'te Meydan'da 1 dk sessizlik, LED akışı durur, o saatin Meydan Sorusu 10:00'a kayar; etkinlik ve ödül yok | MVP (ambient) |
| Öğretmenler Günü | 24 Kasım | Çarşamba | "Usta'ya Teşekkür": hazır cümle kartı + etkinliğe özel "Tebeşir Selamı" emote'u (Sıradan; Mentor Nişan'ı olan Usta Selamı ile karışmaz, B1 §7.3) | v1.1 |
| Kod Haftası | Aralık'ın ilk/ikinci haftası (Code.org CSEdWeek ile hizalı; 2026: 7–13 Aralık) | 6–12 Ara (tahmin) | T6 **Bir Saat Kod** (§4.7) | v1.1 |

### 4.7 Üç etkinlik tasarımı

Üç örnek üç farklı hedefi (edinim, topluluk coşkusu, asenkron sosyal bağ) ve üç şablonu (T6, T1, T2) gösterir. Hiçbirinde XP ya da Bayt çarpanı yoktur.

#### Etkinlik 1 — Kod Haftası: "Bir Saat Kod" (T6 + T1)

**Amaç ve ölçü.** Yeni oyuncu edinimi ve aktivasyon; VİZYON §13'ün lise/üniversite kulübü kanalını yılda bir kez büyük ölçekte çalıştırmak. İlk yıl hedefi: 40 kohort, 800 Misafir oturumu, %30 dönüşümle ≈240 hesap, Ders 1.1 tamamlama ≥%85, hesap açıldıktan sonra ilk Bayt ≤20 dk (%70), kohort D7 ≥%25 (genel hedef %20'nin üstü).

**Zaman.** Aralık'ta Code.org haftasıyla hizalı yedi gün (2027: 6–12 Aralık), Pazartesi 04:00 → Pazar 21:00.

**Mekanik.**

1. **Misafir Modu** (B9 §7.5, v1.1): hesapsız ve telefonsuz 60 dakikalık deneyim; ilerleme tarayıcıda tutulur, sohbet ve ödül yoktur. Kod Haftası'nın giriş kapısı budur; sınıf, OTP kuyruğuna girmeden başlar.
2. **"Bir Saat Kod" rotası (E3).** Giriş → Ders 1.1 → G01 → Ders 1.2 → G02; yani onboarding'in ilk 60 dakikası, yeni içerik yok. Rota sonunda "Hesap aç, ilerlemeni taşı" önerilir (OTP + yaş kapısı; genç hesaplarda Ebeveyn Paneli, B9 §8.2); hesap açılınca Misafir ilerlemesi aktarılır (aktarım kuralı B7 ve B8'in işidir).
3. **Kohort Kodu** (hesaplı oyuncular). Öğretmen ya da kulüp başkanı web formundan 6 karakterli kod alır; kodu giren oyuncular aynı shard'a düşer, 40'ı aşınca ikinci shard açılır (B1 §11.2) ve kohortun Liderlik Panosu "Kulüp" sekmesine girer (§8.1). Genç hesapta veli onayı akışı değişmez; onay beklerken öğrenme açıktır.
4. **Sınıf Sayacı (T1).** Kohortun Ders Mührü + görev sayısı; hedef = üye sayısı × 2. Her %25'te Kohort Bayrağı Meydan'da yükselir; %100'de kohort shard'ında konfeti patlar. Sayaç kohorta özeldir; kohortlar arası sıralama yoktur (rekabet baskısı ve mahremiyet).
5. **Rehber.** Kalfa ve üstü gönüllü oyuncu kohort kodunu "Rehber" olarak girer. Eşleştirme otomatik değildir (B9 §8.2: rehber eşleştirme yok): yeni üyeler kohort listesinde Rehber'leri görür, "yardım iste" hazır cümlesini kendileri seçer. Rol sohbet ayrıcalığı vermez ve yaş duvarını delmez.
6. **Kapanış.** Pazar 19:00 Kohort Fotoğrafı: takma adlı sahne kartı, indirilebilir.

**Ödül.** Katılana Kod Haftası Kartı (Sıradan profil çerçevesi) + 50 SP; Rehber'e Rehber Yakası (Şık). Bayt/XP çarpanı yoktur: yeni oyuncunun normal ödülleri zaten ilk 70 dakikada 300 B'ye varır.

**Operasyon.** Misafir Modu telefon istemediğinden 30 öğrencinin aynı anda başlaması OTP sınırına takılmaz; hesap açma dersten sonra, kademeli olur. Okul NAT'ından toplu kayıt için kohort kodlu kayıtlarda IP başı OTP sınırı pencerede yükseltilir, telefon başı sınır değişmez (B7). SMS kapasitesi ×3 planlanır (misafir → hesap %30). Öğretmen paketi ("Sınıfta 45 dakika", tek sayfalık PDF) T−21'de çıkar; çoklu hesap alarmı kohort kümelerini muaf tutar; pencere boyunca günde 2 ek moderatör saati ayrılır.

#### Etkinlik 2 — 29 Ekim: "Şehir Işıkları" (T1)

**Amaç ve ölçü.** Ortak coşku, kayıp oyuncunun geri dönüşü ve Meydan'ın dolması (boş şehir riskine karşı). Ölçüler: 30+ gün gelmeyen oyuncunun dönüş oranı ≥%4, pencere DAU'su ≥%25 artış, Meydan ortalama doluluğu ≥25 avatar.

**Zaman.** 28 Ekim 18:00 → 30 Ekim 04:00 (34 saat); ana an 29 Ekim 20:00 "Fener Alayı" (Meydan'da 10 dakikalık sahne).

**Hedef.** `H = 3 × DAU7` (son 7 günün ortalama DAU'su). Sayılan eylemler: Ders Mührü, görev ilk tamamlama, Hata Bildirimi, Günlük Tekrar, Düello galibiyeti; oyuncu başına en çok 12 eylem sayılır, böylece tek kişi şehri taşıyamaz. Örnek: DAU7 = 1.200 → H = 3.600 eylem.

**Eşikler.** %25 Meydan'da ışık dizisi; %50 bayrak şeritleri ve ışıklı tramvay; %75 Fener Alayı yolu (Meydan'dan Arena önüne); %100 40 saniyelik havai fişek ve LED panoda "Cumhuriyetimizin 104. yılı kutlu olsun". Hedef tutmazsa dekor %75'te kalır; telafi ya da suçlama dili yoktur.

**Katılım.** En az bir eylem yapan Işık Yakıcı Kokardı (Sıradan) alır; "Işık Yakanlar" panosu en çok katkı yapan 10 kohort ya da lonca adını gösterir, bireysel sıralama yoktur. **Hassasiyet:** bayrak resmî oran ve renkte çizilir; slogan ve siyasi içerik yoktur.

#### Etkinlik 3 — Ramazan Bayramı: "Bayramlaşma" (T2)

**Amaç ve ölçü.** Asenkron sosyal bağ ve arkadaş üzerinden geri dönüş. Ölçüler: kişi başı farklı ziyaret ≥4, DAU'nun ≥%40'ı kart gönderir, arkadaşı olan oyuncu payı D7'de ≥%30.

**Zaman.** Tasarım takvimi 8 Mart 2027 12:00 (arife öğleden sonrası) → 11 Mart 23:59'dur. B9 yol haritasında bu hafta kapalı betaya (H9–H10) denk gelir ve v1.1 yayını Haziran 2027 sonundadır; bu yüzden şablonun ilk canlı çalışması Ramazan Bayramı 2028'dir, 2027 bayramları yalnızca Meydan süsü ve LED mesajıyla kutlanır.

**Mekanik.**

1. **12 Bayram Kartı**, hepsi hazır cümle ("Bayramın kutlu olsun, {ad}!", "Şeker gibi bir bayram dilerim"). Serbest metin olmadığından moderasyon yükü sıfırdır ve 15–17 dâhil herkes kullanır.
2. Oyuncu bir arkadaşının Odasını ya da işletmesini ziyaret eder ve Ziyaretçi Defteri'ne kart bırakır (günde ≤10 kart). Her *farklı* alıcı bir **Şeker** sayılır; kavanoz 12 farklı alıcıda dolar.
3. **Eşikler:** 3 Şeker → "Bayram Şekeri" emote'u; 7 → "Harçlık Zarfı" Oda eşyası; 12 → "Bayramlık Yelek". Etkinlik dışında satılmazlar, Nadir sayılırlar (B2 §10.4), Nişan değildirler.
4. **Arkadaşı olmayan** oyuncu için "Komşu Bayramlaşması": Ara Sokak'taki en çok 6 komşu ve iki NPC (Hasan Abi, Nuran) sayılır.
5. "Bayram harçlığı" **Bayt değildir** (Bayt transferi ve hediye yoktur, KANON §4); zarf kozmetiktir.

**Kurban Bayramı sürümü** aynı şablondur; tema "Bayram Sofrası", hayvan ya da kurban görseli yoktur. **15–17:** yalnızca arkadaşlar ve NPC'ler. **Bildirim:** bayram sabahı 10:00'da tek push.

### 4.8 Üretim yükü ve operasyon kuralları

| Sınıf | Yıllık adet | Sanat (gün) | Tasarım + kod | İçerik + QA | Toplam (kişi-günü) |
|---|---|---|---|---|---|
| Sezon (yol, Nadir set, tabela, Şehir Günü) | 6 | 5 | 4 | 3 | 72 |
| Semt Festivali | 12 | 0,5 | 1 | 0,5 | 24 |
| Takvim etkinliği (T1–T6) | 12 | 1,5 | 2 | 1,5 | 60 |
| **Toplam** | 30 | **54** | 60 | 42 | **156** |

Yarı zamanlı piksel sanatçısı haftada 2,5 gün ve yılda ≈46 hafta çalışırsa ≈115 gün üretir; etkinlik kozmetiği bunun ≈%47'sini yer, bu yüzden kozmetiğin yaklaşık %60'ı mevcut tabanın yeniden renklendirmesidir. Kurallar: (1) her etkinlik kill-switch ile gelir ve T−1'de test edilir; (2) etkinlik hiçbir ders, ipucu ya da testi kilitlemez; (3) kaçırılan takvim etkinliğinin kozmetiği ertesi yıl döner, numaralı sezon nesneleri dönmez; (4) bitince ürün sahibi tek sayfalık post-mortem yazar (§12.2).

## 5. Loncalar: "Yazılım Ekibi" (v1.1)

Lonca, yalnız oynayan oyuncuya ortak bir ritim verir ve Tier 2→3 uçurumunda (Sev. 18–25) terk riskine karşı sosyal bir ağ kurar (VİZYON §12). Hiçbir Lonca özelliği para ya da Bayt aktarımı içermez; "lonca kasası" yoktur (KANON §4: transfer yok).

### 5.1 Kuruluş ve üyelik

| Kural | Değer |
|---|---|
| Kurma | Sev. 12+ ve 500 B (KANON §4, B2 §6.1); hesap başına bir lonca kurulabilir |
| Üyelik | **Sev. 6+ (B6 önerisi)**; hesap başına bir lonca. Gerekçe: okul/kulüp kohortlarının en ileri üyesi Sev. 12'ye varınca arkadaşları henüz Kalfa'dır |
| Ad ve amblem | Ad 3–20 karakter, benzersiz, Haiku + sözlük süzgecinden geçer ve kuruluşta seçilir; amblem 60 sembol × 12 renk hazır setten; dosya yüklemesi yoktur |
| Açıklama | ≤140 karakter serbest metin (Yetişkin loncada); Genç ve Karma loncada hazır seçim |
| Yaş modu | **Genç / Yetişkin / Karma**, kuruluşta seçilir, değişmez (§1.3) |
| Roller | Kaptan (kurucu) · Kıdemli (en çok 3) · Üye. Kaptan 14 gün çevrimdışı kalırsa en kıdemli aktif Kıdemli'ye otomatik devir |
| Giriş | Davet kodu ya da başvuru (Kaptan / Kıdemli onaylar) |
| Ayrılma | Serbest; yeni loncaya katılmak için 24 saat bekleme; ayrılanın o haftaki katkısı eski loncada kalır |

### 5.2 Kapasite: Tohum, Aktif, Lonca Seviyesi

KANON'un "5–30 üye" aralığı şöyle işler: kurucu tek başına kurunca lonca **Tohum**dur (kapasite 10, görev yok); beş üyeye ulaşınca **Aktif** olur ve haftalık Lonca Görevi açılır; kapasite **Lonca Seviyesi** (LS) ile 10'dan 30'a büyür. LS, kümülatif Lonca Puanı (LoP) ile yükselir ve yalnızca kapasite ile kozmetik açar, güç vermez.

| Durum | Üye | Kapasite | Kümülatif LoP | Açılan |
|---|---|---|---|---|
| Tohum | 1–4 | 10 | — | Lonca Binası, sohbet; görev yok |
| **LS1 (Aktif)** | ≥5 | 10 | 0 | Haftalık Lonca Görevi |
| LS2 | | 15 | 600 | Kupa Rafı |
| LS3 | | 20 | 1.800 | Lonca Vitrini |
| LS4 | | 25 | 4.000 | Bina dekor slotları |
| LS5 | | 30 | 8.000 | Altın tabela çerçevesi |

On aktif üyeli bir lonca haftada ≈140 LoP üretir: LS2 ≈5. haftada, LS3 ≈13. haftada, LS5 yaklaşık 13 ayda gelir; LoP harcanmaz.

### 5.3 Lonca Binası

Lonca Binası lonca başına tek instance'tır, kapasite 30 (B1 §11.1). Kampüs'te "Lonca Meydanı" köşesindeki kapıdan girilir; **kapı, Kampüs kilitliyken (turist modu) de üyelere açıktır**, çünkü kuruluş eşiği (Sev. 12) Kampüs eşiğinden (Sev. 18) önce gelir. İçinde Pano (görev ilerlemesi, duyuru), Toplantı Masası (balon sohbet), Lonca Vitrini (LS3'ten; 8 satırlık kodlar), Kupa Rafı ve Rozet Duvarı bulunur.

### 5.4 Haftalık Lonca Görevi

Hafta Pazar 21:00'de döner (lig ile aynı ritüel). Görev iki parçadır: **Ekip Hedefi** ve **Çapraz İnceleme**.

| Eylem | LoP |
|---|---|
| Ders Mührü | 3 |
| Görev ilk tamamlama | 3 |
| Hata Bildirimi | 1 |
| Günlük Tekrar | 1 |
| Çapraz İnceleme | 2 |
| Kod Düellosu galibiyeti | 1 |

Üye başına haftalık LoP tavanı **20**'dir (tek kişi lonca taşıyamaz). **Ekip Hedefi** = `14 × aktifÜye` (aktif = o hafta ≥1 LoP yapan üye). Üye **katkı eşiği 8 LoP**'tur; eşiği geçen üye "tamamlayan" sayılır, geçmeyen ödül almaz. Kaptan haftanın ilk 15 saatinde (Pazartesi 12:00'a dek) **Haftalık Tema** seçebilir (Hata Avcıları, Mühür Haftası, Tekrar Haftası): seçilen kaynağın LoP'u ×2 sayılır, tavan değişmez.

| Üyenin unvan bandı | Tier | XP (KANON görev XP'si) | XP (B2 Ek A-3 onaylanırsa) | Bayt payı (B2 §5.1: 100–300) |
|---|---|---|---|---|
| Çırak, Kalfa | T1 | 60 | 300 | 100 |
| Zanaatkâr, Mühendis | T2 | 100 | 500 | 150 |
| Baş Mühendis, Mimar | T3 | 160 | 800 | 200 |
| Şehir Mimarı | T4 | 250 | 1.200 | 300 |

**Lonca Bonusu** (B2 §8.1 ve Ek A-5): `çarpan = 1,0 + 0,02 × min(tamamlayanÜye, 5)`, en çok ×1,10; hedef tutarsa, katkı eşiğini geçen her üyenin işletme üretimine sonraki lig haftasında ve referans tavanından *sonra* uygulanır (B2 §8.4); eşiği geçmeyene uygulanmaz. KANON temelinde çarpan ×1,0'dır; onay gelene kadar yalnızca LoP ve Bayt payı geçerlidir. Para el değiştirmez: herkes yalnızca kendi üretimini biraz hızlandırır.

**Çapraz İnceleme** Hata Bildirimi motorunun lonca sürümüdür (VİZYON §9, B2 §4.1). Üyeler kendi geçmiş çözümlerinden birini lonca havuzuna *isteyerek* açar; sistem çözüme bir mutasyon yerleştirir ve dosyayı başka bir üyeye **anonim** "Kod Eşi dosyası" olarak verir. Üye hatayı bulur, düzeltir, nedenini bir cümleyle yazar; testler yeşil olunca **iki tarafa da 20 XP** gelir (günde en çok 3, aynı iki üye arasında haftada ≤2 eşleşme). Havuza yalnızca tüm testleri geçmiş çözümler girer. **Karar ne AI'dır ne insan:** düzeltmeyi sandbox testleri belirler (B3 §16'nın B6'dan beklediği "AI mı insan mı" sorusunun cevabı); XP "neden" cümlesinden bağımsızdır, bu cümle yalnızca eşe gösterilir.

### 5.5 Sohbet, yönetim ve kötüye kullanım

Lonca sohbeti Lonca Binası balonları ve yazılı bir kanaldır; Genç ve Karma loncada 120 karakter ve görüntü öncesi süzgeç geçerlidir (§7.5). Kaptan ve Kıdemli lonca içinde 24 saatlik sessize alma yetkisine sahiptir; ceza kararı platform moderasyonundadır (§7.4). Lonca adı, amblemi ve açıklaması raporlanabilir. Kötüye kullanıma karşı: 24 saatlik katılma beklemesi, katkı eşiği, 20 LoP tavanı, Bayt transferinin olmaması ve kaptan devrinde 7 günlük bekleme.

### 5.6 Lonca Projesi (v2)

Şehir Uygulaması'nın (#20, Sev. 45) çok dosyalı lonca sürümüdür; Challenge Spec'i B5'indir. 4–8 kişilik **Proje Takımı** kurulur; her üye bir sınıfın sahibidir (örn. `OrderController`, `OrderService`, `OrderRepository`), `interface`'ler ekip içi sözleşmedir, gizli entegrasyon testleri tüm sınıflar birleşince çalışır. Süre 14 gün, Çapraz İnceleme zorunludur. Pay (B2 §5.1: 300–1.000 B) üye başına `300 + 700 × geçenEntegrasyonTesti / toplamEntegrasyonTesti`'dir; teslim eden herkes en az 300 B alır.

## 6. Sosyal sistemler: arkadaşlık, Oda ziyareti, Alkış, Vitrin

### 6.1 Arkadaşlık ve davet kodu

Her oyuncunun tek bir **Davet Kodu** vardır: 8 karakter, karışan harfler (0/O, 1/I/L) hariç, `7H3Q-9XM2` biçiminde yazılır ve QR olarak da gösterilir. Kod iki iş görür. **Kayıtta** girilirse "davet" sayılır: yeni oyuncu ilk Bayt'ını kazanınca (Meydan Saati, ≈20. dk) iki taraf da 100 B alır; davet edene ayda en çok 5 ödül (B2 §5.2). Davet ödülü arkadaşlık sayılmaz. **Mevcut oyuncular** için Arkadaşlar sekmesinde kodla ya da takma adla istek gönderilir; karşılıklı onay şarttır (VİZYON §9).

Kurallar: arkadaş üst sınırı 100, bekleyen istek ≤20, engel listesi ≤100; 18+ oyuncu 15–17'ye istek gönderemez (§1.3). "Arkadaşın işletme açtı / kasası doldu / serisi 30 oldu" akışı yalnızca arkadaşlara görünür ve kapatılabilir; çevrimiçi durumu paylaşım iznine bağlıdır. **Arkadaşlar sekmesi aynı zamanda Arkadaş Ligi'dir:** en çok 30 arkadaşın haftalık XP tablosu, Bayt yok, 15–17 için yalnızca 15–17 arkadaşlar (§8.1). Yalnızca takma ad ve kod kullanılır; telefon rehberi eşleştirmesi yoktur (KVKK).

### 6.2 Oda ziyareti

Oda ziyareti B1 §5.4 ile birebir uyumludur; burada eklenen kurallar sosyal sonuçlardır. Odaya üç yoldan girilir (Bloklar kapısı, arkadaş listesi "Odasına git", profil); izin modları **Herkese açık · Arkadaşlara · Zilli**'dir ve varsayılanlar yaşa göredir (§1.3). Kapasite 20'dir; dolu odada "Sıraya gir" yerine "Sahibine Alkış bırak" önerilir, sahip her zaman girer. Sahibi çevrimdışıyken de gezilebilir: bu, VİZYON §9'un pasif sosyal ilkesidir.

**Ziyaretçi Defteri** son 20 ziyareti tutar: takma ad, unvan rozeti, saat, Alkış işareti ve isteğe bağlı not (≤40 karakter; yetişkinde serbest ve süzgeçli, 15–17'de hazır cümle). Ziyaretçi 30 dakika görünen bir **ayak izi** bırakır. Ziyaret ödül vermez, sosyal ödül Alkış'tır; ziyaret, odada en az 20 saniye kalınca "sayılır". Tebeşir Tahtası, işletme adı ve defter notları raporlanabilir.

### 6.3 Alkış

| Kural | Değer |
|---|---|
| Tanım | Ziyaretçinin bir oda ya da işletmeye günde 1 kez verdiği beğeni (KANON §10); yer başına günde 1 |
| Ödül | Sahibe 2 B; sahibin günlük alma tavanı 40 B (20 Alkış). Tavan dolunca Alkış yine verilebilir, bonus 0'dır ve ziyaretçiye tavan gösterilmez |
| Koşul | Ziyaretçi odada ≥20 sn kalmış olmalı |
| İlk Alkış | Veren ilk kez *gerçek bir oyuncuya* Alkış verince 10 B (B2 §5.2). **Turist modu Alkışı sayılmaz:** onboarding'in 300 B hesabı (VİZYON §4) bozulmaz; bonus ilk tapudan sonraki ilk gerçek ziyarette gelir |
| Sıfırlama | 04:00 TR (oyun günü) |
| Alkış çemberi | Haftalarca yalnızca birbirine Alkış veren çiftler "çember" olarak izlenir; kanıtlanırsa Bayt 0 olur (inceleme) |
| Çoklu hesap | Aynı cihaz kümesinden gelen Alkış Bayt vermez (§8.6) |
| LED panoda | Günün en çok alkışlanan 10 işletmesi (B1 §3.0) |

Alkış'ın ekonomi payı %5'tir (B2 §5.1); 40 B tavanı sosyal baskıyı da sınırlar.

### 6.4 Vitrin

Vitrin L2+ işletmede çerçeveli kod sergisidir (KANON §2.2); sahibi sergilemeyi *seçer*, her mühür tıklanınca sahibinin Savunma cevabı görünür (VİZYON §5). Kopya, spoiler ve gizlilik riskine karşı dört kural: (1) okuyucu o işletme türünü *kendisi açmışsa* kodu görür; açmamışsa "Önce kendin dene" kartı çıkar ve yalnızca tabela ile Savunma cevabı görünür; (2) kod okuma XP'si günde 3 × 10'dur (B2 §4.1) ve yalnızca kilidi açık Vitrinler sayılır, kendi kodunu okumak 0'dır; (3) genç oyuncunun Vitrin'ini yalnızca arkadaşları ve kulüp üyeleri okur, herkese açmak veli onayı ister (B9 §8.2); (4) asıl kopya savunması Vitrin'de değil tohumlu testlerde, Savunma'da ve referans tavanındadır (VİZYON §11 ilke 9). İlk sergileme 50 B verir (B2 §5.2).

**Not bırak (v1.1):** ≤140 karakter, bir Vitrin'e oyuncu başı günde 1 not; şablon başlıkları "İsimlendirme", "Sadelik", "Test", "Soru"; 15–17 için hazır cümle. Sahibi notu gizleyebilir ve raporlayabilir; notlar §7.2 hattından geçer.

## 7. Sohbet ve moderasyon

Kullanıcı üretimi metin yalnızca takma ad, sohbet, Ziyaretçi Defteri, Vitrin notu, Tebeşir Tahtası, işletme adı ve lonca adıdır (VİZYON §9); hepsi aşağıdaki hattan geçer. Moderasyonun tek ilkesi şudur: **ceza sosyal yüzeyi kapatır, öğrenmeyi asla kapatmaz.**

### 7.1 Balon sohbet ve shard

Sohbet kuralları KANON'dan ve B1 §11'den alınmıştır; B6 yalnızca süzgeci ve taşkın korumasını ekler.

| Yüzey | Limit | Süzgeç |
|---|---|---|
| Meydan / Semt Ana Caddesi balon sohbeti | Shard 40 (36'da yeni shard); balon 6 sn, eşzamanlı ≤12; 1 mesaj / 3 sn; ≤200 karakter; link yok | Sözlük + Haiku, görüntü öncesi |
| Oda ve işletme içi sohbet | Oda 20, işletme 15; aynı limitler | aynı |
| Kürsü | Kapasite 12; balon kapalı, yalnızca emote (B1 §15 varsayım 12) | — |
| DM | Yalnızca arkadaşlar; yaş duvarı (§1.3) | aynı |
| Lonca sohbeti (v1.1) | Lonca Binası balonu + yazılı kanal | aynı |
| Arena seyircisi (v1.2) | Hazır cümle + emote | — |
| Defter notu / Vitrin notu / Tebeşir Tahtası | 40 / 140 / 40 karakter | aynı |

Sohbet **shard'a özeldir**; Liderlik, LED akışı ve Meydan Sorusu sıralaması küreseldir (B1 §11.2). Shard'da 60 saniyede 3 raporlama ya da 5 engellenen mesaj olursa **yavaş mod** açılır: 5 dakika boyunca 1 mesaj / 10 sn ve ekranda "Bu sokakta sohbet kısa süre yavaşlatıldı" yazar.

### 7.2 Moderasyon boru hattı: dört katman

1. **İstemci:** 200 karakter, 3 sn aralık, telefon / e-posta / URL / "@" kullanıcı adı regex'i. Sunucu hepsini tekrarlar; istemciye güvenilmez.
2. **Sözlük (≤2 ms):** Türkçe normalizasyon (ı/i, ş, ğ, ü, ö, ç katlama; "s1k" gibi sayı–harf ikamesi; yinelenen harf; boşluk ya da nokta ile bölünmüş yazım) ve izin listesi (örn. "sikke", "Amasya" gibi Scunthorpe vakaları). Kesin ihlal Haiku'ya gitmeden engellenir.
3. **Haiku sınıflandırma** (`claude-haiku-5-5`, p95 ≤400 ms, görüntü öncesi). Mesaj ve önceki 3 mesaj anonim etiketlerle **veri bloğunda** gider; kimlik, telefon, IP gitmez (VİZYON varsayım 10); "Temiz de" gibi talimatlar `enjeksiyon` sayılır. Maliyet ≈0,00003 $/mesaj; 1.000 DAU × 20 mesaj ≈16 $/ay.
4. **İnsan:** düşük güven (<0,65), şiddet 3 ve kriz kuyruğa düşer. Haiku 800 ms içinde dönmezse **15–17'de mesaj tutulur** (en çok 3 sn, sonra "Mesaj gönderilemedi, tekrar dene"), **18+'da yayınlanır** ve sonradan taranır: yetişkinde fail-open, gençte fail-closed.

```json
{
  "kategori": "temiz | argo | hakaret | taciz | cinsel | kisisel_veri | dis_platform | nefret | kriz | dolandiricilik | spam | enjeksiyon",
  "siddet": 0,
  "eylem": "goster | maskele | gizle | engelle_uyar | kuyruga_al | kriz_metni",
  "guven": 0.0
}
```

| Kategori | Şiddet | Eylem | Ceza basamağı (başlangıç) |
|---|---|---|---|
| temiz | 0 | göster | — |
| argo | 1 | maskele, kayıt | Ç0 |
| hakaret, spam, enjeksiyon | 2 | gizle + uyarı (mesaj gitmez) | Ç1 |
| dis_platform, kisisel_veri | 2 | engelle + "Burada bağlantı ve kişisel bilgi paylaşılamaz" | Ç0, tekrarında Ç1 |
| dolandiricilik ("hesabını alırım") | 2–3 | engelle + kuyruk | Ç1–Ç3 |
| taciz, nefret, cinsel | 3 | engelle + insan kuyruğu (P1) | Ç3 |
| kriz | — | gönderene özel kriz metni (§7.5) + P0 kuyruk | **ceza yok** |

15–17 mesajlarında eşikler bir kademe sıkıdır: şiddet ≥1 gizlenir. Takma ad, işletme adı ve lonca adı aynı hattan geçer; "KodKent", "Usta", "Müfettiş", "Kurul", "Admin" ve benzer taklit adlar sözlükle yasaktır.

### 7.3 Raporlama ve kuyruk

**Bildir** düğmesi mesajda, oyuncuda, Oda'da, Vitrin notunda, takma adda ve lonca sayfasında bulunur; sekiz neden vardır (küfür / hakaret, zorbalık / taciz, uygunsuz içerik, kişisel bilgi, dışarı çağırma, hile / dolandırıcılık, spam, diğer) ve kriz için ayrı bir kısayol. **3 bağımsız şikâyet içeriği gizler ve insan kuyruğuna alır** (VİZYON §9); "bağımsız", aynı cihaz kümesi, kohort ya da lonca üyelerinin tek sayılması demektir (toplu şikâyet saldırısına karşı). Bildirenin güvenilirliği izlenir: kabul edilen rapor +1, art arda 5 yanlış rapor ağırlığı yarıya indirir. Oyuncu "Bildirimin bize ulaştı" mesajı alır; sonuç ayrıntısı verilmez. **Engelle** anında ve sunucu tarafındadır; engellenen bilmez. Raporlanan mesajla birlikte önceki 10 mesaj bağlam olarak saklanır. Kuyruğa Kurul ve Usta kanalından da kayıt gelir (B3 §7.2, §13): kriz ifadesi P0, uygunsuz içerik P3, 30 günde ≥5 enjeksiyon ihlali P2 olarak düşer.

| Öncelik | Konu | İlk işlem hedefi | Kapasite notu |
|---|---|---|---|
| **P0** | Kriz ifadesi, çocuk güvenliği | 15 dk | Nöbetçi moderatör + hukuk/çocuk güvenliği sorumlusu |
| **P1** | Ağır ihlal (şiddet 3) | 2 saat | — |
| **P2** | Orta ihlal | 12 saat | — |
| **P3** | Hafif, spam | 48 saat | — |

KPI: şikâyet oranı <%1 mesaj (VİZYON §13). 1.000 DAU ≈20.000 mesaj/gün demektir (B7 §1.3); en çok 200 rapor × ≈1,5 dk ≈5 saat/gün. Bu yük ≈0,6 FTE'dir ve B9'un insan kaynağı planıyla (0,5 FTE → 1 FTE, A4 → A8) uyumludur: ilk aylarda tek yarı zamanlı moderatör ile kurucu akşam vardiyasını (hafta içi 17:00–24:00, hafta sonu 10:00–24:00) paylaşır, ikinci moderatör gelince vardiya genişler; dışındaki saatlerde P0 nöbetçi telefonuna düşer.

### 7.4 Ceza basamakları

Yedi basamak vardır (Ç0–Ç6; "Ç" ceza demektir ve B1–B10 belge kimlikleriyle karışmasın diye seçildi). Her basamak yalnızca **sosyal yüzeyleri** (sohbet, DM, defter ve Vitrin notu, lonca kurma) kapatır. Ders, görev, işletme, Günlük Tekrar, lig ve Bayt tarafı Ç5'e kadar açık kalır; Ç6 hesap kapatmadır ve yalnızca S4 ile tekrarlı ağır hile içindir. B3'ün enjeksiyon kademeleri (0 puan / deneme yanar / gözetimli) öğrenme puanlamasını ilgilendirir, Ç basamaklarını tetiklemez; yalnızca kuyruğa P2 girdisi bırakır.

| Basamak | Ad | Sonuç | Süre | İtiraz |
|---|---|---|---|---|
| **Ç0** | Nazik hatırlatma | Mesaj engellenir; ekranda ilgili kural | — | Gerek yok |
| **Ç1** | Uyarı | + 15 dakika sohbet susturma | 15 dk | Evet |
| **Ç2** | Kısa sessizlik | Sohbet, DM, defter ve Vitrin notu kapalı | 24 saat | Evet |
| **Ç3** | Haftalık sessizlik | Ç2 + ihlalli ad / açıklama sıfırlanır (takma ad, lonca adı, Tebeşir Tahtası) | 7 gün | Evet |
| **Ç4** | Aylık sessizlik | Ç3 + lonca yöneticiliği ve lonca kurma kapalı | 30 gün | Evet |
| **Ç5** | Kalıcı sosyal yasak | Tüm sosyal yazı yüzeyleri kapalı; ziyaret, Alkış, emote, öğrenme ve işletme açık | Kalıcı | Evet (6 ay sonra yeniden başvuru) |
| **Ç6** | Hesap kapatma | S4 ihlali ya da tekrarlı ağır hile; yetkili makama bildirim yasal gereğe göre | Kalıcı | Evet (insan, ikinci okuyucu) |

**Başlangıç basamağı** ihlal sınıfına göre belirlenir (S1–S4; Haiku'nun 0–3 şiddet skalasında 1 → S1, 2 → S2, 3 → S3 ön bilgisidir, S4 yalnızca insan sınıflandırmasıdır): S1 (argo, hafif spam) Ç0; S2 (hakaret, ısrarlı spam, dışarı çağırma) Ç1; S3 (taciz, nefret, cinsel içerik, kişisel veri yayma) Ç3; S4 (grooming şüphesi, tehdit, çocuk istismarı unsuru, kendine zarar teşviki) Ç6. **Tırmanma:** aynı sınıfta 30 gün içindeki tekrar +1 basamaktır. **Sönümlenme:** 90 gün temiz geçen oyuncunun basamağı 1 iner; 365 gün temiz geçince kayıt sıfırlanır (ceza kaydı yine 2 yıl saklanır, §7.6). **Karar yetkisi:** Ç0–Ç2 otomatik + sonradan örneklem; Ç3 ve üstü insan onaylıdır; Haiku asla tek başına Ç3+ vermez.

**15–17 için farklar:** (1) Ç1'den Ç3'e kadar ceza öncesi kısa bir "Davranış Notu" ekranı zorunludur (neden, ne yapmalı); (2) Ç3 ve üstünde veliye SMS gider ("Çocuğunuzun hesabında … nedeniyle sohbet 7 gün kapatıldı"); (3) kriz ifadesi tek başına ceza ya da veli bildirimi üretmez, nöbetçi insan değerlendirir (§7.5).

**İtiraz:** ceza ekranındaki "İtiraz et" düğmesiyle 7 gün içinde bir kez yapılır; karar veren moderatörden farklı bir insan okur; başarılıysa ceza ve kayıt silinir. SLA §12.3'tedir.

### 7.5 15–17 güvenli mod

KANON §1 ve §12.2 gereği 15–17 hesaplar veli onayıyla açılır; onaya kadar serbest metin sohbet, DM, ziyaret kabulü, Vitrin görünürlüğü ve Çip harcaması kapalıdır. Üç durum vardır:

| Özellik | Onay bekliyor (72 saat, link yeniden gönderilebilir) | Onaylı güvenli mod | 18+ |
|---|---|---|---|
| Öğrenme, görev, işletme, lig, Günlük Tekrar | Açık | Açık | Açık |
| Hazır cümle + emote | Açık | Açık | Açık |
| Serbest metin | **Kapalı** | ≤120 karakter, görüntü öncesi süzgeç, eşik sıkı | ≤200 karakter |
| DM | Kapalı | Yalnızca 15–17 arkadaşlar | Yalnızca 18+ arkadaşlar |
| Oda izni | Arkadaşlara | Arkadaşlara (Herkese açık: hukuk teyidine kadar kapalı; sonra veli onayı + yalnızca 15–17'ye) | Herkese açık |
| Lonca | Katılabilir (Genç/Karma); yazı kapalı | Genç/Karma kuralları | Her mod |
| Arkadaşlık | Davet koduyla açık | Açık | Açık (15–17'ye istek yok) |

**Hazır cümle kütüphanesi: 72 cümle, 6 kategori × 12.** Cümleler parametreli olabilir ({ad}, {işletme}); serbest metin içermez, bu yüzden süzgeçsiz gönderilir.

| Kategori | Örnek cümleler |
|---|---|
| Selam | "Merhaba!" · "Selam, ben {ad}." · "Günaydın!" · "İyi akşamlar!" |
| Yardım | "Bu görevde takıldım." · "Pusula'ya baktın mı?" · "Bunu birlikte düşünelim mi?" · "Yardım edebilir misin?" |
| Oyun ve kod | "Testlerim yeşil oldu!" · "Bugünkü Meydan Sorusu zordu." · "Hangi derse geldin?" · "Otoparkım açıldı!" |
| Tebrik | "Tebrikler!" · "Harika bir işletme!" · "Seviye atlamışsın, helal olsun!" · "Odan çok güzel." |
| Teşekkür ve özür | "Teşekkürler!" · "Çok sağ ol." · "Özür dilerim, yanlışlıkla oldu." · "Sorun değil." |
| Ziyaret ve veda | "Odana bakabilir miyim?" · "Alkışladım!" · "Görüşürüz!" · "İyi geceler." |

**Ebeveyn Paneli** (B9 §8.2) SMS bağlantısıyla açılan, hesap gerektirmeyen bir web sayfasıdır: süre limiti, harcama limiti ve satın alma onayı (B2 §9.3), sohbet / DM izni, haftalık öğrenme özeti, hesap silme talebi. B6'nın eklediği anahtarlar: serbest sohbeti aç/kapat, Vitrin ve Oda görünürlüğünü genişlet, haftalık özet SMS'ini aç. Haftalık özet (isteğe bağlı, Pazar 18:00): "KodKent: Ayşe bu hafta 5 ders bitirdi, 3 altın durak kazandı. Sohbet: açık. Ayarlar: {kısa_link}". Özet *öğrenme* KPI'ını (altın durak) ve gerekirse güvenlik olayını söyler; çocuğun sohbet içeriğini söylemez.

**Kriz ifadesi akışı.** Haiku `kriz` kategorisi mesajı yayından keser ve gönderene yalnızca şu metni gösterir: "Zor bir şey yaşıyor olabilirsin ve bunu tek başına taşımak zorunda değilsin. Güvendiğin bir yetişkinle konuş. Acil durumda 112'yi, destek için ALO 183'ü arayabilirsin." Aynı anda P0 kuyruğa düşer; nöbetçi insan değerlendirir. Açık ve yakın risk (plan, yöntem, zaman) varsa çocuk güvenliği sorumlusu aynı gün veliye ulaşır. Numaralar yayın öncesi doğrulanır; yasal bildirim yükümlülüğü hukuk onayına tabidir (Açık Soru 7).

### 7.6 KVKK log saklama süreleri

Süreler B6 önerisidir; uygulama B7, hukuk doğrulaması gerekir. İlke: amaçla sınırlı, kısa, silme talebinde anonimleştirme.

| Veri | Saklama | Erişim | Not |
|---|---|---|---|
| Balon sohbet mesajı (Meydan, semt, Oda, işletme içi) | 90 gün | Yalnızca rapor halinde moderatör | B7 §4.1 `social.chat_messages` bölüm süresiyle aynı; rapor ve itiraz penceresi |
| DM mesajı | 90 gün; raporlanmışsa kanıt kopyası 1 yıl (`chat_reports`) | Yalnızca rapor halinde moderatör | |
| Raporlanan mesaj + 10 mesajlık bağlam | Olay kapanışından + 1 yıl | Moderatör, hukuk | İtiraz ve ispat |
| Haiku kaydı (kategori, şiddet, güven; **metin yok**) | 90 gün | Moderasyon analitiği | Kalibrasyon |
| Hazır cümle gönderimi | 30 gün | — | |
| Moderasyon kararı ve ceza kaydı | 2 yıl | Moderatör, hukuk | Sönümleme §7.4 |
| Çocuk güvenliği olay dosyası (S4) | Yasal süre / zamanaşımı (hukuk) | Hukuk | |
| Veli onay kaydı (zaman, telefon özeti) | Hesap ömrü + 3 yıl | Hukuk | İspat |
| Erişim (trafik) logu: kullanıcı kimliği, IP, zaman | 12 ay (varsayım; 5651 sayılı Kanun'da 2026'da yapılan değişiklik sonrası süre hukukça doğrulanır) | Yalnızca yasal talep | Yer sağlayıcı yükümlülüğü |
| Hesap silme sonrası | Sohbet metni anonimleştirilir; moderasyon kanıtı ve erişim logu yukarıdaki yasal sürede kalır | — | KVKK silme / anonimleştirme |

Kişisel veri ihlali olursa 72 saat içinde Kurul'a bildirim yapılır (KVKK Kurulu 2019/10 sayılı karar); süreç §12.5'tedir. Claude API'ye yalnızca mesaj metni ve üç mesajlık anonim bağlam gider.

## 8. Liderlik Panosu (ekran #22)

### 8.1 Panolar

Ekran KANON §6'nın dört panosunu taşır; üç alt sekme (Arkadaşlar, Kulüp, Meydan Sorusu) aynı ekranın parçasıdır, yeni ekran açılmaz **(B6 önerisi)**. Kulüp sekmesi B9'un kulüp kodu kancasını (sınıf / kohort ligi) karşılar: sıralama kohort içindedir, kohortlar arası sıralama yoktur.

| Pano | Ne sıralar | Sıfırlanma | Ödül | Evre |
|---|---|---|---|---|
| **Haftalık Lig** | Haftalık XP (LP); Bronz → Gümüş → Altın → Elmas; 30 kişilik kova | Pazar 21:00 | 0–300 B (B2 §5.3) + terfi | MVP |
| **Kalıcılık Ligi** | Altın durak sayısı | Sıfırlanmaz | Bayt yok; Nişan "Kalıcı Zihin I–IV" (10 / 25 / 50 / 100 altın durak; B2 §5.3) | MVP |
| **En Hızlı Otopark** | İlk geçiş süresi | Tüm zamanlar + aylık | Bayt yok; görünürlük | MVP |
| **En Kazançlı İşletme** | Son 7 günde tahsil edilen Bayt, işletme türü × seviye grubu | Kayan 7 gün | Bayt yok; görünürlük | MVP |
| Arkadaşlar (alt sekme) | Arkadaşların haftalık XP'si (≤30) | Pazar 21:00 | Yok | MVP |
| Kulüp (alt sekme) | Aynı kohort kodunu girenlerin haftalık XP'si (≤40; B9 "kohort lig tablosu") | Pazar 21:00 | Yok | MVP |
| Meydan Sorusu (alt sekme) | Haftalık "Hızlı Parmak" sayacı | Pazar 21:00 | Yok (v1.1: 5 SP) | MVP |

### 8.2 Haftalık Lig

**Puan.** LP = o lig haftasında kazanılan XP'dir (B2 §5.3); XP yalnızca öğrenme ve kod eylemlerinden geldiği için lig oyun süresinin değil öğrenmenin yarışıdır. XP, hesabına işlendiği ana göre haftaya yazılır; kota gecikmesiyle kapanışta puanı gelmemiş cevapların XP'si yeni haftaya düşer ve oyuncu "Bekleyen XP" etiketini görür.

**Kovalar.** B2 Açık Soru 12'nin (XP tier ile büyüdüğü için üst bantlar alt bantları ezer mi?) cevabı: kova ekseni **lig kademesi × unvan grubudur**; A = Çırak–Kalfa, B = Zanaatkâr–Mühendis, C = Baş Mühendis ve üstü. B2 §2.3'ün XP/saat değerleri grup içinde en çok 1,33× fark yaratır (A: 650 / 850, B: 1.000 / 1.250, C: 1.500–2.000); dört kademe × üç grup = 12 havuz vardır.

**Yerleşme tembeldir.** Oyuncu haftanın ilk XP'sini kazandığında kendi havuzundaki açık kovaya (n<30) yerleşir; kova 30'a dolunca kapanır, yenisi açılır. Kova yalnızca o hafta oynayanlardan oluşur; hayalet oyuncu ve doldurma NPC'si yoktur. Hafta boyunca hiç XP kazanmayan oyuncu kovaya girmez ve kademesini korur (ceza yok; KANON "kayıp kaygısı yok" ilkesi). **Isınma:** kayıttan o haftanın kapanışına 48 saatten az kaldıysa oyuncu o hafta puan toplar ama ödül ve terfi hesaplanmaz; lig girişi Sev. 3'tedir.

**Sıralama ve hareket.** Sıra LP'ye göredir; eşitlikte LP'ye son XP'yi daha erken ekleyen üsttedir. **Terfi ilk 7, düşme son 5** (KANON §8). Bronz'da düşme, Elmas'ta terfi yoktur. **Asgari LP 100** (≈bir T1 dersi): bunun altındaki oyuncu terfi etmez ve Bayt almaz; seyrek kovada boş terfi ve boş ödül oluşmasın diye. **Küçük kova:** n<30 ise ödül konumu `1 + (sıra−1) × 30 / n` ile 30 kişilik tabloya ölçeklenir, terfi `n × 7/30`, düşme `n × 5/30` yuvarlanır; n<6 olan kovada hareket yoktur.

```csharp
public static class Lig
{
    public const int AsgariLp = 100;                      // ödül ve terfi alt sınırı (≈ bir T1 dersi)

    // sıra: 1 tabanlı; n: kovadaki gerçek oyuncu sayısı → 30 kişilik tabloya ölçekli konum
    public static int Konum(int sira, int n) => 1 + (sira - 1) * 30 / n;

    public static int OdulBayt(int konum) => konum switch
    {
        1 => 300, <= 3 => 200, <= 7 => 150, <= 12 => 100, <= 20 => 50, <= 25 => 20, _ => 0
    };

    public static (int terfi, int dusme) Hareket(int n) => n < 6 ? (0, 0) :
        ((int)Math.Round(n * 7 / 30.0, MidpointRounding.AwayFromZero),
         (int)Math.Round(n * 5 / 30.0, MidpointRounding.AwayFromZero));
}
```

Denenmiş çıktı: `n=30` → terfi 7, düşme 5, kova toplamı **2.300 B**; `n=20` → 5 / 3; `n=12` → 3 / 2 ve 12 oyuncunun konumları 1, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28 (toplam 1.040 B); `n=6` → 1 / 1; `n=5` → hareket yok.

| Konum | Bayt | Not |
|---|---|---|
| 1 | 300 | Terfi bölgesi; Elmas'ta ayrıca haftalık "Elmas Yıldızı" Nişan'ı (yalnızca sergilenir) |
| 2–3 | 200 | Terfi bölgesi |
| 4–7 | 150 | Terfi bölgesi |
| 8–12 | 100 | |
| 13–20 | 50 | |
| 21–25 | 20 | |
| 26–30 | 0 | Düşme bölgesi; Bayt cezası yok |

Tablo B2 §5.3'ten aynen alınmıştır (sahibi B2). **B2 için düzeltme notu:** B2 metni kova toplamını 2.200 B yazar; satırların toplamı 2.300 B'dir (300 + 2×200 + 4×150 + 5×100 + 8×50 + 5×20); 1.000 DAU ≈ 34 kova ≈ 78.200 B/hafta, dolaşımın ≈%0,4'ü, sonuç değişmez. Kapanış akışı: Pazar 21:00 puanlar donar, 21:05 sonuçlar ve Bayt gelir, 20 sn havai fişek ve LED'de ilk üç (B1 §9.3); Pazartesi 00:00 Podyum yenilenir. 15–17 için kurallar aynıdır; kapanış geri sayımı gösterilmez, bildirim dili olumludur (§10).

### 8.3 Kalıcılık Ligi

Kalıcılık Ligi ikinci panodur (KANON §10) ve Bayt vermez. **Sıralama:** (1) anlık altın durak sayısı, (2) eşitlikte altın-gün toplamı (her altın durağın altın kaldığı günlerin toplamı), (3) o sayıya ilk ulaşan. MVP'de Metro Haritası 18 duraktır; çoğu oyuncu 18'e yaklaşacağından altın-gün asıl eşitlik kıran ölçüdür. Pano ilk 100'ü, arkadaşları ve oyuncunun kendi sırasını gösterir; semt filtresi vardır. Altın durak sayısı velilere gösterilebilen gerçek öğrenme KPI'ıdır (VİZYON §6) ve haftalık özette yer alır (§7.5).

### 8.4 En Hızlı Otopark

VİZYON §9 MVP'de "ilk geçiş süresi"ni sıralar. Ölçü: **Kodlama Süresi** = Gereksinim Netleştirme bittikten sonra editörün ilk açıldığı andan, 26 testin (6 açık + 14 gizli + 6 tohumlu) *ilk kez hepsinin* geçtiği ana kadar geçen **aktif** süre; 90 saniyeyi aşan hareketsizlik ve arka plandaki sekme süreden düşülür. Yalnızca ilk geçiş girişimi sayılır, sonraki yeniden çözümler sıralamaya girmez. İpucu merdiveni ücretsizdir ve doğal olarak süreyi uzatır; ayrı ceza yoktur.

Doğrulama KANON §9'a bağlıdır: yalnızca **Savunma'yı geçen** (Açılış) kayıt "Savunma geçti" etiketi alır; Savunma bekleyen kayıt gri "Savunma bekliyor" etiketiyle, Savunma'da başarısız olan kayıt "Deneme" etiketiyle görünür. Süre 90 saniyenin altındaysa ya da AST benzerliği >%95 veya yazım <30 sn ise (KANON §9) kayıt Savunma bitene dek panoda hiç görünmez. Pano üç dilimlidir: Tüm zamanlar (ilk 50), Bu ay (ilk 20), **Yeni oyuncular** (ilk 30 gün; ilk 20) — ileri düzey bir oyuncunun yeni gelenleri hep ezmemesi için. Satır: sıra, takma ad, unvan rozeti, süre (dk:sn), Savunma durumu. Aynı biçim v1.1'de En Hızlı Büfe ve En Hızlı Kargo'ya genişler.

### 8.5 En Kazançlı İşletme

Ölçü: son 7 günde işletmeden **toplanan** Bayt (kasa dolu kalıp üretimi durmuşsa o kayıp sayılmaz). Segment: işletme türü × seviye grubu (L1–L2, L3–L5), yani "Otopark L1–L2" ile "Otopark L3–L5" ayrı tablolardır ve L5 ile L1 hiç karşılaştırılmaz. Yalnızca **Açık** işletmeler girer (Deneme ve Kararmış hariç); sahibi "Panoda göster" seçeneğini kapatabilir. 15–17 hesapta varsayılan **kapalıdır** (B9 §8.2: işletme Turist modunda varsayılan gizli); açmak Ebeveyn Paneli'nden ya da veli onayıyla olur.

Dürüst bir not gerekir: gelir referans çözümle tavanlı ve AI çarpanı yok (KANON §4), bu yüzden aynı seviyedeki iki doğru kodun üretimi aynıdır. Sıralamayı farklılaştıran şey toplama alışkanlığı (kasa dolu kalan saat) ve onaylanırsa Lonca Bonusu ile Mesai Bonusu'dur (B2 Ek A-4, A-5). Pano bu nedenle "kod kalitesi" değil, "bakılan işletme" statüsüdür; eşitlikte toplama verimi (toplanan ÷ üretilen), sonra eski Açılış tarihi sıralar. Gelir sunucuda hesaplandığından tavanı aşan kayıt oluşamaz.

### 8.6 Hile tespiti

Üç hile ailesi vardır: **anormal süre**, **kopya**, **çoklu hesap**. Tespitin ilkesi KANON ve VİZYON §11 ilke 9'dur: kopyayı yakalamaktan çok anlamsız kılmak (tohumlu testler, Savunma, referans tavanı) ve yakalayınca *ceza değil doğrulama* üretmek. Her sinyal bir puan taşır; Şüphe Puanı 0–100'dür.

| Sinyal | Tanım ve eşik | Puan |
|---|---|---|
| Anormal süre | Günlük Tekrar 5 soru <20 sn · Meydan Sorusu <0,8 sn · Hata Bildirimi çözümü <20 sn · En Hızlı Otopark <90 sn · Savunma yazımı <30 sn (KANON) | +35 |
| Kopya (AST) | Oyuncular arası AST benzerliği >%95 (KANON §9) | +40 |
| Yapıştırma | Yazım telemetrisinde karakterlerin >%90'ı yapıştırma | +15 |
| Çoklu hesap | Aynı cihaz kümesinde ≥3 hesap | +30 |
| Makine ritmi | Tıklama aralığı standart sapması <20 ms | +25 |
| Alkış / davet çemberi | Karşılıklı kapalı Alkış ya da davet grafiği (A→B→C→A) | +20 |
| Uç aktiflik | 7 gün üst üste günde 20+ saat aktif oturum | +10 |

```csharp
public sealed record Sinyal(double SureSn, double InsanTabanSn, double AstBenzerlik,
                            double YapistirmaOrani, int CihazKumesiHesap, double TiklamaSapmaMs);
public static class Suphe
{
    public static int Puan(Sinyal s)
    {
        int p = 0;
        if (s.SureSn < s.InsanTabanSn) p += 35;   // anormal hız
        if (s.AstBenzerlik > 0.95) p += 40;       // KANON §9
        if (s.YapistirmaOrani > 0.90) p += 15;
        if (s.CihazKumesiHesap >= 3) p += 30;
        if (s.TiklamaSapmaMs < 20) p += 25;       // makine ritmi
        return Math.Min(100, p);
    }
    public static string Eylem(int p) => p switch
    {
        >= 90 => "insan_incelemesi_odul_bekletilir",
        >= 70 => "dogrulama_savunmasi_zorunlu",
        >= 40 => "siralamada_dogrulaniyor_etiketi",
        _ => "islem_yok"
    };
}
```

Denenmiş örnekler: yalnızca hızlı bitiren (25 sn, taban 90 sn) **35 → işlem yok** (tek sinyal ceza değildir); hızlı + AST 0,97 + %95 yapıştırma **90 → insan incelemesi, ödül bekletilir**; hızlı + AST 0,97 + %100 yapıştırma + 4 hesaplı küme + 10 ms ritim **100**.

| Puan | Etki |
|---|---|
| **40–69** | Sıralamada "Doğrulanıyor" etiketi; Bayt ödülü bekler, sıralama görünür |
| **70–89** | **Doğrulama Savunması** zorunlu (ek Savunma sorusu); geçerse etiket kalkar |
| **≥90** | İnsan incelemesi; ödül en çok 72 saat bekletilir; kanıtlanırsa "hiç verilmez" (geri almak yalnızca kanıtlanmış hile için B2 ilke 9'un tek istisnasıdır) |

**Çoklu hesap:** bir telefon numarası bir hesaptır (KANON §6 Giriş); geçici / VOIP aralıkları B7'de engellenir; cihaz belirteci birinci taraf çerezidir (parmak izi değil); IP kümesi konut ve okul NAT'ını veri merkezi / VPN'den ayırır; **kohort kodlu kayıtlar küme sayımından muaftır**. Davet ödülü 24 saat bekletilir ve aynı cihaz kümesindeki davetlerde verilmez. **Erişilebilirlik:** ekran okuyucu ve tek tuş kullanan oyuncularda "makine ritmi" sinyali kapalıdır (B8 bayrağı). **Yaptırım:** ilk kanıtlı ihlalde sonuç iptal + bilgilendirme; ikincide 4 hafta lig ve pano dışı; üçüncüde kalıcı pano dışı (öğrenme açık); organize hile Ç6; itiraz SLA'sı 72 saat (§12.3).

## 9. Rekabet ve yardımlaşma: Düello, Arena, akran incelemesi, Kalfa Yardımı

Dört özellik KANON §8 ve VİZYON §9 ile uyumludur ve hepsi *bahissiz, transfersiz* çalışır. Hiçbiri MVP'de yoktur; MVP'nin rekabet yüzeyi lig ve En Hızlı Otopark'tır.

### 9.1 Kod Düellosu (v1.1, asenkron)

| Kural | Değer |
|---|---|
| Açılış | Sev. 6 ve Çarşı Sınavı **(B6 önerisi)**; problem iki oyuncunun da Ders Mührü aldığı konulardan seçilir |
| Biçim | Aynı problem, 24 saat penceresi; oyuncu "Başla" der, sunucu süreyi başlatır; tüm testleri geçen **en kısa süre** kazanır (VİZYON §9). Başladıktan sonra en çok 45 dk aktif süre |
| Eşleştirme | Elo; başlangıç 1.000; **fark ≤200** (KANON/VİZYON); kuyruk 10 dk |
| **Hayalet Rakip (B6 önerisi)** | 10 dk içinde eş çıkmazsa, Elo farkı ≤200 olan başka bir oyuncunun *kayıtlı* koşusu rakip olur ("@ad (kayıt)"); yalnızca tamamlanmış koşular, kod asla gösterilmez; oyuncu Ayarlar'dan koşusunun hayalet olmasını kapatabilir (varsayılan açık). Küçük nüfusta düello anında başlar |
| Problem | 200+ problem, rastgele parametre; iki taraf aynı tohumla aynı gizli testleri alır; bir problem 6 ay içinde tekrarlanmaz |
| Sonuç | Yalnızca biri geçtiyse o kazanır; ikisi geçtiyse kısa süre; ikisi de geçemezse sonuç yok (Elo değişmez); fark ≤2 sn → berabere |
| Ödül | Kazanan **15 B + 50 XP**, günde 5 ödüllü düello; berabere her ikisine 8 B + 25 XP; kaybedene 0 (katılım XP'si yok, B2 §4.4); aynı rakiple günde ≤2 |
| Elo | K=32, ilk 10 maçta K=48; sezon sonunda ortalamaya %50 sıkışır (B2 §10.3) |
| Yasaklar | Bahis, giriş ücreti, Bayt transferi **yoktur** (KANON §4) |
| Nişan | **Düello Ceketi:** sezon sonunda Elo ilk %5'te ve ≥20 maç (beceri; satın alınmaz) |
| Meydan okuma | Arkadaşa 24 saatlik meydan okuma; ödül aynı kuraldan; aynı çift arasında ödüllü düello haftada ≤4 |

```csharp
public static class Elo
{
    public static (int a, int b) Guncelle(int a, int b, double skorA, int kA = 32, int kB = 32)
    {
        double beklenenA = 1.0 / (1.0 + Math.Pow(10, (b - a) / 400.0));
        int yeniA = (int)Math.Round(a + kA * (skorA - beklenenA));
        int yeniB = (int)Math.Round(b + kB * ((1 - skorA) - (1 - beklenenA)));
        return (yeniA, yeniB);
    }
}
```

Denenmiş çıktı: 1000 vs 1000, A kazanır → (1016, 984); 1100 vs 900, güçlü olan kazanır → (1108, 892), zayıf olan kazanır → (1076, 924); berabere → (1000, 1000); ilk 10 maçta K=48 → (1024, 984).

**Anti-cheat:** (1) iki tarafın AST benzerliği >%95 ise ikisi de Doğrulama alır (§8.6; yapıştırma ve zaman sinyalleri B3 §7.3'ten); (2) win-trading: aynı çift haftada >4 ödüllü maç ya da dört alternatif galibiyet → ödül bekletilir; (3) kasıtlı kaybetmek kâr getirmez, çünkü kaybedene ödül yoktur; (4) sızıntı 200+ problem, rastgele parametre ve 6 aylık tekrar yasağıyla anlamsızlaşır; (5) taban süresinin altındaki geçiş Şüphe Puanı'na girer. 15–17 oyuncular katılabilir; rakip yalnızca takma ad ve unvanla görünür, sohbet yoktur.

### 9.2 Arena (v1.2)

| Kural | Değer |
|---|---|
| Zaman | Cumartesi 20:00 turnuva (KANON/VİZYON); kayıt 19:30–19:55; Bekleme Salonu'nda hazır cümle sohbeti |
| Format | 32 kişilik tek eleme (katılım azsa 16 ya da 8; <8 ise turnuva "Düello Gecesi"ne dönüşür); Elo sırasıyla tohumlanır; 5 tur ≈45 dk |
| Maç | 1 dk problem okuma + **5 dk kod** (canlı); ilk tüm testleri geçen kazanır; ikisi de geçemezse geçen test sayısı, sonra son geçiş zamanı |
| Seyirci | Arena 60 seyirci (B1 §11.1), dolunca yeni tribün shard'ı; seyirci **test çubuklarını** izler, kodu değil; seyirci sohbeti hazır cümle + emote |
| Öğrenme anı | Maç sonunda iki kod 30 sn karşılıklı açılır; "Güzel çözüm" tepkisi hazır cümledir |
| Ödül | Her galibiyet bir Düello galibiyetidir (15 B + 50 XP) ve günlük 5 sınırına sayılır; 5 tur bu sınırı tam doldurur. Şampiyon: **Şampiyon Ceketi** (Nişan); haftanın şampiyonu Pazartesi 00:00'da Podyum kaidesine girer |
| Anti-cheat | Yalıtılmış editör, yapıştırma ve odak kaybı telemetrisi, 6 aydır kullanılmamış problem; kopma 60 sn tolerans, iki taraf da koparsa maç yenilenir |

### 9.3 Akran kod incelemesi (v1.2)

Sev. 6 ve üstü (Kalfa+) oyuncu, daha önce geçtiği bir problemin **anonim** çözümünü ("@anonim-4821") 4 maddelik rubrikle inceler: Doğruluk, Okunabilirlik (adlar), Sadelik, Sözleşme uyumu; her madde üç düzeyli (Zayıf / Orta / İyi) ve isteğe bağlı tek cümle yorumludur. Havuza yalnızca çözümünü "Akran Havuzu"na açan oyuncuların kodu girer; koddaki yorum ve dizeler Haiku süzgecinden geçer. **Ödül:** AI incelemesiyle **≥%70 örtüşme** (dört maddenin en az üçünde aynı düzey) → **10 XP**, günde 5 (B2 §4.1). Rastgele cevaplayanın üç madde tutturma olasılığı ≈%11'dir; yine de her 5. dosya bilinen bir "kanarya" çözümdür ve kanaryada Doğruluk'u tutturamayan oyuncu günün kalan ödülünü kaybeder. İncelenen oyuncu ham yorumları değil, Haiku'nun tek paragraflık özetini görür. AI inceleme rubriği B3'ündür (§17).

### 9.4 Kalfa Yardımı: mentorluk (v1.2)

**Kim:** mentor Sev. 18+ (Mühendis), menti mentorun geçtiği bir semtte olan, seviyesi mentordan düşük oyuncu. **Yaş duvarı:** 15–17 menti yalnızca 15–17 mentordan, 18+ menti yalnızca 18+ mentordan yardım alır (§1.3).

**Akış.** Akademi Lobisi'ndeki (B1 §4.2) Yardım Masası'nda menti "Yardım iste"yi seçer: soru (≤300 karakter), ders numarası, isteğe bağlı ≤20 satır kod. Soru konuya uygun mentor listesine düşer; mentor "Sahiplen" der ve 15 dakikada cevap verir (≤600 karakter). **Mentor kodu görür ve yorum yazar, kod yazamaz** (VİZYON §9): cevapta en çok 3 satırlık kod parçası bulunabilir; tam çözüm, dış platform ve kişisel veri Haiku süzgecinde engellenir. Konuşma yapısaldır: soru → cevap → "Yardımcı oldu / Olmadı" (en çok 2 tur), DM açılmaz. B9 §8.2'nin "rehber eşleştirme yok" varsayılanı için eşleşme tek soruluktur; kalıcı bağı menti seçer.

**Bağ ve ödül.** Menti üç "Yardımcı oldu" verdikten sonra mentoru "Mentorum" seçebilir; mentor en çok 5 aktif menti, menti tek mentor taşır. **Menti bir sonraki Semt Sınavı'nı geçince mentora 50 XP "Mentor kilometre taşı" ve Mentor rozeti (Nişan) gelir** (KANON §3.3); Efsane unvanı için Sev. 60 ile birlikte en az 10 kilometre taşı gerekir (KANON §3.1). Cevap başına XP yoktur (çiftlik olmasın). **Kötüye kullanım:** mentor–menti aynı cihaz kümesindeyse bağ geçersizdir; kilometre taşı 14 gün bekletilir; "Olmadı" oranı yüksek mentor örneklemeye alınır.

## 10. Bildirim ve push stratejisi

İlke: bildirim oyuncuya *bir sonraki küçük adımı* söyler, suçluluk üretmez ve bütçesi sunucuda zorlanır. Kanal Web Push (PWA; iOS'ta ana ekrana eklenmiş uygulama şartı) ve uygulama içi kartlardır; ticari SMS ya da e-posta kullanılmaz (KVKK ve ticari ileti izni yükü). Metinlerde emoji yoktur.

| Kod | Tip | Tetikleyici | Metin örneği | Sıklık sınırı | Öncelik |
|---|---|---|---|---|---|
| N01 | Kasa doldu | Kasa ilk kez doldu | "Otoparkın kasası doldu: 73 B seni bekliyor." · N02 ile birleşirse: "Otoparkın kasası doldu (73 B). Günlük Tekrar'ın da hazır: 3 dakika, 20 B." | Günde ≤1 | 1 |
| N02 | Günlük Tekrar | Kişisel saat (§3.4) | "Bugünün 5 sorusu hazır. 3 dakika, 20 B, 15 XP." | Günde ≤1 | 1 |
| N03 | Seri riski | Seri ≥3, tur yok, 20:00 (15–17: 19:30) | "12 günlük serin hâlâ seninle. Bugün 5 soru yeterli." | Günde ≤1; N02 gittiyse gitmez | 2 |
| N04 | Müfettiş dosyası | Dosya düştü, 17:00'ye dek açılmadı | "Müfettiş posta kutuna bir dosya bıraktı: 'Müşteri 1.440 dakika için 500 TL ödemiş.'" | Günde ≤1 | 3 |
| N05 | Lig | Pazar 19:30 durum; sonuç | "Ligde 6. sıradasın. Terfi bölgesine 140 XP kaldı." · "Lig kapandı: 5. oldun, Gümüş Ligi'ne terfi ettin. +150 B." | Haftada ≤2 | 2 |
| N06 | Ziyaretçi özeti | Gün içinde ≥3 ziyaretçi | "Odanı bugün 3 kişi gezdi, 2 Alkış bıraktı (+4 B)." | Günde ≤1 (18:30) | 4 |
| N07 | Arkadaş | İstek ya da arkadaş işletme açtı | "@ayse_kod Büfe'sini açtı. Tebrik etmek ister misin?" · "@mert_k sana arkadaşlık isteği gönderdi." | Günde ≤1 (toplu) | 4 |
| N08 | Ruhsat / Tapu / İş Emri | Ruhsat 3/3 ya da 24 saattir bekleyen İş Emri | "Ruhsatın 3/3 oldu. Otopark tapusu 300 B; Nuran Belediye Tapu Masası'nda seni bekliyor." · "Hasan Abi iş emrini bekliyor." | Olay başına 1; ilk 7 günde ≤3 | 2 |
| N09 | Yeni içerik | Salı yayını | "Yeni ders yayında. Defne seni bekliyor." | Haftada ≤1 | 5 |
| N10 | Düello (v1.1) | Davet ya da sonuç | "@mert_k seni düelloya çağırdı. 24 saatin var." | Günde ≤1 | 3 |
| N11 | Etkinlik / sezon (v1.1) | Başlangıç ve son gün | "29 Ekim: Şehir Işıkları bu akşam 20:00'de Meydan'da." | Etkinlik başına ≤2 | 4 |
| N12 | Lonca (v1.1) | Pazar 19:30'da hedef %70–99 | "Ekibin bu hafta 126/150 puanda. Pazar 21:00'e kadar 24 puan kaldı." | Haftada ≤1 | 5 |
| N13 | Geri dönüş | 3 / 7 / 14 gün kayıp | §11.3 | 30 günde ≤3 | 3 |
| N14 | Veli SMS (push değil) | Onay, hatırlatma, haftalık özet (isteğe bağlı), güvenlik | §7.5 | Onay için 72 saatte ≤3 | — |
| N15 | Hesap ve güvenlik | OTP, yeni cihaz, ödeme | Sistem | Bütçeye girmez | Her zaman |

**Bütçe, pencere ve sessiz saatler.** Günlük üst sınır 18+ için **2**, 15–17 için **1**; haftalık 10 ve 6. Düşük öncelik numarası kazanır, N01 + N02 tek bildirime birleşir. Pencere dışındaki her saat **sessiz saattir** ve TR saatiyle sunucuda uygulanır: 18+ 09:00–22:30; 15–17 hafta içi 15:30–20:30, hafta sonu ve tatilde (resmî tatil, yaz tatili, yarıyıl ve ara tatiller) 10:00–20:30. Pencere dışına düşen bildirim en çok 24 saat ertelenir, sonra düşer: bayat bildirim yoktur. 15–17 için lig sonucu Pazar 21:05 pencere dışında kaldığından Pazartesi pencere başında (15:30) iletilir.

**15–17 kuralları.** Dil olumludur ("terfi bölgesine 140 XP kaldı", asla "düşüyorsun"); geri sayım ve son saat baskısı, kapanış banner'ı ve ödül vaadiyle çağrı ("Hemen gir, 50 B kazan") yoktur; çocuğun adı push başlığında geçmez (kilit ekranı mahremiyeti). Veli bildirimleri yalnızca veliye ve SMS ile gider.

**İzin akışı.** İzin ilk kez onboarding'in 29. dakikasında (VİZYON §4), ikinci ve son kez ilk hasat sonrası bağlam içinde (Gün 4) istenir; iki ret sonrası bir daha sorulmaz, Ayarlar'dan açılır. Altı anahtar vardır: Hasat ve tekrar, Lig, Sosyal, İçerik ve etkinlik, Lonca ve Düello, Geri dönüş. **Ramazan modu:** Ramazan'ın ilk günü bir kez "Akşam bildirimlerini iftar sonrasına kaydıralım mı?" sorulur; evet ise 17:30–19:45 arası push gitmez. **Sınav dönemi:** YKS / LGS haftalarında ve oyuncunun seçtiği final haftalarında push susar, Seri Molası hatırlatılır (§3.2).

**Ölçüler:** bildirim izni ≥%35, push tıklama ≥%12, bildirimden gelen oturum payı ≤%30 (alışkanlık bildirime bağımlı olmasın), tür kapatma oranı haftada <%2.

## 11. Retention tasarımı

Retention bu belgede "oyuncuyu geri çağırmak" değil, "her gün küçük ve bitirilebilir bir sebep bırakmak"tır. Hiçbir kanca ders, ipucu ya da testi zamanla veya parayla kilitlemez (VİZYON ilke 10); tek zamanlayıcı kasadadır.

### 11.1 Yaşam döngüsü evreleri

| Evre | Gün | Baskın kanca | Birincil ölçü | Hedef (VİZYON §13) |
|---|---|---|---|---|
| **Yeni** | D0–D3 | Ruhsat → Tapu → Açılış; "KAPALI — yazılım bekliyor" tabelası | D1 geri dönüş | ≥%45 |
| **Filiz** | D4–D14 | Günlük Tekrar serisi, Kalfa Töreni, Büfe, ilk lig, ilk arkadaş | D7 | ≥%20 |
| **Düzenli** | D15–D60 | İkinci işletme, Semt Sınavı, altın duraklar, lonca ve sezon (v1.1) | D30 | ≥%8 |
| **Veteran** | D60+ | Semt kapıları, Kalıcılık Ligi, Düello, Mentor | D90 elde tutma | izlenir |
| **Geri dönen** | 3+ gün yok | Kasa, Hatırlatma Turu, arkadaşlar | R3 dönüşü | ≥%6 |

### 11.2 D1, D7 ve D30 kancaları

| Gün | Kanca | Oyuncunun gördüğü | Bildirim | Ölçü |
|---|---|---|---|---|
| **D1** | Açık döngü + ilk Günlük Tekrar | Çıkış kartı ("Yarın: Ders 1.3 → Ruhsat 2/3" ya da "Yarın: Hasan Abi'nin iş emri"); 04:00'te ilk Günlük Tekrar; haritada "KAPALI — yazılım bekliyor" | N02 (17:30–18:30) | D1 ≥%45; tapu ≤2 oturum (%50); 72 saatte Otopark AÇIK (%35) |
| **D7** | İlk hafta kapanışı | **Hafta Özeti** kartı (ders, işletme, seri, altın durak); Kalfa Töreni (Sev. 6 ≈ Gün 7); "İlk 7 gün serisi" +100 B; ilk lig sonucu; ikinci davet hatırlatması | N05, N08 | D7 ≥%20; arkadaşı olan oyuncu payı ≥%30; seri ≥5 payı |
| **D30** | İkinci işletme + semt kapısı | Çarşı Sınavı → Liman (normal Gün 12, yoğun Gün 5, hafif Gün 28; B2 §11); 10 altın durak → "Mühür Vur" emote'u (B1 §7.3); Daire hedefi (Sev. 10, 2.000 B); lonca daveti (v1.1, Sev. 12) | N01, N09, N11 | D30 ≥%8; haftalık aktif gün ≥3 |

D30 hattının zayıf noktası B2 §11.5 bulgu 2'dir: Sev. 10–11'de dersler biter ve oyuncu günde 65–165 XP ile bekler. B6'nın payı: Hata Bildirimi tavanını 5'e çıkaran Müfettiş Günü (haftada bir) ve Kod Düellosu'nu (v1.1) o oyuncuya öne çıkarmak; asıl çözüm Staj modudur (B2 Ek A-1; bu belgede Açık Soru 1).

### 11.3 Geri dönen oyuncu akışı

Kurallar: suçlama dili yok ("kasan 3 gündür dolu" yasaktır, B2 §8.3); **giriş ödülü yok** (Bayt ve XP yalnızca eylemden gelir); push 30 günde **en çok 3**, sonra 60 gün sessizlik, ardından yalnızca yeni sezon başlangıcında tek mesaj. Push kapalıysa aynı içerik uygulama içi karşılama panelidir.

| Kayıp | Durum | Push | Uygulama içi karşılama |
|---|---|---|---|
| **3 gün** | İşletmesi var | "Otoparkın kasasında 73 B var." | "Hoş geldin, {ad}. Kasa hazır: Topla. Serini dondurma korudu." |
| 3 gün | İşletme yok, Ruhsat sürüyor | "Ruhsatın 2/3: bir görev kaldı, tapu seni bekliyor." | "Kaldığın yer: Ders 1.3. 90 saniyelik özet ister misin?" |
| **7 gün** | Genel | "Şehirde bu hafta: @ayse_kod Büfe'sini açtı, lig yeni başladı. Kaldığın yer: Ders 1.6." | "Şehirde neler değişti" kartı: 3 madde (arkadaşlar, etkinlik, lig) |
| 7 gün | Lonca üyesi (v1.1) | "Ekibin bu hafta 6/10 üyeyle ilerliyor. Sen de katkı verebilirsin." | Lonca Panosu kısayolu |
| **14 gün** | Genel | "Hatırlatma Turu hazır: 3 soru, 90 saniye. Kaldığın yerden devam edersin." | **Isınma Turu:** 3 soru, süre yok, ceza yok; tamamlanırsa o günün Günlük Tekrar'ı sayılır (normal 20 B + 15 XP, ek ödül yok) |
| 30 gün | Son mesaj | "Kasan, odan ve yarım kalan dersin burada. İstediğin zaman." | Karşılama + Defne'nin kısa özeti |

Karşılama paneli şu sırayı izler: (1) kasa dolu ise "Topla"; (2) seri durumu ("Dondurma seni korudu" ya da 48 saatlik Onarım Turu); (3) Defne ya da kaldığı yerin Ustası'nın 90 saniyelik özeti; (4) üç maddelik şehir haberi. Ders ilerlemesi, işletme ve Bayt hiçbir koşulda sıfırlanmaz. Ölçü: R3 push → oturum ≥%6; 14+ gün sonra dönenlerin 7 gün tutması ≥%35.

### 11.4 Terk sinyalleri ve müdahaleler

| Sinyal | Eşik | Müdahale | Sahibi |
|---|---|---|---|
| Ders terk | >%15 (VİZYON §13) | Ders ortasında "Mola Noktası"; Mikro Mod (§3.5) | B4, B6 |
| İlk 3 oturumda editörde 0 karakter | Oturum başına | Taslak ipucunun otomatik önerilmesi (ücretsiz) | B3, B8 |
| Sev. 10–11 XP duvarı | Haftalık XP <300 | Staj modu (B2 Ek A-1), Düello (v1.1), Müfettiş Günü | B2, B6 |
| Tier 2→3 (Sev. 18–25) | Haftalık aktif gün düşüşü >%30 | Lonca daveti, "Kalfa Köprüsü" ara görevleri (VİZYON §12) | B4 |
| D7'de arkadaşsız | 0 arkadaş | İkinci davet hatırlatması, kohort Meydan'ı | B6 |
| Uzun seri kırıldı | Seri ≥14 | Tek push: Onarım Turu | B6 |

## 12. Canlı operasyon süreçleri

Ekip 5–6 kişidir (VİZYON §13); canlı operasyon ayrı bir ekip değil, beş rolün haftalık ritmidir: **LiveOps sorumlusu** (kurucu / ürün: takvim, KPI, karar), **nöbetçi mühendis** (CTO ile full-stack haftalık dönüşümlü), **topluluk ve moderasyon** (0,5 FTE → 1 FTE, B9 planı), **müfredat yazarı** (Salı yayını), **sanatçı** (yarı zamanlı; etkinlik kozmetiği).

### 12.1 Haftalık yayın ritmi: "Perşembe Treni"

| Gün / saat | Faaliyet | Sahibi | Çıktı |
|---|---|---|---|
| Pzt 10:00 | Ekonomi panosu ve retention incelemesi (B2 §10.5): haftada **tek** düğme kararı | LiveOps + ekonomi | Karar notu; fiyat değişikliği varsa ≥7 gün önceden duyuru |
| Sal 10:00 | İçerik yayını (3 ders + 3 görev); canary %10 → 2 saat → %100 | Müfredat + full-stack | Yayın günlüğü |
| Çar 11:00 | Moderasyon ve hile haftalık raporu; sözlük / izin listesi güncellemesi | Topluluk | 1 sayfalık rapor |
| Çar 16:00 | Sürüm adayı donar, QA (15–17 test hesabıyla dâhil) | Full-stack | RC etiketi |
| **Per 14:00** | **Perşembe Treni:** uygulama sürümü; 15:00'te sürüm notları | CTO | Sürüm + notlar |
| Cum 12:00 | Hafta sonu yayın dondurması başlar; nöbet çizelgesi; hafta sonu etkinlik kontrol listesi | LiveOps | Dondurma duyurusu |
| Cmt | Müfettiş Günü; (v1.2) 20:00 Arena | Nöbet | — |
| **Paz 18:00–22:00** | **Lig penceresi:** deploy yok; 21:05'te lig ödül dağıtımı izlenir | Nöbet | Lig kapanış raporu |
| Her gün 04:00 / 09:00 | Gece batch'i (sentetik trafik, kasa) izlenir; sağlık kontrolü | Nöbet | Pano |

Kural: Cuma 12:00 – Pazartesi 09:00 arasında yeni özellik yayını yoktur; yalnızca SEV1 / SEV2 hotfix'i saat bağımsız çıkar. Planlı bakım Salı ya da Perşembe 05:00–06:00'dadır, 24 saat önceden duyurulur ve kasa tavanı bakım süresi kadar uzatılır. Her özellik feature flag arkasındadır; kill-switch 10 dakikada kapatır.

### 12.2 İçerik takvimi ve hazırlık

Yıllık takvim §4.4 (sezonlar) ve §4.6'dadır (Türkiye takvimi). Her etkinlik ve sezon aynı geri sayımla hazırlanır:

| Zaman | Adım | Sahibi |
|---|---|---|
| T−28 gün | Brief: amaç, şablon, KPI, kitle, yaş kuralı | LiveOps |
| T−21 | Sanat başlar; metin anahtarları ve bildirim taslakları | Sanatçı, LiveOps |
| T−14 | **İçerik kilidi:** kozmetik kimlikleri, Türkçe metinler, hazır cümleler; moderasyon ve hukuk okuması | Topluluk |
| T−7 | QA (15–17 hesapla), İlan Panosu duyurusu, ekonomi kontrolü (B2 §10.5) | Full-stack |
| T−3 | Bildirim zamanlaması, kill-switch testi | CTO |
| T0 | Yayın; ilk 2 saat canlı izleme | Nöbet |
| T+1 / T+7 | İlk KPI kontrolü / 1 sayfalık post-mortem (plan, sonuç, KPI, ders) | LiveOps |

### 12.3 Oyuncu destek süreci ve itiraz SLA'sı

Kanallar: uygulama içi "Yardım" (Ayarlar > Hesap), e-posta, moderatörlü Discord ve veli için SMS bağlantısı. Her talep kategori (Hesap / OTP, Ödeme, Hata, Puan, Moderasyon, KVKK, Çocuk güvenliği) ve öncelik alır; yanıt şablonları (makro) ≤80 kelimedir, emoji içermez ve isimle başlar: "Merhaba {ad}, bildirimini aldık ({kayıt no}). {Bulgu}. Şunu yaptık: {eylem}. Yeni bir şey olursa bu kayda yanıt yazman yeterli."

| Öncelik | Örnek | İlk yanıt | Çözüm hedefi |
|---|---|---|---|
| **P0** | Çocuk güvenliği, hesap ele geçirme, çifte tahsilat, KVKK ihlali | 1 saat (7/24 nöbet) | 24 saat |
| **P1** | Hesaba girilemiyor, Bayt / XP kaybı, sandbox kesintisi | 4 saat | 48 saat |
| **P2** | Hata, kozmetik gelmedi | 24 saat | 5 gün |
| **P3** | Öneri, soru | 72 saat | — |

| İtiraz türü | Kim karar verir | İlk yanıt | Karar |
|---|---|---|---|
| Kurul puanı | `claude-opus-5-5` kör yeniden puanlama (B3); soru başına 1, günde 3 | Anında | Anında; ceza yok |
| Moderasyon Ç1–Ç2 | Farklı bir insan moderatör | 24 saat | **72 saat** |
| Moderasyon Ç3–Ç4 | İnsan, ikinci okuyucu | 24 saat | **48 saat** |
| Ç5, Ç6, hesap kapatma | İnsan + ürün sahibi | 24 saat | **5 gün** |
| Hile / lig doğrulaması | İnsan | 24 saat | **72 saat** |
| KVKK (silme, erişim) | Hukuk / veri sorumlusu | 3 gün | Yasal azami 30 gün; hedef 7 gün |
| Çip iadesi | Destek | 24 saat | 14 gün iade hakkı içinde (B2 §9.3) |

**Tazminat ilkeleri:** sistem kaynaklı kesinti 2 saati aşarsa kasa tavanı kesinti süresi kadar uzatılır (Bayt hediyesi verilmez); sistem hatasıyla eksik ya da fazla verilen Bayt / XP kayıtlı kaynak etiketiyle ("Tazminat") düzeltilir; oyuncu tercihinden doğan pişmanlık (alınmış eşya) telafi edilmez; Çip için 14 günlük iade hakkı geçerlidir.

### 12.4 Sürüm notları süreci

Uygulama sürümü `1.MINOR.PATCH` biçimindedir; Perşembe Treni her hafta bir PATCH, özellik sürümlerinde MINOR üretir. Süreç: Çarşamba 16:00 sürüm adayı donar → ürün sahibi notu oyuncu diliyle yazar (commit mesajı değil) → moderasyon ve hukuk gözden geçirir → Perşembe 15:00 yayınlanır. Format: **Yeni · Değişti · Düzeltildi · Denge**; ≤200 kelime, emoji yok. **Denge** başlığındaki fiyat ve ödül değişiklikleri en az 7 gün önceden duyurulur ve geriye dönük kayıp üretmez (B2 §10.5, ilke 9). Kanallar: İlan Panosu, uygulama içi "Yenilikler" kartı (ilk açılışta bir kez), Discord; push yalnızca büyük özellik sürümünde (N09).

> **KodKent 1.1.0 — Yazılım Ekipleri geldi**
> **Yeni:** Sev. 12 ve 500 B ile Yazılım Ekibi kurabilir, Sev. 6'dan itibaren bir ekibe katılabilirsin. Kod Düellosu açıldı: aynı problem, 24 saat, en kısa sürede doğru çözen kazanır (15 B + 50 XP). Vitrin'e not bırakabilirsin.
> **Değişti:** Odana gelen Alkışlar artık gün içinde tek bir özet bildirimi olarak ulaşıyor.
> **Düzeltildi:** Büfe L2 fişindeki kuruş yuvarlaması; Meydan Sorusu sıralamasındaki gecikme.
> **Denge:** Pazar (mağaza) Nadir rafı 6 yerine 8 ürünle açılıyor. Hiçbir fiyat değişmedi.

### 12.5 Olay (incident) iletişimi

| Seviye | Tanım | Örnek | İlk duyuru | Güncelleme | Kanal | Sonrası |
|---|---|---|---|---|---|---|
| **SEV1** | Oyuna girilemiyor; veri kaybı ya da sızıntı şüphesi; çocuk güvenliği; yanlış tahsilat | Giriş / OTP çöktü, veri tabanı erişilemiyor | ≤15 dk | Her 30 dk | Durum sayfası + Meydan LED panosu + uygulama içi banner + Discord | 72 saat içinde herkese açık özet; kişisel veri ihlalinde 72 saat içinde Kurul'a bildirim (KVKK Kurulu 2019/10) ve etkilenenlere bildirim |
| **SEV2** | Kısmi kesinti: sandbox ya da Kurul yavaş / kapalı; Bayt / XP hatası; sohbet kapalı | Sandbox kuyruğu >10 sn | ≤30 dk | Her 60 dk | Durum sayfası + banner | 5 gün içinde özet |
| **SEV3** | Küçük: görsel, tek ekran, kozmetik | Yanlış renkli şapka | Sürüm notu | — | Sürüm notu | — |

Roller: **olay komutanı** nöbetçi mühendis, **iletişim sorumlusu** LiveOps, **veri / hukuk** KVKK'dan sorumlu kişi. Dil ilkeleri: kısa, dürüst, sayılı, suçlamasız; oyuncunun kaybı olup olmadığı her mesajda açıkça söylenir.

> **Duyuru (SEV1, ilk):** "Şu anda KodKent'e giriş yapılamıyor. Sorunu biliyoruz ve üzerinde çalışıyoruz. Bayt'ın, XP'n ve işletmelerin güvende. Bir sonraki bilgi 30 dakika içinde burada."
> **Duyuru (SEV2, Kurul):** "Kurul şu an yavaş çalışıyor. Cevapların kaydediliyor; puanların ve XP'n sonra eklenecek. Görevler, testler ve ipuçları normal çalışıyor."
> **Çözüldü:** "Sorun çözüldü. {başlangıç}–{bitiş} arasında {etki} yaşandı. Kaybın yok. Bu sürede kasaların dolamadığı için kasa tavanını {süre} uzattık."

### 12.6 Canlı operasyon KPI panosu

| Metrik | Hedef | Kaynak |
|---|---|---|
| D1 / D7 / D30 | ≥%45 / ≥%20 / ≥%8 | VİZYON §13 |
| Günlük Tekrar tamamlama (DAU içinde) | ≥%55 | B6 |
| Seri ≥7 olan oyuncu payı (D30 kohortu) | ≥%25 | B6 |
| Lig katılımı (WAU içinde) | ≥%60 | B6 |
| Arkadaşı olan oyuncu payı (D7) | ≥%30 | B6 |
| Bildirim izni / tıklama | ≥%35 / ≥%12 | §10 |
| Şikâyet oranı | <%1 mesaj | VİZYON §13 |
| P1 moderasyon ilk işlem | ≤2 saat | §7.3 |
| Destek SLA uyumu | ≥%95 | §12.3 |
| Moderasyon itirazında kararın bozulma oranı | <%15 | B6 |
| Takvim etkinliği katılımı (DAU içinde) | ≥%40 | §4.7 |
| Kill-switch kapatma süresi | <10 dk | B7 |

## 13. Topluluk Kuralları (oyuncuya gösterilen metin)

Bu metin Ayarlar > Kurallar ekranında ve sohbet ilk açıldığında gösterilir. Dil 15–17 yaşa uygundur: kısa cümleler, "sen" hitabı, suçlayıcı değil yönlendirici ton. Moderasyon politikasının oyuncu yüzü budur; işleyişi §7'dedir.

> **KodKent Şehir Kuralları**
>
> KodKent'te herkes öğrenmeye ve birlikte eğlenmeye geldi. Bu on kural şehri herkes için güvenli ve keyifli tutar. Kurala uymayan mesajı sistem durdurur; amacımız kimseyi utandırmak değil.
>
> 1. **Herkese saygı göster.** Alay, hakaret ve küçük düşürme yok. Biri "dur" derse dur.
> 2. **Küfür ve argo yok.** Şehirde her yaştan oyuncu var. Kızgınsan sohbetten bir adım geri çekil.
> 3. **Kişisel bilgini koru.** Telefon numarası, adres, okul adı, şifre ve sosyal medya hesabını paylaşma. Başkasından da isteme.
> 4. **Dışarıya çağırma.** Discord, Instagram, WhatsApp gibi adresleri ve bağlantıları paylaşma. Arkadaş olmak için davet kodu var.
> 5. **Zorbalık ve ısrarlı rahatsız etme yok.** Birine tekrar tekrar yazmak, onu dışlamak ya da grup olup üstüne gitmek zorbalıktır. Engelle ve bildir.
> 6. **Kopya ve hile yok.** Başkasının kodunu kendinmiş gibi gösterme, hesap paylaşma, birden fazla hesapla yarışma, bot kullanma. Dışarıdan yardım almak yasak değil, ama kodunu açıklayabilmelisin.
> 7. **Dürüst ol, kimsenin yerine geçme.** KodKent ekibi, Usta, Müfettiş ya da Kurul gibi davranma. Bayt, Çip ya da hesap alıp satma; "karşılığında hesabını alırım" teklifleri yok.
> 8. **Uygunsuz içerik paylaşma.** Şiddet, cinsellik, nefret ve kumar; takma adda, işletme adında, Tebeşir Tahtası'nda, Vitrin notunda ya da sohbette olmaz.
> 9. **Spam yapma.** Aynı mesajı tekrar tekrar yazmak, reklam ve zincir mesaj yok.
> 10. **Yardım iste, yardım et.** Kötü hissediyorsan ya da biri sana zarar vermeye çalışıyorsa "Bildir"e bas ve güvendiğin bir yetişkine anlat. Acil durumda 112'yi ara.
>
> **Kural bozulursa ne olur?** Önce nazik bir hatırlatma; tekrar olursa kısa bir sessizlik; ağır durumlarda daha uzun. Cezalar yalnızca sohbet ve yazı alanlarını kapatır: derslerin, işletmen ve Baytların her zaman senin. 15–17 yaşındaysan ağır bir durumda velini haberdar ederiz. Verdiğimiz her karara 7 gün içinde itiraz edebilirsin; kararı başka bir kişi yeniden okur.

## 14. Ekran metinleri

Kapsanan ekranlar KANON §6'dan: **#23 Sohbet & Arkadaşlar**, **#22 Liderlik Panosu**, **#16 Günlük Tekrar**, **#17 Oda** (ziyaret). Metinler "sen" dilinde, emojisiz ve "henüz değil" tonundadır; `{…}` yer tutucudur. 15–17'ye farklı gösterilenler "Not" sütununda belirtilmiştir.

| Ekran | Durum | Metin | Not |
|---|---|---|---|
| Sohbet & Arkadaşlar | Boş: arkadaş listesi | "Henüz arkadaşın yok. Davet kodun {kod}. Arkadaşın ilk Bayt'ını kazanınca ikiniz de 100 B alırsınız." | |
| Sohbet & Arkadaşlar | Boş: Meydan sohbeti | "Burası şimdilik sessiz. İlk selamı sen ver." | Onay bekleyen 15–17: "…Aşağıdaki hazır cümlelerden birini seçebilirsin." |
| Sohbet & Arkadaşlar | Hata: bağlantı / kişisel bilgi | "Burada bağlantı ve kişisel bilgi paylaşılamaz. Arkadaşlık için davet kodunu kullanabilirsin." | |
| Sohbet & Arkadaşlar | Hata: çok hızlı | "Biraz yavaş: her 3 saniyede bir mesaj yazabilirsin." | |
| Sohbet & Arkadaşlar | Hata: kural dışı mesaj | "Bu mesaj şehir kurallarına uymuyor, gönderilmedi. Kuralları görmek için dokun." | |
| Sohbet & Arkadaşlar | Hata: süzgeç zaman aşımı | "Mesaj gönderilemedi. Tekrar dene." | 15–17'de gecikmede gösterilir (§7.2) |
| Sohbet & Arkadaşlar | Başarı: arkadaş eklendi | "{ad} artık arkadaşın. Odasını gezebilir, işletmesine Alkış bırakabilirsin." | |
| Sohbet & Arkadaşlar | Başarı: davet kodu kopyalandı | "Kod kopyalandı. Arkadaşın ilk Bayt'ını kazandığında ikiniz de 100 B alırsınız (ayda en çok 5 davet)." | |
| Sohbet & Arkadaşlar | Güvenli mod: veli onayı bekleniyor | "Serbest sohbet, veli onayından sonra açılır. O zamana kadar hazır cümlelerle sohbet edebilirsin. Veline gönderilen bağlantı 72 saat geçerli." | Yalnızca 15–17 |
| Sohbet & Arkadaşlar | Güvenli mod: hatırlatma | "Veline bağlantıyı yeniden göndermemizi ister misin?" | Günde 1 kez gösterilir |
| Sohbet & Arkadaşlar | Kriz ifadesi | "Zor bir şey yaşıyor olabilirsin ve bunu tek başına taşımak zorunda değilsin. Güvendiğin bir yetişkinle konuş. Acil durumda 112'yi, destek için ALO 183'ü arayabilirsin." | Gönderene özel; numaralar yayın öncesi doğrulanır |
| Sohbet & Arkadaşlar | Bildir: gönderildi | "Bildirimin bize ulaştı. Her bildirim okunur; sonucu ayrıca yazamayabiliriz." | |
| Sohbet & Arkadaşlar | Engellendi | "{ad} engellendi. Mesajlarını artık görmezsin. İstersen Ayarlar > Engellenenler'den kaldırabilirsin." | |
| Sohbet & Arkadaşlar | Yavaş mod | "Bu sokakta sohbet kısa süre yavaşlatıldı. 10 saniyede bir mesaj yazabilirsin." | |
| Sohbet & Arkadaşlar | Bağlantı koptu | "Bağlantı koptu. Avatarın 30 saniye burada bekler; geri dönünce kaldığın yerdesin." | B1 §11.4 |
| Sohbet & Arkadaşlar | DM yaş kuralı | "Bu oyuncuyla özel mesajlaşma açık değil. Odasını ziyaret edip Alkış bırakabilirsin." | Yaş gerekçesi yazılmaz |
| Sohbet & Arkadaşlar | Ceza (Ç1) | "Sohbet 15 dakika kapalı. Bir mesajın şehir kurallarına uymadı. Kuralları okuyabilirsin; itiraz hakkın var." | 15–17: önce Davranış Notu ekranı |
| Liderlik Panosu | Boş: kova yok | "Bu haftanın ligi ilk XP'ni kazandığında başlar. Bir görev bitir, kovan oluşsun." | |
| Liderlik Panosu | Kova dolmadı | "Kovanda şimdilik {n} oyuncu var. Yeni oyuncular katıldıkça dolar; ödüller sıranın oranına göre hesaplanır." | |
| Liderlik Panosu | Isınma haftası | "Bu hafta Isınma haftan: puan toplarsın ama ödül ve terfi yok. Gelecek hafta gerçek ligin başlıyor." | |
| Liderlik Panosu | Terfi bölgesinde | "Terfi bölgesindesin. Yerini korumak için {x} XP daha yeterli." | |
| Liderlik Panosu | Terfiye uzak | "Terfi bölgesine {x} XP uzaktasın." | Düşme dili kullanılmaz |
| Liderlik Panosu | Asgari puan | "Ödül ve terfi için en az 100 XP gerekiyor. Şu an {x} XP'sin." | |
| Liderlik Panosu | Kapanış: terfi | "Lig kapandı: {sıra}. oldun ve {lig} Ligi'ne terfi ettin. +{bayt} B." | 15–17: Pazartesi 15:30'da |
| Liderlik Panosu | Kapanış: kaldı | "Lig kapandı: {sıra}. oldun. +{bayt} B. Yeni hafta başladı." | |
| Liderlik Panosu | Kapanış: düşme | "Lig kapandı: {sıra}. oldun ve {lig} Ligi'nde devam ediyorsun. Bayt ya da XP kaybın yok; yeni hafta başladı." | |
| Liderlik Panosu | Bekleyen XP | "Bekleyen XP var: Kurul cevaplarını gece puanlayacak, yeni haftanın puanına eklenecek." | |
| Liderlik Panosu | Kalıcılık: boş | "Henüz altın durağın yok. Günlük Tekrar'da bir durağı 3 kez üst üste doğru bilirsen altın olur." | |
| Liderlik Panosu | En Hızlı Otopark: boş / kendi süren | "Henüz süre yok. Otopark'ı açan ilk oyuncular burada görünür." · "Süren: {dk} dk {sn} sn. Savunma bekleniyor." | |
| Liderlik Panosu | Doğrulanıyor | "Bu sıralama doğrulanıyor; en geç 72 saat sürer. Ödülün korunuyor." | Hile kelimesi geçmez |
| Liderlik Panosu | Doğrulama bitti | "İncelemeyi tamamladık: sonucun geçerli. Beklettiğimiz {bayt} B hesabına yattı." | |
| Liderlik Panosu | Hata: yüklenemedi | "Liderlik Panosu yüklenemedi. Puanın ve sıran güvende; birazdan tekrar dene." | |
| Günlük Tekrar | Açılış | "Bugünün 5 sorusu hazır. Hedef süre 3 dakika; yetmezse devam edebilirsin." | |
| Günlük Tekrar | Kuyruk az | "Bugün vadesi gelen soru az; yakın zamanda öğrendiklerinden tamamladık." | |
| Günlük Tekrar | Başarı: tamamlandı | "Bugünkü tekrar tamam. +20 B, +15 XP. Seri: {n} gün." | Seri ≥7: "+30 B" |
| Günlük Tekrar | Başarı: 7. gün | "7 gün üst üste. Seri bonusu açıldı: bundan sonra tekrar başına 30 B." | |
| Günlük Tekrar | Dondurma kullanıldı | "Dün yoktun; ücretsiz dondurma serini korudu. Bu hafta başka dondurma hakkın kalmadı." | |
| Günlük Tekrar | Seri durdu | "Serin {n} günde durdu. Onarım Turu ile geri alabilirsin: 10 soru, 48 saat içinde." | "Kaybettin" denmez |
| Günlük Tekrar | Onarım başarılı | "Seri geri geldi: {n} gün. Devam." | |
| Günlük Tekrar | Kurul kapalı | "Kurul bugünlük kapandı. Cevabın kaydedildi; sabaha kartın hazır olur ve XP'n hesabına yazılır. Dersler, görevler ve ipuçları açık." | B3 §13 `kota_dolu` ile aynı |
| Günlük Tekrar | Bayram | "Bayramınız kutlu olsun. Bu günler serini bozmaz." | |
| Günlük Tekrar | Hata: bağlantı yok | "Çevrimdışısın. Günlük Tekrar için bağlantı gerekiyor." | B8 §6.16 ile aynı |
| Günlük Tekrar | Boş: yeni oyuncu | "Henüz tekrar edilecek bir şey yok. İlk dersini bitir, yarın burada olacağım." | B8 §6.16; Mühür günü kuyruk boştur |
| Günlük Tekrar | 3 dakika doldu | "3 dakika doldu. Acele yok; kalan soruları bitirmen yeterli." | |
| Günlük Tekrar | Bugün zaten yapıldı | "Bugünkü tekrarı yaptın. İstersen Serbest Tekrar'la devam et; ödül yok ama durakların pekişir." | |
| Günlük Tekrar | Mikro Mod kartı | "Bugün kısa mı? 3 dakikalık tekrar ve 1 Hata Bildirimi, toplam yaklaşık 8 dakika." | |
| Oda (ziyaret) | Boş: Ziyaretçi Defteri | "Defter henüz boş. Odanı Arkadaşlara ya da Herkese aç, ilk ziyaretçini bekle." | 15–17: "…Arkadaşlarına açık." |
| Oda (ziyaret) | Oda dolu | "Dolu — 20/20. Sahibine Alkış bırakabilirsin." | B1 §5.4 plakası ve B8 §6.17 ile aynı |
| Oda (ziyaret) | Arkadaşlara açık | "{ad} odasını yalnızca arkadaşlarına açmış. Arkadaşlık isteği gönderebilirsin." | |
| Oda (ziyaret) | Zilli oda | "Kapıyı çaldın. {ad} çevrimiçiyse kabul edebilir; yanıt gelmezse 2 dakika sonra kapanır." | |
| Oda (ziyaret) | Giriş kapalı (yaş duvarı) | "Bu odaya şu an girilemiyor." | Gerekçe yazılmaz |
| Oda (ziyaret) | Başarı: Alkış verildi | "Alkışın {ad}'a ulaştı." | |
| Oda (ziyaret) | Alkış zaten verildi | "Bu odaya bugün zaten Alkış bıraktın. Yarın 04:00'ten sonra yenisini verebilirsin." | |
| Oda (ziyaret) | Alkış için erken | "Alkış için odada birkaç saniye daha kal." | ≥20 sn kuralı |
| Oda (ziyaret) | Başarı: ilk Alkış | "İlk Alkışın! +10 B." | Tapudan sonraki ilk gerçek ziyaret |
| Oda (ziyaret) | Sahibe: ziyaret | "{ad} odanı ziyaret etti ve Alkış bıraktı. +2 B." | Tavan dolunca "+0 B" gösterilmez, yalnızca ziyaret yazılır |
| Oda (ziyaret) | Hata: not gönderilemedi | "Not gönderilemedi: kurallara uymayan bir ifade var." | |
| Oda (ziyaret) | Hata: oda açılamadı | "Bu odaya şu an girilemiyor. Sahibi odasını kapatmış olabilir." | |
| Oda (ziyaret) | 15–17 Oda izni | "Odan Arkadaşlara açık. Herkese açmak için veli onayı gerekir." | Yalnızca 15–17 |

## 15. Varsayımlar

1. **Zaman:** oyun günü 04:00 TR'dir (B2 §10.3), lig haftası Pazar 21:00 → Pazar 21:00'dir; sınırları sunucu saati belirler.
2. **Ders numaraları:** B4'ün listesi esas alınmıştır; görev XP ve Bayt değerleri ders sırasından bağımsızdır.
3. **Z katsayısı:** Ruhsat zincirinde konuma göre 1,25 / 1,50 / 2,00 (B4 Görev Atlası); zincir dışında 1,00 ya da 1,50.
4. **Lig:** puan B2 §5.3'teki gibi haftalık XP'dir; üç unvan grubu, asgari LP 100 ve tembel kova yerleşmesi B6 kararıdır; 1.000 DAU'da ≈34 kova (B2 §10.6).
5. **Moderasyon:** Haiku 5.5 liste fiyatıyla (0,10 $ / 0,50 $ MTok, önbellek okuma 0,01 $) mesaj başına ≈0,00003 $; DAU başına günde ≈20 mesaj (B7 §1.3); görüntü öncesi p95 ≤400 ms ulaşılabilir; kapasite B9'un 0,5 FTE → 1 FTE planıdır, ≈200 rapor/gün ≈0,6 FTE eder.
6. **KVKK ve çocuk güvenliği:** log süreleri B6 önerisidir; 5651 sayılı Kanun'daki 2026 değişikliğinden sonra erişim logu süresi (12 ay) ve çocuk güvenliği bildirimleri hukuk onayına tabidir; yaş duvarı yasal zorunluluk değil ürün güvenlik kararıdır.
7. **Sezon** v1.1 ile başlar (B9: Haziran 2027 sonu); ilk canlı sezon Yaz Kampı yuvasıdır (§4.4).
8. **Takvim:** Ramazan (8 Şubat–8 Mart 2027), bayramlar, MEB ve ÖSYM tarihleri Ekim 2026 itibarıyla yayımlanmış kaynaklardandır; LGS 2027 tarihi açıklanmamıştır; Kod Haftası 2027 tarihi B9'a göre H49'dur (6–12 Aralık).
9. **Üretim yükü:** yarı zamanlı sanatçı haftada 2,5 gün çalışır; etkinlik kozmetiğinin %60'ı yeniden renklendirmedir.
10. **Push:** Web Push; iOS'ta ana ekrana eklenmiş PWA gerekir (VİZYON §13).
11. **Çarpanlar:** Mesai ve Lonca çarpanları KANON temelinde ×1,0'dır (B2 §8.4); Lonca Görevi XP'si, B2 Ek A-3 onaylanana dek KANON görev XP'sidir.
12. **Ramazan modu:** ilk gün sorusu ve sabit 17:30–19:45 penceresi yeterli sayılmıştır; il bazlı iftar vakti v1.1 sonrasına bırakılır.
13. **Yol haritası:** MVP H1–H12 (Ocak–Mart 2027), v1.1 yayını Haziran 2027 sonu, v1.2 Eylül 2027'dir (B9); "v1.1 / v1.2" etiketleri bu takvimle okunur.
14. **Kod örnekleri** .NET SDK 10.0.300 ile derlenip denendi; üretim kodu B7'de birim testleriyle yeniden yazılır.

## 16. Açık Sorular

1. **Lig puanı = XP.** Sev. 10–11'de dersi biten oyuncu (B2 §11.5 bulgu 2) ligde sistematik geride kalır. Staj modu (B2 Ek A-1) onaylanmazsa lig, içerikten bağımsız bir puana (B2 Açık Soru 12: "haftalık yeni Mühür + görev") taşınmalı mı?
2. **Yaş eşiği ve yaş duvarı.** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.2: eşik 15, "genç" = 15–17, 13–14 MVP dışı.)* Hangisi olursa olsun 15–17 ↔ 18+ DM yasağı Karma loncayı ve mentor havuzunu küçültür; 16–17 için gevşetme düşünülür mü, hukuk ve çocuk güvenliği danışmanı onaylıyor mu?
3. **Sezon süresi.** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.3: iki takvim ayı = 8–9 hafta; B2 sezon satırı buna çekildi.)* İki takvim ayı (8–9 hafta) B2 §10.3'ün 8 haftasından farklıdır; kabul mü, 8 hafta sabit + aylık Perde mi?
4. **Hata Bildirimi havuzu (B5).** Otopark L1'in 8 mutasyonu, günde 3 dosya + 7 günlük tekrar yasağını (haftada 21 dosya) taşıyamaz: yasak 3 güne mi insin, farklı girdi tohumu "yeni dosya" mı sayılsın, mutasyon sayısı mı artsın?
5. **Lonca üyelik eşiği.** Sev. 6 (kohortlar için) mi, Sev. 12 (VİZYON'un yorumlanan hâli) mi?
6. **Hayalet Rakip.** Koşu kaydının rakip olarak kullanılması varsayılan açık olabilir mi (KVKK aydınlatma / rıza biçimi)?
7. **Kriz ve veli bildirimi.** Açık riskte veliye ve yetkili makama ulaşma yükümlülüğü ile ALO 183 / 112 metinleri hukukla doğrulanmalı.
8. **Log saklama.** Erişim logu 12 ay mı; sohbet için B7'nin 90 günü KVKK amaç sınırlaması açısından kısaltılmalı mı (30 gün yeter mi)?
9. **Saat dilimi.** Yurt dışı oyuncu için 04:00 TR sınırı kabul edilebilir mi, yılda bir kez kişisel sınır kaydırma eklensin mi?
10. **Seri yumuşatmaları.** Onarım Turu, Bayram koruması ve Seri Molası disiplini zayıflatır mı? İlk 1.000 oyuncuda A/B: seri ≥7 oranı ve D30.

## 17. Diğer Belgelere Bağımlılıklar

| Belge | Bu belgenin beklediği | Bölüm |
|---|---|---|
| **KANON / VİZYON** | Tüm sayı ve adlar aynen kullanıldı; Ek A önerileri sürüm kararı bekler | tümü |
| **B1** | Lonca Binası instance'ı (30) ve Kampüs turist modunda erişimi; Açık Ev ve İlan Panosu içeriği; Meydan Sorusu çan / çeşme sinyali; LED akışında Mahya Geceleri; Arena 60 seyirci; Podyum heykeli güncelleme saati; Oda izin modlarının yaş duvarıyla uyumu (B1 §16 soru 6'nın cevabı) | §1.3, §4.2–§4.3, §5.3, §9.2 |
| **B2** | Lig ödül tablosu ve **kova toplamı düzeltmesi (2.300 B)**; sezon süresi (8 hafta → takvim ayı); Müfettiş Günü (HB 3 → 5); Lonca bonusu, Lonca XP (Ek A-3, A-5); Staj modu (Ek A-1) ve lig / D30 etkisi; "İlk Alkış 10 B" turist modu istisnası | §4.4, §5.4, §6.3, §8.2 |
| **B3** | Haiku moderasyon istemi ve §7.2 JSON şeması; Günlük Tekrar'daki serbest cevaplı kart için kota kuralı (B3 §5.9'da tanımlı; bu belge turda ≤1 kart alır); akran inceleme AI rubriği; Kalfa Yardımı Haiku süzgeci; Kurul-kapalı metni (B3 §13 `kota_dolu`, bu belgede aynen); Kurul / Usta kanalından moderasyon kuyruğu girdileri (B3 §7.2) | §3.1, §7.2–§7.4, §9.3–§9.4 |
| **B4** | Ders listesi ve kimlikleri (`gorev-{ders}`, `sinav-{semt}`) alındı; Çarşı ve Liman görevleri B4 §3 Görev Atlası'ndan aynen; Atölyeler görev adları B4'ün isteğiyle bu belgede üretildi, Kampüs ve sonrası içerik hattında üretilecek; Günlük Tekrar B4 §8 ile hizalı (04:00, 1-3-7-21, altın, dondurma); ders içi "Mola Noktası" (B4'ten talep); Düello için ≥200 etiketli problem havuzu; Kalfa Köprüsü görevleri | §2.4, §3, §8.3, §9.1 |
| **B5** | İş Emri #1 içeriği ve kart durumları (B5 §3.1–§3.3); **Hata Bildirimi havuzu çelişkisi:** Otopark L1'de 8 mutasyon (B5 §3.11) ile günde 3 dosya + 7 gün tekrar yasağı (haftada 21 dosya) uyuşmaz; öneri: yasağı 3 güne indirmek ya da farklı girdi tohumunu "yeni dosya" saymak, ayrıca Büfe / Manav / Kargo mutasyon katalogları; HB puanı (30 / 40 / 30) ve 40 / 60 / 90 / 120 B sınıfları bu belgeyle aynı; En Hızlı Otopark için ölçüm olayları (Gereksinim Netleştirme bitişi, editör açılışı, 26 test geçişi); Lonca Projesi Challenge Spec'i; Düello problem biçimi | §2.2, §2.5, §5.6, §8.4 |
| **B7** | Kullanılan adlar B7 §5.3 ile aynıdır: `/v1/friends`, `/v1/friend-requests`, `/v1/invites/redeem` ve `/me`, `/v1/leagues/current`, `/v1/leaderboards/{board}` (weekly, kalicilik, en-hizli-otopark, en-kazancli; **kulup** panosu eklenmeli), `/v1/applause`, `/v1/visitor-books/…`, `/v1/reviews/daily` ve `/v1/reviews/streak-freezes`, `/v1/chat/connection-tickets`, `/dm`, `/reports`, `/v1/blocks`, `/v1/notifications`, `/v1/push-subscriptions`, `/v1/players/me/notification-preferences`. **Eksikler (v1.1):** lonca, düello, sezon / etkinlik, Onarım Turu, Seri Molası uç noktaları; zamanlanmış işler B7 §7.5 ile aynı (04:00 rollover, Pazar 21:00 `league-close`, Pazartesi 09:00 `pazar-rotation`, saat başı `meydan-question`), eklenecekler: Pazartesi 04:00 dondurma yenileme, Pazar 21:00 Lonca Görevi / Hafta Kartı kapanışı; tembel kova yerleşmesi (Redis); moderasyon basamakları B6'dadır (B7 §3.2 ile aynı); sohbet 90 gün ve kanıt kopyası 1 yıl (B7 §4.1) ile aynı; feature flag + kill-switch; durum sayfası; kohort kodu ve OTP IP sınırı; cihaz belirteci | §4, §7, §8, §10, §12 |
| **B8** | #16 ve #17 için B8 §6.16–§6.17 yazıldı (çevrimdışı, Kurul-kapalı ve Dolu metinleri bu belgeyle aynılaştırıldı); #22 ve #23 B8'de "LATE" bırakılmış, §8 ve §7 onlara kaynak olur; B8'de olmayan arayüzler: Onarım Turu, Bayram koruması, Seri Molası, Hafta Kartı, Kulüp sekmesi, hazır cümle çarkı, Yardım Masası; terfi / düşme bölgeleri için renkten bağımsız işaret; "makine ritmi" erişilebilirlik bayrağı | §3, §6, §8, §14 |
| **B9** | KPI hedefleri (D1 / D7 / D30 ≥%45 / ≥%20 / ≥%8, altın durak ≥%25); yol haritası: v1.1 yayını Haziran 2027 sonu (Sezon 1 = Yaz Kampı yuvası), v1.2 Eylül 2027 (Sezon 2); Misafir Modu (v1.1) ve Hour of Code (H49 = 6–12 Aralık 2027) Kod Haftası ile örtüşür; Ebeveyn Paneli (§8.2) ve 15 yaş eşiği önerisi (7578 sayılı Kanun); moderasyon insan kaynağı 0,5 FTE → 1 FTE planı (B6 yükü 1.000 DAU'da ≈0,6 FTE) | §1.3, §4.4, §7.3, §11, §12 |

## Ek A. Sabit Önerileri (KANON v2 adayları)

Onaylanana kadar KANON v1 geçerlidir; B6 yalnızca KANON'da bulunmayan ya da B2'nin varsayım olarak bıraktığı değerleri önerir.

| anahtar | KANON v1 değeri | önerilen değer | gerekçe |
|---|---|---|---|
| `OYUN_GUNU_SINIRI` | yok (B2 §10.3 varsayımı 04:00) | 04:00 TR; günlük sınırlar, seri, Alkış tavanı | Tek sınır; gece geç oynayan seriyi kaybetmez |
| `LIG_HAFTASI` | Pazar 21:00 kapanış (başlangıç tanımsız) | Pazar 21:00 → Pazar 21:00; yeni hafta aynı anda başlar | Lig, Lonca Görevi ve Hafta Kartı tek ritüel |
| `LIG_KOVA_EKSENI` | 30 kişilik kova (eksen tanımsız) | Kademe × unvan grubu (A Çırak–Kalfa, B Zanaatkâr–Mühendis, C Baş Mühendis+); tembel yerleşme; n<30'da ölçekli konum | B2 Açık Soru 12; grup içi XP/saat farkı ≤1,33× |
| `LIG_ASGARI_LP` | yok | 100 XP (ödül ve terfi için) | Seyrek kovada boş ödülü önler |
| `LIG_ISINMA` | yok | Kayıttan kapanışa <48 saat ise ödül ve terfi yok | İlk hafta adaletsizliği |
| `SERI_ONARIM_TURU` | yok | Kırılmadan sonra 48 saat içinde 10 soru | Kırılma kaynaklı terk; parasız |
| `SERI_BAYRAM_KORUMASI` | yok | Resmî bayram günlerinde otomatik, hak tüketmeyen dondurma | Aile zamanı; yılda ≈9–10 gün |
| `SERI_MOLASI` | yok | Yılda 2 kez, en çok 7 gün | Sınav ve hastalık |
| `SEZON_SURESI` | yok (B2 §10.3: 8 hafta) | İki takvim ayı (8–9 hafta); ayın son Pazar 21:00'i | Altı sezon, her biri takvim çapalı |
| `SEZON_YOLU` | yok | 30 basamak × 150 SP; tek ücretsiz şerit; 8 × 125 B; Çip → SP yok | B2 §10.3 (1.000 B); pay-to-learn yok |
| `LONCA_UYELIK_MIN_SEV` | yok (kurma Sev. 12) | 6 | Kohortların en ileri üyesi Sev. 12'ye varınca diğerleri Kalfa |
| `LONCA_KAPASITE` | 5–30 üye | Tohum 1–4; LS1 10 → LS5 30 (600 / 1.800 / 4.000 / 8.000 LoP) | KANON aralığını işletir |
| `LONCA_GOREV_KURALI` | tanımsız | Ekip Hedefi 14 × aktif üye; üye başına 20 LoP tavanı; katkı eşiği 8 LoP | Yük bindirmeyi önler |
| `YAS_DUVARI` | yok | 15–17 ↔ 18+ DM yok; 18+ → 15–17 istek yok; Oda ve mentor duvarı | Çocuk güvenliği |
| `MEYDAN_SORUSU_ARALIGI` | saat başı | 08:00–23:00 (16 soru/gün), 60 sn, 3 zorluk varyantı | Uyku saatleri, adalet |
| `DUELLO_HAYALET_RAKIP` | yok | 10 dk içinde eş yoksa Elo ≤200 kayıtlı koşu | Küçük nüfusta anında düello |
| `DUELLO_BERABERE` | yok | Fark ≤2 sn → 8 B + 25 XP | Kazanana yarım ödül |
| `BILDIRIM_BUTCESI` | yok | 18+: günde 2, 09:00–22:30; 15–17: günde 1, 15:30–20:30 (hafta sonu / tatil 10:00) | Dikkat korunur |
| `CEZA_BASAMAKLARI` | yok | Ç0–Ç6; ceza yalnızca sosyal yüzey; sönümlenme 90 gün | Öğrenme asla kapanmaz |
| `LOG_SAKLAMA` | yok | §7.6 tablosu (sohbet 90 gün — B7 ile uyumlu —, ceza kaydı 2 yıl, erişim logu 12 ay) | KVKK amaç sınırlaması |
| `ALKIS_ILK_BONUS` | B2 §5.2: İlk Alkış 10 B | Turist modu Alkışı sayılmaz; bonus tapu sonrası | Onboarding'in 300 B hesabı bozulmaz |

---

**Revizyon Notu (3 Kasım).** KANON v2 (§12) uyumu: yaş eşiği 13 → 15 (`min_kayit_yasi=15`; 50 yerde 13–17 → 15–17); 13–14 yolu MVP dışı; veli onayı akışı = onaya kadar serbest metin, DM, ziyaret kabulü, Vitrin ve Çip harcaması kapalı (B9 §8.2); 15–17 Oda 'Herkese açık' hukuk teyidine kadar kapalı; sezon 8–9 hafta (B6 sahibi, B2 çekildi); Ek A satırlarının tümü KANON §12.3'te kabul edildi. Ayrıntı: `_KANON-v2-degisiklikler.md`.
