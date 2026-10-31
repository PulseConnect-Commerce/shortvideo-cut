"""Schneidet die Quellen-Bilder für "Quelle groß" (M09 · ooia) aus dem Bild der ganzen Seite des Shopify-Beitrags aus dem
Briefing (aufnahme.cjs, Handy-Ansicht 432 css-px @2,5 = 1080 px, Sätze grün markiert) und das Foto der Gründerinnen aus
"Mission & Werte" von ooia.de. Nur zugeschnitten; bei einer Quelle sind zwei Ausschnitte derselben Seite untereinander
gesetzt (bei quelle-aufklaerung; dünne Trennlinie dazwischen, die ausgelassene Stelle), sonst nichts verändert.
  .venv/bin/python -I hyperframes/ooia-hg/quelle.py <ganze-seiten-ordner> <ziel-ordner>"""
import os
import sys

import cv2
import numpy as np

seiten, ziel = sys.argv[1], sys.argv[2]
shopify = cv2.imread(os.path.join(seiten, "shopify.png"), cv2.IMREAD_COLOR)[:, :1080]
TEILE = {
    # Antwort von Kati ("Kati: Wir haben beobachtet, dass ...") bis "Dazu kommt, dass es sich bei uns um ein Produkt handelt, das
    # erklärt werden muss und das in Deutschland tabu-behaftet ist." (markiert), am Stück
    "quelle-erklaeren": [(10898, 11556)],
    # Frage "Wie löst ihr die Herausforderung der Aufklärungsarbeit ...?" mit "Kati: Wir haben eine sehr ausführliche
    # FAQ-Sektion auf unserer Webseite." | "Außerdem betreiben wir einen interaktiven Instagram-Channel ... Live-Sessions
    # berichten. Wir bekommen unglaublich viele Fragen" (markiert)
    "quelle-aufklaerung": [(15365, 15860), (16020, 16305)],
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
# Gründerinnen-Foto aus "Mission & Werte" (links Kristine Zeller, rechts Kati Ernst; zugeordnet über die Einzelfotos der
# Story-Seite "HI, ITS ME, KRISTINE" / "HI, ITS ME, KATI"), nur zugeschnitten und verkleinert
mission = cv2.imread(os.path.join(seiten, "mission.png"), cv2.IMREAD_COLOR)[:, :1080]
foto = cv2.resize(mission[4150:5210], (640, 628), interpolation=cv2.INTER_AREA)
cv2.imwrite(os.path.join(ziel, "gruenderinnen.jpg"), foto, [cv2.IMWRITE_JPEG_QUALITY, 90])
print("gruenderinnen", foto.shape)
