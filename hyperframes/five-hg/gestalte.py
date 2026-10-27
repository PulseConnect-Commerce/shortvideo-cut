"""Gestaltet die Hintergründe für M06 · FIVE Skincare (1080x1920, Video-Koordinaten) aus echten Screenshots von
fiveskincare.de (Shop, Produktseite, Story, Presse, 5 Gründe) und dem Shopify-Interview von 2020, und zeigt eine Vorschau
mit ihm (freigestellt) davor. Vorbild: hyperframes/klaviyo-hg.

  node tools/py.mjs ../hyperframes/five-hg/gestalte.py <ziel-ordner> [--vorschau <take.mp4> <rvm.torchscript> <sek> ...]

Quellen (alle am 27.10.2026 mit Playwright/Chromium ohne Login in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen,
siehe public/broll/five/QUELLE.txt und screenshots/aufnahme.json): screenshots/*.png (Bildschirm 1080x1920, die
Kopfleiste der Seite mit dem Logo oben, der Abschnitt direkt darunter). Nur verschoben, zugeschnitten, leicht
weichgezeichnet und leicht abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr. Sonst nichts dazugemalt.
Über dem Kopf (y 280-490) stehen im Video die Kennzahlen (HyperFrames, mit eigenem hellem Schleier dahinter).
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
BILD = dict(scale=1.2, hoch=270, x=-26)   # wie in src/projekte/five/Video.tsx

HG = {
    # name: (datei, verschiebung nach oben in px (ab der Kopfleiste), weichzeichnen (Sigma), abdunkeln)
    "hg-home": ("home2.png", 0, 1.2, 0.97),              # Startseite, Folie 2: "Adieu trockene Haut im Winter! Hallo Shea Cream"
    "hg-zutaten": ("zutaten.png", 0, 1.2, 0.97),         # Shea Cream: "Mit nur 5 Inhaltsstoffen" (Sheabutter, Jojobaöl, Arganöl, Vitamin E, Neroliöl)
    "hg-alle": ("alle.png", 450, 1.2, 0.97),              # Kategorie "Produkte": FIVE Make-up Entferner, FIVE Gesichtsserum ...
    "hg-story": ("story.png", 0, 1.2, 0.97),             # "Unsere Story": «Weniger ist oft mehr – besonders in der Hautpflege.»
    "hg-presse": ("presse-blick.png", 0, 1.2, 0.97),     # Presse "Auf einen Blick": Sept. 2017 "Die Höhle der Löwen", Launch in DACH
    "hg-usp": ("shea-usp.png", 0, 1.2, 0.97),            # Produktseite Shea Cream: "Nur 5 Inhaltsstoffe" direkt unter dem Namen
    "hg-favoriten": ("favoriten.png", 0, 1.2, 0.97),     # Startseite: "Maximal 5 Inhaltsstoffe" über "Eure Favoriten"
    "hg-geheimnisse": ("geheimnisse.png", 0, 1.2, 0.97), # 5 Gründe: "4. Keine Geheimnisse" (Inhaltsstoffe gross auf Tiegel und Flakons)
    "hg-shea": ("shea.png", 0, 1.2, 0.97),               # Produktseite Shea Cream (Kopf mit Produktfoto)
    "hg-gruende": ("gruende.png", 0, 1.2, 0.97),         # 5 Gründe: "Durchschnittlich ... circa 30 Inhaltsstoffen. Wir kommen mit maximal 5 aus."
}


def gestalte(src, hoch, sigma, dim):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    if hoch:
        kopf = img[:280].copy()
        rest = img[280 + hoch:]
        img = np.vstack([kopf, rest, np.repeat(rest[-1:], hoch, 0)])
    out = img[:1920, :1080].copy()
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
    comp = cv2.addWeighted(ov, 0.75, comp, 0.25, 0)
    for y in (280, 490):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    nur = os.environ.get("NUR")
    fertig = {}
    for name, (datei, hoch, sigma, dim) in HG.items():
        if nur and name not in nur.split(","):
            continue
        p = os.path.join(SS, datei)
        if not os.path.exists(p):
            print("fehlt", p)
            continue
        bg = gestalte(p, hoch, sigma, dim)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        fertig[name] = bg
        print("ok", name)
    if "--vorschau" in sys.argv:
        i = sys.argv.index("--vorschau")
        take, rvm = sys.argv[i + 1], sys.argv[i + 2]
        zeiten = [float(x) for x in sys.argv[i + 3:]]
        os.makedirs(os.path.join(HIER, "vorschau"), exist_ok=True)
        kacheln = []
        for k, (name, bg) in enumerate(fertig.items()):
            v = vorschau(bg, take, zeiten[k % len(zeiten)], rvm)
            v = cv2.resize(v, (360, 640))
            cv2.putText(v, name, (6, 630), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            kacheln.append(v)
        while len(kacheln) % 6:
            kacheln.append(np.zeros_like(kacheln[0]))
        bogen = np.vstack([np.hstack(kacheln[j:j + 6]) for j in range(0, len(kacheln), 6)])
        cv2.imwrite(os.path.join(HIER, "vorschau", "bogen.jpg"), bogen, [cv2.IMWRITE_JPEG_QUALITY, 80])
