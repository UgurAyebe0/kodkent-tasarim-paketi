/* build_page.py ile üretildi */
;(function(){
const SRC = [["İşletme geliri","%60 · ≈12.296 B",12296.4,"cobalt"],["Görev ve Ruhsat","%20 · ≈4.099 B",4098.8,"accent"],["Günlük Tekrar ve seri","%8 · ≈1.640 B",1639.52,"mint"],["Haftalık lig","%7 · ≈1.435 B",1434.58,"violet"],["Alkış ve sosyal","%5 · ≈1.025 B",1024.7,"amber"]], SNK = [["Mevcut giderler","tapu, yükseltme, Daire, kozmetik · 6.822 B",6822,"coral"],["İşletme içi dekorasyon","hedef 3.000 B/ay",3000,"violet"],["Nadir rotasyonu","hedef 2.400 B/ay",2400,"amber"],["Büyük Kasa","hedef 1.500 B/ay",1500,"cobalt"],["Belediye Projeleri","hedef 1.000 B/ay",1000,"mint"],["Kalan bakiye","5.772 B",5772,"n"]], TOP = "Bayt akışı: beş kaynak, Bayt cüzdanı ve altı çıkış; kalınlık miktarla orantılı";
const el = document.getElementById('d-ekonomi');
const W = 960, H = 410, K = 0.0034, CX = 420, CW = 120, LX = 20, LW = 235, RX = 705, RW = 235;
const total = SRC.reduce((s, a) => s + a[2], 0);
const ch = Math.round(total * K + 36), cy0 = Math.round((H - ch) / 2);
const nodes = [];
SRC.forEach((s, i) => nodes.push({id: 's' + i, x: LX, y: 20 + i * 74, w: LW, h: 56, label: s[0], sub: s[1], tone: s[3]}));
SNK.forEach((s, i) => nodes.push({id: 'k' + i, x: RX, y: 10 + i * 65, w: RW, h: 52, label: s[0], sub: s[1], tone: s[3]}));
nodes.push({id: 'b', x: CX, y: cy0, w: CW, h: ch, label: 'Bayt', sub: 'cüzdan, 30 gün', tone: 'amber'});
KK.flow(el, {width: W, height: H, minWidth: 820, title: TOP, nodes: nodes, edges: []});
const NS = 'http://www.w3.org/2000/svg', svg = el.querySelector('svg'), first = svg.querySelector('g');
const band = (x1, y1, x2, y2, amt, tone, ad) => {
  const p = document.createElementNS(NS, 'path'), xm = (x1 + x2) / 2, t = document.createElementNS(NS, 'title');
  p.setAttribute('d', 'M' + x1 + ',' + y1.toFixed(1) + ' C' + xm + ',' + y1.toFixed(1) + ' ' + xm + ',' + y2.toFixed(1) + ' ' + x2 + ',' + y2.toFixed(1));
  p.setAttribute('fill', 'none'); p.setAttribute('stroke', tone === 'n' ? 'var(--muted)' : 'var(--' + tone + ')');
  p.setAttribute('stroke-width', Math.max(2, amt * K).toFixed(1)); p.setAttribute('opacity', '0.55');
  t.textContent = ad + ': ' + KK.fmt(Math.round(amt)) + ' B'; p.appendChild(t); svg.insertBefore(p, first);
};
let yL = cy0 + (ch - total * K) / 2, yR = yL;
SRC.forEach((s, i) => { const w = s[2] * K; band(LX + LW, 20 + i * 74 + 28, CX, yL + w / 2, s[2], s[3], s[0]); yL += w; });
SNK.forEach((s, i) => { const w = s[2] * K; band(CX + CW, yR + w / 2, RX, 10 + i * 65 + 26, s[2], s[3], s[0]); yR += w; });

KK.lineChart(document.getElementById('c-sim'), {x:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"], series:[{"name":"Hafif","values":[10,10,80,80,160,160,80,80,155,301,376,471,547,842,917,977,452,527,603,642,1047,1223,988,1067,1243,1478,1823,2483,2298,2533]},{"name":"Normal","values":[60,20,100,293,585,908,691,903,1526,1439,1961,2934,3047,3679,4510,5067,4577,5264,6207,7025,8228,7027,7989,8948,9791,10489,11332,12131,12973,13672]},{"name":"Yoğun","values":[0,604,608,862,1946,1830,3486,3190,4414,5638,6862,8086,9310,10784,11936,13088,14240,15392,16544,17696,19098,20250,21402,22554,23706,24858,26010,26512,27304,27756]}], yLabel:'Bayt bakiyesi', format:v => KK.fmt(v) + ' B', height:320, title:'30 günlük Bayt bakiyesi: hafif, normal ve yoğun oyuncu'});
})();
