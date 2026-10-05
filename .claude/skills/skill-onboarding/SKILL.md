---
name: skill-onboarding
description: Richtet faber-cut beim ersten Mal Schritt für Schritt ein, als geführtes Onboarding mit Auswahlfragen. Lokal (Windows, macOS, Linux) oder online (Claude Code im Browser oder in der App), Programme installieren, optional die Gemini-Prüfung mit kostenlosem Schlüssel, Google Drive für den Online-Modus, ein grober erster Schnittstil (Untertitel, Grafiken, Tempo, Farbe, Effekte) und ein Probelauf. Verwende diesen Skill, wenn faber-cut.json fehlt (das Repo wurde gerade geklont), wenn der Nutzer "richte faber-cut ein", "Setup", "Onboarding" oder "einrichten" sagt, oder wenn er an der Einrichtung etwas ändern will (Gemini nachrüsten, von lokal auf online wechseln, Stil neu festlegen).
---

# Skill-Onboarding: faber-cut einrichten

Du führst den Nutzer durch die Einrichtung von faber-cut, bis sein erstes Video geschnitten werden kann. Rechne damit, dass er noch nie ein Terminal benutzt, nie einen API-Schlüssel erstellt und nie eine Cloud-Umgebung eingestellt hat. Darum:

- **Ein Schritt nach dem anderen.** Eine Nachricht = ein Mini-Schritt mit **höchstens drei Handgriffen**, dann die Bestätigungsfrage. Nie zwei Schritte in einer Nachricht, nie eine lange Liste. Bei mehreren Klick-Schritten oben "Schritt 2 von 7", damit er sieht, wie weit er ist.
- **Jeder Schritt sagt drei Dinge:** was er tun soll, wo genau er klickt oder was er eintippt, und woran er erkennt, dass es geklappt hat.
- **Fachwörter nur mit Erklärung** in einem Halbsatz ("das Terminal, also das Fenster, in das man Befehle tippt").
- **Alles, was du selbst machen kannst, machst du selbst** (Befehle ausführen, Dateien schreiben, prüfen). Er klickt nur dort, wo du nicht hinkommst: Google, GitHub, die Einstellungen von Claude, Passwörter.
- **Entscheidungen und Bestätigungen** immer mit dem Werkzeug **AskUserQuestion**: 2-4 Optionen, deine Empfehlung zuerst mit "(Empfohlen)", in der Beschreibung, was die Wahl bedeutet. Muss er draußen etwas tun (Schlüssel erstellen, Ordner freigeben), gib ihm die Anleitung und frag dann mit den Optionen "Erledigt", "Hat nicht geklappt" und, wo es geht, "Überspringen". Bei "Hat nicht geklappt" frag nach, was er sieht, und hilf genau dort weiter.
- **Nie nach Passwörtern oder Schlüsseln im Chat fragen.** Der Gemini-Schlüssel kommt in eine Datei oder in die Cloud-Einstellungen (siehe unten), nicht in den Chat. Schickt er ihn trotzdem, trag ihn ein und sag ihm freundlich, dass er ihn in Google AI Studio löschen und neu erstellen sollte, weil er jetzt im Chatverlauf steht.
- Sprich in seiner Sprache, freundlich und knapp. Zeig zu Beginn einmal kurz die Etappen (z. B. "1. Wo es läuft · 2. Programme · 3. Gemini · 4. Dein Stil · 5. Probelauf"), damit er weiß, wo er steht.

Die genauen Klickpfade und Befehle für jedes System stehen in **`anleitungen.md`** (in diesem Ordner). Lies den passenden Abschnitt, bevor du einen Schritt erklärst, und gib ihn in deinen Worten weiter.

## 0. Lage prüfen (ohne ihn zu fragen)

- **Per Prompt geklont?** Hat er dich mit "Installiere faber-cut von github.com/TobiB1505/faber-cut und richte es für mich ein" gestartet, läufst du noch im Ordner darüber. Klone das Repo (`git clone https://github.com/TobiB1505/faber-cut.git`, ohne git: als ZIP laden und entpacken), arbeite ab dann im Ordner `faber-cut` (alle `npm run …` dort) und lies seine `CLAUDE.md`. Sag ihm am Ende des Onboardings, dass er Claude Code künftig in diesem Ordner startet (`cd faber-cut`, dann `claude`), damit die Skills automatisch geladen werden.
- **System:** `node -p "process.platform + ' ' + process.arch"` (`win32`, `darwin` = Mac, `linux`). Fehlt Node, sagt die Shell es dir; dann `uname -s` (Mac/Linux) oder die Windows-Hinweise im Fehler.
- **Cloud oder lokal:** die Umgebungsvariable `CLAUDE_CODE_REMOTE` ist in einer Cloud-Sitzung `true`.
- **In der Cloud: ist die Umgebung schon bereit?** `curl -s -o /dev/null -m 10 -w "%{http_code}" https://huggingface.co`. Kommt `000` (oder der Proxy meldet "connect_rejected"), läuft die Sitzung in einer Umgebung, deren Netzwerk Modelle, PyTorch und Drive sperrt; das ist bei einer normalen Cloud-Sitzung der Fall. Dann kann `npm run setup` hier nicht durchlaufen: Versuch es nicht, sondern folge 3O (zwei Sitzungen). Kommt eine HTTP-Zahl, ist die Umgebung schon freigeschaltet.
- **In der Cloud: läuft die Sitzung schon mit faber-cut?** Hast du faber-cut erst per Prompt geklont, ist das Repo der Sitzung ein anderes: Die Skills von faber-cut lädt sie dann nicht von selbst (lies sie aus dem Klon), und speichern kann sie dort nichts. Das klärt 3O.1.
- **Schon eingerichtet?** Gibt es `faber-cut.json`, lies sie und frag, was er ändern will (Gemini nachrüsten, Modus wechseln, Stil neu, nur prüfen). Mach dann nur diesen Teil. Steht darin `"onboarding": "weiter"`, ist ihr erster Teil schon erledigt (Online-Modus nach dem Neustart): spring zu Schritt 3O.6.
- Läuft Node schon: `npm run doktor` zeigt dir, was fehlt.

## 1. Begrüßung (Text, keine Frage)

Drei, vier Sätze: faber-cut schneidet seine Talking-Head-Videos zu fertigen Reels (Füllwörter und Pausen raus, Untertitel, Grafiken auf dem Wort, -14 LUFS). Und **es kostet nichts**:

- faber-cut ist frei (MIT-Lizenz).
- Transkription, Schnitt und Render laufen auf seinem Rechner oder in seiner Cloud-Sitzung, ohne bezahlte Dienste.
- Remotion (das Video-Werkzeug darunter) ist für Einzelpersonen und Firmen bis 3 Personen kostenlos.
- Die Gemini-Prüfung ist freiwillig und geht mit einem kostenlosen Schlüssel.
- Er braucht nur Claude Code, also seinen Claude-Plan, den er schon hat.

Dauer: 10-20 Minuten, das meiste ist Warten auf Downloads.

## 2. Wo soll faber-cut laufen?

AskUserQuestion, Empfehlung nach Lage (Cloud-Sitzung: Online; sonst Lokal):

- **Lokal auf diesem Computer:** Er legt Clips in den Ordner `eingang/`, alles bleibt auf seinem Rechner. Braucht ~8 GB freien Platz; ein Video rechnet ein paar Minuten.
- **Online (Claude Code im Browser oder in der App):** Er lädt Clips vom Handy in einen Google-Drive-Ordner, Claude schneidet in der Cloud, das fertige Video kommt in den Chat. Auf seinem Rechner wird nichts installiert. Braucht einen Claude-Plan mit Cloud-Sitzungen (Pro, Max, Team), ein Google-Konto und eine eigene Kopie des Repos auf GitHub.

Passt die Wahl nicht zu dieser Sitzung (er will online, du läufst aber lokal, oder umgekehrt), erklär ihm den Umzug (`anleitungen.md`, "Umzug") und hör hier auf: das Onboarding startet er dort noch einmal.

Wählt er **Online** und die Umgebung ist noch nicht bereit (Schritt 0), sag es ihm sofort und ehrlich, in zwei, drei Sätzen: In dieser Sitzung kann faber-cut noch nicht installiert werden, weil ihr Netzwerk die Seiten für Sprachmodelle, PyTorch und Drive sperrt. Das ist bei jeder normalen Cloud-Sitzung so, nicht sein Fehler. Darum geht es in zwei Sitzungen: hier ein paar Klicks, darunter eine eigene Cloud-Umgebung (und, wenn die Sitzung schon mit seinem Repo läuft, Stil und Einstellungen), dann einmal neu starten, und dort installierst du alles und machst den Probelauf. So erwartet er nicht, dass am Ende dieser Sitzung schon alles läuft.

## 3L. Lokal einrichten

1. **Programme prüfen:** Node.js ab 20 (`node --version`) und ffmpeg (`ffmpeg -version`). Fehlt etwas, frag: "Soll ich es installieren? Du bestätigst nur die Rückfrage." oder "Ich mache es selbst". Die Befehle pro System stehen in `anleitungen.md`.
   - Windows: `winget` darfst du selbst ausführen.
   - Mac: `brew install …` darfst du ausführen, wenn Homebrew da ist. Homebrew selbst braucht sein Passwort: das macht er im Terminal.
   - Linux: alles mit `sudo` macht er im Terminal.
   - Nach einer Installation auf Windows kennt diese Sitzung die neuen Programme oft noch nicht: Er muss Claude Code schließen, ein neues Terminal öffnen und neu starten. Sag ihm das vorher, und dass er danach einfach "weiter mit dem Onboarding" schreibt.
2. **Einrichten:** `npm run setup` im Hintergrund starten. Es dauert 5-15 Minuten und lädt ~4 GB (Python, PyTorch, die Modelle für Transkription und Ausrichtung). Sag ihm das. **Stell ihm währenddessen die Fragen aus Schritt 4 (Gemini) und 5 (Stil)**, damit er nicht nur wartet.
3. Wenn `npm run setup` fertig ist: `npm run doktor`. Jedes ✗ beheben (der Doktor nennt die Lösung), bis "Alles bereit." dasteht.

## 3O. Online einrichten

Reihenfolge so, dass er **nur einmal** eine neue Sitzung starten muss:

1. **Eigene Kopie:** `git remote -v`. Zeigt es auf `TobiB1505/faber-cut`, arbeitet er auf dem Original und kann nichts speichern: Er braucht einen Fork (`anleitungen.md`, "Eigene Kopie auf GitHub"), dann eine neue Sitzung mit seinem Fork, dann das Onboarding neu.
   - **Per Prompt in einer fremden Sitzung geklont** (die Sitzung gehört zu einem anderen Repo): Hier lässt sich nichts speichern. Frag darum hier noch keinen Stil, sondern lass ihn den Fork anlegen und gleich die Klick-Etappe (Schritt 4) machen. Dann startet er nur **einmal** neu, mit seinem Fork **und** der Umgebung `faber-cut`, und dort fragst du Stil und Gemini, richtest ein und machst den Probelauf.
   - **Ist er selbst der Besitzer von `TobiB1505/faber-cut`**: Kein Fork, aber trotzdem eine eigene Kopie (privat über https://github.com/new/import), denn sein Stil, `faber-cut.json` und seine Projekte gehören nicht ins öffentliche Original: Wer es danach klont, bekäme seinen Stil und überspränge das Onboarding.
2. **Speichern erlauben:** Eine Cloud-Sitzung ist nach einer Weile weg. Was bleiben soll (Einstellungen, Stil, Projekte), muss in sein GitHub-Repo. Frag: "Darf ich deine Einstellungen, deinen Stil und deine Projekte direkt in dein Repo speichern (Hauptzweig main)?"
   - "Ja, direkt auf main (Empfohlen)": sonst fehlen sie in der nächsten Sitzung.
   - "Nein, frag mich jedes Mal".
   Merk dir die Antwort für `faber-cut.json` (`"speichern": "main"` oder `"fragen"`).
3. **Stil (Schritt 5) und Gemini-Wahl (Schritt 4, nur die Frage)** jetzt, solange die Sitzung läuft.
4. **Die Klick-Etappe.** Jetzt klickt er draußen: Drive-Ordner, Gemini-Schlüssel, Cloud-Umgebung, Drive-Verbindung. Kündige sie in einem Satz an ("Jetzt kommen 7 kurze Klick-Schritte, je etwa eine Minute. Ohne sie kann faber-cut online nicht laufen, weil die normale Cloud-Umgebung die nötigen Seiten sperrt"), dann gib die Mini-Schritte aus `anleitungen.md`, "Klick-Etappe online", **einzeln** weiter: eine Nachricht pro Schritt, danach AskUserQuestion mit "Erledigt", "Hat nicht geklappt" und, wo es passt, "Überspringen". Bei "Hat nicht geklappt" frag, was er sieht, und hilf genau dort.
5. **Vor der neuen Sitzung:** Schreib `faber-cut.json` mit `"onboarding": "weiter"` und speichere es (committen und pushen, wie erlaubt). Dann der letzte Mini-Schritt "neue Sitzung starten" aus `anleitungen.md`.
6. **In der neuen Sitzung:**
   - `npm run setup` (im Hintergrund, ein paar Minuten), dann `npm run doktor`.
   - Den Drive-Ordner mit dem Connector suchen (`faber-cut Rohclips`), seine ID in `faber-cut.json` unter `drive` eintragen. Gibt es ihn unter dem Namen nicht, such nach ähnlichen Ordnern und frag, welchen er meint ("Erledigt" heißt nicht immer, dass es genau so geklappt hat: prüf selbst, was du prüfen kannst).
   - Liegt schon eine Datei drin: mit `curl` testweise laden und prüfen, dass sie größer als ein paar KB ist (sonst ist die Freigabe falsch).
   - In `.gitignore` die zwei Zeilen unter "deine Projekte" (`src/projekte/*` und `!src/projekte/_vorlage/`) entfernen, damit seine Projekte gespeichert werden.

## 4. Gemini-Prüfung (freiwillig)

AskUserQuestion: "Soll Gemini jede Vorschau zusätzlich ansehen und anhören und dir eine Kritik mit Noten geben?"

- **"Ja, mit kostenlosem Schlüssel (Empfohlen)":** eine zweite Meinung zu Hook, Tempo und Sync. Claude prüft jede Behauptung nach, weil Gemini sich oft irrt. Achtung: Beim kostenlosen Schlüssel darf Google die hochgeladene Vorschau zur Verbesserung seiner Dienste nutzen.
- **"Nein, ohne Gemini":** Claude prüft selbst mit Messungen. Gemini kann er später jederzeit nachrüsten.

Bei Ja:
- **Lokal:** die zwei Mini-Schritte aus `anleitungen.md`, "Gemini-Schlüssel lokal" (Schlüssel erstellen, dann in die Datei `.env` legen), je eine Nachricht.
- **Online:** Der Schlüssel ist Teil der Klick-Etappe (3O.4).

Prüfen mit `npm run doktor` ("Gemini-Schlüssel gültig").

## 5. Dein Stil (grob, verfeinert wird beim Schneiden)

Sag ihm kurz: "Jetzt ein paar Fragen, damit dein erster Schnitt schon nach dir aussieht. Alles lässt sich später ändern: sag mir nach jedem Video, was dir nicht gefällt." Dann zwei Runden AskUserQuestion mit je bis zu 4 Fragen.

**Runde 1**
1. Sprache der Videos:
   - Deutsch
   - Englisch
   - Beides (je nach Video)
2. Untertitel:
   - "Wort für Wort, das gesprochene Wort in der Akzentfarbe (Empfohlen)"
   - "Keine Untertitel"
3. Grafiken:
   - "Viele: alle 1,5-2 s ändert sich etwas, Tools und Zahlen erscheinen auf dem Wort (Empfohlen für Reels)"
   - "Wenige: nur bei den wichtigsten Wörtern"
   - "Keine: nur Schnitt und Untertitel"
4. Tempo:
   - "Zügig: Pausen ab 0,3 s raus (Empfohlen)"
   - "Sehr schnell: ab 0,2 s"
   - "Ruhig: ab 0,6 s"

**Runde 2**
1. Akzentfarbe, mit Vorschau des Farbwerts:
   - Gelb `#FFDE28` (Empfohlen)
   - Grün `#3DDC84`
   - Pink `#FF4FA3`
   - Blau `#3FA9FF`
2. Soundeffekte:
   - "Leise Effekte (Pop, Wusch) unter der Stimme (Empfohlen)"
   - "Keine Effekte"
3. Zooms:
   - "Leichte Zooms auf betonte Wörter (Empfohlen)"
   - "Keine Zooms"
4. Titel im ersten Bild (Hook):
   - "Ja, mit Serienzeile, z. B. 'MEIN KANAL · TAG 3' (Empfohlen)"
   - "Ja, nur der Hook-Satz"
   - "Nein"

**Runde 3**, nur wenn er die Serienzeile will: "Wie heißt deine Serie oder dein Kanal?"
- "Nur 'TAG n'"
- "Ich tippe den Namen unter 'Andere' ein"

Dazu: "Wie lang sind deine Videos meistens?"
- "Unter 30 s"
- "30-60 s (Empfohlen)"
- "1-2 min"
- "So lang wie nötig"

Musik legt faber-cut nie drunter: Er wählt sie in Instagram oder TikTok selbst (sag ihm das als Hinweis).

**Umsetzen:**
- **`.claude/skills/faber-cut/stil.md` neu schreiben**, als sein Stil:
  - Überschrift "Mein Schnittstil", eine Zeile "angelegt beim Onboarding am <Datum>".
  - Dieselben Abschnitte wie bisher, aber mit seinen Antworten.
  - Was du nicht gefragt hast, bleibt als vernünftiger Standard stehen (Format 1080x1920, Füllwörter immer raus, keine Mini-Jump-Cuts, Kontext vor Tempo, der Aufruf ans Ende, das Ende hält ihn im Bild, Text in Grafiken ≥ 42 px).
  - Der Abschnitt "Meine Notizen" bleibt leer am Ende.
  - Kein Wort mehr über "Marketing Faber" als seinen Stil.
- **`src/lib/stil.ts`:** `yellow` = seine Akzentfarbe, `sfx: 0` bei "Keine Effekte". Den Kommentar oben auf ihn umschreiben.
- **`src/projekte/_vorlage/schnitt.json`:** `pausen.min_gap` = sein Tempo (0,2 / 0,3 / 0,6).
- **`src/projekte/_vorlage/Video.tsx`:**
  - `kicker` = "<SERIE> · TAG 1" (Großbuchstaben) oder leer, wenn er nur den Hook will.
  - Ohne Hook-Titel: den `HookTitle` entfernen.
  - Ohne Untertitel: `Captions` entfernen.
  - Ohne Effekte: die `Sfx`-Zeilen entfernen.
  - Danach `npm run typecheck`.

## 6. Einstellungen speichern

Schreib `faber-cut.json` ins Repo:

```json
{
  "version": 1,
  "eingerichtet": "2026-10-04",
  "modus": "lokal",
  "system": "win32 x64",
  "sprache": "de",
  "gemini": true,
  "drive": null,
  "speichern": null
}
```

- Online steht unter `"drive"` `{"ordner": "faber-cut Rohclips", "id": "<ordner-id>"}` und unter `"speichern"` `"main"` oder `"fragen"`.
- `"sprache"`: `"de"`, `"en"` oder `"beide"`.
- `"onboarding": "weiter"` nur zwischen den zwei Online-Sitzungen, danach weg.
- Online: committen und pushen, wie erlaubt. Lokal reicht die Datei.

## 7. Probelauf

`npm run probelauf` (im Hintergrund, 3-5 Minuten). Er schneidet den Beispielclip `beispiel/probe.mp4` einmal komplett, mit denselben Schritten wie ein echtes Video.

- **Lokal:** Sag ihm, wo das Video liegt (`out/final/Probelauf.mp4`). Bietet sich an, öffne es ihm (Windows `start`, Mac `open`, Linux `xdg-open`).
- **Online:** Schick `out/final/Probelauf-chat.mp4` als Datei in den Chat, falls du ein Werkzeug dafür hast.

Bleibt er hängen: die Meldung lesen, `npm run doktor`, beheben, nochmal. Danach das Probe-Projekt löschen (`src/projekte/probelauf`, `public/projekte/probelauf`).

## 8. Abschluss

Eine kurze Zusammenfassung: was eingerichtet ist (Modus, Gemini ja/nein, sein Stil in drei Stichworten) und **wie er sein erstes Video bekommt**:

- **Lokal:** Clip in den Ordner `eingang/` legen und schreiben: "Schneide mir das Video in eingang/<datei>. Projekt: video1".
- **Online:** Clip vom Handy in seinen Drive-Ordner hochladen, eine Sitzung mit seinem Repo öffnen und schreiben: "Clips sind drin, schneide mir das Video."

Dazu drei Tipps fürs Filmen:
- Hochkant, Licht von vorne, das Handy nah genug für guten Ton.
- Kurz warten, bevor er losredet.
- Er kann Claude im Clip Anweisungen geben ("Claude, zeig hier oben das GitHub-Logo"): Die werden umgesetzt und rausgeschnitten.

Zum Schluss: Nach jedem Video sagt er, was ihm nicht gefällt, und Claude schreibt es in seinen Stil. So wird es Video für Video mehr sein Schnitt.
