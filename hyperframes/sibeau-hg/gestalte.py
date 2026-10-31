"""Gestaltet die Marken-Hintergründe für M10 · SI BEAU (1080x1920, Video-Koordinaten) und zeigt eine Vorschau mit ihm (freigestellt)
davor. Vorlage: hyperframes/huel-hg/gestalte.py.

  .venv/bin/python -I hyperframes/sibeau-hg/gestalte.py <bilder-ordner> <ziel-ordner> [--vorschau <take.mp4> <rvm> <sek> ...]

Die offiziellen Seiten von SI BEAU sind am 31.10.2026 nicht mehr erreichbar (si-beau.com: keine Verbindung; sibeau-women.com, die
Adresse auf der Seite der Kultur- und Kreativpiloten: abgelaufen, von GoDaddy geparkt; das Webarchiv ist aus dieser Sitzung nicht
erreichbar). Darum keine Shop-Screenshots, sondern die echten Markenfotos (Produkte, Kollektion) aus den beiden öffentlichen Quellen:
  - Pressefoto "Produkt" der Kultur- und Kreativpiloten (Titelträger 2019, "Fotomaterial zum Download", © Uwe Duettmann):
    https://kultur-kreativpiloten.de/titeltraeger-in/si-beau/ (sibeau_uweduettmann_12_re.jpg)
  - Bilder im Shopify-Beitrag aus dem Briefing (6. Jan. 2020, "Bilder von Uwe Duettmann"):
    https://www.shopify.com/de/blog/kultur-und-kreativpilotenpreis-si-beau (si-beau-shopify.jpg, Debeauvoir_Blazer1.jpg, Team_3.jpg)
Nur verkleinert/vergrößert, verschoben und so beschnitten, dass keine Gesichter im Bild sind (fremde Gesichter neben seinem Kopf, Regie
nach M08); der einfarbige Studiohintergrund wird am Rand fortgesetzt (Randpixel wiederholt). Leicht weichgezeichnet und leicht
abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr; oben links klein der Bildnachweis. Sonst nichts verändert, nichts
dazugemalt, keine Logos anderer Firmen.
"""
import os
import sys

import cv2
import numpy as np

BILD = dict(scale=1.62, hoch=814, x=44)   # wie in src/projekte/sibeau/Video.tsx (Kopf oben, ab Hüfthöhe)
# name: (datei, skala, versatz_x, versatz_y): das Foto wird um <skala> vergrößert und mit seiner linken oberen Ecke bei
# (versatz_x, versatz_y) in Video-Pixeln angelegt; was es nicht bedeckt, setzt die Randfarbe fort
HG = {
    # Hook: Pressefoto "Produkt" (Kultur- und Kreativpiloten): dunkler Anzug/Jumpsuit, gestreifter Stuhl, ohne Gesicht
    "produkt": ("sibeau_uweduettmann_12_re.jpg", 1.7, -930, -40),
    # "Die Marke nennt sich SI BEAU": Titelbild im Shopify-Beitrag, zwei Jumpsuits (schwarz, rot), ab Schulter
    "kollektion": ("si-beau-shopify-gross.jpg", 3.1, -560, -300),
    # "Businesskleidung ... professionell ... bequem": Anzug Debeauvoir (Shopify-Beitrag), ab Schulter
    "blazer": ("Debeauvoir_Blazer1.jpg", 0.46, -40, -600),
    # "bei Schnitten und auch Farben mitreden": Studio mit orangem Hintergrund und Dampfglätter (Shopify-Beitrag), ab Schulter
    "studio": ("Team_3.jpg", 0.8, -376, -1260),
    # "die wichtigste Erkenntnis": Pressefoto "Produkt", unterer Teil (Hosenbein, Schuh, Stuhl), ohne Gesicht
    "detail": ("sibeau_uweduettmann_12_re.jpg", 2.3, -1300, -1050),
}
NACHWEIS = {
    "produkt": "Foto: Uwe Duettmann · Kultur- und Kreativpiloten",
    "kollektion": "Foto: Uwe Duettmann · via Shopify-Blog 2020",
    "blazer": "Foto: Uwe Duettmann · via Shopify-Blog 2020",
    "studio": "Foto: Uwe Duettmann · via Shopify-Blog 2020",
    "detail": "Foto: Uwe Duettmann · Kultur- und Kreativpiloten",
}


def gestalte(bilder, name, sigma=1.6, dim=0.93):
    datei, s, ox, oy = HG[name]
    src = cv2.imread(os.path.join(bilder, datei), cv2.IMREAD_COLOR)
    m = np.float32([[s, 0, ox], [0, s, oy]])
    img = cv2.warpAffine(src, m, (1080, 1920), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    out = cv2.GaussianBlur(img.astype(np.float32), (0, 0), sigma)
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 1000) / 500, 0, 1)
    out = np.clip(out * (dim - 0.12 * ramp), 0, 255).astype(np.uint8)
    # Bildnachweis oben links (in der sicheren Fläche ab y 280, klein)
    txt = NACHWEIS[name]
    for dx, dy, col in ((2, 2, (0, 0, 0)), (0, 0, (240, 240, 240))):
        cv2.putText(out, txt, (64 + dx, 312 + dy), cv2.FONT_HERSHEY_SIMPLEX, 0.62, col, 1 if col[0] else 2, cv2.LINE_AA)
    return out


def vorschau(bg, img, a):
    s, hoch, bx = BILD["scale"], BILD["hoch"], BILD["x"]
    m = np.float32([[s, 0, 540 - 540 * s - bx], [0, s, -hoch]])
    fg = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_LINEAR)
    al = cv2.warpAffine(a, m, (1080, 1920), flags=cv2.INTER_LINEAR)[..., None]
    b = cv2.cvtColor(bg, cv2.COLOR_BGR2RGB).astype(np.float32)
    comp = cv2.cvtColor(np.clip(al * fg + (1 - al) * b, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    ov = comp.copy()
    cv2.rectangle(ov, (190, 1120), (790, 1180), (20, 20, 20), -1)       # Pille (ungefähr)
    cv2.rectangle(ov, (80, 1196), (900, 1496), (245, 245, 245), -1)     # Karte
    comp = cv2.addWeighted(ov, 0.6, comp, 0.4, 0)
    for y in (280, 1500):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 2)
    cv2.line(comp, (900, 0), (900, 1920), (0, 0, 255), 2)
    return comp


if __name__ == "__main__":
    bilder, ziel = sys.argv[1], sys.argv[2]
    os.makedirs(ziel, exist_ok=True)
    fertig = {}
    for name in HG:
        bg = gestalte(bilder, name)
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
        bilder_take = []
        for t in zeiten:
            raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", str(t), "-i", take, "-frames:v", "1", "-f", "rawvideo",
                                  "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
            img = np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3)
            small = cv2.resize(img, (540, 960), interpolation=cv2.INTER_AREA)
            with torch.no_grad():
                _, pha, *_ = model(torch.from_numpy(small.copy()).permute(2, 0, 1)[None].float() / 255, None, None, None, None, 0.4)
            bilder_take.append((img, cv2.resize(pha[0, 0].numpy(), (1080, 1920))))
        kacheln = []
        for k, (name, bg) in enumerate(fertig.items()):
            img, a = bilder_take[k % len(bilder_take)]
            v = cv2.resize(vorschau(bg, img, a), (432, 768))
            cv2.putText(v, name, (6, 760), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            kacheln.append(v)
        bogen = np.hstack(kacheln)
        cv2.imwrite(os.path.join(os.environ.get("BOGEN_DIR", ziel), "bogen.jpg"), bogen, [cv2.IMWRITE_JPEG_QUALITY, 82])
