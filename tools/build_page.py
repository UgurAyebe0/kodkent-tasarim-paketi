#!/usr/bin/env python3
"""build_page.py <anahtar> — tools/pages/<anahtar>.py içindeki PAGE bildiriminden belge sayfası üretir.

Akış: PAGE -> build/parts/<anahtar>/NN-<id>.html|css|js (eski NN-* dosyaları silinir) -> assemble_doc.py -> build/kodkent-<anahtar>.html
Şema ve örnekler: tools/PAGES-README.md.   Kullanım: python tools/build_page.py mufredat [--out YOL] [--no-assemble]
"""
import argparse
import importlib.util
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))
import make_skeleton as ms  # noqa: E402
import md2html  # noqa: E402

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass


MARK = "build_page.py ile üretildi"


def load_page(key):
    path = HERE / "pages" / f"{key}.py"
    if not path.exists():
        raise SystemExit(f"{path} yok: PAGE sözlüğünü içeren bir sayfa dosyası yaz (bkz. tools/PAGES-README.md)")
    spec = importlib.util.spec_from_file_location(f"kk_page_{key}", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    if not hasattr(mod, "PAGE"):
        raise SystemExit(f"{path}: PAGE sözlüğü tanımlı değil")
    return mod.PAGE


def default_prefix(name):
    m = re.match(r"([A-Za-z]+\d*)", pathlib.Path(name).name)
    return (m.group(1).lower() + "-") if m else ""


def render_source(src, ids, page_hooks):
    """Bir kaynak sözlüğünü HTML'e çevirir -> (html, js)."""
    if "html" in src:
        return src["html"], ""
    kw = dict(
        demote=src.get("demote", 1),
        collapse_over=src.get("collapse_over"),
        collapse=src.get("collapse", ()),
        ids=ids,
        terminal=src.get("terminal", False),
        hooks=list(src.get("hooks", [])) + list(page_hooks),
        max_code_lines=src.get("max_code_lines", 45),
        top=src.get("top"),
    )
    if "md" in src:
        r = md2html.render(src["md"], id_prefix=src.get("id_prefix", ""), source="(md)", **kw)
    else:
        name = src["file"]
        r = md2html.render_file(
            name, src.get("from"), src.get("to"), keep_heading=not src.get("skip_heading", False),
            id_prefix=src.get("id_prefix", default_prefix(name)), **kw,
        )
    return str(r), r.js


def build_section(sec, ids, page_hooks):
    sid = sec["id"]
    if not re.fullmatch(r"[A-Za-z0-9_-]+", sid):
        raise SystemExit(f"bölüm id'si düz token olmalı: {sid!r}")
    out = [f'<section id="{sid}">']
    if sec.get("html_top"):
        out.append(sec["html_top"])
    if sec.get("title"):
        out.append(f"<h2>{md2html.esc(sec['title'])}</h2>")
    for k in ("intro", "html_before"):
        if sec.get(k):
            out.append(sec[k])
    items = sec.get("parts")
    if items is None:
        items = sec.get("sources", [])
    elif sec.get("sources"):
        raise SystemExit(f"{sid}: 'parts' ve 'sources' birlikte verilemez")
    js = []
    for it in items:
        h, j = render_source(it, ids, page_hooks)
        out.append(h)
        if j:
            js.append(j)
    if sec.get("html_after"):
        out.append(sec["html_after"])
    out.append("</section>")
    if sec.get("js"):
        js.append(sec["js"])
    return "\n".join(out) + "\n", "\n".join(js), sec.get("css", "")


def main():
    ap = argparse.ArgumentParser(description="PAGE bildiriminden belge sayfası üretir (parçalar + birleştirme).")
    ap.add_argument("key", choices=sorted(ms.PAGES))
    ap.add_argument("--out", help="çıktı yolu (varsayılan: build/kodkent-<anahtar>.html)")
    ap.add_argument("--no-assemble", action="store_true", help="yalnızca parçaları yaz")
    ap.add_argument("--force", action="store_true", help="build/parts/<anahtar>/ içindeki elle yazılmış NN-* parçalarını da sil")
    a = ap.parse_args()
    page = load_page(a.key)
    secs = page["sections"]
    ids = {s["id"] for s in secs} | set(page.get("reserved_ids", []))
    if len(ids) < len(secs):
        raise SystemExit("bölüm id'leri tekil olmalı")
    parts = ROOT / "build" / "parts" / a.key
    parts.mkdir(parents=True, exist_ok=True)
    stale = [f for f in parts.iterdir() if f.is_file() and re.match(r"^\d\d[a-z]?-.*\.(html|css|js)$", f.name)]
    manual = [f.name for f in stale if MARK not in f.read_text(encoding="utf-8", errors="replace")[:200]]
    if manual and not a.force:
        raise SystemExit("HATA: elle yazılmış parçalar var (silinmedi): " + ", ".join(manual) + " — silip yeniden üretmek için --force")
    for f in stale:
        f.unlink()
    (parts / "00-md2html.css").write_text(f"/* {MARK} */\n" + md2html.CSS.strip() + "\n" + page.get("css", ""), encoding="utf-8")
    page_hooks = page.get("hooks", [])
    html_all, total = [], 0
    for n, sec in enumerate(secs, 1):
        h, j, c = build_section(sec, ids, page_hooks)
        base = f"{n:02d}-{sec['id']}"
        (parts / f"{base}.html").write_text(f"<!-- {MARK} -->\n" + h, encoding="utf-8")
        if c.strip():
            (parts / f"{base}.css").write_text(f"/* {MARK} */\n" + c.strip() + "\n", encoding="utf-8")
        if j.strip():
            (parts / f"{base}.js").write_text(f"/* {MARK} */\n;(function(){{\n" + j.strip() + "\n})();\n", encoding="utf-8")
        html_all.append(h)
        total += len(h.encode("utf-8"))
        print(f"  {base}.html  {len(h.encode('utf-8')) // 1024} KB" + ("  +js" if j.strip() else "") + ("  +css" if c.strip() else ""))
    blob = "\n".join(html_all)
    found = re.findall(r'\sid="([^"]+)"', blob)
    dups = sorted({i for i in found if found.count(i) > 1})
    if dups:
        raise SystemExit("HATA: tekrarlı id: " + ", ".join(dups[:20]))
    missing = sorted({h for h in re.findall(r'href="#([^"]+)"', blob) if h not in set(found)})
    if missing:
        print("UYARI: hedefi olmayan # bağlantıları: " + ", ".join(missing[:20]))
    print(f"{len(secs)} bölüm, {len(found)} id, bölümler toplam {total // 1024} KB")
    if a.no_assemble:
        return
    cmd = [sys.executable, str(HERE / "assemble_doc.py"), a.key] + (["--out", a.out] if a.out else [])
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    sys.stdout.write(r.stdout)
    sys.stderr.write(r.stderr)
    if r.returncode:
        raise SystemExit(r.returncode)


if __name__ == "__main__":
    main()
