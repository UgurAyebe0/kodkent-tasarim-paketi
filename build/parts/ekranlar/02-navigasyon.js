/* build_page.py ile üretildi */
;(function(){
const NAV = {"nodes":[{"id":"giris","name":"Giriş","type":"akis","c":0,"r":0},{"id":"dil-sec","name":"Dil Seçimi","type":"akis","c":1,"r":0},{"id":"avatar","name":"Avatar Atölyesi","type":"akis","c":2,"r":0},{"id":"meydan","name":"Derleyici Meydanı","type":"sahne","c":3,"r":0},{"id":"harita","name":"Şehir Haritası","type":"sahne","c":4,"r":0},{"id":"akademi","name":"Akademi Lobisi","type":"sahne","c":2,"r":1},{"id":"derslik","name":"Derslik","type":"panel","c":3,"r":1},{"id":"kurul","name":"Kurul Kartı","type":"panel","c":4,"r":1},{"id":"atolye","name":"Atölye","type":"panel","c":5,"r":1},{"id":"sokak","name":"İşletme Sokağı","type":"sahne","c":2,"r":2},{"id":"is-emri","name":"İş Emri","type":"panel","c":3,"r":2},{"id":"editor","name":"İşletme Editörü","type":"panel","c":4,"r":2},{"id":"savunma","name":"Savunma","type":"panel","c":5,"r":2},{"id":"panel","name":"İşletme Paneli","type":"panel","c":4,"r":3},{"id":"metro","name":"Metro Haritası","type":"panel","c":0,"r":1},{"id":"tekrar","name":"Günlük Tekrar","type":"panel","c":1,"r":1},{"id":"oda","name":"Oda","type":"sahne","c":1,"r":3},{"id":"dolap","name":"Dolap","type":"panel","c":2,"r":3},{"id":"pazar","name":"Pazar","type":"panel","c":3,"r":3},{"id":"vitrin","name":"Vitrin","type":"panel","c":1,"r":2},{"id":"profil","name":"Profil & Rozet Duvarı","type":"panel","c":0,"r":2},{"id":"liderlik","name":"Liderlik Panosu","type":"panel","c":5,"r":0},{"id":"sohbet","name":"Sohbet & Arkadaşlar","type":"panel","c":0,"r":3},{"id":"ayarlar","name":"Ayarlar & Hesap","type":"panel","c":5,"r":3}],"edges":[{"n":"1","s":"giris","t":"dil-sec","l":"Kod doğrulandı","g":"A","dash":false},{"n":"2","s":"giris","t":"meydan","l":"Giriş yap","g":"A","dash":false},{"n":"3","s":"dil-sec","t":"avatar","l":"C# ile Başla","g":"A","dash":false},{"n":"4","s":"avatar","t":"meydan","l":"Şehre Gir","g":"A","dash":false},{"n":"5","s":"meydan","t":"akademi","l":"Akademi kapısı","g":"B","dash":false},{"n":"6","s":"meydan","t":"harita","l":"Harita","g":"B","dash":false},{"n":"7","s":"meydan","t":"pazar","l":"Pazar","g":"B","dash":false},{"n":"8","s":"meydan","t":"liderlik","l":"Liderlik Panosu","g":"B","dash":false},{"n":"9","s":"meydan","t":"oda","l":"Oda","g":"B","dash":false},{"n":"10","s":"meydan","t":"sokak","l":"Meydan Otoparkı","g":"B","dash":false},{"n":"11","s":"meydan","t":"tekrar","l":"Günlük Tekrar","g":"B","dash":false},{"n":"12","s":"meydan","t":"panel","l":"İşletmelerim","g":"B","dash":false},{"n":"13","s":"meydan","t":"dolap","l":"HUD / Menü (#13)","g":"B","dash":true},{"n":"13","s":"meydan","t":"metro","l":"HUD / Menü (#13)","g":"B","dash":true},{"n":"13","s":"meydan","t":"profil","l":"HUD / Menü (#13)","g":"B","dash":true},{"n":"13","s":"meydan","t":"sohbet","l":"HUD / Menü (#13)","g":"B","dash":true},{"n":"13","s":"meydan","t":"ayarlar","l":"HUD / Menü (#13)","g":"B","dash":true},{"n":"14","s":"akademi","t":"derslik","l":"Dersi Başlat","g":"C","dash":false},{"n":"15","s":"akademi","t":"atolye","l":"Atölye girişi","g":"C","dash":false},{"n":"16","s":"akademi","t":"tekrar","l":"Danışma kiosku","g":"C","dash":false},{"n":"17","s":"akademi","t":"metro","l":"Mühür Duvarı","g":"C","dash":false},{"n":"18","s":"akademi","t":"meydan","l":"Ana kapı","g":"C","dash":false},{"n":"19","s":"derslik","t":"kurul","l":"Usta sorusuna geç","g":"C","dash":false},{"n":"20","s":"derslik","t":"akademi","l":"Çıkış (✕)","g":"C","dash":false},{"n":"21","s":"kurul","t":"kurul","l":"Sonraki soru","g":"C","dash":false},{"n":"22","s":"kurul","t":"derslik","l":"Dersi Gör","g":"C","dash":false},{"n":"23","s":"kurul","t":"atolye","l":"Göreve Geç","g":"C","dash":false},{"n":"24","s":"kurul","t":"akademi","l":"Kürsüden Çık","g":"C","dash":false},{"n":"25","s":"atolye","t":"akademi","l":"Çık","g":"C","dash":false},{"n":"26","s":"atolye","t":"sokak","l":"Tapuyu Al","g":"C","dash":false},{"n":"27","s":"metro","t":"derslik","l":"Derse Git","g":"C","dash":false},{"n":"28","s":"metro","t":"liderlik","l":"Altın durak sayacı","g":"C","dash":false},{"n":"29","s":"tekrar","t":"metro","l":"Haritada Gör","g":"C","dash":false},{"n":"30","s":"tekrar","t":"meydan","l":"Bitir","g":"C","dash":false},{"n":"31","s":"harita","t":"sokak","l":"Satılık (S) / işletme ikonu","g":"D","dash":false},{"n":"32","s":"harita","t":"meydan","l":"Git (tramvay vinyeti)","g":"D","dash":false},{"n":"32","s":"harita","t":"akademi","l":"Git (tramvay vinyeti)","g":"D","dash":false},{"n":"33","s":"sokak","t":"is-emri","l":"KODLA! / İş Emrini Aç","g":"D","dash":false},{"n":"34","s":"sokak","t":"panel","l":"Panel","g":"D","dash":false},{"n":"35","s":"sokak","t":"vitrin","l":"Vitrini Gör","g":"D","dash":false},{"n":"36","s":"sokak","t":"editor","l":"Müfettişin Dosyasına Bak","g":"D","dash":false},{"n":"37","s":"sokak","t":"meydan","l":"Çık","g":"D","dash":false},{"n":"38","s":"is-emri","t":"editor","l":"Kodlamaya Geç","g":"D","dash":false},{"n":"39","s":"editor","t":"savunma","l":"Savunma'ya Geç","g":"D","dash":false},{"n":"40","s":"editor","t":"is-emri","l":"İş emrini gör","g":"D","dash":false},{"n":"41","s":"savunma","t":"sokak","l":"İşletmeyi Gör","g":"D","dash":false},{"n":"42","s":"savunma","t":"panel","l":"Paneli Aç","g":"D","dash":false},{"n":"43","s":"panel","t":"is-emri","l":"Yükselt","g":"D","dash":false},{"n":"44","s":"panel","t":"atolye","l":"Hatayı Bul","g":"D","dash":false},{"n":"45","s":"panel","t":"vitrin","l":"Vitrin'e Git","g":"D","dash":false},{"n":"46","s":"panel","t":"sokak","l":"Sokağa Git","g":"D","dash":false},{"n":"47","s":"panel","t":"pazar","l":"Pazar'a Git","g":"D","dash":false},{"n":"48","s":"vitrin","t":"sokak","l":"Sokağa Dön","g":"D","dash":false},{"n":"49","s":"vitrin","t":"profil","l":"Sahibinin Profili","g":"D","dash":false},{"n":"50","s":"pazar","t":"dolap","l":"Dolap'a Git","g":"E","dash":false},{"n":"51","s":"pazar","t":"panel","l":"Kasanı topla","g":"E","dash":false},{"n":"52","s":"dolap","t":"pazar","l":"Pazar'da Gör","g":"E","dash":false},{"n":"53","s":"dolap","t":"oda","l":"Odama Git","g":"E","dash":false},{"n":"54","s":"sohbet","t":"oda","l":"Odasına Git","g":"E","dash":false},{"n":"55","s":"sohbet","t":"profil","l":"Profili Gör","g":"E","dash":false},{"n":"56","s":"sohbet","t":"meydan","l":"Arkadaşa Git","g":"E","dash":false},{"n":"57","s":"oda","t":"profil","l":"Sahibin Profili","g":"E","dash":false},{"n":"58","s":"oda","t":"pazar","l":"Eşya Al","g":"E","dash":false},{"n":"59","s":"oda","t":"meydan","l":"Çık","g":"E","dash":false},{"n":"60","s":"profil","t":"vitrin","l":"İşletme kartı","g":"E","dash":false},{"n":"60","s":"profil","t":"sokak","l":"İşletme kartı","g":"E","dash":false},{"n":"60","s":"profil","t":"dolap","l":"Etiketimde Göster","g":"E","dash":false},{"n":"60","s":"profil","t":"sohbet","l":"Arkadaş Ekle","g":"E","dash":false},{"n":"61","s":"liderlik","t":"profil","l":"Oyuncu satırı","g":"E","dash":false},{"n":"62","s":"liderlik","t":"vitrin","l":"En Hızlı Otopark","g":"E","dash":false},{"n":"62","s":"liderlik","t":"sokak","l":"En kazançlı işletme","g":"E","dash":false},{"n":"63","s":"ayarlar","t":"giris","l":"Çıkış Yap / Hesabı sil","g":"E","dash":false}],"groups":[{"id":"A","name":"Kayıt ve onboarding","tone":"violet","count":4},{"id":"B","name":"Meydan merkezli","tone":"accent","count":13},{"id":"C","name":"Akademi ve ders akışı","tone":"cobalt","count":17},{"id":"D","name":"İşletme akışı","tone":"amber","count":20},{"id":"E","name":"Kozmetik, oda ve sosyal","tone":"mint","count":18}]};
const el = document.getElementById('d-nav'), tabs = document.getElementById('nav-tabs'), note = document.getElementById('nav-note');
const NS = 'http://www.w3.org/2000/svg';
const BW = 168, BH = 60, CW = 284, RH = 188, PX = 30, Y0 = 76, COLS = 6, ROWS = 4;
const W = PX * 2 + CW * (COLS - 1) + BW + (CW - BW) / 2, H = Y0 + RH * (ROWS - 1) + BH + 76;
const TT = {akis: 'violet', sahne: 'accent', panel: 'cobalt'};
const GT = {}; NAV.groups.forEach(g => GT[g.id] = g.tone);
const byId = {}; NAV.nodes.forEach(n => byId[n.id] = n);
const nx = n => PX + n.c * CW, ny = n => Y0 + n.r * RH, cx = n => nx(n) + BW / 2, cy = n => ny(n) + BH / 2;
const hC = i => i < 0 ? [10, Y0 - 12] : i >= ROWS - 1 ? [Y0 + i * RH + BH + 10, H - 8] : [Y0 + i * RH + BH + 10, Y0 + (i + 1) * RH - 12];   // yatay koridor [üst, alt]
const vC = i => [PX + i * CW + BW + 10, i >= COLS - 1 ? W - 8 : PX + (i + 1) * CW - 10];                                                    // dikey koridor [sol, sağ]
const hz = s => s === 't' || s === 'b';
const portPt = (n, s, o) => s === 't' ? [cx(n) + o, ny(n)] : s === 'b' ? [cx(n) + o, ny(n) + BH] : s === 'l' ? [nx(n), cy(n) + o] : [nx(n) + BW, cy(n) + o];

// Yönlendirme: kenar türü (komşu / aynı satır / aynı sütun / çapraz), koridor şeritleri, kutu kenarında bağlantı noktaları.
function plan(list) {
  const R = list.map((e, k) => ({e, k, a: byId[e.s], b: byId[e.t], tone: GT[e.g]})), tracks = [];
  R.forEach(r => {
    const a = r.a, b = r.b, dc = b.c - a.c, dr = b.r - a.r;
    if (a === b) { r.type = 'self'; r.fs = r.ts = 't'; }
    else if (dr === 0 && Math.abs(dc) === 1) { r.type = 'ah'; r.fs = dc > 0 ? 'r' : 'l'; r.ts = dc > 0 ? 'l' : 'r'; }
    else if (dc === 0 && Math.abs(dr) === 1) { r.type = 'av'; r.fs = dr > 0 ? 'b' : 't'; r.ts = dr > 0 ? 't' : 'b'; }
    else if (dr === 0) r.type = 'row';
    else if (dc === 0) { r.type = 'col'; r.fs = r.ts = 'r'; tracks.push(r.tv = {key: 'v' + a.c, lo: Math.min(cy(a), cy(b)) - 6, hi: Math.max(cy(a), cy(b)) + 6}); }
    else if (Math.abs(dr) === 1) { r.type = 'diag'; r.fs = dr > 0 ? 'b' : 't'; r.ts = dr > 0 ? 't' : 'b'; tracks.push(r.th = {key: 'h' + (dr > 0 ? a.r : b.r), lo: Math.min(cx(a), cx(b)) - 6, hi: Math.max(cx(a), cx(b)) + 6}); }
    else {
      r.type = 'gen'; r.fs = dr > 0 ? 'b' : 't'; r.ts = dc > 0 ? 'l' : 'r';
      const hr = dr > 0 ? a.r : a.r - 1, vi = dc > 0 ? b.c - 1 : b.c, vx = (vC(vi)[0] + vC(vi)[1]) / 2, yc = (hC(hr)[0] + hC(hr)[1]) / 2;
      tracks.push(r.th = {key: 'h' + hr, lo: Math.min(cx(a), vx) - 6, hi: Math.max(cx(a), vx) + 6});
      tracks.push(r.tv = {key: 'v' + vi, lo: Math.min(yc, cy(b)) - 6, hi: Math.max(yc, cy(b)) + 6});
    }
  });
  const load = (key, lo, hi) => tracks.filter(t => t.key === key && t.lo < hi && t.hi > lo).length;
  R.filter(r => r.type === 'row').forEach(r => {
    const lo = Math.min(cx(r.a), cx(r.b)) - 6, hi = Math.max(cx(r.a), cx(r.b)) + 6, up = r.a.r - 1, dn = r.a.r, goUp = load('h' + up, lo, hi) <= load('h' + dn, lo, hi);
    r.fs = r.ts = goUp ? 't' : 'b';
    tracks.push(r.th = {key: 'h' + (goUp ? up : dn), lo, hi});
  });
  const lanes = {};
  tracks.forEach(t => (lanes[t.key] = lanes[t.key] || []).push(t));
  Object.keys(lanes).forEach(key => {
    const arr = lanes[key].sort((p, q) => p.lo - q.lo || p.hi - q.hi), ends = [];
    arr.forEach(t => { let l = ends.findIndex(en => en + 10 < t.lo); if (l < 0) { l = ends.length; ends.push(0); } ends[l] = t.hi; t.lane = l; });
    const idx = +key.slice(1), lh = key[0] === 'h' ? hC(idx) : vC(idx), n = ends.length, sp = n > 1 ? Math.min(12, (lh[1] - lh[0]) / (n - 1)) : 0, mid = (lh[0] + lh[1]) / 2;
    arr.forEach(t => { t.pos = mid + (t.lane - (n - 1) / 2) * sp; });
  });
  const pend = {}, put = (n, s, r, end, dirKey, fixed) => (pend[n.id + '|' + s] = pend[n.id + '|' + s] || []).push({r, end, dirKey, fixed}), pairs = {};
  R.forEach(r => { if (r.type === 'ah' || r.type === 'av') { const k = [r.a.id, r.b.id].sort().join('|'); (pairs[k] = pairs[k] || []).push(r); } });
  Object.values(pairs).forEach(g => { g.sort((p, q) => (p.a.id < p.b.id ? 0 : 1) - (q.a.id < q.b.id ? 0 : 1)); g.forEach((r, i) => { r.po = (i - (g.length - 1) / 2) * 18; }); });
  R.forEach(r => {
    if (r.type === 'self') { put(r.a, 't', r, 'f', 0, 26); put(r.a, 't', r, 't', 0, -26); }
    else if (r.type === 'ah' || r.type === 'av') { put(r.a, r.fs, r, 'f', 0, r.po); put(r.b, r.ts, r, 't', 0, r.po); }
    else { put(r.a, r.fs, r, 'f', hz(r.fs) ? cx(r.b) : cy(r.b), null); put(r.b, r.ts, r, 't', hz(r.ts) ? cx(r.a) : cy(r.a), null); }
  });
  Object.keys(pend).forEach(k => {
    const items = pend[k], s = k.split('|')[1], len = hz(s) ? BW : BH, step = hz(s) ? 14 : 10, maxO = len / 2 - 9;
    const fixed = items.filter(x => x.fixed !== null), free = items.filter(x => x.fixed === null);
    fixed.forEach(x => { x.r['o' + x.end] = x.fixed; });
    if (!free.length) return;
    let cand = [0]; for (let j = 1; j * step <= maxO + 0.1; j++) cand.push(-j * step, j * step);
    cand = cand.filter(c => fixed.every(f => Math.abs(f.fixed - c) >= step * 0.7));
    if (cand.length < free.length) { const m = free.length + fixed.length; cand = Array.from({length: m}, (_, j) => (j - (m - 1) / 2) * (2 * maxO) / Math.max(1, m - 1)).filter(c => fixed.every(f => Math.abs(f.fixed - c) >= 4)); }
    cand.sort((p, q) => Math.abs(p) - Math.abs(q) || p - q);
    const use = cand.slice(0, free.length).sort((p, q) => p - q);
    free.sort((p, q) => p.dirKey - q.dirKey).forEach((x, j) => { x.r['o' + x.end] = j < use.length ? use[j] : 0; });
  });
  R.forEach(r => {
    const p = portPt(r.a, r.fs, r.of), q = portPt(r.b, r.ts, r.ot);
    if (r.type === 'self') r.via = [[p[0], p[1] - 22], [q[0], q[1] - 22]];
    else if (r.type === 'ah' || r.type === 'av') r.via = [];
    else if (r.type === 'row' || r.type === 'diag') r.via = [[p[0], r.th.pos], [q[0], r.th.pos]];
    else if (r.type === 'col') r.via = [[r.tv.pos, p[1]], [r.tv.pos, q[1]]];
    else r.via = [[p[0], r.th.pos], [r.tv.pos, r.th.pos], [r.tv.pos, q[1]]];
    r.pts = [p, ...r.via, q];
  });
  return R;
}

// Etiketler: her okun üstüne, başka etiket / kutu / ok ile çakışmayan en iyi konuma (gerekirse iki satır) yazılır.
function labels(svg, P) {
  const mk = document.createElementNS(NS, 'text'), wc = {};
  mk.setAttribute('class', 'dg-lab'); svg.appendChild(mk);
  const tw = s => { if (!(s in wc)) { mk.textContent = s; let w = 0; try { w = mk.getComputedTextLength(); } catch (e) { w = 0; } wc[s] = w > 0 ? w : s.length * 6.4; } return wc[s]; };
  const vars = t => {
    const one = {lines: [t], w: tw(t)}, sp = t.split(' ');
    if (sp.length < 2 || t.length < 15) return [one];
    let best = null;
    for (let i = 1; i < sp.length; i++) { const a = sp.slice(0, i).join(' '), b = sp.slice(i).join(' '), w = Math.max(tw(a), tw(b)); if (!best || w < best.w) best = {lines: [a, b], w}; }
    return [one, best];
  };
  const segs = P.flatMap(r => r.pts.slice(1).map((q, i) => ({p: r.pts[i], q, r, L: Math.hypot(q[0] - r.pts[i][0], q[1] - r.pts[i][1])})));
  const nodeRc = NAV.nodes.map(n => [nx(n) - 4, ny(n) - 4, nx(n) + BW + 4, ny(n) + BH + 4]), placed = [];
  const hit = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  const segHit = (s, rc) => Math.min(s.p[0], s.q[0]) <= rc[2] && Math.max(s.p[0], s.q[0]) >= rc[0] && Math.min(s.p[1], s.q[1]) <= rc[3] && Math.max(s.p[1], s.q[1]) >= rc[1];
  const todo = P.filter(r => r.e.l).map(r => { const ss = segs.filter(s => s.r === r); return {r, ss, v: vars(r.e.l), maxL: Math.max(...ss.map(s => s.L))}; }).sort((p, q) => p.maxL - q.maxL);
  todo.forEach(t => {
    let best = null;
    t.ss.forEach(s => {
      if (s.L < 28) return;
      const horiz = Math.abs(s.p[1] - s.q[1]) < 1;
      [0.5, 0.3, 0.7, 0.16, 0.84].forEach((fr, fi) => {
        const x = s.p[0] + (s.q[0] - s.p[0]) * fr, y = s.p[1] + (s.q[1] - s.p[1]) * fr;
        t.v.forEach((v, vi) => {
          const h = 13 * (v.lines.length - 1);
          [0, 1].forEach(si => {
            let rc, tx, ty, anc;
            if (horiz) { anc = 'middle'; tx = x; ty = si === 0 ? y - 6 - h : y + 17; rc = [tx - v.w / 2 - 2, ty - 11, tx + v.w / 2 + 2, ty + h + 4]; }
            else { anc = si === 0 ? 'start' : 'end'; tx = x + (si === 0 ? 8 : -8); ty = y + 4 - h / 2; rc = si === 0 ? [tx - 2, ty - 11, tx + v.w + 2, ty + h + 4] : [tx - v.w - 2, ty - 11, tx + 2, ty + h + 4]; }
            let cost = fi * 0.7 + vi * 1.5 + si * 0.4;
            if (rc[0] < 2 || rc[2] > W - 2 || rc[1] < 2 || rc[3] > H - 2) cost += 200;
            placed.forEach(p => { if (hit(rc, p)) cost += 100; });
            nodeRc.forEach(p => { if (hit(rc, p)) cost += 100; });
            segs.forEach(o => { if (o.r !== t.r && segHit(o, rc)) cost += 7; });
            if (!best || cost < best.cost) best = {cost, rc, tx, ty, anc, v};
          });
        });
      });
    });
    if (!best) return;
    placed.push(best.rc);
    const tx = document.createElementNS(NS, 'text'); tx.setAttribute('class', 'dg-lab'); tx.setAttribute('text-anchor', best.anc);
    best.v.lines.forEach((ln, i) => { const ts = document.createElementNS(NS, 'tspan'); ts.setAttribute('x', best.tx); ts.setAttribute('y', best.ty + i * 13); ts.textContent = ln; tx.appendChild(ts); });
    svg.appendChild(tx);
  });
  svg.removeChild(mk);
}

let cur = 'all';
function draw(g) {
  cur = g;
  const list = NAV.edges.filter(e => g === 'all' || e.g === g), used = new Set();
  list.forEach(e => { used.add(e.s); used.add(e.t); });
  const P = plan(list), gr = NAV.groups.find(x => x.id === g);
  const nodes = NAV.nodes.map(n => ({id: n.id, x: nx(n), y: ny(n), w: BW, h: BH, label: n.name, sub: '#' + n.id, tone: TT[n.type]}));
  const edges = P.map(r => ({from: r.e.s, to: r.e.t, tone: r.tone, fromSide: r.fs, toSide: r.ts, fromOff: 0.5 + r.of / (hz(r.fs) ? BW : BH), toOff: 0.5 + r.ot / (hz(r.ts) ? BW : BH), via: r.via, w: g === 'all' ? 1.5 : 2, dashed: !!r.e.dash}));
  KK.flow(el, {width: W, height: H, minWidth: W, title: 'Ekran navigasyon haritası: 24 ekran, ' + (gr ? gr.name + ' geçişleri' : 'tüm geçişler'), nodes, edges});
  const svg = el.querySelector('svg');
  if (g !== 'all') { const gs = [...svg.children].filter(c => c.tagName === 'g'); nodes.forEach((n, i) => { if (!used.has(n.id) && gs[i]) gs[i].style.opacity = '.28'; }); }
  svg.querySelectorAll('path[stroke-dasharray]').forEach(pt => { pt.style.opacity = '.7'; pt.setAttribute('stroke-width', g === 'all' ? 1.2 : 1.6); });   // kesik oklar (#13) daha hafif
  labels(svg, P);
  note.textContent = gr ? gr.name + ': ' + list.length + ' geçiş. Okların üstündeki yazı tetikleyici etikettir; koşullar kapalı kenar listesinde tam metniyle durur.'
    : '24 ekranın hepsi düğüm olarak, ' + list.length + ' geçiş tetikleyici etiketiyle. Harita geniştir: kendi kabında yatay kaydırın; bir grup seçerek yalnızca o grubun oklarını görün.';
  [...tabs.children].forEach(b => { const on = b.dataset.g === g; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
}
el.tabIndex = 0; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Navigasyon haritası, yatay kaydırılabilir');
tabs.innerHTML = [{id: 'all', name: 'Tümü', count: NAV.edges.length}].concat(NAV.groups).map(g =>
  `<button type="button" role="tab" data-g="${g.id}" aria-controls="d-nav">${KK.esc(g.name)} <span class="n">${g.count}</span></button>`).join('');
tabs.addEventListener('click', e => { const b = e.target.closest('button[data-g]'); if (b) draw(b.dataset.g); });
tabs.addEventListener('keydown', e => {
  const bs = [...tabs.children], i = bs.findIndex(b => b.dataset.g === cur);
  const j = e.key === 'ArrowRight' ? (i + 1) % bs.length : e.key === 'ArrowLeft' ? (i - 1 + bs.length) % bs.length : e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : -1;
  if (j >= 0) { e.preventDefault(); draw(bs[j].dataset.g); bs[j].focus(); }
});
draw('all');
})();
