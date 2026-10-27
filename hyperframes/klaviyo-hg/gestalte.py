"""Gestaltet die Hintergründe für A04 · Klaviyo (1080x1920, Video-Koordinaten) aus echten Screenshots von klaviyo.com,
dem Klaviyo Help Center und dem Klaviyo-Eintrag im Shopify App Store, und zeigt eine Vorschau mit ihm (freigestellt)
davor. Vorbild: hyperframes/shopifyflow-hg.

  node tools/py.mjs ../hyperframes/klaviyo-hg/gestalte.py <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Quellen (alle am 27.10.2026 mit Playwright/Chromium ohne Login in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen,
siehe public/broll/klaviyo/QUELLE.txt und screenshots/aufnahme.json): screenshots/*.png (Bildschirm 1080x1920, die
Kopfleiste der Seite mit dem Logo oben, der Abschnitt direkt darunter). Nur zugeschnitten, leicht weichgezeichnet
(Briefing: "leicht unscharfer Flow Builder") und leicht abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr.
Anonymisiert (Briefing: "Kontakte, E-Mails, Umsätze und Profilinformationen vollständig anonymisieren"): die
Beispiel-Namen in der Segment-Liste von klaviyo.com und Konto-Name/E-Mail im Segment-Builder-Bild stark weichgezeichnet.
Sonst nichts dazugemalt.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
BILD = dict(scale=1.4, hoch=440, x=97)   # wie in src/projekte/klaviyo/Video.tsx

HG = {
    # name: (datei, weichzeichnen (Sigma), abdunkeln, anonymisieren [(x0, y0, x1, y1), ...])
    "hg-app": ("app.png", 1.0, 0.94, []),            # Shopify App Store: "Klaviyo E-Mail-Marketing & SMS" (Name, Bewertung, Entwickler Klaviyo)
    "hg-daten": ("daten.png", 1.0, 0.93, []),        # klaviyo.com Shopify-Integration: "Alle Daten, die du benötigst. Alles an einem Ort." (Datensynchronisierung Shopify)
    "hg-segment": ("segment.png", 1.0, 0.93,         # klaviyo.com Segmentierung: "deine ideale Zielgruppe zu erreichen", Segment-Builder
                   [(112, 636, 290, 684), (112, 692, 290, 740), (112, 748, 296, 794)]),   # Beispiel-Namen der Segment-Liste
    "hg-welcome": ("welcome.png", 1.6, 0.93, []),    # Help Center "So erstellst du eine E-Mail-Welcome-Serie": Flow-Builder (Welcome Series Email #1, Wait 3 days ...)
    "hg-kauf": ("kauf.png", 1.6, 0.93, []),          # klaviyo.com Shopify-Integration: Flow "Einmal bestellt" → "Dem Empfang von SMS zugestimmt?" → "Bewertung abgeben"
    "hg-optin": ("optin.png", 1.0, 0.93, []),        # Help Center "Grundlegendes zum Double-Opt-in-Verfahren"
    "hg-gezielt": ("gezielt.png", 1.0, 0.96,         # klaviyo.com Segmentierung (Kopf): "Maßgeschneidertes Marketing dank detaillierter Kundensegmentierung"
                   [(40, 1740, 270, 1805)]),          # Konto-Name und E-Mail im Segment-Builder-Bild
}


def gestalte(src, sigma, dim, anonym):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    for x0, y0, x1, y1 in anonym:
        teil = img[y0:y1, x0:x1]
        img[y0:y1, x0:x1] = cv2.GaussianBlur(teil, (0, 0), 9)
        img[y0:y1, x0:x1] = cv2.GaussianBlur(img[y0:y1, x0:x1], (0, 0), 9)
    out = img[:1920, :1080].copy()
    out = cv2.GaussianBlur(out, (0, 0), sigma)
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
    for name, (datei, sigma, dim, anonym) in HG.items():
        if nur and name not in nur.split(","):
            continue
        p = os.path.join(SS, datei)
        if not os.path.exists(p):
            print("fehlt", p)
            continue
        bg = gestalte(p, sigma, dim, anonym)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, t, rvm = sys.argv[i + 1], float(sys.argv[i + 2]), sys.argv[i + 3]
            v = vorschau(bg, take, t, rvm)
            os.makedirs(os.path.join(HIER, "vorschau"), exist_ok=True)
            cv2.imwrite(os.path.join(HIER, "vorschau", "vorschau-" + name + ".jpg"), cv2.resize(v, (540, 960)))
        print("ok", name)
