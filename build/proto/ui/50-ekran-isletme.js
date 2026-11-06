/* ==== ui/50-ekran-isletme.js — P2 (1/3): ortak yardımcılar (KK_UI.isl) + `sokak` + `is-emri` ====
   Çekirdek döngü: Tapu (300 B; Sev. 3 + Ruhsat 3/3) → İş Emri (en az 4 müşteri sorusu; Keskin Göz) → Editör (50a) → Savunma (50a) → Panel (50b).
   Diğer iki parça `KK_UI.isl` ortak yardımcılarını bu dosyadan alır (dosya sırası: 50 → 50a → 50b). */
(function () {
  /* ---------- sabitler (B5 §3.2, §3.3, §7.1) ---------- */
  const BOLGE = {
    'hemen-cikanlar': 'girip hemen çıkan müşteriler', 'iki-saatten-az': '2 saatten az kalanlar', 'iki-saat-civari': '2 saat civarı kalanlar',
    'iki-alti-arasi': '2–6 saat arası kalanlar', 'alti-saat-civari': '6 saat civarı kalanlar', 'gunluk-tarife': '6–24 saat arası kalanlar',
    'bir-gun-civari': '24 saat civarı kalanlar', 'gunu-asanlar': '24 saati aşanlar'
  };
  const HASAN_ISTEGI = '2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum.';
  const SORULAR_YEREL = [
    { id: 'S1', soru: '1 saat 10 dakika kalan ne öder?', cevap: 'Başlayan saat tam sayılır; 2 saatten az kaldı: 200.', madde: [2, 3] },
    { id: 'S2', soru: 'Tam 2 saat kalan ne öder?', cevap: 'O artık 2–6 dilimi: 2 × 40 = 80.', madde: [2] },
    { id: 'S3', soru: 'Tam 6 saat kalan ne öder?', cevap: 'Hâlâ 2–6 dilimi: 240; 6\'yı geçen güne girer.', madde: [2] },
    { id: 'S4', soru: '24 saati aşan ne öder?', cevap: 'Her başlayan gün 250.', madde: [4] },
    { id: 'S5', soru: 'Girip aynı dakika çıkan ne öder?', cevap: 'Ödemez. Bariyer eksi süre göndermez.', madde: [1] },
    { id: 'S6', soru: 'Süreyi nasıl göndereceksin: dakika mı, saat mi, kesirli mi?', cevap: 'Dakika, tam sayı. Kesir yok.', madde: [1, 5] },
    { id: 'S7', soru: 'Ücret kuruşlu olabilir mi?', cevap: 'TL, tam sayı. Kuruş yok.', madde: [5] },
    { id: 'S8', soru: 'Tam 24 saat kalan ne öder?', cevap: 'Bir gün: 250. Bir dakika fazlası ikinci gün.', madde: [4] }
  ];
  const MADDE_YEREL = [
    { madde: 1, kural: 'Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL.' },
    { madde: 2, kural: 'Dilimi ham kalış süresi belirler: dakika < 120 → 1. dilim; 120 ≤ dakika ≤ 360 → 2. dilim (sınırlar dâhil); dakika > 360 → günlük.' },
    { madde: 3, kural: 'Başlayan saat tam sayılır: saat = ceil(dakika / 60); 1. dilim saat × 100, 2. dilim saat × 40.' },
    { madde: 4, kural: '24 saati aşan kalış: her başlayan gün 250 (gun = ceil(dakika / 1440), gun × 250).' },
    { madde: 5, kural: 'İmza: public static int Otopark.UcretHesapla(int dakika); dönüş TL, tam sayı.' },
    { madde: 6, kural: 'Anomali (119 → 200, 120 → 80) müşterinin bilinçli kararıdır; fark eden oyuncu Keskin Göz (+50 XP).' }
  ];
  const ACAN = { 1: 'S5 · S6', 2: 'S1 · S2 · S3', 3: 'S1', 4: 'S4 · S8', 5: 'iskelet · S6 · S7', 6: 'serbest metin' };
  const ORNEK = { 1: '0 dakika → 0 TL', 2: '119 → 200 TL · 120 → 80 TL · 360 → 240 TL · 361 → 250 TL', 3: '61 dakika → 2 saat → 200 TL', 4: '1.440 → 250 TL · 1.441 → 500 TL', 5: 'public static int UcretHesapla(int dakika)', 6: '119 dakika 200 TL, 120 dakika 80 TL: bilinçli karar' };
  const KG_CEVAP = 'Biliyorum, uzun kalan kazanıyor; açılış kampanyası böyle.';
  const BILMIYORUM = 'Onu bilmiyorum evladım, şunlara bak.';
  const SAAT_MS = 3600000;

  /* ---------- veri erişimi ---------- */
  function veri() { return (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}; }
  function op() { return veri().otopark || {}; }
  function kayit() {
    const o = isletmeKaydi('otopark');
    if (!o.netlestirme) o.netlestirme = { sorulanlar: [], maddeler: [] };
    if (!Array.isArray(o.netlestirme.sorulanlar)) o.netlestirme.sorulanlar = [];
    if (!Array.isArray(o.netlestirme.maddeler)) o.netlestirme.maddeler = [];
    if (!o.testler) o.testler = { acik: [], gizli: [] };
    if (!o.kasa) o.kasa = { bayt: 0, sonTopla: 0 };
    if (!Array.isArray(o.gelir7)) o.gelir7 = [];
    return o;
  }
  function ekran(token, vars) {
    const e = state.ekran[token] || (state.ekran[token] = {});
    Object.keys(vars).forEach(function (k) { if (e[k] === undefined) e[k] = vars[k]; });
    return e;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tarih(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function bugun() { return tarih(new Date()); }
  function hash(s) { s = String(s); let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; }
  function rng(tohum) { let a = tohum >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  /** Türkçe tamlayan eki: Deniz → Deniz'in, Ayşe → Ayşe'nin, Oğuz → Oğuz'un. */
  function iyelik(ad) {
    const s = String(ad || 'Oyuncu').trim() || 'Oyuncu', k = s.toLocaleLowerCase('tr-TR'), unluler = 'aıoueiöü';
    let son = ''; for (let i = k.length - 1; i >= 0; i--) { if (unluler.indexOf(k.charAt(i)) >= 0) { son = k.charAt(i); break; } }
    const ek = !son ? 'i' : ('aı'.indexOf(son) >= 0 ? 'ı' : ('ei'.indexOf(son) >= 0 ? 'i' : ('ou'.indexOf(son) >= 0 ? 'u' : 'ü')));
    return s + "'" + (unluler.indexOf(k.charAt(k.length - 1)) >= 0 ? 'n' : '') + ek + 'n';
  }
  function sorular() {
    const nq = op().netlestirmeSorulari;
    if (Array.isArray(nq) && nq.length === 8 && /1 saat 10/.test(String(nq[0].soru || ''))) {
      return nq.map(function (q, i) { return { id: q.id || ('S' + (i + 1)), soru: q.soru, cevap: q.cevap, madde: [].concat(q.maddeler || (q.madde == null ? [] : q.madde)).map(Number) }; });
    }
    return SORULAR_YEREL;
  }
  function maddeler() {
    const d = op().sozlesme;
    if (Array.isArray(d) && d.length >= 6) return d.map(function (m) { return { madde: Number(m.madde), kural: String(m.kural) }; }).sort(function (a, b) { return a.madde - b.madde; });
    return MADDE_YEREL;
  }
  function sozlesmeMetni() { return maddeler().map(function (m) { return 'Madde ' + m.madde + ': ' + m.kural; }).join('\n'); }
  function hasanIstegi() { const h = op().hasanIstegi; return h && /2 saatten az/.test(h) ? h : HASAN_ISTEGI; }
  function kategori(t) {
    if (t && typeof t === 'object' && BOLGE[t.etiket]) return t.etiket;
    const d = Number(t && typeof t === 'object' ? (t.dakika != null ? t.dakika : t.girdi) : t);
    return d <= 5 ? 'hemen-cikanlar' : d <= 99 ? 'iki-saatten-az' : d <= 140 ? 'iki-saat-civari' : d <= 340 ? 'iki-alti-arasi' : d <= 380 ? 'alti-saat-civari' : d <= 1399 ? 'gunluk-tarife' : d <= 1480 ? 'bir-gun-civari' : 'gunu-asanlar';
  }
  function sikayetMetni(kat, yon) {
    const b = BOLGE[kat] || 'bazı müşteriler';
    if (yon === 'hata') return 'Bariyer ekranı: “' + b + ' için sistem hata verdi.”';
    if (yon === 'eksik') return 'Bir müşteri: “' + b + ' için ücret eksik hesaplanmış.”';
    return 'Bir müşteri: “' + b + ' için fazla ücret ödedim.”';
  }
  function acikTestler() { return (op().publicTestler || []).map(function (t) { return { id: t.id, dakika: t.dakika != null ? t.dakika : t.girdi, beklenen: t.beklenen, etiket: t.etiket }; }); }
  function gizliTestler() { return (op().gizliTestler || []).map(function (t) { return { id: t.id, dakika: t.dakika != null ? t.dakika : t.girdi, beklenen: t.beklenen, etiket: t.etiket }; }); }
  /** 6 tohumlu test (B5 §1.7): oyuncu adı + gün tohumuyla deterministik; beklenen değer referans ücret formülünden. */
  function tohumlu() {
    const r = rng(hash((state.ad || 'oyuncu') + '|' + bugun())), aralik = function (a, b) { return a + Math.floor(r() * (b - a + 1)); }, kacin = function (v, k) { return v % k === 0 ? v + 1 : v; };
    const liste = [['dilim-1-ic', kacin(aralik(7, 112), 60)], ['dilim-2-ic', kacin(aralik(130, 350), 60)], ['gunluk-ic', aralik(381, 1399)], ['cok-gunlu-ic', kacin(aralik(1500, 20000), 1440)], ['saat-siniri', 60 * aralik(3, 5)], ['gun-siniri', 1440 * aralik(2, 12) + 1]];
    return liste.map(function (x, i) { return { id: 't' + (i + 1), katman: x[0], dakika: x[1], beklenen: KK_CORE.otoparkUcret(x[1]), tohumlu: true }; });
  }

  /* ---------- kasa / gelir (B2 §8) ---------- */
  function saatlikGelir(o) {
    const bilgi = (veri().isletmeler || []).filter(function (x) { return x.id === 'otopark'; })[0] || {};
    const temel = Number(bilgi.gelirSaat) || 9.2, carp = Math.pow(1.6, (o.seviye || 1) - 1);
    return temel * carp * (o.durum === 'acik' ? 1 : (o.durum === 'deneme' ? 0.5 : 0));
  }
  function kasaBilgi(o) {
    o = o || kayit();
    const k = o.kasa || (o.kasa = { bayt: 0, sonTopla: 0 }), saatlik = saatlikGelir(o), calisiyor = saatlik > 0, tavanHam = 8 * saatlik;
    const gecen = calisiyor && k.sonTopla ? Math.max(0, (Date.now() - k.sonTopla) / SAAT_MS) : 0;
    const ham = calisiyor ? Math.min(tavanHam, (k.bayt || 0) + saatlik * gecen) : (k.bayt || 0);
    const tavan = Math.floor(tavanHam + 1e-9), deger = Math.floor(ham + 1e-9);
    return { saatlik: saatlik, tavan: tavan, ham: ham, deger: deger, calisiyor: calisiyor, dolu: calisiyor && ham >= tavanHam - 1e-9,
      yuzde: tavanHam > 0 ? Math.round(100 * Math.min(1, ham / tavanHam)) : 0, dolmaSn: calisiyor && ham < tavanHam ? Math.round((tavanHam - ham) / saatlik * 3600) : 0 };
  }
  function kasaSenkron(o) { if (o.kasa && o.kasa.sonTopla) { const b = kasaBilgi(o); o.kasa = { bayt: b.ham, sonTopla: Date.now() }; } }
  async function kasaTopla(kaynak) {
    const o = kayit(), b = kasaBilgi(o);
    if (!b.calisiyor) { toast(o.durum === 'kapali' ? 'İşletmen henüz açılmadı: Savunma sonrası kasa dolmaya başlar.' : (o.durum === 'kararmis' ? 'İşletmen kararmış: önce Müfettişin dosyasına bak.' : 'Kasa yok: önce Tapu.'), 'uyari'); return 0; }
    if (b.deger < 1) { toast('Kasada toplanacak Bayt yok; biraz bekle.', 'bilgi'); return 0; }
    o.kasa = { bayt: b.ham - b.deger, sonTopla: Date.now() }; save();
    await award({ bayt: b.deger, etiket: 'Kasa +' + fmt(b.deger) + ' B', kaynak: kaynak });
    return b.deger;
  }
  function gelirTohumla(o) {
    const TL = [2190, 2250, 2310, 2060, 2440, 2390, 2220], B = [219, 225, 231, 206, 244, 239, 222], c = o.durum === 'deneme' ? 0.5 : 1;
    o.gelir7 = TL.map(function (tl, i) { return { gun: tarih(new Date(Date.now() - (6 - i) * 86400000)), tl: Math.round(tl * c), b: Math.round(B[i] * c), demo: true }; });
  }
  /** İşletmeyi 'acik' ya da 'deneme' olarak açar; kasa/gelir geçmişi örnek veriyle tohumlanır (demo hızlandırması: kasa ≈ 61 B). */
  function isletmeAc(mod) {
    const o = kayit(); kasaSenkron(o);
    o.durum = mod; if (!o.seviye) o.seviye = 1;
    if (!o.kasa.sonTopla) o.kasa = { bayt: 0, sonTopla: Date.now() - 6.65 * SAAT_MS };
    if (!o.gelir7.length) gelirTohumla(o);
    save(); hud(); return o;
  }
  function savunmaKalanSn(o) { const s = o.savunma; if (!s || s.kabul || !s.zaman) return 0; return Math.max(0, Math.round((s.zaman + 86400000 - Date.now()) / 1000)); }

  /* ---------- işletme sahnesi (izometrik SVG; durumlar B1 §6.3) ---------- */
  const SAHNE_ETIKET = { satilik: 'SATILIK', kapali: 'KAPALI', deneme: 'DENEME', acik: 'OTOPARK', kararmis: 'KARARMIŞ' };
  function sahneHtml(durum, o) {
    o = o || {};
    const a = iso.alan(8, 6, { yukari: 138, kenar: 18 }), og = a.orijin, ac = durum === 'acik' || durum === 'deneme', sinema = !!o.sinema;
    const zr = { satilik: ['#2F6B47', '#357850'], kapali: ['#6C5438', '#775C3E'], deneme: ['#2E3662', '#343D6E'], acik: ['#2E3662', '#343D6E'], kararmis: ['#2A3042', '#2F364A'] }[durum] || ['#2E3662', '#343D6E'];
    let alt = iso.zemin(8, 6, zr, { orijin: og, kenar: 'rgba(0,0,0,.16)' });
    for (let gy = 0; gy < 6; gy++) alt += iso.tile(7, gy, durum === 'kararmis' ? '#3A4054' : '#4A5688', { orijin: og, kenar: 'rgba(0,0,0,.2)' });
    if (durum !== 'satilik') {
      let yerler = '';
      [[1, 1], [3, 1], [5, 1], [1, 2], [3, 2], [5, 2], [1, 4], [3, 4], [5, 4], [1, 5], [3, 5], [5, 5]].forEach(function (s) {
        yerler += iso.tile(s[0], s[1], durum === 'kapali' ? '#85694A' : 'rgba(255,255,255,.05)', { w: 2, d: 1, orijin: og, kenar: durum === 'kapali' ? 'rgba(0,0,0,.22)' : 'rgba(210,222,255,.36)' });
      });
      alt += '<g class="sk-yerler' + (sinema ? ' sm-cizgi' : '') + '">' + yerler + '</g>';
    }
    const ogeler = [];
    const ekle = function (tur, gx, gy, opt, sinif) { const m = iso.PROP_META[tur] || { w: 1, d: 1 }; ogeler.push({ gx: gx, gy: gy, w: m.w, d: m.d, svg: (sinif ? '<g class="' + sinif + '">' : '') + iso.prop(tur, gx, gy, Object.assign({ orijin: og }, opt || {})) + (sinif ? '</g>' : '') }); };
    if (ac) [[1, 1, '#FF7A66'], [5, 1, '#7D9BFF'], [3, 2, '#FFBE3D'], [1, 4, '#45D98D'], [3, 5, '#9B86FF'], [5, 4, '#22C9CE']].forEach(function (c) { ekle('araba', c[0], c[1], { renk: c[2] }, sinema ? 'sm-araba' : ''); });
    ekle('tabela', 1, 0, { etiket: SAHNE_ETIKET[durum] || 'OTOPARK' }, 'sk-tabela' + (durum === 'deneme' ? ' sk-titre' : '') + (durum === 'kararmis' ? ' sk-sonuk' : ''));
    if (durum === 'acik' || sinema) ekle('led-pano', 4, 0, { etiket: 'OTOPARK AÇIK' }, sinema ? 'sm-led' : '');
    if (durum !== 'satilik') ekle('bariyer', 6, 3, { acik: ac }, sinema ? 'sm-bariyer' : '');
    if (ac || durum === 'kararmis') ekle('kasa', 7, 1, { dolu: !!o.kasaDolu }, 'sk-kasa' + (sinema ? ' sm-kasa' : ''));
    if (durum === 'kapali') ekle('vinc', 4, 4, {});
    ekle('lamba', 0, 3, { acik: ac }); ekle('lamba', 7, 5, { acik: ac });
    ekle('agac', 0, 5, {}); if (durum !== 'acik') ekle('agac', 7, 0, {});
    if (durum === 'satilik') ekle('bayrak', 3, 3, { renk: '#3F6FE0' });
    let ust = '';
    if (durum === 'kapali' || sinema) {
      const p = function (gx, gy) { const q = iso.xy(gx, gy, 0, og); return (Math.round(q.x * 10) / 10) + ',' + (Math.round((q.y - 16) * 10) / 10); };
      const cizgi = [p(0, 0), p(8, 0), p(8, 6), p(0, 6), p(0, 0)].join(' ');
      ust += '<g class="sk-bant' + (sinema ? ' sm-bant' : '') + '" aria-hidden="true"><polyline points="' + cizgi + '" fill="none" stroke="#F5C518" stroke-width="7" stroke-linejoin="round"/><polyline points="' + cizgi + '" fill="none" stroke="#14182B" stroke-width="7" stroke-dasharray="9 9" stroke-linejoin="round"/></g>';
    }
    if (durum === 'acik' && !sinema) {
      ust += '<g class="sk-gezen" aria-hidden="true">' + iso.prop('araba', 0, 3, { orijin: og, renk: '#FFD27A' }) + '</g>';
    }
    const aria = { satilik: 'Boş parsel: SATILIK tabelası', kapali: 'Otopark parseli: inşaat bandı, yazılım bekliyor', deneme: 'Otopark: Deneme modunda, tabela yarım yanıyor', acik: 'Otopark açık: bariyer kalkık, arabalar park ediyor', kararmis: 'Otopark kararmış: ışıklar sönük' }[durum] || 'Otopark';
    const konum = function (gx, gy, z) { const q = iso.xy(gx, gy, 0, og); return 'left:' + (100 * q.x / a.genislik).toFixed(1) + '%;top:' + (100 * (q.y - (z || 0)) / a.yukseklik).toFixed(1) + '%'; };
    let ek = '';
    if (o.etkin) {
      if (ac && o.kasaBtn) ek += '<button type="button" class="sk-kasa-btn' + (o.kasaDolu ? ' dolu' : '') + '" style="' + konum(7.5, 1.5, 70) + '" data-action="kasaTopla" aria-label="' + esc(o.kasaBtn) + '">' + ikon('coin', 30) + '</button>';
      if (durum === 'kapali') ek += '<button type="button" class="sk-kodla" style="' + konum(3.5, 3, 40) + '" data-go="' + (o.kodlaHedef || 'is-emri') + '" aria-label="KODLA! ' + (o.kodlaHedef === 'editor' ? 'Editörü aç' : 'İş emrini aç') + '">KODLA! ' + ikon('ok-asagi', 22) + '</button>';
    }
    if (durum === 'kararmis') ek += '<span class="sk-mufettis" aria-hidden="true">' + ustaSvg('mufettis', { boyut: 96 }) + '</span>';
    return '<div class="sk-sahne' + (sinema ? ' sinema' : '') + (o.donus ? ' sk-donus' : '') + '"><svg class="sk-svg" viewBox="' + a.viewBox + '" role="img" aria-label="' + esc(aria) + '" preserveAspectRatio="xMidYMax meet">' + alt + iso.sirala(ogeler) + ust + '</svg>' + ek + '</div>';
  }

  KK_UI.isl = { BOLGE: BOLGE, ACAN: ACAN, ORNEK: ORNEK, KG_CEVAP: KG_CEVAP, veri: veri, op: op, kayit: kayit, ekran: ekran, bugun: bugun, tarih: tarih, hash: hash, rng: rng, iyelik: iyelik, sorular: sorular, maddeler: maddeler,
    sozlesmeMetni: sozlesmeMetni, hasanIstegi: hasanIstegi, kategori: kategori, sikayetMetni: sikayetMetni, acikTestler: acikTestler, gizliTestler: gizliTestler, tohumlu: tohumlu, saatlikGelir: saatlikGelir,
    kasaBilgi: kasaBilgi, kasaSenkron: kasaSenkron, kasaTopla: kasaTopla, gelirTohumla: gelirTohumla, isletmeAc: isletmeAc, savunmaKalanSn: savunmaKalanSn, sahneHtml: sahneHtml };

  /* ---------- ortak küçük parçalar ---------- */
  KK_UI.isl.vaultHtml = function (o, b) { return vaultHtml(o, b); };
  function vaultHtml(o, b) {
    let seg = ''; for (let i = 0; i < 4; i++) seg += '<i class="vg-seg" style="--p:' + Math.max(0, Math.min(100, (b.yuzde - i * 25) * 4)) + '%"></i>';
    const durumYazi = !b.calisiyor ? 'Kasa kapalı: işletme açılınca dolmaya başlar.' : (b.dolu ? 'Kasa dolu: üretim durdu, kayıp yok.' : 'Dolmasına ' + zamanKalan(b.dolmaSn) + ' · saatte ' + fmt(b.saatlik, 1) + ' B');
    return '<div class="vg-ust"><span class="vg-ik' + (b.dolu ? ' zipla' : '') + '">' + ikon('kasa', 30) + '</span><div><div class="vg-sayi"><b>' + fmt(b.deger) + '</b> / ' + fmt(b.tavan) + ' B</div><div class="mini soluk">' + esc(durumYazi) + '</div></div></div>' +
      '<div class="vg" role="img" aria-label="Kasa doluluğu yüzde ' + b.yuzde + '">' + seg + '</div>';
  }
  function tapuSartlari() {
    const sv = seviyeBilgi().seviye, r = (state.ruhsat && state.ruhsat.otopark) || 0, b = state.bayt || 0;
    return [
      { ok: sv >= 3, etiket: 'Seviye 3', durum: 'Sev. ' + sv + '/3', neden: 'Sev. 3 gerekir; şu an Sev. ' + sv + '.' },
      { ok: r >= 3, etiket: 'Ruhsat 3/3', durum: 'Ruhsat ' + r + '/3', neden: 'Ruhsat 3/3 gerekir; şu an ' + r + '/3 (Atölye\'deki Ruhsat görevlerini bitir).' },
      { ok: b >= 300, etiket: '300 B', durum: fmt(b) + ' B', neden: fmt(300 - b) + ' B daha gerekir: Atölye görevleri ve Günlük Tekrar (+20 B) Bayt kazandırır.' }
    ];
  }
  function geriBtn(hedef, ad) { return '<button type="button" class="btn btn-hayalet btn-kucuk" data-go="' + hedef + '">' + ikon('ok-sol', 18) + esc(ad) + '</button>'; }

  /* ================= SOKAK ================= */
  KK_UI.screen('sokak', {
    ad: 'İşletme Sokağı', hud: true,
    render(root, ctx) {
      try {
        const o = kayit(), ek = ekran('sokak', { gorunum: 'sahip', alkisGun: '', alkis: 0, haberGun: '', donus: 0 });
        const d = (o.durum === 'yok' || !o.durum) ? 'satilik' : o.durum, sahip = ek.gorunum !== 'ziyaret', ad = state.ad || 'Deniz', sv = seviyeBilgi();
        const b = kasaBilgi(o), donus = ek.donus && Date.now() - ek.donus < 2600, cevrimdisi = typeof navigator !== 'undefined' && navigator.onLine === false;
        const editorHazir = o.netlestirme.sorulanlar.length >= 4;
        const sahne = sahneHtml(d, { etkin: sahip, kasaDolu: b.dolu, kasaBtn: 'Kasa: ' + b.deger + ' / ' + b.tavan + ' B. Topla', donus: donus, kodlaHedef: editorHazir ? 'editor' : 'is-emri' });
        const sart = tapuSartlari(), sartTamam = sart.every(function (x) { return x.ok; });
        const tabelaYazi = d === 'satilik' ? 'SATILIK — Belediye' : '@' + iyelik(ad) + ' Otoparkı';
        const kalan = savunmaKalanSn(o), bugunSatir = (d === 'acik' || d === 'deneme') ? (function () { const c = d === 'deneme' ? 0.5 : 1; return '12 araç · ' + fmt(Math.round(2220 * c)) + ' TL · ' + fmt(Math.round(220 * c)) + ' B'; })() : '—';
        const bilgi = '<section class="kart sk-bilgi" aria-label="İşletme bilgisi"><h2 class="kart-baslik">' + ikon('bina', 22) + 'Otopark</h2>' +
          '<div class="sk-tabela-yazi">' + esc(tabelaYazi) + '</div>' + (d === 'satilik' ? '' : '<div class="mini soluk">Yazılım: @' + esc(ad) + ' · ' + esc(sv.unvan) + ' Sev. ' + sv.seviye + '</div>') +
          '<dl class="sk-dl"><dt>Adres</dt><dd>Çarşı · Tente Sokak No: 3</dd><dt>Durum</dt><dd>' + isletmeDurumHtml(d === 'satilik' ? 'satilik' : d) + '</dd>' +
          (sahip && d !== 'satilik' ? '<dt>Seviye</dt><dd>L' + (o.seviye || 1) + ' / 5</dd><dt>Bugün</dt><dd>' + esc(bugunSatir) + '</dd>' : '') +
          (sahip && d === 'deneme' ? '<dt>Savunma</dt><dd>' + (kalan > 0 ? 'Yeni hak ' + zamanKalan(kalan) + ' sonra' : 'Yeni Savunma hakkın hazır') + '</dd>' : '') + '</dl></section>';
        const sikayet = (function () {
          if (!sahip || (d !== 'deneme' && d !== 'kararmis')) return '';
          const m = state.ekran.editor && state.ekran.editor.muf, balon = m && m.balonlar && m.balonlar[0] ? m.balonlar[0].metin : sikayetMetni('alti-saat-civari', 'fazla');
          return '<div class="sk-sikayet" role="status">' + ikon('uyari', 20) + '<span>' + esc(balon) + '</span></div>';
        })();
        let kasaKart = '';
        if (sahip && d !== 'satilik') kasaKart = '<section class="kart sk-kasa-kart" aria-label="Kasa">' + vaultHtml(o, b) + '<div class="kart-alt"><button type="button" class="btn btn-altin btn-kucuk" data-action="kasaTopla"' + (b.calisiyor && b.deger >= 1 ? '' : ' aria-disabled="true"') + '>' + ikon('coin', 18) + 'Kasayı Topla' + (b.calisiyor ? ' (' + fmt(b.deger) + ' B)' : '') + '</button></div>' + (cevrimdisi ? '<p class="mini soluk">Çevrimdışı — kasa bilgisi güncel olmayabilir.</p>' : '') + '</section>';
        /* birincil eylem (durum tablosu: B8 §6.10) */
        let eylem = '';
        if (sahip) {
          if (d === 'satilik') {
            eylem = '<p class="sk-not">Bu parsel boş. SATILIK — Belediye.</p><ul class="liste sk-sartlar">' + sart.map(function (x) { return '<li class="sk-sart ' + (x.ok ? 'tamam' : 'eksik') + '">' + ikon(x.ok ? 'tik' : 'kilit', 18) + '<span><b>' + esc(x.etiket) + '</b> · ' + esc(x.durum) + (x.ok ? '' : '<small>' + esc(x.neden) + '</small>') + '</span></li>'; }).join('') + '</ul>' +
              '<button type="button" class="btn btn-birincil btn-buyuk btn-blok" data-action="tapuAl"' + (sartTamam ? '' : ' aria-disabled="true" aria-describedby="sk-neden"') + '>' + ikon('anahtar', 22) + 'Tapuyu Al (300 B)</button>' +
              (sartTamam ? '' : '<p class="mini soluk" id="sk-neden">' + esc(sart.filter(function (x) { return !x.ok; }).map(function (x) { return x.neden; }).join(' ')) + '</p>') + (!sart[1].ok ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-go="atolye">' + ikon('kalem', 18) + 'Atölye\'ye git</button>' : '');
          } else if (d === 'kapali') {
            eylem = '<p class="sk-not">' + (editorHazir ? 'Müşteriye sorular tamam. Sıra kodda.' : 'Kod yazmadan önce Hasan Abi\'ye en az 4 soru sor.') + '</p>' +
              '<button type="button" class="btn btn-birincil btn-buyuk btn-blok" data-go="' + (editorHazir ? 'editor' : 'is-emri') + '">' + ikon(editorHazir ? 'kod' : 'defter', 22) + (editorHazir ? 'Editörü Aç' : 'İş Emrini Aç') + '</button>' +
              (editorHazir ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-go="is-emri">' + ikon('defter', 18) + 'İş Emrine Dön</button>' : '');
          } else if (d === 'deneme') {
            eylem = '<p class="sk-not">Deneme modu: gelir %50. Gizli testleri geçersen Savunma ile tam Açılış\'a ulaşırsın.</p><button type="button" class="btn btn-altin btn-buyuk btn-blok" data-action="kasaTopla">' + ikon('coin', 22) + 'Kasayı Topla (' + fmt(b.deger) + ' B)</button>' +
              '<button type="button" class="btn btn-hayalet btn-kucuk" data-go="editor">' + ikon('kod', 18) + 'Editöre Dön</button>';
          } else if (d === 'acik') {
            eylem = '<p class="sk-not">Otopark açık: bariyer kalkık, ilk arabalar giriyor.</p><button type="button" class="btn btn-altin btn-buyuk btn-blok" data-action="kasaTopla">' + ikon('coin', 22) + 'Kasayı Topla (' + fmt(b.deger) + ' B)</button>' +
              '<button type="button" class="btn btn-hayalet btn-kucuk" data-go="panel">' + ikon('liste', 18) + 'İşletme Paneli</button>';
          } else {
            eylem = '<p class="sk-not">İşletmen kararmış. Müfettiş kapıda, kırmızı dosyayla bekliyor.</p><button type="button" class="btn btn-tehlike btn-buyuk btn-blok" data-go="editor">' + ikon('goz', 22) + 'Müfettişin Dosyasına Bak</button>';
          }
        } else {
          if (d === 'satilik') eylem = '<p class="sk-not">SATILIK — Belediye. Bu parsel henüz kimsenin değil.</p><button type="button" class="btn btn-hayalet btn-blok" data-action="tapuBilgisi">' + ikon('bilgi', 20) + 'Tapu Bilgisi</button>';
          else if (d === 'kapali') eylem = '<p class="sk-not">Sarı-siyah bant: sahibi yazılımı bekliyor. Kasa yok.</p>';
          else if (d === 'kararmis') eylem = '<p class="sk-not">Gri tabela, sönük ışıklar. Alkış kapalı.</p><button type="button" class="btn btn-hayalet btn-blok" data-action="haberVer">' + ikon('mektup', 20) + 'Sahibine Haber Ver</button>';
          else eylem = '<p class="sk-not">' + (d === 'deneme' ? 'DENEME bandı oturmuş; sahibi hâlâ çalışıyor.' : 'Açık işletme: ' + esc(iyelik(ad)) + ' Otoparkı.') + '</p><button type="button" class="btn btn-altin btn-buyuk btn-blok" data-action="alkis">' + ikon('kutlama', 22) + 'Alkışla' + (d === 'acik' ? ' (sahibine 2 B)' : '') + '</button>' +
            (ek.alkis ? '<p class="mini soluk">Toplam alkışın: ' + ek.alkis + ' (günde 1)</p>' : '');
        }
        const eylemKart = '<section class="kart sk-eylem" aria-label="Sıradaki adım"><h2 class="kart-baslik">' + ikon('hedef', 22) + (sahip ? 'Sıradaki adım' : 'Ziyaretçi') + '</h2>' + eylem + '</section>';
        const secenek = function (v, ad2) { return '<option value="' + v + '"' + (d === v ? ' selected' : '') + '>' + ad2 + '</option>'; };
        root.innerHTML = '<div class="sayfa sayfa-genis sk"><div class="sayfa-baslik"><h1>İşletme Sokağı</h1><span class="chip chip-gri">' + ikon('harita', 14) + 'Çarşı · Tente Sokak No: 3</span>' +
          '<div class="sekmeler sk-gorunum" role="group" aria-label="Görünüm"><button type="button" class="sekme' + (sahip ? ' aktif' : '') + '" aria-pressed="' + sahip + '" data-action="gorunum" data-g="sahip">Sahibi</button><button type="button" class="sekme' + (!sahip ? ' aktif' : '') + '" aria-pressed="' + !sahip + '" data-action="gorunum" data-g="ziyaret">Ziyaretçi</button></div></div>' +
          (!sahip ? '<p class="sk-turist" role="status">' + ikon('bilgi', 18) + 'Turist modundasın: arsa alamazsın, Alkış verebilirsin.</p>' : '') +
          '<div class="sk-izgara"><div class="sk-sahne-kap">' + sahne + sikayet + '</div><div class="sk-yan">' + bilgi + kasaKart + eylemKart + '</div></div>' +
          '<div class="sk-demo"><label class="etiket" for="sk-demo-durum">Demo: işletme durumunu önizle</label><select id="sk-demo-durum" class="girdi" data-input="demoDurum">' + secenek('satilik', 'Satılık (tapu öncesi)') + secenek('kapali', 'Kapalı — yazılım bekliyor') + secenek('deneme', 'Deneme (%50 gelir)') + secenek('acik', 'Açık') + secenek('kararmis', 'Kararmış') + '</select></div></div>';
      } catch (e) {
        KK_UI.hataKaydet(e, 'sokak');
        root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('İşletme bilgisi alınamadı.', { tekrar: 'yenile', tekrarAd: 'Tekrar Dene' }) + '</div>';
      }
    },
    actions: {
      yenile() { refresh(); },
      gorunum(el) { const ek = ekran('sokak', {}); ek.gorunum = el.getAttribute('data-g') === 'ziyaret' ? 'ziyaret' : 'sahip'; save(); refresh(); },
      tapuBilgisi() {
        modal({ baslik: 'Tapu Bilgisi', html: '<p><b>Otopark</b> · Çarşı · Tente Sokak No: 3</p><p>SATILIK — Belediye. Fiyat <b>300 B</b>; alıcıda Seviye 3 ve Ruhsat 3/3 aranır.</p><p class="soluk">Turist modunda arsa alınamaz.</p>', butonlar: [{ ad: 'Tamam', birincil: true }] });
      },
      async tapuAl(el) {
        const sart = tapuSartlari(); if (!sart.every(function (x) { return x.ok; })) { toast(sart.filter(function (x) { return !x.ok; })[0].neden, 'uyari'); return; }
        const evet = await onayla('Otopark tapusunu 300 B\'ye alıyorsun. Cüzdan: ' + fmt(state.bayt) + ' B → ' + fmt(state.bayt - 300) + ' B.', 'Tapuyu Al', 'Vazgeç');
        if (!evet) return;
        if (!harca({ bayt: 300, etiket: 'Otopark tapusu', kaynak: el })) return;
        const o = kayit(); o.durum = 'kapali'; o.seviye = 1; ekran('sokak', {}).donus = Date.now(); save(); hud();
        toast('Tapu senin! Çim kalktı, bant çekildi: sıra yazılımda.', 'basari'); refresh();
      },
      async kasaTopla(el) { const n = await kasaTopla(el); if (n) refresh(); },
      alkis() {
        const ek = ekran('sokak', {}); if (ek.alkisGun === bugun()) { toast('Bugünkü alkışını verdin; yarın yine gel.', 'bilgi'); return; }
        ek.alkisGun = bugun(); ek.alkis = (ek.alkis || 0) + 1; save(); toast('Alkışladın! Sahibine 2 B gider (günlük 40 B tavan).', 'basari'); refresh();
      },
      haberVer() { const ek = ekran('sokak', {}); if (ek.haberGun === bugun()) { toast('Bugün zaten haber verdin.', 'bilgi'); return; } ek.haberGun = bugun(); save(); toast('Haber verdin.', 'basari'); },
      demoDurum(el) {
        const v = el.value, o = kayit(); kasaSenkron(o);
        if (v === 'acik' || v === 'deneme') { isletmeAc(v); } else { o.durum = v === 'satilik' ? 'yok' : v; if (v === 'kararmis') { o.kasa = o.kasa || { bayt: 0, sonTopla: 0 }; } }
        save(); hud(); refresh();
      }
    },
    async selftest(root, ctx) {
      if (!root.querySelector('[data-action="tapuAl"][aria-disabled="true"]')) throw new Error('Ruhsat 2/3 iken Tapuyu Al devre dışı olmalı');
      if (!/Ruhsat 3\/3 gerekir/.test(root.textContent)) throw new Error('Eksik şartın nedeni söylenmedi');
      await ctx.bekle(300); KK_UI.modalTemizle(); state.ruhsat.otopark = 3; state.bayt = 500; save(); refresh();
      await ctx.tikla('[data-action="tapuAl"]'); await ctx.tikla('[data-veri="onayla-evet"]');
      await ctx.bekleSecici('[data-go="is-emri"]', 3000);
      const o = state.isletmeler.otopark; if (o.durum !== 'kapali') throw new Error('Tapu sonrası durum kapalı olmalı, şu an: ' + o.durum);
      if (state.bayt < 200 || state.bayt > 280) throw new Error('Tapu 300 B düşmeliydi (500 → 200); bakiye ' + state.bayt); /* 280: önceki ekranın geç gelen +80 B ödülü olabilir */
      for (const v of ['deneme', 'acik', 'kararmis', 'satilik']) { const s = root.querySelector('#sk-demo-durum'); await ctx.yaz(s, v); await ctx.bekle(30); if (!root.querySelector('.sk-svg')) throw new Error('Sahne çizilmedi: ' + v); }
    }
  });

  /* ================= İŞ EMRİ ================= */
  function siniflandir(metin, qs) {
    const t = String(metin || '').toLocaleLowerCase('tr-TR').replace(/(\d)\.(\d{3})/g, '$1$2');
    if ((/\b119\b/.test(t) && /\b120\b/.test(t)) || /(uzun (kal|dur)\w*.*(az|ucuz|düşük)|daha (az|ucuz) öde|fiyat\w* düş|neden .*(ucuz|az öde))/.test(t)) return 'KG';
    const esle = [[7, /tam 24 saat|\b1440\b/], [3, /24 saati? aş|\b1441\b|iki gün|günlük|birden fazla gün/], [2, /tam 6 saat|\b360\b|altı saat/], [1, /tam 2 saat|\b120\b|iki saat/], [0, /1 saat 10|yuvarla|başlayan|\b61\b|\b70 dakika|saat say/],
      [4, /aynı dakika|hemen çık|\b0 dakika|sıfır|negatif|eksi/], [5, /dakika mı|saat mi|kesirli|girdi|nasıl gönder|\bint\b/], [6, /kuruş|ondalık|virgül|tam sayı mı/]];
    for (let i = 0; i < esle.length; i++) if (esle[i][1].test(t)) return qs[esle[i][0]] ? qs[esle[i][0]].id : null;
    return null;
  }
  function isLogHtml(ek, qs) {
    const b = function (m, tur, ad) { return balonHtml(m, { tur: tur, ad: ad }); };
    let s = '';
    (ek.kayit || []).forEach(function (k) {
      const q = qs.filter(function (x) { return x.id === k.id; })[0];
      s += '<div class="ie-mesaj ben">' + b(k.tip === 'hazir' && q ? q.soru : k.metin, 'ben', state.ad || 'Sen') + '</div>';
      s += '<div class="ie-mesaj">' + b(k.id === 'KG' ? KG_CEVAP : (q ? q.cevap : BILMIYORUM), 'usta', 'Hasan Abi') + '</div>';
      if (k.id === 'KG') s += '<div class="ie-mesaj">' + b('Keskin Göz rozeti kazandın, +50 XP. Sözleşme Kartı\'na madde 6 yazıldı.', 'sistem') + '</div>';
      if (k.id === null) s += '<div class="ie-hizli">' + qs.filter(function (x) { return (state.isletmeler.otopark.netlestirme.sorulanlar || []).indexOf(x.id) < 0; }).slice(0, 3).map(function (x) { return '<button type="button" class="chip chip-turkuaz ie-chip-btn" data-action="sor" data-id="' + esc(x.id) + '">' + esc(x.soru) + '</button>'; }).join('') + '</div>';
    });
    if (ek.bekleyen) s += '<div class="ie-mesaj ben">' + b(ek.bekleyen.metin, 'ben', state.ad || 'Sen') + '</div><div class="ie-mesaj"><div class="balon balon-usta"><div class="balon-ad">Hasan Abi</div><span class="yaziyor" aria-label="Hasan Abi yazıyor"><i></i><i></i><i></i></span></div></div>';
    return s || '<p class="soluk ie-bos">Henüz soru sormadın. Hasan Abi dinliyor.</p>';
  }
  function isMaddeHtml(o, ek, mm) {
    const acik = o.netlestirme.maddeler, yeni = ek.yeni || [];
    return '<ol class="liste ie-maddeler">' + mm.map(function (m) {
      const a = acik.indexOf(m.madde) >= 0;
      return '<li><button type="button" class="ie-madde' + (a ? ' acik' : ' soluk') + (yeni.indexOf(m.madde) >= 0 ? ' muhurlu' : '') + '" data-action="maddeAc" data-madde="' + m.madde + '" aria-label="Madde ' + m.madde + (a ? ', netleşti' : ', henüz sorulmadı') + '"><span class="ie-madde-no">' + (a ? ikon('muhur', 18) : m.madde) + '</span><span class="ie-madde-ic"><b>Madde ' + m.madde + (a ? ' · netleşti' : '') + '</b>' +
        '<span class="ie-madde-kural">' + esc(a ? m.kural : 'Bu madde için müşteriye sormadın.') + '</span></span></button></li>';
    }).join('') + '</ol>';
  }
  KK_UI.screen('is-emri', {
    ad: 'İş Emri', hud: true,
    render(root, ctx) {
      try {
        const o = kayit(), ek = ekran('is-emri', { sekme: 'sor', kayit: [], bekleyen: null, yeni: [], vurgu: 0 }), qs = sorular(), mm = maddeler(), ad = state.ad || 'Deniz';
        if (o.durum === 'yok' || o.durum === 'satilik' || !o.durum) {
          const s = tapuSartlari().filter(function (x) { return !x.ok; });
          root.innerHTML = '<div class="sayfa sayfa-dar"><div class="sayfa-baslik">' + geriBtn('sokak', 'Sokak') + '<h1>İş Emri</h1></div>' + bosHtml({ ikon: 'kilit', baslik: 'İş emri tapu alınınca gelir', metin: 'Hasan Abi, Otopark\'un sahibine iş emrini verir. ' + (s.length ? 'Henüz eksik: ' + s.map(function (x) { return x.neden; }).join(' ') : 'Tapu için İşletme Sokağı\'na git.'), buton: { ad: 'İşletme Sokağı\'na git', aksiyon: 'sokagaGit', sinif: 'btn-birincil' } }) + '</div>';
          return;
        }
        const n = o.netlestirme.sorulanlar.length, hazir = n >= 4, sorulan = o.netlestirme.sorulanlar, bekleniyor = !!ek.bekleyen;
        const defne = n === 0 ? 'Müşteriye sormadan kod yazan, iki kere yazar, ' + ad + '. Hasan Abi\'ye en az dört soru sor; cevaplar Sözleşme Kartı\'na yazılacak.' :
          (o.keskinGoz ? 'Müşterinin kararına saygı duy; ama soruyu sorman doğruydu. ' : '') + (hazir ? 'Güzel sorular, ' + ad + '. Şimdi kod zamanı.' : 'İyi gidiyorsun, ' + ad + '. ' + (4 - n) + ' soru daha; sınır ve yuvarlama yerlerini düşün.');
        const soruKartlari = qs.map(function (q) {
          const sor = sorulan.indexOf(q.id) >= 0;
          return '<li><button type="button" class="ie-soru' + (sor ? ' soruldu' : '') + '" data-action="sor" data-id="' + esc(q.id) + '"' + (sor || bekleniyor ? ' aria-disabled="true"' : '') + '><span class="ie-soru-no">' + esc(q.id) + '</span><span class="ie-soru-metin">' + esc(q.soru) + '</span>' + (sor ? chipHtml('soruldu', 'nane', 'tik') : ikon('ok-sag', 18)) + '</button></li>';
        }).join('');
        const emir = hasanIstegi().split(/\.\s+/).map(function (c) { return '<span class="ie-kural' + (ek.vurgu ? ' vurgulu' : '') + '">' + esc(c.replace(/\.$/, '') + '.') + '</span>'; }).join(' ');
        root.innerHTML = '<div class="sayfa sayfa-genis ie ie-sek-' + (ek.sekme === 'soz' ? 'soz' : 'sor') + '"><div class="sayfa-baslik">' + geriBtn('sokak', 'Sokak') + '<h1>İş Emri #1 — Otopark</h1>' + chipHtml('Müşteri: Hasan Abi', 'amber', 'kullanici') + (o.keskinGoz ? chipHtml('Keskin Göz', 'mor', 'goz') : '') + '</div>' +
          (typeof navigator !== 'undefined' && navigator.onLine === false ? '<p class="sk-turist" role="status">' + ikon('bilgi', 18) + 'Çevrimdışısın. İş emrini okuyabilirsin; soru sormak için bağlantı gerekiyor.</p>' : '') +
          '<div class="ie-izgara"><div class="ie-sol yigin"><section class="kart ie-hasan" aria-label="Hasan Abi"><div class="diyalog"><div class="diyalog-portre"><span class="portre">' + ustaSvg('hasan', { boyut: 84, aria: 'Hasan Abi' }) + '</span><b>Hasan Abi</b></div><div class="yigin-s" style="flex:1 1 auto;min-width:0">' +
          balonHtml('İş emri bu evladım. Aklına takılan olursa sor.', { tur: 'usta', kuyruk: true, ad: 'Hasan Abi' }) + '</div></div>' +
          '<blockquote class="ie-emir" id="ie-emir" aria-label="Hasan Abi\'nin iş emri">' + emir + '</blockquote><div class="ie-emir-alt"><button type="button" class="btn-baglanti" data-action="oku">' + ikon('goz', 16) + ' İş emrini tekrar oku</button></div>' +
          '<div class="ie-log" id="ie-log" role="log" aria-live="polite" aria-label="Konuşma kaydı">' + isLogHtml(ek, qs) + '</div></section>' +
          '<section class="kart ie-defne" aria-label="Usta Defne"><div class="diyalog"><div class="diyalog-portre"><span class="portre">' + ustaSvg('defne', { boyut: 64, aria: 'Usta Defne' }) + '</span><b>Usta Defne</b></div>' + balonHtml(defne, { tur: 'usta', kuyruk: true }) + '</div></section></div>' +
          '<div class="sekmeler ie-sekmeler" role="tablist" aria-label="Bölüm"><button type="button" role="tab" class="sekme' + (ek.sekme !== 'soz' ? ' aktif' : '') + '" aria-selected="' + (ek.sekme !== 'soz') + '" data-action="sekme" data-s="sor">' + ikon('sohbet', 18) + 'Sor</button><button type="button" role="tab" class="sekme' + (ek.sekme === 'soz' ? ' aktif' : '') + '" aria-selected="' + (ek.sekme === 'soz') + '" data-action="sekme" data-s="soz">' + ikon('defter', 18) + 'Sözleşme' + (ek.yeni && ek.yeni.length ? '<span class="ie-nokta" aria-label="yeni madde"></span>' : '') + '</button></div>' +
          '<section class="kart ie-sor" aria-label="Müşteriye Sor"><h2 class="kart-baslik">' + ikon('sohbet', 22) + 'Müşteriye Sor</h2><p class="mini soluk">8 hazır soru; her soru bir kez sorulur, her cevap Sözleşme Kartı\'na bir madde yazar.</p><ul class="liste ie-sorular">' + soruKartlari + '</ul>' +
          '<form class="ie-serbest" data-submit="serbestSor"><label class="etiket" for="ie-serbest">Kendi sorunu yaz</label><textarea id="ie-serbest" class="girdi" rows="2" maxlength="140" placeholder="Örn. “Süre hangi birimde gelecek?”" data-input="sayac"' + (bekleniyor ? ' disabled' : '') + '></textarea>' +
          '<div class="sira"><span class="mini soluk" id="ie-sayac" aria-live="polite">0/140</span><button type="submit" class="btn btn-mor btn-kucuk"' + (bekleniyor ? ' aria-disabled="true"' : '') + '>' + ikon('gonder', 18) + 'Sor</button></div></form></section>' +
          '<div class="ie-sag yigin"><section class="kart ie-soz" aria-label="Sözleşme Kartı"><h2 class="kart-baslik">' + ikon('defter', 22) + 'Sözleşme Kartı</h2>' + isMaddeHtml(o, ek, mm) + '<p class="mini soluk">Soluk maddeler, müşteriye sormadığın yerlerdir; gizli testler tam orada kırılır.</p></section>' +
          '<div class="kart ie-eylem"><div class="ie-say" aria-live="polite"><b>' + Math.min(n, 99) + '</b>/4 soru</div>' + (hazir ? '<button type="button" class="btn btn-birincil btn-buyuk ie-gec" data-action="kodlamayaGec">' + ikon('kod', 22) + 'Kodlamaya Geç</button>' :
            '<button type="button" class="btn btn-birincil btn-buyuk ie-gec" aria-disabled="true" aria-describedby="ie-kilit">' + ikon('kilit', 22) + 'Kodlamaya Geç</button><p class="mini soluk" id="ie-kilit">Önce Hasan Abi\'ye en az 4 soru sor (' + n + '/4).</p>') + '</div></div></div></div>';
        ek.yeni = []; if (ek.vurgu) { ek.vurgu = 0; KK_UI.gecikme(function () { const e = document.getElementById('ie-emir'); if (e) $$('.ie-kural', e).forEach(function (x) { x.classList.remove('vurgulu'); }); }, 1200); }
        const lg = document.getElementById('ie-log'); if (lg) lg.scrollTop = lg.scrollHeight;
      } catch (e) {
        KK_UI.hataKaydet(e, 'is-emri');
        root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Hasan Abi şu an cevap veremiyor.', { tekrar: 'yenile', tekrarAd: 'Tekrar Dene' }) + '</div>';
      }
    },
    actions: {
      yenile() { refresh(); },
      sokagaGit() { go('sokak'); },
      sekme(el) { const ek = ekran('is-emri', {}); ek.sekme = el.getAttribute('data-s') === 'soz' ? 'soz' : 'sor'; if (ek.sekme === 'soz') ek.yeni = []; save(); refresh(); },
      oku() { const ek = ekran('is-emri', {}); ek.vurgu = 1; refresh(); },
      sayac(el) { const s = document.getElementById('ie-sayac'); if (s) s.textContent = (el.value || '').length + '/140'; },
      maddeAc(el) {
        const no = Number(el.getAttribute('data-madde')), o = kayit(), m = maddeler().filter(function (x) { return x.madde === no; })[0], a = o.netlestirme.maddeler.indexOf(no) >= 0;
        modal({ baslik: 'Madde ' + no, html: '<p>' + esc(a ? m.kural : 'Bu madde için müşteriye sormadın.') + '</p><p class="mini soluk">Açan sorular: <b>' + esc(ACAN[no] || '—') + '</b></p>' + (a ? '<p class="kod-ic">Örnek: ' + esc(ORNEK[no] || '') + '</p>' : '<p class="mini soluk">Müşteriye bu soruları sorarsan madde kartta parlar.</p>'), butonlar: [{ ad: 'Tamam', birincil: true }] });
      },
      async sor(el) {
        const id = el.getAttribute('data-id'), o = kayit(), ek = ekran('is-emri', {}), qs = sorular(), q = qs.filter(function (x) { return x.id === id; })[0];
        if (!q || ek.bekleyen || o.netlestirme.sorulanlar.indexOf(id) >= 0) return;
        ek.bekleyen = { metin: q.soru }; refresh(); await bekle(600);
        o.netlestirme.sorulanlar.push(id); q.madde.forEach(function (m) { if (o.netlestirme.maddeler.indexOf(m) < 0) { o.netlestirme.maddeler.push(m); ek.yeni.push(m); } });
        ek.kayit.push({ tip: 'hazir', id: id }); ek.bekleyen = null; save(); refresh();
        if (o.netlestirme.sorulanlar.length === 4) toast('Dört soru tamam: Kodlamaya Geç açıldı.', 'basari');
      },
      async serbestSor(form) {
        const ta = form.querySelector('#ie-serbest'), metin = ((ta && ta.value) || '').trim().slice(0, 140), o = kayit(), ek = ekran('is-emri', {}), qs = sorular();
        if (!metin) { toast('Önce bir soru yaz.', 'uyari'); return; } if (ek.bekleyen) return;
        const sonuc = siniflandir(metin, qs);
        ek.bekleyen = { metin: metin }; refresh(); await bekle(600);
        if (sonuc === 'KG') {
          if (o.durum === 'kapali' && !o.keskinGoz) { o.keskinGoz = true; if (state.rozetler.indexOf('keskin-goz') < 0) state.rozetler.push('keskin-goz'); }
          if (o.netlestirme.sorulanlar.indexOf('KG') < 0) o.netlestirme.sorulanlar.push('KG');
          if (o.netlestirme.maddeler.indexOf(6) < 0) { o.netlestirme.maddeler.push(6); ek.yeni.push(6); }
          ek.kayit.push({ tip: 'serbest', id: 'KG', metin: metin }); ek.bekleyen = null; save(); refresh();
          if (!ek.kgOdul && o.keskinGoz) { ek.kgOdul = true; save(); toast('Keskin Göz rozeti kazandın, +50 XP.', 'basari'); await award({ xp: 50, etiket: 'Keskin Göz' }); }
          return;
        }
        if (sonuc && o.netlestirme.sorulanlar.indexOf(sonuc) < 0) {
          const q = qs.filter(function (x) { return x.id === sonuc; })[0];
          o.netlestirme.sorulanlar.push(sonuc); q.madde.forEach(function (m) { if (o.netlestirme.maddeler.indexOf(m) < 0) { o.netlestirme.maddeler.push(m); ek.yeni.push(m); } });
        }
        ek.kayit.push({ tip: 'serbest', id: sonuc || null, metin: metin }); ek.bekleyen = null; save(); refresh();
      },
      kodlamayaGec() { go('editor'); }
    },
    async selftest(root, ctx) {
      const o = state.isletmeler.otopark; o.durum = 'kapali'; save(); refresh();
      if (root.querySelector('.ie-gec[aria-disabled="true"]') === null) throw new Error('4 soru öncesinde Kodlamaya Geç kilitli olmalı');
      for (const q of sorular().slice(0, 3)) { await ctx.tikla('.ie-soru[data-id="' + q.id + '"]'); await ctx.bekleSecici('.ie-soru[data-id="' + q.id + '"].soruldu', 3000); }
      if (!root.querySelector('.ie-gec[aria-disabled="true"]')) throw new Error('3 soruda hâlâ kilitli olmalı');
      await ctx.yaz('#ie-serbest', '119 dakika 200 TL ama 120 dakika 80 TL, bu doğru mu?'); await ctx.tikla('.ie-serbest button[type="submit"]');
      await ctx.bekleSecici('.ie-gec:not([aria-disabled="true"])', 3000);
      if (!o.keskinGoz || state.rozetler.indexOf('keskin-goz') < 0) throw new Error('Keskin Göz rozeti verilmedi');
      if (o.netlestirme.maddeler.indexOf(6) < 0) throw new Error('Madde 6 Sözleşme Kartı\'na yazılmadı');
      if (!/Biliyorum, uzun kalan kazanıyor/.test(root.textContent)) throw new Error('Hasan Abi\'nin Keskin Göz cevabı görünmedi');
      KK_UI.modalTemizle(); if (state.xp < 390) throw new Error('Keskin Göz +50 XP işlenmedi (xp ' + state.xp + ')');
      await ctx.tikla('.ie-gec'); if (ctx.gidilen() !== 'editor') throw new Error('Kodlamaya Geç editöre gitmedi');
    }
  });
})();
