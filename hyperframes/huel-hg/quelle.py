"""Schneidet das Quellen-Bild für "Quelle groß" (M08 · Huel) aus dem Bild der ganzen Seite der Shopify-Fallstudie aus dem
Briefing (https://www.shopify.com/de/case-studies/huel, aufnahme.cjs, Handy-Ansicht 432 css-px @2,5 = 1080 px, Sätze grün
markiert). Nur zugeschnitten; zwei Ausschnitte derselben Seite untereinander (dünne Trennlinie dazwischen = ausgelassene
Stelle: Titelbild, Branche, Einleitung), sonst nichts verändert.
  .venv/bin/python -I hyperframes/huel-hg/quelle.py <ganze-seiten-ordner> <ziel-ordner>"""
import os
import sys

import cv2
import numpy as np

seiten, ziel = sys.argv[1], sys.argv[2]
shopify = cv2.imread(os.path.join(seiten, "shopify.png"), cv2.IMREAD_COLOR)[:, :1080]
TEILE = {
    # Überschrift "With the new Shopify Plus Admin, Huel onboards staff 9X faster" (markiert) | Liste "Huel has enjoyed:"
    # "An ability to onboard new staff 9x faster" und "Functionality to quickly assign, and unassign, new staff roles across
    # its global workforce" (beide markiert)
    "quelle-fallstudie": [(760, 1120), (3180, 3700)],
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
