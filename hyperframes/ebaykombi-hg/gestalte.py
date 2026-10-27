"""Gestaltet die Hintergründe für N09 · eBay-Kombirabatte (1080x1920, Video-Koordinaten) aus echten Screenshots
(Playwright, Handy-Ansicht 412 css-px, 2,62-fach, am 27.10.2026, aufnahme.cjs) und zeigt eine Vorschau mit ihm
(freigestellt) davor. Vorbild: hyperframes/amazonbgh-hg/gestalte.py.

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <rvm.torchscript>]

Quellen (nur zugeschnitten, skaliert, leicht abgedunkelt/weichgezeichnet; die grünen Markierungen sind <mark>-Hervorhebungen
der Sätze, über die er spricht; nichts dazugemalt):
  screenshots/ebay-ganz.png: https://www.ebay.de/help/selling/selling-tools/selling-bundle-discounts?id=5842
      (eBay-Hilfe "Kombirabatte für Verkäufer"; markiert: "beim Kauf von 2, 3 oder mehr Exemplaren desselben Artikels oder
      beim Kauf mehrerer unterschiedlicher Artikel festlegen.", "An der Kasse wird der Endbetrag angezeigt …", "Sie selbst
      müssen den Rabatt nicht berechnen …", "Wählen Sie danach den Rabattprozentsatz für 2, 3 und 4+ Artikel aus",
      "berechnen wir den neuen Preis für die Artikel, die der Käufer behält.")
  screenshots/hb-ganz.png: https://ohn.haendlerbund.de/themen/marktplaetze/mehr-artikel-bestellung-ebay-kombirabatte-haendler
      (Händlerbund / Onlinehändler News, 26.10.2026; markiert: "Möglich sind bis zu drei Stufen, etwa:", "Die Prozentwerte
      sind Beispiele aus der Ankündigung.", "Kombirabatte sind nicht standardmäßig aktiv.")
Je Bild ein oder zwei Ausschnitte derselben Seite (Quell-x/y von/bis in Pixeln, Maßstab, Lage); der Rest weiß. Das Wichtige
steht oben im Streifen über dem Kopf (y ~120-300) und links/rechts neben dem Kopf; nach unten (hinter Pille und Karte)
etwas dunkler.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
BILD = dict(scale=1.6, hoch=817, x=72)   # wie in src/projekte/ebaykombi/Video.tsx
SS = os.path.join(HIER, "screenshots")
K = 2.62  # css-px -> Bild-px

# name: Liste von Ausschnitten (datei, x0, x1, y0, y1, maßstab, ziel_x, ziel_y)
HG = {
    # Kopf der eBay-Hilfe: Logo "eBay Kundenservice", darunter die Überschrift "Kombirabatte für Verkäufer"
    "hg-ebay-kopf": [("ebay-ganz.png", 0, 1079, 95, 250, 1.0, 0, -30),
                     ("ebay-ganz.png", 0, 1079, 700, 1010, 1.0, 0, 90)],
    # "So funktionieren Kombirabatte": "An der Kasse wird der Endbetrag angezeigt …", "Sie selbst müssen den Rabatt nicht berechnen …"
    "hg-ebay-funktion": [("ebay-ganz.png", 0, 1079, int(1037 * K) - 20, int(1037 * K) + 1600, 1.0, 0, -540)],
    # "Einrichten von Kombirabatten": "Wählen Sie danach den Rabattprozentsatz für 2, 3 und 4+ Artikel aus"
    "hg-ebay-einrichten": [("ebay-ganz.png", 0, 1079, int(1373 * K) - 20, int(1373 * K) + 1900, 1.0, 0, -593)],
    # Einleitung: "… beim Kauf von 2, 3 oder mehr Exemplaren desselben Artikels oder beim Kauf mehrerer unterschiedlicher Artikel festlegen."
    "hg-ebay-intro": [("ebay-ganz.png", 0, 1079, int(795 * K) - 20, int(795 * K) + 1700, 1.0, 0, -250)],
    # "So funktionieren Rückgaben": "… berechnen wir den neuen Preis für die Artikel, die der Käufer behält."
    "hg-ebay-rueckgabe": [("ebay-ganz.png", 0, 1079, int(2417 * K) - 30, int(2417 * K) + 1800, 1.0, 0, -120)],
    # Händlerbund: "Möglich sind bis zu drei Stufen, etwa:" ab 2 / 3 / 4 Artikeln: 5 / 10 / 15 Prozent, "Beispiele aus der Ankündigung"
    "hg-hb-stufen": [("hb-ganz.png", 0, 1075, int(1811 * K) - 10, int(1811 * K) + 1700, 1.0, 2, -60)],
    # Händlerbund: "Aktivierung und Auswahl der Artikel", "Kombirabatte sind nicht standardmäßig aktiv."
    "hg-hb-aktiv": [("hb-ganz.png", 0, 1075, int(2533 * K) - 40, int(2533 * K) + 1700, 1.0, 2, -165)],
}


def gestalte(teile, dim=0.95):
    out = np.empty((1920, 1080, 3), np.float32)
    out[:] = 255.0
    for datei, x0, x1, y0, y1, s, zx, zy in teile:
        img = cv2.imread(os.path.join(SS, datei), cv2.IMREAD_COLOR)[y0:y1, x0:x1].astype(np.float32)
        m = np.float32([[s, 0, zx], [0, s, zy]])
        lay = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC,
                             borderMode=cv2.BORDER_CONSTANT, borderValue=(-1, -1, -1))
        mask = (lay >= 0).all(axis=2)
        out[mask] = lay[mask]
    out = cv2.GaussianBlur(out, (0, 0), 1.0)
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 900) / 500, 0, 1)
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
    cv2.rectangle(ov, (200, 1035), (780, 1101), (20, 20, 20), -1)       # Pille (ungefähr)
    cv2.rectangle(ov, (80, 1118), (900, 1468), (245, 245, 245), -1)     # Karte
    comp = cv2.addWeighted(ov, 0.75, comp, 0.25, 0)
    for y in (260, 280):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


# Take-Sekunde für die Vorschau je Hintergrund
VZ = {"hg-ebay-kopf": 10.0, "hg-ebay-funktion": 61.0, "hg-ebay-einrichten": 48.5, "hg-ebay-intro": 53.0,
      "hg-ebay-rueckgabe": 111.0, "hg-hb-stufen": 44.0, "hg-hb-aktiv": 67.0}

if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    nur = os.environ.get("NUR")
    for name, teile in HG.items():
        if nur and name not in nur.split(","):
            continue
        bg = gestalte(teile)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, rvm = sys.argv[i + 1], sys.argv[i + 2]
            v = vorschau(bg, take, VZ[name], rvm)
            cv2.imwrite(os.path.join(ziel, "vorschau-" + name + ".jpg"), cv2.resize(v, (360, 640)))
        print("ok", name)
