# KodKent tasarım paketi — durum (3 Kasım 2026)

## Yayınlanan beş artifact (private; paylaşım sayfanın Paylaş menüsünden)
| Sayfa | Dosya | Adres |
|---|---|---|
| Oyun Tasarımı | `build/kodkent-tasarim.html` | https://claude.ai/artifact/QY4m5zhqZu7XqQGnRco2fP |
| Teknik Mimari | `build/kodkent-teknik.html` | https://claude.ai/artifact/L2CZcgYjVe1xHmyRfPg3hw |
| Müfredat ve İşletmeler | `build/kodkent-mufredat.html` | https://claude.ai/artifact/TmW4hYYgPGGuy6ED2uUF21 |
| Ekran Tasarımları | `build/kodkent-ekranlar.html` | https://claude.ai/artifact/MYRAmbncmZH8kTxGZyDVHJ |
| Oyun Prototipi (sample + downloads) | `build/kodkent-prototip.html` | https://claude.ai/artifact/6nekjMEAzdfpeaH93MKswQ |

Güncelleme akışı: spec/parça değişir → belge sayfası için `python tools/build_page.py <anahtar>` (prototip için `python tools/assemble_proto.py`) → `python tools/link_docs.py` → `python tools/check_artifact.py <dosya> [--single-theme]` → aynı dosya yoluyla yeniden yayınla (URL korunur).

## Klasörler
`brief/` fikir, tasarım sistemi, artifact briefleri, ajan talimatları, ortak kütüphane, `urls.json` · `spec/` A-vizyon, KANON v2, B1–B9 · `build/` parçalar ve nihai sayfalar · `tools/` üretim ve denetim araçları (`PAGES-README.md`).

## Kararlar
KANON v2 §12: asgari kayıt yaşı 15 (7578 sayılı Kanun + 10 Ekim 2026 yönetmeliği; hukuk teyidi ve kurucu onayı gerekir), 24 ekran, 100 ders, MVP 12 hafta.

## Cila (3 Kasım, ikinci tur) — yapıldı
- Uç nokta sayısı tek değere bağlandı: 151 = 138 temel + 6 B8 talebi + 7 Yaş Kapısı v2 (KANON §12.4, B7 §12.3, Teknik sayfa kapağı).
- Prototip: Kurul düğmesi/ipucu binmesi, Harita deniz bandı, Liderlik Haftalık Lig kuralları düzeltildi; bağımsız incelemede `load()` tip doğrulaması ve "Baştan başla" sızıntısı düzeltildi; e2e paketleri 1–7 (51 test) geçiyor; XSS, çifte ödül, Pazar bakiyesi, 15–17 Çip, ai deseni temiz.
- Ekranlar: navigasyon haritası 24 düğüm/72 ok, avatar kartları B8 §10.2 ile eşlendi, Editör A/B/C ve Pazar 1/2/Butik mockup durumları eklendi.

## Hâlâ açık
- Belge sayfaları için bağımsız inceleme turu yapılmadı (`brief/ajan-istemleri/inceleyici-belge.md` hazır); sayfalar büyük ölçüde spec'ten otomatik üretildi.
- Canlı Claude puanlaması ve indirme düğmeleri (görüntüleyici izni) denenmedi; prototip 1,08 MB; mobilde Kurul formu ilk ekranın altında.
- Ekranlar: HUD notu ızgarasında (H1–H8) küçük yerleşim bozukluğu, koyu tema yeniden bakılmadı, Pazar önizleme avatarı @zeynep_cs ile aynı değil.
- Kayıt yaşı (15) kararı: hukuk teyidi ve kurucu onayı.
