/* ==== ui/40a-ekran-ogrenme-ders.js — P1: Derslik (kart akışı, PRIMM, mini editör) + Kurul Kartı (rubrik, puan, Usta geri bildirimi, Sokratik takip, itiraz) ====
   Kaynaklar: B8 §6.7–6.8 · B3 §2–4, §8, §10 · B4 §4, §6 · KANON §3.3, §8–§9. Yapay zekâ YALNIZCA düğmeyle çağrılır (aiPuanla); otomatik yeniden deneme yok. */
(function () {
  const O = KK_UI.ogr, D = O.D, md = O.md, odak = O.odak;

  /* ======================= DERSLİK ======================= */
  const PRIMM = ['Tahmin et', 'Çalıştır', 'İncele', 'Değiştir', 'Yap'];
  const primmIdx = function (p) { const k = String(p || '').toLocaleLowerCase('tr'); for (let i = 0; i < PRIMM.length; i++) if (PRIMM[i].toLocaleLowerCase('tr') === k) return i; return 1; };
  const DR = { cikti: {}, mini: {}, usta: null };
  function drsDers(ctx) {
    const v = O.ekranVeri('derslik', { ders: null, ilerleme: {}, tahmin: {}, kartXp: {} });
    if (ctx && ctx.parametre && ctx.parametre.ders) v.ders = ctx.parametre.ders;
    let d = v.ders && O.dersBul(v.ders);
    if (!d) {
      const ds = O.dersler().filter(function (x) { return x.kartlar && x.kartlar.length && !O.dersKilit(x); });
      d = ds.filter(function (x) { return !(state.dersler[x.id] && state.dersler[x.id].mohur); })[0] || ds[ds.length - 1] || O.dersler()[0] || null;
      v.ders = d ? d.id : null;
    }
    return d;
  }
  function kartListesi(d) {
    const l = (d.kartlar || []).slice();
    const dene = l.some(function (k) { const i = primmIdx(k.primm); return i === 3 || i === 4; });
    if (d.dene && d.dene.baslangic && !dene) l.push({ sanal: 'dene', primm: 'Değiştir', baslik: 'Dene: tek satırı değiştir', metin: "Programda yalnızca işaretli satır düzenlenebilir. Değiştir, Çalıştır'a bas ve çıktıyı hedefle karşılaştır." });
    l.push({ sanal: 'ozet', primm: 'Yap', baslik: 'Özet', metin: '' });
    return l;
  }
  function denePlan(d) {
    const dn = d.dene; if (!dn || !dn.baslangic) return null;
    if (dn.satirNo && d.ornekKod) { const sat = d.ornekKod.split('\n'), e = Math.max(0, Math.min(sat.length - 1, dn.satirNo - 1)); return { sat: sat, e: e, ilk: dn.baslangic, yonerge: dn.yonerge || '' }; }
    const sat = dn.baslangic.split('\n'), e = duzenlenebilir(sat); return { sat: sat, e: e, ilk: sat[e], yonerge: dn.yonerge || '' };
  }
  function duzenlenebilir(sat) {
    let i = sat.findIndex(function (l) { return /___/.test(l); }); if (i >= 0) return i;
    for (i = sat.length - 1; i >= 0; i--) if (/^\s*\/\//.test(sat[i])) return i;
    for (i = sat.length - 1; i >= 0; i--) { const t = sat[i].trim(); if (t && t !== '{' && t !== '}') return i; }
    return 0;
  }
  function kosKod(kod, hedef) {
    const r = O.csCalistir(kod), m = /\b(?:static|public)\s+\w+\s+(\w+)\s*\(\s*int\s+\w+\s*\)/.exec(kod);
    if (r.ok && !r.cikti.trim() && m && !/Console\./.test(kod) && hedef) {
      for (let n = 0; n <= 30; n++) { const r2 = O.csCalistir(kod + '\nConsole.WriteLine(' + m[1] + '(' + n + '));'); if (r2.ok && r2.cikti.trim() === String(hedef).trim()) return { ok: true, cikti: r2.cikti, ek: 'Çağrı eklendi: Console.WriteLine(' + m[1] + '(' + n + '));' }; }
    }
    return r;
  }
  function konsolHtml(s) {
    if (!s) return '<div class="drs-bos">Çıktı burada görünür. Çalıştır\'a bas (Ctrl+Enter).</div>';
    if (s.bekliyor) return '<div class="drs-cikti-satir soluk">' + ikon('saat', 16) + ' Çalışıyor…</div>';
    if (s.ok) return (s.cikti.trim() ? s.cikti.split('\n').map(function (l) { return '<div class="drs-cikti-satir"><span class="drs-ok">&gt;</span> ' + esc(l) + '</div>'; }).join('') : '<div class="drs-cikti-satir soluk">(Çıktı yok)</div>') + (s.ek ? '<div class="drs-cikti-satir soluk">' + esc(s.ek) + '</div>' : '') + (s.hedef != null ? '<div class="drs-hedef ' + (s.tuttu ? 'tuttu' : '') + '">' + ikon(s.tuttu ? 'test-gecti' : 'bilgi', 16) + (s.tuttu ? 'Hedef çıktı tuttu.' : 'Hedef çıktı: ' + esc(s.hedef)) + '</div>' : '');
    if (s.hata.desteklenmiyor) return '<div class="drs-cikti-satir soluk">' + ikon('bilgi', 16) + ' Bu örnek Atölye\'de gerçek derleyiciyle çalışır. ' + (s.yedek ? 'Beklenen çıktı: <b>' + esc(s.yedek) + '</b>' : '') + '</div>';
    return '<div class="drs-hata" role="alert">' + ikon('uyari', 18) + '<span>' + esc(O.hataMetni(s.hata)) + '</span></div>';
  }
  function dogruIndex(k) { const sc = k.secenekler || []; if (typeof k.dogru === 'number') return k.dogru; if (/^[A-Fa-f]$/.test(String(k.dogru))) return String(k.dogru).toUpperCase().charCodeAt(0) - 65; for (let i = 0; i < sc.length; i++) if (sc[i] && sc[i].dogru === true) return i; return sc.indexOf(k.dogru); }
  function tahminHtml(d, k, idx, v) {
    const t = v.tahmin[d.id + ':' + idx];
    if (k.secenekler && k.secenekler.length) {
      return '<div class="drs-tahmin" role="radiogroup" aria-label="Tahmin seçenekleri">' + k.secenekler.map(function (s, i) {
        const durum = t ? (i === dogruIndex(k) ? ' dogru' : t.secim === i ? ' yanlis' : '') : '';
        return '<button type="button" class="secim-kart drs-sec' + durum + '" role="radio" aria-checked="' + (!!t && t.secim === i) + '" data-action="tahmin-sec" data-i="' + i + '"><span class="tkr-harf">' + ((s && s.id) || String.fromCharCode(65 + i)) + '</span><span>' + md(typeof s === 'string' ? s : s.metin) + '</span></button>';
      }).join('') + '</div>';
    }
    return '<div class="drs-tahmin"><div class="alan"><label class="etiket" for="drs-tahmin-giris">Tahminin</label><input id="drs-tahmin-giris" class="girdi mono" autocomplete="off" placeholder="Ekrana ne yazar?"' + (t ? ' value="' + esc(t.metin || '') + '"' : '') + '></div><button type="button" class="btn btn-mor btn-kucuk" data-action="tahmin-gonder">Tahmini Kaydet</button></div>';
  }
  function drsSayfa(d, kartlar, idx, v) {
    const k = kartlar[idx], n = kartlar.length, plan = denePlan(d), mini = !!plan && (k.sanal === 'dene' || primmIdx(k.primm) >= 3) && k.sanal !== 'ozet';
    const aktifPrimm = k.sanal === 'ozet' ? 4 : primmIdx(k.primm), cevrimdisi = (function () { try { return navigator.onLine === false; } catch (e) { return false; } })();
    const serit = '<ol class="drs-primm" aria-label="PRIMM adımları">' + PRIMM.map(function (p, i) { return '<li class="' + (i < aktifPrimm ? 'bitti' : i === aktifPrimm ? 'simdi' : '') + '"' + (i === aktifPrimm ? ' aria-current="step"' : '') + '>' + esc(p) + '</li>'; }).join('') + '</ol>';
    let sol = '<div class="drs-kart-ust">' + chipHtml(k.sanal === 'ozet' ? 'Özet' : k.primm, 'turkuaz') + '<small class="soluk">Kart ' + (idx + 1) + ' / ' + n + '</small></div><h2 id="drs-kart-baslik">' + esc(k.baslik || '') + '</h2>';
    if (k.sanal === 'ozet') {
      sol += '<p>Bu dersin hedefleri:</p><ul class="drs-hedefler">' + (d.hedefler || []).map(function (h) { return '<li>' + ikon('tik', 16) + '<span>' + md(h) + '</span></li>'; }).join('') + '</ul>' +
        '<p class="soluk">Sırada ' + Math.max(1, (d.sorular || []).length) + ' Usta sorusu var. Kurul her cevabı rubriğe göre puanlar; 3 sorunun 2\'sinde ≥ 70 alırsan <b>Ders Mührü</b> gelir ve görev açılır.</p>';
    } else {
      sol += '<p class="drs-metin">' + md(k.metin || '') + '</p>' + (k.kod && !mini ? '' : '');
      if (primmIdx(k.primm) === 0 && k.sanal !== 'dene') sol += tahminHtml(d, k, idx, v);
    }
    let kodPanel;
    if (mini) {
      const sat = plan.sat, e = plan.e, mevcut = DR.mini[d.id] != null ? DR.mini[d.id] : plan.ilk;
      kodPanel = (plan.yonerge ? '<p class="drs-yonerge">' + ikon('bilgi', 16) + md(plan.yonerge) + '</p>' : '') + '<div class="mini-kod" role="group" aria-label="Mini editör: yalnızca işaretli satır düzenlenebilir">' + sat.map(function (l, i) {
        if (i === e) return '<div class="mini-satir-kap"><span class="ln" aria-hidden="true">' + (i + 1) + '</span><input id="mini-satir" class="mini-satir" spellcheck="false" autocomplete="off" value="' + esc(mevcut) + '" data-input="mini-yaz" aria-label="Düzenlenebilir satır: ' + (i + 1) + '. satır"></div>';
        return '<div class="mini-kilit" aria-readonly="true"><span class="ln" aria-hidden="true">' + (i + 1) + '</span><code>' + csHl(l) + '</code></div>';
      }).join('') + '</div>';
    } else {
      const kod = k.kod || (k.sanal === 'ozet' ? d.ornekKod : '') || d.ornekKod || '';
      kodPanel = kod ? kodHtml(kod, { baslik: 'Program.cs' }) : '<div class="drs-bos">Bu kartta kod yok; metni oku ve İleri\'ye geç.</div>';
    }
    const kodVar = mini || (k.sanal !== 'ozet' && primmIdx(k.primm) === 2 ? false : !!(k.kod || d.ornekKod));
    const sag = '<section class="drs-kod" aria-label="Kod ve konsol">' + kodPanel + (kodVar ? '<div class="drs-eylem"><button type="button" class="btn btn-basari" data-action="calistir"' + (cevrimdisi ? ' disabled title="Çevrimdışısın; Çalıştır için bağlantı gerekiyor."' : '') + '>' + ikon('oynat', 18) + 'Çalıştır</button><small class="soluk">Ctrl+Enter</small>' + (mini && DR.cikti[d.id + ':' + idx] && DR.cikti[d.id + ':' + idx].tuttu ? '<button type="button" class="btn btn-hayalet btn-kucuk" data-action="panoda">Panoda Göster</button>' : '') + '</div>' +
      '<div class="drs-konsol" id="drs-konsol" role="status" aria-live="polite" aria-label="Çıktı konsolu">' + konsolHtml(DR.cikti[d.id + ':' + idx]) + '</div>' : '') + '</section>';
    const u = O.ustaBul(O.ustaId(d)), repl = (u.repliklar || [])[idx % Math.max(1, (u.repliklar || []).length)] || u.selam || 'Hazırsan devam edelim.';
    const noktalar = kartlar.map(function (x, i) { return '<span class="tkr-n' + (i < idx ? ' bitti' : i === idx ? ' simdi' : '') + '" aria-hidden="true"></span>'; }).join('');
    const son = idx >= n - 1;
    const ileri = son ? '<button type="button" class="btn btn-birincil" data-action="usta-sorusu"' + (cevrimdisi ? ' disabled title="Çevrimdışısın; Usta sorusu için bağlantı gerekiyor."' : '') + '>Usta sorusuna geç' + ikon('ok-sag', 18) + '</button>' : '<button type="button" class="btn btn-birincil" data-action="ileri">İleri' + ikon('ok-sag', 18) + '</button>';
    return '<div class="sayfa drs">' + odak({ geri: 'geri', geriAd: 'Akademi', baslik: 'Ders ' + d.id + ' · ' + d.baslik, alt: 'Kart ' + (idx + 1) + '/' + n + ' · ≈ ' + (d.dk || 10) + ' dk', yuzde: Math.round(100 * idx / Math.max(1, n - 1)), etiket: 'Ders ilerlemesi' }) + serit +
      (cevrimdisi ? '<div class="akd-uyari">' + ikon('uyari', 18) + '<span>Çevrimdışısın. Kartları okuyabilirsin; Çalıştır ve Usta sorusu için bağlantı gerekiyor.</span></div>' : '') +
      '<div class="drs-grid"><section class="kart drs-kart" role="region" aria-label="Kart ' + (idx + 1) + ' / ' + n + '" id="drs-kart" tabindex="-1">' + sol + '</section>' + sag + '</div>' +
      '<div class="diyalog drs-usta"><div class="diyalog-portre"><span class="portre">' + ustaSvg(O.ustaId(d), { boyut: 64 }) + '</span><b>' + esc(u.ad) + '</b></div><div class="balon balon-usta balon-kuyruk" id="drs-usta-balon">' + md(DR.usta || repl) + '</div></div>' +
      '<div class="drs-nav"><button type="button" class="btn btn-hayalet" data-action="onceki"' + (idx === 0 ? ' disabled' : '') + '>' + ikon('ok-sol', 18) + 'Geri</button><div class="tkr-noktalar" aria-label="Kart ' + (idx + 1) + ' / ' + n + '">' + noktalar + '</div>' + ileri + '</div></div>';
  }
  function drsKonum(ctx) {
    const d = drsDers(ctx), v = O.ekranVeri('derslik'); if (!d) return null;
    const kartlar = kartListesi(d), idx = Math.max(0, Math.min(v.ilerleme[d.id] || 0, kartlar.length - 1));
    return { d: d, v: v, kartlar: kartlar, idx: idx, k: kartlar[idx] };
  }
  function drsKod(konum) {
    const d = konum.d, k = konum.k, plan = denePlan(d), mini = !!plan && (k.sanal === 'dene' || primmIdx(k.primm) >= 3) && k.sanal !== 'ozet';
    if (mini) { const sat = plan.sat.slice(), el = $('#mini-satir'); sat[plan.e] = el ? el.value : (DR.mini[d.id] != null ? DR.mini[d.id] : plan.ilk); return { kod: sat.join('\n'), hedef: d.dene.hedefCikti, mini: true }; }
    return { kod: k.kod || (k.sanal === 'ozet' ? d.ornekKod : '') || d.ornekKod || '', hedef: null, mini: false };
  }
  async function drsCalistir() {
    const konum = drsKonum(); if (!konum) return; const { d, idx } = konum, ak = d.id + ':' + idx, g = drsKod(konum);
    DR.cikti[ak] = { bekliyor: true }; const kon = $('#drs-konsol'); if (kon) kon.innerHTML = konsolHtml(DR.cikti[ak]);
    await bekle(450);
    const r = kosKod(g.kod, g.hedef), yed = g.mini ? g.hedef : (konum.k.kod === konum.d.ornekKod || konum.k.sanal === 'ozet' ? konum.d.ornekCikti : null);
    const s = r.ok ? { ok: true, cikti: r.cikti, ek: r.ek } : { ok: false, hata: g.mini ? r.hata : Object.assign({}, r.hata, { desteklenmiyor: true }), yedek: yed };
    if (r.ok && g.hedef != null) { s.hedef = g.hedef; s.tuttu = r.cikti.trim() === String(g.hedef).trim(); }
    DR.cikti[ak] = s;
    if (s.tuttu) DR.usta = 'Çıktı hedefle aynı. Satırı kendin değiştirip doğru sonuca ulaştın; şimdi ilerleyebiliriz.';
    else if (r.ok && g.mini) DR.usta = 'Çıktı henüz hedefle aynı değil: ' + (g.hedef ? 'hedef «' + g.hedef + '». ' : '') + 'Satırı değiştirip tekrar çalıştır; ceza yok.';
    refresh();
  }
  KK_UI.screen('derslik', {
    ad: 'Derslik', hud: true,
    async render(root, ctx) {
      if (ctx.ilk) { root.innerHTML = '<div class="sayfa sayfa-dar">' + yukleniyorHtml('Ders açılıyor…') + '<span class="iskelet" style="height:220px;width:100%"></span></div>'; await bekle(220); }
      const d = drsDers(ctx);
      if (!d) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Ders yüklenemedi.', { baslik: 'Derslik açılamadı', tekrar: 'yeniden' }) + '</div>'; return; }
      const kilit = O.dersKilit(d);
      if (kilit) { root.innerHTML = '<div class="sayfa sayfa-dar">' + bosHtml({ ikon: 'kilit', baslik: 'Bu ders şu an kilitli', metin: kilit, buton: { ad: "Akademi'ye dön", aksiyon: 'geri' } }) + '</div>'; return; }
      if (!d.kartlar || !d.kartlar.length) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Bu dersin kartları yüklenemedi.', { baslik: 'Ders yüklenemedi', tekrar: 'yeniden' }) + '</div>'; return; }
      const konum = drsKonum(ctx);
      root.innerHTML = drsSayfa(konum.d, konum.kartlar, konum.idx, konum.v);
      const kart = $('#drs-kart'); if (kart && !ctx.ilk) { try { kart.focus({ preventScroll: true }); } catch (e) { /* odak yok */ } }
      const ta = $('#mini-satir'); if (ta) ta.addEventListener('keydown', function (ev) { if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); drsCalistir(); } });
    },
    actions: {
      geri() { go('akademi'); },
      yeniden() { refresh(); },
      onceki() { const k = drsKonum(); if (!k || k.idx === 0) return; DR.usta = null; k.v.ilerleme[k.d.id] = k.idx - 1; save(); refresh(); },
      async ileri(el) {
        const k = drsKonum(); if (!k || k.idx >= k.kartlar.length - 1) return; DR.usta = null;
        k.v.ilerleme[k.d.id] = k.idx + 1; save();
        if (k.idx + 1 === k.kartlar.length - 1 && !k.v.kartXp[k.d.id] && !(state.dersler[k.d.id] && state.dersler[k.d.id].mohur)) { k.v.kartXp[k.d.id] = true; save(); refresh(); await award({ xp: 10, etiket: 'Kartlar tamam', kaynak: $('#drs-kart') }); return; }
        refresh();
      },
      'tahmin-sec'(el) {
        const k = drsKonum(); if (!k) return; const i = Number(el.getAttribute('data-i')), dogru = i === dogruIndex(k.k);
        k.v.tahmin[k.d.id + ':' + k.idx] = { secim: i, dogru: dogru }; save();
        DR.usta = dogru ? 'Tahminin tuttu. Şimdi çalıştırıp bakalım.' : 'Henüz değil; kodu satır satır oku, sonra Çalıştır\'a bas. Ceza yok.'; refresh();
      },
      'tahmin-gonder'() {
        const k = drsKonum(); if (!k) return; const el = $('#drs-tahmin-giris'), metin = el ? el.value.trim() : '';
        if (!metin) { toast('Önce tahminini yaz.', 'uyari'); return; }
        const r = k.k.kod ? O.csCalistir(k.k.kod) : { ok: false }, norm = function (s) { return String(s).replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr'); };
        const dogru = r.ok ? norm(r.cikti) === norm(metin) : null; k.v.tahmin[k.d.id + ':' + k.idx] = { metin: metin, dogru: dogru }; save();
        DR.usta = dogru === true ? 'Tahminin tuttu. Şimdi çalıştırıp bakalım.' : dogru === false ? "Henüz değil; kodu satır satır oku, sonra Çalıştır'a bas. Ceza yok." : "Tahminini kaydettim. Çalıştır'a basıp karşılaştır."; refresh();
      },
      'mini-yaz'(el) { const k = drsKonum(); if (k) DR.mini[k.d.id] = el.value; },
      calistir() { return drsCalistir(); },
      panoda() { const k = drsKonum(); const s = k && DR.cikti[k.d.id + ':' + k.idx]; toast('Panoda şöyle görünecek: ' + (s && s.cikti ? s.cikti.split('\n')[0] : '') + ' — 10 sn panoda akacak.', 'basari'); },
      'usta-sorusu'() { const k = drsKonum(); if (!k) return; go('kurul', { parametre: { ders: k.d.id, soru: 0 } }); }
    },
    async selftest(root, ctx) {
      for (let i = 0; i < 12 && $('[data-action="ileri"]'); i++) {
        if ($('[data-action="calistir"]')) { await ctx.tikla('[data-action="calistir"]'); await ctx.bekleSecici('#drs-konsol .drs-cikti-satir, #drs-konsol .drs-hata, #drs-konsol .drs-bos', 2000); await ctx.bekle(60); if (/Çalışıyor/.test(ctx.metin('#drs-konsol'))) await ctx.bekle(120); }
        await ctx.tikla('[data-action="ileri"]');
      }
      await ctx.bekleSecici('[data-action="usta-sorusu"]');
      await ctx.tikla('[data-action="usta-sorusu"]');
      if (ctx.gidilen() !== 'kurul') throw new Error("Usta sorusuna geç Kurul'a gitmedi");
    }
  });

  /* ======================= KURUL KARTI ======================= */
  const K = { calisiyor: false, itiraz: false, reddet: null, hata: null, taslak: {}, ipucu: {}, ed: null, ac: null };
  /* "Baştan başla": önceki oyuncunun taslakları/ipuçları yeni oyuncuya sızmasın */
  KK_UI.sifirlaKancalari.push(function () { K.taslak = {}; K.ipucu = {}; K.hata = null; K.reddet = null; K.itiraz = false; K.calisiyor = false; DR.cikti = {}; DR.mini = {}; DR.usta = null; });
  const kayit = function () { return O.ekranVeri('kurul', { aktif: null, d: {}, kota: { gun: '', n: 0 } }); };
  const oturum = function (id) { const k = kayit(); if (!k.d[id]) k.d[id] = { soru: 0, s: {}, ozet: false, onceMuhurlu: !!(state.dersler[id] && state.dersler[id].mohur) }; return k.d[id]; };
  function kurulDers() {
    const ky = kayit(); let d = ky.aktif && O.dersBul(ky.aktif);
    if (d && !(d.sorular && d.sorular.length)) d = null;
    if (!d) {
      const ds = O.dersler().filter(function (x) { return x.sorular && x.sorular.length && x.kartlar && x.kartlar.length && !O.dersKilit(x); });
      d = ds.filter(function (x) { return !(state.dersler[x.id] && state.dersler[x.id].mohur); })[0] || ds[ds.length - 1] || null; ky.aktif = d ? d.id : null;
    }
    return d;
  }
  const band = function (p) { return p >= 85 ? { id: 'parlak', ad: 'PARLAK', ik: 'yildiz', ton: 'amber' } : p >= 70 ? { id: 'gecti', ad: 'GEÇTİ', ik: 'tik', ton: 'nane' } : p >= 40 ? { id: 'henuz', ad: 'HENÜZ DEĞİL', ik: 'saat', ton: 'amber' } : { id: 'karta', ad: 'KARTA DÖN', ik: 'kitap', ton: 'gri' }; };
  const TAM_PUAN = { 'Kavram Sorusu': ['kavramlar ve değerler doğru', 'sorunun tüm noktaları var', 'kendi cümlelerin, düzenli'], 'Çıktı Tahmini': ['çıktı doğru, gerekçe tutarlı', 'adım adım izledin', 'kısa ve anlaşılır'], 'Hata Avı': ['doğru satır ve doğru düzeltme', 'hatanın nedeni anlatıldı', 'kısa ve anlaşılır'], 'Kod Yazma': ['testleri geçen çözüm', 'tüm durumlar kapsanmış', 'okunabilir kod'] };
  const ENJEKSIYON = /(\btam puan\b|\bpuan(ı)? ver\b|\b100 ver\b|\bönceki (tüm )?(talimat|komut)|(talimat|komut)(lar)?(ı)? (unut|yok say)|\bignore (all|previous)\b|\bsystem prompt\b|\bben (bir )?(yönetici|admin)\b|\bkurul(a|'a)?[,:]? (sen|bana|lütfen))/i;
  const normKel = function (s) { return String(s || '').toLocaleLowerCase('tr').replace(/[^a-z0-9çğıöşüâî\s]/gi, ' ').split(/\s+/).filter(Boolean); };
  const gram = function (w, n) { const g = {}; for (let i = 0; i + n <= w.length; i++) g[w.slice(i, i + n).join(' ')] = 1; return g; };
  function kopyaOrani(cevap, kaynaklar) {
    const a = Object.keys(gram(normKel(cevap), 4)); if (a.length < 4) return 0; const k = {};
    kaynaklar.forEach(function (s) { Object.assign(k, gram(normKel(s), 4)); });
    return a.filter(function (x) { return k[x]; }).length / a.length;
  }
  const taslak = function (s) { return K.taslak[s.id] || (K.taslak[s.id] = {}); };
  function cevapMetni(s) {
    const t = taslak(s);
    if (s.tip === 'Çıktı Tahmini') return 'Çıktı: ' + (t.cikti || '').trim() + '\nNeden: ' + (t.neden || '').trim();
    if (s.tip === 'Hata Avı') return 'Hatalı satır: ' + (t.satir || '?') + '\nDüzeltme: ' + (t.duzeltme || '').trim() + '\nNeden: ' + (t.neden || '').trim();
    if (s.tip === 'Kod Yazma') return t.kod != null ? t.kod : (s.kod || '');
    return (t.cevap || '').trim();
  }
  function dogrula(s) {
    const t = taslak(s);
    if (s.tip === 'Çıktı Tahmini') return !(t.cikti || '').trim() ? 'Önce çıktıyı yaz.' : (t.neden || '').trim().length < 15 ? 'Nedenini en az bir cümleyle anlat.' : '';
    if (s.tip === 'Hata Avı') return !t.satir ? 'Önce hatalı satırın numarasına dokun.' : (t.duzeltme || '').trim().length < 3 ? 'Düzeltilmiş satırı yaz.' : (t.neden || '').trim().length < 15 ? 'Nedenini en az bir cümleyle anlat.' : '';
    if (s.tip === 'Kod Yazma') return cevapMetni(s).trim().length < 20 ? 'Önce çözümünü yaz.' : '';
    const n = (t.cevap || '').trim().length; return n < 40 ? 'En az 40 karakter yaz (şu an ' + n + ').' : '';
  }
  function xpYaz(d, s, ot, q, a) {
    if (ot.onceMuhurlu) return { bu: 0, satir: 'Tekrar: bu ders zaten mühürlü, 0 XP.' };
    const taban = s.xpTaban || 30, bu = O.xpHesap(taban, a.final, q.deneme);
    return { bu: bu, satir: taban + ' × ' + a.final + '/100' + (a.final >= 85 ? ' × 1,2 (parlak)' : '') + (q.deneme === 2 ? ' × 0,8 (2. deneme)' : '') + ' = ' + bu + ' XP' };
  }
  async function xpVer(d, s, ot, q, a) {
    const x = xpYaz(d, s, ot, q, a), onceki = q.xpVerilen || 0, fark = Math.max(0, x.bu - onceki);
    q.xpVerilen = Math.max(onceki, x.bu); a.xp = x.bu; a.xpSatir = x.satir; save();
    if (fark > 0) await award({ xp: fark, etiket: 'Kurul: ' + a.final + '/100', kaynak: $('.kurul-xp') });
  }
  function senkron(d, ot) {
    const k = dersKaydi(d.id);
    d.sorular.forEach(function (s) { const q = ot.s[s.id]; if (q) { k.puanlar[s.id] = Math.max(k.puanlar[s.id] || 0, q.en || 0); k.denemeler[s.id] = q.deneme; } });
    save();
  }
  const muhurSay = function (d, ot) { return d.sorular.filter(function (s) { return ot.s[s.id] && ot.s[s.id].en >= 70; }).length; };
  function bol2(t) {
    const c = String(t || '').split(/(?<=[.!?])\s+/).filter(Boolean); if (c.length < 2) return [t];
    const h = Math.ceil(c.length / 2); return [c.slice(0, h).join(' '), c.slice(h).join(' ')];
  }
  function takipSablonu(s, cevap) {
    const c = String(cevap || '').toLocaleLowerCase('tr'), eksikAlt = (s.anahtarlar || []).filter(function (k) { return !String(k).split('|').some(function (alt) { return c.indexOf(alt.toLocaleLowerCase('tr')) >= 0; }); })[0], eksik = eksikAlt ? String(eksikAlt).split('|')[0] : '';
    return eksik ? 'Cevabında «' + eksik + '» kavramına değinmedin. Onu kendi cümlenle nasıl bağlarsın?' : 'Cevabını bir örnekle destekleyebilir misin? Hangi değer neye karşılık geliyor?';
  }
  function takipDegerlendir(yanit, s) {
    const c = String(yanit).toLocaleLowerCase('tr'), isabet = (s.anahtarlar || []).filter(function (k) { return String(k).split('|').some(function (alt) { return c.indexOf(alt.toLocaleLowerCase('tr')) >= 0; }); }).length;
    return isabet >= 2 && c.length >= 25 ? 'kapandi' : (isabet >= 1 || c.length >= 40) ? 'kismen' : 'kapanmadi';
  }

  /* ---- HTML ---- */
  function rubrikHtml(s) {
    const tam = TAM_PUAN[s.tip] || TAM_PUAN['Kavram Sorusu'], rb = s.rubrik && s.rubrik.length ? s.rubrik : [{ ad: 'Doğruluk', agirlik: 50 }, { ad: 'Tamlık', agirlik: 30 }, { ad: 'Açıklık', agirlik: 20 }];
    return '<section class="panel kurul-rubrik" aria-label="Rubrik"><div class="kurul-rubrik-baslik">' + ikon('cetvel', 18) + '<b>Kurul şunlara bakar</b><small class="soluk">cevap yazarken sabit</small></div>' + rb.map(function (r, i) {
      return '<div class="kurul-olcut" id="rb-' + i + '"><span class="kurul-olcut-ad">' + esc(r.ad) + ' <b>' + r.agirlik + '</b></span><span class="kurul-olcut-cubuk"><i style="width:' + Math.round(r.agirlik * 2) + '%"></i></span><span class="kurul-olcut-tam">' + esc(r.olcut || tam[i] || '') + '</span></div>';
    }).join('') + '</section>';
  }
  function soruBandi(d, s, ot) {
    const uid = O.ustaId(d), u = O.ustaBul(uid), n = d.sorular.length;
    const kod = s.kod ? (s.tip === 'Hata Avı' && !(ot.s[s.id] && ot.s[s.id].a) ? '<pre class="kod kod-no kurul-hata-kod" aria-label="Kod: hatalı satırın numarasına dokun">' + csHl(s.kod).split('\n').map(function (h, i) {
      const sec = String(taslak(s).satir) === String(i + 1);
      return '<button type="button" class="kl kurul-satir' + (sec ? ' vurgu' : '') + '" data-action="satir-sec" data-satir="' + (i + 1) + '" aria-pressed="' + sec + '" aria-label="' + (i + 1) + '. satır"><span class="ln">' + (i + 1) + '</span>' + (h || ' ') + '</button>';
    }).join('') + '</pre>' : kodHtml(s.kod, { satirNo: s.kod.indexOf('\n') >= 0 })) : '';
    return '<section class="kart kurul-soru" aria-labelledby="kurul-soru-metin"><div class="diyalog"><div class="diyalog-portre"><span class="portre">' + ustaSvg(uid, { boyut: 72 }) + '</span><b>' + esc(u.ad) + '</b></div><div class="kurul-soru-ic"><div class="sira-s">' + chipHtml(s.tip, 'mor', 'kalem') + chipHtml('Soru ' + (ot.soru + 1) + '/' + n, 'gri') + chipHtml(s.tip === 'Hata Avı' ? 'satıra dokun' : 'rubrik açık', 'turkuaz') + '</div><p id="kurul-soru-metin" class="kurul-soru-metin">' + md(s.metin) + '</p>' + kod + '</div></div></section>';
  }
  function ipucuHtml(d, s) {
    const a = (s.anahtarlar || []).map(function (x) { return String(x).split('|')[0]; }), seviye = K.ipucu[s.id] || 0, uc = a.slice(0, 3).join(' · '), hepsi = a.slice(0, 6).join(', ');
    const fener = { 'Kavram Sorusu': 'Her kavramı ayrı bir cümleyle bağla: «… nedir ve ne işe yarar?»', 'Çıktı Tahmini': 'Kodu satır satır elinle çalıştır; her satırdan sonra değişkenlerin değerini yaz.', 'Hata Avı': 'Satırı derleyici gibi oku: sağdaki değerin türü ile soldaki kutunun türü uyuşuyor mu?', 'Kod Yazma': 'Önce sözleşmeyi cümle olarak yaz, sonra koda çevir.' }[s.tip] || 'Soruyu parçalara böl.';
    const icerik = [
      'Bu soru «' + d.baslik + '» konusundan. Şu kavramlara bak: ' + (uc || 'dersin kartları') + '.',
      fener + (hepsi ? ' Cevabında şunların çoğu geçsin: ' + hepsi + '.' : ''),
      '«' + (a[0] || '…') + ' … ; ' + (a[1] || '…') + ' … ; ' + (a[2] || '…') + ' … olduğu için …» biçiminde boşluklu bir iskelet kur, boşlukları kendi cümlenle doldur.',
      'Dersteki çalışılmış örneğe bir daha bak ve aynı şemayı soruya uyarla:\n' + (d.ornekKod || '') ];
    const ad = ['Pusula', 'Fener', 'Taslak', 'Örnek'], ik = ['pusula', 'fener', 'kalem', 'kitap'];
    return '<div class="ipucu-merdiven" aria-label="İpucu merdiveni">' + ad.map(function (x, i) {
      const durum = i < seviye ? 'gorundu' : i === seviye ? 'acik' : 'kilitli';
      return '<div class="ipucu-basamak ' + durum + '" style="--adim:' + i + '"><span class="ipucu-ik">' + ikon(ik[i], 22) + '</span><div><div class="ipucu-ad">' + x + '</div><div class="ipucu-aciklama">' + ['Hangi kavram?', 'Hangi durum?', 'Boşluklu iskelet', 'Çalışılmış örnek'][i] + '</div></div>' +
        (durum === 'acik' ? '<button type="button" class="btn btn-altin btn-kucuk" data-action="ipucu-ac" data-seviye="' + (i + 1) + '">Aç</button>' : durum === 'kilitli' ? ikon('kilit', 20) : chipHtml('görüldü', 'nane')) + (durum === 'gorundu' ? '<div class="ipucu-icerik">' + md(icerik[i]) + '</div>' : '') + '</div>';
    }).join('') + '</div><p class="mini soluk" style="margin:6px 0 0">İpucu ücretsiz ve sınırsız; Usta sorusunun XP\'sini etkilemez.</p>';
  }
  function formHtml(d, s, ot, q) {
    const a = q && q.a, t = taslak(s), kapali = !!a, genel = s.tip !== 'Çıktı Tahmini' && s.tip !== 'Hata Avı' && s.tip !== 'Kod Yazma', dogrulaSpan = '<span id="kurul-dogrula" class="mini soluk" aria-live="polite">' + esc(dogrula(s)) + '</span>';
    let alan;
    if (s.tip === 'Çıktı Tahmini') alan = '<div class="alan"><label class="etiket" for="kurul-cikti">Programın çıktısı</label><input id="kurul-cikti" class="girdi mono" autocomplete="off" data-input="yaz" data-alan="cikti" value="' + esc(t.cikti || '') + '"' + (kapali ? ' readonly' : '') + ' placeholder="Ekrana ne yazar?"></div><div class="alan"><label class="etiket" for="kurul-neden">Neden? (1–3 cümle)</label><textarea id="kurul-neden" class="girdi" rows="3" maxlength="600" data-input="yaz" data-alan="neden"' + (kapali ? ' readonly' : '') + ' placeholder="Kendi cümlelerinle anlat.">' + esc(t.neden || '') + '</textarea></div>';
    else if (s.tip === 'Hata Avı') alan = '<p class="ipucu-yazi" style="margin:0">' + (t.satir ? 'Seçilen satır: <b>' + esc(t.satir) + '</b>' : 'Koddaki hatalı satırın numarasına dokun.') + '</p><div class="alan"><label class="etiket" for="kurul-duzeltme">Düzeltilmiş satır</label><input id="kurul-duzeltme" class="girdi mono" autocomplete="off" data-input="yaz" data-alan="duzeltme" value="' + esc(t.duzeltme || '') + '"' + (kapali ? ' readonly' : '') + '></div><div class="alan"><label class="etiket" for="kurul-neden">Neden? (1–2 cümle)</label><textarea id="kurul-neden" class="girdi" rows="3" maxlength="600" data-input="yaz" data-alan="neden"' + (kapali ? ' readonly' : '') + ' placeholder="Hatanın nedenini anlat.">' + esc(t.neden || '') + '</textarea></div>';
    else if (s.tip === 'Kod Yazma') alan = '<div id="kurul-editor"></div>';
    else alan = '<div class="alan"><label class="etiket" for="kurul-cevap">Cevabın</label><textarea id="kurul-cevap" class="girdi kurul-kutu" rows="' + (kapali ? 3 : 6) + '" maxlength="1500" data-input="yaz" data-alan="cevap" aria-describedby="rb-0 rb-1 rb-2"' + (kapali ? ' readonly' : '') + ' placeholder="Kendi cümlelerinle yaz; en az 40 karakter.">' + esc(t.cevap || '') + '</textarea><div class="kurul-sayac">' + (kapali ? '' : dogrulaSpan) + '<span id="kurul-sayac" class="mini soluk">' + (t.cevap || '').length + '/1.500</span></div></div>';
    const kota = kayit().kota;
    return '<section class="kart kurul-form' + (kapali ? ' kapali' : '') + '" aria-label="Cevap">' + alan + (kapali ? '' : (genel ? '' : '<div class="kurul-sayac">' + dogrulaSpan + '</div>') + '<div class="kurul-gonder"><button type="button" id="kurul-gonder" class="btn btn-mor btn-buyuk" data-action="gonder"' + (dogrula(s) || K.calisiyor ? ' disabled' : '') + '>' + ikon('gonder', 20) + 'Cevabı Gönder</button></div><details class="kurul-ipucu"><summary>' + ikon('fener', 18) + 'İpucu çekmecesi (Pusula · Fener · Taslak · Örnek)</summary>' + ipucuHtml(d, s) + '</details>') +
      '<p class="mini soluk" style="margin:0">Kurul kotası: ' + kota.n + '/30 puanlama bugün · ' + (cevrimdisiAd()) + '</p></section>';
  }
  const cevrimdisiAd = function () { return typeof aiDurumMetni === 'function' ? aiDurumMetni() : ''; };
  function bekleHtml() {
    return '<section class="kart kurul-bekle" role="status" aria-live="polite"><span class="muhur muhur-bekle">' + ikon('muhur', 34) + '</span><h3>' + (K.itiraz ? 'Kurul ikinci kez okuyor…' : 'Kurul değerlendiriyor…') + '</h3><p class="soluk" style="margin:0">Cevabın rubriğe göre okunuyor; birkaç saniye sürebilir.</p><button type="button" class="btn btn-hayalet" data-action="durdur">' + ikon('dur', 16) + 'Durdur</button></section>';
  }
  function reddetHtml(r) {
    const m = { enjeksiyon: 'Kurul kandırılmaz. Mühür mürekkebi «puan ver» yazısını okumaz, cevabı okur. Bu deneme 0 puan; hakkın duruyor.', kopya: 'Bu cümleler ders kartından aynen gelmiş. Kartı kapat, kutuyu kendi cümlenle anlat; benzetme kullanmak serbest.', kota: 'Kurul bugünlük kapandı, cevabın sırada. XP sabah gelecek.' }[r.tur];
    return '<section class="kart kart-amber kurul-uyari" role="alert"><div class="sira-s">' + ikon('uyari', 24) + '<b>Kurul uyarısı</b>' + chipHtml(r.tur === 'kota' ? 'ders kilitlenmez' : '0 puan · hakkın duruyor', 'amber') + '</div><p style="margin:0">' + esc(m) + '</p></section>';
  }
  function bosKararHtml(d, s, ot) {
    const n = muhurSay(d, ot);
    return '<section class="kart kurul-bos"><span class="muhur">' + ikon('muhur', 34) + '</span><h3>Kurul kartın burada açılacak</h3><p class="soluk" style="margin:0">Cevabını yaz ve gönder. Kurul rubriğe göre puanlar, ' + esc(O.ustaBul(O.ustaId(d)).ad) + ' geri bildirimi söyler.</p>' + chipHtml('Mühür: ' + n + '/3 soru geçti; 2 gerekiyor', n >= 2 ? 'nane' : 'gri', 'muhur') + '</section>';
  }
  function takipHtml(d, a) {
    const uid = O.ustaId(d);
    return '<div class="kurul-takip"><div class="diyalog"><div class="diyalog-portre"><span class="portre">' + ustaSvg(uid, { boyut: 48 }) + '</span></div><div class="balon balon-usta balon-kuyruk"><div class="balon-ad">Usta bir şey soruyor' + (a.takip.tur === 2 ? ' · 2. tur' : '') + '</div>' + md(a.takip.soru) + '</div></div>' +
      '<div class="alan"><label class="etiket" for="kurul-takip-yanit">Yanıtın (en çok 300 karakter)</label><textarea id="kurul-takip-yanit" class="girdi" rows="2" maxlength="300" data-input="takip-yaz" placeholder="Kısaca anlat."></textarea></div><div class="sira-s"><button type="button" class="btn btn-birincil btn-kucuk" data-action="takip-yanit">Yanıtla</button><button type="button" class="btn btn-hayalet btn-kucuk" data-action="takip-gec">Geç</button><small class="soluk">Telafi en çok +10 puan.</small></div></div>';
  }
  function kartHtml(d, s, ot, q, a) {
    const r = a.r, p = a.final, b = band(p), MAXP = { 'Doğruluk': 50, 'Tamlık': 30, 'Açıklık': 20 }, uid = O.ustaId(d), u = O.ustaBul(uid);
    const ol = r.olcutler && r.olcutler.length ? r.olcutler : [{ ad: 'Doğruluk', puan: 0, not: '' }, { ad: 'Tamlık', puan: 0, not: '' }, { ad: 'Açıklık', puan: 0, not: '' }];
    const kriter = ol.map(function (o) { const mx = MAXP[o.ad] || 50; return '<div class="kriter"><span class="kriter-ad">' + esc(o.ad) + '</span><span class="kriter-puan">' + o.puan + ' / ' + mx + '</span>' + cubukHtml(100 * o.puan / mx, { tur: o.ad === 'Doğruluk' ? 'nane' : o.ad === 'Tamlık' ? 'xp' : 'bayt', ince: true, etiket: o.ad }) + '<span class="kriter-not">' + esc(o.not) + '</span></div>'; }).join('');
    const fb = String(r.geri_bildirim || 'Kurul kartın hazır.').replace(/\{ad\}/g, state.ad || 'Oyuncu'), parcalar = bol2(fb);
    const ozet = 'Kurul kartı: 100 üzerinden ' + p + ', ' + b.ad.toLocaleLowerCase('tr') + '. ' + ol.map(function (o) { return o.ad + ' ' + (MAXP[o.ad] || 50) + ' üzerinden ' + o.puan; }).join('. ') + '.';
    const itirazHak = state.itiraz.kalan, durum = ot.onceMuhurlu ? chipHtml('Tekrar: 0 XP', 'gri') : '<button type="button" class="chip chip-mor kurul-xp-btn" data-action="xp-dokum" aria-label="XP dökümü">' + ikon('xp', 14) + '+' + (a.xp || 0) + ' XP</button>';
    const makine = a.makine ? '<div class="kurul-makine ' + (a.makine.dogru ? 'dogru' : 'yanlis') + '">' + ikon(a.makine.dogru ? 'test-gecti' : 'test-kaldi', 16) + 'Çıktı: ' + (a.makine.dogru ? 'doğru' : 'yanlış') + ' <small class="soluk">(makine kontrolü)</small></div>' : '';
    const sonSoru = ot.soru >= d.sorular.length - 1;
    return '<section class="puan-kart kurul-karti' + (p >= 85 ? ' parli' : '') + '" role="status" aria-live="polite" aria-label="' + esc(ozet) + '"><div class="puan-kart-etiket">Kurul Kartı</div>' +
      '<div class="puan-kart-ust" style="margin-top:10px">' + halkaHtml(p, { boyut: 104, tur: p >= 70 ? 'nane' : 'amber', alt: 'PUAN', etiket: 'Puan: ' + p + ' / 100' }) + '<div class="yigin-s" style="flex:1 1 150px"><span class="kmuhur kmuhur-' + b.id + '">' + ikon(b.ik, 20) + b.ad + '</span><div class="sira-s">' + durum + chipHtml(r.kaynak === 'claude' ? 'Claude' : 'Çevrimdışı demo', r.kaynak === 'claude' ? 'mor' : 'amber') + (a.telafi ? chipHtml('Telafi +' + a.telafi, 'nane', 'tik') : '') + '</div></div></div>' +
      (r.kopya_suphesi ? '<p class="kurul-uyari-satir">' + ikon('uyari', 18) + 'Kopya şüphesi: bu deneme 0 puan. Kutuyu kendi cümlenle yeniden anlat; hakkın duruyor.</p>' : '') + (r.uyari ? '<p class="mini soluk">' + esc(r.uyari) + '</p>' : '') + makine +
      '<div class="kurul-kriterler">' + kriter + '</div><div class="diyalog kurul-geri"><div class="diyalog-portre"><span class="portre">' + ustaSvg(uid, { boyut: 56 }) + '</span><b>' + esc(u.ad) + '</b></div><div class="kurul-balonlar">' + parcalar.map(function (x, i) { return '<div class="balon balon-usta' + (i === 0 ? ' balon-kuyruk' : '') + ' kurul-yaz" style="--gecikme:' + (i * 0.5) + 's">' + md(x) + '</div>'; }).join('') + '</div></div>' +
      (a.takip && !a.takip.bitti ? takipHtml(d, a) : '') + '<div class="kurul-xp"><span class="mini soluk">' + esc(a.xpSatir || '') + '</span>' + chipHtml('Mühür: ' + muhurSay(d, ot) + '/3 soru geçti; 2 gerekiyor', muhurSay(d, ot) >= 2 ? 'nane' : 'gri', 'muhur') + '</div>' +
      (p < 70 && q.deneme === 2 && !(a.takip && !a.takip.bitti) ? '<p class="mini soluk">Bu soru için 2 hakkını da kullandın. Telafi Turu 10 dakika sonra açılacak.</p>' : '') +
      '<div class="kurul-eylem"><button type="button" class="btn btn-hayalet btn-kucuk" data-action="itiraz"' + (q.itiraz || itirazHak <= 0 ? ' disabled title="' + (q.itiraz ? 'Bu soru için itiraz hakkını kullandın.' : 'Bugünkü 3 itiraz hakkın bitti.') + '"' : '') + '>İtiraz et · ' + itirazHak + '/3</button>' +
      (p < 70 && q.deneme === 1 ? '<button type="button" class="btn btn-mor btn-kucuk" data-action="tekrar-dene">Tekrar dene ×0,8</button>' : '') +
      '<button type="button" class="btn btn-birincil" data-action="sonraki">' + (sonSoru ? 'Dersi bitir' : 'Sonraki soru') + ikon('ok-sag', 18) + '</button></div></section>';
  }
  function ozetHtml(d, ot) {
    const n = muhurSay(d, ot), mohur = n >= 2, toplamXp = d.sorular.reduce(function (t, s) { return t + ((ot.s[s.id] && ot.s[s.id].xpVerilen) || 0); }, 0), beklemeSn = Math.max(0, Math.round(((state.bekleme['telafi-' + d.id] || 0) - Date.now()) / 1000));
    const satirlar = d.sorular.map(function (s, i) { const q = ot.s[s.id], p = q ? q.en : 0; return '<li class="kurul-ozet-satir ' + (p >= 70 ? 'gecti' : 'kaldi') + '">' + ikon(p >= 70 ? 'test-gecti' : 'test-kaldi', 22) + '<span><b>Soru ' + (i + 1) + '</b> · ' + esc(s.tip) + '</span><b>' + p + '</b></li>'; }).join('');
    return '<div class="sayfa sayfa-dar kurul-ozet">' + odak({ geri: 'geri', geriAd: 'Akademi', baslik: 'Ders ' + d.id + ' · ' + d.baslik, alt: 'Ders sonu', yuzde: 100 }) +
      '<section class="puan-kart ' + (mohur ? 'parli' : '') + '" role="status"><div class="puan-kart-etiket">Ders Mührü</div><div class="puan-kart-ust" style="margin-top:10px"><span class="muhur ' + (mohur ? 'muhur-bas' : '') + '">' + ikon('muhur', 40) + '</span><div class="yigin-s" style="flex:1 1 200px"><h2>' + (mohur ? 'Mühür alındı!' : 'Mühür henüz yok') + '</h2><p style="margin:0">' + n + '/3 soru geçti; 2 gerekiyordu.' + (ot.onceMuhurlu ? ' (Tekrar: XP yok.)' : ' Bu derste kazandığın XP: <b>' + fmt(toplamXp + ((O.ekranVeri('derslik').kartXp || {})[d.id] ? 10 : 0)) + '</b>.') + '</p></div></div>' +
      '<ul class="kurul-ozet-liste">' + satirlar + '</ul>' +
      (mohur ? '<p>' + (d.gorev ? ikon('gorev', 18) + ' <b>' + esc((O.D().gorevler || []).filter(function (g) { return g.id === d.gorev; }).map(function (g) { return g.ad; })[0] || d.gorev) + '</b> görevi artık açık.' : 'Sıradaki ders açıldı.') + '</p><div class="kurul-eylem"><button type="button" class="btn btn-birincil btn-buyuk" data-action="gorev-git">' + (d.gorev ? 'Göreve Geç' : 'Akademi') + ikon('ok-sag', 18) + '</button><button type="button" class="btn btn-hayalet" data-action="geri">Akademi</button></div>' :
      '<div class="kurul-uyari-satir">' + ikon('saat', 18) + '<span>Telafi Turu <b id="telafi-sayac">' + zamanKalan(beklemeSn || 600) + '</b> sonra açılacak. Cezası yok; XP ders tavanı içinde kalır.</span></div><div class="kurul-eylem"><button type="button" class="btn btn-mor" data-action="telafi">Telafi Turunu başlat (demo: beklemeyi atla)</button><button type="button" class="btn btn-hayalet" data-action="derse-don">Kartlara dön</button><button type="button" class="btn btn-hayalet" data-action="geri">Akademi</button></div>') + '</section></div>';
  }
  function sayfaHtml(d, s, ot) {
    const q = ot.s[s.id] || null, a = q && q.a, n = d.sorular.length;
    let karar;
    if (K.calisiyor) karar = bekleHtml(); else if (a) karar = kartHtml(d, s, ot, q, a); else if (K.reddet) karar = reddetHtml(K.reddet); else if (K.hata) karar = '<section class="kart">' + hataHtml(K.hata, { baslik: 'Sonucu alamadık', tekrar: 'gonder', tekrarAd: 'Tekrar Dene' }) + '</section>'; else karar = bosKararHtml(d, s, ot);
    return '<div class="sayfa kurul">' + odak({ geri: 'geri', geriAd: 'Derslik', baslik: 'Ders ' + d.id + ' · Soru ' + (ot.soru + 1) + '/' + n, alt: d.baslik, yuzde: Math.round(100 * (ot.soru + (a ? 1 : 0)) / n), etiket: 'Ders ilerlemesi', sag: '<span class="chip chip-gri" data-ai-rozet>' + esc(cevrimdisiAd()) + '</span>' }) +
      soruBandi(d, s, ot) + rubrikHtml(s) + '<div class="kurul-iki">' + formHtml(d, s, ot, q) + '<div class="kurul-karar" id="kurul-karar">' + karar + '</div></div></div>';
  }
  function kurEditor(s) {
    const kap = $('#kurul-editor'); if (!kap) return;
    K.ed = kodEditor(kap, { kod: taslak(s).kod != null ? taslak(s).kod : (s.kod || ''), yukseklik: '200px', etiket: 'Çözümün', id: 'kurul-kod', onDegis: function (kod) { taslak(s).kod = kod; guncelleGonder(s); } });
  }
  function guncelleGonder(s) {
    const b = $('#kurul-gonder'), m = $('#kurul-dogrula'), msg = dogrula(s); if (b) b.disabled = !!msg || K.calisiyor; if (m) m.textContent = msg;
    const sy = $('#kurul-sayac'); if (sy) { const n = (taslak(s).cevap || '').length; sy.textContent = n.toLocaleString('tr-TR') + '/1.500'; sy.classList.toggle('amber', n >= 1400); }
  }
  const aktifSoru = function () { const d = kurulDers(); if (!d) return null; const ot = oturum(d.id); return { d: d, ot: ot, s: d.sorular[Math.min(ot.soru, d.sorular.length - 1)] }; };
  const yenile = function () { if (KK_UI.current() === 'kurul') refresh(); };

  async function puanla(d, s, ot, tam, derin) {
    const ac = ai.yeniIptal(), u = O.ustaBul(O.ustaId(d));
    return aiPuanla({ usta: u, ders: d, soruTipi: s.tip, soru: s.metin + (s.kod ? '\n' + s.kod : ''), rubrik: s.rubrik, cevap: tam, ornekIyiCevap: s.ornekIyiCevap, anahtarlar: s.anahtarlar, signal: ac.signal });
  }
  KK_UI.screen('kurul', {
    ad: 'Kurul Kartı', hud: true,
    render(root, ctx) {
      const p = ctx.parametre;
      if (p && p.ders) { kayit().aktif = p.ders; const o = oturum(p.ders); if (typeof p.soru === 'number') { o.soru = p.soru; o.ozet = false; } K.reddet = null; K.hata = null; }
      const d = kurulDers();
      if (!d) { root.innerHTML = '<div class="sayfa sayfa-dar">' + bosHtml({ ikon: 'kitap', baslik: 'Henüz Usta sorusu yok', metin: 'Önce bir dersin kartlarını bitir; sorular Derslik\'ten sonra gelir.', buton: { ad: "Akademi'ye git", aksiyon: 'geri' } }) + '</div>'; return; }
      const ot = oturum(d.id);
      if (ot.ozet) { root.innerHTML = ozetHtml(d, ot); KK_UI.aralik(function () { const e = $('#telafi-sayac'); if (e) e.textContent = zamanKalan(Math.max(0, Math.round(((state.bekleme['telafi-' + d.id] || 0) - Date.now()) / 1000))); }, 1000); return; }
      const s = d.sorular[Math.min(ot.soru, d.sorular.length - 1)];
      root.innerHTML = sayfaHtml(d, s, ot);
      if (s.tip === 'Kod Yazma' && !(ot.s[s.id] && ot.s[s.id].a)) kurEditor(s);
      const kutu = $('#kurul-cevap, #kurul-neden, #kurul-cikti'); if (kutu && !(ot.s[s.id] && ot.s[s.id].a)) kutu.addEventListener('keydown', function (ev) { if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); const b = $('#kurul-gonder'); if (b && !b.disabled) b.click(); } });
    },
    actions: {
      geri() { const d = kurulDers(); if (d && KK_UI.current() === 'kurul') go(oturum(d.id).ozet ? 'akademi' : 'derslik', d && !oturum(d.id).ozet ? { parametre: { ders: d.id } } : undefined); },
      yeniden() { refresh(); },
      yaz(el) { const x = aktifSoru(); if (!x) return; taslak(x.s)[el.getAttribute('data-alan')] = el.value; K.reddet = null; guncelleGonder(x.s); },
      'satir-sec'(el) { const x = aktifSoru(); if (!x) return; taslak(x.s).satir = el.getAttribute('data-satir'); refresh(); },
      'ipucu-ac'(el) { const x = aktifSoru(); if (!x) return; K.ipucu[x.s.id] = Math.max(K.ipucu[x.s.id] || 0, Number(el.getAttribute('data-seviye'))); refresh(); const dt = $('.kurul-ipucu'); if (dt) dt.open = true; },
      durdur() { ai.durdur(); },
      async gonder(el) {
        const x = aktifSoru(); if (!x || K.calisiyor) return; const { d, ot, s } = x;
        if (dogrula(s)) { toast(dogrula(s), 'uyari'); return; }
        const tam = cevapMetni(s), ky = kayit(), bg = O.bugun();
        if (ky.kota.gun !== bg) ky.kota = { gun: bg, n: 0 };
        if (ENJEKSIYON.test(tam)) { K.reddet = { tur: 'enjeksiyon' }; K.hata = null; refresh(); return; }
        const kaynaklar = (d.kartlar || []).map(function (k) { return (k.metin || '') + ' ' + (k.kod || ''); }).concat([d.ornekKod || '']);
        if (s.tip === 'Kavram Sorusu' && kopyaOrani(tam, kaynaklar) >= 0.6) { K.reddet = { tur: 'kopya' }; K.hata = null; refresh(); return; }
        if (ky.kota.n >= 30) { K.reddet = { tur: 'kota' }; refresh(); return; }
        K.calisiyor = true; K.itiraz = false; K.hata = null; K.reddet = null; refresh();
        await bekle(650);
        let r = null;
        try { r = await puanla(d, s, ot, tam); } catch (e) { K.hata = 'Sonucu alamadık. Cevabın saklı; tekrar deneyebilirsin.'; }
        K.calisiyor = false;
        if (r && r.hataKodu === 'invalid_json') { K.hata = r.hataMesaji || 'Kurul cevabı okunamadı. Tekrar dene.'; r = null; }
        if (!r) { if (!K.hata) toast('Değerlendirme durduruldu; cevabın saklı.', 'bilgi'); yenile(); return; }
        ky.kota.n += 1;
        const p = r.kopya_suphesi ? 0 : r.puan, q = ot.s[s.id] || (ot.s[s.id] = { deneme: 1, en: 0, xpVerilen: 0, itiraz: false, a: null });
        const a = { r: r, puan: p, final: p, telafi: 0, kapandi: false, takip: null, cevap: tam };
        if (s.tip === 'Çıktı Tahmini' && s.kod) { const m = O.csCalistir(s.kod); if (m.ok && m.cikti.trim()) { const gir = (taslak(s).cikti || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr'); a.makine = { dogru: gir === m.cikti.replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr') }; } }
        if (!r.kopya_suphesi && p >= 40 && p < 85) a.takip = { soru: r.takip_sorusu || takipSablonu(s, tam), tur: 1, bitti: false };
        else a.kapandi = true;
        q.a = a; q.en = Math.max(q.en, p); K.ipucu[s.id] = K.ipucu[s.id] || 0; senkron(d, ot);
        const xv = xpYaz(d, s, ot, q, a); a.xp = xv.bu; a.xpSatir = xv.satir;
        if (KK_UI.current() === 'kurul') refresh();
        await xpVer(d, s, ot, q, a);
        if (KK_UI.current() === 'kurul') refresh();
      },
      async 'takip-yanit'() {
        const x = aktifSoru(); if (!x) return; const { d, ot, s } = x, q = ot.s[s.id], a = q && q.a; if (!a || !a.takip || a.takip.bitti) return;
        const el = $('#kurul-takip-yanit'), yanit = el ? el.value.trim() : '';
        if (yanit.length < 8) { toast('Yanıtın biraz daha uzun olsun (en az 8 karakter).', 'uyari'); return; }
        if (ENJEKSIYON.test(yanit)) { toast('Kurul kandırılmaz: bu yanıt değerlendirilmedi.', 'uyari'); return; }
        await bekle(500);
        const sonuc = takipDegerlendir(yanit, s), tur = a.takip.tur, tablo = { 1: { kapandi: 10, kismen: 5, kapanmadi: 0 }, 2: { kapandi: 5, kismen: 2, kapanmadi: 0 } }[tur][sonuc];
        a.telafi = Math.min(10, a.telafi + tablo); a.final = Math.min(100, a.puan + a.telafi);
        if (tur === 1 && sonuc === 'kismen' && a.final < 85) { a.takip = { soru: 'Doğru yöndesin. Kalan boşluğu kapat: ' + takipSablonu(s, yanit), tur: 2, bitti: false }; }
        else { a.takip.bitti = true; a.kapandi = true; }
        q.en = Math.max(q.en, a.final); senkron(d, ot); toast(tablo ? 'Telafi: +' + tablo + ' → ' + a.final : 'Telafi yok; kartı yeniden oku.', tablo ? 'basari' : 'bilgi');
        refresh(); await xpVer(d, s, ot, q, a); yenile();
      },
      'takip-gec'() { const x = aktifSoru(); if (!x) return; const q = x.ot.s[x.s.id]; if (q && q.a && q.a.takip) { q.a.takip.bitti = true; q.a.kapandi = true; } save(); refresh(); },
      'takip-yaz'() { /* yalnızca değer okunur */ },
      'xp-dokum'() { const x = aktifSoru(); if (!x) return; const q = x.ot.s[x.s.id]; toast((q && q.a && q.a.xpSatir) || 'XP dökümü yok.', 'bilgi'); },
      'tekrar-dene'() { const x = aktifSoru(); if (!x) return; const q = x.ot.s[x.s.id]; if (!q || q.deneme !== 1) return; q.deneme = 2; q.a = null; K.taslak[x.s.id] = {}; K.reddet = null; K.hata = null; senkron(x.d, x.ot); toast('2. deneme: XP ×0,8; iki denemenin yükseği kalır.', 'bilgi'); refresh(); },
      itiraz() {
        const x = aktifSoru(); if (!x) return; const q = x.ot.s[x.s.id];
        if (!q || !q.a) return; if (q.itiraz) { toast('Bu soru için itiraz hakkını kullandın.', 'uyari'); return; } if (state.itiraz.kalan <= 0) { toast('Bugünkü 3 itiraz hakkın bitti.', 'uyari'); return; }
        modal({ baslik: 'İtiraz et', ikon: 'kalkan', html: '<p>Kurul kartı ikinci kez, ilk puanı görmeden okunur (Opus kör okuma). Fark 15 puan veya fazlaysa yeni puan geçerli olur; ceza yoktur.</p><div class="alan"><label class="etiket" for="itiraz-neden">İtiraz nedenin</label><textarea id="itiraz-neden" class="girdi" rows="3" maxlength="300" placeholder="Hangi noktayı yanlış değerlendirdiğini düşünüyorsun?"></textarea><span id="itiraz-hata" class="hata-yazi" hidden>En az 10 karakter yaz.</span></div>',
          butonlar: [{ ad: 'Vazgeç' }, { ad: 'İtirazı gönder', birincil: true, aksiyon: function (m) { const t = $('#itiraz-neden', m.el); if (!t || t.value.trim().length < 10) { const h = $('#itiraz-hata', m.el); if (h) h.hidden = false; return false; } itirazYap(x, q); } }] });
      },
      sonraki() {
        const x = aktifSoru(); if (!x) return; const { d, ot, s } = x, q = ot.s[s.id];
        if (q && q.a && !q.a.kapandi) { if (q.a.takip) q.a.takip.bitti = true; q.a.kapandi = true; }
        K.reddet = null; K.hata = null;
        if (ot.soru >= d.sorular.length - 1) {
          ot.ozet = true; const n = muhurSay(d, ot), k = dersKaydi(d.id);
          if (n >= 2) { if (!k.mohur) { k.mohur = true; k.tamam = true; konfeti({ adet: 70 }); toast('Ders Mührü! ' + d.id + ' mühürlendi.', 'basari'); } delete state.bekleme['telafi-' + d.id]; }
          else state.bekleme['telafi-' + d.id] = state.bekleme['telafi-' + d.id] || Date.now() + 600000;
          senkron(d, ot); hud();
        } else ot.soru += 1;
        save(); refresh();
      },
      telafi() {
        const d = kurulDers(); if (!d) return; const ot = oturum(d.id), yeni = { soru: 0, s: {}, ozet: false, onceMuhurlu: ot.onceMuhurlu };
        d.sorular.forEach(function (s) { const q = ot.s[s.id]; if (q) yeni.s[s.id] = { deneme: 1, en: q.en, xpVerilen: q.xpVerilen || 0, itiraz: false, a: null }; });
        kayit().d[d.id] = yeni; delete state.bekleme['telafi-' + d.id]; K.taslak = {}; K.ipucu = {}; save(); toast('Telafi Turu başladı: sorulara yeniden çalış.', 'bilgi'); refresh();
      },
      'derse-don'() { const d = kurulDers(); if (d) go('derslik', { parametre: { ders: d.id } }); },
      'gorev-git'() { const d = kurulDers(); go(d && d.gorev ? 'atolye' : 'akademi', d && d.gorev ? { parametre: { gorev: d.gorev } } : undefined); }
    },
    async selftest(root, ctx) {
      const d = kurulDers(), x0 = state.xp, doldur = function (s) { return (s.anahtarlar || []).slice(0, 6).map(function (x) { return String(x).split('|')[0]; }).join(' ve ') + ' kavramlarını kendi cümlelerimle birbirine bağlayarak anlatıyorum; birlikte çalışırlar.'; };
      for (let i = 0; i < d.sorular.length; i++) {
        const s = d.sorular[i];
        if (s.tip === 'Çıktı Tahmini') { await ctx.yaz('#kurul-cikti', '9'); await ctx.yaz('#kurul-neden', doldur(s)); }
        else if (s.tip === 'Hata Avı') { await ctx.tikla('[data-action="satir-sec"][data-satir="1"]'); await ctx.yaz('#kurul-duzeltme', 'düzeltilmiş satır'); await ctx.yaz('#kurul-neden', doldur(s)); }
        else if (s.tip === 'Kod Yazma') { await ctx.yaz('#kurul-kod', 'static int F(int x) { return x; }'); }
        else await ctx.yaz('#kurul-cevap', doldur(s));
        await ctx.tikla('[data-action="gonder"]');
        await ctx.bekleSecici('.kurul-karti', 4000);
        if (i === 0) {
          if (!(state.xp > x0)) throw new Error('Kurul puanından sonra state.xp artmadı');
          if (!/Doğruluk/.test(ctx.metin('.kurul-karti')) || !/Tamlık/.test(ctx.metin('.kurul-karti')) || !/Açıklık/.test(ctx.metin('.kurul-karti'))) throw new Error('Kurul kartında 3 ölçüt görünmüyor');
          if (!$('.kurul-karti .halka')) throw new Error('Puan halkası yok');
        }
        await ctx.tikla('[data-action="sonraki"]');
      }
      await ctx.bekleSecici('.kurul-ozet', 2000);
    }
  });
  async function itirazYap(x, q) {
    const { d, ot, s } = x, a = q.a; state.itiraz.kalan = Math.max(0, state.itiraz.kalan - 1); q.itiraz = true; K.itiraz = true; K.calisiyor = true; save(); refresh();
    await bekle(900);
    let r = null; try { r = await puanla(d, s, ot, a.cevap, true); } catch (e) { r = null; }
    K.calisiyor = false; K.itiraz = false;
    if (!r) { toast('İtiraz okuması durduruldu; hakkın kullanıldı.', 'bilgi'); yenile(); return; }
    const fark = Math.abs(r.puan - a.puan);
    if (r.kaynak === 'claude' && fark >= 15) { a.puan = Math.max(a.puan, r.puan); a.r = r; a.final = Math.min(100, a.puan + a.telafi); toast('İkinci okuma: yeni puan ' + a.final + '.', 'basari'); }
    else toast(r.kaynak === 'claude' ? 'İkinci okuma ilk puanı doğruladı (fark ' + fark + ' < 15).' : 'Demo: Opus ikinci okuma simüle edildi; çevrimdışı modda puan değişmedi.', 'bilgi');
    q.en = Math.max(q.en, a.final); senkron(d, ot); refresh(); await xpVer(d, s, ot, q, a); yenile();
  }
})();
