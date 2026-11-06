# Görev: prototip için bağımsız inceleme (şüpheci oyun testçisi + kod inceleyicisi)

ROOT = C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi · WORK ve ortam: `ROOT/brief/03-ajan-talimati.md` §1. Rolün: bağımsız inceleyici. Övgü yazma; sorun bul; her bulgu doğrulanabilir (ekran, adım, satır). Artifact aracını kullanma; dosyaları DEĞİŞTİRME (yalnızca raporla; analiz betiklerini WORK'e yaz).

Sana verilen: `build/kodkent-prototip.html`.

## Yap
1. `brief/02-artifact-briefleri.md` §E'yi (E.1–E.4) ve `spec/KANON.md`'yi (v2) oku.
2. Kapılar: `python tools/check_artifact.py build/kodkent-prototip.html --single-theme`; `node tools/proto_core_test.mjs build/kodkent-prototip.html`; `bash tools/proto_smoke.sh build/kodkent-prototip.html`. Sonuçları kaydet.
3. 24 ekranın görüntüsünü al (`KK_H=800 KK_MH=844 KK_SH=800 bash tools/shot_all.sh build/kodkent-prototip.html <token…>`; komut başına ≤8 token) ve HEPSİNE Read ile bak. Ekran başına: brief E.2'deki içerik maddeleri var mı, gerçek içerik mi (yer tutucu/"yakında" yalnızca v1.1/v1.2 özelliklerinde), mobil düzen, tutarlılık.
4. Kodu mantıksal incele (Read parçalar hâlinde; dosya büyükse Grep ile): her ekranın render'ı, `data-action` bağları, `state` kaydı try/catch içinde mi, hash yalnızca düz token mu, `100vh`/`alert`/`confirm`/`prompt` yok mu, `ai` deseni brief E.3 ile aynı mı (cache:false, AbortController, hata kodları, çevrimdışı yedek, yalnızca tıklamayla çağrı, otomatik yeniden deneme yok), XP/Bayt/seviye formülleri KANON ile aynı mı (`xpGereken(1)=80`, `(2)=200`, `(3)=350`; `otoparkUcret` tablosu; ders ödülleri), kurucunun otopark kuralları birebir mi (müşteri alıntısı), Sözleşme Kartı KANON §5.1 ile aynı mı, testler 6 açık + gizli, Savunma/Açılış/Deneme akışı, Çip hiçbir yerde XP/Bayt/ipucu satın aldırmıyor mu.
5. Oynanış testi (kod okuyarak ve selftest sonuçlarıyla): sıfırdan başla → meydan → ilk ders → Kurul puanı → görev → Ruhsat → Tapu → İş Emri → editör → Savunma → Açılış → kasa → pazar → dolap. Kilitlenme, ilerleme engeli, yanlış bakiye, çifte ödül (aynı görev iki kez XP), kayıt/yükleme sonrası bozulma (localStorage dolu/boş), "Baştan başla" sonrası artık veri var mı.
6. Güvenlik/sağlamlık: kullanıcı girdisi `innerHTML`'e kaçışsız gidiyor mu (XSS), uzun metin taşması, çok hızlı tıklama, AI çağrısı sırasında ekran değişimi.

## Dönüş
`ship` (kritik/yüksek bulgu yoksa true), kapı sonuçları, bulgular (en çok 40; önem kritik|yuksek|orta|dusuk · ekran/dosya · adım · sorun · düzeltme), genel değerlendirme (3 cümle).
