# Übergabekarte: E02_AOV

Status: **zur Prüfung, Runde 2** (Cutter, Korrekturrunde nach Urteil out/pruefung/AovV2-urteil.md vom 22.10.) <!-- danach: freigegeben / zurück (Prüfer), eingeplant (Planer) -->

- **Titel** (wie im Kalendertermin, auch Datei-, Ordner- und Doc-Name): E02_AOV
- **Format / Design:** FACE / nacht (eine Leuchtfarbe #CCFF00 in Hook, Skizzen und betonten Untertiteln; freigegebener Look ab 2026-10-17, Neuschnitt wie E01). Look laut Regie unverändert ("E02 bleibt so"), nur die Positionen nach Pauls Vorgabe 2026-10-25 (er höher, Untertitel und Karten unter dem Kopf)
- **Plattformen:** TikTok, Instagram Reel, YouTube Short
- **Termin laut Kalender:** laut Regie Mo 26.10.2026 14:00 (Europe/Berlin, Slot Serienvideos); die Regie plant ein, die bestehenden Metricool-Posts der Alt-Fassung werden dabei ausgetauscht
- **Briefing:** keines (kein briefing.md für dieses Projekt); Vorgaben aus den Regie-Aufträgen (Neuschnitt wie E01, Korrekturrunde 2026-10-25), Captions wörtlich aus beschreibung.md

<!-- auto:start (npm run uebergabe) -->
- **Projekt / Komposition:** `aov` / `AovV2`
- **Datei:** `out/final/AovV2.mp4` (Master), `-post.mp4` (Plattformen), `-chat.mp4` (Chat)
- **Technik:** 1080x1920, 30 fps, 54.0 s
- **Wörter im Video:** 164

### Untertiteltext (so steht er im Video)

-   0.1 s  AOV, schon mal gehört?
-   1.7 s  Willkommen zu E-Commerce einfach erklärt mit Paul.
-   4.2 s  Heute erkläre ich dir den Average Order Value, also deinen durchschnittlichen Bestellwert.
-   8.2 s  Mehr Umsatz, ohne mehr Besucher, das kann über den durchschnittlichen Bestellwert durchaus funktionieren.
-  13.2 s  Im letzten Video ging es ja um die Conversion Rate, also wie viele Besucher kaufen bei dir.
-  17.7 s  Heute geht es aber eher darum, wie viel sie denn bestellen.
-  20.8 s  Machen wir mal ein Beispiel.
-  22.0 s  Machst du 10.000 Umsatz mit noch 100 Bestellungen, dann liegt dein Average Order Value oder kurz AOV eben bei 100 Euro.
-  29.3 s  Passende Zusatzprodukte und Bundles können halt durchaus den AOV hier erhöhen.
-  33.9 s  Aber eben nur, wenn auch dabei die Marge nicht unbedingt leidet.
-  36.8 s  Dein Vorteil ist: wenn du den AOV steigerst, dann kannst du eben auch bei gleicher Bestellzahl mehr Umsatz machen, ohne eben dabei zusätzlich Besucher gewinnen zu müssen.
-  45.9 s  Achte eben dabei auf die Marge.
-  47.4 s  Du möchtest hier mehr Wissen pro Scroll, dann erhöhe deinen persönlichen Wissens-AOV und folg mir für weitere solcher Kennzahlen.
<!-- auto:end -->

## Briefing-Checkliste

- [x] Neuschnitt im freigegebenen Look, Komposition `AovV2` (`src/projekte/aov-v2/Video.tsx`), Schnitt aus `src/projekte/aov/cut.json` (Runde 2: zwei Versprecher raus, 8 Stücke, 54,0 s statt 56,1 s); Alt-Komposition `Aov` bleibt
- [x] FACE, Design nacht, eine Leuchtfarbe #CCFF00 wie bisher (Regie: "E02 bleibt so"): Hook-Titel (0-3,9 s), alle Skizzen (HyperFrames, `hyperframes/aov-skizzen/`), betonte Untertitelwörter
- [x] Bildlage nach Pauls Vorgabe 2026-10-25 (karten-aufbau.md, "Platz von Kopf, Karten und Untertiteln"): er steht höher, nur verschoben, nicht weiter gezoomt (scale 1,3 wie vorher, `hoch` 255 → 490, `x` 0 → 66): Kopfoberkante y ~300-325, Augen im fertigen Video Median y 607 (Soll 540-620), Gesicht waagrecht mittig (Median x 558, vorher ~65 px weiter rechts); unten kein Bildrand
- [x] Von oben nach unten: Gesicht, Kinn (~y 810-875), Untertitel (Mitte y 995), Karte bzw. Hook-Titel (y 1100-1433); alles über der Instagram-Zone (ab y 1500) und links der TikTok-Leiste (Karte x 113-887, Untertitel und Hook 40 px nach links); nichts auf dem Mund
- [x] Skizzen inhaltlich unverändert, jede auf ihrem Wort, Karte erscheint mit ihrem ersten Inhalt; Zeiten auf den neuen Schnitt umgerechnet: Average Order Value / durchschnittlicher Bestellwert (4,1 s), Mehr Umsatz ohne mehr Besucher (8,2 s), Letztes Video Conversion Rate (13,2 s), AOV = wie viel sie bestellen (17,6 s), Beispiel 10.000 € ÷ 100 = 100 € (20,7 s), Zusatzprodukte und Bundles erhöhen den AOV (29,3 s), Aber Marge (33,8 s), Dein Vorteil (36,8 s), Achte auf die Marge (45,8 s), Wissens-AOV, Folg mir (48,0 s)
- [x] Farbe: Take nach dem Intake wieder mit `npm run farbe -- aov` korrigiert (dieselben Werte wie vorher), danach `npm run portrait -- aov` für alle Schnittbereiche; `STIL.gradeSanft`
- [x] Captions wörtlich aus `beschreibung.md` (Pauls freigegebene Texte), Hashtags dort und hier auf 2 je Plattform gekürzt
- [x] Termin Mo 26.10.2026 14:00 laut Regie (Einplanung durch die Regie, nicht durch den Cutter)
- [x] Ton: Musik `puls`, leise pop/tick/success/klick auf den Skizzen wie bisher (sparsam), -14 LUFS

## Entscheidungen des Cutters

- Korrektur Runde 2, Mangel 1 (abgebrochenes "Heute" mit Pause bei 4,4-5,8 s der alten Fassung): Satz 1 in `schnitt.json` an "Paul." geteilt. Stück 1 endet im Take bei 8,015 s (nach "Paul." in der Stille), Stück 2 beginnt bei 9,705 s direkt vor "Heute erkläre ich dir"; der Anlauf (Take 8,47-8,95 s) und beide Pausen sind raus. Hook-Ende, alle Karten- und Ton-Zeiten (`Video.tsx`, `hyperframes/aov-skizzen/index.html`) über die Quell-Sekunde auf den neuen Schnitt umgerechnet, `skizzen.webm` neu gerendert
- Korrektur Runde 2, Mangel 2 (zu hoch, Karte berührt das Haar): auf Anweisung der Regie ersetzt durch Pauls neue Vorgabe 2026-10-25 (er höher im Bild, Untertitel und Karten unter dem Kopf, Hook an der Kartenposition). Die Karte liegt nicht mehr über dem Kopf, sie kann das Haar also nicht mehr berühren; Bildlage siehe Checkliste
- Korrektur Runde 2, Zusatz der Regie ("ja/hier aber" bei ~0:39): raus. Satz 5 nach "Dein Vorteil ist," geteilt; Stück 6 endet im Take bei 143,935 s (vor dem Anlaut bei 143,96 s, das Stück endet auf dem Frame 143,933 s), Stück 7 beginnt bei 144,45 s in der Stille vor "wenn" (0,15 s Pause wie ein Komma). Dafür die zwei verschluckten Wörter "hier aber," im `t1.aligned.json` nachgetragen (Take 143,95-144,32 s, sonst fehlten sie dort). Stück 6 ("Dein Vorteil ist,") ist 0,93 s lang, es beginnt 0,24 s vor "Dein" in der Stille nach "leidet."; im Bild entsteht bei 37,57 s ein kleiner Sprung (Hände), der Ton ist sauber
- Der Rohclip lag noch lokal in `eingang/aov/18evGphTi1Dn0z2yVvLf6mxMQQx5H_6av` (Dateiname = Drive-ID, 207,5 s, passt genau zum Transkript), daher kein neuer Download; Intake neu, danach die alten, schon geprüften Transkripte zurückgelegt (die Neu-Transkription wich am Anfang leicht ab)
- Hook-Titel "AOV? / SCHON MAL GEHÖRT?" wie bisher; er endet bei 3,85 s (kurz vor dem ersten Kartenwort "Heute" bei 4,17 s), vorher 5,5 s
- Ende: letzter Laut "Kennzahlen" endet im Take bei ~203,25 s, das Video endet bei 203,6 s (0,35 s danach), er bleibt ruhig im Bild
- Skizzen-Details wie bisher: in Karte "Heute" steht zuerst nur das gesprochene Wort; Szene "Achte auf die Marge" ist kurz, weil der Satz kurz ist
- Messwerte am fertigen Video (54,0 s): -14,0 LUFS, True Peak -0,9 dB, keine Ausreißer, keine Tonlöcher; Musik beim Sprechen 24,6 dB unter der Stimme; lauteste Effekte -17,3 dB gegen den Sprech-Pegel -18,4 dB (checks OK, Effekte unverändert sparsam); Helligkeit Gesicht 0,545 (knapp unter 0,55-0,57, eher dunkler als zu hell)
- Ton zweimal neu abgehört: `kontrolle` mit Whisper medium 96 % und als zweiter Erkenner Whisper small 91 %, beide ohne Doppler oder Anlauf; beide hören "mit Paul. Heute erkläre ich dir" und "Dein Vorteil ist, wenn du den AOV steigerst" (Rest der Abweichungen sind Hörfehler wie "AUV", "Wissensaufbau")
- Sync in der Kartenfläche des Renders gemessen: jede Karte 2-4 Frames vor ihrem Wort ("Heute" 4,1 s, "Mehr" 8,2 s, "Im" 13,2 s, "Dein" 36,8 s, "Achte" 45,8 s, "mehr Wissen" 48,0 s); Pacing: keine Strecke über 2 s ohne Bildänderung
- Bildlage im fertigen Video gemessen (YuNet, alle 0,5 s): Augen Median y 607 (Spanne 544-706, er bewegt sich viel), x 558 (Gesicht also etwa 18 px rechts der Mitte, seine Bewegungen gehen ±120 px); Mund höchstens bei y 885 (35,5-36 s, er lehnt sich vor), die Untertitel beginnen bei y ~922: der Mund bleibt frei
- Platten: Take neu angelegt (`t1.mp4` mit Porträt, Sicherungen `t1.orig.mp4`, `t1.vor-farbe.mp4`, `t1.vor-farbe.orig.mp4`); `npm run portrait` legt `t1.vor-farbe.orig.mp4` als bitgleiche Kopie von `t1.vor-farbe.mp4` an (203 MB), als Sicherung nicht gelöscht; frei sind noch ~4,6 GB

## Offene Fragen an Paul

- Die bestehenden Metricool-Posts der Alt-Fassung (E02_AOV) müssen beim Einplanen der neuen Fassung am Mo 26.10. 14:00 ersetzt werden (Regie/Planer).
- Der Look bleibt auf Wunsch "nacht" mit #CCFF00 und dunklen Karten (nicht die hellen Karten ab 2026-10-22), weil E02 laut Paul so bleibt; falls er die Serie doch im neuen hellen Look will, wäre das eine Neugestaltung.

## Captions

TikTok-Titel (max. 90 Zeichen): AOV einfach erklärt

### TikTok

```
AOV – schon mal gehört? 💶

Der Average Order Value ist dein durchschnittlicher Bestellwert. Beispiel: 10.000 € Umsatz aus 100 Bestellungen = AOV von 100 €. Zusatzprodukte und Bundles können ihn erhöhen – aber nur, wenn die Marge nicht leidet.

Erhöhe deinen Wissens-AOV und folg mir für weitere Kennzahlen 👇

#ecommerce #aov
```

### Instagram (Reels)

```
AOV – schon mal gehört? 💶

Der Average Order Value ist dein durchschnittlicher Bestellwert. Beispiel: 10.000 € Umsatz aus 100 Bestellungen = AOV von 100 €. Zusatzprodukte und Bundles können ihn erhöhen – aber nur, wenn die Marge nicht leidet.

Dein Vorteil: Steigerst du deinen AOV, machst du bei gleicher Bestellzahl mehr Umsatz – ohne zusätzliche Besucher gewinnen zu müssen.

Teil der Serie „E-Commerce einfach erklärt“ – jede Woche eine Kennzahl.

Erhöhe deinen Wissens-AOV und folg mir für weitere Kennzahlen 👇

#ecommerce #aov
```

### YouTube (Shorts)

Titel (max. 100 Zeichen): AOV (durchschnittlicher Bestellwert) einfach erklärt – E-Commerce einfach erklärt #2

```
Der Average Order Value ist dein durchschnittlicher Bestellwert. Beispiel: 10.000 € Umsatz aus 100 Bestellungen = AOV von 100 €. Zusatzprodukte und Bundles können ihn erhöhen – aber nur, wenn die Marge nicht leidet.

Dein Vorteil: Steigerst du deinen AOV, machst du bei gleicher Bestellzahl mehr Umsatz – ohne zusätzliche Besucher gewinnen zu müssen.

Serie „E-Commerce einfach erklärt“ – jede Woche eine Kennzahl.

#shorts #aov
```

## Quellen

- Keine externen Quellen; alle Zahlen (10.000 € Umsatz, 100 Bestellungen, AOV 100 €) stammen aus Pauls Sprechtext
