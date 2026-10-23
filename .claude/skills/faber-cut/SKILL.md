---
name: faber-cut
description: Schneidet Talking-Head-Rohclips (Handy, hochkant) wie ein Senior-Editor zu einem fertigen 1080x1920-Reel für Instagram und TikTok, mit Remotion. Lokal transkribieren und Wortzeiten auf den Frame ausrichten, nach Text schneiden (Füllwörter, Versprecher und Pausen raus, keine Mini-Jump-Cuts), Untertitel Wort für Wort, Motion Graphics genau auf dem gesprochenen Wort, Splitscreen, J-Cuts, Soundeffekte unter der Stimme, -14 LUFS, Vorschau-Runden mit dem Nutzer und gemessene Prüfungen. Verwende diesen Skill, wenn der Nutzer Rohclips ablegt oder schickt, "schneide mir dieses Video" sagt, ein Video überarbeiten will oder Feedback zu einem Schnitt gibt.
---

# faber-cut: Rohclips zu einem fertigen Reel

Du schneidest die Videos des Nutzers so, wie er sie haben will. Sein Geschmack steht **pro Videoformat in einem eigenen Skill** (HERO: `stil-hero`, FACE: `stil-face`, NEWS/Reaction: `stil-news`); die Übersicht und wie du das Format klärst, steht in **`stil.md`** (in diesem Ordner): lies sie und den Skill des Formats vor jedem Schnitt. Sagt der Nutzer, dass er etwas anders haben will ("Untertitel größer", "der CTA ans Ende", "weniger Zooms"), setz es um **und trag es als Regel in den Skill des Formats ein** (mit seinem Satz in Anführungszeichen und dem Datum). So wird der Skill mit jedem Video mehr sein eigener.

Sprich mit dem Nutzer in seiner Sprache. Die Untertitel und Texte im Video folgen der Sprache des Videos.

**Pipeline (seit 2026-10-18 der Standard für neue Videos):** die Hauptsitzung führt Regie, ein Cutter-Agent (Haiku,
bei schwierigen Videos Sonnet) arbeitet den Ablauf unten ab und liefert Video plus Übergabekarte, ein Prüfer-Agent
(Opus) urteilt FREIGEGEBEN oder ZURÜCK, höchstens eine Korrekturrunde, nach Pauls OK plant ein Planer-Agent (Haiku) ein.
Rollen, Übergabekarte (`npm run uebergabe`), Prüfliste (`npm run pruefen`) und Planer-Schritte: **`pipeline.md`** in
diesem Ordner, die Agenten in `.claude/agents/`. Was dort anders geregelt ist (keine Fragen des Cutters an Paul, keine
Vorschau-Runde vor der Prüfung, Captions in der Karte statt in `beschreibung.md`), gilt in der Pipeline vor diesem
Ablauf.

Liegt neben dieser Datei eine **`intern.md`**, lies sie auch: Sie ergänzt den Ablauf für eine bestimmte Werkstatt (Ordner, woher die Clips kommen, Veröffentlichen, eigene Regeln) und gilt bei einem Widerspruch vor dieser Datei.

## Was wo liegt

| Was | Wo |
| --- | --- |
| Rohclips, die er ablegt | `eingang/` (oder ein Pfad, den er nennt) |
| Vorbereitete Takes, Transkripte | `public/projekte/<projekt>/takes/<take>.mp4`, `…/edit/transcripts/<take>.json` und `.aligned.json` (bleiben lokal, git-ignoriert) |
| Schnitt (Sätze als Text) | `src/projekte/<projekt>/schnitt.json` |
| Ergebnis des Schnitts | `src/projekte/<projekt>/cut.json` (von `tools/schnitt.py`) |
| Grafiken und Video | `src/projekte/<projekt>/Video.tsx` (Kopie von `src/projekte/_vorlage/`) |
| Stil in Zahlen (Farben, Schrift, Maße) | `src/lib/stil.ts` |
| Fertige Grafik-Bausteine | `src/lib/bausteine.tsx` (Takes, Untertitel, Hook, Pillen, Split) und `src/lib/kit.tsx` (Terminal, Schritte, Zähler, Follow, Screenshot, Auto-Zoom) |
| Rohschnitt / Vorschau / Vollversion | `out/vorschau/<projekt>-roh.mp4`, `out/vorschau/<Komposition>.mp4`, `out/final/` |

Alle Werkzeuge laufen über **`npm run …`**, auf Windows, macOS und Linux gleich (Python nie direkt aufrufen). Liegt faber-cut als Ordner `faber-cut/` in einem anderen Repo (z. B. seiner App), sind alle Pfade hier relativ zu diesem Ordner: arbeite dort. Die Einstellungen aus dem Onboarding stehen in **`faber-cut.json`** (lokal oder online, Sprache, Gemini, Drive-Ordner): lies sie zuerst. Fehlt die Datei, führe zuerst den Skill **skill-onboarding** aus. Meldet ein Werkzeug, dass `.venv` oder `node_modules` fehlt: `npm run setup`, dann `npm run doktor`.

## Ablauf (jeder Schritt, jedes Mal)

### 1. Clips vorbereiten

- Projektname kurz und ohne Leerzeichen (`tag6`, `api-keys`), Takes `t1`, `t2`, … in der Reihenfolge, in der er sie gedreht hat.
- **Online-Modus** (`"modus": "online"` in `faber-cut.json`): er lädt seine Clips in seinen Google-Drive-Ordner (`drive.id`) und sagt Bescheid. `npm run drive -- liste` zeigt die Dateien im Ordner mit Datum (die neuesten sind seine neuen Clips): sag ihm, welche du nimmst. Dann jede Datei nacheinander in voller Größe laden: `npm run drive -- laden <dateiname> eingang/<projekt>` (es prüft auch, dass wirklich ein Video ankam; sonst ist der Ordner nicht "Jeder mit dem Link" freigegeben: sag ihm, wie er das ändert, siehe skill-onboarding). Eine Drive-Verbindung (Connector) brauchst du dafür nicht.
- Pro Take, nacheinander (nie parallel): `npm run intake -- <rohclip> <projekt> <take> [--sprache de|en] [--namen "…"]`. Das entrauscht die Stimme, kopiert das Bild (4K wird zu einer 1080er-Arbeitskopie), transkribiert lokal und richtet die Wortzeiten aus.
- Kommen Produkt- und Eigennamen vor, die Whisper verhört (Claude, Remotion, sein Name, sein Firmenname), gib sie mit `--namen "…"` mit oder transkribiere neu: `npm run transkribieren -- public/projekte/<projekt>/takes/<take>.mp4 <projekt> <take> --namen "…"`, danach `npm run ausrichten -- <projekt> <take>`.
- Prüfe, dass das letzte Wort des Transkripts kurz vor dem Ende des Tons liegt: Whisper verschluckt manchmal den letzten Satz.
- Danach die Farben: `npm run farbe -- <projekt>` (Regel 5b), vor dem Porträt-Modus.

### 2. Verstehen, bevor du schneidest

1. Lies das ganze Transkript wie eine Nachricht von ihm. Schreib dir die **Kernaussage in einem Satz** auf und in welcher Reihenfolge er seine Punkte macht.
2. **Regieanweisungen finden:** Sätze, die an dich gehen und nicht an die Zuschauer ("Claude, mach hier …", "füg hier oben rechts … ein", "Zoom hier rein", "schneid das raus", "nimm Take 2"). Liste jede mit Zeit und Bitte auf. Sie kommen nie ins Video, aber was sie verlangen, setzt du auf den Satz, auf den sie zeigen.
3. Markiere jedes Wort, bei dem du unsicher bist (Whisper hört keinen Ton und verhört Namen). Rate nicht, frag.
4. Mehrere Takes desselben Satzes: nimm pro Satz den freien, flüssigen (Blick in die Linse, kein Neustart). Im Zweifel fragen.

### 3. Drei Varianten, er wählt

Schreib drei Fassungen als **reinen Text** (die Wörter, die übrig bleiben, in Reihenfolge, mit geschätzter Länge):

- **A, komplett:** alles, was er gesagt hat, in seiner Reihenfolge; nur Füllwörter, Versprecher und Pausen raus.
- **B, gestrafft:** dieselben Punkte, die schwächste Wiederholung weg, höchstens ein ganzer Satz umgestellt (z. B. der Aufruf ans Ende).
- **C, knackig:** der stärkste Hook zuerst, ein klarer Bogen, nur ganze Sätze.

Für alle drei gilt: Schnitte zwischen ganzen Sätzen, nicht mitten drin; jedes "das/es/so/aber" braucht seinen Bezug im Schnitt; Kontext schlägt Tempo (der Grund hinter einer Entscheidung und jeder Teil des Aufrufs bleiben). Stell die drei mit dem Werkzeug **AskUserQuestion** zur Wahl (Option = "A, komplett (38 s)", Beschreibung = eine Zeile, was fehlt, Vorschau = der volle Text), deine Empfehlung zuerst mit "(Empfohlen)". Frag im selben Zug alles Unklare (unsichere Wörter, Regieanweisungen, Tag-Nummer der Serie). Ist er nicht erreichbar: Variante A schneiden und das sagen.

### 4. Schnitt bauen

Schreib `src/projekte/<projekt>/schnitt.json` (Format: siehe Kopf von `tools/schnitt.py`, Beispiel in `src/projekte/_vorlage/schnitt.json`):

- **Ein Eintrag pro Satz**, in der Reihenfolge des Videos. `text` ist der gewählte Text. Was du weglassen willst (Füllwort, Versprecher, "Dann,", "Das heißt,", ein Nebensatz), lässt du einfach im Text weg. `ab` ist die Sekunde kurz vor dem ersten Wort des Satzes im Take.
- **Umstellen:** Satz in der Liste verschieben (z. B. den Follow-Aufruf ans Ende).
- **`start.ab`:** beginnt das Video mit einer Bewegung (er stellt das Handy hin), dann ab dem Moment, ab dem man sie versteht, nicht Sekunden davor.
- **`ende.bis`:** kurz nach dem letzten Wort, bevor sein nächster Laut kommt (wie lange, sagt der Stil des Formats; keine Frames ohne Bild anhängen).
- **`"ganz": true`** an einem Satz: keine Pausen herausschneiden. Für jeden Gedanken, den ein Schnitt zerreißen würde, vor allem den Aufruf am Ende samt Begründung: ein Pausen- oder Äh-Schnitt mitten darin klingt wie zwei Sätze. Ein "äh" darin wird mit **`"stumm": [[von, bis]]`** (Quell-Sekunden) leise statt geschnitten, das Bild läuft weiter. Einen Wortdoppler (Stotterer) nie so, man sieht die Lippen: dort den Satz teilen und mit `"bis"`/`"von"` am Pegel schneiden.
- **Ganze Sätze ohne Schnitt** (seine Vorgabe 2026-10-15: "Wenn möglich sollten alle vollständigen Sätze, welche ohne
  Stotterer oder Versprecher gesprochen wurden, auch vollständig so in einem Stück wiedergegeben werden, ohne einen
  Schnitt zu setzen" und "Auch dürfen ruhig kurze Pausen gelassen werden, solange dadurch der Satz nicht unterbrochen
  wird"): `pausen.min_gap` mindestens **1,0** (`pre 0.06`, `post 0.1`), bei längeren Denkpausen im Satz höher (CAC: 2,0).
  Aufeinanderfolgende saubere Sätze, zwischen denen nur Stille liegt (Pegel prüfen, z. B. `ffmpeg -ss <a> -to <b>
  -af volumedetect`, max unter ~-40 dB), stehen in **einem** Eintrag, sonst setzt das Werkzeug zwischen ihnen einen
  Schnitt. Geteilt wird nur dort, wo wirklich etwas raus muss (Versprecher, Anlauf, weggelassener Satz). Vorher
  easyJet 25 Schnitte, danach 6.
- **`ende.halt`:** ein stilles Stück aus dem Take als Halt nach dem letzten Wort, nur wenn nach dem letzten Wort noch etwas gesagt wird, das nicht ins Video gehört. Nie einen Satz weglassen, der den Aufruf begründet.
- **`korrekturen`:** Verhörer in den Untertiteln (`[take, sekunde, "falsch", "richtig"]`), `""` nimmt ein Wort raus, das nicht im Ton ist.

Dann `npm run schnitt -- src/projekte/<projekt>/schnitt.json`. Es muss **ohne "PRÜFEN"** durchlaufen: Untertitel = gewählter Text Wort für Wort, Reihenfolge stimmt, keine Mini-Schnitte. Danach `npm run fillerscan -- src/projekte/<projekt>/cut.json`: Stimme ohne Wort ist meist ein "äh", das Whisper nicht aufgeschrieben hat. Hör dir die Stelle über den Pegel an und schneide sie (Satz in zwei Einträge teilen).

**Rohschnitt vor den Grafiken:** `npm run rohschnitt -- src/projekte/<projekt>/cut.json` setzt den Schnitt in Sekunden mit ffmpeg zusammen (halbe Größe, Untertitel mit dem gelben Wort eingebrannt, oben links die Sekunde, ohne Grafiken) nach `out/vorschau/<projekt>-roh.mp4`. Schick ihm den Rohschnitt und lass ihn den Schnitt freigeben (Reihenfolge, Länge, was raus ist), bevor du Grafiken baust: eine Schnitt-Notiz kostet dann einen neuen Rohschnitt in Sekunden statt einer neuen Vorschau in Minuten. Seine Notizen nennen die Sekunde oben links. Ist er nicht erreichbar, bau weiter und sag es im Bericht.

**Porträt-Modus** (wenn der Stil des Formats ihn verlangt): nach dem freigegebenen Schnitt `npm run portrait -- <projekt>`. Es stellt die Person in jedem Take frei (Robust Video Matting, CPU, ~6 Bilder/s) und zeichnet nur den Hintergrund weich, aber nur an den Stellen, die `cut.json` nutzt; das Original bleibt als `<take>.orig.mp4`. Ändert sich der Schnitt danach, noch einmal laufen lassen. **Immer nur ein `portrait` gleichzeitig** und nicht neben einem Render: es nutzt alle Kerne, zwei parallel brechen auf ~0,3 Bilder/s ein (2026-10-14: zwei Stunden statt zehn Minuten pro Video). Bei mehreren Videos erst alle Porträts nacheinander, dann höchstens zwei Renders parallel. Vor der nächsten Vorschau `out/vorschau/<Komposition>/` löschen, damit keine Stücke mit dem alten Bild bleiben.

### 5. Grafiken

Kopiere `src/projekte/_vorlage/Video.tsx` nach `src/projekte/<projekt>/Video.tsx`, setz `meta.id` (z. B. `"Tag6"`), dann bau die Grafiken. Die Komposition meldet sich von selbst an (`npm run kompositionen`). Die Bildrate kommt aus der `cut.json` (`meta.fps: C.FPS`); Takes in 25 oder 60 fps: `npm run intake -- … --fps 25`, dann `"fps": 25` in die `schnitt.json`.

**Erst die fertigen Bausteine** (`src/lib/kit.tsx`, Beispiele im Kopf der Datei), dann eigene Grafiken für das, was nur dieses Video braucht:
- `Terminal`: Befehle werden getippt (mit Cursor, auch Wort für Wort mit der Stimme über `parts: C.spoken(…)`), Ausgaben (`kind: "out"`, `"ok"`) erscheinen auf ihrem Wort.
- `StepList` (nummerierte Schritte untereinander, der gesprochene gelb, erledigte mit Haken) und `StepRail` (Schiene oben, die sich füllt; für einen Ablauf, der länger mitläuft).
- `CountUp`: eine Zahl zählt hoch und landet auf dem Wort, das sie sagt (`b = C.cue("250")`), mit kurzem Aufblitzen.
- `Follow`: die Follow-Karte für den Aufruf, der Knopf wird auf seinem Wort angetippt (`tapAt`).
- `Shot`: Screenshot oder Bildschirmaufnahme aus `public/` in einer Karte oder einem Handy-Rahmen, fährt auf seinen Wörtern an Ausschnitte heran (`zoom`).
- `autoPunch(C, { base, skip })`: Punch-in-Stufen für `punchAt`, auf jedem sichtbaren Schnitt abwechselnd 1 und 1,07 (ein Jump-Cut wirkt wie ein Kamerawechsel); `skip` = Splitscreen-Bereiche.
Ihre Farben und Maße kommen aus `stil.ts`; wirkt ein Baustein nicht wie sein Stil, ändere `stil.ts` oder den Baustein, nicht jedes Video einzeln.

**Design (der Look) pro Video:** neben dem Format hat jedes Video ein Design aus `src/lib/design.tsx` (`pulse` und die drei Varianten `nacht`, `nacht-gruen`, `nacht-mint`; welches dran ist, steht in `stil.md` unter "Designs"). Wickle den Inhalt der `Video.tsx` in `<DesignRahmen design="…">`, setz `<Toenung />` direkt über das Bild der Person (unter die Grafiken) und nimm für eigene Grafiken die Farben und Schriften aus `useDesign()` (`D.chip`, `D.tags`, `schriftCss(D.titel)`), nicht feste Farben. Vorlage: `src/projekte/kiagenten/Video.tsx` (Prop `design`). Untertitel, Hook, `Szene`, `Row`, `Tag` und `Mark` folgen dem Design von selbst; die Bausteine aus `kit.tsx` (Terminal, Schritte, Zähler, Follow, Shot) noch nicht: brauchst du einen davon in einem anderen Design als pulse, gib ihm die Farben und Schriften aus `useDesign()` und prüf mit einem Standbild aus einem pulse-Projekt, dass dort alles gleich bleibt.

**Timing (das wichtigste):**
- Jede Grafik landet mit `C.cue("wort")` auf ihrem Wort, also **2 Frames vor dem ersten Laut** (Wortzeiten sind auf den Frame ausgerichtet). Nie geschätzte Frames, nie "+10", nie "alle 22 Frames": Zähler, Schritte, Runden wechseln auf dem Wort, das sie sagt. Das nächste gleiche Wort: `C.cue("schritt", C.W("github"))`. `cue` trifft das Wort oder ein Wort, das so anfängt ("schritt" → "Schritte"), nicht ein Stück mitten im Wort ("app" nicht in "klappt"). Zahlen ("250") sind ausgerichtet wie Wörter, die Beweis-Zahl im Hook sitzt also auf dem Frame.
- Jedes Element bekommt auch ein **Ende** auf einem Wort oder am nächsten Element.
- Getippter Text (Chat, Terminal, Prompt) läuft **Wort für Wort mit seiner Stimme**: `typedSync(C.spoken("der Text", C.W("schreib")), fr)`.
- Einblendungen, die "auf dem Wort" wirken sollen, sind kurz: Pop-in (`popS`) oder Fade ≤ 3 Frames. Ein 6-Frame-Fade wirkt zu spät.

**Inhalt:**
- **Was er nennt, sieht man auf dem Wort:** ein Tool, eine App, eine Zahl, ein Ergebnis. Fehlt das Material (Bildschirmaufnahme, Screenshot), frag ihn danach und sag es im Bericht.
- **Alle 1,5-2 s ändert sich etwas** im Bild, das die Zeile trägt (eine Pille, ein Häkchen, ein Zoom, eine Karte), nie Deko.
- **Zeigen statt aufzählen:** nennt er, was etwas tut, zeig genau das (vorher/nachher), keine Checkliste.
- Eine große Grafik, die seine Worte zeigt, ersetzt für diese Worte die Untertitel (`<Captions off={[[von, bis]]} />`).
- Für Tool-Erklärungen: **Splitscreen** (Grafiken oben, er unten; `splitAt`, `Stage`, `SplitPerson`), für seine Meinung und den Aufruf zurück ins Vollbild.

**Platz:**
- **Sichere Fläche x 60-950, y 250-1500.** Außerhalb liegen die Knöpfe und Texte von TikTok und Instagram (Leiste oben, Knöpfe rechts, Name und Beschreibung unten); die Maße stehen in `src/lib/zonen.json`. Dort kommt nie etwas hin, was etwas bedeutet. Untertitel im Vollbild bei y 1340, im Split auf der Naht (y 872).
- **Vor dem Platzieren das Raster:** `npm run raster -- public/projekte/<projekt>/takes/t1.mp4 out/raster.jpg 2,10,20`. Es zeichnet ein 60-px-Raster mit Pixelwerten, die sichere Fläche (grün), das Untertitel-Band (gelb), die Zonen von TikTok (türkis) und Instagram (pink) und seinen Kopf (rot), und nennt pro Zeitpunkt die freien Felder A-F. Platziere nach diesen Zahlen, nicht nach Gefühl, und nichts auf das Gesicht.
- Text in Grafiken mindestens 42 px, Listen 46 px, Zeilenhöhe 1,3. Darunter ist es auf dem Handy nicht lesbar.
- Ob eine Zeile in die Breite passt, misst `textWidth`/`fitSize` aus `src/lib/messen.ts` (echte Breiten von Geist und den Schriften der Designs, nicht geschätzt; die Schrift als letztes Argument); Untertitel und Hook-Titel werden damit selbst kleiner statt umzubrechen.

### 6. Vorschau und eigene Prüfung

1. `npm run vorschau -- <Komposition>` (halbe Größe, 10-s-Stücke mit Cache). Nach Änderungen an Ort und Stelle `--changed a-b` (Frames), nach Änderungen am Schnitt `--from N`. Ändert sich das Projekt ohne eine der beiden Angaben, rendert sie alles neu (nie eine alte Vorschau).
2. **Sync messen:** `npm run sync -- out/vorschau/<id>.mp4 src/projekte/<projekt>/cut.json wort[:s|c] …` mit jedem Stichwort einer Grafik (`s` = Bühne oben im Split, `c` = Brustzone im Vollbild). Ziel -4..+1 Frames. Eine CHECK-Zeile ist oft eine andere Bewegung im Bereich: den 8-Frame-Streifen um das Wort ansehen, bevor du etwas änderst.
3. **Pacing messen:** `npm run pacing -- out/vorschau/<id>.mp4 src/projekte/<projekt>/cut.json`. Jede Strecke über 2 s ohne Bildänderung bekommt eine Grafik, die die Zeile trägt. Stille am Ton nachmessen (Wortenden liegen eher früh).
4. **Standbilder** an jeder Grafik (Anfang und Ende, `npm run still -- <id> out/x.jpg --frame=N --scale=0.4`): nichts überlappt, nichts bleibt zu lange stehen, Text bricht nicht ungewollt um, das Ende zeigt ihn noch im Bild.
5. **Raster auf dem Ergebnis:** dieselben Standbilder mit `--props='{"raster":true}'` (die Vorlage blendet dann das Raster mit allen Zonen ein) oder `npm run raster -- out/vorschau/<id>.mp4 out/raster-vorschau.jpg <Sekunden jeder Grafik>`. Jede Grafik liegt ganz in der grünen Fläche, nichts in einer türkisen oder pinken Zone, nichts auf dem Kopf. Liegt etwas falsch: verschieben, nicht kleiner machen.
6. **Gemini** (nur wenn `"gemini": true` in `faber-cut.json`; der Schlüssel steht in `.env` oder in der Umgebung): `npm run gemini -- out/vorschau/<id>.mp4 prompts/review.md`, **zweimal**. Gemini irrt oft (erfundene Tippfehler, "Text zu tief", "keine Soundeffekte"): prüfe jede Behauptung an Standbild, Ton oder Code. Übernimm nur, was stimmt.

### 7. Runde mit dem Nutzer

Schick ihm die Vorschau mit: was du gemacht hast, die Gemini-Noten, welche Punkte du übernommen oder verworfen hast und warum. Dann wartest du auf seine Notizen. **Keine Vollversion vor seinem OK.** Jede Notiz: umsetzen, neue Vorschau, wieder schicken. Ist eine Notiz eine Geschmacksregel, trag sie in den Skill des Formats ein (`stil-hero`, `stil-face`, `stil-news`).

### 8. Vollversion

Erst wenn er "passt" sagt:
1. `npm run final -- <Komposition>`: voller Render, -14 LUFS, Post-Version (≤ 47 MB) und Chat-Kopie (< 29 MB).
2. `npm run checks -- out/final/<id>.mp4 --stems <id>`: keine Ausreißer-Frames, Lautheit, keine Tonlöcher (digitale Stille mitten im Video hört man als Sprung), jeder Effekt ≥ 6 dB unter der Stimme. Erst bei OK übergeben.
2b. **Zweite Kontrolle aller gesprochenen Sätze** (seine Vorgabe 2026-10-15, nach "Amazon will…" und "Und außerdem
   sollen…" doppelt im easyJet-Video, die `doppelt` und `fillerscan` nicht gefunden hatten): `npm run kontrolle --
   out/final/<id>.mp4 <projekt>` hört das fertige Video in 8-s-Abschnitten neu ab und meldet DOPPELT, ZUSÄTZLICH,
   FEHLT, UNGEHÖRT und GEDEHNT mit der Zeit im Video. **Vor jedem Upload, ohne Ausnahme.** Jede Meldung im Take
   nachsehen (Pegel, `silencedetect`), den sauberen letzten Anlauf nehmen (Wortzeiten im `t1.aligned.json` auf den
   Anlauf schieben, `ab` dahinter), neu schneiden, neu rendern, wieder kontrollieren. Einzelne Hörfehler von Whisper
   ("Naja" statt "Ja") darf man stehen lassen.
3. Cover: ein Frame mit Titel und Gesicht (`ffmpeg -ss 1.4 -i out/final/<id>.mp4 -frames:v 1 out/final/<id>-cover.jpg`).
4. **Übergeben:** lokal nennst du ihm den Ordner `out/final/` (`<id>-post.mp4` zum Hochladen auf Instagram/TikTok). Online kann er nicht in deinen Rechner schauen: schick ihm `out/final/<id>-chat.mp4` (unter 29 MB) als Datei in den Chat, falls du ein Werkzeug zum Senden von Dateien hast, und leg das Video **in bester Qualität** (das Master, so will er es) in seinen Drive-Ordner: `npm run hochladen -- out/final/<id>.mp4 "<Titel>"` (landet in **"Final geschnittene Videos"**, Datei heißt wie der Titel; braucht den Upload-Helfer `tools/drive-upload.gs` und `DRIVE_UPLOAD_URL`). **Pro Video ein eigener Unterordner** (so will er es): mit dem Google-Drive-Connector in "Final geschnittene Videos" einen Ordner "<Titel>" anlegen, das hochgeladene Video hineinschieben (`update_file` mit `parentId`) und dort die Beschreibungen als Google Doc "<Titel> – Beschreibungen" anlegen (Text aus `beschreibung.md`). **Dateiname eindeutig wie im Titel seines Google-Kalender-Termins** (seine Vorgabe 2026-10-14: "Bitte die Dateien immer eindeutig benennen, wie es auch im Titel des Google Kalendar Termins steht"): bei Serien Folge und Thema, z. B. `E01_Conversion-Rate.mp4`, `E02_AOV.mp4`; Ordner und Doc tragen denselben Titel. **Keine Fassung ohne Untertitel, außer er sagt es ausdrücklich** (seine Vorgabe 2026-10-15: "Bitte die neuen Videos nicht extra ohne Untertitel hochladen. Nur wenn ich es extra anweise"): weder rendern noch hochladen; wenn er sie will, heißt sie `<Titel>_ohne-Untertitel.mp4`. Nur wenn es keinen Termin gibt, nimmst du den YouTube-Titel aus den Beschreibungen (ohne Doppelpunkt: "Fake-Shop erkennen – 5 Checks vor dem Online-Kauf"). **Nach seinem finalen Go läuft das ohne weitere Rückfrage durch** (so will er es): Vollversion, Prüfungen, Hochladen ins Drive (Master), Beschreibungen, und wenn Metricool in der Sitzung verbunden ist, das Video gleich mit Beschreibung und Hashtags in Metricool einplanen (Video-Link aus dem Drive). Vor dem ersten Live-Gang zeigst du ihm den Kalender. **Rhythmus in Metricool** (seine Vorgabe 2026-10-23, ersetzt 10/15/19 vom 09.10.): drei feste Hauptzeiten, Europe/Berlin, auf TikTok, Instagram und YouTube: **09:00 News** (Shopify, KI, Amazon, E-Commerce), **14:00 Serienvideos** (E-, S- und A-Reihe), **19:00 Hero und Marken** (P- und M-Reihe, auch die B-Reihe "Marken-Story"). Steht im Kalender ein anderer Termin oder nennt er im Chat eine Zeit, gilt diese; sonst der nächste freie Platz seiner Kategorie. Als Video-Link für Metricool den direkten Drive-Download nehmen (`https://drive.usercontent.google.com/download?id=<id>&export=download&confirm=t`, der Ordner ist "Jeder mit dem Link"). Ist Metricool in der Sitzung nicht verbunden, eine neue Cloud-Sitzung mit allen Angaben starten (Links, Texte pro Plattform, Zeiten) und ihr Ergebnis prüfen. **Metricool technisch** (Marke "_donpaulo", blogId 7289054, Zeitzone Europe/Berlin): pro Netzwerk ein eigener Post mit `createScheduledPost` (eigener Text je Plattform aus `beschreibung.md`); TikTok braucht `tiktokData.title` (sonst Fehler), Instagram `instagramData.type: "REEL"`, YouTube `youtubeData` mit `title`, `type: "short"`, `madeForKids: false`, `category: "EDUCATION"`. Danach mit `getScheduledPosts` den Tag auslesen und ihm die Liste zeigen. Ist Metricool nicht als Connector da: https://claude.ai/customize/connectors, dann neue Sitzung.
   **Beschreibungen** für TikTok, Instagram und YouTube schreibst du nach `src/projekte/<projekt>/beschreibung.md` und legst sie als Google-Dokument "<Titel> – Beschreibungen" in denselben Drive-Ordner (Google-Drive-Verbindung, als reiner Text, damit Nummern beim Kopieren bleiben).
5. **Online speichern:** die Sitzung ist nach einer Weile weg. Committe `src/projekte/<projekt>/`, `public/broll/<projekt>/`, den Skill des Formats (`.claude/skills/stil-*/`) und `faber-cut.json` und pushe sie so, wie es in `faber-cut.json` unter `speichern` steht (`main` = er hat erlaubt, direkt auf seinen Hauptzweig zu pushen).

## Regeln, die immer gelten

00. **Das Cutter-Briefing im Kalender ist die Vorgabe** (seine Vorgabe 2026-10-17, nach REWE × Lieferando: "Bitte
   orientiere dich beim nächsten Video mehr an die Vorgaben"). Steht zum Video ein Briefing im Kalendertermin, wird
   es Punkt für Punkt umgesetzt: Schnittfolge und Zeiten, jede genannte Einblendung **wörtlich** (z. B. "45 MINUTEN?!",
   "5 REWE-MÄRKTE"), Thumbnail-/Cover-Text wörtlich, Untertitel-Vorgaben (z. B. max. 2 Zeilen, große kontrastreiche
   Schrift, Safe Area), gewünschte B-Rolls, Länge, Claim-Check, Quellen, Dateiabgabe (z. B. SRT, Lizenz-Liste).
   Vorher eine Checkliste aus dem Briefing schreiben und mit Rohschnitt und Vorschau zeigen (✓ umgesetzt / ✗ nicht,
   mit Grund). Was nicht geht (fehlendes Material, Rechte), **vor** dem Rohschnitt nennen und eine Lösung vorschlagen,
   statt es still wegzulassen: gewünschte B-Roll (Einkauf, Picking, Lieferfahrer …) als eigene Animation mit
   HyperFrames bauen, nie fremde Markenbilder. Widerspricht das Briefing einer Stilregel, gilt das Briefing; seine
   ausdrücklichen jüngeren Rückmeldungen (2026-10-17: weniger Schnitte und Zooms) gehen vor; im Zweifel fragen.
   REWE-Abweichungen, die nicht noch einmal passieren: Untertitel oben in Mini-Schrift statt groß unter dem Kopf,
   keine B-Roll, Hook-Text "REWE liefert in 45 Minuten?!" statt des Thumbnail-Texts "REWE in 45 Minuten?",
   Zoom-Wechsel bei jedem Schnitt.

0. **Nichts doppelt** (seine Vorgabe 2026-10-11, nach drei doppelten Stellen im Claude-Video und einer im
   Weihnachtsvideo): nach jedem `npm run schnitt` läuft `npm run doppelt -- <projekt>`. Es meldet Lücken zwischen zwei
   behaltenen Wörtern, in denen trotzdem gesprochen wird: dort hat die Transkription einen Neuansatz verschluckt
   ("Denn wenn dein Star- … Denn wenn dein Startup"). Jede Meldung nachhören (`snips`), den sauberen letzten Anlauf
   nehmen, die Wortzeiten im `t1.aligned.json` korrigieren. Auch hörbare Fehlstarts mit Pause danach ("Und wenn …
   du wissen willst") gehören raus.
0b. **Ton der Rohaufnahme prüfen** (2026-10-12, Temu: "schauen, weshalb die Tonqualität schlechter als bei den
   bisherigen Videos hochgeladen wurde"): Die Aufnahme selbst war dumpf (4-8 kHz rund 10 dB unter KI-Kunde), unser
   Schnitt hatte nichts verschlechtert. Nach jedem Intake die Höhen der Rohaufnahme mit einem Vorgänger vergleichen
   (Bänder 4-6/6-8/8-12 kHz relativ zu 0,1-4 kHz). Liegen sie mehr als 4 dB darunter, vor dem Porträt-Schritt einen EQ
   auf `takes/t1.orig.mp4` legen (Sicherung `t1.orig.vor-eq.mp4`), z. B. `equalizer=f=5200:t=o:w=1:g=10,
   equalizer=f=7000:t=o:w=0.6:g=12,equalizer=f=10500:t=o:w=0.9:g=-5,alimiter=limit=0.89`, nachmessen und ihm sagen,
   dass das Mikro dumpf klang (Mikro verdeckt, Windschutz, falsches Mikro gewählt?).
0c. **Schärfe der Rohaufnahme prüfen** (2026-10-12, Temu "zu unscharf"): Die Aufnahme hatte im Gesicht nur halb so
   viel Detail wie KI-Kunde (Laplace-Varianz im Gesichtsausschnitt ~90 statt ~180). Dann leicht nachschärfen, bevor
   `npm run portrait` läuft: `unsharp=5:5:0.8:3:3:0` auf `takes/t1.orig.mp4` (libx264 crf 12, Sicherung
   `t1.orig.vor-schaerfe.mp4`), nie stärker als 1,2-fach vergrößern, und ihm sagen, dass Aufnahme und Ton weicher
   waren als sonst (Linse sauber? genug Licht? Mikro frei?). Seit diesem Tag rendert `npm run final` mit `--crf=16
   --jpeg-quality=95` (vorher 18 und Remotions JPEG-Standard 80) und `npm run portrait` mit crf 12 (vorher 16).
1. **Füllwörter immer raus, Pausen ab 0,3 s raus, aber keine Mini-Jump-Cuts:** kein Stück unter ~0,8 s mitten im Satz (das macht `tools/schnitt.py` selbst). Ein Satz wird nie zerhackt, ein Wort nie angeschnitten. Die Wortzeiten von Whisper verdecken solche Pausen oft (das Wort "endet" erst nach der Stille): bei verdächtigen Stellen mit `spec` die Pegel ansehen und Wortende/-anfang im `t1.aligned.json` auf den Laut setzen ("Bei 0:30 ist eine kurze Pause nach 'E-Commerce' welche raus kann", Temu 2026-10-12: 0,3 s Stille in "E-Commerce … Tipps").
2. **Kontext vor Tempo.** Bevor ein Nebensatz rausfliegt: Satz davor und danach ohne ihn lesen. Fragt ein Zuschauer dann "warum?" oder "was?", bleibt er drin. Der Aufruf (CTA) bleibt ein Stück.
3. **Zahlen, Ergebnisse, Daten werden nie erfunden.** Auf dem Bildschirm stehen die Zahlen, die er sagt oder die gemessen sind.
4. **Ganz leichte Hintergrundmusik in jedem Video** (seine Vorgabe 2026-10-17: "Bitte füge ebenfalls zu jedem Video
   ganz leicht Hintergrund Musik ohne Musikrechte hinzu, aber so, dass man mich immer noch sehr gut versteht"), außer
   er sagt für ein Video etwas anderes. Nur unsere eigene, selbst gebaute Musik aus `public/musik/` (`npm run musik`
   baut sie mit `tools/musik.py`, rechtefrei): `ruhig` (HERO, FACE), `puls` (FACE, NEWS), `news` (NEWS/Reaction).
   In der Komposition `<Musik C={C} datei="news.mp3" />` (src/lib/bausteine.tsx): Schleife, beim Sprechen leiser,
   in Pausen etwas lauter, weich ein- und ausgeblendet; die Komposition hat die Props `voice`, `sfx` und `musik`, damit
   `npm run checks -- … --stems <id>` sie getrennt messen kann. Ziel: beim Sprechen ~21 dB unter der Stimme (Grenze
   18 dB, die Prüfung meldet es); gefällt sie ihm lauter oder leiser, `STIL.musik` ändern. Nie Musik aus TikTok,
   CapCut, YouTube oder sonstigen Bibliotheken.
   **Ein paar Soundeffekte bei Animationen und Einblendungen** (seine Vorgabe 2026-10-17: "Ein paar Sound Effekte bei
   Animationen und Einblendungen verwenden"): `pop`, `klick`, `tick`, `whoosh` leise auf dem Frame, auf dem die
   Animation oder Einblendung erscheint, nicht auf jedem Wort. Soundeffekte immer deutlich unter der Stimme.
   **Nur Effekte aus `public/sfx/`** (selbst erzeugt, frei nutzbar). Klänge aus der TikTok- oder CapCut-Bibliothek
   dürfen nur in der App selbst benutzt werden, nie in einem fertig gerenderten Video (das geht auch zu Instagram und
   YouTube): gefällt ihm so ein Klang, einen eigenen ähnlichen mit ffmpeg bauen, wie bei `klick`, `kamera`, `riser`,
   `glitzer` und `wusch-gross` (2026-10-10, nach seinem Referenzvideo).
5. **Eine Bildeinstellung wie gedreht:** kein Gesichts-Tracking, kein Wackeln, kein Angleichen pro Schnitt, ein Grade für alles. Bewegung kommt nur aus bewussten Zooms und Layout-Wechseln.
5b. **Farben professionell** (seine Vorgabe 2026-10-17: "Und optimiere ebenfalls meine Farben im Video, damit es
   professionell wirkt"): nach dem Intake und **vor** `npm run portrait` läuft `npm run farbe -- <projekt>`. Es misst
   pro Take Weißabgleich (Farbstich zu 60 % raus, ein Hauch Wärme für die Haut), Belichtung am Gesicht, Schwarz-/
   Weißpunkt und Sättigung und korrigiert den Take (Sicherung `<take>.vor-farbe.mp4`). Das Vorher/Nachher-Bild
   `out/farbe-<projekt>-<take>.jpg` ansehen: Haut natürlich, Wand nicht ausgefressen, nichts bunt. Erst testen mit
   `--nur-ansehen`. Den Look (Kontrast, Sättigung) gibt danach das Design (`grade`). Korrektur und Look gelten für den
   ganzen Take, kein Angleichen pro Schnitt.
   **Sanft, nicht heller und nicht kontrastreicher als nötig** (seine Vorgabe 2026-10-18 zu REWE v2: "Ich finde die
   Farbe des neuen Videos zu kontrastreich und zu hell", danach "Für das nächste Video bitte optimieren und
   abschwächen"): Farbstich zu 50 % raus, Gesicht nur leicht Richtung Luma ~0,535 (höchstens ±4 %), Schwarz-/Weißpunkt
   nur bei milchigem oder trübem Bild und dann zur Hälfte, Vibrance höchstens 0,08. Im Video dazu der sanfte Grade:
   `<Takes … grade={STIL.gradeSanft} />` (`contrast(1.02) saturate(1.03)`, nicht heller) statt des Design-Grades.
   Im fertigen Video liegt das Gesicht dann bei ~0,55-0,57 (REWE v2 hatte 0,65 und knapp 3 % fast weiße Fläche: zu
   hell und zu kontrastreich). `npm run farbe` behält die Zeitstempel des Takes (sonst rutscht das Bild bei
   Handy-Takes mit schwankender Bildrate einen Frame neben den Ton).
6. **Rohclips bleiben privat** (`public/projekte/` ist git-ignoriert). Hochgeladen wird nur, was er freigibt.
7. **Messen statt fühlen:** Sync, Pacing, Lautheit und Ausreißer werden am Render gemessen, nicht am Code geglaubt.

## Bekannte Stolperfallen

- **Whisper-Wortzeiten** liegen 0,1-0,3 s daneben, manchmal zwei Wörter auf derselben Zeit. Darum immer ausrichten (macht `npm run intake` selbst); `schnitt.py` warnt, wenn ein Take nicht ausgerichtet ist.
- **4K-Takes** in zwei parallelen Vorschau-Renders haben den Browser abstürzen lassen: `npm run intake` macht eine 1080er-Arbeitskopie (Zooms bis 110 % bleiben scharf).
- **Nie mehr als zwei Renders gleichzeitig**, und halte ~2 GB Platz frei (ein 4K-Take hat ~340 MB pro Minute). Alte Takes fertiger Projekte löschen (die Originale hat er).
- **Symlinks** unter `public/` lädt Remotion nicht: Takes immer als Datei ablegen.
- **Ein "Wort nicht gefunden"** in `schnitt.py`: `ab` liegt nach dem ersten Wort des Satzes, oder der Text weicht vom Transkript ab (Verhörer: Text wie im Transkript schreiben und über `korrekturen` richtigstellen).
- **Ein "HINWEIS: … erst N Wörter weiter gefunden"** in `schnitt.py`: ein Wort des Texts lag weit hinter der Stelle, an der der Satz stand (meist ein Verhörer davor). Prüfen, sonst stimmt der Schnitt dort nicht. Fängt er einen Satz neu an ("wenn du … wenn du noch"), nimmt der Schnitt von selbst den zweiten, ganzen Anlauf.
- **Ein leises "äh" ohne Wort** im Transkript bleibt sonst drin: `npm run fillerscan` nach jedem Schnitt.
- **Ein langes Video verliert am Anfang:** der erste Frame braucht ein scharfes Gesicht und den Hook-Satz; ein Aufruf ganz am Ende erreicht nur, wer bis zum Ende schaut.

## Skizzen, Icons und Animationen mit HyperFrames (seit 2026-10-17 Standard)

Seine Vorgaben 2026-10-17: "Mir fehlen bisher leider die neuen b-Rolls und Animationen, welche über den neuen skill
„Hyperframes" erstellt werden können" und "Ich finde es gut, wenn meine Aussagen und Beispiele mit kurzen Skizzen,
Icons und Animationen visuell unterstützt werden". In jedem Video außer der Serie bekommt jede Aussage und jedes
Beispiel eine kurze Skizze (weiße Strichzeichnung, die sich zeichnet, Akzente in unserem Grün `#00F090`, leicht
handgezeichnet über einen festen SVG-Filter), ein Icon oder eine kleine Animation (Zähler, Uhr, Karte mit Pin, Ablauf
mit Pfeilen, "A vs. B"). Vorlage: `hyperframes/rewe-skizzen/index.html` (fünf Szenen, Beispiel REWE × Lieferando).
So geht es:
1. Nach dem freigegebenen Schnitt die Sekunden der Stichwörter im geschnittenen Video aus `cut.json` ausrechnen
   (Summe der Stücke davor + Wortzeit − Stückanfang) und je Aussage eine Szene planen; die Zeichnung erscheint auf dem
   Wort, Einzelteile auf ihren Wörtern (z. B. die Märkte auf "fünf").
2. Ein HyperFrames-Projekt `hyperframes/<projekt>-skizzen/` (`npx hyperframes init … --example=blank
   --skill=motion-graphics`), 1080x1920, Hintergrund transparent, alle Szenen als `.clip` mit `data-start` in
   Video-Sekunden, eine pausierte GSAP-Timeline (Skills `hyperframes`, `hyperframes-core`, `motion-graphics`).
   **Fläche: über dem Kopf** (seine Vorgabe 2026-10-17: "B-Rolls sollten besser über dem Kopf angezeigt werden, damit
   mehr Platz für den Untertitel ist"): Karte 860x370 auf 90 %, x 153-927, y 290-623, dunkel (rgba 11,12,14 / 0,86),
   damit sie auch vor heller Wand trägt. Dafür steht er tiefer im Bild (Augen bei ~900-915, z. B. `scale 1.3`,
   `hoch` 175 px kleiner als sonst) und die Untertitel liegen unter dem Kopf bei y ~1400. Auch Quellen-Screenshots
   kommen über den Kopf (Breite ~560, oben ab y 300, Quellenzeile direkt darunter). Während der Hook gehört der Platz
   oben dem Hook-Titel: dort keine Skizze. Nie auf dem Gesicht. Beschriftungen passen in die Karte (lange Labels
   umbrechen lassen, nicht überstehen). Schrift Anton (aus `public/fonts`, per `@font-face`).
3. `npx hyperframes check .` ohne Fehler, `npx hyperframes snapshot --at …` ansehen, dann
   `npx hyperframes render . --format webm -q high -o renders/skizzen.webm` (VP9 mit Alpha) und nach
   `public/broll/<projekt>/skizzen.webm` kopieren.
4. In der Remotion-Komposition: `<OffthreadVideo src={staticFile("broll/<projekt>/skizzen.webm")} transparent muted />`
   in einer `<Sequence from={0}>`; ein leiser `pop`/`tick`/`success` auf jeder Szene und jedem Zähler.
Nur Inhalte, die er sagt oder die Quelle belegt; keine fremden Logos oder Markenfotos; keine HeyGen-Dienste mit
seinen Rohclips (die Snapshot-Beschreibung schickt nur unsere Zeichnungen an Gemini, nie Takes).

### Weitere B-Rolls mit HyperFrames

Seine Vorgabe 2026-10-17 (nach REWE × Lieferando): "Mir fehlen bisher leider die neuen b-Rolls und Animationen,
welche über den neuen skill „Hyperframes" erstellt werden können." In jedem Video außer der Serie bekommt jeder
Abschnitt eine animierte Grafik oder B-Roll, die zeigt, was er sagt (animiertes Diagramm, hochzählende Zahl, Karte,
Ablauf, Bauchbinde). Gebaut mit den HyperFrames-Skills (`hyperframes`, `hyperframes-animation`, `hyperframes-cli`) in
einem eigenen Ordner unter `hyperframes/<projekt>/`, gerendert als transparentes Overlay und in die
Remotion-Komposition gelegt, auf dem Wort (wie jede Grafik: `C.cue`). Schnitt, Untertitel, Prüfungen und Upload
bleiben bei faber-cut; der HyperFrames-Router nennt sich "Standard für jedes Video", das gilt nur für diese Grafiken.
Keine HeyGen-Dienste (Sprecher, Musik, Soundeffekte über `media-use`) mit seinen Rohclips. Nur Inhalte, die er sagt
oder die Quelle belegt; keine fremden Logos oder Markenfotos ohne Rechte.
