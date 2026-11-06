# B7 — Backend Mimari & Veri Modeli (KodKent)

| Alan | Değer |
|---|---|
| Belge id | **B7** |
| Sürüm | v1 (2026-11-02) |
| Rol | Baş yazılım mimarı (.NET, dağıtık sistemler, güvenlik) |
| Bağlayıcı kaynaklar | `KANON.md` v1 (özellikle §1 platform/teknoloji, §4 ekonomi, §5–§5.1 işletme ve Otopark, §6 ekranlar, §9 AI ve sandbox sabitleri), `00-fikir.md` (SABİT kararlar), `A-vizyon-FINAL.md` (§5, §8, §10, §13), `brief/03-ajan-talimati.md` |
| Okunan girdiler | `A-vizyon-urun.md` (teknoloji, mimari, maliyet, güvenlik), `B2-ilerleme-ekonomi.md` §8 ve §10, `B1-dunya-sehir.md` §1 ve §11; §11–§18 yazılırken ayrıca `B3` §11, `B6` §7, `B8` §6 ve §15, `B9` §4.3, §6 ve §8 |
| Kapsam | Mimari kararlar (ADR), modüller ve bağımlılık yönü, veri modeli ve DDL, REST API ve sözleşme kuralları, SignalR ve shard modeli, kuyruklar, sandbox altyapısı ve test koşucusu, işletme simülasyonu ve çift kayıtlı defter, AI servisi (üretim karşılığı), kimlik/OTP/KVKK/güvenlik, istemci–sunucu sözleşmesi, altyapı/DevOps/maliyet, monorepo ve sprintler, teknik artifact için 8 diyagramın içeriği |
| Bu belgenin sahibi olduğu şeyler | Servis/modül yapısı, veri modeli ve DDL, API uç noktaları, SignalR, kuyruklar, sandbox altyapısı, auth/KVKK, DevOps, monorepo (talimat §2). **Başkasına ait olanlar yeniden tanımlanmaz, atıfla bağlanır:** Kurul JSON şeması (B3), Challenge Spec (B5), görev/lig/moderasyon basamakları (B6), ekranlar (B8) |
| Kural | KANON'daki her sayı ve ad aynen kullanılır. KANON'da bulunmayan ve burada ilk kez önerilen her sayı metinde **(B7 önerisi)** etiketini taşır ve Ek A'da toplanır; onaylanana kadar KANON geçerlidir. |
| Doğrulama | Bu belgedeki şu parçalar gerçekten çalıştırılmış/derlenmiştir: sandbox test koşucusu (§8.5; .NET SDK 10.0.300, Roslyn `Microsoft.CodeAnalysis.CSharp` 5.9.0, Otopark L1 için 26 testin tamamı ve 9 kötüye kullanım senaryosu), işaretli (`// [derlenir]`) C# örnekleri (Npgsql 10.0.3, StackExchange.Redis 3.4.31, Anthropic 13.4.0, SignalR Redis 10.0.14) ve tüm `sql` blokları (PostgreSQL 18 ayrıştırıcısı `libpg-query` 18.2 ile sözdizimi). Ölçülen süreler geliştirme makinesindedir (gVisor yok); üretim hedefi değil, alt sınır kanıtıdır. |

**Terim notu.** *Tier* semt zorluk katmanıdır (T1–T4), işletmenin kendi kademesi *L1–L5*'tir (KANON §10; B2 terim notuyla aynı). *Hakem süreci* (Judge) test sonucuna karar veren güvenilir koddur, *oyuncu süreci* (Player) yalnızca oyuncunun derlenmiş yöntemini çağıran güvensiz koddur (§8). *İş günü* 04:00 TR'den ertesi gün 04:00 TR'ye uzanır (B2 §10.3 günlük sıfırlama saati); TR saati kalıcı UTC+3'tür, yaz saati yoktur. Platform kodunda tanımlayıcılar İngilizcedir; KANON'dan gelen alan sözcükleri (durum, ipucu kademesi, nadirlik, soru ve görev tipi) veri tabanında ve API'de **ASCII Türkçe küçük harf kodlarla** yazılır (`acik`, `kararmis`, `pusula`, `siradan`, `kavram`), çünkü bunlar ürünün ortak dilidir; ekrandaki Türkçe karşılıkları B8'dedir.

## İçindekiler

0. Yönetici özeti
1. Kısıtlar, hedefler ve kapasite varsayımları
2. Mimari kararlar (ADR)
3. Sistem görünümü ve modüller
4. Veri modeli
5. API
6. Gerçek zamanlı katman (SignalR)
7. Asenkron işler ve kuyruklar
8. Sandbox altyapısı
9. İşletme simülasyonu ve ekonomi defteri
10. Yapay zekâ servisi (B3'ün üretim karşılığı)
11. Kimlik, güvenlik ve KVKK
12. İstemci–sunucu sözleşmesi (B8 arayüzü)
13. Altyapı ve DevOps
14. Monorepo, standartlar, test ve sprintler
15. Teknik artifact diyagram içerikleri (8 diyagram)
16. Varsayımlar
17. Açık Sorular
18. Diğer Belgelere Bağımlılıklar
Ek A. Sabit Önerileri (KANON v2 adayları)

---

## 0. Yönetici özeti

KodKent'in backend'i **modüler monolit + ayrı sandbox bölgesi**dir: tek kod tabanı (14 modül + Platform, 15 PostgreSQL şeması), dört dağıtım birimi (`api`, `hub`, `worker` aynı imajdan; `sandbox-agent` ayrı imaj ve düğüm havuzu), Redis Streams kuyrukları, 151 uç nokta ve iki SignalR hub'ı. Üç karar yapıya gömülüdür: şema-başına-modül, çift kayıtlı defter, UUIDv7. Oyuncu kodu gVisor + Roslyn ile çalışır (ölçülen 265–461 ms; hedef p95 < 6 sn); AI yalnızca XP'ye dokunur, gelire asla (≈ 0,0033 $/puanlama). Kimlik telefon + OTP'dir; **Yaş Kapısı v2** 15 altı kaydı kapatır, 15–17'ye veli onaylı ayrıştırılmış hizmet verir (§11.5, B9 §8). Aylık maliyet 1k / 10k / 100k DAU için ≈ 2,5 k$ / 16,4 k$ / 147,7 k$; altyapı payı %30 / %9,5 / %2,7, gerisi AI (§13.6; B9 bütçesi B7 altyapı tahmininin ≈ 2 katı). İlk 6 sprint B9 kapılarıyla (G0–G4) hizalıdır (§14.7). Açık riskler: veri yerelliği ve e-Devlet yaş belirteci (hukuk, G0), AI birim ekonomisi (B9 §6.4), gVisor ek yükü (H2).

---

## 1. Kısıtlar, hedefler ve kapasite varsayımları

KodKent'in backend'i üç şeyi aynı anda yapmak zorundadır: (1) oyuncunun yazdığı gerçek C# kodunu güvenle derleyip çalıştırmak, (2) bu kodun ürettiği paranın tek kuruşunun bile yanlış hesaplanmamasını sağlamak, (3) 13 yaşındaki bir çocuğun verisini ve sohbetini koruyarak yüzlerce kişiyi aynı anda aynı şehirde tutmak. Ürün büyüklüğü ise küçük bir ekibin (5–6 kişi, VİZYON §13) 12 haftada çıkarabileceği düzeydedir. Bu yüzden her mimari karar iki süzgeçten geçmiştir: *güvenlik/tutarlılık* gerektiren yerde (sandbox, defter, kimlik) sağlam ve ayrı, *gerekmeyen* yerde (modül sınırları, dağıtım, kuyruk) olabilecek en yalın.

### 1.1 Bağlayıcı kısıtlar ve mimariye etkisi

| Kaynak | Kısıt | Mimariye etkisi |
|---|---|---|
| KANON §1 / 00-fikir | Backend .NET (ASP.NET Core) + PostgreSQL + Redis; sandbox aynı ekosistemde | Tek dil (C#) ekip için; platform ve sandbox harness'ı aynı Roslyn sürümünü paylaşır; PostgreSQL 18 ve Redis dışında zorunlu veri deposu yok |
| KANON §9 | Sandbox: gVisor (runsc), ağ yok, 256 MB / 2 vCPU / 10 sn duvar saati, salt okunur FS, Roslyn bellek içi derleme, 20 ısıtılmış container, Redis kuyruğu, p95 < 6 sn | §8'in tamamı; sandbox bölgesi yalnızca Redis ile konuşur |
| KANON §9 | `claude-sonnet-5-5` / `claude-haiku-5-5` / `claude-opus-5-5`; structured output; prompt caching; günde 30 AI etkileşimi, aşımda gece Batch | §10; kota sayacı Redis'te, taşan cevap veri tabanında bekler |
| KANON §9 / VİZYON §10 | AI test sonucuna karar vermez, gelire dokunmaz | Kod düzeyinde ayrım: `Learning` modülü `Economy`'yi ve `World`'ü referans edemez (§3.3); gelir yalnızca sandbox çıktısından hesaplanır |
| KANON §4 | Bayt satın alınamaz/transfer edilemez, giderler yok, Çip yalnızca kozmetik | Defterde oyuncudan oyuncuya işlem türü yoktur (§9.5); Çip → Bayt işlemi şemada imkânsız (para birimi çifti kısıtı) |
| KANON §4 / §5 | 10 TL = 1 B; kasa 8 saatlik üretim; Otopark L1 12 araç/gün; deneme modu %50; slot `1 + ⌊seviye/6⌋`, türden 1 | `world.businesses (owner_id, kind)` benzersiz; slot kontrolü komut işleyicisinde (§9.2); kasa tembel hesaplanır (§9.4) |
| KANON §6 Giriş | OTP 6 hane, 90 sn, 60 sn'de yeniden gönder, 5 deneme/saat | §11.1; sayaçlar Redis Lua ile atomik |
| KANON §1 | 15 altı kayıt yok; 15–17 veli onayı (SMS linki, 72 saat); onaya kadar serbest metin sohbet kapalı | §11.5 (Yaş Kapısı v2: 15 altı kayıt yok, 15–17 ayrıştırılmış hizmet; B9 §8); JWT'de `age_band` ve `par` talepleri; sohbet hub'ı yetki politikası |
| KANON §6 | 24 ekran + HUD | §12'de ekran başına veri ihtiyacı |
| VİZYON §13 | 12 hafta, 5–6 kişi; H2 sandbox 500 eşzamanlı, H3 AI maliyet/p95, H5 kırmızı takım, H6 10.000 bot simülasyonu | §14.7 sprintleri bu kapılara göre dizilmiştir |
| VİZYON varsayım 10 | Veri KVKK gereği Türkiye'de; Claude API'ye kişisel veri gitmez | §11.8 ve ADR-15: yorum ve risk açıkça yazılmıştır; AI'ya giden metinden kişisel veri ayıklanır |

### 1.2 Nitelik hedefleri

| Nitelik | Hedef | Nasıl sağlanır |
|---|---|---|
| Doğruluk (para) | Defter dengesi her işlemde 0; günlük mutabakat farkı 0 | Çift kayıt + ertelenmiş kısıt tetikleyicisi + gece denetimi (§9.6) |
| Güvenlik (sandbox) | Oyuncu kodu ana makineye, veri tabanına, başka oyuncunun koduna erişemez | gVisor + hakem/oyuncu süreç ayrımı + statik politika + sır taşımayan düğüm havuzu (§8) |
| Gecikme | Sandbox p95 < 6 sn (KANON); AI puanlama p95 < 4 sn (VİZYON); REST p95 < 300 ms (okuma) | Isıtılmış havuz, kuyruk önceliği, önbellek, bölümlü tablolar |
| Erişilebilirlik | API aylık %99,9 (≈ 43 dk/ay); sandbox ve AI kesintisinde oyun oynanır (ders/ipucu/sosyal sürer) | Bozulabilir bağımlılıklar kuyruk arkasında; AI kesintisinde cevap kaydedilip sonra puanlanır |
| Ölçek | 1k / 10k / 100k DAU yatay ölçeklenir | Durumsuz API, shard'a sabit hub, kuyruk tüketicileri, KEDA (§13) |
| Gözlemlenebilirlik | Her istekte `traceId`; her işletme gün sonucu, her Bayt hareketi izlenebilir | OpenTelemetry, yapılandırılmış günlük, defter hash özeti |
| Maliyet | AI ≤ 0,08 $/DAU/gün alarm (KANON); altyapı toplamın %20'sinden az | §13.6 maliyet tabloları (altyapı hedefi ≈ 2.500 DAU'dan sonra, Varsayım 9) |
| Gizlilik | Kişisel veri alan düzeyinde şifreli; AI'ya kişisel veri gitmez | §11 |

### 1.3 Kapasite varsayımları (planlama temeli)

Tüm bölümler aşağıdaki üç ölçeği kullanır. Oranlar VİZYON varsayımlarından (kayıtlıların %30'u günlük aktif; DAU başına günde 8 sandbox çalıştırması; ortalama 12 AI etkileşimi) ve **(B7 önerisi)** kalan değerlerden türetilmiştir; H6/H10 ölçümleriyle güncellenir.

| Büyüklük | 1k DAU | 10k DAU | 100k DAU | Türetme |
|---|---|---|---|---|
| Kayıtlı oyuncu | 3.333 | 33.333 | 333.333 | DAU ÷ 0,30 |
| Eşzamanlı bağlantı (tepe) | 120 | 1.200 | 12.000 | DAU × %12 **(B7 önerisi)** |
| REST istek/gün | 300 k | 3 M | 30 M | DAU × 300 **(B7 önerisi)** |
| REST tepe istek/sn | 21 | 210 | 2.100 | ortalama × 6 |
| Sandbox etkileşimli çalıştırma/gün | 8 k | 80 k | 800 k | DAU × 8 (VİZYON) |
| Sandbox tepe çalıştırma/sn (saatlik pay %15) | 0,33 | 3,3 | 33 | gün × 0,15 ÷ 3600 |
| Gece işletme işi (Açık/Deneme) | 800 | 8.000 | 80.000 | DAU × 0,8 **(B7 önerisi)** |
| AI puanlanan etkileşim/gün | 12 k | 120 k | 1,2 M | DAU × 12 (KANON §9 ortalama) |
| Defter işlemi/gün (satır ≈ 2,2 × işlem) | 10 k (22 k) | 100 k (220 k) | 1 M (2,2 M) | DAU × 10 **(B7 önerisi)** |
| Sohbet mesajı/gün (90 gün saklama) | 20 k (1,8 M satır) | 200 k (18 M) | 2 M (180 M) | DAU × 20 **(B7 önerisi)** |
| Aktif shard (ortalama doluluk 30) | 4 | 40 | 400 | CCU ÷ 30 |
| Veri tabanı boyutu (ilk yıl, saklama kurallarıyla) | ≈ 20 GB | ≈ 200 GB | ≈ 2 TB | §4.1 bölümleme + §11.7 saklama |

Kapasite tablosundan üç sonuç çıkar. Birincisi, **REST yükü küçüktür**: 100k DAU'da bile tepe 2.100 istek/sn, birkaç yüz mikro-hizmet değil, birkaç düzine API pod'uyla karşılanır; mimariyi belirleyen şey istek hacmi değil *tutarlılık ve güvenlik* gereksinimleridir. İkincisi, **sandbox ve AI birim maliyeti belirleyicidir**: 100k DAU'da saniyede 33 sandbox çalıştırması ve 14 AI puanlaması ortalamadır; ikisi de kuyruk arkasında, ayrı ölçeklenen havuzlardadır. Üçüncüsü, **veri büyümesinin asıl kaynağı defter ve sohbettir**; bu iki tablo baştan aylık bölümlenir ve saklama süresiyle kırpılır (§4.1).

### 1.4 On mimari ilke

1. **Testler hakem, Kurul puanlayıcı, AI gelire dokunmaz.** Gelir hesabına AI kodu hiçbir yoldan ulaşamaz: `Learning` modülü `Economy`/`World` derlemelerini referans edemez; yalnızca olay yayınlar (§3.3).
2. **Sunucu otoriterdir.** İstemci niyet bildirir (`MoveTo`, satın al, topla); sonucu sunucu hesaplar ve doğrular. İyimser arayüzün sınırı §12.4'tedir.
3. **Para yalnızca defterden akar.** Bayt/Çip bakiyesini değiştiren tek yol çift kayıtlı `ledger_transactions` + `ledger_entries` yazımıdır; başka hiçbir tablo bakiye taşımaz (kasa tembel hesaplanan bir *alacak*tır, bakiye değildir).
4. **Her yazma idempotenttir.** HTTP düzeyinde `Idempotency-Key`, defter düzeyinde doğal anahtar (`qr:{oyuncu}:{görev}`), kuyruk düzeyinde `inbox` tablosu. "Tekrar 0 XP/Bayt" kuralı (KANON §3) bir iş kuralı değil, veritabanı değişmezidir.
5. **Modül sınırı derleyici ve veri tabanı rolüyle zorlanır.** Başka modülün tablosuna SQL ile erişim, başka modülün iç derlemesine proje referansı yoktur (§3.3).
6. **Sandbox bölgesi sır taşımaz.** Sandbox düğümlerinde veri tabanı parolası, API anahtarı, JWT anahtarı yoktur; yalnızca kısıtlı Redis kullanıcısı vardır.
7. **Pahalı iş asenkrondur.** 300 ms'yi aşabilecek her şey (derleme, AI, gece hesabı, bildirim) kuyruktan geçer; istemci 202 + `jobId` alır, sonuç hub'dan itilir, yoklama yedek yoldur.
8. **Her durum geçişi olay üretir.** `Outbox` aynı işlemde yazılır; Analitik, Bildirim, Başarım gibi tüketiciler ana akışı bloklamaz.
9. **Kişisel veri AI'ya gitmez.** Giden metin önce kişisel veri ayıklayıcıdan geçer (§10.7); AI kaydı oyuncu kimliğiyle değil `answer_hash` ve takma `player_id` ile tutulur.
10. **Maliyet görünürdür.** Her AI çağrısı, her sandbox çalıştırması, her SMS birim maliyetiyle kaydedilir; $/DAU/gün panoda ve alarmdadır (KANON §9).

---

## 2. Mimari kararlar (ADR)

Her karar aynı kalıpla yazılmıştır: *karar*, değerlendirilen *seçenekler*, *gerekçe*, *sonuç ve bedel*, ve **elenen seçeneğin neden elendiği**. Sayılar §1.3 kapasite temelinden ve §8/§13'teki ölçümlerden gelir; "ölçüldü" denen yerler geliştirme makinesi ölçümüdür.

| # | Karar | Değerlendirilen seçenekler | Gerekçe | Sonuç / bedel | Elenen seçenek ve nedeni |
|---|---|---|---|---|---|
| ADR-01 | **Modüler monolit + ayrı sandbox bölgesi.** Tek kod tabanı; aynı imaj `api`, `hub`, `worker` rolleriyle çalışır; `sandbox-agent` ayrı imaj ve ayrı düğüm havuzu | (a) 12+ mikro-hizmet, (b) modüler monolit + ayrı sandbox, (c) tek süreç, (d) serverless | 5–6 kişilik ekip; ödül + XP + olay tek ACID işlemde kapanmalı; sandbox ise güvenlik ve kaynak izolasyonu için fiziksel olarak ayrı olmalı | 4 dağıtım birimi; hızlı sürüm; modül sınırı disiplini NetArchTest ile korunur (§3.3) | **Mikro-hizmet:** ekonomide dağıtık işlem (saga) ve ağ hataları yeni hata sınıfı yaratır, 12 hizmeti 5 kişi işletemez. **Tek süreç:** sandbox için güvenlik sınırı kalmaz. **Serverless:** gVisor ve durumlu WebSocket uyumsuz, soğuk başlangıç p95'i bozar |
| ADR-02 | **gVisor (`runsc`, platform `systrap`)**, containerd runtime `io.containerd.runsc.v1`, ağ yok | runc + seccomp/AppArmor; gVisor; Firecracker/Kata microVM; Wasm (WASI); üçüncü taraf (Judge0, Piston, dinamik oturum hizmetleri) | KANON §9 sabiti; kullanıcı alanında çekirdek (Sentry) host çekirdeğine yalnızca küçük bir sistem çağrısı alt kümesi açar; `systrap` KVM/iç içe sanallaştırma istemez → Hetzner Cloud VM'lerinde çalışır; OCI uyumlu | G/Ç ve `fork` ağırlıklı işlerde %10–20 yavaşlama beklenir (VİZYON varsayımı ≤ %20); oyuncu süreci iş başına bir kez başlatılır; H2'de ölçülür | **runc + seccomp:** paylaşılan çekirdekte tek çekirdek açığı tüm düğümü verir. **Firecracker/Kata:** daha güçlü izolasyon ama KVM gerekir (Hetzner Cloud'da yok), ısıtma/işletme maliyeti yüksek; risk artarsa Faz 2 yükseltme yolu. **Wasm:** .NET'in WASI desteği olgun değil ve "Visual Studio'da aynen derlenir" vaadini (VİZYON aha #3) bozar. **Üçüncü taraf:** kod ve gizli testler dışarı çıkar, çağrı başı ücret, politika özelleştirilemez |
| ADR-03 | **Roslyn bellek içi derleme + özel test koşucusu**; hakem/oyuncu iki süreç | `dotnet build` + `dotnet test`; `CSharpScript`; Roslyn `CSharpCompilation` + özel koşucu | Ölçüldü: ısıtılmış hakemde derleme 39–169 ms, 26 test dâhil toplam 265–461 ms (§8.5); dotnet CLI tipik 5–15 sn ve diske yazar; betik lehçesi (üst düzey ifade, `#r`) "Visual Studio'da aynen derlenir" vaadini bozar | Referanslar izin listesiyle sınırlı; Roslyn sürümü PE ile birlikte saklanır (§8.6); çok dosyalı Lonca Projesi (v2) için ayrı yol gerekir | **dotnet CLI:** gecikme, disk yazımı, NuGet erişimi (ağ yok kuralıyla çelişir). **Betik:** dil farkı. |
| ADR-04 | **SignalR (yalnızca WebSockets) + Redis backplane + shard sabitleme.** Sahne başına bağlantı; ingress shard'a göre tutarlı karma ile pod seçer; backplane yalnızca pod'lar arası kullanıcı olayları için | Ham WebSocket; Node + Socket.IO; SignalR; Photon/Nakama/Colyseus; Azure SignalR Service | Ekip C# bilir; kimlik/yetki entegrasyonu, gruplar, yeniden bağlanma hazır; Redis zaten var; hareket tıkla-yürü olduğundan 5 Hz toplu delta yeterli (60 Hz fizik yok) | Pod başına ≈ 2.500 bağlantı bütçesi (§6.7); shard durumu pod belleğinde + Redis anlık görüntüsü; pod ölümünde shard ≤ 2 sn'de yeniden kurulur | **Ham WS:** yeniden bağlanma, grup, ölçekleme yeniden icat edilir. **Node:** ikinci çalışma zamanı, kimlik ve durum paylaşımı. **Photon/Nakama:** bulut/lisans bağımlılığı, veri yerelliği, ihtiyaç olmayan fizik/eşleştirme. **Azure SignalR Service:** birim başı ücret ve veri yerelliği; 100k DAU'da yeniden değerlendirilir |
| ADR-05 | **Çift kayıtlı defter** (PostgreSQL). `ledger_transactions` + `ledger_entries`; her para biriminde işlem toplamı 0; önbellekli `wallets.balance` | Tek `balance` kolonu + UPDATE; olay kaynaklı; harici defter (TigerBeetle); çift kayıt | Mutabakat ve denetim; faucet/sink ayrımı ekonomi panosunun (B2 §10.5) doğrudan verisi; doğal idempotency anahtarı "tekrar 0" değişmezini sağlar | Her bakiye değişikliği ≥ 2 satır (yazma 2–3×); 100k DAU'da 2,2 M satır/gün → aylık bölümleme | **Tek kolon:** denetlenemez, yarışta sessizce bozulur. **Olay kaynaklı:** tüm okuma modelleri için yeniden oynatma karmaşıklığı. **TigerBeetle:** yeni altyapı ve operasyon; 100k DAU sonrasında yeniden bakılır |
| ADR-06 | **OTP sağlayıcı: Netgsm birincil, İleti Merkezi otomatik yedek** (devre kesici), `ISmsProvider` soyutlaması | Netgsm, İleti Merkezi, Twilio Verify, Firebase/Auth0 telefon girişi, WhatsApp/sesli arama | Türkiye operatörlerine doğrudan rota; ≈ 0,25 TL/SMS (VİZYON varsayımı) ve Türkiye'de veri; Twilio ≈ 20× pahalı (§11.2 tablo) | İki sözleşme ve iki gönderici başlığı; teslim oranı sağlayıcı bazında izlenir; adaptör maliyeti küçük | **Twilio Verify:** başarılı doğrulama başına ≈ 5 TL, veri ABD'de, Türkiye rotası değişken. **Firebase/Auth0:** SMS başına yüksek ücret, yönlendirme ve dolandırıcılık kontrolü bizde değil |
| ADR-07 | **Structured output:** `output_config.format = json_schema` (Kurul şeması B3'ün) + sunucuda şema/aralık doğrulaması + 1 yeniden deneme | Serbest metin + regex; şemasız "JSON ver" istemi; zorunlu araç çağrısı (`tool_choice: tool`); yerel structured output | `claude-sonnet-5-5` / `claude-opus-5-5` ailesinde zorlanmış `tool_choice` 400 döner (Claude API rehberi); şema kısıtlı çıktı geçersiz JSON oranını sıfıra yaklaştırır | Şema değişikliği = prompt sürümü (`learning.prompt_versions`); şema özellikleri (özyineleme yok) sınırlıdır | **Serbest metin/regex:** kırılgan. **Zorlanmış araç çağrısı:** bu modellerde reddedilir |
| ADR-08 | **Prompt caching:** sabit önek (persona + rubrik + şema yönergesi + örnekler) için açık `cache_control` kesme noktası, 5 dk TTL; gece Batch için 1 saat TTL; ek olarak uygulama düzeyi `answer_hash` önbelleği | Önbelleksiz; yalnızca otomatik; açık kesme noktası; 1 saat TTL; yalnızca uygulama önbelleği | Önek ≈ 2.500 token; okuma 0,20 $/MTok, giriş 2 $/MTok; sürekli trafikte 5 dk TTL kendini tazeler; yazma 1,25× | KANON maliyet hedefi (0,0033 $/puanlama) buna dayanır; `cache_read_input_tokens = 0` alarmdır; prompt sürüm yayını önbelleği düşürür → planlı yapılır | **Önbelleksiz:** giriş maliyeti ≈ 5×. **Etkileşimde 1 saat TTL:** yazma 2×, trafik zaten sürekli olduğu için kazanç yok |
| ADR-09 | **PWA** (service worker, Web Push, manifest); mobil sarmalayıcı sonraki sürüm | Yerel uygulama (Unity/Flutter); Capacitor sarmalayıcı; PWA | KANON platform sabiti; mağaza komisyonu Çip gelirine vurur; tek kod tabanı; "mobilde okunur, masaüstünde yazılır" | iOS'ta Web Push yalnızca ana ekrana eklenmiş PWA'da çalışır (16.4+) → onboarding'de "ana ekrana ekle" (VİZYON §4); arka plan görevleri sınırlı | **Yerel uygulama:** mağaza incelemesi + komisyon, 12 haftaya sığmaz |
| ADR-10 | **PixiJS** izometrik sahne + React HUD (ayrıntı B8) | Unity WebGL, Godot HTML5, Phaser, Three.js, PixiJS | Backend etkisi: statik varlık + CDN; sunucuda render yok; sahne `walkable` bitset'i istemci ve sunucuda aynı dosyadan (§6.4) | Sahne sürümü hash'i iki taraflı uyumu denetler | **Unity WebGL:** 20–40 MB açılış, mobil bellek. **Godot web:** COOP/COEP başlık zorunluluğu. **Phaser:** gereksiz çerçeve |
| ADR-11 | **PostgreSQL şema stratejisi:** tek PostgreSQL 18 kümesi ve veritabanı; modül başına şema, DbContext ve veritabanı rolü; şemalar arası FK yalnızca `player.players(id)` hedefine | Modül başına veritabanı; tek `public` şeması; şema-başına-modül | Birden çok modül tek işlemde yazılabilir (ödül + XP + olay) ama sınırlar rolle zorlanır; modül ayrılırsa şema taşınır | Bölümlü tablolara FK verilmez (§4.1); raporlama `analytics` salt okunur görünümlerle | **Modül başına DB:** dağıtık işlem. **Tek şema:** sınır yok, her modül her tabloya dokunur |
| ADR-12 | **Kuyruk: Redis Streams** (tüketici grupları) + PostgreSQL outbox; zamanlama için hafif cron servisi (PG advisory lock ile lider seçimi) | Redis Streams; Hangfire (PG/Redis); RabbitMQ; Kafka; PG `SKIP LOCKED` tablosu | KANON "Redis kuyruğu"; sandbox bölgesi yalnızca Redis'le konuşur; gecikme < 5 ms; `XAUTOCLAIM` ile çöken tüketici toparlanır; öncelik ayrı akışlarla | Gecikmeli yeniden deneme ZSET + taşıyıcı ile; AOF `everysec` → olası kayıp ≤ 1 sn ama iş kaynağı veri tabanında (outbox) olduğu için yeniden üretilir | **RabbitMQ/Kafka:** ikinci altyapı ve operasyon, MVP'de ihtiyaç yok. **Hangfire:** iş başına veri tabanı turu; sandbox bölgesinin DB erişimi gerekir. **PG SKIP LOCKED:** sandbox'ın sır taşımama ilkesine aykırı |
| ADR-13 | **Kimlik belirteçleri:** ES256 imzalı 15 dk JWT + HttpOnly çerezde 30 gün kayan, döndürülen opak yenileme belirteci | Sunucu oturumu; uzun ömürlü JWT; Keycloak/Auth0/Firebase | REST/hub için durumsuz doğrulama; yeniden kullanım algılama ile çalıntı belirteç tespiti; SMS yönlendirmesi ve dolandırıcılık denetimi bizde | `kid` ile anahtar rotasyonu; iptal gecikmesi ≤ 15 dk (kritik eylemde `sid` Redis'ten doğrulanır) | **Uzun JWT:** iptal edilemez. **Hazır IdP:** SMS başına ücret, yönlendirme kontrolü yok |
| ADR-14 | **Olay mekanizması:** transactional outbox → röle → idempotent tüketici (inbox) | Doğrudan çağrı; yalnızca süreç içi bildirim; çift yazma (DB + kuyruk) | Ödül + XP + metrik aynı işlemde "söz verilir", çöküşte kaybolmaz | Olaylar "en az bir kez"; tüketici idempotent olmak zorunda; röle gecikmesi ≈ 50 ms | **Çift yazma:** DB başarılı/kuyruk başarısız tutarsızlığı. **Süreç içi:** çökmede olay kaybı |
| ADR-15 | **Barındırma: Hetzner Cloud (Falkenstein) + k3s + CloudNativePG**; sandbox işçileri aynı sağlayıcıda ayrı, kirletilmiş (taint) düğüm havuzu; Faz 2: Türkiye içi sağlayıcı seçeneği | Hetzner; Azure (AKS); Türkiye içi bulut | §13.6: Hetzner 5–6× ucuz; AKS'de gVisor desteklenmez (Kata "Pod Sandboxing" var); k3s'de runtime serbest; IaC (OpenTofu) ile küçük ekip yönetir | PostgreSQL ve Redis kendi işletmemizde: yedek/DR bizde (§13.5); yurt dışı aktarım için KVKK m.9 güvenceleri gerekir (Açık Soru 1) | **Azure:** maliyet ve gVisor yok. **TR-içi bulut:** fiyat/kapasite belirsiz; hukuk zorunlu kılarsa taşıma runbook'u hazır tutulur |
| ADR-16 | **Gözlemlenebilirlik:** OpenTelemetry → Prometheus + Loki + Tempo + Grafana (kendi işletmemiz) + Sentry | Datadog/New Relic; Azure Monitor; Grafana stack | Maliyet; yönetilen SaaS'ta günlük/iz hacmi ücreti; kişisel veri günlüklerde maskelenir | Depolama ve alarm kuralları bizde | **Datadog:** 100k DAU'da aylık binlerce dolar |
| ADR-17 | **API stili:** REST (OpenAPI 3.1) + SignalR | GraphQL; gRPC-web; tRPC; REST | Önbellek/CDN, hız sınırı, idempotency ve gözlem uç nokta düzeyinde; B8 tipleri OpenAPI'den üretir | Ekran başına birden çok paralel istek; `GET /v1/players/me` ve hub olaylarıyla azaltılır | **GraphQL:** N+1, önbellek ve yetki karmaşıklığı. **gRPC-web:** tarayıcı araçları zayıf |
| ADR-18 | **Kimlik üretimi:** UUIDv7 (PostgreSQL 18 `uuidv7()`, uygulamada `Guid.CreateVersion7()`); içerik için metin slug'ları | bigserial; UUIDv4; ULID; UUIDv7 | Zaman sıralı → B-ağacı yerleşimi iyi; sıra numarası sızmaz; uygulamada üretilebilir | 16 bayt anahtar; kimlikten oluşturma zamanı okunabilir (gizlilik etkisi ihmal edilebilir) | **bigserial:** sıra sızıntısı, bölümleme/birleştirme zorluğu. **UUIDv4:** indeks dağılımı kötü |

### 2.1 Kararların geri dönüş maliyeti

Kararların hepsi aynı ağırlıkta değildir. Üçü *yapıya* gömülüdür ve sonradan değiştirmek yıllık işe dönüşür: **şema-başına-modül** (ADR-11), **çift kayıtlı defter** (ADR-05) ve **UUIDv7 anahtarlar** (ADR-18). Bu üçü ilk sprintte kesinleştirilir ve tartışmaya kapatılır. Altısı *değiştirilebilir* karardır: kuyruk teknolojisi (ADR-12), barındırma (ADR-15), gözlem yığını (ADR-16), SMS sağlayıcı (ADR-06, adaptör arkasında), PixiJS (ADR-10, B8) ve gVisor (ADR-02, OCI arayüzü arkasında Kata/Firecracker'a geçiş mümkün). Geri kalanlar (SignalR, JWT, outbox) ürünle birlikte evrilir.

Her karar için "yeniden bak" tetikleyicisi önceden yazılmıştır; böylece karar, ısrar yüzünden değil veriye bağlı olarak değişir:

| Tetikleyici | Etkilenen ADR | Eylem |
|---|---|---|
| Sandbox p95 > 6 sn, üç gün üst üste, havuz büyütmeye rağmen | ADR-02, ADR-03 | gVisor ek yükü profili çıkarılır; sıcak çocuk süreç havuzu; en kötü durumda runc + sıkı seccomp + Kata karşılaştırması |
| Başarılı sandbox kaçışı ya da gVisor CVE'si | ADR-02 | Sandbox havuzu durdurulur (kuyruk birikir, oyun sürer), Firecracker/Kata yolu devreye alınır |
| CCU > 25.000 ya da pod başına bağlantı bütçesi aşımı | ADR-04 | Azure SignalR Service / bölgesel hub kümeleri değerlendirilir |
| Defter > 1 milyar satır ya da yazma p99 > 50 ms | ADR-05 | Aylık bölümlerin soğuk depolamaya taşınması; TigerBeetle değerlendirmesi |
| Hukuk "veri Türkiye'de" ister | ADR-15 | TR-içi sağlayıcıya taşıma runbook'u (§13.5) |
| Aylık AI gideri > bütçe üst sınırı (B9) | ADR-07, ADR-08 | Batch payı artırılır, `answer_hash` önbelleği genişletilir, B3 ile prompt kısaltma |
| Netgsm teslim oranı < %93 (15 dk pencere) | ADR-06 | Otomatik İleti Merkezi'ne geçiş (devre kesici), sözleşme görüşmesi |

---

## 3. Sistem görünümü ve modüller

### 3.1 Dağıtım birimleri

Mantıksal olarak 14 modül ve bir ortak çekirdek (Platform) vardır; fiziksel olarak dört dağıtım birimi çalışır. Modüller ayrı hizmet değil, ayrı derlemedir; hangi pod'un hangi rolü üstleneceği ortam değişkeniyle seçilir (`KODKENT_ROLE=api|hub|worker`). Sandbox ajanı ise ayrı imaj, ayrı depo klasörü, ayrı düğüm havuzu ve ayrı güven bölgesidir.

| Birim | İmaj | Rol | Ölçekleme | Güven bölgesi | Sır |
|---|---|---|---|---|---|
| `api` | `kodkent-app` | REST (`/v1`), kimlik doğrulama, komutlar, 202 + iş kuyruğa alma | HPA: CPU %60 / tepe istek | Uygulama | DB, Redis, JWT özel anahtarı, SMS/PSP/Anthropic anahtarları |
| `hub` | `kodkent-app` | SignalR `/hubs/world`, `/hubs/chat`; shard aktörleri | Bağlantı sayısı (pod başına ≈ 2.500) | Uygulama | DB (salt okuma + sınırlı yazma), Redis |
| `worker` | `kodkent-app` | Kuyruk tüketicileri: `ai-grade`, `income-tick`, `notification`, `moderation`, `code-run-results`; outbox rölesi; cron | KEDA: kuyruk gecikmesi | Uygulama | DB, Redis, Anthropic anahtarı, Web Push (VAPID) anahtarı |
| `sandbox-agent` | `kodkent-sandbox-agent` | `code-run` tüketici, ısıtılmış sandbox havuzu yönetimi, sonuç yayını | KEDA: `code-run` gecikmesi; düğüm başına 1 ajan | **Sandbox** | **Yalnızca Redis kullanıcısı** (`code-run*` akışlarına ACL) |
| `sandbox` (hakem + oyuncu) | `kodkent-sandbox` | Tek kullanımlık/kısa ömürlü gVisor container: Roslyn derleme, test koşucusu | Düğüm başına 8–10 ısıtılmış | **Sandbox (güvensiz)** | Yok |
| Veri | CloudNativePG, Redis, S3 uyumlu depo | PostgreSQL 18 (1 birincil + 2 yedek), Redis (Sentinel), nesne depolama | Dikey + okuma kopyaları | Veri | — |
| Kenar | Cloudflare + ingress-nginx | WAF, CDN, TLS, DDoS, Turnstile | — | Kenar | — |

```text
  İstemci (PWA: React + PixiJS)                              Dış hizmetler
        │ HTTPS / WSS                                        ┌───────────────┐
        ▼                                                    │ Anthropic API │◄─────────┐
  Cloudflare (WAF, CDN, Turnstile) ─► ingress-nginx          │ Netgsm / İM   │◄──────┐  │
                                       │        │            │ iyzico (PSP)  │◄───┐  │  │
                              REST ────┘        └──── WSS    └───────────────┘    │  │  │
                               ▼                    ▼                              │  │  │
                            [ api ]              [ hub ]  ◄── Redis backplane ──┐  │  │  │
                               │  ▲                 │                           │  │  │  │
                               │  └──── outbox ─────┘                           │  │  │  │
                               ▼                                                │  │  │  │
                   PostgreSQL 18 (14 şema)  ◄──────  [ worker ] ────────────────┴──┴──┴──┘
                               ▲                         │  ▲
                               │                Redis Streams (code-run, ai-grade, income-tick,
                               │                notification, moderation, sonuç akışları)
                               │                         │  ▲
                               │                         ▼  │   yalnızca Redis ACL
                               └─────────────────  [ sandbox-agent ] ──► gVisor: hakem ─► oyuncu
                                                    (SANDBOX BÖLGESİ: DB yok, sır yok, ağ yok)
```

### 3.2 Modül kartları

Her kart beş şeyi söyler: sorumluluk, sahip olunan tablolar (şema), yayınlanan olaylar, tüketilen olaylar ve dış bağımlılık. Tablo adları §4.2 kataloğundadır. Olay adları `<Fiil>Geçmiş` biçimindedir, sürüm son eki taşır (`…v1`), yük şeması `Contracts` derlemesindedir ve geriye dönük uyumlu evrilir.

**Auth/OTP — `identity`**
- *Sorumluluk:* telefon doğrulama (OTP), JWT/yenileme belirteci, cihaz bağlama, veli onayı, KVKK rıza kayıtları, indirme/silme talepleri, SMS gönderimi ve dolandırıcılık denetimi.
- *Tablolar:* `phone_identities`, `otp_challenges`, `refresh_tokens`, `devices`, `guardian_consents`, `consent_records`, `privacy_requests`, `sms_log`.
- *Yayınlar:* `PlayerRegisteredv1`, `GuardianConsentGrantedv1` / `…Declinedv1` / `…Expiredv1`, `SessionRevokedv1`, `ErasureRequestedv1`, `ErasureCompletedv1`.
- *Tüketir:* —
- *Dış bağımlılık:* Netgsm, İleti Merkezi, Cloudflare Turnstile.

**Oyuncu/Profil — `player`**
- *Sorumluluk:* oyuncu kaydı (takma ad, doğum yılı, durum), avatar, gizlilik ayarları, dil bekleme listesi.
- *Tablolar:* `players`, `avatars`, `profile_settings`, `language_waitlist`.
- *Yayınlar:* `HandleChangedv1`, `AvatarChangedv1`, `PlayerSuspendedv1`.
- *Tüketir:* `PlayerRegisteredv1` (oyuncu satırı kimlikle birlikte oluşur), `ErasureRequestedv1`.
- *Dış bağımlılık:* — (takma ad denetimi `Platform.Text` içindeki sözlükle, Haiku incelemesi Moderasyon kuyruğuyla).

**İlerleme — `progress`**
- *Sorumluluk:* XP defteri, seviye ve unvan hesabı (KANON §3.2 formülü), Metro Haritası durakları (gri → sarı → yeşil → altın), Günlük Tekrar kuyruğu (1-3-7-21), seri ve dondurma, semt kapıları.
- *Tablolar:* `player_progress`, `xp_events`, `metro_stops`, `review_queue`, `streaks`, `district_gates`.
- *Yayınlar:* `XpGrantedv1`, `LevelUpv1`, `TitlePromotedv1`, `DistrictUnlockedv1`, `StopTurnedGoldv1`, `StreakChangedv1`.
- *Tüketir:* `LessonSealedv1`, `QuestionGradedv1` (Günlük Tekrar kuyruğunu besler), `ReviewCompletedv1` (kendi komutundan).
- *Dış bağımlılık:* —

**Eğitim (ders, Kurul/AI) — `learning`**
- *Sorumluluk:* ders ve soru yayın anlık görüntüleri, ders oturumu, deterministik soru değerlendirme, Kurul hattı (Haiku → Sonnet → Opus), kota, Batch, itiraz, altın küme, istem sürümleri, AI maliyet kaydı.
- *Tablolar:* `lessons`, `questions`, `lesson_attempts`, `question_attempts`, `grading_submissions`, `grading_appeals`, `golden_set`, `prompt_versions`, `ai_usage_daily`.
- *Yayınlar:* `LessonStartedv1`, `QuestionGradedv1`, `LessonSealedv1`, `RemediationUnlockedv1`, `AppealResolvedv1`.
- *Tüketir:* `ContentPublishedv1` (ders/soru/istem), `DefenseAnswerSubmittedv1` (Savunma cevabı Kurul hattından geçer).
- *Dış bağımlılık:* Anthropic API (Claude).

**Challenge — `challenge`**
- *Sorumluluk:* Challenge Spec (B5) yayın anlık görüntüsü, kod gönderimi, sandbox işlerinin oluşturulması ve sonuç işlenmesi, tohumlu test üretimi, Savunma oturumu, Hata Bildirimi görevleri, kopya şüphesi (AST benzerliği), sandbox çalıştırma kayıtları.
- *Tablolar:* `challenges`, `submissions`, `submission_test_results`, `ast_fingerprints`, `defense_sessions`, `bug_reports`, `sandbox_runs`.
- *Yayınlar:* `SubmissionAcceptedv1`, `SubmissionEvaluatedv1`, `DefenseAnswerSubmittedv1`, `DefensePassedv1`, `DefenseFailedv1`, `BugReportSolvedv1`, `CopySuspectedv1`.
- *Tüketir:* `ContentPublishedv1` (challenge sürümü), `QuestionGradedv1` (bağlam `savunma`: Kurul'un Savunma cevabına verdiği puan; ≥ 70 → `DefensePassedv1`).
- *Dış bağımlılık:* `sandbox-agent` (yalnızca Redis üzerinden).

**Ekonomi — `economy`**
- *Sorumluluk:* cüzdanlar (Bayt, Çip), çift kayıtlı defter, idempotent işlem yazımı, günlük mutabakat ve özet, ekonomi panosu metrikleri, Çip siparişleri ve PSP webhook'u, yönetici düzeltmeleri (dört göz).
- *Tablolar:* `wallets`, `ledger_transactions`, `ledger_entries`, `ledger_daily_digests`, `daily_economy_stats`, `payment_orders`, `admin_adjustments`.
- *Yayınlar:* `LedgerPostedv1` (tür, para birimi, tutar, kaynak etiketi — B2 §15 `BaytKazanildi`/`BaytHarcandi` buradan türetilir), `ChipPurchasedv1`.
- *Tüketir:* `ErasureCompletedv1` (cüzdanı yazılan hesap).
- *Dış bağımlılık:* iyzico (PSP).

**Dünya (şehir, shard, işletmeler) — `world`**
- *Sorumluluk:* semt/sokak/parsel, işletme yaşam döngüsü (Tapu → Kapalı → Deneme/Açık/Kararmış), günlük simülasyon ve kasa, Ruhsat, Oda ve eşya yerleşimi, ziyaret ve Alkış, shard kayıt defteri, LED pano akışı, SignalR hub'ları.
- *Tablolar:* `districts`, `streets`, `parcels`, `businesses`, `business_vaults`, `business_runs`, `vault_collections`, `licences`, `rooms`, `room_items`, `visits`.
- *Yayınlar:* `LicenceGrantedv1`, `BusinessPurchasedv1`, `BusinessOpenedv1`, `BusinessStatusChangedv1`, `BusinessRunComputedv1`, `VaultCollectedv1`, `VaultFullv1`, `RoomLayoutSavedv1`, `ApplauseGivenv1`.
- *Tüketir:* `QuestCompletedv1` (Ruhsat), `SubmissionEvaluatedv1`, `DefensePassedv1`/`DefenseFailedv1` (durum geçişi), `LevelUpv1` (slot sayısı).
- *Dış bağımlılık:* — (sandbox işi `Challenge` arayüzü üzerinden).

**Sosyal — `social`**
- *Sorumluluk:* arkadaşlık, davet kodu, sohbet (sahne/oda/DM) ve şikâyet, engelleme, haftalık lig ve liderlik tabloları.
- *Tablolar:* `friendships`, `friend_requests`, `invites`, `chat_messages`, `chat_reports`, `blocks`, `league_members`, `leaderboard_snapshots`.
- *Yayınlar:* `FriendshipCreatedv1`, `ChatMessageFlaggedv1`, `ChatReportedv1`, `LeagueClosedv1`.
- *Tüketir:* `XpGrantedv1` (haftalık XP), `StopTurnedGoldv1` (Kalıcılık Ligi), `SubmissionEvaluatedv1` (En Hızlı Otopark), `PlayerMutedv1`.
- *Dış bağımlılık:* —

**Pazar/Envanter — `market`**
- *Sorumluluk:* eşya kataloğu, haftalık rotasyon ve numaralı seri, satın alma (Bayt/Çip), envanter ve giyilen kombinasyon.
- *Tablolar:* `items`, `shelf_rotations`, `purchases`, `inventory_items`.
- *Yayınlar:* `ItemPurchasedv1`, `ItemEquippedv1`.
- *Tüketir:* `ContentPublishedv1` (katalog), `ChipPurchasedv1`, `DistrictUnlockedv1` / `StopTurnedGoldv1` (Nişan verme).
- *Dış bağımlılık:* —

**Görev — `quest`**
- *Sorumluluk:* görev tanımları (B6 kataloğu), oyuncu ilerlemesi, ödül verme (Bayt + XP, ilk tamamlama), günlük sınırlar, Ruhsat sayımı için olay yayını.
- *Tablolar:* `quests`, `quest_progress`.
- *Yayınlar:* `QuestCompletedv1`.
- *Tüketir:* `LessonSealedv1` (kilit açma), `SubmissionEvaluatedv1`, `BugReportSolvedv1`, `ContentPublishedv1`.
- *Dış bağımlılık:* —

**Bildirim — `notify`**
- *Sorumluluk:* uygulama içi gelen kutusu, Web Push abonelikleri ve gönderimi (VAPID), bildirim tercihleri (`profile_settings`), "kasa doldu" ve "Hata Bildirimi geldi" gibi zamanlı bildirimlerin birleştirilmesi (günde en çok 1 push, B2 §8.3).
- *Tablolar:* `notifications`, `push_subscriptions`.
- *Yayınlar:* —
- *Tüketir:* `VaultFullv1`, `LevelUpv1`, `FriendshipCreatedv1`, `BusinessStatusChangedv1`, `BugReportAssignedv1`, `LeagueClosedv1`, `GuardianConsent…v1`.
- *Dış bağımlılık:* Web Push servisleri (FCM, Mozilla, Apple).

**İçerik CMS — `content`**
- *Sorumluluk:* ders, soru, görev, challenge, ipucu merdiveni, hata çeviri tablosu, diyalog içeriği için taslak → inceleme → yayın akışı; sürümleme ve imza; yayın olayı.
- *Tablolar:* `content_items`, `content_revisions`, `hint_bank`, `error_translations`.
- *Yayınlar:* `ContentPublishedv1`, `ContentRetiredv1`.
- *Tüketir:* —
- *Dış bağımlılık:* Anthropic Batch API (Opus ile içerik taslağı; yalnızca iç araç).

**Analitik — `analytics`**
- *Sorumluluk:* olay toplama (ham olay, günlük bölüm), KPI günlük özetleri (D1/D7/D30, ilk Bayt süresi, ders terk, itiraz oranı, $/DAU/gün), kalibrasyon panosu verisi.
- *Tablolar:* `events`, `kpi_daily`.
- *Yayınlar:* —
- *Tüketir:* tüm alan olayları (yalnızca okur).
- *Dış bağımlılık:* —

**Moderasyon — `moderation`**
- *Sorumluluk:* sözlük ve kural yönetimi, Haiku ile asenkron inceleme, vaka kuyruğu (3 şikâyet → gizle + insan kuyruğu), susturma/yasaklama eylemleri, takma ad ve işletme adı incelemesi. Basamaklar B6'dadır; B7 altyapıyı verir.
- *Tablolar:* `cases`, `actions`, `word_list`.
- *Yayınlar:* `PlayerMutedv1`, `ContentRemovedv1`.
- *Tüketir:* `ChatMessageFlaggedv1`, `ChatReportedv1`, `HandleChangedv1`, `BusinessNameChangedv1`.
- *Dış bağımlılık:* Anthropic API (`claude-haiku-5-5`).

**Platform (çekirdek, modül değil):** `outbox_messages`, `inbox_messages`, `idempotency_keys`, `audit_log`, `scheduled_jobs`, `job_dead_letters`; ayrıca `ICurrentUser`, `IClock` (TR iş günü yardımcıları), `IIdGenerator` (UUIDv7), `Platform.Text` (sözlük/regex metin politikası, kişisel veri ayıklayıcı), Redis ve Npgsql soyutlamaları.

### 3.3 Bağımlılık yönü

Modüller altı katmana dizilir. **Bir modül yalnızca kendinden daha alçak katmanların `Contracts` derlemesini referans edebilir; aynı katmandakiler yalnızca olayla konuşur.** Olay "bir şey oldu" bildirimidir ve outbox'tan geçer; komut "şunu yap" çağrısıdır ve çağıranın işlemine katılır.

| Katman | Modüller | Doğrudan çağırabilir (komut) |
|---|---|---|
| 0 | Platform, Contracts | — |
| 1 | Identity, Player, Content | Platform |
| 2 | Economy, Progress | Katman 0–1 |
| 3 | Learning, Challenge, Market | Katman 0–2 (Learning → Progress `GrantXp`; Market → Economy `Post`; Challenge → yalnızca Platform) |
| 4 | Quest, World, Social | Katman 0–3 (Quest → Economy, Progress; World → Economy, Progress, Challenge `EnqueueRun`; Social → Economy, Progress) |
| 5 | Notification, Analytics, Moderation | Katman 0–4'ün **olaylarını** dinler, hiçbirini çağırmaz |

**Yasaklı kenarlar (katman kuralını geçersiz kılar):**

| Yasak | Neden |
|---|---|
| `Learning` ↛ `Economy`, `World` | AI ve Kurul gelire dokunamaz (KANON §9; ilke 1). Kurul yalnızca XP üretir, o da `Progress` üzerinden |
| `Challenge` ↛ `Economy`, `World` | Test sonucu *olay* olarak akar; ödül ve durum geçişi sahibi modülün işidir |
| Alt katman → üst katman (ör. `Economy` → `World`) | Döngüsel bağımlılık; defter "neye ödediğini" bilmez, yalnızca `tx_type` ve `ref` taşır |
| Herhangi bir modül → başka modülün tablosuna SQL | Sınırın delinmesi; ihlal derleyici/analizör/CI'da yakalanır |
| Oyun modülleri → `Analytics`, `Notification`, `Moderation` çağrısı | Doğruluğu bu modüllere bağlamak; yalnızca olay yayınlanır |
| `api`/`hub`/`worker` → oyuncu kodunu süreç içinde çalıştırma | Oyuncu kodu yalnızca sandbox bölgesinde çalışır |

**Zorlama üç katmanlıdır.** (1) *Derleme:* her modül iki proje olarak yazılır, `KodKent.<Modül>` (iç) ve `KodKent.<Modül>.Contracts` (genel); `Directory.Build.targets` iç projeye proje referansını reddeder, yalnızca barındırıcılar (`Api`, `Hub`, `Worker`) iç projeleri referans eder. (2) *Test:* NetArchTest katman ve yasak kenar testleri CI'da zorunludur; bir Roslyn analizörü (`KK001`) başka modülün şema adını içeren SQL dizgelerini hata sayar. (3) *Çalışma zamanı:* her modülün veri erişim katmanı kendi sınırına girerken `SET LOCAL ROLE kk_<modül>` çalıştırır; bu rol yalnızca kendi şemasında yetkilidir, başka şemaya erişim veritabanı hatası verir. `kk_app` oturum rolü tüm modül rollerinin üyesidir (`GRANT … WITH SET TRUE`), böylece bir işlem birden çok modülü tek bağlantıda kapsayabilir. Rol zorlaması CI entegrasyon testlerinde ve staging'de zorunlu, üretimde varsayılan olarak açıktır (ek maliyet: aynı gidiş-dönüşte toplu gönderilen tek bir `SET LOCAL`, ölçülen etki bütçesi %3'ün altında **(B7 önerisi)**).

**Olay akışı örneği (Otopark açılışı).** `Challenge` kodun testlerini işler ve `SubmissionEvaluatedv1{allPassed:true}` yayınlar; `World` bunu dinler, Savunma bekleyen işletme için `DefenseSession` açılmasını `Challenge`'a bildirir; Savunma `Learning`'in Kurul hattından geçer, `DefensePassedv1` yayınlanır; `World` işletmeyi `acik` yapar ve aynı işlemde `Progress.GrantXp(300, "open:{businessId}")` (KANON §3.3 açılış XP'si) ile — B2 §5.2'deki "Açılış Kurdelesi" bonusu onaylıysa — `Economy.Post(OPENING_RIBBON)` komutlarını çağırır, sonra `BusinessOpenedv1` yayınlar; `Notification` LED pano girdisini ve push'u, `Analytics` "72 saatte Açık" metriğini üretir. Hiçbir adımda `Learning` gelire veya işletme durumuna dokunmaz.

---

## 4. Veri modeli

### 4.1 Strateji

Veri modelinin görevi, ürün kurallarının mümkün olduğu kadarını *uygulama koduna değil şemaya* yazmaktır. "Çip yalnızca Premium kozmetikte harcanır", "her türden bir işletme", "3 görev = 1 Ruhsat", "referans tavanı gelirden fazla ödemez", "ders mührü 3 sorudan 2'si" gibi kurallar `CHECK`/`UNIQUE` olarak aşağıdaki DDL'dedir; böylece bir hata kodda olsa bile bozuk veri yazılamaz ve ekonomi istismarı veritabanı düzeyinde de kapanır.

**Motor ve kimlik.** PostgreSQL 18 (`uuidv7()` yerleşik; 17'de `pg_uuidv7` eklentisi). Tek veritabanı, 15 şema (14 modül + `platform`). Varlık anahtarları UUIDv7'dir; içerik anahtarları okunur metindir (`1.1`, `otopark-L1`, `carsi`). Adlandırma: tablolar çoğul `snake_case`; `_id` yabancı anahtar, `_at` zaman damgası, `_on` takvim günü, `_hash`/`_sha256` özet (`bytea`), `_enc` şifreli veri, `_ref` nesne deposu başvurusu.

**Tipler.** Enum tipi kullanılmaz; sabit kümeler `text` + `CHECK (… IN (…))` olarak yazılır, çünkü `ALTER TYPE` göçleri kilit ve geri alma sorunları doğurur, `CHECK` ise `NOT VALID` + `VALIDATE` ile kesintisiz değişir. Bayt, Çip ve TL `bigint`'tir (kuruş yoktur, KANON). Kasa kesirlidir: `numeric(14,4)`. Zamanlar `timestamptz` (UTC) saklanır; TR saati kalıcı UTC+3 olduğundan iş günü sınırı (04:00 TR = 01:00 UTC) sabit bir ofsettir ve ayrı bir `business_day date` kolonuna yazılır. `jsonb` yalnızca yayın anlık görüntüsünde (ders, challenge), Kurul çıktısında ve telemetride kullanılır; üzerinde sorgu yapılan alan `jsonb` içinde bırakılmaz.

**Bölümleme.** Büyüyen tablolar baştan bölümlenir; bölüm anahtarı birincil anahtara girer ve bölümlü tablolara yabancı anahtar *verilmez* (PostgreSQL kuralı + silme işlerini kolaylaştırır). Bölümleri `pg_partman` (CloudNativePG imajına eklenir) açar; bölüm yokluğu ekleme hatası vereceğinden "gelecek ay bölümü yok" alarmı vardır.

| Tablo | Bölümleme | Saklama / sonrası |
|---|---|---|
| `economy.ledger_entries` | aylık `RANGE (created_at)` | Sonsuz; 13 aydan eski bölümler soğuk depoya (Parquet) kopyalanır, `ledger_daily_digests` özetiyle mühürlenir |
| `learning.grading_submissions` | aylık `RANGE (created_at)` | 12 ay; sonra bölüm `DETACH` + `DROP`, özet `ai_usage_daily`'de kalır |
| `challenge.submissions` | aylık `RANGE (created_at)` | 13 ay; çalışan kod nesne deposunda içerik adresli kalır (bölümden bağımsız) |
| `world.business_runs` | aylık `RANGE (run_date)` | 24 ay (ekonomi analizi); grafikler son 30 gün |
| `social.chat_messages` | günlük `RANGE (sent_at)` | 90 gün; şikâyetli mesajın kanıt kopyası `chat_reports`'ta 1 yıl |
| `analytics.events` | günlük `RANGE (at)` | 13 ay |
| `progress.xp_events` | `HASH (player_id)` × 16 | Sonsuz (benzersiz `(player_id, source_key)` bölüm anahtarını içerir) |
| `identity.sms_log`, `challenge.sandbox_runs`, `platform.audit_log` | aylık | 180 gün / 30 gün / 24 ay |

**Yabancı anahtar politikası.** Modüller arası yabancı anahtar yalnızca `player.players(id)` hedefine verilir (silme/anonimleştirme tutarlılığı). Diğer modüller arası bağlar *yumuşak*tır: kimlik saklanır, bütünlük olay akışı ve gece tutarlılık denetimiyle korunur (ör. `businesses.active_submission_id` → `challenge.submissions`). Silme `ON DELETE RESTRICT`'tir; KVKK silmesi satır silmez, anonimleştirir (§11.6); defter hiçbir koşulda silinmez.

**İndeks politikası.** Her yabancı anahtar kolonu indekslidir; sıcak alt kümeler kısmi indeksle (`WHERE status IN ('deneme','acik')`), kuyruk benzeri taramalar (`status IN ('queued',…)`) kısmi indeksle; zaman sıralı ek-eklemeli büyük tablolarda (`chat_messages`, `events`) B-ağacına ek olarak BRIN. İndeks sayısı yazma maliyetidir: yeni indeks eklemek için `EXPLAIN (ANALYZE, BUFFERS)` kanıtı gerekir.

**Şifreleme ve gizlilik.** Telefon ve veli telefonu alan düzeyinde AES-256-GCM ile şifrelenir (zarf şifreleme: veri anahtarı KEK ile sarılır, `kek_version` döndürme içindir); arama için `HMAC-SHA256(pepper, E.164)` *kör indeksi* kullanılır; pepper ve KEK Vault/OpenBao'da tutulur, veritabanı yedeğinde yoktur. Diskler LUKS, yedekler pgBackRest ile şifrelidir. IP adresleri ham saklanmaz: `HMAC(günlük tuz, IP)` özeti saklanır (abuse analizi için günlük tuz 30 gün tutulur).

**Göç (migration).** Modül başına EF Core göç paketi (`dotnet ef migrations bundle`) Kubernetes `Job` olarak, uygulama dağıtımından önce `kk_migrator` rolüyle çalışır. Kural *genişlet/daralt*: yeni kolon `NULL` eklenir → geriye dönük doldurulur → kısıt `NOT VALID` eklenip `VALIDATE` edilir → eski kolon bir sürüm sonra kaldırılır; indeksler `CONCURRENTLY`. Yıkıcı göç (DROP, tip daraltma) ayrı onay ister ve ön-üretim kopyasında süre ölçülmeden birleştirilmez.

**Bağlantı havuzu.** PgBouncer *işlem modu*. `SET LOCAL ROLE` ve `pg_advisory_xact_lock` işlem kapsamlı olduğundan uyumludur; oturum düzeyi özellik (LISTEN/NOTIFY, oturum kilidi) kullanılmaz. Npgsql hazırlanmış ifadeleri (`Max Auto Prepare`) PgBouncer ≥ 1.21 ile açılır.

### 4.2 Tablo kataloğu

Aşağıdaki katalog 83 tabloyu listeler (15 şema). **DDL** işaretli olanların tam tanımı §4.3'tedir. Kolon listeleri *ana* kolonlardır; tam liste göç dosyalarındadır.

| Tablo | Amaç | Ana kolonlar | Anahtar kısıtlar / notlar |
|---|---|---|---|
| **Platform — `platform`** | | | |
| `platform.outbox_messages` | Transactional outbox | `id, aggregate, event_type, payload jsonb, occurred_at, published_at, attempts` | Olay, durum değişikliğiyle aynı işlemde yazılır; kısmi indeks `(published_at) WHERE published_at IS NULL` |
| `platform.inbox_messages` | Tüketici tekilleştirme | `consumer, message_id, processed_at` | PK `(consumer, message_id)` |
| `platform.idempotency_keys` | HTTP `Idempotency-Key` kaydı | `player_id, key, method, path, request_hash, state, response_status, response_body, locked_until, created_at` | PK `(player_id, key)`; 24 saat sonra silinir |
| `platform.audit_log` | Yönetici ve güvenlik denetim izi | `id, actor_id, actor_role, action, target_type, target_id, before, after, ip_hash, at` | Yalnızca INSERT (rol); aylık bölüm |
| `platform.scheduled_jobs` | Cron tanımı ve son çalışma | `name, cron, tz, last_run_at, next_run_at, lease_until` | PK `name`; lider `pg_try_advisory_lock` |
| `platform.job_dead_letters` | Ölü mektup kaydı | `id, queue, message_id, payload, error, attempts, first_failed_at, requeued_at` | İndeks `(queue, first_failed_at)` |
| **Auth/OTP — `identity`** | | | |
| `identity.phone_identities` | Telefon ↔ oyuncu | `player_id, phone_hash, phone_enc, kek_version, verified_at, status` | **DDL.** Benzersiz `phone_hash` (serbest bırakılmamış), benzersiz `player_id` |
| `identity.otp_challenges` | OTP gönderim/deneme kaydı | `phone_hash, purpose, code_hash, expires_at, resend_after, wrong_count, provider, risk_score` | **DDL.** Kod saklanmaz, HMAC'i saklanır; 90 gün sonra silinir |
| `identity.refresh_tokens` | Döndürülen yenileme belirteci | `family_id, player_id, device_id, token_hash, parent_id, used_at, revoked_at` | **DDL.** `used_at` dolu belirteç yeniden gelirse aile iptal |
| `identity.devices` | Cihaz bağlama | `id, player_id, device_hash, ua_hash, first_seen_at, last_seen_at, revoked_at` | Benzersiz `(player_id, device_hash)`; en çok 5 aktif |
| `identity.guardian_consents` | Veli onayı | `player_id, guardian_phone_hash/enc, token_hash, status, notice_version, sent_count, expires_at` | **DDL.** Oyuncu başına tek `pending`; süre ≤ 72 saat |
| `identity.consent_records` | Aydınlatma + açık rıza günlüğü | `player_id, kind, version, granted, at, ip_hash` | Yalnızca INSERT; rıza geri çekmesi yeni satırdır |
| `identity.privacy_requests` | İndirme/silme talepleri | `id, player_id, kind, status, requested_at, due_at, grace_until, artifact_ref` | `due_at = requested_at + 30 gün` (KVKK) |
| `identity.sms_log` | SMS gönderim ve maliyet | `id, provider, purpose, to_hash, status, dlr_status, cost_micro_try, sent_at, delivered_at` | Aylık bölüm; 180 gün; SMS-pumping analizi |
| **Oyuncu/Profil — `player`** | | | |
| `player.players` | Oyuncu çekirdeği | `id, handle, display_name, birth_year, birth_month, status, guardian_state, cohort_code, referred_by, version` | **DDL.** Benzersiz `lower(handle)`; `erased` ⇔ `erased_at` |
| `player.avatars` | Avatar yapılandırması | `player_id, body, skin, face jsonb, hair, outfit_set, updated_at` | PK `player_id` |
| `player.profile_settings` | Gizlilik ve bildirim tercihleri | `player_id, room_visibility, show_online, push_enabled, push_topics, locale` | 15–17 için varsayılan `arkadaslara` |
| `player.language_waitlist` | Dil "haber ver" listesi | `player_id, language, created_at` | PK `(player_id, language)` |
| **İlerleme — `progress`** | | | |
| `progress.player_progress` | XP, seviye, unvan özeti | `player_id, xp_total, level, title, last_xp_at, version` | `level BETWEEN 1 AND 60`; unvan bandı seviyeden türer |
| `progress.xp_events` | XP defteri (yalnızca ekleme) | `id, player_id, amount, source, source_key, level_after, created_at` | Benzersiz `(player_id, source_key)` → tekrar 0 XP; `HASH(player_id)` × 16 |
| `progress.metro_stops` | Metro durak durumu | `player_id, lesson_id, state, correct_streak, last_correct_at, sealed_at` | PK `(player_id, lesson_id)`; `state IN ('gri','sari','yesil','altin')` |
| `progress.review_queue` | Günlük Tekrar (1-3-7-21) | `player_id, question_id, stage, due_on, weight, last_result` | PK `(player_id, question_id)`; indeks `(player_id, due_on)` |
| `progress.streaks` | Seri ve dondurma | `player_id, current, longest, last_active_on, freezes_available, last_freeze_on` | `current <= longest` |
| `progress.district_gates` | Semt kapısı | `player_id, district_slug, exam_passed_at, unlocked_at, best_exam_score` | PK `(player_id, district_slug)` |
| **Eğitim — `learning`** | | | |
| `learning.lessons` | Ders yayın anlık görüntüsü | `id, module_id, district_slug, seq, tier, version, content jsonb, content_hash, status` | **DDL.** PK `1.1` biçimi; `(module_id, seq)` benzersiz |
| `learning.questions` | Soru bankası anlık görüntüsü | `id, version, lesson_id, type, tier, rubric_version, body jsonb, status` | PK `(id, version)`; `type IN ('kavram','cikti_tahmini','hata_avi','kod_yazma')` |
| `learning.lesson_attempts` | Ders oturumu | `player_id, lesson_id, attempt_no, state, questions_passed, xp_awarded, remediation_at` | **DDL.** `sealed ⇒ questions_passed ≥ 2` |
| `learning.question_attempts` | Soru denemesi | `lesson_attempt_id, question_id, attempt_no, route, score, passed, xp_awarded, grading_submission_id` | Benzersiz `(lesson_attempt_id, question_id, attempt_no)`; `attempt_no ≤ 2` |
| `learning.grading_submissions` | AI puanlama işi | `player_id, context_type, question_id, answer_hash, status, result jsonb, score, tokens_*, cost_usd_micros` | **DDL.** Aylık bölüm; `done ⇒ result, score` dolu |
| `learning.grading_appeals` | İtiraz | `grading_submission_id, player_id, status, second_score, delta, accepted` | Soru başına 1 itiraz benzersiz; günde 3 sınırı sayaçla |
| `learning.golden_set` | Kalibrasyon altın kümesi | `id, question_id, answer_text, human_scores jsonb, consent_basis, anonymized_at` | `player_id` yok (anonim); iki eğitmen puanı |
| `learning.prompt_versions` | İstem sürümleri | `name, version, model, system_hash, schema_ref, status, canary_pct` | Benzersiz `(name, version)`; ad başına en çok 1 `active` |
| `learning.ai_usage_daily` | Günlük AI kullanım/maliyet özeti | `day, model, calls, input_tokens, cache_read, cache_write, output_tokens, cost_usd_micros` | PK `(day, model)` |
| **Challenge — `challenge`** | | | |
| `challenge.challenges` | Challenge Spec yayın görüntüsü | `id, version, kind, tier, spec jsonb, reference_ref, public/hidden/seeded_tests, is_current` | **DDL.** Gizli testler ve referans çözüm oyuncu API'sine hiç çıkmaz |
| `challenge.submissions` | Kod gönderimi | `player_id, challenge_id, source_code, pe_sha256, seed, status, tests_*, telemetry, similarity` | **DDL.** Aylık bölüm |
| `challenge.submission_test_results` | Test sonuç satırı | `submission_id, test_id, kind, status, ms` | PK `(submission_id, test_id)`; gizli testte girdi/beklenen **saklanmaz** |
| `challenge.ast_fingerprints` | AST benzerlik parmak izi | `submission_id, challenge_id, minhash, band_keys int[]` | GIN `(band_keys)` |
| `challenge.defense_sessions` | Savunma oturumu | `business_id, submission_id, line_no, question_text, answer_text, outcome` | `outcome IN ('acilis','deneme')` |
| `challenge.bug_reports` | Hata Bildirimi dosyası | `player_id, challenge_id, mutation_id, status, solved_at` | Günde 3 sınırı `quest` sayaçlarında |
| `challenge.sandbox_runs` | Çalıştırma işletim kaydı | `job_id, kind, worker_id, outcome, violation, cpu_ms, peak_mem_mb, harness_version` | Aylık bölüm; 30 gün |
| **Ekonomi — `economy`** | | | |
| `economy.wallets` | Cüzdan (oyuncu + sistem) | `owner_type, owner_id, system_code, currency, balance, track_balance, allow_negative` | **DDL.** `balance ≥ 0` (sistem hariç); `(id, currency)` benzersiz |
| `economy.ledger_transactions` | Defter işlemi başlığı | `tx_type, idempotency_key, business_day, ref_type, ref_id, reversal_of` | **DDL.** Benzersiz `idempotency_key`; ertelenmiş denge tetikleyicisi |
| `economy.ledger_entries` | Defter satırı | `tx_id, wallet_id, currency, amount, balance_after` | **DDL.** Aylık bölüm; `amount <> 0`; değiştirilemez |
| `economy.ledger_daily_digests` | Günlük hash özeti | `day, entry_count, sum_credit, sum_debit, sha256, prev_sha256, worm_ref` | Zincirleme özet; WORM nesne kilidine yazılır |
| `economy.daily_economy_stats` | Ekonomi panosu (B2 §10.5) | `day, metric, scope, value` | PK `(day, metric, scope)` |
| `economy.payment_orders` | Çip siparişleri | `id, player_id, package_code, amount_try_kurus, chips, provider, provider_ref, status, refund_until` | Benzersiz `(provider, provider_ref)` |
| `economy.admin_adjustments` | Yönetici düzeltmesi (dört göz) | `wallet_id, amount, reason, requested_by, approved_by, ledger_tx_id, status` | `CHECK (requested_by <> approved_by)` |
| **Dünya — `world`** | | | |
| `world.districts` | Semt ana verisi | `slug, tier, unlock_level, usta` | 7 satır, içerik |
| `world.streets` | Ara Sokak örnekleri | `id, district_slug, name, capacity` | Kapasite 6 parsel (B1 §6.1) |
| `world.parcels` | Parsel sahipliği | `street_id, slot_no, owner_id, assigned_at` | PK `(street_id, slot_no)`; oyuncu başına semtte tek parsel |
| `world.businesses` | İşletme | `owner_id, kind, district_slug, level, status, deed_tx_id, active_submission_id, active_pe_sha256` | **DDL.** Benzersiz `(owner_id, kind)`; durum `kapali/deneme/acik/kararmis` |
| `world.business_vaults` | Kasa (tembel hesap) | `business_id, rate_per_hour, balance_t0, t0, cap_hours` | **DDL.** `cap_hours IN (8,12)` |
| `world.business_runs` | Günlük gelir hesabı | `business_id, run_date, revision, seed, player_tl, reference_tl, capped_tl, status_factor, daily_bayt` | **DDL.** `capped_tl = LEAST(player_tl, reference_tl)` |
| `world.vault_collections` | Toplama günlüğü | `business_id, player_id, amount, idle_full_hours, ledger_tx_id, at` | Ekonomi panosu "kasa doluluk kaybı" verisi |
| `world.licences` | Ruhsat ilerlemesi | `player_id, business_kind, tasks_done, granted_at, incentive_tx_id` | PK `(player_id, business_kind)`; `tasks_done BETWEEN 0 AND 3` |
| `world.rooms` | Oda | `id, owner_id, type, visibility, capacity, layout_version, version` | Benzersiz `owner_id`; `type IN ('studyo','daire','cati_kati')` |
| `world.room_items` | Oda yerleşimi | `room_id, inventory_item_id, gx, gy, rot, layer` | Benzersiz `(room_id, gx, gy, layer)` |
| `world.visits` | Ziyaret ve Alkış | `target_type, target_id, visitor_id, visited_on, applauded` | Benzersiz `(target_type, target_id, visitor_id, visited_on)` → günde 1 Alkış |
| **Sosyal — `social`** | | | |
| `social.friendships` | Arkadaşlık | `a_id, b_id, created_at` | PK `(a_id, b_id)`; `CHECK (a_id < b_id)` |
| `social.friend_requests` | Arkadaşlık istekleri | `id, from_id, to_id, status` | Kısmi benzersiz: bekleyen `(from_id, to_id)` |
| `social.invites` | Davet kodu | `code, owner_id, redeemed_by, redeemed_at, reward_state` | Ayda 5 ödül sınırı uygulamada (B2 §5.2) |
| `social.chat_messages` | Sohbet mesajı | `id, channel_kind, channel_key, sender_id, body, sent_at, moderation_state` | Günlük bölüm; 90 gün; BRIN `(sent_at)` |
| `social.chat_reports` | Şikâyet | `reporter_id, reported_id, message_id, excerpt, reason, state, action` | **DDL.** `(reporter_id, message_id)` benzersiz |
| `social.blocks` | Engelleme | `blocker_id, blocked_id, at` | PK `(blocker_id, blocked_id)` |
| `social.league_members` | Haftalık lig üyeliği | `season_week, tier, bucket_no, player_id, weekly_xp, rank, reward_bayt` | PK `(season_week, player_id)`; kova 30 kişi (KANON §8) |
| `social.leaderboard_snapshots` | Pano anlık görüntüsü | `board, period, rank, player_id, score` | PK `(board, period, rank)` |
| **Pazar/Envanter — `market`** | | | |
| `market.items` | Eşya kataloğu | `sku, category, rarity, price_bayt, price_cip, series_limit, status` | **DDL.** Çip yalnızca `premium`; `nisan` satılmaz |
| `market.shelf_rotations` | Haftalık raf | `week_start, sku, slot_no, serial_issued, serial_limit` | PK `(week_start, sku)`; `serial_issued ≤ serial_limit` |
| `market.purchases` | Satın alma kaydı | `id, player_id, sku, currency, price, ledger_tx_id, idempotency_key` | Benzersiz `idempotency_key` |
| `market.inventory_items` | Envanter | `player_id, sku, quantity, serial_no, acquired_via, equipped_slot` | **DDL.** Benzersiz `(player_id, sku)`; yuva başına tek giyilen |
| **Görev — `quest`** | | | |
| `quest.quests` | Görev tanımı | `id, type, tier, lesson_id, challenge_id, licence_kind, licence_part, reward_xp, reward_bayt` | **DDL.** Katalog B6'dır |
| `quest.quest_progress` | Oyuncu görev durumu | `player_id, quest_id, state, attempts, first_completed_at, reward_tx_id` | **DDL.** `reward_tx_id` benzersiz |
| **Bildirim — `notify`** | | | |
| `notify.notifications` | Uygulama içi gelen kutusu | `id, player_id, kind, payload jsonb, read_at, created_at` | İndeks `(player_id, created_at DESC)`; 60 gün |
| `notify.push_subscriptions` | Web Push aboneliği | `id, player_id, device_id, endpoint, p256dh, auth, failed_count` | Benzersiz `endpoint` |
| **İçerik CMS — `content`** | | | |
| `content.content_items` | İçerik kimliği | `id, kind, slug, current_revision, status` | Benzersiz `(kind, slug)` |
| `content.content_revisions` | Sürüm geçmişi | `item_id, revision, body jsonb, author_id, reviewer_id, state, signed_hash, published_at` | PK `(item_id, revision)`; yazar ≠ inceleyen |
| `content.hint_bank` | İpucu merdiveni | `target_id, level, text, version` | `level IN ('pusula','fener','taslak','ornek')` |
| `content.error_translations` | CS hata çevirisi (50 statik) | `cs_code, tr_message, tr_hint, source, version` | PK `cs_code`; `source IN ('statik','haiku')` |
| **Analitik — `analytics`** | | | |
| `analytics.events` | Ham olay | `id, name, player_id (takma), at, props jsonb, session_id, client_ver` | Günlük bölüm; 13 ay; rıza kapısı |
| `analytics.kpi_daily` | KPI günlük özeti | `day, metric, dimension, value` | PK `(day, metric, dimension)` |
| **Moderasyon — `moderation`** | | | |
| `moderation.cases` | Vaka (sohbet, ad, işletme adı, oda metni) | `id, kind, subject_id, state, assigned_to, created_at, closed_at` | İndeks `(state, created_at)` |
| `moderation.actions` | Eylem (uyarı, susturma, yasak) | `id, case_id, player_id, action, by, reason, expires_at` | `action IN ('warn','mute_24h','mute_7d','ban')` |
| `moderation.word_list` | Sözlük ve desenler | `id, pattern, kind, severity, locale, active` | Önbelleğe alınır; değişiklik denetim izine yazılır |

### 4.3 Kritik tabloların DDL'i

Aşağıdaki 21 tablo (ve 4 örnek bölüm) PostgreSQL 18 içindir. Sözdizimi `libpg-query` 18.2 ile doğrulanmıştır (84 deyim); anlamsal doğrulama CI'da gerçek PostgreSQL'e karşı yapılır (Testcontainers). Şema ve rol oluşturma §4.3.0'dadır; tablolar bağımlılık sırasındadır.

#### 4.3.0 Şemalar ve roller

```sql
CREATE SCHEMA IF NOT EXISTS platform;   CREATE SCHEMA IF NOT EXISTS identity;  CREATE SCHEMA IF NOT EXISTS player;
CREATE SCHEMA IF NOT EXISTS progress;   CREATE SCHEMA IF NOT EXISTS learning;  CREATE SCHEMA IF NOT EXISTS challenge;
CREATE SCHEMA IF NOT EXISTS economy;    CREATE SCHEMA IF NOT EXISTS world;     CREATE SCHEMA IF NOT EXISTS social;
CREATE SCHEMA IF NOT EXISTS market;     CREATE SCHEMA IF NOT EXISTS quest;     CREATE SCHEMA IF NOT EXISTS notify;
CREATE SCHEMA IF NOT EXISTS content;    CREATE SCHEMA IF NOT EXISTS analytics; CREATE SCHEMA IF NOT EXISTS moderation;

CREATE ROLE kk_migrator NOLOGIN;                 -- DDL (göç işi)
CREATE ROLE kk_economy  NOLOGIN;                 -- … her modül için bir rol: yalnızca kendi şemasında DML
GRANT USAGE ON SCHEMA economy TO kk_economy;
GRANT SELECT, INSERT ON economy.ledger_transactions, economy.ledger_entries TO kk_economy;   -- UPDATE/DELETE yok
CREATE ROLE kk_app LOGIN;                        -- uygulama oturumu: modül rollerinin üyesi
GRANT kk_economy TO kk_app WITH SET TRUE, INHERIT FALSE;
```

*Not.* Her modül için `NOLOGIN` bir rol vardır; uygulama `kk_app` ile bağlanır ve modül sınırına girerken `SET LOCAL ROLE kk_<modül>` çalıştırır (§3.3). Defter tablolarında hiçbir rolde `UPDATE`/`DELETE` yetkisi yoktur; `kk_migrator` yalnızca göç işinde kullanılır.

#### 4.3.1 `player.players`

```sql
CREATE TABLE player.players (
    id              uuid        PRIMARY KEY DEFAULT uuidv7(),
    handle          text        NOT NULL CHECK (handle ~ '^[a-z0-9_.]{3,20}$'),               -- @ayse_kod
    display_name    text        NOT NULL CHECK (char_length(display_name) BETWEEN 3 AND 20),   -- moderasyondan geçmiş
    birth_year      smallint    NOT NULL CHECK (birth_year BETWEEN 1940 AND 2100),
    birth_month     smallint    CHECK (birth_month BETWEEN 1 AND 12),                          -- yalnızca 13 yaş sınır yılında sorulur
    status          text        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','suspended','banned','pending_erasure','erased')),
    guardian_state  text        NOT NULL DEFAULT 'not_required'
                    CHECK (guardian_state IN ('not_required','pending','granted','declined','expired','revoked')),
    language_track  text        NOT NULL DEFAULT 'csharp' CHECK (language_track IN ('csharp')),
    cohort_code     text        CHECK (cohort_code ~ '^[A-Z0-9]{4,12}$'),                     -- kulüp kodu: aynı shard'a yerleşim
    referred_by     uuid        REFERENCES player.players(id),
    created_at      timestamptz NOT NULL DEFAULT now(),
    last_seen_at    timestamptz,
    erased_at       timestamptz,
    version         integer     NOT NULL DEFAULT 1,                                           -- iyimser eşzamanlılık
    CHECK ((status = 'erased') = (erased_at IS NOT NULL))
);
CREATE UNIQUE INDEX players_handle_uq   ON player.players (lower(handle)) WHERE status <> 'erased';
CREATE INDEX        players_cohort_ix   ON player.players (cohort_code)   WHERE cohort_code IS NOT NULL;
CREATE INDEX        players_referred_ix ON player.players (referred_by)   WHERE referred_by IS NOT NULL;
```

*Not.* Bölümleme yok (33 M satıra kadar tek tablo uygundur). `version` iyimser eşzamanlılıktır (`UPDATE … WHERE id = $1 AND version = $2`). `birth_year` / `birth_month` Yaş Kapısı v2'de (§11.5) yazılmaz; yerlerini `age_band`, `age_verified_at` alır (göç 0042).

#### 4.3.2 `identity.phone_identities`

```sql
CREATE TABLE identity.phone_identities (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    player_id     uuid        NOT NULL REFERENCES player.players(id) ON DELETE RESTRICT,
    phone_hash    bytea       NOT NULL CHECK (octet_length(phone_hash) = 32),   -- HMAC-SHA256(pepper, E.164): kör indeks, arama anahtarı
    phone_enc     bytea       NOT NULL,                                          -- AES-256-GCM (nonce‖şifreli metin‖etiket), zarf şifreleme
    kek_version   smallint    NOT NULL,                                          -- anahtar döndürme için
    country_code  char(2)     NOT NULL DEFAULT 'TR',
    verified_at   timestamptz NOT NULL,
    status        text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','locked','released')),
    created_at    timestamptz NOT NULL DEFAULT now(),
    released_at   timestamptz
);
CREATE UNIQUE INDEX phone_identities_player_uq ON identity.phone_identities (player_id);
CREATE UNIQUE INDEX phone_identities_hash_uq   ON identity.phone_identities (phone_hash) WHERE status <> 'released';
```

*Not.* Telefon düz metin saklanmaz. `released` durumu hesap silmede numarayı serbest bırakır: aynı numara yeni hesap açabilir, eski hesapla bağ kopar.

#### 4.3.3 `identity.otp_challenges`

```sql
CREATE TABLE identity.otp_challenges (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    phone_hash    bytea       NOT NULL CHECK (octet_length(phone_hash) = 32),
    purpose       text        NOT NULL CHECK (purpose IN ('login','guardian','phone_change','erasure_confirm')),
    code_hash     bytea       NOT NULL CHECK (octet_length(code_hash) = 32),     -- HMAC(pepper, id‖kod): 6 haneli kodun kendisi saklanmaz
    created_at    timestamptz NOT NULL DEFAULT now(),
    expires_at    timestamptz NOT NULL,                                          -- created_at + 90 sn (KANON §6)
    resend_after  timestamptz NOT NULL,                                          -- created_at + 60 sn
    wrong_count   smallint    NOT NULL DEFAULT 0 CHECK (wrong_count BETWEEN 0 AND 3),
    consumed_at   timestamptz,
    provider      text        NOT NULL CHECK (provider IN ('netgsm','iletimerkezi')),
    provider_msg  text,
    ip_hash       bytea,
    device_hash   bytea,
    risk_score    smallint    NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    CHECK (expires_at > created_at AND resend_after > created_at)
);
CREATE INDEX otp_phone_created_ix ON identity.otp_challenges (phone_hash, created_at DESC);
CREATE INDEX otp_created_ix       ON identity.otp_challenges (created_at);       -- 90 gün sonra temizlik işi
```

*Not.* Bölümleme yok; 90 gün sonra temizlik işi siler. Kod hash'i `HMAC(otp_pepper, id ‖ kod)`'dur; 90 sn ömür ve üç yanlış deneme sınırı, 10^6 kod uzayında kaba kuvveti pratikte imkânsız kılar. `provider` değeri yedek sağlayıcıya geçişi izler.

#### 4.3.4 `identity.refresh_tokens`

```sql
CREATE TABLE identity.refresh_tokens (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    family_id     uuid        NOT NULL,                                          -- aynı oturumun döndürme zinciri
    player_id     uuid        NOT NULL REFERENCES player.players(id) ON DELETE CASCADE,
    device_id     uuid        NOT NULL,
    token_hash    bytea       NOT NULL UNIQUE CHECK (octet_length(token_hash) = 32),   -- SHA-256(opak 256 bit)
    parent_id     uuid        REFERENCES identity.refresh_tokens(id),
    issued_at     timestamptz NOT NULL DEFAULT now(),
    expires_at    timestamptz NOT NULL,
    used_at       timestamptz,                                                   -- kullanılmış belge yeniden gelirse: çalıntı → aile iptal
    revoked_at    timestamptz,
    revoke_reason text        CHECK (revoke_reason IN ('logout','reuse_detected','admin','erasure','device_limit')),
    CHECK (expires_at > issued_at)
);
CREATE INDEX refresh_family_ix        ON identity.refresh_tokens (family_id);
CREATE INDEX refresh_player_active_ix ON identity.refresh_tokens (player_id) WHERE revoked_at IS NULL AND used_at IS NULL;
```

*Not.* Her yenilemede yeni belirteç yazılır ve eskisinin `used_at` değeri dolar; kullanılmış bir belirteç tekrar sunulursa tüm `family_id` iptal edilir (`reuse_detected`) ve oyuncudan yeniden OTP istenir.

#### 4.3.5 `identity.guardian_consents`

```sql
CREATE TABLE identity.guardian_consents (
    id                  uuid        PRIMARY KEY DEFAULT uuidv7(),
    player_id           uuid        NOT NULL REFERENCES player.players(id),
    guardian_phone_hash bytea       NOT NULL CHECK (octet_length(guardian_phone_hash) = 32),
    guardian_phone_enc  bytea       NOT NULL,
    token_hash          bytea       NOT NULL UNIQUE CHECK (octet_length(token_hash) = 32),     -- SMS bağlantısındaki 256 bit belirtecin özeti
    notice_version      text        NOT NULL,                                                  -- gösterilen veli aydınlatma metni sürümü
    status              text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','granted','declined','expired','revoked')),
    sent_count          smallint    NOT NULL DEFAULT 1 CHECK (sent_count BETWEEN 1 AND 3),     -- 7 günde en çok 3 gönderim
    created_at          timestamptz NOT NULL DEFAULT now(),
    expires_at          timestamptz NOT NULL,                                                  -- created_at + 72 saat (KANON §1)
    decided_at          timestamptz,
    decided_ip_hash     bytea,
    CHECK (expires_at > created_at AND expires_at <= created_at + interval '72 hours'),
    CHECK (status = 'pending' OR status = 'expired' OR decided_at IS NOT NULL)
);
CREATE UNIQUE INDEX guardian_pending_uq ON identity.guardian_consents (player_id) WHERE status = 'pending';
```

*Not.* SMS bağlantısı yalnızca 256 bit rastgele belirteci taşır; veritabanında özeti vardır. 72 saat dolunca `expire` işi `status = 'expired'` yapar; oyuncu 7 günde en çok 3 gönderim isteyebilir.

#### 4.3.6 `learning.lessons`

```sql
CREATE TABLE learning.lessons (
    id            text        PRIMARY KEY CHECK (id ~ '^[0-9]+[.][0-9]+$'),                    -- '1.1'  (modül.sıra; B4 sahibi)
    module_id     text        NOT NULL CHECK (module_id ~ '^M[0-9]+$'),
    district_slug text        NOT NULL CHECK (district_slug IN ('carsi','liman','atolyeler','kampus','finans-bolgesi','veri-vadisi','bulut-tepesi')),
    seq           smallint    NOT NULL CHECK (seq > 0),
    tier          smallint    NOT NULL CHECK (tier BETWEEN 1 AND 4),
    title         text        NOT NULL,
    version       integer     NOT NULL DEFAULT 1,
    content       jsonb       NOT NULL,                                                       -- kartlar + 3 Usta sorusu başvurusu (içerik şeması B4/B3)
    content_hash  bytea       NOT NULL CHECK (octet_length(content_hash) = 32),
    status        text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','retired')),
    published_at  timestamptz,
    UNIQUE (module_id, seq),
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);
```

*Not.* İçerik, B4'ün ders listesidir; bu tablo yayın anlık görüntüsüdür ve CMS'ten `ContentPublishedv1` olayıyla dolar.

#### 4.3.7 `learning.lesson_attempts`

```sql
CREATE TABLE learning.lesson_attempts (
    id               uuid        PRIMARY KEY DEFAULT uuidv7(),
    player_id        uuid        NOT NULL REFERENCES player.players(id),
    lesson_id        text        NOT NULL REFERENCES learning.lessons(id),
    lesson_version   integer     NOT NULL,
    attempt_no       smallint    NOT NULL DEFAULT 1 CHECK (attempt_no >= 1),                   -- Telafi Turu yeni deneme sayılır
    state            text        NOT NULL DEFAULT 'in_progress' CHECK (state IN ('in_progress','sealed','not_sealed','abandoned')),
    cards_done       smallint    NOT NULL DEFAULT 0 CHECK (cards_done >= 0),
    questions_passed smallint    NOT NULL DEFAULT 0 CHECK (questions_passed BETWEEN 0 AND 3),
    xp_awarded       integer     NOT NULL DEFAULT 0 CHECK (xp_awarded >= 0),                   -- ders tavanı (B2 §4.3) uygulama katmanında
    remediation_at   timestamptz,                                                              -- Telafi Turu açılışı (+10 dk)
    started_at       timestamptz NOT NULL DEFAULT now(),
    finished_at      timestamptz,
    UNIQUE (player_id, lesson_id, attempt_no),
    CHECK (state <> 'sealed' OR questions_passed >= 2)                                          -- Ders Mührü: 3 sorudan 2'si ≥ 70
);
CREATE INDEX lesson_attempts_open_ix ON learning.lesson_attempts (player_id) WHERE state = 'in_progress';
```

*Not.* Telafi Turu yeni bir `attempt_no` satırıdır. Ders XP tavanı (`10 + 3 × taban × 1,2`, B2 §4.3) uygulama katmanında, `xp_events` benzersiz anahtarıyla birlikte uygulanır.

#### 4.3.8 `learning.grading_submissions`

```sql
CREATE TABLE learning.grading_submissions (
    id                 uuid         NOT NULL DEFAULT uuidv7(),
    created_at         timestamptz  NOT NULL DEFAULT now(),
    player_id          uuid         NOT NULL,
    context_type       text         NOT NULL CHECK (context_type IN ('ders','savunma','takip','itiraz','gunluk_tekrar','sinav')),
    context_id         uuid         NOT NULL,
    question_id        text         NOT NULL,
    question_version   integer      NOT NULL,
    attempt_no         smallint     NOT NULL CHECK (attempt_no IN (1,2)),                       -- soru başına 2 deneme (KANON §9)
    prompt_version     text         NOT NULL,
    rubric_version     integer      NOT NULL,
    answer_text        text         NOT NULL CHECK (char_length(answer_text) <= 1500),          -- KANON §9
    answer_hash        bytea        NOT NULL CHECK (octet_length(answer_hash) = 32),            -- aynı cevaba aynı puan önbelleği (§10.5)
    status             text         NOT NULL DEFAULT 'queued' CHECK (status IN
                       ('queued','screening','scoring','second_read','done','deferred_quota','deferred_outage','rejected','failed')),
    screening          jsonb,                                                                  -- Haiku: {bos, konu_disi, enjeksiyon, kopya, kisisel_veri}
    result             jsonb,                                                                  -- Kurul JSON (şema B3'ün)
    score              smallint     CHECK (score BETWEEN 0 AND 100),
    confidence         numeric(3,2) CHECK (confidence BETWEEN 0 AND 1),
    cache_hit          boolean      NOT NULL DEFAULT false,
    models             text[]       NOT NULL DEFAULT '{}',
    tokens_in          integer      NOT NULL DEFAULT 0,
    tokens_cache_read  integer      NOT NULL DEFAULT 0,
    tokens_cache_write integer      NOT NULL DEFAULT 0,
    tokens_out         integer      NOT NULL DEFAULT 0,
    cost_usd_micros    bigint       NOT NULL DEFAULT 0,                                         -- 1 $ = 1.000.000
    batch_id           text,
    quota_day          date         NOT NULL,                                                   -- iş günü (04:00 TR)
    completed_at       timestamptz,
    PRIMARY KEY (id, created_at),
    CHECK (status <> 'done' OR (result IS NOT NULL AND score IS NOT NULL))
) PARTITION BY RANGE (created_at);
CREATE TABLE learning.grading_submissions_2026_11 PARTITION OF learning.grading_submissions
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE INDEX grading_player_ix ON learning.grading_submissions (player_id, created_at DESC);
CREATE INDEX grading_open_ix   ON learning.grading_submissions (status, created_at)
    WHERE status IN ('queued','screening','scoring','second_read','deferred_quota','deferred_outage');
CREATE INDEX grading_cache_ix  ON learning.grading_submissions (answer_hash, question_id, question_version, rubric_version, prompt_version)
    WHERE status = 'done';
```

*Not.* Aylık bölüm; sonraki ayın bölümü `pg_partman` ile bir hafta önce açılır. Bölümlü tabloya FK yoktur; `player_id` silme işiyle anonimleştirilir. Benzersiz kısıt bölüm anahtarını içermek zorunda olduğundan HTTP idempotency `platform.idempotency_keys` ile sağlanır. `grading_cache_ix`, §10.5'teki "aynı cevaba aynı puan" aramasını karşılar.

#### 4.3.9 `economy.wallets`

```sql
CREATE TABLE economy.wallets (
    id             uuid        PRIMARY KEY DEFAULT uuidv7(),
    owner_type     text        NOT NULL CHECK (owner_type IN ('player','system')),
    owner_id       uuid        REFERENCES player.players(id) ON DELETE RESTRICT,
    system_code    text,                                                       -- 'faucet.quest', 'sink.market' …
    currency       text        NOT NULL CHECK (currency IN ('BAYT','CIP')),
    balance        bigint      NOT NULL DEFAULT 0,
    track_balance  boolean     NOT NULL DEFAULT true,                           -- sistem cüzdanlarında false: sıcak satır (kilit çekişmesi) yok
    allow_negative boolean     NOT NULL DEFAULT false,
    version        bigint      NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, currency),                                                      -- ledger_entries için bileşik FK hedefi
    CHECK ((owner_type = 'player' AND owner_id IS NOT NULL AND system_code IS NULL)
        OR (owner_type = 'system' AND owner_id IS NULL AND system_code IS NOT NULL)),
    CHECK (allow_negative OR balance >= 0),
    CHECK (track_balance OR balance = 0)
);
CREATE UNIQUE INDEX wallets_player_uq ON economy.wallets (owner_id, currency)    WHERE owner_type = 'player';
CREATE UNIQUE INDEX wallets_system_uq ON economy.wallets (system_code, currency) WHERE owner_type = 'system';
```

*Not.* Sistem cüzdanları (`faucet.*`, `sink.*`) `track_balance = false`'tur: her ödülde aynı sistem satırını güncellemek tüm oyuncuları tek kilitte toplardı (sıcak satır). Sistem bakiyeleri gece denetiminde `SUM(amount)` ile hesaplanır.

#### 4.3.10 `economy.ledger_transactions`

```sql
CREATE TABLE economy.ledger_transactions (
    id              uuid        PRIMARY KEY DEFAULT uuidv7(),
    tx_type         text        NOT NULL CHECK (tx_type IN (
        'QUEST_REWARD','LICENCE_INCENTIVE','OPENING_RIBBON','DAILY_REVIEW_REWARD','BUG_REPORT_REWARD','DISTRICT_EXAM_REWARD',
        'LEAGUE_REWARD','APPLAUSE_REWARD','INVITE_REWARD','VAULT_COLLECT','BUSINESS_DEED_PURCHASE','BUSINESS_UPGRADE',
        'BUSINESS_RENAME','MARKET_PURCHASE','BOUTIQUE_PURCHASE','ROOM_UPGRADE','HANDLE_CHANGE','STREAK_FREEZER_PURCHASE',
        'MUNICIPAL_DONATION','CHIP_TOPUP','CHIP_REFUND','ADMIN_ADJUSTMENT','ERASURE_WRITEOFF','REVERSAL')),
    idempotency_key text        NOT NULL UNIQUE,                                -- doğal anahtar: 'qr:{oyuncu}:{görev}' (§9.5)
    occurred_at     timestamptz NOT NULL DEFAULT now(),
    business_day    date        NOT NULL,                                       -- 04:00 TR sınırlı iş günü
    ref_type        text,
    ref_id          text,
    actor_type      text        NOT NULL CHECK (actor_type IN ('player','system','admin')),
    actor_id        uuid,
    reversal_of     uuid        REFERENCES economy.ledger_transactions(id),
    meta            jsonb       NOT NULL DEFAULT '{}'
);
CREATE INDEX ledger_tx_type_day_ix ON economy.ledger_transactions (tx_type, business_day);
CREATE INDEX ledger_tx_ref_ix      ON economy.ledger_transactions (ref_type, ref_id) WHERE ref_id IS NOT NULL;
```

*Not.* Başlık tablosu bölümlenmez, çünkü `idempotency_key` benzersizliği tüm zaman için geçerli olmalıdır. 100k DAU'da yıllık ≈ 365 M satır (≈ 80 GB) beklenir; 13 aydan eski başlıklar günlük özetle mühürlenip soğuk depoya taşınır (§9.6).

#### 4.3.11 `economy.ledger_entries (aylık bölüm)` + `değişmezler`

```sql
CREATE TABLE economy.ledger_entries (
    id            bigint      GENERATED ALWAYS AS IDENTITY,
    created_at    timestamptz NOT NULL DEFAULT now(),
    tx_id         uuid        NOT NULL REFERENCES economy.ledger_transactions(id),
    wallet_id     uuid        NOT NULL,
    currency      text        NOT NULL CHECK (currency IN ('BAYT','CIP')),
    amount        bigint      NOT NULL CHECK (amount <> 0),                     -- + cüzdana giren, − cüzdandan çıkan
    balance_after bigint,                                                       -- yalnızca track_balance cüzdanlarda
    PRIMARY KEY (id, created_at),
    FOREIGN KEY (wallet_id, currency) REFERENCES economy.wallets (id, currency) -- para birimi cüzdanla tutarlı
) PARTITION BY RANGE (created_at);
CREATE TABLE economy.ledger_entries_2026_11 PARTITION OF economy.ledger_entries
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE INDEX ledger_entries_wallet_ix ON economy.ledger_entries (wallet_id, created_at DESC);
CREATE INDEX ledger_entries_tx_ix     ON economy.ledger_entries (tx_id);

CREATE FUNCTION economy.assert_tx_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM economy.ledger_entries WHERE tx_id = NEW.id)
       OR EXISTS (SELECT 1 FROM economy.ledger_entries WHERE tx_id = NEW.id GROUP BY currency HAVING sum(amount) <> 0) THEN
        RAISE EXCEPTION 'ledger işlemi % dengesiz (her para biriminde toplam 0 olmalı)', NEW.id USING ERRCODE = '23514';
    END IF;
    RETURN NULL;
END $$;
-- Başlık ve satırlar aynı işlemde yazılır; denge COMMIT anında doğrulanır (ertelenmiş kısıt).
CREATE CONSTRAINT TRIGGER ledger_tx_balanced AFTER INSERT ON economy.ledger_transactions
    DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION economy.assert_tx_balanced();

CREATE FUNCTION economy.forbid_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION '% yalnızca eklemeye açıktır; düzeltme REVERSAL işlemiyle yapılır', TG_TABLE_NAME USING ERRCODE = '42501';
END $$;
CREATE TRIGGER ledger_entries_immutable BEFORE UPDATE OR DELETE ON economy.ledger_entries
    FOR EACH ROW EXECUTE FUNCTION economy.forbid_mutation();
CREATE TRIGGER ledger_tx_immutable BEFORE UPDATE OR DELETE ON economy.ledger_transactions
    FOR EACH ROW EXECUTE FUNCTION economy.forbid_mutation();
```

*Not.* Denge kontrolü **COMMIT anında** çalışır: başlık ve satırlar aynı işlemde yazılmak zorundadır. Değiştirme tetikleyicileri düzeltmeyi `REVERSAL` işlemine zorlar. `DROP PARTITION` tetikleyiciyi çalıştırmaz; yalnızca soğuk depoya kopyalanıp özeti mühürlenmiş bölümlerde yapılır.

#### 4.3.12 `world.businesses` + `world.business_vaults`

```sql
CREATE TABLE world.businesses (
    id                   uuid        PRIMARY KEY DEFAULT uuidv7(),
    owner_id             uuid        NOT NULL REFERENCES player.players(id) ON DELETE RESTRICT,
    kind                 text        NOT NULL CHECK (kind IN ('otopark','bufe','manav','kargo-deposu','balik-hali','oto-yikama','gumruk',
        'oto-tamirhane','mobilya-atolyesi','trafo-merkezi','kutuphane','sinema','haber-ajansi','banka','sigorta','borsa-panosu',
        'hastane-kayit','otel','yemek-siparis-platformu','sehir-uygulamasi')),
    district_slug        text        NOT NULL CHECK (district_slug IN ('carsi','liman','atolyeler','kampus','finans-bolgesi','veri-vadisi','bulut-tepesi')),
    level                smallint    NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
    upgrade_to           smallint    CHECK (upgrade_to BETWEEN 2 AND 5),                       -- ödenmiş ama kodu henüz geçmemiş yükseltme (İş Emri L{n+1} açık)
    -- 'satilik' arsanın durumudur; tapu alınana kadar işletme satırı yoktur. Satır ilk yazıldığında 'kapali' (Kapalı — yazılım bekliyor).
    status               text        NOT NULL DEFAULT 'kapali' CHECK (status IN ('kapali','deneme','acik','kararmis')),
    display_name         text        CHECK (char_length(display_name) BETWEEN 3 AND 24),      -- 200 B; moderasyondan geçer
    street_id            uuid,                                                                 -- world.streets (aynı şema, esnek bağ)
    parcel_slot          smallint    CHECK (parcel_slot BETWEEN 1 AND 6),
    deed_tx_id           uuid        NOT NULL,                                                 -- Tapu'nun defter işlemi
    active_submission_id uuid,                                                                 -- çalışan kod sürümü (challenge.submissions; bölümlü → FK yok)
    active_pe_sha256     bytea       CHECK (octet_length(active_pe_sha256) = 32),               -- derlenmiş PE ve kaynak nesne deposunda içerik adresli saklanır
    active_source_sha256 bytea       CHECK (octet_length(active_source_sha256) = 32),           -- "kodu dışa aktar" ve Vitrin için (bölüm silinse de kaybolmaz)
    opened_at            timestamptz,
    status_since         timestamptz NOT NULL DEFAULT now(),
    defense_retry_at     timestamptz,                                                          -- başarısız Savunma +24 saat
    version              integer     NOT NULL DEFAULT 1,
    created_at           timestamptz NOT NULL DEFAULT now(),
    UNIQUE (owner_id, kind),                                                                   -- her türden 1 (KANON §4)
    CHECK (status = 'kapali' OR opened_at IS NOT NULL),
    CHECK (upgrade_to IS NULL OR upgrade_to = level + 1)
);
CREATE INDEX businesses_live_ix   ON world.businesses (status) WHERE status IN ('deneme','acik');
CREATE INDEX businesses_street_ix ON world.businesses (street_id) WHERE street_id IS NOT NULL;

CREATE TABLE world.business_vaults (
    business_id   uuid          PRIMARY KEY REFERENCES world.businesses(id) ON DELETE CASCADE,
    rate_per_hour numeric(14,6) NOT NULL DEFAULT 0 CHECK (rate_per_hour >= 0),                 -- günlük Bayt ÷ 24
    balance_t0    numeric(14,4) NOT NULL DEFAULT 0 CHECK (balance_t0 >= 0),                    -- t0 anındaki kasa (kesirli)
    t0            timestamptz   NOT NULL DEFAULT now(),
    cap_hours     smallint      NOT NULL DEFAULT 8 CHECK (cap_hours IN (8, 12)),               -- 8 sa (KANON); 12 sa Büyük Kasa (B2 önerisi)
    version       bigint        NOT NULL DEFAULT 0
);
```

*Not.* Slot tavanı `1 + ⌊seviye/6⌋` oyuncunun seviyesine bağlı olduğundan `CHECK` ile ifade edilemez; komut işleyicisi oyuncu kilidi altında kontrol eder (§9.3) ve gece tutarlılık denetimi ihlal arar. Kasa, sık güncellendiği için ayrı tablodadır.

#### 4.3.13 `world.business_runs`

```sql
CREATE TABLE world.business_runs (
    business_id     uuid          NOT NULL REFERENCES world.businesses(id),
    run_date        date          NOT NULL,                                 -- iş günü (04:00 TR'de başlar)
    revision        smallint      NOT NULL DEFAULT 1 CHECK (revision BETWEEN 1 AND 6),   -- gün içi yeniden hesap: en çok 5 (B7 önerisi)
    seed            bytea         NOT NULL CHECK (octet_length(seed) = 8),
    traffic_count   smallint      NOT NULL CHECK (traffic_count > 0),
    player_tl       bigint        NOT NULL CHECK (player_tl >= 0),
    reference_tl    bigint        NOT NULL CHECK (reference_tl >= 0),
    capped_tl       bigint        NOT NULL,
    status_factor   numeric(3,2)  NOT NULL CHECK (status_factor IN (0, 0.5, 1.0)),   -- kararmış 0 · deneme 0,5 · açık 1
    daily_bayt      numeric(14,4) NOT NULL CHECK (daily_bayt >= 0),
    complaint       text          CHECK (complaint IN ('fazla_ucret','eksik_ucret','hata_veriyor')),
    submission_id   uuid,
    pe_sha256       bytea,
    harness_version text          NOT NULL,
    sandbox_job_id  uuid,
    computed_at     timestamptz   NOT NULL DEFAULT now(),
    PRIMARY KEY (business_id, run_date, revision),
    CHECK (capped_tl = LEAST(player_tl, reference_tl))                        -- referans tavanı veri düzeyinde değişmez
) PARTITION BY RANGE (run_date);
CREATE TABLE world.business_runs_2026_11 PARTITION OF world.business_runs
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE INDEX business_runs_date_ix ON world.business_runs (run_date);
```

*Not.* Aylık bölüm; birincil anahtar bölüm anahtarını (`run_date`) içerir. `revision` gün içi yeniden hesabı sayar (kod güncellemesi); en çok 5 ek hesap **(B7 önerisi)**.

#### 4.3.14 `challenge.challenges`

```sql
CREATE TABLE challenge.challenges (
    id            text        NOT NULL CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*(-L[1-5])?$'),     -- 'otopark-L1', 'kargo-deposu-L1'
    version       integer     NOT NULL CHECK (version >= 1),
    kind          text        NOT NULL CHECK (kind IN ('isletme','gorev','sinav','hata_bildirimi')),
    business_kind text,
    level         smallint    CHECK (level BETWEEN 1 AND 5),
    tier          smallint    NOT NULL CHECK (tier BETWEEN 1 AND 4),
    spec          jsonb       NOT NULL,                                                         -- B5 Challenge Spec, olduğu gibi (alanlar Türkçe)
    spec_hash     bytea       NOT NULL CHECK (octet_length(spec_hash) = 32),
    reference_ref text        NOT NULL,                                                         -- nesne deposu anahtarı: derlenmiş referans çözüm (yalnızca sunucu)
    public_tests  smallint    NOT NULL, hidden_tests smallint NOT NULL, seeded_tests smallint NOT NULL,
    reward_xp     integer     NOT NULL DEFAULT 0 CHECK (reward_xp >= 0),
    reward_bayt   integer     NOT NULL DEFAULT 0 CHECK (reward_bayt >= 0),
    status        text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','retired')),
    is_current    boolean     NOT NULL DEFAULT false,
    published_at  timestamptz,
    PRIMARY KEY (id, version),
    CHECK (NOT is_current OR status = 'published')
);
CREATE UNIQUE INDEX challenges_current_uq ON challenge.challenges (id) WHERE is_current;
```

*Not.* `spec`, B5'in Challenge Spec JSON'udur; B7 alanlarını yorumlamaz, yalnızca üst düzey meta kolonlarını indeksler. Oyuncu API'si `spec`'ten `hidden_tests` ve `seeded_tests` içeriğini **sunucuda** ayıklayarak döndürür (§5.4, örnek 10).

#### 4.3.15 `challenge.submissions`

```sql
CREATE TABLE challenge.submissions (
    id                uuid         NOT NULL DEFAULT uuidv7(),
    created_at        timestamptz  NOT NULL DEFAULT now(),
    player_id         uuid         NOT NULL,
    challenge_id      text         NOT NULL,
    challenge_version integer      NOT NULL,
    context_type      text         NOT NULL CHECK (context_type IN ('gorev','isletme','sinav','hata_bildirimi','denetim')),
    context_id        uuid,
    source_code       text         NOT NULL CHECK (octet_length(source_code) <= 32768),
    source_sha256     bytea        NOT NULL CHECK (octet_length(source_sha256) = 32),
    pe_sha256         bytea        CHECK (octet_length(pe_sha256) = 32),                         -- derlenmiş PE (içerik adresli, nesne deposu)
    pe_ref            text,
    roslyn_version    text,
    seed              bytea        NOT NULL CHECK (octet_length(seed) = 8),                      -- tohumlu testler için (§8.7)
    status            text         NOT NULL DEFAULT 'queued'
                      CHECK (status IN ('queued','running','done','compile_error','policy_violation','failed_internal','canceled')),
    tests_passed      smallint, tests_total smallint, hidden_passed smallint, hidden_total smallint,
    summary           jsonb,
    telemetry         jsonb        NOT NULL DEFAULT '{}',                                        -- {paste_count, typing_ms, key_to_submit_ms}
    similarity        numeric(4,3) CHECK (similarity BETWEEN 0 AND 1),                           -- AST benzerliği (KANON §9: > 0,95 → Savunma zorunlu)
    sandbox_job_id    uuid,
    duration_ms       integer, cpu_ms integer, peak_mem_mb smallint,
    idempotency_key   text         NOT NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);
CREATE TABLE challenge.submissions_2026_11 PARTITION OF challenge.submissions
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE INDEX submissions_player_ix   ON challenge.submissions (player_id, challenge_id, created_at DESC);
CREATE INDEX submissions_context_ix  ON challenge.submissions (context_id, created_at DESC) WHERE context_id IS NOT NULL;
CREATE INDEX submissions_pending_ix  ON challenge.submissions (created_at) WHERE status IN ('queued','running');
```

*Not.* Kaynak kod 32 KB ile sınırlıdır. `seed` tohumlu testlerin tohumudur (§8.7); `telemetry` yapıştırma sayısı ve yazma süresini taşır (KANON §9 kopya kuralı). AST parmak izi ayrı tablodadır.

#### 4.3.16 `market.items` + `market.inventory_items`

```sql
CREATE TABLE market.items (
    sku          text        PRIMARY KEY CHECK (sku ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    name         text        NOT NULL,
    category     text        NOT NULL CHECK (category IN ('kiyafet','aksesuar','emote','oda_esyasi','kaplama','tabela','islevsel','konfor','nisan')),
    rarity       text        NOT NULL CHECK (rarity IN ('siradan','sik','nadir','premium','nisan')),
    price_bayt   integer     CHECK (price_bayt > 0),
    price_cip    integer     CHECK (price_cip > 0),
    series_limit integer     CHECK (series_limit > 0),                                      -- numaralı seri: #137/500
    status       text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','retired')),
    -- KANON §4/§8: Çip yalnızca Premium'da; Nişan satılmaz; Bayt rafları yalnızca Bayt.
    CHECK (rarity <> 'premium' OR (price_cip IS NOT NULL AND price_bayt IS NULL)),
    CHECK (rarity <> 'nisan'   OR (price_cip IS NULL     AND price_bayt IS NULL)),
    CHECK (rarity IN ('premium','nisan') OR (price_bayt IS NOT NULL AND price_cip IS NULL))
);

CREATE TABLE market.inventory_items (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    player_id     uuid        NOT NULL REFERENCES player.players(id) ON DELETE RESTRICT,
    sku           text        NOT NULL REFERENCES market.items(sku),
    quantity      integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),                      -- tüketilebilir eşya (Seri Dondurucu) için >1
    serial_no     integer     CHECK (serial_no > 0),
    acquired_via  text        NOT NULL CHECK (acquired_via IN ('bayt','cip','odul','nisan','baslangic')),
    purchase_id   uuid,
    equipped_slot text        CHECK (equipped_slot ~ '^[a-z_]{2,16}$'),                      -- Dolap yuvaları: B1 §7.2 adları
    acquired_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE (player_id, sku)
);
CREATE UNIQUE INDEX inventory_equipped_uq ON market.inventory_items (player_id, equipped_slot) WHERE equipped_slot IS NOT NULL;
CREATE INDEX        inventory_player_ix   ON market.inventory_items (player_id);
```

*Not.* Çip/Bayt/Nişan kuralları (KANON §4, §8) `CHECK` ile şemadadır: yanlış fiyatlı ya da Çip'le satılan bir Bayt eşyası eklenemez.

#### 4.3.17 `quest.quests` + `quest.quest_progress`

```sql
CREATE TABLE quest.quests (
    id           text        PRIMARY KEY CHECK (id ~ '^[a-z0-9]+([-.][a-z0-9]+)*$'),         -- kimlik ve katalog: B6
    type         text        NOT NULL CHECK (type IN ('siralama','tamamlama','sifirdan','hata_bildirimi','is_emri','semt_sinavi','gunluk_tekrar','lonca_gorevi')),
    tier         smallint    NOT NULL CHECK (tier BETWEEN 1 AND 4),
    lesson_id    text,
    challenge_id text,
    licence_kind text,                                                                      -- hangi işletme Ruhsatı'na sayılır ('otopark')
    licence_part smallint    CHECK (licence_part BETWEEN 1 AND 3),                          -- 3 görev = 1 Ruhsat
    reward_xp    integer     NOT NULL CHECK (reward_xp >= 0),
    reward_bayt  integer     NOT NULL CHECK (reward_bayt >= 0),
    repeatable   boolean     NOT NULL DEFAULT false,
    status       text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','retired')),
    version      integer     NOT NULL DEFAULT 1,
    CHECK ((licence_kind IS NULL) = (licence_part IS NULL))
);

CREATE TABLE quest.quest_progress (
    player_id          uuid        NOT NULL REFERENCES player.players(id),
    quest_id           text        NOT NULL REFERENCES quest.quests(id),
    state              text        NOT NULL DEFAULT 'locked' CHECK (state IN ('locked','available','in_progress','completed')),
    attempts           integer     NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    best_submission_id uuid,
    first_completed_at timestamptz,
    reward_tx_id       uuid        UNIQUE,                                                  -- bir ödül işlemi yalnızca bir görev kaydına bağlanır
    updated_at         timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (player_id, quest_id),
    CHECK (state <> 'completed' OR first_completed_at IS NOT NULL)
);
CREATE INDEX quest_progress_open_ix ON quest.quest_progress (player_id) WHERE state IN ('available','in_progress');
```

*Not.* `licence_kind/part` "3 görev = 1 Ruhsat" kuralıdır. `reward_tx_id` benzersizliği bir ödül işleminin iki görev kaydına bağlanmasını engeller; "tekrar 0" kuralını defterdeki doğal anahtar (`qr:{oyuncu}:{görev}`) ayrıca korur.

#### 4.3.18 `social.chat_reports`

```sql
CREATE TABLE social.chat_reports (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    reporter_id   uuid        NOT NULL REFERENCES player.players(id),
    reported_id   uuid        NOT NULL REFERENCES player.players(id),
    message_id    uuid        NOT NULL,                                                      -- social.chat_messages bölümlü: FK yok
    channel_kind  text        NOT NULL CHECK (channel_kind IN ('sahne','oda','dm')),
    channel_key   text        NOT NULL,
    excerpt       text        NOT NULL CHECK (char_length(excerpt) <= 200),                  -- rapor anındaki kanıt kopyası
    context       jsonb       NOT NULL DEFAULT '[]',                                         -- önceki 5 mesajın kanıt kopyası
    reason        text        NOT NULL CHECK (reason IN ('hakaret','kufur','kisisel_veri','taciz','spam','uygunsuz_ad','diger')),
    state         text        NOT NULL DEFAULT 'open' CHECK (state IN ('open','auto_hidden','in_review','actioned','dismissed')),
    reviewer_id   uuid,
    action        text        CHECK (action IN ('none','warn','mute_24h','mute_7d','ban')),
    created_at    timestamptz NOT NULL DEFAULT now(),
    decided_at    timestamptz,
    UNIQUE (reporter_id, message_id),                                                        -- aynı kişi aynı mesajı bir kez bildirir
    CHECK (reporter_id <> reported_id),
    CHECK (state NOT IN ('actioned','dismissed') OR decided_at IS NOT NULL)
);
CREATE INDEX chat_reports_queue_ix    ON social.chat_reports (created_at) WHERE state IN ('open','auto_hidden','in_review');
CREATE INDEX chat_reports_message_ix  ON social.chat_reports (message_id);                   -- 3 farklı bildiren → otomatik gizle
CREATE INDEX chat_reports_reported_ix ON social.chat_reports (reported_id, created_at DESC);
```

*Not.* `excerpt` ve `context` rapor anında alınan kanıt kopyasıdır: mesaj bölümü 90 gün sonra silinse de vaka kanıtı kalır. Aynı mesaja 3 farklı bildiren → mesaj `auto_hidden` olur ve insan kuyruğuna düşer (VİZYON §9).


### 4.4 ERD — çekirdek varlıklar ve ilişkiler

ERD, 16 çekirdek varlığı gösterir (SVG'yi başka ekip çizer; §15 diyagram 2 modül bağımlılıklarını, bu bölüm veri ilişkilerini verir). Kutular modülüne göre renklendirilir; **sert** ilişki gerçek yabancı anahtardır (düz çizgi), **yumuşak** ilişki yalnızca kimlik saklar (kesik çizgi; bölümlü tablo ya da modüller arası bağ).

**Kutular (16)**

| # | Kutu | Tablo | Modül (renk grubu) | Kutuda gösterilecek anahtar kolonlar |
|---|---|---|---|---|
| E1 | Player | `player.players` | Oyuncu | `id`, `handle`, `birth_year`, `status`, `guardian_state` |
| E2 | PhoneIdentity | `identity.phone_identities` | Auth | `player_id`, `phone_hash`, `phone_enc`, `status` |
| E3 | GuardianConsent | `identity.guardian_consents` | Auth | `player_id`, `token_hash`, `status`, `expires_at` |
| E4 | Wallet | `economy.wallets` | Ekonomi | `owner_id`, `currency`, `balance`, `track_balance` |
| E5 | LedgerTransaction | `economy.ledger_transactions` | Ekonomi | `tx_type`, `idempotency_key`, `business_day`, `reversal_of` |
| E6 | LedgerEntry | `economy.ledger_entries` | Ekonomi | `tx_id`, `wallet_id`, `currency`, `amount` |
| E7 | Lesson | `learning.lessons` | Eğitim | `id` (`1.1`), `district_slug`, `tier`, `version` |
| E8 | LessonAttempt | `learning.lesson_attempts` | Eğitim | `player_id`, `lesson_id`, `attempt_no`, `state` |
| E9 | GradingSubmission | `learning.grading_submissions` | Eğitim | `player_id`, `question_id`, `status`, `score`, `answer_hash` |
| E10 | Challenge | `challenge.challenges` | Challenge | `id` (`otopark-L1`), `version`, `kind`, `is_current` |
| E11 | Submission | `challenge.submissions` | Challenge | `player_id`, `challenge_id`, `status`, `pe_sha256`, `seed` |
| E12 | Business | `world.businesses` (+ `business_vaults`) | Dünya | `owner_id`, `kind`, `level`, `status`, `deed_tx_id` |
| E13 | BusinessRun | `world.business_runs` | Dünya | `business_id`, `run_date`, `capped_tl`, `daily_bayt` |
| E14 | QuestProgress | `quest.quests` + `quest.quest_progress` | Görev | `player_id`, `quest_id`, `state`, `reward_tx_id` |
| E15 | InventoryItem | `market.items` + `market.inventory_items` | Pazar | `player_id`, `sku`, `rarity`, `equipped_slot` |
| E16 | ChatReport | `social.chat_reports` | Sosyal | `reporter_id`, `reported_id`, `message_id`, `state` |

**İlişki satırları**

| # | İlişki | Kardinalite | FK adı (PostgreSQL varsayılanı) | Tür / silme | Not |
|---|---|---|---|---|---|
| R1 | E1 Player —1:1→ E2 PhoneIdentity | 1 : 0..1 | `phone_identities_player_id_fkey` | sert, RESTRICT | `UNIQUE (player_id)`; numara serbest bırakılınca bağ kopar |
| R2 | E1 Player —1:N→ E3 GuardianConsent | 1 : 0..N | `guardian_consents_player_id_fkey` | sert | Aynı anda en çok bir `pending` (kısmi benzersiz indeks) |
| R3 | E1 Player —1:N→ E4 Wallet | 1 : 2 | `wallets_owner_id_fkey` | sert, RESTRICT | Her oyuncunun BAYT ve CIP cüzdanı; sistem cüzdanlarında `owner_id` boş |
| R4 | E4 Wallet —1:N→ E6 LedgerEntry | 1 : 0..N | `ledger_entries_wallet_id_currency_fkey` | sert (bileşik) | `(wallet_id, currency)`: para birimi cüzdanla tutarlı |
| R5 | E5 LedgerTransaction —1:N→ E6 LedgerEntry | 1 : 2..N | `ledger_entries_tx_id_fkey` | sert | Ertelenmiş tetikleyici: her para biriminde `SUM(amount) = 0` |
| R6 | E5 LedgerTransaction —1:N→ E5 (kendine) | 1 : 0..1 | `ledger_transactions_reversal_of_fkey` | sert | `REVERSAL` işlemi asıl işleme işaret eder |
| R7 | E1 Player —1:N→ E8 LessonAttempt | 1 : 0..N | `lesson_attempts_player_id_fkey` | sert | |
| R8 | E7 Lesson —1:N→ E8 LessonAttempt | 1 : 0..N | `lesson_attempts_lesson_id_fkey` | sert | `UNIQUE (player_id, lesson_id, attempt_no)` |
| R9 | E1 Player —1:N→ E9 GradingSubmission | 1 : 0..N | — (`player_id`) | **yumuşak** (bölümlü) | Silmede anonimleştirme işi temizler |
| R10 | E8 LessonAttempt —1:N→ E9 GradingSubmission | 1 : 0..N | — (`context_id`) | **yumuşak** | `context_type='ders'`; Savunma/itiraz için başka bağlamlar |
| R11 | E10 Challenge —1:N→ E11 Submission | 1 : 0..N | — (`challenge_id`, `challenge_version`) | **yumuşak** | Sürüm sabitlenir; yeni sürüm eski gönderimleri bozmaz |
| R12 | E1 Player —1:N→ E11 Submission | 1 : 0..N | — (`player_id`) | **yumuşak** (bölümlü) | |
| R13 | E1 Player —1:N→ E12 Business | 1 : 0..20 | `businesses_owner_id_fkey` | sert, RESTRICT | `UNIQUE (owner_id, kind)`: her türden 1; slot tavanı komutta |
| R14 | E12 Business —1:1→ BusinessVault | 1 : 1 | `business_vaults_business_id_fkey` | sert, CASCADE | PK = FK |
| R15 | E12 Business —1:N→ E13 BusinessRun | 1 : 0..N | `business_runs_business_id_fkey` | sert | PK `(business_id, run_date, revision)` |
| R16 | E12 Business —N:1→ E11 Submission | N : 0..1 | — (`active_submission_id`) | **yumuşak** | Çalışan kod; kaynak/PE nesne deposunda `sha256` ile |
| R17 | E12 Business —N:1→ E5 LedgerTransaction | N : 1 | — (`deed_tx_id`) | **yumuşak** | Tapu'nun defter işlemi (denetim izi) |
| R18 | E1 Player —N:M→ Quest (E14 üzerinden) | N : M | `quest_progress_player_id_fkey`, `quest_progress_quest_id_fkey` | sert | PK `(player_id, quest_id)` |
| R19 | E14 QuestProgress —N:1→ E5 LedgerTransaction | 0..1 : 1 | — (`reward_tx_id`) | **yumuşak** | `UNIQUE (reward_tx_id)` |
| R20 | E1 Player —1:N→ E15 InventoryItem | 1 : 0..N | `inventory_items_player_id_fkey` | sert, RESTRICT | `UNIQUE (player_id, sku)` |
| R21 | Item —1:N→ E15 InventoryItem | 1 : 0..N | `inventory_items_sku_fkey` | sert | `items.rarity` fiyat/para birimi kurallarını belirler |
| R22 | E1 Player —1:N→ E16 ChatReport (bildiren) | 1 : 0..N | `chat_reports_reporter_id_fkey` | sert | |
| R23 | E1 Player —1:N→ E16 ChatReport (bildirilen) | 1 : 0..N | `chat_reports_reported_id_fkey` | sert | `CHECK (reporter_id <> reported_id)` |
| R24 | E1 Player —1:N→ E1 (davet eden) | 1 : 0..N | `players_referred_by_fkey` | sert | Davet ödülü yalnızca davet edilenin ilk Bayt'ından sonra (B2 §5.2) |

```text
                         ┌────────────── E2 PhoneIdentity
                         ├────────────── E3 GuardianConsent
                         ├─ 1:2 ───────  E4 Wallet ─1:N─ E6 LedgerEntry ─N:1─ E5 LedgerTransaction ◄─┐
          E1 Player ─────┤                                                                           │(deed, reward)
                         ├─ 1:N ───────  E8 LessonAttempt ─N:1─ E7 Lesson                            │
                         ├╌ 1:N ╌╌╌╌╌╌  E9 GradingSubmission   (yumuşak)                             │
                         ├╌ 1:N ╌╌╌╌╌╌  E11 Submission ◄╌N:1╌ E10 Challenge   (yumuşak)             │
                         ├─ 1:N ───────  E12 Business ─1:N─ E13 BusinessRun ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
                         ├─ N:M ───────  E14 QuestProgress ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘
                         ├─ 1:N ───────  E15 InventoryItem ─N:1─ Item
                         └─ 1:N (×2) ──  E16 ChatReport
```

---

## 5. API

### 5.1 Sözleşme kuralları

**Taban ve adlandırma (talimat §3).** Taban yol `/v1`; kaynak adları İngilizce çoğul, `kebab-case` (`/v1/lessons/{lessonId}`, `/v1/grading/submissions`, `/v1/businesses/{businessId}/runs`); kimlik doğrulama `Authorization: Bearer <JWT>`; gerçek zamanlı hub'lar `/hubs/world` ve `/hubs/chat` (§6). Alt kaynak yalnızca sahiplik açıksa iç içe yazılır (`/businesses/{id}/runs`); aksi hâlde düz kaynak ve filtre kullanılır. Eylemler fiil değil *olay kaynağı* olarak modellenir: "kasa topla" bir `POST …/vault/collections` kaydı oluşturur, "tapu al" `POST /businesses` ile bir işletme oluşturur. Bu, idempotency ve denetim için doğal bir kayıt satırı bırakır.

**Alan adları.** JSON alanları `camelCase`'tir. İki istisna vardır ve bilerek korunur: Kurul kartı (B3) ve Challenge Spec (B5) kendi sahiplerinin alan adlarıyla (`puan`, `olcutler`, `geri_bildirim`, `public_tests`, `musteri_istegi` …) aynen taşınır; B7 bunları yeniden adlandırmaz. Zaman damgaları ISO 8601 UTC (`2026-11-02T21:14:03Z`); iş günü tarihleri `YYYY-MM-DD` (TR iş günü); para tamsayıdır (`bayt`, `cip`, `tl`); kimlikler UUIDv7 ya da içerik slug'ıdır.

**Başlıklar.** İstemci her istekte `X-Client-Version: web/1.4.2` gönderir; sunucu `X-Request-Id` üretir/yansıtır ve W3C `traceparent`'ı sürdürür. `Idempotency-Key`, `If-Match` (iyimser eşzamanlılık) ve `Accept-Language: tr` desteklenir. Yanıtlarda `Cache-Control` açıkça yazılır: oyuncuya özel yanıtlar `private, no-store`, katalog ve içerik yanıtları `public, max-age` + `ETag`.

**Sürümleme.** Ana sürüm yoldadır. *Eklemeli* değişiklik (yeni alan, yeni uç nokta, yeni enum değeri) sürümü değiştirmez; istemciler bilinmeyen alanı ve bilinmeyen enum değerini yok sayar (B8 sözleşmesi). *Kırıcı* değişiklik `/v2` olarak paralel yayınlanır ve en az 8 hafta (PWA'nın eski sürümlerinin ömrü) birlikte yaşar; eski uç nokta `Deprecation` ve `Sunset` başlıklarıyla işaretlenir. Asgari istemci sürümü altındakiler `426 Upgrade Required` (`CLIENT_OUTDATED`) alır; istemci service worker'ı güncelleyip sayfayı yeniler. OpenAPI 3.1 dosyası `GET /v1/openapi.json`'dan yayınlanır; B8'in TypeScript tipleri buradan üretilir; sözleşme testleri (Schemathesis) CI'da koşar.

**Idempotency-Key kuralı.** Durum değiştiren ve *para, XP, envanter ya da kuyruk işi* üreten her `POST` için `Idempotency-Key` zorunludur (UUID/ULID, 16–64 karakter); eksikse `400 IDEMPOTENCY_KEY_REQUIRED`. Davranış:

1. Anahtar `(oyuncu, anahtar)` çifti olarak `platform.idempotency_keys`'e `in_progress` yazılır (`ON CONFLICT DO NOTHING`); istek gövdesinin SHA-256'sı saklanır.
2. Aynı anahtar, aynı gövde, işlem sürerken gelirse `409 IDEMPOTENCY_IN_PROGRESS` + `Retry-After: 1`.
3. Aynı anahtar, aynı gövde, işlem bittiyse **aynı yanıt** (durum kodu ve gövde) tekrarlanır; başlık `Idempotent-Replayed: true`.
4. Aynı anahtar, farklı gövde → `422 IDEMPOTENCY_KEY_REUSE`.
5. Kayıt 24 saat tutulur. İstemci anahtarı *niyet* başına bir kez üretir (düğmeye basma), yeniden denemede **aynısını** gönderir.
6. İkinci savunma hattı defterdedir: doğal anahtar (`qr:{oyuncu}:{görev}`, `deed:{oyuncu}:{tür}`, `vault:{işletme}:{toplama kimliği}`) `ledger_transactions.idempotency_key` benzersizliğiyle aynı ödülün iki kez yazılmasını imkânsız kılar (§9.5).

**Sayfalama.** Yalnızca *imleç* (cursor) tabanlıdır, `OFFSET` yoktur: `?limit=1..100` (varsayılan 20) ve `?cursor=<opak>`; yanıt `{ "items": [...], "nextCursor": "…" | null }`. Sıralama kararlıdır (`created_at DESC, id DESC`); imleç son satırın sıralama anahtarını base64url ile taşır. Liderlik ve lig panoları sayfalanmaz: `top` (ilk N) ve `around=me` (çevremdeki 7 satır) sunar.

**Yetki modeli.** Roller: `oyuncu`, `veli` (SMS belirteciyle, oturumsuz), `moderator`, `icerik`, `yonetici`, `servis` (iç iş hesapları), `webhook` (imza doğrulamalı dış kaynak). Rol dışında *niteleyiciler* JWT talebinden okunur: `age_band` (`15-17`, `18+`; v1'de `13-15`, `16-17`, bkz. §11.5), `par` (`none|pending|granted`). Her `{id}` içeren uç nokta **nesne düzeyinde yetki** denetler (BOLA): kaynağın sahibi/izinli olup olmadığı komut işleyicisinde kontrol edilir, "ID'yi bilmek erişim hakkı değildir".

**Hız sınırı.** Üç katman: (1) *kenar* (Cloudflare): IP başına 600 istek/dk ve ASN anomali kuralları; Türkiye mobil operatörleri CGNAT kullandığından IP sınırları cömert, **kimlik sınırları** sıkıdır; (2) *API* içinde Redis üzerinde Lua ile atomik jeton kovası (kimlik/IP/uç nokta sınıfı); (3) *iş kuralı* sınırları (kota, günlük tavan) veri düzeyinde. Aşımda `429` + `Retry-After` + `RateLimit-Limit/Remaining/Reset` başlıkları.

| Politika | Anahtar | Limit | Uygulandığı uç noktalar |
|---|---|---|---|
| `RL-OTP-SEND` | telefon özeti | 5 gönderim/saat **(B7 önerisi)**; iki gönderim arası ≥ 60 sn (KANON §6) | OTP iste |
| `RL-OTP-SEND-IP` | IP + cihaz | 30/saat/IP; 10/gün/cihaz; Turnstile eşiği (§11.3) | OTP iste |
| `RL-OTP-VERIFY` | telefon özeti | 5 yanlış deneme/saat (KANON §6); kod başına 3 | OTP doğrula |
| `RL-AUTH` | IP | 60/dk | kayıt, yenileme, veli kararı |
| `RL-PUBLIC` | IP | 120/dk | herkese açık GET (katalog, aydınlatma, sağlık) |
| `RL-READ` | oyuncu | 120/dk, patlama 40 | GET'ler |
| `RL-WRITE` | oyuncu | 60/dk | genel POST/PUT/PATCH/DELETE |
| `RL-GRADE` | oyuncu | 10/dk; günlük 30 AI etkileşimi kotası (KANON §9) kuyruk-erteleme olarak, 429 değil | `grading/*` |
| `RL-RUN` | oyuncu + IP | oyuncu 10/dk (patlama 5), 300/gün; IP 120/dk | `challenges/*/submissions`, Savunma |
| `RL-MONEY` | oyuncu | 20/dk | satın al, kasa topla, yükselt, takma ad değiştir |
| `RL-SOCIAL` | oyuncu | 30/dk | arkadaş isteği, davet, engelle |
| `RL-REPORT` | oyuncu | 20/gün | sohbet şikâyeti |
| `RL-ADMIN` | yönetici | 300/dk | `admin/*` |
| `RL-WEBHOOK` | kaynak IP izin listesi + HMAC | 600/dk | PSP/SMS bildirimleri |

### 5.2 Hata formatı (RFC 9457) ve hata kodları

Tüm hatalar `application/problem+json` döner. RFC 9457 alanları (`type`, `title`, `status`, `detail`, `instance`) Türkçe, oyuncuya gösterilebilir metinle doldurulur; makine tarafı uzantılarla taşınır: `code` (kararlı, `SCREAMING_SNAKE`), `traceId`, `errors[]` (doğrulama: `{pointer, detail}`), `retryAfterSec`, `requires{}` (ön koşul: seviye, ders, Ruhsat, bakiye). `type` URI'si `https://api.kodkent.com/problems/<slug>` biçimindedir ve bir açıklama sayfasına çözülür. İç hata ayrıntısı (yığın, SQL) yanıta **asla** girmez; yalnızca `traceId` bulunur.

```json
{
  "type": "https://api.kodkent.com/problems/insufficient-funds",
  "title": "Bakiye yetersiz",
  "status": 402,
  "detail": "Tapu için 300 B gerekiyor, cüzdanında 240 B var.",
  "instance": "/v1/businesses",
  "code": "INSUFFICIENT_FUNDS",
  "requires": { "currency": "BAYT", "required": 300, "available": 240 },
  "traceId":"00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
}
```

| `code` | HTTP | Ne zaman | Oyuncu metni (özet) |
|---|---|---|---|
| `VALIDATION_FAILED` | 422 | Şema/aralık ihlali (`errors[]` dolu) | "Şu alanı düzelt: …" |
| `UNAUTHENTICATED` / `TOKEN_EXPIRED` | 401 | Belirteç yok/süresi dolmuş | "Oturum süresi doldu." (istemci sessizce yeniler) |
| `FORBIDDEN` | 403 | Rol/nesne yetkisi yok | "Buna iznin yok." |
| `GUARDIAN_REQUIRED` | 403 | Veli onayı gerektiren özellik (serbest sohbet, Çip satın alma) | "Bu özellik için veli onayı bekleniyor." |
| `AGE_TOO_LOW` | 403 | 15 yaş altı | "KodKent 13 yaş ve üzeri içindir." |
| `DISTRICT_LOCKED` | 403 | Kilitli semtte kilitli eylem | "Liman: Çarşı Sınavı'ndan sonra açılıyor." |
| `LESSON_GATE` / `LICENCE_MISSING` / `LEVEL_TOO_LOW` | 403 | Ders Mührü, Ruhsat, seviye ön koşulu | `requires{}` ile neyin eksik olduğu |
| `NOT_FOUND` | 404 | Kaynak yok **ya da** görmeye yetkisiz (varlık sızdırılmaz) | "Bulunamadı." |
| `IDEMPOTENCY_IN_PROGRESS` / `IDEMPOTENCY_KEY_REUSE` / `IDEMPOTENCY_KEY_REQUIRED` | 409 / 422 / 400 | §5.1 | — |
| `VERSION_CONFLICT` | 412 | `If-Match` uyuşmadı (oda yerleşimi vb.) | "Başka yerde değişmiş; yenile." |
| `INSUFFICIENT_FUNDS` | 402 | Bakiye yetersiz | "N B gerekiyor." |
| `SLOT_LIMIT` | 409 | `1 + ⌊seviye/6⌋` işletme sınırı | "Sev. 6'da 2. işletmeni açabilirsin." |
| `ALREADY_OWNED` / `PRICE_CHANGED` | 409 | Envanter/fiyat çakışması | "Bu eşyaya zaten sahipsin." |
| `ATTEMPTS_EXHAUSTED` / `APPEAL_ALREADY_FILED` | 409 | Soru başına 2 deneme / 1 itiraz | "Bu soru için haklarını kullandın." |
| `VAULT_EMPTY` | 409 | Kasada toplanacak tam Bayt yok | "Kasada henüz tam bir Bayt birikmedi." |
| `SCENE_FULL` / `SCENE_LOCKED` | 409 | Oda/işletme içi kapasite dolu; Savunma ya da Semt Sınavı sırasında sahne değiştirme | "Dolu — 20/20. Sahibine Alkış bırakabilirsin." |
| `REAUTH_REQUIRED` | 401 | Silme, telefon değiştirme, veri indirme için OTP ile yeniden doğrulama | "Telefonuna gelen kodu gir." |
| `CLARIFICATION_REQUIRED` | 409 | İş Emri için < 4 netleştirme sorusu | "Önce müşteriye en az 4 soru sor." |
| `OTP_INVALID` / `OTP_EXPIRED` / `OTP_LOCKED` / `OTP_RESEND_TOO_SOON` | 422 / 410 / 423 / 429 | §11.1 | Kalan hak ve süre |
| `RATE_LIMITED` | 429 | §5.1 politikaları | "Biraz yavaşla; N sn sonra tekrar dene." |
| `CLIENT_OUTDATED` | 426 | Asgari istemci sürümü altı | "Uygulamayı yenile." |
| `SANDBOX_BUSY` | 503 | Kod kuyruğu eşik üstü (kabul edilmez) | "Atölye şu an yoğun; birkaç sn sonra dene." (nadir; normalde kuyruğa alınır) |
| `MAINTENANCE` | 503 | Planlı bakım | "Kısa bir bakım var." |
| `INTERNAL_ERROR` | 500 | Beklenmeyen hata | "Bir şeyler ters gitti (kod: traceId kısaltması)." |

### 5.3 Uç nokta kataloğu

Yetki sütunu: **genel** (oturumsuz), **oyuncu** (Bearer), **belirteç** (tek kullanımlık özel belirteç: kayıt, veli), **çerez** (yenileme çerezi), **mod / içerik / yön** (rol), **webhook** (imza). Hız sınırı politikaları §5.1'dedir. `15-17` işaretli uç noktalar (Yaş Kapısı v2: `15-17`, §11.5) `par` talebine göre sınırlanır. Tüm yollar `/v1` altındadır (sistem uç noktaları hariç).

| Yöntem | Yol | Amaç | Yetki | Limit |
|---|---|---|---|---|
| **Sistem** | | | | |
| GET | `/healthz`, `/readyz` (`/v1` dışı) | Canlılık / hazırlık | genel (iç ağ) | — |
| GET | `/v1/openapi.json` | OpenAPI 3.1 | genel | RL-PUBLIC |
| GET | `/v1/meta/client-config` | Asgari istemci sürümü, özellik bayrakları, bakım | genel | RL-PUBLIC |
| **Auth/OTP ve veli** | | | | |
| POST | `/v1/auth/otp/requests` | OTP iste (6 hane, 90 sn) | genel | RL-OTP-SEND, RL-OTP-SEND-IP |
| POST | `/v1/auth/otp/verifications` | OTP doğrula → oturum ya da kayıt belirteci | genel | RL-OTP-VERIFY |
| POST | `/v1/auth/registrations` | Hesabı tamamla (takma ad, doğum yılı, rızalar, veli telefonu) | belirteç | RL-AUTH |
| POST | `/v1/auth/tokens/refresh` | Erişim belirtecini yenile (döndürme) | çerez | RL-AUTH |
| POST | `/v1/auth/logout` | Oturumu kapat | oyuncu | RL-WRITE |
| GET | `/v1/auth/sessions` | Aktif cihaz ve oturumlar | oyuncu | RL-READ |
| DELETE | `/v1/auth/sessions/{sessionId}` | Bir cihaz oturumunu sonlandır | oyuncu | RL-WRITE |
| POST | `/v1/auth/phone-changes` | Telefon değiştir (eski + yeni numara OTP) | oyuncu | RL-OTP-SEND |
| POST | `/v1/players/me/guardian-consents` | Veliye onay SMS'ini yeniden gönder (7 günde 3) | oyuncu | RL-WRITE |
| GET | `/v1/guardian-consents/{token}` | Veli sayfası verisi (aydınlatma, çocuk takma adı) | belirteç | RL-PUBLIC |
| POST | `/v1/guardian-consents/{token}/decisions` | Veli onayı/reddi (veli OTP'si ile) | belirteç | RL-AUTH |
| POST | `/v1/guardian-consents/{token}/revocations` | Veli onayını geri çek | belirteç | RL-AUTH |
| **Oyuncu/Profil** | | | | |
| GET | `/v1/players/me` | Oturum sahibi özeti (seviye, bakiye, slot, bayraklar) | oyuncu | RL-READ |
| PATCH | `/v1/players/me` | Profil ve ayar güncelle (dil, gizlilik) | oyuncu | RL-WRITE |
| GET | `/v1/players/{playerId}` | Herkese açık profil | oyuncu | RL-READ |
| GET | `/v1/players/{playerId}/portfolio` | İşletme portföyü, Nişan'lar, Rozet Duvarı | oyuncu | RL-READ |
| GET | `/v1/handles/availability` | Takma ad uygunluğu (`?handle=`) | genel | 20/dk/IP |
| POST | `/v1/players/me/handle-changes` | Takma ad değiştir (500 B) | oyuncu | RL-MONEY |
| GET / PUT | `/v1/players/me/avatar` | Avatar oku / kaydet | oyuncu | RL-READ / RL-WRITE |
| PUT | `/v1/players/me/language-track` | Dil seçimi (C#) | oyuncu | RL-WRITE |
| POST | `/v1/language-waitlist` | "Yakında — haber ver" kaydı | oyuncu | RL-WRITE |
| **İlerleme** | | | | |
| GET | `/v1/players/me/progress` | XP, seviye, unvan, açılışlar | oyuncu | RL-READ |
| GET | `/v1/players/me/metro` | Metro Haritası durakları | oyuncu | RL-READ |
| GET | `/v1/players/me/streak` | Seri ve dondurma hakkı | oyuncu | RL-READ |
| POST | `/v1/players/me/streak/freezes` | Seri Dondurucu kullan | oyuncu | RL-MONEY |
| GET | `/v1/districts` | Semtler, kilit durumu (inşaat halinde / turist) | oyuncu | RL-READ |
| GET | `/v1/districts/{districtSlug}/gate` | Semt Sınavı kapı durumu | oyuncu | RL-READ |
| POST | `/v1/districts/{districtSlug}/exams` | Semt Sınavı başlat (20 dk) | oyuncu | RL-WRITE |
| **Eğitim ve Kurul** | | | | |
| GET | `/v1/lessons` | Ders listesi (`?district=`) | oyuncu | RL-READ |
| GET | `/v1/lessons/{lessonId}` | Ders içeriği (kartlar, Usta soruları) | oyuncu | RL-READ |
| POST | `/v1/lessons/{lessonId}/attempts` | Ders oturumu başlat | oyuncu | RL-WRITE |
| PATCH | `/v1/lesson-attempts/{attemptId}` | Kart ilerlemesi kaydet | oyuncu | RL-WRITE |
| POST | `/v1/lesson-attempts/{attemptId}/answers` | Deterministik soru cevabı (çoktan seçmeli, çıktı tahmini, sıralama) | oyuncu | RL-WRITE |
| POST | `/v1/lesson-attempts/{attemptId}/remediation-rounds` | Telafi Turu başlat (10 dk sonra) | oyuncu | RL-WRITE |
| POST | `/v1/grading/submissions` | Kurul'a cevap gönder (202) | oyuncu | RL-GRADE |
| GET | `/v1/grading/submissions/{submissionId}` | Kurul Kartı / durum | oyuncu | RL-READ |
| POST | `/v1/grading/submissions/{submissionId}/followups` | Usta takip sorusunu cevapla (en çok +10) | oyuncu | RL-GRADE |
| POST | `/v1/grading/submissions/{submissionId}/appeals` | İtiraz (soru başına 1, günde 3) | oyuncu | RL-GRADE |
| GET | `/v1/hints` | İpucu merdiveni (`?targetId=&level=pusula|fener|taslak|ornek`) | oyuncu | RL-READ |
| GET | `/v1/reviews/daily` | Günlük Tekrar: 5 soru | oyuncu | RL-READ |
| POST | `/v1/reviews/daily/answers` | Günlük Tekrar cevabı / tamamla | oyuncu | RL-WRITE |
| GET | `/v1/errors/translations/{csCode}` | CS koduna Türkçe açıklama | oyuncu | RL-READ |
| **Görev, Challenge ve kod** | | | | |
| GET | `/v1/quests` | Görev listesi ve durum | oyuncu | RL-READ |
| GET | `/v1/quests/{questId}` | Görev ayrıntısı | oyuncu | RL-READ |
| GET | `/v1/challenges/{challengeId}` | Challenge, oyuncu görünümü (gizli testsiz) | oyuncu | RL-READ |
| POST | `/v1/challenges/{challengeId}/submissions` | Kod gönder (202; kuyruk `code-run`) | oyuncu | RL-RUN |
| GET | `/v1/challenge-submissions/{submissionId}` | Derleme + test sonucu | oyuncu | RL-READ |
| POST | `/v1/businesses/{businessId}/clarifications` | Gereksinim Netleştirme: Müşteriye Sor | oyuncu | RL-WRITE |
| GET | `/v1/businesses/{businessId}/contract-card` | Sözleşme Kartı | oyuncu | RL-READ |
| POST | `/v1/businesses/{businessId}/defenses` | Savunma başlat (Kurul satır seçer) | oyuncu | RL-RUN |
| POST | `/v1/defenses/{defenseId}/answers` | Savunma cevabı (202) | oyuncu | RL-GRADE |
| GET | `/v1/defenses/{defenseId}` | Savunma sonucu (Açılış / Deneme) | oyuncu | RL-READ |
| GET | `/v1/bug-reports` | Hata Bildirimi dosyaları (günde 3) | oyuncu | RL-READ |
| POST | `/v1/bug-reports/{bugReportId}/fixes` | Düzeltme + 1 cümle neden gönder | oyuncu | RL-RUN |
| **İşletme, ekonomi ve dünya** | | | | |
| GET | `/v1/wallets/me` | Bayt/Çip bakiyesi | oyuncu | RL-READ |
| GET | `/v1/wallets/me/ledger` | Hareketler (imleç) | oyuncu | RL-READ |
| GET | `/v1/players/me/licences` | Ruhsat ilerlemesi | oyuncu | RL-READ |
| GET | `/v1/businesses/catalog` | 20 işletme: fiyat, kilit nedeni, slot | oyuncu | RL-READ |
| GET | `/v1/businesses` | Benim işletmelerim | oyuncu | RL-READ |
| POST | `/v1/businesses` | Tapu al (işletme oluştur) | oyuncu | RL-MONEY |
| GET | `/v1/businesses/{businessId}` | İşletme ayrıntısı (durum, seviye, kasa) | oyuncu | RL-READ |
| PATCH | `/v1/businesses/{businessId}` | Ad (200 B) ve Vitrin ayarı | oyuncu | RL-MONEY |
| POST | `/v1/businesses/{businessId}/upgrades` | Yükseltme satın al (L2–L5) | oyuncu | RL-MONEY |
| GET | `/v1/businesses/{businessId}/runs` | Günlük gelir kayıtları (imleç) | oyuncu | RL-READ |
| GET | `/v1/businesses/{businessId}/runs/{runDate}` | Gün detayı, şikâyet balonları | oyuncu | RL-READ |
| POST | `/v1/businesses/{businessId}/vault/collections` | Kasa topla | oyuncu | RL-MONEY |
| POST | `/v1/vault-collections` | Hepsini Topla (Sev. 12+) | oyuncu | RL-MONEY |
| GET | `/v1/businesses/{businessId}/vitrin` | Vitrin: kod + Savunma cevabı (L2+) | oyuncu | RL-READ |
| GET | `/v1/streets/{streetId}` | Ara Sokak ve parseller | oyuncu | RL-READ |
| GET | `/v1/world/map` | Şehir Haritası verisi (hedef işaretçisi, Satılık arsalar) | oyuncu | RL-READ |
| POST | `/v1/world/scenes/{sceneKey}/join-tickets` | Shard ayır, hub bileti al | oyuncu | RL-WRITE |
| GET | `/v1/world/led-feed` | LED pano anlık görüntüsü | oyuncu | RL-READ |
| GET | `/v1/world/meydan-question` | Saatlik Meydan Sorusu | oyuncu | RL-READ |
| POST | `/v1/world/meydan-question/answers` | Meydan Sorusu cevabı | oyuncu | RL-WRITE |
| POST | `/v1/payments/orders` | Çip siparişi oluştur (PSP) | oyuncu (`par` gerekli: 15-17) | RL-MONEY |
| GET | `/v1/payments/orders/{orderId}` | Sipariş durumu | oyuncu | RL-READ |
| POST | `/v1/payments/webhooks/{provider}` | PSP ödeme bildirimi | webhook | RL-WEBHOOK |
| **Oda ve ziyaret** | | | | |
| GET | `/v1/rooms/me` | Odam | oyuncu | RL-READ |
| PUT | `/v1/rooms/me/layout` | Eşya yerleşimini kaydet (`If-Match`) | oyuncu | RL-WRITE |
| PATCH | `/v1/rooms/me` | Oda izin modu | oyuncu | RL-WRITE |
| POST | `/v1/rooms/me/upgrades` | Daire / Çatı Katı (MVP+1) | oyuncu | RL-MONEY |
| GET | `/v1/rooms/{roomId}` | Oda içeriği (ziyaret) | oyuncu | RL-READ |
| GET | `/v1/visitor-books/{targetType}/{targetId}` | Ziyaretçi defteri (son 20) | oyuncu | RL-READ |
| POST | `/v1/applause` | Alkış ver (yer başına günde 1) | oyuncu | RL-SOCIAL |
| **Pazar ve envanter** | | | | |
| GET | `/v1/market/shelves` | Bayt rafları, Butik, Rütbe Rafı, haftalık rotasyon | oyuncu | RL-READ |
| GET | `/v1/market/items/{sku}` | Eşya ayrıntısı | oyuncu | RL-READ |
| POST | `/v1/market/purchases` | Satın al (Bayt ya da Çip) | oyuncu | RL-MONEY |
| GET | `/v1/inventory` | Envanter | oyuncu | RL-READ |
| PUT | `/v1/inventory/equipment` | Giyilenleri kaydet (Dolap) | oyuncu | RL-WRITE |
| **Sosyal ve sohbet** | | | | |
| GET | `/v1/friends` | Arkadaş listesi | oyuncu | RL-READ |
| POST | `/v1/friend-requests` | Arkadaşlık isteği (takma ad ya da kod) | oyuncu | RL-SOCIAL |
| PUT | `/v1/friend-requests/{requestId}` | Kabul / reddet | oyuncu | RL-SOCIAL |
| DELETE | `/v1/friends/{playerId}` | Arkadaşlıktan çıkar | oyuncu | RL-SOCIAL |
| GET | `/v1/friends/presence` | Çevrimiçi arkadaşlar ve konumları (izinli) | oyuncu | RL-READ |
| POST | `/v1/invites/redeem` | Davet kodunu kullan (iki tarafa 100 B, ilk Bayt sonrası) | oyuncu | RL-SOCIAL |
| GET | `/v1/invites/me` | Benim davet kodum ve durum | oyuncu | RL-READ |
| GET | `/v1/leagues/current` | Haftalık lig (kova, sıra) | oyuncu | RL-READ |
| GET | `/v1/leaderboards/{board}` | Liderlik (`weekly`, `kalicilik`, `en-hizli-otopark`, `en-kazancli`) | oyuncu | RL-READ |
| POST | `/v1/chat/connection-tickets` | Sohbet hub'ı için tek kullanımlık bilet | oyuncu | RL-WRITE |
| GET | `/v1/chat/dm/{playerId}/messages` | DM geçmişi (arkadaş; 15-17 `par`) | oyuncu | RL-READ |
| POST | `/v1/chat/reports` | Mesaj şikâyeti | oyuncu | RL-REPORT |
| POST / DELETE | `/v1/blocks`, `/v1/blocks/{playerId}` | Engelle / engeli kaldır | oyuncu | RL-SOCIAL |
| **Bildirim** | | | | |
| GET | `/v1/notifications` | Gelen kutusu (imleç) | oyuncu | RL-READ |
| POST | `/v1/notifications/reads` | Okundu işaretle | oyuncu | RL-WRITE |
| PUT / DELETE | `/v1/push-subscriptions`, `/v1/push-subscriptions/{id}` | Web Push aboneliği | oyuncu | RL-WRITE |
| GET / PUT | `/v1/players/me/notification-preferences` | Bildirim tercihleri | oyuncu | RL-READ / RL-WRITE |
| **KVKK** | | | | |
| GET | `/v1/privacy/notices` | Aydınlatma metinleri (sürümlü) | genel | RL-PUBLIC |
| POST | `/v1/privacy/consents` | Açık rıza ver / geri çek | oyuncu | RL-WRITE |
| POST | `/v1/privacy/data-exports` | Veri indirme talebi (202) | oyuncu (OTP ile yeniden doğrulama) | 3/gün |
| GET | `/v1/privacy/data-exports/{exportId}` | İndirme durumu / süreli bağlantı | oyuncu | RL-READ |
| POST | `/v1/privacy/erasure-requests` | Hesap silme talebi (7 gün bekleme) | oyuncu (OTP) | 3/gün |
| GET / DELETE | `/v1/privacy/erasure-requests/{requestId}` | Durum / bekleme süresinde vazgeç | oyuncu | RL-READ / RL-WRITE |
| **Yönetim (iç araçlar)** | | | | |
| GET / POST / PUT | `/v1/admin/content/items`, `/{itemId}` | İçerik taslağı oluştur/düzenle | içerik | RL-ADMIN |
| POST | `/v1/admin/content/items/{itemId}/publications` | İçeriği yayınla (yazar ≠ inceleyen) | içerik | RL-ADMIN |
| GET | `/v1/admin/moderation/cases` | Vaka kuyruğu | mod | RL-ADMIN |
| POST | `/v1/admin/moderation/cases/{caseId}/actions` | Uyarı / susturma / yasak | mod | RL-ADMIN |
| GET | `/v1/admin/economy/dashboard` | Haftalık ekonomi panosu (B2 §10.5) | yön | RL-ADMIN |
| POST | `/v1/admin/economy/adjustments` | Defter düzeltmesi iste (dört göz) | yön | RL-ADMIN |
| POST | `/v1/admin/economy/adjustments/{id}/approvals` | Düzeltmeyi onayla (farklı yönetici) | yön | RL-ADMIN |
| GET | `/v1/admin/ai/calibration` | Kalibrasyon paneli (kappa, sapma, itiraz oranı) | yön | RL-ADMIN |
| POST | `/v1/admin/ai/golden-set` | Altın küme ekle | yön | RL-ADMIN |
| GET | `/v1/admin/players/{playerId}` | Destek görünümü (maskeli) | yön | RL-ADMIN |
| POST | `/v1/admin/players/{playerId}/suspensions` | Askıya al / kaldır | yön | RL-ADMIN |
| GET | `/v1/admin/queues` | Kuyruk durumu, DLQ derinliği | yön | RL-ADMIN |
| POST | `/v1/admin/queues/{queue}/dead-letters/{messageId}/requeues` | Ölü mektubu yeniden kuyruğa al | yön | RL-ADMIN |
| GET | `/v1/admin/sandbox/status` | Sandbox havuzu, p95, ihlal sayacı | yön | RL-ADMIN |

Katalog 138 uç nokta içerir (129 tablo satırı; birleşik `GET / PUT` benzeri satırlar ayrı sayılmıştır).

---

### 5.4 Kritik 20 uç nokta: istek ve yanıt örnekleri

Örneklerde tek bir oyuncu hikâyesi izlenir: **Ayşe** (`ayse_kod`, 2011 doğumlu, 15–17 bandı, veli onayı bekliyor) VİZYON §4'ün ilk 70 dakikasını yaşar. Sayılar KANON'dandır (OTP 90 sn / 60 sn; ilk soru 82/100 → +25 XP → 85 XP → Sev. 2; Çırak Şapkası 30 B; Tapu 300 B; Otopark L1 ≈ 220 B/gün, kasa ≈ 73 B). Kimlikler kısaltılmıştır. Her örnek **istek**, **başarı** ve **hata** yanıtı içerir.

#### 5.4.1 `POST /v1/auth/otp/requests`: OTP iste

Telefonun kayıtlı olup olmadığı yanıttan **anlaşılamaz** (hesap numaralandırma savunması): yeni ve mevcut numara aynı yanıtı alır.

```http
POST /v1/auth/otp/requests HTTP/1.1
Content-Type: application/json
X-Client-Version: web/1.4.2

{ "phone": "+905551112233", "deviceId": "d_7Qk2mXw9sLr4", "purpose": "login", "turnstileToken": null }
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{ "challengeId": "0193a0b1-0c2e-7d90-8a44-5e61f0b2c3d4", "expiresInSec": 90, "resendAfterSec": 60, "codeLength": 6, "sendsLeftThisHour": 4 }
```

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/problem+json
Retry-After: 41

{ "type": "https://api.kodkent.com/problems/otp-resend-too-soon", "title": "Çok sık kod istendi",
  "status": 429, "detail": "Yeni kod için 41 saniye beklemelisin.", "instance": "/v1/auth/otp/requests",
  "code": "OTP_RESEND_TOO_SOON", "retryAfterSec": 41, "traceId":"00-9f1c0d7b2a4e4f3a8c1d5e6f70819a2b-3c4d5e6f70819a2b-01" }
```

#### 5.4.2 `POST /v1/auth/otp/verifications`: OTP doğrula

```http
POST /v1/auth/otp/verifications HTTP/1.1
Content-Type: application/json

{ "challengeId": "0193a0b1-0c2e-7d90-8a44-5e61f0b2c3d4", "code": "482910", "deviceId": "d_7Qk2mXw9sLr4" }
```

Yeni numara için kayıt belirteci döner (mevcut numarada `status: "authenticated"` ve erişim belirteci + yenileme çerezi):

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "status": "registration_required", "registrationToken": "rt_5Hn8Vb2Qe7Zc1Ld9", "expiresInSec": 600 }
```

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/otp-invalid", "title": "Kod yanlış", "status": 422,
  "detail": "Kod yanlış. Bu saat içinde 3 hakkın kaldı.", "instance": "/v1/auth/otp/verifications",
  "code": "OTP_INVALID", "attemptsLeftThisHour": 3, "challengeAttemptsLeft": 2,
  "traceId":"00-1a2b3c4d5e6f40718293a4b5c6d7e8f9-0a1b2c3d4e5f6071-01" }
```

#### 5.4.3 `POST /v1/auth/registrations`: hesabı tamamla

Aydınlatma metni sürümü kaydedilir; açık rıza kutuları **varsayılan kapalıdır** ve ayrı ayrı sorulur (§11.6). 15–17 için veli telefonu zorunludur ve veliye SMS gider.

```http
POST /v1/auth/registrations HTTP/1.1
Content-Type: application/json

{ "registrationToken": "rt_5Hn8Vb2Qe7Zc1Ld9", "handle": "ayse_kod", "displayName": "Ayşe", "birthYear": 2011, "birthMonth": null,
  "guardianPhone": "+905559998877", "cohortCode": "KULUP42",
  "consents": { "noticeVersion": "2026-11-01", "termsVersion": "2026-11-01", "analytics": false, "marketing": false, "aiCalibration": false } }
```

```http
HTTP/1.1 201 Created
Content-Type: application/json
Set-Cookie: kk_rt=…; HttpOnly; Secure; SameSite=Strict; Path=/v1/auth/tokens; Max-Age=2592000

{ "player": { "id": "0193a0b2-4c1d-7e55-9a21-6f3d8c2b1a07", "handle": "ayse_kod", "displayName": "Ayşe", "ageBand": "13-15" },
  "accessToken": "eyJhbGciOiJFUzI1NiIsImtpZCI6ImsyMDI2MTEifQ…", "expiresInSec": 900,
  "guardian": { "state": "pending", "expiresAt": "2026-11-05T21:14:03Z" },
  "restrictions": ["free_text_chat_off", "dm_off", "room_visibility_friends_only", "chip_purchase_off"] }
```

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/age-too-low", "title": "Henüz kayıt olamazsın", "status": 403,
  "detail": "KodKent 13 yaş ve üzeri içindir. Büyüyünce seni burada bekleriz.", "instance": "/v1/auth/registrations",
  "code": "AGE_TOO_LOW", "traceId":"00-2b3c4d5e6f4071829304a5b6c7d8e9fa-1b2c3d4e5f607182-01" }
```

#### 5.4.4 `POST /v1/auth/tokens/refresh`: erişim belirtecini yenile

İstek gövdesi boştur; yenileme belirteci `HttpOnly` çerezdedir ve **her kullanımda döner**.

```http
POST /v1/auth/tokens/refresh HTTP/1.1
Cookie: kk_rt=…
Origin: https://kodkent.com
Content-Type: application/json

{}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: kk_rt=…(yeni); HttpOnly; Secure; SameSite=Strict; Path=/v1/auth/tokens; Max-Age=2592000

{ "accessToken": "eyJhbGciOiJFUzI1NiIsImtpZCI6ImsyMDI2MTEifQ…", "expiresInSec": 900 }
```

Kullanılmış bir belirteç yeniden sunulursa (çalıntı şüphesi) tüm aile iptal edilir:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json
Set-Cookie: kk_rt=; Max-Age=0; Path=/v1/auth/tokens

{ "type": "https://api.kodkent.com/problems/refresh-reuse", "title": "Oturumun sonlandırıldı", "status": 401,
  "detail": "Güvenliğin için tüm cihazlardaki oturumların kapatıldı. Lütfen yeniden giriş yap.",
  "instance": "/v1/auth/tokens/refresh", "code": "REFRESH_REUSE_DETECTED",
  "traceId":"00-3c4d5e6f40718293a4b5c6d7e8f9fa0b-2c3d4e5f60718293-01" }
```

#### 5.4.5 `GET /v1/players/me`: oturum sahibi özeti

İlk görev (Meydan Saati: +60 XP, +40 B) sonrasında:

```http
GET /v1/players/me HTTP/1.1
Authorization: Bearer eyJ…
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: private, no-store

{ "id": "0193a0b2-4c1d-7e55-9a21-6f3d8c2b1a07", "handle": "ayse_kod", "displayName": "Ayşe", "title": "cirak",
  "level": 2, "xp": { "total": 145, "intoLevel": 65, "forNext": 200 },
  "wallets": { "BAYT": 40, "CIP": 0 }, "language": "csharp", "ageBand": "13-15",
  "guardian": { "state": "pending", "expiresAt": "2026-11-05T21:14:03Z" },
  "flags": { "freeTextChat": false, "roomVisibilityDefault": "arkadaslara", "chipPurchase": false },
  "slots": { "businessesUsed": 0, "businessesMax": 1 },
  "unlocked": { "districts": ["carsi"], "room": true },
  "serverTime": "2026-11-02T21:34:03Z", "businessDayStartsAt": "2026-11-03T01:00:00Z" }
```

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json
WWW-Authenticate: Bearer error="invalid_token", error_description="expired"

{ "type": "https://api.kodkent.com/problems/token-expired", "title": "Oturum süresi doldu", "status": 401,
  "detail": "Erişim belirtecinin süresi doldu.", "instance": "/v1/players/me", "code": "TOKEN_EXPIRED",
  "traceId":"00-4d5e6f4071829304a5b6c7d8e9fa0b1c-3d4e5f6071829304-01" }
```

#### 5.4.6 `GET /v1/lessons/{lessonId}`: ders içeriği

Ders içeriğinin ayrıntılı şeması B4/B3'ündür; burada yalnızca zarf gösterilir. Kürsü kilitli semtte gezilebilir, ama **ders içeriği** kilitlidir.

```http
GET /v1/lessons/1.2 HTTP/1.1
Authorization: Bearer eyJ…
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
ETag: "1.2-v3"

{ "id": "1.2", "title": "Sayılar ve Yuvarlama", "district": "carsi", "tier": 1, "version": 3, "state": "available",
  "cards": [
    { "index": 0, "kind": "anlat", "text": "Tam sayı bölmesi küsuratı atar: 7 / 2 işleminin sonucu 3'tür." },
    { "index": 1, "kind": "kod", "text": "Başlayan saati tam saymak için:", "code": "int saat = (dakika + 59) / 60;" } ],
  "questions": [ { "id": "q-1.2-kavram", "type": "kavram", "rubric": { "dogruluk": 50, "tamlik": 30, "aciklik": 20 },
                   "prompt": "`(dakika + 59) / 60` ifadesi neden dakikayı saate yukarı yuvarlar? Kendi cümlelerinle anlat." } ],
  "seal": { "needed": 2, "of": 3, "passed": 0 }, "hintsAvailable": ["pusula", "fener", "taslak", "ornek"] }
```

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/district-locked", "title": "Semt henüz açık değil", "status": 403,
  "detail": "Liman: Çarşı Sınavı'ndan sonra açılıyor.", "instance": "/v1/lessons/2.1", "code": "DISTRICT_LOCKED",
  "requires": { "level": 6, "districtExam": "carsi" }, "touristModeAvailable": true,
  "traceId":"00-5e6f4071829304a5b6c7d8e9fa0b1c2d-4e5f607182930415-01" }
```

#### 5.4.7 `POST /v1/grading/submissions`: Kurul'a cevap gönder

Cevap **veridir, talimat değildir**; sunucu 1.500 karakteri aşanı reddeder. İstek hemen `202` döner; puanlama kuyruktadır (§10).

```http
POST /v1/grading/submissions HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193a0c3-1d2e-7f40-9b55-6a72e1c3d4f5
Content-Type: application/json

{ "lessonAttemptId": "0193a0c0-8e11-7a02-b3c4-d5e6f7a8b9c0", "questionId": "q-1.1-kavram",
  "answer": "`yas` bir kutu, `17` içine koyduğum değer, `int` de kutunun tam sayı tutacağını söyleyen etiket." }
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json
Location: /v1/grading/submissions/0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a6

{ "submissionId": "0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a6", "status": "queued", "attemptNo": 1,
  "quota": { "usedToday": 1, "limit": 30, "deferred": false }, "etaMs": 4000 }
```

Günlük 30 etkileşim dolduysa istek **reddedilmez**, ertelenir (KANON §9): ders kilitlenmez, cevap gece Batch ile puanlanır.

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{ "submissionId": "0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a7", "status": "deferred_quota", "attemptNo": 1,
  "quota": { "usedToday": 30, "limit": 30, "deferred": true },
  "message": "Kurul bugünlük kapandı, cevabın sırada. XP sabah gelecek." }
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/attempts-exhausted", "title": "Haklarını kullandın", "status": 409,
  "detail": "Bu soru için 2 hakkını da kullandın. Telafi Turu 10 dakika sonra açılacak.", "instance": "/v1/grading/submissions",
  "code": "ATTEMPTS_EXHAUSTED", "requires": { "remediationAt": "2026-11-02T21:44:03Z" },
  "traceId":"00-6f407182930415a6b7c8d9eafb0c1d2e3-5f60718293041526-01" }
```

---

#### 5.4.8 `GET /v1/grading/submissions/{submissionId}`: Kurul Kartı

`card` alanı **B3'ün Kurul JSON şemasıdır** ve aynen taşınır (talimat §3). Sunucu ek olarak XP ödülünü ve Ders Mührü durumunu verir. Puan 82 → T1 tabanı 30 × 0,82 ≈ 25 XP (B2 §4.2); XP toplamı 85 → Seviye 2 (eşik 80).

```http
GET /v1/grading/submissions/0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a6 HTTP/1.1
Authorization: Bearer eyJ…
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "submissionId": "0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a6", "status": "done", "cacheHit": false,
  "card": {
    "puan": 82,
    "olcutler": [
      { "ad": "Doğruluk", "puan": 45, "not": "'Kutu' benzetmen doğru." },
      { "ad": "Tamlık",   "puan": 22, "not": "Türün neden önemli olduğu eksik." },
      { "ad": "Açıklık",  "puan": 15, "not": "Üç terimi ayırdın ama son cümle dağınık." } ],
    "geri_bildirim": "Ayşe, 'kutu' benzetmen çok yerinde: `yas` kutu, `17` içindeki değer. Eksik olan, `int`'in kutuya yalnızca tam sayı girebileceğini söylemesi. Sonraki kartta tam bunu göreceksin; kendi cümlenle bir örnek düşün.",
    "takip_sorusu": "Peki `int` yerine `string` yazsaydık 17 kutuya sığar mıydı?",
    "guven": 0.88, "kopya_suphesi": false },
  "award": { "xp": 25, "xpTotal": 85, "passed": true, "bright": false, "levelUp": { "from": 1, "to": 2 } },
  "seal": { "needed": 2, "of": 3, "passed": 1 }, "appealAvailable": true }
```

Henüz bitmediyse aynı uç nokta durum döner (istemci hub'dan `job.completed` bekler, yoklama yedektir):

```http
HTTP/1.1 200 OK
Content-Type: application/json
Retry-After: 2

{ "submissionId": "0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a6", "status": "scoring", "stage": "sonnet", "etaMs": 2500 }
```

```http
HTTP/1.1 404 Not Found
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/not-found", "title": "Bulunamadı", "status": 404,
  "detail": "Böyle bir puanlama kaydı yok.", "instance": "/v1/grading/submissions/0193a0c3-ffff-7a50-8c66-7b83f2d4e5a6",
  "code": "NOT_FOUND", "traceId":"00-7a8b9c0d1e2f40718293a4b5c6d7e8f9-6a7b8c9d0e1f2031-01" }
```

#### 5.4.9 `POST /v1/grading/submissions/{submissionId}/appeals`: itiraz

Soru başına 1, günde 3 itiraz; `claude-opus-5-5` **kör** yeniden puanlar (§10.6); fark ≥ 15 ise yeni puan geçerlidir (KANON §9).

```http
POST /v1/grading/submissions/0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a6/appeals HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193a0c5-3f40-7b60-9d77-8c94a3e5f6b7
Content-Type: application/json

{ "reason": "Cevabımda türün tam sayı tutmasını açıkladığımı düşünüyorum." }
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{ "appealId": "0193a0c5-4051-7c70-8e88-9da5b4f6a7c8", "status": "queued", "dailyAppealsLeft": 2, "etaMs": 8000 }
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/appeal-already-filed", "title": "İtiraz hakkını kullandın", "status": 409,
  "detail": "Bu soru için zaten bir itirazın var.", "instance": "/v1/grading/submissions/0193a0c3-2e3f-7a50-8c66-7b83f2d4e5a6/appeals",
  "code": "APPEAL_ALREADY_FILED", "traceId":"00-8b9c0d1e2f4071829304a5b6c7d8e9fa-7b8c9d0e1f203142-01" }
```

#### 5.4.10 `GET /v1/challenges/{challengeId}`: challenge (oyuncu görünümü)

`challenge` bölümü **B5 Challenge Spec'inin oyuncuya açık izdüşümüdür**; alan adları B5'indir. `hidden_tests`, `seeded_tests` içeriği, `edge_cases`, `savunma_sorulari`, `rubrik` ve referans çözüm **sunucuda ayıklanır**; oyuncu yalnızca adetleri görür. `sozlesme_karti` Gereksinim Netleştirme tamamlanana dek boştur. Açık testler KANON §5.1 tablosundaki 6 vakadır.

```http
GET /v1/challenges/otopark-L1 HTTP/1.1
Authorization: Bearer eyJ…
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: private, max-age=60

{ "challenge": {
    "id": "otopark-L1", "isletme": "otopark", "seviye": 1, "baslik": "Otopark ücret hesabı",
    "musteri_istegi": "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum.",
    "sozlesme_karti": [],
    "imza": "public static int Otopark.UcretHesapla(int dakika)",
    "iskelet_kod": "// İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi\npublic static class Otopark\n{\n    // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)\n    // dönüş: ödenecek ücret, TL (tam sayı)\n    public static int UcretHesapla(int dakika)\n    {\n        // kodun buraya\n    }\n}\n",
    "public_tests": [
      { "id": "A1", "girdi": [30],   "beklenen": 100, "etiket": "Başlayan 1. saat" },
      { "id": "A2", "girdi": [61],   "beklenen": 200, "etiket": "Başlayan 2. saat, hâlâ 2 saatten az" },
      { "id": "A3", "girdi": [120],  "beklenen": 80,  "etiket": "Tam 2 saat: 2 × 40" },
      { "id": "A4", "girdi": [121],  "beklenen": 120, "etiket": "Başlayan 3. saat" },
      { "id": "A5", "girdi": [361],  "beklenen": 250, "etiket": "6 saati aştı: günlük" },
      { "id": "A6", "girdi": [1441], "beklenen": 500, "etiket": "2. gün başladı" } ],
    "gizli_test_adedi": 14, "tohumlu_test_adedi": 6,
    "ipucu_kademeleri": ["pusula", "fener", "taslak", "ornek"],
    "odul": { "xp": 300, "bayt": 0 } },
  "state": { "businessId": "0193a4d9-7b02-7a31-b6c4-2e9f01d35c88", "businessStatus": "kapali",
             "clarifications": { "required": 4, "asked": 0 }, "submissions": 0 } }
```

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/licence-missing", "title": "Önce tapu gerekli", "status": 403,
  "detail": "Otopark iş emrini görmek için önce Tapu'yu almalısın (Ruhsat 2/3).", "instance": "/v1/challenges/otopark-L1",
  "code": "LICENCE_MISSING", "requires": { "licence": "otopark", "have": 2, "need": 3, "deed": true },
  "traceId":"00-9c0d1e2f4071829304a5b6c7d8e9fa0b-8c9d0e1f20314253-01" }
```

#### 5.4.11 `POST /v1/challenges/{challengeId}/submissions`: kod gönder

İstek `202` döner ve `code-run` kuyruğuna girer. Oyuncu kodunun yazma süresi ve yapıştırma sayısı telemetri olarak gelir (KANON §9 kopya kuralı: yazım < 30 sn ya da AST benzerliği > %95 → Savunma zorunlu, Bayt Savunma sonrası). Telemetri **işaret**tir, ceza değildir.

```http
POST /v1/challenges/otopark-L1/submissions HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193a4e0-0a11-7b22-9c33-4d55e6f7a8b9
Content-Type: application/json

{ "businessId": "0193a4d9-7b02-7a31-b6c4-2e9f01d35c88",
  "source": "public static class Otopark\n{\n    public static int UcretHesapla(int dakika)\n    {\n        if (dakika <= 0) return 0;\n        int saat = (dakika + 59) / 60;\n        if (dakika < 120) return saat * 100;\n        if (dakika <= 360) return saat * 40;\n        int gun = (dakika + 1439) / 1440;\n        return gun * 250;\n    }\n}\n",
  "telemetry": { "pasteCount": 0, "typingMs": 912000, "keyToSubmitMs": 4200 } }
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json
Location: /v1/challenge-submissions/0193a4e0-0b22-7c33-8d44-5e66f7a8b9c0

{ "submissionId": "0193a4e0-0b22-7c33-8d44-5e66f7a8b9c0", "status": "queued", "queue": "code-run:p0", "etaMs": 1800 }
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/clarification-required", "title": "Önce müşteriye sor", "status": 409,
  "detail": "Müşteriye sormadan kod yazan iki kere yazar. En az 4 soru sor; şu an 2 soru sordun.",
  "instance": "/v1/challenges/otopark-L1/submissions", "code": "CLARIFICATION_REQUIRED",
  "requires": { "clarifications": { "need": 4, "have": 2 } },
  "traceId":"00-ad1e2f4071829304a5b6c7d8e9fa0b1c-9d0e1f2031425364-01" }
```

#### 5.4.12 `GET /v1/challenge-submissions/{submissionId}`: derleme ve test sonucu

Sonuç hakem sürecinin JSON satırlarından (§8.4) üretilir. Gizli ve tohumlu testlerde **girdi ve beklenen değer asla dönmez**; kalan test yalnızca kategori etiketiyle bildirilir ("Müfettiş şikâyet balonu", VİZYON §7).

```http
GET /v1/challenge-submissions/0193a4e0-0b22-7c33-8d44-5e66f7a8b9c0 HTTP/1.1
Authorization: Bearer eyJ…
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "submissionId": "0193a4e0-0b22-7c33-8d44-5e66f7a8b9c0", "status": "done", "challengeId": "otopark-L1",
  "compile": { "ok": true, "ms": 41, "diagnostics": [] },
  "tests": {
    "public": { "passed": 6, "total": 6, "items": [
      { "id": "A1", "status": "gecti", "girdi": [30], "beklenen": 100, "gercek": 100 },
      { "id": "A3", "status": "gecti", "girdi": [120], "beklenen": 80, "gercek": 80 } ] },
    "hidden": { "passed": 14, "total": 14, "failedLabels": [] },
    "seeded": { "passed": 6, "total": 6 } },
  "verdict": "savunma_bekliyor", "next": { "defense": "/v1/businesses/0193a4d9-7b02-7a31-b6c4-2e9f01d35c88/defenses" },
  "durationMs": 412 }
```

Derleme hatası bir HTTP hatası değil **sonuçtur**; mesaj, en sık 50 CS kodu için statik Türkçe tablodan (KANON §9) gelir:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "submissionId": "0193a4e0-0c33-7d44-8e55-6f77a8b9c0d1", "status": "compile_error", "challengeId": "otopark-L1",
  "compile": { "ok": false, "ms": 38, "diagnostics": [
    { "code": "CS1002", "line": 6, "column": 38, "messageTr": "Satır sonunda `;` eksik.", "raw": "; expected" } ] },
  "tests": null, "verdict": "derlenemedi" }
```

#### 5.4.13 `POST /v1/businesses`: Tapu al

Ön koşullar (Ruhsat 3/3, seviye, bakiye, slot) **tek işlemde, oyuncu kilidi altında** denetlenir; işletme satırı, defter işlemi ve olay aynı işlemde yazılır (§9.3).

```http
POST /v1/businesses HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193a4d9-6a00-7a11-8b22-3c44d5e6f7a8
Content-Type: application/json

{ "kind": "otopark" }
```

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /v1/businesses/0193a4d9-7b02-7a31-b6c4-2e9f01d35c88

{ "business": { "id": "0193a4d9-7b02-7a31-b6c4-2e9f01d35c88", "kind": "otopark", "district": "carsi", "level": 1, "status": "kapali",
                "address": "Çarşı · Tente Sokak No: 3", "street": { "id": "0193a000-1111-7222-8333-944455556666", "slot": 3 } },
  "price": 300, "wallet": { "BAYT": { "before": 340, "after": 40 } }, "ledgerTxId": "0193a4d9-7c11-7b22-9c33-4d55e6f7a8b9",
  "next": { "workOrder": "/v1/challenges/otopark-L1", "npc": "Hasan Abi" } }
```

```http
HTTP/1.1 402 Payment Required
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/insufficient-funds", "title": "Bakiye yetersiz", "status": 402,
  "detail": "Tapu için 300 B gerekiyor, cüzdanında 240 B var.", "instance": "/v1/businesses",
  "code": "INSUFFICIENT_FUNDS", "requires": { "currency": "BAYT", "required": 300, "available": 240 },
  "traceId":"00-be2f4071829304a5b6c7d8e9fa0b1c2d-ae0f102031425364-01" }
```

#### 5.4.14 `POST /v1/businesses/{businessId}/vault/collections`: kasa topla

Kasa tembel hesaplanır (§9.4); toplama tam Bayt'ı öder, kesir kasada kalır. Otopark L1: 220 B/gün ÷ 24 = 9,1667 B/sa; 8 saatte 73,33 B → 73 B toplanır, 0,33 B kalır.

```http
POST /v1/businesses/0193a4d9-7b02-7a31-b6c4-2e9f01d35c88/vault/collections HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193a9f0-1b22-7c33-8d44-5e66f7a8b9c0
Content-Type: application/json

{}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "collected": 73,
  "vault": { "balance": 0.3333, "ratePerHour": 9.1667, "capHours": 8, "capBayt": 73.3333, "fullInHours": 7.96 },
  "wallet": { "BAYT": { "before": 40, "after": 113 } }, "idleFullHours": 0.0,
  "ledgerTxId": "0193a9f0-1c33-7d44-8e55-6f77a8b9c0d1" }
```

Aynı `Idempotency-Key` ile ikinci istek (ağ yeniden denemesi) **aynı yanıtı** döner ve bakiye ikinci kez artmaz:

```http
HTTP/1.1 200 OK
Idempotent-Replayed: true
Content-Type: application/json

{ "collected": 73, "vault": { "balance": 0.3333, "ratePerHour": 9.1667, "capHours": 8, "capBayt": 73.3333, "fullInHours": 7.96 },
  "wallet": { "BAYT": { "before": 40, "after": 113 } }, "idleFullHours": 0.0, "ledgerTxId": "0193a9f0-1c33-7d44-8e55-6f77a8b9c0d1" }
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/vault-empty", "title": "Kasada toplanacak Bayt yok", "status": 409,
  "detail": "Kasada henüz tam bir Bayt birikmedi (0,6 B). Birkaç dakika sonra tekrar bak.",
  "instance": "/v1/businesses/0193a4d9-7b02-7a31-b6c4-2e9f01d35c88/vault/collections", "code": "VAULT_EMPTY",
  "requires": { "vaultBalance": 0.6 }, "traceId":"00-cf3041718293a4b5c6d7e8f9fa0b1c2d-bf10203142536475-01" }
```

---

#### 5.4.15 `GET /v1/businesses/{businessId}/runs`: günlük gelir kayıtları

İşletme Paneli'nin TL ve B grafiğini besler (KANON §6 #14). `cappedTl = min(playerTl, referenceTl)`; sapma şikâyet balonuna dönüşür, kategori etiketi verilir ama gizli girdi verilmez.

```http
GET /v1/businesses/0193a4d9-7b02-7a31-b6c4-2e9f01d35c88/runs?limit=2 HTTP/1.1
Authorization: Bearer eyJ…
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "items": [
    { "runDate": "2026-11-03", "revision": 1, "trafficCount": 12, "playerTl": 2160, "referenceTl": 2250, "cappedTl": 2160,
      "statusFactor": 1.0, "dailyBayt": 216.0, "complaint": "eksik_ucret", "complaintHint": "6 saat civarı kalanlar" },
    { "runDate": "2026-11-02", "revision": 2, "trafficCount": 12, "playerTl": 2250, "referenceTl": 2250, "cappedTl": 2250,
      "statusFactor": 1.0, "dailyBayt": 225.0, "complaint": null, "complaintHint": null } ],
  "nextCursor": "eyJkIjoiMjAyNi0xMS0wMiIsInIiOjF9" }
```

```http
HTTP/1.1 404 Not Found
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/not-found", "title": "Bulunamadı", "status": 404,
  "detail": "Böyle bir işletmen yok.", "instance": "/v1/businesses/0193a4d9-0000-7a31-b6c4-2e9f01d35c88/runs",
  "code": "NOT_FOUND", "traceId":"00-d04051829304a5b6c7d8e9fa0b1c2d3e-cf20314253647586-01" }
```

#### 5.4.16 `POST /v1/businesses/{businessId}/upgrades`: yükseltme satın al

Yükseltme **iki aşamalıdır**: ödeme yeni İş Emri'ni açar (`upgradeTo`), seviye ancak L2 kodu testleri ve Savunma'yı geçince artar (§9.2). Gereken ders Mührü ödemeden önce denetlenir (B2 §7.3).

```http
POST /v1/businesses/0193a4d9-7b02-7a31-b6c4-2e9f01d35c88/upgrades HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193b100-aa11-7b22-9c33-4d55e6f7a8b9
Content-Type: application/json

{ "toLevel": 2 }
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "business": { "id": "0193a4d9-7b02-7a31-b6c4-2e9f01d35c88", "level": 1, "upgradeTo": 2, "status": "acik" },
  "price": 500, "wallet": { "BAYT": { "before": 812, "after": 312 } }, "ledgerTxId": "0193b100-ab22-7c33-8d44-5e66f7a8b9c0",
  "xpOnCompletion": 150, "next": { "workOrder": "/v1/challenges/otopark-L2" } }
```

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/lesson-gate", "title": "Önce dersi bitir", "status": 403,
  "detail": "Otopark L2 için Ders 2.1 (Liman) Mührü gerekiyor.", "instance": "/v1/businesses/0193a4d9-7b02-7a31-b6c4-2e9f01d35c88/upgrades",
  "code": "LESSON_GATE", "requires": { "lessonId": "2.1", "seal": true },
  "traceId":"00-e151629304a5b6c7d8e9fa0b1c2d3e4f-d030425364758697-01" }
```

#### 5.4.17 `POST /v1/market/purchases`: satın al

`expectedPrice` istemcinin gördüğü fiyattır; Pazar rotasyonu arada değiştiyse `PRICE_CHANGED` döner ve yeniden onay istenir. Çırak Şapkası (30 B) VİZYON §4'ün 20. dakikasıdır.

```http
POST /v1/market/purchases HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193a0e0-5566-7a77-8b88-9c99d0e1f2a3
Content-Type: application/json

{ "sku": "cirak-sapkasi", "expectedPrice": { "currency": "BAYT", "amount": 30 } }
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "purchaseId": "0193a0e0-5677-7b88-9c99-0da1e2f3a4b5", "item": { "sku": "cirak-sapkasi", "rarity": "siradan", "serialNo": null },
  "wallet": { "BAYT": { "before": 40, "after": 10 } }, "ledgerTxId": "0193a0e0-5788-7c99-8da0-1eb2f3a4b5c6" }
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/already-owned", "title": "Bu eşyaya zaten sahipsin", "status": 409,
  "detail": "Çırak Şapkası envanterinde duruyor; Dolap'tan giyebilirsin.", "instance": "/v1/market/purchases",
  "code": "ALREADY_OWNED", "traceId":"00-f262730415b6c7d8e9fa0b1c2d3e4f50-e140536475869708-01" }
```

#### 5.4.18 `PUT /v1/rooms/me/layout`: oda yerleşimini kaydet

Yerleşim **tüm düzeni** değiştirir ve `If-Match` ile iyimser eşzamanlılık kullanır (iki sekme/cihazda düzenleme çakışması). Stüdyo kapasitesi 25 eşyadır (KANON §2.2).

```http
PUT /v1/rooms/me/layout HTTP/1.1
Authorization: Bearer eyJ…
If-Match: "7"
Content-Type: application/json

{ "items": [
    { "inventoryItemId": "0193a0f0-1100-7a11-8b22-3c44d5e6f7a8", "gx": 0, "gy": 2, "rot": 1, "layer": "zemin" },
    { "inventoryItemId": "0193a0f0-1200-7a11-8b22-3c44d5e6f7a9", "gx": 3, "gy": 3, "rot": 0, "layer": "yuzey" } ] }
```

```http
HTTP/1.1 200 OK
ETag: "8"
Content-Type: application/json

{ "layoutVersion": 8, "itemCount": 2, "capacity": 25 }
```

```http
HTTP/1.1 412 Precondition Failed
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/version-conflict", "title": "Oda başka yerde değişmiş", "status": 412,
  "detail": "Odanın düzeni başka bir cihazda değiştirildi. Yenileyip tekrar dene.", "instance": "/v1/rooms/me/layout",
  "code": "VERSION_CONFLICT", "requires": { "currentLayoutVersion": 9 },
  "traceId":"00-073849506172a8b9c0d1e2f3a4b5c6d7e8-f250647586970819-01" }
```

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/validation-failed", "title": "Yerleşim geçersiz", "status": 422,
  "detail": "Stüdyoda en çok 25 eşya olur.", "instance": "/v1/rooms/me/layout", "code": "VALIDATION_FAILED",
  "errors": [ { "pointer": "/items", "detail": "26 eşya gönderildi; kapasite 25." } ],
  "traceId":"00-184950617283b9c0d1e2f3a4b5c6d7e8f9-0360758697081920-01" }
```

#### 5.4.19 `POST /v1/world/scenes/{sceneKey}/join-tickets`: shard ayır ve hub bileti al

Shard seçimi B1 §11.2 sırasıyla yapılır: arkadaşın shard'ı → kohort kodu → en dolu ama ≤ 32 → yeni shard. Bilet 15 sn geçerli, tek kullanımlıktır ve `/hubs/world` bağlantısında erişim belirteci yerine kullanılır (URL'de JWT taşınmaz).

```http
POST /v1/world/scenes/meydan/join-tickets HTTP/1.1
Authorization: Bearer eyJ…
Content-Type: application/json

{ "cohortCode": "KULUP42", "friendId": null, "sceneVersion": "b1-2026.11.0" }
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "scene": "meydan", "shard": "meydan-07", "mode": "normal", "selection": "cohort",
  "hubUrl": "wss://hub.kodkent.com/hubs/world?shard=meydan-07", "ticket": "tk_9Kx2Qm7Vw4Lc8Zt1", "ticketTtlSec": 15,
  "capacity": { "current": 23, "max": 40 }, "sceneVersion": "b1-2026.11.0", "walkableHash": "sha256-q3yV0cEw1H8d" }
```

```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/scene-full", "title": "Oda dolu", "status": 409,
  "detail": "Oda dolu — 20/20. Sahibine Alkış bırakabilirsin.", "instance": "/v1/world/scenes/oda-0193a000-aaaa/join-tickets",
  "code": "SCENE_FULL", "requires": { "capacity": 20, "current": 20, "applauseAllowed": true },
  "traceId":"00-2a5a61728394cad0e1f2a3b4c5d6e7f809-1470869708192a3b-01" }
```

#### 5.4.20 `POST /v1/privacy/erasure-requests`: hesap silme talebi

Silme **OTP ile yeniden doğrulama** ister; 7 gün bekleme süresi içinde vazgeçilebilir; yasal süre 30 gündür (KVKK başvuru süresi). 15–17 yaşta talep veli kanalından da başlatılabilir (§11.6).

```http
POST /v1/privacy/erasure-requests HTTP/1.1
Authorization: Bearer eyJ…
Idempotency-Key: 0193c000-0a0b-7c0d-8e0f-1a2b3c4d5e6f
Content-Type: application/json

{ "otpChallengeId": "0193c000-0001-7aaa-8bbb-9ccc0ddd1eee", "otpCode": "731045", "confirmText": "HESABIMI SİL" }
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{ "requestId": "0193c000-0b0c-7d0e-8f10-2b3c4d5e6f70", "status": "pending_grace",
  "graceUntil": "2026-11-09T21:14:03Z", "dueAt": "2026-12-02T21:14:03Z",
  "cancelUrl": "/v1/privacy/erasure-requests/0193c000-0b0c-7d0e-8f10-2b3c4d5e6f70",
  "willErase": ["telefon", "takma ad ve profil", "cevaplar ve Kurul kayıtları", "kod ve Vitrin", "sohbet mesajları", "oda ve envanter görünümü"],
  "willRetain": [
    { "what": "Çip satın alma ve fatura kayıtları", "why": "Vergi mevzuatı", "until": "2036-11-02" },
    { "what": "Defter satırları (kimliksiz)", "why": "Ekonomi bütünlüğü ve denetim", "until": "2028-11-02" } ] }
```

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json

{ "type": "https://api.kodkent.com/problems/reauth-required", "title": "Doğrulama gerekli", "status": 401,
  "detail": "Hesabı silmek için telefonuna gelen kodu girmelisin.", "instance": "/v1/privacy/erasure-requests",
  "code": "REAUTH_REQUIRED", "requires": { "otpPurpose": "erasure_confirm" },
  "traceId":"00-3b6b728394a5dbe1f2a3b4c5d6e7f80910-2580970819203a4b-01" }
```

---

## 6. Gerçek zamanlı katman (SignalR)

### 6.1 Tasarım özeti

Şehir, "sahne"lerden oluşur (B1 §11): Meydan, Akademi Lobisi, Kürsü, Ana Cadde gibi kamusal sahneler **shard**'lanır (aynı sahnenin paralel kopyaları, en çok 40 avatar); Oda, Ara Sokak ve işletme içi sahibine bağlı **tek örnek**tir. Backend bu modeli şöyle uygular:

1. **Bir sahne ziyareti = bir WebSocket bağlantısı.** Oyuncu `POST /v1/world/scenes/{sceneKey}/join-tickets` ile bir shard ayırır; yanıttaki 15 sn'lik tek kullanımlık *bilet* ve `hubUrl` ile `/hubs/world`'e bağlanır. Sahne değişince (kapıdan geçiş) bağlantı kapanır, yenisi açılır (≈ 150 ms). Bu, ingress'in shard kimliğine göre **tutarlı karma ile aynı pod'a** yönlendirmesini mümkün kılar (`?shard=meydan-07`): bir shard'ın bütün bağlantıları aynı pod'dadır ve shard durumu o pod'un belleğindedir.
2. **Sunucu otoriterdir.** İstemci yalnızca niyet bildirir (`MoveTo(gx, gy)`); yolu sunucu aynı `walkable` bit kümesiyle hesaplar, hızı ve hız sınırını denetler, sonucu 5 Hz'lik toplu `scene.delta` ile yayar. İstemciler yol üzerinde yumuşak ara değerleme yapar (60 fps çizim, 5 Hz ağ).
3. **Redis backplane yalnızca pod'lar arası olaylar içindir:** `api`/`worker` pod'larından oyuncuya giden kullanıcı olayları (`user.xp`, `job.completed`, `user.wallet`…) ve sohbet kanalları. Sahne içi trafik backplane'e hiç uğramaz; bu yüzden shard sayısı arttıkça Redis yükü doğrusal artmaz.
4. **Kalıcılık yoktur, geri kazanım vardır.** Avatar konumları pod belleğinde tutulur ve Redis'e anlık görüntü olarak yazılır (`player:loc`). Pod ölürse istemciler yeniden bağlanır, ingress başka pod seçer, shard aktörü Redis anlık görüntüsünden ≤ 2 sn'de yeniden kurulur.

### 6.2 Hub'lar

| Hub | Yol | Amaç | Bağlantı ömrü | Kimlik | Ölçek birimi |
|---|---|---|---|---|---|
| `WorldHub` | `/hubs/world` | Sahne içi avatar, hareket, emote, etkileşim; oyuncuya özel kullanıcı olayları (`user:{id}` grubu) | Bir sahne ziyareti | Bilet (JWT URL'de taşınmaz) | Shard → pod (tutarlı karma) |
| `ChatHub` | `/hubs/chat` | Sahne/oda sohbeti, DM, moderasyon olayları | Oturum boyunca tek bağlantı | `POST /v1/chat/connection-tickets` bileti | Grup → backplane |

Sohbetin ayrı hub olmasının nedeni **izolasyondur**: sohbet spam'i, hareket akışının gecikmesini bozmamalı; moderasyon durdurmaları (`chat.muted`) bağımsız ölçeklenmeli; 15–17 yaş sohbet politikası tek yerde uygulanmalı.

**Taşıma ayarları.** WebSockets-only (`SkipNegotiation = true`, `LongPolling` ve SSE kapalı; çünkü bunlar yapışkan oturum gerektirir), keep-alive 15 sn, istemci zaman aşımı 45 sn, en büyük ileti 32 KB, ileti protokolü başlangıçta JSON (10k DAU üstünde MessagePack + `permessage-deflate`, ≈ 3× daha az bant). Bağlantı başına `IHubFilter` ile hız sınırı (§6.3 tablosu) ve `Context.Items` içinde `PlayerId`, `Shard`, `AgeBand`, `Par`.

### 6.3 Olaylar

**İstemci → sunucu (`WorldHub`)**

| Yöntem | Yük | Doğrulama | Limit | Yanıt |
|---|---|---|---|---|
| `MoveTo` | `{ seq:int, gx:int, gy:int }` | Hedef `walkable`; yol ≤ 60 tile; sahne dışı değil; avatar `ghost` değil | 4/sn (patlama 8) | `move.ack` |
| `Emote` | `{ emoteId:string }` | Emote oyuncunun envanterinde (8 başlangıç + kazanılanlar); oturma emote'u banka yakın | 1/sn | `scene.delta` içinde |
| `Interact` | `{ targetId:string, kind:"door"\|"npc"\|"kasa"\|"tabela"\|"bank" }` | Hedef 2 tile içinde; yetki (kapı kilitli mi, Oda izni, kapasite) | 2/sn | `interaction.result` ya da `scene.transition` |
| `Resync` | `{ lastTick:int }` | — | 1/5 sn | `scene.snapshot` |
| `Leave` | `{}` | — | — | bağlantı kapanır |

**İstemci → sunucu (`ChatHub`)**

| Yöntem | Yük | Doğrulama | Limit | Yanıt |
|---|---|---|---|---|
| `Send` | `{ clientMsgId:uuid, channel:"sahne"\|"oda"\|"dm", target:string, text:string }` | ≤ 200 karakter, bağlantı yok, sözlük (§7.5), `Par` kapısı (serbest metin 15–17'de veli onayına bağlı), susturma, engelleme | **1 mesaj / 3 sn** (VİZYON §9) | `chat.ack` ya da `chat.rejected` |
| `JoinChannel` / `LeaveChannel` | `{ channel, target }` | Sahne/oda üyeliği; DM için arkadaşlık | 5/dk | — |
| `MarkRead` | `{ peerId, upToMessageId }` | — | 30/dk | — |

**Sunucu → istemci (`WorldHub`)**

| Olay | Yük (özet) | Ne zaman | Alıcı |
|---|---|---|---|
| `scene.snapshot` | `{ scene, shard, tick, serverTime, mode, avatars:[{id,handle,title,pos,dir,state,outfit}], objects:[…], lod }` | Bağlanınca, `Resync`'te | Bağlantı |
| `scene.delta` | `{ tick, t, moved:[{id,path,t0,speed}], emotes:[{id,emoteId}], joined:[…], left:[id…], states:[{id,state}] }` | 200 ms'de bir, yalnızca değişiklik varsa | Shard grubu |
| `move.ack` | `{ seq, accepted, path?, reason? }` | Her `MoveTo` sonrası | Gönderen |
| `scene.event` | `{ kind:"meydan_question"\|"fountain"\|"led", payload }` | Saat başı Meydan Sorusu, LED akışı | Shard (LED küresel yarısı backplane'den) |
| `scene.transition` | `{ toScene, requiresTicket:true }` | Kapı etkileşimi | Gönderen |
| `scene.closing` | `{ reason:"merge"\|"deploy", altShard? }` | Shard birleştirme/dağıtım | Shard grubu |
| `interaction.result` | `{ targetId, ok, panel? }` | Kasa/tabela/NPC | Gönderen |
| `user.xp` | `{ amount, total, level, levelUp? }` | `XpGrantedv1` | `user:{id}` |
| `user.wallet` | `{ currency, delta, balance, reason }` | `LedgerPostedv1` | `user:{id}` |
| `job.completed` | `{ kind:"grading"\|"submission"\|"defense"\|"run", id, status, url }` | Kuyruk işi bitti | `user:{id}` |
| `quest.updated`, `notify.new`, `vault.full`, `presence.friend` | küçük özet yükleri | İlgili olay | `user:{id}` |
| `session.refresh_required` | `{ reason:"guardian_changed" }` | Veli onayı geldi/geri çekildi: JWT talepleri eskidi | `user:{id}` |

**Sunucu → istemci (`ChatHub`):** `chat.message {id, channel, target, from:{id,handle,title}, text, at}`, `chat.ack {clientMsgId, id}`, `chat.rejected {clientMsgId, code:"RATE"\|"LINK"\|"FILTER"\|"MUTED"\|"PAR_REQUIRED"}`, `chat.removed {id, reason}` (otomatik gizleme ya da moderasyon), `chat.muted {until}`.

```json
{ "t": 1730582043200, "tick": 18453,
  "moved": [ { "id": "0193a0b2-4c1d-7e55-9a21-6f3d8c2b1a07", "t0": 1730582043000, "speed": 4,
               "path": [[20,18],[20,19],[21,19],[22,19]] } ],
  "emotes": [ { "id": "0193a1c4-9d02-7a31-b6c4-2e9f01d35c88", "emoteId": "dans-1" } ],
  "joined": [], "left": [], "states": [ { "id": "0193a1c4-9d02-7a31-b6c4-2e9f01d35c88", "state": "ghost" } ] }
```

### 6.4 Oda/shard modeli

Kapasiteler, kalıcılık ve "yeni kopya eşiği" **B1 §11.1 tablosundadır** ve burada yeniden tanımlanmaz; B7 bunları `scene_defs` yapılandırmasında (`capacity`, `newAt`, `mergeBelow`, `mergeAfterMin`) taşır: Meydan, Ana Cadde, Akademi Lobisi, Blok Sokağı için 40 / 36'da yeni shard; Kürsü 12; Akademi Atölyesi ve Pazar 20; Ara Sokak 20 (+6 sahip hakkı); işletme içi 15; Oda 20 (KANON). Ara Sokak, Oda ve işletme içi *tek örnek*tir: `instance` anahtarı sahibe bağlıdır (`oda-{roomId}`), shard seçimi yoktur, kapasite dolunca `SCENE_FULL` döner; sahip her zaman girer.

**Sahne anahtarları:** `meydan`, `akademi-lobi`, `kursu-{districtSlug}`, `akademi-atolye`, `pazar`, `cadde-{districtSlug}`, `sokak-{streetId}`, `isletme-{businessId}`, `oda-{roomId}`, `blok-sokagi`.

**Seçim algoritması (B1 §11.2) ve Redis modeli.** Sıra: (1) arkadaşın shard'ı (kapasite < 40; son 4 yer "arkadaşa katıl"a ayrılır), (2) kohort kodunun shard'ı (< 36), (3) en dolu ama ≤ 32 olan açık shard, (4) yeni shard. Atomiklik için tek bir Lua betiği çalışır; koltuk, 15 sn'lik *rezervasyon* (hold) olarak yazılır ve bilet kullanılmazsa kendiliğinden düşer.

| Redis anahtarı | Tür | İçerik |
|---|---|---|
| `shard:{scene}:{n}` | hash | `joined` (bağlı sayı), `status` (`open`/`draining`/`closed`), `pod`, `since` |
| `holds:{scene}:{n}` | ZSET | skor = rezervasyon bitiş ms, üye = bilet kimliği |
| `shards:{scene}:open` | ZSET | skor = doluluk (joined + etkin rezervasyon), üye = `n` |
| `shardseq:{scene}` | string | Yeni shard numarası sayacı |
| `cohort:{code}:{scene}` | string | Kohortun yapışkan shard'ı (TTL 6 sa) |
| `player:loc:{playerId}` | hash | `scene`, `shard`, `gx`, `gy`, `dir`, `ghostUntil`; TTL 120 sn, her hareket sonu ve 10 sn'de bir yenilenir |
| `presence:{playerId}` | string | Çevrimiçi göstergesi, TTL 90 sn (15 sn'de bir yenilenir) |
| `ticket:{id}` | string | `{playerId, scene, shard, mode}`; TTL 15 sn; `GETDEL` ile tek kullanım |

```lua
-- ALLOC_SHARD: KEYS[1]=shards:{scene}:open  ARGV: scene, friendShard|"", cohortShard|"", ticketId, nowMs, holdMs
local scene, now, holdMs = ARGV[1], tonumber(ARGV[5]), tonumber(ARGV[6])
local function eff(n)                                   -- etkin doluluk = bağlı + süresi dolmamış rezervasyon
  local k = 'shard:'..scene..':'..n
  redis.call('ZREMRANGEBYSCORE', 'holds:'..scene..':'..n, '-inf', now)
  return tonumber(redis.call('HGET', k, 'joined') or '0') + redis.call('ZCARD', 'holds:'..scene..':'..n)
end
local function open(n) return n ~= '' and redis.call('HGET', 'shard:'..scene..':'..n, 'status') == 'open' end
local pick, why = nil, nil
if open(ARGV[2]) and eff(ARGV[2]) < 40 then pick, why = ARGV[2], 'friend'
elseif open(ARGV[3]) and eff(ARGV[3]) < 36 then pick, why = ARGV[3], 'cohort'
else
  local cands = redis.call('ZREVRANGEBYSCORE', KEYS[1], 32, '-inf', 'LIMIT', 0, 8)   -- en doludan başla
  for _, n in ipairs(cands) do if open(n) and eff(n) <= 32 then pick, why = n, 'fullest'; break end end
end
if not pick then
  pick = string.format('%02d', redis.call('INCR', 'shardseq:'..scene)); why = 'new'
  redis.call('HSET', 'shard:'..scene..':'..pick, 'joined', 0, 'status', 'open', 'since', now)
end
redis.call('ZADD', 'holds:'..scene..':'..pick, now + holdMs, ARGV[4])
redis.call('ZADD', KEYS[1], eff(pick), pick)
return { pick, why, eff(pick) }
```

**Birleştirme.** Bir shard 10 dakikadan uzun süre 8 kişinin altında kalırsa `status = draining`: yeni giriş almaz, içindekiler çıktıkça `closed` olur, kimse zorla taşınmaz (B1 §11.2). Dağıtım (deploy) sırasında pod `scene.closing{reason:"deploy"}` yayar; istemci yeni bilet alıp başka pod'daki shard'a geçer.

**Bağlantı kopması (B1 §11.4).** Bağlantı kopunca avatar 30 sn *hayalet* kalır (`ghostUntil`), sonra kaldırılır; geri gelen oyuncu `player:loc`'tan aynı shard ve hücreye döner. Savunma ve Semt Sınavı sırasında sahne değişikliği sunucuda kilitlidir (`SCENE_LOCKED`); ders durumu zaten sunucudadır, bağlantı kopması kartı kaybettirmez.

### 6.5 Hareket senkronizasyonu

**Tick ve ağ.** Shard aktörü 5 Hz (200 ms) çalışır: kuyruktaki komutları işler, süresi dolan hayaletleri kaldırır, **değişiklik varsa** tek bir `scene.delta` yayınlar. Hareket "tıkla-yürü" olduğundan konum akışı yoktur: her `MoveTo` bir *yol* üretir (`path` hücre dizisi + başlangıç zamanı `t0` + `speed`), istemciler bu yol üzerinde kendi saatleriyle ilerler. 40 avatarın hepsi yürüse bile tick başına tek ileti vardır; boştaki sahnede ağ trafiği sıfırdır.

**Ara değerleme bildirimi (B8 sözleşmesi).** Sunucu `serverTime`'ı snapshot ve her delta içinde yollar; istemci saat farkını (offset) ilk üç delta'dan kestirir ve uzak avatarları **200 ms geride** (1 tick tampon) çizer, kendi avatarını ise tıklandığı anda yerelde başlatır (tahmin) ve `move.ack` ile uzlaştırır. Avatarın `t` anındaki hücresi `path[ min(len−1, ⌊speed × (t − t0)/1000⌋) ]`'dir; hücreler arası piksel ara değerleme istemcidedir.

**Konum doğrulama (sırayla; ilk başarısızlıkta reddedilir, `move.ack{accepted:false, reason}` + gerekirse düzeltme):**

1. Hız sınırı: `MoveTo` ≤ 4/sn (jeton kovası); aşımda yok sayılır, 5 ihlal/dk → bağlantı düşürülür ve `abuse` sayacı artar.
2. Hedef hücre sahne sınırları içinde ve `walkable` (istemciyle **aynı** `walkableHash` sürümü; sürüm farkı → `Resync`).
3. Başlangıç, avatarın *sunucudaki* ara değerlenmiş hücresidir; istemcinin bildirdiği konuma güvenilmez.
4. Yol sunucuda A* ile (4 komşu) üretilir; uzunluk ≤ 60 tile (B1 §10.1). İstemcinin yolu kabul edilmez.
5. Hız sabittir: 4 tile/sn (B1 §10.1); sunucu `t0`'ı kendi saatinden koyar, istemci saatine güvenilmez.
6. Etkileşim menzili: `Interact` hedefi avatarın 2 tile içinde olmalı; kapılarda yetki (kilitli semt, Oda izni, kapasite) kontrol edilir.
7. Aynı hücrede en çok 2 avatar (B1 §11.3, hafif ofsetle); engel olmaz ama sayı aşılırsa en yakın boş hücreye yapıştırılır.
8. Savunma/Semt Sınavı kilidi: sahne dışına `Interact` reddedilir.

A* maliyeti: 40 × 40 ızgarada ≈ 50–200 µs; shard başına 40 avatar × saniyede 1 tıklama = 40 A*/sn; 400 shard için 16.000 A*/sn ≈ 1–3 vCPU (hub pod'ları arasında dağılmış), yol önbelleği (`(start, goal, mapHash)` anahtarı) ile yarıya iner.

---

### 6.6 Presence

Presence üç şeydir ve üçü de **kısa ömürlü Redis anahtarıdır**; veri tabanına yazılmaz. (1) *Çevrimiçi*: `presence:{playerId}` her 15 sn'de bir yenilenir (TTL 90 sn); (2) *Konum*: `player:loc:{playerId}` (sahne, shard, hücre); (3) *Hayalet*: bağlantı kopunca 30 sn `ghostUntil`. Arkadaş listesindeki "çevrimiçi" göstergesi (`GET /v1/friends/presence`, `presence.friend` olayı) yalnızca arkadaşlığın iki tarafında da `show_online = true` ise ve 15–17 yaş için yalnızca *karşılıklı onaylı* arkadaşlar arasında görünür (güvenli mod, VİZYON §9). "Arkadaşa git" yalnızca arkadaşın konumunu `player:loc`'tan okur; Kürsü ve Savunma'ya takip yoktur (B1 §10.3), Oda kilitliyse kapı önüne düşülür.

### 6.7 Ölçekleme

**Pod başına bağlantı bütçesi (2 vCPU / 2 GB `hub` pod'u).** Bağlantı başına ≈ 100 KB (SignalR + soket + oturum durumu) ve ortalama 40 avatarlık shard başına ≈ 50 KB aktör durumu: 2.500 bağlantı ≈ 250 MB + 60 shard × 50 KB ≈ 260 MB; bellek bütçesi 1 GB'ın altında kalır. CPU: shard başına 5 Hz × 40 alıcı = 200 yazma/sn; 60 shard ≈ 12.000 soket yazması/sn ve tick başına tek JSON serileştirme (alıcı sayısına bölünür) ≈ **0,6–1,0 vCPU**; A* ve doğrulama ≈ 0,2 vCPU. Bu yüzden bütçe **pod başına 2.500 bağlantı (≈ 60 shard)**, tepe %70 doluluk hedefidir (HPA eşiği 1.750). Giden bant: hareket eden avatar oranı %20 varsayımıyla tick başına ≈ 250 B × 40 alıcı = 10 KB; shard başına 50 KB/sn, pod başına ≈ **3 MB/sn (≈ 24 Mbit/sn)**; MessagePack + sıkıştırma ile ≈ 3× azalır.

| Büyüklük | 1k DAU | 10k DAU | 100k DAU | Not |
|---|---|---|---|---|
| Tepe eşzamanlı bağlantı | 120 | 1.200 | 12.000 | DAU × %12 |
| Aktif shard (ort. doluluk 30) | 4 | 40 | 400 | Meydan ağırlıklı; Kürsü/Oda/İşletme içi tek örnekler ayrıca |
| Hub pod sayısı (2.500 bağlantı + 1 yedek) | 2 | 2 | 6 | HPA eşiği 1.750; dağıtım sırasında 1 yedek |
| Tepe giden bant (pod başına tavan 24 Mbit/sn) | ≈ 1 Mbit/sn | ≈ 12 Mbit/sn | ≈ 120 Mbit/sn | JSON; MessagePack ile ≈ 1/3 |
| Redis backplane iletisi (kullanıcı olayı) | ≈ 1/sn | ≈ 10/sn | ≈ 100/sn | ≈ 30 olay/oyuncu/saat |
| Redis presence yazması | ≈ 8/sn | ≈ 80/sn | ≈ 800/sn | 15 sn'de bir yenileme |
| A* hesabı | ≈ 160/sn | ≈ 1.600/sn | ≈ 16.000/sn | ≈ 0,02 / 0,2 / 2 vCPU |
| Redis topolojisi | tek düğüm + replika | tek düğüm + replika | Sentinel (3 düğüm) | Kuyruk Redis'i ile **ayrı** örnek (ADR-12 notu) |

**Neden shard'a sabit pod?** Backplane'e güvenip her iletiyi Redis üzerinden yaymak, 100k DAU'da saniyede ≈ 120.000 ileti ve 400 grup aboneliği demektir. Shard'ı bir pod'a bağlamak bu trafiği sıfırlar; bedeli pod ölümünde shard'ın yeniden kurulmasıdır (≤ 2 sn), ki bu kabul edilebilir çünkü sahne durumu kalıcı değil türetilmiş bir görünümdür. **Yedek plan:** tutarlı karma şu yapılandırmayla dağıtılır; pod eklemek/çıkarmak yalnızca yeni bilet alan oyuncuları etkiler, mevcut bağlantılar kopmaz.

```yaml
# ingress-nginx: shard'a göre tutarlı karma, WebSocket zaman aşımı
metadata:
  annotations:
    nginx.ingress.kubernetes.io/upstream-hash-by: "$arg_shard"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
```

### 6.8 Hub iskeleti (C#)

Aşağıdaki iskelet derlenir (`// [derlenir]` işaretli bloklar CI'da proje olarak derlenir). Sunucu otoriterdir: `MoveTo` yalnızca *niyet*, yol ve zaman sunucuda üretilir; shard aktörü tek okuyuculu bir `Channel` üzerinde komutları sırayla işler (kilit gerekmez), 200 ms'lik tick'te toplu `scene.delta` yayar. Bilet `GETDEL` ile tek kullanımlıktır.

```csharp
// [derlenir] WorldHub.cs
using System.Collections.Concurrent;
using System.Text.Json;
using System.Threading.Channels;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace KodKent.Hub;

public readonly record struct Cell(int X, int Y);

public sealed record TicketInfo(Guid PlayerId, string Handle, string Scene, string Shard, int SpawnX, int SpawnY);

/// <summary>Sahne ızgarası (B1 §1.2). walkable bit kümesi istemciyle AYNI dosyadan gelir; Hash sürüm uyumunu denetler.</summary>
public sealed class SceneMap(int width, int height, byte[] bits, string hash)
{
    public int Width => width; public int Height => height; public string Hash => hash;
    public bool Walkable(int x, int y) =>
        x >= 0 && y >= 0 && x < width && y < height && (bits[(y * width + x) >> 3] & (1 << ((y * width + x) & 7))) != 0;

    /// <summary>4 komşulu A* (B1 §10.1: yol ≤ 60 tile). Dönüş: başlangıç hücresi DAHİL yol; yoksa null.</summary>
    public Cell[]? FindPath(Cell from, Cell to, int maxLen = 60)
    {
        if (!Walkable(to.X, to.Y) || from == to) return null;
        var open = new PriorityQueue<Cell, int>();
        var g = new Dictionary<Cell, int> { [from] = 0 };
        var prev = new Dictionary<Cell, Cell>();
        open.Enqueue(from, H(from, to));
        (int dx, int dy)[] dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)];
        while (open.TryDequeue(out var cur, out _))
        {
            if (cur == to)
            {
                var path = new List<Cell> { to };
                for (var c = to; c != from; c = prev[c]) path.Add(prev[c]);
                path.Reverse();
                return path.Count - 1 <= maxLen ? path.ToArray() : null;
            }
            foreach (var (dx, dy) in dirs)
            {
                var n = new Cell(cur.X + dx, cur.Y + dy);
                int ng = g[cur] + 1;
                if (ng > maxLen || !Walkable(n.X, n.Y) || (g.TryGetValue(n, out var old) && old <= ng)) continue;
                g[n] = ng; prev[n] = cur; open.Enqueue(n, ng + H(n, to));
            }
        }
        return null;
    }
    static int H(Cell a, Cell b) => Math.Abs(a.X - b.X) + Math.Abs(a.Y - b.Y);
}

public sealed class Avatar(Guid id, string handle, Cell spawn, long now)
{
    public Guid Id => id; public string Handle => handle;
    public Cell[] Path = [spawn];                // [0] = t0 anındaki hücre
    public long T0 = now, GhostUntil;            // ms; GhostUntil = 0 → bağlı
    public double Tokens = 8; public long TokenAt = now;
}

/// <summary>Bir shard'ın otoriter durumu: tek okuyuculu kanal + 5 Hz tick.</summary>
public sealed class ShardActor : IDisposable
{
    public const double Speed = 4.0;             // tile/sn (B1 §10.1)
    const int TickMs = 200, GhostMs = 30_000;
    readonly string _id; readonly SceneMap _map; readonly IHubContext<WorldHub> _hub;
    readonly Channel<Func<Task>> _inbox = Channel.CreateBounded<Func<Task>>(
        new BoundedChannelOptions(1024) { SingleReader = true, FullMode = BoundedChannelFullMode.DropWrite });
    readonly Dictionary<Guid, Avatar> _avatars = [];
    readonly List<object> _moved = [], _joined = []; readonly List<Guid> _left = [];
    readonly CancellationTokenSource _cts = new(); long _tick;

    public ShardActor(string id, SceneMap map, IHubContext<WorldHub> hub)
    {
        (_id, _map, _hub) = (id, map, hub);
        _ = Task.Run(async () => { await foreach (var cmd in _inbox.Reader.ReadAllAsync(_cts.Token)) await cmd(); });
        _ = Task.Run(async () =>
        {
            using var t = new PeriodicTimer(TimeSpan.FromMilliseconds(TickMs));
            while (await t.WaitForNextTickAsync(_cts.Token)) Post(TickAsync);
        });
    }

    static long Now() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    void Post(Func<Task> cmd) => _inbox.Writer.TryWrite(cmd);

    Cell CellAt(Avatar a, long now) =>
        a.Path[Math.Min(a.Path.Length - 1, (int)(Speed * (now - a.T0) / 1000.0))];     // §6.5 formülü

    public void Join(Guid id, string handle, Cell spawn, string connectionId) => Post(async () =>
    {
        var a = new Avatar(id, handle, spawn, Now());
        _avatars[id] = a; _joined.Add(new { id, handle, pos = new[] { spawn.X, spawn.Y } });
        await _hub.Clients.Client(connectionId).SendAsync("scene.snapshot", new
        {
            shard = _id, tick = _tick, serverTime = Now(), mapHash = _map.Hash,
            avatars = _avatars.Values.Select(v => new { id = v.Id, handle = v.Handle, pos = new[] { CellAt(v, Now()).X, CellAt(v, Now()).Y } })
        });
    });

    public void MoveTo(Guid id, int seq, int gx, int gy, string connectionId) => Post(async () =>
    {
        if (!_avatars.TryGetValue(id, out var a)) return;
        var now = Now();
        a.Tokens = Math.Min(8, a.Tokens + (now - a.TokenAt) / 1000.0 * 4); a.TokenAt = now;     // 4/sn jeton kovası
        if (a.Tokens < 1) return;
        a.Tokens -= 1;
        var path = _map.FindPath(CellAt(a, now), new Cell(gx, gy));                              // başlangıç SUNUCUDA hesaplanır
        if (path is null)
        {
            await _hub.Clients.Client(connectionId).SendAsync("move.ack", new { seq, accepted = false, reason = "no_path" });
            return;
        }
        a.Path = path; a.T0 = now;
        var wire = path.Select(c => new[] { c.X, c.Y }).ToArray();
        _moved.Add(new { id, t0 = now, speed = Speed, path = wire });
        await _hub.Clients.Client(connectionId).SendAsync("move.ack", new { seq, accepted = true, t0 = now, path = wire });
    });

    public void Disconnect(Guid id) => Post(() => { if (_avatars.TryGetValue(id, out var a)) a.GhostUntil = Now() + GhostMs; return Task.CompletedTask; });

    async Task TickAsync()
    {
        var now = Now(); _tick++;
        foreach (var a in _avatars.Values.Where(v => v.GhostUntil != 0 && v.GhostUntil < now).ToList())
        { _avatars.Remove(a.Id); _left.Add(a.Id); }                                              // hayalet süresi doldu
        if (_moved.Count + _joined.Count + _left.Count == 0) return;                             // değişiklik yoksa ağ trafiği yok
        var delta = new { tick = _tick, t = now, moved = _moved.ToArray(), joined = _joined.ToArray(), left = _left.ToArray() };
        _moved.Clear(); _joined.Clear(); _left.Clear();
        await _hub.Clients.Group($"shard:{_id}").SendAsync("scene.delta", delta);
    }

    public void Dispose() { _cts.Cancel(); _inbox.Writer.TryComplete(); }
}

public sealed class ShardRegistry(IHubContext<WorldHub> hub, Func<string, SceneMap> maps)
{
    readonly ConcurrentDictionary<string, ShardActor> _shards = new();
    public ShardActor Get(string shardId) => _shards.GetOrAdd(shardId, id => new ShardActor(id, maps(id), hub));
}

/// <summary>Kimlik: JWT değil, REST'ten alınan 15 sn'lik tek kullanımlık bilet (URL'de JWT taşınmaz).</summary>
public sealed class WorldHub(ShardRegistry shards, IConnectionMultiplexer redis) : Microsoft.AspNetCore.SignalR.Hub
{
    public override async Task OnConnectedAsync()
    {
        var q = Context.GetHttpContext()!.Request.Query;
        var raw = await redis.GetDatabase().StringGetDeleteAsync($"ticket:{q["ticket"]}");       // GETDEL: tek kullanım
        var t = raw.IsNullOrEmpty ? null : JsonSerializer.Deserialize<TicketInfo>(raw.ToString());
        if (t is null || t.Shard != q["shard"]) { Context.Abort(); return; }

        Context.Items["pid"] = t.PlayerId; Context.Items["shard"] = t.Shard;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"shard:{t.Shard}");
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{t.PlayerId}");                // api/worker pod'ları buraya backplane ile yazar
        shards.Get(t.Shard).Join(t.PlayerId, t.Handle, new Cell(t.SpawnX, t.SpawnY), Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public Task MoveTo(int seq, int gx, int gy)
    {
        shards.Get((string)Context.Items["shard"]!).MoveTo((Guid)Context.Items["pid"]!, seq, gx, gy, Context.ConnectionId);
        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.Items["shard"] is string s && Context.Items["pid"] is Guid p) shards.Get(s).Disconnect(p);
        return base.OnDisconnectedAsync(exception);
    }
}

public static class HubWiring
{
    public static void AddKodKentHubs(this IServiceCollection services, string redisConnection)
    {
        services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(redisConnection));
        services.AddSignalR(o =>
        {
            o.KeepAliveInterval = TimeSpan.FromSeconds(15);
            o.ClientTimeoutInterval = TimeSpan.FromSeconds(45);
            o.MaximumReceiveMessageSize = 32 * 1024;
        }).AddStackExchangeRedis(redisConnection, o => o.Configuration.ChannelPrefix = RedisChannel.Literal("kodkent"));
        services.AddSingleton(sp => new ShardRegistry(sp.GetRequiredService<IHubContext<WorldHub>>(), id => throw new NotImplementedException("sahne haritası yükleyici")));
    }
}
```

---

## 7. Asenkron işler ve kuyruklar

### 7.1 Teknoloji kararı ve ilkeler

Kuyruk teknolojisi **Redis Streams**'tir (ADR-12; KANON §9 "Redis kuyruğu"). Gerekçeler: (1) sandbox bölgesi yalnızca Redis ile konuşabilir, veri tabanı kimlik bilgisi taşımaz; (2) tüketici grupları ve `XAUTOCLAIM` çöken tüketicinin işini başkasına devreder; (3) gecikme milisaniye altı, saniyede on binlerce ileti; (4) öncelik ayrı akışlarla ifade edilir. Eksikleri bilinçle telafi edilir: Streams'te gecikmeli teslim yoktur → *gecikmeli kuyruk* ZSET + taşıyıcı ile; kalıcılık AOF `everysec` olduğundan olası kayıp ≤ 1 sn → **iş kaynağı her zaman veri tabanıdır** (outbox, `grading_submissions.status`, `submissions.status`): kayıp bir ileti, durumu `queued` kalan satırı yeniden kuyruğa alan *kurtarma taraması* (her dakika) ile geri gelir.

Dört ilke tüm kuyruklar için geçerlidir: **en az bir kez teslim** (tüketici idempotent olmak zorundadır); **iş son tarihi** (her ileti `deadlineMs` taşır; süresi geçmiş işi çalıştırmak yerine başarısız sayılır); **adalet** (oyuncu başına eşzamanlı iş sınırı, tek oyuncu havuzu dolduramaz); **geri basınç** (kuyruk gecikmesi eşiği aşınca yeni *düşük öncelikli* iş kabul edilmez, etkileşimli iş sonuna kadar kabul edilir).

### 7.2 Kuyruk kataloğu

| Kuyruk | Akışlar (Redis) | Üretici → tüketici | Yük (özet) | Eşzamanlılık | Hedef (gecikme) | Zaman aşımı |
|---|---|---|---|---|---|---|
| `code-run` | `q:code-run:p0` (etkileşimli), `q:code-run:p1` (toplu); sonuç `q:code-run:results` | `api` (Challenge) / `worker` (income) → `sandbox-agent`; sonuç → `worker` (result handler) | `{jobId, kind, challengeId, source\|peRef, tests, limits, nonce}` | Düğüm başına ısıtılmış havuz kadar (8–10) | p0: kuyrukta ≤ 1 sn, uçtan uca p95 < 6 sn (KANON); p1: ≤ 5 dk | 10 sn duvar saati (KANON) + 2 sn pay |
| `ai-grade` | `q:ai-grade:p0` (ders/Savunma/itiraz), `q:ai-grade:p1` (Batch sonuçları, toplu) | `api`/`worker` → `worker` (AI hattı) | `{submissionId, stage}` | Model başına köprü: Haiku 128, Sonnet 64, Opus 16 (hız sınırına göre ayarlı) | p95 < 4 sn (VİZYON) | 25 sn (Opus ikinci okuma dâhil) |
| `income-tick` | `q:income-tick:p0` (kod güncellemesi sonrası yeniden hesap), `q:income-tick:p1` (gece partileri, rollover) | cron / `worker` → `worker` | `{kind:"RunBusinesses"\|"Recompute"\|"Rollover", day, range\|businessId}` | 4 | Gece pencere 03:00–04:00 TR'de bitmeli | 5 dk (parti başına) |
| `notification` | `q:notification:p0` (anlık: veli SMS hatırlatma, güvenlik), `q:notification:p1` (Web Push, gelen kutusu) | olay işleyicileri → `worker` | `{playerId, kind, payload, coalesceKey}` | 32 | p0 ≤ 5 sn; p1 ≤ 60 sn | 10 sn |
| `moderation` | `q:moderation:p0` (takma ad / işletme adı, kayıt akışını bloklar), `q:moderation:p1` (sohbet sonrası inceleme, şikâyet toplama) | `api`/`hub` → `worker` (Haiku) | `{kind, subjectId, text, locale}` | 32 | p0 ≤ 1,5 sn; p1 ≤ 10 sn | 8 sn |
| `privacy` | `q:privacy:p1` | cron / `api` → `worker` | `{requestId, kind:"export"\|"erasure"}` | 2 | 24 saat içinde (yasal 30 gün) | 30 dk |
| `outbox` (kuyruk değil, röle) | — | `platform.outbox_messages` → olay işleyicileri | alan olayları | 8 bölüm anahtarlı (`aggregate`) | ≈ 50 ms | — |

**OTP gönderimi kuyruğa girmez.** Girişin kritik yolu olduğundan `api` içinde *senkron*, 2 sn zaman aşımı ve devre kesiciyle çağrılır; birincil sağlayıcı hata/zaman aşımı verirse aynı istekte yedek sağlayıcıya geçilir (§11.2). Yalnızca veli hatırlatma SMS'leri `notification:p0`'dan gider.

**İleti zarfı.** Her akış girdisi tek alan taşır: `env` = zarf JSON'u.

```json
{ "messageId": "0193a4e0-0b22-7c33-8d44-5e66f7a8b9c0", "type": "code-run/tests", "idempotencyKey": "run:0193a4e0-0b22-7c33-8d44-5e66f7a8b9c0",
  "attempt": 0, "enqueuedAtMs": 1730582043200, "deadlineMs": 1730582055200,
  "payload": { "challengeId": "otopark-L1", "challengeVersion": 2, "submissionId": "0193a4e0-0b22-7c33-8d44-5e66f7a8b9c0" } }
```

### 7.3 Yeniden deneme, ölü mektup ve öncelik

| Deneme | Gecikme (±%20 jitter) | Not |
|---|---|---|
| 1 → 2 | 2 sn | Geçici hatalar (ağ, 429, 5xx) |
| 2 → 3 | 4 sn | |
| 3 → 4 | 8 sn | |
| 4 → 5 | 16 sn | |
| 5 → DLQ | 32 sn sonra son deneme; başarısızsa `q:{kuyruk}:dlq` | Alarm: DLQ derinliği > 0 |

Kalıcı hata (şema ihlali, politika ihlali, `NotFound`) *yeniden denenmez*: tüketici `PermanentFailureException` fırlatır, ileti doğrudan DLQ'ya ya da duruma göre `failed` yazılarak kapanır. DLQ iletileri `platform.job_dead_letters`'a da kopyalanır ve yönetici paneli `POST /v1/admin/queues/{queue}/dead-letters/{id}/requeues` ile yeniden kuyruğa alır (denemeler sıfırlanır, **idempotency anahtarı aynı** kalır, böylece çift yan etki oluşmaz).

**Öncelik.** p0 akışı p1'den önce okunur. Gündüz (06:00–24:00 TR) sandbox havuzunun en çok %50'si p1 için ayrılır, geri kalanı p0'a saklanır; gece (00:00–06:00) p1 tüm havuzu kullanır. Adalet: oyuncu başına en çok 2 eşzamanlı `code-run` (3. istek kuyrukta bekler, 429 değil) ve `RL-RUN` jeton kovası. Geri basınç: `q:code-run:p1` gecikmesi > 5 dk ise yeni toplu iş üretilmez (gece partisi küçük dilimlere bölünür); `p0` gecikmesi > 8 sn ise `api` yeni gönderimi `503 SANDBOX_BUSY` ile reddeder (nadir).

**İdempotency.** Tüketici, yan etkisini yazdığı veri tabanı işleminde `platform.inbox_messages (consumer, message_id)` kaydını da ekler; çakışma = daha önce işlenmiş, iş atlanır. Yan etki doğal anahtara sahipse (defter, `xp_events`) inbox ek güvencedir. Sandbox işleri saf fonksiyondur (aynı kod + aynı girdi → aynı sonuç), tekrar çalıştırmak zararsızdır; sonuç işleyicisi `submissions.status` geçişini `UPDATE … WHERE status IN ('queued','running')` ile yaparak ikinci sonucu yok sayar.

### 7.4 Kuyruk tüketici tabanı (C#)

Tüm `worker` tüketicileri aynı tabanı kullanır: tüketici grubu okuması, `XAUTOCLAIM` ile çökmüş işi devralma, iş son tarihi, üstel geri çekilme, DLQ ve gecikmeli teslim taşıyıcısı.

```csharp
// [derlenir] StreamWorker.cs
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace KodKent.Platform.Queues;

public sealed record Envelope(string MessageId, string Type, string IdempotencyKey, int Attempt, long EnqueuedAtMs, long DeadlineMs, JsonElement Payload);
public sealed class PermanentFailureException(string message) : Exception(message);

public abstract class StreamWorker(IConnectionMultiplexer redis, ILogger logger, string stream, string group, string consumer, int concurrency = 8) : BackgroundService
{
    static readonly int[] BackoffSec = [2, 4, 8, 16, 32];                       // 5 deneme sonra DLQ (§7.3)
    static long Now() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    /// <summary>İdempotent olmalı: en az bir kez teslim edilir.</summary>
    protected abstract Task HandleAsync(Envelope msg, CancellationToken ct);

    public static Task EnqueueAsync(IDatabase db, string stream, Envelope env) =>
        db.StreamAddAsync(stream, "env", JsonSerializer.Serialize(env), maxLength: 100_000, useApproximateMaxLength: true);

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        var db = redis.GetDatabase();
        try { await db.StreamCreateConsumerGroupAsync(stream, group, "$", createStream: true); }
        catch (RedisServerException e) when (e.Message.StartsWith("BUSYGROUP")) { }

        using var gate = new SemaphoreSlim(concurrency);
        while (!ct.IsCancellationRequested)
        {
            // 1) Çöken tüketicilerden 30 sn'dir boşta bekleyen işleri devral
            var claimed = await db.StreamAutoClaimAsync(stream, group, consumer, 30_000, "0-0", count: 16);
            foreach (var e in claimed.ClaimedEntries) { await gate.WaitAsync(ct); _ = ProcessAsync(db, e, gate, ct); }

            // 2) Yeni işler (Redis Streams'te XREADGROUP BLOCK SE.Redis'te yok: kısa yoklama, boşta 25 ms)
            var entries = await db.StreamReadGroupAsync(stream, group, consumer, ">", count: Math.Min(16, concurrency));
            if (entries.Length == 0) { await Task.Delay(25, ct); continue; }
            foreach (var e in entries) { await gate.WaitAsync(ct); _ = ProcessAsync(db, e, gate, ct); }
        }
    }

    async Task ProcessAsync(IDatabase db, StreamEntry entry, SemaphoreSlim gate, CancellationToken ct)
    {
        Envelope? env = null;
        try
        {
            env = JsonSerializer.Deserialize<Envelope>((string)entry["env"]!)!;
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromMilliseconds(Math.Max(1, env.DeadlineMs - Now())));      // iş son tarihi
            await HandleAsync(env, cts.Token);
            await db.StreamAcknowledgeAsync(stream, group, entry.Id);
        }
        catch (Exception ex) when (!ct.IsCancellationRequested)
        {
            logger.LogWarning(ex, "iş başarısız {Stream} {Id} deneme={Attempt}", stream, entry.Id, env?.Attempt);
            await RetryOrDeadLetterAsync(db, entry, env, ex);
        }
        finally { gate.Release(); }
    }

    async Task RetryOrDeadLetterAsync(IDatabase db, StreamEntry entry, Envelope? env, Exception ex)
    {
        if (env is null || ex is PermanentFailureException || env.Attempt >= BackoffSec.Length)
        {
            await db.StreamAddAsync($"{stream}:dlq", [new NameValueEntry("env", (string?)entry["env"]), new NameValueEntry("error", ex.Message)]);
        }
        else
        {
            var next = env with { Attempt = env.Attempt + 1 };
            double delayMs = BackoffSec[env.Attempt] * 1000.0 * (0.8 + Random.Shared.NextDouble() * 0.4);   // ±%20 jitter
            var member = JsonSerializer.Serialize(new { stream, env = JsonSerializer.Serialize(next) });
            await db.SortedSetAddAsync("q:delayed", member, Now() + delayMs);                        // gecikmeli teslim
        }
        await db.StreamAcknowledgeAsync(stream, group, entry.Id);
    }
}

/// <summary>Gecikmeli kuyruktaki vadesi gelen işleri atomik olarak ilgili akışa taşır.</summary>
public sealed class DelayMover(IConnectionMultiplexer redis) : BackgroundService
{
    const string Script = """
        local due = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, 200)
        for _, m in ipairs(due) do
          local e = cjson.decode(m)
          redis.call('XADD', e.stream, 'MAXLEN', '~', 100000, '*', 'env', e.env)
          redis.call('ZREM', KEYS[1], m)
        end
        return #due
        """;

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        var db = redis.GetDatabase();
        while (!ct.IsCancellationRequested)
        {
            await db.ScriptEvaluateAsync(Script, [new RedisKey("q:delayed")], [DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()]);
            await Task.Delay(250, ct);
        }
    }
}
```

### 7.5 Zamanlanmış işler (cron servisi)

Zamanlayıcı, `worker` pod'larından **yalnızca birinde** çalışır: lider, `pg_try_advisory_lock(hashtext('kodkent-cron'))` ile seçilir, kilidi kaybeden pod bırakır. `platform.scheduled_jobs` son/sonraki çalışma zamanını tutar; cron ifadeleri **Europe/Istanbul** saat dilimindedir (UTC+3 kalıcı). Zamanlayıcı iş *yapmaz*, ilgili kuyruğa ileti bırakır; böylece iş yeniden denenebilir ve ölçeklenebilir.

| İş | Zaman (TR) | Ne yapar | Kuyruk |
|---|---|---|---|
| `ai-nightly-batch` | 02:00 | `deferred_quota` cevaplarından Batch API isteği kurar, 5 dk'da bir izler, bitince sonuçları işler | `ai-grade:p1` |
| `income-nightly` | 03:00 | Açık/Deneme işletmeleri 500'lük dilimlere böler; her dilim için trafik üretir, `code-run:p1` işleri bırakır | `income-tick:p1` |
| `rollover-business-day` | 04:00 | Kasa hızlarını yeni günün `daily_bayt`'ına çevirir (toplu SQL), günlük sınırları sıfırlar (HB 3, kod okuma 3, Alkış 40 B), seri denetimi | `income-tick:p1` |
| `ledger-reconcile` | 05:00 | Defter mutabakatı (§9.6); fark varsa P1 alarmı | doğrudan |
| `ledger-digest-seal` | 05:30 | Günün hash özetini zincire ekler, WORM depoya yazar | doğrudan |
| `meydan-question` | her saat başı | Meydan Sorusu seçer, `scene.event` yayar | `notification:p1` |
| `cadde-rotation`, `led-feed-refresh` | her saat başı | Ana Cadde öne çıkan işletmeler (B1 `CADDE_ARSASI`), LED pano karışımı | — |
| `pazar-rotation` | Pazartesi 09:00 | Haftalık raf rotasyonu (B1 `PAZAR_ROTATION_TIME`), numaralı seri sayaçları | — |
| `league-close` | Pazar 21:00 | Lig kapanışı: sıralama, terfi/düşme, ödüller (`LEAGUE_REWARD`), Bildirim | `income-tick:p1` |
| `guardian-expire`, `guardian-reminders` | 15 dk / saat başı | 72 saati dolan onayları kapat; 24. ve 48. saatte hatırlatma SMS'i | `notification:p0` |
| `shard-janitor` | her dakika | Süresi dolmuş rezervasyonlar, `draining` shard'ların kapanışı, ölü pod shard'ları | — |
| `recover-queued` | her dakika | `queued` kalmış `submissions`/`grading_submissions` satırlarını yeniden kuyruğa al | ilgili |
| `partition-manager`, `retention-sweeper` | 03:30 | Gelecek ay bölümleri; saklama süresi dolan veriyi sil (§11.7) | `privacy:p1` |
| `erasure-executor`, `export-builder` | saat başı | Bekleme süresi dolan silmeleri uygula; indirme paketlerini hazırla | `privacy:p1` |
| `idempotency-cleanup` | saat başı | 24 saati geçen `idempotency_keys`; 90 gün geçen `otp_challenges` | — |
| `economy-rollup` | 06:00 | `daily_economy_stats`, KPI günlük özetleri (B2 §10.5 metrikleri) | — |

### 7.6 Gece işletme partisi: zaman çizelgesi

Gece partisi, sandbox'ı en çok yoran iştir ve *sabit bir pencerede bitmek* zorundadır, çünkü sabah 04:00'te kasa hızları yeni güne geçer.

| Saat (TR) | Olay | Süre bütçesi |
|---|---|---|
| 02:00 | AI Batch gönderimi (kota aşan cevaplar) | — |
| 03:00 | `income-nightly` dilimleri kuyruğa girer; her işletme için trafik (deterministik tohum, §9.1) üretilir, **saklı PE** ile `code-run:p1` işi bırakılır (yeniden derleme yok) | 5 dk |
| 03:05–03:45 | Sandbox havuzu yalnızca p1 işler: iş başına ≈ 0,3–0,6 sn (yükleme + 12–50 çağrı). 1k DAU: 800 iş ≈ 3 dk · 10k: 8.000 iş ≈ 11 dk · 100k: 80.000 iş ≈ 17 dk (planlama değeri 2 CPU-sn/iş ve §8.9 havuz boyutuyla) | 40 dk |
| 03:45–03:55 | Sonuç işleyici: referans tavanı uygulanır (`min(oyuncu, referans)`), `business_runs` yazılır, şikâyet balonları üretilir | 10 dk |
| 04:00 | `rollover-business-day`: kasa hızları toplu SQL ile güncellenir (`UPDATE … FROM business_runs`), önce eski hızla *settle* edilir | 1 dk |
| 04:01 | Eksik kalan işletmeler (zaman aşımı, kuyrukta kalan) **önceki günün hızıyla** devam eder; artık sonuç gelirse `revision` +1 ile ileri dönük uygulanır | — |

---

## 8. Sandbox altyapısı

### 8.1 Tehdit modeli ve güven bölgeleri

Sandbox, ürünün en riskli bileşenidir (VİZYON risk 2): milyonlarca satır *güvenilmeyen* C# kodunu, gerçek bir dosya sistemi ve çekirdek üzerinde derleyip çalıştırır. Saldırgan profili açıktır: kayıtlı, 15–25 yaşında, "hack" meraklısı ya da bedava Bayt peşinde bir oyuncu; kodunu sınırsız (hız sınırı içinde) deneyebilir ve her denemede geri bildirim alır. Hedefleri şunlardır: ana makineye ve kümeye erişim, gizli testleri ya da referans çözümü öğrenme, başkasının kodunu/verisini okuma, hizmeti durdurma, sonuç sahteciliği ve gelir sömürüsü. Savunma üç ilkeye dayanır:

1. **Oyuncu kodu yalnızca sandbox bölgesinde çalışır;** `api`, `hub` ve `worker` süreçleri onu hiçbir koşulda yüklemez.
2. **Karar hakemdedir.** Beklenen değerleri bilen *hakem* süreci güvenilir koddur; oyuncu kodunu çağıran *oyuncu* süreci beklenen değerleri hiç görmez. Oyuncu süreci yalnızca bir girdi alır ve bir yanıt döner; sonuç sahteciliği bu yüzden anlamsızdır (sahte yanıt, doğru yanıtı bilmeden işe yaramaz).
3. **Hiçbir katmana tek başına güvenilmez.** Statik politika aşılırsa gVisor, gVisor aşılırsa düğümde sır ve ağ yoktur.

| Bölge | İçerik | Güven | Erişebildiği | Erişemediği |
|---|---|---|---|---|
| Uygulama | `api`, `hub`, `worker` | Tam | PostgreSQL, Redis, anahtarlar, Anthropic/SMS/PSP | — |
| Redis | Kuyruk akışları | Aracı | Sadece akış verisi; ACL: sandbox kullanıcısı yalnızca `q:code-run*` akışlarına | — |
| Sandbox düğümü + ajan | `sandbox-agent`, containerd, `runsc` | Yarı güvenilir | Redis (sınırlı kullanıcı), yerel containerd | **DB, JWT/PSP/Anthropic anahtarı, iç ağ, bulut meta veri uç noktası** |
| gVisor kutusu: **hakem** | Roslyn, test koşucusu, beklenen değerler | Güvenilir kod, güvensiz ortam | Ajanla stdio, oyuncu süreciyle pipe | Ağ, kalıcı disk |
| gVisor kutusu: **oyuncu süreci** | Oyuncunun derlenmiş yöntemi | **Güvensiz** | Yalnızca `cagri` girdileri; kısıtlı BCL | Beklenen değerler, hakem belleği, dosya, ağ, yansıma |

### 8.2 Limit tablosu

KANON §9 sabitleri **aynen** uygulanır; altlarındaki sınırlar KANON'da olmayan, hakem ve ajan düzeyindeki *ek* korumalardır **(B7 önerisi)** ve Ek A'ya yazılmıştır.

| Kaynak | Sınır | Kaynak | Uygulayan katman | Aşımda sonuç |
|---|---|---|---|---|
| Bellek (container) | **256 MB** | KANON §9 | cgroup (`--memory 256m --memory-swap 256m`) | Container OOM-kill → ajan `calisma_hatasi` yazar, container yok edilir |
| Bellek (oyuncu süreci yığını) | 80 MB | B7 önerisi | `DOTNET_GCHeapHardLimit=0x5000000` | `OutOfMemoryException` → `bellek_asimi` (**ölçüldü**) |
| CPU | **2 vCPU** | KANON §9 | `--cpus 2` (cgroup `cpu.max`) | Yavaşlama → zaman aşımı |
| CPU süresi (oyuncu süreci) | 8 sn | B7 önerisi | `RLIMIT_CPU` (`kk-launch`) | SIGXCPU ile ölür |
| Duvar saati (iş) | **10 sn** | KANON §9 | Hakem `toplam_ms`; ajan 12 sn'de container'ı yok eder | Kalan testler `iptal` |
| Test başına | 1.500 ms | B7 önerisi | Hakem zaman aşımı → süreç ağacı öldürülür | `zaman_asimi` (**ölçüldü**) |
| Derleme | 3.000 ms | B7 önerisi | `Emit(cancellationToken)` | `KK0001 compile timeout` |
| Yükleme (modül başlatıcı) | 2.000 ms | B7 önerisi | `hazir` bekleme zaman aşımı | Süreç öldürülür |
| Kaynak kod | 32 KB | B7 önerisi | API (422) + hakem | `SOURCE_TOO_LARGE` |
| Dosya sistemi | **Salt okunur kök**; `/tmp` tmpfs 16 MB (`noexec,nosuid`), iş başına temizlenir | KANON §9 + B7 | `--read-only --tmpfs`; hakem `/tmp/p-{jobId}` oluşturup siler | Yazma hatası |
| Ağ | **Yok** | KANON §9 | `--network none` + runsc `network=none`; DNS yok | Bağlantı hatası |
| Süreç sayısı | 64 (container) / 16 (oyuncu uid) | B7 önerisi | `--pids-limit 64`, `RLIMIT_NPROC` | `fork` hatası |
| Açık dosya | 64 | B7 önerisi | `--ulimit nofile=64:64` | — |
| `stdout` yakalama | 16 KB | B7 önerisi | `Capped` yazıcı | Kesilir (**ölçüldü:** tam 16.384 karakter) |
| Protokol satırı | 64 KB; iş sonucu toplamı 1 MB | B7 önerisi | `LineReader`, ajan | `protokol_ihlali` / iş iptali |
| Isıtılmış container | **20** (MVP: 2 VM × 10) | KANON §9 | `SandboxPool` | — |
| Container ömrü | En çok 50 iş / 10 dk; ihlal görülen container hemen yok edilir | B7 önerisi | `SandboxPool` | Yenisi ısıtılır |
| Uçtan uca gecikme | **p95 < 6 sn** | KANON §9 | SLO + alarm (§13.4) | — |

### 8.3 Worker havuzu ve ısıtma

Havuz, düğüm başına bir `sandbox-agent` tarafından yönetilir. Her *yuva* (`SandboxSlot`), `nerdctl run -i --runtime io.containerd.runsc.v1 …` ile başlatılmış bir container'dır; `nerdctl` sürecinin stdio'su container'ın stdio'sudur, böylece ajan ile hakem arasında ek bir ağ ya da soket gerekmez. Isıtma, hakemin başlangıçta önemsiz bir sınıfı derlemesiyle (Roslyn JIT ısınması, §8.5 `Compile(...)` çağrısı) tanımlanır; hakem `ready` yazdığında yuva *ısıtılmış*tır. Soğuk Roslyn derlemesi ölçümde 1,6–2,7 sn sürerken ısıtılmış hakemde 39–170 ms'dir: p95 < 6 sn hedefi **ısıtmaya** bağlıdır.

| Durum | Anlam | Geçiş |
|---|---|---|
| `starting` | `nerdctl run` başladı; hakem açılıyor ve ısınıyor (≈ 2–4 sn) | → `idle` (`ready` geldi) |
| `idle` | Kanalda bekliyor | → `leased` (iş alındı) |
| `leased` | Bir iş koşuyor | → `idle` (temiz) ya da → `destroyed` (kirli) |
| `destroyed` | `nerdctl` süreci öldürüldü, container silindi | Havuz yenisini başlatır |

*Kirli* sayılan durumlar: zaman aşımı, `protokol_ihlali`, `calisma_hatasi`, politika ihlali, OOM, kesilmiş satır, beklenmeyen çıkış; ayrıca 50 iş ya da 10 dakika dolan container. Temiz bir container birden çok oyuncuya sırayla hizmet verebilir, çünkü her iş için **yeni bir oyuncu süreci** başlar, hakem iş başına özel `/tmp/p-{jobId}` dizini açıp siler ve hakemin belleğindeki beklenen değerleri oyuncu süreci okuyamaz. Boyutlandırma kuralı **(B7 önerisi)**: `yuva/VM = min(10, 2,5 × vCPU)`, eşzamanlı koşan iş üst sınırı `vCPU`; gündüz toplu (p1) işler için `⌊vCPU/2⌋` yuva ayrılır (§7.3). Boşta yuva ≈ 80 MB bellek (varsayım, H2'de ölçülür) ve ihmal edilebilir CPU tüketir.

```toml
# /var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl  (sandbox düğüm havuzu)
[plugins."io.containerd.cri.v1.runtime".containerd.runtimes.runsc]
  runtime_type = "io.containerd.runsc.v1"
[plugins."io.containerd.cri.v1.runtime".containerd.runtimes.runsc.options]
  TypeUrl = "io.containerd.runsc.v1.options"
  ConfigPath = "/etc/containerd/runsc.toml"
```

```toml
# /etc/containerd/runsc.toml  (bayrak adları gVisor sürümüne göre H2 PoC'de doğrulanır)
[runsc_config]
  platform = "systrap"      # KVM/iç içe sanallaştırma gerektirmez (Hetzner Cloud VM'lerinde çalışır)
  network = "none"
  file-access = "exclusive"
  overlay2 = "none"         # kök salt okunur; yazılabilir alan yalnızca tmpfs
  host-uds = "none"
```

```yaml
# Sandbox bölgesi: yalnızca Redis'e çıkış, hiçbir giriş
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: sandbox-agent-egress, namespace: kodkent-sandbox }
spec:
  podSelector: { matchLabels: { app: sandbox-agent } }
  policyTypes: [Ingress, Egress]
  ingress: []
  egress:
    - to: [ { namespaceSelector: { matchLabels: { name: data } }, podSelector: { matchLabels: { app: redis-queue } } } ]
      ports: [ { protocol: TCP, port: 6379 } ]
---
apiVersion: apps/v1
kind: DaemonSet
metadata: { name: sandbox-agent, namespace: kodkent-sandbox }
spec:
  selector: { matchLabels: { app: sandbox-agent } }
  template:
    metadata: { labels: { app: sandbox-agent } }
    spec:
      nodeSelector: { kodkent.dev/pool: sandbox }
      tolerations: [ { key: kodkent.dev/sandbox, operator: Exists, effect: NoSchedule } ]
      automountServiceAccountToken: false
      containers:
        - name: agent
          image: ghcr.io/kodkent/sandbox-agent@sha256:0000000000000000000000000000000000000000000000000000000000000000
          env:
            - { name: POOL_SIZE, value: "10" }
            - { name: SANDBOX_IMAGE, value: "ghcr.io/kodkent/sandbox@sha256:0000000000000000000000000000000000000000000000000000000000000000" }
            - name: REDIS_URL
              valueFrom: { secretKeyRef: { name: sandbox-redis, key: url } }   # yalnızca q:code-run* ACL'li kullanıcı
          volumeMounts: [ { name: containerd, mountPath: /run/containerd/containerd.sock } ]
          resources: { requests: { cpu: 250m, memory: 256Mi }, limits: { memory: 512Mi } }
      volumes: [ { name: containerd, hostPath: { path: /run/containerd/containerd.sock, type: Socket } } ]
```

### 8.4 Test runner protokolü (hakem ↔ oyuncu kodu)

Üç halka vardır ve hepsi **satır başına bir JSON nesnesi** (UTF-8, `\n` sonlu) konuşur: *ajan → hakem* (container stdin), *hakem → ajan* (container stdout), *hakem ↔ oyuncu süreci* (anonim pipe). Satır sınırları: ajan → hakem `job` ≤ 1 MB (PE ya da kaynak dâhil), hakem → ajan ≤ 64 KB, hakem → oyuncu `yukle` ≤ 1 MB (PE base64), diğerleri ≤ 64 KB.

**Ajan → hakem**

| `t` | Alanlar | Açıklama |
|---|---|---|
| `job` | `v` (=1), `job_id`, `kind` (`tests`\|`gelir`\|`savunma`\|`hata_bildirimi`), `challenge_id`, `entry {tip, metot}`, `source` **ya da** `pe` (base64), `limits {toplam_ms, derleme_ms, test_ms, stdout_kb}`, `tests[ {id, tur, girdi[], beklenen?, etiket, stdin?} ]` | `tur` ∈ `acik`, `gizli`, `tohumlu` (test nesnesi B5'in `{id, girdi, beklenen, etiket}` biçimi + `tur`/`stdin`). `beklenen` yoksa *ölçüm modu* (gece gelir hesabı: yalnızca `gercek` döner) |
| `bitir` | — | Hakemi kapatır |

**Hakem → ajan**

| `t` | Alanlar | Açıklama |
|---|---|---|
| `ready` | `v`, `runtime` | Isınma bitti, iş alınabilir |
| `derleme` | `job_id`, `ok`, `ms`, `cached`, `hatalar [ {kod, satir, sutun, ham} ]` | `ham` İngilizce Roslyn iletisidir (sunucu `content.error_translations` ile Türkçeye çevirir); `cached` = saklı PE kullanıldı |
| `politika` | `job_id`, `ok:false`, `ihlaller [ {kural, sembol, satir} ]` | Statik politika ihlali; çalıştırma yapılmaz |
| `test` | `job_id`, `id`, `tur`, `etiket`, `durum`; **yalnızca `acik`:** `ms`, `girdi`, `beklenen`, `gercek`, `stdout`; ölçüm modunda `gercek` | `durum` ∈ `gecti`, `kaldi`, `istisna`, `zaman_asimi`, `bellek_asimi`, `calisma_hatasi`, `protokol_ihlali`, `iptal`, `olculdu`. **Gizli/tohumlu testte girdi, beklenen, gerçek değer ve test başına süre yazılmaz** |
| `ozet` | `job_id`, `gecen`, `toplam`, `sure_ms` | İş bitti; `sure_ms` 100 ms'ye yuvarlıdır (zaman yan kanalı) |
| `hata` | `job_id`, `kod` (`COK_COKME`, `ICSEL`) | Oyuncu süreci üç kez yeniden başlatılmasına rağmen çöktü ya da hakem içsel hata verdi |

**Hakem ↔ oyuncu süreci**

| Yön | `t` | Alanlar | Açıklama |
|---|---|---|---|
| H → O | `yukle` | `pe`, `tip`, `metot`, `stdout_kb` | Toplanabilir `AssemblyLoadContext`'e yüklenir |
| O → H | `hazir` | — | Yükleme bitti (2 sn içinde gelmezse süreç öldürülür) |
| H → O | `cagri` | `id`, `girdi[]`, `stdin?` | Girdiler yöntemin parametre türlerine JSON'dan çözülür |
| O → H | `ret` | `id`, `deger`, `ms`, `stdout` | Yöntem döndü (`void` ise `deger` boş) |
| O → H | `err` | `id`, `ad`, `ms`, `stdout` | Yöntem istisna fırlattı (`ad` = tam tür adı); `beklenen {istisna}` ile eşleşirse `gecti` |
| H → O | `bitir` | — | Süreç kapanır |

`beklenen` üç biçimdedir: bir JSON değeri (sayılar ondalık eşitliğiyle karşılaştırılır), `{ "istisna": "System.ArgumentOutOfRangeException" }` ya da `{ "stdout": "Merhaba Defne" }` (Console çıktısı, sondaki boşluk kırpılarak; Ders 1.1 türü görevler). **Kurallar:** hakem yalnızca sıradaki `id`'ye ait `ret`/`err` kabul eder; biçimsiz, sahte ya da sıra dışı satır `protokol_ihlali` sayılır ve süreç öldürülür. Oyuncu süreci protokol kanalını `Console.SetOut`'tan önce edinir; oyuncu kodunun `Console.OpenStandardOutput`/`SetOut` çağırması politikayla yasaktır.

Aşağıdaki satırlar §8.5'teki harness'ın **gerçek çıktısından** alınmıştır (Otopark L1, doğru çözüm; 26 test; satırlar kısaltılmıştır):

```jsonl
{"v":1,"t":"ready","runtime":".NET 10.0.8"}
{"t":"derleme","job_id":"01TEST-ok","ok":true,"ms":134,"cached":false,"hatalar":[]}
{"t":"test","job_id":"01TEST-ok","id":"A1","tur":"acik","etiket":"açık","durum":"gecti","ms":20.3384,"girdi":[30],"beklenen":100,"gercek":100,"stdout":""}
{"t":"test","job_id":"01TEST-ok","id":"G1","tur":"gizli","etiket":"sınır/gizli","durum":"gecti"}
{"t":"test","job_id":"01TEST-ok","id":"S1","tur":"tohumlu","etiket":"tohumlu","durum":"gecti"}
{"t":"ozet","job_id":"01TEST-ok","gecen":26,"toplam":26,"sure_ms":300}
```

Aynı koşturmanın başarısız senaryolarından (her biri ayrı iş):

```jsonl
{"t":"derleme","job_id":"01TEST-syntax","ok":false,"ms":108,"cached":false,"hatalar":[{"kod":"CS1002","satir":3,"sutun":38,"ham":"; bekleniyor"}]}
{"t":"politika","job_id":"01TEST-io","ok":false,"ihlaller":[{"kural":"YASAK_API","sembol":"System.IO.File","satir":3},{"kural":"YASAK_API","sembol":"System.IO.File.ReadAllText(string)","satir":3}]}
{"t":"test","job_id":"01TEST-loop","id":"A5","tur":"acik","etiket":"açık","durum":"zaman_asimi","ms":null,"girdi":[361],"beklenen":250,"gercek":null,"stdout":null}
{"t":"test","job_id":"01TEST-throw","id":"E1","tur":"acik","etiket":"negatif","durum":"gecti","ms":21.9611,"girdi":[-1],"beklenen":{"istisna":"System.ArgumentOutOfRangeException"},"gercek":"System.ArgumentOutOfRangeException","stdout":""}
```

(`ham` iletinin Türkçe olması geliştirme makinesinin kültüründendir; üretimde `DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1` ile iletiler İngilizce sabitlenir ki CS koduna göre Türkçe çeviri tablosu ve Haiku çevirisi deterministik kalsın.)

### 8.5 Harness: çalışır test koşucusu (C#)

Aşağıdaki tek dosya, §8.4 protokolünün **çalışan** uygulamasıdır: `dotnet new console` + `dotnet add package Microsoft.CodeAnalysis.CSharp` (5.9.0) ile derlenir ve bir `job` satırını stdin'den okuyup sonuç satırlarını stdout'a yazar. İki rolü tek ikili içinde taşır: **hakem** (varsayılan mod) ve `--player` ile başlatılan **oyuncu süreci**. Tasarım kararları: (1) hakem *bellek içinde* derler (`Emit(MemoryStream)`), diske hiçbir şey yazılmaz; (2) statik politika, derlemeden sonra anlamsal modeldeki her sembolü yasak listesiyle karşılaştırır (yansıma, dosya, ağ, süreç, `Environment`, `GC`, `Activator`, protokol kanalını ele geçirebilecek `Console.Open*/Set*`); (3) beklenen değerler yalnızca hakemdedir, oyuncu süreci yalnızca girdi görür; (4) hakem uzun ömürlüdür (ısınma bir kez), oyuncu süreci her iş için yenidir ve çökerse en çok 3 kez yeniden başlatılır; (5) oyuncu çıktısı 16 KB'de kırpılır, protokol satırı 64 KB'de kesilir; (6) gizli ve tohumlu testlerde girdi, beklenen, gerçek değer ve test başına süre **asla** yazılmaz.

```csharp
﻿// KodKent.Sandbox.Harness — net10.0 — paket: Microsoft.CodeAnalysis.CSharp
// Tek dosya, iki rol: Judge (hakem; derler, test ister, karar verir) ve Player (oyuncu kodunu yükler, yalnızca çağrı yanıtlar).
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.Loader;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

return args is ["--player"] ? Player.Run() : await Judge.RunAsync();

// ───────────────────────────── JUDGE ─────────────────────────────
static class Judge
{
    static readonly Stream Proto = Console.OpenStandardOutput();             // ajanla protokol kanalı (stdout)
    static void Emit(JsonObject o) { lock (Proto) { Proto.Write(Encoding.UTF8.GetBytes(o.ToJsonString() + "\n")); Proto.Flush(); } }

    // Politika: ad alanı / tür / üye yasakları (KANON §9: reflection, FS, ağ yok)
    static readonly string[] DenyNs = ["System.Reflection", "System.Runtime.InteropServices", "System.Runtime.Loader",
        "System.Net.Sockets", "System.IO.Pipes", "System.IO.MemoryMappedFiles"];
    static readonly string[] DenyTypes = ["System.IO.File", "System.IO.Directory", "System.IO.FileInfo", "System.IO.DirectoryInfo",
        "System.IO.FileStream", "System.Diagnostics.Process", "System.Diagnostics.ProcessStartInfo", "System.Diagnostics.Debugger",
        "System.Threading.Thread", "System.AppDomain", "System.GC", "System.Activator", "System.Environment",
        "System.Runtime.CompilerServices.Unsafe", "System.Runtime.CompilerServices.RuntimeHelpers", "System.Runtime.CompilerServices.ModuleInitializerAttribute"];
    static readonly string[] AllowRefs = ["System.Private.CoreLib", "System.Runtime", "System.Collections", "System.Linq",
        "System.Console", "System.Text.RegularExpressions", "System.Memory", "System.Threading.Tasks"];

    public static async Task<int> RunAsync()
    {
        Compile("public static class Isinma { public static int F(int x) => x + 1; }");   // Roslyn JIT ısıtması: "ısıtılmış havuz"un tanımı
        Emit(new() { ["v"] = 1, ["t"] = "ready", ["runtime"] = RuntimeInformation.FrameworkDescription });
        var stdin = new StreamReader(Console.OpenStandardInput(), new UTF8Encoding(false));
        for (string? line; (line = stdin.ReadLine()) is not null;)
        {
            var job = JsonNode.Parse(line)!;
            if ((string?)job["t"] == "bitir") break;
            await RunJobAsync(job);                                                  // her iş sırayla; süreç çok kez kullanılır, oyuncu süreci her iş için yenidir
        }
        return 0;
    }

    static async Task RunJobAsync(JsonNode job)
    {
        string id = (string)job["job_id"]!;
        var lim = job["limits"]!;
        int testMs = (int)lim["test_ms"]!, totalMs = (int)lim["toplam_ms"]!, outKb = (int)lim["stdout_kb"]!;
        var wall = Stopwatch.StartNew();

        // 1) bellek içi derleme + statik politika
        byte[]? pe; JsonArray diag = new(), violations = new();
        if (job["pe"] is JsonValue saved) pe = Convert.FromBase64String((string)saved!);        // gece partisi: saklı PE, politika gönderimde denetlenmişti
        else (pe, diag, violations) = Compile((string)job["source"]!, (int)lim["derleme_ms"]!);
        Emit(new() { ["t"] = "derleme", ["job_id"] = id, ["ok"] = pe is not null, ["ms"] = wall.ElapsedMilliseconds, ["cached"] = job["pe"] is not null, ["hatalar"] = diag });
        if (pe is null) return;
        if (violations.Count > 0) { Emit(new() { ["t"] = "politika", ["job_id"] = id, ["ok"] = false, ["ihlaller"] = violations }); return; }

        // 2) oyuncu sürecini başlat, derlenmiş PE'yi gönder
        var entry = job["entry"]!;
        var p = await StartPlayerAsync(pe, entry, outKb);
        int passed = 0, total = 0, restarts = 0;
        foreach (var t in job["tests"]!.AsArray())
        {
            total++;
            string tur = (string)t!["tur"]!;
            var r = new JsonObject { ["t"] = "test", ["job_id"] = id, ["id"] = (string)t["id"]!, ["tur"] = tur, ["etiket"] = (string?)t["etiket"] };
            if (wall.ElapsedMilliseconds > totalMs) { r["durum"] = "iptal"; Emit(r); continue; }

            var (status, msg) = await CallAsync(p, new JsonObject { ["t"] = "cagri", ["id"] = (string)t["id"]!, ["girdi"] = t["girdi"]!.DeepClone(), ["stdin"] = (string?)t["stdin"] }, testMs);
            string durum; JsonNode? actual = null;
            if (status == "timeout") durum = "zaman_asimi";
            else if (status == "exit") durum = "calisma_hatasi";
            else if (status == "violation") durum = "protokol_ihlali";
            else if ((string)msg!["t"]! == "err")
            {
                var exp = (t["beklenen"] as JsonObject)?["istisna"]?.ToString();                     // {"istisna":"System.ArgumentOutOfRangeException"}
                string ad = (string)msg["ad"]!;
                durum = exp is not null && exp == ad ? "gecti" : ad == "System.OutOfMemoryException" ? "bellek_asimi" : "istisna";
                actual = msg["ad"]?.DeepClone();
            }
            else
            {
                actual = msg["deger"]?.DeepClone();
                if ((t["beklenen"] as JsonObject)?["stdout"] is JsonNode expOut)                      // {"stdout":"Merhaba Defne"}: Console çıktısı karşılaştırılır
                { actual = msg["stdout"]?.DeepClone(); durum = ((string)expOut!).TrimEnd() == ((string?)actual ?? "").TrimEnd() ? "gecti" : "kaldi"; }
                else durum = t["beklenen"] is null ? "olculdu" : JsonEq(t["beklenen"], actual) ? "gecti" : "kaldi";
            }
            if (durum == "gecti") passed++;
            r["durum"] = durum;
            if (tur == "acik") { r["ms"] = msg?["ms"]?.DeepClone(); r["girdi"] = t["girdi"]!.DeepClone(); r["beklenen"] = t["beklenen"]?.DeepClone(); r["gercek"] = actual; r["stdout"] = msg?["stdout"]?.DeepClone(); }
            else if (t["beklenen"] is null) r["gercek"] = actual;                     // gelir toplu çalıştırması: yalnızca ölçüm
            Emit(r);                                                                  // gizli/tohumlu testlerde girdi ve beklenen ASLA yazılmaz

            if (status is "timeout" or "exit" or "violation")                         // süreç öldü: en çok 3 kez yeniden başlat
            {
                if (++restarts > 3) { Emit(new() { ["t"] = "hata", ["job_id"] = id, ["kod"] = "COK_COKME" }); break; }
                p = await StartPlayerAsync(pe, entry, outKb);
            }
        }
        Kill(p);
        Emit(new() { ["t"] = "ozet", ["job_id"] = id, ["gecen"] = passed, ["toplam"] = total, ["sure_ms"] = wall.ElapsedMilliseconds / 100 * 100 });   // 100 ms'ye yuvarlı: zaman yan kanalı
    }

    static (byte[]? pe, JsonArray diag, JsonArray violations) Compile(string source, int timeoutMs = 3000)
    {
        using var cts = new CancellationTokenSource(timeoutMs);                      // derleme zehirleme: Emit iptal edilir
        var tree = CSharpSyntaxTree.ParseText(source, new CSharpParseOptions(LanguageVersion.Latest));
        var tpa = ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!).Split(Path.PathSeparator);
        var refs = tpa.Where(x => AllowRefs.Contains(Path.GetFileNameWithoutExtension(x))).Select(x => MetadataReference.CreateFromFile(x));
        var comp = CSharpCompilation.Create("oyuncu_" + Guid.NewGuid().ToString("N"), [tree], refs,
            new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary, optimizationLevel: OptimizationLevel.Release, allowUnsafe: false, concurrentBuild: false));
        using var ms = new MemoryStream();
        Microsoft.CodeAnalysis.Emit.EmitResult res;
        try { res = comp.Emit(ms, cancellationToken: cts.Token); }                    // diske hiçbir şey yazılmaz
        catch (OperationCanceledException)
        { return (null, new JsonArray(new JsonObject { ["kod"] = "KK0001", ["satir"] = 0, ["sutun"] = 0, ["ham"] = "compile timeout" }), new JsonArray()); }
        var diag = new JsonArray(); var viol = new JsonArray();
        foreach (var d in res.Diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error).Take(10))
        {
            var pos = d.Location.GetLineSpan().StartLinePosition;
            diag.Add(new JsonObject { ["kod"] = d.Id, ["satir"] = pos.Line + 1, ["sutun"] = pos.Character + 1, ["ham"] = d.GetMessage() });
        }
        if (!res.Success) return (null, diag, viol);

        var model = comp.GetSemanticModel(tree);
        foreach (var n in tree.GetRoot().DescendantNodes().OfType<SimpleNameSyntax>())
        {
            var s = model.GetSymbolInfo(n).Symbol; if (s is null) continue;
            var t = s as INamedTypeSymbol ?? s.ContainingType;
            string ns = (t?.ContainingNamespace ?? s.ContainingNamespace)?.ToDisplayString() ?? "", tn = t?.OriginalDefinition.ToDisplayString() ?? "";
            bool bad = DenyNs.Any(d => ns == d || ns.StartsWith(d + "."))
                    || (DenyTypes.Contains(tn) && !(tn == "System.Environment" && s.Name == "NewLine"))
                    || (tn == "System.Console" && (s.Name.StartsWith("Open") || s.Name.StartsWith("Set")));
            if (bad) viol.Add(new JsonObject { ["kural"] = "YASAK_API", ["sembol"] = s.ToDisplayString(), ["satir"] = n.GetLocation().GetLineSpan().StartLinePosition.Line + 1 });
        }
        return (ms.ToArray(), diag, viol);
    }

    static async Task<Process> StartPlayerAsync(byte[] pe, JsonNode entry, int outKb)
    {
        string exe = Environment.ProcessPath!, dll = Assembly.GetEntryAssembly()!.Location;
        var psi = Path.GetFileNameWithoutExtension(exe) == "dotnet" ? new ProcessStartInfo(exe) { ArgumentList = { dll, "--player" } } : new ProcessStartInfo(exe) { ArgumentList = { "--player" } };
        psi.RedirectStandardInput = psi.RedirectStandardOutput = psi.RedirectStandardError = true; psi.UseShellExecute = false;
        psi.StandardInputEncoding = new UTF8Encoding(false);
        psi.Environment["DOTNET_GCHeapHardLimit"] = "5000000";                        // onaltılık = 80 MB: OOM → OutOfMemoryException (container'ı öldürmeden)
        psi.Environment["DOTNET_EnableDiagnostics"] = "0";                            // tanılama IPC'si (/tmp soketi) kapalı
        psi.Environment["DOTNET_TieredPGO"] = "0";
        var p = Process.Start(psi)!;
        p.ErrorDataReceived += (_, _) => { }; p.BeginErrorReadLine();                 // stderr'i boşalt (kilitlenmeyi önler)
        Readers[p.Id] = new LineReader(p.StandardOutput.BaseStream, 64 * 1024);        // satır başına 64 KB sınırı
        p.StandardInput.WriteLine(new JsonObject { ["t"] = "yukle", ["pe"] = Convert.ToBase64String(pe), ["tip"] = (string)entry["tip"]!, ["metot"] = (string)entry["metot"]!, ["stdout_kb"] = outKb }.ToJsonString());
        p.StandardInput.Flush();
        var hello = Readers[p.Id].ReadLineAsync();                                    // "hazir": modül başlatıcıları (static ctor) süre sınırına tabidir
        if (await Task.WhenAny(hello, Task.Delay(2000)) != hello || await hello is null) Kill(p);
        return p;
    }

    static readonly Dictionary<int, LineReader> Readers = new();
    static void Kill(Process p) { try { Readers.Remove(p.Id); p.Kill(entireProcessTree: true); } catch { } }

    static async Task<(string status, JsonNode? msg)> CallAsync(Process p, JsonObject call, int timeoutMs)
    {
        try
        {
            await p.StandardInput.WriteLineAsync(call.ToJsonString()); await p.StandardInput.FlushAsync();
            var rd = Readers[p.Id];
            var read = rd.ReadLineAsync();
            if (await Task.WhenAny(read, Task.Delay(timeoutMs)) != read) { Kill(p); return ("timeout", null); }
            var line = await read; if (line is null) return ("exit", null);
            if (JsonNode.Parse(line) is not JsonObject m || m["id"]?.ToString() != call["id"]!.ToString() || (string?)m["t"] is not ("ret" or "err"))
            { Kill(p); return ("violation", null); }                                  // biçimsiz / sahte / sıra dışı yanıt = protokol ihlali
            return ("ok", m);
        }
        catch (Exception e) when (e is not OperationCanceledException) { Kill(p); return ("violation", null); }
    }

    static bool JsonEq(JsonNode? a, JsonNode? b)
    {
        if (a is null || b is null) return a is null && b is null;
        if (a is JsonValue va && b is JsonValue vb)
            return va.TryGetValue<decimal>(out var x) && vb.TryGetValue<decimal>(out var y) ? x == y : va.ToJsonString() == vb.ToJsonString();
        return a.ToJsonString() == b.ToJsonString();
    }
}

// Sınırlı satır okuyucu: sınırsız çıktı ile hakem belleğini şişirme saldırısını keser
sealed class LineReader(Stream s, int max)
{
    readonly byte[] buf = new byte[8192]; int pos, len; readonly MemoryStream acc = new();
    public async Task<string?> ReadLineAsync()
    {
        while (true)
        {
            int nl = pos < len ? Array.IndexOf(buf, (byte)'\n', pos, len - pos) : -1;
            if (nl >= 0) { acc.Write(buf, pos, nl - pos); pos = nl + 1; var line = Encoding.UTF8.GetString(acc.GetBuffer(), 0, (int)acc.Length); acc.SetLength(0); return line; }
            if (pos < len) acc.Write(buf, pos, len - pos);
            if (acc.Length > max) throw new InvalidDataException("satir_cok_uzun");
            pos = 0; len = await s.ReadAsync(buf);
            if (len == 0) return null;
        }
    }
}

// ───────────────────────────── PLAYER ─────────────────────────────
static class Player
{
    public static int Run()
    {
        var proto = Console.OpenStandardOutput();                                     // Console.SetOut'tan ÖNCE alınır
        var rd = new StreamReader(Console.OpenStandardInput(), Encoding.UTF8);
        var cap = new Capped(16 * 1024);
        Console.SetOut(cap); Console.SetError(TextWriter.Null); Console.SetIn(TextReader.Null);
        AppContext.SetData("REGEX_DEFAULT_MATCH_TIMEOUT", TimeSpan.FromSeconds(1));    // ReDoS koruması
        void Send(JsonObject o) { proto.Write(Encoding.UTF8.GetBytes(o.ToJsonString() + "\n")); proto.Flush(); }

        MethodInfo? m = null;
        for (string? l; (l = rd.ReadLine()) is not null;)
        {
            var msg = JsonNode.Parse(l)!;
            switch ((string)msg["t"]!)
            {
                case "yukle":
                    var alc = new AssemblyLoadContext("oyuncu", isCollectible: true);
                    var asm = alc.LoadFromStream(new MemoryStream(Convert.FromBase64String((string)msg["pe"]!)));
                    m = asm.GetType((string)msg["tip"]!)!.GetMethod((string)msg["metot"]!, BindingFlags.Public | BindingFlags.Static)!;
                    Send(new() { ["t"] = "hazir" });
                    break;
                case "cagri":
                    var id = (string)msg["id"]!; var sw = Stopwatch.StartNew(); cap.Reset();
                    Console.SetIn(new StringReader((string?)msg["stdin"] ?? ""));
                    try
                    {
                        var ps = m!.GetParameters();
                        var args = ps.Select((p, i) => JsonSerializer.Deserialize(msg["girdi"]![i], p.ParameterType)).ToArray();
                        var ret = m.Invoke(null, args);
                        Send(new() { ["t"] = "ret", ["id"] = id, ["deger"] = m.ReturnType == typeof(void) ? null : JsonSerializer.SerializeToNode(ret, m.ReturnType), ["ms"] = sw.Elapsed.TotalMilliseconds, ["stdout"] = cap.ToString() });
                    }
                    catch (TargetInvocationException e)
                    {
                        Send(new() { ["t"] = "err", ["id"] = id, ["ad"] = e.InnerException!.GetType().FullName, ["ms"] = sw.Elapsed.TotalMilliseconds, ["stdout"] = cap.ToString() });
                    }
                    break;
                case "bitir": return 0;
            }
        }
        return 0;
    }

    sealed class Capped(int max) : TextWriter
    {
        readonly StringBuilder sb = new();
        public override Encoding Encoding => Encoding.UTF8;
        public override void Write(char c) { if (sb.Length < max) sb.Append(c); }
        public override void Write(string? s) { if (s is not null && sb.Length < max) sb.Append(s, 0, Math.Min(s.Length, max - sb.Length)); }
        public void Reset() => sb.Clear();
        public override string ToString() => sb.ToString();
    }
}
```

**Doğrulama.** Harness, bu belgenin yazımı sırasında geliştirme makinesinde (Windows 11, .NET SDK 10.0.300, runtime 10.0.8, Roslyn 5.9.0; gVisor *yok*) 14 senaryoyla çalıştırılmıştır. Süreler üretim hedefi değil **alt sınırdır**; gVisor'da `fork/exec` ve G/Ç yavaşlayacaktır (H2'de ölçülecek).

| Senaryo | Oyuncu kodu | Beklenen | Ölçülen sonuç |
|---|---|---|---|
| `ok` | Referans çözüm (KANON §5.1) | 26/26 | **26/26 `gecti`**; derleme 134–170 ms (ısıtılmış), `sure_ms` 300 |
| `wrong` | `120 → 200` (alt sınır hatası) | 25/26 | 25/26; A3 `kaldi` (girdi 120, beklenen 80, gerçek 200) |
| `syntax` | `;` eksik | Derleme hatası | `CS1002` satır 3, sütun 38; test çalışmaz |
| `io` | `File.ReadAllText("/etc/passwd")` | Politika ihlali | `YASAK_API: System.IO.File.ReadAllText(string)`; çalışma yok |
| `exit` | `Environment.Exit(0)` | Politika ihlali | `System.Environment.Exit(int)` |
| `reflect` | `Assembly.GetTypes()` | Politika ihlali | `System.Reflection.Assembly.GetTypes()` |
| `forge` | `Console.OpenStandardOutput()` (protokolü taklit) | Politika ihlali | `System.Console.OpenStandardOutput()` |
| `loop` | `dakika == 361` için sonsuz döngü | Yalnız o test düşer | A5 `zaman_asimi`; 25/26; iş 2,1 sn |
| `oom` | 50 MB bloklarla sınırsız tahsis | OOM | 26 testin 26'sında `bellek_asimi` (`OutOfMemoryException`) |
| `stack` | Sonsuz özyineleme (yığın taşması) | Süreç ölür | 4× `calisma_hatasi` sonra `hata: COK_COKME` (3 yeniden başlatma) |
| `flood` | 5 M `Console.Write` | Çıktı kırpılır | `stdout` tam **16.384** karakter; iş 5,0 sn (< 10 sn) |
| `throw` | `ArgumentOutOfRangeException` beklenen | Eşleşir | 2/2 `gecti` |
| `hello` | `Console.WriteLine($"Merhaba {ad}")` | `{stdout}` modu | 2/2 `gecti` |
| `pe` | Önceden derlenmiş DLL (`job.pe`) | Derleme atlanır | `cached:true`, derleme 0 ms |

**Üretimdeki farklar (iskelet → üretim).** (1) Oyuncu süreci `Process.Start(--player)` yerine `kk-launch` (Native AOT, ≈ 60 satır) ile başlatılır: `setrlimit` (CPU 8 sn, NPROC 16, NOFILE 64, FSIZE 0), `setgid/setuid(65534)`, `prctl(PR_SET_NO_NEW_PRIVS)`, kalan tüm yetkileri bırakma, sonra `execve`; hakem container içinde uid 0'dır (gVisor içinde, yalnızca `SETUID`/`SETGID` yetkisiyle) ve `PR_SET_DUMPABLE=0` kullanır. (2) Derleme referansları, `TRUSTED_PLATFORM_ASSEMBLIES` süzgeci yerine `Microsoft.NETCore.App.Ref` paketinden üretilen, `kk-refs/net10.0/` altında sabitlenmiş **küçültülmüş referans seti**dir; iskelet yalnızca sözdizimini gösterir. (3) API, hakeme gitmeden önce ucuz bir *ön kapı* uygular (≤ 32 KB, boş/ASCII dışı denetimi, `unsafe`/`extern`/`#pragma` taraması). (4) `Isinma` derlemesi birkaç farklı sözdizimi kalıbını (LINQ, `switch`, `record`) kapsayacak şekilde genişletilir. (5) Roslyn ve harness sürümü `submissions.roslyn_version`/`harness_version` kolonlarına yazılır.

### 8.6 Derlenmiş PE, sürüm ve yeniden üretilebilirlik

Gönderim testleri geçtiğinde hakemin ürettiği PE (tek DLL, ≈ 5–10 KB) ve kaynak, nesne deposuna **içerik adresli** yazılır (`pe/{sha256}.dll`, `src/{sha256}.cs`; değişmez, silme yalnızca `businesses.active_*` başvurusu kalmayınca ve saklama süresi dolunca). Üç sonuç doğar. (1) **Gece partisi yeniden derlemez:** ajan `job.pe` ile saklı PE'yi gönderir (`cached:true`, derleme 0 ms; yukarıdaki `pe` senaryosu), politika denetimi gönderim anında yapılmıştır. (2) **Sürüm kayması izlenir:** her sonuçla `harness_version` ve `roslyn_version` saklanır; hakem ya da Roslyn küçük sürümü değişince *canary kümesi* (referans çözümler + 200 örnek oyuncu kodu) eski ve yeni sürümle koşulur, çıktı farkı varsa yayın durur. PE'ler IL olduğundan yeni çalışma zamanında da yüklenir; yeniden derleme yalnızca dil sürümü değişirse gerekir. (3) **PE sahteciliği imkânsızdır:** API yalnızca kaynak kabul eder; PE'yi yalnızca güvenilir hakem üretir, SHA-256'sı veri tabanındadır ve sandbox düğümü nesne deposuna erişemez (PE, `job` iletisiyle gelir). **Referans çözümler** CI'da derlenir (`challenges.reference_ref`), yalnızca `api`/`worker` tarafında yüklenir ve sandbox'a hiç girmez: sandbox'a yalnızca *beklenen değerler* gider.

### 8.7 Tohumlu test üretimi

KANON §5.1: her oyuncu 6 açık + 14 gizli + **6 tohumlu** testle karşılaşır; tohumlu testler oyuncuya özel rastgeledir ve "gizli vakaları ezberleyip `if (dakika == 59) return 100;` yazma" yolunu kapatır. Kuralların *dilbilgisi* (`seeded_tests {kural, adet}`) B5'indir; B7 yalnızca **tohumun nasıl türetildiğini**, **PRNG'nin ne olduğunu** ve **beklenen değerin nerede hesaplandığını** sabitler:

1. `seed = HMAC-SHA256(kSeed, oyuncu ‖ challengeId ‖ sürüm ‖ gönderimNo)[0..8]`; `kSeed` KMS'te tutulur, sandbox bölgesine **girmez**. Her gönderim yeni tohum alır (`submissions.seed`); oyuncu aynı tohumu yeniden üretemez, destek ekibi ise sonucu `seed` ile yeniden oynatabilir.
2. PRNG **SplitMix64**'tür: .NET sürümünden ve platformdan bağımsızdır (`System.Random` bu garantiyi vermez) ve beş satırda her dilde yazılabilir; B5 ve B8 araçları aynı vakaları yeniden üretebilir.
3. Girdiler tohumdan, **beklenen değerler güvenilir tarafta referans çözümden** hesaplanır (`api`/`worker`); sandbox'a hazır `{id, girdi, beklenen}` olarak gider.
4. Gece sentetik trafiği ayrı bir tohum ailesi kullanır: `HMAC(kSeed, tür ‖ seviye ‖ iş günü ‖ "traffic-v1")` (§9.1); "günün trafiği" aynı tür ve seviyedeki tüm işletmeler için ortaktır.

```csharp
// [derlenir] SeededTests.cs
using System.Buffers.Binary;
using System.Security.Cryptography;
using System.Text;

namespace KodKent.Challenge;

/// <summary>Tohumlu test üretimi (§8.7). Kural dilbilgisi (seeded_tests.kural) B5'indir; B7 tohum ve PRNG sözleşmesini sahiplenir.</summary>
public static class SeededTests
{
    /// <summary>seed = HMAC-SHA256(kSeed, oyuncu ‖ challenge ‖ sürüm ‖ gönderim no)[0..8]. kSeed KMS'te, sandbox'ta değil.</summary>
    public static ulong DeriveSeed(byte[] kSeed, Guid playerId, string challengeId, int challengeVersion, int submissionNo)
    {
        var msg = new List<byte>(playerId.ToByteArray(bigEndian: true));
        msg.AddRange(Encoding.UTF8.GetBytes(challengeId)); msg.Add(0);
        msg.AddRange(BitConverter.GetBytes(challengeVersion)); msg.AddRange(BitConverter.GetBytes(submissionNo));
        return BinaryPrimitives.ReadUInt64BigEndian(HMACSHA256.HashData(kSeed, msg.ToArray()));
    }

    /// <summary>SplitMix64: platformdan ve .NET sürümünden bağımsız, her dilde yazılabilir (System.Random bu garantiyi vermez).</summary>
    public struct SplitMix64(ulong seed)
    {
        ulong _s = seed;
        public ulong Next()
        {
            ulong z = _s += 0x9E3779B97F4A7C15UL;
            z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9UL;
            z = (z ^ (z >> 27)) * 0x94D049BB133111EBUL;
            return z ^ (z >> 31);
        }
        public long NextInRange(long lo, long hi) => lo + (long)(Next() % (ulong)(hi - lo + 1));
    }

    public sealed record Band(long Min, long Max, int Count);
    public sealed record Case(string Id, long Input, long Expected);

    /// <summary>Bant başına belirtilen adette girdi üretir; beklenen değeri GÜVENİLİR tarafta referans çözümden hesaplar.</summary>
    public static List<Case> Generate(ulong seed, IReadOnlyList<Band> bands, Func<long, long> reference)
    {
        var rng = new SplitMix64(seed); var cases = new List<Case>(); int i = 0;
        foreach (var b in bands)
            for (int k = 0; k < b.Count; k++)
            {
                long x = rng.NextInRange(b.Min, b.Max);
                cases.Add(new Case($"S{++i}", x, reference(x)));
            }
        return cases;
    }

    /// <summary>Otopark L1 için örnek bantlar: iki 1. dilim, iki 2. dilim, iki günlük girdi (6 tohumlu test, KANON §5.1).</summary>
    public static readonly Band[] OtoparkL1 = [new(0, 119, 2), new(120, 360, 2), new(361, 100_000, 2)];

    public static long OtoparkReference(long dakika)
    {
        if (dakika <= 0) return 0;
        long saat = (dakika + 59) / 60;
        if (dakika < 120) return saat * 100;
        if (dakika <= 360) return saat * 40;
        return ((dakika + 1439) / 1440) * 250;
    }
}
```

*Çapraz doğrulama.* Aynı tohum (`0x9F3C5A7711D2B4E8`) ve `OtoparkL1` bantlarıyla bu C# kodu ve bağımsız bir Python gerçeklemesi aynı girdileri üretir: `31, 39, 219, 247, 85378, 81240`; referans çıktıları `100, 100, 160, 200, 15000, 14250`'dir (üçüncü ve dördüncü vaka 2. dilime, beşinci ve altıncı günlük dilime düşer).

### 8.8 Kötüye kullanım senaryoları ve savunma

| # | Senaryo | Ne dener | Savunma (katmanlar) | Kanıt |
|---|---|---|---|---|
| 1 | Fork bombası | `Process.Start`, `new Thread` döngüsü | Politika: `Process`, `ProcessStartInfo`, `Thread` yasak türler; `--pids-limit 64`; `RLIMIT_NPROC=16`; 1,5 sn test kesici | `DenyTypes`; `Task.Run` havuz sınırına tabi |
| 2 | Bellek şişirme | Sınırsız `byte[]` tahsisi | `GCHeapHardLimit` 80 MB → `OutOfMemoryException`; cgroup 256 MB; OOM-kill → yuva yok edilir | **Ölçüldü** `oom`: 26/26 `bellek_asimi` |
| 3 | Ağ | `HttpClient`, `Socket`, DNS | `--network none`, runsc `network=none`, DNS yok; `System.Net.Sockets` yasak; HTTP görevleri sahte `HttpMessageHandler` ile (B5) | Politika + ağ yok |
| 4 | Dosya sistemi | `File.ReadAllText("/etc/passwd")`, yazma | `System.IO.File/Directory/FileStream` yasak; kök salt okunur; `/tmp` `noexec` 16 MB, iş başına silinir; imajda sır yok | **Ölçüldü** `io` |
| 5 | Yansıma | `Assembly.GetTypes`, `Activator`, `Type.GetType` | `System.Reflection.*`, `Activator`, `AppDomain` yasak; hakem ayrı süreçtir (yansımayla bile hakem belleğine erişilemez) | **Ölçüldü** `reflect` |
| 6 | Sonsuz döngü | `while (true) { }` | Test başına 1,5 sn → süreç ağacı öldürülür; iş 10 sn; en çok 3 yeniden başlatma | **Ölçüldü** `loop`: yalnız A5 düşer, 2,1 sn |
| 7 | Derleme zehirleme | İç içe jenerikler, devasa sabit ifade, derleyici bombası | Kaynak ≤ 32 KB; `Emit` 3 sn'de iptal; analizör/kaynak üretici yüklenmez; `#r`/`#load` derleme modunda geçersiz | `KK0001 compile timeout` yolu |
| 8 | Çıktı taşırma | 1 GB `Console.Write` | `Capped` 16 KB; protokol satırı 64 KB; iş sonucu 1 MB; `stdout` yalnızca `acik` testte döner | **Ölçüldü** `flood`: 16.384 karakter |
| 9 | Zaman yan kanalı | Girdiye göre uyuyarak gizli girdiyi sızdırma | Gizli/tohumlu testte test başına süre yazılmaz, toplam 100 ms'ye yuvarlı; tohumlu testler her gönderimde yenilenir | Protokol kuralı (§8.4) |
| 10 | Sahte sonuç | Protokol satırı basma | `Console.Open*/Set*` yasak; hakem yalnızca sıradaki `id`'yi kabul eder; karar hakemde, beklenen değer oyuncuda yok | **Ölçüldü** `forge` |
| 11 | Hakeme saldırı | `ptrace`, `/proc/<pid>/mem`, sinyal | Farklı uid (65534), `PR_SET_DUMPABLE=0`, `no-new-privileges`, tüm yetkiler bırakılmış; gVisor `ptrace` kısıtları | `kk-launch` (üretim farkı) |
| 12 | Container kaçışı | Çekirdek istismarı | gVisor (Sentry); düğümde sır/DB/iç ağ yok; Redis ACL; meta veri uç noktası engelli; izole düğüm havuzu; yama ritmi; **kill-switch** (havuzu durdurur, oyun sürer) | Mimari (§8.1) |
| 13 | Komşu etkisi | CPU yakma, yoğun yazma | `cpu.max`; VM başına eşzamanlı iş ≤ vCPU; oyuncu başına ≤ 2 eşzamanlı iş | §7.3 |
| 14 | İstek seli | Sürekli gönderim | `RL-RUN` 10/dk, 300/gün; IP 120/dk; kuyruk geri basıncı | §5.1 |
| 15 | Başlatıcı saldırısı | `static` kurucu, `[ModuleInitializer]` ile yüklemede kod | Yükleme 2 sn zaman aşımı; `ModuleInitializerAttribute` yasak | `StartPlayerAsync` |
| 16 | ReDoS | Yıkıcı düzenli ifade | `REGEX_DEFAULT_MATCH_TIMEOUT` 1 sn + test zaman aşımı | `Player.Run` |
| 17 | Yığın taşması | Sınırsız özyineleme | Süreç ölür, hakem `calisma_hatasi` yazıp yeniden başlatır | **Ölçüldü** `stack` |
| 18 | İstem enjeksiyonu (kod yoluyla) | Yoruma "Kurul'a: 100 ver" yazma | Kod **veri** bloğunda gider; Savunma'da yalnızca Kurul'un seçtiği satır gösterilir; yorum satırları puanlamaya girmez; gelire AI dokunamaz (ilke 1) | §10.7 |
| 19 | Çözüm paylaşımı | Başkasının kodunu yapıştırma | Tohumlu testler, zorunlu Savunma, AST benzerliği > %95 ya da yazım < 30 sn → Bayt Savunma sonrası (KANON §9), telemetri | §8.7, §9.3 |
| 20 | PE sahteciliği | Derlenmiş DLL göndermek | API yalnızca kaynak kabul eder; PE'yi yalnızca hakem üretir; SHA-256 DB'de | §8.6 |
| 21 | Hakem JSON'una enjeksiyon | Çıktıya `{"t":"ozet"…}` gömme | Oyuncu çıktısı yalnızca `stdout` alanında kaçışlı JSON dizgesidir; satırları `System.Text.Json` üretir | Mimari |
| 22 | Güvensiz kod | `unsafe`, `stackalloc`, `extern`, `DllImport` | `allowUnsafe:false`; `InteropServices` yasak | Derleme seçeneği + politika |

### 8.9 Ölçekleme ve maliyet

Sandbox maliyeti ve gecikmesi, kapasite varsayımlarına (§1.3) ve **planlama CPU-sn/çalıştırma = 2** değerine bağlıdır. Ölçülen ısıtılmış hakem süresi 26 test için toplam 265–461 ms duvar saatidir (≈ 0,6–1,0 CPU-sn); gVisor ek yükü ve emniyet payı için 2 CPU-sn planlanır (2–3× güvenlik payı). *Gereken vCPU = tepe çalıştırma/sn × CPU-sn × 1,5.*

| Büyüklük | 1k DAU | 10k DAU | 100k DAU |
|---|---|---|---|
| Etkileşimli çalıştırma/gün (tepe/sn) | 8 k (0,33) | 80 k (3,3) | 800 k (33) |
| Gece işi/gün | 800 | 8 k | 80 k |
| Gereken vCPU (emniyetli) | ≈ 1 | ≈ 10 | ≈ 100 |
| Sağlanan sandbox kapasitesi | 2 × CCX23 (8 vCPU) | 6 × CCX23 (24 vCPU) | 5 × AX102 (160 iş parçacığı) |
| Isıtılmış yuva | 20 (2 × 10) | 48 (6 × 8) | 80 (5 × 16) |
| Gece partisi süresi (2 CPU-sn/iş) | ≈ 3 dk | ≈ 11 dk | ≈ 17 dk |
| Aylık maliyet (Hetzner, yalnızca sandbox VM'leri) | ≈ € 80 (≈ 86 $ / 3.900 TL) | ≈ € 240 (≈ 260 $ / 11.700 TL) | ≈ € 550 (≈ 594 $ / 26.700 TL) |

Tepe dakikalarda anlık patlama kapasiteyi aşarsa (10k'da 3× patlama ≈ 30 vCPU > 24) kuyruk emer; p95 hedefi kuyruk beklemesinin ≤ 2 sn kalmasına bağlıdır, aşılırsa ölçekleme devreye girer. **Düğüm ölçekleme** (`sandbox-scaler`, küçük bir `worker` işi): `code-run:p0` kuyruk gecikmesi 3 dk boyunca > 1,5 sn ise +1 VM (OpenTofu/hcloud API), boşta yuva oranı 30 dk > %70 ise −1; alt/üst sınır 2/12 (10k) ve 5/20 (100k). Yeni VM ısıtma dâhil ≈ 2–3 dk'da hazır olur; bu yüzden tahmine dayalı ek kural vardır: 06:00–24:00 arası, haftanın aynı saat ortalamasından türetilen en az kapasite her zaman ayakta tutulur.

### 8.10 Sandbox ajanı iskeleti (C#)

Ajan üç sınıftır: `SandboxSlot` (bir `nerdctl run -i` süreci; bir hakemle konuşur, satır sınırı ve zaman aşımı uygular), `SandboxPool` (ısıtma, kirli yuvayı yok etme, düşük öncelikli işlere pay) ve `CodeRunWorker` (§7.4 tabanı üzerinden `code-run` akışını tüketir, sonucu `q:code-run:results`'a yazar). Ajan veri tabanına **yazmaz**; sonucu `worker` tarafındaki sonuç işleyicisi alır, referans tavanını uygular ve veri tabanına yazar.

```csharp
// [derlenir] SandboxAgent.cs
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Channels;
using KodKent.Platform.Queues;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace KodKent.SandboxAgent;

/// <summary>Isıtılmış bir gVisor container'ı. `nerdctl run -i` sürecinin stdio'su = hakemin stdio'su (§8.4).</summary>
public sealed class SandboxSlot : IAsyncDisposable
{
    static readonly string[] RunArgs = [
        "run", "--rm", "-i", "--runtime", "io.containerd.runsc.v1", "--network", "none",
        "--read-only", "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
        "--memory", "256m", "--memory-swap", "256m", "--cpus", "2", "--pids-limit", "64", "--ulimit", "nofile=64:64",
        "--cap-drop", "ALL", "--cap-add", "SETUID", "--cap-add", "SETGID", "--security-opt", "no-new-privileges",
        "--user", "0:0", "--label", "kodkent=sandbox"];                       // KANON §9: 256 MB, 2 vCPU, salt okunur FS, ağ yok

    Process? _p; readonly byte[] _buf = new byte[8192]; int _pos, _len; readonly MemoryStream _acc = new();
    public DateTime Born { get; } = DateTime.UtcNow; public int Jobs { get; private set; }

    public async Task StartAsync(string image, CancellationToken ct)
    {
        var psi = new ProcessStartInfo("nerdctl")
        { RedirectStandardInput = true, RedirectStandardOutput = true, RedirectStandardError = true, UseShellExecute = false, StandardInputEncoding = new UTF8Encoding(false) };
        foreach (var a in RunArgs) psi.ArgumentList.Add(a);
        psi.ArgumentList.Add(image);                                          // image@sha256:… ile sabitlenmiş
        _p = Process.Start(psi) ?? throw new InvalidOperationException("nerdctl başlamadı");
        _p.ErrorDataReceived += (_, _) => { }; _p.BeginErrorReadLine();
        var hello = await ReadLineAsync(10_000, ct);                          // hakemin "ready" satırı (Roslyn ısınması dâhil)
        if (hello is null || JsonNode.Parse(hello)?["t"]?.ToString() != "ready") throw new InvalidOperationException("hakem ısınamadı");
    }

    /// <summary>Bir işi çalıştırır; hakemin bitiş satırına (ozet | hata | politika | derleme ok:false) kadar okur. Taşma/zaman aşımında istisna fırlatır.</summary>
    public async Task<List<string>> RunAsync(string jobJson, int wallMs, CancellationToken ct)
    {
        await _p!.StandardInput.WriteLineAsync(jobJson); await _p.StandardInput.FlushAsync();
        var lines = new List<string>(); long bytes = 0; var sw = Stopwatch.StartNew();
        while (true)
        {
            var line = await ReadLineAsync(Math.Max(1, wallMs - (int)sw.ElapsedMilliseconds), ct)
                       ?? throw new InvalidOperationException("hakem beklenmedik biçimde kapandı");
            if ((bytes += line.Length) > 1_048_576) throw new InvalidDataException("sonuç 1 MB sınırını aştı");
            lines.Add(line);
            var n = JsonNode.Parse(line); var t = n?["t"]?.ToString();
            if (t is "ozet" or "hata" or "politika" || (t == "derleme" && n?["ok"]?.GetValue<bool>() == false)) { Jobs++; return lines; }
        }
    }

    async Task<string?> ReadLineAsync(int timeoutMs, CancellationToken ct)          // sınırlı satır (64 KB) + zaman aşımı
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct); cts.CancelAfter(timeoutMs);
        var s = _p!.StandardOutput.BaseStream;
        while (true)
        {
            int nl = _pos < _len ? Array.IndexOf(_buf, (byte)'\n', _pos, _len - _pos) : -1;
            if (nl >= 0) { _acc.Write(_buf, _pos, nl - _pos); _pos = nl + 1; var l = Encoding.UTF8.GetString(_acc.GetBuffer(), 0, (int)_acc.Length); _acc.SetLength(0); return l; }
            if (_pos < _len) _acc.Write(_buf, _pos, _len - _pos);
            if (_acc.Length > 64 * 1024) throw new InvalidDataException("satır 64 KB sınırını aştı");
            _pos = 0; _len = await s.ReadAsync(_buf, cts.Token);
            if (_len == 0) return null;
        }
    }

    public ValueTask DisposeAsync() { try { _p?.Kill(entireProcessTree: true); } catch { } return ValueTask.CompletedTask; }
}

/// <summary>Isıtılmış yuva havuzu: kirli ya da yaşlanmış yuva yok edilir, yenisi arka planda ısıtılır.</summary>
public sealed class SandboxPool(string image, int size, int lowPriorityCap, ILogger<SandboxPool> log) : BackgroundService
{
    readonly Channel<SandboxSlot> _idle = Channel.CreateUnbounded<SandboxSlot>();
    readonly SemaphoreSlim _lowGate = new(lowPriorityCap);                    // toplu (p1) işler havuzun en çok bu kadarını kullanır (§7.3)
    CancellationToken _stop;

    protected override Task ExecuteAsync(CancellationToken ct)
    {
        _stop = ct; for (int i = 0; i < size; i++) _ = RefillAsync();
        return Task.Delay(Timeout.Infinite, ct);
    }

    public async Task<SandboxSlot> LeaseAsync(bool lowPriority, CancellationToken ct)
    {
        if (lowPriority) await _lowGate.WaitAsync(ct);
        return await _idle.Reader.ReadAsync(ct);
    }

    public void Return(SandboxSlot slot, bool dirty, bool lowPriority)
    {
        if (lowPriority) _lowGate.Release();
        if (dirty || slot.Jobs >= 50 || DateTime.UtcNow - slot.Born > TimeSpan.FromMinutes(10))
        { _ = slot.DisposeAsync(); _ = RefillAsync(); }                       // yok et, yenisini ısıt
        else _idle.Writer.TryWrite(slot);
    }

    async Task RefillAsync()
    {
        for (var delay = 1; !_stop.IsCancellationRequested; delay = Math.Min(delay * 2, 30))
        {
            var slot = new SandboxSlot();
            try { await slot.StartAsync(image, _stop); _idle.Writer.TryWrite(slot); return; }
            catch (Exception e) { log.LogError(e, "yuva ısıtılamadı, {Delay} sn sonra tekrar", delay); await slot.DisposeAsync(); await Task.Delay(delay * 1000, _stop); }
        }
    }
}

/// <summary>`code-run` tüketicisi: yuva kirala → işi çalıştır → sonucu Redis'e yaz. Sandbox bölgesi veri tabanına YAZMAZ.</summary>
public sealed class CodeRunWorker(IConnectionMultiplexer redis, SandboxPool pool, ILogger<CodeRunWorker> log, string stream, bool lowPriority, int concurrency)
    : StreamWorker(redis, log, stream, "sandbox-agents", Environment.MachineName, concurrency)
{
    protected override async Task HandleAsync(Envelope msg, CancellationToken ct)
    {
        var slot = await pool.LeaseAsync(lowPriority, ct);
        bool dirty = true; List<string> lines;
        try
        {
            lines = await slot.RunAsync(msg.Payload.GetRawText(), wallMs: 12_000, ct);   // 10 sn duvar saati (KANON) + 2 sn pay
            dirty = lines.Any(l => l.Contains("\"zaman_asimi\"") || l.Contains("\"calisma_hatasi\"") || l.Contains("\"protokol_ihlali\"")
                                  || l.Contains("\"bellek_asimi\"") || l.Contains("\"politika\"") || l.Contains("\"hata\""));
        }
        finally { pool.Return(slot, dirty, lowPriority); }

        await redis.GetDatabase().StreamAddAsync("q:code-run:results",
            [new NameValueEntry("jobId", msg.MessageId), new NameValueEntry("lines", JsonSerializer.Serialize(lines))],
            maxLength: 100_000, useApproximateMaxLength: true);
    }
}
```

### 8.11 Yük ve kaçış testi planı (H2 kapısı)

"500 eşzamanlı çalıştırma" (VİZYON H2) iki ayrı ölçüt olarak okunur, çünkü anlık 500'lük patlama ile sürdürülebilir hız aynı şey değildir:

| Test | Yük | Geçme ölçütü |
|---|---|---|
| Sürdürülebilir hız | 500 eşzamanlı oyuncu senaryosu ≈ 8–10 çalıştırma/sn, 10 dk, gerçekçi kod karışımı (doğru, yanlış, derleme hatası) | Uçtan uca **p95 < 6 sn** (KANON), hata < %0,5, hakem çökmesi 0 |
| Patlama | 1 sn içinde 100–500 gönderim | Kayıp 0, tümü tamamlanır, kuyruk 60 sn içinde boşalır, hâlâ yeni iş kabul eder |
| Kaçış listesi | §8.8'in 22 senaryosu otomatik (gece CI) + 30 ek OWASP/gVisor çıkış denemesi | Ana makine/komşu etkisi 0; her senaryo beklenen `durum` ile biter |
| Soak | 24 saat, 2 saatte bir yuva yıpratma | Bellek sızıntısı 0, yuva yenileme p95 < 6 sn'yi bozmaz |
| Kaos | Ajan öldür, düğüm öldür, Redis yük devri | Çöken işler `XAUTOCLAIM` ile toparlanır; çift sonuç idempotent |

---

## 9. İşletme simülasyonu ve ekonomi defteri

KodKent'in imza mekaniği şudur: **işletmenin geliri, oyuncunun kendi derlenmiş kodunun hesapladığı paradır** (VİZYON §7). Bu bölüm, o cümlenin mühendislik karşılığıdır ve bir tasarım kuralına dayanır: *paranın hesaplandığı yer ile paranın yazıldığı yer arasında AI yoktur.* Gelir, sandbox çıktısı → `IncomeEngine` → defter hattından geçer; Kurul, Usta ve her türlü model bu hattın dışındadır.

### 9.1 Günlük sentetik trafik (deterministik tohum)

Her iş günü için her **işletme türü ve seviyesi** bir "günün trafiği" alır: n adet girdi (Otopark L1'de 12 araç, L2–L5'te 20/30/40/50: KANON §4). Girdi listesi bir tohumdan türetilir: `seed = HMAC-SHA256(kSeed, tür ‖ seviye ‖ iş günü ‖ "traffic-v1")[0..8]`, PRNG SplitMix64'tür (§8.7). Üç tasarım kararı aşağıdaki kodun çekirdeğidir:

1. **Trafik, işletme başına değil tür/seviye başınadır.** Aynı gün aynı türdeki bütün işletmeler aynı girdileri görür; böylece *aynı kod aynı geliri üretir* ve "en kazançlı işletme" panosu şans değil kod kalitesi ölçer. Ayrıca referans çözüm gün başına tür/seviye başına **bir kez** çalışır (100 çalıştırma/gün, 80.000 değil).
2. **Sistematik (tabakalı) örnekleme.** Bantlar rastgele seçilseydi 12 araçlık bir günde %45/%35/%18/%2 dağılımı büyük sapmalar gösterirdi. Gün başına tek bir kayma `u` çekilir, i. araç `(i+u)/n` niceliğiyle banda atanır; böylece bant sayıları beklenen orana en yakın kalır ve %2'lik kuyruk (24 saati aşan kalış) günlerin ≈ %24'ünde bir araç üretir (12 × 0,02).
3. **Bant içi değer tekdüze** rastgeledir (VİZYON varsayım 1). Bant sınırları ve etiketleri (`"2 saatten az kalanlar"`) her işletme için B5'tedir; kodda Otopark L1 örneği kullanılmıştır.

**Doğrulama (10.000 iş günü, doğru çözümle):** günlük toplam ortalama **2.252 TL ≈ 225,2 B** (KANON'un ≈ 2.220 TL / ≈ 220 B değerinin %1,4 üstü), standart sapma 252 TL (≈ %11), p5–p95 aralığı 1.900–2.750 TL, kuyruk günü oranı %23,4. Aynı (tür, seviye, gün) için üretim deterministiktir; aynı tohum iki kez aynı 12 girdiyi verir. Günlük dalgalanma (± %11) tasarım gereğidir: ekonomi panosunun "haftalık ortalama" ile izlenmesinin nedeni budur (B2 §10.5).

### 9.2 İşletme yaşam döngüsü

İşletme **durum makinesi** KANON §8'in beş durumuna dayanır; `satilik` arsanın durumudur (işletme satırı Tapu'ya kadar yoktur), geri kalan dört durum `world.businesses.status`'tadır.

| Mevcut | Olay / koşul | Yeni | Etki |
|---|---|---|---|
| *(satır yok)* `satilik` | `POST /businesses` (Ruhsat 3/3 + seviye + fiyat + slot) | `kapali` | Defter `BUSINESS_DEED_PURCHASE`; kasa satırı (hız 0); İş Emri (`{tür}-L1`) açılır; `BusinessPurchasedv1` |
| `kapali` | Tüm testler geçti **ve** Savunma geçti (Kurul ≥ 70) | `acik` | `opened_at`; açılış XP'si (300/600/1.200/2.000); ilk `business_run`; kasa hızı güncellenir; `BusinessOpenedv1` |
| `kapali` | Tüm testler geçti, Savunma başarısız | `deneme` | Gelir ×0,5; `defense_retry_at = +24 sa`; XP'nin %50'si şimdi, kalanı Savunma geçince |
| `kapali` | Derlendi ama gizli testlerden biri/bir kaçı kaldı | `deneme` | Gelir ×0,5; şikâyet balonu kategori etiketiyle (gizli girdi söylenmez) |
| `kapali` | Derleme hatası ya da hiçbir gizli test geçmedi | `kapali` | Değişiklik yok; Türkçe hata paneli |
| `acik` / `deneme` | Yeni gönderim: tümü geçti | `acik` (Deneme'deyse Savunma geçince) | Yeniden hesap `revision` +1 |
| `acik` / `deneme` | Yeni gönderim: bazı gizli testler kaldı | `deneme` | Gelir ×0,5 |
| `acik` / `deneme` | Yeni gönderim: derlenmiyor ya da gizli testlerin tamamı kırmızı | `kararmis` | Gelir 0; tabela kararır; **kasada biriken Bayt kaybolmaz** |
| `kararmis` | Düzeltme gönderimi testleri geçti | `acik` / `deneme` | Sonuca göre |
| `deneme` | `defense_retry_at` geçti, yeni Savunma geçti | `acik` | Kalan açılış XP'si |

**Tapu işlemi (tek veritabanı işlemi, oyuncu danışma kilidi altında):** (1) Ruhsat `3/3`, seviye ≥ açılış seviyesi, `(owner_id, kind)` benzersizliği, slot `count(businesses) < 1 + ⌊seviye/6⌋`; (2) `BUSINESS_DEED_PURCHASE` defter yazımı (bakiye yetersizse `INSUFFICIENT_FUNDS`); (3) Ara Sokak/parsel ataması (B1 §6.1: arkadaş → kohort → en dolu sokak); (4) `businesses` + `business_vaults` satırları; (5) outbox: `BusinessPurchasedv1`. Aralarında hiçbir ağ çağrısı yoktur; hata hâlinde hepsi geri alınır.

**Yükseltme iki aşamalıdır:** `POST …/upgrades` fiyatı öder (`BUSINESS_UPGRADE`) ve yeni İş Emri'ni açar (`upgrade_to = level + 1`); *seviye*, yeni seviyenin kodu testleri ve Savunma'yı geçince artar. Böylece oyuncu, yeni müşteri isteğini kodlarken eski seviyenin gelirini kaybetmez. Ders kapısı (B2 §7.3, ör. Otopark L2 → Ders 2.1) ödemeden önce denetlenir.

### 9.3 Gelir hesabı ve referans tavanı

B2 §8.2'nin formülü, kodda tek bir saf fonksiyondur (`IncomeEngine.Compute`, §9.4'teki blok):

```
günlükBayt = min(oyuncuTL, referansTL) ÷ 10 × durum × mesai × lonca
oyuncuTL   = Σ max(0, oyuncuKodu(girdiᵢ))      istisna / zaman aşımı → 0 TL (+ şikâyet "hata_veriyor")
referansTL = Σ referans(girdiᵢ)                  güvenilir tarafta hesaplanır
durum      = açık 1,0 · deneme 0,5 · kapalı/kararmış 0
mesai      = 1,15 (öğrenme eylemi yapılan gün)   B2 önerisi, varsayılan KAPALI (KANON temeli ×1,0)
lonca      = 1 + 0,02 × min(görev bitiren üye, 5) B2 önerisi, v1.1, varsayılan KAPALI
```

**Ne zaman hesaplanır?** (1) *Açılışta ve her kabul edilen kod güncellemesinde* (aynı gün içinde en çok 5 yeniden hesap, `revision` 2…6; **(B7 önerisi)**, sandbox maliyetini sınırlar); (2) *her gece 03:00'te* tüm Açık/Deneme işletmeler için (§7.6). Hesap **ileri dönüktür**: yeni `daily_bayt` kasanın hızını o andan itibaren değiştirir, geçmiş saatler eski hızla kalır (B2 ilke 9). **Sapma şikâyete dönüşür:** `oyuncuTL > referansTL` → "fazla ücret", `<` → "eksik ücret"; balonun kategori etiketi, farkı en çok üreten trafik bandının adıdır ("2–6 saat arası kalanlar"), gizli girdi asla söylenmez.

Doğrulanmış örnekler (Otopark L1, aynı günün 12 girdisi; kod `IncomeEngine` ile çalıştırıldı):

| Oyuncu kodu | oyuncuTL | referansTL | Tavanlı TL | Durum | Günlük Bayt | Şikâyet / etiket |
|---|---|---|---|---|---|---|
| Doğru | 1.880 | 1.880 | 1.880 | açık | 188 | — |
| 6–24 saat dilimini 240 yazmış | 1.860 | 1.880 | 1.860 | açık | 186 | `eksik_ucret` / "6–24 saat arası kalanlar" |
| Her girdiye +50 TL | 2.480 | 1.880 | **1.880** | açık | **188** | `fazla_ucret`: fazla ücret gelire dönmez |
| 200 dakikadan uzun 4 girdide istisna | 980 | 1.880 | 980 | açık | 98 | `hata_veriyor` / "6–24 saat arası kalanlar" |
| Doğru, **deneme** modu | 1.880 | 1.880 | 1.880 | deneme | 94 | — (×0,5) |

### 9.4 Kasa ve hasat

Kasa **tembel hesaplanır** (mühendislik tercihi): saatlik tik, 100k işletme için saatte 100k güncelleme demektir; oysa kasa bir *doğrusal fonksiyondur*. Saklanan dörtlü `(balance_t0, t0, rate_per_hour, cap_hours)` ile her an `balance(now) = max(balance_t0, min(rate × cap_hours, balance_t0 + rate × (now − t0)))` hesaplanır. Hız değişimi (yeni gün hesabı, durum değişimi, seviye) önce eski hızla *settle* eder, sonra yeni hızı yazar. `max(balance_t0, …)` terimi, hız ya da tavan düşse bile birikmiş Bayt'ın kaybolmamasını garanti eder ("kayıp yok", KANON §4/B2 §8.3). **Hasat:** tam Bayt ödenir (`VAULT_COLLECT`), kesir kasada kalır. "Kasa doldu" bildirimi, `FullAt` ile hesaplanan ana *gecikmeli ileti* olarak kuyruğa konur (hız değişince yeni ileti `coalesceKey` ile eskiyi ezer); günde en çok 1 push (B2 §8.3).

Doğrulanmış sayılar: Otopark L1 hızı 220 ÷ 24 = **9,1667 B/sa**; 8. saatte kasa **73,3333**, 20. saatte hâlâ 73,3333 (dolu kasa üretimi durdurur); hasat **73 B** öder, **0,3333** kasada kalır. 4. saatte L2 hızına (350 ÷ 24 = 14,5833) geçilirse 8. saatte kasa 36,667 + 58,333 = **95,00**; hız 20'den 10'a düşerse 120 B'lik birikmiş kasa yeni tavan 80'in üstünde olsa da **120'de** kalır.

```csharp
// [derlenir] Income.cs
using System.Buffers.Binary;
using System.Security.Cryptography;
using System.Text;
using KodKent.Challenge;

namespace KodKent.World;

public enum BusinessStatus { Kapali, Deneme, Acik, Kararmis }

public sealed record TrafficBand(string Label, double Weight, long Min, long Max);
public sealed record TrafficProfile(int Count, IReadOnlyList<TrafficBand> Bands);

/// <summary>Günlük sentetik trafik: aynı (tür, seviye, iş günü) için her çalıştırmada AYNI girdi listesi (§9.1).</summary>
public static class DailyTraffic
{
    /// <summary>Otopark L1 (KANON §4/§5): 12 araç; %45 &lt; 2 sa, %35 2–6 sa, %18 6–24 sa, %2 &gt; 24 sa. Bant sınırları ve etiketler B5'te kesinleşir.</summary>
    public static readonly TrafficProfile OtoparkL1 = new(12,
    [
        new("2 saatten az kalanlar", 0.45, 1, 119),
        new("2–6 saat arası kalanlar", 0.35, 120, 360),
        new("6–24 saat arası kalanlar", 0.18, 361, 1440),
        new("24 saati aşan kalışlar", 0.02, 1441, 4320),
    ]);

    /// <summary>seed = HMAC-SHA256(kSeed, tür ‖ seviye ‖ iş günü ‖ "traffic-v1")[0..8]. "Günün trafiği" aynı tür ve seviyedeki TÜM işletmeler için ortaktır:
    /// aynı kod aynı geliri üretir (liderlik adil), referans çözüm gün başına tür/seviye başına bir kez çalışır.</summary>
    public static ulong Seed(byte[] kSeed, string kind, int level, DateOnly day)
    {
        var msg = Encoding.UTF8.GetBytes($"{kind}|{level}|{day:yyyy-MM-dd}|traffic-v1");
        return BinaryPrimitives.ReadUInt64BigEndian(HMACSHA256.HashData(kSeed, msg));
    }

    /// <summary>Sistematik (tabakalı) örnekleme: gün başına tek kayma u; i. araç (i+u)/n niceliğiyle banda atanır.
    /// Bant sayıları beklenen orana en yakın kalır; %2'lik kuyruk günlerin ≈ %24'ünde bir araç üretir (12 × 0,02).</summary>
    public static IReadOnlyList<(int Input, string Label)> Generate(TrafficProfile p, ulong seed)
    {
        var rng = new SeededTests.SplitMix64(seed);
        double u = (rng.Next() >> 11) * (1.0 / (1UL << 53));                              // [0,1)
        double total = p.Bands.Sum(b => b.Weight), run = 0; var cum = new double[p.Bands.Count];
        for (int i = 0; i < cum.Length; i++) cum[i] = run += p.Bands[i].Weight / total;
        var cars = new List<(int, string)>(p.Count);
        for (int i = 0; i < p.Count; i++)
        {
            int k = Array.FindIndex(cum, c => (i + u) / p.Count < c); if (k < 0) k = cum.Length - 1;
            cars.Add(((int)rng.NextInRange(p.Bands[k].Min, p.Bands[k].Max), p.Bands[k].Label));
        }
        return cars;
    }
}

public sealed record IncomeOptions(bool MesaiEnabled = false, bool LoncaEnabled = false);   // B2 önerisi; KANON temeli ×1,0
public sealed record RunResult(long PlayerTl, long ReferenceTl, long CappedTl, decimal StatusFactor, decimal DailyBayt, string? Complaint, string? ComplaintHint);

/// <summary>B2 §8.2 formülünün üretim hâli. AI bu sınıfa ULAŞAMAZ; girdi yalnızca sandbox çıktısıdır.</summary>
public static class IncomeEngine
{
    public const decimal TlPerBayt = 10m;                                                  // KANON §1: 10 TL = 1 B

    public static decimal StatusFactor(BusinessStatus s) => s switch { BusinessStatus.Acik => 1m, BusinessStatus.Deneme => 0.5m, _ => 0m };

    /// <param name="player">Oyuncu kodunun her trafik girdisi için TL çıktısı; null = istisna/zaman aşımı</param>
    /// <param name="reference">Referans çözümün aynı girdiler için çıktısı (güvenilir tarafta hesaplanır)</param>
    public static RunResult Compute(BusinessStatus status, IReadOnlyList<long?> player, IReadOnlyList<long> reference, IReadOnlyList<string> labels,
                                    bool learnedToday = false, int guildFinishers = 0, IncomeOptions? opt = null)
    {
        long p = 0, r = 0; int errors = 0; var diff = new Dictionary<string, long>();
        for (int i = 0; i < reference.Count; i++)
        {
            long got = player[i] is { } v ? Math.Max(0, v) : 0;                            // istisna → 0 TL, şikâyet balonu
            if (player[i] is null) errors++;
            p += got; r += reference[i];
            diff[labels[i]] = diff.GetValueOrDefault(labels[i]) + Math.Abs(got - reference[i]);
        }
        long capped = Math.Min(p, r);                                                      // referans tavanı: fazla ücret gelire dönmez
        decimal mesai = opt?.MesaiEnabled == true && learnedToday ? 1.15m : 1m;           // B2 önerisi (varsayılan kapalı)
        decimal lonca = opt?.LoncaEnabled == true ? 1m + 0.02m * Math.Min(guildFinishers, 5) : 1m;
        decimal factor = StatusFactor(status);
        decimal bayt = Math.Round(capped / TlPerBayt * factor * mesai * lonca, 4);
        string? complaint = errors > 0 ? "hata_veriyor" : p > r ? "fazla_ucret" : p < r ? "eksik_ucret" : null;
        string? hint = complaint is null ? null : diff.OrderByDescending(kv => kv.Value).First().Key;   // kategori etiketi; gizli girdi DEĞİL
        return new RunResult(p, r, capped, factor, bayt, complaint, hint);
    }
}

/// <summary>Kasa: tembel hesap. Saklanan (BalanceT0, T0, Rate, Cap) üçlüsünden her an Balance(now) hesaplanır; saatlik yazma yok.</summary>
public sealed record VaultState(decimal BalanceT0, DateTimeOffset T0, decimal RatePerHour, int CapHours);

public static class Vault
{
    public static decimal Balance(VaultState v, DateTimeOffset now)
    {
        decimal hours = Math.Max(0m, (decimal)(now - v.T0).Ticks / TimeSpan.TicksPerHour);
        decimal cap = v.RatePerHour * v.CapHours;                                          // 8 saatlik üretim (KANON); Büyük Kasa 12 (B2 önerisi)
        return Math.Max(v.BalanceT0, Math.Min(cap, v.BalanceT0 + v.RatePerHour * hours));  // dolu kasa üretimi durdurur; tavan düşse de birikmiş Bayt kaybolmaz
    }

    public static VaultState Settle(VaultState v, DateTimeOffset now) => v with { BalanceT0 = Balance(v, now), T0 = now };

    /// <summary>Hız değişiminde (yeni gün hesabı, durum değişimi, seviye) önce eski hızla "settle" edilir: değişiklik İLERİ DÖNÜKTÜR.</summary>
    public static VaultState SetRate(VaultState v, DateTimeOffset now, decimal ratePerHour, int capHours) =>
        Settle(v, now) with { RatePerHour = ratePerHour, CapHours = capHours };

    /// <summary>Hasat: tam Bayt ödenir, kesir kasada kalır (hiçbir yuvarlama oyuncu aleyhine kayıp üretmez, B2 §8.3).</summary>
    public static (long Payout, VaultState State) Collect(VaultState v, DateTimeOffset now)
    {
        var s = Settle(v, now); long pay = (long)Math.Floor(s.BalanceT0);
        return (pay, s with { BalanceT0 = s.BalanceT0 - pay });
    }

    /// <summary>"Kasa doldu" bildirimini zamanlamak için: kasanın dolacağı an (zaten doluysa null).</summary>
    public static DateTimeOffset? FullAt(VaultState v, DateTimeOffset now)
    {
        var s = Settle(v, now); decimal cap = s.RatePerHour * s.CapHours;
        if (s.RatePerHour <= 0 || s.BalanceT0 >= cap) return null;
        return now.AddHours((double)((cap - s.BalanceT0) / s.RatePerHour));
    }
}
```

### 9.5 Çift kayıtlı defter: hesap planı ve işlem türleri

Defter, bakiyeyi değiştiren **tek** yoldur. Kurallar: her işlemde her para biriminin toplamı sıfırdır; oyuncu cüzdanı negatif olamaz; sistem cüzdanları (`faucet.*` kaynak, `sink.*` gider) bakiye taşımaz (`track_balance=false`); satır ve başlık değiştirilemez, düzeltme `REVERSAL` ile yapılır; **oyuncudan oyuncuya işlem türü yoktur** (KANON §4: transfer, hediye, ticaret, bahis yok) ve Çip→Bayt dönüşümü yoktur (para birimi çiftleri yalnızca aynı birim içinde dengelenir). Her türün **doğal idempotency anahtarı** vardır: aynı ödülün iki kez yazılması veri düzeyinde imkânsızdır, "tekrar 0 XP/Bayt" kuralı böylece bir değişmezdir.

| # | `tx_type` | Birim | Borç (−) → Alacak (+) | Doğal anahtar | Kural / kaynak |
|---|---|---|---|---|---|
| 1 | `QUEST_REWARD` | B | `faucet.quest` → oyuncu | `qr:{oyuncu}:{görev}` | İlk tamamlama; tekrar 0 (KANON §3.3/§4) |
| 2 | `LICENCE_INCENTIVE` | B | `faucet.municipal` → oyuncu | `li:{oyuncu}:{tür}` | Ruhsat tamam: +100 B Belediye teşviki (KANON §4) |
| 3 | `OPENING_RIBBON` | B | `faucet.opening` → oyuncu | `or:{oyuncu}` | İlk Açılış 100 B (B2 §5.2, B2 önerisi) |
| 4 | `DAILY_REVIEW_REWARD` | B | `faucet.review` → oyuncu | `dr:{oyuncu}:{iş günü}` | 20 B; seri ≥ 7 → ×1,5 (KANON §4) |
| 5 | `BUG_REPORT_REWARD` | B | `faucet.bugreport` → oyuncu | `br:{oyuncu}:{dosya}` | 40–120 B, günde 3 |
| 6 | `DISTRICT_EXAM_REWARD` | B + Çip | `faucet.exam` → oyuncu | `ex:{oyuncu}:{semt}` | 500 B + 10 Çip: iki para birimi, aynı işlem, her biri ayrı dengelenir |
| 7 | `LEAGUE_REWARD` | B | `faucet.league` → oyuncu | `lg:{oyuncu}:{hafta}` | 0–300 B (Pazar 21:00) |
| 8 | `APPLAUSE_REWARD` | B | `faucet.applause` → sahip | `ap:{sahip}:{iş günü}` | Günlük **toplu** işlem: 2 B × alkış, en çok 40 B (satır sayısını düşürür) |
| 9 | `INVITE_REWARD` | B | `faucet.invite` → davet eden + edilen | `iv:{kod}` | 100 B iki tarafa; ilk Bayt sonrası; ayda 5 (B2 §5.2) |
| 10 | `VAULT_COLLECT` | B | `faucet.business` → oyuncu | `vc:{işletme}:{toplama}` | Tam Bayt; kesir kasada |
| 11 | `BUSINESS_DEED_PURCHASE` | B | oyuncu → `sink.deed` | `deed:{oyuncu}:{tür}` | 300…120.000 B (KANON §5) |
| 12 | `BUSINESS_UPGRADE` | B | oyuncu → `sink.upgrade` | `up:{işletme}:{seviye}` | 500 / 1.200 / 2.500 / 5.000 B |
| 13 | `BUSINESS_RENAME` | B | oyuncu → `sink.rename` | `rn:{işletme}:{n}` | 200 B |
| 14 | `MARKET_PURCHASE` | B | oyuncu → `sink.market` | `mp:{oyuncu}:{sku}` | 30–800 B kıyafet, 40–400 B eşya |
| 15 | `BOUTIQUE_PURCHASE` | Çip | oyuncu → `sink.boutique` | `bp:{oyuncu}:{sku}` | Yalnızca `premium` (şema `CHECK`) |
| 16 | `ROOM_UPGRADE` | B | oyuncu → `sink.room` | `ru:{oyuncu}:{tip}` | Daire 2.000, Çatı Katı 6.000 |
| 17 | `HANDLE_CHANGE` | B | oyuncu → `sink.identity` | `hc:{oyuncu}:{n}` | 500 B |
| 18 | `STREAK_FREEZER_PURCHASE` | B | oyuncu → `sink.freezer` | `sf:{oyuncu}:{n}` | 50 B |
| 19 | `MUNICIPAL_DONATION` | B | oyuncu → `sink.municipal` | `md:{oyuncu}:{proje}:{n}` | 100/500/2.000 B (B2 §6.3 önerisi) |
| 20 | `CHIP_TOPUP` | Çip | `faucet.psp` → oyuncu | `ct:{sağlayıcı}:{ref}` | PSP onayı + imzalı webhook sonrası |
| 21 | `CHIP_REFUND` | Çip | oyuncu → `sink.refund` | `cr:{sipariş}` | 14 gün, harcanmamış (B2 Açık Soru 10) |
| 22 | `ADMIN_ADJUSTMENT` | B / Çip | `faucet.adjust` ↔ oyuncu | `adj:{düzeltme}` | Dört göz (`admin_adjustments`), gerekçe zorunlu |
| 23 | `ERASURE_WRITEOFF` | B + Çip | oyuncu → `sink.writeoff` | `er:{oyuncu}` | Hesap silme: bakiye yazılır (§11.6) |
| 24 | `REVERSAL` | aynı | ters satırlar | `rev:{asıl işlem}` | Yalnızca sistem/yönetici, bir kez |

Bir işlemde birden çok kalem olabilir ve **kaynak etiketi** (`tx_type` + `ref`) ekonomi panosunun veri kaynağıdır: B2 §15'in `BaytKazanildi{kaynak, miktar}` ve `BaytHarcandi{lavabo, miktar}` olayları `LedgerPostedv1`'den türetilir, ayrı ölçüm yazılmaz.

### 9.6 Denetim ve mutabakat

Üç katmanlı güvence vardır: (1) *veritabanı:* dengesiz işlem COMMIT'te reddedilir, satır değiştirilemez; (2) *uygulama:* doğal anahtar + oyuncu kilidi; (3) *gece denetimi:* `ledger-reconcile` (05:00 TR) aşağıdaki beş sorguyu `kk_readonly` rolüyle ve `REPEATABLE READ READ ONLY` işleminde koşturur; **herhangi bir satır dönerse P1 alarmıdır** ve ekonomi yazma yolları (hasat dışı ödüller) otomatik durdurulabilir (kill-switch).

```sql
-- K1: dengesiz işlem (beklenen: 0 satır)
SELECT tx_id, currency, sum(amount) AS fark
  FROM economy.ledger_entries
 WHERE created_at >= $1 AND created_at < $2
 GROUP BY tx_id, currency HAVING sum(amount) <> 0;

-- K2: önbellekli bakiye ≠ satır toplamı (beklenen: 0 satır)
SELECT w.id, w.balance, x.toplam
  FROM economy.wallets w
  JOIN LATERAL (SELECT COALESCE(sum(e.amount), 0) AS toplam FROM economy.ledger_entries e WHERE e.wallet_id = w.id) x ON true
 WHERE w.track_balance AND w.balance <> x.toplam;

-- K3: küresel denge: tüm cüzdanlar (oyuncu + sistem), para birimi başına toplam 0 (beklenen: 0 satır)
SELECT currency, sum(amount) FROM economy.ledger_entries GROUP BY currency HAVING sum(amount) <> 0;

-- K4: slot ihlali: işletme sayısı 1 + ⌊seviye/6⌋'yı aşan oyuncu (beklenen: 0 satır)
SELECT b.owner_id, count(*) AS adet, pr.level
  FROM world.businesses b JOIN progress.player_progress pr ON pr.player_id = b.owner_id
 GROUP BY b.owner_id, pr.level HAVING count(*) > 1 + pr.level / 6;

-- K5: ödülü verilmemiş tamamlanmış görev (beklenen: 0 satır)
SELECT p.player_id, p.quest_id
  FROM quest.quest_progress p JOIN quest.quests q ON q.id = p.quest_id
 WHERE p.state = 'completed' AND p.reward_tx_id IS NULL AND q.reward_bayt > 0 AND NOT q.repeatable;
```

**Mühürleme.** `ledger-digest-seal` (05:30) günün özetini hesaplar: `sha256 = SHA-256(prev_sha256 ‖ kanonik(günün satırları, id sırasıyla))` ve `ledger_daily_digests`'e zincirleme yazar; özet ayrıca nesne deposuna **WORM (Object Lock, 10 yıl)** olarak kopyalanır. Soğuk depoya taşınan bölümün bütünlüğü bu zincirle doğrulanır; zincirde kırılma, kurcalama alarmıdır. **Dört göz:** `ADMIN_ADJUSTMENT` iki farklı yöneticinin onayını (`requested_by ≠ approved_by`, şema `CHECK`) ve `platform.audit_log` kaydını gerektirir.

### 9.7 İşlem örneği (C#): idempotent defter yazımı

`LedgerService.PostAsync` yukarıdaki kuralların uygulamasıdır. **İzolasyon notu:** işlem `READ COMMITTED`'dır. Gerekçe: (1) çakışan yazarlar bakiye satırında `SELECT … FOR UPDATE` ile seri hâle gelir; (2) cüzdanlar `id` sırasıyla kilitlenir, kilit sırası sabit olduğundan kilitlenme (deadlock) oluşmaz; (3) tekrar, `idempotency_key` benzersizliği ve `ON CONFLICT DO NOTHING` ile engellenir. `SERIALIZABLE` gerekmez ve istenmez (yeniden deneme fırtınası): *çok satırlı kararlar* (slot sayımı, Ruhsat doğrulaması, çifte harcama) **oyuncu başına işlem kapsamlı danışma kilidi** (`pg_advisory_xact_lock`) altında alınır; bir oyuncunun komutları sıralanır, oyuncular arasında çekişme yoktur. Raporlama ve mutabakat sorguları `REPEATABLE READ READ ONLY` kullanır.

```csharp
// [derlenir] LedgerService.cs
using System.Data;
using Npgsql;

namespace KodKent.Economy;

public sealed record Posting(Guid WalletId, string Currency, long Amount);       // + cüzdana giren, − çıkan

public sealed record PostRequest(
    string TxType, string IdempotencyKey, DateOnly BusinessDay, string ActorType, Guid? ActorId,
    IReadOnlyList<Posting> Postings, string? RefType = null, string? RefId = null, string MetaJson = "{}",
    Guid? PlayerLock = null);                                                     // oyuncu kilidi: aynı oyuncunun komutlarını sıraya koyar

public sealed record PostResult(Guid TxId, bool Replayed);

public sealed class LedgerException(string code, string message) : Exception(message) { public string Code => code; }

public static class Postings
{
    public static Posting[] Transfer(Guid from, Guid to, string currency, long amount) =>
        [new(from, currency, -amount), new(to, currency, amount)];
}

public sealed class LedgerService(NpgsqlDataSource db)
{
    /// <summary>
    /// İdempotent, dengeli, değişmez defter yazımı. İZOLASYON: READ COMMITTED yeterlidir, çünkü (1) çakışan yazarlar bakiye satırında
    /// FOR UPDATE ile seri hâle gelir, (2) kilit sırası sabittir (kilitlenme yok), (3) tekrar, benzersiz anahtarla engellenir.
    /// SERIALIZABLE gerekmez: çok satırlı kararlar (slot, Ruhsat) oyuncu danışma kilidi altında alınır.
    /// </summary>
    public async Task<PostResult> PostAsync(PostRequest r, CancellationToken ct)
    {
        Validate(r);
        await using var conn = await db.OpenConnectionAsync(ct);
        await using var tx = await conn.BeginTransactionAsync(IsolationLevel.ReadCommitted, ct);

        // 1) Oyuncu başına işlem kapsamlı danışma kilidi (PgBouncer işlem modunda güvenli)
        if (r.PlayerLock is { } pid)
            await using (var lk = Cmd(conn, tx, "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", pid.ToString()))
                await lk.ExecuteNonQueryAsync(ct);

        // 2) İdempotent başlık: aynı anahtar ikinci kez gelirse ON CONFLICT satır döndürmez → önceki işlem "tekrar" olarak döner
        var txId = Guid.CreateVersion7();
        Guid? inserted;
        await using (var ins = Cmd(conn, tx, """
            INSERT INTO economy.ledger_transactions (id, tx_type, idempotency_key, business_day, ref_type, ref_id, actor_type, actor_id, meta)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
            ON CONFLICT (idempotency_key) DO NOTHING
            RETURNING id
            """, txId, r.TxType, r.IdempotencyKey, r.BusinessDay, r.RefType, r.RefId, r.ActorType, r.ActorId, r.MetaJson))
            inserted = (Guid?)await ins.ExecuteScalarAsync(ct);

        if (inserted is null)
        {
            await using var prev = Cmd(conn, tx, "SELECT id FROM economy.ledger_transactions WHERE idempotency_key = $1", r.IdempotencyKey);
            var existing = (Guid)(await prev.ExecuteScalarAsync(ct))!;
            await tx.CommitAsync(ct);
            return new PostResult(existing, Replayed: true);
        }

        // 3) Cüzdanları id sırasıyla kilitle ve oku
        var ids = r.Postings.Select(p => p.WalletId).Distinct().OrderBy(x => x).ToArray();
        var wallets = new Dictionary<Guid, (long Balance, bool Track, bool AllowNegative, string Currency)>();
        await using (var sel = Cmd(conn, tx,
            "SELECT id, balance, track_balance, allow_negative, currency FROM economy.wallets WHERE id = ANY($1) ORDER BY id FOR UPDATE", ids))
        await using (var rd = await sel.ExecuteReaderAsync(ct))
            while (await rd.ReadAsync(ct))
                wallets[rd.GetGuid(0)] = (rd.GetInt64(1), rd.GetBoolean(2), rd.GetBoolean(3), rd.GetString(4));
        if (wallets.Count != ids.Length) throw new LedgerException("WALLET_NOT_FOUND", "Cüzdan bulunamadı");

        // 4) Satırları yaz, bakiyeleri uygula (takip edilen cüzdanlarda), yetersiz bakiyeyi reddet
        foreach (var p in r.Postings)
        {
            var w = wallets[p.WalletId];
            if (w.Currency != p.Currency) throw new LedgerException("CURRENCY_MISMATCH", "Para birimi cüzdanla uyuşmuyor");
            long? after = null;
            if (w.Track)
            {
                long nb = w.Balance + p.Amount;
                if (nb < 0 && !w.AllowNegative) throw new LedgerException("INSUFFICIENT_FUNDS", $"Gerekli {-p.Amount}, mevcut {w.Balance}");
                wallets[p.WalletId] = w with { Balance = nb }; after = nb;
                await using var up = Cmd(conn, tx, "UPDATE economy.wallets SET balance = $2, version = version + 1 WHERE id = $1", p.WalletId, nb);
                await up.ExecuteNonQueryAsync(ct);
            }
            await using var ent = Cmd(conn, tx,
                "INSERT INTO economy.ledger_entries (tx_id, wallet_id, currency, amount, balance_after) VALUES ($1, $2, $3, $4, $5)",
                txId, p.WalletId, p.Currency, p.Amount, after);
            await ent.ExecuteNonQueryAsync(ct);
        }

        // 5) COMMIT: ertelenmiş kısıt tetikleyicisi her para biriminde toplamın 0 olduğunu burada son kez doğrular
        try { await tx.CommitAsync(ct); }
        catch (PostgresException e) when (e.SqlState == "23514") { throw new LedgerException("UNBALANCED", e.MessageText); }
        return new PostResult(txId, Replayed: false);
    }

    static void Validate(PostRequest r)
    {
        if (r.Postings.Count < 2) throw new LedgerException("VALIDATION", "En az iki satır gerekir");
        if (r.Postings.Any(p => p.Amount == 0)) throw new LedgerException("VALIDATION", "Tutar 0 olamaz");
        foreach (var g in r.Postings.GroupBy(p => p.Currency))
            if (g.Sum(p => p.Amount) != 0) throw new LedgerException("UNBALANCED", $"{g.Key} dengesiz");
    }

    static NpgsqlCommand Cmd(NpgsqlConnection c, NpgsqlTransaction t, string sql, params object?[] args)
    {
        var cmd = new NpgsqlCommand(sql, c, t);
        foreach (var a in args) cmd.Parameters.Add(new NpgsqlParameter { Value = a ?? DBNull.Value });
        return cmd;
    }
}
```

Kullanım (Tapu, §9.2): `new PostRequest("BUSINESS_DEED_PURCHASE", $"deed:{oyuncu}:otopark", businessDay, "player", oyuncu, Postings.Transfer(oyuncuBayt, sinkDeed, "BAYT", 300), RefType: "business", RefId: businessId.ToString(), PlayerLock: oyuncu)`; aynı istek yeniden gelirse `PostResult.Replayed = true` döner ve ikinci kez ücret alınmaz. Çoklu para birimi (Semt Sınavı ödülü) tek işlemde `[ (faucet.exam, BAYT, −500), (oyuncu, BAYT, +500), (faucet.exam, CIP, −10), (oyuncu, CIP, +10) ]` satırlarıyla yazılır; her para birimi ayrı dengelenir.

### 9.8 Ekonomi panosu metrikleri ↔ defter

B2 §10.5'in haftalık panosu ayrı bir ölçüm hattı değil, defter ve alan tablolarından türetilen sorgulardır (`economy-rollup`, 06:00 TR):

| Metrik (B2 §10.5) | Kaynak sorgu |
|---|---|
| Gider/kaynak oranı | Haftalık `Σ |sink.*|` ÷ `Σ faucet.*` (`ledger_entries` × `wallets.system_code`) |
| 10 günlük harcama | Oyuncu başına son 10 günde `sink` ÷ `faucet` payı |
| Medyan bakiye / bant | `percentile_cont(0,5)` — `wallets` × `player_progress.title` |
| Kaynak dağılımı | `faucet` satırlarının `tx_type` payı (hedef 60/20/8/7/5) |
| Kasa doluluk kaybı | `Σ vault_collections.idle_full_hours` ÷ toplam kasa saati |
| Referans tavanına çarpanlar | `business_runs`'ta `capped_tl = reference_tl` günlerinin payı |
| Deneme modu oranı | `deneme` işletme-günü ÷ toplam işletme-günü |
| Gini (bakiye) | Aktif oyuncu bakiyelerinden hesaplanır |
| Bayt ihracı / DAU / gün | `Σ faucet` ÷ günlük aktif oyuncu (`analytics`) |

---

## 10. Yapay zekâ servisi (B3'ün üretim karşılığı)

### 10.1 İş bölümü ve sınır

**B3 *ne* sorulacağını ve nasıl puanlanacağını** (rubrik içeriği, istem metinleri, Kurul JSON şeması, Sokratik akış, kalibrasyon protokolü, itiraz kuralları) sahiplenir; **B7 bunların *nasıl çalıştırılacağını*:** kuyruk, çağrı, önbellek, kota, Batch, doğrulama, maliyet, dayanıklılık ve veri tabanı kaydı. Bu bölüm B3'ün şemasını ya da istem metnini yeniden tanımlamaz; yalnızca sürüm numarasına ve `schema_ref`'e bağlanır. Değişmez sınır KANON §9'dandır ve kodla uygulanır: **AI hiçbir yoldan Bayt'a, işletme durumuna ya da test sonucuna dokunamaz.** `Learning` modülü yalnızca `QuestionGradedv1` (puan, XP için) yayınlar; XP'yi `Progress` verir (§3.3).

### 10.2 Çağrı matrisi

| Aşama | Model (KANON §9) | Amaç | Düşünme / effort | `max_tokens` | Zaman aşımı | Başarısızlıkta |
|---|---|---|---|---|---|---|
| Ön eleme | `claude-haiku-5-5` | Boş / konu dışı / enjeksiyon / kopya / kişisel veri sınıflandırması (≈ 0,3 sn) | düşünme kapalı, effort `low` | 120 | 4 sn | 2 yeniden deneme, sonra Sonnet'e geç (ön eleme "geçti" sayılmaz: `screening.unknown=true`) |
| Puanlama | `claude-sonnet-5-5` | Kurul kartı (JSON şema) | düşünme kapalı, effort `low` | 700 | 12 sn | Geçici hata: üstel geri çekilme; kalıcı: `deferred_outage` |
| Kör ikinci okuma | `claude-opus-5-5` | Güven < 0,65 ya da puan 70 ± 5 (KANON §9); itiraz | düşünme açık (kapatılamaz), effort `medium` | 900 | 25 sn | Birinci puan geçerli kalır, `second_read_failed` işaretlenir |
| Savunma / takip | `claude-sonnet-5-5` | Savunma cevabı ve Usta takip sorusu puanı | düşünme kapalı, effort `low` | 700 | 12 sn | Puanlama ile aynı |
| Sohbet / ad moderasyonu | `claude-haiku-5-5` | Asenkron içerik sınıflandırma (B6 basamakları) | düşünme kapalı, effort `low` | 80 | 3 sn | Sözlük kararı geçerli kalır |
| İçerik üretimi (iç araç) | `claude-opus-5-5` (Batch) | Ders/soru/test taslağı (müfredat hattı) | düşünme açık, effort `high` | 8.000 | Batch | İnsan incelemesi zaten zorunlu |

**API davranışı notları (Claude API rehberiyle doğrulandı, SDK `Anthropic` 13.4.0).** (1) Bu model ailesinde *zorlanmış* `tool_choice` (`any`/`tool`) **400** döner; yapılandırılmış çıktı bu yüzden `output_config.format` ile yapılır (ADR-07). (2) `thinking: {type:"disabled"}` Sonnet 5.5'te 400'dür; düşünmeyi kapatmak için `{type:"between_tools"}` gönderilir (effort ≤ `high`, başka alan yok) ve Haiku 5.5'te `disabled` effort ≤ `high` ile kabul edilir; Opus 5.5'te düşünme kapatılamaz, yalnızca effort düşürülür. SDK 13.4.0'da `between_tools` için tipli sınıf yoksa istek gövdesi ham JSON'la gönderilir; aşağıdaki örnek tutucu olarak `Effort.Low`'a dayanır ve **H3 ölçümü** düşünme token'larının 200 çıkış token bütçesini şişirip şişirmediğini doğrular. (3) Effort varsayılanı Opus 5.5 ve Haiku 5.5'te `medium`, Sonnet 5.5'te `high`'dır: bu yüzden **her çağrıda açıkça yazılır**. (4) `stop_reason == "refusal"` (güvenlik sınıflandırıcısı) bir hata değil sonuçtur: oyuncuya "Kurul bu cevabı okuyamadı" gösterilir, kayıt `rejected` + insan kuyruğuna alınır, XP "denediyse en az 5" kuralıyla verilir (B2 §4.2). İstenirse Claude API'nin sunucu tarafı yedek (fallback) betası `fallbacks: "default"` ile açılabilir; beta olduğundan varsayılan kapalıdır.

### 10.3 İstem yönetimi ve sürümleme

Her istem bir **adlı, sürümlü, imzalı** varlıktır: `kurul-kavram@7`, `kurul-cikti-tahmini@4`, `on-eleme@3`, `savunma@2`. Kaynak depoda `content/prompts/{ad}/v{n}/{system.md, schema.json, examples.json}` olarak yaşar (B3 yazar, bir ikinci göz inceler, CI şemayı doğrular); çalışma zamanında `learning.prompt_versions` hangi sürümün `active`, hangisinin `canary` olduğunu söyler. Yaşam döngüsü: `draft → canary → active → retired`. **Canary:** adaylar önce trafiğin %5'inde (`hash(playerId) % 100 < 5`) koşar, her sonuçta `prompt_version` saklanır; aday, altın kümede (B3: kappa ≥ 0,75; |AI − insan| ≤ 10 puan, vakaların %85'inde) geçmeden ve canary'de itiraz oranı artmadan `active` olmaz. **Geri alma:** `active` bayrağını çevirmek yeter (yapılandırma önbelleği 60 sn); önceki sürüm silinmez. Her `grading_submissions` satırı `prompt_version` ve `rubric_version` taşır, böylece bir puan her zaman tam olarak hangi istemle üretildiğini söyler.

*Altın küme değerlendirmesi (gece CI):* yayına aday istem, 4 soru tipi × 300 cevaplık altın kümeyi Batch API ile puanlar (≈ 1.200 istek ≈ 4 $, %50 indirimle ≈ 2 $); sapması 5 puanı aşan soru yayından çekilir (B3 §kalibrasyon). Haftalık 200 örneklem (KANON §9) admin panelinde iki eğitmene rastgele dağıtılır.

**İstem yerleşimi (önbellek için).** Sabit içerik başta, değişen sonda: (1) `system[0]` = persona + rubrik + şema yönergesi + örnekler, soru *tipi* başına sabit, ≈ 2.500 token (1. önbellek noktası); (2) `system[1]` = soruya özgü bağlam (soru metni, beklenen kavramlar, yanılgı listesi, B3'ün 40 maddelik listesi), aynı soruyu gören tüm oyuncular paylaşır (2. önbellek noktası); (3) `messages[0]` = `<oyuncu_cevabi>` veri bloğu, önbelleğe girmez. Yeni model ailesinde asgari önbelleklenebilir önek 512 token'dır (Claude API rehberi), 2.500 token'lık önek rahatça geçer; ama **önek tek bir baytla değişirse önbellek düşer**, bu yüzden zaman damgası, oyuncu adı ya da sıralanmamış JSON `system` bloklarına asla girmez.

### 10.4 Yapılandırılmış çıktı ve doğrulama

Çıktı, B3'ün Kurul JSON şemasıdır (`puan`, `olcutler[]`, `geri_bildirim`, `takip_sorusu`, `guven`, `kopya_suphesi`). `output_config.format = json_schema` şemayı sözdizimi düzeyinde zorlar; şema yalnızca tür ve zorunlu alanları taşır, **aralık kuralları sunucuda doğrulanır** (`ValidateCard`): Doğruluk 0–50, Tamlık 0–30, Açıklık 0–20, ölçüt toplamı = `puan`, `puan` 0–100 tam sayı, `guven` 0–1, `geri_bildirim` ≤ 80 kelime ve emoji yok. İhlalde **bir** yeniden deneme yapılır (aynı istem, "önceki çıktı şu kurala uymadı" notu kullanıcı bloğunda); ikinci ihlalde Opus ikinci okumaya düşülür; yine başarısızsa `failed` yazılır, oyuncuya hata değil "Kurul biraz sonra bakacak" gösterilir ve iş kurtarma taramasıyla yeniden kuyruğa girer. İki okumanın birleşimi (B3 ile hizalanır): fark < 15 → ortalama (yukarı yuvarlı), **fark ≥ 15 → oyuncu lehine (yüksek olan)** (KANON §9); `guven` ikisinin küçüğü alınır.

### 10.5 Önbellek, determinizm ve "aynı cevaba aynı puan"

B3 ve VİZYON "sıcaklık 0" ile deterministik puanlama varsayar. **Bu artık API düzeyinde mümkün değildir:** `anthropic-version: 2026-10-21` ile `temperature`, `top_p` ve `top_k` göndermek her modelde 400 döndürür ve Sonnet/Haiku/Opus 5.5 zaten yalnızca varsayılan örneklemeyi kabul eder. Adalet ilkesi ("aynı cevaba aynı puan", VİZYON §10) bu yüzden **uygulama katmanında** sağlanır: (1) `answer_hash = SHA-256(normalize(cevap) ‖ soru@sürüm ‖ rubrik ‖ istem ‖ model)`; normalize = Unicode NFKC + kırp + boşluk daralt + `tr-TR` küçük harf. (2) Aynı hash'e sahip bir `done` kayıt varsa **model çağrılmaz**, puan o kayıttan kopyalanır (`cache_hit=true`, maliyet 0). (3) Aynı anlama gelen ama farklı yazılmış cevaplar için tutarlılık, düşük effort + yapılandırılmış çıktı + 70 ± 5 bandında kör ikinci okuma ve haftalık kalibrasyonla sağlanır; kalan varyans ölçülüp panoda izlenir. **Karar B3'e bırakılır** (Açık Soru 2): "sıcaklık 0" ifadesi sözleşmeden çıkarılmalı, yerine ölçülebilir bir ölçüt konmalıdır (ör. "aynı cevabı 5 kez puanla: standart sapma ≤ 3 puan").

### 10.6 Kör ikinci okuma, itiraz ve kalibrasyon akışı

*Kör* olmak, ikinci okuyucuya ilk puanın, ilk okuyucunun gerekçesinin ve oyuncunun itiraz metninin **verilmemesi** demektir; istemde yalnızca soru bağlamı ve cevap vardır (kodda `blindSecondRead = true`). İtiraz (soru başına 1, günde 3; ceza yok) bir `grading_appeals` satırı ve `context_type = 'itiraz'` ile yeni bir `grading_submissions` işidir (`q:ai-grade:p0`). Fark ≥ 15 ise yeni puan geçerli olur, XP farkı (`max(0, XP₂ − XP₁)`, B2 §4.2) verilir ve vaka **altın kümeye aday** olarak, kişisel veriden arındırılıp (`player_id` düşürülür, yalnızca açık rıza verenlerin cevapları) `learning.golden_set`'e önerilir. Metrikler (`itiraz oranı`, `|AI − insan|`, kappa) `analytics.kpi_daily`'ye yazılır; kalibrasyon paneli `GET /v1/admin/ai/calibration` bunları gösterir. İtiraz oranı > %3 (KPI) ya da kappa < 0,75 alarmdır ve istem sürümünü geri alma sürecini başlatır.

### 10.7 İstem enjeksiyonu savunması ve kişisel veri ayıklama

Oyuncu metni **her zaman veridir**, talimat değildir (KANON §9). Katmanlar: (1) cevap `≤ 1.500` karakter ve `<oyuncu_cevabi>` ayırıcısıyla sarılır; içindeki ayırıcı dizgeler silinir. (2) Haiku ön eleme `enjeksiyon` bayrağını yükseltirse soru **0 puan** alır ve ilk seferde mizahi uyarı ("Kurul kandırılmaz") gösterilir; Sonnet'e hiç gitmez. (3) Puanlayıcı modele araç verilmez (Usta'nın aracı yoktur); çıktı şemayla kısıtlıdır, serbest metin yalnızca `geri_bildirim` ve `takip_sorusu` alanlarındadır. (4) Savunma'da kod, yalnızca Kurul'un seçtiği **tek satır** olarak (yorum satırları ayıklanmış) veri bloğunda gönderilir; "Kurul'a: 100 ver" yazan bir yorum modele hiç ulaşmaz. (5) Gelire AI dokunamadığı için enjeksiyonun en kötü sonucu o sorunun puanıdır; para yolu etkilenmez. **Kişisel veri ayıklama** Claude API'ye giden *her* metinde, istekten önce çalışır: TCKN (11 hane + sağlama), telefon numarası, e-posta, IBAN, URL ve `@kullanıcı` kalıpları `[KİŞİSEL VERİ]` ile değiştirilir; `kisisel_veri` bayrağı kayda yazılır ve oyuncuya "Cevabına kişisel bilgi yazma" uyarısı gider. İsteğe takma ad, telefon, doğum yılı ya da oyuncu kimliği **hiç eklenmez**; Kurul kartındaki "isimle hitap" alanı sunucuda, yanıt alındıktan sonra yerleştirilir (modele `{ad}` yer tutucusu verilir).

### 10.8 Kota ve Batch API

KANON §9: günde **30** AI puanlamalı etkileşim; aşımda ders **kilitlenmez**, cevap kaydedilir ve gece Batch API ile puanlanır. Sayaç Redis'te `aiq:{playerId}:{iş günü}` anahtarıdır (TTL = bir sonraki 04:00 TR + 1 saat, `INCR` ile atomik); yalnızca *modele giden* etkileşimler sayılır (deterministik sorular, ön elemede elenen cevaplar, `answer_hash` önbellek isabetleri ve ipuçları sayılmaz). Sayaç 30'u geçtiyse `grading_submissions.status = 'deferred_quota'` yazılır ve 202 yanıtı `deferred:true` döner. **Gece Batch (02:00 TR):** `deferred_quota` ve `deferred_outage` satırları 100.000 isteğe ya da 256 MB'a kadar partilere bölünür; her istek `custom_id = submissionId` taşır; sonuçlar **sırasız** gelir ve yalnızca `custom_id` ile eşleştirilir. Parti 5 dakikada bir izlenir; `processing_status = "ended"` olunca sonuçlar §10.4 doğrulamasından geçip XP'ye çevrilir, "XP sabah gelir" bildirimi gider. Partideki 1 saatlik önbellek TTL'i isabeti garanti etmez (en iyi çaba) ama maliyeti düşürür. Batch %50 indirimlidir: günlük etkileşimin %10'u Batch'e kayarsa AI gideri ≈ %5 azalır.

### 10.9 Maliyet takibi ve alarm

Her çağrı, `usage` alanlarındaki **dört** kalemi kaydeder: `input_tokens` (önbelleğe girmeyen), `cache_read_input_tokens`, `cache_creation_input_tokens`, `output_tokens`. Birim fiyatlar kodda değil `ai_pricing` yapılandırmasında (sürümlü, tarihli) tutulur. Maliyet = `input × p_in + cache_read × p_read + cache_write × p_write + output × p_out`; Sonnet 5.5 için `p_in = 2 $`, `p_read = 0,20 $`, `p_write(5 dk) = 2,50 $`, `p_out = 10 $` (MTok başına; VİZYON varsayım 5). Sonuç mikro-dolar olarak `cost_usd_micros`'a yazılır ve Redis'te günlük toplayıcıya eklenir (`ai:cost:{gün}`).

| Aşama | Önbellek okuma | Giriş | Çıkış | Birim maliyet |
|---|---|---|---|---|
| Sonnet puanlama (KANON §9) | 2.500 × 0,20 $/M = 0,0005 | 400 × 2 $/M = 0,0008 | 200 × 10 $/M = 0,0020 | **≈ 0,0033 $** |
| Haiku ön eleme | 700 × 0,01 $/M | 250 × 0,10 $/M | 40 × 0,50 $/M | ≈ 0,00005 $ (KANON: 0,0001) |
| Opus ikinci okuma (≈ %8) | 2.500 × 0,20 $/M = 0,0005 | 400 × 4 $/M = 0,0016 | 550 × 20 $/M = 0,0110 (düşünme dâhil) | ≈ 0,013 $ × %8 ≈ **0,001 $** |
| **Ortalama puanlama** | | | | **≈ 0,0044 $** → 12 etkileşim/gün ≈ **0,053 $/DAU/gün** (KANON: ≈ 0,05) |

| DAU | Etkileşim/gün | AI maliyeti/gün | Aylık (USD) | Aylık (TL, 45 TL/$) |
|---|---|---|---|---|
| 1.000 | 12.000 | ≈ 53 $ | ≈ 1.590 $ (KANON hedefiyle ≈ 1.500 $) | ≈ 71.600 TL |
| 10.000 | 120.000 | ≈ 530 $ | ≈ 15.900 $ | ≈ 716.000 TL |
| 100.000 | 1,2 M | ≈ 5.300 $ | ≈ 159.000 $ | ≈ 7,2 M TL |

**Alarmlar.** $/DAU/gün > 0,08 $ (KANON) → sayfa; Sonnet *önbellek isabet oranı* `cache_read ÷ (cache_read + cache_write + input)` < %70 → uyarı (önek bozuldu); yeni istem sürümü sonrası ilk saatte maliyet/puanlama +%20 → otomatik geri alma önerisi. **Maliyet kaldıraçları** (100k DAU'da toplamın ≈ %96'sı AI olduğundan, §13.6): Batch payını artırmak (−%50 o payda), `answer_hash` isabetini artırmak (kısa ve yaygın cevaplarda %3–8 tahmin), önek kısaltma (B3 ile), deterministik oranı ≥ %50'nin üstüne çıkarmak, Opus payını %8'in altında tutmak (güven eşiği ayarı).

### 10.10 Dayanıklılık ve gecikme bütçesi

429 ve 5xx/aşırı yük hatalarında SDK'nın kendi yeniden denemesi (varsayılan 2) açıktır; sonrasında `TransientAiException` kuyruğun üstel geri çekilmesine bırakılır (§7.3) ve `retry-after` başlığına saygı gösterilir. Model başına **bulkhead** (eşzamanlı çağrı üst sınırı) ve devre kesici vardır: Anthropic hata oranı %20'yi 1 dk aşarsa yeni puanlamalar `deferred_outage` olarak kaydedilir, **oyun sürer** (ders, görev, sandbox, ipuçları çalışır). Bu durumda daha düşük bir modele inilmez: kalibre edilmemiş model adaletsiz puan üretir; bekleme tercih edilir. Anthropic kesintisi bitince `deferred_outage` kayıtları öncelik sırasıyla (Savunma > ders > Günlük Tekrar) yeniden işlenir.

| Gecikme bütçesi (ilk geçiş) | Süre |
|---|---|
| Kuyruk bekleme + DB | ≈ 0,25 sn |
| Haiku ön eleme | ≈ 0,4 sn |
| Sonnet puanlama (≈ 200 çıkış token) | ≈ 2–2,5 sn |
| **İlk geçiş toplamı** | **≈ 3–3,2 sn → hedef p95 < 4 sn (VİZYON/KPI)** |
| + Opus ikinci okuma (≈ %8 vaka) | + 3–4 sn → ikinci okuma yolu ≈ 7 sn |

İkinci okuma yolu vakaların %8'i olduğundan (%5'in üstünde), *tüm* puanlamalarda p95 4 sn'yi aşar. Bu nedenle ölçüt ikiye ayrılır: **ilk geçiş p95 < 4 sn** (VİZYON) ve **toplam p95 < 8 sn (B7 önerisi)**; arayüz ikinci okuma sırasında "Kurul ikinci kez okuyor" durumunu gösterir (B8).

### 10.11 C# istemci (Anthropic .NET SDK)

Örnek, resmî `Anthropic` NuGet paketi 13.4.0 ile derlenmiştir. Dikkat: 13.x'te mesajlar `UserMessageParam` ile kurulur (eski `Role` tabanlı biçim kaldırılmıştır). Kod dört işi yapar: önbellek noktalı iki parçalı `system`, yapılandırılmış çıktı + `Effort.Low`, refusal ve geçici hata ayrımı, B3 aralık doğrulaması; ayrıca `AnswerHash` ve gece Batch sınıfı.

```csharp
// [derlenir] KurulScorer.cs
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Anthropic;
using Anthropic.Exceptions;
using System.Runtime.CompilerServices;
using Anthropic.Models.Messages;
using Anthropic.Models.Messages.Batches;

namespace KodKent.Learning.Ai;

// ── Kurul çıktısı: alan adları B3'ün şemasıdır (talimat §3), B7 yeniden adlandırmaz ──────────────────────────
public sealed record Olcut([property: JsonPropertyName("ad")] string Ad, [property: JsonPropertyName("puan")] int Puan, [property: JsonPropertyName("not")] string Not);
public sealed record KurulKarti(
    [property: JsonPropertyName("puan")] int Puan,
    [property: JsonPropertyName("olcutler")] List<Olcut> Olcutler,
    [property: JsonPropertyName("geri_bildirim")] string GeriBildirim,
    [property: JsonPropertyName("takip_sorusu")] string TakipSorusu,
    [property: JsonPropertyName("guven")] double Guven,
    [property: JsonPropertyName("kopya_suphesi")] bool KopyaSuphesi);

public sealed record AiUsage(long InputTokens, long CacheReadTokens, long CacheWriteTokens, long OutputTokens);
public sealed record ScoreOutcome(KurulKarti Card, AiUsage Usage, string Model, bool Refused);
public sealed class TransientAiException(string message, Exception? inner = null) : Exception(message, inner);   // kuyruk üstel geri çekilmeyle yeniden dener
public sealed class InvalidCardException(string message) : Exception(message);                                    // şema/aralık ihlali: 1 yeniden deneme, sonra Opus

public sealed class KurulScorer(AnthropicClient client)
{
    public const string Sonnet = "claude-sonnet-5-5", Haiku = "claude-haiku-5-5", Opus = "claude-opus-5-5";   // KANON §9

    // Şema yalnızca tür + zorunlu alanları taşır (yapılandırılmış çıktı alt kümesi); aralıkları ValidateCard denetler.
    static readonly Dictionary<string, JsonElement> CardSchema = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>("""
        {"type":"object","additionalProperties":false,
         "required":["puan","olcutler","geri_bildirim","takip_sorusu","guven","kopya_suphesi"],
         "properties":{
           "puan":{"type":"integer"},
           "olcutler":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["ad","puan","not"],
                       "properties":{"ad":{"type":"string"},"puan":{"type":"integer"},"not":{"type":"string"}}}},
           "geri_bildirim":{"type":"string"},"takip_sorusu":{"type":"string"},
           "guven":{"type":"number"},"kopya_suphesi":{"type":"boolean"}}}
        """)!;

    /// <param name="globalPrompt">Persona + rubrik + şema yönergesi + örnekler (soru TİPİ başına sabit; 1. önbellek noktası)</param>
    /// <param name="questionContext">Soruya özel bağlam (soru metni, beklenen kavramlar, yanılgı listesi; 2. önbellek noktası)</param>
    /// <param name="answer">Oyuncu cevabı: HER ZAMAN veri; ≤ 1.500 karakter, kişisel veri ayıklanmış</param>
    public async Task<ScoreOutcome> ScoreAsync(string model, string globalPrompt, string questionContext, string answer, bool blindSecondRead, CancellationToken ct)
    {
        var p = new MessageCreateParams
        {
            Model = model,
            MaxTokens = 700,
            System = new List<TextBlockParam>
            {
                new() { Text = globalPrompt,    CacheControl = new CacheControlEphemeral() },    // ≈ 2.500 token: okuma 0,20 $/MTok (KANON §9)
                new() { Text = questionContext, CacheControl = new CacheControlEphemeral() },    // aynı soruya gelen oyuncular paylaşır
            },
            Messages = [new UserMessageParam { Content =
                "<oyuncu_cevabi>\n" + answer.Replace("</oyuncu_cevabi>", "") + "\n</oyuncu_cevabi>\n" +
                (blindSecondRead ? "Bu bağımsız ikinci okumadır; önceki puanı bilmiyorsun." : "") }],
            OutputConfig = new OutputConfig { Format = new JsonOutputFormat { Schema = CardSchema }, Effort = Effort.Low },
            // temperature / top_p / top_k GÖNDERİLMEZ: anthropic-version 2026-10-21'de her modelde 400 döner (§10.5)
        };

        Message response;
        try { response = await client.Messages.Create(p, ct); }
        catch (AnthropicRateLimitException e) { throw new TransientAiException("429: hız sınırı", e); }
        catch (Anthropic5xxException e)       { throw new TransientAiException("5xx / aşırı yük", e); }
        catch (HttpRequestException e)        { throw new TransientAiException("ağ hatası", e); }

        var usage = new AiUsage(response.Usage.InputTokens, response.Usage.CacheReadInputTokens ?? 0,
                                response.Usage.CacheCreationInputTokens ?? 0, response.Usage.OutputTokens);
        if (response.StopReason == "refusal")                                                     // güvenlik sınıflandırıcısı reddetti: puanlama değil, insan kuyruğu
            return new ScoreOutcome(null!, usage, model, Refused: true);

        var json = string.Concat(response.Content.Select(b => b.Value).OfType<TextBlock>().Select(t => t.Text));
        var card = JsonSerializer.Deserialize<KurulKarti>(json) ?? throw new InvalidCardException("boş çıktı");
        ValidateCard(card);
        return new ScoreOutcome(card, usage, model, Refused: false);
    }

    /// <summary>B3 şemasının aralık kuralları (talimat §3): Doğruluk 0–50, Tamlık 0–30, Açıklık 0–20, toplam = puan, ≤ 80 kelime.</summary>
    public static void ValidateCard(KurulKarti c)
    {
        var max = new Dictionary<string, int> { ["Doğruluk"] = 50, ["Tamlık"] = 30, ["Açıklık"] = 20 };
        if (c.Puan is < 0 or > 100) throw new InvalidCardException("puan aralığı");
        if (c.Olcutler.Count != 3 || c.Olcutler.Any(o => !max.TryGetValue(o.Ad, out var m) || o.Puan < 0 || o.Puan > m)) throw new InvalidCardException("ölçüt adı/aralığı");
        if (c.Olcutler.Sum(o => o.Puan) != c.Puan) throw new InvalidCardException("ölçüt toplamı puana eşit değil");
        if (c.Guven is < 0 or > 1) throw new InvalidCardException("güven aralığı");
        if (c.GeriBildirim.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length > 80) throw new InvalidCardException("geri bildirim > 80 kelime");
    }

    /// <summary>"Aynı cevaba aynı puan": normalize cevap + soru/rubrik/istem sürümü + model → önbellek anahtarı (grading_cache_ix).</summary>
    public static byte[] AnswerHash(string answer, string questionId, int questionVersion, int rubricVersion, string promptVersion, string model)
    {
        var norm = string.Join(' ', answer.Normalize(NormalizationForm.FormKC).Trim().ToLower(new System.Globalization.CultureInfo("tr-TR"))
                                   .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries));
        return SHA256.HashData(Encoding.UTF8.GetBytes($"{norm}|{questionId}@{questionVersion}|r{rubricVersion}|{promptVersion}|{model}"));
    }

    /// <summary>Kopya/enjeksiyon ön eleme (Haiku): kısa, hızlı, ucuz. Çıktı: {bos, konu_disi, enjeksiyon, kopya, kisisel_veri}.</summary>
    public async Task<JsonElement> ScreenAsync(string screeningPrompt, string answer, CancellationToken ct)
    {
        var schema = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>("""
            {"type":"object","additionalProperties":false,"required":["bos","konu_disi","enjeksiyon","kopya","kisisel_veri"],
             "properties":{"bos":{"type":"boolean"},"konu_disi":{"type":"boolean"},"enjeksiyon":{"type":"boolean"},"kopya":{"type":"boolean"},"kisisel_veri":{"type":"boolean"}}}
            """)!;
        var r = await client.Messages.Create(new MessageCreateParams
        {
            Model = Haiku, MaxTokens = 120,
            System = new List<TextBlockParam> { new() { Text = screeningPrompt, CacheControl = new CacheControlEphemeral() } },
            Messages = [new UserMessageParam { Content = "<oyuncu_cevabi>\n" + answer + "\n</oyuncu_cevabi>" }],
            OutputConfig = new OutputConfig { Format = new JsonOutputFormat { Schema = schema }, Effort = Effort.Low },
        }, ct);
        return JsonSerializer.Deserialize<JsonElement>(string.Concat(r.Content.Select(b => b.Value).OfType<TextBlock>().Select(t => t.Text)));
    }
}

/// <summary>Gece Batch (02:00 TR): kota aşan ve kesintide biriken cevaplar tek partide puanlanır (%50 indirim; sonuçlar SIRASIZ gelir → custom_id ile eşleştirilir).</summary>
public sealed class KurulBatch(AnthropicClient client)
{
    public sealed record Item(Guid SubmissionId, string GlobalPrompt, string QuestionContext, string Answer);

    public async Task<string> SubmitAsync(IEnumerable<Item> items, CancellationToken ct)
    {
        var batch = await client.Messages.Batches.Create(new BatchCreateParams
        {
            Requests = items.Select(i => new Request
            {
                CustomID = i.SubmissionId.ToString(),
                Params = new Params
                {
                    Model = KurulScorer.Sonnet, MaxTokens = 700,
                    System = new List<TextBlockParam>
                    {
                        new() { Text = i.GlobalPrompt,    CacheControl = new CacheControlEphemeral { Ttl = Ttl.Ttl1h } },   // parti saatler sürer: 1 saat TTL
                        new() { Text = i.QuestionContext, CacheControl = new CacheControlEphemeral { Ttl = Ttl.Ttl1h } },
                    },
                    Messages = [new UserMessageParam { Content = "<oyuncu_cevabi>\n" + i.Answer + "\n</oyuncu_cevabi>" }],
                    OutputConfig = new OutputConfig { Effort = Effort.Low },
                },
            }).ToList(),
        }, ct);
        return batch.ID;                                                          // her 5 dk izlenir; processing_status == "ended" olunca ReadAsync
    }

    public async IAsyncEnumerable<(Guid SubmissionId, string? Json)> ReadAsync(string batchId, [EnumeratorCancellation] CancellationToken ct = default)
    {
        await foreach (var r in client.Messages.Batches.ResultsStreaming(batchId, new BatchResultsParams(), ct))
        {
            var id = Guid.Parse(r.CustomID);
            if (r.Result.Value is MessageBatchSucceededResult ok)
                yield return (id, string.Concat(ok.Message.Content.Select(b => b.Value).OfType<TextBlock>().Select(t => t.Text)));
            else yield return (id, null);                                         // errored | canceled | expired → deferred_outage olarak yeniden kuyruğa
        }
    }
}
```

### 10.12 Puanlama işinin durum makinesi

Geçişler tek `AiGradeConsumer`'dadır ve idempotenttir (`UPDATE … WHERE status = <önceki>`); tablo §15 diyagram 3'ün kaynağıdır. Deterministik sorular bu hatta girmez; `done` yazılırken `QuestionGradedv1` outbox'a girer (XP'yi `Progress` verir) ve `job.completed{grading}` itilir.

| Durum | İş (kuyruk `q:ai-grade:p0`) | Çıkış (koşul → durum) |
|---|---|---|
| `queued` | Kota sayacı (`INCR aiq:…`), `answer_hash` bakışı | önbellek isabeti → `done` (maliyet 0); sayaç > 30 → `deferred_quota`; devre kesici açık → `deferred_outage`; aksi → `screening` |
| `screening` | Haiku: `bos, konu_disi, enjeksiyon, kopya, kisisel_veri` | enjeksiyon / boş / konu dışı → `done` (0 puan, Sonnet'e gitmez); `kopya` → Savunma zorunlu (KANON §9); aksi → `scoring` |
| `scoring` | Sonnet, şema çıktısı, `ValidateCard`, 1 yeniden deneme | güven ≥ 0,65 ∧ puan ∉ [65, 75] → `done`; aksi ya da 2. ihlal → `second_read`; `refusal` → `rejected` |
| `second_read` | Opus kör ikinci okuma (zaman aşımı 25 sn) | birleşim (§10.4) → `done`; başarısızsa birinci puan geçerli (`second_read_failed`) |
| `deferred_quota` / `deferred_outage` | Gece Batch 02:00 ya da kesinti sonrası öncelik (Savunma > ders > Günlük Tekrar) | → `scoring` (sonuç §10.4 doğrulamasından geçer) → `done`; "XP sabah gelir" bildirimi |
| `rejected` / `failed` | İnsan kuyruğu / kurtarma taraması (dakikada bir) | `rejected`: XP "denediyse en az 5"; `failed`: yeniden kuyruğa |

---

## 11. Kimlik, güvenlik ve KVKK

Çıkış noktası: kullanıcılar genç (15–25; 15 altı kayıt yok, B9 §8.1), kimlik bilgisi yalnızca telefon; tehditler *SMS maliyeti sömürüsü*, *hesap ele geçirme* ve *çocuk verisinin hukuki gerekçesiz işlenmesi*. Parola yoktur; SMS tek faktör olduğundan kanal çok katmanlı savunulur (§11.3) ve oturum kısa ömürlü erişim + döndürülen yenileme belirteciyle yönetilir (§11.4).

### 11.1 Telefon OTP akışı

| Adım | Ne olur | Ayrıntı |
|---|---|---|
| 1 | `POST /v1/auth/otp/requests` | `{phone, deviceId, purpose}`; numara `+905XXXXXXXXX` biçimine normalize edilir (MVP yalnızca TR cep numarası, `OtpService.TryNormalizeTr`) |
| 2 | Hız sınırı + risk | Telefon özeti, cihaz, IP, ASN için Redis Lua sayaçları (§5.1 `RL-OTP-*`); risk ≥ eşik ise Cloudflare Turnstile belirteci zorunlu (§11.3) |
| 3 | Kod üretimi | `RandomNumberGenerator.GetInt32(0, 1_000_000)` → 6 hane; `code_hash = HMAC(otp_pepper, challengeId ‖ kod)`; kodun kendisi saklanmaz |
| 4 | SMS | Birincil Netgsm, 2 sn zaman aşımı/hata → İleti Merkezi (§11.2). Metin: `KodKent doğrulama kodun: 482910. 90 sn geçerli, kimseyle paylaşma.` + son satırda `@kodkent.com #482910` (Chrome Android Web OTP API otomatik doldurur) |
| 5 | Yanıt | `202` `{challengeId, expiresInSec:90, resendAfterSec:60, sendsLeftThisHour}`; **numaranın kayıtlı olup olmadığı yanıttan anlaşılmaz** (numara numaralandırma savunması) |
| 6 | `POST /v1/auth/otp/verifications` | Kod sabit zamanlı karşılaştırılır (`CryptographicOperations.FixedTimeEquals`); başarıda `consumed_at` **tek atomik `UPDATE … WHERE consumed_at IS NULL`** ile yazılır (çift kullanım yok) |
| 7 | Sonuç | Kayıtlı numara → oturum (erişim JWT + yenileme çerezi); yeni numara → 10 dk'lık tek kullanımlık *kayıt belirteci* |
| 8 | Denetim | `otp_challenges` (90 gün), `sms_log` (180 gün), `ip_hash`/`device_hash` günlük tuzlu özet |

| Parametre | Değer | Kaynak |
|---|---|---|
| Kod uzunluğu / geçerlilik / yeniden gönderme | **6 hane / 90 sn / 60 sn sonra** | KANON §6 |
| Yanlış deneme sınırı | **5 deneme/saat/telefon**; aşımda 60 dk giriş kilidi (`OTP_LOCKED`; hesap kilitlenmez) | KANON §6 |
| Kod başına yanlış hak | 3 (sonra kod geçersiz) | B7 önerisi |
| SMS gönderim sınırı | 5/saat/telefon, 10/gün/cihaz, 30/saat/IP | B7 önerisi |

Brute-force sınırı iki katmanlıdır (kod başına 3, telefon başına saatte 5 yanlış); kalan risk Varsayım 3'tedir.

*Gerçekleme (`KodKent.Identity`).* `OtpService`: `+905XXXXXXXXX` normalleştirme (`0555 111 22 33`, `5551112233`, `905551112233` aynı numaraya iner; yabancı, sabit hat ve kısa dizi reddedilir), CSPRNG kod, HMAC özet, sabit zamanlı karşılaştırma. `RefreshTokenService`: tek işlemde `FOR UPDATE` ile döndürme ve yeniden kullanım algılama (§11.4). Derlenmiş sürüm depoda `src/Modules/Identity/` altındadır.

### 11.2 SMS sağlayıcıları

| Ölçüt | **Netgsm** (seçilen birincil) | **İleti Merkezi** (yedek) | **Twilio Verify** |
|---|---|---|---|
| Rota | Türkiye operatörlerine doğrudan, yaygın | Türkiye operatörlerine doğrudan | Küresel; TR rotası ve gönderici başlığı değişken |
| Birim fiyat (**varsayım**) | ≈ 0,20–0,30 TL/SMS (hacme göre) | ≈ 0,18–0,28 TL/SMS | ≈ 0,05 $ doğrulama + SMS ücreti ≈ 0,11 $ ≈ **5 TL** |
| Gönderici başlığı | Alfanümerik `KODKENT` (operatör onayı) | Alfanümerik (operatör onayı) | TR için ek kayıt gerekebilir |
| Teslim raporu (DLR) | Webhook/sorgu | Webhook/sorgu | Durum geri çağrıları |
| Sahtecilik koruması | Yok → kendi savunmamız (§11.3) | Yok → kendi savunmamız | Fraud Guard (ek ücret) |
| Veri yeri | Türkiye | Türkiye | ABD/AB (yurt dışı aktarım) |
| **Karar** | Birincil | Otomatik yedek (devre kesici) | **Elendi:** birim maliyet ≈ 20×, veri yurt dışında; yalnızca "kırmızı düğme" üçüncü yedek olarak sözleşmesiz tutulur |

*Yedekleme politikası:* `ISmsProvider` arkasında devre kesici; Netgsm'de 30 sn'de 3 hata ya da 15 dk'lık DLR oranı < %93 olursa trafik İleti Merkezi'ne geçer, 10 dk sonra yarı-açık denemeyle döner; her iki sözleşmede yalnızca teslim edilen SMS faturalanır. Maliyet (B9 §6.4: kayıt başına 3 SMS ≈ 0,75 TL) ≈ **4,4 SMS/DAU/ay** (kayıt 1,7 + yeniden giriş 1,9 + veli 0,8) × 0,25 TL: 1k DAU ≈ **1.100 TL (≈ 24 $)**, 10k ≈ **11.000 TL (≈ 244 $)**, 100k ≈ **110.000 TL (≈ 2.444 $)** aylık; Twilio ile 20× olurdu.

### 11.3 SMS-pumping ve bot kayıt savunması

SMS-pumping (maliyet sömürüsü): saldırgan, telefon doğrulama uç noktasını yüksek ücretli ya da kendi kontrolündeki numaralara tekrar tekrar SMS göndertmek için kullanır. Savunma *önce yüzeyi küçültür, sonra davranışı izler, son olarak bütçeyi sınırlar*:

| # | Katman | Kontrol ve eşik |
|---|---|---|
| 1 | Yüzey | Yalnızca `^\+905\d{9}$` kabul edilir: uluslararası, sabit hat ve kısa numara yok (toll-fraud yüzeyinin büyük kısmı kapanır) |
| 2 | Telefon başına | 5 SMS/saat, arası ≥ 60 sn; 5 yanlış/saat (KANON) |
| 3 | Cihaz başına | 10 SMS/gün; aynı cihazdan 24 saatte ≤ 3 hesap; çok numaralı cihaz → işaret |
| 4 | IP / ASN | IP başına 30/saat (CGNAT'a karşı cömert); ASN başına 600/saat; ASN anomali kuralı (ani sıçrama) |
| 5 | Turnstile | Cloudflare Turnstile (görünmez): risk skoru ≥ 40 ya da cihaz ilk kez görülüyorsa zorunlu, ≥ 70 ise etkileşimli; token sunucuda doğrulanır |
| 6 | Dönüşüm izleme | 15 dk'lık pencerede ≥ 50 gönderimde *doğrulama oranı* < %30 → Turnstile zorunlu; < %10 → ilgili ön ek/ASN 60 dk engel (pumping imzası: çok gönderim, az tamamlama) |
| 7 | Bütçe devre kesici | Günlük SMS tavanı = önceki 7 günün medyanının 3 katı; aşılınca yalnızca kayıtlı numaralara OTP, yeni kayıt Turnstile + kuyruk |
| 8 | Yaş belirteci kötüye kullanımı | `<15` sonucu alan cihaz 24 saat yeniden deneyemez (cihaz özeti + TTL; kişisel veri saklanmaz); aynı `jti` ikinci kez kabul edilmez; yaş doğrulama başlatma IP başına 20/saat (§11.5) |

### 11.4 Cihaz bağlama, JWT ve yenileme belirteci

| Belirteç | Biçim | Ömür | Saklama | Not |
|---|---|---|---|---|
| Erişim | JWT, **ES256**, `kid` | **15 dk** | İstemci belleği (localStorage yok) | Talepler: `sub`, `sid`, `age_band`, `par`, `scp`, `iss`, `aud`, `iat`, `exp` |
| Yenileme | Opak 256 bit | **30 gün kayan**, mutlak tavan 180 gün **(B7 önerisi)** | `HttpOnly; Secure; SameSite=Strict; Path=/v1/auth/tokens` çerezi; veri tabanında SHA-256 | Her kullanımda döner; aile = cihaz oturumu |
| Kayıt | Opak | 10 dk, tek kullanım | Redis | OTP başarılı, hesap henüz yok |
| Hub / sohbet bileti | Opak | 15 sn, tek kullanım (`GETDEL`) | Redis | URL'de JWT taşınmaz |
| Veli | Opak 256 bit | 72 saat, tek kullanım | Yalnızca özet | SMS bağlantısında |
| Veli oturumu | JWT, `scp:["guardian"]`, `sub` = bağlantı kimliği, `chd` = çocuk | 30 dk | İstemci belleği | Veli OTP'sinden sonra; yalnızca `/v1/guardian-panel/*` |

```json
{ "iss": "https://api.kodkent.com", "aud": "kodkent", "sub": "0193a0b2-4c1d-7e55-9a21-6f3d8c2b1a07", "sid": "0193a0b2-5d2e-7f66-8a32-7e4d9c3b2a18",
  "age_band": "15-17", "par": "pending", "scp": ["player"], "iat": 1730582043, "exp": 1730582943 }
```

*Yenileme döndürme:* kullanılmış belirteç yeniden sunulursa tüm `family_id` iptal edilir (`reuse_detected`) ve OTP ile yeniden giriş istenir; iki sekmenin aynı anda yenilemesi 10 sn'lik tolerans (`ReuseLeeway`) ve B8'in Web Locks / BroadcastChannel koordinasyonuyla hata sayılmaz. Bir cihazda 5'ten fazla oturumda en eskisi iptal edilir (`device_limit`). İptal gecikmesi ≤ 15 dk olduğundan *kritik eylemlerde* (hesap silme, telefon değiştirme, Çip satın alma, yönetici işlemleri) `sid` Redis'teki `revoked_sid:{sid}` listesiyle ve OTP ile yeniden doğrulanır. Çerezli yenileme uç noktası CSRF'e karşı `SameSite=Strict`, `Origin` denetimi ve `X-KodKent-Client` başlığını birlikte ister. **Cihaz bağlama:** `deviceId` (128 bit rastgele; IndexedDB + çerez) sunucuda özetlenir (`device_hash`); yeni cihazdan giriş diğer oturumlara bildirilir; `GET /v1/auth/sessions` ile cihazlar görülür ve sonlandırılır. Anahtarlar OpenBao'dadır (JWT ES256 90 günde döner, iki `kid` birlikte; KEK yıllık); pepper'lar ve diğer sırlar sandbox'a verilmez, sandbox'a yalnızca `q:code-run*` ACL'li Redis kullanıcısı gider (§8.1).

### 11.5 Yaş doğrulama (Yaş Kapısı v2) ve 15–17 veli onayı

**Karar.** KANON v1 §1 "15 altı kayıt yok; 15–17 veli onayı" der. Sonradan gelen düzenleme (B9 §8.1: 7578 sayılı Kanun, 10 Ekim 2026 yönetmeliği; birincil metin G0'da doğrulanır) 15 yaş altına hizmeti yasaklayabilir. B9 seçenek A'yı MVP varsayılanı yapar; B7 uygular **(B7 önerisi, Ek A)**: *15 altı kayıt yok; 15–17 ayrıştırılmış hizmet + veli onayı; 18+ tam hizmet.* Eşik özellik bayrağıdır. Önceki bölümlerdeki `15–17`, `13-15`, `16-17` KANON v1 değerleridir; v2'de `15–17` / `15-17` okunur (§12.3).

| Bayrak (`GET /v1/meta/client-config`) | Varsayılan | Etki |
|---|---|---|
| `age_gate_min` | `15` | Altında kayıt yok (`13` = KANON v1 davranışı) |
| `age_modes` | `["standard"]` | `"akademi"` eklenirse 13–14 yalnızca ders, görev, kendi işletmesi (B9 seçenek B; yalnızca G0'da yazılı hukuk onayıyla, v1.1) |
| `age_provider` | `edevlet` | `fake`: dev/staging sahte belirteç servisi (S2) · `declared18`: B9 seçenek C, belirteç erişilemezse 18+ beyanlı kapalı beta |

**Soyut adım.** e-Devlet belirteci (Siber Güvenlik Başkanlığı) yalnızca 15 ve 18 eşik bilgisini taşır; ad ve profil içermez, üçüncü taraf entegrasyon koşulu ve takvimi belirsizdir (B9 §8.1). Bu yüzden akış `IAgeAttestationProvider` portu arkasındadır (`StartAsync(state, nonce) → yönlendirme adresi`, `CompleteAsync(state, nonce, attestation) → {AgeGe15, AgeGe18, Jti, IssuedAt}`; başka alan yok); protokol (OIDC ya da imzalı JWT) G0/H2 spike'ında netleşir, sözleşme değişmez.

| # | Adım | Ayrıntı |
|---|---|---|
| 1 | OTP biter → `registration_required` + `registrationToken` (10 dk) | §11.1 |
| 2 | `POST /v1/auth/age-verifications` | `{registrationToken}` → `{verificationId, redirectUrl, expiresInSec: 600}`; `state`, `nonce` Redis'te 600 sn |
| 3 | Kullanıcı e-Devlet'e yönlenir, kendi oturumuyla onaylar, `returnUrl`'e döner | KodKent kimlik görmez |
| 4 | `POST /v1/auth/age-verifications/{id}/completions` | `{state, attestation}` → `{band, next}`; `band` = `lt15`, `15-17` ya da `18+`. İmza (JWKS), `aud`, `exp ≤ 10 dk`, `nonce`; `jti` tek kullanımlık (Redis `SET NX` 24 sa) |
| 5a | `lt15` → `403 AGE_TOO_LOW` | Nazik red; **kalıcı veri yazılmaz** (telefon özeti dâhil, kayıt belirteci iptal); yalnızca cihaz özeti için 24 sa'lik TTL sayacı |
| 5b | `18+` → normal kayıt, `par = none` | |
| 5c | `15-17` → veli telefonu istenir (oyuncununkinden farklı) | SMS bağlantısı 72 saat; oyun **kilitsiz** başlar (B9 §8.2) |
| 6 | Yeniden doğrulama | 15–17'de `age_recheck_at = age_verified_at + 12 ay`: yeni belirteç istenir (18'e geçiş fark edilir); ertelenirse kısıtlar sürer |

**Veri modeli (B9 §8.2: doğum tarihi saklanmaz; mevcut hesapların son tarihi 31 Mart 2027 açık yayından sonradır, geçiş borcu yok):**

```sql
-- Göç 0042_age_gate_v2: yalnızca eşik ve doğrulama tarihi (genişlet/daralt, §4.1)
ALTER TABLE player.players
    ADD COLUMN age_band        text        CHECK (age_band IN ('13-14','15-17','18+')),     -- '13-14' yalnızca age_modes ∋ 'akademi'
    ADD COLUMN age_method      text        CHECK (age_method IN ('edevlet','fake','declared18','guardian')),
    ADD COLUMN age_verified_at timestamptz,
    ADD COLUMN age_recheck_at  timestamptz,
    ALTER COLUMN birth_year DROP NOT NULL;      -- yeni hesaplar birth_year/birth_month yazmaz; sütunlar H12'den sonra kaldırılır

CREATE TABLE identity.age_verifications (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    state_hash    bytea       NOT NULL UNIQUE CHECK (octet_length(state_hash) = 32),
    provider      text        NOT NULL CHECK (provider IN ('edevlet','fake','declared18')),
    result_band   text        CHECK (result_band IN ('15-17','18+')),                        -- '<15' HİÇBİR ZAMAN yazılmaz
    jti_hash      bytea       UNIQUE CHECK (octet_length(jti_hash) = 32),                    -- belirteç tekrar oynatma savunması
    player_id     uuid        REFERENCES player.players(id),
    created_at    timestamptz NOT NULL DEFAULT now(),
    completed_at  timestamptz,
    CHECK ((result_band IS NULL) = (completed_at IS NULL))
);

CREATE TABLE identity.guardian_controls (      -- Ebeveyn Paneli ayarları; satır veli onayıyla oluşur
    player_id          uuid     PRIMARY KEY REFERENCES player.players(id) ON DELETE CASCADE,
    panel_token_hash   bytea    UNIQUE CHECK (octet_length(panel_token_hash) = 32),         -- onay sonrası SMS'lerdeki kalıcı panel bağlantısı
    daily_minutes      smallint CHECK (daily_minutes BETWEEN 15 AND 480),                    -- NULL = sınırsız
    chip_monthly_cap   integer  NOT NULL DEFAULT 0 CHECK (chip_monthly_cap >= 0),            -- 15-17 varsayılanı 0 (B9 §8.2)
    purchase_approval  boolean  NOT NULL DEFAULT true,
    free_text_chat     boolean  NOT NULL DEFAULT false,
    visits_enabled     boolean  NOT NULL DEFAULT true,
    extra              jsonb    NOT NULL DEFAULT '{}',                                      -- vitrin kapsamı, sessiz saat vb. ek ayarlar
    weekly_summary     boolean  NOT NULL DEFAULT false,
    version            integer  NOT NULL DEFAULT 1,
    updated_at         timestamptz NOT NULL DEFAULT now()
);
```

JWT `age_band` ∈ {`15-17`, `18+`} (+ `13-14` yalnızca `akademi` açıkken), `par` ∈ {`none`, `pending`, `granted`}; red, geri çekme ve süre aşımında `par = none` olur ve kısıtlar `age_band = 15-17 ∧ par ≠ granted` ile sürer. **Veli akışı (15–17):** (1) kayıtta veli telefonu girilir; sunucu 256 bit belirteç üretir (özet `guardian_consents`'te) ve SMS yollar: `KodKent: {takma ad} (15–17 yaş) hesabını açmak istiyor. Onay vermek ve ebeveyn ayarlarını görmek için: https://kodkent.com/v/{belirteç} (72 saat geçerli). Bu kişiyi tanımıyorsan işlem yapma.`; (2) bağlantı aydınlatma metnini (çocuk dostu + veli sürümü, B9 §8.3) gösterir, velinin telefonuna **ayrıca OTP** (`purpose = guardian`) gider ve 30 dk'lık `scp:["guardian"]` oturumu açılır; (3) karar zaman, aydınlatma sürümü ve IP özetiyle kaydedilir; onayda `guardian_state = granted`, `guardian_controls` satırı oluşur, oyuncuya `session.refresh_required` gider; (4) 24. ve 48. saatte hatırlatma, 72 saatte `expired`, 7 günde en çok 3 yeniden gönderim; (5) veli kalıcı panel bağlantısından (OTP ile) kontrolleri değiştirir, onayı geri çeker ya da silme ister (`/v1/guardian-panel/*`, §12.3).

Özellik matrisinin sahibi B9 §8.2'dir. Özet: `18+` tam hizmet; `15-17` ve `pending` (ya da `par = none`) iken hazır cümle + emote açık, serbest metin, DM, ziyaret kabulü, Vitrin ve Çip **kapalı**; `granted` iken veli kontrollerine göre açılır (serbest metin ≤ 120 karakter ve yalnızca izinle, DM yalnızca karşılıklı arkadaş ve "görüldü" yok, Vitrin arkadaş/kulüp, Çip: veli limiti + her satın almada onay). Oyun her durumda kilitsizdir (ders, görev, işletme, lig, Günlük Tekrar). Aşağıda kuralların **nerede zorlandığı** vardır:

| Kural | Zorlama noktası |
|---|---|
| Serbest metin / DM / ziyaret kapalı | `ChatHub.Send` politikası (`Par`, `AgeBand`; `chat.rejected{PAR_REQUIRED}`); `PUT /v1/friend-requests/{id}`; `Interact(kind:"door")` oda girişi `visits_enabled` |
| Profil yalnızca arkadaşlara | `GET /v1/players/{id}` ve `/portfolio`: hedef 15–17 ve istekçi arkadaş değilse **404**; arkadaş önerisi/rehber eşleştirme yok (yalnızca kod/QR/davet) |
| Çip limiti + onay | `POST /v1/payments/orders`: `chip_monthly_cap` kontrolü; sipariş `awaiting_guardian` (payment_orders durum `CHECK`'ine eklenir), `notification:p0` veliye bağlantı yollar, onayda PSP sayfası açılır |
| Kullanım süresi | Redis `usage:{oyuncu}:{iş günü}` etkin saniye sayacı; `limits.dailyMinutesLeft` (`GET /v1/players/me`); aşımda `session.limit_reached` ve oyun-içi yazma uç noktaları `423 TIME_LIMIT` (öğrenme okuması açık); Web Push 21:00–08:00 arası ertelenir (`notification` işçisi, 15–17'de zorunlu) |

**Suistimal.** Veli numarası oyuncununkiyle aynı olamaz; aynı numara 5'ten fazla çocuğa bağlanırsa işaret (kardeşler meşrudur); cihaz/IP benzerliği insan incelemesine düşer. Kalıntı risk: çocuğun yetişkin e-Devlet oturumuyla "18+" belirteci alması; belirteç kimlik taşımadığından KodKent'te yakalanamaz (Açık Soru 3). Hukuk veli kimliğinin de e-Devlet'le doğrulanmasını isterse yalnızca adım 3 değişir.

### 11.6 KVKK: aydınlatma, rıza ve haklar

**Aydınlatma ve rıza.** Kayıtta (1) *Aydınlatma Metni* (KVKK m.10; yetişkin ve ≤ 300 kelimelik çocuk dostu sürüm, B9 §8.3) kabul gerektirmeden gösterilir ve sürümü `consent_records` kaydına yazılır, (2) Kullanım Koşulları kabul edilir, (3) aşağıdaki **isteğe bağlı açık rızalar ayrı ayrı ve varsayılan KAPALI** sorulur; 15–17'de bu kutular `guardian_state = granted` olmadan etkinleşmez ve bu hesaplarda raporlar toplulaştırılır (B9 §9.7). Rıza geri çekmek bir kayıt satırıdır (`granted=false`) ve etkisi ≤ 24 saatte uygulanır.

| Rıza | Amaç | Hukuki sebep | Geri çekilince |
|---|---|---|---|
| `analytics` | Ürün gelişim analitiği (kişiselleştirilebilir olaylar) | Açık rıza (m.5/1) | Olay toplama durur; geçmiş olaylar 30 gün içinde takma kimlikten arındırılır |
| `marketing` | Ticari elektronik ileti (İYS) | Açık rıza | Gönderim durur |
| `aiCalibration` | Cevabın anonim hâlinin altın kümede kullanılması | Açık rıza | Henüz kümeye girmemiş kayıtlar girmez; girmiş anonim kayıtlar kişiye bağlanamadığından kalır |

Zorunlu işlemler (hesap, ders/işletme, güvenlik) açık rıza istemez; **sözleşmenin ifası** (m.5/2-c), **meşru menfaat** (m.5/2-f) ve **hukuki yükümlülük** (m.5/2-ç) kapsamındadır. Çocuk verisi için ek ilkeler: gerçek ad, e-posta, konum, ses, tam doğum tarihi **toplanmaz**; sohbet kısıtlıdır; AI'ya kişisel veri gitmez (§10.7). OTP, veli bağlantısı ve güvenlik bildirimleri *hizmet iletisidir* (onay gerekmez); pazarlama iletisi 18 yaş altına hiç gönderilmez (B9 §8.4).

**Haklar akışı.** *İndirme (`POST /v1/privacy/data-exports`):* OTP ile yeniden doğrulama → `privacy:p1` işi paketi üretir (profil, ilerleme, cevaplar ve Kurul kartları, kodlar, işletme ve cüzdan hareketleri, envanter, oda, kendi sohbet mesajları, rıza geçmişi, cihazlar); AES-GCM'li ZIP, 7 gün geçerli, tek kullanımlık imzalı bağlantı; hedef ≤ 24 sa (yasal 30 gün). *Silme (`POST /v1/privacy/erasure-requests`):* OTP → **7 gün bekleme** (girişle vazgeçilir) → `erasure-executor`:

| Veri | İşlem |
|---|---|
| Telefon (`phone_identities`) | Silinir; numara serbest bırakılır; kör indeks silinir |
| `players` satırı | **Silinmez, anonimleştirilir:** `handle = silinmis_{özet}`, `display_name = "Silinmiş Oyuncu"`, `age_*`, `cohort_code` boşaltılır, `status = erased`, `erased_at` yazılır |
| Cevaplar, Kurul kartları, kod, Vitrin, oda, envanter görünümü, avatar | Silinir (kod ve kaynak nesneleri referans sayacı sıfırlanınca) |
| Sohbet mesajları | Gövdesi silinir; şikâyet kanıt kopyaları vaka süresi dolunca |
| Defter satırları, XP olayları | **Silinmez** (muhasebe/ekonomi bütünlüğü); `player_id` anonimleştirilmiş satıra işaret eder, kimliği çözülemez; Bayt/Çip bakiyesi `ERASURE_WRITEOFF` ile yazılır |
| Çip satın alma ve fatura kayıtları | Vergi mevzuatı gereği 10 yıl saklanır (erişim kısıtlı) |
| Yedekler | En çok 30 gün içinde kendiliğinden düşer (§13.5); geri yükleme sonrası "silinenler listesi" yeniden uygulanır |

15–17 hesabında veli, aynı akışı Ebeveyn Paneli'nden (OTP ile) başlatabilir (`POST /v1/guardian-panel/erasure-requests`). **İtiraz:** Kurul puanı otomatik analizle çıkan bir sonuç sayılabileceğinden (KVKK m.11/1-g) itiraz hattı (soru başına 1, günde 3; insan örneklemesi, §10.6) aynı zamanda hukuki güvencedir (B9 §8.3).

### 11.7 Veri envanteri ve saklama süreleri

| Veri | Amaç | Hukuki sebep (m.5/2) | Saklama | Silme / anonimleştirme | Alıcı / işleyici |
|---|---|---|---|---|---|
| Telefon (`phone_enc`, `phone_hash`) | Kimlik doğrulama | (c) sözleşme | Hesap süresince; silme isteğinden sonra en çok 30 gün (yedek) | Silinir | SMS sağlayıcı (anlık) |
| Veli telefonu ve onay kaydı | Veli onayı | (f) çocuğun korunması | Onay süresince + 2 yıl (ispat; B9 §8.3). B6 §7.6 "hesap ömrü + 3 yıl" der → Açık Soru 6 | Özete indirgenir | SMS sağlayıcı |
| Yaş eşiği (`age_band`) + doğrulama tarihi | Yaş kapısı, ayrıştırılmış hizmet | (ç) hukuki yükümlülük | Hesap süresince; doğum tarihi/yılı **saklanmaz** (B9 §8.2) | Silinir | e-Devlet belirteç sağlayıcısı (kimlik taşımaz) |
| Takma ad, avatar, profil | Oyun | (c) | Hesap | Anonimleştirilir | — |
| OTP kayıtları | Güvenlik | (f) | 90 gün | Silinir | SMS DLR |
| SMS günlüğü | Fatura, dolandırıcılık analizi | (f) | 180 gün | Silinir | — |
| Erişim günlükleri (ham IP) | 5651 yükümlülüğü | (ç) | 12 ay **(hukuk doğrular)**, WORM | Süre sonunda silinir | Günlük deposu |
| Cevaplar, Kurul kartı (ham metin) | Eğitim hizmeti, adalet | (c) | 12 ay (ham); puan/XP kalıcı | Ham metin silinir | Anthropic (kişisel veri ayıklanmış metin) |
| Oyuncu kodu (gönderimler) | Hizmet, Vitrin, portföy | (c) | Gönderim 12 ay (B9 §8.3; aylık bölüm 13 aylık dilimde düşer, §4.1); çalışan kod hesap süresince | Silinir | — |
| Oyun ve ekonomi verisi | Hizmet | (c) | Hesap; defter kimliksiz 24 ay | Kimliksizleştirilir | PSP (yalnızca Çip) |
| Sohbet | Hizmet, güvenlik | (c)/(f) | 90 gün; şikâyet kanıtı 1 yıl | Silinir | Anthropic (Haiku moderasyon, metin) |
| Moderasyon kararı/ceza kaydı; raporlanan mesaj + bağlam | Güvenlik | (f) | Karar 2 yıl; rapor kanıtı olay kapanışı + 1 yıl; Haiku kaydı (metinsiz) 90 gün (B6 §7.6) | Silinir | — |
| Analitik olaylar | Ürün iyileştirme | Açık rıza / toplulaştırılmış (f) | 13 ay; KPI özeti sınırsız | Rıza geri çekilince 30 gün | — |
| Ödeme kayıtları (kart verisi yok) | Satış, vergi | (c)/(ç) | 10 yıl | — | iyzico |
| Yedekler | Felaket kurtarma | (f) | En çok 30 gün (§13.5) | Kendiliğinden düşer | Nesne deposu |

### 11.8 Veri yerelliği ve yurt dışı aktarım

VİZYON varsayım 10 "veri KVKK gereği Türkiye'de" der; bu belge riski açıkça yazar. **Birincil veri tabanı Hetzner Falkenstein'dadır** (ADR-15) ve bu bir yurt dışı aktarımdır (KVKK m.9, 2024 rejimi: yeterlilik kararı yoksa standart sözleşme ve imzadan sonra 5 iş günü içinde Kurum'a bildirim; B9 §8.3). Azaltıcılar: telefon ve veli telefonu alan düzeyinde şifreli (anahtarlar Vault'ta, yedekte yok); ham IP saklanmaz; AI'ya kişisel veri gitmez; çocuk verisi minimize; **TR-yerel geçiş runbook'u hazır** (§13.5). Hukuk "Türkiye'de tutulmalı" derse ADR-15 Faz 2'ye geçilir (Açık Soru 1). B9 §8.3 15–17 yaş verisinin yurt içinde tutulmasını tercih eder ve altyapı bütçesini B7 Hetzner tahmininin ≈ 2 katı marjla planlar (§13.6); 5651 kapsamındaki yerelleştirme yükümlülüğü G0'da teyit edilir.

| İşleyici | Veri | Konum | Dayanak |
|---|---|---|---|
| Hetzner | Tüm birincil veri (şifreli alanlar dâhil) | Almanya | Standart sözleşme + bildirim; şifreleme |
| Anthropic (Claude API) | Kişisel veriden arındırılmış cevap/kod/sohbet metni | ABD | Ticari şartlar (eğitimde kullanılmama, saklama süresi: sözleşmeyle doğrulanacak), SCC; içerikte kişisel veri yok |
| Cloudflare | IP, UA, istek meta verisi | AB/ABD | Standart sözleşme; günlük saklama kısa |
| Netgsm / İleti Merkezi | Telefon, SMS metni | Türkiye | Veri işleme sözleşmesi |
| iyzico (PSP) | Sipariş, ödeme referansı (kart verisi bizde yok) | Türkiye | Veri işleme sözleşmesi |
| e-Devlet yaş belirteci sağlayıcısı | Yalnızca 15/18 eşik sonucu (kimlik yok) | Türkiye | Kamu hizmeti; protokol G0'da |

Olay süreleri: KVKK ihlal bildirimi 72 saat (olay müdahale planı H10 öncesi hazır), BTK bilgi talebi 15 gün (B9 §8.1), çocuk güvenliği P0'da ilk yanıt 1 saat / çözüm 24 saat (B6 §12.3); delil korunur, hesap dondurulur (B9 §8.5).

### 11.9 OWASP kontrol listesi

Eşleme: OWASP Top 10 (2021) ve OWASP API Security Top 10 (2023). Kanıtlar CI kapılarıdır (§13.3).

| Risk | KodKent kontrolü |
|---|---|
| A01 Erişim kontrolü / API1 BOLA | Her `{id}` uç noktasında nesne düzeyi yetki; "bilmek erişim değildir"; 404 ile varlık sızdırmama |
| API3 Özellik düzeyi yetki | Yanıt DTO'ları açık beyaz liste (gizli test, referans çözüm, başka oyuncunun cüzdanı yok); PATCH yalnızca izinli alanlar |
| A02 Kriptografik hatalar | TLS 1.3, HSTS; AES-256-GCM alan şifreleme; HMAC kör indeks; ES256 JWT; sabit zamanlı karşılaştırma |
| A03 Enjeksiyon | Parametreli sorgu (Npgsql/EF); dinamik SQL yasak (analizör); AI'ya veri bloğu + şema (§10.7); sandbox (§8) |
| A04 Güvensiz tasarım | Tehdit modeli (§8.1), defter değişmezleri, idempotency, oran sınırları, kötüye kullanım senaryoları |
| A05 Yanlış yapılandırma | Güvenlik başlıkları (CSP `default-src 'self'`, `frame-ancestors 'none'`, `Referrer-Policy`, `X-Content-Type-Options`); CORS beyaz liste; iç uç noktalar iç ağda |
| A06 Eski bileşen | NuGet kilit dosyası, `dotnet list package --vulnerable`, Dependabot/Renovate, taban imaj özetle sabit, SBOM |
| A07 Kimlik doğrulama hataları / API2 | OTP sınırları (§11.1), sabit zamanlı karşılaştırma, yenileme döndürme + yeniden kullanım algılama, cihaz limiti |
| A08 Bütünlük hataları | İmzalı imajlar (cosign), CI kaynak kanıtı (SLSA 2), içerik imzası (CMS yayın özeti), PE içerik adresli |
| A09 Günlük/izleme | Yapılandırılmış günlük, `traceId`, denetim izi (`audit_log`), güvenlik alarmları (§13.4) |
| A10 / API7 SSRF | Kullanıcı kaynaklı URL yok; dış çağrılar (Anthropic, SMS, PSP) sabit ana bilgisayar listesi; bulut meta veri uç noktası engelli |
| API4 Kaynak tüketimi | Hız sınırları (§5.1), istek gövdesi ≤ 64 KB, sayfa boyutu ≤ 100, kuyruk geri basıncı |
| API5 İşlev düzeyi yetki | Yönetici uç noktaları ayrı rol + ayrı ingress + IP kısıtı + dört göz |
| API6 Hassas iş akışları | Satın alma, hasat, kayıt, OTP: oran + idempotency + davranış izleme (§11.3) |
| API10 Üçüncü taraf API'ler | SMS/PSP/Anthropic yanıtları şema doğrulamalı; webhook imzası + IP izin listesi |

---

## 12. İstemci–sunucu sözleşmesi (B8 arayüzü)

B8 her ekran için "Veri" satırını yazdı; bu bölüm onları uç noktaya bağlar, B8'in talep ettiği eksik uç noktaları karara bağlar ve iyimser arayüz ile çevrimdışı davranışın sunucu kurallarını koyar.

### 12.1 Sözleşme ilkeleri

TypeScript tipleri `GET /v1/openapi.json`'dan üretilir; Kurul kartı (B3) ve Challenge Spec (B5) kendi alan adlarıyla taşınır, istemci kartı Zod ile doğrular; bilinmeyen alan / enum yok sayılır (§5.1). Hatalar RFC 9457'dir ve istemci `code` alanına göre davranır. Asenkron iş 202 döner, sonuç `job.completed` ile gelir; hub kopuksa `GET …/{id}` yoklaması 2 → 5 → 10 sn. Niyet başına tek `Idempotency-Key`; sürüm uyuşmazlığı `426 CLIENT_OUTDATED`.

### 12.2 Ekran → veri → uç nokta eşlemesi

Yollar `/v1` altındadır; `*` işaretliler §12.3'te eklenen uç noktalardır. Hub sütunu sunucu → istemci olaylarıdır (§6.3).

| Ekran (token) | Açılışta okunan | Eylemler (yazma) | Hub olayı |
|---|---|---|---|
| `giris` | `privacy/notices`, `meta/client-config` | `auth/otp/requests`, `auth/otp/verifications`, `auth/age-verifications`\*, `auth/tokens/refresh` | — |
| `dil-sec` | — | PUT `players/me/language-track`; POST/DELETE\* `language-waitlist` | — |
| `avatar` | `handles/availability`, `players/me/avatar`, `inventory` | `auth/registrations`; PUT `players/me/avatar` | — |
| `meydan` | `players/me`, `world/led-feed`, `world/meydan-question` | `world/scenes/meydan/join-tickets`, `world/meydan-question/answers`, `world/led-feed/entries`\*; `/hubs/world`: `MoveTo`, `Emote`, `Interact`, `Resync` | `scene.*`, `move.ack`, `interaction.result` |
| `harita` | `world/map`, `districts`, `businesses`, `friends/presence` | — | `presence.friend` |
| `akademi` | `districts`, `lessons?district=` | `world/scenes/akademi-lobi/join-tickets` | `scene.*` |
| `derslik` | `lessons/{id}` (ETag) | `lessons/{id}/attempts`; PATCH `lesson-attempts/{id}`; `…/answers`, `…/runs`\* | `job.completed{run}` |
| `kurul` | `lessons/{id}`, `grading/submissions/{id}`, `hints` | `grading/submissions` (202), `…/followups`, `…/appeals`, `lesson-attempts/{id}/remediation-rounds` | `job.completed{grading}`, `user.xp` |
| `atolye` | `quests/{id}`, `challenges/{id}`, `challenge-submissions/{id}`, `hints`, `errors/translations/{cs}`, `bug-reports` | `challenges/{id}/submissions` (202), `bug-reports/{id}/fixes` | `job.completed{submission}`, `quest.updated` |
| `sokak` | `streets/{id}`, `businesses/{id}`, `businesses/catalog` | POST `businesses` (tapu), `…/vault/collections`, `applause`, `…/owner-notifications`\*, `world/scenes/sokak-{id}/join-tickets` | `vault.full`, `scene.*` |
| `is-emri` | `challenges/{id}`, `businesses/{id}/contract-card` | `businesses/{id}/clarifications` | `user.xp` |
| `editor` | `challenges/{id}`, `contract-card`, `hints`, `errors/translations/{cs}` | `challenges/{id}/submissions`; `businesses/{id}/defenses` | `job.completed{submission}` |
| `savunma` | `defenses/{id}` | `businesses/{id}/defenses`, `defenses/{id}/answers` (202) | `job.completed{defense}`, `user.xp`, `user.wallet` |
| `panel` | `businesses`, `businesses/{id}`, `…/runs`, `…/runs/{date}`, `bug-reports` | `…/vault/collections`, `vault-collections`, `…/upgrades`; PATCH `businesses/{id}` | `vault.full`, `user.wallet` |
| `metro` | `players/me/metro`, `lessons/{id}` | — | `user.xp` |
| `tekrar` | `reviews/daily`, `players/me/streak` | `reviews/daily/answers`, `players/me/streak/freezes` | `user.xp`, `user.wallet` |
| `oda` | `rooms/me`, `rooms/{id}`, `visitor-books/{t}/{id}`, `inventory` | PUT `rooms/me/layout` (If-Match), PATCH `rooms/me`, `applause`, `world/scenes/oda-{id}/join-tickets` | `scene.*` |
| `dolap` | `inventory`, `players/me/avatar` | PUT `inventory/equipment`, `players/me/avatar` | — |
| `pazar` | `market/shelves`, `market/items/{sku}`, `wallets/me`, `payments/orders/{id}` | `market/purchases`, `payments/orders` | `user.wallet` |
| `vitrin` | `businesses/{id}/vitrin` | `applause`, `businesses/{id}/vitrin/reads`\* | `user.xp` |
| `profil` | `players/{id}`, `…/portfolio`, `players/me/progress`, `businesses/{id}/code-export`\* | — | — |
| `liderlik` | `leagues/current`, `leaderboards/{board}`, `friends`, `world/meydan-question` | — | — |
| `sohbet` | `friends`, `friends/presence`, `chat/dm/{id}/messages`, `invites/me` | `chat/connection-tickets`, `chat/reports`, `blocks`, `friend-requests`, `invites/redeem`; `/hubs/chat`: `Send`, `JoinChannel`, `MarkRead` | `chat.*` |
| `ayarlar` | `players/me`, `notification-preferences`, `privacy/notices`, `auth/sessions` | PATCH `players/me`; `push-subscriptions`; `privacy/{consents,data-exports,erasure-requests}`; `players/me/{guardian-consents,handle-changes}`; `auth/phone-changes` | `session.refresh_required` |
| `hud` | `players/me`, `quests`, `notifications`, `businesses/catalog`, `players/me/licences` | POST `notifications/reads` | `user.xp/wallet`, `quest.updated`, `notify.new`, `vault.full`, `presence.friend`, `session.limit_reached` |

### 12.3 B8 talepleri ve Yaş Kapısı v2 ile eklenen / değişen uç noktalar

B8 altı eksik uç nokta talep etti; hepsi kabul edilir. Yaş Kapısı v2 (§11.5) yedi tane daha ekler. Katalog **138 → 151** uç noktadır.

| Yöntem | Yol | Amaç | Yetki | Limit |
|---|---|---|---|---|
| POST | `/v1/lesson-attempts/{attemptId}/runs` | Derslikte "Çalıştır/Dene" (202, `code-run:p0`, ≤ 30 satır) | oyuncu | RL-RUN |
| POST | `/v1/world/led-feed/entries` | "Panoda Göster" (günde 3; `moderation:p0`) | oyuncu | RL-SOCIAL |
| POST | `/v1/businesses/{businessId}/owner-notifications` | "Sahibine haber ver" (günde 3, sahibin gelen kutusuna) | oyuncu | RL-SOCIAL |
| POST | `/v1/businesses/{businessId}/vitrin/reads` | "Kodu Okudum" (+10 XP, işletme başına 1; anahtar `vitrin-read:{oyuncu}:{işletme}`) | oyuncu | RL-WRITE |
| GET | `/v1/businesses/{businessId}/code-export` | Kodu `.cs` olarak dışa aktar (yalnızca sahibi) | oyuncu | 10/gün |
| DELETE | `/v1/language-waitlist/{entryId}` | Bekleme listesinden çık | oyuncu | RL-WRITE |
| POST | `/v1/auth/age-verifications`, `…/{id}/completions` | Yaş doğrulama (§11.5) | belirteç | RL-AUTH |
| GET / PUT | `/v1/guardian-panel`, `/v1/guardian-panel/controls` | Ebeveyn Paneli özeti; kontroller (`If-Match`) | veli oturumu | RL-AUTH |
| GET / POST | `/v1/guardian-panel/purchase-approvals`, `…/{orderId}/decisions` | Bekleyen Çip siparişleri; onayla / reddet | veli oturumu | RL-AUTH |
| POST | `/v1/guardian-panel/erasure-requests` | Veli kanalından silme talebi (OTP) | veli oturumu | 3/gün |

*Değişenler.* `POST /v1/auth/registrations`: `birthYear` kalkar, `verificationId` zorunlu olur. `age_band` değerleri `15-17`, `18+` (katalogdaki `15-17` işaretleri `15-17` okunur). `GET /v1/players/me` yanıtına `ageBand`, `par`, `limits{dailyMinutesLeft}` eklenir; 15–17'de `POST /v1/payments/orders` `202 awaiting_guardian` döner. B8 Giriş "doğum yılı" adımı "yaş doğrulama" olur (KANON §6 Giriş v2 adayı, Ek A).

### 12.4 İyimser arayüzün sınırı

Kural: bir eylem **yalnızca** (a) para, XP, envanter, puan ya da durum geçişi üretmiyorsa, (b) başarısızlığı ≤ 1 sn'de görünür ve geri alınabilirse, (c) sunucu yanıtı arayüzü tek yönde (onay ya da geri alma) düzeltiyorsa iyimser olabilir.

| Eylem | İyimser mi | Sunucu otoritesi ve geri alma |
|---|---|---|
| Yürüme, emote | Evet | `move.ack{accepted:false}` → snap-back; yolu sunucu aynı `walkable` kümesiyle yeniden hesaplar |
| Balon sohbet | Evet (soluk) | `chat.ack` kesinleştirir; `chat.rejected` / `chat.removed` geri alır |
| Kart ilerlemesi, ayarlar, Dolap giyme, Oda yerleşimi | Evet | Hata ya da `412 VERSION_CONFLICT` → eski duruma dön + bilgi; Oda'da `If-Match` |
| Günlük Tekrar | Kısmen | Soru geçişi iyimser; ödül ve seri yalnızca sunucudan |
| Kurul puanı, test sonucu, Müfettiş, Savunma | **Asla** | Yalnızca `job.completed` / GET; "Kurul okuyor" durumu |
| Bayt/Çip/XP, satın alma, tapu, yükseltme, kasa toplama | **Asla** | Bakiye yalnızca yanıt ya da `user.wallet`/`user.xp` ile değişir; kasa sayacı animasyonu görseldir, tutar sunucudan |

### 12.5 Çevrimdışı ve yeniden bağlanma (B8 §15 karşılığı)

| B8 davranışı | Sunucu karşılığı |
|---|---|
| Hub koptu → "Yeniden bağlanıyor (n/6)", aralıklar 0, 1, 3, 7, 15, 30 sn | Her denemede yeni `join-tickets` (15 sn, tek kullanım) + `scene.snapshot`; avatar 30 sn hayalet (`ghostUntil`, §6.5); pod ölümünde shard ≤ 2 sn'de kurulur |
| Cevap taslakları (Kurul, Savunma, Atölye) IndexedDB'de | Bağlanınca kullanıcı onayıyla **yeni** `Idempotency-Key` ile gönderilir; kota ve `attempt_no` sunucuda belirlenir |
| Günlük Tekrar çevrimdışı çözüldü | `POST /v1/reviews/daily/answers` toplu (`answers[{questionId, correct, at}]`); 04:00 iş günü kuralı sunucuda (B6 §3.3); ödül günde bir, "tekrar 0" |
| Oturum bitti | Yenileme reddi → `401 SESSION_REVOKED`; yenileme belirteci 30 gün kayan olduğundan ≤ 30 gün çevrimdışı oturum açık kalır |
| Satın alma, tapu, kasa, Alkış | Çevrimdışı kuyruğa alınmaz (sunucu otoritesi); istemci düğmeyi devre dışı bırakır |

---

## 13. Altyapı ve DevOps

### 13.1 Ortamlar

| Ortam | Amaç | Altyapı | Veri | Dağıtım |
|---|---|---|---|---|
| `dev` | Geliştirici makinesi | Docker Compose: PostgreSQL 18, Redis, MinIO; sahte SMS / e-Devlet / Anthropic servisleri; sandbox `runc` + sıkı seccomp (gVisor yok, yalnızca geliştirme) | tohum | `dotnet watch` |
| `ci` | PR doğrulaması | GitHub Actions + Testcontainers, geçici k3d | sentetik | her PR |
| `staging` | Üretimin küçük kopyası (H1'de ayakta, B9 S1) | Hetzner, k3s 3 düğüm; CNPG 1+1; Redis tek; 1 gVisor VM; gerçek SMS (izin listeli numaralar) | sentetik + 10.000 bot | main'e birleşince |
| `prod` | Canlı | §13.2 | gerçek | canary + onay |

### 13.2 Kubernetes topolojisi

k3s, Hetzner Falkenstein (`fsn1`) ve Nürnberg (`nbg1`) arasına yayılmış (aynı ağ bölgesi, ≈ 2–3 ms); yönetim OpenTofu (`hcloud`) + Argo CD (GitOps). Ad alanları: `kodkent-app`, `kodkent-data`, `kodkent-sandbox`, `observability`, `ingress`. **Varsayılan NetworkPolicy reddet**: `kodkent-sandbox` yalnızca kuyruk Redis'ine çıkar (6379), hiç giriş almaz; `kodkent-app` → `kodkent-data`; `observability` ölçüm toplar.

| Havuz | Düğüm | Taint | Çalışan | Ölçekleme |
|---|---|---|---|---|
| `app` | CCX23 / CCX33 | — | `api`, `hub`, `worker-ai` (ai-grade, moderation), `worker-core` (income-tick, code-run-results, privacy, outbox), `worker-notify`, `cron` (PG advisory lock lideri), ingress-nginx | `api` HPA CPU %60; `hub` HPA özel metrik `hub_connections` (eşik 1.750, §6.7); `worker-*` KEDA `redis-streams` (`q:ai-grade:p0` bekleyen > 20; `q:income-tick`, `q:notification`) |
| `data` | CCX23 / CCX33 / AX102 | `data=true:NoSchedule` | CloudNativePG (1+2), PgBouncer, Redis kuyruk, Redis backplane (+Sentinel 100k) | Dikey; 100k'da okuma kopyaları |
| `sandbox` | CCX23 / AX102 | `sandbox=true:NoSchedule` | `sandbox-agent` (düğüm başına 1) + `RuntimeClass gvisor` (`runsc`, §8.3) | KEDA `code-run:p0` gecikmesi; VM ölçekleme `sandbox-scaler` (§8.9) |
| `obs` | CCX33 | `obs=true` | Prometheus, Loki, Tempo, Grafana, Alertmanager | Dikey |

### 13.3 CI/CD

| Aşama | Tetik | Kapı (kırmızı = birleşmez / ilerlemez) |
|---|---|---|
| 1 Derleme + birim | PR | `dotnet build -warnaserror`; analizörler `KK001–KK006` (§14.3); birim testleri; NetArchTest katman ve yasak kenar (§3.3) |
| 2 Veri | PR | Testcontainers (PostgreSQL 18 + Redis) entegrasyon; göç: boş DB'ye ve önceki sürümden yükseltme; `squawk` göç lint'i; `oasdiff` kırıcı API değişikliği |
| 3 Güvenlik | PR | CodeQL, gitleaks, `dotnet list package --vulnerable`, Trivy, SBOM (Syft) |
| 4 İmaj | main | Çok aşamalı imaj; `cosign` imza + SLSA kanıtı; `kodkent-app`, `kodkent-sandbox-agent`, `kodkent-sandbox` ayrı hatlar |
| 5 Staging | main | Argo CD senkron; göç `Job` (`kk_migrator`); duman + Playwright e2e + Schemathesis + k6 duman |
| 6 Sandbox kapısı | sandbox imajı / politika değişince | Kaçış listesi (§8.8: 22 senaryo; B9 H2 asgarisi ≥ 9) başarı 0; Otopark L1 26 test; 500 eşzamanlı çalıştırmada p95 < 6 sn |
| 7 Prod canary | etiket + onay (haftada ≤ 2) | Argo Rollouts %10 → %50 → %100; her adımda SLO analizi (5xx, p95, `ledger_diff = 0`); otomatik geri alma |

### 13.4 Gözlemlenebilirlik: SLO ve alarmlar

OpenTelemetry (iz + metrik + günlük) → Tempo / Prometheus / Loki; Sentry hata için; günlükte kişisel veri yok (`[PersonalData]` öznitelikli alanlar maskelenir). Her istekte `traceId`; `X-Request-Id` yanıtta.

| SLO (30 gün) | SLI | Hedef | Kaynak |
|---|---|---|---|
| API erişilebilirlik | `/v1` 5xx dışı oran | %99,9 (≈ 43 dk/ay) | §1.2 |
| API gecikme | okuma p95 | < 300 ms | §1.2 |
| Sandbox | `code-run` uçtan uca p95 | < 6 sn | KANON §9 |
| Kurul | ilk geçiş p95 / toplam p95 | < 4 sn / < 8 sn (B7 önerisi) | §10.10 |
| Gece partisi | 04:00 TR'de tamam | %100 gün; 10k bot < 30 dk (B9 S3) | §9 |
| Defter | günlük mutabakat farkı | 0 (tolerans yok) | §9.6 |
| SMS OTP | DLR oranı (15 dk) | ≥ %93 | §11.2 |

| Alarm | Eşik | Seviye |
|---|---|---|
| API 5xx / p95 | > %1 (5 dk) / > 500 ms (10 dk) | page |
| `code-run:p0` gecikmesi | > 3 sn (5 dk) → ölçekle; > 8 sn `503 SANDBOX_BUSY` | page |
| Sandbox kaçış göstergesi (beklenmeyen syscall / ağ girişimi) | > 0 | page + havuz dondur |
| Kurul hata oranı / Anthropic hata | > %5 / > %20 (1 dk, devre kesici) | page / ticket |
| AI $/DAU/gün (7 gün) | ≥ 0,065 sarı; ≥ 0,08 kırmızı; önbellek isabeti < %70 (B3 §11.9, KANON) | ticket / page |
| Defter mutabakat farkı ≠ 0 ya da gece partisi 04:00'te bitmedi | herhangi | page (kritik) |
| DLQ derinliği / `ai-grade:p0` bekleyen | > 0 / > 200 | ticket / ölçekle |
| PostgreSQL | replika gecikmesi > 30 sn; disk / bağlantı > %80; gelecek ay bölümü yok | page |
| SMS | DLR < %93; doğrulama oranı < %30 (≥ 50 gönderim); günlük SMS > 3 × medyan | devre kesici / page |
| Yedek | son tam yedek > 8 gün; WAL arşiv gecikmesi > 5 dk | page |

### 13.5 Yedekleme, felaket kurtarma (RPO / RTO)

| Veri / olay | RPO | RTO | Yöntem |
|---|---|---|---|
| PostgreSQL, düğüm kaybı | 0 (eşzamanlı kopya) | ≤ 30 sn | CNPG quorum sync kopya + otomatik failover |
| PostgreSQL, kümenin / DC'nin kaybı | ≤ 5 dk | ≤ 4 sa | pgBackRest tam + fark + sürekli WAL → nesne deposu (ikinci lokasyon); yeni kümeye PITR |
| Redis (kuyruk) | ≤ 1 sn (AOF `everysec`); iş kaybı outbox'tan yeniden üretilir | ≤ 2 dk | Sentinel + kurtarma taraması (§7.1) |
| Sandbox, uygulama | — | ≤ 15 dk | OpenTofu + Argo CD (durumsuz) |

Haftalık tam (Pazar 03:30 TR) + günlük fark + WAL; saklama 4 tam + 7 gün WAL, en eski kopya ≤ 30 gün (silme sözüyle uyumlu, §11.6); yedekler şifreli (`aes-256-cbc`, anahtar OpenBao'da). **Aylık otomatik geri yükleme tatbikatı:** geçici kümede PITR, `ledger_daily_digests` doğrulaması, "silinenler listesi"nin yeniden uygulanması; çeyreklik tam DR tatbikatı (ilki S5'te). **TR geçiş runbook'u (ADR-15):** hedefte OpenTofu ile küme → tam yedek + WAL aktarımı → DNS TTL 60 sn → ≈ 4 sa bakım penceresi (`maintenance:true`) → son WAL + defter özeti doğrulaması → DNS çevirme → eski küme 7 gün salt okunur, sonra imha ve tutanak.

### 13.6 Maliyet: 1k / 10k / 100k DAU, Hetzner ve Azure

Fiyatlar liste varsayımıdır **(B7 önerisi; H1'de fiyat hesaplayıcısıyla doğrulanır)**: CCX23 (4 vCPU / 16 GB) ≈ € 40, CCX33 ≈ € 80, AX102 ≈ € 110, 1 € ≈ 1,075 $, 45 TL/$ (B3, B9 ile aynı). Sandbox satırı §8.9'dan, SMS §11.2'den, AI B3 §11.6 S4'ten alınmıştır.

| Aylık kalem | 1k DAU | 10k DAU | 100k DAU |
|---|---|---|---|
| `app` düğümleri (api, hub, worker, cron) | 3 × CCX23 = € 120 | 4 × CCX23 = € 160 | 9 × CCX33 = € 720 |
| PostgreSQL (1+2; 100k'da + 2 okuma kopyası) | 3 × CCX23 = € 120 | 3 × CCX33 = € 240 | 5 × AX102 = € 550 |
| Redis (kuyruk + backplane; 100k'da Sentinel) | 4 × CX33 = € 36 | 4 × CCX13 = € 80 | 6 × CCX23 = € 240 |
| Sandbox VM'leri (§8.9) | € 80 | € 240 | € 550 |
| Gözlem yığını | 1 × CCX33 = € 80 | 2 × CCX33 = € 160 | 4 × CCX33 = € 320 |
| Staging + CI koşucuları; LB, ağ, depolama, yedek | € 150 + € 30 | € 200 + € 70 | € 300 + € 200 |
| **Hetzner toplamı** | **€ 616 ≈ 662 $** | **€ 1.150 ≈ 1.236 $** | **€ 2.880 ≈ 3.096 $** |
| SaaS ve güvenlik araçları (Cloudflare, Sentry, nöbet) | 75 $ | 330 $ | 850 $ |
| **Altyapı + güvenlik** | **737 $ ≈ 33.200 TL** | **1.566 $ ≈ 70.500 TL** | **3.946 $ ≈ 177.600 TL** |
| SMS (§11.2) | 24 $ ≈ 1.100 TL | 244 $ ≈ 11.000 TL | 2.444 $ ≈ 110.000 TL |
| AI (B3 §11.6, S4) | 1.708 $ ≈ 76.900 TL | 14.613 $ ≈ 657.600 TL | 141.303 $ ≈ 6.358.600 TL |
| **Toplam** | **2.469 $ ≈ 111.200 TL** | **16.423 $ ≈ 739.100 TL** | **147.693 $ ≈ 6.646.200 TL** |
| Altyapı payı / AI payı | %29,9 / %69,2 | %9,5 / %89,0 | %2,7 / %95,7 |
| Toplam / DAU / ay | 2,47 $ ≈ 111 TL | 1,64 $ ≈ 74 TL | 1,48 $ ≈ 67 TL |

KANON bazlı AI (§10.9: 1.590 / 15.900 / 159.000 $) 100k'da AI payını %96,1 yapar; §10.9'daki "toplamın ≈ %96'sı AI" bu satırdan gelir. **Nitelik hedefi "altyapı toplamın %20'sinden az" (§1.2) ≈ 2.500 DAU'dan sonra sağlanır;** 1k'da sabit taban (HA veri katmanı, staging, gözlem) payı %30'a çıkarır (Varsayım 9).

**Azure karşılaştırması (10k DAU, liste):** uygulama (4 × D4as_v5) ≈ 560 $, PostgreSQL (Flexible Server GP D8ds_v5 HA + 1 okuma kopyası) ≈ 1.600 $, Redis (Premium P1 × 2) ≈ 830 $, sandbox (gVisor yok → Kata "Pod Sandboxing", 8 × D4s_v5) ≈ 1.280 $, gözlem (Managed Prometheus / Grafana + Log Analytics) ≈ 1.000 $, staging / CI / LB / ağ / depolama ≈ 1.350 $; toplam **≈ 6.620 $ = Hetzner'in (1.236 $) 5,4 katı**.

Azure, 1k'da ≈ 4,5 ×, 100k'da ≈ 6 × pahalıdır (ADR-15: "5–6 ×"); üstüne gVisor yoktur. **B9 ile uyum (B9 §6.1–§6.5):**

| Nokta | B7 tahmini (altyapı + güvenlik + SMS) | B9 değeri | Oran |
|---|---|---|---|
| ≈ 1k DAU (A3–A6) | 34,3 bin TL | 57–66 bin TL/ay (§6.2: altyapı 56–64 + SMS 1–2) | 1,7–1,9 × |
| ≈ 2,7k DAU (A12 baz DAU 2.655) | ≈ 42 bin TL (aynı küme + 1 düğüm + araçlar) | 100 bin TL (94 + 6) | ≈ 2,4 × |
| Birim, A12 | ≈ 15,8 TL/DAU/ay | 18 TL/DAU/ay (§6.4 altyapı + SMS) | 0,9 × |
| 10k DAU | 0,157 $/DAU/ay | 0,15 $ (§6.5 ölçek varsayımı) | 1,0 × |

B9'un "altyapı kalemi B7 Hetzner tahmininin yaklaşık iki katı marjla planlanır" cümlesi böylece doğrulanır (1,7–2,4 ×): fark TR-içi sağlayıcıya geçiş ya da Azure-sınıfı fiyatın tamponudur.

---

## 14. Monorepo, standartlar, test ve sprintler

### 14.1 Monorepo ağacı

```txt
kodkent/
├─ KodKent.sln  global.json  Directory.Build.props  Directory.Build.targets  Directory.Packages.props  .editorconfig  CODEOWNERS
├─ src/
│  ├─ Platform/     KodKent.Platform  KodKent.Platform.Abstractions   (outbox/inbox, idempotency, IClock, IIdGenerator, Platform.Text)
│  ├─ Modules/      <Modül>/{KodKent.<Modül>, KodKent.<Modül>.Contracts, Migrations/}
│  │                14 modül: Identity Player Progress Learning Challenge Economy World Social Market Quest Notify Content Analytics Moderation
│  ├─ Hosts/        KodKent.Api  KodKent.Hub  KodKent.Worker  KodKent.App   (tek imaj; KODKENT_ROLE=api|hub|worker)
│  └─ Sandbox/      KodKent.SandboxAgent  KodKent.Sandbox.Harness (hakem)  KodKent.Sandbox.PeLib  KodKent.Sandbox.Policy
├─ web/             pnpm workspace (B8): apps/{game,guardian-panel,admin}  packages/{api-client,engine,ui}
├─ content/         prompts/{ad}/v{n}/  lessons/  challenges/  quests/  hints/  errors/  items/
├─ deploy/          tofu/ (hcloud)  charts/ (Helm)  argocd/  overlays/{staging,prod}
├─ tools/           KodKent.Tools.{Migrator,BotSim,EscapeSuite,AdminCli}  k6/
├─ tests/           KodKent.Architecture.Tests  KodKent.<Modül>.Tests  KodKent.Integration.Tests  KodKent.Contract.Tests  KodKent.Sandbox.Tests  e2e/
└─ docs/            adr/  runbooks/  openapi/ (üretilir, CI'da diff)
```

### 14.2 Çözüm ve proje listesi

| Çözüm klasörü | Projeler | Adet | Kural |
|---|---|---|---|
| Platform | `KodKent.Platform`, `.Abstractions` | 2 | Hiçbir modülü referans etmez |
| Modules | `KodKent.<Modül>` + `.Contracts` (14 modül) | 28 | İç projeyi yalnızca barındırıcılar referans eder; `Contracts` yalnızca alt katmandan (§3.3) |
| Hosts | `Api`, `Hub`, `Worker`, `App` | 4 | `App` rolü ortam değişkeninden seçer |
| Sandbox | `SandboxAgent`, `Harness`, `PeLib`, `Policy` | 4 | Platform ve modülleri referans etmez (sır yok); Roslyn sürümü sabitlenir (§8.6) |
| Tools | `Migrator`, `BotSim`, `EscapeSuite`, `AdminCli` | 4 | — |
| Tests | `Architecture`, 14 modül, `Integration`, `Contract`, `Sandbox` | 18 | — |

Toplam 60 C# projesi; `web/` ayrı pnpm çalışma alanıdır ve tipleri `openapi/`'den üretir.

### 14.3 Kodlama standartları

| Konu | Kural |
|---|---|
| Dil | C# 14 / .NET 10; `Nullable` açık; `TreatWarningsAsErrors`; `.editorconfig` CI'da zorunlu |
| Analizörler | `KK001` başka modülün şemasına SQL · `KK002` dinamik SQL (dize birleştirme) · `KK003` `DateTime.Now/UtcNow` yasak → `TimeProvider`/`IClock` · `KK004` `Guid.NewGuid()` yasak → `Guid.CreateVersion7()` · `KK005` `.Result`/`.Wait()`/`async void` · `KK006` günlüğe `[PersonalData]` alanı |
| Para, zaman | Bayt/Çip/TL `long`; `decimal` yalnızca kasa (`numeric(14,4)`); zaman UTC, iş günü `IClock.BusinessDay()` |
| Hata | Beklenen iş hatası `Result<T>` → `ProblemDetails` kodu; istisna yalnızca beklenmeyen; kuyrukta `PermanentFailureException` |
| API | Minimal API + uç nokta grupları; DTO `record`; bir uç nokta = bir işleyici; OpenAPI açıklaması zorunlu |
| PR | Trunk-based; ≤ 400 satır; 1 onay, `Economy`/`Identity`/`Sandbox`/`Challenge` için CODEOWNERS ile 2 onay; Conventional Commits; mimariyi değiştiren PR yeni ADR taşır |
| Göç | Genişlet/daralt, `CONCURRENTLY`, yıkıcı göç ayrı onay (§4.1) |

### 14.4 Test stratejisi

| Katman | Araç | Kapsam ve eşik |
|---|---|---|
| Birim | xUnit | Saf mantık; `Economy`, `Identity`, `Challenge` ≥ %90 satır, diğerleri ≥ %75 **(B7 önerisi)** |
| Özellik tabanlı | FsCheck | Defter dengesi (her işlem toplamı 0), XP eğrisi, referans tavanı, idempotency |
| Entegrasyon | Testcontainers (PostgreSQL 18, Redis) | Modül başına; rol zorlaması açık |
| Sözleşme | Schemathesis, `oasdiff` | OpenAPI'ye karşı fuzz; kırıcı değişiklik kırmızı |
| e2e | Playwright | 10 yolculuk: giriş + yaş kapısı, ilk ders, Otopark L1, Savunma, kasa, satın alma, veli onayı, silme, çevrimdışı taslak, yeniden bağlanma |
| Sandbox | EscapeSuite (§8.8, 22 senaryo), 26 test, 500 eşzamanlı | H2 kapısı: p95 < 6 sn, kaçış 0 |
| AI | Altın küme regresyonu, 50 enjeksiyon (H5), `ValidateCard` | Kappa ≥ 0,75; ≥ 48/50 engel |
| Yük, kaos | k6, BotSim 10.000 (H6), pod / DB / Redis öldürme | Gece partisi < 30 dk; 40 avatar |

### 14.5 Tanım-bitti (DoD)

Bir iş **bitti** sayılır: (1) kabul ölçütü otomatik testle kanıtlandı, kapsam eşiği sağlandı; (2) OpenAPI ve `Contracts` güncel, kırıcı değişiklik yok; (3) göç genişlet/daralt kuralında, geri alma planı var; (4) metrik, iz ve gerekirse alarm eklendi; (5) BOLA / yetki testi var, günlükte kişisel veri yok, ilgili OWASP maddesi işaretli (§11.9); (6) AI / SMS / sandbox maliyet etkisi ölçüldü; (7) yüksek riskli değişiklik özellik bayrağı arkasında; (8) staging'de duman testi geçti, sprint demosunda gösterildi; (9) ADR / runbook güncel.

### 14.6 Dallanma ve sürümleme

`main` her zaman dağıtılabilir; kısa ömürlü dal + PR; staging her birleşmede, prod haftada ≤ 2 kez (§13.3). İmaj etiketi `YYYY.MM.DD-<git sha>`; API ana sürümü yoldadır (§5.1); göçler modülün `Migrations/` klasöründe ve dağıtımdan önce `Job` olarak çalışır.

### 14.7 İlk 6 sprint: teknik epikler

B9 §4.3 planıyla (2 haftalık sprintler, H1 = 4 Ocak 2027, kapılar G0–G4) birebir hizalıdır. Epik kodu `T` + sıra.

| Sprint (hafta) | Teknik epikler | Teknik kabul (B9 kapısı) |
|---|---|---|
| **S0** Kas–Ara 2026 | Hetzner / OpenTofu tabanı, alan adı + Cloudflare, SMS sözleşmesi + başlık başvurusu, Anthropic anahtarı | Başlık başvurusu verildi |
| **S1** H1–H2 (4–15 Oca) | **T1** monorepo + CI/CD + staging · **T2** Platform çekirdeği (şema/rol, outbox/inbox, idempotency, göç hattı) · **T3** sandbox: gVisor havuzu, agent, Roslyn harness, 20 ısıtılmış, `code-run`, 2 worker · **T4** H2 yük testi + kaçış listesi · **T5** Identity: OTP, `ISmsProvider`, JWT / yenileme, Turnstile · **T6** hub iskeleti, 10 çekirdek olay | Otopark L1 26 test sandbox'ta geçer; H2: 500 eşzamanlı p95 < 6 sn, kaçış 0; gerçek SMS ile staging girişi |
| **S2** H3–H4 (18–29 Oca) | **T7** Kurul hattı: `ai-grade` (Haiku → Sonnet → JSON şema), `answer_hash`, kota, `prompt_versions` · **T8** H3: 1.000 sentetik cevapla maliyet ve p95 · **T9** ders motoru API · **T10** Challenge: spec yükleyici, gönderim, sonuç işleyici, Savunma taslağı · **T11** yaş kapısı spike (`FakeAgeProvider`) + Ebeveyn Paneli iskeleti | **G1:** Sonnet ≤ 0,0041 $ (harmanlanmış ≤ 0,0053 $), Kurul p95 < 4 sn, `cache_read > 0`; yaş kapısı sahte belirteçle uçtan uca |
| **S3** H5–H6 (1–12 Şub) | **T12** çift kayıtlı defter + değişmezler + günlük mutabakat · **T13** World: yaşam döngüsü, gece sentetik trafik, kasa, referans tavanı · **T14** H5 kırmızı takım · **T15** H6 BotSim 10.000 · **T16** Progress, Pazar, Oda, Dolap API, Günlük Tekrar · **T17** Ebeveyn Paneli: süre, harcama, onay | Defter dengesi ve mutabakat farkı 0; 10.000 oyuncunun gece hesabı < 30 dk; ≥ 48/50 enjeksiyon engelli |
| **S4** H7–H8 (15–26 Şub) | **T18** WorldHub shard (40 avatar) + ChatHub + moderasyon hattı · **T19** Social: arkadaş, davet, ziyaret, Alkış, Liderlik · **T20** Çip Butiği + iyzico test + `awaiting_guardian` · **T21** Admin API (içerik, moderasyon, ekonomi, kalibrasyon) · **T22** KVKK: rıza, indirme, silme, saklama işleri · **T23** 61 olaylık analitik | **G2:** 40 avatar yük testi; ağır şikâyet < 1 sa; silme akışı uçtan uca testte |
| **S5** H9–H10 (1–12 Mar) | **T24** prod ortamı: HA CNPG, Sentinel, canary, SLO panoları, nöbet · **T25** dış güvenlik denetimi (sandbox + web) ve düzeltmeler · **T26** PSP canlı onayı · **T27** Ebeveyn Paneli uçtan uca · **T28** ilk DR tatbikatı · **T29** 200 kişilik beta izleme | **G3:** ağır açık 0; SLO'lar prod'da; geri yükleme RTO ≤ 4 sa |
| **S6** H11–H12 (15–26 Mar) | **T30** kapasite 1k → 3k DAU (KEDA, `sandbox-scaler`) · **T31** olay müdahale + alarm tatbikatı · **T32** uyum: veri envanteri, `retention-sweeper` canlı, 72 sa ihlal prosedürü, BTK talep süreci · **T33** durum sayfası, CDN · **T34** H14 içerik damlası altyapısı | **G4:** uyum %100, PSP canlı, ağır açık 0, SLO panosu 7 gün yeşil |

---

## 15. Teknik artifact diyagram içerikleri (8 diyagram)

SVG'yi başka ekip çizer. Kutu = `id | ad | grup` (grup = renk), ok = `kaynak → hedef | etiket`; sıra diyagramlarında kutu yaşam çizgisidir, oklar numaralı sırayla çizilir. Kesik ok = olay, düz ok = komut / çağrı. ERD §4.4'tedir.

### 15.1 Diyagram 1: sistem tek bakışta

| id | Kutu | Grup |
|---|---|---|
| K1 | İstemci (PWA: React + PixiJS) | İstemci |
| K2 | Cloudflare (WAF, CDN, Turnstile) · K3 ingress-nginx | Kenar |
| K4 | api (REST `/v1`) · K5 hub (`/hubs/world`, `/hubs/chat`) · K6 worker (ai-grade, income-tick, notification, moderation, privacy, outbox, cron) | Uygulama |
| K7 | PostgreSQL 18 (15 şema) · K8 Redis (Streams + backplane) | Veri |
| K9 | sandbox-agent · K10 gVisor container: hakem → oyuncu | Sandbox |
| K11 | Claude API (Haiku / Sonnet / Opus) · K12 Netgsm, İleti Merkezi, iyzico, Web Push, e-Devlet yaş belirteci | Dış |

| Kaynak → hedef | Etiket |
|---|---|
| K1 → K2 → K3 | HTTPS / WSS, filtrelenmiş trafik |
| K3 → K4 · K3 → K5 | REST `/v1` · WSS `?shard=` (tutarlı karma) |
| K4 → K7 | komut + outbox (tek işlem) |
| K4 → K8 | hız sınırı; `code-run` / `ai-grade` işi (202) |
| K8 → K6 · K6 → K7 | tüketici grupları · olay rölesi, gece partisi, sonuçlar |
| K5 ⇄ K8 | backplane: `user.*` olayları |
| K8 → K9 | `q:code-run:p0/p1` (yalnızca Redis ACL) |
| K9 → K10 · K9 → K8 | derle + test (10 sn, ağ yok) · `q:code-run:results` |
| K6 → K11 | Kurul çağrıları (kişisel veri ayıklanmış) |
| K4 → K12 · K6 → K12 | OTP SMS (senkron, 2 sn), PSP, yaş belirteci · veli SMS, Web Push |

### 15.2 Diyagram 2: modül bağımlılıkları (§3.3)

| id | Kutu | Grup (katman) |
|---|---|---|
| M0 | Platform + Contracts | 0 |
| M1–M3 | Identity · Player · Content | 1 |
| M4–M5 | Economy · Progress | 2 |
| M6–M8 | Learning · Challenge · Market | 3 |
| M9–M11 | Quest · World · Social | 4 |
| M12–M14 | Notification · Analytics · Moderation | 5 (yalnızca olay dinler) |

| Kaynak → hedef | Etiket |
|---|---|
| M6 → M5 · M8 → M4 | komut `GrantXp` · komut `Post` |
| M9 → M4, M5 · M10 → M4, M5 · M11 → M4, M5 | komut (ödül, Bayt, XP) |
| M10 → M7 | komut `EnqueueRun` |
| M7 ⇢ M10, M9 | olay `SubmissionEvaluatedv1`, `DefensePassedv1`, `BugReportSolvedv1` |
| M6 ⇢ M7, M9 | olay `QuestionGradedv1` (Savunma puanı), `LessonSealedv1` |
| M5 ⇢ M11 · M3 ⇢ M6, M7, M8, M9 | `XpGrantedv1` · `ContentPublishedv1` |
| M6 ✕ M4, M10 · M7 ✕ M4, M10 | **yasak** (kırmızı kesik): AI ve test gelire dokunamaz |
| M12–M14 ⇠ M1–M11 | tüm alan olayları (gri kesik) |

### 15.3 Diyagram 3: AI puanlama sıra diyagramı (§10.12)

Yaşam çizgileri: L1 İstemci · L2 api · L3 PostgreSQL · L4 Redis `q:ai-grade:p0` · L5 worker (`AiGradeConsumer`) · L6 Haiku · L7 Sonnet · L8 Opus · L9 hub.

| # | Kaynak → hedef | Etiket |
|---|---|---|
| 1 | L1 → L2 | `POST /v1/grading/submissions` (`Idempotency-Key`) |
| 2 | L2 → L3 | `queued` satırı + outbox (tek işlem) |
| 3 | L2 → L4 · L2 → L1 | `XADD {submissionId}` · `202 {submissionId, etaMs, quota}` |
| 4 | L4 → L5 | `XREADGROUP` |
| 5 | L5 → L3 | kota `INCR aiq` + `answer_hash` bakışı (isabet → 11'e atla) |
| 6 | L5 → L6 | ön eleme ≈ 0,4 sn (`bos`, `enjeksiyon`, `kopya`, `kisisel_veri`) |
| 7 | L5 → L7 | puanlama ≈ 2–2,5 sn (`cache_control`, `json_schema`, `effort: low`) |
| 8 | L5 → L5 | `ValidateCard` (ihlal → 1 yeniden deneme) |
| 9 | L5 → L8 | **koşullu** kör ikinci okuma: güven < 0,65 ∨ puan 65–75 (+3–4 sn) |
| 10 | L5 → L5 | birleşim (< 15 ortalama, ≥ 15 oyuncu lehine) |
| 11 | L5 → L3 | `done` + `QuestionGradedv1` (outbox) |
| 12 | L5 → L9 → L1 | backplane `job.completed{grading}`, `user.xp` |

### 15.4 Diyagram 4: sandbox mimarisi (§8)

| id | Kutu | Grup |
|---|---|---|
| S1 | api / worker (üretici) · S7 worker (sonuç işleyici) · S8 PostgreSQL | Uygulama bölgesi |
| S2 | Redis `q:code-run:p0/p1`, `results` (kısıtlı ACL kullanıcısı) | Veri |
| S3 | sandbox-agent (düğüm başına 1) | Sandbox bölgesi |
| S4 | Hakem (Judge): Roslyn bellek içi derleme, test koşucusu | Güvenilir kod |
| S5 | Oyuncu (Player): yalnızca derlenmiş yöntem | Güvensiz kod |
| S6 | gVisor `runsc`: 256 MB, 2 vCPU, 10 sn, salt okunur FS, ağ yok | Yalıtım sınırı |

| Kaynak → hedef | Etiket |
|---|---|
| S1 → S2 · S2 → S3 | `XADD` iş (`jobId`, kaynak / `peRef`, testler, sınırlar, `nonce`) · `XREADGROUP` |
| S3 → S6 · S3 → S4 | ısıtılmış havuzdan container · iş JSON'u (stdin) |
| S4 ⇄ S5 | çağrı / dönüş (stdio JSON-lines; beklenen değerler oyuncuda yok) |
| S4 → S3 → S2 | test sonucu (stdout) → `results` (`nonce` doğrulanır) |
| S2 → S7 → S8 | sonuç tüketimi → `submissions.status` (`WHERE status IN ('queued','running')`) + olay |

### 15.5 Diyagram 5: OTP akışı (§11.1, §11.5)

Yaşam çizgileri: P1 İstemci · P2 api · P3 Redis (Lua sayaç) · P4 Turnstile · P5 PostgreSQL · P6 Netgsm · P7 İleti Merkezi · P8 e-Devlet · P9 veli.

| # | Kaynak → hedef | Etiket |
|---|---|---|
| 1 | P1 → P2 | `POST /auth/otp/requests {phone, deviceId}` |
| 2 | P2 → P3 | 5/saat/telefon, ≥ 60 sn, 10/gün/cihaz, 30/saat/IP |
| 3 | P2 ⇄ P4 | risk ≥ 40 ise Turnstile doğrula |
| 4 | P2 → P5 | `otp_challenges` (`code_hash`, 90 sn) |
| 5 | P2 → P6 · P2 → P7 | SMS (2 sn zaman aşımı) · yedek (hata ya da DLR < %93) |
| 6 | P2 → P1 | `202 {challengeId, expiresInSec: 90, resendAfterSec: 60}` |
| 7 | P1 → P2 · P2 → P5 | `POST /auth/otp/verifications` · atomik `UPDATE … consumed_at` (3 yanlış/kod, 5/saat) |
| 8a | P2 → P1 | kayıtlı: JWT (15 dk) + yenileme çerezi |
| 8b | P2 → P1 | yeni: `registrationToken` (10 dk) → 9 |
| 9 | P1 → P8 → P2 | yaş belirteci: `lt15` red · `15-17` · `18+` |
| 10 | P2 → P9 | 15–17: SMS bağlantısı (72 sa) + veli OTP |

### 15.6 Diyagram 6: Kubernetes topolojisi (§13.2)

| id | Kutu | Grup |
|---|---|---|
| T1 | Cloudflare · T2 Hetzner LB + ingress-nginx | Kenar |
| T3 | Havuz `app`: api, hub, worker-ai/core/notify, cron | Uygulama |
| T4 | Havuz `data`: CNPG 1+2, PgBouncer, Redis kuyruk, Redis backplane | Veri |
| T5 | Havuz `sandbox`: sandbox-agent + gVisor `RuntimeClass` (taint) | Sandbox |
| T6 | Havuz `obs`: Prometheus, Loki, Tempo, Grafana, Alertmanager | Gözlem |
| T7 | Argo CD + Rollouts | Dağıtım |
| T9 | Nesne deposu (WAL, yedek, dışa aktarma) | Depo |

| Kaynak → hedef | Etiket |
|---|---|
| T1 → T2 → T3 | HTTPS; `api` REST, `hub` WSS (`upstream-hash-by $arg_shard`) |
| T3 → T4 | SQL, Redis (NetworkPolicy izinli) |
| T5 → T4 | **yalnızca** kuyruk Redis 6379 (başka çıkış ve giriş yok) |
| T4 → T9 | pgBackRest: tam + fark + WAL |
| T7 → T3, T5 | GitOps senkron (imza doğrulanır) |
| T3, T4, T5 → T6 | OTel: metrik, iz, günlük |

### 15.7 Diyagram 7: SignalR shard ölçekleme (§6.7)

| id | Kutu | Grup |
|---|---|---|
| H1 | İstemci | İstemci |
| H2 | api: `join-tickets` · H8 worker / api (`user.*` üretici) | Uygulama |
| H3 | Redis shard defteri + anlık görüntü (`player:loc`) · H7 Redis backplane (`user:{id}`) | Veri |
| H4 | ingress-nginx (`upstream-hash-by $arg_shard`) | Kenar |
| H5 | hub pod A: shard `meydan-01…` (≈ 60 shard / 2.500 bağlantı) · H6 hub pod B | Uygulama |

| Kaynak → hedef | Etiket |
|---|---|
| H1 → H2 · H2 → H3 | `POST join-tickets` · shard seç: arkadaş → kohort → ≤ 32 dolu → yeni |
| H2 → H1 | bilet (15 sn, tek kullanım) + `hubUrl` |
| H1 → H4 → H5 | `WSS ?shard=meydan-07` → tutarlı karma: shard'ın tüm bağlantıları aynı pod |
| H5 → H3 | 5 sn'de bir anlık görüntü |
| H5 → H1 | `scene.delta` (5 Hz, JSON) |
| H8 → H7 → H5, H6 | `user.xp`, `job.completed` (yalnızca pod'lar arası) |
| H5 ✕ → H4 → H3 | pod ölümü: yeniden bağlan, shard ≤ 2 sn'de anlık görüntüden kurulur |

### 15.8 Diyagram 8: CI/CD (§13.3)

| id | Kutu | Grup |
|---|---|---|
| C1 | Geliştirici → PR | Kaynak |
| C2 | GitHub Actions PR kapıları: derleme, birim, mimari, veri, güvenlik | CI |
| C3 | İmaj hattı: build, Trivy, SBOM, cosign (GHCR) | CI |
| C4 | Deploy deposu (`deploy/overlays`) · C5 Argo CD | GitOps |
| C6 | Staging: göç `Job`, duman, e2e, k6 | Ortam |
| C7 | Sandbox kapısı: EscapeSuite, 26 test, 500 eşzamanlı | Kapı |
| C8 | Prod canary: Argo Rollouts %10 → %50 → %100 + SLO analizi | Ortam |

| Kaynak → hedef | Etiket |
|---|---|
| C1 → C2 → C3 | PR; main'e birleşme |
| C3 → C4 → C5 | imaj özeti + etiket; senkron |
| C5 → C6 → C8 | otomatik; onay (haftada ≤ 2) |
| C6 → C7 → C8 | yalnızca sandbox imajı / politikası değişince |
| C8 ⇢ C5 | SLO ihlali → otomatik geri alma |

---

## 16. Varsayımlar

1. Kur 45 TL/$, 1 € ≈ 1,075 $ (B3, B9 ile aynı); Hetzner ve Azure liste fiyatları §13.6'dadır ve H1'de doğrulanır. H1 = 4 Ocak 2027 (B9); TR saati kalıcı UTC+3.
2. KANON §6 "5 deneme/saat" = telefon başına saatte **5 yanlış kod girişi**; B7 önerileri: 5 SMS/saat/telefon, kod başına 3 yanlış hak, 10 SMS/gün/cihaz, 30/saat/IP.
3. Tek faktörlü SMS OTP'nin **kalıntı riski** kabul edilmiştir: kod başına ≤ 3 × 10⁻⁶, günde ≈ 1,2 × 10⁻⁴ tahmin olasılığı (§11.1).
4. Yaş: `age_gate_min = 15` (B9 §8.1 seçenek A); e-Devlet belirteci yalnızca 15 / 18 eşiğini taşır, kimlik içermez; protokol G0/H2'de netleşir, erişilemezse `declared18` kapalı beta. 15–17'de yeniden doğrulama 12 ayda bir **(B7 önerisi)**.
5. Saklama süreleri B9 §8.3 ve B6 §7.6'dandır ve hukukça doğrulanır; veli onay kaydı B9'a göre onay + 2 yıl'dır (B6: hesap ömrü + 3 yıl, Açık Soru 6).
6. Kapasite oranları §1.3'tedir (CCU = DAU × %12, 300 istek/DAU/gün, 8 çalıştırma, 12 AI etkileşimi) ve H6/H10 ölçümleriyle güncellenir; sandbox planlama 2 CPU-sn/çalıştırma, hub bütçesi 2.500 bağlantı/pod.
7. SMS: 4,4 SMS/DAU/ay × 0,25 TL (kayıt 1,7 + yeniden giriş 1,9 + veli 0,8); sözleşme fiyatları Sprint 0'da teyit edilir.
8. Anthropic'e kişisel veriden arındırılmış metin gider (yurt dışı aktarım); eğitimde kullanılmama ve saklama koşulları sözleşmede doğrulanır (B9 §8.3, §8.8).
9. Altyapı payı hedefi ("toplamın %20'sinden az") ≈ 2.500 DAU'dan sonra sağlanır; 1k DAU'da sabit taban (HA veri katmanı, staging, gözlem) payı ≈ %30 yapar (§13.6).

---

## 17. Açık Sorular

1. **Veri yerelliği.** Hetzner Almanya, KVKK m.9 ve 5651 açısından yeterli mi; 15–17 verisi yurt içinde mi tutulmalı? (Hukuk, G0/H2; ADR-15, §11.8)
2. **"Sıcaklık 0".** B3 sözleşmesinden çıkıp "aynı cevabı 5 kez puanla, std ≤ 3" ölçütü mü konsun? (B3, §10.5)
3. **Başkasının e-Devlet oturumu.** Çocuğun yetişkin oturumuyla "18+" belirteci alması KodKent'te yakalanamaz; davranışsal savunma yeterli mi? (§11.5)
4. **Kişi adı süzgeci.** Ders 1.1 oyuncunun adını koda yazdırır; AI'ya giden metinde ad nasıl maskelenecek? (B3 ile, G1'e kadar; §10.7)
5. **e-Devlet belirteci.** Protokol, erişim koşulu, takvim; erişilemezse 18+ kapalı beta kabul mü? (G0/H2; §11.5)
6. **Saklama çelişkisi.** Veli onay kaydı B9'da onay + 2 yıl, B6'da hesap ömrü + 3 yıl; sohbet 90 mı 30 gün mü (B6 Açık Soru 8)? (§11.7)
7. **Sosyal ağ tanımı.** Meydan sohbeti, ziyaret ve Vitrin 7578 sayılı Kanun'daki tanıma giriyor mu? Giriyorsa 15–17 kısıtları zorunlu olur, 13–14 Akademi yolu kapanır. (B9 §8.1)
8. **gVisor ek yükü.** `systrap` ile Hetzner VM'inde 500 eşzamanlı çalıştırmada p95 < 6 sn tutar mı; tutmazsa Firecracker / Kata. (H2, ADR-02)
9. **Düşünme kapatma.** `thinking: between_tools` token'ları 200 çıkış bütçesini şişirir mi; Sonnet hedefi 0,0041 $ tutar mı? (H3, §10.2)

---

## 18. Diğer Belgelere Bağımlılıklar

| Belge | B7 bölümü | Beklenen |
|---|---|---|
| KANON | §11.5, §12.3, Ek A | §1 yaş sınırı / veli bandı, §6 Giriş adımı (v2 adayı); o zamana dek bayrak `age_gate_min` |
| B2 | §9, §11.5 | §9.3 "300 Çip/ay" tavanı 15–17 için ebeveyn limitine döner (B9 §8.6); §10.5 panosu ← §9.8 |
| B3 | §10, §13.6 | İstem / şema / kalibrasyon; "sıcaklık 0" ölçütü; kişi adı süzgeci; `between_tools` ölçümü; maliyet senaryoları |
| B4 | §4, §14.7 | Ders kimlikleri → `learning.lessons`; Günlük Tekrar → `progress.review_queue` |
| B5 | §8, §14.7 | Challenge Spec şeması, harness protokolü, tohumlu test, kaçış listesi |
| B6 | §6, §11.5, §11.7 | §7.5 güvenli mod 15–17 → 15–17; §7.6 log süreleri; moderasyon basamakları, P0 süreleri |
| B8 | §12 | `birthYear` → `verificationId`; §12.3'teki 13 uç nokta; §12.5; Ebeveyn Paneli arayüzü; `session.limit_reached` |
| B9 | §11.5, §13.6, §14.7 | §8 yaş kapısı / KVKK; §6 bütçe (altyapı ≈ 2 × B7); §4.3 sprintler, G0–G4; §9.7 analitik rızası |

---

## Ek A. Sabit Önerileri (KANON v2 adayları)

| Anahtar | KANON v1 değeri | Önerilen değer | Gerekçe |
|---|---|---|---|
| `yas_alt_siniri` | 13 (KANON §1) | 15 (`age_gate_min` bayrağı) | B9 §8.1 seçenek A; birincil metin G0'da doğrulanır |
| `veli_onayi_bandi` | 15–17 | 15–17 (13–14 yalnızca `akademi` bayrağıyla) | Ayrıştırılmış hizmet, B9 §8.2 |
| `yas_verisi` | doğum yılı (KANON §6 Giriş) | yalnızca eşik + doğrulama tarihi; doğum tarihi saklanmaz | Veri en aza indirme, B9 §8.2 |
| `giris_yas_adimi` | "doğum yılı, veli onayı adımı" | "e-Devlet yaş belirteci, veli onayı adımı" | §11.5; Giriş ekran metni (B8) |
| `ebeveyn_paneli` | yok (24 ekran) | hesapsız web sayfası; ekran listesine girmez, ayrı uygulama | B9 Ek A, B6 §7.5 |
| `cip_tavani_15_17` | B2: 300 Çip/ay | tavan yok; ebeveyn limiti (varsayılan 0) + her satın almada onay | B9 §8.2, §8.6 |
| `otp_sinirlari` | yok (yalnızca "5 deneme/saat") | 5 gönderim/saat/telefon; kod başına 3 yanlış; 10/gün/cihaz; 30/saat/IP | SMS-pumping savunması (§11.3) |
| `oturum_omru` | yok | erişim 15 dk; yenileme 30 gün kayan, mutlak tavan 180 gün | ADR-13, §11.4 |
| `ai_p95_toplam` | p95 < 4 sn (ilk geçiş) | ilk geçiş < 4 sn; toplam < 8 sn | Opus ikinci okuma vakaların %8'i (§10.10) |
| `ai_determinizm` | "sıcaklık 0" (B3 / VİZYON) | `answer_hash` önbelleği + "5 kez puanla, std ≤ 3" | API `temperature` kabul etmez (§10.5) |
| `yedek_saklama` | yok | en çok 30 gün | KVKK silme ≤ 30 gün (B9 §8.3) |
