"""Schneidet die Quellen-Bilder für "Quelle groß" (M10 · SI BEAU) aus dem Bild der ganzen Seite des Shopify-Beitrags aus dem Briefing
(https://www.shopify.com/de/blog/kultur-und-kreativpilotenpreis-si-beau, 6. Jan. 2020; aufnahme.cjs, Handy-Ansicht 432 css-px @2,5 =
1080 px, Sätze grün markiert). Nur zugeschnitten; mehrere Ausschnitte derselben Seite untereinander (dünne Trennlinie = ausgelassene
Stelle), sonst nichts verändert.
  .venv/bin/python -I hyperframes/sibeau-hg/quelle.py <ganze-seiten-ordner> <ziel-ordner>"""
import os
import sys

import cv2
import numpy as np

seiten, ziel = sys.argv[1], sys.argv[2]
shopify = cv2.imread(os.path.join(seiten, "shopify.png"), cv2.IMREAD_COLOR)[:, :1080]
TEILE = {
    # Kopf des Beitrags: "BLOG • ERFOLGREICHE HÄNDLER", Überschrift "Ausgezeichnet mit dem Kultur- und Kreativpilotenpreis der
    # Bundesregierung: Die Erfolgsgeschichte der SI BEAU-Gründerinnen" | Autorin und Datum "6. Jan. 2020 • 10 Min. Lesezeit"
    # (ausgelassen: die Unterzeile)
    "quelle-kopf": [(1390, 2062), (2556, 2692)],
    # Interview-Abschnitt zur Fokusgruppe: "Frauen verstehen, was Frauen wollen", "Amber: Die digitale Fokusgruppe aus etwa 500 Frauen
    # entstand kurz nach der Gründung. [...] Unsere Shopify-Seite haben wir während dieser Zeit als Landingpage genutzt, um weitere
    # Interessentinnen zu sammeln." und "[...] Auf diese Weise haben wir entschieden, wie unsere Kollektion aufgebaut sein soll,
    # welche Kleidungsstücke sie enthalten und in welchen Farben sie verfügbar sein werden. Dadurch umfasst unser Angebot Blazer,
    # Kleider, Jumpsuits, Hosen, Röcke und Strickwaren." (alle drei Sätze markiert)
    "quelle-fokusgruppe": [(14860, 15722)],
}
for name, teile in TEILE.items():
    stuecke = []
    for i, (a, b) in enumerate(teile):
        if i:
            linie = np.full((24, 1080, 3), 255, np.uint8)
            linie[11:13, 40:1040] = (225, 225, 225)
            stuecke.append(linie)
        stuecke.append(shopify[a:b])
    out = np.vstack(stuecke)
    cv2.imwrite(os.path.join(ziel, name + ".jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(name, out.shape)
