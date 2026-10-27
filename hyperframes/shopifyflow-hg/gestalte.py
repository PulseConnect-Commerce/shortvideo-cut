"""Gestaltet die Hintergründe für S04 · Shopify Flow (1080x1920, Video-Koordinaten) aus echten Screenshots
offizieller Shopify-Hilfeseiten und zeigt eine Vorschau mit ihm (freigestellt) davor. Vorbild: hyperframes/kollektionen-hg.

  python gestalte.py <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Quellen (alle am 27.10.2026 mit Playwright/Chromium in der Handy-Ansicht 432 css-px, 2,5-fach aufgenommen, siehe
public/broll/shopifyflow/QUELLE.txt): screenshots/*.png (Bildschirm-Ausschnitt 1080x1920, der Abschnitt steht oben
direkt unter der Kopfleiste "Hilfe"). Nur zugeschnitten,
minimal weichgezeichnet und leicht abgedunkelt, nach unten (hinter Pille und Karte) etwas mehr. Nichts dazugemalt; die
schwebende Leiste "Frage nach diesem Artikel" ist bei der Aufnahme ausgeblendet (wie ein Cookie-Banner).
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
BILD = dict(scale=1.38, hoch=687, x=69)   # wie in src/projekte/shopifyflow/Video.tsx
KOPF = 150                                 # Höhe der Kopfleiste der Hilfeseite (px bei 1080 Breite)

HG = {
    # name: (datei, quelle_y (None = Ausschnitt wie aufgenommen), abdunkeln)
    "hg-aufgaben": ("a-aufgaben.png", None, 0.93),            # "Erste Schritte mit Shopify Flow": mühsame und repetitive Aufgaben
    "hg-beispiel": ("a-beispiel.png", None, 0.93),            # "Beispiele für Workflows": Workflows für Bestellungen, dein Team benachrichtigen
    "hg-drei": ("a-drei.png", None, 0.93),                    # "Erste Schritte": 3 Arten von Schritten, Trigger, Bedingungen, Aktionen
    "hg-trigger": ("a-trigger.png", None, 0.93),              # Trigger "Bestellung erstellt"
    "hg-bedingung": ("a-bedingung.png", None, 0.93),          # "Bedingungen in Shopify Flow verstehen": Wahr / Falsch
    "hg-aktion": ("a-aktion.png", None, 0.93),                # "Aktionen verstehen": Kommunikationsaktionen, E-Mail an dein Team
    "hg-flow": ("a-flow.png", None, 0.93),                    # "Shopify Flow": Auslöser, Bedingungen und Aktionen
    "hg-vorlage": ("a-vorlage.png", None, 0.93),              # "Einen Workflow mithilfe einer Vorlage erstellen"
    "hg-testen": ("a-testen.png", None, 0.93),                # "Einen Workflow in Shopify Flow testen": testen, bevor du ihn aktivierst
    "hg-testbestellung": ("a-testbestellung.png", None, 0.93),  # "Ereignisse aufzeichnen": selbst eine echte Bestellung erstellen
    "hg-aktionen": ("a-aktionen.png", None, 0.93),            # "Aktionen in Shopify Flow": Änderungen im Shop, HTTP-Anfragen an externe Dienste
    "hg-plan": ("a-plan.png", None, 0.93, 1300),              # "Plananforderung": HTTP-Anfrage senden nur Grow, Advanced, Plus (ab y 1300 abgeschnitten: dort beginnt ein eingebettetes YouTube-Video)
    "hg-ki": ("a-ki.png", None, 0.93),                        # "Einen Workflow mit Sidekick generieren"
    "hg-ki-pruefen": ("a-ki-pruefen.png", None, 0.93),        # "Du solltest den generierten Workflow gründlich überprüfen und testen"
}


def gestalte(src, y0, dim, bis=None):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    unten = min(img.shape[0], bis or img.shape[0])
    fill = np.median(img[unten - 40:unten, :, :].reshape(-1, 3), axis=0)   # Seitenhintergrund (unten bzw. über dem Schnitt)
    out = np.empty((1920, 1080, 3), np.float32)
    out[:] = fill
    if y0 is None:
        teil = img[:min(1920, bis or 1920), :1080]
        out[:teil.shape[0]] = teil
    else:
        out[:KOPF] = img[:KOPF, :1080]
        teil = img[y0:y0 + 1920 - KOPF, :1080]
        out[KOPF:KOPF + teil.shape[0]] = teil
    out = cv2.GaussianBlur(out, (0, 0), 1.0)
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
    for name, (datei, y0, dim, *rest) in HG.items():
        if nur and name not in nur.split(","):
            continue
        p = os.path.join(SS, datei)
        if not os.path.exists(p):
            print("fehlt", p)
            continue
        bg = gestalte(p, y0, dim, *rest)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, t, rvm = sys.argv[i + 1], float(sys.argv[i + 2]), sys.argv[i + 3]
            v = vorschau(bg, take, t, rvm)
            cv2.imwrite(os.path.join(ziel, "vorschau-" + name + ".jpg"), cv2.resize(v, (540, 960)))
        print("ok", name)
