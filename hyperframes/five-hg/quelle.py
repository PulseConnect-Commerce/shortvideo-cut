"""Schneidet aus den Screenshots des Shopify-Interviews (1. Sept. 2020) die Belege für die Quellen-Karte aus: Titel mit
Autor und Datum, und die Stelle zum Ausverkauf. Nur zugeschnitten (Titel und Datumszeile übereinander), nichts
dazugemalt.  node tools/py.mjs ../hyperframes/five-hg/quelle.py <ziel-ordner>"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
ziel = sys.argv[1]
kopf = cv2.imread(os.path.join(SS, "interview.png"))
zit = cv2.imread(os.path.join(SS, "interview-ausverkauft.png"))
# Titel (css 66-300) und Autor/Datum (css 600-662), 2,5-fach
titel = kopf[143:752, 0:1080]
datum = kopf[1500:1655, 0:1080]
luft = np.full((20, 1080, 3), 255, np.uint8)
cv2.imwrite(os.path.join(ziel, "quelle-interview-kopf.png"), np.vstack([titel, luft, datum]))
# "Wir waren nach 24 Stunden Out of Stock ..." (css 330-392) und das Zitat "Ich habe nicht damit gerechnet ..." (css 432-500)
cv2.imwrite(os.path.join(ziel, "quelle-interview-zitat.png"), zit[805:1255, 0:1080])
print("ok")
# Lupe: das Etikett der Shea Cream (Produktfoto aus dem Shop, fotos/FIVE-Shea-Cream-2025.jpg), "Nur 5 Inhaltsstoffe ..."
foto = cv2.imread(os.path.join(HIER, "fotos", "FIVE-Shea-Cream-2025.jpg"))
cv2.imwrite(os.path.join(ziel, "lupe-etikett.png"), cv2.resize(foto[885:1012, 630:865], None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC))
print("ok lupe")
