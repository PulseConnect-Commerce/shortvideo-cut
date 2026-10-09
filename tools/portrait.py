"""Porträt-Modus: der Hintergrund wird weichgezeichnet, die Person bleibt scharf (wie mit offener Blende).

  npm run portrait -- <projekt> [--staerke 20] [--alles]

Die Person wird mit Robust Video Matting freigestellt (MobileNetV3 als TorchScript, ~15 MB, lädt sich beim ersten Mal
von GitHub nach .tools/rvm/; läuft auf der CPU in halber Auflösung, ~6 Bilder pro Sekunde mit 4 Kernen). Bearbeitet
werden alle Takes des Projekts, aber nur die Stellen, die der Schnitt nutzt (src/projekte/<projekt>/cut.json), mit
0,5 s Rand; der Rest bleibt unverändert (--alles: der ganze Take). Das Original bleibt als <take>.orig.mp4 liegen, und
jeder Lauf geht wieder vom Original aus: nach einer Schnitt-Änderung, die neue Stellen nutzt, einfach noch einmal.
--staerke: Unschärfe des Hintergrunds (Gauß-Sigma in Pixeln bei 1080 Breite), Standard 20.
"""

import json
import os
import shutil
import subprocess
import sys
import time

import cv2
import numpy as np
import torch

from fclib import PROJEKTE, ROOT

args = [a for a in sys.argv[1:] if not a.startswith("--")]
if not args:
    sys.exit(__doc__)
projekt = args[0]
staerke = float(sys.argv[sys.argv.index("--staerke") + 1]) if "--staerke" in sys.argv else 20.0
if "--staerke" in sys.argv and str(sys.argv[sys.argv.index("--staerke") + 1]) in args:
    args.remove(sys.argv[sys.argv.index("--staerke") + 1])
alles = "--alles" in sys.argv
RAND = 0.5

MODELL = os.path.join(ROOT, ".tools", "rvm", "rvm_mobilenetv3_fp32.torchscript")
URL = "https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.torchscript"
if not os.path.exists(MODELL):
    os.makedirs(os.path.dirname(MODELL), exist_ok=True)
    if subprocess.run(["curl", "-fsSL", "--retry", "3", "-o", MODELL, URL]).returncode != 0:
        sys.exit(f"Freistellungs-Modell nicht geladen ({URL}); Internet prüfen (npm run doktor)")

cut_path = os.path.join(ROOT, "src", "projekte", projekt, "cut.json")
cut = json.load(open(cut_path, encoding="utf-8")) if os.path.exists(cut_path) else {"keeps": []}
takes_dir = os.path.join(PROJEKTE, projekt, "takes")
takes = sorted(f[:-4] for f in os.listdir(takes_dir) if f.endswith(".mp4") and not f.endswith(".orig.mp4"))
if not takes:
    sys.exit(f"Keine Takes in {takes_dir}")

torch.set_num_threads(os.cpu_count() or 4)
model = torch.jit.load(MODELL).eval()


def probe(path, entry):
    return subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", f"stream={entry}",
                           "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()


for take in takes:
    out = os.path.join(takes_dir, take + ".mp4")
    orig = os.path.join(takes_dir, take + ".orig.mp4")
    if not os.path.exists(orig):
        shutil.copy2(out, orig)
    W, H = (int(v) for v in probe(orig, "width,height").split(","))
    num, den = (int(v) for v in probe(orig, "r_frame_rate").split("/"))
    fps = num / den
    n = int(probe(orig, "nb_frames") or 0) or int(float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", orig],
        capture_output=True, text=True).stdout) * fps)
    # Bereiche (Frames), die der Schnitt aus diesem Take nutzt, mit Rand, zusammengefasst
    spans = sorted((max(0, int((k["from"] - RAND) * fps)), min(n, int((k["to"] + RAND) * fps) + 1))
                   for k in cut["keeps"] if k["src"] == f"{projekt}/{take}")
    if alles:
        spans = [(0, n)]
    if not spans:
        print(f"{take}: nicht im Schnitt, bleibt unverändert")
        continue
    merged = [list(spans[0])]
    for a, b in spans[1:]:
        if a <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], b)
        else:
            merged.append([a, b])
    todo = sum(b - a for a, b in merged)
    print(f"{take}: {todo} von {n} Frames werden freigestellt ({len(merged)} Bereiche)", flush=True)

    tmp = out + ".tmp.mp4"
    reader = subprocess.Popen(["ffmpeg", "-v", "error", "-i", orig, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                              stdout=subprocess.PIPE)
    writer = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                               "-r", f"{num}/{den}", "-i", "-", "-i", orig, "-map", "0:v", "-map", "1:a?",
                               "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-g", str(round(fps)),
                               "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709",
                               "-colorspace", "bt709", "-c:a", "copy", "-movflags", "+faststart", "-shortest", tmp],
                              stdin=subprocess.PIPE)
    size = W * H * 3
    sw, sh = W // 2, H // 2          # Freistellung in halber Auflösung, die Maske wird hochgerechnet
    bw, bh = W // 4, H // 4          # Unschärfe auf einem Viertel der Größe (schnell, und sie wird ohnehin weich)
    rec, inside, done, t0, i = [None] * 4, False, 0, time.time(), 0
    with torch.no_grad():
        while True:
            buf = reader.stdout.read(size)
            if len(buf) < size:
                break
            now = any(a <= i < b for a, b in merged)
            if now:
                if not inside:
                    rec = [None] * 4       # neuer Bereich: das Modell beginnt ohne Gedächtnis
                img = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
                small = cv2.resize(img, (sw, sh), interpolation=cv2.INTER_AREA)
                src = torch.from_numpy(small.copy()).permute(2, 0, 1)[None].float() / 255
                _, pha, *rec = model(src, *rec, 0.4)
                a = cv2.resize(pha[0, 0].numpy(), (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
                f = img.astype(np.float32)
                bg = cv2.resize(cv2.GaussianBlur(cv2.resize(f, (bw, bh), interpolation=cv2.INTER_AREA), (0, 0), staerke / 4),
                                (W, H), interpolation=cv2.INTER_LINEAR)
                buf = np.clip(a * f + (1 - a) * bg, 0, 255).astype(np.uint8).tobytes()
                done += 1
                if done % 300 == 0:
                    rate = done / (time.time() - t0)
                    print(f"  {take}: {done}/{todo} Frames, {rate:.1f}/s, noch ~{(todo - done) / rate / 60:.0f} min", flush=True)
            inside = now
            writer.stdin.write(buf)
            i += 1
    writer.stdin.close()
    reader.wait()
    if writer.wait() != 0:
        sys.exit(f"{take}: Kodieren fehlgeschlagen")
    os.replace(tmp, out)
    print(f"✓ {os.path.relpath(out, ROOT)} (Porträt, Original: {os.path.relpath(orig, ROOT)})", flush=True)
