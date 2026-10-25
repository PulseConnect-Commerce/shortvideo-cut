# Übergabekarte: E05 · Deckungsbeitrag

Status: **zur Prüfung** (Cutter) <!-- danach: freigegeben / zurück (Prüfer), eingeplant (Planer) -->

- **Titel** (wie im Kalendertermin, auch Datei-, Ordner- und Doc-Name): E05 · Deckungsbeitrag
- **Format / Design:** FACE (Serie "E-Commerce einfach erklärt", Folge 5) / aktueller Look statt des dunklen Serien-Looks von E02-E04: Hook-Titel im Design verlauf (easyJet-Stil), helle Aufbau-Karten pro Gedanke und Pill-Untertitel nach karten-aufbau.md (aktives Wort `#00E090`, Karten im PulseConnect-Verlauf), Musik ruhig, sanfter Grade, Porträt-Modus
- **Plattformen:** TikTok, Instagram Reel, YouTube Short
- **Termin laut Kalender:** Veröffentlichung Mo 09.11.2026, 14:00 (Serien-Slot; im Briefing-Text steht noch 16.11.2026, laut Briefing-Kopf am 25.10. auf den 09.11. verschoben)
- **Briefing:** "🎬 E05 · Deckungsbeitrag", `src/projekte/deckungsbeitrag/briefing.md`; Rohclip Drive "E05 · Deckungsbeitrag" (gedreht 23.10.2026), Dateiname laut Kalender `E05_Deckungsbeitrag.mp4`

<!-- auto:start (npm run uebergabe) -->
- **Projekt / Komposition:** `deckungsbeitrag` / `Deckungsbeitrag`
- **Datei:** `out/final/Deckungsbeitrag.mp4` (Master), `-post.mp4` (Plattformen), `-chat.mp4` (Chat)
- **Technik:** 1080x1920, 30 fps, 43.7 s
- **Wörter im Video:** 140

### Untertiteltext (so steht er im Video)

-   0.1 s  Deckungsbeitrag, was bleibt dir eigentlich genau von deinem Umsatz übrig?
-   3.7 s  Willkommen zu E-Commerce einfach erklärt.
-   6.0 s  Heute rechnen wir das einmal an einem Beispiel durch.
-   8.4 s  Nur weil du ein Produkt für 100 Euro verkaufst, heißt es natürlich noch lange nicht, dass du auch die 100 Euro verdient hast.
-  14.6 s  Denn beim ROAS im letzten Video haben wir nämlich schon über die Kosten gesprochen.
-  18.3 s  Jetzt rechnen wir erst einmal weiter.
-  19.9 s  Bei 100 Euro Nettoerlös gehen dir zum Beispiel 35 Euro Wareneinsatz, 5 Euro Versand und 3 Euro Zahlungsgebühren ab.
-  28.1 s  Dann bleiben dir lediglich noch 57 Euro Deckungsbeitrag übrig.
-  31.3 s  Davon müssen jetzt unter anderem noch deine Fixkosten gedeckt werden.
-  34.5 s  Und was sagt uns das?
-  35.6 s  Umsatz und Gewinn sind also zwei ganz unterschiedliche Paar Schuhe.
-  38.8 s  Und wenn du weitere solche Erklärungen zum E-Commerce sehen willst, dann folge mir hier gerne und drücke das Plus weg.
<!-- auto:end -->

## Briefing-Checkliste

- [x] Direkt mit der Hook starten, ohne Vorspann: erstes Wort "Deckungsbeitrag" bei 0,08 s; Hook-Titel mit dem Cover-Text wörtlich "DECKUNGSBEITRAG –" / "WAS BLEIBT VON DEINEM UMSATZ ÜBRIG?" (0,0-3,6 s, unter dem Kopf an der Kartenposition)
- [x] Natürlich, nicht nach Werbeclip: 9 Schnittstücke, nur zwischen ganzen Sätzen, kein Zoom-Wechsel (ein ruhiges Zoom-in von 3 %), leise eigene Musik
- [x] Pausen versäubern, aber nicht hektisch: `pausen.min_gap` 1,0, keine Schnitte in ganzen Sätzen; längste Pause im Video 0,66 s (nach "ab.", 27,4 s)
- [x] Deutsche Untertitel mit Abstand zu den App-Rändern: Pill-Untertitel (2-4 Wörter) bei y ca. 995-1055, x ca. 180-800, außerhalb aller TikTok- und Instagram-Zonen (Bilderbogen)
- [x] 1080 x 1920, MP4/H.264, 30 fps, 43,7 s
- [x] Sprache klar vor leiser Musik: -14 LUFS, Musik beim Sprechen 25,2 dB unter der Stimme, Effekte mindestens 10 dB darunter (checks --stems)
- [x] Nur 1-3 kurze B-Rolls: die einzige B-Roll im Sinn des Briefings ist die Zahlenkarte (19,98-31,2 s); die übrigen Karten sind Aufbau-Karten (Motion Captions) nach dem aktuellen Look, wie von der Regie verlangt; kein B-Roll aus alten Videos
- [x] Zahlenkarte "100 € Nettoerlös − 35 € Ware − 5 € Versand − 3 € Zahlungsgebühr = 57 € Deckungsbeitrag": Kicker "BEISPIELRECHNUNG", jeder Betrag auf seiner gesprochenen Zahl (100 bei 20,0 s, 35 bei 22,5 s, 5 bei 24,5 s, 3 bei 26,0 s, 57 bei 29,3 s), jedes Label auf seinem Wort, Summenstrich auf "Dann" (28,0 s), "= 57 €" hervorgehoben (Verlaufsschrift und -rahmen, die Zeilen darüber treten zurück), danach "Fixkosten" (Karte ab 31,2 s, Fixkosten auf dem Wort bei 33,0 s) und "Umsatz ≠ Gewinn" (35,5-38,7 s, ≠ auf "unterschiedliche" bei 37,6 s)
- [x] Verweis auf ROAS im letzten Video: Kicker "LETZTE FOLGE: ROAS" mit ROAS-Kachel "Folge 4" (14,9 s), "Kosten" auf dem Wort (17,0 s) mit Häkchen "schon besprochen"
- [x] Keine ungetesteten Funktionen als Praxistest: kein Tool im Video; die Zahlen sind sein Rechenbeispiel und als "Ein Beispiel" bzw. "Beispielrechnung" gekennzeichnet
- [x] Kein künstlicher Loop: das Video endet mit seinem Aufruf ("folge mir hier gerne und drücke das Plus weg", 38,8-43,5 s)
- [x] Bei Tutorials nur reale Menüwege oder gekennzeichnete Beispielansichten: kein Tutorial, keine Oberflächen gezeigt
- [x] Kanäle Instagram Reels, TikTok, YouTube Shorts: Captions unten je Plattform
- [x] Länge ca. 30-45 s: 43,7 s, nichts gestreckt; Ende 0,17 s nach dem letzten Laut, bevor er zur Kamera greift
- [x] Cover-Text "Deckungsbeitrag – was bleibt von deinem Umsatz übrig?": als Hook-Titel ab dem ersten Bild und als erste Zeile der TikTok-Caption; kein eigenes Cover-Bild gerendert
- [x] Caption-Vorschlag aus dem Briefing übernommen ("E-Commerce-Kennzahlen verständlich erklärt – ohne Buzzwords", "Welche Kennzahl soll ich als Nächstes erklären?"), Hashtags auf 2 je Plattform gekürzt
- [x] Fakten, Musikrechte, finaler Schnitt: nur seine gesprochenen Beispielwerte; Musik selbst erzeugt (`public/musik/ruhig.mp3`, rechtefrei laut `public/musik/LIZENZ.txt`); jeder Satz mit Whisper (zwei Modelle) und wav2vec2 geprüft, `kontrolle` ohne Meldung
- [x] Dateiname laut Kalender `E05_Deckungsbeitrag.mp4`: Titel oben "E05 · Deckungsbeitrag" für Datei, Ordner und Doc (der Planer benennt beim Hochladen)

## Entscheidungen des Cutters

- Fassung nach dem Teleprompter-Text aus dem Briefing (Variante A, alles Gesagte in seiner Reihenfolge), je Satz der letzte saubere Anlauf; nur die Hook aus dem ersten Anlauf, weil der zweite verhaspelt ist ("was bedeutet das eigentlich und was genau bleibt ja nicht davon deinem Umsatz übrig?"), und damit auch "Willkommen zu E-Commerce einfach erklärt." aus dem ersten Anlauf (wie im Briefing, ohne "mit Paul")
- Stücke im Take: 2,86-6,49 / 8,43-10,78 / 26,71-29,07 / 33,47-39,59 / 58,19-63,58 / 68,47-79,87 / 90,72-93,92 / 96,57-100,89 / 109,49-114,47 s; keine Sätze mit "ganz" nötig, keine Pausenschnitte in Sätzen
- Weggelassen: abgebrochenes "Heute rechnen wir das ein-" (11,6 s), zweiter Hook- und Willkommen-Anlauf (16,6-24,0 s), Fehlstart "Heute rechnen wir" (24,6 s), "Nur weil du an einem Produkt 100" (29,4 s), drei abgebrochene ROAS-Anläufe (40,2-57,2 s; der letzte bricht nach "schon genau über" ab), abgebrochenes "Bei 100 Euro Nettoerlös" (63,9 s), "Davon müssen wir jetzt unsere anderen" (80,2 s), zweiter Fixkosten-Anlauf "Davon müssen wir da natürlich unter anderem noch die Fixkosten gedeckt werden" (85,0 s, holprig), angehängtes "und Umsatz und Gewinn" (94,2 s), zwei Anläufe des Aufrufs (101,6-108,2 s), ein Laut vor dem Aufruf (108,8 s)
- "Und was sagt uns das?" bleibt drin (gesprochen, steht nicht im Teleprompter-Text, leitet die Pointe ein)
- Transkription: Whisper mit Stille-Filter hatte vier Neuansätze verschluckt (24,6/26,8 s, 54,1/58,2 s, 101,6-108,2 s, 108,8/109,6 s); das Transkript ist aus Whisper mit und ohne Stille-Filter, wav2vec2 und dem Pegel zusammengesetzt und neu ausgerichtet (Sicherung `edit/transcripts/t1.vad.json`). Jeder Satz im Take und im fertigen Video mit Whisper medium, Whisper small und wav2vec2 gegengehört: "haben wir nämlich schon" (nicht "natürlich", alle drei), "heißt es", "Zahlungsgebühren ab", "drücke das Plus weg" (Whisper medium in zwei Läufen; dieselbe Wendung wie in einem früheren Aufruf "drück hier gerne das Plus weg")
- Schnittstellen: Pegel an allen 8 Schnitten ohne Knackser (Raumton -35 bis -40 dB bis zum ersten Laut), jeder Satz beginnt mit seinem ersten Wort, `doppelt` und `kontrolle` ohne Meldung (96 %)
- Ende bei 114,47 s im Take: "weg" endet bei ca. 114,30 s, die Hände lösen sich ab 114,57 s zum Griff an die Kamera; nicht verlängert; die letzten 2 s als Standbilder alle 0,2 s geprüft (Hände gefaltet, Blick in die Kamera)
- Bild nach Pauls Vorgabe vom 25.10.: scale 1,3, hoch 494, x -33; Kopfoberkante im Median bei y ca. 315 (gemessen in allen Stücken alle 0,25 s, Bereich ca. 269-364), Augen bei ca. 589, mittig; Bild endet unten an der Hüfte (Take y ca. 1857). Weniger Zoom als Clarity (1,62), weil das Gesicht in diesem Take größer ist (276 statt 209 px breit); Gesichtsdetail gemessen etwa doppelt so hoch wie im Clarity-Rohclip, deshalb kein Nachschärfen. Pill-Untertitel bei y 1025 und Karten ab y 1075 (etwas tiefer als bei Clarity), weil er sich mehrmals vorbeugt und das Kinn dann bis y ca. 996 kommt; die Zahlenkarte endet bei y 1483, über der Instagram-Zone
- Farbe: `npm run farbe` (fast neutral, Gamma 1,042), sanfter Grade, Helligkeit Gesicht 0,552; Höhen der Stimme wie bei Clarity, kein EQ
- Porträt-Modus für alle 9 Stücke (1593 Frames, Stärke 6); Hintergrund am Anfang, in der Mitte und am Ende jedes Stücks gemessen weich (Laplace-Verhältnis Porträt/Original höchstens 0,02)
- Karten (`hyperframes/deckungsbeitrag-skizzen/`, Zeiten in `karten.json`): Serien-Karte "Folge 5 · Die Serie – E-Commerce einfach erklärt" (3,6 s), Beispiel-Karte "verkauft ≠ verdient" (Produkt 100 € ✓, "verdient? 100 €" durchgestrichen ✕), ROAS-Karte, Zahlenkarte, Fixkosten-Karte (57 € → deckt → Platzhalter "?" auf "unter anderem" → Fixkosten), Umsatz ≠ Gewinn, CTA-Karte. Labels der Zahlenkarte wie im Briefing ("Ware", "Zahlungsgebühr"), die Untertitel wie gesprochen ("Wareneinsatz", "Zahlungsgebühren"). Keine Beispiele für Fixkosten erfunden (er nennt keine)
- Sticker sparsam: "NICHT." (12,1 s) und "LEDIGLICH." (28,6 s), links neben dem Kopf
- CTA-Karte: "Mehr solche Erklärungen?" mit den Folgen E01-E05 (E05 hervorgehoben, Liste aus dem Briefing) auf "Erklärungen", Folgen-Knopf auf "folge", Zeiger tippt auf "Plus" das Plus an (wird "Gefolgt"); das Plus dunkel statt TikTok-Rot, damit es bei einer Farbwelt bleibt
- Ton: Musik `ruhig.mp3` wie bei Clarity; leise Effekte nach karten-hell.md (whoosh je Kartenwechsel, tick je Kachel bzw. Zeile, pop auf "NICHT.", success auf 57 €, klick auf dem Plus; "LEDIGLICH." ohne Ton, weil 0,6 s später success kommt)
- Sync am fertigen Video im Kartenbereich gemessen (ohne Pille): jeder Teil erscheint 1-2 Frames vor seinem Wort (57 € ab Frame 878, Wort 879); `npm run sync` meldet CHECK, weil die Pill-Untertitel in seiner Messzone liegen; an Bildstreifen nachgesehen
- Bilderbogen bei 20,0 s: die Zahlenkarte ist dort mitten im Einblenden (Karte 19,98 s, erste Zeile "100 €" 19,99 s, voll sichtbar ab ca. 20,1 s); keine leere Karte, jede Karte kommt mit ihrem ersten Teil
- `npm run vorschau` nicht benutzt, weil es zwei Stücke gleichzeitig rendert (Vorgabe der Regie: höchstens ein Render); stattdessen Standbilder und Messungen (sync, pacing, Bilderbogen) an der Vollversion
- `takes/t1.vor-farbe.orig.mp4` (117 MB) ist eine Kopie, die `npm run portrait` angelegt hat; als Sicherung nicht gelöscht
- Titel für TikTok und YouTube im Muster der Regie, "#5" ist die Folgennummer; Hashtags je Plattform höchstens 2 (bei YouTube #shorts und #ecommerce)

## Offene Fragen an Paul

- 28,1 s: "Dann bleiben **dir** lediglich noch 57 Euro Deckungsbeitrag übrig": die Erkenner sind sich uneins (Whisper "dir" bzw. "hier", Whisper small und wav2vec2 "wir"); die Untertitel zeigen "dir" (passt zu "gehen dir zum Beispiel 35 Euro Wareneinsatz ab"). Bitte kurz anhören
- Er sagt "drücke das Plus weg" und "zwei ganz unterschiedliche Paar Schuhe"; die Untertitel zeigen es so, wie er es sagt
- Hook und Willkommen sind aus dem ersten Anlauf (ohne "mit Paul"); soll es "Willkommen zu E-Commerce einfach erklärt mit Paul" sein, lässt sich der zweite Anlauf einsetzen (gleiche Länge)
- Kein eigenes Cover-Bild gerendert; der Hook-Titel mit dem Cover-Text steht ab dem ersten Bild

## Captions

TikTok-Titel (max. 90 Zeichen): Deckungsbeitrag einfach erklärt – E-Commerce einfach erklärt #5

### TikTok

```
Deckungsbeitrag – was bleibt von deinem Umsatz übrig? 💶

Nur weil du ein Produkt für 100 € verkaufst, hast du noch lange keine 100 € verdient. Das Beispiel: Bei 100 € Nettoerlös gehen 35 € Ware, 5 € Versand und 3 € Zahlungsgebühr ab. Bleiben 57 € Deckungsbeitrag – und davon müssen unter anderem noch deine Fixkosten gedeckt werden.

Umsatz und Gewinn sind also zwei ganz unterschiedliche Dinge.

Welche Kennzahl soll ich als Nächstes erklären? 👇

#ecommerce #deckungsbeitrag
```

### Instagram (Reels)

```
E-Commerce einfach erklärt, Folge 5: der Deckungsbeitrag 💶

Was bleibt von deinem Umsatz wirklich übrig? Wir rechnen es an einem Beispiel durch: Bei 100 € Nettoerlös gehen 35 € Wareneinsatz, 5 € Versand und 3 € Zahlungsgebühren ab. Übrig bleiben 57 € Deckungsbeitrag. Und davon müssen unter anderem noch deine Fixkosten gedeckt werden.

Im letzten Video ging es um den ROAS, heute rechnen wir weiter. Merke: Umsatz ist nicht Gewinn.

E-Commerce-Kennzahlen verständlich erklärt – ohne Buzzwords. Folge mir für die nächsten Folgen.

Welche Kennzahl soll ich als Nächstes erklären? Schreib sie in die Kommentare 👇

#ecommerce #deckungsbeitrag
```

### YouTube (Shorts)

Titel (max. 100 Zeichen): Deckungsbeitrag einfach erklärt – E-Commerce einfach erklärt #5

```
Deckungsbeitrag – was bleibt von deinem Umsatz übrig? Beispiel: Bei 100 € Nettoerlös gehen 35 € Wareneinsatz, 5 € Versand und 3 € Zahlungsgebühren ab. Übrig bleiben 57 € Deckungsbeitrag, und davon müssen unter anderem noch deine Fixkosten gedeckt werden. Umsatz und Gewinn sind also zwei ganz unterschiedliche Dinge.

Folge 5 der Serie „E-Commerce einfach erklärt“ (bisher: Conversion Rate, AOV, CAC, ROAS).

Welche Kennzahl soll ich als Nächstes erklären? Schreib es in die Kommentare.

#shorts #ecommerce
```

## Quellen

- Keine externen Quellen: alle Zahlen sind sein Rechenbeispiel aus dem Teleprompter-Text und der Zahlenkarte im Briefing ("🎬 E05 · Deckungsbeitrag", `src/projekte/deckungsbeitrag/briefing.md`)
- Verweis auf die vorige Folge: E04 ROAS (`src/projekte/roas/`), nur als Kicker, kein Ausschnitt
- Musik: eigene Klangsynthese `public/musik/ruhig.mp3` (`public/musik/LIZENZ.txt`), Icons: Lucide (ISC-Lizenz)
