"""Gestaltet die Hintergründe für N07 · Temu-Warenkorb (1080x1920, Video-Koordinaten) aus echten Screenshots
(Playwright, Handy-Ansicht 412 css-px, 2,62-fach, am 27.10.2026, aufnahme.cjs) und zeigt eine Vorschau mit ihm
(freigestellt) davor. Vorbild: hyperframes/ebaykombi-hg/gestalte.py (N09).

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <rvm.torchscript>]

Quellen (nur zugeschnitten, leicht abgedunkelt/weichgezeichnet; die grünen Markierungen sind <mark>-Hervorhebungen der
Sätze, über die er spricht; nichts dazugemalt):
  screenshots/nh-ganz.png: https://www.neuhandeln.de/beitraege/db/018477grollmann.html
      (neuhandeln.de, Dominik Grollmann, 26.10.2026, "Regulierung wirkt: Temu in Deutschland 59 Prozent teurer als in der
      Schweiz"; markiert u. a.: "Ein identischer Warenkorb kostet beim Online-Marktplatz Temu in Deutschland 59 Prozent mehr
      als in der Schweiz.", "Selbst wenn diese vollständig herausgerechnet werden, liegt der deutsche Warenkorb allerdings
      mit 111,94 Euro noch deutlich über dem Schweizer Preisniveau.", "Belege für diese Vermutungen liefert der Vergleich
      allerdings nicht.")
  screenshots/cp-ganz.png: https://blog.carpathia.ch/2026/10/25/gleicher-temu-warenkorb-in-deutschland-59-teurer-als-in-der-schweiz/
      (Carpathia Digital Business Blog, David Morant, 25.10.2026; markiert: "einen identischen Warenkorb mit Topsellern
      aus verschiedenen Produktkategorien zusammengestellt.", die Tabellenzellen "EUR 126.94" / "EUR 80.0", "Im deutschen
      Checkout werden EUR 21.42 an Einfuhrabgaben ausgewiesen. Temu subventioniert davon EUR 6.42; für den Warenkorb
      bleiben EUR 15 übrig.", "Denkbar sind Schweiz-spezifische Aktionspreise")
Je Bild ein Ausschnitt der Seite (Quell-y in css-px, Maßstab, Lage); der Rest weiß. Das Wichtige steht oben im Streifen
über dem Kopf (y ~0-300, Kopfoberkante ~308) und links/rechts neben dem Kopf; nach unten (hinter Pille und Karte) etwas
dunkler.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
BILD = dict(scale=1.6, hoch=790, x=61)   # wie in src/projekte/temuwarenkorb/Video.tsx
SS = os.path.join(HIER, "screenshots")
K = 2.62  # css-px -> Bild-px


def teil(datei, css_von, css_bis, ziel_y_von, css_ziel, s=1.0):
    """Ausschnitt css_von..css_bis der Seite, so gelegt, dass css-y `css_ziel` bei Video-y `ziel_y_von` liegt"""
    y0, y1 = int(css_von * K), int(css_bis * K)
    zy = ziel_y_von - (css_ziel - css_von) * K * s
    return (datei, 0, 1079, y0, y1, s, 0, int(round(zy)))


# name: Liste von Ausschnitten (datei, x0, x1, y0, y1, maßstab, ziel_x, ziel_y)
HG = {
    # neuhandeln.de: Rubrik "China-Konkurrenz", Überschrift "Regulierung wirkt: Temu in Deutschland 59 Prozent teurer als in
    # der Schweiz" (über dem Kopf), darunter "von Dominik Grollmann" und "26.10.2026 …" neben dem Kopf
    "hg-nh-kopf": [teil("nh-ganz.png", 185, 1000, 105, 216)],
    # Carpathia-Blog: Logo-Leiste, dann Überschrift "Gleicher Temu-Warenkorb: In Deutschland 59% teurer als in der Schweiz",
    # "Von David Morant – 25. Oktober 2026" (die Überschrift beginnt bei y 40, damit "59% teurer" über dem Kopf steht)
    "hg-cp-kopf": [teil("cp-ganz.png", 110, 900, 40, 123)],
    # Carpathia-Blog: Tabelle "Temu Warenkorb / Preis in EUR / Preis in CHF", Deutschland EUR 126.94, Schweiz EUR 80.0
    # (markiert), "CHF/EUR Kurs 0.92 vom 23.10.26", darunter das Bild "Temu_Checkoutvergleich" (hinter ihm)
    "hg-cp-tabelle": [teil("cp-ganz.png", 880, 1700, 12, 903)],
    # Carpathia-Blog: "Im deutschen Checkout werden EUR 21.42 an Einfuhrabgaben ausgewiesen. Temu subventioniert davon
    # EUR 6.42; für den Warenkorb bleiben EUR 15 übrig." (markiert, über dem Kopf)
    "hg-cp-abgaben": [teil("cp-ganz.png", 1780, 2500, 50, 1878)],
    # neuhandeln.de: "Selbst wenn diese vollständig herausgerechnet werden, liegt der deutsche Warenkorb allerdings mit
    # 111,94 Euro noch deutlich über dem Schweizer Preisniveau." (markiert, über dem Kopf)
    "hg-nh-abgaben": [teil("nh-ganz.png", 1420, 2150, 60, 1484)],
    # neuhandeln.de: "… Belege für diese Vermutungen liefert der Vergleich allerdings nicht." (markiert, über dem Kopf)
    "hg-nh-ursache": [teil("nh-ganz.png", 1690, 2450, 150, 1844)],
    # Carpathia-Blog: "Denkbar sind Schweiz-spezifische Aktionspreise, …" (markiert, über dem Kopf)
    "hg-cp-aktion": [teil("cp-ganz.png", 2080, 2800, 120, 2191)],
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
    for y in (280,):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 2)
    return comp


# Take-Sekunde für die Vorschau je Hintergrund
VZ = {"hg-nh-kopf": 22.0, "hg-cp-kopf": 33.0, "hg-cp-tabelle": 39.0, "hg-cp-abgaben": 45.0, "hg-nh-abgaben": 48.5,
      "hg-nh-ursache": 63.0, "hg-cp-aktion": 74.0}

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
