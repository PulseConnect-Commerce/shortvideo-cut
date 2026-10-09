---
name: stil-face
description: Schnittstil FACE von PulseConnect für Meinungsvideos direkt in die Kamera (kurz, ~45-60 s, klare Haltung, Frage an die Community) - Bild ab der Hüfte, Punch-ins an Schnitten und Betonungen statt langsamem Zoom, große Untertitel (100 px) mit dem gesprochenen Wort in Blau, Hook als Balken (Stil pro Video wählbar), Bildkarten über dem Kopf wie HERO, leichter Porträt-Modus, am Ende Kommentar-Blase und Folgen-Knopf mit Plus. Verwende diesen Skill zusammen mit faber-cut, sobald ein FACE-Video geschnitten oder überarbeitet wird (der Nutzer sagt "FACE", "Meinungsvideo", "Hot Take") oder Feedback zu einem FACE-Video gibt.
---

# Stil FACE

**Wofür:** Meinungsvideos direkt in die Kamera: ein Thema, eine klare Haltung, am Ende eine Frage an die Community
(Kommentare) und der Aufruf zu folgen. Festgelegt am 2026-10-09 per Format-Onboarding (Skill `format-onboarding`,
ausgehend von HERO) am Video "KI-Agenten im Onlineshop – sinnvoll oder völliger Hype?" (`src/projekte/kiagenten/`,
die Vorlage für jedes neue FACE-Video).

Der Ablauf (Clips laden, transkribieren, Schnitt, Vorschau, Vollversion, Übergabe) kommt aus dem Skill **faber-cut**;
hier steht, wie ein FACE-Video aussieht. Alles, was hier "wie HERO" heißt, steht mit seinen Werten in `stil-hero`
und in `src/lib/stil.ts` (die HERO-Zahlen, unverändert). Neue Geschmacksregeln aus seinem Feedback zu einem
FACE-Video kommen hierher unter "Notizen", mit seinem Satz und Datum.

## Bild

- 1080x1920, 30 fps, Deutsch, ein Grade für alles (wie HERO).
- **Ab der Hüfte, keine Hose im Bild** (wie HERO): fester Ausschnitt ab der Oberkante
  (`<Takes transform="scale(…)" transformOrigin="50% 0%" />`), vorher messen. Bei kiagenten begann die Hose
  frühestens bei y 1640, also scale 1,2.
- **Porträt-Modus wie HERO:** `npm run portrait -- <projekt>`, Stärke 6.
- **Punch-ins statt langsamem Zoom:** an jedem sichtbaren Schnitt abwechselnd 1,0 und 1,07 (`autoPunch` aus
  `src/lib/kit.tsx`), dazu auf 3-4 Betonungen (Pointe, Frage, Tipp) kurz 1,1. Ein Jump-Cut wirkt so wie ein
  Kamerawechsel. Kein durchgehendes Zoom-in.
- **Rand frei:** an jeder Seite mindestens 60 px (wie HERO).

## Hook (erstes Bild bis zum zweiten Satz)

- Die Texteinblendung, die er mitgibt (z. B. "KI-AGENTEN: / GENIAL ODER BULLSHIT?"), in zwei Zeilen oben, ab dem
  ersten Frame. **Stil pro Video aus `HOOK_STILE`** (`src/lib/bausteine.tsx`); vor der Vorschau 3-4 Stile als
  Standbild aus seinem Clip zeigen, er wählt. Bei kiagenten: `balken` (weißer Balken, Kernzeile roter Balken).
- Nie in der Farbe der Untertitel (Blau). Höchstens 880 px breit, zentriert (wie HERO).

## Untertitel

- Wort für Wort, das gesprochene Wort in Blau `#31ADEC` (wie HERO), aber **größer: 100 px** statt 76, Oberkante
  y 1320 (unter dem Kinn, auf der Brust). Lange Wörter werden von selbst kleiner (`fitSize`).
- Fachbegriffe richtig schreiben (z. B. "KI-Agenten", "E-Commerce", "überhypt" statt Whispers "überhalbt").

## B-Roll: Bildkarten über dem Kopf (wie HERO)

- Pro Gedanke eine Bildkarte mittig über dem Kopf (x 95-985, y 262-692), Foto mit Nano Banana, darauf die Begriffe
  als Chips auf ihrem Wort (Bausteine aus `src/lib/broll.tsx`). Alle 1,5-2 s ändert sich etwas.
- Bei einer Meinung zeigen die Karten seine Gegenüberstellungen (Hype gegen echtes Problem, ohne gegen mit), keine
  Aufzählung von Funktionen.

## Farben (wie HERO)

- Blau `#31ADEC` fürs gesprochene Wort und neutrale Pillen, PulseConnect-Grün `#00E090` für Positives (immer mit
  dunkler Schrift), Rot für Warnungen und Kreuze.

## Schnitt und Ton

- **Skript als Gerüst** (wie HERO); wo er im Take anders formuliert, gilt seine gesprochene Fassung.
- **Mehrere Anläufe desselben Satzes: meistens den letzten nehmen** ("Nutze hier meistens den letzten Versuch"),
  außer er ist abgebrochen oder schlechter. Abgebrochene Anläufe immer raus.
- Pausen ab 0,2 s raus, keine Mini-Jump-Cuts, Stotterer mit dem Bild herausschneiden (wie HERO).
- Leise Soundeffekte unter der Stimme (Wusch bei neuer Karte, Tick bei Haken, Pop beim Folgen-Knopf), ≥ 6 dB unter
  der Stimme. Keine Musik. -14 LUFS.

## Aufruf und Ende

- **Kommentar und Folgen:** auf "Meinung" eine Sprechblase ("Deine Meinung?") in einer eigenen Karte, auf "Plus" ein
  Folgen-Knopf mit Plus, der angetippt wird (wird zu "Gefolgt"). Dazu die Frage des Videos ("Genial oder Bullshit?")
  noch einmal groß.
- Schluss direkt nach dem letzten Wort (wie HERO).

## Arbeitsweise

- Rohschnitt zuerst (ohne Grafiken), dann Vorschau, Gemini zweimal, dann er. Vollversion erst nach seinem OK; danach
  läuft die Übergabe ohne Rückfrage durch (faber-cut, Übergeben).

## Notizen (neue FACE-Regeln aus seinem Feedback)

<!-- Claude: trag hier jede neue Geschmacksregel für FACE ein, mit seinem Satz in Anführungszeichen und dem Datum. -->

Herkunft der Regeln oben (Format-Onboarding am 2026-10-09, erstes FACE-Video kiagenten):
- Format: "FACE" als Meinungsvideo gewählt; anders als HERO sollen sein: Text im Bild, Schnitt & Bewegung, Look &
  Ende (Grafiken bleiben wie HERO).
- Hook: Stil A "Balken weiß + rot"; Untertitel: B "Größer"; Tempo: "Wie HERO"; Zoom: "Punch-ins".
- Porträt: "Wie HERO"; Farben: "Wie HERO"; Ende: "Kommentar + Plus".
- Bild: "Auch hier bitte in diesem Fall erst ab Hüfthöhe starten."
- Takes: "ich habe an einigen Stellen den Abschnitt neu aufgenommen. Nutze hier meistens den letzten Versuch".
