# Übergabekarte: E02_AOV

Status: **zur Prüfung** (Cutter) <!-- danach: freigegeben / zurück (Prüfer), eingeplant (Planer) -->

- **Titel** (wie im Kalendertermin, auch Datei-, Ordner- und Doc-Name): E02_AOV
- **Format / Design:** FACE / nacht (eine Leuchtfarbe #CCFF00 in Hook, Skizzen und betonten Untertiteln; freigegebener Look ab 2026-10-17, Neuschnitt wie E01)
- **Plattformen:** TikTok, Instagram Reel, YouTube Short
- **Termin laut Kalender:** Auftrag der Regie: So 26.10.2026 18:00 (Europe/Berlin); die bestehenden Metricool-Posts der Alt-Fassung werden später ausgetauscht
- **Briefing:** keines (kein briefing.md für dieses Projekt); Vorgaben aus dem Regie-Auftrag: Neuschnitt wie E01, Captions wörtlich aus beschreibung.md

<!-- auto:start (npm run uebergabe) -->
- **Projekt / Komposition:** `aov` / `AovV2`
- **Datei:** `out/final/AovV2.mp4` (Master), `-post.mp4` (Plattformen), `-chat.mp4` (Chat)
- **Technik:** 1080x1920, 30 fps, 56.1 s
- **Wörter im Video:** 164

### Untertiteltext (so steht er im Video)

-   0.1 s  AOV, schon mal gehört?
-   1.7 s  Willkommen zu E-Commerce einfach erklärt mit Paul.
-   5.9 s  Heute erkläre ich dir den Average Order Value, also deinen durchschnittlichen Bestellwert.
-   9.9 s  Mehr Umsatz, ohne mehr Besucher, das kann über den durchschnittlichen Bestellwert durchaus funktionieren.
-  14.9 s  Im letzten Video ging es ja um die Conversion Rate, also wie viele Besucher kaufen bei dir.
-  19.4 s  Heute geht es aber eher darum, wie viel sie denn bestellen.
-  22.4 s  Machen wir mal ein Beispiel.
-  23.7 s  Machst du 10.000 Umsatz mit noch 100 Bestellungen, dann liegt dein Average Order Value oder kurz AOV eben bei 100 Euro.
-  31.0 s  Passende Zusatzprodukte und Bundles können halt durchaus den AOV hier erhöhen.
-  35.6 s  Aber eben nur, wenn auch dabei die Marge nicht unbedingt leidet.
-  38.4 s  Dein Vorteil ist: wenn du den AOV steigerst, dann kannst du eben auch bei gleicher Bestellzahl mehr Umsatz machen, ohne eben dabei zusätzlich Besucher gewinnen zu müssen.
-  47.9 s  Achte eben dabei auf die Marge.
-  49.4 s  Du möchtest hier mehr Wissen pro Scroll, dann erhöhe deinen persönlichen Wissens-AOV und folg mir für weitere solcher Kennzahlen.
<!-- auto:end -->

## Briefing-Checkliste

- [x] Neuschnitt im freigegebenen Look, Komposition `AovV2` (`src/projekte/aov-v2/Video.tsx`), Schnitt unverändert aus `src/projekte/aov/cut.json`; Alt-Komposition `Aov` bleibt
- [x] FACE, Design nacht, eine Leuchtfarbe #CCFF00: Hook-Titel (0-5,5 s), alle Skizzen (HyperFrames, `hyperframes/aov-skizzen/`), betonte Untertitelwörter
- [x] Skizzen inhaltlich wie in der Alt-Fassung, jede auf ihrem Wort, Karte erscheint mit ihrem ersten Inhalt: Average Order Value / durchschnittlicher Bestellwert (5,8 s), Mehr Umsatz ohne mehr Besucher (9,9 s), Letztes Video Conversion Rate (14,9 s), AOV = wie viel sie bestellen (19,3 s), Beispiel 10.000 € ÷ 100 = 100 € (22,4 s), Zusatzprodukte und Bundles erhöhen den AOV (31,0 s), Aber Marge (35,5 s), Dein Vorteil (38,3 s), Achte auf die Marge (47,9 s), Wissens-AOV, Folg mir (50,1 s)
- [x] Farbe: Take mit `npm run farbe -- aov` korrigiert (vorher nicht), danach `npm run portrait -- aov`; `STIL.gradeSanft`, Gesicht 0,54
- [x] Captions wörtlich aus `beschreibung.md` (Pauls freigegebene Texte)
- [x] Termin So 26.10.2026 18:00 (Planer, nach Pauls OK)
- [x] Ton: Musik `puls` 24,8 dB unter der Stimme, leise pop/tick/success/klick auf den Skizzen, -14 LUFS

## Entscheidungen des Cutters

- Schnitt unverändert (6 Stücke, Originalsprechtext laut `schnitt.json`); `npm run kontrolle` meldet keinen Doppler und keinen Anlauf, daher nichts neu geschnitten
- Farbkorrektur und Porträt neu gerechnet (Sicherungen `t1.vor-farbe.mp4`, `t1.vor-farbe.orig.mp4`); Hook-Titel "AOV? / SCHON MAL GEHÖRT?" wie in der Alt-Fassung
- Skizzen-Details: in Karte "Heute" (5,8 s) steht nur das gesprochene Wort, damit die Karte mit Inhalt beginnt; Szene "Achte auf die Marge" (47,9-49,4 s) ist kurz, weil der Satz kurz ist
- Hinweis zu `kontrolle` (1 Stelle, 39,2 s "hier aber,"): kein Doppler. Im Take sagt Paul nach "Dein Vorteil ist," noch kurz "hier aber," (Pegel bis 144,45 s im Take, danach Stille), die Wortzeiten von Whisper decken es nicht. Die Untertitel zeigen "ist: wenn du"; hörbar, aber kein Wiederholungsfehler. Nicht geschnitten, weil der Auftrag den Schnitt nur bei Doppler/Anlauf zu ändern erlaubt; Entscheidung bei Paul/Regie
- Helligkeit Gesicht 0,540 (leicht unter dem Zielbereich 0,55-0,57, also eher dunkler als zu hell)
- `npm run final` wurde beim Chat-Schritt durch ein Zeitlimit abgebrochen; Chat-Kopie (27,5 MB) mit denselben ffmpeg-Zwei-Durchgängen wie in `tools/final.mjs` nachgebaut

## Offene Fragen an Paul

- "hier aber," bei 39,2 s im Ton (siehe oben): so lassen oder rausschneiden? Wenn rausgeschnitten werden soll, ändert sich der Schnitt und damit Porträt, Skizzen-Zeiten und Render.
- Die bestehenden Metricool-Posts der Alt-Fassung (E02_AOV) müssen vor dem Einplanen der neuen Fassung am 26.10. ersetzt werden.

## Captions

TikTok-Titel (max. 90 Zeichen): AOV einfach erklärt

### TikTok

```
AOV – schon mal gehört? 💶

Der Average Order Value ist dein durchschnittlicher Bestellwert. Beispiel: 10.000 € Umsatz aus 100 Bestellungen = AOV von 100 €. Zusatzprodukte und Bundles können ihn erhöhen – aber nur, wenn die Marge nicht leidet.

Erhöhe deinen Wissens-AOV und folg mir für weitere Kennzahlen 👇

#ecommerce #aov #bestellwert #onlineshop #ecommerceeinfacherklärt
```

### Instagram (Reels)

```
AOV – schon mal gehört? 💶

Der Average Order Value ist dein durchschnittlicher Bestellwert. Beispiel: 10.000 € Umsatz aus 100 Bestellungen = AOV von 100 €. Zusatzprodukte und Bundles können ihn erhöhen – aber nur, wenn die Marge nicht leidet.

Dein Vorteil: Steigerst du deinen AOV, machst du bei gleicher Bestellzahl mehr Umsatz – ohne zusätzliche Besucher gewinnen zu müssen.

Teil der Serie „E-Commerce einfach erklärt“ – jede Woche eine Kennzahl.

Erhöhe deinen Wissens-AOV und folg mir für weitere Kennzahlen 👇

#ecommerce #aov #bestellwert #onlineshop #ecommerceeinfacherklärt
```

### YouTube (Shorts)

Titel (max. 100 Zeichen): AOV (durchschnittlicher Bestellwert) einfach erklärt – E-Commerce einfach erklärt #2

```
Der Average Order Value ist dein durchschnittlicher Bestellwert. Beispiel: 10.000 € Umsatz aus 100 Bestellungen = AOV von 100 €. Zusatzprodukte und Bundles können ihn erhöhen – aber nur, wenn die Marge nicht leidet.

Dein Vorteil: Steigerst du deinen AOV, machst du bei gleicher Bestellzahl mehr Umsatz – ohne zusätzliche Besucher gewinnen zu müssen.

Serie „E-Commerce einfach erklärt“ – jede Woche eine Kennzahl.

#shorts #ecommerce #aov
```

## Quellen

- Keine externen Quellen; alle Zahlen (10.000 € Umsatz, 100 Bestellungen, AOV 100 €) stammen aus Pauls Sprechtext
