"""Schneidet aus dem Screenshot des Shopify-Blogs (Quelle im Briefing: "14 Fitness-E-Commerce-Websites: So wächst dein
Business", 1. März 2026) den Beleg für die Quellen-Karte aus: die Überschrift "Gymshark: von der URL zur Realität" und
den Absatz zu Pop-up-Shops und Treffen. Nur zugeschnitten und übereinandergelegt, nichts dazugemalt.
  node tools/py.mjs ../hyperframes/gymshark-hg/quelle.py <ziel-ordner>"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
ziel = sys.argv[1]
img = cv2.imread(os.path.join(HIER, "screenshots", "shopify-gymshark.png"))
kopf = img[22:178, 0:1080]
absatz = img[1002:1338, 0:1080]
luft = np.full((18, 1080, 3), 255, np.uint8)
cv2.imwrite(os.path.join(ziel, "quelle-shopify.png"), np.vstack([kopf, luft, absatz]))
print("ok", kopf.shape[0] + 18 + absatz.shape[0])
