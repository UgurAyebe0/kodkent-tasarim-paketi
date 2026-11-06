/* indirDosya(ad, veri, yedekMetin): artifact görüntüleyicisi düz indirmeye izin vermez. `downloads` yeteneği varsa
   kullanıcı onayıyla kaydeder; yoksa (ya da hata olursa) içeriği panoya kopyalar. */
function indirDosya(ad, veri, yedekMetin) {
  function yedek() {
    return kopyala(String(yedekMetin || '')).then(function (ok) {
      toast(ok ? 'İndirme bu görünümde kapalı; içerik panoya kopyalandı.' : 'İndirme bu görünümde kapalı; içeriği elle kopyalayabilirsin.', ok ? 'bilgi' : 'uyari');
    });
  }
  var dl;
  try { dl = (window.claude && window.claude.use) ? window.claude.use('downloads') : null; } catch (e) { dl = null; }
  return Promise.resolve(dl).then(function (d) {
    if (!d || !d.save) return yedek();
    return d.save({ filename: ad, data: veri }).then(function () { toast(ad + ' kaydedildi.', 'basari'); }, function (e) {
      if (e && e.code === 'declined') return;
      return yedek();
    });
  }, yedek);
}
