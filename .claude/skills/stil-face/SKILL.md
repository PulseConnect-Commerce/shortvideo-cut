---
name: stil-face
description: Schnittstil FACE von PulseConnect für Meinungsvideos direkt in die Kamera (kurz, ~45-60 s, klare Haltung, Frage an die Community) - Bild ab der Hüfte, ruhig geschnitten (wenig Schnitte und Zooms), große Untertitel (100 px) mit dem gesprochenen Wort in Blau, Hook als Balken (Stil pro Video wählbar), Begriffe als weiße Chips über dem Kopf (ohne Karte und Foto), leichter Porträt-Modus, am Ende Kommentar-Blase und Folgen-Knopf mit Plus. Verwende diesen Skill zusammen mit faber-cut, sobald ein FACE-Video geschnitten oder überarbeitet wird (der Nutzer sagt "FACE", "Meinungsvideo", "Hot Take") oder Feedback zu einem FACE-Video gibt.
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

**Design:** Farben, Schriften, Hook-Look, Untertitel-Look und Chips hier sind die des Designs **pulse**. Ab dem
nächsten Video werden die drei Varianten des Designs nacht getestet (`.claude/skills/faber-cut/stil.md` unter
"Designs"): dann gelten dessen Farben und Schriften, alles andere aus diesem Skill (Bild, Schnitt, Aufbau, Aufruf)
bleibt.

## Bild

- 1080x1920, 30 fps, Deutsch, ein Grade für alles (wie HERO).
- **Ab der Hüfte, keine Hose im Bild** (wie HERO): fester Ausschnitt ab der Oberkante
  (`<Takes transform="scale(…)" transformOrigin="50% 0%" />`), vorher messen. Bei kiagenten begann die Hose
  frühestens bei y 1640, also scale 1,2.
- **Porträt-Modus wie HERO:** `npm run portrait -- <projekt>`, Stärke 6.
- **Wenig Bewegung:** kein Punch-in an jedem Schnitt. Höchstens 2-3 sanfte Akzente auf den stärksten Stellen
  (Pointe, Frage), sonst ruhiges Bild (ein ganz langsames Zoom-in wie HERO ist ok). Das erste FACE-Video hatte
  Punch-ins an jedem Schnitt; das war ihm zu viel (siehe Notizen).
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

## B-Roll: Begriffe über dem Kopf (ohne Karte und Foto)

- Pro Gedanke **keine Karte und kein Foto**, nur der Titel und die Begriffe als weiße Chips direkt über dem Kopf im
  Bild (`<Szene frei>`, Bausteine aus `src/lib/broll.tsx`; Positionen wie bei HERO in der sicheren Fläche x 95-985,
  y 262-692), jeder Begriff auf seinem Wort. Auch Texte ohne eigenen Hintergrund (z. B. "Schreib mir deine Meinung")
  bekommen einen weißen Chip. Keine Nano-Banana-Fotos nötig. Alle 1,5-2 s ändert sich etwas.
- Bei einer Meinung zeigen die Karten seine Gegenüberstellungen (Hype gegen echtes Problem, ohne gegen mit), keine
  Aufzählung von Funktionen.

## Farben (wie HERO)

- Blau `#31ADEC` fürs gesprochene Wort und neutrale Pillen, PulseConnect-Grün `#00E090` für Positives (immer mit
  dunkler Schrift), Rot für Warnungen und Kreuze.

## Schnitt und Ton

- **Skript als Gerüst** (wie HERO); wo er im Take anders formuliert, gilt seine gesprochene Fassung.
- **Mehrere Anläufe desselben Satzes: meistens den letzten nehmen** ("Nutze hier meistens den letzten Versuch"),
  außer er ist abgebrochen oder schlechter. Abgebrochene Anläufe immer raus.
- **Weniger Schnitte als HERO:** Pausen erst ab 0,4 s raus (`pausen.min_gap: 0.4`), ganze Sätze möglichst am Stück
  aus einem Anlauf (`"ganz": true`, wenn die Pausen darin kurz sind), keine Mini-Jump-Cuts, Stotterer mit dem Bild
  herausschneiden. Lieber einen Satz mit kleiner Pause lassen als zwei Schnitte setzen.
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
- Hook: Stil A "Balken weiß + rot"; Untertitel: B "Größer"; Tempo: "Wie HERO"; Zoom: "Punch-ins" (beides nach dem
  ersten Video zurückgenommen, siehe unten).
- Porträt: "Wie HERO"; Farben: "Wie HERO"; Ende: "Kommentar + Plus".
- Bild: "Auch hier bitte in diesem Fall erst ab Hüfthöhe starten."
- Takes: "ich habe an einigen Stellen den Abschnitt neu aufgenommen. Nutze hier meistens den letzten Versuch".
- Weniger Zooms und Schnitte (2026-10-09, nach dem ersten FACE-Video): "Bitte beim nächste Video weniger Video Zooms
  und Schnitte. Das wirkt dann bei so einem Kurzen Video zu stark bearbeitet und es springt zu sehr zwischen den
  Sequenzen hin und her."
- Bilder randlos (2026-10-09): "Lass uns einmal das Bild oben aber in voller Breite und bis oben hin ganz ohne Rand
  anzeigen", dann "sieht gut aus, aber bitte darauf achten, dass noch ein Abstand der oberen Texte zum Rand des Bilder
  vorhanden ist". Das Gesicht bleibt in der Mitte ("Dann bitte Variante 1 verwenden"), nicht im oberen Drittel.
- Randlos wieder verworfen (2026-10-09): "Ich mag die vorherige Version lieber. Bitte einmal komplett ohne
  Hintergrundbild erstellen" → Versuch `<Szene frei>`: keine Karte, kein Foto, nur die weißen Chips über dem Kopf.
  Ob "frei" oder die Karte mit Foto bleibt, entscheidet er nach der Vorschau.
- Entschieden (2026-10-09): ohne Hintergrundbild ("sieht gut aus").
