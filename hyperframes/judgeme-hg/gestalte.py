"""Gestaltet die Hintergründe für A03 · Judge.me (1080x1920, Video-Koordinaten) aus echten, offiziellen Bildern und
Screenshots und zeigt eine Vorschau mit ihm (freigestellt) davor. Vorbild: hyperframes/pagebuilder-hg/gestalte.py.

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Quellen (alle am 26.10.2026 geladen, nur zugeschnitten, skaliert, leicht abgedunkelt/weichgezeichnet; nichts dazugemalt):
  public/broll/judgeme/appstore/promo.png, bewertungen-sammeln.png: offizielle Bilder des Shopify-App-Store-Eintrags
    "Judge.me Product Reviews App" (https://apps.shopify.com/judgeme)
  screenshots/appstore-mobil.png: der App-Store-Eintrag (Handy-Ansicht, Playwright)
  screenshots/judgeme-home.png: https://judge.me/ (Handy-Ansicht, Playwright)

Je Bild eine Fläche in der Hintergrundfarbe der Quelle, darauf die Quelle (Maßstab, Lage); oben im Streifen über dem
Kopf (y ~90-300) steht das Wichtige (Logo, Überschrift), an den Seiten neben dem Kopf der Rest. Nach unten (hinter
Pille und Karte) etwas dunkler, damit er, die Untertitel-Pille und die helle Karte lesbar bleiben.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HIER))
BILD = dict(scale=1.4, hoch=495, x=84)   # wie in src/projekte/judgeme/Video.tsx
AS = os.path.join(ROOT, "public", "broll", "judgeme", "appstore")
SS = os.path.join(HIER, "screenshots")

HG = {
    # name: (datei, maßstab, x, y, füllfarbe BGR oder None = Randfarbe der Quelle, abdunkeln)
    "hg-promo": (os.path.join(AS, "promo.png"), 1.22, 0, 110, None, 0.95),
    "hg-anfrage": (os.path.join(AS, "bewertungen-sammeln.png"), 0.98, -10, 130, None, 0.95),
    "hg-listing": (os.path.join(SS, "appstore-mobil.png"), 1.0, 0, -60, (255, 255, 255), 0.93),
    "hg-widgets": (os.path.join(SS, "judgeme-home.png"), 1.0, 0, -1760, None, 0.95),
}


def randfarbe(img):
    r = np.concatenate([img[:6].reshape(-1, 3), img[-6:].reshape(-1, 3), img[:, :6].reshape(-1, 3), img[:, -6:].reshape(-1, 3)])
    return np.median(r, axis=0)


def gestalte(src, s, dx, dy, farbe, dim):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    fill = np.array(farbe, np.float32) if farbe is not None else randfarbe(img)
    out = np.empty((1920, 1080, 3), np.float32)
    out[:] = fill
    m = np.float32([[s, 0, dx], [0, s, dy]])
    lay = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=(-1, -1, -1))
    mask = (lay >= 0).all(axis=2)
    out[mask] = lay[mask]
    out = cv2.GaussianBlur(out, (0, 0), 1.1)
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
    for y in (260, 280):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    nur = os.environ.get("NUR")
    for name, (datei, s, dx, dy, farbe, dim) in HG.items():
        if nur and name not in nur.split(","):
            continue
        if not os.path.exists(datei):
            print("fehlt", datei)
            continue
        bg = gestalte(datei, s, dx, dy, farbe, dim)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, t, rvm = sys.argv[i + 1], float(sys.argv[i + 2]), sys.argv[i + 3]
            v = vorschau(bg, take, t, rvm)
            cv2.imwrite(os.path.join(ziel, "vorschau-" + name + ".jpg"), cv2.resize(v, (540, 960)))
        print("ok", name)
