/* KodKent ortak JS parçaları — her belge sayfasının <script> bloğunun BAŞINA aynen kopyalanır.
   İçerik: HTML kaçış, C#/SQL/JSON renklendirme, çubuk/çizgi/adım grafikleri (tooltip + tablo görünümü),
   içindekiler + scrollspy, kod kopyalama düğmeleri, Türkçe sayı biçimi. Harici kütüphane yok. */
'use strict';
const KK = (() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n, d = 0) => Number(n).toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

  // ---------- Renklendirme ----------
  const CS_KW = new Set(('abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile while async await record init required get set value yield when with nameof').split(' '));
  const SQL_KW = new Set(('select from where insert into values update set delete create table index unique primary key references foreign not null default constraint check alter add drop if exists and or in is between like join left right inner outer on group by order asc desc limit offset having union all distinct as case when then else end begin commit rollback transaction returning serial bigserial integer int bigint smallint text varchar char boolean timestamp timestamptz date numeric decimal jsonb uuid array now true false with recursive partition over row_number count sum avg min max coalesce cast type enum extension').split(' '));
  function tokenize(code, lang) {
    code = String(code);
    let out = '', i = 0;
    const push = (cls, txt) => { out += cls ? `<span class="${cls}">${esc(txt)}</span>` : esc(txt); };
    while (i < code.length) {
      const ch = code[i], nx = code[i + 1];
      if (lang !== 'json' && ch === '/' && nx === '/' || (lang === 'sql' && ch === '-' && nx === '-')) { let j = code.indexOf('\n', i); if (j < 0) j = code.length; push('c', code.slice(i, j)); i = j; continue; }
      if (ch === '/' && nx === '*') { let j = code.indexOf('*/', i + 2); j = j < 0 ? code.length : j + 2; push('c', code.slice(i, j)); i = j; continue; }
      if (ch === '"' || ch === "'" || (lang === 'cs' && (ch === '$' || ch === '@') && (nx === '"' || (code[i + 2] === '"' && (nx === '$' || nx === '@'))))) {
        let j = i; while (j < code.length && code[j] !== '"' && code[j] !== "'") j++;
        const q = code[j]; let k = j + 1;
        while (k < code.length) { if (code[k] === '\\' && q === "'") { k += 2; continue; } if (code[k] === '\\' && !code.slice(i, j).includes('@')) { k += 2; continue; } if (code[k] === q) { if (code.slice(i, j).includes('@') && code[k + 1] === q) { k += 2; continue; } k++; break; } k++; }
        push('s', code.slice(i, k)); i = k; continue;
      }
      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(nx || ''))) { let j = i + 1; while (j < code.length && /[0-9A-Za-z_.]/.test(code[j])) j++; push('n', code.slice(i, j)); i = j; continue; }
      if (/[A-Za-z_@À-ɏİıŞşĞğÜüÖöÇç]/.test(ch)) {
        let j = i + 1; while (j < code.length && /[A-Za-z0-9_À-ɏİıŞşĞğÜüÖöÇç]/.test(code[j])) j++;
        const w = code.slice(i, j), lw = w.toLowerCase();
        if (lang === 'json') { const after = code.slice(j).match(/^\s*:/); push(after ? 't' : (/^(true|false|null)$/.test(lw) ? 'k' : ''), w); }
        else if (lang === 'sql') push(SQL_KW.has(lw) ? 'k' : '', w);
        else push(CS_KW.has(w) ? 'k' : (/^[A-Z][A-Za-z0-9]*$/.test(w) ? 't' : ''), w);
        i = j; continue;
      }
      push('', ch); i++;
    }
    return out;
  }
  // JSON anahtarları için ayrı yol: "anahtar": → .t
  function hlJson(code) {
    return esc(String(code))
      .replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="t">$1</span>$2')
      .replace(/(?<!"t">)(&quot;(?:[^&]|&(?!quot;))*?&quot;)(?!<\/span>)/g, '<span class="s">$1</span>')
      .replace(/(:\s*|\[\s*|,\s*)(-?\d+(?:\.\d+)?)(?=\s*[,\]}\n])/g, '$1<span class="n">$2</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="k">$1</span>');
  }
  const hlCs = code => tokenize(code, 'cs');
  const hlSql = code => tokenize(code, 'sql');
  /** Sayfadaki tüm <pre class="code" data-lang="cs|sql|json|txt"><code>…</code></pre> bloklarını renklendirir ve kopyala düğmesi ekler. */
  function wireCode(root = document) {
    root.querySelectorAll('pre.code').forEach(pre => {
      const codeEl = pre.querySelector('code') || pre; const lang = pre.dataset.lang || 'cs'; const raw = codeEl.textContent;
      if (lang === 'cs') codeEl.innerHTML = hlCs(raw); else if (lang === 'sql') codeEl.innerHTML = hlSql(raw); else if (lang === 'json') codeEl.innerHTML = hlJson(raw);
      if (!pre.querySelector('.copy')) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'copy'; b.textContent = 'Kopyala';
        b.addEventListener('click', () => { const done = () => { b.textContent = 'Kopyalandı'; setTimeout(() => (b.textContent = 'Kopyala'), 1500); };
          try { navigator.clipboard.writeText(raw).then(done, () => sel()); } catch (e) { sel(); }
          function sel() { const r = document.createRange(); r.selectNodeContents(codeEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Seçildi'; setTimeout(() => (b.textContent = 'Kopyala'), 1500); } });
        pre.appendChild(b);
      }
    });
  }

  // ---------- Grafik altyapısı ----------
  const SVGNS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  function niceMax(v) { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const m = v / p; const n = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10; return n * p; }
  function tooltip(container) {
    let t = container.querySelector('.kk-tip'); if (!t) { t = document.createElement('div'); t.className = 'kk-tip'; t.hidden = true; container.appendChild(t); }
    return { show(html, x, y) { t.innerHTML = html; t.hidden = false; const cw = container.clientWidth; t.style.left = Math.min(x + 12, cw - t.offsetWidth - 8) + 'px'; t.style.top = Math.max(4, y - t.offsetHeight - 12) + 'px'; }, hide() { t.hidden = true; } };
  }
  function tableView(container, headers, rows) {
    const d = document.createElement('details'); d.className = 'kk-table';
    d.innerHTML = `<summary>Tablo görünümü</summary><div class="tablewrap"><table><thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td class="${i ? 'num' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    container.appendChild(d);
  }
  const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)'];
  /** Dar kapta (≤520px) grafik daha küçük bir viewBox ile çizilir ki yazılar okunur kalsın; genişlik sınıfı değişince yeniden çizilir. */
  function responsive(container, draw) {
    const narrow = () => container.clientWidth > 0 && container.clientWidth < 520;
    let was = narrow(); draw(was);
    if ('ResizeObserver' in window && !container.__kkRO) {
      container.__kkRO = new ResizeObserver(() => { const now = narrow(); if (now !== was) { was = now; draw(now); } });
      container.__kkRO.observe(container);
    }
  }
  function legend(container, names) {
    const l = document.createElement('div'); l.className = 'kk-legend';
    l.innerHTML = names.map((n, i) => `<span class="kk-leg"><i style="background:${SERIES[i % 6]}"></i>${esc(n)}</span>`).join('');
    container.appendChild(l);
  }

  /** Çubuk grafik. opts: {labels:[], series:[{name, values:[]}], yLabel, format:(v)=>str, height, title} — tek seri: lejant yok; ≤4 seri: doğrudan etiket yok, lejant var. */
  function barChart(container, opts) { responsive(container, narrow => drawBar(container, opts, narrow)); }
  function drawBar(container, opts, narrow) {
    const { labels, series, format = v => fmt(v), yLabel = '' } = opts; const height = narrow ? Math.round((opts.height || 260) * 0.85) : (opts.height || 260);
    container.classList.add('kk-chart'); container.innerHTML = '';
    const W = narrow ? 400 : 720, H = height, padL = 56, padR = 16, padT = 16, padB = 44;
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': opts.title || 'Çubuk grafik' }, container);
    const max = niceMax(Math.max(...series.flatMap(s => s.values)));
    const innerW = W - padL - padR, innerH = H - padT - padB, n = labels.length, sCount = series.length;
    const groupW = innerW / n, barW = Math.max(4, Math.min(40, (groupW * 0.7) / sCount)), gap = 2;
    const y = v => padT + innerH - (v / max) * innerH;
    for (let t = 0; t <= 4; t++) { const v = (max / 4) * t; el('line', { x1: padL, x2: W - padR, y1: y(v), y2: y(v), class: 'kk-grid' }, svg); const tx = el('text', { x: padL - 8, y: y(v) + 4, class: 'kk-ax', 'text-anchor': 'end' }, svg); tx.textContent = format(v); }
    el('line', { x1: padL, x2: W - padR, y1: y(0), y2: y(0), class: 'kk-axis' }, svg);
    if (yLabel) { const t = el('text', { x: padL, y: 10, class: 'kk-ax' }, svg); t.textContent = yLabel; }
    const tip = tooltip(container);
    labels.forEach((lab, i) => {
      const gx = padL + i * groupW + (groupW - (barW + gap) * sCount) / 2;
      series.forEach((s, k) => {
        const v = s.values[i] || 0, bx = gx + k * (barW + gap), by = y(v), bh = y(0) - by;
        const r = el('rect', { x: bx, y: by, width: barW, height: Math.max(0, bh), rx: 4, fill: SERIES[k % 6], class: 'kk-bar' }, svg);
        if (bh > 4) el('rect', { x: bx, y: y(0) - 4, width: barW, height: 4, fill: SERIES[k % 6] }, svg);
        const hit = el('rect', { x: bx - gap, y: padT, width: barW + gap * 2, height: innerH, fill: 'transparent' }, svg);
        const show = e => { const b = container.getBoundingClientRect(); tip.show(`<b>${esc(lab)}</b>${sCount > 1 ? ' · ' + esc(s.name) : ''}<br>${esc(format(v))}`, e.clientX - b.left, e.clientY - b.top); r.classList.add('on'); };
        hit.addEventListener('mousemove', show); hit.addEventListener('mouseleave', () => { tip.hide(); r.classList.remove('on'); });
      });
      const t = el('text', { x: padL + i * groupW + groupW / 2, y: H - padB + 18, class: 'kk-ax', 'text-anchor': 'middle' }, svg); t.textContent = lab;
    });
    if (sCount > 1) legend(container, series.map(s => s.name));
    tableView(container, ['', ...series.map(s => s.name)], labels.map((l, i) => [l, ...series.map(s => format(s.values[i]))]));
  }

  /** Çizgi grafik. opts: {x:[], series:[{name, values:[]}], format, height, yLabel, title, area:boolean} — crosshair + tooltip. */
  function lineChart(container, opts) { responsive(container, narrow => drawLine(container, opts, narrow)); }
  function drawLine(container, opts, narrow) {
    const { x, series, format = v => fmt(v), yLabel = '', area = false } = opts; const height = narrow ? Math.round((opts.height || 280) * 0.85) : (opts.height || 280);
    container.classList.add('kk-chart'); container.innerHTML = '';
    const direct = !narrow && series.length > 1 && series.length <= 4;
    const W = narrow ? 400 : 720, H = height, padL = 60, padR = direct ? 16 + Math.round(6.4 * Math.max(...series.map(s => s.name.length))) : 20, padT = 18, padB = 40;
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': opts.title || 'Çizgi grafik' }, container);
    const all = series.flatMap(s => s.values); const rawMin = Math.min(...all);
    const max = niceMax(Math.max(...all)), min = rawMin < 0 ? -niceMax(-rawMin) : 0, n = x.length;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const X = i => padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW), Y = v => padT + innerH - ((v - min) / (max - min)) * innerH;
    for (let t = 0; t <= 4; t++) { const v = min + ((max - min) / 4) * t; el('line', { x1: padL, x2: W - padR, y1: Y(v), y2: Y(v), class: 'kk-grid' }, svg); const tx = el('text', { x: padL - 8, y: Y(v) + 4, class: 'kk-ax', 'text-anchor': 'end' }, svg); tx.textContent = format(v); }
    el('line', { x1: padL, x2: W - padR, y1: Y(0), y2: Y(0), class: 'kk-axis' }, svg);
    if (yLabel) { const t = el('text', { x: padL, y: 10, class: 'kk-ax' }, svg); t.textContent = yLabel; }
    const step = Math.max(1, Math.ceil(n / (narrow ? 5 : 8))); const lastTick = Math.floor((n - 1) / step) * step;
    x.forEach((lab, i) => { if (i % step === 0 || (i === n - 1 && (n - 1) - lastTick >= step / 2)) { const t = el('text', { x: X(i), y: H - padB + 18, class: 'kk-ax', 'text-anchor': 'middle' }, svg); t.textContent = lab; } });
    series.forEach((s, k) => {
      const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
      if (area) el('path', { d: `${d} L${X(n - 1)},${Y(0)} L${X(0)},${Y(0)} Z`, fill: SERIES[k % 6], opacity: 0.12 }, svg);
      el('path', { d, fill: 'none', stroke: SERIES[k % 6], 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
      const last = s.values.length - 1; el('circle', { cx: X(last), cy: Y(s.values[last]), r: 4.5, fill: SERIES[k % 6], stroke: 'var(--surface)', 'stroke-width': 2 }, svg);
      if (direct) { const t = el('text', { x: X(last) + 8, y: Y(s.values[last]) + 4, class: 'kk-lab' }, svg); t.textContent = s.name; }
    });
    const cross = el('line', { x1: 0, x2: 0, y1: padT, y2: padT + innerH, class: 'kk-cross' }, svg); cross.setAttribute('visibility', 'hidden');
    const dots = series.map((s, k) => { const c = el('circle', { r: 5, fill: SERIES[k % 6], stroke: 'var(--surface)', 'stroke-width': 2 }, svg); c.setAttribute('visibility', 'hidden'); return c; });
    const tip = tooltip(container);
    const hit = el('rect', { x: padL, y: padT, width: innerW, height: innerH, fill: 'transparent' }, svg);
    hit.addEventListener('mousemove', e => {
      const b = svg.getBoundingClientRect(); const px = (e.clientX - b.left) / b.width * W; let i = Math.round(((px - padL) / innerW) * (n - 1)); i = Math.max(0, Math.min(n - 1, i));
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
      dots.forEach((c, k) => { c.setAttribute('cx', X(i)); c.setAttribute('cy', Y(series[k].values[i])); c.setAttribute('visibility', 'visible'); });
      const cb = container.getBoundingClientRect();
      tip.show(`<b>${esc(x[i])}</b>` + series.map((s, k) => `<br><i class="kk-dot" style="background:${SERIES[k % 6]}"></i>${esc(s.name)}: ${esc(format(s.values[i]))}`).join(''), e.clientX - cb.left, e.clientY - cb.top);
    });
    hit.addEventListener('mouseleave', () => { cross.setAttribute('visibility', 'hidden'); dots.forEach(c => c.setAttribute('visibility', 'hidden')); tip.hide(); });
    if (series.length > 1) legend(container, series.map(s => s.name));
    tableView(container, ['', ...series.map(s => s.name)], x.map((l, i) => [l, ...series.map(s => format(s.values[i]))]));
  }

  /** Adım (basamak) grafiği: sıçramalı fonksiyonlar için (otopark ücreti vs dakika). opts:{points:[[x,y],…] artan x, xLabel, yLabel, format, xFormat, height, title, marks:[{x, label}]} */
  function stepChart(container, opts) { responsive(container, narrow => drawStep(container, opts, narrow)); }
  function drawStep(container, opts, narrow) {
    const { points, format = v => fmt(v), xFormat = v => fmt(v), yLabel = '', xLabel = '', marks = [] } = opts; const height = narrow ? Math.round((opts.height || 280) * 0.85) : (opts.height || 280);
    container.classList.add('kk-chart'); container.innerHTML = '';
    const W = narrow ? 400 : 720, H = height, padL = 60, padR = 20, padT = 18, padB = 44;
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': opts.title || 'Adım grafiği' }, container);
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]); const xmax = Math.max(...xs), ymax = niceMax(Math.max(...ys));
    const innerW = W - padL - padR, innerH = H - padT - padB; const X = v => padL + (v / xmax) * innerW, Y = v => padT + innerH - (v / ymax) * innerH;
    for (let t = 0; t <= 4; t++) { const v = (ymax / 4) * t; el('line', { x1: padL, x2: W - padR, y1: Y(v), y2: Y(v), class: 'kk-grid' }, svg); const tx = el('text', { x: padL - 8, y: Y(v) + 4, class: 'kk-ax', 'text-anchor': 'end' }, svg); tx.textContent = format(v); }
    el('line', { x1: padL, x2: W - padR, y1: Y(0), y2: Y(0), class: 'kk-axis' }, svg);
    const xt = narrow ? 4 : 6;
    for (let t = 0; t <= xt; t++) { const v = (xmax / xt) * t; const tx = el('text', { x: X(v), y: H - padB + 18, class: 'kk-ax', 'text-anchor': 'middle' }, svg); tx.textContent = xFormat(Math.round(v)); }
    if (yLabel) { const t = el('text', { x: padL, y: 10, class: 'kk-ax' }, svg); t.textContent = yLabel; }
    if (xLabel) { const t = el('text', { x: W - padR, y: H - 6, class: 'kk-ax', 'text-anchor': 'end' }, svg); t.textContent = xLabel; }
    let d = ''; points.forEach((p, i) => { if (i === 0) d += `M${X(p[0])},${Y(p[1])}`; else { d += ` H${X(p[0])} V${Y(p[1])}`; } });
    el('path', { d, fill: 'none', stroke: 'var(--s1)', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg);
    marks.forEach(m => { const px = X(m.x); el('line', { x1: px, x2: px, y1: padT, y2: Y(0), class: 'kk-mark' }, svg); const right = px > W - padR - 48; const t = el('text', { x: right ? px - 4 : px + 4, y: padT + 12, class: 'kk-lab', 'text-anchor': right ? 'end' : 'start' }, svg); t.textContent = m.label; });
    const tip = tooltip(container); const hit = el('rect', { x: padL, y: padT, width: innerW, height: innerH, fill: 'transparent' }, svg);
    hit.addEventListener('mousemove', e => { const b = svg.getBoundingClientRect(); const vx = ((e.clientX - b.left) / b.width * W - padL) / innerW * xmax; let yv = points[0][1]; for (const p of points) { if (p[0] <= vx) yv = p[1]; } const cb = container.getBoundingClientRect(); tip.show(`${esc(xFormat(Math.round(vx)))} → <b>${esc(format(yv))}</b>`, e.clientX - cb.left, e.clientY - cb.top); });
    hit.addEventListener('mouseleave', () => tip.hide());
    tableView(container, [xLabel || 'x', yLabel || 'y'], points.map(p => [xFormat(p[0]), format(p[1])]));
  }

  // ---------- İçindekiler + scrollspy ----------
  function buildToc(nav, scope = document) {
    const slug = s => s.toLowerCase().replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const hs = [...scope.querySelectorAll('main h2, main h3')].filter(h => !h.closest('.kk-chart, details'));
    const used = new Set();
    hs.forEach(h => { if (!h.id) { const sec = h.closest('section[id]'); let id = (h.tagName === 'H2' && sec && !used.has(sec.id)) ? sec.id : slug(h.textContent) || 'bolum'; let base = id, k = 2; while (used.has(id) || (document.getElementById(id) && document.getElementById(id) !== h && !(sec && sec.id === id))) { id = base + '-' + k++; } h.id = id; } used.add(h.id); });
    nav.innerHTML = '<ol>' + hs.map(h => `<li class="${h.tagName.toLowerCase()}"><a href="#${h.id}">${esc(h.textContent)}</a></li>`).join('') + '</ol>';
    if ('IntersectionObserver' in window) {
      const links = new Map(hs.map(h => [h.id, nav.querySelector(`a[href="#${h.id}"]`)]));
      const io = new IntersectionObserver(ents => { ents.forEach(en => { if (en.isIntersecting) { links.forEach(a => a.classList.remove('on')); const a = links.get(en.target.id); if (a) a.classList.add('on'); } }); }, { rootMargin: '0px 0px -70% 0px' });
      hs.forEach(h => io.observe(h));
    }
  }
  function openHash() { const id = (location.hash || '').replace(/^#/, ''); if (/^[A-Za-z0-9._~-]+$/.test(id)) { const t = document.getElementById(id); if (t) { t.closest('details') && (t.closest('details').open = true); t.scrollIntoView(); } } }

  return { esc, fmt, hlCs, hlSql, hlJson, wireCode, barChart, lineChart, stepChart, buildToc, openHash, SERIES };
})();
