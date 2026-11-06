# B8 — İstemci, Oyun Motoru & Ekran Tasarımları (KodKent)

| Alan | Değer |
|---|---|
| Belge id | **B8** |
| Sürüm | v1 (2026-11-02) |
| Sahibi | Kıdemli frontend/oyun istemcisi mühendisi ve UX tasarımcısı |
| Bağlayıcı kaynaklar | `KANON.md` v1 (özellikle §6 ekran adları, §2 semtler ve Ustalar, §3–§4 XP ve Bayt, §8 tipler, §9 Kurul), `A-vizyon-FINAL.md` (§3 döngü, §4 ilk 30 dakika, §5 dünya, §7 Otopark yolculuğu), `00-fikir.md` (SABİT kararlar), `03-ajan-talimati.md` (ekran kimlikleri, sabit şemalar) |
| Dayandığı belgeler | **B1** (izometrik temel, semt renkleri, Akademi içi, Oda, işletme arsası durumları, avatar, Usta görünüşü) ve **B2** (XP ve Bayt sayıları, kozmetik fiyatları, Çip paketleri); B3–B7 bu belgeyle aynı anda yazıldığı için ilgili yerlerde "(ad Bx ile hizalanır)" notu vardır |
| Kapsam | İstemci teknolojisi ve gerekçeleri; PixiJS render ve performans bütçeleri; görsel stil ve token'lar; 24 ekran + HUD'un wireframe bölge tabloları, bileşenleri, durumları, etkileşimleri, verisi; navigasyon haritası ve 3 kullanıcı akışı; 6 mockup için içerik paketi; bileşen kütüphanesi; avatar sistemi; animasyon ve ses; erişilebilirlik; yerelleştirme; mobil uyarlama; çevrimdışı ve performans izleme |
| Tüketiciler | **Ekranlar sayfası** (`kodkent-ekranlar.html`): wireframe tabloları SVG'ye, kenar listesi akış diyagramına, §8 yüksek sadakatli mockup'a dönüşür. **Prototip** (`kodkent-prototip.html`): §6 ekran listesi, §8 örnek verisi, §9 bileşen davranışları. |
| Kural | KANON'daki her sayı ve ad aynen kullanılır. KANON'da bulunmayan ve burada ilk kez önerilen her sayı **(B8 önerisi)** etiketiyle işaretlidir ve Ek A'da toplanmıştır; onaylanana kadar KANON/VİZYON değeri geçerlidir. |

**Terim notu.** *Ekran* KANON §6'daki 24 adlı yüzeydir (kimlik: hash token). *Sahne* PixiJS'in çizdiği izometrik dünya parçasıdır (Meydan, Lobi, Kürsü, Oda…). *Panel* sahnenin ya da sayfanın üstünde açılan React yüzeyidir. *HUD* ekran değil, sabit katmandır (`hud`). Bir ekran hem sahne hem panel olabilir (ör. Derslik: Kürsü sahnesi arkada, kart paneli önde). *Tier* semt zorluk katmanı (T1–T4), *L1–L5* işletme seviyesidir (B1/B2 ile aynı).

**Okuma kılavuzu: wireframe tabloları.** Her ekran alt bölümünde şu başlıklı bir tablo vardır:

`| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |`

- Koordinatlar CSS pikseli, sol üst köşe orijinli; masaüstü çerçevesi 1280×800, mobil çerçevesi 390×844'tür. Mobil çerçevede `env(safe-area-inset-*)` sıfır kabul edilmiştir (gerçek cihazda üst ve alta eklenir).
- Satırlar arkadan öne çizim sırasındadır. İki bölge ya **ayrıktır** ya da biri diğerini **tamamen içerir** (ör. "Sahne" tüm çerçeveyi içerir; HUD parçaları onun üstünde durur). Kısmi çakışma yoktur.
- `↳` ile başlayan satır bir önceki üst satırın çocuğudur. `—` o çerçevede bölgenin olmadığı (ya da başka bölgeye katlandığı) anlamına gelir; içerik sütunu nereye katlandığını söyler.
- Her ekranda 4–9 bölge vardır; HUD ayrıntısı §5'tedir, ekran tablolarında HUD "üst şerit" ve "alt dock" olarak tek satırdır.

---

## 0. Yönetici özeti

1. **Tek istemci, iki dünya.** KodKent istemcisi bir PWA'dır: React 19 + TypeScript (HUD, 24 ekranın panelleri, formlar), PixiJS 8 (izometrik sahne; tek kalıcı canvas), masaüstünde Monaco, dokunmatikte CodeMirror 6 (kod), SignalR (gerçek zamanlı). Unity WebGL ve Godot HTML5, ilk yükleme boyutu ve DOM erişilebilirliği yüzünden elendi (§1.2).
2. **React sahneyi, sahne React'i doğrudan çağırmaz.** İkisinin arasında tipli bir köprü (komut/olay) vardır; 40 avatarın konum güncellemeleri React render'ına hiç girmez (§1.3, §1.5).
3. **Sunucu otoriterdir.** İstemci XP, Bayt ve Çip hesaplamaz; ödül animasyonu yalnızca sunucu yanıtı gelince oynar. Test sonucunu, Kurul puanını ve gelir hesabını istemci üretmez.
4. **Bütçeler sayıdır, dilek değil.** Masaüstü 60 fps, orta mobil 30 fps, düşük cihaz modu 24 fps; draw call ≤ 40 / 32 / 20; Meydan'ın ilk yüklemesi ≤ 3,5 MB (B1); giriş ekranı JS'i ≤ 230 KB gzip (B8 önerisi) (§2.7).
5. **Görsel kimlik İznik çinisinden türer.** 2:1 izometrik, 64×32 tile; turkuaz, kobalt, mercan, amber, nane, mor + "gece şehri" nötr rampası; başlık/HUD sayıları Fredoka, gövde Nunito, kod JetBrains Mono (§3).
6. **24 ekran üç türdür:** tam ekran akış (Giriş, Dil Seçimi, Avatar Atölyesi), sahne ekranları (Meydan, Şehir Haritası, Akademi Lobisi, İşletme Sokağı, Oda) ve panel ekranları (kalan 16). HUD'un dört modu vardır: tam, kompakt, odak, gizli (§4, §5).
7. **Erişilebilirlik sonradan eklenmez.** Canvas'a paralel bir "Erişilebilir Dünya Katmanı" (DOM) kurulur; her sürükle-bırak işleminin tek işaretçili alternatifi vardır; WCAG 2.2 AA kontrol listesi §12'dedir.
8. **"Mobilde okunur, masaüstünde yazılır."** İşletme kodu mobilde varsayılan olarak salt okunurdur ve "Sonra masaüstünde devam et" kartı çıkar; Atölye görevleri kısa olduğundan mobilde de yazılır (kod yardımcı çubuğu, §14).
9. **Çevrimdışı dürüsttür.** Kabuk, son ders paketi ve atlaslar çevrimdışı açılır; kod çalıştırma, Kurul ve satın alma sunucu gerektirir ve ekran bunu söyler; cevap taslakları cihazda saklanır (§15).
10. **"Örnek Çözümü Yükle" yalnızca prototip demo düğmesidir.** Üretimde referans çözüm sunucudan çıkmaz (KANON §5.1); editörde onun yerini ipucu merdiveninin "Örnek" kademesi (benzer ama farklı mini problem) alır.
11. **Mockup'lar tek oyuncuyla çizilir:** `@zeynep_cs` (§8). Aynı oyuncunun üç zaman damgası (14. dakika, 75. dakika, 9. gün) altı mockup'ı tutarlı kılar.

---

## 1. Teknoloji kararları

### 1.1 Karar özeti

| # | Konu | Karar | Gerekçe | Elenen |
|---|---|---|---|---|
| K-01 | Uygulama biçimi | SPA: TypeScript 5 (strict) + React 19 + Vite; ekran başına `React.lazy` chunk | Oyun istemcisi tamamen istemci tarafı; kabuk küçük kalınca ilk boyama hızlı; SEO isteyen sayfalar (karşılama, mağaza sayfası) ayrı statik site (B9) | Next.js/SSR (değer katmıyor), Angular, Svelte |
| K-02 | Render | PixiJS 8, WebGL2; WebGPU yalnızca deneysel bayrak; tek kalıcı `<canvas>` | 2D sprite, atlas ve batching için en ince seçenek; ağaç sallamayla yalnızca kullanılan modüller girer; canvas ayrı katman olduğundan React ile iç içe geçmez | Tablo §1.2 |
| K-03 | Kod editörü | `CodeEditor` arayüzü iki gerçeklemeyle: masaüstü (genişlik ≥ 1024 px ve ince işaretçi) **Monaco**; dokunmatik cihaz ve Derslik'in tek satırlık mini editörü **CodeMirror 6** | Monaco mobil tarayıcıyı resmen desteklemiyor; CodeMirror 6 dokunma, sanal klavye ve "yalnızca bu satır düzenlenebilir" kuralını (`transactionFilter`) doğal destekler | Yalnızca Monaco (mobilde bozuk), yalnızca CodeMirror (masaüstünde marker/diff beklentisi) |
| K-04 | Gerçek zamanlı | `@microsoft/signalr` 8+ ; `/hubs/world` MessagePack, `/hubs/chat` JSON | ASP.NET Core ile birebir protokol; otomatik yeniden bağlanma; hub bazlı ayrım (dünya trafiği ile sohbet moderasyonu karışmaz) | Ham WebSocket, Socket.IO (B7'nin SignalR kararı SABİT) |
| K-05 | Durum yönetimi | Sunucu durumu **TanStack Query 5**; istemci/UI durumu **Zustand 5**; akışlar **XState 5**; dünya durumu React dışı **WorldStore** | §1.5 | Redux Toolkit (tören fazla), yalnızca Context (render patlaması) |
| K-06 | Stil | CSS Modules + CSS özel nitelikleri (token); çalışma zamanlı CSS-in-JS yok | Sıfır çalışma zamanı maliyeti; aynı token dosyası Ekranlar sayfasında ve prototipte birebir kullanılır | Tailwind, styled-components |
| K-07 | Hareket | CSS transition + Web Animations API (HUD, paneller); Pixi tarafında 2 KB'lık `tween` ve parçacık havuzu | `prefers-reduced-motion` tek noktadan yönetilir; Framer Motion (≈ 30 KB gz) bütçeyi yer | Framer Motion, GSAP |
| K-08 | Ses | Howler.js (Web Audio sarmalayıcı), tek ses sprite'ı; **varsayılan KAPALI** | ≈ 10 KB gz; mobil otomatik oynatma kısıtlarını yönetir | Ham Web Audio, Tone.js |
| K-09 | PWA | `vite-plugin-pwa` (Workbox), Web App Manifest, isteğe bağlı Web Push (VAPID) | Mobil birincil platform; ana ekrana ekle (ilk 30. dakikada önerilir) | Capacitor sarmalayıcı (sonraki sürüm, B9) |
| K-10 | i18n | FormatJS (`react-intl`), ICU mesajları, varsayılan `tr-TR`; `tr-ek` ek yardımcısı | `Intl` tabanlı sayı/tarih/çoğul; mesaj çıkarma aracı | i18next (ICU eklentisi ister), Lingui |
| K-11 | Yönlendirme | Hash yönlendirme `#/token?param=değer` (prototip `#token` biçimini kullanır, üretim ikisini de çözer); React Router 7 | Statik barındırma ve service worker ile sorunsuz; ekran kimliği = rota kimliği | History API (sunucu yeniden yazma ister) |
| K-12 | Sözleşmeler | OpenAPI → `openapi-typescript` ile tipler; Kurul JSON şeması Zod ile çalışma zamanında doğrulanır | B7 uç noktaları ve B3 şeması tek kaynaktan; yanlış alan adı derleme hatasıdır | Elle yazılmış tipler |
| K-13 | Test | Vitest, Testing Library, Playwright (E2E, görsel regresyon, `axe-core`), Storybook | Ekranlar sayfasındaki bileşen örnekleri Storybook'tan doğrulanır | Cypress |
| K-14 | Gözlemlenebilirlik | `web-vitals` + özel oyun metrikleri; hata izleme (Sentry uyumlu; B7 ile hizalanır) | §16 | — |

Sürümler ana sürüm düzeyinde sabitlenir (React 19, PixiJS 8, TypeScript 5, SignalR istemcisi ASP.NET Core ile aynı ana sürüm); küçük sürümler `pnpm` kilit dosyasıyla dondurulur ve Renovate haftalık PR açar.

### 1.2 Motor alternatifleri

| Aday | İndirme (yaklaşık*) | İzometrik 2D sprite | React/DOM UI ile birlikte | 4 GB mobil web | Erişilebilirlik | Karar |
|---|---|---|---|---|---|---|
| **PixiJS 8** | 120–180 KB gz (kullanılan modüller) | Çok iyi: spritesheet, batching, `RenderTexture`, `BitmapText` | Mükemmel: canvas bir katman, UI React'te | İyi: 30 fps / 40 avatar mümkün | DOM serbest; canvas için paralel katman gerekir (§12) | **SEÇİLDİ** |
| Phaser 3 | ≈ 340 KB gz | İyi (Tiled hazır) | Orta: kendi sahne/girdi/ses yöneticisi var, React HUD ile çift sahiplik | İyi | Aynı | Elendi: fizik, tween, girdi yöneticilerinin çoğu gereksiz; 2× boyut; HUD zaten React |
| Three.js (ortografik kamera) | ≈ 120–170 KB gz | Orta: 2D piksel sanatı için aşırı; keskinlik ve atlas düzeni elle | İyi | Orta: 3B boru hattı, pil | Aynı | Elendi: stil kararı 2:1 piksel sanatı; 3B ışık/gölge maliyeti gereksiz |
| Unity WebGL | ≈ 4–10 MB sıkıştırılmış ilk indirme | İyi | Zayıf: UI Unity içinde ya da `jslib` köprüsü; Monaco ve DOM dışarıda | Zayıf: bellek tavanı, iOS Safari çökmeleri, 8–15 sn ilk açılış | Zayıf | Elendi: "ilk Bayt ≤ 20 dk" ve "mobilde okunur" hedeflerini bozar |
| Godot 4 (HTML5) | ≈ 8–10 MB sıkıştırılmış (wasm + pck) | İyi | Zayıf–orta: iş parçacıklı build COOP/COEP (cross-origin isolation) ister | Orta | Zayıf | Elendi: boyut, başlık zorunluluğu, HUD'un DOM'dan kopması |
| Kütüphanesiz Canvas 2D/DOM | 0 KB | Orta: 40 avatar + ~2.000 sprite'ta CPU kare süresi artar; batching yok | İyi | Orta | İyi | Elendi: draw call bütçesini tutturamaz; atlas, z-sıralama, LOD hepsi elle yazılırdı |

\* Boyutlar sürüm ve paketlemeye göre değişir; yaklaşık değerlerdir ve H2'de (iskelet haftası) ölçülür. Karar boyuttan çok yapıya dayanır: React'in sahibi olduğu bir UI ile 2D sprite sahnesi isteyen bir ürün için en az sürtünme PixiJS'tedir.

### 1.3 Katman mimarisi (diyagram içeriği)

```
┌───────────────────────────── Tarayıcı (PWA) ─────────────────────────────┐
│ KATMAN 1  React UI    HUD · 24 ekranın panelleri · Modal/Toast · Editör   │
│              ▲ olaylar (seçici abonelik)        │ komutlar (tipli)        │
│ KATMAN 2  Köprü       SceneBridge: komut kuyruğu + olay yayıncısı         │
│              ▲                                  ▼                         │
│ KATMAN 3  Oyun sahnesi  PixiJS: SceneManager · Camera · TilemapRenderer · │
│              EntityLayer · Pathfinder · InputRouter · FxLayer · AudioBus  │
│              ▲ okur/yazar                                                 │
│           WorldStore (React dışı: varlıklar, konumlar, etkileşim noktaları)│
│              ▲ anlık görüntü/delta              │ hareket/emote/etkileşim │
│ KATMAN 4  Ağ          RestClient + TanStack Query · WorldConnection ·     │
│              ChatConnection · OfflineQueue                                │
│ KATMAN 5  Platform    Service Worker · Cache Storage · IndexedDB ·        │
│              Web Audio · Telemetri · Bildirimler                          │
└──────────────┬───────────────────────────────────────┬────────────────────┘
        HTTPS /v1 + SignalR /hubs/* (B7)          CDN: atlas, ses, ders paketi
```

| Düğüm | Katman | Sorumluluk |
|---|---|---|
| N1 React UI | 1 | HUD, ekran panelleri, formlar, modal, toast; sunucu durumu TanStack Query'den okunur |
| N2 Köprü (`SceneBridge`) | 2 | UI→sahne **komutları** (`scene.goto`, `camera.focus`, `fx.play`, `emote.play`, `room.place`) ve sahne→UI **olayları** (`scene.ready`, `entity.hover`, `interaction.available`, `world.event`); iki yönde de veri kopyalanır, nesne referansı geçmez |
| N3 Oyun sahnesi | 3 | Çizim döngüsü, girdi (tıkla-yürü, sürükle, pinch), yol bulma, kamera, parçacıklar |
| N4 WorldStore | 3 | Varlık tablosu (`Map<EntityId, Entity>`), yürünebilir maske, etkileşim noktaları; React'e **kapalı**, yalnızca türetilmiş dilimleri köprüden çıkar |
| N5 REST + Query | 4 | `/v1` istekleri, önbellek, yeniden deneme, `Idempotency-Key` |
| N6 WorldConnection | 4 | `/hubs/world` bağlantısı, shard katılımı, anlık görüntü/delta, yeniden bağlanma |
| N7 ChatConnection | 4 | `/hubs/chat`; mesaj akışı, moderasyon olayları |
| N8 Service Worker | 5 | Kabuk önbelleği, atlas/ses `CacheFirst`, API `StaleWhileRevalidate` (yalnızca içerik GET'leri), güncelleme akışı |
| N9 IndexedDB | 5 | Cevap taslakları, çevrimdışı kuyruk, ayar önbelleği |
| N10 AudioBus | 3/5 | Howler örneği, kanal seviyeleri, ses sprite'ı |
| N11 Telemetri | 5 | `web-vitals`, oyun metrikleri, hata günlüğü |
| N12 Backend | dış | B7 (REST + SignalR) |
| N13 CDN | dış | İçerik özetli (hash'li) atlas, ses, ders paketi |

| Kenar | Kaynak → hedef | Kanal | Yön / not |
|---|---|---|---|
| E1 | N1 → N2 | `bridge.send(cmd)` | Komut; sahne yoksa kuyruğa alır, `scene.ready` olunca boşaltır |
| E2 | N2 → N1 | `bridge.on(evt)` | Olay; React yalnızca `useBridgeSelector` ile abone olur |
| E3 | N2 ↔ N3 | doğrudan çağrı | Aynı iş parçacığı; köprü sahnenin tek giriş kapısıdır |
| E4 | N3 ↔ N4 | okuma/yazma | Sahne her kare WorldStore'u okur; yürüme/etkileşim sonucunu yazar |
| E5 | N6 → N4 | `SceneSnapshot`, `EntityEntered/Moved/Left` | Sunucu delta'sı; istemci tahmini yok (yürüme animasyonu dışında) |
| E6 | N3 → N6 | `MoveTo(path)`, `Emote(id)`, `Interact(entityId)` | Niyet; sunucu doğrular |
| E7 | N1 → N5 | `useQuery` / `useMutation` | Sunucu durumu |
| E8 | N1 ↔ N7 | `ChatConnection.send/subscribe` | Sohbet panelleri; mini sohbet HUD'u |
| E9 | N5, N6, N7 ↔ N12 | HTTPS, WebSocket | B7 |
| E10 | N8 ↔ N13 | `fetch` | Varlıklar `CacheFirst`, `immutable` |
| E11 | N1 → N9 | IndexedDB | Taslak/kuyruk |
| E12 | N3, N1 → N10 | `audio.play(id)` | Ses kapalıyken no-op |
| E13 | N1, N3 → N11 | `telemetry.track()` | Örnekleme §16 |

**Pointer olayları ve odak.** Canvas `position: fixed; inset: 0; z-index: 0`; React kökü `z-index: 10`, `pointer-events: none`; yalnızca düğme/panel öğeleri `pointer-events: auto`. Böylece boş HUD alanına dokunuş canvas'a geçer (tıkla-yürü), düğmeye dokunuş geçmez. Klavye odağı React'tedir; sahne odaklanabilir değildir, erişilebilirlik için paralel DOM katmanı kullanılır (§12.3).

### 1.4 Paket yapısı

```
kodkent/                              # monorepo kökü (klasör düzeni B7 ile hizalanır)
├─ apps/
│  └─ web/                            # PWA kabuğu
│     ├─ src/app/                     # kök bileşen, rotalar, provider'lar, hata sınırı
│     ├─ src/screens/                 # ekran kimliği = klasör adı
│     │   giris/ dil-sec/ avatar/ meydan/ harita/ akademi/ derslik/ kurul/
│     │   atolye/ sokak/ is-emri/ editor/ savunma/ panel/ metro/ tekrar/
│     │   oda/ dolap/ pazar/ vitrin/ profil/ liderlik/ sohbet/ ayarlar/
│     ├─ src/hud/                     # HUD (ekran değil; sabit katman)
│     ├─ src/features/                # dikey dilimler: lesson, grading, business,
│     │                               # market, social, wallet, wardrobe, room
│     └─ public/                      # manifest, ikonlar, sw kaydı
├─ packages/
│  ├─ ui/                             # tasarım sistemi: token'lar + bileşenler (§9)
│  ├─ game-core/                      # React'ten bağımsız: iso matematiği, A*, SceneManager,
│  │                                  # Camera, WorldStore, AssetLoader, FxLayer
│  ├─ net/                            # RestClient, SignalR bağlantıları, OfflineQueue
│  ├─ contracts/                      # openapi-typescript çıktıları + Zod şemaları (Kurul vb.)
│  ├─ editor/                         # CodeEditor arayüzü, Monaco/CodeMirror gerçeklemeleri,
│  │                                  # C# tokenizer, 'kodkent-night' teması
│  ├─ i18n/                           # katalog, formatlar, tr-ek.ts
│  ├─ telemetry/                      # web-vitals, oyun metrikleri
│  └─ assets/                         # kaynak sanat + atlas boru hattı (§2.9)
└─ tools/                             # lint kuralları, bundle bütçe denetimi
```

| Bağımlılık kuralı | Denetim |
|---|---|
| `game-core` React, `react-dom`, `zustand` import edemez | ESLint `no-restricted-imports` |
| `screens/*` birbirini import edemez; ortak kod `features/` ya da `ui/` | `eslint-plugin-boundaries` |
| `editor` yalnızca `React.lazy` ile yüklenir | Bundle analizörü CI'da: ana chunk'ta `monaco-editor` görülürse derleme kırılır |
| Her ekran chunk'ı ≤ 60 KB gz (Monaco/Pixi hariç) | `size-limit` |

### 1.5 Durum yönetimi

| Durum türü | Sahibi | Kaynak | Kalıcılık | Örnek |
|---|---|---|---|---|
| Sunucu durumu | TanStack Query | REST `/v1` | Bellek + `staleTime` | cüzdan, ilerleme, ders paketi, Pazar rafları |
| İstemci/UI durumu | Zustand dilimleri | Kullanıcı eylemi | Ayarlar `localStorage` (try/catch) | açık panel, toast kuyruğu, ses seviyesi, düşük cihaz modu |
| Akış durumu | XState makineleri | Olay | Bellek; taslak IndexedDB | ders kart akışı, Kurul Kartı, İş Emri, Editör→Müfettiş→Savunma |
| Dünya durumu | `WorldStore` (React dışı) | SignalR delta | Bellek | varlık konumları, yürünebilir maske |
| Oturum | `session` dilimi | OTP doğrulama | Erişim anahtarı bellekte, yenileme anahtarı `HttpOnly` çerez (B7) | JWT |

Beş kural:

1. **Sunucu otoritesi.** Bayt, XP, Çip, test sonucu, Kurul puanı iyimser güncellenmez. `award()` sunucu yanıtındaki `{xp, bayt, cip, seviyeAtladi?}` ile çağrılır; yanıt gelene kadar düğme `aria-busy` olur.
2. **Dünya React'e girmez.** 40 avatar × 5 Hz toplu delta (B7 ADR-04) = 200 güncelleme/sn; bunlar `WorldStore`'a yazılır. React yalnızca türetilmiş dilimleri alır: `yakindakiEtkilesimler` (≤ 8 öğe, 4 Hz'e düşürülmüş), `secili` varlık, `hedefIsaretcisi`.
3. **Akışlar makinedir.** Her çok adımlı eylem (Kurul Kartı, Savunma, İş Emri) XState makinesidir; geçersiz durum (ör. "Müfettiş çalışırken Sıfırla") tasarım gereği ulaşılamazdır.
4. **Sorgu anahtarları ekran kimliğini taşır:** `['wallet']`, `['lesson', '1.1']`, `['business', id, 'vault']`. Ödül sonrası ilgili anahtarlar `invalidateQueries` ile tazelenir (cüzdan, ilerleme, görev kartı).
5. **Kalıcı olan az, açıkça yazılandır:** `localStorage`/IndexedDB her okuma-yazmada `try/catch` içindedir; erişilemezse (gizli pencere) uygulama bellekte çalışır ve Ayarlar'da tek satır uyarı gösterir.

### 1.6 Ağ katmanı

**REST.** Taban `/v1`; `Authorization: Bearer <JWT>` (erişim belirteci 15 dk ve bellekte; yenileme belirteci `HttpOnly` çerezde, B7 ADR-13); yanıtlar JSON ve `camelCase`'tir (istisna: Kurul kartı ile Challenge Spec kendi sahiplerinin alan adlarıyla gelir: `puan`, `olcutler`, `public_tests`…); hata gövdesi RFC 9457 `application/problem+json` (`code`, `requires{}`, `retryAfterSec`, `traceId`). Her istekte `X-Client-Version: web/<sürüm>` gider; para, XP, envanter ya da kuyruk işi üreten her `POST` için `Idempotency-Key` zorunludur (B7 §5.1). Zaman aşımı 10 sn (kod gönderme 20 sn, Kurul 15 sn). TypeScript tipleri `GET /v1/openapi.json`'dan üretilir; bilinmeyen alan ve bilinmeyen enum değeri **yok sayılır** (B7 sürümleme sözleşmesi).

| Kural | Değer |
|---|---|
| 401 `TOKEN_EXPIRED` | Tek uçuşlu (`single-flight`) `POST /v1/auth/tokens/refresh`, ardından isteği bir kez yeniden dene; yenileme reddedilirse "Oturumun doldu" modali → `giris` |
| GET yeniden deneme | 2 kez, 300 ms ve 900 ms + %25 jitter |
| Durum değiştiren istekler | Otomatik yeniden deneme yok; `Idempotency-Key` taşıyanlar ağ hatasında **aynı anahtarla** gönderilir (anahtar niyet başına, düğmeye basılışında bir kez üretilir); yanıt `Idempotent-Replayed: true` olabilir. `409 IDEMPOTENCY_IN_PROGRESS` → `Retry-After` kadar bekleyip aynı anahtarla yeniden sor |
| `429 RATE_LIMITED` | `Retry-After` kadar bekle; toast "Biraz yavaşla; {n} sn sonra tekrar dene." Kurul için günlük 30 etkileşim kotası 429 değil **erteleme**dir (`status: deferred_quota`) |
| `503 MAINTENANCE` | "KodKent bakımda. Birazdan döneceğiz." sayaçlı bakım ekranı; `SANDBOX_BUSY`: "Atölye şu an yoğun; birkaç sn sonra dene." |
| `426 CLIENT_OUTDATED` | Service worker güncellenir, "Yeni sürüm hazır." kartı; asgari sürüm `GET /v1/meta/client-config` |
| İstek iptali | Ekrandan çıkınca `AbortController`; Kurul isteği "Durdur" ile iptal edilir (istek sunucuda tamamlanır, kota harcanmış sayılır) |

**Hata kodu → arayüz** (B7 §5.2; metinler sunucudan gelir, istemci yalnızca biçimi seçer):

| `code` | HTTP | Arayüz davranışı |
|---|---|---|
| `INSUFFICIENT_FUNDS` | 402 | Satır içi: "300 B gerekiyor, cüzdanında 240 B var." (`requires.required/available`) + kasaya kısayol |
| `LEVEL_TOO_LOW`, `LICENCE_MISSING`, `LESSON_GATE` | 403 | "Bunun için Sev. {n} gerekiyor." kartı; `requires{}` eksikleri satır satır yazar |
| `DISTRICT_LOCKED` | 403 | "Liman: Çarşı Sınavı'ndan sonra açılıyor." + `touristModeAvailable` ise [Gezmeye gir] |
| `ATTEMPTS_EXHAUSTED`, `APPEAL_ALREADY_FILED` | 409 | Kurul Kartı'nda hak metni; Telafi Turu zamanı `requires.remediationAt` |
| `VAULT_EMPTY` | 409 | "Kasada henüz tam bir Bayt birikmedi." (toast, hata değil) |
| `SCENE_FULL`, `SCENE_LOCKED` | 409 | "Dolu — 20/20. Sahibine Alkış bırakabilirsin." (`applauseAllowed`); Savunma/Semt Sınavı sırasında sahne değişimi reddi |
| `CLARIFICATION_REQUIRED` | 409 | "Önce müşteriye en az 4 soru sor." (`requires.clarifications{need, have}`) |
| `VERSION_CONFLICT` | 412 | Oda: "Odanın düzeni başka bir cihazda değiştirildi. Yenileyip tekrar dene." |
| `PRICE_CHANGED`, `ALREADY_OWNED` | 409 | Pazar: yeniden onay kartı / "Bu eşyaya zaten sahipsin; Dolap'tan giyebilirsin." |
| `GUARDIAN_REQUIRED`, `AGE_TOO_LOW` | 403 | "Bu özellik için veli onayı bekleniyor." / Giriş ret kartı |
| `REAUTH_REQUIRED` | 401 | OTP yeniden doğrulama modali (hesap silme, telefon değiştirme, veri indirme) |
| `OTP_INVALID`, `OTP_EXPIRED`, `OTP_LOCKED`, `OTP_RESEND_TOO_SOON` | 422 / 410 / 423 / 429 | Giriş ekranı metinleri (kalan hak, süre) |
| `INTERNAL_ERROR` | 500 | "Bir şeyler ters gitti (kod: {traceId kısaltması})." + [Tekrar Dene] |

**SignalR (B7 §6).** Bir sahne ziyareti = bir WebSocket bağlantısıdır: istemci `POST /v1/world/scenes/{sceneKey}/join-tickets` ile shard ve 15 sn geçerli tek kullanımlık bir **bilet** alır (`hubUrl`, `ticket`, `walkableHash`, `sceneVersion`), `/hubs/world`'e bağlanır; kapıdan geçilince bağlantı kapanır, yenisi açılır (≈ 150 ms). Taşıma yalnızca WebSockets'tir (`skipNegotiation`; WebSocket'i engelleyen ağda "Bağlantı kurulamadı" kartı, yedek taşıma yok), keep-alive 15 sn, istemci zaman aşımı 45 sn, ileti protokolü başlangıçta JSON (10k DAU üstünde MessagePack; olay adları aynıdır). **SignalR'ın yerleşik otomatik yeniden bağlanması kullanılmaz** (bilet tek kullanımlıktır): kopmada istemci yeni bilet alıp yeniden bağlanır; bekleme 0, 1, 3, 7, 15, 30 sn. Kopma süresince avatar 30 sn "hayalet" kalır, dönen oyuncu aynı shard ve hücreye iner (B1 §11.4); `walkableHash` uyuşmazlığı `Resync` ya da sahne yeniden yüklemesini tetikler (B7 ADR-10). Sohbet ayrı hub'dır (`/hubs/chat`, `POST /v1/chat/connection-tickets` bileti; oturum boyunca tek bağlantı).

| Yön | Hub | Yöntem / olay (B7 §6.3) | Yük (özet) |
|---|---|---|---|
| İ→S | world | `MoveTo` | `{seq, gx, gy}`: yalnızca **hedef hücre**; yolu sunucu hesaplar; ≤ 4/sn; yanıt `move.ack` |
| İ→S | world | `Emote`, `Interact`, `Resync`, `Leave` | `{emoteId}`, `{targetId, kind: door\|npc\|kasa\|tabela\|bank}`, `{lastTick}` |
| S→İ | world | `scene.snapshot`, `scene.delta` (200 ms), `move.ack` | avatarlar, `moved[{id, path, t0, speed}]`, `emotes`, `joined`, `left`, `states` |
| S→İ | world | `scene.event`, `scene.transition`, `scene.closing`, `interaction.result` | `meydan_question` / `fountain` / `led`; kapı geçişi; shard birleştirme; kasa/tabela sonucu |
| S→İ | world | `user.xp`, `user.wallet`, `job.completed`, `quest.updated`, `notify.new`, `vault.full`, `presence.friend`, `session.refresh_required` | `user:{id}` grubuna özel sonuçlar |
| İ→S | chat | `Send`, `JoinChannel` / `LeaveChannel`, `MarkRead` | `{clientMsgId, channel: sahne\|oda\|dm, target, text}`; 1 mesaj/3 sn, ≤ 200 karakter, link yok |
| S→İ | chat | `chat.message`, `chat.ack`, `chat.rejected` (`RATE`, `LINK`, `FILTER`, `MUTED`, `PAR_REQUIRED`), `chat.removed`, `chat.muted` | — |

### 1.7 Kod editörü stratejisi

| Yüzey | Bileşen | Masaüstü | Dokunmatik |
|---|---|---|---|
| Derslik mini editör (1 satır düzenlenebilir) | `CodeEditor` | CodeMirror 6, yalnızca işaretli satır yazılabilir | Aynı |
| Atölye (Tamamlama, Sıfırdan, Hata Avı) | `CodeEditor` | Monaco | CodeMirror 6 + kod yardımcı çubuğu (§14.3) |
| Atölye (Sıralama / Parsons) | `ParsonsBoard` | Satır kartları; sürükle-bırak | Aynı + her kartta ↑ ↓ düğmeleri (WCAG 2.5.7) |
| İşletme Editörü | `CodeEditor` | Monaco | CodeMirror 6, **varsayılan salt okunur**; "Yine de burada yaz" anahtarı |
| Kurul Kartı (Hata Avı / Kod Yazma cevabı) | `CodeEditor` kısa mod | Monaco (min. yükseklik 160 px) | CodeMirror 6 |
| Savunma, Vitrin, Kurul alıntıları, sohbet | `CodeBlock` | Statik, satır numaralı, vurgulu satır; editör yüklenmez | Aynı |

```ts
// packages/editor — ortak sözleşme
export interface CodeEditorProps {
  value: string; onChange?: (v: string) => void;
  readOnly?: boolean | { editableLines: number[] };      // Derslik: tek satır
  markers?: { line: number; col: number; endCol?: number; message: string; severity: 'hata'|'uyari' }[];
  highlightLines?: number[];                              // Savunma: Kurul'un seçtiği satır
  profile: 'dersMini' | 'gorev' | 'isletme' | 'cevap';  // IntelliSense düzeyi sunucudan gelir
  ariaLabel: string;
}
export const monacoOptions = {
  language: 'csharp', theme: 'kodkent-night', fontFamily: 'JetBrains Mono, Consolas, monospace',
  fontSize: 14, lineHeight: 22, fontLigatures: false, minimap: { enabled: false },
  scrollBeyondLastLine: false, tabSize: 4, insertSpaces: true, wordWrap: 'off',
  bracketPairColorization: { enabled: true }, accessibilitySupport: 'auto',
  quickSuggestions: false,           // 'gorev' ve 'isletme' profillerinde ders bağlamına göre açılır
  ariaLabel: 'C# kod editörü. Odağı editörden çıkarmak için Ctrl+M, sonra Tab.',
} as const;
```

Derleme hataları tarayıcıda canlı üretilmez (Roslyn sunucudadır, KANON §9); "Derle/Çalıştır" yanıtındaki `{kod, satir, sutun, mesaj_tr}` kayıtları `markers`'a çevrilir. Kod girişine **akıllı tırnak normalizasyonu** uygulanır: `beforeinput` aşamasında `“ ” ‘ ’` karakterleri `" '` olur (iOS/Android akıllı noktalama ve mesajlaşma uygulamalarından yapıştırma).

### 1.8 PWA ve i18n (özet)

Service worker, manifest, çevrimdışı matrisi ve güncelleme akışı **§15**'te; sayı/para/tarih biçimleri, çoğul ve Türkçe ek kuralları **§13**'te. İki bölümün ortak kararı: uygulama dili yalnızca `tr-TR`'dır (Dil Seçimi ekranındaki "dil" programlama dilidir, arayüz dili değildir); ancak tüm metinler katalogdan okunur, böylece ileride arayüz dili eklemek kod değişikliği değil, katalog ekleme olur.

---

## 2. Render motoru

B1 §1 izometrik temeli (2:1, 64×32 px, kat 48 px, avatar 96 px, `toScreen`/`toGrid`/`depthKey`, 10 katmanlı sahne, 16×16 chunk, 2048² atlas) **tek kaynaktır**; bu bölüm onu PixiJS 8 üzerinde nasıl gerçekleyeceğimizi, bütçeleri ve boru hattını tanımlar.

### 2.1 Sahne yaşam döngüsü ve yükleme

```ts
await app.init({ canvas, resizeTo: window, resolution: Math.min(devicePixelRatio, lowMode ? 1 : 2),
  autoDensity: true, antialias: false, preference: 'webgl', powerPreference: 'low-power', roundPixels: true });
app.ticker.maxFPS = lowMode ? 24 : (isTouchDevice ? 30 : 60);
```

| Aşama | Ne olur | Süre bütçesi (orta mobil, 4G) |
|---|---|---|
| `idle` → `loadingManifest` | `join-tickets` yanıtı + `scenes/{sceneKey}.kkmap.json` (başlık + atlas listesi) çekilir | ≤ 300 ms |
| `loadingAssets` | Eksik atlaslar `CacheFirst` ile yüklenir; ilerleme çubuğu "Şehir hazırlanıyor… %N" | ≤ 3 sn (ilk yükleme ≤ 3,5 MB) |
| `building` | Harita çözülür, chunk `RenderGroup`'ları kurulur, yürünebilir maske hazırlanır | ≤ 250 ms |
| `ready` → `running` | `scene.ready` köprü olayı; HUD yerleşir; bilet ile hub'a bağlanılır; `scene.snapshot` gelince varlıklar belirir | ≤ 400 ms |
| `leaving` → `disposed` | Çıkış tween'i (≤ 1 sn); kullanılmayan atlaslar 60 sn sonra bırakılır (LRU) | — |

Sahne anahtarları B7 §6.4 ile aynıdır: `meydan`, `akademi-lobi`, `kursu-{districtSlug}`, `akademi-atolye`, `pazar`, `cadde-{districtSlug}`, `sokak-{streetId}`, `isletme-{businessId}`, `oda-{roomId}`, `blok-sokagi`. Sahneye girerken bağlantı bileti (`join-tickets`) ile gelen `sceneVersion` ve `walkableHash`, indirilen harita sürümüyle karşılaştırılır; uyuşmazlıkta harita yeniden alınır. Hedef semtin atlası, avatar kapı plakasına **8 tile** yaklaşınca önyüklenir (B1 §1.5); geçiş semt renginden semt rengine yumuşak bir çapraz solmadır, siyah ekran yoktur. Giriş→Meydan yolunda Pixi parçası OTP adımı sürerken boşta (`requestIdleCallback`) önyüklenir; böylece "ilk Bayt ≤ 20. dakika" hedefinde ağ beklemesi sahneye düşmez.

### 2.2 Tilemap

Haritalar Tiled'da (izometrik, 64×32) çizilir ve derleme sırasında ikili `.kkmap` biçimine çevrilir.

| Katman (B1 §1.3) | Depolama | Not |
|---|---|---|
| `zemin` | `u8` tileId, W×H | Ortak 24 + semt başına 16 tile türü (B1 §13) |
| `dekor` | `u16` id + bayrak (aynalama), W×H | Yol çizgisi, rögar, halı, ayak izi |
| `yurunebilir` | bitset, W×H/8 bayt | A* ve tıklama yapışması bunu okur |
| `nesneler` | liste: `{id, tur, gx, gy, gz, w, h, sprite, bagli: [..]}` | Bina parçaları, eşya, NPC doğma noktaları |
| `etkilesim` | liste: `{id, tur, approachCell, hitPoly, etiket, hedef}` | Kapı, tabela, kasa, "KODLA!" oku; hedefi ekran kimliği ya da sahne kimliği |
| `isik` | liste: `{gx, gy, renk, yaricap, faz}` | Gece fazında `ADD` blend; mobilde en çok 24 (B1 §9.1) |

Zemin ve dekor 16×16'lık **chunk** konteynerlerinde (`isRenderGroup: true`) tutulur: kamera yalnızca grubun dönüşümünü değiştirir, tile sprite'larının tek tek dönüşümü her kare hesaplanmaz. Görünüm alanı + 2 tile dışındaki chunk'lar `cullable` ile çizilmez. Chunk'lar `RenderTexture`'a pişirilmez (2× kaynakta chunk başına ≈ 8 MB doku ederdi); doğrudan atlas sprite'ı olarak batch'lenir. Sahne başına en çok 4.096 tile (B1 §1.4).

### 2.3 Sprite atlas

| Atlas | Boyut | İçerik | Tahmini indirme (KTX2 UASTC+zstd)* | İlk yükleme |
|---|---|---|---|---|
| `world-common` | 2048² | Ortak 24 zemin tile'ı, araçlar, tramvay, ortak dekor | 0,55 MB | ✓ |
| `meydan-a` / `meydan-b` | 2048² × 2 | Çeşme, Pazar cephesi, Liderlik Panosu, Belediye Köşkü | 1,05 MB | ✓ |
| `akademi-lobi` | 2048² | Rotonda, 7 Kürsü kapısı, Danışma, Mühür Duvarı | 0,60 MB | ✓ (yakınlaşmada) |
| `avatar-base` | 2048² | 3 vücut × yön × kare, yüz parçaları, saç (16 model) | 0,70 MB | ✓ |
| `npc` | 1024² | Defne, Hasan Abi, Müfettiş, Nuran, figüranlar | 0,20 MB | ✓ |
| `ui-world` | 1024² | Balon dokuları, "!" ve "?" işaretleri, kasa kademeleri, KODLA! oku | 0,10 MB | ✓ |
| `fx` | 512² | Konfeti, kıvılcım, su, martı, havai fişek | 0,10 MB | ✓ |
| `semt-{slug}-a/b` | 2048² × 2 | Semtin binaları, NPC dükkânları, dekoru | 1,0–1,4 MB | semt girişinde |
| `avatar-patch-{n}` | 512² | Sahip olunan/görünen kıyafet parçaları (isteğe bağlı yükleme) | 0,08–0,15 MB | oyuncu gelince |

İlk yükleme toplamı ≈ **3,3 MB** (B1 §1.5 bütçesi ≤ 3,5 MB). \* Tahminlerdir; H2'de gerçek sanatla ölçülür. Sıkıştırma kararı: tarayıcı KTX2 (Basis Universal; BC7/ASTC/ETC2'ye çevrilir) destekliyorsa **UASTC** kullanılır (ETC1S piksel sanatının sert kenarlarında bozulma verir) — GPU belleğinde doku 4× küçük kalır (2048² = 4 MB, RGBA8 olsa 16 MB); desteklemiyorsa kayıpsız WebP → RGBA8. Atlas `scaleMode: linear` + mipmap'tir (2× kaynak 0,5× ölçekle gösterilir; B1 §1.1).

### 2.4 Z-sıralama

```ts
export const depthKey = (gx: number, gy: number, gz = 0, w = 1, h = 1) =>
  (gx + w - 1) + (gy + h - 1) + gz * 0.001;                      // B1 §1.2, tek kaynak
const BIAS = { dekor: 0, golge: 0.1, nesne: 0.2, avatar: 0.3, havada: 0.4 } as const;
view.zIndex = Math.round((key + BIAS[kat]) * 1000) * 1000 + (hash32(id) % 997); // sabit eşitlik bozucu
```

| Kural | Açıklama |
|---|---|
| Ayak izi | Nesne, kameraya en yakın hücresinin köşegen toplamıyla sıralanır (B1 formülü) |
| Çok hücreli nesneler | Binalar 1 tile'lık parçalardan oluşur (duvar, çatı, tabela, ek); her parçanın kendi anahtarı vardır; bu, avatarın geniş bir binanın yanından geçerken yanlış katmana düşmesini önler |
| Hareketli varlıklar | Avatar sürekli konumla `(fx + fy)` anahtarlanır; hücre değiştirirken zIndex yalnızca hücre sınırı geçilince güncellenir |
| Çok hücreli hareketli nesne | Araba 2×1, mobilya 2×2: dinamik katmanda (≤ 80 öğe) iki aşamalı sıralama — anahtar sıralaması, ardından ekran-AABB örtüşen çiftlerde "öndeki hangisi" testi (topolojik); döngü çıkarsa anahtara düşülür |
| Yeniden sıralama | Olay güdümlü: yalnızca bir üyenin anahtarı değişince `sortChildren()`; hareketsiz sahnede sıralama maliyeti 0 |
| Dünya UI (katman 8) | Sahne derinliğinden bağımsız ekran uzayı; isim etiketi çakışmasında en yakın olan öne gelir, 12 px dikey ofset ile iterek çözülür |

### 2.5 Yol bulma ve yürüme süresi (600 ms kuralı)

**Sunucu otoriterdir** (B7 §6.5): istemci yalnızca hedef hücreyi bildirir (`MoveTo {seq, gx, gy}`); yolu sunucu **4 komşulu A\*** ile, aynı `walkable` bit kümesiyle hesaplar (yol ≤ 60 tile, hız 4 tile/sn, hız sınırı 4 `MoveTo`/sn) ve `move.ack {seq, accepted, path?, reason?}` ile yanıtlar. İstemci bekleme hissini yok etmek için **aynı algoritmayla yerel tahmin** yapar: A\* dört komşuludur (çapraz adım yok), sezgisel Manhattan, ikili yığın, sahne başına en çok 3.072 hücre (64×48) olduğundan tipik çalışma < 1 ms. Tıklanan hücre yürünebilir değilse en yakın yürünebilir hücreye yapışılır (dokunmada 6 px tolerans, B1 §1.2). Avatar hücre merkezlerinden yürür; ekranda hareket iki izometrik köşegen boyunca olur ve sprite yönü SE/SW/NE/NW'ye oturur. Sunucunun yolu yerel tahminden farklıysa (`move.ack.path`), avatar bulunduğu hücreden sunucu yoluna ≤ 200 ms'de geçer. B1 §7.1'in "8 yönlü serbest hareket" ifadesi B7'nin 4 komşulu yolu ile çeliştiğinden istemci B7'yi izler (Açık Soru 3).

**600 ms kuralı.** `yürümeSüresi = max(600 ms, yolUzunluğu / 4 tile·sn⁻¹)`. Gerekçe: yürüme döngüsü 8 kare × 12 fps = 667 ms'dir; bir döngüden kısa hareket "kayma" gibi görünür. Bu yüzden 2,4 tile'dan kısa yollar 600 ms'ye uzatılır (ease-in-out); daha uzun yollar sabit hızla (doğrusal) yürünür, son adım 100 ms yavaşlar. Sunucu `t0`'ı kendi saatinden koyar ve yol hızı 4 tile/sn'dir; 600 ms'lik alt sınır yalnızca **çizimi** uzatır (kendi avatarında bir sonraki `MoveTo` o anda gelmişse kısa tween kesilir). Prototip SVG sahnesi küçük olduğundan her yürüme **tek 600 ms tween**'dir; kural iki ortamı tek formülle birleştirir.

| Olay | İstemci davranışı |
|---|---|
| Zemine tıklama | Hedef hücre beyaz elmas; noktalı yol 1 sn görünür; yerel tahminle hemen yürümeye başlar; `MoveTo {seq, gx, gy}` gönderilir |
| Etkileşimli nesneye tıklama | `approachCell`'e yürür; varınca `Interact {targetId, kind}` gönderilir (sunucu 2 tile menzilini denetler); mobilde ilk dokunuş adı gösterir, ikincisi girer (B1 §10.1) |
| `move.ack {accepted: false}` | 200 ms'lik yumuşak geri çekilme + toast "Oraya gidemezsin." (`reason` gösterilmez) |
| Yol > 60 tile / hedef başka sahnede | "Çok uzak. Tramvayla gitmek ister misin?" kartı (B1 §10.3) |
| Uzak avatar | Sunucu saat farkı (`serverTime`) ilk üç `scene.delta`'dan kestirilir; uzak avatarlar **200 ms geride** (1 tick tampon) çizilir; avatarın `t` anındaki hücresi `path[min(len−1, ⌊speed × (t − t0)/1000⌋)]`'dir, hücreler arası piksel ara değerlemesi istemcidedir; yeni yol gelince geçerli konumdan yeniden başlar |
| Klavye (oklar / isteğe bağlı WASD) | Her basış tek hücre `MoveTo` üretir (4/sn sınırına uyar); basılı tutunca tekrar; 600 ms kuralı adım başına uygulanmaz |

### 2.6 Kamera

| Parametre | Değer |
|---|---|
| Zoom kademeleri | Masaüstü 0,75 / 1,0 / 1,5 (tekerlek; kademeli, 160 ms tween); mobil 1,0 / 1,5 (iki parmak, en yakın kademeye yapışır) |
| Takip | Avatara `lerp`: `1 − exp(−dt × 8)`; merkez etrafında 96×64 px ölü bölge; sahne sınırından 64 px içeride kıstırılır |
| Piksel yapışması | Kamera konumu cihaz pikseline yuvarlanır (`roundPixels`), yarım piksel titremesi olmaz |
| Elle gezinme | Masaüstü: orta tuş / sağ tuş sürükle; mobil: tek parmak sürükle (avatar takibi 3 sn askıya alınır) |
| Odak komutları | `camera.focus(entityId, 800 ms)`: Açılış'ta işletmeye, Meydan Sorusu'nda çeşmeye; `prefers-reduced-motion`'da anında geçer |
| Sarsıntı | **Yok** (vestibüler hassasiyet); yerine 120 ms'lik renk parlaması |
| Gökyüzü | Katman 0 paralaks 0,2 (B1) |

### 2.7 Performans bütçeleri

| Metrik | Masaüstü | Orta mobil (4 GB) | Düşük cihaz modu |
|---|---|---|---|
| Hedef kare hızı | 60 fps | 30 fps | 24 fps (taban 20) |
| Kare süresi p95 | ≤ 16,7 ms | ≤ 33 ms | ≤ 45 ms |
| Draw call / kare (Meydan, 40 avatar) | ≤ 40 | ≤ 32 | ≤ 20 |
| Görünür sprite | ≤ 1.800 | ≤ 1.100 | ≤ 600 |
| `LOD_FULL_MAX` (tam çizilen avatar) | 24 (B1) | 16 (B8 önerisi) | 8 (B8 önerisi) |
| Parçacık | ≤ 300 | ≤ 120 | 0 |
| Işık sprite'ı | ≤ 48 | ≤ 24 (B1) | 0 (sabit overlay) |
| GPU doku belleği | ≤ 128 MB | ≤ 80 MB | ≤ 48 MB |
| JS yığını (heap) | ≤ 180 MB | ≤ 140 MB | ≤ 100 MB |
| Dünya trafiği (40 avatar, zirve; sunucu 5 Hz toplu delta) | ≤ 6 KB/sn | ≤ 6 KB/sn | ≤ 3 KB/sn (uzak avatar güncellemeleri istemcide seyreltilir) |

| İlk yükleme bütçesi | Değer |
|---|---|
| Giriş ekranı JS (kabuk; gzip) | ≤ 230 KB (B8 önerisi): React, router, Zustand, Query, FormatJS çekirdeği, tasarım sistemi |
| PixiJS parçası (gzip) | ≤ 180 KB, OTP sırasında önyüklenir |
| Monaco parçası (gzip) | ≤ 650 KB; yalnızca masaüstünde, Ders 1.1 başlayınca boşta önyüklenir |
| Meydan varlıkları | ≤ 3,5 MB sıkıştırılmış (B1 §1.5) |
| LCP (Giriş, 4G, orta mobil) | ≤ 2,5 sn |
| Meydan "oynanabilir" (kimlik doğrulandıktan sonra) | ≤ 6 sn (4G, orta mobil), ≤ 2 sn (tekrar ziyaret, önbellekli) |
| INP p75 | ≤ 200 ms |

Bütçeler CI'da `size-limit` (JS), `bundlewatch` (varlık manifesti) ve Playwright + Chrome DevTools izi (kare süresi, draw call) ile denetlenir; aşım derlemeyi kırar. Sekme gizlenince `ticker.stop()`, dünya kalp atışı 15 sn'den 60 sn'ye iner.

### 2.8 Düşük cihaz modu

**Tetikleyiciler.** (1) `navigator.deviceMemory ≤ 2` ya da `hardwareConcurrency ≤ 4` (destekleniyorsa); (2) ilk 10 sn'de kare süresi p75 > 40 ms ise toast: "Oyun yavaş çalışıyor. Düşük cihaz modunu açalım mı?" [Aç] [Şimdi değil]; (3) Ayarlar > Ses ve Görüntü > "Düşük cihaz modu" anahtarı. Veri tasarrufu (`navigator.connection.saveData`) açıksa varlık indirme kuralları (aşağıda) uygulanır, görsel mod değişmez.

| Alan | Normal | Düşük cihaz modu |
|---|---|---|
| Çözünürlük | `min(DPR, 2)` | 1 |
| Kare hızı tavanı | 60 / 30 | 24 |
| Sprite animasyonu | 12 fps | 8 fps |
| Parçacıklar, konfeti, havai fişek | Açık | Kapalı; Açılış'ta tek kare "ışık patlaması" |
| Gece ışık katmanı | `ADD` sprite'ları | Tek düz renk overlay |
| Gölgeler | Elips sprite | Kapalı (avatar ayağında 2 piksel koyu nokta) |
| Evcil hayvan, figüran NPC | Çizilir | Kapalı |
| Dünya UI | Bitmap yazı, tüm etiketler | Yalnızca arkadaş etiketleri; balonlar en çok 6 |
| Ses | Kullanıcı seçimi | Müzik kapalı (efektler açık kalabilir) |
| Veri | Tüm atlaslar | `avatar-patch` yalnızca yakındaki 8 oyuncu için; 2× atlas yerine 1× atlas varyantı (yarı boyut) |

### 2.9 Asset pipeline (kaynak → atlas → CDN)

| # | Adım | Araç | Çıktı / kural |
|---|---|---|---|
| 1 | Kaynak sanat | Aseprite (`.aseprite`), 2× tuval (tile 128×64), paletli | `packages/assets/src/{semt}/…`; renk paleti B1 §1.6 (ortak 32 + semt başına 24) |
| 2 | Dışa aktarım | Aseprite CLI | PNG kareleri + etiketli animasyon JSON'u |
| 3 | Palet denetimi | `kk-palette-lint` (Node) | Paletin dışında piksel varsa derleme kırılır |
| 4 | Paketleme | `kk-atlas` (Node, `sharp` + MaxRects) | 2048² sınırı; kırpılmış kareler + ofset; ayak merkezi çapası (0,5; 1,0) |
| 5 | Sıkıştırma | `toktx` / `basisu` (UASTC + zstd) ve `cwebp -lossless` | `.ktx2` + `.webp` yedek |
| 6 | Manifest | `kk-manifest` | `manifest.json`: dosya → SHA-256 (ilk 8 hane adın parçası), bayt, bağımlı sahneler |
| 7 | Yayın | CI → nesne depolama + CDN | `Cache-Control: public, max-age=31536000, immutable`; manifest `no-cache` |
| 8 | İstemci | AssetLoader | Manifest açılışta alınır; hash değişen dosya yeniden iner; `Cache Storage`'da LRU (en çok 150 MB) |

Ad şeması: `world/{sahne}/{atlas}.{hash8}.ktx2`, ör. `world/carsi/semt-carsi-a.3f9c1e07.ktx2`. Manifest örneği:

```json
{ "v": 14, "atlaslar": {
    "world-common":  { "ktx2": "world/common/world-common.a1b2c3d4.ktx2", "webp": "world/common/world-common.a1b2c3d4.webp", "bayt": 576512 },
    "semt-carsi-a":  { "ktx2": "world/carsi/semt-carsi-a.3f9c1e07.ktx2", "bayt": 702112, "sahneler": ["cadde-carsi","sokak-*"] } } }
```

---

## 3. Görsel stil

Marka yönü (brief §0): **İznik çinisi** paleti; oyun arayüzü yuvarlak hatlı, tombul, neşeli bir **gece şehri** HUD'udur ve tek temalıdır (açık tema yok; `color-scheme: dark`). Belgelerin açık/koyu iki temalı sayfa tokenları ile oyunun gece tokenları aynı renk ailesindendir; koyu tema değerleri birebir aynıdır (`#0D1326`, `#151D36`, `#1D2746`, `#26325A`, `#E8EDF8`, `#C5CEE4`, `#9AA7C7`), böylece Ekranlar sayfasındaki mockup'lar ile prototip aynı token dosyasını paylaşır. Düğmeler "kalın alt kenar" ile (4 px koyu alt gölge) basılabilir görünür; kartlar 14–22 px yarıçaplıdır; her kutuya aynı yarıçap/gölge verilmez (brief yasağı): düğme 14, kart 22, çip/rozet tam yuvarlak, girdi 10.

### 3.1 Palet

**Altı İznik rengi** (her biri 300/500/600–700 basamak; metin rengi kontrastı hesaplanmıştır):

| Renk | Rol | 300 | 500 | 600 / 700 | Üstündeki yazı |
|---|---|---|---|---|---|
| **Turkuaz** | Ana vurgu, birincil düğme, odak halkası, Çip | `#5FE0E3` | `#22C9CE` | `#0FA3A8` / `#0A7B80` | 500 üstünde `#0A1024` (9,27:1) |
| **Kobalt** | XP, bağlantı, bilgi, Şık nadirliği | `#A9BCFF` | `#7D9BFF` | `#3F6FE0` / `#2448B5` | 500 üstünde `#0A1024` (7,20:1); 700 üstünde beyaz (7,87:1) |
| **Mercan** | Hata, tehlike, enerji | `#FFA394` | `#FF7A66` | `#E8553E` / `#B93E2A` | 500 üstünde `#0A1024` (7,40:1); beyaz yalnızca 700 üstünde (5,55:1). Beyaz / 600 = 3,62:1 **yasak** |
| **Amber** | Bayt, uyarı, Deneme | `#FFD27A` | `#FFBE3D` | `#D98E00` / `#9A6300` | 500 üstünde `#0A1024` (11,40:1) |
| **Nane** | Başarı, test geçti, Açık | `#7FE8B3` | `#45D98D` | `#1E9E5F` / `#157746` | 500 üstünde `#0A1024` (10,39:1) |
| **Mor** | C# kod vurgusu, Nadir nadirliği | `#BDB0FF` | `#9B86FF` | `#6D4AFF` / `#4E31CC` | 500 üstünde `#0A1024` (6,51:1); 600 üstünde beyaz (5,15:1) |

**Gece nötr rampası:**

| Token | Hex | Kullanım |
|---|---|---|
| `night-950` | `#0A1024` | Kod zemini koyu ucu, düğme yazısı |
| `night-900` | `#0D1326` | Uygulama zemini |
| `night-800` | `#151D36` | Kart/panel yüzeyi |
| `night-700` | `#1D2746` | İkinci yüzey, girdi zemini |
| `night-600` | `#26325A` | Üçüncü yüzey, seçili satır |
| `line` / `line-2` | `#2A3558` / `#36446E` | **Yalnızca süs** çizgisi (1,39:1 / 1,75:1) |
| `control-border` | `#8A97B8` | Girdi, düğme, onay kutusu kenarlığı (5,71:1; WCAG 1.4.11) |
| `fg` / `fg-2` / `muted` | `#E8EDF8` / `#C5CEE4` / `#9AA7C7` | Metin (14,20:1 / 10,57:1 / 6,92:1, `night-800` üzerinde) |
| `code-bg` / `code-fg` | `#0F1730` / `#E6ECFF` | Editör ve CodeBlock (15,02:1) |

**Anlamsal eşleme:** başarı/geçti = nane, uyarı/Deneme = amber, hata/başarısız = mercan, bilgi/bağlantı = kobalt, odak = turkuaz (`#22C9CE` zemin üstünde 9,06:1), Bayt = amber, Çip = turkuaz, XP = kobalt, Nişan = altın `#E5B84B` (8,95:1). Beş sayaç beş farklı ton ailesidir; renk körlüğünde de sayaç **ikonlarıyla** ayrılır (§12.5).

**Kod sözdizimi renkleri** (`code-bg` üzerinde, hepsi ≥ 5,25:1): anahtar sözcük `#BDB0FF` (9,12), tür `#5FE0E3` (11,18), dize `#FFD27A` (12,44), sayı `#7FE8B3` (11,89), metot `#A9BCFF` (9,55), yorum `#8794B8` (5,87), hata alt çizgisi `#FFA394` (9,21), işleç/ad `#E6ECFF` (15,02).

### 3.2 Tipografi

Yazı tipleri kendi CDN'imizden (woff2, latin + latin-ext alt kümesi) sunulur; Google Fonts'a istek gitmez (KVKK ve performans). Fredoka 600 ve Nunito 400/700 `preload` edilir; hepsi `font-display: swap`. Üçü de Türkçe karakter setini (ğ ü ş ı ö ç İ) tam taşır; büyük harf dönüşümü `lang="tr"` ile (`text-transform: uppercase` → "İ") yapılır.

| Token | Yazı tipi | Masaüstü | Mobil | Ağırlık | Kullanım |
|---|---|---|---|---|---|
| `display` | Fredoka | 40/44 | 32/36 | 700 | Giriş başlığı, Açılış kutlaması |
| `h1` | Fredoka | 28/32 | 24/28 | 600 | Ekran/panel başlığı |
| `h2` | Fredoka | 22/26 | 20/24 | 600 | Kart başlığı |
| `hud-num` | Fredoka | 20/24 | 18/22 | 600 | Bayt, Çip, XP sayıları, "Sev. 3" |
| `hud-lbl` | Nunito | 14/16 | 14/16 | 700 | HUD etiketi, rozet metni (HUD'da en küçük boyut 14 px, B1) |
| `body` | Nunito | 16/24 | 16/24 | 400, 600 | Ders kartı, diyalog (≤ 60 kelime kart) |
| `body-sm` | Nunito | 14/20 | 14/20 | 400, 600 | İkincil metin, tablo hücresi |
| `caption` | Nunito | 12/16 | 12/16 | 600 | **Yalnızca dünya içi** isim etiketi / balon (B1 §1.5: 12 px) |
| `code` | JetBrains Mono | 14/22 | 13/20 | 400, 600 | Editör, CodeBlock |
| `code-sm` | JetBrains Mono | 12/18 | 12/18 | 400 | Test listesinde girdi/beklenen |
| `tabela-8` | "KodKent Tabela" (8 px piksel yazı tipi, yalnızca büyük harf, Ğ Ş İ dâhil) | 8 × tam sayı katı | — | — | Dünya içi tabelalar (B1 §1.6) |
| `led-5x7` | Nokta matris (5×7) | LED pano | — | — | Akademi cephesi LED panosu |

Sayaçlar Fredoka ile yazılır; sayı genişliği değişince yerleşim titremesin diye sayaç kutusu `min-width: 6ch` ve sağa yaslıdır (`font-variant-numeric: tabular-nums` destekleniyorsa ayrıca açık). Dünya içi isim etiketleri ve balon metni çalışma anında DOM değil, **önceden pişirilmiş BitmapText** ile çizilir (Nunito 12 px, Türkçe karakter seti dâhil).

### 3.3 İkonografi

Stil: 24 px ızgara, 2 px çizgi, yuvarlak uç/birleşim, köşe yarıçapı 3, tek renk (`currentColor`) + %20 dolgulu ikinci ton. Anlamsal ikonlar sabit renk taşır (Bayt amber, Çip turkuaz, XP kobalt). Her ikon ya görünür bir metinle ya da `aria-label` ile birlikte kullanılır; yalnız renkle anlam taşımaz.

| # | Ad | Anlam | Kullanıldığı yer | Çizim tarifi |
|---|---|---|---|---|
| 1 | `bayt` | Bayt (madeni para) | Cüzdan, ödül, fiyat | Daire; içinde iki yatay çizgi; amber |
| 2 | `cip` | Çip (premium para) | Çip sayacı, Butik fiyatı | Yuvarlak köşeli kare gövde, her kenarda 3 pin, ortada küçük kare çekirdek; turkuaz |
| 3 | `xp` | Deneyim puanı | XP çubuğu, "+25 XP" | Yuvarlak uçlu 5 köşeli yıldız; kobalt |
| 4 | `seviye` | Seviye atladın | Seviye atlama modali | Çift yukarı şevron, altında kısa çizgi |
| 5 | `kilit` | Kilitli (ders, semt, kapı) | Kilitli kartlar | Asma kilit; hiçbir yerde fiyat taşımaz |
| 6 | `kasa` | İşletme kasası | Kasa göstergesi, panel | Gişe kutusu, üstte yuva, yanda kol |
| 7 | `test-gecti` | Test geçti | TestList satırı | Daire içinde onay işareti; nane |
| 8 | `test-kaldi` | Test kaldı | TestList satırı | Daire içinde çarpı; mercan |
| 9 | `test-hata` | Derleme/çalışma hatası | TestList, hata paneli | Üçgen içinde ünlem; amber |
| 10 | `test-bekliyor` | Henüz çalışmadı | TestList | Boş daire, içinde saat ibresi; gri |
| 11 | `akademi` | Akademi | Dock, Lobi | Kubbeli bina + saat kulesi |
| 12 | `harita` | Şehir Haritası | Dock | Katlı harita + konum iğnesi |
| 13 | `isletmelerim` | İşletmelerim | Dock | Tabelalı dükkân cephesi |
| 14 | `gunluk-tekrar` | Günlük Tekrar | Dock, bildirim | Takvim yaprağı üstünde dairesel ok |
| 15 | `oda` | Oda / Evim | Dock | Kapılı ev silueti |
| 16 | `pazar` | Pazar | HUD sağ küme | Tenteli tezgâh |
| 17 | `butik` | Butik (Çip rafı) | Pazar sekmesi | Camekân + küçük çip |
| 18 | `liderlik` | Liderlik Panosu | HUD sağ küme | Kupa |
| 19 | `sohbet` | Sohbet | HUD sağ küme | Konuşma balonu + üç nokta |
| 20 | `ayarlar` | Ayarlar | HUD sağ küme | Dişli |
| 21 | `bildirim` | Bildirimler | HUD | Zil |
| 22 | `gorev` | Görev kartı | HUD | Bayrak taşıyan kart |
| 23 | `hedef` | Hedef çubuğu | HUD | Hedef tahtası + ok |
| 24 | `ipucu-pusula` | Pusula (hangi kavram) | İpucu merdiveni 1 | Pusula gülü |
| 25 | `ipucu-fener` | Fener (hangi satır) | İpucu merdiveni 2 | Gaz feneri |
| 26 | `ipucu-taslak` | Taslak (eksik satır) | İpucu merdiveni 3 | Kalem + noktalı satırlı kâğıt |
| 27 | `ipucu-ornek` | Örnek (benzer mini problem) | İpucu merdiveni 4 | İki yan yana kâğıt |
| 28 | `kurul-muhur` | Kurul mührü | Kurul Kartı | Dalgalı kenarlı balmumu mührü, ortada yıldız |
| 29 | `savunma` | Savunma | Savunma, panel | Kalkan içinde kod satırı |
| 30 | `mufettis` | Müfettiş | Müfettiş sekmesi, dosya | Fötr şapka + büyüteç |
| 31 | `metro` | Metro Haritası | Menü | İki durak ve bağlayan hat |
| 32 | `alkis` | Alkış | Sokak, Oda | İki el çırpma |
| 33 | `vitrin` | Vitrin | Panel, Profil | Çerçeveli ekran, içinde `</>` |
| 34 | `dolap` | Dolap | Menü | Elbise askısı |
| 35 | `emote` | Emote çarkı | HUD alt sağ | Gülen yüz + küçük balon |
| 36 | `ses-acik` / `ses-kapali` | Ses | HUD, Ayarlar | Hoparlör (+ dalga / + çarpı) |
| 37 | `cevrimdisi` | Çevrimdışı | Bant | Bulut üstünde çapraz çizgi |
| 38 | `calistir` | Çalıştır | Atölye, Editör | Oynat üçgeni |
| 39 | `sifirla` | Sıfırla | Atölye, Editör | Geri dönen ok |
| 40 | `kopyala` | Kopyala | Davet kodu, kod | İç içe iki kare |
| 41 | `itiraz` | İtiraz et | Kurul Kartı | Kalkık el |
| 42 | `nisan` | Nişan | Rozet Duvarı | Altın çerçeveli madalyon, ortada yıldız |

Usta portreleri (7) ve Hasan Abi/Müfettiş/Nuran bust çizimleri ikon değil **illüstrasyondur** (96×96, B1 §8 görünüşleri); `Avatar` ve `ChatBubble` bileşenleri bunları kullanır.

### 3.4 İzometrik tile ve sprite kuralları

| Kural | Değer |
|---|---|
| Tile | 64×32 px (zoom 1,0); kaynak 128×64; kenar "2 piksel sağa, 1 piksel aşağı" merdiveni |
| Kat / duvar | 48 px; duvar parçası 1 tile × 1 kat |
| Avatar | 96 px boy; omuz 40, baş 28 |
| Çapa | Nesne: ayak izinin ön köşe merkezi (0,5; 1,0). Zemin tile: elmasın merkezi (0,5; 0,5) |
| Işık | Kuzeybatıdan (sol üst); gölge sağ alta, 2 tonlu dither |
| Dış hat | Yok; iç hatlar nesnenin koyu tonu |
| Palet | Ortak 32 + semt başına 24 renk (B1 §1.6); palet dışı piksel CI'da hata |
| Animasyon | 12 fps (düşük cihaz 8); bekleme 2, yürüme 8, oturma 1, tuşlama 4, AFK 6 kare |
| Yön | 4 yön; SE ve NE çizilir, SW ve NW aynalanır; asimetrik nesneler 4 yön çizilir |
| Atlas kenarı | Her kareye 1 px kenar uzatma (mipmap sızıntısı için), 2 px boşluk |
| Adlandırma | `{tur}_{ad}_{yon}_{kare}`, ör. `avatar_orta_yuru_se_03`, `zemin_arnavut_01` |

Örnek tile SVG tarifleri (Ekranlar sayfası çizer; 64×32 kutuda, `fill` semt rengi):

```
Zemin elması      : M32 0 L64 16 L32 32 L0 16 Z
Sol duvar (1 kat) : M0 16 L32 32 L32 80 L0 64 Z        (yüz rengi: ana ton −%18 parlaklık)
Sağ duvar (1 kat) : M32 32 L64 16 L64 64 L32 80 Z      (yüz rengi: ana ton −%32 parlaklık)
Küp çatısı        : M0 16 L32 0 L64 16 L32 32 Z (y −48 kaydırılmış)  (yüz rengi: ana ton +%8)
Gölge             : elips, merkez (32,16), rx 22, ry 9, siyah %28
```

| Örnek tile | Semt | Ana renk | Detay |
|---|---|---|---|
| `zemin_arnavut` | Çarşı | `#A89F91` | Küçük taş dokusu, `#F4EFE6` derz |
| `zemin_beton` | Liman | `#9AA3A8` | `#2E6F95` su kenarı |
| `zemin_tugla` | Atölyeler | `#9C4A3C` | `#3B3B3F` is lekesi |
| `zemin_cim` | Kampüs | `#6FBF73` | `#F1E9D2` yaya yolu |
| `zemin_cam` | Finans | `#1F2A44` | `#35F0E0` neon çizgi |
| `zemin_ahsap` | Oda | `#8B6A4E` | Parke tahtaları |

### 3.5 Semt renk şemaları

Hex değerleri B1 §3'ten aynen alınmıştır; "UI hat rengi" B8'in Metro Haritası, semt rozeti ve kapı plakası için seçtiği tek renktir.

| Semt | B1 palet (vurgular) | UI hat rengi | Hat no | Hat rozeti yazı rengi | Müzik (B1) |
|---|---|---|---|---|---|
| Derleyici Meydanı | Taş bej `#D9C9A3`, çeşme mavisi `#4FA3D1`, akşam amberi `#F2B134`, LED kırmızısı `#FF3B30` | `#F2B134` | — | `#0A1024` | 100 BPM, elektronik + kanun |
| Çarşı | Tente kırmızısı `#C8453A`, krem `#F4EFE6`, turuncu `#E8912D`, zeytin `#7A8F4E`, arnavut grisi `#A89F91` | `#C8453A` | 1 | `#FFFFFF` (4,81:1) | 108 BPM, klarnet |
| Liman | Deniz `#2E6F95`, konteyner `#D9653B` / `#3C6E9F` / `#4E8F62`, pas `#8A5A3C`, beton `#9AA3A8` | `#2E6F95` | 2 | `#FFFFFF` (5,49:1) | 96 BPM, akordeon |
| Atölyeler | Tuğla `#9C4A3C`, is `#3B3B3F`, kıvılcım `#FFA33A`, çelik `#7D8A94`, önlük `#6B4F3A` | `#FFA33A` | 3 | `#0A1024` | 92 BPM, perküsyon |
| Kampüs | Çimen `#6FBF73`, tuğla `#B4654A`, krem taş `#F1E9D2`, defter mavisi `#3F6FB5`, sonbahar `#D98841` | `#6FBF73` | 4 | `#0A1024` | 104 BPM, akustik gitar |
| Finans Bölgesi | Cam `#5FA8D3`, lacivert `#1F2A44`, neon magenta `#FF4FD8`, neon cyan `#35F0E0`, altın `#E5B84B` | `#FF4FD8` | 5 | `#0A1024` | 120 BPM, synthwave |
| Veri Vadisi | Nehir turkuazı `#3FA7A1`, sunucu grisi `#5C6670`, LED mavisi `#4D8DFF`, çayır `#8CBF6B`, köprü `#A0714F` | `#3FA7A1` | 6 | `#0A1024` | 88 BPM, ambient + marimba |
| Bulut Tepesi | Bulut `#F7F9FC`, gök `#8FC5FF`, gün ışığı `#FFD37A`, gece moru `#5A4E9E`, anten `#C9D1D9` | `#8FC5FF` | 7 | `#0A1024` | 76 BPM, geniş pad |
| Bloklar | Nane `#BFE3D0`, şeftali `#F7C8B0`, lila `#D8C9EC`, kaldırım `#CFCBC2`, kapı `#8B6A4E` | `#BFE3D0` | — | `#0A1024` | 84 BPM, ukulele |

Metro Haritası'nda hatlar yalnız renkle değil **hat numarası** (daire içinde 1–7) ve durak şekliyle de ayrılır.

### 3.6 İşletme durum renkleri

Durum hiçbir zaman yalnız renkle anlatılmaz: her duruma şekil + kısa metin eşlik eder (B1 §1.6). Aynı rozet tabelada, işletme kartında, Şehir Haritası'nda ve Profil portföyünde kullanılır.

| Durum (KANON §8) | Renk | Şekil | Etiket | Sahne işareti (B1 §6) | Ses |
|---|---|---|---|---|---|
| **Satılık** | Kobalt `#7D9BFF` | Mavi "S" etiketi (yuvarlak kare) | SATILIK — Belediye | Eğri tabela, çim, kırık kaldırım taşı | — |
| **Kapalı — yazılım bekliyor** | Mercan `#FF7A66` + sarı-siyah bant (`#FFBE3D` / `#0A1024`) | Taralı daire (kırmızı çizgi) | KAPALI — yazılım bekliyor | İnşaat bandı, sarı "KODLA!" oku, boş bariyer yuvası | — |
| **Deneme** (%50 gelir) | Amber `#FFBE3D` | Yarım dolu daire | DENEME | Floresan titremesi, sarı bant | "bzzt" |
| **Açık** | Nane `#45D98D` | Dolu daire | AÇIK | Yanan ahşap tabela, kalkan bariyer | "tak" |
| **Kararmış** (kod bozuk) | Gri `#6B7794` | Çarpı (✕) | KARARMIŞ | Gri tabela, yarı açık bariyer, Müfettiş kapıda | "çat" |

Kasa doluluğu dört kademedir: boş (gri çerçeve), çeyrek (`amber-300`), yarım (`amber-500`), dolu (`amber-500` + zıplayan `bayt` ikonu ve "Kasa dolu" metni).

### 3.7 Token dosyası (özet)

```css
:root{
  color-scheme: dark;
  --kk-night-950:#0A1024; --kk-night-900:#0D1326; --kk-night-800:#151D36; --kk-night-700:#1D2746; --kk-night-600:#26325A;
  --kk-line:#2A3558; --kk-line-2:#36446E; --kk-control-border:#8A97B8;
  --kk-fg:#E8EDF8; --kk-fg-2:#C5CEE4; --kk-muted:#9AA7C7; --kk-code-bg:#0F1730; --kk-code-fg:#E6ECFF;
  --kk-turkuaz-300:#5FE0E3; --kk-turkuaz-500:#22C9CE; --kk-turkuaz-700:#0FA3A8;
  --kk-kobalt-300:#A9BCFF;  --kk-kobalt-500:#7D9BFF;  --kk-kobalt-700:#2448B5;
  --kk-mercan-300:#FFA394;  --kk-mercan-500:#FF7A66;  --kk-mercan-700:#B93E2A;
  --kk-amber-300:#FFD27A;   --kk-amber-500:#FFBE3D;   --kk-amber-700:#9A6300;
  --kk-nane-300:#7FE8B3;    --kk-nane-500:#45D98D;    --kk-nane-700:#157746;
  --kk-mor-300:#BDB0FF;     --kk-mor-500:#9B86FF;     --kk-mor-600:#6D4AFF;
  --kk-nisan:#E5B84B;       --kk-gri:#6B7794;
  --kk-r-input:10px; --kk-r-btn:14px; --kk-r-card:22px; --kk-r-pill:999px;
  --kk-btn-edge:4px;        /* kalın alt kenar */
  --kk-s-1:4px; --kk-s-2:8px; --kk-s-3:12px; --kk-s-4:16px; --kk-s-5:24px; --kk-s-6:32px;
  --kk-tap:48px;            /* varsayılan dokunmatik hedef (asgari 44) */
  --kk-ease-out:cubic-bezier(.22,1,.36,1); --kk-ease-pop:cubic-bezier(.34,1.56,.64,1); --kk-ease-inout:cubic-bezier(.65,0,.35,1);
  --kk-dur-1:100ms; --kk-dur-2:160ms; --kk-dur-3:240ms; --kk-dur-4:400ms; --kk-dur-5:800ms;
  --kk-font-display:"Fredoka","Segoe UI",system-ui,sans-serif;
  --kk-font-body:"Nunito","Segoe UI",system-ui,sans-serif;
  --kk-font-mono:"JetBrains Mono",Consolas,"Courier New",monospace;
}
```

---

## 4. Ekran kabuğu ve ortak kurallar

### 4.1 Ekran türleri, HUD modları ve rotalar

Üç ekran türü vardır: **tam ekran akış** (sahne ve HUD yok; kayıt/onboarding), **sahne ekranı** (PixiJS dünyası ya da çizilmiş harita; HUD üstünde) ve **panel ekranı** (React paneli; arkada sahne kararır ya da hiç yoktur). Panel açılırken masaüstünde 240 ms solma + %98→%100 ölçek, mobilde alttan 240 ms kayma; sahne %60 `night-950` ile kararır ve **duraklatılmaz** (tramvay geçmeye, pano akmaya devam eder; yalnızca tam ekran panellerde — İşletme Editörü, Profil, Ayarlar — `ticker` 15 fps'e düşer).

HUD modları: **tam** (tüm parçalar), **kompakt** (kimlik + Bayt/Çip; hedef çubuğu, görev kartı, dock, sohbet gizli), **odak** (yalnızca 4 px'lik XP çizgisi ve geri düğmesi; dikkat dağıtan hiçbir şey yok), **gizli** (Giriş akışı).

| # | Ekran (KANON §6) | Kimlik | Tür | HUD | Arka plan | MVP |
|---|---|---|---|---|---|---|
| 1 | Giriş | `giris` | Tam ekran akış | gizli | Yok (CSS animasyonlu gece şehri illüstrasyonu) | ✓ |
| 2 | Dil Seçimi | `dil-sec` | Tam ekran akış | gizli | Yok | ✓ |
| 3 | Avatar Atölyesi | `avatar` | Tam ekran akış | gizli | Mini sahne `avatar-studio` (yalnızca avatar + zemin) | ✓ |
| 4 | Derleyici Meydanı | `meydan` | Sahne | tam | `meydan` | ✓ |
| 5 | Şehir Haritası | `harita` | Sahne (2D çizim) | kompakt | Çizilmiş harita (WebP/SVG; Pixi yok) | ✓ |
| 6 | Akademi Lobisi | `akademi` | Sahne | tam | `akademi-lobi` | ✓ |
| 7 | Derslik | `derslik` | Panel | odak | `kursu-{semt}` karartılmış | ✓ |
| 8 | Kurul Kartı | `kurul` | Panel | odak | `kursu-{semt}` karartılmış | ✓ |
| 9 | Atölye | `atolye` | Panel | odak | `akademi-atolye` / Saha Atölyesi karartılmış | ✓ |
| 10 | İşletme Sokağı | `sokak` | Sahne | tam | `sokak-{streetId}` (parsel) | ✓ |
| 11 | İş Emri | `is-emri` | Panel | odak | Parsel karartılmış | ✓ |
| 12 | İşletme Editörü | `editor` | Panel (tam ekran) | odak | Yok; sahne 15 fps | ✓ |
| 13 | Savunma | `savunma` | Panel (tam ekran) | odak | Yok; sonuçta parsel sahnesi canlı | ✓ |
| 14 | İşletme Paneli | `panel` | Panel | kompakt | Karartılmış sahne | ✓ |
| 15 | Metro Haritası | `metro` | Panel | kompakt | Yok (SVG şema) | ✓ |
| 16 | Günlük Tekrar | `tekrar` | Panel | odak | `akademi-lobi` (Danışma kiosku) karartılmış | ✓ |
| 17 | Oda | `oda` | Sahne | tam (gezme) / kompakt (düzenleme) | `oda-{roomId}` | ✓ |
| 18 | Dolap | `dolap` | Panel | kompakt | Mini sahne `avatar-studio` | ✓ |
| 19 | Pazar | `pazar` | Panel | kompakt | Geçerli sahne karartılmış / `pazar` | ✓ |
| 20 | Vitrin | `vitrin` | Panel | kompakt | Parsel karartılmış | ✓ (salt okunur) |
| 21 | Profil & Rozet Duvarı | `profil` | Panel (tam ekran) | kompakt | Yok | ✓ |
| 22 | Liderlik Panosu | `liderlik` | Panel | kompakt | Meydan karartılmış | ✓ |
| 23 | Sohbet & Arkadaşlar | `sohbet` | Panel | kompakt | Geçerli sahne karartılmış | ✓ |
| 24 | Ayarlar & Hesap | `ayarlar` | Panel (tam ekran) | kompakt | Yok | ✓ |

Rota biçimi `#/{kimlik}?parametre=değer` (prototip `#kimlik` biçimini kullanır; üretim ikisini de aynı ekrana çözer):

| Ekran | Parametreler | Ekran | Parametreler |
|---|---|---|---|
| `derslik` | `ders=1.1&kart=3` | `panel` | `isletme={businessId}&sekme=gelir` |
| `kurul` | `ders=1.1&soru=2` | `vitrin` | `isletme={businessId}` |
| `atolye` | `gorev={taskId}` | `profil` | `oyuncu={playerId}` (yoksa kendi) |
| `sokak` | `isletme={businessId}` ya da `parsel={plotId}` | `liderlik` | `sekme=lig\|kalicilik\|hizli\|kazanc` |
| `is-emri`, `editor`, `savunma` | `isletme={businessId}` | `sohbet` | `kanal=meydan\|oda\|dm&kisi={playerId}` |
| `oda` | `oda={roomId}&mod=gez\|duzenle` | `pazar` | `raf=bayt\|butik\|rutbe&urun={itemId}` |
| `akademi` | `kursu={semtSlug}` | `ayarlar` | `bolum=genel\|bildirim\|ses\|erisim\|gizlilik\|veli\|diller\|hesap` |

**Korumalar.** Kimlik doğrulaması olmayan kullanıcı yalnızca `giris`i açar; `dil-sec` ve `avatar` ilk kayıtta sırayla zorunludur (`kurulumTamam` bayrağı sunucudadır). Seviye kapıları sunucu cevabından gelir (ör. Oda Sev. 2); kilitli yüzey 404 değil "Bunun için Sev. {n} gerekiyor." kartıdır. Kilitli semtler **turist modunda** açılır (B1 §2.5): HUD'da mavi "TURİST" bandı, arsa alma ve atölye görevleri kapalı.

### 4.2 Ortak durum metinleri

Ekran bölümlerinde yalnızca ekrana özgü metinler yazılıdır; aşağıdakiler her ekranda aynen geçerlidir.

| Durum | Metin | Eylem |
|---|---|---|
| Sahne yükleniyor | "Şehir hazırlanıyor… %{n}" + dönen ipucu: "Bir yere tıkla, avatarın yürür." | — |
| Panel yükleniyor | İskelet (shimmer 1,2 sn); 400 ms'den kısa sürerse hiç gösterilmez | — |
| Boş | "Burada henüz bir şey yok." | Bağlama göre |
| Hata (genel) | "Bir şeyler ters gitti. Birazdan tekrar dene." | [Tekrar Dene] |
| Hata (ağ) | "Sunucuya ulaşamadık." | [Tekrar Dene] |
| Çevrimdışı | "Çevrimdışısın. Bağlanınca kaldığın yerden devam edeceksin." | — |
| Yeniden bağlanıyor | "Yeniden bağlanıyor… ({n}/6)" | — |
| Oturum bitti | "Oturumun doldu. Yeniden giriş yapalım." | [Giriş Yap] |
| Seviye kapısı | "Bunun için Sev. {n} gerekiyor." | [Anladım] |
| AI kotası | "Kurul bugünlük kapandı, cevabın sırada." | [Tamam] |
| Bakım | "KodKent bakımda. Birazdan döneceğiz." | Geri sayım |
| Yeni sürüm | "Yeni sürüm hazır." | [Yenile] |
| Rate limit | "Çok hızlı gidiyorsun, birkaç saniye sonra tekrar dene." | — |

### 4.3 Klavye kısayolları

Kısayollar `event.code` ile (fiziksel tuş; Türkçe Q ve F klavyede aynı) tanımlanır; bir girdi/editör odaktayken devre dışıdır.

| Tuş | İşlev | Not |
|---|---|---|
| Ok tuşları | Yürü | WASD ile yürüme **Ayarlar > Erişilebilirlik**'ten açılır (varsayılan kapalı) |
| `M` / `H` / `A` | Şehir Haritası / Evim (Oda) / Akademi | B1 §10.3; WASD açıksa Akademi `Shift+A` olur (`A` tuşu çakışması, B8 önerisi) |
| `P` / `D` / `L` | Pazar / Dolap / Liderlik | — |
| `K` | İşletmelerim (kasa) | İlk tapudan sonra |
| `T` | Günlük Tekrar | — |
| `G` | Görev kartını aç/kapat | — |
| `C`, `Enter` | Sohbet satırına odaklan | `Esc` odağı sahneye geri verir |
| `E` | En yakın etkileşimi başlat | Erişilebilir Dünya Katmanı ile aynı hedef |
| `1`–`8` | Emote çarkı yuvaları | — |
| `F6` | Bölgeler arası gezinme (HUD → panel → sahne listesi) | WCAG 2.4.1 |
| `Esc` | Kapat / geri | Modal → panel → sahne sırası |
| `?` | Kısayol yardımı | Modal |
| `Ctrl+Enter` | Editörde testleri çalıştır | — |
| `Ctrl+M` | Monaco'da Tab'ın odağı taşıması aç/kapa | Klavye tuzağını önler (WCAG 2.1.2); editör alt çubuğunda ipucu yazar |

---

## 5. HUD spesifikasyonu

**Amaç.** HUD ekran değil, sahnenin üstündeki sabit katmandır (`hud`): oyuncunun kim olduğunu (ad, unvan, seviye), neyi olduğunu (XP, Bayt, Çip), ne yapacağını (görev kartı, hedef çubuğu) ve nereye gidebileceğini (dock, sağ küme) tek bakışta söyler. İlk 30 dakikada yalnızca XP çubuğu + Bayt cüzdanı + görev kartı görünür (VİZYON §4); öğeler aşağıdaki kademeli açılış tablosuna göre belirir.

Ölçüler CSS pikselidir; masaüstü çerçevesi 1280×800, mobil 390×844'tür; kenar boşluğu masaüstünde 16, mobilde 8 px; gerçek cihazda `env(safe-area-inset-*)` eklenir.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Sahne (zemin) | 0,0,1280,800 | 0,0,390,844 | Kalıcı canvas; HUD bunun üstündedir |
| Kimlik kartı | 16,12,288,64 | 8,8,374,48 | Avatar büstü + seviye halkası, ad, unvan, XP çubuğu; mobilde Bayt/Çip pilleri aynı satıra katlanır |
| ↳ Seviye halkası + avatar | 24,16,56,56 | 8,8,48,48 | Halka 6 px çizgi; içinde 40×40 (mobil 34×34) avatar büstü; sağ altta "Sev. 3" rozeti |
| ↳ Ad + unvan | 88,16,208,36 | 64,10,138,22 | `@zeynep_cs` (hud-lbl) ve "Çırak · Sev. 3" (body-sm); mobilde yalnızca ad |
| ↳ XP çubuğu | 88,58,208,10 | 64,38,138,8 | 10 px (mobil 8 px) yüksek; dolgu kobalt; "200 / 350 XP" odakta/dokunmada |
| Para pilleri | 316,12,108,64 | — | Bayt (316,12,108,30) ve Çip (316,46,108,30) üst üste; mobilde ayrı bölgeler (aşağıda) |
| ↳ Bayt pili | 316,12,108,30 | 208,12,84,40 | `bayt` ikonu + sayı + "B"; amber |
| ↳ Çip pili | 316,46,108,30 | 296,12,86,40 | `cip` ikonu + sayı + "Çip"; turkuaz; ilk Çip'e kadar gizli |
| Hedef çubuğu | 440,12,500,44 | 8,60,374,36 | `hedef` ikonu + "Hedef: Otopark" + 3 parçalı ilerleme; dokunuş → Şehir Haritası |
| Sağ simge kümesi | 960,12,304,44 | — | 6 düğme 44×44, 8 px aralık: Bildirim, Görev, Pazar, Liderlik, Sohbet, Ayarlar; mobilde Menü sayfasına katlanır |
| Görev kartı | 984,68,280,136 | 8,100,326,44 | Masaüstünde açık kart; mobilde tek satırlık çip (dokununca alt sayfa 0,440,390,324) |
| Bildirim düğmesi (mobil) | — | 338,100,44,44 | `bildirim` + sayaç rozeti |
| Sohbet mini | 16,624,336,160 | 8,648,246,52 | Son 3 balon + giriş satırı (16,744,336,40); mobilde yalnızca son mesaj, dokununca sohbet sayfası |
| Bağlam eylemi + emote | 1032,720,232,64 | 8,708,374,56 | Bağlam düğmesi ("Gir", "Alkışla", "Kasayı Topla", 160×48) + emote çarkı düğmesi (56×56) |
| Alt dock | 392,716,496,68 | 0,772,390,72 | 5 yuva: Akademi, Harita, İşletmelerim, Günlük Tekrar, Oda (mobilde Oda yerine Menü); yuva 92×56 (mobil 78×56) |

### 5.1 Parçalar

| Parça | Ölçü ve davranış |
|---|---|
| **Seviye halkası** | Dış çap 56 px (mobil 48); iz `night-600`, dolgu kobalt-500→300 gradyan, saat yönünde 12 konumundan; ilerleme = XP çubuğuyla aynı oran; seviye rozeti 28×20, Fredoka 14, `kobalt-700` zemin + beyaz yazı (7,87:1) |
| **XP çubuğu** | 208×10 (mobil 138×8), yarıçap 5; dolgu 700 ms `ease-out`; sayı etiketi yalnızca odak/dokunmada: "200 / 350 XP"; KANON eğrisi: Sev. 3 → 4 için `XP(3) = 350` |
| **Bayt / Çip sayaçları** | Pil yüksekliği 30 (mobil 40); sayı `hud-num`; sayaç animasyon kuralı aşağıda; dokununca Bayt pili "Kasada {n} B seni bekliyor" ipucunu ve İşletmelerim kısayolunu açar |
| **Görev kartı** | 280×136; üst satır: `gorev` ikonu + "Görev" + adım sayacı ("1/3"); başlık Fredoka 18/22 (en çok 2 satır); adım metni Nunito 14; ödül çipleri ("+60 XP", "+50 B"); "Git" düğmesi 40 px (hedef işaretçisini açar). Kapalı hali 280×48 |
| **Hedef çubuğu** | 500×44; metin "Hedef: {ad}"; her koşul için bir parça (Bayt, Ruhsat, ders/seviye); tamamlanan parça nane, eksik parça `night-600` + sayı; üç parça da tamam olunca çubuk "Tapuyu al" düğmesine dönüşür |
| **Bildirim rozetleri** | 18 px daire (`mercan-500`, yazı `night-950`), sayı ≤ "9+"; sayısız olay için 10 px nokta; konum: simgenin sağ üstünden (−6, −6). Kaynaklar: Bildirim (toplam), Görev (yeni adım), Sohbet (okunmamış), Pazar (yeni raf), İşletmelerim (kasa dolu: amber nokta), Günlük Tekrar (hazır), Müfettiş dosyası (sarı nokta) |
| **Sohbet mini** | 336×160; son 3 balon (6 sn'de solar), güvenli modda giriş yerine hazır cümle çipleri |
| **Bağlam eylemi** | Yakındaki en uygun etkileşimi gösterir ("Gir: Akademi", "Alkışla", "Kasayı Topla (61 B)"); aynı hedef `E` tuşu ve Erişilebilir Dünya Katmanı ile aynıdır |
| **Dock** | 5 yuva; etiket her zaman görünür (14 px); aktif ekran yuvası `turkuaz-500` alt çizgi + dolu ikon |

**Sayaç animasyon kuralı.** Değer değişince sayı eski değerden yenisine `requestAnimationFrame` ile sayılır (`ease-out-cubic`); süre farkın büyüklüğüne bağlıdır: Δ ≤ 20 → 500 ms; 21–200 → 800 ms; 201–2.000 → 1.200 ms; > 2.000 → 1.600 ms. Her karede tam sayı yazılır ve `tr-TR` ile biçimlenir ("1.240"). Artışta pilin üstünden "+N" etiketi (Fredoka, amber/turkuaz/kobalt) 900 ms yukarı süzülür ve solar; azalışta (satın alma) sayı sayılarak düşer, etiket çıkmaz. Aynı anda en çok bir sayma çalışır, yeni değer gelirse kalan süre sıfırlanmadan hedef güncellenir. Sekme gizliyken sayı doğrudan yazılır. `prefers-reduced-motion`'da sayma ve süzülme yoktur: değer doğrudan yazılır, pil 600 ms renk parlaması alır ve ekran okuyucuya "Bayt +40, toplam 160" anonsu gider.

**Kademeli açılış (B8 önerisi; VİZYON §4 ile uyumlu):**

| Parça | Ne zaman belirir |
|---|---|
| XP çubuğu + seviye halkası | 4. dakika (Meydan'a iniş, HUD açılır) |
| Görev kartı, Bayt pili | 4. dakika (Bayt pili "0 B" ile; ilk Bayt 20. dakikada) |
| Akademi dock yuvası | 4. dakika (tek görev işaretçisi) |
| Pazar simgesi (tek raf) | 20. dakika (ilk Bayt'tan sonra) |
| Şehir Haritası dock yuvası, Hedef çubuğu | 23. dakika |
| Oda dock yuvası | Sev. 2 (14. dakika), Bloklar açılınca |
| Liderlik, Sohbet simgesi | Ders 1.2 tamamlanınca / 30. dakikadan sonra (15–17 güvenli mod önce) |
| İşletmelerim dock yuvası | İlk tapu |
| Günlük Tekrar dock yuvası | İlk Ders Mührü'nden sonraki gün |
| Çip pili | İlk Çip (Semt Sınavı) ya da Butik'in ilk açılışı |

| Durum | Görünüm |
|---|---|
| Yükleniyor | Pillerde iskelet; sayılar "—" |
| Boş (yeni oyuncu) | "0 B", XP çubuğu boş, görev kartı "İlk görevin Akademi'de" |
| Hata | Bayt/Çip pillerinde `!` ikonu; dokununca "Cüzdan şu an okunamıyor. Tekrar Dene." |
| Çevrimdışı | Pil ve dock soluk (%55); kimlik kartının altında "Çevrimdışı" çipi (`cevrimdisi`) |
| Turist modu | Üst şeritte mavi "TURİST" bandı; Hedef çubuğu gizli |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Bayt/XP/Çip değişimi (sunucu yanıtı) | Sayaç sayar, "+N" süzülür | `coin_pickup` / `xp_tick`; 500–1.600 ms |
| XP eşiği aşıldı | Çubuk %100'e dolar (400 ms), halka büyür (1,5 sn), seviye atlama modali | `level_up`; ışık halkası 3 sn (Meydan'daysa herkes görür) |
| Hedef çubuğuna dokun | Şehir Haritası hedef işaretçisine odaklı açılır | `ui_tap` |
| Görev kartı "Git" | Hedef işaretçisi (zeminde noktalı yol) belirir; uzaksa "Tramvayla 1 durak" önerisi | `ui_confirm` |
| Dock yuvasına dokun | İlgili ekran açılır (panel 240 ms) | `ui_tap` |
| Kasa dolu bildirimi | İşletmelerim yuvasında amber nokta, bağlam eylemi "Kasayı Topla" | `notification` (ses açıksa) |

**Veri:** `GET /v1/players/me` (kimlik, unvan, seviye; `xp.intoLevel` / `xp.forNext`, `wallets.BAYT` / `wallets.CIP`, `serverTime`), `GET /v1/quests` (görev kartı), `GET /v1/notifications` (rozetler); gerçek zamanlı WorldHub olayları `user.xp`, `user.wallet`, `quest.updated`, `notify.new`, `vault.full`, `presence.friend`. Hedef çubuğu verisi `GET /v1/businesses/catalog` (fiyat, kilit nedeni) ve `GET /v1/players/me/licences` (Ruhsat) ile türetilir.

**Mobil.** Üst iki satır (kimlik+para, hedef) toplam 96 px yer kaplar; görev kartı çip olarak tek satırdır; kalan her şey dock'ta ve "Menü" sayfasındadır (Pazar, Liderlik, Sohbet, Oda, Dolap, Profil, Metro, Ses, Ayarlar; her biri 48 px satır). Dock yuvaları 78×56'dır, hepsi ≥ 44 px.

**Mikro etkileşimler.** Pil dokununca 100 ms basılma; ödül geldiğinde pilin yanında 3 parlak parçacık (düşük cihaz modunda yok); hedef çubuğu parçası tamamlanınca 400 ms nane parlaması; rozet görününce `ease-pop` ile 160 ms ölçek.

**Erişilebilirlik.** HUD bir `<header role="banner">` + `<nav aria-label="Hızlı erişim">`'dir. XP çubuğu `role="progressbar"` `aria-valuenow="200"` `aria-valuemax="350"` `aria-label="Seviye 3 ilerlemesi"`; sayaçlar `aria-label="Bayt: 120"`; güncellemeler `aria-live="polite"` bölgesine "Bayt +40, toplam 160" olarak gider (en çok 1 anons/sn). Odak sırası: kimlik → pil → hedef → sağ küme → görev kartı → dock → sohbet. Odaklanabilir her öğe sahne üstünde bile `focus-visible` 3 px turkuaz halkayla görünür ve başka HUD öğesi tarafından örtülmez (WCAG 2.4.11).

---

## 6. Ekran envanteri

KANON §6'daki 24 ekran, adları ve sırasıyla aşağıdadır; HUD §5'tedir. Her alt bölüm aynı şablonu izler: **amaç** · **wireframe bölge tablosu** · **bileşenler** (§9 kütüphanesinden) · **durumlar** (yükleniyor / boş / hata / çevrimdışı; gerçek metin) · **etkileşimler** (tetikleyici → sonuç → ses/animasyon; ses adları §11.2'de) · **veri** (B7 uç noktaları; taban `/v1`, İngilizce çoğul kaynak adları, kebab-case; adlar B7 ile hizalanır) · **mobil** · **mikro etkileşimler** · **erişilebilirlik**. Yedi ekran (Derleyici Meydanı, Kurul Kartı, İş Emri, İşletme Editörü, Savunma, İşletme Paneli, Pazar) ayrıca ayrıntılandırılmıştır; bu ekranların örnek içeriği §8'dedir.

Ses adlarında "—" sessiz anlamına gelir; ses kapalıyken (varsayılan) tüm ses sütunları yalnız animasyon olarak okunur.

### 6.1 Giriş (`giris`)

**Amaç.** Telefon numarasıyla, şifresiz ve hesap formu olmadan 75 saniyede içeri almak (VİZYON §4: 0:00–1:15). Akış tek kartta dört (15–17 yaşta beş) adımdır: telefon → SMS kodu → doğum yılı (öz beyan, saklanmaz) → e-Devlet yaş doğrulama (KANON §12.2) → (15–17 yaş) veli telefonu. 15 yaş altı nazikçe geri çevrilir ve bekleme listesine alınır; 15–17 yaş oyuna **kilitsiz** başlar; serbest metin sohbet, DM, ziyaret kabulü ve Çip harcaması veli onayına kadar kapalı kalır (KANON §1, §12.2). OTP doğrulaması yeni numara için 10 dk geçerli bir **kayıt belirteci** verir; hesap, Avatar Atölyesi'nin sonunda ("Şehre Gir") tek çağrıyla oluşturulur (B7 §5.4.3). Rıza kutuları ayrı ayrı sorulur ve varsayılan **kapalıdır**; Aydınlatma Metni ve Kullanım Koşulları ise zorunlu onaydır. HUD gizlidir.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Marka illüstrasyonu (zemin) | 0,0,720,800 | 0,0,390,176 | Gece şehri, tramvay 20 sn döngüyle geçer; masaüstünde tam yükseklik |
| ↳ Logo + ad | 40,32,320,48 | 24,24,200,48 | İzometrik çini karosu üstünde "K" + "KodKent" |
| ↳ Slogan | 48,560,624,168 | 24,88,342,72 | "Oyunlarla yazılım öğreniyorum." (display) ve altında "Kod yaz, şehrini kur." |
| Form kartı | 760,96,456,608 | 0,176,390,668 | Adım kartı; adımlar yatay kayar |
| ↳ Adım göstergesi | 792,120,392,28 | 16,192,358,28 | "1/4 · Telefon", noktalı ilerleme |
| ↳ Form gövdesi | 792,160,392,376 | 16,232,358,380 | Telefon / kod / doğum yılı / veli alanı |
| ↳ Birincil düğme | 792,552,392,56 | 16,628,358,56 | "Kod Gönder", "Doğrula", "Devam" |
| ↳ Yasal not | 792,624,392,64 | 16,700,358,100 | Aydınlatma Metni ve Kullanım Koşulları onayı (zorunlu); isteğe bağlı üç izin (ürün analitiği, pazarlama, yapay zekâ kalibrasyonu) ayrı ve **kapalı** |

**Bileşenler:** `Button` (birincil), `Input` (telefon, kod, yıl), `Checkbox`, `Badge` (veli onayı bekleniyor), `Toast`, `Stepper`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Düğme "Kod gönderiliyor…" + dönen simge; `aria-busy="true"` |
| Boş | Telefon yer tutucusu `5XX XXX XX XX`; önek `+90` sabit |
| Hata | "Bu numara geçerli görünmüyor. Başında 0 olmadan 10 haneyi yaz." · "Kod yanlış. Bu saat içinde 3 hakkın kaldı." · "Kodun süresi doldu. Yeni kod iste." · "Yeni kod için 41 saniye beklemelisin." · "Telefon doğrulaman zaman aşımına uğradı. Kodu yeniden iste." (kayıt belirteci 10 dk) · "Çok fazla deneme yaptın. 1 saat sonra tekrar deneyebilirsin." · 15 altı: "KodKent 15 yaşından itibaren. Büyüyünce seni burada bekleriz. İstersen e-postanı bırak, kapıyı açınca haber verelim." |
| Çevrimdışı | "Giriş için internet gerekiyor. Bağlanınca tekrar dene." (düğme devre dışı) |
| SMS gecikti | 60. saniyede "Kod gelmedi mi? Tekrar gönder" etkinleşir |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Geçerli numara + onay → "Kod Gönder" | OTP adımı; 90 sn geri sayım | `ui_confirm`; kart yatay kayar 240 ms |
| 6. hane girildi | Otomatik doğrulama; başarıda nane tik | `ui_confirm`; tik 400 ms |
| "Tekrar gönder" (60. sn'den sonra) | Yeni kod; sayaç sıfırlanır; saatte 5 deneme sınırı | — |
| Doğum yılı → "Devam" | < 15: ret kartı + bekleme listesi · 15–17: e-Devlet yaş doğrulama, sonra veli telefonu adımı · ≥ 18: e-Devlet yaş doğrulama, sonra `dil-sec` | — |
| Veli telefonu → "Veliye SMS Gönder" | "Veli onayı bekleniyor (72 saat)" rozeti; oyun açık, serbest sohbet kapalı notu | `ui_confirm` |
| Kayıtlı oyuncu OTP'yi geçti | Doğrudan `meydan` | — |

**Veri:** `POST /v1/auth/otp/requests` (→ `challengeId`, `expiresInSec: 90`, `resendAfterSec: 60`, `sendsLeftThisHour`), `POST /v1/auth/otp/verifications` (→ `authenticated` ya da `registration_required` + `registrationToken`, TTL 600 sn), `POST /v1/auth/registrations` (Avatar Atölyesi'nin sonunda: `handle`, `displayName`, `birthYear`, `guardianPhone`, `consents`), `GET /v1/privacy/notices` (aydınlatma ve koşullar), `POST /v1/auth/tokens/refresh` (çerez).

**Mobil.** Tek sütun; sayısal klavye (`inputmode="tel"` / `"numeric"`); klavye açılınca kart `visualViewport` ile yukarı kayar ve birincil düğme klavyenin üstünde sabit kalır. **Yaş kuralı:** `yaş = bu yıl − doğum yılı` (ay sorulmaz, veri azaltma); sınır B7/hukuk ile hizalanır.

**Mikro etkileşimler.** Tramvay illüstrasyonu 20 sn döngü (reduced-motion'da durağan); kod kutusu odakta turkuaz halka; geri sayım son 10 sn amber; hata alanı 2 kez 4 px yatay titreşir (reduced-motion'da kırmızı çerçeve).

**Erişilebilirlik.** Kod alanı tek `<input autocomplete="one-time-code" inputmode="numeric" maxlength="6">`, altı görsel hücre onun üstüne çizilir; `aria-label="6 haneli doğrulama kodu"`; yapıştırma serbesttir (WCAG 3.3.8); Android'de WebOTP otomatik doldurur. Hatalar `role="alert"`; geri sayım görsel, ekran okuyucuya yalnızca 30 ve 10 sn kala anons edilir.

### 6.2 Dil Seçimi (`dil-sec`)

**Amaç.** 6 dil kartı: **C# açık** ("Şehir açık"), Python, JavaScript, Java, Kotlin, Go "yakında — haber ver" (KANON §6). "Haber ver" tıklamaları bekleme listesi olarak ikinci dil kararını besler. HUD gizli. Süre hedefi 45 sn.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Başlık | 160,48,960,96 | 16,24,358,88 | "Hangi dille başlıyoruz?" + "Şimdilik şehir yalnızca C# ile açık. Diğerleri yolda." |
| C# kartı | 160,168,304,240 | 16,120,358,120 | `ŞEHİR AÇIK` nane rozeti; "C# ile Başla" |
| Python kartı | 488,168,304,240 | 16,248,175,100 | "Yakında" rozeti; "Haber Ver" |
| JavaScript kartı | 816,168,304,240 | 199,248,175,100 | aynı |
| Java kartı | 160,432,304,240 | 16,356,175,100 | aynı |
| Kotlin kartı | 488,432,304,240 | 199,356,175,100 | aynı |
| Go kartı | 816,432,304,240 | 16,464,175,100 | aynı |
| Alt bilgi | 160,696,960,72 | 16,584,358,100 | "Haber Ver dersen hazır olunca bildirim göndeririz. İstediğin zaman Ayarlar'dan vazgeçebilirsin." |

**Bileşenler:** `Card` (dil), `Badge` (açık/yakında), `Button`, `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | 6 iskelet kart |
| Boş | — (kartlar sabittir; liste boş gelirse hata durumu) |
| Hata | "Dil kartları yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | Kartlar önbellekten gösterilir; "Haber Ver" kuyruğa alınır: "Bağlanınca listeye yazacağız." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| C# kartı / "C# ile Başla" | Seçim kaydedilir → `avatar` | `ui_confirm`; kart 160 ms yükselir |
| "Haber Ver" | Düğme "Haber vereceğiz" olur; toast "Listeye yazıldın. Hazır olunca haber vereceğiz." | `ui_tap` |
| "Haber vereceğiz"e yeniden dokun | Kayıt geri alınır | `ui_tap` |

**Veri:** `PUT /v1/players/me/language-track` (C#), `POST /v1/language-waitlist` ("Haber ver"); vazgeçme için `DELETE` B7 kataloğunda yoktur (talep edilir). Altı kartın içeriği istemci paketindedir.

**Mobil.** C# kartı tam genişlik, diğer beşi iki sütun; Go kartının yanındaki boş hücre bırakılır (yedinci kart eklenmez). **Mikro:** C# kartında yavaş nefes alan turkuaz çerçeve (reduced-motion'da sabit); "yakında" kartlarında **kilit ikonu yoktur** (kilit "paralı" izlenimi verir; yalnız rozet). **Erişilebilirlik:** her kart `button`; etiket "Python, yakında. Haber ver."; durum rozeti metindir, yalnız renk değildir.

### 6.3 Avatar Atölyesi (`avatar`)

**Amaç.** İlk kimlik: 3 vücut tipi, 8 ten, yüz (şekil, göz, kaş, ağız), saç (16 model × 12 renk), 12 hazır kıyafet seti ve takma ad (B1 §7). "Sonra her şeyi değiştirebilirsin" (yüz, saç, vücut Dolap'ta ve Berber Cemil'de ücretsiz; takma ad değişimi 500 B). Takma ad `claude-haiku-5-5` + sözlükle moderasyondan geçer. HUD gizli.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Başlık / adım çubuğu | 32,24,1216,56 | 0,0,390,56 | "Avatarını yap" · 3/4 adım göstergesi |
| Önizleme sahnesi | 32,96,480,616 | 0,56,390,288 | `avatar-studio` mini sahnesi; avatar bekleme animasyonuyla |
| Önizleme kontrolleri | 32,720,480,64 | 12,348,366,48 | ◀ ▶ döndür (4 yön), "Rastgele", "Sıfırla" |
| Seçenek sekmeleri | 544,96,704,56 | 0,400,390,48 | Vücut · Yüz · Saç · Kıyafet |
| Seçenek ızgarası | 544,160,704,368 | 12,452,366,200 | Seçili sekmenin seçenekleri (48×48 mobil / 72×72 masaüstü) |
| Takma ad alanı | 544,544,704,112 | 12,660,366,88 | Takma ad (`@…`, 3–16 karakter) + "Usta sana nasıl seslensin?" (görünen ad, isteğe bağlı; boşsa takma ad) + canlı kural/uygunluk durumu |
| "Şehre Gir" çubuğu | 544,672,704,112 | 12,756,366,64 | Birincil düğme + "Sonra her şeyi değiştirebilirsin." |

**Bileşenler:** `AvatarPreview`, `Tab`, `Button`, `Input`, `Badge` (uygunluk), `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Siluet avatar + "Avatar parçaları yükleniyor…" |
| Boş | Varsayılan avatar rastgele hazır kıyafetle gelir (boş önizleme yoktur) |
| Hata | "Bu takma ad kullanılamıyor. Başka bir tane dene." (neden verilmez) · "Bu takma ad alınmış. `zeynep_cs2` nasıl?" · "3–16 karakter; harf, rakam, nokta ve alt çizgi." · "Parçalar yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | Önizleme çalışır; ad alanı: "Takma adı denetlemek için internet gerekiyor." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Parça seç | Önizleme anında güncellenir (≤ 100 ms) | `ui_tap`; seçilen parça 160 ms "pop" |
| "Rastgele" | 8 katman rastgele seçilir | `ui_confirm`; avatar 2 kare silkelenir |
| Takma ad yaz (400 ms bekleme) | Kural + moderasyon denetimi; uygunsa nane tik | — |
| "Şehre Gir" | Avatar ve ad kaydedilir; giriş sineması (40 sn, atlanabilir) → `meydan` | `ui_confirm`; tramvay sineması |

**Veri:** `GET /v1/handles/availability?handle=` (kural + moderasyon ön denetimi), `POST /v1/auth/registrations` ("Şehre Gir"; `registrationToken` 600 sn geçerli), sonra `PUT /v1/players/me/avatar`; parça kataloğu istemci paketinde (`ItemDef` JSON), sahip olunan parçalar `GET /v1/inventory`.

**Mobil.** Önizleme üstte, sekmeler ve ızgara altta; ızgara 4 sütun (48×48); önizleme dokununca avatar el sallar. **Mikro:** kombinasyon değişince 60 ms'de katman ekleme/çıkarma (sahne yeniden yüklenmez); ad geçerliyse tik 160 ms büyür. **Erişilebilirlik:** önizleme `role="img"` ve her değişimde güncellenen tarif ("Orta vücut, kısa kahverengi saç, turuncu hırka"; `aria-live="polite"`); seçenek ızgaraları `radiogroup`; sürükleme yoktur.

### 6.4 Derleyici Meydanı (`meydan`) — ayrıntılı

**Amaç.** Şehrin oturma odası ve doğma noktasıdır; oyuncunun gün içinde en çok geri döndüğü ekran budur. Akademi'ye, Pazar'a, Liderlik Panosu'na, Belediye Köşkü'ne ve tramvaya buradan gidilir; "Göster" adımı (LED pano, Podyum, öne çıkan Otopark) burada oynanır. 40 avatarlık shard'da (B1 §11) tıkla-yürü, balon sohbet ve emote vardır. HUD **tam** moddadır (§5).

**Sahne bileşimi.** `meydan` sahnesi 40×40 tile (2.560×1.280 px) olup ortasında 16×16'lık açık plaza ve 6×6 **Çeşme** bulunur. Ekranın uzak (üst) kenarını Akademi cephesi ve üstündeki **LED pano** (12×2 tile, 5×7 nokta matris, kırmızı-amber) kaplar; solda Pazar, sağda Liderlik Panosu + Podyum, yakın tarafta Tramvay Durağı ve Bloklar'a inen merdiven vardır; Belediye Köşkü (Nuran), Meydan Otoparkı ve iskeleli Arena (v1.2) kenarlardadır. Kamera zoom 1,0'da avatarı izler. Doğma noktası tramvay durağıdır; paneller kapanınca avatar bıraktığı hücrede bulunur (konum sunucuda tutulur, B1 §11.4).

**Tıklanabilir nesneler.** Tıklama önceliği: HUD/DOM → sahne etkileşimi → zemin. Her nesnenin tıklama poligonu (`hitPoly`) ve `approachCell` hücresi vardır; avatar oraya yürür (600 ms kuralı, §2.5) ve etkileşim tetiklenir.

| Nesne | Hover / ilk dokunuş | Tıklama sonucu |
|---|---|---|
| Akademi ana kapısı | "Akademi" etiketi | Sahne geçişi → `akademi` |
| LED pano | "Şehir panosu" | Küçük kart: son 20 mesaj geçmişi + "Duraklat" |
| Çeşme | "Çeşme — sonraki Meydan Sorusu {n} dk sonra" | Soru aktifse soru kartı; değilse bilgi balonu |
| Pazar binası / manken | "Pazar" | `pazar` paneli (manken tıklanırsa o ürün seçili) |
| Liderlik Panosu | "Liderlik Panosu" | `liderlik` paneli |
| Podyum | "Podyum" | "Çık" → 30 sn spot ışığı, kıyafet herkese görünür |
| Belediye Köşkü (Nuran) | "Belediye Memuru Nuran" | Diyalog: Ruhsat durumu, Satılık arsa listesi |
| Tramvay Durağı | "Tramvay — Meydan durağı" | Hat paneli (T1 Çevre, T2 Tepe); hedef seçilince 1,5 sn vinyet |
| Meydan Otoparkı | "Öne çıkan: @{ad}'ın Otoparkı" | Turist ziyareti → `sokak` |
| Bloklar merdiveni | "Bloklar" | Sahne geçişi → `bloklar` |
| Başka avatar | İsim etiketi; masaüstünde hover'da "Kalfa · Sev. 8 · Tente Sokak No: 3" | Profil mini kartı: [Profil] [Arkadaş Ekle] [Odasına Git] |
| Figüran NPC | — | Semt esprisi balonu (ör. "Bugün simitçi gelmedi.") |

**LED pano akışı.** Karışım %50 yerel / %50 küresel; mesaj ≤ 8 sn (B1 §3.0). Türler: yeni Açılış ("Yeni işletme: @ayse_kod'un Otoparkı — Çarşı"), Meydan Sorusu'nun en hızlı 3 kişisi, en çok ziyaret edilen işletmeler, lig geri sayımı ve Ders 1.1'de oyuncunun kendi `Console.WriteLine` çıktısı (10 sn, moderasyonlu; **sosyal gösteriş anı #1**). Pano bir Pixi nesnesidir; metin akışı aynı zamanda DOM'daki gizli bir canlı bölgeye yazılır (`aria-live="off"`; kullanıcı "Pano geçmişi"ni açınca liste olur) ve "Duraklat" düğmesi vardır (WCAG 2.2.2). `prefers-reduced-motion`'da kaydırma yerine sayfalama (her mesaj 5 sn).

**Meydan Sorusu (saat başı).** Çeşme 10 sn yükselir, LED pano "MEYDAN SORUSU" yazar, çan üç nota çalar (ses açıksa); sağ-ortada 60 sn'lik bir soru kartı belirir. Soru küreseldir, panel shard'a özeldir; yanıt çoktan seçmelidir (belirleyici, AI'sız); en hızlı doğru 3 kişi panoya çıkar. **XP ve Bayt vermez** (B2 §4.1); ödül görünürlüktür. Katılmak zorunlu değildir: kart kapatılabilir, ekranda baskı sayacı yoktur (yalnız 60 sn'lik ilerleme çizgisi).

**İlk giriş.** Avatar Atölyesi'nden sonra 40 sn'lik atlanabilir sinema (tramvay iner, vagon camında ufuk akar) ve ardından Usta Defne'nin üç balonu çıkar (her balon ≤ 40 kelime): (1) "Işığı yanan her dükkân birinin yazdığı kodla çalışıyor. Şu otopark, 3 gün önce senin gibi başlayan birinin." (2) "Önce yürümeyi dene, {ad}: bir yere tıkla." (3) "Akademi'ye gel; ilk dersimiz seni bekliyor." Tek hedef işaretçisi Akademi'dir; harita ve Pazar 20–23. dakikada açılır (§5 kademeli açılış).

**Hedef işaretçisi ve bağlam eylemi.** Aktif görevin hedefi zeminde noktalı bir yol olarak çizilir; hedef başka sahnedeyse "Tramvayla 1 durak" kartı çıkar. HUD'un bağlam düğmesi 3 tile içindeki en uygun nesneyi önerir (öncelik: görev hedefi > kasa > kapı > Alkış); `E` tuşu ve Erişilebilir Dünya Katmanı aynı hedefi paylaşır.

**Kalabalık.** ≤ 24 avatarda tam çizim; 25–40'ta arkadaş olmayanların isim etiketi yalnız hover/dokunuşta; eşzamanlı sohbet balonu ≤ 12, balon 6 sn, 1 mesaj/3 sn, 200 karakter, link yok (B1 §11.3, KANON). Mobilde `LOD_FULL_MAX` 16'dır (§2.7). Gün fazı overlay'i (sabah/gün/akşam/gece, TR saati) ve gece ışık sprite'ları B1 §9.1'dedir.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Sahne tuvali (zemin) | 0,0,1280,800 | 0,0,390,844 | `meydan` sahnesi; kamera avatarda |
| HUD üst-sol (kimlik + Bayt/Çip) | 16,12,408,64 | 8,8,374,48 | §5; Bayt/Çip mobilde aynı satırda |
| HUD hedef çubuğu | 440,12,500,44 | 8,60,374,36 | "Hedef: Otopark — 120/300 B · Ruhsat 2/3 · 1 ders" |
| HUD sağ: simge kümesi + görev kartı | 960,12,304,192 | 8,100,374,44 | Masaüstünde 6 simge + açık görev kartı; mobilde görev çipi + zil |
| LED pano (sahne nesnesi) | 392,96,496,64 | 24,168,342,56 | Akademi cephesinde kayan şehir akışı |
| Usta Defne balonu (kaplama) | 216,400,392,120 | 24,404,342,128 | `ChatBubble` (Usta); ilk girişte 3 balon |
| Sohbet mini | 16,624,336,160 | 8,648,246,52 | Son 3 balon + giriş / mobilde son mesaj |
| Alt dock | 392,716,496,68 | 0,772,390,72 | Akademi · Harita · İşletmelerim · Günlük Tekrar · Oda (mobilde Menü) |
| Bağlam eylemi + emote | 1032,720,232,64 | 8,708,374,56 | "Gir: Akademi" · emote çarkı |

**Bileşenler:** `HUD`, `ChatBubble` (Usta, oyuncu), `AvatarNameplate`, `Badge`, `Toast`, `Modal` (seviye atlama), `LedBoard`, `EmoteWheel`, `Card` (tramvay hat paneli, Meydan Sorusu), `ProgressRing`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Şehir hazırlanıyor… %{n}" + ipucu "Bir yere tıkla, avatarın yürür." |
| Boş | Sahne boş kalmaz (figüran NPC: `max(0, 12 − gerçek oyuncu)`); sohbet mini: "Meydan sessiz. İlk selamı sen ver." |
| Hata | "Meydan şu an açılamadı." [Tekrar Dene] · bağlantı koptu: avatar hayalet (yarı saydam) + "Şehirle bağlantı koptu. Yeniden bağlanıyor… (2/6)" |
| Çevrimdışı | "Çevrimdışısın. Meydan'ı yalnız başına gezebilirsin; diğer oyuncular bağlanınca görünür." (sahne önbellekten) |
| Shard dolu | Toast: "Meydan kalabalık, seni yeni bir Meydan'a aldık." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Zemine tıkla/dokun | Hedef elmas + noktalı yol, avatar yürür | `step` (opsiyonel); beyaz elmas 1 sn |
| Akademi kapısı | Sahne geçişi, 1 sn renk solması | `door`; semt rengi çapraz solma |
| Saat başı | Çeşme yükselir, pano duyurur, soru kartı | `fountain_chime` (3 nota); su 10 sn |
| Soru kartında seçenek | Doğruysa nane vurgu + sıra bilgisi, yanlışsa mercan; ikinci hak yok | `test_pass` / `test_fail` |
| Açılış duyurusu (başkası) | Pano akar; yakındaysa konfeti | `confetti`; 2 sn |
| Emote çarkı / `1`–`8` | Avatar emote oynar (B1 §7.3) | Emote animasyonu |
| Mesaj gönder | Avatarın üstünde 6 sn balon; kuyruk 12 | `chat_pop` |
| Pazartesi 09:00 | Pazar önüne kamyon gelir, mankenler değişir (2 dk) | `truck`; mankenler solup yenilenir |
| Pazar 21:00 | Havai fişek 20 sn, pano ilk 3'ü akıtır | `fireworks` |
| Seviye atlama (sunucu yanıtı) | Modal + avatar üstünde 3 sn ışık halkası | `level_up` |

**Veri:** `POST /v1/world/scenes/meydan/join-tickets` (→ `hubUrl`, `ticket`, `shard`, `walkableHash`, `sceneVersion`), `/hubs/world`: `MoveTo`, `Emote`, `Interact`, `Resync` ve `scene.snapshot`, `scene.delta`, `move.ack`, `scene.event` (`meydan_question`, `fountain`, `led`), `scene.transition`, `interaction.result`; `GET /v1/world/led-feed` (ilk akış), `GET /v1/world/meydan-question`, `POST /v1/world/meydan-question/answers`, `GET /v1/players/me`.

**Mobil.** Tek parmak sürükle kamerayı kaydırır (3 sn avatar takibini askıya alır); dokun-yürü; iki parmak pinch 1,0/1,5; nesnede ilk dokunuş adı gösterir, ikinci dokunuş girer (yanlış dokunmayı önler). Alt dock ve bağlam satırı başparmak bölgesindedir; sohbet mini yalnız son mesajı gösterir ve sayfa olarak açılır.

**Mikro etkileşimler.** Hedef elmasının 1 sn'lik nabzı; nesne üzerine gelince 2 px yükselme + ad etiketi; kapıdan geçerken 1 sn semt rengi solması; LED pano karakterleri 60 ms/karakter kayar; yeni Açılış'ta pano 1 sn yanıp söner; gece fazına geçişte 10 dk'lık yumuşak tween.

**Erişilebilirlik.** Canvas'a paralel **Erişilebilir Dünya Katmanı** (§12.3): yakındaki en çok 8 etkileşim mesafeye göre listelenir, `Tab` ile gezilir, `Enter`/`E` yürüyüp etkileşimi başlatır. Sohbet balonları aynı anda `role="log"` bölgesine yazılır; LED pano duraklatılabilir; Meydan Sorusu kartı odak tuzağı kurmaz ve `Esc` ile kapanır; hızlı yanıt rekabeti için süre uzatma gerekmez çünkü katılım isteğe bağlıdır.

### 6.5 Şehir Haritası (`harita`)

**Amaç.** Şehri tek bakışta gösteren **çizilmiş 2D illüstrasyon** (izometrik render değil; B1 §10.4): açık semtler renkli, kilitliler "inşaat halinde" (vinç, iskele), Satılık arsalar yanıp sönen "S" etiketli, oyuncunun işletmeleri küçük tabela ikonlu (Kararmış olan gri), görev hedefi tek işaretçi. İlk açılış: 23. dakika (VİZYON §4). Pixi kullanılmaz: WebP zemin (1920×1200, 2× için 3840×2400 yedek) + hit-test için SVG katmanı. HUD kompakt.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Harita çizimi (zemin) | 0,0,1280,800 | 0,0,390,844 | İllüstrasyon + SVG etkileşim katmanı; mobilde 1,5× genişlikte yatay kaydırılır |
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Gün fazı + Meydan Sorusu sayacı | 32,80,260,56 | 12,64,200,36 | Güneş/ay ikonu, "Akşam · Meydan Sorusu 24 dk sonra" |
| Semt bilgi kartı | 944,80,320,520 | 0,520,390,324 | Usta, konu kümesi, açılış şartı, durum, "Git" / "Gezmeye gir" (mobilde alt sayfa) |
| Lejant | 32,704,420,72 | 326,64,52,36 | Rozet anlamları (Satılık, İnşaat halinde, Açık, Kararmış, Hedef); mobilde düğme |
| Pusula | 1168,688,96,96 | — | En yakın görev hedefinin yönü (mini harita yoktur); mobilde hedef kenarda ok olur |

**Bileşenler:** `MapView` (SVG), `Card`, `Badge` (durum rozetleri, §3.6), `Button`, `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Pusula çiziminde dönen ibre + "Harita çiziliyor…" |
| Boş | — (harita her zaman çizilir; işletmesi olmayan oyuncuda "İşletmelerim" ikonları yoktur) |
| Hata | "Harita yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | Çizim önbellekten açılır; "Çevrimdışı harita: durumlar güncel olmayabilir." |
| Kilitli semt kartı | "Liman: Çarşı Sınavı'ndan sonra açılıyor" · "Sev. 6 — sen Sev. 4 · Çarşı Sınavı — henüz değil" · [Gezmeye gir] |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Açık semte dokun | Bilgi kartı; semt 160 ms yükselir | `ui_tap` |
| "Git" | Tramvay vinyeti 1,5 sn → hedef semt Ana Caddesi (veya `meydan`) | `tram_bell`; vagon camında semt kayar |
| Kilitli semt → "Gezmeye gir" | Turist modu onay kartı → sahne (HUD'da mavi TURİST bandı) | `door` |
| "S" (Satılık) etiketi | Kart: "Otopark — 300 B · Sev. 3 · Ruhsat 3/3" + [Parseli Gör] → `sokak` | `ui_tap` |
| Oyuncu işletmesi ikonu | İşletme mini kartı: durum, kasa; [Panel] [Git] | `ui_tap` |
| `Esc` / geri | Önceki sahneye döner (aynı hücre) | panel kapanışı 240 ms |

**Veri:** `GET /v1/world/map` (semt durumları, Satılık arsalar, hedef işaretçisi), `GET /v1/districts`, `GET /v1/businesses` (işletme ikonları), `GET /v1/friends/presence` (konumunu paylaşan arkadaşlar).

**Mobil.** Harita yatay kaydırılır ve iki parmakla 1,0–1,5 yakınlaştırılır; semt kartı alt sayfadır (gözetleme yüksekliği 96 px, tam 324 px); pusula yok. **Mikro:** "S" etiketi 1,2 sn nabız; kilitli semtte vinç kolu 6 sn döngü; hedef işaretçisi 800 ms zıplar; reduced-motion'da hepsi durağan. **Erişilebilirlik:** SVG alanında semtler sıralı `button`'dır (Meydan → Çarşı → … → Bulut Tepesi); `L` tuşu ya da "Liste görünümü" düğmesi haritanın metin eşdeğerini açar; durum her zaman şekil + metindir.

### 6.6 Akademi Lobisi (`akademi`)

**Amaç.** Akademi'nin zemin katı: 28×20'lik rotonda, 7 Kürsü kapısı, Atölye kanadı girişi, Danışma (Günlük Tekrar Kiosku), Mühür Duvarı (Metro Haritası kısayolu), mühürlü Kurul Odası ve kordonlu "Kalfa Yardımı — v1.2" köşesi (B1 §4.2). Sağ **Kürsü Panosu** seçili Kürsü'nün derslerini listeler (durum, XP, süre, soru tipleri). Kürsüler semt açılmadan gezilebilir; dersler kilitlidir (KANON §2.2). HUD tam.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Lobi sahnesi (zemin) | 0,0,1280,800 | 0,0,390,844 | `akademi-lobi`: rotonda, Metro mozaiği zemini, 7 kapı |
| HUD üst şerit | 0,0,1280,64 | 0,0,390,100 | §5 (mobilde iki satır) |
| Kürsü Panosu | 936,80,328,600 | 0,444,390,320 | Sağ panel / alt sayfa |
| ↳ Kürsü listesi (7 satır) | 952,128,296,224 | 0,452,390,64 | Mobilde kaydırmalı çip şeridi |
| ↳ Ders listesi (seçili Kürsü) | 952,360,296,304 | 0,524,390,232 | Satır: mühür durumu · `1.2` · başlık · XP · dk · soru tipi rozetleri |
| Atölye girişi (sahne nesnesi) | 96,560,220,64 | 12,360,160,48 | "Atölye — görevler" kapısı |
| Danışma · Günlük Tekrar kiosku | 480,592,200,80 | 218,360,160,48 | Kiosk: seri sayacı, "5 soru · 3 dk" |
| Alt dock | 392,716,496,68 | 0,772,390,72 | §5 |

**Bileşenler:** `Card` (Kürsü satırı), `Badge` (mühür: gri/sarı/yeşil/altın), `ProgressRing` (semt ilerlemesi), `Tab`, `Button`, `Toast`.

Örnek Çarşı Kürsüsü satırları (B4 §3 M1; 1.5 Para Hesabı: decimal · 1.6 Tekrar: while Döngüsü · … · 1.12 Şehirden Çıkış: dotnet ve Visual Studio satırları aynı biçimdedir):

| Ders | Başlık | Durum | XP | Süre | Soru tipleri |
|---|---|---|---|---|---|
| 1.1 | Merhaba KodKent | Mühürlü (yeşil) | 100 XP | ≈ 8 dk | Kavram Sorusu, Çıktı Tahmini, Hata Avı |
| 1.2 | Sayılar ve Yuvarlama | Sürüyor (sarı) | 100 XP | ≈ 8 dk | Çıktı Tahmini, Kavram Sorusu, Hata Avı |
| 1.3 | Kararlar | Açık | 100 XP | ≈ 8 dk | Çıktı Tahmini, Hata Avı, Kavram Sorusu |
| 1.4 | Fonksiyon Sözleşmesi | Kilitli (gri): "Önce 1.3'ün Mührü gerekiyor." | 100 XP | ≈ 8 dk | Kavram Sorusu, Çıktı Tahmini, Hata Avı |

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Akademi açılıyor…" (rotonda iskelet) |
| Boş | Kürsü seçilmedi: "Bir Kürsü kapısı seç; dersleri burada görürsün." |
| Hata | "Ders listesi yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | "Çevrimdışısın. İndirilmiş dersler: 1.2, 1.3." (yalnız önbellekli dersler açılır) |
| Kilitli Kürsü | "Liman dersleri Çarşı Sınavı'ndan sonra açılıyor. Kürsü'ye oturabilirsin ama kartlar kilitli." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Kürsü kapısına tıkla | Panoda o Kürsü seçilir; avatar kapıya yürür; [Kürsüye Gir] | `door`; kapı ışığı yanar |
| [Dersi Başlat] (açık ders) | `derslik?ders=1.2` panel olarak açılır | `ui_confirm`; panel 240 ms |
| Kilitli ders satırı | Toast "Önce 1.3'ün Mührü gerekiyor." | `ui_error` |
| Atölye girişi | Sahne geçişi → `akademi-atolye` (görev listesi) | `door` |
| Danışma kiosku | `tekrar` açılır | `ui_tap` |
| Mühür Duvarı | `metro` açılır | `seal_stamp` (kısa) |
| Kurul Odası kapısı | Balon: "Kurul kişi değildir; kartlarıyla konuşur." | — |

**Veri:** `GET /v1/districts` (Kürsü kilitleri), `GET /v1/lessons?district={slug}` (liste: durum, XP, süre, soru tipleri, Mühür), `POST /v1/world/scenes/akademi-lobi/join-tickets`.

**Mobil.** Kürsü Panosu alt sayfadır (gözetleme 64 px çip şeridi; sürükleyince ders listesi); kapılar 1,0 zoom'da en az 44 px'lik dokunma alanıdır; Atölye ve Danışma sahne üstünde etiketli düğmeler olarak ayrıca gösterilir. **Mikro:** açılan semtin giriş basamağında kişisel ışık yanar (yalnız kendi istemcisinde, B1 §4.1); Mühür Duvarı'nda yeni mühür kabartma parlar; Kürsü kapısı penceresinden Usta'nın tahtaya yazdığı görülür. **Erişilebilirlik:** Kürsü Panosu `nav` + `listbox`; Erişilebilir Dünya Katmanı kapıları, Danışma'yı ve Atölye'yi listeler; kilitli satırlar `aria-disabled` ve nedenini `aria-describedby` ile okur.

### 6.7 Derslik (`derslik`)

**Amaç.** 6–10 dakikalık dersin kart akışı: her kart ≤ 60 kelime + en çok 1 mini kod; PRIMM sırası **Tahmin Et → Çalıştır → İncele → Değiştir → Yap**; kartlardan sonra 3 Usta sorusu (→ Kurul Kartı). Mini editörde yalnızca **1 satır** düzenlenebilir; ilk 3 derste sıfırdan kod yoktur (VİZYON §4, §11 ilke 6). Ders durumu sunucudadır: bağlantı kopsa kart kaybolmaz. Sahne arkada karartılmış Kürsü'dür (öğrenci avatarları görünür, balon kapalı). HUD **odak**.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Kürsü sahnesi (zemin, karartılmış) | 0,0,1280,800 | 0,0,390,844 | Usta tahtaya tebeşirle yazar |
| Ders başlığı + PRIMM şeridi | 160,24,960,64 | 0,0,390,96 | "1.1 Merhaba KodKent" · beş adımlı şerit; mobilde 4 px XP çizgisi |
| Kart paneli | 160,104,560,560 | 12,100,366,284 | Kart başlığı, ≤ 60 kelime metin, `CodeBlock` |
| Kod / mini editör | 736,104,384,336 | 12,392,366,196 | `CodeEditor` (`dersMini`): tek düzenlenebilir satır turkuaz sol çubukla, diğerleri kilitli |
| Çıktı konsolu | 736,456,384,208 | 12,596,366,92 | Çalıştırma çıktısı, Türkçe hata satırı, "Panoda Göster" |
| Usta şeridi | 160,680,560,96 | 12,696,366,64 | Usta portresi + tek cümlelik yönlendirme balonu |
| Alt gezinme | 736,680,384,96 | 0,768,390,76 | Geri · ilerleme noktaları (kart 3/6) · İleri / "Usta sorusuna geç" |

**Bileşenler:** `Card`, `CodeBlock`, `CodeEditor`, `Button`, `ChatBubble` (Usta), `ProgressRing`/nokta ilerleme, `Badge` (PRIMM adımı), `Toast`.

Ders yapısı (B3 §2.1): **Konu Kartı** (Tahmin et), **Canlı Örnek** (Çalıştır, İncele), **Dene** (tek satırı düzenlenebilir mini editör), **Usta Sorusu** ×3 (Kurul Kartı) ve **Özet** (iş emri önizlemesi + Mühür). Ders 1.1'in ilk kartı (B4 §4.1, **Tahmin et**): kod `string ad = "Misafir"; int yas = 17; Console.WriteLine("Merhaba KodKent!"); Console.WriteLine($"Ben {ad}, {yas} yaşındayım.");` ve "Bu dört satır ekrana ne yazar? Çalıştırmadan tahmin et." Seçenekler: (A) `Merhaba KodKent!` / `Ben Misafir, 17 yaşındayım.` (doğru) · (B) `Merhaba KodKent!` / `Ben {ad}, {yas} yaşındayım.` · (C) tek satır `Ben Misafir, 17 yaşındayım.` Doğru seçimde Usta: "Tahminin tuttu. Şimdi çalıştırıp bakalım." Yanlış seçimde ceza yoktur: "Henüz değil; ikinci satırdaki `$` işaretine bak, sonra Çalıştır'a bas." **Dene** adımında yalnızca ilk satır açıktır: `string ad = "Misafir";` → `string ad = "Ece";` ile çalıştırınca çıktı `Ben Ece, 17 yaşındayım.` olur.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Ders açılıyor…" kart iskeleti |
| Boş | — (kart listesi boşsa hata durumu) |
| Hata | "Ders yüklenemedi." [Tekrar Dene] · çalıştırma hatası konsolda Türkçe: "Satır 3: satır sonunda `;` eksik. (CS1002)" · "Kodun 10 saniyede bitmedi; sonsuz döngü olabilir." |
| Çevrimdışı | "Çevrimdışısın. Kartları okuyabilirsin; Çalıştır ve Usta sorusu için bağlantı gerekiyor." (düğmeler devre dışı, neden araç ipucunda) |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| "İleri" / `→` | Sonraki kart 240 ms kayarak gelir; ilerleme kaydedilir | `ui_tap`; kart kayması |
| Tahmin Et seçeneği | Anında geri bildirim (belirleyici, AI'sız); ceza yok | `test_pass` / `ui_soft_miss` |
| "Çalıştır" (`Ctrl+Enter`) | Sandbox'ta çalışır (≈ 1,5 sn); çıktı karakter karakter akar | `ui_confirm`; konsol yazım animasyonu 30 ms/karakter |
| Mini editörde satırı değiştir + Çalıştır | Yeni çıktı; ilk kez ise "Panoda Göster" düğmesi belirir | — |
| "Panoda Göster" | Moderasyondan geçen çıktı Meydan LED panosunda 10 sn akar (kullanıcıya önizleme: "Panoda şöyle görünecek: Merhaba Zeynep") | `led_tick`; toast "10 sn panoda akacak" |
| Son kartta "Usta sorusuna geç" | `kurul?ders=1.1&soru=1` | Kart mühürlenip düşer |
| Çıkış (✕) | "Ders kaydedildi. Kaldığın yerden devam edersin." | — |

**Veri:** `GET /v1/lessons/{lessonId}` (kartlar, Usta soruları, `seal`, `hintsAvailable`; `ETag`), `POST /v1/lessons/{lessonId}/attempts`, `PATCH /v1/lesson-attempts/{attemptId}` (kart ilerlemesi), `POST /v1/lesson-attempts/{attemptId}/answers` (deterministik cevap; "Çalıştır/Dene" sandbox çağrısı için ayrı uç nokta B7 kataloğunda görünmüyor, `kind: "run"` varsayıldı); "Panoda Göster" için de uç nokta yoktur (`POST /v1/world/led-feed/entries` talep edilir). Ad ve alanlar B3/B7 ile hizalanır.

**Mobil.** Kart ve kod alt alta; klavye açılınca kart kaydırılır ve "Çalıştır" yapışkan kalır; tek satırlı mini editör CodeMirror'dır; dokunma hedefleri ≥ 48 px. **Mikro:** aktif PRIMM adımı turkuaz parlar; doğru tahminde 160 ms tik; kart başına 10 XP "kart ilerlemesi" çubuğu (KANON: kartlar 10 XP) sessizce dolar. **Erişilebilirlik:** her kart `role="region"` `aria-label="Kart 3 / 6"`, değişince başlığa odak taşınır; PRIMM şeridi `<ol>` ve `aria-current="step"`; mini editör etiketi "Düzenlenebilir satır: 3. satır"; kilitli satırlar `aria-readonly`.

### 6.8 Kurul Kartı (`kurul`) — ayrıntılı

**Amaç.** Dersin üç **Usta sorusunun** sorulduğu, cevaplandığı ve **Kurul**'un mühürlü bir kartla puanladığı ekrandır (KANON §9, B3 §4). Öğretmen ile puanlayıcı ayrıdır: soruyu Usta (Defne) sorar, geri bildirimi Usta söyler; puanı kişiliksiz Kurul verir ve kart "Kurul kartı" olarak görünür, hitap etmez. Ekran iki yarıdır (B3 §4.1): **soru yarısı** (cevaptan önce) ve **karar yarısı** (cevaptan sonra). Rubrik cevap kutusunun **üstündedir**; oyuncu neyle ölçüleceğini yazmadan önce görür (VİZYON §11 ilke 5). Soru başına 2 deneme (2. deneme XP ×0,8), günde 30 AI puanlamalı etkileşim, itiraz soru başına 1 ve günde 3'tür. HUD **odak**; arkadaki karartılmış sahne Kürsü'dür.

**Rubrik bileşeni.** Üç satır, her biri ölçüt adı + ağırlık çubuğu (50 / 30 / 20 oranında uzunluk) + soru bloğundan gelen tek satırlık "tam puan için" cümlesi: *Doğruluk 50 · ad, değer, tür rolleri doğru* — *Tamlık 30 · üç noktanın üçü de var* — *Açıklık 20 · kendi cümlelerin, düzenli*. Rubrik cevap yazılırken sabit kalır (kaydırmayla kaybolmaz; mobilde daraltılabilir ama varsayılan açıktır).

**Cevap biçimi soru tipine göre değişir** (KANON §8; B3 §3):

| Soru tipi | Cevap formu | Kim karar verir | Kurul Kartı |
|---|---|---|---|
| **Kavram Sorusu** | Tek çok satırlı kutu, 40–1.500 karakter, sayaç | Kurul (100) | Tam kart |
| **Çıktı Tahmini** | **Çıktı** alanı (çok satırlı çıktıda satır başına kutu) + **Neden?** kutusu (1–3 cümle); programın sayıları oyuncuya özel tohumdan gelir | Makine (çıktı değeri, 40) + Kurul (gerekçe, 60); gerekçesiz doğru değer ≤ 40/100 | Tam kart + "Çıktı: doğru / yanlış" satırı |
| **Hata Avı** | Kodda **satır seçme** (satır numarasına dokun) + düzeltilmiş satır + **Neden** kutusu (1–2 cümle) | Makine (konum, düzeltme testleri, 58) + Kurul (neden, 42) | Tam kart + "Düzeltme: testleri geçti" satırı |
| **Kod Yazma** | `CodeEditor` kısa mod (min. 160 px) | Yalnızca sandbox; AI puanlamaz (Kurul yorumlar) | Test sonucu kartı: açık/gizli/tohumlu sayıları; herhangi bir test kalırsa ≤ 69 |

**Durum makinesi** (XState `kurulMachine`; B3 §4.1 adımlarının istemci karşılığı):

| Durum | Giriş olayı | Çıkış | Not |
|---|---|---|---|
| `soru` → `yaziliyor` | Soru açıldı; ilk karakter | Gönder | Karakter sayacı (min 40, maks 1.500); yapıştırma/zaman telemetrisi sessizce toplanır (UI'da görünmez) |
| `gonderiliyor` | "Cevabı Gönder" | `202` yanıtı | `Idempotency-Key`; düğme kilitli, `aria-busy` |
| `degerlendiriliyor` | `status: queued` | `job.completed` olayı | "Kurul değerlendiriyor…" mühür animasyonu + [Durdur]; olay 8 sn'de gelmezse `GET` ile 1,5 sn aralıkla yoklama (en çok 10) |
| `kota` | `status: deferred_quota` | Gece sonucu | "Kurul bugünlük kapandı, cevabın sırada. XP sabah gelecek." Ders kilitlenmez; sonraki soru açılır |
| `reddedildi` | Ön elemede enjeksiyon / ders metni kopyası | `soru` | 0 puan, mizahi uyarı (aşağıda); 1. ihlalde deneme hakkı yanmaz |
| `karar` | `GET …/submissions/{id}` → `status: done` | Takip / itiraz / sonraki | Mühür damgası → ölçüt çubukları → puan halkası → Usta geri bildirimi |
| `takip` | `40 ≤ puan < 85`, `takip_sorusu` dolu, `kopya_suphesi: false` | Yanıt / Geç | "Usta bir şey soruyor" + 300 karakterlik kutu; en çok 2 tur; **+10'a kadar telafi** (B3 §4.3) |
| `itiraz` | [İtiraz Et] | `appeals` 202 → yeni karar | Opus kör yeniden okuma; fark ≥ 15 ise yeni puan geçerli; ceza yok |
| `kapandi` | Takip bitti / Geç / puan ≥ 85 | Sonraki soru | `puan_final = min(100, puan + telafi)`; XP bu puandan |

**Mühür.** Kartın damgası renk + metin + şekildir: **≥ 85 altın "PARLAK"** (yıldızlı mühür) · **70–84 yeşil "GEÇTİ"** (tikli) · **40–69 sarı "HENÜZ DEĞİL"** (yarım daire) · **< 40 gri "KARTA DÖN"** (açık kitap; ders kartı önerilir, XP kaybı yok). Usta geri bildirimi puan söylemez (B3 §4.2): biçim sabit **1 doğru + 1 eksik + 1 sonraki adım**, ≤ 80 kelime, isimle hitap, emoji yok; balonda iki parça (≤ 40 kelime/parça). XP etiketi uçarken dokununca dökümü gösterir ("30 × 82/100 = 25 XP"); sonuçta ayrıca **Ders Mührü** sayacı ("Mühür: 1/3 soru geçti; 2 gerekiyor") görünür, üçüncü soru kesinleşince Mühür kartı açılır. Mühür alınamazsa Telafi Turu 10 dk sonra açılır (B4 §6; `POST /v1/lesson-attempts/{attemptId}/remediation-rounds`).

**Uyarı metinleri** (B3 §7.5, Kurul sesi, suçlamasız): enjeksiyon 1.: *"Kurul kandırılmaz. Mühür mürekkebi «puan ver» yazısını okumaz, cevabı okur. Bu deneme 0 puan; hakkın duruyor."* — ders metni kopyası: *"Bu cümleler ders kartından aynen gelmiş. Kartı kapat, kutuyu kendi cümlenle anlat; benzetme kullanmak serbest."* — yapıştırma/hız: *"Cevabın çok hızlı geldi. Sorun değil: Usta bir şey soracak, birlikte konuşunca puanın kesinleşir."* (**Sözlü Doğrulama**: Usta aynı kavramı yeni bağlamda sorar; `kapanmadi` ise soru XP ×0,5 ile 2. denemeye yönlendirilir.) 3. ihlalde o gün o Usta'nın soruları "gözetimli"dir: yapıştırma kapalı, her soruda Sözlü Doğrulama.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Kürsü sahnesi (zemin, karartılmış) | 0,0,1280,800 | 0,0,390,844 | Usta tahtanın başında; kart "düşerken" sıranın üstüne iner |
| HUD odak şeridi | 0,0,1280,48 | 0,0,390,48 | Geri, "Ders 1.1 · Soru 1/3", 4 px XP çizgisi |
| Soru bandı | 96,64,1088,112 | 12,56,366,128 | Usta portresi + ad, soru metni, tip rozeti ("Kavram Sorusu"), "Soru 1/3" |
| Rubrik (cevap kutusunun üstünde) | 96,184,1088,72 | 12,192,366,88 | `RubricBar`: 3 ölçüt, ağırlık çubuğu, "tam puan için" cümlesi |
| Cevap kutusu | 96,264,520,420 | 12,288,366,232 | Tipe göre form; karakter sayacı "96/1.500" |
| Gönder çubuğu | 96,692,520,72 | 12,528,366,64 | [Cevabı Gönder] · İpucu çekmecesi (Pusula · Fener · Taslak · Örnek) |
| Kurul kartı (karar yarısı) | 640,264,544,500 | 0,600,390,244 | Mühür, puan halkası, 3 ölçüt satırı, Usta geri bildirimi, takip kutusu, XP, [İtiraz Et] [Tekrar dene ×0,8] [Sonraki Soru]; mobilde alt sayfa (sonuç gelince cevap kutusu 2 satıra katlanır, sayfa 560 px'e büyür) |

**Bileşenler:** `ChatBubble` (Usta), `RubricBar`, `CodeEditor` (kısa mod), `HintLadder` (çekmece), `KurulCard`, `ProgressRing` (puan), `Badge` (soru tipi, mühür), `Button`, `Modal` (Ders Mührü, seviye atlama), `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Soru bandı iskeleti; rubrik satırları soluk |
| Boş | Cevap kutusu yer tutucusu: "Kendi cümlelerinle yaz; en az 40 karakter." |
| Değerlendiriliyor | "Kurul değerlendiriyor…" + mühür animasyonu + [Durdur] (yalnız bekleme animasyonunu kapatır; kart hazır olunca HUD'da "Kurul kartın hazır" rozeti) |
| Hata | "Kurul şu an yoğun, biraz sonra tekrar dene." · `invalid_json` onarımı sunucudadır; yoklama başarısızsa "Sonucu alamadık. [Tekrar Dene]" (cevabın saklıdır) |
| Kota | "Kurul bugünlük kapandı, cevabın sırada. XP sabah gelecek." (soru "bekliyor" etiketli; ders kilitlenmez, deterministik soru ve görevler sürer) |
| Hak bitti | `ATTEMPTS_EXHAUSTED`: "Bu soru için 2 hakkını da kullandın. Telafi Turu 10 dakika sonra açılacak." |
| Çevrimdışı | "Çevrimdışısın. Cevabın taslak olarak kaydedildi; bağlanınca gönderebilirsin." (gönder kapalı) |
| Çok uzun | 1.400'de sayaç amber; 1.500'de giriş durur: "En çok 1.500 karakter." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Kutuya yaz | Sayaç; 40 karakterde [Cevabı Gönder] etkin | — |
| [Cevabı Gönder] (`Ctrl+Enter`) | Düğme kilitlenir, mühür döner; p95 < 4 sn | `ui_confirm` |
| Sonuç geldi | Mühür damgalanır (350 ms) → ölçüt çubukları 0,4 sn/ölçüt soldan dolar → puan halkası 0'dan sayar (900 ms) → Usta balonu iki parça yazılır | `seal_stamp`, `xp_tick` |
| XP etiketine dokun | Döküm: "30 × 82/100 = 25 XP" | `ui_tap` |
| Takip kutusu → [Yanıtla] | Haiku ≈ 0,8 sn; "Telafi: +10 → 92" ya da "+5, bir soru daha" | `test_pass` / `ui_soft_miss` |
| [Geç] | Takip kapanır, telafi 0 | — |
| [İtiraz Et · 3/gün] | Neden kutusu → `appeals` 202 → "Kurul ikinci kez okuyor…" (≈ 8 sn) → fark ≥ 15 ise yeni puan | `seal_stamp` |
| [Tekrar dene ×0,8] (puan < 70, 1. deneme) | Kutu temizlenir, 2. deneme; XP ×0,8; iki denemenin yükseği kalır | `ui_confirm` |
| 3. soru kesinleşti | Ders Mührü kartı (2/3 ≥ 70 → mühür damgası + "Göreve Geç") ya da Telafi Turu bilgisi | `seal_stamp`, `confetti` (Mühür) |
| XP eşiği aşıldı | Seviye atlama modali (Sev. 1 → 2: Oda açıldı) | `level_up` |

**Veri:** `GET /v1/lessons/{lessonId}` (soru bloğu, `rubric`), `POST /v1/lessons/{lessonId}/attempts` (→ `lessonAttemptId`), `POST /v1/grading/submissions` (`lessonAttemptId`, `questionId`, `answer`; `Idempotency-Key`; 202 → `submissionId`, `status`, `attemptNo`, `quota{usedToday, limit, deferred}`, `etaMs`), sonuç `job.completed` ya da `GET /v1/grading/submissions/{submissionId}` (→ `card` = B3 Kurul JSON'u aynen, `award{xp, xpTotal, passed, bright, levelUp}`, `seal{needed, of, passed}`, `appealAvailable`), `POST /v1/grading/submissions/{submissionId}/followups`, `POST /v1/grading/submissions/{submissionId}/appeals` (`reason`), `GET /v1/hints?targetId=&level=`, `POST /v1/lesson-attempts/{attemptId}/remediation-rounds`. İstemci `card`'ı Zod ile doğrular: `puan` 0–100 tam sayı; `olcutler` = Doğruluk 0–50, Tamlık 0–30, Açıklık 0–20; `geri_bildirim` ≤ 80 kelime; `guven` 0–1.

**Mobil.** Soru bandı, rubrik ve cevap kutusu üst üste; [Cevabı Gönder] klavyenin üstünde sabit; sonuç geldiğinde cevap kutusu iki satıra katlanır ve Kurul kartı alt sayfa olarak yükselir (sürükleyerek tam ekran). Hata Avı'nda satır seçimi satır numarasına dokunarak yapılır (≥ 44 px hedef). **Mikro etkileşimler.** Mühür damgası hafif gölge bırakır; ölçüt çubukları sırayla dolar; puan halkası ≥ 70'te nane, < 70'te amber, 85+'te altın uç parlaması alır; "+25 XP" etiketi HUD'daki XP çubuğuna uçar; hareketi azalt açıkken tüm sonuç anında gelir. **Erişilebilirlik.** Okuma sırası soru → rubrik → kutu; rubrik `aria-describedby` ile kutuya bağlıdır ("Kurul şunlara bakar: Doğruluk 50 puan…"). Sonuç `role="status"` ile bütün olarak okunur: "Kurul kartı: 100 üzerinden 82, geçti. Doğruluk 50 üzerinden 45. Tamlık 30 üzerinden 22. Açıklık 20 üzerinden 15." Mühür yalnız renkle değil metinle de ("GEÇTİ") verilir; takip kutusu ve itiraz düğmesi sonuçtan sonra `Tab` sırasında gelir.

### 6.9 Atölye (`atolye`)

**Amaç.** Kısa kod görevlerinin yüzeyi: **Sıralama** (Parsons, çeldirici satırlı), **Tamamlama**, **Sıfırdan** ve Müfettiş'in getirdiği **Hata Bildirimi** görev tipleri (KANON §8; hepsi AI'sız, sandbox puanlı). Hata Bildirimi'nde editör başkasının hatalı kodunu açar ve görev paneline "Neden?" (tek cümle) alanı eklenir. 3–8 dakika, tek metot, 2–4 açık test. Sağda ücretsiz ve sınırsız **ipucu merdiveni** (Pusula → Fener → Taslak → Örnek), altta Türkçe hata ve test paneli. Ödül görev tamamlanınca sunucudan gelir: 60 XP (T1) + 40–80 B + Ruhsat parçası (VİZYON §3). HUD **odak**.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD odak şeridi | 0,0,1280,56 | 0,0,390,48 | Geri, görev adı, 4 px XP çizgisi |
| Sekme çubuğu (mobil) | — | 0,48,390,44 | Görev · Testler · İpucu · Sonuç |
| Görev paneli | 16,64,344,720 | — | Tip rozeti, anlatım, hedef, açık testler (`TestList`); mobilde "Görev/Testler" sekmesi |
| Editör | 376,64,568,520 | 0,92,390,320 | `CodeEditor` (`gorev`); Tamamlama'da `___` boşlukları düzenlenebilir aralıktır; Sıralama'da `ParsonsBoard` |
| Kod yardımcı çubuğu (mobil) | — | 0,412,390,48 | `Tab { } ( ) ; " …` (§14.3) |
| İpucu merdiveni | 960,64,304,312 | — | 4 basamak; mobilde "İpucu" sekmesi |
| Eylem çubuğu | 960,392,304,192 | 0,460,390,60 | Çalıştır, Sıfırla, Berrak Zihin göstergesi |
| Çıktı / Türkçe hata paneli | 376,600,888,184 | — | Çıktı, `ErrorPanel`, test özeti; mobilde "Sonuç" sekmesi |
| Sekme içeriği (mobil) | — | 0,528,390,316 | Seçili sekmenin içeriği |

**Bileşenler:** `CodeEditor`, `ParsonsBoard`, `TestListRow`, `HintLadder`, `ErrorPanel`, `Button`, `Badge` (görev tipi, Berrak Zihin), `Toast`.

**İpucu merdiveni:** her basamak içerik bankasından gelir (AI maliyeti yok), anında açılır ve tekrar açılabilir. **Pusula** hangi kavrama bakılacağını, **Fener** hangi durum/satıra bakılacağını, **Taslak** sözde kodu/eksik satırı, **Örnek** benzer ama farklı bir mini problemi gösterir. Basamaklar sırayla açılır (merdiven). İpuçsuz ilk denemede geçmek **+%15 Berrak Zihin** verir; ilk ipucu açılınca gösterge yargısız biçimde "Berrak Zihin: bu denemede kapandı" olur.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Editör iskeleti + "Görev hazırlanıyor…" |
| Boş | — (testler boş gelirse hata durumu) |
| Hata | Derleme: "Satır 6: satır sonunda `;` eksik. (CS1002)" + [Satıra Git] · Zaman aşımı: "Kodun 10 saniyede bitmedi; sonsuz döngü olabilir." · "Testler çalıştırılamadı. [Tekrar Dene]" |
| Çevrimdışı | "Çevrimdışısın. Kodunu yazabilirsin, çalıştırmak için bağlantı gerekiyor." (taslak cihazda saklanır) |
| Başarı | "Görev tamam! 4/4 test geçti." + ödül satırı |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| "Çalıştır" (`Ctrl+Enter`) | Testler sırayla bekliyor → çalışıyor → sonuç (120 ms aralık); p95 < 6 sn | `ui_confirm`; satır başına `test_pass` / `test_fail` |
| Tüm testler geçti | Görev kutlaması: XP, Bayt, Ruhsat parçası (`award()`); Usta kısa kod incelemesi (10–30 XP, gelire etkisiz) | `xp_tick`, `coin_pickup`; konfeti tek patlama |
| Bir test kaldı | Satır mercan çarpı + "beklenen / gerçek"; hata konumu vurgulanır | `test_fail`; renk geçişi 160 ms |
| İpucu basamağı | Basamak açılır, içerik panelde kalır | `ui_tap`; 240 ms açılma |
| "Sıfırla" | Onay: "Başlangıç koduna dönmek istiyor musun?" | — |
| Parsons: kartı sürükle | Satır yeni yere oturur; ↑ ↓ düğmeleriyle de taşınır | `ui_tap`; 160 ms yerleşme |

**Veri:** `GET /v1/quests/{questId}`, `GET /v1/challenges/{challengeId}` (görevin challenge'ı; gizli testsiz), `POST /v1/challenges/{challengeId}/submissions` (202), sonuç `job.completed` olayı ya da `GET /v1/challenge-submissions/{submissionId}`, `GET /v1/hints?targetId=&level=pusula|fener|taslak|ornek`, `GET /v1/errors/translations/{csCode}`; Hata Bildirimi: `GET /v1/bug-reports`, `POST /v1/bug-reports/{bugReportId}/fixes`.

**Mobil.** Editör üstte, test/ipucu/sonuç sekmeleri altta; kod yardımcı çubuğu OS klavyesinin hemen üstünde (§14.3); Parsons'ta dokun-taşı (seç, hedefi dokun). Yatay telefonda iki panelli masaüstü düzeni. **Mikro:** test satırı geçince nane tik 160 ms büyür; kalan test satırı sarsılmaz, yalnız renk değişir; Berrak Zihin göstergesi ilk geçişte parlar. **Erişilebilirlik:** Monaco için `Ctrl+M` tuzak çıkışı alt çubukta yazılıdır; test özeti `role="status"` ("6 testten 4'ü geçti"); hata paneli `role="alert"`; ipucu basamakları `aria-expanded`; Parsons için sürükleme dışında ↑ ↓ düğmeleri (WCAG 2.5.7).

### 6.10 İşletme Sokağı (`sokak`)

**Amaç.** Bir işletmenin dış görünümü ve etkileşim noktası: tabela (`@ad'ın Otoparkı · Çırak Sev. 3 · AÇIK`), kasa, NPC trafiği, Alkış. Sahne, Ara Sokak instance'ındaki parseldir (20 kişi, 6 parsel; B1 §6.1). Ekranın birincil eylemi **işletmenin durumuna göre değişir** (aşağıdaki tablo); ziyaretçi ya da turist için tek eylem Alkış'tır. HUD tam.

| Durum (§3.6) | Sahibine birincil düğme | Ziyaretçiye |
|---|---|---|
| Satılık (tapu öncesi) | "Tapuyu Al (300 B)"; şart eksikse devre dışı + eksik listesi: "Ruhsat 2/3 · 180 B daha" | "SATILIK — Belediye"; [Tapu Bilgisi] |
| Kapalı — yazılım bekliyor | "İş Emrini Aç" (sonra "Editörü Aç") | Sarı-siyah bant, kasa yok |
| Deneme | "Kasayı Topla" + durum satırı "Savunma hakkı 24 sa sonra" | "DENEME" bandı; Alkış |
| Açık | "Kasayı Topla (61 B)" | [Alkışla] — "sahibine 2 B" |
| Kararmış | "Müfettişin Dosyasına Bak" → `editor` | Gri tabela; [Sahibine Haber Ver] (günde 1) |

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Sahne (zemin) | 0,0,1280,800 | 0,0,390,844 | `sokak-{streetId}`: parsel, bariyer, 12 park yeri, NPC arabalar |
| HUD üst şerit | 0,0,1280,64 | 0,0,390,100 | §5 |
| İşletme bilgi kartı | 16,88,320,232 | 0,520,390,184 | Tabela adı, adres ("Çarşı · Tente Sokak No: 3"), sahibi + unvan, durum rozeti, seviye, "Bugün: 12 araç · 2.220 TL · 220 B" (yalnız sahibi) |
| Kasa göstergesi | 560,392,120,96 | 135,330,120,96 | `VaultGauge` (4 kademe); dolunca zıplayan Bayt ikonu |
| Şikâyet balonu (yalnız sahibi) | 720,300,280,72 | 24,230,342,64 | "6 saat civarı kalanlar şikâyetçi" (Deneme/Kararmış) |
| Birincil eylem düğmesi | 936,680,328,64 | 16,712,358,52 | Durum tablosundaki eylem |
| Alt dock | 392,716,496,68 | 0,772,390,72 | §5 |

**Bileşenler:** `VaultGauge`, `Badge` (durum), `Card`, `Button`, `Modal` (tapu onayı), `ChatBubble` (Hasan Abi), `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Sokak hazırlanıyor…" (parsel iskeleti) |
| Boş | Boş parsel: "Bu parsel boş. SATILIK — Belediye." |
| Hata | "İşletme bilgisi alınamadı." [Tekrar Dene] |
| Çevrimdışı | Sahne önbellekten; kasa göstergesi: "Çevrimdışı — kasa bilgisi güncel olmayabilir." |
| Turist/ziyaret | Turist modunda: "Turist modundasın: arsa alamazsın, Alkış verebilirsin." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| "Tapuyu Al" | Onay: "Otopark tapusunu 300 B'ye alıyorsun. Cüzdan: 300 B → 0 B." [Tapuyu Al] [Vazgeç] → `Idempotency-Key` ile gönderilir; 2 sn dönüşüm (çim kalkar, toprak, bant, KODLA! oku); durum "Kapalı — yazılım bekliyor" | `coin_spend`; dönüşüm animasyonu; LED: "Yeni tapu: @ad — Çarşı" |
| "KODLA!" okuna tıkla | `is-emri` | `ui_confirm` |
| Kasaya tıkla / "Kasayı Topla" | Kasa boşalır, Bayt sayacı artar (sunucu yanıtı) | `coin_pickup`; madeni paralar HUD'a uçar (≤ 1,2 sn) |
| "Alkışla" | "Alkışladın!" toast; günde 1; sahibi 2 B kazanır (günlük 40 B tavan) | `applause`; el çırpma parçacığı |
| Tabelaya tıkla | Bilgi kartı büyür; Vitrin L2+ ise [Vitrini Gör] | `ui_tap` |
| Kararmış → "Sahibine Haber Ver" | Bildirim gider (günde 1): "Haber verdin." | — |

**Veri:** `GET /v1/streets/{streetId}` (parseller), `GET /v1/businesses/{businessId}`, `GET /v1/businesses/catalog` (Satılık fiyatı, kilit nedeni), `POST /v1/businesses` (`{kind}`; tapu; `Idempotency-Key`), `POST /v1/businesses/{businessId}/vault/collections`, `POST /v1/applause`, `POST /v1/world/scenes/sokak-{streetId}/join-tickets`; "Sahibine haber ver" için uç nokta B7 kataloğunda yoktur (talep edilir).

**Mobil.** Bilgi kartı alt sayfa, kasa göstergesi sahnede büyük hedef (120×96); birincil düğme başparmak bölgesinde. **Mikro:** Açılış'ta bariyer "tak" sesiyle oturur; sahnedeki arabalar yaklaşık 45 sn'de bir girer (görsel trafik ekonomiden bağımsızdır, B1 §6.3); Deneme'de tabela floresan titremesi; Kararmış'ta sessizlik ve yarı açık bariyer; kasa dolunca Bayt ikonu 800 ms aralıkla zıplar. **Erişilebilirlik:** durum rozeti metin + şekil; kasa `button` ("Kasa: 61 / 73 B. Topla"); NPC trafiği süs olduğundan `aria-hidden`; Erişilebilir Dünya Katmanı tabelayı, kasayı, KODLA! okunu listeler.

### 6.11 İş Emri (`is-emri`) — ayrıntılı

**Amaç.** Tapu alınınca Hasan Abi'nin iş emrini vermesi ve **Gereksinim Netleştirme**'nin (KANON §10) oynandığı ekran: oyuncu kod yazmadan önce müşteriye **en az 4 soru** sorar, her cevap **Sözleşme Kartı**'na bir madde yazar. Kurucunun kuralları müşteri ağzından, birebir görünür; belirsizlikler (saat yukarı yuvarlama, tam 2 ve 6 saat, 24 saati aşan kalış) bir öğretim anı olur. Kenardan Usta Defne konuşur. HUD **odak**; arka sahne karartılmış Otopark parselidir.

**Akış.** (1) Panel açılır: Hasan Abi, elinde defterle, iş emrini iki balonda söyler; kural metni `blockquote` olarak sabit kalır. (2) Defne: "Müşteriye sormadan kod yazan, iki kere yazar, {ad}. Hasan Abi'ye en az dört soru sor; cevaplar Sözleşme Kartı'na yazılacak." (3) Oyuncu 8 hazır sorudan seçer ya da 140 karakterlik serbest soru yazar; Hasan Abi 600 ms "yazıyor…" noktalarından sonra cevaplar, kartta ilgili madde mühürlenir. (4) Dördüncü sorudan sonra "Kodlamaya Geç" etkinleşir; Defne: "Güzel sorular, {ad}. Şimdi kod zamanı." (5) Düğmeye basınca `editor` açılır; **sorulmayan maddeler Sözleşme Kartı'nda soluk satır olarak kalır** ("Bu madde için müşteriye sormadın") ve editörün Sözleşme sekmesinde de aynı görünür. Sorulmayan maddenin gizli testleri Müfettiş'te kırmızı çıkar ve balon o bölgeyi söyler (B5 §3.2): "sormadan yazan iki kere yazar" bir cümle değil, ölçülür bir sonuçtur. Düğme 4. sorudan sonra **açılır ama kilitlenmez**: oyuncu 4'ten fazla soru sorabilir.

Hasan Abi'nin iş emri (KANON §5.1, birebir): *"2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum."*

**8 hazır soru** (B5 §3.2, aynen; sorular bir kez sorulur, cevaplar sabittir):

| # | Oyuncunun sorusu | Hasan Abi'nin cevabı | Açtığı madde (KANON §5.1) |
|---|---|---|---|
| S1 | "1 saat 10 dakika kalan ne öder?" | "Başlayan saat tam sayılır; 2 saatten az kaldı: 200." | 2, 3 |
| S2 | "Tam 2 saat kalan ne öder?" | "O artık 2–6 dilimi: 2 × 40 = 80." | 2 (alt sınır dâhil) |
| S3 | "Tam 6 saat kalan ne öder?" | "Hâlâ 2–6 dilimi: 240; 6'yı geçen güne girer." | 2 (üst sınır dâhil) |
| S4 | "24 saati aşan ne öder?" | "Her başlayan gün 250." | 4 |
| S5 | "Girip aynı dakika çıkan ne öder?" | "Ödemez. Bariyer eksi süre göndermez." | 1 |
| S6 | "Süreyi nasıl göndereceksin: dakika mı, saat mi, kesirli mi?" | "Dakika, tam sayı. Kesir yok." | 1, 5 |
| S7 | "Ücret kuruşlu olabilir mi?" | "TL, tam sayı. Kuruş yok." | 5 |
| S8 | "Tam 24 saat kalan ne öder?" | "Bir gün: 250. Bir dakika fazlası ikinci gün." | 4 |

**Keskin Göz.** Madde 6 (119 → 200, 120 → 80 müşterinin bilinçli kararıdır) hiçbir hazır soruda yoktur ve Usta bunu söylemez. Anomaliyi fark eden oyuncu serbest metinle sorar; tetik, aynı mesajda 119 ve 120 sayılarının geçmesi ya da sınıflandırıcının "uzun kalan daha az ödüyor" anlamını güven ≥ 0,8 ile bulmasıdır (B5 §3.2). Hasan Abi'nin cevabı sabittir: *"Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle."* Kart **madde 6** yazılır; ekranda **Keskin Göz** rozeti ve **+50 XP** çıkar (yalnızca kodlamadan önce, bir kez). Serbest metin soru, `claude-haiku-5-5` ile en yakın hazır soruya eşlenir; eşleşme yoksa Hasan Abi "Onu bilmiyorum evladım, şunlara bak" der ve hazır soruları listeler. Örnek akış (B5): Oyuncu: "119 dakika 200 TL ama 120 dakika 80 TL, bu doğru mu?" → Hasan Abi: "Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle." → Sistem: "Keskin Göz rozeti kazandın, +50 XP. Sözleşme Kartı'na madde 6 yazıldı." → Usta Defne (kenardan): "Müşterinin kararına saygı duy; ama soruyu sorman doğruydu."

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Parsel sahnesi (zemin, karartılmış) | 0,0,1280,800 | 0,0,390,844 | Hasan Abi'nin Otopark arsası |
| HUD odak şeridi | 0,0,1280,48 | 0,0,390,48 | Geri, "İş Emri #1 — Otopark", 4 px XP çizgisi |
| Hasan Abi diyalog kartı | 32,64,520,520 | 12,56,366,224 | Portre, iş emri `blockquote`, konuşma kaydı (`role="log"`) |
| Usta Defne kenar notu | 32,600,520,184 | 12,288,366,88 | Defne portresi + kenar balonu |
| Müşteriye Sor paneli | 568,64,360,720 | — | 8 soru kartı + serbest metin (mobilde "Sor" sekmesi) |
| Sözleşme Kartı | 944,64,304,600 | — | 6 madde, mühür durumları (mobilde "Sözleşme" sekmesi) |
| Eylem çubuğu | 944,680,304,104 | 0,768,390,76 | Soru sayacı "3/4" + "Kodlamaya Geç" |
| Sekmeler (mobil) | — | 0,384,390,44 | Sor · Sözleşme |
| Sekme içeriği (mobil) | — | 12,432,366,328 | Seçili sekmenin içeriği |

**Bileşenler:** `ChatBubble` (müşteri, Usta), `QuestionChip`, `ContractCard`, `Badge` (Keskin Göz, soruldu), `Button`, `Toast`, `Tab` (mobil).

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "İş emri hazırlanıyor…" |
| Boş | Konuşma kaydı: "Henüz soru sormadın. Hasan Abi dinliyor." |
| Hata | "Hasan Abi şu an cevap veremiyor." [Tekrar Dene] |
| Çevrimdışı | "Çevrimdışısın. İş emrini okuyabilirsin; soru sormak için bağlantı gerekiyor." |
| Kilit | "Kodlamaya Geç" devre dışı: "Önce Hasan Abi'ye en az 4 soru sor (2/4)." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Hazır soru kartı | Soru oyuncu balonu olur; Hasan Abi "yazıyor…" → cevap; ilgili madde mühürlenir; kart "soruldu" olur, sayaç artar | `chat_pop`; mühür damgası 400 ms |
| Serbest metin → "Sor" | Sınıflandırma; eşleşirse cevap + madde; Keskin Göz ise rozet + XP | `seal_stamp`; rozet 800 ms büyür |
| 4. soru | "Kodlamaya Geç" etkinleşir (nane parlaması); Defne notu | `ui_confirm` |
| Sözleşme maddesine dokun | Madde ayrıntısı: hangi soruyla netleşti, örnek | `ui_tap` |
| "Kodlamaya Geç" | `editor?isletme=…` açılır; sorulmayan maddeler soluk kalır | Panel geçişi 240 ms |
| "İş emrini tekrar oku" | `blockquote` 1,2 sn vurgulanır | — |

**Veri:** `GET /v1/challenges/{challengeId}` (`musteri_istegi`, `state.clarifications{required, asked}`), `POST /v1/businesses/{businessId}/clarifications` (hazır soru kimliği ya da serbest metin → cevap, açılan madde, rozet), `GET /v1/businesses/{businessId}/contract-card` (açılmış maddeler); Keskin Göz XP'si `user.xp` olayıyla gelir.

**Mobil.** Hasan Abi ve Defne üstte, "Sor" ve "Sözleşme" sekmeleri altta; yeni madde eklenince "Sözleşme" sekmesinde nokta rozeti yanar; eylem çubuğu yapışkan. **Mikro:** Hasan Abi'nin kasketi cevaptan önce hafifçe oynar; mühür damgası 400 ms; Defne tebeşir çevirir; üç kuralın üzerindeki fare/parmak vurgusu ilgili kural satırını soluk sarıyla işaretler. **Erişilebilirlik:** konuşma kaydı `role="log"` (yeni cevap anons edilir); Sözleşme Kartı sıralı liste, her madde "Madde 2, netleşti" etiketi; kilitli düğme `aria-disabled` + `aria-describedby`; serbest metin kutusu karakter sayacı (`aria-live="polite"`, 140).

### 6.12 İşletme Editörü (`editor`) — ayrıntılı

**Amaç.** İşletme kodunun yazıldığı, açık testlerin koştuğu, **Müfettiş**'in gizli testlerle sınadığı ve oyuncunun **Savunma**'ya geçtiği ekrandır (KANON §7: Tapu → İş Emri → Gereksinim Netleştirme → **Kod → Müfettiş** → Savunma → Açılış). Otopark L1'de kod yazımı ≈ 15 dakika sürer (B5 §3.1). Editör masaüstü ekrandır: "mobilde okunur, masaüstünde yazılır" (aşağıda mobil kuralı). Oyuncu yalnızca iskeletin işaretli aralığını yazar; sınıf ve metot imzası kilitlidir (imza değişirse Türkçe uyarı: "İmza sözleşmesi: `UcretHesapla(int dakika)` olmalı"). HUD **odak**; arka plan sahnesi 15 fps'e iner.

**Düzen.** Solda dört sekmeli bilgi paneli — **Sözleşme** (Sözleşme Kartı: yalnızca açılmış maddeler parlak, diğerleri soluk "Bu madde için müşteriye sormadın"; imza satırı baştan açık), **Açık Testler** (A1–A6 `TestListRow`), **İpuçları** (Pusula → Fener → Taslak → Örnek, ücretsiz ve sınırsız), **Müfettiş** (gizli test paneli) —; ortada `CodeEditor` (Monaco, `profile: 'isletme'`), altında eylem çubuğu ve sonuç tablosu; sağda **Usta Yorumu** kartı ve **şikâyet balonları**. Salt okunur satırlar (sınıf başlığı, imza, kapanış parantezleri) soluktur ve sol kenarda kilit ikonu taşır; editlenebilir aralık turkuaz sol çubukla işaretlidir.

**Eylem düğmeleri.** **Testleri Çalıştır** (`Ctrl+Enter`): açık testleri koşturur. **Müfettişi Çağır**: yalnızca A1–A6 yeşilken parlar; gizli 14 + tohumlu 6 testi koşar; günde en çok 10 çağrı (B5 önerisi; sayaç "Bugün 2/10" görünür). **Sıfırla**: iskelete döner (onaylı). "**Örnek Çözümü Yükle**" yalnızca **prototip** demo düğmesidir; üretimde referans çözüm sunucudan çıkmaz (KANON §5.1) ve yerine ipucu merdiveninin **Örnek** kademesi (benzer ama farklı mini problem: bisiklet kiralama) vardır. Üç başarısız çalıştırmadan sonra Usta "Pusula ister misin?" diye **önerir**, zorlamaz (B5 §3.9). İpucu kullanımı gelire, Savunma'ya ve rozetlere etki etmez; ipuçsuz ilk deneme **Berrak Zihin** (+%15 XP) tutar.

**Çalıştırma akışı.** `POST /v1/challenges/otopark-L1/submissions` (`businessId`, `source`, `telemetry{pasteCount, typingMs, keyToSubmitMs}`; `Idempotency-Key`) → 202 `submissionId`, `etaMs ≈ 1.800`; sonuç `job.completed` olayı ya da `GET /v1/challenge-submissions/{id}` ile gelir. Sonuç `compile{ok, ms, diagnostics[]}` ve `tests{public{passed,total,items}, hidden{passed,total,failedLabels}, seeded{passed,total}}` taşır, `verdict` ise `savunma_bekliyor` | `derlenemedi` | kalan test durumudur. Derleme hatası HTTP hatası değil sonuçtur: `{code: "CS1002", line: 8, column: 38, messageTr: "Satır sonunda `;` eksik."}` Monaco işaretçisi (kırmızı dalga) ve `ErrorPanel` satırı olur ([Satıra Git]). Oyuncunun yazma süresi ve yapıştırma sayısı telemetri **işaretidir**, ceza değildir; UI'da hiçbir yerde görünmez (yalnızca işaretliyse Savunma'da "Bayt, Savunma'dan sonra yatacak" notu). Sandbox p95 < 6 sn; bekleme sırasında test satırları `çalışıyor` döner. Hız sınırı oyuncu başına 10/dk (patlama 5), 300/gün; aşımda "Biraz yavaş: {n} sn sonra tekrar dene."

**Müfettiş.** Müfettiş (trençkot, fötr şapka, renkli dosya) kapıyı çalar (1,2 sn); panelde "Müfettiş 20 test çalıştırıyor… 12/20" ilerler. Sonuç **kategori etiketli şikâyet balonu** olarak gelir; gizli girdi ve beklenen değer **asla** yazılmaz (B5 §1.9). Sekiz kategori (B5 §3.5; balon metinleri B8 önerisi, B5 §7.1 ile hizalanır): `hemen-cikanlar` "Girip hemen çıkan müşteriler yanlış ücret ödedi." · `iki-saatten-az` "2 saatten az kalanlar yanlış ücret ödedi." · `iki-saat-civari` "2 saat civarı kalanlar yanlış ücret ödedi." · `iki-alti-arasi` "2–6 saat arası kalanlar yanlış ücret ödedi." · `alti-saat-civari` "6 saat civarı kalanlar yanlış ücret ödedi." · `gunluk-tarife` "Günlük tarifeye girenler yanlış ücret ödedi." · `bir-gun-civari` "Bir gün civarı kalanlar yanlış ücret ödedi." · `gunu-asanlar` "Bir günü aşanlar yanlış ücret ödedi." Müfettiş'in tek resmî cümlesi: "Dosya bıraktım." Tamamı geçince "Savunma'ya Geç" düğmesi parlar. **Usta Yorumu** (kod incelemesi, tüm testler yeşil olunca, +10–30 XP, gelire etkisiz, ≤ 80 kelime) sağ kartta çıkar; testler kırmızıyken "Usta'ya sor" Sokratik yönlendirme verir (Kurul kotasına sayılır, çözüm yazmaz).

**Mobil kuralı.** Dokunmatik cihazda editör **varsayılan salt okunurdur** (CodeMirror 6, kod yardımcı çubuğu kapalı): üstte "Bu işletmenin kodu masaüstünde daha rahat yazılır. Bağlantıyı kendine gönder, bilgisayarda aç." kartı ve [Bağlantıyı Kopyala] [Yine de Burada Yaz] düğmeleri; "Yine de burada yaz" seçilince kod yardımcı çubuğu açılır (§14.3). Test çalıştırma ve Müfettiş mobilde de çalışır.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD odak şeridi | 0,0,1280,48 | 0,0,390,48 | Geri, "İş Emri #1 — Otopark · Editör", 4 px XP çizgisi |
| Sekme çubuğu (mobil) | — | 0,48,390,44 | Kod · Sözleşme · Testler · İpuçları · Müfettiş |
| Sol bilgi paneli | 16,56,352,728 | — | Sözleşme · Açık Testler · İpuçları · Müfettiş sekmeleri (mobilde sekme çubuğu ve "Sonuç" alanı) |
| Editör | 384,56,552,436 | 0,92,390,340 | `CodeEditor` (isletme); mobilde salt okunur önizleme |
| Masaüstü kartı (mobil) | — | 12,440,366,96 | "Sonra masaüstünde devam et" + [Bağlantıyı Kopyala] [Yine de Burada Yaz] |
| Eylem çubuğu | 384,500,552,56 | 0,544,390,60 | Testleri Çalıştır · Müfettişi Çağır (Bugün 2/10) · Sıfırla |
| Sonuç tablosu | 384,564,552,220 | 0,612,390,232 | A1–A6 satırları + özet "4/6 geçti"; derleme hatası paneli; mobilde seçili sekmenin içeriği |
| Usta Yorumu | 952,56,312,360 | — | Kod incelemesi / "Usta'ya sor" yanıtı (mobilde Sonuç alanında) |
| Şikâyet balonları | 952,424,312,360 | — | Müfettiş balonları ve dosyalar (mobilde Müfettiş sekmesi) |

**Bileşenler:** `CodeEditor`, `TestListRow`, `ContractCard`, `HintLadder`, `InspectorPanel`, `ComplaintBubble`, `UstaReviewCard`, `ErrorPanel`, `Tab`, `Button`, `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Editör iskeleti + "İş emri yükleniyor…"; Monaco parçası yüklenirken satır numaralı salt okunur `CodeBlock` |
| Boş | İlk açılış: iskelet kod, aralık `// kodun buraya`; test satırları `bekliyor` |
| Hata | Derleme: "Satır 8: satır sonunda `;` eksik. (CS1002)" · zaman aşımı: "Kodun 10 saniyede bitmedi; sonsuz döngü olabilir." · `SANDBOX_BUSY`: "Atölye şu an yoğun; birkaç sn sonra dene." · sınır: "Müfettiş bugünlük çok çalıştı (10/10). Yarın tekrar çağırabilirsin." |
| Çevrimdışı | "Çevrimdışısın. Kodunu yazabilirsin, çalıştırmak için bağlantı gerekiyor." (taslak cihazda; `Ctrl+Enter` devre dışı) |
| Kararmış | Üstte mercan şerit: "İşletmen kararmış. Müfettişin dosyasına bak." + kırmızı dosya (hangi kategori) |
| Açık test yeşil | "Altı yeşil, bitti" tuzağına karşı: [Müfettişi Çağır] parlar ve altında "Açık testler gizli testlerin hepsini söylemez." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| `Ctrl+Enter` / [Testleri Çalıştır] | Satırlar `bekliyor → çalışıyor → geçti/kaldı` (120 ms aralık); özet "4/6 geçti" | `test_pass` / `test_fail` |
| Derleme hatası | Satır işaretlenir; hata paneli Türkçe mesajı verir; [Satıra Git] | `ui_error` |
| Satıra dokun (kaldı) | Beklenen/gerçek farkı açılır: "beklenen 250 · gerçek 280" | `ui_tap` |
| İpucu basamağı | Basamak sırayla açılır (atlama yok), içerik panelde kalır | `ui_tap`; 240 ms |
| [Müfettişi Çağır] (A1–A6 yeşil) | Müfettiş animasyonu → gizli + tohumlu sonuç; kalan varsa balon | `door`; 1,2 sn giriş |
| 26/26 | Usta Yorumu kartı açılır (+XP), "Savunma'ya Geç" parlar | `confetti` (küçük), `xp_tick` |
| [Savunma'ya Geç] | `savunma` panel olarak açılır | Panel geçişi 240 ms |
| 3 başarısız çalıştırma | Usta balonu: "Pusula ister misin?" (öneri) | — |

**Veri:** `GET /v1/challenges/{challengeId}` (oyuncu görünümü: `iskelet_kod`, `public_tests`, `gizli_test_adedi`, `tohumlu_test_adedi`, `ipucu_kademeleri`, `odul`; `state.clarifications`), `POST /v1/challenges/{challengeId}/submissions`, `GET /v1/challenge-submissions/{submissionId}`, `GET /v1/businesses/{businessId}/contract-card`, `GET /v1/hints?targetId=&level=`, `GET /v1/errors/translations/{csCode}`, `POST /v1/businesses/{businessId}/defenses` (Savunma'ya geçişte).

**Mikro etkileşimler.** Test satırı geçince nane tik 160 ms büyür; kalan satır sarsılmaz (yalnız renk); Müfettiş balonu sarı kâğıt hışırtısıyla açılır (ses açıksa); "Savunma'ya Geç" düğmesi altın uçlu 1,2 sn nabız atar. **Erişilebilirlik.** Monaco'da `Ctrl+M` Tab odağı çıkışı alt çubukta yazılıdır; test özeti `role="status"` ("6 testten 4'ü geçti"); hata paneli `role="alert"`; balonlar `role="listitem"` ve kategoriyi metinle söyler; salt okunur satırlar `aria-readonly`; Türkçe Q klavyede `{ }` için AltGr ipucu ve isteğe bağlı Kod Tuşları çubuğu (§13.5).

### 6.13 Savunma (`savunma`) — ayrıntılı

**Amaç.** Açılış'tan önceki son kapı: tüm testler (6 açık + 14 gizli + 6 tohumlu = 26) geçince **Kurul** oyuncunun **kendi kodundan bir satır** seçer ve **Hasan Abi'nin ağzından** sorar: *"121 dakika neden 120 TL? Hangi satır belirliyor?"* Oyuncu satırın ne yaptığını kendi cümleleriyle açıklar (≤ 1.500 karakter, KANON §9). Kurul ≥ 70 verirse **Açılış** (tam gelir, +300 XP); altındaysa **Deneme** (gelir %50, şikâyet balonu, 24 saat sonra yeni Savunma hakkı). Savunma kopya savunmasının da yüzüdür: yapıştırma telemetrisi (AST benzerliği > %95 ya da 30 sn altı yazım) bir şey değiştirmez, yalnızca Bayt'ın Savunma'dan **sonra** ödenmesini sağlar; ekranda suçlayıcı hiçbir metin yoktur. HUD **odak**; sahne yoktur (sonuç anında parsel sahnesi canlıdır).

**Kurallar.**

1. Kod görünümü **salt okunur ve kilitlidir**: oyuncu soruyu gördükten sonra kodu değiştiremez.
2. Seçilen satır turkuaz çubukla vurgulanır; üstüne gelince/odaklanınca "Kurul bu satırı seçti" ipucu çıkar.
3. **Rubrik cevap kutusunun üstündedir** ve bir cümleyle açıklanır: *Doğruluk 50 (satırı doğru anladın mı?) · Tamlık 30 (sınır değerleri ve nedeni) · Açıklık 20 (anlaşılır mı?)* (B3 ile hizalanır).
4. Zaman sayacı **yoktur** ("zamanlayıcı kasada durur, derste değil"). Çıkılırsa soru ve taslak saklanır; dönüşte aynı satır sorulur (B3 ile hizalanır).
5. "Cevabı Gönder" ≥ 40 karakterde etkinleşir (Kurul Kartı ile aynı alt sınır); sayaç 1.400'de amber, 1.500'de durur. **Yapıştırma bu kutuda kapalıdır** (ipucu: "Burada kendi cümlelerin lazım."; B3 §9.3); sesle yazma ve ekran klavyesi çalışır.
6. Kurul güveni düşükse (< 0,65) ya da puan 70'in ± 5'indeyse ikinci kör okuma yapılır; bu sırada kart "Kurul bu cevabı bir kez daha okuyor." der ve en çok 8 sn bekler (KANON §9).
7. Sonuç kartı Usta soruları ile aynı **Kurul Kartı** bileşenidir (puan halkası + 3 ölçüt satırı + Hasan Abi'nin tek cümlesi); "İtiraz Et" Savunma için de görünür (B3 ile hizalanır).

**Örnek (B5 §3.7 D1 / B3 §9.3).** Kurul oyuncunun kodunda `(<=|<)\s*360|\*\s*40` desenini eşleyerek 11. satırı (`if (dakika <= 360) return saat * 40;`) seçer; Hasan Abi: *"Zeynep, 121 dakika kalan müşteri neden 120 TL ödüyor? Hangi satır belirliyor, ben de bakayım."* İyi cevap (94/100: Doğruluk 48 · Tamlık 28 · Açıklık 18): *"121 dakika 120'den büyük ve 360'tan küçük olduğu için 2. dilimde. Bu dilimde ücret başlayan saat × 40. 121 dakika 2 saati bir dakika geçtiği için 3. saat başlamış sayılıyor: (121 + 59) / 60 = 3. Yani 3 × 40 = 120. Dilimi seçen koşul `if (dakika <= 360)`, ücreti veren ifade `return saat * 40;`."* Zayıf cevap (42/100 → Deneme): *"Çünkü 121, 120'den büyük."* Hasan Abi'nin geri bildirimi puan söylemez (B3 §4.2): *"Zeynep, satırı da hesabı da anlattın; 121 dakikanın 120 TL ettiğini ben de gördüm. Bariyeri kaldırıyorum, ilk araba geliyor."*

**Açılış sinematiği** (≈ 6 sn, "Atla" düğmeli, parsel sahnesi canlı): bariyer kolu yuvaya "tak" sesiyle oturur, inşaat bandı yanarak kaybolur, 12 park yeri çizgisi soldan sağa 1 sn'de çizilir, gişe yükselir, kasa kapının yanına düşer, konfeti patlar, LED panoda "Yeni işletme: @zeynep_cs'nin Otoparkı — Çarşı" akar ve ilk NPC araba bariyerden girer (B1 §6.3); HUD'da "+300 XP" sayar. Kapanışta [İşletmeyi Gör] → `sokak`. **Deneme sonucu** sinematiksizdir: tabela yarım yanar, sarı "DENEME" bandı oturur; kart "İşletmen Deneme modunda açıldı. Gelir %50; 24 saat sonra yeniden Savunma yapabilirsin." der ve "Satırı yeniden oku: 121 dakika hangi koşula giriyor?" ipucunu gösterir. Hiçbir sonuç ekranında "başarısız" sözcüğü kullanılmaz ("henüz değil; şu satıra bak").

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD odak şeridi | 0,0,1280,48 | 0,0,390,48 | Geri, "Savunma — Otopark", 4 px XP çizgisi |
| Kod görünümü | 32,64,640,560 | 12,56,366,208 | `CodeBlock`, satır numaralı, salt okunur; mobilde seçilen satırın ±5 satır penceresi + [Tüm Kodu Gör] |
| Soru kartı | 688,64,560,176 | 12,272,366,128 | Hasan Abi portresi + soru + "Kurul bu satırı seçti: 11" |
| Açıklama kutusu | 688,256,560,240 | 12,408,366,200 | Rubrik satırı (üstte) + çok satırlı kutu + karakter sayacı |
| Bilgi şeridi | 688,504,560,72 | 12,616,366,48 | "Kodun kilitli." · "Bayt, Savunma'dan sonra hesabına geçecek." (yalnız telemetri işaretliyse) |
| Gönder çubuğu | 688,592,560,72 | 12,672,366,64 | "Cevabı Gönder" · "Durdur" |
| Test özeti ve sonuç şeridi | 32,640,640,144 | 12,744,366,60 | "26/26 test geçti" (6 açık · 14 gizli · 6 tohumlu); sonuç gelince Açılış/Deneme şeridi |

**Bileşenler:** `CodeBlock`, `ChatBubble` (Hasan Abi), `RubricBar`, `KurulCard`, `Button`, `TestListRow` (özet), `Modal` (Açılış), `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Kurul kodunu okuyor…" (mühür döner) |
| Boş | Kutu yer tutucusu: "Satırın ne yaptığını kendi cümlelerinle anlat." |
| Hata | "Savunma sorusu alınamadı." [Tekrar Dene] · "Kurul şu an yoğun, biraz sonra tekrar dene." |
| Çevrimdışı | "Çevrimdışısın. Cevabın taslak olarak kaydedildi; bağlanınca gönderebilirsin." |
| Kota | "Kurul bugünlük kapandı, cevabın sırada." Cevap kaydedilir, gece puanlanır (KANON §9); sonuç gelene kadar işletme Deneme gelirinde çalışır (B3/B2 ile hizalanır) |
| Kurul değerlendiriyor | "Kurul değerlendiriyor…" mühür animasyonu + [Durdur] |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Kutuya yaz | Sayaç; ≥ 40 karakterde düğme etkin; yapıştırma engellenir | — |
| "Cevabı Gönder" | `defense/answers`; mühür animasyonu; p95 < 4 sn | `seal_stamp` (sonuçta) |
| Kurul ≥ 70 | Kurul Kartı → 1,2 sn sonra Açılış sinematiği; `award({xp: 300})` | `barrier_open`, `confetti`, `xp_tick` |
| Kurul < 70 | Kurul Kartı → Deneme kartı; işletme sarı bantlı açılır | `ui_soft_miss`; floresan "bzzt" |
| "Durdur" | İstek iptal edilir, taslak korunur | — |
| "Atla" (sinematik) | Doğrudan sonuç kartı | — |

**Veri:** `POST /v1/businesses/{businessId}/defenses` (Kurul satırı seçer → `defenseId`, `satir_no`, soru, rubrik), `POST /v1/defenses/{defenseId}/answers` (202), sonuç `job.completed` olayı ya da `GET /v1/defenses/{defenseId}` (Açılış / Deneme); Açılış ödülü `user.xp` ve `user.wallet` olaylarıyla gelir.

**Mobil.** Kod penceresi yalnız seçilen satırın çevresini gösterir; klavye açılınca soru kartı kaydırılır ama kaybolmaz; "Cevabı Gönder" klavye üstünde sabittir. **Mikro:** seçilen satırdaki turkuaz çubuk 1,2 sn aralıkla nabız atar (reduced-motion'da sabit); mühür dönerken 3 noktalı yazı "değerlendiriyor"; Açılış'ta HUD sayacı 1.200 ms sayar. **Erişilebilirlik:** okuma sırası kod → soru → rubrik → kutu; seçilen satır `<mark>` ve "Kurul'un seçtiği satır: 11. satır" etiketi; sonuç `role="status"`; sinematik ≤ 3 flaş/sn ve "Atla" ile geçilir (WCAG 2.3.1); reduced-motion'da sinematik tek kare "İşletme açıldı" kartıdır.

### 6.14 İşletme Paneli (`panel`) — ayrıntılı

**Amaç.** Sahibin işletmesini yönettiği tek yer: günlük sayılar, **gelir grafiği (TL ve B ayrı iki küçük grafik; her biri tek seri)**, **Kasa**, **yükseltme listesi (L2–L5)**, **Hata Bildirimi dosyaları** ve **Vitrin ayarı**. "Mobilde okunur" ilkesinin ana ekranıdır: kasa buradan uzaktan toplanabilir (yerinde toplamaya prim yoktur, B2 §8.3). Üstte işletme seçici vardır (Otopark, Büfe…); çok işletmeli oyuncuda Sev. 12'den itibaren "Hepsini Topla" HUD'dan gelir. HUD **kompakt**.

**Sayılar.** Otopark L1 günlük sentetik trafik 12 araçtır (%45 / %35 / %18 / %2); toplam ≈ 2.220 TL → **≈ 220 B/gün** (10 TL = 1 B). Kasa **8 saatlik** üretimi tutar (≈ 73 B), dolunca üretim durur (kayıp yok); günde 3 toplama tam gelirdir. Gelir, oyuncunun kodunun sentetik trafikte ürettiği TL'nin **referans çözümle tavanlı** değeridir; AI çarpanı yoktur. Panel gerçek sayıları gösterir; sahnedeki görsel trafik (≈ 45 sn/araç) ekonomiden bağımsızdır (B1 §6.3). Deneme modundaki işletmede gelir %50 yazılır ve panelin üstünde sarı şerit durur: "Deneme modu: gelir %50. Savunma hakkın 11 sa 20 dk sonra."

**Yükseltme listesi (B2 fiyatları, VİZYON §7 istekleri):**

| Seviye | Müşteri isteği | Fiyat | XP | Tahmini gelir | Sahnedeki ek | Şart |
|---|---|---|---|---|---|---|
| L2 | "Aylık abonelerin plakaları listede; onlar ödemesin." | 500 B | 150 XP | ≈ 350 B/gün | Metal çerçeveli tabela, ikinci şerit, plaka okuyucu; Vitrin açılır | Ders 2.1 Liste Kur: `List<T>` (Liman) |
| L3 | "Engelli ve elektrikli araçlara %50 indirim; bozuk bariyer kaydı gelirse hata ver." | 1.200 B | 250 XP | ≈ 560 B/gün | İkinci kat, şarj direği | Dersler 3.1–3.4 (Atölyeler: `enum`, `exception`) |
| L4 | "22:00–06:00 gece tarifesi sabit 150." | 2.500 B | 400 XP | ≈ 900 B/gün | Aydınlatma direkleri, neon şerit | Ders 4.7 (Kampüs: `DateTime`) |
| L5 | "Kapasite 50; doluysa reddet, bekleyenleri sırala." | 5.000 B | 600 XP | ≈ 1.440 B/gün | Otomat, DOLU/BOŞ sayacı | Dersler 6.1–6.3 (Finans: durum, kuyruk, `async`) |

Her satırda durum (Hazır / Şart eksik / Kilitli) rozet + metindir; [Yükselt] seçilince onay modali açılır ve yeni müşteri isteği olarak `is-emri` başlar (yükseltmenin kod şartı vardır; sıra B2/B5 ile hizalanır).

**Hata Bildirimi dosyaları.** Müfettiş günde en çok 3 sarı dosya bırakır. Örnek dosya: *"HB-0412 · Otopark · Müşteri 1.440 dakika için 500 TL ödemiş."* Dosyada başkasının hatalı kodu vardır (referans çözüme enjekte edilmiş mutasyon: `int gun = dakika / 1440 + 1;`, doğrusu `(dakika + 1439) / 1440`); ödül 40–120 B (bu dosya 60 B + 40 XP). [Hatayı Bul] → `atolye?gorev=hb-0412` (Atölye, "Neden?" alanıyla).

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Başlık + işletme seçici + sekmeler | 16,72,1248,96 | 0,56,390,52 | "Otopark · Çarşı · Tente Sokak No: 3" · durum rozeti · seçici; mobilde sekmeler: Gelir · Yükseltme · Dosyalar · Vitrin |
| Özet kartları | — | 12,116,366,88 | Bugün: 12 araç · 2.220 TL · 220 B (masaüstünde başlık satırının sağında) |
| Gelir grafiği — TL | 16,184,612,264 | — | Son 7 gün, tek seri; mobilde "Gelir" sekmesi |
| Gelir grafiği — Bayt | 644,184,620,264 | — | Son 7 gün, tek seri |
| Kasa kartı | 16,464,400,320 | 12,212,366,132 | `VaultGauge` 61/73 B · [Kasayı Topla] |
| Yükseltme listesi | 432,464,480,320 | — | L2–L5 satırları |
| Hata Bildirimi dosyaları | 928,464,336,200 | — | Sarı dosya kartları |
| Vitrin ayarı | 928,680,336,104 | — | Anahtar + açıklama |
| Sekme içeriği (mobil) | — | 12,352,366,404 | Seçili sekmenin içeriği (grafikler, liste, dosyalar, Vitrin) |
| Alt eylem çubuğu (mobil) | — | 0,764,390,80 | [Kasayı Topla (61 B)] |

**Bileşenler:** `Chart` (çizgi/sütun, tek seri), `VaultGauge`, `Card`, `Badge`, `Tab`, `Button`, `Modal` (yükseltme onayı), `Toggle`, `EmptyState`.

Örnek gerçek veri (Otopark L1, son 7 gün; Çar 4 Kas – Sal 10 Kas): TL: **2.190 · 2.250 · 2.310 · 2.060 · 2.440 · 2.390 · 2.220**; B: **219 · 225 · 231 · 206 · 244 · 239 · 222** (toplam 1.586 B). Kasa 61/73 B, dolmasına 1 sa 18 dk. Grafikte yatay eksen "Çar Per Cum Cmt Paz Pzt Sal", dikey eksen `tr-TR` ("2.000"); her grafiğin altında "Veriyi tablo olarak göster" düğmesi vardır.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Kart iskeletleri; grafik alanı soluk çizgi |
| Boş | Henüz işletme yok: "Henüz işletmen yok. İlk tapun Çarşı'da seni bekliyor." [Haritayı Aç]. Açılıştan yeni sonra: "İlk gelir yarın sabah burada." |
| Hata | "Panel yüklenemedi." [Tekrar Dene] · kasa toplama hatası: "Kasa toplanamadı. Paran güvende; tekrar dene." |
| Çevrimdışı | Son bilinen sayılar soluk; "Çevrimdışısın. Kasayı toplamak için bağlantı gerekiyor." |
| Kararmış | Üstte mercan şerit: "İşletmen kararmış. Müfettişin dosyasına bak." [Editörü Aç] |
| Deneme | Üstte sarı şerit (yukarıdaki metin) |
| Vitrin kilitli | "Vitrin, işletmen L2 olunca açılır." (anahtar devre dışı) |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| [Kasayı Topla] | Kasa boşalır; sayaç `+61 B` sayar; kalan kesir kasada kalır | `coin_pickup`; paralar HUD'a uçar |
| [Yükselt] (L2) | Onay: "L2 için 500 B ve yeni bir müşteri isteği. Başlayalım mı?" → `is-emri` | `ui_confirm` |
| Grafik noktasına odak/hover | Ayrıntı: "Cmt 7 Kas · 2.440 TL · 244 B" | `ui_tap` |
| [Hatayı Bul] | `atolye?gorev=hb-0412` | panel geçişi |
| Vitrin anahtarı | Açılır: "Kodun ve Savunma cevabın Vitrin'de görünecek." | `ui_confirm` |
| İşletme seçici | Panel o işletmeye geçer | 160 ms çapraz solma |

**Veri:** `GET /v1/businesses`, `GET /v1/businesses/{businessId}` (durum, seviye, kasa: `balance`, `ratePerHour`, `capHours`), `GET /v1/businesses/{businessId}/runs` (günlük gelir; TL ve B), `GET /v1/businesses/{businessId}/runs/{runDate}` (şikâyet balonları), `POST /v1/businesses/{businessId}/vault/collections` (`Idempotency-Key`), `POST /v1/vault-collections` (Hepsini Topla, Sev. 12+), `POST /v1/businesses/{businessId}/upgrades`, `GET /v1/bug-reports`, `PATCH /v1/businesses/{businessId}` (Vitrin ayarı; işletme adı 200 B).

**Mobil.** Özet kartları ve kasa her zaman görünür; geri kalan dört içerik sekmelidir; kasa toplama alt çubukta başparmak bölgesindedir. **Mikro:** grafik çizgisi 600 ms soldan sağa çizilir; kasa dolunca Bayt ikonu zıplar; yükseltme satırı hazır olunca nane çerçeve 1,2 sn parlar; Hata Bildirimi dosyası sarı kâğıt hışırtısıyla açılır. **Erişilebilirlik:** grafikler `role="img"` + özet etiketi ("Son 7 gün günlük gelir, 2.060 ile 2.440 TL arası") ve tablo alternatifi; renk yalnız çizgi değildir (TL kobalt dolgusuz, B amber dolgulu + işaretçi şekilleri farklı); yükseltme satırlarında kilit nedeni metindir; durum şeritleri `role="status"`.

### 6.15 Metro Haritası (`metro`)

**Amaç.** C# konu haritası (yetenek ağacı): **her semt bir hat, her ders bir durak** (KANON §2.2). Durak rengi gri (kilitli) → sarı (başlandı) → yeşil (Ders Mührü) → **altın** (Günlük Tekrar'da 3 kez üst üste doğru = kalıcı; unutulan durak yeşile düşer, cezasız). Dağıtılacak puan yoktur. Altın durak sayısı **Kalıcılık Ligi**'nin puanıdır. MVP'de 18 durak çizilir (Çarşı 12 + Liman 6, VİZYON §13); diğer hatlar kesikli çizgiyle "inşaat halinde" gösterilir. HUD kompakt.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Metro şeması | 16,72,904,712 | 0,56,390,500 | SVG: 7 hat (45° bükümlü), duraklar, aktarma durakları; mobilde kaydırılır/yakınlaştırılır |
| Özet kartı | 936,72,328,140 | 12,564,366,64 | "Altın durak 3 · Yeşil 5 · Sarı 1 · Gri 9" + Kalıcılık Ligi bağlantısı |
| Durak detay kartı | 936,228,328,376 | 0,636,390,208 | Seçili durak: ders adı, durum, XP, süre, soru tipleri, [Derse Git] / [Tekrar Et] |
| Hat lejantı | 936,620,328,164 | — | Durak şekilleri ve renkleri; hat numaraları (mobilde "?" düğmesi) |

**Bileşenler:** `MetroMap` (SVG), `Badge` (durak durumu), `Card`, `Button`, `Tab` (hat filtresi), `ProgressRing`.

Durak durumu hiçbir zaman yalnız renkle verilmez: **gri** içi boş daire + küçük kilit · **sarı** yarım dolu daire · **yeşil** dolu daire + tik · **altın** dolu daire + dış halka + dört ışın. Hatlar renk + numara (1–7) ile ayrılır (§3.5).

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Metro haritası çiziliyor…" (hatlar soldan sağa çizilir) |
| Boş | Yeni oyuncu: "Henüz mührün yok. İlk durağın Ders 1.1." (1.1 durağı sarı nabız) |
| Hata | "Harita yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | "Son bilinen harita gösteriliyor." (soluk) |
| Örnek detay | "1.3 Kararlar · Yeşil (mühürlü) · Günlük Tekrar: 2/3 doğru, altın için 1 tur daha · 100 XP · ≈ 9 dk" |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Durağa dokun/odak | Detay kartı güncellenir; durak 160 ms büyür | `ui_tap` |
| [Derse Git] | `derslik?ders=…` (açık ders); kilitli dersse neden metni | `ui_confirm` |
| [Tekrar Et] (yeşil/altın) | Dersi tekrar açar (0 XP, "tekrar" etiketi) | — |
| Yeni mühür (başka ekrandan dönünce) | Durak sarıdan yeşile 400 ms dolar | `seal_stamp` |
| Durak altın oldu | Halka 800 ms yayılır; özet sayacı artar | `gold_chime` |
| Altın sayacına dokun | `liderlik?sekme=kalicilik` | — |

**Veri:** `GET /v1/players/me/metro` (hatlar, duraklar, durum, altın sayısı), `GET /v1/lessons/{lessonId}` (detay kartı için özet).

**Mobil.** Şema 1,5× genişliktedir; kaydırma + iki parmak yakınlaştırma; detay kartı alt sayfa; hat filtresi çipleri (Hepsi, 1…7). **Mikro:** unutulan durak yeşile düşerken sessiz 600 ms renk geçişi (uyarı sesi yok); yeni altın durakta "Mühür Vur" emote önizlemesi ipucu olur (10 altın durakta açılır, B1 §7.3). **Erişilebilirlik:** SVG durakları hat sırasıyla `<ol>` içinde `button`; etiket "Çarşı hattı, 3. durak, Kararlar, mühürlü, altına 1 tur kaldı"; "Liste görünümü" tuşu; renk + şekil + metin.

### 6.16 Günlük Tekrar (`tekrar`)

**Amaç.** 3 dakikalık günlük mini döngü: aralıklı tekrar kuyruğundan (her Ders Mührü 1-3-7-21. günlerde döner) **5 karışık soru**; ödül **20 B + 15 XP + seri günü**; seri 7'ye ulaşınca Bayt ×1,5 (30 B); haftada 1 ücretsiz dondurma (04:00'te otomatik kullanılır); **Seri Dondurucu** 50 B (stok ≤ 2; asla Çip); seri kırılırsa 48 saat içinde 10 soruluk **Onarım Turu** (B6 §3.2). Ödül beş sorunun **cevaplanmasına** bağlıdır, doğruluğa değil. Günde 1 kez ödül verir. "3 dk" hedef süredir, kesme değildir: sayaç yukarı sayar (zamanlayıcı kasada durur, derste değil; B4/B6 sert süre isterse güncellenir). HUD **odak**.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD odak şeridi | 0,0,1280,48 | 0,0,390,48 | Geri, "Günlük Tekrar", 4 px XP çizgisi |
| Üst şerit | 240,72,800,64 | 12,56,366,56 | Soru 2/5 · süre 1:12 · seri 4 gün |
| Soru kartı | 240,152,800,248 | 12,120,366,200 | Soru metni + `CodeBlock` |
| Yanıt alanı | 240,416,800,216 | 12,328,366,300 | Çoktan seçmeli seçenekler ya da kısa cevap alanı |
| Alt şerit | 240,648,800,72 | 0,764,390,80 | İlerleme noktaları · [Kontrol Et] / [Sonraki] |
| Seri paneli | 1056,152,208,248 | 12,636,366,64 | 7 günlük seri takvimi, ücretsiz dondurma "1/1", Seri Dondurucu stoğu "0/2" + [Satın Al — 50 B] (mobilde tek satır) |

**Bileşenler:** `Card`, `CodeBlock`, `RadioCard`, `Input`, `Button`, `ProgressRing`, `Badge` (seri), `Modal` (dondurma onayı).

Örnek sorular (Çarşı derslerinden): *"`int sonuc = 7 / 2;` — `sonuc` kaç olur?"* (3 · 3,5 · 4 · Hata) ve *"`(61 + 59) / 60` kaçtır?"* (2). Yanlışta doğru cevap ve tek cümlelik neden gösterilir, soru ertesi gün kuyruğa geri döner (1-3-7-21).

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Sorular hazırlanıyor…" |
| Boş / açılış | Açılış kartı: "Bugünün 5 sorusu hazır. Hedef süre 3 dakika; yetmezse devam edebilirsin." · Kuyruk az: "Bugün vadesi gelen soru az; yakın zamanda öğrendiklerinden tamamladık." · Henüz Mühür yok: "Henüz tekrar edilecek bir şey yok. İlk dersini bitir, yarın burada olacağım." · Bugün yapıldı: "Bugünkü tekrarı yaptın. İstersen Serbest Tekrar'la devam et; ödül yok ama durakların pekişir." |
| Hata | "Günlük Tekrar yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | "Bağlantı yok. Soruları çözebilirsin; bağlanınca kaydederiz." (son soru paketi önbellekten; tamamlama sunucuda işlenir) |
| Sonuç / seri | "Bugünkü tekrar tamam. +20 B, +15 XP. Seri: 5 gün." · 7. gün: "7 gün üst üste. Seri bonusu açıldı: bundan sonra tekrar başına 30 B." · Dondurma: "Dün yoktun; ücretsiz dondurma serini korudu." · Seri durdu: "Serin 14 günde durdu. Onarım Turu ile geri alabilirsin: 10 soru, 48 saat içinde." ("kaybettin" denmez) · Bayram: "Bayramınız kutlu olsun. Bu günler serini bozmaz." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Seçenek seç → [Kontrol Et] | Anında doğru/yanlış, kısa neden | `test_pass` / `test_fail`; 160 ms renk |
| 5. soru tamam | Sonuç kartı + `award({xp: 15, bayt: 20})`; Metro'da duraklar altın/yeşil güncellenir | `coin_pickup`, `xp_tick`; seri takvimi bugünü doldurur |
| [Seri Dondurucu — 50 B] | Stok +1 (en çok 2); dondurma 04:00'te otomatik kullanılır, oyuncu seçmez; onay: "Seri Dondurucu için 50 B harcıyorsun." | `coin_spend` |
| Haftalık ücretsiz dondurma | Kendiliğinden kullanılır; hak "0/1" olur | — |
| Süre 3:00'ı geçti | Halka yeşilden sarıya döner: "3 dakika doldu. Acele yok; kalan soruları bitirmen yeterli."; tur kesilmez | — |
| Soru ekrana geldi | Cevap, soru en az 3 sn ekranda kaldıktan sonra kabul edilir (refleks tıklamasına karşı); düğmenin çevresindeki halka dolar | — |

**Veri:** `GET /v1/reviews/daily` (5 soru, sayaç), `POST /v1/reviews/daily/answers` (cevap / tamamla), `GET /v1/players/me/streak`, `POST /v1/players/me/streak/freezes` (Seri Dondurucu satın alma; stok ≤ 2; `Idempotency-Key`).

**Mobil.** Soru ve seçenekler dikey; seçenek kartları ≥ 56 px; [Kontrol Et] alt çubukta sabit. **Mikro:** doğru seçenek nane 160 ms parlar; yanlışta seçenek mercan çerçeve alır, doğru olan nane ile gösterilir (sarsıntı yok); seri takvimi bugünün noktası 400 ms dolar. **Erişilebilirlik:** seçenekler `radiogroup` (ok tuşları); geri bildirim `role="status"`; süre görünür ama `aria-live="off"` (okuyucuyu bunaltmaz), yalnızca 3:00'da bir kez anons.

### 6.17 Oda (`oda`)

**Amaç.** Oyuncunun evi (Sev. 2'de açılır, Bloklar): başlangıç **Stüdyo**, 6×6 ızgara, 25 eşya, kapasite 20 avatar (KANON §2.2). İki mod: **Gez** (varsayılan; ziyaretçi de bu moddadır) ve **Düzenle** (ızgara görünür, envanter alttan açılır). İşlevsel eşyalar: Çalışma Masası (son geçilen testi gösterir), Ziyaretçi Defteri (son 20), Rozet Duvarı. İzin modları: **Herkese açık**, **Arkadaşlara** (15–17 için varsayılan), **Zilli** (B1 §5.4). Sahibi çevrimdışıyken de girilir.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| Oda sahnesi (zemin) | 0,0,1280,800 | 0,0,390,844 | `oda-{roomId}`: Stüdyo 6×6 + iki duvar |
| HUD üst şerit | 0,0,1280,64 | 0,0,390,56 | §5 (Gez'de tam, Düzenle'de kompakt) |
| Düzenleme araç çubuğu | 16,88,64,320 | 0,700,390,64 | Düzenle · Döndür (R) · Kaldır · Geri al; mobilde yatay |
| Oda bilgi kartı | 96,88,320,96 | 12,64,250,40 | "@zeynep_cs'nin Odası" · izin modu rozeti · 3/20 |
| Ziyaretçi defteri | 968,88,296,480 | 270,64,108,40 | Son 20 ziyaretçi, notlar, ayak izi; mobilde çip → alt sayfa |
| Alkış ve ziyaret eylemi | 968,584,296,64 | — | [Alkışla] (ziyaretçi) / [Düzenle] (sahibi); mobilde araç çubuğunda |
| Envanter çekmecesi | 192,616,776,168 | 0,484,390,208 | Sahip olunan eşyalar, kategori sekmeleri, nadirlik çerçeveleri |

**Bileşenler:** `RoomView` (Pixi), `InventoryDrawer`, `ProductCard` (envanter varyantı), `Badge` (izin modu), `GuestbookList`, `Button`, `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | "Oda hazırlanıyor…" |
| Boş | Boş Stüdyo: "Odan şimdilik bomboş. Pazar'dan bir şey al ya da envanterinden bir eşya yerleştir." · Defter: "Defter henüz boş. Odanı Arkadaşlara ya da Herkese aç, ilk ziyaretçini bekle." (15–17: "…Arkadaşlarına açık.") |
| Hata | "Oda kaydedilemedi. Son düzenin cihazında saklandı." [Tekrar Dene] |
| Çevrimdışı | "Çevrimdışısın. Odayı gezebilirsin; düzenlemek için bağlantı gerekiyor." |
| Erişim | Dolu: "Oda şu an dolu (20/20). Sahibine Alkış bırakabilirsin; seni bekletmiyoruz." · Arkadaşlara: "{ad} odasını yalnızca arkadaşlarına açmış. Arkadaşlık isteği gönderebilirsin." · Zilli: "Kapıyı çaldın. {ad} çevrimiçiyse kabul edebilir; yanıt gelmezse 2 dakika sonra kapanır." · Yaş duvarı: "Bu odaya şu an girilemiyor." (gerekçe yazılmaz) · 15–17 oda izni: "Odan Arkadaşlara açık." ("Herkese açık" seçeneği hukuk teyidine kadar kapalıdır; KANON §12.2) |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| [Düzenle] | Izgara görünür, envanter açılır | `ui_tap`; çekmece 240 ms |
| Envanterden eşya seç → hücreye dokun/bırak | Eşya yerleşir (ızgaraya yapışır, ayak izi geçerliyse); geçersizse kırmızı elmas + "Buraya sığmaz." | `place`; 160 ms "pop" |
| `R` / [Döndür] | 4 yönde döner (2 çizilmiş + ayna) | `ui_tap` |
| Eşyayı seç → ok tuşları | Seçili eşya hücre hücre taşınır (sürükle alternatifi) | `ui_tap` |
| Oturulabilir eşyaya tıkla | Avatar oturur | `ui_tap` |
| [Alkışla] (ziyaretçi) | Odada ≥ 20 sn kaldıktan sonra etkinleşir (erken: "Alkış için odada birkaç saniye daha kal."); günde 1: "Alkışın {ad}'a ulaştı."; ilk gerçek ziyarette "İlk Alkışın! +10 B."; sahibine 2 B (günlük 40 B tavan); tekrar: "Bu odaya bugün zaten Alkış bıraktın. Yarın 04:00'ten sonra yenisini verebilirsin." | `applause` |
| Çalışma Masası'na tıkla | Son geçilen test özeti; [Atölye'ye Git] | `ui_tap` |

**Veri:** `GET /v1/rooms/me`, `PUT /v1/rooms/me/layout` (`If-Match`; çakışmada `412 VERSION_CONFLICT`), `PATCH /v1/rooms/me` (izin modu), `GET /v1/rooms/{roomId}` (ziyaret), `GET /v1/visitor-books/{targetType}/{targetId}`, `POST /v1/applause`, `GET /v1/inventory`, `POST /v1/world/scenes/oda-{roomId}/join-tickets`.

**Mobil.** Düzenlemede "dokun-seç, hücreye dokun-yerleştir" (sürükleme isteğe bağlı); araç çubuğu altta; defter alt sayfa; zoom 1,0/1,5. **Mikro:** yerleştirmede 160 ms ölçek ve gölge oturması; kaldırılan eşya 160 ms solar; gece fazında lambalar yanar (B1 §9.1). **Erişilebilirlik:** Düzenle modunda klavye: ok = taşı, `R` = döndür, `Delete` = kaldır, `Enter` = yerleştir, `Ctrl+Z` = geri al; her sürükle-bırak işleminin tek işaretçili alternatifi vardır (WCAG 2.5.7); eşya listesi `listbox`.

### 6.18 Dolap (`dolap`)

**Amaç.** Oyuncunun sahip olduğu her şeyi giydiği ve düzenlediği yer: kıyafet (baş, üst, alt, ayak), aksesuar, sırt, evcil hayvan, **emote çarkı** (8 yuva; toplam 18 emote, B1 §7.3) ve **Nişan vitrini** (kazanılanlar altın çerçeve + animasyon). Yüz, saç ve vücut tipi burada **ücretsiz ve sınırsız** değişir. İsim etiketinde en çok 1 Nişan ikonu gösterilir; oyuncu seçer. HUD kompakt.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Avatar önizleme | 16,72,368,560 | 0,56,390,300 | `AvatarPreview` büyük; ◀ ▶ yön, bekleme animasyonu |
| Önizleme eylemleri | 16,640,368,144 | — | [Kaydet] [Sıfırla] [Rastgele]; mobilde detay şeridinde |
| Sekmeler | 400,72,864,56 | 0,364,390,48 | Kıyafet · Aksesuar · Emote · Nişan |
| Öğe ızgarası | 400,136,864,520 | 0,412,390,260 | Sahip olunan öğeler, nadirlik çerçeveleri, "Giyili" rozeti |
| Seçili öğe detayı + eylem | 400,664,864,120 | 0,680,390,164 | Ad, nadirlik rozeti, nereden geldi, [Giy]/[Çıkar], [Pazar'da Gör] |

**Bileşenler:** `AvatarPreview`, `Tab`, `ProductCard` (envanter), `RarityBadge`, `EmoteWheel` (düzenleyici), `Button`, `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Izgara iskeleti, siluet avatar |
| Boş | Aksesuar: "Bu sekmede henüz bir şeyin yok." [Pazar'a Git] · Nişan: "Nişanlar satın alınmaz, kazanılır. İlk hedefin: Keskin Göz." |
| Hata | "Dolap yüklenemedi." [Tekrar Dene] · "Kaydedilemedi, tekrar dene." |
| Çevrimdışı | "Çevrimdışısın. Önizleyebilirsin; kaydetmek için bağlantı gerekiyor." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Öğe seç | Önizlemede anında giyilir (kaydedilmez) | `ui_tap`; 160 ms "pop" |
| [Kaydet] | Kıyafet sunucuya yazılır; Meydan'daki avatar güncellenir | `ui_confirm` |
| Emote yuvası seç → emote seç | Yuva atanır (sürükle alternatifi); önizleme oynar | `ui_tap` |
| Nişan → "Etiketimde göster" | İsim etiketinde ikon olarak görünür | `seal_stamp` |
| [Pazar'da Gör] | `pazar?urun={itemId}` | panel geçişi |
| Yön ◀ ▶ | Avatar 4 yönde döner | — |

**Veri:** `GET /v1/inventory`, `PUT /v1/inventory/equipment` (giyilenler; emote çarkı ve etiketteki Nişan da bu kayda yazılır, B7 ile hizalanır), `GET /v1/players/me/avatar`, `PUT /v1/players/me/avatar` (yüz, saç, vücut).

**Mobil.** Önizleme üstte, ızgara 4 sütun; seçili öğe şeridi altta sabit. **Mikro:** Nişan öğeleri altın çerçevede 3 sn aralıkla ışık süzmesi (reduced-motion'da statik); giyilen öğe 160 ms "pop". **Erişilebilirlik:** önizleme `role="img"` ve her değişimde güncellenen tarif; ızgara `radiogroup`; nadirlik rozeti metindir ("Nadir"); emote çarkı düzenleyicide yuva numaraları okunur.

### 6.19 Pazar (`pazar`) — ayrıntılı

**Amaç.** Çekirdek döngünün **Harca** adımı: kozmetik ve oda eşyası mağazası. Üç sekme vardır (KANON §2.2): **Bayt Rafları** (Sıradan, Şık, Nadir), **Butik** (Çip; Premium) ve **Rütbe Rafı** (yalnızca Nişan sergisi, satılmaz). Raflar haftalık rotasyonludur (Pazartesi 09:00, kamyon animasyonu Meydan'da, B1 §9.3). Fiyatlar B2 §9'daki bantlardır: Sıradan 30–120 B, Şık 150–400 B, Nadir 450–800 B (kıyafet) / 300–400 B (oda eşyası); Premium yalnız Çip (set 100 Çip, oda teması 120, emote paketi 40, isim rengi 20). **Çip yalnızca kozmetik/konfordur; XP, Bayt, ipucu, test hakkı, süre, işletme, Ruhsat ve kasa tavanı Çip ile asla alınmaz** (KANON §4). HUD kompakt. Pazar 20. dakikada "tek raf" olarak açılır (yalnız "Çırak Şapkası", 30 B; VİZYON §4); tam raflar Sev. 3'te, Nadir rotasyonu Sev. 5'te (B2 §6.3), Butik sekmesi Sev. 5'ten itibaren görünür (B8 önerisi, B2 ile hizalanır).

**Ürün kartı (200×208, mobilde 177×216).** Üstte 112 px'lik önizleme alanı (96 px sprite, nadirlik renginde zemin); sol üstte **nadirlik rozeti** (renk + şekil + metin: Sıradan gri · Şık mavi · Nadir mor · Premium turkuaz); altında ad (en çok 2 satır), kategori satırı ("Baş · Kıyafet"), altta **fiyat pili** (Bayt: madeni para + "30 B"; Çip: mikroçip + "100 Çip"). Durum katmanları: "Sende var" (nane onay şeridi), "Giyili", "Yeterli Bayt yok" (fiyat pili mercan çerçeve + "130 B eksik"), "Sev. 5 gerekiyor" (kilit + metin; fiyat gösterilmez ama kilit hiçbir zaman parayla açılmaz), Nadir'de "Seri No. 037/200". Nadir ve Premium **statik**tir; animasyon yalnız Nişan'dadır (B2 §9.1).

**Satın alma akışı.** Sepet yoktur: tek ürün, tek onay (B8 önerisi; çok ürünlü harcama hatasını önler). Karta dokunmak ürünü sağdaki önizlemede avatara giydirir ("Dene"); [Satın Al] onay modalini açar: ürün adı, nadirlik, fiyat, "Cüzdan: 1.240 B → 1.210 B". Onayda `Idempotency-Key` ile gönderilir; başarıda Bayt sayacı **düşerek sayar**, toast "Çırak Şapkası senin. Dolap'ta." ve [Giy] [Dolap'a Git]. Yetersiz Bayt: kart düğmesi "130 B eksik" der ve ipucu verir: "Kasanda 61 B var. Topla" (kısayol; bu, Bayt'ı **koddan** kazanma ilkesine işaret eder). Yetersiz Çip: "10 Çip eksik" ve iki yol: [Çip Paketleri] ve "Çip'i ücretsiz kazanmak için: Semt Sınavı (+10 Çip)".

**Çip paketleri modali** (B2 §9.3): Avuç 100 Çip · 59,99 TL · Kutu 260 Çip · 149,99 TL (+%4) · Sandık 560 Çip · 299,99 TL (+%12; 15–17 yaş için veli onayı) · Konteyner 1.200 Çip · 599,99 TL (+%20; veli onayı). Kurallar modalde görünür: rastgele kutu **yok** ("Ne aldığını görerek alırsın"), sınırlı süre sayacı **yok**, 15–17 yaş için veli limiti (varsayılan 0; üst sınır 300 Çip/ay), iade 14 gün (hukuk onayına tabi). Ödeme **sağlayıcının barındırdığı sayfada** yapılır (3-D Secure); istemci kart verisi görmez ve girmez. Bayt hiçbir pakette yoktur.

**Kalıcı Bayt kalemi: Seri Dondurucu** (50 B, stok ≤ 2; B6 §3.2) Bayt rafının sonunda sabit durur; Çip ile asla alınmaz. **Rütbe Rafı.** Nişan'lar sergilenir, "KAZANILIR" rozeti taşır ve **satın alma düğmesi yoktur**; kartta "Nasıl kazanılır?" vardır (ör. Otopark Ustası Şapkası: "Gizli testlerin tamamını ilk 3 denemede geç"). Kazanılan Nişan altın çerçeve + 3 sn aralıklı ışık süzmesi alır. **Rotasyon.** Nadir raf 6 slottur; ürün raftan 1 hafta sonra kalkar ve ≥ 12 hafta sonra döner; takvim ilan edilmiştir ("Yeni raf: 4 g 12 sa"); "son 2 saat" tipi sahte aciliyet yoktur.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip (fiyat karşılaştırması için sayaçlar görünür) |
| Raf sekmeleri | 16,72,860,56 | 0,56,390,48 | Bayt Rafları · Butik · Rütbe Rafı |
| Haftalık rotasyon sayacı | 892,72,372,56 | 12,108,366,36 | "Yeni raf: Pzt 09:00 · 4 g 12 sa" |
| Ürün ızgarası | 16,136,860,648 | 12,152,366,448 | Kategori çipleri (Hepsi, Kıyafet, Aksesuar, Evcil, Oda, Emote) + 4×3 kart (mobilde 2 sütun) |
| Önizleme paneli | 892,136,372,336 | 0,608,390,236 | Avatar giydirilmiş önizleme, [Dene]; mobilde önizleme + fiyat + [Satın Al] alt çubuk |
| Satın alma özeti | 892,488,372,296 | — | Seçili ürün: ad, rozet, fiyat, "Cüzdan: 1.240 B → 1.210 B", [Satın Al]; mobilde alt çubukta |

**Bileşenler:** `ProductCard`, `RarityBadge`, `Tab`, `Chip` (kategori), `AvatarPreview`, `Countdown`, `Modal` (satın alma onayı, Çip paketleri), `Button`, `Toast`, `EmptyState`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | 12 iskelet kart |
| Boş | Rotasyonda ürün yoksa: "Bu rafta şimdilik ürün yok. Yeni raf Pazartesi 09:00'da." · Rütbe Rafı boşsa: "Rütbe Rafı yakında dolacak." |
| Hata | "Pazar şu an açılamadı." [Tekrar Dene] · "Satın alma tamamlanamadı. Bayt'ın düşmedi; tekrar dene." |
| Çevrimdışı | "Çevrimdışısın. Rafları gezebilirsin; satın almak için bağlantı gerekiyor." (düğmeler devre dışı) |
| Yetersiz | "130 B eksik" · "10 Çip eksik" · "Sev. 5 gerekiyor." |
| Sahip | "Sende var" (düğme [Dolap'ta Gör]); sunucu `ALREADY_OWNED` dönerse: "Bu eşyaya zaten sahipsin; Dolap'tan giyebilirsin." |
| Fiyat değişti | `PRICE_CHANGED`: "Fiyat güncellendi: {yeni}. Yine de almak istiyor musun?" (yeniden onay modali) |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Karta dokun | Önizleme avatara giydirilir; özet güncellenir | `ui_tap`; 160 ms "pop" |
| [Satın Al] → onay | `purchases` çağrısı; başarıda sayaç düşer, "Sende var" olur | `coin_spend`; Bayt azalış sayımı; kart çerçevesi 400 ms parlar |
| Yetersiz Bayt → "Kasanı topla" | `panel` (İşletme Paneli) açılır | — |
| Butik → yetersiz Çip → [Çip Paketleri] | Paket modali; seçim → sağlayıcı sayfasına yönlendirme | `ui_confirm` |
| Rütbe Rafı kartı | "Nasıl kazanılır?" açılır, ilerleme çubuğu (varsa) | `ui_tap` |
| Sekme / kategori | Izgara 160 ms solarak yenilenir | — |
| Pazartesi 09:00 | "Raf yenilendi" toast'u; yeni ürünler "Yeni" rozetli | `truck` (isteğe bağlı) |

**Veri:** `GET /v1/market/shelves` (Bayt rafları, Butik, Rütbe Rafı, haftalık rotasyon), `GET /v1/market/items/{sku}`, `POST /v1/market/purchases` (`sku`, `expectedPrice{currency, amount}`; `Idempotency-Key`; hatalar `PRICE_CHANGED`, `ALREADY_OWNED`, `INSUFFICIENT_FUNDS`), `POST /v1/payments/orders` (Çip siparişi; 15–17 için `par` gerekli), `GET /v1/payments/orders/{orderId}`, `GET /v1/wallets/me`.

**Mobil.** Izgara 2 sütun; seçili ürünün önizleme + fiyat + [Satın Al] çubuğu altta sabit (başparmak bölgesi); kategori çipleri yatay kaydırılır; Çip modali tam ekran alt sayfa. **Mikro:** satın alma onayında ürün sprite'ı 400 ms avatara "uçar"; Bayt sayacı düşerken pilin üstünde eksi etiket çıkmaz (azalışta etiket yok, §5); Nadir kartta seri numarası tebeşir yazısı. **Erişilebilirlik:** kartlar `button`, etiket "Çırak Şapkası, Sıradan, Baş kıyafeti, 30 Bayt, yeterli bakiye var"; yetersiz durumda neden `aria-describedby`; fiyat yalnız renkle değil metinle ("130 B eksik"); modal odak tuzağı ve `Esc`; ödeme sayfasına geçişte uyarı "Ödeme sayfasına yönlendiriliyorsun" (sayfa bağlamı değişimi, WCAG 3.2.2).

### 6.20 Vitrin (`vitrin`)

**Amaç.** L2+ işletmede gişe duvarındaki çerçeveli ekranın büyük hali: **kod sergisi**. Ziyaretçi sahibin kodunu okur, tıklayınca o işletmenin **Savunma cevabını** görür; her kod satırı salt okunurdur. "Not bırak" v1.1'dir: düğme gizlenmez, "v1.1'de geliyor" etiketiyle devre dışı durur (KANON §6: ✓ salt okunur). Kod okumak yazmak kadar öğretir: ziyaretçi Vitrin'de kod okuyarak **günde 3 kez 10 XP** kazanır (B2 §4.1; B6 ile hizalanır). Sahibi sergiyi İşletme Paneli'ndeki anahtarla açar/kapar. HUD kompakt.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| İşletme başlığı | 16,72,1248,72 | 12,60,366,64 | "@ayse_kod'un Otoparkı · L2 · Çarşı · Tente Sokak No: 3", durum rozeti, [Alkışla] |
| Kod görünümü | 16,160,752,624 | — | `CodeBlock`, satır numaralı, salt okunur; Kurul'un Savunma'da sorduğu satır etiketli; mobilde "Kod" sekmesi |
| Savunma cevabı kartı | 784,160,480,264 | — | Hasan Abi'nin sorusu + sahibinin cevabı + Kurul puanı; mobilde "Savunma" sekmesi |
| Notlar (v1.1) | 784,440,480,224 | — | Devre dışı: "Not bırak — v1.1'de geliyor."; mobilde "Notlar" sekmesi |
| İstatistik şeridi | 784,680,480,104 | 12,760,366,76 | Ziyaretçi sayısı, Alkış sayısı, "Kodu Okudum (+10 XP)" |
| Sekmeler (mobil) | — | 0,128,390,44 | Kod · Savunma · Notlar |
| Sekme içeriği (mobil) | — | 12,180,366,570 | Seçili sekmenin içeriği |

**Bileşenler:** `CodeBlock`, `ChatBubble` (Hasan Abi, oyuncu), `KurulCard` (özet), `Badge`, `Tab`, `Button`, `Toast`.

**Spoiler kuralı (B6 §6.4):** okuyucu o işletme türünü kendisi açmışsa kodu görür; açmamışsa "Önce kendin dene" kartı çıkar ve yalnızca tabela ile Savunma cevabı görünür. Kendi kodunu okumak 0 XP verir; sahibi ilk kez sergilediğinde 50 B alır (B2 §5.2). Kural: Vitrin'de **kopyala düğmesi yoktur** (kopyalamak yerine okumak teşvik edilir); metin seçimi engellenmez (erişilebilirlik). "Kodu Okudum" kod en az 20 sn görünür kaldıktan ve sonuna kaydırıldıktan sonra etkinleşir (sunucu da doğrular).

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Kod iskeleti + "Vitrin açılıyor…" |
| Boş / kapalı | "Bu işletmenin sahibi kodunu sergilemiyor." · L1: "Vitrin, işletme L2 olunca açılır." |
| Hata | "Vitrin yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | "Çevrimdışısın. Vitrin'i görmek için bağlantı gerekiyor." |
| Günlük sınır | "Bugünkü kod okuma ödüllerini aldın (3/3). Okumaya devam edebilirsin." |
| Önce kendin dene | "Bu işletmeyi henüz sen açmadın. Önce kendin dene; sonra buraya dönüp kodları karşılaştır." (yalnız tabela ve Savunma cevabı görünür) |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Kodu kaydır | Okuma ilerlemesi izlenir (sunucu doğrulaması için) | — |
| Savunma'da sorulan satıra dokun | Satır vurgulanır, "Savunma" kartı o soruya kayar | `ui_tap` |
| [Kodu Okudum] | `award({xp: 10})` (günde 3); "Bugün 2/3" sayacı | `xp_tick` |
| [Alkışla] | Günde 1; sahibine 2 B | `applause` |
| "Not bırak" | Devre dışı; araç ipucu "v1.1'de geliyor" | — |

**Veri:** `GET /v1/businesses/{businessId}/vitrin` (kod, işaretli satır, Savunma cevabı, sayaçlar), `POST /v1/applause`; "Kodu Okudum" (+10 XP) için B7 kataloğunda uç nokta yoktur (`POST /v1/businesses/{businessId}/vitrin/reads` talep edilir).

**Mobil.** Üç sekme; kod satırları yatay kaydırılır (satır kaydırma kapalı); istatistik şeridi altta sabit. **Mikro:** Savunma satırı etiketi 1,2 sn nabız atar; XP etiketi HUD'a uçar. **Erişilebilirlik:** `CodeBlock` `role="region"` + `aria-label="C# kodu, 24 satır, salt okunur"`; vurgulu satır `<mark>` + metin etiketi; renk + etiket; sekmeler `tablist`.

### 6.21 Profil & Rozet Duvarı (`profil`)

**Amaç.** Oyuncunun portföyü: **unvan, seviye, Nişan'lar, işletme portföyü, "kodu dışa aktar"** (KANON §6). Her işletme çalışan bir C# projesidir; "Otopark kodu Visual Studio'ya yapıştırılınca aynen derlenir" (VİZYON aha #3). Kendi profili ve başkasının profili aynı ekrandır (`oyuncu` parametresi); başkasının profilinde cüzdan, Çip ve son giriş görünmez. HUD kompakt.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Kimlik kartı | 16,72,400,360 | 12,60,366,200 | Büyük avatar, `@zeynep_cs`, unvan rozeti + "Çırak · Sev. 3", XP çubuğu, adres |
| İstatistikler | 16,448,400,336 | — | Ders sayısı, ortalama Kurul puanı, test geçme oranı, toplam gelir (B), altın durak, seri; mobilde "İstatistik" sekmesi |
| Rozet Duvarı | 432,72,832,300 | — | Nişan ızgarası (kazanılan altın çerçeve, kazanılmayan silüet + "nasıl kazanılır"); mobilde "Rozetler" sekmesi |
| İşletme portföyü | 432,388,832,396 | — | İşletme kartları (durum rozeti, L, Vitrin bağlantısı) + [Kodu Dışa Aktar]; mobilde "İşletmeler" sekmesi |
| Sekmeler (mobil) | — | 0,268,390,44 | İstatistik · Rozetler · İşletmeler |
| Sekme içeriği (mobil) | — | 12,320,366,512 | Seçili sekmenin içeriği |

**Bileşenler:** `AvatarPreview`, `RankBadge` (unvan rozeti), `NisanBadge`, `Card` (işletme), `Badge` (durum), `Stat`, `Tab`, `Button`, `Modal` (dışa aktar).

**Kodu dışa aktar** (yalnız kendi işletmeleri; ücretsiz, B2 §6.2): modalde [Panoya Kopyala] ve [Konsol Projesi (.zip) İndir] (`Otopark.cs` + `Program.cs` + `.csproj`; içerik ve .NET sürümü B5 ile hizalanır). İndirme kullanıcı eylemidir; dosya adı ve boyutu modalde yazılır ("Otopark.zip · ≈ 2 KB").

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Kimlik iskeleti + dönen rozet |
| Boş | Rozet Duvarı: "Nişanlar satın alınmaz, kazanılır. İlk hedefin: Keskin Göz." · Portföy: "Henüz işletmen yok. İlk tapun Çarşı'da seni bekliyor." |
| Hata | "Profil yüklenemedi." [Tekrar Dene] |
| Çevrimdışı | "Çevrimdışısın. Son bilinen profil gösteriliyor." |
| Kısıtlı | "Bu profil yalnızca arkadaşlara açık." (15–17 güvenli mod; B6 ile hizalanır) |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Nişan rozetine dokun | Açıklama: ne zaman/nasıl kazanıldı; (kendi profilinde) [Etiketimde Göster] | `ui_tap`; altın süzme |
| İşletme kartı | `panel` (kendi) / `sokak` (başkası) | panel geçişi |
| [Kodu Dışa Aktar] | Modal: kopyala / indir; toast "Panoya kopyalandı." | `ui_confirm` |
| Başkasının profili: [Arkadaş Ekle] / [Odasına Git] / [Şikâyet Et] | İlgili akış (Sohbet & Arkadaşlar, Oda, moderasyon) | — |
| Unvan rozetine dokun | Unvan bandı tablosu (Çırak 1–5 … Efsane) | `ui_tap` |

**Veri:** `GET /v1/players/{playerId}` (genel profil), `GET /v1/players/{playerId}/portfolio` (işletmeler, Nişan'lar, Rozet Duvarı), `GET /v1/players/me/progress`; "Kodu dışa aktar" için uç nokta B7'de yoktur (`GET /v1/businesses/{businessId}/code-export` talep edilir).

**Mobil.** Kimlik kartı üstte, üç sekme altta; Rozet ızgarası 4 sütun, dokunma alanı ≥ 48 px. **Mikro:** Nişan duvarına yeni rozet asılırken 600 ms "çivi çakma"; Efsane rozeti dönen yıldız (reduced-motion'da statik). **Erişilebilirlik:** rozetler `button` + `aria-label="Keskin Göz, kazanıldı, 3 Kasım 2026"`; kazanılmayanlar `aria-disabled` + nasıl kazanılacağı `aria-describedby`; istatistikler `<dl>`.

### 6.22 Liderlik Panosu (`liderlik`)

**Amaç.** Dört panoyu tek ekranda sunar (KANON §6, B6 §8): **Haftalık Lig** (Bronz → Gümüş → Altın → Elmas; 30 kişilik kova, terfi ilk 7, düşme son 5), **Kalıcılık Ligi** (altın durak sayısı), **En Hızlı Otopark** (ilk geçiş süresi) ve **En Kazançlı İşletme** (son 7 günde tahsil edilen Bayt). İki alt sekme aynı ekrandadır, yeni ekran açılmaz: **Arkadaşlar** (arkadaşların haftalık XP'si, ≤ 30 kişi) ve **Meydan Sorusu** ("Hızlı Parmak" sayacı). Lig puanı (LP) haftalık XP'dir; yani lig oyun süresinin değil öğrenmenin yarışıdır. Ödüller B2 §5.3'tür: 1. sıra 300 B · 2–3: 200 · 4–7: 150 · 8–12: 100 · 13–20: 50 · 21–25: 20 · 26–30: 0 (Bayt cezası yok). Kalıcılık, En Hızlı Otopark ve En Kazançlı İşletme Bayt vermez. Pazar 21:00'de puanlar donar, 21:05'te sonuçlar gelir. HUD kompakt.

**Tablo.** Satır 48 px; sütunlar: sıra · avatar büstü + `@ad` + unvan rozeti · LP (`tr-TR`, "1.240") · hareket işareti. Oyuncunun satırı vurgulu ve yapışkandır (`around=me`: çevresindeki 7 satır). **Terfi bölgesi** (ilk 7) nane çizgi + "Terfi" etiketi, **düşme bölgesi** (son 5) amber çizgi + "Düşme" etiketi taşır (yalnız renk değil; "kaybedeceksin" dili yoktur). En Hızlı Otopark satırı: sıra, takma ad, unvan, **süre (dk:sn)** ve Savunma etiketi — "Savunma geçti" (nane), "Savunma bekliyor" (gri), "Deneme" (amber); üç dilim: Tüm zamanlar (ilk 50) · Bu ay (ilk 20) · Yeni oyuncular (ilk 20). En Kazançlı İşletme: işletme türü × seviye grubu (L1–L2, L3–L5) ayrı tablodur; yalnız Açık işletmeler girer; sahibi "Panoda göster"i kapatabilir. Kalıcılık Ligi: ilk 100, arkadaşlar ve kendi sıran; semt filtresi; eşitlikte altın-gün toplamı.

Örnek Haftalık Lig kovası (**Bronz** kademe, A grubu = Çırak–Kalfa; hafta sonuna 5 g 1 sa):

| Sıra | Oyuncu | Unvan | LP | Bölge |
|---|---|---|---|---|
| 1 | `@berk_34` | Kalfa · Sev. 9 | 1.240 | Terfi |
| 2 | `@ayse_kod` | Kalfa · Sev. 8 | 1.180 | Terfi |
| 3 | `@mert.k` | Kalfa · Sev. 8 | 1.020 | Terfi |
| 4 | `@nil_cs` | Çırak · Sev. 5 | 940 | Terfi |
| 5 | `@kaan` | Çırak · Sev. 4 | 880 | Terfi |
| 6 | `@deniz07` | Çırak · Sev. 5 | 760 | Terfi |
| 7 | `@ela_c` | Çırak · Sev. 3 | 700 | Terfi |
| 12 | **`@zeynep_cs`** (sen) | Kalfa · Sev. 7 | 470 | — |
| 26–30 | … | … | … | Düşme |

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Pano sekmeleri | 16,72,820,56 | 0,56,390,48 | Haftalık Lig · Kalıcılık Ligi · En Hızlı Otopark · En Kazançlı İşletme · (alt) Arkadaşlar · Meydan Sorusu |
| Sıralama tablosu | 16,136,820,648 | 12,216,366,560 | 30 satır (sanallaştırılmış), oyuncu satırı yapışkan |
| Lig özeti | 852,72,412,200 | 12,112,366,96 | Kademe rozeti, kova (n/30), sıran, LP, terfi/düşme durumu cümlesi |
| Ödül ve bölge açıklaması | 852,288,412,320 | — | Ödül tablosu (konum → Bayt) ve kurallar; mobilde Lig özetine dokununca açılır |
| Geri sayım kartı | 852,624,412,160 | 12,784,366,52 | "Lig kapanışı: Pazar 21:00 · 5 g 1 sa" |

**Bileşenler:** `Tab`, `LeaderboardRow` (`Stat` + `RankBadge`), `Badge` (Savunma durumu, bölge), `Card`, `Countdown`, `EmptyState`, `Toast`.

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | 12 iskelet satır |
| Boş | Kova yok: "Bu haftanın ligi ilk XP'ni kazandığında başlar. Bir görev bitir, kovan oluşsun." · Kalıcılık: "Henüz altın durağın yok. Günlük Tekrar'da bir durağı 3 kez üst üste doğru bilirsen altın olur." · En Hızlı Otopark: "Henüz süre yok. Otopark'ı açan ilk oyuncular burada görünür." |
| Kova dolmadı | "Kovanda şimdilik {n} oyuncu var. Yeni oyuncular katıldıkça dolar; ödüller sıranın oranına göre hesaplanır." |
| Isınma | "Bu hafta Isınma haftan: puan toplarsın ama ödül ve terfi yok. Gelecek hafta gerçek ligin başlıyor." |
| Bölge cümleleri | "Terfi bölgesindesin. Yerini korumak için {x} XP daha yeterli." · "Terfi bölgesine {x} XP uzaktasın." · "Ödül ve terfi için en az 100 XP gerekiyor. Şu an {x} XP'sin." |
| Bekleyen XP | "Bekleyen XP var: Kurul cevaplarını gece puanlayacak, yeni haftanın puanına eklenecek." |
| Doğrulanıyor | "Bu sıralama doğrulanıyor; en geç 72 saat sürer. Ödülün korunuyor." |
| Hata | "Liderlik Panosu yüklenemedi. Puanın ve sıran güvende; birazdan tekrar dene." |
| Çevrimdışı | "Çevrimdışısın. Son bilinen sıralama gösteriliyor." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Pano sekmesi | Tablo 160 ms solarak yenilenir; `top` + `around=me` | — |
| Satıra dokun | Mini profil kartı: [Profil] [Arkadaş Ekle]; En Hızlı Otopark'ta [Vitrin] | `ui_tap` |
| Lig özetine dokun | Ödül ve kurallar paneli (mobil alt sayfa) | `ui_tap` |
| Pazar 21:00 | Kapanış kartı: "Lig kapandı: 12. oldun. +100 B. Yeni hafta başladı." (terfi ve düşme metinleri B6 §14'tedir); havai fişek Meydan'da | `fireworks`, `coin_pickup` |
| Terfi | "Lig kapandı: 5. oldun ve Gümüş Ligi'ne terfi ettin. +150 B." | `level_up` (kısa) |

**Veri:** `GET /v1/leagues/current` (kova, sıra, LP, bölge), `GET /v1/leaderboards/{board}` (`weekly`, `kalicilik`, `en-hizli-otopark`, `en-kazancli`; `?top=` ve `?around=me`; imleç sayfalama yok, B7 §5.1), Arkadaşlar alt sekmesi `GET /v1/friends`, Meydan Sorusu `GET /v1/world/meydan-question`.

**Mobil.** Pano sekmeleri yatay kaydırılır; tablo tek sütun (sıra, ad, LP); oyuncu satırı alt kenara yapışır; ödül tablosu alt sayfada. **Mikro:** sıra değişince satır 400 ms yer değiştirir ve "+2" işareti 2 sn görünür; geri sayım son 10 dakikada amber; reduced-motion'da yer değiştirme anındadır. **Erişilebilirlik:** tablo `<table>` semantiğiyle ("Sıra 12, zeynep_cs, Kalfa, 470 LP, terfi bölgesinin 5 sıra dışında"); terfi/düşme bölgesi metindir; geri sayım `role="timer"` `aria-live="off"`; sekmeler `tablist`.

### 6.23 Sohbet & Arkadaşlar (`sohbet`)

**Amaç.** Sohbetin, arkadaşlığın ve davetin tek yüzeyidir (KANON §6, B6 §6–§7): **Meydan/Ana Cadde balon sohbeti** (shard'a özel), **Oda ve işletme içi sohbeti**, **DM** (yalnızca arkadaşlar), **arkadaş listesi** (çevrimiçi durumu paylaşım iznine bağlı; aynı zamanda **Arkadaş Ligi**: ≤ 30 arkadaşın haftalık XP tablosu), **Davet Kodu** (8 karakter, QR) ve **güvenli mod**. Moderasyonun tek ilkesi: **ceza sosyal yüzeyi kapatır, öğrenmeyi asla kapatmaz** (B6 §7). Sohbet limitleri KANON'dandır: 1 mesaj/3 sn, ≤ 200 karakter, link yok; balon 6 sn, eşzamanlı ≤ 12. Kürsü'de balon yoktur, yalnız emote. HUD kompakt.

**Güvenli mod ve yaş duvarı (B6 §7.5).** Üç durum vardır ve giriş çubuğu bunlara göre biçim değiştirir:

| Durum | Giriş çubuğu | DM |
|---|---|---|
| 15–17, **veli onayı bekliyor** (72 sa) | Serbest metin **kapalı**; 6 kategorili **hazır cümle** çipleri (72 cümle: Selam, Yardım, Oyun ve kod, Tebrik, Teşekkür ve özür, Ziyaret ve veda) + emote | Kapalı |
| 15–17, **onaylı güvenli mod** | Serbest metin ≤ 120 karakter (görüntü öncesi sıkı süzgeç) + hazır cümleler | Yalnızca 15–17 arkadaşlar |
| 18+ | Serbest metin ≤ 200 karakter | Yalnızca 18+ arkadaşlar (15–17'ye istek yok) |

**Gönderim akışı.** İstemci yalnızca **bağlam kuralları**nı uygular (3 sn bekleme halkası, karakter sayacı, link/telefon örüntüsü için gönderim öncesi uyarı); asıl denetim sunucudadır: sözlük + `claude-haiku-5-5` süzgeci görüntü öncesi çalışır. `Send {clientMsgId, channel, target, text}` iletisi balonda **bekliyor** (soluk) görünür; `chat.ack` gelince normalleşir; `chat.rejected` gelirse ilgili hata metni çıkar: `RATE` "Biraz yavaş: her 3 saniyede bir mesaj yazabilirsin." · `LINK` ve `FILTER` "Burada bağlantı ve kişisel bilgi paylaşılamaz. Arkadaşlık için davet kodunu kullanabilirsin." / "Bu mesaj şehir kurallarına uymuyor, gönderilmedi. Kuralları görmek için dokun." · `MUTED` (ceza Ç1) "Sohbet 15 dakika kapalı. Bir mesajın şehir kurallarına uymadı. Kuralları okuyabilirsin; itiraz hakkın var." · `PAR_REQUIRED` "Serbest sohbet, veli onayından sonra açılır. O zamana kadar hazır cümlelerle sohbet edebilirsin." `chat.removed` (3 şikâyette otomatik gizleme) balonu "Bu mesaj kaldırıldı." yapar. **Yavaş mod** (60 sn'de 3 rapor): "Bu sokakta sohbet kısa süre yavaşlatıldı. 10 saniyede bir mesaj yazabilirsin." **Kriz ifadesi** akışında mesaj yayından kesilir ve gönderene yalnızca özel metin gösterilir: "Zor bir şey yaşıyor olabilirsin ve bunu tek başına taşımak zorunda değilsin. Güvendiğin bir yetişkinle konuş. Acil durumda 112'yi, destek için ALO 183'ü arayabilirsin." (numaralar yayın öncesi doğrulanır).

**Arkadaşlık ve davet.** Arkadaş eklemek takma ad ya da Davet Koduyla yapılır; karşılıklı onay şarttır; arkadaş üst sınırı 100, bekleyen istek ≤ 20. Davet Kodu `7H3Q-9XM2` biçimindedir, QR olarak da gösterilir; kayıtta girilirse yeni oyuncu ilk Bayt'ını kazanınca **iki taraf da 100 B** alır (ayda en çok 5 davet). Telefon rehberi eşleştirmesi yoktur. "Arkadaşın işletme açtı / kasası doldu" akışı yalnız arkadaşlara görünür ve kapatılabilir. Engelleme ve şikâyet her mesajın ⋯ menüsündedir: şikâyet sonrası "Bildirimin bize ulaştı. Her bildirim okunur; sonucu ayrıca yazamayabiliriz."; engel sonrası "{ad} engellendi. Mesajlarını artık görmezsin. İstersen Ayarlar > Engellenenler'den kaldırabilirsin."

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Sekmeler (mobil) | — | 0,56,390,48 | Sohbet · Arkadaşlar · Davet |
| Kanal listesi | 16,72,280,712 | — | Meydan (shard 07 · 23 kişi) · Oda · DM kişileri (okunmamış rozetli) |
| Kanal şeridi (mobil) | — | 0,104,390,44 | Aynı kanallar yatay çipler |
| Mesaj akışı | 312,72,640,560 | 0,148,390,536 | `role="log"`; mesaj balonları (`ChatBubble` oyuncu/Usta/sistem), zaman, ⋯ menüsü |
| Mesaj giriş çubuğu | 312,640,640,144 | 0,692,390,152 | Giriş + sayaç "0/200" + 3 sn halkası; güvenli modda hazır cümle çipleri |
| Arkadaş paneli | 968,72,296,440 | — | Arkadaş listesi (çevrimiçi/çevrimdışı), Arkadaş Ligi satırı, [Arkadaş Ekle]; mobilde "Arkadaşlar" sekmesi |
| Davet kodu kartı | 968,528,296,256 | — | `7H3Q-9XM2`, QR, [Kopyala] [Paylaş]; mobilde "Davet" sekmesi |

**Bileşenler:** `ChatBubble`, `Chip` (hazır cümle), `Input`, `Tab`, `Badge` (okunmamış, çevrimiçi), `Avatar` (S), `Card` (davet), `Button`, `Toast`, `Modal` (şikâyet).

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Mesaj akışı iskeleti |
| Boş | Arkadaş listesi: "Henüz arkadaşın yok. Davet kodun {kod}. Arkadaşın ilk Bayt'ını kazanınca ikiniz de 100 B alırsınız." · Meydan sohbeti: "Burası şimdilik sessiz. İlk selamı sen ver." (onay bekleyen 15–17: "…Aşağıdaki hazır cümlelerden birini seçebilirsin.") |
| Hata | "Mesaj gönderilemedi. Tekrar dene." · DM yaş kuralı: "Bu oyuncuyla özel mesajlaşma açık değil. Odasını ziyaret edip Alkış bırakabilirsin." (gerekçe yazılmaz) |
| Çevrimdışı / koptu | "Bağlantı koptu. Avatarın 30 saniye burada bekler; geri dönünce kaldığın yerdesin." Giriş çubuğu devre dışı |
| Veli onayı | "Serbest sohbet, veli onayından sonra açılır. O zamana kadar hazır cümlelerle sohbet edebilirsin. Veline gönderilen bağlantı 72 saat geçerli." + günde 1: "Veline bağlantıyı yeniden göndermemizi ister misin?" |
| Başarı | "{ad} artık arkadaşın. Odasını gezebilir, işletmesine Alkış bırakabilirsin." · "Kod kopyalandı. Arkadaşın ilk Bayt'ını kazandığında ikiniz de 100 B alırsınız (ayda en çok 5 davet)." |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| `Enter` / [Gönder] | Mesaj bekliyor → `chat.ack`; sahnede 6 sn balon | `chat_pop` |
| Hazır cümle çipi | Cümle doğrudan gönderilir (süzgeçsiz; serbest metin içermez) | `chat_pop` |
| ⋯ → Bildir | Neden seç → `POST /v1/chat/reports` → bildirim teşekkürü | `ui_confirm` |
| ⋯ → Engelle | `POST /v1/blocks` → mesajlar gizlenir | — |
| Arkadaş satırı → Odasına Git | `oda?oda=…` (izin moduna göre) | panel geçişi |
| Arkadaş satırı → Arkadaşa Git | Aynı shard/instance'a bilet (`friendId`); Kürsü/Savunma'ya takip yok | `door` |
| [Kopyala] | Panoya `7H3Q-9XM2`; toast | `ui_confirm` |
| Yeni mesaj (başka sekmede) | Kanal rozeti artar; HUD Sohbet rozeti artar | `notification` (ses açıksa) |

**Veri:** `ChatHub` (`POST /v1/chat/connection-tickets` bileti; `Send`, `JoinChannel`/`LeaveChannel`, `MarkRead`; `chat.message`, `chat.ack`, `chat.rejected`, `chat.removed`, `chat.muted`), `GET /v1/chat/dm/{playerId}/messages`, `POST /v1/chat/reports`, `POST/DELETE /v1/blocks`, `GET /v1/friends`, `POST /v1/friend-requests`, `PUT /v1/friend-requests/{requestId}`, `DELETE /v1/friends/{playerId}`, `GET /v1/friends/presence`, `GET /v1/invites/me`, `POST /v1/invites/redeem`.

**Mobil.** Üç sekme (Sohbet, Arkadaşlar, Davet); kanal çipleri yatay kaydırılır; giriş çubuğu klavyenin üstünde sabit; hazır cümle çipleri yatay kaydırılır (≥ 44 px). **Mikro:** yeni mesaj 160 ms aşağıdan kayar; 3 sn halkası mesaj gönderilince dolmaya başlar; hareketi azaltta kayma yok. **Erişilebilirlik:** akış `role="log"` `aria-live="polite"` (yoğun kanalda "Yeni mesajlar" özeti, mesaj başına anons yok); balon sahneyle aynı mesajı tekrar yazmaz; hazır cümle çipleri `button`; şikâyet/engel menüsü klavyeyle (`Shift+F10`); okunmamış sayısı metinle ("3 okunmamış mesaj").

### 6.24 Ayarlar & Hesap (`ayarlar`)

**Amaç.** Tüm kişisel tercihlerin ve hesap işlemlerinin tek yeri: bildirim, ses/görüntü, erişilebilirlik, **veli durumu**, **KVKK metinleri**, **veri silme**, **dil kartları bekleme listesi** (KANON §6). Sekiz bölüm vardır (masaüstünde sol menü, mobilde liste → ayrıntı): Genel · Bildirimler · Ses ve Görüntü · Erişilebilirlik · Gizlilik ve KVKK · Veli Durumu · Dil Kartları · Hesap. HUD kompakt.

| bölge | masaüstü 1280×800: x,y,w,h | mobil 390×844: x,y,w,h | içerik |
|---|---|---|---|
| HUD üst şerit (kompakt) | 0,0,1280,64 | 0,0,390,56 | Kimlik + Bayt/Çip |
| Bölüm menüsü | 16,72,260,712 | — | 8 bölüm; mobilde ayrı liste ekranı (satır 56 px) |
| Başlık / geri (mobil) | — | 0,56,390,48 | "← Ayarlar · Ses ve Görüntü" |
| Durum şeridi | 292,72,972,64 | 12,112,366,56 | Veli onayı durumu / kaydedildi bildirimi |
| Ayar formu | 292,152,972,500 | 12,176,366,560 | Seçili bölümün anahtarları, kaydırıcıları, metinleri |
| Hesap bölgesi (tehlikeli) | 292,668,972,116 | 12,744,366,92 | [Verilerimi İndir] · [Hesabımı Sil] |

**Bileşenler:** `Toggle`, `Slider`, `Radio`, `Select`, `Card`, `Badge` (veli durumu), `Modal` (onay akışları), `Button`, `Toast`.

| Bölüm | Ayarlar (varsayılan) |
|---|---|
| Genel | Takma ad ([Değiştir — 500 B]), telefon (maskeli `+90 5•• ••• •• 34`), [Çıkış Yap] |
| Bildirimler | Tarayıcı izni; kategoriler: Kasa doldu · Günlük Tekrar · Hata Bildirimi · Alkış ve ziyaretçi · Lig kapanışı · Arkadaş (hepsi açık); sessiz saatler 22:00–08:00 (B8 önerisi); günde en çok bildirim sayısı B6'dan |
| Ses ve Görüntü | **Ses: kapalı**; Müzik / Efekt / Ortam kaydırıcıları (açılınca 50 / 80 / 50); Titreşim (açık); **Düşük cihaz modu** (otomatik öner); Hareketi azalt (Sistem / Açık / Kapalı); Veri tasarrufu |
| Erişilebilirlik | Metin boyutu %100 / %125 / %150; Yüksek kontrast; Renk körü modu (desen + şekil); WASD ile yürü (kapalı); Sahne listesi (Erişilebilir Dünya Katmanı); Kısayol yardımı |
| Gizlilik ve KVKK | Aydınlatma Metni, Gizlilik Politikası, Kullanım Koşulları (sayfa içi okuma; sürümlü); **izinler** ayrı ayrı ve varsayılan **kapalı**: Ürün analitiği, Pazarlama iletileri, Yapay zekâ kalibrasyonu (B7 `consents`; `POST /v1/privacy/consents`); Engellenenler listesi (kaldırma) |
| Veli Durumu | 15–17: "Onay bekleniyor (72 sa içinde)" / "Onaylandı" ve açık-kapalı özellikler listesi (serbest sohbet, DM, Çip alışverişi); [Veliye Tekrar Gönder] (7 günde 3); 18+: "Bu hesap için veli onayı gerekmiyor." Veli paneli SMS bağlantısıyla açılan, hesap gerektirmeyen **ayrı bir sayfadır** (24 ekranın dışında; B6 §7.5, B7 §5.3) |
| Dil Kartları | Bekleme listesindeki diller (ör. "Python — listedesin") ve [Vazgeç] |
| Hesap | [Verilerimi İndir], [Hesabımı Sil] |

| Durum | Metin / görünüm |
|---|---|
| Yükleniyor | Form iskeleti |
| Boş | Dil Kartları: "Hiçbir dil için bekleme listesinde değilsin." |
| Hata | "Ayarlar kaydedilemedi. Değişikliğin cihazında saklandı." [Tekrar Dene] |
| Çevrimdışı | "Çevrimdışısın. Ayarlar cihazında değişir, bağlanınca eşitlenir." (hesap işlemleri devre dışı) |

| Tetikleyici | Sonuç | Ses / animasyon |
|---|---|---|
| Anahtar/kaydırıcı değişimi | Anında uygulanır; "Kaydedildi" toast'u (en çok 1/sn) | `ui_tap` |
| Ses anahtarı açıldı | İlk kez ise örnek "tık" çalar, kaydırıcılar etkinleşir | `ui_confirm` |
| [Veliye Tekrar Gönder] | `POST /v1/guardian-consents/resend` (günde 3) | — |
| [Verilerimi İndir] | Talep alınır; hazır olunca bildirim ve indirme bağlantısı (kullanıcı onayıyla indirilir) | — |
| [Hesabımı Sil] | Sayfa içi dört adım: ne silinir (Çip iadesi yapılmaz) → telefon koduyla yeniden doğrulama (`REAUTH_REQUIRED`) → "HESABIMI SİL" yazarak onay → talep alındı kartı: **7 gün bekleme**, bu sürede [Vazgeç]; neyin silinip neyin saklandığı `willErase` / `willRetain` listesiyle yazılır (Çip fatura kayıtları vergi mevzuatı gereği saklanır; B7 §5.4.20) | `ui_confirm`; son adımda yok ses |
| Dil Kartı [Vazgeç] | Kayıt silinir | `ui_tap` |

**Veri:** `GET/PATCH /v1/players/me`, `GET/PUT /v1/players/me/notification-preferences`, `PUT/DELETE /v1/push-subscriptions`, `GET /v1/privacy/notices`, `POST /v1/privacy/consents` (`analytics`, `marketing`, `aiCalibration`), `POST /v1/privacy/data-exports` ve `GET /v1/privacy/data-exports/{exportId}`, `POST /v1/privacy/erasure-requests` (+ `GET/DELETE …/{requestId}`), `POST /v1/players/me/guardian-consents`, `GET /v1/auth/sessions`, `DELETE /v1/auth/sessions/{sessionId}`, `POST /v1/auth/phone-changes`, `POST /v1/players/me/handle-changes` (500 B), `POST /v1/language-waitlist`.

**Mobil.** Önce 8 satırlık bölüm listesi, seçince ayrıntı ekranı (geri düğmesi 48 px); kaydırıcılar 48 px yüksek; tehlikeli bölge her zaman en altta ve kırmızı çerçeveli. **Mikro:** anahtar 160 ms kayar; ses kaydırıcısı bırakılınca örnek ses; "Hesabımı Sil" düğmesi basılı tutmayı gerektirmez ama dört adımlıdır. **Erişilebilirlik:** her anahtar `role="switch"` + açık etiket; kaydırıcılar klavyeyle ok tuşlarıyla; hukuk metinleri `<article>` başlık hiyerarşisiyle; tehlikeli işlem onayı renk + metin ("HESABIMI SİL" yazısı) ve `aria-describedby` ile açıklanır.

---

## 7. Navigasyon haritası ve kullanıcı akışları

### 7.1 Ekran geçişleri (kenar listesi)

Düğümler 24 ekran (`token`) ve HUD'dur. Kenar = bir ekrandan diğerine geçiş; "tetikleyici etiketi" diyagramda ok üzerine yazılacak kısa metindir. HUD kenarları her ekrandan geçerlidir (HUD modu izin verdiği ölçüde) ve ayrı alt tabloda verilmiştir. **Geri** davranışı: panel ekranları `Esc`/geri ile geldikleri sahneye (aynı hücre) döner; sahne ekranları arası geri yoktur, tramvay/harita vardır.

**A. Kayıt ve onboarding**

| # | Kaynak | Hedef | Tetikleyici etiketi | Koşul / not |
|---|---|---|---|---|
| 1 | `giris` | `dil-sec` | Kod doğrulandı | Yeni oyuncu, yaş uygun (15+; e-Devlet doğrulamalı) |
| 2 | `giris` | `meydan` | Giriş yap | Kayıtlı oyuncu (kurulum tamam) |
| 3 | `dil-sec` | `avatar` | C# ile Başla | — |
| 4 | `avatar` | `meydan` | Şehre Gir | Giriş sineması (40 sn, atlanabilir) |

**B. Meydan merkezli**

| # | Kaynak | Hedef | Tetikleyici etiketi | Koşul / not |
|---|---|---|---|---|
| 5 | `meydan` | `akademi` | Akademi kapısı | Sahne geçişi |
| 6 | `meydan` | `harita` | Harita | 23. dakikadan sonra |
| 7 | `meydan` | `pazar` | Pazar | Pazar binası/manken veya HUD |
| 8 | `meydan` | `liderlik` | Liderlik Panosu | Pano nesnesi |
| 9 | `meydan` | `oda` | Oda | Sev. 2+; Bloklar kapısı veya HUD |
| 10 | `meydan` | `sokak` | Meydan Otoparkı | Turist ziyareti |
| 11 | `meydan` | `tekrar` | Günlük Tekrar | İlk Mühür sonrası |
| 12 | `meydan` | `panel` | İşletmelerim | İlk tapu sonrası |
| 13 | `meydan` | `dolap`, `metro`, `profil`, `sohbet`, `ayarlar` | HUD sağ küme / Menü | Bkz. HUD kenarları |

**C. Akademi ve ders akışı**

| # | Kaynak | Hedef | Tetikleyici etiketi | Koşul / not |
|---|---|---|---|---|
| 14 | `akademi` | `derslik` | Dersi Başlat | Ders açık |
| 15 | `akademi` | `atolye` | Atölye girişi | Ders Mührü sonrası görevler açık |
| 16 | `akademi` | `tekrar` | Danışma kiosku | — |
| 17 | `akademi` | `metro` | Mühür Duvarı | — |
| 18 | `akademi` | `meydan` | Ana kapı | Çıkış |
| 19 | `derslik` | `kurul` | Usta sorusuna geç | Kartlar bitti |
| 20 | `derslik` | `akademi` | Çıkış (✕) | İlerleme kaydedilir |
| 21 | `kurul` | `kurul` | Sonraki soru | 3 Usta sorusu |
| 22 | `kurul` | `derslik` | Dersi Gör | Puan < 40: ders kartı önerisi |
| 23 | `kurul` | `atolye` | Göreve Geç | Ders Mührü alındı (3 sorudan 2'si ≥ 70) |
| 24 | `kurul` | `akademi` | Kürsüden Çık | — |
| 25 | `atolye` | `akademi` | Çık | — |
| 26 | `atolye` | `sokak` | Tapuyu Al | Ruhsat 3/3 olunca hedef çubuğu |
| 27 | `metro` | `derslik` | Derse Git | — |
| 28 | `metro` | `liderlik` | Altın durak sayacı | Kalıcılık Ligi sekmesi |
| 29 | `tekrar` | `metro` | Haritada Gör | Sonuç kartı |
| 30 | `tekrar` | `meydan` | Bitir | — |

**D. İşletme akışı**

| # | Kaynak | Hedef | Tetikleyici etiketi | Koşul / not |
|---|---|---|---|---|
| 31 | `harita` | `sokak` | Satılık (S) / işletme ikonu | — |
| 32 | `harita` | `meydan` / `akademi` | Git (tramvay vinyeti) | 1,5 sn |
| 33 | `sokak` | `is-emri` | KODLA! / İş Emrini Aç | Durum: Kapalı — yazılım bekliyor |
| 34 | `sokak` | `panel` | Panel | Sahibi, Açık/Deneme |
| 35 | `sokak` | `vitrin` | Vitrini Gör | L2+ |
| 36 | `sokak` | `editor` | Müfettişin Dosyasına Bak | Durum: Kararmış |
| 37 | `sokak` | `meydan` | Çık | — |
| 38 | `is-emri` | `editor` | Kodlamaya Geç | ≥ 4 soru sorulmuş |
| 39 | `editor` | `savunma` | Savunma'ya Geç | 26/26 test geçti |
| 40 | `editor` | `is-emri` | İş emrini gör | Sözleşme sekmesi |
| 41 | `savunma` | `sokak` | İşletmeyi Gör | Açılış / Deneme sonrası |
| 42 | `savunma` | `panel` | Paneli Aç | Deneme sonrası |
| 43 | `panel` | `is-emri` | Yükselt | L2–L5 yeni müşteri isteği |
| 44 | `panel` | `atolye` | Hatayı Bul | Hata Bildirimi dosyası |
| 45 | `panel` | `vitrin` | Vitrin'e Git | L2+ |
| 46 | `panel` | `sokak` | Sokağa Git | — |
| 47 | `panel` | `pazar` | Pazar'a Git | Bayt harcama ipucu |
| 48 | `vitrin` | `sokak` | Sokağa Dön | — |
| 49 | `vitrin` | `profil` | Sahibinin Profili | — |

**E. Kozmetik, oda ve sosyal**

| # | Kaynak | Hedef | Tetikleyici etiketi | Koşul / not |
|---|---|---|---|---|
| 50 | `pazar` | `dolap` | Dolap'a Git | Satın alma sonrası |
| 51 | `pazar` | `panel` | Kasanı topla | Yetersiz Bayt ipucu |
| 52 | `dolap` | `pazar` | Pazar'da Gör | — |
| 53 | `dolap` | `oda` | Odama Git | — |
| 54 | `sohbet` | `oda` | Odasına Git | Arkadaş odası; izin moduna göre |
| 55 | `sohbet` | `profil` | Profili Gör | — |
| 56 | `sohbet` | `meydan` | Arkadaşa Git | Shard birleşimi (B1 §11.2) |
| 57 | `oda` | `profil` | Sahibin Profili | — |
| 58 | `oda` | `pazar` | Eşya Al | Sahibi |
| 59 | `oda` | `meydan` | Çık | — |
| 60 | `profil` | `vitrin` / `sokak` / `dolap` / `sohbet` | İşletme kartı / Etiketimde Göster / Arkadaş Ekle | Kendi / başkasının profili |
| 61 | `liderlik` | `profil` | Oyuncu satırı | — |
| 62 | `liderlik` | `vitrin` / `sokak` | En Hızlı Otopark / En kazançlı işletme | — |
| 63 | `ayarlar` | `giris` | Çıkış Yap / Hesabı sil | — |
| 64 | herhangi | `giris` | Oturum doldu | Yenileme başarısız |

**HUD kenarları (her ekranda, HUD izin verdikçe):**

| # | Kaynak | Hedef | Tetikleyici etiketi |
|---|---|---|---|
| H1 | `hud` | `harita` | Hedef çubuğu · Harita (`M`) |
| H2 | `hud` | `akademi` | Akademi (`A`) |
| H3 | `hud` | `panel` | İşletmelerim (`K`) · Bayt pili ipucu |
| H4 | `hud` | `tekrar` | Günlük Tekrar (`T`) |
| H5 | `hud` | `oda` | Oda (`H`) |
| H6 | `hud` | `pazar`, `liderlik`, `sohbet`, `ayarlar` | Sağ küme simgeleri (`P`, `L`, `C`) |
| H7 | `hud` | `dolap`, `metro`, `profil` | Menü sayfası (`D`) / kimlik kartı |
| H8 | `hud` | görev hedefi (sahne) | Görev kartı "Git" (`G`) |

### 7.2 Akış 1 — Giriş → İlk Kurul Kartı (VİZYON §4, ilk 14,5 dakika)

| Adım | Ekran | Oyuncu eylemi | Sistem yanıtı | Zaman · HUD |
|---|---|---|---|---|
| 1 | `giris` | `5xx` numarasını yazar, Aydınlatma Metni onay kutusunu işaretler, "Kod Gönder" | SMS kodu gider; 90 sn sayaç | 0:10 · gizli |
| 2 | `giris` | 6 haneli kodu girer | Doğrulama; tik | 0:35 |
| 3 | `giris` | Doğum yılı 2004 seçer | ≥ 18: veli adımı yok | 0:50 |
| 4 | `dil-sec` | "C# ile Başla" | Seçim kaydedilir | 1:15 |
| 5 | `avatar` | Yüz, saç, kıyafet seçer; takma ad `zeynep_cs` | Ad denetimi geçer; "Şehre Gir" | 2:00–4:00 |
| 6 | `meydan` | Giriş sinemasını izler (ya da Atla); Defne'nin balonlarını okur | HUD açılır: XP çubuğu, Bayt "0 B", görev kartı; tek işaretçi Akademi | 4:00–6:30 · HUD 3 öğe |
| 7 | `meydan` → `akademi` | Zemine tıklayıp yürür, Akademi kapısına gelir | 600 ms kuralı yürüme; sahne geçişi | 6:30 |
| 8 | `akademi` → `derslik` | Çarşı Kürsüsü'nde "1.1 Merhaba KodKent" → [Dersi Başlat] | Panel açılır | 6:45 · odak |
| 9 | `derslik` | Tahmin Et → Çalıştır → İncele kartları | Çıktı konsolda akar | 7:00–10:00 |
| 10 | `derslik` | Mini editörde `string ad = "Zeynep";` yazar, Çalıştır, "Panoda Göster" | Çıktı LED panoda 10 sn akar (sosyal gösteriş anı #1) | 10:00–12:30 |
| 11 | `derslik` → `kurul` | "Usta sorusuna geç" | Kurul Kartı açılır; rubrik cevap kutusunun üstünde | 12:30 |
| 12 | `kurul` | Defne'nin sorusunu (`yas` ne, `17` ne, `int` ne?) 2–3 cümleyle yanıtlar, "Cevabı Gönder" | "Kurul değerlendiriyor…" mührü | 13:30 |
| 13 | `kurul` | Sonucu okur | **82/100** · Doğruluk 45/50 · Tamlık 22/30 · Açıklık 15/20; Defne geri bildirimi; **+25 XP** | 14:00 |
| 14 | `kurul` | — | XP 60 → **85**: seviye atlama modali **Sev. 2** (eşik 80); Oda hakkı | 14:00–14:30 · Sev. 2 |

### 7.3 Akış 2 — Tapu → İş Emri → Kod → Müfettiş → Savunma → Açılış → Kasa (VİZYON §4, §7)

| Adım | Ekran | Oyuncu eylemi | Sistem yanıtı | Zaman · HUD |
|---|---|---|---|---|
| 1 | `meydan` / `harita` | Hedef çubuğunu okur: "Otopark: 300/300 B · Ruhsat 3/3 · Sev. 3 ✓" | Çubuk "Tapuyu al" düğmesine döner | ≈ 70. dk · tam |
| 2 | `sokak` | "Tapuyu Al (300 B)" → onay | `POST /v1/businesses`; cüzdan 300 → 0 B; 2 sn dönüşüm; durum "Kapalı — yazılım bekliyor"; KODLA! oku; LED: "Yeni tapu: @zeynep_cs — Çarşı" | ≈ 71. dk |
| 3 | `sokak` → `is-emri` | KODLA! okuna tıklar | Hasan Abi iş emrini söyler (3 kural birebir) | ≈ 72. dk · odak |
| 4 | `is-emri` | En az 4 soru sorar (ör. "Tam 2 saat?", "Tam 6 saat?", "24 saati aşan?", "Aynı dakika?") | Her cevap Sözleşme Kartı'na madde yazar; Keskin Göz (isteğe bağlı +50 XP) | ≈ 72–76. dk |
| 5 | `is-emri` → `editor` | "Kodlamaya Geç" | Sözleşme Kartı tamamlanır; iskelet kod açılır | ≈ 77. dk |
| 6 | `editor` | Metodu yazar; `Ctrl+Enter` | 6 açık test: önce 4/6, düzeltince 6/6; Fener ipucu açılabilir | 25 dk (Otopark L1) |
| 7 | `editor` | "Müfettişi Çağır" | 14 gizli + 6 tohumlu test; hepsi geçerse "Savunma'ya Geç"; kalırsa şikâyet balonu (kategori, girdi değil) | + 2 dk |
| 8 | `editor` → `savunma` | "Savunma'ya Geç" | Kurul kodundan 11. satırı seçer; Hasan Abi: "121 dakika neden 120 TL? Hangi satır belirliyor?" | — |
| 9 | `savunma` | Açıklama yazar, "Cevabı Gönder" | Kurul değerlendirir: 88/100 | + 3 dk |
| 10 | `savunma` | — | **Açılış** sinematiği: bariyer kalkar, 12 park yeri, konfeti, LED panoda duyuru, ilk NPC araba; **+300 XP** | 6 sn |
| 11 | `sokak` | İşletmeyi görür | Tabela `@zeynep_cs'nin Otoparkı · Çırak Sev. 4 · AÇIK`; kasa göstergesi boş | — |
| 12 | `sokak` / `panel` | 1 saat sonra kasaya döner; "Kasayı Topla" | Kasa dolmaya başlar (≈ 9 B/sa); toplama: Bayt sayacı artar | +1 sa · HUD: İşletmelerim amber nokta |
| 13 | `panel` | Gelir grafiğine bakar (ertesi gün) | "Bugün: 12 araç · 2.220 TL · 220 B" | Gün 2 |

### 7.4 Akış 3 — Pazar → Dolap → Oda ziyareti

| Adım | Ekran | Oyuncu eylemi | Sistem yanıtı | HUD / ses |
|---|---|---|---|---|
| 1 | `meydan` | HUD'daki Pazar simgesine dokunur (yeni raf rozeti) | Panel açılır, Bayt Rafları sekmesi | Bayt 1.240 B |
| 2 | `pazar` | "Kapüşonlu Hırka" (Şık, 220 B) kartına dokunur | Önizleme avatara giydirir; özet "Cüzdan: 1.240 B → 1.020 B" | `ui_tap` |
| 3 | `pazar` | [Satın Al] → onay modali → [Satın Al] | `purchases`; Bayt sayacı 1.240 → 1.020 sayarak düşer; toast "Kapüşonlu Hırka senin. Dolap'ta." | `coin_spend` |
| 4 | `pazar` → `dolap` | [Dolap'a Git] | Dolap açılır, Kıyafet > Üst sekmesinde yeni öğe "Yeni" rozetli | — |
| 5 | `dolap` | Hırkayı seçer, [Kaydet] | Önizleme güncellenir; sunucuya yazılır | `ui_confirm` |
| 6 | `dolap` → `meydan` | Kapatır; avatarı yeni hırkayla Meydan'da görür | Podyum ve kalabalık hırkayı görür | — |
| 7 | `sohbet` | Arkadaş listesinde `@mert.k`'yı seçer, [Odasına Git] | Oda izin modu "Herkese açık"; `oda?oda=…` ziyaretçi olarak açılır (sahibi çevrimdışı olabilir) | — |
| 8 | `oda` | Stüdyo'yu gezer, Rozet Duvarı'na bakar, Ziyaretçi Defteri'ni açar | Son 20 ziyaretçi; ayak izleri | — |
| 9 | `oda` | [Alkışla] | Günde 1; sahibine 2 B; toast "Alkışladın." (ilk kez ise ilk Alkış bonusu) | `applause` |
| 10 | `oda` → `meydan` | Kapıdan çıkar | Aynı hücreye dönüş; LED panoda ziyaret sayısı güncellenir | — |

---

## 8. Mockup içerik paketi

Bu bölüm, **Ekranlar sayfasındaki** yüksek sadakatli HTML mockup'ların (Derleyici Meydanı + HUD, Kurul Kartı, İş Emri, İşletme Editörü, Savunma, Pazar) ve prototipin kullanacağı **gerçek metin, sayı ve örnek veri**dir. Yer tutucu ("Lorem", "XXX") yoktur; sayılar KANON/B2/B4/B5'tendir. Kurul kartı JSON'u B3 şemasıyla (alan adları aynen) ve B7 §5.4.8 örneğiyle uyumludur. Dinamik ek içeren her ifade `tr-ek` kuralıyla yazılmıştır (§13.3).

### 8.1 Örnek oyuncu ve üç zaman damgası

| Alan | Değer |
|---|---|
| Takma ad (`handle`) / görünen ad | `zeynep_cs` (ekranda `@zeynep_cs`) / Zeynep (Usta bu adla hitap eder) |
| Doğum yılı · yaş bandı | 2004 · 18+ |
| Avatar | §10.2 #1 (orta vücut, ten 4, kestane omuz dalgalı saç, Çırak Şapkası, lacivert–turuncu kapüşonlu hırka, kot, spor, okul çantası) |
| Davet Kodu · işletme adresi | `7H3Q-9XM2` · Çarşı · Tente Sokak No: 3 |

| Kod | An | Kullanıldığı mockup | Sev. · unvan | XP toplam · seviye içi | Bayt · Çip | Görev kartı | Hedef çubuğu |
|---|---|---|---|---|---|---|---|
| **M-14** | Gün 1 · 14. dakika | Kurul Kartı | 1 → **2** (kart sonrası) · Çırak | 60 → **85** · 5 / 200 | 0 B · gizli | "Ders 1.1 — Usta sorusu 1/3" | Yok (23. dakikada açılır) |
| **M-75** | Gün 1 · ≈ 75. dakika (tapudan sonra) | İş Emri, Editör, Savunma | 4 · Çırak | 640 → 690 (Keskin Göz) → **990** (Açılış) · 10 → 60 → 360 / 520 | 0 B (tapu −300 B) → 100 B (Açılış Kurdelesi, B2 §5.2) · gizli | "İş Emri #1 — Otopark" | "Hedef: Otopark — kod ve Savunma" |
| **M-G9** | Gün 9 · Salı 10 Kasım 2026, 19:40 (Akşam fazı) | Meydan (HUD), Pazar | 7 · Kalfa | 3.215 · 465 / 1.110 (%42) | 1.240 B · 10 Çip | "Depo Sayımı" | "Hedef: Kargo Deposu — 1.240 / 1.500 B · Ruhsat 2/3 · Sev. 6 ✓" |

Sayı kontrolü: Toplam(7) = 2.750, XP(7) = 1.110, 2.750 + 465 = 3.215; Toplam(4) = 630, XP(4) = 520; M-14'te kart öncesi 60 XP VİZYON §4 ve B7 §5.4.8 sayısıdır (B4 §4.1 Sev. 2 eşiğini üçüncü soruda aşılır sayar; Açık Soru 5).

### 8.2 Derleyici Meydanı (HUD ile) — M-G9

| HUD öğesi | İçerik |
|---|---|
| Kimlik kartı | Avatar büstü, `@zeynep_cs`, "Kalfa · Sev. 7", XP çubuğu **%42** ("465 / 1.110 XP" odakta); halka %42 |
| Para pilleri | **1.240 B** (amber) · **10 Çip** (turkuaz) |
| Hedef çubuğu | "Hedef: Kargo Deposu" · parçalar: `1.240 / 1.500 B` (%83, eksik) · `Ruhsat 2/3` (eksik) · `Sev. 6` (tamam, nane tik) |
| Sağ küme | Bildirim **3** · Görev ● · Pazar ● (yeni raf) · Liderlik · Sohbet **2** · Ayarlar |
| Görev kartı | Başlık "Depo Sayımı" · rozet "Sıfırdan" · "Ders 2.3 · foreach ve Envanter Sayımı" · adım metni: "Kargo Deposu'nun raf sayımını `foreach` ile yaz: toplam, sayım ve en büyük." · ödül çipleri `+60 XP` `+80 B` `Ruhsat 3/3 → +100 B` · [Git] |
| Alt dock | Akademi · Harita · İşletmelerim (sarı nokta: Müfettiş dosyası 1) · Günlük Tekrar (nokta: hazır, seri 4 gün) · Oda |
| Bağlam eylemi / emote | "Gir: Akademi" · emote çarkı (varsayılan yuva 2: Alkışla) |
| Sohbet mini | 3 satır (aşağıda) |

| Sahne öğesi | İçerik |
|---|---|
| Faz / sayaç | Akşam (amber overlay %18, ışık sprite'ları açık); Çeşme tooltip'i "sonraki Meydan Sorusu 20 dk sonra" (20:00) |
| LED pano (6 mesaj, 8 sn'lik döngü) | "Yeni işletme: @mert.k'nin Büfesi — Çarşı" · "Meydan Sorusu — en hızlı 3: @berk_34 · @ayse_kod · @kaan" · "En çok alkışlanan işletme: @ayse_kod'un Otoparkı" · "Lig kapanışına 5 gün 1 saat" · "Yeni tapu: @ela_c — Çarşı" · "@deniz07: Merhaba KodKent!" |
| Meydan Otoparkı (öne çıkan) | Tabela "@nil_cs'nin Otoparkı · Çırak Sev. 5 · AÇIK" |
| Oyuncular (hücre `gx,gy`) | `@zeynep_cs` (20,22) Kalfa · Sev. 7 · `@berk_34` (17,24) Kalfa · Sev. 9 · `@ayse_kod` (23,18) Kalfa · Sev. 8 · `@mert.k` (25,24) Kalfa · Sev. 8 · `@ela_c` (14,19) Çırak · Sev. 3 · `@kaan` (19,15) Çırak · Sev. 4 · `@deniz07` (27,21) Çırak · Sev. 5 · `@nil_cs` (22,27) Çırak · Sev. 5; her biri §10.2 avatarlarından |
| NPC | Usta Defne (21,23) · Belediye Memuru Nuran (31,12) · 4 figüran (isim etiketi yok) |
| Sohbet balonları | `@mert.k`: "Büfeyi açtım, uğrayın!" · `@ela_c`: "Kademeli Karar'da takıldım, Pusula'ya bakmak lazım." · `@kaan`: "Meydan Sorusuna kim katılıyor?" · `@zeynep_cs`: "Ben! Selam herkese." |
| Usta Defne balonu (2 parça) | "Çarşı Sınavı'nı geçtin, Zeynep. Liman'da Usta Kerem seni bekliyor." / "Konteynerleri saymayı sever; hesap makinesini yanında taşır." |
| Hedef işaretçisi | Zeminde noktalı yol → Tramvay Durağı; kart "Tramvayla 1 durak: Liman" |

### 8.3 Kurul Kartı — M-14

| Alan | İçerik |
|---|---|
| Üst şerit | "Ders 1.1 · Merhaba KodKent" · "Soru 1/3 · Kavram Sorusu" · Usta Defne portresi |
| Soru | "`int yas = 17;` yazdın. `yas` ne, `17` ne, `int` ne? Kendi cümlelerinle anlat." |
| Rubrik (üstte) | **Doğruluk 50** — ad, değer, tür rolleri doğru · **Tamlık 30** — üç noktanın üçü de var · **Açıklık 20** — kendi cümlelerin, düzenli |
| Cevap (96 / 1.500) | "`yas` bir kutu, `17` içine koyduğum değer, `int` de kutunun tam sayı tutacağını söyleyen etiket." |
| İpucu çekmecesi | Pusula · Fener · Taslak · Örnek (hiçbiri açılmadı → Berrak Zihin açık) |
| Mühür | **GEÇTİ** (yeşil, tikli) — 82 |
| XP | "+25 XP" (döküm: 30 × 82/100 = 25) · XP çubuğu 85 → Sev. 2 (5 / 200) |
| Ders Mührü | "Mühür: 1/3 soru geçti; 2 gerekiyor" |
| Takip | "Usta bir şey soruyor": "Peki `int` yerine `string` yazsaydık 17 kutuya sığar mıydı?" · kutu 0/300 · [Yanıtla] [Geç] |
| Butonlar | [İtiraz Et · 3/3] [Sonraki Soru] (82 ≥ 70 olduğundan [Tekrar dene] yok) |
| Seviye atlama modali | "Seviye 2 · Çırak" · "Odan açıldı: Bloklar'da kapını bul." · "Hediyen: 1 emote çark yuvası." |

Usta balonu (iki parça, ≤ 40 kelime/parça): (1) "Zeynep, 'kutu' benzetmen çok yerinde: `yas` kutu, `17` içindeki değer." (2) "Eksik olan, `int`'in kutuya yalnızca tam sayı girebileceğini söylemesi. Sonraki kartta tam bunu göreceksin; kendi cümlenle bir örnek düşün."

```json
{
  "puan": 82,
  "olcutler": [
    {"ad": "Doğruluk", "puan": 45, "not": "'Kutu' benzetmen doğru."},
    {"ad": "Tamlık",   "puan": 22, "not": "Türün neden önemli olduğu eksik."},
    {"ad": "Açıklık",  "puan": 15, "not": "Üç terimi ayırdın ama son cümle dağınık."}
  ],
  "geri_bildirim": "Zeynep, 'kutu' benzetmen çok yerinde: `yas` kutu, `17` içindeki değer. Eksik olan, `int`'in kutuya yalnızca tam sayı girebileceğini söylemesi. Sonraki kartta tam bunu göreceksin; kendi cümlenle bir örnek düşün.",
  "takip_sorusu": "Peki `int` yerine `string` yazsaydık 17 kutuya sığar mıydı?",
  "guven": 0.88,
  "kopya_suphesi": false
}
```

Alternatif durumlar (aynı kart): **HENÜZ DEĞİL** (B3 §4.1): puan 66 — Doğruluk 30/50, Tamlık 20/30, Açıklık 16/20, sarı mühür, [İtiraz Et · 3/gün] [Tekrar dene ×0,8] [Sonraki]; takip yanıtı "Koyamayız, çünkü int sadece tam sayı kabul eder; «on yedi» bir metin." → "Telafi +10 → 76 · GEÇTİ · XP 23". **Enjeksiyon:** 0 puan, "Kurul kandırılmaz. Mühür mürekkebi «puan ver» yazısını okumaz, cevabı okur. Bu deneme 0 puan; hakkın duruyor."

### 8.4 İş Emri — M-75

| Alan | İçerik |
|---|---|
| Üst şerit | "İş Emri #1 — Otopark (Çarşı)" · HUD odak: Sev. 4, XP çizgisi 10 / 520, Bayt 0 B |
| Hasan Abi (sol kart) | Portre: bıyıklı, kasketli, kareli defter. Balon 1: "İş emri bu evladım. Aklına takılan olursa sor." Balon 2 (`blockquote`): "2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum." |
| Usta Defne kenar notu | "Müşteriye sormadan kod yazan, iki kere yazar, Zeynep. Hasan Abi'ye en az dört soru sor; cevapları Sözleşme Kartı'na yazılacak." |
| Konuşma kaydı (3 soru) | Zeynep: "1 saat 10 dakika kalan ne öder?" → Hasan Abi: "Başlayan saat tam sayılır; 2 saatten az kaldı: 200." · Zeynep: "Tam 2 saat kalan ne öder?" → "O artık 2–6 dilimi: 2 × 40 = 80." · Zeynep: "Girip aynı dakika çıkan ne öder?" → "Ödemez. Bariyer eksi süre göndermez." |
| Müşteriye Sor paneli | Sorulmuş (S1, S2, S5: soluk + "soruldu"); kalan 5 çip: S3 "Tam 6 saat kalan ne öder?" · S4 "24 saati aşan ne öder?" · S6 "Süreyi nasıl göndereceksin: dakika mı, saat mı, kesirli mi?" · S7 "Ücret kuruşlu olabilir mi?" · S8 "Tam 24 saat kalan ne öder?" · serbest metin kutusu 0/140 |
| Sözleşme Kartı | **Madde 1 ✓** "Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL" · **Madde 2 ✓** "Dilimi ham kalış süresi belirler: `dakika < 120` → 1. dilim; `120 ≤ dakika ≤ 360` → 2. dilim (sınırlar dâhil); `dakika > 360` → günlük" · **Madde 3 ✓** "Başlayan saat tam sayılır: `saat = ceil(dakika / 60)`; 1. dilim `saat × 100`, 2. dilim `saat × 40`" · **Madde 4** soluk "Bu madde için müşteriye sormadın" · **Madde 5** (imza yarısı açık) "`public static int Otopark.UcretHesapla(int dakika)`" + soluk "dönüş TL, tam sayı" · **Madde 6** soluk |
| Eylem | "Kodlamaya Geç" kilitli: "Önce Hasan Abi'ye en az 4 soru sor (3/4)." |
| **Durum B** (4. sorudan sonra) | S4 sorulur → Madde 4 parlayarak yazılır ("Her başlayan gün 250.") → "Kodlamaya Geç" parlar; Defne: "Güzel sorular, Zeynep. Karar senin; sormadıkların kartta soluk kalıyor." · Serbest metin: "119 dakika 200 TL ama 120 dakika 80 TL, bu doğru mu?" → Hasan Abi: "Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle." → "Keskin Göz rozeti kazandın, +50 XP. Sözleşme Kartı'na madde 6 yazıldı." |

### 8.5 İşletme Editörü — M-75

Kod (durum A: devam eden çözüm; salt okunur satırlar 1–7 ve 15–16 soluk, editlenebilir aralık 8–14 turkuaz sol çubuklu):

```csharp
 1  // İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi
 2  public static class Otopark
 3  {
 4      // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)
 5      // dönüş: ödenecek ücret, TL (tam sayı)
 6      public static int UcretHesapla(int dakika)
 7      {
 8          if (dakika <= 0) return 0;
 9          int saat = (dakika + 59) / 60;   // başlayan saat
10          if (dakika < 120)
11          {
12              return saat * 100;
13          }
14          return saat * 40;                // 2 saat ve üstü
15      }
16  }
```

| Alan | İçerik |
|---|---|
| Sol sekmeler | Sözleşme · **Açık Testler** (seçili) · İpuçları · Müfettiş |
| Açık testler (durum A) | A1 · 30 dk · beklenen 100 · gerçek 100 · **geçti** — A2 · 61 · 200 · 200 · **geçti** — A3 · 120 · 80 · 80 · **geçti** — A4 · 121 · 120 · 120 · **geçti** — A5 · 361 · 250 · **280** · **kaldı** — A6 · 1.441 · 500 · **1.000** · **kaldı** · özet **"4/6 geçti"** |
| Eylem çubuğu | [Testleri Çalıştır] · [Müfettişi Çağır] (devre dışı: "Önce 6 açık testi geçmelisin (4/6).") · [Sıfırla] · "Bugün 0/10" |
| İpuçları (Pusula + Fener açık) | **Pusula:** "Bu iş emrinde üç ayrı iş var: (1) dakikayı 'başlayan saat'e çevirmek, (2) süreye göre tarife dilimini seçmek, (3) dilimin birim fiyatıyla çarpmak. Önce yalnızca ilkini çöz: 61 dakika kaç başlayan saattir? 120 dakika? 121 dakika?" · **Fener:** "Dilimi yuvarlanmış saat değil, ham dakika belirler (Sözleşme madde 2): 119 dakika hâlâ '2 saatten az', 120 dakika artık '2–6 saat'. Başlayan saat için Ders 1.2'deki kalıbı kullan: tam sayı bölmesinden önce bölenin bir eksiğini ekle. 24 saatten sonrası için aynı kalıp 1440 ile gerekir." |
| Usta (sağ kart, "Usta'ya sor") | "Zeynep, `(dakika + 59) / 60` ile başlayan saati doğru saymışsın; işin zor yarısı tamam. Henüz değil: 361 ve 1.441 dakikada kodun 280 ve 1.000 TL döndürüyor, Sözleşme 250 ve 500 diyor. 6 saatten sonrası hangi kurala giriyordu? Sözleşme'nin 4. maddesine bak." (≈ 50 kelime) |
| Editör alt çubuğu | "Satır 14, Sütun 31 · C# · Tab odağı taşımak için Ctrl+M" |

**Durum B (Müfettiş).** Kod, durum A'nın tamamlanmış hâlidir ama 11. satır `if (dakika < 360) return saat * 40;` (E6 hatası) → açık testler 6/6 yeşil, [Müfettişi Çağır] parlar ("Bugün 1/10"). Müfettiş paneli: "Müfettiş 20 test çalıştırdı" · gizli **13/14** · tohumlu **6/6** · şikâyet balonu: **"6 saat civarı kalanlar yanlış ücret ödedi."** · Müfettiş: "Dosya bıraktım." · Usta: "Zeynep, açık testlerin hepsi yeşil; sınırı sorgulaman gerektiğini zaten biliyordun. Henüz değil: tam 6 saat kalan müşteri için Sözleşme madde 2 ne diyor? `<` ile `<=` farkını 360 ile dene." (B5 §3.8 ile hizalanır). **Durum C (26/26):** Usta Yorumu (+20 XP): "Zeynep, bütün testler yeşil; `(dakika + 59) / 60` kalıbını kendi başına kurman süreç olarak güzel. Eksik: 100, 40 ve 250 sayıları kodun içinde anlamsız duruyor; yarın Hasan Abi fiyatı değiştirirse hepsini aramak zorunda kalırsın. Sonraki adım: bu sayıları müşterinin sözcükleriyle adlandırılmış `const int` değerlere çevir." · [Savunma'ya Geç] parlar.

### 8.6 Savunma — M-75

Tamamlanmış kod (26/26 geçti; Kurul'un seçtiği satır **11**):

```csharp
 1  // İş emri #1 — Otopark (Çarşı) — Müşteri: Hasan Abi
 2  public static class Otopark
 3  {
 4      // dakika: aracın içeride kaldığı toplam süre (0 veya daha büyük)
 5      // dönüş: ödenecek ücret, TL (tam sayı)
 6      public static int UcretHesapla(int dakika)
 7      {
 8          if (dakika <= 0) return 0;
 9          int saat = (dakika + 59) / 60;       // başlayan saat
10          if (dakika < 120) return saat * 100; // 2 saatten az kalanlar
11          if (dakika <= 360) return saat * 40; // 2–6 saat arası (sınırlar dâhil)
12          int gun = (dakika + 1439) / 1440;    // başlayan gün
13          return gun * 250;
14      }
15  }
```

| Alan | İçerik |
|---|---|
| Soru kartı | Hasan Abi: "Zeynep, 121 dakika kalan müşteri neden 120 TL ödüyor? Hangi satır belirliyor, ben de bakayım." · "Kurul bu satırı seçti: 11" |
| Rubrik (kutunun üstünde) | Doğruluk 50 (satırı doğru anladın mı?) · Tamlık 30 (sınır değerleri ve nedeni) · Açıklık 20 (anlaşılır mı?) |
| Bilgi şeridi | "Kodun kilitli. Yapıştırma bu kutuda kapalı." |
| Cevap (294 / 1.500) | "121 dakika 120'den büyük ve 360'tan küçük olduğu için 2. dilimde. Bu dilimde ücret başlayan saat × 40. 121 dakika 2 saati bir dakika geçtiği için 3. saat başlamış sayılıyor: (121 + 59) / 60 = 3. Yani 3 × 40 = 120. Dilimi seçen koşul `if (dakika <= 360)`, ücreti veren ifade `return saat * 40;`." |
| Test özeti | **26/26 geçti** (6 açık · 14 gizli · 6 tohumlu) |
| Kurul kartı (mühür PARLAK) | **94** — Doğruluk **48** "Dilimi ve hesabı doğru izledin." · Tamlık **28** "Dilim koşulu, yuvarlama ve çarpım var; 10. satırın neden 11. satıra yol verdiği eksik." · Açıklık **18** "Adım adım ve kendi cümlelerinle." · `guven` 0,91 · `takip_sorusu` boş |
| Hasan Abi'nin geri bildirimi | "Zeynep, satırı da hesabı da anlattın; 121 dakikanın 120 TL ettiğini ben de gördüm. Henüz küçük bir eksik: 10. satırın neden 11. satıra yol verdiğini bir cümleyle bağlarsan tamam. Sonraki adım: bariyeri kaldır, ilk araba geliyor." |
| Açılış | Bariyer kalkar; LED: "Yeni işletme: @zeynep_cs'nin Otoparkı — Çarşı"; tabela "@zeynep_cs'nin Otoparkı · Çırak Sev. 4 · AÇIK"; **+300 XP** (690 → 990; Sev. 4 içinde 360 / 520); **+100 B** Açılış Kurdelesi; kasa göstergesi boş (0 / 73 B) |
| Deneme (alternatif) | Cevap "Çünkü 121, 120'den büyük." → **42**: Doğruluk 22 · Tamlık 8 · Açıklık 12; "İşletmen Deneme modunda açıldı. Gelir %50; 24 saat sonra yeniden Savunma yapabilirsin." · ipucu "Satırı yeniden oku: 121 dakika hangi koşula giriyor?" |

### 8.7 Pazar — M-G9

Üst çubuk: sekmeler **Bayt Rafları** (seçili) · Butik · Rütbe Rafı; sayaç "Yeni raf: Pzt 09:00 · 5 g 13 sa"; kategori çipleri Hepsi · Kıyafet · Aksesuar · Evcil · Oda · Emote. Bayt Rafları (12 kart; fiyatlar B2 §9.1 bantlarında):

| # | Ürün (`sku`) | Nadirlik | Kategori | Fiyat | Durum |
|---|---|---|---|---|---|
| 1 | Çırak Şapkası (`cirak-sapkasi`) | Sıradan | Baş · Kıyafet | 30 B | Sende var · Giyili |
| 2 | Lacivert Bere (`bere-lacivert`) | Sıradan | Baş · Kıyafet | 45 B | — |
| 3 | Kargo Pantolon (`kargo-pantolon`) | Sıradan | Alt · Kıyafet | 70 B | — |
| 4 | Bot (`bot`) | Sıradan | Ayak · Kıyafet | 90 B | — |
| 5 | Kapüşonlu Hırka (`kapusonlu-hirka`) | Şık | Üst · Kıyafet | 220 B | Sende var · Giyili |
| 6 | Kod Kedisi (`kod-kedisi`) | Şık | Evcil | 300 B | — |
| 7 | Ahşap Parke (`parke-ahsap`) | Şık | Oda zemini | 150 B | — |
| 8 | Kalp (`emote-kalp`) | Şık | Emote | 120 B | — |
| 9 | **Kaptan Şapkası** (`kaptan-sapkasi`) | Nadir | Baş · Kıyafet | **520 B** | Seri No. 037/200 · **seçili** |
| 10 | Sarı Yağmurluk (`sari-yagmurluk`) | Nadir | Üst · Kıyafet | 610 B | Seri No. 112/200 |
| 11 | Liman Martısı (`liman-martisi`) | Nadir | Evcil | 780 B | Seri No. 008/150 |
| 12 | Konteyner Sehpa (`konteyner-sehpa`) | Nadir | Oda eşyası | 360 B | Seri No. 054/200 |

2. sayfa: Çarşı Tentesi (Nadir · Oda · 340 B) · Şapka Çıkar (Nadir · Emote · 250 B) · **Seri Dondurucu** (kalıcı · 50 B · stok 0/2).

| Panel | İçerik |
|---|---|
| Önizleme paneli | Zeynep avatarı Kaptan Şapkası ile; [Dene] aktif |
| Satın alma özeti | "Kaptan Şapkası · Nadir · Baş" · "520 B" · "Cüzdan: 1.240 B → 720 B" · "Bu ürün 12 hafta sonra tekrar gelir." · [Satın Al] |
| Onay modali | "Kaptan Şapkası'nı 520 B'ye almak üzeresin. Cüzdan: 1.240 B → 720 B." [Satın Al] [Vazgeç] |
| Başarı | Toast: "Kaptan Şapkası senin. Dolap'ta." · [Giy] [Dolap'a Git] |
| **Butik** (Çip; cüzdan 10 Çip) | "Neon Çırak" kıyafet seti (4 parça) **100 Çip** — "90 Çip eksik" · "Gece Odası" oda teması **120 Çip** — "110 Çip eksik" · "Dans Paketi I" (8 emote) **40 Çip** — "30 Çip eksik" · İsim rengi (6 renk) **20 Çip** — "10 Çip eksik" · altında: "Çip'i ücretsiz kazanmanın yolu: Semt Sınavı (+10 Çip)." [Çip Paketleri] |
| **Çip paketleri** (B2 §9.3) | Avuç **100 Çip · 59,99 TL** · Kutu **260 Çip · 149,99 TL** (+%4) · Sandık **560 Çip · 299,99 TL** (+%12; 15–17 için veli onayı) · Konteyner **1.200 Çip · 599,99 TL** (+%20; veli onayı) · "Ne aldığını görerek alırsın: rastgele kutu yok." · "Bayt satın alınamaz; Çip yalnızca kozmetik içindir." |
| **Rütbe Rafı** (Nişan; satılmaz) | Otopark Ustası Şapkası — "Gizli testlerin tamamını ilk 3 denemede geç." · Keskin Göz Rozeti — **KAZANILDI** · Çarşı Semt Madalyası — **KAZANILDI** · Derleyici Dansı (emote) — **KAZANILDI** (ilk Açılış) · Mühür Vur (emote) — "10 altın durak: 3/10" |

---

## 9. Bileşen kütüphanesi

Bileşenler `packages/ui` içinde yaşar, token'ları §3.7'den alır ve Storybook'ta **tüm durumlarıyla** (varsayılan, hover, odak, basılı, devre dışı, yükleniyor, hata) yer alır; her hikâye `axe-core` testinden geçer. Ortak kurallar: dokunmatik hedef ≥ 44 px (varsayılan 48); odak halkası 3 px `turkuaz-300` + 2 px `night-950` boşluk (zemin üstünde 9,06:1); durum her zaman ikon/şekil + metin taşır; animasyon süreleri §11 token'larıdır.

#### Button

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Birincil** | Turkuaz zemin, `night-950` yazı (9,27:1), 4 px koyu alt kenar (`turkuaz-700`); ekran başına tek | `--kk-turkuaz-500`, `--kk-btn-edge` |
| **İkincil** | `night-700` zemin, `fg` yazı, 2 px `control-border` kenar | `--kk-night-700`, `--kk-control-border` |
| **Metin** | Şeffaf, `turkuaz-300` yazı, altı çizili odakta | `--kk-turkuaz-300` |
| **Tehlike** | `mercan-500` zemin, `night-950` yazı (7,40:1); beyaz yazı yasak | `--kk-mercan-500` |
| **Bayt / Ödül** | `amber-500` zemin, `night-950` yazı (11,40:1); toplama ve satın alma CTA'sı | `--kk-amber-500` |
| **Simge** | 44×44 ve 48×48 yuvarlak; `aria-label` zorunlu | `--kk-r-pill` |
| Boyut | S 40 (yalnız masaüstü ikincil/metin) · **M 48** (varsayılan) · L 56 (birincil CTA); en küçük genişlik 88 | — |
| Durum | hover: parlaklık +6 %, 2 px yükselir · basılı: alt kenar 1 px, 3 px aşağı (100 ms) · odak: halka · devre dışı: `night-600` zemin + `muted` yazı, neden araç ipucunda · yükleniyor: sabit genişlik + dönen simge, `aria-busy` · başarı: tik 400 ms | `--kk-dur-1`, `--kk-dur-4` |

#### Card

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Yüzey** | `night-800`, yarıçap 22, süs çizgisi `line` | `--kk-night-800`, `--kk-r-card` |
| **Yükseltilmiş** | `night-700` + gölge (`0 8px 20px -10px rgba(0,0,0,.6)`) | `--kk-night-700` |
| **Vurgulu** | 2 px `turkuaz-500` kenar (seçili, önerilen) | — |
| **Nadirlik çerçeveli** | Kenar rengi nadirlik (§10.3) | rozet token'ları |
| **Durum** | Üst 6 px şerit durum rengi (§3.6) | — |
| Boyut | S dolgu 12 · **M 16** · L 24 | `--kk-s-3..5` |
| Durum | hover (etkileşimliyse): 2 px yükselme · seçili: turkuaz kenar + tik · kilitli: %60 soluk + `kilit` ikonu + neden metni · yükleniyor: iskelet (shimmer 1,2 sn) | — |

#### Modal

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Onay** | Başlık, 1–3 satır gövde, iki düğme (birincil sağda); dışarı tıklayınca kapanmaz | — |
| **Bilgi** | Tek düğme; dışarı tıklayınca ve `Esc` ile kapanır | — |
| **Ödül / Seviye atlama** | Ortada büyük sayı/rozet, `display` başlık; 1,5 sn rozet büyümesi | `--kk-ease-pop` |
| **Form** | Girdi + doğrulama; odak ilk alana | — |
| **Alt sayfa (mobil)** | Alttan 240 ms; sürükleme tutamağı; yükseklik ≤ %90 | `--kk-dur-3` |
| Boyut | S 360 · M 480 · L 720 (en büyük genişlik); mobilde tam genişlik | — |
| Davranış | Odak tuzağı, kapanışta odak tetikleyiciye döner, perde `night-950` %70, `role="dialog"` `aria-modal="true"`, arka plan `inert` | — |

#### Toast

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Bilgi / Başarı / Uyarı / Hata** | Sol şerit + ikon + tek cümle; renkler kobalt / nane / amber / mercan | anlamsal |
| **Ödül** | Amber, "+40 B", Bayt ikonu | `--kk-amber-500` |
| Konum | Masaüstü sağ üst (HUD altı, y = 72); mobil üst orta, HUD altı | — |
| Süre | 4 sn (hata 6 sn; eylemli toast kalıcı); hover/odakta durur; en çok 3 yığın | — |
| a11y | `role="status"` (hata `role="alert"`); kapat düğmesi 44 px | — |

#### ProgressRing

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Seviye** | Kobalt gradyan; ortada avatar/sayı | `--kk-kobalt-500` |
| **İlerleme** | Turkuaz; ders/kart ilerlemesi | `--kk-turkuaz-500` |
| **Puan (Kurul)** | 0–100 halka; ≥ 70 nane, < 70 amber, 85+ altın uç parlaması | anlamsal |
| **Süre** | Amber; belirsiz ise dönen yay | — |
| Boyut | 32 · 48 · 56 (HUD) · 96 (Kurul puanı) · 160 (sonuç) | — |
| Durum | belirsiz (dönen yay) · değer · dolu (nabız 400 ms); `role="progressbar"` | — |

#### XPBar

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| Boyut | HUD 208×10 · mobil 138×8 · odak çizgisi 4 px · panel genişliği 100 % × 14 | — |
| Dolgu | Kobalt-500→300 gradyan, uç 4 px parlak | `--kk-kobalt-500` |
| Durum | normal · artış (dolgu 700 ms ease-out + "+25 XP") · seviye atlama (400 ms %100, halka 1,5 sn, sıfırlanır kalanla) · kilitli (gri) | `--kk-dur-5` |
| a11y | `role="progressbar"` `aria-valuenow` `aria-valuemax` ve etiket "Seviye 3 ilerlemesi" | — |

#### Bayt / Çip sayacı

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Bayt pili** | `bayt` ikonu + sayı (`hud-num`) + "B"; amber | `--kk-amber-500` |
| **Çip pili** | `cip` ikonu + sayı + "Çip"; turkuaz | `--kk-turkuaz-500` |
| **XP etiketi** | Yıldız + "XP"; kobalt (HUD'da çubuğun parçası) | `--kk-kobalt-500` |
| Boyut | Masaüstü 108×30 · mobil 84×40 / 86×40 · satır içi 20 px | — |
| Durum | normal · sayıyor (kural §5.1) · artış etiketi (+N, 900 ms) · yükleniyor (—) · hata (!) · çevrimdışı (%55) | — |
| Biçim | `tr-TR` binlik nokta ("1.240 B"); Çip her zaman "Çip" yazılır | — |

#### TestListRow

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Açık test** | `A1`–`A6` · girdi `code-sm` · beklenen · gerçek · durum rozeti | `--kk-font-mono` |
| **Gizli / tohumlu test** | `G7 · gizli · geçti`, `T3 · tohumlu · geçti` (girdi/beklenen hiçbir zaman gösterilmez) | — |
| **Müfettiş özeti** | Kategori etiketi: "6 saat civarı kalanlar" | — |
| Durum | **bekliyor** (`test-bekliyor`, gri) · **çalışıyor** (dönen turkuaz) · **geçti** (nane + tik) · **kaldı** (mercan + çarpı) · **hata** (amber + üçgen; derleme/zaman aşımı) | anlamsal |
| Boyut | Masaüstü 40 px tek satır · mobil 56 px iki satır; seçili satır beklenen/gerçek farkını açar | — |
| a11y | `aria-label="Test A5: 361 dakika, beklenen 250 TL, gerçek 280 TL, kaldı"` | — |

#### ChatBubble

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Usta** | Portre 40 px + ad (turkuaz) + tik nesnesi; `night-700`, sol kuyruk; ≤ 40 kelime/parça | `--kk-night-700` |
| **Oyuncu** | Sağda, `kobalt-700` zemin + beyaz yazı (7,87:1) | `--kk-kobalt-700` |
| **Müşteri (Hasan Abi)** | Amber ad; `blockquote` varyantı (iş emri) kalın sol çizgi | — |
| **Kurul** | Balon değil **mühürlü kart**: lacivert zemin, altın mühür, kişiliksiz; hitap yok | `--kk-nisan` |
| **Sistem** | Ortalı, soluk, kutusuz | `--kk-muted` |
| **Dünya balonu** | Pixi BitmapText (`caption` 12), 6 sn, ≤ 12 eşzamanlı | — |
| Boyut | En büyük genişlik 480 (mobil 300); "yazıyor…" üç nokta 600 ms | — |

#### CodeBlock

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Satır içi** | `code` 14/22, `night-700` zemin, yarıçap 6 | — |
| **Blok** | `code-bg` zemin, satır numaraları `muted`, yatay kaydırma (satır sarma yok) | `--kk-code-bg` |
| **Vurgulu satır** | Sol 3 px turkuaz çubuk + %12 turkuaz dolgu + "Kurul'un seçtiği satır" etiketi | — |
| **Diff** | Ekleme: nane + `+`; silme: mercan + `−` (renk + işaret) | anlamsal |
| Boyut | 14/22 (mobil 13/20); en çok 24 satır görünür, sonra kaydırma | — |
| Not | Kopyala düğmesi yalnız kendi kodunda; Vitrin'de yok; `role="region"` + `aria-label="C# kodu, N satır"` | — |

#### Tab

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Üst sekme** | Alt çizgi 3 px turkuaz; panel başlıkları | — |
| **Hap** | Yuvarlak seçili zemin; kategori filtresi | `--kk-r-pill` |
| **Alt sekme (mobil)** | Panel içi sekme çubuğu 44 px (dock değildir) | — |
| Durum | seçili · hover · odak · devre dışı · rozetli (nokta/sayı) | — |
| a11y | `tablist` / `tab` / `tabpanel`; ok tuşları, `Home`/`End`; roving tabindex | — |

#### Badge

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Durum** | §3.6 beş durum: şekil + etiket | anlamsal |
| **Nadirlik** | Sıradan / Şık / Nadir / Premium / Nişan (§10.3) | rozet token'ları |
| **Unvan** | 16×16 rozet + metin (B1 §7.4) | — |
| **Sayaç** | 18 px mercan daire (sayı) / 10 px nokta | `--kk-mercan-500` |
| **Etiket / tip** | Nötr: "Kavram Sorusu", "Tamamlama", "v1.1" | — |
| Boyut | S 20 · M 24 · L 32 yükseklik; metin her zaman var | — |

#### EmptyState

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| Yapı | 96 px illüstrasyon (Usta portresi ya da ikon) + başlık (`h2`) + tek cümle + en çok bir birincil düğme | — |
| Varyant | boş · hata · çevrimdışı · kilitli · bakım | — |
| Boyut | Kart içi (panel) · tam sayfa | — |
| Ton | Suçlama yok, bir sonraki adım var: "Henüz işletmen yok. İlk tapun Çarşı'da seni bekliyor." | — |

#### VaultGauge (Kasa göstergesi)

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| **Sahne nesnesi** | 120×96; 4 kademe: boş (gri çerçeve) · çeyrek (`amber-300`) · yarım (`amber-500`) · dolu (+ zıplayan `bayt`) | B1 §6.3 |
| **Kart** | Yatay çubuk + "61 / 73 B" + "Dolmasına 1 sa 18 dk" + [Kasayı Topla] | `--kk-amber-500` |
| **Mini** | HUD dock yuvasında amber nokta (dolu) | — |
| Durum | Açık (normal) · Deneme ("%50 hız" etiketi) · Kararmış (gri, "üretim durdu") · çevrimdışı (soluk) | §3.6 |
| a11y | `role="meter"` `aria-valuenow="61"` `aria-valuemax="73"` etiket "Kasa" | — |

#### AvatarPreview

| Varyant / durum / boyut | Tanım | Token'lar |
|---|---|---|
| Boyut | S 48 (büst, HUD/sohbet) · M 96 (tam boy) · L 288 (Dolap) · XL 480 (Avatar Atölyesi) | — |
| Yön | 4 yön (SE/SW/NE/NW), ◀ ▶ ile döner | — |
| Durum | bekleme · yürü · otur · emote · yükleniyor (siluet) · hata (genel avatar) | — |
| Kaynak | `AvatarRenderer`: sahnedekiyle aynı atlas; S/M boyutlar önceden pişirilmiş küçük resim (LRU 64) | — |
| a11y | `role="img"` + güncel tarif | — |

**Ek bileşenler (kısa sözleşme):**

| Bileşen | Sözleşme |
|---|---|
| `Input`, `Textarea` | 48 px, 10 px yarıçap, 2 px `control-border`, odakta turkuaz; hata kırmızı çerçeve + `role="alert"` mesaj; karakter sayacı `aria-live="polite"` |
| `Checkbox`, `Toggle`, `Slider`, `Select` | Hedef ≥ 44; `role="switch"` (Toggle); Slider ok tuşlarıyla; değer metinle görünür |
| `RadioCard` | Seçenek kartı (Günlük Tekrar, Dil Seçimi); `radiogroup` |
| `Chip` | Kategori/filtre/hazır cümle (güvenli mod); 36 px görsel, 44 px dokunma alanı |
| `ProductCard`, `RarityBadge` | §6.19 anatomisi; rozet renk + şekil + metin |
| `RankBadge`, `NisanBadge` | Unvan (B1 §7.4) ve Nişan (altın çerçeve + 3 sn süzme) |
| `QuestionChip`, `ContractCard` | İş Emri (§6.11) |
| `KurulCard`, `RubricBar` | Kurul sonucu ve cevap öncesi rubrik (§6.8) |
| `ErrorPanel`, `HintLadder`, `ParsonsBoard` | Atölye (§6.9) |
| `Chart` | Çizgi/sütun, tek seri; tablo alternatifi; `tr-TR` eksenler |
| `Countdown` | Pazar/Lig/Meydan Sorusu; `role="timer"`, `aria-live="off"` |
| `EmoteWheel` | 8 yuva, `1`–`8`; dokunmada uzun basış ya da düğme |
| `LedBoard`, `MapView`, `MetroMap`, `RoomView` | Pixi/SVG sahne bileşenleri; DOM eşdeğeri zorunlu (§12.3) |
| `InventoryDrawer`, `GuestbookList`, `AvatarNameplate`, `Stat` | Oda, ziyaretçi defteri, isim etiketi, istatistik satırı (`<dl>`) |

---

## 10. Avatar sistemi

Avatar, B1 §7'nin paper-doll sistemidir: cinsiyetsiz nötr iskelet, **3 vücut tipi** (ince, orta, geniş; tek boy 96 px), **8 ten**, yüz (3 şekil × 6 göz × 4 kaş × 5 ağız = 360 kombinasyon), saç (16 model × 12 renk), kıyafet slotları ve evcil hayvan; 4 yön (SE ve NE çizilir, diğerleri aynalanır). Bu bölüm B1'in sayılarını istemci tarafı gerçeklemeye (katman, veri şeması, boyama) çevirir.

### 10.1 Katmanlar

Alttan üste çizim sırası (B1 §7.1):

| Z | Katman kimliği | Slot | Seçenek (MVP) | Renk bölgesi | Not |
|---|---|---|---|---|---|
| 0 | `golge` | — | 1 | — | Elips, %28 siyah; düşük cihaz modunda 2 px nokta |
| 1 | `sirt_arka` | Sırt (arka parça) | 4 | 2 | Çanta/kanat arka parçası |
| 2 | `vucut` | Vücut + ten | 3 tip × 8 ten | ten | Ten `tint` ile |
| 3 | `alt` | Alt giyim | 6 | 2 | Kot, eşofman, etek, şort, kargo… |
| 4 | `ayak` | Ayakkabı | 5 | 2 | Spor, bot, sandalet, çizme |
| 5 | `ust` | Üst giyim | 10 | 2 | Tişört, hırka, yağmurluk, önlük, blazer, kapüşonlu |
| 6 | `yuz` | Yüz: şekil, göz, kaş, ağız | 3 × 6 × 4 × 5 | göz rengi | Dört alt katman, ifade emote ile değişir |
| 7 | `sac_arka` | Saç arka | 16 model | saç rengi (12) | |
| 8 | `sac_on` | Saç ön | 16 model | saç rengi | `sacGizle: true` şapkada gizlenir |
| 9 | `bas` | Şapka/baş | 8 | 2 | Çırak Şapkası, bere, kasket, baret, kaptan şapkası, Otopark Ustası Şapkası (Nişan) |
| 10 | `aksesuar` | Aksesuar | 5 | 1 | Gözlük, kolye, kulaklık, rozet iğnesi, saat; yüz katmanının üstünde |
| 11 | `sirt_on` | Sırt (ön parça) | 4 | 2 | Çanta askısı, kanat ucu |
| 12 | `el` | Emote nesnesi | — | — | Emote'a göre (tebeşir, balon…) |
| — | `evcil` | Evcil hayvan | 2 (MVP) | — | Ayrı sprite; 1 tile geriden takip eder, kendi gölgesi var; Odada uyur |

**Boyama.** Renk bölgeleri atlasta ayrı **maske kareleri** olarak durur (her giyim parçası: sabit ayrıntı karesi + R1 maskesi + R2 maskesi). Maske kareleri `sprite.tint` ile boyanır; filtre kullanılmaz, böylece batch bozulmaz. Tek avatar ≈ 12–20 sprite, 40 avatar ≈ 800 sprite'tır ve atlas başına tek draw call'dır. **Pişirme.** LOD 25–40 aralığındaki ve uzaktaki avatarlar bekleme karesinde tek sprite'a pişirilir (`RenderTexture`, LRU 64); HUD ve Dolap küçük resimleri de pişirilmiş önbellekten gelir.

```ts
export interface AvatarSpec {
  v: 1;
  vucut: 'ince' | 'orta' | 'genis';  ten: 1|2|3|4|5|6|7|8;
  yuz: { sekil: 1|2|3; goz: 1|2|3|4|5|6; kas: 1|2|3|4; agiz: 1|2|3|4|5 };
  sac: { model: number /* 1..16 */; renk: number /* 1..12 */ };
  giyim: { bas?: string; ust: string; alt: string; ayak: string; aksesuar?: string; sirt?: string;
           renkler?: Record<string, [string, string]> };   // slot -> [R1, R2] hex
  evcil?: string;
}
```

Ten rengi (1–8): `#FBE0C8`, `#F3C9A4`, `#E5B087`, `#CC8F65`, `#A8714A`, `#8A5836`, `#6A4128`, `#4A2D1C`. Saç rengi (1–12): siyah `#1C1A1F`, koyu kahve `#3B2A20`, kestane `#5C3A24`, bakır `#A5532B`, sarı `#D8B45A`, platin `#E6DCC3`, kızıl `#B8372B`, mavi `#3E6FD1`, mor `#7B4FD6`, pembe `#D9609B`, yeşil `#3FA46A`, gri `#9AA3AD`.

SVG şablonu (Ekranlar sayfasındaki katmanlı örnekler için; 64×96 kutu, tüm renkler `AvatarSpec`'ten):

```svg
<svg viewBox="0 0 64 96" width="64" height="96">
  <ellipse id="golge" cx="32" cy="92" rx="18" ry="5" fill="#000" opacity=".28"/>
  <g id="sirt_arka"/>
  <g id="vucut"><rect x="22" y="34" width="20" height="30" rx="8" fill="TEN"/><circle cx="32" cy="22" r="14" fill="TEN"/></g>
  <g id="alt"><rect x="23" y="58" width="18" height="20" rx="4" fill="ALT"/></g>
  <g id="ayak"><rect x="22" y="78" width="9" height="8" rx="3" fill="AYAK"/><rect x="33" y="78" width="9" height="8" rx="3" fill="AYAK"/></g>
  <g id="ust"><path d="M20 38 q12 -9 24 0 v22 h-24 z" fill="UST"/></g>
  <g id="yuz"><circle cx="27" cy="22" r="2.8" fill="#FFF"/><circle cx="37" cy="22" r="2.8" fill="#FFF"/><circle cx="27" cy="22" r="1.5" fill="#18213A"/><circle cx="37" cy="22" r="1.5" fill="#18213A"/><path d="M28 29 q4 3 8 0" stroke="#18213A" fill="none" stroke-width="1.6" stroke-linecap="round"/></g>
  <g id="sac_arka"/><g id="sac_on"><path d="M18 20 q14 -18 28 0 v4 h-28 z" fill="SAC"/></g>
  <g id="bas"/><g id="aksesuar"/><g id="sirt_on"/><g id="el"/>
</svg>
```

### 10.2 Altı örnek avatar

Seçenek kimlikleri `kategori.slug` biçimindedir; fiyat ve nadirlik B2 §9'dandır. Renk bölgeleri `[R1, R2]`.

| # | Avatar | Vücut · ten | Yüz (şekil/göz/kaş/ağız) | Saç (model · renk) | Baş | Üst | Alt | Ayak | Aksesuar · Sırt · Evcil |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **@zeynep_cs** (örnek oyuncu, Çırak) | orta · 4 `#CC8F65` | 2 / 3 / 2 / 1 | 07 omuz dalgalı · 3 kestane | `bas.cirak-sapkasi` (Sıradan, 30 B) `[#C98500, #F4EFE6]` | `ust.kapusonlu-hirka` (Şık, 220 B) `[#1F2A44, #FFA33A]` | `alt.kot` (Sıradan) `[#3F6FB5, #26325A]` | `ayak.spor` `[#E8EDF8, #22C9CE]` | — · `sirt.okul-cantasi` · — |
| 2 | **@mert.k** (Kalfa) | geniş · 2 `#F3C9A4` | 1 / 5 / 1 / 3 | 03 kısa · 2 koyu kahve | `bas.kasket` (Sıradan) `[#C8453A, #F4EFE6]` | `ust.tisort` (Sıradan) `[#C8453A, #F4EFE6]` | `alt.kargo` `[#6B4F3A, #3B3B3F]` | `ayak.bot` `[#3B2A20, #8A5A3C]` | `aksesuar.kulaklik` · — · `evcil.kod-kedisi` (Şık, 300 B) |
| 3 | **@ela_c** (Çırak) | ince · 6 `#8A5836` | 3 / 2 / 4 / 5 | 12 topuz · 4 bakır | — | `ust.yagmurluk` (Sıradan) `[#FFBE3D, #E6A800]` | `alt.etek` `[#1F2A44, #36446E]` | `ayak.cizme` `[#18213A, #5C6670]` | `aksesuar.gozluk` · — · — |
| 4 | **@kaan** (Çırak, Premium set) | orta · 7 `#6A4128` | 2 / 1 / 3 / 2 | 15 tarak · 9 mor | `bas.neon-cirak` (Premium, set 100 Çip) `[#22C9CE, #10353E]` | `ust.neon-cirak` `[#22C9CE, #10353E]` | `alt.neon-cirak` `[#10353E, #22C9CE]` | `ayak.neon-cirak` `[#22C9CE, #10353E]` | `aksesuar.neon-kolye` · — · — |
| 5 | **@ayse_kod** (Kalfa, Nişan sahibi) | orta · 3 `#E5B087` | 1 / 4 / 2 / 4 | 09 uzun düz · 1 siyah | `bas.otopark-ustasi-sapkasi` (**Nişan**, altın çerçeve + animasyon, `sacGizle`) | `ust.onluk` (Sıradan) `[#9C4A3C, #F4EFE6]` | `alt.kot` `[#3F6FB5, #26325A]` | `ayak.spor` `[#E8EDF8, #FFA33A]` | `aksesuar.saat` · — · `evcil.liman-martisi` (Nadir) |
| 6 | **@berk_34** (Kalfa, Nadir seti) | geniş · 5 `#A8714A` | 3 / 6 / 3 / 1 | 05 dik kısa · 8 mavi | `bas.kaptan-sapkasi` (Nadir, 520 B) `[#1F2A44, #E5B84B]` | `ust.sari-yagmurluk` (Nadir, 610 B) `[#FFBE3D, #E6A800]` | `alt.kot` `[#26325A, #3F6FB5]` | `ayak.bot` `[#18213A, #8A5A3C]` | `aksesuar.rozet-igne` · `sirt.alet-cantasi` · — |

### 10.3 Nadirlik rozetleri

Rozet **renk + şekil + metin** üçlüsüdür (renk körlüğünde şekil ve metin yeter). Beş kademe KANON §8'dir.

| Kademe | Para | Renk (kenar / zemin / yazı) | Şekil | Animasyon | Raf |
|---|---|---|---|---|---|
| **Sıradan** | Bayt (30–120) | `#8A97B8` / `#26325A` / `#C5CEE4` (7,90:1) | Yuvarlak köşeli kare | Yok | Bayt Rafı, kalıcı |
| **Şık** | Bayt (150–400) | `#7D9BFF` / `#1C2A5A` / `#A9BCFF` (7,41:1) | Elmas (baklava) | Yok | Bayt Rafı, kalıcı + mevsimlik |
| **Nadir** | Bayt (300–800; rotasyon) | `#9B86FF` / `#2A2452` / `#BDB0FF` (7,35:1) | Altıgen + seri no. | Yok | Haftalık rotasyon, 6 slot |
| **Premium** | Çip (set 100) | `#22C9CE` / `#10353E` / `#5FE0E3` (8,28:1) | Mikroçip kalkanı | **Yok** (statik; B2 §9.1) | Butik |
| **Nişan** | Yalnızca kazanılır | `#E5B84B` / `#3B2F12` / `#FFD27A` (9,21:1) | Yıldızlı madalyon | Altın çerçeve + 3 sn süzme | Rütbe Rafı, Dolap, Rozet Duvarı |

### 10.4 Unvan rozetleri ve isim renkleri

| Unvan (KANON §3.1) | Seviye | Rozet nesnesi (B1 §7.4) | Rozet rengi (B1) | İsim rengi (B2 §3.1) |
|---|---|---|---|---|
| Çırak | 1–5 | Tebeşir parçası | Bronz `#B07A3C` | Gri `#9AA7C7` |
| Kalfa | 6–11 | Anahtar | Gümüş `#B8C0C8` | Mavi `#7D9BFF` |
| Zanaatkâr | 12–17 | Pergel | Bakır `#C8722F` | Yeşil `#45D98D` |
| Mühendis | 18–24 | Dişli | Çelik mavisi `#5B7FA6` | Turuncu `#FFA33A` |
| Baş Mühendis | 25–31 | Çift dişli, altın kenar | Lacivert + altın | Kırmızı `#FF7A66` |
| Mimar | 32–39 | Gönye ve plan rulosu | Mor `#7E57C2` | Mor `#9B86FF` |
| Şehir Mimarı | 40–59 | Şehir silüeti tacı | Altın `#E5B84B` | Altın `#E5B84B` |
| Efsane | 60 + 10 Mentor kilometre taşı | Altın hale, dönen yıldız | Animasyonlu altın | Animasyonlu altın |

İsim etiketi: `[16×16 rozet] @ad`, avatarın 8 px üstünde; arkadaşlar mavi, lonca üyeleri (v1.1) yeşil; Çip isim rengi yalnızca kendi adının rengini değiştirir. İsim renkleri `night-800` üzerinde ≥ 5,75:1'dir (mor) ve en düşük 4,5:1 sınırını aşar.

### 10.5 Emote listesi (B1 §7.3 ile aynı, 18)

Çark 8 yuvalıdır (`1`–`8`); varsayılan yuvalar #1–#8 (başlangıç). Dolap'ta yuvalar değiştirilir.

| # | Emote | Kaynak | Animasyon | Not |
|---|---|---|---|---|
| 1 | El Salla | Başlangıç | 6 kare | — |
| 2 | Alkışla | Başlangıç | 6 kare, döngü 3 sn | Alkış butonundan ayrı sosyal jest |
| 3 | Gül | Başlangıç | 8 kare | — |
| 4 | Düşün | Başlangıç | 4 kare, çene | Soru balonu çıkar |
| 5 | Dans: Döngü | Başlangıç | 12 kare döngü | `for` esprisi: ayaklar 3'lü sayar |
| 6 | Otur | Başlangıç | 1 kare | Zemine veya oturulabilir eşyaya |
| 7 | Evet | Başlangıç | 4 kare | Baş sallama |
| 8 | Hayır | Başlangıç | 4 kare | — |
| 9 | Omuz Silk | Pazar 60 B (Sıradan) | 4 kare | — |
| 10 | Kalp | Pazar 120 B (Şık) | 6 kare + parçacık | — |
| 11 | Şapka Çıkar | Pazar 150 B (Şık) | 6 kare | Baş slotu doluysa |
| 12 | Tuşlama | Pazar 100 B (Sıradan) | 4 kare döngü | Havada klavye; "kod yazıyorum" |
| 13 | Derleyici Dansı | Nişan: ilk Açılış | 16 kare | Yeşil tik parçacıkları |
| 14 | Konfeti | Nişan: ilk Semt Sınavı | 8 kare + parçacık | — |
| 15 | Mühür Vur | Nişan: 10 altın durak | 6 kare | Altın mühür damgası |
| 16 | Usta Selamı | Nişan: Mentor rozeti (v1.2) | 6 kare | Tebeşir havaya |
| 17 | Robot Dansı | Butik (Çip, Premium paket) | 16 kare | Altın çerçevesiz (Nişan'dan ayrılsın) |
| 18 | Esne/Uyu | Otomatik (3 dk hareketsiz) | 6 kare döngü | AFK göstergesi; "zzz" balonu |

Kural: emote animasyonu sunucuya `Emote(id)` olarak gider; yalnızca sahip olunan emote oynatılır; reduced-motion'da emote tek kareye ve balona indirgenir (örn. "Alkışla" → el çırpma ikonu balonu). Emote fiyatları B1 listesinde B2 bantlarından (Sıradan 60 B, Şık 120 B) sapar (#11, #12); B2 fiyat sahibidir (Açık Soru 6).

---

## 11. Animasyon ve ses

### 11.1 Animasyon ilkeleri ve tablosu

Yedi ilke: (1) **Hareket neden–sonuç anlatır** (süs için hareket yok). (2) HUD ve panellerde yalnızca `transform` ve `opacity` anime edilir. (3) Süre sınıfları: geri bildirim ≤ 160 ms, geçiş 240–400 ms, tören ≥ 800 ms ve yalnızca ödül/Açılış/seviye anlarında. (4) Giriş `ease-out`, kısa çıkış `ease-in`; `ease-pop` (hafif aşma) yalnızca ödül ve seçim onayında. (5) Her animasyon yeni bir olayla **kesilebilir**. (6) Saniyede 3'ten fazla flaş yok (WCAG 2.3.1). (7) `prefers-reduced-motion` ve Ayarlar'daki "Hareketi azalt" (Sistem / Açık / Kapalı) tek bir `useMotion()` kancasından geçer.

Token'lar: `--kk-dur-1` 100 ms, `-2` 160 ms, `-3` 240 ms, `-4` 400 ms, `-5` 800 ms; `--kk-ease-out` `cubic-bezier(.22,1,.36,1)`, `--kk-ease-pop` `cubic-bezier(.34,1.56,.64,1)`, `--kk-ease-inout` `cubic-bezier(.65,0,.35,1)`.

| # | Animasyon | Tetikleyici | Süre | Easing | Özellik | Hareketi azalt |
|---|---|---|---|---|---|---|
| 1 | Düğme basılı | `pointerdown` | 100 ms | ease-out | alt kenar 4→1 px, 3 px aşağı | yalnız kenar rengi |
| 2 | Düğme hover | `pointerenter` | 160 ms | ease-out | 2 px yükselme, parlaklık | yalnız parlaklık |
| 3 | Odak halkası | `focus-visible` | 100 ms | ease-out | halka | aynı |
| 4 | Panel açılışı (masaüstü) | ekran geçişi | 240 ms | ease-out | opacity, scale .98→1 | opacity 120 ms |
| 5 | Alt sayfa (mobil) | sheet | 240 ms | ease-out | translateY %100→0 | opacity 120 ms |
| 6 | Modal | açılış | 200 ms | ease-out | opacity, scale .96→1; perde 160 ms | opacity |
| 7 | Kart kayması (Derslik) | İleri/Geri | 240 ms | ease-inout | translateX ±24 px, opacity | opacity 120 ms |
| 8 | Toast giriş / çıkış | olay | 240 / 160 ms | ease-out / ease-in | translateY −8 px, opacity | opacity |
| 9 | Sayaç sayma | ödül/harcama | 500–1.600 ms (§5) | ease-out-cubic | sayı | anında yaz + 600 ms renk parlaması |
| 10 | "+N" süzülmesi | ödül | 900 ms | ease-out | translateY −24 px, opacity | yok (ekran okuyucu anonsu kalır) |
| 11 | XP çubuğu dolması | XP | 700 ms | ease-out | scaleX | anında |
| 12 | Seviye halkası büyümesi | seviye atlama | 1.500 ms | ease-pop | scale 1→1,25→1 | yalnız parlama |
| 13 | Seviye atlama modali | seviye atlama | 400 ms giriş | ease-pop | scale, opacity; tek konfeti | statik kart |
| 14 | Test satırları | Çalıştır | 160 ms/satır, 120 ms aralık | ease-out | opacity, tik pop | hepsi birden |
| 15 | Tik pop | doğru seçim / test geçti | 160 ms | ease-pop | scale 0→1 | anında |
| 16 | Kurul mührü (değerlendirme) | gönder | 1.200 ms döngü | linear | rotate + üç nokta | statik mühür + "…" |
| 17 | Mühür damgası (sonuç) | Kurul sonucu | 350 ms | ease-pop | scale 1,4→1, gölge | anında |
| 18 | Puan halkası dolması | sonuç | 900 ms | ease-out | stroke-dashoffset | anında |
| 19 | Ölçüt çubukları | sonuç | 500 ms, 100 ms aralık | ease-out | scaleX | anında |
| 20 | Açılış sinematiği | Savunma ≥ 70 | ≈ 6.000 ms | zamanlı | bariyer, park çizgileri, konfeti | tek kare kart (1,5 sn) |
| 21 | Konfeti | Açılış / Semt / seviye | 2.000 ms | fizik | parçacık | kapalı (tek kare sprite) |
| 22 | Tapu dönüşümü | tapu | 2.000 ms | ease-inout | çim → toprak, bant | 200 ms çapraz solma |
| 23 | Yürüme | tıkla-yürü | `max(600 ms, uzunluk/4)` | ease-inout (kısa) / doğrusal | konum, 12 fps kare | aynı (işlevsel hareket) |
| 24 | Kamera odağı | `camera.focus` | 800 ms | ease-inout | pan | anında |
| 25 | Sahne geçişi | kapı/plaka | 1.000 ms | ease-inout | renk çapraz solma | 200 ms |
| 26 | Tramvay vinyeti | tramvay | 1.500 ms | ease-inout | paralaks | 300 ms solma |
| 27 | Emote | emote | 6–16 kare, 12 fps | — | sprite | tek kare + balon |
| 28 | LED pano kayması | akış | 60 ms/karakter, mesaj ≤ 8 sn | doğrusal | scrollX | sayfalama (5 sn) |
| 29 | Kasa Bayt zıplaması | kasa dolu | 800 ms aralık | ease-pop | translateY −6 px | statik |
| 30 | Hedef elmasının nabzı | zemine tıkla | 1.000 ms | ease-out | scale, opacity | tek kare |
| 31 | Iskelet shimmer | yükleniyor | 1.200 ms döngü | doğrusal | gradyan | statik gri |
| 32 | Hata titreşimi (Giriş) | doğrulama hatası | 2 × 4 px, 200 ms | ease-inout | translateX | kırmızı çerçeve |
| 33 | Nişan ışık süzmesi | boşta | 3 sn aralık | ease-inout | gradyan | statik altın |
| 34 | Metro durak altın halkası | durak altın | 800 ms | ease-out | yayılan halka | statik halka |
| 35 | Metro durak yeşile düşüş | unutma | 600 ms | ease-inout | renk | aynı |

**Hareketi azalt kuralları (toplu):** parçacık sistemi kapalı; konfeti/havai fişek tek kare; LED pano sayfalama; paralaks ve kamera tween'i kapalı; sayaç ve XP anında; yürüme ve sprite kareleri **kalır** (işlevsel/geri bildirim hareketi), ama "sekme" ve "nefes alma" gibi süs döngüleri durur; otomatik oynayan 5 sn'den uzun her hareket duraklatılabilir (WCAG 2.2.2).

### 11.2 Ses tasarımı özeti

**Varsayılan KAPALI.** Ses ilk girişte kapalıdır (otomatik oynatma kısıtları, ortak mekânlarda kullanım, 15+ kitle). Açma yolları: Ayarlar > Ses ve Görüntü, HUD Menü > Ses, Ders 1.1'den sonra tek seferlik "Şehrin sesini açmak ister misin?" toast'u (B8 önerisi). Müzik yalnız ses açıkken indirilir (veri tasarrufu). **Hiçbir bilgi yalnızca sesle verilmez**; her ses bir görsel eşdeğerle birlikte gelir. Sekme gizlenince tüm kanallar susar. Efekt sırasında müzik 300 ms içinde −6 dB'e iner (ducking); eşzamanlı efekt ≤ 4.

Kanallar ve varsayılan seviyeler (ses açılınca): ana %80 · müzik %50 · efekt %80 · ortam %50. Efektler tek ses sprite'ı (OGG + AAC, ≈ 80 KB); müzik semt başına 90 sn'lik döngü akışı (128 kbps); ortam sesleri B1 semt tablolarındadır.

| Olay | Ses adı | Karakter | Süre | Kanal |
|---|---|---|---|---|
| Her dokunuş/tıklama | `ui_tap` | Yumuşak "tık" | 40 ms | efekt |
| Onay (Gönder, Al, Dersi Başlat) | `ui_confirm` | İki notalık yükselen | 120 ms | efekt |
| Hata / reddedilen eylem | `ui_error` | Alçak "bzz" | 140 ms | efekt |
| Yanlış seçim (cezasız) | `ui_soft_miss` | Yumuşak "dıt" | 100 ms | efekt |
| Bayt kazanma | `coin_pickup` | Çan arpej, tonu birikime göre yükselir | 300 ms | efekt |
| Bayt harcama | `coin_spend` | Kasa "çın" (azalan) | 220 ms | efekt |
| XP sayma | `xp_tick` | Yükselen perde dizisi | sayma süresi | efekt |
| Seviye atlama | `level_up` | Kısa fanfar | 1,2 sn | efekt |
| Test geçti | `test_pass` | Yeşil "ding" | 160 ms | efekt |
| Test kaldı | `test_fail` | Yumuşak "tomp" | 160 ms | efekt |
| Kurul mührü / Mühür Duvarı | `seal_stamp` | Balmumu damga | 350 ms | efekt |
| Metro durak altın | `gold_chime` | Üç notalık parlak | 600 ms | efekt |
| Bariyer kalkar (Açılış) | `barrier_open` | Metal "tak" + motor | 800 ms | efekt |
| Konfeti / kutlama | `confetti` | Patlama + çınlama | 1,2 sn | efekt |
| Kapı / sahne geçişi | `door` | Kapı + hafif rüzgâr | 500 ms | efekt |
| Adım | `step` | Hafif tıkırtı (varsayılan kapalı) | 80 ms | ortam |
| Tramvay zili | `tram_bell` | Zil | 700 ms | ortam |
| Meydan Sorusu | `fountain_chime` | Çan, 3 nota | 1,5 sn | efekt |
| Sohbet balonu | `chat_pop` | "pop" | 60 ms | efekt |
| Bildirim | `notification` | Kısa zil | 300 ms | efekt |
| Alkış | `applause` | El çırpma | 600 ms | efekt |
| LED pano tıkı | `led_tick` | Mekanik "tık" | 30 ms | ortam |
| Eşya yerleştirme | `place` | "tok" | 120 ms | efekt |
| Pazar kamyonu | `truck` | Motor + korna | 1,5 sn | ortam |
| Havai fişek (lig kapanışı) | `fireworks` | Patlama dizisi | 20 sn | ortam |

Müzik temaları B1 §3'tedir (Meydan 100 BPM, Çarşı 108, Liman 96, Atölyeler 92, Kampüs 104, Finans 120, Veri Vadisi 88, Bulut Tepesi 76, Bloklar 84; her biri gündüz/gece sürümlü). Mobilde sessiz mod anahtarı (iOS) efektleri etkilemez, ancak oyun ses kapalıyken Web Audio bağlamı hiç başlatılmaz (pil).

---

## 12. Erişilebilirlik

### 12.1 WCAG 2.2 AA kontrol listesi

Hedef: **WCAG 2.2 AA**; her sürümde `axe-core` (Playwright) otomatik testi + elle klavye/ekran okuyucu turu (NVDA + Chrome, VoiceOver + Safari iOS, TalkBack + Chrome).

| Kriter | Gereksinim | KodKent uygulaması |
|---|---|---|
| 1.1.1 Metin dışı içerik | Anlamlı görsellerin metni | `role="img"` + etiket (avatar, harita, grafik); süs görseller `aria-hidden` |
| 1.3.1 Bilgi ve ilişkiler | Yapı programatik | Başlık hiyerarşisi, `<nav>`, `<ol>` (Sözleşme, PRIMM), `<dl>` (istatistik) |
| 1.3.4 Yönlendirme | Dikey/yatay kilitlenmez | Manifest `orientation: any`; yatay düzen tanımlı |
| 1.3.5 Girdi amacı | `autocomplete` | `tel-national`, `one-time-code` |
| 1.4.1 Renk kullanımı | Renk tek başına anlam taşımaz | Şekil + metin (§3.6, §10.3, §12.5) |
| 1.4.3 Kontrast (asgari) | 4,5:1 / büyük 3:1 | §12.6 tablosu; en düşük metin kontrastı 4,5'in üstünde |
| 1.4.4 Metin yeniden boyutlandırma | %200 | Ayarlar'da %100/125/150; tarayıcı yakınlaştırması %200'e bozulmaz |
| 1.4.10 Yeniden akış | 320 px'te yatay kaydırmasız | Panel ekranları tek sütuna düşer; kod blokları kendi içinde kayar |
| 1.4.11 Metin dışı kontrast | UI ve grafik 3:1 | `control-border` `#8A97B8` (5,71:1); odak halkası 9,06:1 |
| 1.4.12 Metin aralığı | Satır/harf aralığı ayarlanabilir | `rem` birimleri; sabit yükseklikli metin kutusu yok |
| 1.4.13 Hover/odak içeriği | Kapatılabilir, üzerine gelinebilir, kalıcı | Araç ipuçları `Esc` ile kapanır, hover'da kalır |
| 2.1.1 Klavye | Tüm işlev klavyeyle | Sahne için Erişilebilir Dünya Katmanı (§12.3); Pazar/Oda/Kurul tam klavye |
| 2.1.2 Klavye tuzağı yok | Odak çıkabilir | Monaco `Ctrl+M`; modal `Esc`; sahne tuzak değil |
| 2.1.4 Tek karakterli kısayollar | Kapatılabilir/yeniden atanabilir | Ayarlar > Erişilebilirlik > "Tek tuşlu kısayolları kapat"; girdi odaktayken zaten kapalı |
| 2.2.1 Zamanlama ayarlanabilir | Süre sınırı ayarlanabilir | Dersler, Savunma, Günlük Tekrar'da süre sınırı yok; yalnız OTP (güvenlik, yeniden iste) |
| 2.2.2 Duraklat, durdur, gizle | Otomatik hareket kontrolü | LED pano "Duraklat"; animasyonlar Hareketi azalt |
| 2.3.1 Üç flaş | ≤ 3 flaş/sn | Konfeti/sinematik tasarımı sınırlı; testle doğrulanır |
| 2.4.1 Blokları atla | Atlama mekanizması | "Ana içeriğe geç" bağlantısı; `F6` bölge gezintisi |
| 2.4.2 Sayfa başlığı | Açıklayıcı | `document.title = "Pazar — KodKent"` her ekranda |
| 2.4.3 Odak sırası | Mantıksal | HUD → panel → sahne listesi; modalda tuzak |
| 2.4.6 Başlıklar ve etiketler | Açıklayıcı | Eylem etiketleri fiil: "Kasayı Topla", "Cevabı Gönder" |
| 2.4.7 Odak görünür | Her zaman | 3 px turkuaz halka |
| **2.4.11 Odak örtülmez (asgari)** | Sabit HUD odaklı öğeyi örtmez | `scroll-padding-top: 72px`, `scroll-padding-bottom: 88px`; HUD dock odaklıyken içerik kayar |
| 2.5.1 İşaretçi hareketleri | Çoklu dokunuş/yol alternatifi | Pinch → ± düğmeleri; kaydırma → ok düğmeleri |
| 2.5.2 İşaretçi iptali | Yukarı olayında etkinleşir | Eylem `pointerup`'ta; basılı tutarak kaydırma iptal eder |
| 2.5.3 Etikette ad | Görünen etiket adın parçası | `aria-label` görünür metinle başlar |
| **2.5.7 Sürükleme hareketleri** | Tek işaretçi alternatifi | Parsons ↑↓; Oda dokun-yerleştir/ok tuşları; emote yuvası seç |
| **2.5.8 Hedef boyutu (asgari)** | ≥ 24×24 | Hedef ≥ 44×44, aralık ≥ 8 |
| 3.1.1 Dil | `lang="tr"` | `<html lang="tr">` |
| 3.2.1–3.2.2 Odak/girdi bağlam değiştirmez | — | Seçim anında sayfa değişmez; ödeme yönlendirmesi uyarılı |
| **3.2.6 Tutarlı yardım** | Yardım yeri sabit | Usta/ipucu her ekranda aynı yerde (sağ ya da alt şerit); HUD sağ küme sabit |
| 3.3.1–3.3.3 Hata tanımlama/öneri | Metinle, öneriyle | "Kod yanlış. Bu saat içinde 3 hakkın kaldı." |
| 3.3.4 Hata önleme (finansal) | Onay | Her satın alma / tapu / hesap silme onay modali |
| **3.3.7 Gereksiz tekrar yok** | Aynı bilgi tekrar istenmez | Telefon/yaş bir kez; taslaklar saklanır |
| **3.3.8 Erişilebilir kimlik doğrulama** | Bilişsel test yok | OTP yapıştırılır, otomatik doldurulur; captcha yok (bot koruması sunucuda, B7) |
| 4.1.2 Ad, rol, değer | Programatik | Özel bileşenlerde ARIA; `tab`, `switch`, `meter`, `progressbar` |
| 4.1.3 Durum mesajları | Odak almadan anons | `aria-live="polite"` bölgesi (ödül, test özeti); hata `alert` |

### 12.2 Klavye yolları

| Akış | Yol |
|---|---|
| Giriş | `Tab` telefon → onay kutusu → Kod Gönder; OTP'de rakam yazmak yeter, `Enter` doğrular |
| Meydan | `F6` → HUD; `Tab` → sahne listesi (yakındaki etkileşimler); `Enter` yürü + etkileşim; ok tuşları yürü; `E` en yakın etkileşim |
| Derslik | `←` `→` kartlar; `Ctrl+Enter` çalıştır; mini editörde `Tab` odak çıkışı `Ctrl+M` sonrası |
| Kurul Kartı | `Tab`: rubrik (okunur) → cevap kutusu → Gönder; `Ctrl+Enter` gönder; sonuçta `Tab`: ölçütler → Usta geri bildirimi → takip sorusu → İtiraz → Sonraki Soru |
| Atölye / Editör | `Ctrl+Enter` çalıştır; `F8` sonraki hata; Parsons: `Space` seç, ↑ ↓ taşı, `Space` bırak |
| Pazar | Ok tuşları ızgarada gezinir; `Enter` kartı seçer; `Tab` özet paneline; `Esc` modal kapatır |
| Oda düzenleme | Envanterde ok + `Enter` seç; ızgarada ok = taşı; `R`, `Delete`, `Ctrl+Z` |

### 12.3 Erişilebilir Dünya Katmanı

Canvas ekran okuyucuya kapalıdır; bu yüzden her sahnede DOM'da, görsel olarak gizli ama odaklanabilir bir **sahne listesi** kurulur (`<section aria-label="Sahne: Derleyici Meydanı">`).

| Öğe | Kural |
|---|---|
| Etkileşim listesi | `WorldStore`'dan türetilir: en yakın en çok 8 etkileşim, mesafeye göre; her biri `<button>` (etiket "Akademi kapısı, 12 adım ileride"); `Enter`/`E` yürüyüp etkileşimi başlatır |
| Sahne girişi anonsu | `aria-live="polite"`: "Derleyici Meydanı. 23 oyuncu. Yakınında: Akademi kapısı, Pazar, Çeşme." |
| Oyuncu giriş/çıkışı | Anons edilmez (gürültü); yalnız arkadaşlar |
| Sohbet | Aynı mesajlar `role="log"` bölgesine yazılır (balonlar yalnız görsel); filtre: arkadaşlar / hepsi |
| LED pano | Metin akışı gizli liste olarak; "Pano geçmişi" düğmesi |
| Hedef işaretçisi | "Görev hedefi: Akademi, 34 adım. `E` ile git." |
| Yürüme | Ok tuşları + `Tab`/`Enter`; sahne yürünebilir maskeye sadık |

### 12.4 Ekran okuyucu etiketleri (örnekler)

| Öğe | Etiket |
|---|---|
| XP çubuğu | "Seviye 3 ilerlemesi: 350 XP'nin 200'ü" |
| Bayt / Çip pili | "Bayt: 1.240" / "Çip: 10" |
| Kasa | "Kasa: 73 Bayt'ın 61'i. Dolmasına 1 saat 18 dakika." |
| Hedef çubuğu | "Hedef: Kargo Deposu. Bayt 1.240 / 1.500; Ruhsat 3/3 tamam; Seviye 6 tamam." |
| Rubrik | "Kurul şunlara bakar: Doğruluk 50 puan, Tamlık 30 puan, Açıklık 20 puan." |
| Kurul puanı | "Kurul puanı: 100 üzerinden 82. Geçti." |
| Test satırı | "Test A5: 361 dakika, beklenen 250 TL, gerçek 280 TL, kaldı." |
| PRIMM şeridi | "Adım 2 / 5: Çalıştır" |
| Metro durağı | "Çarşı hattı, 3. durak, Kararlar, mühürlü; altına 1 tur kaldı." |
| Ürün kartı | "Kaptan Şapkası, Nadir, Baş kıyafeti, 520 Bayt, yeterli bakiye var." |
| Rozet | "Keskin Göz, Nişan, kazanıldı." |
| Kapı (sahne) | "Akademi kapısı. Girmek için Enter." |

### 12.5 Renk körlüğü

| Karışma riski | Çözüm |
|---|---|
| Test geçti (nane) / kaldı (mercan) | İkon (`test-gecti` ✓ / `test-kaldi` ✕) + metin "geçti / kaldı" |
| Sıradan / Şık / Nadir / Premium | Şekil (kare / elmas / altıgen / çip) + metin |
| Metro durakları gri–sarı–yeşil–altın | Şekil (boş / yarım / dolu+tik / dolu+halka+ışın) |
| İşletme durumları | Şekil + etiket (§3.6) |
| Bayt (amber) / Çip (turkuaz) / XP (kobalt) | Farklı ikon + etiket sözcüğü |
| Metro hatları | Hat numarası (1–7) |
| Grafik serileri (TL / B) | Ayrı grafik, farklı işaretçi şekli (daire / kare) |
| Lig terfi / düşme bölgeleri | Çizgi + "Terfi" / "Düşme" yazısı |

Ayarlar > Erişilebilirlik > **Renk körü modu** ek olarak desen doldurmaları açar (mercan çapraz çizgi, nane nokta, amber yatay çizgi). Playwright görsel regresyonu protanopi/döteranopi/tritanopi filtreleriyle çalışır.

### 12.6 Kontrast (hesaplanmış)

| Çift | Oran | Kullanım |
|---|---|---|
| `#E8EDF8` / `#0D1326` | 15,73:1 | Gövde metni |
| `#E8EDF8` / `#151D36` | 14,20:1 | Kart metni |
| `#C5CEE4` / `#151D36` | 10,57:1 | İkincil metin |
| `#9AA7C7` / `#151D36` | 6,92:1 | Soluk metin |
| `#0A1024` / `#22C9CE` | 9,27:1 | Birincil düğme |
| `#0A1024` / `#FF7A66` | 7,40:1 | Tehlike düğmesi |
| `#0A1024` / `#FFBE3D` | 11,40:1 | Bayt düğmesi |
| `#FFFFFF` / `#2448B5` | 7,87:1 | Oyuncu balonu |
| `#FFFFFF` / `#C8453A` | 4,81:1 | Çarşı hat rozeti |
| `#FFFFFF` / `#2E6F95` | 5,49:1 | Liman hat rozeti |
| `#8A97B8` / `#151D36` | 5,71:1 | Girdi/düğme kenarlığı (1.4.11) |
| `#22C9CE` / `#0D1326` | 9,06:1 | Odak halkası |
| `#E6ECFF` / `#0F1730` | 15,02:1 | Kod metni |
| `#8794B8` / `#0F1730` | 5,87:1 | Kod yorumu |
| **Yasak çift** `#FFFFFF` / `#E8553E` | 3,62:1 | Normal metin için yetersiz (mercan-600'e beyaz yazı kullanılmaz) |

### 12.7 Bilişsel erişilebilirlik

Kart ≤ 60 kelime, Usta balonu ≤ 40 kelime/parça, geri bildirim ≤ 80 kelime ve hata dili "henüz değil; şu satıra bak" (suçlama yok). Her ekranda tek birincil eylem; zaman baskısı yok (Meydan Sorusu isteğe bağlı); ilerleme her zaman görünür (kart 3/6, test 4/6, soru 2/5); aynı bilgi iki yerde tutarsız yazılmaz (Bayt/XP tek kaynak). Ayarlar'da "Sade mod" yoktur; bunun yerine animasyon, ses ve kalabalık tek tek kısılabilir.

---

## 13. Yerelleştirme (tr-TR)

Uygulama dili yalnızca Türkçedir; ancak tüm metinler FormatJS kataloğundan okunur (anahtar şeması `ekran.{kimlik}.{bölge}.{ad}`, ör. `ekran.pazar.satin-al.onay-baslik`). CI eksik/ölü anahtarı hata sayar. Metin bütçeleri: düğme ≤ 20 karakter, toast ≤ 90 karakter, ders kartı ≤ 60 kelime, Usta balonu ≤ 40 kelime/parça, Kurul geri bildirimi ≤ 80 kelime.

### 13.1 Biçimler

| Öğe | Kural | Örnek |
|---|---|---|
| Sayı | `Intl.NumberFormat('tr-TR')`: binlik nokta, ondalık virgül | 1.234,5 · 1.240 |
| Bayt | Sayı + NBSP + `B` | 300 B · 1.240 B |
| Çip | Sayı + NBSP + `Çip` (kısaltma yok) | 10 Çip |
| XP | Sayı + NBSP + `XP`; seviye `Sev. N` | 3.215 XP · Sev. 7 |
| İlerleme | `mevcut / hedef` (boşluklu eğik çizgi); kısa form `26/26` | 200 / 350 XP · 26/26 |
| Simülasyon parası | Sayı + NBSP + `TL`; sembol (₺) kullanılmaz | 2.220 TL |
| Gerçek para (Çip paketi) | İki ondalık + `TL` | 59,99 TL |
| Yüzde | Önde: `%50` | %50 gelir |
| Tarih | `Intl.DateTimeFormat('tr-TR', {dateStyle:'long'})`; kısa `03.11.2026` | 3 Kasım 2026 |
| Saat | 24 saat | 19:40 |
| Süre | `1 sa 18 dk`, `90 sn` (kısaltmalar: sa, dk, sn, g) | 4 g 12 sa |
| Haftanın günü | Pzt Sal Çar Per Cum Cmt Paz | Cmt 7 Kas |
| Sıralama | `Intl.Collator('tr')` (ç ğ ı ö ş ü doğru sırada) | liderlik, arkadaş listesi |
| Büyük harf | `toLocaleUpperCase('tr-TR')` / `lang="tr"` ile CSS | i → İ, ı → I |

Gün fazı, Pazartesi 09:00 sayacı, lig kapanışı ve 04:00 sıfırlamaları (Alkış, Günlük Tekrar, görev sayaçları) cihaz saatiyle değil `GET /v1/players/me` yanıtındaki `serverTime` ofsetiyle ve `Europe/Istanbul` kuralıyla hesaplanır (B6 §3.3). Sayı ile birim arasında NBSP (` `) kullanılır, böylece "300" ve "B" satır sonunda ayrılmaz. Eksi işareti yalnız gerçekten negatif değerde (`-`); oyunda negatif Bayt yoktur.

### 13.2 Çoğul kuralları

Türkçede sayıdan sonra isim tekil kalır ("3 araç", "12 ders", "2 gün"); bu yüzden şablonlarda çoğul eki **yoktur**: `{n} ders`. ICU `plural` yalnızca anlamın değiştiği yerde kullanılır: `{n, plural, =0 {Hiç ders yok} one {1 ders} other {# ders}}`. Belirsiz tekil ("bir ders kaldı") ile sayı ("1 ders") karışmaz. Sıra sayıları ek alır: "1." ("1. ders"), "2. denemen".

### 13.3 Türkçe ek yardımcısı (`tr-ek`)

Takma adlar kullanıcı üretimidir ve ekler dinamiktir: "@zeynep_cs'nin Otoparkı", "@ayse_kod'un Otoparkı", "@deniz07'ye Alkış". `packages/i18n/tr-ek.ts` kuralı:

1. Takma ad `_ . -` ve rakam sınırlarında parçalanır; **son parça** esastır.
2. Son parçada ünlü varsa son ünlü ve son harf normal kuralla alınır (`a ı o u` kalın; `e i ö ü` ince; `o u ö ü` yuvarlak).
3. Son parçada ünlü yoksa (`k`, `cs`, `c`) **harf adı** okunur: ünsüz harf adları `e` ile biter (`ke`, `ce`, `se`); parça ince ünlü + ünlüyle biten sayılır → ek `-nin / -ye / -de / -den`.
4. Takma ad rakamla bitiyorsa son rakamın adı okunur (0 sıfır, 1 bir, 2 iki, 3 üç, 4 dört, 5 beş, 6 altı, 7 yedi, 8 sekiz, 9 dokuz); sıfırla biten sayılarda onluk adı (10 on, 20 yirmi, 30 otuz, 40 kırk, 50 elli, 60 altmış, 70 yetmiş, 80 seksen, 90 doksan).
5. Apostrof her zaman yazılır; ekten önceki kısım değiştirilmez (büyük/küçük harf korunur).

| Ek | Ünlüyle biten sonrası | Ünsüzle biten sonrası |
|---|---|---|
| Tamlayan (-in) | -nın / -nin / -nun / -nün | -ın / -in / -un / -ün |
| Yönelme (-e) | -ya / -ye | -a / -e |
| Bulunma (-de) | -da / -de | -da / -de (sert ünsüzden sonra -ta / -te) |
| Ayrılma (-den) | -dan / -den | -dan / -den (sert ünsüzden sonra -tan / -ten) |

| Girdi | Ek | Çıktı | Neden |
|---|---|---|---|
| `ayse_kod` | tamlayan | `ayse_kod'un` | son parça `kod`: o → -un, ünsüzle biter (B1'deki yazım) |
| `zeynep_cs` | tamlayan | `zeynep_cs'nin` | `cs` ünlüsüz: "ce se" → ince, ünlüyle biter |
| `mert.k` | tamlayan | `mert.k'nin` | `k` → "ke" |
| `deniz07` | yönelme | `deniz07'ye` | 7 → "yedi": ünlüyle biter, ince |
| `deniz07` | tamlayan | `deniz07'nin` | aynı |
| `kaan` | tamlayan | `kaan'ın` | a → -ın, ünsüzle biter |
| `kaan` | ayrılma | `kaan'dan` | n yumuşak → -dan |
| `ela_c` | yönelme | `ela_c'ye` | `c` → "ce" |
| `berk_34` | tamlayan | `berk_34'ün` | 4 → "dört": ö → -ün, sert ünsüz t ile biter |
| `berk_34` | ayrılma | `berk_34'ten` | t sert → -ten |
| `Defne` | tamlayan | `Defne'nin` | ünlüyle biter, e → -nin |
| `Elif` | tamlayan | `Elif'in` | i → -in, ünsüzle biter |

Yardımcının 40 satırlık birim testi (yukarıdaki tablo dâhil) CI'dadır; belirsiz durumda (tanınmayan karakter) ek **hiç yazılmaz** ve cümle ekli yapıdan kaçınan alternatif şablona düşer ("Otopark — sahibi: @ad").

### 13.4 Ton ve yazım

Sen dili; emoji yok; "henüz değil; şu satıra bak" (başarısızlık sözcüğü yok); Usta isimle hitap eder, Kurul hitap etmez; Aferin günde en çok bir kez (süreç övgüsü tercih); ünlem işareti ekran başına en çok bir. Kısaltmalar: `Sev.`, `B`, `XP`, `sa`, `dk`, `sn`. Terim sözlüğü KANON §10'dur (Bayt, Çip, XP, Kurul, Usta, Savunma, Müfettiş aynen).

### 13.5 Klavye ve girdi

Kısayollar `event.code` ile tanımlıdır; Türkçe Q ve F düzenlerinde aynı fiziksel tuş çalışır. Türkçe Q klavyede `{ } [ ]` için **AltGr** gerekir (AltGr+7, +0, +8, +9) ve acemiler için engeldir: işletme/Atölye editörlerinde masaüstünde de açılabilen **Kod Tuşları çubuğu** (§14.3) bu yüzden vardır; editör alt çubuğu "`{` için AltGr+7" ipucunu gösterir. Metin girişinde `İ/ı` büyük-küçük harf dönüşümü yerel kuralla yapılır; kod editöründe harf büyüklüğü hiç dönüştürülmez.

---

## 14. Mobil uyarlama

Ürün ilkesi: **"Mobilde okunur, masaüstünde yazılır."** Okuma, gezme, Alkış, kasa toplama, sohbet, Pazar ve kısa Atölye görevleri mobilde tam yapılır; uzun işletme kodu mobilde varsayılan olarak okunur ve "Sonra masaüstünde devam et" kartı sunulur (VİZYON §13).

### 14.1 Genel kurallar

| Kural | Değer |
|---|---|
| Dokunma hedefi | ≥ 44×44 (varsayılan 48); komşu hedefler arası ≥ 8 px |
| Düzen | Dikey tek sütun; birincil eylemler alt %40'ta (başparmak bölgesi); alt sayfalar (`Modal` alt sayfa varyantı) |
| Çerçeve | Referans 390×844 (PWA tam ekran); `100dvh`; `env(safe-area-inset-*)`; `viewport-fit=cover`; `interactive-widget=resizes-content` |
| Etkileşim | Eylem `pointerup`'ta; `touch-action: manipulation`; çift dokunmayla yakınlaştırma yok |
| Kırılımlar | ≤ 599 telefon (tek sütun) · 600–1023 tablet (iki sütun, dock yatay) · ≥ 1024 masaüstü; yatay telefon (≥ 640×360) Atölye/Editör'de iki panel |
| Yazı | Gövde 16 px (iOS yakınlaştırma tetiklenmesin diye girdi ≥ 16 px) |
| Pil/ağ | Düşük cihaz modu önerisi (§2.8); sekme gizlenince render durur; `saveData` açıksa `avatar-patch` yalnız yakındaki 8 oyuncu için |

### 14.2 Jestler

| Jest | Sonuç | Alternatif düğme |
|---|---|---|
| Dokun | Yürü / seç; nesnede ilk dokunuş adı gösterir, ikinci dokunuş girer | — |
| Uzun bas (500 ms) | Avatar profil mini kartı; araç ipucu | Dokun → "Profil" |
| Tek parmak sürükle | Kamera kaydır (3 sn takibi askıya alır) | Harita sekmesi |
| İki parmak pinch | Zoom 1,0 ↔ 1,5 | ± düğmeleri |
| Alt sayfayı sürükle | Aç/kapat | Tutamak düğmesi |
| Kenardan kaydırma | Tarayıcı geri (uygulama geri yığını ile uyumlu) | Geri düğmesi |

### 14.3 Kod klavyesi yardımcı çubuğu

Dokunmatik cihazda `CodeEditor` odaklanınca, OS klavyesinin hemen üstünde 44 px yüksekliğinde yatay kaydırılabilir bir **Kod Tuşları çubuğu** belirir (konum `visualViewport` ile hesaplanır). Masaüstünde Ayarlar'dan açılabilir (Türkçe Q klavye AltGr engeli, §13.5).

| Sıra | Tuşlar | Davranış |
|---|---|---|
| 1–7 (ilk ekran) | `Tab` · `;` · `(` · `)` · `{` · `}` · `"` | `(` `{` `"` çiftini yazar, imleç içeride kalır; `;` imleç satır ortasındaysa satır sonuna ekler ve imleci yerinde bırakır |
| 8–16 | `=` · `.` · `<` · `>` · `!` · `&` · `\|` · `+` · `-` | Uzun basış: `&` → `&&`, `\|` → `\|\|`, `=` → `==`, `"` → `'` |
| 17–24 | `*` · `/` · `%` · `[` · `]` · `_` · `↶` geri al · `↷` ileri al | — |

Tuş 44×44, aralık 4 px, 10 ms titreşim (açıksa). Editör girdisi: `autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="enter"`; **akıllı noktalama normalizasyonu** `beforeinput` aşamasında `“ ” ‘ ’` → `" '` (§1.7). Konum kodu:

```ts
const vv = window.visualViewport!;
const place = () => {
  bar.style.transform = `translateY(${vv.height + vv.offsetTop - bar.offsetHeight - window.innerHeight}px)`;
};
vv.addEventListener('resize', place); vv.addEventListener('scroll', place);
```

### 14.4 Ekran bazında mobil stratejisi

| Ekran | Mobilde | Not |
|---|---|---|
| Giriş, Dil Seçimi, Avatar Atölyesi | Tam | Sanal klavye ile kayan kart |
| Meydan, Harita, Akademi, Sokak, Oda | Tam (gez, Alkış, kasa); Oda düzenleme dokun-yerleştir | Pinch + ± |
| Derslik | Tam (1 satır yazılır) | CodeMirror |
| Kurul Kartı, Savunma | Tam (metin yazılır) | Klavye üstü "Gönder" |
| Atölye | Tam (kısa görev; kod yardımcı çubuğu) | Parsons dokun-taşı |
| İş Emri | Tam | Sekmeler |
| **İşletme Editörü** | **Okunur; "Yine de burada yaz" ile yazılır** | "Sonra masaüstünde devam et" kartı (aşağıda) |
| İşletme Paneli, Pazar, Dolap, Vitrin, Profil, Liderlik, Sohbet, Ayarlar, Metro, Günlük Tekrar | Tam | — |

"Sonra masaüstünde devam et" kartı: "Bu işletmenin kodu masaüstünde daha rahat yazılır. Bağlantıyı kendine gönder, bilgisayarda aç." [Bağlantıyı Kopyala] [Yine de Burada Yaz]. Bağlantı, oturum açmış cihazda kısa ömürlü tek kullanımlık bir `Link` değil, kimlik doğrulama gerektiren sıradan `#/editor?isletme=…` rotasıdır (token taşımaz).

### 14.5 PWA kurulumu

Manifest: `name` "KodKent", `short_name` "KodKent", `display: standalone`, `theme_color`/`background_color` `#0D1326`, simgeler 192/512 + maskelenebilir. **29. dakika** (VİZYON §4) "Ana ekrana ekle" kartı: Android/Chrome `beforeinstallprompt` ile [Ekle]; iOS Safari'de adım adım kart ("Paylaş → Ana Ekrana Ekle"). Bildirim izni **yalnızca** kullanıcının bir bildirim türünü açtığı anda sorulur (iOS'ta Web Push yalnız ana ekrana eklenmiş PWA'da çalışır; B7 ADR-09). Hayır denirse 7 gün tekrar sorulmaz.

---

## 15. Çevrimdışı ve yeniden bağlanma

### 15.1 Service worker stratejisi

| Kaynak | Strateji | Süre / sınır |
|---|---|---|
| Kabuk (HTML, JS/CSS parçaları) | Önbelleğe alma (precache), güncelleme akışıyla | Sürüm başına |
| Yazı tipleri, ikonlar | `CacheFirst` | 1 yıl, `immutable` |
| Atlas/ses (özet adlı) | `CacheFirst` + LRU | En çok 150 MB; 60 sn kullanılmayan sahne atlası bırakılır |
| `GET /v1/lessons/*`, `/v1/districts/*/lessons` (ders paketi) | `StaleWhileRevalidate` | Son 3 ders + açık dersin sonraki 2'si önbelleğe (≈ 15–25 KB/ders) |
| `GET /v1/players/me`, `/wallet`, `/metro` | `NetworkFirst` (3 sn zaman aşımı) → son bilinen | Yalnız okuma; "güncel olmayabilir" etiketi |
| Tüm `POST/PUT/DELETE` | Ağ; **önbelleğe alınmaz** | — |
| `/hubs/*` | SW dokunmaz | — |

### 15.2 Ne çevrimdışı çalışır

| Yüzey | Çevrimdışı | Not |
|---|---|---|
| Kabuk, Ayarlar (görüntüleme/yerel ayar) | Açılır | Ayar değişiklikleri kuyruğa alınır |
| Meydan/Harita/Akademi/Oda **gezme** | Önbellekli sahnede yalnız başına | Diğer oyuncular yok; Alkış/sohbet kapalı |
| Derslik kartları (indirilmiş) | Okunur | Çalıştır, Usta sorusu kapalı |
| Cevap taslakları (Kurul, Savunma, Atölye) | **Yazılır ve cihazda saklanır** | Gönderim bağlanınca kullanıcı onayıyla |
| Kod çalıştırma, test, Müfettiş, Kurul | **Yok** | Sunucu sandbox'ı gerekir |
| Satın alma, tapu, kasa toplama, Alkış | **Yok** | Sunucu otoritesi; kuyruğa alınmaz |
| Pazar rafları, Liderlik, Profil | Son bilinen veri soluk | "Çevrimdışısın…" bandı |
| Günlük Tekrar | Son soru paketiyle çözülür | Tamamlama ve ödül bağlanınca sunucuda işlenir (B6 §3.3) |

### 15.3 Bağlantı durumları

| Durum | Tetikleyici | Arayüz | Davranış |
|---|---|---|---|
| Çevrimiçi | `navigator.onLine` + hub bağlı | — | Normal |
| Yavaş | WebSocket RTT > 800 ms (3 ölçüm) | Üst şeritte "Bağlantın yavaş." | Yürüme iyimser kalır |
| Yeniden bağlanıyor | Hub koptu | Sahne üstünde "Yeniden bağlanıyor… ({n}/6)"; avatar hayalet (30 sn) | Aralıklar 0, 1, 3, 7, 15, 30 sn; başarıda yeni `join-tickets` bileti + yeni `scene.snapshot` |
| Çevrimdışı | `offline` olayı / 6 deneme başarısız | Kalıcı üst bant (`cevrimdisi` ikonu): "Çevrimdışısın. Bağlanınca kaldığın yerden devam edeceksin." | Yazma eylemleri devre dışı, taslaklar açık |
| Oturum bitti | Yenileme belirteci reddedildi | Modal "Oturumun doldu. Yeniden giriş yapalım." | `giris`; taslaklar korunur |
| Bakım | `503` + `Retry-After` | Tam ekran "KodKent bakımda. Birazdan döneceğiz." + geri sayım | Otomatik yeniden dene |
| Sürüm uyuşmazlığı | `426 CLIENT_OUTDATED` (asgari sürüm `GET /v1/meta/client-config`) | "Yeni sürüm hazır." [Yenile] | Zorunluysa engelleyici |

### 15.4 Güncelleme akışı

Yeni service worker bulununca `waiting` kalır; kullanıcı **boştaysa** (panel kapalı, editörde taslak yok) arka planda etkinleşir, değilse "Yeni sürüm hazır." toast'u [Yenile] ile gelir. API uyumsuz (kırıcı) sürümde sunucu `426 CLIENT_OUTDATED` döner ve engelleyici kart çıkar. Taslaklar yenilemeden önce IndexedDB'ye yazılır.

---

## 16. Performans izleme

Gerçek kullanıcı ölçümü (RUM) `web-vitals` ve oyun metrikleriyle yapılır; sonuçlar `navigator.sendBeacon` ile `/v1/telemetry/client-metrics` uç noktasına (B7 kataloğunda yok; talep edilir) toplu gider ve B7 gözlem yığınında (ADR-16) panoya düşer. Örnekleme: oturumların %10'u, hatalar %100.

| Metrik | Ölçüm | Hedef | Alarm |
|---|---|---|---|
| LCP (Giriş) | `web-vitals` | p75 ≤ 2,5 sn (4G, orta mobil) | p75 > 3 sn, 15 dk |
| INP | `web-vitals` | p75 ≤ 200 ms | p75 > 300 ms |
| CLS | `web-vitals` | ≤ 0,1 | > 0,15 |
| `scene_load_ms` | `join-tickets` isteği → `scene.ready` | Meydan p75 ≤ 6 sn (ilk), ≤ 2 sn (önbellekli) | p75 > 8 sn |
| `frame_ms_p95` / `fps_p50` | 10 sn'lik pencere, `ticker` | masaüstü ≤ 16,7 ms; mobil ≤ 33 ms | mobil `fps_p50` < 24 |
| `draw_calls_p95` | Pixi sayacı | ≤ 40 / 32 / 20 | bütçe aşımı |
| `heap_mb` | `performance.memory` (varsa) | ≤ 180 / 140 / 100 | > bütçe %20 |
| `ws_rtt_ms` | Hub ping | p50 ≤ 80, p95 ≤ 250 | p95 > 500 |
| `ws_reconnects_per_hour` | Sayaç | ≤ 0,5 | > 2 |
| `run_roundtrip_ms` | "Çalıştır" tıklaması → sonuç | p95 < 6 sn (KANON §9 sandbox p95) | p95 > 8 sn |
| `kurul_roundtrip_ms` | "Cevabı Gönder" → sonuç | p95 < 4 sn + istemci payı | p95 > 6 sn |
| `monaco_load_ms` | Parça yükleme | p75 ≤ 1,5 sn | > 3 sn |
| `sw_cache_hit_ratio` | Atlas/ses | ≥ %90 (tekrar ziyaret) | < %70 |
| `crash_free_sessions` | Hata sınırı + kaçak hata | ≥ %99,5 | < %99 |
| `low_mode_share` | Düşük cihaz modu oranı | bilgi amaçlı | ani artış |

**Gizlilik.** Telemetri kişisel veri taşımaz: oyuncu kimliği yerine rastgele oturum kimliği; cihaz sınıfı kaba kovalarla (bellek 2/4/8+ GB, DPR, ekran sınıfı), GPU adı tam yazılmaz; IP kaydedilmez. B7 kataloğunda istemci metriği ucu yoktur; `POST /v1/telemetry/client-metrics` talep edilir (ya da OpenTelemetry web SDK'sı OTLP/HTTP ile kullanılır). Teknik performans ve hata ölçümü kişisel veri içermediğinden Aydınlatma Metni'ne dayanır; **ürün analitiği ayrı açık rızaya bağlıdır ve varsayılan kapalıdır** (`consents.analytics`, B7 §5.4.3; Ayarlar > Gizlilik ve KVKK). 15–17 yaş için de aynı kural geçerlidir (hukuk doğrulayacak, Açık Soru 9). **Hata sınırı.** Her ekran kendi `ErrorBoundary`'sine sarılır: "Bir şeyler ters gitti." [Tekrar Dene] [Sorunu Bildir]; sahne çökerse HUD ayakta kalır ve sahne yeniden kurulur. **Bütçe kapısı.** CI'da `size-limit`, varlık manifesti ve Playwright kare süresi testleri aşımı derlemeyi kırar (§2.7).

---

## 17. Varsayımlar

1. **Boyutlar ve bütçeler yaklaşık/öneridir.** PixiJS, Monaco, KTX2 atlas ve ses boyutları ile draw call/fps/bellek bütçeleri (§2.7) H2'de (iskelet haftası) gerçek sanatla ve gerçek cihazlarda ölçülür; ölçüm bütçeyi tutturamazsa önce düşük cihaz modu eşikleri, sonra varlık sıkıştırması gözden geçirilir.
2. **Hedef platform:** masaüstü Chrome/Edge son 2 sürüm; mobil alt sınır 4 GB RAM (VİZYON varsayım 7); Safari iOS 16.4+ (Web Push yalnız ana ekrana eklenmiş PWA'da, B7 ADR-09). Firefox ve Safari masaüstü "desteklenir ama birincil değildir".
3. **Çerçeve boyutları:** masaüstü 1280×800, mobil 390×844 CSS px; wireframe koordinatları bu çerçevelerdedir ve `env(safe-area-inset-*)` sıfırdır. Gerçek yerleşim akışkandır; tablolar Ekranlar sayfasının çizim kaynağıdır.
4. **Yönlendirme:** üretim `#/token?param=…`, prototip `#token` biçimini kullanır; ikisi aynı ekrana çözülür (K-11).
5. **Sunucu otoritesi tam:** istemci Bayt, XP, Çip, test sonucu, Kurul puanı ve gelir hesaplamaz; ödül animasyonu yalnız sunucu yanıtı/olayıyla oynar. Yürüme için yerel tahmin (4 komşulu A\*, B7 ile aynı algoritma) ve `move.ack` uzlaşması vardır.
6. **KTX2/UASTC** desteği olmayan tarayıcıda kayıpsız WebP → RGBA8 yedeği çalışır; GPU belleği bütçesi bu yolda aşılabilir (düşük cihaz modu devreye girer).
7. **Monaco** yalnızca masaüstünde; dokunmatikte ve Derslik mini editöründe CodeMirror 6. İşletme kodu mobilde varsayılan salt okunurdur (VİZYON §13: "sonra masaüstünde devam et").
8. **Ses varsayılan kapalıdır** (B8 kuralı); müzik temaları B1 §3'tendir ve yalnız ses açıkken indirilir.
9. **Çip ödemesi** ödeme sağlayıcının barındırdığı sayfada yapılır; istemci kart verisi görmez (PCI kapsamı dışı); 15–17 için veli limiti (varsayılan 0, üst sınır 300 Çip/ay) ve her satın almada veli onayı B2 §9.3'tür.
10. **Telemetri:** teknik performans/hata ölçümü kişisel veri taşımaz ve Aydınlatma Metni'ne dayanır; ürün analitiği ayrı rızaya bağlı ve varsayılan kapalıdır (B7 `consents`). Hukuk doğrulayacak.
11. **Eksik uç noktalar** (B7 kataloğunda yok): "Panoda Göster" (LED pano girişi), "Kodu Okudum" (Vitrin XP'si), "Sahibine haber ver", "Kodu dışa aktar", dil bekleme listesinden vazgeçme (`DELETE`), istemci metrik toplama. İstemci bunları talep olarak taşır (§6 ilgili ekranlar); B7 kabul edene kadar ilgili düğmeler özellik bayrağıyla (`GET /v1/meta/client-config`) kapalı gelir.
12. **Müfettiş balon metinleri** (§6.12) ve Savunma örnek cevabı dışındaki bazı Sokratik cümleler B8 önerisidir; B5 §7.1 ve §3.8 yazılınca birebir onlara çekilir.
13. **Kurul Kartı mockup'ı** VİZYON §4 ve B7 §5.4.8 sayılarını (XP 60 → 85, Sev. 2) kullanır; B4 §4.1 aynı eşiği üçüncü soruda aşılır sayar.
14. **Örnek oyuncular** (`@zeynep_cs`, `@mert.k`, `@ayse_kod`…) kurgusaldır; B1/B5/B7 örnek adlarıyla örtüşenler bilinçlidir (tutarlılık için).
15. **Hareket azaltma** işlevsel hareketi (yürüme, sprite kareleri) durdurmaz; yalnız süs hareketini ve parçacıkları kapatır.

---

## 18. Açık Sorular

1. **Yürüme yönü:** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.3: 4 komşulu yol bulma, çapraz adım yok; B1 §7.1 buna çekildi.)* B1 §7.1 "8 yönlü serbest hareket" der; B7 §6.5 sunucuda **4 komşulu A\*** kullanır (çapraz adım yok). İstemci B7'yi izliyor (§2.5). Sanat ve his açısından 8 yönlü isteniyorsa B7'nin yol hesabı ve `walkable` doğrulaması değişmeli; karar sahibi B1 + B7.
2. **Eksik uç noktalar:** §17.11'deki altı uç nokta B7'ye eklenecek mi? Özellikle "Panoda Göster" (Ders 1.1'in sosyal gösteriş anı #1) LED pano girişini B6 §7.2'nin moderasyon hattına bağlayan bir uç ister; hat yoksa düğme kaldırılmalı mı?
3. **Sev. 2 eşiği hangi soruda?** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.3: Ders 1.1'in 3. Usta sorusu; M-14 mockup'ı o soruyu gösterir: 60 → 85 XP.)* VİZYON §4, B2 ve B7 ilk Usta sorusunda (60 → 85 XP, 14. dakika) der; B4 §4.1 kartları 10 XP sayıp eşiği üçüncü soruda aşılır der. Kurul Kartı mockup'ı ve onboarding süresi buna bağlıdır.
4. **Editör ikiliği (Monaco + CodeMirror 6) gerekli mi?** Ölçüm Monaco'nun masaüstü yararını (marker, diff, ayrıntılı IntelliSense profili) CodeMirror'a göre ≥ 650 KB gzip bedelini haklı çıkarmazsa tek editöre (CodeMirror 6) inilmeli; karar H2 ölçümüyle verilecek.
5. **Tek tuşlu kısayollar:** `A` tuşu hem Akademi (B1 §10.3) hem WASD'nin sol hareketi (B1 §10.1) olduğundan WASD varsayılan kapalı, açıkken Akademi `Shift+A` yapıldı (§4.3). Bu uzlaşma yeterli mi, yoksa WASD hiç sunulmamalı mı?
6. **Fiyat/ad tutarsızlıkları (B1 ↔ B2):** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.3: B1 fiyatları B2 §9'a çekildi.)* emote fiyatları (B1 #11 Şapka Çıkar 150 B Şık, #12 Tuşlama 100 B Sıradan; B2 Şık 120 B, Sıradan 60 B), Nadir oda eşyası (B1 §5.3: 120–130 B; B2 §9.1: 300–400 B) ve Butik ürün adları (B1 "Neon Gece", "Bulut" kanadı, "Tente Altı"; B2 "Neon Çırak", "Gece Odası", "Dans Paketi I", isim rengi). Pazar mockup'ı B2'yi (fiyat sahibi) kullandı; B1 listesi güncellenmeli.
7. **Çevrimdışı Günlük Tekrar:** B6 §3.3 çevrimdışı çözmeye izin verir; bunun için cevap anahtarının istemciye inmesi gerekir (sahtecilik riski küçük ama var, ödül ≤ 30 B). B7 sunucu doğrulamasıyla (zaman damgası + tek kullanımlık paket) yeterli sayıyor mu?
8. **Mobil işletme kodu:** varsayılan salt okunur doğru mu? Dokunmatik cihazda yazan oyuncu oranı ve Açılış başarısı ilk beta'da ölçülür; mobil Açılış oranı masaüstünden > %30 düşükse varsayılan "yazılabilir" yapılmalı.
9. **Ürün analitiği rızası varsayılan kapalıyken** D1/D7/ders terk KPI'ları (B9) nasıl ölçülecek? Rıza oranı düşükse anonim, toplulaştırılmış sunucu tarafı ölçüm (B7 `kpi_daily`) tek kaynak mı olmalı? Hukuk ve B7 kararı.
10. **"Usta sana nasıl seslensin?" görünen adı** (B7 `displayName`, KANON'da yok) yeni bir kullanıcı üretimi metindir ve moderasyon kapsamına (B6 §7) girer; zorunlu mu isteğe bağlı mı, takma adla aynı süzgeçten mi geçecek?

---

## 19. Diğer Belgelere Bağımlılıklar

| Belge | B8'in beklediği | B8'in verdiği |
|---|---|---|
| **KANON / VİZYON** | Ekran adları (§6), sayılar (§3–§5, §9), ilk 30 dakika zaman çizelgesi | 24 ekran + HUD'un yerleşim, durum, etkileşim sözleşmesi; HUD kademeli açılış önerisi (§5) |
| **B1 (dünya)** | İzometrik temel (§1), semt paletleri (§3), Akademi/Oda/arsa durumları (§4–§6), avatar/emote/rozet (§7), NPC görünüşü (§8), navigasyon ve instance (§10–§11) | PixiJS gerçeklemesi, atlas/bütçe, z-sıralama, 600 ms kuralı, kısayollar; B1 çelişkileri (yürüme yönü, WASD/A, emote fiyatları) Açık Sorular'da |
| **B2 (ekonomi)** | XP/Bayt/Çip sayıları, kozmetik fiyat bantları, Çip paketleri, ilk-kez bonusları, Seri/Alkış kuralları | HUD sayaç animasyon kuralı, Pazar akışı, Panel yükseltme tablosu, Çip modali |
| **B3 (eğitim/AI)** | Kurul Kartı akışı (§4.1), takip durum makinesi (§4.3), JSON şema (§5.3), uyarı metinleri (§7.5), Savunma (§9.3), ipucu/Berrak Zihin (§8) | `kurulMachine`, rubrik bileşeni, mühür renk/metin eşlemesi, kota/hata/çevrimdışı durumları |
| **B4 (müfredat)** | Ders ve görev kimlikleri/başlıkları (§3), Ders 1.1 kartları (§4.1), Günlük Tekrar (§8), kapı haritası (§12.2) | Derslik kart akışı, Metro Haritası, Akademi Kürsü Panosu |
| **B5 (işletmeler/kod)** | Challenge Spec görünümü (§1.9), Gereksinim Netleştirme (§3.2), test kimlikleri A/G/T, Savunma D1–D5, ipucu metinleri (§3.9), Usta Yorumu (§3.10); **§7.1 Müfettiş kategori balonları (henüz boş)** | İş Emri, İşletme Editörü, Savunma ekranları; balon metni önerileri (§6.12) |
| **B6 (görev/sosyal)** | Günlük Tekrar ve seri (§3), Alkış/Vitrin/Oda ziyareti (§6), sohbet ve güvenli mod (§7), Liderlik Panosu (§8), ekran metinleri (§14) | Sohbet, Liderlik, Oda, Vitrin, Günlük Tekrar ekranları |
| **B7 (backend)** | OpenAPI (§5.3 katalog), hata kodları (§5.2), SignalR olayları (§6.3), shard/bilet modeli (§6.4), hareket sözleşmesi (§6.5), kimlik/rıza akışı (§5.4.3) | Eksik uç nokta talepleri (§17.11), tipli istemci (`openapi-typescript`), `X-Client-Version`, `Idempotency-Key` kullanımı |
| **B9 (ürün/yol haritası)** | MVP kapsamı, KPI listesi | İstemci metrikleri (§16), bütçe kapıları; KPI ölçümü ve analitik rızası Açık Soru 9 |
| **B10 (ek: prototip örnek verisi)** | — | §8 mockup içerik paketi prototip örnek verisinin çekirdeğidir |
| **Ekranlar sayfası / Prototip** | — | §6 wireframe tabloları, §7 kenar listesi, §8 mockup verisi, §9 bileşen davranışları, §3 token'ları |

---

## Ek A. Sabit Önerileri (KANON v2 adayları)

KANON'da bulunmayan, bu belgenin önerdiği sabitler; onaylanana kadar yalnız B8 içinde geçerlidir.

| Anahtar | KANON v1 değeri | Önerilen değer | Gerekçe |
|---|---|---|---|
| `HUD_MODES` | yok | `tam`, `kompakt`, `odak`, `gizli` (§4.1) | Dikkat dağıtmayan ders/kod ekranları; ilk 30 dakika "3 öğe" ilkesi |
| `HUD_PROGRESSIVE_DISCLOSURE` | "ilk 30 dk: XP + Bayt + görev kartı" (VİZYON) | Parça başına açılış anları (§5) | VİZYON ilkesini ölçülebilir kılar |
| `PERF_FPS` | masaüstü 60, mobil 30 (B1 önerisi) | + düşük cihaz modu 24 (taban 20) | Alt sınır 4 GB telefonda pil/ısı |
| `PERF_DRAW_CALLS` | yok | ≤ 40 / 32 / 20 (masaüstü / orta mobil / düşük) | 40 avatarlı Meydan'da batch bütçesi |
| `PERF_JS_FIRST_LOAD` | yok | Giriş ≤ 230 KB gz; Pixi ≤ 180 KB; Monaco ≤ 650 KB (tembel) | "İlk Bayt ≤ 20 dk" hedefi için ağ bütçesi |
| `PERF_GPU_MEM` | yok | ≤ 128 / 80 / 48 MB | KTX2 ile 4× küçük doku |
| `LOD_FULL_MAX` | 24 (B1 önerisi) | Masaüstü 24 · mobil 16 · düşük cihaz 8 | B1 Açık Soru 7 |
| `WALK_MIN_MS` | yok (B1: 4 tile/sn) | `max(600 ms, uzunluk / 4)` | Yürüme döngüsü 667 ms; kısa hareket "kayma" olmasın |
| `WALK_PATHING` | B1: A\*, 8 yön ifadesi | İstemci tahmini 4 komşulu A\* (B7 ile aynı) | Sunucu otoritesi ve düzeltme sıklığı |
| `COUNTER_ANIM_MS` | yok | Δ ≤ 20: 500 · ≤ 200: 800 · ≤ 2.000: 1.200 · üstü 1.600 | Ödül hissi, aşırı uzamadan |
| `SOUND_DEFAULT` | yok | Kapalı; kanallar ana 80 / müzik 50 / efekt 80 / ortam 50 | Otomatik oynatma kısıtları, ortak mekân kullanımı |
| `TARGET_SIZE_MIN` | yok | 44×44 CSS px (varsayılan 48), aralık ≥ 8 | WCAG 2.5.8 (24) üstü, mobil dokunma |
| `SHORTCUTS` | B1: M, H, A | + P, D, L, K, T, G, C, E, F6, 1–8; WASD varsayılan kapalı | Klavye erişimi; `A` çakışması (§4.3) |
| `CODE_KEYS_BAR` | yok | 24 tuşluk sıra (§14.3) | Dokunmatik ve Türkçe Q klavye AltGr engeli |
| `EDITOR_STACK` | yok (brief: Monaco) | Masaüstü Monaco; dokunmatik/Derslik CodeMirror 6 | Monaco mobilde resmen desteklenmiyor |
| `REVIEW_PROMPTS_PASTE` | KANON §9 kopya kuralı | Savunma kutusunda yapıştırma kapalı (B3 §9.3) | Kopya savunması ve kendi cümle ilkesi |
| `DISPLAY_NAME` | yok (yalnız takma ad) | İsteğe bağlı "görünen ad" (B7 `displayName`) | Usta "isimle hitap" kuralı |
| `PAZAR_GATES` | Pazar teaser 20. dk (VİZYON) | Tam raflar Sev. 3 · Nadir rotasyonu Sev. 5 · Butik Sev. 5'ten görünür | Çip baskısı yok; B2 §6.3 ile uyum |
| `PAZAR_NO_CART` | yok | Sepet yok; tek ürün, tek onay | Çoklu harcama hatası ve mobil sadeliği |
| `CONSENT_DEFAULTS` | KANON §1 (KVKK) | Analitik, pazarlama, AI kalibrasyonu rızaları varsayılan **kapalı**, ayrı ayrı | B7 §5.4.3 ile aynı |
| `VITRIN_NO_COPY` | yok | Vitrin'de kopyala düğmesi yok; "Önce kendin dene" kuralı (B6 §6.4) | Kopya/spoiler riski |
| `OFFLINE_MATRIX` | "PWA" (KANON §1) | §15.2 tablosu (okuma çevrimdışı; yazma/ödeme çevrimiçi) | Sunucu otoritesi ve dürüst durum |

---

**Revizyon Notu (3 Kasım).** KANON v2 (§12) uyumu: Giriş akışı = telefon → SMS → doğum yılı (öz beyan, saklanmaz) → e-Devlet yaş doğrulama → (15–17) veli telefonu; <15 ret + bekleme listesi; 13 yerde 13–17 → 15–17; Çip: 15–17 veli limiti (varsayılan 0, üst sınır 300 Çip/ay); 15–17 Oda 'Herkese açık' kapalı; ekran sayısı 24 (Ebeveyn Paneli ekran değil, ayrı web sayfası); Açık Soru 1, 3, 6 çözüldü; Ek A satırlarının tümü KANON §12.3'te kabul edildi. Ayrıntı: `_KANON-v2-degisiklikler.md`.
