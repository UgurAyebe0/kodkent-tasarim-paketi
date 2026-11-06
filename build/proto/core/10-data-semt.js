/* ==== core/10-data-semt.js — semtler, Ustalar, modüller (P4). Kaynak: KANON §2.1, B1 §8.2–8.3, B4 §2. Saf veri; DOM yok. ==== */

const D_semtler = [
  { id: 'carsi', ad: 'Çarşı', tema: 'Tenteli dükkânlar, pazar sesleri', renk: '#F29A4A', tier: 1, usta: 'defne', acilis: { seviye: 1, sinav: null }, acilisMetni: 'Sev. 1 · baştan açık',
    konular: ['Değişkenler', 'Türler', 'Operatörler', 'Tam sayı bölmesi', 'Math', 'if/else if/else', 'switch', 'Döngüler', 'Metotlar', 'string'], moduller: ['M1'], durum: 'acik', insaatNotu: '' },
  { id: 'liman', ad: 'Liman', tema: 'Konteynerler, martı, vinç', renk: '#3F8FD0', tier: 1, usta: 'kerem', acilis: { seviye: 6, sinav: 'carsi' }, acilisMetni: 'Sev. 6 + Çarşı Sınavı',
    konular: ['Diziler', 'List<T>', 'Dictionary', 'foreach', 'Sıralama ve arama', 'string.Split', 'Hata ayıklama temelleri'], moduller: ['M2'], durum: 'kilitli', insaatNotu: "Liman: Çarşı Sınavı'ndan sonra" },
  { id: 'atolyeler', ad: 'Atölyeler', tema: 'Tuğla, kıvılcım, çekiç sesi', renk: '#D9654B', tier: 2, usta: 'nehir', acilis: { seviye: 12, sinav: 'liman' }, acilisMetni: 'Sev. 12 + Liman Sınavı',
    konular: ['Sınıf ve nesne', 'Kapsülleme', 'Kalıtım', 'interface', 'enum', 'struct ve record', 'exception', 'İngilizce adlandırma'], moduller: ['M3'], durum: 'kilitli', insaatNotu: "Atölyeler: Liman Sınavı'ndan sonra" },
  { id: 'kampus', ad: 'Kampüs', tema: 'Çimen, amfi, Lonca Binası', renk: '#5BC27A', tier: 2, usta: 'baran', acilis: { seviye: 18, sinav: 'atolyeler' }, acilisMetni: 'Sev. 18 + Atölye Sınavı',
    konular: ['Generics', 'LINQ', 'delegate ve event', 'lambda', 'extension', 'pattern matching', 'DateTime', 'Dosya ve JSON'], moduller: ['M4', 'M5'], durum: 'kilitli', insaatNotu: "Kampüs: Atölye Sınavı'ndan sonra" },
  { id: 'finans-bolgesi', ad: 'Finans Bölgesi', tema: 'Cam kuleler, gece neonu', renk: '#E05BC8', tier: 3, usta: 'elif', acilis: { seviye: 25, sinav: 'kampus' }, acilisMetni: 'Sev. 25 + Kampüs Sınavı',
    konular: ['async/await', 'Task', 'HttpClient', 'Hata dayanıklılığı', 'Unit test', 'Git temelleri'], moduller: ['M6', 'M7'], durum: 'kilitli', insaatNotu: "Finans Bölgesi: Kampüs Sınavı'ndan sonra" },
  { id: 'veri-vadisi', ad: 'Veri Vadisi', tema: 'Sunucu çiftliği, nehir', renk: '#3FC7BE', tier: 3, usta: 'selin', acilis: { seviye: 32, sinav: 'finans-bolgesi' }, acilisMetni: 'Sev. 32 + Finans Sınavı',
    konular: ['SQL temelleri', 'EF Core', 'Migration', 'Repository', 'İlişkiler', 'Transaction'], moduller: ['M8', 'M9'], durum: 'kilitli', insaatNotu: "Veri Vadisi: Finans Sınavı'ndan sonra" },
  { id: 'bulut-tepesi', ad: 'Bulut Tepesi', tema: 'Bulutların üstünde, şehir manzarası', renk: '#9DB7FF', tier: 4, usta: 'yusuf', acilis: { seviye: 40, sinav: 'veri-vadisi' }, acilisMetni: 'Sev. 40 + Veri Sınavı',
    konular: ['ASP.NET Core Web API', 'REST', 'DTO', 'DI', 'Middleware', 'Auth', 'SignalR temelleri', 'Dağıtım'], moduller: ['M10', 'M11'], durum: 'kilitli', insaatNotu: "Bulut Tepesi: Veri Sınavı'ndan sonra" }
];

/** Ustalar: kisilik cümlesi `aiPuanla` isteminde kullanılır; repliklar B1 §8.2'den AYNEN (`{ad}` oyuncunun takma adı). */
const D_ustalar = {
  defne: { ad: 'Usta Defne', semt: 'carsi', renk: '#F29A4A',
    kisilik: 'Sıcak, sabırlı, benzetmeci; kutu, etiket, tarif kartı, turnike, tabela ve megafon gibi benzetmeler kullanır. İmza cümlesi: "Değişken bir kutu; int kutunun üstündeki etiket."',
    imza: 'Değişken bir kutu; `int` kutunun üstündeki etiket.', gorunus: '30\'lu yaşlar, kıvırcık kestane saç topuz, turuncu hırka, krem gömlek; elinde tebeşir', tik: 'Tebeşir çevirir',
    repliklar: [
      "{ad}, `int yas = 17;` satırında üç şey var: kutu, etiket, içindeki şey. Kutuyu buldun, `yas`. Etiketi de söyle bana: `int` kutunun üstünde ne diyor? Sonraki kartta bu etiketin neden önemli olduğunu göreceğiz.",
      "Henüz değil; 14. satıra bak. Dakikayı 60'a böldün, güzel. Ama 61 dakika kaç saat etti? Bir. Hasan Abi'ye göre iki olmalıydı. Başlayan saati nasıl yukarı yuvarlarsın, hatırlıyor musun? Pusula'ya bakmak istersen burada.",
      "Müşteriye sormadan kod yazan, iki kere yazar, {ad}. Hasan Abi'ye en az dört soru sor; cevapları Sözleşme Kartı'na yazılacak. Benim favorim 'tam 2 saat kalan ne öder?' sorusu; cevabı seni şaşırtabilir."
    ],
    selam: "Hoş geldin {ad}. Burada her şeyi kutu, etiket ve tarif kartıyla anlatırım. Önce Meydan'daki saat panosuna bakalım mı?" },
  kerem: { ad: 'Usta Kerem', semt: 'liman', renk: '#3F8FD0',
    kisilik: 'Pratik, hızlı, kısa cümleli; liman jargonu kullanır. Önce örnek veri, sonra kural. İmza cümlesi: "Liste bir konteyner dizisi; foreach vinç."',
    imza: 'Liste bir konteyner dizisi; `foreach` vinç.', gorunus: '40\'lar, kısa kır saç, lacivert balıkçı kazağı, omuzda sarı yağmurluk', tik: 'Hesap makinesinde tuşlar',
    repliklar: [
      "{ad}, elimizde 12 konteyner var, sen tek tek sayıyorsun. Liste bir konteyner dizisi; `foreach` vinç. Vinci kur, her konteyneri bir kez kaldırsın. Sonra toplamı söyle.",
      "Sıralama doğru, arama yanlış yerde. Önce sıralayıp sonra aramak lazım; sen aradıktan sonra sıralamışsın, manifesto karışmış. Satır 9 ile 12'nin yerini değiştir, testi tekrar çalıştır.",
      "Henüz değil; `Split` virgülle ayırıyor ama plakaların arasında boşluk var. Bak: `'34 ABC 123, 06 XYZ 9'`. Virgülden sonra ne kalıyor? Boşluk. `Trim` diye bir vinç daha var; Fener'e bas, hangi satırda lazım göstereyim."
    ],
    selam: "Liman'a hoş geldin {ad}. Önce say, sonra sırala; konteynerler seni bekliyor." },
  nehir: { ad: 'Usta Nehir', semt: 'atolyeler', renk: '#D9654B',
    kisilik: 'Titiz; kodu "koklar" ve tasarım kokusu bulur. Her derste bir kötü tasarım örneği gösterip düzelttirir. İmza cümlesi: "Bu sınıf üç iş yapıyor; bir atölyede üç usta olmaz."',
    imza: 'Bu sınıf üç iş yapıyor; bir atölyede üç usta olmaz.', gorunus: '30\'lar, mavi uçlu kısa saç, alnında kaynakçı gözlüğü, deri önlük', tik: 'Havada silgiyle isim düzeltir',
    repliklar: [
      "{ad}, bu sınıf üç iş yapıyor: aracı tutuyor, ücreti hesaplıyor, bir de ekrana yazıyor. Bir atölyede üç usta olmaz. Hangi işi ayırırdın? Önce adını koy; adı doğru koyarsan sınıfı da doğru bölersin.",
      "`arac1`, `arac2`, `arac3` diye üç değişken görüyorum ve bir koku alıyorum. Üçü de aynı kalıptan: `Vehicle`. Kalıp varsa liste vardır. Bugünden sonra adlar İngilizce; `Arac` değil `Vehicle`, çünkü yarın ekibin dünyadan olacak.",
      "Kalıtım doğru kurulmuş, `Truck : Vehicle`. Eksik olan şu: `Truck`'ın `Capacity` alanı dışarıdan değiştirilebiliyor, kapsülleme delik. `private set` ile kapat, sonra testi çalıştır; `exception` kısmına yarın geliyoruz."
    ],
    selam: "{ad}, Atölyeler'e hoş geldin. Burada adlar İngilizce, işler tek tek ve titiz." },
  baran: { ad: 'Usta Baran', semt: 'kampus', renk: '#5BC27A',
    kisilik: 'Meraklı, en Sokratik, esprili; cevap vermez, üç soru sorar. Her şeyi tabloyla anlatır. İmza cümlesi: "Sorguyu bana sormadan önce veriye sor."',
    imza: 'Sorguyu bana sormadan önce veriye sor.', gorunus: '20\'lerin sonu, yuvarlak gözlük, yeşil kazak, kol altında tablet', tik: 'Tablet döner, tablo çıkar',
    repliklar: [
      "{ad}, sorguyu bana sormadan önce veriye sor. Elinde 40 kitap var; geciken kaçı? Say. Peki hangi koşulla saydın? İşte o koşul senin `Where`'in. Üçüncü soru: sıraya koymak istersen hangi alana göre?",
      "Tablo yapalım: sol sütun kitap, sağ sütun gecikme günü. Şimdi 'gecikme günü > 0' satırlarını işaretle. Kaç satır kaldı? Kodun da tam olarak bunu yapacak; `Where(k => k.GecikmeGunu > 0)`. Lambda, tablodaki işaretleme kuralıdır.",
      "Henüz değil; `OrderBy` ile sıraladın ama sonucu bir yere koymadın. LINQ tembeldir, sen istemeden çalışmaz. `ToList()` nerede? Taslak'ta eksik satırı bıraktım, istersen bak; istemezsen önce 30 saniye düşün, bence bulursun."
    ],
    selam: "Selam {ad}. Sorguyu bana sormadan önce veriye sor; ben de sana üç soru sorarım." },
  elif: { ad: 'Usta Elif', semt: 'finans-bolgesi', renk: '#E05BC8',
    kisilik: 'Disiplinli, "önce test"; her göreve kırmızı testle başlatır, kanıt ister, süre ölçer. İmza cümlesi: "Çalıştı demek yetmez; kanıtı nerede?"',
    imza: 'Çalıştı demek yetmez; kanıtı nerede?', gorunus: '30\'lar, sıkı at kuyruğu, koyu blazer, boynunda kronometre', tik: 'Kronometre tutar, durdurur',
    repliklar: [
      "{ad}, çalıştı demek yetmez; kanıtı nerede? Önce test yazacağız, kırmızı görecek, sonra kodu yazıp yeşile çevireceğiz. Kronometre bende: ilk kırmızı testini 2 dakikada istiyorum.",
      "`await` koydun ama metodun adı hâlâ `Hesapla`. Asenkron metodun adı `HesaplaAsync` biter; bu bir sözleşme, okuyan kişi bekleyeceğini bilir. Düzelt, sonra `Task` dönüşünü kontrol et; testin ikinci satırı o yüzden kırmızı.",
      "İstek başarısız oldu diye uygulaman çöktü. Banka müşterisi bunu görmemeli. Üç deneme, aralarında bekleme; buna dayanıklılık diyoruz. Fener'de hangi satırı sarmalayacağını gösterdim. Kanıt olarak bana kırmızıdan yeşile dönen bir test getir."
    ],
    selam: "{ad}, Finans Bölgesi'ne hoş geldin. Çalıştı demek yetmez; kanıtın nerede?" },
  selin: { ad: 'Usta Selin', semt: 'veri-vadisi', renk: '#3FC7BE',
    kisilik: 'Düzenli, şemacı; önce tablo çizdirir sonra kod yazdırır. İmza cümlesi: "Veri yalan söylemez; şema söyler."',
    imza: 'Veri yalan söylemez; şema söyler.', gorunus: '40\'lar, kulak arkasında kalem, kareli gömlek, kolunda rulo şema kâğıdı', tik: 'Kalemi kulak arkasından alıp şemaya çizer',
    repliklar: [
      "{ad}, kodu kapat, kâğıdı aç. Hasta ile randevu arasındaki ilişki ne? Bir hastanın kaç randevusu olabilir? Çok. Bir randevunun kaç hastası? Bir. İşte şeman: 1 — n. Şemayı çizmeden tablo yaratan, iki kez migration yazar.",
      "Migration'ı yazdın, güzel; eksik olan geri alma yolu. `Down` metodu boş. Yarın bu kolonu kaldırmak istersen ne olacak? Veri yalan söylemez; şema söyler. `Down`'ı doldur, sonra `Update-Database`.",
      "Henüz değil; iki kaydı ayrı ayrı yazıyorsun, biri geçerse biri kalıyorsa otelde oda var ama misafir yok. İkisini tek transaction'a al: ya ikisi ya hiçbiri. Değirmeni hatırla: çark tam dönmezse un çıkmaz."
    ],
    selam: "Hoş geldin {ad}. Kodu kapat, kâğıdı aç: önce şemayı çizelim." },
  yusuf: { ad: 'Usta Yusuf', semt: 'bulut-tepesi', renk: '#9DB7FF',
    kisilik: 'Sistemci, büyük resim; her dersi şehir haritasından başlatır, dağıtımı tören gibi anlatır. İmza cümlesi: "Şehirdeki her dükkân konuşabilmeli; API bu."',
    imza: 'Şehirdeki her dükkân konuşabilmeli; API bu.', gorunus: '50\'ler, kısa beyaz sakal, gri rüzgârlık, boynunda dürbün', tik: 'Dürbünle ufka bakar',
    repliklar: [
      "{ad}, dürbünü al. Şu aşağıdaki Yemek Sipariş Platformu'ndan bir sipariş çıkıyor; nereye gidiyor? Hangi kapıdan giriyor? Şehirdeki her dükkân konuşabilmeli; API bu. Bugün ilk kapıyı açıyoruz: `GET /siparisler`.",
      "Controller'ın veritabanına doğrudan gidiyor. Çalışır ama yarın veritabanı değişirse kapı da yıkılır. Araya bir servis koy, DI ile ver; kapı bekçisi kimin geldiğine değil, ne istediğine baksın. Sonraki adım: `Program.cs`'te kaydı.",
      "Dağıtım bir törendir, {ad}. Testler yeşil, DTO'lar temiz, auth kapıda. Dağıtım Kulesi'ne çık, düğmeye bas; ışık demeti şehre inince senin API'n herkesin kapısında çalıyor olacak. Bunu Sev. 1'de tramvaydan inen çocuğa anlatmak isterdim."
    ],
    selam: "{ad}, Bulut Tepesi'ne hoş geldin. Dürbünü al; şehrin tamamı buradan görünüyor." },
  hasan: { ad: 'Hasan Abi', rol: 'Otopark müşterisi', renk: '#C9A25B', semt: 'carsi',
    kisilik: 'Kısa, kesin, sıcak esnaf ağzı; kurucunun otopark kurallarını birebir söyler.',
    gorunus: '50\'ler, bıyık, kasket, yelek, elinde kareli defter, kalem kulakta',
    repliklar: [
      "İş emri bu evladım. Aklına takılan olursa sor.",
      "Başlayan saat tam sayılır; 2 saatten az kaldı: 200.",
      "Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle."
    ],
    selam: "Gel evladım. Otoparkın bir ücret sistemine ihtiyacı var; önce anlatayım, sonra sen sorarsın." },
  mufettis: { ad: 'Müfettiş', rol: 'Gizli testleri çalıştıran ve Hata Bildirimi getiren NPC', renk: '#8F9AAE',
    kisilik: 'Neredeyse hiç konuşmaz; resmî tek cümleyle konuşur.', gorunus: 'Uzun boylu, bej trençkot, fötr şapka, elinde renkli dosya',
    repliklar: [
      "Dosya bıraktım.",
      "Müşteri 1.440 dakika için 500 TL ödemiş.",
      "Bir müşteri: \"24 saat civarı kalanlar için fazla ücret ödedim.\""
    ],
    selam: "Dosya bıraktım." },
  kurul: { ad: 'Kurul', rol: 'Rubrik tabanlı puanlayıcı (mühürlü kart)', renk: '#3A4C9E',
    kisilik: 'Kişiliksiz, rubrik tabanlı, adil; bedeni yoktur, yalnızca mühürlü kart metni konuşur.', gorunus: 'Lacivert kart, altın mühür, kriter çubukları',
    repliklar: [
      "Kurul değerlendiriyor…",
      "Kurul pazarlık etmez, ama Usta yardım eder. Pusula'ya bakmak ister misin?",
      "Kurul kandırılmaz. Cevabın içinde Kurul'a talimat veren bir cümle buldum. Bu deneme 0 puan; hakkın yanmadı, kendi cümlelerinle yeniden dene."
    ],
    selam: "Rubrik cevap kutusunun üstünde. Doğruluk 50, Tamlık 30, Açıklık 20." }
};

/** Dersleri `modul.sıra` kimliklerine açar: D_aralik('1', 12) → ['1.1', …, '1.12']. */
function D_aralik(modulNo, adet) {
  const o = [];
  for (let i = 1; i <= adet; i++) o.push(modulNo + '.' + i);
  return o;
}

/** 11 modül, 100 ders (B4 §2). `tierAraligi` B4 modül haritasındaki Tier sütunudur. */
const D_moduller = [
  { id: 'M1', ad: 'Merhaba KodKent: Temeller', semt: 'carsi', tierAraligi: 'T1', dersler: D_aralik('1', 12) },
  { id: 'M2', ad: 'Konteynerler: Koleksiyonlar ve Metin', semt: 'liman', tierAraligi: 'T1–T2', dersler: D_aralik('2', 12) },
  { id: 'M3', ad: 'Atölye: Tür Güvenliği ve Nesneler', semt: 'atolyeler', tierAraligi: 'T2', dersler: D_aralik('3', 14) },
  { id: 'M4', ad: "Kampüs I: LINQ'e Giden Yol", semt: 'kampus', tierAraligi: 'T2–T3', dersler: D_aralik('4', 8) },
  { id: 'M5', ad: 'Kampüs II: Genel Tipler, Olay, Dosya', semt: 'kampus', tierAraligi: 'T2–T3', dersler: D_aralik('5', 8) },
  { id: 'M6', ad: 'Finans I: Asenkron ve Ağ', semt: 'finans-bolgesi', tierAraligi: 'T3', dersler: D_aralik('6', 8) },
  { id: 'M7', ad: 'Finans II: Test, Kalıp, Git', semt: 'finans-bolgesi', tierAraligi: 'T3', dersler: D_aralik('7', 8) },
  { id: 'M8', ad: 'Veri Vadisi I: SQL ve EF Core', semt: 'veri-vadisi', tierAraligi: 'T3', dersler: D_aralik('8', 7) },
  { id: 'M9', ad: 'Veri Vadisi II: İlişkiler ve Güvenli Veri', semt: 'veri-vadisi', tierAraligi: 'T4', dersler: D_aralik('9', 7) },
  { id: 'M10', ad: 'Bulut Tepesi I: Minimal API ve REST', semt: 'bulut-tepesi', tierAraligi: 'T4', dersler: D_aralik('10', 8) },
  { id: 'M11', ad: 'Bulut Tepesi II: DI, Güvenlik, Gerçek Zamanlı', semt: 'bulut-tepesi', tierAraligi: 'T4', dersler: D_aralik('11', 8) }
];
