"""Pacing-Prüfung am fertigen Render (Regel: alle 1,5-2 s passiert etwas im Bild).
  - Bild: Frames, in denen eine Grafik erscheint, sich bewegt oder wechselt (außerhalb der Untertitel-Bänder);
    listet jede Strecke über --max Sekunden ohne so ein Ereignis;
  - Sprache: Pausen ab 0,25 s zwischen Wörtern (aus der cut.json). Achtung: CTC-Wortenden liegen eher früh, echte
    Stille am Ton des Renders nachmessen.

  npm run pacing -- out/vorschau/<id>.mp4 src/projekte/<projekt>/cut.json [--max 2.0]
"""
import json, subprocess, sys

import numpy as np

mp4, cut_path = sys.argv[1], sys.argv[2]
MAX = float(sys.argv[sys.argv.index("--max") + 1]) if "--max" in sys.argv else 2.0
FPS = 30

d = json.load(open(cut_path, encoding="utf-8"))
K, at = [], 0
for k in d["keeps"]:
    K.append((k, at)); at += round(k["to"] * FPS) - round(k["from"] * FPS)


def out(src, t):
    for k, a in K:
        if k["src"] == src and k["from"] - 0.03 <= t <= k["to"] + 0.06:
            return a + (t - k["from"]) * FPS


probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                        "-of", "csv=p=0", mp4], capture_output=True, text=True).stdout.strip().split(",")
W, H = int(probe[0]), int(probe[1])
w, h = W // 4, H // 4
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-vf", f"scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
                     capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.int16)
y = lambda px: int(h * px / 1920)
# everything but the caption bands (split: y 862-960; full screen: y 1320-1480)
mask = np.ones(h, bool); mask[y(862):y(960)] = False; mask[y(1320):y(1480)] = False
B = 6
f = np.abs(np.diff(fr[:, mask], axis=0))
n, hh, ww = f.shape
f = f[:, : hh // B * B, : ww // B * B].reshape(n, hh // B, B, ww // B, B).mean(axis=(2, 4))
events = []
for i in range(n):
    quiet = f[max(0, i - 15):i].max(axis=0) < 12 if i else np.ones(f.shape[1:], bool)
    if ((f[i] > 25) & quiet).sum() >= 3:
        events.append(i + 1)
events = [0] + events + [len(fr) - 1]
print(f"Bild: {len(events) - 2} Ereignisse; Strecken über {MAX:.1f} s ohne Ereignis:")
for a, b in zip(events, events[1:]):
    if (b - a) / FPS > MAX:
        print(f"  {a / FPS:6.2f}-{b / FPS:6.2f} s  ({(b - a) / FPS:.1f} s)")

words = [(x["text"], out(x["src"], x["start"]), out(x["src"], x["end"])) for x in d["words"] if x["text"]]
words = [(t, a, b) for t, a, b in words if a is not None and b is not None]
print("Sprache: Pausen ab 0,25 s zwischen Wörtern")
for (t1, a1, b1), (t2, a2, b2) in zip(words, words[1:]):
    gap = (a2 - b1) / FPS
    if gap >= 0.25:
        print(f"  {b1 / FPS:6.2f} s  {gap:.2f} s  …{t1} | {t2}…")
