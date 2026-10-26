"""Gestaltet die Hintergründe für S02 · Metafelder (1080x1920, Video-Koordinaten) aus echten Screenshots offizieller
Shopify-Hilfeseiten und zeigt eine Vorschau mit ihm (freigestellt) davor. Vorbild: hyperframes/judgeme-hg/gestalte.py.

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Quellen (alle am 26.10.2026 mit Playwright/Chromium in der Handy-Ansicht aufgenommen, siehe public/broll/metafelder/
QUELLE.txt): screenshots/lang/<seite>.png (ganze Seite, 1080 breit) und screenshots/definitionen.png (Kopf der Seite).
Je Bild: oben die Kopfleiste der Hilfeseite ("Hilfe" mit Shopify-Logo, so wie sie beim Scrollen am Handy stehen bleibt),
darunter die Seite ab dem Abschnitt, um den es im Satz geht (Überschrift im Streifen über dem Kopf, y ~170-330, der Rest
neben dem Kopf). Nur zugeschnitten, minimal weichgezeichnet und leicht abgedunkelt, nach unten (hinter Pille und Karte)
etwas mehr, damit er, die Untertitel-Pille und die helle Karte lesbar bleiben. Nichts dazugemalt; die schwebende Leiste
"Frage nach diesem Artikel" ist bei der Aufnahme ausgeblendet (wie ein Cookie-Banner).
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
BILD = dict(scale=1.38, hoch=686, x=32)   # wie in src/projekte/metafelder/Video.tsx
KOPF = 162                                 # Höhe der Kopfleiste der Hilfeseite (px bei 1080 Breite)

HG = {
    # name: (datei, quelle_y (Abschnitt beginnt hier), abdunkeln)
    "hg-beispiel": ("lang/metafelder.png", 1244, 0.93),      # "Warum Metafelder verwenden" (Bekleidungs-Shop, Pflegehinweise)
    "hg-metafelder": ("lang/metafelder.png", 380, 0.93),     # "Metafelder ermöglichen es dir, ... zu erweitern"
    "hg-definitionen": ("definitionen.png", 380, 0.93),      # "Hinzufügen von Metafeld-Definitionen"
    "hg-schritt1": ("lang/pflege.png", 5542, 0.93),          # "Schritt 1: Eine Metafeld-Definition erstellen"
    "hg-typen": ("lang/typen.png", 380, 0.93),               # "Inhaltstypen und Werte von Metafeldern"
    "hg-schritt2": ("lang/pflege.png", 6639, 0.93),          # "Schritt 2: Werte zu Metafeldern hinzufügen"
    "hg-anzeigen": ("lang/anzeigen.png", 2932, 0.93),        # "Metafelder über den Theme-Editor mit deinem Theme verbinden"
    "hg-schritt3": ("lang/pflege.png", 9187, 0.93),          # "Block hinzufügen > Einklappbare Zeile ... Dynamische Quelle verbinden"
    "hg-vorlage": ("lang/pflege.png", 9751, 0.93),           # "... eine einzige Produktvorlage ..., die für alle deine Produkte funktioniert"
}


def gestalte(src, y0, dim):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    h, w = img.shape[:2]
    fill = np.median(img[-40:, :, :].reshape(-1, 3), axis=0)   # Seitenhintergrund (unten)
    out = np.empty((1920, 1080, 3), np.float32)
    out[:] = fill
    out[:KOPF] = img[:KOPF, :1080]
    teil = img[y0:y0 + 1920 - KOPF, :1080]
    out[KOPF:KOPF + teil.shape[0]] = teil
    out = cv2.GaussianBlur(out, (0, 0), 1.0)
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 820) / 500, 0, 1)
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
    cv2.rectangle(ov, (190, 862), (790, 930), (20, 20, 20), -1)          # Pille (ungefähr)
    cv2.rectangle(ov, (80, 950), (900, 1330), (245, 245, 245), -1)       # Karte
    comp = cv2.addWeighted(ov, 0.75, comp, 0.25, 0)
    for y in (280, 315):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    nur = os.environ.get("NUR")
    for name, (datei, y0, dim) in HG.items():
        if nur and name not in nur.split(","):
            continue
        p = os.path.join(SS, datei)
        if not os.path.exists(p):
            print("fehlt", p)
            continue
        bg = gestalte(p, y0, dim)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, t, rvm = sys.argv[i + 1], float(sys.argv[i + 2]), sys.argv[i + 3]
            v = vorschau(bg, take, t, rvm)
            cv2.imwrite(os.path.join(ziel, "vorschau-" + name + ".jpg"), cv2.resize(v, (540, 960)))
        print("ok", name)
