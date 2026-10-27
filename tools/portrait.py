"""Porträt-Modus: der Hintergrund wird weichgezeichnet, die Person bleibt scharf (wie mit offener Blende).

  npm run portrait -- <projekt> [--staerke 6] [--alles]

Die Person wird mit Robust Video Matting freigestellt (MobileNetV3 als TorchScript, ~15 MB, lädt sich beim ersten Mal
von GitHub nach .tools/rvm/; läuft auf der CPU in halber Auflösung, ~6 Bilder pro Sekunde mit 4 Kernen). Bearbeitet
werden alle Takes des Projekts, aber nur die Stellen, die der Schnitt nutzt (src/projekte/<projekt>/cut.json), mit
0,5 s Rand; der Rest bleibt unverändert (--alles: der ganze Take). Das Original bleibt als <take>.orig.mp4 liegen, und
jeder Lauf geht wieder vom Original aus: nach einer Schnitt-Änderung, die neue Stellen nutzt, einfach noch einmal.
--staerke: Unschärfe des Hintergrunds (Gauß-Sigma in Pixeln bei 1080 Breite), Standard 6: leicht, wie eine
Spiegelreflex mit offener Blende (der Hintergrund bleibt erkennbar); 20 zeichnet ihn ganz weich.

Hintergrund ersetzen (News: die Quelle hinter ihm, wie ein Greenscreen):
  --hintergrund <bild.png>@<von>-<bis>   (mehrfach möglich; von/bis in Sekunden im Take)
  --ausschnitt <scale>,<hoch>[,<x>]      der Bildausschnitt aus Video.tsx (z. B. 1.2,160 für
                                         translateY(-160px) scale(1.2) mit transformOrigin 50% 0%; x für
                                         translate(-x, -hoch), wie bild.x im Serien-Template)
Das Bild ist so gestaltet, wie es im fertigen Video aussehen soll (1080x1920, in Video-Koordinaten); es wird für den
Take so umgerechnet, dass es nach dem Ausschnitt wieder genau so dasteht. In diesen Sekunden steht er freigestellt vor
dem Bild statt vor seinem weichgezeichneten Zimmer.
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
staerke = float(sys.argv[sys.argv.index("--staerke") + 1]) if "--staerke" in sys.argv else 6.0
if "--staerke" in sys.argv and str(sys.argv[sys.argv.index("--staerke") + 1]) in args:
    args.remove(sys.argv[sys.argv.index("--staerke") + 1])
alles = "--alles" in sys.argv
RAND = 0.5
hintergruende = []  # (bild, von, bis)
for i, a in enumerate(sys.argv):
    if a == "--hintergrund":
        bild, zeit = sys.argv[i + 1].rsplit("@", 1)
        von, bis = (float(x) for x in zeit.split("-"))
        hintergruende.append((bild, von, bis))
        if sys.argv[i + 1] in args:
            args.remove(sys.argv[i + 1])
aus_scale, aus_hoch, aus_x = 1.0, 0.0, 0.0
if "--ausschnitt" in sys.argv:
    v = sys.argv[sys.argv.index("--ausschnitt") + 1]
    teile = [float(x) for x in v.split(",")]
    aus_scale, aus_hoch = teile[0], teile[1]
    aus_x = teile[2] if len(teile) > 2 else 0.0
    if v in args:
        args.remove(v)

MODELL = os.path.join(ROOT, ".tools", "rvm", "rvm_mobilenetv3_fp32.torchscript")
URL = "https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.torchscript"
if not os.path.exists(MODELL):
    os.makedirs(os.path.dirname(MODELL), exist_ok=True)
    if subprocess.run(["curl", "-fsSL", "--retry", "3", "-o", MODELL, URL]).returncode != 0:
        sys.exit(f"Freistellungs-Modell nicht geladen ({URL}); Internet prüfen (npm run doktor)")

cut_path = os.path.join(ROOT, "src", "projekte", projekt, "cut.json")
cut = json.load(open(cut_path, encoding="utf-8")) if os.path.exists(cut_path) else {"keeps": []}
takes_dir = os.path.join(PROJEKTE, projekt, "takes")
# Sicherungen wie <take>.vor-farbe.mp4 sind keine Takes
takes = sorted(f[:-4] for f in os.listdir(takes_dir)
               if f.endswith(".mp4") and not f.endswith(".orig.mp4") and ".vor-" not in f)
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
                               "-c:v", "libx264", "-preset", "fast", "-crf", "12", "-g", str(round(fps)),
                               "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709",
                               "-colorspace", "bt709", "-c:a", "copy", "-movflags", "+faststart", "-shortest", tmp],
                              stdin=subprocess.PIPE)
    size = W * H * 3
    sw, sh = W // 2, H // 2          # Freistellung in halber Auflösung, die Maske wird hochgerechnet
    bw, bh = W // 4, H // 4          # Unschärfe auf einem Viertel der Größe (schnell, und sie wird ohnehin weich)
    # Hintergründe in Take-Koordinaten: Video-Punkt X = (x - W/2) * s + W/2 - x_versatz, Y = y * s - hoch
    ersatz = []
    for bild, von, bis in hintergruende:
        b = cv2.cvtColor(cv2.imread(bild, cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)
        b = cv2.resize(b, (1080 * W // 1080, 1920 * H // 1920), interpolation=cv2.INTER_AREA)
        m = np.float32([[aus_scale, 0, W / 2 - W / 2 * aus_scale - aus_x * W / 1080], [0, aus_scale, -aus_hoch * H / 1920]])
        warped = cv2.warpAffine(b, m, (W, H), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)
        ersatz.append((int(von * fps), int(bis * fps) + 1, warped.astype(np.float32)))
        print(f"{take}: Hintergrund {os.path.basename(bild)} von {von} bis {bis} s", flush=True)
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
                eigen = next((e for a0, b0, e in ersatz if a0 <= i < b0), None)
                bg = eigen if eigen is not None else cv2.resize(
                    cv2.GaussianBlur(cv2.resize(f, (bw, bh), interpolation=cv2.INTER_AREA), (0, 0), staerke / 4),
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
