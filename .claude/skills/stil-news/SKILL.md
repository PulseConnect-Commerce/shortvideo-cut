---
name: stil-news
description: Schnittstil NEWS/Reaction von PulseConnect (News oder Reactions, ~60-80 s) - Design fest nacht-gruen (Anton in Großbuchstaben, das gesprochene Wort in einer Box in Logo-Hellgrün, dunkle Glas-Chips), Bild ab der Hüfte mit dem Gesicht 160 px höher, die Quelle (1-2 Screenshots aus dem Artikel, Stelle hellgrün markiert) als Hintergrund hinter ihm wie ein Greenscreen, große knackige Titel, große Untertitel, Kamera-Auslöser bei der Quelle und Riser vor seiner Meinung, am Ende die Frage mit Kommentar-Blase. Verwende diesen Skill zusammen mit faber-cut, sobald ein News- oder Reaction-Video geschnitten oder überarbeitet wird (der Nutzer sagt "News", "News-Reaction", "Reaction", "Reaktion auf ein Video", "Hot Take" zu einer Meldung) oder Feedback zu einem News-Video gibt.
---

# Stil NEWS / Reaction

**Wofür:** Er reagiert auf eine Meldung (Shopify, KI-Anbieter, E-Commerce-Studien): was passiert ist, was es kann,
seine Einordnung, eine Frage an die Community. Festgelegt am 2026-10-11 per Format-Onboarding (Skill
`format-onboarding`, ausgehend von HERO) am ersten News-Video "Shopify Canvas – Brauchen wir bald keine Webdesigner
mehr?" (`src/projekte/shopifycanvas/`, die Vorlage für jedes neue News-Video; dazu `src/projekte/kiweihnachten/`).
Er hat die Detailfragen weggeklickt; was unten "Empfehlung" heißt, ist vorläufig und wird nach seiner ersten
Vorschau nachgeschärft (siehe Notizen).

Der Ablauf (Clips laden, transkribieren, Schnitt, Vorschau, Vollversion, Übergabe) kommt aus dem Skill **faber-cut**;
hier steht, wie ein News-Video aussieht. Neue Geschmacksregeln aus seinem Feedback zu einem News-Video kommen hierher
unter "Notizen", mit seinem Satz und Datum.

## Design

**Immer `nacht-gruen`** (Variante 2 von nacht, Logo-Hellgrün `#00F090`; `src/lib/design.tsx`, Übersicht in
`.claude/skills/faber-cut/stil.md` unter "Designs"). Festgelegt am 2026-10-11: "Bitte alle News Videos in Zukunft
i, Video Stil 2 von oben schneiden. "Logo Hellgrün"" (kurz davor hatte er Variante 3 Mint-Hellblau gesagt, das gilt
nicht mehr). Schrift, Farben, Untertitel-Look, Hook-Look und Chips kommen aus dem Design. In der `Video.tsx`:
`<DesignRahmen design="nacht-gruen">`, `<Toenung />` über dem Bild.

## Bild

- 1080x1920, 30 fps, Deutsch, ein Grade (aus dem Design).
- **Ab der Hüfte, keine Hose** (wie HERO): fester Ausschnitt `scale(1.2)` ab der Oberkante, vorher messen.
- **Gesicht 160 px höher** (wie überall seit 2026-10-10): `translateY(-160px) scale(1.2)`, unten
  `<Bodenblende ab={HOSE * 1.2 - 160} />` gegen die Hose (HOSE = Quell-y, ab dem sie zu sehen ist, bei seinem
  Bürostuhl-Setup ~1680-1700).
- **Leichter Porträt-Modus** wie HERO (`npm run portrait`, Stärke 6).
- **Zoom ruhig** wie HERO (Empfehlung): ein langsames Zoom-in über das Video (100 % → 108 %) und 3 sanfte Akzente auf
  den stärksten Stellen (1,06; 8 Frames hin, 10 zurück).

## Die Quelle (das Besondere an NEWS)

- **1-2 Screenshots aus dem Artikel als Hintergrund hinter ihm**, er freigestellt davor wie bei einem Greenscreen
  ("Bei News-Artikel Verlinkungen bitte 1-2 Screenshots aus dem Artikel einblenden. Gerne auch als komplettes
  Hintergrundbild nachdem du mich als Person ausgeschnitten hast", 2026-10-11). Geht das nicht (Seite nicht
  erreichbar, Bild zu unruhig), die Quelle als Karte über dem Kopf ("ansonsten Variante 1 wählen").
- **Screenshots:** mit Playwright in Handy-Ansicht (412 px breit, Faktor 2,62 → ~1080 px), Cookie-Banner wegklicken;
  die Stelle, über die er spricht, im Artikel **hellgrün markieren** (`<mark>` in `#00F090`, dunkle Schrift) und
  mittig scrollen. Erst die Schlagzeile (Seite oben), dann die markierte Zahl oder Aussage.
- **Hintergrundbild bauen** (1080x1920, so wie es im fertigen Video aussehen soll): das Wichtige (Schlagzeile,
  markierte Stelle) liegt über dem Kopf, also zwischen y ~230 und ~650 (Kopf ab ~680 laut `npm run raster`). Liegen
  lassen in `public/broll/<projekt>/hg-*.png`.
- **In den Take rechnen:** `npm run portrait -- <projekt> --hintergrund public/broll/<projekt>/hg-x.png@<von>-<bis>
  [--hintergrund …] --ausschnitt 1.2,160` (von/bis in Sekunden im Take, genau die Sätze, die über die Quelle reden).
  Das Werkzeug stellt ihn dort frei und legt das Bild dahinter; überall sonst bleibt der weiche Porträt-Hintergrund.
- Während der Quelle: keine Titel über dem Kopf, nur unten links auf der Brust eine Quellen-Pille
  ("Quelle: Shopify, 1. Okt. 2026", `Tag kind="ink"`, y ~1228). Kamera-Auslöser (`kamera.mp3`) auf dem ersten Wort.
- **Fakten am Artikel prüfen**, bevor das Video rausgeht: jede Zahl und jede Aussage im Skript gegen die Quelle.
  Weicht etwas ab oder hat sich die Lage geändert (z. B. Angebot ausgebucht), ihm sofort sagen und erst nach seinem
  OK einplanen.

## Hook

- Seine Texteinblendung (z. B. "SHOPIFY BAUT DEINEN SHOP MIT KI?!") als Hook aus dem Design, zwei Zeilen, so geteilt,
  dass beide groß sind (z. B. "SHOPIFY BAUT" / "DEINEN SHOP MIT KI?!"), ab dem ersten Frame bis zur Quelle.
- Dazu auf dem Schlüsselwort eine Pille unter dem Hook (z. B. "NEUE KI-FUNKTION", "KI KAUFT SELBST EIN?").

## Untertitel

- **Groß wie FACE** (Empfehlung): 100 px, Oberkante y 1320 (auf der Brust unter dem Kinn), das gesprochene Wort in der
  hellgrünen Box. Fachbegriffe richtig (Shopify, Sidekick, Judge.me, "Builder" statt Whispers "Bilder").

## Grafiken über dem Kopf

- Pro Gedanke eine Szene `<Szene frei>` mit **großem, knackigem Titel** (92 px aus dem Design, 2-4 Wörter mit Haltung:
  "Sag's einfach der KI!", "Was wirklich verkauft", "Bauen ≠ verkaufen", "Der spannende Teil") und höchstens zwei
  Zeilen Chips darunter (Platz bis y ~650, darunter der Kopf). Mehr Begriffe nebeneinander (`tagBreite`), nicht
  untereinander.
- **Zahlen groß**, wenn er sie betont (z. B. "~33 %" in 210 px in der Leuchtfarbe auf "jeder Dritte").
- Tippt er im Beispiel einen Prompt ("Mach meine Startseite moderner"), läuft er als Chat-Chip Wort für Wort mit der
  Stimme mit (`typedSync`, `C.spoken`).
- Alle 1,5-2 s ändert sich etwas, aber kein Gewimmel.

## Schnitt und Ton

- **Tempo wie HERO** (Empfehlung): Pausen ab 0,2 s raus. Bei mehreren Anläufen den letzten vollständigen nehmen;
  abgebrochene Anläufe immer raus (am Ton nachprüfen: Whisper fasst Wiederholungen gern zu einem gedehnten Wort
  zusammen, dann die Wortzeiten in `t1.aligned.json` richtigstellen, Sicherung `.vor-korrektur`).
- Leise Effekte wie HERO (Wusch bei neuer Szene, Tick bei Chips, Stempel bei Warnungen). **Extra-Effekte:**
  `kamera.mp3` beim Einblenden der Quelle, `riser.mp3` vor seiner eigenen Meinung (Höhepunkt auf dem Wort, `at` =
  Wort − 48 Frames) ("Kamera + Riser", 2026-10-11). Keine Musik, -14 LUFS.

## Aufruf und Ende

- **"Folg mir" in der Mitte ohne Einblendung** (sein Wunsch beim Weihnachts-Video: "Den Folgen-CTA würde ich bewusst
  ohne Texteinblendung sprechen"; bei Canvas: "Den CTA kannst du direkt in die Kamera sprechen, ohne zusätzlichen
  Schnitt").
- **Am Ende seine Frage** als Titel ("KI als Shop-Designer?") mit Sprechblase "Schreib mir deine Meinung" und zwei
  Antwort-Pillen (Ja/Nein, empfehlen/einkaufen). Schluss direkt nach dem letzten Wort.
- In die Beschreibung: Quelle mit Datum und Link, Einordnung (z. B. "Umfrage, keine Prognose für Deutschland").

## Arbeitsweise

- Wie faber-cut: Rohschnitt, Vorschau, Gemini, er. Vollversion erst nach seinem OK; danach läuft die Übergabe ohne
  Rückfrage durch (Drive, Beschreibungen, Metricool zu der Zeit, die er nennt).
- Rechenzeit: Freistellen (`portrait`), Transkribieren und Rendern nie gleichzeitig laufen lassen, sie bremsen sich
  auf einem 4-Kern-Rechner gegenseitig auf einen Bruchteil aus. Eins nach dem anderen in einer Warteschlange.

## Notizen (neue NEWS-Regeln aus seinem Feedback)

<!-- Claude: trag hier jede neue Geschmacksregel für NEWS ein, mit seinem Satz in Anführungszeichen und dem Datum. -->

Herkunft der Regeln oben (Format-Onboarding am 2026-10-11, erste News-Videos shopifycanvas und kiweihnachten):
- Anders als HERO: "Bei News-Artikel Verlinkungen bitte 1-2 Screenshots aus dem Artikel einblenden. Gerne auch als
  komplettes Hintergrundbild nachdem du mich als Person ausgeschnitten hast", dazu gewählt: Schnitt & Bewegung,
  Untertitel, Ende & Porträt.
- Quelle: "Wenn möglich komplett als Hintergrund hinter meiner ausgeschnittenen Person legen, ansonsten Variante 1
  wählen".
- Effekte: "Kamera + Riser".
- Die Fragen zu Tempo, Zoom, Untertitel und Ende hat er weggeklickt: darum gelten die Empfehlungen (Tempo und Zoom
  wie HERO, Untertitel groß wie FACE, Frage mit Kommentar-Blase, Folgen ohne Einblendung). Nach seiner ersten
  Vorschau fragen, was anders sein soll, und hier eintragen.
