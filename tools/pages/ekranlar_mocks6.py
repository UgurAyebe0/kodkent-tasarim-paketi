"""Ekranlar sayfası: 6 yüksek sadakatli mockup (B8 §8 içerik paketindeki GERÇEK metin ve sayılarla; prototip bileşen sınıfları, `.mock` kapsamı).

build_mockups(mk) -> {token: html}; mk = ekranlar_mock modülü (yardımcılar). Cihaz çerçevesi 1280×800 (masaüstü) ve 390×844 (telefon); ekrana sığdırma JS ile ölçeklenir.
"""
import re

from ekranlar_data import M, esc, B8, tbl, avatar_svg, usta_svg, prop_svg, AVATARS


def build_mockups(mk):
    I, cubuk, halka, sayac, chip, btn, durum, bubble, bust, pos, frame, figure = (mk.I, mk.cubuk, mk.halka, mk.sayac, mk.chip, mk.btn, mk.durum, mk.bubble, mk.bust, mk.pos, mk.frame, mk.figure)
    kodblok, test_row, stage = mk.kodblok, mk.test_row, mk.stage
    out = {}

    def sec(a, b):
        return M.extract(B8, a, b)

    def code_of(sec_text, lang="csharp"):
        c = re.search(r"```" + lang + r"\n(.*?)```", sec_text, re.S).group(1)
        return "\n".join(re.sub(r"^\s*\d+\s{1,2}", "", l, count=1) for l in c.rstrip("\n").split("\n"))

    def abs_box(x, y, w, h, inner, cls="ab-card", extra=""):
        return f'<div class="{cls}" {pos(x, y, w, h, "position:absolute;" + extra)}>{inner}</div>'

    def hud_btn(ic, label, badge=None, dot=False, size=44):
        b = f'<span class="hud-rozet">{badge}</span>' if badge else ""
        d = '<span class="nokta" style="position:absolute;top:-3px;right:-3px;border:2px solid #0F1730"></span>' if dot else ""
        return f'<button type="button" class="hud-btn" style="width:{size}px;height:{size}px" aria-label="{esc(label)}">{I(ic, 24)}{b}{d}</button>'

    def ring(pct, size=56, sev="7"):
        C = 2 * 3.14159265 * 23
        return (f'<span class="hud-avatar" style="display:block;width:{size}px;height:{size}px"><svg class="hud-halka" viewBox="0 0 52 52" aria-hidden="true"><circle class="halka-iz" cx="26" cy="26" r="23" fill="none" stroke-width="5"/>'
                f'<circle class="halka-dolgu" cx="26" cy="26" r="23" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="{C:.2f}" stroke-dashoffset="{C * (1 - pct / 100):.2f}"/></svg>'
                f'<span class="hud-av">{bust("zeynep", 40)}</span><b class="hud-sev">{sev}</b></span>')

    # ============================================================ 1. Derleyici Meydanı (HUD ile) — M-G9
    def iso_block(x, y, w, d, h, top, left, right):
        P = lambda a, b, z: f"{x + (a - b) * 32:.0f},{y + (a + b) * 16 - z:.0f}"  # noqa: E731
        return (f'<polygon points="{P(0, 0, h)} {P(w, 0, h)} {P(w, d, h)} {P(0, d, h)}" fill="{top}"/>'
                f'<polygon points="{P(0, d, h)} {P(w, d, h)} {P(w, d, 0)} {P(0, d, 0)}" fill="{left}"/>'
                f'<polygon points="{P(w, 0, h)} {P(w, d, h)} {P(w, d, 0)} {P(w, 0, 0)}" fill="{right}"/>')

    def meydan_scene(u="mkm-d"):
        parts = [f'<svg class="abs" style="left:0;top:0" width="1280" height="800" viewBox="0 0 1280 800" aria-hidden="true"><defs>'
                 f'<pattern id="{u}-t" width="64" height="32" patternUnits="userSpaceOnUse"><rect width="64" height="32" fill="#CDBF98"/><polygon points="32,0 64,16 32,32 0,16" fill="#D9C9A3" stroke="#BFAF86" stroke-width="1"/></pattern>'
                 f'<linearGradient id="{u}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1230"/><stop offset="1" stop-color="#1D2B5C"/></linearGradient></defs>'
                 f'<rect width="1280" height="800" fill="url(#{u}-s)"/>'
                 '<polygon points="300,98 640,40 980,98" fill="#B9722A"/><rect x="330" y="98" width="620" height="126" fill="#E4D6B2"/><rect x="330" y="210" width="620" height="14" fill="#B9A878"/>'
                 '<rect x="598" y="150" width="84" height="74" rx="6" fill="#4A3B22"/><g fill="#6B8FB5"><rect x="352" y="160" width="40" height="40" rx="4"/><rect x="420" y="160" width="40" height="40" rx="4"/><rect x="820" y="160" width="40" height="40" rx="4"/><rect x="888" y="160" width="40" height="40" rx="4"/></g>'
                 f'<rect y="224" width="1280" height="576" fill="url(#{u}-t)"/>']
        parts.append(iso_block(150, 270, 3, 3, 70, "#E8912D", "#B9722A", "#8F591F"))     # Meydan Otoparki
        parts.append(iso_block(1060, 340, 3, 2, 60, "#C8453A", "#9E362D", "#7A2923"))     # Pazar tentesi
        parts.append('<ellipse cx="420" cy="520" rx="92" ry="46" fill="#BFAF86"/><ellipse cx="420" cy="516" rx="78" ry="38" fill="#4FA3D1"/><ellipse cx="420" cy="510" rx="30" ry="14" fill="#7FC4E8"/>')  # cesme
        parts.append('<rect x="1120" y="600" width="96" height="14" rx="4" fill="#26325A"/><rect x="1130" y="560" width="6" height="40" fill="#9AA7C7"/><rect x="1196" y="560" width="6" height="40" fill="#9AA7C7"/><rect x="1124" y="548" width="84" height="16" rx="5" fill="#FFBE3D"/>')  # tramvay duragi
        parts.append('<polyline points="640,402 700,450 800,510 930,580 1100,606" fill="none" stroke="#FFBE3D" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>')  # hedef isaretcisi
        parts.append('<rect width="1280" height="800" fill="#F2B134" opacity=".18"/></svg>')
        return "".join(parts)

    def player(x, y, av, name, rank, color="#FFBE3D", hue=0, h=84):
        flt = f"filter:hue-rotate({hue}deg);" if hue else ""
        return (f'<div class="pl" style="left:{x}px;top:{y}px"><span style="{flt}display:block">{avatar_svg(av, h)}</span><span class="ad"><i style="background:{color}"></i>{esc(name)}</span><small style="font:700 10.5px var(--font-body);color:#fff;opacity:.85;text-shadow:0 1px 2px #000">{esc(rank)}</small></div>')

    def bln(x, y, txt):
        return f'<div class="bln" style="left:{x}px;top:{y}px">{esc(txt)}</div>'

    def meydan_desktop():
        s = [meydan_scene("mkm-d")]
        s.append('<div class="led abs" style="left:360px;top:108px;width:560px" role="marquee" aria-label="LED pano, 6 mesaj, 8 saniyelik döngü: Yeni işletme: @mert.k\'nin Büfesi, Çarşı; Meydan Sorusu en hızlı 3; En çok alkışlanan işletme; Lig kapanışına 5 gün 1 saat; Yeni tapu: @ela_c; @deniz07: Merhaba KodKent!">'
                 'Yeni işletme: @mert.k\'nin Büfesi — Çarşı</div>')
        s.append('<div class="abs" style="left:100px;top:392px;width:230px"><div class="chip chip-amber" style="height:auto;padding:4px 10px;white-space:normal">@nil_cs\'nin Otoparkı · Çırak Sev. 5 · AÇIK</div></div>')
        s.append('<div class="abs" style="left:150px;top:486px"><span class="chip chip-kobalt">' + I("saat", 14) + 'Çeşme: sonraki Meydan Sorusu 20 dk sonra</span></div>')
        for x, y, av, n, r, hue in [(450, 396, "can", "@berk_34", "Kalfa · Sev. 9", 0), (990, 440, "ayse", "@ayse_kod", "Kalfa · Sev. 8", 0), (860, 570, "mert", "@mert.k", "Kalfa · Sev. 8", 0),
                                    (470, 300, "elif", "@ela_c", "Çırak · Sev. 3", 0), (880, 292, "can", "@kaan", "Çırak · Sev. 4", 150), (1040, 540, "deniz", "@deniz07", "Çırak · Sev. 5", 0),
                                    (520, 580, "elif", "@nil_cs", "Çırak · Sev. 5", 120)]:
            s.append(player(x, y, av, n, r, hue=hue))
        s.append(player(640, 420, "zeynep", "@zeynep_cs", "Kalfa · Sev. 7", "#22C9CE"))
        s.append('<div class="pl" style="left:716px;top:470px"><span class="portre" style="border-radius:50%;overflow:hidden;border:3px solid #FFBE3D;background:#1D2746">' + usta_svg("defne", 56) + '</span><span class="ad"><i style="background:#FFBE3D"></i>Usta Defne</span></div>')
        s.append(bln(850, 356, "Çarşı Sınavı'nı geçtin, Zeynep. Liman'da Usta Kerem seni bekliyor."))
        s.append(bln(870, 412, "Konteynerleri saymayı sever; hesap makinesini yanında taşır."))
        s.append(bln(860, 462, "Büfeyi açtım, uğrayın!"))
        s.append(bln(470, 196, "Kademeli Karar'da takıldım, Pusula'ya bakmak lazım."))
        s.append(bln(880, 188, "Meydan Sorusuna kim katılıyor?"))
        s.append(bln(640, 322, "Ben! Selam herkese."))
        s.append('<div class="ab-card" style="left:1070px;top:256px;width:170px;padding:8px 10px;font:700 12.5px/1.3 var(--font-body)">' + I("tramvay", 18) + ' Tramvayla 1 durak: Liman</div>')
        # --- HUD (B8 §5 ölçüleri) ---
        s.append(abs_box(16, 12, 288, 64, '<span style="position:absolute;left:8px;top:4px">' + ring(42, 56, "7") + '</span><span class="hud-ad" style="position:absolute;left:72px;top:4px;font-size:15px">@zeynep_cs</span>'
                         '<span class="hud-unvan" style="position:absolute;left:72px;top:24px">Kalfa · Sev. 7</span><span style="position:absolute;left:72px;top:46px;width:208px">' + cubuk(42, "xp", False, "Seviye 7 ilerlemesi: 465 / 1.110 XP") + "</span>", extra="padding:0"))
        s.append(abs_box(316, 12, 108, 30, sayac("bayt", "1.240", True), "abs"))
        s.append(abs_box(316, 46, 108, 30, sayac("cip", "10", True), "abs"))
        s.append(abs_box(440, 12, 500, 44, I("hedef", 22) + '<b style="font:600 14px var(--font-display);white-space:nowrap">Hedef: Kargo Deposu</b>'
                         '<span class="chip chip-amber">1.240 / 1.500 B</span><span class="chip chip-gri">Ruhsat 2/3</span><span class="chip chip-nane">' + I("tik", 14) + "Sev. 6</span>",
                         extra="display:flex;align-items:center;gap:8px;padding:0 12px;border-radius:14px"))
        s.append(abs_box(960, 12, 304, 44, "".join([hud_btn("zil", "Bildirim: 3", "3"), hud_btn("gorev", "Görev", dot=True), hud_btn("pazar", "Pazar: yeni raf", dot=True), hud_btn("kupa", "Liderlik"),
                                                    hud_btn("sohbet", "Sohbet: 2 okunmamış", "2"), hud_btn("disli", "Ayarlar")]), "abs", "display:flex;gap:8px"))
        s.append(abs_box(984, 68, 280, 136,
                         '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">' + I("gorev", 16) + '<b style="font:600 16px/1.1 var(--font-display)">Depo Sayımı</b><span class="chip chip-mor" style="margin-left:auto;height:20px">Sıfırdan</span></div>'
                         '<div style="font:700 11.5px var(--font-body);color:var(--muted)">Ders 2.3 · foreach ve Envanter Sayımı</div>'
                         '<div style="font:600 12.5px/1.3 var(--font-body);margin:3px 0">Kargo Deposu\'nun raf sayımını <code class="kod-ic">foreach</code> ile yaz: toplam, sayım ve en büyük.</div>'
                         '<div style="display:flex;gap:5px;flex-wrap:wrap"><span class="chip chip-kobalt" style="height:20px">+60 XP</span><span class="chip chip-amber" style="height:20px">+80 B</span><span class="chip chip-amber" style="height:20px">Ruhsat 3/3 → +100 B</span></div>'
                         '<button type="button" class="btn btn-birincil btn-kucuk" style="position:absolute;right:8px;bottom:6px;min-height:30px;padding:2px 12px">Git</button>',
                         extra="padding:8px 10px;border-radius:14px"))
        s.append(abs_box(16, 624, 336, 160, '<div class="yigin-s" style="gap:6px;padding:8px 10px 0"><div class="balon" style="font-size:12.5px;padding:5px 10px"><b>@ela_c</b> Kademeli Karar\'da takıldım, Pusula\'ya bakmak lazım.</div>'
                         '<div class="balon" style="font-size:12.5px;padding:5px 10px"><b>@kaan</b> Meydan Sorusuna kim katılıyor?</div><div class="balon balon-ben" style="font-size:12.5px;padding:5px 10px"><b>@zeynep_cs</b> Ben! Selam herkese.</div></div>'
                         '<div class="girdi" style="position:absolute;left:0;right:0;bottom:0;height:40px;min-height:40px;border-radius:0 0 16px 16px;padding:8px 12px;color:var(--muted);font-size:13.5px">Meydan\'a yaz…</div>', "ab-card", "background:rgba(16,24,51,.82)"))
        s.append(abs_box(1032, 720, 232, 64, btn("Gir: Akademi", "btn-birincil", "akademi", ' style="width:160px;min-height:48px;padding:6px 10px"') + '<button type="button" class="btn btn-ikon" style="width:56px;min-height:56px" aria-label="Emote çarkı, yuva 2: Alkışla">' + I("kutlama", 26) + "</button>", "abs", "display:flex;gap:16px;align-items:center"))
        dock = "".join(f'<div style="width:92px;height:56px;display:grid;justify-items:center;align-content:center;gap:1px;position:relative;border-radius:14px;background:linear-gradient(180deg,#26325A,#1D2746);border:2px solid #36446E;box-shadow:0 3px 0 rgba(4,7,16,.6)" role="img" aria-label="{esc(lb)}">{I(ic, 22)}'
                       f'<span style="font:800 13px/1 var(--font-body)">{esc(lb2)}</span>{"<span class=nokta style=position:absolute;top:2px;right:8px></span>" if dot else ""}</div>'
                       for ic, lb, lb2, dot in [("akademi", "Akademi", "Akademi", 0), ("harita", "Harita", "Harita", 0), ("bina", "İşletmelerim: Müfettiş dosyası 1", "İşletmelerim", 1), ("yenile", "Günlük Tekrar: hazır, seri 4 gün", "G. Tekrar", 1), ("ev", "Oda", "Oda", 0)])
        s.append(abs_box(392, 716, 496, 68, dock, "abs", "display:flex;gap:9px;align-items:center"))
        s.append('<span class="mx-flag abs" style="left:16px;top:86px">' + I("saat", 14) + 'Akşam · Salı 19:40</span>')
        return "".join(s)

    def hud_phone():
        s = [meydan_scene("mkm-p").replace('width="1280" height="800" viewBox="0 0 1280 800"', 'width="390" height="844" viewBox="445 0 390 844" preserveAspectRatio="xMidYMid slice"')]
        s.append(player(195, 470, "zeynep", "@zeynep_cs", "Kalfa · Sev. 7", "#22C9CE", h=96))
        s.append(player(90, 520, "mert", "@mert.k", "Kalfa · Sev. 8", h=76))
        s.append(player(300, 410, "ayse", "@ayse_kod", "Kalfa · Sev. 8", h=76))
        s.append(bln(195, 380, "Ben! Selam herkese."))
        s.append(abs_box(8, 8, 374, 48, '<span style="position:absolute;left:0;top:-2px">' + ring(42, 48, "7") + '</span><span class="hud-ad" style="position:absolute;left:56px;top:6px;font-size:14px">@zeynep_cs</span>'
                         '<span style="position:absolute;left:56px;top:30px;width:138px">' + cubuk(42, "xp", True, "Seviye 7 ilerlemesi") + '</span><span style="position:absolute;right:8px;top:4px;display:flex;gap:6px">' + sayac("bayt", "1.240", True) + sayac("cip", "10", True) + "</span>", extra="padding:0;border-radius:14px"))
        s.append(abs_box(8, 60, 374, 36, I("hedef", 18) + '<span style="font:700 12.5px var(--font-body)">Hedef: Kargo Deposu</span><span class="chip chip-amber" style="height:20px;font-size:11px">1.240 / 1.500 B</span><span class="chip chip-gri" style="height:20px;font-size:11px">Ruhsat 2/3</span>',
                         extra="display:flex;align-items:center;gap:6px;padding:0 8px;border-radius:12px"))
        s.append(abs_box(8, 100, 326, 44, I("gorev", 18) + '<b style="font:600 14px var(--font-display)">Depo Sayımı</b><span class="chip chip-kobalt" style="height:20px;font-size:11px">+60 XP</span><span class="chip chip-amber" style="height:20px;font-size:11px">+80 B</span>', extra="display:flex;align-items:center;gap:6px;padding:0 10px;border-radius:12px"))
        s.append(abs_box(338, 100, 44, 44, hud_btn("zil", "Bildirim: 3", "3"), "abs"))
        s.append(abs_box(8, 648, 246, 52, '<div class="balon" style="font-size:12px;padding:5px 10px;margin:6px"><b>@zeynep_cs</b> Ben! Selam herkese.</div>', "ab-card", "background:rgba(16,24,51,.85)"))
        s.append(abs_box(8, 708, 374, 56, btn("Gir: Akademi", "btn-birincil", "akademi", ' style="width:160px;min-height:48px"') + '<button type="button" class="btn btn-ikon" style="width:56px;min-height:56px" aria-label="Emote çarkı">' + I("kutlama", 26) + "</button>", "abs", "display:flex;gap:16px;align-items:center;justify-content:space-between"))
        dock = "".join(f'<div style="width:78px;height:56px;display:grid;justify-items:center;align-content:center;gap:1px;position:relative;border-radius:12px;background:linear-gradient(180deg,#26325A,#1D2746);border:2px solid #36446E">{I(ic, 22)}<span style="font:800 11px/1 var(--font-body)">{lb}</span>{"<span class=nokta style=position:absolute;top:2px;right:8px></span>" if dot else ""}</div>'
                       for ic, lb, dot in [("akademi", "Akademi", 0), ("harita", "Harita", 0), ("bina", "İşletmelerim", 1), ("yenile", "Tekrar", 1), ("menu", "Menü", 0)])
        s.append(abs_box(0, 772, 390, 72, dock, "abs", "display:flex;gap:6px;justify-content:center;align-items:center;background:linear-gradient(180deg,#131C38,#0F1730);border-top:2px solid #36446E"))
        return "".join(s)

    cap = ('<b>Derleyici Meydanı · M-G9 (Gün 9, Salı 10 Kasım 2026, 19:40, Akşam fazı).</b> HUD bölgeleri B8 §5 ölçüleriyle yerleştirilmiştir; sahnedeki oyuncular, LED pano mesajları, balonlar ve '
           'Usta Defne\'nin iki parçalı balonu B8 §8.2\'dendir. Sağda aynı HUD\'un telefon düzeni (390×844): kimlik ve para pilleri, hedef çubuğu, görev çipi ve alt dock.')
    out["meydan"] = figure("meydan", frame("meydan", 1280, 800, meydan_desktop(), "Derleyici Meydanı + HUD") + frame("meydan", 390, 844, hud_phone(), "Derleyici Meydanı (telefon)", mobile=True), cap, "m-meydan")

    # ============================================================ 2. Kurul Kartı — M-14
    def kurul():
        s = ['<div class="abs" style="inset:0;background:linear-gradient(180deg,#0B1230,#16204A)"></div><div class="abs" style="left:0;top:0;right:0;height:4px;background:linear-gradient(90deg,#6D8CFF 7%,#26325A 7%)" role="progressbar" aria-valuenow="85" aria-valuemax="200" aria-label="Seviye 2 ilerlemesi: 5 / 200 XP"></div>']
        s.append('<div class="abs" style="left:24px;top:20px">' + btn("Geri", "btn-hayalet btn-kucuk", "ok-sol") + '</div>')
        s.append(abs_box(110, 20, 1060, 48, '<b style="font:600 18px var(--font-display)">Ders 1.1 · Merhaba KodKent</b>' + chip("Soru 1/3 · Kavram Sorusu", "turkuaz") + '<span style="margin-left:auto;display:flex;align-items:center;gap:8px"><b style="font:600 15px var(--font-display);color:var(--amber-ink)">Usta Defne</b>' + '<span class="portre" style="border-radius:50%;overflow:hidden;border:2px solid #FFBE3D">' + usta_svg("defne", 36) + "</span></span>",
                         "ab-card", "display:flex;align-items:center;gap:14px;padding:0 14px;border-radius:14px"))
        # sol: soru + rubrik + cevap
        s.append(abs_box(110, 80, 560, 150, '<div class="puan-kart-etiket" style="color:var(--muted)">Soru</div><p style="font:600 20px/1.35 var(--font-display);margin:6px 0 0">'
                         '<code class="kod-ic">int yas = 17;</code> yazdın. <code class="kod-ic">yas</code> ne, <code class="kod-ic">17</code> ne, <code class="kod-ic">int</code> ne? Kendi cümlelerinle anlat.</p>', "kart", "padding:16px"))
        rub = "".join(f'<div class="kriter"><span class="kriter-ad">{n} <b class="sayi" style="color:var(--accent-ink)">{w}</b></span><span class="kriter-puan">{w}</span>{cubuk(w, t, True, n)}<span class="kriter-not">{d}</span></div>'
                       for n, w, t, d in [("Doğruluk", 50, "xp", "ad, değer, tür rolleri doğru"), ("Tamlık", 30, "cip", "üç noktanın üçü de var"), ("Açıklık", 20, "bayt", "kendi cümlelerin, düzenli")])
        s.append(abs_box(110, 242, 560, 232, '<div class="puan-kart-etiket" style="color:var(--muted);margin-bottom:8px">Rubrik: cevabından önce</div>' + rub, "kart", "padding:14px 16px"))
        s.append(abs_box(110, 486, 560, 140, '<div class="puan-kart-etiket" style="color:var(--muted)">Cevabın</div><div class="girdi" style="margin-top:6px;min-height:72px;font-size:15px;line-height:1.45;border-color:var(--line-2)">'
                         '<code class="kod-ic">yas</code> bir kutu, <code class="kod-ic">17</code> içine koyduğum değer, <code class="kod-ic">int</code> de kutunun tam sayı tutacağını söyleyen etiket.</div>'
                         '<div class="sira" style="margin-top:6px;justify-content:space-between"><span class="soluk kucuk">96 / 1.500</span><span class="chip chip-nane">' + I("tik", 14) + "Cevap gönderildi</span></div>", "kart", "padding:14px 16px"))
        hint = "".join(f'<span class="chip chip-gri chip-buyuk">{I(ic, 16)}{n}</span>' for ic, n in [("pusula", "Pusula"), ("fener", "Fener"), ("kalem", "Taslak"), ("liste", "Örnek")])
        s.append(abs_box(110, 638, 560, 82, '<div class="puan-kart-etiket" style="color:var(--muted);margin-bottom:6px">İpucu çekmecesi</div><div class="sira-s">' + hint + '<span class="chip chip-nane chip-buyuk">' + I("parlak", 16) + 'Berrak Zihin açık</span></div>', "kart", "padding:12px 16px"))
        # sağ: sonuç
        kr = "".join(f'<div class="kriter"><span class="kriter-ad">{n}</span><span class="kriter-puan">{p}/{m}</span>{cubuk(round(p / m * 100), "nane", True, n)}<span class="kriter-not">{d}</span></div>'
                      for n, p, m, d in [("Doğruluk", 45, 50, "'Kutu' benzetmen doğru."), ("Tamlık", 22, 30, "Türün neden önemli olduğu eksik."), ("Açıklık", 15, 20, "Üç terimi ayırdın ama son cümle dağınık.")])
        puan = ('<div class="puan-kart parli" style="height:100%"><div class="puan-kart-ust">' + halka(82, 88, "nane", "82", "PUAN", "Kurul puanı 82 üzerinden 100") + '<span class="muhur muhur-bas" style="width:100px;height:100px;font-size:12px">' + I("muhur", 30) + 'GEÇTİ</span>'
                '<div style="flex:1;min-width:0"><div class="puan-kart-etiket">Kurul değerlendirmesi</div><span class="chip chip-kobalt chip-buyuk" style="margin-top:6px">' + I("xp", 16) + "+25 XP</span><div class=\"soluk kucuk\" style=\"margin-top:4px\">30 × 82/100 = 25</div></div></div>"
                '<div style="margin-top:12px">' + kr + '</div></div>')
        s.append(abs_box(690, 80, 480, 324, puan, "abs"))
        s.append(abs_box(690, 416, 480, 56, '<div class="hud-xp-yazi" style="margin-bottom:5px"><span>' + I("xp", 14) + "<b>85 XP</b> · Sev. 2 (5 / 200)</span><span>Mühür: 1/3 soru geçti; 2 gerekiyor</span></div>" + cubuk(3, "xp", False, "Seviye 2 ilerlemesi: 5 / 200"), "kart", "padding:10px 14px;border-radius:14px"))
        s.append(abs_box(690, 482, 480, 140, bubble("usta", "Usta Defne", "Zeynep, 'kutu' benzetmen çok yerinde: <code class=\"kod-ic\">yas</code> kutu, <code class=\"kod-ic\">17</code> içindeki değer.") +
                         '<div class="balon balon-usta" style="margin:6px 0 0 90px;font-size:14px">Eksik olan, <code class="kod-ic">int</code>\'in kutuya yalnızca tam sayı girebileceğini söylemesi. Sonraki kartta tam bunu göreceksin; kendi cümlenle bir örnek düşün.</div>', "abs"))
        s.append(abs_box(690, 630, 480, 96, '<div class="puan-kart-etiket" style="color:var(--amber-ink)">Usta bir şey soruyor</div><div style="font:600 14px/1.35 var(--font-body);margin:4px 0">Peki <code class="kod-ic">int</code> yerine <code class="kod-ic">string</code> yazsaydık 17 kutuya sığar mıydı?</div>'
                         '<div class="sira-s"><div class="girdi" style="min-height:34px;flex:1;padding:4px 10px;font-size:13px;color:var(--muted)">0 / 300</div>' + btn("Yanıtla", "btn-birincil btn-kucuk") + btn("Geç", "btn-hayalet btn-kucuk") + "</div>", "kart", "padding:10px 14px"))
        s.append('<div class="abs" style="left:690px;top:738px;display:flex;gap:12px">' + btn("İtiraz Et · 3/3", "btn-hayalet", "bayrak") + btn("Sonraki Soru", "btn-birincil", "ok-sag") + "</div>")
        return "".join(s)

    def kurul_level():
        return ('<div class="abs" style="inset:0;background:#0B1230"></div><div class="modal-arka" style="position:absolute"><div class="modal" role="dialog" aria-modal="true" aria-label="Seviye 2" style="width:min(100%,420px)">'
                '<div class="modal-govde"><div class="seviye-atla">' + halka(100, 120, "mor", "2", "SEVİYE", "Seviye 2") + '<span class="seviye-unvan">Seviye 2 · Çırak</span><p style="margin:0">Odan açıldı: Bloklar\'da kapını bul.</p><div class="hediye-kart">' + I("hediye", 32) + "<div><b>Hediyen: 1 emote çark yuvası.</b></div></div></div></div>"
                f'<div class="modal-alt">{btn("Devam", "btn-birincil")}</div></div></div>')

    sec83 = sec("### 8.3", "### 8.4")
    kjson = re.search(r"```json\n(.*?)```", sec83, re.S).group(1)
    kf = frame("kurul", 1280, 800, kurul(), "Kurul Kartı")
    km = frame("kurul", 520, 460, kurul_level(), "Seviye atlama modali").replace('class="devframe"', 'class="devframe" style="flex:0 1 380px"', 1)
    out["kurul"] = figure("kurul", kf + km, '<b>Kurul Kartı · M-14 (Gün 1, 14. dakika).</b> Rubrik cevap kutusunun üstünde; sonuç mühürlü kart: 82 puan, +25 XP, XP 60 → 85 ve Sev. 2. Sağdaki küçük çerçeve kart sonrası seviye atlama modalidir. '
                          'Metin ve sayılar B8 §8.3\'ten.', "m-kurul") + mk_details("Kurul yanıtı (JSON, B3 şeması; B8 §8.3 aynen)", f'<pre class="code" data-lang="json"><code>{esc(kjson)}</code></pre>')

    # ============================================================ 3. İş Emri — M-75
    def is_emri():
        s = ['<div class="abs" style="inset:0;background:linear-gradient(180deg,#0B1230,#16204A)"></div>']
        s.append(abs_box(40, 24, 1200, 52, '<b style="font:600 20px var(--font-display)">İş Emri #1 — Otopark (Çarşı)</b><span style="margin-left:auto;display:flex;gap:10px;align-items:center"><span class="chip chip-mor chip-buyuk">Sev. 4</span>'
                         '<span style="width:150px">' + cubuk(2, "xp", True, "XP çizgisi 10 / 520") + '</span><span class="soluk kucuk">10 / 520 XP</span>' + sayac("bayt", "0", True) + "</span>", "ab-card", "display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px"))
        has = ('<div class="diyalog"><div class="diyalog-portre" style="width:96px"><span class="portre">' + usta_svg("hasan", 88) + '</span><b>Hasan Abi</b></div><div class="yigin-s" style="flex:1">'
               '<div class="balon balon-usta balon-kuyruk">İş emri bu evladım. Aklına takılan olursa sor.</div>'
               '<div class="balon balon-usta" style="border-left:6px solid var(--amber);font-style:italic;font-size:15px">2 saatten az kalanlar: saati 100 TL. 2–6 saat arası: her saat 40 TL. 6–24 saat arası kalanlar: günlük 250 TL. Bunu hesaplayan bir sistem istiyorum.</div></div></div>')
        s.append(abs_box(40, 92, 400, 340, has, "kart", "padding:14px"))
        s.append(abs_box(40, 444, 400, 130, bubble("usta", "Usta Defne", "Müşteriye sormadan kod yazan, iki kere yazar, Zeynep. Hasan Abi'ye en az dört soru sor; cevapları Sözleşme Kartı'na yazılacak."), "kart", "padding:12px 14px"))
        kon = ('<div class="chat-d yigin" style="gap:8px"><div class="puan-kart-etiket" style="color:var(--muted)">Konuşma kaydı</div>'
               '<div class="balon balon-ben"><div class="balon-ad">Zeynep</div>1 saat 10 dakika kalan ne öder?</div><div class="balon balon-usta"><div class="balon-ad">Hasan Abi</div>Başlayan saat tam sayılır; 2 saatten az kaldı: 200.</div>'
               '<div class="balon balon-ben"><div class="balon-ad">Zeynep</div>Tam 2 saat kalan ne öder?</div><div class="balon balon-usta"><div class="balon-ad">Hasan Abi</div>O artık 2–6 dilimi: 2 × 40 = 80.</div>'
               '<div class="balon balon-ben"><div class="balon-ad">Zeynep</div>Girip aynı dakika çıkan ne öder?</div><div class="balon balon-usta"><div class="balon-ad">Hasan Abi</div>Ödemez. Bariyer eksi süre göndermez.</div></div>')
        s.append(abs_box(456, 92, 380, 640, kon, "kart", "padding:14px;overflow:hidden"))
        sor = ('<div class="puan-kart-etiket" style="color:var(--muted);margin-bottom:8px">Müşteriye Sor</div><div class="sira-s" style="gap:6px">'
               + "".join(f'<span class="chip chip-buyuk yz">{t} · soruldu</span>' for t in ["S1", "S2", "S5"]) + "</div><div class=\"yigin-s\" style=\"margin-top:8px;gap:5px\">"
               + "".join(f'<button type="button" class="satir satir-tikla" style="min-height:38px;padding:4px 10px"><span class="satir-baslik" style="font-size:13px">{t}</span></button>' for t in
                         ["S3 · Tam 6 saat kalan ne öder?", "S4 · 24 saati aşan ne öder?", "S6 · Süreyi nasıl göndereceksin: dakika mı, saat mı, kesirli mi?", "S7 · Ücret kuruşlu olabilir mi?", "S8 · Tam 24 saat kalan ne öder?"])
               + '</div><div class="girdi" style="margin-top:8px;min-height:36px;padding:4px 10px;font-size:13px;color:var(--muted)">Kendi sorunu yaz… <span style="float:right">0 / 140</span></div>')
        s.append(abs_box(852, 92, 388, 300, sor, "kart", "padding:12px 14px"))
        mad = [("1", "✓", "Girdi dakika cinsinden tam sayı, ≥ 0 (bariyer negatif göndermez); 0 → 0 TL", "ok"), ("2", "✓", "Dilimi ham kalış süresi belirler: dakika < 120 → 1. dilim; 120 ≤ dakika ≤ 360 → 2. dilim (sınırlar dâhil); dakika > 360 → günlük", "ok"),
               ("3", "✓", "Başlayan saat tam sayılır: saat = ceil(dakika / 60); 1. dilim saat × 100, 2. dilim saat × 40", "ok"), ("4", "", "Bu madde için müşteriye sormadın", "yz"),
               ("5", "", "public static int Otopark.UcretHesapla(int dakika) · dönüş TL, tam sayı", "yz"), ("6", "", "—", "yz")]
        mm = "".join(f'<div class="satir {c}" style="min-height:0;padding:5px 10px;font-size:12px;align-items:flex-start"><span class="sira-no" style="width:22px;height:22px;font-size:12px;{"background:var(--mint);color:#052E1B" if c == "ok" else ""}">{n}</span><span class="satir-ana" style="font-size:12px;line-height:1.3">{esc(t)}</span></div>' for n, _, t, c in mad)
        s.append(abs_box(852, 404, 388, 328, '<div class="kart-baslik" style="margin-bottom:6px">' + I("liste", 20) + 'Sözleşme Kartı</div><div class="yigin-s" style="gap:4px">' + mm + "</div>", "kart", "padding:12px 14px"))
        s.append(abs_box(40, 744, 1200, 48, '<div style="display:flex;align-items:center;gap:16px">' + btn("Kodlamaya Geç", "btn-birincil", "kilit", " disabled") + '<span class="chip chip-amber chip-buyuk">Önce Hasan Abi\'ye en az 4 soru sor (3/4).</span></div>', "abs"))
        s.append('<div class="abs" style="left:40px;top:588px;width:400px;font:600 13px/1.4 var(--font-body);color:var(--muted)"><b>Durum B (4. sorudan sonra):</b> S4 sorulur, madde 4 parlayarak yazılır (“Her başlayan gün 250.”) ve “Kodlamaya Geç” parlar.</div>')
        return "".join(s)

    out["is-emri"] = figure("is-emri", frame("is-emri", 1280, 800, is_emri(), "İş Emri"), '<b>İş Emri · M-75 (≈ 75. dakika, tapudan sonra).</b> Hasan Abi\'nin iş emri, konuşma kaydı, Müşteriye Sor paneli ve Sözleşme Kartı (3 madde yazılı); '
                            '“Kodlamaya Geç” 3/4 soruda kilitlidir. Tüm metin B8 §8.4\'ten.', "m-is-emri")

    # ============================================================ 4. İşletme Editörü — M-75 (durum A)
    def editor():
        src = code_of(sec("### 8.5", "### 8.6"))
        cls = {k: "dim" for k in (1, 2, 3, 4, 5, 6, 7, 15, 16)}
        cls.update({k: "edit" for k in range(8, 15)})
        s = ['<div class="abs" style="inset:0;background:#0B1230"></div>']
        s.append(abs_box(0, 0, 1280, 48, I("kod", 20) + '<b style="font:600 17px var(--font-display)">İş Emri #1 — Otopark (Çarşı)</b><span class="chip chip-mor">Sev. 4</span><span class="soluk kucuk">XP 10 / 520</span><span style="margin-left:auto" class="sira-s">' + sayac("bayt", "0", True) + btn("Sözleşme", "btn-hayalet btn-kucuk") + "</span>",
                         "abs", "display:flex;align-items:center;gap:12px;padding:0 16px;background:linear-gradient(180deg,#131C38,#0F1730);border-bottom:2px solid #36446E"))
        tabs = '<div class="sekmeler" style="padding:8px 10px 0;gap:6px"><span class="sekme" style="min-height:30px;padding:2px 8px;font-size:12px">Sözleşme</span><span class="sekme aktif" style="min-height:30px;padding:2px 8px;font-size:12px">Açık Testler</span><span class="sekme" style="min-height:30px;padding:2px 8px;font-size:12px">İpuçları</span><span class="sekme" style="min-height:30px;padding:2px 8px;font-size:12px">Müfettiş</span></div>'
        tests = [("gecti", "A1 · 30 dk", "beklenen <b>100</b> · gerçek <b>100</b>"), ("gecti", "A2 · 61 dk", "beklenen <b>200</b> · gerçek <b>200</b>"), ("gecti", "A3 · 120 dk", "beklenen <b>80</b> · gerçek <b>80</b>"), ("gecti", "A4 · 121 dk", "beklenen <b>120</b> · gerçek <b>120</b>"),
                 ("kaldi", "A5 · 361 dk", "beklenen <b>250</b> · gerçek <b>280</b>"), ("kaldi", "A6 · 1.441 dk", "beklenen <b>500</b> · gerçek <b>1.000</b>")]
        tl = '<div class="test-ozet" style="padding:10px 12px;font-size:16px">' + I("test-gecti", 22) + "4/6 geçti</div><div class=\"yigin-s\" style=\"padding:0 10px;gap:6px\">" + "".join(test_row(a, b, c).replace('class="test-satir', 'style="padding:5px 10px;gap:0 10px" class="test-satir') for a, b, c in tests) + "</div>"
        act = ('<div class="yigin-s" style="padding:10px;gap:8px">' + btn("Testleri Çalıştır", "btn-birincil btn-kucuk", "oynat") + btn("Müfettişi Çağır", "btn-kucuk", "goz", " disabled")
               + '<span class="soluk kucuk">Önce 6 açık testi geçmelisin (4/6).</span><div class="sira-s">' + btn("Sıfırla", "btn-hayalet btn-kucuk", "yenile") + '<span class="soluk kucuk">Bugün 0/10</span></div></div>')
        s.append(abs_box(0, 48, 340, 752, tabs + tl + act, "abs", "background:#101833;border-right:2px solid #26325A"))
        s.append(abs_box(340, 48, 600, 752, '<div class="kod-baslik" style="border-radius:0">Otopark.cs · satırlar 8–14 düzenlenebilir, 1–7 ve 15–16 salt okunur</div>'
                         f'<pre class="kodblok" style="border-radius:0;border:0;height:672px;padding:12px 0;font-size:14.5px;line-height:1.75">{"<code>" + mk.kod_satirlar(src, cls) + "</code>"}</pre>'
                         '<div class="soluk" style="position:absolute;left:0;right:0;bottom:0;height:32px;padding:6px 14px;font:700 12.5px var(--font-mono);background:#0C1330;border-top:2px solid #26325A">Satır 14, Sütun 31 · C# · Tab odağı taşımak için Ctrl+M</div>', "abs", "background:#0A1024"))
        hints = ('<div class="ipucu-merdiven"><div class="ipucu-basamak acik" style="margin-left:0"><span class="ipucu-ik">' + I("pusula", 22) + '</span><span class="ipucu-ad">Pusula</span><span class="chip chip-amber">açık</span>'
                 '<div class="ipucu-icerik" style="font-size:12.5px">Bu iş emrinde üç ayrı iş var: (1) dakikayı “başlayan saat”e çevirmek, (2) süreye göre tarife dilimini seçmek, (3) dilimin birim fiyatıyla çarpmak. Önce yalnızca ilkini çöz: 61 dakika kaç başlayan saattir? 120 dakika? 121 dakika?</div></div>'
                 '<div class="ipucu-basamak acik" style="margin-left:0"><span class="ipucu-ik">' + I("fener", 22) + '</span><span class="ipucu-ad">Fener</span><span class="chip chip-amber">açık</span>'
                 '<div class="ipucu-icerik" style="font-size:12.5px">Dilimi yuvarlanmış saat değil, ham dakika belirler (Sözleşme madde 2): 119 dakika hâlâ “2 saatten az”, 120 dakika artık “2–6 saat”. Başlayan saat için Ders 1.2\'deki kalıbı kullan: tam sayı bölmesinden önce bölenin bir eksiğini ekle. 24 saatten sonrası için aynı kalıp 1440 ile gerekir.</div></div>'
                 '<div class="ipucu-basamak kilitli" style="margin-left:0"><span class="ipucu-ik">' + I("kalem", 22) + '</span><span class="ipucu-ad">Taslak</span><span class="chip chip-gri">kilitli</span></div></div>')
        usta = bubble("usta", "Usta'ya sor", "Zeynep, <code class=\"kod-ic\">(dakika + 59) / 60</code> ile başlayan saati doğru saymışsın; işin zor yarısı tamam. Henüz değil: 361 ve 1.441 dakikada kodun 280 ve 1.000 TL döndürüyor, Sözleşme 250 ve 500 diyor. 6 saatten sonrası hangi kurala giriyordu? Sözleşme'nin 4. maddesine bak.")
        s.append(abs_box(940, 48, 340, 752, '<div style="padding:12px;display:grid;gap:12px;align-content:start;font-size:13.5px">' + usta + hints + "</div>", "abs", "background:#101833;border-left:2px solid #26325A;overflow:hidden"))
        return "".join(s)

    # ---- sekmeli durum şeridi (JS yoksa tüm paneller alt alta görünür)
    def tabbed(ident, label, panes):
        mk.RESERVED_IDS.extend(f"{ident}-{k}{i}" for i in range(len(panes)) for k in ("t", "p"))
        tabs = "".join(f'<button type="button" role="tab" id="{ident}-t{i}" aria-controls="{ident}-p{i}" aria-selected="{"true" if i == 0 else "false"}" tabindex="{0 if i == 0 else -1}">{esc(t)}</button>' for i, (t, _) in enumerate(panes))
        body = "".join(f'<div class="mk-pane" id="{ident}-p{i}" role="tabpanel" aria-labelledby="{ident}-t{i}">{h}</div>' for i, (_, h) in enumerate(panes))
        return f'<div class="mk-tabs" role="tablist" aria-label="{esc(label)}">{tabs}</div>{body}'

    # ---- Editör durum B (Müfettiş: 6/6 açık test, 13/14 gizli) ve durum C (26/26, Usta Yorumu): B8 §8.5 sonu + §8.6 tamamlanmış kodu
    def editor_bc(st):
        lines = code_of(sec("### 8.6", "### 8.7")).split("\n")
        if st == "B":   # B8 §8.5: 11. satır E6 hatası
            lines[10] = re.sub(r"if \(dakika <= 360\) return saat \* 40;.*$", "if (dakika < 360) return saat * 40;", lines[10])
            assert "dakika < 360" in lines[10]
        n = len(lines)
        cls = {k: "dim" for k in [1, 2, 3, 4, 5, 6, 7, n - 1, n]}
        cls.update({k: "edit" for k in range(8, n - 1)})
        src_ = "\n".join(lines)
        fix = lambda h: h.replace('class="test-satir', 'style="padding:5px 10px;gap:0 10px" class="test-satir')
        s = ['<div class="abs" style="inset:0;background:#0B1230"></div>']
        s.append(abs_box(0, 0, 1280, 48, I("kod", 20) + '<b style="font:600 17px var(--font-display)">İş Emri #1 — Otopark (Çarşı)</b><span class="chip chip-mor">Sev. 4</span><span class="soluk kucuk">XP 10 / 520</span><span style="margin-left:auto" class="sira-s">' + sayac("bayt", "0", True) + btn("Sözleşme", "btn-hayalet btn-kucuk") + "</span>",
                         "abs", "display:flex;align-items:center;gap:12px;padding:0 16px;background:linear-gradient(180deg,#131C38,#0F1730);border-bottom:2px solid #36446E"))
        tab = lambda lbl, on=False: f'<span class="sekme{" aktif" if on else ""}" style="min-height:30px;padding:2px 8px;font-size:12px">{lbl}</span>'
        tabs = '<div class="sekmeler" style="padding:8px 10px 0;gap:6px">' + tab("Sözleşme") + tab("Açık Testler", True) + tab("İpuçları") + tab("Müfettiş" + (' <span class="chip chip-amber">1</span>' if st == "B" else "")) + "</div>"
        rows_ok = [("A1 · 30 dk", 100), ("A2 · 61 dk", 200), ("A3 · 120 dk", 80), ("A4 · 121 dk", 120), ("A5 · 361 dk", 250), ("A6 · 1.441 dk", 500)]
        trs = "".join(fix(test_row("gecti", a, f"beklenen <b>{b}</b> · gerçek <b>{b}</b>")) for a, b in rows_ok)
        if st == "C":
            ozet = I("test-gecti", 22) + '26/26 geçti <span class="soluk kucuk" style="font-weight:600">6 açık · 14 gizli · 6 tohumlu</span>'
        else:
            ozet = I("test-gecti", 22) + "6/6 geçti"
        tl = '<div class="test-ozet" style="padding:10px 12px;font-size:16px">' + ozet + '</div><div class="yigin-s" style="padding:0 10px;gap:6px">' + trs + "</div>"
        glow = lambda h: '<span class="mk-glow">' + h + "</span>"
        if st == "B":
            act = ('<div class="yigin-s" style="padding:10px;gap:8px">' + btn("Testleri Çalıştır", "btn-birincil btn-kucuk", "oynat") + glow(btn("Müfettişi Çağır", "btn-birincil btn-kucuk", "goz"))
                   + '<div class="sira-s">' + btn("Sıfırla", "btn-hayalet btn-kucuk", "yenile") + '<span class="soluk kucuk">Bugün 1/10</span></div></div>')
        else:
            act = ('<div class="yigin-s" style="padding:10px;gap:8px">' + btn("Testleri Çalıştır", "btn-kucuk", "oynat") + btn("Müfettişi Çağır", "btn-kucuk", "goz")
                   + glow(btn("Savunma'ya Geç", "btn-birincil btn-kucuk", "kalkan")) + '<div class="sira-s">' + btn("Sıfırla", "btn-hayalet btn-kucuk", "yenile") + "</div></div>")
        s.append(abs_box(0, 48, 340, 752, tabs + tl + act, "abs", "background:#101833;border-right:2px solid #26325A"))
        s.append(abs_box(340, 48, 600, 752, f'<div class="kod-baslik" style="border-radius:0">Otopark.cs · satırlar 8–{n - 2} düzenlenebilir, 1–7 ve {n - 1}–{n} salt okunur</div>'
                         f'<pre class="kodblok" style="border-radius:0;border:0;height:672px;padding:12px 0;font-size:14.5px;line-height:1.75">{"<code>" + mk.kod_satirlar(src_, cls) + "</code>"}</pre>'
                         '<div class="soluk" style="position:absolute;left:0;right:0;bottom:0;height:32px;padding:6px 14px;font:700 12.5px var(--font-mono);background:#0C1330;border-top:2px solid #26325A">C# · Tab odağı taşımak için Ctrl+M</div>', "abs", "background:#0A1024"))
        if st == "B":
            panel = ('<div class="kart" style="padding:12px 14px"><div class="kart-baslik" style="margin-bottom:8px">' + I("goz", 20) + 'Müfettiş 20 test çalıştırdı</div>'
                     '<div class="sira-s" style="margin-bottom:10px">' + chip("Gizli 13/14", "mercan") + chip("Tohumlu 6/6", "nane") + "</div>"
                     + bubble("musteri", "Şikâyet", "6 saat civarı kalanlar yanlış ücret ödedi.") + '<div style="height:8px"></div>' + bubble("sistem", "Müfettiş", "Dosya bıraktım.") + "</div>"
                     + bubble("usta", "Usta'ya sor", 'Zeynep, açık testlerin hepsi yeşil; sınırı sorgulaman gerektiğini zaten biliyordun. Henüz değil: tam 6 saat kalan müşteri için Sözleşme madde 2 ne diyor? <code class="kod-ic">&lt;</code> ile <code class="kod-ic">&lt;=</code> farkını 360 ile dene.'))
        else:
            panel = ('<div class="kart" style="padding:12px 14px"><div class="sira-s" style="margin-bottom:8px">' + chip("+20 XP", "kobalt") + '<b>Usta Yorumu</b></div>'
                     + bubble("usta", "Usta Yorumu", 'Zeynep, bütün testler yeşil; <code class="kod-ic">(dakika + 59) / 60</code> kalıbını kendi başına kurman süreç olarak güzel. Eksik: 100, 40 ve 250 sayıları kodun içinde anlamsız duruyor; yarın Hasan Abi fiyatı değiştirirse hepsini aramak zorunda kalırsın. Sonraki adım: bu sayıları müşterinin sözcükleriyle adlandırılmış <code class="kod-ic">const int</code> değerlere çevir.') + "</div>")
        s.append(abs_box(940, 48, 340, 752, '<div style="padding:12px;display:grid;gap:12px;align-content:start;font-size:13.5px">' + panel + "</div>", "abs", "background:#101833;border-left:2px solid #26325A;overflow:hidden"))
        return "".join(s)

    ed_b = frame("editor", 1280, 800, editor_bc("B"), "İşletme Editörü, durum B")
    ed_c = frame("editor", 1280, 800, editor_bc("C"), "İşletme Editörü, durum C")
    out["editor"] = figure("editor", tabbed("m-editor", "İşletme Editörü durumları", [
        ("Durum A · testler çalıştı: 4/6 geçti", frame("editor", 1280, 800, editor(), "İşletme Editörü, durum A")),
        ("Durum B · 6/6 açık test, Müfettiş", ed_b), ("Durum C · 26/26, Usta Yorumu", ed_c)]),
        '<b>İşletme Editörü · M-75, üç durum (B8 §8.5).</b><span><b>A</b> devam eden çözüm: Açık Testler 4/6 geçti (A5 ve A6 kırmızı), [Müfettişi Çağır] devre dışı, Usta kartı ve ipucu merdiveni; kod satırları 8–14 düzenlenebilir. '
        '<b>B</b> Müfettiş: 11. satır <code>if (dakika &lt; 360)</code> (E6 hatası), açık testler 6/6 yeşil, [Müfettişi Çağır] parlar (Bugün 1/10); Müfettiş 20 test çalıştırdı, gizli 13/14, tohumlu 6/6, şikâyet balonu ve Usta. '
        '<b>C</b> 26/26: Usta Yorumu (+20 XP) ve [Savunma\'ya Geç] parlar. Sekmelerle durum değiştirilir; B ve C kodu B8 §8.6\'daki tamamlanmış çözümdür.</span>', "m-editor")

    # ============================================================ 5. Savunma — M-75
    def savunma():
        src = code_of(sec("### 8.6", "### 8.7"))
        s = ['<div class="abs" style="inset:0;background:#0B1230"></div>']
        s.append(abs_box(40, 24, 1200, 52, I("kalkan", 24) + '<b style="font:600 20px var(--font-display)">Savunma · İş Emri #1 — Otopark</b><span class="chip chip-nane chip-buyuk" style="margin-left:auto">' + I("test-gecti", 16) + "26/26 geçti (6 açık · 14 gizli · 6 tohumlu)</span>", "ab-card", "display:flex;align-items:center;gap:12px;padding:0 16px;border-radius:14px"))
        s.append(abs_box(40, 90, 640, 96, '<div class="diyalog"><div class="diyalog-portre" style="width:72px"><span class="portre">' + usta_svg("hasan", 64) + '</span><b>Hasan Abi</b></div><div class="balon balon-usta balon-kuyruk" style="font-size:15px">Zeynep, 121 dakika kalan müşteri neden 120 TL ödüyor? Hangi satır belirliyor, ben de bakayım.'
                         '<div style="margin-top:4px"><span class="chip chip-amber">Kurul bu satırı seçti: 11</span></div></div></div>', "kart", "padding:10px 14px"))
        s.append(abs_box(40, 198, 640, 310, kodblok(src, {11: "vurgu"}, 11, "C# kodu").replace('<pre class="kodblok"', '<pre class="kodblok" style="font-size:12.5px;line-height:1.5"', 1), "abs", "overflow:hidden"))
        rub = "".join(f'<span class="chip chip-gri" style="font-size:11.5px;padding:0 8px">{t}</span>' for t in ["Doğruluk 50 (satırı doğru anladın mı?)", "Tamlık 30 (sınır değerleri ve nedeni)", "Açıklık 20 (anlaşılır mı?)"])
        s.append(abs_box(40, 514, 640, 84, '<div class="puan-kart-etiket" style="color:var(--muted);margin-bottom:5px">Rubrik: kutunun üstünde</div><div class="sira-s">' + rub + "</div>", "abs"))
        s.append(abs_box(40, 604, 640, 28, '<span class="chip chip-kobalt" style="height:26px">' + I("kilit", 14) + "Kodun kilitli. Yapıştırma bu kutuda kapalı.</span>", "abs"))
        s.append(abs_box(40, 636, 640, 150, '<div class="girdi" style="min-height:104px;font-size:14px;line-height:1.5">121 dakika 120\'den büyük ve 360\'tan küçük olduğu için 2. dilimde. Bu dilimde ücret başlayan saat × 40. 121 dakika 2 saati bir dakika geçtiği için 3. saat başlamış sayılıyor: (121 + 59) / 60 = 3. Yani 3 × 40 = 120. Dilimi seçen koşul '
                         '<code class="kod-ic">if (dakika &lt;= 360)</code>, ücreti veren ifade <code class="kod-ic">return saat * 40;</code>.</div><div class="sira" style="margin-top:6px;justify-content:space-between"><span class="soluk kucuk">294 / 1.500</span>' + btn("Cevabı Gönder", "btn-birincil btn-kucuk") + "</div>", "abs"))
        kr = "".join(f'<div class="kriter"><span class="kriter-ad">{n}</span><span class="kriter-puan">{p}/{m}</span>{cubuk(round(p / m * 100), "nane", True, n)}<span class="kriter-not">{d}</span></div>'
                      for n, p, m, d in [("Doğruluk", 48, 50, "Dilimi ve hesabı doğru izledin."), ("Tamlık", 28, 30, "Dilim koşulu, yuvarlama ve çarpım var; 10. satırın neden 11. satıra yol verdiği eksik."), ("Açıklık", 18, 20, "Adım adım ve kendi cümlelerinle.")])
        s.append(abs_box(704, 90, 536, 364, '<div class="puan-kart parli" style="height:100%"><div class="puan-kart-ust">' + halka(94, 88, "nane", "94", "PUAN", "Kurul puanı 94 üzerinden 100") + '<span class="muhur muhur-bas" style="width:96px;height:96px;font-size:12px">' + I("muhur", 28) + 'PARLAK</span>'
                         '<div class="soluk kucuk" style="flex:1">güven 0,91 · takip sorusu yok</div></div><div style="margin-top:10px">' + kr + "</div></div>", "abs"))
        s.append(abs_box(704, 464, 536, 108, bubble("usta", "Hasan Abi", "Zeynep, satırı da hesabı da anlattın; 121 dakikanın 120 TL ettiğini ben de gördüm. Henüz küçük bir eksik: 10. satırın neden 11. satıra yol verdiğini bir cümleyle bağlarsan tamam. Sonraki adım: bariyeri kaldır, ilk araba geliyor.", "hasan"), "kart", "padding:10px 14px;font-size:13px"))
        s.append(abs_box(704, 582, 536, 128, '<div class="kart-baslik" style="margin-bottom:6px">' + I("bayrak", 20) + 'Açılış</div><div class="sira-s" style="margin-bottom:6px"><span class="chip chip-kobalt chip-buyuk">+300 XP</span><span class="chip chip-amber chip-buyuk">+100 B Açılış Kurdelesi</span>' + durum("acik") + "</div>"
                         '<div class="led" style="font-size:12px">Yeni işletme: @zeynep_cs\'nin Otoparkı — Çarşı</div><div style="font:700 13px var(--font-body);margin-top:6px">Tabela: @zeynep_cs\'nin Otoparkı · Çırak Sev. 4 · AÇIK · kasa 0 / 73 B</div>', "kart", "padding:10px 14px;border-color:var(--mint-koyu)"))
        s.append(abs_box(704, 720, 536, 70, '<div class="puan-kart-etiket" style="color:var(--amber-ink)">Deneme (alternatif): cevap “Çünkü 121, 120\'den büyük.”</div><div style="font:600 13px/1.35 var(--font-body);margin-top:3px"><b>42</b> · Doğruluk 22 · Tamlık 8 · Açıklık 12. İşletmen Deneme modunda açıldı. Gelir %50; 24 saat sonra yeniden Savunma yapabilirsin.</div>', "kart", "padding:8px 14px;border-color:var(--amber-koyu)"))
        return "".join(s)

    out["savunma"] = figure("savunma", frame("savunma", 1280, 800, savunma(), "Savunma"), '<b>Savunma · M-75 (26/26 geçti; Kurul\'un seçtiği satır 11).</b> Soru, kilitli kod, rubrik, cevap (294 / 1.500) ve Kurul kartı (94, PARLAK mühür); altta Açılış ödülleri (+300 XP, +100 B, kasa 0 / 73 B) '
                            've alternatif Deneme sonucu (42). Tüm metin ve sayılar B8 §8.6\'dan.', "m-savunma")

    # ============================================================ 6. Pazar — M-G9
    def glyph(cat, name, col):
        n = name.lower()
        if "şapka" in n or "bere" in n:
            return f'<svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true"><path d="M8 34 q24 -34 48 0 z" fill="{col}"/><rect x="4" y="32" width="56" height="7" rx="3.500" fill="#F4EFE6"/></svg>'
        if "pantolon" in n:
            return f'<svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true"><path d="M16 4 h32 l4 40 h-14 l-6 -24 l-6 24 h-14 z" fill="{col}"/></svg>'
        if n == "bot":
            return f'<svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true"><path d="M14 6 h18 v18 l20 8 v10 h-38 z" fill="{col}"/></svg>'
        if "hırka" in n or "yağmurluk" in n:
            return f'<svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true"><path d="M20 4 h24 l14 14 -8 8 -6 -6 v24 h-24 v-24 l-6 6 -8 -8 z" fill="{col}"/></svg>'
        if "kedi" in n or "martı" in n:
            return f'<svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true"><circle cx="32" cy="28" r="16" fill="{col}"/><path d="M18 16 l4 -12 l8 8 z M46 16 l-4 -12 l-8 8 z" fill="{col}"/><circle cx="26" cy="26" r="2.500" fill="#18213A"/><circle cx="38" cy="26" r="2.500" fill="#18213A"/></svg>'
        if "parke" in n or "tente" in n:
            return f'<svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true"><polygon points="32,6 60,24 32,42 4,24" fill="{col}"/><path d="M18 15 l28 18 M26 11 l28 18 M10 19 l28 18" stroke="#00000033" stroke-width="1.500"/></svg>'
        if "sehpa" in n:
            return prop_svg("masa", 64)
        return I("kalp", 40)

    t87 = tbl(B8, "### 8.7", "## 9.", ["#", "Ürün (`sku`)"] if False else ["#"])
    rows = t87.rows
    cards = []
    COL = {"Sıradan": "#AEB8D3", "Şık": "#6FA8FF", "Nadir": "#B58CFF"}
    for r in rows[:12]:
        nm = r[1].split(" (")[0]
        rar, cat, price, state = r[2], r[3], r[4], r[5]
        sec_ = "secili" if "seçili" in state else ""
        cls = {"Sıradan": "nad-siradan", "Şık": "nad-sik", "Nadir": "nad-nadir"}[rar]
        own = "Sende var" in state
        tail = f'<span class="chip chip-nane" style="height:20px;font-size:11px;padding:0 7px">{esc(state.replace("—", "").strip())}</span>' if own else (f'<span class="chip chip-mor" style="height:20px;font-size:11px;padding:0 7px">{esc(state)}</span>' if state != "—" else "")
        cards.append(f'<div class="pk {cls} {sec_}"><div class="urun">{glyph(cat, nm, COL[rar])}</div><b>{esc(nm)}</b><div class="sira-s" style="gap:6px"><span class="nad-etiket" style="--nad:{COL[rar]}">{esc(rar)}</span><small>{esc(cat)}</small></div>'
                     f'<div class="sira-s" style="justify-content:space-between;gap:4px"><span class="fiyat">{I("coin", 20)}{esc(price.replace("**", ""))}</span>{tail}</div></div>')
    top = ('<div class="sekmeler" style="gap:8px"><span class="sekme aktif">Bayt Rafları</span><span class="sekme">Butik</span><span class="sekme">Rütbe Rafı</span><span style="margin-left:auto" class="chip chip-buyuk chip-kobalt">' + I("saat", 16) + 'Yeni raf: Pzt 09:00 · 5 g 13 sa</span></div>'
           '<div class="sira-s" style="margin-top:10px">' + "".join(f'<span class="chip chip-buyuk{" chip-turkuaz" if i == 0 else ""}">{esc(t)}</span>' for i, t in enumerate(["Hepsi", "Kıyafet", "Aksesuar", "Evcil", "Oda", "Emote"])) + "</div>")

    def pazar():
        s = ['<div class="abs" style="inset:0;background:linear-gradient(180deg,#0B1230,#16204A)"></div>']
        s.append(abs_box(16, 12, 1248, 52, '<b style="font:600 20px var(--font-display)">Pazar</b><span style="margin-left:auto;display:flex;gap:10px">' + sayac("bayt", "1.240", True) + sayac("cip", "10", True) + "</span>", "ab-card", "display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px"))
        s.append(abs_box(16, 76, 880, 90, top, "abs"))
        s.append(abs_box(16, 170, 880, 600, f'<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px">{"".join(cards)}</div>', "abs"))
        prev = ('<div class="av-sahne" style="position:relative;padding:6px;justify-self:center">' + avatar_svg("zeynep", 170) +
                '<svg viewBox="0 0 64 48" width="62" height="46" style="position:absolute;left:50%;top:-4px;transform:translateX(-50%)" aria-hidden="true"><path d="M10 34 q22 -30 44 0 z" fill="#1F2A44"/><rect x="6" y="32" width="52" height="7" rx="3.500" fill="#E5B84B"/><circle cx="32" cy="22" r="4" fill="#E5B84B"/></svg></div>')
        sum_ = ('<div class="yigin-s" style="margin-top:10px;gap:6px"><b style="font:600 17px var(--font-display)">Kaptan Şapkası · Nadir · Baş</b><div class="sira-s"><span class="fiyat" style="font:600 22px var(--font-display);color:var(--amber-ink);display:inline-flex;align-items:center;gap:6px">' + I("coin", 26) + '520 B</span></div>'
                '<span class="soluk kucuk">Cüzdan: 1.240 B → 720 B</span><span class="soluk kucuk">Bu ürün 12 hafta sonra tekrar gelir.</span><div class="sira-s" style="margin-top:6px">' + btn("Dene", "btn-hayalet btn-kucuk") + btn("Satın Al", "btn-altin", "coin") + "</div></div>")
        s.append(abs_box(912, 76, 352, 694, '<div class="puan-kart-etiket" style="color:var(--muted);margin-bottom:6px">Önizleme · Seri No. 037/200</div>' + prev + sum_, "kart", "padding:14px"))
        return "".join(s)

    def pazar_modal():
        return ('<div class="abs" style="inset:0;background:linear-gradient(180deg,#0B1230,#16204A)"></div><div class="modal-arka" style="position:absolute"><div class="modal" role="dialog" aria-modal="true" aria-label="Satın alma onayı" style="width:min(100%,420px)"><div class="modal-baslik">Satın alma onayı</div>'
                '<div class="modal-govde">Kaptan Şapkası\'nı 520 B\'ye almak üzeresin. Cüzdan: 1.240 B → 720 B.</div><div class="modal-alt">' + btn("Vazgeç", "btn-hayalet") + btn("Satın Al", "btn-altin", "coin") + "</div></div></div>")

    pm = frame("pazar", 520, 300, pazar_modal(), "Satın alma onayı").replace('class="devframe"', 'class="devframe" style="flex:0 1 420px"', 1)
    # ---- Pazar durumları: sayfa 1 (yukarıda), sayfa 2, Butik (Çip yetersiz modalı ve Çip paketleri) — B8 §8.7
    BGP = '<div class="abs" style="inset:0;background:linear-gradient(180deg,#0B1230,#16204A)"></div>'
    PAKET = [("Avuç", "100 Çip", "59,99 TL", ""), ("Kutu", "260 Çip", "149,99 TL", "+%4"), ("Sandık", "560 Çip", "299,99 TL", "+%12 · 15–17 için veli onayı"), ("Konteyner", "1.200 Çip", "599,99 TL", "+%20 · veli onayı")]

    def pz_hdr():
        return abs_box(16, 12, 1248, 52, '<b style="font:600 20px var(--font-display)">Pazar</b><span style="margin-left:auto;display:flex;gap:10px">' + sayac("bayt", "1.240", True) + sayac("cip", "10", True) + "</span>", "ab-card", "display:flex;align-items:center;gap:14px;padding:0 16px;border-radius:14px")

    def pz_tabs(active, raf=True):
        t = "".join(f'<span class="sekme{" aktif" if x == active else ""}">{x}</span>' for x in ("Bayt Rafları", "Butik", "Rütbe Rafı"))
        timer = '<span style="margin-left:auto" class="chip chip-buyuk chip-kobalt">' + I("saat", 16) + "Yeni raf: Pzt 09:00 · 5 g 13 sa</span>" if raf else ""
        chips = ('<div class="sira-s" style="margin-top:10px">' + "".join(f'<span class="chip chip-buyuk{" chip-turkuaz" if i == 0 else ""}">{esc(c)}</span>' for i, c in enumerate(["Hepsi", "Kıyafet", "Aksesuar", "Evcil", "Oda", "Emote"])) + "</div>") if raf else ""
        return f'<div class="sekmeler" style="gap:8px">{t}{timer}</div>{chips}'

    def pz_card(nm, tag, cat, price_html, tail="", gl=""):
        cls = {"Sıradan": "nad-siradan", "Şık": "nad-sik", "Nadir": "nad-nadir"}.get(tag, "")
        tg = f'<span class="nad-etiket" style="--nad:{COL[tag]}">{esc(tag)}</span>' if tag in COL else f'<span class="chip chip-gri" style="height:20px;font-size:11px;padding:0 7px">{esc(tag)}</span>'
        return (f'<div class="pk {cls}"><div class="urun">{gl}</div><b>{esc(nm)}</b><div class="sira-s" style="gap:6px">{tg}<small>{esc(cat)}</small></div>'
                f'<div class="sira-s" style="justify-content:space-between;gap:4px"><span class="fiyat">{price_html}</span>{tail}</div></div>')

    def pz_panel():
        prev = '<div class="av-sahne" style="position:relative;padding:6px;justify-self:center">' + avatar_svg("zeynep", 170) + "</div>"
        return abs_box(912, 76, 352, 694, '<div class="puan-kart-etiket" style="color:var(--muted);margin-bottom:6px">Önizleme</div>' + prev
                       + '<div class="yigin-s" style="margin-top:10px;gap:6px"><span class="soluk kucuk">Karta dokun: ürün önizlemede avatara giydirilir (Dene).</span></div>', "kart", "padding:14px")

    def pazar_p2():
        s = [BGP, pz_hdr(), abs_box(16, 76, 880, 90, pz_tabs("Bayt Rafları"), "abs")]
        c2 = (pz_card("Çarşı Tentesi", "Nadir", "Oda", I("coin", 20) + "340 B", gl=glyph("Oda", "Çarşı Tentesi", COL["Nadir"]))
              + pz_card("Şapka Çıkar", "Nadir", "Emote", I("coin", 20) + "250 B", gl=glyph("Emote", "Şapka Çıkar", COL["Nadir"]))
              + pz_card("Seri Dondurucu", "kalıcı", "Stok 0/2", I("coin", 20) + "50 B", gl=I("saat", 40)))
        pager = '<div class="sira-s" style="margin-top:14px;gap:8px;justify-content:center"><span class="chip chip-buyuk">1</span><span class="chip chip-buyuk chip-turkuaz">2</span></div>'
        s.append(abs_box(16, 170, 880, 600, '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px">' + c2 + "</div>" + pager, "abs"))
        s.append(pz_panel())
        return "".join(s)

    def pazar_butik():
        s = [BGP, pz_hdr(), abs_box(16, 76, 880, 48, pz_tabs("Butik", False), "abs")]
        items = [("Neon Çırak", "Kıyafet seti · 4 parça", 100, glyph("Kıyafet", "Neon Çırak bere", "#22C9CE")), ("Gece Odası", "Oda teması", 120, glyph("Oda", "Gece Odası parke", "#2B3A78")),
                 ("Dans Paketi I", "8 emote", 40, I("kalp", 40)), ("İsim rengi", "6 renk", 20, I("kalp", 40))]
        cards = "".join(pz_card(nm, "Butik", cat, f"{fy} Çip", btn(f"{fy - 10} Çip eksik", "btn-kucuk", None, " disabled"), gl) for nm, cat, fy, gl in items)
        foot = ('<div class="sira-s" style="margin-top:18px;gap:14px"><span class="soluk">Çip\'i ücretsiz kazanmanın yolu: Semt Sınavı (+10 Çip).</span>' + btn("Çip Paketleri", "btn-altin", "coin") + "</div>")
        s.append(abs_box(16, 132, 880, 400, '<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px">' + cards + "</div>" + foot, "abs"))
        s.append(pz_panel())
        return "".join(s)

    def modal_stage(title, body, foot, w=440):
        return (BGP + '<div class="modal-arka" style="position:absolute"><div class="modal" role="dialog" aria-modal="true" aria-label="' + esc(title) + f'" style="width:min(100%,{w}px)"><div class="modal-baslik">' + esc(title)
                + '</div><div class="modal-govde">' + body + '</div><div class="modal-alt">' + foot + "</div></div></div>")

    m_yetersiz = modal_stage("Çip yetersiz", "Neon Çırak 100 Çip. Cüzdan: 10 Çip, 90 Çip eksik.<br>Çip'i ücretsiz kazanmak için: Semt Sınavı (+10 Çip).", btn("Vazgeç", "btn-hayalet") + btn("Çip Paketleri", "btn-altin", "coin"))
    paket_rows = "".join(f'<div class="satir"><span class="satir-ana"><span class="satir-baslik">{esc(a)}</span><span class="satir-alt">{esc(d) if d else "&nbsp;"}</span></span><span class="satir-sag"><b>{esc(c)}</b><span class="chip chip-amber">{esc(t)}</span></span></div>' for a, c, t, d in PAKET)
    m_paket = modal_stage("Çip Paketleri", '<div class="yigin-s" style="gap:6px">' + paket_rows + '</div><span class="soluk kucuk">Ne aldığını görerek alırsın: rastgele kutu yok. Bayt satın alınamaz; Çip yalnızca kozmetik içindir. Seçim ödeme sayfasına yönlendirir: “Ödeme sayfasına yönlendiriliyorsun.”</span>', btn("Vazgeç", "btn-hayalet"), 460)
    small = lambda h: h.replace('class="devframe"', 'class="devframe" style="flex:0 1 420px"', 1)
    pane1 = frame("pazar", 1280, 800, pazar(), "Pazar, Bayt Rafları sayfa 1") + pm
    pane2 = frame("pazar", 1280, 800, pazar_p2(), "Pazar, Bayt Rafları sayfa 2")
    pane3 = frame("pazar", 1280, 800, pazar_butik(), "Pazar, Butik") + small(frame("pazar", 520, 300, m_yetersiz, "Çip yetersiz modalı")) + small(frame("pazar", 520, 580, m_paket, "Çip paketleri modalı"))
    out["pazar"] = figure("pazar", tabbed("m-pazar", "Pazar durumları", [("Bayt Rafları · sayfa 1", pane1), ("Bayt Rafları · sayfa 2", pane2), ("Butik · Çip yetersiz", pane3)]),
                          '<b>Pazar · M-G9, üç durum (B8 §8.7).</b><span><b>Sayfa 1</b>: Bayt Rafları, 12 kart; nadirlik rengi, şekil ve metin birlikte okunur; Kaptan Şapkası (Nadir, 520 B, Seri No. 037/200) seçili, önizleme avatarda; küçük çerçevede onay modalı cüzdanı 1.240 B → 720 B gösterir. '
                          '<b>Sayfa 2</b>: Çarşı Tentesi (Nadir · Oda · 340 B), Şapka Çıkar (Nadir · Emote · 250 B), Seri Dondurucu (kalıcı · 50 B · stok 0/2). '
                          '<b>Butik</b> (cüzdan 10 Çip): dört ürün “N Çip eksik” der; yetersiz Çip modalı iki yol sunar ([Çip Paketleri] ve Semt Sınavı) ve Çip paketleri modalı B2 §9.3 fiyatlarını gösterir. Sekmelerle durum değiştirilir; Rütbe Rafı aşağıdadır.</span>', "m-pazar")

    # ---- Pazar ek: Butik, Çip paketleri, Rütbe Rafı (B8 §8.7 tablosu, gerçek metin)
    def pazar_ek():
        butik = [("Neon Çırak (4 parça kıyafet seti)", "100 Çip", "90 Çip eksik"), ("Gece Odası (oda teması)", "120 Çip", "110 Çip eksik"), ("Dans Paketi I (8 emote)", "40 Çip", "30 Çip eksik"), ("İsim rengi (6 renk)", "20 Çip", "10 Çip eksik")]
        paket = [("Avuç", "100 Çip", "59,99 TL", ""), ("Kutu", "260 Çip", "149,99 TL", "+%4"), ("Sandık", "560 Çip", "299,99 TL", "+%12 · 15–17 için veli onayı"), ("Konteyner", "1.200 Çip", "599,99 TL", "+%20 · veli onayı")]
        rutbe = [("Otopark Ustası Şapkası", "Gizli testlerin tamamını ilk 3 denemede geç.", "kilit"), ("Keskin Göz Rozeti", "KAZANILDI", "ok"), ("Çarşı Semt Madalyası", "KAZANILDI", "ok"), ("Derleyici Dansı (emote)", "KAZANILDI (ilk Açılış)", "ok"), ("Mühür Vur (emote)", "10 altın durak: 3/10", "kilit")]
        b = "".join(f'<div class="satir"><span class="satir-ana"><span class="satir-baslik">{esc(a)}</span><span class="satir-alt">{esc(c)}</span></span><span class="satir-sag"><b class="sayi">{sayac("cip", p.split()[0], True)}</b></span></div>' for a, p, c in butik)
        pk = "".join(f'<div class="satir"><span class="satir-ana"><span class="satir-baslik">{esc(a)}</span><span class="satir-alt">{esc(d) if d else "&nbsp;"}</span></span><span class="satir-sag"><b>{esc(c)}</b><span class="chip chip-amber">{esc(t)}</span></span></div>' for a, c, t, d in paket)
        rr = "".join(f'<div class="satir{" satir-kilitli" if k == "kilit" else ""}"><span class="rozet rozet-nisan" style="width:40px;height:40px">{I("madalya", 20)}</span><span class="satir-ana"><span class="satir-baslik">{esc(a)}</span><span class="satir-alt">{esc(c)}</span></span></div>' for a, c, k in rutbe)
        return stage('<div class="demo-grid"><div class="demo-cell"><small>Butik (Çip; cüzdan 10 Çip)</small><div class="yigin-s">' + b + '<span class="soluk kucuk">Çip\'i ücretsiz kazanmanın yolu: Semt Sınavı (+10 Çip).</span></div></div>'
                     '<div class="demo-cell"><small>Çip paketleri (B2 §9.3)</small><div class="yigin-s">' + pk + '<span class="soluk kucuk">Ne aldığını görerek alırsın: rastgele kutu yok. Bayt satın alınamaz; Çip yalnızca kozmetik içindir.</span></div></div>'
                     '<div class="demo-cell"><small>Rütbe Rafı (Nişan; satılmaz)</small><div class="yigin-s">' + rr + "</div></div></div>")

    out["pazar"] += '<div class="mockcap" style="margin-top:6px"><b>Pazar: diğer sekmeler</b> (Butik, Çip paketleri, Rütbe Rafı)</div>' + pazar_ek()
    return out


def mk_details(summary, inner):
    return f'<details class="acc"><summary>{esc(summary)}</summary>{inner}</details>'
