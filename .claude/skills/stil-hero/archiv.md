# Archiv stil-hero: frühere Looks (nur Vorgeschichte, gelten nicht mehr)

> **Vorstufe, ersetzt durch den freigegebenen Look oben – Ab 2026-10-17: weniger Schnitte und Zooms, Untertitel im neuen Stil unter dem Kopf, B-Rolls mit HyperFrames
> (geht dem Editorial-Look unten vor).** Gilt für FACE und HERO, nicht für die Serie "E-Commerce einfach erklärt".
> Seine Worte (nach REWE × Lieferando): "Ich finde, dass in diesem Video zu viele Schnitte und Zooms enthalten sind.
> Orientiere dich mal an das Video, welches die beste Resonanz erzielt hat. „Easyshop neuer Konkurrent für Amazon".
> Nur die Untertitel unter dem Kopf kannst du gerne im neuen Stil erstellen. Mir fehlen bisher leider die neuen
> b-Rolls und Animationen, welche über den neuen skill „Hyperframes" erstellt werden können." 
> - **Vorbild für Schnitt und Tempo:** das easyJet-Video (`src/projekte/easyjet/Video.tsx`): nur ein ruhiges
>   durchgehendes Zoom-in, **kein** Wechsel weit/eng bei jedem Schnitt (kein `autoPunch`), keine Punch-ins,
>   geschnitten wird nur, wo etwas raus muss.
> - **Untertitel:** im neuen Stil (`EditorialUntertitel`), aber **unter dem Kopf** (y ~1460), nicht oben.
> - **B-Rolls und Animationen mit HyperFrames:** in jedem Abschnitt eine animierte Grafik oder B-Roll, die zeigt, was
>   er sagt, als transparentes Overlay aus den HyperFrames-Skills in der Remotion-Komposition. Nur Inhalte, die er
>   sagt; keine HeyGen-Dienste mit seinen Rohclips.
> - **Dazu seit dem zweiten Hinweis am 2026-10-17** ("Die b-rolls weiterhin mit Hyperframes erstellen und Titel und
>   Untertitel wie besprochen. Ein paar Sound Effekte bei Animationen und Einblendungen verwenden."): Hook im alten
>   Titel-Stil (nacht-gruen), Untertitel im neuen Stil unter dem Kopf, ganz leichte eigene Hintergrundmusik
>   (`<Musik>`, ~21 dB unter der Stimme), Farben mit `npm run farbe` korrigiert, ein paar leise Soundeffekte auf
>   Animationen und Einblendungen (Regeln 4 und 5b im Skill faber-cut). Das ersetzt "keine Musik" und "keine
>   Whooshes" im Editorial-Block darunter.
> - **Skizzen, Icons, Animationen** (seine Vorgabe 2026-10-17: "Ich finde es gut, wenn meine Aussagen und Beispiele
>   mit kurzen Skizzen, Icons und Animationen visuell unterstützt werden"): jede Aussage und jedes Beispiel bekommt
>   eine kurze Zeichnung aus HyperFrames (Ablauf im Skill faber-cut, Vorlage `hyperframes/rewe-skizzen/`), statt
>   reiner Textzeilen. **B-Rolls und Skizzen über dem Kopf** ("B-Rolls sollten besser über dem Kopf angezeigt werden,
>   damit mehr Platz für den Untertitel ist", 2026-10-17): er steht dafür etwas tiefer im Bild, die Untertitel liegen
>   unter dem Kopf bei y ~1400.

> **Vorstufe – Look ab 2026-10-16: Editorial (gilt nur noch, wo der freigegebene Look oben nichts sagt).** Gilt für NEWS/Reaction, FACE und HERO, **nicht** für
> die Serie "E-Commerce einfach erklärt". Entstanden in zwei Schritten: erst der Test "schlichte Untertitel und keine
> B-Rolls … sehr natürlich … mit wenigen Schnitten. Zu viel bearbeitet kommt heutzutage nicht mehr so gut an", dann
> sein Referenzvideo: "Können wir unseren Videoschnitt (gerade die Untertitel und den Schnittstil mit den
> Soundeffekten) auf diesen Stil … anpassen? … Unsere Farben können hier natürlich nach wie vor als Highlight verwendet
> werden, gerade für Titel." Vorlagen: `src/projekte/zoll/Video.tsx` (freigegeben 2026-10-16),
> `src/projekte/easyshop/Video.tsx`.
> - **Untertitel:** `EditorialUntertitel` aus `src/lib/editorial.tsx`, oben über dem Kopf (y ~330), 1-3 Wörter auf
>   einmal, Anton in Großbuchstaben, eher klein; betonte Wörter (Zahlen, Schlüsselbegriffe, etwa eins pro Satz) groß in
>   Playfair Display Black Italic, Zahlen und Kernaussage in unserem Grün `#00F090`. Während der Hook aus (`off`).
> - **Hook:** im alten Titel-Stil, `HookTitle` in `DesignRahmen design="nacht-gruen"`, zweizeilig über dem Kopf. Zu
>   den Editorial-Hook-Varianten sagte er "Die Hook finde ich nicht besonders gut im Titel" und dann "Nein, beide nicht
>   so gut, dann bitte für die Hook den alten Titel Stil verwenden". Während der Hook liegt das Bild 130 px tiefer;
>   der Wechsel fällt auf den ersten Schnitt.
> - **Bild:** leichter Porträt-Modus, Hintergrund leicht unscharf (`npm run portrait`; "Der Hintergrund sollte
>   dennoch wieder leicht verschwommen sein wie vorher"). Bei jedem Schnitt abwechselnd weit und eng
>   (`autoPunch(C, { low: 1, high: 1.08 })`), sonst keine Zooms.
> - **Wenige Schnitte:** nur Versprecher, Anläufe und weggelassene Sätze raus (Regel "ganze Sätze ohne Schnitt" im
>   Skill faber-cut, `min_gap` ≥ 1,0).
> - **Einblendungen sparsam, nur was er sagt:** Quelle oder Schlagzeile als Screenshot-Ausschnitt ("Auch bitte ein
>   paar Quellen im Video mit einblenden (also als Screenshot Ausschnitte)"; NEWS immer mit Quelle), Fakten als
>   schlichte Zeilen in Anton (`SchlichterText`). Keine Chips, Stempel, Fotos, Skizzen, Kommentar-Blase oder
>   Folgen-Knopf.
> - **Ton:** leise Klicks (`klick.mp3`, Lautstärke `STIL.sfx * 0.3`) nur auf Einblendungen; keine Musik, keine
>   Whooshes.

**Wofür:** Erklär- und Expertenvideos, die etwas länger gehen (meist 1-3 Minuten): ein Thema in mehreren Punkten,
fachlich, oft nach einem Skript vom Teleprompter. Festgelegt am 2026-10-08/09 am Video "5 Checks vor dem Kauf in
einem unbekannten Onlineshop" (`src/projekte/shopcheck/`, die Vorlage für jedes neue HERO-Video).

Der Ablauf (Clips laden, transkribieren, Varianten, Schnitt, Vorschau, Vollversion) kommt aus dem Skill **faber-cut**;
hier steht, wie ein HERO-Video aussieht. Die Zahlen (Farben, Maße) stehen in `src/lib/stil.ts`, das sind die
HERO-Werte. Neue Geschmacksregeln aus seinem Feedback zu einem HERO-Video kommen in diese Datei (unten unter
"Notizen", mit seinem Satz und Datum), nicht in die Skills der anderen Formate.

**Design: immer `nacht-mint`** (Mint-Hellblau `#40E8E0`; festgelegt 2026-10-11: "Für News Videos immer Logo-Hellgrün. Für Hot
Takes die Neon Farbe und für Hero Videos Mint-Hellblau verwenden."). Schrift, Farben, Hook-Look, Untertitel-Look und
Chips kommen aus dem Design (`src/lib/design.tsx`, Übersicht in `.claude/skills/faber-cut/stil.md`); was hier unten
zu Farben steht (Blau, Rot, Weiß), gilt nur noch für die alten pulse-Videos. Alles andere aus diesem Skill (Bild,
Schnitt, Aufbau, Aufruf) bleibt.

