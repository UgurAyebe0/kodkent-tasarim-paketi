/* build_page.py ile üretildi */
;(function(){
KK.stepChart(document.getElementById('c-ucret'), {points:[[0,0],[1,100],[61,200],[120,80],[121,120],[181,160],[241,200],[301,240],[361,250],[1441,500],[1500,500]], xLabel:'kalış süresi (dk)', yLabel:'ücret (TL)', format:v => KK.fmt(v, Number.isInteger(v) ? 0 : 1) + ' TL', xFormat:v => KK.fmt(v) + ' dk', height:300, title:'Otopark ücret kademesi, 0 ile 1500 dakika', marks:[{x:120,label:'2 sa'},{x:360,label:'6 sa'},{x:1440,label:'24 sa'}]});
KK.stepChart(document.getElementById('c-ucret-zoom'), {points:[[0,0],[1,100],[61,200],[120,80],[121,120],[181,160],[241,200],[301,240],[361,250],[720,250]], xLabel:'kalış süresi (dk)', yLabel:'ücret (TL)', format:v => KK.fmt(v, Number.isInteger(v) ? 0 : 1) + ' TL', xFormat:v => KK.fmt(v) + ' dk', height:280, title:'Otopark ücret kademesi, ilk 12 saat; 119 dakikada 200 TL, 120 dakikada 80 TL', marks:[{x:120,label:'2 sa: 200→80'},{x:360,label:'6 sa'}]});
})();
