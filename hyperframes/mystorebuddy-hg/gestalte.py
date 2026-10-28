"""Schneidet die Quellen-Bilder für A05 · MyStoreBuddy ("Quelle groß, er klein in der Ecke", karten-aufbau.md 2026-10-28)
aus echten Aufnahmen zu, nichts dazugemalt:

  node tools/py.mjs ../hyperframes/mystorebuddy-hg/gestalte.py <ziel-ordner>

Quellen (am 28.10.2026 aufgenommen bzw. geladen, siehe public/broll/mystorebuddy/QUELLE.txt):
  - screenshots/app-ganz.png: Shopify-App-Store-Eintrag https://apps.shopify.com/mystorebuddy?locale=de, Playwright/Chromium
    ohne Login, Handy-Ansicht 412 css-px, 2,62-fach (aufnahme.cjs, aufnahme.json); im Preisbereich ist der Satz "bis zu 50
    Beratungsgespräche im Monat" grün hinterlegt (Briefing: "50 Beratungsgespräche/Monat gut lesbar markieren").
  - screenshots/galerie/g4-chat-beispiel.png: offizielles Bild aus dem App-Store-Eintrag ("Chat-Beispiel: Rückfrage,
    Produktkarten, In den Warenkorb", 1600x900, vom Shopify-CDN).
Ergebnis (Breite 1080 wie am Handy):
  quelle-kopf.jpg     App-Eintrag oben: App-Store-Leiste, Icon, Name, Preisgestaltung, Bewertung, Entwickler
  quelle-kurz.jpg     Kurzbeschreibung, "MyStoreBuddy verkauft wie dein bester Fachverkäufer ...", Funktionsliste
  quelle-preis.jpg    Preisbereich mit dem Free-Plan und der Markierung
  quelle-chat.jpg     offizielles Chat-Bild: das Chat-Fenster aus g4 (Ausschnitt x 664-1010, y 236-630), 1,9-fach
                      (Lanczos) auf hellem Grund in der Farbe des Bildrands, links oben, damit unten rechts Platz für ihn
                      als Bubble bleibt
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")


def breit(img):
    """auf 1080 Breite auffüllen (Seitenfarbe weiß)"""
    h, w = img.shape[:2]
    if w < 1080:
        img = cv2.copyMakeBorder(img, 0, 0, 0, 1080 - w, cv2.BORDER_CONSTANT, value=(255, 255, 255))
    return img[:, :1080]


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    app = cv2.imread(os.path.join(SS, "app-ganz.png"), cv2.IMREAD_COLOR)
    for name, y0, y1 in (("quelle-kopf", 0, 1920), ("quelle-kurz", 1450, 3370), ("quelle-preis", 3100, 4800)):
        cv2.imwrite(os.path.join(ziel, name + ".jpg"), breit(app[y0:y1]), [cv2.IMWRITE_JPEG_QUALITY, 93])
        print("ok", name)
    g4 = cv2.imread(os.path.join(SS, "galerie", "g4-chat-beispiel.png"), cv2.IMREAD_COLOR)
    chat = g4[236:630, 664:1010]
    f = 1.9
    chat = cv2.resize(chat, None, fx=f, fy=f, interpolation=cv2.INTER_LANCZOS4)
    grund = np.full((1920, 1080, 3), g4[880, 40].astype(np.uint8), np.uint8)   # heller Rand des Originalbilds
    x, y = 90, 350
    h, w = chat.shape[:2]
    # weicher Schatten unter dem Chat-Fenster, wie im Original
    sch = np.zeros((1920, 1080), np.float32)
    sch[y + 10:y + h + 18, x + 4:x + w + 4] = 1
    sch = cv2.GaussianBlur(sch, (0, 0), 10) * 0.10
    grund = (grund.astype(np.float32) * (1 - sch[..., None])).astype(np.uint8)
    grund[y:y + h, x:x + w] = chat
    cv2.imwrite(os.path.join(ziel, "quelle-chat.jpg"), grund, [cv2.IMWRITE_JPEG_QUALITY, 93])
    print("ok quelle-chat", w, h)
