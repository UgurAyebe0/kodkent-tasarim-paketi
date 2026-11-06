import sys, os
HEAD = ('<!doctype html><html lang="tr"{theme}><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}'
        'body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style></head><body>')
TAIL = '</body></html>'
src = sys.argv[1]; outdir = sys.argv[2]; os.makedirs(outdir, exist_ok=True)
name = os.path.splitext(os.path.basename(src))[0]
content = open(src, encoding='utf-8').read()
for theme, suffix in (('', ''), ('dark', '.dark'), ('light', '.light')):
    attr = f' data-theme="{theme}"' if theme else ''
    with open(os.path.join(outdir, f'{name}{suffix}.html'), 'w', encoding='utf-8') as f:
        f.write(HEAD.replace('{theme}', attr) + content + TAIL)
print('wrapped', name)
