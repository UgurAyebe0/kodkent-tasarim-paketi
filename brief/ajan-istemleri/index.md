# Görev: MASTER-INDEX (belge mimarı / teknik yazar)

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · Ortam, belge kimlikleri, yazım kuralları: `ROOT/brief/03-ajan-talimati.md`. Artifact aracını kullanma, soru sorma.

## Önce oku
`brief/03-ajan-talimati.md`, `brief/00-fikir.md`, `spec/KANON.md` (v2; TAMAMI), `brief/02-artifact-briefleri.md` (TAMAMI: beş sayfanın zorunlu bölümleri), ardından `spec/A-vizyon-FINAL.md` ve B1…B9'un künye + başlık yapısı (`Grep "^## |^### "`) ve "Açık Sorular" bölümleri. İçerik okumana gerek yok; BAŞLIKLARI ve kimlikleri doğru, tam yazman gerek.

## Yap — `spec/MASTER-INDEX.md` yaz
1. **Yönetici özeti** (kurucu okuyacak; 1 sayfa): KodKent nedir, nasıl çalışır (çekirdek döngü), neden öğretir, nelerden oluşur (belge ve artifact listesi), MVP ne zaman/ne kadar, en büyük 5 risk ve karar.
2. **Belge haritası**: her belge (VİZYON, KANON, B1…B9) için 3 cümlelik özet + "kim okumalı" + dosya yolu + boyut.
3. **Okuma sırası**: kurucu, oyun tasarımcısı, yazılım ekibi, içerik ekibi, UI/UX ekibi için ayrı kısa yol.
4. **Üretici kopya kâğıdı** (en az 60 madde): "sabit/konu → dosya + TAM bölüm başlığı" (ör. "XP eğrisi formülü → KANON §3.2"; "Otopark referans çözümü → KANON §5.1 ve B5 §…"). Verdiğin her başlığı Grep ile DOĞRULA (var mı, yazımı aynı mı).
5. **Sayfa–spec eşleme tablosu** (EN ÖNEMLİ BÖLÜM): `brief/02-artifact-briefleri.md`'deki beş sayfanın (A Tasarım, B Teknik, C Müfredat, D Ekranlar, E Prototip) her zorunlu bölümü için bir satır: `sayfa | bölüm no ve adı | okunacak kaynaklar (dosya + TAM başlık; en çok 4) | kullanılacak veri/tablo | not (ör. "wireframe bölge tablosu: B8 §x")`. Sayfa yazarları kaynağı bu tabloya bakarak bulacak; başlıkların hepsi gerçekten var olmalı (Grep ile doğrula).
6. **Açık sorular**: tüm belgelerden derlenmiş, tekilleştirilmiş, önem sırasıyla (≤25), her biri için kararı verecek kişi (kurucu/ekip/hukuk).

## Dönüş
≤100 kelime: bölümler, kopya kâğıdı madde sayısı, eşleme satır sayısı, doğrulanamayan başlık sayısı (0 olmalı).
