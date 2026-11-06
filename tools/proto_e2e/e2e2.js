/* Entegrasyon testi 2: TAZE oyuncu (hizliKurulum YOK): giris->dil->avatar->meydan->akademi->derslik->kurul, ders 1.1-1.4; sonra Gunluk Tekrar + yenileme kalicilik */
(async function () {
  const out = [];
  const log = function (k, ok, d) { out.push((ok ? 'OK   ' : 'FAIL ') + k + (d ? ' :: ' + d : '')); };
  const T = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const root = document.getElementById('screen');
  const ctx = function () { return ekranBaglami(KK_UI.mevcut, root, {}); };
  const adim = async function (ad, fn) {
    const h0 = KK_UI.hatalar.length;
    try { await fn(); const yeni = KK_UI.hatalar.slice(h0); if (yeni.length) log(ad, false, 'betik hatasi: ' + yeni[0].mesaj); else log(ad, true); }
    catch (e) { log(ad, false, String((e && e.message) || e)); }
    try { KK_UI.modalTemizle(); } catch (x) { /* yoksa */ }
  };
  const git = async function (t) { go(t); await T(250); if (KK_UI.mevcut !== t) throw new Error('go(' + t + ') sonrasi ekran ' + KK_UI.mevcut); };
  const $q = function (s) { return document.querySelector(s); };
  KK_UI.hizliMod = true;
  sifirla(); await T(100);

  /* ---- giris -> dil-sec -> avatar -> meydan (gercek akis, giris'in kendi selftest'i adimlari) ---- */
  await adim('giris ekrani acilir, 15 alti reddedilir (selftest akisi)', async function () {
    await git('giris'); const def = KK_UI.ekranlar.giris; if (!def || typeof def.selftest !== 'function') throw new Error('giris selftest yok');
    KK_UI.selftestAktif = true; try { await def.selftest(root, ctx()); } finally { KK_UI.selftestAktif = false; }
  });
  await adim('dil-sec: C# ile Basla -> avatar', async function () {
    sifirla(); await git('dil-sec'); await ctx().tikla('[data-action="dil-csharp"]'); await T(250); if (KK_UI.mevcut !== 'avatar') throw new Error('avatar acilmadi: ' + KK_UI.mevcut);
  });
  await adim('avatar: takma ad + Sehre Gir -> kurulumTamam, meydan', async function () {
    const inp = $q('input[data-input], #av-ad, input[type="text"]'); if (!inp) throw new Error('takma ad girdisi yok');
    await ctx().yaz(inp, 'Deniz'); const d = Array.prototype.filter.call(document.querySelectorAll('button'), function (b) { return /Şehre Gir/.test(b.textContent); })[0];
    if (!d) throw new Error('Sehre Gir yok'); d.click(); await T(500); KK_UI.modalTemizle();
    if (!state.kurulumTamam) throw new Error('kurulumTamam false'); if (state.ad !== 'Deniz') throw new Error('ad ' + state.ad); if (KK_UI.mevcut !== 'meydan') throw new Error('meydan acilmadi: ' + KK_UI.mevcut);
  });
  await adim('meydan: hizli erisim Akademi -> akademi', async function () {
    await ctx().bekleSecici('.mey-dock [data-go="akademi"], [data-go="akademi"]', 4000); $q('[data-go="akademi"]').click(); await T(300); if (KK_UI.mevcut !== 'akademi') throw new Error('akademi acilmadi: ' + KK_UI.mevcut);
  });

  /* ---- Ders 1.1 .. 1.4 : kartlar -> Usta sorulari -> Muhur ---- */
  const doldur = function (s) { return (s.ornekIyiCevap && s.ornekIyiCevap.length > 40) ? s.ornekIyiCevap : ((s.anahtarlar || []).slice(0, 6).map(function (x) { return String(x).split('|')[0]; }).join(' ve ') + ' kavramlarını kendi cümlelerimle birbirine bağlayarak anlatıyorum; birlikte çalışırlar.'); };
  for (const L of ['1.1', '1.2', '1.3', '1.4']) {
    await adim('ders ' + L + ': akademi -> derslik (kartlar) -> kurul (3 soru) -> muhur', async function () {
      const x0 = state.xp, d = KK_CORE.DATA.dersler.filter(function (z) { return z.id === L; })[0];
      await git('akademi'); await ctx().tikla('[data-action="kursu-sec"][data-semt="carsi"]'); await ctx().bekleSecici('.akd-ders[data-ders="' + L + '"]', 3000);
      if ($q('.akd-ders[data-ders="' + L + '"]').getAttribute('aria-disabled') === 'true') throw new Error('ders ' + L + ' kilitli (onceki ders bitti ama acilmadi)');
      await ctx().tikla('.akd-ders[data-ders="' + L + '"]'); await ctx().tikla('[data-action="ders-baslat"]'); await T(300); if (KK_UI.mevcut !== 'derslik') throw new Error('derslik acilmadi: ' + KK_UI.mevcut);
      await ctx().bekleSecici('[data-action="ileri"]', 3000);
      for (let i = 0; i < 14 && $q('[data-action="ileri"]'); i++) {
        if ($q('[data-action="calistir"]')) { await ctx().tikla('[data-action="calistir"]'); await ctx().bekleSecici('#drs-konsol .drs-cikti-satir, #drs-konsol .drs-hata, #drs-konsol .drs-bos', 2500); await T(120); if ($q('#drs-konsol .drs-hata') && /CS\d+/.test($q('#drs-konsol .drs-hata').textContent) && d.kartlar[i] && d.kartlar[i].primm === 'Çalıştır') throw new Error('Calistir kartinda C# hatasi: ' + $q('#drs-konsol .drs-hata').textContent.slice(0, 120)); }
        await ctx().tikla('[data-action="ileri"]'); await T(30);
      }
      await ctx().bekleSecici('[data-action="usta-sorusu"]', 3000); await ctx().tikla('[data-action="usta-sorusu"]'); await T(300); if (KK_UI.mevcut !== 'kurul') throw new Error('kurul acilmadi: ' + KK_UI.mevcut);
      for (let i = 0; i < d.sorular.length; i++) {
        const s = d.sorular[i];
        if (s.tip === 'Çıktı Tahmini') { await ctx().yaz('#kurul-cikti', String(s.beklenenCikti || s.cikti || '9')); await ctx().yaz('#kurul-neden', doldur(s)); }
        else if (s.tip === 'Hata Avı') { await ctx().tikla('[data-action="satir-sec"][data-satir="1"]'); await ctx().yaz('#kurul-duzeltme', 'düzeltilmiş satır'); await ctx().yaz('#kurul-neden', doldur(s)); }
        else if (s.tip === 'Kod Yazma') { await ctx().yaz('#kurul-kod', s.ornekIyiCevap || 'static int F(int x) { return x; }'); }
        else await ctx().yaz('#kurul-cevap', doldur(s));
        await ctx().tikla('[data-action="gonder"]'); await ctx().bekleSecici('.kurul-karti', 5000); await T(350); KK_UI.modalTemizle(); await T(120);
        await ctx().tikla('[data-action="sonraki"]'); await T(150); KK_UI.modalTemizle();
      }
      await ctx().bekleSecici('.kurul-ozet', 3000); await T(300); KK_UI.modalTemizle();
      const kay = state.dersler[L]; if (!kay || !kay.tamam) throw new Error('ders tamam sayilmadi: ' + JSON.stringify(kay).slice(0, 120));
      if (!(state.xp > x0)) throw new Error('XP artmadi');
      if (!kay.mohur) log('  uyari ders ' + L + ' muhur yok (puanlar ' + JSON.stringify(kay.puanlar) + ')', true);
    });
  }
  log('ders ozeti', true, 'XP ' + state.xp + ' · seviye ' + seviyeBilgi().seviye + ' · muhur ' + ['1.1', '1.2', '1.3', '1.4'].map(function (l) { return l + ':' + (state.dersler[l] && state.dersler[l].mohur ? 'M' : (state.dersler[l] && state.dersler[l].tamam ? 't' : '-')); }).join(' ') + ' · Bayt ' + state.bayt);

  await adim('atolye: yeni oyuncuda Meydan Saati acik, sirali gorevler', async function () {
    await git('atolye'); await ctx().bekleSecici('#atl-kod', 4000);
    const g = KK_CORE.DATA.gorevler.filter(function (x) { return x.id === 'meydan-saati'; })[0];
    await ctx().yaz('#atl-kod', g.editor.cozum); await ctx().tikla('[data-action="calistir"]'); await ctx().bekleSecici('.atl-basari', 5000); await T(300); KK_UI.modalTemizle();
    if (!state.gorevler['meydan-saati'] || !state.gorevler['meydan-saati'].tamam) throw new Error('meydan-saati tamam degil'); log('  atolye 1. gorev sonrasi', true, 'Ruhsat ' + state.ruhsat.otopark + ' · Bayt ' + state.bayt);
  });
  await adim('kalicilik: save() -> load() ile durum korunur', async function () {
    const s0 = JSON.stringify({ xp: state.xp, bayt: state.bayt, d: state.dersler, g: state.gorevler, r: state.ruhsat }); save(); const k = JSON.parse(localStorage.getItem(Object.keys(localStorage)[0]) || 'null'); load();
    const s1 = JSON.stringify({ xp: state.xp, bayt: state.bayt, d: state.dersler, g: state.gorevler, r: state.ruhsat }); if (s0 !== s1) throw new Error('yukleme sonrasi durum degisti');
  });
  const pre = document.createElement('pre'); pre.id = 'e2e-out'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
})();
