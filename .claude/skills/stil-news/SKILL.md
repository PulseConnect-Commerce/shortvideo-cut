---
name: stil-news
description: Schnittstil NEWS/Reaction von PulseConnect (News oder Reactions, ~45-80 s) - freigegebener Look ab 2026-10-17: Briefing aus dem Kalender Punkt für Punkt, wenige Schnitte ohne Zoom-Wechsel, Farbkorrektur, er steht tiefer im Bild, über dem Kopf Hook-Titel (nacht-gruen) und danach Quelle und Skizzen/Icons/Animationen aus HyperFrames auf dunkler Karte, Untertitel im Editorial-Stil unter dem Kopf, ganz leichte eigene Musik und leise Soundeffekte auf den Skizzen. Verwende diesen Skill zusammen mit faber-cut, sobald ein News- oder Reaction-Video geschnitten oder überarbeitet wird (der Nutzer sagt "News", "News-Reaction", "Reaction", "Reaktion auf ein Video", "Hot Take" zu einer Meldung) oder Feedback zu einem News-Video gibt.
---

# Stil NEWS / Reaction

> **ERKLÄR-BILDER ab 2026-10-26 (alle Formate, freigegeben):** das Gesprochene als Bild mit Bewegung zeigen (Metapher pro Kerngedanke, auf das Wort getimt, 1–3 Wörter, handschriftliches Akzentwort), nicht nur Wörter hinschreiben. Vorlage P04 `src/projekte/pagebuilder`; Regeln in karten-aufbau.md "Visuelle Metaphern".
>
> **MARKEN-SHOPS ALS HINTERGRUND ab 2026-10-25:** In M-Folgen und allen Videos mit bekannten Marken steht er abschnittsweise freigestellt vor echten Screenshots aus Shop/Website der Marke (mind. 4–6 je Video, Wechsel alle 4–7 s nach Inhalt). Details: `.claude/skills/faber-cut/karten-aufbau.md`, Abschnitt "Marken-Shops als Hintergrund".
>
> **AUFBAU-KARTEN ab 2026-10-25 (alle Formate, geht allem darunter vor):** Grafiken nach `.claude/skills/faber-cut/karten-aufbau.md` (Vorlagen: `src/projekte/clarity`, `src/projekte/waterdrop`): eine helle Aufbau-Karte pro Gedanke, die sich Wort für Wort aufbaut, echte Quellen als Quellen-Karte, Pill-Untertitel (`src/lib/pillen.tsx`). **Er steht höher im Bild (Kopf oben knapp unter der Safe-Zone), Untertitel-Pille und Karten darunter** (seine Vorgabe 2026-10-25).
>
> **HELLE KARTEN ab 2026-10-22 (alle Formate, geht dem freigegebenen Look darunter vor):** die Skizzen über dem Kopf
> stehen auf **weißer oder hellgrauer Karte** statt dunkler, mit sauberen Linien-Icons statt Kreide-Skizzen, ruhiger
> Bewegung nach dem Motion-Skill und **zweifarbigem Titel** (zweiter Teil im PulseConnect-Verlauf Grün → Hellblau).
> Der Verlauf ersetzt die eine Leuchtfarbe des Formats. Alles Weitere: `.claude/skills/faber-cut/karten-hell.md`.
>
> **ERFOLGSFORMEL NEWS (ab 2026-10-23, wenn es inhaltlich Sinn macht):** Die bisher besten Videos waren "easyShop im
> Händlercheck" und "REWE liefert in 45 Minuten". Seine Vorgabe: "Ja, bitte deinen Vorschlag zu den NEWS Videos immer
> berücksichtigen, wenn es natürlich Sinn macht. Vor allem ist mir aufgefallen, dass große bekannte Markennamen wie
> REWE, OTTO, AMAZON, LIDL, DHL usw. immer besser ziehen und in der Hook erwähnt werden sollten".
> 1. **Bekannte Marke in den Hook:** geht es um REWE, OTTO, Amazon, Lidl, DHL, Shopify, Temu …, steht der Name im
>    Hook-Titel (möglichst vorne, in Versalien) und im ersten Satz; auch im TikTok-/YouTube-Titel und in der
>    ersten Caption-Zeile.
> 2. **Konkrete Zahl oder Frage im Hook** ("in 45 Minuten", "1,5 % → 2 %", "Lohnt sich …?").
> 3. **Die echte Quelle im Bild** (Artikel-Kopf oder Video, auf das er reagiert), früh in den ersten ~8 s.
> 4. **Klarer Nutzen für Händler** (was heißt das für deinen Shop?) und am Ende eine Frage an die Community.
> 5. **Loop**, wenn das Transkript es hergibt: der letzte Satz läuft nahtlos in den ersten.
>
> **CTA (ab 2026-10-23, alle Formate):** der Aufruf (Folgen, Speichern, Kommentieren) darf auch am Anfang oder in der
> Mitte stehen, wenn er im Transkript inhaltlich dort passt ("CTA kann auch ruhig mal gegen Anfang oder in der Mitte
> des Videos kommen, wenn es inhaltlich im Transkript dazu passt"). Nicht künstlich ans Ende verschieben.
>
> **FREIGEGEBENER LOOK ab 2026-10-17 (geht allen Blöcken darunter vor; die sind nur noch Vorgeschichte).**
> Seine Freigabe nach dem Beispiel REWE × Lieferando: "perfekt, genau so gefällt mir das. Bitte so als Skill
> abspeichern für die nächsten Videos". Gilt für NEWS/Reaction, FACE und HERO, nicht für die Serie "E-Commerce einfach
> erklärt". Vorlage im Code: `src/projekte/rewe/Video.tsx` mit `neu` (alles unten, wie freigegeben) und die Skizzen
> `hyperframes/rewe-skizzen/index.html`.
> 1. **Briefing** im Kalender Punkt für Punkt umsetzen, Checkliste mit Rohschnitt und Vorschau (Regel 00 im Skill
>    faber-cut).
> 2. **Schnitt:** wenige Schnitte, ganze Sätze, je Satz der letzte saubere Anlauf; Tempo wie im easyJet-Video.
>    Grundlage ist ein ruhiges Zoom-in (3 % über das ganze Video). **Ab 2026-10-23 erlaubt: ein paar Zoom-Schnitte, wo sie Sinn machen** (seine Vorgabe: "Es können durchaus mal ein paar Zoom Schnitte rein, wenn durchaus auch Sinn macht"): ein Punch-in (~1,15-fach) auf eine Kernaussage, eine Zahl, eine Pointe oder einen Abschnittswechsel, auf einem Schnitt, nie mitten im Satz; zurück auf weit beim nächsten Schnitt. Etwa alle 15-25 s höchstens einer, nicht bei jedem Schnitt, nie wenn oben eine Karte steht und der Zoom sie verdecken würde.
> 3. **Bild:** Farbkorrektur `npm run farbe` vor dem Porträt, **sanft** (nicht heller, nicht kontrastreicher; seine
>    Vorgabe 2026-10-18: "zu kontrastreich und zu hell", dann "optimieren und abschwächen", Regel 5b in faber-cut),
>    im Video `<Takes … grade={STIL.gradeSanft} />` statt des Design-Grades, leichter Porträt-Modus (Hintergrund weich). Er steht
>    **mittig und nicht zu tief** (Augen bei ~800-830, Kopf und Körper waagrecht mittig; seine Rüge 2026-10-23: "Ich bin zu weit unten mit dem Gesicht" und "nicht zentriert, sondern leicht rechts versetzt"; DHL: `scale 1.3`, `hoch 350`, `x 65`), oben bleibt Platz für Titel und Karten.
> 4. **Oben über dem Kopf:** während der Hook der Hook-Titel im alten Titel-Stil (`HookTitle`, nacht-gruen), danach
>    die B-Rolls: Quellen-Screenshot (Breite ~560 ab y 300, Quellenzeile direkt darunter) und **Skizzen, Icons und
>    Animationen aus HyperFrames** auf dunkler Karte (x 153-927, y 290-623), jede auf ihrem Wort. Jede Aussage und
>    jedes Beispiel bekommt eine (Ablauf im Skill faber-cut, Abschnitt "Skizzen, Icons und Animationen").
> 5. **Untertitel** im neuen Stil (`EditorialUntertitel`: 1-3 Wörter, Anton, betonte Wörter groß in
>    Playfair-Kursive, Zahlen grün) **unter dem Kopf bei y ~1400**, in Standardgröße, auch während der Hook.
> 6. **Ton:** ganz leichte eigene Musik (`<Musik>`; NEWS `news`, FACE `puls`, HERO `ruhig`; ~21 dB unter der
>    Stimme), leise Soundeffekte auf jeder Skizze (`pop`), auf Zählern und Uhren (`pop`/`tick`), auf dem Haken
>    (`success`) und auf der Quelle (`klick`). Keine Whooshes auf jedem Schnitt.
> 7. **Prüfungen** wie immer (checks mit Musikabstand, kontrolle vor dem Upload).

> Ältere Looks (Vorstufen vom 16. und 17.10.) stehen in `archiv.md` im selben Ordner; sie gelten nicht mehr.

## Design

**Immer `nacht-gruen`** (Variante 2 von nacht, Logo-Hellgrün `#00F090`; `src/lib/design.tsx`, Übersicht in
`.claude/skills/faber-cut/stil.md` unter "Designs"). Festgelegt am 2026-10-11: "Bitte alle News Videos in Zukunft
i, Video Stil 2 von oben schneiden. "Logo Hellgrün"" (kurz davor hatte er Variante 3 Mint-Hellblau gesagt, das gilt
nicht mehr). Schrift, Farben, Untertitel-Look, Hook-Look und Chips kommen aus dem Design. In der `Video.tsx`:
`<DesignRahmen design="nacht-gruen">`, `<Toenung />` über dem Bild.

## Bild

- 1080x1920, 30 fps, Deutsch, ein Grade (aus dem Design).
- **Ab der Hüfte, keine Hose** (wie HERO): fester Ausschnitt `scale(1.2)` ab der Oberkante, vorher messen.
- **Bildlage nach seinem Referenzvideo** (2026-10-15, gilt für alle Formate, geht den älteren Lage-Angaben vor; "Bitte
  orientiere dich an das Video. Hier wird genau erklärt, wo die Augen sein sollen, welche Bereiche vermieden werden
  sollen"): **Augen bei y ~610-775** (Mitte ~700), Gesicht groß (Kopf beginnt bei ~y 350-450); **Texthook oben bei y
  ~250-475**, mittig, darf den Haaransatz berühren; **Einblendungen auf der Brust bei y ~1100-1650** (nicht über dem
  Kopf); sicherer Bereich x 150-925, y 250-1625; **tabu** sind rechts ab x ~925 (ab y ~750) und unten ab y ~1650.
  Beim Ranzoomen bleiben die Augen auf derselben Höhe. Nicht vor weißer Wand filmen (Tiefe schaffen). Umsetzung mit
  `serienVideo(..., bild, { einblendungen: 800, untertitel: 1460 })` (Vorlage `src/projekte/verkauft/Video.tsx`,
  dort 1,8-fach bei scharfer 1080er-Aufnahme). Vor dem Abschicken an Standbildern die Augenhöhe messen.
- **Tabu-Zonen oben, rechts und unten** (seine Vorgabe 2026-10-14, gilt für alle Formate und geht allen Lage-Angaben
  unten vor: "Bitte in Zukunft beim Bild Hochladen immer den oberen und unteren Teil sowie den rechten Teil als
  Tabu-Zone zum Anzeigen von Inhalten und Texten nutzen"; TikToks Suchleiste hatte den Text oben verdeckt). Werte in
  `src/lib/zonen.json`: oben bis y 280, rechts ab x 900 (Like-/Kommentar-Leiste), unten ab y 1560, sicher also
  `[80, 280, 900, 1560]`. Hook, Titel, Chips, Quellen-Markierungen und Quellen-Pille stehen **nur in y 280-560**
  und links von x 900 (mittig in dieser Fläche, nicht mittig im ganzen Bild), Untertitel bei y 1260-1500. Damit das
  passt, sitzt der Kopf tiefer: Bildlage `translateY(-204px) scale(1.2)` (Haar bei y ~600), Hook in
  `translateY(56px) scale(0.8)`, Szenen ohne Verschiebung. Vorlage `src/projekte/_serie/Serie.tsx`. Vor dem Abschicken
  an Standbildern prüfen, dass nichts in die Tabu-Zonen ragt (das Bild selbst darf bis an den Rand gehen).
- **Titel oben, Kopf direkt darunter, Untertitel unten** (seine Vorgabe seit 2026-10-11, alle Formate; ersetzt
  "Gesicht 160 px höher" und den kurzen Versuch mit dem Kopf ganz oben und den Titeln unter dem Kinn): Hook, Titel und
  Einblendungen stehen **oben** (Hook ab y ~210, Szenen-Titel ab y 262, Begriffe in **einer** Zeile darunter bis
  y ~500). Der Kopf beginnt direkt darunter: **das Gesicht im unteren Teil des oberen Drittels** (Augen bei y ~600-640,
  seine Vorgabe 2026-10-12: "mein Gesicht könnte hier etwas höher gesetzt sein, im unteren Teil des oberen Drittels"),
  Bildlage "OBEN" mit `<Takes transform="translateY(-384px) scale(1.2)" transformOrigin="50% 0%" />` (bei seinem
  Bürostuhl-Setup Haar bei y ~440, Augen ~670; mit Standbildern nachmessen), **während der Hook** tiefer
  (`scale 1.2, hoch 300`, Kopf ab ~530; der Wechsel fällt mit dem Schnitt auf die Quelle zusammen). **Alle Einblendungen enden mindestens 30 px über
  dem Haar** ("Jetzt liegen die Einblendungen leider direkt auf meinem Kopf. Sie müssten somit ein wenig über meinem
  Kopf angezeigt werden", 2026-10-12): der Hook in `<AbsoluteFill style={{ transform: "translateY(40px) scale(0.68)",
  transformOrigin: "50% 0%" }}>` (y ~215-445, über dem tieferen Kopf der Hook-Lage), jede Szene in
  `<AbsoluteFill style={{ transform: "translateY(-80px)" }}>` mit `<Szene … frei mittig>` (Titel y ~210-340), die Begriffe in **derselben Zeile** wie der Titel (`y={10}`), der Titel blendet aus, sobald der
  erste Begriff kommt (`titelDauer={Math.min(TITEL, ersterBegriff - at - 8)}`). Vorlage `src/projekte/temu/Video.tsx`.
  **Alle Einblendungen horizontal mittig** ("Kannst du bitte die B-Roll Einblendungen zukünftig mittig einblenden?
  Einige sind hier nicht genau zentriert, sondern leicht versetzt", 2026-10-12, nach Temu): Titel, Chips, Zeilen,
  "−35,5 %"-Chips und Hinweise nicht mit festem `x={24}` links anlegen, sondern mittig setzen. Einzelne Einblendung:
  `<Pop x={0} w={1080} style={{ textAlign: "center", transformOrigin: "center center" }}>` (innerhalb einer Szene
  `x={-BOX.left}`); eine Chip-Zeile als Ganzes mitteln (Gesamtbreite aus `tagBreite` plus Abstände, Start
  `x = (1080 - gesamt) / 2`, bei Szenen minus `BOX.left`), so dass der letzte Begriff die Zeile mittig abschließt. Der
  Szenen-Titel steht ebenfalls mittig. Nur die Quellen-Pille bleibt klein unten rechts. Vor dem Abschicken an einem
  Standbild nachmessen: linker und rechter Rand gleich (±10 px). Untertitel bei y 1260 (klein, siehe Untertitel).
  **Unten nie schwarz** (2026-10-12: "Unsere Shortvideos sind alle unten komplett schwarz und oben dafür ein wenig
  abgeschnitten"): keine `Bodenblende` mehr. Der Ausschnitt muss das Bild bis zum unteren Rand füllen, also
  `(1920 + hoch) / scale ≤ 1920` (bei 1.2 also hoch ≤ 384); ganz unten sitzen Hände und Hosenbund unter TikToks Text,
  das ist in Ordnung. Nur ein leichter Verlauf für die Lesbarkeit der App-Texte:
  `<AbsoluteFill style={{ background: "linear-gradient(180deg, rgb(6 7 10 / 0) 1640px, rgb(6 7 10 / 0.55) 1920px)" }} />`.
  **Nie stärker als 1,2-fach vergrößern** und das langsame Zoom-in höchstens bis 103 %, Akzente 1,03 ("Leider gefällt
  mir die Qualität des neuen Videos überhaupt nicht. Es sieht leider zu unscharf aus", 2026-10-12: Temu war mit 1,35
  plus Zoom 108 % plus Akzent 106 % rund 1,55-fach hochgezogen, aus einer ohnehin weichen Aufnahme).
  TikTok schneidet auf hohen Handys links und rechts je ~5 % ab und legt seine Leisten über das Bild: Text nie
  näher als 60 px an den Seitenrand.
  Pro Szene also nur Titel plus eine Zeile Begriffe: ein weiterer Begriff ersetzt den vorherigen (`until` = nächstes
  Wort - 4 Frames) oder steht daneben (`tagBreite`). Keine Pille unter dem Hook, keine Antwort-Chips (Ja/Nein) am
  Ende, nur die Kommentar-Blase. Akzent-Anker 50 % 42 %.
  **Auch vor der Quelle bleibt er in dieser Lage** (seit 2026-10-12, Temu; vorher lag er dort tiefer, "MITTE" mit
  -160, und die Einblendungen klebten am oberen Rand: "Die eingeblendeten B-Rolls sind meiner Meinung nach viel zu
  hoch und stehen direkt am oberen Rand, obwohl nach unten hin noch mehr Platz vorhanden ist"). Kein Lagewechsel mehr;
  `ausgabeFrames(C, von, bis)` aus `bausteine.tsx` gibt die Frames der Greenscreen-Stellen. Vorlage:
  `src/projekte/temu/Video.tsx`.
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
  markierte Stelle) liegt über dem Kopf und über der Einblendung zur Quelle: markierte Stelle endet bei y ~245
  (Screenshot: `scrollTo(markBottom - 93)` in CSS-Pixeln), die Einblendung dazu (z. B. groß "−35,5 % Umsatz",
  `Tag kind="wichtig" size={64}`) direkt darunter bei y 265-360, der Kopf ab ~440. Liegen
  lassen in `public/broll/<projekt>/hg-*.png`.
- **In den Take rechnen:** `npm run portrait -- <projekt> --hintergrund public/broll/<projekt>/hg-x.png@<von>-<bis>
  [--hintergrund …] --ausschnitt 1.2,430` (von/bis in Sekunden im Take, genau die Sätze, die über die Quelle reden; `bis` mindestens 0,15 s nach dem letzten Wort, sonst blitzt am Schnitt ein Einzelbild mit dem Raum auf, so passiert bei KI-Kunde 2026-10-12, gefunden von `npm run checks`).
  Das Werkzeug stellt ihn dort frei und legt das Bild dahinter; überall sonst bleibt der weiche Porträt-Hintergrund.
- Während der Quelle: keine Titel über dem Kopf, nur die **Quelle klein unten rechts** im sicheren Bereich
  ("Quelle: Shopify, 1. Okt. 2026", `Tag kind="ink" size={28}`, `<Pop x={60} y={1440} w={890} style={{ textAlign:
  "right", transformOrigin: "right center" }}>`, rechte Kante x 950; seine Vorgabe 2026-10-11). Kamera-Auslöser
  (`kamera.mp3`) auf dem ersten Wort.
- **Immer mit Quelle** (seine Vorgabe 2026-10-15 zum easyJet-Video: "Zudem fehlt mir hier eine Quelle" und "bitte ein
  paar Quellen im Video mit einblenden, also als Screenshot-Ausschnitte"): kein News-Video ohne Screenshots aus dem
  Artikel. Den Satz, mit dem er auf die Meldung zeigt ("Jetzt schaut euch mal diese Meldung hier an"), nie streichen,
  dort beginnt die Quelle. Mehrere markierte Stellen (eine pro Kernaussage) statt nur der Schlagzeile. Mit dem
  Serien-Template (`src/projekte/_serie/Serie.tsx`) geht das über `layout.quelle` (Bild 1,2-fach mit den Augen auf
  derselben Höhe wie sonst, `npm run portrait -- <projekt> --ausschnitt 1.2,<hoch>,<x>`; Beispiel easyJet). Beim
  Screenshot das Pop-up-Dunkel (`.modal-backdrop`) und schwebende Knöpfe ausblenden, mehrzeilige Markierungen ganz
  oben unter die Kopfleiste scrollen (`b.top - 42` CSS-Pixel), damit sie über dem Kopf stehen.
- **Fakten am Artikel prüfen**, bevor das Video rausgeht: jede Zahl und jede Aussage im Skript gegen die Quelle.
  Weicht etwas ab oder hat sich die Lage geändert (z. B. Angebot ausgebucht), ihm sofort sagen und erst nach seinem
  OK einplanen.

- **Ab 2026-10-28: Quelle groß, er klein in der Ecke** (geht vor die Punkte oben, wo sie sich widersprechen). Er:
  "Kannst du bitte beim Einblenden der News oder anderen Zitaten von Quellen meinen Kopf weiter nach unten schieben,
  damit man auch die Quelle lesen kann? Oder ansonsten einfach mein Video in dem Moment kleiner machen und in Ecke
  schieben?" Solange eine Quelle oder ein Zitat gezeigt wird, steht der echte Screenshot scharf und groß über das ganze
  Bild (markierte Sätze im Fokus), er läuft als abgerundete Bubble unten rechts weiter (x 520-900, y 1010-1480), die
  Pille links daneben; Ein- und Ausgang 0,35 s. Baustein `src/lib/quelle-gross.tsx`, Regeln in
  `.claude/skills/faber-cut/karten-aufbau.md` "Quelle groß, er klein in der Ecke (2026-10-28)", Vorlage N09
  `src/projekte/ebaykombi`. Quellen-Hintergründe mit Lesetext nicht mehr hinter seinen Kopf legen.

## Hook

- Seine Texteinblendung (z. B. "SHOPIFY BAUT DEINEN SHOP MIT KI?!") als Hook aus dem Design, zwei Zeilen, so geteilt,
  dass beide groß sind (z. B. "SHOPIFY BAUT" / "DEINEN SHOP MIT KI?!"), ab dem ersten Frame bis zur Quelle.
- Dazu auf dem Schlüsselwort eine Pille unter dem Hook (z. B. "NEUE KI-FUNKTION", "KI KAUFT SELBST EIN?").

## Untertitel

- **Klein und ruhig, nie wie ein Titel** (seine Vorgabe 2026-10-11, alle Formate): `const UT = { top: 1260, size: 64 }` (höher seit 2026-10-11, damit der Beschreibungstext der App sie nicht verdeckt; Quellen-Pille und Hinweise darunter bei y 1350),
  `<Captions C={C} fr={fr} top={UT.top} size={UT.size} />`. Im Design nacht: Space Grotesk fett, normale Groß- und
  Kleinschreibung, weiß mit dünner dunkler Kontur, **kein Kasten**, nur das gesprochene Wort in der Leuchtfarbe. Nie
  in derselben Schrift (Anton) oder Größe wie die Titel.
- Fachbegriffe richtig (Shopify, Sidekick, Judge.me, "Builder" statt Whispers "Bilder").

## Grafiken über dem Kopf

- Pro Gedanke eine Szene `<Szene frei>` (oben, über dem Kopf, siehe Bild) mit **großem, knackigem Titel** (92 px aus
  dem Design, 2-4 Wörter mit Haltung: "Sag's einfach der KI!", "Was wirklich verkauft", "Bauen ≠ verkaufen", "Der
  spannende Teil") und **einer** Zeile Chips darunter (`y={118}`, endet bei y ~510). Mehr Begriffe nebeneinander
  (`tagBreite`) oder nacheinander (der nächste ersetzt den vorigen), nie untereinander.
- **Zahlen groß**, wenn er sie betont (z. B. "~33 %" in 112 px in der Leuchtfarbe, mit Abstand unter dem Titel auf "jeder Dritte", der Chip
  daneben; größer geht nicht, sonst liegt die Zahl auf dem Kopf).
- Tippt er im Beispiel einen Prompt ("Mach meine Startseite moderner"), läuft er als Chat-Chip Wort für Wort mit der
  Stimme mit (`typedSync`, `C.spoken`).
- Alle 1,5-2 s ändert sich etwas, aber kein Gewimmel.

## Schnitt und Ton

- **Tempo wie HERO** (Empfehlung): Pausen ab 0,2 s raus. Bei mehreren Anläufen den letzten vollständigen nehmen;
  abgebrochene Anläufe immer raus (am Ton nachprüfen: Whisper fasst Wiederholungen gern zu einem gedehnten Wort
  zusammen, dann die Wortzeiten in `t1.aligned.json` richtigstellen, Sicherung `.vor-korrektur`).
- Leise Effekte wie HERO (Wusch bei neuer Szene, Tick bei Chips, Stempel bei Warnungen). **Extra-Effekte:**
  `kamera.mp3` beim Einblenden der Quelle. **Kein Riser** ("Bitte den Sound bei 0:51 entfernen. Mir gefällt dieser
  leider überhaupt nicht", 2026-10-12, Temu: das war `riser.mp3` vor "Meine Meinung"; ersetzt "Kamera + Riser" vom
  2026-10-11). **Effekte sparsam** ("Die anderen Soundeffekte können ruhig drin bleiben, jedoch sollten diese im
  Video nicht zu oft verwendet werden", 2026-10-12): höchstens etwa ein Effekt pro 12 Sekunden, nur an echten
  Wendepunkten (Kamera bei der Quelle, Stempel auf der großen Zahl, Whoosh beim Wechsel zu seiner Meinung), keine
  Ticks auf jedem Begriff.
  **Variante ohne Untertitel nur auf seine ausdrückliche Anweisung** (2026-10-15, gilt für alle Formate): `npm run final -- <Video> --ohne-untertitel` (Prop `untertitel: false`). Er legt die
  Untertitel dann in TikTok selbst ins untere Drittel ("Ich lege die Untertitel-Position bei TikTok manuell im unteren
  Drittel fest"): dort nichts von uns, keine Hinweis-Chips bei y 1350, die Quellen-Pille bei y 1190. Keine Musik, -14 LUFS.

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
- Effekte: "Kamera + Riser" (2026-10-11), der Riser ist seit 2026-10-12 raus.
- Die Fragen zu Tempo, Zoom, Untertitel und Ende hat er weggeklickt: darum gelten die Empfehlungen (Tempo und Zoom
  wie HERO, Untertitel groß wie FACE, Frage mit Kommentar-Blase, Folgen ohne Einblendung). Nach seiner ersten
  Vorschau fragen, was anders sein soll, und hier eintragen.
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
- Quelle kleiner (2026-10-11): "Die Quelle kann beim nächsten Mal ruhig deutlich kleiner unten rechts, aber im sicheren
  Bereich, angezeigt werden." Umgesetzt: 28 px, unten rechts bis x 950, y 1440.
- Untertitel-Hervorhebung bleibt, Titel kürzer (2026-10-12): erst "die Untertitel nur einblenden, nicht highlighted",
  dann zurück: "Die Untertitel können ruhig farbig gehighlited werden. Den Titel kannst du aber kürzer einblenden".
  Umgesetzt: jede Szene mit `titelDauer={TITEL}` (`const TITEL = 75`, 2,5 s), danach blendet der Titel aus, die
  Begriffe bleiben stehen. Das gesprochene Wort bleibt in der Leuchtfarbe.
- Weniger Leuchtfarbe oben (2026-10-12): "Bitte die Akzentfarbe nicht so häufig im oberen Bereich verwenden. lieber
  häufiger weiß als Hintergrund der Karten nehmen und die Highlight Farbe nur bei ganz wichtigen Dingen sowie dem Titel
  verwenden". Umgesetzt im Design nacht: Chips und `Tag kind="ok"` weiß mit dunkler Schrift; die Leuchtfarbe hat nur
  der Titel und höchstens ein Begriff pro Szene mit `Tag kind="wichtig"` (der Kernpunkt).
