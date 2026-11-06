# KodKent Prototipi — P0 Temel Katman API'si

> Gerçek imzalar bu dosyadadır (sözleşmeyle fark varsa BU DOSYA kazanır). Kaynak: `ui/00-base.js` (durum, yönlendirme, HUD, toast, modal, ödül, yardımcılar, `kodEditor`), `ui/10-ai.js`, `ui/20-iso.js`, `css/00-base.css` + `css/10-components.css`, `sprite.html` (76 ikon). Canlı örnek: `#galeri` (ve `#galeri-ikon`, `#galeri-avatar`, `#galeri-usta`, `#galeri-iso`, `#galeri-etkilesim`).
> Birleştirme: `python tools/assemble_proto.py --out "$WORK/proto-<ajan>/kodkent-prototip.html"`. Parçalarda `'use strict'` ve `</script` yazma; `alert/confirm/prompt`, `100vh`, harici kaynak, `<iframe` YOK.

## 1. Ekran yazmanın en kısa yolu

Dosyan `ui/NN-ekran-….js` olur; her şey bir IIFE içinde kalır, yalnızca `KK_UI.screen(...)` çağrısı dışarıya çıkar. CSS'in `css/NN-ekran-….css`'te yalnızca `.scr-<token>` altındadır.

```js
(function () {
  KK_UI.screen('tekrar', {
    ad: 'Günlük Tekrar',            // KANON adı
    hud: true,                      // false: HUD gizli (Giriş akışı)
    render(root, ctx) {             // root = #screen; innerHTML yaz, olay bağlama GEREKMEZ
      root.innerHTML = '<div class="sayfa sayfa-dar"><h1>Günlük Tekrar</h1><div class="kart">' +
        '<p>Seri: ' + sayacHtml('alev', state.tekrar.seri) + '</p>' +
        '<button type="button" class="btn btn-birincil" data-action="basla">Başla</button></div></div>';
    },
    actions: {                      // data-action="basla" → burası; yoksa KK_UI.actions['basla']
      async basla(el, ev) {
        state.tekrar.bugunTamam = true; save();
        await award({ xp: 15, bayt: 20, etiket: 'Günlük Tekrar', kaynak: el });   // state'e EKLER, HUD'u canlandırır
        refresh();                  // geçerli ekranı yeniden çizer (kaydırma korunur)
      }
    },
    leave() { /* ekrandan çıkınca (isteğe bağlı) */ },
    async selftest(root, ctx) {     // isteğe bağlı: ekranın ana akışını programatik oynat; fırlatırsan ekran başarısız sayılır
      await ctx.tikla('[data-action="basla"]');
      if (!state.tekrar.bugunTamam) throw new Error('Günlük Tekrar tamamlanmadı');
    }
  });
})();
```

`render(root, ctx)` içindeki `ctx` ve `selftest(root, ctx)` içindeki `ctx` aynı nesnedir (bkz. §10).

## 2. Yönlendirme ve olaylar

| İmza | Açıklama |
|---|---|
| `KK_UI.screen(token, def)` | Ekranı kaydeder. `token` yalnızca `[a-z-]+`. `def = { ad, hud, render(root, ctx), actions, leave?(), selftest?(root, ctx) }`. `render` söz (Promise) döndürebilir. |
| `go(token, opt?)` / `KK_UI.go` | Ekrana gider (hash `#token`). `opt.parametre` → hedef ekranın `ctx.parametre`'si. Geçersiz ad → `false`. Selftest sırasında gezinmez, hedef `ctx.gidilen()` ile okunur. |
| `refresh()` / `KK_UI.refresh` | Geçerli ekranı yeniden çizer (`leave` + `render`), kaydırma ve odaklı girdi korunur, HUD'u da tazeler. Yazı yazılan bir girdi varken ÇAĞIRMA (değer kaybolur). |
| `KK_UI.current()` | Geçerli ekranın token'ı. |
| `KK_UI.aralik(fn, ms)` / `KK_UI.gecikme(fn, ms)` | `setInterval` / `setTimeout`; ekrandan çıkınca ve `refresh`'te KENDİLİĞİNDEN temizlenir (sayaç/OTP/3 dk gibi zamanlayıcılar için bunları kullan). |
| `KK_UI.actions` | Ekran `actions`'ında bulunmayan `data-action` adlarının genel yedeği. |
| `KK_UI.hatalar` | Yakalanan betik/eylem hataları `{ tur, mesaj, kaynak }`; `#selftest` bunları raporlar. |

Tek delege dinleyici `#app` üzerindedir (HUD, ekran, modal içi dâhil):

| Öznitelik | Davranış |
|---|---|
| `data-action="ad"` | tıklama → `actions[ad](el, ev)`. `<a>` için `preventDefault` otomatik. Devre dışı (`disabled`, `aria-disabled="true"`) öğe tetiklemez. `button` olmayan öğede (`div`, `tr`…) `tabindex="0"` ver: Enter/Boşluk tıklama sayılır. |
| `data-go="token"` | tıklama → `go(token)` (kısayol; `data-action` varsa o kazanır). |
| `data-input="ad"` | metin girdilerinde `input`, `select`/onay kutusu/radyo/dosya/tarih/renkte `change` → `actions[ad](el, ev)`. |
| `data-submit="ad"` | `<form data-submit>` gönderilince `actions[ad](form, ev)`. TÜM `form` gönderimlerinde `preventDefault` otomatiktir. |

Hata: eylem fırlatırsa `KK_UI.hatalar`'a yazılır ve Türkçe hata toast'ı çıkar (selftest'te `ctx.tikla` bunu fırlatır).

## 3. Durum

```js
state   // şema: brief/04 §4 AYNEN; yerinde değiştirilir (başvurular geçerli kalır)
```

| İmza | Açıklama |
|---|---|
| `save()` → bool | `state`'i `localStorage`'a yazar (hata yakalanır). Her `state` değişiminden sonra çağır. |
| `load()` → bool | Kaydı yükler; eksik anahtarlar `defaultState()` ile tamamlanır. Açılışta `99-boot.js` çağırır. |
| `sifirla()` | Kaydı siler, `state`'i `defaultState()` yapar (ardından `go('giris')` de). |
| `hizliKurulum()` | Örnek oyuncu **Deniz**: Sev. 3 (340 XP), 320 B, 0 Çip, Çarşı 1.1–1.3 `tamam+mohur` (puanlar 88/76/92), görevler meydan-saati/dakikadan-saate/kademeli-karar tamam, `taksimetre` açık, `ruhsat.otopark = 2`, 2 Sıradan kozmetik envanterde, `tekrar.seri = 2`, `kurulumTamam: true`, `ui.demo: true` (demo çubuğu "Demo oyuncusu" gösterir). |
| `dersKaydi(id)` / `gorevKaydi(id)` / `isletmeKaydi(id)` | `state.dersler[id]` / `state.gorevler[id]` / `state.isletmeler[id]`; yoksa varsayılan şekille OLUŞTURUR ve döndürür. |
| `seviyeBilgi(xp?)` | `{ seviye, kalan, gereken, toplamBaslangic, unvan, yuzde }` (`xp` verilmezse `state.xp`). |
| `KK_UI.siradakiGorev()` → `{ ad, ekran, sayi }` | HUD görev kartı: Ruhsat görevleri → dersler → Otopark Tapusu → Günlük Tekrar. İstersen üzerine yaz. |
| `KK_UI.hedef()` → `{ metin, yuzde }` | HUD hedef çubuğu ("Hedef: Otopark · 320/300 B · Ruhsat 2/3 · Sev. 3/3"); işletme durumuna göre değişir. |
| `defaultState()` | Taze `state` nesnesi. |

`state.ekran[token]` ekranın kendi verisi içindir; ortak alanlara yalnızca sahibi ekran yazar.

## 4. Geri bildirim, ödül, HUD

| İmza | Açıklama |
|---|---|
| `toast(mesaj, tur='bilgi', sureMs?)` → `{ kapat() }` | `tur`: `bilgi\|basari\|uyari\|hata` (en çok 3 görünür; tıklayınca kapanır). Örn. `toast('Ruhsat 3/3!', 'basari')`. |
| `modal(o)` → `{ kapat(deger), el, govde, guncelle(html), kapandi:Promise }` | `o = { baslik, html, ikon, butonlar:[{ ad, aksiyon, birincil, tehlike, kapat:false, veri }], kapatilabilir:true, genis, sinif, onKapat(deger) }`. `aksiyon`: fonksiyon `(modal, btn)` ya da `data-action` adı; `false` döndürürse kapanmaz. Varsayılan buton `[{ ad:'Tamam', birincil:true }]`. Esc, dış tık ve X kapatır; odak içeride kalır, arka plan `inert`. Gövdeye `data-action` koyabilirsin. |
| `onayla(mesaj, evetAd='Evet', hayirAd='Vazgeç')` → `Promise<boolean>` | Sayfa içi onay (`confirm` YOK). Düğmeler: `[data-veri="onayla-evet"]` / `[data-veri="onayla-hayir"]`. |
| `award({ xp, bayt, cip, etiket, kaynak })` → `Promise<{ seviyeAtladi, eskiSeviye, yeniSeviye, unvanTerfisi, yeniUnvan }>` | `state`'e EKLER (ayrıca `state.xp += …` YAPMA), `save()` eder, HUD sayaçlarını canlandırır, uçan etiket gösterir (`kaynak`: etiketin çıkacağı öğe). Seviye atlanırsa **seviye modalı** açar (unvan terfisinde "Yeni unvan: Kalfa"; Seviye Hediyesi kartı Bayt/Çip/XP İÇERMEZ) ve modal kapanana kadar sözü bekletir. Negatif değer düşer. |
| `harca({ bayt, cip, etiket, kaynak })` → boolean | Yeterliyse düşer + HUD canlanır → `true`; yoksa Türkçe uyarı toast'ı → `false`. |
| `konfeti({ adet })` | Düşen konfeti (reduced-motion'da çalışmaz) — Açılış/Mühür için. |
| `seviyeHediyesi(L)` | `{ seviye, ad, aciklama }`: B2 §3.2 kuralı (`L mod 5`); `DATA.seviyeHediyeleri` varsa o kullanılır. |
| `hud()` / `hudGoster(bool)` | HUD'u state'ten çizer / gösterir-gizler. `state` değiştirince `hud()` çağır (award/harca/go kendisi yapar). Mobilde 2 satır + hedef çubuğu. |

HUD: sol avatar halkası (XP) + ad + unvan, XP çubuğu, Bayt/Çip sayaçları, sağda Görev (rozetli), Pazar, Liderlik, Sohbet, Ayarlar; avatara tıklayınca `profil`.

## 5. Yardımcılar

Saf dizge üreticileri (DOM'suz; belge sayfalarında da kullanılabilir): `esc`, `fmt`, `ikon`, `csHl`, `csHlSatir`, `zamanKalan` (kaynakta `//#SAF-BASLA … //#SAF-BITIR` bloğu; dokunma).

| İmza | Açıklama |
|---|---|
| `esc(s)` | HTML kaçışı. Kullanıcı metnini `innerHTML`'e HER ZAMAN `esc` ile ver. |
| `fmt(n, d=0)` | tr-TR sayı: `fmt(1234.5, 1)` → `1.234,5`. |
| `$(sel, kok?)` / `$$(sel, kok?)` | `querySelector` / dizi döndüren `querySelectorAll`. |
| `bekle(ms)` → Promise | Selftest kipinde en çok 20 ms (sahte "yükleniyor" gecikmelerin için bunu kullan). |
| `kopyala(metin)` → `Promise<boolean>` | Panoya kopyalar (tıklama içinde çağır); `kopyala(x).then(ok => toast(ok ? 'Kopyalandı' : 'Kopyalanamadı', ok ? 'basari' : 'uyari'))`. |
| `ikon(ad, boyut=20, sinif='')` → svg | `ikon('coin', 24)`. Çizgi ikonlar `currentColor`'dur (rengi üst öğenin `color`'ı belirler). Liste: §12. |
| `csHl(kod)` → html | C# renklendirme (`.k .s .n .c .t`); hiçbir `<span>` satır sonunu aşmaz. |
| `csHlSatir(kod, { vurgu:[satırNo], baslangic:1 })` → html | Satır numaralı gövde; `<pre class="kod kod-no"><code>` içine koy (ya da `kodHtml`). |
| `zamanKalan(sn)` | `90` → `01:30`; `3725` → `1 sa 02 dk`; `200000` → `2 gün 7 sa`. |
| `sayacHtml(tur, deger, { kucuk, baslik })` | Hap sayaç: `tur` `bayt\|cip\|xp\|alev`. İçindeki sayı `data-sayac` taşır (award animasyonu için). |
| `cubukHtml(yuzde, { tur, ince, kalin, sessiz, etiket })` | İlerleme çubuğu; `tur`: `xp\|bayt\|nane\|mercan\|cip`. |
| `halkaHtml(yuzde, { boyut=96, tur, metin, alt, etiket })` | Dairesel halka (SVG); `tur`: `mor\|nane\|amber\|mercan`; `metin` ortadaki sayı, `alt` küçük etiket ("PUAN"). |
| `chipHtml(metin, tur, ikonAd)` | `tur`: `turkuaz\|amber\|mercan\|nane\|mor\|kobalt\|gri`. |
| `isletmeDurumHtml(durum)` | KANON §8 durumu şekil + metinle: `yok\|satilik\|kapali\|deneme\|acik\|kararmis`. |
| `bosHtml({ ikon, baslik, metin, buton:{ ad, aksiyon, sinif }, hata })` | Boş/hata durumu kartı. `yukleniyorHtml(mesaj)`, `hataHtml(mesaj, { baslik, tekrar:'aksiyon', tekrarAd })`. |
| `kodHtml(kod, { vurgu, satirNo=true, baslik })` | Salt okunur renkli kod bloğu (başlık şeridi dâhil). |
| `testSatirHtml({ ad, durum:'gecti'\|'kaldi'\|'hata'\|'bekliyor', girdi, beklenen, gercek, hata })` | Test satırı (ikon + rozet + ayrıntı). |
| `balonHtml(metin, { tur:'ben'\|'usta'\|'sistem', ad, kuyruk })` | Sohbet balonu. |

## 6. kodEditor

```js
const ed = kodEditor('#editor-kap', {          // kap: öğe ya da seçici (içeriği değiştirilir)
  kod: 'public static int UcretHesapla(int dakika)\n{\n}', // başlangıç kodu
  salt: false,                                // true: salt okunur
  vurgu: [3],                                 // işaretli satırlar (1 tabanlı)
  yukseklik: '340px', etiket: 'C# kod düzenleyici', id: 'kod-ta',
  onDegis(kod) { state.isletmeler.otopark.kod = kod; save(); }   // yalnızca kullanıcı yazınca
});
ed.getir();            // → kod metni
ed.koy(kod);           // değeri değiştirir (onDegis ÇAĞIRMAZ)
ed.odakla();
ed.vurgula([5, 6], { kaydir: true });   // satırları işaretle (null/[] temizler)
ed.el;                 // <textarea>   ed.kok // .kodedit
```

Satır numaraları, renkli altlık, Tab = 4 boşluk (Esc ardından Tab odaktan çıkarır), Shift+Tab girinti azaltır, Enter girintiyi korur (`{` sonrası +4), mobilde ≥44px `{ } ( ) ; " = +` ve Tab yardım çubuğu (5 sütunlu ızgara). Ekran yeniden çizilince editör yok olur: `render` içinde yeniden kur, kodu `state`'ten ver. `salt` editörde yardım çubuğu yoktur.

## 7. Çizim (`ui/20-iso.js`; avatar/portre/iso DOM'suz saf dizge üreticileridir)

### Avatar
```js
avatarSvg(state.avatar, { boyut: 96, kadraj: 'tam', emote: 'el-salla', golge: true, yon: 'sol', aria: 'Avatar: Deniz' })
```
`av = { ten 0–5, sacStil 0–7, sacRenk 0–5, kiyafet 0–5, aksesuar:[id…] }` (state.avatar şekli). `boyut` = yükseklik px (tam boy genişliği 0,73×). `kadraj`: `tam` (96×132) · `bust` (kare, HUD/liste) · `yuz`. `emote`: `el-salla alkisla gul dusun dans evet hayir kalp tuslama omuz`. Şapkalı aksesuarlarda (`sapka bere kasket baret kaptan`) saçın üst kısmı gizlenir.

Seçenek tabloları (Avatar Atölyesi/Dolap için): `AVATAR_SECENEK = { ten:[{ad,hex}×6], sacRenk:[{ad,hex}×6], sacStil:[{id,ad}×8], kiyafet:[{ad,tur,ust,ust2,alt,ayak,kol}×6], aksesuar:[{id,ad}×9], emote:[{id,ad}×10] }`. `avatarTarif(av)` → "Bal ten, topuz kestane saç, mor kapüşon." · `AVATAR_ORNEKLERI` → 6 hazır avatar `{ id, ad, av }`.

### Usta portreleri
```js
ustaSvg('defne', { boyut: 96, aria: 'Usta Defne' })   // defne kerem nehir baran elif selin yusuf hasan mufettis kurul
USTA_BILGI.defne  // { ad: 'Usta Defne', renk: '#F29A4A' }  (semt/Usta vurgu rengi; Kurul'un bedeni yoktur: mühürlü karttır)
```

### İzometrik ilkeller (2:1, 64×32 tile; 1 kat = `iso.KAT` = 48 px)
```js
const a = iso.alan(7, 6, { yukari: 130 });                 // 7×6 ızgara için { orijin:{x,y}, genislik, yukseklik, viewBox }
const og = a.orijin;
const ogeler = [
  { gx: 1, gy: 1, w: 2, d: 2, svg: iso.prop('hali', 1, 1, { orijin: og }) },
  { gx: 4, gy: 3, w: 1, d: 1, svg: iso.prop('koltuk', 4, 3, { orijin: og, renk: '#FF7A66' }) },
  { gx: 3, gy: 5, w: 1, d: 1, svg: iso.prop('kasa', 3, 5, { orijin: og, dolu: true }) }
];
root.innerHTML = '<div class="sahne"><svg viewBox="' + a.viewBox + '" role="img" aria-label="Oda">' +
  iso.zemin(7, 6, ['#2A3878', '#2F3F86'], { orijin: og }) + iso.sirala(ogeler) + '</svg></div>';
```

| İmza | Açıklama |
|---|---|
| `iso.W`=64, `iso.H`=32, `iso.KAT`=48 | tile ve kat ölçüleri. |
| `iso.xy(gx, gy, gz=0, orijin?)` → `{ x, y }` | hücre → ekran (B1 §1.2; `gz` kat cinsinden). `iso.hucre(x, y, orijin?)` → `{ gx, gy }` tıklamadan hücre. |
| `iso.tile(gx, gy, renk, { w, d, h, z, kenar, orijin, sinif })` | zemin karosu (elmas); `h` px kalınlık. |
| `iso.blok(gx, gy, { w, d, h, renk, z, ust, sol, sag, kenar, orijin, sinif })` | prizma; `h`/`z` px. Üst açık, sol orta, sağ koyu (ışık kuzeybatıdan). |
| `iso.zemin(cols, rows, [a, b], { orijin, kenar, h })` | dama zemin. `iso.alan(cols, rows, { yukari, kenar })` sahne ölçüsü. |
| `iso.sirala(ogeler)` | `{ gx, gy, w, d, gz, svg }` listesini derinlik anahtarıyla (`(gx+w-1)+(gy+d-1)+gz×0,001`) sıralayıp birleştirir. |
| `iso.prop(tur, gx, gy, opt)` → `<g>` | `opt = { orijin, gz, z, renk, etiket, acik, dolu }`. `etiket`: tabela/neon/led-pano metni; `acik`: lamba/tv/kapı/bariyer; `dolu`: kasa üstünde Bayt. |
| `iso.propSvg(tur, { boyut=120, zemin=true, … })` → `<svg>` | Tek başına önizleme kartı. |
| `iso.PROP_TURLERI` | `kutu koltuk masa bitki lamba hali raf tv yatak kitaplik tabela neon agac bank cesme tram araba vinc tente led-pano kapi kasa bariyer bayrak hediye` (25). `iso.PROP_META[tur]` = `{ w, d, yuk }` (ayak izi hücre, yükseklik px). |
| `onizleSvg(urun.onizleme, { boyut, av })` | Pazar/Dolap önizlemesi: `{ tur:'prop', anahtar:'koltuk' }` → prop; `{ tur:'avatar', anahtar }` → aksesuar kimliği, `kiyafet-N` ya da `emote-AD`. |
| `walker(el, noktalar, ms=600)` → `Promise<boolean>` | `el` (SVG `<g>` → `transform`, HTML → `style.transform`) `[{x,y}]` noktaları boyunca yürür (zıplayarak; `el.dataset.yon='sol\|sag'`). Yeni çağrı öncekini iptal eder (`false`); reduced-motion'da anında. |

Meydan'da tıklanan noktaya yürüme: `const p = svgNokta(ev); const h = iso.hucre(p.x, p.y, og); const hedef = iso.xy(h.gx + .5, h.gy + .5, 0, og); walker(g, [mevcut, { x: hedef.x - 25, y: hedef.y - 64 }], 600);` (tam örnek: `ui/90-galeri.js`, `gal-sahne-tikla`).

## 8. Yapay zekâ (`ui/10-ai.js`)

Desen: `brief/02-artifact-briefleri.md` §E.3 (`use('sample')` → `sample.json(istem, { modelTier, cache:false, signal })`). **Yalnızca tıklamayla çağır**; otomatik yeniden deneme YOK; öğrenci metni istemde ÜÇ TİRE arasında VERİdir. `window.claude` yoksa/izin verilmezse çevrimdışı yedek `KK_CORE`'dan gelir.

| İmza | Sonuç |
|---|---|
| `ai.durum` | `'yukleniyor'` ("Kurul: izin bekleniyor") · `'bagli'` ("Kurul: Claude bağlı") · `'cevrimdisi'` ("Kurul: çevrimdışı demo"). `aiDurumMetni()` bu metni verir; `[data-ai-rozet]` öğeleri `aiRozetGuncelle()` ile güncellenir. |
| `ai.yeniIptal()` → `AbortController` · `ai.durdur()` | Her çağrıya yeni denetleyici: `const ac = ai.yeniIptal(); aiPuanla({ …, signal: ac.signal })`; "Durdur" düğmesi `ai.durdur()`. Durdurulan çağrı `null` döndürür. |
| `aiPuanla({ usta, ders, soruTipi, soru, rubrik, cevap, ornekIyiCevap, anahtarlar, signal })` | `{ puan, olcutler:[{ad,puan,not}×3], geri_bildirim, takip_sorusu, guven, kopya_suphesi, kaynak }`. `kopya_suphesi` → puan 0. `usta` = `KK_CORE.DATA.ustalar.defne`. |
| `aiKodIncele({ kod, sozlesme, usta, signal })` | `{ maddeler:[{ baslik, not }×3], kaynak }` (Usta Yorumu). |
| `aiTestSimule({ kod, testler, sozlesme, gorevId?, signal })` | `{ sonuclar:[{ id, gercek, gecti, hata }], kaynak, etiket }`; `gecti` her zaman `gercek` ile `beklenen` karşılaştırılarak yeniden hesaplanır. `etiket` ekranda gösterilecek Türkçe açıklamadır ("Demo: testler yapay zekâ tarafından simüle edildi — gerçek üründe gVisor sandbox'ında derlenir." / "Çevrimdışı demo: sezgisel kontrol."). `gorevId` verilirse çevrimdışı yedek `KK_CORE.gorevTestEt`, yoksa `sezgiselTest`. |
| `aiSavunma({ satir, soru, aciklama, kod, anahtarlar, signal })` | `{ kabul:boolean, gerekce, kaynak }`. |

Hata durumunda sonuç ÇEVRİMDIŞI yedektir ve ek olarak `{ hataKodu, hataMesaji, tekrarDenenebilir, uyari }` taşır (`kaynak:'cevrimdisi'`). `rate_limited` ve `session_expired` toast'ını modül kendisi gösterir; `not_granted`, `sampling_disabled`, `not_declared`, `capability_disabled`, `capability_removed` yapay zekâyı kapatıp rozeti çevrimdışına çevirir; `invalid_json` için ekran "Tekrar dene" düğmesi koymalıdır (`tekrarDenenebilir`). `aiHataMesaji(kod)` Türkçe mesajı verir.

```js
async kurulGonder(el) {
  const ac = ai.yeniIptal(), s = KK_CORE.DATA.dersler[0].sorular[0];
  btnYukleniyor(el, true);                                  // kendi yardımcın: .btn.yukleniyor + disabled, "Durdur" göster
  const r = await aiPuanla({ usta: KK_CORE.DATA.ustalar.defne, ders: KK_CORE.DATA.dersler[0], soruTipi: s.tip, soru: s.metin, rubrik: s.rubrik, cevap: $('#cevap').value, ornekIyiCevap: s.ornekIyiCevap, anahtarlar: s.anahtarlar, signal: ac.signal });
  if (!r) return;                                           // kullanıcı durdurdu
  const xp = xpHesapla({ taban: s.xpTaban, puan: r.puan, deneme: 1, ipucusuz: true });
  await award({ xp, etiket: 'Kurul: ' + r.puan + '/100', kaynak: el });
}
```
## 9. Galeri ve geliştirici ekranları

`#galeri` (ve `#galeri-ikon`, `#galeri-avatar`, `#galeri-usta`, `#galeri-iso`, `#galeri-etkilesim`) geliştirici ekranıdır; demo seçicisinde ve `#selftest`te YOKTUR. `#selftest` hash'i açılışta tüm 24 ekranı taze `sifirla(); hizliKurulum()` durumuyla sırayla çizer, her ekranın `selftest`ini çalıştırır ve sonucu `<pre id="selftest-out">` olarak yazar (`bash tools/proto_smoke.sh`).

## 10. Ekran bağlamı (`ctx`)

`render(root, ctx)` ve `selftest(root, ctx)` aynı biçimde bir `ctx` alır (kaynak: `ui/00-base.js` `ekranBaglami`):

| Alan | Açıklama |
|---|---|
| `token`, `root`, `state` | Geçerli ekranın adı, `#screen` öğesi, canlı `state`. |
| `ilk` | `true`: ekrana ilk giriş (yükleniyor iskeleti göstermek için); `refresh()` sonrası `false`. |
| `parametre` | `go(token, { parametre })` ile verilen nesne ya da `null`. |
| `tikla(seçici \| öğe)` → Promise | Öğeye gerçek tıklama gönderir (`data-action` delegesi çalışır). SVG öğelerinde `click()` yoktur: `MouseEvent` ile gönderilir. Öğe yoksa/devre dışıysa ya da eylem hata verirse fırlatır. |
| `yaz(seçici \| öğe, metin)` → Promise | `input`/`textarea`/`select` değerini ayarlar, `input` + `change` olayı yollar (onay kutusu için `true/false`). |
| `bekle(ms)` | Gerçek zamanlı bekleme (global `bekle()` selftest kipinde ≤20 ms'ye sıkışır). |
| `bekleSecici(seçici, ms=3000)` → öğe | Seçici belirene dek bekler; yoksa fırlatır. |
| `metin(seçici)` | Öğenin görünen metni (`input` için `value`). |
| `gidilen()` | Selftest kipinde `go()` gezinmez; son hedef burada okunur (okuyunca sıfırlanır). |

**Çalışma kuralları.** (1) Kullanıcı metnini `innerHTML`'e HER ZAMAN `esc()` ile ver. (2) `{ad}` yer tutucusu Derslik/Kurul metinlerinde (`md()`) ve Meydan/Harita Usta repliklerinde oyuncunun takma adıyla değiştirilir; yeni metin yazarsan aynı biçimi kullan. (3) Rozet vermek için `rozetVer('keskin-goz')` (bir kez ekler, `save()` eder, toast gösterir). (4) Modal gövdesi `#modal-root` altındadır, ekran CSS kapsamı (`.scr-<token>`) dışında kalır: ekran CSS'inin modalı stillemesini istiyorsan `modal({ sinif: 'scr-<token>' })` ver. (5) Tıklanabilir SVG öğesine `tabindex="0" role="button" data-action` ver: genel klavye delegesi Enter/Boşluk'u SVG için de tıklamaya çevirir (ekranda ayrıca keydown dinleme: çift tetiklenir).

## 11. Entegrasyon eklemeleri (entegratör)

| İmza | Açıklama |
|---|---|
| `rozetVer(id)` → bool | `state.rozetler`e ekler (zaten varsa `false`), `save()` + toast. Verenler: `keskin-goz` (İş Emri), `ruhsat` + `berrak-zihin` (Atölye), `ilk-acilis` (Savunma kabulü), `seri-7` (Günlük Tekrar). |
| `demoHazirla(token)` → metin | Yalnız `state.ui.demo === true` iken ve Otopark henüz açılmamışken, demo çubuğundan ya da doğrudan `#is-emri / #editor / #savunma / #panel / #vitrin` hash'iyle gelinirse ara durumu hazırlar (Tapu, İş Emri, 26/26 test, Açık işletme) ve bilgi toast'ı çıkarır. Gerçek oyuncunun ilerlemesine dokunmaz. |
| `KK_UI.sosyal.tercihUygula()` | Ayarlar'daki erişilebilirlik tercihlerini (metin boyutu, yüksek kontrast…) açılışta uygular (`99-boot.js` `load()` sonrası çağırır). |
| Bekleme listesi | `state.bekleme[dilId]` (Dil Seçimi) ile `state.ayarlar.dilBekleme[]` (Ayarlar > Dil Kartları) iki yönlü eşitlenir. |

## 12. İkon listesi (`ikon(ad, boyut=20, sinif='')`)

`logo` · `coin` · `chip` · `xp` · `yildiz` · `alev` · `test-gecti` · `test-kaldi` · `kilit` · `kilit-acik` · `kasa` · `ev` · `harita` · `akademi` · `pazar` · `kupa` · `sohbet` · `disli` · `zil` · `tik` · `carpi` · `fener` · `pusula` · `kalem` · `oynat` · `dur` · `bayrak` · `kalkan` · `kalp` · `telefon` · `kullanici` · `kullanicilar` · `saat` · `kar` · `madalya` · `anahtar` · `bina` · `araba` · `ok-sag` · `ok-sol` · `ok-yukari` · `ok-asagi` · `bilgi` · `uyari` · `gonder` · `kopyala` · `arti` · `eksi` · `kitap` · `kod` · `goz` · `arama` · `cop` · `indir` · `yenile` · `menu` · `yildirim` · `hediye` · `kure` · `mektup` · `muhur` · `tramvay` · `defter` · `kutu` · `tebesir` · `cetvel` · `parlak` · `hedef` · `vinc` · `isik` · `cikis` · `nokta-uc` · `ses` · `gorev` · `liste` · `kutlama`

Çizgi ikonlar `currentColor`'dur; renkli olanlar (`logo`, `coin`, `chip`, `xp`, `alev`, `yildiz` …) kendi renklerini taşır. Listede olmayan ad boş sembol çizer: yeni ikon gerekiyorsa `sprite.html`e `<symbol id="i-ad">` ekle.

