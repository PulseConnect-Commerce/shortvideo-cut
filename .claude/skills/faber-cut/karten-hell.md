# Helle Karten (Look ab 2026-10-22, alle Formate)

Seine Vorgaben 2026-10-22: "Können wir das auch auf hellem Hintergrund, statt dem schwarzen machen?", "Und ich möchte,
dass wir die motion captures professioneller mit dem motion skill darstellen, nicht immer so stark nach Karikatur
aussehen lassen", "Ich mag den Style mit dem markierten zweiten Teil des Titels. Dann mache den Titel besser
zweifarbig. Und das farbige Wort kann dabei gerne eine Verlauf farbe von grün nach hellblau sein, wie unser
PulseConnect Design", "Lass uns die nächsten nun erst einmal alle mit weißem oder hellgrauen Hintergrund erstellen".

Vorlage: `hyperframes/look-probe/index.html` (kopieren, Hintergrundbild `#bg` entfernen, Zeiten aus `cut.json`).

**Karte**
- Weiß oder Hellgrau (`rgba(255,255,255,0.96)` bzw. `#F2F3F5`), Radius 36 px, weicher Schatten
  (`0 24px 60px rgb(0 0 0 / .22)`), über dem Kopf (x 110-970, y ~300-600), nichts in den Tabu-Zonen.
- Links eine Icon-Kachel (176 px, Radius 32) im **PulseConnect-Verlauf** `linear-gradient(135deg, #00E090, #31ADEC)`,
  darin ein sauberes Linien-Icon in Tinte `#0B0C0E` (Lucide, ISC-Lizenz, gleichmäßige Strichstärke).
  **Keine** Kreide- oder Handzeichnungen, keine wackligen Pfade, keine Comic-Figuren.
- Rechts der Text in **Geist**: kleine Zeile (Kicker, 30 px, Versalien, grau `#6B7280`), dann der **Titel zweifarbig**:
  erster Teil dunkel (`#0B0C0E`, 800, 76 px), zweiter Teil (das Schlüsselwort) als Textverlauf
  `linear-gradient(90deg, #00D088, #31ADEC)` mit `background-clip: text`. Höchstens eine Unterzeile (34 px, `#374151`).
- Eine Karte erscheint erst mit ihrem Inhalt (keine leere Karte), höchstens ein Gedanke je Karte. **Kicker und Titel
  kommen gemeinsam mit der Karte** (Zeilenversatz höchstens 0,07 s), nie Karte mit Kicker und Icon und der Titel erst
  Sekunden später auf seinem Wort (DHL 2026-10-22: 24,5-26,0 / 27,4-29,4 / 44,6-46,2 s fast leer). Die Karte kommt
  stattdessen auf das Wort des Titels.
- Helligkeit: Ist die Rohaufnahme hell (Gesicht im Bericht > 0,60), mit `npm run farbe` nachziehen, bevor gerendert
  wird; Ziel 0,55-0,57 (DHL 2026-10-22 lag bei 0,687).

**Bewegung** (Motion-Skill, `.claude/skills/motion/best-practices/index.md`: kurz, kein Überschwingen, jede Bewegung
zeigt eine Änderung)
- Karte rein: `opacity 0→1, y 28→0, scale .98→1`, 0,45 s `expo.out`; Kachel `scale .85→1` 0,5 s `power3.out`.
- Icon zeichnet sich auf seinem Wort (0,6 s, `power2.inOut`, versetzt 0,08 s); Pfade erst sichtbar, wenn sie ein Stück
  gezeichnet sind (kein Punkt am Zeichenstart).
- Zeilen versetzt (`y 14→0`, 0,35 s, 0,07 s Abstand); Zahlen dürfen hochzählen.
- Raus: 0,25 s `opacity`, `y -10`, `power2.in`. Kein Wackeln, kein Hüpfen, kein Pop, kein `back`/`elastic`.

**Farbe im ganzen Video:** der PulseConnect-Verlauf Grün → Hellblau ersetzt die eine Leuchtfarbe je Format. Betonte
Untertitel und der farbige Teil des Hook-Titels in `#00E090` oder im selben Verlauf; keine weitere Akzentfarbe
(nicht #CCFF00, nicht #40E8E0).
