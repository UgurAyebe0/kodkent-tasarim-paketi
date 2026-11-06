# Belge sayfalarını spec Markdown'ından üretmek (md2html + build_page)

Amaç: B-belgelerindeki zengin Markdown'ı (başlık, tablo, kod, alıntı) LLM ile yeniden yazmadan HTML sayfasına dönüştürmek. Metin spec'ten AYNEN gelir; sen yalnızca hangi bölümün nereye gideceğini, bölüm girişlerini ve tablolardan türeyen görselleri (grafik, diyagram, kart) yazarsın.

## Akış
`tools/pages/<anahtar>.py` (`PAGE` sözlüğü) → `python tools/build_page.py <anahtar>` → `build/parts/<anahtar>/NN-<id>.html|css|js` → `assemble_doc.py` → `build/kodkent-<anahtar>.html`.
Sonra: `python tools/check_artifact.py build/kodkent-<anahtar>.html` ve `bash tools/shot_all.sh build/kodkent-<anahtar>.html <bölüm-id> …`. Çalışılmış örnek: `tools/pages/mufredat.py`.

## Manifest şeması
```python
PAGE = {
  "hooks": [fn, ...],            # tüm kaynaklara uygulanan tablo kancaları (isteğe bağlı)
  "reserved_ids": ["c-xp"],      # elle yazdığın id'ler; başlık id'leriyle çakışmasın
  "css": "...",                  # sayfa CSS'i (yalnızca tokenlar), 00-md2html.css'e eklenir
  "sections": [{
    "id": "dersler", "title": "Modül ve ders tablosu",       # <section id><h2>title</h2>; title yoksa h2 yazılmaz
    "html_top": "...",   # h2'den ÖNCE (kapak gibi)         "intro": "<p>1–2 cümle</p>",
    "html_before": "...", "html_after": "...",               # kaynaklardan önce / sonra ham HTML
    "js": "KK.barChart(...)",                                # bölüm JS'i (IIFE içine sarılır; üst düzey const çakışmaz)
    "css": "...",
    "sources": [{"file": "B4-mufredat.md", "from": "## 3.", "to": "## 4.", "demote": 1, "collapse_over": 8000}],
  }]}
```
Kaynak anahtarları: `file` (spec/ altındaki ad) ya da `md` (satır içi Markdown) · `from`/`to` (başlık ÖNEKİ, çit-farkında; `to` yoksa bölüm sonu) · `demote` (varsayılan 1: `##`→h3) · `collapse_over` (bayt) · `collapse` (her zaman kapalı başlık önekleri, ör. `["### 3.13"]`) · `top` (daraltmada üst seviye; `###` ile başlayan parçada `2`) · `terminal` (dilsiz/txt kod → `<pre class="terminal">`) · `skip_heading` · `id_prefix` (varsayılan `b4-`) · `hooks` · `max_code_lines`.
`sources` yerine sıralı `parts` verilebilir: `[{"html": "..."}, {"file": ...}, {"md": "..."}]` — araya grafik/kutu sokmak için.

## Kütüphane (`from md2html import ...`)
`extract(path, from, to=None, keep_heading=True)` · `render(md, demote, collapse_over, ...)` → `Rendered` (`.js`, `.headings`) · `render_file(path, from, to, **kw)` · `tables(md)` → `Table(headers, rows, heading, raw_headers, raw_rows)` (düz metin) · `table_html(raw_headers, raw_rows)` · `parse_num("1.200,5")` · `inline`, `strip_md`, `slugify` · CLI: `python tools/md2html.py B4-mufredat.md --list` (başlık + bayt) ya da `--from "## 3." --demote 1`.
Desteklenen: başlık (çit içindeki `#` başlık değildir), paragraf, iç içe liste, borulu tablo (`\|` kaçışı; sayısal sütunlar `class="num"`), çitli kod (`csharp/cs→cs`, `sql`, `json`, diğer→`txt`), alıntı (`.callout`; `**Ad:** "…"` ya da Hasan Abi'li tırnaklı → `blockquote.musteri`; ≥2 `**Ad:**` paragrafı → `.chat` balonları), `---`, `` `kod` ``, `**kalın**`, `*italik*`, `[m](url)`, `<br>`. Ham HTML kaçırılır; başlık id'leri tekil düz-token (Türkçe→ASCII) ve sayfa genelinde tekildir.

## Tablo kancası (tablo → grafik/kart)
```python
def hook_xp(headers, rows, ctx=None):         # headers/rows düz metin; ctx: heading, prev, raw_rows, raw_headers, source
    if headers[:2] != ["Modül", "Kısa ad"]: return None      # None = tabloya dokunma
    vals = [md2html.parse_num(r[-1]) for r in rows]
    html = '<figure><div id="c-xp"></div><figcaption>Tek iddia.</figcaption></figure>'
    js = "KK.barChart(document.getElementById('c-xp'), {labels:%s, series:[{name:'XP', values:%s}]});" % (json.dumps([r[0] for r in rows]), json.dumps(vals))
    return html, js                                           # ya da yalnızca html
PAGE["hooks"] = [hook_xp]     # ya da md2html.TABLE_HOOKS.append(hook_xp)
```
Kanca kendi çıktısına özgün tabloyu `md2html.table_html(ctx["raw_headers"], ctx["raw_rows"])` ile `<details class="acc">` içinde geri koyabilir.

## İpuçları
- Uzun alt bölümler için `collapse_over` (uzun parçalarda 4000–6000; küçük kart listelerinde 500); başlık `<summary id=…>` olur, `#bağlantı` kapalı bölümü açar (`KK.openHash`).
- Veriyi tablodan oku (`tables()` + `parse_num`), sayıyı elle yazma; sayıyı doğrulayan `assert`/uyarı ekle (örnek: KANON §5.1 testleri ile ücret fonksiyonu).
- JS verisini `json.dumps(..., ensure_ascii=False).replace("</", "<\\/")` ile göm; `%%YER%%` yer tutuculu şablon dizesi kullan (f-string süslü parantez sorunu olmaz).
- Her grafik/diyagram için `<figure><div id="…"></div><figcaption>…</figcaption></figure>` kabı bırak; id'leri `reserved_ids`'e yaz.
- Elle yazılmış `NN-*` parçaları `build/parts/<anahtar>/` içinde varsa `build_page` silmeden durur; üretilenler `build_page.py ile üretildi` işaretini taşır, `--force` hepsini siler.
- Sorun giderme: `HATA: tekrarlı id` → `id_prefix` ver; `UYARI: hedefi olmayan # bağlantıları` → hedef id'yi kontrol et; 400 px'de yatay taşma yoksa tablo/diyagram kendi kabında kayar.
