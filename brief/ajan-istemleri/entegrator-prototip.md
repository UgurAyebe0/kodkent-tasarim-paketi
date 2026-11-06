# Görev: prototip entegrasyonu ve düzeltme (entegratör)

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · WORK ve ortam: `ROOT/brief/03-ajan-talimati.md` §1. Rolün: kıdemli oyun arayüzü mühendisi. Artifact aracını kullanma, soru sorma. TÜM `build/proto/` parçalarını düzenleme yetkin var (başkalarının parçaları dâhil); ama çalışan kısımları bozma, hedefli Edit yap.

## Önce oku
`brief/04-prototip-sozlesmesi.md`, `build/proto/API.md`, `build/proto/NOTLAR.md` (ajanların istekleri), `brief/02-artifact-briefleri.md` §E (E.1–E.4), `spec/KANON.md` (v2 §6 ekranlar).

## Yap
1. `python tools/assemble_proto.py` (resmî çıktı: `build/kodkent-prototip.html`). Hata varsa parçaları düzelt.
2. `python tools/check_artifact.py build/kodkent-prototip.html --single-theme` → PASS; `node tools/proto_core_test.mjs build/kodkent-prototip.html` → "tüm çekirdek testleri geçti"; `bash tools/proto_smoke.sh build/kodkent-prototip.html` → 24 ekranın hepsi `ok:true`, konsol/betik hatası 0. Her başarısızlığı kök nedene kadar düzelt (CSS çakışması, iki ajanın aynı global adı, eksik veri alanı, yanlış hash, kayıtsız ekran …).
3. NOTLAR.md'deki her isteği uygula ya da gerekçeyle reddet.
4. Tüm ekranların görüntüsü: `KK_H=800 KK_MH=844 KK_SH=800 bash tools/shot_all.sh build/kodkent-prototip.html giris dil-sec avatar meydan harita akademi derslik kurul atolye sokak is-emri editor savunma panel metro tekrar oda dolap pazar vitrin profil liderlik sohbet ayarlar` (her komutta ≤8 ekran; PNG'ler WORK'e yazılır). HER PNG'ye Read ile BAK: taşma, üst üste binme, okunmayan yazı, kırık görsel, HUD tutarsızlığı, ekranlar arası stil kayması, mobil (400×844) düzen. Bulduklarını düzelt.
5. Uçtan uca akış kontrolü (okuyarak ve selftest ile): giriş → dil → avatar → meydan → akademi → derslik → kurul (çevrimdışı puan, XP) → atölye (Taksimetre, Ruhsat 3/3) → sokak (Tapu 300 B) → iş emri (4 soru) → editör (testler, Müfettiş) → savunma → açılış → panel (kasa topla) → pazar (satın al) → dolap (giy) → oda. Kopuk geçiş, kilitlenme (oyuncunun ilerleyemeyeceği durum), tutarsız bakiye/XP varsa düzelt. Otopark kuralları birebir; sayılar KANON v2 ile aynı.
6. AI yolu: `ai` modülü brief E.3 desenine uygun mu (use('sample'), json, modelTier, cache:false, AbortController, hata kodları, yalnızca tıklamayla, otomatik yeniden deneme yok); `window.claude` yokken çevrimdışı yedek sorunsuz çalışıyor mu.
7. Boyut ≤ ~700 KB hedef (16 MB sınır); `100vh`, `alert/confirm/prompt`, harici kaynak yok.

## Dönüş
≤150 kelime: resmî dosya boyutu, her kapının sonucu, düzelttiklerin (özet), açık kalan sorunlar.
