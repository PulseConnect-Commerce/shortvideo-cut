"""Gestaltet die Hintergründe für M07 · Gymshark (1080x1920, Video-Koordinaten) aus echten Screenshots von gymshark.com
(deutsche Seiten, wo es sie gibt) und zeigt eine Vorschau mit ihm (freigestellt) davor. Vorbild: hyperframes/five-hg.

  node tools/py.mjs ../hyperframes/gymshark-hg/gestalte.py <ziel-ordner> [--vorschau <take.mp4> <rvm.torchscript> <sek> ...]

Quellen (am 27.10.2026 mit Playwright/Chromium ohne Login in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen, siehe
aufnahme.cjs, screenshots/aufnahme.json und public/broll/gymshark/QUELLE.txt): screenshots/<name>-kopf.png (Bildschirm
oben mit der Kopfleiste und dem GYMSHARK-Logo) und screenshots/<name>.png (der Abschnitt der Seite ab css-y).
Nur zusammengesetzt (Kopfleiste oben, Abschnitt darunter), leicht weichgezeichnet und leicht abgedunkelt, nach unten
(hinter Pille und Karte) etwas mehr. Sonst nichts dazugemalt. Über dem Kopf (y 280-490) stehen im Video die Kennzahlen
(HyperFrames, mit eigenem hellem Schleier dahinter).
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
BILD = dict(scale=1.3, hoch=425, x=22)   # wie in src/projekte/gymshark/Video.tsx (ab Hüfthöhe, Pauls Regel 2026-10-27)
KOPF = 275                               # Kopfleiste: Hinweiszeile und Logo-Zeile (css 0-110)
HG = ["story", "about", "neu", "g66", "popup", "sulek", "athlet", "regent", "stores"]


def gestalte(name, sigma=1.2, dim=0.97):
    kopf = cv2.imread(os.path.join(SS, name + "-kopf.png"), cv2.IMREAD_COLOR)[:KOPF, :1080]
    ab = cv2.imread(os.path.join(SS, name + ".png"), cv2.IMREAD_COLOR)[:, :1080]
    img = np.vstack([kopf, ab]).astype(np.float32)
    if img.shape[0] < 1920:
        img = np.vstack([img, np.repeat(img[-1:], 1920 - img.shape[0], 0)])
    out = img[:1920].copy()
    out = cv2.GaussianBlur(out, (0, 0), sigma)
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 1000) / 500, 0, 1)
    out = out * (dim - 0.10 * ramp)
    return np.clip(out, 0, 255).astype(np.uint8)


def vorschau(bg, take, t, rvm):
    import subprocess

    import torch
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", str(t), "-i", take, "-frames:v", "1", "-f", "rawvideo",
                          "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    img = np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3)
    model = torch.jit.load(rvm).eval()
    small = cv2.resize(img, (540, 960), interpolation=cv2.INTER_AREA)
    with torch.no_grad():
        _, pha, *_ = model(torch.from_numpy(small.copy()).permute(2, 0, 1)[None].float() / 255, None, None, None, None, 0.4)
    a = cv2.resize(pha[0, 0].numpy(), (1080, 1920))
    s, hoch, bx = BILD["scale"], BILD["hoch"], BILD["x"]
    m = np.float32([[s, 0, 540 - 540 * s - bx], [0, s, -hoch]])
    fg = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_LINEAR)
    al = cv2.warpAffine(a, m, (1080, 1920), flags=cv2.INTER_LINEAR)[..., None]
    b = cv2.cvtColor(bg, cv2.COLOR_BGR2RGB).astype(np.float32)
    comp = al * fg + (1 - al) * b
    comp = cv2.cvtColor(np.clip(comp, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    ov = comp.copy()
    cv2.rectangle(ov, (190, 1036), (790, 1100), (20, 20, 20), -1)        # Pille (ungefähr)
    cv2.rectangle(ov, (80, 1118), (900, 1468), (245, 245, 245), -1)      # Karte
    cv2.rectangle(ov, (80, 284), (900, 468), (255, 255, 255), -1)        # Kennzahl mit Schleier
    comp = cv2.addWeighted(ov, 0.6, comp, 0.4, 0)
    for y in (280, 490):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    fertig = {}
    for name in HG:
        bg = gestalte(name)
        cv2.imwrite(os.path.join(ziel, "hg-" + name + ".png"), bg)
        fertig[name] = bg
        print("ok", name)
    if "--vorschau" in sys.argv:
        i = sys.argv.index("--vorschau")
        take, rvm = sys.argv[i + 1], sys.argv[i + 2]
        zeiten = [float(x) for x in sys.argv[i + 3:]]
        kacheln = []
        for k, (name, bg) in enumerate(fertig.items()):
            v = vorschau(bg, take, zeiten[k % len(zeiten)], rvm)
            v = cv2.resize(v, (360, 640))
            cv2.putText(v, name, (6, 630), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            kacheln.append(v)
        while len(kacheln) % 5:
            kacheln.append(np.zeros_like(kacheln[0]))
        bogen = np.vstack([np.hstack(kacheln[j:j + 5]) for j in range(0, len(kacheln), 5)])
        os.makedirs(os.path.join(HIER, "vorschau"), exist_ok=True)
        cv2.imwrite(os.path.join(HIER, "vorschau", "bogen.jpg"), bogen, [cv2.IMWRITE_JPEG_QUALITY, 80])
