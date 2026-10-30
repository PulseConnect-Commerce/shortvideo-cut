# Helle Karten (Look ab 2026-10-22, alle Formate)

Seine Vorgaben 2026-10-22: "Können wir das auch auf hellem Hintergrund, statt dem schwarzen machen?", "Und ich möchte,
dass wir die motion captures professioneller mit dem motion skill darstellen, nicht immer so stark nach Karikatur
aussehen lassen", "Ich mag den Style mit dem markierten zweiten Teil des Titels. Dann mache den Titel besser
zweifarbig. Und das farbige Wort kann dabei gerne eine Verlauf farbe von grün nach hellblau sein, wie unser
PulseConnect Design", "Lass uns die nächsten nun erst einmal alle mit weißem oder hellgrauen Hintergrund erstellen".

Vorlage: `hyperframes/look-probe/index.html` (kopieren, Hintergrundbild `#bg` entfernen, Zeiten aus `cut.json`).

**Karte**
- **Schlank und hoch über dem Kopf** (seine Frage 2026-10-23: "Können die Captioneinblendungen nicht etwas höher über dem Kopf gesetzt werden"): top 285 (Tabu oben bis 280), Höhe 240, Kachel 150, Titel 66 px, damit zwischen Karte und Haar Luft bleibt.
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

**In jedem Video** (seine Vorgabe 2026-10-23: "Ich möchte gerne in jedem Videos Motion Captures bzw. hyperframes
verwenden, und auch wenn es passt b-roll Aufnahmen von meinen älteren Videos oder Videos auf die ich reagieren
einblenden. Es soll die Erzählung spannender und visueller darstellen"):
- Zu jeder Aussage eine HyperFrames-Karte bzw. Animation (Motion-Grafik), nicht nur am Anfang.
- **B-Roll aus seinen älteren Videos NUR ohne eingebrannte alte Grafiken** (seine Rüge 2026-10-23 zu P01: "Weshalb ist in dem Video ein Ausschnitt aus einem älteren Video von mir eingeblendet worden? … Titel ist in grün in der Hook, Motion captions im Farbverlauf und dann ein Ausschnitt der alten [Hook] in hellgrün"): kein alter Hook-Titel, keine alten Karten, keine alten Untertitel, keine fremde Leuchtfarbe im Ausschnitt; im Zweifel den Rohclip bzw. den Take ohne Overlays nehmen oder ganz weglassen. Nur wenn es inhaltlich wirklich passt (gleiches Thema), sonst keine B-Roll. Die Prüfung schaut jeden Ausschnitt als Standbild an.
**Was eine B-Roll ist** (seine Klarstellung 2026-10-23: "Ein B-Roll ist ja eigentlich ein kompletter Ausschnitt eines
alten Videos, welches nur in klein dargestellt wird, kein kleiner Ausschnitt aus einem Videos"): das **ganze Bild**
des alten Videos (9:16, nichts beschnitten), **verkleinert** als Bild-im-Bild, z. B. ~300x533 px in einer hellen Karte
mit Radius und Schatten, über dem Kopf oder seitlich neben dem Kopf (nicht in den Tabu-Zonen, nie über Augen/Mund),
mit kleiner Zeile "Aus meinem Video: <Titel>". Kein Streifen, kein Crop auf den alten Hook-Titel. Zeitlich eine
zusammenhängende Szene (2-4 s), stumm. Weil es erkennbar ein Zitat des alten Videos ist, dürfen dessen alte Grafiken
im kleinen Bild zu sehen sein, aber nie groß als Streifen über dem Kopf.
- Wenn das passt: B-Roll aus seinen älteren Videos, wenn er über früher, seine Agentur, Shopify, ein früheres Thema spricht:
  fertige Videos in `out/final/*.mp4` (oder im Drive-Ordner "Final geschnittene Videos"). Kurzer Ausschnitt
  (1,5-3 s), stumm, in einer hellen Karte über dem Kopf oder als Bild-im-Bild, nie über Augen und Mund.
- **Reaction/NEWS:** das Video oder der Artikel, auf den er reagiert, als Ausschnitt in der Karte (Quelle nennen).
- Abwechseln: Karte, Zahl, Ausschnitt; nie zwei gleiche Kartentypen direkt hintereinander, wenn es anders geht.

**Soundeffekte** (seine Vorgabe 2026-10-23: "es fehlen noch die kurzen Soundeffekte bei Szenenwechsel,
Abschnittswechesel, Einblenden, usw. Es soll dabei aber nicht zu übertrieben aussehen"): `<Sfx>` aus
`src/lib/bausteine.tsx`, Dateien in `public/sfx/`, auf den Frame der Bewegung gelegt.
- Karte erscheint: `whoosh.mp3` leise (Volume ~0,10-0,14); Icon/Häkchen fertig: `tick.mp3` (~0,10).
- Neuer Abschnitt / Szenenwechsel / B-Roll-Ausschnitt rein: `wusch-gross.mp3` oder `whoosh.mp3` (~0,14).
- Zahl zählt hoch oder Kernaussage: `pop.mp3` oder `success.mp3` (~0,10), höchstens 2-3 Mal im Video.
- Nie `impact`, `riser`, `stamp`, `glitzer` im hellen Look (zu laut, zu verspielt). Kein Effekt auf jedem Wort;
  mindestens 1,5 s Abstand zwischen zwei Effekten; Effekte immer leiser als die Stimme (checks --stems).

**Hook-Titel nur, wenn er etwas bringt** (seine Vorgabe 2026-10-25: "können wir mal versuchen nicht in jedem Video eine Hook als Titel mit anzuzeigen? Eine Hook würde zum Beispiel am meisten dann Sinn machen, wenn wir z.B. einen Markennamen verwenden. Oder gerade beim ehrlichen Video 2 … ohne Hook im Titel"): Hook-Titel einblenden bei **Markennamen** (REWE, Amazon, waterdrop, Shopify …), **News** und **einer starken Zahl**; **weglassen** bei persönlichen, ehrlichen Videos (Story, Meinung) und wenn der gesprochene erste Satz allein trägt. Im Zweifel den Cutter entscheiden lassen und es in der Übergabekarte begründen.

**Erklärvideos bekommen immer einen kurzen Hook-Titel** (seine Vorgabe 2026-10-30 zu E08: "Mir fehlt hier leider eine Titel-Hook über meinem Kopf zu Beginn. Einfach nur kurz und prägnant. \"Unterschied zwischen Upselling und Cross Selling\""): E-, S- und A-Reihe zeigen während des ersten Satzes das Thema in wenigen Worten (z. B. "UNTERSCHIED ZWISCHEN" / "UPSELLING UND CROSS-SELLING"). "Kein übergroßer Hook-Titel" im Briefing heißt kurz, nicht keiner. Lage: über dem Kopf nur, wenn dort Platz in der sicheren Fläche ist (sie beginnt bei y 280, darüber liegt die Suchleiste von TikTok); im Aufbau mit Kopf oben (Kopfoberkante ~y 315) steht er wie bei E05/E06 direkt unter dem Gesicht an der Kartenposition und ist weg, bevor die erste Karte kommt.

**Hook-Titel** (seine Vorgabe 2026-10-23, Referenz easyJet-Video youtube.com/shorts/DXlUyWNQnzQ: "die Hook in der
Schriftart und Größe machen wie im verlinkten Video von uns … mit der neuen Verlauffarbe, statt dem knalligen
Grünton"): `<DesignRahmen design="verlauf">` (src/lib/design.tsx). Erste Zeile groß, weiß, Anton mit dunkler Kontur
(z. B. "AMAZON BEKOMMT"), zweite Zeile kleiner auf einem Balken im Verlauf #00E090 → #31ADEC mit dunkler Schrift
("KONKURRENZ VON EASYJET!"). Die bekannte Marke gehört in die erste Zeile.
