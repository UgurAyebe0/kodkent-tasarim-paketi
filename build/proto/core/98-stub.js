/* ==== core/98-stub.js — GEÇİCİ çekirdek taslağı (P0). P4'ün core/99-export.js'i gelince birleştirici bu dosyayı atlar. ====
   Minimal ama şekil olarak TAM DATA (brief/04 §3) + basit çevrimdışı puanlayıcı/sezgiselTest/gorevTestEt. Gerçek içerik P4'ündür. */
const KK_CORE = (function () {
  const S =(id, tip, metin, kod, anahtarlar, iyi, zayif, xpTaban) => ({
    id, tip, metin, ...(kod ? { kod } : {}),
    rubrik: [{ ad: 'Doğruluk', agirlik: 50 }, { ad: 'Tamlık', agirlik: 30 }, { ad: 'Açıklık', agirlik: 20 }],
    anahtarlar, ornekIyiCevap: iyi, zayifCevap: zayif, xpTaban: xpTaban || 30
  });
  const K = (primm, baslik, metin, kod) => ({ primm, baslik, metin, ...(kod ? { kod } : {}) });

  const semtler = [
    { id: 'carsi', ad: 'Çarşı', tema: 'Tenteli dükkânlar, pazar sesleri', renk: '#F29A4A', tier: 1, usta: 'defne', acilis: { seviye: 1, sinav: null }, konular: ['Değişkenler', 'Türler', 'Operatörler', 'Tam sayı bölmesi', 'Math', 'if/else if/else', 'switch', 'Döngüler', 'Metotlar', 'string'], durum: 'acik', insaatNotu: '' },
    { id: 'liman', ad: 'Liman', tema: 'Konteynerler, martı, vinç', renk: '#3F8FD0', tier: 1, usta: 'kerem', acilis: { seviye: 6, sinav: 'carsi' }, konular: ['Diziler', 'List<T>', 'Dictionary', 'foreach', 'Sıralama ve arama', 'string.Split'], durum: 'kilitli', insaatNotu: "Liman: Çarşı Sınavı'ndan sonra" },
    { id: 'atolyeler', ad: 'Atölyeler', tema: 'Tuğla, kıvılcım, çekiç sesi', renk: '#D9654B', tier: 2, usta: 'nehir', acilis: { seviye: 12, sinav: 'liman' }, konular: ['Sınıf ve nesne', 'Kapsülleme', 'Kalıtım', 'interface', 'enum', 'exception'], durum: 'kilitli', insaatNotu: "Atölyeler: Liman Sınavı'ndan sonra" },
    { id: 'kampus', ad: 'Kampüs', tema: 'Çimen, amfi, Lonca Binası', renk: '#5BC27A', tier: 2, usta: 'baran', acilis: { seviye: 18, sinav: 'atolyeler' }, konular: ['Generics', 'LINQ', 'delegate ve event', 'lambda', 'DateTime', 'JSON'], durum: 'kilitli', insaatNotu: "Kampüs: Atölye Sınavı'ndan sonra" },
    { id: 'finans-bolgesi', ad: 'Finans Bölgesi', tema: 'Cam kuleler, gece neonu', renk: '#E05BC8', tier: 3, usta: 'elif', acilis: { seviye: 25, sinav: 'kampus' }, konular: ['async/await', 'Task', 'HttpClient', 'Unit test', 'Git'], durum: 'kilitli', insaatNotu: "Finans Bölgesi: Kampüs Sınavı'ndan sonra" },
    { id: 'veri-vadisi', ad: 'Veri Vadisi', tema: 'Sunucu çiftliği, nehir', renk: '#3FC7BE', tier: 3, usta: 'selin', acilis: { seviye: 32, sinav: 'finans-bolgesi' }, konular: ['SQL', 'EF Core', 'Migration', 'Repository', 'Transaction'], durum: 'kilitli', insaatNotu: "Veri Vadisi: Finans Sınavı'ndan sonra" },
    { id: 'bulut-tepesi', ad: 'Bulut Tepesi', tema: 'Bulutların üstünde, şehir manzarası', renk: '#9DB7FF', tier: 4, usta: 'yusuf', acilis: { seviye: 40, sinav: 'veri-vadisi' }, konular: ['ASP.NET Core Web API', 'REST', 'DTO', 'DI', 'Middleware', 'SignalR'], durum: 'kilitli', insaatNotu: "Bulut Tepesi: Veri Sınavı'ndan sonra" }
  ];
  const U = (ad, semt, kisilik, renk, repliklar, selam) => ({ ad, semt, kisilik, renk, repliklar, selam });
  const ustalar = {
    defne: U('Usta Defne', 'carsi', 'Sıcak, sabırlı, benzetmeci', '#F29A4A', [
      "{ad}, `int yas = 17;` satırında üç şey var: kutu, etiket, içindeki şey. Kutuyu buldun, `yas`. Etiketi de söyle bana: `int` kutunun üstünde ne diyor?",
      "Henüz değil; 14. satıra bak. Dakikayı 60'a böldün, güzel. Ama 61 dakika kaç saat etti? Bir. Hasan Abi'ye göre iki olmalıydı. Başlayan saati nasıl yukarı yuvarlarsın?",
      "Müşteriye sormadan kod yazan, iki kere yazar, {ad}. Hasan Abi'ye en az dört soru sor; cevapları Sözleşme Kartı'na yazılacak."], "Hoş geldin {ad}! Değişken bir kutu; `int` kutunun üstündeki etiket. Haydi ilk kutunu kuralım."),
    kerem: U('Usta Kerem', 'liman', 'Pratik, hızlı, liman jargonu', '#3F8FD0', [
      "{ad}, elimizde 12 konteyner var, sen tek tek sayıyorsun. Liste bir konteyner dizisi; `foreach` vinç.",
      "Sıralama doğru, arama yanlış yerde. Önce sıralayıp sonra aramak lazım; satır 9 ile 12'nin yerini değiştir.",
      "Henüz değil; `Split` virgülle ayırıyor ama plakaların arasında boşluk var. `Trim` diye bir vinç daha var."], 'Önce say, sonra sırala, {ad}.'),
    nehir: U('Usta Nehir', 'atolyeler', 'Titiz, tasarım kokusu bulur', '#D9654B', [
      "{ad}, bu sınıf üç iş yapıyor: aracı tutuyor, ücreti hesaplıyor, bir de ekrana yazıyor. Bir atölyede üç usta olmaz.",
      "`arac1`, `arac2`, `arac3` diye üç değişken görüyorum ve bir koku alıyorum. Kalıp varsa liste vardır.",
      "Kalıtım doğru kurulmuş, `Truck : Vehicle`. Eksik olan şu: `Capacity` alanı dışarıdan değiştirilebiliyor."], 'Adı doğru koyarsan sınıfı da doğru bölersin.'),
    baran: U('Usta Baran', 'kampus', 'Meraklı, en Sokratik, esprili', '#5BC27A', [
      "{ad}, sorguyu bana sormadan önce veriye sor. Elinde 40 kitap var; geciken kaçı? Say.",
      "Tablo yapalım: sol sütun kitap, sağ sütun gecikme günü. Şimdi 'gecikme günü > 0' satırlarını işaretle.",
      "Henüz değil; `OrderBy` ile sıraladın ama sonucu bir yere koymadın. LINQ tembeldir. `ToList()` nerede?"], 'Üç sorum var, {ad}.'),
    elif: U('Usta Elif', 'finans-bolgesi', 'Disiplinli, önce test', '#E05BC8', [
      "{ad}, çalıştı demek yetmez; kanıtı nerede? Önce test yazacağız, kırmızı görecek, sonra yeşile çevireceğiz.",
      "`await` koydun ama metodun adı hâlâ `Hesapla`. Asenkron metodun adı `HesaplaAsync` biter.",
      "İstek başarısız oldu diye uygulaman çöktü. Üç deneme, aralarında bekleme; buna dayanıklılık diyoruz."], 'Kronometre bende, {ad}.'),
    selin: U('Usta Selin', 'veri-vadisi', 'Düzenli, şemacı', '#3FC7BE', [
      "{ad}, kodu kapat, kâğıdı aç. Hasta ile randevu arasındaki ilişki ne? Bir hastanın kaç randevusu olabilir?",
      "Migration'ı yazdın, güzel; eksik olan geri alma yolu. `Down` metodu boş.",
      "Henüz değil; iki kaydı ayrı ayrı yazıyorsun. İkisini tek transaction'a al: ya ikisi ya hiçbiri."], 'Veri yalan söylemez; şema söyler.'),
    yusuf: U('Usta Yusuf', 'bulut-tepesi', 'Sistemci, büyük resim', '#9DB7FF', [
      "{ad}, dürbünü al. Şu aşağıdaki Yemek Sipariş Platformu'ndan bir sipariş çıkıyor; nereye gidiyor?",
      "Controller'ın veritabanına doğrudan gidiyor. Araya bir servis koy, DI ile ver.",
      "Dağıtım bir törendir, {ad}. Testler yeşil, DTO'lar temiz, auth kapıda."], 'Şehirdeki her dükkân konuşabilmeli; API bu.'),
    hasan: { ad: 'Hasan Abi', rol: 'Otopark müşterisi' },
    mufettis: { ad: 'Müfettiş' },
    kurul: { ad: 'Kurul' }
  };
  const moduller = [
    { id: 'M1', ad: 'Çarşı: Kutular, Sayılar ve Kararlar', semt: 'carsi', dersler: ['1.1', '1.2', '1.3', '1.4'] },
    { id: 'M2', ad: 'Liman: Koleksiyonlar', semt: 'liman', dersler: ['2.1'] }
  ];
  const dersler = [
    { id: '1.1', modul: 'M1', baslik: 'Değişken Bir Kutudur', semt: 'carsi', tier: 1, xp: 100, dk: 10, durum: 'acik', gorev: 'meydan-saati',
      hedefler: ['Console.WriteLine ile çıktı vermek', 'Değişkeni kutu + etiket + değer olarak okumak', 'int, string, bool türlerini ayırmak'],
      kartlar: [K('Tahmin et', 'Bu kod ne yazar?', 'Aşağıdaki satır ekrana ne yazdırır? Önce kendin tahmin et, sonra Çalıştır\'a bas.', 'Console.WriteLine("Merhaba KodKent!");'),
        K('Çalıştır', 'Değişken bir kutudur', '`int yas = 17;` satırında üç şey var: kutunun adı (yas), kutunun üstündeki etiket (int) ve içindeki değer (17). Etiket, kutuya ne konabileceğini söyler.', 'int yas = 17;\nConsole.WriteLine(yas);'),
        K('İncele', 'Türler farklı kutulardır', '`int` tam sayı, `string` metin, `bool` doğru/yanlış tutar. Tırnak içindeki her şey metindir: "17" bir sayı değil, iki karakterlik bir metindir.', 'string ad = "Deniz";\nint yas = 17;\nbool ogrenci = true;'),
        K('Değiştir', 'Değeri değiştir', 'Kutunun içindeki değeri sonradan değiştirebilirsin; etiket (tür) aynı kalır. `yas` değerini 18 yap ve sonucu izle.', 'int yas = 17;\nyas = 18;\nConsole.WriteLine(yas);'),
        K('Yap', 'Kendi kutunu kur', 'Adını bir string değişkene koy ve ekrana yazdır.')],
      ornekKod: 'string ad = "Deniz";\nint yas = 17;\nConsole.WriteLine(ad + " " + yas);',
      dene: { baslangic: 'string ad = "";\nConsole.WriteLine(ad);', hedefCikti: 'Deniz', cozum: 'string ad = "Deniz";\nConsole.WriteLine(ad);' },
      sorular: [
        S('1.1-s1', 'Kavram Sorusu', '`int yas = 17;` satırını kutu benzetmesiyle açıkla: kutunun adı, etiketi ve içindeki değer hangisi?', null, ['kutu', 'etiket', 'int', 'tür', 'değer', '17', 'yas'], 'Kutunun adı yas, üstündeki etiket int yani kutuya yalnızca tam sayı konabilir, içindeki değer de 17. Değişken, değer saklayan adlı bir kutudur.', 'Bir şey saklıyor galiba.'),
        S('1.1-s2', 'Çıktı Tahmini', 'Bu kod ekrana ne yazar ve neden?', 'string s = "Kod" + "Kent";\nConsole.WriteLine(s);', ['KodKent', 'birleştir', '+', 'string', 'metin'], 'Ekrana KodKent yazar; + işareti iki metni (string) birleştirir, araya boşluk koymaz.', 'Bilmiyorum, kod yazıyor.'),
        S('1.1-s3', 'Hata Avı', 'Bu satırda bir hata var. Hatayı bul ve nasıl düzelteceğini yaz.', 'int yas = "17";', ['tırnak', 'string', 'int', 'tür', 'metin', 'uyuşm'], '"17" tırnaklı olduğu için metin (string); int kutusuna metin konamaz. Ya tırnakları kaldırıp int yas = 17; yazmalı ya da türü string yapmalıyım.', 'Hata yok gibi.')] },
    { id: '1.2', modul: 'M1', baslik: 'Sayılarla İşlemler ve Tam Sayı Bölmesi', semt: 'carsi', tier: 1, xp: 100, dk: 12, durum: 'acik', gorev: 'dakikadan-saate',
      hedefler: ['+, -, *, /, % işleçlerini kullanmak', 'Tam sayı bölmesinin kesirli kısmı attığını bilmek', 'Dakikadan saat ve kalan dakika çıkarmak'],
      kartlar: [K('Tahmin et', '7 bölü 2 kaç eder?', 'int a = 7, b = 2; için a / b ekrana ne yazar? 3,5 mi, 3 mü?', 'int a = 7;\nint b = 2;\nConsole.WriteLine(a / b);'),
        K('Çalıştır', 'Bölme ve kalan', 'İki tam sayıyı bölersen sonuç da tam sayıdır: kesirli kısım atılır. Kalanı % işleci verir: 7 % 2 = 1.', 'Console.WriteLine(125 / 60);\nConsole.WriteLine(125 % 60);'),
        K('İncele', 'Başlayan saat', '61 dakika kaç saat başlatır? 61 / 60 = 1 diyor ama 2. saate girmiş olursun. Yukarı yuvarlamak için (dakika + 59) / 60 kullanılır.', 'int saat = (61 + 59) / 60;\nConsole.WriteLine(saat);'),
        K('Yap', 'Dakikayı saate çevir', '125 dakikayı "2 saat 5 dakika" biçiminde yazdır.')],
      ornekKod: 'int toplam = 125;\nConsole.WriteLine(toplam / 60 + " saat " + toplam % 60 + " dakika");',
      dene: { baslangic: 'int toplam = 125;\nConsole.WriteLine(toplam);', hedefCikti: '2 saat 5 dakika', cozum: 'int toplam = 125;\nConsole.WriteLine(toplam / 60 + " saat " + toplam % 60 + " dakika");' },
      sorular: [
        S('1.2-s1', 'Kavram Sorusu', '`7 / 2` neden 3 verir? Ondalıklı sonuç almak için ne yapabilirsin?', null, ['tam sayı', 'int', 'kesir', 'atılır', '3', 'double', '2.0'], 'İki int bölününce sonuç da int olur ve kesirli kısım atılır, bu yüzden 3 çıkar. Ondalık için sayılardan birini 2.0 gibi double yaparım.', 'Bilgisayar yanlış hesaplıyor.'),
        S('1.2-s2', 'Çıktı Tahmini', 'Bu kod ekrana ne yazar?', 'int a = 17;\nConsole.WriteLine(a % 5);', ['2', 'kalan', 'mod', '%', 'bölüm'], '2 yazar: 17 içinde 5 üç kez var (15), geriye 2 kalır; % işleci bölmeden kalanı verir.', '3 yazar.'),
        S('1.2-s3', 'Hata Avı', 'Bu satır derlenmez. Neden?', 'int saat = 125 / 60.0;', ['double', 'int', 'ondalık', 'dönüştür', 'cast', 'atanamaz'], '125 / 60.0 ondalıklı (double) bir sonuç verir; int kutusuna atanamaz. (int) ile dönüştürmeli ya da 60 yazmalıyım.', 'Sayı çok büyük.')] },
    { id: '1.3', modul: 'M1', baslik: 'Karar Ver: if / else if / else', semt: 'carsi', tier: 1, xp: 100, dk: 12, durum: 'acik', gorev: 'kademeli-karar',
      hedefler: ['Koşul yazmak', 'else if zincirinde sıranın önemini görmek', '= ile == farkını bilmek'],
      kartlar: [K('Tahmin et', 'Hangi dal çalışır?', 'saat 3 iken aşağıdaki kod ne yazar?', 'int saat = 3;\nif (saat < 2) Console.WriteLine("kısa");\nelse if (saat <= 6) Console.WriteLine("orta");\nelse Console.WriteLine("uzun");'),
        K('İncele', 'Sıra önemlidir', 'Koşullar yukarıdan aşağı sırayla bakılır; ilk doğru olan çalışır, gerisine bakılmaz.'),
        K('Yap', 'Kademeli tarife', 'Saate göre "kısa", "orta" ya da "uzun" yazdır.')],
      ornekKod: 'int saat = 3;\nif (saat < 2) Console.WriteLine("kısa");\nelse if (saat <= 6) Console.WriteLine("orta");\nelse Console.WriteLine("uzun");',
      dene: { baslangic: 'int saat = 3;\n// kısa / orta / uzun yazdır', hedefCikti: 'orta', cozum: 'int saat = 3;\nif (saat < 2) Console.WriteLine("kısa");\nelse if (saat <= 6) Console.WriteLine("orta");\nelse Console.WriteLine("uzun");' },
      sorular: [
        S('1.3-s1', 'Kavram Sorusu', 'else if zincirinde koşullara hangi sırayla bakılır ve sıra neden önemlidir?', null, ['sıra', 'yukarıdan', 'ilk', 'doğru', 'çalışır', 'gerisi', 'else'], 'Koşullara yukarıdan aşağıya bakılır, ilk doğru olan dal çalışır ve gerisine bakılmaz. Sıra yanlışsa geniş bir koşul dar olanı gölgeler.', 'If çalışıyor.'),
        S('1.3-s2', 'Çıktı Tahmini', 'saat = 3 iken ekrana ne yazar?', 'if (saat < 2) Console.WriteLine("kısa");\nelse if (saat <= 6) Console.WriteLine("orta");\nelse Console.WriteLine("uzun");', ['orta', '3', '<=', 'ikinci', 'dal'], 'orta yazar: 3 < 2 yanlış, sonra 3 <= 6 doğru olduğu için ikinci dal çalışır.', 'kısa'),
        S('1.3-s3', 'Hata Avı', 'Bu koşulun neresi yanlış?', 'if (saat = 2) { }', ['=', '==', 'atama', 'karşılaştır', 'eşit'], 'Tek = atama işlemidir, karşılaştırma değildir. Karşılaştırmak için saat == 2 yazmalıyım.', 'Süslü parantez eksik.')] },
    { id: '1.4', modul: 'M1', baslik: 'Metotlar ve Math.Ceiling', semt: 'carsi', tier: 1, xp: 100, dk: 14, durum: 'acik', gorev: 'taksimetre',
      hedefler: ['Parametreli, değer döndüren metot yazmak', 'return ifadesini doğru kullanmak', 'Math.Ceiling ile yukarı yuvarlamak'],
      kartlar: [K('Tahmin et', 'Metot ne döndürür?', 'Ikiye(4) + 1 neye eşittir?', 'static int Ikiye(int x)\n{\n    return x * 2;\n}'),
        K('Çalıştır', 'Parametre ve dönüş', 'Parametre metoda giren değerdir, dönüş değeri çıkandır. Dönüş türü `int` ise `return` bir tam sayı vermelidir.', 'static int Ikiye(int x) { return x * 2; }\nConsole.WriteLine(Ikiye(4));'),
        K('Yap', 'Taksimetre', 'Kilometre başına ücreti hesaplayan metodu yaz.')],
      ornekKod: 'static int Ucret(int km)\n{\n    return km * 25 + 40;\n}\nConsole.WriteLine(Ucret(4));',
      dene: { baslangic: 'static int Ucret(int km)\n{\n    // km başına 25 TL + 40 TL açılış\n}', hedefCikti: '140', cozum: 'static int Ucret(int km)\n{\n    return km * 25 + 40;\n}' },
      sorular: [
        S('1.4-s1', 'Kavram Sorusu', 'Metot nedir? Parametre ile dönüş değeri arasındaki fark nedir?', null, ['metot', 'parametre', 'dönüş', 'return', 'giren', 'çıkan', 'iş'], 'Metot, adı olan ve tekrar kullanılabilen bir iş parçasıdır. Parametre içeri giren değer, dönüş değeri return ile dışarı çıkan sonuçtur.', 'Kod parçası.'),
        S('1.4-s2', 'Çıktı Tahmini', 'Ikiye(4) + 1 ekrana ne yazar?', 'static int Ikiye(int x) { return x * 2; }\nConsole.WriteLine(Ikiye(4) + 1);', ['9', 'ikiye', '8', 'artı', 'return'], '9 yazar: Ikiye(4) 8 döndürür, üzerine 1 eklenince 9 olur.', '5'),
        S('1.4-s3', 'Hata Avı', 'Bu metot neden derlenmez?', 'static int Topla(int a, int b)\n{\n    a + b;\n}', ['return', 'döndür', 'ifade', 'int', 'metot'], 'Metot int döndürmeli ama return yok; a + b tek başına bir ifade değildir. return a + b; yazmalıyım.', 'Parametre fazla.')] },
    { id: '2.1', modul: 'M2', baslik: 'Diziler ve List<T>', semt: 'liman', tier: 1, xp: 100, dk: 12, durum: 'kilitli', hedefler: ['Dizi ve List<T> kurmak'], kartlar: [], ornekKod: '', dene: { baslangic: '', hedefCikti: '', cozum: '' },
      sorular: [S('2.1-s1', 'Kavram Sorusu', 'Dizi ile List<T> arasındaki temel fark nedir?', null, ['boyut', 'sabit', 'esnek', 'ekle', 'list'], 'Dizinin boyutu sabittir, List<T> ise gerektikçe büyür ve Add ile eleman eklenir.', 'Aynı şeyler.'),
        S('2.1-s2', 'Çıktı Tahmini', 'Ekrana ne yazar?', 'var l = new List<int> { 4, 8 };\nConsole.WriteLine(l.Count);', ['2', 'count', 'eleman'], '2 yazar; listede iki eleman var.', '4')] }
  ];
  const E = (baslangicKod, testler, pusula, fener, taslak, ornek, cozum) => ({ baslangicKod, testler, ipuclari: { pusula, fener, taslak, ornek }, cozum });
  const T = (id, girdi, beklenen, desen, yasak) => ({ id, girdi, beklenen, desen: desen || [], yasak: yasak || [] });
  const G = (id, ad, tip, dersId, xp, bayt, sev, ruhsat, editor) => ({ id, ad: ad, tip, semt: 'carsi', dersId, kosul: dersId ? 'Ders ' + dersId + ' Mührü' : '', odul: { xp, bayt }, acilisSeviye: sev, ruhsat, ...(editor ? { editor } : {}) });
  const gorevler = [
    G('meydan-saati', 'Meydan Saati', 'Tamamlama', '1.1', 60, 40, 1, true, E('int toplam = 125;\nint saat = 0;\nint dakika = 0;\nConsole.WriteLine(saat + " saat " + dakika + " dakika");',
      [T('t1', '125', '2 saat 5 dakika', ['toplam\\s*/\\s*60'], ['int saat = 0;']), T('t2', '125', '2 saat 5 dakika', ['toplam\\s*%\\s*60'], ['int dakika = 0;']), T('t3', '125', '2 saat 5 dakika', ['Console\\.WriteLine'], ['NotImplementedException'])],
      'Toplam dakikayı saate ve artan dakikaya ayırmak için hangi iki işleç gerekir?', 'Bölme (/) tam saati, kalan (%) artan dakikayı verir.', 'int saat = toplam / 60;\nint dakika = toplam % 60;', 'int saat = toplam / 60;\nint dakika = toplam % 60;\nConsole.WriteLine(saat + " saat " + dakika + " dakika");',
      'int toplam = 125;\nint saat = toplam / 60;\nint dakika = toplam % 60;\nConsole.WriteLine(saat + " saat " + dakika + " dakika");')),
    G('dakikadan-saate', 'Dakikadan Saate', 'Tamamlama', '1.2', 60, 50, 1, true, E('int dakika = 125;\nint saat = 0;\nConsole.WriteLine(saat);',
      [T('t1', '125', '3', ['\\+\\s*59|Ceiling'], ['int saat = 0;']), T('t2', '125', '3', ['/\\s*60'], []), T('t3', '125', '3', ['Console\\.WriteLine'], ['int saat = 0;'])],
      'Başlayan saat, dakikayı 60\'a bölüp yukarı yuvarlamaktır.', '(dakika + 59) / 60 ya da Math.Ceiling(dakika / 60.0).', 'int saat = (dakika + 59) / 60;', 'int saat = (dakika + 59) / 60;\nConsole.WriteLine(saat);',
      'int dakika = 125;\nint saat = (dakika + 59) / 60;\nConsole.WriteLine(saat);')),
    G('kademeli-karar', 'Kademeli Karar', 'Tamamlama', '1.3', 60, 60, 1, true, E('int saat = 3;\n// kısa / orta / uzun yazdır',
      [T('t1', '1', 'kısa', ['if\\s*\\('], []), T('t2', '3', 'orta', ['else\\s+if'], []), T('t3', '9', 'uzun', ['else(?!\\s+if)'], [])],
      'Üç sonuç var; koşulları sıralı yazmak gerekir.', 'if, else if, else zincirini kur; sınırları 2 ve 6 saat olsun.', 'if (saat < 2) { } else if (saat <= 6) { } else { }', 'if (saat < 2) Console.WriteLine("kısa");\nelse if (saat <= 6) Console.WriteLine("orta");\nelse Console.WriteLine("uzun");',
      'int saat = 3;\nif (saat < 2) Console.WriteLine("kısa");\nelse if (saat <= 6) Console.WriteLine("orta");\nelse Console.WriteLine("uzun");')),
    G('taksimetre', 'Taksimetre', 'Sıfırdan', '1.4', 100, 80, 1, true, E('static int Ucret(int km)\n{\n    throw new NotImplementedException();\n}',
      [T('t1', '4', '140', ['static\\s+int\\s+Ucret'], ['NotImplementedException']), T('t2', '4', '140', ['\\breturn\\b'], ['NotImplementedException']), T('t3', '0', '40', ['\\*\\s*25|25\\s*\\*', '\\+\\s*40|40\\s*\\+'], ['NotImplementedException'])],
      'Ücret = km × 25 + 40 açılış ücreti.', 'Metot int döndürür; return ile ifadeyi ver.', 'return km * 25 + 40;', 'static int Ucret(int km)\n{\n    return km * 25 + 40;\n}',
      'static int Ucret(int km)\n{\n    return km * 25 + 40;\n}')),
    G('is-emri-otopark', 'Otopark İş Emri', 'İş Emri', null, 300, 0, 3, false),
    G('gunluk-tekrar', 'Günlük Tekrar', 'Günlük Tekrar', null, 15, 20, 1, false),
    G('semt-sinavi-carsi', 'Çarşı Semt Sınavı', 'Semt Sınavı', null, 200, 500, 5, false),
    G('hata-bildirimi-1', 'Hata Bildirimi: Eksik return', 'Hata Bildirimi', '1.4', 40, 40, 3, false),
    G('liman-1', 'Konteyner Sayımı', 'Sıralama', '2.1', 60, 60, 6, false),
    G('liman-2', 'Vinç Vardiyası', 'Tamamlama', '2.1', 60, 60, 6, false)
  ];
  const otopark = {
    publicTestler: [30, 61, 120, 121, 361, 1441].map((d, i) => ({ id: 'a' + (i + 1), dakika: d, beklenen: otoparkUcret(d) })),
    gizliTestler: [0, 1, 59, 60, 119, 180, 359, 360, 720, 1439, 1440, 2880, 2881, 100000].map((d, i) => ({ id: 'g' + (i + 1), dakika: d, beklenen: otoparkUcret(d) })),
    referansKod: 'public static class Otopark\n{\n    public static int UcretHesapla(int dakika)\n    {\n        if (dakika <= 0) return 0;\n        int saat = (dakika + 59) / 60;        // başlayan saat\n        if (dakika < 120) return saat * 100;  // 2 saatten az kalanlar\n        if (dakika <= 360) return saat * 40;  // 2–6 saat, sınırlar dâhil\n        int gun = (dakika + 1439) / 1440;     // başlayan gün\n        return gun * 250;\n    }\n}',
    templateKod: 'public static class Otopark\n{\n    public static int UcretHesapla(int dakika)\n    {\n        /* kodun buraya */\n        throw new NotImplementedException();\n    }\n}',
    sozlesme: [
      { madde: 1, kural: 'Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL.' },
      { madde: 2, kural: 'Dilimi ham kalış süresi belirler: dakika < 120 → 1. dilim; 120 ≤ dakika ≤ 360 → 2. dilim (sınırlar dâhil); dakika > 360 → günlük.' },
      { madde: 3, kural: 'Başlayan saat tam sayılır: saat = ceil(dakika / 60); 1. dilim saat × 100, 2. dilim saat × 40.' },
      { madde: 4, kural: '24 saati aşan kalış: her başlayan gün 250 (gun = ceil(dakika / 1440), gun × 250).' },
      { madde: 5, kural: 'İmza: public static int Otopark.UcretHesapla(int dakika); dönüş TL, tam sayı.' },
      { madde: 6, kural: 'Anomali (119 → 200, 120 → 80) müşterinin bilinçli kararıdır; fark eden oyuncu Keskin Göz (+50 XP).' }
    ],
    hasanIstegi: '2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum.',
    netlestirmeSorulari: [
      { id: 'n1', soru: 'Girdi hangi birimde ve hangi türde geliyor?', cevap: 'Dakika cinsinden tam sayı. Negatif göndermiyorlar; 0 gelirse 0 TL.', madde: 1 },
      { id: 'n2', soru: 'Tam 2 saat (120 dakika) kalan hangi tarifeden öder?', cevap: '2–6 saat arası sayılır: her saat 40 TL, yani 120 dakika 80 TL.', madde: 2 },
      { id: 'n3', soru: 'Tam 6 saat (360 dakika) kalan ne öder?', cevap: '6 saat dâhil 2–6 arasındadır: 6 saat × 40 = 240 TL.', madde: 2 },
      { id: 'n4', soru: '61 dakika kaç saat sayılır?', cevap: 'Başlayan saat tam sayılır: 61 dakika iki saattir, 200 TL.', madde: 3 },
      { id: 'n5', soru: '24 saati aşan kalışta ne olacak?', cevap: 'Her başlayan gün için 250 TL. 25 saat kalan iki gün öder: 500 TL.', madde: 4 },
      { id: 'n6', soru: 'Dilim belirlenirken ham süreye mi, yuvarlanmış saate mi bakıyoruz?', cevap: 'Ham kalış süresine: dakika < 120 ise birinci dilim.', madde: 2 },
      { id: 'n7', soru: 'Sonuç hangi birimde ve türde olsun?', cevap: 'TL cinsinden tam sayı.', madde: 5 },
      { id: 'n8', soru: 'Metodun adı ve imzası ne olsun?', cevap: 'public static int Otopark.UcretHesapla(int dakika).', madde: 5 }
    ],
    keskinGoz: { soru: '119 dakika 200 TL ama 120 dakika 80 TL; bu bilerek mi?', cevap: 'Evet, bilinçli karar. 2 saatten az kalanlara saati 100 TL, 2–6 saat arası kalanlara saati 40 TL dedim; sınırda fiyat düşüyor.' },
    savunmaSorulari: [
      { id: 's1', soru: '121 dakika neden 120 TL? Hangi satır bunu belirliyor?', satirIpucu: 'saat * 40', anahtarlar: ['saat', '40', 'başlayan', 'yukarı', 'yuvarla', '3', '121'] },
      { id: 's2', soru: '120 dakikada 80 TL çıkması hangi karşılaştırmaya bağlı?', satirIpucu: 'dakika < 120', anahtarlar: ['120', '<', 'küçük', 'ikinci', 'dilim', 'dâhil', 'eşit'] },
      { id: 's3', soru: '1.441 dakika neden 500 TL?', satirIpucu: 'gun * 250', anahtarlar: ['gün', '1440', 'başlayan', '250', '2'] },
      { id: 's4', soru: '0 dakika girilirse ne olur ve neden?', satirIpucu: 'dakika <= 0', anahtarlar: ['0', 'sıfır', 'return', 'ücretsiz', 'negatif'] }
    ],
    ipuclari: { pusula: 'Üç dilim var: 2 saatten az, 2–6 saat ve 6 saatten fazla. Hangisinde hangi çarpan geçerli?', fener: 'Önce başlayan saati hesapla: (dakika + 59) / 60. Sonra dakikaya göre dilimi seç.', taslak: 'if (dakika <= 0) return 0;\nint saat = ...;\nif (dakika < 120) return ...;\nif (dakika <= 360) return ...;\nreturn ...;', ornek: 'Referans çözümün yapısı: sıfır koruması, saat hesabı, iki dilim, günlük tarife.' },
    sikayetler: { 'ilk-dilim': 'Yarım saat civarı kalanlar yanlış ücret ödedi.', 'sinir-120': 'Tam 2 saat kalanlar şikâyetçi.', 'sinir-360': '6 saat civarı kalanlar yanlış ücret ödedi.', 'gun-hesabi': 'Bir günü aşıp iki güne giren kalışlar yanlış faturalanıyor.', 'uzun-kalis': 'Çok uzun kalanların faturası tutmuyor.', 'sifir': 'Hiç park etmeyenlere ücret yazılmış.' },
    yaygınHatalar: [
      { id: 'h1', ad: 'Sınır: 120 dâhil değil', kod: 'if (dakika <= 120) return saat * 100;', aciklama: '120 dakika 2. dilimde olmalı.' },
      { id: 'h2', ad: 'Yukarı yuvarlama yok', kod: 'int saat = dakika / 60;', aciklama: 'Başlayan saat tam sayılmalı.' },
      { id: 'h3', ad: 'Gün yuvarlama yok', kod: 'int gun = dakika / 1440;', aciklama: 'Her başlayan gün 250 TL.' }
    ]
  };
  const I = (id, ad, fiyat, gelirSaat, seviye, konu, musteri, durum) => ({ id, ad, semt: id === 'kargo-deposu' ? 'liman' : 'carsi', seviye, fiyat, gelirSaat, seviyeSayisi: id === 'otopark' ? 5 : 4, konu, durum, musteri });
  const isletmeler = [
    I('otopark', 'Otopark', 300, 9.2, 3, 'if/else if, metot, başlayan saati yukarı yuvarlama', 'Hasan Abi', 'mvp'),
    I('bufe', 'Büfe', 600, 14.5, 4, 'Aritmetik, decimal, para üstü', 'Büfeci Nuri', 'mvp'),
    I('manav', 'Manav', 900, 20, 5, 'Döngüler, switch, miktara göre indirim', 'Manav Kazım', 'insaat'),
    I('kargo-deposu', 'Kargo Deposu', 1500, 31, 6, 'Diziler, List<T>, envanter sayımı', 'Kaptan Rıza', 'mvp'),
    I('balik-hali', 'Balık Hali', 2200, 44, 8, 'Dictionary fiyat listesi, string.Split', 'Balıkçı Gülsüm', 'insaat'),
    I('oto-yikama', 'Oto Yıkama', 2500, 49, 9, 'List + paket ve ek hizmet listesi', 'Yıkamacı Mahmut', 'insaat'),
    I('gumruk', 'Gümrük', 3000, 58, 10, 'Arama, sıralama, plaka doğrulama', 'Gümrük Memuru Faruk', 'insaat'),
    I('oto-tamirhane', 'Oto Tamirhane', 5000, 95, 12, 'Sınıf, kalıtım', 'Usta Haydar', 'insaat')
  ];
  const M = (id, ad, kategori, nadirlik, fiyat, para, tur, anahtar, rotasyon) => ({ id, ad, kategori, nadirlik, fiyat, para, onizleme: { tur, anahtar }, ...(rotasyon ? { rotasyon: true } : {}) });
  const magaza = [
    M('cirak-sapkasi', 'Çırak Şapkası', 'aksesuar', 'Sıradan', 30, 'bayt', 'avatar', 'sapka'), M('bere', 'Bere', 'aksesuar', 'Sıradan', 45, 'bayt', 'avatar', 'bere'),
    M('kasket', 'Kasket', 'aksesuar', 'Sıradan', 60, 'bayt', 'avatar', 'kasket'), M('omuz-silk', 'Omuz Silk', 'emote', 'Sıradan', 60, 'bayt', 'avatar', 'emote-omuz'),
    M('tuslama', 'Tuşlama', 'emote', 'Sıradan', 100, 'bayt', 'avatar', 'emote-tuslama'), M('puf', 'Puf', 'esya', 'Sıradan', 50, 'bayt', 'prop', 'koltuk'),
    M('yatak', 'Yatak', 'esya', 'Sıradan', 160, 'bayt', 'prop', 'yatak'), M('hali', 'Halı', 'esya', 'Sıradan', 70, 'bayt', 'prop', 'hali'),
    M('kitaplik', 'Kitaplık', 'esya', 'Sıradan', 110, 'bayt', 'prop', 'kitaplik'), M('masa-lambasi', 'Masa Lambası', 'esya', 'Sıradan', 45, 'bayt', 'prop', 'lamba'),
    M('buyuk-bitki', 'Büyük Bitki', 'esya', 'Sıradan', 85, 'bayt', 'prop', 'bitki'), M('kot-set', 'Kot ve Tişört', 'kiyafet', 'Sıradan', 80, 'bayt', 'avatar', 'kiyafet-0'),
    M('gozluk', 'Yuvarlak Gözlük', 'aksesuar', 'Şık', 120, 'bayt', 'avatar', 'gozluk'), M('kulaklik', 'Kulaklık', 'aksesuar', 'Şık', 150, 'bayt', 'avatar', 'kulaklik'),
    M('kaptan', 'Kaptan Şapkası', 'aksesuar', 'Şık', 180, 'bayt', 'avatar', 'kaptan'), M('kalp-emote', 'Kalp', 'emote', 'Şık', 120, 'bayt', 'avatar', 'emote-kalp'),
    M('ikili-koltuk', 'İkili Koltuk', 'esya', 'Şık', 140, 'bayt', 'prop', 'koltuk'), M('ayakli-lamba', 'Ayaklı Lamba', 'esya', 'Şık', 90, 'bayt', 'prop', 'lamba'),
    M('hirka-set', 'Turuncu Hırka', 'kiyafet', 'Şık', 240, 'bayt', 'avatar', 'kiyafet-1'),
    M('carsi-tentesi', 'Çarşı Tentesi', 'oda', 'Nadir', 130, 'bayt', 'prop', 'tente', true), M('konteyner-sehpa', 'Konteyner Sehpa', 'esya', 'Nadir', 120, 'bayt', 'prop', 'kutu', true),
    M('baret', 'Sarı Baret', 'aksesuar', 'Nadir', 300, 'bayt', 'avatar', 'baret', true), M('neon-tabela', 'Neon Tabela', 'tabela', 'Nadir', 400, 'bayt', 'prop', 'neon', true),
    M('neon-gece', 'Neon Gece Seti', 'kiyafet', 'Premium', 80, 'cip', 'avatar', 'kiyafet-4'), M('tente-alti', 'Tente Altı Oda Teması', 'oda', 'Premium', 60, 'cip', 'prop', 'tente'),
    M('robot-dansi', 'Robot Dansı', 'emote', 'Premium', 50, 'cip', 'avatar', 'emote-dans'), M('bulut-kolye', 'Bulut Kolyesi', 'aksesuar', 'Premium', 40, 'cip', 'avatar', 'kolye'),
    M('otopark-kupasi', 'Otopark Ustası Kupası', 'esya', 'Nişan', 0, 'bayt', 'prop', 'bayrak'), M('keskin-goz-nisan', 'Keskin Göz Nişanı', 'aksesuar', 'Nişan', 0, 'bayt', 'avatar', 'rozet'),
    M('derleyici-dansi', 'Derleyici Dansı', 'emote', 'Nişan', 0, 'bayt', 'avatar', 'emote-dans')
  ];
  const A = (ten, sacStil, sacRenk, kiyafet, aksesuar) => ({ ten, sacStil, sacRenk, kiyafet, aksesuar: aksesuar || [] });
  const liderlik = {
    haftalik: [['ayse_kod', 9, 1420, A(1, 2, 3, 1, ['gozluk'])], ['mert_yaz', 8, 1310, A(3, 0, 0, 0)], ['zeynep.cs', 8, 1195, A(0, 3, 4, 2)], ['can_derle', 7, 1090, A(4, 5, 2, 3, ['kasket'])], ['elif_bit', 7, 980, A(2, 4, 1, 4)], ['burak_byte', 6, 905, A(5, 6, 0, 5)],
      ['selin_syntax', 6, 840, A(1, 1, 5, 1, ['kulaklik'])], ['emre_loop', 5, 760, A(3, 7, 2, 0)], ['defne_if', 5, 702, A(0, 2, 3, 2)], ['kaan_main', 4, 610, A(4, 0, 1, 3)], ['ece_void', 4, 548, A(2, 3, 4, 4, ['bere'])], ['onur_null', 3, 470, A(5, 5, 0, 5)]]
      .map(([ad, seviye, xp, avatar]) => ({ ad, seviye, xp, avatar })),
    kalicilik: [['mert_yaz', 8, 14], ['ayse_kod', 9, 12], ['zeynep.cs', 8, 11], ['elif_bit', 7, 9], ['can_derle', 7, 8], ['selin_syntax', 6, 6], ['burak_byte', 6, 5], ['emre_loop', 5, 3]].map(([ad, seviye, altinDurak]) => ({ ad, seviye, altinDurak, avatar: A(altinDurak % 6, altinDurak % 8, altinDurak % 6, altinDurak % 6) })),
    hizliOtopark: [{ ad: 'mert_yaz', sure: '4 dk 12 sn' }, { ad: 'ayse_kod', sure: '5 dk 40 sn' }, { ad: 'can_derle', sure: '7 dk 03 sn' }, { ad: 'elif_bit', sure: '8 dk 31 sn' }, { ad: 'zeynep.cs', sure: '9 dk 55 sn' }],
    kazancliIsletme: [{ ad: "ayse_kod'un Otoparkı", gelir: 3320 }, { ad: "mert_yaz'ın Büfesi", gelir: 2870 }, { ad: "can_derle'nin Otoparkı", gelir: 2410 }, { ad: "elif_bit'in Otoparkı", gelir: 2190 }, { ad: "zeynep.cs'in Otoparkı", gelir: 1975 }]
  };
  const R = (id, dersId, tip, soru, secenekler, dogru, aciklama) => ({ id, dersId, tip, soru, ...(secenekler ? { secenekler } : {}), dogru, aciklama });
  const tekrar = [ // 'kisa' tipte dogru: kabul edilen cevaplar "|" ile ayrılır
    R('t1', '1.1', 'coktan', 'Hangisi metin (string) tutar?', ['int', 'string', 'bool'], 1, 'string metin tutar; int tam sayı, bool doğru/yanlış.'),
    R('t2', '1.1', 'coktan', '`int yas = "17";` neden hata verir?', ['Tırnaklı değer metindir, int kutusuna konamaz', 'yas adı geçersizdir', 'Noktalı virgül eksiktir'], 0, 'Tırnak içindeki 17 metindir; int kutusuna metin konamaz.'),
    R('t3', '1.1', 'kisa', 'Console.WriteLine ne yapar? (kısaca)', null, 'ekrana yaz|yazdır|çıktı', 'Console.WriteLine değeri ekrana yazar ve satır sonuna geçer.'),
    R('t4', '1.2', 'coktan', 'int türünde 7 / 2 kaç eder?', ['3,5', '3', '4'], 1, 'Tam sayı bölmesi kesirli kısmı atar: 3.'),
    R('t5', '1.2', 'kisa', '17 % 5 kaç eder?', null, '2', '% bölmeden kalanı verir: 17 = 3×5 + 2.'),
    R('t6', '1.2', 'coktan', '% işleci neyi verir?', ['Bölümü', 'Kalanı', 'Çarpımı'], 1, '% (mod) bölmeden kalanı verir.'),
    R('t7', '1.2', 'kisa', '(61 + 59) / 60 kaç eder?', null, '2', '120 / 60 = 2: başlayan saat yukarı yuvarlanır.'),
    R('t8', '1.3', 'coktan', 'İki değeri karşılaştırmak için hangisi kullanılır?', ['=', '==', '=>'], 1, '== karşılaştırır; tek = atama yapar.'),
    R('t9', '1.3', 'kisa', 'saat = 3 iken saat < 2 doğru mu yanlış mı?', null, 'yanlış|false', '3, 2\'den küçük değildir: yanlış.'),
    R('t10', '1.3', 'coktan', 'else if zincirinde ilk doğru koşuldan sonra ne olur?', ['Hepsine bakılır', 'Gerisine bakılmaz', 'Hata verir'], 1, 'İlk doğru dal çalışır, gerisine bakılmaz.'),
    R('t11', '1.3', 'coktan', 'Hangisi bool değer tutar?', ['true', '"true"', '1.0'], 0, 'Tırnaksız true bir bool değerdir; tırnaklısı metindir.'),
    R('t12', '1.4', 'coktan', 'Metoda dışarıdan giren değere ne denir?', ['Parametre', 'Dönüş değeri', 'Etiket'], 0, 'Parametre metoda giren değerdir.'),
    R('t13', '1.4', 'kisa', 'static int Ikiye(int x) { return x * 2; } için Ikiye(5) kaç döndürür?', null, '10', '5 × 2 = 10.'),
    R('t14', '1.4', 'coktan', 'int döndüren bir metotta hangisi şarttır?', ['return', 'void', 'static class'], 0, 'int dönen metot, her yolda return ile bir tam sayı vermelidir.'),
    R('t15', '1.4', 'kisa', 'Math.Ceiling(2.1) kaç eder?', null, '3', 'Ceiling her zaman yukarı yuvarlar: 3.')
  ];
  const sohbet = {
    meydan: [{ ad: 'ayse_kod', metin: "Çarşı Sınavı'na hazırlanan var mı?", saat: '14:02' }, { ad: 'mert_yaz', metin: 'Ben Otopark kodunu bitirdim, Savunma kaldı.', saat: '14:03' }, { ad: 'can_derle', metin: 'Savunmada hangi satırı seçiyorlar?', saat: '14:05' }, { ad: 'mert_yaz', metin: 'Bana saat * 40 satırını sordular.', saat: '14:06' }, { ad: 'elif_bit', metin: 'Günlük Tekrar serim 7 oldu!', saat: '14:09' }, { ad: 'zeynep.cs', metin: 'Aferin, Pazar\'da yeni Nadir ürünler var.', saat: '14:10' }],
    hazirCumleler: ['Merhaba!', 'Selam, nasılsın?', 'Yardım eder misin?', 'Teşekkürler!', 'Güzel çözüm, aferin.', 'Ben de aynı soruda takıldım.', 'Hangi dersteyiz?', 'Görüşürüz!'],
    arkadaslar: [{ ad: 'ayse_kod', seviye: 9, durum: 'çevrimiçi', avatar: A(1, 2, 3, 1, ['gozluk']) }, { ad: 'mert_yaz', seviye: 8, durum: 'Otoparkta', avatar: A(3, 0, 0, 0) }, { ad: 'can_derle', seviye: 7, durum: 'çevrimdışı', avatar: A(4, 5, 2, 3) }, { ad: 'elif_bit', seviye: 7, durum: 'çevrimiçi', avatar: A(2, 4, 1, 4) }],
    dm: [{ kimden: 'ayse_kod', metin: 'Otopark kodun nasıl gidiyor?', saat: '13:40' }, { kimden: 'ben', metin: 'İş Emri\'ndeyim, 4 soru sordum.', saat: '13:42' }, { kimden: 'ayse_kod', metin: '119 ile 120 dakikaya dikkat et :)', saat: '13:43' }]
  };
  const rozetler = [
    { id: 'keskin-goz', ad: 'Keskin Göz', aciklama: '119/120 dakika anomalisini fark ettin.', nasil: "İş Emri'nde 119 ve 120 dakika arasındaki fiyat farkını müşteriye sor.", ikon: 'goz' },
    { id: 'berrak-zihin', ad: 'Berrak Zihin', aciklama: 'Bir görevi ipucusuz, ilk denemede geçtin.', nasil: 'Görevi Pusula\'ya bakmadan tamamla.', ikon: 'isik' },
    { id: 'ilk-acilis', ad: 'Derleyici Dansı', aciklama: 'İlk işletmeni açtın.', nasil: 'Bir işletmenin Savunma\'sını geç ve Açılış yap.', ikon: 'kutlama' },
    { id: 'otopark-ustasi', ad: 'Otopark Ustası', aciklama: 'Gizli testlerin tamamını ilk 3 denemede geçtin.', nasil: 'Müfettiş\'i en çok 3 denemede geç.', ikon: 'kupa' },
    { id: 'seri-7', ad: 'Yedi Gün', aciklama: 'Günlük Tekrar serin 7 güne ulaştı.', nasil: '7 gün üst üste Günlük Tekrar yap.', ikon: 'alev' },
    { id: 'ruhsat', ad: 'Ruhsat Sahibi', aciklama: 'Üç görevi bitirip Ruhsat\'ı aldın.', nasil: 'Çarşı\'nın üç Ruhsat görevini tamamla.', ikon: 'muhur' }
  ];
  const metinler = {
    bos: { akademi: 'Bu kürsü henüz açılmadı. Önceki semtin sınavını geçince kapısı açılır.', oda: 'Odan boş. Pazar\'dan eşya alıp yerleştirebilirsin.', ziyaretci: 'Henüz ziyaretçi defterinde not yok.', dolap: 'Dolabında bu kategoride eşya yok. Pazar\'a göz at.', bildirim: 'Yeni bildirimin yok.' },
    hata: { ag: 'Bağlantı kurulamadı. Biraz sonra tekrar dene.', kayit: 'Kayıt okunamadı; yeni oyun başlatıldı.', kurul: 'Kurul şu an ulaşılamıyor, çevrimdışı demo kullanıldı.' },
    bildirim: ['Günlük Tekrar seni bekliyor.', "Haftalık lig Pazar 21:00'de kapanıyor.", 'Pazar\'da yeni rotasyon başladı.'],
    kvkk: { aydinlatma: 'KodKent, telefon numaranı yalnızca hesabını doğrulamak ve güvenliğini sağlamak için işler. Yazdığın kodlar ve cevapların eğitim amacıyla değerlendirilir; üçüncü kişilerle paylaşılmaz. Verilerini istediğin an indirebilir ya da silebilirsin.', veli: '13–17 yaş arası oyuncular için veli onayı gerekir. Velinin telefonuna bir onay bağlantısı gönderilir; bağlantı 72 saat geçerlidir. Onay gelene kadar serbest metin sohbet kapalı kalır.' },
    onboarding: ['Telefon numaranı gir, sana altı haneli bir kod gönderelim.', 'Dilini seç: şimdilik C# açık, diğerleri yolda.', 'Avatarını kur, takma adını seç ve şehre gir.'],
    csHata: [
      { kod: 'CS0029', mesaj: "'string' türü örtük olarak 'int' türüne dönüştürülemez", aciklama: 'int kutusuna metin koymaya çalışıyorsun. Tırnakları kaldır ya da türü string yap.' },
      { kod: 'CS1002', mesaj: '; bekleniyor', aciklama: 'Satırın sonunda noktalı virgül unutulmuş.' },
      { kod: 'CS0103', mesaj: "'x' adı geçerli bağlamda yok", aciklama: 'Bu isimde bir değişken tanımlamadın ya da yanlış yazdın.' },
      { kod: 'CS0161', mesaj: 'Tüm kod yolları bir değer döndürmüyor', aciklama: 'Metot int dönüyor ama bazı yollarda return yok.' },
      { kod: 'CS0266', mesaj: "'double' türü 'int' türüne örtük dönüştürülemez", aciklama: 'Ondalıklı sonucu int kutusuna koyamazsın; (int) ile açıkça dönüştür.' }
    ]
  };
  const DATA = { semtler, ustalar, moduller, dersler, gorevler, otopark, isletmeler, magaza, liderlik, tekrar, sohbet, rozetler, metinler, seviyeHediyeleri: [] };

  /* ---- çevrimdışı yardımcılar (saf) ---- */
  const FOLD = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' }; // Türkçe harf farkını yok sayar (ıkiye = ikiye, degisken = değişken)
  const tn = s => String(s == null ? '' : s).toLocaleLowerCase('tr-TR').replace(/[çğıöşüâîû]/g, c => FOLD[c]).replace(/[^a-z0-9\s<>=+\-*/%.]/g, ' ').replace(/\s+/g, ' ').trim();
  const ENJEKSIYON = /(puan(ı)?\s*(ver|=)|\b100\s*(puan\s*)?ver|tam\s*puan|ignore\s+(all|previous|the)|önceki\s+talimat|talimat(lar)?(ı)?\s*(yok say|unut)|sistem\s*(istemi|prompt))/i;
  function cevrimdisiPuanla(g) {
    g = g || {};
    const cevap = String(g.cevap || ''), t = tn(cevap), kel = t ? t.split(' ') : [];
    const anah = (g.anahtarlar || []).map(tn).filter(Boolean);
    const on = g.ad ? g.ad + ', ' : '';
    if (ENJEKSIYON.test(cevap)) {
      return { puan: 0, olcutler: [{ ad: 'Doğruluk', puan: 0, not: 'Cevap soruyu değil, puanlayıcıyı hedef alıyor.' }, { ad: 'Tamlık', puan: 0, not: 'Soruyla ilgili içerik yok.' }, { ad: 'Açıklık', puan: 0, not: 'Cevap bir açıklama içermiyor.' }],
        geri_bildirim: on + 'Kurul pazarlık etmez: cevabın puan istiyor, çözüm değil. Bu soruyu kendi cümlelerinle yeniden yanıtla; ilk adım olarak sorudaki anahtar kavramı bir cümlede açıkla.', takip_sorusu: '', guven: 0.9, kopya_suphesi: true, kaynak: 'cevrimdisi' };
    }
    const bulunan = anah.filter(a => t.includes(a)), eksik = anah.filter(a => !t.includes(a));
    const n = Math.max(1, anah.length), gerek = Math.max(2, Math.ceil(n * 0.6));
    let dog = Math.round(50 * Math.min(1, bulunan.length / gerek));
    if (kel.length < 3) dog = Math.min(dog, 8);
    let tam = Math.round(30 * (0.7 * Math.min(1, bulunan.length / n) + 0.3 * Math.min(1, kel.length / 16)));
    if (!bulunan.length) tam = Math.min(tam, 5);
    const cesit = new Set(kel).size / Math.max(1, kel.length);
    const acik = kel.length < 3 ? 0 : Math.round(20 * Math.min(1, 0.25 + (kel.length >= 8 ? 0.3 : 0.1) + (/[.!?]/.test(cevap) ? 0.2 : 0) + (cesit > 0.6 ? 0.25 : 0)));
    const puan = Math.max(0, Math.min(100, dog + tam + acik));
    const iyi = bulunan.length ? on + 'cevabında "' + bulunan[0] + '" kavramını yakalamışsın.' : on + 'cevabı yazmaya cesaret etmen güzel.';
    const eks = eksik.length ? ' Eksik kalan: "' + eksik[0] + '" kavramına da değinmelisin.' : ' Eksik kalan belirgin bir kavram görünmüyor.';
    const adim = puan >= 70 ? ' Sonraki adım: aynı fikri kendi örneğinle pekiştir.' : ' Sonraki adım: ders kartına dönüp ilgili örneği yeniden incele, sonra cevabını bir cümle daha genişlet.';
    return { puan,
      olcutler: [{ ad: 'Doğruluk', puan: dog, not: bulunan.length + '/' + n + ' anahtar kavram bulundu.' }, { ad: 'Tamlık', puan: tam, not: kel.length + ' kelimelik cevap ' + (tam >= 20 ? 'konuyu iyi kapsıyor.' : 'konuyu kısmen kapsıyor.') }, { ad: 'Açıklık', puan: acik, not: acik >= 14 ? 'Cümleler okunaklı.' : 'Cümle yapısı geliştirilebilir.' }],
      geri_bildirim: iyi + eks + adim, takip_sorusu: puan < 70 ? 'Aynı fikri bir benzetmeyle tek cümlede anlatabilir misin?' : '', guven: 0.55, kopya_suphesi: false, kaynak: 'cevrimdisi' };
  }
  const yorumsuz = k => String(k || '').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
  function sezgiselTest(kod, testler) {
    const k = yorumsuz(kod);
    const bos = /NotImplementedException/.test(k) && !/\breturn\b[^;]*;/.test(k.replace(/throw[^;]*;/g, ''));
    const f = { s100: /\b100\b/.test(k), s40: /\b40\b/.test(k), s250: /\b250\b/.test(k), dal: /\b(if|switch)\b|\?[^?]/.test(k),
      yuvarla: /Ceiling|\+\s*59\b|\+\s*60\s*-\s*1/.test(k) && /60/.test(k), gun: /\b1440\b|\bgun\b|\bgün\b/.test(k) && /1439|Ceiling|\+\s*1\b/.test(k),
      ilkEsit: /<=\s*120\b/.test(k), ikinciEksik: /<\s*360\b/.test(k) && !/<=\s*360\b/.test(k) };
    return (testler || []).map(t => {
      const d = Number(t.dakika), b = t.beklenen;
      if (bos) return { id: t.id, gecti: false, gercek: 'NotImplementedException' };
      let ok = true, yanlis = null;
      if (d <= 0) ok = f.dal || f.yuvarla;
      else if (d < 120) ok = f.s100 && f.dal && f.yuvarla;
      else if (d <= 360) { ok = f.s40 && f.dal && f.yuvarla; if (ok && d === 120 && f.ilkEsit) { ok = false; yanlis = Math.ceil(d / 60) * 100; } if (ok && d === 360 && f.ikinciEksik) { ok = false; yanlis = 250; } }
      else if (d <= 1440) ok = f.s250 && f.dal;
      else ok = f.s250 && f.gun;
      if (ok) return { id: t.id, gecti: true, gercek: String(b) };
      const yk = yanlis != null ? yanlis : (d <= 0 ? 100 : d < 120 ? Math.floor(d / 60) * 100 : d <= 360 ? Math.floor(d / 60) * 40 : 250);
      return { id: t.id, gecti: false, gercek: String(yk === b ? yk + 40 : yk) };
    });
  }
  function gorevTestEt(gorevId, kod) {
    const g = gorevler.find(x => x.id === gorevId), k = yorumsuz(kod);
    if (!g || !g.editor) return [];
    return g.editor.testler.map(t => {
      const desenOk = (t.desen || []).every(p => new RegExp(p).test(k)), yasakVar = (t.yasak || []).some(p => new RegExp(p).test(k));
      const gecti = desenOk && !yasakVar;
      return { id: t.id, gecti, gercek: gecti ? String(t.beklenen) : (yasakVar ? 'Başlangıç kodu hâlâ duruyor' : 'Beklenen çıktı üretilemiyor') };
    });
  }
  function savunmaDegerlendir(g) {
    g = g || {};
    const t = tn(g.aciklama), kel = t ? t.split(' ').length : 0, anah = (g.anahtarlar || []).map(tn).filter(Boolean);
    const isabet = anah.filter(a => t.includes(a)).length, gerek = Math.min(2, anah.length || 2);
    const kabul = isabet >= gerek && kel >= 6;
    return { kabul, gerekce: kabul ? 'Açıklaman seçilen satırın işini doğru bağlıyor (' + isabet + ' anahtar kavram).' : (kel < 6 ? 'Açıklama çok kısa; satırın ne yaptığını ve neden orada olduğunu en az bir cümleyle anlat.' : 'Açıklamada satırın asıl işini belirleyen kavramlar eksik; satırı tekrar oku ve ne hesapladığını söyle.') };
  }
  function kodIncele(kod) {
    const k = yorumsuz(kod), kisa = (k.match(/\b(int|var|string|double)\s+([a-zA-Z_ğüşöçıİĞÜŞÖÇ]\w*)/g) || []).filter(s => s.split(/\s+/)[1].length <= 1);
    const sayilar = (k.match(/\b(100|40|250|60|120|360|1440|59|1439)\b/g) || []).length;
    return [
      { baslik: 'Okunabilirlik', not: kisa.length ? 'Tek harfli değişken adların var; saat, gun gibi anlamlı adlar kodu kendi kendine anlatır.' : 'Adlandırma temiz: değişken adları ne tuttuğunu söylüyor.' },
      { baslik: 'Sihirli sayılar', not: sayilar >= 4 ? '100, 40, 250 gibi sayılar kodun içinde dağınık; const int ile adlandırırsan tarife değişince tek yerden düzeltirsin.' : 'Sabit sayıları az ve anlaşılır kullanmışsın; tarifeleri adlandırmak yine de bakımı kolaylaştırır.' },
      { baslik: 'Sınır mantığı', not: /<=\s*360|<=\s*120|<\s*120/.test(k) ? '120 ve 360 sınırlarını bilinçli seçmişsin; Sözleşme Kartı\'ndaki dâhil/hariç kuralıyla bir kez daha karşılaştır.' : '120 ve 360 dakika sınırlarında < ve <= seçimini Sözleşme Kartı\'yla karşılaştır; en çok hata orada çıkar.' }
    ];
  }
  return { DATA, xpGereken, seviyeHesapla, unvan, otoparkUcret, xpHesapla, cevrimdisiPuanla, sezgiselTest, gorevTestEt, savunmaDegerlendir, kodIncele };
})();
