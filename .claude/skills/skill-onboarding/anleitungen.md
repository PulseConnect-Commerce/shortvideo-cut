# Anleitungen zum Onboarding

Klickpfade und Befehle, die du dem Nutzer Schritt für Schritt weitergibst. Gib immer nur den Teil weiter, der gerade dran ist, und sag dazu, woran er erkennt, dass es geklappt hat. Die Oberflächen von Google, GitHub und Claude ändern sich manchmal: Sieht etwas bei ihm anders aus, frag, was er sieht, und hilf von dort aus weiter.

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

## Cloud-Umgebung (online)

Eine Cloud-Umgebung legt fest, was eine Claude-Sitzung im Internet erreichen darf und was beim Start installiert wird. Am besten eine eigene Umgebung nur für faber-cut, damit seine anderen Projekte unberührt bleiben.

1. Auf https://claude.ai/code über dem Eingabefeld auf das **Wolken-Symbol mit dem Namen der Umgebung** klicken (z. B. "Default").
2. **Cloud** wählen, dann **Add cloud environment**. Eine bestehende Umgebung ändert er mit dem Zahnrad, das beim Drüberfahren rechts erscheint.
3. **Name:** `faber-cut`
4. **Network access:** **Custom** wählen. Unter **Allowed domains** diese Zeilen eintragen (jede in eine eigene Zeile):
   ```
   huggingface.co
   *.huggingface.co
   *.hf.co
   download.pytorch.org
   drive.google.com
   drive.usercontent.google.com
   ```
   Den Haken bei **Also include default list of common package managers** setzen.
   - Warum: Die Modelle für die Transkription kommen von Hugging Face, PyTorch von pytorch.org, die Clips aus Google Drive.
   - Einfacher, aber offener: **Full** (alles erlaubt).
5. **Environment variables** (nur wenn er Gemini will): eine Zeile `GEMINI_API_KEY=` und direkt dahinter seinen Schlüssel, ohne Leerzeichen.
   - Hinweis für ihn: Werte hier kann jeder sehen, der diese Umgebung benutzt. In seiner eigenen Umgebung ist das nur er.
6. **Setup script:** diesen Text einfügen:
   ```bash
   #!/bin/bash
   apt-get update -qq && apt-get install -y -qq ffmpeg
   for d in /home/user/*/; do
     if [ -f "$d/tools/setup.mjs" ]; then (cd "$d" && npm run setup -- --ohne-modelle) || true; fi
   done
   exit 0
   ```
   - Das installiert ffmpeg und, wenn das Repo schon da ist, die Python-Umgebung.
   - Die Umgebung merkt sich das Ergebnis etwa eine Woche lang, dann starten neue Sitzungen schneller.
   - Die Modelle lädt die Sitzung selbst (`npm run setup`).
7. **Create environment** (oder **Save changes**) klicken.
8. Für neue Sitzungen diese Umgebung auswählen (Wolken-Symbol, dann `faber-cut`). Änderungen an Umgebung und Connectors gelten erst in einer **neuen** Sitzung.

## Google Drive verbinden (online)

1. https://claude.ai/customize/connectors öffnen.
2. **Google Drive** suchen, **Connect** klicken.
3. Sein Google-Konto wählen und den Zugriff erlauben.
4. **Geklappt, wenn** Google Drive als verbunden angezeigt wird.
5. Erst eine **neue** Sitzung sieht den Connector.

## Google-Drive-Ordner (online)

1. https://drive.google.com öffnen (oder die Google-Drive-App am Handy).
2. **Neu** → **Neuer Ordner**, Name: `faber-cut Rohclips` → **Erstellen**.
3. Rechtsklick auf den Ordner → **Teilen** → **Teilen**. In der App: die drei Punkte am Ordner → **Teilen** bzw. **Zugriff verwalten**.
4. Unten bei **Allgemeiner Zugriff** von **Eingeschränkt** auf **Jeder, der über den Link verfügt** umstellen. Die Rolle rechts bleibt **Betrachter**. Dann **Fertig**.
   - Auf Englisch heißt das: **General access** → **Anyone with the link**, **Viewer**, **Done**.
5. **Geklappt, wenn** beim Ordner "Jeder, der über den Link verfügt, kann ansehen" steht.
6. Warum: Der Drive-Connector kann nur kleine Dateien lesen. Videos lädt Claude in voller Größe über den Freigabe-Link. Ohne diese Freigabe kommt statt des Videos nur eine kleine Fehlerseite an.
7. Sicherheit: Wer den Link kennt, kann die Clips ansehen. Den Link gibt er niemandem, und fertige Clips kann er löschen.
8. **Hochladen vom Handy:** Drive-App → Ordner öffnen → **+** → **Hochladen** → Video wählen. Kurz warten, bis es fertig ist (am besten im WLAN).

## Gemini-Schlüssel

1. https://aistudio.google.com/apikey öffnen und mit seinem Google-Konto anmelden.
2. Beim ersten Mal die Nutzungsbedingungen bestätigen.
3. **API-Schlüssel erstellen** bzw. **Create API key** klicken. Fragt AI Studio nach einem Projekt: das vorgeschlagene nehmen oder ein neues anlegen.
4. Den Schlüssel kopieren: eine lange Zeichenfolge, meist beginnend mit `AIza`. **Nicht in den Chat schicken.**
5. Wohin damit:
   - **Lokal:** Claude legt die Datei `.env` an und öffnet sie (Windows `notepad .env`, Mac `open -e .env`, Linux `xdg-open .env`). Er fügt den Schlüssel direkt hinter `GEMINI_API_KEY=` ein, ohne Leerzeichen, speichert (Strg+S bzw. Cmd+S) und schließt das Fenster.
   - **Online:** in der Cloud-Umgebung unter **Environment variables** als `GEMINI_API_KEY=<schlüssel>` (siehe Cloud-Umgebung, Schritt 5), dann eine neue Sitzung.
6. Kostenlos heißt: ein Tageslimit an Anfragen (für ein paar Videos am Tag reicht es), und Google darf die Inhalte zur Verbesserung seiner Dienste nutzen. Ein Zahlungsmittel muss er dafür nicht hinterlegen.
7. **Geklappt, wenn** `npm run doktor` "Gemini-Schlüssel gültig" zeigt.
