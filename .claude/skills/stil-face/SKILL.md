---
name: stil-face
description: Schnittstil FACE von PulseConnect (Videoformat FACE, noch nicht festgelegt). Verwende diesen Skill zusammen mit faber-cut, sobald ein FACE-Video geschnitten wird (der Nutzer sagt "FACE"); solange der Stil nicht festgelegt ist, führt er vor dem ersten Schnitt einen Stilabgleich mit dem Nutzer durch.
---

# Stil FACE (noch nicht festgelegt)

FACE ist eines der Videoformate von PulseConnect neben HERO (Erklär- und Expertenvideos, Skill `stil-hero`) und
NEWS/Reaction (Skill `stil-news`). Der Nutzer will für FACE **nicht** denselben Stil wie für HERO ("Wir werden die
folgenden 2-3 Formate haben, für die ich nicht den gleichen Stil verwenden möchte. Stil 1 – HERO, Stil 2 – FACE und
Stil 3 Optional wie z.B. News oder Reactions auf andere Videos. Sobald du das erst Mal eines der anderen beiden Videos
schneidest, sollten wir hier eine Stilanpassung durchführen", 2026-10-09).


**Stilabgleich:** läuft über den Skill **format-onboarding** (ausgehend von HERO: nur fragen, was bei FACE anders sein soll, mit Standbildern aus seinem Clip). Die Schritte unten sind die ältere Fassung davon.

## Stilabgleich beim ersten FACE-Video (Pflicht, vor dem Schnitt)

Dieser Stil ist noch nicht festgelegt. Bevor du das erste FACE-Video schneidest:

1. **Kurz klären, was FACE ist:** Zweck, typische Länge, wie gedreht wird (sitzend, unterwegs, Bildschirm, fremdes
   Video), was der Zuschauer mitnehmen soll. Eine Frage, frei beantwortet.
2. **Abgleich mit HERO** (Skill `stil-hero`) in zwei Runden AskUserQuestion, je bis zu 4 Fragen, jeweils mit der
   HERO-Lösung als Option "wie HERO" und 1-2 Alternativen:
   - Runde 1: Untertitel (wie HERO / größer, mittig / keine), B-Rolls über dem Kopf (wie HERO / weniger / keine),
     Hook (wie HERO weiß-rot / andere Farben / ohne), Tempo (Pausen ab 0,2 s wie HERO / ruhiger / schneller).
   - Runde 2: Zoom (wie HERO ruhig / dynamischer / keiner), Porträt-Modus (wie HERO leicht / stärker / aus), Farben
     (wie HERO Blau + PulseConnect-Grün / andere), Ende und Aufruf (wie HERO "speichern" / folgen / kommentieren).
   Dazu, was FACE ausmacht und HERO nicht hat (z. B. ob es kürzer und persönlicher ist, mehr Gesicht und weniger Grafik).
3. **Diese Datei neu schreiben** als "Stil FACE" mit denselben Abschnitten wie `stil-hero` (Bild, Hook, Untertitel,
   B-Roll, Farben, Schnitt und Ton, Aufruf und Ende, Arbeitsweise, Notizen), seine Antworten mit Datum. Die
   `description` oben so umschreiben, dass sie den Stil kurz beschreibt (nicht mehr "noch nicht festgelegt").
4. **Technik:** `src/lib/stil.ts` enthält die HERO-Werte und bleibt so. Weichen Zahlen ab (Farben, Untertitel,
   Hook), leg die Abweichungen für FACE getrennt an (z. B. `src/lib/stil-face.ts`) und mach den Stil je Projekt
   umschaltbar, statt die HERO-Werte zu ändern; danach `npm run typecheck` und ein Standbild aus einem HERO-Projekt,
   das unverändert aussehen muss.
5. Erst dann schneiden, wie faber-cut es beschreibt. Nach dem ersten Video noch einmal fragen, was am Stil anders
   sein soll, und es hier eintragen.

## Notizen (schon bekannt, vor dem Stilabgleich)

- Bild ab der Hüfte wie bei HERO (2026-10-09): "Auch hier bitte in diesem Fall erst ab Hüfthöhe starten."
