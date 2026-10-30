"""Schneidet die Quellen-Bilder für A06 · Matrixify ("Quelle groß, er klein in der Ecke", karten-aufbau.md 2026-10-28)
aus echten Aufnahmen zu, nichts dazugemalt:

  node tools/py.mjs ../hyperframes/matrixify-hg/gestalte.py <ziel-ordner>

Quellen (am 29.10.2026 aufgenommen bzw. geladen, siehe public/broll/matrixify/QUELLE.txt):
  - screenshots/app-de.png: Shopify-App-Store-Eintrag https://apps.shopify.com/excel-export-import?locale=de,
    Playwright/Chromium ohne Login, Handy-Ansicht 412 css-px, 2,62-fach (aufnahme.cjs, aufnahme-de.json); grün hinterlegt
    beim Aufnehmen: "Excel, CSV oder Google Sheets" (Kurzbeschreibung), "Kostenlos" und "10 Produkte, 10 Kategorien"
    (kostenloser Plan "Demo").
  - screenshots/galerie/g1-export.png, g4-import.png: offizielle Bilder aus der Bildergalerie desselben Eintrags
    (1600x900, Shopify-CDN): "Export data, download as Excel file" und "Control what happens during import".
Ergebnis (Breite 1080 wie am Handy), Lage im Video steht in src/projekte/matrixify/Video.tsx (QUELLEN):
  quelle-kopf.jpg     Seitenkopf: Icon, Name, Built for Shopify, Preisgestaltung, Bewertung, Entwickler
  quelle-kurz.jpg     Kurzbeschreibung "Shop-Daten verwalten: Massen-Upload und Updates mit Excel, CSV oder Google Sheets."
                      und die Funktionsliste
  quelle-preis.jpg    Preisbereich mit dem kostenlosen Plan "Demo" und seinen Mengen pro Datei
  quelle-export.jpg   offizielles Bild g1, ganz, 1080 breit, auf seiner Randfarbe
  quelle-import.jpg   offizielles Bild g4, ganz, 1080 breit, auf seiner Randfarbe
"""
import json
import os
import sys

import cv2
import numpy as np

HIER = os.path.dirname(os.path.abspath(__file__))
SS = os.path.join(HIER, "screenshots")
DPR = 2.62

# Ausschnitte der Seite (Seiten-px von, bis); bis - von = 1920
SEITE = {"quelle-kopf": 0, "quelle-kurz": 1300, "quelle-preis": 3700}


def breit(img, farbe=(255, 255, 255)):
    """auf 1080 Breite auffüllen"""
    h, w = img.shape[:2]
    if w < 1080:
        img = cv2.copyMakeBorder(img, 0, 0, 0, 1080 - w, cv2.BORDER_CONSTANT, value=farbe)
    return img[:, :1080]


def galerie(name, ziel, aus):
    g = cv2.imread(os.path.join(SS, "galerie", name), cv2.IMREAD_COLOR)
    rand = g[880, 20].astype(np.uint8)
    h = round(g.shape[0] * 1080 / g.shape[1])
    klein = cv2.resize(g, (1080, h), interpolation=cv2.INTER_AREA)
    grund = np.full((1920, 1080, 3), rand, np.uint8)
    grund[:h] = klein
    cv2.imwrite(os.path.join(ziel, aus), grund, [cv2.IMWRITE_JPEG_QUALITY, 93])
    return h, tuple(int(x) for x in rand[::-1])


if __name__ == "__main__":
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    app = cv2.imread(os.path.join(SS, "app-de.png"), cv2.IMREAD_COLOR)
    info = json.load(open(os.path.join(SS, "aufnahme-de.json"), encoding="utf-8"))
    for name, y0 in SEITE.items():
        cv2.imwrite(os.path.join(ziel, name + ".jpg"), breit(app[y0:y0 + 1920]), [cv2.IMWRITE_JPEG_QUALITY, 93])
        marken = {m: (round(p[0] * DPR) - y0, round((p[0] + p[1]) * DPR) - y0) for m, p in info["pos"].items() if p}
        anker = {a: round(p[0] * DPR) - y0 for a, p in info["ank"].items()}
        print("ok", name, "Marken (Bild-y):", {m: v for m, v in marken.items() if 0 <= v[0] < 1920},
              "Anker:", {a: v for a, v in anker.items() if 0 <= v < 1920})
    for g, aus in (("g1-export.png", "quelle-export.jpg"), ("g4-import.png", "quelle-import.jpg")):
        h, rand = galerie(g, ziel, aus)
        print("ok", aus, "Bildhöhe", h, "Randfarbe", "#%02X%02X%02X" % rand)
