"""Schneidet die Quellen-Bilder für "Quelle groß" (M02 · PURELEI) aus dem Bild der ganzen Seite des Shopify-Beitrags
(aufnahme.cjs, Handy-Ansicht 432 css-px @2,5 = 1080 px, Sätze grün markiert). Nur zugeschnitten; bei quelle-600k sind zwei
Ausschnitte derselben Seite untereinandergesetzt (Titel mit Teaser, darunter die Zeile mit Autorin und Datum), mit einer
dünnen Trennlinie, sonst nichts verändert.
  .venv/bin/python hyperframes/purelei-hg/quelle.py <shopify.png> <ziel-ordner>"""
import os
import sys

import cv2
import numpy as np

src, ziel = sys.argv[1], sys.argv[2]
img = cv2.imread(src, cv2.IMREAD_COLOR)[:, :1080]
TEILE = {
    "quelle-600k": [(1385, 2245), (2538, 2665)],   # Titel + Teaser (600.000 markiert) | von Caroline Dohrmann, 10. Feb. 2021
    "quelle-hawaii": [(5985, 6760)],                # "Wie Schmuck Aloha versprüht", Satz Auslandssemester auf Hawaii markiert
    "quelle-influencer": [(13280, 14095)],          # Frage Brand-Marketing, Satz Influencer-Marketing markiert
}
for name, teile in TEILE.items():
    stuecke = []
    for i, (a, b) in enumerate(teile):
        if i:
            linie = np.full((24, 1080, 3), 255, np.uint8)
            linie[11:13, 40:1040] = (225, 225, 225)
            stuecke.append(linie)
        stuecke.append(img[a:b])
    out = np.vstack(stuecke)
    cv2.imwrite(os.path.join(ziel, name + ".jpg"), out, [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(name, out.shape)
