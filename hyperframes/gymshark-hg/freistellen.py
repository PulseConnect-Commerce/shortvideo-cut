"""Stellt die echten Gymshark-Produktfotos frei (Sticker neben dem Kopf im Hook). Quelle: de.gymshark.com, Shop-Bilder
(cdn.shopify.com/s/files/1/1693/6215/files/...), am 27.10.2026 geladen (fotos/): 700ml Metal Insulated Straw Bottle (Black)
aus "Flaschen & Shaker", Gymshark Essentials Cap (Black) aus "Caps".

  node tools/py.mjs ../hyperframes/gymshark-hg/freistellen.py <ziel-ordner>

Dunkles Produkt vor hellem Studio-Grund: Maske aus Helligkeit/Sättigung, Löcher gefüllt, mit GrabCut verfeinert, Kanten
leicht weich. Nur freigestellt und beschnitten, nichts dazugemalt.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
FOTOS = os.path.join(HIER, "fotos")
ziel = sys.argv[1]
os.makedirs(ziel, exist_ok=True)


def zuschneiden(rgba, rand=8):
    ys, xs = np.where(rgba[..., 3] > 10)
    y0, y1, x0, x1 = max(0, ys.min() - rand), min(rgba.shape[0], ys.max() + rand), max(0, xs.min() - rand), min(rgba.shape[1], xs.max() + rand)
    return rgba[y0:y1, x0:x1]


def produkt(datei, name, schwelle=150):
    img = cv2.imread(os.path.join(FOTOS, datei))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    v = hsv[..., 2].astype(int)
    roh = (v < schwelle).astype(np.uint8)
    roh = cv2.morphologyEx(roh, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(roh)
    gross = [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] > 0.01 * roh.size]
    m = np.isin(lab, gross).astype(np.uint8)
    flood = m.copy() * 255
    h, w = m.shape
    ff = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(flood, ff, (0, 0), 128)
    m = (flood != 128).astype(np.uint8)
    gc = np.where(cv2.erode(m, np.ones((15, 15), np.uint8)) > 0, cv2.GC_FGD,
                  np.where(cv2.dilate(m, np.ones((25, 25), np.uint8)) > 0, cv2.GC_PR_FGD, cv2.GC_BGD)).astype(np.uint8)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(img, gc, None, bgd, fgd, 4, cv2.GC_INIT_WITH_MASK)
    fg = np.isin(gc, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(fg)
    gross = [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] > 0.01 * fg.size]
    fg = np.isin(lab, gross).astype(np.float32)
    a = cv2.GaussianBlur(fg, (0, 0), 1.3)
    rgba = np.dstack([img, (a * 255).astype(np.uint8)])
    out = zuschneiden(rgba)
    cv2.imwrite(os.path.join(ziel, name), out)
    print("ok", name, out.shape)


produkt("700ml_Bottle_GS_Black_I2C9C_BB2J_3.jpg", "flasche.png")
produkt("GymsharkEssentialsCapGSBlackGSBlackI2C9J_BDKQ_0197.jpg", "cap.png")
