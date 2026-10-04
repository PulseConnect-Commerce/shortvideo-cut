# Mein Schnittstil

Das hier ist der Stil, mit dem ich meine Videos für Marketing Faber schneiden lasse. **Er gehört mir, nicht dir.**
Fang damit an, und dann ändere alles, was nicht zu dir passt: sag es Claude im Chat ("Untertitel kleiner", "kein
Splitscreen", "mehr Zooms"), dann setzt es das um und trägt die neue Regel hier ein. Nach ein paar Videos ist das
dein Schnittstil.

Die Zahlen dazu (Farben, Schrift, Maße, Lautstärke der Effekte) stehen in `src/lib/stil.ts`.

## Format

- 1080x1920, 30 fps, hochkant, für Instagram Reels und TikTok.
- Talking Head am Tisch, Handy hochkant. Ein Grade für alles, keine Gesichts-Verfolgung, keine Zooms pro Schnitt.
- Kein fertiges Musikbett: ich lege die Musik selbst in der App drunter. Das Video kommt mit Stimme und Soundeffekten.

## Hook (die ersten 1-2 Sekunden)

- Der Hook-Titel steht **ab dem ersten Frame fest** oben (kleine Zeile "MARKETING FABER · TAG n", darunter der Hook,
  der Kern in Gelb), nicht eingeblendet.
- Wenn ich das Handy hinstelle, ist das ein visueller Hook und bleibt drin, aber nur das letzte Stück: die Kamera
  landet auf mir, dann geht es sofort los ("0,5 s weg, dass es wirklich hingestellt ist und los").
- Beweis im Hook, wenn es einen gibt (z. B. das Video von gestern in einem Handy daneben).

## Untertitel

- Jedes Video hat Untertitel, Wort für Wort, 2-3 Wörter pro Seite, das gesprochene Wort gelb.
- Geist, fett, Satzschreibung (keine Großbuchstaben), dünne dunkle Kontur und weicher Schatten. Keine dicke
  Comic-Kontur ("sieht kindlich aus").
- Vollbild: y 1340. Splitscreen: auf der Naht (y 872), etwas kleiner.

## Grafiken

- Neutral und sauber: weiße Karten mit dunkler Schrift, ein Signalgelb, Geist und Geist Mono. Keine glühende
  KI-Optik.
- Jede Grafik kommt **auf ihr Wort** (2 Frames vor dem Laut) und geht wieder, wenn sie fertig ist.
- Alle 1,5-2 s ändert sich etwas, aber nur Dinge, die die Zeile tragen.
- Tool-Videos: Splitscreen, oben Grafiken (Schritt-Leiste, Terminal, Dokument), ich unten. Meine Meinung und der
  Aufruf: Vollbild.
- Claude Code wird als Terminal gezeigt, getippter Text läuft mit meiner Stimme.
- Punch-in-Zooms (bis 1,1) auf betonte Wörter, nur im Vollbild.
- Text in Grafiken mindestens 42 px.

## Schnitt und Ton

- Füllwörter immer raus, Pausen ab 0,3 s raus, aber keine Mini-Jump-Cuts.
- Kontext vor Tempo: der Grund hinter einer Aussage und jeder Teil des Aufrufs bleiben.
- J-Cuts an Satzanfängen: der nächste Satz ist 0,1 s zu hören, bevor er zu sehen ist.
- Soundeffekte (Pop, Whoosh, Stempel) leise unter der Stimme, ≥ 6 dB Abstand. -14 LUFS.

## Aufruf und Ende

- Der Follow-Aufruf kommt ans Ende, nicht in die Mitte ("nimm den CTA aus dem Flow raus und am Ende hin").
- Das Ende hält mich im Bild unter der letzten Grafik (~0,6 s nach dem letzten Wort), dann ist Schluss. Kein leeres
  Bild mit Grafik.

## Arbeitsweise

- Erst drei Varianten als Text, ich wähle, dann wird geschnitten.
- Vorschau zuerst (halbe Größe), Gemini zweimal, dann ich. Vollversion erst nach meinem OK.
- Regieanweisungen spreche ich im Take ("Claude, füg hier … ein"): die werden umgesetzt und rausgeschnitten.

## Meine Notizen (neue Regeln kommen hier dazu)

<!-- Claude: trag hier jede Geschmacksregel ein, die der Nutzer beim Schnitt sagt, mit seinem Satz und Datum. -->

- **Hook-Titel 1:1 wie gesprochen, oben, groß und fett:** der gesprochene Satz wörtlich, oben wie immer, so groß
  wie die Zeile in die Breite passt (bis 104 px, Schrift 900), steht bis kurz vor dem nächsten Satz (~1,8 s), die
  Untertitel laufen darunter weiter. Nicht nach unten verlegen, nicht länger stehen lassen: "es soll so bleiben, es
  soll immer nur größer sein … ein wenig größer machen, fetter machen." (Tag 6, 2026-10-04)
- **Der Aufruf am Ende bleibt am Stück, mit seiner Begründung**, so wie ich ihn gesagt habe: keine Pausen- oder
  Äh-Schnitte darin (ein "äh" wird nur leise, `"stumm"`), nichts davon weglassen. "Schau dir das Original an, das
  macht viel mehr Sinn, als wie du es geschnitten hast … das Ende macht kontextmäßig null Sinn." (Tag 6, v4)
- **Fluss vor Wortwiederholung:** ein doppeltes "dann" bleibt drin, wenn eine andere Fassung den Fluss zerstört.
  "Dann ist zweimal doppelt dann drin, ist okay … weil das zerstört den ganzen Flow." (Tag 6)
- **Doppelte Anläufe raus:** fängt er einen Satz zweimal an ("Wenn du … wenn du noch viel mehr"), fliegt der erste
  Anlauf raus, der zweite bleibt am Stück. (Tag 6)
- **Sichtbare Sprünge im Vollbild verstecken oder vermeiden:** lieber den Satz ungeschnitten lassen; sonst ein
  Zoomwechsel genau auf dem Schnitt. "Da ist ein harter Cut drin, den man sieht … verstecken mit einem Zoom." (Tag 6)
- **Grafik bis zum Schluss:** der Vollbild-Teil am Ende (Kommentare, Folgen) bekommt genauso viel Motion Graphics
  wie die Erklärung, nicht nur Pillen. "Am Ende … nur noch ich spreche und man verliert so ein bisschen das
  Pacing." (Tag 6)
