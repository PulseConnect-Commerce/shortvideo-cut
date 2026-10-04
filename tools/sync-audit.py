"""Sync-Prüfung am fertigen Render: kommt jede Grafik wirklich auf ihrem Wort?
Gemessen wird das Video, nicht der Code: pro Stichwort der erste Frame, in dem in seinem Bereich etwas erscheint
(Bühne "s" ohne Untertitel und Schrittleiste, Brustzone "c" im Vollbild), im Fenster -12..+12 Frames um das Wort; dazu
ob der Ton dort wirklich einsetzt. Ziel: -4..+1 Frames (die Grafik kommt bis zu 0,1 s vor dem Laut).

  npm run sync -- out/vorschau/<id>.mp4 src/projekte/<projekt>/cut.json wort[:s|c] [wort ...]

Eine CHECK-Zeile ist oft eine andere Bewegung im Bereich (Hände, blinkender Cursor, die vorige Pille): vor jeder
Änderung den 8-Frame-Streifen um das Wort ansehen:
  ffmpeg -i <video> -vf "select='between(n,W-5,W+2)',scale=270:480,tile=8x1" -vsync 0 -frames:v 1 streifen.png
"""
import json, re, subprocess, sys

import numpy as np

mp4, cut_path, specs = sys.argv[1], sys.argv[2], sys.argv[3:]
FPS = 30
d = json.load(open(cut_path, encoding="utf-8"))
K, at = [], 0
for k in d["keeps"]:
    n = round(k["to"] * FPS) - round(k["from"] * FPS)
    K.append((k, at)); at += n


def out(src, t):
    for k, a in K:
        if k["src"] == src and k["from"] - 0.03 <= t <= k["to"] + 0.06:
            return a + (t - k["from"]) * FPS


words = [(w["text"], out(w["src"], w["start"])) for w in d["words"]]
words = [(t, a) for t, a in words if a is not None]
norm = lambda s: re.sub(r"[^a-zäöüß0-9]", "", s.lower())

probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                        "-of", "csv=p=0", mp4], capture_output=True, text=True).stdout.strip().split(",")
W, H = int(probe[0]), int(probe[1])
w, h = W // 4, H // 4   # small greyscale frames are enough to see a card appear
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-vf", f"scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
                     capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.int16)
# regions without the captions (y 868-960 in the split, 1340+ in full screen) and without the step bar (y < 400):
# a caption page or a step tile changing would read as a graphic
REG = {"s": (int(h * 400 / 1920), int(h * 862 / 1920)), "c": (int(h * 980 / 1920), int(h * 1320 / 1920))}
B = 6   # blocks of 6x6 px (24 px in 1080p): a small pill or one line of text is one or two blocks
def blockdiff(a, b):
    f = np.abs(np.diff(frames[:, a:b], axis=0))
    n, hh, ww = f.shape
    f = f[:, : hh // B * B, : ww // B * B].reshape(n, hh // B, B, ww // B, B).mean(axis=(2, 4))
    return f   # per frame, per block
blocks = {r: blockdiff(a, b) for r, (a, b) in REG.items()}

pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.float32)
spf = 48000 // FPS
db = 20 * np.log10(np.sqrt(np.array([np.mean(x[i * spf:(i + 1) * spf] ** 2) for i in range(len(x) // spf)])) + 1e-6)

after, rows = 0, []
for spec in specs:
    word, _, reg = spec.partition(":")
    reg = reg or "s"
    hit = next(((t, a) for t, a in words if word in norm(t) and a >= after), None)
    if not hit:
        print(f"{word:14s} nicht im Schnitt"); continue
    text, wa = hit; after = wa
    wf = int(round(wa))
    bl = blocks[reg]   # bl[i] = change from frame i to i+1
    lo, hi = max(0, wf - 12), min(len(bl) - 1, wf + 12)
    # a block "lights up" when it changes by more than 25 levels; it counts only if it did not flicker in the
    # 20 frames before the window (a blinking caret, a turning ring, his hands in the chest zone)
    quiet = bl[max(0, lo - 20):lo].max(axis=0) < 12 if lo > 0 else np.ones(bl.shape[1:], bool)
    burst = [i + 1 for i in range(lo, hi) if ((bl[i] > 25) & quiet).sum() >= 2]
    g = burst[0] if burst else None
    rise = db[wf + 2] - db[max(0, wf - 3)] if wf + 2 < len(db) else 0
    audio = "rise ok" if rise > 12 else ("—" if db[max(0, wf - 3)] > -40 else f"rise {rise:.0f} dB?")
    delta = None if g is None else g - wf
    ok = delta is not None and -4 <= delta <= 1
    rows.append(ok)
    print(f"{word:14s} word f{wf:5d}  graphic {'f%5d' % g if g is not None else '   —  '}  "
          f"Δ {('%+d' % delta) if delta is not None else ' ?':>3s} fr  audio {audio:12s} {'OK' if ok else 'CHECK'}")
print(f"{sum(rows)}/{len(rows)} Stichwörter im Bereich -4..+1 Frames")
