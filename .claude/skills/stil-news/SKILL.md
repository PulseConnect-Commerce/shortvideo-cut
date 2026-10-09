---
name: stil-news
description: Schnittstil NEWS/Reaction von PulseConnect (optionales Videoformat für News oder Reactions auf andere Videos, noch nicht festgelegt). Verwende diesen Skill zusammen mit faber-cut, sobald ein News- oder Reaction-Video geschnitten wird (der Nutzer sagt "News", "Reaction", "Reaktion auf ein Video"); solange der Stil nicht festgelegt ist, führt er vor dem ersten Schnitt einen Stilabgleich mit dem Nutzer durch.
---

# Stil NEWS / Reaction (noch nicht festgelegt)

NEWS/Reaction ist das optionale dritte Videoformat von PulseConnect neben HERO (Skill `stil-hero`) und FACE (Skill
`stil-face`): News oder Reactions auf andere Videos. Der Nutzer will dafür **nicht** denselben Stil wie für HERO
(Zitat und Datum: siehe `stil-face`).

## Stilabgleich beim ersten NEWS-Video (Pflicht, vor dem Schnitt)

Dieser Stil ist noch nicht festgelegt. Bevor du das erste NEWS-Video schneidest:

1. **Kurz klären, was NEWS ist:** Zweck, typische Länge, wie gedreht wird (sitzend, unterwegs, Bildschirm, fremdes
   Video), was der Zuschauer mitnehmen soll. Eine Frage, frei beantwortet.
2. **Abgleich mit HERO** (Skill `stil-hero`) in zwei Runden AskUserQuestion, je bis zu 4 Fragen, jeweils mit der
   HERO-Lösung als Option "wie HERO" und 1-2 Alternativen:
   - Runde 1: Untertitel (wie HERO / größer, mittig / keine), B-Rolls über dem Kopf (wie HERO / weniger / keine),
     Hook (wie HERO weiß-rot / andere Farben / ohne), Tempo (Pausen ab 0,2 s wie HERO / ruhiger / schneller).
   - Runde 2: Zoom (wie HERO ruhig / dynamischer / keiner), Porträt-Modus (wie HERO leicht / stärker / aus), Farben
     (wie HERO Blau + PulseConnect-Grün / andere), Ende und Aufruf (wie HERO "speichern" / folgen / kommentieren).
   Dazu, was NEWS ausmacht und HERO nicht hat (z. B. wie das fremde Video oder die Quelle gezeigt wird: Splitscreen, Bild-im-Bild, Screenshot der Schlagzeile; Quelle immer nennen, fremdes Material nur mit Recht oder als kurzes Zitat).
3. **Diese Datei neu schreiben** als "Stil NEWS" mit denselben Abschnitten wie `stil-hero` (Bild, Hook, Untertitel,
   B-Roll, Farben, Schnitt und Ton, Aufruf und Ende, Arbeitsweise, Notizen), seine Antworten mit Datum. Die
   `description` oben so umschreiben, dass sie den Stil kurz beschreibt (nicht mehr "noch nicht festgelegt").
4. **Technik:** `src/lib/stil.ts` enthält die HERO-Werte und bleibt so. Weichen Zahlen ab (Farben, Untertitel,
   Hook), leg die Abweichungen für NEWS getrennt an (z. B. `src/lib/stil-news.ts`) und mach den Stil je Projekt
   umschaltbar, statt die HERO-Werte zu ändern; danach `npm run typecheck` und ein Standbild aus einem HERO-Projekt,
   das unverändert aussehen muss.
5. Erst dann schneiden, wie faber-cut es beschreibt. Nach dem ersten Video noch einmal fragen, was am Stil anders
   sein soll, und es hier eintragen.
