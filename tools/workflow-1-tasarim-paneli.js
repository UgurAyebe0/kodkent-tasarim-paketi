export const meta = {
  name: 'kodkent-tasarim-paneli',
  description: 'KodKent oyun tasarimini 3 vizyon + juri + sentez, 9 boyutta derinlestirme, 5 elestirmen ve revizyon turuyla gelistirir',
  phases: [
    { title: 'Vizyon', detail: '3 bagimsiz vizyon, 2 juri, sentez ve kanon v1' },
    { title: 'Derinlestirme', detail: '9 boyutta paralel ayrintili spec' },
    { title: 'Elestiri', detail: '5 elestirmen: tutarlilik, teknik, pedagoji, ekonomi, sadakat' },
    { title: 'Revizyon', detail: 'Kanon v2, spec duzeltmeleri, eksiklik kritigi, indeks' },
  ],
}

const SP = 'C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi'
const BRIEF = `${SP}/brief/00-fikir.md`
const SPEC = `${SP}/spec`

const COMMON = `Sen "KodKent" adlı oyunlaştırılmış C# öğrenme platformunu tasarlayan çok-ajanlı bir stüdyo ekibinin üyesisin.
ÖNCE şu dosyayı Read aracıyla tamamen oku: ${BRIEF} (kurucunun fikri, SABİT kararlar, yön).
Kurallar:
- Tüm çıktıları TÜRKÇE yaz (teknik terimler İngilizce kalabilir). Somut ol: sayılar, tablolar, isimler, örnekler, formüller. Genel geçer tavsiye ve dolgu cümle yazma.
- Kurucunun fikrindeki her öğeyi koru ve geliştir; SABİT kararlara aykırı öneri yapma (ürün adı KodKent, Bayt/Çip/XP, .NET backend, Claude API, gerçek sandbox, pay-to-learn yok).
- Soru sorma; karar ver ve varsayımları belgenin sonundaki "Varsayımlar" ve "Açık Sorular" bölümlerine yaz.
- Dosyaları Write aracıyla UTF-8 Markdown olarak, tam olarak verilen yola yaz. Başlıklar (##), tablolar ve gerektiğinde kod blokları kullan.
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

// ---------------- PHASE 1: VIZYON ----------------
phase('Vizyon')
log('3 bağımsız vizyon yazılıyor (oyun, eğitim, ürün bakış açıları)')

const VISIONS = [
  { key: 'oyun', lens: 'Kıdemli F2P sosyal oyun tasarımcısı (Sanalika, Habbo, Club Penguin, Hay Day tarzı ürünlerde çalışmış). Önceliğin: eğlence, çekirdek döngünün bağımlılık yapıcı ritmi, sosyal gösteriş, ilerleme hissi, retention. Öğrenmeyi oyunun içine gömmenin yollarını bul.' },
  { key: 'egitim', lens: 'Öğrenme bilimci ve kıdemli yazılım eğitmeni (mastery learning, bilişsel yük teorisi, geri bildirim döngüleri, Bloom taksonomisi; Duolingo/Exercism/CS50 deneyimi). Önceliğin: kullanıcının GERÇEKTEN C# öğrenmesi, bilgi transferi, kalıcılık, hile direnci, adil ve açıklanabilir AI puanlaması.' },
  { key: 'urun', lens: 'Startup CTO / ürün lideri. Önceliğin: 3 ayda yayına çıkabilir bir MVP, AI ve sandbox maliyetlerinin kontrolü, ölçeklenebilirlik, teknik risklerin erken azaltılması, ilk 1000 kullanıcıya ulaşma. Hayalperest değil ama vizyonu küçültmeyen bir yol haritası.' },
]

const visionResults = await parallel(VISIONS.map(v => () => agent(`${COMMON}

ROLÜN: ${v.lens}

GÖREV: KodKent için eksiksiz bir VİZYON BELGESİ yaz (3000-4500 kelime). Diğer iki vizyon yazarından bağımsız çalış; kendi bakış açını sonuna kadar savun ama kurucunun fikrine sadık kal.
Belge başlıkları (hepsi zorunlu):
1. Tek cümlelik vaat ve 3 cümlelik ürün tanımı
2. Oyuncu fantezisi ("Ben bu oyunda kimim, ne inşa ediyorum?")
3. Çekirdek döngü: adım adım, her adımın süresi, ödülü ve bir sonrakine nasıl bağlandığı (Öğren → Uygula → İnşa et → Kazan → Harca → Göster)
4. İlk 30 dakika: dakika dakika onboarding (telefon/OTP → dil seçimi (sadece C# açık) → avatar → şehre giriş → ilk ders → ilk AI sorusu ve puanı → ilk görev → ilk Bayt → otoparkı görme/alma yolu)
5. Dünya iskeleti: semtler (6-8 adet; her semtin C# konu kümesi), Akademi, oyuncu işletmeleri, ev/oda, meydan; Sanalika hissini veren öğeler
6. İlerleme iskeleti: XP/seviye/unvan, kilit mantığı (ders → işletme → semt), seviye tavanı önerisi
7. Öğrenme ↔ oyun bağı: bir dersin bir işletme kodunu nasıl hazırladığı; otopark örneğinin yolculuğu (hangi derslerden sonra alınır, ücret hesaplama kodu nasıl isteniyor, para nasıl akıyor)
8. Ekonomi iskeleti: Bayt kaynakları/giderleri, Çip'in rolü, kozmetik felsefesi
9. Sosyal katman: ziyaret, sohbet, lonca, liderlik, düello
10. Yapay zeka öğretmen ("Usta" NPC'ler): rolü, sınırları, kişiliği, puanlama ilkesi
11. 10 tasarım ilkesi (her biri 1-2 cümle, somut)
12. En büyük 5 risk ve karşı önlem
13. MVP kapsamı taslağı (kesinlikle içinde / kesinlikle dışında)
14. Varsayımlar ve Açık Sorular

Dosyayı şu yola yaz: ${SPEC}/A-vizyon-${v.key}.md`, {
  label: `vizyon:${v.key}`, phase: 'Vizyon',
  schema: { type: 'object', properties: { path: { type: 'string' }, one_line_promise: { type: 'string' }, core_loop: { type: 'string' }, key_decisions: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' } }, required: ['path', 'one_line_promise', 'core_loop', 'key_decisions', 'summary'] },
})))

const visions = visionResults.filter(Boolean)
log(`${visions.length}/3 vizyon tamamlandı; 2 jüri puanlıyor`)

const JUDGE_SCHEMA = {
  type: 'object',
  properties: {
    scores: { type: 'array', items: { type: 'object', properties: { candidate: { type: 'string' }, eglence: { type: 'number' }, ogrenme: { type: 'number' }, fizibilite: { type: 'number' }, ozgunluk: { type: 'number' }, sadakat: { type: 'number' }, butunluk: { type: 'number' }, total: { type: 'number' }, notes: { type: 'string' } }, required: ['candidate', 'total', 'notes'] } },
    winner: { type: 'string' },
    graft_ideas: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, idea: { type: 'string' }, why: { type: 'string' } }, required: ['from', 'idea'] } },
    conflicts_to_resolve: { type: 'array', items: { type: 'string' } },
  },
  required: ['scores', 'winner', 'graft_ideas', 'conflicts_to_resolve'],
}

const judgeLenses = [
  'Sen bağımsız bir oyun yayıncısı değerlendirme kurulusun (publisher greenlight komitesi). Ticari başarı ve oyuncu deneyimi gözüyle değerlendir.',
  'Sen bir eğitim teknolojileri yatırımcısı ve eski bilgisayar bilimi öğretmenisin. Öğrenme etkisi, ölçülebilir sonuç ve uygulanabilirlik gözüyle değerlendir.',
]
const judgeResults = await parallel(judgeLenses.map((lens, i) => () => agent(`${COMMON}

ROLÜN: ${lens}

GÖREV: Şu üç vizyon belgesini Read ile tamamen oku ve puanla:
${visions.map(v => `- ${v.path}`).join('\n')}

Her belgeyi 1-10 arası şu ölçütlerle puanla: eglence, ogrenme (gerçek öğrenme etkisi), fizibilite (3-6 ayda yapılabilirlik ve maliyet), ozgunluk, sadakat (kurucunun fikrine ve SABİT kararlara sadakat), butunluk (iç tutarlılık). total = toplam.
Bir kazanan seç. Sonra kaybeden belgelerden kazanana AŞILANMASI gereken en iyi 6-10 somut fikri (graft_ideas) listele; her birinin neden değerli olduğunu yaz.
Belgeler arasında çelişen kararları (ör. seviye tavanı, semt sayısı, ekonomi akışı) conflicts_to_resolve listesine yaz.
Türkçe yaz. Sadece yapısal sonucu döndür.`, { label: `juri:${i + 1}`, phase: 'Vizyon', schema: JUDGE_SCHEMA })))

const judges = judgeResults.filter(Boolean)
log(`Jüri tamamlandı; sentez ve KANON v1 yazılıyor`)

const synth = await agent(`${COMMON}

ROLÜN: Baş tasarımcı (creative director). Üç vizyonu tek, tutarlı ve güçlü bir vizyona dönüştürüyorsun.

GİRDİLER:
Vizyon belgeleri (Read ile hepsini oku):
${visions.map(v => `- ${v.path}`).join('\n')}
Jüri sonuçları (JSON):
${JSON.stringify(judges, null, 1)}

GÖREV 1 — ${SPEC}/A-vizyon-FINAL.md dosyasını yaz (4000-6000 kelime). Kazanan vizyonu omurga al, jürinin aşı fikirlerini (graft_ideas) somut olarak işle, çelişkileri (conflicts_to_resolve) tek tek KARARA bağla ve gerekçesini yaz. Vizyon belgesinin 14 başlığını koru (vaat, fantezi, çekirdek döngü, ilk 30 dakika, dünya, ilerleme, öğrenme-oyun bağı, ekonomi, sosyal, AI Usta, 10 ilke, 5 risk, MVP, varsayımlar) ve "Jüri Kararları" adında bir bölüm ekle.

GÖREV 2 — ${SPEC}/KANON.md dosyasını yaz (v1). Bu, sonraki tüm ajanların ve belge yazarlarının UYMAK ZORUNDA olduğu sabitler sayfasıdır. İçeriği tablolar halinde, kesin değerlerle:
- Ürün adı (KodKent), slogan, para birimleri (Bayt, Çip), XP; kısaltma/ikon kuralları
- Semt listesi (6-8): semt adı, teması, C# konu kümesi, açılış seviyesi, Usta NPC adı ve 1 cümle kişiliği
- Akademi'nin adı ve yapısı; meydanın adı; oyuncu evinin adı
- Unvan bantları (seviye aralığı → unvan), seviye tavanı, XP eğrisi formülü (ör. XP(L)=…); ilk 10 seviyenin XP tablosu
- Başlangıç bakiyesi (Bayt), ilk ders XP'si, ortalama ders XP'si, bir AI sorusunun XP aralığı (puan→XP eşlemesi)
- İşletme kataloğu (16-20 satır): işletme adı, semt, açılış seviyesi, fiyat (Bayt), Tier sayısı, Tier 1'in öğrettiği konu. Otopark ilk işletme olmalı ve kurucunun ücret kuralları Tier 1 "müşteri isteği" olarak aynen yer almalı.
- Ekran listesi (isimleri sabitlenir; 18-24 ekran)
- Çekirdek döngü adımlarının resmi adları
- Soru tipleri adları (4), görev tiplerinin adları, kozmetik nadirlik kademeleri adları
- Sözlük (20+ terim)
- "Sürüm: v1" ve "Değişiklik Günlüğü" bölümü

Sadece yapısal sonucu döndür.`, {
  label: 'sentez+kanon', phase: 'Vizyon',
  schema: { type: 'object', properties: { vision_path: { type: 'string' }, kanon_path: { type: 'string' }, summary: { type: 'string' }, decisions: { type: 'array', items: { type: 'string' } } }, required: ['vision_path', 'kanon_path', 'summary', 'decisions'] },
})

const VISION = (synth && synth.vision_path) || `${SPEC}/A-vizyon-FINAL.md`
const KANON = (synth && synth.kanon_path) || `${SPEC}/KANON.md`

// ---------------- PHASE 2: DERINLESTIRME ----------------
phase('Derinlestirme')
log('9 boyutta derinleştirme başlıyor')

const READ_FIRST = `ÖNCE şu üç dosyayı Read ile tamamen oku ve onlara sadık kal: ${BRIEF} , ${VISION} , ${KANON} . KANON'daki isim ve sayılar bağlayıcıdır; değiştirmek istediğin bir sabit varsa constants_proposed içinde öner ama belgende KANON değerini kullan.`

const DIMS = [
  { id: 'B1', slug: 'dunya-sehir', title: 'Dünya & Şehir Tasarımı', role: 'Kıdemli dünya/seviye tasarımcısı ve sanat yönetmeni (izometrik sosyal oyunlar)', spec: `
- İzometrik şehir haritası: grid boyutu, tile boyutu (2:1 izometrik, 64x32 px önerisi), semtlerin konumu; metin/ASCII şehir krokisi.
- Her semt için: tema, görsel motifler, renk vurgusu, bina listesi (Akademi şubesi, oyuncu işletme arsaları, NPC dükkânları), açılış seviyesi, ambiyans sesleri.
- Akademi: iç mekân düzeni, sınıf/atölye odaları, Usta'nın yeri.
- Oyuncu evi/odası: başlangıç odası, mobilya sistemi, ziyaret, oda kapasitesi.
- İşletme arsaları: bir oyuncunun otoparkı KURULUM ÖNCESİ (inşaat bandı, "Kodla!" tabelası) ve SONRASI (araçlar giriyor, tabela, Tier yükseltmelerinde görsel değişim) nasıl görünür; 4 Tier için görsel kademe.
- Avatar sistemi: vücut tipleri, saç, yüz, kıyafet slotları (baş, üst, alt, ayak, aksesuar, sırt, evcil hayvan), emote listesi (12+), unvan rozetleri.
- Usta NPC'ler: her semt için ad, görünüş, kişilik, konuşma tarzı, 3 örnek replik, öğretim tarzı.
- Gece/gündüz ve mevsim; dünya etkinlikleri; navigasyon (yürüme, hızlı seyahat, harita); oda/instance modeli (Sanalika benzeri: oda başına kapasite, kalabalık yönetimi).
- Sanalika hissi kontrol listesi: hangi öğeler bu hissi veriyor, hangileri öğrenme için uyarlandı.` },
  { id: 'B2', slug: 'ilerleme-ekonomi', title: 'İlerleme & Ekonomi', role: 'Oyun ekonomisti ve sistem tasarımcısı (F2P ekonomi dengeleme)', spec: `
- XP eğrisi: formül + seviye 1-60 (en az) tablosu: seviye, gereken XP, kümülatif XP, tahmini süre (saat), açılan içerik.
- Unvan bantları; seviye atlama ödülleri.
- XP kaynakları ve miktarları (AI soru puanı→XP eşlemesi, ders bitirme, görev, işletme Tier geçişi, düello, akran incelemesi); günlük XP tavanı/azalan getiri kuralları.
- Bayt muslukları (işletme pasif geliri, görevler, etkinlikler, ilk-kez bonusları) ve giderleri (işletme satın alma, Tier yükseltme ücreti, kozmetik, mobilya, ipucu, isim değiştirme vb.) — miktarlarla.
- İşletme ekonomisi tablosu: her işletme için fiyat, Tier başına saatlik gelir, çevrimdışı gelir tavanı (saat), geri ödeme süresi.
- Pasif gelir formülü (kod ile): temel gelir × Tier çarpanı × çevrimiçi bonusu × lonca bonusu; toplama/"hasat" mekaniği.
- Kozmetik fiyatlandırma: nadirlik kademeleri (KANON adları), Bayt vs Çip fiyat aralıkları; Çip paketleri (TL fiyatları) ve dönüşüm ilkesi (Bayt satın alınamaz).
- Enflasyon kontrolü: giderler, Belediye vergisi/işletme bakım gideri, sezonluk sıfırlamalar, sınırlı seri kozmetikler.
- 30 günlük örnek oyuncu simülasyonu (günlük 30-40 dk oynayan "normal", 10 dk "hafif", 90 dk "yoğun"): gün gün seviye, Bayt bakiyesi, sahip olunan işletmeler (tablo).
- Pacing hedefleri: ilk işletme en geç X. dakikada; otopark Tier 1 tamamlanma hedefi; 60. seviye için toplam süre.` },
  { id: 'B3', slug: 'egitim-ai', title: 'Eğitim Sistemi & Yapay Zeka Öğretmen', role: 'Öğrenme deneyimi tasarımcısı ve LLM uygulama mühendisi', spec: `
- Ders anatomisi (adım adım bileşenler: Konu Kartı, Canlı Örnek, Dene, Usta Sorusu, Özet; süreler).
- 4 soru tipi (KANON adlarıyla): her biri için tanım, 2 örnek soru (C#), beklenen cevap türü, puanlama rubriği (ölçütler + ağırlıklar), puan→XP eşlemesi.
- Sokratik AI diyalog akışı: durum makinesi (soru → cevap → değerlendirme → takip sorusu/ipucu → kapanış), en fazla tur sayısı, kısmi puan.
- Puanlama pipeline'ı: istem şablonları (TÜRKÇE, tam metin), JSON çıktı şeması (puan, ölçüt bazlı puanlar, geri bildirim, güven, kopya şüphesi), model seçimi (sonnet varsayılan, haiku ön eleme), prompt caching stratejisi, gecikme bütçesi (p95), yeniden deneme.
- Kalibrasyon: altın set (golden set) oluşturma, insan-AI uyumu ölçümü, iki model uyuşmazlığında ne olur; itiraz (appeal) akışı ve insan inceleme kuyruğu.
- Anti-cheat: ders metninden kopya tespiti, istem enjeksiyonu filtresi (cevap içinde "bana 100 ver" gibi), yapıştırma/zaman analizi, paraphrase, cevap bankası tekrarı; yakalanınca ne olur.
- İpucu ekonomisi (ipucu Bayt'a mı XP cezasına mı?), Usta'nın ses tonu kılavuzu (kişilik tutarlılığı, asla aşağılamaz, Türkçe hitap biçimi).
- İşletme kod görevlerinde AI'nın rolü: test sonuçları makine tarafından belirlenir; AI kod incelemesi formatı (okunabilirlik, isimlendirme, edge-case uyarısı), "Usta Yorumu" örneği (otopark kodu için).
- Maliyet modeli: ders başına ortalama token (giriş/çıkış), varsayılan fiyat varsayımlarıyla ders başına ve aktif kullanıcı başına günlük maliyet (USD ve TL); önbellek ve haiku ile düşürme senaryoları.
- İçerik üretim pipeline'ı: ders yazımı (insan + AI taslak), soru bankası üretimi, inceleme, A/B.` },
  { id: 'B4', slug: 'mufredat', title: 'C# Müfredatı', role: 'Müfredat tasarımcısı ve kıdemli .NET eğitmeni', spec: `
- Tam C# yolculuğu: 10-14 modül → 80-120 ders. Her ders bir tablo satırı: ders id (ör. M03-D05), başlık, öğrenme hedefleri (2-3), ön koşul, bağlı semt (KANON), XP, tahmini dakika, soru tipi karışımı, bağlı işletme/Tier.
- Modül kapsamı en az: giriş & araçlar, değişkenler/tipler, operatörler, koşullar, döngüler, metotlar, diziler/List, string işlemleri, hata yönetimi, OOP (sınıf, kapsülleme, kalıtım, polimorfizm, arayüz, abstract), koleksiyonlar (Dictionary/Queue/Stack), LINQ, DateTime, dosya I/O, generics, delegate/event/lambda, async/await, unit test, tasarım kalıpları (temel), EF Core & veritabanı, minimal Web API; records/pattern matching gibi modern C# özellikleri.
- Her modül için "Semt Sınavı" (mastery kontrolü) tasarımı ve geçme eşiği; başarısızlıkta ne olur.
- Aralıklı tekrar: "Tekrar Görevleri" nasıl seçilir (algoritma), günlük 3 tekrar sorusu.
- Kavram → işletme eşlemesi tablosu (hangi kavram hangi işletme Tier'inde ilk kez gerekiyor).
- Otopark yolculuğu: Tier 1'den önce bitirilmesi gereken dersler listesi ve neden.
- Zorluk eğrisi grafiği için veri (modül bazında ortalama dakika/XP).` },
  { id: 'B5', slug: 'isletmeler-kod', title: 'İşletmeler & Kod Projeleri Kataloğu', role: 'Kıdemli C# geliştirici ve programlama görevleri (challenge) tasarımcısı', spec: `
- Platformun genel "Challenge Spec" formatını tanımla: JSON şeması (id, isletme, tier, baslik, musteri_istegi, net_spec, imza/template kodu, public_tests, hidden_tests, edge_cases, ipucu_merdiveni, rubrik, odul). Test harness yaklaşımını seç ve gerekçelendir: önerilen yaklaşım, oyuncunun sabit imzalı bir static metot/sınıf yazması ve harness'ın bunu çağırması (xUnit benzeri); stdin/stdout alternatifinin artı/eksileri.
- İşletme kataloğu (KANON'daki 16-20 işletme): her biri için semt, açılış seviyesi, fiyat, Tier başına saatlik gelir, "müşteri hikâyesi", 3-4 Tier başlığı ve her Tier'in öğrettiği kavram.
- OTOPARK TAM AYRINTILI (4 Tier). Tier 1 kurucunun kuralları: "2 saatten az: saati 100 TL; 2-6 saat: her saat 40 TL; 6-24 saat: günlük 250 TL". Bunu "müşteri isteği" olarak aynen yaz; sonra "Gereksinim Netleştirme" bölümünde belirsizlikleri karara bağla (dakikaların başlanan saate yukarı yuvarlanması, tam 2 ve tam 6 saat sınırlarının hangi kademeye girdiği, 24 saati aşan kalışlar: her başlanan gün 250 TL + kalan süre için tekrar kademe mi?, 0 dakika, negatif/geçersiz girdi → exception). Fiyat sıçramasını (1 saat 59 dk = 200 TL ama 2 saat = 80 TL) açıkça göster ve bunu "gerçek dünyada gereksinimler böyle gelir" öğretim anı yap; isteğe bağlı Tier 1.5 "müşteri kuralı düzeltti" varyantı öner.
  - Metot imzası: public static decimal UcretHesapla(DateTime giris, DateTime cikis) ve/veya UcretHesapla(int dakika). Template kodu ver.
  - Public testler (6+) ve gizli testler (6+): giriş, beklenen çıktı, neyi test ettiği — tablo.
  - Referans çözüm: tam C# kodu.
  - DOĞRULAMA ZORUNLU: ${SP}/dotnet-check/otopark klasöründe Bash ile "dotnet new console --force -o <klasör>" çalıştır, Program.cs'yi referans çözüm + tüm test vakalarını çalıştıran bir ana programla değiştir, "dotnet run" ile çalıştır, gerçek çıktıyı belgeye "Gerçek Çalıştırma Çıktısı" bölümü olarak yapıştır. Beklenen değerlerle uyuşmazlık varsa beklenenleri değil mantığı düzelt ve tekrar çalıştır. dotnet ilk çalıştırmada yavaş olabilir; bekle.
  - Tier 2 (abonelik/aylık kart, List<T>), Tier 3 (plaka doğrulama + kat/yer yönetimi, string + 2B dizi + Dictionary), Tier 4 (günlük gelir raporu + en yoğun saat, LINQ): her biri için müşteri isteği, net spec, imza, 4+ public test, 3+ gizli test, ipucu merdiveni, referans çözüm özeti.
- Diğer 3 işletme için (Market, Kafe, Taksi gibi KANON'dakiler) Tier 1 tam spec (müşteri isteği, net spec, imza, 4 test, ipuçları); kalan işletmeler için Tier başlıkları + 2 örnek test.
- Yaygın hatalar ve AI "Usta Yorumu" örnekleri; ipucu merdiveni kuralları (3 kademe; maliyet KANON/B2 ile uyumlu olmalı — varsayım yaz).` },
  { id: 'B6', slug: 'gorevler-sosyal-liveops', title: 'Görevler, Sosyal Katman & Canlı Operasyon', role: 'Live-ops ve sosyal sistemler tasarımcısı (MMO/sosyal oyun)', spec: `
- Görev tipleri (KANON adları): günlük, haftalık, hikâye (semt hikâyesi), işletme, sosyal; her tip için üretim kuralı ve ödül aralığı.
- 40+ somut görev: ad, tip, koşul, ödül (XP/Bayt/kozmetik parçası), hangi seviyede açılır. Otopark ve ilk hafta görevleri özellikle ayrıntılı.
- Günlük seri (streak) sistemi, geri kazanma, hafta sonu bonusu.
- Etkinlikler: haftalık "Hackathon Cumartesi", aylık sezon, bayram etkinlikleri; sezon ödül yolu (battle pass benzeri ama kozmetik).
- Loncalar ("Yazılım Ekibi" KANON adı neyse onu kullan): kurma şartı, kapasite, lonca binası, lonca görevleri, lonca bonusu, lonca sohbeti.
- Arkadaşlık, ziyaret, hediye; sohbet sistemi ve moderasyon (haiku ile gerçek zamanlı sınıflandırma, kelime filtresi, raporlama, ceza basamakları, 13-17 yaş koruması, KVKK'ya uygun log saklama).
- Liderlik tabloları (haftalık XP, işletme geliri, düello ELO, lonca); sıfırlama ve ödüller; hile tespiti.
- Kod Düellosu: kurallar, eşleştirme (ELO ± seviye), süre, puanlama, kopya önlemi, ödüller, izleyici modu.
- Akran kod incelemesi: nasıl eşleşir, inceleme formu, XP; mentorluk programı.
- Bildirim/push stratejisi (günlük hatırlatma, gelir hasat zamanı, görev sıfırlama), spam sınırları.
- Retention tasarımı: D1, D7, D30 için somut kancalar; geri dönen oyuncu akışı.` },
  { id: 'B7', slug: 'backend-mimari', title: 'Backend Mimari & Veri Modeli', role: 'Baş yazılım mimarı (.NET, dağıtık sistemler, güvenlik)', spec: `
- Mimari karar: modüler monolit vs mikroservis — öneri ve gerekçe (MVP için modüler monolit + ayrı sandbox worker'ları önerilir; kendi kararını ver).
- Modüller/servisler ve sorumlulukları: Auth(OTP), Oyuncu/Profil, İlerleme(XP), Eğitim(ders, AI diyalog), Challenge(kod görevleri, test), Ekonomi(cüzdan, çift kayıtlı defter), Dünya(şehir, odalar, işletmeler), Sosyal, Mağaza/Envanter, Görev, Bildirim, İçerik CMS, Analitik, Moderasyon.
- Veri modeli: 35+ tablo; her tablo için kolonlar (ad, tip, kısıt), anahtarlar, ilişkiler; PostgreSQL DDL olarak en kritik 12 tablonun CREATE TABLE'ı.
- API tasarımı: REST uç noktaları (grup grup, 40+), 20 kritik uç nokta için istek/yanıt JSON örneği; hata formatı; sürümleme; rate limit.
- Gerçek zamanlı: SignalR hub'ları (WorldHub, ChatHub, DuelHub), olaylar, oda/grup modeli, ölçekleme (Redis backplane), presence.
- Asenkron işler: kuyruklar (code-run, ai-grade, income-tick, notification), idempotency, retry, dead-letter.
- Sandbox mimarisi: container imajı (.NET SDK/runtime), Roslyn ile derleme, kaynak limitleri (CPU, bellek, süre, süreç sayısı), ağ yok, salt-okunur FS, seccomp/gVisor, test runner protokolü (harness ↔ oyuncu kodu), sonuç şeması, kuyruk + worker havuzu, otomatik ölçekleme, kötüye kullanım senaryoları ve savunmalar; C# ile worker iskelet kodu.
- AI servisi: istem yönetimi (sürümleme), structured output, prompt caching, maliyet takibi, kota, model yedekleme; C# istemci örneği (Anthropic API çağrısı).
- Auth: telefon OTP (Türkiye sağlayıcıları: Netgsm, İleti Merkezi; global: Twilio Verify), akış, deneme sınırları, cihaz bağlama, JWT + refresh, KVKK açık rıza, 13-17 veli onayı akışı.
- Ekonomi defteri: çift kayıtlı ledger tasarımı, işlem türleri, denetim; örnek C# transaction kodu.
- Anti-cheat ve güvenlik: OWASP, sandbox kaçışı, istem enjeksiyonu, bot kayıt (OTP maliyeti!), hız limitleri.
- KVKK/GDPR: veri envanteri, saklama süreleri, silme/dışa aktarma, aydınlatma metni başlıkları, loglama.
- Altyapı: Kubernetes (Hetzner/Azure karşılaştırması), ortamlar, CI/CD (GitHub Actions), gözlemlenebilirlik (OpenTelemetry, metrik listesi, alarm eşikleri), yedekleme, maliyet tahmini (1k, 10k, 100k DAU).
- Monorepo klasör yapısı (ağaç) ve çözüm (solution) projeleri.` },
  { id: 'B8', slug: 'istemci-ui', title: 'İstemci, Oyun Motoru & Ekran Tasarımları', role: 'Kıdemli frontend/oyun istemcisi mühendisi ve UX tasarımcısı', spec: `
- Teknoloji: React + TypeScript, PixiJS (izometrik dünya), Monaco Editor (C#), SignalR istemcisi, durum yönetimi, PWA; alternatiflerin (Unity WebGL, Phaser, Godot) kısa karşılaştırması.
- Render: tilemap, sprite atlas, z-sıralama, A* yol bulma, kamera, performans bütçeleri (FPS, bellek, ilk yük boyutu), düşük cihaz modu.
- Asset pipeline ve görsel stil kılavuzu: 2:1 izometrik, 64x32 tile, avatar boyutları, palet (İznik çinisi esinli: turkuaz, kobalt, mercan, amber, nane), tipografi (Fredoka başlık, Nunito gövde, JetBrains Mono kod), ikonografi.
- Ekran envanteri (KANON'daki ekran listesi; 20+): her ekran için amaç, yerleşim (bölgeler: üst HUD, sol panel, sahne, sağ panel...), bileşenler, durumlar (yükleniyor/boş/hata), ana etkileşimler, gereken veri (API). Özellikle: Kayıt/OTP, Dil Seçimi, Avatar Oluşturma, Şehir Haritası (HUD ile), Akademi Dersi (Konu Kartı + Usta sohbeti + cevap kutusu + puan paneli), Görev Panosu, İşletme Detayı (otopark; kurulum bekliyor → kodla), Kod Atölyesi (görev metni + editör + testler + konsol + ipucu + Usta Yorumu), Gelir/Hasat, Mağaza, Avatar/Profil, Liderlik, Lonca, Düello, Ayarlar.
- HUD spec: seviye halkası, XP barı, Bayt/Çip sayaçları, görev ikonu, bildirim, sohbet; mobilde düzen.
- Navigasyon haritası (ekranlar arası geçişler) ve derin bağlantılar.
- Mikro etkileşim ve animasyon listesi: XP kazanımı, seviye atlama, test geçti/kaldı, Bayt hasadı, kozmetik giyme; süre/easing önerileri; reduced-motion davranışı.
- Bileşen kütüphanesi listesi (Button, Card, Modal, Toast, ProgressRing, CodeEditor, TestList, ChatBubble...).
- Erişilebilirlik ve yerelleştirme (TR öncelikli, i18n hazırlığı).
- Mobil uyarlama: dokunmatik kontroller, dikey mod, kod yazımı için mobil klavye yardımcıları (snippet çubuğu).` },
  { id: 'B9', slug: 'urun-yol-haritasi', title: 'Ürün Stratejisi, MVP & Yol Haritası', role: 'Ürün yöneticisi ve kurucu ortak (edtech + oyun)', spec: `
- Rakip analizi tablosu (8+: Sanalika, Duolingo, Codecademy, CodeCombat, Codewars, Exercism, Screeps, Mimo, Sololearn, Habbo): ne yapıyor, zayıf yanı, KodKent'in aldığı/ayrıştığı nokta.
- Konumlandırma cümlesi ve 3 persona (ad, yaş, hedef, engel, KodKent'te ilk haftası).
- MVP kapsamı: açıkça İÇİNDE / DIŞINDA listeleri; MVP başarı kriterleri (sayısal).
- Yol haritası: MVP (0-3 ay), v1 (4-6 ay), v2 (7-12 ay); her faz için epik listesi, bağımlılıklar, teslimler; sprint planı (2 haftalık, ilk 6 sprint ayrıntılı).
- Ekip: roller, kişi sayısı, faz bazında.
- Bütçe: aylık maliyet (TL ve USD): maaş, altyapı, AI, SMS, araçlar; 12 aylık toplam; varsayımları yaz.
- Birim ekonomi: AI maliyeti/DAU, SMS maliyeti/kayıt, ARPU/ARPPU hedefleri, dönüşüm oranı varsayımları, başabaş analizi.
- KPI ve analitik olaylar: 30+ olay adı ve parametreleri; D1/D7/D30, ders tamamlama, ilk işletme süresi, challenge geçme oranı, AI itiraz oranı.
- Risk kaydı (15+): olasılık, etki, önlem, sahibi.
- Pazara giriş: okullar/öğretmenler, YouTube/TikTok içerik, Discord topluluğu, üniversite kulüpleri, referans programı.
- Hukuki/uyum: KVKK, yaş ve veli onayı, uygulama mağazası politikaları, sanal para birimi, telif.
- Gelecek: Python/JavaScript dilleri eklenince mimariye etkisi (dil-agnostik challenge spec).` },
]

const dimResults = await parallel(DIMS.map(d => () => agent(`${COMMON}

ROLÜN: ${d.role}
${READ_FIRST}

GÖREV: "${d.title}" belgesini yaz (5000-9000 kelime; tablolar sayılmaz, cömert ol). Dosya yolu: ${SPEC}/${d.id}-${d.slug}.md
Zorunlu içerik:${d.spec}
- Sonda: "Varsayımlar", "Açık Sorular" ve "Diğer Belgelere Bağımlılıklar" (hangi başka boyutla uyumlu olmalı).
- Belge id'in ${d.id}. Başka belgelere atıf yaparken id ile yap (ör. "bkz. B2").

Sadece yapısal özeti döndür (path, summary, constants_proposed, open_questions).`, { label: `${d.id}:${d.slug}`, phase: 'Derinlestirme', schema: SUMMARY_SCHEMA })))

const dims = dimResults.map((r, i) => r ? { ...r, id: DIMS[i].id, title: DIMS[i].title, expectedPath: `${SPEC}/${DIMS[i].id}-${DIMS[i].slug}.md` } : null).filter(Boolean)
log(`${dims.length}/9 boyut belgesi tamamlandı; 5 eleştirmen devrede`)

// ---------------- PHASE 3: ELESTIRI ----------------
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
  { key: 'tutarlilik', lens: 'Tutarlılık denetçisi. Belgeler arası çelişkileri bul: aynı sabitin farklı değerleri (seviye, fiyat, XP, gelir), farklı isimler (semt, NPC, ekran, para), birbirini bozan akışlar, KANON ile uyumsuzluk. Her bulguda iki belgeden alıntı/değer ver.' },
  { key: 'teknik', lens: 'Kıdemli güvenlik ve altyapı mühendisi (adversarial). Sandbox kaçışı, AI maliyet patlaması, OTP/SMS kötüye kullanımı, SignalR ölçekleme, veri modeli hataları, KVKK ihlali riskleri, gerçekçi olmayan gecikme/maliyet varsayımları. Her bulgu için somut saldırı/arıza senaryosu ve düzeltme.' },
  { key: 'pedagoji', lens: 'Öğrenme bilimi denetçisi. Gerçekten öğretiyor mu? Zorluk eğrisinde sıçramalar, ön koşul boşlukları (bir challenge henüz öğretilmemiş kavram istiyor mu?), AI puanlamanın adaleti/açıklanabilirliği, hile ile öğrenmeden ilerleme yolları, bilişsel yük, geri bildirim kalitesi. Müfredat (B4) ile işletmeler (B5) ve eğitim sistemi (B3) arasındaki eşlemeyi satır satır kontrol et.' },
  { key: 'ekonomi', lens: 'Oyun ekonomisi ve retention denetçisi (adversarial). Grind duvarları, enflasyon, pay-to-win sızıntıları, ilk 30 dakikada boşluklar, ödül döngüsünde ölü noktalar, pasif gelirin öğrenmeyi gereksizleştirmesi, 30 günlük simülasyondaki tutarsızlıklar. Sayılarla hesapla.' },
  { key: 'sadakat', lens: 'Kurucu temsilcisi. Kurucunun fikrindeki HER öğenin (telefon kaydı, dil seçimi sadece C#, Sanalika tarzı dünya, eğitim içinde AI soru-cevap ve puanlama, XP/level, işletme satın alma, otopark ücret kuralları birebir, kodla para kazanma, para ile kozmetik, "oyunlarla yazılım öğreniyorum") belgelerde yerini ve yeterince geliştirildiğini doğrula. Fikrin ruhundan sapan yerleri ve kurucunun isteyeceği ama eksik kalan "aşırı detay" alanlarını bul.' },
]

const criticResults = await parallel(CRITICS.map(c => () => agent(`${COMMON}

ROLÜN: ${c.lens}
Varsayılan tavrın şüphecilik: övgü yazma, sorun bul. Ancak gerçek ve kanıtlanabilir sorunları yaz; her bulguda hangi belgede, hangi bölümde olduğunu belirt.

OKU (Read ile tamamen): ${BRIEF} , ${VISION} , ${KANON} ve şu dokuz belge:
${specList}

ÇIKTI: En fazla 25 bulgu, önem sırasına göre (kritik > yuksek > orta > dusuk). Her bulgu: id (${c.key}-01 gibi), severity, affected (B1..B9/KANON/VIZYON), title, detail (kanıt ve senaryo), fix (uygulanabilir düzeltme; sayı gerekiyorsa sayı ver). overall: 3-5 cümle genel değerlendirme. Türkçe. Sadece yapısal sonucu döndür.`, { label: `elestiri:${c.key}`, phase: 'Elestiri', schema: FINDINGS_SCHEMA, effort: 'high' })))

const critics = criticResults.map((r, i) => r ? { key: CRITICS[i].key, ...r } : null).filter(Boolean)
const allFindings = critics.flatMap(c => c.findings.map(f => ({ ...f, critic: c.key })))
log(`${allFindings.length} bulgu toplandı (${allFindings.filter(f => f.severity === 'kritik').length} kritik, ${allFindings.filter(f => f.severity === 'yuksek').length} yüksek); KANON v2 yazılıyor`)

// ---------------- PHASE 4: REVIZYON ----------------
phase('Revizyon')
const kanonFindings = allFindings.filter(f => f.affected.includes('KANON') || f.critic === 'tutarlilik')
const kanon2 = await agent(`${COMMON}

ROLÜN: Baş tasarımcı. KANON'u v2'ye yükseltiyorsun: tüm belgelerin uyacağı tek doğru kaynak.

OKU: ${KANON} (v1), ${VISION} ve dokuz boyut belgesi:
${specList}

Boyut belgelerinin önerdiği sabitler (constants_proposed):
${JSON.stringify(dims.map(d => ({ id: d.id, constants_proposed: d.constants_proposed })), null, 1)}

Tutarlılık ve KANON ile ilgili eleştirmen bulguları:
${JSON.stringify(kanonFindings, null, 1)}

GÖREV: ${KANON} dosyasını v2 olarak TAMAMEN yeniden yaz (üzerine yaz). Her çelişkiyi tek değere bağla (gerekçeyle), eksik sabitleri ekle (ör. ipucu maliyeti, çevrimdışı gelir tavanı, günlük XP tavanı, Çip paket fiyatları, semt sınavı eşiği, düello süresi, sohbet ceza basamakları, OTP deneme sınırları), v1'in tüm bölümlerini koru ve genişlet. Sonuna "Değişiklik Günlüğü v1→v2" tablosu ekle (eski değer, yeni değer, gerekçe, etkilenen belgeler). Sadece yapısal sonucu döndür.`, {
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

GÖREV: Belgeyi TAMAMEN yeniden yaz ve aynı yola üzerine yaz (${d.path || d.expectedPath}). Kurallar:
- İyi olan her şeyi koru; içeriği KISALTMA (gerekirse uzat). Bulguların düzeltmelerini uygula; kabul etmediğin bir bulgu varsa gerekçesiyle "Reddedilen Bulgular" bölümüne yaz.
- Tüm isim ve sayıları KANON v2 ile hizala.
- Belgenin sonuna "Revizyon Notları" bölümü ekle: uygulanan bulgu id'leri ve ne değişti.
Sadece yapısal sonucu döndür.`, { label: `revize:${d.id}`, phase: 'Revizyon', schema: { type: 'object', properties: { path: { type: 'string' }, applied: { type: 'array', items: { type: 'string' } }, rejected: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' } }, required: ['path', 'applied', 'rejected', 'summary'] } })
  }
)
const revisedOk = revised.filter(Boolean)
log(`${revisedOk.length}/${dims.length} belge revize edildi; eksiklik kritiği çalışıyor`)

const completeness = await agent(`${COMMON}

ROLÜN: Tamlık denetçisi (completeness critic). "Ne eksik?" sorusunu soruyorsun.

OKU: ${BRIEF} , ${VISION} , ${KANON} (v2) ve revize edilmiş dokuz belge:
${specList}

Kontrol listesi:
1) Kurucunun fikrindeki her öğe izlenebilir biçimde var mı ve "aşırı detaylı" mı? (eksikse nereye eklenmeli)
2) Üst düzey bir stüdyonun GDD + teknik tasarım + müfredat paketinde olup burada olmayan bölümler (ör. ses tasarımı, hikâye/lore, ilk oturum onboarding metinleri, hata/boş durum metinleri, oyuncu destek süreçleri, içerik moderasyon politikası metni, telemetri olay sözlüğü, erişilebilirlik, yerelleştirme, veri yedekleme, sürüm notları süreci, oyuncu şikâyet/itiraz SLA'sı)
3) Kalan çelişkiler (KANON v2 ile belgeler arasında)
4) Prototip ekranlarını yapacak bir ekibin ihtiyaç duyacağı ama belgelerde olmayan ayrıntılar (ekran metinleri, örnek veriler, örnek Usta diyalogları, örnek test çıktıları)

ÇIKTI: gaps listesi (title, severity: kritik/yuksek/orta/dusuk, where_to_add: belge id veya 'YENİ', detail), verdict: 3-5 cümle. Türkçe. Sadece yapısal sonucu döndür.`, {
  label: 'tamlik-kritigi', phase: 'Revizyon', effort: 'high',
  schema: { type: 'object', properties: { gaps: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, severity: { type: 'string' }, where_to_add: { type: 'string' }, detail: { type: 'string' } }, required: ['title', 'severity', 'where_to_add', 'detail'] } }, verdict: { type: 'string' } }, required: ['gaps', 'verdict'] },
})

const importantGaps = completeness ? completeness.gaps.filter(g => g.severity === 'kritik' || g.severity === 'yuksek') : []
let patch = null
if (importantGaps.length > 0) {
  log(`${importantGaps.length} önemli eksik bulundu; tamamlayıcı ek belge yazılıyor`)
  patch = await agent(`${COMMON}

ROLÜN: Tamamlayıcı belge yazarı (çok yönlü kıdemli tasarımcı + teknik yazar).

OKU: ${BRIEF} , ${KANON} (v2), ${VISION} ve gerekli gördüğün boyut belgeleri:
${specList}

Tamlık denetçisinin bulduğu önemli eksikler:
${JSON.stringify(importantGaps, null, 1)}
Denetçi kararı: ${completeness.verdict}

GÖREV: ${SPEC}/B10-ek-tamamlayici.md dosyasını yaz: her eksik için ayrı bir bölüm; somut, uygulanabilir, KANON v2 ile uyumlu içerik (metinler, tablolar, örnek diyaloglar, örnek veriler dahil). Özellikle prototip ekranları için gereken örnek veriler (örnek oyuncu profili, örnek ders içeriği ve Usta diyaloğu, örnek görev listesi, örnek mağaza ürünleri, örnek liderlik tablosu, otopark test çıktısı örneği) tam metin olarak yer alsın. Sadece yapısal sonucu döndür.`, { label: 'ek-tamamlayici', phase: 'Revizyon', schema: SUMMARY_SCHEMA })
}

const index = await agent(`${COMMON}

ROLÜN: Teknik yazar / belge mimarı.

OKU: ${KANON} (v2), ${VISION}, dokuz boyut belgesi${patch ? ' ve ' + patch.path : ''}:
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