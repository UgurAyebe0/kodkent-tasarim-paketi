"""Ekranlar sayfası: bölüm JS şablonları (%%YER%% yer tutuculu; KK.* hazırdır)."""

# ------------------------------------------------------------------ navigasyon haritası (KK.flow; koridor şeritleri, bağlantı noktaları, etiket yerleştirme)
NAV_JS_T = r"""
const NAV = %%NAV%%;
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
"""

# ------------------------------------------------------------------ wireframe çiftleri (bölge tablosundan)
WIRE_JS_T = r"""
const WIRES = %%WIRES%%;
const NS = 'http://www.w3.org/2000/svg';
const trim = (s, max) => s.length > max ? s.slice(0, Math.max(1, max - 1)) + '…' : s;
function over(svg, rows, fs, dims) {
  rows.forEach(r => {
    const x = r[0], y = r[1], w = r[2], h = r[3];
    if (x < 0) return;
    if (r[6]) {   // alt bölgeleri olan üst bölge: adı üst kenara yaz
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x + 10); t.setAttribute('y', y + fs + 6); t.setAttribute('class', 'dg-lab'); t.style.fontSize = fs + 'px';
      t.textContent = trim(r[7], Math.floor((w - 20) / (fs * 0.56))); svg.appendChild(t);
    }
    if (dims && w >= 60 && h >= 24) {   // HUD: ölçü etiketi (px)
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x + w - 6); t.setAttribute('y', y + h - 6); t.setAttribute('class', 'dg-lab'); t.setAttribute('text-anchor', 'end');
      t.style.fontSize = (fs * 0.85) + 'px'; t.textContent = w + '×' + h; svg.appendChild(t);
    }
  });
}
Object.keys(WIRES).forEach(id => {
  const kap = document.getElementById('w-' + id), s = WIRES[id];
  if (!kap) return;
  const z = a => a.map(r => ({x: r[0], y: r[1], w: r[2], h: r[3], label: r[4], kind: r[5]}));
  KK.wirePair(kap, {title: s.t, desktop: s.d ? {zones: z(s.d)} : null, phone: s.p ? {zones: z(s.p)} : null});
  [['d', '.wp-desktop', 20], ['p', '.wp-phone', 15]].forEach(([k, sel, fs]) => {
    const svg = kap.querySelector(sel + ' svg');
    if (svg && s[k]) over(svg, s[k], fs, s.dims);
  });
});

// HUD: ölçülü yakın görünüm (üst şerit ve alt bölge; masaüstü ve telefon), bölge adı + konum + boyut px olarak yazılır
(function () {
  const kap = document.getElementById('w-hud-zoom'), sp = WIRES.hud;
  if (!kap || !sp) return;
  const TN = {hud: ['--accent-soft', '--accent'], nav: ['--cobalt-soft', '--cobalt'], content: ['--surface-2', '--line-2'], action: ['--amber-soft', '--amber'], media: ['--violet-soft', '--violet'], chat: ['--mint-soft', '--mint'], modal: ['--coral-soft', '--coral']};
  function band(rows, W, y0, y1, fs, tick, title) {
    const R = 24, H = y1 - y0 + R;
    let g = '<rect x="0" y="' + R + '" width="' + W + '" height="' + (y1 - y0) + '" fill="none" stroke="var(--line-2)" stroke-width="2" stroke-dasharray="6 5"/>';
    for (let x = 0; x <= W; x += tick) g += '<line x1="' + x + '" y1="' + (R - 8) + '" x2="' + x + '" y2="' + R + '" stroke="currentColor" stroke-width="1.2"/><text class="dg-s" x="' + (x + 3) + '" y="' + (R - 10) + '" style="font-size:' + (fs - 3) + 'px">' + x + '</text>';
    rows.forEach(r => {
      const x = r[0], y = r[1], w = r[2], h = r[3];
      if (x < 0 || y + h <= y0 || y >= y1) return;
      const t = TN[r[5]] || TN.content, yy = y - y0 + R, nm = r[6] ? r[7] : r[4], room = h >= fs * 2.3, tx = x + 6;
      g += '<rect x="' + x + '" y="' + yy + '" width="' + w + '" height="' + h + '" rx="6" fill="var(' + t[0] + ')" fill-opacity="' + (r[6] ? '.5' : '1') + '" stroke="var(' + t[1] + ')" stroke-width="1.6"/>';
      const lab = trim(nm, Math.max(3, Math.floor((w - 10) / (fs * 0.56)))), dim = x + ',' + y + ' · ' + w + '×' + h;
      g += '<text class="dg-lab" x="' + tx + '" y="' + (yy + fs + 1) + '" style="font-size:' + fs + 'px">' + KK.esc(lab) + '</text>';
      if (room && w >= 70) g += '<text class="dg-s" x="' + tx + '" y="' + (yy + h - 6) + '" style="font-size:' + (fs - 2) + 'px;font-family:var(--font-mono)">' + trim(dim, Math.floor((w - 10) / ((fs - 2) * 0.6))) + '</text>';
    });
    return '<figure><div class="diag"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + KK.esc(title) + '" style="min-width:0">' + g + '</svg></div><figcaption>' + KK.esc(title) + '</figcaption></figure>';
  }
  const d = sp.d, p = sp.p;
  kap.innerHTML = '<div class="hz-d">' + band(d, 1280, 0, 224, 17, 160, 'Masaüstü: üst şerit, 0–224 px (kenar boşluğu 16 px)') + '</div><div class="hz-d">' + band(d, 1280, 610, 800, 17, 160, 'Masaüstü: alt bölge, 610–800 px') + '</div>' +
    '<div class="hz-row"><div class="hz-m">' + band(p, 390, 0, 150, 13, 50, 'Telefon: üst şerit, 0–150 px (kenar boşluğu 8 px)') + '</div><div class="hz-m">' + band(p, 390, 636, 844, 13, 50, 'Telefon: alt bölge, 636–844 px') + '</div></div>';
})();
"""

# ------------------------------------------------------------------ izometrik tile ve sprite kuralları (KK.iso)
ISO_JS_T = r"""
const el = document.getElementById('d-iso');
const TILES = %%TILES%%;
const sh = (hex, p) => { const n = parseInt(hex.slice(1), 16), f = c => Math.max(0, Math.min(255, Math.round(c * (1 + p)))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(c => f(c).toString(16).padStart(2, '0')).join(''); };
const W = 980, H = 520, I = KK.iso;
let s = '';
// A) tile geometrisi (x3): 64x32 elmas, 2:1 eğim, duvar 48 px
const k = 3, gx0 = 130, gy0 = 56, P = (x, y) => (gx0 + x * k) + ',' + (gy0 + y * k);
s += '<text class="dg-g" x="16" y="22">A · Tile geometrisi (3 kat büyük)</text>';
s += '<polygon points="' + [P(32, 0), P(64, 16), P(32, 32), P(0, 16)].join(' ') + '" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>';
s += '<polygon points="' + [P(0, 16), P(32, 32), P(32, 80), P(0, 64)].join(' ') + '" fill="var(--cobalt-soft)" stroke="var(--cobalt)" stroke-width="1.5" opacity=".7"/>';
s += '<polygon points="' + [P(32, 32), P(64, 16), P(64, 64), P(32, 80)].join(' ') + '" fill="var(--violet-soft)" stroke="var(--violet)" stroke-width="1.5" opacity=".7"/>';
s += '<line x1="' + (gx0) + '" y1="' + (gy0 - 14) + '" x2="' + (gx0 + 64 * k) + '" y2="' + (gy0 - 14) + '" stroke="currentColor" stroke-width="1.2"/><text class="dg-lab" x="' + (gx0 + 32 * k) + '" y="' + (gy0 - 20) + '" text-anchor="middle">64 px</text>';
s += '<line x1="' + (gx0 + 64 * k + 14) + '" y1="' + gy0 + '" x2="' + (gx0 + 64 * k + 14) + '" y2="' + (gy0 + 32 * k) + '" stroke="currentColor" stroke-width="1.2"/><text class="dg-lab" x="' + (gx0 + 64 * k + 20) + '" y="' + (gy0 + 16 * k + 4) + '">32 px</text>';
s += '<text class="dg-lab" x="' + (gx0 + 3) + '" y="' + (gy0 + 80 * k + 18) + '">kat: 48 px (sol duvar −%18, sağ duvar −%32)</text>';
s += '<circle cx="' + (gx0 + 32 * k) + '" cy="' + (gy0 + 16 * k) + '" r="5" fill="var(--amber)"/><text class="dg-lab" x="' + (gx0 + 32 * k + 10) + '" y="' + (gy0 + 16 * k - 8) + '">zemin çapası (0,5; 0,5)</text>';
s += '<text class="dg-lab" x="' + (gx0 + 70 * k + 36) + '" y="' + (gy0 + 8 * k + 4) + '" text-anchor="start">eğim 2:1</text>';
// B) bir ızgara, bir bina ve 96 px avatar boyu
const ox = 650, oy = 70;
s += '<text class="dg-g" x="400" y="22">B · Izgara, bina, avatar ölçeği</text>';
for (let gy = 0; gy < 5; gy++) for (let gx = 0; gx < 5; gx++) s += I.tile(gx, gy, (gx + gy) % 2 ? 'var(--surface-2)' : 'var(--surface-3)', 'var(--line-2)', ox, oy);
s += I.block(1, 1, 2, 2, 48, {top: sh('#C8453A', .08), left: sh('#C8453A', -.18), right: sh('#C8453A', -.32)}, ox, oy);
const [ax, ay] = I.xy(3.5, 3.5);
s += '<ellipse cx="' + (ox + ax) + '" cy="' + (oy + ay) + '" rx="22" ry="9" fill="#000" opacity=".28"/>';
s += '<rect x="' + (ox + ax - 14) + '" y="' + (oy + ay - 68) + '" width="28" height="56" rx="10" fill="var(--cobalt)"/><circle cx="' + (ox + ax) + '" cy="' + (oy + ay - 78) + '" r="14" fill="var(--amber)"/>';
s += '<line x1="' + (ox + ax + 34) + '" y1="' + (oy + ay - 92) + '" x2="' + (ox + ax + 34) + '" y2="' + (oy + ay) + '" stroke="currentColor" stroke-width="1.2"/><text class="dg-lab" x="' + (ox + ax + 40) + '" y="' + (oy + ay - 40) + '">96 px</text>';
s += '<text class="dg-lab" x="' + (ox - 150) + '" y="' + (oy + 196) + '">1 kat bina = 48 px; avatar 2 kat boyunda</text>';
s += '<text class="dg-lab" x="' + (ox - 150) + '" y="' + (oy + 214) + '">ışık kuzeybatıdan (sol üst), gölge sağ alta</text>';
// C) örnek zemin tile'ları
s += '<text class="dg-g" x="16" y="344">C · Örnek zemin tile\'ları (ana renk + detay)</text>';
const dec = {
  zemin_arnavut: (x, y, d) => [[-14, 12], [-4, 18], [8, 11], [14, 17], [-8, 8], [4, 24]].map(p => '<ellipse cx="' + (x + p[0]) + '" cy="' + (y + p[1]) + '" rx="4" ry="2" fill="' + d + '"/>').join(''),
  zemin_beton: (x, y, d) => '<polygon points="' + [[x + 32, y + 16], [x, y + 32], [x - 32, y + 16], [x - 26, y + 13], [x, y + 25], [x + 26, y + 13]].map(p => p.join(',')).join(' ') + '" fill="' + d + '"/>',
  zemin_tugla: (x, y, d) => '<ellipse cx="' + (x + 6) + '" cy="' + (y + 18) + '" rx="12" ry="5" fill="' + d + '" opacity=".7"/>',
  zemin_cim: (x, y, d) => '<polygon points="' + [[x - 6, y + 6], [x + 8, y + 13], [x + 2, y + 26], [x - 12, y + 19]].map(p => p.join(',')).join(' ') + '" fill="' + d + '"/>',
  zemin_cam: (x, y, d) => '<polyline points="' + [x - 22, y + 21, x, y + 10, x + 22, y + 21].join(' ') + '" fill="none" stroke="' + d + '" stroke-width="2.5"/>',
  zemin_ahsap: (x, y, d) => [10, 16, 22].map(q => '<line x1="' + (x - 20 + (q - 10) * .6) + '" y1="' + (y + q) + '" x2="' + (x + 20 - (q - 10) * .6) + '" y2="' + (y + q) + '" stroke="#000" stroke-opacity=".25" stroke-width="1"/>').join('')
};
TILES.forEach((t, i) => {
  const x = 100 + i * 156, y = 372, kk = 1.4;
  const pts = [[x, y], [x + 32 * kk, y + 16 * kk], [x, y + 32 * kk], [x - 32 * kk, y + 16 * kk]].map(p => p.join(',')).join(' ');
  s += '<polygon points="' + pts + '" fill="' + t.ana + '" stroke="var(--line-2)" stroke-width="1"/>';
  s += '<g transform="translate(' + (x * (1 - kk)) + ',' + (y * (1 - kk)) + ') scale(' + kk + ')">' + (dec[t.ad] ? dec[t.ad](x, y, t.detay) : '') + '</g>';
  s += '<text class="dg-t" x="' + x + '" y="' + (y + 32 * kk + 24) + '" text-anchor="middle">' + KK.esc(t.ad) + '</text>';
  s += '<text class="dg-s" x="' + x + '" y="' + (y + 32 * kk + 40) + '" text-anchor="middle">' + KK.esc(t.semt + ' · ' + t.ana) + '</text>';
});
el.classList.add('diag');
el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="İzometrik tile kuralları: 64x32 elmas, 2:1 eğim, 48 px kat, 96 px avatar boyu ve altı örnek zemin tile\'ı" style="min-width:640px">' + s + '</svg>';
"""

# ------------------------------------------------------------------ süre ve easing token'ları (§3.7 / §11.1)
EASE_JS_T = r"""
const EZ = %%EASE%%;
const el = document.getElementById('d-ease');
const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const curve = c => {
  const w = 150, h = 96, py = 16, ymin = -0.1, ymax = 1.6, X = x => 10 + x * (w - 20), Y = y => py + (ymax - y) / (ymax - ymin) * (h - 2 * py);
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="150" height="96" role="img" aria-label="Eğri cubic-bezier(' + c.join(', ') + ')"><line class="kk-grid" x1="10" x2="140" y1="' + Y(0) + '" y2="' + Y(0) + '"/><line class="kk-grid" x1="10" x2="140" y1="' + Y(1) + '" y2="' + Y(1) + '"/>' +
    '<path d="M' + X(0) + ',' + Y(0) + ' C' + X(c[0]) + ',' + Y(c[1]) + ' ' + X(c[2]) + ',' + Y(c[3]) + ' ' + X(1) + ',' + Y(1) + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="3.5" fill="var(--fg-2)"/><circle cx="' + X(1) + '" cy="' + Y(1) + '" r="3.5" fill="var(--fg-2)"/></svg>';
};
const maxMs = Math.max(...EZ.durs.map(d => d.ms));
el.innerHTML = '<div class="ez-grid">' + EZ.easings.map((e, i) =>
  '<div class="ez-card"><b>' + KK.esc(e.ad) + '</b><code>cubic-bezier(' + e.css.join(', ') + ')</code>' + curve(e.css) +
  '<div class="ez-track"><i class="ez-dot" data-i="' + i + '"></i></div><button type="button" class="btn-lite ez-play" data-i="' + i + '">Oynat (800 ms)</button></div>').join('') + '</div>' +
  '<div class="ez-durs">' + EZ.durs.map(d => '<div class="ez-dur"><span><code>' + KK.esc(d.ad) + '</code> ' + KK.fmt(d.ms) + ' ms</span><i style="width:' + Math.max(4, d.ms / maxMs * 100) + '%"></i><small>' + KK.esc(d.sinif) + '</small></div>').join('') + '</div>';
el.addEventListener('click', e => {
  const b = e.target.closest('.ez-play'); if (!b) return;
  const dot = el.querySelector('.ez-dot[data-i="' + b.dataset.i + '"]'), on = dot.classList.toggle('on');
  dot.style.transition = calm ? 'none' : 'transform 800ms cubic-bezier(' + EZ.easings[+b.dataset.i].css.join(',') + ')';
  dot.style.transform = on ? 'translateX(var(--ez-run))' : 'translateX(0)';
});
"""
