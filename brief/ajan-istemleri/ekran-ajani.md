# Görev: prototip ekran ajanı (P1 / P2 / P3 / P5)

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · WORK ve ortam: `ROOT/brief/03-ajan-talimati.md` §1. Rolün: kıdemli oyun arayüzü mühendisi. Sana verilen istemde ROL kodun (P1/P2/P3/P5), EKRANLARIN, çıktı dosyaların ve ek kaynakların yazar. Artifact aracını kullanma, soru sorma. Başkasının parçasını DEĞİŞTİRME (eksik/yanlış bulursan `build/proto/NOTLAR.md` sonuna "İstek: …" satırı ekle).

## Önce oku
1. `brief/03-ajan-talimati.md` (§1, §4); `brief/04-prototip-sozlesmesi.md` (TAMAMI: dosya düzeni, state şeması, DATA şekilleri, ekran sözleşmesi, test kapıları).
2. `build/proto/API.md` (TAMAMI; P0'ın GERÇEK imzaları — sözleşmeden farkı varsa API.md kazanır) ve P0'ın kodundan ihtiyacın olanlar: `ui/00-base.js`, `ui/20-iso.js`, `css/10-components.css` (sınıf adları ve davranış için; kodu yeniden yazma, KULLAN), `build/proto/NOTLAR.md`.
3. `brief/02-artifact-briefleri.md` §E (E.1–E.4) — özellikle E.2'de KENDİ ekranlarının maddeleri ve E.3 (ai deseni).
4. `spec/KANON.md` (v2): §6 ekranlar, §3–§4 XP/ekonomi, §8 tipler, §9 AI sabitleri + ekranlarının dokunduğu bölümler. `spec/B8-istemci-ui.md`: KENDİ ekranlarının bölümleri (amaç, yerleşim, wireframe bölgeleri, bileşenler, durumlar, etkileşimler, veri, mobil, mikro etkileşimler) — `Grep` ile başlıkları bul, offset/limit ile oku. İstemde sayılan ek kaynak bölümlerini oku.
5. Veri: `KK_CORE.DATA` (sözleşme §3) — `build/proto/core/*.js` dosyalarında P4 yazıyor; diskte varsa ilgili parçayı oku. Henüz yoksa sözleşmedeki şekle göre kodla ve P0'ın `core/98-stub.js`'iyle dene; teslimden önce `core/99-export.js` oluştuysa gerçek veriyle yeniden dene (yoksa `sleep 240` ile en çok 6 kez bekle ve tekrar bak).

## Yap
- `ui/<NN>-ekran-<grup>.js` (+ gerekirse `a/b` parçalar) ve `css/<NN>-ekran-<grup>.css` yaz (NN istemde verilir). Her ekranı `KK_UI.screen('<token>', { ad, hud, render(root), actions, selftest })` ile kaydet; kendi yardımcılarını IIFE içinde tut; CSS yalnızca `.scr-<token>` altında ve tokenlarla.
- İçerik KANON/B8/B4/B5/B6 ile aynı ADLAR ve SAYILAR; metinler TÜRKÇE ve gerçek (lorem yok). Çekirdek döngü ekranları TAM, ikincil ekranlar işlevsel ama sade; her ekranda en az bir GERÇEK etkileşim; yükleme/boş/hata durumları; kilitli/yetersiz koşulda NEDENİ söyle. Durum değişimi `state` + `save()`; ödül `award()`; geçiş `go()`.
- Yapay zekâ çağrıları (Kurul puanı, Usta Yorumu, test simülasyonu, Savunma) YALNIZCA düğmeye tıklayınca, `ai` API'siyle (AbortController, "Durdur", hata kodları, çevrimdışı yedek); otomatik yeniden deneme YOK.
- 400px'te yatay kaydırma yok, dokunmatik hedef ≥44px, HUD 2 satır; `prefers-reduced-motion`; klavyeyle kullanılabilir (odak görünür, düğmeler `<button>`), form kontrollerinde `id`; `alert/confirm/prompt` YOK (`onayla()` kullan); hash yalnızca `[a-z-]+`.
- Her ekran için `selftest(root, ctx)` yaz (sözleşme §8): ekranın ana akışını programatik oynat (ör. `kurul`: cevap yaz → gönder → çevrimdışı puan kartı görünür ve `state.xp` arttı; `editor`: örnek çözümü yükle → testleri çalıştır → 6/6; `pazar`: ürün al → bakiye düştü, envantere girdi). Başarısızlıkta `throw new Error('…')`.

## Kalite kapıları (teslimden önce, sırayla)
1. `python tools/assemble_proto.py --out "WORK/proto-<rol>/kodkent-prototip.html"` hatasız.
2. `python tools/check_artifact.py "<çıktı>" --single-theme` → `RESULT PASS`.
3. `bash tools/proto_smoke.sh "<çıktı>"` → KENDİ ekranların `ok:true` (selftest dâhil), konsol hatası yok.
4. `KK_H=800 KK_MH=844 KK_SH=800 bash tools/shot_all.sh "<çıktı>" <token> <token> …` → her ekranın masaüstü (1280×800) ve mobil (400×844) PNG'sini Read ile AÇ ve BAK; taşma, üst üste binme, okunmayan yazı, boş/kırık alan, tutarsız oyun hissi varsa düzelt ve tekrar çek (en az bir görsel iyileştirme turu).

## Dönüş
≤150 kelime: yazılan dosyalar + bayt, ekran başına tek satır durum (TAM/sade), selftest sonucu, sözleşmeden sapmalar ve NOTLAR.md'ye yazdığın istekler.
