/* build_page.py ile üretildi */
;(function(){
{

const el = document.getElementById('d-iso');
const TILES = [{"ad":"zemin_arnavut","semt":"Çarşı","ana":"#A89F91","detay":"#F4EFE6"},{"ad":"zemin_beton","semt":"Liman","ana":"#9AA3A8","detay":"#2E6F95"},{"ad":"zemin_tugla","semt":"Atölyeler","ana":"#9C4A3C","detay":"#3B3B3F"},{"ad":"zemin_cim","semt":"Kampüs","ana":"#6FBF73","detay":"#F1E9D2"},{"ad":"zemin_cam","semt":"Finans","ana":"#1F2A44","detay":"#35F0E0"},{"ad":"zemin_ahsap","semt":"Oda","ana":"#8B6A4E","detay":"#5C4630"}];
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

}
{

const EZ = {"easings":[{"ad":"ease-out","css":[0.22,1.0,0.36,1.0]},{"ad":"ease-pop","css":[0.34,1.56,0.64,1.0]},{"ad":"ease-inout","css":[0.65,0.0,0.35,1.0]}],"durs":[{"ad":"dur-1","ms":100,"sinif":"geri bildirim (≤ 160 ms)"},{"ad":"dur-2","ms":160,"sinif":"geri bildirim (≤ 160 ms)"},{"ad":"dur-3","ms":240,"sinif":"geçiş (240–400 ms)"},{"ad":"dur-4","ms":400,"sinif":"geçiş (240–400 ms)"},{"ad":"dur-5","ms":800,"sinif":"tören (≥ 800 ms)"}]};
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

}
})();
