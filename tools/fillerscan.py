"""Findet Stimme, die kein Wort des Transkripts abdeckt: Whisper lässt "äh", "ähm", "mh" und Atmer oft einfach weg,
dann kann der Text-Schnitt sie nicht entfernen und sie bleiben im Video ("es sind noch ein paar Füllwörter drin").

  npm run fillerscan -- src/projekte/<projekt>/cut.json [--db -32] [--min 0.10]

Misst pro Schnittstück den Ton in 20-ms-Fenstern und listet jede Stelle mit Stimme (länger als --min s), die kein
Wort abdeckt. "Stimme" heißt: höchstens 24 dB unter dem Pegel der Stimme in diesem Stück (wie beim Schnitt selbst,
so meldet der Kompressor des Intakes keine Atmer); --db setzt stattdessen eine feste Schwelle. Wortzeiten kommen aus
der Ausrichtung (<take>.aligned.json), sonst von Whisper. mit Quell- und Ausgabezeit; dazu Wörter, die viel länger dauern, als ihre Buchstaben
brauchen (darin versteckt sich oft ein "ähm"). Prüfen, dann den Satz in schnitt.json teilen oder enger setzen.
"""
import argparse, json, subprocess
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("cut"); ap.add_argument("--db", type=float, default=None)
ap.add_argument("--min", type=float, default=0.10)
o = ap.parse_args()
cut = json.load(open(o.cut, encoding="utf-8"))
FPS, SR, WIN = cut.get("fps", 30), 16000, 0.02

import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def words_of(src):
    slug, take = src.split("/")
    tdir = f"{ROOT}/public/projekte/{slug}/edit/transcripts"
    aligned = f"{tdir}/{take}.aligned.json"
    d = json.load(open(aligned if os.path.exists(aligned) else f"{tdir}/{take}.json", encoding="utf-8"))
    ws = d["words"] if "words" in d else [w for s in d["segments"] for w in s["words"]]
    return [(w["start"], w["end"], (w.get("text") or w.get("word") or "").strip()) for w in ws
            if (w.get("text") or w.get("word") or "").strip()]

at = 0
for k in cut["keeps"]:
    slug, take = k["src"].split("/")
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", str(k["from"]), "-to", str(k["to"]), "-i",
                          f"{ROOT}/public/projekte/{slug}/takes/{take}.mp4", "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(float) / 32768
    n = int(SR * WIN)
    db = np.array([20 * np.log10(np.sqrt((x[i:i + n] ** 2).mean()) + 1e-9) for i in range(0, len(x) - n, n)])
    ws = words_of(k["src"])
    covered = np.array([any(a - 0.06 <= k["from"] + i * WIN <= b + 0.06 for a, b, _ in ws) for i in range(len(db))])
    # whisper also stretches a short word over a filler next to it ("die" 39.23-40.49 s = "die … ähm"): flag words far
    # longer than their letters need
    for a, b, t in ws:
        if a < k["to"] and b > k["from"] and b - a > 0.3 + 0.09 * len(t):
            print(f"{k['src']} {a:.2f}-{b:.2f} s  gedehntes Wort {t!r} ({b - a:.2f} s): darin kann ein Füllwort oder eine Pause stecken")
    thr = o.db if o.db is not None else (np.percentile(db, 90) - 24 if len(db) else -32)
    loose = (db > thr) & ~covered
    i = 0
    while i < len(loose):
        if loose[i]:
            j = i
            while j < len(loose) and loose[j]: j += 1
            if (j - i) * WIN >= o.min:
                s = k["from"] + i * WIN
                print(f"{k['src']} {s:.2f}-{s + (j - i) * WIN:.2f} s  (out {at / FPS + i * WIN:.2f} s)  peak {db[i:j].max():.0f} dB"
                      + ("" if k.get("blooper") else ""))
            i = j
        else:
            i += 1
    at += round(k["to"] * FPS) - round(k["from"] * FPS)
