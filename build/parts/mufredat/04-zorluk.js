/* build_page.py ile üretildi */
;(function(){
KK.barChart(document.getElementById('c-dk'), {labels:["M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11"], series:[{name:"Ortalama ders süresi", values:[8.0,9.0,10.0,11.5,11.4,12.0,12.0,12.0,14.0,14.0,14.0]}], yLabel:"dk / ders", format:v => KK.fmt(v, Number.isInteger(v) ? 0 : 1) + " dk", height:280, title:"Modül bazında ortalama ders süresi (dk)"});
KK.barChart(document.getElementById('c-xp'), {labels:["M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11"], series:[{name:"Ortalama ders XP'si", values:[100,140,180,255,255,280,280,280,400,400,400]}], yLabel:"XP / ders", format:v => KK.fmt(v, Number.isInteger(v) ? 0 : 1) + " XP", height:280, title:"Modül bazında ortalama ders XP'si"});
})();
