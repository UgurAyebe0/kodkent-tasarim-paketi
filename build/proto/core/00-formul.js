/* ==== core/00-formul.js — çekirdek formüller (saf, DOM'suz). KANON §3.1–3.3 ve §5.1. P4'ün core/99-export.js'i bunları KK_CORE'a bağlar; yeniden yazmaz. ==== */

/** En yakın 10'a yuvarlar (KANON XP eğrisi). */
function yuvarla10(n) { return Math.round(n / 10) * 10; }

/** KANON XP(L) = yuvarla10(80 × L^1,35): L seviyesinden L+1'e geçmek için gereken XP (1→80, 2→200, 3→350 …). L 1–60 aralığına sıkıştırılır. */
function xpGereken(L) {
  L = Math.max(1, Math.min(60, Math.floor(Number(L) || 1)));
  return yuvarla10(80 * Math.pow(L, 1.35));
}

/** KANON Toplam(L) = Σ XP(k), k = 1..L−1: L seviyesine ulaşmak için biriken toplam XP. */
function xpToplam(L) {
  L = Math.max(1, Math.min(60, Math.floor(Number(L) || 1)));
  let t = 0;
  for (let k = 1; k < L; k++) t += xpGereken(k);
  return t;
}

/** Toplam XP'den seviye durumu: { seviye (1–60), kalan (bu seviyede kazanılan XP), gereken (xpGereken(seviye); 60'ta 0), toplamBaslangic (bu seviyenin başlangıç toplamı) }. */
function seviyeHesapla(toplamXp) {
  let kalan = Math.max(0, Math.floor(Number(toplamXp) || 0));
  let L = 1, bas = 0;
  while (L < 60) {
    const g = xpGereken(L);
    if (kalan < g) break;
    kalan -= g; bas += g; L++;
  }
  return { seviye: L, kalan, gereken: L >= 60 ? 0 : xpGereken(L), toplamBaslangic: bas };
}

/** KANON §3.1 unvan bantları. */
function unvan(seviye) {
  const s = Math.floor(Number(seviye) || 1);
  if (s >= 60) return 'Efsane';
  if (s >= 40) return 'Şehir Mimarı';
  if (s >= 32) return 'Mimar';
  if (s >= 25) return 'Baş Mühendis';
  if (s >= 18) return 'Mühendis';
  if (s >= 12) return 'Zanaatkâr';
  if (s >= 6) return 'Kalfa';
  return 'Çırak';
}

/** KANON §5.1 referans otopark ücreti (TL, tam sayı): <120 dk başlayan saat × 100; 120–360 dk (dâhil) başlayan saat × 40; sonrası başlayan gün × 250. */
function otoparkUcret(dakika) {
  const d = Math.floor(Number(dakika) || 0);
  if (d <= 0) return 0;
  if (d < 120) return Math.ceil(d / 60) * 100;
  if (d <= 360) return Math.ceil(d / 60) * 40;
  return Math.ceil(d / 1440) * 250;
}

/**
 * KANON §3.3 soru XP'si: taban × puan/100; ≥70'te en az %50; 85+ ×1,2; 2. deneme ×0,8; ipuçsuz (Berrak Zihin) +%15; denediyse (puan > 0) en az 5.
 * Örnek: xpHesapla({ taban: 30, puan: 90 }) → 32. Görev XP'si için kullanılmaz (görev ödülü sabittir).
 */
function xpHesapla(o) {
  const g = o || {};
  const taban = Number(g.taban) || 30;
  const puan = Math.max(0, Math.min(100, Math.round(Number(g.puan) || 0)));
  if (puan <= 0) return 0;
  let xp = taban * puan / 100;
  if (puan >= 70) xp = Math.max(xp, taban * 0.5);
  if (puan >= 85) xp *= 1.2;
  if ((Number(g.deneme) || 1) >= 2) xp *= 0.8;
  if (g.ipucusuz) xp *= 1.15;
  return Math.max(5, Math.round(xp));
}
