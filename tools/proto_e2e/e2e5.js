/* Entegrasyon testi 5: 4 Ruhsat gorevi sirayla (iskelet kod KALIR, cozum GECER), Ruhsat 1-2-2-3, Bayt 330, Tapu alinabilir */
(async function () {
  const out = [];
  const log = function (k, ok, d) { out.push((ok ? 'OK   ' : 'FAIL ') + k + (d ? ' :: ' + d : '')); };
  const T = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const root = document.getElementById('screen');
  const ctx = function () { return ekranBaglami(KK_UI.mevcut, root, {}); };
  const $q = function (s) { return document.querySelector(s); };
  KK_UI.hizliMod = true; sifirla();
  state.ad = 'Deniz'; state.kurulumTamam = true; state.xp = 472; ['1.1', '1.2', '1.3', '1.4'].forEach(function (l) { const k = dersKaydi(l); k.tamam = true; k.mohur = true; }); save();
  const ids = ['meydan-saati', 'dakikadan-saate', 'kademeli-karar', 'taksimetre'], beklenenRuhsat = [1, 2, 2, 3];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i], g = KK_CORE.DATA.gorevler.filter(function (x) { return x.id === id; })[0];
    try {
      go('atolye'); await T(300); KK_UI.modalTemizle(); await ctx().bekleSecici('#atl-kod', 4000);
      const aktif = $q('#atl-gorev') ? $q('#atl-gorev').textContent : ''; if (aktif.indexOf(g.ad) < 0) { await ctx().tikla('[data-action="gorev-sec"][data-id="' + id + '"]'); await T(300); await ctx().bekleSecici('#atl-kod', 3000); }
      await ctx().tikla('[data-action="calistir"]'); await T(900); if ($q('.atl-basari')) throw new Error('ISKELET kod gorevi gecti (testler zayif): ' + id);
      await ctx().yaz('#atl-kod', g.editor.cozum); await ctx().tikla('[data-action="calistir"]'); await ctx().bekleSecici('.atl-basari', 5000); await T(300); KK_UI.modalTemizle(); await T(100);
      if (!state.gorevler[id] || !state.gorevler[id].tamam) throw new Error('tamam degil'); if (state.ruhsat.otopark !== beklenenRuhsat[i]) throw new Error('Ruhsat ' + state.ruhsat.otopark + ' beklenen ' + beklenenRuhsat[i]);
      log('gorev ' + id, true, 'Ruhsat ' + state.ruhsat.otopark + ' · Bayt ' + state.bayt + ' · XP ' + state.xp);
    } catch (e) { log('gorev ' + id, false, String((e && e.message) || e)); }
  }
  log('toplam Bayt = 40+50+60+80+100', state.bayt === 330, 'Bayt ' + state.bayt);
  try { go('sokak'); await T(300); const b = $q('[data-action="tapuAl"]'); if (!b || b.getAttribute('aria-disabled') === 'true') throw new Error('Tapuyu Al kapali (Sev ' + seviyeBilgi().seviye + ', Ruhsat ' + state.ruhsat.otopark + ', ' + state.bayt + ' B)'); await ctx().tikla('[data-action="tapuAl"]'); await ctx().tikla('[data-veri="onayla-evet"]'); await T(250); if (state.isletmeler.otopark.durum !== 'kapali' || state.bayt !== 30) throw new Error('tapu sonrasi durum ' + state.isletmeler.otopark.durum + ' bayt ' + state.bayt); log('taze oyuncu Tapu 300 B ile alinabilir', true, 'kalan ' + state.bayt + ' B'); }
  catch (e) { log('taze oyuncu Tapu', false, String((e && e.message) || e)); }
  const pre = document.createElement('pre'); pre.id = 'e2e-out'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
})();
