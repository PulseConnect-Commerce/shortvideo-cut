# Aufbau-Karten und Pill-Untertitel (Probe nach Pauls Referenz, 2026-10-24)

Status: **FREIGEGEBEN** für alle neuen Videos (Paul hat A02 und M05 am 24.10. abgenommen und eingeplant).

**Platz von Kopf, Karten und Untertiteln (seine Vorgabe 2026-10-25):** Er fand den Kopf über einer Karte direkt unter dem Kinn "komplett abgeschnitten" und sah über dem Kopf zu viel leeren Platz. Seine Lösung: "Oder du packst meinen Kopf höher und lässt die Motion Captions unter dem Kopf". Also: **er steht höher im Bild** (Kopfoberkante knapp unter der oberen Safe-Zone, etwa y 300–330, Augen grob y 540–600; unten kein Bildrand).

**Ab Hüfthöhe, nichts darunter (seine Vorgabe 2026-10-27, gilt immer):** "Und bitte immer nicht vergessen erst ab Hüfthöhe bei einer sitzenden Aufnahme erst zu zeigen. Alles unterhalb der Hüfthöhe sollte abgeschnitten werden." Wer ihn höher ins Bild schiebt, holt unten Schoß und Jeans ins Bild; das ist bei P09, M06 und E05 (sitzend) passiert. Darum: den Ausschnitt (`--ausschnitt scale,hoch,x`) so wählen, dass die Hüftlinie (Hosenbund, Beginn des Schoßes) höchstens am unteren Bildrand liegt, besser 20–60 px darunter, also unsichtbar. Nötigenfalls stärker zoomen (sitzend oft scale 1,5–1,7) statt nur zu verschieben. Kopf oben, Pille und Karte darunter bleiben. Prüfen an Standbildern über das ganze Video, besonders wo er die Hände in den Schoß legt oder sich zurücklehnt; in die Übergabekarte schreiben, wo die Hüftlinie liegt. Gilt auch im Stehen (keine Hose im Bild), sitzend ist es nur leichter zu übersehen. Darunter von oben nach unten: Kinn und Hals, **Pill-Untertitel**, **Karte**, alles über der Instagram-Zone unten. Zwischen Kinn und Pille bleibt Luft, Hals und Schultern sind zu sehen. Der Hook-Titel steht an der Kartenposition unter dem Kopf und nie über dem Gesicht. Diese Bildlage ersetzt für Videos mit Aufbau-Karten die alte Regel "Augen bei y 800–830".

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
   - Breite helle Karte, etwa 820 px breit (rechte TikTok-Zone frei), unter dem Kopf
     (unter der Pill-Untertitelzeile). Gesicht und Hals bleiben frei.
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
   - Ruft er nur zum Folgen auf (keine Frage): **nur ein Folgen- bzw. Plus-Symbol als kurze Animation** (Plus wird auf
     sein Wort angetippt und wird zum Haken). **Keine Folgen-/Episodenliste, keine Seriennummer, kein „E01–E05“**,
     auch nicht in der Schlusskarte. Seine Vorgabe 2026-10-25: "Am Ende muss nicht extra visualisiert werden, welche
     Folge diese genau ist und ob noch E01 bis E04 vorher bereits hochgeladen wurden. Teilweise sind auch die
     Reihenfolgen gar nicht gleich und auf Social Media Short Videos sehen sich die Leute meist sowieso keine Reihen an,
     sondern nur die FYP. Somit reicht es nur ein Follow Symbol oder ein + Symbol als Animation anzuzeigen". Dasselbe
     gilt für Captions: keine Folgennummer und keine Liste früherer Folgen.

8. **Pill-Untertitel**
   - Kurze Phrasen von 2–4 Wörtern in einer dunklen, abgerundeten Pille (rgba(10,12,14,0.82), Geist 700, ~44 px,
     weiß).
   - Das gerade gesprochene Wort leuchtet im PulseConnect-Grün #00E090 (statt Orange wie in der Referenz).
   - Position unter dem Kinn, direkt über der Karte, über der Instagram-Zone unten.
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

## Marken-Shops als Hintergrund (seine Vorgabe 2026-10-25)

Er: "Ich finde wir nutzen derzeit für die Markenstories sowie die Short Videos, bei denen es um bekannte Marken geht, viel zu wenige Ausschnitte aus den eigentlichen Shops der Marken oder Ausschnitte aus deren Websites/Shops als Screenshot für den Hintergrund".

Gilt für **jede M-Folge (Marken-Story)** und **jedes Video, in dem eine bekannte Marke vorkommt** (News mit REWE, OTTO, Amazon, DHL usw.; Hero über eine Marke):

- **Echte Screenshots aus dem Shop bzw. der Website der Marke** (Playwright, Chromium ist vorinstalliert): Startseite, Produktseite, Kategorie, Warenkorb/Abo, Store-Finder, Über-uns, Presse-/Fallstudienseite. Cookie-Banner wegklicken, keine persönlichen Daten, kein Login. Pro Video **mindestens 4–6 verschiedene** Ausschnitte.
- **Als Hintergrund hinter ihm**: er steht freigestellt vor dem Screenshot statt vor seinem Zimmer (`npm run portrait -- <projekt> --hintergrund public/broll/<projekt>/hg-x.png@<von>-<bis> … --ausschnitt <scale>,<hoch>[,<x>]`, siehe stil-news "In den Take rechnen"; Vorbild: `src/projekte/easyjet`, eins seiner besten Videos). Der Hintergrund wechselt nach Inhalt etwa alle 4–7 s, passend zum Satz (er sagt "Produkt" → Produktseite, "Stores" → Store-Finder). Das Bild ist als 1080x1920 gestaltet (Screenshot groß, leicht abgedunkelt bzw. weichgezeichnet genug, dass er, die Pille und die Karten lesbar bleiben; das Logo/der relevante Teil sichtbar neben oder über ihm, nie hinter dem Gesicht).
- Zwischen den Hintergrund-Stellen darf er vor seinem weichgezeichneten Zimmer stehen (Hook, Learnings, CTA).
- Zusätzlich bleiben die Quellen-Karten (Fallstudie, Pressemeldung, App-Store) für Belege.
- Nur echte, aktuelle Seiten, nichts nachbauen; Datum im Übergabebericht nennen.

## Visuelle Metaphern statt Wortkarten (FREIGEGEBEN 2026-10-26, Vorlage P04 `src/projekte/pagebuilder`)

Er: "Ich möchte gerne den skill eher dazu nutzen, visuell mein Gesprochenes darzustellen anstatt nur die Wörter
hinzuschreiben." Sein Vorbild: eine Karte "DER START" mit zwei Bahnen ("Die" weit vorne, "Du" am Start, gestrichelte
Startlinie, handschriftlich "Vorsprung"), die den Gedanken ohne Ton erklärt.

- Für jeden Kerngedanken zuerst die Metapher suchen, dann das Bild: Rennen/Vorsprung, Waage, schrumpfender oder
  wachsender Balken, Trichter, Fluss/Kette, Vorher/Nachher, Zeitstrahl, Stapel, Thermometer, kleine Szenen mit Objekten
  (Würfel löst sich im Glas auf, Mauszeiger klickt wütend). Icon-plus-Wort-Kacheln nur noch als Ausnahme.
- Die Bewegung folgt dem Satz auf das Wort (rollt, kippt, bricht ab, wird rot, verdoppelt sich, wenn er es sagt).
- Höchstens 1–3 Wörter pro Bild; ein handschriftliches Akzentwort (freie Schreibschrift wie Caveat/Kalam, im
  PulseConnect-Grün #00E090 oder -Blau #31ADEC; Rot nur für "Fehler").
- Rahmen bleibt: helle Karte unter dem Kopf, Pill-Untertitel darüber, ruhige Motion nach dem Motion-Skill.
- Status: **freigegeben für alle Videos** (er zu P04 am 26.10.: "Die neuen Bilder sehen richtig gut aus"). Vorlage:
  `hyperframes/pagebuilder-skizzen/index.html` (Weggabelung, App-Stapel, Prompt → Block, Code mit Fehlerzeile,
  Theme-Kopie aufs Handy, gestrichenes Abo).

## Marken-Story im Editorial-Stil (PROBE ab M06, 2026-10-25)

Sein Referenzvideo (Marken-Story Just Spices, fremdes Video, nur Machart): er freigestellt vor ruhigem, hellem Grund;
**über dem Kopf große, kurze Kennzahlen und Schlagzeilen** in eleganter Serife mit einer Akzentfarbe ("Multimillionär
ohne Gewinn?", "60 Mio. € Umsatz", "70 % online", "0 € Gewinn", "Investoren: Bitburger + trivago", "2021 · ca. 250 Mio.
€ · 85 % an Kraft Heinz", Balken "Umsatz 60 → 31 Mio. €", "−13 Mio. € Verlust 2024", "Juni 2026 · Onlineshop
geschlossen"); **Produktfotos und Gründerfoto** als kleine freigestellte Bilder, die neben dem Kopf aufpoppen; die
Zahlen kommen genau auf das Wort, ein roter Strich darunter zeichnet sich.

Für unsere M-Folgen:
- Kennzahl/Schlagzeile (1–5 Wörter) **über dem Kopf**, wenn er höher steht, sonst direkt über dem Kopf in den freien
  Raum; Serife oder Geist im Wechsel, Akzent im PulseConnect-Verlauf statt Rot (Rot nur für Verlust/Minus).
- Echte Produkt- und Gründerfotos aus dem Shop / der Presse-Seite der Marke als freigestellte Sticker (Quelle notieren).
- Marken-Shop-Screenshots als Hintergrund (Abschnitt oben) für die Shop-/Produkt-Passagen.
- Erklärende Metaphern (Balken schrumpft, Waage …) weiter unter dem Kopf.
- **Keine Memes aus Filmen/Serien** (SpongeBob usw.): keine Rechte.
