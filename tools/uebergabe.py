"""Übergabekarte des Cutters an den Prüfer (Pipeline Cutter -> Prüfer -> Planer, seine Vorgabe 2026-10-18; Ablauf in
.claude/skills/faber-cut/pipeline.md).

    npm run uebergabe -- <projekt> <Komposition> [--format news|face|hero] [--titel "…"]

Legt src/projekte/<projekt>/uebergabe.md an. Den Block zwischen den auto-Markern füllt das Werkzeug (Datei, Länge,
Auflösung aus dem fertigen Video, sonst aus cut.json; der Untertiteltext mit ungefährer Sekunde im Video, so wie die
Wörter in cut.json stehen). Läuft es auf einer vorhandenen Karte, erneuert es nur diesen Block und lässt alles andere
stehen. Den Rest füllt der Cutter: Titel, Plattformen, Termin laut Kalender, Briefing-Checkliste, Caption-Entwürfe,
Quellen, Entscheidungen und offene Fragen. Was noch "…" enthält, meldet `npm run pruefen` als offen.
"""
import argparse
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
START, ENDE = "<!-- auto:start (npm run uebergabe) -->", "<!-- auto:end -->"

ap = argparse.ArgumentParser()
ap.add_argument("projekt")
ap.add_argument("komposition")
ap.add_argument("--format", choices=["news", "face", "hero"])
ap.add_argument("--titel")
o = ap.parse_args()

pdir = os.path.join(ROOT, "src", "projekte", o.projekt)
cut = json.load(open(os.path.join(pdir, "cut.json")))
video = os.path.join(ROOT, "out", "final", f"{o.komposition}.mp4")


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height,r_frame_rate:format=duration", "-of", "json", path],
                       capture_output=True, text=True)
    j = json.loads(r.stdout or "{}")
    s, f = (j.get("streams") or [{}])[0], j.get("format", {})
    return s.get("width"), s.get("height"), s.get("r_frame_rate"), float(f.get("duration", 0))


# Sekunde im Video: Länge der Schnittstücke davor plus Abstand zum Anfang des eigenen Stücks
offsets, t = [], 0.0
for k in cut["keeps"]:
    offsets.append(t)
    t += k["to"] - k["from"]
laenge_schnitt = t


def im_video(w):
    for k, off in zip(cut["keeps"], offsets):
        if k["src"] == w["src"] and k["from"] - 0.05 <= w["start"] <= k["to"] + 0.05:
            return off + max(0.0, w["start"] - k["from"])
    return None


zeilen, satz, beginn = [], [], None
for w in cut["words"]:
    if not satz:
        beginn = im_video(w)
    satz.append(w["text"])
    if re.search(r"[.?!]$", w["text"]):
        zeilen.append((beginn, " ".join(satz)))
        satz = []
if satz:
    zeilen.append((beginn, " ".join(satz)))

if os.path.exists(video):
    b, h, fps, dauer = probe(video)
    datei = f"`out/final/{o.komposition}.mp4` (Master), `-post.mp4` (Plattformen), `-chat.mp4` (Chat)"
    technik = f"{b}x{h}, {fps.replace('/1', '')} fps, {dauer:.1f} s"
else:
    datei = f"`out/final/{o.komposition}.mp4` fehlt noch (erst `npm run final -- {o.komposition}`)"
    technik = f"laut cut.json ca. {laenge_schnitt:.1f} s"

auto = "\n".join([
    START,
    f"- **Projekt / Komposition:** `{o.projekt}` / `{o.komposition}`",
    f"- **Datei:** {datei}",
    f"- **Technik:** {technik}",
    f"- **Wörter im Video:** {len(cut['words'])}",
    "",
    "### Untertiteltext (so steht er im Video)",
    "",
    *[f"- {'%5.1f s' % s if s is not None else '   ? s'}  {txt}" for s, txt in zeilen],
    ENDE,
])

karte = os.path.join(pdir, "uebergabe.md")
if os.path.exists(karte):
    alt = open(karte).read()
    if START in alt and ENDE in alt:
        neu = alt[:alt.index(START)] + auto + alt[alt.index(ENDE) + len(ENDE):]
    else:
        neu = alt.rstrip() + "\n\n" + auto + "\n"
    open(karte, "w").write(neu)
    print(f"✓ {os.path.relpath(karte, ROOT)}: technischer Block erneuert, der Rest blieb stehen")
    raise SystemExit(0)

fmt = (o.format or "…").upper()
vorlage = f"""# Übergabekarte: {o.titel or "…"}

Status: **zur Prüfung** (Cutter) <!-- danach: freigegeben / zurück (Prüfer), eingeplant (Planer) -->

- **Titel** (wie im Kalendertermin, auch Datei-, Ordner- und Doc-Name): {o.titel or "…"}
- **Format / Design:** {fmt} / …
- **Plattformen:** TikTok, Instagram Reel, YouTube Short
- **Termin laut Kalender:** … (Termin-Titel und Datum/Uhrzeit aus dem VERÖFFENTLICHUNGSPLAN; "keiner" wenn es keinen gibt)
- **Briefing:** … (Titel des Kalendertermins)

{auto}

## Briefing-Checkliste

<!-- jeder Punkt des Briefings eine Zeile: [x] umgesetzt (wo, Sekunde) oder [ ] nicht umgesetzt (warum) -->
- [ ] …

## Entscheidungen des Cutters

<!-- Variante (A/B/C), was weggelassen oder umgestellt ist, Sätze mit "ganz", Takes, Musik, Abweichungen vom Stil -->
- …

## Offene Fragen an Paul

<!-- unsichere Wörter, Regieanweisungen, fehlendes Material; "keine", wenn es keine gibt -->
- …

## Captions

TikTok-Titel (max. 90 Zeichen): …

### TikTok

```
…
```

### Instagram (Reels)

```
…
```

### YouTube (Shorts)

Titel (max. 100 Zeichen): …

```
…
```

## Quellen

- …
"""
open(karte, "w").write(vorlage)
print(f"✓ {os.path.relpath(karte, ROOT)} angelegt; jetzt alles mit … ausfüllen")
