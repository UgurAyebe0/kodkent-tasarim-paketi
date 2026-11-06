/* KodKent diyagram yardımcıları — brief/shared.js'ten SONRA gelir (KK nesnesini genişletir; make_skeleton.py ikisini birlikte yerleştirir).
   Amaç: kutu/ok/yaşam çizgisi/wireframe/Gantt/metro çizimini elle SVG koordinatı yazmadan, VERİYLE yapmak. Tüm renkler token (var(--…)), iki temada okunur.
   Her işlev bir kap öğeye (div) çizer; kap `.diag` sınıfını alır. Açıklama metni <figcaption>'a yazılır (SVG içine uzun metin yazma).
   KK.flow(kap, {width,height,title,nodes,edges,groups})      kutu-ok akışı / mimari / ERD (rows) / topoloji
   KK.sequence(kap, {width,title,actors,messages})            sıra diyagramı
   KK.wire(kap, {w,h,device,title,zones})  KK.wirePair(kap,{desktop,phone})   wireframe (bölge tablosundan)
   KK.gantt(kap, {weeks,rows,title})                          yatay çubuk (Gantt)
   KK.metro(kap, {width,height,lines,title})                  metro/hat haritası
   KK.iso.xy/tile/block                                       izometrik kroki ilkelleri (SVG dizesi döndürür)                          */
Object.assign(KK, (() => {
  const NS = 'http://www.w3.org/2000/svg';
  let UID = 0;
  const S = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const TONES = {
    n: ['var(--surface-2)', 'var(--line-2)'], accent: ['var(--accent-soft)', 'var(--accent)'], cobalt: ['var(--cobalt-soft)', 'var(--cobalt)'],
    amber: ['var(--amber-soft)', 'var(--amber)'], coral: ['var(--coral-soft)', 'var(--coral)'], mint: ['var(--mint-soft)', 'var(--mint)'], violet: ['var(--violet-soft)', 'var(--violet)'],
  };
  const INK = { n: 'var(--fg-2)', accent: 'var(--accent-ink)', cobalt: 'var(--cobalt)', amber: 'var(--amber-ink)', coral: 'var(--coral-ink)', mint: 'var(--mint-ink)', violet: 'var(--violet-ink)' };
  const tone = t => TONES[t] || TONES.n;
  const ink = t => INK[t] || INK.n;
  const wrap = (txt, maxC) => { const words = String(txt).split(/\s+/); const out = []; let cur = ''; for (const w of words) { if (cur && (cur + ' ' + w).length > maxC) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; } if (cur) out.push(cur); return out; };
  const lines = (parent, x, y, arr, cls, lh, anchor) => { const t = S('text', { x, y, class: cls, 'text-anchor': anchor || 'middle' }, parent); arr.forEach((ln, i) => { const ts = S('tspan', { x, dy: i ? lh : 0 }, t); ts.textContent = ln; }); return t; };
  function mount(kap, W, H, title, minW) {
    kap.innerHTML = ''; kap.classList.add('diag');
    const svg = S('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': title || 'Diyagram' }, kap);
    svg.style.minWidth = Math.min(W, minW || 640) + 'px';
    return svg;
  }
  function markers(svg, id, tones) {
    const defs = S('defs', {}, svg);
    [...new Set(tones)].forEach(t => { const m = S('marker', { id: `${id}-${t}`, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }, defs); S('path', { d: 'M0,0 L10,5 L0,10 z', fill: ink(t) }, m); });
  }

  // ---------- FLOW ----------
  function anchor(n, side, off = 0.5) {
    if (side === 'r') return [n.x + n.w, n.y + n.h * off, 1, 0];
    if (side === 'l') return [n.x, n.y + n.h * off, -1, 0];
    if (side === 't') return [n.x + n.w * off, n.y, 0, -1];
    return [n.x + n.w * off, n.y + n.h, 0, 1];
  }
  function autoSides(a, b) {
    const dx = b.x + b.w / 2 - (a.x + a.w / 2), dy = b.y + b.h / 2 - (a.y + a.h / 2);
    if (Math.abs(dx) * 0.55 >= Math.abs(dy)) return dx >= 0 ? ['r', 'l'] : ['l', 'r'];
    return dy >= 0 ? ['b', 't'] : ['t', 'b'];
  }
  function route(p1, p2, via) {
    if (via && via.length) return [[p1[0], p1[1]], ...via, [p2[0], p2[1]]];
    const [x1, y1, dx1, dy1] = p1, [x2, y2, dx2, dy2] = p2;
    if (dx1 && dx2) {
      if (Math.abs(y1 - y2) < 1) return [[x1, y1], [x2, y2]];
      const mid = dx1 === -dx2 && dx1 * (x2 - x1) > 0, xm = mid ? (x1 + x2) / 2 : (dx1 > 0 ? Math.max(x1, x2) + 24 : Math.min(x1, x2) - 24);
      return [[x1, y1], [xm, y1], [xm, y2], [x2, y2]];
    }
    if (dy1 && dy2) {
      if (Math.abs(x1 - x2) < 1) return [[x1, y1], [x2, y2]];
      const mid = dy1 === -dy2 && dy1 * (y2 - y1) > 0, ym = mid ? (y1 + y2) / 2 : (dy1 > 0 ? Math.max(y1, y2) + 24 : Math.min(y1, y2) - 24);
      return [[x1, y1], [x1, ym], [x2, ym], [x2, y2]];
    }
    if (dx1 && dy2) return [[x1, y1], [x2, y1], [x2, y2]];
    return [[x1, y1], [x1, y2], [x2, y2]];
  }
  function drawNode(g, n) {
    const [fill, stroke] = tone(n.tone); const grp = S('g', {}, g);
    if (n.rows) {
      const head = 26; S('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: 8, fill: 'var(--surface)', stroke, 'stroke-width': 1.5 }, grp);
      S('path', { d: `M${n.x},${n.y + head} V${n.y + 8} a8,8 0 0 1 8,-8 H${n.x + n.w - 8} a8,8 0 0 1 8,8 V${n.y + head} Z`, fill, stroke, 'stroke-width': 1.5 }, grp);
      const t = S('text', { x: n.x + 10, y: n.y + 17, class: 'dg-t' }, grp); t.textContent = n.label;
      n.rows.forEach((r, i) => { const rt = S('text', { x: n.x + 10, y: n.y + head + 16 + i * 16, class: 'dg-m' }, grp); rt.textContent = r; });
      return;
    }
    if (n.shape === 'cyl') {
      const ry = 8; S('path', { d: `M${n.x},${n.y + ry} v${n.h - 2 * ry} a${n.w / 2},${ry} 0 0 0 ${n.w},0 v${-(n.h - 2 * ry)}`, fill, stroke, 'stroke-width': 1.5 }, grp);
      S('ellipse', { cx: n.x + n.w / 2, cy: n.y + ry, rx: n.w / 2, ry, fill, stroke, 'stroke-width': 1.5 }, grp);
    } else S('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: n.shape === 'pill' ? n.h / 2 : 8, fill, stroke, 'stroke-width': 1.5 }, grp);
    const lab = wrap(n.label, Math.max(6, Math.floor((n.w - 14) / 6.9))), sub = n.sub ? wrap(n.sub, Math.max(6, Math.floor((n.w - 14) / 6.2))) : [];
    const th = lab.length * 15 + (sub.length ? 4 + sub.length * 13 : 0); const top = n.y + (n.h - th) / 2 + 11 + (n.shape === 'cyl' ? 4 : 0);
    lines(grp, n.x + n.w / 2, top, lab, 'dg-t', 15);
    if (sub.length) lines(grp, n.x + n.w / 2, top + (lab.length - 1) * 15 + 17, sub, 'dg-s', 13);
  }
  function flow(kap, o) {
    const W = o.width || 960, H = o.height || 420, id = 'dgf' + (++UID);
    const svg = mount(kap, W, H, o.title, o.minWidth); const byId = {}; (o.nodes || []).forEach(n => { n.w = n.w || 150; n.h = n.h || (n.rows ? 34 + n.rows.length * 16 : 52); byId[n.id] = n; });
    markers(svg, id, (o.edges || []).map(e => e.tone || 'n'));
    (o.groups || []).forEach(gr => {
      const [fill, stroke] = tone(gr.tone); S('rect', { x: gr.x, y: gr.y, width: gr.w, height: gr.h, rx: 12, fill, 'fill-opacity': 0.45, stroke, 'stroke-dasharray': '6 4', 'stroke-width': 1.2 }, svg);
      const t = S('text', { x: gr.x + 12, y: gr.y + 16, class: 'dg-g' }, svg); t.textContent = gr.label || '';
    });
    const labels = [];
    (o.edges || []).forEach(e => {
      const a = byId[e.from], b = byId[e.to]; if (!a || !b) return;
      const auto = autoSides(a, b), fs = e.fromSide || auto[0], ts = e.toSide || auto[1];
      const p1 = anchor(a, fs, e.fromOff), p2 = anchor(b, ts, e.toOff), pts = route(p1, p2, e.via);
      const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
      const attrs = { d, fill: 'none', stroke: ink(e.tone || 'n'), 'stroke-width': e.w || 1.6, 'stroke-linejoin': 'round', 'marker-end': `url(#${id}-${e.tone || 'n'})` };
      if (e.dashed) attrs['stroke-dasharray'] = '6 4'; if (e.both) attrs['marker-start'] = `url(#${id}-${e.tone || 'n'})`;
      S('path', attrs, svg);
      if (e.label) { let best = 0, bi = 0; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); if (l > best) { best = l; bi = i; } }
        const mx = (pts[bi][0] + pts[bi + 1][0]) / 2 + (e.lx || 0), my = (pts[bi][1] + pts[bi + 1][1]) / 2 + (e.ly || 0); labels.push([mx, my, e.label, e.tone]); }
    });
    (o.nodes || []).forEach(n => drawNode(svg, n));
    labels.forEach(([x, y, txt, t]) => { const ls = wrap(txt, 22); lines(svg, x, y + 4 - (ls.length - 1) * 6, ls, 'dg-lab', 12); });
  }

  // ---------- SEQUENCE ----------
  function sequence(kap, o) {
    const W = o.width || 960, n = o.actors.length, pad = 16, step = (W - 2 * pad) / n, gap = o.gap || 48, topH = 44, id = 'dgs' + (++UID);
    const msgs = o.messages, H = topH + 26 + msgs.length * gap + 24;
    const svg = mount(kap, W, H, o.title, o.minWidth || 720); const cx = i => pad + step * (i + 0.5); const ix = {}; o.actors.forEach((a, i) => (ix[a.id] = i));
    markers(svg, id, msgs.map(m => m.tone || 'n'));
    o.actors.forEach((a, i) => {
      const bw = Math.min(step - 14, 170), [fill, stroke] = tone(a.tone);
      S('line', { x1: cx(i), x2: cx(i), y1: topH, y2: H - 8, class: 'dg-life' }, svg);
      S('rect', { x: cx(i) - bw / 2, y: 4, width: bw, height: topH - 10, rx: 8, fill, stroke, 'stroke-width': 1.5 }, svg);
      const ls = wrap(a.label, Math.max(6, Math.floor((bw - 10) / 6.9))).slice(0, 2); lines(svg, cx(i), 4 + (topH - 10) / 2 + (ls.length > 1 ? -2 : 4), ls, 'dg-t', 13);
    });
    msgs.forEach((m, k) => {
      const y = topH + 26 + k * gap;
      if (m.sep) { S('line', { x1: pad, x2: W - pad, y1: y - 10, y2: y - 10, stroke: 'var(--line-2)', 'stroke-dasharray': '2 5' }, svg); const t = S('text', { x: pad + 6, y: y - 14, class: 'dg-g' }, svg); t.textContent = m.sep; return; }
      const a = ix[m.from], b = ix[m.to]; if (a === undefined || b === undefined) return;
      const x1 = cx(a), x2 = cx(b), t = m.tone || 'n';
      if (a === b) { const d = `M${x1},${y} h34 v16 h-34`; S('path', { d, fill: 'none', stroke: ink(t), 'stroke-width': 1.6, 'marker-end': `url(#${id}-${t})` }, svg); const tx = S('text', { x: x1 + 42, y: y + 12, class: 'dg-lab', 'text-anchor': 'start' }, svg); tx.textContent = m.label; return; }
      const dx = x2 > x1 ? -3 : 3; const attrs = { x1, x2: x2 + dx, y1: y, y2: y, stroke: ink(t), 'stroke-width': 1.6, 'marker-end': `url(#${id}-${t})` }; if (m.dashed) attrs['stroke-dasharray'] = '6 4'; S('line', attrs, svg);
      const ls = wrap(m.label, Math.max(10, Math.floor(Math.abs(x2 - x1) / 6.4))); lines(svg, (x1 + x2) / 2, y - 7 - (ls.length - 1) * 12, ls, 'dg-lab', 12);
      if (m.note) { const nt = S('text', { x: (x1 + x2) / 2, y: y + 15, class: 'dg-s', 'text-anchor': 'middle' }, svg); nt.textContent = m.note; }
    });
  }

  // ---------- WIREFRAME ----------
  const WK = { hud: 'accent', nav: 'cobalt', content: 'n', action: 'amber', media: 'violet', chat: 'mint', modal: 'coral' };
  function wire(kap, o) {
    const W = o.w, H = o.h, phone = o.device === 'phone', svg = mount(kap, W, H, o.title || 'Wireframe', 0); svg.style.minWidth = '0'; svg.style.maxHeight = phone ? '520px' : 'none';
    S('rect', { x: 2, y: 2, width: W - 4, height: H - 4, rx: phone ? 34 : 14, fill: 'var(--surface)', stroke: 'var(--line-2)', 'stroke-width': 4 }, svg);
    if (phone) { S('rect', { x: W / 2 - 40, y: 10, width: 80, height: 10, rx: 5, fill: 'var(--line-2)' }, svg); S('rect', { x: W / 2 - 54, y: H - 16, width: 108, height: 6, rx: 3, fill: 'var(--line-2)' }, svg); }
    (o.zones || []).forEach((z, i) => {
      const [fill, stroke] = tone(WK[z.kind] || z.tone || 'n'); S('rect', { x: z.x, y: z.y, width: z.w, height: z.h, rx: 8, fill, stroke, 'stroke-width': 2 }, svg);
      const fs = Math.max(phone ? 14 : 11, Math.min(phone ? 30 : 26, z.h * 0.3)), per = fs * 0.54; let lab = wrap(z.label || '', Math.max(4, Math.floor((z.w - 14) / per)));
      const maxLines = Math.max(1, Math.floor((z.h - 8) / (fs * 1.2))); if (lab.length > maxLines) { lab = lab.slice(0, maxLines); lab[maxLines - 1] = lab[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
      if (z.h >= fs * 1.5 && z.w >= fs * 2.4) { const t = lines(svg, z.x + z.w / 2, z.y + z.h / 2 - ((lab.length - 1) * fs * 1.2) / 2 + fs * 0.35, lab, 'dg-w', fs * 1.2); t.style.fontSize = fs + 'px'; }
      else { const t = S('text', { x: z.x + z.w / 2, y: z.y + z.h / 2 + 5, class: 'dg-w', 'text-anchor': 'middle' }, svg); t.textContent = String(i + 1); t.style.fontSize = '16px'; }
    });
  }
  function wirePair(kap, o) {
    kap.innerHTML = ''; kap.classList.add('wirepair');
    [['desktop', o.desktop, 'Masaüstü 1280×800'], ['phone', o.phone, 'Telefon 390×844']].forEach(([dev, d, cap]) => {
      if (!d) return; const fig = document.createElement('figure'); fig.className = 'wp-' + dev; const box = document.createElement('div'); fig.appendChild(box);
      const c = document.createElement('figcaption'); c.textContent = cap; fig.appendChild(c); kap.appendChild(fig);
      wire(box, { w: dev === 'desktop' ? 1280 : 390, h: dev === 'desktop' ? 800 : 844, device: dev, zones: d.zones || d, title: (o.title || '') + ' — ' + cap });
    });
  }

  // ---------- GANTT ----------
  function gantt(kap, o) {
    const weeks = o.weeks || 52, rows = o.rows, labW = o.labelWidth || 230, W = o.width || 960, rowH = 26, padT = 34, H = padT + rows.length * rowH + 14, k = (W - labW - 16) / weeks;
    const svg = mount(kap, W, H, o.title || 'Gantt', 720); const PH = { 'MVP': 's1', 'v1.1': 's2', 'v1.2': 's3', 'v2': 's5' };
    for (let w = 0; w <= weeks; w += 4) { const x = labW + w * k; S('line', { x1: x, x2: x, y1: padT - 6, y2: H - 8, stroke: 'var(--grid)' }, svg); const t = S('text', { x, y: padT - 12, class: 'dg-s', 'text-anchor': 'middle' }, svg); t.textContent = 'H' + w; }
    rows.forEach((r, i) => {
      const y = padT + i * rowH, col = `var(--${PH[r.faz] || 's1'})`; const lt = S('text', { x: 6, y: y + 17, class: 'dg-t' }, svg); lt.textContent = r.label; lt.style.fontSize = '12px';
      const bar = S('rect', { x: labW + r.start * k, y: y + 4, width: Math.max(4, r.len * k), height: rowH - 9, rx: 4, fill: col }, svg); const ti = S('title', {}, bar); ti.textContent = `${r.label}: H${r.start}–H${r.start + r.len} (${r.faz})`;
    });
    const seen = [...new Set(rows.map(r => r.faz))]; kap.insertAdjacentHTML('beforeend', `<div class="kk-legend">${seen.map(f => `<span class="kk-leg"><i style="background:var(--${PH[f] || 's1'})"></i>${f}</span>`).join('')}</div>`);
  }

  // ---------- METRO ----------
  function metro(kap, o) {
    const W = o.width || 960, H = o.height || 520, svg = mount(kap, W, H, o.title || 'Metro haritası', 720);
    (o.lines || []).forEach(l => {
      const col = `var(--${l.color || 's1'})`; const d = l.stops.map((s, i) => (i ? 'L' : 'M') + s.x + ',' + s.y).join(' ');
      S('path', { d, fill: 'none', stroke: col, 'stroke-width': 8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: 0.95 }, svg);
      const last = l.stops[l.stops.length - 1]; const nm = S('text', { x: last.x + (l.nx ?? 16), y: last.y + (l.ny ?? 4), class: 'dg-g', 'text-anchor': 'start' }, svg); nm.textContent = l.name; nm.style.fill = col;
    });
    (o.lines || []).forEach(l => l.stops.forEach(s => {
      const col = `var(--${l.color || 's1'})`;
      if (s.kind === 'is') S('rect', { x: s.x - 8, y: s.y - 8, width: 16, height: 16, rx: 4, fill: 'var(--amber)', stroke: 'var(--surface)', 'stroke-width': 2 }, svg);
      else { S('circle', { cx: s.x, cy: s.y, r: s.kind === 'aktar' ? 9 : 7, fill: 'var(--surface)', stroke: col, 'stroke-width': s.kind === 'aktar' ? 4 : 3 }, svg); if (s.kind === 'altin') S('circle', { cx: s.x, cy: s.y, r: 3.5, fill: 'var(--amber)' }, svg); }
      if (s.label) { const t = S('text', { x: s.x + (s.dx ?? 12), y: s.y + (s.dy ?? 4), class: 'dg-m', 'text-anchor': s.anchor || 'start' }, svg); t.textContent = s.label; t.style.fontFamily = 'var(--font-body)'; }
    }));
  }

  // ---------- IZOMETRIK KROKI ----------
  const iso = {
    xy(gx, gy, gz = 0) { return [(gx - gy) * 32, (gx + gy) * 16 - gz]; },
    tile(gx, gy, fill, stroke, ox = 0, oy = 0) { const p = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([a, b]) => iso.xy(gx + a, gy + b)).map(([x, y]) => `${(x + ox).toFixed(1)},${(y + oy).toFixed(1)}`).join(' '); return `<polygon points="${p}" fill="${fill}" stroke="${stroke || 'var(--line-2)'}" stroke-width="1"/>`; },
    block(gx, gy, w, d, h, c = {}, ox = 0, oy = 0) {
      const P = (a, b, z) => { const [x, y] = iso.xy(gx + a, gy + b, z); return `${(x + ox).toFixed(1)},${(y + oy).toFixed(1)}`; };
      const top = c.top || 'var(--accent)', left = c.left || 'var(--cobalt)', right = c.right || 'var(--accent-ink)';
      return `<polygon points="${P(0, 0, h)} ${P(w, 0, h)} ${P(w, d, h)} ${P(0, d, h)}" fill="${top}"/><polygon points="${P(0, d, h)} ${P(w, d, h)} ${P(w, d, 0)} ${P(0, d, 0)}" fill="${left}"/><polygon points="${P(w, 0, h)} ${P(w, d, h)} ${P(w, d, 0)} ${P(w, 0, 0)}" fill="${right}"/>`;
    },
  };
  return { flow, sequence, wire, wirePair, gantt, metro, iso };
})());
