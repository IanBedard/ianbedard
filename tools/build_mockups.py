import sys, os
from xml.sax.saxutils import escape as esc

# Usage: python tools/build_mockups.py   (writes assets/img/*-desktop.svg and *-mobile.svg)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img")
FONT = "Segoe UI, Helvetica, Arial, sans-serif"
SERIF = "Georgia, serif"

projects = {
    "cafe-brume": dict(
        bg="#f4ede4", dark="#2b1d16", accent="#b5622d", soft="#e6d6c4", url="cafebrume.ca",
        logo="Café Brume", nav=["Coffee", "Subscriptions", "Café", "About"],
        h=["Small-batch coffee,", "roasted in Gatineau"], sub="Subscribe and save 10% · delivered every 2 or 4 weeks",
        cta="Shop coffee", section="Our coffees",
        items=[("Brume Blend", "$19", "bag", "#7a4a2e"), ("Ethiopia Guji", "$22", "bag", "#a0603a"),
               ("Night Decaf", "$20", "bag", "#3c2a20"), ("Subscription", "from $34/mo", "box", "#c7884f")],
        hero="cup"),
    "atelier-argile": dict(
        bg="#eef0ea", dark="#2f3a2c", accent="#5f6f3a", soft="#d9ddcd", url="atelierargile.ca",
        logo="Atelier Argile", nav=["Shop", "Classes", "Studio", "Journal"],
        h=["Handmade ceramics", "from the Outaouais"], sub="New: wheel-throwing classes · book online",
        cta="Shop the collection", section="New this season",
        items=[("Moon Bowl", "$48", "bowl", "#c9b79c"), ("Forest Mug", "$36", "mug", "#6f7f55"),
               ("Pebble Vase", "$85", "vase", "#a99f8d"), ("Class gift card", "$95", "card", "#5f6f3a")],
        hero="vase"),
    "physio-riviere": dict(
        bg="#eaf2f6", dark="#12344a", accent="#1f6f96", soft="#cfe1ea", url="physioriviere.ca",
        logo="Physio Rivière", nav=["Services", "Team", "Pricing", "Contact"],
        h=["Physiotherapy in Ottawa,", "in your language"], sub="Direct billing · Evening appointments · Accessible clinic",
        cta="Book an assessment", section="Services",
        items=[("Physiotherapy", "Learn more", "icon", "#1f6f96"), ("Sports injuries", "Learn more", "icon", "#2c8a7a"),
               ("Pelvic health", "Learn more", "icon", "#6a5a9a"), ("Massage therapy", "Learn more", "icon", "#b0623a")],
        hero="person"),
}


def shape(kind, x, y, w, h, color):
    cx, cy = x + w / 2, y + h / 2
    s = min(w, h)
    if kind == "bag":
        bw, bh = s * .42, s * .62
        return (f'<rect x="{cx-bw/2}" y="{cy-bh/2}" width="{bw}" height="{bh}" rx="6" fill="{color}"/>'
                f'<rect x="{cx-bw/2}" y="{cy-bh/2}" width="{bw}" height="{bh*.18}" rx="4" fill="#000" opacity=".18"/>'
                f'<rect x="{cx-bw*.3}" y="{cy-bh*.05}" width="{bw*.6}" height="{bh*.28}" rx="3" fill="#fff" opacity=".85"/>')
    if kind == "box":
        bw, bh = s * .6, s * .42
        return (f'<rect x="{cx-bw/2}" y="{cy-bh/2+8}" width="{bw}" height="{bh}" rx="6" fill="{color}"/>'
                f'<rect x="{cx-bw/2-6}" y="{cy-bh/2}" width="{bw+12}" height="{bh*.3}" rx="5" fill="{color}" stroke="#000" stroke-opacity=".15"/>'
                f'<rect x="{cx-6}" y="{cy-bh/2}" width="12" height="{bh+8}" fill="#fff" opacity=".6"/>')
    if kind == "bowl":
        r = s * .32
        return (f'<path d="M{cx-r} {cy-r*.15} A{r} {r*.9} 0 0 0 {cx+r} {cy-r*.15} Z" fill="{color}"/>'
                f'<ellipse cx="{cx}" cy="{cy-r*.15}" rx="{r}" ry="{r*.18}" fill="#000" opacity=".12"/>')
    if kind == "mug":
        bw, bh = s * .38, s * .44
        return (f'<rect x="{cx-bw/2}" y="{cy-bh/2}" width="{bw}" height="{bh}" rx="8" fill="{color}"/>'
                f'<path d="M{cx+bw/2} {cy-bh*.25} q{bw*.45} 0 {bw*.45} {bh*.25} q0 {bh*.25} -{bw*.45} {bh*.25}" '
                f'fill="none" stroke="{color}" stroke-width="{s*.05}"/>')
    if kind == "vase":
        r = s * .2
        return (f'<path d="M{cx-r*.35} {cy-r*1.6} h{r*.7} q0 {r*.6} {r*.6} {r*1.1} q{r*.5} {r*.9} 0 {r*1.9} h-{r*2.6} '
                f'q-{r*.5} -{r} 0 -{r*1.9} q{r*.6} -{r*.5} {r*.6} -{r*1.1} z" fill="{color}"/>')
    if kind == "card":
        bw, bh = s * .66, s * .42
        return (f'<rect x="{cx-bw/2}" y="{cy-bh/2}" width="{bw}" height="{bh}" rx="8" fill="{color}"/>'
                f'<circle cx="{cx-bw*.28}" cy="{cy-bh*.18}" r="{s*.04}" fill="#fff" opacity=".8"/>'
                f'<rect x="{cx-bw*.36}" y="{cy+bh*.12}" width="{bw*.5}" height="6" rx="3" fill="#fff" opacity=".8"/>')
    if kind == "icon":
        r = s * .22
        return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}" opacity=".15"/>'
                f'<circle cx="{cx}" cy="{cy-r*.25}" r="{r*.28}" fill="{color}"/>'
                f'<path d="M{cx-r*.55} {cy+r*.55} q{r*.55} -{r*.8} {r*1.1} 0" fill="none" stroke="{color}" stroke-width="{r*.22}" stroke-linecap="round"/>')
    if kind == "cup":
        return (f'<ellipse cx="{cx}" cy="{cy+s*.2}" rx="{s*.3}" ry="{s*.06}" fill="#000" opacity=".1"/>'
                f'<path d="M{cx-s*.2} {cy-s*.12} h{s*.4} l-{s*.04} {s*.3} q-{s*.16} {s*.06} -{s*.32} 0 z" fill="{color}"/>'
                f'<path d="M{cx+s*.2} {cy-s*.05} q{s*.12} 0 {s*.1} {s*.08} q-{s*.02} {s*.07} -{s*.12} {s*.07}" fill="none" stroke="{color}" stroke-width="{s*.03}"/>'
                f'<path d="M{cx-s*.06} {cy-s*.2} q-{s*.04} -{s*.06} 0 -{s*.12} M{cx+s*.06} {cy-s*.2} q-{s*.04} -{s*.06} 0 -{s*.12}" fill="none" stroke="{color}" stroke-width="{s*.015}" opacity=".5"/>')
    if kind == "person":
        return (f'<circle cx="{cx}" cy="{cy-s*.16}" r="{s*.11}" fill="{color}"/>'
                f'<path d="M{cx-s*.24} {cy+s*.3} q0 -{s*.3} {s*.24} -{s*.3} q{s*.24} 0 {s*.24} {s*.3} z" fill="{color}"/>'
                f'<path d="M{cx-s*.38} {cy+s*.06} l{s*.14} -{s*.1}" stroke="{color}" stroke-width="{s*.04}" stroke-linecap="round" opacity=".5"/>')
    return ""


def text(x, y, s, size, fill, weight=400, family=FONT, anchor="start"):
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>')


def desktop(p):
    W, H = 1200, 760
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">',
         f'<rect width="{W}" height="{H}" fill="#fff"/>',
         # browser chrome
         f'<rect width="{W}" height="44" fill="#e9e9ec"/>',
         '<circle cx="22" cy="22" r="6" fill="#ff5f57"/><circle cx="42" cy="22" r="6" fill="#febc2e"/><circle cx="62" cy="22" r="6" fill="#28c840"/>',
         f'<rect x="380" y="11" width="440" height="22" rx="11" fill="#fff"/>',
         text(600, 27, p["url"], 13, "#555", anchor="middle"),
         # site nav
         f'<rect y="44" width="{W}" height="64" fill="#fff"/>',
         text(48, 84, p["logo"], 24, p["dark"], 700, SERIF)]
    x = 470
    for n in p["nav"]:
        o.append(text(x, 82, n, 15, p["dark"], 500))
        x += len(n) * 8 + 44
    o += [f'<rect x="980" y="62" width="74" height="28" rx="14" fill="none" stroke="{p["dark"]}" stroke-opacity=".3"/>',
          text(1017, 81, "EN | FR", 13, p["dark"], 600, anchor="middle"),
          f'<rect x="1080" y="60" width="72" height="32" rx="16" fill="{p["dark"]}"/>',
          text(1116, 81, "Cart" if p["items"][0][1].startswith("$") else "Book", 13, "#fff", 600, anchor="middle"),
          f'<line x1="0" y1="108" x2="{W}" y2="108" stroke="#000" stroke-opacity=".08"/>',
          # hero
          f'<rect y="108" width="{W}" height="360" fill="{p["bg"]}"/>',
          text(64, 210, p["h"][0], 46, p["dark"], 700, SERIF),
          text(64, 266, p["h"][1], 46, p["dark"], 700, SERIF),
          text(64, 312, p["sub"], 18, p["dark"], 400),
          f'<rect x="64" y="342" width="{len(p["cta"])*10+56}" height="52" rx="26" fill="{p["accent"]}"/>',
          text(64 + (len(p["cta"]) * 10 + 56) / 2, 374, p["cta"], 17, "#fff", 600, anchor="middle"),
          f'<circle cx="930" cy="288" r="150" fill="{p["soft"]}"/>',
          shape(p["hero"], 780, 138, 300, 300, p["accent"]),
          # cards
          text(64, 524, p["section"], 26, p["dark"], 700, SERIF)]
    cw, gap = 252, 24
    for i, (name, price, kind, color) in enumerate(p["items"]):
        cx = 64 + i * (cw + gap)
        o += [f'<rect x="{cx}" y="548" width="{cw}" height="170" rx="12" fill="{p["bg"]}"/>',
              shape(kind, cx, 548, cw, 170, color),
              text(cx, 742, name, 16, p["dark"], 600),
              text(cx + cw, 742, price, 15, p["accent"], 600, anchor="end")]
    o.append("</svg>")
    return "\n".join(o)


def mobile(p):
    W, H = 390, 800
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">',
         f'<rect width="{W}" height="{H}" rx="44" fill="#1b1b1f"/>',
         f'<clipPath id="s"><rect x="12" y="12" width="{W-24}" height="{H-24}" rx="34"/></clipPath>',
         '<g clip-path="url(#s)">',
         f'<rect x="12" y="12" width="{W-24}" height="{H-24}" fill="#fff"/>',
         text(44, 44, "9:41", 14, "#111", 600),
         f'<rect x="150" y="26" width="90" height="24" rx="12" fill="#1b1b1f"/>',
         text(32, 98, p["logo"], 21, p["dark"], 700, SERIF),
         f'<rect x="278" y="80" width="38" height="24" rx="12" fill="none" stroke="{p["dark"]}" stroke-opacity=".3"/>',
         text(297, 97, "FR", 11, p["dark"], 700, anchor="middle"),
         f'<path d="M332 84h26M332 92h26M332 100h26" stroke="{p["dark"]}" stroke-width="2.5" stroke-linecap="round"/>',
         f'<rect x="12" y="122" width="{W-24}" height="380" fill="{p["bg"]}"/>',
         f'<circle cx="195" cy="236" r="84" fill="{p["soft"]}"/>',
         shape(p["hero"], 95, 136, 200, 200, p["accent"]),
         text(32, 370, p["h"][0], 25, p["dark"], 700, SERIF),
         text(32, 402, p["h"][1], 25, p["dark"], 700, SERIF),
         f'<rect x="32" y="430" width="{W-64}" height="50" rx="25" fill="{p["accent"]}"/>',
         text(W / 2, 461, p["cta"], 16, "#fff", 600, anchor="middle"),
         text(32, 548, p["section"], 20, p["dark"], 700, SERIF)]
    cw = (W - 64 - 14) / 2
    for i, (name, price, kind, color) in enumerate(p["items"][:2]):
        cx = 32 + i * (cw + 14)
        o += [f'<rect x="{cx}" y="566" width="{cw}" height="150" rx="12" fill="{p["bg"]}"/>',
              shape(kind, cx, 566, cw, 150, color),
              text(cx, 740, name, 14, p["dark"], 600),
              text(cx, 760, price, 13, p["accent"], 600)]
    o += ["</g>", "</svg>"]
    return "\n".join(o)


for slug, p in projects.items():
    with open(os.path.join(OUT, f"{slug}-desktop.svg"), "w", encoding="utf-8") as f:
        f.write(desktop(p))
    with open(os.path.join(OUT, f"{slug}-mobile.svg"), "w", encoding="utf-8") as f:
        f.write(mobile(p))
print("ok")
