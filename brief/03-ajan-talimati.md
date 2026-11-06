# KodKent — Alt Ajan Ortak Talimatı

> KodKent tasarım paketini üreten TÜM alt ajanların ilk okuyacağı dosyadır. Görevin ayrıntısı sana verilen istemde; ortam, belge sahipliği, sabit şemalar ve yazım kuralları burada. Bu dosya ile istemin çeliştiği yerde istem kazanır; KANON ile başka herhangi bir belge çeliştiği yerde KANON kazanır.

## 1. Ortam ve yollar

- **Proje kökü (OneDrive içinde).** Windows: `C:\Users\uuray\OneDrive\Masaüstü\Aİ-Oyun\kodkent-tasarim-paketi`. Read/Write/Edit/Glob/Grep için `C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi/...`. Bash (Git Bash) için `/c/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi/...`.
  - `brief/` kurucu fikri, tasarım sistemi, artifact briefleri, ortak kütüphane (`shared.js`, `shared.css`), logo
  - `spec/` tasarım belgeleri (`A-vizyon-*`, `KANON.md`, `B1…B10`, `MASTER-INDEX.md`)
  - `build/` HTML artifact çıktıları
  - `tools/` denetleyici ve ekran görüntüsü araçları
- **WORK klasörü (OneDrive DIŞINDA).** Windows/Read/Write: `C:/Users/uuray/AppData/Local/Temp/claude/C--Users-uuray-OneDrive-Masa-st--A--Oyun/7f8a7e11-0061-462a-aaf8-e2ec7e91569b/scratchpad` · Bash: `/c/Users/uuray/AppData/Local/Temp/claude/C--Users-uuray-OneDrive-Masa-st--A--Oyun/7f8a7e11-0061-462a-aaf8-e2ec7e91569b/scratchpad`. Geçici dosyalar, dotnet denemeleri (bin/obj), ekran görüntüleri BURAYA gider; proje klasörüne çöp yazma.
- **Kurulu araçlar:** .NET SDK 10.0.300 (`dotnet`), Node v24 (`node`), Python 3.14 (`python`), Microsoft Edge (headless; `tools/shot_all.sh`).
- **Kabuk:** Bash aracı Git Bash'tir (Unix sözdizimi; `/dev/null`; Windows yolları `/c/...`). Dosya okumak/yazmak/aramak için Read/Write/Edit/Grep/Glob kullan; kabuğu yalnızca `dotnet`, `node`, `python`, `ls`, `wc` gibi çalıştırma işleri için kullan.
- **Yasaklar:** Artifact aracını KULLANMA, hiçbir şey yayınlama. Kullanıcıya soru sorma; karar ver ve varsayımı belgele. `spec/KANON.md`, `spec/A-vizyon-*`, `brief/*` dosyalarını DEĞİŞTİRME (salt okunur); yalnızca sana verilen çıktı dosyalarını yaz.

## 2. Belge kimlikleri ve sahiplik

Atıflarda YALNIZCA bu kimlikleri kullan. (`B1` ve `B2` ilk yazıldığında farklı bir numaralama kullanmıştı; oradaki B3–B12 atıfları eskidir, bu tablo geçerlidir ve ayrıca düzeltilecektir.)

| id | Dosya (`spec/`) | Konu | Bu belgenin SAHİBİ olduğu kararlar |
|---|---|---|---|
| KANON | `KANON.md` | İsim ve sayı sabitleri | BAĞLAYICI; her sayı ve ad aynen kullanılır |
| VİZYON | `A-vizyon-FINAL.md` | Birleştirilmiş vizyon | Ürün yönü, çekirdek döngü, ilk 30 dakika |
| B1 | `B1-dunya-sehir.md` | Dünya & şehir (HAZIR) | Şehir ızgarası, semt görselleri, Akademi içi, Oda, işletme arsası görünümü, avatar, Usta görünüşü ve ağzı, zaman/mevsim, instance modeli |
| B2 | `B2-ilerleme-ekonomi.md` | İlerleme & ekonomi (HAZIR) | XP eğrisi, ödül/musluk/gider sayıları, işletme ekonomisi, pasif gelir formülü, kozmetik fiyatları, simülasyon |
| B3 | `B3-egitim-ai.md` | Eğitim sistemi & yapay zekâ öğretmen | Ders anatomisi, soru tipleri, rubrik, **Kurul JSON şeması**, istem şablonları, Sokratik akış, kalibrasyon, itiraz, anti-cheat, AI maliyet modeli |
| B4 | `B4-mufredat.md` | C# müfredatı | **Ders listesi ve kimlikleri**, modül sayısı, toplam saat, Çarşı 1.1–1.4 tam içeriği, Semt Sınavları, Ders Mührü/Telafi Turu, Günlük Tekrar algoritması, kavram→işletme eşlemesi |
| B5 | `B5-isletmeler-kod.md` | İşletmeler & kod projeleri | **Challenge Spec formatı**, işletme kataloğu ayrıntısı, Otopark L1–L5, test vakaları, referans çözümler, gerçek `dotnet` çıktısı |
| B6 | `B6-gorevler-sosyal-liveops.md` | Görevler, sosyal, canlı operasyon | Görev kataloğu, etkinlikler, sezon, lonca, sohbet/moderasyon basamakları, liderlik, retention |
| B7 | `B7-backend-mimari.md` | Backend mimarisi & veri modeli | Servis/modül yapısı, **veri modeli ve DDL**, **API uç noktaları**, SignalR, kuyruklar, sandbox altyapısı, auth/KVKK, DevOps, monorepo |
| B8 | `B8-istemci-ui.md` | İstemci, oyun motoru, ekranlar | İstemci teknolojisi, render, 24 ekran + HUD spesifikasyonu, bileşenler, animasyon, erişilebilirlik |
| B9 | `B9-urun-yol-haritasi.md` | Ürün, MVP, yol haritası | Rakipler, persona, MVP kapsamı, yol haritası, ekip, bütçe, KPI, risk |
| B10 | `B10-ek-tamamlayici.md` | Ek: prototip örnek veri seti ve eksikler | (sonra yazılır) |
| İNDEKS | `MASTER-INDEX.md` | Belge haritası, kopya kâğıdı | (sonra yazılır) |

**Çakışma kuralı:** Aynı konu iki belgede geçiyorsa SAHİBİ tanımlar; diğeri id ile atıf yapar ve tekrar etmez ("ayrıntı: B5 §Otopark L1"). Sahibi olmadığın bir sayıya ihtiyaç duyarsan önce sahibinin belgesine bak (diskte varsa); yoksa KANON/VİZYON değerini kullan; o da yoksa kendin öner ve "(Bx önerisi)" diye işaretle.

## 3. Sabit şemalar ve adlandırmalar (alan adları değişmez)

**Kurul çıktısı (JSON; sahibi B3).** Prototip ve backend aynı şemayı kullanır:

```json
{
  "puan": 0,
  "olcutler": [
    {"ad": "Doğruluk", "puan": 0, "not": "tek cümle gerekçe"},
    {"ad": "Tamlık",   "puan": 0, "not": "…"},
    {"ad": "Açıklık",  "puan": 0, "not": "…"}
  ],
  "geri_bildirim": "1 doğru + 1 eksik + 1 sonraki adım, ≤80 kelime, isimle hitap",
  "takip_sorusu": "kısa Sokratik soru ya da boş dize",
  "guven": 0.0,
  "kopya_suphesi": false
}
```
Doğruluk 0–50, Tamlık 0–30, Açıklık 0–20, `puan` 0–100 tam sayı, `guven` 0–1.

**Challenge Spec (JSON; sahibi B5).** Üst düzey alanlar: `id, isletme, seviye, baslik, musteri_istegi, sozlesme_karti[], imza, iskelet_kod, public_tests[], hidden_tests[], seeded_tests{kural,adet}, edge_cases[], ipucu_merdiveni{pusula,fener,taslak,ornek}, savunma_sorulari[], rubrik{}, odul{xp,bayt}`; test nesnesi `{id, girdi, beklenen, etiket}`. Challenge kimliği biçimi: `otopark-L1`, `bufe-L1`, `kargo-deposu-L1` (Türkçe karaktersiz kebab-case slug + seviye).

**API (sahibi B7).** Taban yol `/v1`; İngilizce çoğul kaynak adları, kebab-case (`/v1/lessons/{lessonId}`, `/v1/grading/submissions`, `/v1/businesses/{businessId}/runs`); Bearer JWT; SignalR hub'ları `/hubs/world` ve `/hubs/chat`. B7 henüz diskte yoksa bu kuralla adlandır ve "(ad B7 ile hizalanır)" notu düş.

**Kimlikler.** Ders `1.1`, `1.2`, … (modül.sıra); modül `M1`, `M2`, …; semt slug'ları `carsi, liman, atolyeler, kampus, finans-bolgesi, veri-vadisi, bulut-tepesi`; işletme slug'ları KANON §5 adlarından (`otopark, bufe, manav, kargo-deposu, balik-hali, oto-yikama, gumruk, oto-tamirhane, mobilya-atolyesi, trafo-merkezi, kutuphane, sinema, haber-ajansi, banka, sigorta, borsa-panosu, hastane-kayit, otel, yemek-siparis-platformu, sehir-uygulamasi`).

**Ekran kimlikleri (hash token; KANON §6 sırasıyla 24 ekran).** `giris, dil-sec, avatar, meydan, harita, akademi, derslik, kurul, atolye, sokak, is-emri, editor, savunma, panel, metro, tekrar, oda, dolap, pazar, vitrin, profil, liderlik, sohbet, ayarlar`. HUD ekran değil, sabit katmandır (`hud`).

## 4. Yazım kuralları (tüm .md çıktıları)

1. **Dil:** Türkçe; teknik terimler İngilizce kalabilir. KANON'daki adlar (Bayt, Çip, XP, Kurul, Usta, Savunma, Müfettiş…) aynen kullanılır. Ürün adı her yerde **KodKent**.
2. **Somutluk:** sayılar, tablolar, formüller, isimler, örnek metinler, gerçek kod. Genel geçer tavsiye ve dolgu cümle yok. Derinlik örneği: `spec/B2-ilerleme-ekonomi.md` (bir bölümünü oku; bu düzeyi tut).
3. **KANON sadakati:** KANON'daki her sayı/ad aynen kullanılır. Değiştirilmesini istediğin bir sabit varsa gövdede "(Bx önerisi)" etiketiyle ayrı tut ve belge sonundaki **Ek A**'ya yaz; onaylanana kadar KANON geçerlidir.
4. **Belge başı:** B2'deki gibi bir künye tablosu (belge id, sürüm v1, tarih 2026-11-02, rol, bağlayıcı kaynaklar, kapsam) ve gerekiyorsa terim notu.
5. **Belge sonu (zorunlu, bu sırayla):** `Varsayımlar`, `Açık Sorular` (en çok 10, önem sırasıyla), `Diğer Belgelere Bağımlılıklar` (hangi bölüm hangi belgeden ne bekliyor), `Ek A. Sabit Önerileri (KANON v2 adayları)` — tablo: `anahtar | KANON v1 değeri (yoksa "yok") | önerilen değer | gerekçe`.
6. **Uzun dosya yöntemi:** Tek seferde dev bir Write DENEME. Önce Write ile iskelet (başlıklar + künye), sonra her bölümü Edit ile (örn. sondaki `<!-- DEVAM -->` işaretini "bölüm + işaret" ile değiştirerek) ekle; her Edit en çok ~250 satır. Bitince işareti sil. Tablolar, kod blokları (`csharp`, `sql`, `json`) ve formüller kullan.
7. **Atıflar:** başka belgeye `B5 §3` gibi id + bölüm numarası/adıyla; KANON bölümlerine `KANON §5.1` gibi.
8. **Son mesajın** (dosya yazıldıktan sonra) ≤150 kelimelik bir özet olsun: dosya yolu ve boyutu (`wc -c`), bölüm sayısı, ana kararlar, çözemediğin boşluklar. Uzun içerik özetlemeye çalışma; içerik dosyadadır.
