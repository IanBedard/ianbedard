"""Generate the logo mark: a sphere filled with 10 white ripple lines.

Usage: python tools/build_logo.py
Writes assets/img/logo-mark.svg (header and footer, always on near-black) and
assets/img/favicon.svg (the same mark on a near-black disc, so it shows on light tab bars).
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


def mark(disc=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" role="img" aria-label="Ian Bédard logo">
  <defs>
    <clipPath id="sphere"><circle cx="{S / 2}" cy="{S / 2}" r="{R}"/></clipPath>
  </defs>{disc}
  <g clip-path="url(#sphere)" fill="none" stroke="#f0f0f0" stroke-width="{STROKE}" stroke-linecap="round">
    {paths}
  </g>
</svg>
"""


os.makedirs(OUT, exist_ok=True)
files = {
    "logo-mark.svg": mark(),
    "favicon.svg": mark(f'\n  <circle cx="{S / 2}" cy="{S / 2}" r="{S / 2}" fill="#0f0f0f"/>'),
}
for name, svg in files.items():
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
        f.write(svg)
print("ok")
