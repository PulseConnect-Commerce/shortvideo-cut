"""Gestaltet die Hintergründe für M09 · ooia (1080x1920, Video-Koordinaten) aus echten Screenshots von ooia.de und dem
Hilfe-Center ooia.gorgias.help (im Seitenfuß von ooia.de als "FAQs" verlinkt) und zeigt eine Vorschau mit ihm (freigestellt)
davor. Vorlage: hyperframes/purelei-hg/gestalte.py.

  .venv/bin/python -I hyperframes/ooia-hg/gestalte.py <ganze-seiten-ordner> <ziel-ordner> [--vorschau <take.mp4> <rvm> <sek> ...]

Quellen (am 31.10.2026 mit Playwright/Chromium ohne Login in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen, siehe
aufnahme.cjs, screenshots/aufnahme.json und public/broll/ooia/QUELLE.txt): je Seite ein Bild der ganzen Seite. Hier nur
zusammengesetzt (oben die Kopfleiste von ooia.de mit dem ooia-Logo, darunter ein oder zwei Abschnitte derselben Seite), leicht
weichgezeichnet und leicht abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr. Sonst nichts dazugemalt.
Sensibles Produkt (Briefing): nur sachliche Abschnitte (Produktbilder ohne Körper, Hilfe/FAQ, Größen, Pflege, Kaufbereich,
Marke); keine Körperbilder.
"""
import os
import sys

import cv2
import numpy as np

BILD = dict(scale=1.45, hoch=500, x=59)   # wie in src/projekte/ooia/Video.tsx (Kopf oben, ab Hüfthöhe)
KOPF = ("technologie", 0, 200)            # Kopfleiste (auf allen Seiten von ooia.de gleich; aufgenommen auf der Seite Technologie) von ooia.de (Hinweisleiste "90 TAGE RÜCKGABERECHT", Menü, Logo, Suche, Korb)
# name: Teile (seite, y-von, y-bis in Pixeln des Bilds der ganzen Seite), von oben nach unten bis 1920
HG = {
    "produkte": [KOPF, ("home", 6380, 8100)],           # Startseite: Kategorien PERIODE, EVERYDAY, BRA, MOMS (Produktbilder ohne Körper)
    "leine": [KOPF, ("pflege", 8640, 10360)],          # Pflege: ooias an der Wäscheleine (nur Produkte), "ooias richtig trocknen"
    "hilfe": [("hilfe", 0, 1920)],                     # Hilfe-Center: "ooia - we empower women*", Suche, Themen
    "faq": [KOPF, ("berater", 14450, 16170)],          # Ratgeber: "Häufig gestellte Fragen"
    "magazin": [("magazin", 0, 330), ("magazin", 1470, 3060)],   # Magazin: Kopf mit "OOIA CYCLE MAGAZIN", Artikel (ohne Titelbild)
    "pflege": [("pflege", 0, 1920)],                   # Pflege: "Pflege – Hier erfährst du Pflegehinweise ..." (gefaltete Wäsche)
    "hilfe2": [("hilfe", 0, 330), ("hilfe", 1900, 3490)],         # Hilfe-Center: Reklamation/Retouren, Größen, Waschen, FAQs, Kontakt
    "kauf": [KOPF, ("produkt", 2470, 4190)],           # Produktseite: Farbe, Größe mit "Größentabelle", "In den Warenkorb"
    "mission": [KOPF, ("mission", 1030, 1460), ("mission", 3180, 4470)],  # Mission & Werte: "Dafür steht ooia", Instagram-Absatz
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
            v = cv2.resize(vorschau(bg, img, a), (360, 640))
            cv2.putText(v, name, (6, 630), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            kacheln.append(v)
        while len(kacheln) % 5:
            kacheln.append(np.zeros_like(kacheln[0]))
        bogen = np.vstack([np.hstack(kacheln[j:j + 5]) for j in range(0, len(kacheln), 5)])
        cv2.imwrite(os.path.join(os.environ.get("BOGEN_DIR", ziel), "bogen.jpg"), bogen, [cv2.IMWRITE_JPEG_QUALITY, 80])
