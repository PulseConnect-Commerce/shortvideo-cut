"""Gestaltet die Hintergründe für N08 · Etsy: Neue KI-Regeln (1080x1920, Video-Koordinaten) aus echten Screenshots
(Playwright, Handy-Ansicht 412 css-px, 2,62-fach, am 27.10.2026, aufnahme.cjs) und zeigt eine Vorschau mit ihm
(freigestellt) davor. Vorbild: hyperframes/temuwarenkorb-hg/gestalte.py (N07).

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <rvm.torchscript>]

Quellen (nur zugeschnitten, leicht abgedunkelt/weichgezeichnet; die grünen Markierungen sind <mark>-Hervorhebungen der
Sätze, über die er spricht; nichts dazugemalt). Das Artikelbild von OnlinehändlerNews (Depositphotos) ist nie im Bild.
  screenshots/ohn-*.png: https://ohn.haendlerbund.de/themen/marktplaetze/etsy-shop-druck-neue-ki-regeln
      (OnlinehändlerNews / Händlerbund, Sandra May, 26.10.2026, "Etsy-Shop unter Druck: Neue KI-Regeln zwingen zum
      Foto-Marathon")
  screenshots/hilfe-bilder-*.png: https://help.etsy.com/hc/de/articles/44297885802647 (Etsy-Hilfe, "Inwiefern gelten
      Etsys Voraussetzungen für Artikelbilder für meine Artikel?")
  screenshots/hilfe-verkaufen-*.png: https://help.etsy.com/hc/de/articles/360024112614 (Etsy-Hilfe, "Was kann ich auf
      Etsy verkaufen?", Abschnitt "KI-generierte Inhalte")
Je Bild ein Ausschnitt (Quell-y in css-px relativ zum Screenshot, Maßstab, Lage); der Rest weiß. Das Wichtige steht oben
im Streifen über dem Kopf (y ~20-300, Kopfoberkante ~309); nach unten (hinter Pille und Karte) etwas dunkler.
"""
import json
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
BILD = dict(scale=1.62, hoch=815, x=47)   # wie in src/projekte/etsyki/Video.tsx
SS = os.path.join(HIER, "screenshots")
K = 2.62  # css-px -> Bild-px
INFO = json.load(open(os.path.join(SS, "aufnahme.json"), encoding="utf-8"))["ziele"]


def teil(datei, css_von, css_bis, ziel_y, css_ziel, s=1.0):
    """Ausschnitt css_von..css_bis (Seiten-css-y) aus dem Screenshot `datei`, so gelegt, dass Seiten-css-y `css_ziel`
    bei Video-y `ziel_y` liegt; horizontal mittig"""
    ziel, var = datei[:-4].rsplit("-", 1)
    clip = INFO[ziel]["varianten"][var]["clipTop"]
    y0, y1 = int((css_von - clip) * K), int((css_bis - clip) * K)
    zy = ziel_y - (css_ziel - css_von) * K * s
    zx = (1080 - 1079 * s) / 2
    return (datei, 0, 1079, max(0, y0), y1, s, int(round(zx)), int(round(zy)))


HG = {
    # OHN, erster Absatz: "… Wer auf Etsy verkauft, muss seine Listings prüfen – auch die bestehenden." (markiert)
    "hg-ohn-intro": [teil("ohn-kopf.png", 1062, 1300, 18, 1066, 0.78)],
    # OHN Kopf: Rubrik "Kampf gegen KI-Slop", Überschrift "Etsy-Shop unter Druck: Neue KI-Regeln zwingen zum
    # Foto-Marathon", Datum 26.10.2026 (über dem Kopf, ohne das Artikelbild darunter)
    "hg-ohn-kopf": [teil("ohn-kopf.png", 108, 292, 14, 108, 0.68)],
    # Etsy-Hilfe: "Etsy schreibt für die meisten Artikel mindestens ein unbearbeitetes Foto vor." (markiert)
    "hg-etsy-foto": [teil("hilfe-bilder-foto.png", 432, 900, 60, 438, 1.0)],
    # Etsy-Hilfe: "Für weitere Bilder kannst du Bildbearbeitungsprogramme nutzen, auch solche mit KI, solange …" (markiert)
    "hg-etsy-weitere": [teil("hilfe-bilder-weitere.png", 456, 900, 30, 460, 0.8)],
    # Etsy-Hilfe: "Was gilt, wenn ich digitale Downloads …" / "Die Anforderungen können je nachdem, was du verkaufst,
    # unterschiedlich sein:" (markiert), darunter Print-on-Demand-Artikel, Digitale Downloads …
    "hg-etsy-ausnahmen": [teil("hilfe-bilder-ausnahmen.png", 2905, 3600, 8, 2909, 0.72)],
    # Etsy-Hilfe: "Bestimmte Arten von KI-generierten Inhalten sind auf Etsy nicht erlaubt, darunter: • Von Bots erstellte
    # Inhalte • KI-generierte Funktionsanleitungen, wie zum Beispiel Bastelvorlagen, Rezepte und Anleitungen" (markiert)
    "hg-etsy-anleitungen": [teil("hilfe-verkaufen-anleitungen.png", 4805, 5250, 40, 4812, 1.0)],
    # dieselbe Liste, markiert: "Von Bots erstellte Inhalte"
    "hg-etsy-bots": [teil("hilfe-verkaufen-bots.png", 4740, 5250, 30, 4745, 1.0)],
    # OHN: "Die neuen Regeln gelten nicht nur für neue Angebote. Etsy stellt klar: Wer bestehende Listings hat, die die
    # Anforderungen nicht erfüllen, muss sie anpassen." (markiert)
    "hg-ohn-bestehende": [teil("ohn-bestehende.png", 7776, 8250, 10, 7779, 0.68)],
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
    cv2.line(comp, (0, 280), (1080, 280), (0, 0, 255), 2)
    return comp


# Take-Sekunde für die Vorschau je Hintergrund
VZ = {"hg-ohn-intro": 25.5, "hg-ohn-kopf": 31.5, "hg-etsy-foto": 36.0, "hg-etsy-weitere": 50.0, "hg-etsy-ausnahmen": 55.0,
      "hg-etsy-anleitungen": 61.0, "hg-etsy-bots": 67.0, "hg-ohn-bestehende": 84.0}

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
