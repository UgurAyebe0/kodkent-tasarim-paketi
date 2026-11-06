export const meta = {
  name: 'kodkent-artifact-uretimi',
  description: 'Bes KodKent artifact sayfasini paralel yazar, otomatik denetler, bagimsiz inceler ve duzeltir',
  phases: [
    { title: 'Uretim', detail: 'her artifact icin bir yazar ajan (spec + brif + ortak kutuphane)' },
    { title: 'Inceleme', detail: 'denetleyici + ekran goruntuleri + bagimsiz inceleme ajani' },
    { title: 'Duzeltme', detail: 'bulgulara gore duzeltme, ikinci inceleme, gerekirse ikinci duzeltme' },
  ],
}

const SP = 'C:/Users/uuray/OneDrive/Masaüstü/Aİ-Oyun/kodkent-tasarim-paketi'
const BR = `${SP}/brief`, SPEC = `${SP}/spec`, BUILD = `${SP}/build`, TOOLS = `${SP}/tools`

const ARTS = [
  { key: 'tasarim', file: 'kodkent-tasarim.html', title: 'KodKent Oyun Tasarımı', section: 'A', single: false,
    specs: ['A-vizyon-FINAL.md', 'KANON.md', 'B1-dunya-sehir.md', 'B2-ilerleme-ekonomi.md', 'B3-egitim-ai.md', 'B6-gorevler-sosyal-liveops.md', 'B9-urun-yol-haritasi.md', 'B10-ek-tamamlayici.md', 'MASTER-INDEX.md'] },
  { key: 'teknik', file: 'kodkent-teknik.html', title: 'KodKent Teknik Mimari', section: 'B', single: false,
    specs: ['KANON.md', 'B7-backend-mimari.md', 'B8-istemci-ui.md', 'B3-egitim-ai.md', 'B5-isletmeler-kod.md', 'B9-urun-yol-haritasi.md', 'B10-ek-tamamlayici.md'] },
  { key: 'mufredat', file: 'kodkent-mufredat.html', title: 'KodKent Müfredat ve İşletmeler', section: 'C', single: false,
    specs: ['KANON.md', 'B4-mufredat.md', 'B5-isletmeler-kod.md', 'B3-egitim-ai.md', 'B2-ilerleme-ekonomi.md', 'B10-ek-tamamlayici.md'] },
  { key: 'ekranlar', file: 'kodkent-ekranlar.html', title: 'KodKent Ekran Tasarımları', section: 'D', single: false,
    specs: ['KANON.md', 'B8-istemci-ui.md', 'B1-dunya-sehir.md', 'B3-egitim-ai.md', 'B6-gorevler-sosyal-liveops.md', 'B10-ek-tamamlayici.md'] },
  { key: 'prototip', file: 'kodkent-prototip.html', title: 'KodKent Oyun Prototipi', section: 'E', single: true,
    specs: ['KANON.md', 'B8-istemci-ui.md', 'B10-ek-tamamlayici.md', 'B5-isletmeler-kod.md', 'B3-egitim-ai.md', 'B2-ilerleme-ekonomi.md', 'B6-gorevler-sosyal-liveops.md', 'B1-dunya-sehir.md', 'B4-mufredat.md'] },
]

const COMMON = `Sen KodKent (oyunlaştırılmış C# öğrenme oyunu) tasarım paketini HTML "artifact" sayfaları olarak üreten stüdyo ekibindesin. Çıktı dili TÜRKÇE.
Önce şu dosyaları Read ile TAMAMEN oku (atlamak yasak):
1) ${BR}/00-fikir.md (kurucu fikri, SABİT kararlar)
2) ${BR}/01-tasarim-sistemi.md (sayfa sözleşmesi, tokenlar, grafik/diyagram kuralları — BAĞLAYICI)
3) ${BR}/02-artifact-briefleri.md (ilgili bölümün zorunlu içerik listesi)
4) ${SPEC}/KANON.md (isimler ve sayılar BAĞLAYICI; başka belgeyle çelişirse KANON kazanır)
Kurallar: Artifact aracını KULLANMA, hiçbir şey yayınlama; yalnızca ${BUILD}/ altına dosya yaz. Soru sorma; karar ver. Son metnin insan için mesaj değil, istenen yapısal veridir.`

const BUILD_SCHEMA = { type: 'object', properties: { path: { type: 'string' }, bytes: { type: 'number' }, checker: { type: 'string' }, sections: { type: 'array', items: { type: 'string' } }, screenshots: { type: 'array', items: { type: 'string' } }, known_gaps: { type: 'array', items: { type: 'string' } }, notes: { type: 'string' } }, required: ['path', 'bytes', 'checker', 'sections', 'screenshots', 'known_gaps', 'notes'] }
const REVIEW_SCHEMA = { type: 'object', properties: { ship: { type: 'boolean' }, checker: { type: 'string' }, findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['kritik', 'yuksek', 'orta', 'dusuk'] }, where: { type: 'string' }, issue: { type: 'string' }, fix: { type: 'string' } }, required: ['severity', 'where', 'issue', 'fix'] } }, overall: { type: 'string' } }, required: ['ship', 'checker', 'findings', 'overall'] }
const FIX_SCHEMA = { type: 'object', properties: { path: { type: 'string' }, applied: { type: 'array', items: { type: 'string' } }, skipped: { type: 'array', items: { type: 'string' } }, checker: { type: 'string' }, notes: { type: 'string' } }, required: ['path', 'applied', 'skipped', 'checker', 'notes'] }

const specList = a => a.specs.map(s => `- ${SPEC}/${s}${s.startsWith('B10') ? ' (varsa; yoksa atla)' : ''}`).join('\n')
const shotCmd = a => `bash ${TOOLS}/shot_all.sh ${BUILD}/${a.file} <bolum-id-1> <bolum-id-2> ...`
const checkCmd = a => `python ${TOOLS}/check_artifact.py ${BUILD}/${a.file}${a.single ? ' --single-theme' : ''}`

function buildPrompt(a) {
  const docRules = a.single ? `
PROTOTİP ÖZEL KURALLAR (brief §E):
- TEK TEMA (gece şehri): media/[data-theme] blokları YOK; :root{color-scheme:dark} ve tüm renkler açık yazılır; body{background:…} zorunlu. 01-tasarim-sistemi.md §2'deki KOYU değerleri sabit palet olarak kullan (ör. --bg:#0D1326, --surface:#151D36, --accent:#22C9CE, --amber:#FFBE3D, --coral:#FF7A66, --mint:#45D98D, --violet:#9B86FF, --fg:#E8EDF8, --muted:#9AA7C7, --line:#2A3558).
- Fontlar: Fredoka (başlık/HUD), Nunito (gövde), JetBrains Mono (kod). html,body{height:100%}; 100vh yok.
- İKİ <script> bloğu: İLKİ DOM'a dokunmayan saf çekirdek (global \`KK_CORE\`; sözleşme ${TOOLS}/proto_core_test.mjs dosyasının başındaki yorumda — AYNEN uy), İKİNCİSİ arayüz. Çekirdeği \`node ${TOOLS}/proto_core_test.mjs ${BUILD}/${a.file}\` ile test et; "tüm çekirdek testleri geçti" çıkmadan teslim yok.
- \`sample\` yeteneği: brief §E.3'teki deseni AYNEN kullan (claude.use('sample'), .json, modelTier quick/default, cache:false, AbortController, hata kodları, çevrimdışı yedek). Otopark testleri: AI bağlıysa simülasyon + etiket, değilse KK_CORE.sezgiselTest.
- Ekranlar: brief §E.2'deki 19 ekranın HEPSİ (hash token adlarıyla) gerçek içerikle; şehir haritası SVG izometrik; HUD; demo çubuğu (ekran seçici, Baştan başla, Hızlı kurulum, AI rozeti).
- Ortak kütüphaneden yalnızca \`esc\`, \`fmt\`, C# tokenizer (\`hlCs\`) ve gerekirse barChart'ı al; TOC/scrollspy alma.` : `
BELGE KURALLARI:
- İKİ TEMA: 01-tasarim-sistemi.md §2'deki token bloğunu AYNEN kopyala; hemen altına ${BR}/shared.css içeriğini AYNEN kopyala; sonra sayfaya özel CSS.
- <script> bloğunun BAŞINA ${BR}/shared.js içeriğini AYNEN kopyala (KK.* fonksiyonları: hlCs/hlSql/hlJson/wireCode, barChart/lineChart/stepChart, buildToc, openHash). Sayfa sonunda: KK.wireCode(); KK.buildToc(document.getElementById('toc')); KK.openHash();
- İskelet: 01 §8 (topbar + logomark ${BR}/logo.svg.txt + nav.family (data-doc) → .layout → nav.toc + main > section[id] → footer.site). Mobil için main'in başına <details class="acc toc-mobile"><summary>İçindekiler</summary><nav id="toc-m"></nav></details> koy ve KK.buildToc'u iki nav için de çağır.
- Grafikler KK.* ile (veri JS dizisinde), diyagramlar satır içi SVG (01 §6), kod blokları <pre class="code" data-lang="cs|sql|json|txt"><code>…</code></pre> (HTML kaçışı: < yerine &lt;).
- Tablolar <div class="tablewrap"><table>…; sayı hücreleri class="num".`
  return `${COMMON}

GÖREVİN: "${a.title}" sayfasını yazmak → ${BUILD}/${a.file}
Brief: ${BR}/02-artifact-briefleri.md içindeki **${a.section}. bölüm** (zorunlu bölüm listesi oradadır; HEPSİ olacak, sırası korunacak).
Ayrıca oku: ${BR}/logo.svg.txt, ${BR}/shared.css, ${BR}/shared.js ve şu spec'ler (içerik buradan gelir; UYDURMA, spec'teki gerçek sayı/isim/metinleri kullan; spec'te olmayan bir ayrıntı gerekiyorsa KANON ile tutarlı biçimde tamamla ve notes'a yaz):
${specList(a)}
${docRules}

YAZIM YÖNTEMİ (büyük dosya): Dosyayı PARÇA PARÇA üret. Önce Write ile iskeleti yaz (title, meta, font link, <style>, topbar, layout, toc, <main> içinde yalnızca \`<!-- BOLUMLER -->\` işareti, footer, <script>). Sonra her bölümü Edit ile \`<!-- BOLUMLER -->\` işaretini "bölüm HTML'i + <!-- BOLUMLER -->" ile değiştirerek ekle (her Edit en fazla ~250 satır). En son işareti sil. Tek seferde dev bir Write DENEME.
İÇERİK KALİTESİ: Gerçek, somut, spec'lerden gelen içerik; tablolarda gerçek satırlar; her zorunlu bölüm dolu; lorem/TODO/"buraya gelecek" YASAK; metin Türkçe; bölüm başlıkları id'li (düz token). Belgeler 9.000+ kelime hedefler (brief'teki hedefe uy); prototip tüm ekranları çalışır hâlde içerir.
KALİTE KONTROL (zorunlu, sırayla):
1) ${checkCmd(a)} → RESULT PASS olmalı; her FAIL'i düzelt ve tekrar çalıştır.
2) ${shotCmd(a)} (bölüm id'leri: en önemli 3-4 bölüm) → üretilen PNG'leri Read ile AÇ ve BAK: taşma, üst üste binme, boş alan, okunmayan yazı, kırık grafik, tema hatası varsa düzelt ve tekrar çek. Masaüstü açık + koyu ve mobil görüntülerin üçü de incelenmeden teslim yok.
${a.single ? `3) node ${TOOLS}/proto_core_test.mjs ${BUILD}/${a.file} → "tüm çekirdek testleri geçti".` : '3) Grafiklerin tablo görünümünü ve TOC bağlantılarını HTML içinde kontrol et (id eşleşmeleri).'}
DÖNÜŞ: path, bytes, checker ("PASS"), sections (bölüm id listesi), screenshots (PNG yolları), known_gaps (spec'te bulamayıp tamamladıkların), notes.`
}

function reviewPrompt(a, build, round) {
  return `${COMMON}

ROLÜN: Bağımsız, titiz ve şüpheci inceleyici (kıdemli frontend + içerik editörü). Övgü yazma; sorun bul; ama her bulgu doğrulanabilir olsun (satır/bölüm/ekran görüntüsü referansı).
İNCELENECEK: ${BUILD}/${a.file} (${round}. tur). Yazarın notu: ${JSON.stringify(build && build.notes || '')} · bilinen boşluklar: ${JSON.stringify(build && build.known_gaps || [])}
Ayrıca oku: ${BR}/02-artifact-briefleri.md **${a.section}. bölüm** ve bu spec'ler (örneklem kontrolü için):
${specList(a)}

YAP:
1) ${checkCmd(a)} çalıştır; sonucu kaydet.
2) ${shotCmd(a)} ile 3 temel görüntü + 3 bölüm görüntüsü al; Read ile hepsine bak (taşma, üst üste binme, boş/kesik alan, kontrast, tema tutarsızlığı, mobil düzen, grafik ölçeği/lejant/tablo görünümü, diyagram okunurluğu).
3) HTML'i oku (Read; büyükse parçalar hâlinde): brief'teki ZORUNLU bölümlerin hepsi var mı ve dolu mu (başlık var içerik yok = kritik)? Lorem/TODO/yer tutucu var mı? Türkçe yazım ve terim tutarlılığı? KANON ile 15 rastgele değer/isim karşılaştır (semt adları, Usta adları, fiyatlar, XP, seviye tavanı, para birimleri, otopark kuralları birebir).
${a.single ? `4) node ${TOOLS}/proto_core_test.mjs ${BUILD}/${a.file}; sonra JS'i mantıksal olarak incele: her ekranın render fonksiyonu var mı, data-action olayları bağlı mı, sample deseni brief §E.3 ile aynı mı (cache:false, AbortController, hata kodları), çevrimdışı yedek çalışıyor mu, state kaydı try/catch içinde mi, hash yalnızca düz token mu, 100vh yok mu, alert/confirm yok mu.` : '4) Grafik verilerinin spec ile uyumu; diyagramlarda ok etiketleri; kod bloklarının dilleri; TOC id eşleşmeleri; bağlantıların (#id) hedefleri var mı.'}
DÖNÜŞ: ship (kritik/yüksek bulgu yoksa true), checker, findings (en fazla 30; severity: kritik=yayınlanamaz, yuksek=mutlaka düzelt, orta=düzeltilmeli, dusuk=isteğe bağlı; where: bölüm id/satır/ekran; issue; fix: uygulanabilir düzeltme), overall (3-4 cümle).`
}

function fixPrompt(a, review, round) {
  return `${COMMON}

ROLÜN: Düzeltme editörü (aynı sayfanın yazarı kadar yetkin). Dosya: ${BUILD}/${a.file}
Bağımsız incelemenin bulguları (${round}. tur):
${JSON.stringify(review.findings, null, 1)}
Genel değerlendirme: ${review.overall}
Ayrıca oku: ${BR}/02-artifact-briefleri.md **${a.section}. bölüm**; gerekirse ilgili spec'ler:
${specList(a)}

YAP: kritik ve yüksek bulguların HEPSİNİ, orta bulguların mümkün olanlarını Edit ile düzelt (dosyayı sıfırdan yazma; büyük eklemeler gerekiyorsa işaret yöntemiyle parça parça ekle). Katılmadığın bir bulgu varsa skipped'a gerekçesiyle yaz. Sonra:
1) ${checkCmd(a)} → PASS;
2) ${shotCmd(a)} → PNG'leri Read ile kontrol et;
${a.single ? `3) node ${TOOLS}/proto_core_test.mjs ${BUILD}/${a.file} → geçmeli.` : '3) değiştirdiğin bölümlerin görüntüsünü kontrol et.'}
DÖNÜŞ: path, applied (bulgu özetleri), skipped (gerekçeli), checker, notes.`
}

const needsFix = r => r && r.findings && (r.findings.some(f => f.severity === 'kritik' || f.severity === 'yuksek') || !/PASS/.test(r.checker || ''))

phase('Uretim')
log('5 artifact paralel yazılıyor (bu aşama uzun sürer)')
const results = await pipeline(ARTS,
  a => agent(buildPrompt(a), { label: `yaz:${a.key}`, phase: 'Uretim', schema: BUILD_SCHEMA }),
  (build, a) => agent(reviewPrompt(a, build, 1), { label: `incele1:${a.key}`, phase: 'Inceleme', schema: REVIEW_SCHEMA, effort: 'high' }).then(review => ({ build, review1: review })),
  (ctx, a) => {
    if (!needsFix(ctx.review1)) { log(`${a.key}: ilk incelemede yayınlanabilir (${ctx.review1 ? ctx.review1.findings.length : 0} bulgu)`); return { ...ctx, fix1: null } }
    log(`${a.key}: ${ctx.review1.findings.length} bulgu; düzeltiliyor`)
    return agent(fixPrompt(a, ctx.review1, 1), { label: `duzelt1:${a.key}`, phase: 'Duzeltme', schema: FIX_SCHEMA }).then(fix => ({ ...ctx, fix1: fix }))
  },
  (ctx, a) => {
    if (!ctx.fix1) return { ...ctx, review2: null }
    return agent(reviewPrompt(a, { notes: ctx.fix1.notes, known_gaps: ctx.fix1.skipped }, 2), { label: `incele2:${a.key}`, phase: 'Inceleme', schema: REVIEW_SCHEMA, effort: 'high' }).then(review => ({ ...ctx, review2: review }))
  },
  (ctx, a) => {
    if (!ctx.review2 || !needsFix(ctx.review2)) return { ...ctx, fix2: null }
    log(`${a.key}: ikinci turda hâlâ ${ctx.review2.findings.length} bulgu; son düzeltme`)
    return agent(fixPrompt(a, ctx.review2, 2), { label: `duzelt2:${a.key}`, phase: 'Duzeltme', schema: FIX_SCHEMA }).then(fix => ({ ...ctx, fix2: fix }))
  },
)

return ARTS.map((a, i) => {
  const r = results[i]
  if (!r) return { key: a.key, file: `${BUILD}/${a.file}`, status: 'bilinmiyor (ajan sonucu yok)' }
  const last = r.review2 || r.review1
  return {
    key: a.key, file: `${BUILD}/${a.file}`, title: a.title,
    build: r.build ? { bytes: r.build.bytes, checker: r.build.checker, sections: r.build.sections, known_gaps: r.build.known_gaps } : null,
    review1: r.review1 ? { ship: r.review1.ship, checker: r.review1.checker, n: r.review1.findings.length, overall: r.review1.overall } : null,
    fix1: r.fix1 ? { applied: r.fix1.applied.length, skipped: r.fix1.skipped, checker: r.fix1.checker } : null,
    review2: r.review2 ? { ship: r.review2.ship, checker: r.review2.checker, n: r.review2.findings.length, overall: r.review2.overall } : null,
    fix2: r.fix2 ? { applied: r.fix2.applied.length, skipped: r.fix2.skipped, checker: r.fix2.checker } : null,
    remaining: last ? last.findings.filter(f => f.severity === 'kritik' || f.severity === 'yuksek') : [],
  }
})
