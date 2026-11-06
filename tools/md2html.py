#!/usr/bin/env python3
"""md2html — KodKent spec Markdown alt kümesini belge sayfası HTML'ine çevirir (yalnızca Python 3 stdlib).

KÜTÜPHANE (build_page.py ve sayfa yazarları için):
  extract(md_path, from_heading, to_heading=None, keep_heading=True) -> str
        Markdown'dan bölüm keser. Başlık ÖNEKİYLE eşleşir ("## 3." ya da "3." ya da "### 4.2 Büfe"); ``` çitleri
        İÇİNDEKİ '#' satırları başlık sayılmaz. to_heading yoksa bölüm, aynı/üst seviyeli sonraki başlığa kadar sürer.
  render(md, demote=0, collapse_over=None, **kw) -> Rendered (str alt sınıfı: .js, .headings, .ids)
        demote          başlık seviyesini kaydırır (1: ## -> h3). En çok h6.
        collapse_over   bayt eşiği: ilk başlıktan DERİN alt bölümlerden eşiği aşanlar <details class="acc"><summary id=…> içine sarılır.
        collapse        her zaman daraltılacak başlık önekleri listesi (ör. ["### 3.13", "### 3.14"]).
        ids             sayfa genelinde tekil id kaydı (set); id_prefix: tüm başlık id'lerine önek ("b4-").
        terminal        True ise dil belirtilmemiş/txt kod blokları <pre class="terminal"> olur.
        hooks           yalnızca bu çağrıya özel tablo kancaları; genel liste: TABLE_HOOKS.
        max_code_lines  bu satırdan uzun kod blokları .long (kaydırmalı) olur. source: kanca bağlamı için dosya adı.
        top             daraltma için "üst seviye" başlık düzeyi (varsayılan: parçadaki en küçük seviye); ör. ### ile başlayan bir parçada top=2
                        verilirse ### alt bölümleri de daraltılabilir.
  render_file(md_path, from_heading=None, to_heading=None, **kw) -> Rendered     (extract + render)
  tables(md) -> [Table(headers, rows, heading, raw_headers, raw_rows)]           tabloları düz metin olarak verir
  table_html(raw_headers, raw_rows) -> str           varsayılan tablo HTML'i (kanca içinden "tablo görünümü" koymak için)
  inline(text), strip_md(text), slugify(text), parse_num("1.200,5") -> 1200.5, headings(md_path) -> [(seviye, metin, bayt)]

TABLO KANCASI: TABLE_HOOKS.append(fn). fn(headers, rows) ya da fn(headers, rows, ctx) çağrılır; headers/rows DÜZ METİNDİR
  (md işaretleri atılmış). ctx: heading, prev (önceki blok metni), source, raw_headers, raw_rows, index.
  Dönüş: None (tabloya dokunma) | "<html>" | (html, js). js, Rendered.js içinde toplanır (build_page bölüm .js'ine ekler).

CLI:  python tools/md2html.py DOSYA [--from "## 3."] [--to "## 4."] [--demote 1] [--collapse-over 8000] [--terminal] [--out X.html]
      python tools/md2html.py DOSYA --list          (başlıklar + bayt boyutları)
"""
import argparse
import html as _html
import inspect
import pathlib
import re
import sys
from collections import namedtuple

ROOT = pathlib.Path(__file__).resolve().parent.parent
SPEC = ROOT / "spec"

TABLE_HOOKS = []  # fn(headers, rows[, ctx]) -> None | html | (html, js)

# Dönüştürücünün ürettiği işaretlemenin ihtiyaç duyduğu küçük CSS (yalnızca tokenlar). build_page.py bunu 00-md2html.css olarak yazar.
CSS = """
hr{border:0;border-top:1px solid var(--line);margin:22px 0}
pre.code.long,pre.terminal.long{max-height:30rem;overflow:auto}
pre.terminal{margin:12px 0;line-height:1.45}
.bubble.sistem{align-self:center;background:transparent;border:1px dashed var(--line-2);color:var(--fg-2);font-size:14px}
details.acc > summary > code{font-size:.9em}
section h3{margin-top:30px}
section h4{margin-top:22px}
td p,th p{margin:0}
td.nw{white-space:nowrap}
td code,p code,li code,dd code,summary code{overflow-wrap:anywhere}
p,li,dd,summary,.callout,blockquote.musteri{overflow-wrap:break-word}
"""

_TR = str.maketrans("çÇğĞıİöÖşŞüÜâÂîÎûÛéÉ", "ccggiioossuuaaiiuuee")
_PUA0, _PUA1 = "", ""

Table = namedtuple("Table", "headers rows heading raw_headers raw_rows")


class Rendered(str):
    """render() sonucu: HTML metni + .js (kancalardan gelen JS) + .headings [(seviye, id, düz metin)]."""
    js = ""
    headings = ()


# ---------------------------------------------------------------- yardımcılar
def esc(s):
    return _html.escape(str(s), quote=False)


def attr(s):
    return _html.escape(str(s), quote=True)


def strip_md(t):
    """Satır içi markdown işaretlerini atar (düz metin)."""
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = re.sub(r"(`+)(.+?)\1", r"\2", t)
    t = re.sub(r"\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|(?<![\w*])\*(?=[^\s*])(.+?)(?<=[^\s*])\*(?![\w*])", lambda m: m.group(1) or m.group(2) or m.group(3), t)
    t = re.sub(r"<br\s*/?>", " ", t, flags=re.I)
    t = re.sub(r"\\([\\`*_{}\[\]()#+\-.!|<>~])", r"\1", t)
    return t.strip()


def slugify(text, fallback="bolum"):
    """Türkçe -> ASCII düz-token (a-z0-9 ve '-')."""
    s = strip_md(text).translate(_TR).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or fallback


def parse_num(s):
    """'1.200' -> 1200, '8,0' -> 8.0, '%61' -> 61, '−640' -> -640. Sayı bulunamazsa ValueError."""
    t = strip_md(str(s)).replace("−", "-").replace("–", "-").replace("≈", "").replace("~", "").strip()
    m = re.search(r"[-+]?\d[\d.]*(?:,\d+)?", t)
    if not m:
        raise ValueError(f"sayı değil: {s!r}")
    v = m.group(0)
    if "," in v:
        v = v.replace(".", "").replace(",", ".")
    elif re.fullmatch(r"[-+]?\d{1,3}(\.\d{3})+", v):
        v = v.replace(".", "")
    f = float(v)
    return int(f) if f == int(f) and "." not in v else f


_URL_OK = re.compile(r"^(https?://|#|/|\./|\.\./|[\w\-./]+$)", re.I)


def inline(text):
    """Satır içi markdown -> HTML. Ham HTML kaçırılır; yalnızca <br> serbesttir."""
    store = []

    def keep(h):
        store.append(h)
        return f"{_PUA0}{len(store) - 1}{_PUA1}"

    def code(m):
        c = m.group(2)
        if len(c) > 2 and c[0] == " " and c[-1] == " " and c.strip():
            c = c[1:-1]
        return keep(f"<code>{esc(c)}</code>")

    t = re.sub(r"(`+)(.+?)(?<!`)\1(?!`)", code, text)
    t = re.sub(r"<br\s*/?>", lambda m: keep("<br>"), t, flags=re.I)
    t = re.sub(r"\\([\\`*_{}\[\]()#+\-.!|<>~\"'])", lambda m: keep(esc(m.group(1))), t)
    t = esc(t)

    def link(m):
        label, url = m.group(1), m.group(2).replace("&amp;", "&")
        if not _URL_OK.match(url) or re.match(r"^\s*(javascript|data|vbscript):", url, re.I):
            return label
        ext = ' rel="noopener"' if url.lower().startswith("http") else ""
        return f'<a href="{attr(url)}"{ext}>{label}</a>'

    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^)]*?\")?\)", link, t)
    t = re.sub(r"\*\*\*(?=\S)(.+?)(?<=\S)\*\*\*", r"<strong><em>\1</em></strong>", t)
    t = re.sub(r"\*\*(?=\S)(.+?)(?<=\S)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?=[^\s*])(.+?)(?<=[^\s*])\*(?![\w*])", r"<em>\1</em>", t)
    t = re.sub(r"~~(?=\S)(.+?)(?<=\S)~~", r"<s>\1</s>", t)
    return re.sub(f"{_PUA0}(\\d+){_PUA1}", lambda m: store[int(m.group(1))], t)


# ---------------------------------------------------------------- blok ayrıştırma
_FENCE = re.compile(r"^(\s*)(`{3,}|~{3,})\s*([^\s`]*)[^`]*$")
_HEAD = re.compile(r"^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$")
_HR = re.compile(r"^\s{0,3}([-*_])(?:\s*\1){2,}\s*$")
_LIST = re.compile(r"^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$")
_ALIGN = re.compile(r"^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$")
_QUOTE = re.compile(r"^\s{0,3}>")


def _indent(l):
    return len(l) - len(l.lstrip(" "))


def _bytes(lines):
    return sum(len(x.encode("utf-8")) + 1 for x in lines)


def _split_row(line):
    """Borulu tablo satırını hücrelere ayırır; '\\|' kaçışlıdır (hücrede '|' olur)."""
    s = line.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|") and not s.endswith("\\|"):
        s = s[:-1]
    cells, cur, i = [], [], 0
    while i < len(s):
        ch = s[i]
        if ch == "\\" and i + 1 < len(s) and s[i + 1] == "|":
            cur.append("|")
            i += 2
            continue
        if ch == "|":
            cells.append("".join(cur).strip())
            cur = []
        else:
            cur.append(ch)
        i += 1
    cells.append("".join(cur).strip())
    return cells


def _is_start(lines, i):
    """lines[i], bir paragrafı kesen yeni bir blok başlatır mı?"""
    l = lines[i]
    if _FENCE.match(l) or _HEAD.match(l) or _HR.match(l) or _QUOTE.match(l) or _LIST.match(l):
        return True
    return "|" in l and i + 1 < len(lines) and bool(_ALIGN.match(lines[i + 1])) and "|" in lines[i + 1]


def iter_headings(lines):
    """Çit-farkında başlık taraması: (satır_no, seviye, metin, ham_satır)."""
    fence = None
    for i, l in enumerate(lines):
        m = _FENCE.match(l)
        if m:
            mark = m.group(2)
            if fence is None:
                fence = mark
            elif mark[0] == fence[0] and len(mark) >= len(fence) and not m.group(3) and l.strip() == mark:
                fence = None
            continue
        if fence is not None:
            continue
        h = _HEAD.match(l)
        if h:
            yield i, len(h.group(1)), h.group(2).strip(), l.strip()


def parse_blocks(lines):
    """Satırları blok listesine çevirir. Her blok: {'k': tür, 'size': bayt, …}."""
    bs, i, n = [], 0, len(lines)
    while i < n:
        l = lines[i]
        if not l.strip():
            i += 1
            continue
        start = i
        m = _FENCE.match(l)
        if m:
            ind, mark, lang = len(m.group(1)), m.group(2), m.group(3)
            i += 1
            body = []
            while i < n:
                cl = lines[i]
                cm = _FENCE.match(cl)
                if cm and cm.group(2)[0] == mark[0] and len(cm.group(2)) >= len(mark) and cl.strip() == cm.group(2):
                    i += 1
                    break
                body.append(cl[min(ind, _indent(cl)):])
                i += 1
            bs.append({"k": "code", "lang": lang, "lines": body, "size": _bytes(lines[start:i])})
            continue
        h = _HEAD.match(l)
        if h:
            bs.append({"k": "heading", "level": len(h.group(1)), "text": h.group(2).strip(), "raw": l.strip(), "size": _bytes([l])})
            i += 1
            continue
        if _HR.match(l):
            bs.append({"k": "hr", "size": _bytes([l])})
            i += 1
            continue
        if _QUOTE.match(l):
            q = []
            while i < n and _QUOTE.match(lines[i]):
                q.append(re.sub(r"^\s{0,3}>\s?", "", lines[i]))
                i += 1
            bs.append({"k": "quote", "lines": q, "size": _bytes(lines[start:i])})
            continue
        if "|" in l and i + 1 < n and _ALIGN.match(lines[i + 1]) and "|" in lines[i + 1]:
            head = _split_row(l)
            align = []
            for c in _split_row(lines[i + 1]):
                align.append("c" if c.startswith(":") and c.endswith(":") else "r" if c.endswith(":") else "")
            i += 2
            rows = []
            while i < n and lines[i].strip() and "|" in lines[i]:
                rows.append(_split_row(lines[i]))
                i += 1
            bs.append({"k": "table", "head": head, "align": align, "rows": rows, "size": _bytes(lines[start:i]), "line": start + 1})
            continue
        lm = _LIST.match(l)
        if lm:
            i, blk = _parse_list(lines, i)
            blk["size"] = _bytes(lines[start:i])
            bs.append(blk)
            continue
        para = [l.strip()]
        i += 1
        while i < n and lines[i].strip() and not _is_start(lines, i):
            para.append(lines[i].strip())
            i += 1
        bs.append({"k": "para", "text": " ".join(para), "size": _bytes(lines[start:i])})
    return bs


def _parse_list(lines, i):
    n = len(lines)
    first = _LIST.match(lines[i])
    base = len(first.group(1))
    ordered = first.group(2)[0].isdigit()
    startno = int(re.match(r"\d+", first.group(2)).group(0)) if ordered else None
    items = []
    while i < n:
        m = _LIST.match(lines[i])
        if not m or len(m.group(1)) != base or m.group(2)[0].isdigit() != ordered or _HR.match(lines[i]):
            break
        cind = base + len(m.group(2)) + 1
        item = [m.group(3)]
        i += 1
        while i < n:
            l = lines[i]
            if not l.strip():
                j = i
                while j < n and not lines[j].strip():
                    j += 1
                if j < n and _indent(lines[j]) >= cind:
                    item.extend([""] * (j - i))
                    i = j
                    continue
                break
            ind = _indent(l)
            if ind >= cind or (ind > base and not _LIST.match(l)):
                item.append(l[min(ind, cind):])
                i += 1
            elif _LIST.match(l) or _FENCE.match(l) or _HEAD.match(l) or _QUOTE.match(l) or _HR.match(l) or _is_start(lines, i):
                break
            else:  # tembel devam satırı
                item.append(l.strip())
                i += 1
        items.append(item)
        j = i
        while j < n and not lines[j].strip():
            j += 1
        nm = _LIST.match(lines[j]) if j < n else None
        if nm and len(nm.group(1)) == base and nm.group(2)[0].isdigit() == ordered:
            i = j
        else:
            break
    return i, {"k": "ol" if ordered else "ul", "items": items, "start": startno}


# ---------------------------------------------------------------- HTML üretimi
_NUM_RE = re.compile(r"^[%+\-−–~≈<>≥≤]{0,2}\s*(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d+)?\s*(?:%|dk|sa|sn|ms|B|TL|XP|KB|MB|GB|gün|saat|bayt)?(?:\s*\([^)]*\))?$")
_EMPTY = {"", "—", "–", "-", "…"}
_LABEL = re.compile(r"^\*\*([^*]+?):\*\*\s*(.*)$", re.S)
_QCHARS = "\"“„«"


class _Ctx:
    def __init__(self, ids, id_prefix, terminal, hooks, max_code_lines, source):
        self.ids = ids if ids is not None else set()
        self.id_prefix, self.terminal, self.hooks = id_prefix, terminal, hooks or []
        self.max_code_lines, self.source = max_code_lines, source
        self.js, self.headings = [], []
        self.heading, self.prev, self.tindex = "", "", 0

    def new_id(self, text):
        base = self.id_prefix + slugify(text)
        cand, k = base, 2
        while cand in self.ids:
            cand = f"{base}-{k}"
            k += 1
        self.ids.add(cand)
        return cand


def _code_html(b, cx):
    lang = b["lang"].lower()
    dl = "cs" if lang in ("csharp", "cs", "c#") else lang if lang in ("sql", "json") else "txt"
    body = esc("\n".join(b["lines"]))
    long_ = " long" if len(b["lines"]) > cx.max_code_lines else ""
    if cx.terminal and dl == "txt":
        tab = ' tabindex="0"' if long_ else ""
        return f'<pre class="terminal{long_}"{tab}>{body}</pre>'
    tab = ' tabindex="0"' if long_ else ""
    return f'<pre class="code{long_}" data-lang="{dl}"{tab}><code>{body}</code></pre>'


def _call_hook(hook, headers, rows, ctx):
    try:
        ps = list(inspect.signature(hook).parameters.values())
        npos = sum(1 for p in ps if p.kind in (p.POSITIONAL_ONLY, p.POSITIONAL_OR_KEYWORD))
        var = any(p.kind == p.VAR_POSITIONAL for p in ps)
    except (TypeError, ValueError):
        npos, var = 2, False
    r = hook(headers, rows, ctx) if (npos >= 3 or var) else hook(headers, rows)
    if r is None:
        return None
    if isinstance(r, str):
        return r, ""
    h, js = r
    return h, js or ""


def _table_html(b, cx, use_hooks=True):
    ncol = max([len(b["head"])] + [len(r) for r in b["rows"]])
    head = b["head"] + [""] * (ncol - len(b["head"]))
    rows = [r + [""] * (ncol - len(r)) for r in b["rows"]]
    if any(len(r) > len(b["head"]) for r in b["rows"]):
        print(f"UYARI: tablo satırı başlıktan fazla hücre içeriyor ({cx.source or '?'} satır {b.get('line', '?')})", file=sys.stderr)
    plain_h, plain_r = [strip_md(c) for c in head], [[strip_md(c) for c in r] for r in rows]
    ctx = {"heading": cx.heading, "prev": cx.prev, "source": cx.source, "raw_headers": head, "raw_rows": rows, "index": cx.tindex}
    cx.tindex += 1
    for hook in (list(cx.hooks) + TABLE_HOOKS if use_hooks else []):
        res = _call_hook(hook, plain_h, plain_r, ctx)
        if res:
            if res[1]:
                cx.js.append(res[1])
            return res[0]
    num = []  # sütun sayısalsa (hepsi ya da >=4 hücrede %80'i sayı) sağa yaslanır
    for j in range(ncol):
        vals = [r[j] for r in plain_r if r[j] not in _EMPTY]
        k = sum(1 for v in vals if _NUM_RE.match(v))
        num.append(bool(vals) and (k == len(vals) or (len(vals) >= 4 and k / len(vals) >= 0.8)))
    centered = (b["align"] + [""] * ncol)
    th_cls = lambda j: ' class="num"' if num[j] else (' style="text-align:center"' if centered[j] == "c" else "")

    def td_cls(j, plain):
        c = (["num"] if num[j] else []) + (["nw"] if (" " not in plain and len(plain) <= 14) else [])
        return (' class="%s"' % " ".join(c) if c else "") + (' style="text-align:center"' if centered[j] == "c" and not num[j] else "")

    out = ['<div class="tablewrap"><table><thead><tr>']
    out += [f"<th{th_cls(j)}>{inline(c)}</th>" for j, c in enumerate(head)]
    out.append("</tr></thead><tbody>")
    for r, pr in zip(rows, plain_r):
        out.append("<tr>" + "".join(f"<td{td_cls(j, pr[j])}>{inline(c)}</td>" for j, c in enumerate(r)) + "</tr>")
    out.append("</tbody></table></div>")
    return "".join(out)


def table_html(raw_headers, raw_rows, align=None):
    """Ham (markdown'lı) başlık/satır hücrelerinden varsayılan tablo HTML'i (kancasız): kancalar kendi çıktılarına tablo koyabilsin diye."""
    cx = _Ctx(None, "", False, [], 45, "")
    return _table_html({"head": list(raw_headers), "rows": [list(r) for r in raw_rows], "align": align or [], "line": 0}, cx, use_hooks=False)


def _list_html(b, cx):
    tag = b["k"]
    st = f' start="{b["start"]}"' if tag == "ol" and b["start"] not in (None, 1) else ""
    out = [f"<{tag}{st}>"]
    for item in b["items"]:
        sub = parse_blocks(item)
        if sub and sub[0]["k"] == "para":
            body = inline(sub[0]["text"]) + _blocks_html(sub[1:], cx)
        else:
            body = _blocks_html(sub, cx)
        out.append(f"<li>{body}</li>")
    out.append(f"</{tag}>")
    return "".join(out)


def _quote_html(b, cx):
    inner = parse_blocks(b["lines"])
    paras = [x for x in inner if x["k"] == "para"]
    ctxtxt = cx.prev + " " + cx.heading
    if len(inner) >= 2 and len(paras) == len(inner) and all(_LABEL.match(p["text"]) for p in paras):  # sohbet
        out = ['<div class="chat">']
        for p in paras:
            lab, txt = _LABEL.match(p["text"]).groups()
            low = lab.lower()
            role = "oyuncu" if low.startswith(("oyuncu", "sen ", "öğrenci")) else "sistem" if low.startswith(("sistem", "kurul")) else "usta"
            out.append(f'<div class="bubble {role}"><span class="who">{inline(lab)}</span>{inline(txt)}</div>')
        out.append("</div>")
        return "".join(out)
    if len(inner) == 1 and inner[0]["k"] == "para":
        text, cite = inner[0]["text"], None
        lm = _LABEL.match(text)
        body = lm.group(2) if lm else text
        if body[:1] in _QCHARS and (lm or "Hasan Abi" in text or "Hasan Abi" in ctxtxt):
            cite = strip_md(lm.group(1)) if lm else "Hasan Abi"
            return f'<blockquote class="musteri"><p>{inline(body)}</p><cite>{esc(cite)}</cite></blockquote>'
    return '<div class="callout">' + _blocks_html(inner, cx) + "</div>"


def _plain(b):
    return strip_md(b.get("text", "")) if b["k"] in ("para", "heading") else ""


def _blocks_html(bs, cx):
    out = []
    for b in bs:
        k = b["k"]
        if k == "para":
            out.append(f"<p>{inline(b['text'])}</p>")
        elif k == "heading":  # liste/alıntı içindeki başlık: kalın paragraf
            out.append(f"<p><strong>{inline(b['text'])}</strong></p>")
        elif k == "code":
            out.append(_code_html(b, cx))
        elif k == "table":
            out.append(_table_html(b, cx))
        elif k in ("ul", "ol"):
            out.append(_list_html(b, cx))
        elif k == "quote":
            out.append(_quote_html(b, cx))
        elif k == "hr":
            out.append("<hr>")
        cx.prev = _plain(b) or cx.prev
    return "".join(out)


def _match_prefix(prefix, raw, text):
    p = prefix.strip()
    return raw.startswith(p) if p.startswith("#") else text.startswith(p)


def render(md, demote=0, collapse_over=None, *, collapse=(), ids=None, id_prefix="", terminal=False, hooks=None, max_code_lines=45, source="", top=None):
    """Markdown -> HTML (bkz. modül başlığı)."""
    lines = md.lstrip("﻿").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    bs = parse_blocks(lines)
    cx = _Ctx(ids, id_prefix, terminal, hooks, max_code_lines, source)
    heads = [i for i, b in enumerate(bs) if b["k"] == "heading"]
    top = top if top is not None else min([bs[i]["level"] for i in heads], default=1)
    end, size = {}, {}
    for p, i in enumerate(heads):
        j = len(bs)
        for i2 in heads[p + 1:]:
            if bs[i2]["level"] <= bs[i]["level"]:
                j = i2
                break
        end[i], size[i] = j, sum(x["size"] for x in bs[i:j])
    out = []

    def run(lo, hi, inside):
        i, buf = lo, []

        def flush():
            if buf:
                out.append(_blocks_html(buf, cx))
                buf.clear()

        while i < hi:
            b = bs[i]
            if b["k"] != "heading":
                buf.append(b)
                i += 1
                continue
            flush()
            lvl = min(6, b["level"] + demote)
            cx.heading = strip_md(b["text"])
            cx.prev = ""
            sid = cx.new_id(b["text"])
            forced = any(_match_prefix(pfx, b["raw"], b["text"]) for pfx in collapse)
            if not inside and b["level"] > top and (forced or (collapse_over is not None and size[i] > collapse_over)):
                out.append(f'<details class="acc"><summary id="{sid}">{inline(b["text"])}</summary>')
                cx.headings.append((lvl, sid, cx.heading))
                run(i + 1, end[i], True)
                out.append("</details>")
                i = end[i]
            else:
                out.append(f'<h{lvl} id="{sid}">{inline(b["text"])}</h{lvl}>')
                cx.headings.append((lvl, sid, cx.heading))
                i += 1
        flush()

    run(0, len(bs), False)
    res = Rendered("\n".join(out))
    res.js = "\n".join(cx.js)
    res.headings = tuple(cx.headings)
    return res


# ---------------------------------------------------------------- dosya işlemleri
def _resolve(p):
    p = pathlib.Path(p)
    return p if p.is_absolute() or p.exists() else SPEC / p


def _read(p):
    return _resolve(p).read_text(encoding="utf-8").lstrip("﻿").replace("\r\n", "\n")


def extract(md_path, from_heading, to_heading=None, keep_heading=True):
    """Bölüm keser (bkz. modül başlığı). Başlık bulunamazsa ValueError."""
    lines = _read(md_path).split("\n")
    hs = list(iter_headings(lines))
    s = next(((i, lv) for i, lv, t, raw in hs if _match_prefix(from_heading, raw, t)), None)
    if s is None:
        raise ValueError(f"başlık bulunamadı: {from_heading!r} ({md_path})")
    start, slvl = s
    stop = len(lines)
    for i, lv, t, raw in hs:
        if i <= start:
            continue
        if (to_heading is not None and _match_prefix(to_heading, raw, t)) or (to_heading is None and lv <= slvl):
            stop = i
            break
    else:
        if to_heading is not None:
            raise ValueError(f"bitiş başlığı bulunamadı: {to_heading!r} ({md_path})")
    body = lines[start + (0 if keep_heading else 1):stop]
    while body and not body[-1].strip():
        body.pop()
    while body and body[-1].strip() == "---":  # bölüm sonu çizgisi
        body.pop()
        while body and not body[-1].strip():
            body.pop()
    return "\n".join(body) + "\n"


def render_file(md_path, from_heading=None, to_heading=None, keep_heading=True, **kw):
    """extract + render. from_heading verilmezse dosyanın tamamı."""
    md = extract(md_path, from_heading, to_heading, keep_heading) if from_heading else _read(md_path)
    kw.setdefault("source", pathlib.Path(str(md_path)).name)
    return render(md, **kw)


def headings(md_path):
    """[(seviye, metin, bayt)] — çit-farkında; bayt = alt bölümler dâhil bölüm boyutu."""
    lines = _read(md_path).split("\n")
    hs = list(iter_headings(lines))
    res = []
    for p, (i, lv, t, raw) in enumerate(hs):
        j = next((i2 for i2, lv2, _, _ in hs[p + 1:] if lv2 <= lv), len(lines))
        res.append((lv, t, _bytes(lines[i:j])))
    return res


def tables(md):
    """Markdown içindeki tüm tabloları düz metin olarak verir (kancasız, sayfa yazarları için)."""
    res, heading = [], ""

    def walk(bs):
        nonlocal heading
        for b in bs:
            if b["k"] == "heading":
                heading = strip_md(b["text"])
            elif b["k"] == "table":
                res.append(Table([strip_md(c) for c in b["head"]], [[strip_md(c) for c in r] for r in b["rows"]], heading, b["head"], b["rows"]))
            elif b["k"] == "quote":
                walk(parse_blocks(b["lines"]))
            elif b["k"] in ("ul", "ol"):
                for it in b["items"]:
                    walk(parse_blocks(it))

    walk(parse_blocks(md.replace("\r\n", "\n").split("\n")))
    return res


# ---------------------------------------------------------------- CLI
def main():
    ap = argparse.ArgumentParser(description="KodKent spec Markdown -> HTML (alt küme).")
    ap.add_argument("file", help="markdown dosyası (spec/ altındaki ad ya da yol)")
    ap.add_argument("--from", dest="frm", help='başlangıç başlığı öneki, ör. "## 3."')
    ap.add_argument("--to", help="bitiş başlığı öneki (yoksa bölüm sonu)")
    ap.add_argument("--demote", type=int, default=0)
    ap.add_argument("--collapse-over", type=int, default=None, help="bayt eşiği; aşan alt bölümler <details> olur")
    ap.add_argument("--terminal", action="store_true", help="dilsiz/txt kod blokları <pre class=terminal> olsun")
    ap.add_argument("--id-prefix", default="")
    ap.add_argument("--list", action="store_true", help="başlıkları ve bayt boyutlarını listele")
    ap.add_argument("--out", help="çıktı dosyası (yoksa stdout)")
    a = ap.parse_args()
    for st in (sys.stdout, sys.stderr):
        st.reconfigure(encoding="utf-8")
    if a.list:
        for lv, t, n in headings(a.file):
            print(f"{n:8d}  {'  ' * (lv - 1)}{'#' * lv} {t}")
        return
    h = render_file(a.file, a.frm, a.to, demote=a.demote, collapse_over=a.collapse_over, terminal=a.terminal, id_prefix=a.id_prefix)
    if a.out:
        pathlib.Path(a.out).write_text(str(h), encoding="utf-8")
        print(f"yazıldı: {a.out} ({len(h.encode('utf-8'))} bayt)", file=sys.stderr)
    else:
        sys.stdout.write(str(h) + "\n")


if __name__ == "__main__":
    main()
