# KodKent — Belge Sayfası Yazarı Talimatı (tasarim · teknik · mufredat · ekranlar)

> Dört belge sayfasını (`build/kodkent-tasarim.html`, `-teknik.html`, `-mufredat.html`, `-ekranlar.html`) yazan ajanların ortak yöntemidir. Prototip (`kodkent-prototip.html`) farklıdır: `04-prototip-sozlesmesi.md`. Sayfanın İÇERİĞİ `02-artifact-briefleri.md` içindeki kendi bölümündedir (zorunlu bölümler, SIRAYLA, hepsi dolu); bu dosya YÖNTEMİ anlatır.

## 1. Önce oku (bu sırayla)
1. `brief/03-ajan-talimati.md` — §1 ortam/yollar, §4 yazım kuralları.
2. `brief/00-fikir.md`, `brief/01-tasarim-sistemi.md` (TAMAMI; sayfa sözleşmesi bağlayıcı), `brief/02-artifact-briefleri.md` (YALNIZCA kendi bölümün).
3. `spec/KANON.md` (isim ve sayılar bağlayıcı; çelişirse KANON kazanır) ve varsa `spec/MASTER-INDEX.md` içindeki "üretici kopya kâğıdı".
4. Kütüphane API'leri: `brief/shared.js` (başlık yorumu + `KK.barChart/lineChart/stepChart/hlCs/wireCode/buildToc`), `brief/shared-diagram.js` (başlık yorumu: `KK.flow/sequence/wire/wirePair/gantt/metro/iso`), `brief/shared.css` (hazır sınıflar: `.grid .stats .card .stat .callout .badge .sev .tablewrap .terminal .timeline .steps details.acc .chat .bubble blockquote.musteri figure .diag`) ve `tools/make_skeleton.py` içindeki EXTRA_CSS (`.cover .docbox .src-list .kv`). Kütüphaneyi YENİDEN YAZMA, iskeleti elle kopyalama.

## 2. Parça düzeni (çakışmasız, paralel yazıma uygun)
Sayfa `build/parts/<anahtar>/` altındaki PARÇA dosyalarından birleştirilir (`python tools/assemble_doc.py <anahtar> [--out YOL]`): çatı (title, token bloğu, ortak CSS/JS, üst şerit + belge ailesi, içindekiler, alt bilgi) `tools/make_skeleton.py`'den gelir; sen yalnızca parça yazarsın.
- `NN-ad.html` — bir bölüm (veya bir bölümün bir parçası): `<section id="düz-token">` + `<h2>`… `<style>`/`<script>`/iskelet etiketi İÇERMEZ. Dosyalar adına göre sıralı birleşir; `NN` 2 haneli sıra numarasıdır (`01-kapak.html`, `02-vizyon.html` …). Kendi numara aralığın sana verildiyse yalnızca onu kullan.
- `NN-ad.css` — sayfaya özel CSS (yalnızca tokenlar; literal renk yok).
- `NN-ad.js` — sayfaya özel JS: veriyle grafik/diyagram çağrıları (`KK.lineChart(document.getElementById('c-xp'), {...})`). Veriler JS dizisinde; SVG'yi elle koordinatla çizme. Her grafik/diyagram için bölümde `<figure><div id="…"></div><figcaption>…</figcaption></figure>` kabı bırak.
- Başlıklar: bölüm `<section id="düz-token">` + `<h2>`; alt başlıklar `<h3>`; `KK.buildToc` içindekileri bunlardan kurar. Belge ailesi bağlantıları (`href="#"`, `data-doc`) çatıdadır, dokunma.
- Test için birleştir: `python tools/assemble_doc.py <anahtar> --out "$WORK/<anahtar>-<ajan>/kodkent-<anahtar>.html"` (WORK: 03 §1). Tek yazarlı sayfada nihai dosyayı `--out`suz üret (`build/kodkent-<anahtar>.html`); birden çok yazar varsa nihai dosyayı koordinatör üretir.

## 3. Yazma yöntemi — bölüm döngüsü
Tüm spec'leri bağlama yükleme. Her zorunlu bölüm için: (a) kaynağını oku (Grep ile başlığı bul, Read `offset/limit` ile ilgili kısmı oku; spec'ler 50–120 KB olabilir); (b) bölümü kendi parça dosyasına Write et (bir dosya ≈ 10–40 KB; uzunsa `NNa-…`, `NNb-…` diye böl, gerekirse Edit ile ekle); tablolar spec'teki GERÇEK satırlarla (uydurma yok; eksikse KANON ile tutarlı tamamla ve dönüş notuna yaz); (c) sonraki bölüm. Her 3–4 parçada bir `assemble_doc.py` + `check_artifact.py` çalıştır (hata birikmesin). Bölümleri brief'teki SIRAYLA yaz ve HEPSİNİ yaz; "başlık var, içerik yok" kabul edilmez.

## 4. İçerik ve biçim kuralları
- Dil Türkçe; emoji yok; lorem/TODO/"buraya gelecek" yasak; adlar ve sayılar KANON'dan aynen. Okuyucuya hitap: kısa etkin cümleler.
- Sayfa başında `.docbox` ("Bu belge ne anlatır, kim okumalı" 1 paragraf), sonunda "Kaynak belgeler" (`.src-list`, spec id'leri: B1…B9, KANON, VİZYON), "Açık sorular" ve gerekiyorsa "Sözlük".
- Tablolar `<div class="tablewrap"><table>` içinde, gerçek `<thead>/<tbody>`, sayı hücreleri `class="num"`. Kod `<pre class="code" data-lang="cs|sql|json|txt"><code>` (HTML kaçışı: `<` → `&lt;`). Yaygın etiketler: `.badge` (`accent amber coral mint violet cobalt`), önem için `<span class="sev kritik|yuksek|orta|dusuk"></span>` + metin.
- Diyagram kuralları (01 §6): mekanizmayı çiz, adını değil; OKLARI ETİKETLE; her `<figure>` tek iddia taşıyan `<figcaption>` içerir; kutu metni kısa. `KK.flow` ile mimari/ERD(`rows`)/topoloji/akış, `KK.sequence` ile sıra diyagramı, `KK.wirePair` ile wireframe (B8'in bölge tablolarındaki x,y,w,h değerleri AYNEN), `KK.gantt`, `KK.metro`, `KK.iso` (uzaktan yakına çiz: gx+gy artan) kullan. Kütüphane yetmeyen yerde elle SVG yaz (viewBox, `role="img"`, `aria-label`, token renkleri, `currentColor`/`var(--…)`, ok uçları `<marker>`).
- Grafikler (01 §5): form önce (büyüklük → çubuk, zaman → çizgi, basamak → `stepChart`); çift eksen YOK; ≥2 seri → lejant (KK ekler); seri renkleri `--s1..--s6` sabit sırayla; her grafikte tablo görünümü (KK ekler).
- Belge sayfaları açık+koyu çalışır; yalnızca tokenlar. 400px genişlikte yatay sayfa kaydırması YOK (geniş tablo/diyagram kendi kabında kayar).
- Metin yoğunluğu: brief'teki kelime hedefi için spec içeriğini ÖZETLEYEREK değil, okuyucu için DÜZENLEYEREK aktar: tablo + kısa açıklama + örnek. Aynı içeriği iki bölümde tekrarlama; ilgili bölüme bağlantı ver (`#id`).

## 5. Kalite kapıları (teslimden önce, sırayla)
1. `python tools/check_artifact.py <birleştirilmiş dosya>` → `RESULT PASS` (her FAIL giderilir).
2. `bash tools/shot_all.sh <birleştirilmiş dosya> <bolum-id> <bolum-id> <bolum-id>` (en önemli 3–4 bölüm; PNG'ler OneDrive dışı WORK klasörüne yazılır, yolu çıktıda söyler). PNG'leri Read ile AÇ ve BAK: masaüstü açık, masaüstü koyu, mobil ve bölüm görüntüleri; taşma, üst üste binen etiket, kırık/çok küçük diyagram, boş alan, kontrast, tema hatası, yarım kalan grafik varsa düzelt ve tekrar çek.
3. Tüm `#` bağlantılarının hedef `id`'si var mı (içindekiler + metin içi); grafik tablo görünümleri açılıyor mu.
4. Dosya boyutu hedefi: belgeler 250–900 KB (>1,5 MB olmasın).

## 6. Dönüş
≤150 kelime: parça listesi, birleştirilmiş dosya yolu ve bayt, bölüm id listesi, denetleyici sonucu, ekran görüntüsü yolları, spec'te bulamayıp kendin tamamladığın yerler (known_gaps), kalan eksikler. Artifact aracını KULLANMA; yayınlamayı koordinatör yapar. `spec/` ve `brief/` dosyalarını DEĞİŞTİRME.
