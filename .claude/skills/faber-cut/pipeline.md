# Pipeline: Cutter → Prüfer → Planer

Seine Vorgabe (2026-10-18): "1. Cutter (Haiku, ggf. Sonnet): Er arbeitet den Schnitt-Ablauf ab und liefert das Video
plus eine Übergabekarte mit Datei, Plattform, Caption-Entwurf und Untertiteltext. 2. Prüfer (Opus): Er prüft gegen eine
Checkliste. [...] Das Ergebnis ist 'freigegeben' oder 'zurück' mit konkreten Mängeln. Es gibt höchstens eine
Korrekturrunde, danach melde ich mich bei dir. 3. Planer (Haiku): Er holt die Termine aus dem Google Kalender, wählt den
Slot und legt den Beitrag in Metricool an."

Gilt für jedes neue Video, wenn er nichts anderes sagt. Die **Hauptsitzung ist die Regie**: sie spricht mit Paul,
startet die drei Rollen als Agenten (Werkzeug `Agent`, `subagent_type` `cutter`, `pruefer`, `planer`; Definitionen in
`.claude/agents/`) und reicht die Ergebnisse weiter. Sie schneidet und prüft nicht selbst, sie entscheidet nur, was
zurückgeht und was Paul sieht.

## Ablauf

0. **Regie bereitet vor:** welche Clips (Drive-Liste oder `eingang/`), Format (stil.md; im Zweifel Paul fragen),
   Projektname, Titel wie im Kalendertermin. Den Briefing-Termin aus dem Google Kalender mit der ganzen Beschreibung als
   Text nach `src/projekte/<projekt>/briefing.md` schreiben (Titel, Datum, Beschreibung; HTML zu Text). Cutter und
   Prüfer lesen das Briefing dort, sie brauchen keinen Kalender.
1. **Cutter** (`cutter`, Modell Haiku; seine Vorgabe 2026-10-23: "Wenn die Qualität des Schnitts mit Haiku genauso
   gut ist, dann können wir auch Heiku zum Schneiden und Publishen verwenden und Sonnet oder maximal Opus Niedrig zur
   QM"). Mit `model: "sonnet"` nur, wenn Haiku beim selben Video scheitert oder der Prüfer zweimal dieselbe Sache
   zurückgibt. Immer nur **ein** Cutter gleichzeitig (Token sparen, keine Porträts im Stau). Der Auftrag nennt: Projekt,
   Clips, Format, Titel, `briefing.md`, Termin (wenn bekannt), Pauls Wünsche aus dem Chat. Er liefert die Vollversion
   `out/final/<Komposition>.mp4` (mit `-post` und `-chat`), die ausgefüllte Übergabekarte
   `src/projekte/<projekt>/uebergabe.md` und den Bericht von `npm run pruefen`.
2. **Prüfer** (`pruefer`, Modell Sonnet; höchstens Opus mit `effort: "low"`) prüft gegen die Prüfliste unten und schreibt das Urteil nach
   `out/pruefung/<Komposition>-urteil.md`: **FREIGEGEBEN** oder **ZURÜCK** mit konkreten Mängeln.
3. **ZURÜCK:** genau eine Korrekturrunde. Der Cutter bekommt die Mängelliste wörtlich und behebt nur diese, der Prüfer
   prüft noch einmal. Ist es danach immer noch ZURÜCK, gibt es keine dritte Runde: die Regie schickt Paul die
   Chat-Fassung mit den offenen Mängeln und fragt, wie es weitergeht.
4. **FREIGEGEBEN:** die Regie schickt Paul die Chat-Fassung (`out/final/<Komposition>-chat.mp4`) mit einem kurzen
   Bericht: Urteil, Messwerte, offene Fragen aus der Karte. **Eingeplant wird erst nach seinem OK** (wie bisher: nichts
   geht ohne sein OK online). Seine Notizen gehen als Mängelliste an den Cutter; ist eine Notiz eine Geschmacksregel,
   trägt die Regie sie in den Skill des Formats ein.
5. **Planer** (`planer`, Modell Haiku) nach Pauls OK: Termin, Drive, Metricool, Kontrolle. Die Regie meldet Paul Termin
   und Links, committet und pusht (`speichern` in `faber-cut.json`).

Für alle Rollen gilt `CLAUDE.md`: Rohclips und Takes bleiben privat (nichts davon hochladen, committen, an einen Dienst
schicken), nie mehr als zwei Renders gleichzeitig, `npm run portrait` nie neben einem anderen Porträt oder Render.
Cutter und Prüfer sprechen nicht mit Paul: Fragen kommen in die Karte bzw. ins Urteil, die Regie stellt sie.

## Übergabekarte

`npm run uebergabe -- <projekt> <Komposition> --format news|face|hero --titel "<Titel>"` legt
`src/projekte/<projekt>/uebergabe.md` an; der technische Block (Datei, Länge, Auflösung, Untertiteltext mit Sekunde)
kommt aus dem fertigen Video und `cut.json` und wird bei jedem Lauf erneuert. Der Cutter füllt den Rest: Titel, Format
und Design, Plattformen, Termin laut Kalender, Briefing-Checkliste (jeder Punkt mit Sekunde oder Begründung),
Entscheidungen (Variante, was raus ist, Abweichungen), offene Fragen an Paul, Captions für TikTok (mit Titel), Instagram
und YouTube (mit Titel, höchstens 100 Zeichen), Quellen. Beispiel: `src/projekte/rewe/uebergabe.md`. Die Karte ersetzt
`beschreibung.md`; der Planer nimmt die Captions aus ihr. Die Statuszeile oben führen die Rollen nach: "zur Prüfung"
(Cutter), "freigegeben" oder "zurück, Runde n" (Prüfer), "eingeplant" mit Post-IDs (Planer).

## Prüfliste (Prüfer)

Grundlage: `npm run pruefen -- <Komposition> <projekt>` (Technik, Bilderbogen `out/pruefung/<Komposition>-bogen.jpg`,
Bericht `out/pruefung/<Komposition>.md`), dazu Standbilder (`npm run still`) an jeder Skizze und jedem Schnitt.

**A. Inhalt** (Verification aus seinem Skill `video`):
1. **Hook** sitzt in den ersten 3 s: Hook-Titel lesbar (Bogen bei 0,5/1,5/2,9 s), der erste Satz trägt die These.
2. **Untertitel** sind vorhanden, richtig geschrieben (Namen, Zahlen) und passen zum Ton: `kontrolle` im Bericht,
   jede Meldung anhören; Untertiteltext der Karte gegen den Originalsprechtext im Briefing.
3. **Format:** 9:16, 1080x1920, Länge im Rahmen des Formats (Bericht).
4. **CTA** eindeutig (Frage oder Aufruf, nicht abgeschnitten, keine Outro-Tafel). Er steht dort, wo er im Transkript
   inhaltlich passt: am Ende, oder auch am Anfang oder in der Mitte (seine Vorgabe 2026-10-23: "CTA kann auch ruhig mal
   gegen Anfang oder in der Mitte des Videos kommen, wenn es inhaltlich im Transkript dazu passt"); nie künstlich
   ans Ende verschieben, wenn er im Satzfluss weiter vorne steht. Endet das Video ohne CTA, dann mit Frage, Pointe oder Loop.
   Produktionsweg und Wettbewerbsvergleich aus `video` entscheidet die Planung vor dem Dreh, nicht der Schnitt.

**B. Briefing und Stil:**
5. Jeder Punkt des Briefings ist umgesetzt oder in der Karte begründet (Karte gegen `briefing.md`).
6. **Claim-Check:** keine Aussage in Video, Skizzen oder Captions, die über Briefing und Quellen hinausgeht (Zahlen,
   "garantiert", "ganz Deutschland").
7. **Freigegebener Look** (die sieben Punkte oben im Stil-Skill): wenige Schnitte, kein Zoom-Wechsel; Untertitel unter
   dem Kopf (y ~1400); über dem Kopf Hook-Titel, Quelle und Skizzen, jede Skizze auf ihrem Wort (Standbild am Stichwort);
   **helle Karten** nach `karten-hell.md` (weiß/hellgrau, Linien-Icons, keine Kreide, Titel zweifarbig) und **eine Farbwelt im
   ganzen Video**: der PulseConnect-Verlauf Grün → Hellblau (ab 2026-10-22; vorher je Format eine Leuchtfarbe:
   NEWS nacht-gruen #00F090, FACE nacht #CCFF00, HERO nacht-mint #40E8E0; seine Rüge 2026-10-18 zu N04: "Weshalb wurden
   denn die Farben durcheinander gemixt? Im Titel blau, bei den b-Rolls dann wieder grün?");
   keine leere Karte (die dunkle Karte erscheint erst mit ihrem ersten Inhalt; REWE v2 zeigte bei 31,4-32,0 s eine leere);
   nichts in den Zonen der Apps (TikTok rot, Instagram pink im Bogen); Farbe sanft (Helligkeit Gesicht im Bericht ~0,55-0,57); Musik leise
   (checks); Soundeffekte leise und sparsam.

**C. Technik:** im Bericht kein FEHLER; jede WARNUNG und jedes PRÜFEN ist bewertet.

**D. Karte und Captions:** **höchstens 1-2 Hashtags je Plattform** (seine Vorgabe 2026-10-22: "Bitte bei allen Beschreibungen in den Social Media Kanälen maximal 1-2 hashtags benutzen. Nicht übertreiben"; bei YouTube zählt #shorts mit); alle Felder gefüllt, je Plattform ein eigener Text mit Frage oder Aufruf und Hashtags,
TikTok-Titel und YouTube-Titel nicht zu lang, Quellen genannt, Titel wie im Kalendertermin (auch Datei-, Ordner- und
Doc-Name).

**E. Gemini** (nur wenn `"gemini": true` in `faber-cut.json`): `npm run gemini -- out/final/<Komposition>-chat.mp4
prompts/review.md`, zweimal. Jede Behauptung an Standbild, Ton oder Code prüfen; nur Belegtes zählt.

**Urteil** (`out/pruefung/<Komposition>-urteil.md`, und als Antwort an die Regie):

```
URTEIL: FREIGEGEBEN | ZURÜCK        Runde 1 | 2
Video: out/final/<Komposition>.mp4 (Länge, LUFS, Musikabstand, Helligkeit Gesicht, Kontrolle %)
Mängel (nur bei ZURÜCK, jeder einzeln behebbar):
1. [Sekunde oder Datei] Ist: … → Soll: … (Regel: Skill/Briefing-Punkt)
Hinweise für Paul (kein Grund für ZURÜCK): …
```

ZURÜCK nur für konkrete Verstöße gegen die Prüfliste, die Skills oder das Briefing. Geschmack, für den es keine Regel
gibt, ist ein Hinweis für Paul, kein Mangel.

## Planer

1. `TZ=Europe/Berlin date`.
2. **Termin**, in dieser Reihenfolge: was Paul im Chat gesagt hat (gibt die Regie mit) → ein schon angelegter
   Metricool-Post für dieses Video (dann nichts doppelt anlegen) → der Kalender: im Briefing-Termin der
   "VERÖFFENTLICHUNGSPLAN" bzw. "Veröffentlichung", oder ein eigener Termin "📅 Geplanter Post" bzw. "📣 GEPLANT" mit dem
   Titel. Gibt es keinen Termin: Metricool `getBestTimeToPostByNetwork` (nächste 7 Tage, TikTok, Instagram, YouTube),
   den besten freien Platz als **Vorschlag** an die Regie, nicht anlegen; sie fragt Paul. Nie still eine andere Zeit
   als die vorgegebene nehmen.
3. **Kollisionen:** `getScheduledPosts` für den Tag; liegt schon ein anderes Video in derselben Stunde, nicht anlegen,
   sondern melden.
4. **Drive:** `npm run hochladen -- out/final/<Komposition>.mp4 "<Titel>"`, in "Final geschnittene Videos" den Ordner
   "<Titel>" anlegen, das Video hineinschieben, das Doc "<Titel> – Beschreibungen" aus den Captions der Karte anlegen
   (`create_file`, `text/plain`, Inhalt als `base64Content`, sonst gehen die Emojis kaputt).
5. **Metricool** (blogId 7289054, Europe/Berlin): je Netzwerk ein eigener Post mit `createScheduledPost`, Text aus der
   Karte, Video-Link `https://drive.usercontent.google.com/download?id=<id>&export=download&confirm=t`, `autoPublish`
   true. TikTok mit `tiktokData.title`; Instagram `instagramData.type` "REEL"; YouTube `type` "short", `madeForKids`
   false, `category` "NEWS_POLITICS" bei NEWS, sonst "EDUCATION", `title` aus der Karte.
6. **Kontrolle:** `getScheduledPosts` für den Tag: genau ein Post je Netzwerk, richtige Zeit, richtige Texte.
7. Karte: Status "eingeplant" mit Post-IDs, Drive-Ordner und Datum; kurzer Bericht an die Regie.

Der Planer ändert keinen Kalendertermin, löscht oder ändert keine anderen Posts und plant nichts ohne Pauls OK ein
(die Regie startet ihn erst danach).
