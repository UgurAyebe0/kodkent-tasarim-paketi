export const meta = {
  name: 'kodkent-tasarim-paneli-devam',
  description: 'KodKent tasarim panelinin kalan asamalari: 9 boyut (B1/B2 hazir), 5 elestirmen, KANON v2, revizyon, tamlik kritigi, indeks',
  phases: [
    { title: 'Derinlestirme', detail: '9 boyutta ayrintili spec (hazir olanlar dogrulanip korunur)' },
    { title: 'Elestiri', detail: '5 elestirmen: tutarlilik, teknik, pedagoji, ekonomi, sadakat' },
    { title: 'Revizyon', detail: 'Kanon v2, spec duzeltmeleri, eksiklik kritigi, indeks' },
  ],
}

const SP = 'C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi'
const BRIEF = `${SP}/brief/00-fikir.md`
const SPEC = `${SP}/spec`
const VISION = `${SPEC}/A-vizyon-FINAL.md`
const KANON = `${SPEC}/KANON.md`

const COMMON = `Sen "KodKent" adlı oyunlaştırılmış C# öğrenme platformunu tasarlayan çok-ajanlı bir stüdyo ekibinin üyesisin.
ÖNCE şu dosyayı Read aracıyla tamamen oku: ${BRIEF} (kurucunun fikri, SABİT kararlar, yön).
Kurallar:
- Tüm çıktıları TÜRKÇE yaz (teknik terimler İngilizce kalabilir). Somut ol: sayılar, tablolar, isimler, örnekler, formüller. Genel geçer tavsiye ve dolgu cümle yazma.
- Kurucunun fikrindeki her öğeyi koru ve geliştir; SABİT kararlara aykırı öneri yapma (ürün adı KodKent, Bayt/Çip/XP, .NET backend, Claude API, gerçek sandbox, pay-to-learn yok).
- Soru sorma; karar ver ve varsayımları belgenin sonundaki "Varsayımlar" ve "Açık Sorular" bölümlerine yaz.
- Dosyaları Write aracıyla UTF-8 Markdown olarak, tam olarak verilen yola yaz. Başlıklar (##), tablolar ve gerektiğinde kod blokları kullan. Çok uzun belgeleri parça parça yaz (önce iskelet, sonra Edit ile bölüm ekle) — tek seferde dev bir Write deneme.
- Artifact aracını KULLANMA, hiçbir şey yayınlama. Sadece dosya yaz ve istenen yapısal özeti döndür.
- Son metnin insan için bir mesaj değil, istenen yapısal veridir.`

const SUMMARY_SCHEMA = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    summary: { type: 'string', description: 'En fazla 120 kelimelik Türkçe özet' },
    constants_proposed: { type: 'array', items: { type: 'object', properties: { key: { type: 'string' }, value: { type: 'string' }, note: { type: 'string' } }, required: ['key', 'value'] } },
    open_questions: { type: 'array', items: { type: 'string' } },
  },
  required: ['path', 'summary', 'constants_proposed', 'open_questions'],
}

// ---------------- PHASE B: DERINLESTIRME ----------------
phase('Derinlestirme')
log('9 boyutta derinleştirme (B1 ve B2 diskte hazır; doğrulanıp korunacak)')

const READ_FIRST = `ÖNCE şu üç dosyayı Read ile tamamen oku ve onlara sadık kal: ${BRIEF} , ${VISION} , ${KANON} . KANON'daki isim ve sayılar bağlayıcıdır; değiştirmek istediğin bir sabit varsa constants_proposed içinde öner ama belgende KANON değerini kullan.
Belge id'leri (atıflarda yalnızca bunları kullan): B1 dünya/şehir, B2 ilerleme/ekonomi, B3 eğitim/AI, B4 müfredat, B5 işletmeler/kod, B6 görevler/sosyal/liveops, B7 backend mimari, B8 istemci/UI, B9 ürün/yol haritası.`

const DIMS = [
  { id: 'B1', slug: 'dunya-sehir', title: 'Dünya & Şehir Tasarımı', role: 'Kıdemli dünya/seviye tasarımcısı ve sanat yönetmeni (izometrik sosyal oyunlar)', spec: `
- İzometrik şehir haritası: grid boyutu, tile boyutu (2:1 izometrik, 64x32 px önerisi), semtlerin konumu; metin/ASCII şehir krokisi.
- Her semt için: tema, görsel motifler, renk vurgusu, bina listesi (Akademi şubesi, oyuncu işletme arsaları, NPC dükkânları), açılış seviyesi, ambiyans sesleri.
- Akademi: iç mekân düzeni, sınıf/atölye odaları, Usta'nın yeri.
- Oyuncu evi/odası: başlangıç odası, mobilya sistemi, ziyaret, oda kapasitesi.
- İşletme arsaları: bir oyuncunun otoparkı KURULUM ÖNCESİ ve SONRASI nasıl görünür; 5 seviye (L1–L5) için görsel kademe.
- Avatar sistemi: vücut tipleri, saç, yüz, kıyafet slotları, emote listesi (12+), unvan rozetleri.
- Usta NPC'ler: her semt için ad, görünüş, kişilik, konuşma tarzı, 3 örnek replik, öğretim tarzı.
- Gece/gündüz ve mevsim; dünya etkinlikleri; navigasyon; oda/instance modeli (Sanalika benzeri: oda başına kapasite, kalabalık yönetimi).
- Sanalika hissi kontrol listesi.` },
  { id: 'B2', slug: 'ilerleme-ekonomi', title: 'İlerleme & Ekonomi', role: 'Oyun ekonomisti ve sistem tasarımcısı (F2P ekonomi dengeleme)', spec: `
- XP eğrisi: formül + seviye 1-60 tablosu; unvan bantları; seviye atlama ödülleri.
- XP kaynakları ve miktarları; Bayt muslukları ve giderleri (miktarlarla).
- İşletme ekonomisi tablosu: her işletme için fiyat, seviye başına saatlik gelir, çevrimdışı gelir tavanı, geri ödeme süresi.
- Pasif gelir formülü (kod ile); kozmetik fiyatlandırma; Çip paketleri; enflasyon kontrolü.
- 30 günlük örnek oyuncu simülasyonu (hafif/normal/yoğun); pacing hedefleri.` },
  { id: 'B3', slug: 'egitim-ai', title: 'Eğitim Sistemi & Yapay Zeka Öğretmen', role: 'Öğrenme deneyimi tasarımcısı ve LLM uygulama mühendisi', spec: `
- Ders anatomisi (adım adım bileşenler: Konu Kartı, Canlı Örnek, Dene, Usta Sorusu, Özet; PRIMM; süreler).
- 4 soru tipi (KANON adlarıyla: Kavram Sorusu, Çıktı Tahmini, Hata Avı, Kod Yazma): her biri için tanım, 2 örnek soru (C#), beklenen cevap türü, puanlama rubriği (Doğruluk 50 / Tamlık 30 / Açıklık 20 ve alt ölçütler), puan→XP eşlemesi.
- Kurul (puanlayıcı) ile Usta (öğretmen) ayrımı; Kurul Kartı akışı; Sokratik takip sorusu akışı (durum makinesi), en fazla tur sayısı, telafi puanı.
- Puanlama pipeline'ı: istem şablonları (TÜRKÇE, tam metin), JSON çıktı şeması (puan, ölçüt bazlı puanlar, geri bildirim, güven, kopya şüphesi), model seçimi (haiku ön eleme → sonnet → düşük güvende opus), prompt caching stratejisi, gecikme bütçesi (p95), yeniden deneme.
- Kalibrasyon: altın set, insan-AI uyumu (kappa), iki model uyuşmazlığı; itiraz akışı ve insan inceleme kuyruğu.
- Anti-cheat: ders metninden kopya tespiti, istem enjeksiyonu filtresi, yapıştırma/zaman analizi, paraphrase; yakalanınca ne olur.
- İpucu merdiveni (Pusula → Fener → Taslak → Örnek; ücretsiz), Berrak Zihin bonusu; Usta ses tonu kılavuzu (Türkçe hitap, geri bildirim formülü).
- İşletme kod görevlerinde AI'nın rolü: test sonuçları makine tarafından; AI kod incelemesi formatı; Savunma sorusu üretimi ve değerlendirmesi; "Usta Yorumu" örneği (otopark kodu için).
- Maliyet modeli: ders başına ortalama token, ders başına ve aktif kullanıcı başına günlük maliyet (USD ve TL); KANON §9 hedefleriyle uyum; önbellek ve haiku ile düşürme senaryoları; Batch API.
- İçerik üretim pipeline'ı: ders yazımı (insan + AI taslak), soru bankası üretimi, inceleme, A/B.` },
  { id: 'B4', slug: 'mufredat', title: 'C# Müfredatı', role: 'Müfredat tasarımcısı ve kıdemli .NET eğitmeni', spec: `
- Tam C# yolculuğu: 10-14 modül → 80-120 ders. Her ders bir tablo satırı: ders id (ör. 1.1, 2.3 — KANON ve vizyonla uyumlu), başlık, öğrenme hedefleri (2-3), ön koşul, bağlı semt (KANON §2.1), XP (KANON §3.3), tahmini dakika, soru tipi karışımı, bağlı işletme/seviye.
- Çarşı dersleri 1.1–1.4 TAM içerikle (kartların metni ≤60 kelime, canlı örnek kodu, 3 Usta sorusu: tip, metin, rubrik ölçütleri, örnek iyi cevap, anahtar kavramlar) — prototip bunları aynen kullanacak.
- Modül kapsamı en az: giriş & araçlar, değişkenler/tipler, operatörler, koşullar, döngüler, metotlar, diziler/List, string işlemleri, hata yönetimi, OOP, koleksiyonlar, LINQ, DateTime, dosya I/O, generics, delegate/event/lambda, async/await, unit test, tasarım kalıpları (temel), EF Core & veritabanı, minimal Web API; records/pattern matching.
- Her semt için "Semt Sınavı" tasarımı ve geçme eşiği; Ders Mührü ve Telafi Turu; aralıklı tekrar ("Günlük Tekrar") algoritması.
- Kavram → işletme eşlemesi tablosu; Otopark yolculuğu: L1'den önce bitirilmesi gereken dersler ve Ruhsat görevleri (Meydan Saati, Dakikadan Saate, Kademeli Karar, Taksimetre — KANON §4).
- Zorluk eğrisi için veri (modül bazında ortalama dakika/XP).` },
  { id: 'B5', slug: 'isletmeler-kod', title: 'İşletmeler & Kod Projeleri Kataloğu', role: 'Kıdemli C# geliştirici ve programlama görevleri (challenge) tasarımcısı', spec: `
- Platformun genel "Challenge Spec" formatını tanımla: JSON şeması (id, isletme, seviye, baslik, musteri_istegi, sozlesme_karti, imza/template kodu, public_tests, hidden_tests, seeded_tests, edge_cases, ipucu_merdiveni, savunma_sorulari, rubrik, odul). Test harness yaklaşımı: oyuncu sabit imzalı static metodu yazar, harness çağırır (xUnit benzeri); stdin/stdout alternatifinin artı/eksileri.
- İşletme kataloğu (KANON §5'teki 20 işletme): her biri için semt, açılış seviyesi, fiyat, seviye başına saatlik gelir, "müşteri hikâyesi", seviye başlıkları ve her seviyenin öğrettiği kavram.
- OTOPARK TAM AYRINTILI (L1–L5). L1: Hasan Abi'nin isteği birebir; Gereksinim Netleştirme diyaloğu (en az 4 hazır soru + cevap; Keskin Göz); Sözleşme Kartı (KANON §5.1 AYNEN); imza \`public static int Otopark.UcretHesapla(int dakika)\`; iskelet kod; 6 açık + 14 gizli + tohumlu test üretim kuralı (KANON tablosu AYNEN); referans çözüm (KANON'daki); Savunma soruları (3+); yaygın hatalar; ipucu merdiveni (4 kademe); Usta Yorumu örneği.
  - DOĞRULAMA ZORUNLU: C:/Users/uuray/AppData/Local/Temp/kodkent-work/dotnet-check/otopark klasöründe Bash ile "dotnet new console --force -o <klasör>" çalıştır, Program.cs'yi referans çözüm + tüm açık ve gizli test vakalarını çalıştıran bir ana programla değiştir, "dotnet run" ile çalıştır, gerçek çıktıyı belgeye "Gerçek Çalıştırma Çıktısı" bölümü olarak aynen yapıştır. Uyuşmazlık varsa mantığı düzelt, tekrar çalıştır. (dotnet ilk çalıştırmada yavaş olabilir; bekle.)
  - L2 abone listesi (List<string>), L3 indirim + ArgumentOutOfRangeException (enum), L4 gece tarifesi (DateTime), L5 kapasite/kuyruk: her biri için müşteri isteği, net spec, imza, 4+ açık test, 3+ gizli test, ipucu merdiveni, referans çözüm özeti.
- Büfe, Manav, Kargo Deposu için L1 tam spec (müşteri isteği, sözleşme, imza, 4 test, ipuçları); kalan işletmeler için seviye başlıkları + 2 örnek test.
- Yaygın hatalar ve AI "Usta Yorumu" örnekleri; Hata Bildirimi görev örneği (sentetik hatalı kod + beklenen açıklama).` },
  { id: 'B6', slug: 'gorevler-sosyal-liveops', title: 'Görevler, Sosyal Katman & Canlı Operasyon', role: 'Live-ops ve sosyal sistemler tasarımcısı (MMO/sosyal oyun)', spec: `
- Görev tipleri (KANON §8): her tip için üretim kuralı ve ödül aralığı; 40+ somut görev (ad, tip, koşul, ödül, açılış seviyesi); Çarşı/otopark ve ilk hafta görevleri ayrıntılı.
- Günlük Tekrar ve seri sistemi; etkinlikler (haftalık, aylık sezon, bayram); sezon ödül yolu (kozmetik).
- Loncalar ("Yazılım Ekibi"; v1.1): kurma şartı, kapasite, lonca binası, görevler, bonus, sohbet.
- Arkadaşlık, Oda ziyareti, Alkış, Vitrin; sohbet ve moderasyon (haiku, filtre, raporlama, ceza basamakları, 13-17 güvenli mod, KVKK log saklama).
- Liderlik Panosu (Haftalık Lig, Kalıcılık Ligi, En Hızlı Otopark, en kazançlı işletme); hile tespiti.
- Kod Düellosu (v1.2), akran kod incelemesi, Kalfa Yardımı (mentorluk).
- Bildirim/push stratejisi; retention tasarımı (D1/D7/D30 kancaları; geri dönen oyuncu akışı).` },
  { id: 'B7', slug: 'backend-mimari', title: 'Backend Mimari & Veri Modeli', role: 'Baş yazılım mimarı (.NET, dağıtık sistemler, güvenlik)', spec: `
- Mimari karar: modüler monolit + ayrı sandbox worker'ları (öneri ve gerekçe; ADR listesi 10+).
- Modüller ve sorumlulukları: Auth(OTP), Oyuncu/Profil, İlerleme, Eğitim(ders, Kurul/AI), Challenge, Ekonomi(cüzdan, çift kayıtlı defter), Dünya(şehir, shard, işletmeler), Sosyal, Pazar/Envanter, Görev, Bildirim, İçerik CMS, Analitik, Moderasyon.
- Veri modeli: 35+ tablo (kolonlar, tipler, kısıtlar, ilişkiler); 12 kritik tablonun PostgreSQL DDL'i.
- API: REST uç noktaları (40+), 20 kritik uç nokta için istek/yanıt JSON; hata formatı; sürümleme; rate limit.
- Gerçek zamanlı: SignalR hub'ları, olaylar, shard/oda modeli (40 avatar), Redis backplane, presence.
- Asenkron işler: kuyruklar (code-run, ai-grade, income-tick, notification), idempotency, retry, dead-letter.
- Sandbox: gVisor (runsc) + Roslyn bellek içi derleme, limitler (KANON §9), test runner protokolü (harness ↔ oyuncu kodu; JSON), tohumlu test üretimi, worker havuzu, ölçekleme, kötüye kullanım senaryoları; C# worker iskeleti.
- İşletme simülasyonu: günlük sentetik trafik (deterministik tohum), referans çözüm tavanı, kasa üretimi.
- AI servisi: istem yönetimi, structured output, prompt caching, maliyet takibi, kota, Batch API; C# istemci örneği.
- Auth: telefon OTP (Netgsm, İleti Merkezi, Twilio Verify), akış, deneme sınırları, cihaz bağlama, JWT + refresh, KVKK, 13-17 veli onayı.
- Ekonomi defteri: çift kayıtlı ledger, işlem türleri, denetim; C# örnek.
- Güvenlik, KVKK/GDPR, altyapı (Kubernetes; Hetzner/Azure), CI/CD, gözlemlenebilirlik, yedekleme, maliyet (1k/10k/100k DAU), monorepo klasör yapısı.` },
  { id: 'B8', slug: 'istemci-ui', title: 'İstemci, Oyun Motoru & Ekran Tasarımları', role: 'Kıdemli frontend/oyun istemcisi mühendisi ve UX tasarımcısı', spec: `
- Teknoloji: React + TypeScript, PixiJS (izometrik), Monaco Editor (C#), SignalR istemcisi, durum yönetimi, PWA; alternatiflerin kısa karşılaştırması.
- Render: tilemap, sprite atlas, z-sıralama, A* yol bulma, kamera, performans bütçeleri, düşük cihaz modu.
- Asset pipeline ve görsel stil: 2:1 izometrik, 64x32 tile, palet (İznik çinisi esinli: turkuaz, kobalt, mercan, amber, nane), tipografi (Fredoka başlık, Nunito gövde, JetBrains Mono kod), ikonografi.
- Ekran envanteri = KANON §6'daki 24 ekran + HUD (adlar AYNEN): her ekran için amaç, yerleşim (bölgeler), bileşenler, durumlar (yükleniyor/boş/hata metinleri), ana etkileşimler, gereken veri (API), mobil düzeni. Özellikle Derleyici Meydanı, Kurul Kartı, İş Emri, İşletme Editörü, Savunma, İşletme Paneli, Pazar ayrıntılı.
- HUD spec; navigasyon haritası; mikro etkileşim/animasyon listesi (süre/easing; reduced-motion); bileşen kütüphanesi; erişilebilirlik; yerelleştirme; mobil uyarlama (dokunmatik, dikey, kod klavyesi yardımcıları).` },
  { id: 'B9', slug: 'urun-yol-haritasi', title: 'Ürün Stratejisi, MVP & Yol Haritası', role: 'Ürün yöneticisi ve kurucu ortak (edtech + oyun)', spec: `
- Rakip analizi tablosu (Sanalika, Duolingo, Codecademy, CodeCombat, Codewars, Exercism, Screeps, Mimo, Sololearn, Habbo).
- Konumlandırma ve 3 persona; MVP kapsamı (İÇİNDE/DIŞINDA; KANON ile uyumlu: Çarşı+Liman, otopark L1–L2, Büfe, Kargo Deposu) ve sayısal başarı kriterleri.
- Yol haritası: MVP (0-3 ay), v1.1, v1.2, v2; epikler, bağımlılıklar; 2 haftalık sprint planı (ilk 6 sprint ayrıntılı).
- Ekip; bütçe (TL ve USD aylık; 12 ay); birim ekonomi (AI maliyeti/DAU, SMS/kayıt, ARPU, dönüşüm, başabaş).
- KPI ve analitik olaylar (30+); risk kaydı (15+); pazara giriş; hukuki/uyum; gelecek diller (dil-agnostik challenge spec).` },
]

const dimResults = await parallel(DIMS.map(d => () => agent(`${COMMON}

ROLÜN: ${d.role}
${READ_FIRST}

GÖREV: "${d.title}" belgesini yaz (5000-9000 kelime; tablolar sayılmaz, cömert ol). Dosya yolu: ${SPEC}/${d.id}-${d.slug}.md
DEVAM KURALI (önceki çalıştırma yarıda kesildi): Önce hedef dosyanın var olup olmadığına bak (Bash: ls -la). VARSA ve 40 KB'den büyükse onu Read ile oku; aşağıdaki zorunlu içerik listesini karşılıyorsa YENİDEN YAZMA — yalnızca eksik/yarım bölümleri Edit ile tamamla, belge içi atıfları yukarıdaki gerçek id'lere düzelt ve "Varsayımlar / Açık Sorular / Diğer Belgelere Bağımlılıklar" bölümlerinin olduğundan emin ol; sonra yapısal özeti döndür. YOKSA ya da küçükse sıfırdan yaz; ${SPEC}/_${d.id.toLowerCase()}_* parça dosyaları varsa kaynak olarak kullanabilirsin.
Zorunlu içerik:${d.spec}
- Sonda: "Varsayımlar", "Açık Sorular" ve "Diğer Belgelere Bağımlılıklar".
- Belge id'in ${d.id}. Başka belgelere atıf yaparken id ile yap.

Sadece yapısal özeti döndür (path, summary, constants_proposed, open_questions).`, { label: `${d.id}:${d.slug}`, phase: 'Derinlestirme', schema: SUMMARY_SCHEMA })))

const dims = dimResults.map((r, i) => r ? { ...r, id: DIMS[i].id, title: DIMS[i].title, expectedPath: `${SPEC}/${DIMS[i].id}-${DIMS[i].slug}.md` } : { id: DIMS[i].id, title: DIMS[i].title, path: `${SPEC}/${DIMS[i].id}-${DIMS[i].slug}.md`, expectedPath: `${SPEC}/${DIMS[i].id}-${DIMS[i].slug}.md`, summary: '(özet alınamadı)', constants_proposed: [], open_questions: [] })
log(`${dimResults.filter(Boolean).length}/9 boyut belgesi özet döndürdü; 5 eleştirmen devrede`)

// ---------------- PHASE C: ELESTIRI ----------------
phase('Elestiri')
const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: { type: 'array', items: { type: 'object', properties: {
      id: { type: 'string' }, severity: { type: 'string', enum: ['kritik', 'yuksek', 'orta', 'dusuk'] },
      affected: { type: 'array', items: { type: 'string' }, description: 'Etkilenen belge id listesi: B1..B9, KANON, VIZYON' },
      title: { type: 'string' }, detail: { type: 'string' }, fix: { type: 'string' },
    }, required: ['id', 'severity', 'affected', 'title', 'detail', 'fix'] } },
    overall: { type: 'string' },
  },
  required: ['findings', 'overall'],
}
const specList = dims.map(d => `- ${d.id} ${d.title}: ${d.path || d.expectedPath}`).join('\n')
const CRITICS = [
  { key: 'tutarlilik', lens: 'Tutarlılık denetçisi. Belgeler arası çelişkileri bul: aynı sabitin farklı değerleri (seviye, fiyat, XP, gelir), farklı isimler (semt, NPC, ekran, para), birbirini bozan akışlar, KANON ile uyumsuzluk, yanlış belge id atıfları. Her bulguda iki belgeden alıntı/değer ver.' },
  { key: 'teknik', lens: 'Kıdemli güvenlik ve altyapı mühendisi (adversarial). Sandbox kaçışı, AI maliyet patlaması, OTP/SMS kötüye kullanımı, SignalR ölçekleme, veri modeli hataları, KVKK ihlali riskleri, gerçekçi olmayan gecikme/maliyet varsayımları. Her bulgu için somut saldırı/arıza senaryosu ve düzeltme.' },
  { key: 'pedagoji', lens: 'Öğrenme bilimi denetçisi. Gerçekten öğretiyor mu? Zorluk eğrisinde sıçramalar, ön koşul boşlukları (bir challenge henüz öğretilmemiş kavram istiyor mu?), AI puanlamanın adaleti/açıklanabilirliği, hile ile öğrenmeden ilerleme yolları, bilişsel yük, geri bildirim kalitesi. B4 ile B5 ve B3 arasındaki eşlemeyi satır satır kontrol et.' },
  { key: 'ekonomi', lens: 'Oyun ekonomisi ve retention denetçisi (adversarial). Grind duvarları, enflasyon, pay-to-win sızıntıları, ilk 30 dakikada boşluklar, ödül döngüsünde ölü noktalar, pasif gelirin öğrenmeyi gereksizleştirmesi, 30 günlük simülasyondaki tutarsızlıklar. Sayılarla hesapla.' },
  { key: 'sadakat', lens: 'Kurucu temsilcisi. Kurucunun fikrindeki HER öğenin (telefon kaydı, dil seçimi sadece C#, Sanalika tarzı dünya, eğitim içinde AI soru-cevap ve puanlama, XP/level, işletme satın alma, otopark ücret kuralları birebir, kodla para kazanma, para ile kozmetik, "oyunlarla yazılım öğreniyorum") belgelerde yerini ve yeterince geliştirildiğini doğrula. Fikrin ruhundan sapan yerleri ve kurucunun isteyeceği ama eksik kalan "aşırı detay" alanlarını bul.' },
]

const criticResults = await parallel(CRITICS.map(c => () => agent(`${COMMON}

ROLÜN: ${c.lens}
Varsayılan tavrın şüphecilik: övgü yazma, sorun bul. Ancak gerçek ve kanıtlanabilir sorunları yaz; her bulguda hangi belgede, hangi bölümde olduğunu belirt.

OKU (Read ile; belgeler uzunsa parçalar hâlinde, hepsini): ${BRIEF} , ${VISION} , ${KANON} ve şu dokuz belge:
${specList}

ÇIKTI: En fazla 25 bulgu, önem sırasına göre (kritik > yuksek > orta > dusuk). Her bulgu: id (${c.key}-01 gibi), severity, affected (B1..B9/KANON/VIZYON), title, detail (kanıt ve senaryo), fix (uygulanabilir düzeltme; sayı gerekiyorsa sayı ver). overall: 3-5 cümle genel değerlendirme. Türkçe. Sadece yapısal sonucu döndür.`, { label: `elestiri:${c.key}`, phase: 'Elestiri', schema: FINDINGS_SCHEMA, effort: 'high' })))

const critics = criticResults.map((r, i) => r ? { key: CRITICS[i].key, ...r } : null).filter(Boolean)
const allFindings = critics.flatMap(c => c.findings.map(f => ({ ...f, critic: c.key })))
log(`${allFindings.length} bulgu toplandı (${allFindings.filter(f => f.severity === 'kritik').length} kritik, ${allFindings.filter(f => f.severity === 'yuksek').length} yüksek); KANON v2 yazılıyor`)

// ---------------- PHASE D: REVIZYON ----------------
phase('Revizyon')
const kanonFindings = allFindings.filter(f => f.affected.includes('KANON') || f.critic === 'tutarlilik')
const kanon2 = await agent(`${COMMON}

ROLÜN: Baş tasarımcı. KANON'u v2'ye yükseltiyorsun: tüm belgelerin uyacağı tek doğru kaynak.

OKU: ${KANON} (v1), ${VISION} ve dokuz boyut belgesi (uzunsa en azından sabit içeren bölümleri):
${specList}

Boyut belgelerinin önerdiği sabitler (constants_proposed):
${JSON.stringify(dims.map(d => ({ id: d.id, constants_proposed: d.constants_proposed })), null, 1)}

Tutarlılık ve KANON ile ilgili eleştirmen bulguları:
${JSON.stringify(kanonFindings, null, 1)}

GÖREV: ${KANON} dosyasını v2 olarak TAMAMEN yeniden yaz (üzerine yaz; parça parça yazabilirsin). Her çelişkiyi tek değere bağla (gerekçeyle), eksik sabitleri ekle (ör. ipucu/Keskin Göz/Berrak Zihin kuralları, çevrimdışı gelir tavanı, Çip paket fiyatları, semt sınavı eşiği, düello süresi, sohbet ceza basamakları, OTP deneme sınırları, işletme durum adları), v1'in tüm bölümlerini koru ve genişlet; §5.1 Otopark sözleşmesi ve test tablosu değişmez. Sonuna "Değişiklik Günlüğü v1→v2" tablosu ekle (eski değer, yeni değer, gerekçe, etkilenen belgeler). Sadece yapısal sonucu döndür.`, {
  label: 'kanon-v2', phase: 'Revizyon',
  schema: { type: 'object', properties: { path: { type: 'string' }, changes: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' } }, required: ['path', 'changes', 'summary'] },
})
log(`KANON v2 hazır (${kanon2 ? kanon2.changes.length : 0} değişiklik); 9 belge revize ediliyor`)

const revised = await pipeline(dims,
  d => {
    const mine = allFindings.filter(f => f.affected.includes(d.id))
    return agent(`${COMMON}

ROLÜN: ${d.title} belgesinin revizyon editörü (aynı alanda kıdemli uzman).

OKU: ${KANON} (v2 — bağlayıcı), ${VISION} ve revize edeceğin belge: ${d.path || d.expectedPath}
KANON v2 değişiklikleri: ${JSON.stringify((kanon2 && kanon2.changes) || [])}

Bu belgeyi etkileyen eleştirmen bulguları (${mine.length} adet):
${JSON.stringify(mine, null, 1)}

GÖREV: Belgeyi revize et ve aynı yola yaz (${d.path || d.expectedPath}). Yöntem: belge büyükse (>40 KB) sıfırdan YENİDEN YAZMA; Edit ile hedefli düzeltmeler yap (bulgu başına bir veya birkaç Edit), KANON v2 ile çelişen isim/sayıları düzelt, gerekiyorsa yeni bölümler ekle. Kurallar:
- İyi olan her şeyi koru; içeriği KISALTMA. Bulguların düzeltmelerini uygula; kabul etmediğin bir bulgu varsa gerekçesiyle "Reddedilen Bulgular" bölümüne yaz.
- Belgenin sonuna "Revizyon Notları" bölümü ekle: uygulanan bulgu id'leri ve ne değişti.
Sadece yapısal sonucu döndür.`, { label: `revize:${d.id}`, phase: 'Revizyon', schema: { type: 'object', properties: { path: { type: 'string' }, applied: { type: 'array', items: { type: 'string' } }, rejected: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' } }, required: ['path', 'applied', 'rejected', 'summary'] } })
  }
)
const revisedOk = revised.filter(Boolean)
log(`${revisedOk.length}/${dims.length} belge revize edildi; eksiklik kritiği çalışıyor`)

const completeness = await agent(`${COMMON}

ROLÜN: Tamlık denetçisi (completeness critic). "Ne eksik?" sorusunu soruyorsun.

OKU: ${BRIEF} , ${VISION} , ${KANON} (v2) ve revize edilmiş dokuz belge (uzunsa başlık yapısı + örneklem):
${specList}

Kontrol listesi:
1) Kurucunun fikrindeki her öğe izlenebilir biçimde var mı ve "aşırı detaylı" mı? (eksikse nereye eklenmeli)
2) Üst düzey bir stüdyonun GDD + teknik tasarım + müfredat paketinde olup burada olmayan bölümler (ör. ses tasarımı, hikâye/lore, ilk oturum onboarding metinleri, hata/boş durum metinleri, oyuncu destek süreçleri, içerik moderasyon politikası metni, telemetri olay sözlüğü, erişilebilirlik, yerelleştirme, veri yedekleme, sürüm notları süreci, itiraz SLA'sı)
3) Kalan çelişkiler (KANON v2 ile belgeler arasında)
4) Prototip ve ekran tasarımı ekibinin ihtiyaç duyacağı ama belgelerde olmayan ayrıntılar (ekran metinleri, örnek oyuncu profili, örnek Usta diyalogları, örnek görev listesi, örnek Pazar ürünleri, örnek liderlik tablosu, otopark test çıktısı örneği)

ÇIKTI: gaps listesi (title, severity: kritik/yuksek/orta/dusuk, where_to_add: belge id veya 'YENİ', detail), verdict: 3-5 cümle. Türkçe. Sadece yapısal sonucu döndür.`, {
  label: 'tamlik-kritigi', phase: 'Revizyon', effort: 'high',
  schema: { type: 'object', properties: { gaps: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, severity: { type: 'string' }, where_to_add: { type: 'string' }, detail: { type: 'string' } }, required: ['title', 'severity', 'where_to_add', 'detail'] } }, verdict: { type: 'string' } }, required: ['gaps', 'verdict'] },
})

const importantGaps = completeness ? completeness.gaps.filter(g => g.severity === 'kritik' || g.severity === 'yuksek') : []
let patch = null
if (importantGaps.length > 0 || !completeness) {
  log(`${importantGaps.length} önemli eksik bulundu; tamamlayıcı ek belge (B10) yazılıyor`)
  patch = await agent(`${COMMON}

ROLÜN: Tamamlayıcı belge yazarı (çok yönlü kıdemli tasarımcı + teknik yazar).

OKU: ${BRIEF} , ${KANON} (v2), ${VISION} ve gerekli gördüğün boyut belgeleri:
${specList}

Tamlık denetçisinin bulduğu önemli eksikler:
${JSON.stringify(importantGaps, null, 1)}
Denetçi kararı: ${completeness ? completeness.verdict : '(denetçi sonucu alınamadı; aşağıdaki örnek veri setini her hâlükârda üret)'}

GÖREV: ${SPEC}/B10-ek-tamamlayici.md dosyasını yaz: her eksik için ayrı bir bölüm; somut, uygulanabilir, KANON v2 ile uyumlu içerik. ZORUNLU olarak şu "Prototip Örnek Veri Seti" bölümünü de içer (tam metin, kopyalanabilir): örnek oyuncu profili (ad, seviye, XP, Bayt, Çip, envanter), Çarşı 1.1 dersinin kart metinleri ve 3 Usta sorusu (rubrik + örnek iyi cevap + Kurul'un örnek puan kartı), Hasan Abi İş Emri diyaloğu (4 soru-cevap) ve Sözleşme Kartı, Savunma soru örnekleri, 10 görev (ad/koşul/ödül), 24 Pazar ürünü (ad/kategori/nadirlik/fiyat/para), 12 kişilik liderlik tablosu (Türkçe isimler), 7 Usta için 3'er replik, ekran boş/hata durum metinleri (10+), bildirim metinleri (8+), onboarding metinleri. Sadece yapısal sonucu döndür.`, { label: 'ek-tamamlayici', phase: 'Revizyon', schema: SUMMARY_SCHEMA })
}

const index = await agent(`${COMMON}

ROLÜN: Teknik yazar / belge mimarı.

OKU: ${KANON} (v2), ${VISION}, dokuz boyut belgesi${patch ? ' ve ' + patch.path : ''} (uzunsa başlık yapıları + özet bölümleri):
${specList}
${patch ? `- B10 Ek: ${patch.path}` : ''}

GÖREV: ${SPEC}/MASTER-INDEX.md dosyasını yaz:
1) Yönetici özeti (1 sayfa; kurucu okuyacak): KodKent nedir, nasıl çalışır, neden işe yarar, MVP ne zaman.
2) Belge haritası: her belge için 3 cümlelik özet + "kim okumalı".
3) Önerilen okuma sırası.
4) "Üretici kopya kâğıdı": artifact (web sayfası) yazacak ekip için hangi sabit nerede (dosya + bölüm başlığı) — en az 40 madde.
5) Kalan açık sorular (tüm belgelerden derlenmiş, tekilleştirilmiş, önem sırasıyla).
Sadece yapısal sonucu döndür.`, { label: 'master-index', phase: 'Revizyon', schema: { type: 'object', properties: { path: { type: 'string' }, executive_summary: { type: 'string' }, open_questions_top: { type: 'array', items: { type: 'string' } } }, required: ['path', 'executive_summary', 'open_questions_top'] } })

return {
  vision: VISION,
  kanon: KANON,
  kanon_changes: kanon2 ? kanon2.changes : [],
  specs: revisedOk.map(r => r.path),
  spec_summaries: dims.map(d => ({ id: d.id, title: d.title, summary: d.summary })),
  findings_total: allFindings.length,
  findings_by_severity: {
    kritik: allFindings.filter(f => f.severity === 'kritik').length,
    yuksek: allFindings.filter(f => f.severity === 'yuksek').length,
    orta: allFindings.filter(f => f.severity === 'orta').length,
    dusuk: allFindings.filter(f => f.severity === 'dusuk').length,
  },
  critic_overall: critics.map(c => ({ key: c.key, overall: c.overall })),
  completeness_verdict: completeness ? completeness.verdict : null,
  gaps: completeness ? completeness.gaps : [],
  patch: patch ? patch.path : null,
  index: index ? index.path : null,
  executive_summary: index ? index.executive_summary : null,
  open_questions_top: index ? index.open_questions_top : [],
}
