---
name: stil-hero
description: Schnittstil HERO von PulseConnect für Erklär- und Expertenvideos (eher länger, ~1-3 min) - Hook weiß/rot, B-Roll-Bildkarten mit Nano-Banana-Fotos über dem Kopf, ein ruhiges durchgehendes Zoom-in mit wenigen Akzenten, leichter Porträt-Modus, Design nacht-mint (Mint-Hellblau), kleine ruhige Untertitel Wort für Wort, Speichern-Aufruf am Ende. Verwende diesen Skill zusammen mit faber-cut, sobald ein HERO-Video geschnitten oder überarbeitet wird (der Nutzer sagt "HERO", "Erklärvideo", "Expertenvideo") oder Feedback zu einem HERO-Video gibt.
---

# Stil HERO

**Wofür:** Erklär- und Expertenvideos, die etwas länger gehen (meist 1-3 Minuten): ein Thema in mehreren Punkten,
fachlich, oft nach einem Skript vom Teleprompter. Festgelegt am 2026-10-08/09 am Video "5 Checks vor dem Kauf in
einem unbekannten Onlineshop" (`src/projekte/shopcheck/`, die Vorlage für jedes neue HERO-Video).

Der Ablauf (Clips laden, transkribieren, Varianten, Schnitt, Vorschau, Vollversion) kommt aus dem Skill **faber-cut**;
hier steht, wie ein HERO-Video aussieht. Die Zahlen (Farben, Maße) stehen in `src/lib/stil.ts`, das sind die
HERO-Werte. Neue Geschmacksregeln aus seinem Feedback zu einem HERO-Video kommen in diese Datei (unten unter
"Notizen", mit seinem Satz und Datum), nicht in die Skills der anderen Formate.

**Design: immer `nacht-mint`** (Mint-Hellblau `#40E8E0`; festgelegt 2026-10-11: "Für News Videos immer Logo-Hellgrün. Für Hot
Takes die Neon Farbe und für Hero Videos Mint-Hellblau verwenden."). Schrift, Farben, Hook-Look, Untertitel-Look und
Chips kommen aus dem Design (`src/lib/design.tsx`, Übersicht in `.claude/skills/faber-cut/stil.md`); was hier unten
zu Farben steht (Blau, Rot, Weiß), gilt nur noch für die alten pulse-Videos. Alles andere aus diesem Skill (Bild,
Schnitt, Aufbau, Aufruf) bleibt.

## Bild

- 1080x1920, 30 fps, hochkant, für Instagram Reels und TikTok. Sprache Deutsch. Ein Grade für alles, kein Tracking.
- **Keine Beine im Bild:** sieht man unten die Hose, ein fester Ausschnitt ab der Oberkante
  (`<Takes transform="scale(…)" transformOrigin="50% 0%" />`), so weit, dass sie in keinem Frame mehr zu sehen ist.
  Vorher messen (bei shopcheck begann die Jeans frühestens bei y 1690, also scale 1,17).
- **Leichter Porträt-Modus:** nach dem freigegebenen Schnitt `npm run portrait -- <projekt>` (Standard Stärke 6:
  Hintergrund weich, aber erkennbar, wie eine Spiegelreflex mit offener Blende; nie ganz verwischt).
- **Zoom ruhig:** ein einziges durchgehendes Zoom-in über das ganze Video (100 % → 110 %), kein Stufenwechsel an den
  Schnitten. Dazu nur 3-4 kleine Akzente an den wichtigsten Stellen (Pointe, Warnung): sanft in 8 Frames auf 1,08
  (Anker 50 % 42 %, zwischen Augen und Kinn), halten bis zum Ende der Phrase, zurück in 10 Frames.
- **Rand frei:** an jeder Seite mindestens 60 px (≈ 3 mm) ohne Text, Grafik oder Bild.
- **Titel oben, Kopf direkt darunter, Untertitel unten** (seine Vorgabe seit 2026-10-11, alle Formate; ersetzt
  "Gesicht 160 px höher" und den kurzen Versuch mit dem Kopf ganz oben und den Titeln unter dem Kinn): Hook, Titel und
  Einblendungen stehen **oben** (Hook ab y ~210, Szenen-Titel ab y 262, Begriffe in **einer** Zeile darunter bis
  y ~510). Der Kopf beginnt direkt darunter, so hoch wie es geht: Bildlage "OBEN" mit
  `<Takes transform="translateY(-348px) scale(1.2)" transformOrigin="50% 0%" />` (bei seinem Bürostuhl-Setup liegt der
  Haaransatz dann bei y ~550-580, das Kinn bei ~1000-1100; mit Standbildern nachmessen, zwischen Begriffen und Haar
  mindestens 30 px). Untertitel bei y 1260 (klein, siehe Untertitel), unten `<Bodenblende ab={HOSE * 1.2 - 348} />` gegen Hose und leeren Rand.
  Pro Szene also nur Titel plus eine Zeile Begriffe: ein weiterer Begriff ersetzt den vorherigen (`until` = nächstes
  Wort - 4 Frames) oder steht daneben (`tagBreite`). Keine Pille unter dem Hook, keine Antwort-Chips (Ja/Nein) am
  Ende, nur die Kommentar-Blase. Akzent-Anker 50 % 42 %.
  **Ausnahme:** Solange etwas gelesen werden muss, das hinter oder über ihm steht (Zeitungsartikel, Screenshot der
  Quelle), liegt er tiefer, Lage "MITTE" (`translateY(-160px) scale(1.2)`), und wechselt danach zurück
  (`ausgabeFrames(C, von, bis)` aus `bausteine.tsx` gibt die Frames der Greenscreen-Stellen). Vorlage:
  `src/projekte/shopifycanvas/Video.tsx`.

## Hook (erstes Bild bis ~4 s)

- Der Hook-Satz steht ab dem ersten Frame fest oben, ohne Serienzeile, in zwei Zeilen. **Stil und Farbe wechseln von
  Video zu Video:** sechs Stile in `HOOK_STILE` (`src/lib/bausteine.tsx`, `<HookTitle stil=…>`): A `kontur` (weiß mit
  roter Kontur, Kern rot mit weißer, der erste Stil), B `balken` (weißer und roter Balken), C `rot` (rote Balken,
  schräg), D `schwarzgruen` (schwarze Balken, Kern PulseConnect-Grün), E `gelb` (Kern auf TikTok-Gelb), F `gruen`
  (Kern grün mit Kontur). Vor der Vorschau die Stile als Standbild nebeneinander zeigen (`--props='{"hookStil":"…"}'`),
  er wählt. Nie in der Farbe der Untertitel (Blau).
- Höchstens 880 px breit, zentriert (`STIL.hookBreite`). Er geht, bevor die erste Bildkarte kommt.

- **Titel groß und knackig** (wie FACE, seit 2026-10-10): jeder Szenen-Titel 2-4 Wörter mit Haltung (Behauptung,
  Frage, Ansage, gern "?!", eine Zahl oder "du/dein"), nie ein neutrales Etikett; im Design nacht 92 px groß.
  Er sagte es zum ersten FACE-Video "für die nächsten", darum gilt es auch hier.

## Untertitel

- **Klein und ruhig, nie wie ein Titel** (seine Vorgabe 2026-10-11, alle Formate): `const UT = { top: 1260, size: 64 }` (höher seit 2026-10-11, damit der Beschreibungstext der App sie nicht verdeckt; Quellen-Pille und Hinweise darunter bei y 1350),
  `<Captions C={C} fr={fr} top={UT.top} size={UT.size} />`. Im Design nacht: Space Grotesk fett, normale Groß- und
  Kleinschreibung, weiß mit dünner dunkler Kontur, **kein Kasten**, nur das gesprochene Wort in der Leuchtfarbe. Nie
  in derselben Schrift (Anton) oder Größe wie die Titel.
- Wort für Wort, 2-3 Wörter pro Seite. (pulse, alte Videos: das gesprochene Wort in Blau `#31ADEC`, Geist fett.)
- Fachbegriffe richtig schreiben, auch wenn er sie anders ausspricht (z. B. "WEEE-Nummer", "BattG-Gesetz").

## B-Roll: Bildkarten über dem Kopf

- Pro Thema (jeder Punkt der Liste, Einstieg, Warnung) eine **Bildkarte in der freien Fläche über dem Kopf**,
  **mittig** (x 95-985, ab y 262 bis 20 px über dem Haar; in Lage OBEN ist das wenig Platz, also eine flache Karte
  `<Szene hoehe={…}>`, nach Standbildern prüfen; reicht es für ein Foto nicht, darf der Kopf bei HERO etwas tiefer
  liegen, Haaransatz höchstens bei y ~640; links und rechts gleich viel Rand; unten rechts
  ab x 960 nur Foto, kein Begriff, dort liegt TikToks Knopfspalte): ein Foto füllt die Karte und fährt langsam heran
  (100 % → 106 %), darauf der Titel als weißer Chip (bei Punkten mit Nummer 1-5) und die Begriffe als weiße Chips,
  jeder **auf seinem Wort** (2 Frames vor dem Laut). Bausteine: `src/lib/broll.tsx`
  (`Szene photo=…`, `Pop`, `Row onPhoto`, `Tag`, `chip`, Icons).
- **Fotos mit Nano Banana:** `npm run bild -- "<prompt>" public/broll/<projekt>/<name>.jpg --format 21:9`, ein Foto
  pro Thema. Prompt-Stil: realistisches Editorial-Foto, weiches Tageslicht, gedeckte neutrale Farben, ruhig und
  sauber, geringe Schärfentiefe, **ohne Text, Buchstaben, Zahlen, Logos und Markennamen**. Jedes Foto ansehen, bevor
  es ins Video kommt; Fotos ins Git (sie sind nicht privat). Ohne Gemini-Abrechnung: gezeichnete Bildkarten.
- Was er nennt, sieht man auf dem Wort: Begriffe, Häkchen, Kreuze, Warnungen, Zahlen (nur gesagte Zahlen, nie
  erfundene Preise oder Nummern). Alle 1,5-2 s ändert sich etwas in der Karte.
- Folgen zwei Elemente am selben Platz aufeinander, geht das alte ganz raus, bevor das neue kommt (keine Überlappung).
- Der Aufruf am Ende hat eine eigene Karte ohne Foto: Lesezeichen, das sich in **TikTok-Gelb `#FACE15`** füllt
  (`STIL.save`), dazu der Satz, den er sagt.

## Farben

- Erste Akzentfarbe **Blau `#31ADEC`** (`STIL.yellow`): gesprochenes Wort, Nummern-Badges, neutrale Pillen.
- Zweite Akzentfarbe **PulseConnect-Hellgrün `#00E090`** (`STIL.accent2`): alles Positive (Haken, "ok", "gutes
  Zeichen", Schutz), immer mit dunkler Schrift.
- Rot (`STIL.red`) für Warnungen und Kreuze, Tinte (`STIL.ink`) für neutrale dunkle Pillen. Auf Blau und Grün nie
  weiße Schrift.

## Schnitt und Ton

- **Skript als Gerüst:** gibt er ein Skript mit, bestimmt es Reihenfolge und Inhalt. Was er im Take fachlich ergänzt
  (z. B. Widerrufs-Button, WEEE-Nummer, BattG), bleibt drin; nur Versprecher, Wiederholungen und Füllwörter fliegen
  raus. Wo er anders formuliert als im Skript, gilt seine gesprochene Fassung.
- **Mehrere Takes desselben Texts:** pro Satz den besten Take nehmen und mischen (sauberer Satz, Blick in die Linse,
  näher am Skript; die Aufzählung einheitlich: "Erstens … Viertens").
- Füllwörter immer raus, Pausen ab 0,2 s raus, aber keine Mini-Jump-Cuts. Kontext vor Tempo.
- **Wortdoppler am Pegel prüfen und im Bild herausschneiden:** Whisper schreibt Stotterer ("an- anbietet") nur einmal
  auf. Jede Stelle, die fillerscan meldet, am Pegel ansehen und **mit dem Bild herausschneiden, nie nur stumm machen**
  (man sieht die Lippen das Wort sagen). Den Satz dort teilen, die Schnittkanten am Pegel setzen (`"bis"` am Teil
  davor, `"von"` am Teil danach); bliebe ein Mini-Stück, läuft es mit `"bis"` einen kurzen Atemzug weiter, bis es
  0,8 s hat. `"stumm"` nur für Geräusche ohne sichtbare Mundbewegung.
- Leise Soundeffekte unter der Stimme (Wusch bei jeder neuen Karte, Tick bei Haken, Stempel bei Warnungen, Erfolg bei
  "ok"), ≥ 6 dB unter der Stimme. Keine Musik (die legt er in der App drunter). -14 LUFS.
- **Ab und zu ein Extra-Effekt** (Wunsch nach einem Referenzvideo; selbst synthetisiert, in `public/sfx/`): nie alle
  auf einmal, pro Video höchstens ein bis zwei davon, nur wo das Bild sie trägt, und von Video zu Video abwechseln.
  `klick.mp3` (Knopf oder Haken wird angetippt, Maus-Klick im Splitscreen), `kamera.mp3` (Screenshot, Foto, Bildkarte
  friert ein), `riser.mp3` (Spannung vor einer großen Aussage; Höhepunkt nach ~1,6 s, also `at` = Wort − 48 Frames),
  `glitzer.mp3` (Ergebnis, Vorher/Nachher, "magischer" Moment), `wusch-gross.mp3` (großer Szenenwechsel statt des
  normalen Wuschs). Auch sie ≥ 6 dB unter der Stimme.

## Aufruf und Ende

- Der Aufruf (meist "Speicher dir das Video …") kommt ans Ende.
- **Schluss direkt nach dem letzten Wort:** `ende.bis` ~0,1 s nach dem Ausklingen, am Pegel gemessen, kein Halt danach.

## Arbeitsweise

- Rohschnitt zuerst (ohne Grafiken), dabei sagen, dass Hook, Zooms, B-Rolls und Porträt-Modus erst mit der Vorschau
  kommen. Dann Vorschau, Gemini zweimal (jede Behauptung nachprüfen), dann er. Vollversion erst nach seinem OK.

## Notizen (neue HERO-Regeln aus seinem Feedback)

<!-- Claude: trag hier jede neue Geschmacksregel für HERO ein, mit seinem Satz in Anführungszeichen und dem Datum. -->

Herkunft der Regeln oben (seine Sätze beim ersten HERO-Video, 2026-10-08/09):
- B-Rolls: "Ich möchte über meinem Kopf bzw. dort, wo noch Platz ist auch passende Bilder zu den jeweiligen Themen
  anzeigen, sodass man das gesprochene auch gleich visuell hat."
- Hook und Zoom: "Und wo bleibt die Hook sowie ein paar leichte Zoom-In Animationen?", dann "jetzt sind es mir zu
  viele Zoom Ins und Zoom Outs. Ich dachte da eher an einige kleine Akzente, wo es relevant ist und ein dauerhaftes
  langsames Zoom-in."
- Bild: "Bitte unten die Hose rausschneiden."
- Skript: "Bitte unbedingt auch die beiden Punkte mit reinnehmen"; Takes: "Nutze die beiden besten Videoausschnitte
  aus beiden Videos".
- Farben: "Ich möcht gerne als zweite Akzentfarbe in den Videos immer ein hellgrün von PulseConnect verwenden.";
  Lesezeichen "Gelb/Orange …, wie es auch im Original ist"; Hook "nicht in der gleichen Farbe wie die Untertitel …
  ein weiß mit Rot … oder ein Rot mit weißer Umrandung".
- Porträt: "den Hintergrund aus dem Fokus nimmst und mich mehr im Fokus wie ein Portrait Modus", dann "nur leicht
  angepasst werden. Wie bei einer Spiegelreflexkamera" (Stärke 5 oder 6).
- Ende: "beim aller letzten Abschnitt sollte nach dem letzten Wort abgeschnitten werden"; Doppler: "An einer Stelle
  kommt noch das Wort 'an' zweimal vor."
- Rand: "Wir haben innerhalb des Videos einen Roten Bereich am Rand, der ca. 3mm breit ist, dieser sollte
  idealerweise keine Inhalte oder Bilder darin anzeigen."
- Doppler im Bild (2026-10-09): "Bei 0:48 sieht man, wie ich "an" vor dem "anbietet" sage, aber du hast hier nur den
  Ton vom "an" entfernt, nicht den Videoausschnitt dazu."
- Karten mittig (2026-10-09): "Bitte die eingeblendeten B-Rolls zentrieren. Links ist weniger Abstand als rechts."
- Hook-Stile (2026-10-09): "Bitte zu Beginn unterschiedliche Hook Titel Stile verwenden und verschiedene Farben
  ausprobieren."
- Hook-Wahl Video 2 "vertrauen" (2026-10-09): Stil B `balken`, Text "5 Vertrauens-Killer / in deinem Onlineshop"
  ("Ich finde Text 4 Stil B gut"). Den Satz "Bester Onlineshop der Welt? / Ohne Vertrauen kauft keiner." mochte er
  nicht: lieber kurz, mit Zahl und Schlagwort, statt den ersten Satz nachzuerzählen. Vor der Vorschau 3-4 Hook-Texte in
  1-2 Stilen als Standbilder zeigen (`--props='{"hookStil":"…","hook1":"…","hook2":"…"}'`).
- Gesicht höher (2026-10-10, nach dem ersten FACE-Video, für alle Formate): "Auch gefällt mir die Höhe meines
  Gesichts nicht. Dieses sollte noch um einiges höher liegen, sodass es nicht zur Hälfte von den Untertitel verdeckt
  wird". Aus den Standbildern gewählt: "A: etwas höher" (+160 px), und "Für alle Formate". Die Bildkarten werden dafür
  niedriger (`<Szene hoehe={…}>`, endet 20 px über dem Kopf laut Raster).
- Kopf im oberen Drittel (2026-10-11, zur Vorschau von Shopify Canvas; ersetzt die +160 px von 2026-10-10): "Leider
  passt meine Kopfposition nicht. Es wurde vereinbart, dass diese im obendrein drittel auftauchen soll. Nur da, weil
  z.B ein Zeitungsartikel gezeigt wird und man ihn sonst nicht lesen kann, kann man kopf nach unten geschoben werden".
- Titel wieder oben (2026-10-11, zur Canvas-Vorschau mit dem Kopf ganz oben und den Titeln unter dem Kinn): "Den Titel
  sowie die Einblendungen sollten bitte nach wie vor oben angezeigt werden. Untertitel passen unten soweit". Umgesetzt:
  Titel und eine Zeile Begriffe oben, der Kopf direkt darunter (1,2fach, 348 px nach oben), Untertitel bei y 1360.
- Untertitel kleiner (2026-10-11, zur dritten Canvas-Vorschau): "Die Untertitel sollten bitte kleiner sein und nicht so
  stark in auffälligen Farben dargestellt werden. Untertitel sollten deutlich kleiner sein, sonst wirkt es aufgrund
  der gleichen Schriftart und Farbe so aus wie ein Titel". Aus Standbildern bestätigt ("Ja, so passt es"): 64 px,
  Space Grotesk, kein Kasten, nur das gesprochene Wort in der Leuchtfarbe. Lage der Titel dabei bestätigt: "A: Titel
  über dem Kopf" (ganz oben, mit Abstand darüber).
- Untertitel höher (2026-10-11, beim Einplanen von Canvas und Apps): "Bei den nächsten Videos die Untertitel bitte etwas
  höher setzen, damit sie nicht von den captions überdeckt werden". Umgesetzt: y 1260 statt 1400, Quellen-Pille und
  Hinweis-Kasten darunter bei y 1350.
- Untertitel-Hervorhebung bleibt, Titel kürzer (2026-10-12): erst "die Untertitel nur einblenden, nicht highlighted",
  dann zurück: "Die Untertitel können ruhig farbig gehighlited werden. Den Titel kannst du aber kürzer einblenden".
  Umgesetzt: jede Szene mit `titelDauer={TITEL}` (`const TITEL = 75`, 2,5 s), danach blendet der Titel aus, die
  Begriffe bleiben stehen. Das gesprochene Wort bleibt in der Leuchtfarbe.
- Weniger Leuchtfarbe oben (2026-10-12): "Bitte die Akzentfarbe nicht so häufig im oberen Bereich verwenden. lieber
  häufiger weiß als Hintergrund der Karten nehmen und die Highlight Farbe nur bei ganz wichtigen Dingen sowie dem Titel
  verwenden". Umgesetzt im Design nacht: Chips und `Tag kind="ok"` weiß mit dunkler Schrift; die Leuchtfarbe hat nur
  der Titel und höchstens ein Begriff pro Szene mit `Tag kind="wichtig"` (der Kernpunkt).
