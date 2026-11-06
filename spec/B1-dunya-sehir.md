# B1 — KodKent Dünya & Şehir Tasarımı

**Belge id:** B1 · **Sürüm:** v1 · **Tarih:** 2026-11-02 · **Rol:** Kıdemli dünya/seviye tasarımcısı ve sanat yönetmeni (izometrik sosyal oyunlar) · **Bağlayıcı kaynaklar:** `00-fikir.md`, `A-vizyon-FINAL.md`, `KANON.md v1`

> Bu belge şehrin fiziksel ve görsel gerçeğini tanımlar: ızgara ve projeksiyon, semtlerin yerleşimi, her semtin binaları ve sesleri, Akademi'nin iç mekânı, oyuncu Odası, işletme arsalarının her durumu (özellikle Otopark'ın "Satılık"tan L5'e yolculuğu), avatar ve emote sistemi, Usta NPC'lerin görünüşü ve ağzı, gece/gündüz ve mevsim, navigasyon ve instance modeli. KANON v1'deki bütün isimler ve sayılar aynen kullanılmıştır. KANON'da bulunmayan ve burada ilk kez tanımlanan her sayı metin içinde **(B1 önerisi)** etiketini taşır ve §14'te tek tabloda toplanmıştır; bunlar KANON v1.1'e aday sabitlerdir. Diğer belgelere id ile atıf yapılır: VİZYON çekirdek döngü, B2 ilerleme & ekonomi, B3 eğitim sistemi/AI, B4 müfredat, B5 işletmeler & kod, B6 görevler/sosyal/canlı operasyon, B7 backend, B8 istemci/ekranlar, B9 ürün/yol haritası (eşleme 3 Kasım'da 03-ajan-talimati §2'ye göre düzeltildi; bkz. §15).

---

## 0. Tasarım hedefleri ve üç dünya kuralı

KodKent'in dünyası iki şeyi aynı anda yapmak zorundadır: Sanalika'nın "arkadaşlarımla takıldığım, odamı döşediğim, kıyafetimle hava attığım şehir" hissini vermek ve her sokağın, her tabelanın, her ışığın bir C# satırına bağlı olduğunu oyuncuya hissettirmek. Bu iki hedef çatışmaz; doğru kurulursa birbirini besler. Sanalika'da statü satın alınır, KodKent'te statü derlenir. Dünya tasarımının bütün kararları şu üç kurala göre verilmiştir:

**Kural 1 — Her ışık bir koddur.** Vizyon belgesinin ilk ilkesi ("Görünmeyen kod yoktur") dünyaya şöyle çevrilir: şehirde yanan her işletme ışığı bir oyuncunun derlenmiş kodudur; NPC işletmeler bile "Belediye'nin yazılımı" tabelasıyla bunu söyler. Kararmış bir tabela ("Kararmış" durumu, KANON §8) ayıp değil, hikâyedir: "Burada kod bozuldu, sahibi Müfettiş'in dosyasını bekliyor." Bu kural, dünyadaki hiçbir süslemenin keyfi olmamasını ister: tente, vinç, kıvılcım, neon ve bulut motifleri semtin C# konu kümesinin görsel metaforudur (§3).

**Kural 2 — Kalabalık hissi, boş şehir riskini yener.** Vizyonun 4 numaralı riski "boş şehir"dir. Dünya, 40 avatarlık shard'lar, öne çıkarılan gerçek oyuncu işletmeleri, figüran NPC'ler ve asenkron izler (ayak izi, ziyaretçi defteri, Alkış sayacı, LED panoda akan adlar) ile ilk haftaların az nüfusunda bile yaşıyor görünmelidir. Her sahne, içinde tek bir oyuncu bile olsa hareket eder: tramvay geçer, martı uçar, NPC araba otoparka girer, pano akar.

**Kural 3 — Mobilde okunur, masaüstünde yazılır; ama şehir her yerde aynıdır.** KANON'un platform ilkesi dünya için şu anlama gelir: izometrik sahne telefonda dikey HUD ile tam gezilebilir olmalı, tile ve yazı boyutları 375 px genişlikte okunmalı; kod yazma yüzeyleri (Atölye, İşletme Editörü) masaüstünde açıldığında aynı sahnenin içinde, dünyadan kopmadan açılmalıdır. Dünya hiçbir platformda "küçültülmüş sürüm" değildir.

Bu belgedeki "Tier" sözcüğü KANON'daki anlamıyla **semt zorluk katmanıdır** (T1–T4); işletmenin kendi içindeki kademe **işletme seviyesidir** (L1–L5). Görev metnindeki "Tier yükseltmelerinde görsel değişim" ifadesi iki eksende karşılanmıştır: §6.3 işletme seviyesi (L1→L5) değişimlerini, §6.4 dört Tier'ın bina sınıfını verir.

---

## 1. İzometrik teknik temel

### 1.1 Projeksiyon ve tile

Şehir, klasik sosyal oyun geleneğine (Habbo, Sanalika) sadık kalarak **2:1 dimetrik ("izometrik") projeksiyon** ile çizilir. Temel tile, zoom 1,0'da **64 × 32 px**'dir; kaynak varlıklar retina ve zoom 1,5 için **128 × 64 px** (2×) üretilir ve PixiJS'te `resolution` ile düşürülür. 2:1 oranı piksel sanatı için zorunludur: tile kenarları "2 piksel sağa, 1 piksel aşağı" merdiveniyle çizilir, anti-alias gerekmez, sprite'lar her zoom'da keskin kalır.

Dikey birimler **(B1 önerisi)**: bir **kat yüksekliği 48 px** (1,5 tile yüksekliği), bir **duvar parçası** 1 tile geniş × 1 kat yüksek, **avatar boyu 96 px** (2 kat; omuz genişliği 40 px, baş 28 px). 96 px'lik avatar Habbo'nun 110 px'inden biraz kısa, Sanalika'nınkine yakındır; mobilde 1,0 zoom'da yüz ifadesi ve şapka okunur, 40 avatarlık Meydan'da sahne tıkanmaz. Bir araba (Otopark NPC trafiği) 2 × 1 tile ayak izinde 128 × 72 px'dir.

### 1.2 Koordinat dönüşümü

Dünya koordinatı `(gx, gy, gz)` tam sayı ızgara hücresidir; `gz` kat sayısıdır. Ekran koordinatı sahne orijinine göre hesaplanır (B7/B8 bu formülleri paylaşır; tek kaynak burasıdır):

```ts
export const TILE_W = 64, TILE_H = 32, FLOOR_H = 48;

export function toScreen(gx: number, gy: number, gz = 0) {
  return {
    sx: (gx - gy) * (TILE_W / 2),
    sy: (gx + gy) * (TILE_H / 2) - gz * FLOOR_H,
  };
}

export function toGrid(sx: number, sy: number) {          // tıklama → hücre
  const a = sx / (TILE_W / 2), b = sy / (TILE_H / 2);
  return { gx: Math.floor((a + b) / 2), gy: Math.floor((b - a) / 2) };
}

// Derinlik anahtarı: ayak izi (w × h) için kameraya en yakın köşe
export function depthKey(gx: number, gy: number, gz: number, w = 1, h = 1) {
  return (gx + w - 1) + (gy + h - 1) + gz * 0.001;
}
```

Tıklama, `toGrid` ile hücreye çevrilir; hücre yürünebilir maskede (`walkable` bitset, sahne başına `W × H / 8` bayt) işaretliyse A* çalışır. Mobilde dokunma hedefinin 6 px'lik "yapışma" toleransı vardır: hücrenin kenarına basan parmak en yakın yürünebilir hücreye yapışır.

### 1.3 Derinlik sıralaması ve katmanlar

Sahne, alttan üste şu katmanlarla çizilir; katman içi sıralama `depthKey` ile yapılır:

| # | Katman | İçerik | Sıralama |
|---|---|---|---|
| 0 | Gökyüzü/arka plan | Semt ufku (paralaks 0,2), bulut, deniz | Sabit |
| 1 | Zemin | Tile'lar, yol, su, çim; chunk başına tek mesh | Chunk sırası |
| 2 | Zemin dekoru | Çizgiler, rögar, halı, ayak izi, yol çizgisi | depthKey |
| 3 | Gölgeler | Avatar ve nesne gölgeleri (yarı saydam elips) | depthKey |
| 4 | Dünya nesneleri | Binalar, eşyalar, avatarlar, NPC'ler, araçlar | depthKey (karışık) |
| 5 | Işık katmanı | Emissive sprite'lar (tabela, lamba, neon); gece `ADD` blend | depthKey |
| 6 | Parçacıklar | Konfeti, kıvılcım, martı, yaprak, kar | Zaman |
| 7 | Gece/hava overlay | Tüm sahneye renk tonu (bkz. §9) | Sabit |
| 8 | Dünya UI | İsim etiketleri, sohbet balonları, "!" işaretleri, kasa ikonu | Ekran uzayı, çakışma çözümlü |
| 9 | HUD | React katmanı (XP, Bayt, Çip, görev kartı) | — |

Binalar tek parça değil **modüler**dir: ayak izi, duvar parçaları, çatı, tabela ve "ek" (bariyer, kat, otomat) ayrı sprite'lardır. Bu, Otopark'ın beş seviyesini beş ayrı bina çizmeden mümkün kılar (§6.3) ve piksel sanatçısı yükünü üçte bire indirir.

### 1.4 Sahne boyutları

Şehir tek sürekli dünya değil, **kapılarla bağlı sahneler**dir (gerekçe §11.1). Her sahne 16 × 16 tile'lık chunk'lara bölünür; görünüm alanı + 2 tile dışındaki chunk'lar çizilmez. Sahne boyutları **(B1 önerisi)**:

| Sahne | Izgara (tile) | Ekran boyutu (px, zoom 1,0) | Kapasite | Not |
|---|---|---|---|---|
| Derleyici Meydanı | 40 × 40 | 2.560 × 1.280 | 40 (KANON) | Merkez 16 × 16 açık alan |
| Akademi — Lobi (rotonda) | 28 × 20 | 1.536 × 768 | 40 | 7 Kürsü kapısı |
| Akademi — Kürsü (× 7) | 12 × 10 | 704 × 352 | 12 | Derslik |
| Akademi — Atölye | 16 × 12 | 896 × 448 | 20 | Görev alanı |
| Semt Ana Caddesi | 48 × 36 … 64 × 48 | semte göre | 40 | Kamusal shard |
| Semt Ara Sokağı | 40 × 24 … 52 × 32 | semte göre | 20 | 6 parsel (§6.1) |
| İşletme içi | 10 × 8 … 16 × 12 | — | 15 (KANON) | T1 açık işletmelerde iç mekân yok |
| Bloklar — Blok Sokağı | 36 × 24 | 1.920 × 960 | 40 | Oda kapıları |
| Oda — Stüdyo | 6 × 6 (+ 2 duvar) | 512 × 288 | 20 (KANON) | 25 eşya |
| Oda — Daire | 8 × 8 | 640 × 352 | 20 | MVP+1 |
| Oda — Çatı Katı | 8 × 6 + 6 × 6 | — | 20 | MVP+1, iki oda |
| Pazar (iç) | 14 × 10 | 768 × 384 | 20 | Raflar + mankenler |

Yürünebilir alan toplamı (MVP: Meydan + Çarşı + Liman + Bloklar + Akademi) ≈ 9.000 tile; tam şehirde ≈ 24.000 tile. Hiçbir sahne tek seferde 4.096 tile'dan büyük değildir; bu, 4 GB RAM'li telefonda tek atlasla 60 fps hedefinin sınırıdır (B8 doğrulayacak).

### 1.5 Zoom, çözünürlük ve varlık bütçesi

| Öğe | Değer |
|---|---|
| Zoom kademeleri | Masaüstü 0,75 / 1,0 / 1,5 (tekerlek, kademeli); mobil 1,0 / 1,5 (pinch, en yakına yapışır) |
| En küçük okunur yazı | Dünya içi 12 px (isim etiketi), tabela 14 px; HUD 14 px |
| Atlas | 2.048 × 2.048, semt başına 2–3 atlas; avatar temel 1 atlas; kıyafet paketleri 512 × 512 "yama" atlasları (isteğe bağlı yükleme) |
| İlk yükleme (Meydan + Akademi Lobi + avatar temel) | ≤ 3,5 MB sıkıştırılmış (WebP/Basis); 4G'de ilk boyama < 3 sn |
| Semt geçişi | Hedef semt atlası kapıya 8 tile yaklaşınca önyüklenir; geçiş ≤ 1 sn |
| Animasyon | 12 fps sprite animasyonu (piksel sanatı için doğal), 60 fps hareket enterpolasyonu |
| Hareket azaltma | `prefers-reduced-motion` → parçacık kapalı, pano kaydırma yerine sayfalama, konfeti tek kare |

### 1.6 Sanat yönetimi: stil kılavuzu

Stil, **temiz piksel sanatı**dır: 2× kaynakta çizilir, dış hat yok, iç hatlar nesnenin koyu tonuyla; ışık her sahnede sabit **sol üstten (kuzeybatı)** gelir, gölgeler sağ alta düşer ve yumuşak değil, 2 tonlu "pixel dither"dır. Renk disiplini: **ortak 32 renklik şehir paleti** (zemin, gökyüzü, ten, metal) + **semt başına 24 vurgu rengi**. Böylece bir Çarşı tentesi Liman'a taşınsa bile yabancı durur; semt kimliği renkle, motifle ve sesle üç katmanda okunur.

Tipografi: HUD ve kartlar için `Nunito` (Türkçe karakter seti tam, yuvarlak, 13–25 yaşa sıcak); dünya içi tabelalar için tasarlanacak **"KodKent Tabela"** 8 px piksel fontu (büyük harf, Türkçe İ/Ş/Ğ dâhil); LED pano için 5 × 7 nokta matris. Kod gösteren her yüzeyde (Vitrin, LED pano çıktısı, Çalışma Masası) `JetBrains Mono` kullanılır; oyuncu, oyunun dışındaki editörle aynı harfleri görür (vizyonun üçüncü "aha" anı: kod Visual Studio'da aynen derlenir).

Durum renkleri hiçbir zaman tek başına renkle anlatılmaz (renk körlüğü): her duruma şekil ve kısa metin eşlik eder. Açık = yeşil dolu daire + "AÇIK"; Deneme = sarı yarım daire + "DENEME"; Kararmış = gri çarpı + "KARARMIŞ"; Kapalı = kırmızı çizgi + "KAPALI — yazılım bekliyor"; Satılık = mavi "S" etiketi.

---

## 2. Şehir makro planı

### 2.1 Halka modeli ve pusula

Şehir, Derleyici Meydanı'ndan dışa açılan halkalardır; halka sırası, semtlerin açılış sırasıyla örtüşür. Oyuncu Meydan'da durduğunda ilerlemenin coğrafyasını görür: doğuda tenteler (Çarşı, Sev. 1), güneydoğuda vinçler (Liman, Sev. 6), batıda bacalar (Atölyeler, Sev. 12), kuzeybatıda ağaçlar ve amfi (Kampüs, Sev. 18), kuzeydoğuda cam kuleler (Finans Bölgesi, Sev. 25), güneybatıda sunucu çiftliğinin ışıkları ve nehir (Veri Vadisi, Sev. 32), kuzeyde Akademi'nin arkasında yükselen tepe ve bulutlar (Bulut Tepesi, Sev. 40). Bloklar, KANON'un dediği gibi Meydan'ın arka sokaklarıdır: güneyde, tramvay durağının hemen arkasında.

Yerleşimin üç anlamlı seçimi vardır. Birincisi, **Akademi tepenin eteğindedir ve Bulut Tepesi'ne çıkan füniküler Akademi'nin arka kapısından kalkar**: yolun sonu, başladığın binanın arkasındadır. İkincisi, **nehir Veri Vadisi'nden doğar, Blokların güneyinden akar ve Liman'da denize dökülür**: veri akışı metaforu şehrin fiziğine yazılıdır ve Liman ile Veri Vadisi aynı kıyı çizgisini paylaşır. Üçüncüsü, **Finans Bölgesi'nin neonu geceleri Meydan'dan görünür**: Sev. 1'deki oyuncu, Sev. 25'te gideceği yerin ışığını ilk geceden görür; kilitli semtler sis değil, ufuktur.

### 2.2 Şehir krokisi

```
                             K U Z E Y
                   ~ ~ ~  BULUT TEPESİ (T4, Sev. 40)  ~ ~ ~
                 ┌─────────────────────────────────────────┐
                 │  [Şehir Uygulaması]  [Yemek Sipariş Pl.] │
                 │  [Gözlem Terası]  [Dağıtım Kulesi: Saha] │
                 │              ▲ füniküler ▲              │
                 └──────────────────┬──────────────────────┘
  KAMPÜS (T2–3, Sev. 18)            │            FİNANS BÖLGESİ (T3, Sev. 25)
 ┌──────────────────┐      ┌────────┴─────────┐      ┌──────────────────┐
 │ Kütüphane Sinema │      │     AKADEMİ      │      │ Banka   Sigorta  │
 │ Haber Ajansı     │─tram─│ 7 Kürsü · Atölye │─tram─│ Borsa Panosu     │
 │ Amfi (Saha)      │      │ Lobi · Kurul Od. │      │ Test Lab. (Saha) │
 │ Lonca Binası v1.1│      └────────┬─────────┘      │ cam kule, neon   │
 └────────┬─────────┘               │                └────────┬─────────┘
          │                 DERLEYİCİ MEYDANI (merkez)        │
  ATÖLYELER (T2, Sev. 12)  ┌────────┴─────────┐        ÇARŞI (T1, Sev. 1)
 ┌──────────────────┐      │ LED Pano  Çeşme  │      ┌──────────────────┐
 │ Oto Tamirhane    │      │ Pazar   Liderlik │      │ OTOPARK  Büfe    │
 │ Mobilya Atölyesi │─tram─│ Podyum  Belediye │─tram─│ Manav            │
 │ Trafo Merkezi    │      │ Arena (v1.2)     │      │ Hasan Abi'nin    │
 │ Garaj (Saha)     │      │ Tramvay Durağı   │      │ Tezgâhı · Saha   │
 └────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
          │                         │                         │
  VERİ VADİSİ (T3–4, Sev. 32) BLOKLAR (konut, Sev. 2)    LİMAN (T1–2, Sev. 6)
 ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
 │ Hastane Kayıt    │      │ Blok A  Blok B   │      │ Kargo Deposu     │
 │ Otel             │~~~~~~│ Blok C  (Odalar) │~~~~~~│ Balık Hali       │
 │ Sunucu Çiftliği  │nehir │ posta kutuları   │nehir │ Oto Yıkama Gümrük│
 │ Şema Masası(Saha)│      │ bank, kedi       │      │ Konteyner (Saha) │
 └──────────────────┘~~~~~~└──────────────────┘~~~~~~└──────────────────┘
          ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  D E N İ Z  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
```

### 2.3 Semt konum tablosu

| Semt | Yön (Meydan'a göre) | Tier | Açılış (KANON) | Ana Cadde (tile) | Ara Sokak (tile) | Tramvay durağı | Komşu semtler |
|---|---|---|---|---|---|---|---|
| Derleyici Meydanı | Merkez | — | Baştan | 40 × 40 | — | "Meydan" (T1 ve T2 hattı) | Hepsi |
| Çarşı | Doğu | 1 | Sev. 1 | 48 × 36 | 40 × 24 | "Çarşı" | Meydan, Liman, Finans |
| Liman | Güneydoğu | 1–2 | Sev. 6 + Çarşı Sınavı | 56 × 40 | 48 × 28 | "Liman" | Çarşı, Bloklar |
| Atölyeler | Batı | 2 | Sev. 12 + Liman Sınavı | 48 × 40 | 44 × 28 | "Atölyeler" | Meydan, Kampüs, Veri Vadisi |
| Kampüs | Kuzeybatı | 2–3 | Sev. 18 + Atölye Sınavı | 64 × 48 | 52 × 32 | "Kampüs" | Akademi, Atölyeler |
| Finans Bölgesi | Kuzeydoğu | 3 | Sev. 25 + Kampüs Sınavı | 44 × 56 | 44 × 32 | "Finans" | Akademi, Çarşı |
| Veri Vadisi | Güneybatı | 3–4 | Sev. 32 + Finans Sınavı | 56 × 48 | 48 × 36 | "Veri Vadisi" | Atölyeler, Bloklar |
| Bulut Tepesi | Kuzey (tepe) | 4 | Sev. 40 + Veri Sınavı | 40 × 40 | 48 × 36 | "Tepe" (füniküler, T2 hattı) | Akademi |
| Bloklar | Güney | — | Sev. 2 | 36 × 24 | — | "Bloklar" | Meydan, Liman, Veri Vadisi |

### 2.4 Tramvay hattı

Dünyadaki araç **tramvay**dır; yetenek ağacı olan **Metro Haritası** bir ekrandır (KANON §2.2). İkisi bilerek ayrı tutulur ve ayrı çizilir: tramvay sarı-krem, iki vagonlu, raylı; Metro Haritası ekranı ise metro şeması estetiğindedir. Oyuncuya hiçbir yerde "metroya bin" denmez.

İki hat vardır **(B1 önerisi)**: **T1 Çevre Hattı** saat yönünde Meydan → Çarşı → Liman → Bloklar → Veri Vadisi → Atölyeler → Kampüs → Finans → Meydan; **T2 Tepe Hattı** Akademi arka kapısından Bulut Tepesi'ne füniküler. Tramvay görsel olarak sürekli dolaşır (her sahnede 90 saniyede bir geçer), ama oyuncunun beklemesi yoktur: durağa tıklayınca hat paneli açılır, hedef seçilir, 1,5 saniyelik "kapı kapanır – vagon camından semt kayar – kapı açılır" vinyeti oynar ve oyuncu hedef durakta belirir. Giriş sinemasında oyuncuyu Meydan'a indiren araç da bu tramvaydır; vagonun içi, oyuncunun ilk gördüğü KodKent mekânıdır ve camında şehrin ufku akar.

### 2.5 Kilitli semtler: inşaat halinde + turist modu

Kilitli semt (KANON §2.2) **inşaat halinde** görünür: Ana Cadde kapısının önünde vinç, iskele ve sarı-siyah bariyer; büyük tabelada "Liman: Çarşı Sınavı'ndan sonra açılıyor", altında küçük yazıyla oyuncunun eksikleri ("Sev. 6 — sen Sev. 4 · Çarşı Sınavı — henüz değil"). Kapı kapalı değildir: **turist modu** düğmesi ("Gezmeye gir") sahneyi açar. Turist modunda sokaklar, NPC dükkânlar, öne çıkarılan gerçek işletmeler ve onların tabelaları görünür, Alkış verilebilir, sohbet açıktır; Saha Atölyesi'nin kapısında zincir ve "Görevler Çarşı Sınavı'ndan sonra" plakası vardır, Belediye Tapu Masası "Bu semtte arsa alamazsın (henüz)" der, Satılık parseller gri çizgili görünür. Turist modunda HUD'un üst şeridi mavi "TURİST" bandı taşır; bu band, oyuncunun "neden alamıyorum" sorusunu baştan cevaplar.

İnşaat halindeki semtlerin görsel ayrıntısı, açık semtlerden **kasıtlı olarak daha az**dır: zemin tile çeşidi yarıya iner, binaların yalnızca kabuğu ve tabelası çizilir, iç mekân yoktur. Bu hem üretim bütçesi (MVP'de 5 kilitli semt) hem de anlatı içindir: semt, oyuncu geldikçe "tamamlanır". Semt açıldığında oyuncu aynı sahneye girer ve iskelelerin kalktığını, kaldırımların döşendiğini görür; Semt Sınavı ödülü (500 B + 10 Çip + 200 XP + Semt Madalyası) ekranda akarken sahnede 3 saniyelik "iskele sökümü" animasyonu oynar.

---

## 3. Semtler

Her semt aynı şablonla verilir: künye, görsel motifler ve öğrenmeyle bağı, yerleşim, bina listesi (Akademi şubesi = **Saha Atölyesi**, oyuncu işletme arsaları, NPC dükkânları, ortak yapılar), ambiyans. **Saha Atölyesi** (B1 önerisi) semtteki Akademi şubesidir: KANON'a göre dersler Akademi'de anlatılır ve her semtin Atölyesi Akademi binasındadır; vizyon ise görevlerin "Atölye / semt sokağı"nda geçtiğini söyler. Saha Atölyesi bu ikisini bağlar: semtin içinde, Usta'nın gün boyu durduğu, aynı görev listesini açan küçük bir açık hava noktasıdır; Akademi'deki Atölye ile aynı görev motoruna gider (B3), yalnızca sahnesi farklıdır. Usta, hem Akademi'deki Kürsüsünde hem Saha Atölyesi'nde bulunur; ikisi aynı NPC'dir ve oyuncu "Usta Defne hem okulda hem pazarda" diye düşünür — tıpkı iyi bir öğretmenin sokakta da öğretmesi gibi.

Fiyat ve açılış değerleri KANON §5'ten alınmıştır; müşteri NPC adları Otopark (Hasan Abi) ve Kütüphane (Kütüphaneci Ayşe) dışında B1 önerisidir ve B5 ile uyumlanacaktır.

### 3.0 Derleyici Meydanı

| Künye | |
|---|---|
| Tema | Şehrin oturma odası: çeşme, akşam ışıkları, LED pano, kalabalık |
| Tier / açılış | — / baştan; doğma noktası |
| Renk vurgusu | Taş bej `#D9C9A3`, çeşme mavisi `#4FA3D1`, akşam amberi `#F2B134`, LED kırmızısı `#FF3B30` |
| Müzik | "Meydan Teması": 100 BPM, hafif elektronik + kanun tınısı; gece sürümü yavaş |
| Kapasite | 40 avatar/shard (KANON); saat başı Meydan Sorusu |

Meydan, 40 × 40'lık sahnenin ortasında 16 × 16'lık açık bir plazadır; plazanın merkezinde 6 × 6 havuzlu **Çeşme** durur. Çeşme boş süs değildir: Meydan Sorusu'nun saat başı sinyalidir (su 10 saniye yükselir, pano "MEYDAN SORUSU" yazar), lig kapanışında (Pazar 21:00) havai fişeğin fırlatma noktasıdır, kışın (v1.1) buz pistine döner. Kuzey kenarı boydan boya **Akademi**'nin ön cephesidir (20 × 14 tile ayak izi, 3 kat, saat kulesi); cephenin ortasında şehrin **LED panosu** asılıdır: 12 × 2 tile, 5 × 7 nokta matris, kırmızı-amber. Pano şunları sırayla akıtır: yeni açılan işletmeler ("Yeni işletme: @ayse_kod'un Otoparkı — Çarşı"), Meydan Sorusu'nun en hızlı 3 kişisi, "en çok ziyaret edilen işletmeler", lig geri sayımı ve Ders 1.1'de oyuncunun kendi `Console.WriteLine` çıktısı (10 sn, moderasyonlu). Yerel (shard) ve küresel akış yarı yarıya karışır **(B1 önerisi)**; hiçbir mesaj 8 saniyeden uzun kalmaz.

Batı kenarda **Pazar** binası (14 × 10 iç mekân, Bayt rafları + Butik + Rütbe Rafı; mankenler haftanın rotasyonunu giyer, tıklanınca Pazar ekranı açılır). Doğu kenarda **Liderlik Panosu** (4 × 1 tile, üç sütun: haftalık lig, Kalıcılık Ligi, En Hızlı Otopark) ve önünde **Podyum**: oyuncu çıkar, 30 saniye spot ışığı altında döner, kıyafeti herkes görür; podyumun iki yanındaki üç kaide, haftanın lig birincilerinin avatar heykellerini taşır (Pazartesi 00:00 güncellenir; heykel, oyuncunun o anki kıyafetiyle gri taş olarak dondurulur). Kuzeydoğuda küçük **Belediye Köşkü**: Ruhsat ilerlemesi, Satılık arsa listesi, adres değiştirme; NPC Belediye Memuru Nuran. Güneyde **Tramvay Durağı** ve onun arkasından Bloklar'a inen merdivenli sokak. Güneybatıda **Arena**: MVP'de iskeleli, "Arena — v1.2" tabelalı; v1.2'de 60 seyircilik canlı düello alanı.

Doğu kapısının hemen yanında **Meydan Otoparkı** durur: bu, gerçek bir oyuncunun Otoparkıdır. Seçim kuralı **(B1 önerisi)**: son 72 saatte Açılış yapmış, sahibi Sev. ≤ 5 olan işletmeler arasından saat başı rotasyon. Usta Defne onboarding'de tam buna işaret eder ("Şu otopark, 3 gün önce senin gibi başlayan birinin") ve 27. dakikadaki turist modu ziyareti buraya yapılır. Oyuncunun ilk 30 dakikada gördüğü ilk işletme, ulaşabileceği bir işletmedir.

| Yapı | Tür | Ayak izi | İşlev |
|---|---|---|---|
| Akademi (ön cephe) | Ortak | 20 × 14 | Kuzey kenar; ana kapı → Lobi |
| LED Pano | Ortak | 12 × 2 (cephede) | Şehir akışı; `Console.WriteLine` çıktısı |
| Çeşme | Ortak | 6 × 6 | Meydan Sorusu sinyali, havai fişek, buz pisti (v1.1) |
| Pazar | Mağaza | 14 × 10 iç | Raflar, Butik, Rütbe Rafı, mankenler |
| Liderlik Panosu + Podyum + 3 kaide | Ortak | 8 × 4 | Ligler; kıyafet gösterisi; haftanın üçü |
| Belediye Köşkü | NPC | 4 × 4 | Ruhsat/tapu bilgisi, adres, Satılık listesi (Nuran) |
| Tramvay Durağı "Meydan" | Ulaşım | 6 × 2 | T1 + T2 hat paneli |
| Meydan Otoparkı | Öne çıkan oyuncu işletmesi | 7 × 6 | Saat başı rotasyon; turist modu ilk durağı |
| Arena | Ortak (v1.2) | 12 × 12 | MVP: inşaat halinde |
| İlan Panosu | Ortak | 2 × 1 | Haftanın etkinlikleri, Pazar rotasyon günü |
| Banklar, simitçi arabası, figüran NPC'ler | Dekor/NPC | — | Oturma emote'u; kalabalık hissi |

| Ambiyans | Ses |
|---|---|
| Döngü | Çeşme suyu, uzak kalabalık uğultusu, güvercin kanadı, tramvay rayı tıkırtısı (90 sn'de bir geçiş) |
| Tek seslik | Tramvay zili, LED pano "tık" kaydırma, Meydan Sorusu çan (3 nota), havai fişek (Pazar 21:00), konfeti patlaması |
| Gece | Uğultu azalır, cırcır böceği, neon vızıltısı (Finans yönünden hafif) |

### 3.1 Çarşı

| Künye | |
|---|---|
| Tema | Tenteli dükkânlar, pazar sesleri; ilk işler, ilk para |
| Tier / açılış | T1 / Sev. 1 (ilk semt; Usta Defne) |
| C# kümesi (KANON) | Değişkenler, türler, operatörler, tam sayı bölmesi, `Math`, `if/else if/else`, `switch`, döngüler, metotlar, `string` |
| Renk vurgusu | Tente kırmızısı `#C8453A` + krem `#F4EFE6`, turuncu `#E8912D`, zeytin yeşili `#7A8F4E`, arnavut kaldırımı grisi `#A89F91` |
| Müzik | "Çarşı Teması": 108 BPM, klarnet + hafif davul, neşeli; gece sürümü yalnızca klarnet |
| Oyuncu işletmeleri | Otopark (300 B, Sev. 3 + Ruhsat), Büfe (600 B, Sev. 4), Manav (900 B, Sev. 5) |

**Görsel motifler ve öğrenmeyle bağ.** Çarşı'nın her şeyi **etiketli ve kutuludur**: kasalarda "domates 3 kg", tentelerde fiyat kartları, dükkân önlerinde numaralı kasalar. Bu, Defne'nin "değişken bir kutu, `int` kutunun etiketi" benzetmesinin dünyaya dökülmüş hâlidir; oyuncu derste kutu-etiket metaforunu duyduğunda sokakta zaten yüz tanesini görmüştür. Tenteler kırmızı-beyaz çizgilidir ve rüzgârda 2 karelik salınım yapar; zemin arnavut kaldırımı, çatılar kiremittir; her dükkânın önünde bir ahşap tabela sarkar. Manav kasaları `switch` dersinde "miktara göre indirim" örneğine, Büfe'nin para üstü tepsisi `decimal` dersine, Otopark'ın bariyer sayacı `Math.Ceiling`'e görsel çapadır.

**Yerleşim.** Ana Cadde batıdan Meydan kapısı, güneyden Liman kapısı ile bağlanır; dört tile genişliğinde kaldırımlı bir caddedir. Caddenin iki yanında dönüşümlü olarak NPC dükkânları ve 6 **Cadde Arsası** (öne çıkarılan gerçek işletmeler; saat başı rotasyon: en çok alkışlanan 2, en yeni açılan 2, shard'daki oyuncuların kendi işletmelerinden 2) sıralanır. Ara Sokaklar caddeden güneye ve kuzeye açılır: Tente Sokak, Nalbur Sokak, Bakırcılar Sokak, Yorgancılar Sokak… (ad havuzu 24 isim; sokak sayısı nüfusla büyür).

```
  Meydan (batı kapısı)                                          Finans'a (kuzey, kilitli)
 ┌────────────────────────────────────────────────────────────────────┐
 │ Tramvay Durağı "Çarşı" ═══ ray ═══            [Belediye Tapu Masası]│
 │                                                                    │
 │ [Terzi Nermin] [Cadde Arsası 1] [Cadde Arsası 2] [Berber Cemil]    │
 │   tente/manken   öne çıkan Otopark  öne çıkan Büfe   ayna, koltuk   │
 │ ═══════════════ ANA CADDE (4 tile, arnavut kaldırımı) ═════════════│
 │ [SAHA ATÖLYESİ]  [Cadde Arsası 3] [Cadde Arsası 4] [Simitçi]       │
 │  Defne'nin tenteli  öne çıkan Manav   öne çıkan Otopark  (gezici)   │
 │  uzun masası (6×4)                                                 │
 │                                                                    │
 │ [Hasan Abi'nin Tezgâhı]   [küçük çeşme]   [Cadde Arsası 5] [6]     │
 │  iş emri burada başlar                                             │
 │   ↓ Tente Sk     ↓ Nalbur Sk     ↓ Bakırcılar Sk    ↓ Yorgancılar  │
 └──────────────────────────── Liman'a (güney kapısı) ────────────────┘
```

| Yapı | Tür | Ayak izi | İşlev / not |
|---|---|---|---|
| Saha Atölyesi (Çarşı) | Akademi şubesi | 6 × 4 | Tenteli uzun masa, 6 tabure, küçük tahta; Usta Defne; görev listesi açılır |
| Otopark arsası | Oyuncu işletmesi | 7 × 6 | Kanonik ilk işletme; §6 |
| Büfe arsası | Oyuncu işletmesi | 3 × 3 | Camekânlı küçük kulübe; iç mekân 10 × 8 |
| Manav arsası | Oyuncu işletmesi | 4 × 4 | Açık tezgâh + kasa; iç mekân yok |
| Hasan Abi'nin Tezgâhı | NPC (müşteri) | 2 × 2 | Tapu öncesi "yapan var mı?" balonu; tapu sonrası iş emri; sonra arsanın yanına taşınır |
| Belediye Tapu Masası | NPC (ortak şube) | 3 × 2 | Çarşı'daki Satılık parseller, Ruhsat 0/3 göstergesi |
| Terzi Nermin | NPC dükkânı | 4 × 3 | Haftanın Pazar rotasyonundan 3 kıyafet mankende; "dene" → Dolap önizleme; satış Pazar'da |
| Berber Cemil | NPC dükkânı | 3 × 3 | Saç/yüz değişimi ücretsiz (Avatar Atölyesi kısayolu); koltukta oturma emote'u |
| Simitçi arabası | NPC (gezici) | 1 × 2 | Tıklanınca "günün sözü" (bir C# ipucu, içerik bankasından) |
| Cadde Arsaları (6) | Öne çıkan oyuncu işletmeleri | tür boyutu | Saat başı rotasyon; tabela tıklanınca sahibinin Ara Sokağı'na geçiş |
| Tramvay Durağı "Çarşı" | Ulaşım | 6 × 2 | T1 |
| Küçük çeşme, banklar, kedi | Dekor | — | Oturma, "kedi sevme" etkileşimi (emote tetikler) |

| Ambiyans | Ses |
|---|---|
| Döngü | Uzak pazarcı sesleri (anlaşılmaz mırıltı; gerçek sözcük yok), tente çırpıntısı, bisiklet zili arada, serçe |
| Tek seslik | Simitçi çıngırağı, kasa "çın" (Alkış), bariyer "tak-tak", NPC araba motoru, kepenk (gece 21:00'de NPC dükkânlar kepenk indirir; oyuncu işletmeleri kapanmaz) |
| Gece | Pazarcı sesleri kesilir, cırcır böceği, tentelerin altında sarı ampul vızıltısı |

### 3.2 Liman

| Künye | |
|---|---|
| Tema | Konteynerler, martı, vinç; listeler ve koleksiyonlar |
| Tier / açılış | T1–2 / Sev. 6 + Çarşı Sınavı (Usta Kerem) |
| C# kümesi | Diziler, `List<T>`, `Dictionary`, `foreach`, sıralama/arama, `string.Split`, hata ayıklama temelleri |
| Renk vurgusu | Deniz `#2E6F95`, konteyner turuncusu `#D9653B` / mavisi `#3C6E9F` / yeşili `#4E8F62`, pas `#8A5A3C`, beton `#9AA3A8` |
| Müzik | "Liman Teması": 96 BPM, akordeon + bas, gemi düdüğü sample'ı; gece sürümü yalnızca dalga + akordeon |
| Oyuncu işletmeleri | Kargo Deposu (1.500 B, Sev. 6), Balık Hali (2.200 B, Sev. 8), Oto Yıkama (2.500 B, Sev. 9), Gümrük (3.000 B, Sev. 10) |

**Görsel motifler ve öğrenmeyle bağ.** Liman, **sıralı ve indeksli** bir dünyadır: konteynerler numaralı yığınlar hâlinde (`dizi[0]`, `dizi[1]`…), vinç her seferinde bir konteyner alıp bırakır (`foreach` vinçtir, Kerem'in cümlesi), Balık Hali'nde her kasanın üstünde tür ve fiyat etiketi vardır (`Dictionary<string, decimal>`), Gümrük'te plakalar sıraya dizilir (arama/sıralama). Konteyner yığınları üç renkte üç yükseklikte istiflenir; sahnedeki en büyük hareketli nesne olan vinç 20 saniyelik bir döngüyle yük indirir. Deniz, iki katmanlı kaydırmalı tile ile dalgalanır; rıhtım kenarında babalar, halatlar, cankurtaran simitleri; martılar sahnenin üst katmanında rastgele döner ve babanın üstüne konar.

**Yerleşim.** Ana Cadde aslında bir **rıhtım**dır: kuzeyde Çarşı kapısı, batıda Bloklar'a giden kıyı yolu, güneyde deniz. Rıhtım boyunca Saha Atölyesi (kırmızı konteyner ofis, kapısı açık, içinde Kerem'in masası ve hesap makinesi), Liman Lokantası (NPC; oturulabilir 6 masa, sohbet yoğunluğunun doğal noktası), Deniz Feneri (Liman'ın LED panosu: feneri döner, altındaki panoda Liman'a özgü akış) ve Cadde Arsaları dizilir. Ara Sokaklar rıhtımdan içeri açılan **antrepo sokaklarıdır**: Zincir Sokak, Palamar Sokak, Fener Sokak, Manifesto Sokak…

| Yapı | Tür | Ayak izi | İşlev / not |
|---|---|---|---|
| Saha Atölyesi (Liman) | Akademi şubesi | 4 × 3 | Kırmızı konteyner ofis; Usta Kerem; görev listesi |
| Kargo Deposu arsası | Oyuncu işletmesi | 8 × 8 | Sac depo, sürgülü kapı, forklift NPC; iç mekân 16 × 12 (raflar envanter listesini gösterir) |
| Balık Hali arsası | Oyuncu işletmesi | 5 × 4 | Açık tezgâh, buz kasaları, fiyat tahtası (Dictionary görselleşir) |
| Oto Yıkama arsası | Oyuncu işletmesi | 6 × 4 | Tünel yıkama; paket tabelası (3 paket + ek hizmetler) |
| Gümrük arsası | Oyuncu işletmesi | 5 × 5 | Bariyerli kabin; plaka sırası; kırmızı/yeşil lamba |
| Liman Lokantası | NPC dükkânı | 6 × 5 | Oturma, sohbet; menü tahtası günün Meydan Sorusu'nu tekrarlar |
| Deniz Feneri + Liman Panosu | Ortak | 2 × 2 (+ kule) | Yerel LED akışı; gece döner ışık |
| Kaptan Rıza | NPC (müşteri, öneri) | 2 × 2 | Kargo Deposu iş emri; B5 ile uyumlanacak |
| Balıkçı Gülsüm | NPC (müşteri, öneri) | 2 × 2 | Balık Hali iş emri |
| Gümrük Memuru Faruk | NPC (müşteri, öneri) | — | Gümrük iş emri; kabin içinde |
| Vinç | Dekor (hareketli) | 4 × 4 | 20 sn döngü; saat başında konteyneri "Meydan Sorusu" sandığı olarak indirir |
| Tramvay Durağı "Liman" | Ulaşım | 6 × 2 | T1 |
| İskele | Dekor | 2 × 8 | Oturma, "balık tutma" emote noktası (v1.1) |

| Ambiyans | Ses |
|---|---|
| Döngü | Dalga (iki katman), martı (rastgele 8–20 sn), vinç uğultusu, zincir şıkırtısı, uzak gemi makinesi |
| Tek seslik | Gemi düdüğü (saat başı, Meydan Sorusu sinyali), konteyner "güm", forklift geri vites bip, fener çanı (gece) |
| Gece | Dalga öne çıkar, martı susar, fener motoru |

### 3.3 Atölyeler

| Künye | |
|---|---|
| Tema | Tuğla, kıvılcım, çekiç sesi; nesneler ve kalıplar |
| Tier / açılış | T2 / Sev. 12 + Liman Sınavı (Usta Nehir); MVP'de inşaat halinde |
| C# kümesi | Sınıf, nesne, kapsülleme, kalıtım, `interface`, `enum`, `struct`, `record`, `exception`; İngilizce adlandırmaya geçiş |
| Renk vurgusu | Tuğla `#9C4A3C`, is `#3B3B3F`, kıvılcım turuncusu `#FFA33A`, çelik `#7D8A94`, önlük kahvesi `#6B4F3A` |
| Müzik | "Atölyeler Teması": 92 BPM, perküsyon (çekiç ve örs sample'ları ritmin parçası), elektro gitar hafif |
| Oyuncu işletmeleri | Oto Tamirhane (5.000 B, Sev. 12), Mobilya Atölyesi (6.500 B, Sev. 14), Trafo Merkezi (8.000 B, Sev. 16) |

**Görsel motifler ve öğrenmeyle bağ.** Atölyeler **kalıp ve kopya** semtidir: Mobilya Atölyesi'nin önünde aynı kalıptan çıkmış sandalyeler dizilidir (sınıf → nesne), Oto Tamirhane'de araç hiyerarşisi duvardaki şemada asılıdır (kalıtım: Araç → Otomobil → Kamyonet), Trafo Merkezi'nin kapısında "YETKİSİZ GİREMEZ" levhası kapsüllemenin, sigorta kutusu `exception`'ın görsel çapasıdır. Tuğla duvarlar, çatıdaki ışıklıklar, açık garaj kapıları, zeminde yağ lekeleri ve lastik izleri. Kıvılcım parçacıkları kaynakçı NPC'nin önünde 3 saniyede bir çakar; bacalardan is tüter (parçacık katmanı). Bu semtten itibaren tabelalar İngilizce tanımlayıcı konvansiyonuna uyan "sınıf adı" plakaları taşır (`Garage`, `Workshop`): KANON'un adlandırma geçişi sokakta da görünür.

| Yapı | Tür | Ayak izi | İşlev / not |
|---|---|---|---|
| Saha Atölyesi (Atölyeler) | Akademi şubesi | 6 × 4 | Açık garaj; Usta Nehir; tezgâhta "kod kokusu" kartları |
| Oto Tamirhane arsası | Oyuncu işletmesi | 8 × 6 | Lift, araç hiyerarşisi panosu; iç mekân 14 × 10 |
| Mobilya Atölyesi arsası | Oyuncu işletmesi | 6 × 6 | Sipariş nesneleri vitrinde |
| Trafo Merkezi arsası | Oyuncu işletmesi | 6 × 6 (çitli) | `interface`/`enum` panelleri, sigorta kutusu |
| Nalbur Sabri | NPC dükkânı | 4 × 3 | Oda eşyası "araç" seti önizleme; Pazar kısayolu |
| Hurdacı Avlusu | NPC | 5 × 4 | Hata Bildirimi dosyalarının "hurda kod" temalı teslim noktası (Müfettiş burada da durur) |
| Kaynakçı | Dekor (NPC) | 2 × 2 | Kıvılcım parçacığı kaynağı |
| Tramvay Durağı "Atölyeler" | Ulaşım | 6 × 2 | T1 |

| Ambiyans | Ses |
|---|---|
| Döngü | Çekiç-örs (müzikle senkron), kompresör, uzak radyo mırıltısı, kaynak cızırtısı |
| Tek seslik | Garaj kapısı, metal düşme, lift hidroliği, sigorta "çat" (Kararmış işletme yakınında) |
| Gece | Kompresör durur, tek lamba vızıltısı, uzak köpek (sakin) |

### 3.4 Kampüs

| Künye | |
|---|---|
| Tema | Çimen, amfi, kütüphane; sorgular ve akışlar |
| Tier / açılış | T2–3 / Sev. 18 + Atölye Sınavı (Usta Baran); MVP'de inşaat halinde |
| C# kümesi | Generics, LINQ, delegate/event, lambda, extension, pattern matching, `DateTime`, dosya ve JSON |
| Renk vurgusu | Çimen `#6FBF73`, kampüs tuğlası `#B4654A`, krem taş `#F1E9D2`, defter mavisi `#3F6FB5`, sonbahar turuncusu `#D98841` |
| Müzik | "Kampüs Teması": 104 BPM, akustik gitar + piyano, lo-fi davul |
| Oyuncu işletmeleri | Kütüphane (10.000 B, Sev. 18), Sinema (14.000 B, Sev. 20), Haber Ajansı (18.000 B, Sev. 23); ortak: Lonca Binası (v1.1) |

**Görsel motifler ve öğrenmeyle bağ.** Kampüs'te her şey **filtrelenir ve akar**: Kütüphane'nin rafları konuya göre renk kodludur ve rafın önündeki kart kataloğu LINQ sorgusunun görsel karşılığıdır (`Where`, `OrderBy`); Sinema'nın koltuk planı generics ve `DateTime` rezervasyonunu; Haber Ajansı'nın cephesindeki kayan haber bandı delegate/event akışını canlandırır. Çim alanlar geniş ve oturulabilirdir (piknik battaniyesi emote noktası), amfi basamakları Saha Atölyesi'dir: Baran en alttaki kürsüde durur, oyuncular basamaklara oturur ve görev editörleri önlerinde açılır. Ağaçlar mevsime göre değişen ilk nesnelerdir (§9.2). Kampüsün ortasında **"İlk Derleyici" heykeli**: elinde delikli kart tutan anonim bir figür; kaidesinde şehrin toplam derleme sayısı yazar (gerçek sayaç).

| Yapı | Tür | Ayak izi | İşlev / not |
|---|---|---|---|
| Saha Atölyesi (Amfi) | Akademi şubesi | 10 × 6 | Açık hava amfi; Usta Baran; 20 oturma noktası |
| Kütüphane arsası | Oyuncu işletmesi | 10 × 8 | Renk kodlu raflar; gecikme cezası panosu; müşteri Kütüphaneci Ayşe |
| Sinema arsası | Oyuncu işletmesi | 10 × 8 | Afiş vitrini (haftanın en çok alkışlanan işletmeleri "film afişi" olur), koltuk planı |
| Haber Ajansı arsası | Oyuncu işletmesi | 8 × 6 | Kayan haber bandı: sahibinin kodunun ürettiği JSON akışından başlıklar |
| Lonca Binası | Ortak (v1.1) | 12 × 10 | Lonca salonu, lonca tabelası duvarı; MVP'de inşaat halinde |
| Kantin | NPC dükkânı | 6 × 4 | Oturma, sohbet; menü tahtasında günün "Meydan Sorusu" cevabı (saat sonunda) |
| Kayıt Bürosu | NPC | 3 × 3 | Semt Sınavı kayıt noktası (UI kısayolu), sınav günü sırası görünür |
| İlk Derleyici heykeli | Dekor | 2 × 2 | Toplam derleme sayacı |
| Tramvay Durağı "Kampüs" | Ulaşım | 6 × 2 | T1 |

| Ambiyans | Ses |
|---|---|
| Döngü | Kuş cıvıltısı, yaprak hışırtısı, uzak akustik gitar (müzikten bağımsız kaynak), çim biçme (nadir) |
| Tek seslik | Saat kulesi çanı (saat başı), kitap kapanma, sinema zili, haber bandı "tık" |
| Gece | Cırcır böceği, kütüphane lambaları, uzak kahkaha |

### 3.5 Finans Bölgesi

| Künye | |
|---|---|
| Tema | Cam kuleler, gece neonu; eşzamanlılık ve kanıt |
| Tier / açılış | T3 / Sev. 25 + Kampüs Sınavı (Usta Elif); MVP'de inşaat halinde |
| C# kümesi | `async/await`, `Task`, `HttpClient`, hata dayanıklılığı, unit test, Git temelleri |
| Renk vurgusu | Cam `#5FA8D3`, lacivert `#1F2A44`, neon magenta `#FF4FD8`, neon cyan `#35F0E0`, altın `#E5B84B` |
| Müzik | "Finans Teması": 120 BPM, synthwave, gece sürümünde bas öne çıkar |
| Oyuncu işletmeleri | Banka (25.000 B, Sev. 25), Sigorta (30.000 B, Sev. 28), Borsa Panosu (35.000 B, Sev. 30) |

**Görsel motifler ve öğrenmeyle bağ.** Finans Bölgesi'nin her şeyi **aynı anda olur**: cephelerdeki asansörler eşzamanlı iner çıkar (`Task`), kurye motosikletleri binalar arasında istek-cevap taşır (`HttpClient`), Borsa Panosu'nun dev ekranında şehrin gerçek lig verisi akar. Test kültürü sokakta görünür: her oyuncu işletmesinin kapısında yeşil/kırmızı "test lambaları" dizisi vardır ve geçen test sayısını gösterir (Elif'in "kanıtı nerede?" sorusunun cevabı duvarda asılıdır). Kuleler 3–5 kattır; cam cephelerde gökyüzü yansıması paralaks katmanıyla kayar. Gece, şehrin en parlak semtidir: neon tabelalar, çatı ışıkları, zemine yansıyan renkli ışık lekeleri. Bu semtin gecesi Meydan'dan görünür (§2.1).

| Yapı | Tür | Ayak izi | İşlev / not |
|---|---|---|---|
| Saha Atölyesi (Test Laboratuvarı) | Akademi şubesi | 6 × 6 | Cam lobi; Usta Elif; duvarda kronometre ve test lambaları |
| Banka arsası | Oyuncu işletmesi | 10 × 10 (3 kat) | İşlem kuyruğu gişeleri; iç mekân 16 × 12 |
| Sigorta arsası | Oyuncu işletmesi | 8 × 8 | Kural motoru panosu; unit test lambaları en belirgin burada |
| Borsa Panosu arsası | Oyuncu işletmesi | 8 × 6 + 6 × 3 ekran | Dayanıklılık göstergesi (bağlantı koptu/kurtardı animasyonu) |
| Kurye durağı | NPC | 3 × 2 | İstek-cevap kuryeleri buradan çıkar; `HttpClient` dersinin sahnesi |
| Kahveci | NPC dükkânı | 4 × 3 | Oturma; "kahve molası" emote |
| Güvenlik Kulübesi | NPC | 2 × 2 | Git temelleri dersinde "commit günlüğü" defteri tutan NPC |
| Tramvay Durağı "Finans" | Ulaşım | 6 × 2 | T1 |

| Ambiyans | Ses |
|---|---|
| Döngü | Trafik uğultusu, asansör "ding", klavye tıkırtısı (açık pencerelerden), rüzgâr kuleler arasında |
| Tek seslik | Kurye motoru, kapı turnikesi, test lambası "tık" (yeşil) / "bzzt" (kırmızı), borsa zili |
| Gece | Neon vızıltısı, uzak müzik, trafik azalır |

### 3.6 Veri Vadisi

| Künye | |
|---|---|
| Tema | Sunucu çiftliği, nehir; şema ve ilişki |
| Tier / açılış | T3–4 / Sev. 32 + Finans Sınavı (Usta Selin); MVP'de inşaat halinde |
| C# kümesi | SQL temelleri, EF Core, migration, repository, ilişkiler, transaction |
| Renk vurgusu | Nehir turkuazı `#3FA7A1`, sunucu grisi `#5C6670`, LED mavisi `#4D8DFF`, çayır `#8CBF6B`, köprü ahşabı `#A0714F` |
| Müzik | "Veri Vadisi Teması": 88 BPM, ambient pad + su sesi, marimba |
| Oyuncu işletmeleri | Hastane Kayıt (50.000 B, Sev. 32), Otel (65.000 B, Sev. 36) |

**Görsel motifler ve öğrenmeyle bağ.** Veri Vadisi **ilişkiler ve kalıcılık** semtidir. Nehir burada doğar; üstünden geçen köprüler tablolar arası ilişkilerdir (köprü korkuluklarında "1 — n" plakaları), nehir kıyısındaki su değirmeni transaction çarkıdır: tam dönerse ürün çıkar, yarıda durursa geri sarar (Selin'in dersinde tam bu animasyon oynar). Sunucu çiftliği gezilebilir bir koridordur; raflardaki LED'ler gerçek zamanlı değil, şehrin günlük toplam işletme simülasyonu sayısıyla orantılı yanıp söner. Hastane Kayıt'ın cephesi beyaz-turkuaz, Otel'in cephesi ahşap-cam; her ikisinin önünde "kayıt defteri" heykelcikleri. Çayır, yollar ve nehir kenarı sahnenin yarısını kaplar: Veri Vadisi şehrin en sakin, en geniş semtidir ve Finans'ın neonundan sonra göz dinlendirir.

| Yapı | Tür | Ayak izi | İşlev / not |
|---|---|---|---|
| Saha Atölyesi (Şema Masası) | Akademi şubesi | 6 × 4 | Nehir kenarı pavyon; Usta Selin; masada büyük şema kâğıdı |
| Hastane Kayıt arsası | Oyuncu işletmesi | 10 × 10 | Migration "inşaat" animasyonu: yeni kolon = yeni kanat |
| Otel arsası | Oyuncu işletmesi | 10 × 12 (4 kat) | Oda-misafir ilişkisi pencerelerde ışık olarak görünür |
| Sunucu Çiftliği | Ortak (gezilebilir) | 12 × 8 | Koridor, LED rafları; "veritabanı sesi" |
| Su Değirmeni | Dekor (hareketli) | 3 × 3 | Transaction metaforu; dersle senkron animasyon |
| Köprüler (3) | Dekor/yol | 2 × 6 | "1 — n", "n — n" plakaları |
| Veri Bahçıvanı | NPC | 2 × 2 | Migration dersinin müşterisi (öneri); seralar = tablolar |
| Tramvay Durağı "Veri Vadisi" | Ulaşım | 6 × 2 | T1 |

| Ambiyans | Ses |
|---|---|
| Döngü | Nehir akışı, sunucu fanı (çiftliğe yaklaşınca artar), kuş, değirmen gıcırtısı |
| Tek seslik | Değirmen "tık" (tam tur), köprü tahtası, sera kapısı, disk "tırtır" (çiftlik içi) |
| Gece | Nehir + fan; LED'ler daha belirgin; ateşböceği parçacığı (yaz, v1.1) |

### 3.7 Bulut Tepesi

| Künye | |
|---|---|
| Tema | Bulutların üstünde, şehir manzarası; sistemler konuşur |
| Tier / açılış | T4 / Sev. 40 + Veri Sınavı (Usta Yusuf); MVP'de inşaat halinde |
| C# kümesi | ASP.NET Core Web API, REST, DTO, DI, middleware, auth, SignalR temelleri, dağıtım |
| Renk vurgusu | Bulut beyazı `#F7F9FC`, gök `#8FC5FF`, altın gün ışığı `#FFD37A`, gece moru `#5A4E9E`, anten gümüşü `#C9D1D9` |
| Müzik | "Bulut Tepesi Teması": 76 BPM, geniş pad, koro tınısı, uzak çan; şehrin en sakin teması |
| Oyuncu işletmeleri | Yemek Sipariş Platformu (90.000 B, Sev. 40), Şehir Uygulaması (120.000 B, Sev. 45; capstone, lonca sürümü v2) |

**Görsel motifler ve öğrenmeyle bağ.** Bulut Tepesi, şehrin **üstünden konuşan** semtidir. Binalar bulut katmanının üstünde platformlardadır; aralarında drone kuryeler API istekleri taşır (REST), platform girişlerinde "Kapı Bekçisi" NPC'leri (auth/middleware) kimlik sorar, Dağıtım Kulesi'nden şehre ışık demeti iner (deploy). Semtin kalbi **Gözlem Terası**dır: oyuncu korkuluğa yaklaşınca kamera geri çekilir ve bütün şehir minyatür olarak görünür; oyuncunun kendi işletmeleri altın, arkadaşlarınınkiler mavi ışıkla yanar; Kararmış olanlar gri. Bu, vizyonun "Şehir Mimarı" fantezisinin tek karelik hâlidir: Sev. 40 oyuncusu, Sev. 1'de tramvaydan indiği meydanı yukarıdan görür. Turist modundaki Sev. 3 oyuncusu da terasa çıkabilir ve kendi tek otoparkının ışığını minyatürde bulur ("Hedef: hepsini yakmak").

| Yapı | Tür | Ayak izi | İşlev / not |
|---|---|---|---|
| Saha Atölyesi (Dağıtım Kulesi) | Akademi şubesi | 6 × 6 | Kule tabanı platform; Usta Yusuf ve dürbünü |
| Yemek Sipariş Platformu arsası | Oyuncu işletmesi | 12 × 10 | Drone pisti; sipariş akışı tabelada |
| Şehir Uygulaması arsası | Oyuncu işletmesi (capstone) | 14 × 12 | Lonca sürümünde her üyenin sınıfı bir modül bloğu olarak binaya eklenir (v2) |
| Gözlem Terası | Ortak | 10 × 4 | Şehir minyatürü; işletme ışıkları |
| Füniküler İstasyonu "Tepe" | Ulaşım | 6 × 3 | T2 hattı; Akademi arka kapısına iner |
| Kapı Bekçileri | NPC | 1 × 1 × 3 | auth/middleware metaforu; "kimlik kartı" diyaloğu |
| Hava Durumu Kulesi | Dekor | 2 × 2 | Gerçek TR hava durumuna göre bulut yoğunluğu (v1.1) |

| Ambiyans | Ses |
|---|---|
| Döngü | Rüzgâr, uzak şehir uğultusu (aşağıdan, filtreli), drone vızıltısı, bayrak çırpıntısı |
| Tek seslik | Füniküler çanı, dağıtım ışık demeti "vuum", drone iniş, kapı bekçisi turnike |
| Gece | Rüzgâr, yıldız altında şehir ışıkları; sahnenin en sessiz gecesi |

### 3.8 Bloklar (konut)

| Künye | |
|---|---|
| Tema | Meydan'ın arka sokakları; pastel apartmanlar, kapı plakaları, posta kutuları |
| Açılış | Sev. 2 (Oda hakkı, KANON); 14. dakikada açılır |
| Renk vurgusu | Nane `#BFE3D0`, şeftali `#F7C8B0`, lila `#D8C9EC`, kaldırım `#CFCBC2`, kapı ahşabı `#8B6A4E` |
| Müzik | "Bloklar Teması": 84 BPM, ukulele + piyano; Oda içinde oyuncu müziği seçebilir (Pazar'da "plak" eşyası) |
| Kapasite | Blok Sokağı 40; Oda 20 (KANON) |

Bloklar üç pastel apartman bloğudur (A, B, C), her biri 4 kat; her **kapı** bir Oda instance'ıdır. Kapının üstünde **kapı plakası**: `@ad` · unvan rozeti · çevrimiçi ışığı (yeşil nokta) · "ziyarete açık / arkadaşlara / zilli". Kapı plakaları bloğun cephesinde fiziksel olarak görünür; sokağa giren oyuncu, kimin evde olduğunu ışıklardan okur. Blok cephesindeki kapılar oyuncu nüfusundan bağımsız olarak **dinamik atanır**: sokak shard'ına giren oyuncunun kendi kapısı her zaman A Blok 1. katta en soldadır, arkadaşlarının kapıları yakınına, kalan kapılar "son ziyaret ettiklerin" ve "en çok alkışlanan odalar" ile dolar; shard'daki herkes aynı atamayı görür (atama shard açılışında hesaplanır, 10 dakikada bir yenilenir — bu, parsel kuralıyla aynı ilkedir, §6.1). Her blok kapısının yanında **posta kutusu** (ziyaretçi defterinin son 3 kaydı balon olarak görünür) ve kapı önünde ayak izleri (son 24 saatin ziyaretçileri, solan izler). Sokakta bank, kedi, çamaşır ipi, bisiklet; Meydan'dan merdivenle inilir, kıyı yolu Liman'a ve nehir yolu Veri Vadisi'ne bağlanır.

| Ambiyans | Ses |
|---|---|
| Döngü | Uzak Meydan uğultusu (filtreli), kuş, çamaşır ipi gıcırtısı, uzak radyo |
| Tek seslik | Kapı zili (zilli odaya ziyaretçi gelince sahibi duyar), posta kutusu kapağı, kedi miyavı |
| Gece | Pencerelerde sarı ışık (çevrimiçi sahipler), cırcır böceği |

---

## 4. Akademi

### 4.1 Dış görünüş ve konum

Akademi, Meydan'ın kuzey kenarını kaplayan **tek bina**dır (KANON): 20 × 14 tile ayak izi, 3 kat (144 px), krem taş cephe, bakır kubbeli rotonda, saat kulesi (gerçek TR saati), cephede LED pano. Arka kapısı Bulut Tepesi füniküler istasyonuna açılır. Cephe, semtlerin renk şeridini taşır: giriş merdivenlerinin yedi basamağı yedi semtin vurgu rengidir ve oyuncu açtığı semtin basamağında bir "ışık" yanar (kişisel, yalnızca kendi istemcisinde; başkaları için basamaklar nötrdür).

### 4.2 Zemin kat: Lobi, rotonda ve 7 Kürsü kapısı

```
                 K U Z E Y  — arka kapı: füniküler "Tepe"
 ┌───────────────────────────────────────────────────────────────┐
 │ [Kürsü 7 · Bulut Tepesi] [Kürsü 6 · Veri Vadisi] [Kürsü 5 · Finans]│
 │   kapı: bulut motifi       kapı: nehir dalgası    kapı: neon çerçeve│
 │                                                               │
 │ [Kürsü 4 · Kampüs]        R O T O N D A        [Kürsü 3 · Atölyeler]│
 │   kapı: sarmaşık      zemin: Metro Haritası      kapı: tuğla kemer  │
 │                        mozaiği (kişisel renkli)                     │
 │ [Kürsü 2 · Liman]      ◎ Mühür Duvarı          [Kürsü 1 · Çarşı]    │
 │   kapı: vinç/konteyner   (Ders Mühürleri)        kapı: tente         │
 │                                                               │
 │ [ATÖLYE KANADI 16×12]  [DANIŞMA · Günlük Tekrar Kiosku]  [KURUL ODASI]│
 │  20 kişi, "yardım iste"  [Kalfa Yardımı köşesi · v1.2]   mühürlü kapı │
 │  balonları, test tahtası                                   asla açılmaz│
 └───────────────────────────[ A N A  K A P I ]───────────────────────┘
                     G Ü N E Y — Derleyici Meydanı
```

**Lobi** 28 × 20'lik bir rotondadır (kapasite 40). Zeminde **Metro Haritası mozaiği**: yedi hat, duraklar; oyuncunun kendi istemcisinde duraklar kendi renkleriyle (gri/sarı/yeşil/altın) boyanır, başkaları için mozaik nötr lacivert-beyazdır. Rotondanın ortasında **Mühür Duvarı**: silindirik bir sütun, üzerinde oyuncunun aldığı Ders Mühürleri kabartma olarak; tıklanınca Metro Haritası ekranı açılır. Yedi **Kürsü kapısı** rotondanın çevresine semt sırasına göre dizilir; her kapı semtinin motifini taşır ve kilitli Kürsü'nün kapısı **pencerelidir**: içerisi görünür, Usta tahtada ders anlatıyor gibidir, kapı açılır, oyuncu içeri girip oturabilir (KANON: kürsüler semt açılmadan gezilebilir), ama ders kartları "Liman dersleri Çarşı Sınavı'ndan sonra" plakasıyla kilitlidir. Bu, "sınıfın kapısından içeriyi görmek" hissidir: hedef görünür, uzak değildir.

**Danışma**, ana kapının karşısındadır: NPC yok, bir **Günlük Tekrar Kiosku** (saat başlıklı küçük makine; 5 soruluk turu başlatır, seri sayacı üstünde) ve ilan panosu. **Kalfa Yardımı köşesi** (v1.2) MVP'de kadife kordonla çevrili, "Kalfa Yardımı — v1.2" plakalı; v1.2'de Sev. 18+ mentorların oturduğu 6 masalı köşe olur. **Kurul Odası**, lobinin sağ arka köşesinde mühürlü bir kapıdır: büyük balmumu mühür, üstünde "KURUL" yazısı; kapı hiçbir zaman açılmaz, tıklanınca "Kurul kişi değildir; kartlarıyla konuşur." metni çıkar. Kurul'un kişiliksizliği (KANON §2.1) mimariye böyle yazılır: öğretmenin odası vardır, puanlayıcının yalnızca mührü.

### 4.3 Kürsü (derslik)

Her Kürsü 12 × 10 tile, kapasite 12 **(B1 önerisi)**. Yerleşim: kuzey duvarda **tahta** (6 × 1 tile, kara tahta; ders kartları açıkken tahtada kartın mini kodu yazılıdır), tahtanın önünde **kürsü** ve Usta; dört sıra halinde 8 **sıra** (2 × 1, iki kişilik); doğu duvarda semt manzaralı **pencere** (Çarşı Kürsüsü'nden tenteler, Liman Kürsüsü'nden vinç görünür; pencere, semt sahnesinin küçük bir paralaks kesitidir); batı duvarda **Mühür Rafı** (bu semtin derslerinin mühürleri; alınanlar altın, alınmayanlar gölge). Oyuncu bir sıraya oturunca **Derslik** ekranı (KANON ekran #7) sahnenin üstünde yarı saydam panel olarak açılır; sahne arka planda kalır, diğer öğrencilerin avatarları görünür (sohbet balonları Kürsü içinde kapalıdır; yalnızca emote). Kart ilerledikçe Usta tahtaya döner, tebeşirle yazar (2 karelik animasyon). Usta sorusu geldiğinde Kurul Kartı (ekran #8) mühürlenerek sıranın üstüne "düşer".

```
 ┌───────────────────────────────────┐
 │ TAHTA ████████████████   [Mühür Rafı]
 │        kürsü  (Usta)              │
 │                                   │
 │   ▭▭    ▭▭    ▭▭    ▭▭   ← 4 sıra │
 │   ▭▭    ▭▭    ▭▭    ▭▭     (8×2)  │
 │ pencere → semt kesiti             │
 └───────────[ kapı ]────────────────┘
```

### 4.4 Atölye kanadı

Akademi'nin **Atölye**si 16 × 12, kapasite 20: 12 çalışma tezgâhı (her biri 2 × 1, üstünde küçük ekran), kuzey duvarda **Test Tahtası** (o anda Atölye'de görev yapan oyuncuların yalnızca toplam yeşil/kırmızı sayısı; kim olduğu görünmez), doğu duvarda **İpucu Dolabı** (Pusula → Fener → Taslak → Örnek çekmeceleri; dekoratif, ipucu UI'ı editörde). Oyuncu tezgâha oturunca Atölye ekranı (ekran #9, Monaco) açılır. "Yardım iste" balonu: oyuncu basınca avatarının üstünde beyaz soru işareti balonu çıkar ve 5 dakika kalır; Atölye'deki diğer oyuncular balona tıklayıp yalnızca **hazır cümlelerle** ("Pusula'ya baktın mı?", "Testin adına bak", "Satır sonunda ; var mı?") cevap verebilir; serbest metin yardımlaşma v1.2 Kalfa Yardımı'na bırakılmıştır. Semtlerdeki Saha Atölyeleri aynı akışı açar; Akademi Atölyesi'nin farkı kapalı mekân ve kalabalıktır.

### 4.5 Usta'nın yeri

Her Usta üç yerde bulunur: **Kürsü**sünde (ders), semtinin **Saha Atölyesi**'nde (görev) ve kendi semtinin **İş Emri** anlarında müşteri NPC'nin yanında (Gereksinim Netleştirme'de kenardan konuşur: "Müşteriye sormadan kod yazan, iki kere yazar"). Usta Defne ayrıca onboarding'de Meydan tramvay durağında karşılar. Usta hiçbir zaman "iki yerde birden" görünmez çünkü oyuncu bir anda tek sahnededir; teknik olarak her sahnede Usta'nın bir kopyası vardır ve diyalog durumu sunucuda oyuncuya bağlıdır (B7).

---

## 5. Oyuncu Odası

### 5.1 Başlangıç Odası: Stüdyo

Oda, Sev. 2'de (14. dakika) açılır. Başlangıç tipi **Stüdyo**: 6 × 6 ızgara (36 hücre), iki arka duvar (kuzey ve batı, her biri 6 tile × 2 kat yüksek), 25 eşya kapasitesi, 20 avatar (KANON). Stüdyo boş teslim edilmez: **kapı**, bir **pencere** (Meydan ufku; gece/gündüz Odaya yansır), zemin kaplaması "beton", duvar kaplaması "beyaz badana" ve iki başlangıç eşyası — **Çalışma Masası** (işlevsel: üstündeki küçük ekranda son geçilen testin adı ve yeşil sayısı yazar) ve **Ziyaretçi Defteri** (kapının yanında, duvarda; son 20 ziyaretçi, Alkış butonu). Oyuncunun ilk 30 B'lik alışverişi Çırak Şapkası'dır (vizyon dakika 20); ilk Oda eşyası genellikle 2. oturumda Büfe hedefinden önce gelir ve bu bilinçlidir: "önce üstüm, sonra evim, sonra dükkânım".

### 5.2 Mobilya sistemi

| Kural | Değer |
|---|---|
| Yerleştirme | Izgaraya yapışır; eşya ayak izi 1 × 1, 1 × 2, 2 × 2, 2 × 3; duvar eşyaları duvar hücresine (poster, raf, Rozet Duvarı) |
| Döndürme | 4 yön; 2 çizilmiş yön + ayna (SE/SW çizilir, NE/NW aynalanır); asimetrik eşyalar 4 yön çizilir |
| İstifleme | 3 yükseklik katmanı: zemin → yüzey (masa/raf üstü, `gz = 0,5`) → duvar; "üstüne koy" yalnızca `yuzey: true` eşyalarda |
| Kaplama | Zemin ve duvar kaplaması eşya sayılmaz; Pazar'da tema olarak (Bayt: 6 zemin, 6 duvar; Çip Butik: oda temaları) |
| Kapasite | Stüdyo 25 · Daire 40 · Çatı Katı 60 **(Daire/Çatı Katı B1 önerisi)** |
| Düzenleme modu | "Düzenle" → ızgara görünür, eşya envanteri alttan açılır; sürükle, döndür (R / çift dokunma), kaldır; otomatik kaydet |
| Oturma/etkileşim | `oturulabilir` eşyalar (sandalye, koltuk, puf, halı) avatarı oturtur; `tetikleyici` eşyalar (plak çalar → müzik, lamba → oda ışığı) |

### 5.3 İşlevsel ve MVP eşya kataloğu (25 eşya)

Fiyatlar KANON aralığındadır (40–400 B). Nadirlik: Sıradan (gri etiket), Şık (mavi), Nadir (mor, rotasyon), Premium (turkuaz, Çip, yalnızca Butik oda temaları), Nişan (altın; yalnızca kazanılır).

| # | Eşya | Ayak izi | Fiyat | Nadirlik | İşlev |
|---|---|---|---|---|---|
| 1 | Çalışma Masası | 2 × 1 | başlangıç | — | Son geçilen test; tıklanınca Atölye kısayolu |
| 2 | Ziyaretçi Defteri | duvar | başlangıç | — | Son 20 ziyaretçi, Alkış |
| 3 | Rozet Duvarı | duvar 2 | 120 B | Şık | Nişan'ları asar (en çok 6; Çatı Katı'nda 12) |
| 4 | Metro Posteri | duvar | 80 B | Sıradan | Oyuncunun Metro Haritası küçük hâli; altın durak sayısı |
| 5 | Seri Takvimi | duvar | 60 B | Sıradan | Günlük Tekrar serisi; dondurma ikonu |
| 6 | Kod Çerçevesi | duvar | 150 B | Şık | Vitrin'den seçilen 8 satır kod (L2+ işletmesi olana açılır) |
| 7 | Mini Kasa Maketi | 1 × 1 | 100 B | Şık | İşletmelerin toplam kasa doluluğunu gösterir (ikon) |
| 8 | Plak Çalar | 1 × 1 | 200 B | Şık | Oda müziğini semt temalarından seçer |
| 9 | Ahşap Sandalye | 1 × 1 | 40 B | Sıradan | Oturma |
| 10 | Puf | 1 × 1 | 50 B | Sıradan | Oturma |
| 11 | İkili Koltuk | 2 × 1 | 140 B | Şık | 2 oturma |
| 12 | Yatak | 2 × 1 | 160 B | Sıradan | Uzanma emote'u |
| 13 | Halı (yuvarlak) | 2 × 2 | 70 B | Sıradan | Zemin dekoru; üstüne eşya konur |
| 14 | Kitaplık | 1 × 1 duvar dibi | 110 B | Sıradan | Yüzey: üstüne küçük eşya |
| 15 | Masa Lambası | yüzey | 45 B | Sıradan | Gece oda ışığı |
| 16 | Ayaklı Lamba | 1 × 1 | 90 B | Şık | Gece oda ışığı (sıcak) |
| 17 | Saksı (sukulent) | yüzey | 40 B | Sıradan | — |
| 18 | Büyük Bitki | 1 × 1 | 85 B | Sıradan | — |
| 19 | Çarşı Tentesi (pencere üstü) | duvar | 300 B | Nadir | Çarşı teması; rotasyon |
| 20 | Konteyner Sehpa | 1 × 1 | 300 B | Nadir | Liman teması; rotasyon |
| 21 | Tebeşir Tahtası | duvar | 95 B | Şık | Oyuncu 40 karakter yazar (moderasyonlu) |
| 22 | Pencere Perdesi | duvar (pencere) | 60 B | Sıradan | 4 renk |
| 23 | Zemin: Ahşap Parke | kaplama | 150 B | Şık | — |
| 24 | Duvar: Tuğla | kaplama | 150 B | Şık | — |
| 25 | Otopark Ustası Kupası | yüzey | — | Nişan | Gizli testlerin tamamı ilk 3 denemede; altın, döner |

### 5.4 Ziyaret, izinler ve Oda kapasitesi

Odaya üç yoldan girilir: Bloklar'daki kapıdan, arkadaş listesinden ("Odasına git") ve profilden. Sahibi çevrimdışıyken de girilebilir (Habbo/Sanalika alışkanlığı; vizyonun asenkron sosyal ilkesi): ziyaretçi dolaşır, eşyalara bakar, Alkış verir, Ziyaretçi Defteri'ne kaydı düşer, ayak izi bırakır. İzin modları: **Herkese açık** (varsayılan 18+), **Arkadaşlara** (15–17 için varsayılan; güvenli mod), **Zilli** (sahibi onaylar). Kapasite 20; dolu Odanın kapısında "Dolu — 20/20" plakası ve "Sıraya gir" yerine "Sahibine Alkış bırak" seçeneği (sıra bekletmek yok). Oda içinde sohbet balonu açık (Meydan kurallarıyla: 1 mesaj/3 sn, 200 karakter, moderasyon); 15–17 oyuncunun Odasında veli onayı gelene kadar yalnızca hazır cümle ve emote.

### 5.5 Genişleme (MVP+1)

**Daire** (8 × 8, 2.000 B, Sev. 10) ve **Çatı Katı** (iki oda 8 × 6 + 6 × 6, 6.000 B, Sev. 20) KANON değerleridir. Genişleme taşınma değildir: aynı kapı, içerisi büyür; eşyalar yerinde kalır, yeni alan "boş beton" olarak eklenir. Çatı Katı'nın ikinci odası teras temalıdır (gökyüzü duvar yerine korkuluk; gece yıldız). Çatı Katı'na çıkan merdiven Blok cephesinde görünür: Sev. 20 oyuncunun kapısı diğerlerinden farklı (iki katlı plaka) olur — Bloklar'daki tek statü işareti budur ve kazanılmıştır.

---

## 6. İşletme arsaları ve Otopark'ın görsel yolculuğu

### 6.1 Arsa modeli: Ana Cadde, Ara Sokak, parsel

Sorun şudur: binlerce oyuncunun her birinin bir Otoparkı var; hepsi aynı sokakta duramaz, ama herkes "benim dükkânım şu sokakta, komşum şu" diyebilmeli ve ziyaretçi tabelayı, NPC arabaları, kasayı görebilmelidir. Çözüm üç katmanlıdır:

1. **Ana Cadde** (semt başına kamusal shard, 40 kişi): NPC dükkânları, Saha Atölyesi, tramvay durağı ve **6 Cadde Arsası**. Cadde Arsaları, gerçek oyuncu işletmelerinin saat başı rotasyonla öne çıkarıldığı vitrinlerdir; shard'daki herkes aynı 6 işletmeyi görür (rotasyon shard açılışında ve her saat başında sunucuda hesaplanır: en çok alkışlanan 2, en yeni açılan 2, shard'daki oyuncuların kendi işletmelerinden 2). Hiçbir oyuncu Ana Cadde'de "kendi arsasını" sahiplenmez; Cadde Arsası'na çıkmak bir ödüldür ve çıkan oyuncuya bildirim gider ("Otoparkın bu saat Çarşı Ana Caddesi'nde!").
2. **Ara Sokak** (instance, kapasite 20 **(B1 önerisi)**): 6 **parsel**lik bir sokak. Oyuncu bir semtte ilk tapusunu aldığında boş parseli olan bir Ara Sokağa yerleşir (öncelik: arkadaşının sokağı → kohort kodu → en dolu sokak). Parsel, oyuncunun o semtteki bütün işletmelerini barındıracak büyüklüktedir (Çarşı parseli 12 × 10: Otopark 7 × 6 + Büfe 3 × 3 + Manav 4 × 4 + kaldırım). Henüz alınmamış tür slotları sahibine "Satılık — şu ders eksik" tabelasıyla, ziyaretçiye düz çim olarak görünür (tek kişiselleştirme budur). Boş parsel herkese "SATILIK — Belediye" tabelasıyla görünür; uygun ziyaretçi oradan tapu alıp sokağa **komşu olarak** yerleşebilir. Adres: **"Çarşı · Tente Sokak No: 3"**; tabelada, profilde ve ziyaret davetinde yazar.
3. **İşletme içi** (instance, kapasite 15, KANON): kapalı mekânı olan işletmelerde (Büfe, Kargo Deposu, Banka…) kapıdan girilen iç sahne: kasa, Vitrin, İşletme Paneli terminali, müşteri NPC. Otopark, Manav ve Balık Hali gibi açık işletmelerde iç mekân yoktur; parselin kendisi iç mekândır ve Vitrin gişenin duvarına asılır.

```
 ┌─────────────────────────────────────────────────────────────────────┐
 │ Parsel 1 · @ayse_kod       │ Parsel 2 · @mert.k      │ Parsel 3 · SATILIK│
 │ [OTOPARK L2] [Büfe L1]     │ [OTOPARK L1]            │  çim              │
 │ [Manav L1]   kasa (dolu)   │  çim  çim   kasa        │  "SATILIK—Belediye"│
 ├════════════ yol (4 tile, NPC arabalar iki yönlü, kaldırım) ══════════┤
 │ Parsel 4 · @deniz07        │ Parsel 5 · @kaan        │ Parsel 6 · @ela_c │
 │ [OTOPARK · KARARMIŞ]       │ [OTOPARK · DENEME]      │ [OTOPARK L1][Büfe]│
 │  Müfettiş kapıda, kırmızı  │  şikâyet balonu, sarı   │  kasa             │
 │  dosya; arabalar girmiyor  │  band; trafik yarım      │                   │
 └──────────── Tente Sokak — Çarşı · Ana Cadde'ye çıkış (kuzey) ────────┘
```

Ziyaret: tabelaya tıklayınca "Ziyaret et" → Ara Sokak instance'ına geçiş; sahibi çevrimdışıyken de gidilir, NPC trafiği oynar, Alkış verilir, Vitrin okunur. Vizyonun 27. dakikadaki turist ziyareti budur.

### 6.2 Otopark: kurulum öncesi

**Durum A — Satılık (tapu öncesi).** Parselin Otopark slotu çimle kaplı boş arsadır; ortada eğri bir "SATILIK — Belediye · 300 B · Ruhsat 3/3 · Sev. 3" tabelası, köşede kırık kaldırım taşı, bir lastik, iki serçe. **Hasan Abi** arsanın önünde durur, başının üstünde dönüşümlü "?" ve "Burada bir ücret sistemi lazım, yapan var mı?" balonu. Oyuncu tabelaya tıklayınca **HUD hedef çubuğu** açılır: "Otopark: 10/300 B — Ruhsat 0/3 — 3 ders". Şartlar sağlanınca tabela yeşil yanar ve "TAPU AL" düğmesine döner (vizyon dakika 27: "Satılık Otopark tabelası yanar").

**Durum B — Kapalı, yazılım bekliyor (tapu sonrası, kod öncesi).** Tapu alınır alınmaz sahne 2 saniyelik bir dönüşüm oynar: çim kalkar, toprak zemin ve iki beton direk belirir, arsanın çevresini **sarı-siyah inşaat bandı** sarar, direğin üstünde **bariyer kolu yoktur** (yalnızca yuva). Arsanın ortasında büyük sarı bir **"KODLA!"** ok tabelası dikilir: bu, dünya uzayında duran tıklanabilir bir çağrıdır; tıklanınca İş Emri ekranı (ekran #11), ikinci tıklamada İşletme Editörü (ekran #12) açılır. Direğin altındaki küçük resmî plaka KANON durumunu yazar: **"KAPALI — yazılım bekliyor"**. Hasan Abi artık elinde dosyayla kapının yanındadır (iş emri). En önemli ayrıntı: NPC arabalar sokakta dolaşmaya devam eder, arsanın önünde **yavaşlar, bariyer olmadığını görür, "?" balonuyla gider**. Oyuncu kaçan müşteriyi görür; bu, "Yarın: Hasan Abi'nin iş emri" kartının görsel karşılığıdır ve hiçbir metin yazmadan "kodu yaz, para kaçıyor" der. Çevrimdışı gelir yoktur, kasa yoktur, tabela yoktur; LED panoda yalnızca "Yeni tapu: @ad — Çarşı" akar.

```
          ╔════════════════════╗
          ║   K O D L A !  →   ║   ← sarı ok tabela, tıklanır (İş Emri / Editör)
          ╚═══════╦════════════╝
   ░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░   ← sarı-siyah inşaat bandı
   ░  toprak zemin, çizgi yok        ░
   ░        [Hasan Abi]  (dosya)     ░   "İş emri hazır."
   ░                                 ░
   ░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░
        │ direk │        │ direk │   ← bariyer kolu YOK, yuva boş
        plaka: KAPALI — yazılım bekliyor
    araba>  (yavaşlar, "?" balonu, gider)
```

### 6.3 Otopark: kurulum sonrası ve seviye kademeleri

**Açılış anı** (tüm testler + Savunma ≥ 70): bariyer kolu yuvaya "tak" sesiyle oturur, inşaat bandı yanarak kaybolur, zemine 12 park yeri çizgisi çizilir (soldan sağa 1 saniyede), gişe kulübesi yükselir, kasa kapının yanına düşer, konfeti, LED panoda "Yeni işletme: @ad'ın Otoparkı — Çarşı" akar ve **ilk NPC araba bariyerden girer**. Tabela direğine ahşap tabela asılır: `@ad'ın Otoparkı · Çırak Sev. 3 · AÇIK` (yeşil dolu daire). Oyuncu işletmeye ad verdiyse (200 B) ad, "@ad'ın Otoparkı" yerine geçer; moderasyon takma adla aynıdır.

```
   TABELA: @ayse_kod'un Otoparkı · Çırak Sev.3 · (yeşil) AÇIK
  ┌──────────────────────────────────────────┐
  │  P   P   P   P   P   P    ← 12 park yeri │
  │  P   P   P   P   P   P      çizgili      │
  │ [gişe · Vitrin çerçevesi duvarda]        │
  └──────╥─────────────────────╥─────────────┘
      ═══╝ bariyer (kalkar/iner)   [KASA] (dolunca üstünde zıplayan B ikonu)
   araba>  araba>   (her ~45 sn bir giriş; görsel trafik)
```

**Görsel trafik ile ekonomik trafik ayrıdır.** Gelir gece 1 kez toplu simülasyonla hesaplanır (12 araç/gün, KANON); sahnedeki arabalar ise oyuncu bakarken her ~45 saniyede bir girer ve çıkar **(B1 önerisi)**. Böylece sahne hiç boş durmaz, ama ekonomiyi görsel yanıltmaz: İşletme Paneli "Bugün: 12 araç · 2.220 TL · 220 B" yazar. Kasa, 8 saatlik üretimi (≈73 B) tutar; doluluk kasa sprite'ının 4 kademesinde (boş, çeyrek, yarım, dolu-zıplayan ikon) okunur.

İşletme seviyeleri KANON'un "bariyer → tabela → kat → gece ışığı → otomat" zincirini izler:

| Seviye | Müşteri isteği (KANON) | Fiyat | Görsel ek | Trafik görseli | Gelir |
|---|---|---|---|---|---|
| L1 | Ücret sistemi (Hasan Abi) | 300 B tapu | **Bariyer** kolu, 12 çizgili yer, ahşap tabela, gişe, kasa | Binek araba | ≈220 B/gün |
| L2 | Aylık abone plakaları | 500 B | **Tabela** büyür: metal çerçeve, "ABONE GİRİŞİ" ikinci şerit, plaka okuyucu kamera direği; Vitrin açılır | Aynı arabalar bazen bariyer kalkmadan geçer (abone) | ≈350 B |
| L3 | %50 indirim; bozuk kayıtta hata | 1.200 B | **Kat**: çelik rampa ile ikinci kat (ayak izi aynı, yükseklik +1 kat), mavi engelli ve yeşil şarj yerleri, şarj direği | Elektrikli araba sprite'ı eklenir | ≈560 B |
| L4 | Gece tarifesi 22:00–06:00 | 2.500 B | **Gece ışığı**: 4 aydınlatma direği, gece fazında turuncu ışık lekeleri, "GECE TARİFESİ 150" neon şerit | Gece arabalar farları açık girer | ≈900 B |
| L5 | Kapasite 50; kuyruk | 5.000 B | **Otomat**: ödeme makinesi, kapıda "DOLU/BOŞ" LED sayacı, bekleme şeridi çizgisi | Kuyrukta bekleyen arabalar, sayaç | ≈1.440 B |

Her yükseltme sahnede 3 saniyelik "inşaat" animasyonu ile gelir (iskele belirir, ek yükselir, iskele kalkar) ve LED panoda akar.

**Diğer durumlar:**

| Durum (KANON) | Görsel | Ses | Ziyaretçi ne görür |
|---|---|---|---|
| Deneme (%50 gelir) | Tabela yarım yanar (floresan titremesi), sarı "DENEME" bandı bariyer direğinde, kasa yarı hızlı, 20 saniyede bir sahibine özel **şikâyet balonu** ("6 saat civarı kalanlar şikâyetçi") | Floresan "bzzt" | "DENEME" bandı; Alkış verebilir; şikâyet balonunu görmez |
| Kararmış (kod bozuk) | Tabela gri, ışık sönük, bariyer yarı açık takılı kalır, NPC arabalar girmez ("?" ile geçer), kasa gri, **Müfettiş** kapıda kırmızı dosyayla | Sigorta "çat", sessizlik | Gri tabela + "KARARMIŞ"; Alkış kapalı; "Sahibine haber ver" (bildirim, günde 1) |
| Vitrin (L2+) | Gişe duvarında çerçeveli ekran; yaklaşınca kodun ilk 8 satırı büyür; tıklayınca Vitrin ekranı (#20) | Kâğıt hışırtısı | Kod + Savunma cevabı; "Not bırak" v1.1 |

### 6.4 Dört Tier için bina sınıfı

Tier, semtin zorluk katmanıdır ve her Tier'ın işletmeleri aynı **bina sınıfı** kurallarını paylaşır. Böylece oyuncu, bir sokağa girer girmez işletmenin "ağırlığını" malzeme ve ışıktan okur:

| Öğe | T1 (Çarşı, Liman-1) | T2 (Liman-2, Atölyeler, Kampüs-2) | T3 (Kampüs-3, Finans, Veri-3) | T4 (Veri-4, Bulut Tepesi) |
|---|---|---|---|---|
| Kat sayısı | 1 | 1–2 | 2–4 | 4–6 veya platform |
| Ayak izi | 3 × 3 – 7 × 6 | 6 × 4 – 8 × 8 | 8 × 6 – 10 × 10 | 10 × 10 – 14 × 12 |
| Malzeme | Ahşap, tente, sac, kiremit | Tuğla, metal, oluklu sac, beton | Cam, beton, çelik, neon | Beyaz kompozit, cam, hologram |
| Tabela | Ahşap/boyalı, tek ışık | Metal çerçeve, ampul dizisi | LED şerit, neon harf | Hologram plaka, hareketli |
| Kasa modeli | Teneke kutu | Çelik kasa | ATM benzeri terminal | Holografik terminal |
| Müşteri görseli | Yaya, binek araba | Kamyonet, forklift, tekne | Öğrenci, ofis çalışanı, kurye | Drone, veri paketi ışıkları |
| Gece ışığı | 1 sarı ampul | 2–4 ampul, kıvılcım | Neon, cam yansıması | Işık demeti, bulut parıltısı |
| Parçacık | Yok | Duman/kıvılcım | Neon titreşimi, kâğıt | Veri akışı, bulut |
| Test lambaları (kapı) | Yok (Kurul kartında) | Küçük 3'lü | Belirgin 6'lı | Tam panel |
| Tabela özelleştirme (150–600 B) | Boya rengi (150), font (200) | + ampul rengi (250) | + neon çerçeve (400) | + hologram animasyonu (600) |

Tabela sistemi her Tier'da aynı bilgiyi taşır (KANON §5 vizyon öğesi 7): sahibin adı veya işletme adı, **unvan rozeti + unvan + seviye**, durum ışığı. Yazı moderasyonu takma ad kurallarıyla aynıdır (B6). Çip'le alınan neon paleti (Butik) yalnızca renk verir; Nişan çerçevesi (ör. "Otopark Ustası") altın ve animasyonludur ve Bayt'la bile alınamaz.

---

## 7. Avatar sistemi

### 7.1 İskelet, yüz ve paper-doll katmanları

Avatar, cinsiyet seçimi olmayan **nötr bir iskelet** üzerine giydirilir: **3 vücut tipi** (ince, orta, geniş) × tek boy (96 px) **(B1 önerisi)**; boy farkı, piksel sanatında ölçekleme bozulması yarattığı için yoktur. **8 ten rengi**, **yüz**: 3 yüz şekli × 6 göz × 4 kaş × 5 ağız (360 kombinasyon), **saç**: 16 model × 12 renk (başlangıçta tamamı açık). KANON'un "12 kombinasyon"u kıyafet içindir: Avatar Atölyesi'nde 12 hazır kıyafet seti (3 üst × 2 alt × 2 ayak kombinasyonundan seçilmiş 12 set) sunulur, yüz ve saç serbesttir. "Sonra her şeyi değiştirebilirsin": yüz, saç ve vücut tipi **Dolap**'ta ve Berber Cemil'de ücretsiz ve sınırsız değişir; takma ad değişimi 500 B (KANON).

Yönler: **4 yön** (SE, SW, NE, NW); SE ve NE çizilir, diğerleri aynalanır. Yürüme 4 komşulu ızgara adımlarıyla yapılır (çapraz adım yok; B7 §6.5, KANON §12.3), sprite en yakın yöne döner. Animasyonlar (12 fps): bekleme (2 kare nefes), yürüme (8 kare), oturma (1), tuşlama (4; editör açıkken avatar Atölye tezgâhında "yazar"), emote'lar (6–12 kare), AFK esneme (6).

Katman sırası (alttan üste): gölge → sırt (arka parça) → vücut → alt → ayak → üst → yüz (göz/kaş/ağız) → saç arka → saç ön → baş (şapka; saç ön parçayı bazı şapkalarda gizler: `sacGizle: true`) → aksesuar → sırt (ön parça, ör. kanat ucu/çanta askısı) → el (emote nesnesi). **Evcil hayvan** ayrı sprite'tır, avatarı 1 tile geriden takip eder ve kendi gölgesine sahiptir. Renkler palet takasıyla uygulanır (her kıyafet 2 boyanabilir bölge; Çip isim rengi hariç kıyafet renkleri Bayt'tır).

### 7.2 Kıyafet slotları

| Slot | Örnek | MVP adet | Not |
|---|---|---|---|
| Baş | Çırak Şapkası (30 B), bere, kasket, baret (Atölyeler), kaptan şapkası (Liman), Otopark Ustası Şapkası (Nişan) | 8 | `sacGizle` bayrağı |
| Üst | Tişört, hırka, yağmurluk, önlük, blazer, kapüşonlu | 10 | 2 renk bölgesi |
| Alt | Kot, eşofman, etek, şort, kargo | 6 | — |
| Ayak | Spor, bot, sandalet, çizme | 5 | — |
| Aksesuar | Gözlük, kolye, kulaklık, rozet iğnesi, saat | 5 | Yüz katmanının üstünde |
| Sırt | Okul çantası, alet çantası, mini kanat (Premium), Düello pelerini (Nişan, v1.1) | 4 | Arka + ön parça |
| Evcil hayvan | Kod Kedisi (300 B, Şık), Liman Martısı (Nadir, rotasyon), Robot Köpek (Premium, Çip), Altın Baykuş (Nişan: 50 altın durak) | 2 (MVP) | 1 tile takip; Odada uyur |

MVP toplamı 40 kozmetik (vizyon kapsamı) bu tabloda 40'tır. Fiyatlar 30–800 B bandında: Sıradan 30–120, Şık 120–400, Nadir 300–800. Premium setler Butik'te (MVP'de 4 ürün: "Neon Gece" seti, "Bulut" kanadı, oda teması "Tente Altı", isim rengi).

### 7.3 Emote listesi

Emote çarkı 8 yuvalıdır (vizyon: 8 başlangıç); Dolap'ta yuvalar değiştirilir. Toplam liste **(B1 önerisi, 18)**:

| # | Emote | Kaynak | Animasyon | Not |
|---|---|---|---|---|
| 1 | El Salla | Başlangıç | 6 kare | — |
| 2 | Alkışla | Başlangıç | 6 kare, döngü 3 sn | Alkış butonundan ayrı; sosyal jest |
| 3 | Gül | Başlangıç | 8 kare | — |
| 4 | Düşün | Başlangıç | 4 kare, çene | Soru balonu çıkar |
| 5 | Dans: Döngü | Başlangıç | 12 kare döngü | `for` esprisi: ayaklar 3'lü sayar |
| 6 | Otur | Başlangıç | 1 kare | Zemine veya oturulabilir eşyaya |
| 7 | Evet | Başlangıç | 4 kare | Baş sallama |
| 8 | Hayır | Başlangıç | 4 kare | — |
| 9 | Omuz Silk | Pazar 60 B (Sıradan) | 4 kare | — |
| 10 | Kalp | Pazar 120 B (Şık) | 6 kare + parçacık | — |
| 11 | Şapka Çıkar | Pazar 120 B (Şık) | 6 kare | Baş slotu doluysa |
| 12 | Tuşlama | Pazar 60 B (Sıradan) | 4 kare döngü | Havada klavye; "kod yazıyorum" |
| 13 | Derleyici Dansı | Nişan: ilk Açılış | 16 kare | Yeşil tik parçacıkları |
| 14 | Konfeti | Nişan: ilk Semt Sınavı | 8 kare + parçacık | — |
| 15 | Mühür Vur | Nişan: 10 altın durak | 6 kare | Altın mühür damgası |
| 16 | Usta Selamı | Nişan: Mentor rozeti (v1.2) | 6 kare | Tebeşir havaya |
| 17 | Robot Dansı | Butik (Çip, Premium paket) | 16 kare | Statik ışık yok; Nişan'dan ayırt edilsin diye altın çerçevesiz |
| 18 | Esne/Uyu | Otomatik (3 dk hareketsiz) | 6 kare döngü | AFK göstergesi; "zzz" balonu |

### 7.4 İsim etiketi ve unvan rozetleri

İsim etiketi avatarın 8 px üstünde: `[rozet] @ad`; üzerine gelince (masaüstü) veya dokununca (mobil) "Kalfa · Sev. 8 · Tente Sokak No: 3" genişler. Arkadaşların adı mavi, lonca üyeleri (v1.1) yeşil, Çip isim rengi yalnızca kendi adının rengini değiştirir. Rozet 16 × 16 px'dir ve tabelada, profilde, Kurul Kartı'nda aynı sprite kullanılır:

| Unvan (KANON) | Seviye | Rozet | Renk |
|---|---|---|---|
| Çırak | 1–5 | Tebeşir parçası | Bronz `#B07A3C` |
| Kalfa | 6–11 | Anahtar | Gümüş `#B8C0C8` |
| Zanaatkâr | 12–17 | Pergel | Bakır `#C8722F` |
| Mühendis | 18–24 | Dişli | Çelik mavisi `#5B7FA6` |
| Baş Mühendis | 25–31 | Çift dişli, altın kenar | Lacivert + altın |
| Mimar | 32–39 | Gönye ve plan rulosu | Mor `#7E57C2` |
| Şehir Mimarı | 40–59 | Şehir silüeti tacı | Altın `#E5B84B` |
| Efsane | 60 + 10 Mentor kilometre taşı | Altın hale, dönen yıldız | Animasyonlu altın |

Nişan rozetleri (Semt Madalyası, Keskin Göz, Otopark Ustası, Düello ceketi, Mentor) **Rozet Duvarı**'na asılır ve profilde görünür; isim etiketinde en çok 1 Nişan ikonu gösterilir (oyuncu seçer).

---

## 8. NPC kadrosu: Ustalar ve diğerleri

### 8.1 Ortak kurallar

Ustalar yetişkindir (28–55 yaş), 4'ü kadın 3'ü erkek; hepsinin elinde KANON'daki "tik" nesnesi vardır ve bekleme animasyonu bu nesneyle yapılır. Konuşma KANON §9'a bağlıdır: ≤ 80 kelime, emoji yok, isimle hitap, "1 doğru şey + 1 eksik + 1 sonraki adım", "Aferin" günde en çok bir kez, hata dili "henüz değil; şu satıra bak". Replikler diyalog balonunda 2 parça hâlinde akar (en çok 40 kelime/parça). Aşağıdaki örnek replikler içerik bankası için ton kılavuzudur; `{ad}` oyuncunun takma adıdır. Ustaların kişilik cümleleri KANON'dan aynen korunmuştur ve her Usta'nın "imza cümlesi" olarak diyalog ağacında bulunur.

### 8.2 Yedi Usta

| Usta | Semt | Görünüş | Tik nesnesi | Öğretim tarzı |
|---|---|---|---|---|
| **Defne** | Çarşı | 30'lu yaşlar, kıvırcık kestane saç topuz, turuncu hırka, krem gömlek, kalem arkasında değil elinde tebeşir | Tebeşir çevirir | Benzetmeci (kutu, etiket, tarif); PRIMM'in Tahmin ve İncele adımlarında uzun, Değiştir'de kısa; ipucu merdiveninde Pusula'yı bir benzetmeyle verir |
| **Kerem** | Liman | 40'lar, kısa kır saç, lacivert balıkçı kazağı, omuzda sarı yağmurluk, bileğinde halat bilezik | Hesap makinesi taşır, tuşlar | Pratik, kısa cümle, liman jargonu; önce örnek veri, sonra kural; "önce say, sonra sırala" |
| **Nehir** | Atölyeler | 30'lar, mavi uçlu kısa saç, alnında kaynakçı gözlüğü, deri önlük, kolunda cetvel | İsimleri düzeltir (havada silgiyle siler, yeniden yazar) | Titiz; kodu "koklar"; her derste bir "kötü tasarım" örneği gösterip oyuncuya düzelttirir; adlandırma geçişinin öğretmeni |
| **Baran** | Kampüs | 20'lerin sonu, yuvarlak gözlük, yeşil kazak, kol altında tablet, ayakkabı bağı çözük | Her şeyi tabloyla anlatır (tablet döner, tablo çıkar) | En Sokratik; cevap vermez, üç soru sorar; esprili; LINQ'i "önce veriye sor" diye öğretir |
| **Elif** | Finans Bölgesi | 30'lar, sıkı at kuyruğu, koyu blazer, beyaz spor ayakkabı, boynunda kronometre | Kronometre tutar, durdurur | Disiplinli, "önce test"; her göreve kırmızı testle başlatır; kanıt ister, süre ölçer |
| **Selin** | Veri Vadisi | 40'lar, kulak arkasında kalem, kareli gömlek, kolunda rulo şema kâğıdı | Kalemi kulak arkasından alır, şemaya çizer | Düzenli, şemacı; önce tablo çizdirir sonra kod yazdırır; "veri yalan söylemez; şema söyler" |
| **Yusuf** | Bulut Tepesi | 50'ler, kısa beyaz sakal, gri rüzgârlık, boynunda dürbün | Dürbünle ufka bakar | Sistemci, büyük resim; her dersi şehir haritasından başlatır ("bu istek nereden nereye gidiyor?"); dağıtımı tören gibi anlatır |

**Usta Defne — örnek replikler**

> "{ad}, `int yas = 17;` satırında üç şey var: kutu, etiket, içindeki şey. Kutuyu buldun, `yas`. Etiketi de söyle bana: `int` kutunun üstünde ne diyor? Sonraki kartta bu etiketin neden önemli olduğunu göreceğiz."

> "Henüz değil; 14. satıra bak. Dakikayı 60'a böldün, güzel. Ama 61 dakika kaç saat etti? Bir. Hasan Abi'ye göre iki olmalıydı. Başlayan saati nasıl yukarı yuvarlarsın, hatırlıyor musun? Pusula'ya bakmak istersen burada."

> "Müşteriye sormadan kod yazan, iki kere yazar, {ad}. Hasan Abi'ye en az dört soru sor; cevapları Sözleşme Kartı'na yazılacak. Benim favorim 'tam 2 saat kalan ne öder?' sorusu; cevabı seni şaşırtabilir."

**Usta Kerem — örnek replikler**

> "{ad}, elimizde 12 konteyner var, sen tek tek sayıyorsun. Liste bir konteyner dizisi; `foreach` vinç. Vinci kur, her konteyneri bir kez kaldırsın. Sonra toplamı söyle."

> "Sıralama doğru, arama yanlış yerde. Önce sıralayıp sonra aramak lazım; sen aradıktan sonra sıralamışsın, manifesto karışmış. Satır 9 ile 12'nin yerini değiştir, testi tekrar çalıştır."

> "Henüz değil; `Split` virgülle ayırıyor ama plakaların arasında boşluk var. Bak: `'34 ABC 123, 06 XYZ 9'`. Virgülden sonra ne kalıyor? Boşluk. `Trim` diye bir vinç daha var; Fener'e bas, hangi satırda lazım göstereyim."

**Usta Nehir — örnek replikler**

> "{ad}, bu sınıf üç iş yapıyor: aracı tutuyor, ücreti hesaplıyor, bir de ekrana yazıyor. Bir atölyede üç usta olmaz. Hangi işi ayırırdın? Önce adını koy; adı doğru koyarsan sınıfı da doğru bölersin."

> "`arac1`, `arac2`, `arac3` diye üç değişken görüyorum ve bir koku alıyorum. Üçü de aynı kalıptan: `Vehicle`. Kalıp varsa liste vardır. Bugünden sonra adlar İngilizce; `Arac` değil `Vehicle`, çünkü yarın ekibin dünyadan olacak."

> "Kalıtım doğru kurulmuş, `Truck : Vehicle`. Eksik olan şu: `Truck`'ın `Capacity` alanı dışarıdan değiştirilebiliyor, kapsülleme delik. `private set` ile kapat, sonra testi çalıştır; `exception` kısmına yarın geliyoruz."

**Usta Baran — örnek replikler**

> "{ad}, sorguyu bana sormadan önce veriye sor. Elinde 40 kitap var; geciken kaçı? Say. Peki hangi koşulla saydın? İşte o koşul senin `Where`'in. Üçüncü soru: sıraya koymak istersen hangi alana göre?"

> "Tablo yapalım: sol sütun kitap, sağ sütun gecikme günü. Şimdi 'gecikme günü > 0' satırlarını işaretle. Kaç satır kaldı? Kodun da tam olarak bunu yapacak; `Where(k => k.GecikmeGunu > 0)`. Lambda, tablodaki işaretleme kuralıdır."

> "Henüz değil; `OrderBy` ile sıraladın ama sonucu bir yere koymadın. LINQ tembeldir, sen istemeden çalışmaz. `ToList()` nerede? Taslak'ta eksik satırı bıraktım, istersen bak; istemezsen önce 30 saniye düşün, bence bulursun."

**Usta Elif — örnek replikler**

> "{ad}, çalıştı demek yetmez; kanıtı nerede? Önce test yazacağız, kırmızı görecek, sonra kodu yazıp yeşile çevireceğiz. Kronometre bende: ilk kırmızı testini 2 dakikada istiyorum."

> "`await` koydun ama metodun adı hâlâ `Hesapla`. Asenkron metodun adı `HesaplaAsync` biter; bu bir sözleşme, okuyan kişi bekleyeceğini bilir. Düzelt, sonra `Task` dönüşünü kontrol et; testin ikinci satırı o yüzden kırmızı."

> "İstek başarısız oldu diye uygulaman çöktü. Banka müşterisi bunu görmemeli. Üç deneme, aralarında bekleme; buna dayanıklılık diyoruz. Fener'de hangi satırı sarmalayacağını gösterdim. Kanıt olarak bana kırmızıdan yeşile dönen bir test getir."

**Usta Selin — örnek replikler**

> "{ad}, kodu kapat, kâğıdı aç. Hasta ile randevu arasındaki ilişki ne? Bir hastanın kaç randevusu olabilir? Çok. Bir randevunun kaç hastası? Bir. İşte şeman: 1 — n. Şemayı çizmeden tablo yaratan, iki kez migration yazar."

> "Migration'ı yazdın, güzel; eksik olan geri alma yolu. `Down` metodu boş. Yarın bu kolonu kaldırmak istersen ne olacak? Veri yalan söylemez; şema söyler. `Down`'ı doldur, sonra `Update-Database`."

> "Henüz değil; iki kaydı ayrı ayrı yazıyorsun, biri geçerse biri kalıyorsa otelde oda var ama misafir yok. İkisini tek transaction'a al: ya ikisi ya hiçbiri. Değirmeni hatırla: çark tam dönmezse un çıkmaz."

**Usta Yusuf — örnek replikler**

> "{ad}, dürbünü al. Şu aşağıdaki Yemek Sipariş Platformu'ndan bir sipariş çıkıyor; nereye gidiyor? Hangi kapıdan giriyor? Şehirdeki her dükkân konuşabilmeli; API bu. Bugün ilk kapıyı açıyoruz: `GET /siparisler`."

> "Controller'ın veritabanına doğrudan gidiyor. Çalışır ama yarın veritabanı değişirse kapı da yıkılır. Araya bir servis koy, DI ile ver; kapı bekçisi kimin geldiğine değil, ne istediğine baksın. Sonraki adım: `Program.cs`'te kaydı."

> "Dağıtım bir törendir, {ad}. Testler yeşil, DTO'lar temiz, auth kapıda. Dağıtım Kulesi'ne çık, düğmeye bas; ışık demeti şehre inince senin API'n herkesin kapısında çalıyor olacak. Bunu Sev. 1'de tramvaydan inen çocuğa anlatmak isterdim."

### 8.3 Diğer NPC'ler

| NPC | Rol (KANON) | Görünüş | Konuşma | Konum |
|---|---|---|---|---|
| **Hasan Abi** | Otopark müşterisi; kurucunun kurallarını birebir söyler | 50'ler, bıyık, kasket, yelek, elinde kareli defter, kalem kulakta | Kısa, kesin, sıcak esnaf ağzı: "Başlayan saat tam sayılır; 2 saatten az kaldı: 200." | Çarşı: tapu öncesi arsa önü, sonra işletme kapısı; İş Emri ve Savunma'da konuşur |
| **Müfettiş** | Gizli testleri çalıştırır, şikâyet balonu ve Hata Bildirimi dosyası getirir | Uzun boylu, bej trençkot, fötr şapka, elinde renkli dosya (yeşil: geçti, kırmızı: Kararmış, sarı: Hata Bildirimi) | Neredeyse konuşmaz; resmî tek cümle: "Dosya bıraktım." / "Müşteri 1.440 dakika için 500 TL ödemiş." | Kararmış işletme kapısı, Hurdacı Avlusu, oyuncunun Odasının posta kutusu (bildirim) |
| **Kurul** | Kişiliksiz puanlayıcı | Bedeni yok; mühürlü kart (lacivert, altın mühür, kriter çubukları) | Yalnızca kart metni; isimle hitap etmez | Kurul Kartı; Akademi'de mühürlü kapı |
| **Belediye Memuru Nuran** | Ruhsat/tapu bilgisi, adres (B1 önerisi) | 40'lar, gözlük, yaka kartı, damga | Resmî ama güler yüzlü: "Ruhsatın 2/3; bir görev kaldı." | Meydan Belediye Köşkü; semtlerde Tapu Masası |
| **Kütüphaneci Ayşe** | Kütüphane müşterisi (vizyon) | 30'lar, hırka, kolunda kitap yığını | Nazik, kuralcı: "Her türden raf istiyorum; gecikene gün başı ceza." | Kampüs Kütüphane arsası |
| Kaptan Rıza, Balıkçı Gülsüm, Gümrük Memuru Faruk, Nalbur Sabri, Veri Bahçıvanı, Kapı Bekçileri | Müşteri/dükkân NPC'leri (B1 önerisi) | Semt paletinde | B5 belirler | İlgili semt |
| Figüran NPC'ler | Kalabalık hissi | İsim etiketi yok, rozet yok, soluk kıyafet paleti, oyunculardan açıkça ayırt edilir | Konuşmaz; tıklanınca kısa semt esprisi balonu | Her kamusal sahnede; sayı gerçek nüfusla ters orantılı (§11.3) |

---

## 9. Zaman: gece/gündüz, mevsim, dünya etkinlikleri

### 9.1 Gece/gündüz

Oyun saati **gerçek Türkiye saatidir** (UTC+3) **(B1 önerisi)**: herkes aynı günü yaşar, "akşam Meydan'da buluşalım" cümlesi anlamlıdır, lig kapanışı (Pazar 21:00) ve Meydan Sorusu (saat başı) dünyayla örtüşür. Dört faz vardır; geçişler 10 dakikalık yumuşak tween'dir:

| Faz | Saat | Overlay (katman 7) | Işık katmanı | Sahne davranışı |
|---|---|---|---|---|
| Sabah | 06:00–10:00 | Soğuk beyaz `#DDE8F5` %12, uzun gölgeler | Kapalı | NPC dükkânlar kepenk açar (08:00), simitçi çıkar |
| Gün | 10:00–17:00 | Yok | Kapalı | Tam aktivite |
| Akşam | 17:00–20:00 | Amber `#F2B134` %18 | Açılır (tabela, lamba) | Meydan "akşam ışıkları"; en kalabalık saat |
| Gece | 20:00–06:00 | Lacivert `#1B2440` %35 | Tam; `ADD` blend | Finans neonu, Otopark L4 ışıkları, pencerelerde ışık; NPC dükkânlar 21:00'de kepenk indirir, oyuncu işletmeleri açık kalır |

Hiçbir oynanış öğesi faza kilitli değildir (vizyon ilkesi 10: zamanlayıcı kasada durur, derste değil). Gece yalnızca görsel ve sosyal değer katar: Otopark L4'ün "Gece Tarifesi" neonu, Finans'ın neonu, Odadaki lambaların anlamı. Mobilde gece overlay'i pil için tek düz katmandır; ışık sprite'ları en çok 24 adet/sahne.

### 9.2 Mevsim (v1.1)

Sezonlar MVP dışıdır (vizyon §13); ama overlay, parçacık ve "değişebilir dekor" slotları MVP'de kurulur ki v1.1'de yalnızca varlık eklensin. Takvim gerçek mevsimdir:

| Mevsim | Aylar | Görsel | Sahne değişiklikleri | Etkinlik |
|---|---|---|---|---|
| İlkbahar | Mart–Mayıs | Kampüs ağaçları çiçek, çim parlak, kuş parçacığı | Meydan çeşmesi çiçek saksılı | "Yeni Dönem": Akademi kapısında yeni ders duyurusu |
| Yaz | Haziran–Ağustos | Sıcak overlay %6, Liman'da şezlong ve şemsiye, ateşböceği (Veri Vadisi gece) | Çarşı tenteleri açık renk | "Liman Şenliği": iskelede balık tutma emote'u, Oto Yıkama kampanya tabelası (görsel) |
| Sonbahar | Eylül–Kasım | Yaprak parçacığı, Kampüs ağaçları turuncu | Bloklar'da çamaşır yerine hasır | "Kod Festivali": Meydan'da sahne, Vitrin turu, en çok alkışlanan 10 işletme panoda |
| Kış | Aralık–Şubat | Kar parçacığı, çatılarda kar tile'ı, nefes buharı | Meydan çeşmesi **buz pisti** (kayma emote'u), Finans neonu kara yansır | "Yılbaşı Işıkları": tramvay ışıklı; işletmelere ücretsiz ışık dizisi süsü (Bayt yok, kozmetik hediye değil, sahne dekoru) |

Resmî bayramlarda (23 Nisan, 19 Mayıs, 29 Ekim) Meydan ve tramvay bayrakla süslenir; dinî bayramlarda Çarşı'da şeker tezgâhı ve "bayramınız kutlu olsun" panosu. Hiçbir mevsim/bayram dekoru satın alınamaz; sahne dekorudur.

### 9.3 Dünya etkinlikleri

| Etkinlik | Zaman | Sahne | Görsel | Sürüm |
|---|---|---|---|---|
| **Meydan Sorusu** | Saat başı | Meydan (shard başına), Liman feneri ve Kampüs çanı sinyal verir | Çeşme yükselir, pano "MEYDAN SORUSU", 60 sn; en hızlı 3 kişi panoda; Liderlik Panosu'nda küresel | MVP |
| **Açılış kutlaması** | Her Açılış'ta | İlgili Ara Sokak + LED pano | Konfeti, bariyer kalkışı, ilk araba; sokaktaki oyunculara "Alkışla" düğmesi | MVP |
| **Lig kapanışı** | Pazar 21:00 | Meydan | Havai fişek 20 sn, pano ilk 3'ü akıtır; Pazartesi 00:00 podyum heykelleri yenilenir | MVP |
| **Pazar rotasyonu** | Pazartesi 09:00 **(B1 önerisi)** | Meydan Pazar önü | Kamyon gelir, mankenler değişir (2 dk animasyon), İlan Panosu güncellenir | MVP |
| **Müfettiş turu** | Günde 3 (Hata Bildirimi) | Oyuncunun posta kutusu / işletme kapısı | Müfettiş dosya bırakır, posta kutusu bayrağı kalkar | MVP |
| **Semt açılışı** | Oyuncu Semt Sınavı'nı geçince | Kilitli semt kapısı | 3 sn iskele sökümü, Semt Madalyası animasyonu | MVP |
| **Şehir kilometre taşları** | 1.000 / 10.000 / 100.000. açık işletme | Tüm sahneler | Gece 20 sn ışık dalgası şehri dolaşır; pano "10.000. işletme: @ad" | MVP |
| **Arena turnuvası** | Cumartesi 20:00 | Arena | Tribün, test çubukları, şampiyon ceketi | v1.2 |
| **Kod Festivali** | Sonbahar, 1 hafta | Meydan | Sahne, Vitrin turu | v1.1 |

---

## 10. Navigasyon

### 10.1 Yürüme

Tıkla-yürü: hedef hücre vurgulanır (beyaz elmas), A* yolu zeminde noktalı çizgiyle 1 saniye görünür, avatar **4 tile/sn** **(B1 önerisi)** yürür; koşma yoktur (sosyal oyun temposu, mobilde parmak ritmi). Yol en çok 60 tile; engele takılırsa yeniden hesaplar; başka avatarlar engel değildir (iç içe geçmeden yanından kayar). Mobilde dokun-yürü, sürükle-kaydır, iki parmak zoom; masaüstünde ayrıca WASD/ok tuşlarıyla serbest yürüme ve tekerlekle zoom. Tıklanabilir nesnelerin üstünde "el" imleci ve nesne adı (hover); mobilde ilk dokunuş adı gösterir, ikinci dokunuş girer (yanlış dokunmayı önler).

### 10.2 Kapılar ve sahne geçişi

Semtler ve sahneler **geçiş plakaları** ile bağlıdır: caddenin ucunda zeminde ok ve semt adı ("Liman →"); üzerine basınca 1 saniyelik geçiş (siyah değil, semt renginden semt rengine yumuşak geçiş). Kapı (Akademi, Pazar, Oda, işletme içi) üstüne basınca açılır; 20/20 dolu instance'ta kapı "Dolu" der ve alternatif önerir (bkz. §11). Kilitli semt kapısında turist modu düğmesi (§2.5).

### 10.3 Hızlı seyahat

| Araç | Nereden | Nereye | Kural |
|---|---|---|---|
| **Tramvay** | Her semtin durağı | T1 hattındaki herhangi bir durak; T2 ile Tepe | Bekleme yok; 1,5 sn vinyet; ücretsiz |
| **Şehir Haritası** (HUD, M tuşu) | Her yerden | Her semtin durağı, Akademi, Oda, işletmelerim | Onboarding'de 23. dakikada açılır; kilitli semt → turist modu onayı |
| **Evim** (HUD, H) | Her yerden | Kendi Odan | Sev. 2+ |
| **Akademi** (HUD, A) | Her yerden | Akademi Lobisi | Her zaman |
| **İşletmelerim** paneli | HUD | İlgili Ara Sokak, parselin önü | Kasa dolu ikonu paneldeki işletmede yanar |
| **Arkadaşa git** | Arkadaş listesi | Arkadaşın bulunduğu shard/instance | Odası kilitliyse kapı önü; Kürsü ve Savunma'ya takip yok |
| **Geri** | HUD | Son konum | Tek adım |

Onboarding'de (ilk 30 dakika) yalnızca yürüme ve tek görev işaretçisi vardır; tramvay 23. dakikada haritayla birlikte açılır. Görev işaretçisi tektir: zeminde noktalı yol, uzaktaysa "Tramvayla 1 durak" önerisi ve durağa işaret.

### 10.4 Şehir Haritası ekranı

Şehir Haritası (ekran #5) izometrik render değil, **çizilmiş 2D şehir illüstrasyonu**dur: §2.2'deki krokinin resimli hâli; semtler renk bloklarıyla, kilitliler iskele dokusuyla, Satılık arsalar yanıp sönen "S" etiketiyle, görev hedefi tek işaretçiyle, oyuncunun işletmeleri küçük tabela ikonlarıyla (Kararmış olan gri), arkadaşların konumu (yalnızca paylaşanlar) avatar başı ikonuyla. Haritanın üstünde günün fazı (güneş/ay) ve bir sonraki Meydan Sorusu'na kalan süre. Masaüstünde ayrıca ekranın köşesinde **pusula**: en yakın görev hedefinin yönü (mini harita yoktur; mini harita sosyal oyunlarda ekranı kalabalıklaştırır ve mobilde yer yoktur).

---

## 11. Oda/instance modeli ve kalabalık yönetimi

### 11.1 Neden sahneler, neden shard

Tek sürekli dünya (tek büyük ızgara, herkes aynı yerde) iki nedenle reddedildi: (a) 4 GB telefonda 24.000 tile + yüzlerce avatar çizilemez; (b) Sanalika/Habbo hissi zaten **oda temellidir**: "hangi odadasın?" sorusu sosyal dokunun parçasıdır. Model: her sahne bir instance türüdür; kamusal sahneler **shard**lanır (aynı sahnenin paralel kopyaları), özel sahneler (Oda, Ara Sokak, işletme içi) sahibine bağlı tek instance'tır.

| Instance türü | Kapasite | Kalıcılık | Kim girer | Yeni kopya eşiği |
|---|---|---|---|---|
| Derleyici Meydanı | 40 (KANON) | Shard; kalıcı sahne | Herkes | 36'da yeni shard açılır (§11.2) |
| Semt Ana Caddesi | 40 (B1 önerisi) | Shard | Herkes (kilitliyse turist) | 36 |
| Akademi Lobisi | 40 | Shard | Herkes | 36 |
| Kürsü | 12 (B1 önerisi) | Shard | Herkes (ders kilitli olabilir) | 10 |
| Akademi Atölyesi | 20 | Shard | Herkes | 18 |
| Pazar (iç) | 20 | Shard | Herkes | 18 |
| Ara Sokak | 20 (B1 önerisi) | Tek instance (6 parsel) | Herkes; sahipler + ziyaretçiler | Dolunca "Dolu"; sahipleri her zaman girer (kapasite üstü +6 sahip hakkı) |
| İşletme içi | 15 (KANON) | Tek instance | Herkes (izin: açık/arkadaş) | Dolunca "Dolu"; sahip her zaman girer |
| Oda | 20 (KANON) | Tek instance | İzne göre | Dolunca "Dolu"; sahip her zaman girer |
| Blok Sokağı | 40 | Shard | Herkes | 36 |
| Lonca Binası (v1.1) | 30 | Lonca başına tek | Üyeler + davetli | — |
| Arena (v1.2) | 60 seyirci + 2 | Etkinlik instance'ı | Herkes | Yeni tribün shard'ı |

### 11.2 Shard seçimi ve birleştirme

Oyuncu bir kamusal sahneye girerken sunucu (B7, Redis'te shard sayaçları) şu sırayla shard seçer: (1) **arkadaşının bulunduğu** shard (kapasite altındaysa), (2) **kohort kodu** aynı olanların shard'ı (vizyon risk 4: kulüp kodları aynı shard'a), (3) **en dolu ama ≤ 32** shard (sosyal yoğunluk; boş shard'a atmak boş şehir hissi yaratır), (4) yoksa yeni shard. 36/40'ta yeni gelenler için yeni shard açılır, son 4 yer "arkadaşa katıl" ve sahiplere saklanır. 10 dakikadan uzun süre 8 kişinin altında kalan shard **yumuşak birleştirilir**: yeni giriş almaz, içindekiler çıktıkça kapanır; kimse zorla taşınmaz. Shard'lar arası görünen akışlar (LED pano küresel yarısı, Liderlik Panosu, Cadde Arsası rotasyonu) ortaktır; sohbet ve avatarlar shard'a özeldir. "Shard değiştir" düğmesi yoktur; "arkadaşa git" vardır.

### 11.3 Kalabalık yönetimi ve görünürlük LOD'u

| Shard doluluğu | Kural |
|---|---|
| ≤ 24 avatar | Tam çizim: isim etiketleri, gölge, emote parçacıkları, evcil hayvanlar |
| 25–40 | Arkadaş olmayanların isim etiketi yalnızca hover/dokunuşta; gölgeler basit; emote parçacığı kapalı; evcil hayvanlar çizilir ama animasyonsuz |
| Her zaman | Eşzamanlı sohbet balonu ≤ 12 (en eski kaybolur); balon 6 sn kalır; 1 mesaj/3 sn, 200 karakter, link yok (KANON) |
| Figüran NPC sayısı | `max(0, 12 − gerçek_oyuncu)`; 12+ gerçek oyuncuda figüran yok |
| Performans | Hedef 60 fps masaüstü, 30 fps mobil 40 avatarda; `prefers-reduced-motion` tüm parçacıkları kapatır |

Kalabalık hissi için üç ek kural: avatarlar birbirinin içinden geçmez ama **yan yana durabilir** (aynı hücrede en çok 2, hafif ofset); Meydan Sorusu sırasında oyuncular çeşme çevresinde toplanma eğilimi gösterir (soru paneli yalnızca o shard'da görünür; shard'lar arası eşitlik için soru küreseldir); kalabalık shard'da oturulabilir banklar "dolu" olur ve oyuncu yere oturur (emote 6).

### 11.4 Bağlantı ve devamlılık

Bağlantı kopunca avatar 30 saniye "hayalet" (yarı saydam) kalır, sonra kaybolur; geri gelince aynı shard'a ve hücreye döner (Redis'te konum). Kürsü'de ders sırasında bağlantı kopması kartı kaybettirmez (ders durumu sunucuda). Savunma ve Semt Sınavı sırasında instance değişikliği yapılamaz.

---

## 12. Sanalika hissi kontrol listesi

| # | Sanalika'da | KodKent'te (dünya karşılığı) | Öğrenme için uyarlama |
|---|---|---|---|
| 1 | Tıkla-yürü avatar, baş üstü balon | Aynı; 4 tile/sn, 4 yön, 96 px | Kürsü içinde balon kapalı (odak); Atölye'de "yardım iste" balonu hazır cümleli |
| 2 | Kıyafet, kozmetik, hava atma | Dolap, 7 slot, Pazar rotasyonu, Podyum | **Nişan** kademesi yalnızca kazanılır; en gösterişli şeyler satılmaz |
| 3 | Kendi odan, eşya döşeme | Stüdyo 6 × 6, ızgara, döndürme, istifleme, 25 eşya | Çalışma Masası, Rozet Duvarı, Kod Çerçevesi, Metro Posteri işlevseldir; oda "öğrenme portföyü" olur |
| 4 | Başkasının odasını ziyaret | Kapıdan kapıya, çevrimdışıyken de; ziyaretçi defteri, ayak izi | Ziyaretin asıl hedefi **işletme**: Ara Sokak, Vitrin'de kod okuma (günde 3 × 10 XP) |
| 5 | Sokaklar, semtler, meydan | 7 semt + Meydan + Bloklar; tramvay | Semt = C# konu kümesi; kilitler zamanla değil Semt Sınavı'yla; kilitli semt gezilebilir |
| 6 | Kalabalık meydan, sohbet | 40 avatarlık shard, Meydan Sorusu, LED pano | Pano kodunu akıtır; Meydan Sorusu öğrenme eylemidir; 15–17 güvenli mod |
| 7 | Emote ve dans | 8 başlangıç + 10 kazanılan/satın alınan | Derleyici Dansı, Konfeti, Mühür Vur yalnızca başarıyla |
| 8 | Mağaza ve "yeni geldi" heyecanı | Pazar, Pazartesi 09:00 kamyonu, mankenler | Bayt yalnızca koddan gelir; Çip stil verir, bilgi iddiası vermez |
| 9 | Statü işaretleri (Plus, VIP) | Unvan rozeti, tabela, podyum heykeli, Gözlem Terası ışıkları | Statü = derlenmiş kod; "Usta" sözcüğü oyuncuya verilmez |
| 10 | Mini oyunlar | Meydan Sorusu, Hata Bildirimi, Kod Düellosu (v1.1), Arena (v1.2) | Hepsi C# üzerinedir; bahis yok |
| 11 | Hediye, takas, evlilik/flört odaları | **Yok** | KANON: Bayt transferi, hediye, ticaret yok; 15+ kitlede flört içeriği yok |
| 12 | "Boş oda" hissi | Figüran NPC, NPC trafiği, öne çıkan işletmeler, asenkron izler | Dünya her zaman hareketlidir; sosyal önce pasif |
| 13 | Müzik/radyo | Semt temaları, Oda plak çaları | Her semtin teması ilerlemenin işitsel ödülüdür |
| 14 | Ev büyütme | Daire, Çatı Katı (MVP+1) | Seviye + Bayt; Çip ile asla |

Sanalika'dan **bilerek alınmayanlar**: parayla statü (Plus), hediye/takas (RMT kapısı ve kumar benzeri mekanik), flört/evlilik odaları (15+ ve veli onayı), rastgele ödül kutuları, VIP'e özel semt. KodKent'te hiçbir kapı Çip'le açılmaz; bu, dünya tasarımının en görünür ilkesidir ve her kilitli kapının plakasında kilidin **ne ile** açılacağı yazar (ders, görev, sınav) — asla fiyat.

---

## 13. Üretim: varlık listesi ve bütçe (MVP)

| Kalem | Adet | Not |
|---|---|---|
| Zemin tile'ları | Ortak 24 + semt başına 16 (Meydan, Çarşı, Liman, Bloklar) = 88 | Kilitli semtler için 8'er (40) düşük detay |
| Modüler bina parçaları | Duvar 6 malzeme × 4 parça, çatı 4, kapı 6, pencere 6, tabela 4 Tier × 3 = 76 | Otopark L1–L5 ekleri 5, durum overlay'leri 4 |
| İşletme binaları (MVP açık) | Otopark (5 seviye), Büfe (4), Kargo Deposu (4) = 13 bina durumu | Modüler eklerle |
| Kilitli semt işletme kabukları | 14 bina × 1 kabuk | Yalnızca dış cephe |
| NPC dükkânları | Meydan 6, Çarşı 5, Liman 6, Bloklar 3 = 20 | Kilitli semtler 3'er |
| Avatar temel | 3 vücut × 2 çizilmiş yön × (bekleme 2 + yürüme 8 + oturma 1 + tuşlama 4 + AFK 6) = 126 kare + yüz parçaları 15 + saç 16 × 2 yön × 2 parça | Palet takası renkleri bedavaya getirir |
| Kozmetik | 40 öğe × 2 yön × (bekleme + yürüme kareleri) | Yürüme için yalnızca alt/ayak slotları kare başına yeniden çizilir; üst/baş/aksesuar bekleme karesine sabitlenir ve ofsetlenir |
| Emote | 8 başlangıç + 4 Pazar + 3 Nişan + 1 AFK = 16 animasyon | Robot Dansı ve Usta Selamı v1.1/v1.2 |
| Oda eşyası | 25 + 12 kaplama | 2 çizilmiş yön |
| NPC karakterler | Defne, Kerem, Hasan Abi, Müfettiş, Nuran, 6 dükkân NPC'si, 6 figüran = 17 | Diğer 5 Usta: kürsü pencereli kapıdan görünür, bekleme animasyonu yeterli |
| Araçlar | Binek araba 3 renk, tramvay, forklift, kamyon (Pazar rotasyonu) | 2 yön |
| Parçacık/efekt | Konfeti, kıvılcım, martı, havai fişek, su, yaprak/kar (v1.1 kancası) | Sprite sheet 512 × 512 |
| Ses | 4 müzik teması × 2 (gündüz/gece) + 5 kilitli semt teması (30 sn kısa döngü) + 60 ortam/tek seslik | OGG + AAC |

Yarı zamanlı piksel sanatçısı için iş yükü tahmini: avatar temel ve 40 kozmetik 4 hafta, Meydan + Akademi 2 hafta, Çarşı + Otopark 2 hafta, Liman + Bloklar 2 hafta, UI ikonları ve rozetler 1 hafta, kilitli semt kabukları 1 hafta = **12 hafta** (B9'un takvimiyle örtüşür; 5–8. haftalarda 2. sanatçı desteği önerilir).

---

## 14. B1 önerilen sabitler (KANON v1.1 adayları)

| Anahtar | Değer | Not |
|---|---|---|
| `TILE_SIZE` | 64 × 32 px (zoom 1,0); kaynak 128 × 64 | 2:1 dimetrik |
| `FLOOR_HEIGHT` | 48 px | Bir kat |
| `AVATAR_HEIGHT` | 96 px | 3 vücut tipi, tek boy, 4 yön (2 çizilmiş) |
| `WALK_SPEED` | 4 tile/sn | Koşma yok |
| `SCENE_SIZES` | §1.4 tablosu | Meydan 40 × 40; Kürsü 12 × 10; Stüdyo 6 × 6 |
| `CAP_ANA_CADDE` | 40 | Meydan ile aynı |
| `CAP_ARA_SOKAK` | 20 (+6 sahip hakkı) | 6 parsel |
| `CAP_KURSU` / `CAP_AKADEMI_ATOLYE` / `CAP_LOBI` / `CAP_PAZAR` | 12 / 20 / 40 / 20 | — |
| `SHARD_NEW_AT` / `SHARD_MERGE_BELOW` | 36 / 8 (10 dk) | Seçim sırası: arkadaş → kohort → en dolu ≤ 32 → yeni |
| `LOD_FULL_MAX` | 24 avatar | Üstünde isim etiketleri hover'da |
| `CADDE_ARSASI_COUNT` / `ROTATION` | 6 / saat başı | 2 en çok alkış + 2 en yeni + 2 shard sahibi |
| `MEYDAN_OTOPARK_RULE` | Son 72 saatte açılmış, sahibi Sev. ≤ 5 | Saat başı rotasyon |
| `PARSEL_CARSI` | 12 × 10 tile | Otopark 7 × 6, Büfe 3 × 3, Manav 4 × 4 |
| `ADRES_FORMAT` | "Semt · Sokak Adı No: N" | Sokak adı havuzu 24/semt |
| `NPC_TRAFFIC_VISUAL` | 1 araç / ~45 sn | Ekonomiden bağımsız |
| `ODA_ESYA_CAP` | Stüdyo 25 (KANON) / Daire 40 / Çatı Katı 60 | — |
| `EMOTE_TOTAL` | 18 (8 başlangıç KANON) | Çark 8 yuva |
| `AVATAR_OPTIONS` | 3 vücut, 8 ten, 3 × 6 × 4 × 5 yüz, 16 × 12 saç, 12 hazır kıyafet seti | — |
| `DAY_PHASES` | Sabah 06–10 / Gün 10–17 / Akşam 17–20 / Gece 20–06 (TR saati) | 10 dk geçiş |
| `PAZAR_ROTATION_TIME` | Pazartesi 09:00 | Kamyon animasyonu |
| `LED_FEED_MIX` | %50 yerel / %50 küresel; mesaj ≤ 8 sn | — |
| `SAHA_ATOLYESI` | Semtteki Akademi şubesinin resmî adı | Usta iki konumda (Kürsü + Saha) |
| `TRAM_LINES` | T1 Çevre Hattı (8 durak), T2 Tepe Hattı (füniküler) | Bekleme yok, 1,5 sn vinyet |
| `FIGURAN_COUNT` | max(0, 12 − gerçek oyuncu) | İsim etiketi yok |

---

## 15. Varsayımlar

1. **Belge id eşlemesi:** VİZYON çekirdek döngü, B2 ilerleme & ekonomi, B3 eğitim sistemi/AI, B4 müfredat, B5 işletmeler & kod, B6 görevler/sosyal/canlı operasyon, B7 backend, B8 istemci/ekranlar, B9 ürün/yol haritası — 03-ajan-talimati §2 ile hizalanmıştır (3 Kasım düzeltmesi; eski B2–B12 numaralaması geçersizdir).
2. **"Akademi şubesi"** istemi, KANON'un "Akademi tek bina" kuralıyla **Saha Atölyesi** (semt içi görev noktası, aynı görev motoru) olarak uzlaştırılmıştır; Akademi'deki Kürsü ve Atölye aynen korunur.
3. **"Kodla!" tabelası**, KANON durumu "Kapalı — yazılım bekliyor"un yerine değil üstüne eklenmiş, dünya uzayında duran tıklanabilir bir çağrı düğmesidir; resmî durum plakası KANON metnini taşır.
4. **İşletme sahipliği coğrafyası** (Ana Cadde / Ara Sokak / parsel) bu belgede ilk kez tanımlanmıştır; "işletme içi 15" KANON kapasitesi iç mekân instance'ına, Ara Sokak için 20 (B1 önerisi) kullanılmıştır.
5. **Tier (T1–T4)** semt zorluk katmanı, **L1–L5** işletme seviyesi olarak ayrılmıştır; görev metnindeki "Tier yükseltmeleri" her iki eksende karşılanmıştır.
6. Oyun saati gerçek TR saatidir; sezon görselleri v1.1'dir (vizyon MVP kapsamı), ama overlay/parçacık/dekor slotları MVP'de kurulur.
7. Avatar iskeleti cinsiyetsizdir; 3 vücut tipi × tek boy; 4 yön (2 çizilmiş). Bu, yarı zamanlı piksel sanatçısı bütçesine göre alınmış bir karardır.
8. Görsel NPC trafiği (≈45 sn/araç) ekonomik simülasyondan (12 araç/gün, gece batch) bağımsızdır ve İşletme Paneli gerçek sayıları gösterir.
9. Müşteri NPC adları (Kaptan Rıza, Balıkçı Gülsüm, Gümrük Memuru Faruk, Nalbur Sabri, Veri Bahçıvanı, Belediye Memuru Nuran) B1 önerisidir; Hasan Abi ve Kütüphaneci Ayşe kaynak belgelerden gelir.
10. Bloklar'daki kapı atamaları ve Cadde Arsası rotasyonu **shard başına** hesaplanır (kişiselleştirilmiş değil), böylece aynı shard'daki herkes aynı şeyi görür; tek kişiselleştirme, oyuncunun kendi parselindeki alınmamış türlerin "Satılık" tabelasıdır.
11. Oyuncu işletmesi dış görünümünde kullanıcı metni yalnızca işletme adı (200 B) ve Tebeşir Tahtası eşyasıdır (40 karakter); ikisi de takma ad moderasyonundan geçer (B6).
12. Kürsü içinde başka oyuncuların görünmesi (12 kişi) dikkat dağıtmaz varsayılmıştır; sohbet balonları kapalı, yalnızca emote.

## 16. Açık Sorular

1. Ara Sokak komşu ataması arkadaş/kohort önceliğiyle mi, tamamen rastgele mi olmalı; **taşınma** (adres değiştirme) Belediye Köşkü'nden 200 B'ye açılmalı mı?
2. Semt sahneleri ayrı yüklenen sahneler olarak tasarlandı; B7/B8 tek sürekli dünya (chunk akışı) tercih ederse kapasite ve shard modeli nasıl değişir?
3. Kürsü'de diğer oyuncuların görünmesi ders terkini artırıyor mu? (İlk 1.000 oyuncuda A/B: kalabalık Kürsü vs. tek kişilik Kürsü.)
4. Otopark gibi açık işletmelerde Vitrin gişe duvarında; B5 bazı işletmelere iç mekân zorunluluğu getirirse "işletme içi 15" kapasitesi hangi işletmelerde geçerli olacak?
5. Evcil hayvan slotu MVP'de mi (2 öğe) yoksa v1.1'de mi? Takip eden sprite 40 avatarlık shard'da çizim bütçesini zorlayabilir.
6. 15–17 güvenli modda Oda ziyareti varsayılanı "arkadaşlara" olarak önerildi; veli onayı sonrası "herkese açık" seçilebilir mi, yoksa 18 yaşına kadar sabit mi? *(ÇÖZÜLDÜ 3 Kasım, KANON §12.2: hukuk teyidine kadar "Arkadaşlara" sabit.)*
7. Görünürlük LOD eşiği 24 doğru mu; mobilde 16'ya düşürülmeli mi? (H2 yük testinde ölçülecek.)
8. Gözlem Terası'nda (Bulut Tepesi) turist modundaki düşük seviyeli oyuncuya şehir minyatürü gösterilmeli mi, yoksa bu "Şehir Mimarı" ödülü olarak saklanmalı mı?
9. Meydan Otoparkı rotasyon kuralı ("son 72 saat, Sev. ≤ 5") lansmanın ilk günlerinde boş kalırsa yedek kural ne olmalı (en yeni Açılış, seviye sınırı yok)?
10. Podyum heykelleri (haftanın lig birincileri) gösteriş baskısı yaratır mı; Kalıcılık Ligi birincisi de kaideye alınmalı mı (vizyon açık sorusu 6 ile bağlantılı)?
11. Mevsim ve bayram dekorlarının v1.1'e ertelenmesi kesin mi; kış buz pisti gibi tek bir etkinlik MVP'nin lansman ayına denk gelirse öne alınabilir mi?
12. Sokak adı havuzları (Tente Sokak, Zincir Sokak…) moderasyon dışı sabit listedir; oyuncuların sokağa isim önermesi (lonca sürümü) v2'ye mi kalmalı?

## 17. Diğer Belgelere Bağımlılıklar

| Belge | B1'in verdiği | B1'in beklediği / uyum noktası |
|---|---|---|
| **VİZYON (çekirdek döngü)** | Öğren → Uygula → İnşa Et → Kazan → Harca → Göster adımlarının sahneleri (Kürsü, Saha Atölyesi/Atölye, parsel, kasa, Pazar, Meydan/Podyum/Vitrin) | Oturum uzunluğu hedefleriyle sahne geçiş sayısının (≤ 3 geçiş/oturum) uyumu |
| **B2 (ilerleme)** | Unvan rozetleri, Metro Haritası mozaiği, Mühür Duvarı, Semt açılış animasyonu | Semt kilidi mesaj metinleri ("Sev. 6 — sen Sev. 4") |
| **B3 (eğitim/AI)** | Kürsü yerleşimi, Usta konumları, Kurul Odası'nın mimari ifadesi, Usta replik tonu ve görünüşleri | Replik bankası ve persona prompt'ları bu görünüş ve tik tanımlarıyla tutarlı olmalı; "yardım iste" hazır cümle listesi |
| **B4 (müfredat)** | Semt motiflerinin C# konularıyla eşlemesi (kutu/etiket, vinç/foreach, kalıp/sınıf, raf/LINQ, lamba/test, köprü/ilişki, drone/API) | Ders kartlarının bu metaforları kullanması; Kürsü penceresinden görünen sahne kesiti |
| **B5 (işletme kataloğu)** | Her işletmenin ayak izi, Tier bina sınıfı, durum görselleri, Otopark L1–L5 ekleri, müşteri NPC önerileri | Müşteri NPC adlarının kesinleşmesi; her işletmenin L2–L5 görsel eklerinin listesi; iç mekân gereken işletmeler |
| **B6 (görevler/etkinlikler)** | Dünya etkinlikleri takvimi (§9.3), Müfettiş'in görünüşü, Hata Bildirimi teslim noktaları | Etkinlik ödülleri ve sezon görevleri (v1.1) |
| **B6 (sosyal)** | Oda izin modları, ziyaretçi defteri/ayak izi, Podyum, Alkış noktaları, isim etiketi renkleri, Lonca Binası yerleşimi | Moderasyon kapsamı (işletme adı, Tebeşir Tahtası, sokak adı), 15–17 güvenli mod kuralları, Arkadaşa git kısıtları |
| **B2 (ekonomi)** | Kasa sprite kademeleri, görsel trafik ile ekonomik trafiğin ayrımı, tabela özelleştirme fiyat kademeleri (150–600 B), eşya kataloğu fiyatları | Fiyatların KANON bantlarıyla son hâli; Pazar rotasyon takvimi |
| **B7 (teknik mimari)** | Instance/shard türleri ve kapasiteleri, shard seçim sırası, Redis konum/sayaç ihtiyacı, Usta diyalog durumunun sunucuda tutulması | SignalR oda modeli; shard birleştirme; konum kalıcılığı |
| **B8 (istemci/ekranlar)** | Koordinat formülleri, katman sırası, atlas bütçesi, zoom kademeleri, LOD kuralları, HUD kısayolları (M/H/A), Şehir Haritası'nın 2D illüstrasyon kararı | PixiJS sahne yöneticisi; React HUD yerleşimi; mobil dokunma kuralları; `prefers-reduced-motion` |
| **B9 (ürün)** | Sanat üretim takvimi (12 hafta), varlık listesi, kilitli semtlerin düşük detay kararı | MVP kapsam onayı; ikinci piksel sanatçısı bütçesi (5–8. hafta) |

---

**Revizyon Notu (3 Kasım).** KANON v2 (§12) uyumu: yaş eşiği 13 → 15 (5 yerde 13–17 → 15–17, ayrıca 13+ → 15+); eski belge numaralaması (B2–B12) 03-ajan-talimati §2'ye çevrildi; emote fiyatları (#11 Şapka Çıkar 120 B, #12 Tuşlama 60 B) ve Nadir oda eşyası (300 B) B2 §9'a çekildi; yürüme 4 komşulu (B7 §6.5); 15–17 Oda 'Herkese açık' hukuk teyidine kadar kapalı; §14 sabitleri KANON §12.3'te kabul edildi (LOD_FULL_MAX için B8 değerleri: masaüstü 24 / mobil 16 / düşük 8). Ayrıntı: `_KANON-v2-degisiklikler.md`.
