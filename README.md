# faber-cut

**Claude schneidet deine Videos.** Du filmst dich mit dem Handy, legst die Rohclips in einen Ordner und sagst Claude
Code "schneide mir dieses Video". Raus kommt ein fertiges Reel für Instagram und TikTok (1080x1920):

- Füllwörter, Versprecher und Pausen raus, ohne Mini-Jump-Cuts,
- Untertitel Wort für Wort,
- Motion Graphics, die genau auf dem gesprochenen Wort kommen,
- Splitscreen für Tool-Erklärungen, J-Cuts, Soundeffekte leise unter der Stimme,
- Lautheit auf -14 LUFS, fertig zum Hochladen.

Das ist der Skill, mit dem ich jedes Video von **Marketing Faber** schneiden lasse, mit allen Skripten, die über die
Tage dazugekommen sind. Alles läuft lokal auf deinem Rechner: Transkription, Schnitt und Render. Nichts wird
hochgeladen, außer du willst es.

> **Wichtig:** Mein Skill schneidet in **meinem** Stil. Der bringt dir nur als Startpunkt etwas. Schneide ein paar
> Videos damit, sag Claude jedes Mal, was du anders willst, und es schreibt deine Wünsche in den Skill. Nach ein paar
> Runden ist es dein Schnittstil.

## Was du brauchst

- **[Claude Code](https://claude.com/claude-code)** (Terminal, Desktop-App oder Web)
- **ffmpeg**, **Node.js 20+**, **Python 3.10-3.12**
  - macOS: `brew install ffmpeg node python@3.12`
  - Linux: `sudo apt install ffmpeg nodejs npm python3 python3-venv`
- ~6 GB freier Platz (Modelle für Transkription und Wort-Ausrichtung, Node-Pakete, deine Clips)

## Einrichten (einmal)

```bash
git clone https://github.com/TobiB1505/faber-cut.git
cd faber-cut
bash setup.sh
```

`setup.sh` installiert Remotion (Node), eine Python-Umgebung in `.venv` (faster-whisper, PyTorch, Transformers,
OpenCV), DeepFilterNet zum Entrauschen der Stimme und ein kleines Gesichtsmodell für das Platzierungsraster. Beim
ersten Video lädt es zusätzlich die Modelle für Transkription (~1,5 GB) und Wort-Ausrichtung (~1,2 GB).

## Dein erstes Video

1. Leg deinen Rohclip in den Ordner `eingang/` (z. B. `eingang/IMG_0871.MOV`).
2. Starte Claude Code im Ordner `faber-cut` (`claude`) und schreib:

   > Schneide mir das Video in eingang/IMG_0871.MOV. Projekt: tag1

3. Claude bereitet den Clip vor, transkribiert ihn, liest dein Transkript und schlägt dir **drei Fassungen als Text**
   vor (komplett, gestrafft, knackig). Du wählst eine.
4. Claude schneidet, baut die Grafiken und schickt dir eine **Vorschau** (halbe Größe), dazu die eigenen Messungen
   und auf Wunsch zwei Gemini-Kritiken.
5. Du sagst, was dir nicht gefällt ("Pacing straffer", "der Aufruf ans Ende", "die Grafik bei GitHub zu spät"). Claude
   setzt es um und trägt Geschmacksfragen in deinen Stil ein. Neue Vorschau, bis es passt.
6. Du sagst "passt", Claude rendert die **Vollversion** und prüft sie: `out/final/Tag1.mp4` (Master),
   `-post.mp4` (für Instagram/TikTok) und `-chat.mp4` (unter 29 MB zum Verschicken).

Tipp: Du kannst Claude schon beim Filmen Anweisungen geben. Sag einfach im Clip "Claude, füg hier oben rechts das
GitHub-Logo ein" und rede weiter: Claude setzt es um und schneidet die Anweisung raus.

## So funktioniert es

```
Rohclip ──intake.sh──► Take (Stimme entrauscht, 1080x1920)
                       ├─ transcribe.py   faster-whisper, lokal, gebündelt (4 min Ton in ~2,5 min)
                       └─ align.py        Wortzeiten per wav2vec2 auf den Frame genau
schnitt.json ──schnitt.py──► cut.json     Sätze als Text: was im Text fehlt, fliegt raus
                       └─ fillerscan.py   findet "ähs", die Whisper nicht aufgeschrieben hat
Video.tsx (Remotion) ──► npm run vorschau  10-s-Stücke mit Cache, nur Geändertes neu
                       ├─ sync-audit.py   kommt jede Grafik wirklich auf ihrem Wort? (gemessen am Video)
                       └─ pacing-scan.py  wo passiert länger als 2 s nichts?
npm run final ──► Master, Post- und Chat-Version, -14 LUFS
                       └─ checks.py       Ausreißer-Frames, Lautheit, Effekte unter der Stimme
```

**Warum nach Text schneiden?** Weil Claude so nie ein Wort verliert und nie mitten in einem Wort schneidet. Die Fassung,
die du wählst, ist ein Text; `schnitt.py` richtet ihn am Transkript aus. Alles, was im Text fehlt (ein "äh", ein
Versprecher, ein "Dann,"), wird zu einem Schnitt. Danach prüft es, ob die Untertitel Wort für Wort deinem Text
entsprechen.

**Warum Wort-Ausrichtung?** Whisper schätzt Wortzeiten und liegt 0,1-0,3 s daneben. Eine Grafik, die darauf gesetzt
wird, wirkt asynchron. `align.py` legt jedes Wort auf seinen echten ersten Laut, und jede Grafik kommt 2 Frames
davor. Das ist der Unterschied zwischen "irgendwie passend" und "auf den Punkt".

## Ordner

| Ordner | Inhalt |
| --- | --- |
| `.claude/skills/faber-cut/` | der Skill: `SKILL.md` (der Ablauf) und `stil.md` (**dein Geschmack**, wächst mit) |
| `tools/` | die Werkzeuge (Python und Node), jedes mit Erklärung im Kopf der Datei |
| `src/lib/` | Remotion-Bausteine: Zeitachse (`schnitt.ts`), Untertitel, Titel, Splitscreen, J-Cuts, `stil.ts` |
| `src/projekte/_vorlage/` | Vorlage für jedes neue Video |
| `src/projekte/<projekt>/` | deine Videos: `schnitt.json`, `cut.json`, `Video.tsx` |
| `public/projekte/` | deine Takes und Transkripte (bleiben lokal, nicht im Git) |
| `eingang/` | hier legst du Rohclips ab (nicht im Git) |
| `out/` | Vorschauen und fertige Videos |

## Befehle (macht normalerweise Claude für dich)

```bash
bash tools/intake.sh eingang/clip.mov tag1 t1           # Clip vorbereiten, transkribieren, ausrichten
.venv/bin/python tools/schnitt.py src/projekte/tag1/schnitt.json
.venv/bin/python tools/fillerscan.py src/projekte/tag1/cut.json
npm run studio                                          # Remotion Studio zum Durchklicken
npm run vorschau -- Tag1                                # Vorschau (halbe Größe, mit Cache)
.venv/bin/python tools/sync-audit.py out/vorschau/Tag1.mp4 src/projekte/tag1/cut.json github remotion
.venv/bin/python tools/pacing-scan.py out/vorschau/Tag1.mp4 src/projekte/tag1/cut.json
npm run final -- Tag1                                   # Vollversion
.venv/bin/python tools/checks.py out/final/Tag1.mp4 --stems Tag1
```

## Optional: Gemini als zweite Meinung

Mit einem Schlüssel von [Google AI Studio](https://aistudio.google.com/apikey) (`export GEMINI_API_KEY=…`) lässt
Claude die Vorschau von Gemini ansehen und anhören (`tools/gemini-review.py`, Prompt in `prompts/review.md`), immer
zweimal, weil Gemini sich oft irrt. Claude prüft jede Behauptung nach, bevor es etwas ändert. Achtung: Dafür geht die
Vorschau an Google. Beim kostenlosen Schlüssel darf Google sie zur Verbesserung seiner Dienste nutzen.

## Gut zu wissen

- **Dauer** (gemessen auf einem normalen Server, 4K-Clip von 40 s): Vorbereiten, Transkribieren und Ausrichten
  ~6 min beim ersten Mal (Modelle laden), Vorschau ~40 s für 15 s Video, Vollversion ~2,5 min. Ein Video von
  1:45 min: Vorschau ~4 min, Vollversion ~8 min.
- **Remotion** ist für Einzelpersonen und kleine Firmen (bis 3 Personen) kostenlos; größere Firmen brauchen eine
  [Remotion-Lizenz](https://www.remotion.dev/license).
- **Sprachen:** Deutsch und Englisch sind eingerichtet. Für andere Sprachen nimmt `align.py` mit `--modell` jedes
  wav2vec2-CTC-Modell von Hugging Face.
- Schrift: [Geist](https://vercel.com/font) (SIL Open Font License). Die Soundeffekte sind selbst synthetisiert und frei.

## Lizenz

MIT, siehe [LICENSE](LICENSE). Nimm es, bau es um, mach es zu deinem.
