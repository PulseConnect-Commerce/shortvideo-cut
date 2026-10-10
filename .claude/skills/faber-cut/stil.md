# Schnittstile nach Format

Jedes Video hat ein **Format**, und jedes Format hat seinen eigenen Stil als eigenen Skill. Er will die Formate
bewusst nicht gleich schneiden lassen (2026-10-09).

| Format | Wofür | Stil (Skill) | Stand |
| --- | --- | --- | --- |
| **HERO** | Erklär- und Expertenvideos, die etwas länger gehen (meist 1-3 min) | `.claude/skills/stil-hero/SKILL.md` | festgelegt (Vorlage: `src/projekte/shopcheck/`) |
| **FACE** | Meinungsvideos direkt in die Kamera (~45-60 s), Frage an die Community | `.claude/skills/stil-face/SKILL.md` | festgelegt (Vorlage: `src/projekte/kiagenten/`) |
| **NEWS / Reaction** | optional: News oder Reactions auf andere Videos | `.claude/skills/stil-news/SKILL.md` | Stilabgleich beim ersten News-Video |

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
Eingeführt am 2026-10-10: "Bitte noch 2-3 komplett andere Design Stile für die nächsten Videos vorbereiten. Beim
nächsten Video dann einen der neuen Stile verwenden". Die Werte stehen in `src/lib/design.tsx`, die Vergleichsbilder
entstehen aus `src/projekte/kiagenten/` (`--props='{"design":"<name>"}'`).

| Design | Look | Schrift | Untertitel | Chips und Hook | Farben und Bild |
| --- | --- | --- | --- | --- | --- |
| **pulse** | der Look der ersten drei Videos | Geist | weiß, das gesprochene Wort blau | weiße Chips, Hook aus `HOOK_STILE` | Blau, PulseConnect-Grün, Rot |
| **nacht** | dunkel und laut, Tech | Anton (Großbuchstaben), Space Grotesk | Großbuchstaben, das Wort in einer neongrünen Box | dunkle Glas-Chips, Titel neongrün; Hook weiß, Kernzeile schwarz auf Neon | Neon-Grün `#CCFF00`, Pink-Rot; Bild dunkler und kühler, oben abgedunkelt, Vignette |
| **magazin** | ruhig und edel, wie ein Magazin | Instrument Serif (Serifen), Geist für die Dachzeile | Serifen, das Wort orange unterstrichen | Papier-Chips in Creme, Titel dunkel mit kursiver Serife; Hook als Creme-Karte (orange Dachzeile, kursive Schlagzeile) | Creme, Tinte, Orange, Salbeigrün; Bild warm, etwas entsättigt, Filmkorn, Vignette |
| **sticker** | verspielt, wie Aufkleber | Bricolage Grotesque | weiß mit schwarzer Kontur, das Wort als gelber, gekippter Aufkleber | weiße Aufkleber mit schwarzem Rand und hartem Schatten; Hook als zwei gekippte Aufkleber (weiß, pink) | Gelb, Pink, Mint, Blau; Bild kräftig |

So gehst du vor:

- **Das nächste Video bekommt eines der neuen Designs** (nacht, magazin oder sticker), nicht pulse. Hat er noch keins
  gewählt: vor der Vorschau die Vergleichsbilder aus seinem neuen Clip zeigen (Hook, eine Szene, das Ende; je Design
  eine Spalte) und fragen (AskUserQuestion). Antwortet er nicht, nimm **magazin** (ruhig, passt zu "weniger Zooms
  und Schnitte"). Danach wechselt der Look von Video zu Video, wie er es will.
- **Was das Format sagt, bleibt:** Bildausschnitt, Tempo, Zooms, Untertitel-Position und -Größe, Hook-Text, Aufruf.
  Wo der Skill des Formats Farben oder Schrift nennt ("Farben wie HERO", "das gesprochene Wort in Blau", Hook-Stil aus
  `HOOK_STILE`), gilt das für pulse; bei einem anderen Design gelten dessen Farben, Schriften und Hook.
- **Feedback zum Look eines Designs** ("das Neon ist zu grell") kommt hier unter "Notizen zu den Designs", mit
  seinem Satz und Datum, und die Werte in `design.tsx`; Feedback zum Schnitt in den Skill des Formats.
- **Verlauf:** pro Video Format und Design in die Tabelle unten, damit sich der Look nicht ungewollt wiederholt.

| Video | Format | Design |
| --- | --- | --- |
| shopcheck ("5 Dinge, die du checken solltest …") | HERO | pulse |
| vertrauen ("5 Vertrauens-Killer") | HERO | pulse |
| kiagenten ("KI-Agenten: genial oder Bullshit?") | FACE | pulse |

### Notizen zu den Designs

<!-- Claude: trag hier jede neue Regel zum Look eines Designs ein, mit seinem Satz in Anführungszeichen und dem Datum. -->
