/* ==== ui/60-ekran-sosyal.js — P3 (1/4): paylaşılan sosyal/ekonomi yardımcıları (KK_UI.sosyal) + Pazar ====
   Diğer parçalar (60a: Oda+Dolap, 60b: Profil+Liderlik, 60c: Sohbet+Ayarlar) bu yardımcıları KK_UI.sosyal üzerinden kullanır.
   Çekirdek döngü: Pazar'dan ürün al → Bayt düşer → state.envanter → Dolap'ta giy (state.avatar + state.giyili) → Oda'ya yerleştir (state.oda.esyalar).
   Çip: yalnızca kozmetik; XP/Bayt/ipucu satın aldırmaz. 15–17 yaş: Çip limiti 0 (KANON §12.2) → "Çip kapalı". */
(function () {
  const S = {};
  KK_UI.sosyal = S;
  const veri = function () { return (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}; };
  const urunler = function () { return veri().magaza || []; };
  const OZEL = [{ id: 'seri-dondurucu', ad: 'Seri Dondurucu', kategori: 'tuketim', nadirlik: 'Sıradan', fiyat: 50, para: 'bayt', onizleme: { tur: 'ikon', anahtar: 'kar' }, ozel: true }];
  const urunBul = function (id) { return urunler().filter(function (u) { return u.id === id; })[0] || OZEL.filter(function (u) { return u.id === id; })[0] || null; };
  const NAD = { 'Sıradan': 'nad-siradan', 'Şık': 'nad-sik', 'Nadir': 'nad-nadir', 'Premium': 'nad-premium', 'Nişan': 'nad-nisan' };
  const NAD_SIRA = { 'Sıradan': 0, 'Şık': 1, 'Nadir': 2, 'Premium': 3, 'Nişan': 4 };
  const NAD_CHIP = { 'Sıradan': 'gri', 'Şık': 'kobalt', 'Nadir': 'mor', 'Premium': 'turkuaz', 'Nişan': 'amber' };
  const KAT_AD = { kiyafet: 'Kıyafet', aksesuar: 'Aksesuar', emote: 'Emote', esya: 'Oda eşyası', tabela: 'Tabela', oda: 'Oda teması', tuketim: 'Kalıcı kalem' };
  const SLOT_AD = { bas: 'Baş', yuz: 'Yüz', kulak: 'Kulak', boyun: 'Boyun', yaka: 'Yaka' };
  const AKS_SLOT = { sapka: 'bas', bere: 'bas', kasket: 'bas', baret: 'bas', kaptan: 'bas', gozluk: 'yuz', kulaklik: 'kulak', kolye: 'boyun', rozet: 'yaka' };
  const NISAN_ESLE = { 'keskin-goz-nisan': 'keskin-goz', 'otopark-kupasi': 'otopark-ustasi', 'derleyici-dansi': 'ilk-acilis' };
  const NISAN_NASIL = { 'otopark-kupasi': 'Gizli testlerin tamamını ilk 3 denemede geç (Otopark Ustası).', 'keskin-goz-nisan': "İş Emri'nde 119 ve 120 dakika arasındaki fiyat farkını müşteriye sor.", 'derleyici-dansi': "İlk işletmeni aç: Savunma'yı geç ve Açılış yap." };
  const SERBEST_EMOTE = [{ id: 'el-salla', ad: 'El Salla' }, { id: 'alkisla', ad: 'Alkışla' }, { id: 'gul', ad: 'Gül' }, { id: 'dusun', ad: 'Düşün' }, { id: 'evet', ad: 'Evet' }, { id: 'hayir', ad: 'Hayır' }];
  Object.assign(S, { veri: veri, urunler: urunler, urunBul: urunBul, NAD: NAD, NAD_CHIP: NAD_CHIP, NAD_SIRA: NAD_SIRA, KAT_AD: KAT_AD, SLOT_AD: SLOT_AD, AKS_SLOT: AKS_SLOT, NISAN_ESLE: NISAN_ESLE, NISAN_NASIL: NISAN_NASIL, SERBEST_EMOTE: SERBEST_EMOTE });

  /* ---------- genel yardımcılar ---------- */
  const seviye = function () { return seviyeBilgi().seviye; };
  S.seviye = seviye;
  S.hash = function (s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  S.rozetIdler = function () { return (state.rozetler || []).map(function (r) { return typeof r === 'string' ? r : (r && r.id); }).filter(Boolean); };
  S.yas = function () { const y = Number(state.dogumYili) || 0; return y ? new Date().getFullYear() - y : 0; };
  S.yasBandi = function () { const a = S.yas(); if (!a) return 'yetiskin'; return a < 15 ? 'kucuk' : a < 18 ? 'genc' : 'yetiskin'; };
  S.veliDurumu = function () { return (state.veli && state.veli.durum) || 'yok'; };
  S.cipKapali = function () { return S.yasBandi() === 'genc' && !(state.veli && Number(state.veli.cipLimit) > 0); };
  S.gunAnahtari = function () { const d = new Date(Date.now() - 4 * 3600000); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  /** Bir sonraki haftanın günü+saati (gun: 0 Pazar … 6 Cumartesi, yerel saat) → Date. */
  S.sonraki = function (gun, saat) {
    const n = new Date(), t = new Date(n.getFullYear(), n.getMonth(), n.getDate(), saat, 0, 0, 0);
    t.setDate(t.getDate() + ((gun - n.getDay() + 7) % 7));
    if (t.getTime() <= n.getTime()) t.setDate(t.getDate() + 7);
    return t;
  };
  S.kalanMetin = function (t) { return zamanKalan(Math.max(0, Math.round((t.getTime() - Date.now()) / 1000))); };
  S.saatMetni = function () { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  S.kaydet = function (hataMesaji) { const ok = save(); if (!ok) toast(hataMesaji || 'Kaydedilemedi. Değişikliğin bu oturumda saklandı.', 'uyari'); return ok; };

  /* ---------- ürün sınıflandırma ---------- */
  const aksAnahtar = function (u) { return (u && u.onizleme && u.onizleme.anahtar) || ''; };
  S.altTur = function (u) {
    if (!u || !u.onizleme) return 'prop';
    if (u.onizleme.tur === 'prop') return 'prop';
    if (u.onizleme.tur !== 'avatar') return 'ikon';
    const a = aksAnahtar(u);
    if (/^kiyafet-\d$/.test(a)) return 'kiyafet';
    if (/^emote-/.test(a)) return 'emote';
    return 'aksesuar';
  };
  S.nisanKazanildi = function (u) { const r = u && NISAN_ESLE[u.id]; return !!(r && S.rozetIdler().indexOf(r) >= 0); };
  S.sahip = function (id) { if (state.envanter.indexOf(id) >= 0) return true; const u = urunBul(id); return !!(u && u.nadirlik === 'Nişan' && S.nisanKazanildi(u)); };
  S.minSev = function (u) { if (u.nadirlik === 'Nişan') return 0; if (u.id === 'cirak-sapkasi' || u.ozel) return 1; if (u.nadirlik === 'Nadir') return 5; if (u.nadirlik === 'Premium') return 1; return 3; };
  S.kilit = function (u) { const m = S.minSev(u); return seviye() < m ? 'Sev. ' + m + ' gerekiyor' : null; };
  S.katYazi = function (u) {
    const t = S.altTur(u);
    if (t === 'aksesuar') return 'Aksesuar · ' + (SLOT_AD[AKS_SLOT[aksAnahtar(u)]] || 'Takı');
    return KAT_AD[u.kategori] || KAT_AD[t] || '';
  };
  S.fiyatHtml = function (u) { return u.para === 'cip' ? ikon('chip', 16) + '<b>' + fmt(u.fiyat) + '</b> Çip' : ikon('coin', 16) + '<b>' + fmt(u.fiyat) + '</b> B'; };

  /* ---------- giyim (Dolap ile Pazar ortak) ---------- */
  S.giyiliDurum = function () {
    const g = state.giyili;
    if (!Array.isArray(g.aksesuarlar)) g.aksesuarlar = [];
    if (!('kiyafet' in g)) g.kiyafet = null;
    if (!Array.isArray(g.emote)) g.emote = [];
    return g;
  };
  S.avBaz = function () { return JSON.parse(JSON.stringify(Object.assign({ ten: 0, sacStil: 0, sacRenk: 0, kiyafet: 0, aksesuar: [] }, state.avatar))); };
  S.giyiliMi = function (id) { const g = S.giyiliDurum(); return g.kiyafet === id || g.aksesuarlar.indexOf(id) >= 0; };
  S.giy = function (u) {
    const g = S.giyiliDurum(), t = S.altTur(u), a = aksAnahtar(u);
    if (t === 'kiyafet') {
      const m = /^kiyafet-(\d)$/.exec(a); if (!m) return false;
      if (g.kiyafet == null) g.temelKiyafet = Number(state.avatar.kiyafet) || 0;
      g.kiyafet = u.id; state.avatar.kiyafet = Number(m[1]);
    } else if (t === 'aksesuar') {
      const slot = AKS_SLOT[a] || a;
      g.aksesuarlar = g.aksesuarlar.filter(function (pid) { const x = urunBul(pid); return !x || (AKS_SLOT[aksAnahtar(x)] || aksAnahtar(x)) !== slot; });
      state.avatar.aksesuar = (state.avatar.aksesuar || []).filter(function (id) { return (AKS_SLOT[id] || id) !== slot; });
      g.aksesuarlar.push(u.id); state.avatar.aksesuar.push(a);
      g.aksesuar = g.aksesuarlar[0];
    } else return false;
    S.kaydet(); hud(); return true;
  };
  S.cikar = function (u) {
    const g = S.giyiliDurum(), t = S.altTur(u), a = aksAnahtar(u);
    if (t === 'kiyafet') { g.kiyafet = null; if (typeof g.temelKiyafet === 'number') state.avatar.kiyafet = g.temelKiyafet; }
    else if (t === 'aksesuar') { g.aksesuarlar = g.aksesuarlar.filter(function (p) { return p !== u.id; }); state.avatar.aksesuar = (state.avatar.aksesuar || []).filter(function (id) { return id !== a; }); g.aksesuar = g.aksesuarlar[0] || null; }
    else return false;
    S.kaydet(); hud(); return true;
  };
  /** Önizleme avatarı: ürün giydirilmiş kopya (kaydedilmez). → { av, emote } */
  S.onizAvatar = function (u) {
    const av = S.avBaz(); if (!u) return { av: av, emote: '' };
    const t = S.altTur(u), a = aksAnahtar(u);
    if (t === 'kiyafet') { const m = /^kiyafet-(\d)$/.exec(a); if (m) av.kiyafet = Number(m[1]); }
    else if (t === 'aksesuar') { const slot = AKS_SLOT[a] || a; av.aksesuar = (av.aksesuar || []).filter(function (id) { return (AKS_SLOT[id] || id) !== slot; }); av.aksesuar.push(a); }
    return { av: av, emote: t === 'emote' ? a.slice(6) : '' };
  };
  S.onizHtml = function (u, boyut) {
    try {
      if (u.onizleme && u.onizleme.tur === 'ikon') return ikon(u.onizleme.anahtar, Math.round((boyut || 92) * 0.55));
      const taban = S.avBaz(); taban.aksesuar = [];
      return onizleSvg(u.onizleme, { boyut: boyut || 92, av: taban, aria: u.ad });
    } catch (e) { return ''; }
  };
  /** Ürün kartı (Pazar, Dolap, Oda envanteri). o: { eylem, secili, alt (html), kilitli, aria, boyut, sinif } */
  S.kart = function (u, o) {
    o = o || {};
    return '<button type="button" class="urun ' + (NAD[u.nadirlik] || 'nad-siradan') + (o.secili ? ' urun-secili' : '') + (o.sinif ? ' ' + o.sinif : '') + '" data-action="' + esc(o.eylem) + '" data-urun="' + esc(u.id) + '" aria-pressed="' + (o.secili ? 'true' : 'false') + '" aria-label="' + esc(o.aria || u.ad) + '">' +
      '<span class="urun-on' + (o.kilitli ? ' urun-kilitli' : '') + '">' + S.onizHtml(u, o.boyut || 88) + '</span>' +
      '<span class="urun-nad nad-etiket">' + esc(u.nadirlik) + '</span><span class="urun-ad">' + esc(u.ad) + '</span><span class="urun-kat">' + esc(S.katYazi(u)) + '</span>' +
      '<span class="urun-alt">' + (o.alt || '') + '</span></button>';
  };
  S.nadRozet = function (u) { return chipHtml(u.nadirlik, NAD_CHIP[u.nadirlik] || 'gri'); };
  S.iskeletKartlar = function (n) { let s = ''; for (let i = 0; i < n; i++) s += '<span class="iskelet" style="height:208px"></span>'; return s; };

  /* ================= PAZAR ================= */
  const PZ = { sekme: 'bayt', kat: 'hepsi', sec: null };
  const KAT_CHIP = [['hepsi', 'Hepsi'], ['kiyafet', 'Kıyafet'], ['aksesuar', 'Aksesuar'], ['emote', 'Emote'], ['oda', 'Oda ve eşya']];
  const PAKETLER = [
    { id: 'avuc', ad: 'Avuç', cip: 100, tl: '59,99', bonus: '', veli: false },
    { id: 'kutu', ad: 'Kutu', cip: 260, tl: '149,99', bonus: '+%4', veli: false },
    { id: 'sandik', ad: 'Sandık', cip: 560, tl: '299,99', bonus: '+%12', veli: true },
    { id: 'konteyner', ad: 'Konteyner', cip: 1200, tl: '599,99', bonus: '+%20', veli: true }
  ];
  const katUyar = function (u, k) { if (k === 'hepsi') return true; if (k === 'oda') return /^(esya|oda|tabela)$/.test(u.kategori); return u.kategori === k; };
  function rafUrunleri() {
    const L = urunler();
    if (PZ.sekme === 'bayt') return L.filter(function (u) { return u.para === 'bayt' && u.nadirlik !== 'Nişan'; });
    if (PZ.sekme === 'butik') return L.filter(function (u) { return u.para === 'cip' || u.nadirlik === 'Premium'; });
    return L.filter(function (u) { return u.nadirlik === 'Nişan'; });
  }
  function seriNo(u) { return String(10 + (S.hash(u.id) % 190)).padStart(3, '0') + '/200'; }
  function nisanIlerleme(rozetId) {
    const o = isletmeKaydi('otopark');
    switch (rozetId) {
      case 'ruhsat': return Math.min(100, Math.round(100 * (state.ruhsat.otopark || 0) / 3));
      case 'seri-7': return Math.min(100, Math.round(100 * (state.tekrar.seri || 0) / 7));
      case 'keskin-goz': return o.keskinGoz ? 100 : 0;
      case 'ilk-acilis': return o.durum === 'acik' ? 100 : 0;
      default: return 0;
    }
  }
  function pzDurum(u) {
    if (u.nadirlik === 'Nişan') return S.nisanKazanildi(u) ? { alt: '<span class="urun-durum nane">' + ikon('test-gecti', 16) + 'Kazanıldı</span>' } : { alt: '<span class="urun-durum altin">' + ikon('muhur', 16) + 'KAZANILIR</span>' };
    if (u.ozel) { const st = state.tekrar.dondurma || 0; return st >= 2 ? { alt: '<span class="urun-durum nane">' + ikon('test-gecti', 16) + 'Stok dolu 2/2</span>' } : { alt: '<span class="urun-fiyat">' + S.fiyatHtml(u) + '</span>' }; }
    if (S.sahip(u.id)) return { alt: '<span class="urun-durum nane">' + ikon('test-gecti', 16) + 'Sende var</span>' };
    const k = S.kilit(u); if (k) return { alt: '<span class="urun-durum gri">' + ikon('kilit', 16) + esc(k) + '</span>', kilitli: true };
    if (u.para === 'cip' && S.cipKapali()) return { alt: '<span class="urun-durum mercan">' + ikon('kilit', 16) + 'Çip kapalı</span>', kilitli: true };
    const bak = u.para === 'cip' ? state.cip : state.bayt;
    if (bak < u.fiyat) return { alt: '<span class="urun-fiyat yetersiz">' + S.fiyatHtml(u) + '</span><span class="urun-eksik">' + fmt(u.fiyat - bak) + (u.para === 'cip' ? ' Çip' : ' B') + ' eksik</span>' };
    return { alt: '<span class="urun-fiyat">' + S.fiyatHtml(u) + '</span>' };
  }
  function pzAria(u, d) {
    const fiy = u.nadirlik === 'Nişan' ? 'yalnızca kazanılır' : fmt(u.fiyat) + (u.para === 'cip' ? ' Çip' : ' Bayt');
    const dur = S.sahip(u.id) ? 'sende var' : (S.kilit(u) || ((u.para === 'cip' ? state.cip : state.bayt) < u.fiyat ? 'bakiye yetersiz' : 'yeterli bakiye var'));
    return u.ad + ', ' + u.nadirlik + ', ' + S.katYazi(u) + ', ' + fiy + ', ' + dur;
  }
  function pzKart(u) {
    const d = pzDurum(u);
    return S.kart(u, { eylem: 'pz-sec', secili: PZ.sec === u.id, alt: d.alt, kilitli: d.kilitli, aria: pzAria(u, d) });
  }
  function pzRaf() {
    let L = rafUrunleri().filter(function (u) { return katUyar(u, PZ.kat); });
    L.sort(function (a, b) { return (NAD_SIRA[a.nadirlik] - NAD_SIRA[b.nadirlik]) || (a.fiyat - b.fiyat); });
    let govde = '';
    if (PZ.sekme === 'bayt') {
      ['Sıradan', 'Şık', 'Nadir'].forEach(function (n) {
        const alt = L.filter(function (u) { return u.nadirlik === n; }); if (!alt.length) return;
        const baslik = n === 'Nadir' ? 'Nadir raf · 6 slot, haftalık rotasyon' : n + ' raf';
        const kilitNot = n === 'Nadir' && seviye() < 5 ? '<p class="pz-not">' + ikon('kilit', 16) + 'Nadir raf Sev. 5\'te açılır; şu an Sev. ' + seviye() + '. Kilit hiçbir zaman Bayt ya da Çip ile açılmaz.</p>' : '';
        govde += '<section class="pz-raf ' + NAD[n] + '" aria-label="' + esc(baslik) + '"><h2 class="pz-raf-ad">' + S.nadRozet({ nadirlik: n }) + '<span>' + esc(baslik) + '</span></h2>' + kilitNot + '<div class="pz-izgara">' + alt.map(function (u) { return u.nadirlik === 'Nadir' ? pzKart(u).replace('<span class="urun-kat">', '<span class="urun-kat">No. ' + seriNo(u) + ' · ') : pzKart(u); }).join('') + '</div></section>';
      });
      if (PZ.kat === 'hepsi') {
        const d = OZEL[0];
        govde += '<section class="pz-raf nad-siradan" aria-label="Kalıcı Bayt kalemi"><h2 class="pz-raf-ad">' + chipHtml('Kalıcı', 'gri', 'kar') + '<span>Kalıcı kalem · Çip ile asla alınmaz</span></h2><div class="pz-izgara">' + pzKart(d) + '</div></section>';
      }
    } else if (PZ.sekme === 'butik') {
      govde += '<section class="pz-raf nad-premium"><h2 class="pz-raf-ad">' + S.nadRozet({ nadirlik: 'Premium' }) + '<span>Butik · yalnız Çip, statik, ne aldığını görerek alırsın</span></h2><div class="pz-izgara">' + (L.length ? L.map(pzKart).join('') : '') + '</div></section>';
    } else {
      govde += '<section class="pz-raf nad-nisan"><h2 class="pz-raf-ad">' + S.nadRozet({ nadirlik: 'Nişan' }) + '<span>Rütbe Rafı · satılmaz, kazanılır</span></h2><div class="pz-izgara">' + L.map(pzKart).join('') + '</div></section>';
    }
    if (!L.length) govde = bosHtml({ ikon: 'kutu', baslik: PZ.sekme === 'rutbe' ? 'Rütbe Rafı yakında dolacak.' : 'Bu rafta şimdilik ürün yok.', metin: PZ.sekme === 'rutbe' ? 'Nişanlar satın alınmaz; başarıyla kazanılır.' : 'Yeni raf Pazartesi 09:00\'da. Başka bir kategoriye göz atabilirsin.' });
    return govde;
  }
  function pzOnizleme(u) {
    if (u.onizleme && u.onizleme.tur === 'avatar') { const t = S.onizAvatar(u); return avatarSvg(t.av, { boyut: 210, kadraj: 'tam', emote: t.emote, aria: 'Önizleme: ' + u.ad }); }
    if (u.onizleme && u.onizleme.tur === 'prop') return iso.propSvg(u.onizleme.anahtar, { boyut: 230, aria: u.ad });
    return ikon((u.onizleme && u.onizleme.anahtar) || 'kutu', 96);
  }
  function pzOzet() {
    const u = PZ.sec ? urunBul(PZ.sec) : null;
    if (!u) return '<div class="pz-ozet-bos">' + ikon('pazar', 40) + '<h3>Bir ürüne dokun</h3><p>Avatarında dene, fiyatını gör, sonra tek onayla satın al. Sepet yok: yanlış harcama olmaz.</p></div>';
    const bak = u.para === 'cip' ? state.cip : state.bayt, kalan = bak - u.fiyat, birim = u.para === 'cip' ? ' Çip' : ' B';
    let eylem = '', neden = '';
    if (u.nadirlik === 'Nişan') {
      const rid = NISAN_ESLE[u.id], ip = rid ? nisanIlerleme(rid) : 0, k = S.nisanKazanildi(u);
      neden = '<div class="pz-nasil"><b>Nasıl kazanılır?</b><p>' + esc(NISAN_NASIL[u.id] || 'Başarıyla kazanılır.') + '</p>' + cubukHtml(k ? 100 : ip, { tur: 'bayt', ince: true, etiket: 'Nişan ilerlemesi' }) + '<small class="soluk">' + (k ? 'Kazandın: Dolap\'ta giyebilir ya da sergileyebilirsin.' : 'İlerleme: %' + ip + ' · satın alma düğmesi yoktur') + '</small></div>';
      eylem = '<button type="button" class="btn btn-hayalet btn-blok" aria-disabled="true">KAZANILIR · satılmaz</button>';
    } else if (u.ozel) {
      const st = state.tekrar.dondurma || 0;
      neden = '<p class="soluk">Günlük Tekrar serini bir gün korur. Stok en çok 2; şu an ' + st + '/2. Çip ile alınmaz.</p>';
      eylem = st >= 2 ? '<button type="button" class="btn btn-blok" aria-disabled="true">Stok dolu 2/2</button>' : '<button type="button" class="btn btn-altin btn-blok" data-action="pz-al" data-urun="' + esc(u.id) + '">Satın Al · ' + fmt(u.fiyat) + ' B</button>';
    } else if (S.sahip(u.id)) {
      const tur = S.altTur(u);
      eylem = '<div class="pz-sahip">' + ikon('test-gecti', 20) + 'Sende var</div>' + (tur === 'prop' ? '<button type="button" class="btn btn-birincil btn-blok" data-action="pz-oda" data-urun="' + esc(u.id) + '">Odaya yerleştir</button>' : '<button type="button" class="btn btn-birincil btn-blok" data-action="pz-dolap" data-urun="' + esc(u.id) + '">Dolap\'ta gör</button>');
    } else if (S.kilit(u)) {
      neden = '<p class="pz-neden">' + ikon('kilit', 16) + esc(S.kilit(u)) + '. Şu an Sev. ' + seviye() + '. Raf kilidi Bayt ya da Çip ile açılmaz.</p>';
      eylem = '<button type="button" class="btn btn-blok" aria-disabled="true">' + esc(S.kilit(u)) + '</button>';
    } else if (u.para === 'cip' && S.cipKapali()) {
      neden = '<p class="pz-neden">' + ikon('kilit', 16) + 'Çip kapalı: 15–17 yaş hesaplarda aylık Çip limiti varsayılan 0. Veli SMS bağlantısıyla limit tanımlayınca açılır.</p>';
      eylem = '<button type="button" class="btn btn-blok" aria-disabled="true">Çip kapalı</button>';
    } else if (kalan < 0) {
      const kasa = isletmeKaydi('otopark').kasa.bayt || 0;
      eylem = '<button type="button" class="btn btn-blok" aria-disabled="true">' + fmt(-kalan) + birim + ' eksik</button>';
      if (u.para === 'cip') neden = '<div class="pz-yol"><button type="button" class="btn btn-mor btn-blok" data-action="pz-cip">Çip Paketleri</button><p class="soluk">Çip\'i ücretsiz kazanmak için: Semt Sınavı (+10 Çip).</p></div>';
      else neden = '<p class="pz-neden">' + ikon('coin', 16) + 'Bayt koddan kazanılır. ' + (kasa > 0 ? 'Kasanda ' + fmt(kasa) + ' B var. ' : '') + '<button type="button" class="btn-baglanti" data-go="' + (kasa > 0 ? 'panel' : 'atolye') + '">' + (kasa > 0 ? 'Kasanı topla' : 'Görev yap, Bayt kazan') + '</button></p>';
    } else {
      eylem = '<button type="button" class="btn btn-altin btn-blok" data-action="pz-al" data-urun="' + esc(u.id) + '">Satın Al · ' + fmt(u.fiyat) + birim + '</button>';
      neden = '<p class="pz-cuzdan">Cüzdan: <b>' + fmt(bak) + birim + '</b> → <b>' + fmt(kalan) + birim + '</b></p>';
    }
    return '<div class="pz-onizle">' + pzOnizleme(u) + '</div><div class="pz-bilgi"><h3>' + esc(u.ad) + '</h3><div class="sira-s">' + S.nadRozet(u) + chipHtml(S.katYazi(u), 'gri') + (u.rotasyon ? chipHtml('No. ' + seriNo(u), 'mor') : '') + '</div>' +
      (u.nadirlik !== 'Nişan' ? '<p class="pz-fiyat">' + S.fiyatHtml(u) + '</p>' : '') + neden + '</div><div class="pz-eylem">' + eylem + '</div>';
  }
  function pazarCiz(root) {
    const sev = seviye(), cipK = S.cipKapali(), yeni = S.sonraki(1, 9);
    const sekmeler = [['bayt', 'Bayt Rafları', 'coin'], ['butik', 'Butik', 'chip'], ['rutbe', 'Rütbe Rafı', 'madalya']];
    root.innerHTML = '<div class="sayfa sayfa-genis pz-sayfa">' +
      '<div class="sayfa-baslik"><h1>Pazar</h1><div class="pz-sayac" role="timer" aria-live="off">' + ikon('saat', 18) + 'Yeni raf: Pzt 09:00 · <b id="pz-sayac">' + esc(S.kalanMetin(yeni)) + '</b></div></div>' +
      '<div class="sekmeler" role="tablist" aria-label="Pazar rafları">' + sekmeler.map(function (t) { return '<button type="button" role="tab" id="pz-sekme-' + t[0] + '" class="sekme" aria-selected="' + (PZ.sekme === t[0]) + '" data-action="pz-sekme" data-sekme="' + t[0] + '">' + ikon(t[2], 18) + t[1] + '</button>'; }).join('') + '</div>' +
      (sev < 3 ? '<p class="pz-not">' + ikon('bilgi', 16) + 'Pazar şu an tek raf: yalnız Çırak Şapkası. Tam raflar Sev. 3\'te açılır; şu an Sev. ' + sev + '.</p>' : '') +
      (PZ.sekme === 'butik' ? '<p class="pz-not">' + ikon('bilgi', 16) + (cipK ? 'Çip kapalı: 15–17 yaş hesaplarda aylık Çip limiti varsayılan 0; veli bağlantısıyla limit konulunca açılır. Bayt rafları açık.' : 'Butik: yalnız kozmetik, rastgelelik ve sınırlı süre sayacı yok. Çip ile XP, Bayt, ipucu, süre ya da işletme alınamaz. Demo notu: Butik normalde Sev. 5\'te vitrine çıkar.') + '</p>' : '') +
      (PZ.sekme === 'bayt' ? '<p class="pz-not pz-not-ince">Nadir raf haftada bir yenilenir; ürün 1 hafta sonra kalkar, en erken 12 hafta sonra döner. Sahte aciliyet yok.</p>' : '') +
      '<div class="sekmeler sekmeler-kaydir pz-kategoriler" role="group" aria-label="Kategori">' + KAT_CHIP.map(function (k) { return '<button type="button" class="sekme' + (PZ.kat === k[0] ? ' aktif' : '') + '" aria-pressed="' + (PZ.kat === k[0]) + '" data-action="pz-kat" data-kat="' + k[0] + '">' + k[1] + '</button>'; }).join('') + '</div>' +
      '<div class="pz-duzen"><div class="pz-sol">' + pzRaf() + '</div><aside class="pz-ozet kart" aria-label="Seçili ürün" aria-live="polite">' + pzOzet() + '</aside></div></div>';
    const oz = $('#pz-sayac', root); if (oz) KK_UI.aralik(function () { const e = $('#pz-sayac'); if (e) e.textContent = S.kalanMetin(yeni); }, 30000);
  }
  function cipModal() {
    const kapali = S.cipKapali();
    const govde = '<p class="soluk">100 Çip ≈ 60 TL (varsayım). Çip yalnızca kozmetiktir; XP, Bayt, ipucu, test hakkı, süre, işletme ya da Ruhsat satın alamaz. <b>Bayt hiçbir pakette yoktur.</b></p>' +
      (kapali ? '<p class="pz-neden">' + ikon('kilit', 16) + 'Çip kapalı: 15–17 yaş hesaplarda aylık Çip limiti varsayılan 0 (üst sınır 300 Çip/ay). Sandık ve Konteyner her zaman veli onayı ister.</p>' : '') +
      '<div class="pz-paketler">' + PAKETLER.map(function (p) { return '<button type="button" class="pz-paket" data-action="pz-paket" data-paket="' + p.id + '"' + (kapali ? ' aria-disabled="true"' : '') + '><span class="pz-paket-ad">' + p.ad + '</span><span class="pz-paket-cip">' + ikon('chip', 22) + fmt(p.cip) + ' Çip</span><span class="pz-paket-tl">' + p.tl + ' TL</span><span class="pz-paket-not">' + (p.bonus ? p.bonus + ' bonus' : 'Temel paket') + (p.veli ? ' · 15–17 için veli onayı' : '') + '</span></button>'; }).join('') + '</div>' +
      '<ul class="pz-kurallar"><li>Rastgele kutu yok: ne aldığını görerek alırsın.</li><li>Sınırlı süre sayacı ya da "ilk alışverişe çift" kampanyası yok.</li><li>Harcanmamış Çip 14 gün içinde iade edilir (hukuk onayına tabi).</li><li>Ödeme, sağlayıcının barındırdığı sayfada yapılır; oyun kart bilgisi görmez.</li></ul>';
    return modal({ sinif: 'scr-sosyal', baslik: 'Çip Paketleri', ikon: 'chip', html: govde, genis: true, butonlar: [{ ad: 'Kapat' }] });
  }
  function odemeSimulasyonu(modalNesne, p) {
    modalNesne.guncelle('<div class="pz-odeme"><p>' + ikon('bilgi', 18) + '<b>Ödeme sayfasına yönlendiriliyorsun.</b> Gerçek üründe bu adım sağlayıcının 3-D Secure sayfasında geçer; KodKent kart bilgisi görmez ya da girmez.</p>' +
      '<div class="kart"><b>' + p.ad + ' · ' + fmt(p.cip) + ' Çip</b><br><span class="soluk">' + p.tl + ' TL · Demo: gerçek ödeme alınmaz</span></div>' +
      '<div class="sira"><button type="button" class="btn btn-hayalet" data-action="pz-odeme-iptal">Vazgeç</button><button type="button" class="btn btn-mor" data-action="pz-odeme-tamam" data-paket="' + p.id + '">Ödemeyi tamamla (Demo)</button></div></div>');
  }
  let aktifCipModal = null;
  function onayModali(u) {
    const bak = u.para === 'cip' ? state.cip : state.bayt, birim = u.para === 'cip' ? ' Çip' : ' B';
    const m = modal({ sinif: 'scr-sosyal', baslik: 'Satın alma onayı', ikon: 'pazar', html: '<div class="pz-onay"><div class="pz-onay-on">' + S.onizHtml(u, 120) + '</div><div><h3>' + esc(u.ad) + '</h3><div class="sira-s">' + S.nadRozet(u) + '</div><p class="pz-fiyat">' + S.fiyatHtml(u) + '</p><p class="pz-cuzdan">Cüzdan: <b>' + fmt(bak) + birim + '</b> → <b>' + fmt(bak - u.fiyat) + birim + '</b></p></div></div>',
      butonlar: [{ ad: 'Vazgeç' }, { ad: 'Satın al', birincil: true, veri: 'pz-onay', aksiyon: function () { satinAl(u, true); } }] });
    return m;
  }
  function basariModali(u) {
    const tur = S.altTur(u), bt = [{ ad: 'Pazar\'da kal' }];
    if (u.ozel) { /* tüketim: yalnız kapat */ }
    else if (tur === 'prop') bt.push({ ad: 'Odaya yerleştir', birincil: true, veri: 'pz-oda-git', aksiyon: function () { go('oda', { parametre: { duzenle: true, sec: u.id } }); } });
    else { bt.push({ ad: 'Dolap\'a git', veri: 'pz-dolap-git', aksiyon: function () { go('dolap', { parametre: { sec: u.id } }); } }); if (tur !== 'emote') bt.push({ ad: 'Giy', birincil: true, veri: 'pz-giy', aksiyon: function () { if (S.giy(u)) { toast(u.ad + ' giyildi. Avatarın güncellendi.', 'basari'); refresh(); } } }); }
    modal({ sinif: 'scr-sosyal', baslik: u.ad + ' senin', ikon: 'kutlama', html: '<div class="pz-onay"><div class="pz-onay-on">' + S.onizHtml(u, 120) + '</div><div><p><b>' + esc(u.ad) + '</b> envanterinde.</p><p class="soluk">' + (u.ozel ? 'Günlük Tekrar serini korumak için ' + (state.tekrar.dondurma || 0) + ' dondurma hakkın var.' : tur === 'prop' ? 'Odana yerleştirebilirsin.' : 'Dolap\'tan giyebilirsin; avatarın ve Profil anında güncellenir.') + '</p><p class="pz-cuzdan">Kalan: <b>' + fmt(state.bayt) + ' B</b>' + (state.cip ? ' · <b>' + fmt(state.cip) + ' Çip</b>' : '') + '</p></div></div>', butonlar: bt });
  }
  /** Satın alma: Bayt/Çip düşer → envantere girer → başarı modalı. */
  function satinAl(u, onayli) {
    if (u.nadirlik === 'Nişan') { toast('Nişanlar satın alınmaz, kazanılır.', 'bilgi'); return false; }
    if (!u.ozel && S.sahip(u.id)) { toast('Bu eşyaya zaten sahipsin; Dolap\'tan giyebilirsin.', 'bilgi'); return false; }
    const k = S.kilit(u); if (k) { toast(k + ': raf seviyeyle açılır, parayla açılmaz.', 'uyari'); return false; }
    if (u.para === 'cip' && S.cipKapali()) { toast('Çip kapalı: 15–17 yaş hesaplarda aylık Çip limiti 0.', 'uyari'); return false; }
    if (u.ozel && (state.tekrar.dondurma || 0) >= 2) { toast('Seri Dondurucu stoğu dolu (2/2).', 'bilgi'); return false; }
    if (!onayli) { onayModali(u); return true; }
    const ok = u.para === 'cip' ? harca({ cip: u.fiyat, etiket: u.ad }) : harca({ bayt: u.fiyat, etiket: u.ad });
    if (!ok) { if (u.para === 'cip') cipModal(); return false; }
    if (u.ozel) state.tekrar.dondurma = (state.tekrar.dondurma || 0) + 1;
    else state.envanter.push(u.id);
    S.kaydet('Satın alma kaydedilemedi. Bayt\'ın düşmedi; tekrar dene.'); hud();
    refresh();
    setTimeout(function () { basariModali(u); }, 0);
    return true;
  }
  S.satinAl = satinAl;

  KK_UI.screen('pazar', {
    ad: 'Pazar', hud: true,
    async render(root, ctx) {
      root.classList.add('scr-sosyal');
      if (ctx.ilk) {
        PZ.kat = 'hepsi';
        if (ctx.parametre && ctx.parametre.urun) { const u = urunBul(ctx.parametre.urun); if (u) { PZ.sekme = u.nadirlik === 'Nişan' ? 'rutbe' : (u.para === 'cip' ? 'butik' : 'bayt'); PZ.sec = u.id; } }
        root.innerHTML = '<div class="sayfa sayfa-genis pz-sayfa" aria-busy="true"><div class="sayfa-baslik"><h1>Pazar</h1></div>' + yukleniyorHtml('Raflar hazırlanıyor…') + '<div class="pz-izgara">' + S.iskeletKartlar(8) + '</div></div>';
        await bekle(260);
        if (KK_UI.current() !== 'pazar') return;
      }
      if (!urunler().length) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Pazar şu an açılamadı.', { baslik: 'Raflar yüklenemedi', tekrar: 'pz-yenile' }) + '</div>'; return; }
      pazarCiz(root);
    },
    actions: {
      'pz-yenile': function () { refresh(); },
      'pz-sekme': function (el) { PZ.sekme = el.getAttribute('data-sekme'); PZ.kat = 'hepsi'; PZ.sec = null; refresh(); },
      'pz-kat': function (el) { PZ.kat = el.getAttribute('data-kat'); refresh(); },
      'pz-sec': function (el) { PZ.sec = el.getAttribute('data-urun'); refresh(); const o = $('.pz-ozet'); if (o && window.matchMedia && window.matchMedia('(max-width:720px)').matches) { try { o.scrollIntoView({ block: 'nearest' }); } catch (e) { /* kaydırma yok */ } } },
      'pz-al': function (el) { const u = urunBul(el.getAttribute('data-urun') || PZ.sec); if (u) satinAl(u, false); },
      'pz-cip': function () { aktifCipModal = cipModal(); },
      'pz-paket': function (el) {
        if (S.cipKapali()) { toast('Çip kapalı: 15–17 yaş hesaplarda aylık Çip limiti 0. Veli limit tanımlayınca açılır.', 'uyari'); return; }
        const p = PAKETLER.filter(function (x) { return x.id === el.getAttribute('data-paket'); })[0]; if (!p || !aktifCipModal) return;
        if (p.veli && S.yasBandi() === 'genc') { toast('Bu paket için veli onayı gerekir.', 'uyari'); return; }
        odemeSimulasyonu(aktifCipModal, p);
      },
      'pz-odeme-iptal': function () { if (aktifCipModal) aktifCipModal.kapat(false); aktifCipModal = null; },
      'pz-odeme-tamam': function (el) {
        const p = PAKETLER.filter(function (x) { return x.id === el.getAttribute('data-paket'); })[0]; if (!p) return;
        if (aktifCipModal) aktifCipModal.kapat(true); aktifCipModal = null;
        award({ cip: p.cip, etiket: p.ad + ' (Demo)' }); toast('Demo: ' + fmt(p.cip) + ' Çip eklendi. Gerçek ödeme alınmadı.', 'basari'); refresh();
      },
      'pz-oda': function (el) { go('oda', { parametre: { duzenle: true, sec: el.getAttribute('data-urun') } }); },
      'pz-dolap': function (el) { go('dolap', { parametre: { sec: el.getAttribute('data-urun') } }); }
    },
    leave() { aktifCipModal = null; },
    async selftest(root, ctx) {
      await ctx.bekleSecici('.pz-izgara .urun');
      const hedef = urunler().filter(function (u) { return u.para === 'bayt' && u.nadirlik === 'Sıradan' && u.fiyat > 0 && u.fiyat <= state.bayt && !S.sahip(u.id) && !S.kilit(u); })[0];
      if (!hedef) throw new Error('satın alınabilir Sıradan ürün yok');
      await ctx.tikla('[data-action="pz-sec"][data-urun="' + hedef.id + '"]');
      const once = state.bayt, envOnce = state.envanter.length;
      await ctx.tikla('[data-action="pz-al"]');
      await ctx.tikla('[data-veri="pz-onay"]');
      if (state.bayt !== once - hedef.fiyat) throw new Error('Bayt düşmedi: ' + once + ' → ' + state.bayt + ' (beklenen ' + (once - hedef.fiyat) + ')');
      if (state.envanter.indexOf(hedef.id) < 0 || state.envanter.length !== envOnce + 1) throw new Error('ürün envantere girmedi');
      await ctx.bekleSecici('[data-veri="pz-dolap-git"],[data-veri="pz-oda-git"],.modal');
      KK_UI.modalTemizle();
      // Nadir raf Sev. 3'te kilitli olmalı, Butik'te Çip yetersizliği açıklanmalı
      await ctx.tikla('#pz-sekme-butik');
      const premium = urunler().filter(function (u) { return u.para === 'cip'; })[0];
      if (premium) { await ctx.tikla('[data-action="pz-sec"][data-urun="' + premium.id + '"]'); if (!/Çip|Sev\./.test(ctx.metin('.pz-ozet'))) throw new Error('Çip yetersizliği açıklanmadı'); }
    }
  });
})();
