"""Gestaltet die Hintergründe für M08 · Huel (1080x1920, Video-Koordinaten) aus echten Screenshots der deutschen Seite
de.huel.com und der offiziellen Karriereseite careers.huel.com (im Seitenfuß von de.huel.com als "Karriere" verlinkt) und
zeigt eine Vorschau mit ihm (freigestellt) davor. Vorlage: hyperframes/ooia-hg/gestalte.py.

  .venv/bin/python -I hyperframes/huel-hg/gestalte.py <ganze-seiten-ordner> <ziel-ordner> [--vorschau <take.mp4> <rvm> <sek> ...]

Quellen (am 31.10.2026 mit Playwright/Chromium ohne Login in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen, siehe
aufnahme.cjs, screenshots/aufnahme.json und public/broll/huel/QUELLE.txt): je Seite ein Bild der ganzen Seite, die
Länderauswahl "Alle Läden" als sichtbarer Ausschnitt. Hier nur zusammengesetzt (oben meist die Kopfleiste von de.huel.com mit
dem Huel-Logo, darunter Abschnitte derselben Seite), leicht weichgezeichnet und leicht abgedunkelt, nach unten (hinter Pille
und Karte) etwas mehr. Sonst nichts dazugemalt. Keine Abschnitte mit Gesundheits- oder Wirkversprechen (Briefing: keine
Gesundheitsversprechen zu Ernährung), keine Prominenten-Fotos.
"""
import os
import sys

import cv2
import numpy as np

BILD = dict(scale=1.55, hoch=685, x=62)   # wie in src/projekte/huel/Video.tsx (Kopf oben, ab Hüfthöhe)
KOPF = ("alle", 140, 282)                 # Kopfleiste von de.huel.com (Menü, Huel-Logo, Konto, Warenkorb), auf allen Seiten gleich
# name: Teile (seite, y-von, y-bis in Pixeln des Bilds der ganzen Seite), von oben nach unten bis 1920
HG = {
    "produkte": [KOPF, ("home", 880, 1700), ("home", 3200, 4300)],          # Startseite: Produkte (Beutel, Flaschen), "Ernährung auf deine Art" (Kategorien)
    "bestseller": [KOPF, ("home", 14900, 16700)],                           # Startseite: "Huel Bestseller", Black Edition
    "sortiment": [("alle", 140, 2250)],                                     # "Alle Produkte – Entdecke unser gesamtes Sortiment", erste Reihe
    "teams": [("teams", 0, 1920)],                                          # Karriereseite "Our Teams" (Büro)
    "laender": [("laender", 0, 1920)],                                      # Länderauswahl "Alle Läden" (Europa)
    "standorte": [("orte", 10480, 11290), ("orte", 7940, 8480), ("orte", 8850, 9330), ("orte", 6140, 6840)],  # Karte der Standorte, New York City, Germany, London
    "recruiting": [("jobs", 19700, 21300), ("jobs", 22150, 22950)],         # Karriereseite: "Our Values", "Your Recruitment Process", "Our Workspaces"
    "neu": [KOPF, ("alle", 2200, 3400), ("alle", 9000, 9700)],             # Alle Produkte: Reihe mit "NEU" (Ramen), Bestseller Bundle
    "logistik": [("teams", 12260, 13080), ("teams", 13300, 14020), ("teams", 15540, 16340)],  # Our Teams: Logistics, Manufacturing, Product Supply
    "backoffice": [("teams", 8230, 8960), ("teams", 9840, 10560), ("teams", 7380, 8120)],     # Our Teams: Data, Engineering, Customer Experience
    "marke": [KOPF, ("ueber", 2440, 3060), ("alle", 9000, 10200)],           # Über uns: Produkte, Bestseller Bundle
}


def gestalte(seiten, name, sigma=1.2, dim=0.94):
    teile = []
    for seite, a, b in HG[name]:
        full = cv2.imread(os.path.join(seiten, seite + ".png"), cv2.IMREAD_COLOR)[:, :1080]
        teile.append(full[a:b])
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
    cv2.rectangle(ov, (190, 1070), (790, 1130), (20, 20, 20), -1)       # Pille (ungefähr)
    cv2.rectangle(ov, (80, 1150), (900, 1490), (245, 245, 245), -1)     # Karte
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
            v = cv2.resize(vorschau(bg, img, a), (360, 640))
            cv2.putText(v, name, (6, 630), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            kacheln.append(v)
        while len(kacheln) % 5:
            kacheln.append(np.zeros_like(kacheln[0]))
        bogen = np.vstack([np.hstack(kacheln[j:j + 5]) for j in range(0, len(kacheln), 5)])
        cv2.imwrite(os.path.join(os.environ.get("BOGEN_DIR", ziel), "bogen.jpg"), bogen, [cv2.IMWRITE_JPEG_QUALITY, 80])
