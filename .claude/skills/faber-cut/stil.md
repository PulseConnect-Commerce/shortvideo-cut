# Schnittstile nach Format

Jedes Video hat ein **Format**, und jedes Format hat seinen eigenen Stil als eigenen Skill. Er will die Formate
bewusst nicht gleich schneiden lassen (2026-10-09).

| Format | Wofür | Stil (Skill) | Stand |
| --- | --- | --- | --- |
| **HERO** | Erklär- und Expertenvideos, die etwas länger gehen (meist 1-3 min) | `.claude/skills/stil-hero/SKILL.md` | festgelegt (Vorlage: `src/projekte/shopcheck/`) |
| **FACE** | noch festzulegen | `.claude/skills/stil-face/SKILL.md` | Stilabgleich beim ersten FACE-Video |
| **NEWS / Reaction** | optional: News oder Reactions auf andere Videos | `.claude/skills/stil-news/SKILL.md` | Stilabgleich beim ersten News-Video |

So gehst du vor:

- **Vor jedem Schnitt das Format klären.** Sagt er es nicht, frag (AskUserQuestion: HERO / FACE / NEWS-Reaction),
  und lies dann den Skill des Formats. Schreib das Format in den Kopf der `Video.tsx` des Projekts.
- **Ist der Stil eines Formats noch nicht festgelegt**, führt sein Skill vor dem Schnitt den Stilabgleich durch.
- **Neue Geschmacksregeln** aus seinem Feedback kommen in den Skill des Formats, um das es gerade geht, nicht in die
  anderen. Klingt eine Regel nach "für alle Formate", frag nach und trag sie dann in jeden Skill ein.
- `src/lib/stil.ts` enthält die Zahlen von HERO. Andere Formate bekommen eigene Abweichungen (siehe ihr Skill),
  die HERO-Werte bleiben unverändert.
