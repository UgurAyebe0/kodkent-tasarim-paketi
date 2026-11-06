#!/usr/bin/env python3
"""spec/B4-mufredat.md §3 ders tablolarını (M1–M11) ve Görev Atlası'nı ayrıştırıp
build/proto/core/22-data-dersler-liste.js üretir (const D_dersListe = [...]).

Kullanım: python tools/proto_extract_dersler.py [--out YOL]

- Markdown tablo -> JS dizisi; hücre metinleri LLM ile yeniden yazılmaz, olduğu gibi alınır.
- Her ders `durum:'kilitli'` iskeletidir; Çarşı 1.1–1.4'ün TAM içeriği core/20-data-dersler.js'te durur ve
  core/99-export.js bu iskeletle birleştirir (tam içerik kazanır).
- İskelet derslerin `sorular` alanı, yükleme sırasında tablodaki soru tipi karışımından ve öğrenme hedeflerinden
  TÜRETİLİR (iskelet:true; ornekIyiCevap/zayifCevap boş). Böylece her ders yapısal olarak geçerli kalır; içerik yazılmış sayılmaz.
"""
import argparse
import json
import pathlib
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "spec" / "B4-mufredat.md"

SEMT = {"çarşı": "carsi", "liman": "liman", "atölyeler": "atolyeler", "kampüs": "kampus",
        "finans bölgesi": "finans-bolgesi", "veri vadisi": "veri-vadisi", "bulut tepesi": "bulut-tepesi"}
MODUL_SEMT = {"M1": "carsi", "M2": "liman", "M3": "atolyeler", "M4": "kampus", "M5": "kampus", "M6": "finans-bolgesi",
              "M7": "finans-bolgesi", "M8": "veri-vadisi", "M9": "veri-vadisi", "M10": "bulut-tepesi", "M11": "bulut-tepesi"}
TIP = {"K": "Kavram Sorusu", "Ç": "Çıktı Tahmini", "H": "Hata Avı", "Y": "Kod Yazma"}
SPLIT = re.compile(r"(?<!\\)\|")

JS_YARDIMCI = r"""
const D_RUBRIK_VARSAYILAN = [{ ad: 'Doğruluk', agirlik: 50 }, { ad: 'Tamlık', agirlik: 30 }, { ad: 'Açıklık', agirlik: 20 }];
/** İskelet ders için soru iskeleti: tablodaki soru tipi karışımı + öğrenme hedefleri (içerik YAZILMADI; iskelet:true). */
function D_iskeletSorular(d) {
  const anah = [];
  d.hedefler.forEach(function (h) { (h.match(/`[^`]+`/g) || []).forEach(function (t) { t = t.slice(1, -1).trim(); if (t && anah.indexOf(t) < 0 && t.length <= 40) anah.push(t); }); });
  const keys = anah.slice(0, 6).length ? anah.slice(0, 6) : [d.baslik];
  return d.soruTipleri.map(function (tip, i) {
    const h = d.hedefler.length ? d.hedefler[i % d.hedefler.length] : d.baslik;
    const metin = tip === 'Kavram Sorusu' ? 'Kendi cümlelerinle anlat: ' + h + '.'
      : tip === 'Çıktı Tahmini' ? 'Bu ders açılınca Usta bir kod parçası verecek; çıktısını tahmin edip nedenini yazacaksın. Hedef: ' + h + '.'
      : tip === 'Hata Avı' ? 'Bu ders açılınca Usta hatalı bir kod verecek; hatayı bulup düzelteceksin. Hedef: ' + h + '.'
      : 'Bu ders açılınca Usta kısa bir kod yazdıracak. Hedef: ' + h + '.';
    return { id: d.id + '-s' + (i + 1), tip: tip, metin: metin, rubrik: D_RUBRIK_VARSAYILAN.map(function (r) { return { ad: r.ad, agirlik: r.agirlik }; }),
      anahtarlar: keys.slice(), ornekIyiCevap: '', zayifCevap: '', xpTaban: 30, iskelet: true };
  });
}
D_dersListe.forEach(function (d) { d.sorular = D_iskeletSorular(d); });
"""


def hucreler(satir):
    parca = SPLIT.split(satir.strip())
    if parca and parca[0].strip() == "":
        parca = parca[1:]
    if parca and parca[-1].strip() == "":
        parca = parca[:-1]
    return [p.replace("\\|", "|").strip() for p in parca]


def sayi(s, varsayilan=0):
    m = re.search(r"\d+", s or "")
    return int(m.group(0)) if m else varsayilan


def hedef_listesi(h):
    parcalar = re.split(r"\(\d+\)\s*", h)
    return [re.sub(r"[;.\s]+$", "", p).strip() for p in parcalar if p.strip()]


def on_kosul(s):
    s = (s or "").strip()
    if s in ("", "—", "-"):
        return []
    return [re.sub(r"^Ders\s+", "", p.strip()) for p in re.split(r"[,;]", s) if p.strip()]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "build" / "proto" / "core" / "22-data-dersler-liste.js"))
    a = ap.parse_args()
    satirlar = SRC.read_text(encoding="utf-8").splitlines()

    # Görev Atlası: | Ders | Görev | Tip | XP | Bayt | Ruhsat |
    gorev = {}
    gi = next((i for i, s in enumerate(satirlar) if s.startswith("### Görev Atlası")), None)
    if gi is not None:
        for s in satirlar[gi:gi + 45]:
            if s.startswith("|") and re.match(r"\|\s*\d+\.\d+\s*\|", s):
                c = hucreler(s)
                if len(c) >= 6:
                    gorev[c[0]] = {"gorevAd": c[1], "gorevTip": c[2], "gorevXp": sayi(c[3]), "gorevBayt": sayi(c[4]), "ruhsatNotu": c[5]}

    dersler = []
    modul = None
    for s in satirlar:
        m = re.match(r"###\s+(M\d+)\s+—", s)
        if m:
            modul = m.group(1)
            continue
        if modul and s.startswith("|") and re.match(r"\|\s*\d+\.\d+\s*\|", s):
            c = hucreler(s)
            if len(c) < 10:
                continue
            ders_id, baslik, hed, on, semt, tier, xp, dk, karisim, bagli = c[:10]
            d = {"id": ders_id, "modul": modul, "baslik": baslik, "semt": SEMT.get(semt.lower(), MODUL_SEMT[modul]),
                 "tier": sayi(tier, 1), "xp": sayi(xp), "dk": sayi(dk), "hedefler": hedef_listesi(hed), "durum": "kilitli",
                 "onKosul": on_kosul(on), "soruTipleri": [TIP[h.strip()] for h in karisim.split(",") if h.strip() in TIP],
                 "bagliIsletme": bagli, "iskelet": True}
            d.update(gorev.get(ders_id, {}))
            dersler.append(d)

    dersler.sort(key=lambda d: tuple(int(x) for x in d["id"].split(".")))
    ids = [d["id"] for d in dersler]
    assert len(ids) == len(set(ids)), "tekrarlayan ders kimliği"

    govde = ",\n".join("  " + json.dumps(d, ensure_ascii=False, separators=(", ", ": ")) for d in dersler)
    cikti = ("/* ==== core/22-data-dersler-liste.js — OTOMATİK ÜRETİM (tools/proto_extract_dersler.py; kaynak: spec/B4-mufredat.md §3 tabloları) ====\n"
             "   100 dersin iskeleti (id, modul, baslik, semt, tier, xp, dk, hedefler, durum:'kilitli'). Çarşı 1.1–1.4 TAM içeriği 20-data-dersler.js'tedir; birleştirme 99-export.js'te. */\n"
             "const D_dersListe = [\n" + govde + "\n];\n" + JS_YARDIMCI)
    out = pathlib.Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(cikti, encoding="utf-8")
    per = {}
    for d in dersler:
        per[d["modul"]] = per.get(d["modul"], 0) + 1
    print(f"yazıldı: {out} — {len(dersler)} ders, {out.stat().st_size} bayt, modül başına: {per}, görev eşlemesi: {len(gorev)}")


if __name__ == "__main__":
    main()
