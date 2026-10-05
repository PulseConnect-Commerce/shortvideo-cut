# Anleitungen zum Onboarding

Klickpfade und Befehle, die du dem Nutzer Schritt für Schritt weitergibst. Gib immer nur einen Mini-Schritt weiter (höchstens drei Handgriffe; einzige Ausnahme ist die Cloud-Umgebung, weil der Chat gesperrt ist, solange ihr Fenster offen ist), vollständig ausgeschrieben als letzte Nachricht deiner Antwort, ohne Werkzeug danach, und warte auf sein "erledigt" (SKILL.md, "So sieht jeder Klick-Schritt aus"). Die Oberflächen von Google, GitHub und Claude ändern sich manchmal: Sieht etwas bei ihm anders aus, frag, was er sieht, und hilf von dort aus weiter.

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

Normalerweise legt Claude die Kopie selbst an oder holt faber-cut als Ordner in sein Repo (SKILL.md, 3O.1). Diese Blöcke nur, wenn er es selbst machen will oder es nicht anders geht. Wie die Klick-Etappe: wörtlich, als letzte Nachricht, ohne Werkzeug danach.

---

**Deine eigene Kopie von faber-cut anlegen**

1. Öffne https://github.com/TobiB1505/faber-cut (vorher bei GitHub anmelden oder kostenlos registrieren).
2. Klick oben rechts auf **Fork**, dann auf **Create fork**. Soll es privat sein: stattdessen https://github.com/new/import öffnen, `https://github.com/TobiB1505/faber-cut` eintragen, einen Namen geben und **Private** wählen.
3. Warte, bis die Seite deine Kopie zeigt.

✅ Geklappt, wenn: oben links `<dein-name>/faber-cut` (oder dein gewählter Name) steht.
Warum: In deiner eigenen Kopie kann ich deinen Stil und deine Projekte speichern. Ein Fork ist öffentlich (deine Schnitt-Texte und dein Stil sind sichtbar, keine Videos); ein Import kann privat sein.

Schreib **erledigt** und den Namen deiner Kopie.

---

**Sitzung mit deiner Kopie starten** (nur, wenn Claude die Kopie nicht selbst zu dieser Sitzung hinzufügen kann)

1. Klick auf https://claude.ai/code links oben auf **Neu** (englisch: **New session**).
2. Wähl über dem Eingabefeld bei der Repo-Auswahl deine Kopie `<dein-name>/faber-cut`.
3. Schreib dort: **"Richte faber-cut für mich ein."**

✅ Geklappt, wenn: die neue Sitzung läuft und oben deine Kopie steht.
Warum: Nur in einer Sitzung mit deinem eigenen Repo kann ich deinen Stil und deine Projekte speichern. Es ist noch nichts eingerichtet, also geht nichts verloren.

---

## Klick-Etappe online

Jeder Block unten ist **eine** Antwort an ihn: wörtlich abschreiben, "von N" durch die echte Zahl ersetzen (4 mit Gemini, 3 ohne; ohne Gemini fällt der Gemini-Block weg, die Zeile mit dem Schlüssel in Schritt 4 auch, und "Schritt 4" wird "Schritt 3"), als **letzte Nachricht**, ohne Werkzeug danach (SKILL.md, "So sieht jeder Klick-Schritt aus"). Alles passiert in der laufenden Sitzung, ohne Neustart.

---

**Schritt 1 von N: Ordner für deine Clips anlegen**

1. Öffne https://drive.google.com (oder die Google-Drive-App am Handy).
2. Klick auf **Neu** → **Neuer Ordner** (englisch: **New** → **New folder**).
3. Gib als Namen `faber-cut Rohclips` ein und klick auf **Erstellen**.

✅ Geklappt, wenn: der Ordner `faber-cut Rohclips` in deiner Liste steht.
Warum: Hier lädst du später deine Clips vom Handy hoch, und ich hole sie mir von dort.

Schreib **erledigt**, wenn du fertig bist, oder was du siehst, wenn es hängt.

---

**Schritt 2 von N: Ordner freigeben und mir den Link schicken**

1. Rechtsklick auf den Ordner → **Teilen** → **Teilen** (am Handy: die drei Punkte am Ordner → **Teilen**).
2. Unten bei **Allgemeiner Zugriff** von **Eingeschränkt** auf **Jeder, der über den Link verfügt** umstellen (englisch: **General access** → **Anyone with the link**). Die Rolle bleibt **Betrachter**.
3. Klick auf **Link kopieren**, dann auf **Fertig**, und füg den Link hier in den Chat ein.

✅ Geklappt, wenn: beim Ordner "Jeder, der über den Link verfügt" steht und der Link hier im Chat ist.
Warum: Über diesen Link finde und lade ich deine Clips in voller Größe, ohne dass du Drive extra mit Claude verbinden musst. Der Link ist kein Passwort; die Clips sieht nur, wer den Link hat.

Schick mir den Link, oder schreib, was du siehst, wenn es hängt.

---

**Schritt 3 von N: Gemini-Schlüssel holen** (nur mit Gemini)

1. Öffne https://aistudio.google.com/apikey und melde dich mit deinem Google-Konto an (beim ersten Mal die Bedingungen bestätigen).
2. Klick auf **API-Schlüssel erstellen** (englisch: **Create API key**). Fragt es nach einem Projekt: das vorgeschlagene nehmen.
3. Kopier den Schlüssel (er beginnt meist mit `AIza`) und lass den Tab offen. **Schick ihn nicht hier in den Chat**, du trägst ihn gleich im nächsten Schritt ein.

✅ Geklappt, wenn: der Schlüssel kopiert ist.
Warum: Mit dem Schlüssel schaut sich Gemini jede Vorschau an und gibt dir eine zweite Meinung. Kostenlos heißt: ein Tageslimit (für ein paar Videos am Tag reicht es), kein Zahlungsmittel nötig.

Schreib **erledigt**, wenn du fertig bist, oder was du siehst, wenn es hängt.

---

**Schritt 4 von N: Die Cloud-Umgebung einstellen** (alles in einem Fenster)

Lies den Schritt einmal ganz durch, bevor du anfängst: Solange das Fenster offen ist, kannst du hier im Chat nicht schreiben. Mach darum alles auf einmal, speichere, und schreib danach **erledigt**.

1. Klick oben links auf den kleinen Pfeil **⌄** neben dem Namen dieser Sitzung und dann auf **Cloud-Umgebung bearbeiten**.
2. Stell bei **Network access** (Netzwerkzugriff) auf **Full**.
3. Nur mit Gemini: Schreib bei **Environment variables** (Umgebungsvariablen) `GEMINI_API_KEY=` und füg direkt dahinter deinen Schlüssel aus Schritt 3 ein, ohne Leerzeichen.
4. Füg bei **Setup script** (Setup-Skript) diesen Text ein (steht schon etwas drin: darunter anhängen):
   ```bash
   #!/bin/bash
   apt-get update -qq && apt-get install -y -qq ffmpeg
   for f in /home/user/*/tools/setup.mjs /home/user/*/faber-cut/tools/setup.mjs; do
     d="${f%/tools/setup.mjs}"
     if [ -f "$f" ] && grep -q '"name": "faber-cut"' "$d/package.json"; then (cd "$d" && npm run setup -- --ohne-modelle) || true; fi
   done
   exit 0
   ```
5. Klick auf **Speichern** (Save). Das Fenster geht zu.

Lieber nicht das ganze Internet freigeben? Dann stell in Punkt 2 statt Full auf **Custom**, füg bei **Allowed domains** diese Zeilen ein und lass den Haken bei **Also include default list of common package managers** gesetzt:
```
huggingface.co
*.huggingface.co
*.hf.co
download.pytorch.org
drive.google.com
drive.usercontent.google.com
```

✅ Geklappt, wenn: das Fenster nach dem Speichern zu ist und du wieder hier im Chat schreiben kannst.
Warum: Die normale Cloud-Umgebung sperrt die Seiten, von denen faber-cut die Sprachmodelle, PyTorch und deine Clips holt. Full öffnet sie mit einem Klick (ich darf in dieser Umgebung dann jede Seite aufrufen), Custom nur genau diese. Die Freigabe gilt nach etwa einer Minute auch für diese Sitzung, ohne Neustart. Das Setup-Skript macht künftige Sitzungen schneller. Den Gemini-Schlüssel bekomme ich erst beim nächsten Start der Sitzung; bis dahin prüfe ich ohne Gemini. Was unter Environment variables steht, sieht jeder, der diese Umgebung benutzt; in deiner eigenen bist das nur du.

Schreib **erledigt**, wenn du gespeichert hast, dann prüfe ich die Verbindung und installiere. Hängt es irgendwo, schreib, was du siehst.

## Gemini-Schlüssel lokal

Zwei Mini-Schritte, je eine Nachricht.

**Schritt A: Schlüssel erstellen.** Wie Schritt 3 der Klick-Etappe online.

**Schritt B: Schlüssel in die Datei legen**
1. Du legst die Datei `.env` mit der Zeile `GEMINI_API_KEY=` an und öffnest sie ihm (Windows `notepad .env`, Mac `open -e .env`, Linux `xdg-open .env`).
2. Er fügt den Schlüssel direkt hinter `=` ein, ohne Leerzeichen.
3. Speichern (Strg+S bzw. Cmd+S) und das Fenster schließen.
- Geklappt, wenn: `npm run doktor` "Gemini-Schlüssel gültig" zeigt (das prüfst du selbst).
- `.env` ist git-ignoriert und bleibt auf seinem Rechner.
