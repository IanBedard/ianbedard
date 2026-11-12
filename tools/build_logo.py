"""Generate the IB logo mark: sunset ripple lines with the letters I and a mirrored B carved out.

Usage: python tools/build_logo.py
Writes assets/img/logo-mark.svg (dark tile, used in the header and as the favicon)
and assets/img/logo-mark-light.svg (transparent background, for light surfaces).
"""
import math
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img")
S = 120          # viewBox size
LINES = 23
STROKE = 2.2

# Letter shapes (viewBox units). Heavy weight so the carved shapes stay readable when small.
I_SHAPE = "M17 24h17v72H17z"
# B mirrored: stem on the right, bowls open to the left. Counters are drawn back in white so they keep their lines.
B_SHAPE = ("M101 24H70a17 17 0 0 0 0 34h31z"     # upper bowl
           "M101 55H71a20.5 20.5 0 0 0 0 41h30z")   # lower bowl
B_COUNTERS = ("M85 35H70a6 6 0 0 0 0 12h15z"
              "M85 66H71a9.5 9.5 0 0 0 0 19h14z")


def ripple(i):
    """One wavy line across the tile; the swell is strongest in the middle, like the site's waves."""
    gap = (S - 12) / (LINES - 1)
    y0 = 6 + i * gap
    pts = []
    for step in range(0, 61):
        x = step * S / 60
        u = x / S
        env = math.sin(math.pi * u)                        # calm at the edges, bigger in the middle
        y = y0 + env * (4.5 * math.sin(u * 7.0 + i * 0.25) + 1.6 * math.sin(u * 17 + i * 0.45))
        pts.append(f"{x:.1f} {y:.2f}")
    return "M" + " L".join(pts)


def svg(background):
    paths = "\n    ".join(f'<path d="{ripple(i)}"/>' for i in range(LINES))
    bg = f'<rect width="{S}" height="{S}" rx="26" fill="#0c070e"/>' if background else ""
    clip = f'<clipPath id="tile"><rect width="{S}" height="{S}" rx="26"/></clipPath>'
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" role="img" aria-label="Ian Bédard logo">
  <defs>
    <linearGradient id="sunset" x1="0" y1="0" x2="{S}" y2="{S}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fdba74"/>
      <stop offset=".45" stop-color="#fb923c"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
    <mask id="carve" maskUnits="userSpaceOnUse" x="0" y="0" width="{S}" height="{S}">
      <rect width="{S}" height="{S}" fill="#fff"/>
      <path d="{I_SHAPE}{B_SHAPE}" fill="#000"/>
      <path d="{B_COUNTERS}" fill="#fff"/>
    </mask>
    {clip}
  </defs>
  {bg}
  <g clip-path="url(#tile)" mask="url(#carve)" fill="none" stroke="url(#sunset)" stroke-width="{STROKE}" stroke-linecap="round">
    {paths}
  </g>
</svg>
"""


os.makedirs(OUT, exist_ok=True)
for name, bg in (("logo-mark.svg", True), ("logo-mark-light.svg", False)):
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
        f.write(svg(bg))
print("ok")
