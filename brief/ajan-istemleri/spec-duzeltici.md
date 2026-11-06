# Görev: spec belgesi düzeltmesi (KANON v2 hizalaması)

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · Ortam, belge kimlikleri, yazım kuralları: `ROOT/brief/03-ajan-talimati.md`. Sana bir belge id'si verilecek ({DOC}: B1…B9). Artifact aracını kullanma, soru sorma.

## Önce oku
1. `brief/03-ajan-talimati.md` (§2 belge kimlikleri tablosu — GEÇERLİ numaralama).
2. `spec/KANON.md` (v2; TAMAMI — bağlayıcı).
3. `spec/_KANON-v2-celiskiler.md` içinde YALNIZCA {DOC} ile ilgili alt başlığı/satırları.
4. Düzelteceğin belge: `spec/{DOC}-*.md` — büyükse (>40 KB) tamamını bağlama yükleme: her düzeltme satırı için Grep ile yeri bul, ilgili bölümü Read (offset/limit) ile oku.

## Yap
- Çelişki listesindeki satırları EDIT ile hedefli uygula (dosyayı sıfırdan yazma; içeriği KISALTMA; iyi olan her şeyi koru). KANON v2 ile çelişen her ad/sayıyı düzelt; yanlış belge-id atıflarını talimattaki geçerli kimliklere çevir.
- **{DOC} = B1 veya B2 ise ayrıca:** bu iki belge eski bir numaralama kullandı (B1 künyesine göre: B2 çekirdek döngü, B3 ilerleme, B4 eğitim/AI, B5 müfredat, B6 işletme kataloğu, B7 görevler, B8 sosyal, B9 ekonomi, B10 teknik mimari, B11 istemci/ekranlar, B12 ürün; B2'de de benzeri karışıklık olabilir). `Grep "\bB[0-9]{1,2}\b"` ile TÜM atıfları bul, her birini bağlamdan okuyarak geçerli kimliğe çevir (çekirdek döngü → VİZYON §3; ilerleme/ekonomi → B2; eğitim/AI → B3; müfredat → B4; işletme/kod → B5; görev/sosyal/liveops → B6; backend/teknik → B7; istemci/ekran → B8; ürün/yol haritası → B9). Belirsiz atıfta içerik adını yaz. "Diğer Belgelere Bağımlılıklar" ve "Açık Sorular" bölümlerini yeni kimliklerle güncelle; künyedeki eşleme notunu kaldır/düzelt.
- Kabul etmediğin bir satır varsa uygulama; belge sonuna `Revizyon Notları` bölümü ekle: uygulanan satır numaraları (çelişki listesindeki `#`), reddedilenler + gerekçe, ve KANON v2'ye eklenmesi gereken bir şey fark ettiysen "KANON'a öneri" satırı.

## Dönüş
≤100 kelime: uygulanan/reddedilen satır sayısı, kalan sorun.
