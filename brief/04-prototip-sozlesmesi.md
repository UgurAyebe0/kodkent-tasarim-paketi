# KodKent Prototipi — Parçalı Üretim Sözleşmesi

> `build/kodkent-prototip.html` tek dosyalık bir oyun arayüzüdür; birden çok ajan paralel yazar. Bu sözleşme ajanlar arasındaki bağdır: dosya düzeni, sahiplik, global adlar, durum şeması, UI yardımcı API'si, ekran modülü sözleşmesi, `KK_CORE.DATA` şekilleri ve test kapıları. İçerik/ekran gereksinimlerinin kaynağı `02-artifact-briefleri.md` §E (E.1–E.4), sayı/isim kaynağı `spec/KANON.md`'dir. Bu belge ile §E çeliştiğinde §E'nin ekran içerikleri, bu belgenin teknik düzeni geçerlidir. P0 (temel katman) gerçek imzaları `build/proto/API.md`'ye yazar; imza farkı olursa API.md kazanır ve ekran ajanları ona uyar.

## 1. Dosya düzeni ve sahiplik

Hepsi `build/proto/` altında; `python tools/assemble_proto.py [--out YOL]` dosya adlarına göre SIRALI birleştirir (iki `<script>`: önce `core/*.js`, sonra `ui/*.js`; her ikisine `'use strict'` otomatik eklenir, parçalarda yazma; `</script` geçirme).

| Parça | İçerik | Sahibi |
|---|---|---|
| `head.html` | `<title>KodKent Oyun Prototipi</title>`, `<meta name="claude:viewport-fit-sides" content="cover">`, font `<link>`'leri (Fredoka 500/600/700, Nunito 400/600/700/800, JetBrains Mono 400/600) | P0 |
| `shell.html` | demo çubuğu + `#app` iskeleti (§6) | P0 |
| `sprite.html` | satır içi SVG `<symbol>` ikon sprite'ı | P0 |
| `css/00-base.css`, `css/10-components.css` | tek tema (gece şehri) tokenları, reset, tipografi, HUD, demo çubuğu, bileşenler | P0 |
| `css/30-…`, `40-…`, `50-…`, `60-…` | ekran CSS'i (yalnızca `.scr-<token>` altında) | P5 / P1 / P2 / P3 |
| `core/00-formul.js` | `xpGereken`, `seviyeHesapla`, `unvan`, `otoparkUcret` | P0 |
| `core/10-…`, `20-…`, `30-…`, `40-…`, `99-export.js` | `DATA`, çevrimdışı puanlayıcılar, `const KK_CORE = {…}` | P4 |
| `ui/00-base.js` | `state`, router, HUD, toast, modal, award, yardımcılar, `ikon`, `csHl` | P0 |
| `ui/10-ai.js` | `ai` modülü (+ `aiPuanla`, `aiKodIncele`, `aiTestSimule`, `aiSavunma`) | P0 |
| `ui/20-iso.js` | `iso` ilkelleri, `avatarSvg`, `ustaSvg`, `walker` | P0 |
| `ui/30-ekran-dunya.js` | `giris`, `dil-sec`, `avatar`, `meydan`, `harita` | P5 |
| `ui/40-ekran-ogrenme.js` | `akademi`, `derslik`, `kurul`, `atolye`, `metro`, `tekrar` | P1 |
| `ui/50-ekran-isletme.js` | `sokak`, `is-emri`, `editor`, `savunma`, `panel`, `vitrin` | P2 |
| `ui/60-ekran-sosyal.js` | `oda`, `dolap`, `pazar`, `profil`, `liderlik`, `sohbet`, `ayarlar` | P3 |
| `ui/90-galeri.js` | `#galeri` geliştirici ekranı (bileşen/ikon/avatar/iso galerisi; demo seçicide YOK) | P0 |
| `ui/99-boot.js` | açılış, demo çubuğu, hash, selftest | P0 |

Bir ajan kendi aralığındaki numaralarla birden çok parça yazabilir (`40a-…`, `40b-…`). Başkasının parçasını DEĞİŞTİRME; eksik/yanlış bir şey bulursan `build/proto/NOTLAR.md` dosyasına "İstek: …" satırı ekle (sonuna ekle, mevcut satırları silme).

**Test amaçlı birleştirme:** her ajan KENDİ çıktısını `python tools/assemble_proto.py --out "$WORK/proto-<ajan>/kodkent-prototip.html"` ile üretir (WORK: `brief/03-ajan-talimati.md` §1). Resmî `build/kodkent-prototip.html` dosyasını yalnızca entegratör üretir.

## 2. Global adlar

- Çekirdek: `KK_CORE` (yalnızca `core/99-export.js`'te tanımlanır). Çekirdek parçaları DOM'a, `window`'a, `localStorage`'a dokunmaz; üst düzey `const/function` kullanabilir.
- Arayüz: `KK_UI` (kayıt defteri + yardımcı toplamı), `state`, `ai` ve `00-base.js`'in dışa verdiği yardımcılar üst düzey adlardır (§5). Ekran parçaları KENDİ yardımcılarını bir IIFE içinde tutar: `(function(){ … KK_UI.screen('kurul', {…}); })();` — global ad kirletme.
- `state.ekran[token]` ekranın kendi (kalıcı olabilecek) verisi içindir; ortak alanlara (§4) yalnızca sahibi ekran yazar (ör. `state.isletmeler.otopark` → `is-emri`/`editor`/`savunma`/`panel`/`sokak`).

## 3. `KK_CORE` sözleşmesi

Mevcut test sözleşmesi (`tools/proto_core_test.mjs` başındaki yorum) AYNEN geçerlidir; eklentiler:

- `xpGereken(L)` = KANON `XP(L)` = `yuvarla10(80 × L^1,35)` (L→L+1 için gereken XP; 1→80, 2→200, 3→350 …); `seviyeHesapla(toplamXp)` → `{ seviye (1–60), kalan (bu seviyede kazanılan XP), gereken (xpGereken(seviye); 60'ta 0), toplamBaslangic }`; `unvan(seviye)` KANON §3.1 bantları.
- `DATA` şekilleri (alan adları SABİT; ekleme serbest, silme/yeniden adlandırma yasak). Kaynak: B1 (semt/Usta), B2 (XP/Bayt/pazar), B4 (dersler), B5 (otopark, işletmeler), B6 (görevler, tekrar, sosyal), B10 (örnek veri).

```js
DATA.semtler   = [{ id:'carsi', ad:'Çarşı', tema, renk:'#…', tier:1, usta:'defne', acilis:{ seviye:1, sinav:null }, konular:[…], durum:'acik'|'kilitli', insaatNotu:'Liman: Çarşı Sınavı\'ndan sonra' }]   // 7
DATA.ustalar   = { defne:{ ad:'Usta Defne', semt:'carsi', kisilik, renk, repliklar:[3 gerçek replik], selam:'…' }, kerem:{…}, nehir:{…}, baran:{…}, elif:{…}, selin:{…}, yusuf:{…},
                   hasan:{ ad:'Hasan Abi', rol:'Otopark müşterisi' }, mufettis:{ ad:'Müfettiş' }, kurul:{ ad:'Kurul' } }
DATA.moduller  = [{ id:'M1', ad, semt:'carsi', dersler:['1.1','1.2',…] }]
DATA.dersler   = [{ id:'1.1', modul:'M1', baslik, semt:'carsi', tier:1, xp:100, dk:12, hedefler:[…], durum:'acik'|'kilitli',     // Çarşı 1.1–1.4 TAM; diğerleri yalnızca bu alanlar + durum:'kilitli'
                    kartlar:[{ primm:'Tahmin et'|'Çalıştır'|'İncele'|'Değiştir'|'Yap', baslik, metin /*≤60 kelime*/, kod? }],
                    ornekKod:'…', dene:{ baslangic:'…', hedefCikti:'…', cozum:'…' },
                    sorular:[{ id:'1.1-s1', tip:'Kavram Sorusu'|'Çıktı Tahmini'|'Hata Avı'|'Kod Yazma', metin, kod?, rubrik:[{ ad:'Doğruluk', agirlik:50 },{ ad:'Tamlık', agirlik:30 },{ ad:'Açıklık', agirlik:20 }],
                               anahtarlar:[…], ornekIyiCevap, zayifCevap, xpTaban:30 }],
                    gorev:'meydan-saati'|… }]
DATA.gorevler  = [{ id:'meydan-saati', ad:'Meydan Saati', tip:'Tamamlama'|'Sıralama'|'Sıfırdan'|'Hata Bildirimi'|'İş Emri'|'Semt Sınavı'|'Günlük Tekrar', semt, dersId:'1.1', kosul, odul:{ xp:60, bayt:40 }, acilisSeviye:1, ruhsat:true|false,
                    editor?:{ baslangicKod, testler:[{ id, girdi, beklenen, desen?:'regex dizesi (kodda EŞLEŞMELİ)', yasak?:'regex dizesi (kodda EŞLEŞMEMELİ)' }], ipuclari:{ pusula, fener, taslak, ornek }, cozum } }]   // 12+; dört Çarşı Ruhsat görevinin (Meydan Saati, Dakikadan Saate, Kademeli Karar, Taksimetre) `editor` alanı TAM
DATA.otopark   = { publicTestler:[{ id, dakika, beklenen, etiket? }], gizliTestler:[…], referansKod, templateKod, sozlesme:[{ madde, kural }], hasanIstegi:'(KANON §5.1 birebir)',
                   netlestirmeSorulari:[{ id, soru, cevap, madde }] /*8*/, keskinGoz:{ soru, cevap }, savunmaSorulari:[{ id, soru, satirIpucu, anahtarlar:[…] }] /*4*/,
                   ipuclari:{ pusula, fener, taslak, ornek }, sikayetler:{ kategoriAnahtari:'…balon metni…' }, yaygınHatalar:[…] }
DATA.isletmeler = [{ id:'otopark', ad:'Otopark', semt:'carsi', seviye:3 /*açılış seviyesi*/, fiyat:300, gelirSaat:9.2 /*L1 B/saat*/, seviyeSayisi:5, konu:'…', durum:'mvp'|'insaat', musteri:'Hasan Abi' }]   // KANON §5'in ilk 8'i en az
DATA.magaza    = [{ id, ad, kategori:'kiyafet'|'aksesuar'|'emote'|'esya'|'tabela'|'oda', nadirlik:'Sıradan'|'Şık'|'Nadir'|'Premium'|'Nişan', fiyat, para:'bayt'|'cip', onizleme:{ tur:'prop'|'avatar', anahtar }, rotasyon?:bool }]   // 24+, 5 nadirlik
DATA.liderlik  = { haftalik:[{ ad, seviye, xp, avatar:{…state.avatar şekli} }] /*12*/, kalicilik:[…], hizliOtopark:[{ ad, sure }], kazancliIsletme:[{ ad, gelir }] }
DATA.tekrar    = [{ id, dersId, tip:'coktan'|'kisa', soru, secenekler?:[…], dogru, aciklama }]    // 15+
DATA.sohbet    = { meydan:[{ ad, metin, saat }], hazirCumleler:[…], arkadaslar:[{ ad, seviye, durum, avatar }], dm:[{ kimden, metin, saat }] }
DATA.rozetler  = [{ id:'keskin-goz', ad, aciklama, nasil, ikon }]
DATA.metinler  = { bos:{ …anahtar:'metin' }, hata:{ … }, bildirim:[…], kvkk:{ aydinlatma:'…', veli:'…' }, onboarding:[…], csHata:[{ kod:'CS1002', mesaj, aciklama }] }
DATA.seviyeHediyeleri = [{ seviye, ad, aciklama }]   // B2 §3 (kozmetik/kapasite; Bayt/Çip/XP DEĞİL)
```

Çevrimdışı yardımcılar (hepsi `KK_CORE` üyesi, saf): `cevrimdisiPuanla({soruTipi, soru, rubrik, cevap, anahtarlar})`, `sezgiselTest(kod, testler)` (Otopark), `gorevTestEt(gorevId, kod)` → `[{id, gecti, gercek}]` (Ruhsat görevleri; her testin `desen`/`yasak` ifadeleriyle), `savunmaDegerlendir({satir, aciklama, anahtarlar})` → `{kabul, gerekce}`, `kodIncele(kod)` → `[{baslik, not}]×3`, `otoparkUcret(dakika)`, `xpHesapla({taban, puan, deneme, ipucusuz})` → XP (KANON §3.3: `taban × puan/100`, ≥70'te en az %50, denediyse en az 5, 85+ ×1,2, 2. deneme ×0,8, Berrak Zihin +%15).

## 4. `state` şeması (P0 `defaultState()` ile gerçekler; anahtar adları SABİT)

```js
state = {
  v: 1, kurulumTamam: false,
  telefon: '', dogumYili: 0, veli: { durum: 'yok'|'bekliyor'|'onayli', telefon: '' },
  dil: 'csharp', ad: '',                                           // ad = takma ad
  avatar: { ten: 0, sacStil: 0, sacRenk: 0, kiyafet: 0, aksesuar: [] },   // sayısal seçenek indeksleri (ten 0–5, sacStil 0–7, sacRenk 0–5, kiyafet 0–5)
  xp: 0, bayt: 0, cip: 0,
  dersler:  { '1.1': { tamam: false, mohur: false, puanlar: {}, denemeler: {} } },   // puanlar[soruId] = son puan
  gorevler: { 'meydan-saati': { tamam: false, ipucu: 0, ipucusuz: true } },
  ruhsat:   { otopark: 0 },                                                          // 0–3
  isletmeler: { otopark: { durum: 'yok'|'satilik'|'kapali'|'deneme'|'acik'|'kararmis', seviye: 1, kod: '', netlestirme: { sorulanlar: [], maddeler: [] }, keskinGoz: false,
                           testler: { acik: [], gizli: [] }, savunma: null, kasa: { bayt: 0, sonTopla: 0 }, gelir7: [] } },
  envanter: [], giyili: { aksesuar: null, emote: [] },
  oda: { esyalar: [], ziyaretci: [], alkis: 0 },
  tekrar: { seri: 0, son: '', dondurma: 1, bugunTamam: false },
  rozetler: [],
  ayarlar: { derinDegerlendirme: false, guvenliMod: false, ses: false, bildirim: { gorev: true, seri: true, etkinlik: false } },
  bekleme: {}, itiraz: { kalan: 3 },
  ekran: {}, ui: { ekran: 'giris' },
}
```
`hizliKurulum()` örnek oyuncuyu kurar: takma ad `Deniz`, Sev. 3 (`xp: 340`), `bayt: 320`, `cip: 0`, `dersler` 1.1–1.3 `tamam+mohur`, `gorevler` meydan-saati/dakikadan-saate/kademeli-karar `tamam`, `ruhsat.otopark = 2`, taksimetre görevi AÇIK (yapılınca Ruhsat 3/3, +100 B Belediye teşviki; bakiye 320 + 80 + 100 = 500 B ≥ tapu 300 B), `isletmeler.otopark.durum='yok'`, 2 Sıradan kozmetik envanterde, `tekrar.seri = 2`. Demo çubuğundan herhangi bir ekranı seçmek, `kurulumTamam` değilse `hizliKurulum()`'u otomatik uygular (giriş akışı ekranları hariç) ve rozeti "Demo oyuncusu" gösterir.

## 5. UI yardımcı API'si (P0 uygular; tam imzalar API.md'de)

- Kayıt/yönlendirme: `KK_UI.screen(token, def)`; `go(token)` (hash'e yalnızca `[a-z-]+`), `refresh()` (geçerli ekranı yeniden çizer, kaydırmayı korur), `KK_UI.current()`, `hashDinle`. `def = { ad:'Kurul Kartı', hud:true|false, render(root, ctx), actions:{ 'ad': (el, ev) => {…} }, leave?(), selftest?: async (root, ctx) => void }` (`selftest` ekranın ana akışını programatik oynatır; fırlatırsa ekran başarısız sayılır, bkz. §8). `data-action="ad"` tıklamaları `#app` üzerinde TEK delege dinleyiciyle ekranın `actions`'ına, yoksa `KK_UI.actions`'a gider; `data-input="ad"` (input/change), `data-submit="ad"` (form; `preventDefault` otomatik). Ekran `render` içinde `root.innerHTML = …` yazar; olay bağlama gerekmez.
- Durum: `state`, `save()`, `load()`, `sifirla()`, `hizliKurulum()`.
- Geri bildirim: `toast(mesaj, tur)`; `modal({ baslik, html, butonlar:[{ ad, aksiyon, birincil, kapat }], kapatilabilir }) → { kapat() }`; `onayla(mesaj, evetAd='Evet', hayirAd='Vazgeç') → Promise<boolean>` (sayfa içi; `confirm` YOK); `award({ xp, bayt, cip, etiket }) → Promise` (HUD sayaç animasyonu + uçan etiket + seviye atlama modalı, B2 Seviye Hediyesi); `hud()`, `hudGoster(bool)`.
- Yardımcılar: `esc`, `fmt` (tr-TR), `$`, `$$`, `bekle(ms)`, `kopyala(metin) → Promise<boolean>`, `ikon(ad, boyut, sinif) → string`, `csHl(kod) → html`, `csHlSatir(kod, { vurgu:[satırNo] }) → html` (satır numaralı), `zamanKalan(sn)`.
- Çizim: `avatarSvg(av, { boyut, emote }) → string`; `ustaSvg(id, { boyut }) → string` (7 Usta + `hasan`, `mufettis`, `kurul`); `iso` ilkelleri: `iso.W=64`, `iso.H=32`, `iso.xy(gx, gy, gz, orijin)`, `iso.tile(gx, gy, renk, opt)`, `iso.blok(gx, gy, { w, d, h, renk })`, `iso.prop(tur, gx, gy, opt)` (`tur`: kutu, koltuk, masa, bitki, lamba, hali, raf, tv, yatak, kitaplik, tabela, neon, agac, bank, cesme, tram, araba, vinc, tente, led-pano, kapi, kasa, bariyer, bayrak, hediye); `walker(el, noktalar, ms)` (reduced-motion'da anında).
- Yapay zekâ: `ai.durum` (`yukleniyor|bagli|cevrimdisi`), `aiPuanla(girdi)`, `aiKodIncele(girdi)`, `aiTestSimule(girdi)`, `aiSavunma(girdi)` — hepsi `signal` kabul eder, `{…sonuc, kaynak:'claude'|'cevrimdisi'}` döndürür, çevrimdışı yedeği `KK_CORE`'dan alır; kullanım kuralları `02-artifact-briefleri.md` §E.3 (yalnızca tıklamayla çağır, otomatik yeniden deneme yok, AbortController her çağrıda yeni).

## 6. Kabuk ve CSS sözleşmesi

```html
<div id="demo-bar">…</div>                      <!-- 40px: "KodKent · Prototip" + #demo-screen + Baştan başla + Hızlı kurulum + AI rozeti -->
<div id="app">
  <header id="hud" hidden></header>
  <main id="screen" tabindex="-1"></main>        <!-- ekranlar buraya render olur (root) -->
  <div id="float-root"></div><div id="toast-root" aria-live="polite"></div><div id="modal-root"></div>
</div>
```
`html,body{height:100%}`, `#app{height:calc(100% - 40px);display:flex;flex-direction:column}`, `#screen{flex:1;min-height:0;overflow:auto}`; `100vh` YOK. Tek tema: `:root{color-scheme:dark}` ve tüm renkler açık (01-tasarim-sistemi.md §2'deki KOYU değerler + oyun tokenları). P0'ın CSS'i bileşen sınıflarını tanımlar (isimler API.md'de: `.btn`, `.kart`, `.panel`, `.chip`, `.rozet`, `.cubuk`, `.halka`, `.sekme`, `.liste`, `.sayac`, `.balon`, `.kod`, `.test-satir(.gecti/.kaldi/.hata)`, `.bos`, `.modal`, `.toast` …). Ekran CSS'i yalnızca `.scr-<token>` altındadır; renk/boşluk için tokenları kullanır. 400px'te yatay kaydırma yok, dokunmatik hedef ≥44px, 2. satıra inen HUD; `prefers-reduced-motion` altında animasyonlar kapalı.

## 7. Ekran modülü sözleşmesi

Her ekran: tek `render(root)` içinde gerçek içerik; en az bir gerçek etkileşim; yükleme/boş/hata durumları Türkçe; `state` değişimlerinde `save()`; ödül için `award()`; geçiş için `go()`. Kilitli/yetersiz koşulda NEDENİ söyle ("Sev. 3 ve Ruhsat 3/3 gerekir; şu an Sev. 2, Ruhsat 2/3"). Metinler KANON adlarıyla; sayılar KANON/B2 ile aynı. Çekirdek döngü ekranları TAM, ikincil ekranlar işlevsel ama sade (02-artifact-briefleri.md §E.2).

## 8. Selftest ve test kapıları

- `#selftest` hash'i: `99-boot.js`, her ekran için `sifirla(); hizliKurulum()` ile TAZE durum kurar, ekranı (24; galeri hariç) `root`'a render eder, tanımında `selftest` varsa `await def.selftest(root, ctx)` çağırır; `ctx = { tikla(seçici|öğe), yaz(seçici, metin) (input/textarea değerini ayarlayıp input olayı yollar), bekle(ms), bekleSecici(seçici, ms=3000) (belirene dek bekler, yoksa fırlatır), metin(seçici) }` (tıklama `data-action` delegesini gerçekten tetikler; yapay zekâ çevrimdışıdır, sonuçlar deterministiktir). Her biri için `{token, ok, ms, hata}` toplar; `window.onerror` + `unhandledrejection` hatalarını da ekler; sonucu `<pre id="selftest-out">` (JSON satırları) olarak `<body>` sonuna yazar. Kayıtsız ekran `{ok:false, hata:'kayıtsız'}` olur. `bash tools/proto_smoke.sh [dosya]` bunu headless Edge ile çalıştırıp basar.
- Her ajan teslimden önce: (1) `assemble_proto.py --out …` hatasız; (2) `python tools/check_artifact.py <çıktı> --single-theme` → PASS; (3) `node tools/proto_core_test.mjs <çıktı>` (çekirdek varsa); (4) `bash tools/proto_smoke.sh <çıktı>` — KENDİ ekranları `ok:true`; (5) `KK_H=800 KK_MH=844 KK_SH=800 bash tools/shot_all.sh <çıktı> <token> …` ile kendi ekranlarının görüntülerini al ve Read ile BAK (masaüstü 1280×800 ve mobil 400×844; taşma, üst üste binme, okunmayan yazı, boş alan, kırık görsel varsa düzelt). Görüntü için ekranın hash'le doğrudan açılması gerekir (`#kurul`): `go()` açılışta geçerli hash'i okur ve `kurulumTamam` yoksa `hizliKurulum()`'u uygular.
- Çıktı yolları: `shot_all.sh` PNG'leri OneDrive dışı WORK klasörüne yazar; yolu çıktıda söyler.
