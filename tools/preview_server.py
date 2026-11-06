"""Yerel artifact önizleme sunucusu.
build/ klasöründeki .html dosyalarını, claude.ai artifact görüntüleyicisinin uyguladığı iskelet ile sararak sunar.
Kullanım: python preview_server.py <build_dir> [port]
URL: http://localhost:8787/kodkent-tasarim.html  (?theme=dark → data-theme="dark", ?theme=light → data-theme="light")
"""
import sys, os, http.server, urllib.parse

ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.getcwd()
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8787
SKELETON_HEAD = ('<!doctype html><html lang="tr"{theme}><head><meta charset="utf-8">'
                 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
                 '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}'
                 'body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>'
                 '</head><body>')
SKELETON_TAIL = '</body></html>'

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a):
        pass
    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(u.path)
        if path == '/' or path == '':
            files = sorted(f for f in os.listdir(ROOT) if f.endswith('.html'))
            body = '<!doctype html><meta charset="utf-8"><h1>build/</h1><ul>' + ''.join(
                f'<li><a href="/{f}">{f}</a> · <a href="/{f}?theme=dark">koyu</a> · <a href="/{f}?theme=light">açık</a></li>' for f in files) + '</ul>'
            data = body.encode('utf-8')
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data); return
        if path.endswith('.html'):
            fp = os.path.join(ROOT, path.lstrip('/'))
            if not os.path.isfile(fp):
                self.send_error(404); return
            q = urllib.parse.parse_qs(u.query)
            theme = q.get('theme', [''])[0]
            attr = f' data-theme="{theme}"' if theme in ('dark', 'light') else ''
            with open(fp, 'rb') as f:
                content = f.read()
            data = SKELETON_HEAD.format(theme=attr).encode('utf-8') + content + SKELETON_TAIL.encode('utf-8')
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(data))); self.send_header('Cache-Control', 'no-store'); self.end_headers(); self.wfile.write(data); return
        return super().do_GET()

if __name__ == '__main__':
    print(f'Önizleme: http://localhost:{PORT}/  (kök: {ROOT})', flush=True)
    http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
