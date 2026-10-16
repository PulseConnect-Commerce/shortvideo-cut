---
name: stil-face
description: Schnittstil FACE von PulseConnect für Meinungsvideos direkt in die Kamera (kurz, ~45-60 s, klare Haltung, Frage an die Community) - Bild ab der Hüfte, ruhig geschnitten (wenig Schnitte und Zooms), Design nacht in Neon (Hot Take), kleine ruhige Untertitel (64 px, kein Kasten), Titel und Begriffe oben über dem Kopf (ohne Karte und Foto), leichter Porträt-Modus, am Ende Kommentar-Blase und Folgen-Knopf mit Plus. Verwende diesen Skill zusammen mit faber-cut, sobald ein FACE-Video geschnitten oder überarbeitet wird (der Nutzer sagt "FACE", "Meinungsvideo", "Hot Take") oder Feedback zu einem FACE-Video gibt.
---

# Stil FACE

> **Look ab 2026-10-16: Editorial (geht allem Folgenden vor).** Gilt für NEWS/Reaction, FACE und HERO, **nicht** für
> die Serie "E-Commerce einfach erklärt". Entstanden in zwei Schritten: erst der Test "schlichte Untertitel und keine
> B-Rolls … sehr natürlich … mit wenigen Schnitten. Zu viel bearbeitet kommt heutzutage nicht mehr so gut an", dann
> sein Referenzvideo: "Können wir unseren Videoschnitt (gerade die Untertitel und den Schnittstil mit den
> Soundeffekten) auf diesen Stil … anpassen? … Unsere Farben können hier natürlich nach wie vor als Highlight verwendet
> werden, gerade für Titel." Vorlagen: `src/projekte/zoll/Video.tsx` (freigegeben 2026-10-16),
> `src/projekte/easyshop/Video.tsx`.
> - **Untertitel:** `EditorialUntertitel` aus `src/lib/editorial.tsx`, oben über dem Kopf (y ~330), 1-3 Wörter auf
>   einmal, Anton in Großbuchstaben, eher klein; betonte Wörter (Zahlen, Schlüsselbegriffe, etwa eins pro Satz) groß in
>   Playfair Display Black Italic, Zahlen und Kernaussage in unserem Grün `#00F090`. Während der Hook aus (`off`).
> - **Hook:** im alten Titel-Stil, `HookTitle` in `DesignRahmen design="nacht-gruen"`, zweizeilig über dem Kopf. Zu
>   den Editorial-Hook-Varianten sagte er "Die Hook finde ich nicht besonders gut im Titel" und dann "Nein, beide nicht
>   so gut, dann bitte für die Hook den alten Titel Stil verwenden". Während der Hook liegt das Bild 130 px tiefer;
>   der Wechsel fällt auf den ersten Schnitt.
> - **Bild:** leichter Porträt-Modus, Hintergrund leicht unscharf (`npm run portrait`; "Der Hintergrund sollte
>   dennoch wieder leicht verschwommen sein wie vorher"). Bei jedem Schnitt abwechselnd weit und eng
>   (`autoPunch(C, { low: 1, high: 1.08 })`), sonst keine Zooms.
> - **Wenige Schnitte:** nur Versprecher, Anläufe und weggelassene Sätze raus (Regel "ganze Sätze ohne Schnitt" im
>   Skill faber-cut, `min_gap` ≥ 1,0).
> - **Einblendungen sparsam, nur was er sagt:** Quelle oder Schlagzeile als Screenshot-Ausschnitt ("Auch bitte ein
>   paar Quellen im Video mit einblenden (also als Screenshot Ausschnitte)"; NEWS immer mit Quelle), Fakten als
>   schlichte Zeilen in Anton (`SchlichterText`). Keine Chips, Stempel, Fotos, Skizzen, Kommentar-Blase oder
>   Folgen-Knopf.
> - **Ton:** leise Klicks (`klick.mp3`, Lautstärke `STIL.sfx * 0.3`) nur auf Einblendungen; keine Musik, keine
>   Whooshes.

**Wofür:** Meinungsvideos direkt in die Kamera: ein Thema, eine klare Haltung, am Ende eine Frage an die Community
(Kommentare) und der Aufruf zu folgen. Festgelegt am 2026-10-09 per Format-Onboarding (Skill `format-onboarding`,
ausgehend von HERO) am Video "KI-Agenten im Onlineshop – sinnvoll oder völliger Hype?" (`src/projekte/kiagenten/`,
die Vorlage für jedes neue FACE-Video).

Der Ablauf (Clips laden, transkribieren, Schnitt, Vorschau, Vollversion, Übergabe) kommt aus dem Skill **faber-cut**;
hier steht, wie ein FACE-Video aussieht. Alles, was hier "wie HERO" heißt, steht mit seinen Werten in `stil-hero`
und in `src/lib/stil.ts` (die HERO-Zahlen, unverändert). Neue Geschmacksregeln aus seinem Feedback zu einem
FACE-Video kommen hierher unter "Notizen", mit seinem Satz und Datum.

**Design: immer `nacht`** (Neon `#CCFF00`, FACE ist der Hot Take; festgelegt 2026-10-11: "Für News Videos immer Logo-Hellgrün. Für Hot
Takes die Neon Farbe und für Hero Videos Mint-Hellblau verwenden."). Schrift, Farben, Hook-Look, Untertitel-Look und
Chips kommen aus dem Design (`src/lib/design.tsx`, Übersicht in `.claude/skills/faber-cut/stil.md`); was hier unten
zu Farben steht (Blau, Rot, Weiß), gilt nur noch für die alten pulse-Videos. Alles andere aus diesem Skill (Bild,
Schnitt, Aufbau, Aufruf) bleibt.

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
  y ~510). Der Kopf beginnt direkt darunter, so hoch wie es geht: Bildlage "OBEN" mit
  `<Takes transform="translateY(-348px) scale(1.2)" transformOrigin="50% 0%" />` (bei seinem Bürostuhl-Setup liegt der
  Haaransatz dann bei y ~550-580, das Kinn bei ~1000-1100; mit Standbildern nachmessen, zwischen Begriffen und Haar
  mindestens 30 px). Untertitel bei y 1260 (klein, siehe Untertitel), unten **nie schwarz** (seine Vorgabe 2026-10-12, alle
  Formate: "Unsere Shortvideos sind alle unten komplett schwarz"): keine `Bodenblende`; der Ausschnitt füllt das Bild
  bis unten (`(1920 + hoch) / scale ≤ 1920`, höchstens 1,2-fach vergrößern, sonst wird es unscharf), nur ein leichter Verlauf 1640-1920 px bis 55 %
  Schwarz für die App-Texte (Vorlage `src/projekte/temu/Video.tsx`).
  Pro Szene also nur Titel plus eine Zeile Begriffe: ein weiterer Begriff ersetzt den vorherigen (`until` = nächstes
  Wort - 4 Frames) oder steht daneben (`tagBreite`). Keine Pille unter dem Hook, keine Antwort-Chips (Ja/Nein) am
  Ende, nur die Kommentar-Blase. Akzent-Anker 50 % 42 %.
  **Ausnahme:** Solange etwas gelesen werden muss, das hinter oder über ihm steht (Zeitungsartikel, Screenshot der
  Quelle), liegt er tiefer, Lage "MITTE" (`translateY(-160px) scale(1.2)`), und wechselt danach zurück
  (`ausgabeFrames(C, von, bis)` aus `bausteine.tsx` gibt die Frames der Greenscreen-Stellen). Vorlage:
  `src/projekte/shopifycanvas/Video.tsx`.

## Hook (erstes Bild bis zum zweiten Satz)

- Die Texteinblendung, die er mitgibt (z. B. "KI-AGENTEN: / GENIAL ODER BULLSHIT?"), in zwei Zeilen oben, ab dem
  ersten Frame. **Stil pro Video aus `HOOK_STILE`** (`src/lib/bausteine.tsx`); vor der Vorschau 3-4 Stile als
  Standbild aus seinem Clip zeigen, er wählt. Bei kiagenten: `balken` (weißer Balken, Kernzeile roter Balken).
- Nie in der Farbe der Untertitel (Blau). Höchstens 880 px breit, zentriert (wie HERO).
- **Der erste Szenen-Titel nach dem Hook gehört noch zum Hook:** groß (im Design nacht 92 px, `D.titelGroesse`)
  und knackig. Das gilt für jeden Szenen-Titel: 2-4 Wörter, eine Behauptung, Frage oder Ansage mit Haltung, gern mit
  "?!", einer Zahl oder "du/dein" ("KI-Agenten überall?!", "Stopp: erst die Basics!", "Hype oder Hebel?"), nie ein
  neutrales Etikett wie "Überall KI-Agenten" (siehe Notizen).

## Untertitel

- **Klein und ruhig, nie wie ein Titel** (seine Vorgabe 2026-10-11, alle Formate): `const UT = { top: 1260, size: 64 }` (höher seit 2026-10-11, damit der Beschreibungstext der App sie nicht verdeckt; Quellen-Pille und Hinweise darunter bei y 1350),
  `<Captions C={C} fr={fr} top={UT.top} size={UT.size} />`. Im Design nacht: Space Grotesk fett, normale Groß- und
  Kleinschreibung, weiß mit dünner dunkler Kontur, **kein Kasten**, nur das gesprochene Wort in der Leuchtfarbe. Nie
  in derselben Schrift (Anton) oder Größe wie die Titel.
- (pulse, alte Videos: das gesprochene Wort in Blau `#31ADEC`, 100 px.)
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
- **Ab und zu ein Extra-Effekt** wie bei HERO (`klick`, `kamera`, `riser`, `glitzer`, `wusch-gross` in `public/sfx/`):
  pro Video höchstens einer bis zwei, nur wo das Bild sie trägt, von Video zu Video abwechseln. Für FACE passen vor
  allem `riser.mp3` vor der klaren Haltung (`at` = Wort − 48 Frames) und `klick.mp3` beim Folgen-Knopf statt Pop.

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
- Titel größer und knackiger (2026-10-10, nach dem ersten FACE-Video): "Die Hook mit "Überall KI Agenten" ist viel
  zu klein geschrieben und nicht Catchy genug. Für dieses Video ist es nun egal, da es bereits abgedreht und
  veröffentlicht wurde. Aber für die nächsten sollte es größer und mehr catchy sein."
- Gesicht höher (2026-10-10, gilt für alle Formate): "Auch gefällt mir die Höhe meines Gesichts nicht. Dieses sollte
  noch um einiges höher liegen, sodass es nicht zur Hälfte von den Untertitel verdeckt wird". Aus den Standbildern
  gewählt: "A: etwas höher" (+160 px) und "Für alle Formate".
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
