"""Prototip entegrasyon testleri (headless Edge, --dump-dom). Kullanim:
  E2E_JS=e2e.js|e2e2.js|e2e3.js|e2e4.js|e2e5.js|e2e6.js|e2e7.js [E2E_SIZE=400,844] python tools/proto_e2e/run.py [--no-asm]
  e2e: hizliKurulum -> Atolye/Taksimetre -> Tapu -> Is Emri -> Editor -> Savunma -> Panel -> Pazar -> Dolap -> Oda + ai birim testleri | e2e2: taze oyuncu, ders 1.1-1.4 | e2e3: AI arayuz yollari + 15-17 guvenli mod | e2e4: 24 ekran yatay tasma (E2E_SIZE) | e2e5: 4 Ruhsat gorevi sirayla | e2e6: depo (bos/bozuk/yanlis tip/dolu/engelli), Bastan basla artigi, cifte odul, ai deseni (brief 02 §E.3), Kurul duzeni | e2e7: XSS, Pazar yetersiz bakiye, 15-17 Cip, Sozlesme Karti = KANON §5.1, uzun metin"""
import re, subprocess, sys, pathlib, html, os
sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parents[2]
W = pathlib.Path(os.environ.get("KK_WORK", "C:/Users/uuray/AppData/Local/Temp/claude/C--Users-uuray-OneDrive-Masa-st--A--Oyun/7f8a7e11-0061-462a-aaf8-e2ec7e91569b/scratchpad"))
WR = W / "_wrapped" / "build"
if "--no-asm" not in sys.argv:
    subprocess.run([sys.executable, str(ROOT / "tools" / "assemble_proto.py")], check=True, stdout=subprocess.DEVNULL)
subprocess.run([sys.executable, str(ROOT / "tools" / "wrap.py"), str(ROOT / "build" / "kodkent-prototip.html"), str(WR)], check=True, stdout=subprocess.DEVNULL)
src = (WR / "kodkent-prototip.light.html").read_text(encoding="utf-8")
js = (pathlib.Path(__file__).resolve().parent / os.environ.get("E2E_JS", "e2e.js")).read_text(encoding="utf-8")
test = src.replace("</body>", "<script>\n" + js + "\n</script></body>")
(WR / "e2e.html").write_text(test, encoding="utf-8")
EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
prof = W / "shots" / ".edge-e2e"
r = subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--user-data-dir=" + str(prof),
                    "--virtual-time-budget=90000", "--allow-file-access-from-files", "--window-size=" + os.environ.get("E2E_SIZE", "1280,800"), "--dump-dom", "file:///" + (WR / "e2e.html").as_posix()],
                   capture_output=True, timeout=240)
dom = r.stdout.decode("utf-8", "replace")
ms = re.findall(r'<pre id="e2e-out"[^>]*>([^<]*)</pre>', dom, re.S)
m = ms[-1] if ms else None
print(html.unescape(m) if m else "E2E: cikti yok (betik hatasi?)  stderr: " + r.stderr.decode("utf-8", "replace")[-300:])
