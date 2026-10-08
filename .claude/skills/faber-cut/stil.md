# Mein Schnittstil

angelegt beim Onboarding am 2026-10-08

Das ist mein Stil für meine Talking-Head-Videos. Sag ich beim Schneiden, was mir nicht gefällt, trägt Claude die
neue Regel hier ein (unter "Meine Notizen") und passt die Zahlen in `src/lib/stil.ts` an.

Die Zahlen dazu (Farben, Schrift, Maße, Lautstärke der Effekte) stehen in `src/lib/stil.ts`.

## Format

- 1080x1920, 30 fps, hochkant, für Instagram Reels und TikTok.
- Sprache: Deutsch.
- Länge je nach Video zwischen 30 s und 3 Minuten: kurze Reels knapp und dicht, ausführlichere Reaction- und
  Erklärvideos dürfen länger sein, solange jede Stelle etwas trägt. Die Länge kommt aus dem Inhalt, nicht aus einer
  Vorgabe.
- Ein Grade für alles, keine Gesichts-Verfolgung.
- Keine Musik: die lege ich selbst in Instagram oder TikTok drunter. Das Video kommt mit Stimme und Soundeffekten.

## Hook (die ersten 1-2 Sekunden)

- Der Hook-Satz steht **ab dem ersten Frame fest** oben, ohne Serienzeile darüber, der Kern in der Akzentfarbe.
- Beweis im Hook, wenn es einen gibt.

## Untertitel

- Jedes Video hat Untertitel, Wort für Wort, 2-3 Wörter pro Seite, das gesprochene Wort in meiner Akzentfarbe
  (Blau `#31ADEC`).
- Geist, fett, Satzschreibung, dünne dunkle Kontur und weicher Schatten.
- Vollbild: y 1340. Splitscreen: auf der Naht (y 872), etwas kleiner.

## Grafiken

- Viele Grafiken: alle 1,5-2 s ändert sich etwas, Tools und Zahlen erscheinen genau auf dem Wort. Aber nur Dinge,
  die die Zeile tragen.
- Neutral und sauber: weiße Karten mit dunkler Schrift, meine Akzentfarbe Blau `#31ADEC`, Geist und Geist Mono.
  Dunkle Schrift auf der Akzentfarbe, nie weiße (zu wenig Kontrast).
- Jede Grafik kommt **auf ihr Wort** (2 Frames vor dem Laut) und geht wieder, wenn sie fertig ist.
- Tool-Videos: Splitscreen, oben Grafiken, ich unten. Meinung und Aufruf: Vollbild.
- Leichte Punch-in-Zooms (bis 1,1) auf betonte Wörter, nur im Vollbild.
- Text in Grafiken mindestens 42 px.

## Schnitt und Ton

- Füllwörter immer raus, Pausen ab 0,2 s raus (sehr schnelles Tempo), aber keine Mini-Jump-Cuts.
- Kontext vor Tempo: der Grund hinter einer Aussage und jeder Teil des Aufrufs bleiben.
- J-Cuts an Satzanfängen: der nächste Satz ist 0,1 s zu hören, bevor er zu sehen ist.
- Leise Soundeffekte (Pop, Wusch, Stempel) unter der Stimme, ≥ 6 dB Abstand, aber hörbar (Lautstärke 0,16).
  -14 LUFS.

## Aufruf und Ende

- Der Aufruf kommt ans Ende, nicht in die Mitte.
- Das Ende hält mich im Bild unter der letzten Grafik (~0,6 s nach dem letzten Wort), dann ist Schluss. Kein leeres
  Bild mit Grafik.

## Arbeitsweise

- Erst drei Varianten als Text, ich wähle, dann wird geschnitten.
- Vorschau zuerst (halbe Größe), Gemini zweimal, dann ich. Vollversion erst nach meinem OK.
- Regieanweisungen spreche ich im Take ("Claude, füg hier … ein"): die werden umgesetzt und rausgeschnitten.

## Meine Notizen (neue Regeln kommen hier dazu)

<!-- Claude: trag hier jede Geschmacksregel ein, die der Nutzer beim Schnitt sagt, mit seinem Satz und Datum. -->

- **B-Rolls über dem Kopf** (2026-10-08): "Ich möchte über meinem Kopf bzw. dort, wo noch Platz ist auch passende
  Bilder zu den jeweiligen Themen anzeigen, sodass man das gesprochene auch gleich visuell hat." Jedes Thema bekommt
  eine Bildkarte in der freien Fläche über dem Kopf, deren Teile auf ihrem Wort erscheinen (Vorlage:
  `src/projekte/shopcheck/broll.tsx`). Echte Fotos, wenn welche da sind; sonst gezeichnete Bildkarten.
- **Hook und ein ruhiges Zoom-in gehören immer dazu** (2026-10-08): "Und wo bleibt die Hook sowie ein paar leichte
  Zoom-In Animationen?" Hook-Satz ab dem ersten Frame. Zoom: siehe "Zoom ruhig halten" unten. Im Rohschnitt
  dazusagen, dass Hook und Zooms erst mit der Vorschau kommen.
- **Keine Beine im Bild** (2026-10-08): "Bitte unten die Hose rausschneiden." Sitzt er am Tisch und die Hose ist unten
  im Bild: fester Ausschnitt ab der Oberkante (`Takes transform="scale(…)" transformOrigin="50% 0%"`), so weit, dass
  die Hose in keinem Frame mehr zu sehen ist (vorher messen).
- **Skript als Gerüst, Ergänzungen bleiben** (2026-10-08): "Bitte unbedingt auch die beiden Punkte mit reinnehmen"
  (Widerrufs-Button, WEEE-Nummer/BattG). Gibt er ein Skript mit, bestimmt es Reihenfolge und Inhalt; was er im Take
  fachlich ergänzt, bleibt drin. Nur Versprecher, Wiederholungen und Füllwörter fliegen raus.
- **Mehrere Takes desselben Texts** (2026-10-08): pro Satz den besten Take nehmen und mischen ("Nutze die beiden
  besten Videoausschnitte aus beiden Videos").
- **Zweite Akzentfarbe: PulseConnect-Hellgrün `#00E090`** (2026-10-08): "Ich möcht gerne als zweite Akzentfarbe in den
  Videos immer ein hellgrün von PulseConnect verwenden." Für alles Positive (Haken, "ok", Schutz, gutes Zeichen), immer
  mit dunkler Schrift. Blau `#31ADEC` bleibt die erste Akzentfarbe (gesprochenes Wort, Hook, Nummern). In `stil.ts`:
  `accent2`.
- **Speichern-Aufruf in TikTok-Gelb** (2026-10-08): "Bitte beim 'Label' ... die Farbe Gelb/Orange verwenden, wie es
  auch im Original ist" (das Speichern-Lesezeichen am Ende). Das Lesezeichen füllt sich in `#FACE15` (`STIL.save`).
- **Zoom ruhig halten** (2026-10-08): "jetzt sind es mir zu viele Zoom Ins und Zoom Outs. Ich dachte da eher an einige
  kleine Akzente, wo es relevant ist und ein dauerhaftes langsames Zoom-in." Ein einziges, durchgehendes Zoom-in über
  das ganze Video (100 % → 110 %), kein Stufenwechsel an den Schnitten. Dazu nur 3-4 kleine Akzente pro Video an den
  wichtigsten Stellen (Pointe, Warnung): sanft in 8 Frames auf ~1,08 (Anker zwischen Augen und Kinn), halten bis zum
  Ende der Phrase, sanft zurück in 10 Frames. Keine Nahaufnahmen im Sekundentakt.
