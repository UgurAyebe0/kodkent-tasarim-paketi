# Görev: belge sayfası için bağımsız inceleme (şüpheci inceleyici)

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · WORK ve ortam: `ROOT/brief/03-ajan-talimati.md` §1. Rolün: bağımsız, titiz ve şüpheci inceleyici (kıdemli frontend + içerik editörü). Övgü yazma; sorun bul; her bulgu doğrulanabilir olsun (bölüm id / ekran görüntüsü / satır). Artifact aracını kullanma. Dosyaları DEĞİŞTİRME (yalnızca raporla); analiz betiklerini WORK altına yaz.

Sana verilen: sayfa anahtarı ({tasarim|teknik|mufredat|ekranlar}) ve birleştirilmiş dosya yolu.

## Yap
1. `brief/02-artifact-briefleri.md` içindeki kendi sayfa bölümünü oku (zorunlu bölümler SIRAYLA), `brief/01-tasarim-sistemi.md`'yi (sözleşme), `spec/KANON.md`'yi (v2) oku.
2. `python tools/check_artifact.py <dosya>` çalıştır ve çıktıyı kaydet.
3. `bash tools/shot_all.sh <dosya> <bolum-id> <bolum-id> <bolum-id>` ile 3 temel + 3 bölüm görüntüsü al (diyagram/grafik içeren ve en uzun bölümleri seç); HEPSİNE Read ile BAK: taşma, üst üste binen etiket, okunmayan küçük metin, kırık/boş diyagram, grafik ölçeği/lejant, koyu tema kontrastı, mobil düzen, boş alan, yarım kalan bölüm.
4. Dosya 250–900 KB olabilir: TAMAMINI Read etme. Bir Python betiği yaz (WORK): `<section id>` listesi + bölüm başına kelime sayısı, tablo/figür/kod bloğu/grafik kabı sayısı; boş veya <120 kelimelik bölümler; `lorem|TODO|buraya gelecek|XXX|undefined|NaN` taraması; her `<figure>`'da `<figcaption>`; her tablo `.tablewrap` içinde mi; `href="#…"` hedeflerinin `id` karşılığı; `KK.*Chart/flow/sequence/wirePair/gantt/metro` çağrılarının kap `id`'lerinin sayfada var olması; KANON'dan 15+ değeri (semt adları, Usta adları, fiyatlar, XP, seviye tavanı 60, para birimleri Bayt/Çip, otopark kuralları birebir, kur 10 TL = 1 B, sayfa kapak sayıları KANON §16) Grep ile karşılaştır.
5. Brief'teki ZORUNLU bölümlerin hepsi var mı ve dolu mu ("başlık var, içerik yok" = kritik)? Spec'ten gelen tabloların satır sayıları spec ile uyumlu mu (örnek: Müfredat ders tablosu B4'teki ders sayısı kadar satır mı; Ekranlar 24 ekran; Teknik uç nokta sayısı)? Türkçe yazım/terim tutarlılığı; aynı içeriğin tekrarı; spec'te olmayan uydurma sayı şüphesi.
6. Sayfa-özel kontroller: Tasarım — izlenebilirlik tablosu, çekirdek döngü diyagramı, XP grafiği, 30 günlük simülasyon (3 seri + lejant + tablo), Gantt; Teknik — en az 10 ADR, 8+ diyagram okların etiketli olması, ERD kutu sayısı, DDL bloklarının `data-lang="sql"` olması, JSON örnekleri geçerli JSON mu (betikle `json.loads`); Müfredat — filtre kontrolleri (`#f-modul`, `#f-ara`) çalışıyor mu (JS mantığını oku), metro haritası, otopark bölümü (müşteri alıntısı birebir, test tabloları, referans çözüm, gerçek çalıştırma çıktısı), stepChart işaretleri; Ekranlar — 24 ekran bölümü ve her birinde wireframe çifti, 6 mockup, HUD ölçüleri, ikon seti (≥24), bileşen kütüphanesi iki temada.

## Dönüş (kısa, yapılandırılmış)
`ship` (kritik/yüksek bulgu yoksa true), denetleyici sonucu, bulgular (en çok 30; her biri: önem kritik|yuksek|orta|dusuk · yer · sorun · uygulanabilir düzeltme), genel değerlendirme (3 cümle), bölüm başına kelime tablosu özeti.
