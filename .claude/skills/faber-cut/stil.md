# Schnittstile nach Format

Jedes Video hat ein **Format**, und jedes Format hat seinen eigenen Stil als eigenen Skill. Er will die Formate
bewusst nicht gleich schneiden lassen (2026-10-09).

| Format | Wofür | Stil (Skill) | Stand |
| --- | --- | --- | --- |
| **HERO** | Erklär- und Expertenvideos, die etwas länger gehen (meist 1-3 min) | `.claude/skills/stil-hero/SKILL.md` | festgelegt (Vorlage: `src/projekte/shopcheck/`) |
| **FACE** | Meinungsvideos direkt in die Kamera (~45-60 s), Frage an die Community | `.claude/skills/stil-face/SKILL.md` | festgelegt (Vorlage: `src/projekte/kiagenten/`) |
| **NEWS / Reaction** | News oder Reactions auf Meldungen (~60-80 s), Quelle als Greenscreen hinter ihm | `.claude/skills/stil-news/SKILL.md` | festgelegt (vorläufig, Vorlage: `src/projekte/shopifycanvas/`) |

So gehst du vor:

- **Vor jedem Schnitt das Format klären.** Sagt er es nicht, frag (AskUserQuestion: HERO / FACE / NEWS-Reaction),
  und lies dann den Skill des Formats. Schreib das Format in den Kopf der `Video.tsx` des Projekts.
- **Ist der Stil eines Formats noch nicht festgelegt**, läuft vor dem Schnitt der Skill **format-onboarding**: er
  geht von HERO aus und fragt nur, was im neuen Format anders sein soll.
- **Neue Geschmacksregeln** aus seinem Feedback kommen in den Skill des Formats, um das es gerade geht, nicht in die
  anderen. Klingt eine Regel nach "für alle Formate", frag nach und trag sie dann in jeden Skill ein.
- `src/lib/stil.ts` enthält die Zahlen von HERO. Andere Formate bekommen eigene Abweichungen (siehe ihr Skill),
  die HERO-Werte bleiben unverändert.

## Designs (der Look)

Neben dem Format hat jedes Video ein **Design**: Schrift, Farben, Untertitel, Hook, Chips und Karten, Farbstimmung.
Das Format sagt, wie geschnitten wird (Bildausschnitt, Tempo, Zooms, Aufbau, Aufruf), das Design, wie es aussieht.
Die Werte stehen in `src/lib/design.tsx`, die Vergleichsbilder entstehen aus `src/projekte/kiagenten/`
(`--props='{"design":"<name>"}'`).

| Design | Look | Leuchtfarbe |
| --- | --- | --- |
| **pulse** | der Look der ersten drei Videos: Geist, das gesprochene Wort blau, weiße Chips, Hook aus `HOOK_STILE` | (Blau `#31ADEC`, PulseConnect-Grün, Rot) |
| **nacht** (Variante 1) | dunkel und laut: Titel und Hook in Anton (Großbuchstaben); Untertitel klein und ruhig (Space Grotesk 64 px, kein Kasten, nur das gesprochene Wort in der Leuchtfarbe, seit 2026-10-11), dunkle Glas-Chips mit Space Grotesk, Szenen-Titel in der Leuchtfarbe, Hook weiß und darunter schwarz auf Leuchtfarbe; Bild dunkler und kühler, oben abgedunkelt, Vignette; Warnungen Pink-Rot `#FF3B5C` | Neon-Gelbgrün `#CCFF00` |
| **nacht-gruen** (Variante 2) | wie nacht | Hellgrün vom rechten Ende des PulseConnect-Logos `#00F090` |
| **nacht-mint** (Variante 3) | wie nacht | helles Mint-Türkis `#40E8E0` (das Türkis aus der Mitte des Logo-Verlaufs, aufgehellt) |

Das Logo (pulseconnect.de/pulseconnect-logo.png) läuft von Blau `#00A2FC` über Türkis `#00C3CB` nach Hellgrün
`#00EE88`-`#00F699`; die Website nutzt `#00E090` und `#0090F0`.

So gehst du vor:

- **Die Farbe hängt fest am Format, nicht mehr fragen und nicht mehr testen** (seine Vorgabe 2026-10-11: "Das haben
  wir doch vorab besprochen. Für News Videos immer Logo-Hellgrün. Für Hot Takes die Neon Farbe und für Hero Videos
  Mint-Hellblau verwenden."):

  | Format | Design | Leuchtfarbe |
  |---|---|---|
  | NEWS/Reaction (auch "News/Hot Take" zu einem Artikel) | `nacht-gruen` | Logo-Hellgrün `#00F090` |
  | FACE / Hot Take (Meinung ohne Artikel) | `nacht` | Neon `#CCFF00` |
  | HERO | `nacht-mint` | Mint-Hellblau `#40E8E0` |

  pulse nur noch für die alten Videos (Shopcheck, Vertrauen, KI-Agenten).
- **Was das Format sagt, bleibt:** Bildausschnitt, Tempo, Zooms, Untertitel-Position und -Größe, Hook-Text, Aufruf.
  Wo der Skill des Formats Farben oder Schrift nennt ("Farben wie HERO", "das gesprochene Wort in Blau", Hook-Stil aus
  `HOOK_STILE`), gilt das für pulse; bei nacht gelten dessen Farben, Schriften und Hook.
- **Feedback zum Look eines Designs** ("das Grün ist zu grell") kommt hier unter "Notizen zu den Designs", mit
  seinem Satz und Datum, und die Werte in `design.tsx`; Feedback zum Schnitt in den Skill des Formats.
- **Verlauf:** pro Video Format, Design und die Extra-Effekte (`klick`, `kamera`, `riser`, `glitzer`,
  `wusch-gross`; höchstens ein bis zwei pro Video, von Video zu Video abwechseln) in die Tabelle unten.

| Video | Format | Design | Extra-Effekte |
| --- | --- | --- | --- |
| shopcheck ("5 Dinge, die du checken solltest …") | HERO | pulse | – |
| vertrauen ("5 Vertrauens-Killer") | HERO | pulse | – |
| kiagenten ("KI-Agenten: genial oder Bullshit?") | FACE | pulse | – |
| shopifycanvas ("Shopify Canvas – Brauchen wir bald keine Webdesigner mehr?") | NEWS | nacht-gruen | kamera, riser |
| kiweihnachten ("65 % wollen KI beim Weihnachtsshopping nutzen") | NEWS | nacht-gruen | kamera, riser |
| shopifyapps ("Warum zahlst du für so viele Shopify-Apps?") | FACE (Hot Take) | nacht | riser |

### Notizen zu den Designs

<!-- Claude: trag hier jede neue Regel zum Look eines Designs ein, mit seinem Satz in Anführungszeichen und dem Datum. -->

- Wunsch (2026-10-10): "Bitte noch 2-3 komplett andere Design Stile für die nächsten Videos vorbereiten. Beim
  nächsten Video dann einen der neuen Stile verwenden". Gezeigt wurden nacht, magazin (Serifen, Creme, Orange,
  Filmkorn) und sticker (Aufkleber mit schwarzem Rand, Gelb, Pink, Mint).
- Entschieden (2026-10-10): "Ich finde leider Design 2 nicht passend und Design 3 viel zu verspielt. Design 1 ist
  genau richtig. Können wir ggf. einen Hellgrünton aus unserem Logo (PulseConnect) verwenden und daraus Design 2 bauen
  und einen hellblauen/mint gefärbten für Design 3 nehmen? Dann testen wir die drei Varianten beim den nächsten
  Video". Also: kein Serifen- und kein Aufkleber-Look; nacht bleibt, die beiden anderen Varianten sind nacht mit
  einer anderen Leuchtfarbe. magazin und sticker sind entfernt (stehen noch in Git, Commit 830cc56).
