---
name: faber-cut
description: Schneidet Talking-Head-Rohclips (Handy, hochkant) wie ein Senior-Editor zu einem fertigen 1080x1920-Reel für Instagram und TikTok, mit Remotion. Lokal transkribieren und Wortzeiten auf den Frame ausrichten, nach Text schneiden (Füllwörter, Versprecher und Pausen raus, keine Mini-Jump-Cuts), Untertitel Wort für Wort, Motion Graphics genau auf dem gesprochenen Wort, Splitscreen, J-Cuts, Soundeffekte unter der Stimme, -14 LUFS, Vorschau-Runden mit dem Nutzer und gemessene Prüfungen. Verwende diesen Skill, wenn der Nutzer Rohclips ablegt oder schickt, "schneide mir dieses Video" sagt, ein Video überarbeiten will oder Feedback zu einem Schnitt gibt.
---

# faber-cut: Rohclips zu einem fertigen Reel

Du schneidest die Videos des Nutzers so, wie er sie haben will. Sein Geschmack steht **pro Videoformat in einem eigenen Skill** (HERO: `stil-hero`, FACE: `stil-face`, NEWS/Reaction: `stil-news`); die Übersicht und wie du das Format klärst, steht in **`stil.md`** (in diesem Ordner): lies sie und den Skill des Formats vor jedem Schnitt. Sagt der Nutzer, dass er etwas anders haben will ("Untertitel größer", "der CTA ans Ende", "weniger Zooms"), setz es um **und trag es als Regel in den Skill des Formats ein** (mit seinem Satz in Anführungszeichen und dem Datum). So wird der Skill mit jedem Video mehr sein eigener.

Sprich mit dem Nutzer in seiner Sprache. Die Untertitel und Texte im Video folgen der Sprache des Videos.

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
- **`ende.halt`:** ein stilles Stück aus dem Take als Halt nach dem letzten Wort, nur wenn nach dem letzten Wort noch etwas gesagt wird, das nicht ins Video gehört. Nie einen Satz weglassen, der den Aufruf begründet.
- **`korrekturen`:** Verhörer in den Untertiteln (`[take, sekunde, "falsch", "richtig"]`), `""` nimmt ein Wort raus, das nicht im Ton ist.

Dann `npm run schnitt -- src/projekte/<projekt>/schnitt.json`. Es muss **ohne "PRÜFEN"** durchlaufen: Untertitel = gewählter Text Wort für Wort, Reihenfolge stimmt, keine Mini-Schnitte. Danach `npm run fillerscan -- src/projekte/<projekt>/cut.json`: Stimme ohne Wort ist meist ein "äh", das Whisper nicht aufgeschrieben hat. Hör dir die Stelle über den Pegel an und schneide sie (Satz in zwei Einträge teilen).

**Rohschnitt vor den Grafiken:** `npm run rohschnitt -- src/projekte/<projekt>/cut.json` setzt den Schnitt in Sekunden mit ffmpeg zusammen (halbe Größe, Untertitel mit dem gelben Wort eingebrannt, oben links die Sekunde, ohne Grafiken) nach `out/vorschau/<projekt>-roh.mp4`. Schick ihm den Rohschnitt und lass ihn den Schnitt freigeben (Reihenfolge, Länge, was raus ist), bevor du Grafiken baust: eine Schnitt-Notiz kostet dann einen neuen Rohschnitt in Sekunden statt einer neuen Vorschau in Minuten. Seine Notizen nennen die Sekunde oben links. Ist er nicht erreichbar, bau weiter und sag es im Bericht.

**Porträt-Modus** (wenn der Stil des Formats ihn verlangt): nach dem freigegebenen Schnitt `npm run portrait -- <projekt>`. Es stellt die Person in jedem Take frei (Robust Video Matting, CPU, ~6 Bilder/s) und zeichnet nur den Hintergrund weich, aber nur an den Stellen, die `cut.json` nutzt; das Original bleibt als `<take>.orig.mp4`. Ändert sich der Schnitt danach, noch einmal laufen lassen. Vor der nächsten Vorschau `out/vorschau/<Komposition>/` löschen, damit keine Stücke mit dem alten Bild bleiben.

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
- Ob eine Zeile in die Breite passt, misst `textWidth`/`fitSize` aus `src/lib/messen.ts` (echte Breiten von Geist, nicht geschätzt); Untertitel und Hook-Titel werden damit selbst kleiner statt umzubrechen.

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
3. Cover: ein Frame mit Titel und Gesicht (`ffmpeg -ss 1.4 -i out/final/<id>.mp4 -frames:v 1 out/final/<id>-cover.jpg`).
4. **Übergeben:** lokal nennst du ihm den Ordner `out/final/` (`<id>-post.mp4` zum Hochladen auf Instagram/TikTok). Online kann er nicht in deinen Rechner schauen: schick ihm `out/final/<id>-chat.mp4` (unter 29 MB) als Datei in den Chat, falls du ein Werkzeug zum Senden von Dateien hast, und leg das Video **in bester Qualität** (das Master, so will er es) in seinen Drive-Ordner: `npm run hochladen -- out/final/<id>.mp4 "<Titel>"` (landet in **"Final geschnittene Videos"**, Datei heißt wie der Titel; braucht den Upload-Helfer `tools/drive-upload.gs` und `DRIVE_UPLOAD_URL`). **Pro Video ein eigener Unterordner** (so will er es): mit dem Google-Drive-Connector in "Final geschnittene Videos" einen Ordner "<Titel>" anlegen, das hochgeladene Video hineinschieben (`update_file` mit `parentId`) und dort die Beschreibungen als Google Doc "<Titel> – Beschreibungen" anlegen (Text aus `beschreibung.md`). Den Titel nimmst du aus den Beschreibungen (YouTube-Titel, ohne Doppelpunkt: "Fake-Shop erkennen – 5 Checks vor dem Online-Kauf"). **Nach seinem finalen Go läuft das ohne weitere Rückfrage durch** (so will er es): Vollversion, Prüfungen, Hochladen ins Drive (Master), Beschreibungen, und wenn Metricool in der Sitzung verbunden ist, das Video gleich mit Beschreibung und Hashtags in Metricool einplanen (Video-Link aus dem Drive). Vor dem ersten Live-Gang zeigst du ihm den Kalender.
   **Beschreibungen** für TikTok, Instagram und YouTube schreibst du nach `src/projekte/<projekt>/beschreibung.md` und legst sie als Google-Dokument "<Titel> – Beschreibungen" in denselben Drive-Ordner (Google-Drive-Verbindung, als reiner Text, damit Nummern beim Kopieren bleiben).
5. **Online speichern:** die Sitzung ist nach einer Weile weg. Committe `src/projekte/<projekt>/`, `public/broll/<projekt>/`, den Skill des Formats (`.claude/skills/stil-*/`) und `faber-cut.json` und pushe sie so, wie es in `faber-cut.json` unter `speichern` steht (`main` = er hat erlaubt, direkt auf seinen Hauptzweig zu pushen).

## Regeln, die immer gelten

1. **Füllwörter immer raus, Pausen ab 0,3 s raus, aber keine Mini-Jump-Cuts:** kein Stück unter ~0,8 s mitten im Satz (das macht `tools/schnitt.py` selbst). Ein Satz wird nie zerhackt, ein Wort nie angeschnitten.
2. **Kontext vor Tempo.** Bevor ein Nebensatz rausfliegt: Satz davor und danach ohne ihn lesen. Fragt ein Zuschauer dann "warum?" oder "was?", bleibt er drin. Der Aufruf (CTA) bleibt ein Stück.
3. **Zahlen, Ergebnisse, Daten werden nie erfunden.** Auf dem Bildschirm stehen die Zahlen, die er sagt oder die gemessen sind.
4. **Keine Musik**, wenn er seine eigene drunterlegt (Standard, siehe der Stil des Formats). Soundeffekte immer deutlich unter der Stimme.
5. **Eine Bildeinstellung wie gedreht:** kein Gesichts-Tracking, kein Wackeln, kein Angleichen pro Schnitt, ein Grade für alles. Bewegung kommt nur aus bewussten Zooms und Layout-Wechseln.
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
