"""Generate the logo mark: a sphere filled with 10 sunset ripple lines.

Usage: python tools/build_logo.py
Writes assets/img/logo-mark.svg (used in the header and as the favicon).
"""
import math
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img")
S = 120          # viewBox size
R = 58           # sphere radius
LINES = 10
STROKE = 4.6


def ripple(i):
    """One wavy line across the sphere; the swell is strongest through the middle."""
    gap = 2 * R / (LINES + 0.6)
    y0 = S / 2 - R + gap * (i + 0.8)
    pts = []
    for step in range(0, 61):
        x = step * S / 60
        u = x / S
        env = math.sin(math.pi * u)
        y = y0 + env * 6 * math.sin(u * 6.5 + i * 0.3)
        pts.append(f"{x:.1f} {y:.2f}")
    return "M" + " L".join(pts)


paths = "\n    ".join(f'<path d="{ripple(i)}"/>' for i in range(LINES))
svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" role="img" aria-label="Ian Bédard logo">
  <defs>
    <linearGradient id="sunset" x1="0" y1="0" x2="{S}" y2="{S}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fdba74"/>
      <stop offset=".45" stop-color="#fb923c"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
    <clipPath id="sphere"><circle cx="{S / 2}" cy="{S / 2}" r="{R}"/></clipPath>
  </defs>
  <g clip-path="url(#sphere)" fill="none" stroke="url(#sunset)" stroke-width="{STROKE}" stroke-linecap="round">
    {paths}
  </g>
</svg>
"""

os.makedirs(OUT, exist_ok=True)
with open(os.path.join(OUT, "logo-mark.svg"), "w", encoding="utf-8", newline="\n") as f:
    f.write(svg)
print("ok")
