/* build_page.py ile üretildi */
;(function(){
const c = document.getElementById('d-sehir');
const D = [["Çarşı",2,2,11,"var(--s1)","Sev. 1 · T1"],["Liman",2,3,18,"var(--s2)","Sev. 6 · T1–2"],["Atölyeler",0,2,27,"var(--s3)","Sev. 12 · T2"],["Kampüs",0,1,35,"var(--s4)","Sev. 18 · T2–3"],["Finans Bölgesi",2,1,45,"var(--s5)","Sev. 25 · T3"],["Veri Vadisi",0,3,55,"var(--s6)","Sev. 32 · T3–4"],["Bulut Tepesi",1,0,66,"var(--fg-2)","Sev. 40 · T4"],["Akademi",1,1,38,"var(--cobalt-soft)","7 Kürsü · Atölye · Lobi"],["Derleyici Meydanı",1,2,4,"var(--accent-soft)","doğma noktası"],["Bloklar",1,3,13,"var(--surface-3)","konut · Sev. 2"]];
const SP = 3.4, BW = 2.6, P = (a, b, z) => KK.iso.xy(a, b, z || 0);
const pts = a => a.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const ground = (x0, y0, x1, y1, fill, ex) => '<polygon points="' + pts([P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]) + '" fill="' + fill + '" ' + ex + '/>';
let s = ground(-0.5, -0.5, 9.9, 13.3, 'var(--surface-2)', 'stroke="var(--line-2)" stroke-width="1.2"');
s += ground(-0.5, 13.3, 9.9, 16.3, 'var(--cobalt-soft)', 'stroke="var(--line)" stroke-width="1"');
s += '<polyline points="' + pts([[1.3, 12.95], [4.7, 13.05], [8.1, 13.05], [8.1, 13.7]].map(q => P(q[0], q[1]))) + '" fill="none" stroke="var(--cobalt)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>';
const sea = P(5, 14.9);
s += '<text x="' + sea[0].toFixed(1) + '" y="' + sea[1].toFixed(1) + '" text-anchor="middle" class="dg-g">Deniz</text>';
D.slice().sort((a, b) => (a[1] + a[2]) - (b[1] + b[2])).forEach(d => {
  s += '<g stroke="var(--line-2)" stroke-width="1" stroke-linejoin="round">' + KK.iso.block(d[1] * SP, d[2] * SP, BW, BW, d[3], {top: d[4], left: 'var(--surface-3)', right: 'var(--line-2)'}) + '</g>';
});
D.forEach(d => {
  const q = P(d[1] * SP + BW / 2, d[2] * SP + BW / 2, d[3]);
  s += '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] - 1).toFixed(1) + '" text-anchor="middle" class="iso-n">' + KK.esc(d[0]) + '</text>' +
       '<text x="' + q[0].toFixed(1) + '" y="' + (q[1] + 13).toFixed(1) + '" text-anchor="middle" class="iso-s">' + KK.esc(d[5]) + '</text>';
});
const pusula = '<g transform="translate(64,168)"><line x1="0" y1="0" x2="56" y2="-28" stroke="var(--fg-2)" stroke-width="2"/><polygon points="56,-28 44,-28 49,-18" fill="var(--fg-2)"/>' +
  '<text x="-4" y="16" class="dg-g">Kuzey</text></g>';
c.classList.add('diag');
c.innerHTML = '<svg viewBox="0 0 920 560" role="img" aria-label="Şehir krokisi: Bulut Tepesi kuzeyde, Akademi ve Meydan ortada, Liman güneydoğuda; blok yüksekliği semtin açılış seviyesidir"><g transform="translate(560,112)">' + s + '</g>' + pusula + '</svg>';
c.querySelector('svg').style.minWidth = '780px';
})();
