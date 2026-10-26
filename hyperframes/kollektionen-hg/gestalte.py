"""Gestaltet die Hintergründe für S03 · Automatische Kollektionen (1080x1920, Video-Koordinaten) aus echten Screenshots
offizieller Shopify-Hilfeseiten und zeigt eine Vorschau mit ihm (freigestellt) davor. Vorbild: hyperframes/metafelder-hg.

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Quellen (alle am 26.10.2026 mit Playwright/Chromium in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen, siehe
public/broll/kollektionen/QUELLE.txt): screenshots/abschnitte/*.png (Bildschirm-Ausschnitt 1080x1920, der Abschnitt steht
oben direkt unter der Kopfleiste "Hilfe") und screenshots/lang/*.png (Kopf der Seite, 1080x2250). Nur zugeschnitten,
minimal weichgezeichnet und leicht abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr. Nichts dazugemalt; die
schwebende Leiste "Frage nach diesem Artikel" ist bei der Aufnahme ausgeblendet (wie ein Cookie-Banner).
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
BILD = dict(scale=1.38, hoch=703, x=61)   # wie in src/projekte/kollektionen/Video.tsx
KOPF = 150                                 # Höhe der Kopfleiste der Hilfeseite (px bei 1080 Breite)

HG = {
    # name: (datei, quelle_y (None = Ausschnitt wie aufgenommen; sonst beginnt der Inhalt unter der Kopfleiste hier), abdunkeln)
    "hg-beispiele": ("abschnitte/a-koll-beispiele.png", None, 0.93),       # "Kollektionen": Kleidung, Farbe ...
    "hg-manuell": ("abschnitte/a-koll-automatisch.png", None, 0.93),       # "Kollektionen": automatisch / manuell hinzufügen
    "hg-intelligent": ("abschnitte/a-int-kopf.png", None, 0.93),           # "Intelligente Kollektion erstellen" / Automatisierte ...
    "hg-schritte": ("abschnitte/a-int-schritte.png", None, 0.93),          # Schritte: Produkte > Kollektionen, Kollektion hinzufügen
    "hg-typ": ("abschnitte/a-int-typ.png", None, 0.93),                    # Kollektionstyp Intelligent, allen / beliebigen Bedingung
    "hg-bedingungen": ("lang/bedingungen.png", 360, 0.93),                 # "Bedingungen für Kollektionen verstehen" (Kopf)
    "hg-mehrere": ("abschnitte/a-bed-mehrere.png", None, 0.93),            # "Verwendung mehrerer Auswahlbedingungen"
    "hg-irgendeine": ("abschnitte/a-bed-irgendeine.png", None, 0.93),      # "Wenn du Irgendeine Bedingung muss erfüllt sein ..."
    "hg-alle": ("abschnitte/a-bed-alle.png", None, 0.93),                  # "Wenn du Alle Bedingungen müssen erfüllt sein ..."
    "hg-tags": ("abschnitte/a-bed-tags.png", None, 0.93),                  # "Bedingungen basierend auf Produkt-Tags festlegen"
    "hg-hinweis": ("abschnitte/a-bed-hinweis.png", None, 0.93),            # Hinweis Sonderzeichen in Tags
    "hg-speichern": ("abschnitte/a-int-speichern.png", None, 0.93),        # "Klicke auf Speichern. Im angezeigten Abschnitt Produkte ..."
    "hg-zeit": ("lang/bedingungen.png", 860, 0.93),                        # "... ohne manuelle Verwaltung automatisch ... Zeit spart"
}


def gestalte(src, y0, dim):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    fill = np.median(img[-40:, :, :].reshape(-1, 3), axis=0)   # Seitenhintergrund (unten)
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
    cv2.rectangle(ov, (80, 950), (900, 1310), (245, 245, 245), -1)       # Karte
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
