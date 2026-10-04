# faber-cut

Dieses Repo ist eine Schnitt-Werkstatt für Talking-Head-Videos (1080x1920, Instagram/TikTok), gebaut mit Remotion.

- **Erst einrichten:** Fehlt `faber-cut.json`, wurde das Repo gerade geklont. Biete dann zuerst das Onboarding an (Skill
  **skill-onboarding**), egal womit der Nutzer anfängt, und erst danach das, worum er gebeten hat.
- Für jede Bitte rund um ein Video (Clips schneiden, überarbeiten, Feedback, Vorschau, Vollversion) gilt der Skill
  **faber-cut** (`.claude/skills/faber-cut/SKILL.md`) und der Geschmack des Nutzers in
  `.claude/skills/faber-cut/stil.md`. Neue Geschmacksregeln aus seinem Feedback trägst du dort ein.
- Sprich mit dem Nutzer in seiner Sprache, einfach und Schritt für Schritt.
- Alle Werkzeuge laufen über `npm run …` (Windows, macOS und Linux gleich). Python nie direkt aufrufen. Fehlen `.venv`
  oder `node_modules`: `npm run setup`, dann `npm run doktor`.
- Rohclips und Takes (`public/projekte/`, `eingang/`) bleiben privat. Nichts davon hochladen, committen oder an einen
  Dienst schicken, außer er sagt es. Die Gemini-Prüfung lädt die Vorschau zu Google; die läuft nur, wenn er sie im
  Onboarding gewählt hat.
- Nie mehr als zwei Renders gleichzeitig.
