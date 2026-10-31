"""Gestaltet die Hintergründe für M02 · PURELEI (1080x1920, Video-Koordinaten) aus echten Screenshots von purelei.com und zeigt
eine Vorschau mit ihm (freigestellt) davor. Vorbild: hyperframes/gymshark-hg/gestalte.py.

  .venv/bin/python hyperframes/purelei-hg/gestalte.py <ganze-seiten-ordner> <ziel-ordner> [--vorschau <take.mp4> <rvm> <sek> ...]

Quellen (am 31.10.2026 mit Playwright/Chromium ohne Login in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen, siehe
aufnahme.cjs, screenshots/aufnahme.json und public/broll/purelei/QUELLE.txt): je Seite ein Bild der ganzen Seite. Hier nur
zusammengesetzt (oben die Kopfleiste der Seite mit dem PURELEI-Logo, darunter ein Abschnitt der Seite), leicht weichgezeichnet
und leicht abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr. Sonst nichts dazugemalt.
"""
import os
import sys

import cv2
import numpy as np

BILD = dict(scale=1.45, hoch=500, x=36)   # wie in src/projekte/purelei/Video.tsx (Kopf oben, ab Hüfthöhe)
KOPF = 140                                # Kopfleiste mit Logo (css 0-56)
# name: (seite, css-y des Abschnitts, Kopfleiste ja/nein)
HG = {
    "lei": ("lei", 120, True, 0),            # Über die LEI: Deine LEI mit bedeutungsvollen Charms (Hand mit Armreif)
    "sand": ("aloha", 2125, False, 0),       # Über uns: PURELEI in den Sand geschrieben (Schriftzug oben über dem Kopf)
    "hawaii": ("lei", 3040, True, 0),        # Über die LEI: Bild zu "Inspiriert von Hawaii / Die Bedeutung einer Lei"
    "aloha": ("aloha", 440, True, 0),        # Über uns: "ALOHA! Schön, dass du da bist." (ALOHA! links neben dem Kopf)
    "grid": ("grid", 0, False, 0),          # LEI Collection (Produktkacheln)
    "kette": ("kette", 56, True, 0),         # Produktseite LEI Charm Kette: Produktbild
    "community": ("community", 2422, True, 0),  # Blog: "PURELEI Adventskalender 2026: Mit unserer Community kreiert"
    "ketten": ("ketten", 330, True, 0),      # Kategorie Ketten (Produktkacheln)
    "markenwelt": ("aloha", 6090, True, 0),  # Über uns: "Was PURELEI dir bietet" (Ringe und Kette auf Holz)
    "goetze": ("goetze", 0, False, 0),      # Festive Collection by Ann-Kathrin Götze
    "karo": ("karo", 0, False, 0),          # Adventskalender x @karokauer
    "club": ("club", 1400, True, 0),         # Mahina Club: Das erwartet Dich
}


def gestalte(seiten, name, sigma=1.2, dim=0.96):
    seite, y, mitkopf, _ = HG[name]
    full = cv2.imread(os.path.join(seiten, seite + ".png"), cv2.IMREAD_COLOR)[:, :1080]
    y0 = int(y * 2.5)
    teile = [full[:KOPF], full[y0:y0 + 1920 - KOPF]] if mitkopf else [full[y0:y0 + 1920]]
    img = np.vstack(teile).astype(np.float32)
    if img.shape[0] < 1920:
        img = np.vstack([img, np.repeat(img[-1:], 1920 - img.shape[0], 0)])
    out = cv2.GaussianBlur(img[:1920].copy(), (0, 0), sigma)
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 1000) / 500, 0, 1)
    out = out * (dim - 0.12 * ramp)
    return np.clip(out, 0, 255).astype(np.uint8)


def vorschau(bg, img, a):
    s, hoch, bx = BILD["scale"], BILD["hoch"], BILD["x"]
    m = np.float32([[s, 0, 540 - 540 * s - bx], [0, s, -hoch]])
    fg = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_LINEAR)
    al = cv2.warpAffine(a, m, (1080, 1920), flags=cv2.INTER_LINEAR)[..., None]
    b = cv2.cvtColor(bg, cv2.COLOR_BGR2RGB).astype(np.float32)
    comp = cv2.cvtColor(np.clip(al * fg + (1 - al) * b, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    ov = comp.copy()
    cv2.rectangle(ov, (190, 1050), (790, 1110), (20, 20, 20), -1)       # Pille (ungefähr)
    cv2.rectangle(ov, (80, 1135), (900, 1485), (245, 245, 245), -1)     # Karte
    comp = cv2.addWeighted(ov, 0.6, comp, 0.4, 0)
    for y in (280, 1500):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 2)
    cv2.line(comp, (900, 0), (900, 1920), (0, 0, 255), 2)
    return comp


if __name__ == "__main__":
    seiten, ziel = sys.argv[1], sys.argv[2]
    os.makedirs(ziel, exist_ok=True)
    fertig = {}
    for name in HG:
        bg = gestalte(seiten, name)
        cv2.imwrite(os.path.join(ziel, "hg-" + name + ".png"), bg)
        fertig[name] = bg
    print("ok", len(fertig))
    if "--vorschau" in sys.argv:
        import subprocess

        import torch
        i = sys.argv.index("--vorschau")
        take, rvm = sys.argv[i + 1], sys.argv[i + 2]
        zeiten = [float(x) for x in sys.argv[i + 3:]]
        model = torch.jit.load(rvm).eval()
        bilder = []
        for t in zeiten:
            raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", str(t), "-i", take, "-frames:v", "1", "-f", "rawvideo",
                                  "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
            img = np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3)
            small = cv2.resize(img, (540, 960), interpolation=cv2.INTER_AREA)
            with torch.no_grad():
                _, pha, *_ = model(torch.from_numpy(small.copy()).permute(2, 0, 1)[None].float() / 255, None, None, None, None, 0.4)
            bilder.append((img, cv2.resize(pha[0, 0].numpy(), (1080, 1920))))
        kacheln = []
        for k, (name, bg) in enumerate(fertig.items()):
            img, a = bilder[k % len(bilder)]
            v = cv2.resize(vorschau(bg, img, a), (300, 533))
            cv2.putText(v, name, (6, 525), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            kacheln.append(v)
        while len(kacheln) % 7:
            kacheln.append(np.zeros_like(kacheln[0]))
        bogen = np.vstack([np.hstack(kacheln[j:j + 7]) for j in range(0, len(kacheln), 7)])
        cv2.imwrite(sys.argv[i + 3 + len(zeiten)] if False else os.path.join(ziel, "bogen.jpg"), bogen, [cv2.IMWRITE_JPEG_QUALITY, 80])
