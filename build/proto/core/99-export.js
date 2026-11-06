/* ==== core/99-export.js — KK_CORE (P4). Birleştirici core/98-stub.js'i bu dosya varken atlar. Formüller 00-formul.js'tedir (yeniden yazılmaz). ====
   DATA: semtler(7) · ustalar(7 Usta + hasan, mufettis, kurul) · moduller(11) · dersler(100: Çarşı 1.1–1.4 TAM, 96 iskelet) · gorevler · otopark · isletmeler(20) · magaza · liderlik · tekrar · sohbet · rozetler · metinler · seviyeHediyeleri. */

/** Ders listesi: 22-data-dersler-liste.js iskeleti (100 ders) + 20-data-dersler.js TAM içeriği (Çarşı 1.1–1.4; tam içerik iskelet alanlarının üzerine yazar). */
const D_dersler = (function () {
  const tam = {};
  D_dersCarsi.forEach(function (d) { tam[d.id] = d; });
  return D_dersListe.map(function (iskelet) {
    const t = tam[iskelet.id];
    if (t) return Object.assign({}, iskelet, t, { iskelet: false });
    const g = D_gorevler.filter(function (x) { return x.dersId === iskelet.id; })[0];
    if (g) iskelet.gorev = g.id;
    return iskelet;
  });
})();

const D_DATA = {
  semtler: D_semtler, ustalar: D_ustalar, moduller: D_moduller, dersler: D_dersler, gorevler: D_gorevler, otopark: D_otopark, isletmeler: D_isletmeler,
  magaza: D_magaza, liderlik: D_liderlik, tekrar: D_tekrar, sohbet: D_sohbet, rozetler: D_rozetler, metinler: D_metinler, seviyeHediyeleri: D_seviyeHediyeleri
};

const KK_CORE = {
  DATA: D_DATA,
  xpGereken: xpGereken, xpToplam: xpToplam, seviyeHesapla: seviyeHesapla, unvan: unvan, otoparkUcret: otoparkUcret, xpHesapla: xpHesapla,
  cevrimdisiPuanla: cevrimdisiPuanla, sezgiselTest: sezgiselTest, gorevTestEt: gorevTestEt, savunmaDegerlendir: savunmaDegerlendir, kodIncele: kodIncele,
  /* eklentiler: Müfettiş şikâyet balonları ve oyuncuya özel tohumlu testler */
  sikayetKategorisi: sikayetKategorisi, sikayetMetni: sikayetMetni, tohumluTestler: tohumluTestler
};
