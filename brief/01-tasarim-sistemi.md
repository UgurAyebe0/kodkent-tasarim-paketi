# KodKent Artifact Üretim Kılavuzu — Tasarım Sistemi, Sayfa Sözleşmesi, Grafik ve Diyagram Kuralları

> Bu kılavuz, KodKent belgelerini HTML "artifact" sayfaları olarak üreten tüm ajanlar için BAĞLAYICIDIR. Sayfalar claude.ai içinde kilitli bir çerçevede yayınlanır; aşağıdaki sözleşmeye uymayan sayfa bozuk görünür.

## 0. Marka yönü (tek paragraf)
KodKent, İstanbul esinli izometrik bir "kod şehri". Görsel kimlik **İznik çinisi** paletinden türetilir: turkuaz (ana vurgu), kobalt (mürekkep/başlık), mercan (uyarı/enerji), amber (Bayt/para), nane (başarı), mor (C#/.NET kod vurgusu). Belgeler "şehir planı / imar paftası" hissinde: temiz kâğıt zemin, ince çizgi ızgaralar, kobalt mürekkep, turkuaz işaretler. Oyun arayüzü (prototip) ise yuvarlak hatlı, tombul, neşeli bir "gece şehri" HUD'u.
Yasak klişeler: krem zemin + serif + kiremit; siyah zemin + tek asit yeşili; mor-mavi gradyan hero; Inter/Space Grotesk; emoji ile bölüm işaretleme; her kutuya aynı radius+gölge; her şey ortalı.

## 1. Dosya başı (her sayfa aynen)
Sayfa, yayın anında `<!doctype html><html><head>…</head><body>` iskeletine sarılır. Bu yüzden dosyada **KESİNLİKLE** `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` etiketi OLMAZ. Dosya şu sırayla başlar:
```html
<title>KodKent Oyun Tasarımı</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
<style> … tokenlar ve tüm CSS … </style>
… içerik …
<script> … tüm JS satır içi … </script>
```
- `<title>` bir İSİM olur (2-4 kelime), açıklama değil: "KodKent Oyun Tasarımı", "KodKent Teknik Mimari", "KodKent Müfredat ve İşletmeler", "KodKent Ekran Tasarımları", "KodKent Oyun Prototipi". Tire/iki nokta ile açıklama ekleme.
- Prototip (oyun arayüzü) için font bağlantısı: `family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600`.

## 2. Renk tokenları (belgeler: açık + koyu tema) — AYNEN kopyala, sonra bileşenleri yalnızca tokenlarla boya
```css
/* Yerleşim: solda yapışkan içindekiler (≥1100px), ortada 72ch okuma sütunu, geniş tablolar/diyagramlar sütunu aşabilir (overflow-x:auto) */
:root{
  --bg:#F4F6FA; --surface:#FFFFFF; --surface-2:#E9EEF6; --surface-3:#DDE4F0;
  --fg:#18213A; --fg-2:#3A4766; --muted:#5B6786; --line:#D5DCE9; --line-2:#C3CCDD;
  --accent:#0FA3A8; --accent-ink:#0A7B80; --accent-soft:#D8F3F3;
  --cobalt:#2448B5; --cobalt-soft:#DEE5FA;
  --amber:#D98E00; --amber-ink:#9A6300; --amber-soft:#FDF0D5;
  --coral:#E8553E; --coral-ink:#B93E2A; --coral-soft:#FBE1DC;
  --mint:#1E9E5F; --mint-ink:#157746; --mint-soft:#DCF5E8;
  --violet:#6D4AFF; --violet-ink:#4E31CC; --violet-soft:#E7E1FF;
  --code-bg:#0F1730; --code-fg:#E6ECFF; --code-line:#1E2A4A;
  --shadow:0 1px 2px rgba(24,33,58,.06),0 8px 24px -12px rgba(24,33,58,.18);
  --s1:#0892A8; --s2:#C98500; --s3:#2448B5; --s4:#E8553E; --s5:#6D4AFF; --s6:#1E9E5F;
  --good:#0CA30C; --warn:#FAB219; --serious:#EC835A; --critical:#D03B3B;
  --grid:#E3E8F1; --axis:#B9C3D6;
  --font-display:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;
  --font-body:"Figtree","Segoe UI",system-ui,sans-serif;
  --font-mono:"JetBrains Mono",Consolas,"Courier New",monospace;
  --radius:10px; --radius-lg:16px;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --bg:#0D1326; --surface:#151D36; --surface-2:#1D2746; --surface-3:#26325A;
  --fg:#E8EDF8; --fg-2:#C5CEE4; --muted:#9AA7C7; --line:#2A3558; --line-2:#36446E;
  --accent:#22C9CE; --accent-ink:#5FE0E3; --accent-soft:#10353E;
  --cobalt:#7D9BFF; --cobalt-soft:#1C2A5A;
  --amber:#FFBE3D; --amber-ink:#FFD27A; --amber-soft:#3B2F12;
  --coral:#FF7A66; --coral-ink:#FFA394; --coral-soft:#3F1F1A;
  --mint:#45D98D; --mint-ink:#7FE8B3; --mint-soft:#123A2A;
  --violet:#9B86FF; --violet-ink:#BDB0FF; --violet-soft:#2A2452;
  --code-bg:#0A1024; --code-fg:#E6ECFF; --code-line:#1A2340;
  --shadow:0 1px 2px rgba(0,0,0,.3),0 8px 24px -12px rgba(0,0,0,.5);
  --s1:#16A9AE; --s2:#C98500; --s3:#3F6FE0; --s4:#E8553E; --s5:#8A6CFF; --s6:#24A868;
  --grid:#1F2A4A; --axis:#3A4870;
  color-scheme:dark;
}}
:root[data-theme="dark"]{
  --bg:#0D1326; --surface:#151D36; --surface-2:#1D2746; --surface-3:#26325A;
  --fg:#E8EDF8; --fg-2:#C5CEE4; --muted:#9AA7C7; --line:#2A3558; --line-2:#36446E;
  --accent:#22C9CE; --accent-ink:#5FE0E3; --accent-soft:#10353E;
  --cobalt:#7D9BFF; --cobalt-soft:#1C2A5A;
  --amber:#FFBE3D; --amber-ink:#FFD27A; --amber-soft:#3B2F12;
  --coral:#FF7A66; --coral-ink:#FFA394; --coral-soft:#3F1F1A;
  --mint:#45D98D; --mint-ink:#7FE8B3; --mint-soft:#123A2A;
  --violet:#9B86FF; --violet-ink:#BDB0FF; --violet-soft:#2A2452;
  --code-bg:#0A1024; --code-fg:#E6ECFF; --code-line:#1A2340;
  --shadow:0 1px 2px rgba(0,0,0,.3),0 8px 24px -12px rgba(0,0,0,.5);
  --s1:#16A9AE; --s2:#C98500; --s3:#3F6FE0; --s4:#E8553E; --s5:#8A6CFF; --s6:#24A868;
  --grid:#1F2A4A; --axis:#3A4870;
  color-scheme:dark;
}
html,body{height:auto}
body{background:var(--bg);color:var(--fg);font-family:var(--font-body);font-size:16px;line-height:1.6;margin:0;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0}
```
Kurallar:
- Her renk önce çıplak `:root`'ta tanımlanır; koyu bloklar sadece yeniden tanımlar. Bileşen CSS'inde **literal renk yok** (yalnızca `var(--…)`). Tek istisna: her iki temada koyu kalan dolgular (`--s*`, `--good`, `--critical`, `--code-bg`) üstündeki beyaz metin için `color:#FFFFFF` yazılabilir.
- Belge sayfaları iki temayı da destekler. **Prototip** (oyun arayüzü) bilinçli olarak tek tema (gece şehri) olabilir: o zaman media/`[data-theme]` blokları yazılmaz, `:root{color-scheme:dark}` ve tüm renkler açıkça yazılır, `body{background:…}` zorunlu.
- `body` arka planı mutlaka token'dan; şeffaf body YASAK.
- Sayı sütunlarında `font-variant-numeric:tabular-nums`.

## 3. Yerleşim ve duyarlılık (zorunlu)
- 400px genişlikte çalışmalı; **yatay sayfa kaydırması YASAK**. Yan boşluk `max(16px, env(safe-area-inset-*))` body'de (yukarıda var). Renkli tam genişlik bantlar varsa iç sarmalayıcıda aynı iki padding tekrar edilir.
- Flex/grid çocuklarında metin, kod veya tablo varsa `min-width:0`. Tablolar, kod blokları ve diyagramlar kendi `overflow-x:auto` kabında. `img, svg{max-width:100%}`. Ekran genişliğinden büyük `min-width` yok.
- Yapışkan başlık: `top:env(safe-area-inset-top,0px)`; ayrıca `body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--bg)}`.
- Tek ekranlık uygulama (prototip) için `html,body{height:100%}`; `100vh` KULLANMA.
- Aralıklar `gap` ile; kenar boşluğu yığınları değil. Kart stili seçici (her kutuya değil). Numaralı işaretler yalnızca gerçek bir sıra varsa.
- Sayfa yüklendiğinde her şey görünür (opacity:0 ile bekleyen bölüm yok). Hero'yu içeriğe göre boyutla, 100vh hero yok.
- `prefers-reduced-motion: reduce` altında animasyonları kapat. Klavye odağı görünür (`:focus-visible`). Her form kontrolünün sabit `id`'si var.
- Görünürlük için `el.hidden` kullan (`[hidden]{display:none!important}` iskelette var); `style.display` ile oynama.

## 4. Çerçevenin izin verdikleri / vermedikleri
- Dış script yalnızca: `https://cdnjs.cloudflare.com` (tercih), `https://cdn.jsdelivr.net/npm/`, `https://unpkg.com`; UMD build, **tam sürüm sabitlenmiş** (ör. `react/18.3.1/umd/react.production.min.js`). Dış stil yalnızca Google Fonts. Başka her şey (resim, fetch, iframe, websocket) engellenir: tüm CSS/JS satır içi, görseller `data:` URI veya satır içi SVG.
- Kütüphane gerekmedikçe kullanma. Kod renklendirme için küçük bir satır içi C# tokenizer yaz (keyword/string/number/comment/type sınıfları), highlight.js yükleme.
- `alert/confirm/prompt` çalışmaz (confirm false döner): onayları sayfa içinde kur. `window.print()` çalışmaz: Yazdır/PDF düğmesi koyma. `<a download>` ve script indirmeleri çalışmaz. `mailto:/tel:` güvenilmez. Form `submit` → `preventDefault()`. Pano: `navigator.clipboard.writeText` tıklama içinde, hata yakala.
- Mermaid diyagramları `<pre class="mermaid">` ile yerel render edilir, kütüphane yükleme; ama mimari diyagramlar için satır içi SVG tercih et (bkz. §6).
- URL hash yalnızca düz `#token` (harf/rakam/-/_); `#/yol` yok. Sekme/bölüm için `location.hash`'ı yüklemede oku.
- `localStorage` yalnızca kolaylık için, her okuma/yazma `try/catch` içinde; boş gelirse sayfa yine doğru çalışmalı.
- Boyut: dosya ≤ 16 MB; hedef belge başına ≤ 1.5 MB.

## 5. Grafik kuralları (dataviz yöntemi — kısaltılmış, bağlayıcı)
- Önce FORM: büyüklük → çubuk; zaman içinde değişim → çizgi; tek başlık sayı → stat kartı; pay → yığılı çubuk (pasta yok). **Çift eksen YASAK.**
- Kategorik seriler SABİT SIRA ile `--s1..--s6` (doğrulanmış: iki temada komşu çiftler CVD ΔE ≥ 17). Döngüye sokma; 7. seri "Diğer"e katlanır. Renk varlığı izler: filtre değişince kalanlar renk değiştirmez.
- Sıralı (ordinal: Tier 1→4, nadirlik) ve ardışık (sequential) → tek ton turkuaz rampası: açık tema `#CDEFF1 → #7FD3D8 → #0892A8 → #075F6B`, koyu tema `#0E4F55 → #12858A → #16A9AE → #9BE3E6`. Durum renkleri (`--good/--warn/--serious/--critical`) yalnızca iyi/kötü anlamında, her zaman ikon+etiketle; seri rengi olarak kullanılmaz.
- İnce işaretler: çubuk köşe 4px (taban çizgisine oturur), çizgi 2px, nokta ≥ 8px; yığılı parçalar arasında 2px yüzey boşluğu. Izgara `--grid` ince, eksen `--axis`. Metin daima metin tokenlarında (`--fg/--muted`), asla seri renginde.
- ≥2 seri → lejant zorunlu, ≤4 seri doğrudan etiketli; tek seride lejant yok (başlık adlandırır). Her değere etiket basma; seçici etiketle (uç/en yüksek).
- HTML/SVG grafik etkileşimli: çizgi/alan'da crosshair+tooltip, çubuk/nokta'da hover tooltip; isabet alanı işaretten büyük. Tablo görünümü (altında `<details><summary>Tablo</summary>…`) zorunlu.
- Ölçek: tek ölçek, her etiket gerçek bir değeri adlandırır, viewBox'ta dış etiketler için pay bırak, her şekle açık `fill`.
- Grafiği JS ile SVG'ye üret (kütüphane yok); sayıları JS dizisinden çiz, ölçeği fonksiyonla hesapla (x = padL + i*step; y = padT + (max-v)/max*h).

## 6. Diyagram kuralları (mimari, akış, ERD)
- Satır içi `<svg viewBox="0 0 W H" role="img" aria-label="…">` içinde `<figure>` + `<figcaption>` (tek iddia). Çizgi/metin/ok uçları `currentColor` (iki temada okunur); anlam taşıyan tek öğe için bir token rengi. Ok uçları `<defs><marker>` ile; **okları etiketle** ("yazar", "kuyruğa atar", "30 sn'de bir"). Metin 11-13px, kısa; açıklama caption'da. Izgaraya hizala (ortak taban çizgileri, eşit boşluk). SVG içinde `<script>/<style>/<foreignObject>` yok.
- Mekanizmayı çiz, adını değil: isteğin izlediği yol, geçilen sınır, kuyruk, hangi bileşen hangisiyle konuşuyor. Seçenek karşılaştırmasında FARKI çiz (yan yana, ekleyen/çıkaran ok).

## 7. Tipografi ve metin
- Belgeler: başlıklar `--font-display` 700/800, `text-wrap:balance`; gövde `--font-body`; kod/sayı `--font-mono`. Büyük harfli küçük etiketlere `letter-spacing:.06em`. Okuma genişliği ~72ch (geniş tablolar hariç).
- Prototip: başlık/HUD sayıları Fredoka, gövde Nunito, kod JetBrains Mono.
- Tüm metin TÜRKÇE, gerçek içerik (lorem ipsum YASAK). Emoji bölüm işareti olarak kullanılmaz; ikon gerekirse küçük satır içi SVG (16-20px, `currentColor`) veya CSS şekli. Oyun arayüzünde para/XP ikonları için basit satır içi SVG çiz (madeni para: daire + "B"; XP: yıldız/şimşek; Çip: yonga).
- Metin dili: aktif, kısa cümleler; düğme tam olarak ne olacağını söyler ("Kodu Gönder" → "Testler çalışıyor…" → "4/6 test geçti").

## 8. Sayfa iskeleti (belgeler)
- Üst şerit: KodKent logomarkı (satır içi SVG: izometrik küp/çini karosu üzerinde "K", 28px) + sayfa adı + sağda "Belge ailesi" bağlantıları (`<nav class="family">`, href'ler şimdilik `#`; her bağlantıda `data-doc="tasarim|teknik|mufredat|ekranlar|prototip"` özniteliği — yayın sonrası gerçek URL'lerle değiştirilecek).
- Sol yapışkan içindekiler (≥1100px'te görünür; altında üstte açılır/kapanır `<details>`), bölüm başlıkları `id`li (`#bolum-adi`, düz token). Aktif bölüm vurgusu IntersectionObserver ile (opsiyonel).
- Bölüm anatomisi: eyebrow (küçük büyük harfli etiket, yalnızca gerçekten sınıflandırma varsa), H2, 1-2 cümle özet, içerik (tablolar `<div class="tablewrap">` içinde), gerekiyorsa figür.
- Tablolar: `<table>` gerçek `<thead>/<tbody>`, sayılar sağa yaslı + tabular-nums, satır zebra hafif (`--surface-2`).
- Kod blokları: `<pre class="code"><code>` koyu `--code-bg` zemin iki temada da (kod alanı her zaman koyu), satır içi tokenizer ile C#/SQL/JSON renklendirme (sınıflar: `.k` keyword `#BDB0FF`, `.s` string `#7FE8B3`, `.n` sayı `#FFD27A`, `.c` yorum `#7F8DB0`, `.t` tip `#5FE0E3`). Kod alanı tek-tema olduğundan burada literal renk serbesttir.
- Alt bilgi: "KodKent tasarım paketi · Sürüm 1.0 · 2 Kasım 2026" + belge ailesi bağlantıları tekrar.

## 9. Kalite kontrol (teslimden önce ajanın kendisi çalıştırır)
`python C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi/tools/check_artifact.py <dosya.html>` (tek temalı prototip için sonuna ` --single-theme` ekle). Ekran görüntüleri için: `bash C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi/tools/shot_all.sh <dosya.html> [bölüm-id ...]` (PNG'ler OneDrive dışındaki WORK klasörüne yazılır; yolu komut çıktısı söyler).
Denetleyici: yasak iskelet etiketleri, title/meta/padding varlığı, CDN beyaz listesi, alert/print, tema blokları, lorem, açık/kapalı etiket dengesi, satır içi script sözdizimi (`node --check`), dosya boyutu. **Tüm FAIL'ler giderilmeden teslim yok.**
