"""KodKent Teknik Mimari sayfası: PAGE bildirimi (python tools/build_page.py teknik).

Metin spec'ten AYNEN gelir (KANON, B3, B5, B7, B8, B9); bu dosya yalnızca (a) hangi bölümün nereden alınacağını,
(b) tablolardan türetilen görselleri (B7 §15'teki 8 diyagram, ERD, istemci katman diyagramı, kartlar, grafik) ve
(c) bölüm girişlerini tanımlar. Diyagramlar B7 §15 / §4.4 / B8 §1.3 tablolarından AYRIŞTIRILIR; kutu konumları burada
ızgaraya atanır, oklar otomatik yönlendirilir (ızgara üzerinde A*; kutulardan geçmez, etiketler çakışmaz).
"""
import heapq
import json
import math
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import make_skeleton as ms  # noqa: E402
import md2html as M  # noqa: E402

B3, B5, B7, B8, B9, KANON = "B3-egitim-ai.md", "B5-isletmeler-kod.md", "B7-backend-mimari.md", "B8-istemci-ui.md", "B9-urun-yol-haritasi.md", "KANON.md"
WARNS = []


def warn(msg):
    WARNS.append(msg)
    print("UYARI:", msg, file=sys.stderr)


def jsj(o):
    return json.dumps(o, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def tmpl(s, **kv):
    for k, v in kv.items():
        s = s.replace("%%" + k + "%%", v)
    return s


def esc(s):
    return M.esc(s)


def fmt_tr(n, d=0):
    s = f"{n:,.{d}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def fix_md(md):
    r"""Spec'te kod aralığı içinde kaçışsız '|' olan tablo satırlarını '\|' yapar (spec dosyalarına dokunmadan)."""
    out, fence = [], False
    for line in md.split("\n"):
        if line.strip().startswith("```"):
            fence = not fence
        if not fence and line.lstrip().startswith("|") and "`" in line:
            res, inside = [], False
            for ch in line:
                if ch == "`":
                    inside = not inside
                res.append("\\|" if (ch == "|" and inside and (not res or res[-1] != "\\")) else ch)
            line = "".join(res)
        out.append(line)
    return "\n".join(out)


def mdtab(path, a, b=None):
    return M.tables(fix_md(M.extract(path, a, b)))


def pick(tabs, first_headers, what=""):
    for t in tabs:
        if t.headers[: len(first_headers)] == first_headers:
            return t
    raise SystemExit(f"tablo bulunamadı: {what} {first_headers}")


# ================================================================== 1. KANON kapak sayıları + tablolardan sayımlar
KAP = {r[0]: r[1] for r in pick(mdtab(KANON, "### 12.4", "### 12.5"), ["Sayı", "Değer", "Kaynak"], "KANON 12.4").rows}


def kap_re(key, pattern):
    if key not in KAP:
        raise SystemExit(f"KANON §12.4 satırı yok: {key}")
    m = re.search(pattern, KAP[key])
    if not m:
        raise SystemExit(f"KANON §12.4 '{key}' biçimi değişmiş: {KAP[key]!r}")
    return m.groups()


N_EP, N_TEMEL, N_B8, N_YK, N_MODUL, N_SEMA = (int(x) for x in kap_re("Uç nokta", r"(\d+) \((\d+) temel \+ (\d+) B8 talebi \+ (\d+) Yaş Kapısı v2\); backend (\d+) modül \+ Platform çekirdeği, (\d+) şema"))
AI_PUAN, AI_DAU = kap_re("AI", r"≈([\d,]+) \$/puanlama; ≈([\d,]+) \$/DAU/gün")
OTO_TEST, OTO_ACIK, OTO_GIZLI, OTO_TOH, OTO_OK, OTO_TOP = kap_re("Otopark L1 testi", r"(\d+) \((\d+) açık \+ (\d+) gizli \+ (\d+) tohumlu\); B5 doğrulaması (\d+) / (\d+) vaka")
MVP_HAFTA = kap_re("MVP süresi", r"(\d+) hafta")[0]
YOL_HAFTA, YOL_SPRINT = kap_re("Yol haritası", r"(\d+) hafta, (\d+) sprint")

_ep = pick(mdtab(B7, "### 5.3", "### 5.4"), ["Yöntem", "Yol", "Amaç"], "B7 5.3")
EP_ROWS = [r for r in _ep.rows if len(r) > 1 and r[1].strip()]
N_EP_SATIR = len(EP_ROWS)
N_EP_HESAP = sum(len([x for x in re.split(r"\s*[/,]\s*", r[0]) if x]) for r in EP_ROWS)
if N_EP_HESAP != N_TEMEL:
    warn(f"B7 §5.3 tablosu {N_EP_SATIR} satır / {N_EP_HESAP} uç nokta veriyor, KANON §12.4 temel katalog {N_TEMEL} diyor")
_tc = pick(mdtab(B7, "### 4.2", "### 4.3"), ["Tablo", "Amaç"], "B7 4.2")
N_TABLO = len([r for r in _tc.rows if len(r) > 1 and r[1].strip()])
if N_TABLO < 35:
    warn(f"tablo kataloğunda {N_TABLO} tablo var (35+ bekleniyor)")
_adr = pick(mdtab(B7, "## 2.", "## 3."), ["#", "Karar"], "B7 2")
N_ADR = len(_adr.rows)
if N_ADR < 10:
    warn(f"yalnızca {N_ADR} ADR var (en az 10 bekleniyor)")


# ================================================================== 2. diyagram motoru
def wrap(txt, maxc):
    out, cur = [], ""
    for w in str(txt).split():
        if cur and len(cur + " " + w) > maxc:
            out.append(cur)
            cur = w
        else:
            cur = (cur + " " + w) if cur else w
    if cur:
        out.append(cur)
    return out


def node_height(n):
    if n.get("rows"):
        return 34 + len(n["rows"]) * 16
    w = n["w"]
    lab = wrap(n["label"], max(6, int((w - 14) / 6.9)))
    sub = wrap(n["sub"], max(6, int((w - 14) / 6.2))) if n.get("sub") else []
    th = len(lab) * 15 + (4 + len(sub) * 13 if sub else 0)
    return max(50, th + 22)


G = 8
PAD = 10


def side_pick(a, b):
    dx = b["x"] + b["w"] / 2 - (a["x"] + a["w"] / 2)
    dy = b["y"] + b["h"] / 2 - (a["y"] + a["h"] / 2)
    if abs(dx) * 0.55 >= abs(dy):
        return ("r", "l") if dx >= 0 else ("l", "r")
    return ("b", "t") if dy >= 0 else ("t", "b")


def anchor_px(n, side, pos):
    if side == "r":
        return (n["x"] + n["w"], pos)
    if side == "l":
        return (n["x"], pos)
    if side == "t":
        return (pos, n["y"])
    return (pos, n["y"] + n["h"])


def stub_cell(n, side, pos):
    if side == "r":
        return (math.ceil((n["x"] + n["w"] + PAD) / G), round(pos / G))
    if side == "l":
        return (math.floor((n["x"] - PAD) / G), round(pos / G))
    if side == "t":
        return (round(pos / G), math.floor((n["y"] - PAD) / G))
    return (round(pos / G), math.ceil((n["y"] + n["h"] + PAD) / G))


def astar(start, goal, blocked, used, gw, gh):
    if goal in blocked:
        return None
    dirs = ((1, 0), (0, 1), (-1, 0), (0, -1))

    def h(c):
        return (abs(c[0] - goal[0]) + abs(c[1] - goal[1])) * 10

    pq = [(h(start), 0, start, -1)]
    best = {(start, -1): 0}
    came = {}
    while pq:
        _, g, cell, d = heapq.heappop(pq)
        if g > best.get((cell, d), 1e18):
            continue
        if cell == goal:
            path, key = [cell], (cell, d)
            while key in came:
                key = came[key]
                path.append(key[0])
            path.reverse()
            return path
        for nd, (dx, dy) in enumerate(dirs):
            nc = (cell[0] + dx, cell[1] + dy)
            if nc[0] < 0 or nc[1] < 0 or nc[0] > gw or nc[1] > gh or nc in blocked:
                continue
            cost = 10 + (22 if (d != -1 and nd != d) else 0) + (16 if nc in used else 0)
            ng = g + cost
            key = (nc, nd)
            if ng < best.get(key, 1e18):
                best[key] = ng
                came[key] = (cell, d)
                heapq.heappush(pq, (ng + h(nc), ng, nc, nd))
    return None


def compress(pts):
    out = [pts[0]]
    for p in pts[1:]:
        if p != out[-1]:
            out.append(p)
    res = [out[0]]
    for i in range(1, len(out) - 1):
        a, b, c = res[-1], out[i], out[i + 1]
        if (a[0] == b[0] == c[0]) or (a[1] == b[1] == c[1]):
            continue
        res.append(b)
    res.append(out[-1])
    return res


def rect_hit(a, b):
    return a[0] < b[2] and a[2] > b[0] and a[1] < b[3] and a[3] > b[1]


def seg_hits(p, q, bb):
    if p[0] == q[0]:
        lo, hi = sorted((p[1], q[1]))
        return bb[0] < p[0] < bb[2] and lo < bb[3] and hi > bb[1]
    if p[1] == q[1]:
        lo, hi = sorted((p[0], q[0]))
        return bb[1] < p[1] < bb[3] and lo < bb[2] and hi > bb[0]
    return False


class Flow:
    """KK.flow için düğüm/ok/grup kurar; oklar ızgarada A* ile yönlendirilir, etiketler çakışmayacak biçimde yerleştirilir."""

    def __init__(self, W, title, key=""):
        self.W, self.title, self.key = W, title, key
        self.nodes, self.order, self.edges, self.groups = {}, [], [], []
        self.H = 0
        self.stats = {"fallback": 0, "label_overlap": 0}

    def node(self, nid, x, y, w, label, sub="", tone="n", rows=None, h=None):
        n = {"id": nid, "x": x, "y": y, "w": w, "label": label, "sub": sub, "tone": tone}
        if rows:
            n["rows"] = rows
        n["h"] = max(node_height(n), h or 0)
        self.nodes[nid] = n
        self.order.append(nid)

    def edge(self, a, b, label="", tone="n", dashed=False, both=False, fs=None, ts=None, selfside="t"):
        if a not in self.nodes or b not in self.nodes:
            warn(f"{self.key}: kenar düğümü yok: {a} -> {b}")
            return
        self.edges.append({"a": a, "b": b, "label": label, "tone": tone, "dashed": dashed, "both": both, "fs": fs, "ts": ts, "self": a == b, "selfside": selfside})

    def group(self, label, ids, tone="n", pad=16, top=30):
        ns = [self.nodes[i] for i in ids]
        x0, y0 = min(n["x"] for n in ns) - pad, min(n["y"] for n in ns) - top
        x1, y1 = max(n["x"] + n["w"] for n in ns) + pad, max(n["y"] + n["h"] for n in ns) + pad
        self.groups.append({"x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0, "label": label, "tone": tone, "ids": list(ids)})

    # -------------------------------------------------------------- çözüm
    def solve(self):
        W = self.W
        self.H = H = int(max([n["y"] + n["h"] for n in self.nodes.values()] + [g["y"] + g["h"] for g in self.groups]) + 40)
        gw, gh = W // G + 1, H // G + 1
        ns = list(self.nodes.values())
        for i, a in enumerate(ns):
            if a["x"] < 0 or a["x"] + a["w"] > W:
                warn(f"{self.key}: {a['id']} tuvalin dışında")
            for b in ns[i + 1:]:
                if rect_hit((a["x"], a["y"], a["x"] + a["w"], a["y"] + a["h"]), (b["x"], b["y"], b["x"] + b["w"], b["y"] + b["h"])):
                    warn(f"{self.key}: {a['id']} ve {b['id']} çakışıyor")
        for g in self.groups:
            for n in ns:
                if n["id"] not in g["ids"] and rect_hit((g["x"], g["y"], g["x"] + g["w"], g["y"] + g["h"]), (n["x"], n["y"], n["x"] + n["w"], n["y"] + n["h"])):
                    warn(f"{self.key}: '{g['label']}' grubu üyesi olmayan {n['id']} kutusuna taşıyor")
        blocked = set()
        for n in ns:
            for cx in range(math.floor((n["x"] - PAD) / G), math.ceil((n["x"] + n["w"] + PAD) / G) + 1):
                for cy in range(math.floor((n["y"] - PAD) / G), math.ceil((n["y"] + n["h"] + PAD) / G) + 1):
                    if n["x"] - PAD < cx * G < n["x"] + n["w"] + PAD and n["y"] - PAD < cy * G < n["y"] + n["h"] + PAD:
                        blocked.add((cx, cy))
        # kapı (port) atama: aynı kenarı paylaşan oklar komşu düğümün konumuna göre dizilir
        ports = {}
        for i, e in enumerate(self.edges):
            if e["self"]:
                continue
            a, b = self.nodes[e["a"]], self.nodes[e["b"]]
            auto = side_pick(a, b)
            e["fs"], e["ts"] = e["fs"] or auto[0], e["ts"] or auto[1]
            ports.setdefault((a["id"], e["fs"]), []).append((i, "f"))
            ports.setdefault((b["id"], e["ts"]), []).append((i, "t"))
        for (nid, side), lst in ports.items():
            n = self.nodes[nid]

            def key(it, side=side):
                e = self.edges[it[0]]
                o = self.nodes[e["b"] if it[1] == "f" else e["a"]]
                return (o["x"] + o["w"] / 2) if side in "tb" else (o["y"] + o["h"] / 2)

            lst.sort(key=key)
            k = len(lst)
            lo, hi = ((n["x"] + 14, n["x"] + n["w"] - 14) if side in "tb" else (n["y"] + 8, n["y"] + n["h"] - 8))
            taken = set()
            for j, (i, role) in enumerate(lst):
                pos = (lo + hi) / 2 if k == 1 else lo + (hi - lo) * (j + 1) / (k + 1)
                pos = round(pos / G) * G
                while pos in taken:
                    pos += G
                taken.add(pos)
                self.edges[i]["pf" if role == "f" else "pt"] = pos

        def dist(i):
            e = self.edges[i]
            a, b = self.nodes[e["a"]], self.nodes[e["b"]]
            return abs(a["x"] - b["x"]) + abs(a["y"] - b["y"])

        used = set()
        for i in sorted([i for i, e in enumerate(self.edges) if not e["self"]], key=dist):
            e = self.edges[i]
            a, b = self.nodes[e["a"]], self.nodes[e["b"]]
            a1, a2 = anchor_px(a, e["fs"], e["pf"]), anchor_px(b, e["ts"], e["pt"])
            path = astar(stub_cell(a, e["fs"], e["pf"]), stub_cell(b, e["ts"], e["pt"]), blocked, used, gw, gh)
            if path is None:
                warn(f"{self.key}: {e['a']}->{e['b']} yönlendirilemedi (varsayılan rota)")
                self.stats["fallback"] += 1
                e["via"], e["pts"] = None, [a1, a2]
                continue
            pts = compress([a1] + [(c[0] * G, c[1] * G) for c in path] + [a2])
            e["pts"], e["via"] = pts, pts[1:-1]
            for p, q in zip(pts, pts[1:]):
                steps = int(max(abs(q[0] - p[0]), abs(q[1] - p[1])) / G)
                for s in range(steps + 1):
                    used.add((round((p[0] + (q[0] - p[0]) * s / max(steps, 1)) / G), round((p[1] + (q[1] - p[1]) * s / max(steps, 1)) / G)))
        # kendine dönen oklar
        for e in self.edges:
            if not e["self"]:
                continue
            n = self.nodes[e["a"]]
            if e["selfside"] == "t":
                x1, x2, y = n["x"] + n["w"] * 0.35, n["x"] + n["w"] * 0.65, n["y"]
                e.update(fs="t", ts="t", pf=x1, pt=x2, pts=[(x1, y), (x1, y - 26), (x2, y - 26), (x2, y)])
            else:
                y1, y2, x = n["y"] + n["h"] * 0.3, n["y"] + n["h"] * 0.7, n["x"] + n["w"]
                e.update(fs="r", ts="r", pf=y1, pt=y2, pts=[(x, y1), (x + 26, y1), (x + 26, y2), (x, y2)])
            e["via"] = e["pts"][1:-1]
        self.place_labels()

    def place_labels(self):
        nodes_bb = [(n["x"] - 2, n["y"] - 2, n["x"] + n["w"] + 2, n["y"] + n["h"] + 2) for n in self.nodes.values()]
        segs = [(i, p, q) for i, e in enumerate(self.edges) for p, q in zip(e["pts"], e["pts"][1:])]
        placed = []
        for i, e in enumerate(self.edges):
            e["lx"] = e["ly"] = 0
            if not e["label"] or e.get("via") is None:
                continue
            pts = e["pts"]
            lines = wrap(e["label"], 22)
            lw, lh = max(len(l) for l in lines) * 6.2 + 8, len(lines) * 12 + 4
            best, bi = -1, 0
            for k in range(len(pts) - 1):
                L = math.dist(pts[k], pts[k + 1])
                if L > best:
                    best, bi = L, k
            mx, my = (pts[bi][0] + pts[bi + 1][0]) / 2, (pts[bi][1] + pts[bi + 1][1]) / 2
            cands = []
            if e["self"]:
                n = self.nodes[e["a"]]
                if e["selfside"] == "t":
                    cands += [(n["x"] + n["w"] / 2, n["y"] - 26 - lh / 2 - 2, 0), (n["x"] + n["w"] * 0.35 - lw / 2 - 4, n["y"] - 26, 2), (n["x"] + n["w"] * 0.65 + lw / 2 + 4, n["y"] - 26, 2)]
                else:
                    cands += [(n["x"] + n["w"] + 26 + lw / 2 + 6, n["y"] + n["h"] / 2 + d, 0) for d in (0, -14, 14)]
            else:
                for k in range(len(pts) - 1):
                    L = math.dist(pts[k], pts[k + 1])
                    if L < 12:
                        continue
                    for t in (0.5, 0.3, 0.7, 0.18, 0.82):
                        cx0, cy0 = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t
                        cands.append((cx0, cy0, 0))
                        if pts[k][1] == pts[k + 1][1]:
                            cands += [(cx0, cy0 - lh / 2 - 5, 18), (cx0, cy0 + lh / 2 + 5, 18)]
                        else:
                            cands += [(cx0 - lw / 2 - 5, cy0, 18), (cx0 + lw / 2 + 5, cy0, 18)]
            bestc, bests, bestbb = (mx, my), 1e18, None
            for cx, cy, pen in cands:
                bb = (cx - lw / 2, cy + 1 - lh / 2, cx + lw / 2, cy + 1 + lh / 2)
                s = 0.0
                bbn = (bb[0] + 4, bb[1] + 2, bb[2] - 4, bb[3] - 2)
                s += 1000 * sum(1 for nb in nodes_bb if rect_hit(bbn, nb))
                s += 400 * sum(1 for pb in placed if rect_hit(bb, pb))
                if bb[0] < 0 or bb[2] > self.W or bb[1] < 0 or bb[3] > self.H:
                    s += 1000
                s += 25 * sum(1 for (j, p, q) in segs if j != i and seg_hits(p, q, bb))
                s += math.dist((cx, cy), (mx, my)) * 0.04 + pen
                if s < bests:
                    bests, bestc, bestbb = s, (cx, cy), bb
            if bests >= 400:
                self.stats["label_overlap"] += 1
                self.stats.setdefault("bad", []).append(f"{e['a']}->{e['b']} '{e['label'][:40]}' ({int(bests)})")
            if bestbb:
                placed.append(bestbb)
            e["lx"], e["ly"] = round(bestc[0] - mx, 1), round(bestc[1] - my, 1)

    def cfg(self, min_width=760):
        self.solve()
        nodes = []
        for nid in self.order:
            n = self.nodes[nid]
            d = {"id": nid, "x": n["x"], "y": n["y"], "w": n["w"], "h": n["h"], "label": n["label"], "tone": n["tone"]}
            if n["sub"]:
                d["sub"] = n["sub"]
            if n.get("rows"):
                d["rows"] = n["rows"]
            nodes.append(d)
        edges = []
        for e in self.edges:
            a, b = self.nodes[e["a"]], self.nodes[e["b"]]
            d = {"from": e["a"], "to": e["b"], "tone": e["tone"], "fromSide": e["fs"], "toSide": e["ts"]}
            for k, side, n, pos in (("fromOff", e["fs"], a, e["pf"]), ("toOff", e["ts"], b, e["pt"])):
                d[k] = round(((pos - n["x"]) / n["w"]) if side in "tb" else ((pos - n["y"]) / n["h"]), 4)
            if e["label"]:
                d["label"] = e["label"]
                if e["lx"] or e["ly"]:
                    d["lx"], d["ly"] = e["lx"], e["ly"]
            if e["dashed"]:
                d["dashed"] = True
            if e["both"]:
                d["both"] = True
            if e.get("via"):
                d["via"] = [[round(x, 1), round(y, 1)] for x, y in e["via"]]
            edges.append(d)
        cfg = {"width": self.W, "height": self.H, "title": self.title, "minWidth": min_width, "nodes": nodes, "edges": edges}
        if self.groups:
            cfg["groups"] = [{k: g[k] for k in ("x", "y", "w", "h", "label", "tone")} for g in self.groups]
        print(f"  diyagram {self.key}: {len(nodes)} kutu, {len(edges)} ok, {len(self.groups)} grup, {self.W}x{self.H}"
              + (f", {self.stats['fallback']} varsayılan rota" if self.stats["fallback"] else "")
              + (f", {self.stats['label_overlap']} etiket çakışması: " + "; ".join(self.stats.get("bad", [])) if self.stats["label_overlap"] else ""), file=sys.stderr)
        return cfg


# ================================================================== 3. B7 §15 / B8 §1.3 ayrıştırıcıları
def diag_part(n):
    nxt = f"### 15.{n + 1}" if n < 8 else "## 16."
    md = M.extract(B7, f"### 15.{n}", nxt)
    return md, M.tables(md)


def parse_boxes(rows):
    out = []
    for r in rows:
        rid, cell, grp = r[0], r[1], r[2] if len(r) > 2 else ""
        m = re.fullmatch(r"([A-Z])(\d+)–[A-Z](\d+)", rid)
        if m:
            names = [s.strip() for s in cell.split(" · ")]
            ids = [f"{m.group(1)}{k}" for k in range(int(m.group(2)), int(m.group(3)) + 1)]
            if len(names) != len(ids):
                raise SystemExit(f"kutu aralığı çözülemedi: {rid} {cell}")
            out += [(i, nm, grp) for i, nm in zip(ids, names)]
            continue
        pieces = re.split(r"\s·\s(?=[A-Z]\d+\s)", cell)
        out.append((rid, pieces[0].strip(), grp))
        for p in pieces[1:]:
            mm = re.match(r"([A-Z]\d+)\s+(.*)$", p.strip())
            out.append((mm.group(1), mm.group(2).strip(), grp))
    return out


OPS = {"→": "cmd", "⇄": "both", "⇢": "evt", "⇠": "gray", "✕": "no", "✕→": "fail", "↔": "both"}


def parse_edges(rows):
    """[(yol, etiket)] -> [{a,b,op,label}] (zincirler, virgüllü hedefler, ' · ' ile ayrık parçalar açılır)."""
    edges = []
    for r in rows:
        path, label = r[0], (r[1] if len(r) > 1 else "")
        pieces = [p.strip() for p in path.split(" · ")]
        labels = [l.strip() for l in label.split(" · ")]
        pl = labels if len(labels) == len(pieces) else [label.strip()] + [""] * (len(pieces) - 1)
        for pi, piece in enumerate(pieces):
            toks = re.split(r"(✕\s*→|✕|→|⇄|⇢|⇠|↔)", piece)
            idsets = [[x.strip() for x in t.split(",") if x.strip()] for t in toks[0::2]]
            ops = [re.sub(r"\s+", "", t) for t in toks[1::2]]
            legs, failing = [], False
            for k, op in enumerate(ops):
                kind = OPS[op]
                failing = failing or kind == "fail"
                for a in idsets[k]:
                    for b in idsets[k + 1]:
                        legs.append({"a": a, "b": b, "op": "fail" if failing else kind, "label": ""})
            lab = pl[pi]
            if not legs:
                continue
            if len(ops) > 1 and lab:
                parts = None
                for sep in (r"\s→\s", r";\s", r",\s(?![^()]*\))"):
                    ps = [x.strip() for x in re.split(sep, lab) if x.strip()]
                    if len(ps) == len(legs):
                        parts = ps
                        break
                if parts:
                    for lg, p in zip(legs, parts):
                        lg["label"] = p
                else:
                    legs[0]["label"] = lab
            else:
                legs[0]["label"] = lab
            edges += legs
    return edges


def split_label(text):
    t = text.strip()
    p, c = t.find("("), t.find(": ")
    if t.endswith(")") and p > 0 and (c == -1 or p < c):
        return t[:p].strip(), t[p + 1:-1].strip()
    if c != -1:
        return t[:c].strip(), t[c + 2:].strip()
    return t, ""


def lay(f, boxes, layout, tones, name_fn=None, hmin=None):
    """boxes [(id, metin, grup)] + layout {id:(x,y,w)} -> f'ye kutular ekler."""
    for bid, text, grp in boxes:
        if bid not in layout:
            warn(f"{f.key}: {bid} için konum yok")
            continue
        label, sub = split_label(text)
        if name_fn:
            label = name_fn(bid, label)
        x, y, w = layout[bid]
        f.node(bid, x, y, w, label, sub, tones.get(grp, "n"), h=(hmin or {}).get(bid))


def leg_tone(t, text):
    soft = "var(--surface-2)" if t == "n" else f"var(--{t}-soft)"
    stroke = "var(--line-2)" if t == "n" else f"var(--{t})"
    return f'<span class="kk-leg"><i style="background:{soft};border:1.5px solid {stroke}"></i>{text}</span>'


INK = {"n": "fg-2", "accent": "accent-ink", "cobalt": "cobalt", "amber": "amber-ink", "coral": "coral-ink", "mint": "mint-ink", "violet": "violet-ink"}


def leg_line(text, tone="n", dash=False):
    return f'<span class="kk-leg"><i class="ln{" dash" if dash else ""}" style="border-top-color:var(--{INK[tone]})"></i>{text}</span>'


def legend(*items):
    return '<div class="kk-legend">' + "".join(items) + "</div>"


def fig(did, caption, leg=""):
    return f'<figure><div id="{did}"></div><figcaption>{caption}</figcaption></figure>{leg}'


def js_flow(did, cfg):
    return "KK.flow(document.getElementById('%s'), %s);" % (did, jsj(cfg))


def js_seq(did, cfg):
    return "KK.sequence(document.getElementById('%s'), %s);" % (did, jsj(cfg))


# ---------------------------------------------------------------- sıra diyagramı
def build_seq(key, md, rows, W, title, tones, dashed=(), msg_tone=None, label_fix=None, actor_fix=None, phases=None):
    m = re.search(r"Yaşam çizgileri:\s*(.+)$", md, re.M)
    if not m:
        raise SystemExit(f"{key}: yaşam çizgileri satırı yok")
    parts = [M.strip_md(p).strip() for p in m.group(1).strip().rstrip(".").split(" · ")]
    actors = []
    for p in parts:
        mm = re.match(r"([A-Z]\d+)\s+(.*)$", p)
        aid, lab = mm.group(1), mm.group(2)
        lab = (actor_fix or {}).get(aid, lab)
        actors.append({"id": aid, "label": lab, "tone": tones.get(aid, "n")})
    step = (W - 32) / len(actors)
    ix = {a["id"]: i for i, a in enumerate(actors)}
    msgs = []
    for r in rows:
        num, path, label = r[0], r[1], r[2]
        if phases and num in phases:
            msgs.append({"sep": phases[num]})
        legs = parse_edges([(path, label)])
        out = []
        for lg in legs:
            out.append(lg)
            if lg["op"] == "both":
                out.append({"a": lg["b"], "b": lg["a"], "op": "cmd", "label": "yanıt", "ret": True})
        single = len(out) == 1 or re.search(r"[a-z]$", num)
        for k, lg in enumerate(out):
            nm = num if single else num + chr(97 + k)
            lab = (label_fix or {}).get(nm)
            if lab is None:
                lab = lg["label"]
            text = f"{nm}. {lab}".strip().rstrip(".")
            note = None
            if lg["a"] != lg["b"]:
                mm = re.match(r"^(.*?)\s*\((.*)\)$", text)
                if mm and mm.group(1) and len(text) > 30:
                    text, note = mm.group(1).strip(), mm.group(2).strip()
            msg = {"from": lg["a"], "to": lg["b"], "label": text}
            if note:
                msg["note"] = note
            if nm in dashed or lg["op"] == "evt" or lg.get("ret"):
                msg["dashed"] = True
            t = (msg_tone or {}).get(nm)
            if t:
                msg["tone"] = t
            msgs.append(msg)
    maxl = 1
    for ms_ in msgs:
        if "sep" in ms_:
            continue
        if ms_["from"] not in ix or ms_["to"] not in ix:
            raise SystemExit(f"{key}: bilinmeyen yaşam çizgisi {ms_}")
        span = abs(ix[ms_["to"]] - ix[ms_["from"]]) * step
        maxl = max(maxl, len(wrap(ms_["label"], max(10, int(span / 6.4)))) if span else 1)
    gap = max(56, maxl * 12 + 40)
    cfg = {"width": W, "title": title, "minWidth": 760, "gap": gap, "actors": actors, "messages": msgs}
    print(f"  diyagram {key}: {len(actors)} yaşam çizgisi, {len([x for x in msgs if 'sep' not in x])} ileti, aralık {gap}", file=sys.stderr)
    return cfg


# ================================================================== 4. diyagram tanımları
TONE_BOLGE = {"İstemci": "cobalt", "Kenar": "n", "Uygulama": "accent", "Veri": "violet", "Sandbox": "amber", "Dış": "mint",
              "Uygulama bölgesi": "accent", "Sandbox bölgesi": "amber", "Güvenilir kod": "mint", "Güvensiz kod": "coral", "Yalıtım sınırı": "n",
              "Gözlem": "mint", "Dağıtım": "cobalt", "Depo": "violet", "Kaynak": "cobalt", "CI": "accent", "GitOps": "violet", "Ortam": "amber", "Kapı": "coral"}
DIAGS = {}  # anahtar -> (js, html_figure)


def d1_sistem():
    md, tabs = diag_part(1)
    boxes = parse_boxes(tabs[0].rows)
    A, B, C, D = 24, 304, 604, 904
    T1, T2, T3, T4, T5 = 14, 108, 232, 372, 500
    layout = {"K1": (A, T1, 130), "K2": (A, T2, 130), "K3": (B, T2, 170), "K11": (D, T2, 150), "K5": (A, T3, 130), "K4": (B, T3, 170),
              "K6": (C, T3, 190), "K12": (D, T4, 150), "K8": (B, T4, 170), "K7": (C, T4, 190), "K9": (B, T5, 170), "K10": (C, T5, 190)}
    f = Flow(1080, "Sistem tek bakışta: istemci, kenar, API ve modüller, PostgreSQL ve Redis, kuyruk, sandbox, Claude API", "sistem")
    lay(f, boxes, layout, TONE_BOLGE)
    for e in parse_edges(tabs[1].rows):
        lab = e["label"].replace("`", "")
        if e["op"] == "both":
            f.edge(e["a"], e["b"], lab, "violet", both=True, dashed=True)
        else:
            f.edge(e["a"], e["b"], lab, "n")
    leg = legend(leg_tone("cobalt", "İstemci"), leg_tone("n", "Kenar"), leg_tone("accent", "Uygulama"), leg_tone("violet", "Veri"),
                 leg_tone("amber", "Sandbox"), leg_tone("mint", "Dış hizmetler"), leg_line("komut / çağrı"), leg_line("olay (backplane)", "violet", True))
    cap = ("İstek istemciden Cloudflare ve ingress-nginx üzerinden api ve hub'a girer; yazılar PostgreSQL'e, kuyruk işleri Redis'e gider. "
           "Sandbox yalnızca kuyruk Redis'ine bağlanır; Claude ve SMS çağrıları worker ile api'den çıkar.")
    return js_flow("d-sistem", f.cfg()), fig("d-sistem", cap, leg)


def d2_moduller():
    md, tabs = diag_part(2)
    boxes = parse_boxes(tabs[0].rows)
    A, Bc, C = 40, 400, 760
    rows_y = {5: 24, 4: 144, 3: 264, 2: 384, 1: 504, 0: 624}
    layout = {"M12": (A, rows_y[5], 200), "M13": (Bc, rows_y[5], 200), "M14": (C, rows_y[5], 200),
              "M9": (A, rows_y[4], 200), "M10": (Bc, rows_y[4], 200), "M11": (C, rows_y[4], 200),
              "M6": (A, rows_y[3], 200), "M7": (Bc, rows_y[3], 200), "M8": (C, rows_y[3], 200),
              "M5": (130, rows_y[2], 200), "M4": (670, rows_y[2], 200),
              "M1": (A, rows_y[1], 200), "M2": (Bc, rows_y[1], 200), "M3": (C, rows_y[1], 200), "M0": (Bc, rows_y[0], 200)}
    layer_tone = {"0": "n", "1": "cobalt", "2": "amber", "3": "mint", "4": "violet", "5": "n"}
    f = Flow(1000, "Modül bağımlılıkları: katmanlar, komut okları, olay okları ve yasak bağımlılıklar", "moduller")
    lay(f, boxes, layout, layer_tone, name_fn=lambda bid, lab: f"{bid} {lab}")
    layer_name = {0: "Katman 0", 1: "Katman 1", 2: "Katman 2", 3: "Katman 3", 4: "Katman 4", 5: "Katman 5 · yalnızca olay dinler"}
    members = {5: ["M12", "M13", "M14"], 4: ["M9", "M10", "M11"], 3: ["M6", "M7", "M8"], 2: ["M5", "M4"], 1: ["M1", "M2", "M3"], 0: ["M0"]}
    for L in (5, 4, 3, 2, 1, 0):
        ids = members[L]
        f.group(layer_name[L], ids, "n", pad=14, top=26)
        g = f.groups[-1]
        g["x"], g["w"] = 12, 1000 - 24  # katman bandı tüm genişliği kaplar
    gray_label = ""

    def kisalt(lab, op):
        lab = re.sub(r"\s*\(kırmızı kesik\)|\s*\(gri kesik\)", "", lab).replace("**", "")
        if op == "evt":
            lab = re.sub(r"^olay\s+", "", lab)
            lab = re.sub(r"\s*\([^)]*\)", "", lab)
            lab = re.sub(r"v1\b", "", lab)
        elif op == "cmd":
            lab = re.sub(r"^komut\s+", "", lab)
            lab = lab.strip("()") if lab.startswith("(") else lab
        return lab.strip()

    for e in parse_edges(tabs[1].rows):
        lab = kisalt(e["label"].replace("`", ""), e["op"])
        if e["op"] == "gray":
            gray_label = lab
            continue
        if e["op"] == "cmd":
            f.edge(e["a"], e["b"], lab, "cobalt")
        elif e["op"] == "evt":
            f.edge(e["a"], e["b"], lab, "mint", dashed=True)
        elif e["op"] == "no":
            f.edge(e["a"], e["b"], lab, "coral", dashed=True)
    for k, (a, b) in enumerate((("M9", "M12"), ("M10", "M13"), ("M11", "M14"))):
        f.edge(a, b, gray_label if k == 0 else "", "n", dashed=True)
    leg = legend(leg_tone("n", "Katman 0 ve 5"), leg_tone("cobalt", "Katman 1"), leg_tone("amber", "Katman 2"), leg_tone("mint", "Katman 3"), leg_tone("violet", "Katman 4"),
                 leg_line("komut (üst katman alt katmanı çağırır)", "cobalt"), leg_line("olay", "mint", True), leg_line("yasak bağımlılık", "coral", True),
                 leg_line("Katman 5 tüm alan olaylarını dinler", "n", True))
    cap = ("Komutlar yalnızca alt katmana gider; üst katmana bilgi olay olarak akar. Öğrenme ve Challenge modülleri Ekonomi'ye ve Dünya'ya dokunamaz: "
           "AI puanı ve test sonucu gelire yalnızca olay olarak ulaşır.")
    return js_flow("d-moduller", f.cfg(min_width=780)), fig("d-moduller", cap, leg)


def d3_ai():
    md, tabs = diag_part(3)
    tones = {"L1": "cobalt", "L2": "accent", "L3": "violet", "L4": "violet", "L5": "accent", "L6": "mint", "L7": "mint", "L8": "mint", "L9": "accent"}
    cfg = build_seq("ai", md, tabs[0].rows, 1000, "AI puanlama sıra diyagramı: istemci, api, kuyruk, Haiku, Sonnet, koşullu Opus, hub", tones,
                    dashed={"3b", "12a", "12b"}, msg_tone={"9": "amber", "8": "accent", "10": "accent"},
                    label_fix={"4": "XREADGROUP (AiGradeConsumer)", "12b": "olaylar istemciye"}, actor_fix={"L5": "worker"},
                    phases={"1": "İstek ve kuyruğa alma", "4": "Kuyruk tüketimi ve puanlama", "11": "Sonuç ve bildirim"})
    leg = legend(leg_line("komut / çağrı"), leg_line("yanıt ya da olay", "n", True), leg_line("koşullu: güven düşükse Opus", "amber"))
    cap = ("Cevap önce kuyruğa girer ve 202 ile döner; puanlama arka planda Haiku ön eleme, Sonnet puanlama ve yalnızca güven düşükse Opus kör ikinci okuma ile ilerler. "
           "Sonuç Kurul Kartı olarak outbox ve backplane ile istemciye ulaşır.")
    return js_seq("d-ai", cfg), fig("d-ai", cap, leg)


def d4_sandbox():
    md, tabs = diag_part(4)
    boxes = parse_boxes(tabs[0].rows)
    layout = {"S1": (30, 64, 140), "S7": (30, 236, 140), "S8": (30, 410, 140), "S2": (280, 236, 170),
              "S3": (610, 236, 150), "S6": (920, 236, 150), "S4": (920, 400, 150), "S5": (920, 560, 150)}
    f = Flow(1100, "Sandbox mimarisi: uygulama bölgesi, kısıtlı Redis, sandbox ajanı, gVisor içinde hakem ve oyuncu", "sandbox")
    lay(f, boxes, layout, TONE_BOLGE, name_fn=lambda bid, lab: lab)
    for e in parse_edges(tabs[1].rows):
        lab = e["label"].replace("`", "")
        if e["op"] == "both":
            f.edge(e["a"], e["b"], lab, "coral", both=True)
        else:
            f.edge(e["a"], e["b"], lab, "n")
    f.group("Uygulama bölgesi", ["S1", "S7", "S8"], "accent")
    f.group("Sandbox bölgesi (ayrı düğüm havuzu)", ["S3", "S6", "S4", "S5"], "amber")
    leg = legend(leg_tone("accent", "Uygulama bölgesi"), leg_tone("violet", "Veri"), leg_tone("amber", "Sandbox ajanı ve yalıtım"),
                 leg_tone("mint", "Güvenilir kod (hakem)"), leg_tone("coral", "Güvensiz kod (oyuncu)"), leg_line("komut / veri akışı"), leg_line("hakem ile oyuncu arası çağrı ve dönüş", "coral"))
    cap = ("İş yalnızca Redis kuyruğundan geçer: ajan işi alır, ısıtılmış gVisor container'ında hakemi çalıştırır; oyuncu kodu ağsız ve salt okunur dosya sisteminde yalnızca derlenmiş yöntem olarak koşar. "
           "Sonuç nonce ile doğrulanıp veritabanına yazılır.")
    return js_flow("d-sandbox", f.cfg()), fig("d-sandbox", cap, leg)


def d5_otp():
    md, tabs = diag_part(5)
    tones = {"P1": "cobalt", "P2": "accent", "P3": "violet", "P4": "mint", "P5": "violet", "P6": "mint", "P7": "mint", "P8": "mint", "P9": "cobalt"}
    cfg = build_seq("otp", md, tabs[0].rows, 1000, "OTP akışı: kod isteme, doğrulama, yaş belirteci ve veli onayı", tones,
                    dashed={"6", "8a", "8b"}, label_fix={"9a": "e-Devlet yaş doğrulaması", "9b": "yaş belirteci: lt15 red · 15-17 · 18+"},
                    phases={"1": "Kod isteme", "7": "Doğrulama", "9": "Yaş doğrulama ve veli onayı"})
    leg = legend(leg_line("istek / çağrı"), leg_line("yanıt", "n", True))
    cap = ("Kod isteği önce Redis'te sayaçlarla sınırlanır, gerekirse Turnstile ile doğrulanır; SMS Netgsm'den gider, hata ya da düşük teslim oranında İleti Merkezi devreye girer. "
           "Yeni kullanıcı yaş belirteciyle devam eder; 15–17 yaş için veliye SMS bağlantısı gider.")
    return js_seq("d-otp", cfg), fig("d-otp", cap, leg)


def d6_k8s():
    md, tabs = diag_part(6)
    boxes = parse_boxes(tabs[0].rows)
    A, B, C = 24, 394, 764
    r1, r2, r3, r4 = 20, 170, 320, 470
    layout = {"T1": (A, r1, 220), "T2": (B, r1, 220), "T7": (C, r1, 220), "T3": (B, r2, 220), "T4": (B, r3, 220), "T5": (C, r3, 220), "T9": (A, r3, 220), "T6": (B, r4, 220)}
    f = Flow(1000, "Kubernetes topolojisi: kenar, uygulama, veri, sandbox ve gözlem havuzları, Argo CD ve nesne deposu", "k8s")
    lay(f, boxes, layout, TONE_BOLGE, hmin={k: 72 for k in layout})
    for e in parse_edges(tabs[1].rows):
        lab = e["label"].replace("`", "")
        f.edge(e["a"], e["b"], lab, "n")
    leg = legend(leg_tone("n", "Kenar"), leg_tone("accent", "Havuz app"), leg_tone("violet", "Havuz data ve nesne deposu"), leg_tone("amber", "Havuz sandbox"),
                 leg_tone("mint", "Havuz obs"), leg_tone("cobalt", "Dağıtım (GitOps)"), leg_line("trafik / bağlantı"))
    cap = "Dört düğüm havuzu ayrıdır; sandbox havuzunun tek çıkışı kuyruk Redis'idir (NetworkPolicy). Argo CD imzayı doğrulayıp app ve sandbox havuzlarına GitOps ile dağıtır; tüm havuzlar OTel ile gözlem havuzuna yazar."
    return js_flow("d-k8s", f.cfg()), fig("d-k8s", cap, leg)


def d7_shard():
    md, tabs = diag_part(7)
    boxes = parse_boxes(tabs[0].rows)
    layout = {"H1": (20, 24, 170), "H2": (330, 24, 200), "H3": (700, 24, 260), "H4": (330, 176, 200), "H5": (330, 330, 200),
              "H6": (40, 480, 200), "H7": (330, 480, 200), "H8": (700, 480, 220)}
    f = Flow(1000, "SignalR shard ölçekleme: bilet alma, tutarlı karma ile pod seçimi, anlık görüntü ve backplane", "shard")
    lay(f, boxes, layout, TONE_BOLGE, hmin={"H1": 100, "H2": 100})
    for e in parse_edges(tabs[1].rows):
        lab = e["label"].replace("`", "")
        if e["op"] in ("no", "fail"):
            f.edge(e["a"], e["b"], lab, "coral", dashed=True)
        else:
            f.edge(e["a"], e["b"], lab, "n")
    leg = legend(leg_tone("cobalt", "İstemci"), leg_tone("accent", "Uygulama"), leg_tone("violet", "Redis"), leg_tone("n", "Kenar"),
                 leg_line("istek / veri akışı"), leg_line("pod ölümü ve kurtarma", "coral", True))
    cap = ("Bir shard'ın tüm bağlantıları aynı pod'a düşer (tutarlı karma); pod'lar arası olaylar yalnızca backplane'den geçer. Pod ölürse istemci yeniden bağlanır ve shard anlık görüntüden kurulur.")
    return js_flow("d-shard", f.cfg()), fig("d-shard", cap, leg)


def d8_cicd():
    md, tabs = diag_part(8)
    boxes = parse_boxes(tabs[0].rows)
    layout = {"C1": (20, 36, 140), "C2": (310, 36, 140), "C3": (600, 36, 140), "C4": (890, 36, 140), "C5": (890, 196, 140), "C6": (600, 196, 140),
              "C8": (20, 196, 140), "C7": (310, 336, 140)}
    f = Flow(1040, "CI/CD akışı: PR kapıları, imaj hattı, GitOps, staging, sandbox kapısı ve canary", "cicd")
    lay(f, boxes, layout, TONE_BOLGE)
    for e in parse_edges(tabs[1].rows):
        lab = e["label"].replace("`", "")
        if e["op"] == "evt":
            f.edges.append({"a": e["a"], "b": e["b"], "label": lab, "tone": "coral", "dashed": True, "both": False, "fs": "t", "ts": "r", "self": False, "selfside": "t"})
        else:
            f.edge(e["a"], e["b"], lab, "n")
    leg = legend(leg_tone("cobalt", "Kaynak ve dağıtım"), leg_tone("accent", "CI"), leg_tone("violet", "GitOps ve deploy deposu"), leg_tone("amber", "Ortamlar"), leg_tone("coral", "Sandbox kapısı"),
                 leg_line("akış"), leg_line("SLO ihlali: otomatik geri alma", "coral", True))
    cap = "Birleşme imaj hattını tetikler; Argo CD staging'e senkronlar, haftada en çok iki onayla canary %10, %50 ve %100 ilerler. Sandbox imajı ya da politikası değişirse ek kapı koşar; SLO ihlalinde geri alma otomatiktir."
    return js_flow("d-cicd", f.cfg()), fig("d-cicd", cap, leg)


# ---------------------------------------------------------------- ERD (B7 §4.4)
ERD_TONE = {"Oyuncu": "cobalt", "Auth": "violet", "Ekonomi": "amber", "Eğitim": "mint", "Challenge": "coral", "Dünya": "accent", "Görev": "n", "Pazar": "n", "Sosyal": "n"}


def table_lines(t):
    t = t.strip()
    m = re.match(r"^(.*?)\s*\(\+\s*(.*)\)$", t)
    if m:
        return [m.group(1), "+ " + m.group(2)]
    if " + " in t:
        a, b = t.split(" + ", 1)
        return [a + " +", b]
    return [t]


def d_erd():
    tabs = mdtab(B7, "### 4.4", "## 5.")
    boxes = pick(tabs, ["#", "Kutu", "Tablo"], "ERD kutuları")
    rels = pick(tabs, ["#", "İlişki", "Kardinalite"], "ERD ilişkileri")
    cw, gx, gy = 196, 70, 74
    cols = [24 + k * (cw + gx) for k in range(4)]
    grid = {"E2": (0, 0), "E3": (1, 0), "E16": (2, 0), "E15": (3, 0),
            "E4": (0, 1), "E1": (1, 1), "E12": (2, 1), "E13": (3, 1),
            "E6": (0, 2), "E5": (1, 2), "E11": (2, 2), "E10": (3, 2),
            "E7": (0, 3), "E8": (1, 3), "E9": (2, 3), "E14": (3, 3)}
    # satır yükseklikleri: her satırın en yüksek kutusuna göre
    info = {}
    for r in boxes.rows:
        eid, name, tbl, mod, cols_ = r[0], r[1], r[2], r[3], r[4]
        rows_ = table_lines(tbl) + [c.strip() for c in cols_.split(",") if c.strip()]
        info[eid] = (name, rows_, mod)
    rowh = {}
    for eid, (c, r) in grid.items():
        rowh[r] = max(rowh.get(r, 0), 34 + len(info[eid][1]) * 16)
    ys, y = {}, 28
    for r in range(4):
        ys[r] = y
        y += rowh[r] + gy
    f = Flow(1050, "ERD: 16 çekirdek varlık, modüle göre renkli kutular, sert ve yumuşak ilişkiler ile kardinalite", "erd")
    for eid, (c, r) in grid.items():
        name, rows_, mod = info[eid]
        f.node(eid, cols[c], ys[r], cw, f"{eid} {name}", "", ERD_TONE.get(mod, "n"), rows=rows_)
    pairs = {}
    for r in rels.rows:
        rid, text, card, fk, kind = r[0], r[1], r[2], r[3], r[4]
        ids = re.findall(r"\bE\d+\b", text)
        if len(ids) < 2:
            continue  # BusinessVault / Item gibi ayrı kutusu olmayan uçlar tablodadır
        a, b = ids[0], ids[1]
        soft = kind.startswith("yumuşak")
        who = re.search(r"\((bildiren|bildirilen|davet eden)\)", text)
        key = (a, b)
        if key in pairs:
            pairs[key]["dual"] = True
            continue
        lab = card.replace(" ", "") if False else card
        pairs[key] = {"a": a, "b": b, "label": lab, "dashed": soft, "who": who.group(1) if who else ""}
    for p in pairs.values():
        if p.get("dual"):
            p["label"] = p["label"] + " (bildiren, bildirilen)"
        elif p["who"] == "davet eden":
            p["label"] = p["label"] + " (davet eden)"
        f.edge(p["a"], p["b"], p["label"], "n", dashed=p["dashed"], selfside="t")
    leg = legend(*(leg_tone(t, n) for t, n in (("cobalt", "Oyuncu"), ("violet", "Auth"), ("amber", "Ekonomi"), ("mint", "Eğitim"), ("coral", "Challenge"), ("accent", "Dünya"), ("n", "Görev, Pazar, Sosyal"))),
                 leg_line("sert ilişki (gerçek yabancı anahtar)"), leg_line("yumuşak ilişki (yalnızca kimlik saklar)", "n", True))
    cap = "Ok, çok tarafını (alt kaydı) gösterir. Player merkezde durur; bölümlü ve modüller arası bağlar yumuşaktır (kesik çizgi), yani yabancı anahtar yerine kimlik saklar."
    return js_flow("d-erd", f.cfg(min_width=820)), fig("d-erd", cap, leg)


# ---------------------------------------------------------------- istemci katmanları (B8 §1.3)
def d_istemci():
    tabs = mdtab(B8, "### 1.3", "### 1.4")
    nodes = pick(tabs, ["Düğüm", "Katman", "Sorumluluk"], "B8 1.3 düğümler")
    edges = pick(tabs, ["Kenar", "Kaynak → hedef", "Kanal"], "B8 1.3 kenarlar")
    x1, x2, x3, x4 = 20, 300, 580, 860
    layout = {"N1": (x2, 20), "N2": (x2, 130), "N10": (x1, 250), "N3": (x2, 250), "N4": (x3, 250), "N5": (x1, 390), "N6": (x2, 390), "N7": (x3, 390), "N12": (x4, 390),
              "N9": (x1, 530), "N11": (x2, 530), "N8": (x3, 530), "N13": (x4, 530)}
    layer_tone = {"1": "accent", "2": "cobalt", "3": "mint", "3/5": "mint", "4": "violet", "5": "amber", "dış": "n"}
    f = Flow(1050, "İstemci katman mimarisi: React arayüzü, köprü, PixiJS sahnesi, ağ ve platform katmanları", "istemci")
    for r in nodes.rows:
        m = re.match(r"(N\d+)\s+(.*)$", r[0])
        nid, nm = m.group(1), m.group(2)
        label, sub = split_label(nm)
        x, y = layout[nid]
        f.node(nid, x, y, 180, f"{nid} {label}", sub, layer_tone.get(r[1].strip(), "n"))
    for e in parse_edges([(r[1], r[2]) for r in edges.rows]):
        lab = e["label"].replace("`", "")
        f.edge(e["a"], e["b"], lab, "n", both=(e["op"] == "both"))
    leg = legend(leg_tone("accent", "Katman 1: React UI"), leg_tone("cobalt", "Katman 2: Köprü"), leg_tone("mint", "Katman 3: Oyun sahnesi"), leg_tone("violet", "Katman 4: Ağ"),
                 leg_tone("amber", "Katman 5: Platform"), leg_tone("n", "Dış: backend ve CDN"), leg_line("çağrı / veri"), leg_line("çift yönlü", "n", True))
    cap = "React arayüzü sahneyle yalnızca köprü üzerinden konuşur; sunucu durumu TanStack Query'den, dünya durumu React dışı WorldStore'dan okunur. Ağ katmanı backend'e, Service Worker CDN'e bağlanır."
    return js_flow("d-istemci", f.cfg(min_width=760)), fig("d-istemci", cap, leg)


for _k, _fn in (("sistem", d1_sistem), ("moduller", d2_moduller), ("ai", d3_ai), ("sandbox", d4_sandbox), ("otp", d5_otp), ("k8s", d6_k8s),
                ("shard", d7_shard), ("cicd", d8_cicd), ("erd", d_erd), ("istemci", d_istemci)):
    DIAGS[_k] = _fn()
N_DIAG = len(DIAGS)


# ================================================================== 5. tablo kancaları
def grouped_table(raw_h, raw_r, aria, mth_col=None):
    n = len(raw_h)
    o = ['<div class="tablewrap scroll" tabindex="0" role="region" aria-label="%s"><table><thead><tr>' % M.attr(aria)]
    o += ["<th>%s</th>" % M.inline(h) for h in raw_h]
    o.append("</tr></thead><tbody>")
    for r in raw_r:
        r = list(r) + [""] * (n - len(r))
        pl = [M.strip_md(c) for c in r]
        if pl[0] and not any(pl[1:]):
            o.append('<tr class="grp"><th colspan="%d" scope="colgroup">%s</th></tr>' % (n, M.inline(r[0])))
            continue
        tds = []
        for j, c in enumerate(r):
            if j == mth_col and re.fullmatch(r"(GET|POST|PUT|PATCH|DELETE|HEAD)", pl[j]):
                tds.append('<td class="nw"><span class="mth %s">%s</span></td>' % (pl[j].lower(), pl[j]))
            else:
                tds.append("<td>%s</td>" % M.inline(c))
        o.append("<tr>" + "".join(tds) + "</tr>")
    o.append("</tbody></table></div>")
    return "".join(o)


def hook_catalogs(headers, rows, ctx=None):
    if headers[:3] == ["Yöntem", "Yol", "Amaç"]:
        return grouped_table(ctx["raw_headers"], ctx["raw_rows"], "Uç nokta kataloğu", mth_col=0)
    if headers[:2] == ["Tablo", "Amaç"] and "Ana kolonlar" in headers:
        return grouped_table(ctx["raw_headers"], ctx["raw_rows"], "Tablo kataloğu")
    return None


def hook_adr(headers, rows, ctx=None):
    if headers[:2] != ["#", "Karar"] or "Gerekçe" not in headers:
        return None
    rh, rr = ctx["raw_headers"], ctx["raw_rows"]
    cards = []
    for r in rr:
        kv = "".join(f"<dt>{esc(M.strip_md(h))}</dt><dd>{M.inline(c)}</dd>" for h, c in zip(rh[2:], r[2:]) if M.strip_md(c))
        cards.append(f'<article class="card adr"><div class="adr-h"><span class="badge accent">{esc(M.strip_md(r[0]))}</span></div><p class="adr-karar">{M.inline(r[1])}</p><dl class="adr-kv">{kv}</dl></article>')
    return ('<div class="adr-grid">' + "".join(cards) + "</div>"
            '<details class="acc"><summary>ADR tablo görünümü</summary>' + M.table_html(rh, rr) + "</details>")


def hook_cost(headers, rows, ctx=None):
    if headers[:5] != ["Senaryo", "Tanım", "1k DAU", "10k DAU", "100k DAU"]:
        return None
    labels = [r[0].split()[0] for r in rows]
    series = [{"name": h, "values": [M.parse_num(r[j]) for r in rows]} for j, h in ((2, "1k DAU"), (3, "10k DAU"), (4, "100k DAU"))]
    v0, v4 = series[1]["values"][0], series[1]["values"][-1]
    cap = f"10k DAU'da senaryo {labels[0]} {fmt_tr(v0, 4)} $/DAU/gün iken {labels[-1]} {fmt_tr(v4, 4)} $/DAU/gün'dür" + (f" (%{fmt_tr((1 - v4 / v0) * 100)} düşüş)." if v4 < v0 else ".") + " KANON hedefi ≈" + AI_DAU + " $/DAU/gün; tablo görünümü grafiğin altındadır."
    html = f'<figure><div id="c-maliyet"></div><figcaption>{cap}</figcaption></figure>' + M.table_html(ctx["raw_headers"], ctx["raw_rows"])
    js = "KK.barChart(document.getElementById('c-maliyet'), {labels:%s, series:%s, yLabel:'$/DAU/gün', format:function(v){return KK.fmt(v,4)}, title:'Senaryo başına AI maliyeti ($/DAU/gün)'});" % (jsj(labels), jsj(series))
    return html, js


# ================================================================== 6. bölüm içerikleri
def strip_ascii(md):
    def drop(m):
        return "" if re.search(r"[┌└│─▼▲►┬┴]", m.group(0)) else m.group(0)

    return re.sub(r"```[A-Za-z]*\n.*?\n```[ \t]*\n?", drop, md, flags=re.S)


def src(file, frm, to=None, skip_heading=False, id_prefix=None, http_json=False, **kw):
    md = fix_md(M.extract(file, frm, to, keep_heading=not skip_heading))
    if http_json:  # B7 §5.4 istek/yanıt blokları ```http ile yazılmış; sayfada JSON renklendirmesi (data-lang="json") istenir
        md = re.sub(r"^```http", "```json", md, flags=re.M)
    d = {"md": md, "id_prefix": id_prefix if id_prefix is not None else re.match(r"([A-Za-z]+\d*)", file).group(1).lower() + "-"}
    d.update(kw)
    return d


def stat(v, l):
    return f'<div class="stat"><div class="v">{v}</div><div class="l">{l}</div></div>'


def kapak_html():
    svg = ms.logo_svg()
    return (
        f'<div class="cover"><div class="logo-lg">{svg}<span class="eyebrow">Belge 2 · Teknik mimari</span></div>'
        "<h1>KodKent Teknik Mimari</h1><p class=\"slogan\">Oyunlarla yazılım öğreniyorum.</p>"
        "<p class=\"sub\">Bu belge KodKent'i ayakta tutan sistemi anlatır: modüler monolit ve ayrı sandbox bölgesi, PostgreSQL ve Redis, "
        "SignalR ile gerçek zamanlı dünya, Claude ile puanlanan Kurul, gVisor içinde çalışan oyuncu kodu, çift kayıtlı ekonomi defteri, kimlik ve KVKK, istemci ve altyapı.</p></div>"
        '<div class="docbox"><p><strong>Bu belge ne anlatır, kim okumalı.</strong> Yazılım ekibi için: mimari kararları (ADR), modülleri, veri modelini, API\'yi, '
        "gerçek zamanlı katmanı, AI puanlama hattını, sandbox\'ı, güvenlik ve altyapıyı tek sayfada okunur hâle getirir. Metinler spec belgelerinden "
        f"(KANON, B3, B5, B7, B8, B9) aynen alınmıştır; {N_DIAG} diyagram B7 §15, §4.4 ve B8 §1.3'teki tablolardan çizilmiştir. "
        "Uzun DDL, JSON, C# ve istem blokları kapalı başlıklar altındadır.</p></div>"
    )


def stats_html():
    return (
        '<div class="grid stats">'
        + stat(N_EP, f"uç nokta ({N_TEMEL} temel + {N_B8} B8 talebi + {N_YK} Yaş Kapısı v2)")
        + stat(f"{N_MODUL} + 1", f"backend modülü + Platform çekirdeği; {N_SEMA} PostgreSQL şeması")
        + stat(N_TABLO, "tablo (B7 §4.2 kataloğu)")
        + stat(N_ADR, "mimari karar (ADR)")
        + stat(f"≈{AI_PUAN} $", f"puanlama başına AI maliyeti (≈{AI_DAU} $/DAU/gün)")
        + stat(OTO_TEST, f"Otopark L1 testi; B5 doğrulaması {OTO_OK} / {OTO_TOP} vaka")
        + stat(f"{MVP_HAFTA} hafta", f"MVP süresi ({YOL_HAFTA} hafta, {YOL_SPRINT} sprintlik yol haritası)")
        + stat(N_DIAG, "diyagram (sıra, akış, ERD, topoloji)")
        + "</div>"
    )


UC_NOKTA_NOTU = (
    '<div class="callout amber"><p><strong>Uç nokta sayısı hakkında.</strong> Kapak KANON §12.4 değerlerini izler: '
    f"{N_EP} uç nokta = {N_TEMEL} temel katalog (B7 §5.3) + {N_B8} B8 talebi + {N_YK} Yaş Kapısı v2 ucu (B7 §12.3). "
    f"B7 §5.3 tablosu birleşik satırlar yüzünden {N_EP_SATIR} satırdır; ayrı ayrı sayılınca {N_EP_HESAP} uç nokta eder.</p></div>"
)


def module_cards_html():
    md = M.extract(B7, "### 3.2", "### 3.3")
    chunks = re.split(r"\n(?=\*\*[^*\n]+\*\*[ \t]*\n)", md.replace("\r\n", "\n"))
    head, cards = chunks[0], chunks[1:]
    if len(cards) < 14:
        warn(f"B7 §3.2'de {len(cards)} modül kartı bulundu (14+ bekleniyor)")
    intro = head.split("\n", 1)[1] if "\n" in head else ""
    out = ['<h3 id="modul-kartlari">3.2 Modül kartları</h3>', str(M.render(intro.strip(), id_prefix="b7-mk-"))]
    out.append('<div class="grid mod-grid">')
    for c in cards:
        first, _, rest = c.strip().partition("\n")
        title = re.match(r"\*\*(.+?)\*\*", first).group(1)
        out.append(f'<article class="card mod"><h4>{M.inline(title)}</h4>{M.render(rest.strip(), id_prefix="b7-mk-")}</article>')
    out.append("</div>")
    return "".join(out)


RISK_IDS = ["R01", "R02", "R03", "R09", "R10", "R14", "R15", "R16", "R17", "R22", "R24"]
SEV_TR = {"kritik": "kritik", "yuksek": "yüksek", "orta": "orta", "dusuk": "düşük"}


def risk_html():
    t = mdtab(B9, "## 10.", "## 11.")[0]
    rows = {pl[0]: (pl, raw) for pl, raw in zip(t.rows, t.raw_rows)}
    sel = [rows[i] for i in RISK_IDS if i in rows]
    if len(sel) != len(RISK_IDS):
        warn("B9 §10'da bazı teknik risk kimlikleri yok")
    sel.sort(key=lambda x: -M.parse_num(x[0][4]))
    o = ['<div class="tablewrap"><table class="risk"><thead><tr><th>ID</th><th>Risk</th><th class="num">Skor</th><th>Önem</th><th>Tetikleyici</th><th>Azaltma</th><th>Sahip</th></tr></thead><tbody>']
    for pl, raw in sel:
        sev = pl[5].strip().lower()
        o.append(f'<tr><td class="nw">{esc(pl[0])}</td><td>{M.inline(raw[1])}</td><td class="num">{esc(pl[4])}</td>'
                 f'<td class="nw"><span class="sev {sev}" aria-hidden="true"></span>{SEV_TR.get(sev, sev)}</td><td>{M.inline(raw[6])}</td><td>{M.inline(raw[7])}</td><td>{M.inline(raw[8])}</td></tr>')
    o.append("</tbody></table></div>")
    return "".join(o)


KAYNAKLAR = (
    '<h3 id="kaynak-belgeler">Kaynak belgeler</h3>'
    '<div class="tablewrap"><table><thead><tr><th>Belge</th><th>Bu sayfaya katkısı</th><th>Nerede</th></tr></thead><tbody>'
    "<tr><td class=\"nw\">KANON</td><td>Sabitler; kapak sayıları (§12.4), v2 kararları (§12), AI sabitleri (§9)</td><td><a href=\"#kapak\">Sistem tek bakışta</a></td></tr>"
    "<tr><td class=\"nw\">B3</td><td>Eğitim sistemi ve yapay zekâ öğretmen: puanlama pipeline'ı, istem şablonları, kalibrasyon, anti-cheat, maliyet modeli</td><td><a href=\"#ai-pipeline\">Eğitim ve AI pipeline'ı</a></td></tr>"
    "<tr><td class=\"nw\">B5</td><td>İşletmeler ve kod projeleri: Challenge Spec formatı, harness yaklaşımı, tohumlu test üretimi</td><td><a href=\"#sandbox\">Kod çalıştırma sandbox'ı</a></td></tr>"
    "<tr><td class=\"nw\">B7</td><td>Backend mimari ve veri modeli: ADR, modüller, veri modeli, API, SignalR, kuyruklar, sandbox, simülasyon, kimlik ve KVKK, altyapı, monorepo; diyagram içerikleri (§15)</td>"
    "<td><a href=\"#kararlar\">ADR</a> · <a href=\"#veri\">Veri</a> · <a href=\"#api\">API</a> · <a href=\"#gercek-zamanli\">Gerçek zamanlı</a> · <a href=\"#simulasyon\">Simülasyon</a> · <a href=\"#kimlik\">Kimlik</a> · <a href=\"#altyapi\">Altyapı</a> · <a href=\"#monorepo\">Monorepo</a></td></tr>"
    "<tr><td class=\"nw\">B8</td><td>İstemci, oyun motoru ve ekranlar: teknoloji kararları, render motoru, çevrimdışı çalışma, performans izleme</td><td><a href=\"#istemci\">İstemci mimarisi</a></td></tr>"
    "<tr><td class=\"nw\">B9</td><td>Ürün stratejisi, MVP ve yol haritası: risk kaydı (§10)</td><td><a href=\"#teknik-riskler\">Teknik riskler</a></td></tr>"
    "</tbody></table></div>"
)

CSS = """
.stat .v{font-size:28px;overflow-wrap:anywhere}
.adr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:14px;margin:12px 0 16px}
.card.adr{display:grid;gap:8px;align-content:start;padding:14px 16px}
.card.adr .adr-h{display:flex;gap:8px;align-items:center}
.adr-karar{margin:0;font-weight:600;max-width:none}
.adr-kv{margin:0;font-size:13.5px}
.adr-kv dt{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:8px}
.adr-kv dd{margin:2px 0 0;max-width:none}
.mod-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:14px;margin:10px 0 18px}
.card.mod h4{margin:0 0 8px;font-size:15.5px}
.card.mod ul{margin:0;padding-left:18px;font-size:13.5px}
.card.mod li{margin:4px 0;max-width:none}
.card.mod p{max-width:none}
.tablewrap.scroll{max-height:34rem;overflow:auto}
.tablewrap.scroll thead th{position:sticky;top:0;background:var(--surface-2);z-index:1}
tr.grp th{background:var(--accent-soft);color:var(--accent-ink);text-align:left;font-size:12.5px;letter-spacing:.04em;padding:6px 10px}
.mth{display:inline-block;min-width:4em;text-align:center;font:700 11px var(--font-mono);padding:1px 6px;border-radius:4px;background:var(--surface-2);color:var(--fg-2)}
.mth.get{background:var(--mint-soft);color:var(--mint-ink)}
.mth.post{background:var(--cobalt-soft);color:var(--cobalt)}
.mth.put,.mth.patch{background:var(--amber-soft);color:var(--amber-ink)}
.mth.delete{background:var(--coral-soft);color:var(--coral-ink)}
.kk-leg i.ln{width:24px;height:0;border-radius:0;border-top:2px solid var(--fg-2);background:none;margin-right:6px}
.kk-leg i.ln.dash{border-top-style:dashed}
.diag{overflow-x:auto}
table.risk td{vertical-align:top;font-size:13.5px}
"""

RESERVED = ["d-sistem", "d-moduller", "d-ai", "d-sandbox", "d-otp", "d-k8s", "d-shard", "d-cicd", "d-erd", "d-istemci", "c-maliyet", "modul-kartlari", "erd",
            "teknik-riskler", "kaynak-belgeler", "acik-sorular", "sprint-epikleri"]

# ------------------------------------------------------------------ PAGE
JS_ALL = {k: v[0] for k, v in DIAGS.items()}
FIG = {k: v[1] for k, v in DIAGS.items()}

PAGE = {
    "hooks": [hook_adr, hook_catalogs, hook_cost],
    "reserved_ids": RESERVED,
    "css": CSS,
    "sections": [
        {
            "id": "kapak",
            "html_top": kapak_html(),
            "title": "Sistem tek bakışta",
            "intro": f"<p>Sayılar KANON §12.4 ve B7 tablolarından hesaplanır. Diyagram B7 §15.1'deki kutu ve ok tablosundan çizildi: istemciden Cloudflare'e, API ve modüllere, PostgreSQL ve Redis'e, kuyruk üzerinden sandbox'a ve Claude API'ye giden yol.</p>",
            "html_before": stats_html() + UC_NOKTA_NOTU + FIG["sistem"],
            "js": JS_ALL["sistem"],
            "parts": [
                {"html": '<h3 id="yonetici-ozeti">Yönetici özeti (B7)</h3>'},
                src(B7, "## 0.", "## 1.", skip_heading=True),
            ],
        },
        {
            "id": "kararlar",
            "title": "Mimari kararlar (ADR)",
            "intro": f"<p>Önce kısıtlar ve kapasite varsayımları (B7 §1), ardından {N_ADR} mimari karar (B7 §2): her kartta karar, değerlendirilen seçenekler, gerekçe, sonuç ve elenen seçenek yer alır. Kararların geri dönüş maliyeti tablonun altındadır.</p>",
            "sources": [src(B7, "## 1.", "## 2."), src(B7, "## 2.", "## 3.")],
        },
        {
            "id": "moduller",
            "title": "Modüller ve sorumluluklar",
            "intro": "<p>Mantıksal olarak 14 modül ve bir ortak çekirdek (Platform) vardır; fiziksel olarak dört dağıtım birimi çalışır. Her modül kartı sorumluluğu, sahip olduğu tabloları, yayınladığı ve tükettiği olayları söyler; bağımlılık yönü diyagramı B7 §15.2'den çizildi.</p>",
            "js": JS_ALL["moduller"],
            "parts": [
                {"md": strip_ascii(M.extract(B7, "### 3.1", "### 3.2")), "demote": 0, "id_prefix": "b7-"},
                {"html": module_cards_html()},
                {"html": '<h3 id="bagimlilik-diyagrami">Bağımlılık diyagramı</h3>' + FIG["moduller"]},
                src(B7, "### 3.3", "## 4.", demote=0),
            ],
        },
        {
            "id": "veri",
            "title": "Veri modeli",
            "intro": "<p>Veri modeli şemalara bölünmüş PostgreSQL 18'dir. Önce strateji, sonra çekirdek varlıkların ERD'si (B7 §4.4'teki kutu ve ilişki tablolarından çizildi), tablo kataloğu ve kritik tabloların DDL'i gelir. DDL blokları kapalı başlıklar altındadır.</p>",
            "js": JS_ALL["erd"],
            "parts": [
                src(B7, "## 4.", "### 4.1", skip_heading=True, demote=0),
                src(B7, "### 4.1", "### 4.2", demote=0),
                {"html": '<h3 id="erd">ERD: çekirdek varlıklar ve ilişkiler</h3>' + FIG["erd"]},
                src(B7, "### 4.4", "## 5.", demote=0, top=2, collapse_over=2500),
                src(B7, "### 4.2", "### 4.3", demote=0),
                src(B7, "### 4.3", "### 4.4", demote=0, collapse_over=900),
            ],
        },
        {
            "id": "api",
            "title": "API",
            "intro": "<p>REST arayüzü <code>/v1</code> altında sürümlenir. Sözleşme kuralları ve hız sınırı politikaları (B7 §5.1), hata biçimi (§5.2) ve uç nokta kataloğu (§5.3) açıktır; kritik 20 uç noktanın istek ve yanıt örnekleri (§5.4) kapalı başlıklardadır.</p>",
            "parts": [
                src(B7, "## 5.", "### 5.1", skip_heading=True, demote=0),
                src(B7, "### 5.1", "### 5.2", demote=0),
                src(B7, "### 5.2", "### 5.3", demote=0),
                src(B7, "### 5.3", "### 5.4", demote=0),
                src(B7, "### 5.4", "## 6.", demote=0, collapse_over=700, http_json=True),
            ],
        },
        {
            "id": "gercek-zamanli",
            "title": "Gerçek zamanlı katman ve asenkron işler",
            "intro": "<p>Dünya ve sohbet SignalR hub'ları üzerinden akar; sahne başına shard modeli ve ölçekleme diyagramı B7 §15.7'den çizildi. Asenkron işler ve kuyruklar (B7 §7) bölümün sonundadır.</p>",
            "js": JS_ALL["shard"],
            "parts": [
                src(B7, "## 6.", "### 6.7", skip_heading=True, demote=0),
                {"html": '<h3 id="shard-diyagrami">Shard ölçekleme diyagramı</h3>' + FIG["shard"]},
                src(B7, "### 6.7", "### 6.8", demote=0),
                src(B7, "### 6.8", "## 7.", demote=0, top=2, collapse_over=4000),
                src(B7, "## 7.", "## 8.", demote=1, collapse_over=4500),
            ],
        },
        {
            "id": "ai-pipeline",
            "title": "Eğitim ve AI pipeline'ı",
            "intro": "<p>Puanlama bir kuyruk işidir: cevap API'ye gelir, kuyruğa girer, Haiku ön eleme yapar, Sonnet puanlar, güven düşükse Opus kör ikinci okuma yapar ve Kurul Kartı üretilir. Sıra diyagramı B7 §15.3'ten çizildi. Başlık numaraları kaynak belgeye aittir: 5, 6, 7 ve 11 B3'ten, 10 B7'den.</p>",
            "html_before": FIG["ai"],
            "js": JS_ALL["ai"],
            "sources": [
                src(B3, "## 5.", "## 6.", collapse_over=4500),
                src(B3, "## 6.", "## 7.", collapse_over=4000),
                src(B3, "## 7.", "## 8.", collapse_over=4000),
                src(B7, "## 10.", "## 11.", collapse_over=4000),
                src(B3, "## 11.", "## 12."),
            ],
        },
        {
            "id": "sandbox",
            "title": "Kod çalıştırma sandbox'ı",
            "intro": "<p>Oyuncu kodu yalnızca sandbox bölgesinde, gVisor içinde ve ağsız çalışır. Mimari diyagramı B7 §15.4'ten çizildi; tehdit modeli, limitler, test runner protokolü, harness ve savunmalar B7 §8'den, Challenge Spec formatı B5 §1'den gelir.</p>",
            "html_before": FIG["sandbox"],
            "js": JS_ALL["sandbox"],
            "parts": [
                src(B7, "## 8.", "### 8.1", skip_heading=True, demote=0),
                src(B7, "### 8.1", "## 9.", demote=0, collapse_over=6000),
                src(B5, "## 1.", "## 2.", collapse_over=3500),
            ],
        },
        {
            "id": "simulasyon",
            "title": "İşletme simülasyonu ve ekonomi defteri",
            "intro": "<p>İşletme geliri deterministik tohumla üretilen günlük sentetik trafikten hesaplanır ve çift kayıtlı defter üzerinden yazılır. Bölüm trafik üretimini, referans çözüm tavanını, kasa ve hasadı, hesap planını ve işlem türlerini, denetimi anlatır; C# işlem örneği kapalıdır.</p>",
            "sources": [src(B7, "## 9.", "## 10.", skip_heading=True, demote=0, collapse=["### 9.7"])],
        },
        {
            "id": "kimlik",
            "title": "Kimlik, güvenlik ve KVKK",
            "intro": "<p>Giriş telefon OTP ile yapılır; yaş kapısı 15 yaş altını reddeder, 15–17 yaş için veli onayı ister. OTP akışı diyagramı B7 §15.5'ten çizildi; sağlayıcılar, SMS-pumping savunması, JWT, KVKK envanteri ve OWASP kontrol listesi B7 §11'den aynen gelir.</p>",
            "html_before": FIG["otp"],
            "js": JS_ALL["otp"],
            "sources": [src(B7, "## 11.", "## 12.", skip_heading=True, demote=0, collapse_over=5000)],
        },
        {
            "id": "istemci",
            "title": "İstemci mimarisi ve istemci–sunucu sözleşmesi",
            "intro": "<p>İstemci bir PWA'dır: React arayüzü ile PixiJS oyun sahnesi bir köprüyle konuşur. Katman diyagramı B8 §1.3'teki düğüm ve kenar tablolarından çizildi; teknoloji, render, çevrimdışı çalışma ve performans izleme B8'den, istemci–sunucu sözleşmesi B7 §12'den alınmıştır. Başlık numaraları kaynak belgeye aittir.</p>",
            "js": JS_ALL["istemci"],
            "parts": [
                src(B8, "## 1.", "### 1.3"),
                {"html": '<h4 id="istemci-katmanlari">İstemci katman diyagramı</h4>' + FIG["istemci"]},
                {"md": strip_ascii(M.extract(B8, "### 1.3", "### 1.4")), "demote": 1, "id_prefix": "b8-"},
                src(B8, "### 1.4", "## 2.", demote=1, collapse_over=4500),
                src(B8, "## 2.", "## 3.", collapse_over=3000),
                src(B8, "## 15.", "## 16."),
                src(B8, "## 16.", "## 17."),
                src(B7, "## 12.", "## 13.", collapse_over=4000),
            ],
        },
        {
            "id": "altyapi",
            "title": "Altyapı ve DevOps",
            "intro": "<p>Ortamlar, Kubernetes topolojisi, CI/CD, gözlemlenebilirlik, yedekleme ve maliyet tahmini B7 §13'tür; Kubernetes ve CI/CD diyagramları B7 §15.6 ve §15.8'den çizildi.</p>",
            "js": JS_ALL["k8s"] + "\n" + JS_ALL["cicd"],
            "parts": [
                src(B7, "## 13.", "### 13.2", skip_heading=True, demote=0),
                src(B7, "### 13.2", "### 13.3", demote=0),
                {"html": '<h3 id="k8s-diyagrami">Kubernetes topolojisi diyagramı</h3>' + FIG["k8s"]},
                src(B7, "### 13.3", "### 13.4", demote=0),
                {"html": '<h3 id="cicd-diyagrami">CI/CD diyagramı</h3>' + FIG["cicd"]},
                src(B7, "### 13.4", "## 14.", demote=0),
            ],
        },
        {
            "id": "monorepo",
            "title": "Monorepo, standartlar ve test",
            "intro": "<p>Monorepo ağacı, çözüm ve proje listesi, kodlama standartları, test stratejisi, tanım-bitti ölçütleri ve dallanma kuralları B7 §14'tür.</p>",
            "sources": [src(B7, "## 14.", "### 14.7", skip_heading=True, demote=0)],
        },
        {
            "id": "yol-haritasi",
            "title": "Teknik yol haritası, riskler ve açık sorular",
            "intro": "<p>İlk altı sprintin teknik epikleri B7 §14.7'den, teknik riskler B9 §10 risk kaydından süzüldü (renk noktası önemi gösterir; skor olasılık × etki). Sayfa kaynak belgeler, varsayımlar ve açık sorularla biter.</p>",
            "parts": [
                src(B7, "### 14.7", "## 15.", demote=0),
                {"html": '<h3 id="teknik-riskler">Teknik riskler (B9 §10)</h3><p>25 riskin teknik olanları; tam kayıt B9 §10\'dadır.</p>' + risk_html()},
                {"html": KAYNAKLAR},
                src(B7, "## 16.", "## 17."),
                src(B7, "## 17.", "## 18."),
            ],
        },
    ],
}
print(f"teknik.py: {N_DIAG} diyagram, {len(PAGE['sections'])} bölüm, {len(WARNS)} uyarı", file=sys.stderr)
