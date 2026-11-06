/* ==== core/20-data-dersler.js — Çarşı 1.1–1.4 TAM içerik (P4). Kaynak: spec/B4-mufredat.md §4 (prototip bu bölümü aynen kullanır). ====
   Kart ≤60 kelime (PRIMM etiketleri), canlı örnek kod, 1 satırlık "Dene", ders başına 3 Usta sorusu (rubrik 50/30/20, anahtarlar, iyi/zayıf örnek cevap).
   `anahtarlar`: her öğe BİR KAVRAM GRUBUDUR; '|' ile ayrılan eşanlamlılardan biri yeterlidir (çevrimdışı puanlayıcı bunu okur). */

const D_R = function (d, t, a) { return [{ ad: 'Doğruluk', agirlik: 50, ayrinti: d }, { ad: 'Tamlık', agirlik: 30, ayrinti: t }, { ad: 'Açıklık', agirlik: 20, ayrinti: a }]; };
const D_S = function (id, tip, metin, kod, rub, anahtarlar, iyi, zayif, ek) {
  return Object.assign({ id: id, tip: tip, metin: metin }, kod ? { kod: kod } : {}, { rubrik: rub, anahtarlar: anahtarlar, ornekIyiCevap: iyi, zayifCevap: zayif, xpTaban: 30 }, ek || {});
};
const D_K = function (primm, baslik, metin, ek) { return Object.assign({ primm: primm, baslik: baslik, metin: metin }, ek || {}); };

const D_kod11 = `string ad = "Misafir";
int yas = 17;
Console.WriteLine("Merhaba KodKent!");
Console.WriteLine($"Ben {ad}, {yas} yaşındayım.");`;
const D_kod12 = `int dakika = 130;
int tamSaat = dakika / 60;              // 2  (kalan kesilir)
int artanDk = dakika % 60;              // 10 (kalan)
int baslayanSaat = (dakika + 59) / 60;  // 3  (başlayan saat)
Console.WriteLine($"{tamSaat} saat {artanDk} dk; başlayan saat: {baslayanSaat}");`;
const D_kod13 = `int yas = 12;
if (yas < 12)
    Console.WriteLine("Çocuk");
else if (yas < 65)
    Console.WriteLine("Tam");
else
    Console.WriteLine("Yaşlı");`;
const D_kod14 = `Console.WriteLine(Hesap.Kare(5));

public static class Hesap
{
    public static int Kare(int x)
    {
        return x * x;
    }
}`;

const D_ders11 = {
  id: '1.1', modul: 'M1', baslik: 'Merhaba KodKent', semt: 'carsi', tier: 1, xp: 100, dk: 8, usta: 'defne', onKosul: [], durum: 'acik',
  hedefler: ['`Console.WriteLine` ile ekrana yazar', 'değişkeni tür + ad + değer olarak okur (`string`, `int`)', '`$"..."` ile değeri metne yerleştirir'],
  soruTipleri: ['Kavram Sorusu', 'Çıktı Tahmini', 'Hata Avı'], kartXp: 10,
  kartlar: [
    D_K('Tahmin et', 'Dört satır, ne yazar?', "Önce oku, sonra çalıştır. Bu dört satır ekrana ne yazar? Çalıştırmadan tahmin et: kaç satır çıkar, hangi sözlerle? Yanılmak serbest. Tahminle sonuç ayrıldığı yerde öğrenme başlar.", {
      kod: D_kod11, dogru: 0, secenekler: [
        { id: 'A', metin: 'Merhaba KodKent!\nBen Misafir, 17 yaşındayım.', dogru: true },
        { id: 'B', metin: 'Merhaba KodKent!\nBen {ad}, {yas} yaşındayım.', dogru: false },
        { id: 'C', metin: 'Ben Misafir, 17 yaşındayım.', dogru: false }] }),
    D_K('Çalıştır', 'Ekran bir megafon', "Çalıştır'a bas. Ekran bir megafon gibi: `Console.WriteLine`'a verdiğin her söz şehre bir satır olarak duyurulur. Tahminin tuttu mu? Tutmadıysa sevin; neyi yanlış okuduğunu artık biliyorsun.", { kod: D_kod11 }),
    D_K('İncele', 'Değişken: etiketli kutu', "Değişken, üstüne etiket yapıştırılmış bir kutudur. `string ad = \"Misafir\";` diyor ki: etiket `string` (metin tutar), kutunun adı `ad`, içindeki değer `\"Misafir\"`. `int yas = 17;` da aynı: etiket `int` (tam sayı tutar), ad `yas`, değer `17`. Etikete uymayan şey kutuya girmez.", { kod: 'string ad = "Misafir";\nint yas = 17;' }),
    D_K('İncele', '$ tarif kartı', "Tırnağın önündeki `$` işareti metni tarif kartına çevirir. Süslü parantezdeki `{ad}` boşluktur; KodKent çalışırken oraya kutunun değerini koyar. `$`'ı unutursan boşluk doldurulmaz ve parantez ekrana olduğu gibi çıkar.", { kod: 'Console.WriteLine($"Ben {ad}, {yas} yaşındayım.");' }),
    D_K('Değiştir', 'Kutunun içini değiştir', "Kutunun içini değiştir. Yalnızca ilk satır açık: `\"Misafir\"` yerine kendi adını yaz, Çalıştır'a bas. Çıktın Meydan'daki LED panoda 10 saniye akacak; şehir seni ilk kez okuyacak.", { kod: 'string ad = "Misafir";' }),
    D_K('Yap', 'Saat panosunu onar', "Meydan'daki saat panosu bozuldu, üç satırı eksik. Onu sıradaki görevde sen onaracaksın. Önce Kurul'un üç sorusu var; kendi cümlelerinle cevap ver. Rubrik her zaman cevap kutusunun üstünde, kurallar açık.", { gorev: 'meydan-saati' })
  ],
  ornekKod: D_kod11, ornekCikti: 'Merhaba KodKent!\nBen Misafir, 17 yaşındayım.',
  dene: { satirNo: 1, baslangic: 'string ad = "Misafir";', cozum: 'string ad = "Ece";', hedefCikti: 'Merhaba KodKent!\nBen Ece, 17 yaşındayım.', yonerge: 'İlk satırdaki adı kendi adınla değiştir ve Çalıştır\'a bas.' },
  sorular: [
    D_S('1.1-s1', 'Kavram Sorusu', '`int yas = 17;` yazdın. `yas` ne, `17` ne, `int` ne? Kendi cümlelerinle anlat.', '',
      D_R('`yas` kutunun adı / değişken (15) + `17` kutudaki değer (15) + `int` tam sayı tutan tür, etiket (20)', 'üç parçanın üçü de açıklandı (20) + türün neden önemli olduğu: yalnızca tam sayı girer (10)', 'kendi cümleleri ya da benzetme (10) + sıralı, anlaşılır (10)'),
      ['değişken|kutu', 'adı|isim|ismi', 'değer|içindeki|içine koy', 'tür|etiket', 'tam sayı|tamsayı|sayı tutar'],
      "`yas` kutunun adı, yani değişken. `17` kutunun içine koyduğum değer. `int` kutunun etiketi: bu kutuya yalnızca tam sayı girer, `\"on yedi\"` gibi yazı giremez. Tür bu yüzden önemli.",
      "`yas` yaşı gösterir, `17` bir sayı, `int` de bir şey."),
    D_S('1.1-s2', 'Çıktı Tahmini', 'Bu program ne yazdırır? İki satırın neden farklı olduğunu açıkla.', 'string ad = "Ece";\nConsole.WriteLine("Selam {ad}");\nConsole.WriteLine($"Selam {ad}");',
      D_R('1. satır `Selam {ad}` (15) + 2. satır `Selam Ece` (15) + farkın nedeni `$` (20)', 'iki satırın gerekçesi ayrı ayrı (20) + `{ad}`\'ın boşluk olarak doldurulduğu (10)', 'kısa ve ayrım net (20)'),
      ['$|dolar işareti|interpolation|enterpolasyon', '{ad}|süslü parantez|süslü', 'düz metin|olduğu gibi|aynen', 'selam {ad}', 'selam ece', 'değeriyle|değer|dolar|dolu|yerleşir|yerine'],
      "İlk satır `Selam {ad}` yazar, çünkü başında `$` yok; parantez düz metin sayılır. İkinci satırda `$` var, `{ad}` kutunun değeriyle dolar: `Selam Ece`.",
      "İkisi de `Selam Ece` yazar.", { beklenenCikti: 'Selam {ad}\nSelam Ece' }),
    D_S('1.1-s3', 'Hata Avı', 'Derleyici bu programı reddediyor (CS0029). Hatalı satırı bul, nedenini tek cümleyle yaz ve düzelt.', 'int yas = "17";\nConsole.WriteLine(yas);',
      D_R('hatalı satır 1. satır (10) + neden: `int` kutusuna metin (`"17"`) girmez (25) + geçerli düzeltme (15)', 'tür–değer uyumsuzluğunu açıklar (15) + `int yas = 17;` ile `string yas = "17";` arasındaki seçimi söyler (15)', 'neden tek cümle (10) + düzeltilmiş satırı yazar (10)'),
      ['1. satır|birinci satır|ilk satır', 'int|tam sayı', 'tırnak|metin|string', 'tür|kutu|konmuş|uyumsuz|uyuş|uymaz|giremez|girmez|olmaz', 'düzelt|yazarım|olmalı|int yas = 17|string yas'],
      "Hata 1. satırda: `int` kutusuna tırnaklı, yani metin olan `\"17\"` konmuş. Sayı istiyorsam `int yas = 17;`, metin kalacaksa `string yas = \"17\";` yazarım.",
      "`Console.WriteLine` yanlış yazılmış.", { hataliSatir: 1, duzeltme: 'int yas = 17;' })
  ],
  ozet: "`Console.WriteLine` ekrana bir satır duyurur. Değişken = tür (etiket) + ad + değer. `$\"...{ad}...\"` kutunun değerini metne yerleştirir; `$` unutulursa parantez düz metin kalır.",
  gorev: 'meydan-saati'
};

const D_ders12 = {
  id: '1.2', modul: 'M1', baslik: 'Sayılar ve Yuvarlama', semt: 'carsi', tier: 1, xp: 100, dk: 8, usta: 'defne', onKosul: ['1.1'], durum: 'acik',
  hedefler: ['`int`, `double`, `decimal` farkını söyler', 'tam sayı bölmesini (`/`) ve kalanı (`%`) hesaplar', '`(dakika + 59) / 60` ile yukarı yuvarlar'],
  soruTipleri: ['Kavram Sorusu', 'Çıktı Tahmini', 'Hata Avı'], kartXp: 10,
  kartlar: [
    D_K('Tahmin et', 'Başlayan saat kaç?', "130 dakika kalan araç için bu program ne yazar? Üç sayıyı tahmin et: tam saat, artan dakika, başlayan saat. Sonuncuya dikkat; Otopark'ın kasası orada gizli.", {
      kod: D_kod12, dogru: 1, secenekler: [
        { id: 'A', metin: '2 saat 10 dk; başlayan saat: 2', dogru: false },
        { id: 'B', metin: '2 saat 10 dk; başlayan saat: 3', dogru: true },
        { id: 'C', metin: '3 saat 10 dk; başlayan saat: 3', dogru: false }] }),
    D_K('Çalıştır', 'Üçüncü sayıyı yakala', "Çalıştır'a bas: `2 saat 10 dk; başlayan saat: 3`. Üçüncü sayıyı tutturduysan harika. Tutturamadıysan şaşırma; sıradaki iki kart pastayı nasıl kestiğimizi gösterecek.", { kod: D_kod12 }),
    D_K('İncele', 'Pasta dilimi: / ve %', "İki `int`'i bölünce sonuç da `int` olur ve kalan yuvarlanmaz, kesilir: `130 / 60` iki eder. Pastayı dilimlerken artan kırıntıyı `%` verir: `130 % 60` on. Ondalıklı sonuç istiyorsan en az bir tarafı `60.0` yaz.", { kod: 'int tamSaat = dakika / 60;   // 2\nint artanDk = dakika % 60;   // 10' }),
    D_K('İncele', 'Yukarı yuvarlama tarifi', "Yukarı yuvarlamanın tarifi: bölmeden önce 59 ekle. `(130 + 59) / 60` = 189 / 60 = 3. 120 için `179 / 60` = 2: tam iki saat, üçüncü saat başlamadı. Kırıntı bir dakika bile olsa kasa yeni saati yazar.", { kod: 'int baslayanSaat = (dakika + 59) / 60;' }),
    D_K('Değiştir', '61, sonra 120', "`dakika` değerini önce 61, sonra 120 yap. Çalıştırmadan tahmin et: başlayan saat kaç olacak? Sonra bas ve tahminini sına.", { kod: 'int dakika = 130;' }),
    D_K('Yap', 'Dakikadan Saate görevi', "Dakikadan Saate görevinde karışık satırları doğru sıraya dizeceksin. Hasan Abi'nin otoparkı bu hesapla başlıyor; ücret sistemi bu parçasız çalışmaz.", { gorev: 'dakikadan-saate' })
  ],
  ornekKod: D_kod12, ornekCikti: '2 saat 10 dk; başlayan saat: 3',
  dene: { satirNo: 1, baslangic: 'int dakika = 130;', cozum: 'int dakika = 61;', hedefCikti: '1 saat 1 dk; başlayan saat: 2', yonerge: 'Dakikayı 61 yap; başlayan saat 2 çıkmalı.' },
  sorular: [
    D_S('1.2-s1', 'Kavram Sorusu', '`(dakika + 59) / 60` neden başlayan saati verir? 61 ve 120 dakika için kendi cümlelerinle göster.', '',
      D_R('bölmeden önce 59 eklemek kalan 1–59 dakikayı sonraki saate taşır (20) + 61 → 120 / 60 = 2 (15) + 120 → 179 / 60 = 2 (15)', 'tam saatte artmadığını gerekçelendirir (15) + tam sayı bölmesinin kesmesine dayandığını söyler (15)', 'örnekli anlatım (10) + sıralı, anlaşılır (10)'),
      ['59', 'sonraki saat|bir sonraki|yukarı yuvarla|taşı|geçer|fazlalık', 'tam sayı bölmesi|tam sayı|kesme|keser|atar|attığı|küsurat|ondalık', '61', '120|179|tam iki saat|tam saat', 'başlayan|başlamadı|başla'],
      "Bölmeden önce 59 eklersem bir dakikalık fazlalık bile sonraki saate geçer: 61 → 120 / 60 = 2. 120 → 179 / 60 = 2, çünkü tam iki saat; üçüncü başlamadı. Tam sayı bölmesi küsuratı attığı için çalışır.",
      "59 ekleyince yukarı yuvarlıyor."),
    D_S('1.2-s2', 'Çıktı Tahmini', 'Ne yazdırır, neden?', 'int x = 7;\nint y = 2;\nConsole.WriteLine(x / y);',
      D_R('değer `3` (20) + iki `int`\'in bölümü `int` olur (15) + ondalık kısım yuvarlanmaz, atılır (15)', '`7.0 / 2` olsaydı `3.5` çıkacağını söyler (15) + "kesme ≠ yuvarlama" ya da `x % y` = 1 örneği (15)', 'kısa, nedenli (10) + doğru terim (10)'),
      ['3', 'iki int|int bölünce|int olur|sonuç da int|tam sayı bölmesi|int / int', 'atılır|atılıyor|atar|kesilir|keser|yuvarlanmaz|kesme|küsurat|ondalık kısım', 'double|7.0|3.5|3,5|ondalıklı'],
      "`3` yazar. İki `int`'i bölünce sonuç da `int` olur; 3,5'in ondalık kısmı yuvarlanmaz, atılır. `7.0 / 2` yazsaydım bir taraf `double` olacağı için `3.5` çıkardı.",
      "3 yazar, çünkü yuvarlıyor.", { beklenenCikti: '3' }),
    D_S('1.2-s3', 'Hata Avı', 'Ekranda `2.5` beklerken `2` yazıyor. Hatayı bul, nedenini yaz, düzelt.', 'int dakika = 150;\ndouble saat = dakika / 60;\nConsole.WriteLine(saat);',
      D_R('hatalı satır `double saat = dakika / 60;` (10) + bölme `int / int`, `double`\'a atamadan önce kesilir (25) + düzeltme `60.0` ya da `(double)dakika / 60` (15)', '`double` kutu yazmanın bölmeyi değiştirmediğini söyler (15) + beklenen–gerçek farkını (2.5 / 2) açıklar (15)', 'tek net neden (10) + düzeltilmiş satır (10)'),
      ['ikinci satır|2. satır|double saat', 'iki int|int / int|dakika / 60|int bölme|tam sayı bölmesi', 'kesil|atıl|kesme|ondalık|küsurat', '60.0|(double)|double', '2.5|2,5'],
      "Hata ikinci satırda. `dakika / 60` iki `int`'i böldüğü için sonuç `2` olarak kesiliyor; sonra bu `2`, `double` kutusuna giriyor. Bir tarafı `60.0` yaparsam `2.5` çıkar.",
      "`double` yerine `int` yazmalıydım.", { hataliSatir: 2, duzeltme: 'double saat = dakika / 60.0;' })
  ],
  ozet: "`int / int` kalanı keser, `%` kalanı verir. Ondalık sonuç için bir taraf `double` ya da `decimal` olmalı. Başlayan saat: `(dakika + 59) / 60`.",
  gorev: 'dakikadan-saate'
};

const D_ders13 = {
  id: '1.3', modul: 'M1', baslik: 'Kararlar', semt: 'carsi', tier: 1, xp: 100, dk: 8, usta: 'defne', onKosul: ['1.2'], durum: 'acik',
  hedefler: ['karşılaştırma ve `bool` ifadeleri kurar', '`if / else if / else` zincirinde sıranın sonucu değiştirdiğini görür', '`&&`, `||` ve sınır değerlerini (`<` / `<=`) seçer'],
  soruTipleri: ['Kavram Sorusu', 'Çıktı Tahmini', 'Hata Avı'], kartXp: 10,
  kartlar: [
    D_K('Tahmin et', 'Gişede 12 yaşında biri', "Sinema gişesi: 12 yaş altı çocuk, 65 yaş altı tam bilet, gerisi yaşlı bileti. `yas` 12 iken hangi söz çıkar? Tahminini sınır değerine bakarak yap.", {
      kod: D_kod13, dogru: 1, secenekler: [
        { id: 'A', metin: 'Çocuk', dogru: false }, { id: 'B', metin: 'Tam', dogru: true }, { id: 'C', metin: 'Yaşlı', dogru: false }] }),
    D_K('Çalıştır', 'Turnike 12\'yi saymadı', "Çalıştır: `Tam`. Şaşırdıysan tam yerindesin. `yas < 12`, on iki için yanlış, çünkü `<` sınırın kendisini dışarıda bırakır. Gişe turnikesi 12'yi çocuk saymadı.", { kod: D_kod13 }),
    D_K('İncele', 'Turnike dizisi', "`if / else if / else` bir turnike dizisidir: koşullara yukarıdan aşağı sorulur, ilk 'evet' geçirir, kalanlara hiç bakılmaz. Sıra bu yüzden önemli. `==` karşılaştırır, `=` atar; ikisini karıştırma.", { kod: 'if (yas < 12) { /* çocuk */ }\nelse if (yas < 65) { /* tam */ }\nelse { /* yaşlı */ }' }),
    D_K('İncele', '&& ve ||', "`&&` 'hem şu hem bu', `||` 'şu ya da bu' demek. `yas >= 12 && yas < 65` yetişkin aralığını tam çizer. `<` mi `<=` mi diye müşteriye sormak, kodu sonradan onarmaktan ucuzdur.", { kod: 'yas >= 12 && yas < 65' }),
    D_K('Değiştir', '11, 12, 64, 65', "`yas` değerini 11, 12, 64, 65 yap. Her biri için önce tahmin et, sonra çalıştır. Hatalar sınır değerlerinde saklanır; iyi programcı önce oraları yoklar.", { kod: 'int yas = 12;' }),
    D_K('Yap', 'Kademeli Karar görevi', "Kademeli Karar görevinde bilet fiyatını üç kademeye bölen boşlukları dolduracaksın. Aynı şema, Otopark'ın üç tarife diliminde de karşına çıkacak.", { gorev: 'kademeli-karar' })
  ],
  ornekKod: D_kod13, ornekCikti: 'Tam',
  dene: { satirNo: 1, baslangic: 'int yas = 12;', cozum: 'int yas = 11;', hedefCikti: 'Çocuk', yonerge: 'Yaşı 11 yap; hangi dal çalışıyor?' },
  sorular: [
    D_S('1.3-s1', 'Kavram Sorusu', '`yas < 12` ile `yas <= 12` arasındaki fark nedir? 12 yaşındaki biri için hangisinde hangi dal çalışır? Sınır değerini müşteriyle neden konuşmak gerekir?', '',
      D_R('`<` sınırı dışarıda bırakır, `<=` içeri alır (25) + 12 için `<` yanlış, `<=` doğru (25)', 'sınırın hangi kademeye ait olduğunun iş kuralı olduğunu söyler (15) + sınır değerini test etmeyi önerir (15)', '12 örneğiyle anlatır (10) + sıralı, anlaşılır (10)'),
      ['<|küçüktür|saymaz|dışarıda', '<=|küçük eşit|sayar|içeri|dahil', '12|on iki', 'müşteri|iş kuralı|kural|sor', 'test|11|13|sınır', 'kademe|dal|bilet'],
      "`<` 12'yi saymaz, `<=` sayar. 12 yaşındaki biri için `yas < 12` yanlış kalır, çocuk dalına girmez; `<=` ile girer. Hangisinin doğru olduğu müşterinin kuralı; sormazsam yanlış kademede bilet satarım, bu yüzden 11, 12, 13'ü test ederim.",
      "Biri küçük, biri küçük eşit."),
    D_S('1.3-s2', 'Çıktı Tahmini', 'Ne yazdırır? `Parlak` neden hiç yazılmıyor?', 'int puan = 85;\nif (puan >= 50) Console.WriteLine("Geçti");\nelse if (puan >= 85) Console.WriteLine("Parlak");\nelse Console.WriteLine("Kaldı");',
      D_R('çıktı `Geçti` (20) + ilk doğru koşul çalışır, kalanlar atlanır (30)', '`Parlak` dalına hiç ulaşılmadığını söyler (15) + düzeltme: dar koşulu (`>= 85`) öne al (15)', 'nedenli anlatım (10) + doğru terim: koşul, dal (10)'),
      ['geçti', 'ilk doğru|zincir|biter|denenmez|atlanır|bakılmaz', 'else if|koşul', 'parlak|85|erişilemez|ulaşılmaz|hiçbir zaman çıkmaz', 'en üste|öne al|başa|sıra|yukarı taşı'],
      "`Geçti` yazar. `puan >= 50` doğru olduğu için zincir orada biter, `else if` hiç denenmez. `Parlak` hiçbir zaman çıkmaz; `>= 85` koşulunu en üste almak gerekir.",
      "`Parlak` yazar, çünkü 85 en büyük.", { beklenenCikti: 'Geçti' }),
    D_S('1.3-s3', 'Hata Avı', 'Derleyici CS0029 veriyor. Hatayı bul, nedenini yaz, düzelt.', 'int yas = 18;\nif (yas = 18)\n{ Console.WriteLine("Reşit"); }',
      D_R('hatalı satır `if (yas = 18)` (10) + `=` atar, `==` karşılaştırır (25) + düzeltme `yas == 18` ya da `yas >= 18` (15)', '`if` `bool` bekler, atama `int` üretir (15) + iki işaretin farkını örnekler (15)', 'tek net neden (10) + düzeltilmiş satır (10)'),
      ['atama|atar|atıyor|atanıyor', '==|karşılaştır', 'bool|true|false|doğru ya da yanlış', 'if', 'düzelt|yazılır|yazmalı|olmalı|yas == 18|yas >= 18'],
      "`if (yas = 18)` satırında `=` atama yapar ve geriye `int` verir; `if` ise `true` ya da `false` ister. Karşılaştırmak için `yas == 18` yazılır.",
      "Parantez fazla.", { hataliSatir: 2, duzeltme: 'if (yas == 18)' })
  ],
  ozet: "Koşullar yukarıdan aşağı sorulur, ilk doğru dal çalışır. `=` atar, `==` karşılaştırır. Sınır değerinde `<` / `<=` bir iş kuralıdır; müşteriye sor, testle yokla.",
  gorev: 'kademeli-karar'
};

const D_ders14 = {
  id: '1.4', modul: 'M1', baslik: 'Fonksiyon Sözleşmesi', semt: 'carsi', tier: 1, xp: 100, dk: 8, usta: 'defne', onKosul: ['1.3'], durum: 'acik',
  hedefler: ['metot imzasını (dönüş türü, ad, parametre) okur', '`return` ile değer döndürür, yazdırmayla karıştırmaz', 'imzaya ve girdi kuralına uyan metot yazar'],
  soruTipleri: ['Kavram Sorusu', 'Çıktı Tahmini', 'Hata Avı'], kartXp: 10,
  kartlar: [
    D_K('Tahmin et', 'Kare bir tarif kartı', "`Kare` bir tarif kartı: içine bir sayı verirsin, karesini geri alırsın. `Hesap.Kare(5)` ekrana ne yazar? Sınıf ve `static` sözlerini şimdilik tabela say; asıl iş içeride.", {
      kod: D_kod14, dogru: 1, secenekler: [
        { id: 'A', metin: '10', dogru: false }, { id: 'B', metin: '25', dogru: true }, { id: 'C', metin: '55', dogru: false }] }),
    D_K('Çalıştır', 'Tabağa konan 25', "Çalıştır: `25`. Metodu çağırdın, `5` malzeme olarak girdi, `return` ile `25` tabağa konup sana geri geldi. Çağrı artık bir sayı gibi: yazdırabilir, toplayabilir, çarpabilirsin.", { kod: D_kod14 }),
    D_K('İncele', 'İmza dükkânın tabelası', "İmza dükkânın tabelasıdır: `public static int Kare(int x)`. Baştaki `int` geri vereceğin tür, `Kare` tarifin adı, `int x` istenen malzeme. Tabela ne diyorsa o: yanlış malzemeyle çağırırsan derleyici kapıdan çevirir.", { kod: 'public static int Kare(int x)' }),
    D_K('İncele', 'Yazdırmak ≠ geri vermek', "Sözleşme: imza ne istediğini ve ne vereceğini söyler, sen ona uyarsın. `return` değeri teslim eder; `Console.WriteLine` yalnızca ekrana yazar. Yazdırmak vitrine bakmaktır, geri vermek malı teslim almak.", { kod: 'return x * x;' }),
    D_K('Değiştir', 'Küp mü kare mi?', "`return x * x;` satırını `return x * x * x;` yap. Çalıştırmadan tahmin et: `Kare(5)` şimdi kaç verir? Adı yalan söylemeye başladı; iyi isim de sözleşmenin parçasıdır.", { kod: 'return x * x;' }),
    D_K('Yap', 'Taksimetre görevi', "Taksimetre görevinde imzayı ben veriyorum, gövdeyi sen yazacaksın: kilometreyi alıp ücreti geri verecek. İlk sıfırdan kodun; ama dört parçayı biliyorsun: `if`, aritmetik, `return`, imza.", { gorev: 'taksimetre' })
  ],
  ornekKod: D_kod14, ornekCikti: '25',
  dene: { satirNo: 7, baslangic: '        return x * x;', cozum: '        return x * x * x;', hedefCikti: '125', yonerge: '7. satırı değiştir; Kare(5) kaç verir?' },
  sorular: [
    D_S('1.4-s1', 'Kavram Sorusu', "`public static int TaksiUcreti(int km)` imzasındaki parçalar ne iş yapar? 'Sözleşme' derken ne kastediyoruz?", '',
      D_R('`int km` metoda verilen girdi, parametre (15) + baştaki `int` geri verilen değerin türü (15) + `TaksiUcreti` metodun adı (10) + sözleşme = imzanın ve kuralın vaadi (10)', '`return` ile değer geri verilir (10) + girdi kuralı (ör. `km` ≥ 0) sözleşmenin parçasıdır (20)', 'parçaları tek tek anlatır (10) + doğru terimler (10)'),
      ['parametre|girdi', 'dönüş türü|geri ver|döndür|baştaki int|geri dön', 'return', 'adı|ismi|isim|taksiucreti', 'sözleşme|vaat|söz', 'kural|km ≥ 0|km >= 0'],
      "`int km` metodun aldığı girdi, yani parametre. Baştaki `int` geri verdiği değerin türü; `return` ile verir. `TaksiUcreti` adı. Sözleşme: imzaya ve kurala (km ≥ 0) uyarsam metot ücreti tam sayı olarak verir.",
      "İmza metodun adı ve parantezli kısmı."),
    D_S('1.4-s2', 'Çıktı Tahmini', 'Ne yazdırır? Adım adım anlat.', 'Console.WriteLine(Topla(2, 3) * 10);\nstatic int Topla(int a, int b) { return a + b; }',
      D_R('çıktı `50` (20) + `Topla(2, 3)` `5` döndürür (15) + sonra 10 ile çarpılır (15)', 'çağrının bir değere dönüşüp ifadede kullanıldığını söyler (15) + parametre sırası a = 2, b = 3 (15)', 'adımlı anlatım (10) + doğru terim (10)'),
      ['50', 'return|geri ver|döndür|dönüş', '5', 'çarp|10 ile|*|×', 'çağrı|değer gibi|sayı gibi|ifade|önce', 'parametre|a = 2|2, 3|2 ve 3'],
      "`50` yazar. Önce `Topla(2, 3)` çalışır ve `return` ile `5` geri verir; bu `5` artık bir sayı gibi `10` ile çarpılır: 50.",
      "5 yazar, çünkü `Topla` 5 veriyor.", { beklenenCikti: '50' }),
    D_S('1.4-s3', 'Hata Avı', 'Derleyici CS0161 diyor. Sorun ne? Düzelt.', 'public static class Hesap\n{\n    public static int Yari(int x)\n    {\n        Console.WriteLine(x / 2);\n    }\n}',
      D_R('`return` yok (15) + imza `int` vaat ediyor ama gövde değer vermiyor (20) + düzeltme `return x / 2;` (15)', 'yazdırmak ≠ geri vermek (15) + yalnız yazdırılacaksa dönüş türü `void` olur (15)', 'tek net neden (10) + düzeltilmiş satır (10)'),
      ['return', 'int|dönüş türü|imza', 'yazdır|writeline|ekrana', 'geri ver|değer ver|döndür|vermiyor', 'void'],
      "Metot `int` döndüreceğini söylüyor ama `Console.WriteLine` yalnızca ekrana yazıyor, hiçbir değer geri vermiyor. `return x / 2;` yazmalıyım; yalnızca yazdırmak istiyorsam dönüş türü `void` olmalı.",
      "`x / 2` yanlış.", { hataliSatir: 5, duzeltme: 'return x / 2;' })
  ],
  ozet: "İmza = dönüş türü + ad + parametreler; metodun sözleşmesidir. `return` değeri geri verir, `Console.WriteLine` yalnızca yazar. Sözleşmeye uyan metot, çağıranın beklediği türü verir.",
  gorev: 'taksimetre'
};

const D_dersCarsi = [D_ders11, D_ders12, D_ders13, D_ders14];
