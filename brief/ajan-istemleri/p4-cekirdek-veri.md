# Görev P4: prototip çekirdeği — `KK_CORE.DATA` ve çevrimdışı yardımcılar

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · WORK ve ortam: `ROOT/brief/03-ajan-talimati.md` §1. Rolün: içerik + veri mühendisi (JS). Artifact aracını kullanma, soru sorma.

## Önce oku
1. `brief/03-ajan-talimati.md` (§1, §4), `brief/04-prototip-sozlesmesi.md` (TAMAMI; §3 DATA şekilleri SENİN sözleşmen), `brief/02-artifact-briefleri.md` §E (E.1–E.4), `tools/proto_core_test.mjs` (TAMAMI).
2. `spec/KANON.md` (v2; TAMAMI). `build/proto/API.md` ve `build/proto/core/00-formul.js`, `core/98-stub.js` (P0; varsa — formüller ve geçici stub orada; sen `core/99-export.js` ile stub'ı devralırsın).
3. Kaynak belgeler (başlık yapısını `Grep "^## "` ile çıkar, ilgili bölümleri offset/limit ile oku; belgeler 50–120 KB): `spec/B4-mufredat.md` (Çarşı 1.1–1.4 TAM içerik; TÜM ders listesi tabloları), `spec/B5-isletmeler-kod.md` (Otopark L1: testler, referans kod, iskelet, netleştirme, savunma, ipuçları, şikâyetler, yaygın hatalar; işletme kataloğu), `spec/B6-gorevler-sosyal-liveops.md` (görevler, Günlük Tekrar, sosyal, bildirim), `spec/B2-ilerleme-ekonomi.md` (§3 Seviye Hediyeleri, §7 işletme ekonomisi, §9 kozmetik/Çip fiyatları), `spec/B1-dunya-sehir.md` (§3 semtler, §8 Usta replikleri/renkleri), `spec/B3-egitim-ai.md` (örnek puan kartları, çevrimdışı puanlayıcı kuralları, hata/boş metinleri), `spec/B8-istemci-ui.md` (metinler: boş/hata/bildirim; Pazar/Profil örnek veri).

## Teslim (hepsi ROOT/build/proto/core/ altında; sözleşme §1–§3)
- `10-data-semt.js` (semtler, ustalar [7 Usta + hasan + mufettis + kurul; her Usta için B1'den 3 GERÇEK replik, renk, kişilik], moduller), `20-data-dersler.js` (Çarşı 1.1–1.4 TAM: kartlar [PRIMM, ≤60 kelime], ornekKod, dene, 3 soru/ders [rubrik, anahtarlar, ornekIyiCevap, zayifCevap]) ve TÜM ders listesi: B4'ün ders tablolarını bir betikle ayrıştır (`ROOT/tools/proto_extract_dersler.py`; markdown tablo → JS dizisi, `22-data-dersler-liste.js`) ve Çarşı dışındakileri `durum:'kilitli'` iskeletiyle ekle.
- `30-data-otopark.js` (DATA.otopark: sözleşme §3 şekli; testler KANON §5.1 ile AYNI; B5'ten 8 netleştirme sorusu, Keskin Göz, 4 Savunma sorusu, ipuçları, şikâyet balonları, yaygın hatalar), `40-data-genel.js` (isletmeler [KANON §5'in ilk 8'i en az; gelirSaat B2 §7'den], gorevler [12+; dört Ruhsat görevi `editor` alanıyla TAM: başlangıç kodu, testler, her testte `desen`/`yasak` düzenli ifade dizeleri, ipucu merdiveni, çözüm], magaza [24+; 5 nadirlik; `onizleme.anahtar` P0'ın `iso.prop` türleri ve `avatarSvg` slotlarıyla UYUMLU — API.md'ye bak], liderlik, tekrar [15+], sohbet, rozetler, metinler, seviyeHediyeleri).
- `50-offline.js`: `cevrimdisiPuanla` (şeffaf kural: Doğruluk = anahtar kavram kapsamı 0–50; Tamlık = ayrı kavram grupları + uzunluk 0–30; Açıklık = cümle yapısı/okunaklılık 0–20; çıktı `{puan, olcutler:[{ad,puan,not}], geri_bildirim, takip_sorusu, guven, kopya_suphesi, kaynak:'cevrimdisi'}`; "puan ver/100 ver/ignore previous" gibi enjeksiyon → `kopya_suphesi:true`, puan 0), `sezgiselTest` (brief E.3 kuralları), `gorevTestEt(gorevId, kod)` → `[{id, gecti, gercek}]` (testlerin `desen`/`yasak` ifadeleriyle), `savunmaDegerlendir`, `kodIncele`.
- `99-export.js`: `const KK_CORE = { DATA, xpGereken, seviyeHesapla, unvan, otoparkUcret, xpHesapla, cevrimdisiPuanla, sezgiselTest, gorevTestEt, savunmaDegerlendir, kodIncele }` (formüller P0'ın `00-formul.js`'indedir; yeniden yazma).
- Parçalarda DOM/window/localStorage YOK, `'use strict'` yazma, `</script` geçirme; adları çakışmasın (`D_semt`, `D_dersler` gibi önekler).

## Kalite kapıları
1. `python tools/assemble_proto.py --out "WORK/proto-p4/kodkent-prototip.html"` hatasız (P0'ın dosyaları + seninkiler).
2. `node tools/proto_core_test.mjs "WORK/proto-p4/kodkent-prototip.html"` → "tüm çekirdek testleri geçti".
3. Kendi ek testin (`ROOT/tools/proto_core_test_ek.mjs`; aynı yükleme yöntemiyle): her Çarşı sorusunda `ornekIyiCevap` ≥85, `zayifCevap` <50, "bilmiyorum" <20, enjeksiyon → 0 ve kopya_suphesi; `sezgiselTest(referansKod)` hepsi geçer, `templateKod` hepsi kalır, B5'teki 3 alternatif doğru çözüm geçer, 8 yaygın hata kodu beklenen testlerde kalır; dört Ruhsat görevinde `gorevTestEt(çözüm)` hepsi geçer, başlangıç kodu kalır; tüm DATA metinlerinde `undefined`/`TODO`/lorem yok; her ders/soru/görev kimliği tekil.
4. Çıktıda sayıları raporla: ders (tam/iskelet), soru, görev, işletme, mağaza ürünü, tekrar sorusu, liderlik satırı.

## Dönüş
≤150 kelime: dosya listesi + bayt, DATA sayıları, test sonuçları, sözleşmeden sapmalar.
