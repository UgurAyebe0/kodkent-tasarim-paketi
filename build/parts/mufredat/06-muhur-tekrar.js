/* build_page.py ile üretildi */
;(function(){
KK.flow(document.getElementById('d-muhur'), {width:980, height:450, title:'Ders Mührü kararı, Telafi Turu ve 1-3-7-21 tekrar takvimi',
 groups:[{x:10,y:8,w:960,h:252,tone:'cobalt',label:'Ders Mührü ve Telafi Turu'},{x:10,y:290,w:960,h:152,tone:'accent',label:'Günlük Tekrar'}],
 nodes:[
  {id:'kart',x:30,y:100,w:120,h:60,label:'Kartlar',sub:'Tahmin et → Yap'},
  {id:'soru',x:215,y:100,w:140,h:60,label:'S1 → S2 → S3',sub:'soru başına 2 deneme'},
  {id:'deg',x:420,y:100,w:140,h:60,label:'Değerlendir',sub:'3 sorudan ikisi 70 ve üstü mü?',tone:'amber'},
  {id:'muh',x:690,y:30,w:240,h:56,label:'Muhurlu',sub:'görev açılır, takvim başlar',tone:'mint'},
  {id:'tel',x:690,y:102,w:240,h:56,label:'TelafiBekliyor',sub:'10 dk sonra, farklı 3 soru; sınırsız',tone:'coral'},
  {id:'pua',x:690,y:174,w:240,h:56,label:'PuanBekliyor',sub:'günlük kota doldu; gece Batch ile puanlanır',tone:'violet'},
  {id:'t0',x:80,y:340,w:150,h:56,label:'T0',sub:'mühür günü',tone:'cobalt',shape:'pill'},
  {id:'p1',x:280,y:340,w:130,h:56,label:'+1 gün',tone:'accent',shape:'pill'},
  {id:'p3',x:450,y:340,w:130,h:56,label:'+3 gün',tone:'accent',shape:'pill'},
  {id:'p7',x:620,y:340,w:150,h:56,label:'+7 gün',sub:'3 doğru: altın',tone:'accent',shape:'pill'},
  {id:'p21',x:810,y:340,w:150,h:56,label:'+21 gün',sub:'altın: bakım sorusu',tone:'amber',shape:'pill'}],
 edges:[
  {from:'kart',to:'soru',label:'sırayla'},
  {from:'soru',to:'deg',label:'3 puan'},
  {from:'deg',to:'muh',label:'≥ 70: iki soru',tone:'mint'},
  {from:'deg',to:'tel',label:'< 70: iki soru',tone:'coral'},
  {from:'deg',to:'pua',label:'puan yok (kota)',tone:'violet'},
  {from:'muh',to:'t0',label:'takvim başlar',tone:'mint',fromSide:'r',toSide:'t',via:[[950,58],[950,275],[155,275]]},
  {from:'t0',to:'p1'},{from:'p1',to:'p3'},{from:'p3',to:'p7'},{from:'p7',to:'p21'},
  {from:'p7',to:'t0',dashed:true,tone:'coral',label:'yanlış: T0 = bugün',fromSide:'b',toSide:'b'}]});
})();
