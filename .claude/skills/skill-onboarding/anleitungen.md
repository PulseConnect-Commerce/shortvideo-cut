# Anleitungen zum Onboarding

Klickpfade und Befehle, die du dem Nutzer Schritt für Schritt weitergibst. Gib immer nur einen Mini-Schritt weiter (höchstens drei Handgriffe), sag dazu, woran er erkennt, dass es geklappt hat, und warte auf sein "Erledigt". Die Oberflächen von Google, GitHub und Claude ändern sich manchmal: Sieht etwas bei ihm anders aus, frag, was er sieht, und hilf von dort aus weiter.

## Programme installieren (lokal)

faber-cut braucht **Node.js 20 oder neuer** und **ffmpeg**. Python braucht er nicht selbst zu installieren: `npm run setup` holt sich ein eigenes.

### Windows

- **Terminal öffnen:** Startmenü öffnen, "Terminal" tippen, Enter. (Auf älterem Windows 10: "PowerShell".)
- **Node.js:** `winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements`
- **ffmpeg:** `winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements`
- Fragt Windows "Möchten Sie zulassen, dass diese App Änderungen vornimmt?": **Ja**.
- **Danach wichtig:** Alle Terminal-Fenster und Claude Code schließen, ein neues Terminal öffnen, wieder in den Ordner `faber-cut` wechseln (`cd` und der Pfad) und `claude` starten. Erst dann kennt Windows die neuen Programme. Er schreibt dann "weiter mit dem Onboarding".
- **Geklappt, wenn:** `node --version` eine Zahl ab v20 zeigt und `ffmpeg -version` eine Versionszeile.
- **Kein `winget`** (sehr altes Windows): Node.js von https://nodejs.org (LTS, Installer durchklicken). ffmpeg: https://www.gyan.dev/ffmpeg/builds/ ("release essentials" als ZIP), entpacken nach `C:\ffmpeg` und `C:\ffmpeg\bin` zum PATH hinzufügen. Das ist fummelig: lieber Windows aktualisieren, dann gibt es `winget`.

### macOS

- **Terminal öffnen:** Cmd+Leertaste, "Terminal" tippen, Enter.
- **Homebrew** (der Programm-Installer für den Mac), falls `brew --version` nichts findet: im Terminal
  `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`.
  - Er tippt sein Mac-Passwort ein (man sieht dabei keine Zeichen, das ist normal) und bestätigt mit Enter.
  - Am Ende zeigt Homebrew unter "Next steps" zwei, drei Befehle (`echo … >> ~/.zprofile` und `eval …`). Die muss er genau so kopieren und ausführen.
- **Node.js und ffmpeg:** `brew install node ffmpeg` (das darfst du ausführen, wenn Homebrew da ist).
- **Geklappt, wenn:** `node --version` (ab v20) und `ffmpeg -version` antworten.

### Linux (Ubuntu, Debian, Mint)

- **ffmpeg:** `sudo apt update && sudo apt install -y ffmpeg`.
- **Node.js** (die Version aus `apt` ist oft zu alt):
  `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs`.
- `sudo` fragt nach seinem Passwort: Diese Befehle führt er selbst im Terminal aus (Strg+Alt+T).
- **Andere Distributionen:** ffmpeg und Node.js 20+ aus dem eigenen Paketmanager (Fedora: `sudo dnf install ffmpeg nodejs`; Arch: `sudo pacman -S ffmpeg nodejs npm`).

## Umzug zwischen lokal und online

- **Er ist lokal und will online:**
  1. Eigene Kopie auf GitHub (siehe nächster Abschnitt).
  2. https://claude.ai/code öffnen (oder die Claude-App, Bereich Code).
  3. Eine neue Sitzung starten und sein Repo `faber-cut` auswählen.
  4. Dort schreiben: "Richte faber-cut für mich ein".
- **Er ist online und will lokal:**
  1. Claude Code auf dem Computer installieren (https://claude.com/claude-code, Anleitung dort).
  2. Im Terminal `git clone https://github.com/<sein-name>/faber-cut.git`, dann `cd faber-cut`, dann `claude`.
  3. Dort schreiben: "Richte faber-cut für mich ein".

## Eigene Kopie auf GitHub (für online)

1. Bei https://github.com anmelden (oder kostenlos registrieren).
2. https://github.com/TobiB1505/faber-cut öffnen, oben rechts **Fork** klicken, dann **Create fork**.
3. **Geklappt, wenn** oben links `<sein-name>/faber-cut` steht.
4. Claude braucht Zugriff auf sein GitHub: Beim ersten Mal fragt claude.ai/code danach (GitHub verbinden, die Claude-App für das Repo erlauben).
5. **Privat statt öffentlich:** Ein Fork eines öffentlichen Repos ist öffentlich. Will er seine Projekte (Schnitt-Texte, keine Videos) nicht zeigen, nimmt er statt Fork https://github.com/new/import:
   - die Adresse `https://github.com/TobiB1505/faber-cut` eintragen,
   - einen Namen geben,
   - **Private** wählen.

## Klick-Etappe online

Jeder Mini-Schritt ist **eine eigene Nachricht**: oben "Schritt X von N", dann höchstens drei Handgriffe, dann "Geklappt, wenn …", dann die Bestätigungsfrage. Den nächsten Schritt zeigst du erst nach "Erledigt". N ist 7 mit Gemini, 6 ohne (dann fällt Schritt 3 weg und in Schritt 6 der Schlüssel).

**Schritt 1: Ordner anlegen**
1. https://drive.google.com öffnen (oder die Google-Drive-App am Handy).
2. **Neu** → **Neuer Ordner**.
3. Name `faber-cut Rohclips` → **Erstellen**.
- Geklappt, wenn: der Ordner in der Liste steht.

**Schritt 2: Ordner freigeben**
1. Rechtsklick auf den Ordner → **Teilen** → **Teilen** (App: drei Punkte am Ordner → **Teilen**).
2. Unten bei **Allgemeiner Zugriff**: **Eingeschränkt** umstellen auf **Jeder, der über den Link verfügt** (englisch: **General access** → **Anyone with the link**). Die Rolle bleibt **Betrachter**.
3. **Fertig**.
- Geklappt, wenn: beim Ordner "Jeder, der über den Link verfügt, kann ansehen" steht.
- Ein Satz zum Warum: Die Drive-Verbindung schafft nur kleine Dateien; Videos lädst du in voller Größe über den Link. Niemand kennt den Link, solange er ihn nicht weitergibt.

**Schritt 3: Gemini-Schlüssel erstellen** (nur mit Gemini)
1. https://aistudio.google.com/apikey öffnen, mit dem Google-Konto anmelden, beim ersten Mal die Bedingungen bestätigen.
2. **API-Schlüssel erstellen** (**Create API key**); fragt es nach einem Projekt, das vorgeschlagene nehmen.
3. Den Schlüssel kopieren (beginnt meist mit `AIza`) und den Tab offen lassen. **Nicht in den Chat schicken.**
- Geklappt, wenn: der Schlüssel kopiert ist (er braucht ihn in Schritt 6).
- Kostenlos heißt: ein Tageslimit (für ein paar Videos am Tag reicht es), kein Zahlungsmittel nötig.

**Schritt 4: Neue Cloud-Umgebung öffnen**
1. Auf https://claude.ai/code über dem Eingabefeld auf das **Wolken-Symbol mit dem Namen der Umgebung** klicken (z. B. "Default").
2. **Cloud** wählen, dann **Add cloud environment**.
3. Bei **Name** `faber-cut` eintragen. Das Fenster offen lassen.
- Geklappt, wenn: das Fenster "New cloud environment" offen ist und oben `faber-cut` steht.
- Ein Satz zum Warum: Hier steht, was Claude im Internet erreichen darf und was beim Start installiert wird; eine eigene Umgebung lässt seine anderen Projekte in Ruhe.

**Schritt 5: Internet freigeben** (im selben Fenster)
1. Bei **Network access** **Custom** wählen.
2. In **Allowed domains** diese Zeilen einfügen:
   ```
   huggingface.co
   *.huggingface.co
   *.hf.co
   download.pytorch.org
   drive.google.com
   drive.usercontent.google.com
   ```
3. Den Haken bei **Also include default list of common package managers** setzen.
- Geklappt, wenn: die sechs Zeilen drinstehen und der Haken gesetzt ist.
- Ein Satz zum Warum: Von dort kommen die Sprachmodelle, PyTorch und seine Clips. (Einfacher, aber offener: **Full**.)

**Schritt 6: Schlüssel und Setup eintragen, speichern** (im selben Fenster)
1. Nur mit Gemini: bei **Environment variables** `GEMINI_API_KEY=` schreiben und direkt dahinter den Schlüssel einfügen, ohne Leerzeichen.
2. Bei **Setup script** diesen Text einfügen:
   ```bash
   #!/bin/bash
   apt-get update -qq && apt-get install -y -qq ffmpeg
   for d in /home/user/*/; do
     if [ -f "$d/tools/setup.mjs" ]; then (cd "$d" && npm run setup -- --ohne-modelle) || true; fi
   done
   exit 0
   ```
3. **Create environment** klicken.
- Geklappt, wenn: das Fenster zu ist und `faber-cut` in der Liste der Umgebungen steht.
- Hinweis: Werte unter Environment variables sieht jeder, der diese Umgebung benutzt; in seiner eigenen ist das nur er.

**Schritt 7: Google Drive mit Claude verbinden**
1. https://claude.ai/customize/connectors öffnen.
2. **Google Drive** suchen, **Connect** klicken.
3. Sein Google-Konto wählen und **Zulassen**.
- Geklappt, wenn: Google Drive als verbunden angezeigt wird.

**Danach (ohne Nummer): neue Sitzung starten**
1. Auf claude.ai/code beim Wolken-Symbol die Umgebung `faber-cut` wählen.
2. Eine neue Sitzung mit seinem Repo `faber-cut` starten.
3. Schreiben: "Weiter mit dem Onboarding".
- Ein Satz zum Warum: Umgebung und Verbindungen gelten erst in einer neuen Sitzung.

## Gemini-Schlüssel lokal

Zwei Mini-Schritte, je eine Nachricht.

**Schritt A: Schlüssel erstellen.** Wie Schritt 3 der Klick-Etappe online.

**Schritt B: Schlüssel in die Datei legen**
1. Du legst die Datei `.env` mit der Zeile `GEMINI_API_KEY=` an und öffnest sie ihm (Windows `notepad .env`, Mac `open -e .env`, Linux `xdg-open .env`).
2. Er fügt den Schlüssel direkt hinter `=` ein, ohne Leerzeichen.
3. Speichern (Strg+S bzw. Cmd+S) und das Fenster schließen.
- Geklappt, wenn: `npm run doktor` "Gemini-Schlüssel gültig" zeigt (das prüfst du selbst).
- `.env` ist git-ignoriert und bleibt auf seinem Rechner.
