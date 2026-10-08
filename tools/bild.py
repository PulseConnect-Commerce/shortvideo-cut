"""Erzeugt ein Bild mit Nano Banana (Googles Bildmodell in der Gemini-API), z. B. als B-Roll über dem Kopf.

  npm run bild -- "<prompt>" <ziel.png> [--format 16:9] [--modell gemini-2.5-flash-image]

Braucht GEMINI_API_KEY (derselbe Schlüssel wie npm run gemini), als Umgebungsvariable oder in der Datei .env.
Formate: 1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9. Bilder für ein Projekt gehören nach
public/projekte/<projekt>/broll/ (wie die Takes nicht im Git; mit demselben Befehl jederzeit neu zu erzeugen).
Kosten: Google rechnet Bildmodelle pro Bild ab; ob dein Schlüssel ein kostenloses Kontingent hat, zeigt der erste
Aufruf (429 mit "limit: 0" heißt: nur mit Abrechnung im Google-Konto). Erzeugte Bilder tragen ein unsichtbares
SynthID-Wasserzeichen von Google.
"""

import base64
import json
import os
import sys
import urllib.error
import urllib.request

BASE = "https://generativelanguage.googleapis.com/v1beta/models"
args = [a for a in sys.argv[1:] if not a.startswith("--")]
opts = dict(a[2:].split("=", 1) if "=" in a else (a[2:], "") for a in sys.argv[1:] if a.startswith("--"))
for i, a in enumerate(sys.argv[1:]):   # auch "--format 16:9" (mit Leerzeichen)
    if a in ("--format", "--modell") and i + 2 < len(sys.argv):
        opts[a[2:]] = sys.argv[i + 2]
        if sys.argv[i + 2] in args:
            args.remove(sys.argv[i + 2])
if len(args) < 2:
    sys.exit(__doc__)
prompt, ziel = args[0], args[1]
modell = opts.get("modell") or os.environ.get("NANO_BANANA_MODEL", "gemini-2.5-flash-image")
fmt = opts.get("format") or "16:9"


def env_key():
    """GEMINI_API_KEY aus der Umgebung oder aus der Datei .env im Repo (wie in gemini-review.py)."""
    if os.environ.get("GEMINI_API_KEY"):
        return os.environ["GEMINI_API_KEY"].strip()
    env = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    if os.path.exists(env):
        for line in open(env, encoding="utf-8-sig"):
            k, _, v = line.strip().partition("=")
            if k.strip() == "GEMINI_API_KEY" and v.strip().strip('"').strip("'"):
                return v.strip().strip('"').strip("'")
    return None


key = env_key() or sys.exit("GEMINI_API_KEY fehlt: in die Datei .env eintragen (GEMINI_API_KEY=...) oder als "
                            "Umgebungsvariable setzen (siehe README)")
body = {
    "contents": [{"parts": [{"text": prompt}]}],
    "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": fmt}},
}
req = urllib.request.Request(f"{BASE}/{modell}:generateContent", data=json.dumps(body).encode(),
                             headers={"x-goog-api-key": key, "Content-Type": "application/json"}, method="POST")
try:
    resp = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e:
    msg = e.read().decode(errors="replace")
    try:
        msg = json.loads(msg)["error"]["message"]
    except (ValueError, KeyError):
        pass
    sys.exit(f"Nano Banana ({modell}): HTTP {e.code}: {msg[:600]}")
parts = [p for c in resp.get("candidates", []) for p in (c.get("content") or {}).get("parts", [])]
img = next((p["inlineData"] for p in parts if "inlineData" in p), None)
if not img:
    grund = resp.get("promptFeedback") or [c.get("finishReason") for c in resp.get("candidates", [])]
    sys.exit(f"Kein Bild zurück ({modell}): {grund}")
os.makedirs(os.path.dirname(os.path.abspath(ziel)), exist_ok=True)
with open(ziel, "wb") as f:
    f.write(base64.b64decode(img["data"]))
print(f"✓ {ziel} ({img.get('mimeType', '?')}, {modell}, {fmt})")
