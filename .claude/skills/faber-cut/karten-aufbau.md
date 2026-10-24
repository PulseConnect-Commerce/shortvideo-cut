# Aufbau-Karten und Pill-Untertitel (Probe nach Pauls Referenz, 2026-10-24)

Status: **PROBE**, zuerst in A02 Clarity. Erst nach Pauls OK in die Stil-Skills übernehmen.

Paul (2026-10-24) schickte ein Referenzvideo (deutscher Creator erklärt „Claude Duet“) und fragte: "Kriegst du die
Motion Captions so eingeblendet, wie im Referenzvideo? Die Farben sollen natürlich immer noch meinem CI entsprechen,
wie wir es in den Stilen definiert haben. Aber es geht mir hier um die Animationen und Erklärungen durch die Captions".

Es geht also um **Bewegung und Erklärlogik**, nicht um Farben. Die Farben bleiben wie in `karten-hell.md`: helle Karte,
PulseConnect-Verlauf #00D088/#00E090 → #31ADEC, Lucide-Icons, Geist.

## Was das Referenzvideo anders macht als unsere bisherigen Karten

Bisher: **eine Karte pro Aussage**. Kicker, Titel und Icon kommen zusammen, und die nächste Karte ersetzt sie.

Referenz: **eine Karte pro Gedanke, die sich Wort für Wort aufbaut.** Sie bleibt 5–12 s stehen. Was er sagt, kommt
genau auf dem gesprochenen Wort dazu oder ändert seinen Zustand. So erklärt die Karte mit, statt nur zu betiteln.

## Bausteine

1. **Aufbau-Karte**
   - Breite helle Karte, etwa 1000 × 260–300 px, auf Brusthöhe unter dem Kinn. Gesicht bleibt frei.
   - Oben links ein kleiner Kicker in Versalien, grau und gesperrt, z. B. „ASSISTENTEN, DIE SICH SELBST MELDEN“. Er
     nennt das Thema des Gedankens.
   - Die Karte kommt leer mit dem Kicker herein. Kurz danach fliegt das erste Element ein. Leere Karten nie länger als
     ~0,3 s.
   - Raus geht die Karte weich mit Blur und Fade. Danach kommt eine neue Karte mit neuem Kicker.

2. **Kacheln, die nacheinander dazukommen**
   - Eine Kachel ist ein kleines weißes Quadrat (~150 px) mit Icon, Label darunter und optional einer Mini-Unterzeile.
   - Jede Kachel kommt **auf ihrem Wort** (Wortzeit aus `cut.json`) mit Scale 0.9→1 und Fade, ~0,3 s, ohne
     Überschwingen.
   - Ein Platzhalter „?“ als gestrichelte Kachel, die später durch die Auflösung ersetzt wird, z. B. Anthropic.

3. **Zustandswechsel auf dem Wort**
   - Häkchen-Badge „✓ schon da“ an früheren Kacheln.
   - Rotes ✕ oben rechts an einer Kachel („nicht in Deutschland“), grünes ✓ an der anderen.
   - Durchstreichen mit einer Linie, die sich über die Kachel zeichnet.
   - „=“ zwischen Kacheln, wenn er sagt „alle gleich“.
   - Stempel „NEIN“ schräg auf einer Kachel. Ein „OK“ wird durchgestrichen.

4. **Mini-Diagramme in der Karte**
   - Fluss: Icon → Uhr → Linie, die sich zeichnet und sich zu 2–3 Ziel-Pillen verzweigt (Mail, Kalender, Apps).
   - Linienchart, der sich zeichnet. Flaggen. Ein Mauszeiger, der eine Option anklickt.

5. **Schlusszeile in der Karte**
   - Unten in der Karte ein kurzer Satz, z. B. „Alle machen *das Gleiche*.“ Die Schlüsselwörter stehen im Verlauf.

6. **Sticker-Wort**
   - Ein einzelnes Wort als schräger Sticker oben rechts neben dem Kopf, z. B. „NUR USA“, „EGAL.“, „HEUTE.“
   - Weiße Fläche, schwarze Schrift, ~4° gedreht, Pop-in.
   - Sparsam: höchstens 3 pro Video, nur für Pointen.

7. **Umfrage-Karte als CTA am Ende**
   - Frage als Titel, z. B. „Würdest du so was nutzen?“
   - Zwei Optionen kommen auf ihren Worten: ✓ Ja / ✕ Nein. Ein Mauszeiger fährt hin.

8. **Pill-Untertitel**
   - Kurze Phrasen von 2–4 Wörtern in einer dunklen, abgerundeten Pille (rgba(10,12,14,0.82), Geist 700, ~44 px,
     weiß).
   - Das gerade gesprochene Wort leuchtet im PulseConnect-Grün #00E090 (statt Orange wie in der Referenz).
   - Position direkt über der Karte, ohne Karte etwa auf Brusthöhe.
   - Bei Split-Screen sitzt die Pille auf der Naht.

9. **Split-Screen mit Quelle (NEWS)**
   - Oben ~40 % die echte Quelle (Video oder Screenshot), darüber ein kleines Label „MARKE · OFFIZIELLES VIDEO“, unten
     er. Die Untertitel-Pille sitzt auf der Naht.
   - Nur mit echtem Material, nie erfundene Oberflächen.

## Regeln

- Bewegung bleibt ruhig nach dem Motion-Skill: kurze Ein- und Ausblendungen, kein Überschwingen, jede Bewegung zeigt
  eine Änderung.
- Jede Ergänzung oder jeder Zustandswechsel sitzt auf dem Frame des gesprochenen Worts.
- SFX: leiser Tick (0.10) pro Kachel, Whoosh (0.12) nur beim Kartenwechsel. Abstände ≥ 1,5 s gelten für Whooshes, nicht
  für Ticks.
- Eine Karte erklärt einen Gedanken: höchstens 4–5 Elemente. Danach kommt eine neue Karte.
