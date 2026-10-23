# Übergabekarte: A01 · Billbee + Lexware Office

Status: **zur Prüfung** (Cutter) <!-- danach: freigegeben / zurück (Prüfer), eingeplant (Planer) -->

- **Titel** (wie im Kalendertermin, auch Datei-, Ordner- und Doc-Name): A01 · Billbee + Lexware Office
- **Format / Design:** HERO (A-Reihe "Eine Shopify-App, ein Problem") / Hook-Titel im Design verlauf, Untertitel `#00E090`, Musik ruhig, sanfter Grade
- **Plattformen:** TikTok, Instagram Reel, YouTube Short
- **Termin laut Kalender:** "🎬 A01 · Billbee + Lexware Office", Veröffentlichung Sa 24.10.2026 (Uhrzeit offen im Kalender); laut Regie 14:00 (Serien-Slot)
- **Briefing:** "🎬 A01 · Billbee + Lexware Office" (Termin 20.10.2026, ganztägig), `src/projekte/billbee/briefing.md`

<!-- auto:start (npm run uebergabe) -->
- **Projekt / Komposition:** `billbee` / `Billbee`
- **Datei:** `out/final/Billbee.mp4` (Master), `-post.mp4` (Plattformen), `-chat.mp4` (Chat)
- **Technik:** 1080x1920, 30 fps, 59.8 s
- **Wörter im Video:** 177

### Untertiteltext (so steht er im Video)

-   0.1 s  Diese zwei Shopify Apps sollte jeder Shopify Händler unbedingt auf dem Schirm haben, wenn es um das Thema Buchhaltung geht und wenn du sie noch manuell vorbereitest.
-   8.6 s  dann kann nämlich die Kombination aus Billbee und Lexware sehr interessant für dich sein.
-  12.2 s  Billbee sammelt hier dabei deine Bestellungen aus Shopify und auch weiteren Verkaufskanälen wie Marktplätzen und kann dann daraus automatisiert Rechnungen erzeugen und diese dann eben anschließend an Lexware Office übertragen.
-  22.7 s  Billbee übernimmt dann dabei also die Auftragsabwicklung.
-  25.6 s  Lexware ist dann aber ein klassisches eigentliches Buchhaltungssystem.
-  28.8 s  das funktioniert natürlich nicht einfach nur blind per Mausklick.
-  32.5 s  sondern Steuersätze, OSS, Rechnungsstatus und auch Zahlungsabgleich müssen natürlich zu deinem Unternehmen passen und auch sauber vorher in der App eingerichtet sein.
-  40.8 s  Mein Tipp hier ist, teste unbedingt die Verbindung vorher in wenigen Testbestellungen und prüfe das Ergebnis gemeinsam mit deiner Buchhaltung und deinem Steuerberater, bevor du hier überhaupt das Ganze auf live setzt.
-  51.9 s  Denn Automatisierung spart dir nur dann Zeit, wenn auch die Daten am Ende korrekt sind Und für weitere solcher Tipps für E-Commerce und Shopify folge mir hier gerne.
<!-- auto:end -->

## Briefing-Checkliste

- [x] Direkt mit der Hook starten, ohne Vorspann (erstes Wort bei 0,13 s, Hook-Titel ab Frame 0, bis ca. 5,2 s)
- [x] Hook-Texteinblendung wörtlich: "DIESE 2 APPS SOLLTE" / "JEDER SHOPIFY-HÄNDLER KENNEN" (Design verlauf)
- [x] Natürlich, Pausen versäubert, nicht hektisch: Pausen ab 0,3 s raus, sonst ganze Sätze, 59,7 s
- [ ] Reihen-Einblendung "Eine Shopify-App, ein Problem" nach der Hook: kommt mit den Karten (eigener Opus-Agent), Platzhalter in `Video.tsx` (ab ca. 5,5 s)
- [ ] "Billbee" markieren bei "Billbee übernimmt dann dabei also die Auftragsabwicklung" (22,7-24,4 s) und "Lexware Office" hervorheben bei "Lexware ist dann aber ein klassisches eigentliches Buchhaltungssystem" (25,6-27,9 s): Karten
- [ ] Texteinblendungen "AUFTRAGSABWICKLUNG: BILLBEE" (ab 24,4 s), danach "BUCHHALTUNG: LEXWARE OFFICE" (ab 27,0 s): Karten
- [ ] Grafik Kette "Shopify-Bestellung → Billbee-Rechnung → Lexware Office" (12,2-22,7 s, Wörter Shopify 14,4 s, Rechnungen, Lexware Office 21,3 s): Karten, nur als Grafik, keine Oberfläche, keine Screenshots
- [x] Keine Steuerberatung, keine fehlerfreie Vollautomatik: Tipp mit Testbestellungen und Steuerberater bleibt im Schnitt (40,8-51,5 s)
- [x] Billbee wird nicht als Buchhaltungssystem bezeichnet, der Zahlungsabgleich nicht als automatisch übertragen (im Ton so nicht gesagt)
- [x] Keine echten Kunden-, Umsatz-, Zahlungs- oder Zugangsdaten
- [x] Länge 45-60 s (59,7 s), 9:16, Untertitel unter dem Kopf (y 1400), Musik ruhig leise

## Entscheidungen des Cutters

- Variante A (Originalsprechtext) nach seinem gesprochenen Wortlaut: Er hat den Text mehrfach neu angesetzt (162 s Rohclip). Genommen je Satz der letzte saubere, vollständige Anlauf: Hook (2,6-11,0 s im Take), "Dann kann nämlich ..." (12,5-16,1), "Billbee sammelt ..." (41,1-51,9), "Billbee übernimmt ... Buchhaltungssystem" (52,5-58,7), "Das funktioniert nicht ... eingerichtet sein" (60,7-73,1), "Mein Tipp ..." (86,5-98,0), "Denn Automatisierung ..." (147,2-151,6), Aufruf (156,5-160,5)
- Weggelassen: alle Fehlstarts und Wiederholungen ("Denn Billbee sammelt ..." 18-35 s, "Mein Tipp ..." 73-82 s und 120-139 s, zwei weitere Schlussanläufe), im Hook "Denn" vor "dann kann nämlich", "Wichtig dabei zu verstehen ist" und "erstmal"; im Schluss "natürlich" und "und stimmen / und du das Ganze ... übergeben kannst" (Länge)
- Whisper-Verhörer korrigiert (Ton gegengehört): "nach dem Schirm" ist "auf dem Schirm", "Handler" ist "Händler", "-Commerce" ist "E-Commerce"; "Steuerbata" kommt nicht mehr vor (Satz gekürzt)
- Aufruf ("Und für weitere solcher Tipps für E-Commerce und Shopify folge mir hier gerne") steht nicht im Teleprompter, ist aber seine gesprochene Fassung und der einzige CTA im Video, nicht doppelt
- Ende: 0,35 s nach "gerne" (Pegel am Wort-Ende bei 160,1 s), `ende.bis` 160,45 s, nicht verlängert, davor kein Griff zur Kamera im Bild
- Bild: Augen bei y ~810 (scale 1,3, hoch 400, x 50 zentriert), `STIL.gradeSanft`, Farbkorrektur sanft (Gesicht Rohclip 0,547), Porträt-Modus Standard
- Ein ruhiges Zoom-in (3 %), kein Punch-in (Karten oben)
- Musik ruhig.mp3; Soundeffekte erst mit den Karten
- Abweichungen: Hook-Satz im Ton lautet "Diese zwei Shopify Apps sollte jeder Shopify Händler unbedingt auf dem Schirm haben, wenn es um das Thema Buchhaltung geht und wenn du sie noch manuell vorbereitest"; er sagt "klassisches eigentliches Buchhaltungssystem" (Teleprompter: "das eigentliche Buchhaltungssystem") und "Lexware" statt "Lexware Office", außer bei "übertragen". Wörtliche Texte stehen in den Karten

## Offene Fragen an Paul

- Soll "Lexware" im Ton (zwei Mal "Lexware", einmal "Lexware Office") so bleiben? Auf den Karten steht durchgehend "Lexware Office".
- Uhrzeit der Veröffentlichung am 24.10.: Kalender nennt keine, Regie sagt 14:00.

## Captions

TikTok-Titel (max. 90 Zeichen): Shopify-Buchhaltung noch per Hand?

### TikTok

```
Shopify-Buchhaltung noch per Hand? 🧾

Billbee sammelt deine Bestellungen aus Shopify und weiteren Verkaufskanälen, erzeugt daraus Rechnungen und überträgt sie an Lexware Office.
✅ Billbee: Auftragsabwicklung
✅ Lexware Office: Buchhaltung

Wichtig: Steuersätze, OSS, Rechnungsstatus und Zahlungsabgleich müssen zu deinem Unternehmen passen und sauber eingerichtet sein. Teste zuerst mit wenigen Testbestellungen und besprich das Ergebnis mit deiner Buchhaltung oder Steuerberatung.

Wie bereitest du deine Buchhaltung bisher vor? 👇

#Shopify #Billbee
```

### Instagram (Reels)

```
Eine Shopify-App, ein Problem: Buchhaltung noch manuell vorbereiten? 🧾

Billbee kann deine Auftragsabwicklung bündeln, Rechnungen erzeugen und diese an Lexware Office übertragen. Lexware Office ist dabei das eigentliche Buchhaltungssystem.

Entscheidend ist die saubere Einrichtung, besonders bei Steuern, OSS, Rechnungsstatus und Zahlungsabgleich. Mein Tipp: Teste die Verbindung zuerst mit wenigen Testbestellungen und prüfe das Ergebnis gemeinsam mit deiner Buchhaltung oder Steuerberatung. Automatisierung spart nur dann Zeit, wenn die Daten am Ende stimmen.

Folge mir für weitere Tipps zu E-Commerce und Shopify. Und: Nutzt du schon eine Lösung für deine Buchhaltung? 👇

#Shopify #Billbee
```

### YouTube (Shorts)

Titel (max. 100 Zeichen): Shopify-Buchhaltung: Billbee + Lexware Office, was du vorher prüfen musst

```
Billbee sammelt deine Bestellungen aus Shopify und weiteren Verkaufskanälen, kann daraus Rechnungen erzeugen und diese an Lexware Office übertragen. Billbee übernimmt die Auftragsabwicklung, Lexware Office ist das eigentliche Buchhaltungssystem.

Wichtig: Das funktioniert nicht einfach per Mausklick. Steuersätze, OSS, Rechnungsstatus und Zahlungsabgleich müssen zu deinem Unternehmen passen und sauber eingerichtet sein. Teste die Verbindung zuerst mit wenigen Testbestellungen und prüfe das Ergebnis gemeinsam mit deiner Buchhaltung oder Steuerberatung. Das ist keine Steuerberatung.

Wie bereitest du deine Buchhaltung bisher vor? Schreib es in die Kommentare.

Quellen:
https://www.billbee.io/schnittstellen/lexware-office
https://hilfe.billbee.io/article/298-lexware-office-mit-billbee-verbinden
https://hilfe.billbee.io/article/1300-allgemeine-funktionen

#shorts #Shopify
```

## Quellen

- Billbee, Schnittstelle Lexware Office: https://www.billbee.io/schnittstellen/lexware-office
- Billbee Hilfe, Lexware Office mit Billbee verbinden: https://hilfe.billbee.io/article/298-lexware-office-mit-billbee-verbinden
- Billbee Hilfe, Allgemeine Funktionen: https://hilfe.billbee.io/article/1300-allgemeine-funktionen
