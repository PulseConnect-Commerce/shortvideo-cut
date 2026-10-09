---
name: format-onboarding
description: Richtet ein neues Videoformat von PulseConnect (z. B. FACE oder NEWS/Reaction) Schritt für Schritt ein, ausgehend vom ersten Stil HERO - zeigt kurz, was HERO macht, fragt nur, was im neuen Format anders sein soll (mit Standbildern aus seinem echten Clip zur Auswahl), und schreibt daraus den Skill stil-<format>. Verwende diesen Skill, wenn ein Format zum ersten Mal geschnitten wird und sein Stil noch nicht festgelegt ist (stil-face oder stil-news sagen "noch nicht festgelegt"), oder wenn der Nutzer "neues Format", "Stil für FACE/NEWS festlegen", "Stilabgleich" oder "Format-Onboarding" sagt.
---

# Format-Onboarding: ein neues Format anhand von HERO

Der erste Stil ist **HERO** (`.claude/skills/stil-hero/SKILL.md`), festgelegt an zwei fertigen Videos. Ein neues
Format fängt nicht bei null an: Es übernimmt HERO und ändert nur, was er anders haben will ("hier können wir auch
gleich einmal ein neues Onboarding erstellen anhand des ersten Stils", 2026-10-09). Er will die Formate bewusst
nicht gleich schneiden lassen; jedes bekommt am Ende einen eigenen Skill `stil-<format>`.

Grundsätze wie im Onboarding (`skill-onboarding`): Entscheidungen mit **AskUserQuestion** (2-4 Optionen, deine
Empfehlung zuerst mit "(Empfohlen)"), kurz, in seiner Sprache, Schritt für Schritt. Wo es ums Aussehen geht, zeigst
du **Standbilder aus seinem echten Clip** (SendUserFile) statt es zu beschreiben. Nie mehr als 4 Fragen auf einmal.

## 0. Lage (ohne zu fragen)

- Welches Format? (FACE, NEWS/Reaction oder ein neues; der Name kommt in Großbuchstaben.)
- Den ersten Clip dieses Formats im Hintergrund laden und vorbereiten (faber-cut, Schritt 1), damit die Standbilder
  sein Bild zeigen. Währenddessen fragen.
- `stil-hero` lesen: Das ist der Ausgangspunkt jeder Frage.

## 1. Ausgangspunkt zeigen (Text, keine Frage)

HERO in Stichworten, so wie es gerade in `stil-hero` steht, z. B.:

- Bild ab der Hüfte (keine Hose), leichter Porträt-Modus, ein langsames Zoom-in mit 3-4 kleinen Akzenten
- Hook oben als Balken (der Stil wechselt von Video zu Video, er wählt aus Varianten)
- Untertitel Wort für Wort, das gesprochene Wort blau
- Bildkarten mit Fotos über dem Kopf, alle 1,5-2 s etwas Neues
- Farben: Blau, PulseConnect-Grün, Rot für Warnungen
- Pausen ab 0,2 s raus, leise Effekte, keine Musik
- Am Ende "Video speichern" mit gelbem Lesezeichen

Dazu ein Satz: "Alles, was du nicht änderst, übernehme ich so."

## 2. Was ist anders? (eine Frage, Mehrfachauswahl)

"Was soll bei <FORMAT> anders sein als bei HERO?" mit `multiSelect: true` und genau diesen vier Gruppen:

- **Text im Bild:** Hook-Einblendung und Untertitel
- **Grafiken:** Bildkarten über dem Kopf, Menge und Art
- **Schnitt & Bewegung:** Tempo, Zooms, Länge
- **Look & Ende:** Porträt-Modus, Farben, Aufruf am Ende

Wählt er nichts aus (oder "wie HERO"), übernimm HERO ganz und geh zu Schritt 4.

## 3. Nur die gewählten Gruppen nachfragen

Pro gewählter Gruppe 1-2 Fragen, zusammen höchstens 4 pro Runde. Jede Frage hat **"wie HERO"** als eine Option und
1-2 echte Alternativen. Vorher die Standbilder schicken (z. B. `--props` mit einer Variante pro Bild,
nebeneinander mit Beschriftung A/B/C, wie bei den Hook-Stilen in `stil-hero`).

| Gruppe | Fragen und Alternativen |
| --- | --- |
| Text im Bild | Hook: Stil aus `HOOK_STILE` (Bild mit 3-4 Varianten) oder groß über die ganze Breite; Untertitel: wie HERO / größer und mittig auf Brusthöhe / keine |
| Grafiken | wie HERO / weniger: nur 3-5 Schlagworte groß auf den wichtigsten Wörtern / keine (nur Gesicht) |
| Schnitt & Bewegung | Tempo: wie HERO 0,2 s / ruhiger 0,4 s; Zoom: wie HERO ruhig / Punch-ins auf Betonungen und Schnitten / keiner |
| Look & Ende | Porträt: wie HERO / stärker / aus; Farben: wie HERO / eigene Akzentfarbe; Ende: wie sein Skript es sagt (speichern, kommentieren, folgen) |

Was er dazu frei schreibt ("Other"), gilt wörtlich.

## 4. Den Stil festhalten

1. **`.claude/skills/stil-<format>/SKILL.md` neu schreiben** mit denselben Abschnitten wie `stil-hero` (Bild, Hook,
   Untertitel, B-Roll, Farben, Schnitt und Ton, Aufruf und Ende, Arbeitsweise, Notizen). Was gleich bleibt, steht
   dort als "wie HERO" mit dem Wert, damit der Skill für sich allein lesbar ist. Seine Antworten mit Satz und Datum
   unter "Notizen". Die `description` oben beschreibt den Stil kurz (nicht mehr "noch nicht festgelegt").
2. **`.claude/skills/faber-cut/stil.md`:** In der Tabelle Zweck und Stand des Formats eintragen ("festgelegt",
   Vorlage: das erste Projekt).
3. **Technik:** `src/lib/stil.ts` enthält die HERO-Werte und bleibt so. Weichen Zahlen ab, kommen sie getrennt in
   `src/lib/stil-<format>.ts` (oder als Prop an den Baustein), umschaltbar pro Projekt. Danach `npm run typecheck`
   und ein Standbild aus einem HERO-Projekt, das unverändert aussehen muss.
4. Committen und pushen (wie `faber-cut.json` unter `speichern` sagt).

## 5. Erstes Video und Nachschärfen

Dann das erste Video mit faber-cut schneiden. Nach der ersten Vorschau fragen: "Was soll bei <FORMAT> noch anders
sein?" und jede Antwort in `stil-<format>` eintragen. Nach dem zweiten Video gilt das Format als festgelegt.
