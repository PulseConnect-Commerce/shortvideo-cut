# faber-cut

**Claude schneidet deine Videos.** Du filmst dich mit dem Handy, gibst Claude Code die Rohclips und sagst "schneide mir
dieses Video". Raus kommt ein fertiges Reel für Instagram und TikTok (1080x1920):

- Füllwörter, Versprecher und Pausen raus, ohne Mini-Jump-Cuts,
- Untertitel Wort für Wort,
- Motion Graphics, die genau auf dem gesprochenen Wort kommen,
- Splitscreen für Tool-Erklärungen, J-Cuts, Soundeffekte leise unter der Stimme,
- Lautheit auf -14 LUFS, fertig zum Hochladen.

Das ist der Skill, mit dem ich jedes Video von **Marketing Faber** schneiden lasse, mit allen Skripten, die über die
Tage dazugekommen sind. **Er kostet nichts:** faber-cut ist frei (MIT), Transkription, Schnitt und Render laufen ohne
bezahlte Dienste, und die optionale Gemini-Prüfung geht mit einem kostenlosen Schlüssel. Du brauchst nur Claude Code.

> **Wichtig:** Mein Skill schneidet am Anfang in **meinem** Stil. Beim Einrichten fragt Claude dich nach deinem
> (Untertitel, Grafiken, Tempo, Farbe), und nach jedem Video sagst du, was du anders willst: Claude schreibt es in
> deinen Stil. Nach ein paar Videos ist es dein Schnitt.

## Los geht's: lokal oder online

Du hast zwei Möglichkeiten. Beide richtet Claude mit dir zusammen ein, Schritt für Schritt mit Auswahlfragen.

| | **Lokal** (auf deinem Computer) | **Online** (Claude Code im Browser oder in der App) |
| --- | --- | --- |
| Für wen | Windows, Mac (Apple-Chip) oder Linux, ~8 GB frei | Claude-Plan mit Cloud-Sitzungen (Pro, Max, Team) |
| Clips | legst du in den Ordner `eingang/` | lädst du vom Handy in einen Google-Drive-Ordner |
| Fertiges Video | liegt in `out/final/` | kommt in den Chat |
| Installieren | Node.js und ffmpeg (Claude hilft) | nichts, nur ein paar Einstellungen |

### Lokal

1. Installiere [Claude Code](https://claude.com/claude-code), falls noch nicht geschehen.
2. Hol dir das Repo und starte Claude darin:
   ```bash
   git clone https://github.com/TobiB1505/faber-cut.git
   cd faber-cut
   claude
   ```
   (Ohne git: auf GitHub **Code → Download ZIP**, entpacken, im Terminal in den Ordner wechseln, `claude`.)
3. Schreib: **"Richte faber-cut für mich ein."**

Claude prüft, ob Node.js und ffmpeg da sind, und hilft beim Installieren:
- Windows: per `winget`
- Mac: per Homebrew
- Linux: per Paketmanager

Dann startet Claude `npm run setup`. Das holt ein eigenes Python und die Modelle, ~4 GB. In der Zeit fragt dich Claude
nach deinem Stil. Zum Schluss schneidet ein **Probelauf** einen Beispielclip einmal komplett durch, damit du weißt,
dass alles läuft.

### Online

1. Mach dir auf GitHub eine eigene Kopie: [dieses Repo](https://github.com/TobiB1505/faber-cut) öffnen, oben rechts
   **Fork** klicken. Für eine private Kopie: [github.com/new/import](https://github.com/new/import) mit dieser
   Adresse.
2. Öffne [claude.ai/code](https://claude.ai/code), starte eine Sitzung mit deinem Repo `faber-cut`.
3. Schreib: **"Richte faber-cut für mich ein."**

Claude führt dich durch die Einstellungen:
- eine Cloud-Umgebung mit den nötigen Freigaben
- den Google-Drive-Connector
- einen Drive-Ordner für deine Clips, freigegeben für "Jeder mit dem Link", weil Claude Videos in voller Größe nur
  über den Link laden kann

Danach startest du einmal eine neue Sitzung, und Claude macht den Rest.

## Dein erstes Video

**Lokal:** Leg den Clip in `eingang/` und schreib "Schneide mir das Video in eingang/IMG_0871.MOV. Projekt: video1".
**Online:** Lade den Clip vom Handy in deinen Drive-Ordner und schreib "Clips sind drin, schneide mir das Video".

Dann:
1. Claude bereitet den Clip vor, transkribiert ihn und schlägt dir **drei Fassungen als Text** vor: komplett,
   gestrafft, knackig. Du wählst eine.
2. Claude schneidet, baut die Grafiken und schickt dir eine **Vorschau**, mit eigenen Messungen und, wenn du willst,
   zwei Gemini-Kritiken.
3. Du sagst, was dir nicht gefällt ("Pacing straffer", "der Aufruf ans Ende"). Claude setzt es um und merkt sich
   Geschmacksfragen in deinem Stil.
4. Du sagst "passt", Claude rendert die **Vollversion** und prüft sie: Master, `-post.mp4` für Instagram/TikTok und
   `-chat.mp4` (unter 29 MB).

Tipp: Gib Claude schon beim Filmen Anweisungen. Sag im Clip "Claude, füg hier oben rechts das GitHub-Logo ein" und
rede weiter: Claude setzt es um und schneidet die Anweisung raus.

## So funktioniert es

```
Rohclip ──npm run intake──► Take (Stimme entrauscht, 1080x1920)
                       ├─ transcribe.py   faster-whisper, lokal, gebündelt (4 min Ton in ~2,5 min)
                       └─ align.py        Wortzeiten per wav2vec2 auf den Frame genau
schnitt.json ──npm run schnitt──► cut.json   Sätze als Text: was im Text fehlt, fliegt raus
                       └─ fillerscan      findet "ähs", die Whisper nicht aufgeschrieben hat
Video.tsx (Remotion) ──► npm run vorschau    10-s-Stücke mit Cache, nur Geändertes neu
                       ├─ npm run sync    kommt jede Grafik wirklich auf ihrem Wort? (gemessen am Video)
                       └─ npm run pacing  wo passiert länger als 2 s nichts?
npm run final ──► Master, Post- und Chat-Version, -14 LUFS
                       └─ npm run checks  Ausreißer-Frames, Lautheit, Effekte unter der Stimme
```

**Warum nach Text schneiden?** Weil Claude so nie ein Wort verliert und nie mitten in einem Wort schneidet. Die
Fassung, die du wählst, ist ein Text; `schnitt.py` richtet ihn am Transkript aus. Alles, was im Text fehlt (ein "äh",
ein Versprecher, ein "Dann,"), wird zu einem Schnitt. Danach prüft es, ob die Untertitel Wort für Wort deinem Text
entsprechen.

**Warum Wort-Ausrichtung?** Whisper schätzt Wortzeiten und liegt 0,1-0,3 s daneben. Eine Grafik, die darauf gesetzt
wird, wirkt asynchron. `align.py` legt jedes Wort auf seinen echten ersten Laut, und jede Grafik kommt 2 Frames
davor. Das ist der Unterschied zwischen "irgendwie passend" und "auf den Punkt".

## Ordner

| Ordner / Datei | Inhalt |
| --- | --- |
| `.claude/skills/faber-cut/` | der Skill: `SKILL.md` (der Ablauf) und `stil.md` (**dein Geschmack**, wächst mit) |
| `.claude/skills/skill-onboarding/` | das Onboarding beim ersten Start |
| `faber-cut.json` | deine Einstellungen aus dem Onboarding (lokal/online, Sprache, Gemini, Drive-Ordner) |
| `tools/` | die Werkzeuge (Python und Node), jedes mit Erklärung im Kopf der Datei |
| `src/lib/` | Remotion-Bausteine: Zeitachse (`schnitt.ts`), Untertitel, Titel, Splitscreen, J-Cuts, `stil.ts` |
| `src/projekte/_vorlage/` | Vorlage für jedes neue Video |
| `src/projekte/<projekt>/` | deine Videos: `schnitt.json`, `cut.json`, `Video.tsx` |
| `public/projekte/` | deine Takes und Transkripte (bleiben privat, nicht im Git) |
| `eingang/` | hier legst du Rohclips ab (nicht im Git) |
| `beispiel/` | der Probelauf: Rohclip `probe.mp4` (Stimme synthetisch, mit „Ähm“ und Pausen) und `Probelauf.tsx`, das Beispiel-Video, das zeigt, was faber-cut kann |
| `out/` | Vorschauen und fertige Videos |

## Befehle (macht normalerweise Claude für dich)

Alle Befehle sind gleich auf Windows, macOS und Linux:

```bash
npm run setup                                   # einrichten (einmal; wiederholbar)
npm run doktor                                  # prüfen, ob alles bereit ist
npm run probelauf                               # Beispielclip einmal komplett schneiden
npm run intake -- eingang/clip.mov video1 t1    # Clip vorbereiten, transkribieren, ausrichten
npm run schnitt -- src/projekte/video1/schnitt.json
npm run fillerscan -- src/projekte/video1/cut.json
npm run studio                                  # Remotion Studio zum Durchklicken
npm run vorschau -- Video1                      # Vorschau (halbe Größe, mit Cache)
npm run sync -- out/vorschau/Video1.mp4 src/projekte/video1/cut.json github remotion
npm run pacing -- out/vorschau/Video1.mp4 src/projekte/video1/cut.json
npm run final -- Video1                         # Vollversion
npm run checks -- out/final/Video1.mp4 --stems Video1
```

## Optional: Gemini als zweite Meinung

Mit einem kostenlosen Schlüssel von [Google AI Studio](https://aistudio.google.com/apikey) lässt Claude jede Vorschau von
Gemini ansehen und anhören (`npm run gemini`, Prompt in `prompts/review.md`). Das läuft immer zweimal, weil Gemini sich
oft irrt, und Claude prüft jede Behauptung nach, bevor es etwas ändert.

Der Schlüssel kommt lokal in die Datei `.env` (`GEMINI_API_KEY=…`, nicht im Git) und online in die
Umgebungsvariablen der Cloud-Umgebung. Das Onboarding zeigt dir beides.

Achtung: Dafür geht die Vorschau an Google, und beim kostenlosen Schlüssel darf Google sie zur Verbesserung seiner
Dienste nutzen.

## Gut zu wissen

- **Dauer** (gemessen auf einem normalen Server):
  - Einrichten: 5-15 Minuten, je nach Internet.
  - Probelauf: ~3 Minuten.
  - 4K-Clip von 40 s: Vorbereiten ~6 Minuten, Vorschau ~40 s für 15 s Video, Vollversion ~2,5 Minuten.
  - Video von 1:45: Vorschau ~4 Minuten, Vollversion ~8 Minuten.
- **Getestet** wird jede Änderung automatisch auf Windows, macOS und Linux: Einrichtung, Doktor und Probelauf
  (GitHub Actions, siehe `.github/workflows/test.yml`).
- **Remotion** ist für Einzelpersonen und kleine Firmen (bis 3 Personen) kostenlos; größere Firmen brauchen eine
  [Remotion-Lizenz](https://www.remotion.dev/license).
- **Sprachen:** Deutsch und Englisch sind eingerichtet. Für andere Sprachen nimmt `npm run ausrichten -- … --modell`
  jedes wav2vec2-CTC-Modell von Hugging Face.
- Schrift: [Geist](https://vercel.com/font) (SIL Open Font License). Die Soundeffekte sind selbst synthetisiert und frei.

## Lizenz

MIT, siehe [LICENSE](LICENSE). Nimm es, bau es um, mach es zu deinem.
