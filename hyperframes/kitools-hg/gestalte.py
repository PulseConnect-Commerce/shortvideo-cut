"""Gestaltet die Hintergründe für P09 · Zu viele KI-Tools (1080x1920, Video-Koordinaten) aus echten Screenshots der
offiziellen Shopify-Hilfeseite "KI-gestützte Tools" (Quelle laut Briefing, deutsche Fassung) und zeigt eine Vorschau mit
ihm (freigestellt) davor. Vorbild: hyperframes/kollektionen-hg.

  node tools/py.mjs ../hyperframes/kitools-hg/gestalte.py <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Quellen (am 27.10.2026 mit Playwright/Chromium in der Handy-Ansicht 360 css-px, 3-fach aufgenommen, siehe
public/broll/kitools/QUELLE.txt und screenshots/aufnahme.json): screenshots/*.png (Bildschirm 1080x1920, die Kopfleiste
"Hilfe" mit dem Shopify-Zeichen oben, der Abschnitt direkt darunter). Nur zugeschnitten, minimal weichgezeichnet und leicht
abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr; der Satz, über den er gerade spricht, ist dezent grün
unterlegt (wie mit einem Textmarker). Sonst nichts dazugemalt.
"""
import json
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
BILD = dict(scale=1.25, hoch=468, x=0)   # wie in src/projekte/kitools/Video.tsx
DPR = 3                                    # Aufnahme 360 css-px, 3-fach
KOPF = 195                                 # Kopfleiste "Hilfe" (65 css-px)
MARKER = np.array([144, 224, 0], np.float32)   # #00E090 (BGR)

HG = {
    # name: (datei, quelle_y (None = wie aufgenommen; sonst beginnt der Inhalt unter der Kopfleiste hier), abdunkeln)
    "hg-kopf": ("kopf.png", 470, 0.94),            # "KI-gestützte Tools" / "Du kannst KI-gestützte Tools nutzen ..."
    "hg-bessere": ("bessere.png", None, 0.94),     # "Bessere Ergebnisse ... Änderungen überprüfen, bevor du sie übernimmst."
    "hg-vorsicht": ("vorsicht.png", None, 0.94),   # "Vorsicht: KI-Ergebnisse können Fehler enthalten. Überprüfe daher alles ..."
    "hg-kontrolle": ("kontrolle.png", 220, 0.94), # "Du kontrollierst, worauf jedes Tool ... zugreifen darf und welche Aktionen ..."
    "hg-extern": ("extern.png", None, 0.94),       # "Externe KI-Tools verbinden: Du kannst deinen Shop mit externen KI-Tools verbinden ..."
}


def gestalte(name, src, y0, dim, rects):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    # Kernsatz markieren (Rechtecke aus der Aufnahme, css-px), bevor zugeschnitten wird
    for x, y, w, h in rects or []:
        if w <= 1:
            continue
        x0, y0r = int(x * DPR) - 6, int(y * DPR) - 4
        x1, y1r = int((x + w) * DPR) + 6, int((y + h) * DPR) + 8
        # wie ein Textmarker: multiplizieren, Weiß wird hellgrün, die Schrift bleibt dunkel
        img[y0r:y1r, x0:x1] *= 1 - 0.32 * (1 - MARKER / 255.0)
    fill = np.median(img[-40:, :, :].reshape(-1, 3), axis=0)
    out = np.empty((1920, 1080, 3), np.float32)
    out[:] = fill
    if y0 is None:
        teil = img[:1920, :1080]
        out[:teil.shape[0]] = teil
    else:
        out[:KOPF] = img[:KOPF, :1080]
        teil = img[y0:y0 + 1920 - KOPF, :1080]
        out[KOPF:KOPF + teil.shape[0]] = teil
    out = cv2.GaussianBlur(out, (0, 0), 1.0)
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 860) / 500, 0, 1)
    out = out * (dim - 0.14 * ramp)
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
    cv2.rectangle(ov, (190, 950), (790, 1020), (20, 20, 20), -1)         # Pille (ungefähr)
    cv2.rectangle(ov, (80, 1045), (900, 1405), (245, 245, 245), -1)      # Karte
    comp = cv2.addWeighted(ov, 0.75, comp, 0.25, 0)
    for y in (280, 315):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    nur = os.environ.get("NUR")
    info = json.load(open(os.path.join(SS, "aufnahme.json"), encoding="utf-8"))["ziele"]
    for name, (datei, y0, dim) in HG.items():
        if nur and name not in nur.split(","):
            continue
        p = os.path.join(SS, datei)
        if not os.path.exists(p):
            print("fehlt", p)
            continue
        rects = info[datei[:-4]]["rects_css"]
        bg = gestalte(name, p, y0, dim, rects)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, t, rvm = sys.argv[i + 1], float(sys.argv[i + 2]), sys.argv[i + 3]
            v = vorschau(bg, take, t, rvm)
            cv2.imwrite(os.path.join(ziel, "vorschau-" + name + ".jpg"), cv2.resize(v, (540, 960)))
        print("ok", name)
