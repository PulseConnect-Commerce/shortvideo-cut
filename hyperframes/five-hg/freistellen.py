"""Stellt die echten FIVE-Fotos frei (Sticker neben dem Kopf), Quelle: fiveskincare.de (Produktbilder aus dem Shop,
Porträt Anna Pfeiffer von der Presseseite fiveskincare.de/pages/presse), am 27.10.2026 geladen (fotos/).

  node tools/py.mjs ../hyperframes/five-hg/freistellen.py <rvm.torchscript> <ziel-ordner>

Einzelne Produkte: dunkles bzw. blaues Glas vor hellem Studio-Grund, Maske aus Helligkeit/Sättigung, je Zeile gefüllt
(produkt_zeilen); Tiegel und Flakon zusammen: Maske mit gefüllten Löchern, mit GrabCut verfeinert. Kanten leicht weich. Porträt: Robust Video Matting (wie npm run portrait). Nur freigestellt und beschnitten, nichts
dazugemalt.
"""
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
FOTOS = os.path.join(HIER, "fotos")
rvm, ziel = sys.argv[1], sys.argv[2]
os.makedirs(ziel, exist_ok=True)


def zuschneiden(rgba, rand=8):
    ys, xs = np.where(rgba[..., 3] > 10)
    y0, y1, x0, x1 = max(0, ys.min() - rand), min(rgba.shape[0], ys.max() + rand), max(0, xs.min() - rand), min(rgba.shape[1], xs.max() + rand)
    return rgba[y0:y1, x0:x1]


def produkt_zeilen(datei, name):
    """Ein einzelnes Glas (Tiegel oder Flasche, senkrecht und konvex): grobe Maske aus dunklem bzw. blauem Glas, dann je
    Bildzeile von der linken bis zur rechten Kante gefüllt (so bleiben helle Spiegelungen im Glas drin)."""
    img = cv2.imread(os.path.join(FOTOS, datei))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    v, s = hsv[..., 2].astype(int), hsv[..., 1].astype(int)
    roh = ((v < 110) | ((s > 70) & (v < 230))).astype(np.uint8)
    roh = cv2.morphologyEx(roh, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(roh)
    k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    m = (lab == k).astype(np.uint8)
    voll = np.zeros_like(m)
    H = m.shape[0]
    li, re = np.full(H, 10 ** 6), np.full(H, -1)
    for y in range(H):
        xs = np.where(m[y])[0]
        if len(xs) > 2:
            li[y], re[y] = xs.min(), xs.max()
    # helle Schrift oder Spiegelung am Rand einer Zeile: die Kante aus den Nachbarzeilen (±18 px) übernehmen
    for y in range(H):
        if re[y] < 0:
            continue
        a, b = max(0, y - 18), min(H, y + 19)
        r = re[a:b][re[a:b] >= 0]; l = li[a:b][re[a:b] >= 0]
        voll[y, int(l.min()):int(r.max()) + 1] = 1
    voll = cv2.morphologyEx(voll, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    voll = cv2.erode(voll, np.ones((3, 3), np.uint8))
    a = cv2.GaussianBlur(voll.astype(np.float32), (0, 0), 1.2)
    rgba = np.dstack([img, (a * 255).astype(np.uint8)])
    out = zuschneiden(rgba)
    cv2.imwrite(os.path.join(ziel, name), out)
    print("ok", name, out.shape)


def produkt(datei, name):
    img = cv2.imread(os.path.join(FOTOS, datei))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    v, s = hsv[..., 2].astype(int), hsv[..., 1].astype(int)
    roh = ((v < 110) | ((s > 70) & (v < 215))).astype(np.uint8)
    roh = cv2.morphologyEx(roh, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(roh)
    gross = [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] > 0.01 * roh.size]
    m = np.isin(lab, gross).astype(np.uint8)
    # Löcher (helle Schrift auf dem Glas) füllen
    flood = m.copy() * 255
    h, w = m.shape
    ff = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(flood, ff, (0, 0), 128)
    m = ((flood != 128)).astype(np.uint8)
    gc = np.where(cv2.erode(m, np.ones((15, 15), np.uint8)) > 0, cv2.GC_FGD,
                  np.where(cv2.dilate(m, np.ones((25, 25), np.uint8)) > 0, cv2.GC_PR_FGD, cv2.GC_BGD)).astype(np.uint8)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(img, gc, None, bgd, fgd, 4, cv2.GC_INIT_WITH_MASK)
    fg = np.isin(gc, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(fg)
    gross = [k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] > 0.01 * fg.size]
    fg = np.isin(lab, gross).astype(np.float32)
    a = cv2.GaussianBlur(fg, (0, 0), 1.5)
    rgba = np.dstack([img, (a * 255).astype(np.uint8)])
    out = zuschneiden(rgba)
    cv2.imwrite(os.path.join(ziel, name), out)
    print("ok", name, out.shape)


def person(datei, name):
    import torch
    img = cv2.imread(os.path.join(FOTOS, datei))
    model = torch.jit.load(rvm).eval()
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    src = torch.from_numpy(rgb.copy()).permute(2, 0, 1)[None].float() / 255
    rec = [None] * 4
    with torch.no_grad():
        for _ in range(3):        # ein paar Durchgänge, damit sich das Gedächtnis des Modells setzt
            _, pha, *rec = model(src, *rec, 0.4)
    a = pha[0, 0].numpy()
    a = np.where(a < 0.04, 0, a)
    rgba = np.dstack([img, (np.clip(a, 0, 1) * 255).astype(np.uint8)])
    out = zuschneiden(rgba)
    cv2.imwrite(os.path.join(ziel, name), out)
    print("ok", name, out.shape)


produkt_zeilen("FIVE-Shea-Cream-2025.jpg", "shea-cream.png")
produkt_zeilen("FIVE-Gesichtsserum-2025.jpg", "gesichtsserum.png")
produkt_zeilen("FIVE-Make-up-Entferner-2025.jpg", "make-up-entferner.png")
produkt("Five-keine-Geheimnisse_2000x2000px.jpg", "tiegel-und-flakon.png")
person("Five-Anna-Pfeiffer-Portrait_2000x2000px.jpg", "anna-pfeiffer.png")
