"""Baut aus einer Schnitt-Datei (die Sätze als Text, in der gewünschten Reihenfolge) die cut.json für Remotion.

    python tools/schnitt.py src/projekte/<projekt>/schnitt.json

Ablauf: jeder Satz wird am Transkript ausgerichtet (Wörter, die im Text fehlen, fliegen raus: Füllwörter, Versprecher,
ein "Dann,"), dann werden Pausen ab "min_gap" herausgeschnitten. Die Wörter für Untertitel und Grafiken kommen direkt
aus dem ausgerichteten Transkript, in Quell-Sekunden, also auf den Frame genau. Am Ende prüft das Skript, ob die
Untertitel Wort für Wort dem gewählten Text entsprechen, ob die Reihenfolge stimmt und ob es Mini-Schnitte gibt.

Schnitt-Datei (JSON):
{
  "projekt": "tag5", "sprache": "de", "fps": 30,
  "pausen": {"min_gap": 0.3, "pre": 0.04, "post": 0.06},
  "start": {"ab": 9.3},                    optional: das Video beginnt früher (z. B. das Handy wird hingestellt)
  "saetze": [ {"take": "t1", "ab": 10.4, "text": "So lässt du jedes Video von Claude schneiden."}, ... ],
  "ende": {"bis": 86.95},                  optional: der letzte Satz läuft weiter (das Bild bleibt unter der Endgrafik)
  "korrekturen": [["t1", 47.2, "Drive.", "Drive.“"], ["t1", 40.56, "dass", ""]],   Untertitel: "" nimmt ein Wort raus
  "jcut": {"aus": [3], "an": []}           optional: J-Cut auf Schnittstück i erzwingen oder verbieten
}
"ab" ist die Sekunde im Take, ab der der Satz gesucht wird (kurz vor seinem ersten Wort). Ein Satz kann beliebig
umgestellt werden (z. B. der Follow-Aufruf ans Ende): einfach in der Liste verschieben.
"""
import json
import os
import sys

from fclib import ROOT, Take, build_pages, is_filler, norm, ranges_for, tight

spec_path = sys.argv[1]
spec = json.load(open(spec_path))
P = spec["projekt"]
LANG = spec.get("sprache", "de")
FPS = spec.get("fps", 30)
gap = {"min_gap": 0.3, "pre": 0.04, "post": 0.06, **spec.get("pausen", {})}
tid = lambda take: f"{P}/{take}"
f = lambda s: round(s * FPS)

# 1. Sätze -> Schnittstücke
keeps = []
for si, s in enumerate(spec["saetze"]):
    t = tid(s["take"])
    for a, b, _ in ranges_for(t, s["text"], LANG, start=s.get("ab", 0.0)):
        for u, v in tight(t, a, b, LANG, **gap):
            keeps.append({"src": t, "from": u, "to": v, "satz": si})
if "start" in spec:
    k0 = keeps[0]
    if spec["start"]["ab"] >= k0["from"]:
        raise SystemExit(f"start.ab ({spec['start']['ab']}) muss vor dem ersten Wort liegen ({k0['from']:.2f} s)")
    k0["from"] = spec["start"]["ab"]
if "ende" in spec:
    keeps[-1]["to"] = spec["ende"]["bis"]
for a, b in zip(keeps, keeps[1:]):            # derselbe Take, wenige ms Überlappung: nie einen Laut doppelt spielen
    if a["src"] == b["src"] and b["from"] < a["to"] <= b["to"]:
        b["from"] = a["to"]
for i in spec.get("jcut", {}).get("aus", []):
    keeps[i]["jcut"] = False
for i in spec.get("jcut", {}).get("an", []):
    keeps[i]["jcut"] = True

# 2. Wörter aus dem (ausgerichteten) Transkript, in der Reihenfolge des Schnitts
words, at, used = [], 0, set()
for ki, k in enumerate(keeps):
    tk = Take.get(k["src"])
    for wi, w in enumerate(tk.words):
        if (k["src"], wi) in used or is_filler(w["text"], LANG):
            continue
        if k["from"] - 0.03 <= w["start"] <= k["to"] - 0.02:
            used.add((k["src"], wi))
            words.append({"text": w["text"], "_orig": w["text"], "src": k["src"], "start": round(w["start"], 3),
                          "end": round(min(w["end"], k["to"]), 3), "_k": ki,
                          "_t0": (at + f(w["start"]) - f(k["from"])) / FPS,
                          "_t1": (at + f(min(w["end"], k["to"])) - f(k["from"])) / FPS})
    at += f(k["to"]) - f(k["from"])
for take, sec, von, zu in spec.get("korrekturen", []):
    cand = [w for w in words if w["src"] == tid(take) and w["text"] == von and abs(w["start"] - sec) < 0.6]
    if not cand:
        raise SystemExit(f"korrekturen: kein Wort {von!r} bei {sec} s in {take}")
    min(cand, key=lambda w: abs(w["start"] - sec))["text"] = zu
# 3. Prüfungen (gegen den Text des Transkripts, vor den Korrekturen)
problems = []
for si, s in enumerate(spec["saetze"]):
    want = [norm(x) for x in s["text"].split() if norm(x) and not is_filler(x, LANG)]
    got = [norm(w["_orig"]) for w in words if keeps[w["_k"]]["satz"] == si]
    if want != got:
        problems.append(f"Satz {si + 1}: Untertitel weichen vom Text ab\n   Text:       {' '.join(want)}\n"
                        f"   Untertitel: {' '.join(got)}")
for a, b in zip(words, words[1:]):
    if a["src"] == b["src"] and b["start"] < a["start"] and a["_k"] == b["_k"]:
        problems.append(f"Reihenfolge: {a['text']!r} ({a['start']}) vor {b['text']!r} ({b['start']})")
for i, k in enumerate(keeps):
    n = sum(1 for w in words if w["_k"] == i)
    if k["to"] - k["from"] < 0.8 and 0 < n < len(spec["saetze"][k["satz"]]["text"].split()):
        problems.append(f"Mini-Schnitt: Stück {i} ({k['from']:.2f}-{k['to']:.2f} s, {n} Wörter) ist kürzer als 0,8 s")

# 4. Untertitel-Seiten und Ausgabe
words = [w for w in words if w["text"]]
pages = build_pages([{"text": w["text"], "t0": w["_t0"], "t1": w["_t1"]} for w in words], LANG)
out = {
    "projekt": P, "fps": FPS, "sprache": LANG,
    "keeps": [{k2: v for k2, v in k.items() if k2 != "satz"} for k in keeps],
    "words": [{k2: v for k2, v in w.items() if not k2.startswith("_")} for w in words],
    "pages": [len(p) for p in pages],
}
dst = os.path.join(os.path.dirname(os.path.abspath(spec_path)), "cut.json")
json.dump(out, open(dst, "w"), ensure_ascii=False, indent=1)
aligned = all(Take.get(tid(t)).aligned for t in {s["take"] for s in spec["saetze"]})
print(f"{len(keeps)} Schnittstücke, {len(words)} Wörter, {len(pages)} Untertitel-Seiten, {at / FPS:.2f} s -> "
      f"{os.path.relpath(dst, ROOT)}")
if not aligned:
    print("Hinweis: Wortzeiten sind von Whisper (bis 0,3 s daneben). Für Grafiken auf dem Wort erst tools/align.py.")
for p in problems:
    print("PRÜFEN:", p)
sys.exit(1 if problems else 0)
