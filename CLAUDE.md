# faber-cut

Dieses Repo ist eine Schnitt-Werkstatt für Talking-Head-Videos (1080x1920, Instagram/TikTok), gebaut mit Remotion.

- Für jede Bitte rund um ein Video (Clips schneiden, überarbeiten, Feedback, Vorschau, Vollversion) gilt der Skill
  **faber-cut** (`.claude/skills/faber-cut/SKILL.md`) und der Geschmack des Nutzers in
  `.claude/skills/faber-cut/stil.md`. Neue Geschmacksregeln aus seinem Feedback trägst du dort ein.
- Sprich mit dem Nutzer in seiner Sprache.
- Rohclips und Takes (`public/projekte/`, `eingang/`) bleiben lokal. Nichts davon hochladen, committen oder an einen
  Dienst schicken, außer er sagt es (die optionale Gemini-Prüfung lädt die Vorschau zu Google: nur mit seinem OK).
- Python immer mit `.venv/bin/python`; fehlen `.venv` oder `node_modules`, zuerst `bash setup.sh`.
- Nie mehr als zwei Renders gleichzeitig.
