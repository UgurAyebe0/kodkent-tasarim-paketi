# Görev: KANON v2 + çelişki listesi (baş tasarımcı / tutarlılık sorumlusu)

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · Ortam, yollar, belge kimlikleri ve yazım kuralları: `ROOT/brief/03-ajan-talimati.md` (§1–§4). Artifact aracını kullanma, soru sorma.

## Önce oku
1. `brief/03-ajan-talimati.md`, `brief/00-fikir.md`, `spec/KANON.md` (v1, TAMAMI), `spec/A-vizyon-FINAL.md` §14 (Jüri Kararları) ve §15.
2. `spec/B1 … B9` (her biri 50–120 KB; tamamını bağlama yükleme). Her belge için: (a) künye + başlık yapısı (`Grep "^## "`), (b) "Varsayımlar", "Açık Sorular", "Diğer Belgelere Bağımlılıklar", "Ek A. Sabit Önerileri" bölümlerini TAMAMEN oku, (c) aşağıdaki çapraz-kontrol konularının ilgili yerlerini Grep + Read (offset/limit) ile oku.

## Çapraz-kontrol konuları (her konuda belgelerin değerlerini yan yana koy, çelişeni bul)
1. Ders/modül sayısı, toplam saat, semt başına ders (B4 ↔ B2 pacing ve simülasyon ↔ B9 ↔ B3 maliyet)
2. XP/seviye/unvan, ders XP'si, Bayt ödülleri (KANON ↔ B2 ↔ B4 ↔ B6)
3. İşletme fiyatı/geliri/kasa/geri ödeme (KANON ↔ B2 §7 ↔ B5); Otopark L1–L5 sayıları
4. Çip paketleri/fiyatları, ARPU/dönüşüm (B2 ↔ B9)
5. AI: model adları, kota, puanlama başına ve DAU başına maliyet, p95, itiraz sayıları (KANON §9 ↔ B3 ↔ B7 ↔ B9)
6. Kurul JSON alanları (B3 ↔ B7 ↔ B8 ↔ `brief/02-artifact-briefleri.md` §E.3); Challenge Spec alanları (B5 ↔ B7); test sayıları (6+14+6)
7. API/SignalR/kuyruk/tablo adları (B7 ↔ B8 ↔ B5)
8. Ekran adları/sayısı/kimlikleri (KANON §6 ↔ B8 ↔ B1 ↔ B6), Usta/semt/NPC adları (hepsi)
9. MVP kapsamı, süre, ekip, bütçe, sürüm etiketleri v1.1/v1.2 (VİZYON ↔ B9 ↔ B6 ↔ B7 sprintleri ↔ B8)
10. Altyapı maliyeti (B7 ↔ B9); KVKK saklama süreleri (B7 ↔ B6 ↔ B9); OTP sınırları (KANON ↔ B7 ↔ B8)
11. İpucu / Berrak Zihin / Keskin Göz / Savunma / Deneme kuralları (KANON ↔ B3 ↔ B5 ↔ B8)
12. Belge kimliği atıfları: B1 ve B2'nin eski numaralaması (B3–B12) ve diğer belgelerdeki yanlış id atıfları.

## Yasal gelişme (KANON v2'de MUTLAKA ele al)
B9'un bulgusu web aramasıyla doğrulandı (haber ve hukuk bürosu özetleri; kesin hukuki görüş DEĞİL, hukuk teyidi şart): 7578 sayılı Kanun (Mayıs 2026) ve ona dayanan, 10 Ekim 2026 tarihli Resmî Gazete'de (sayı 33396) yayımlanan, 1 Kasım 2026'da yürürlüğe giren "sosyal medyada yaş sınırlaması" yönetmeliği: sosyal ağ sağlayıcıları 15 yaşını doldurmamış çocuklara hizmet veremez; yaş doğrulaması e-Devlet üzerinden alınan "yaş doğrulama belirteci" ile yapılır; mevcut hesaplar 31 Mart 2027'ye kadar doğrulanır, doğrulanmayanlar kapatılır; yaptırım küresel cironun %3'üne kadar idari para cezası; haberlere göre 15 yaş altının "oyun platformlarına" kimlik doğrulaması olmadan girmemesi de gündemde, oyun platformlarına özgü hükümler teyit edilemedi. KodKent (sohbetli, odalı sosyal şehir oyunu) bu kapsama girebilir. Kaynaklar: https://www.ntv.com.tr/gundem/15-yas-altina-sosyal-medya-yasagi-yururluge-girdi-1722359 · https://ntv.com.tr/turkiye/sosyal-medyaya-15-yas-siniri-yeni-duzenleme-resmi-gazetede-1745607 · https://www.evrensel.net/haber/6004284/15-yas-altina-sosyal-medya-yasagi-yas-dogrulamasi-zorunlu-olacak · https://webtekno.com/turkiye-15-yas-alti-sosyal-medya-yasagi-h226798.html
Bu, KANON v1 §1'deki "Hedef kitle 13–25; 13–17 veli onayı (SMS linki, 72 saat)" kararını etkiler (bu karar kurucunun sözü değil, ilk tasarım varsayımıdır). **Karar ilkesi: yasaya uyumlu tasarım.** KANON v2'de şunu bağla: asgari kayıt yaşı 15 (yapılandırma bayrağı `min_kayit_yasi=15`; hukuk teyidine göre değişebilir); yaş doğrulama adımı "e-Devlet yaş doğrulama belirteci" (resmî teknik şartname netleşene kadar soyut adım olarak tanımla); 15 altı için kayıt YOK, nazik ret + "yaşın gelince haber verelim" bekleme listesi; 13–14 için veli onaylı yol hukuk teyidine bağlı, MVP DIŞI; 15–17 için güvenli mod (B6) ve veli bilgilendirmesi korunur; hedef kitle 15–25 olur. Etkilenen belgeler (B1, B6, B7, B8, B9, prototip giriş akışı) `_KANON-v2-celiskiler.md`'ye satır satır girsin. Kurucu kararı gerektiren açık soru olarak da kaydet.

## Yap
A. **`spec/KANON.md`'yi v2 olarak YENİDEN YAZ** (parça parça; v1'in TÜM bölümleri korunur ve genişler):
- Her çelişkiyi TEK değere bağla (bölümün yanında "Karar" notu: kaynak belge + tek satır gerekçe).
- Belgelerin "Ek A" önerilerini değerlendir: sonda "Öneri | Belge | Karar (kabul/ret/değiştirilerek) | Gerekçe" tablosu. Kabul/ret ölçütü: kurucunun akışını (satın al → kodla → kazan; otopark kuralları birebir; pay-to-learn yok; Bayt satılmaz/aktarılmaz) KORU; oyunu daha öğretici/sürdürülebilir yapıyorsa kabul et. KANON v1 §5.1 (Otopark sözleşmesi ve test tablosu) DEĞİŞMEZ.
- Yeni bölümler: **§12 Müfredat ve içerik sabitleri** (modül sayısı, ders sayısı, toplam saat, semt başına ders; Çarşı 1.1–1.4 adları; test/challenge sayıları), **§13 Teknik sabitler** (API kuralı, hub'lar, kuyruklar, SLO'lar, maliyet tablosu 1k/10k/100k DAU), **§14 Ürün ve MVP sabitleri** (MVP süresi, ekip, bütçe tavanı, KPI hedefleri, sürüm etiketleri), **§15 Belge ve ekran kimlikleri** (talimat §2 ve §3 tabloları), **§16 Sayfa kapak sayıları** (Tasarım/Müfredat/Teknik/Ekranlar kapak stat kartlarının her sayısı için TEK kaynak: "ders sayısı: N — B4", "işletme: 20", "semt: 7", "MVP süresi: X — B9", "uç nokta: N — B7"…), sözlük genişletmesi, **Değişiklik Günlüğü v1→v2** (eski değer, yeni değer, gerekçe, etkilenen belgeler).
- Sürüm kuralı: sayı değişikliği v1.x, yapısal sabit (semt, imza, döngü adı, ekran adı) değişikliği v2; her değişiklik günlüğe.
B. **`spec/_KANON-v2-celiskiler.md`** yaz: tablo `# | belge | bölüm | mevcut değer/metin | KANON v2 değeri | önem (kritik/yuksek/orta/dusuk) | düzeltme önerisi`. Tüm çelişkiler, yanlış atıflar ve KANON v2 ile uyumsuz sayılar; belge başına ayrı alt başlık (B1…B9, VİZYON). Düzeltici ajanlar bunu kullanacak; satırlar tek başına uygulanabilir olsun (hangi cümle/tablo satırı, ne olacak).

## Dönüş
≤150 kelime: KANON v2 bölüm listesi, belge başına çelişki sayısı, kabul/ret edilen öneri sayısı, en önemli 5 karar.
