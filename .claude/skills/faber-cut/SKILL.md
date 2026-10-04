---
name: faber-cut
description: Schneidet Talking-Head-Rohclips (Handy, hochkant) wie ein Senior-Editor zu einem fertigen 1080x1920-Reel für Instagram und TikTok, mit Remotion. Lokal transkribieren und Wortzeiten auf den Frame ausrichten, nach Text schneiden (Füllwörter, Versprecher und Pausen raus, keine Mini-Jump-Cuts), Untertitel Wort für Wort, Motion Graphics genau auf dem gesprochenen Wort, Splitscreen, J-Cuts, Soundeffekte unter der Stimme, -14 LUFS, Vorschau-Runden mit dem Nutzer und gemessene Prüfungen. Verwende diesen Skill, wenn der Nutzer Rohclips ablegt oder schickt, "schneide mir dieses Video" sagt, ein Video überarbeiten will oder Feedback zu einem Schnitt gibt.
---

# faber-cut: Rohclips zu einem fertigen Reel

Du schneidest die Videos des Nutzers so, wie er sie haben will. Sein Geschmack steht in **`stil.md`** (in diesem Ordner): lies die Datei vor jedem Schnitt. Sagt der Nutzer, dass er etwas anders haben will ("Untertitel größer", "der CTA ans Ende", "weniger Zooms"), setz es um **und trag es als Regel in `stil.md` ein** (mit seinem Satz in Anführungszeichen und dem Datum). So wird der Skill mit jedem Video mehr sein eigener.

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
| Vorschau / Vollversion | `out/vorschau/<Komposition>.mp4`, `out/final/` |

Python immer mit `.venv/bin/python`. Ist `.venv` oder `node_modules` nicht da: zuerst `bash setup.sh`.

## Ablauf (jeder Schritt, jedes Mal)

### 1. Clips vorbereiten

- Projektname kurz und ohne Leerzeichen (`tag6`, `api-keys`), Takes `t1`, `t2`, … in der Reihenfolge, in der er sie gedreht hat.
- Pro Take, nacheinander (nie parallel): `bash tools/intake.sh <rohclip> <projekt> <take> [--sprache de|en]`. Das entrauscht die Stimme, kopiert das Bild (4K wird zu einer 1080er-Arbeitskopie), transkribiert lokal und richtet die Wortzeiten aus.
- Kommen Produktnamen vor, die Whisper verhört (Claude, Remotion, sein Firmenname), transkribiere mit `--namen "…"` neu (`tools/transcribe.py`, danach `tools/align.py`).
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
- **`ende.bis`:** ~0,6 s nach dem letzten Wort, bevor sein nächster Laut kommt. So bleibt er unter der Endgrafik im Bild (keine Frames ohne Bild anhängen).
- **`korrekturen`:** Verhörer in den Untertiteln (`[take, sekunde, "falsch", "richtig"]`), `""` nimmt ein Wort raus, das nicht im Ton ist.

Dann `.venv/bin/python tools/schnitt.py src/projekte/<projekt>/schnitt.json`. Es muss **ohne "PRÜFEN"** durchlaufen: Untertitel = gewählter Text Wort für Wort, Reihenfolge stimmt, keine Mini-Schnitte. Danach `.venv/bin/python tools/fillerscan.py src/projekte/<projekt>/cut.json`: Stimme ohne Wort ist meist ein "äh", das Whisper nicht aufgeschrieben hat. Hör dir die Stelle über den Pegel an und schneide sie (Satz in zwei Einträge teilen).

### 5. Grafiken

Kopiere `src/projekte/_vorlage/Video.tsx` nach `src/projekte/<projekt>/Video.tsx`, setz `meta.id` (z. B. `"Tag6"`), dann bau die Grafiken. Die Komposition meldet sich von selbst an (`npx remotion compositions`).

**Timing (das wichtigste):**
- Jede Grafik landet mit `C.cue("wort")` auf ihrem Wort, also **2 Frames vor dem ersten Laut** (Wortzeiten sind auf den Frame ausgerichtet). Nie geschätzte Frames, nie "+10", nie "alle 22 Frames": Zähler, Schritte, Runden wechseln auf dem Wort, das sie sagt. Das nächste gleiche Wort: `C.cue("schritt", C.W("github"))`.
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
- Sichere Fläche x 60-950, y 250-1500 (oben und rechts liegen die App-Knöpfe). Untertitel im Vollbild bei y 1340, im Split auf der Naht (y 872).
- Nichts auf dem Gesicht: vor dem Platzieren `.venv/bin/python tools/grid.py public/projekte/<projekt>/takes/t1.mp4 out/raster.jpg 2,10,20` und nach den Zahlen platzieren (Kopf-Box, freie Felder A-F).
- Text in Grafiken mindestens 42 px, Listen 46 px, Zeilenhöhe 1,3. Darunter ist es auf dem Handy nicht lesbar.

### 6. Vorschau und eigene Prüfung

1. `npm run vorschau -- <Komposition>` (halbe Größe, 10-s-Stücke mit Cache). Nach Änderungen an Ort und Stelle `--changed a-b` (Frames), nach Änderungen am Schnitt `--from N`.
2. **Sync messen:** `.venv/bin/python tools/sync-audit.py out/vorschau/<id>.mp4 src/projekte/<projekt>/cut.json wort[:s|c] …` mit jedem Stichwort einer Grafik (`s` = Bühne oben im Split, `c` = Brustzone im Vollbild). Ziel -4..+1 Frames. Eine CHECK-Zeile ist oft eine andere Bewegung im Bereich: den 8-Frame-Streifen um das Wort ansehen, bevor du etwas änderst.
3. **Pacing messen:** `.venv/bin/python tools/pacing-scan.py out/vorschau/<id>.mp4 src/projekte/<projekt>/cut.json`. Jede Strecke über 2 s ohne Bildänderung bekommt eine Grafik, die die Zeile trägt. Stille am Ton nachmessen (Wortenden liegen eher früh).
4. **Standbilder** an jeder Grafik (Anfang und Ende, `npx remotion still <id> out/x.jpg --frame=N --scale=0.4`): nichts überlappt, nichts bleibt zu lange stehen, Text bricht nicht ungewollt um, das Ende zeigt ihn noch im Bild.
5. **Gemini** (optional, `GEMINI_API_KEY`): `.venv/bin/python tools/gemini-review.py out/vorschau/<id>.mp4 prompts/review.md`, **zweimal**. Gemini irrt oft (erfundene Tippfehler, "Text zu tief", "keine Soundeffekte"): prüfe jede Behauptung an Standbild, Ton oder Code. Übernimm nur, was stimmt.

### 7. Runde mit dem Nutzer

Schick ihm die Vorschau mit: was du gemacht hast, die Gemini-Noten, welche Punkte du übernommen oder verworfen hast und warum. Dann wartest du auf seine Notizen. **Keine Vollversion vor seinem OK.** Jede Notiz: umsetzen, neue Vorschau, wieder schicken. Ist eine Notiz eine Geschmacksregel, trag sie in `stil.md` ein.

### 8. Vollversion

Erst wenn er "passt" sagt:
1. `npm run final -- <Komposition>`: voller Render, -14 LUFS, Post-Version (≤ 47 MB) und Chat-Kopie (< 29 MB).
2. `.venv/bin/python tools/checks.py out/final/<id>.mp4 --stems <id>`: keine Ausreißer-Frames, Lautheit, jeder Effekt ≥ 6 dB unter der Stimme. Erst bei OK übergeben.
3. Cover: ein Frame mit Titel und Gesicht (`ffmpeg -ss 1.4 -i out/final/<id>.mp4 -frames:v 1 out/final/<id>-cover.jpg`).

## Regeln, die immer gelten

1. **Füllwörter immer raus, Pausen ab 0,3 s raus, aber keine Mini-Jump-Cuts:** kein Stück unter ~0,8 s mitten im Satz (das macht `tools/schnitt.py` selbst). Ein Satz wird nie zerhackt, ein Wort nie angeschnitten.
2. **Kontext vor Tempo.** Bevor ein Nebensatz rausfliegt: Satz davor und danach ohne ihn lesen. Fragt ein Zuschauer dann "warum?" oder "was?", bleibt er drin. Der Aufruf (CTA) bleibt ein Stück.
3. **Zahlen, Ergebnisse, Daten werden nie erfunden.** Auf dem Bildschirm stehen die Zahlen, die er sagt oder die gemessen sind.
4. **Keine Musik**, wenn er seine eigene drunterlegt (Standard, siehe `stil.md`). Soundeffekte immer deutlich unter der Stimme.
5. **Eine Bildeinstellung wie gedreht:** kein Gesichts-Tracking, kein Wackeln, kein Angleichen pro Schnitt, ein Grade für alles. Bewegung kommt nur aus bewussten Zooms und Layout-Wechseln.
6. **Rohclips bleiben privat** (`public/projekte/` ist git-ignoriert). Hochgeladen wird nur, was er freigibt.
7. **Messen statt fühlen:** Sync, Pacing, Lautheit und Ausreißer werden am Render gemessen, nicht am Code geglaubt.

## Bekannte Stolperfallen

- **Whisper-Wortzeiten** liegen 0,1-0,3 s daneben, manchmal zwei Wörter auf derselben Zeit. Darum immer `tools/align.py` (macht `intake.sh` selbst); `schnitt.py` warnt, wenn ein Take nicht ausgerichtet ist.
- **4K-Takes** in zwei parallelen Vorschau-Renders haben den Browser abstürzen lassen: `intake.sh` macht eine 1080er-Arbeitskopie (Zooms bis 110 % bleiben scharf).
- **Nie mehr als zwei Renders gleichzeitig**, und halte ~2 GB Platz frei (ein 4K-Take hat ~340 MB pro Minute). Alte Takes fertiger Projekte löschen (die Originale hat er).
- **Symlinks** unter `public/` lädt Remotion nicht: Takes immer als Datei ablegen.
- **Ein "Wort nicht gefunden"** in `schnitt.py`: `ab` liegt nach dem ersten Wort des Satzes, oder der Text weicht vom Transkript ab (Verhörer: Text wie im Transkript schreiben und über `korrekturen` richtigstellen).
- **Ein leises "äh" ohne Wort** im Transkript bleibt sonst drin: `tools/fillerscan.py` nach jedem Schnitt.
- **Ein langes Video verliert am Anfang:** der erste Frame braucht ein scharfes Gesicht und den Hook-Satz; ein Aufruf ganz am Ende erreicht nur, wer bis zum Ende schaut.
