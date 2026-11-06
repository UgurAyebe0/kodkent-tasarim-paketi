/* Entegrasyon testi 4: dar ekranda (pencere genisligine gore) 24 ekranin yatay tasma + dokunma hedefi denetimi; #galeri */
(async function () {
  const out = [];
  const T = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  const root = document.getElementById('screen');
  KK_UI.hizliMod = true;
  out.push('innerWidth=' + window.innerWidth + ' innerHeight=' + window.innerHeight);
  const kirpar = function (el, kok) { // el, kok'a kadar yatay kirpan/kaydiran bir ata ile sarili mi?
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) { const ox = getComputedStyle(a).overflowX; if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true; if (a === kok) break; }
    return false;
  };
  const tokens = KK_UI.EKRANLAR.map(function (e) { return e.token; });
  for (const t of tokens) {
    try {
      sifirla(); hizliKurulum(); if (typeof demoHazirla === 'function') demoHazirla(t); KK_UI.modalTemizle();
      go(t); await T(900); KK_UI.modalTemizle();
      const W = window.innerWidth, dw = document.documentElement.scrollWidth, sw = root.scrollWidth, cw = root.clientWidth, off = [];
      Array.prototype.forEach.call(document.querySelectorAll('#hud *, #screen *'), function (el) {
        const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; if (r.right > W + 1 && !kirpar(el, document.getElementById('app'))) { if (off.length < 3) off.push(el.tagName.toLowerCase() + '.' + String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).split(' ')[0] + '(' + Math.round(r.right) + ')'); }
      });
      let kucuk = 0; const kk = [];
      Array.prototype.forEach.call(document.querySelectorAll('#hud button, #screen button, #screen a[href], #screen [data-action]:not(svg *), #screen input:not([type=hidden]), #screen select'), function (el) {
        const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; if (el.closest('svg')) return; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return;
        if (r.height < 40 && r.width < 40) { kucuk++; if (kk.length < 3) kk.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }
      });
      out.push((dw > W + 1 || sw > cw + 1 || off.length ? 'TASMA ' : 'ok    ') + t + ' | doc ' + dw + '/' + W + ' screen ' + sw + '/' + cw + (off.length ? ' | ' + off.join(', ') : '') + ' | <40px hedef: ' + kucuk + (kk.length ? ' (' + kk.join('; ') + ')' : ''));
    } catch (e) { out.push('HATA  ' + t + ' :: ' + ((e && e.message) || e)); }
  }
  try {
    const h0 = KK_UI.hatalar.length; sifirla(); hizliKurulum();
    for (const h of ['galeri', 'galeri-ikon', 'galeri-avatar', 'galeri-usta', 'galeri-iso', 'galeri-etkilesim']) { location.hash = '#' + h; await T(500); KK_UI.modalTemizle(); }
    const yeni = KK_UI.hatalar.slice(h0); out.push((yeni.length ? 'FAIL ' : 'OK   ') + 'galeri alt hash\'leri' + (yeni.length ? ' :: ' + yeni[0].mesaj : '') + ' | ekran ' + KK_UI.mevcut + ' | icerik ' + root.textContent.length + ' kr');
  } catch (e) { out.push('FAIL galeri :: ' + ((e && e.message) || e)); }
  const pre = document.createElement('pre'); pre.id = 'e2e-out'; pre.textContent = out.join('\n'); document.body.appendChild(pre);
})();
