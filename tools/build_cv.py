"""Print the CV to PDF with headless Chrome (or Edge).

Usage: python tools/build_cv.py
Reads tools/cv/cv.html and writes assets/docs/ian-bedard-cv.pdf.
"""
import os
import shutil
import subprocess
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.abspath(os.path.join(ROOT, "tools", "cv", "cv.html"))
OUT = os.path.abspath(os.path.join(ROOT, "assets", "docs", "ian-bedard-cv.pdf"))

BROWSERS = [
    shutil.which("chrome"), shutil.which("google-chrome"), shutil.which("msedge"),
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

browser = next((b for b in BROWSERS if b and os.path.exists(b)), None)
if not browser:
    sys.exit("Chrome or Edge not found")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
subprocess.run([
    browser, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
    "--virtual-time-budget=8000",  # time for the web font to load
    f"--print-to-pdf={OUT}", "file:///" + SRC.replace("\\", "/"),
], check=True, capture_output=True)
print(f"ok: {OUT} ({os.path.getsize(OUT) // 1024} KB)")
