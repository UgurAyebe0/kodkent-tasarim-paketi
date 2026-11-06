import re, sys, os, subprocess, tempfile
from html.parser import HTMLParser

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}
ALLOWED_SCRIPT = ("https://cdnjs.cloudflare.com/","https://cdn.jsdelivr.net/npm/","https://unpkg.com/","https://cdn.tailwindcss.com","https://code.jquery.com/")
ALLOWED_STYLE = ("https://fonts.googleapis.com","https://fonts.gstatic.com")

class Bal(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.stack=[]; self.errors=[]; self.count=0
    def handle_starttag(self, tag, attrs):
        self.count+=1
        if tag in VOID: return
        self.stack.append((tag, self.getpos()[0]))
    def handle_startendtag(self, tag, attrs):
        self.count+=1
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack: self.errors.append(f"line {self.getpos()[0]}: </{tag}> without opener"); return
        if self.stack[-1][0]==tag: self.stack.pop(); return
        names=[t for t,_ in self.stack]
        if tag in names:
            idx=len(names)-1-names[::-1].index(tag)
            for t,l in self.stack[idx+1:]: self.errors.append(f"line {l}: <{t}> never closed (closed by </{tag}> at line {self.getpos()[0]})")
            del self.stack[idx:]
        else:
            self.errors.append(f"line {self.getpos()[0]}: stray </{tag}>")

def main(path, single_theme=False):
    data=open(path,'rb').read(); txt=data.decode('utf-8','replace')
    fails=[]; warns=[]
    size=len(data)
    if size>16*1024*1024: fails.append(f"size {size} > 16MB")
    elif size>2*1024*1024: warns.append(f"size {size/1024/1024:.1f} MB (hedef 1.5MB)")
    head=txt[:8192]
    low=txt.lower()
    for bad in ("<!doctype","<html","<head>","<head ","<body","</html>","</body>"):
        if bad in low: fails.append(f"forbidden skeleton tag present: {bad}")
    if not re.search(r"<title>[^<]{2,80}</title>", head): fails.append("no <title> in first 8KB")
    if 'name="claude:viewport-fit-sides"' not in head: fails.append("missing viewport-fit-sides meta")
    if "env(safe-area-inset-left" not in txt or "env(safe-area-inset-right" not in txt: fails.append("missing max(16px, env(safe-area-inset-*)) side paddings")
    for m in re.finditer(r'<script[^>]*\ssrc=["\']([^"\']+)["\']', txt):
        if not m.group(1).startswith(ALLOWED_SCRIPT): fails.append(f"script src not allowlisted: {m.group(1)}")
        elif not re.search(r"@\d+\.\d+\.\d+|/\d+\.\d+(\.\d+)?/", m.group(1)): fails.append(f"script src not version-pinned: {m.group(1)}")
    for m in re.finditer(r'<link[^>]*\shref=["\']([^"\']+)["\']', txt):
        h=m.group(1)
        if h.startswith("http") and not h.startswith(ALLOWED_STYLE): fails.append(f"stylesheet/link host not allowlisted: {h}")
    for m in re.finditer(r'(?:src|href)=["\'](https?://[^"\']+)["\']', txt):
        u=m.group(1)
        if any(u.lower().endswith(ext) for ext in (".png",".jpg",".jpeg",".gif",".webp",".svg",".mp4",".mp3",".woff",".woff2")): fails.append(f"external asset will be blocked: {u}")
    for bad in ("alert(","confirm(","prompt(","window.print","document.write("):
        if re.search(r"(?<![\w.])"+re.escape(bad), txt): fails.append(f"uses {bad} (does nothing in viewer)")
    if re.search(r"lorem ipsum", txt, re.I): fails.append("lorem ipsum present")
    if "100vh" in txt: warns.append("100vh used (prefer height:100% on html/body)")
    if not single_theme:
        if 'prefers-color-scheme: dark' not in txt and 'prefers-color-scheme:dark' not in txt: fails.append("no prefers-color-scheme dark block")
        if '[data-theme="dark"]' not in txt: fails.append("no :root[data-theme=\"dark\"] block")
        if ':not([data-theme="light"])' not in txt: fails.append("dark media block not guarded with :root:not([data-theme=\"light\"])")
    if not re.search(r"body\s*\{[^}]*background", txt): fails.append("body has no explicit background")
    if "<iframe" in low or "<object" in low or "<embed" in low: fails.append("iframe/object/embed present (blocked)")
    if re.search(r'url\((["\']?)https?://', txt): fails.append("CSS url(https://...) external asset (blocked)")
    stripped=re.sub(r"<script\b.*?</script>","<script></script>",txt,flags=re.S|re.I)
    stripped=re.sub(r"<style\b.*?</style>","<style></style>",stripped,flags=re.S|re.I)
    p=Bal(); p.feed(stripped); p.close()
    for t,l in p.stack: p.errors.append(f"line {l}: <{t}> never closed (EOF)")
    if p.errors:
        for e in p.errors[:25]: fails.append("tag balance: "+e)
        if len(p.errors)>25: fails.append(f"tag balance: +{len(p.errors)-25} more")
    scripts=re.findall(r"<script(?P<attrs>[^>]*)>(?P<body>.*?)</script>", txt, flags=re.S|re.I)
    for i,(attrs,body) in enumerate(scripts):
        if "src=" in attrs or not body.strip(): continue
        if re.search(r'type=["\'](?!module|text/javascript|application/javascript)', attrs): continue
        ext=".mjs" if "module" in attrs else ".js"
        with tempfile.NamedTemporaryFile("w",suffix=ext,delete=False,encoding="utf-8") as f:
            f.write(body); tmp=f.name
        try:
            r=subprocess.run(["node","--check",tmp],capture_output=True,text=True,timeout=60)
            if r.returncode!=0:
                msg=(r.stderr or r.stdout).strip().splitlines()
                fails.append(f"inline script #{i+1} syntax error: "+" | ".join(msg[:6]))
        finally:
            os.unlink(tmp)
    h2=len(re.findall(r"<h2",txt))
    print(f"FILE {path}  size={size/1024:.0f}KB  tags={p.count}  h2={h2}  scripts={len(scripts)}")
    for w in warns: print("WARN ",w)
    for f_ in fails: print("FAIL ",f_)
    print("RESULT", "PASS" if not fails else f"FAIL ({len(fails)})")
    return 0 if not fails else 1

if __name__=="__main__":
    args=[a for a in sys.argv[1:] if not a.startswith("--")]
    sys.exit(main(args[0], single_theme="--single-theme" in sys.argv))
