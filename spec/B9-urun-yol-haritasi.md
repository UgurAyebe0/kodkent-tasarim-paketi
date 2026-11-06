# B9 — Ürün Stratejisi, MVP & Yol Haritası (KodKent)

| Alan | Değer |
|---|---|
| Belge id | **B9** |
| Sürüm | v1 (2026-11-02) |
| Sahibi / rol | Ürün yöneticisi ve kurucu ortak (edtech + oyun) |
| Bağlayıcı kaynaklar | `KANON.md` v1 (özellikle §1, §4, §5 ve "MVP'de açık" satırı, §6, §9) · `A-vizyon-FINAL.md` (§12 riskler, §13 MVP ve 12 haftalık plan, §14 jüri kararları, §15) · `A-vizyon-urun.md` (rakip, pazara giriş, ekip, maliyet, KPI) · `B2-ilerleme-ekonomi.md` (§9 Çip paketleri, §11 simülasyon, §12 pacing) · `00-fikir.md` · `03-ajan-talimati.md` |
| Hizalanan belgeler | B3 (AI maliyet modeli), B4 (ders hacmi), B5 (işletme hacmi), B6 (canlı operasyon, retention), B7 (altyapı maliyeti, epikler, ilk sprintler), B8 (ekranlar): yazım sırasında diskteki durumları §15'te ve ilgili bölümlerde işaretlidir |
| Kapsam | Rakip analizi ve konumlandırma, persona, MVP kapsamı ve başarı kriterleri, yol haritası ve sprint planı, ekip ve içerik kapasitesi, bütçe, birim ekonomi, finansman, pazara giriş, hukuki ve uyum, KPI ve analitik, risk kaydı, gelecek diller, 3/6/12 ay başarı tablosu |
| Kural | KANON'daki her sayı ve ad aynen kullanılır. Değiştirilmesi önerilen sabitler gövdede "(B9 önerisi)" etiketiyle ayrı tutulur ve Ek A'da toplanır; onaylanana kadar KANON geçerlidir. Bu belgede tek istisna, KANON'dan sonra yürürlüğe giren bir **kanundur**: hukuki zorunluluk KANON'un üstündedir ve §8.1'de ayrıca ele alınır. |

**Terim notu.** *Oyuncu* = telefon doğrulaması ve yaş kapısını geçmiş hesap; *DAU* = o gün en az bir oturum açan oyuncu; *MAU* = 30 günde en az bir oturum; *HKO* = Haftalık Kod Oyuncusu (kuzey yıldızı metriği, §9.1). *A1…A12* proje ayları (varsayım: A1 = Ocak 2027), *H1…H52* proje haftaları, *S1…S26* iki haftalık sprintler; *MVP, v1.1, v1.2, v2* sürüm adlarıdır (A-vizyon-FINAL §13, §14). **TL** bu belgede gerçek paradır (kur varsayımı 1 $ = 45 TL, A-vizyon-FINAL §15 varsayım 5); oyun içi simülasyon parası gerektiğinde "oyun içi TL" diye yazılır. Çarşı, Liman, Bayt, Çip, XP, Kurul, Usta, Müfettiş, Savunma KANON'daki anlamlarıyla kullanılır.

---

## 0. Yönetici özeti

Bu belge, KodKent'in Türkçe, gerçek C# derleyicili ve sosyal bir öğrenme oyunu olarak 52 haftada nasıl kurulacağını, hangi ekip, bütçe ve kanıtla ilerleyeceğini ve hangi risklerin işi durdurabileceğini anlatır. Okuma sırası: konum (§1–§2) → ne yapıyoruz (§3–§4) → kim ve kaça (§5–§6) → nasıl ulaşırız ve neye uyarız (§7–§8) → nasıl ölçeriz ve neyi kaybedebiliriz (§9–§10). Dokuz bulgu:

1. **Konum.** On rakipten hiçbiri Türkçe, sıfırdan başlayana, gerçek C# derleyicisiyle ve sosyal mülkiyetle birlikte öğretmiyor. KodKent 2×2 haritada sağ üst çeyreği hedefler (gerçek kod 7,0, dünya 6,5; v2'de 8,5 ve 8,0). Üç persona: lise öğrencisi Efe (15), mühendislik öğrencisi Zeynep (19), kariyer değiştiren Murat (24).
2. **Mevzuat (kritik, yeni).** 7578 sayılı Kanun ve 10 Ekim 2026 yönetmeliğiyle 1 Kasım 2026'dan beri sosyal ağ sağlayıcıları 15 yaş altına hizmet veremiyor, oyun platformları yaş derecelendirmesi, ebeveyn kontrolü ve BTK bildirimi yükümlülüğü taşıyor. KANON'un "13–17 veli onayı" modeli yetmeyebilir. Plan: **G0 (H2) yazılı hukuk görüşü**; varsayılan 15+; e-Devlet yaş belirteci ve Ebeveyn Paneli MVP'ye girer; sığmazsa MVP 12 yerine 14 hafta (§8.1, Ek A).
3. **MVP.** Çarşı + Liman, 18 ders, Otopark L1–L2, Büfe, Kargo Deposu; 21 sayısal başarı ölçütü, 5 kapı (G0–G4) ve 5 adımlı kesme çizgisi (§3).
4. **Yol haritası.** MVP (H1–H12) → v1.1 (H13–H24) → v1.2 (H25–H36) → v2 (H37–H52): 26 sprint, 12 epik, 30 iş paketi; toplam ders 18 → 46 → 62 → 84 (100'e A15'te) (§4).
5. **İçerik pisti.** 18 ders, devam eden bir oyuncuya yaklaşık 4,5 hafta yeter. B3'ün soru bankası eki yazar kapasitesini haftada ≈2,2 derse indirir; çözüm 20 günlük sözleşmeli ek yazar ve H14'ten itibaren hızlandırılmış içerik damlalarıdır; kalan duvar kod döngüsüyle (Hata Bildirimi, Düello, Staj modu) kapatılır (§5.4).
6. **Ekip ve bütçe.** 5,5 FTE'den 11,5 FTE'ye tetikleyiciye bağlı büyüme. 12 aylık gider: baz **24,5 M TL (545 bin $)**, muhafazakâr 19,5 M TL (434 bin $), iyimser 29,8 M TL (661 bin $); maliyetin %63'ü maaştır (§5–§6).
7. **Birim ekonomi (en önemli uyarı).** Baz senaryoda DAU başına gelir ≈6,6 TL/ay iken yalnızca AI maliyeti 47–77 TL'dir. B2C kozmetik geliri tek başına değişken maliyeti bile karşılamaz. Başabaş, AI ≤0,01 $/DAU/gün ve lisanslı DAU payı ≥%30 koşuluyla ≈140–275 bin DAU'da mümkündür (baz A12 DAU'sunun 50–100 katı). İlk yıl kâr için değil üç hipotezin kanıtı için finanse edilir: haftalık kod yazılıyor (HKO), kurumlar ödüyor, AI maliyeti ≤0,02 $'a iniyor (§6.4–§6.6).
8. **Ölçüm.** Kuzey yıldızı **HKO** (haftalık sunucu doğrulamalı kod olayı üreten oyuncu); 61 analitik olay, 7 pano, 11 deney (§9).
9. **Risk.** 25 riskin 6'sı `kritik`: mevzuat (R01), birim ekonomi (R02), boş şehir/D7 (R04), içerik kapasitesi (R07), çocuk güvenliği olayı (R08), finansman (R11) (§10).

**Karar bekleyen beş konu:** (a) 15 yaş sınırı ve 13–14 yaş kararı (G0, H2); (b) para kazanma ilkesine okul/kulüp lisansı eki; (c) AI maliyet yolu: lansman 0,057 → A12 ≤0,035 $/DAU/gün, Haiku-first cascade; (d) Staj modu ve Hata Bildirimi tavanı (B2 Ek A-1, A-9); (e) MVP süresinin 12 mi 14 hafta mı olduğu (H3).


---

## 1. Rakip analizi ve konumlandırma haritası

Karşılaştırma 2026-11 itibarıyla kamuya açık kaynaklardan (şirket sayfaları, mağaza listeleri, basın) derlenmiştir. Fiyatlar bölgeye, faturalama dönemine ve kampanyaya göre değişir; rakamlar büyüklük mertebesi içindir ve lansman öncesi güncellenir (§13, varsayım 12). On rakip dört gruba ayrılır: **sosyal dünyalar** (Sanalika, Habbo), **alışkanlık odaklı öğrenme** (Duolingo, Mimo, Sololearn), **gerçek kod platformları** (Codecademy, Codewars, Exercism) ve **kodla oynanan oyunlar** (CodeCombat, Screeps). KodKent bu dört grubun kesişimini hedefler; hiçbirinde Türkçe, sıfırdan başlayana, gerçek C# derleyicisiyle ve sosyal mülkiyetle birlikte öğreten bir ürün yoktur.

### 1.1 Rakip tablosu

**Tablo 1a — Kim için, nasıl öğretiyor, nasıl oynatıyor, kaça satıyor**

| Rakip | Hedef kitle | Öğrenme modeli | Oyunlaştırma | Sosyal | Fiyat |
|---|---|---|---|---|---|
| **Sanalika** | Türkiye'de çocuk ve ergen sosyal dünya oyuncuları (yaş bandı şirket verisiyle doğrulanacak) | Yok (eğlence ve sosyal) | Ev, avatar, mini oyun, koleksiyon, görev | Güçlü: sohbet, ev ziyareti, arkadaşlık | Ücretsiz giriş; sanal ürün ve Plus üyelik satışı |
| **Duolingo** | Küresel, her yaş; dil öğrenenler | 3–5 dk mikro ders, aralıklı tekrar, otomatik düzeltme, yapay zekâ özellikleri; **kod öğretmez** | Seri (streak), XP, lig, mücevher, kalp (enerji) | Arkadaş ve lig; dünya yok | Ücretsiz (reklam, kalp sınırı); Super ve Max abonelikleri (bölgesel fiyat) |
| **Codecademy** | Yetişkin kariyer değiştiren ve öğrenciler (İngilizce) | Bölünmüş ekran (ders + editör), otomatik kontrol, kariyer yolları, proje; yapay zekâ asistanı | Hafif: seri, rozet, ilerleme çubuğu | Forum; zayıf | Ücretsiz temel; Plus/Pro abonelik (Pro yıllık faturalamayla aylık ≈20 $, aylık faturalamayla ≈40 $ mertebesi; kaynaklar tutarsız) |
| **CodeCombat** | 9–18 yaş öğrenci ve sınıflar | Kodla kahramanı yönet; Python, JavaScript ve birkaç dil (C# yok) | Yoğun: RPG seviyeleri, eşya, hikâye | Çok oyunculu arena, sınıf | Ücretsiz başlangıç; premium (aylık ≈10 $ mertebesi); okul lisansı |
| **Codewars** | Orta ve ileri geliştiriciler | Topluluğun yazdığı "kata" problemleri; çözüm sonrası başkalarının çözümünü okuma; 50'ye yakın dil (C# dâhil) | Rütbe (kyu/dan), şeref puanı | Klan, forum, çözüm tartışması | Ücretsiz |
| **Exercism** | Temeli olan, gönüllü topluluk öğrenicileri | 70'ten fazla dil izi (C# dâhil); kavram egzersizleri; gönüllü mentor geri bildirimi; CLI veya tarayıcı | İtibar ve rozet; hafif | Mentor–menti | Ücretsiz (bağışla) |
| **Screeps** | 18+ deneyimli programcı oyuncular | Öğretim yok; oyun kod yazmayı şart koşar (JavaScript) | Kalıcı MMO stratejisi: kod = oyun mekaniği | İttifak, kalıcı rekabet | Tek seferlik oyun fiyatı; **satın alınan CPU** (ömür boyu açma 100–150 $ mertebesi) |
| **Mimo** | Mobil-öncelikli yeni başlayanlar (16–35) | Kısa kaydırmalı dersler, mobil editör, kariyer yolları; Python, JS, HTML, CSS, SQL ve web yığını (C# listelenmiyor) | Seri, XP, rozet | Sınırlı | Ücretsiz giriş bölümleri; Pro ≈10 $/ay, Max ≈40 $/ay (mağaza listelerine göre) |
| **Sololearn** | Mobil yeni başlayanlar ve topluluk | Kısa ders + quiz + kod oyun alanı; C# dâhil 20'den fazla dil; yapay zekâ yardımcısı | XP, seri, rozet, sıralama | Topluluk soru–cevap, yarışma | Ücretsiz katman; Pro (ABD mağazasında aylık ≈7 $, yıllık 48–80 $) |
| **Habbo** | Gençler ve genç yetişkinler (yaş politikası zamanla değişti) | Yok | Oda dekorasyonu, nadir eşya, rozet | Çok güçlü: oda, sohbet, topluluk kültürü | Habbo Credits satın alma ve Habbo Club aboneliği; tarihsel olarak oyuncular arası eşya ticareti |

**Tablo 1b — Güçlü, zayıf ve KodKent'in farkı**

| Rakip | Güçlü yön | Zayıf yön | KodKent'in farkı |
|---|---|---|---|
| **Sanalika** | Türkiye'de marka bilinirliği; 2010 sonunda 9,5 milyon kayıtlı kullanıcı (Webrazzi, Aralık 2010); 2011'deki mahkeme kararlı erişim engelinden sonra tüm kullanıcılar için cep telefonu onaylı üyeliği duyurması (telefonla kaydın yerel emsali) | Öğrenme değeri yok; çocuk güvenliği baskısı geçmişi; "parayı veren havalı" algısı; güncel metrikler açık değil | Statü satın alınmaz, kazanılır (Nişan); her nesnenin arkasında bir kod ya da öğrenme eylemi vardır; güvenli mod baştan tasarımdadır |
| **Duolingo** | Alışkanlık motoru (seri, lig), marka, ölçek | Yazılım öğretmez; kalp mekaniği ilerlemeyi bekleterek ya da parayla açtırarak kısıtlar; mülkiyet ve dünya hissi yok | Seri ve lig disiplini alınır (Günlük Tekrar, haftalık lig), ama kilit zamanla ya da parayla değil yetkinlikle açılır; her tur gerçek bir üretimle (çalışan kod) kapanır |
| **Codecademy** | Yapılandırılmış müfredat, marka, çok dil | İngilizce; izle-geç ("öğretici cehennemi") riski; TL gelirli kitle için pahalı; sosyal ve dünya yok | Türkçe hata çevirisi ve Usta; müşteri isteği bağlamı; kodun parası ve görünürlüğü |
| **CodeCombat** | Oyunun içinde kod; okul kanalında satış deneyimi | Fantezi bağlamı gerçek iş yazılımına bağlanmaz; C# yok; İngilizce ağırlıklı; kalıcı sosyal dünya yok | Otopark gibi gerçek bir müşteri isteği; C#; sosyal şehir |
| **Codewars** | Gerçek kod, geniş problem havuzu, çözüm okuyarak öğrenme | Yeni başlayana anlatım yok; bağlamsız bulmacalar; İngilizce | PRIMM rampası ve Usta; Codewars'ın "başkasının çözümünü oku" fikri Vitrin ve Kod Düellosu (v1.1) olarak alınır |
| **Exercism** | Pedagojik kalite, mentorluk, ücretsiz | Mentor bekleme süresi; CLI bariyeri; İngilizce; bağlam yok | Anında AI geri bildirimi (Kurul/Usta) ve oyun dünyası; mentorluk Kalfa Yardımı olarak v1.2'de |
| **Screeps** | "Kod = oyun" fikrinin en saf hâli; derinlik | Dik öğrenme eğrisi, sıfır öğretim, tek dil, niş; CPU satın alma performans avantajı verir | Öğretmen (Usta), kısa döngü (≈25 dk işletme kodu), satın alınabilir avantaj yok; Çip yalnızca kozmetik |
| **Mimo** | Mobilde mikro öğrenme, seri | Sığ pratik; bağlam yok; ücretli duvar; Türkçe kapsamı doğrulanmadı | "Mobilde okunur, masaüstünde yazılır" dürüstlüğü; derin proje (işletme) |
| **Sololearn** | C# dâhil; topluluk | Uygulama dilleri arasında Türkçe listelenmiyor; sığ projeler; dünya yok | Türkçe, işletme projesi, sosyal şehir |
| **Habbo** | İzometrik oda ve avatar ikonu; topluluk kültürü | Ticaret ve dolandırıcılık, çocuk güvenliği tartışmaları; öğrenme yok | Bayt transfer edilemez, ticaret ve bahis yok; öğrenme çekirdektir |

### 1.2 Konumlandırma haritası (2×2)

Harita iki eksenle çizilir. Puanlar ekip değerlendirmesidir, ±1 belirsizlik taşır ve lansman öncesi 10 kullanıcı görüşmesiyle kalibre edilir.

**Eksen ölçütleri**

| Puan | X ekseni: gerçek kodla öğrenme derinliği | Y ekseni: oyun dünyası ve sosyal mülkiyet derinliği |
|---|---|---|
| 0 | Kod yok | Yok |
| 2 | Çoktan seçmeli ya da sözde kod | Rozet, puan tablosu |
| 4 | Sınırlı editör, kısa dersler, otomatik kontrol | Lig, arkadaş, kozmetik |
| 6 | Gerçek derleme/yorumlama ve görevler; müfredat zayıf ya da yok | Avatar, ortak mekân, kozmetik, sınırlı mülkiyet |
| 8 | Gerçek derleme + yapılandırılmış müfredat + geri bildirim + proje | Kalıcı sosyal dünya, mülkiyet, ekonomi |
| 10 | Üretim düzeyi (test, dağıtım) + öğretmen | Kalıcı çok oyunculu dünya, oyuncu üretimi, canlı ekonomi |

**Koordinat tablosu (0–10)**

| Ürün | X: gerçek kod | Y: dünya ve mülkiyet | Çeyrek | Gerekçe (tek cümle) |
|---|---|---|---|---|
| **KodKent (MVP)** | 7,0 | 6,5 | Sağ üst (giriş) | Gerçek Roslyn derlemesi, 18 ders, Kurul; izometrik şehir, Oda, işletme, Vitrin; 40 avatarlık shard |
| **KodKent (v2 hedefi)** | 8,5 | 8,0 | Sağ üst | 84 ders, loncalar, Arena, 4+ semt, canlı ekonomi |
| Sanalika | 0,5 | 8,0 | Sol üst | Kalıcı sosyal dünya ve ekonomi; öğretim yok |
| Habbo | 0,0 | 8,5 | Sol üst | İkonik oda/avatar dünyası ve canlı ekonomi; öğretim yok |
| Duolingo | 1,0 | 3,5 | Sol alt | Kod öğretmez (yapı referansı); lig, seri, arkadaş var, dünya yok |
| Codecademy | 7,0 | 1,5 | Sağ alt | Gerçek editör, kariyer yolları; dünya yok |
| CodeCombat | 5,0 | 5,5 | Orta | Oyunun içinde kod, arena; fantezi bağlamı, C# yok |
| Codewars | 6,0 | 2,5 | Sağ alt | Gerçek kod, rütbe, klan; anlatım yok |
| Exercism | 7,5 | 1,0 | Sağ alt | Çok dilli, mentorlu pedagoji; oyun yok |
| Screeps | 6,0 | 8,5 | Sağ üst | Kalıcı MMO'da gerçek kod; sıfır öğretim |
| Mimo | 3,5 | 2,5 | Sol alt | Mobil mikro ders; sığ editör |
| Sololearn | 4,0 | 3,0 | Sol alt | Kısa ders ve topluluk; derin proje yok |

Haritanın okunuşu: sağ üst çeyrekte yalnızca Screeps (öğretmensiz, İngilizce, deneyimli oyuncuya) ve kısmen CodeCombat (fantezi bağlamlı) vardır. Sağ alt çeyrek kalabalıktır ama hepsi dünyasızdır; sol üst çeyrek kalabalık ve ölçeklidir ama hiçbiri öğretmez. KodKent'in iddiası, **sağ üst çeyreği yeni başlayan, Türkçe konuşan 15–25 yaş için doldurmaktır**; bunun için X ekseninde 7'nin altına (Kurul ve sandbox kalitesi), Y ekseninde 6'nın altına (Oda, işletme, tabela görünürlüğü) düşmemeliyiz. Bu iki eşik, kapalı beta görüşmelerinde (G3, 10 oyuncu) yeniden puanlanır ve altına düşersek sprint önceliği değişir.

### 1.3 Neden şimdi

1. **Yapay zekâ öğretmen artık ekonomik.** Rubrikli, yapısal çıktılı ve önbellekli bir puanlama KANON §9'a göre ≈0,0033 $; 12 etkileşimlik bir günde hedef ≈0,05 $/DAU (B3'ün lansman hesabı dört kaldıraçla 0,057 $). Birkaç yıl önce aynı kalite hem pahalı hem tutarsızdı. Sokratik soru, kriter gerekçeli puan ve itiraz hattı artık bir ürün özelliği olarak kurulabilir. (Not: bu maliyet tek başına sürdürülebilir değildir; §6.4.)
2. **Gerçek sandbox ucuzladı.** gVisor ve Roslyn bellek içi derleme ile 1.000 DAU için sandbox ≈86–150 $/ay (B7 §8.9: ≈€ 80; A-vizyon-FINAL §12: ≈150 $). "Gerçekten derlenir" sözü bir demo değil bir işletme kalemidir.
3. **Web yeterince olgun.** PWA, WebGL ve Monaco ile 4 GB RAM'li bir telefonda izometrik şehir ve masaüstünde gerçek editör mümkündür; mağaza komisyonu ve onay beklemeden ilk günden dağıtım yapılır (§8.7).
4. **"AI yazarsa kod öğrenmeye gerek var mı?" sorusu bir fırsat.** KodKent'in cevabı ürünün kendisidir: Gereksinim Netleştirme (ne istendiğini sözleşmeye dökmek), Müfettiş testlerini okumak, Hata Bildirimi ile hata ayıklamak ve Savunma'da kodu açıklamak, AI ile üretilen kodu yönetmek için de gereken becerilerdir. Rakiplerin çoğu hâlâ "sözdizimi ezberletiyor" konumunda.
5. **Türkçe boşluk açık.** Türkçe, C# odaklı, sosyal ve oyunlaştırılmış bir yazılım yolculuğu bugün yok. Ücretli bootcamp'ler on binlerce TL; TL gelirli bir 15–25 yaş kitlesi için ücretsiz ve ciddi bir alternatif talep görür. Okul ve kulüp kanalı (Teknofest, Hour of Code, üniversite toplulukları) bu talebi örgütlü hâlde taşır (§7).
6. **Çocuk güvenliği bir ürün özelliği hâline geldi.** 1 Kasım 2026'dan itibaren yürürlükteki 15 yaş sınırı, yaş doğrulama ve oyun platformu yükümlülükleri (§8.1) küçük ekipler için ağır bir yüktür; ama "güvenli tasarım" (baştan kapalı serbest sohbet, ebeveyn paneli, ticaretsiz ekonomi) veli ve öğretmen güvenini, yani dağıtım kapısını açar. Sektörde de beyan edilen yaştan doğrulanmış yaşa geçiş görülüyor (örneğin Roblox'un 2026'daki sohbet yaş kontrolleri; kamuya açık duyuru). Bu pencere, uyumu erken ve doğru yapan için kalıcı bir ayrıcalıktır.
7. **Zamanlama.** İlk açık yayın Mart 2027'ye, v1.2 Eylül 2027 okul açılışına ve Misafir Modu'yla yapılacak Hour of Code kampanyası Aralık 2027'ye denk gelir (§7.5); takvim pazarlama tesadüfü değil planlama girdisidir.

### 1.4 Rakiplerden ödünç aldıklarımız ve yapmadıklarımız

| Kaynak | Ödünç alıyoruz | Yapmıyoruz |
|---|---|---|
| Duolingo | Günlük Tekrar + seri, haftalık lig, bildirim disiplini | Kalp/enerji ile ilerlemeyi kısıtlamak ve parayla açtırmak (00-fikir §2 ve KANON §4: öğrenme paralı değil) |
| Codewars | Rütbe, başkasının çözümünü okuma (Vitrin, Kod Düellosu v1.1) | Bağlamsız bulmaca yığını |
| Exercism | İnsan mentorluğu (Kalfa Yardımı, v1.2) | CLI zorunluluğu, mentor bekleme süresi |
| CodeCombat | Okul kanalı ve öğretmen paneli (v1.1) | Fantezi bağlamı: KodKent'te kod gerçek bir dükkânı çalıştırır |
| Screeps | Kod = oyun mekaniği (gelir kodun çıktısıdır) | Satın alınabilir performans (CPU) |
| Mimo, Sololearn | Mikro ders, kart ≤60 kelime | Mobilde kod yazdırma ("mobilde okunur, masaüstünde yazılır") |
| Habbo, Sanalika | Avatar, oda, ziyaret, emote çarkı | Oyuncular arası ticaret, açık sohbet, satın alınan statü |


---

## 2. Konumlandırma ve persona

### 2.1 Konumlandırma ifadesi

> **15–25 yaş arası, yazılıma sıfırdan başlayan Türkiyeli** için **KodKent**, **gerçekten derlenen C# ile şehirde işletme çalıştırdığın, Türkçe, oyunlaştırılmış sosyal bir öğrenme oyunudur.** İzlenen bir müfredattan ya da satın alınan bir statüden farklı olarak, **kazandığın her Bayt yazdığın koddan, taktığın her Nişan becerinden gelir.**

(KANON §1 hedef kitleyi 13–25 yazar; bu belge 1 Kasım 2026'dan beri yürürlükteki yasal rejim nedeniyle 15–25'i çalışma varsayımı alır — §8.1 ve Ek A. KANON değişene kadar 13–14 yaş "koşullu"dur.)

Marka sözü KANON'daki gibidir: "Oyunlarla yazılım öğreniyorum." Tabela dili: "Kod yaz, şehrini kur." Bu sözü taşıyan üç dayanak vardır ve her kanal mesajı bunlardan birine bağlanır:

| Dayanak | Oyuncuya cümlesi | Kanıt (ürün içinde) | Kime hitap eder |
|---|---|---|---|
| **Kod gerçektir** | "Otopark kodunu Visual Studio'ya yapıştır, aynen derlenir." | Roslyn derlemesi, 26 test, Müfettiş, Türkçe CS hata tablosu | Öğrenci, öğretmen |
| **Para koddan gelir** | "Kasan senin `UcretHesapla` metodunun hesapladığı parayla dolar." | Referans tavanlı gelir, Savunma, Vitrin | Oyuncu, arkadaşları |
| **Statü kazanılır** | "Altın çerçeveli şapkayı kimse satın alamaz." | Nişan, Rütbe Rafı, Çip yalnızca kozmetik | Veli, öğretmen, oyuncu |

Hedef kitle pencereleri farklı vaat duyar: öğrenciye "ilk işletmen 70 dakikada", veliye "ne yaptığını gör, harcamayı sen sınırla" (Ebeveyn Paneli, §8.2), öğretmene "45 dakikalık hazır ders planı ve sınıf ilerleme raporu" (v1.1). KodKent'in **olmadığı** yerler de nettir: sosyal vakit geçirme oyunu (Sanalika kitlesini hedeflemiyoruz), deneyimli geliştirici bulmaca platformu (Codewars) ve sertifika/diploma veren bir kurs (resmî bir öğretim kurumu iddiası yok; §8.8).

### 2.2 Üç persona

Üç persona, B2 §11'in üç oyun profiline (hafif ≈10 dk, normal 35 dk, yoğun 90 dk) ve kayıt karışımına eşlenmiştir: Efe ≈ hafif, Zeynep ≈ normal, Murat ≈ "hafta içi hafif, hafta sonu yoğun". Edinim karışımı varsayımı: %35 / %45 / %20; ilk 1.000'de 15–17 payı %35–40 (§7.1). Yaşlar §8.1'deki 15 yaş sınırına göre seçilmiştir: KodKent 15 yaşından küçüklere hizmet vermez (hukuki karar G0'a bağlıdır).

#### Persona 1 — Efe Kaya, 15, lise öğrencisi

| Alan | Değer |
|---|---|
| Durum | Ankara, lise 10. sınıf, ailesiyle yaşıyor. Orta segment Android telefon (4 GB RAM); akşamları ortak aile bilgisayarı |
| Zaman | Hafta içi 10–15 dk, hafta sonu 30–45 dk (B2 "hafif" profili) |
| Hedef | Oyun yapmak; "yazılımcı olmak" ama nereden başlayacağını bilmiyor |
| Sıkıntı | YouTube öğreticilerini izliyor ama yazmıyor; İngilizce hata mesajında takılıp bırakıyor; okulda bilişim dersi ofis programlarından ibaret; arkadaşlarına gösterebileceği bir çıktısı yok; ebeveyni "oyun" diye kısıtlıyor |
| Edinim kanalı | Okul bilişim kulübü kodu, sınıf arkadaşı daveti |
| İlk sürtünme | 15 yaş sınırı nedeniyle e-Devlet yaş belirteci; ebeveyn telefonunu istemesi |

**Tipik 30 gün (MVP içeriğiyle):**

| Gün | Ne olur | Çıktı |
|---|---|---|
| 0 (Cumartesi, 40 dk) | Telefonla giriş → yaş belirteci (babasının e-Devlet'iyle, 3–5 dk) → avatar → Ders 1.1 → Meydan Saati (40 B) → 30 B'ye Çırak Şapkası | Sev. 2, ilk Bayt ≤20. dk |
| 1–6 (10–15 dk/gün) | Ders 1.2–1.4 ve 3 görev; Günlük Tekrar iki günde bir | Ruhsat 3/3 (6. gün) |
| 7 (hafta sonu, 30 dk) | Otopark tapusu (300 B), Hasan Abi'nin iş emri, Gereksinim Netleştirme, ilk kod | Tapu |
| 8 | Müfettiş testleri + Savunma ("121 dakika neden 120 TL?") → **Açılış**; LED panoda "@efe_kod" | Sosyal gösteriş anı #2 |
| 9–16 | İlk kasa toplama (≈73 B), Oda eşyası, Alkış; sınıf arkadaşları kulüp koduyla katılır → sınıf ligi | D7 kanıtı |
| 17–20 | Sev. 6 Kalfa; Büfe tapusu (600 B) ve Açılış | 2. işletme |
| 28 | Çarşı Semt Sınavı → Liman açılır (+500 B, 10 Çip, 200 XP) | 13 ders, Sev. 7 |

**Ona özel kanca.** *"Sınıfın ilk işletme sahibi sen ol."* Kulüp kodu aynı shard'a ve sınıf ligine düşürür; neon tabela ve "Otopark Ustası" şapkası (gizli testlerin tamamı ilk 3 denemede) bir gösteriş hedefidir. Ebeveyne ayrı kanca: Ebeveyn Paneli'nde haftalık öğrenme özeti ve harcama limiti, oyunu "ders" olarak yeniden çerçeveler. **Neden bırakır:** babası belirteç adımını tamamlamaz (hesap hiç açılmaz) ya da 8. günde ilk koda tek başına takılır; azaltma: "Müşteriye Sor" ve Pusula→Fener ipuçları ücretsizdir, kulüp başkanı çağrı balonuyla yardım eder.

#### Persona 2 — Zeynep Arslan, 19, bilgisayar mühendisliği öğrencisi

| Alan | Değer |
|---|---|
| Durum | İzmir, devlet üniversitesi Bilgisayar Mühendisliği 1. sınıf, yurtta; laptop |
| Zaman | Gün arası ve akşam 35–45 dk (B2 "normal" profili) |
| Hedef | Yaz stajı için portföy; gelecek dönemki nesne yönelimli programlama dersine hazırlanmak |
| Sıkıntı | Okulda teori ağırlıklı; ödevleri kopyalıyor ve kodunu anlatamıyor; İngilizce kaynakta yavaş; sınav haftasında bırakıyor |
| Edinim kanalı | Üniversite yazılım topluluğu, Discord |
| İlk sürtünme | Yok (18+, e-Devlet belirteci kolay) |

| Gün | Ne olur | Çıktı |
|---|---|---|
| 1 | Ders 1.1–1.2, Meydan Saati, Dakikadan Saate | Sev. 3 |
| 2–3 | Tapu (2. gün), İş Emri ve kod (3. gün), Savunma | **Otopark Açılış** (72 saat KPI'ı içinde) |
| 7–8 | Sev. 6 Kalfa, Büfe tapusu ve Açılış | 2 işletme |
| 12 | Çarşı Semt Sınavı → Liman | +500 B, 10 Çip |
| 13–18 | Liman dersleri 2.1–2.6, Otopark L2 (abone listesi, `List<string>`) | MVP içeriği biter |
| 19–30 | **İçerik pisti:** Hata Bildirimi, Günlük Tekrar, Vitrin okuma, Metro'da altın durak; H14 ve H16 damlalarıyla 15 yeni ders (v1.1, S7–S8) | Sev. 9–10; XP duvarı için Staj modu kararı |

**Ona özel kanca.** *"Staj mülakatına çalışan C# portföyüyle git."* Profil ve Rozet Duvarı her işletmeyi "çalışan C# projesi" olarak gösterir, "kodu dışa aktar" projeyi GitHub'a taşır; Savunma ("hangi satır belirliyor?") bir mülakat provasıdır. Sınav haftasında Kalıcılık Ligi ve Seri Dondurucu onu tutar. **Neden bırakır:** MVP içeriği 18. günde biter (içerik pisti, risk R06); azaltma: ilk içerik damlasının MVP'den en geç 2 hafta sonra gelmesi ve Staj modu (B2 Ek A-1) kararı.

#### Persona 3 — Murat Demir, 24, kariyer değiştiren

| Alan | Değer |
|---|---|
| Durum | Kocaeli, iktisat mezunu, depoda vardiyalı çalışıyor; telefon + evde eski bir masaüstü |
| Zaman | Hafta içi 15–20 dk (telefonda), hafta sonu 90–120 dk masaüstünde |
| Hedef | 12 ay içinde yazılım işine geçmek; 30–80 bin TL'lik bootcamp ücretini ödeyemiyor |
| Sıkıntı | Vardiya düzensiz, seri kırılıyor; öğrenme yolunun doğru olup olmadığını bilmiyor; İngilizce zayıf |
| Edinim kanalı | YouTube C# videosu, ekşi/Reddit/Discord |
| İlk sürtünme | Yok (18+); mobilde kod yazdırılmaması onu masaüstüne yönlendirir |

| Gün | Ne olur | Çıktı |
|---|---|---|
| 1 (Cumartesi, 100 dk) | Ders 1.1–1.4 + 4 görev → tapu → Otopark Açılış (B2 yoğun gün 1) | Sev. 4 |
| 2–6 (vardiya, 15 dk) | Telefonda 3 dk Günlük Tekrar + kart okuma; seri 5 gün | İlk altın durak |
| 8 (Cumartesi) | Büfe tapusu ve kodu; Seri Dondurucu (50 B) vardiya haftasını kurtarır | 2 işletme |
| 15–22 | Çarşı Semt Sınavı, Liman 2.1–2.6, Otopark L2 | Sev. 8–9 |
| 30 | Profil: 14 ders, 2 işletme, 6 altın durak, Vitrin'de iki proje | Portföy |

**Ona özel kanca.** *"Yarın ne açılıyor?"* kartı ve Metro Haritası'nın altın durak sayacı ona "gerçekten öğreniyorum"un kanıtını verir; ücretsiz olması ve bir vardiyaya sığan 3 dakikalık Günlük Tekrar bootcamp alternatifi hissi yaratır. Haftada bir ücretsiz dondurma ve Seri Dondurucu (yalnızca Bayt) vardiya haftasında kırılmayı önler. **Neden bırakır:** 2–3 haftalık vardiya yoğunluğu ve içerik pisti; azaltma: bildirimlerde ders değil "kasan dolu" (8 saat) ve Hata Bildirimi dosyası gibi 4 dakikalık hedefler.

### 2.3 Kanal paydaşları ve anti-persona

Oyuncuyu getiren ve ürünün para kazanmasını mümkün kılan üç paydaş vardır; ikisi doğrudan oyuncu değildir.

| Paydaş | Kim | İhtiyaç | Ürün karşılığı | Sürüm |
|---|---|---|---|---|
| **Öğretmen** | Selma, 34, lise bilişim öğretmeni | Sınıf bazlı ilerleme, 45 dk ders planı, veli/KVKK bilgilendirme metni, kopya şüphesi görünürlüğü | Kulüp kodu (MVP); öğretmen paneli ve ders planı kiti (v1.1); lisans (v1.2) | MVP → v1.2 |
| **Kulüp başkanı** | Kaan, 20, üniversite yazılım topluluğu | Etkinlik içeriği, kohort lig tablosu, rozet | Kulüp kodu, kulüp liderliği, "Otopark'ı yaz" etkinlik kiti | MVP |
| **Veli** | Hatice, 42 | Güvenlik, harcama limiti, "öğreniyor mu?" kanıtı | Ebeveyn Paneli, haftalık özet, ticaretsiz ekonomi | MVP |

**Anti-persona:** (1) 15 yaş altı çocuk (hukuki; §8.1); (2) yalnızca sosyal vakit geçirmek isteyen oyuncu: Sanalika kitlesi, bilinçli olarak hedeflenmez ve ilk 30 günde kaybı kabul edilir; (3) deneyimli profesyonel: Codewars ve Exercism'in alanıdır.


---

## 3. MVP kapsamı

### 3.1 Kapsam ilkesi ve kesme çizgisi

MVP'nin ilkesi tek cümledir: **bir şeyi derinlemesine yap — Otopark uçtan uca.** A-vizyon-FINAL §13'ün kapsamı (Çarşı + Liman, 18 ders, Otopark L1–L2, Büfe, Kargo Deposu) korunur; KANON'un "MVP'de açık: #1 (L1–L2), #2, #4" satırı bağlayıcıdır. Bu belgenin MVP'ye eklediği tek yeni yük **uyum paketidir**: yaş kapısı (e-Devlet belirteci), Ebeveyn Paneli, 15–17 yaş için ayrıştırılmış hizmet kuralları ve yaş derecelendirmesi (§8.1–§8.2). Tahmini etkisi 12–15 mühendis-günüdür; G0 kapısı (H2) süreyi 12 haftada tutup tutmayacağımıza karar verir, tutamazsak MVP 14 haftaya çıkar (Ek A). Zaman baskısında kesme **sırası** aşağıdadır; sıra yukarıdan aşağıya uygulanır, dokunulmaz listesine hiçbir koşulda girilmez.

| Sıra | Kesilen | Kazanılan süre | Etki |
|---|---|---|---|
| 1 | Butik 4 üründen 2'ye (Neon Çırak seti + İsim rengi) | ≈3 gün sanatçı + 1 gün mühendis | Ödeme isteği ölçümü daralır, ölçülebilir kalır |
| 2 | Arkadaş ligi (30 kişilik kova) → yalnızca genel haftalık lig + Kalıcılık Ligi | ≈4 gün | Sosyal rekabet azalır |
| 3 | Kozmetik 40 → 24, Oda eşyası 25 → 15, emote 8 → 4 | ≈8 gün sanatçı | Harcama hedefleri azalır; B2 lavabo açığı büyür |
| 4 | Metro Haritası ve Rozet Duvarı animasyonları → statik | ≈3 gün | Duygusal ödül azalır |
| 5 | Kargo Deposu → v1.1 ilk içerik damlası (KANON "MVP'de açık" satırı güncellenir) | ≈5 yazar + 3 mühendis günü | Liman'da yalnızca ders + Otopark L2 kalır |

**Dokunulmaz:** sandbox ve yük testi; Kurul (rubrik-önce, itiraz, kota ve gece batch); Otopark uçtan uca (26 test, Savunma, 3 mutasyon); Günlük Tekrar; yaş kapısı ve Ebeveyn Paneli; KVKK akışları ve veri silme; temel moderasyon; olay analitiği; Bayt defteri. Bunlardan biri kesilirse MVP yayınlanmaz.

### 3.2 İçinde / dışında

| Alan | MVP'de **İÇİNDE** | MVP'de **DIŞINDA** (sürüm) |
|---|---|---|
| Kimlik ve uyum | Telefon + SMS OTP (6 hane, 90 sn, 60 sn'de yeniden gönder, 5 deneme/saat); yaş kapısı (e-Devlet yaş belirteci); Ebeveyn Paneli (süre, harcama, satın alma onayı, sohbet izni); KVKK metinleri ve veri silme; PWA | Misafir Modu / Hour of Code (v1.1); ticari ileti izin akışı ve İYS (v1.1; MVP'de pazarlama iletisi yok) |
| Dil | Dil Seçimi: C# açık, 5 kart "yakında — haber ver" | Python/JavaScript etkinleşmesi (v2 ve sonrası, §11) |
| Avatar | 12 kombinasyon, takma ad moderasyonu | İkinci avatar kaydı, ek dolap slotu (v1.1, Butik) |
| Şehir | Derleyici Meydanı (40 avatarlık shard), Çarşı, Liman, Bloklar (Stüdyo), Akademi, Pazar, Liderlik Panosu, LED pano; inşaat halinde semtler + Turist modu | Atölyeler ve Kampüs ön açılışı (v1.1), Finans Bölgesi (v1.2), Veri Vadisi (v2), Bulut Tepesi (A13+); Daire (v1.1), Çatı Katı (v1.2); Lonca Binası (v1.1), Arena (v1.2) |
| Eğitim | 18 ders (12 Çarşı + 6 Liman), her derste 3 Usta sorusu; Usta Defne ve Kerem; 4 soru tipi; Sıralama/Tamamlama/Sıfırdan görevleri, İş Emri, Hata Bildirimi, Günlük Tekrar, Çarşı Semt Sınavı; Türkçe hata tablosu (50 CS kodu); Metro Haritası (18 durak) | Liman 2.7–2.12 ve Liman Semt Sınavı (v1.1 damlaları); Atölyeler 14 + Kampüs I 8 (v1.1); Kampüs II 8 + Finans I 8 (v1.2); Finans II 8 + Veri Vadisi 14 (v2); Bulut Tepesi 16 (A13+). B4: toplam 100 ders |
| İşletme | Otopark L1–L2 (26 test, referans çözüm, 4 ipucu, Savunma, 3 Hata Bildirimi mutasyonu; L2 test derinliği B5 Açık Soru 9'a bağlı: 5 açık + 4 gizli tanımlı, ≥8 gizli önerisi); Büfe L1; Kargo Deposu L1 (ikisinin L2'si esneme kapsamı, B5'e bağlı); gece sentetik trafik, kasa | v1.1: Manav, Balık Hali, Oto Tamirhane, Mobilya Atölyesi, Trafo Merkezi, Otopark L3 (kapı 3.4) ve L4 (kapı 4.7); v1.2: Oto Yıkama, Gümrük, Kütüphane, Sinema, Haber Ajansı, Banka, Otopark L5 (kapı 5.1 + 6.3); v2: Sigorta, Borsa Panosu, Hastane Kayıt, Otel; Yemek Sipariş ve Şehir Uygulaması A13+ |
| Ekonomi | Bayt (görev, Ruhsat teşviki, Günlük Tekrar + seri, Hata Bildirimi, referans tavanlı gelir, haftalık lig); 40 kozmetik, 25 oda eşyası, 5 Nişan; Nadir haftalık rotasyon; Çip Butiği (4 ürün) ve 4 Çip paketi (B2 §9.3) | İşletme içi dekorasyon, Büyük Kasa, Belediye Projeleri (v1.1; B2 Ek A-11); Staj modu (v1.1 adayı); semt pazarı çarpanı (karar bekliyor) |
| Kurul / AI | Rubrik-önce, kriter gerekçesi, itiraz, 2 deneme, günlük 30 kota + gece Batch, altın küme, kalibrasyon paneli (iç araç), maliyet panosu | Haiku-first cascade (v1.2 deneme, v2 yaygın), sınıflandırıcı-önce puanlama (v2) |
| Sosyal | Ziyaret, Alkış, ziyaretçi defteri; arkadaş + davet kodu (iki tarafa 100 B); Meydan sohbeti (güvenli mod: emote + hazır cümle; serbest metin yalnızca yaşı ve izni doğrulanmış hesaplarda); arkadaş ligi, Kalıcılık Ligi, En Hızlı Otopark; Vitrin (salt okunur) | Lonca, Kod Düellosu, Vitrin notları (v1.1); Arena, Kalfa Yardımı, akran incelemesi (v1.2); Lonca Projesi (v2); sesli sohbet, hediye/ticaret (**hiçbir zaman**) |
| Operasyon | Admin paneli (içerik, moderasyon, ekonomi panosu), olay analitiği (§9.4), kalibrasyon paneli | Öğretmen paneli, etkinlik motoru, sezon (v1.1); okul/kulüp lisansı ve fatura (v1.2) |
| Platform | Web + PWA; masaüstü Chrome/Edge son 2 sürüm, Android Chrome, iOS Safari; alt sınır 4 GB RAM telefon | Mobil sarmalayıcı (v1.2), mağaza yayını |
| Hiçbir zaman | Reklam (özellikle 18 yaş altına), Bayt satın alma, loot box/gacha, oyuncular arası ticaret ve hediye, pay-to-learn | — |

### 3.3 Ekran × sürüm matrisi

KANON §6'daki 24 ekranın tamamı MVP'dedir (Vitrin salt okunur). Sonraki sürümler ekranı çoğaltmaz, **genişletir**. Üç yeni ekran KANON dışıdır ve Ek A'da önerilmiştir.

| # | Ekran | MVP | v1.1 | v1.2 | v2 |
|---|---|---|---|---|---|
| 1 | Giriş | OTP + yaş kapısı adımı | Misafir Modu girişi | — | — |
| 2 | Dil Seçimi | C# açık, 5 "yakında" kartı | Bekleme sayacı panosu (iç) | — | Python pilot kartı (koşullu) |
| 3 | Avatar Atölyesi | 12 kombinasyon | İkinci avatar kaydı | — | — |
| 4 | Derleyici Meydanı | Shard 40, LED pano, Meydan Sorusu | Sezon panosu | Arena kapısı | Lonca Projesi panosu |
| 5 | Şehir Haritası | Çarşı, Liman açık; 5 semt inşaat halinde | Atölyeler açılır; Kampüs ön açılış | Finans Bölgesi açılır | Veri Vadisi açılır (Bulut Tepesi A13+) |
| 6 | Akademi Lobisi | Kürsü kapıları, Atölye girişi | — | Lobi: Kalfa Yardımı | — |
| 7 | Derslik | PRIMM kart akışı | Yeni dersler | Yeni dersler | Yeni dersler |
| 8 | Kurul Kartı | Rubrik, gerekçe, itiraz | — | — | — |
| 9 | Atölye | Monaco, açık testler, ipucu merdiveni | Staj modu (adayı) | — | — |
| 10 | İşletme Sokağı | Otopark, Büfe, Kargo Deposu | Manav, Balık Hali, Atölyeler'in 3 işletmesi | Oto Yıkama, Gümrük, Kampüs ve Banka | Sigorta, Borsa Panosu, Hastane Kayıt, Otel |
| 11 | İş Emri | Hasan Abi, Müşteriye Sor | Yeni müşteri NPC'leri | — | — |
| 12 | İşletme Editörü | Masaüstü öncelikli | — | — | — |
| 13 | Savunma | Kurul'un seçtiği satır | — | — | — |
| 14 | İşletme Paneli | Gelir, kasa, yükseltme, Hata Bildirimi | Büyük Kasa, dekorasyon | — | Lonca kasası |
| 15 | Metro Haritası | 18 durak | 46 durak | 62 durak | 84 durak |
| 16 | Günlük Tekrar | 5 soru, seri, dondurma | — | — | Uyarlanabilir çizelge |
| 17 | Oda | Stüdyo 6×6 | Daire 8×8 | Çatı Katı | — |
| 18 | Dolap | Kıyafet, emote çarkı, Nişan vitrini | Ek slot | — | — |
| 19 | Pazar | Bayt rafları, Butik (4 ürün), Rütbe Rafı, Nadir rotasyon | Semt pazarı (karar sonrası) | — | — |
| 20 | Vitrin | Salt okunur | "Not bırak" | — | — |
| 21 | Profil & Rozet Duvarı | Portföy, kodu dışa aktar | — | — | — |
| 22 | Liderlik Panosu | Lig, Kalıcılık Ligi, En Hızlı Otopark | Kod Düellosu tablosu | Arena / turnuva | — |
| 23 | Sohbet & Arkadaşlar | Güvenli mod, davet kodu | Lonca sohbeti | — | — |
| 24 | Ayarlar & Hesap | Bildirim, ebeveyn durumu, KVKK, veri silme | İYS ve ticari ileti tercihleri | — | — |
| HUD | XP, Bayt, Çip, görev kartı, hedef çubuğu | ✓ | Sezon göstergesi | — | — |
| +1 | **Ebeveyn Paneli** (web; KANON dışı) | ✓ | Haftalık özet e-postası (izinli) | — | — |
| +2 | **Öğretmen Paneli** (KANON dışı) | Kulüp kodu (panelsiz) | ✓ | Lisans ve rapor | — |
| +3 | Lonca Binası / Arena (KANON §6 son cümle) | — | Lonca Binası | Arena | — |

### 3.4 Sayısal başarı kriterleri

Tüm oranların **tabanı** açıkça yazılıdır; "oyuncu" yaş kapısını geçmiş hesaptır (§9.1). G4 sütunu açık yayın kapısıdır (H12); A3 ve A6 sütunları açık yayın sonrasının hedefleridir. A-vizyon-FINAL §4 ve §13 eşikleri aynen alınmış, uyum nedeniyle yeni olan satırlar işaretlenmiştir.

| # | Metrik | Taban | G4 (H12) | A3 | A6 | Kaynak |
|---|---|---|---|---|---|---|
| 1 | OTP tamamlama | OTP başlatan → doğrulayan | ≥%85 | ≥%88 | ≥%90 | B9 |
| 2 | Yaş kapısı geçişi (**yeni**) | OTP doğrulayan → yaş adımını geçen | ≥%70 (18+ için ≥%95) | ≥%72 | ≥%78 | B9 / §8.2 |
| 3 | Avatar tamamlama | Yaş kapısını geçen | ≥%92 | ≥%92 | ≥%94 | B9 |
| 4 | Ders 1.1 tamamlama | Avatarı tamamlayan | ≥%85 | ≥%85 | ≥%88 | VİZYON §4 |
| 5 | İlk Bayt ≤20. dakika | Avatarı tamamlayan | ≥%70 | ≥%70 | ≥%75 | VİZYON §4 |
| 6 | Tapu ≤2 oturum | Avatarı tamamlayan | ≥%50 | ≥%50 | ≥%55 | VİZYON §4 |
| 7 | 72 saatte Otopark AÇIK | Avatarı tamamlayan | ≥%35 | ≥%35 | ≥%38 | VİZYON §4 |
| 8 | D1 / D7 / D30 geri dönüş | Kayıt günü kohortu | beta: ≥%40 / ≥%15 / — | ≥%45 / ≥%20 / ≥%8 | aynı | VİZYON §13 |
| 9 | Ders terk | Dersi başlatıp 24 saatte bitirmeyen | <%15 | <%15 | <%12 | VİZYON §12 |
| 10 | Günlük Tekrar katılımı (D7) | D7'de aktif olanlar | ≥%35 | ≥%40 | ≥%45 | B9 |
| 11 | Altın durak | D30 aktifleri; ≥3 altın durak | — | ≥%25 | ≥%30 | B9 |
| 12 | Kurul p95 / sandbox p95 | İstek | <4 sn / <6 sn | aynı | aynı | KANON §9 |
| 13 | AI maliyeti $/DAU/gün | Haftalık ortalama | ≤0,08 (alarm); plan 0,057 (B3: dört kaldıraç, 1k DAU) | ≤0,06 | ≤0,057 (KANON hedefi 0,05 10k DAU'da; yol: ≤0,045 @A9, ≤0,035 @A12) | KANON §9, B3 |
| 14 | İtiraz oranı | Puanlanan cevap | <%5 (beta) | <%3 | <%3 | KANON §9 |
| 15 | Moderasyon şikâyeti | Gönderilen mesaj | <%1; ağır şikâyette 1 saat SLA ≥%95 | aynı | aynı | VİZYON §13 |
| 16 | Akademi / Pazar süre oranı | Oturum süresi | >1 | >1 | >1 | VİZYON §13 |
| 17 | Butik dönüşümü | Aylık Butik'i gören → Çip ödemesini tamamlayan (MAU'nun ≈%40'ı Butik'i açar varsayımıyla ödeyen oranına çevrilir) | ≥%2 | ≥%3 | ≥%4 | B9 |
| 18 | Aylık ödeyen oranı | MAU | — | ≥%0,5 | ≥%1,5 (hedef %2) | B2 §9.3 |
| 19 | İçerik pisti | D14'te hâlâ aktif oyuncu; P50: kalan ders ÷ haftalık ders hızı | P50 ≥4 hafta | P50 ≥4 (P75 ≥2) | aynı | B9 (**yeni**) |
| 20 | Çökmesiz oturum / Meydan akıcılığı | Oturum; 4 GB telefon | ≥%99 / medyan ≥30 fps | aynı | aynı | B8 ile hizalanır |
| 21 | İlk 30 dakika tamamlama (**yeni**) | Avatarı tamamlayan; ilk oturumda Ders 1.1 + ilk Usta sorusu + Meydan Saati bitmiş ve "Satılık Otopark" görülmüş | ≥%60 | ≥%60 | ≥%65 | VİZYON §4 çıkış kartı; B9 eşiği |

### 3.5 Kapı kararları (G0–G4)

| Kapı | Hafta | Kriter | Karar sahibi | Tutmazsa |
|---|---|---|---|---|
| **G0** | H2 | Hukuk yazılı görüşü: (a) KodKent "sosyal ağ sağlayıcı" mı, "oyun platformu" mu, ikisi mi; (b) 13–14 yaş "Akademi Modu" mümkün mü; (c) e-Devlet yaş belirtecine erişim koşulları ve takvim | Kurucu + hukuk | 15+ ve e-Devlet zorunlu varsayımıyla ilerle; belirteç erişilemezse kapalı beta yalnızca 18+ ile yapılır |
| **G1** | H4 | H2: 500 eşzamanlı çalıştırmada sandbox p95 <6 sn, kaçış listesinde başarılı deneme 0; H3: 1.000 sentetik cevapta Sonnet puanlaması ≤0,0041 $ (B3 §11.7 lansman değeri; KANON'un 0,0033'ü ≥10k DAU'da), harmanlanmış ≤0,0053 $ ve p95 <4 sn; H4: 20 öğrenciyle "kâğıt" testi, ders terk <%15 | CTO | Worker ve havuz artır; Haiku-first cascade'i öne çek; ders kart sayısını azalt |
| **G2** | H8 | H5: 50 enjeksiyonun en az 48'i engellendi; H6: 10.000 bot simülasyonunda gider/kaynak ≥0,55 ve T1 kohortu Bayt ihracı 350–500 B/gün | Kurucu + ekonomi | B2 §6.3 lavabolarından dekorasyon ve Nadir rotasyonunu MVP'ye al |
| **G3** | H10 | Kapalı beta (200 kişi): D1 ≥%40, D7 ≥%15; 72 saat Açılış ≥%30; ders terk ≤%20; ağır güvenlik açığı 0 | Kurucu | D7 <%15 ise yayın 2 hafta ertelenir (VİZYON §12 R4) |
| **G4** | H12 | Satır 1–21 G4 sütunu; uyum kontrol listesi %100 (§8.9); PSP canlı onayı; ebeveyn paneli uçtan uca testi | Kurucu + CTO + hukuk | Açık yayın ertelenir; kapalı beta sürer |


---

## 4. Yol haritası

### 4.1 Sürüm özeti

Yol haritası dört sürümdür ve 52 haftaya yayılır. Sürüm adları **özellik kilometre taşlarıdır**; içerik ise sürümden bağımsız, iki haftada bir "içerik damlası" olarak akar (§5.4). Semt açılışı, o semtin kapısını (seviye + önceki semt sınavı) geçmiş aktif oyuncu oranı en az %10 olduğunda yapılır; böylece içerik talebin önüne geçer ama boş semt açılmaz. Takvim A1 = Ocak 2027 varsayımına göredir.

| Sürüm | Hafta (takvim) | Tema | Başlıca teslimatlar | Toplam ders | Çıkış kriteri |
|---|---|---|---|---|---|
| **MVP** | H1–H12 (Oca–Mar 2027) | Çarşı ve Liman | OTP, yaş kapısı, Ebeveyn Paneli; sandbox; ders motoru ve Kurul; PixiJS kabuk, Meydan, Oda, Pazar + Butik; Otopark L1–L2, Büfe, Kargo Deposu; ekonomi motoru, Günlük Tekrar, Metro; ligler, sohbet + moderasyon, admin; KVKK; kapalı beta 200, açık yayın | 18 | G4 (§3.5) |
| **v1.1** | H13–H24 (Nis–Haz 2027) | Atölyeler ve kulüp | Liman 2.7–2.12, Atölyeler (14 ders) ve Kampüs I (8 ders; ön açılış ve Lonca Binası); Manav, Balık Hali, Oto Tamirhane, Mobilya Atölyesi, Trafo Merkezi, Otopark L3–L4; Lonca + Lonca Görevi; asenkron Kod Düellosu; Vitrin notları; Daire; ekonomi lavabo paketi (dekorasyon, Büyük Kasa, Belediye Projeleri); Staj modu (karar); öğretmen paneli, Misafir Modu; etkinlik motoru + Sezon 1; İYS | 46 | HKO ≥800; D30 ≥%8; AI ≤0,057 $; ödeyen ≥%1,5; 20 öğretmen pilotu |
| **v1.2** | H25–H36 (Tem–Eyl 2027) | Kampüs ve Arena | Kampüs II (8 ders) ve Finans I (8 ders; Finans Bölgesi açılır); Oto Yıkama, Gümrük, Kütüphane, Sinema, Haber Ajansı, Banka, Otopark L5; Arena + Cumartesi turnuvası; Kalfa Yardımı + akran incelemesi; Çatı Katı; mobil sarmalayıcı ve mağaza kararı; ücretli okul/kulüp lisansı + fatura; Haiku-first cascade (gölge → yaygın); Kalfa Köprüsü; Sezon 2 | 62 | AI ≤0,045 $ (A9); 28–30 ücretli lisans paketi; D30 ≥%10 |
| **v2** | H37–H52 (Eyl–Ara 2027) | Finans ve Veri | Finans II (8) + Veri Vadisi (14 ders); Sigorta, Borsa Panosu, Hastane Kayıt, Otel; Lonca Projesi'nin ilk sürümü; sınıflandırıcı-önce puanlama; uyarlanabilir Günlük Tekrar; dil-agnostik Spec v2 ve Python pilot hazırlığı; 10 bin DAU ölçek çalışması | 84 (Bulut Tepesi 16 ders: A13–A15, toplam 100) | HKO ≥3.200; AI ≤0,035 $ (yol: ≤0,02 @A15); Python kararı; seed turu kapanışı |

### 4.2 Epikler ve bağımlılıklar

On iki epik, ürün düzeyinde işi gruplar; Gantt satırları (§4.5) bunların iş paketleridir. Teknik epiklerin adları ve ayrıntısı B7 §14'teki monorepo ve sprint planıyla hizalanır.

| Epik | Kapsam | Sürüm | Başlıca bağımlılık | Sahip |
|---|---|---|---|---|
| **E01 Kimlik, yaş kapısı ve uyum** | OTP, e-Devlet belirteci, Ebeveyn Paneli, KVKK akışları, veri silme, İYS, mağaza uyumu | MVP → v1.2 | G0, SMS başlığı, hukuk görüşü | CTO + hukuk |
| **E02 Sandbox ve Challenge motoru** | gVisor + Roslyn, test koşucusu, Challenge Spec yükleyici, hata tablosu; v2'de dil-agnostik | MVP → v2 | B5 Spec | CTO |
| **E03 Eğitim motoru ve Kurul** | Ders motoru, 4 soru tipi, rubrik, itiraz, kota ve batch, kalibrasyon; cascade ve sınıflandırıcı | MVP → v2 | E02, B3 | Full-stack + müfredat |
| **E04 İstemci ve dünya** | PixiJS, HUD, Monaco, Meydan, Oda, Pazar; Daire, Çatı Katı, mobil sarmalayıcı | MVP → v1.2 | B8, E01 | İstemci lideri |
| **E05 Ekonomi ve işletme** | Defter, gece simülasyonu, kasa, Bayt, Çip ödemesi; lavabolar, Staj modu | MVP → v1.1 | E02, B2, B5, PSP | CTO + ürün |
| **E06 Sosyal ve güvenlik** | Ziyaret, sohbet, moderasyon, lig; Lonca, Düello, Arena, Kalfa Yardımı | MVP → v1.2 | E01, B6 | Topluluk + full-stack |
| **E07 İçerik hattı** | Ders, görev, işletme, soru bankası, altın küme | Sürekli | B4, B5 | Müfredat lideri |
| **E08 Canlı operasyon ve analitik** | Admin, olaylar, panolar, etkinlik motoru, sezon, bildirim | MVP → v1.1 | E05, E06 | Full-stack + analitik |
| **E09 Platform ve DevOps** | CI/CD, gözlemlenebilirlik, güvenlik denetimi, maliyet panosu, ölçek | Sürekli | B7 §13 | CTO |
| **E10 Büyüme ve kanal** | Kulüp kodu, kit, içerik üreticileri, Teknofest, Hour of Code, davet | H1 → | E07, E01 | Kurucu |
| **E11 Kurumsal** | Öğretmen paneli, lisans, fatura, rapor, sponsor koltukları | v1.1 → v1.2 | E01, E08 | Kurucu + full-stack |
| **E12 Genişleme** | Mobil sarmalayıcı, dil-agnostik Spec, Python pilot, Lonca Projesi | v1.2 → v2 | E02, E03, E04 | CTO + ürün |

**Kritik yol (MVP).** G0 hukuk görüşü → yaş kapısı ve Giriş ekranı → kapalı beta; paralelde sandbox (H1–H4) → Otopark uçtan uca (H3–H7) → ekonomi motoru ve H6 simülasyonu (H4–H7) → Liman içeriği, Büfe ve Kargo Deposu (H5–H9) → kapalı beta (H9–H10). Kurul ve ders motoru (H2–H6) içerik hattıyla (H1–H8) birleşerek G1 kâğıt testini besler. **Sonraki sürümlerde:** Lonca moderasyona ve sosyal altyapıya, Kod Düellosu sandbox + eşleştirme + anti-cheat'e, öğretmen paneli kulüp koduna ve KVKK şablonuna, Arena Düello ve SignalR'a, mobil sarmalayıcı PWA ve mağaza kararına, ücretli lisans öğretmen paneline ve faturaya, Lonca Projesi Lonca ve Finans içeriğine, Python pilotu dil-agnostik Spec'e ve hata tablosuna bağlıdır.

### 4.3 MVP'nin 12 haftası ve ilk 6 sprint

MVP üç fazdır (VİZYON §13): **H1–H4 İskelet** (S1–S2), **H5–H8 Çarşı ve Liman** (S3–S4), **H9–H12 Beta → yayın** (S5–S6). Sprint 2 haftadır; tarihler H1 = 4 Ocak 2027 varsayımıyladır. Her sprintin sonunda canlı demo yapılır; kabul ölçütü sağlanmadan sprint kapanmaz, kapı (G) varsa karar o toplantıda verilir. Sprint planı VİZYON §13'ün üç fazına ve H2–H6, H10 kapılarına göre dizilmiştir; B7 §14.7'deki teknik sprintler yazıldığında hizalanır (B7 ile hizalanır; bekleme süresi dolduğunda B7 §13–§14 diskte yoktu, §15). **Sprint 0 (Kasım–Aralık 2026, H1 öncesi)** bu planın önkoşuludur: şirketin ve banka/vergi hesaplarının kurulması, hukuk danışmanı seçimi ve G0 sorularının hazırlanması, pre-seed görüşmeleri, çekirdek ekibin (CTO, istemci, full-stack, müfredat yazarı) işe alımı, marka sorgusu, SMS sağlayıcı sözleşmesi. Sprint 0 tamamlanmadan H1 başlatılmaz; kayarsa tüm takvim aynı süre kayar.

| Sprint | Hafta (tarih) | Hedef | Çıktılar | Kabul ölçütü |
|---|---|---|---|---|
| **S1** | H1–H2 (4–15 Oca) | Dikey dilimin iskeleti, **H2** sandbox yük testi ve G0 hazırlığı | Monorepo, CI/CD, staging; sandbox (gVisor + Roslyn + test koşucusu, 20 ısıtılmış container, Redis kuyruğu + 2 worker) ve **H2:** 500 eşzamanlı çalıştırma yük testi + kaçış listesi (≥9 kötüye kullanım senaryosu); OTP + SMS sağlayıcı (alfanümerik başlık başvurusu verildi); PixiJS kabuğu (tıkla-yürü avatar, tek sokak), React HUD iskeleti, Monaco gömülü; ders JSON şeması (B3 §2.6) ve Opus taslak şablonu, Ders 1.1–1.2 yazılı; hukuk danışmanı sözleşmesi, marka ve alan adı başvurusu, G0 soru listesi, PSP başvurusu; 10 çekirdek olay | Otopark L1'in 26 testi sandbox'ta geçer; H2 yük testinde p95 <6 sn ve kaçış 0 (staging'in H1'de ayakta olması koşuluyla); gerçek SMS ile staging girişi çalışır; avatar Meydan'da ≥30 fps yürür; G0 soruları hukuka gitti |
| **S2** | H3–H4 (18–29 Oca) | **G1**: AI maliyeti, ilk ders, kâğıt testi | **H3:** Kurul hattı (Haiku ön eleme → Sonnet → JSON şema, önbellek), 1.000 sentetik cevapla maliyet ve p95; ders motoru (kart akışı, 4 soru tipi, Parsons), Derslik ve Kurul Kartı ekranları; yaş kapısı spike'ı (sahte belirteç servisi) ve Ebeveyn Paneli iskeleti; Ders 1.1–1.6 ve görevleri; **H4:** Otopark prototipiyle (Gereksinim Netleştirme diyaloğu dâhil, B5 §3.2) 20 öğrencilik kâğıt testi; Otopark uçtan uca ilk sürüm (Savunma taslak); G0 yazılı görüşü (H2) uygulaması | G1: H2 sonuçları korunur (p95 <6 sn, kaçış 0); Sonnet puanlaması ≤0,0041 $ (harmanlanmış ≤0,0053 $) ve Kurul p95 <4 sn; kâğıt testinde ders terk <%15 |
| **S3** | H5–H6 (1–12 Şub) | Otopark baştan sona ve ekonomi motoru | Gereksinim Netleştirme (8 hazır soru + serbest metin), Sözleşme Kartı, 26 test (6 açık, 14 gizli, 6 tohumlu), Müfettiş balonları, Savunma, Açılış; 3 Hata Bildirimi mutasyonu; çift kayıtlı defter, gece sentetik trafik ve kasa, referans tavanı; **H5** kırmızı takım (50 enjeksiyon); **H6** 10.000 bot simülasyonu betikleri; Ders 1.7–1.12; Metro Haritası; Günlük Tekrar; Pazar (Bayt rafları), Oda (Stüdyo), Dolap; Ebeveyn Paneli (süre, harcama, onay) | İç ekipte Otopark L1 baştan sona <40 dk; 10.000 sentetik oyuncunun gece hesabı <30 dk; 50 enjeksiyonun ≥48'i engellendi; defter dengesi ve günlük mutabakat farkı 0 |
| **S4** | H7–H8 (15–26 Şub) | **G2**: Liman, sosyal katman, ekonomi doğrulaması | Liman 2.1–2.6, Kargo Deposu L1, Büfe L1, Otopark L2; Çip Butiği (4 ürün) ve PSP test ödemesi; Meydan shard (40 avatar), balon sohbet + moderasyon (kelime listesi, Haiku, şikâyet, insan kuyruğu), arkadaş ve davet kodu, ziyaret ve Alkış, Liderlik Panosu + Kalıcılık Ligi; admin paneli (içerik, moderasyon, ekonomi panosu); KVKK metinleri ve veri silme akışı; olay kataloğu tam (§9.4: 61 olay); kalibrasyon paneli; kapsam dondurma (H8) | G2: H6'da gider/kaynak ≥0,55 ve T1 kohortu 350–500 B/gün; 40 avatarlık yük testi geçti; ağır şikâyet akışı uçtan uca <1 saat; ders içeriği 18/18 |
| **S5** | H9–H10 (1–12 Mar) | **G3**: kapalı beta | 10 kulüp kodu ile 200 kişilik beta; Discord geri bildirim kanalı; günlük huni panosu; dış güvenlik denetimi (sandbox + web); gerçek cevaplarla altın küme yenileme; 4 GB telefon cihaz laboratuvarı; PSP canlı onayı; Ebeveyn Paneli uçtan uca testi; hata düzeltme. **Takvim notu:** Ramazan Bayramı H10'a denk gelir (tarih teyit): beta H9'da başlar, bayram haftasında yalnızca hata düzeltme ve Discord, ikinci dalga H11'dir | G3: D1 ≥%40, D7 ≥%15 (bayram düzeltmesiyle), 72 saat Açılış ≥%30, ders terk ≤%20, ağır güvenlik açığı 0 |
| **S6** | H11–H12 (15–26 Mar) | **G4**: denge, uyum ve açık yayın | Beta bulgularıyla ekonomi ve içerik dengesi; ikinci beta dalgası; uyum kontrol listesi %100 (§8.9); kullanım şartları, olay müdahale planı; 1k → 3k DAU kapasite ayarı; yayın duyurusu, 3 video, basın; alarm ve nöbet düzeni; H14 içerik damlası hazır (6 ders) | G4: §3.4 tablosu G4 sütunu, uyum %100, PSP canlı, ağır açık 0. Bayram kayarsa tampon: açık yayın H13'ün ilk yarısı |

### 4.4 Sprint 7–26 özeti

Ayrıntılı kabul ölçütleri her sürümün planlama toplantısında (S7, S13, S19) yazılır; aşağıdakiler yönü ve bağımlılığı verir.

| Sprint | Hafta | Odak | Temel çıktılar |
|---|---|---|---|
| S7 | H13–H14 | Lansman sonrası stabilizasyon | Hata ve ekonomi ayarı; ilk damla (Liman 2.7–2.12); Staj modu kararı ve spike; Misafir Modu tasarımı |
| S8 | H15–H16 | Atölyeler açılışı | Damla (3.1–3.9); Atölyeler semti, Manav, Balık Hali; Daire; dekorasyon lavabosu |
| S9 | H17–H18 | Düello ve öğretmen | Asenkron Kod Düellosu v1; öğretmen paneli v0 (kulüp raporu); damla (3.10–3.14, 4.1–4.4) |
| S10 | H19–H20 | Lonca ve Kampüs ön açılışı | Lonca, Lonca Binası, Lonca Görevi; Kampüs ön açılış; Oto Tamirhane, Mobilya Atölyesi, Trafo Merkezi; damla (4.5–4.8; v1.1 toplamı 46 ders) |
| S11 | H21–H22 | Ekonomi ve içerik derinliği | Vitrin notları, Büyük Kasa, Belediye Projeleri; etkinlik motoru; Otopark L4 (DateTime, kapı 4.7); Kampüs II (5.1–5.8) yazımı ve kalibrasyonu |
| S12 | H23–H24 | **v1.1 yayını** | Sezon 1, İYS, öğretmen paneli v1 (20 öğretmen pilotu), Misafir Modu; v1.1 sürüm kapısı |
| S13 | H25–H26 | Kampüs II | Damla (5.1–5.8); Kütüphane |
| S14 | H27–H28 | Arena | Canlı düello (SignalR), turnuva altyapısı; Finans I damlası |
| S15 | H29–H30 | Mentorluk | Kalfa Yardımı (Lobi), akran incelemesi; Sinema, Haber Ajansı; Finans Bölgesi açılışı |
| S16 | H31–H32 | Mobil | Mobil sarmalayıcı, mağaza kararı; Çatı Katı |
| S17 | H33–H34 | Kurumsal ve maliyet | Okul/kulüp lisansı, fatura, rapor; Haiku-first cascade yaygınlaştırma; Banka, Oto Yıkama, Gümrük; Otopark L5 (kapı 5.1 + 6.3) |
| S18 | H35–H36 | **v1.2 yayını** | Kalfa Köprüsü, Sezon 2, "Yeni Dönem" kampanyası; v1.2 sürüm kapısı |
| S19 | H37–H38 | Finans II | Damla (7.1–7.8); Sigorta |
| S20 | H39–H40 | Veri Vadisi I | Damla (8.1–8.7); Hastane Kayıt; sınıflandırıcı-önce spike |
| S21 | H41–H42 | Veri Vadisi II | Damla (9.1–9.7); Otel; Lonca Projesi tasarımı |
| S22 | H43–H44 | Lonca Projesi | Çok dosyalı Şehir Uygulaması v1; uyarlanabilir Günlük Tekrar |
| S23 | H45–H46 | Dil-agnostik altyapı | Spec v2, ikinci koşucu imajı (CPython) spike; ölçek çalışması başlar |
| S24 | H47–H48 | Ölçek | 10 bin DAU yük testi, maliyet optimizasyonu |
| S25 | H49–H50 | Hour of Code | Misafir Modu kampanyası (H49 = 6–12 Aralık 2027); Python pilot içeriği hazırlığı |
| S26 | H51–H52 | **v2 kapanışı** | Yıl sonu raporu, v2 sürüm kapısı, A13–A15 planı (Bulut Tepesi, Python pilotu) |

### 4.5 Gantt verisi

SVG yatay çubuklara dönüştürülecek veridir: başlangıç ve süre hafta cinsindendir; çubuk `başlangıç` sütunundan `başlangıç + süre − 1` haftasına uzanır (hepsi H52 içinde). Canlı operasyon (B6) ve içerik damlaları sürekli işlerdir ve ayrı çubuk değildir.

| İş paketi | Faz | Başlangıç (hafta) | Süre (hafta) | Bağımlılık |
|---|---|---|---|---|
| WP01 Kuruluş, hukuk, marka, G0 ve uyum dosyaları | MVP | 1 | 8 | — |
| WP02 Sandbox (gVisor + Roslyn) ve yük testi | MVP | 1 | 4 | — |
| WP03 İstemci kabuğu (PixiJS, HUD, Monaco) | MVP | 1 | 6 | — |
| WP04 İçerik hattı: Çarşı 12 + Liman 6 ders | MVP | 1 | 9 | — |
| WP05 Kimlik: OTP, yaş kapısı, Ebeveyn Paneli | MVP | 2 | 8 | WP01 |
| WP06 Ders motoru ve Kurul (rubrik, itiraz, kota) | MVP | 2 | 6 | WP02 |
| WP07 Otopark uçtan uca (26 test, Savunma, mutasyon) | MVP | 3 | 5 | WP02, WP06 |
| WP08 Ekonomi motoru ve H6 simülasyonu | MVP | 4 | 4 | WP07 |
| WP09 Dünya: Meydan, Oda, Pazar + Butik, Metro, Günlük Tekrar | MVP | 4 | 5 | WP03 |
| WP10 Büfe, Kargo Deposu, Otopark L2 | MVP | 7 | 3 | WP07 |
| WP11 Sosyal, moderasyon, admin, KVKK akışları | MVP | 6 | 4 | WP03, WP05 |
| WP12 Kapalı beta (G3) | MVP | 9 | 2 | WP09, WP10, WP11 |
| WP13 Denge, uyum kontrolü, açık yayın (G4) | MVP | 11 | 2 | WP12 |
| WP14 Atölyeler + Kampüs I içeriği ve işletmeleri | v1.1 | 13 | 10 | WP04 |
| WP15 Lavabo paketi ve Staj modu | v1.1 | 13 | 6 | WP08 |
| WP16 Kod Düellosu (asenkron) ve anti-cheat | v1.1 | 15 | 6 | WP02, WP11 |
| WP17 Lonca, Lonca Binası, Lonca Görevi | v1.1 | 17 | 6 | WP11 |
| WP18 Öğretmen paneli, kulüp raporu, Misafir Modu | v1.1 | 17 | 8 | WP05 |
| WP19 Etkinlik motoru, Sezon 1, İYS | v1.1 | 21 | 4 | WP15 |
| WP20 Kampüs II + Finans I içeriği ve işletmeleri | v1.2 | 25 | 12 | WP14 |
| WP21 Arena ve turnuva | v1.2 | 27 | 6 | WP16 |
| WP22 Kalfa Yardımı ve akran incelemesi | v1.2 | 29 | 6 | WP20 |
| WP23 Mobil sarmalayıcı ve mağaza uyumu | v1.2 | 29 | 8 | WP18 |
| WP24 Okul/kulüp lisansı, fatura, rapor | v1.2 | 27 | 8 | WP18 |
| WP25 Haiku-first cascade (gölge → yaygın) | v1.2 | 30 | 6 | WP06 |
| WP26 Finans II + Veri Vadisi içeriği ve işletmeleri | v2 | 37 | 14 | WP20 |
| WP27 Lonca Projesi (çok dosyalı) | v2 | 41 | 10 | WP17, WP26 |
| WP28 Sınıflandırıcı-önce puanlama, uyarlanabilir Günlük Tekrar | v2 | 40 | 10 | WP25 |
| WP29 Dil-agnostik Spec v2 ve Python pilot hazırlığı | v2 | 41 | 12 | WP20 |
| WP30 Ölçek çalışması (10 bin DAU) | v2 | 45 | 8 | WP28 |


---

## 5. Ekip, kültür ve içerik kapasitesi

### 5.1 Roller ve kişi sayısı

VİZYON §13'ün "5–6 kişi" ekibi MVP dönemi için korunur (5,5 FTE). Sonraki dönemlerde işe alım **tetikleyiciye bağlıdır** (§5.2); aşağıdaki tablo baz senaryodur. Maaşlar 2027 başı brüt planlama değeridir; işveren maliyeti brütün ×1,24'üdür (%21,75 SGK işveren payı + %2 işsizlik, teşvik yok) artı kişi başı 4.000 TL yan hak; A7'de tüm maaşlara %15 enflasyon ayarı uygulanır (§6.1).

| Rol | MVP (A1–A3) | v1.1 (A4–A6) | v1.2 (A7–A9) | v2 (A10–A12) | Brüt (TL/ay) |
|---|---|---|---|---|---|
| Kurucu / CEO (ürün + topluluk) | 1 | 1 | 1 | 1 | 100.000 |
| CTO / backend lideri (.NET, sandbox) | 1 | 1 | 1 | 1 | 170.000 |
| Oyun istemcisi (PixiJS + React, kıdemli) | 1 | 1 | 1 | 1 | 150.000 |
| Full-stack (ders motoru, admin) | 1 | 1 | 1 | 1 | 110.000 |
| Müfredat yazarı #1 (C# öğretmeni) | 1 | 1 | 1 | 1 | 80.000 |
| Müfredat yazarı #2 | — | 1 (A4) | 1 | 1 | 80.000 |
| Backend geliştirici #2 (.NET) | — | 1 (A5) | 1 | 1 | 120.000 |
| QA / test mühendisi | — | — | 1 (A7) | 1 | 85.000 |
| Piksel sanatçısı / animatör (sözleşmeli) | 0,5 | 1 (A4) | 1 | 1 | 100.000 (tam zaman) |
| Topluluk ve moderasyon | — | 0,5 (A4) | 1 (A8) | 1 | 55.000 |
| Büyüme / okul ilişkileri | — | — | 1 (A9) | 1 | 75.000 |
| Veri ve analitik | — | — | — | 0,5 (A10) | 100.000 (tam zaman) |
| **Toplam FTE** | **5,5** | **7,5 → 8,5** | **9,5 → 11** | **11,5** | — |

Kadro dışı: 2 sözleşmeli C# öğretmeni (gözden geçirme, kişi başı ayda 20 saat), hukuk/KVKK danışmanı (aylık sabit), mali müşavir ve gerektikçe UI/ses sözleşmelisi. Teknokent'e yerleşilirse Ar-Ge personeli için SGK işveren hissesi desteği ve gelir vergisi istisnası maaş maliyetini yaklaşık %8–12 düşürebilir; baz bütçeye **sayılmamıştır** (mevzuat teyidi gerekir, §6.6).

### 5.2 İşe alım sırası ve tetikleyicileri

| Sıra | Rol | Tetikleyici | Tetikleyici gelmezse |
|---|---|---|---|
| 1 | Müfredat yazarı #2 + tam zamanlı sanatçı (A4) | G4 geçti; ilk içerik damlası takvimde | İçerik damlası aylığa düşer; sanatçı yarım kalır |
| 2 | Backend #2 (A5) | G3 geçti ve v1.1 kapsamı onaylı (Düello, Lonca, öğretmen paneli aynı anda yürüyemez) | Düello v1.2'ye kayar |
| 3 | QA (A7) | Hata sızıntısı: üretimde sprint başına >5 P1/P2 | QA işi geliştiricilere dağılır |
| 4 | Topluluk tam zamanlı (A8) | Günlük mesaj hacmi >5.000 ya da ağır şikâyet SLA <%95 | Vardiya sözleşmeli moderatöre devredilir |
| 5 | Büyüme / okul ilişkileri (A9) | ≥5 kurumdan yazılı lisans ilgisi | Kurucu üstlenir |
| 6 | Analitik yarı zamanlı (A10) | DAU ≥2.000 ve deney sırası doluyor | CTO'nun üstünde kalır |

Muhafazakâr senaryoda (§6.3) A4–A7 işe alımları ertelenir ve ekip 7,5 FTE'de kalır; iyimser senaryoda mobil geliştirici (A9) ve ikinci topluluk uzmanı (A8) eklenir.

### 5.3 Ekip kültürü

Yedi ilke, ürün ilkelerinin (VİZYON §11) ekip karşılığıdır: **(1) Oyuncu önce.** Her ekip üyesi ayda iki oyuncuyla 20 dakika izleme/görüşme yapar; "kâğıt testi" ritüeli (H4) her büyük içerik için tekrarlanır. **(2) Ölçülmeyen şey yoktur.** Her özellik bir metrik ve bir karar tarihiyle çıkar; karar tarihinde ya sürdürülür ya kaldırılır. **(3) Küçük, sık, görünür.** İki haftalık sprint, Cuma demosu, özellik bayrakları ve tek ana dal. **(4) Çocuk güvenliği herkesin işidir.** Yılda bir eğitim; herhangi bir ekip üyesi bir özelliği "kırmızı düğme" ile durdurabilir. **(5) Veri en az yetkiyle.** Üretim verisine erişim iki kişidedir, kayıtlıdır. **(6) Hata ceza değil hikâyedir.** Olay sonrası inceleme suçlamasızdır ve herkese açıktır. **(7) İçerik de kod gibi gözden geçirilir.** Ders ve işletme içeriği çekme isteğiyle girer, ikinci göz onaylar, B5 CI doğrulayıcısı (22 kural) geçer. Çalışma biçimi uzaktan çalışmadır; haftada bir gün ortak ofis ya da Teknokent'te yüz yüze toplantı.

### 5.4 İçerik üretim kapasitesi

Hat, VİZYON §13'teki gibidir: **Opus taslak (gece, Batch) → müfredat yazarı → ikinci göz (sözleşmeli öğretmen) → JSON şablon → CI doğrulayıcı → kalibrasyon altın kümesi → yayın.** VİZYON varsayımı bir yazarın haftada 3 "ders + prova görevi" paketi üretmesidir (işletme L1 şablonu 2 gün). **B3 §12.2'nin soru bankası eki** (ders başına 6 soru şablonu × 3 varyant, altın örnek, ipucu ve takip: +0,6 yazar-günü) bunu haftada **≈2,2 derse** indirir; B3 bunu açıkça B9 ekip planına girdi olarak verir. B4 (Çarşı 1.1–1.4 tam, Liman özetleri) ve B5 (Otopark L1–L5, Büfe, Manav, Kargo Deposu L1 tam spec) tasarım yükünü üstlendiği için ders gövdesinde yaklaşık %25 tasarruf varsayılmıştır (1,67 → 1,25 gün); B3 eki bunun üstüne biner.

| MVP içerik işi | Birim süre | Miktar | Yazar-günü | Not |
|---|---|---|---|---|
| Ders + prova görevi paketi | 1,85 gün (1,25 + 0,6 soru bankası) | 18 | ≈33 | B4 1.1–1.4 tam içerik hazır |
| Otopark L1–L2 (26 test, referans, 4 ipucu, Savunma, 3 mutasyon) | 5 gün | 1 | 5 | B5 tam spec'ten dökme + doğrulama |
| Büfe L1, Kargo Deposu L1 | 2 gün | 2 | 4 | B5 tam spec |
| Hata Bildirimi mutasyon setleri | 0,5 gün | 3 | 1,5 | |
| Pazar adları, Nişan ve rozet metinleri, Usta persona dosyaları | — | — | 5 | |
| **Toplam yazar yükü** | | | **≈48,5 gün ≈ 9,7 hafta** | Tek yazar H1–H9'da ≈4 gün açıkta kalır |
| H14 damlası (Liman 2.7–2.12) için ≥2 hafta tampon | 1,85 gün | 6 | ≈11 | Aynı yazar yetişemez |
| **Sözleşmeli ek yazar (H3–H8)** | 20 gün (≈100 bin TL) | | | Açığı ve H14 damlasını kapatır; A4–A6'da ayda 5 gün devam (≈25 bin TL/ay) |
| İkinci göz (sözleşmeli öğretmen) | 0,25 gün/ders | 18 | ≈4,5 | B3 §12.1 aşama 7 |
| Altın küme (K, Ç, H tipleri × 300 cevap) | 60 saat, iki eğitmen (B3 §12.2) | 900 cevap | ≈7,5 eğitmen günü | Sözleşmeli; H3–H6, gerçek cevaplarla H11'de yenilenir |

**Kalibrasyon ve itiraz emeği (B3 §12.2, §6):** haftalık 200 cevaplık örneklem 8,3 saat, itiraz doğrulama günde 0,4–1,7 saat, ikinci göz ve altın küme birlikte yayın sonrası ayda ≈100 sözleşmeli eğitmen saati eder; bütçe (§6.2) bu yüzden eğitmen saatini ayda 100 saat × 750 TL alır (VİZYON'un "iki sözleşmeli öğretmen" varsayımı yetmez). B3 kalibrasyon eğitmeni ihtiyacını 0,5 FTE (1k DAU) ile 1,5 FTE (10k DAU) arasında verir; baz A12'de (≈2,7k DAU) ≈0,7 FTE ≈110 saat yeter, iyimser senaryoda (9k DAU) saat A7'den itibaren ikiye katlanır, muhafazakârda 60 saate iner (§6.3).

**Yayın sonrası akış.** Yazar #1 (haftada ≈2,2 ders) MVP dersleri bittiğinde (H9) Liman 2.7+ ve Atölyeler'e geçer; yazar #2 (A4'ten) derslerin yarısını, işletme paketlerini (13 işletmenin L1 şablonu ve yükseltmeleri), Hata Bildirimi mutasyon setlerini ve kalibrasyon sapmalarını üstlenir; iki yazarın birleşik ders kapasitesi haftada ≈3,3'tür, sözleşmeli ek yazar H13–H20'de farkı kapatır. Üretim sürümden önce ≥2 hafta (hedef ≥6 hafta) tampon korunur; tampon kısalırsa damla küçülür, kalite kapısı (B3 §12.1) atlanmaz.

**İçerik pisti projeksiyonu.** Pist, lansmandan 14 gün sonra hâlâ aktif olan (D14+) oyuncular için hesaplanır; çünkü içeriği tüketen onlardır. Haftalık ders hızı varsayımı: P50 ≈4, P75 ≈6, P90 ≈9 (B2 §11'deki normal profil gün başına 1 ders tüketir; 4–5 gün oynayan oyuncu haftada 4–6 ders yapar). Damlalar B6 §12.1'deki haftalık Salı yayınına (3 ders + 3 görev; canary %10 → %100) oturur; H14–H20 arasında iki yazarla hızlandırılır: H14 +6, H16 +9, H18 +9, H20 +4 (v1.1 toplamı 46 ders H20'de tamamlanır, haftada ≈4 ders); ardından haftalık 3 ders.

| Lansmandan sonra | Mevcut ders | P50 kalan (hafta) | P75 kalan (hafta) | P90 kalan (hafta) |
|---|---|---|---|---|
| 0 (H12) | 18 | 4,5 | 3,0 | 2,0 |
| 2 hafta (H14) | 24 | 4,0 | 2,0 | 0,7 |
| 4 hafta (H16) | 33 | 4,3 | 1,5 | duvar |
| 6 hafta (H18) | 42 | 4,5 | 1,0 | duvar |
| 8 hafta (H20) | 46 | 3,5 | duvar | duvar |

Sonuç: damlalar medyan (P50) oyuncuyu yaklaşık 4 haftalık pistte tutar; P75 oyuncu H20'de, P90 oyuncu H16'da içerik duvarına çarpar. Duvarı geciktiren iki doğal fren vardır: XP ve semt kapıları (B2: Sev. 12 ve Liman Sınavı olmadan Atölyeler açılmaz) ve Ders Mührü/Telafi Turu. Duvarın kalan kısmı **içerikle değil kod döngüsüyle** kapatılır: Hata Bildirimi (3 → 5, B2 Ek A-9), Kod Düellosu, Staj modu, işletme yükseltmeleri. HKO'nun kod olaylarına dayanması bu yüzden bilinçlidir (§9.1) ve Kampüs I'in v1.1 içinde ön açılması şarttır. B4 §0'a göre 100 dersin tamamı ders + görev + sınav olarak yalnızca 36,5 saatliktir; B2'nin ≈292 saatlik tavan yolculuğunun (Sev. 60) %12,5'idir. Oyuncunun oyun içinde geçirdiği zamanın geri kalanı işletme kodu, Hata Bildirimi, Düello ve sosyal döngüdür; bu yüzden içerik darboğazı ders sayısıyla değil kod döngüsünün derinliğiyle çözülür.


---

## 6. Bütçe, birim ekonomi ve finansman

### 6.1 Yöntem

Bütçe, **kohort tabanlı kullanıcı modelinden** türetilmiştir: aylık yeni kayıt × retention eğrisi → DAU → MAU → gelir ve değişken maliyet; sabit giderler ekip planından (§5.1) gelir. Model, Python betiğiyle (çalışma klasöründe `b9_model.py`) üretildi; tüm parametreler §13'te listelidir. Kur 45 TL/$, maaşlar 2027 başı brüt değerler, işveren maliyeti ×1,24, A7'de +%15 ücret ayarı. AI birim maliyeti B3 §11.5'teki senaryolara dayanır: S1 (kaldıraçsız lansman) 0,0747 $/DAU/gün; S4 (Opus daraltma + Haiku-lite + Batch + adaptif önbellek TTL) 0,0569 $ (1k DAU) ve 0,0487 $ (10k DAU). Baz senaryo S4'ün lansmanda açık olduğunu varsayar (0,057); B9'un S4 üstü kaldıraçları (Haiku-first cascade, sınıflandırıcı-önce puanlama, semantik önbellek; v1.2–v2) A12'de 0,035 $'a indirir. B3 §11.6'ya göre 1.000 DAU'da S4 aylık AI gideri 1.708 $'dır (VİZYON'un 1.500 $ varsayımının %14 üstü); kur 40–55 TL/$ aralığında AI gideri −%11…+%22 oynar. Kota tavanı yoğun bir oyuncuyu günde ≈0,17 $ ile sınırlar (ortalamanın 3 katı). Altyapı kalemi bütçenin yalnızca %4'ünü oluşturur (B7 nitelik hedefi: altyapı toplamın %20'sinden az); B7 §13.6 maliyet tablosu yazıldığında karşılaştırılır.

### 6.2 Baz senaryo: 12 aylık bütçe

**Tablo 6.2a — aylık gider (bin TL), baz senaryo.** Son satırlar dolar karşılığı, net gelir ve FTE'dir.

| Kalem | A1 | A2 | A3 | A4 | A5 | A6 | A7 | A8 | A9 | A10 | A11 | A12 | Toplam |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Maaş ve yan haklar | 831 | 831 | 831 | 1.016 | 1.168 | 1.168 | 1.464 | 1.504 | 1.615 | 1.688 | 1.688 | 1.688 | 15.494 |
| Altyapı ve güvenlik (B7 ile hizalanır) | 22 | 22 | 56 | 58 | 241 | 64 | 66 | 68 | 76 | 83 | 88 | 94 | 938 |
| AI (Claude API + geliştirme/test) | 36 | 36 | 77 | 89 | 102 | 115 | 124 | 135 | 161 | 181 | 185 | 186 | 1.427 |
| SMS (OTP, ebeveyn linki) | 0 | 0 | 1 | 1 | 2 | 2 | 2 | 2 | 5 | 6 | 6 | 6 | 32 |
| Pazarlama ve topluluk | 0 | 20 | 150 | 120 | 120 | 120 | 100 | 120 | 300 | 200 | 200 | 200 | 1.650 |
| Hukuk / KVKK | 150 | 100 | 30 | 80 | 30 | 30 | 30 | 30 | 90 | 30 | 30 | 30 | 660 |
| İçerik (kadro dışı: sözleşmeli yazar ve eğitmen, müzik/SFX) | 10 | 125 | 110 | 100 | 140 | 100 | 75 | 75 | 135 | 75 | 115 | 75 | 1.135 |
| Ofis, araç, cihaz, muhasebe | 430 | 70 | 70 | 70 | 250 | 70 | 70 | 70 | 70 | 70 | 70 | 70 | 1.380 |
| Beklenmedik (%8) | 118 | 96 | 106 | 123 | 164 | 134 | 154 | 160 | 196 | 187 | 191 | 188 | 1.817 |
| **Toplam gider (bin TL)** | **1.598** | **1.301** | **1.432** | **1.658** | **2.217** | **1.803** | **2.086** | **2.165** | **2.647** | **2.519** | **2.572** | **2.537** | **24.534** |
| **Toplam gider (bin $)** | 35,5 | 28,9 | 31,8 | 36,8 | 49,3 | 40,1 | 46,3 | 48,1 | 58,8 | 56,0 | 57,2 | 56,4 | 545,2 |
| Net gelir (bin TL) | 0 | 0 | 0,4 | 0,9 | 1,5 | 4,1 | 4,8 | 5,8 | 25,0 | 20,2 | 22,2 | 24,5 | 109,4 |
| Net nakit akışı (bin TL) | −1.598 | −1.301 | −1.431 | −1.657 | −2.216 | −1.799 | −2.081 | −2.159 | −2.622 | −2.499 | −2.550 | −2.513 | −24.424 |
| FTE | 5,5 | 5,5 | 5,5 | 7,5 | 8,5 | 8,5 | 9,5 | 10,0 | 11,0 | 11,5 | 11,5 | 11,5 | — |

**Tablo 6.2b — çeyreklik dolar özeti (bin $).**

| Kalem | A1–A3 | A4–A6 | A7–A9 | A10–A12 | Yıl | Pay |
|---|---|---|---|---|---|---|
| Maaş ve yan haklar | 55,4 | 74,5 | 101,8 | 112,5 | 344,3 | %63 |
| Altyapı ve güvenlik | 2,2 | 8,1 | 4,6 | 5,9 | 20,9 | %4 |
| AI (Claude API + geliştirme/test) | 3,3 | 6,8 | 9,3 | 12,2 | 31,7 | %6 |
| SMS | 0,0 | 0,1 | 0,2 | 0,4 | 0,7 | %0 |
| Pazarlama ve topluluk | 3,8 | 8,0 | 11,6 | 13,3 | 36,7 | %7 |
| Hukuk / KVKK | 6,2 | 3,1 | 3,3 | 2,0 | 14,7 | %3 |
| İçerik (kadro dışı) | 5,4 | 7,6 | 6,3 | 5,9 | 25,2 | %5 |
| Ofis, araç, cihaz, muhasebe | 12,7 | 8,7 | 4,7 | 4,7 | 30,7 | %6 |
| Beklenmedik (%8) | 7,1 | 9,3 | 11,4 | 12,6 | 40,4 | %7 |
| **Toplam** | **96,3** | **126,2** | **153,3** | **169,5** | **545,2** | **%100** |

Üç okuma: (1) **Maliyetin üçte ikisi insandır** (%63); bütçeyi yönetmek işe alım tetikleyicilerini yönetmektir (§5.2). (2) **AI ve altyapı birlikte %10'dur**; ama ikisi kullanıcıyla büyüyen tek kalemdir ve dolar bazlıdır (A12'de aylık AI 186 bin TL ≈ 4,1 bin $). (3) **12 aylık net gelir ≈109 bin TL'dir, gideri %0,4 karşılar**: yılın amacı gelir değil kanıttır (§6.4–§6.6). SMS kalemi, kayıt başına 0,75 TL ile ihmal edilebilir; asıl SMS riski istismar (R16) ve bütçe tavanıdır.

### 6.3 Üç senaryo

| Parametre | Muhafazakâr | Baz | İyimser |
|---|---|---|---|
| Aylık yeni kayıt (A3 → A12) | 400 → 2.500 | 1.000 → 8.000 | 1.500 → 20.000 |
| D1 / D7 / D30 | %35 / %12 / %4 | %45 / %20 / %8 | %50 / %25 / %12 |
| DAU/MAU | 0,25 | 0,30 | 0,35 |
| Ödeyen oranı (MAU) ve Çip sepeti | %1,0 ve 105 TL | %2,0 ve 123 TL | %3,5 ve 140 TL |
| AI $/DAU/gün (A12) | 0,075 (kaldıraçsız) | 0,035 | 0,025 |
| Lisans paketi (A12 kümülatif) | 0 | 28 | 60 |
| Pazarlama çarpanı | ×0,6 | ×1,0 | ×1,5 |
| Sözleşmeli eğitmen saati / ay (A4+; B3 kalibrasyon ihtiyacı) | 60 | 100 | 100 → 200 (A7+) |
| FTE (A12) | 7,5 | 11,5 | 13,5 |

| Senaryo | A12 kayıtlı | A12 DAU (ay sonu) | A12 MAU | 12 ay net gelir (bin TL) | 12 ay gider (milyon TL) | 12 ay gider (bin $) | Net yakım (milyon TL) | A6 küm. gider (M TL) | A9 küm. gider (M TL) |
|---|---|---|---|---|---|---|---|---|---|
| Muhafazakâr | 13.200 | 517 | 1.980 | 7 | 19,5 | 434 | 19,5 | 9,1 | 14,3 |
| **Baz** | **40.500** | **2.655** | **8.372** | **109** | **24,5** | **545** | **24,4** | **10,0** | **16,9** |
| İyimser | 95.000 | 9.122 | 24.300 | 649 | 29,8 | 661 | 29,1 | 10,8 | 19,7 |

Aylık toplam gider (bin TL ve bin $, A2–A12 aralığı): muhafazakâr 1.293–1.936 (28,7–43,0 bin $), baz 1.301–2.647 (28,9–58,8 bin $), iyimser 1.312–3.534 (29,2–78,5 bin $); A1 kuruluş ve cihaz yüküyle her senaryoda 1.598 (35,5 bin $). Üç senaryo arasındaki gider farkı küçüktür (19,5–29,8 M TL) çünkü maliyet ekip kararlarıyla belirlenir; gelir farkı ise 100 katı aşar. Bu, riskin **talep tarafında** olduğunu ve ekibin tetikleyiciyle büyütülmesi gerektiğini gösterir.

### 6.4 Birim ekonomi

**SMS/kayıt:** 3 SMS × 0,25 TL = **0,75 TL** (OTP, yeniden gönderme, 15–17'de ebeveyn linki); MAU başına yeniden giriş OTP'si 0,05 TL/ay. **Çip paket karması** (B2 §9.3 paketleri; 15–17'de büyük paketler ebeveyn onaylı olduğu için küçük paket ağırlıklı):

| Paket | Çip | TL | TL / 100 Çip | Karma (baz) | Sepete katkı (TL) |
|---|---|---|---|---|---|
| Avuç | 100 | 59,99 | 59,99 | %60 | 36,0 |
| Kutu | 260 | 149,99 | 57,69 | %28 | 42,0 |
| Sandık | 560 | 299,99 | 53,57 | %9 | 27,0 |
| Konteyner | 1.200 | 599,99 | 50,00 | %3 | 18,0 |
| **Ağırlıklı sepet** | ≈205 taban Çip (bonus dâhil ≈219) | | | | **123,0 TL ≈ ARPPU 120 TL/ay** |

Brüt sepetten net gelire: ÷1,2 (KDV) − PSP komisyonu (≈%2,9 + 0,25 TL) − iade payı ≈ **0,80 × brüt ≈ 98 TL**. Aylık ödeyen oranı MAU üzerinden %2'dir (B2'nin %2–3 aralığının alt ucu): ARPU (MAU başına, aylık) 2,46 TL brüt, 1,97 TL net; DAU başına ayda 6,6 TL, günde **0,22 TL ≈ 0,005 $ (ARPDAU)**.

| Büyüklük | Muhafazakâr (A12) | Baz, lansman (A3–A8) | Baz (A12) | İyimser (A12) |
|---|---|---|---|---|
| AI maliyeti, $/DAU/gün | 0,075 | 0,057 | 0,035 | 0,025 |
| AI maliyeti, TL/DAU/ay | 101 | 77 | 47 | 34 |
| Altyapı + SMS, TL/DAU/ay | 20 | 18 | 18 | 18 |
| **Değişken maliyet, TL/DAU/ay** | **121** | **95** | **66** | **51** |
| Ödeyen oranı (MAU) / sepet (TL) | %1,0 / 105 | %2,0 / 123 | %2,0 / 123 | %3,5 / 140 |
| ARPU, MAU başına aylık (net, TL) | 0,84 | 1,97 | 1,97 | 3,92 |
| **Gelir, TL/DAU/ay (net)** | **3,4** | **6,6** | **6,6** | **11,2** |
| ARPDAU, TL/gün ($/gün) | 0,11 (0,0025) | 0,22 (0,0049) | 0,22 (0,0049) | 0,37 (0,0083) |
| **Katkı marjı, TL/DAU/ay** | **−118** | **−89** | **−59** | **−40** |
| Oyuncu başına aktif gün (12 ay) | 8,1 | 13,9 | 13,9 | 20,8 |
| 12 ay net gelir / oyuncu (LTV) | 0,9 TL | 3,0 TL | 3,0 TL | 7,8 TL |
| 12 ay AI maliyeti / oyuncu | 27 TL | 36 TL | 22 TL | 23 TL |
| CAC (pazarlama ÷ kayıt) | 75 TL | 41 TL | 41 TL | 26 TL |
| LTV ÷ (CAC + AI) | 0,01 | 0,04 | 0,05 | 0,16 |

**Bulgu: B2C kozmetik geliri tek başına değişken maliyeti bile karşılamıyor.** Baz senaryoda DAU başına gelir 6,6 TL iken yalnızca AI maliyeti 47–77 TL'dir; her oyuncu bir yılda 3 TL net gelir getirip 22–36 TL AI ve 41 TL edinim maliyeti yaratır. Bu bir hata değil, "pay-to-learn yok, Çip yalnızca kozmetik" ilkesinin ve 15–25 yaş TL gelirli kitlenin doğal sonucudur; B2 §9.3 de Çip'i "ilk 6 ayda gelir modeli değil, ödeme isteği ölçümü" olarak konumlamıştır. Tek başına hiçbir çözüm yetmez; dört kaldıraç birlikte gerekir.

| Kaldıraç | Mekanizma | Beklenen etki | Sürüm | Koşul |
|---|---|---|---|---|
| **1. AI maliyet mühendisliği (S4 üstü)** | B3 §11.8'in S2–S4 kaldıraçları lansmanda zaten açıktır (0,0747 → 0,0569); üstüne Haiku-first cascade (belirsiz/yüksek riskli vakada Sonnet), sınıflandırıcı-önce puanlama (altın küme büyüdükçe gömme + sınıflandırıcı), semantik sonuç önbelleği, kota ayarı | $/DAU 0,057 → 0,035 (A12) → ≤0,01 (A18+); yani −%40 ile −%85 | v1.2 gölge → v2 | Kappa ≥0,75, itiraz <%3 korunur (B3 §6) |
| **2. Kurumsal gelir** | Okul/kulüp lisansı (yönetim ve rapor), kurumsal koltuk sponsorluğu | Lisanslı DAU başına ≈83 TL/ay (5 koltuk × 200 TL/yıl) | v1.2 | Para kazanma ilkesi ek maddesi (Ek A) |
| **3. Hibe ve yatırım** | TÜBİTAK, KOSGEB, Teknokent, melek/seed | Yıl 1–2 açığını finanse eder | A1 → | §6.6 |
| **4. Maliyet yapısı** | Tetikleyiciye bağlı işe alım; Teknokent teşvikleri; bulut/AI kredileri | Sabit gider −%8–12 | A1 → | Yerleşim ve mevzuat teyidi |

### 6.5 Başabaş noktası

Aylık katkı marjı: `KM(DAU-ay) = Çip_net + s × Lisans − (AI + altyapı + SMS)`; başabaş DAU = `Sabit gider / KM`. Aşağıdaki tablo **ölçek koşullarını** kullanır: sabit gider 3,5 M TL/ay (yıl 2–3 yapısı, ≈22 FTE), altyapı DAU başına 0,15 $/ay (ölçek ekonomisi), SMS 1,5 TL, Çip ödeyen oranı %3 ve sepet 130 TL (DAU/MAU 0,33), lisans 5 koltuk/DAU × 200 TL/yıl. Hücre: başabaş DAU (katkı marjı, TL/DAU/ay).

| AI $/DAU/gün | AI TL/DAU/ay | Lisanslı DAU payı %0 | %15 | %30 | %45 |
|---|---|---|---|---|---|
| 0,080 | 108 | yok (−107) | yok (−94) | yok (−82) | yok (−69) |
| 0,050 | 68 | yok (−66) | yok (−54) | yok (−41) | yok (−29) |
| 0,020 | 27 | yok (−26) | yok (−13) | yok (−1) | ≈299 bin DAU (+12) |
| 0,010 | 14 | yok (−12) | pratikte yok (+0) | ≈275 bin DAU (+13) | ≈139 bin DAU (+25) |
| 0,005 | 7 | yok (−6) | ≈503 bin DAU (+7) | ≈180 bin DAU (+19) | ≈110 bin DAU (+32) |

Okuma: (a) **Bugünkü koşullarla (AI ≥0,035 $) lisanslı DAU payı %45'e çıksa bile başabaş yoktur.** (b) Başabaş ancak AI maliyeti ≈0,01 $'a ve lisanslı DAU payı ≥%30'a ulaşırsa mümkündür; o hâlde bile ≈140–275 bin DAU gerekir (baz A12 DAU'sunun 50–100 katı). (c) **Yalnızca lisansla** 12. ay maliyet yapısını (≈21,6 M TL/yıl) karşılamak için 200 TL/koltukla ≈108 bin koltuk, yani yılda ≈3.600 sınıf paketi gerekir; Türkiye'deki lise ve üniversite öğrenci sayısı düşünüldüğünde bu ulaşılabilir bir pazar payıdır ama 12 ayda değil. (d) Sabit gider tarafı da bir kaldıraçtır: ekibi tetikleyiciyle büyütmek (§5.2) ve hibe/teşvik, başabaş DAU'yu sabit giderle aynı oranda düşürür. **Karar:** ilk yıl KodKent'i bir kâr makinesi olarak değil, üç hipotezin kanıtı olarak finanse ediyoruz: (H-A) 15–25 yaş kitle haftalık kod yazıyor (HKO), (H-B) okul/kulüp kurumsal ödeme istiyor, (H-C) AI maliyeti ≤0,02 $/DAU/gün'e inebiliyor. Bu üçü tutmazsa ürün küçültülür (AI kotası, ekip) ya da kurumsal sponsorlu bir sosyal girişime çevrilir.

### 6.6 Finansman

| Kaynak | Tutar (planlama) | Zamanlama | Olasılık | Not |
|---|---|---|---|---|
| Kurucu katkısı | 1,0 M TL nakit | A1 | — | Maaş erteleme ayrıca yok |
| **Pre-seed (melek / erken aşama fon)** | 18 M TL (≈400 bin $) | Kapanış A1–A2; ikinci yarı A6'ya bağlı | Ana plan | %15–20 pay varsayımı; yerel melek ağları ve erken aşama oyun/edtech fonları |
| TÜBİTAK 1812 BiGG Yatırım | ≈1,35 M TL yatırım | Başvuru A1–A3; ödeme A4–A6 | %25 | 2026 çağrılarında %3 hisse karşılığı; 1512 hibe (eski çağrıda 200 bin TL) ile birlikte alınamayabilir; çağrı metninden teyit |
| KOSGEB Girişimci Destek Programı | ≈1,0 M TL (üst sınır 2 M TL) | A1–A4 başvuru, A5–A9 ödeme | %35 | Hibe + faizsiz geri ödemeli + kredi bileşenleri; dönemsel çağrılar |
| Teknokent teşvikleri | Maaş maliyetinde −%8–12 (≈1,2–1,8 M TL/yıl) | Yerleşimden itibaren | %60 | 4691/5746 sayılı kanunlar; Ar-Ge personeli şartı; teyit |
| Bulut ve AI kredileri | ≈0,5–0,7 M TL | A1–A12 | %40 | Girişim programları (Microsoft, Google, AWS; AI sağlayıcısı girişim programı varsa) |
| Kurumsal sponsor / koltuk bağışı | ≈1,5 M TL | A6–A12 | %30 | CSR; öğrenme erişimini değiştirmez |
| **Seed turu** | 750 bin–1,2 M $ | Hazırlık A8, kapanış A10–A12 | Hedef | Tetikleyici: HKO ≥2.500, D30 ≥%10, ≥30 lisans paketi, AI ≤0,045 $ |

**Tranşlar.** *Tranş 1 (A1–A6):* 10,0 M TL (222 bin $) ile MVP ve v1.1'in ilk yarısı; kaynak pre-seed'in ilk yarısı + kurucu + erken hibe. *Tranş 2 (A7–A12):* 14,5 M TL (323 bin $) ile v1.2 ve v2; tetikleyici G4 sonrası D30 ≥%8 ve HKO ≥800. *Tranş 3 (A13+):* seed. Baz senaryoda tanımlı kaynaklar (pre-seed 18 + kurucu 1,0 + BiGG 1,35 + KOSGEB 1,0 = 21,4 M TL), 12 aylık gideri (24,5 M TL) ve 3 aylık tamponu (≈7,6 M TL) karşılamaz: **runway ≈10,4 ay**, açık ≈10,8 M TL. Açığı seed turu, Teknokent, sponsor ve bulut kredileri kapatır; kapanmazsa kesme çizgisi ve muhafazakâr senaryoya geçilir (R11). **Kur riski:** AI ve altyapı dolar bazlıdır, gelir ve hibe TL'dir; yatırım dolar bazlı alınırsa doğal hedge oluşur.


---

## 7. Pazara giriş

### 7.1 Strateji: önce kohort, sonra içerik, sonra ölçek

KodKent'in dağıtım problemi "ilk 1.000 oyuncuyu bulmak" değil, **onları aynı shard'a koymaktır**: boş şehir en büyük erken risktir (VİZYON §12, R4). Bu yüzden edinim bireysel değil **kohort** esaslıdır: her kulüp ve sınıfın bir kodu vardır; aynı koddan gelenler aynı Meydan shard'ına, aynı lige ve aynı kulüp liderliğine düşer. Dört halka sırayla açılır: (1) üniversite ve lise kulüpleri ile öğretmenler (güvenilir, düşük maliyetli, örgütlü); (2) Türkçe C# içerik üreticileriyle "Otopark'ı yaz" videoları (talep yaratır); (3) etkinlikler (Teknofest, Hour of Code) ve basın (itibar); (4) davet kodu ve gösteriş döngüsü (organik büyüme). Yaş kapısı bu sıralamayı etkiler: e-Devlet belirteci 15–17 yaşta ebeveyn gerektirdiği için ilk 1.000 oyuncunun yaklaşık %60'ı 18+ (üniversite toplulukları), %40'ı 15–17 (lise kulüpleri ve öğretmenler) olarak planlanmıştır.

### 7.2 Kanal tablosu

| Kanal | Mekanizma | İlk 1.000'e katkı | Sonraki aylık kayıt (A4–A6) | Birim maliyet (planlama) | Ana risk |
|---|---|---|---|---|---|
| Üniversite yazılım toplulukları | 6 kulüp × ≈40 üye; 90 dakikalık "Otopark'ı yaz" atölyesi; kulüp kodu, kulüp liderliği | ≈240 | 600–900 | Etkinlik kiti + yemek ≈ 8.000 TL/kulüp | Dönem sonu sınavları, kulüp yönetimi değişimi |
| Lise bilişim kulüpleri ve öğretmenler | 4 lise × ≈25 + 20 öğretmen × ≈12; 45 dk ders planı kiti, veli bilgilendirme metni | ≈340 | 400–700 | Kit baskısı + yol ≈ 3.000 TL/okul | Okul idaresi izni, veli ebeveyn adımını tamamlamaz |
| Türkçe C# YouTube kanalları | 3 kanal, "Otopark'ı yaz" canlı kodlama videosu; kanal başına ≈30 bin izlenme × %0,7 kayıt × %70 yaş kapısı | ≈350–450 | 300–500 | Kanal başına 25–60 bin TL (iş birliği etiketli) | Çocuklara yönelik reklam kuralları (§8.4), dönüşüm tahmini |
| Discord, Reddit, X, TikTok, Instagram (organik) | Kısa klipler: LED panoda akan çıktı, 119/120 anomalisi, ilk Açılış anı | ≈150 | 300–500 | İçerik üretimi (kadro) | Organik erişim dalgalıdır; 18 yaş altına ücretli kişiselleştirilmiş reklam yapılmaz |
| Davet kodu | İki tarafa 100 B; hedef K-faktörü 0,15–0,25 | ≈100–150 | Kayıtların %10–20'si | Bayt (sistemden) | Kötüye kullanım (çoklu hesap): cihaz ve telefon sınırı |
| Basın ve topluluk haberleri | Teknoloji sitelerine "Türkçe C# oyunu" haberi, Teknofest | ≈100 | 200–400 | PR kadro içi | Haber döngüsü kısa |

Toplam hedef **≈1.380**; 1.000 kayıt için %38 tampon vardır, çünkü yaş kapısı kaybı en belirsiz parametredir. Aylık kayıt hedefleri baz senaryodur (§6.3).

### 7.3 İlk 1.000 oyuncu planı

| Hafta | Eylem | Kümülatif hedef | Ölçüm |
|---|---|---|---|
| H1–H4 | 30 kulüp ve öğretmenle görüşme, 10 sözlü anlaşma; Discord sunucusu; 3 içerik üreticisine ilk temas; öğretmen kiti taslağı | — | Görüşme → anlaşma dönüşümü ≥%30 |
| H5–H8 | Kâğıt testi (H4) sonrası 20 öğrencilik pilot; kiti son hâle getirme; Teknofest başvurusu (pencere açıksa) | — | Pilot ders terk <%15 |
| H9–H10 | **Kapalı beta**: 10 kulüp kodu × ≈20 kişi; her gün Discord geri bildirim; D1/D7 ölçümü | 200 | G3 eşikleri (§3.5) |
| H11 | Yumuşak yayın: kulüp kodları + davet kodlu açık kayıt; moderasyon vardiyası başlar | 500 | Yaş kapısı geçişi ≥%70 |
| H12 | **Açık yayın**: 3 video, basın bülteni, Discord duyurusu; ilk Açılış hikâyesi ("3 gün önce başlayan Efe") | 1.000 | 72 saat Açılış ≥%35 |
| H13–H24 | Kulüp sayısı 10 → 40, öğretmen kiti 20 → 60; aylık yeni video; Sezon 1 | 7.000 (A6 sonu) | CAC ≤40 TL/oyuncu; kohort D30 ≥%12 |

Kulüp kohortunun D30'u bireysel kayıttan yüksek beklenir (aynı sınıf/kulüpte sosyal baskı); bu fark ölçülür ve kulüp kanalına yatırımın gerekçesidir (deney E7, §9.6).

### 7.4 Mesaj ve içerik

Her kanalda aynı üç kanıt anı kullanılır: **(a)** 12. dakikada kendi `Console.WriteLine` çıktının LED panoda akması; **(b)** Otopark Açılışı ve tabelada adın; **(c)** kodun Visual Studio'ya yapıştırıldığında aynen derlenmesi. İçerik üreticileri için tek bir meydan okuma kurulur: "Otopark'ı 30 dakikada yaz — 119 dakika neden 200 TL?" (Keskin Göz anomalisi merak boşluğu yaratır). Çocukları hedefleyen hiçbir mesajda "garanti iş", "kısa sürede maaşlı yazılımcı" ya da "ücretsiz kurs sertifikası" iddiası kullanılmaz (§8.4). Her içerik üreticisi iş birliğini açıkça etiketler.

### 7.5 Takvim çapaları

| Dönem (A1 = Ocak 2027) | Olay | KodKent eylemi |
|---|---|---|
| A1–A2 | TEKNOFEST başvuru penceresi (2026'da 15 Ocak–20 Şubat idi; 2027 takvimi teyit edilecek) | Eğitim Teknolojileri Yarışması'na kavram + demo videosuyla başvuru |
| A3 (Mart) | Ramazan Bayramı ≈9–11 Mart, yani H10 (tarih teyit) | Beta H9'da başlar, bayram haftasında yalnızca hata düzeltme ve Discord; ikinci dalga H11, açık yayın H12; bayram kayarsa tampon H13'ün ilk yarısı |
| A5 (Mayıs) | Kurban Bayramı; LGS/YKS hazırlık dönemi | "Sınav dönemi" sakin bildirim modu; Günlük Tekrar 3 dk vurgusu |
| A6 (Haziran) | Okul kapanışı | v1.1 çıkışı, Sezon 1, yaz etkinliği |
| A7–A8 | Yaz tatili; TEKNOFEST final etkinlikleri (tarih/şehir teyit) | Stand ve sunum; Kod Düellosu yaz ligi |
| A9 (Eylül) | Okul açılışı | v1.2, "Yeni Dönem" kulüp kampanyası, öğretmen lisansı pilotu → en büyük kayıt dalgası |
| A12 (Aralık) | Hour of Code haftası (Aralık'ın ilk yarısı) | Misafir Modu (hesapsız 1 saatlik deneyim) ile kampanya |

### 7.6 Okul ve kulüp kanalı: model

Öğretmen paneli v1.1'de, ücretli lisans v1.2'de gelir; **öğrenci hesapları okul adına açılmaz**, öğrencinin kendi hesabıdır ve kulüp koduyla sınıfa bağlanır. Bu yüzden KodKent veri sorumlusu kalır; öğretmen paneli yalnızca ilerleme özetini (ders, görev, altın durak, işletme durumu) gösterir ve 18 yaş altında öğrenci/veli bilgilendirmesine tabidir (§8.3). Fiyat çerçevesi (planlama): Sınıf Paketi 30 öğrenci 4.500 TL/yıl; Kulüp Paketi 30–60 öğrenci 3.000 TL/yıl; Okul Paketi 200 öğrenci 24.000 TL/yıl (≈120–150 TL/öğrenci/yıl). Alıcı sırası: özel okullar ve kodlama kursları, belediye gençlik merkezleri, vakıflar; MEB resmî onay süreci uzun olduğundan MVP ve v1.1'de öğretmen inisiyatifi yeterli kabul edilir. **Kırmızı çizgi:** lisans yalnızca yönetim ve raporlama özelliği satar; ders, ipucu, test, AI kotası ve Savunma hakkı ücretsiz kalır (Ek A: para kazanma ilkesi netleştirmesi).


---

## 8. Hukuki ve uyum

### 8.1 Mevzuat gelişmesi: 15 yaş sınırı ve oyun platformu rejimi

**Bu bölüm KANON v1'den sonra ortaya çıkan ve KANON §1 ile §6'yı etkileyen tek dış gelişmeyi anlatır.** Aşağıdaki bilgiler 2026-11-03 itibarıyla haber ve hukuk bürosu özetlerinden derlenmiştir; kaynaklar arasında Resmî Gazete sayısı ve bazı ayrıntılar tutarsızdır. **Birincil metin (7578 sayılı Kanun'un ilgili maddeleri, kaynaklarda md. 2, 21–23 ve 27 olarak anılıyor; 10 Ekim 2026 tarihli yönetmelik) G0 kapsamında hukuk danışmanınca doğrulanacaktır.**

| Başlık | Bilinen (özet) | Belirsiz |
|---|---|---|
| Dayanak | 7578 sayılı Kanun (kabul 22 Nisan 2026, Resmî Gazete 1 Mayıs 2026) 5651 sayılı Kanun'a "oyun, oyun dağıtıcı, oyun geliştirici, oyun platformu" tanımlarını ve yeni yükümlülükleri ekledi; sosyal ağ sağlayıcı ve oyun platformu yükümlülükleri **1 Kasım 2026**'da yürürlüğe girdi. Cumhurbaşkanlığı Siber Güvenlik Başkanlığı'nın hazırladığı yönetmelik 10 Ekim 2026'da yayımlandı (bir kaynağa göre adı "Sosyal Ağ Sağlayıcı Tarafından Çocuklara Özgü Ayrıştırılmış Hizmet Sunulmasına ve Yaş Doğrulamaya İlişkin Yönetmelik") | Resmî Gazete sayısı (kaynaklarda 33240 / 32240); yönetmelik adının ve numarasının resmî metni |
| Sosyal ağ sağlayıcı | 15 yaşını doldurmamış çocuğa hizmet **sunamaz**; hesap açılışında yaş doğrulaması şart; 15+ için "ayrıştırılmış hizmet"; ebeveyn kontrol araçları (süre sınırı, harcama limiti, satın alma ve ücretli üyelik onayı); mevcut hesaplarda doğrulama son tarihi 31 Mart 2027, doğrulanamayan hesaplar kapatılır ve verisi silinir | **KodKent'in Meydan sohbeti, ziyaret ve Vitrin özelliklerinin bu tanıma girip girmediği**; oyun içi sohbetin kapsamda anılmaması |
| Yaş doğrulama | e-Devlet üzerinden Siber Güvenlik Başkanlığı'nın sunacağı **belirteç**; yalnızca 15 ve 18 eşik bilgisini taşır, ad ve profil içermez | Üçüncü taraf küçük servislerin entegrasyon koşulu ve takvimi |
| 15–18 yaş "ayrıştırılmış hizmet" | Varsayılan en yüksek gizlilik, profil kamuya açık olamaz; mesaj yalnızca karşılıklı takipleşilenlerden; "görüldü" bilgisi yok; canlı yayın yok; profile dayalı kişiselleştirilmiş reklam yok; rehber eşleştirme ve takip önerisi yok; ekran görüntüsünü engelleyici teknik önlemler | Ekran görüntüsü önleminin web uygulamasında nasıl karşılanacağı |
| Oyun platformu (Ek Madde 5) | Yaş derecelendirmesi (derecelendirilmemiş oyun sunulamaz ya da en yüksek yaş kriteriyle sunulur; aktarımlar farklı); ebeveyn kontrol araçları; BTK bilgi talebine 15 gün; sosyal ağ ve oyun dağıtıcılar için risk değerlendirmesi ve BTK'ya bildirim; yurt dışı kaynaklı ve günlük erişimi 100 binden fazla olanlar için temsilci | Derecelendirmeyi kimin ve hangi sistemle yapacağı; yerli küçük geliştirici eşiği (görünmüyor) |
| Yaptırım | Oyun platformlarında önce bildirim, 30 gün içinde uyulmazsa 1–10 milyon TL, tekrarında 10–30 milyon TL idari para cezası; sonrasında bant daraltma (%30–%50, kaynaklara göre %90'a kadar). Sosyal ağ sağlayıcılarında önce idari para cezası, ardından reklam yasağı ve bant daraltma | Sosyal ağ cezalarının tutarı |

**KodKent'e etkisi.** (1) KANON §1'deki "13 altı kayıt olamaz; 13–17 için veli onayı" artık yetmeyebilir: 15 altına hizmet vermek yasak olabilir. (2) Giriş ekranına SMS OTP'ye ek bir e-Devlet adımı girer; 15–17 yaşında bu adım ebeveyn gerektirir ve ilk 30 dakikanın sürtünmesini artırır. (3) KodKent'in mevcut "güvenli mod" tasarımı yönetmeliğin büyük kısmını zaten karşılar (ticaret yok, reklam yok, link yok, görsel yükleme yok); eksikler: varsayılan profil gizliliği, "görüldü" bilgisinin olmaması, harcama limiti ve satın alma onayı, derecelendirme, BTK bildirimi. (4) Ebeveyn Paneli KANON'da olmayan bir ekrandır (Ek A).

| Seçenek | Açıklama | Artı | Eksi | Karar |
|---|---|---|---|---|
| **A: 15+ tam ürün** | 15 altı kayıt yok; 15–17 ayrıştırılmış hizmet; 18+ tam | Hukuken en güvenli; en az geliştirme | Lise 9. sınıfın yarısı ve ortaokul dışarıda; kitle ≈ %25–30 küçülür | **MVP varsayılanı** |
| **B: A + 13–14 "Akademi Modu"** | 13–14 yaşa yalnızca ders, görev ve kendi işletmesi; sohbet, ziyaret, Vitrin, liderlikte kimlik yok | Kitleyi korur; KANON'un 13 sınırı kısmen yaşar | Hukuki belirsizlik; ≈8–10 mühendis günü; öğretmen kanalı için değer yüksek | Yalnızca G0'da **yazılı hukuk onayı** gelirse v1.1'de, A/B olarak |
| **C: 18+ ile başla** | Kapalı beta yalnızca üniversite toplulukları; belirteç hazır olunca 15–17 açılır | Belirteç erişilemezse bile yayın mümkün | Lise kanalı ve D7 verisi gecikir | **Yedek** (G0'da belirteç erişilemezse) |

Yaş eşiği sabit kodlanmaz: `age_gate_min` ve `age_modes` özellik bayraklarıdır; hukuki sonuç değiştiğinde sürüm beklenmeden ayar yapılır.

### 8.2 Yaş kapısı v2 ve Ebeveyn Paneli

**Akış.** (1) Telefon + SMS OTP (KANON §6 Giriş). (2) *Yaş doğrulama:* oyuncu e-Devlet'e yönlenir, belirteç döner: *<15*, *15–17* ya da *18+*; KodKent doğum tarihini saklamaz, yalnızca eşik ve doğrulama tarihini yazar (veri en aza indirme). (3) *<15:* nazik red ve bilgilendirme (A seçeneğinde); *18+:* tam hizmet; *15–17:* ebeveyn telefonu istenir, SMS linki gider (72 saat; KANON), ebeveyn OTP ile Ebeveyn Paneli'ne girer. (4) Oyun kilitsiz başlar (öğrenme bekletilmez, KANON ve VİZYON §14 karar 16); **ebeveyn onayına kadar** ziyaret kabulü, DM, serbest metin, Vitrin görünürlüğü ve Çip harcaması kapalıdır.

**15–17 hesap varsayılanları (ayrıştırılmış hizmet):**

| Özellik | 15–17 varsayılanı | Ebeveyn açabilir mi | 18+ |
|---|---|---|---|
| Profil ve Rozet Duvarı | Yalnızca arkadaşlar | Hayır (gizlilik kuralı) | Herkese açık |
| Vitrin kod görünürlüğü | Kapalı (yalnızca arkadaş/kulüp) | Evet, arkadaşlar | Açık (L2+) |
| İşletme tabelası ve Turist modu | Takma ad + unvan; Turist modunda varsayılan gizli | Evet (opt-in) | Açık |
| Meydan sohbeti | Emote + hazır cümle | Serbest metin (izinle) | Serbest metin, filtreli |
| DM | Yalnızca karşılıklı arkadaş; "görüldü" bilgisi yok | — | Arkadaş |
| Arkadaş önerisi, rehber eşleştirme | **Hiçbir yaşta yok** (yalnızca kod/QR/davet) | — | — |
| Çip harcaması | Limit varsayılan 0; ebeveyn limit koyar ve her satın almayı onaylar | Evet | Tavan yok; 1.000 TL/ay üzerinde bilgilendirme (B2 §9.3) |
| Kullanım süresi | Ebeveyn belirler | Evet | Kullanıcı belirler |
| Bildirim saatleri | 21:00–08:00 sessiz | Evet | Kullanıcı belirler |
| Ekran görüntüsü | Teknik engel yok; kimlik gösteren alan olmaz (yalnızca takma ad); hukuk teyidi | — | — |

Ebeveyn Paneli telefonda açılan hafif bir web sayfasıdır: süre limiti, harcama limiti ve satın alma onayı, sohbet/DM izni, haftalık öğrenme özeti (ders, görev, altın durak), hesap silme talebi. Hesap ve veri sahibi ebeveyn değil çocuktur; panel yalnızca bu kontrolleri verir.

### 8.3 KVKK

KodKent **veri sorumlusudur**; SMS sağlayıcı, bulut barındırıcı, ödeme kuruluşu ve Anthropic **veri işleyen** ya da alıcıdır. Aydınlatma metni iki sürümle yazılır (yetişkin ve "çocuk dostu", ≤300 kelime) ve Giriş ekranında kabul gerektirmeden gösterilir; açık rıza yalnızca zorunlu olmayan işlemlere (pazarlama, isteğe bağlı analitik) sorulur. Hesap, güvenlik ve moderasyon sözleşmenin ifası ve meşru menfaate dayanır. VERBİS için "50'den az çalışan ve 100 milyon TL'den az bilanço" muafiyeti geçerliyse kayıt gerekmez; hukuk teyit eder.

**Claude API aktarımı.** Anthropic'e yalnızca cevap metni, kod ve soru kimliği gider; telefon, takma ad, yaş eşiği gitmez. Yine de Ders 1.1 oyuncudan adını kodun içine yazmasını istediği için **cevap metni kişisel veri içerebilir**: B3 §11.9'daki K1 süzgeci telefon, e-posta, 11 haneli TC kimlik no ve IBAN'ı `[KİŞİSEL]` ile maskeler; kişi adı için (Ders 1.1 gibi) ek bir kural/sınıflandırıcı gerekir ve G1'e kadar B3 ile eklenir. Yurt dışı aktarım KVKK md. 9'un 2024'te değişen rejimine (yeterlilik kararı yoksa standart sözleşme ve imzadan sonra 5 iş günü içinde Kurum'a bildirim) tabidir; sözleşme ve politika paketi G0 ile birlikte hukuka verilir. Kurul puanı tek başına otomatik bir "karar" sayılabileceği için itiraz hattı (soru başına 1, günde 3; insan örneklemesi) hukuki bir güvence olarak da belgelenir.

| Veri | Saklama | Not |
|---|---|---|
| Telefon numarası | Hesap açık olduğu sürece; silme isteğinden sonra en çok 30 gün (yedek) | Hash'li tekil anahtar + şifreli saklama |
| Yaş | Yalnızca eşik (<15, 15–17, 18+) ve doğrulama tarihi | Doğum tarihi saklanmaz |
| Ebeveyn telefonu ve onay kaydı | Onay süresince + 2 yıl (ispat) | Hash'li |
| Ders cevapları ve kod | 12 ay; altın kümeye alınanlar anonimleştirilir | Silme talebinde kümeden kimlik ayrılır (VİZYON açık soru 8) |
| Sohbet metni | 90 gün; şikâyetli olanlar dosya kapanana kadar | — |
| Erişim/trafik kayıtları | 5651 yükümlülüğüne göre (hukuk teyidi; varsayım 12 ay) | — |
| Ödeme ve fatura | VUK süreleri (10 yıl); kart verisi KodKent'te tutulmaz | Barındırılan ödeme sayfası |
| Analitik olaylar | Ham olay 13 ay (B7 `analytics.events`); takma kimlikle, ad/telefon içermez; rıza kapısı | §9.7 |

İhlal bildirimi KVKK Kurulu'na 72 saat içinde yapılır; sızma testi sonuçları ve olay müdahale planı kapalı beta öncesi hazır olur (H10). **Barındırma konumu açık bir karardır:** A-vizyon-urun varsayımı birincil verinin Türkiye'de tutulmasıdır; B7 ADR-15 ise maliyet nedeniyle Hetzner Falkenstein (Almanya) önerir ve Türkiye-içi sağlayıcıya taşıma runbook'unu hazır tutar. Hetzner'de telefon numarası, takma ad ve ders kayıtları da yurt dışına aktarılmış sayılır; KVKK md. 9 güvenceleri ve ebeveyn güveni açısından 15–17 yaş verisinin yurt içinde tutulması tercih edilir. Karar G0 paketine eklenir; bütçede altyapı kalemi B7'nin Hetzner tahmininin yaklaşık iki katı marjla planlanmıştır (§6.2). 5651 kapsamında sosyal ağ sağlayıcılarına yönelik bir veri yerelleştirme yükümlülüğü olup olmadığı da G0'da teyit edilir.

### 8.4 Ticari ileti ve reklam

OTP, ebeveyn linki ve güvenlik bildirimleri **hizmet iletisidir** ve onay gerektirmez. Pazarlama niteliğindeki SMS, e-posta ve çağrı 6563 sayılı Kanun ve İYS kapsamında önceden onay ister; 18 yaş altına MVP ve v1.1'de hiç pazarlama iletisi gönderilmez. PWA bildirimleri (kasa dolu, Günlük Tekrar, Hata Bildirimi) hizmet içeriklidir, izne bağlıdır ve 21:00–08:00 arasında gönderilmez. Uygulama içi reklam yoktur ve konmaz; profillemeye dayalı kişiselleştirilmiş reklam 15–17 hesapta zaten yasaktır. İçerik üreticisi iş birliği açıkça etiketlenir; "iş garantisi", "kısa sürede maaşlı yazılımcı", "resmî sertifika" gibi çocuklara yönelik iddialar kullanılmaz (Reklam Kurulu ve ticari reklam yönetmeliği; hukuk teyidi).

### 8.5 Çocuk koruma ve moderasyon

Moderasyon basamaklarının sahibi B6'dır; B9 yalnızca sınır koşullarını koyar. (1) Kullanıcı üretimi metin yalnızca takma ad, sohbet, ziyaretçi defteri ve Vitrin notlarıdır; link, görsel ve ses yoktur. (2) Telefon, adres, sosyal medya hesabı ve "gizli kanala geç" kalıpları filtrelenir. (3) 3 şikâyet otomatik gizleme + insan kuyruğu; **ağır şikâyetler** (cinsel içerik, tehdit, kendine zarar, yetişkin–çocuk yazışması şüphesi) B6 §12.3'teki **P0** sınıfıdır: ilk yanıt 1 saat, çözüm 24 saat, 7/24 nöbet. MVP'de 08:00–24:00 insan moderatör vardiyası, geceleri otomatik gizleme + nöbetçi mühendis/moderatörün telefon nöbeti. (4) Kriz ifadesinde Usta oyundan çıkar ve güvenlik metni gösterir (112 ve Alo 183 yönlendirmesi; uzman teyidiyle). (5) Çocuk istismarı materyali ya da grooming şüphesinde delil korunur, hesap dondurulur, yetkili mercilere bildirim hukuk prosedürüyle yapılır. (6) Moderatörler ve tüm ekip çocuk güvenliği eğitimi alır; moderatör maruz kalma süresi sınırlıdır. 5651'deki yer sağlayıcı yükümlülükleri (içerik kaldırma, kayıt tutma) hukuk teyidiyle takvime bağlanır.

### 8.6 Ödeme, Çip'in hukuki niteliği ve düzenleyici kurumlar

**Çip**, oyun içinde geçen, nakde çevrilemeyen, oyuncular arasında transfer edilemeyen ve KodKent dışında kabul edilmeyen kapalı devre bir dijital içerik hakkıdır; Bayt'a dönüşmez. Bu niteliğin 6493 sayılı Kanun kapsamında elektronik para ihracı sayılmayacağı (kapalı devre/sınırlı ağ istisnası) hukuk görüşüyle teyit edilir. Tahsilat lisanslı bir ödeme kuruluşu (iyzico/PayTR benzeri) üzerinden barındırılan ödeme sayfasıyla yapılır; KodKent kart verisi görmez. Düzenleyici muhatap açısından not: ödeme ve elektronik para kuruluşlarının denetimi 2020'den beri TCMB'dedir; BDDK bankacılığı, SPK sermaye piyasası ve kripto hizmetlerini denetler; Çip bu alanların hiçbirine girmeyecek biçimde tasarlanmıştır (nakde dönüşmez, ticaret yok, bahis yok). Tüketici tarafında Mesafeli Sözleşmeler Yönetmeliği gereği ön bilgilendirme yapılır; anında ifa edilen dijital içerikte cayma hakkı istisnası açık onayla kullanılır, B2 §9.3'teki "harcanmamış Çip 14 gün içinde iade" ise gönüllü politikadır. Fiyatlar KDV dâhildir (net gelir §6'da ÷1,2 ile KDV ayrıştırılarak hesaplanır), e-arşiv fatura kesilir, harcanmamış Çip ertelenmiş gelir sayılır. Rastgelelik (loot box, gacha) yoktur; 15–17 yaşta her satın alma Ebeveyn Paneli limitine ve onayına bağlıdır. B2 §9.3'teki "300 Çip/ay tavan" kuralı bu çerçevede revize önerisidir (Ek A).

### 8.7 Mağaza kuralları (v1.2)

Apple ve Google, dijital ürün satışında kendi faturalandırma sistemlerini ister (komisyon %15–30 mertebesi) ve kullanıcı üretimi içerik için raporlama, engelleme ve filtreleme şart koşar; ikisi de uygulama içi hesap silme ve yaş derecelendirme beyanı ister. KodKent bu yüzden web ve PWA'da başlar: Çip satışı komisyonsuz (PSP ≈%3) yapılır. v1.2'deki sarmalayıcıda iki yol vardır: (a) mağaza faturalamasıyla Çip satışı (fiyat farkı ya da düşük marj) ve (b) satışsız "okuyucu" yaklaşımı (Çip yalnızca web'den). Karar v1.2 başında verilir; kurallar sık değiştiği için o tarihte teyit edilir.

### 8.8 Fikri mülkiyet, marka ve eğitim mevzuatı

Oyuncunun yazdığı kod oyuncuya aittir ("kodu dışa aktar"); KodKent'e işletmeyi çalıştırma, Vitrin'de oyuncunun izniyle gösterme ve anonimleştirilmiş kalibrasyon için sınırlı ve geri alınabilir lisans verilir. Referans çözümler, ders içeriği ve soru bankası KodKent'indir. "KodKent" için TÜRKPATENT'te 9, 41 ve 42. sınıflarda marka başvurusu ve alan adı alımı H1–H4'te yapılır (alternatif adlar yalnızca ek bölümlerdedir; VİZYON açık soru 10). Roslyn, Monaco ve PixiJS MIT lisanslıdır; müzik ve görsel varlıklar lisans kaydıyla alınır. Eğitim mevzuatı açısından KodKent resmî öğretim kurumu ya da sertifika veren kurs değildir; "başarı belgesi" ve Nişan oyun içi unvandır (5580 sayılı Kanun'a girmediğine dair hukuk teyidi). Anthropic'in kullanım politikasının reşit olmayan kullanıcılara hizmet veren ürünlerde istediği ek güvenlik önlemleri (yaş doğrulama, moderasyon, çocuk güvenliği) G0 paketinde sözleşme düzeyinde doğrulanır.

### 8.9 Uyum takvimi ve kontrol listesi

| Hafta | İş | Sahip | Çıktı |
|---|---|---|---|
| H1 | Hukuk danışmanı sözleşmesi; marka (9, 41, 42) ve alan adı başvurusu; şirket ve vergi kaydı | Kurucu | Başvuru numaraları |
| H1–H2 | SMS alfanümerik başlık başvurusu (operatör onayı 1–3 hafta sürer) | CTO | Onaylı başlık |
| H2 | **G0 görüşü**: sınıflandırma, 13–14 kararı, belirteç erişimi | Hukuk | Yazılı görüş |
| H3 | Anthropic aktarım/sözleşme değerlendirmesi; ödeme kuruluşu başvurusu | Hukuk, Kurucu | SCC taslağı; PSP başvurusu |
| H4 | Aydınlatma metni (yetişkin + çocuk dostu), gizlilik ve kullanım şartları | Hukuk | Metinler v1 |
| H6 | KVKK envanteri, saklama ve imha politikası; moderasyon politikası ve vardiya planı | Hukuk, Topluluk | Politika seti |
| H7 | BTK risk değerlendirmesi ve bildirim dosyası (yönetmelik esaslarına göre) | Hukuk | Dosya taslağı |
| H8 | Yaş derecelendirmesi dosyası (KodKent 15+) | Hukuk, Ürün | Beyan |
| H9 | Kapalı beta öncesi KVKK metinleri canlı; veri silme akışı testi | CTO | Test raporu |
| H10 | Dış güvenlik denetimi ve sandbox kaçış testi | CTO | Denetim raporu |
| H11 | PSP canlı onayı; Ebeveyn Paneli uçtan uca testi | CTO | Canlı ödeme |
| H12 | Uyum kontrol listesi %100 (G4) | Kurucu | İmzalı liste |
| A4 | İYS kaydı (pazarlama iletisi gerekirse) | Hukuk | Kayıt |
| A6 | Öğretmen paneli için veri işleme şablonu | Hukuk | Şablon |
| A8 | Mağaza uyumu (v1.2 öncesi) | Hukuk | Karar notu |


---

## 9. KPI ve analitik

### 9.1 Kuzey yıldızı metriği: HKO — Haftalık Kod Oyuncusu

> **HKO** = Türkiye saatiyle Pazartesi 00:00–Pazar 23:59 arasında **en az bir sunucu doğrulamalı kod olayı** üreten benzersiz oyuncu sayısı. Kod olayı: `GorevTamamlandi` (tüm açık testler yeşil), `IsletmeAcildi`, `IsletmeYukseltildi` ya da `HataBildirimiTamamlandi`.

**Neden bu metrik?** (1) Ürün vaadini ölçer: "yazdığın her gerçek C# satırı bir şeyi çalıştırır"; ders okumak ya da süre geçirmek HKO'yu artırmaz. (2) Olaylar sunucuda deterministik testlerle doğrulanır; yapay zekâ puanıyla şişirilemez, XP gibi enflasyona uğramaz. (3) Üç kod döngüsünü (görev, işletme, Hata Bildirimi) kapsar; **içerik pisti bittiğinde bile** Hata Bildirimi ve yükseltmeler HKO'yu canlı tutar, yani metrik içerik darboğazını ceza gibi göstermez. (4) D30 ve ödeme isteğinin öncü göstergesidir (hipotez: HKO'daki oyuncunun ödeme olasılığı diğerlerinin ≥2 katı; H9–H10 beta ve A4'te doğrulanır). (5) Maliyetle bağlanır: `HKO başına maliyet = (AI + sandbox + SMS) / HKO`; birim ekonomi sorusunu (§6.4) tek sayıya indirger. (6) Haftalık ritim, Pazar 21:00 ligi ve 8 saatlik kasa döngüsüyle uyumludur. **Seçilmeyenler:** DAU (gösterişli, öğrenme ölçmez), XP (şişirilebilir), Bayt (ekonomi çıktısı), D30 (geç göstergedir), ders tamamlama (pasif okumayı sayar).

**Tamamlayıcı ve koruyucu metrikler:** altın durak / aktif oyuncu (öğrenmenin kalıcılığı); AI $/DAU, itiraz, şikâyet, ders terk, gider/kaynak 0,7–0,9 (koruyucu); ödeyen oranı ve ebeveyn onay oranı (gelir ve uyum). **Hedef (baz senaryo):** HKO A3 ≈ 230, A6 ≈ 820, A12 ≈ 3.200 (HKO ≈ 1,2 × ay sonu DAU: WAU ≈ 2,2 × DAU ve WAU'nun ≈%55'i haftada en az bir kod olayı üretir; §13 varsayım 20).

### 9.2 KPI ağacı

```
HKO (haftalık kod oyuncusu)
├─ Haftalık aktif oyuncu (WAU)
│  ├─ Yeni oyuncu = kayıt × OTP % × yaş kapısı %          [Edinim: kanal, CAC, kohort kodu]
│  ├─ Aktivasyon: ilk Bayt ≤20 dk, Ders 1.1 %, tapu ≤2 oturum, 72 saat Açılış %
│  └─ Elde tutma: D1/D7/D30, Günlük Tekrar D7, seri, kasa dönüşü, içerik pisti
├─ Kod gönderme oranı (WAU içinde kod olayı üreten pay)
│  ├─ Ders → görev geçişi: Ders Mührü %, Telafi Turu
│  ├─ Kod başarısı: ilk geçiş %, ortalama deneme, ipucu kademesi, Savunma geçme %, transfer (Otopark → Manav)
│  └─ Kod fırsatı: açık görev + İş Emri + Hata Bildirimi stoku (içerik damlası)
└─ Koruyucu metrikler
   ├─ Maliyet: AI $/DAU, sandbox p95, SMS/kayıt, HKO başına maliyet
   ├─ Güven ve uyum: itiraz %, şikâyet %, ağır şikâyet SLA, yaş kapısı geçişi, KVKK talebi SLA
   ├─ Ekonomi: gider/kaynak, kasa doluluk kaybı, Gini, Deneme modu oranı
   └─ Gelir: Butik dönüşümü, ödeyen oranı, ARPPU, okul/kulüp koltuğu
```

### 9.3 Temel metriklerin tanımı

| Metrik | Formül / tanım | Not |
|---|---|---|
| Oyuncu | OTP doğrulaması + yaş kapısı geçmiş hesap | Pay/paydalar bu tabana göre |
| DAU / WAU / MAU | Gün / hafta / 30 gün içinde ≥1 oturum açan oyuncu | Oturum: ≥1 etkileşim, 30 dk boşta kapanır |
| D1 / D7 / D30 | Kayıt gününden sonra N. gün oturum açan kohort payı | Kayıt günü = gün 0 |
| Aktivasyon | Avatarı tamamlayan → (ilk Bayt ≤20 dk, Ders 1.1, tapu ≤2 oturum, 72 saat Açılış) | VİZYON §4 tabanı |
| Tapu oranı | Tapu alan ÷ avatarı tamamlayan (≤2 oturum) | Hedef %50 |
| Otopark açılış oranı | Otopark AÇIK ÷ avatarı tamamlayan (72 saat) | Hedef %35; kayıttan 7 gün içinde %30 |
| Kod başarısı | İlk denemede tüm açık testleri geçen ÷ görev başlatan | Zorluk sinyali |
| İçerik pisti | D14+ aktif oyuncu için kalan ders sayısı ÷ son 14 günlük haftalık ders hızı | Hedef P50 ≥4, P75 ≥2 hafta; P90 kod döngüsüyle tutulur (§5.4) |
| HKO başına maliyet | (AI + sandbox + SMS faturası) ÷ HKO | Haftalık, TL ve $ |
| Kasa dönüşü | Kasası dolan oyuncunun 8 saat içinde toplama yapma payı | B2 §10.5 "kasa doluluk kaybı" ile birlikte |
| Altın durak oranı | D30 aktifleri içinde ≥3 altın durağı olanlar | Kalıcılık Ligi ile aynı sayaç |
| Transfer (öğrenme) | Otopark L1'i ipucusuz geçenlerin Manav L1'i ilk denemede geçme oranı (hedef ≥%60; ipuçlulara ≥%45); Kütüphane'de "hepsine mi, fazlasına mı?" sorusunu soranların ilk deneme başarısı sormayanlara göre | B5 §6.3 önerisi; Manav v1.1'de gelir, eşikler H9–H10 ve A5'te ayarlanır |

### 9.4 Analitik olay kataloğu

Katalog 49 satırda 61 olay adı içerir. Olaylar PascalCase, Türkçe, aksansızdır (B2 §15'teki `BaytKazanildi`, `BaytHarcandi` ile aynı stil). Ekonomi ve kod olayları **sunucu**, arayüz olayları istemci tarafında üretilir; hepsi takma kimlikle yazılır. Alan adları B7'deki olay şemasıyla hizalanır.

| # | Olay | Tetikleyici | Özellikler | Besleyen KPI |
|---|---|---|---|---|
| 1 | `UygulamaAcildi` | İlk sayfa yükü | `kanal, kohort_kodu, cihaz_sinifi, yeni_mi` | Edinim, kanal |
| 2 | `GirisBasladi` | "Telefonla gir" | `yontem` | OTP % |
| 3 | `OtpGonderildi` | SMS sağlayıcıya iletim | `deneme_no, saglayici` | SMS/kayıt |
| 4 | `OtpDogrulandi` | Doğru kod | `sure_sn, deneme_no` | OTP % |
| 5 | `YasKapisiSonuc` | Belirteç döndü | `esik (<15 / 15-17 / 18+), yontem, sonuc` | Yaş kapısı geçişi |
| 6 | `EbeveynLinkiGonderildi` | 15–17 için SMS linki | `deneme_no` | Ebeveyn onay oranı |
| 7 | `EbeveynOnayiVerildi` | Panelde onay | `sure_saat, izinler[]` | Ebeveyn onay oranı |
| 8 | `DilSecildi` / `DilBildirimiIstendi` | Dil kartı | `dil` | İkinci dil kararı (§11) |
| 9 | `AvatarTamamlandi` | Avatar kaydı | `sure_sn, moderasyon_sonucu` | Aktivasyon tabanı |
| 10 | `DersBasladi` | Derslik açıldı | `ders_id, kart_sayisi` | Ders terk |
| 11 | `DersBirakildi` | 24 saat bitirilmedi | `ders_id, son_kart_no` | Ders terk, E2 |
| 12 | `DersTamamlandi` | Son kart | `ders_id, sure_sn` | Ders hızı, içerik pisti |
| 13 | `UstaSorusuCevaplandi` | Cevap gönderildi | `ders_id, soru_tipi, deneme_no, ai_mi, karakter_sayisi` | AI kota, maliyet |
| 14 | `KurulPuanlandi` | Puan döndü | `soru_id, puan, guven, model, sure_ms, maliyet_usd, deterministik_mi` | AI $/DAU, p95 |
| 15 | `ItirazAcildi` | İtiraz butonu | `soru_id, fark, sonuc` | İtiraz % |
| 16 | `DersMuhruAlindi` | 3'te 2 ≥70 | `ders_id, deneme_sayisi` | Ders → görev geçişi |
| 17 | `TelafiTuruBasladi` | Telafi Turu | `ders_id` | Öğrenme riski |
| 18 | `AiKotasiDoldu` | 30. etkileşim | `etkilesim_sayisi` | Kota, gece batch |
| 19 | `GorevBasladi` | Atölye açıldı | `gorev_id, tip` | Kod fırsatı |
| 20 | `KodCalistirildi` | Çalıştır | `challenge_id, derleme_basarili, gecen_test, toplam_test, sure_ms` | Sandbox p95, kod başarısı |
| 21 | `DerlemeHatasi` | CS hatası | `cs_kodu, tablo_mu, sure_ms` | Hata çeviri kapsamı |
| 22 | `IpucuAcildi` | İpucu | `challenge_id, kademe` | Zorluk sinyali |
| 23 | `GorevTamamlandi` | Tüm açık testler yeşil | `gorev_id, tip, sure_sn, ipucusuz_mu, deneme_sayisi` | **HKO**, kod başarısı |
| 24 | `RuhsatAlindi` | 3. görev | `isletme` | Tapu hunisi |
| 25 | `TapuAlindi` | Arsa satın alındı | `isletme, oturum_no, dakika_kayittan` | Tapu oranı |
| 26 | `GereksinimNetlestirildi` | Sözleşme Kartı | `soru_sayisi, keskin_goz` | E1 (anomali) |
| 27 | `MufettisCalisti` | Gizli testler | `challenge_id, gecen, kalan_kategori, tohumlu_gecen` | Açılış hunisi |
| 28 | `SavunmaSonuc` | Savunma bitti | `challenge_id, puan, sonuc, zorunlu_mu` | Savunma geçme % |
| 29 | `IsletmeAcildi` | Açılış | `isletme, seviye, deneme_modu_mu, dakika_tapudan` | **HKO**, 72 saat Açılış |
| 30 | `KasaToplandi` | Toplama | `isletme, bayt, doluluk, saat_son_toplama` | Kasa dönüşü |
| 31 | `IsletmeYukseltildi` | L2–L5 | `isletme, seviye` | **HKO** |
| 32 | `HataBildirimiTamamlandi` | Dosya kapandı | `tier, bayt, sure_sn` | **HKO**, içerik pisti |
| 33 | `BaytKazanildi` / `BaytHarcandi` | Defter kaydı | `kaynak` veya `lavabo`, `miktar` | Ekonomi panosu (B2 §10.5) |
| 34 | `GunlukTekrarTamamlandi` | 5 soru bitti | `dogru_sayisi, seri, sure_sn` | D7, seri |
| 35 | `SeriKirildi` / `SeriDondurucuKullanildi` | Gün atlandı | `seri_uzunlugu, dondurucu_turu` | Elde tutma |
| 36 | `AltinDurakKazanildi` / `DurakDustu` | 3 doğru / unutma | `durak_id` | Altın durak oranı |
| 37 | `OdaZiyaretEdildi` / `AlkisVerildi` | Ziyaret, Alkış | `hedef_tip, iliski` | Sosyal döngü |
| 38 | `ArkadasEklendi` / `DavetKoduKullanildi` | Eşleşme | `yontem, kod_tipi` | K-faktörü |
| 39 | `SohbetMesajiGonderildi` | Mesaj | `kanal, mod (guvenli/serbest)` | Şikâyet % paydası |
| 40 | `SikayetEdildi` / `ModerasyonKarari` | Şikâyet, karar | `neden, kanal, karar, sure_sn` | Şikâyet %, SLA |
| 41 | `LigKapandi` / `SemtSinaviSonuc` | Pazar 21:00 / sınav | `kademe, sira` / `semt, sonuc, sure_sn` | Lig, semt hunisi |
| 42 | `PazarGoruntulendi` / `ButikAcildi` | Raf, Butik | `raf, urun_id` | Butik dönüşümü |
| 43 | `UrunSatinAlindi` | Bayt ya da Çip ile alım | `urun_id, para, fiyat` | Harcama, lavabo |
| 44 | `CipOdemeBasladi` / `CipOdemeTamamlandi` | Ödeme sayfası | `paket, tutar_tl, yas_grubu, ebeveyn_onayli` | Ödeyen oranı, ARPPU |
| 45 | `EbeveynLimitiDegisti` | Panelde ayar | `tur, eski, yeni` | Uyum, gelir |
| 46 | `BildirimIzniVerildi` / `BildirimTiklandi` | İzin, tıklama | `tur, saat` | Geri dönüş, E5 |
| 47 | `PwaEkranaEklendi` | Yükleme kabul | `kaynak` | Elde tutma |
| 48 | `OturumBasladi` / `OturumBitti` | Oturum | `kanal` / `sure_sn, tur_kapandi_mi` | Süre, tur kapanışı |
| 49 | `HesapSilmeTalebi` | Ayarlar | `neden, yas_esigi` | KVKK SLA |

### 9.5 Panolar

| Pano | Kitle ve ritim | İçerik |
|---|---|---|
| **1. Yönetim (haftalık)** | Kurucu, ekip; Pazartesi | HKO ve KPI ağacı, runway, risk kaydı özeti |
| **2. Huni ve onboarding** | Ürün, istemci; günlük | Dakika dakika düşüş (OTP → yaş kapısı → avatar → Ders 1.1 → ilk Bayt → tapu → Açılış), cihaz kırılımı |
| **3. Elde tutma ve kohort** | Ürün; haftalık | D1/D7/D30, kanal ve kulüp kodu kırılımı, içerik pisti, seri |
| **4. Eğitim kalitesi** | Müfredat, CTO; haftalık | Ders terk, Kurul puan dağılımı, itiraz, kalibrasyon sapması, kod başarısı, zor kartlar |
| **5. Ekonomi** | Ürün (ekonomi); haftalık | B2 §10.5 metrikleri: gider/kaynak, kaynak dağılımı 60/20/8/7/5, Gini, kasa doluluk kaybı |
| **6. Maliyet** | CTO, kurucu; günlük | AI $/DAU (alarm 0,08), sandbox p95, SMS/kayıt, HKO başına maliyet, kur duyarlılığı |
| **7. Güven ve uyum** | Topluluk, hukuk; günlük | Şikâyet %, ağır şikâyet SLA, yaş kapısı geçişi, ebeveyn onay oranı, KVKK talepleri |

### 9.6 Deney (A/B) planı

Kurallar: aynı anda en çok 2 deney; deneyler takma kimliğe göre rastgele atanır; her deneyin koruyucu metrikleri ders terk, itiraz, şikâyet ve AI maliyetidir; çocuk güvenliğini etkileyen (sohbet, moderasyon, ebeveyn) değişiklikler deneye konmaz; 15–17 hesaplarda yalnızca düşük riskli arayüz deneyleri yapılır. Örneklem büyüklüğü iki yönlü α=0,05, güç 0,80 ile hesaplanmıştır. İlk iki ayda aylık yalnızca ≈1.000–1.500 kayıt olduğu için yalnızca **büyük etkiler** (≥10 puan) test edilebilir.

| # | Hipotez | Birincil metrik | Asgari etki | Örneklem / kol | Sürüm |
|---|---|---|---|---|---|
| E1 | 119/120 anomalisini Usta söylemesin, yalnızca oyuncu fark etsin (VİZYON açık soru 1) | Keskin Göz oranı; Savunma geçme % | +10 puan | ≈250 | MVP (H12–H16) |
| E2 | 4 kartlı Ders 1.1–1.4 akışı 6 kartlıdan düşük terk verir | Ders terk | −5 puan | ≈800 | A4–A5 |
| E3 | "Satılık Otopark" teaser'ı erken (15. dk) gösterilirse tapu ≤2 oturum artar | Tapu oranı | +6 puan | ≈600 | A4 |
| E4 | Giriş sineması 40 sn atlanabilir mi, hiç yok mu, D1'i etkiler | D1; Ders 1.1 tamamlama | +4 puan | ≈1.500 | A4–A5 |
| E5 | "Kasa doldu" bildirimi 18:00 mi 20:30 mu; metin tonu | Bildirim → geri dönüş | +3 puan | ≈1.500 | A5 |
| E6 | Staj modu (B2 Ek A-1) Sev. 12'ye ve D30'a etki eder | D30; Sev. 12'ye gün | +3 puan (8 → 11) | ≈1.500 | v1.1 (A6–A8) |
| E7 | Kulüp kodu ile gelen kohort bireysel kayıttan yüksek D30 verir | D30 (eşleştirilmiş kohort) | +4 puan | Gözlemsel | MVP sonrası |
| E8 | Hafif oyuncuya "önce Günlük Tekrar, ders yarın" akışı seriyi korur (B2 §11.5) | Seri uzunluğu; D7 | +3 puan | ≈1.000 | A5 |
| E9 | Butik'te ilk vitrin ürünü (Neon Çırak seti ya da İsim rengi) | Butik dönüşümü | +2 puan | Ardışık test | A4–A6 |
| E10 | Davet bonusu 100 B mi 150 B mi | K-faktörü | +0,05 | ≈1.000 | A5 |
| E11 | Haiku-first cascade Sonnet-only'ye karşı (önce gölge, sonra kullanıcı görünür) | AI–insan puan farkı, itiraz %, $/puanlama | itiraz <%3 korunurken −%40 maliyet | Gölge: 5.000 cevap | v1.2 |

### 9.7 Analitik ve veri koruma

Analitik veri, ürünü işletmek ve iyileştirmek için takma kimlikle (ad, telefon, yaş eşiği hariç) toplanır; reklam, profilleme ya da üçüncü tarafla paylaşım için kullanılmaz; üçüncü taraf reklam SDK'sı ve çerezsiz izleme dışında izleyici yoktur. B7'de `analytics.events` tablosu **rıza kapısıyla** yazılır: ekonomi, kod ve güvenlik olayları defter ve işlem kayıtlarından türetildiği için (hizmetin ifası) rızasız da hesaplanır; HKO bu sunucu olaylarına dayanır ve rızadan bağımsızdır. Arayüz davranış olayları isteğe bağlı analitik rızasına bağlıdır (15–17'de ebeveyn onayıyla) ve bu hesaplarda toplu (agregat) raporlanır. Ham olaylar 13 ay saklanır (B7 bölümleme), kimliksiz günlük özetler daha uzun; silme talebinde takma kimlik eşlemesi silinir, olaylar kimliksizleşir. Barındırma ve araç seçimi B7'ye bağlıdır (öneri: Türkiye'de kendi barındırılan olay deposu + açık kaynak pano aracı).


---

## 10. Risk kaydı

Kayıt 25 risk içerir. **Skor** = olasılık (1–5) × etki (1–5); **önem rozeti**: ≥15 `kritik`, 10–14 `yuksek`, 5–9 `orta`, ≤4 `dusuk`. VİZYON §12'nin beş riski R05 (okul gibi hissi), R03 (sandbox), R09 (AI maliyeti ve adalet), R04 (boş şehir) ve R17–R18 (kopya ve ekonomi) olarak, altıncı izlenen risk (Tier 2→3 uçurumu) R19 olarak korunmuştur; içerik darboğazı (A-vizyon-urun riski 3) R06–R07'dir; mevzuat, finansman, birim ekonomi ve kur riskleri bu belgenin eklemesidir. Kayıt her sprint sonu retrosunda, `kritik` ve `yuksek` satırlar haftalık yönetim toplantısında gözden geçirilir; tetikleyici görülen risk için sahibi 48 saat içinde azaltma planını günceller.

| ID | Risk | O | E | Skor | Önem | Tetikleyici | Azaltma | Sahip |
|---|---|---|---|---|---|---|---|---|
| R01 | **Mevzuat:** 15 yaş sınırı, yaş doğrulama ve oyun platformu yükümlülükleri; KodKent'in kapsamda olması, 13–14 yaş kaybı, BTK bildirimi | 4 | 5 | 20 | `kritik` | G0 görüşünde "sosyal ağ sağlayıcı" sınıflaması; BTK bilgi talebi; yönetmelik değişikliği | G0 (H2); `age_gate_min` bayrağı; seçenek A varsayılan, C yedek; Ebeveyn Paneli; 15–17 varsayılanları; derecelendirme ve risk bildirimi dosyası; hukuk retainer; mevzuat izleme | Kurucu + hukuk |
| R02 | **Birim ekonomi:** AI maliyeti DAU başına Çip gelirinin çok üstünde; B2C kozmetik geliri değişken maliyeti karşılamıyor (§6.4) | 5 | 4 | 20 | `kritik` | $/DAU >0,08; ödeyen oranı <%1 (A6); runway <9 ay | Haiku-first cascade, sınıflandırıcı-önce, semantik önbellek, kota ayarı; okul/kulüp lisansı; kurumsal koltuk sponsorluğu; hibe; aylık maliyet panosu; B3 ile ortak hedef (Ek A) | Kurucu + CTO |
| R03 | **Sandbox güvenliği ve gecikmesi:** kaçış, kaynak tüketimi, p95 >10 sn | 2 | 5 | 10 | `yuksek` | Kuyruk birikimi; ağ çıkış denemesi; kaçış listesinde başarılı deneme | gVisor, ağ yok, 256 MB / 2 vCPU / 10 sn; 20 ısıtılmış container; H2 yük testi; H10 dış denetim; gece batch ayrı havuz | CTO |
| R04 | **Boş şehir ve D7 kopuşu** (D7 <%15) | 4 | 4 | 16 | `kritik` | Meydan'da <10 avatar; D7 <%15 | Kohort kodlarıyla aynı shard; NPC işletmeler; asenkron sosyal; inşaat halinde semtler; H9–H10 beta; D7 <%15 ise 2 hafta erteleme | Kurucu (ürün) |
| R05 | **"Okul gibi" hissi ve ilk oturumda boğulma** (ders terk >%20) | 3 | 4 | 12 | `yuksek` | Editörde 0 karakter; ders terk >%20 | Oturumun ≤%40'ı ders; kart ≤60 kelime; PRIMM; Türkçe hata; H4 kâğıt testi; deney E2 | Ürün + müfredat lideri |
| R06 | **İçerik pisti kısa:** MVP'nin 18 dersi normal oyuncuda ≈18 günde biter, yoğun oyuncuda ≈6 günde (B2 §11) | 4 | 3 | 12 | `yuksek` | P50 içerik pisti <4 hafta; D14 sonrası düşüş | Haftalık Salı yayını, H14–H20'de ≈4 ders/hafta (§5.4); Hata Bildirimi 3 → 5 (B2 Ek A-9); Staj modu kararı; Kod Düellosu v1.1 | Müfredat lideri |
| R07 | **Tek müfredat yazarı:** kapasite ve kalite (B3 §12.2'ye göre haftada ≈2,2 ders, MVP yükü ≈9,7 yazar-haftası), sözleşmeli gözden geçirme | 4 | 4 | 16 | `kritik` | Takvimde 1 haftadan fazla gecikme; kalibrasyon sapması >5 puan | MVP'de 20 günlük sözleşmeli ek yazar; A4'te ikinci yazar; Opus taslak → yazar → ikinci göz hattı; MVP'de Liman 6 derse sabit; kalite kapısı atlanmaz | Müfredat lideri |
| R08 | **Çocuk güvenliği olayı:** grooming, zorbalık, uygunsuz içerik, kişisel bilgi sızması | 3 | 5 | 15 | `kritik` | Ağır şikâyet; filtre kaçağı | Güvenli mod varsayılan; link/görsel/ses yok; 1 saat SLA; insan vardiyası; ekip eğitimi; ihbar prosedürü; kriz iletişim planı | Topluluk lideri + hukuk |
| R09 | **AI adalet algısı ve kalibrasyon:** itiraz >%5, kappa <0,75 | 3 | 4 | 12 | `yuksek` | Haftalık örneklemde AI ile insan puanı farkı >10 puan; itiraz >%5 | Rubrik-önce, kriter gerekçesi, altın küme (300/tip), haftada 200 örneklem, sapan soruyu yayından çek | Müfredat lideri + CTO |
| R10 | **Claude API bağımlılığı:** fiyat, model kimliği, kesinti, kullanım politikası | 3 | 4 | 12 | `yuksek` | Fiyat/kimlik değişikliği duyurusu; kesinti >1 saat | Model soyutlama katmanı; deterministik pay ≥%50; kota + gece batch ("Kurul bugünlük kapandı"); sözleşme; ikinci sağlayıcıyla gölge test | CTO |
| R11 | **Finansman:** pre-seed/seed gecikmesi, hibe reddi, runway | 3 | 5 | 15 | `kritik` | Runway <9 ay; kapanışsız tur 3 ay | Aşamalı işe alım; kesme çizgisi; hibe + melek paralel başvuru; muhafazakâr senaryo bütçesi; A9 öncesi tur kapanışı (§6.6) | Kurucu |
| R12 | **Kapsam ve ekip:** 12 haftada MVP + uyum paketi | 4 | 3 | 12 | `yuksek` | Sprint taahhüdünün <%80'i; G1 gecikmesi | §3.1 kesme çizgisi; G0 sonrası 14 hafta opsiyonu; haftalık demo; AI destekli geliştirme; kapsam dondurma H8 | CTO + kurucu |
| R13 | **Anahtar kişi bağımlılığı** (CTO, müfredat lideri) | 2 | 4 | 8 | `orta` | İstifa niyeti; tek kişide bilgi | Çift sahiplik; dokümantasyon; hisse/opsiyon planı | Kurucu |
| R14 | **KVKK ihlali ve veri sızıntısı** | 2 | 5 | 10 | `yuksek` | Yetkisiz erişim; log anomalisi | En az yetki; şifreleme; veri minimizasyonu; 72 saat bildirim planı; H10 denetim | CTO + hukuk |
| R15 | **e-Devlet yaş belirteci hizmetine bağımlılık:** erişim, gecikme, kesinti | 4 | 3 | 12 | `yuksek` | G0'da erişim tarihi belirsiz; belirteç API kesintisi | Seçenek C (18+ ile başla); soyutlama katmanı; kesintide yeni 15–17 kaydı bekletme; kullanıcıya açık mesaj | CTO |
| R16 | **SMS istismarı (OTP pumping)** ve maliyet sıçraması | 3 | 3 | 9 | `orta` | Günlük SMS bütçe alarmı; tek IP'den yoğun istek | IP/cihaz limiti, bot koruması, yalnızca +90 numara, ikinci sağlayıcı, günlük bütçe tavanı | CTO |
| R17 | **Ekonomi kırılması:** kopya, Bayt enflasyonu, RMT girişimi | 3 | 3 | 9 | `orta` | Gider/kaynak <0,55; 30 sn'de geçen gizli test | Tohumlu testler, Savunma, referans tavanı, transfer yok, haftalık ekonomi panosu, H6 simülasyonu | Ürün (ekonomi) |
| R18 | **Harici AI ile çözüm / kopya** öğrenme değerini düşürür | 4 | 2 | 8 | `orta` | Yazım <30 sn oranı; AST benzerliği >%95 | Savunma zorunlu, Bayt sonra ödenir, Berrak Zihin teşviki, Hata Bildirimi; bireyselde yumuşak yaklaşım | Müfredat lideri |
| R19 | **Tier 2→3 uçurumu** (Sev. 18–25) | 3 | 3 | 9 | `orta` | Kampüs dersinde terk >%25 | Kalfa Köprüsü ara görevleri; Lonca ve Kalfa Yardımı | Müfredat lideri |
| R20 | **Marka ve alan adı çakışması** (KodKent) | 2 | 3 | 6 | `orta` | TÜRKPATENT itirazı | H1 sorgu ve başvuru; alternatifler hazır (ek bölümlerde) | Kurucu |
| R21 | **Ödeme kuruluşu onayı ve Çip niteliği** gecikmesi | 3 | 3 | 9 | `orta` | PSP onayı H8'de gelmedi | Erken başvuru; ikinci PSP; gecikirse Butik "yakında" ve ödeme ölçümü ertelenir | Kurucu + hukuk |
| R22 | **İstemci performansı** (4 GB RAM telefonda PixiJS) | 3 | 3 | 9 | `orta` | Medyan fps <30; çökme >%1 | Düşük detay modu; varlık bütçesi; H5'te cihaz laboratuvarı | İstemci lideri |
| R23 | **Mevsimsellik ve takvim** (bayram, sınav, yaz) | 4 | 2 | 8 | `orta` | Kayıt düşüşü >%30 | Takvim tamponu (§7.5), sınav dönemi modu, yaz etkinlikleri | Topluluk lideri |
| R24 | **Kur ve ücret enflasyonu:** AI ve altyapı USD, gelir ve maaş TL | 4 | 3 | 12 | `yuksek` | TL/$ planın %15 üstünde; ücret talepleri | USD kalemleri toplam giderin ≈%8–10'u; yıllık ücret ayarı bütçede (A7 +%15); gelir ve hibe TL; bulut taahhüt indirimi | Kurucu |
| R25 | **Rakip tepkisi:** büyük bir oyuncunun (sosyal dünya ya da kodlama platformu) Türkçe benzer ürün çıkarması | 2 | 2 | 4 | `dusuk` | Rakip duyurusu; Türkçe C# içeriğinin çoğalması | Hız ve derinlik: sandbox + referans tavanı + içerik hattı kopyalanması zor bir bileşimdir; kulüp ve öğretmen ilişkileri; Nişan statüsü ve topluluk | Kurucu |


---

## 11. Gelecek diller

### 11.1 İlke: dil-agnostik çekirdek

KANON'daki beş "yakında" dil kartı bir ürün sözü değil, bir **talep ölçümüdür**: "haber ver" tıklamaları ikinci dil kararını verdirir (VİZYON açık soru 9). Mimari buna hazır tutulur: B5 §1.1'in altıncı ilkesine göre Challenge Spec'teki `girdi` ve `beklenen` JSON'dur, ikinci dil geldiğinde aynı Spec kullanılır ve yalnızca `imza.tur` ile koşucu değişir. Dile bağlı kalanlar da bellidir ve ikinci dilin gerçek maliyetini oluşturur:

| Katman | Dilden bağımsız mı | Yeni dil için iş |
|---|---|---|
| Challenge Spec çekirdeği (`girdi`, `beklenen`, `etiket`, tohumlu üreteç) | Evet | Yok |
| `imza`, `iskelet_kod`, referans çözüm | Hayır | Dil başına yeniden yazım (B5 CI doğrulayıcısı çok dilli çalışır) |
| Sandbox koşucusu | Hayır | Yeni imaj (aynı gVisor limitleri) ve p95 testi |
| Hata tablosu (Türkçe) | Hayır | En sık 30–50 hata kodu için yeni statik tablo |
| Ders içeriği, benzetmeler, Usta örnekleri | Hayır | Modül başına yeniden yazım (Defne'nin "değişken kutu, tür etiket" benzetmesi Python'da değişir) |
| Kurul rubriği ve istem şablonları | Büyük ölçüde | Soru bankası ve altın küme (3 tip × 300) yenilenir |
| Savunma satır seçimi, kopya benzerliği (AST) | Hayır | Dilden bağımsız çözümleyici (öneri: tree-sitter) |
| İşletme kataloğu, ekonomi, sosyal katman | Evet | Yok |

### 11.2 Python mı JavaScript mi?

| Ölçüt | Python | JavaScript |
|---|---|---|
| Hedef kitle talebi | Okul ve üniversite müfredatında yaygın; veri/AI ilgisi | Web ve oyun ilgisi; görsel anında geri bildirim |
| Sandbox | CPython, ağsız; basit ve ucuz | Node/V8 ya da hafif yorumlayıcı; ağsız; event loop ilk derslerde gizlenmeli |
| Pedagojik uyum | Tür etiketi yok: PRIMM ve benzetmeler yeniden kurulur | Örtük tür dönüşümü tuzakları ilk derslerde dikkat ister |
| Hata tablosu | Az sayıda net hata (SyntaxError, IndentationError, NameError, TypeError…) | Hata iletileri çalışma ortamına göre dağınık |
| Challenge Spec | Fonksiyon imzası; Otopark testleri aynen taşınır | Aynı |
| İçerik yükü | ≈100 ders × 1,5 gün ≈ 30 yazar-haftası | Aynı; ek olarak tarayıcı/DOM görevleri doğrulanamaz |

**Varsayılan sıra: önce Python, sonra JavaScript.** Karar "haber ver" sayaçlarına bağlanır: Python sayacı JavaScript'in en az %15 üstündeyse Python, değilse sayaç sahibi dil. Python gerekçesi: sandbox'ı ucuz, hata tablosu küçük ve talep tahmini yüksektir; JavaScript'in DOM'a bağlı görevleri deterministik doğrulamayı zorlaştırır.

### 11.3 Ön koşullar (hepsi sağlanmadan dil açılmaz)

| # | Ön koşul | Eşik |
|---|---|---|
| 1 | C# çekirdeği olgun | D30 ≥%10, HKO ≥3.000, AI ≤0,02 $/DAU/gün |
| 2 | Dil-agnostik Spec v2 (B5 ile) | `diller{}` alanı, çok dilli CI doğrulayıcı |
| 3 | İkinci koşucu imajı | Aynı limitler (256 MB, 2 vCPU, 10 sn), p95 <6 sn |
| 4 | Talep | "Haber ver" sayacı ≥1.500 ve seçilen dil ikinci dilden ≥%15 önde |
| 5 | Ekip | +1 dil uzmanı müfredat yazarı ve +1 sözleşmeli gözden geçirmeci; bütçe ≈ +%12 |
| 6 | Kalite altyapısı | 30–50 kodluk Türkçe hata tablosu, altın küme (3 tip × 300), Usta rubrikleri |
| 7 | Finansman | Seed turu kapanmış ya da lisans geliri ikinci dili finanse ediyor |

**Zamanlama (önerilen):** Python pilotu A13–A16 (Çarşı eşdeğeri 12 ders + Otopark), kapalı beta A17, açık yayın A18; JavaScript A24'ten önce değil. Dil kartı açıldığında C# oyuncusuna ilk dil olarak sunulmaz; ikinci dil "yeni şehir kapısı" olarak Meydan'da görünür (hukuken ayrı ürün sınıflaması gerekirse §8.1'deki sınıflama yeniden değerlendirilir).


---

## 12. Başarı nasıl görünür

Başarı, tek bir kullanıcı sayısı değil, **kanıt zinciri**dir: üç ay sonunda ürünün çalıştığı (aktivasyon, kod yazma), altı ay sonunda tutunduğu ve para kazanma yollarının test edildiği, on iki ay sonunda ise maliyet eğrisinin ve kurumsal talebin finansmanı mümkün kıldığı görülmelidir. Aşağıdaki tablo baz senaryo hedefidir; köşeli parantez içinde muhafazakâr ve iyimser aralık verilmiştir (§6.3). "Açılan işletme" `IsletmeAcildi` olay sayısıdır (yükseltmeler hariç); "tamamlanan ders" `DersTamamlandi` olay sayısıdır.

| Ölçüt | 3. ay sonu (A3, Mart 2027) | 6. ay sonu (A6, Haziran 2027) | 12. ay sonu (A12, Aralık 2027) |
|---|---|---|---|
| **Sürüm ve içerik** | MVP yayında; 18 ders, 3 işletme | v1.1 yayında; 46 ders (H20), Atölyeler + Kampüs ön açılış | v2 yayında; 84 ders, 18 işletme, 4+ semt |
| **Kayıtlı oyuncu (kümülatif)** | 1.000 [400–1.500] | 7.000 [2.500–15.000] | 40.500 [13.200–95.000] |
| **DAU (ay sonu)** | ≈190 [50–350] | ≈680 [145–2.100] | ≈2.650 [520–9.100] |
| MAU (ay ortalaması) | ≈430 | ≈2.060 | ≈8.370 |
| **HKO (kuzey yıldızı)** | ≈230 | ≈820 | ≈3.200 [620–10.900] |
| D1 / D7 / D30 | ≥%45 / ≥%20 / (ölçülüyor) | ≥%45 / ≥%20 / ≥%8 | ≥%45 / ≥%22 / ≥%10 |
| **Tamamlanan ders (kümülatif)** | ≈3.100 [900–5.500] | ≈35.500 [8.700–94.600] | ≈264.000 [55.000–837.000] |
| **Açılan işletme (kümülatif)** | ≈150 [60–225] | ≈2.500 [930–5.300] | ≈16.100 [5.300–37.500] |
| 72 saatte Otopark AÇIK | ≥%35 | ≥%38 | ≥%40 |
| Aylık ödeyen (Çip) | ≈4 | ≈41 | ≈167 [20–850] |
| Lisans paketi (kümülatif) / pilot | 20 öğretmen sözlü pilot | 20 öğretmen pilotu | 28 ücretli paket [0–60] |
| **Aylık net gelir (TL)** | ≈400 | ≈4.100 | ≈24.500 [1.700–185.300] |
| **Kümülatif net gelir (TL)** | ≈0 | ≈7.000 | ≈109.000 [7.000–649.000] |
| AI $/DAU/gün | 0,057 (alarm 0,08) | 0,057 | 0,035 [0,075–0,025] |
| FTE | 5,5 | 8,5 | 11,5 [7,5–13,5] |
| **Aylık gider** | 1,43 M TL (31,8 bin $) | 1,80 M TL (40,1 bin $) | 2,54 M TL (56,4 bin $) |
| **Kümülatif gider** | 4,3 M TL (96 bin $) | 10,0 M TL (222 bin $) | 24,5 M TL (545 bin $) |
| Finansman durumu | Pre-seed kapanmış; BiGG/KOSGEB başvuruda | Tranş 2 tetikleyicisi geçti; hibe ödemeleri | Seed turu kapanış aşamasında |

**3. ay "yeterince iyi" tanımı:** G4 geçmiş; 72 saatte Otopark AÇIK ≥%35; D7 ≥%20; ağır güvenlik açığı ve çocuk güvenliği olayı yok; 10 kulüp kohortu aktif. **6. ay:** D30 ≥%8, ödeyen oranı ≥%1,5, 20 öğretmenin sınıf raporu kullanması ve Staj modu kararının verilmiş olması. **12. ay:** HKO ≥3.200, AI ≤0,035 $/DAU/gün (yol: ≤0,02 $ A15), ≥28 ücretli lisans paketi ve seed turunun kapanışı; bu üçü tutmazsa Tranş 3 açılmaz, ürün küçültme senaryosuna girilir (R02, R11).


---

## 13. Varsayımlar

1. **Takvim.** A1 = Ocak 2027, H1 = 4 Ocak 2027 (Pazartesi); sprint 2 haftadır. Bayram, yarıyıl ve sınav tarihleri teyit edilecektir (Ramazan Bayramı 2027'de ≈9–11 Mart, Kurban Bayramı ≈16–19 Mayıs varsayıldı).
2. **Kur.** 1 $ = 45 TL sabit (VİZYON §15 varsayım 5). Toplam giderin yalnızca ≈%8–10'u dolar bazlıdır (AI, altyapı); TL'nin %20 değer kaybı toplam gideri ≈%1,6–2 artırır, ücret enflasyonu daha belirleyicidir.
3. **Ücretler.** 2027 başı brüt planlama değerleri (§5.1); işveren maliyeti brütün ×1,24'ü (2026 asgari ücret brüt 33.030 TL; %21,75 SGK işveren payı + %2 işsizlik, teşvik yok); yan hak 4.000 TL/FTE/ay; A7'de +%15 ayar. Teknokent teşvikleri sayılmadı.
4. **Kullanıcı modeli kohort tabanlıdır.** Retention eğrisi: gün 1 %45, 3 %30, 7 %20, 14 %13, 30 %8, 60 %5, 90 %3,5, 180 %2, 365 %1,2 (baz). VİZYON'un "kayıtlıların %30'u günlük aktif" varsayımı lansman haftası içindir; kümülatif kayıtlı üzerinde DAU payı A12'de ≈%6'dır. B7'nin kapasite tabloları (DAU temelli) bundan etkilenmez.
5. **DAU/MAU** baz 0,30, muhafazakâr 0,25, iyimser 0,35.
6. **Gelir parametreleri.** Ödeyen oranı MAU üzerinden: baz %2, muhafazakâr %1, iyimser %3,5; Çip sepeti 123 TL (≈ARPPU 120 TL/ay); fiyatlar KDV dâhil, brütten net oran 0,80 (KDV, PSP komisyonu ≈%3 ve iade). Çip geliri A3–A5'te yarı hızdadır (Butik 4 ürün).
7. **Çip paket karması** (B2 §9.3 paketleriyle): Avuç %60, Kutu %28, Sandık %9, Konteyner %3; 15–17 hesaplarda büyük paketler ebeveyn onaylı olduğundan küçük paket ağırlıklıdır.
8. **AI birim maliyeti.** B3 §11.5'teki S1 (0,0747 $) ve S4 (0,0569 $ @1k DAU; 0,0487 $ @10k DAU) senaryoları baz alınır; B9'un S4 üstü kaldıraçları (cascade, sınıflandırıcı, semantik önbellek) henüz ölçülmemiş hedeftir (§6.1).
9. **SMS.** 0,25 TL/SMS (VİZYON §15), kayıt başına 3 SMS (OTP, yeniden gönder, 15–17'de ebeveyn linki) = 0,75 TL; MAU başına yeniden giriş OTP'si 0,05 TL.
10. **Altyapı.** Üretim tabanı ≈700 $/ay + staging/izleme ≈500 $/ay + DAU başına 0,35 $/ay; H5'te dış güvenlik denetimi (4.000 $). B7'nin Hetzner varsayımı (§8.9: 1k DAU'da yalnızca sandbox VM'leri ≈€ 80/ay, 10k DAU'da ≈€ 240) bunun yaklaşık yarısıdır; fark Türkiye-içi barındırma ihtimali ve ek hizmetler (Grafana yığını, yedek, DR) için bırakılmış marjdır. B7 §13.6 ile hizalanır (§6.2).
11. **Yaş kapısı geçişi** baz %72 (18+ için %95; 15–17 için ≈%55–60); G0'da ve beta H9'da ölçülür.
12. **Rakip verileri** kamuya açık kaynaklardan derlenmiştir (mağaza listeleri, şirket sayfaları, basın); fiyatlar bölgeseldir ve lansman öncesi güncellenir.
13. **Mevzuat bilgileri** haber ve hukuk bürosu özetlerinden derlenmiştir; kaynaklar arasında Resmî Gazete sayısı gibi ayrıntılar tutarsızdır. Birincil metin G0 kapsamında doğrulanır. 6563, 6493, 6698, 4691, 5746, 5651 ve 5580 sayılı kanunlara yapılan atıflar hukuk teyidine tabidir.
14. **Hibe ve yatırım tutarları** kamuya açık çağrı özetlerinden: TÜBİTAK 1812 BiGG Yatırım 2026 çağrılarında ≈1,35 M TL yatırım; 1512 BiGG hibesi eski çağrılarda 200 bin TL; KOSGEB Girişimci Destek Programı 2026'da üst sınır ≈2 M TL (hibe + faizsiz geri ödemeli + kredi bileşenleri). Çağrı metinlerinden teyit edilecektir.
15. **İçerik kapasitesi.** VİZYON varsayımı yazar başına haftada 3 ders + 3 görevdir; B3 §12.2'nin soru bankası eki (+0,6 yazar-günü/ders) sonrası ≈2,2 ders/hafta (ders başına 1,85 yazar-günü, B4/B5 tasarım tasarrufuyla); işletme L1 şablonu 2 gün; sözleşmeli eğitmen saati yayın sonrası ayda ≈100 saat × 750 TL; MVP'de 20 günlük sözleşmeli ek yazar (≈100 bin TL).
16. **Kanal dönüşümleri.** YouTube videosu başına ≈30 bin izlenme × %0,7 kayıt × %70 yaş kapısı; kulüp başına 20–40 üye; davet K-faktörü 0,15–0,25.
17. **Okul lisansı fiyatları** (Sınıf Paketi 4.500 TL/yıl, Okul Paketi ≈120–150 TL/öğrenci/yıl) planlama değeridir; talep henüz test edilmemiştir.
18. **e-Devlet yaş belirteci** 2027 ilk çeyrekte üçüncü taraf servislere açıktır; açık değilse Seçenek C (§8.1) uygulanır.
19. **Hukuki sınıflandırma.** Bütçe ve plan, KodKent'in hem "oyun platformu" hem "sosyal ağ sağlayıcı" sayılabileceği en ağır varsayımla hazırlanmıştır.
20. **HKO dönüşümü.** Haftalık aktif oyuncu (WAU) ≈ 2,2 × DAU; WAU'nun ≈%55'i haftada en az bir sunucu doğrulamalı kod olayı üretir; HKO ≈ 1,2 × DAU. H9–H10 betasında ve A4'te ölçülerek güncellenir.
21. **Ders tüketimi.** Tamamlanan ders ≈ 0,8 ders / DAU-gün; Otopark Açılış oranı kayıtların %30'u (7 gün içinde), Büfe ve Kargo Deposu Açılışı Otopark açanların sırasıyla %35 ve %12'si; D14+ aktif oyuncunun haftalık ders hızı P50 4, P75 6, P90 9.
22. **Sprint 0.** Kasım–Aralık 2026'da şirket, hesaplar, hukuk danışmanı ve çekirdek ekip hazırdır; H1 = 4 Ocak 2027. Hazırlık gecikirse takvim aynı süre kayar, bütçe değişmez (maaşlar işe başlama tarihinden itibaren).


---

## 14. Açık Sorular

Önem sırasıyla, en çok 10:

1. **Hukuki sınıflandırma ve 13–14 yaş.** *(KANON §12.2: varsayılan Seçenek A; 13–14 yolu MVP dışı, hukuk teyidine bağlı.)* KodKent, 7578 sayılı Kanun ve yönetmelik bakımından "sosyal ağ sağlayıcı", "oyun platformu" ya da ikisi mi? 13–14 yaşa sosyal özelliksiz bir "Akademi Modu" ile hizmet verilebilir mi? Barındırma Hetzner'de (B7 ADR-15) kalabilir mi, yoksa 15–17 yaş verisi için Türkiye-içi sağlayıcı mı gerekir? (G0, H2; yazılı hukuk görüşü.)
2. **e-Devlet yaş belirteci.** Siber Güvenlik Başkanlığı'nın belirteç hizmeti üçüncü taraf küçük servislere 2027 ilk çeyrekte açık mı, entegrasyon koşulu, ücreti ve sorumluluğu ne? Açık değilse Seçenek C (önce 18+) kabul edilir mi?
3. **Gelir modeli.** Çip tek başına AI maliyetini karşılamıyor (§6.4). Okul/kulüp lisansı ve kurumsal koltuk sponsorluğu, "öğrenme asla paralı değildir" ilkesiyle uyumlu sayılarak KANON para kazanma ilkesine eklenebilir mi (Ek A, #5)?
4. **AI maliyet hedefi.** B3'ün lansman maliyeti (dört kaldıraçla 0,057 $/DAU/gün, KANON hedefi 0,05 ancak 10k DAU'da) A9'da ≤0,045, A12'de ≤0,035, A15'te ≤0,02 $'a indirilebilir mi; bunun için Haiku-first cascade ve sınıflandırıcı-önce puanlama kabul edilebilir mi, kappa ≥0,75 ve itiraz <%3 korunabilir mi (B3 kalibrasyonu)?
5. **İçerik pisti ve Staj modu.** B2 Ek A-1 (Staj modu) ve A-9 (Hata Bildirimi tavanı 5) v1.1'e alınacak mı; ilk içerik damlasının H14'te gelmesi için yazar #2'nin A4'te başlaması yeterli mi?
6. **MVP süresi.** *(KANON §12.3: 12 hafta; +2 hafta yalnızca G0 kararıyla.)* Uyum paketiyle (yaş kapısı, Ebeveyn Paneli) 12 hafta yeterli mi, yoksa MVP 14 haftaya mı çıkmalı? (G0 sonrası H3'te karar.)
7. **Hedef kitle alt sınırı.** *(ÇÖZÜLDÜ 3 Kasım, KANON §12.2: `min_kayit_yasi=15`; yalnızca lise kanalı etkisi açık.)* KANON'da 13 olan alt sınırın 15'e çekilmesi lise kanalı ve persona planını nasıl etkiler; KANON v1.1/v2 kararı ne zaman?
8. **15–17 yaşta Çip.** B2 §9.3'teki "300 Çip/ay tavan" yerine tüm satın almaların ebeveyn onayına bağlanması ödeme dönüşümünü ne kadar düşürür; ebeveynin Ebeveyn Paneli'nden çocuğunun hesabına kendi kartıyla Çip alması (oyuncular arası hediye değildir) KANON'un "hediye yok" ilkesiyle uyumlu sayılır mı?
9. **İkinci dil.** Python mı JavaScript mi? "Haber ver" sayaçlarının karar eşiği (%15 fark, ≥1.500 sayaç) yeterli mi?
10. **Marka ve konum.** "KodKent" marka ve alan adı uygunluğu (TÜRKPATENT sorgusu H1) ve Teknokent'te yerleşim kararı (maliyet avantajı ve mevzuat teyidi).


---

## 15. Diğer Belgelere Bağımlılıklar

Bu belgenin yazımı sırasında B3–B8 eşzamanlı yazılıyordu; "Durum" sütunu okuma anındaki diskteki durumu yansıtır. B3 (§12'ye kadar, maliyet modeli §11 dâhil), B4 (tamamlanmaya yakın), B5 ve B6 (tamamlanmış) okunmuş ve hizalanmıştır. **B7'nin §13.6 (altyapı maliyeti) ve §14.7 (teknik sprintler) bölümleri bekleme süresi sonunda henüz yazılmamıştı:** B9 bu iki konuda kendi tahminini kullanır (altyapı §6.2, sprintler §4.3) ve B7 tamamlandığında hizalama gerekir.

| Belge | B9'un beklediği / verdiği | Kullanıldığı bölüm | Durum |
|---|---|---|---|
| **KANON v1** | Tüm sayılar ve adlar; Ek A önerileri v1.1/v2 kararı bekler | Tümü | Bağlayıcı |
| **VİZYON** | Eşikler (§4, §13), riskler (§12), 12 hafta planı | §3, §4, §10 | Bağlayıcı |
| **B1** | Shard 40, Oda/Daire/Çatı Katı; 15–17 için Turist modu ve Vitrin görünürlüğü ("ayrıştırılmış hizmet" B1'e eklenmeli) | §3.3, §8.2 | B1 HAZIR; 15–17 görünürlük kuralları eksik |
| **B2** | §9 Çip paketleri ve 13–17 tavanı (15–17 onay modeline revize), §11 profiller, Ek A-1, A-9, A-11 | §2.2, §6, §9.6 | HAZIR; revize önerisi Ek A |
| **B3** | AI maliyet modeli (§11.5 S1–S4), kota, S4 üstü cascade ve sınıflandırıcı-önce önerisi, K1 PII süzgeci, soru bankası emeği (§12.2), kalibrasyon, itiraz | §5.4, §6.1, §6.4, §8.3 | §12'ye kadar okundu; rakamlar B3 ile uyumlu |
| **B4** | 100 ders (M1–M11), 36,5 saat (ders + görev + sınav), yükseltme kapıları (L2 2.1 · L3 3.4 · L4 4.7 · L5 5.1 + 6.3) | §3.2, §4.1, §5.4 | Okundu; Otopark L3–L5 sırası B4 kapılarına göre yerleştirildi |
| **B5** | Dil-bağımsız Spec (§1.1/6), Büfe ve Kargo Deposu L1 tam spec, L2 test derinliği (Açık Soru 9), transfer KPI önerisi (§6.3), `int` taşma sınırı, Müfettiş günde 10 çağrı | §3.2, §9.3, §11 | Tamamlanmış; Büfe/Kargo L2 kapsamı esneme olarak bırakıldı |
| **B6** | Bildirim bütçesi ve yaş duvarı (13–17 ↔ 18+ → 15–17 ↔ 18+), Salı yayını, P0 moderasyon SLA, retention hedefleri, Lonca/Düello/Arena | §4, §5.4, §8.5, §9 | Tamamlanmış; "13–17" ifadesi yaş kapısıyla güncellenmeli |
| **B7** | Kapasite (DAU ölçeği), olay şeması (§9.4'teki 61 olay), JWT `age_band` (`13-15`, `16-17`, `18+`) yerine `<15` red / `15-17` / `18+` ve e-Devlet belirteç doğrulama modülü, `age_gate_min` bayrağı, barındırma (ADR-15 Hetzner mı Türkiye-içi mi), altyapı maliyeti (§13.6), teknik sprintler (§14.7) | §4.3, §6.2, §8.3, §9.4 | §8'e kadar yazılmıştı; §13–§14 yazım sürecinde, hizalama notu §6.2 ve §4.3'te |
| **B8** | Giriş akışı "telefon → SMS → doğum yılı → veli telefonu" (B8 §6) yerine "telefon → SMS → e-Devlet yaş belirteci → (15–17) ebeveyn telefonu"; Ebeveyn Paneli (ekran değil: ayrı web sayfası; KANON §12.2); 4 GB telefonda fps hedefi | §3.3, §3.4, §8.2 | Ekran envanteri hazır; doğum yılı adımı ve Ebeveyn Paneli güncellenmeli |
| **B10 / İNDEKS** | Prototip veri seti; belge haritası | — | Sonra yazılacak |


---

## Ek A. Sabit Önerileri (KANON v2 adayları)

Hepsi KANON v1.1 ya da v2 adayıdır; onaylanana kadar KANON v1 geçerlidir. Satır 1–3 yasal zorunluluktan doğar (§8.1) ve G0 kararıyla kesinleşir. *(3 Kasım: kabul/ret kararları KANON §12.3'tedir; hukuk teyidi şarttır.)*

| anahtar | KANON v1 değeri | önerilen değer | gerekçe |
|---|---|---|---|
| `hedef_kitle_alt_yas` (§1) | "13 altı kayıt olamaz; 13–17 veli onayı (SMS linki, 72 saat)" | 15 altı: kayıt yok (13–14 için sosyal özelliksiz "Akademi Modu" yalnızca yazılı hukuk onayıyla, v1.1); 15–17: ayrıştırılmış hizmet + e-Devlet yaş belirteci + Ebeveyn Paneli; 18+: tam hizmet | 7578 sayılı Kanun ve 10.10.2026 yönetmeliği (B9 §8.1); `age_gate_min` bayrağı |
| `ekran_listesi` (§6) | 24 ekran + HUD; Arena ve Lonca Binası sonraki sürüm | ~~25. ekran~~ (RET, KANON §12.2): **Ebeveyn Paneli** ayrı web sayfası, ekran sayısı 24; Giriş ekranına e-Devlet yaş doğrulama adımı; Öğretmen Paneli (v1.1) | Yönetmelik ebeveyn kontrol araçları; okul kanalı (B9 §2.3, §7.6) |
| `veli_onayi_akisi` (§1, §6) | SMS linki, 72 saat; onaya kadar serbest metin sohbet kapalı | Aynı 72 saat; onaya kadar ziyaret kabulü, DM, serbest metin, Vitrin görünürlüğü ve Çip harcaması kapalı; panelde süre, harcama limiti, satın alma onayı | Yönetmelik: süre sınırı, harcama limiti, satın alma onayı |
| `cip_15_17_kural` (B2 §9.3) | 13–17: 300 Çip/ay tavan, Sandık ve Konteyner veli onaylı | 15–17: limit varsayılan 0; her satın alma Ebeveyn Paneli limiti ve onayına bağlı; 18+ aynı | Yönetmelik: satın alma ve ücretli üyelik ebeveyn onayı |
| `para_kazanma_ilkesi` (00-fikir §2) | "Öğrenme asla paralı değildir; Çip yalnızca kozmetik/konfor" | Aynı + ek: okul/kulüp lisansı yalnızca yönetim ve raporlama özelliği satar; kurumsal koltuk sponsorluğu öğrenme erişimini değiştirmez; ders, ipucu, test, AI kotası ve Savunma hakkı hiçbir kanalda satılmaz | B2C kozmetik geliri değişken maliyeti karşılamıyor (B9 §6.4) |
| `ai_maliyet_hedefi` (§9) | ≈0,05 $/DAU/gün; alarm 0,08 | Lansman 0,057 (B3, 1k DAU) → ≤0,045 (A9) → ≤0,035 (A12) → ≤0,02 (A15) → ≤0,01 (A18+); Haiku-first cascade (kappa ≥0,75 ve itiraz <%3 koşuluyla) ve sınıflandırıcı-önce puanlama | Birim ekonomi (B9 §6.4–§6.5); KANON'un 0,05 değeri ancak 10k DAU'da tutuyor |
| `mvp_suresi` (VİZYON §13) | 12 hafta | 12 hafta; G0 sonrası uyum paketi sığmazsa 14 hafta | e-Devlet entegrasyonu ve Ebeveyn Paneli (B9 §3.1) |
| `mvp_isletme_seviyeleri` (§5) | "MVP'de açık: #1 (L1–L2), #2, #4" | Büfe ve Kargo Deposu için L1 zorunlu, L2 esneme kapsamı; zaman baskısında Kargo Deposu v1.1'e (kesme sırası 5) | B5 kapsamı; B9 §3.1 |
| `kpi_taban_tanimi` (VİZYON §4, §13) | "72 saatte Otopark AÇIK %35" (taban belirsiz) | Taban: yaş kapısını geçip avatarı tamamlayan oyuncu; "oyuncu" = OTP + yaş kapısı geçmiş hesap | Ölçüm netliği (B9 §3.4, §9.3) |
| `kuzey_yildizi` | Yok | HKO: haftalık sunucu doğrulamalı kod olayı üreten benzersiz oyuncu | B9 §9.1 |
| `icerik_damlasi` | Yok (yazar başına haftada 3 ders + 3 görev varsayımı) | Haftalık Salı yayını (B6 §12.1); H14–H20'de ≈4 ders/hafta; ilk damla lansmandan 2 hafta sonra | İçerik pisti (B9 §5.4) |
| `yas_derecelendirmesi` | Yok | KodKent beyanı: 15+ | Oyun platformu yükümlülüğü (B9 §8.1) |
| `ders_semt_takvimi` (VİZYON §13) | Atölyeler ve sonrası "görünür ama kapalı"; sürüm dağılımı belirsiz | Atölyeler v1.1 (H16), Kampüs ön açılış v1.1 (H20), Finans Bölgesi v1.2, Veri Vadisi v2, Bulut Tepesi A13+ | İçerik pisti ve semt kapıları (B9 §4.1, §5.4) |

---

**Revizyon Notu (3 Kasım).** KANON v2 (§12) uyumu: Ek A satır 1–3 karara bağlandı — alt yaş 15 (`min_kayit_yasi=15`), 25. ekran reddedildi (Ebeveyn Paneli ayrı web sayfası, ekran sayısı 24), veli akışı ve 15–17 Çip modeli kabul; `mvp_suresi` 12 hafta (+2 yalnızca G0); AI maliyet hedefi yolu (0,057 → ≤0,045 → ≤0,035 → ≤0,02) kabul; Açık Soru 1, 6, 7 yanıtlandı; B9'daki '13–17' ifadeleri KANON v1'e yapılan tarihsel atıftır, bilerek değiştirilmedi. Ayrıntı: `_KANON-v2-degisiklikler.md`.
