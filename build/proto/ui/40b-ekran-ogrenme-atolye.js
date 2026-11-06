/* ==== ui/40b-ekran-ogrenme-atolye.js — P1: Atölye (görev editörü, açık testler, ipucu merdiveni, Türkçe hata paneli, Ruhsat) ====
   Kaynaklar: B8 §6.9 · B3 §8 · KANON §3–§4, §8 · brief/04 §3 (gorevler[].editor, KK_CORE.gorevTestEt). Testler YALNIZCA "Testleri Çalıştır"a basınca çalışır. */
(function () {
  const O = KK_UI.ogr, D = O.D, md = O.md, odak = O.odak;
  const RUHSAT = { 'meydan-saati': 1, 'dakikadan-saate': 2, 'kademeli-karar': 2, 'taksimetre': 3 };
  const K = { ed: null, calisiyor: false, goster: null, sekme: 'gorev', inceleme: {} };
  KK_UI.sifirlaKancalari.push(function () { K.goster = null; K.sekme = 'gorev'; K.inceleme = {}; K.calisiyor = false; });
  const veri = function () { return O.ekranVeri('atolye', { aktif: null, g: {} }); };
  const gs = function (g) { const v = veri(); return v.g[g.id] || (v.g[g.id] = { kod: null, ipucu: 0, calisti: 0, sonuc: null }); };
  const sirali = function () { return (D().gorevler || []).filter(function (g) { return g.editor; }); };
  const tamamMi = function (g) { return !!(state.gorevler[g.id] && state.gorevler[g.id].tamam); };
  function gorevKilit(g, sira) {
    const sv = seviyeBilgi().seviye;
    if (g.acilisSeviye > sv) return 'Sev. ' + g.acilisSeviye + ' gerekir; şu an Sev. ' + sv + '.';
    const i = sira.indexOf(g);
    if (i > 0 && !tamamMi(sira[i - 1])) return 'Önce «' + sira[i - 1].ad + '» görevini tamamla.';
    return '';
  }
  function aktifGorev(ctx) {
    const v = veri(), sira = sirali();
    if (ctx && ctx.parametre && ctx.parametre.gorev) v.aktif = ctx.parametre.gorev;
    let g = sira.filter(function (x) { return x.id === v.aktif; })[0];
    if (!g || gorevKilit(g, sira)) g = sira.filter(function (x) { return !gorevKilit(x, sira) && !tamamMi(x); })[0] || sira[sira.length - 1] || null;
    if (g) v.aktif = g.id;
    return g;
  }
  function ruhsatChip(g) { const h = RUHSAT[g.id]; return h ? chipHtml(h >= 3 ? 'Ruhsat 3/3 + 100 B teşvik' : 'Ruhsat ' + h + '/3', 'nane', 'kalkan') : ''; }

  function listeHtml(g, sira) {
    const ruh = state.ruhsat.otopark;
    const satirlar = sira.map(function (x) {
      const kilit = gorevKilit(x, sira), tamam = tamamMi(x), sec = x.id === g.id, durum = tamam ? 'muhurlu' : kilit ? 'kilitli' : 'acik';
      return '<button type="button" class="satir satir-tikla atl-gorev' + (sec ? ' secili' : '') + '" data-action="' + (kilit ? 'gorev-kilit' : 'gorev-sec') + '" data-id="' + esc(x.id) + '" aria-pressed="' + sec + '"><span class="akd-muhur m-' + durum + '" aria-hidden="true">' + ikon(tamam ? 'tik' : kilit ? 'kilit' : 'kalem', 18) + '</span><span class="satir-ana"><span class="satir-baslik">' + esc(x.ad) + '</span><span class="satir-alt">' + esc(x.tip) + ' · ' + x.odul.xp + ' XP · ' + x.odul.bayt + ' B' + '</span>' + (kilit ? '<span class="akd-neden">' + esc(kilit) + '</span>' : '') + '</span><span class="satir-sag">' + chipHtml(tamam ? 'Tamam' : kilit ? 'Kilitli' : 'Açık', tamam ? 'nane' : kilit ? 'gri' : 'turkuaz') + '</span></button>';
    }).join('');
    const yakinda = (D().gorevler || []).filter(function (x) { return !x.editor && x.semt === 'carsi' && /Hata Bildirimi|Sıralama/.test(x.tip); }).slice(0, 1).map(function (x) {
      return '<div class="satir satir-kilitli"><span class="akd-muhur m-kilitli" aria-hidden="true">' + ikon('kilit', 18) + '</span><span class="satir-ana"><span class="satir-baslik">' + esc(x.ad) + '</span><span class="satir-alt">' + esc(x.tip) + ' · Müfettiş getirir; işletme açılınca gelir.</span></span></div>';
    }).join('');
    return '<div class="atl-ruhsat"><div class="sira-s">' + ikon('kalkan', 18) + '<b>Ruhsat ' + ruh + '/3</b><small class="soluk">Otopark için</small></div>' + cubukHtml(100 * ruh / 3, { tur: 'nane', ince: true, etiket: 'Ruhsat ilerlemesi' }) + '<small class="soluk">Ruhsat tamamlanınca +100 B Belediye teşviki.</small></div><div class="liste">' + satirlar + yakinda + '</div>';
  }
  function gorevHtml(g) {
    const d = O.dersBul(g.dersId), tamam = tamamMi(g);
    return '<h3>' + esc(g.ad) + '</h3><div class="sira-s">' + chipHtml(g.tip, 'mor', 'kalem') + chipHtml(g.odul.xp + ' XP', 'mor', 'xp') + chipHtml(g.odul.bayt + ' B', 'amber', 'coin') + ruhsatChip(g) + (tamam ? chipHtml('Tamam', 'nane', 'tik') : '') + '</div>' +
      '<p class="atl-anlat">' + (d ? 'Ders ' + esc(d.id) + ' «' + esc(d.baslik) + '» ile ilgili kısa görev. ' : '') + (g.tip === 'Sıfırdan' ? 'Metodu sıfırdan yaz.' : 'Başlangıç kodundaki eksikleri tamamla.') + ' Açık testlerin hepsi yeşil olunca görev biter.</p>' +
      (tamam ? '<p class="mini soluk">Bu görev tamam; tekrar çözmek 0 XP verir.</p>' : '');
  }
  function testlerHtml(g, gk) {
    const sn = gk.sonuc, goster = K.goster;
    return g.editor.testler.map(function (t, i) {
      let durum = 'bekliyor', gercek, hata;
      if (sn && !sn.derleme && (goster == null || i < goster)) { const r = sn.testler[i]; if (r) { durum = r.gecti ? 'gecti' : (r.hata ? 'hata' : 'kaldi'); gercek = r.gercek; hata = r.hata; } }
      else if (sn && sn.derleme) { durum = 'hata'; hata = 'Derleme hatası: kod çalıştırılamadı.'; }
      return testSatirHtml({ ad: 'Test ' + (i + 1), durum: durum, girdi: t.girdi, beklenen: t.beklenen, gercek: durum === 'kaldi' || durum === 'hata' ? gercek : undefined, hata: hata && durum === 'hata' ? hata : undefined });
    }).join('');
  }
  function hataKutusu(h) {
    const kayit = ((D().metinler || {}).csHata || []).filter(function (x) { return x.kod === h.kod; })[0];
    return '<div class="atl-hata" role="alert">' + ikon('uyari', 22) + '<div><b>' + esc(O.hataMetni(h)) + '</b>' + (kayit && kayit.aciklama ? '<p class="mini soluk" style="margin:4px 0 0">' + esc(kayit.aciklama) + '</p>' : '') + (h.satir ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="satira-git" data-satir="' + h.satir + '">Satıra Git</button>' : '') + '</div></div>';
  }
  function sonucHtml(g, gk) {
    const sn = gk.sonuc;
    if (K.calisiyor) return '<h3>Sonuç</h3>' + yukleniyorHtml('Testler çalışıyor…') + '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="durdur">' + ikon('dur', 16) + 'Durdur</button>';
    if (!sn) return '<h3>Sonuç</h3><div class="drs-bos">Henüz çalıştırmadın. Kodunu yaz ve «Testleri Çalıştır»a bas (Ctrl+Enter).</div>';
    if (sn.derleme) return '<h3>Sonuç</h3>' + sn.derleme.map(hataKutusu).join('') + '<p class="mini soluk" style="margin:0">Testler çalışmadı: önce derleme hatasını düzelt. Ceza yok.</p>';
    const anim = K.goster != null, gorunen = anim ? sn.testler.slice(0, K.goster) : sn.testler, toplam = sn.testler.length, gecen = gorunen.filter(function (x) { return x.gecti; }).length, hepsi = !anim && gecen === toplam;
    const inc = K.inceleme[g.id];
    return '<h3>Sonuç</h3><div class="test-ozet" role="status"><span>' + gecen + '/' + toplam + ' test geçti</span>' + cubukHtml(100 * gecen / toplam, { tur: hepsi ? 'nane' : 'mercan', ince: true, etiket: 'Test ilerlemesi' }) + '</div>' +
      '<p class="mini soluk" style="margin:0">' + esc(sn.etiket || '') + '</p>' +
      (hepsi ? '<div class="atl-basari" role="status">' + ikon('test-gecti', 26) + '<div><b>Görev tamam! ' + gecen + '/' + toplam + ' test geçti.</b>' + (gk.odul ? '<div class="sira-s" style="margin-top:6px">' + chipHtml('+' + gk.odul.xp + ' XP' + (gk.odul.berrak ? ' · Berrak Zihin +%15' : ''), 'mor', 'xp') + chipHtml('+' + gk.odul.bayt + ' B', 'amber', 'coin') + ruhsatChip(g) + '</div>' : '<p class="mini soluk" style="margin:4px 0 0">Bu görev zaten tamamdı; tekrar 0 XP.</p>') + '</div></div>' +
        (inc ? '<div class="atl-inceleme"><b>' + ikon('kalem', 16) + 'Usta Yorumu</b>' + inc.maddeler.map(function (m) { return '<p><b>' + esc(m.baslik) + ':</b> ' + esc(m.not) + '</p>'; }).join('') + '<small class="soluk">' + (inc.kaynak === 'claude' ? 'Claude' : 'Çevrimdışı demo') + '</small></div>' :
          '<button type="button" class="btn btn-mor btn-kucuk" data-action="usta-yorumu">' + ikon('kalem', 16) + 'Usta Yorumu iste' + (gorevKaydi(g.id).inceleme ? '' : ' (+10 XP)') + '</button>') +
        sirada(g) : '<p class="mini soluk" style="margin:0">Kalan testlerde «beklenen» ile «gerçek» yan yana. İpucu merdiveni açık ve ücretsiz.</p>');
  }
  function sirada(g) {
    const sira = sirali(), sonraki = sira.filter(function (x) { return !tamamMi(x) && !gorevKilit(x, sira); })[0];
    return sonraki ? '<button type="button" class="btn btn-birincil btn-kucuk" data-action="gorev-sec" data-id="' + esc(sonraki.id) + '">Sıradaki: ' + esc(sonraki.ad) + ikon('ok-sag', 16) + '</button>' : (state.ruhsat.otopark >= 3 ? '<button type="button" class="btn btn-altin btn-kucuk" data-action="tapu-git">' + ikon('bina', 16) + 'Otopark Tapusuna Git</button>' : '');
  }
  function ipucuHtml(g, gk) {
    const ip = g.editor.ipuclari || {}, ad = ['Pusula', 'Fener', 'Taslak', 'Örnek'], an = ['Hangi kavram?', 'Hangi durum / satır?', 'Sözde kod / eksik satır', 'Benzer çalışılmış örnek'], ik = ['pusula', 'fener', 'kalem', 'kitap'], ky = ['pusula', 'fener', 'taslak', 'ornek'];
    const kazandi = !!(gk.odul && gk.odul.berrak), berrak = kazandi ? 'Berrak Zihin: kazandın (+%15)' : gk.ipucu > 0 ? 'Berrak Zihin: bu denemede kapandı' : gk.calisti > 0 ? 'Berrak Zihin: ilk denemede kapandı' : 'Berrak Zihin: +%15 hazır';
    return '<h3>' + ikon('fener', 20) + 'İpucu merdiveni</h3><p class="mini soluk" style="margin:0">İpucu ücretsiz ve sınırsız; basamaklar sırayla açılır.</p><div class="ipucu-merdiven">' + ad.map(function (x, i) {
      const durum = i < gk.ipucu ? 'gorundu' : i === gk.ipucu ? 'acik' : 'kilitli', metin = String(ip[ky[i]] || ''), kodMu = i >= 2 && /[;{}]/.test(metin);
      return '<div class="ipucu-basamak ' + durum + '" style="--adim:' + i + '"><span class="ipucu-ik">' + ikon(ik[i], 22) + '</span><div><div class="ipucu-ad">' + x + '</div><div class="ipucu-aciklama">' + an[i] + '</div></div>' +
        (durum === 'acik' ? '<button type="button" class="btn btn-altin btn-kucuk" data-action="ipucu" data-seviye="' + (i + 1) + '">Aç</button>' : durum === 'kilitli' ? ikon('kilit', 20) : chipHtml('görüldü', 'nane')) +
        (durum === 'gorundu' ? '<div class="ipucu-icerik">' + (kodMu ? kodHtml(metin, { satirNo: false }) + (i === 3 ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="ornek-al">Örneği editöre al</button>' : '') : md(metin)) + '</div>' : '') + '</div>';
    }).join('') + '</div><div class="atl-berrak">' + chipHtml(berrak, kazandi ? 'nane' : gk.ipucu > 0 || gk.calisti > 0 ? 'gri' : 'amber', 'parlak') + '</div>';
  }
  function eylemHtml(g, gk) {
    return '<button type="button" class="btn btn-birincil btn-buyuk" data-action="calistir"' + (K.calisiyor ? ' disabled' : '') + '>' + ikon('oynat', 22) + 'Testleri Çalıştır</button><button type="button" class="btn btn-hayalet" data-action="sifirla">' + ikon('yenile', 18) + 'Sıfırla</button><small class="soluk">Ctrl+Enter · Tab = 4 boşluk (Esc ardından Tab odaktan çıkar)</small>' +
      '<span class="chip chip-gri" data-ai-rozet>' + esc(typeof aiDurumMetni === 'function' ? aiDurumMetni() : '') + '</span>';
  }
  function paneller(g, gk) {
    const set = function (id, html) { const e = $(id); if (e) e.innerHTML = html; }, sira = sirali();
    set('#atl-liste', listeHtml(g, sira)); set('#atl-testler', testlerHtml(g, gk)); set('#atl-sonuc', sonucHtml(g, gk)); set('#atl-ipucu', ipucuHtml(g, gk)); set('#atl-eylem', eylemHtml(g, gk));
    const al = $('.odak-baslik small'); if (al) al.textContent = g.tip + ' · Ruhsat ' + state.ruhsat.otopark + '/3';
    const bar = $('.odak .cubuk i'); if (bar) bar.style.width = Math.round(100 * sira.filter(tamamMi).length / Math.max(1, sira.length)) + '%';
  }
  function sekmeUygula() {
    const k = $('.atl'); if (!k) return; k.setAttribute('data-sekme', K.sekme);
    $$('.atl-sekmeler .sekme').forEach(function (b) { const a = b.getAttribute('data-sekme') === K.sekme; b.classList.toggle('aktif', a); b.setAttribute('aria-selected', String(a)); });
  }
  const SEKMELER = [['gorev', 'Görev', 'gorev'], ['testler', 'Testler', 'test-gecti'], ['ipucu', 'İpucu', 'fener'], ['sonuc', 'Sonuç', 'liste']];
  function sayfa(g, gk, sira) {
    const bitti = sira.filter(tamamMi).length;
    return '<div class="sayfa atl" data-sekme="' + K.sekme + '">' + odak({ geri: 'geri', geriAd: 'Akademi', baslik: g.ad, alt: g.tip + ' · Ruhsat ' + state.ruhsat.otopark + '/3', yuzde: Math.round(100 * bitti / Math.max(1, sira.length)), etiket: 'Ruhsat görevleri' }) +
      '<div class="sekmeler atl-sekmeler" role="tablist" aria-label="Atölye bölümleri">' + SEKMELER.map(function (s) { return '<button type="button" role="tab" class="sekme' + (s[0] === K.sekme ? ' aktif' : '') + '" aria-selected="' + (s[0] === K.sekme) + '" data-action="sekme" data-sekme="' + s[0] + '">' + ikon(s[2], 18) + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="atl-izgara"><div class="atl-sol"><section class="panel atl-p atl-p-gorev" data-panel="gorev" aria-label="Görev paneli"><div id="atl-liste">' + listeHtml(g, sira) + '</div><hr><div id="atl-gorev">' + gorevHtml(g) + '</div></section>' +
      '<section class="panel atl-p atl-p-testler" data-panel="testler" aria-label="Açık testler"><h3>' + ikon('test-gecti', 20) + 'Açık testler</h3><div class="yigin-s" id="atl-testler">' + testlerHtml(g, gk) + '</div></section></div>' +
      '<section class="atl-editor-kap" aria-label="Kod düzenleyici"><div id="atl-editor"></div><div class="atl-eylem" id="atl-eylem">' + eylemHtml(g, gk) + '</div></section>' +
      '<section class="panel atl-p atl-p-sonuc" data-panel="sonuc" id="atl-sonuc" aria-label="Sonuç">' + sonucHtml(g, gk) + '</section>' +
      '<aside class="panel atl-p atl-p-ipucu" data-panel="ipucu" id="atl-ipucu" aria-label="İpucu merdiveni">' + ipucuHtml(g, gk) + '</aside></div></div>';
  }
  function kosulSatir(ok, metin) { return '<div style="display:flex;gap:8px;align-items:center;margin:6px 0;color:var(' + (ok ? '--mint-ink' : '--amber-ink') + ')">' + ikon(ok ? 'tik' : 'kilit', 18) + '<span>' + esc(metin) + '</span></div>'; }
  async function basari(g, gk, ilk) {
    const kay = gorevKaydi(g.id), ilkKez = !kay.tamam, berrak = ilk && gk.ipucu === 0;
    if (!ilkKez) { toast('Bu görev zaten tamam; tekrar 0 XP.', 'bilgi'); return; }
    kay.tamam = true; kay.ipucu = gk.ipucu; kay.ipucusuz = gk.ipucu === 0; if (berrak) rozetVer('berrak-zihin');
    const xp = Math.round(g.odul.xp * (berrak ? 1.15 : 1)); gk.odul = { xp: xp, bayt: g.odul.bayt, berrak: berrak }; save();
    paneller(g, gk); konfeti({ adet: 40 });
    await award({ xp: xp, bayt: g.odul.bayt, etiket: g.ad + (berrak ? ' · Berrak Zihin +%15' : ''), kaynak: $('#atl-sonuc') });
    const hedef = RUHSAT[g.id];
    if (hedef && state.ruhsat.otopark < hedef) {
      state.ruhsat.otopark = hedef; save(); hud();
      if (hedef >= 3) {
        rozetVer('ruhsat');
        await award({ bayt: 100, etiket: 'Belediye teşviki' });
        const sv = seviyeBilgi().seviye, tamam = state.bayt >= 300 && sv >= 3;
        modal({ baslik: 'Ruhsat 3/3!', ikon: 'kalkan', html: '<p>Otopark Ruhsatın tamam. Belediye teşviki olarak <b>+100 B</b> hesabına yattı.</p>' + kosulSatir(sv >= 3, 'Seviye: Sev. ' + sv + ' / 3') + kosulSatir(true, 'Ruhsat: 3/3') + kosulSatir(state.bayt >= 300, 'Bakiye: ' + fmt(state.bayt) + ' B / 300 B tapu') + '<p class="soluk">' + (tamam ? 'Otopark Tapusu için hazırsın.' : 'Tapu için kalan koşulları tamamla.') + '</p>',
          butonlar: [{ ad: 'Burada kal' }, { ad: 'Otopark Tapusuna Git', birincil: true, aksiyon: function () { go('sokak'); } }] });
      } else toast('Ruhsat ' + hedef + '/3', 'basari');
    }
    paneller(g, gk);
  }
  KK_UI.screen('atolye', {
    ad: 'Atölye', hud: true,
    async render(root, ctx) {
      if (ctx.ilk) { root.innerHTML = '<div class="sayfa">' + yukleniyorHtml('Görev hazırlanıyor…') + '<span class="iskelet" style="height:320px;width:100%"></span></div>'; await bekle(200); }
      const sira = sirali();
      if (!sira.length) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Görevler yüklenemedi. Testler çalıştırılamadı.', { baslik: 'Atölye açılamadı', tekrar: 'yeniden' }) + '</div>'; return; }
      const g = aktifGorev(ctx), gk = gs(g), kilit = gorevKilit(g, sira);
      if (kilit) { root.innerHTML = '<div class="sayfa sayfa-dar">' + bosHtml({ ikon: 'kilit', baslik: 'Bu görev kilitli', metin: kilit, buton: { ad: "Akademi'ye dön", aksiyon: 'geri' } }) + '</div>'; return; }
      K.calisiyor = false; K.goster = null;
      root.innerHTML = sayfa(g, gk, sira);
      K.ed = kodEditor('#atl-editor', { kod: gk.kod != null ? gk.kod : g.editor.baslangicKod, yukseklik: '320px', etiket: 'Görev kodu (C#)', id: 'atl-kod', onDegis: function (k) { gk.kod = k; save(); } });
      const kap = $('#atl-editor'); if (kap) kap.addEventListener('keydown', function (ev) { if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); const b = $('[data-action="calistir"]'); if (b && !b.disabled) b.click(); } });
    },
    leave() { K.ed = null; K.calisiyor = false; },
    actions: {
      geri() { go('akademi'); },
      yeniden() { refresh(); },
      sekme(el) { K.sekme = el.getAttribute('data-sekme'); sekmeUygula(); },
      'gorev-sec'(el) { const v = veri(); v.aktif = el.getAttribute('data-id'); K.ed = null; save(); refresh(); },
      'gorev-kilit'(el) { const sira = sirali(), g = sira.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0]; if (g) toast(gorevKilit(g, sira) || 'Görev açık.', 'uyari'); },
      ipucu(el) {
        const g = aktifGorev(); if (!g) return; const gk = gs(g), n = Number(el.getAttribute('data-seviye'));
        if (n !== gk.ipucu + 1) return; gk.ipucu = n; const k = gorevKaydi(g.id); k.ipucu = Math.max(k.ipucu || 0, n); k.ipucusuz = false; save(); paneller(g, gk);
      },
      'ornek-al'() { const g = aktifGorev(); if (!g || !K.ed) return; const o = String(g.editor.ipuclari.ornek || ''); if (!o) return; K.ed.koy(o); gs(g).kod = o; save(); toast('Örnek editöre alındı. Kendi kodunla karşılaştır.', 'bilgi'); },
      async sifirla() {
        const g = aktifGorev(); if (!g || !K.ed) return; if (!(await onayla('Başlangıç koduna dönmek istiyor musun?', 'Sıfırla', 'Vazgeç'))) return;
        const gk = gs(g); K.ed.koy(g.editor.baslangicKod); K.ed.vurgula(null); gk.kod = null; gk.sonuc = null; save(); paneller(g, gk);
      },
      'satira-git'(el) { if (!K.ed) return; K.ed.vurgula([Number(el.getAttribute('data-satir'))], { kaydir: true }); K.ed.odakla(); },
      durdur() { ai.durdur(); },
      'tapu-git'() { go('sokak'); },
      async calistir() {
        const g = aktifGorev(); if (!g || K.calisiyor) return; const gk = gs(g);
        const kod = K.ed ? K.ed.getir() : (gk.kod != null ? gk.kod : g.editor.baslangicKod), ilk = gk.calisti === 0; gk.kod = kod;
        const hatalar = O.csDenetle(kod);
        if (hatalar.length) { gk.calisti += 1; gk.sonuc = { derleme: hatalar, testler: [] }; save(); if (K.ed) K.ed.vurgula([hatalar[0].satir].filter(Boolean)); K.sekme = 'sonuc'; sekmeUygula(); paneller(g, gk); return; }
        if (K.ed) K.ed.vurgula(null);
        K.calisiyor = true; K.goster = null; paneller(g, gk); K.sekme = 'sonuc'; sekmeUygula();
        await bekle(350);
        const ac = ai.yeniIptal(); let r = null;
        try { r = await aiTestSimule({ kod: kod, testler: g.editor.testler, sozlesme: g.ad, gorevId: g.id, signal: ac.signal }); } catch (e) { r = null; }
        K.calisiyor = false;
        if (!r) { gk.sonuc = null; toast('Testler çalıştırılamadı ya da durduruldu. Kodun saklı; tekrar dene.', 'bilgi'); paneller(g, gk); return; }
        const sonuclar = g.editor.testler.map(function (t) { return r.sonuclar.filter(function (x) { return String(x.id) === String(t.id); })[0] || { id: t.id, gecti: false, gercek: '', hata: 'Sonuç alınamadı' }; });
        gk.sonuc = { testler: sonuclar, etiket: r.etiket, kaynak: r.kaynak, derleme: null }; gk.calisti += 1; save();
        for (let i = 0; i < sonuclar.length; i++) { K.goster = i; paneller(g, gk); await bekle(120); }
        K.goster = null; paneller(g, gk);
        if (sonuclar.every(function (x) { return x.gecti; })) await basari(g, gk, ilk);
      },
      async 'usta-yorumu'(el) {
        const g = aktifGorev(); if (!g || !K.ed || K.calisiyor) return; el.disabled = true;
        const ac = ai.yeniIptal(), r = await aiKodIncele({ kod: K.ed.getir(), sozlesme: g.ad, usta: (D().ustalar || {}).defne, signal: ac.signal });
        if (!r) { el.disabled = false; return; }
        K.inceleme[g.id] = r; const k = gorevKaydi(g.id), ilkKez = !k.inceleme; k.inceleme = true; save(); paneller(g, gs(g));
        if (ilkKez) await award({ xp: 10, etiket: 'Usta Yorumu', kaynak: $('#atl-sonuc') });
      }
    },
    async selftest(root, ctx) {
      const g = aktifGorev(), b0 = state.bayt, x0 = state.xp;
      await ctx.tikla('[data-action="ipucu"][data-seviye="1"]');
      if (!/görüldü/.test(ctx.metin('#atl-ipucu'))) throw new Error('İpucu basamağı açılmadı');
      await ctx.yaz('#atl-kod', 'int x = ;');
      await ctx.tikla('[data-action="calistir"]');
      await ctx.bekleSecici('.atl-hata', 3000);
      await ctx.yaz('#atl-kod', g.editor.cozum);
      await ctx.tikla('[data-action="calistir"]');
      await ctx.bekleSecici('.atl-basari', 5000);
      if (!state.gorevler[g.id].tamam) throw new Error('Görev tamam sayılmadı');
      if (!(state.xp > x0) || state.bayt < b0 + g.odul.bayt) throw new Error('Ödül yazılmadı: ' + (state.xp - x0) + ' XP, ' + (state.bayt - b0) + ' B');
      if (g.id === 'taksimetre' && (state.ruhsat.otopark !== 3 || state.bayt !== b0 + g.odul.bayt + 100)) throw new Error('Ruhsat 3/3 + 100 B teşvik işlenmedi: ' + state.ruhsat.otopark + ' · ' + state.bayt + ' B');
    }
  });
})();
