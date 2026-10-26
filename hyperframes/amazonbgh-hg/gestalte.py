"""Gestaltet die Hintergründe für N06 · Amazon-Preiskontrollen vor dem BGH (1080x1920, Video-Koordinaten) aus echten
Screenshots (Playwright, Handy-Ansicht 412 px, Faktor 2,62, am 26.10.2026) und zeigt eine Vorschau mit ihm (freigestellt)
davor. Vorbild: hyperframes/judgeme-hg/gestalte.py.

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Quellen (nur zugeschnitten, skaliert, leicht abgedunkelt/weichgezeichnet; die grünen Markierungen sind <mark>-Hervorhebungen
der Sätze, über die er spricht; nichts dazugemalt):
  screenshots/sell-oben.png: https://sell.amazon.de/ (Amazon "Verkaufen bei Amazon", Kopf mit Logo und Überschrift)
  screenshots/bnetza-buybox.png: https://www.bundesnetzagentur.de/DE/Fachthemen/Digitales/P2B/artikel.html
      (Abschnitt "Verfahren des Bundeskartellamts gegen Amazon", Buy-Box-Absatz markiert)
  screenshots/watchblog-mark1.png: https://ecommerce-watchblog.de/amazon-preiskontrolle-bgh/ (24.10.2026, markiert:
      "am 4. Februar 2026 beanstandet und untersagt …", "Vor dem BGH geht es nun zunächst um ein Eilverfahren.",
      "In der Hauptsache ist noch nicht entschieden.")
  screenshots/bgh-oben.png: https://www.bundesgerichtshof.de/SharedDocs/Termine/DE/Termine/KVB13-26.html (Terminhinweis,
      markiert: "Verhandlungstermin am 26. Januar 2027")
Je Bild: Ausschnitt (Quell-y von/bis), Maßstab, Lage; der Rest in der Randfarbe der Quelle. Oben im Streifen über dem
Kopf (y ~40-300) steht das Wichtige, daneben der Rest. Nach unten (hinter Pille und Karte) etwas dunkler.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
BILD = dict(scale=1.35, hoch=655, x=27)   # wie in src/projekte/amazonbgh/Video.tsx
SS = os.path.join(HIER, "screenshots")

HG = {
    # name: (datei, quell_y_von, quell_y_bis, maßstab, x, y (Ziel oben), füllfarbe BGR oder None, abdunkeln)
    "hg-verkaeufer": ("sell-oben.png", 140, 800, 0.95, 0, 30, (255, 255, 255), 0.95),
    "hg-buybox": ("bnetza-buybox.png", 745, 1375, 1.2, -60, 20, (255, 255, 255), 0.95),
    "hg-kartellamt": ("watchblog-mark1.png", 200, 1100, 1.0, 0, 40, (255, 255, 255), 0.95),
    "hg-bgh": ("bgh-oben.png", 130, 1250, 0.95, 20, 10, (255, 255, 255), 0.95),
    "hg-eil": ("watchblog-mark1.png", 1130, 1800, 1.05, -10, 30, (255, 255, 255), 0.95),
}


def gestalte(src, y0, y1, s, dx, dy, farbe, dim):
    img = cv2.imread(src, cv2.IMREAD_COLOR)[y0:y1].astype(np.float32)
    out = np.empty((1920, 1080, 3), np.float32)
    out[:] = np.array(farbe, np.float32)
    m = np.float32([[s, 0, dx], [0, s, dy]])
    lay = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=(-1, -1, -1))
    mask = (lay >= 0).all(axis=2)
    out[mask] = lay[mask]
    out = cv2.GaussianBlur(out, (0, 0), 1.0)
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 820) / 500, 0, 1)
    out = out * (dim - 0.16 * ramp)
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
    cv2.rectangle(ov, (190, 892), (790, 958), (20, 20, 20), -1)          # Pille (ungefähr)
    cv2.rectangle(ov, (80, 995), (900, 1375), (245, 245, 245), -1)       # Karte
    comp = cv2.addWeighted(ov, 0.75, comp, 0.25, 0)
    for y in (260, 280):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    nur = os.environ.get("NUR")
    for name, (datei, y0, y1, s, dx, dy, farbe, dim) in HG.items():
        if nur and name not in nur.split(","):
            continue
        bg = gestalte(os.path.join(SS, datei), y0, y1, s, dx, dy, farbe, dim)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, t, rvm = sys.argv[i + 1], float(sys.argv[i + 2]), sys.argv[i + 3]
            v = vorschau(bg, take, t, rvm)
            cv2.imwrite(os.path.join(ziel, "vorschau-" + name + ".jpg"), cv2.resize(v, (360, 640)))
        print("ok", name)
