# B2 — İlerleme & Ekonomi (KodKent)

| Alan | Değer |
|---|---|
| Belge id | **B2** |
| Sürüm | v1 (2026-11-02) |
| Sahibi | Oyun ekonomisti / sistem tasarımcısı (F2P ekonomi dengeleme) |
| Bağlayıcı kaynaklar | `KANON.md` v1 (sayılar ve adlar), `A-vizyon-FINAL.md` (yön), `00-fikir.md` (SABİT kararlar) |
| Kapsam | XP eğrisi ve seviye tablosu, unvanlar ve seviye ödülleri, XP kaynakları, Bayt muslukları ve giderleri, 20 işletmenin ekonomisi, pasif gelir formülü ve hasat, kozmetik ve Çip fiyatlandırması, enflasyon kontrolü, 30 günlük üç profilli simülasyon, pacing hedefleri |
| Kural | KANON'daki her sayı bu belgede aynen kullanılır. Değiştirilmesi önerilen sabitler gövdede "**B2 önerisi**" etiketiyle ayrı tutulur ve Ek A'da toplanır; onaylanana kadar KANON değeri geçerlidir. |

**Terim notu.** Bu belgede **Tier** yalnızca semt zorluk katmanıdır (T1–T4, KANON §10); işletmenin kendi kademesi **L** ile yazılır (L1–L5). Görev metnindeki "işletme Tier geçişi" ifadesi bu belgede **işletme seviye yükseltmesi (L2–L5)** olarak ele alınır; "otopark Tier 1 tamamlanma" ifadesi ise Otopark L1'in Açılış'ına denk gelir.

---

## 0. Yönetici özeti

1. **XP eğrisi KANON'dur:** `XP(L) = yuvarla10(80 × L^1,35)`, tavan 60, `Toplam(60) = 503.680`. Tam 1–60 tablosu §2.2'de; etkin oyun saati toplamı **≈292 saat** (içerik mevcutken). Normal oyuncu (35 dk/gün) için Sev. 6 ≈ 5. gün, Sev. 12 ≈ 22. gün, Sev. 40 ≈ 233. gün, Sev. 60 ≈ 500. gün; yoğun oyuncu (90 dk) tavana ≈194 günde ulaşır.
2. **Seviye atlamak Bayt ve Çip vermez.** Seviye Hediyesi her zaman kozmetik ya da kapasitedir (dolap slotu, eşya kapasitesi, emote, tabela rengi); unvan terfileri Nişan rozeti ve tören verir. Böylece "ilk Bayt 20. dakikada görevden gelir" ve "Bayt'ın %85'i çalışan koddan" ilkeleri bozulmaz.
3. **XP kaynakları KANON §3.3'tür;** Kurul puanı → XP eşlemesi `XP = taban × puan/100` (≥70'te en az %50, denediyse en az 5, 85+ ×1,2, 2. deneme ×0,8) formülü ve 13 satırlık örnek tablosuyla (§4.2) sabitlenmiştir. Günlük XP tavanı **yoktur**; azalan getiri kaynak başına sınırlarla kurulur (tekrar 0 XP, Hata Bildirimi 3/gün, Günlük Tekrar 1/gün, kod okuma 3/gün, Ders XP tavanı 118).
4. **Bayt musluklarının omurgası işletme geliridir:** Otopark L1 ≈220 B/gün, kasa 8 saat (≈73 B), 3 toplama = tam gelir. Giderlerin omurgası tapu ve yükseltmedir (toplam katalog 487.500 B tapu + 57 yükseltme adımı). Bakım, kira, vergi **yoktur** (KANON); yerine gönüllü ve kozmetik lavabolar tasarlanmıştır.
5. **20 işletmenin tamamı için** fiyat, L1–L5 günlük ve saatlik gelir, kasa tavanı ve geri ödeme süresi tablolanmıştır (§7.1). Tasarım kuralı: L1 geliri = fiyat ÷ tier geri ödeme hedefi (T1 1,4–2,4 gün, T2 3–5,7, T3 6–8,5, T4 9,4–12); her L ×1,6.
6. **Pasif gelir formülü** (§8): `Günlük B = min(oyuncuKoduTL, referansTL) ÷ 10 × Durum × Mesai × Lonca`; planlama eşdeğeri `TemelGelir × 1,6^(L−1)`. Mesai (×1,15, yalnızca öğrenme eylemi yapılan gün) ve Lonca (en çok ×1,10, v1.1) **B2 önerisidir**; KANON temelinde ikisi de ×1,0'dır.
7. **Kozmetik:** Sıradan 30–120 B, Şık 150–400 B, Nadir 450–800 B (haftalık rotasyon, numaralı seri), Premium yalnızca Çip (set 100 Çip ≈ 59,99 TL), Nişan satılmaz. Çip paketleri 100 / 260 / 560 / 1.200 Çip = 59,99 / 149,99 / 299,99 / 599,99 TL; Bayt hiçbir yoldan satın alınamaz, Çip Bayt'a dönmez.
8. **Simülasyon bulgusu 1 — Kalfa XP duvarı:** KANON slot tavanı (`1 + ⌊seviye/6⌋`) ile normal oyuncu 24. günde tüm Çarşı + Liman derslerini bitirip Sev. 10'da kalır; 12. seviyeye (Atölyeler) ulaşmak için ~45 gün daha yalnızca Hata Bildirimi ve Günlük Tekrar oynar. Yoğun oyuncu aynı duvara 8. günde çarpar ve 20 gün bekler. Sebep: slot tavanı, Liman'ın dört işletmesinin açılış/yükseltme XP'sini (≈3.000 XP) ve Bayt lavabolarını (10.100 B) kilitler.
9. **Simülasyon bulgusu 2 — lavabo açığı:** 30 günde gider/kaynak oranı hafif 0,48, normal 0,33, yoğun 0,33; hedef 0,7–0,9. Normal oyuncu 30. günde 13.672 B harcanamayan bakiyeyle oturur. Çözüm paketi: işletme içi dekorasyon, Nadir rotasyonu, Büyük Kasa, Belediye Projeleri (§6.3, §10.5).
10. **En önemli iki öneri (Ek A):** (a) **Staj modu** — slotu olmayan oyuncu, Ruhsat'ını aldığı işletmenin İş Emri'ni Akademi Atölyesi'nde kodlayıp açılış XP'sini alır, gelir almaz; tapu alınınca işletme anında Açık olur. Slot tavanı ve fiyat merdiveni korunur, XP duvarı kalkar (normal oyuncu Sev. 12'ye 45 yerine 28 günde). (b) **Geç oyun XP arzı:** KANON'un tekrarlanabilir kaynakları Sev. 25+ bantlarını karşılamıyor (Mühendis bandı normal oyuncuda 187 gün, 171'i dersiz); Kod Düellosu'nun v1.1'de tier'a endeksli XP ile gelmesi ve Lonca görevi XP'si şarttır; eğri alternatifleri Açık Sorular'da sayısal olarak verilmiştir.

---

## 1. Ekonominin on ilkesi

1. **Öğrenmek XP, yapmak Bayt getirir** (A §7). Ders Bayt vermez; Bayt veren her eylemin arkasında çalışan kod ya da bir öğrenme eylemi vardır. Giriş takvimi yoktur.
2. **Pay-to-learn yoktur** (SABİT). Ders, ipucu, test, Savunma hakkı, sandbox önceliği, kasa tavanı, Ruhsat, işletme, XP ve Bayt hiçbir zaman Çip'le ya da TL ile alınamaz. İpucu merdiveni (Pusula → Fener → Taslak → Örnek) ücretsiz ve sınırsızdır; bu belgede ipucunun fiyatı **0 B**'dir ve lavabo listesinde yer almaz.
3. **Bayt satın alınamaz, transfer edilemez** (KANON §1, §4). Hediye, ticaret, düello bahsi, ikinci el işletme piyasası yoktur. Bu, RMT kapısını kapatır ve 15+ kitlede kumar benzeri mekaniği dışarıda bırakır.
4. **Cezasız fren.** Bakım, kira, bozulma, vergi yoktur. Enflasyon dört yapısal sınırla (kasa tavanı, slot tavanı, referans tavanı, tier'e endeksli fiyatlar) ve çekici lavabolarla kontrol edilir; kayıp kaygısı motivasyon aracı değildir.
5. **AI gelire dokunmaz.** İşletme geliri oyuncunun derlenmiş kodunun sentetik trafikte ürettiği TL'dir, referans çözümle tavanlanır. Kurul'un puanı yalnızca XP'yi etkiler.
6. **Kazanılan gösterilir, satın alınan süslenir.** Nişan kademesi Bayt'la bile alınamaz; Premium (Çip) statik ve şıktır, bilgi iddiası taşımaz.
7. **Bir sonraki tapu = o evredeki 3–5 günlük toplam gelir** (A §8). Fiyat merdiveni bu kurala göre doğrulanır (§7.2).
8. **Zamanlayıcı kasada durur, derste değil.** Bekleme yalnızca gelire uygulanır; 8 saatlik kasa tek zamanlayıcıdır.
9. **Her sayı ayarlanabilir, hiçbiri geriye dönük değil.** Ekonomi panosu (§10.5) fiyat ve ödülleri ileriye dönük ayarlar; kazanılmış Bayt ve XP asla geri alınmaz.
10. **Simülasyon önce, lansman sonra.** H6'daki 10.000 bot simülasyonu bu belgenin tablolarını girdi olarak kullanır; §11'deki üç profil onun el yapımı ön çalışmasıdır.

---

## 2. XP eğrisi ve seviye tablosu

### 2.1 Formül

KANON §3.2:

- Seviye L'den L+1'e geçiş: **`XP(L) = yuvarla10(80 × L^1,35)`**
- Seviye L'ye ulaşmak için toplam: **`Toplam(L) = Σ XP(k), k = 1..L−1`**; `Toplam(60) = 503.680`
- Tavan **60**; Efsane unvanı Sev. 60 **ve** en az 10 Mentor kilometre taşı ister (v1.2).

Eğrinin üssü 1,35, erken seviyeleri hızlı (Sev. 2 14. dakikada, Sev. 3 ilk oturumun sonunda), orta seviyeleri semt ritmine (6, 12, 18, 25, 32, 40) oturan, geç seviyeleri uzun bir prestij bandı yapan bir eğridir. Her seviye bir öncekinden ortalama %4–7 daha pahalıdır; 40–59 bandı tek başına toplam XP'nin %62'sidir (311.350 / 503.680).

```csharp
public static class XpEgrisi
{
    public const int Tavan = 60;

    // L -> L+1 için gereken XP (KANON §3.2)
    public static int SonrakiSeviyeXp(int seviye)
        => (int)Math.Round(80 * Math.Pow(seviye, 1.35) / 10.0, MidpointRounding.AwayFromZero) * 10;

    // Seviye L'ye ulaşmak için toplam XP
    public static int ToplamXp(int seviye)
    {
        int t = 0;
        for (int k = 1; k < seviye; k++) t += SonrakiSeviyeXp(k);
        return t;
    }

    // Toplam XP'den seviye (tavan 60)
    public static int Seviye(long toplamXp)
    {
        int L = 1;
        while (L < Tavan && toplamXp >= ToplamXp(L + 1)) L++;
        return L;
    }

    // Eşzamanlı işletme sayısı (KANON §4); her türden 1
    public static int EszamanliIsletme(int seviye) => 1 + seviye / 6;
}
```

Sunucu tarafında `Toplam(L)` 60 elemanlık sabit bir dizi olarak önbelleğe alınır; seviye her XP olayında bu diziyle O(log n) bulunur. XP tam sayıdır, negatif XP olayı yoktur (A ilke 9: XP geri alınmaz).

### 2.2 Seviye tablosu 1–60

Tahmini süre, §2.3'teki bant bazlı etkin XP/saat varsayımıyla hesaplanmıştır ve **içerik mevcutken** geçerlidir; takvim günü karşılıkları §2.3 ve §11'dedir. "Slot" sütunu KANON'un eşzamanlı işletme sayısıdır. Açılan içerik sütununda semt ve işletme eşikleri KANON §2.1 ve §5'ten, Seviye Hediyesi satırları §3.2'deki kuraldan gelir.

| Sev. | XP(L) (L→L+1) | Toplam(L) | Bu seviye (saat) | Kümülatif (saat) | Unvan | Slot | Açılan içerik / seviye hediyesi |
|---|---|---|---|---|---|---|---|
| 1 | 80 | 0 | 0,1 | 0,0 | Çırak | 1 | Çarşı, Akademi (Defne), Ders 1.1; HUD: XP çubuğu + Bayt |
| 2 | 200 | 80 | 0,3 | 0,1 | Çırak | 1 | Oda (Stüdyo 6×6, 25 eşya), Bloklar; Pazar tek raf |
| 3 | 350 | 280 | 0,5 | 0,4 | Çırak | 1 | Otopark tapusu (Ruhsat 3/3 + 300 B); Şehir Haritası tam |
| 4 | 520 | 630 | 0,8 | 1,0 | Çırak | 1 | Büfe eşiği; tabela yazısı özelleştirme (150 B) |
| 5 | 700 | 1.150 | 1,1 | 1,8 | Çırak | 1 | Manav eşiği; Pazar Nadir rafı; emote çarkı +2 |
| 6 | 900 | 1.850 | 1,1 | 2,8 | Kalfa | 2 | KALFA · Liman (Çarşı Sınavı ile) · 2. işletme slotu · Kargo Deposu eşiği |
| 7 | 1.110 | 2.750 | 1,3 | 3,9 | Kalfa | 2 | Dolap +4 slot; arkadaş listesi 60 |
| 8 | 1.330 | 3.860 | 1,6 | 5,2 | Kalfa | 2 | Balık Hali eşiği; neon tabela (300–600 B) |
| 9 | 1.550 | 5.190 | 1,8 | 6,8 | Kalfa | 2 | Oto Yıkama eşiği; Vitrin açma hakkı (L2+ işletme) |
| 10 | 1.790 | 6.740 | 2,1 | 8,6 | Kalfa | 2 | Gümrük eşiği; Daire (8×8, 2.000 B) |
| 11 | 2.040 | 8.530 | 2,4 | 10,7 | Kalfa | 2 | İşletme adı değiştirme (200 B); emote +2 |
| 12 | 2.290 | 10.570 | 2,3 | 13,1 | Zanaatkâr | 3 | ZANAATKÂR · Atölyeler (Liman Sınavı) · 3. slot · Oto Tamirhane · Lonca kurma (v1.1) · "Hepsini Topla" |
| 13 | 2.550 | 12.860 | 2,5 | 15,4 | Zanaatkâr | 3 | Şık kıyafet rafı tam; oda eşya kapasitesi 35 |
| 14 | 2.820 | 15.410 | 2,8 | 17,9 | Zanaatkâr | 3 | Mobilya Atölyesi eşiği |
| 15 | 3.100 | 18.230 | 3,1 | 20,8 | Zanaatkâr | 3 | Vitrin'e not bırakma (v1.1); LED pano mesajı (haftada 1) |
| 16 | 3.380 | 21.330 | 3,4 | 23,9 | Zanaatkâr | 3 | Trafo Merkezi eşiği |
| 17 | 3.670 | 24.710 | 3,7 | 27,2 | Zanaatkâr | 3 | Podyum kostümü (Şık) hediye |
| 18 | 3.960 | 28.380 | 3,2 | 30,9 | Mühendis | 4 | MÜHENDİS · Kampüs (Atölye Sınavı) · 4. slot · Kütüphane · Kalfa Yardımı (v1.2) · Büyük Kasa eşyası (B2 önerisi) |
| 19 | 4.260 | 32.340 | 3,4 | 34,1 | Mühendis | 4 | Oda eşya kapasitesi 45 |
| 20 | 4.570 | 36.600 | 3,7 | 37,5 | Mühendis | 4 | Sinema eşiği; Çatı Katı (6.000 B) |
| 21 | 4.880 | 41.170 | 3,9 | 41,1 | Mühendis | 4 | Dolap +4; ikinci emote çarkı |
| 22 | 5.190 | 46.050 | 4,2 | 45,1 | Mühendis | 4 | Akran incelemesi hakkı (v1.2) |
| 23 | 5.510 | 51.240 | 4,4 | 49,2 | Mühendis | 4 | Haber Ajansı eşiği |
| 24 | 5.840 | 56.750 | 4,7 | 53,6 | Mühendis | 5 | 5. işletme slotu |
| 25 | 6.170 | 62.590 | 4,1 | 58,3 | Baş Mühendis | 5 | BAŞ MÜHENDİS · Finans Bölgesi (Kampüs Sınavı) · Banka |
| 26 | 6.510 | 68.760 | 4,3 | 62,4 | Baş Mühendis | 5 | Neon palet II (Bayt) |
| 27 | 6.850 | 75.270 | 4,6 | 66,7 | Baş Mühendis | 5 | Oda eşya kapasitesi 60 |
| 28 | 7.190 | 82.120 | 4,8 | 71,3 | Baş Mühendis | 5 | Sigorta eşiği |
| 29 | 7.540 | 89.310 | 5,0 | 76,1 | Baş Mühendis | 5 | Tabela animasyonu (Şık, 600 B) |
| 30 | 7.890 | 96.850 | 5,3 | 81,1 | Baş Mühendis | 6 | Borsa Panosu eşiği; 6. slot |
| 31 | 8.250 | 104.740 | 5,5 | 86,4 | Baş Mühendis | 6 | Lonca projesi lideri olabilme (v2) |
| 32 | 8.610 | 112.990 | 4,8 | 91,9 | Mimar | 6 | MİMAR · Veri Vadisi (Finans Sınavı) · Hastane Kayıt |
| 33 | 8.980 | 121.600 | 5,0 | 96,7 | Mimar | 6 | Dolap +6 |
| 34 | 9.350 | 130.580 | 5,2 | 101,7 | Mimar | 6 | Oda: ikinci kat eşyaları |
| 35 | 9.720 | 139.930 | 5,4 | 106,8 | Mimar | 6 | Profil arka planı (Şık) |
| 36 | 10.090 | 149.650 | 5,6 | 112,2 | Mimar | 7 | Otel eşiği; 7. slot |
| 37 | 10.480 | 159.740 | 5,8 | 117,9 | Mimar | 7 | Oda eşya kapasitesi 80 |
| 38 | 10.860 | 170.220 | 6,0 | 123,7 | Mimar | 7 | Emote çarkı III |
| 39 | 11.250 | 181.080 | 6,2 | 129,7 | Mimar | 7 | Mimar ceketi (Nişan, unvan rozeti) |
| 40 | 11.640 | 192.330 | 5,8 | 136,0 | Şehir Mimarı | 7 | ŞEHİR MİMARI · Bulut Tepesi (Veri Sınavı) · Yemek Sipariş Platformu |
| 41 | 12.030 | 203.970 | 6,0 | 141,8 | Şehir Mimarı | 7 | Dolap +6 |
| 42 | 12.430 | 216.000 | 6,2 | 147,8 | Şehir Mimarı | 8 | 8. işletme slotu |
| 43 | 12.830 | 228.430 | 6,4 | 154,0 | Şehir Mimarı | 8 | LED pano mesajı (haftada 3) |
| 44 | 13.240 | 241.260 | 6,6 | 160,4 | Şehir Mimarı | 8 | Oda eşya kapasitesi 100 |
| 45 | 13.640 | 254.500 | 6,8 | 167,0 | Şehir Mimarı | 8 | Şehir Uygulaması (capstone) eşiği |
| 46 | 14.050 | 268.140 | 7,0 | 173,9 | Şehir Mimarı | 8 | Neon palet III |
| 47 | 14.470 | 282.190 | 7,2 | 180,9 | Şehir Mimarı | 8 | Profil çerçevesi (Şık) |
| 48 | 14.890 | 296.660 | 7,4 | 188,1 | Şehir Mimarı | 9 | 9. işletme slotu |
| 49 | 15.310 | 311.550 | 7,7 | 195,6 | Şehir Mimarı | 9 | Emote çarkı IV |
| 50 | 15.730 | 326.860 | 7,9 | 203,2 | Şehir Mimarı | 9 | Şehir manzarası oda penceresi (Şık) |
| 51 | 16.160 | 342.590 | 8,1 | 211,1 | Şehir Mimarı | 9 | Dolap +6 |
| 52 | 16.580 | 358.750 | 8,3 | 219,2 | Şehir Mimarı | 9 | Oda eşya kapasitesi 120 |
| 53 | 17.020 | 375.330 | 8,5 | 227,5 | Şehir Mimarı | 9 | Mentor rozeti vitrini (v1.2) |
| 54 | 17.450 | 392.350 | 8,7 | 236,0 | Şehir Mimarı | 10 | 10. işletme slotu |
| 55 | 17.890 | 409.800 | 8,9 | 244,7 | Şehir Mimarı | 10 | Tabela: altın çerçeve (Şık, 600 B) |
| 56 | 18.330 | 427.690 | 9,2 | 253,6 | Şehir Mimarı | 10 | Oda: çatı bahçesi eşyaları |
| 57 | 18.770 | 446.020 | 9,4 | 262,8 | Şehir Mimarı | 10 | Emote çarkı V |
| 58 | 19.220 | 464.790 | 9,6 | 272,2 | Şehir Mimarı | 10 | Dolap +8 |
| 59 | 19.670 | 484.010 | 9,8 | 281,8 | Şehir Mimarı | 10 | Şehir Mimarı pelerini (Nişan, unvan rozeti) |
| 60 | — | 503.680 | — | 291,6 | Efsane | 11 | EFSANE (10 Mentor kilometre taşı ile) · 11. slot · Efsane heykeli Meydan'da (Nişan) |

Tablonun KANON §3.2'de verilen satırları (1–10, 12, 18, 25, 32, 40, 60) birebir aynıdır; ara satırlar aynı formülle üretilmiştir.

### 2.3 Süre varsayımları ve kilometre taşları

"Etkin XP/saat", oyuncunun o bantta tipik bir saat içinde ürettiği XP'dir; KANON §3.3'teki değerler ve A §3'teki sürelerden türetilmiştir: T1 dersi 100 XP / 8 dk (750 XP/sa), T1 görevi 60 XP + ortalama 10 XP bonus / 6 dk (700 XP/sa), Hata Bildirimi 40 XP / 4 dk (600 XP/sa), işletme açılışı 300 XP / 25–30 dk (≈650 XP/sa), Günlük Tekrar 15 XP / 3 dk. Bonuslar (parlak ×1,2, Berrak Zihin +%15, kod incelemesi 10–30) karışımı yaklaşık %10 yukarı çeker. Tier yükseldikçe XP değerleri sürelerden hızlı büyür (T4 dersi 400 XP / 14 dk ≈ 1.700 XP/sa; T4 açılışı 2.000 XP / 60 dk).

| Bant | Seviye | Etkin XP/saat | Dayanak |
|---|---|---|---|
| Çırak | 1–5 | 650 | T1 ders/görev/HB karışımı, Otopark açılışı |
| Kalfa | 6–11 | 850 | T1–T2 karışık Liman dersleri (100/180), görev 60/100 |
| Zanaatkâr | 12–17 | 1.000 | T2 ders 180 / 10 dk, görev 100 / 8 dk, açılış 600 / 35 dk |
| Mühendis | 18–24 | 1.250 | T2–T3 karışımı |
| Baş Mühendis | 25–31 | 1.500 | T3 ders 280 / 12 dk, görev 160, HB 100, açılış 1.200 / 50 dk |
| Mimar | 32–39 | 1.800 | T3–T4 karışımı |
| Şehir Mimarı | 40–59 | 2.000 | T4 ders 400 / 14 dk, görev 250, HB 150, açılış 2.000 / 60 dk, lonca ve düello |

Bu oranlarla kümülatif etkin süre Sev. 60'ta **291,6 saat**tir. Günlük oyun süresine bölündüğünde takvim karşılıkları şöyledir (hafif profil haftada 6 × 10 dk + 1 × 30 dk masaüstü oturumu ≈ 0,21 sa/gün; normal 35 dk ≈ 0,58 sa/gün; yoğun 90 dk = 1,5 sa/gün):

| Sev. | Toplam XP | Etkin saat | Hafif (0,21 sa/gün) | Normal (0,58 sa/gün) | Yoğun (1,5 sa/gün) | A'daki "tipik gün" |
|---|---|---|---|---|---|---|
| 3 | 280 | 0,4 | 2 | 1 | 0 | 1 |
| 6 | 1.850 | 2,8 | 13 | 5 | 2 | 3–4 |
| 10 | 6.740 | 8,6 | 40 | 15 | 6 | — |
| 12 | 10.570 | 13,1 | 61 | 22 | 9 | ~20 |
| 18 | 28.380 | 30,9 | 144 | 53 | 21 | ~50 |
| 25 | 62.590 | 58,3 | 272 | 100 | 39 | ~90 |
| 32 | 112.990 | 91,9 | 429 | 158 | 61 | ~125 |
| 40 | 192.330 | 136,0 | 635 | 233 | 91 | ~170 |
| 50 | 326.860 | 203,2 | 950 | 349 | 135 | — |
| 60 | 503.680 | 291,6 | 1.363 | 500 | 194 | ~315 |

Sev. 25'e kadar B2 tahmini A'nın "tipik gün" sütunuyla örtüşür; sonrasında ayrışır: A, "günde 20–40 dakikayla ~6 ayda Tier 4, ~1 yılda tavan" der; B2'ye göre bu ancak ortalama ≈48 dk/gün ile ya da Sev. 40+ bandında XP arzının %40 artırılmasıyla tutar. Üstelik bu tablo içerik dolu saat varsayar; §4.5 KANON XP kaynaklarının geç bantları fiilen karşılamadığını gösterir. İki noktayı Açık Sorular'a taşıdık (§14, soru 1–2).

---

## 3. Unvan bantları ve seviye atlama ödülleri

### 3.1 Unvanlar (KANON §3.1)

| Seviye | Unvan | Semt | İsim rengi (tabela ve balon) | Terfi anında |
|---|---|---|---|---|
| 1–5 | **Çırak** | Çarşı | Gri | Giriş sineması; Defne karşılar |
| 6–11 | **Kalfa** | Liman | Mavi | Kalfa Töreni: LED pano duyurusu, "Kalfa Yakası" (Nişan), 2. işletme slotu, Liman kapısı (Çarşı Sınavı sonrası) |
| 12–17 | **Zanaatkâr** | Atölyeler | Yeşil | "Zanaatkâr Önlüğü" (Nişan), 3. slot, lonca kurma hakkı (v1.1), "Hepsini Topla" |
| 18–24 | **Mühendis** | Kampüs | Turuncu | "Mühendis Baretı" (Nişan), 4. slot, Kalfa Yardımı verebilme (v1.2) |
| 25–31 | **Baş Mühendis** | Finans Bölgesi | Kırmızı | "Baş Mühendis Rozeti" (Nişan), Finans kapısı |
| 32–39 | **Mimar** | Veri Vadisi | Mor | "Mimar Ceketi" Sev. 39'da (Nişan), 6.–7. slot |
| 40–59 | **Şehir Mimarı** | Bulut Tepesi | Altın | "Şehir Mimarı Pelerini" Sev. 59'da (Nişan), capstone kapısı |
| 60 | **Efsane** | — | Animasyonlu altın | Sev. 60 **ve** 10 Mentor kilometre taşı; Meydan'da heykel (Nişan), unvan tamamlanana kadar "Şehir Mimarı (Efsane adayı)" yazar |

"Usta" yalnızca NPC öğretmen unvanıdır; oyuncu unvanı olarak hiçbir yerde kullanılmaz. Unvan, tabelada ("Sahibi: @ayse_kod — Kalfa, Sev. 8"), sohbet balonunda, profilde ve ziyaretçi defterinde görünür; bu görünürlük unvanın tek "gücüdür". Unvanlar oyun mekaniği avantajı vermez: Kalfa'nın otoparkı Çırak'ınkinden fazla kazanmaz, aynı kod aynı geliri üretir.

### 3.2 Seviye Hediyesi — kural

Her seviye atlayışında oyuncu bir **Seviye Hediyesi kartı** görür. Kural kesindir: **hediye hiçbir zaman Bayt, Çip ya da XP değildir.** Gerekçe üçlüdür: (1) KANON "ilk Bayt ≈20. dakikada Meydan Saati görevinden (40 B)" der; Sev. 2 14. dakikada geldiği için seviye Bayt'ı bu sabiti bozar; (2) A'nın "Bayt'ın %85'i çalışan koddan" dağılımı seviye primiyle sulanır; (3) seviye kazanmak zaten öğrenmenin sonucudur, ödülü sosyal görünürlük olmalıdır. Hediye türü seviye numarasının 5'e bölümünden kalana göre dönüşümlü seçilir, kilometre taşı seviyeleri (6, 12, 18, 24, 25, 30, 32, 36, 40, 42, 45, 48, 54, 60) ayrıca yapısal açılış taşır:

| Kalan (L mod 5) | Hediye | Örnek |
|---|---|---|
| 1 | Dolap slotu (+2 / +4 / +6 / +8 bantla büyür) | Sev. 11: +4 dolap slotu |
| 2 | Emote (çark slotu + 1 yeni emote) | Sev. 22: "alkış tutma" |
| 3 | Oda eşya kapasitesi (+3 → +5 → +10 bantla büyür) | Sev. 13: kapasite 25 → 35 |
| 4 | Kıyafet parçası (1–11 Sıradan, 12–39 Şık, 40+ Şık animasyonlu) | Sev. 17: podyum kostümü |
| 0 | Tabela / neon rengi ya da profil çerçevesi | Sev. 10: ikinci tabela rengi |

Seviye atlama anı: XP çubuğu dolar, "Sev. N" rozeti 1,5 saniye büyür, hediye kartı açılır; Meydan'daysa avatarın üstünde 3 saniyelik ışık halkası (sosyal görünürlük). Enerji, can ya da yenilenen hak yoktur; seviye atlamak hiçbir şeyi "doldurmaz".

### 3.3 Bant terfisi (Unvan Töreni)

Bir bandın ilk seviyesine (6, 12, 18, 25, 32, 40, 60) ulaşmak 20 saniyelik bir törendir: Usta'nın tebrik balonu, LED panoda "@ad artık Kalfa" akışı, unvan Nişan'ı (Rütbe Rafı'nda sergilenir, Dolap'ta giyilir), tabela ve isim rengi güncellenir, Metro Haritası'nda yeni hat belirir (kilitli durak renginde; semt ancak Semt Sınavı'yla açılır). Terfide Bayt verilmez; semt geçişinin Bayt'ı Semt Sınavı ödülündedir (500 B + 10 Çip + 200 XP, KANON §4).

---

## 4. XP kaynakları

### 4.1 Kaynak tablosu

KANON §3.3'ün değerleri; süre, XP/dakika ve günlük sınır sütunları B2'nin eklemesidir.

| Kaynak | T1 | T2 | T3 | T4 | Tipik süre | XP/dk (T1) | Günlük sınır | Not |
|---|---|---|---|---|---|---|---|---|
| Ders (toplam: kartlar 10 + 3 Usta sorusu) | **100** | 180 | 280 | 400 | 6–10 dk | ≈12 | İçerikle sınırlı; tekrar 0 | Ders 1.1 = 100 XP (tutorial); gerçekleşen = 10 + Σ soru XP |
| AI sorusu (Kavram / Çıktı Tahmini / Hata Avı) | 30 taban | 54 | 84 | 120 | 1–2 dk | 15–25 | Kota 30 AI puanlaması/gün (XP gecikir, kaybolmaz) | §4.2 eşlemesi |
| Görev (ilk tamamlama) | 60 | 100 | 160 | 250 | 3–8 dk | ≈10 | Tekrar 0 | + Berrak Zihin %15, kod incelemesi 10–30 |
| İşletme açılışı (Savunma dâhil) | 300 | 600 | 1.200 | 2.000 | 15–60 dk | ≈11 | İşletme başına 1; Deneme açılışı %50, Savunma geçince kalan %50 | Staj modunda da ödenir (B2 önerisi, §7.4) |
| İşletme yükseltme L2 / L3 / L4 / L5 | 150 / 250 / 400 / 600 | aynı | aynı | aynı | 15–40 dk | ≈8 | İşletme × seviye başına 1 | Tier'dan bağımsız (KANON) |
| Günlük Tekrar | 15 | 15 | 15 | 15 | 3 dk | 5 | Günde 1 | Seri sadece Bayt'ı çarpar (×1,5), XP sabit |
| Semt Sınavı | 200 | 200 | 200 | 200 | 20 dk | 10 | Semt başına 1 (ilk geçiş) | Başarısız tekrar: 0 XP, bekleme yok |
| Hata Bildirimi | 40 | 60 | 100 | 150 | 4–6 dk | 10 | Günde 3 | Müfettiş getirir; en büyük tekrarlanabilir kaynak |
| Keskin Göz | 50 | — | — | — | — | — | Bir kez | 119/120 anomalisini fark etme |
| Berrak Zihin | +%15 | | | | — | — | Görev başına | İpuçsuz ilk deneme |
| Kod incelemesi (Usta, test geçince) | 10–30 | | | | 0,5 dk | — | Görev başına | Gelire etkisi yok |
| Vitrin'de kod okuma (Kod Panosu) | 10 | 10 | 10 | 10 | 2 dk | 5 | Günde 3 | MVP salt okunur |
| Kod Düellosu (v1.1) | 50 | 50 | 50 | 50 | 5 dk | 10 | Günde 5 | 15 B + 50 XP kazanana; bahis yok |
| Akran incelemesi (v1.2) | 10 | | | | 3 dk | 3 | Günde 5 (B2 varsayımı) | AI incelemesiyle ≥%70 örtüşme |
| Mentor kilometre taşı (v1.2) | 50 | | | | — | — | Menti Semt Sınavı geçince | Efsane için 10 gerekir |
| Lonca içi kod incelemesi (v1.1) | 20 (iki tarafa) | | | | 4 dk | 5 | Günde 3 (B2 varsayımı) | Hata Bildirimi motoru |

Tabloda **lig, alkış, ziyaret ve Meydan Sorusu XP vermez**; bunlar Bayt ya da yalnızca görünürlük verir. Böylece "XP = öğrenme kanıtı" okunabilirliği korunur: Kalıcılık Ligi ve Metro Haritası'ndaki altın durak sayısı velilere gösterilebilen öğrenme KPI'ı olarak kalır.

### 4.2 Kurul puanı → XP eşlemesi

KANON §3.3: `XP = taban × puan/100`; geçince (≥70) en az tabanın %50'si; denediyse en az 5; 85+ parlak ×1,2; 2. deneme %80. Haiku ön elemesinden geçemeyen cevap (boş, konu dışı, enjeksiyon, kopya) 0 XP alır ve mizahi uyarı görür ("Kurul kandırılmaz"). Usta'nın canlı takip sorusu puana en çok +10 telafi ekler; XP bu yeni puandan hesaplanır.

```csharp
public static int SoruXp(int puan, int taban, bool gecerli, bool ikinciDeneme)
{
    if (!gecerli) return 0;                               // boş / konu dışı / enjeksiyon / kopya
    double xp = taban * puan / 100.0;
    if (puan >= 85)      xp *= 1.2;                       // parlak
    else if (puan >= 70) xp = Math.Max(xp, 0.5 * taban);  // geçti: emniyet tabanı
    else                 xp = Math.Max(xp, 5);            // denedi: en az 5
    if (ikinciDeneme) xp *= 0.8;
    return (int)Math.Round(xp, MidpointRounding.AwayFromZero);
}
// taban: T1 30 · T2 54 · T3 84 · T4 120
```

| Kurul puanı | Durum | T1 (taban 30) | T2 (54) | T3 (84) | T4 (120) | T1, 2. deneme (×0,8) |
|---|---|---|---|---|---|---|
| 100 | parlak | 36 | 65 | 101 | 144 | 29 |
| 92 | parlak | 33 | 60 | 93 | 132 | 26 |
| 85 | parlak | 31 | 55 | 86 | 122 | 24 |
| 84 | geçti | 25 | 45 | 71 | 101 | 20 |
| 78 | geçti | 23 | 42 | 66 | 94 | 19 |
| 70 | geçti (eşik) | 21 | 38 | 59 | 84 | 17 |
| 69 | kaldı → Telafi Turu | 21 | 37 | 58 | 83 | 17 |
| 55 | kaldı | 16 | 30 | 46 | 66 | 13 |
| 40 | kaldı (<40 → kart önerisi) | 12 | 22 | 34 | 48 | 10 |
| 25 | kaldı | 8 | 14 | 21 | 30 | 6 |
| 10 | kaldı, taban 5 | 5 | 5 | 8 | 12 | 4 |
| 0 | geçerli ama yanlış | 5 | 5 | 5 | 5 | 4 |
| boş / konu dışı / enjeksiyon / kopya | Haiku eledi | 0 | 0 | 0 | 0 | 0 |

İki tasarım notu. Birincisi, 69 ve 70 puan neredeyse aynı XP'yi verir; bu bilinçlidir — eşik XP'yi değil **Ders Mührü'nü** (3 sorudan 2'si ≥70) belirler. Oyuncu "1 puanla 10 XP kaybettim" hissi yaşamaz, ama görev kapısı için Telafi Turu'na gider. İkincisi, 84 → 85 geçişinde 25'ten 31'e sıçrama vardır (+6 XP); "parlak" etiketi bir kutlama anıdır ve ligde adalet için aynı cevaba aynı puan ilkesiyle güvence altındadır.

İki deneme kuralı: ikinci denemenin XP'si ×0,8 ile hesaplanır ve oyuncuya **iki denemenin yükseği** kalır; ilk denemede verilen XP geri alınmaz, yalnızca fark eklenir (`fark = max(0, XP2 − XP1)`).

### 4.3 Ders XP tavanı, Telafi Turu ve 2. deneme

Telafi Turu sınırsız olduğundan XP çiftliğine dönmemesi için kural: **bir dersin toplam XP'si tavanlıdır**: `DersTavanı = 10 + 3 × taban × 1,2` (T1 118, T2 204, T3 312, T4 442). Telafi Turu'ndaki sorular XP verir ama ders toplamı tavanı aşamaz; tavana ulaşmış oyuncu Telafi'yi Mühür için oynar, XP için değil. Aynı tavan, aynı dersin ileride Günlük Tekrar kuyruğuna düşen sorularına uygulanmaz (onlar Günlük Tekrar'ın 15 XP'sine girer).

"Ortalama T1 dersi 100 XP" (KANON) planlama değeridir; gerçekleşen değer ortalama puana bağlıdır. Ortalama puan 80 ve %25 parlak oranıyla tipik T1 dersi ≈ 10 + 3 × 25 = 85–95 XP üretir; Telafi ve ikinci deneme farkı kapatır. Simülasyon (§11) planlama değerini kullanır.

### 4.4 Günlük sınırlar ve azalan getiri

KANON: **günlük XP tavanı yoktur**; tekrar edilen görev ve ders 0 XP verir. Azalan getiri bu yüzden tek bir global tavanla değil, kaynak başına sınırlarla kurulur. Toplam etkisi, içerik bittiğinde oyuncunun günde kazanabileceği XP'yi belirler:

| Tier | Tekrarlanabilir günlük XP (MVP: 3 HB + Günlük Tekrar + 3 kod okuma) | + Kod Düellosu 5/gün (v1.1) | + Akran 5 ve Mentor (v1.2) |
|---|---|---|---|
| T1 | 165 | 415 | 515 |
| T2 | 225 | 475 | 575 |
| T3 | 345 | 595 | 695 |
| T4 | 495 | 745 | 845 |

Kurallar:

1. **Tekrar = 0 XP.** Geçilmiş görev, mühürlenmiş ders, açılmış işletmenin İş Emri'ni yeniden çalıştırmak XP vermez; Vitrin'de kendi kodunu okumak sayılmaz.
2. **Kaynak başına günlük adet:** Hata Bildirimi 3, Günlük Tekrar 1, kod okuma 3, Düello 5 (v1.1), akran incelemesi 5 (v1.2), lonca içi inceleme 3 (v1.1). Sınırlar 04:00 (TR) sıfırlanır; HUD'da "bugün 2/3" sayacı görünür.
3. **AI kotası XP'yi geciktirir, azaltmaz:** 30 AI puanlamalı etkileşimden sonra cevaplar kaydedilir, gece Batch API ile puanlanır, XP sabah gelir (KANON §9). Kotayı dolduran oyuncunun ders mührü de sabah düşer; görev kapısı o güne kadar bekler ama deterministik görevler, HB ve Günlük Tekrar devam eder.
4. **Ders XP tavanı** (§4.3) Telafi çiftliğini kapatır.
5. **Semt Sınavı yalnızca ilk geçişte** 200 XP verir; başarısız denemeler bekleme yaratmaz, XP de vermez.
6. **Düello Elo kapısı** (v1.1): fark ≤200 olan eşleşmeler; aynı rakiple günde en çok 2 düello; kazanana 50 XP, kaybedene 0 (katılım XP'si yok, aksi hâlde "kaybetmek için 5 düello" davranışı doğar).

Bu sınırlarla T1'de içerik biten bir oyuncu günde en çok 165 XP (MVP) kazanır; bu, Kalfa bandının 8.720 XP'sini tek başına 53 günde doldurur. §4.5 bunun yarattığı sorunu sayısal olarak gösterir.

### 4.5 XP arz–talep analizi

Her bant için "talep" KANON eğrisinin istediği XP'dir; "arz" o bandın semtindeki tek seferlik içerik (ders + görev, açılış + yükseltme, Semt Sınavı) artı günlük tekrarlanabilir XP'dir. İçerik envanteri B2 varsayımıdır (Çarşı 12 ders — MVP; Liman 12 — MVP'de 6; Atölyeler 14; Kampüs 16; Finans 16; Veri Vadisi 14; Bulut Tepesi 16; toplam 100 ders). "Normal" oyuncu günde 1 ders + görev + 1 HB + Günlük Tekrar + 1 kod okuma, "yoğun" oyuncu 3 ders + 3 HB + 3 kod okuma yapar. "Dersiz gün" = bantta dersler bittikten sonra yalnızca tekrarlanabilir kaynaklarla geçen gün.

| Bant · semt | Gereken XP | Ders+görev XP (tek sefer) | Açılış+yükseltme XP, KANON slot | Açılış+yükseltme XP, Staj (B2) | Tekrar/gün normal MVP / +Düello | Tekrar/gün yoğun MVP / +Düello | Normal gün KANON | Normal dersiz gün | Yoğun gün KANON | Yoğun dersiz gün | Normal gün Staj+Düello | Yoğun gün Staj+Düello |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Çırak (1–5) · Çarşı | 1.850 | 2.040 (12 ders) | 300 | 900 | 65 / 165 | 165 / 415 | 6 | 0 | 2 | 0 | 3 | 1 |
| Kalfa (6–11) · Liman | 8.720 | 2.844 (12 ders) | 900 | 3.000 | 75 / 175 | 195 / 445 | 64 | 52 | 25 | 21 | 16 | 7 |
| Zanaatkâr (12–17) · Atölyeler | 17.810 | 4.130 (14 ders) | 1.250 | 3.450 | 85 / 185 | 225 / 475 | 144 | 130 | 57 | 52 | 55 | 23 |
| Mühendis (18–24) · Kampüs | 34.210 | 7.280 (16 ders) | 3.450 | 5.800 | 125 / 225 | 345 / 595 | 187 | 171 | 69 | 64 | 94 | 36 |
| Baş Mühendis (25–31) · Finans | 50.400 | 7.280 (16 ders) | 2.450 | 6.200 | 125 / 225 | 345 / 595 | 324 | 308 | 119 | 114 | 164 | 63 |
| Mimar (32–39) · Veri Vadisi | 79.340 | 9.310 (14 ders) | 3.400 | 6.400 | 175 / 275 | 495 / 745 | 380 | 366 | 137 | 132 | 231 | 87 |
| Şehir Mimarı (40–59) · Bulut Tepesi | 311.350 | 10.640 (16 ders) | 10.400 | 7.000 | 175 / 275 | 495 / 745 | 1.658 | 1.642 | 588 | 583 | 1.068 | 395 |

Okuma: Çırak bandı doğru dengelenmiştir (içerik > talep; oyuncu Sev. 6'ya Çarşı'yı bitirmeden ulaşır). Kalfa bandından itibaren talep, tek seferlik içeriğin 2–3 katıdır ve fark tekrarlanabilir kaynaklara yüklenir; Mühendis bandında normal oyuncu 187 günün 171'ini dersiz geçirir. Şehir Mimarı bandı (311.350 XP) KANON'un günlük 175–275 XP'lik tekrarlanabilir arzıyla normal oyuncu için 3–4,5 yıldır. **Sonuç:** KANON eğrisinin üst yarısı, bugünkü XP kaynaklarıyla "prestij bandı"dır; A'nın "~1 yılda tavan" hedefi ancak XP arzı artırılırsa ya da eğri düzleştirilirse tutar. Bu belge KANON'u uygular, ama iki çözüm kümesini sayılarıyla Ek A ve §14'e koyar:

- **Arz tarafı (KANON sabitlerine ek, yapısal değişiklik gerektirmez):** Staj modu (açılış XP'sini slottan bağımsız kılar, +2.100–3.750 XP/bant), Kod Düellosu'nun v1.1'de tier'a endeksli XP ile gelmesi (50 / 80 / 120 / 160), Lonca haftalık görevi XP'si (300 / 500 / 800 / 1.200), içerik bittiğinde Hata Bildirimi tavanının 3 → 5'e çıkması, Semt Sınavı XP'sinin tier'a endekslenmesi (200 / 400 / 800 / 1.200), Mentor kilometre taşı 50 → 150.
- **Talep tarafı (yapısal; KANON v2 kararı):** `80 × L^1,35` yerine `80 × L^1,2` ile Toplam(40) = 118.360, Toplam(60) = 291.490; `70 × L^1,2` ile 103.540 / 255.040. Semt eşikleri (6/12/18/25/32/40) değişmeden normal oyuncu Bulut Tepesi'ne ≈1 yılda ulaşır.

---

## 5. Bayt muslukları

### 5.1 Musluk tablosu

Olgun oyuncuda hedef dağılım (A §8): işletme %60, görev %20, Günlük Tekrar ve seri %8, lig %7, sosyal (alkış) %5. Aşağıdaki tablo KANON §4 değerlerini günlük üst sınır ve tier çarpanıyla birlikte verir.

| Kaynak | Miktar (T1) | T2 / T3 / T4 | Sıklık | Günlük üst sınır (T1) | Arkasındaki eylem |
|---|---|---|---|---|---|
| İşletme geliri | Otopark L1 ≈220 B/gün (kasa 8 saat ≈73 B) | İşletmeye göre §7.1 | Saatlik akış, 3 toplama = tam | İşletme sayısı × gelir | Çalışan kod (referans tavanlı) |
| Görev (ilk tamamlama) | 40–80 B (Meydan Saati 40, Dakikadan Saate 50, Kademeli Karar 60, Taksimetre 80) | ×2 / ×4 / ×8 (80–160 / 160–320 / 320–640) | Ders başına 1 | İçerikle sınırlı | Kod yazma |
| Belediye teşviki | 100 B | 100 | Ruhsat başına (3 görev) | — | Üç görev |
| Günlük Tekrar | 20 B (+15 XP) | 20 | Günde 1 | 20; seri ≥7 → 30 | 5 soru, aralıklı tekrar |
| Hata Bildirimi | 40–120 B (zorluğa göre; ortalama ≈60) | T2 ≈80, T3 ≈110, T4 ≈150 ortalama | Günde 3 | 360 | Hata ayıklama + 1 cümle neden |
| Semt Sınavı | 500 B + 10 Çip + 200 XP | aynı | Semt başına 1 | — | 3 kod + 3 soru, interleaving |
| Haftalık lig | 0–300 B | aynı | Pazar 21:00 | — | Haftalık XP sırası (öğrenme eylemlerinin toplamı) |
| Alkış | 2 B / ziyaretçi | 2 | Yer başına günde 1 alkış | 40 | Ziyaret edilen çalışan işletme/oda |
| Davet kodu | 100 B (iki tarafa) | 100 | Davet edilen ilk Bayt'ını kazanınca | — | Davet (KVKK: yalnızca kod) |
| Kod Düellosu (v1.1) | 15 B + 50 XP | 15 | Günde 5 | 75 | Aynı problem, en hızlı doğru |
| Lonca haftalık görevi (v1.1) | 100–300 B pay | tier'a göre | Haftada 1 | — | Lonca içi kod görevi |
| Lonca Projesi payı (v2) | 300–1.000 B | — | Proje başına | — | Çok dosyalı Şehir Uygulaması |

Bayt'ın hiçbir yerde "giriş yaptın" diye verilmediğine dikkat: Günlük Tekrar bile 5 soru cevaplamayı ister. Alkış, oyuncunun kendi eylemine değil başkasının ziyaretine bağlıdır; bu yüzden günde 40 B ile sınırlandırılır ve dağılımda %5'i geçmez.

### 5.2 İlk-kez bonusları

Tek seferlik, küçük, hepsi bir eyleme bağlı. Toplamı 500 B'yi geçmez; onboarding ekonomisine (ilk 300 B'nin 4 görevden ve teşvikten gelmesi, KANON) dokunmaz çünkü hepsi tapudan sonra tetiklenir.

| Bonus | Miktar | Tetikleyici | Not |
|---|---|---|---|
| Açılış Kurdelesi | 100 B | İlk işletmenin Açılış'ı (Savunma geçildi) | Belediye'den; LED panoda "@ad'ın Otoparkı açıldı" ile birlikte |
| İlk Vitrin | 50 B | İlk kez kod sergilenince (L2+) | Kodunu göstermeyi teşvik eder |
| İlk 7 gün serisi | 100 B | Günlük Tekrar serisi ilk kez 7'ye ulaşınca | Sonra ×1,5 kuralı sürer |
| İlk Hata Bildirimi | +20 B | İlk HB çözümü | Müfettiş'i tanıtır |
| İlk Alkış verme | 10 B | Başkasının işletmesine ilk alkış | Sosyal katmanı açar |
| İlk Semt Sınavı | KANON'un 500 B + 10 Çip'i | — | Ek bonus yok |
| Davet | 100 B iki tarafa | Davet edilen ilk Bayt'ını kazanınca | Spam önlemi: ayda en çok 5 davet ödülü |

### 5.3 Lig ve etkinlik ödülleri

Haftalık lig 30 kişilik kovadır (Bronz → Gümüş → Altın → Elmas; terfi ilk 7, düşme son 5). Ödül sıraya göre, KANON'un 0–300 B aralığında:

| Sıra | Bayt | Not |
|---|---|---|
| 1 | 300 | Elmas'ta ayrıca haftalık "Elmas Yıldızı" Nişan'ı (yalnızca sergilenir) |
| 2–3 | 200 | |
| 4–7 | 150 | Terfi bölgesi |
| 8–12 | 100 | |
| 13–20 | 50 | |
| 21–25 | 20 | |
| 26–30 | 0 | Düşme bölgesi; Bayt cezası yok |

Lig puanı haftalık XP'dir; XP yalnızca öğrenme eylemlerinden geldiği için lig, oyun süresinin değil öğrenmenin yarışıdır. Kalıcılık Ligi (altın durak sayısı) ve En Hızlı Otopark tabloları **Bayt vermez**; Nişan verir (10 / 25 / 50 / 100 altın durakta "Kalıcı Zihin I–IV"). Böylece haftalık Bayt enjeksiyonu kova başına en çok 300 + 2×200 + 4×150 + 5×100 + 8×50 + 5×20 = 2.200 B'dir; 1.000 DAU ≈ 34 kova ≈ 75.000 B/hafta, toplam dolaşımın %0,4'ü.

Etkinlikler (v1.1 sonrası) ödülü büyütmez, çeşitlendirir: hafta sonu **Müfettiş Günü** (Hata Bildirimi tavanı 3 → 5, aynı birim ödül), aylık **Semt Festivali** (o semtin görevleri bir haftalığına Nadir bir kozmetik parçası verir, Bayt aynı), sezon sonu **Şehir Günü** (sezon görev zinciri toplam 1.000 B + numaralı sezon tabelası). Hiçbir etkinlik Bayt çarpanı ("2× hafta sonu") uygulamaz; çarpanlar ekonomi panosunun ayar düğmesi olarak saklı tutulur.

---

## 6. Bayt giderleri (lavabolar)

### 6.1 Gider tablosu (KANON değerleri)

| Gider | Fiyat (B) | Seviye kapısı | Rol | Sıklık |
|---|---|---|---|---|
| İşletme tapusu | T1 300–900 · T2 1.500–8.000 · T3 10.000–35.000 · T4 50.000–120.000 (§7.1) | Katalog eşiği + Ruhsat + slot | En büyük lavabo (katalog toplamı 487.500 B) | Oyuncu başına 11 slot (Sev. 60) |
| İşletme yükseltme | L2 500 · L3 1.200 · L4 2.500 · L5 5.000 (+ kod) | Gerekli ders mührü | Orta vadeli hedef; 57 yükseltme adımı | İşletme × seviye |
| Kıyafet / aksesuar | 30–800 | Kademeye göre | Hızlı tatmin, gösteriş | Haftalık rotasyon |
| Oda eşyası | 40–400 | Kapasite seviyeyle büyür | Mülkiyet | Sürekli |
| Oda genişletme | Daire 2.000 (Sev. 10) · Çatı Katı 6.000 (Sev. 20) | Seviye | Büyük tek seferlik | 2 kez |
| Tabela / neon | 150–600 | Sev. 4 yazı, Sev. 8 neon | Gösteriş | İşletme başına |
| Seri Dondurucu | 50 | — | Alışkanlık sigortası (haftada 1 ücretsiz ayrıca) | Ayda 1–2 |
| Takma ad değişimi | 500 | — | Kimlik | Nadir |
| İşletme adı | 200 | Sev. 11 | Kimlik | Nadir |
| Lonca kuruluşu (v1.1) | 500 | Sev. 12 | Sosyal | 1 kez |
| Emote (Bayt rafı) | 60–250 | — | İfade | Ara sıra |
| Kıyafet seti (3 parça, Şık/Nadir) | 900–2.000 | — | Paket indirimi %15 | Rotasyon |

### 6.2 Ücretsiz olanlar (bilinçli olarak lavabo değil)

İpucu merdiveni (4 kademe), Telafi Turu, ikinci deneme, Semt Sınavı tekrarı, Savunma'nın 24 saat sonraki yeni hakkı, itiraz, yüz/saç/avatar düzenleme, oda eşyası yerleştirme/kaldırma, işletme kodunu dışa aktarma, Vitrin okuma ve Günlük Tekrar'ın haftalık bir dondurması **ücretsizdir**. Ekonomi panosunda gider açığı görülse bile bu liste fiyatlanmaz; açık, kozmetik ve mülkiyet lavabolarıyla kapatılır (§6.3).

### 6.3 Yeni lavabolar — B2 önerisi

Simülasyon (§11) gider/kaynak oranını 0,33–0,48 ölçer; hedef 0,7–0,9'dur. Açık ≈ normal oyuncuda ayda 7.000–7.500 B'dir. Dört lavabo bunu kapatır ve hiçbiri güç ya da öğrenme avantajı vermez:

| Lavabo | Fiyat | Açılış | Hedef hacim (normal oyuncu, ay) | Neden çalışır |
|---|---|---|---|---|
| **İşletme içi dekorasyon** | Parça 100–600 B; işletme başına 20 yer | İşletme Açık olunca | 2 işletme × ≈1.500 B = 3.000 B | Ziyaretçiler işletmenin içini görür (15 avatar kapasite); Vitrin'in yanına tezgâh, tabure, neon; Otopark'ta bariyer rengi, kulübe, bitki |
| **Nadir rotasyonu** | 450–800 B, haftada 6 slot, 1 hafta raftadır, ≥12 hafta sonra döner | Sev. 5 | 4 × 600 = 2.400 B | Zaman sınırlı ama satın alınabilir; FOMO'yu Çip'e değil Bayt'a bağlar |
| **Büyük Kasa** | 1.500 B, işletme başına 1, kasa tavanı 8 → 12 saat | Sev. 18 | 1.500 B (bir kez) | Yetişkinleşen oyuncunun 2 toplamayla tam gelire yaklaşmasını sağlar; A'nın açık sorusu 3; **asla Çip** |
| **Belediye Projeleri** | Katkı kademeleri 100 / 500 / 2.000 B; proje hedefleri 50.000–500.000 B (shard bazlı) | Sev. 6 | ≈1.000 B | Gönüllü, kolektif, görünür: Meydan Çeşmesi, Liman Feneri, Kampüs Amfisi. Katkı toplamına göre "Hayırsever I–III" Nişan'ı ve plakette isim. Tamamlanan proje herkese kozmetik iyileştirme verir, istatistik vermez |

Belediye Projeleri aynı zamanda görev metninin istediği "Belediye" lavabosunun KANON'a uygun biçimidir: vergi değil bağış, zorunlu değil gönüllü, ceza değil prestij.

---

## 7. İşletme ekonomisi

### 7.1 Katalog tablosu

Fiyat, semt, açılış seviyesi ve seviye sayısı KANON §5'ten; L1 günlük geliri B2'nin tasarımıdır (Otopark L1 = 220 B KANON). Her L bir öncekinin ×1,6'sıdır (KANON: Otopark 220 → 350 → 560 → 900 → 1.440). Saatlik gelir = günlük ÷ 24; kasa tavanı = 8 saatlik üretim (KANON). Geri ödeme = fiyat ÷ L1 günlük gelir; "2 toplama" sütunu günde iki kez toplayan oyuncunun 16 saatlik (%67) gelirine göredir.

| # | İşletme | Semt (Tier) | Açılış sev. | Fiyat (B) | L1 B/gün | L1 B/saat | L2 | L3 | L4 | L5 | Kasa tavanı 8 sa (L1) | Geri ödeme, tam toplama (gün) | Geri ödeme, 2 toplama (gün) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Otopark | Çarşı (T1) | 3 | 300 | 220 | 9,2 | 350 | 560 | 900 | 1.440 | 73 | 1,4 | 2,0 |
| 2 | Büfe | Çarşı (T1) | 4 | 600 | 300 | 12,5 | 480 | 770 | 1.230 | — | 100 | 2,0 | 3,0 |
| 3 | Manav | Çarşı (T1) | 5 | 900 | 380 | 15,8 | 610 | 970 | 1.560 | — | 127 | 2,4 | 3,6 |
| 4 | Kargo Deposu | Liman (T1–2) | 6 | 1.500 | 500 | 20,8 | 800 | 1.280 | 2.050 | — | 167 | 3,0 | 4,5 |
| 5 | Balık Hali | Liman (T1–2) | 8 | 2.200 | 620 | 25,8 | 990 | 1.590 | 2.540 | — | 207 | 3,5 | 5,3 |
| 6 | Oto Yıkama | Liman (T1–2) | 9 | 2.500 | 680 | 28,3 | 1.090 | 1.740 | — | — | 227 | 3,7 | 5,5 |
| 7 | Gümrük | Liman (T1–2) | 10 | 3.000 | 750 | 31,2 | 1.200 | 1.920 | 3.070 | — | 250 | 4,0 | 6,0 |
| 8 | Oto Tamirhane | Atölyeler (T2) | 12 | 5.000 | 1.000 | 41,7 | 1.600 | 2.560 | 4.100 | — | 333 | 5,0 | 7,5 |
| 9 | Mobilya Atölyesi | Atölyeler (T2) | 14 | 6.500 | 1.200 | 50,0 | 1.920 | 3.070 | 4.920 | — | 400 | 5,4 | 8,1 |
| 10 | Trafo Merkezi | Atölyeler (T2) | 16 | 8.000 | 1.400 | 58,3 | 2.240 | 3.580 | 5.730 | — | 467 | 5,7 | 8,6 |
| 11 | Kütüphane | Kampüs (T2–3) | 18 | 10.000 | 1.650 | 68,8 | 2.640 | 4.220 | 6.760 | — | 550 | 6,1 | 9,1 |
| 12 | Sinema | Kampüs (T2–3) | 20 | 14.000 | 2.150 | 89,6 | 3.440 | 5.500 | 8.810 | — | 717 | 6,5 | 9,8 |
| 13 | Haber Ajansı | Kampüs (T2–3) | 23 | 18.000 | 2.600 | 108,3 | 4.160 | 6.660 | — | — | 867 | 6,9 | 10,4 |
| 14 | Banka | Finans Bölgesi (T3) | 25 | 25.000 | 3.300 | 137,5 | 5.280 | 8.450 | 13.520 | — | 1.100 | 7,6 | 11,4 |
| 15 | Sigorta | Finans Bölgesi (T3) | 28 | 30.000 | 3.750 | 156,2 | 6.000 | 9.600 | 15.360 | — | 1.250 | 8,0 | 12,0 |
| 16 | Borsa Panosu | Finans Bölgesi (T3) | 30 | 35.000 | 4.100 | 170,8 | 6.560 | 10.500 | — | — | 1.367 | 8,5 | 12,8 |
| 17 | Hastane Kayıt | Veri Vadisi (T3–4) | 32 | 50.000 | 5.300 | 220,8 | 8.480 | 13.570 | 21.710 | — | 1.767 | 9,4 | 14,2 |
| 18 | Otel | Veri Vadisi (T3–4) | 36 | 65.000 | 6.500 | 270,8 | 10.400 | 16.640 | 26.620 | — | 2.167 | 10,0 | 15,0 |
| 19 | Yemek Sipariş Platformu | Bulut Tepesi (T4) | 40 | 90.000 | 8.200 | 341,7 | 13.120 | 20.990 | 33.590 | — | 2.733 | 11,0 | 16,5 |
| 20 | Şehir Uygulaması | Bulut Tepesi (T4) | 45 | 120.000 | 10.000 | 416,7 | 16.000 | 25.600 | — | — | 3.333 | 12,0 | 18,0 |

Çevrimdışı gelir tavanı tüm işletmelerde **8 saat**tir (KANON). Büyük Kasa (B2 önerisi, §6.3) Sev. 18'den itibaren işletme başına tavanı 12 saate çıkarır; T3–T4 işletmelerinde 12 saatlik kasa 1.650–5.000 B tutar, bu da iki toplamayla günlük gelirin %100'üne ulaşmayı sağlar.

Gelirin motor tarafında nasıl üretildiği §8'dedir: tablodaki değerler, referans çözümün o işletmenin sentetik trafiğinde ürettiği TL ÷ 10'dur. Örneğin Kargo Deposu L1 için gece batch'i 60 kargo hareketi üretir, referans çözüm ≈5.000 TL hesaplar → 500 B. Her işletmenin trafik dağılımı ve referans çözümü işletme kataloğu belgesindedir (bkz. B5); B2 yalnızca hedef TL toplamını verir.

### 7.2 Fiyatlama kuralı ve "3–5 günlük gelir" doğrulaması

Tasarım heuristiği: **L1 günlük gelir = fiyat ÷ tier geri ödeme hedefi**, hedefler T1 1,4–2,4 gün, T2 3–5,7, T3 6–8,5, T4 9,4–12 (A: "geri ödeme T1'de 2–4 gün, T4'te 8–12 gün"; 2 toplamayla T1 2–3,6, T4 14–18 gün). Tier çarpanı Otopark L1 = 1,0 alındığında ≈ Liman ×2,3, Atölyeler ×4,5, Kampüs ×7,5, Finans ×15, Veri Vadisi ×24, Bulut Tepesi ×37'dir; işletme içi çeşitlilik (Çarşı 220/300/380) aynı semtin ilk işletmesinin en ucuz ve en hızlı geri dönen olmasını sağlar.

A'nın kuralı "bir sonraki tapu, o evredeki 3–5 günlük toplam gelire eşittir" KANON slot tavanı altında şöyle doğrulanır (normal oyuncu, 2 toplama, §11 simülasyonundan):

| Evre | Toplam günlük gelir (işletme + görev + HB + GT) | Sonraki tapu | Kaç günlük gelir |
|---|---|---|---|
| Gün 3–6 (Otopark L1) | ≈147 + 60 + 60 + 20 ≈ 290 B | Büfe 600 | 2,1 |
| Gün 8–12 (Otopark L1 + Büfe L1→L2) | ≈350 + 140 ≈ 490 B | Manav 900 (slot yok) / Kargo 1.500 | 1,8 / 3,1 |
| Sev. 12 (Otopark L2 + Büfe L3; 1.120 B/gün tam) | ≈750 + 150 ≈ 900 B | Oto Tamirhane 5.000 | 5,5 |
| Sev. 18 (3 işletme, ≈2.500 B/gün) | ≈2.000 | Kütüphane 10.000 | 5,0 |
| Sev. 25 (4 işletme, ≈6.000 B/gün) | ≈4.500 | Banka 25.000 | 5,6 |
| Sev. 40 (7 işletme, ≈20.000 B/gün) | ≈15.000 | Yemek Sipariş 90.000 | 6,0 |

Kural T1–T2'de tutar, T3–T4'te 5–6 güne uzar; bu kabul edilebilir çünkü geç oyunda oyuncu zaten slot bekler ve bakiye biriktirir (§11 bulgusu). Slot tavanı gevşetilirse (örneğin `2 + ⌊seviye/3⌋`, §11.6 Varyant A) yoğun oyuncu Sev. 15'te 7 işletmeyle ≈7.000 B/gün kazanır ve Atölyeler tapuları (5.000–8.000) tek günlük gelire düşer — kural kırılır. Bu yüzden B2, slot tavanını korumayı ve XP duvarını Staj moduyla aşmayı önerir (§7.4).

### 7.3 Yükseltme ekonomisi

Yükseltme fiyatları tier'dan bağımsızdır (KANON: 500 / 1.200 / 2.500 / 5.000 B). Otopark için gelir artışı ve geri ödeme:

| Yükseltme | Fiyat | Gelir | Artış | Geri ödeme, tam toplama | Geri ödeme, 2 toplama | Gereken ders (semt) | XP |
|---|---|---|---|---|---|---|---|
| L1 → L2 | 500 | 220 → 350 | +130 | 3,8 gün | 5,8 gün | `List<string>`, `Contains` (Liman 2.1) | 150 |
| L2 → L3 | 1.200 | 350 → 560 | +210 | 5,7 gün | 8,6 gün | `enum`, `ArgumentOutOfRangeException` (Atölyeler) | 250 |
| L3 → L4 | 2.500 | 560 → 900 | +340 | 7,4 gün | 11,0 gün | `DateTime`, `TimeSpan` (Kampüs) | 400 |
| L4 → L5 | 5.000 | 900 → 1.440 | +540 | 9,3 gün | 13,9 gün | durum, kuyruk, async (Finans) | 600 |

Geri ödeme süresi her kademede uzar; bu, yükseltmenin asıl bedelinin ders olduğu mesajını destekler. Geç tier işletmelerde aynı fiyatlar önemsizleşir (Yemek Sipariş L2: 500 B'ye +4.920 B/gün, geri ödeme 0,1 gün). Ekonomik olarak zararsızdır — kapı dersdir, Bayt değil — ama lavabo olarak değer kaybeder. **B2 önerisi:** yükseltme fiyatlarını tier'a endekslemek (T1 ×1, T2 ×2, T3 ×4, T4 ×8; görev ödülleriyle aynı merdiven). Böylece Banka L2 = 2.000 B, Yemek Sipariş L5 = 40.000 B olur ve geri ödeme tüm tier'larda 4–14 gün bandında kalır. KANON onaylayana kadar tablolar 500/1.200/2.500/5.000 kullanır.

### 7.4 Slot tavanı ve sonuçları; Staj modu (B2 önerisi)

KANON: eşzamanlı işletme `1 + ⌊seviye/6⌋`, her türden 1. Bu, Sev. 1–5'te 1, 6–11'de 2, 12–17'de 3, 18–23'te 4, 24–29'da 5, 30–35'te 6, 36–41'de 7, 60'ta 11 işletme demektir; 20 işletmenin tamamına hiçbir oyuncu sahip olamaz. Üç sonuç:

1. Katalogdaki açılış seviyeleri (Büfe 4, Manav 5, Kargo 6, Balık Hali 8, Oto Yıkama 9, Gümrük 10) alt sınırdır; fiilen bağlayıcı olan slot sayısıdır. Normal oyuncu Büfe'yi Sev. 6'da (7. gün), üçüncü işletmesini Sev. 12'de alır; Manav ve Liman'ın dört işletmesinden üçü için ya seçim yapar ya da bekler. Portföy seçimi ("Liman'da deposu olan Kalfa") anlamlı bir kimlik kararıdır ve A'nın yolculuk arkıyla uyumludur.
2. Fiyat merdiveni ve "3–5 günlük gelir" kuralı slot tavanı sayesinde tutar (§7.2).
3. Bedel, XP ve lavabo kaybıdır: Liman'ın dört işletmesinin açılış ve L2 XP'si (4 × 600 + 4 × 150 = 3.000 XP) ve 9.200 B'lik tapuları kilitli kalır; §4.5 ve §11 bunun Kalfa bandında 45–50 günlük dersiz bir duvar yarattığını gösterir.

**Staj modu (B2 önerisi, KANON v1.1 adayı):** Ruhsat'ını tamamladığı, seviye ve semt kapısını geçtiği ama slotu olmayan oyuncu, o işletmenin İş Emri'ni Akademi Atölyesi'nde "stajyer" olarak kodlar: Gereksinim Netleştirme, Müfettiş testleri ve Savunma aynen çalışır; geçince **açılış XP'sinin tamamı** ve bir "Staj Belgesi" (profil portföyünde gri kart) verilir, **gelir verilmez**. Slot açılıp tapu alındığında işletme anında Açık olur (Açılış töreni oynar, XP yeniden verilmez). Öğrenme tarafı (XP, içerik erişimi) slottan bağımsızlaşır, para tarafı (gelir, fiyat merdiveni) slotla sınırlı kalır; "öğrenme asla kilitli değil" ilkesi işletme koduna da uzanmış olur. Simülasyon etkisi §11.6'dadır: normal oyuncu Sev. 12'ye 45 yerine 28 günde, yoğun oyuncu 28 yerine 10 günde ulaşır; Bayt eğrileri KANON temelinden sapmaz.

---

## 8. Pasif gelir formülü ve hasat

### 8.1 Planlama formülü

```
BeklenenGünlükBayt(işletme, L) = TemelGelir(işletme) × SeviyeÇarpanı(L) × Durum × Mesai × Lonca

TemelGelir(işletme) : §7.1'deki L1 günlük gelir (Otopark 220 B); semt Tier'ı ve işletme katsayısı bu sayının içindedir
SeviyeÇarpanı(L)    : 1,6^(L−1)  → L1 1,0 · L2 1,6 · L3 2,56 · L4 4,10 · L5 6,55
Durum               : Açık 1,0 · Deneme 0,5 · Kapalı (yazılım bekliyor) 0 · Kararmış (kod bozuk) 0
Mesai               : 1,15 o gün en az bir öğrenme eylemi varsa (B2 önerisi), aksi 1,0; KANON temeli 1,0
Lonca               : 1,0 + 0,02 × min(bu hafta lonca görevini bitiren üye, 5) → en çok 1,10 (v1.1, B2 önerisi); KANON temeli 1,0
SaatlikBayt         = BeklenenGünlükBayt ÷ 24
KasaTavanı          = 8 × SaatlikBayt   (Büyük Kasa ile 12 ×)
```

Örnek: Otopark L2, Açık, öğrenme eylemi yapılmış bir günde, 3 üyesi görev bitirmiş bir loncada: 220 × 1,6 × 1,0 × 1,15 × 1,06 = **429 B/gün**, saatlik 17,9 B, kasa tavanı 143 B. KANON temelinde (çarpanlar 1,0): 352 ≈ 350 B/gün.

### 8.2 Motor (gerçek hesap, C#)

Planlama formülündeki `TemelGelir × SeviyeÇarpanı`, motorda oyuncunun **kendi derlenmiş kodunun** ürettiği TL ile değiştirilir; referans çözüm tavanı (KANON §4) tam burada uygulanır. Sunucu her gece deterministik tohumla sentetik trafik üretir (Otopark L1: 12 araç; %45 < 2 sa, %35 2–6 sa, %18 6–24 sa, %2 > 24 sa), oyuncu kodu sandbox'ta tek batch çalışır, sonuç 24 saate paylaştırılır.

```csharp
public enum IsletmeDurumu { Satilik, Kapali, Deneme, Acik, Kararmis }

public sealed record GunlukGelir(decimal GunlukBayt, decimal SaatlikBayt, long OyuncuTl, long ReferansTl, string? Sikayet);

public static class GelirMotoru
{
    public const decimal TlBasinaBayt = 0.1m;   // 10 TL = 1 B (KANON)
    public const int KasaSaati = 8;             // kasa 8 saatlik üretimi tutar (KANON)

    // Gece batch: trafik için oyuncu kodu ve referans çözüm sandbox'ta çalışır (AI yok).
    public static GunlukGelir Hesapla(IsletmeDurumu durum, int seviye, int[] trafik,
                                      Func<int, int> oyuncuKodu, Func<int, int> referansKodu)
    {
        long oyuncuTl = 0, referansTl = 0;
        foreach (var girdi in trafik)
        {
            oyuncuTl   += GuvenliCalistir(oyuncuKodu, girdi);   // exception → 0 TL, şikâyet balonu
            referansTl += referansKodu(girdi);
        }
        long tavanliTl = Math.Min(oyuncuTl, referansTl);        // referans tavanı: fazla ücret gelire dönmez
        decimal durumCarpani = durum switch
        {
            IsletmeDurumu.Acik   => 1.0m,
            IsletmeDurumu.Deneme => 0.5m,
            _                    => 0m
        };
        decimal gunluk = tavanliTl * TlBasinaBayt * durumCarpani;
        string? sikayet = oyuncuTl > referansTl ? "fazla ücret şikâyeti"
                        : oyuncuTl < referansTl ? "eksik ücret şikâyeti" : null;
        return new GunlukGelir(gunluk, gunluk / 24m, oyuncuTl, referansTl, sikayet);
    }

    // Her saat başı: bonuslar temel hızı çarpar, kasa tavanı da aynı hızla büyür.
    public static decimal SaatlikUretim(decimal temelSaatlik, bool mesaiAktif, int loncaGoreviBitiren)
    {
        decimal mesai = mesaiAktif ? 1.15m : 1.0m;                                   // B2 önerisi
        decimal lonca = 1.0m + 0.02m * Math.Min(loncaGoreviBitiren, 5);               // v1.1, en çok 1,10
        return temelSaatlik * mesai * lonca;
    }

    public static void KasaTik(Kasa kasa, decimal saatlik, bool buyukKasa)
    {
        kasa.Tavan  = saatlik * (buyukKasa ? 12 : KasaSaati);
        kasa.Bakiye = Math.Min(kasa.Bakiye + saatlik, kasa.Tavan);                   // dolu kasa üretimi durdurur, kayıp yok
    }

    public static int Topla(Kasa kasa)
    {
        int alinan = (int)Math.Floor(kasa.Bakiye);                                   // Bayt tam sayı; kesir kasada kalır
        kasa.Bakiye -= alinan;
        return alinan;
    }

    private static long GuvenliCalistir(Func<int, int> kod, int girdi)
    {
        try { return Math.Max(0, kod(girdi)); } catch { return 0; }
    }
}
```

Kurallar: (1) Kod hiç derlenmiyorsa ya da gizli testlerin tamamı kırmızıysa durum **Kararmış**'tır, tabela kararır, NPC arabalar girmez, gelir 0; oyuncu düzeltene kadar kasa dolmaz, kayıp yoktur. (2) Oyuncu kodu referanstan **az** üretirse (ör. 120 dakikaya 200 TL yerine 80 yazmak zaten doğru; ama 6 saati 250 yerine 240 hesaplamak eksik) eksik tutar gelire yansır ve "eksik ücret şikâyeti" balonu çıkar — kod kalitesi parayla ölçülür, AI ile değil. (3) Fazla üretim tavanlanır ve "fazla ücret şikâyeti" verir. (4) Hiçbir çarpan AI tarafından belirlenmez; Mesai ve Lonca sunucu olaylarıdır.

### 8.3 Kasa ve hasat mekaniği

- **Dolum:** Saatlik üretim kasaya eklenir; kasa 8 saatlik üretimi tutar (Otopark L1 ≈73 B). Dolu kasa üretimi durdurur; bu, çevrimdışı gelir tavanıdır. Günde 3 toplama tam gelirdir (Hay Day ritmi); 2 toplama %67, 1 toplama %33.
- **Toplama (hasat):** İşletme önündeki kasaya tıkla → 10 saniyelik para animasyonu → HUD cüzdanı artar. İşletme Paneli'nden uzaktan "Topla" aynı tutarı verir ("mobilde okunur" ilkesi; yerinde toplamaya prim yoktur). Sev. 12'de HUD'a "Hepsini Topla" gelir (3+ işletme için zorunlu konfor).
- **Bildirim:** Kasa ilk kez dolduğunda günde en çok 1 push (opt-in): "Otoparkın kasası doldu (73 B)". Günlük Tekrar bildirimiyle birleştirilir, iki ayrı bildirim gitmez.
- **Gösteriş:** 1.000 B ve üzeri tek hasat LED panoda akar ("@ad Kütüphane'den 1.240 B topladı"); ziyaretçi o sırada içerideyse alkış butonu titrer.
- **Kesirler:** Bayt tam sayıdır; saatlik 9,2 B'nin kesri kasada birikir, toplama tabana yuvarlar, kalan kasada kalır. Hiçbir yuvarlama oyuncu aleyhine kayıp üretmez.
- **Deneme modu:** Gizli test kalan ya da Savunma'sı başarısız işletme %50 üretir, şikâyet balonu kategoriyi söyler; 24 saat sonra yeni Savunma hakkı. Deneme'den Açık'a geçişte geriye dönük fark ödenmez (ileri dönük ilke).
- **Çevrimdışı tavan ve zaman:** Üretim sunucu saatine göredir; saat dilimi oyunu etkilemez. Oyuncu 3 gün girmezse kasa 8 saatte dolmuş ve durmuştur; döndüğünde "kasan 3 gündür dolu" gibi bir suçlama metni yoktur, yalnızca "Kasa dolu" ikonu.

### 8.4 Mesai ve lonca bonusu — sınırlar

Mesai Bonusu'nun gerekçesi A'nın "Bayt veren her şeyin arkasında bir öğrenme eylemi vardır" ilkesini pasif gelire taşımaktır: giriş yapmak değil, o gün bir Ders Mührü, görev, Hata Bildirimi ya da Günlük Tekrar tamamlamak işletmeleri %15 hızlandırır. Günlük etkisi en çok +%15, olgun oyuncunun dağılımında işletme payını %60'tan %63'e çıkarır. Lonca bonusu sosyal bağ kurar ve transfer yasağını delmez: para el değiştirmez, yalnızca herkesin kendi üretimi biraz hızlanır. İkisi de referans tavanından **sonra** uygulanır, kopya ya da istismarla büyütülemez (öğrenme eylemi deterministik sunucu olayıdır; lonca görevi kod görevidir). KANON temeli her iki çarpanı 1,0 kabul eder; simülasyon (§11) bu temelle koşulmuştur, böylece A'nın "Otopark L1 ≈220 B/gün" sayısı değişmez.

---

## 9. Kozmetik fiyatlandırma ve Çip

### 9.1 Nadirlik kademeleri ve Bayt fiyat bantları

KANON §8'in beş kademesi; fiyat aralıkları KANON §4'ün üst sınırlarına (kıyafet 30–800, eşya 40–400, tabela-neon 150–600) oturur.

| Kademe | Renk | Para | Kıyafet / aksesuar | Oda eşyası | Emote | Tabela / neon | Raf ve rotasyon |
|---|---|---|---|---|---|---|---|
| **Sıradan** | Gri | Bayt | 30–120 B | 40–120 B | 60 B | 150 B (yazı rengi) | Kalıcı raf; MVP 20 kıyafet + 12 eşya |
| **Şık** | Mavi | Bayt | 150–400 B | 150–400 B | 120 B | 300–450 B | Kalıcı + mevsimlik; MVP 14 + 9 |
| **Nadir** | Mor | Bayt | 450–800 B | 300–400 B | 250 B | 600 B | Haftalık rotasyon, 6 slot, raftan 1 hafta sonra kalkar, ≥12 hafta sonra döner; numaralı seri; MVP 6 + 4 |
| **Premium** | Turkuaz | Çip | Set 100 Çip; parça 25–60 Çip | Oda teması 120 Çip; parça 15–40 Çip | Paket (8 emote) 40 Çip | Neon paleti 30 Çip | Butik; sezonluk koleksiyon; statik (animasyon yok) |
| **Nişan** | Altın çerçeve + animasyon | — (yalnızca kazanılır) | Otopark Ustası şapkası, unvan rozetleri, Düello ceketi, Mentor rozeti, Semt Madalyası | Rozet Duvarı plaketleri | Şampiyon emote'u | Altın tabela çerçevesi (Sev. 55 hediyesi) | Rütbe Rafı'nda sergi; satılmaz, Bayt'la bile alınmaz |

İlkeler: (1) Aynı kademede fiyat **görünürlükle** ölçeklenir: başlık/şapka ve ceket en pahalı, çorap en ucuz. (2) Premium görsel olarak Şık'tan iyi, Nişan'dan sönüktür; Premium'da animasyon yoktur — animasyon yalnızca kazanılır. (3) Pazar'ın Rütbe Rafı'nda Nişan'lar sergilenir, "nasıl kazanılır" kartı vardır; bu raf satın almaz, hedef gösterir. (4) Set indirimi %15, paket fiyatı tekil toplamın altındadır ama hiçbir set zaman baskısıyla ("son 2 saat") satılmaz; Nadir rotasyonu haftalık ve takvimde ilan edilmiştir.

Geç oyunda Bayt bolluğu bu bantları önemsizleştirir (Sev. 30'da 800 B ≈ 1 saatlik gelir). **B2 önerisi:** semt pazarı çarpanı — Kampüs ve sonrasındaki Pazar şubelerinde aynı kademeler ×5 (Nadir 2.250–4.000 B), Bulut Tepesi'nde ×25 (Nadir 11.000–20.000 B). Kademe adları ve sayısı değişmez; yalnızca o semtin temalı koleksiyonu pahalıdır. KANON onaylayana kadar yalnızca Çarşı/Liman aralıkları geçerlidir.

### 9.2 Butik (Çip) — MVP 4 ürün ve tam katalog

MVP Butiği ödeme isteğini ölçer; dört ürün dört farklı kategori temsil eder:

| Ürün | Çip | TL karşılığı | Kategori |
|---|---|---|---|
| "Neon Çırak" kıyafet seti (4 parça) | 100 | 59,99 | Set — "100 Çip ≈ bir premium set" sabitini kurar |
| "Gece Odası" oda teması (duvar + zemin + pencere) | 120 | ≈72 | Oda |
| "Dans Paketi I" (8 emote) | 40 | ≈24 | İfade |
| İsim rengi (Butik paleti, 6 renk) | 20 | ≈12 | Mikro |

Tam katalog (v1.1+): premium setler 100–150 Çip, tekil parça 25–60, oda temaları 120, emote paketleri 40, neon paleti 30, isim rengi 20, ikinci avatar kaydı 80, ek dolap slotu (+10) 15, profil çerçevesi 25. Her Butik ürünü Bayt karşılığı olmayan bir kozmetiktir; hiçbir Butik ürünü Bayt rafındaki bir ürünün "daha iyi" sürümü değildir (aksi hâlde Bayt rafı değersizleşir).

Çip kazanımı KANON gereği yalnızca Semt Sınavı'dır: 7 semt × 10 = ömür boyu 70 Çip. Ödeme yapmayan oyuncu bir yılda bir Dans Paketi + İsim rengi alabilir ya da sete 30 Çip kala bekler; bu "premium tadı" bilinçlidir.

### 9.3 Çip paketleri (TL) ve kuralları

KANON varsayımı 100 Çip ≈ 60 TL. Web-öncelikli olduğumuz için ödeme doğrudan (iyzico/PayTR benzeri) alınır, mağaza komisyonu yoktur; mobil sarmalayıcıda mağaza fiyatları ayrıca belirlenir.

| Paket | Çip | TL | TL / 100 Çip | Bonus | 15–17 yaş |
|---|---|---|---|---|---|
| Avuç | 100 | 59,99 | 59,99 | — | Veli limiti dâhilinde |
| Kutu | 260 | 149,99 | 57,69 | +%4 | Veli limiti dâhilinde |
| Sandık | 560 | 299,99 | 53,57 | +%12 | Veli onayı gerekir |
| Konteyner | 1.200 | 599,99 | 50,00 | +%20 | Veli onayı gerekir |

Kurallar:

1. **Bayt satın alınamaz**; hiçbir paket, promosyon ya da etkinlik Bayt içermez. Çip Bayt'a, Bayt Çip'e dönmez.
2. **Rastgelelik yok:** loot box, gacha, "gizemli kutu", şans çarkı yoktur (15+ kitle, kumar benzeri mekanik yasağı). Her Çip ürünü ne olduğu görünerek satılır.
3. **Aylık harcama limiti:** 15–17 yaş için varsayılan limit 0 (KANON §12.2); veli SMS linki / Ebeveyn Paneli ile aylık limit koyar (platform üst sınırı 300 Çip/ay ≈180 TL), Sandık ve Konteyner her zaman veli onayı ister. 18+ için tavan yok, 1.000 TL/ay üzerinde bilgilendirme e-postası/SMS'i.
4. **Zaman baskısı yok:** paketlerde "sınırlı süre" indirimi, sayaç, ilk satın alma ikiye katlama yoktur. Fiyatlar çeyrek başına gözden geçirilir; değişiklik 30 gün önceden ilan edilir.
5. **İade:** harcanmamış Çip 14 gün içinde iade edilebilir (tüketici mevzuatı doğrulaması hukuk belgesine bırakılır, bkz. §14).
6. **Hesap silme:** KVKK silme talebinde kalan Çip'in TL karşılığı iade edilmez, bu şart satın alma ekranında yazar (hukuk onayına tabi).
7. **Gelir beklentisi:** 1.000 DAU'da %2,5 dönüşüm ve 120 TL aylık ARPPU ile ≈3.000 TL/ay; AI gideri ≈1.500 $/ay'dır (A varsayım 5). Çip ilk 6 ayda gelir modeli değil, ödeme isteği ölçümüdür (bkz. B9).

### 9.4 Dönüşüm ilkesi — tek cümle

**Bayt kazanılır, Çip satın alınır, Nişan hak edilir; üçü arasında hiçbir köprü yoktur.** Tek istisna Semt Sınavı'nın 10 Çip'idir ve o da Bayt'tan değil, öğrenme eyleminden gelir.

---

## 10. Enflasyon kontrolü

### 10.1 Yapısal frenler (KANON)

| Fren | Mekanizma | Sayısal etki |
|---|---|---|
| Kasa tavanı | 8 saatlik üretim; dolu kasa durur | Günde 1 toplayan oyuncu gelirin %33'ünü, 2 toplayan %67'sini alır; 1.000 DAU'da toplam ihraç, teorik gelirin ≈%70'idir |
| Slot tavanı | `1 + ⌊seviye/6⌋`, türden 1 | Sev. 12'de 3, Sev. 40'ta 7 gelir akışı; 20 işletmenin tamamı hiçbir hesapta birikmez |
| Referans tavanı | Oyuncu kodu referans çözümden fazla üretemez | Kopya ve "fiyatı 10 katına çıkar" istismarı gelirsizdir; AI çarpanı yok |
| Tier'e endeksli fiyatlar | Tapu 300 → 120.000, görev 40 → 640 | Gelir büyüdükçe lavabo büyür; geri ödeme 1,4 → 12 gün |
| Tekrar = 0 | Görev, ders, açılış XP'si ve Bayt'ı bir kez | Grind kaynağı yok |

### 10.2 Vergi, bakım, kira neden yok — yerine ne var

Görev metni "Belediye vergisi / işletme bakım gideri" ister; KANON §4 ve A'nın jüri kararı 11 bunları açıkça dışlar ("kayıp kaygısı 13+ kitlede motivasyon aracı değildir"). B2 bu karara uyar ve gerekçeyi ekonomik olarak da destekler: zorunlu giderler, az oynayan oyuncuyu (hafif profil, günde 73 B) cezalandırır ve onboarding'deki "KAPALI — yazılım bekliyor" binasını borç kaynağına çevirirdi. İkame tasarım şudur: **negatif akış yerine çekici pozitif lavabolar** (§6.3) ve **gönüllü kolektif lavabo** (Belediye Projeleri). Belediye kelimesi oyunda yalnızca verir (teşvik, Açılış Kurdelesi) ya da bağış toplar; asla kesmez.

### 10.3 Sezon ve sıfırlamalar

| Döngü | Süre | Sıfırlanan | Sıfırlanmayan |
|---|---|---|---|
| Haftalık lig | Pazar 21:00 | Lig puanı (haftalık XP), kova | Toplam XP, seviye, Bayt |
| Günlük sınırlar | 04:00 TR | HB 3, kod okuma 3, Düello 5, alkış 40 B | Seri (yalnızca gün atlanınca kırılır) |
| Nadir rotasyonu | Haftalık | Raf içeriği | Alınmış eşya |
| Sezon (v1.1) | 8–9 hafta (iki takvim ayı; B6) | Sezon lig puanı, sezon görev zinciri, Düello Elo'su ortalamaya %50 sıkıştırılır, sezon koleksiyonu raftan kalkar | **Bayt bakiyesi, işletmeler, kasa, XP, Nişan'lar, altın duraklar asla sıfırlanmaz** |

Bayt'ın sıfırlanmaması mülkiyet fantezisinin (A §2) koşuludur. Enflasyonu sezon sıfırlaması değil, sezonun **yeni lavabo** getirmesi dengeler: her sezon 1 numaralı seri tabela, 1 Nadir set, 1 Belediye Projesi.

### 10.4 Sınırlı seri kozmetikler

- **Numaralı seri:** her Nadir rotasyon ürünü shard başına sınırlı adettir (ör. 500); eşyanın üstünde "#137/500" yazar. Tükenince raftan kalkar, ≥12 hafta sonra yeni numara serisiyle döner (eski numaralar korunur).
- **Sezon serisi:** sezon koleksiyonu (Bayt) yalnızca o sezon satılır; bir daha gelmez. Sezon tabelası ("Açılış Sezonu 2026") kalıcı statü nesnesidir, Çip'le alınamaz.
- **Etkinlik serisi:** Semt Festivali'nin görevle kazanılan parçası Nişan değildir (Nadir sayılır) ama festival dışında satılmaz.
- **Asla sınırlı seri yapılmayanlar:** Sıradan raf (yeni oyuncu her zaman 30 B'lik şapkayı bulur), işlevsel eşyalar (Çalışma Masası, Rozet Duvarı, Büyük Kasa), Seri Dondurucu.

### 10.5 Haftalık ekonomi panosu — metrikler, eşikler, ayar düğmeleri

| Metrik | Tanım | Hedef | Alarm | Ayar düğmesi |
|---|---|---|---|---|
| Gider/kaynak oranı | Haftalık toplam harcama ÷ toplam Bayt ihracı | 0,7–0,9 | < 0,55 veya > 1,0 | Nadir slot sayısı (6 → 8), Nadir fiyat bandı ±%20, Belediye Projesi hedefi, Büyük Kasa fiyatı |
| 10 günlük harcama | Son 10 günde kazanılanın harcanan payı | ≥ %70 | < %50 | Rotasyon temposu, işletme dekorasyon seti indirimi |
| Medyan bakiye / bant | Unvan bandı başına medyan cüzdan | Çırak < 500, Kalfa < 3.000, Zanaatkâr < 10.000, Mühendis+ < 3 günlük gelir | 2 katı | Yeni lavabo açılışı, sezon koleksiyonu |
| Kaynak dağılımı | İşletme / görev / GT+seri / lig / alkış | 60 / 20 / 8 / 7 / 5 | Herhangi biri ±10 puan | Lig ödül tablosu, HB birim ödülü |
| Kasa doluluk kaybı | Dolu kasada geçen saat ÷ toplam saat | < %40 | > %55 | Bildirim zamanlaması; Büyük Kasa; **asla** tavanı Çip'le satmak |
| Referans tavanına çarpanlar | Gelir tavanına takılan işletme günleri | %85–95 (iyi kod) | < %75 | Müfredat sinyali (eksik ücret şikâyeti yoğunluğu) — ekonomi değil eğitim ayarı |
| Deneme modu oranı | Deneme'de kalan işletme günleri | < %15 | > %25 | Savunma soru bankası kalibrasyonu (bkz. B3) |
| Gini (bakiye) | Aktif oyuncular arası bakiye eşitsizliği | < 0,60 | > 0,70 | Üst bant lavaboları |
| Bayt ihracı / DAU / gün | Toplam ihraç ÷ DAU | T1 kohort 350–500 B | > 700 | Etkinlik ödülleri, alkış tavanı |

Ayar ilkeleri: değişiklikler ileriye dönüktür; fiyat artışı en az 7 gün önce Pazar'da duyurulur; ödül kesintisi yerine önce lavabo eklenir; haftada tek düğme oynanır (nedensellik için). Panonun verisi admin panelindedir (A §13); lansmandan önce H6'daki 10.000 bot simülasyonu aynı metrikleri üretir.

### 10.6 1.000 DAU dolaşım projeksiyonu

Profil karışımı %25 hafif, %60 normal, %15 yoğun ve §11'in 30 günlük sonuçlarıyla:

| Büyüklük | Hafif | Normal | Yoğun | 1.000 DAU ağırlıklı (aylık) |
|---|---|---|---|---|
| Aylık Bayt kaynağı (kişi) | 4.907 | 20.494 | 41.318 | ≈19,7 M B |
| Aylık gider (kişi) | 2.374 | 6.822 | 13.562 | ≈6,7 M B |
| 30. gün bakiyesi (kişi) | 2.533 | 13.672 | 27.756 | ≈13,0 M B dolaşımda |
| Gider/kaynak | 0,48 | 0,33 | 0,33 | 0,34 |

Hedef 0,7 için ayda ≈7 M B ek lavabo gerekir; §6.3'teki dört lavabonun normal oyuncu başına ≈7.900 B/ay hedef hacmi (1.000 DAU × 0,6 × 7.900 ≈ 4,7 M) artı yoğun oyuncunun Büyük Kasa ve dekorasyon harcaması bunu karşılar. Yoğun profilin %33'lük oranı slot tavanından kaynaklanır (alacak işletmesi yok); Staj modu bunu değiştirmez (Staj gelir de gider de üretmez), Varyant A (slot gevşetme) ise oranı daha da düşürür (0,18) çünkü gelir lavabodan hızlı büyür — bkz. §11.6.

---

## 11. 30 günlük örnek oyuncu simülasyonu

### 11.1 Model

Deterministik, gün çözünürlüklü, KANON sabitleriyle; Python betiği `b2_sim.py` aynı klasördedir (tablolar oradan üretildi).

| Varsayım | Hafif (≈10 dk) | Normal (35 dk) | Yoğun (90 dk) |
|---|---|---|---|
| Günlük süre | 10 dk; 1. gün 20; her 7. gün 30 dk masaüstü oturumu | 35 dk; 1. gün 40 | 90 dk; 1. gün 100 |
| Kasa toplama | 1/gün (%33) | 2/gün (%67) | 3/gün (%100) |
| Ders temposu | Bir gün ders, ertesi gün görev | 1 ders + görev/gün; ilk 2 gün 2 | 3 ders + görev/gün; 1. gün 4 |
| Hata Bildirimi | 0 | 1/gün | 3/gün |
| Kod okuma | 0 | 1/gün | 3/gün |
| Kozmetik harcaması | 60 B / 4 günde bir | 90 B / 2 günde bir (15. günden 144) | 120 B / gün (15. günden 192) |
| Lig (Pazar) | 20 B | 100 B | 250 B |
| Alkış | 2 B/gün | 6 B/gün | 14 B/gün |
| Kod süreleri | Otopark L1 30 dk, Büfe/Manav 25, Liman işletmeleri 35, yükseltme 20–25 dk; süre günler arasında taşınır | aynı | aynı |
| İçerik | Çarşı 12 ders (Ruhsat: Otopark 1.2–1.4, Büfe 1.5–1.7, Manav 1.8–1.10), Liman 12 ders (2.1–2.6 T1, 2.7–2.12 T2), Atölyeler 14 ders (T2) | aynı | aynı |
| Yükseltme koşulu | Otopark L2 ← ders 2.1; Büfe L2 ← 1.11; Büfe L3 ← 2.5; Otopark L3 ← 3.4 (Atölyeler); fiyat + 100 B rezerv | aynı | aynı |
| Semt Sınavı | Tüm semt dersleri bitince ve seviye eşiğinde; 20 dk | aynı | aynı |
| Daire | Sev. 10 ve bakiye ≥ 2.300 B | aynı | aynı |
| Çarpanlar | Mesai 1,0 · Lonca 1,0 (KANON temeli); Düello yok (MVP) | aynı | aynı |

Ders XP planlama değeri (T1 100, T2 180), görev XP + 10 ortalama bonus, HB Bayt ortalaması T1 60 / T2 80.

### 11.2 Hafif oyuncu (≈10 dk/gün)

| Gün | Sev. | Toplam XP | Bayt bakiyesi | İşletmeler | Olaylar |
|---|---|---|---|---|---|
| 1 | 2 | 170 | 10 | — | Ders 1.1 + Meydan Saati (40 B), Çırak Şapkası (−30) |
| 2 | 2 | 270 | 10 | — | Ders 1.2 |
| 3 | 3 | 355 | 80 | — | Dakikadan Saate (+50), Günlük Tekrar başladı |
| 4 | 3 | 455 | 80 | — | Ders 1.3 |
| 5 | 3 | 540 | 160 | — | Kademeli Karar (+60) |
| 6 | 4 | 640 | 160 | — | Ders 1.4 |
| 7 | 4 | 725 | 80 | Otopark L1 (kapalı) | Taksimetre (+80), Ruhsat Otopark +100; **TAPU Otopark −300** (30 dk hafta sonu oturumu) |
| 8 | 4 | 1.025 | 80 | Otopark L1 | **Otopark AÇILIŞ** (kod 30 dk, 7–8. günlere yayıldı) |
| 9 | 4 | 1.125 | 155 | Otopark L1 | İlk hasat (73 B) |
| 10 | 5 | 1.210 | 301 | Otopark L1 | |
| 11 | 5 | 1.310 | 376 | Otopark L1 | |
| 12 | 5 | 1.395 | 471 | Otopark L1 | |
| 13 | 5 | 1.495 | 547 | Otopark L1 | |
| 14 | 5 | 1.580 | 842 | Otopark L1 | Ruhsat Büfe +100; lig 20 B |
| 15 | 5 | 1.680 | 917 | Otopark L1 | |
| 16 | 5 | 1.765 | 977 | Otopark L1 | |
| 17 | 6 | 1.865 | 452 | Otopark L1, Büfe L1 (kapalı) | **Kalfa**; 2. slot; **TAPU Büfe −600** |
| 18 | 6 | 1.865 | 527 | Otopark L1, Büfe L1 (kapalı) | Büfe kodu (10 dk) |
| 19 | 6 | 1.865 | 603 | Otopark L1, Büfe L1 (kapalı) | Büfe kodu (10 dk) |
| 20 | 6 | 2.235 | 642 | Otopark L1, Büfe L1 | **Büfe AÇILIŞ** |
| 21 | 6 | 2.420 | 1.047 | Otopark L1, Büfe L1 | Ruhsat Manav +100 (slot yok, Ruhsat bekler); lig |
| 22 | 6 | 2.520 | 1.223 | Otopark L1, Büfe L1 | |
| 23 | 6 | 2.605 | 988 | Otopark L1, Büfe L1 | Büfe L2 ücreti −500 |
| 24 | 6 | 2.605 | 1.067 | Otopark L1, Büfe L1 | Yükseltme kodu |
| 25 | 7 | 2.755 | 1.243 | Otopark L1, Büfe L2 | Büfe → L2 |
| 26 | 7 | 2.855 | 1.478 | Otopark L1, Büfe L2 | |
| 27 | 7 | 2.940 | 1.823 | Otopark L1, Büfe L2 | |
| 28 | 7 | 3.240 | 2.483 | Otopark L1, Büfe L2 | **Çarşı Sınavı → Liman** (+500 B, 10 Çip) |
| 29 | 7 | 3.325 | 2.298 | Otopark L1, Büfe L2 | Otopark L2 ücreti −500 |
| 30 | 7 | 3.325 | 2.533 | Otopark L1, Büfe L2 | Yükseltme kodu sürüyor |

Özet: 30 günde 13 ders, 2 işletme, Sev. 7; kaynak 4.907 B, gider 2.374 B (oran 0,48); seri 11 gün (10 dakikalık günlerde Günlük Tekrar iki günde bir sığıyor — hafif oyuncu için GT'yi derse değil göreve bağlamak gerekir, bkz. §14).

### 11.3 Normal oyuncu (35 dk/gün)

| Gün | Sev. | Toplam XP | Bayt bakiyesi | İşletmeler | Olaylar |
|---|---|---|---|---|---|
| 1 | 3 | 350 | 60 | — | Ders 1.1–1.2, Meydan Saati (40), Dakikadan Saate (50), şapka (−30) |
| 2 | 4 | 715 | 20 | Otopark L1 (kapalı) | Ders 1.3–1.4, Kademeli Karar (60), Taksimetre (80), Ruhsat Otopark +100; **TAPU Otopark −300**; GT başladı |
| 3 | 4 | 1.070 | 100 | Otopark L1 | **Otopark AÇILIŞ** (İş Emri 30 dk) |
| 4 | 5 | 1.305 | 293 | Otopark L1 | İlk hasatlar (147 B), ders 1.5, HB başladı |
| 5 | 5 | 1.540 | 585 | Otopark L1 | |
| 6 | 5 | 1.775 | 908 | Otopark L1 | Ruhsat Büfe +100 |
| 7 | 6 | 2.010 | 691 | Otopark L1, Büfe L1 (kapalı) | **Kalfa**; **TAPU Büfe −600**; lig 100 |
| 8 | 6 | 2.535 | 903 | Otopark L1, Büfe L1 | **Büfe AÇILIŞ** |
| 9 | 7 | 2.770 | 1.526 | Otopark L1, Büfe L1 | Ruhsat Manav +100 (slot yok) |
| 10 | 7 | 3.005 | 1.439 | Otopark L1, Büfe L1 | Büfe L2 ücreti −500 |
| 11 | 7 | 3.390 | 1.961 | Otopark L1, Büfe L2 | Büfe → L2 |
| 12 | 7 | 3.655 | 2.934 | Otopark L1, Büfe L2 | **Çarşı Sınavı → Liman** (+500 B, 10 Çip) |
| 13 | 8 | 3.890 | 3.047 | Otopark L1, Büfe L2 | Ders 2.1; Otopark L2 ücreti −500 |
| 14 | 8 | 4.275 | 3.679 | Otopark L2, Büfe L2 | Otopark → L2; lig |
| 15 | 8 | 4.510 | 4.510 | Otopark L2, Büfe L2 | Ruhsat Kargo Deposu +100 (slot yok) |
| 16 | 8 | 4.745 | 5.067 | Otopark L2, Büfe L2 | |
| 17 | 8 | 4.980 | 4.577 | Otopark L2, Büfe L2 | Büfe L3 ücreti −1.200 |
| 18 | 9 | 5.455 | 5.264 | Otopark L2, Büfe L3 | Büfe → L3; Ruhsat Balık Hali +100 |
| 19 | 9 | 5.810 | 6.207 | Otopark L2, Büfe L3 | T2 dersler (2.7+) |
| 20 | 9 | 6.165 | 7.025 | Otopark L2, Büfe L3 | |
| 21 | 9 | 6.520 | 8.228 | Otopark L2, Büfe L3 | Ruhsat Oto Yıkama +100; lig |
| 22 | 10 | 6.875 | 7.027 | Otopark L2, Büfe L3 | **DAİRE −2.000** |
| 23 | 10 | 7.230 | 7.989 | Otopark L2, Büfe L3 | |
| 24 | 10 | 7.585 | 8.948 | Otopark L2, Büfe L3 | Ruhsat Gümrük +100; **Liman dersleri bitti** |
| 25 | 10 | 7.650 | 9.791 | Otopark L2, Büfe L3 | Dersiz gün: HB + GT + kod okuma (65 XP) |
| 26 | 10 | 7.715 | 10.489 | Otopark L2, Büfe L3 | |
| 27 | 10 | 7.780 | 11.332 | Otopark L2, Büfe L3 | |
| 28 | 10 | 7.845 | 12.131 | Otopark L2, Büfe L3 | lig |
| 29 | 10 | 7.910 | 12.973 | Otopark L2, Büfe L3 | |
| 30 | 10 | 7.975 | 13.672 | Otopark L2, Büfe L3 | Sev. 12 için 2.595 XP eksik → ≈40 gün daha |

Özet: 24 ders, 2 işletme, Sev. 10; kaynak 20.494 B, gider 6.822 B (oran 0,33); seri 29; 10 Çip.

### 11.4 Yoğun oyuncu (90 dk/gün)

| Gün | Sev. | Toplam XP | Bayt bakiyesi | İşletmeler | Olaylar |
|---|---|---|---|---|---|
| 1 | 4 | 1.010 | 0 | Otopark L1 | Ders 1.1–1.4 + 4 görev, Ruhsat +100, **TAPU −300**, **Otopark AÇILIŞ aynı oturumda** |
| 2 | 5 | 1.685 | 604 | Otopark L1 | 3 ders, 3 HB, Ruhsat Büfe +100 |
| 3 | 6 | 2.660 | 608 | Otopark L1, Büfe L1 | **Kalfa**; Ruhsat Manav +100; **TAPU Büfe −600; Büfe AÇILIŞ** |
| 4 | 7 | 3.315 | 862 | Otopark L1, Büfe L2 | Büfe L2 (−500) ve kodu |
| 5 | 8 | 4.190 | 1.946 | Otopark L1, Büfe L2 | **Çarşı Sınavı → Liman**; Ruhsat Kargo +100 (slot yok); Otopark L2 ücreti −500 |
| 6 | 8 | 5.015 | 1.830 | Otopark L2, Büfe L2 | Otopark → L2; Ruhsat Balık Hali +100; Büfe L3 ücreti −1.200 |
| 7 | 9 | 6.300 | 3.486 | Otopark L2, Büfe L3 | Büfe → L3; Ruhsat Oto Yıkama +100; lig 250 |
| 8 | 10 | 7.335 | 3.190 | Otopark L2, Büfe L3 | Ruhsat Gümrük +100; **Liman dersleri bitti**; **DAİRE −2.000** |
| 9 | 10 | 7.500 | 4.414 | Otopark L2, Büfe L3 | Dersiz: 3 HB + GT + 3 kod okuma = 165 XP/gün |
| 10 | 10 | 7.665 | 5.638 | Otopark L2, Büfe L3 | |
| 11 | 10 | 7.830 | 6.862 | Otopark L2, Büfe L3 | |
| 12 | 10 | 7.995 | 8.086 | Otopark L2, Büfe L3 | |
| 13 | 10 | 8.160 | 9.310 | Otopark L2, Büfe L3 | |
| 14 | 10 | 8.325 | 10.784 | Otopark L2, Büfe L3 | lig |
| 15 | 10 | 8.490 | 11.936 | Otopark L2, Büfe L3 | |
| 16 | 11 | 8.655 | 13.088 | Otopark L2, Büfe L3 | |
| 17 | 11 | 8.820 | 14.240 | Otopark L2, Büfe L3 | |
| 18 | 11 | 8.985 | 15.392 | Otopark L2, Büfe L3 | |
| 19 | 11 | 9.150 | 16.544 | Otopark L2, Büfe L3 | |
| 20 | 11 | 9.315 | 17.696 | Otopark L2, Büfe L3 | |
| 21 | 11 | 9.480 | 19.098 | Otopark L2, Büfe L3 | lig |
| 22 | 11 | 9.645 | 20.250 | Otopark L2, Büfe L3 | |
| 23 | 11 | 9.810 | 21.402 | Otopark L2, Büfe L3 | |
| 24 | 11 | 9.975 | 22.554 | Otopark L2, Büfe L3 | |
| 25 | 11 | 10.140 | 23.706 | Otopark L2, Büfe L3 | |
| 26 | 11 | 10.305 | 24.858 | Otopark L2, Büfe L3 | |
| 27 | 11 | 10.470 | 26.010 | Otopark L2, Büfe L3 | |
| 28 | 12 | 10.935 | 26.512 | Otopark L2, Büfe L3, Manav L1 | **Zanaatkâr**; 3. slot; **TAPU Manav −900; Manav AÇILIŞ**; lig |
| 29 | 12 | 12.150 | 27.304 | Otopark L2, Büfe L3, Manav L1 | **Liman Sınavı → Atölyeler**; 3 T2 ders; Ruhsat Oto Tamirhane; Otopark L3 (−1.200), Manav L2 (−500) ücretleri |
| 30 | 13 | 13.215 | 27.756 | Otopark L3, Büfe L3, Manav L2 | Otopark → L3; Manav → L2; Manav L3 ücreti −1.200 |

Özet: 29 ders, 3 işletme, Sev. 13; kaynak 41.318 B, gider 13.562 B (oran 0,33); 20 Çip.

### 11.5 Bulgular

1. **Onboarding hedefleri tutuyor.** İlk Bayt üç profilde de 1. gün (20. dakika); tapu normalde 2. gün (2. oturum), yoğunda 1. gün 70. dakika, hafifte 7. gün; Otopark Açılış'ı normalde 3. gün (72 saat KPI'ı içinde), yoğunda 1. gün, hafifte 8. gün. Otopark geri ödemesi normal oyuncuda 2 gündür (A ile aynı).
2. **Kalfa bandı XP duvarı (ana bulgu).** Normal oyuncu 24. günde Çarşı + Liman'ın 24 dersini bitirip Sev. 10'da kalır; Sev. 12 için 2.595 XP'yi günde 65 XP ile ≈40 günde toplar. Yoğun oyuncu aynı duvara 8. günde çarpar ve 20 gün 165 XP/gün ile bekler; 30 günün 20'si dersizdir. D30 ≥ %8 hedefi (A §13) için bu kabul edilemez; en yoğun oyuncular en erken sıkılır.
3. **Lavabo açığı.** Gider/kaynak 0,33–0,48; normal oyuncu 30. günde 13.672 B, yoğun 27.756 B ile oturur. Alınacak işletme yok (slot), yükseltmeler bitmiş, Pazar 40 kozmetik + 25 eşya ≈ 11.750 B'lik toplam katalogla tükenmiş. §6.3 lavaboları ve haftalık Nadir rotasyonu MVP kapsamına alınmalıdır (en az dekorasyon ve rotasyon).
4. **Hafif oyuncunun Günlük Tekrar'ı.** 10 dakikalık günde ders (8 dk) + GT (3 dk) sığmaz; seri iki günde bir kırılır. Çözüm: GT'yi 5 soru / 3 dakikadan 5 soru / 2 dakikaya indirmek değil (KANON), ders kartlarını 6 dakikaya sıkıştırmak ya da hafif oyuncuya "önce 3 dakikalık Günlük Tekrar, dersi yarın" akışı önermek (istemci kararı, bkz. B8).
5. **Çip kazanımı** 30 günde normalde 10, yoğunda 20; ikisi de MVP Butiği'nin İsim rengi (20 Çip) hedefini gösterir — "premium tadı" tasarlandığı gibi çalışır.
6. **Semt Sınavı zamanlaması** normal oyuncuda 12. gün, yoğunda 5. gün, hafifte 28. gün: A'nın "makro döngü 1–2 hafta" hedefiyle uyumludur.

### 11.6 Varyantlar

İki varyant aynı betikle koşuldu; tablo 7/14/21/30. gün kesitleridir.

**Varyant A — slot tavanı `2 + ⌊seviye/3⌋` + Kod Düellosu (v1.1):**

| Profil | Gün 7 | Gün 14 | Gün 21 | Gün 30 | Gider/kaynak |
|---|---|---|---|---|---|
| Normal | Sev. 6, 761 B, 2 işletme | Sev. 8, 4.084 B, 3 (Manav alındı) | Sev. 10, 5.561 B, 4 (Kargo) | Sev. 12, 16.892 B, 6 işletme (Balık Hali, Oto Yıkama) | 0,48 |
| Yoğun | Sev. 10, 237 B, 4 | Sev. 13, 15.337 B, 6 | Sev. 15, 57.004 B, 7 | Sev. 17, 120.533 B, 7 (slot yine dolu; Atölyeler tapuları 1 günlük gelir) | 0,18 |

Sonuç: XP duvarı kalkar ama yoğun oyuncu Sev. 15'te 7 işletmeyle ≈7.000 B/gün kazanır, 120 bin B biriktirir, fiyat merdiveni çöker. Slot gevşetme ancak fiyat yeniden endekslenirse düşünülebilir.

**Varyant B — KANON slot tavanı + Staj modu + Kod Düellosu (v1.1):**

| Profil | Gün 7 | Gün 14 | Gün 21 | Gün 30 | Gider/kaynak |
|---|---|---|---|---|---|
| Normal | Sev. 6, 761 B, 2 | Sev. 8, 4.224 B, 2 (+ Staj Manav) | Sev. 10, 4.971 B, 2 (+ Staj Kargo) | **Sev. 12**, 12.074 B, 3 (Manav Staj'dan anında Açık) + 4 Staj Belgesi | 0,41 |
| Yoğun | Sev. 10, 392 B, 2 (+ Staj Manav, Kargo) | **Sev. 14**, 10.961 B, 3 (Liman Sınavı 11. gün, Atölyeler açık) | Sev. 15, 28.968 B, 3 (+ 7 Staj) | Sev. 17, 51.457 B, 3 (+ 8 Staj; Atölyeler dersleri 17. günde bitti) | 0,21 |

Sonuç: Bayt eğrisi KANON temeline yakın kalır (normal oyuncu 30. günde 12.074 B), XP duvarı 28. günden 10.–11. güne çekilir, fiyat merdiveni korunur. Yoğun oyuncu bu kez Zanaatkâr bandında (Sev. 15–17) dersiz kalır; bu artık slot sorunu değil, §4.5'teki eğri/arz sorunudur ve Düello + lonca görevleriyle ya da eğri düzeltmesiyle çözülür. **B2'nin önerisi Varyant B'dir.**

---

## 12. Pacing hedefleri

| Hedef | Değer | Kaynak / ölçüm |
|---|---|---|
| İlk Bayt | ≤ 20. dakika (%70 oyuncu) | KANON; Meydan Saati 40 B |
| İlk işletme (Otopark tapusu) | Hedef **70. dakika**; en geç 2. oturum (%50); hafif profilde ≤ 7. gün | A §4; §11: normal 2. gün, yoğun 1. gün, hafif 7. gün |
| Otopark L1 tamamlanma (Açılış) | Tapu + ≈30 dk İş Emri; hedef ≤ 100. etkin dakika ve **72 saat içinde %35** | A KPI; §11: yoğun 1. gün, normal 3. gün, hafif 8. gün |
| Otopark geri ödeme | 1,4 gün (tam toplama), 2 gün (2 toplama) | §7.1 |
| 2. işletme | Sev. 6 (slot); normal 7. gün, yoğun 3. gün, hafif 17. gün | §11 |
| İlk Semt Sınavı (Liman) | Normal ≤ 14. gün, yoğun ≤ 7. gün | §11: 12 / 5 / 28 |
| Sev. 12 / Atölyeler | Normal ≤ 30 gün (Staj + Düello ile 28–30; KANON temelinde ≈70) | §11.6 |
| Sev. 18 / Kampüs | Etkin 31 saat; normal ≈ 53 gün (içerik dolu) | §2.3 |
| Sev. 40 / Bulut Tepesi | Etkin 136 saat; normal ≈ 233 gün, yoğun ≈ 91 gün (içerik dolu); KANON arzıyla normal ≈ 20+ ay | §2.3, §4.5 |
| Sev. 60 / Efsane | Etkin **≈292 saat**; normal ≈ 500 gün, yoğun ≈ 194 gün (içerik dolu); ayrıca 10 Mentor kilometre taşı | §2.3; A'nın "~1 yıl" hedefi için §14 soru 1 |
| Her oturumda bir tur | 15–20 dk'da Öğren → Göster | A §3; normal profil günde 1 tur + hasat |
| Gider/kaynak | 0,7–0,9 (haftalık) | §10.5; MVP simülasyonu 0,33–0,48 → lavabo paketi şart |

---

## 13. Varsayımlar

1. **İçerik envanteri:** Çarşı 12, Liman 12 (MVP 6), Atölyeler 14, Kampüs 16, Finans Bölgesi 16, Veri Vadisi 14, Bulut Tepesi 16 ders; her derste 1 görev; 3 ardışık görev bir işletmenin Ruhsat'ıdır (Otopark 1.2–1.4, Büfe 1.5–1.7, Manav 1.8–1.10, Kargo 2.1–2.3, Balık Hali 2.4–2.6, Oto Yıkama 2.7–2.9, Gümrük 2.10–2.12). Liman'ın ilk 6 dersi T1, son 6'sı T2 değerleriyle ödüllendirilir.
2. **Etkin XP/saat** bant tablosu (§2.3) KANON değerleri ve A sürelerinden türetilmiştir; gerçek değer kalibrasyonla ±%20 oynayabilir.
3. **Ders XP'si** planlama değeri olarak 100 (T1) alınmıştır; gerçekleşen ortalama puana bağlıdır (§4.3). Görev XP'sine ortalama 10 XP bonus (kod incelemesi, Berrak Zihin, parlak karışımı) eklenmiştir.
4. **İşletme L1 gelirleri** (Otopark dışında) B2 tasarımıdır; referans çözümlerin sentetik trafikte bu TL toplamlarını üretecek şekilde ayarlanması işletme kataloğu belgesinin işidir (bkz. B5). ×1,6 seviye çarpanı tüm işletmelerde Otopark'la aynı alınmıştır.
5. **Toplama davranışı:** hafif 1, normal 2, yoğun 3 toplama/gün; kasa dolduktan sonra üretim durur ve kayıp sayılmaz.
6. **Hata Bildirimi ödülü** 40–120 B aralığında ortalama 60 B (T1) ve 80 B (T2) alınmıştır; zorluk dağılımı eşit varsayılmıştır.
7. **Kozmetik harcama eğilimi** profil başına sabit kabul edilmiştir (§11.1); gerçek elastikiyet H9–10 kapalı betada ölçülür.
8. **Yükseltme dersleri:** Otopark L2 Liman 2.1, Büfe L2 Çarşı 1.11, Büfe L3 Liman 2.5, Otopark L3 Atölyeler 3.4 (B4 kesinleştirdi; KANON §12.3) varsayılmıştır; müfredat belgesi (bkz. B4) kesinleştirir.
9. **Çip kuru** 100 Çip = 59,99 TL; dönüşüm %2–3; paket bonusları +%4 / +%12 / +%20; mağaza komisyonu web'de yok.
10. **Lonca bonusu** v1.1'de 5–30 üyeli loncalar için üye başına %2, en çok %10 kabul edilmiştir; lonca görevi tanımı sosyal belgede (bkz. B6).
11. **Mesai Bonusu** B2 önerisidir; simülasyon KANON temeliyle (×1,0) koşulmuştur.
12. **Günlük sınırlar** 04:00 TR'de sıfırlanır; lig Pazar 21:00 kapanır (KANON).
13. **Profil karışımı** 1.000 DAU'da %25 hafif / %60 normal / %15 yoğun; D30 kohortunun 30 günlük değerleri dolaşım projeksiyonunda kullanılmıştır.
14. **Semt Sınavı kapısı** KANON tablosundaki gibi "seviye + sınav" alınmıştır; A §6'daki "önceki semtte bir işletme L2" koşulu Liman için Otopark L2'nin Liman dersi gerektirmesi nedeniyle uygulanamaz, ikinci geçişten itibaren geçerli sayılmıştır (bkz. §14 soru 5).

## 14. Açık Sorular

1. **Geç oyun pacing'i:** A'nın "~6 ayda Tier 4, ~1 yılda tavan" hedefi KANON eğrisi ve XP kaynaklarıyla tutmuyor (normal oyuncu içerik doluyken Sev. 40'a 233 gün, Sev. 60'a 500 gün; KANON tekrarlanabilir arzıyla Sev. 40 ≈ 20+ ay). Karar: XP arzını artırmak mı (Ek A: Düello tier XP'si, Lonca görevi XP'si, HB 3 → 5, Semt Sınavı tier XP'si), eğriyi düzleştirmek mi (`80 × L^1,2`: Toplam(40) 118.360 / Toplam(60) 291.490; `70 × L^1,2`: 103.540 / 255.040), yoksa 40–59 bandını bilinçli "prestij bandı" ilan edip hedef cümleyi değiştirmek mi?
2. **Sev. 60'ın anlamı:** Efsane için 10 Mentor kilometre taşı v1.2'de gelir; v1.0–1.1'de Sev. 60'a ulaşan oyuncu ne görür? Öneri: "Şehir Mimarı (Efsane adayı)" etiketi ve Mentor sayacı.
3. **Staj modu** (Ek A-1) KANON v1.1'e alınacak mı? Alınırsa Staj Belgesi profilde nasıl görünür, Vitrin'de Staj kodu sergilenebilir mi (gelirsiz işletmenin kodunu göstermek kopyayı artırır mı)?
4. **Slot tavanı** `1 + ⌊seviye/6⌋` kalıyorsa katalogdaki açılış seviyeleri (Büfe 4, Manav 5, Balık Hali 8, Oto Yıkama 9, Gümrük 10) oyuncuya "alabilirsin ama slotun yok" diye mi gösterilecek, yoksa tabela "slot: Sev. 12" mi yazacak? İstemci metni (bkz. B8).
5. **Semt kapısındaki "önceki semtte bir işletme L2" koşulu** (A §6) Liman için döngüseldir (Otopark L2 Liman dersi ister). KANON tablosu bu koşulu içermiyor; A ile KANON arasındaki fark kayda geçmeli; Büfe L2'nin yalnızca Çarşı içeriğiyle yapılabilir olması (B2 varsayımı 8) müfredatça doğrulanmalı.
6. **Yükseltme fiyatlarının tier'a endekslenmesi** (Ek A-6): KANON'un sabit 500/1.200/2.500/5.000'i T3–T4'te lavabo olmaktan çıkıyor; endeksleme onaylanırsa Banka L2 2.000 B, Yemek Sipariş L5 40.000 B.
7. **Büyük Kasa** (A açık soru 3): Bayt ile 1.500 B, Sev. 18, işletme başına, +4 saat — onay bekliyor; "asla Çip" ilkesi korunur.
8. **Belediye Projeleri'nin** shard bazlı hedefleri (50.000–500.000 B) ve katkı sıralamasının Liderlik Panosu'na girip girmeyeceği (girmezse "sessiz bağış", girerse "hayırseverlik yarışı" riski).
9. **Semt pazarı fiyat çarpanı** (Ek A-7): Kampüs ×5, Bulut ×25 — kademe adları sabit kalsa da KANON'un "kıyafet 30–800 B" aralığını fiilen aşar; KANON v1.1 kararı gerekir.
10. **Çip iadesi ve hesap silme:** harcanmamış Çip'in 14 günde iadesi ve KVKK silmede kalan Çip'in akıbeti hukuk doğrulaması bekliyor; 15–17 aylık tavanın (300 Çip) velice değiştirilebilmesi akışı (bkz. B9 / hukuk).
11. **Hafif oyuncunun Günlük Tekrar'ı** 10 dakikalık güne dersle birlikte sığmıyor (§11.5 bulgu 4); istemci "önce GT" önerisi mi, ders kartı sayısının 4'e inmesi mi?
12. **Lig Bayt ödülünün** haftalık XP'ye değil "haftalık yeni mühür + görev" sayısına bağlanması: XP tier ile büyüdüğü için üst bantlar aynı kovada alt bantları ezer; kovaların unvan bandına göre kurulması yeterli mi?
13. **Mesai Bonusu** (Ek A-4) A'nın "giriş takvimi yok" ilkesiyle uyumlu sayılacak mı? Alternatif: bonusu yalnızca Günlük Tekrar'a bağlamak (zaten 20 B veriyor) ve pasif gelire dokunmamak.
14. **Alkış tavanı 40 B/gün** çok ziyaret alan oyuncular için (LED pano, "en çok ziyaret edilen") anlamlı mı; tavan kalksa sosyal pay %5'i aşar mı?

## 15. Diğer Belgelere Bağımlılıklar

Belge id'leri 03-ajan-talimati §2 ile hizalanmıştır (3 Kasım düzeltmesi: C1 → B7, C2 → B8, D1 → B9).

| Boyut | Bu belgenin beklediği / verdiği | Uyum koşulu |
|---|---|---|
| **KANON** (sabitler) | B2 tüm sayıları KANON v1'den alır; Ek A'daki 10 öneri KANON v1.1 kararı bekler | Bir öneri onaylanınca §2–§11 tabloları yeniden üretilir (`b2_calc.py`, `b2_sim.py`) |
| **A** (vizyon) | Çekirdek döngü, onboarding dakikaları, Bayt dağılım hedefi (60/20/8/7/5), "3–5 günlük gelir" kuralı | §12 pacing hedefleri A §4 ve §13 KPI'larıyla aynı |
| **B1 — Şehir / dünya** | Semt kapıları, Pazar şubeleri (semt pazarı çarpanı), Belediye Projeleri'nin Meydan'daki görünümü, işletme içi 20 dekorasyon yeri | İşletme iç mekân ızgarası ve Vitrin yerleşimi B1'de tanımlanmalı |
| **B3 — Eğitim & Kurul** | Rubrik 50/30/20, eşikler 70/85, 2 deneme, Telafi Turu; B2 bunlardan XP eşlemesini (§4.2) ve Ders XP tavanını (§4.3) türetir | Kurul puanı değişirse §4.2 tablosu yeniden hesaplanır; AI kotası XP gecikmesi B3'ün Batch akışıyla aynı olmalı |
| **B4 — Müfredat** | Ders sayıları (varsayım 1), görev Bayt sırası (40/50/60/80 → ×2/×4/×8), yükseltme derslerinin hangi semtte olduğu (varsayım 8), Ruhsat gruplamaları | Her işletmenin L2–L5 müşteri isteği için gereken ders B4'te etiketlenmeli ("yükseltme kapısı") |
| **B5 — İşletme kataloğu** | §7.1'deki L1 gelir hedefleri; her işletme için sentetik trafik dağılımı ve referans çözüm bu hedefi üretmeli; Staj modu akışı (Tapu → İş Emri yerine Atölye → İş Emri) | Referans çözüm TL toplamı ± %5 içinde §7.1'e uymalı |
| **B6 — Görevler / sosyal / lonca** | Hata Bildirimi günde 3 ve 40–120 B; Düello 15 B + 50 XP günde 5; lonca görevi payı 100–300 B; lonca bonusu üye başına %2 (en çok %10); davet 100 B iki tarafa; alkış 2 B / 40 B tavan | Lonca içi inceleme XP'si (20) ve mentor kilometre taşı (50) B6/B3 ile aynı |
| **B7 — Backend mimarisi** | Gece batch (deterministik tohum, günde 1 çalıştırma, önbellek), saatlik kasa tik'i, Bayt tam sayı ve kesir birikimi, günlük sınır sıfırlama 04:00 TR, ekonomi panosu metrikleri (§10.5) için olay şeması (`BaytKazanildi{kaynak, miktar}`, `BaytHarcandi{lavabo, miktar}`) | Her Bayt olayının kaynak etiketi taşıması; referans tavanı sandbox'ta uygulanır, istemciye güvenilmez |
| **B8 — İstemci / ekranlar** | HUD hedef çubuğu ("Hedef: Büfe 600 B"), kasa ikonu durumları, Seviye Hediyesi kartı, Unvan Töreni, Rütbe Rafı, slot bilgisinin tabelada gösterimi, Çip paketi ekranındaki yaş tavanı ve iade metni | "Hepsini Topla" Sev. 12'de; Büyük Kasa İşletme Paneli'nde |
| **B9 — Ürün / KPI / hukuk** | Çip paketleri ve 15–17 tavanı, iade politikası, gelir beklentisi (ödeme isteği ölçümü), D30 hedefi için XP duvarının önceliklendirilmesi, H6 10.000 bot simülasyonunun bu belgenin tablolarını girdi alması | KVKK/tüketici mevzuatı doğrulaması; A/B planına Staj modu eklenmesi |

---

## Ek A. Sabit değişiklik önerileri (constants_proposed)

Hepsi KANON v1.1 adayıdır; onaylanana kadar bu belge KANON değerlerini kullanır.

| # | Sabit | KANON v1 | B2 önerisi | Gerekçe (sayfa) |
|---|---|---|---|---|
| A-1 | Staj modu | Yok | Slotu olmayan oyuncu Ruhsat'lı işletmenin İş Emri'ni Atölye'de kodlar; açılış XP'si tam, gelir yok; tapu alınınca anında Açık | §7.4, §11.6: normal oyuncu Sev. 12'ye 45 → 28 gün; fiyat merdiveni korunur |
| A-2 | Kod Düellosu XP (v1.1) | 50 sabit | Tier'a endeksli 50 / 80 / 120 / 160; günde 5 | §4.5: geç bant tekrarlanabilir arzı |
| A-3 | Lonca haftalık görevi XP (v1.1) | Tanımsız | 300 / 500 / 800 / 1.200 (tier); Bayt payı 100–300 B | §4.5 |
| A-4 | Mesai Bonusu | Yok (×1,0) | Öğrenme eylemi yapılan gün işletme üretimi ×1,15 | §8.4; "her Bayt bir öğrenme eyleminin arkasında" |
| A-5 | Lonca gelir bonusu (v1.1) | Yok | 1,0 + 0,02 × min(görev bitiren üye, 5), en çok ×1,10 | §8.1 |
| A-6 | Yükseltme fiyatları | 500 / 1.200 / 2.500 / 5.000 (sabit) | × tier çarpanı (T1 ×1, T2 ×2, T3 ×4, T4 ×8) | §7.3: T4'te 500 B'lik L2 lavabo değil |
| A-7 | Semt pazarı fiyat çarpanı | Kıyafet 30–800, eşya 40–400 her yerde | Çarşı–Atölyeler ×1, Kampüs–Veri ×5, Bulut ×25 (kademe adları sabit) | §9.1: Sev. 30'da 800 B ≈ 1 saatlik gelir |
| A-8 | Büyük Kasa | Yok (A açık soru 3) | 1.500 B, Sev. 18, işletme başına 1, kasa tavanı 8 → 12 saat; asla Çip | §6.3, §10.6 |
| A-9 | Hata Bildirimi günlük tavanı | 3 | Oyuncunun açık semtindeki tüm dersler bittiğinde 5 | §4.4–4.5: dersiz günlerde XP arzı |
| A-10 | Semt Sınavı XP | 200 sabit | 200 / 400 / 800 / 1.200 (tier); Bayt ve Çip sabit | §4.5 |
| A-11 | Yeni lavabolar (MVP kapsamına) | Yok | İşletme içi dekorasyon (100–600 B, 20 yer), Nadir haftalık rotasyon 6 slot + numaralı seri, Belediye Projeleri (100/500/2.000 B katkı) | §6.3, §11.5: gider/kaynak 0,33 → 0,7 |
| A-12 | XP eğrisi (yalnızca karar için) | `80 × L^1,35`, Toplam(60) 503.680 | Alternatifler: `80 × L^1,2` (Toplam(40) 118.360, Toplam(60) 291.490) veya `70 × L^1,2` (103.540 / 255.040) | §4.5, §14 soru 1; yapısal (v2) |

---

**Revizyon Notu (3 Kasım).** KANON v2 (§12) uyumu: 3 yerde 13–17 → 15–17; Çip limiti 15–17: varsayılan 0, platform üst sınırı 300 Çip/ay, Sandık/Konteyner her zaman veli onayı (§9.3); belge kimlikleri C1/C2/D1 → B7/B8/B9; Otopark L3 kapısı 3.4 (B4); sezon 8–9 hafta (B6). Ek A kararları (KANON §12.3): A-1, A-3, A-5, A-6, A-7, A-8, A-9 ertelendi (v1.1/v1.2); A-2, A-4, A-10, A-12 reddedildi; A-11 kısmen kabul (Nadir haftalık rotasyon 6 slot). Geç oyun pacing sorusu (§14.1) kurucu kararına bırakıldı. Ayrıntı: `_KANON-v2-degisiklikler.md`.
