# Archiv stil-news: frühere Looks (nur Vorgeschichte, gelten nicht mehr)

> **Vorstufe, ersetzt durch den freigegebenen Look oben – Ab 2026-10-17: wie das easyJet-Video, Untertitel im neuen Stil, B-Rolls mit HyperFrames (geht dem
> Editorial-Look unten vor).** Gilt für NEWS/Reaction, nicht für die Serie "E-Commerce einfach erklärt".
> Seine Worte (nach REWE × Lieferando): "Ich finde, dass in diesem Video zu viele Schnitte und Zooms enthalten sind.
> Orientiere dich mal an das Video, welches die beste Resonanz erzielt hat. „Easyshop neuer Konkurrent für Amazon".
> Nur die Untertitel unter dem Kopf kannst du gerne im neuen Stil erstellen. Mir fehlen bisher leider die neuen
> b-Rolls und Animationen, welche über den neuen skill „Hyperframes" erstellt werden können." 
> - **Vorlage:** `src/projekte/easyjet/Video.tsx` (veröffentlicht 16.10., beste Resonanz): `serienVideo` aus
>   `src/projekte/_serie/Serie.tsx`, Design nacht-gruen, Hook-Titel, Szenen-Titel mit Chips auf der Brust, die Quelle
>   als Greenscreen-Hintergrund hinter ihm (`layout.quelle`, `npm run portrait -- … --hintergrund`); Musik und
>   Soundeffekte siehe unten (`layout.musik`).
> - **Wenige Schnitte, kaum Zooms:** nur ein ruhiges durchgehendes Zoom-in (wie im easyJet-Video, 3 % über das ganze
>   Video), **kein** Wechsel weit/eng bei jedem Schnitt (kein `autoPunch`), keine Punch-ins. Geschnitten wird nur,
>   wo etwas raus muss (easyJet: 6 Stücke; REWE mit 8 Stücken und Zoom-Wechseln war ihm zu viel).
> - **Untertitel:** im neuen Stil (`EditorialUntertitel`: 1-3 Wörter, Anton klein, betonte Wörter in Playfair-Kursive,
>   Zahlen in unserem Grün), aber **unter dem Kopf** (wie im easyJet-Video, y ~1460), nicht oben.
> - **B-Rolls und Animationen mit HyperFrames:** in jedem Abschnitt eine animierte Grafik oder B-Roll, die zeigt, was
>   er sagt (z. B. Karte mit den Standorten, hochzählende Zahl, Ablauf "bestellt → gepackt → geliefert"), gebaut mit
>   den HyperFrames-Skills (`hyperframes`, `hyperframes-animation`) als transparentes Overlay und in die
>   Remotion-Komposition gelegt. Nur Inhalte, die er sagt oder die Quelle belegt; keine fremden Logos oder
>   Markenfotos ohne Rechte; keine HeyGen-Dienste mit seinen Rohclips.
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

**Wofür:** Er reagiert auf eine Meldung (Shopify, KI-Anbieter, E-Commerce-Studien): was passiert ist, was es kann,
seine Einordnung, eine Frage an die Community. Festgelegt am 2026-10-11 per Format-Onboarding (Skill
`format-onboarding`, ausgehend von HERO) am ersten News-Video "Shopify Canvas – Brauchen wir bald keine Webdesigner
mehr?" (`src/projekte/shopifycanvas/`, die Vorlage für jedes neue News-Video; dazu `src/projekte/kiweihnachten/`).
Er hat die Detailfragen weggeklickt; was unten "Empfehlung" heißt, ist vorläufig und wird nach seiner ersten
Vorschau nachgeschärft (siehe Notizen).

Der Ablauf (Clips laden, transkribieren, Schnitt, Vorschau, Vollversion, Übergabe) kommt aus dem Skill **faber-cut**;
hier steht, wie ein News-Video aussieht. Neue Geschmacksregeln aus seinem Feedback zu einem News-Video kommen hierher
unter "Notizen", mit seinem Satz und Datum.

