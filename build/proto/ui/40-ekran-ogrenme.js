/* ==== ui/40-ekran-ogrenme.js — P1: ortak yardımcılar (KK_UI.ogr) · Akademi Lobisi · Metro Haritası · Günlük Tekrar ====
   Derslik + Kurul Kartı: 40a-ekran-ogrenme-ders.js · Atölye: 40b-ekran-ogrenme-atolye.js (ikisi de KK_UI.ogr'u kullanır).
   Kaynaklar: B8 §6.6, §6.15, §6.16 · B3 §2–4, §8 · B4 §4, §6, §8 · KANON §3–§4, §6, §8–§9. */
(function () {
  /* ---------- veri erişimi (KK_CORE.DATA; sözleşme brief/04 §3) ---------- */
  const D = function () { return (typeof KK_CORE !== 'undefined' && KK_CORE.DATA) || {}; };
  const dersler = function () { return D().dersler || []; };
  const dersBul = function (id) { return dersler().filter(function (d) { return d.id === id; })[0] || null; };
  const semtBul = function (id) { return (D().semtler || []).filter(function (s) { return s.id === id; })[0] || null; };
  const ustaBul = function (id) { return (D().ustalar || {})[id] || { ad: 'Usta', kisilik: 'sıcak ve sabırlı', renk: '#F29A4A', repliklar: [] }; };
  const ustaId = function (d) { const s = d && semtBul(d.semt); return (s && s.usta) || 'defne'; };
  const p2 = function (n) { return String(n).padStart(2, '0'); };
  const bugun = function () { const d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); };
  const gunFarki = function (a, b) { const t = function (s) { const q = String(s).split('-'); return Date.UTC(+q[0], +q[1] - 1, +q[2]); }; return Math.round((t(b) - t(a)) / 86400000); };
  /** state.ekran[token] (ekranın kendi verisi); eksik alanları varsayılanla tamamlar. */
  const ekranVeri = function (token, varsayilan) {
    if (!state.ekran[token] || typeof state.ekran[token] !== 'object') state.ekran[token] = {};
    const v = state.ekran[token];
    Object.keys(varsayilan || {}).forEach(function (k) { if (v[k] === undefined) v[k] = JSON.parse(JSON.stringify(varsayilan[k])); });
    return v;
  };
  const tekrarKayit = function () { return ekranVeri('tekrar', { dogruSeri: {}, dondurucu: 0, paket: null, eskiSeri: 0, hafta: '' }); };
  const kisaMetin = function (s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  /** "1.3" → "1.3'ün" (Türkçe iyelik eki, son sayının okunuşuna göre). */
  function ekIn(id) {
    const son = parseInt(String(id).split('.').pop(), 10) || 0, t = { 1: 'in', 2: 'nin', 3: 'ün', 4: 'ün', 5: 'in', 6: 'nın', 7: 'nin', 8: 'in', 9: 'un' };
    return id + "'" + (son % 10 === 0 ? 'un' : t[son % 10]);
  }
  /** Kullanıcı metni için: kaçış + `kod` + **kalın** + satır sonu. */
  function md(s) { return esc(String(s == null ? '' : s).replace(/\{ad\}/g, state.ad || 'Oyuncu')).replace(/`([^`]+)`/g, '<code class="kod-ic">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }
  /** Odak şeridi (HUD'un altında): geri düğmesi + başlık + ince ilerleme çizgisi. */
  function odak(o) {
    return '<div class="odak"><button type="button" class="btn btn-hayalet btn-kucuk" data-action="' + o.geri + '">' + ikon('ok-sol', 18) + '<span>' + esc(o.geriAd) + '</span></button>' +
      '<div class="odak-baslik"><b>' + esc(o.baslik) + '</b>' + (o.alt ? '<small>' + esc(o.alt) + '</small>' : '') + '</div>' + (o.sag || '') +
      cubukHtml(o.yuzde || 0, { tur: 'xp', ince: true, sessiz: true, etiket: o.etiket || 'İlerleme' }) + '</div>';
  }
  /** Soru XP'si (KANON §3.3): taban × puan/100; ≥70'te en az %50; denediyse en az 5; 85+ ×1,2; 2. deneme ×0,8. */
  function xpHesap(taban, puan, deneme) {
    if (typeof KK_CORE !== 'undefined' && typeof KK_CORE.xpHesapla === 'function') {
      try { const v = KK_CORE.xpHesapla({ taban: taban, puan: puan, deneme: deneme, ipucusuz: false }); if (isFinite(v)) return Math.round(v); } catch (e) { /* yedek formül */ }
    }
    let x = taban * puan / 100;
    if (puan >= 70) x = Math.max(x, taban * 0.5);
    if (puan > 0) x = Math.max(x, 5);
    if (puan >= 85) x *= 1.2;
    if (deneme === 2) x *= 0.8;
    return Math.round(x);
  }

  /* ---------- ders durumu (Metro/Akademi/Derslik ortak) ---------- */
  function dersKilit(d) {
    const s = semtBul(d.semt);
    if (s && s.durum === 'kilitli') {
      const kosul = String(s.insaatNotu || '').replace(/^[^:]*:\s*/, '');
      return kosul ? s.ad + ' dersleri ' + kosul + ' açılıyor.' : s.ad + ' dersleri henüz açılmadı.';
    }
    const m = (D().moduller || []).filter(function (x) { return (x.dersler || []).indexOf(d.id) >= 0; })[0];
    const sira = m ? m.dersler : dersler().filter(function (x) { return x.semt === d.semt; }).map(function (x) { return x.id; });
    const i = sira.indexOf(d.id);
    if (i > 0) { const onceki = sira[i - 1]; if (!(state.dersler[onceki] && state.dersler[onceki].mohur)) return 'Önce ' + ekIn(onceki) + ' Mührü gerekiyor.'; }
    if ((!d.kartlar || !d.kartlar.length) && d.durum === 'kilitli') return 'Bu dersin kartları henüz yayında değil.';
    return '';
  }
  /** → { durum: 'kilitli'|'acik'|'basladi'|'muhurlu'|'altin', neden } */
  function durak(d) {
    const k = state.dersler[d.id];
    if (k && k.mohur) return { durum: ((tekrarKayit().dogruSeri || {})[d.id] || 0) >= 3 ? 'altin' : 'muhurlu', neden: '' };
    const neden = dersKilit(d);
    if (neden) return { durum: 'kilitli', neden: neden };
    const ilerleme = ((ekranVeri('derslik').ilerleme || {})[d.id] || 0) > 0 || (k && Object.keys(k.puanlar || {}).length > 0);
    return { durum: ilerleme ? 'basladi' : 'acik', neden: '' };
  }
  const DURUM_AD = { kilitli: 'Kilitli', acik: 'Açık', basladi: 'Sürüyor', muhurlu: 'Mühürlü', altin: 'Altın' };
  const DURUM_CHIP = { kilitli: 'gri', acik: 'turkuaz', basladi: 'amber', muhurlu: 'nane', altin: 'amber' };
  const DURUM_IKON = { kilitli: 'kilit', acik: 'oynat', basladi: 'kalem', muhurlu: 'tik', altin: 'yildiz' };
  function soruTipleri(d) { const g = {}; (d.sorular || []).forEach(function (s) { g[s.tip] = 1; }); return Object.keys(g); }

  /* ---------- C# mini yorumlayıcı (Derslik "Çalıştır", Kurul Çıktı Tahmini, Atölye derleme denetimi) ---------- */
  //#CS-BASLA
  const CS_T = { int: 'int', long: 'int', short: 'int', byte: 'int', uint: 'int', ulong: 'int', double: 'double', float: 'double', decimal: 'double', string: 'string', bool: 'bool', char: 'char', var: 'var', void: 'void' };
  const CS_DESTEKSIZ = { switch: 1, foreach: 1, do: 1, try: 1, catch: 1, throw: 1, new: 1, using: 1, namespace: 1, class: 1, struct: 1, enum: 1, interface: 1, lock: 1, goto: 1, yield: 1, async: 1, await: 1, delegate: 1, record: 1, checked: 1 };
  const CS_MOD = { static: 1, public: 1, private: 1, protected: 1, internal: 1, readonly: 1, const: 1 };
  function csHata(kod, mesaj, satir, ek) { return Object.assign({ kod: kod, mesaj: mesaj, satir: satir || 0 }, ek || {}); }
  function csDest(satir, ne) { return csHata('', 'Bu önizleme «' + (ne || 'bu söz dizimi') + "» kullanımını çalıştıramıyor; gerçek derleyici Atölye'de.", satir, { desteklenmiyor: true }); }
  function csTokenle(src) {
    const t = [], n = src.length; let i = 0, l = 1;
    const ID0 = /[A-Za-z_À-ɏ@]/, ID1 = /[A-Za-z0-9_À-ɏ]/;
    const OPS2 = ['++', '--', '+=', '-=', '*=', '/=', '%=', '==', '!=', '<=', '>=', '&&', '||', '=>', '??'];
    const kacis = { n: '\n', t: '\t', r: '\r', '0': '\0', '"': '"', "'": "'", '\\': '\\' };
    while (i < n) {
      const c = src[i];
      if (c === '\n') { l++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
      if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
      if (c === '/' && src[i + 1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') l++; i++; } i += 2; continue; }
      if (c === '"' || (c === '$' && src[i + 1] === '"')) {
        const ip = c === '$', l0 = l; i += ip ? 2 : 1;
        let metin = '', parcalar = [], kapandi = false;
        while (i < n) {
          const d = src[i];
          if (d === '\n') break;
          if (d === '\\') { const e = src[i + 1]; metin += kacis[e] !== undefined ? kacis[e] : e; i += 2; continue; }
          if (d === '"') { i++; kapandi = true; break; }
          if (ip && d === '{') {
            if (src[i + 1] === '{') { metin += '{'; i += 2; continue; }
            let j = i + 1, derin = 0, tirnak = false;
            while (j < n && src[j] !== '\n') { const e = src[j]; if (e === '"') tirnak = !tirnak; else if (!tirnak) { if (e === '(') derin++; else if (e === ')') derin--; else if (e === '}' && derin <= 0) break; } j++; }
            if (src[j] !== '}') throw csHata('CS1010', 'Yeni satır: interpolasyonda } bekleniyor', l);
            let ifade = src.slice(i + 1, j), bicim = '';
            let dd = 0, q = false, kol = -1;
            for (let k = 0; k < ifade.length; k++) { const e = ifade[k]; if (e === '"') q = !q; else if (!q) { if (e === '(') dd++; else if (e === ')') dd--; else if (e === ':' && dd === 0) { kol = k; break; } } }
            if (kol >= 0) { bicim = ifade.slice(kol + 1).trim(); ifade = ifade.slice(0, kol); }
            if (metin) { parcalar.push({ s: metin }); metin = ''; }
            parcalar.push({ e: ifade, f: bicim, l: l });
            i = j + 1; continue;
          }
          if (ip && d === '}' && src[i + 1] === '}') { metin += '}'; i += 2; continue; }
          metin += d; i++;
        }
        if (!kapandi) throw csHata('CS1010', 'Yeni satır: dize sabiti kapatılmamış, " bekleniyor', l0);
        if (ip) { if (metin) parcalar.push({ s: metin }); t.push({ k: 'ip', parcalar: parcalar, l: l0 }); } else t.push({ k: 'str', v: metin, l: l0 });
        continue;
      }
      if (c === "'") {
        let ch = src[i + 1], j = i + 2;
        if (ch === '\\') { ch = kacis[src[i + 2]] !== undefined ? kacis[src[i + 2]] : src[i + 2]; j = i + 3; }
        if (src[j] !== "'") throw csHata('CS1012', 'Çok fazla karakter içeren karakter sabiti', l);
        t.push({ k: 'chr', v: ch, l: l }); i = j + 1; continue;
      }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
        let j = i; while (j < n && /[0-9]/.test(src[j])) j++;
        let cift = false;
        if (src[j] === '.' && /[0-9]/.test(src[j + 1] || '')) { cift = true; j++; while (j < n && /[0-9]/.test(src[j])) j++; }
        const sayi = parseFloat(src.slice(i, j));
        let sonek = ''; while (j < n && /[fFdDmMlLuU]/.test(src[j])) { sonek += src[j]; j++; }
        if (/[fFdDmM]/.test(sonek)) cift = true;
        t.push({ k: 'num', v: sayi, cift: cift, l: l }); i = j; continue;
      }
      if (ID0.test(c)) { let j = i + 1; while (j < n && ID1.test(src[j])) j++; t.push({ k: 'id', v: src.slice(i, j).replace(/^@/, ''), l: l }); i = j; continue; }
      const o2 = src.substr(i, 2);
      if (OPS2.indexOf(o2) >= 0) { t.push({ k: 'op', v: o2, l: l }); i += 2; continue; }
      if ('+-*/%<>=!?:;,.(){}[]&|^~'.indexOf(c) >= 0) { t.push({ k: 'op', v: c, l: l }); i++; continue; }
      throw csHata('CS1056', "Beklenmeyen karakter '" + c + "'", l);
    }
    return t;
  }
  function csAyristir(tk, sadeceIfade) {
    let p = 0;
    const gor = function (o) { return tk[p + (o || 0)]; };
    const sonSatir = function () { return (tk[p - 1] || tk[p] || { l: 1 }).l; };
    const op = function (v, o) { const x = gor(o); return !!x && x.k === 'op' && x.v === v; };
    const kw = function (v, o) { const x = gor(o); return !!x && x.k === 'id' && x.v === v; };
    const al = function () { return tk[p++]; };
    const bekleOp = function (v, kod, mesaj) {
      if (!op(v)) throw csHata(kod || 'CS1003', mesaj || "Söz dizimi hatası, '" + v + "' bekleniyor", v === ';' ? sonSatir() : (gor() ? gor().l : sonSatir()));
      return al();
    };
    const noktali = function () { return bekleOp(';', 'CS1002', '; bekleniyor'); };
    const parantez = function () { return bekleOp(')', 'CS1026', ') bekleniyor'); };
    const tipMi = function (x) { return !!x && x.k === 'id' && CS_T[x.v] !== undefined; };
    function ifade() { return atama(); }
    function atama() {
      const sol = ucl(), x = gor();
      if (x && x.k === 'op' && (x.v === '=' || x.v === '+=' || x.v === '-=' || x.v === '*=' || x.v === '/=' || x.v === '%=')) {
        if (sol.n !== 'id') throw csHata('CS0131', 'Atamanın sol tarafı bir değişken olmalıdır', x.l);
        al(); return { n: 'ata', op: x.v, ad: sol.ad, d: atama(), l: x.l };
      }
      return sol;
    }
    function ucl() {
      const c = veya();
      if (op('?')) { const q = al(); const a = ifade(); bekleOp(':'); const b = ucl(); return { n: 'ucl', c: c, a: a, b: b, l: q.l }; }
      return c;
    }
    function ikiliSeviye(altFn, ops) {
      return function () { let a = altFn(); for (;;) { const x = gor(); if (x && x.k === 'op' && ops.indexOf(x.v) >= 0) { al(); a = { n: 'ikili', op: x.v, a: a, b: altFn(), l: x.l }; } else return a; } };
    }
    const carp = ikiliSeviye(function () { return tekli(); }, ['*', '/', '%']);
    const topla = ikiliSeviye(carp, ['+', '-']);
    const iliski = ikiliSeviye(topla, ['<', '>', '<=', '>=']);
    const esit = ikiliSeviye(iliski, ['==', '!=']);
    const ve = ikiliSeviye(esit, ['&&']);
    const veya = ikiliSeviye(ve, ['||']);
    function tekli() {
      const x = gor();
      if (x && x.k === 'op') {
        if (x.v === '-' || x.v === '+' || x.v === '!') { al(); return { n: 'tekli', op: x.v, a: tekli(), l: x.l }; }
        if (x.v === '++' || x.v === '--') { al(); const h = tekli(); if (h.n !== 'id') throw csHata('CS1059', 'Artırma işleminin işleneni bir değişken olmalıdır', x.l); return { n: 'artir', op: x.v, ad: h.ad, on: true, l: x.l }; }
        if (x.v === '(' && tipMi(gor(1)) && gor(1).v !== 'var' && gor(1).v !== 'void' && op(')', 2)) { al(); const tp = al().v; al(); return { n: 'cast', tip: CS_T[tp], a: tekli(), l: x.l }; }
      }
      return sonek();
    }
    function argumanlar() {
      bekleOp('('); const a = [];
      if (!op(')')) { for (;;) { a.push(ifade()); if (op(',')) { al(); continue; } break; } }
      parantez(); return a;
    }
    function sonek() {
      let a = birincil();
      for (;;) {
        const x = gor();
        if (!x || x.k !== 'op') return a;
        if (x.v === '.') {
          al(); const ad = gor(); if (!ad || ad.k !== 'id') throw csHata('CS1001', 'Tanımlayıcı bekleniyor', x.l); al();
          a = op('(') ? { n: 'cagri', obj: a, ad: ad.v, args: argumanlar(), l: ad.l } : { n: 'uye', obj: a, ad: ad.v, l: ad.l };
          continue;
        }
        if (x.v === '(' && a.n === 'id') { a = { n: 'cagri', obj: null, ad: a.ad, args: argumanlar(), l: x.l }; continue; }
        if ((x.v === '++' || x.v === '--') && a.n === 'id') { al(); a = { n: 'artir', op: x.v, ad: a.ad, on: false, l: x.l }; continue; }
        if (x.v === '[') throw csDest(x.l, 'dizi / indeks');
        return a;
      }
    }
    function birincil() {
      const x = gor();
      if (!x) throw csHata('CS1733', 'İfade bekleniyor', sonSatir());
      if (x.k === 'num') { al(); return { n: 'sayi', v: x.v, t: x.cift ? 'double' : 'int' }; }
      if (x.k === 'str') { al(); return { n: 'metin', v: x.v }; }
      if (x.k === 'chr') { al(); return { n: 'kar', v: x.v }; }
      if (x.k === 'ip') { al(); return { n: 'ip', parcalar: x.parcalar.map(function (q) { return q.e !== undefined ? { e: csAyristir(csTokenle(q.e), true), f: q.f } : q; }) }; }
      if (x.k === 'id') {
        if (x.v === 'true' || x.v === 'false') { al(); return { n: 'bool', v: x.v === 'true' }; }
        if (x.v === 'null') { al(); return { n: 'null' }; }
        if (x.v === 'new' || CS_DESTEKSIZ[x.v]) throw csDest(x.l, x.v);
        al(); return { n: 'id', ad: x.v, l: x.l };
      }
      if (x.k === 'op' && x.v === '(') { al(); const e = ifade(); parantez(); return e; }
      throw csHata('CS1525', "İfadede geçersiz terim: '" + x.v + "'", x.l);
    }
    function blok() {
      const a = bekleOp('{'), s = [];
      while (gor() && !op('}')) s.push(deyim());
      if (!gor()) throw csHata('CS1513', '} bekleniyor', sonSatir());
      al(); return { n: 'blok', s: s, l: a.l };
    }
    function bildirimMi() {
      let q = 0; while (gor(q) && gor(q).k === 'id' && CS_MOD[gor(q).v]) q++;
      const a = gor(q), b = gor(q + 1);
      return tipMi(a) && !!b && b.k === 'id' && !CS_MOD[b.v];
    }
    function bildirim() {
      while (gor() && gor().k === 'id' && CS_MOD[gor().v]) al();
      const tp = al(), adlar = [];
      if (op('[') || op('<')) throw csDest(gor().l, 'dizi / genel tür');
      for (;;) {
        const ad = gor(); if (!ad || ad.k !== 'id') throw csHata('CS1001', 'Tanımlayıcı bekleniyor', ad ? ad.l : sonSatir());
        al(); let d = null; if (op('=')) { al(); d = ifade(); }
        adlar.push({ ad: ad.v, d: d, l: ad.l });
        if (op(',')) { al(); continue; } break;
      }
      return { n: 'bildir', tip: CS_T[tp.v], adlar: adlar, l: tp.l };
    }
    function yontem() {
      while (gor() && gor().k === 'id' && CS_MOD[gor().v]) al();
      const dt = al().v, ad = al(); al();
      const prm = [];
      if (!op(')')) {
        for (;;) {
          const pt = gor(); if (!tipMi(pt)) throw csHata('CS1001', 'Parametre türü bekleniyor', pt ? pt.l : sonSatir()); al();
          const pa = gor(); if (!pa || pa.k !== 'id') throw csHata('CS1001', 'Tanımlayıcı bekleniyor', sonSatir()); al();
          prm.push({ tip: CS_T[pt.v], ad: pa.v }); if (op(',')) { al(); continue; } break;
        }
      }
      parantez();
      let govde;
      if (op('=>')) { const a = al(); const e = ifade(); noktali(); govde = { n: 'blok', s: [{ n: 'don', d: e, l: a.l }], l: a.l }; } else govde = blok();
      return { n: 'yontem', ad: ad.v, donus: CS_T[dt], prm: prm, govde: govde, l: ad.l };
    }
    function sinif() {
      while (gor() && gor().k === 'id' && CS_MOD[gor().v]) al();
      al(); const ad = al();
      if (op(':')) throw csDest(gor().l, 'kalıtım');
      bekleOp('{'); const yont = [];
      while (gor() && !op('}')) {
        if (bildirimMi()) { let q = 0; while (gor(q) && CS_MOD[gor(q).v]) q++; if (op('(', q + 2)) { yont.push(yontem()); continue; } }
        throw csDest(gor().l, 'sınıf üyesi');
      }
      if (!gor()) throw csHata('CS1513', '} bekleniyor', sonSatir());
      al(); return { n: 'sinif', ad: ad.v, yont: yont, l: ad.l };
    }
    function deyim() {
      const x = gor();
      if (op('{')) return blok();
      if (op(';')) { al(); return { n: 'blok', s: [], l: x.l }; }
      if (x.k === 'id') {
        if (x.v === 'if') { al(); bekleOp('('); const c = ifade(); parantez(); const a = deyim(); let b = null; if (kw('else')) { al(); b = deyim(); } return { n: 'ifs', c: c, a: a, b: b, l: x.l }; }
        if (x.v === 'while') { al(); bekleOp('('); const c = ifade(); parantez(); return { n: 'whiles', c: c, g: deyim(), l: x.l }; }
        if (x.v === 'for') {
          al(); bekleOp('('); let i = null, c = null, s = null;
          if (!op(';')) i = bildirimMi() ? bildirim() : { n: 'ifade', e: ifade(), l: x.l };
          noktali(); if (!op(';')) c = ifade();
          noktali(); if (!op(')')) s = ifade();
          parantez(); return { n: 'fors', i: i, c: c, s: s, g: deyim(), l: x.l };
        }
        if (x.v === 'return') { al(); let d = null; if (!op(';')) d = ifade(); noktali(); return { n: 'don', d: d, l: x.l }; }
        if (x.v === 'break' || x.v === 'continue') { al(); noktali(); return { n: x.v === 'break' ? 'kir' : 'devam', l: x.l }; }
        let q0 = 0; while (gor(q0) && gor(q0).k === 'id' && CS_MOD[gor(q0).v]) q0++;
        if (gor(q0) && gor(q0).k === 'id' && gor(q0).v === 'class') return sinif();
        if (CS_DESTEKSIZ[x.v]) throw csDest(x.l, x.v);
        if (bildirimMi()) {
          let q = 0; while (gor(q) && CS_MOD[gor(q).v]) q++;
          if (op('(', q + 2)) return yontem();
          const b = bildirim(); noktali(); return b;
        }
      }
      const e = ifade(); noktali(); return { n: 'ifade', e: e, l: x.l };
    }
    if (sadeceIfade) { const e = ifade(); if (gor()) throw csHata('CS1003', 'Söz dizimi hatası', gor().l); return e; }
    const prog = []; while (gor()) prog.push(deyim());
    return prog;
  }
  function csYurut(prog, ayar) {
    const satirlar = [], SINIR = (ayar && ayar.adim) || 80000; let satirda = '', adim = 0;
    const yontemler = {}, siniflar = {};
    prog.forEach(function (s) {
      if (s.n === 'yontem') yontemler[s.ad] = s;
      else if (s.n === 'sinif') { siniflar[s.ad] = {}; s.yont.forEach(function (m) { siniflar[s.ad][m.ad] = m; if (!yontemler[m.ad]) yontemler[m.ad] = m; }); }
    });
    const I = function (v) { return { t: 'int', v: v }; }, Dd = function (v) { return { t: 'double', v: v }; }, S = function (v) { return { t: 'string', v: v }; }, B = function (v) { return { t: 'bool', v: v }; };
    const NUL = { t: 'null', v: null };
    const yeniKapsam = function (ust) { return { v: Object.create(null), ust: ust || null }; };
    const ara = function (k, ad) { for (let c = k; c; c = c.ust) if (ad in c.v) return c.v; return null; };
    const say = function (l) { if (++adim > SINIR) throw csHata('', 'Kodun 10 saniyede bitmedi; sonsuz döngü olabilir.', l, { zamanAsimi: true }); };
    const g = function (d) { if (!d || d.t === 'null') return ''; if (d.t === 'bool') return d.v ? 'True' : 'False'; return String(d.v); };
    const sayiDeger = function (d) { return d.t === 'char' ? d.v.charCodeAt(0) : d.v; };
    const sayisalMi = function (d) { return d.t === 'int' || d.t === 'double' || d.t === 'char'; };
    function bicimle(d, f) {
      const m = /^[FfNn](\d+)$/.exec(f || '');
      if (m && sayisalMi(d)) return Number(sayiDeger(d)).toFixed(Number(m[1]));
      return g(d);
    }
    function uydur(tip, d, l) {
      const ad = d.t;
      if (tip === 'var' || tip === 'void') return d;
      if (tip === 'int') { if (ad === 'int') return d; if (ad === 'char') return I(d.v.charCodeAt(0)); if (ad === 'double') throw csHata('CS0266', "'double' türü 'int' türüne örtük olarak dönüştürülemez. Açık bir dönüştürme var (cast eksik mi?)", l); }
      else if (tip === 'double') { if (ad === 'double') return d; if (ad === 'int') return Dd(d.v); if (ad === 'char') return Dd(d.v.charCodeAt(0)); }
      else if (tip === 'string') { if (ad === 'string') return d; if (ad === 'null') return S(''); }
      else if (tip === 'bool') { if (ad === 'bool') return d; }
      else if (tip === 'char') { if (ad === 'char') return d; }
      throw csHata('CS0029', "'" + ad + "' türü '" + tip + "' türüne örtük olarak dönüştürülemez", l);
    }
    function varsayilan(tip) { return tip === 'int' ? I(0) : tip === 'double' ? Dd(0) : tip === 'string' ? S('') : tip === 'bool' ? B(false) : { t: 'char', v: '\0' }; }
    function ikili(op, a, b, l) {
      if (op === '+' && (a.t === 'string' || b.t === 'string')) return S(g(a) + g(b));
      if (op === '==' || op === '!=') {
        let e;
        if (a.t === 'string' || b.t === 'string' || a.t === 'bool' || b.t === 'bool') e = a.t === b.t && a.v === b.v; else e = sayiDeger(a) === sayiDeger(b);
        return B(op === '==' ? e : !e);
      }
      if (!sayisalMi(a) || !sayisalMi(b)) throw csHata('CS0019', "'" + op + "' işleci '" + a.t + "' ve '" + b.t + "' türündeki işlenenlere uygulanamaz", l);
      const x = sayiDeger(a), y = sayiDeger(b), cift = a.t === 'double' || b.t === 'double', R = cift ? Dd : I;
      switch (op) {
        case '+': return R(x + y);
        case '-': return R(x - y);
        case '*': return R(x * y);
        case '/': if (!cift) { if (y === 0) throw csHata('', 'System.DivideByZeroException: Sıfıra bölme girişimi.', l, { calisma: true }); return I(Math.trunc(x / y)); } return Dd(x / y);
        case '%': if (!cift && y === 0) throw csHata('', 'System.DivideByZeroException: Sıfıra bölme girişimi.', l, { calisma: true }); return R(x % y);
        case '<': return B(x < y);
        case '>': return B(x > y);
        case '<=': return B(x <= y);
        case '>=': return B(x >= y);
      }
      throw csDest(l, op);
    }
    function kosul(n, k) { const c = ev(n, k); if (c.t !== 'bool') throw csHata('CS0029', "'" + c.t + "' türü 'bool' türüne örtük olarak dönüştürülemez", n.l || 0); return c.v; }
    function mantik(a, op, l) { if (a.t !== 'bool') throw csHata('CS0019', "'" + op + "' işleci '" + a.t + "' türündeki işlenenlere uygulanamaz", l); }
    const yuvarlaCift = function (x) { const r = Math.round(x); return Math.abs(x % 1) === 0.5 && r % 2 !== 0 ? r - 1 : r; };
    function ev(n, k) {
      say(n.l);
      switch (n.n) {
        case 'sayi': return n.t === 'int' ? I(n.v) : Dd(n.v);
        case 'metin': return S(n.v);
        case 'kar': return { t: 'char', v: n.v };
        case 'bool': return B(n.v);
        case 'null': return NUL;
        case 'ip': return S(n.parcalar.map(function (p) { return p.s !== undefined ? p.s : bicimle(ev(p.e, k), p.f); }).join(''));
        case 'id': {
          const sc = ara(k, n.ad);
          if (!sc) { if (/^[A-ZÇĞİÖŞÜ]/.test(n.ad)) throw csDest(n.l, n.ad); throw csHata('CS0103', "'" + n.ad + "' adı geçerli bağlamda yok", n.l); }
          return sc[n.ad].d;
        }
        case 'tekli': {
          const a = ev(n.a, k);
          if (n.op === '!') { if (a.t !== 'bool') throw csHata('CS0023', "'!' işleci '" + a.t + "' türündeki işlenene uygulanamaz", n.l); return B(!a.v); }
          if (!sayisalMi(a)) throw csHata('CS0023', "'" + n.op + "' işleci '" + a.t + "' türündeki işlenene uygulanamaz", n.l);
          const x = sayiDeger(a); return a.t === 'double' ? Dd(n.op === '-' ? -x : x) : I(n.op === '-' ? -x : x);
        }
        case 'ikili': {
          if (n.op === '&&' || n.op === '||') {
            const a = ev(n.a, k); mantik(a, n.op, n.l);
            if (n.op === '&&' ? !a.v : a.v) return a;
            const b = ev(n.b, k); mantik(b, n.op, n.l); return b;
          }
          return ikili(n.op, ev(n.a, k), ev(n.b, k), n.l);
        }
        case 'ucl': return kosul(n.c, k) ? ev(n.a, k) : ev(n.b, k);
        case 'cast': {
          const a = ev(n.a, k);
          if (n.tip === 'string' || a.t === 'string' || a.t === 'bool' || a.t === 'null') { if (n.tip === a.t) return a; throw csHata('CS0030', "'" + a.t + "' türü '" + n.tip + "' türüne dönüştürülemiyor", n.l); }
          const x = sayiDeger(a);
          if (n.tip === 'int') return I(Math.trunc(x));
          if (n.tip === 'double') return Dd(Number(x));
          if (n.tip === 'char') return { t: 'char', v: String.fromCharCode(x) };
          return a;
        }
        case 'ata': {
          const sc = ara(k, n.ad); if (!sc) throw csHata('CS0103', "'" + n.ad + "' adı geçerli bağlamda yok", n.l);
          const v = sc[n.ad]; let d = ev(n.d, k);
          if (n.op !== '=') { d = ikili(n.op.slice(0, -1), v.d, d, n.l); if (v.tip === 'int' && d.t === 'double') d = I(Math.trunc(d.v)); }
          v.d = uydur(v.tip, d, n.l); return v.d;
        }
        case 'artir': {
          const sc = ara(k, n.ad); if (!sc) throw csHata('CS0103', "'" + n.ad + "' adı geçerli bağlamda yok", n.l);
          const v = sc[n.ad], eski = v.d; let yeni = ikili(n.op === '++' ? '+' : '-', eski, I(1), n.l);
          if (v.tip === 'int' && yeni.t === 'double') yeni = I(Math.trunc(yeni.v));
          v.d = uydur(v.tip, yeni, n.l); return n.on ? v.d : eski;
        }
        case 'uye': {
          if (n.obj.n === 'id' && !ara(k, n.obj.ad)) {
            const sn = n.obj.ad, ad = n.ad;
            if (sn === 'Math' && ad === 'PI') return Dd(Math.PI);
            if (sn === 'Math' && ad === 'E') return Dd(Math.E);
            if (sn === 'int' && ad === 'MaxValue') return I(2147483647);
            if (sn === 'int' && ad === 'MinValue') return I(-2147483648);
            if (sn === 'string' && ad === 'Empty') return S('');
            throw csDest(n.l, sn + '.' + ad);
          }
          const o = ev(n.obj, k);
          if (o.t === 'string' && n.ad === 'Length') return I(o.v.length);
          throw csDest(n.l, '.' + n.ad);
        }
        case 'cagri': return cagri(n, k);
      }
      throw csDest(n.l, n.n);
    }
    function cagirYontem(m, args, n) {
      if (m.prm.length !== args.length) throw csHata('CS7036', "'" + m.ad + "' metodunun " + m.prm.length + ' parametresi var; ' + args.length + ' bağımsız değişken verildi', n.l);
      const k2 = yeniKapsam(null); m.prm.forEach(function (p, i) { k2.v[p.ad] = { tip: p.tip, d: uydur(p.tip, args[i], n.l) }; });
      say(n.l); const r = yurutBlok(m.govde, k2);
      if (r && r.sig === 'don') return m.donus === 'void' || !r.d ? NUL : uydur(m.donus, r.d, n.l);
      if (m.donus !== 'void') throw csHata('CS0161', "'" + m.ad + "': tüm kod yolları bir değer döndürmez", n.l);
      return NUL;
    }
    function cagri(n, k) {
      const args = n.args.map(function (a) { return ev(a, k); });
      if (n.obj === null) {
        const m = yontemler[n.ad];
        if (!m) throw csHata('CS0103', "'" + n.ad + "' adı geçerli bağlamda yok", n.l);
        return cagirYontem(m, args, n);
      }
      if (n.obj.n === 'id' && !ara(k, n.obj.ad) && siniflar[n.obj.ad]) {
        const m = siniflar[n.obj.ad][n.ad];
        if (!m) throw csHata('CS0117', "'" + n.obj.ad + "' türü '" + n.ad + "' tanımını içermiyor", n.l);
        return cagirYontem(m, args, n);
      }
      if (n.obj.n === 'id' && !ara(k, n.obj.ad)) {
        const sn = n.obj.ad, ad = n.ad, a0 = args[0];
        if (sn === 'Console') {
          if (ad === 'WriteLine') { satirlar.push(satirda + (args.length ? g(a0) : '')); satirda = ''; return NUL; }
          if (ad === 'Write') { satirda += g(a0); return NUL; }
          if (ad === 'ReadLine') return S('');
        }
        if (sn === 'Math') {
          if (ad === 'Ceiling') return Dd(Math.ceil(sayiDeger(a0)));
          if (ad === 'Floor') return Dd(Math.floor(sayiDeger(a0)));
          if (ad === 'Round') return Dd(yuvarlaCift(sayiDeger(a0)));
          if (ad === 'Sqrt') return Dd(Math.sqrt(sayiDeger(a0)));
          if (ad === 'Pow') return Dd(Math.pow(sayiDeger(a0), sayiDeger(args[1])));
          if (ad === 'Abs') return a0.t === 'double' ? Dd(Math.abs(a0.v)) : I(Math.abs(sayiDeger(a0)));
          if (ad === 'Max' || ad === 'Min') { const r = ad === 'Max' ? Math.max(sayiDeger(a0), sayiDeger(args[1])) : Math.min(sayiDeger(a0), sayiDeger(args[1])); return a0.t === 'double' || args[1].t === 'double' ? Dd(r) : I(r); }
        }
        if (sn === 'Convert' || sn === 'int') {
          if (ad === 'ToInt32' || ad === 'Parse') { if (a0.t === 'string') { const q = parseInt(a0.v, 10); if (isNaN(q)) throw csHata('', "System.FormatException: Giriş dizesi doğru biçimde değildi.", n.l, { calisma: true }); return I(q); } return I(yuvarlaCift(sayiDeger(a0))); }
          if (ad === 'ToString') return S(g(a0));
          if (ad === 'ToDouble') return Dd(a0.t === 'string' ? parseFloat(a0.v) : sayiDeger(a0));
        }
        throw csDest(n.l, sn + '.' + ad);
      }
      const o = ev(n.obj, k), ad = n.ad;
      if (ad === 'ToString') return S(g(o));
      if (o.t === 'string') {
        if (ad === 'ToUpper') return S(o.v.toLocaleUpperCase('tr')); if (ad === 'ToLower') return S(o.v.toLocaleLowerCase('tr'));
        if (ad === 'Trim') return S(o.v.trim()); if (ad === 'Contains') return B(o.v.indexOf(g(args[0])) >= 0);
        if (ad === 'StartsWith') return B(o.v.indexOf(g(args[0])) === 0); if (ad === 'EndsWith') return B(o.v.endsWith(g(args[0])));
        if (ad === 'Substring') return S(args.length > 1 ? o.v.substr(sayiDeger(args[0]), sayiDeger(args[1])) : o.v.substr(sayiDeger(args[0])));
      }
      throw csDest(n.l, '.' + ad + '()');
    }
    function yurutBlok(b, ust) { const k = yeniKapsam(ust); for (let i = 0; i < b.s.length; i++) { if (b.s[i].n === 'yontem') continue; const r = exec(b.s[i], k); if (r) return r; } return null; }
    function exec(s, k) {
      say(s.l);
      switch (s.n) {
        case 'bildir':
          s.adlar.forEach(function (a) {
            let d = a.d ? ev(a.d, k) : null, tip = s.tip;
            if (tip === 'var') { if (!d) throw csHata('CS0818', 'Örtük türlü yerel değişkenlerin başlatıcısı olmalıdır', a.l); tip = d.t === 'null' ? 'string' : d.t; } else d = d ? uydur(tip, d, a.l) : varsayilan(tip);
            if (k.v[a.ad] !== undefined) throw csHata('CS0128', "Bu kapsamda '" + a.ad + "' adlı bir yerel değişken zaten tanımlanmış", a.l);
            k.v[a.ad] = { tip: tip, d: d };
          });
          return null;
        case 'ifade': ev(s.e, k); return null;
        case 'blok': return yurutBlok(s, k);
        case 'ifs': { const dal = kosul(s.c, k) ? s.a : s.b; return dal ? exec(dal, yeniKapsam(k)) : null; }
        case 'whiles':
          while (kosul(s.c, k)) { const r = exec(s.g, yeniKapsam(k)); if (r) { if (r.sig === 'kir') break; if (r.sig === 'devam') continue; return r; } }
          return null;
        case 'fors': {
          const k2 = yeniKapsam(k); if (s.i) exec(s.i, k2);
          while (s.c ? kosul(s.c, k2) : true) { const r = exec(s.g, yeniKapsam(k2)); if (r) { if (r.sig === 'kir') break; if (r.sig !== 'devam') return r; } if (s.s) ev(s.s, k2); say(s.l); }
          return null;
        }
        case 'don': return { sig: 'don', d: s.d ? ev(s.d, k) : null };
        case 'kir': return { sig: 'kir' };
        case 'devam': return { sig: 'devam' };
      }
      throw csDest(s.l, s.n);
    }
    const k0 = yeniKapsam(null);
    for (let i = 0; i < prog.length; i++) { if (prog[i].n === 'yontem' || prog[i].n === 'sinif') continue; const r = exec(prog[i], k0); if (r && r.sig === 'don') break; }
    if (satirda) satirlar.push(satirda);
    return satirlar.join('\n').slice(0, 4000);
  }
  /** → { ok:true, cikti } | { ok:false, hata:{ kod, mesaj, satir, desteklenmiyor?, zamanAsimi?, calisma? } } */
  function csCalistir(kod, ayar) {
    try { return { ok: true, cikti: csYurut(csAyristir(csTokenle(String(kod == null ? '' : kod))), ayar) }; }
    catch (e) {
      if (e && typeof e === 'object' && e.mesaj !== undefined) return { ok: false, hata: e };
      return { ok: false, hata: csHata('', 'Önizleme çalıştırılamadı: ' + ((e && e.message) || e), 0, { desteklenmiyor: true }) };
    }
  }
  /** Kesin derleme hataları (söz dizimi + tür uyuşmazlığı); desteklenmeyen sözdizimi ve çalışma zamanı hataları sayılmaz. */
  function csDenetle(kod) {
    const r = csCalistir(kod, { adim: 20000 });
    if (r.ok || !r.hata || r.hata.desteklenmiyor || r.hata.zamanAsimi || r.hata.calisma) return [];
    return [r.hata];
  }
  function hataMetni(h) { return (h.satir ? 'Satır ' + h.satir + ': ' : '') + h.mesaj + (h.kod ? ' (' + h.kod + ')' : ''); }
  //#CS-BITIR

  KK_UI.ogr = { D: D, dersler: dersler, dersBul: dersBul, semtBul: semtBul, ustaBul: ustaBul, ustaId: ustaId, bugun: bugun, gunFarki: gunFarki, ekranVeri: ekranVeri, tekrarKayit: tekrarKayit,
    kisaMetin: kisaMetin, ekIn: ekIn, md: md, odak: odak, xpHesap: xpHesap, dersKilit: dersKilit, durak: durak, soruTipleri: soruTipleri, DURUM_AD: DURUM_AD, DURUM_CHIP: DURUM_CHIP, DURUM_IKON: DURUM_IKON,
    csCalistir: csCalistir, csDenetle: csDenetle, hataMetni: hataMetni };
  const O = KK_UI.ogr;
  const cevrimdisiMi = function () { try { return navigator.onLine === false; } catch (e) { return false; } };

  /* ======================= AKADEMİ LOBİSİ ======================= */
  const KAPI_X = [11, 24, 38, 50, 62, 76, 89], KAPI_Y = [62, 43, 30, 25, 30, 43, 62];
  function akademiHtml(v) {
    const semtler = D().semtler || [], secili = semtBul(v.semt) || semtler[0];
    const hat = dersler().filter(function (d) { return state.dersler[d.id] && state.dersler[d.id].mohur; }).map(function (d) { return d.id; });
    const kapilar = semtler.map(function (s, i) {
      const kilit = s.durum === 'kilitli', ds = dersler().filter(function (d) { return d.semt === s.id; }), muh = ds.filter(function (d) { return state.dersler[d.id] && state.dersler[d.id].mohur; }).length;
      return '<button type="button" class="akd-kapi' + (s.id === secili.id ? ' secili' : '') + (kilit ? ' kilitli' : '') + '" style="--x:' + KAPI_X[i] + '%;--y:' + KAPI_Y[i] + '%;--renk:' + esc(s.renk) + '" data-action="kursu-sec" data-semt="' + esc(s.id) + '" aria-pressed="' + (s.id === secili.id) + '" aria-label="' + esc(s.ad + ' Kürsüsü' + (kilit ? ', dersleri kilitli' : ', ' + muh + '/' + ds.length + ' ders mühürlü')) + '">' +
        '<span class="akd-kemer">' + (kilit ? ikon('kilit', 20) : ustaSvg(s.usta, { boyut: 50 })) + '</span><span class="akd-kapi-ad">' + esc(s.ad) + '</span><span class="akd-kapi-alt">' + (kilit ? 'inşaat' : muh + '/' + ds.length + ' mühür') + '</span></button>';
    }).join('');
    const nesne = function (ad, aksiyon, ic, yazi, alt, x, y) {
      return '<button type="button" class="akd-nesne" style="--x:' + x + '%;--y:' + y + '%" data-action="' + aksiyon + '">' + ikon(ic, 24) + '<span><b>' + esc(yazi) + '</b><small>' + esc(alt) + '</small></span></button>';
    };
    const tek = tekrarKayit(), tekrarYapildi = state.tekrar.son === bugun();
    const sahne = '<section class="akd-sahne" aria-label="Akademi lobisi: 7 Kürsü kapısı"><svg class="akd-zemin" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><radialGradient id="akd-isik" cx="50%" cy="46%" r="60%"><stop offset="0" stop-color="#2A3878"/><stop offset="1" stop-color="#0D1326"/></radialGradient></defs>' +
      '<rect width="800" height="460" fill="url(#akd-isik)"/>' +
      '<ellipse cx="400" cy="300" rx="372" ry="150" fill="#18224A" stroke="#36446E" stroke-width="3"/><ellipse cx="400" cy="300" rx="290" ry="116" fill="none" stroke="#2F3F86" stroke-width="3" stroke-dasharray="14 10"/><ellipse cx="400" cy="300" rx="205" ry="80" fill="#1D2A5C" stroke="#36446E" stroke-width="3"/>' +
      '<ellipse cx="400" cy="300" rx="96" ry="38" fill="#26325A" stroke="#FFD36A" stroke-width="3" opacity=".8"/>' +
      '<path d="M28 200 Q400 -40 772 200" fill="none" stroke="#36446E" stroke-width="4"/><path d="M60 200 Q400 -14 740 200" fill="none" stroke="#2A3558" stroke-width="3"/></svg>' +
      '<div class="akd-kapilar">' + kapilar +
      '<button type="button" class="akd-nesne akd-kurul" style="--x:50%;--y:58%" data-action="kurul-odasi">' + ikon('muhur', 24) + '<span><b>Kurul Odası</b><small>mühürlü kapı</small></span></button>' +
      nesne('Atölye', 'atolye-git', 'kalem', 'Atölye', 'görevler', 14, 90) +
      nesne('Danışma', 'tekrar-git', 'alev', 'Danışma', tekrarYapildi ? 'tekrar tamam' : 'Günlük Tekrar · 5 soru, 3 dk', 50, 90) +
      nesne('Mühür Duvarı', 'metro-git', 'harita', 'Mühür Duvarı', 'Metro Haritası', 86, 90) + '</div></section>';
    return sahne + panoHtml(v, secili, hat, tek);
  }
  function panoHtml(v, s, hat) {
    const ds = dersler().filter(function (d) { return d.semt === s.id; }), u = ustaBul(s.usta), kilitSemt = s.durum === 'kilitli';
    const satirlar = ds.map(function (d) {
      const du = durak(d), secili = v.ders === d.id;
      return '<button type="button" class="satir satir-tikla akd-ders d-' + du.durum + (secili ? ' secili' : '') + '" data-action="ders-sec" data-ders="' + esc(d.id) + '" aria-pressed="' + secili + '"' + (du.neden ? ' aria-describedby="neden-' + esc(d.id.replace('.', '-')) + '"' : '') + '>' +
        '<span class="akd-muhur m-' + du.durum + '" aria-hidden="true">' + ikon(DURUM_IKON[du.durum], 18) + '</span>' +
        '<span class="satir-ana"><span class="satir-baslik"><b class="mono">' + esc(d.id) + '</b> ' + esc(d.baslik) + '</span>' +
        '<span class="satir-alt">' + fmt(d.xp || 0) + ' XP · ≈ ' + (d.dk || 8) + ' dk' + (soruTipleri(d).length ? ' · ' + esc(soruTipleri(d).join(', ')) : '') + '</span>' +
        (du.neden ? '<span class="akd-neden" id="neden-' + esc(d.id.replace('.', '-')) + '">' + esc(du.neden) + '</span>' : '') + '</span>' +
        '<span class="satir-sag">' + chipHtml(DURUM_AD[du.durum], DURUM_CHIP[du.durum]) + '</span></button>';
    }).join('');
    const sec = ds.filter(function (d) { return d.id === v.ders; })[0], secDu = sec ? durak(sec) : null;
    const baslat = sec ? '<button type="button" class="btn btn-birincil btn-blok" data-action="ders-baslat"' + (secDu.durum === 'kilitli' ? ' disabled title="' + esc(secDu.neden) + '"' : '') + '>' + ikon('oynat', 20) + (secDu.durum === 'muhurlu' || secDu.durum === 'altin' ? 'Tekrar Et · ' : secDu.durum === 'basladi' ? 'Devam Et · ' : 'Dersi Başlat · ') + esc(sec.id) + '</button>' : '';
    return '<aside class="akd-pano panel" aria-label="Kürsü Panosu"><div class="akd-pano-ust" style="--renk:' + esc(s.renk) + '"><span class="akd-pano-portre">' + ustaSvg(s.usta, { boyut: 64 }) + '</span><div><h2>' + esc(s.ad) + ' Kürsüsü</h2><small class="soluk">' + esc(u.ad || 'Usta') + ' · ' + esc(s.tema || '') + '</small></div></div>' +
      (kilitSemt ? '<div class="akd-uyari">' + ikon('kilit', 18) + '<span>' + esc(s.ad) + ' dersleri ' + esc(String(s.insaatNotu || '').replace(/^[^:]*:\s*/, '') || 'henüz') + " açılıyor. Kürsü'ye oturabilirsin ama kartlar kilitli.</span></div>" : '') +
      (ds.length ? '<div class="liste akd-liste">' + satirlar + '</div>' + baslat : bosHtml({ ikon: 'kitap', baslik: 'Bu Kürsü sessiz', metin: 'Bu Kürsü\'nün ders listesi henüz hazır değil.' })) + '</aside>';
  }
  KK_UI.screen('akademi', {
    ad: 'Akademi Lobisi', hud: true,
    async render(root, ctx) {
      if (ctx.ilk) { root.innerHTML = '<div class="sayfa"><div class="akd-yukleniyor">' + yukleniyorHtml('Akademi açılıyor…') + '<span class="iskelet" style="height:260px;width:100%"></span></div></div>'; await bekle(240); }
      if (!Array.isArray(D().semtler) || !Array.isArray(D().dersler)) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Ders listesi yüklenemedi.', { baslik: 'Akademi açılamadı', tekrar: 'yeniden' }) + '</div>'; return; }
      const v = ekranVeri('akademi', { semt: 'carsi', ders: null });
      if (!v.ders || !dersBul(v.ders) || dersBul(v.ders).semt !== v.semt) {
        const ds = dersler().filter(function (d) { return d.semt === v.semt; });
        v.ders = (ds.filter(function (d) { const k = durak(d).durum; return k === 'acik' || k === 'basladi'; })[0] || ds[0] || { id: null }).id;
      }
      const cevrimdisi = cevrimdisiMi(), inen = dersler().filter(function (d) { return state.dersler[d.id] && state.dersler[d.id].mohur; }).map(function (d) { return d.id; });
      root.innerHTML = '<div class="sayfa akd"><div class="akd-baslik"><div><h1>Akademi Lobisi</h1><p class="soluk">Yedi Kürsü, Atölye ve Danışma burada. Kürsü\'ye oturmak için bir kapıya dokun.</p></div>' +
        '<div class="sira-s">' + chipHtml(inen.length + ' ders mühürlü', 'nane', 'muhur') + chipHtml('Ruhsat ' + state.ruhsat.otopark + '/3', 'amber', 'kalkan') + '</div></div>' +
        (cevrimdisi ? '<div class="akd-uyari">' + ikon('uyari', 18) + '<span>Çevrimdışısın. İndirilmiş dersler: ' + esc(inen.join(', ') || 'yok') + '.</span></div>' : '') +
        '<div class="akd-govde">' + akademiHtml(v) + '</div></div>';
    },
    actions: {
      'kursu-sec'(el) { const v = ekranVeri('akademi'); v.semt = el.getAttribute('data-semt'); v.ders = null; save(); refresh(); },
      'ders-sec'(el) {
        const v = ekranVeri('akademi'), d = dersBul(el.getAttribute('data-ders')); if (!d) return;
        const du = durak(d); v.ders = d.id; save();
        if (du.neden) toast(du.neden, 'uyari');
        refresh();
      },
      'ders-baslat'() { const v = ekranVeri('akademi'), d = dersBul(v.ders); if (!d) return; const du = durak(d); if (du.neden) { toast(du.neden, 'uyari'); return; } go('derslik', { parametre: { ders: d.id } }); },
      'atolye-git'() { go('atolye'); },
      'tekrar-git'() { go('tekrar'); },
      'metro-git'() { go('metro'); },
      'kurul-odasi'() { toast('Kurul kişi değildir; kartlarıyla konuşur.', 'bilgi'); },
      yeniden() { refresh(); }
    },
    async selftest(root, ctx) {
      await ctx.tikla('[data-action="kursu-sec"][data-semt="carsi"]');
      await ctx.bekleSecici('.akd-ders[data-ders="1.4"]');
      await ctx.tikla('.akd-ders[data-ders="1.4"]');
      await ctx.tikla('[data-action="ders-baslat"]');
      if (ctx.gidilen() !== 'derslik') throw new Error("Dersi Başlat Derslik'e gitmedi");
      await ctx.tikla('[data-action="kursu-sec"][data-semt="liman"]');
      if (!/Çarşı Sınavı/.test(ctx.metin('.akd-pano'))) throw new Error('Kilitli Kürsü nedeni gösterilmedi');
      await ctx.tikla('[data-action="atolye-git"]');
      if (ctx.gidilen() !== 'atolye') throw new Error("Atölye girişi Atölye'ye gitmedi");
    }
  });

  /* ======================= METRO HARİTASI ======================= */
  const METRO_BASLIK = { '1.5': 'Para Hesabı: decimal', '1.6': 'Tekrar: while Döngüsü', '1.12': 'Şehirden Çıkış' };
  const METRO_HEDEF = { carsi: 12, liman: 6 };
  function metroHatlar() {
    return (D().semtler || []).map(function (s, i) {
      const ds = dersler().filter(function (d) { return d.semt === s.id; }).slice(), hedef = METRO_HEDEF[s.id] || 0;
      for (let n = ds.length + 1; n <= hedef; n++) { const id = (i + 1) + '.' + n; ds.push({ id: id, baslik: METRO_BASLIK[id] || 'Ders ' + id, semt: s.id, xp: 100, dk: 10, durum: 'kilitli', kartlar: [], sorular: [], yer: true }); }
      return { semt: s, no: i + 1, duraklar: hedef ? ds.slice(0, hedef) : [] };
    });
  }
  /** Veride henüz olmayan (yer tutucu) durağın kilit nedeni. */
  function yerNeden(d) {
    const q = d.id.split('.'), n = Number(q[1]), onceki = q[0] + '.' + (n - 1);
    if (n > 1 && !(state.dersler[onceki] && state.dersler[onceki].mohur)) return 'Önce ' + ekIn(onceki) + ' Mührü gerekiyor.';
    return 'Bu dersin kartları henüz yayında değil.';
  }
  function durakSvg(durum) {
    const ic = { kilitli: '<circle r="13" fill="#151D36" stroke="#4A5A8C" stroke-width="3"/><rect x="-5" y="-1" width="10" height="8" rx="2" fill="#9AA7C7"/><path d="M-3.5 -1v-3a3.5 3.5 0 0 1 7 0v3" fill="none" stroke="#9AA7C7" stroke-width="2"/>',
      acik: '<circle class="nabiz" r="13" fill="#0D1326" stroke="#FFBE3D" stroke-width="3"/><circle r="4" fill="#FFBE3D"/>',
      basladi: '<circle r="13" fill="#0D1326" stroke="#FFBE3D" stroke-width="3"/><path d="M0 -13A13 13 0 0 0 0 13Z" fill="#FFBE3D"/>',
      muhurlu: '<circle r="13" fill="#45D98D" stroke="#1E9E5F" stroke-width="3"/><path d="M-5.5 0l4 4 7-8" fill="none" stroke="#052E1B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
      altin: '<circle r="19" fill="none" stroke="#FFD36A" stroke-width="2.5"/><path d="M0 -25v-5M0 25v5M-25 0h-5M25 0h5" stroke="#FFD36A" stroke-width="3" stroke-linecap="round"/><circle r="13" fill="#FFD36A" stroke="#B7790A" stroke-width="3"/><path d="M-5.5 0l4 4 7-8" fill="none" stroke="#3A2A00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' }[durum];
    return '<svg viewBox="-32 -32 64 64" aria-hidden="true" focusable="false">' + ic + '</svg>';
  }
  const METRO_H = 7 * 98 + 40;
  function metroSayilar() {
    const say = { altin: 0, muhurlu: 0, sari: 0, gri: 0 };
    metroHatlar().forEach(function (h) { h.duraklar.forEach(function (d) { const du = d.yer ? { durum: 'kilitli' } : durak(d); if (du.durum === 'altin') say.altin++; else if (du.durum === 'muhurlu') say.muhurlu++; else if (du.durum === 'acik' || du.durum === 'basladi') say.sari++; else say.gri++; }); });
    return say;
  }
  function metroHaritaHtml(hatlar, v) {
    const XA = 70, XB = 930; let cizgiler = '', dugmeler = '', etiketler = '';
    hatlar.forEach(function (h, i) {
      const y = 78 + i * 98, sagaGider = i % 2 === 0, n = h.duraklar.length, renk = h.semt.renk, yapimda = n === 0, adim = (XB - XA) / 11;
      const x0 = sagaGider ? XA : XB, x1 = sagaGider ? XB : XA;
      const sonX = n ? (sagaGider ? XA + (n - 1) * adim : XB - (n - 1) * adim) : x0;
      if (n) cizgiler += '<line x1="' + x0 + '" y1="' + y + '" x2="' + sonX + '" y2="' + y + '" stroke="' + esc(renk) + '" stroke-width="9" stroke-linecap="round"/>';
      if (sonX !== x1) cizgiler += '<line x1="' + sonX + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="' + esc(renk) + '" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 14" opacity=".65"/>';
      if (i < hatlar.length - 1) {
        const yy = y + 98, ex = x1 + (sagaGider ? 34 : -34), sk = hatlar[i + 1].semt.renk, kes = hatlar[i + 1].duraklar.length ? '' : ' stroke-dasharray="3 12"';
        cizgiler += '<path d="M' + x1 + ' ' + y + ' L' + ex + ' ' + (y + 34) + ' L' + ex + ' ' + (yy - 34) + ' L' + x1 + ' ' + yy + '" fill="none" stroke="' + esc(sk) + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"' + kes + '/>';
        etiketler += '<circle cx="' + x1 + '" cy="' + yy + '" r="9" fill="#0D1326" stroke="#E8EDF8" stroke-width="3"/>';
      }
      etiketler += '<text x="' + XA + '" y="' + (y - 34) + '" class="mtr-hat-ad" fill="' + esc(renk) + '">' + h.no + ' · ' + esc(h.semt.ad) + (yapimda ? ' hattı — inşaat halinde' : ' hattı') + '</text>';
      h.duraklar.forEach(function (d, j) {
        const x = sagaGider ? XA + j * adim : XB - j * adim, du = d.yer ? { durum: 'kilitli', neden: yerNeden(d) } : durak(d), sec = v.durak === d.id;
        dugmeler += '<button type="button" class="mtr-durak d-' + du.durum + (sec ? ' secili' : '') + '" style="left:' + (x / 10) + '%;top:' + (y / METRO_H * 100) + '%" data-action="durak" data-ders="' + esc(d.id) + '" aria-pressed="' + sec + '" aria-label="' + esc(h.semt.ad + ' hattı, ' + (j + 1) + '. durak, ' + d.baslik + ', ' + DURUM_AD[du.durum].toLowerCase()) + '">' + durakSvg(du.durum) + '<span class="mtr-etiket">' + esc(d.id) + '</span></button>';
      });
    });
    return '<div class="mtr-kaydir"><div class="mtr-harita" style="aspect-ratio:1000/' + METRO_H + '"><svg class="mtr-hatlar" viewBox="0 0 1000 ' + METRO_H + '" aria-hidden="true" focusable="false">' + cizgiler + etiketler + '</svg>' + dugmeler + '</div></div>';
  }
  function metroListeHtml(hatlar, v) {
    return hatlar.filter(function (h) { return h.duraklar.length; }).map(function (h) {
      return '<section class="panel mtr-liste-hat" style="--renk:' + esc(h.semt.renk) + '"><h3>' + h.no + ' · ' + esc(h.semt.ad) + ' hattı</h3><div class="liste">' + h.duraklar.map(function (d) {
        const du = d.yer ? { durum: 'kilitli' } : durak(d);
        return '<button type="button" class="satir satir-tikla' + (v.durak === d.id ? ' secili' : '') + '" data-action="durak" data-ders="' + esc(d.id) + '"><span class="akd-muhur m-' + du.durum + '" aria-hidden="true">' + ikon(DURUM_IKON[du.durum], 18) + '</span><span class="satir-ana"><span class="satir-baslik"><b class="mono">' + esc(d.id) + '</b> ' + esc(d.baslik) + '</span></span><span class="satir-sag">' + chipHtml(DURUM_AD[du.durum], DURUM_CHIP[du.durum]) + '</span></button>';
      }).join('') + '</div></section>';
    }).join('');
  }
  function metroDetayHtml(hatlar, v) {
    let d = null, hat = null;
    hatlar.forEach(function (h) { h.duraklar.forEach(function (x) { if (x.id === v.durak) { d = x; hat = h; } }); });
    if (!d) return '<div class="kart mtr-detay"><h3>Durak seç</h3><p class="soluk">Haritada bir durağa dokun; ders bilgisi burada açılır.</p></div>';
    const du = d.yer ? { durum: 'kilitli', neden: yerNeden(d) } : durak(d), tek = (tekrarKayit().dogruSeri || {})[d.id] || 0;
    const ozet = DURUM_AD[du.durum] + (du.durum === 'muhurlu' ? ' (mühürlü)' : '');
    let tekrarSatir = '';
    if (du.durum === 'muhurlu') tekrarSatir = 'Günlük Tekrar: ' + tek + '/3 doğru, altın için ' + (3 - tek) + ' tur daha.';
    else if (du.durum === 'altin') tekrarSatir = 'Günlük Tekrar: 3/3 doğru. Bu durak kalıcı; Kalıcılık Ligi\'ne sayılır.';
    const dugme = du.durum === 'kilitli' ? '<button type="button" class="btn btn-birincil btn-blok" disabled title="' + esc(du.neden) + '">' + ikon('kilit', 18) + 'Derse Git</button>' :
      '<button type="button" class="btn ' + (du.durum === 'muhurlu' || du.durum === 'altin' ? 'btn-mor' : 'btn-birincil') + ' btn-blok" data-action="derse-git" data-ders="' + esc(d.id) + '">' + ikon('oynat', 18) + (du.durum === 'muhurlu' || du.durum === 'altin' ? 'Tekrar Et (0 XP)' : 'Derse Git') + '</button>';
    return '<div class="kart mtr-detay" role="region" aria-label="Durak ayrıntısı" style="--renk:' + esc(hat.semt.renk) + '"><div class="sira-s"><span class="chip" style="border-color:' + esc(hat.semt.renk) + '">' + hat.no + ' · ' + esc(hat.semt.ad) + '</span>' + chipHtml(ozet, DURUM_CHIP[du.durum], DURUM_IKON[du.durum]) + '</div>' +
      '<h2>' + esc(d.id) + ' ' + esc(d.baslik) + '</h2><p class="soluk">' + fmt(d.xp || 0) + ' XP · ≈ ' + (d.dk || 10) + ' dk' + (soruTipleri(d).length ? ' · ' + esc(soruTipleri(d).join(', ')) : '') + '</p>' +
      (tekrarSatir ? '<p>' + esc(tekrarSatir) + '</p>' : '') + (du.neden ? '<p class="akd-uyari">' + ikon('kilit', 18) + '<span>' + esc(du.neden) + '</span></p>' : '') + dugme + '</div>';
  }
  KK_UI.screen('metro', {
    ad: 'Metro Haritası', hud: true,
    async render(root, ctx) {
      if (ctx.ilk) { root.innerHTML = '<div class="sayfa"><div class="mtr-yukleniyor">' + yukleniyorHtml('Metro haritası çiziliyor…') + '</div></div>'; await bekle(240); }
      if (!Array.isArray(D().semtler) || !Array.isArray(D().dersler)) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Harita yüklenemedi.', { baslik: 'Metro açılamadı', tekrar: 'yeniden' }) + '</div>'; return; }
      const v = ekranVeri('metro', { durak: null, gorunum: 'harita' }), hatlar = metroHatlar(), say = metroSayilar();
      if (!v.durak) {
        const tum = []; hatlar.forEach(function (h) { h.duraklar.forEach(function (d) { if (!d.yer) tum.push(d); }); });
        v.durak = (tum.filter(function (d) { const k = durak(d).durum; return k === 'acik' || k === 'basladi'; })[0] || tum[0] || { id: null }).id;
      }
      const hicMuhurYok = !dersler().some(function (d) { return state.dersler[d.id] && state.dersler[d.id].mohur; });
      const lejant = [['kilitli', 'Kilitli: içi boş, kilit'], ['acik', 'Sırada: sarı, nabız'], ['basladi', 'Başlandı: yarım dolu'], ['muhurlu', 'Ders Mührü: yeşil, tik'], ['altin', 'Altın: 3 tur üst üste doğru']].map(function (x) { return '<li><span class="mtr-lej">' + durakSvg(x[0]) + '</span>' + esc(x[1]) + '</li>'; }).join('');
      root.innerHTML = '<div class="sayfa mtr"><div class="akd-baslik"><div><h1>Metro Haritası</h1><p class="soluk">Her semt bir hat, her ders bir durak. Altın durak Kalıcılık Ligi\'nin puanıdır.</p></div>' +
        '<div class="sekmeler" role="tablist" aria-label="Görünüm"><button type="button" role="tab" class="sekme' + (v.gorunum === 'harita' ? ' aktif' : '') + '" aria-selected="' + (v.gorunum === 'harita') + '" data-action="gorunum" data-g="harita">' + ikon('harita', 18) + 'Harita</button><button type="button" role="tab" class="sekme' + (v.gorunum === 'liste' ? ' aktif' : '') + '" aria-selected="' + (v.gorunum === 'liste') + '" data-action="gorunum" data-g="liste">' + ikon('liste', 18) + 'Liste</button></div></div>' +
        (hicMuhurYok ? '<div class="akd-uyari">' + ikon('bilgi', 18) + '<span>Henüz mührün yok. İlk durağın Ders 1.1.</span></div>' : '') +
        (cevrimdisiMi() ? '<div class="akd-uyari">' + ikon('uyari', 18) + '<span>Son bilinen harita gösteriliyor.</span></div>' : '') +
        '<div class="mtr-govde"><div class="mtr-sol">' + (v.gorunum === 'liste' ? '<div class="yigin">' + metroListeHtml(hatlar, v) + '</div>' : metroHaritaHtml(hatlar, v)) + '</div>' +
        '<aside class="mtr-sag"><div class="kart mtr-ozet"><h3>' + ikon('yildiz', 20) + 'Altın durak ' + say.altin + '</h3><p class="soluk" style="margin:0">Altın ' + say.altin + ' · Yeşil ' + say.muhurlu + ' · Sarı ' + say.sari + ' · Gri ' + say.gri + '</p><button type="button" class="btn btn-hayalet btn-kucuk" data-action="kalicilik">' + ikon('kupa', 16) + 'Kalıcılık Ligi</button></div>' +
        metroDetayHtml(hatlar, v) + '<details class="kart mtr-lejant"><summary>Durak şekilleri ve renkler</summary><ul>' + lejant + '</ul></details></aside></div></div>';
    },
    actions: {
      durak(el) { const v = ekranVeri('metro'); v.durak = el.getAttribute('data-ders'); save(); refresh(); },
      gorunum(el) { const v = ekranVeri('metro'); v.gorunum = el.getAttribute('data-g') === 'liste' ? 'liste' : 'harita'; save(); refresh(); },
      'derse-git'(el) { const d = dersBul(el.getAttribute('data-ders')); if (!d) return; const du = durak(d); if (du.neden) { toast(du.neden, 'uyari'); return; } go('derslik', { parametre: { ders: d.id } }); },
      kalicilik() { go('liderlik', { parametre: { sekme: 'kalicilik' } }); },
      yeniden() { refresh(); }
    },
    async selftest(root, ctx) {
      await ctx.tikla('.mtr-durak[data-ders="1.3"]');
      if (!/1\.3/.test(ctx.metin('.mtr-detay')) || !/Tekrar Et/.test(ctx.metin('.mtr-detay'))) throw new Error('Durak ayrıntısı 1.3 için açılmadı');
      await ctx.tikla('[data-action="derse-git"]');
      if (ctx.gidilen() !== 'derslik') throw new Error("Tekrar Et Derslik'e gitmedi");
      await ctx.tikla('.mtr-durak[data-ders="1.5"]');
      if (!/Önce 1\.4/.test(ctx.metin('.mtr-detay'))) throw new Error('Kilitli durağın nedeni gösterilmedi: ' + ctx.metin('.mtr-detay'));
      await ctx.tikla('[data-action="gorunum"][data-g="liste"]');
      await ctx.bekleSecici('.mtr-liste-hat');
    }
  });

  /* ======================= GÜNLÜK TEKRAR ======================= */
  const HAFTA_GUN = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
  function haftaNo(gun) { const q = gun.split('-'), d = new Date(Date.UTC(+q[0], +q[1] - 1, +q[2])), o = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)); return d.getUTCFullYear() + '-' + Math.floor(((d - o) / 86400000 + o.getUTCDay() + 6) / 7); }
  function dogruMetin(t) {
    if (t.tip === 'coktan') {
      const sc = t.secenekler || [];
      if (typeof t.dogru === 'number' && sc[t.dogru] != null) return String(sc[t.dogru]);
      if (/^[A-Fa-f]$/.test(String(t.dogru)) && sc[String(t.dogru).toUpperCase().charCodeAt(0) - 65] != null) return String(sc[String(t.dogru).toUpperCase().charCodeAt(0) - 65]);
    }
    return String(t.dogru);
  }
  function normCevap(s) { return String(s == null ? '' : s).toLocaleLowerCase('tr').replace(/,/g, '.').replace(/\s+/g, '').replace(/^["'`]|["'`]$/g, '').replace(/\.0+$/, ''); }
  function tekrarDogruMu(t, cevap) { return dogruMetin(t).split('|').some(function (a) { return normCevap(a) === normCevap(cevap); }); }
  function stringHash(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function paketKur(serbest) {
    const kayit = tekrarKayit(), tum = D().tekrar || [], bg = bugun();
    const muhurlu = function (t) { return state.dersler[t.dersId] && state.dersler[t.dersId].mohur; };
    const sirala = function (a) { return a.slice().sort(function (x, y) { const dx = (kayit.dogruSeri[x.dersId] || 0), dy = (kayit.dogruSeri[y.dersId] || 0); return dx - dy || stringHash(x.id + bg) - stringHash(y.id + bg); }); };
    let secim = sirala(tum.filter(muhurlu)).slice(0, 5), az = false;
    if (secim.length && secim.length < 5) { az = true; secim = secim.concat(sirala(tum.filter(function (t) { return !muhurlu(t) && secim.indexOf(t) < 0; })).slice(0, 5 - secim.length)); }
    kayit.paket = { gun: bg, idler: secim.map(function (t) { return t.id; }), i: 0, basladi: false, cevaplar: [], baslangic: 0, serbest: !!serbest, az: az, bitti: false };
    save(); return kayit.paket;
  }
  function takvimHtml() {
    const T = state.tekrar, bg = bugun(), gunler = [];
    for (let k = 6; k >= 0; k--) { const d = new Date(Date.now() - k * 86400000); gunler.push({ gun: d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()), ad: HAFTA_GUN[d.getDay()], bugun: k === 0 }); }
    return '<div class="tkr-takvim" role="list" aria-label="Son 7 günün serisi">' + gunler.map(function (g) {
      const f = T.son ? gunFarki(g.gun, T.son) : -1, dolu = f >= 0 && f < (T.seri || 0);
      return '<div class="tkr-gun' + (dolu ? ' dolu' : '') + (g.bugun ? ' bugun' : '') + '" role="listitem" aria-label="' + esc(g.ad + (dolu ? ': tamam' : ': yok')) + '"><span class="tkr-nokta">' + (dolu ? ikon('tik', 14) : '') + '</span><small>' + esc(g.ad) + '</small></div>';
    }).join('') + '</div>';
  }
  function seriPanelHtml() {
    const T = state.tekrar, kayit = tekrarKayit(), bonus = (T.seri || 0) >= 7;
    return '<aside class="kart tkr-seri" aria-label="Seri paneli"><h3>' + ikon('alev', 20) + 'Seri: ' + (T.seri || 0) + ' gün</h3>' + takvimHtml() +
      '<p class="mini soluk" style="margin:0">' + (bonus ? 'Seri bonusu açık: tekrar başına 30 B.' : '7. günde Bayt ×1,5 (30 B).') + '</p>' +
      '<div class="tkr-satir"><span>Ücretsiz dondurma</span><b>' + (T.dondurma || 0) + '/1</b></div><div class="tkr-satir"><span>Seri Dondurucu stoğu</span><b>' + (kayit.dondurucu || 0) + '/2</b></div>' +
      '<button type="button" class="btn btn-altin btn-kucuk btn-blok" data-action="dondurucu-al"' + ((kayit.dondurucu || 0) >= 2 ? ' disabled title="Stok dolu (en çok 2)"' : '') + '>' + ikon('coin', 16) + 'Satın Al — 50 B</button></aside>';
  }
  function soruHtml(t) { const m = String(t.soru || ''); return '<div class="tkr-soru-metin">' + md(m) + '</div>' + (t.kod ? kodHtml(t.kod, { satirNo: false }) : ''); }
  function sureYazi(sn) { return Math.floor(sn / 60) + ':' + p2(sn % 60); }
  KK_UI.screen('tekrar', {
    ad: 'Günlük Tekrar', hud: true,
    async render(root, ctx) {
      if (ctx.ilk) { root.innerHTML = '<div class="sayfa sayfa-dar">' + yukleniyorHtml('Sorular hazırlanıyor…') + '</div>'; await bekle(240); }
      if (!Array.isArray(D().tekrar)) { root.innerHTML = '<div class="sayfa sayfa-dar">' + hataHtml('Günlük Tekrar yüklenemedi.', { baslik: 'Tekrar açılamadı', tekrar: 'yeniden' }) + '</div>'; return; }
      const kayit = tekrarKayit(), T = state.tekrar, bg = bugun(), yapildi = T.son === bg;
      if (T.son !== bg) T.bugunTamam = false;
      if (kayit.hafta !== haftaNo(bg)) { kayit.hafta = haftaNo(bg); T.dondurma = 1; }
      let P = kayit.paket;
      if (!P || P.gun !== bg || (P.bitti && !P.serbest && !yapildi)) P = paketKur(false);
      const ust = odak({ geri: 'geri', geriAd: 'Akademi', baslik: 'Günlük Tekrar', alt: 'Seri ' + (T.seri || 0) + ' gün', yuzde: P.basladi ? Math.round(100 * Math.min(P.i, P.idler.length) / Math.max(1, P.idler.length)) : 0, etiket: 'Tekrar ilerlemesi' });
      const bosKart = function (baslik, metin, dugme) { return '<div class="tkr-orta">' + bosHtml({ ikon: 'alev', baslik: baslik, metin: metin, buton: dugme }) + '</div>'; };
      let ana;
      if (!P.idler.length) ana = bosKart('Henüz tekrar edilecek bir şey yok', 'İlk dersini bitir, yarın burada olacağım.', { ad: 'Akademi\'ye git', aksiyon: 'geri', sinif: 'btn-birincil' });
      else if (yapildi && !P.serbest && !P.basladi) ana = bosKart('Bugünkü tekrarı yaptın', "İstersen Serbest Tekrar'la devam et; ödül yok ama durakların pekişir.", { ad: 'Serbest Tekrar', aksiyon: 'serbest', sinif: 'btn-mor' });
      else if (!P.basladi) ana = '<div class="kart tkr-orta tkr-giris"><h2>Bugünün ' + P.idler.length + ' sorusu hazır</h2><p>Hedef süre 3 dakika; yetmezse devam edebilirsin.' + (P.az ? ' Bugün vadesi gelen soru az; yakın zamanda öğrendiklerinden tamamladık.' : '') + '</p>' +
        '<div class="sira-s">' + chipHtml('20 B', 'amber', 'coin') + chipHtml('15 XP', 'mor', 'xp') + chipHtml('seri +1', 'mercan', 'alev') + '</div>' +
        '<button type="button" class="btn btn-birincil btn-buyuk" data-action="basla">' + ikon('oynat', 22) + (P.serbest ? 'Serbest Tekrar\'ı Başlat' : 'Başla') + '</button>' + (cevrimdisiMi() ? '<p class="mini soluk">Bağlantı yok. Soruları çözebilirsin; bağlanınca kaydederiz.</p>' : '') + '</div>';
      else if (P.bitti) ana = sonucHtml(P);
      else ana = soruKartlari(P);
      root.innerHTML = '<div class="sayfa tkr">' + ust + '<div class="tkr-grid"><div class="tkr-ana">' + ana + '</div>' + seriPanelHtml() + '</div></div>';
      if (P.basladi && !P.bitti) {
        const a0 = kayit.sure0 || Date.now(); kayit.sure0 = a0;
        KK_UI.aralik(function () { const el = $('#tkr-sure'); if (!el) return; const sn = Math.floor((Date.now() - (P.baslangic || a0)) / 1000); el.textContent = sureYazi(sn); const kap = el.closest('.tkr-sure'); if (kap && sn >= 180 && !kap.classList.contains('uzadi')) { kap.classList.add('uzadi'); toast('3 dakika doldu. Acele yok; kalan soruları bitirmen yeterli.', 'bilgi'); } }, 1000);
        const cevaplandi = P.cevaplar[P.i];
        const btn = $('[data-action="kontrol"]');
        if (btn && !cevaplandi && !KK_UI.hizliMod) { btn.disabled = true; btn.classList.add('bekle'); KK_UI.gecikme(function () { const b = $('[data-action="kontrol"]'); if (b) { b.disabled = !(P.secim != null && String(P.secim).length) && false; b.classList.remove('bekle'); } }, 3000); }
      }
    },
    actions: {
      geri() { go('akademi'); },
      yeniden() { refresh(); },
      basla() { const P = tekrarKayit().paket; P.basladi = true; P.baslangic = Date.now(); P.i = 0; P.cevaplar = []; save(); refresh(); },
      serbest() { const P = paketKur(true); P.basladi = false; save(); refresh(); },
      sec(el) { const P = tekrarKayit().paket; P.secim = el.type === 'radio' ? Number(el.value) : el.value; const b = $('[data-action="kontrol"]'); if (b && !b.classList.contains('bekle')) b.disabled = false; },
      kontrol() {
        const P = tekrarKayit().paket, t = (D().tekrar || []).filter(function (x) { return x.id === P.idler[P.i]; })[0];
        if (!t || P.cevaplar[P.i]) return;
        let cevap = P.secim;
        if (t.tip === 'coktan') { if (cevap == null || cevap === '') { toast('Önce bir seçenek seç.', 'uyari'); return; } cevap = (t.secenekler || [])[cevap]; }
        else { const el = $('#tekrar-kisa'); cevap = el ? el.value : ''; if (!String(cevap).trim()) { toast('Önce cevabını yaz.', 'uyari'); return; } }
        const dogru = tekrarDogruMu(t, cevap), kayit = tekrarKayit();
        P.cevaplar[P.i] = { cevap: String(cevap), dogru: dogru };
        kayit.dogruSeri[t.dersId] = dogru ? Math.min(3, (kayit.dogruSeri[t.dersId] || 0) + 1) : 0;
        if (dogru && kayit.dogruSeri[t.dersId] === 3) P.altinOlan = (P.altinOlan || []).concat(t.dersId);
        P.secim = null; save(); refresh();
      },
      sonraki() { const P = tekrarKayit().paket; P.i += 1; P.secim = null; save(); refresh(); },
      async bitir(el) {
        const P = tekrarKayit().paket, T = state.tekrar, kayit = tekrarKayit(), bg = bugun();
        P.i = P.idler.length; P.bitti = true; P.mesajlar = [];
        if (!P.serbest && T.son !== bg) {
          const fark = T.son ? gunFarki(T.son, bg) : 0; let seri = T.seri || 0;
          if (!T.son) seri = 1;
          else if (fark === 1) seri += 1;
          else if (fark === 2 && T.dondurma > 0) { T.dondurma -= 1; seri += 1; P.mesajlar.push('Dün yoktun; ücretsiz dondurma serini korudu.'); }
          else if (fark === 2 && (kayit.dondurucu || 0) > 0) { kayit.dondurucu -= 1; seri += 1; P.mesajlar.push('Dün yoktun; Seri Dondurucu serini korudu.'); }
          else { if (seri > 1) { kayit.eskiSeri = seri; P.mesajlar.push('Serin ' + seri + ' günde durdu. Onarım Turu ile geri alabilirsin: 10 soru, 48 saat içinde.'); } seri = 1; }
          T.seri = seri; T.son = bg; T.bugunTamam = true; if (seri >= 7) rozetVer('seri-7');
          const bayt = seri >= 7 ? 30 : 20; P.odul = { xp: 15, bayt: bayt, seri: seri };
          if (seri === 7) P.mesajlar.push('7 gün üst üste. Seri bonusu açıldı: bundan sonra tekrar başına 30 B.');
          save(); refresh();
          await award({ xp: 15, bayt: bayt, etiket: 'Günlük Tekrar', kaynak: $('.tkr-sonuc') || el });
        } else { save(); refresh(); }
      },
      async 'dondurucu-al'(el) {
        const kayit = tekrarKayit();
        if ((kayit.dondurucu || 0) >= 2) { toast('Seri Dondurucu stoğu dolu (en çok 2).', 'uyari'); return; }
        const ok = await onayla('Seri Dondurucu için 50 B harcıyorsun.', 'Satın al', 'Vazgeç'); if (!ok) return;
        if (!harca({ bayt: 50, etiket: 'Seri Dondurucu', kaynak: el })) return;
        kayit.dondurucu = (kayit.dondurucu || 0) + 1; save(); toast('Seri Dondurucu stokta: ' + kayit.dondurucu + '/2. Seri 04:00\'te otomatik korunur.', 'basari'); refresh();
      }
    },
    async selftest(root, ctx) {
      const b0 = state.bayt, x0 = state.xp, s0 = state.tekrar.seri;
      await ctx.tikla('[data-action="basla"]');
      for (let i = 0; i < 5; i++) {
        await ctx.bekleSecici('[data-action="kontrol"]');
        const r = $('input[name="tekrar-sec"]');
        if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); } else await ctx.yaz('#tekrar-kisa', '3');
        await ctx.tikla('[data-action="kontrol"]');
        await ctx.tikla(i < 4 ? '[data-action="sonraki"]' : '[data-action="bitir"]');
      }
      await ctx.bekleSecici('.tkr-sonuc');
      if (!state.tekrar.bugunTamam || state.tekrar.seri !== s0 + 1) throw new Error('Seri artmadı: ' + s0 + ' → ' + state.tekrar.seri);
      if (state.bayt !== b0 + 20 || state.xp !== x0 + 15) throw new Error('Ödül yanlış: ' + (state.bayt - b0) + ' B, ' + (state.xp - x0) + ' XP');
    }
  });
  function soruKartlari(P) {
    const t = (D().tekrar || []).filter(function (x) { return x.id === P.idler[P.i]; })[0];
    if (!t) return '<div class="kart">' + hataHtml('Soru bulunamadı.', { tekrar: 'yeniden' }) + '</div>';
    const c = P.cevaplar[P.i], son = P.i >= P.idler.length - 1, sn = Math.floor((Date.now() - (P.baslangic || Date.now())) / 1000);
    let yanit;
    if (t.tip === 'coktan') {
      yanit = '<div class="tkr-secenekler" role="radiogroup" aria-label="Seçenekler">' + (t.secenekler || []).map(function (s, i) {
        const durum = c ? (tekrarDogruMu(t, s) ? ' dogru' : (c.cevap === String(s) ? ' yanlis' : '')) : '';
        return '<label class="secim-kart tkr-sec' + durum + '"><input type="radio" name="tekrar-sec" id="tekrar-sec-' + i + '" value="' + i + '" data-input="sec"' + (c ? ' disabled' : '') + (c && c.cevap === String(s) ? ' checked' : '') + '><span class="tkr-harf">' + String.fromCharCode(65 + i) + '</span><span>' + md(s) + '</span></label>';
      }).join('') + '</div>';
    } else {
      yanit = '<div class="alan"><label class="etiket" for="tekrar-kisa">Kısa cevabın</label><input id="tekrar-kisa" class="girdi mono" autocomplete="off" data-input="sec"' + (c ? ' disabled value="' + esc(c.cevap) + '"' : '') + ' placeholder="Cevabı yaz"></div>';
    }
    const geri = c ? '<div class="tkr-geri ' + (c.dogru ? 'dogru' : 'yanlis') + '" role="status">' + ikon(c.dogru ? 'test-gecti' : 'test-kaldi', 22) + '<div><b>' + (c.dogru ? 'Doğru.' : 'Henüz değil.') + '</b> ' + (c.dogru ? '' : 'Doğru cevap: <code class="kod-ic">' + esc(dogruMetin(t).split('|')[0]) + '</code>. ') + md(t.aciklama || '') + (c.dogru ? '' : '<br><small class="soluk">Bu soru yarın tekrar karşına çıkacak.</small>') + '</div></div>' : '';
    const noktalar = P.idler.map(function (x, i) { return '<span class="tkr-n' + (i < P.i ? ' bitti' : i === P.i ? ' simdi' : '') + '" aria-hidden="true"></span>'; }).join('');
    const dugme = c ? '<button type="button" class="btn btn-birincil" data-action="' + (son ? 'bitir' : 'sonraki') + '">' + (son ? 'Sonucu Gör' : 'Sonraki') + ikon('ok-sag', 18) + '</button>' : '<button type="button" class="btn btn-birincil tkr-kontrol" data-action="kontrol">Kontrol Et</button>';
    return '<div class="kart tkr-ust-serit"><span><b>Soru ' + (P.i + 1) + '/' + P.idler.length + '</b></span><span class="tkr-sure' + (sn >= 180 ? ' uzadi' : '') + '" title="Hedef süre 3 dakika; tur kesilmez">' + ikon('saat', 18) + '<b id="tkr-sure" aria-live="off">' + sureYazi(sn) + '</b></span>' + chipHtml('seri ' + (state.tekrar.seri || 0) + ' gün', 'mercan', 'alev') + '</div>' +
      '<div class="kart tkr-soru" role="group" aria-label="Soru ' + (P.i + 1) + '">' + soruHtml(t) + '</div><div class="kart tkr-yanit">' + yanit + geri + '</div>' +
      '<div class="tkr-alt"><div class="tkr-noktalar" aria-label="İlerleme: ' + (P.i + 1) + '/' + P.idler.length + '">' + noktalar + '</div>' + dugme + '</div>';
  }
  function sonucHtml(P) {
    const dogru = P.cevaplar.filter(function (c) { return c && c.dogru; }).length, toplam = P.idler.length, T = state.tekrar;
    const altin = (P.altinOlan || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
    return '<div class="kart tkr-sonuc kart-parla" role="status">' + halkaHtml(100 * dogru / Math.max(1, toplam), { boyut: 120, tur: dogru >= 4 ? 'nane' : 'amber', metin: dogru + '/' + toplam, alt: 'DOĞRU' }) +
      '<div class="yigin-s">' + (P.serbest ? '<h2>Serbest Tekrar bitti</h2><p>Ödül yok; ama durakların pekişti.</p>' : '<h2>Bugünkü tekrar tamam.</h2><p>+' + (P.odul ? P.odul.bayt : 20) + ' B, +15 XP. Seri: <b>' + (T.seri || 1) + ' gün</b>.</p>') +
      (altin.length ? '<p class="tkr-altin">' + ikon('yildiz', 18) + altin.map(function (x) { return x + ' durağı altın oldu'; }).join(', ') + '!</p>' : '') +
      (P.mesajlar || []).map(function (m) { return '<p class="soluk">' + esc(m) + '</p>'; }).join('') +
      '<div class="sira-s"><button type="button" class="btn btn-birincil" data-action="metro-git2">' + ikon('harita', 18) + 'Metro Haritası</button><button type="button" class="btn btn-hayalet" data-action="geri">Akademi</button></div></div></div>';
  }
  KK_UI.actions['metro-git2'] = function () { go('metro'); };
})();
