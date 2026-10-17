"""Farbkorrektur pro Take, gemessen statt geschätzt. Seine Vorgabe 2026-10-17: "Und optimiere ebenfalls meine Farben im
Video, damit es professionell wirkt."

    npm run farbe -- <projekt> [take ...] [--nur-ansehen]

Misst an 12 Bildern des Takes:
  - Weißabgleich an den fast farblosen Flächen (Wand, Decke): Farbstich zu 60 % raus, dazu ein Hauch Wärme für die Haut,
    höchstens ±8 % je Kanal;
  - Belichtung am Gesicht (YuNet, wie npm run raster): Haut auf eine helle, natürliche Helligkeit (Luma ~0,58),
    Schwarz- und Weißpunkt aus den Perzentilen 0,5/99,5 (weiche Grenzen, nichts clippt);
  - Sättigung: Vibrance nur, wenn das Bild blass ist (schützt Hauttöne).
Das ist die Korrektur; der Look (Kontrast, Sättigung) kommt danach vom Design (`grade` in design.tsx / stil.ts).

Schreibt den korrigierten Take an seine Stelle (<take>.orig.mp4, falls es ihn gibt, sonst <take>.mp4), die Sicherung
als <take>.vor-farbe.mp4, und ein Vorher/Nachher-Bild nach out/farbe-<projekt>-<take>.jpg. Vor `npm run portrait`
laufen lassen; lag schon ein Porträt vor, danach `npm run portrait -- <projekt>` neu.
"""
import argparse
import json
import os
import shutil
import subprocess

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(ROOT, ".tools", "yunet.onnx")

ap = argparse.ArgumentParser()
ap.add_argument("projekt")
ap.add_argument("takes", nargs="*")
ap.add_argument("--nur-ansehen", action="store_true", help="nur messen und das Vorher/Nachher-Bild schreiben")
o = ap.parse_args()
tdir = os.path.join(ROOT, "public", "projekte", o.projekt, "takes")
takes = o.takes or sorted(f[:-4] for f in os.listdir(tdir)
                          if f.endswith(".mp4") and not any(s in f for s in (".orig.", ".vor-", ".tmp")))


def probe(path, key):
    return subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", key, "-of", "csv=p=0", path],
                          capture_output=True, text=True).stdout.strip()


def frame(path, t):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", path, "-frames:v", "1", "-vf", "scale=540:960",
                          "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(960, 540, 3) if len(raw) == 540 * 960 * 3 else None


def face(bgr):
    if not os.path.exists(MODEL):
        return None
    det = cv2.FaceDetectorYN.create(MODEL, "", (540, 960), 0.7, 0.3, 5000)
    _, faces = det.detect(bgr)
    if faces is None or len(faces) == 0:
        return None
    x, y, w, h = (int(v) for v in max(faces, key=lambda f: f[2] * f[3])[:4])
    # Wangen und Stirn, ohne Haare und Hintergrund
    return bgr[y + int(0.25 * h):y + int(0.8 * h), x + int(0.2 * w):x + int(0.8 * w)]


def messen(path):
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                               capture_output=True, text=True).stdout)
    imgs = [f for f in (frame(path, dur * (i + 0.5) / 12) for i in range(12)) if f is not None]
    px = np.concatenate([i.reshape(-1, 3) for i in imgs]).astype(np.float32) / 255
    hsv = cv2.cvtColor((px.reshape(-1, 1, 3) * 255).astype(np.uint8), cv2.COLOR_BGR2HSV).reshape(-1, 3).astype(np.float32)
    s, v = hsv[:, 1] / 255, hsv[:, 2] / 255
    neutral = px[(s < 0.15) & (v > 0.3) & (v < 0.95)]
    b, g, r = neutral.mean(0) if len(neutral) > 500 else px.mean(0)
    grau = (r + g + b) / 3
    # zu 60 % neutral, dann ein Hauch Wärme (Haut wirkt sonst kühl), höchstens ±8 %
    gain = np.clip((1 + 0.6 * (grau / np.array([r, g, b]) - 1)) * np.array([1.012, 1.0, 0.988]), 0.92, 1.08)  # R, G, B
    luma = 0.2126 * px[:, 2] * gain[0] + 0.7152 * px[:, 1] * gain[1] + 0.0722 * px[:, 0] * gain[2]
    lo, hi = np.percentile(luma, [0.5, 99.5])
    haut = [face(i) for i in imgs]
    haut = np.concatenate([h.reshape(-1, 3) for h in haut if h is not None and h.size]) if any(
        h is not None and h.size for h in haut) else None
    sat = float(np.median(s))
    m = dict(gain=[round(float(x), 4) for x in gain], schwarz=round(float(lo), 3), weiss=round(float(hi), 3), saettigung=round(sat, 3))
    if haut is not None:
        hb, hg, hr = (haut.astype(np.float32) / 255).mean(0)
        m["haut_luma"] = round(float(0.2126 * hr * gain[0] + 0.7152 * hg * gain[1] + 0.0722 * hb * gain[2]), 3)
    return m, imgs


def filterkette(m):
    lo = min(0.06, max(0.0, m["schwarz"] - 0.01))
    hi = max(0.94, min(1.0, m["weiss"] + 0.02))
    kette = [f"colorchannelmixer=rr={m['gain'][0]:.4f}:gg={m['gain'][1]:.4f}:bb={m['gain'][2]:.4f}",
             f"colorlevels=rimin={lo:.3f}:gimin={lo:.3f}:bimin={lo:.3f}:rimax={hi:.3f}:gimax={hi:.3f}:bimax={hi:.3f}"]
    if "haut_luma" in m:
        h = (m["haut_luma"] - lo) / (hi - lo)
        gamma = float(np.clip(np.log(0.58) / np.log(max(0.05, min(0.95, h))), 0.85, 1.25))
        if abs(gamma - 1) > 0.02:
            kette.append(f"eq=gamma={1 / gamma:.3f}")
    if m["saettigung"] < 0.28:
        kette.append(f"vibrance=intensity={min(0.18, (0.28 - m['saettigung']) * 1.5):.3f}")
    return ",".join(kette)


os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
for take in takes:
    src = os.path.join(tdir, f"{take}.orig.mp4")
    portrait_da = os.path.exists(src)
    if not portrait_da:
        src = os.path.join(tdir, f"{take}.mp4")
    m, imgs = messen(src)
    vf = filterkette(m)
    print(f"{take}: {json.dumps(m)}\n  Filter: {vf}")
    # Vorher/Nachher an drei Stellen
    tmp = os.path.join(ROOT, "out", f".farbe-{take}.png")
    reihe = []
    for img in imgs[2::4][:3]:
        cv2.imwrite(tmp, img)
        nach = subprocess.run(["ffmpeg", "-v", "error", "-i", tmp, "-vf", vf, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                              capture_output=True).stdout
        reihe.append(np.hstack([img, np.frombuffer(nach, np.uint8).reshape(img.shape)]))
    os.remove(tmp)
    bild = os.path.join(ROOT, "out", f"farbe-{o.projekt}-{take}.jpg")
    cv2.imwrite(bild, cv2.resize(np.hstack(reihe), None, fx=0.6, fy=0.6), [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(f"  Vorher/Nachher: {os.path.relpath(bild, ROOT)} (je links vorher, rechts nachher)")
    if o.nur_ansehen:
        continue
    backup = os.path.join(tdir, f"{take}.vor-farbe.mp4")
    if os.path.exists(backup):
        raise SystemExit(f"  {os.path.relpath(backup, ROOT)} gibt es schon: der Take ist bereits korrigiert")
    shutil.copy2(src, backup)
    out = src + ".tmp.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", backup, "-vf", vf, "-c:v", "libx264", "-crf", "12", "-preset", "medium",
                    "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-c:a", "copy", "-movflags", "+faststart", out], check=True)
    os.replace(out, src)
    print(f"  ✓ {os.path.relpath(src, ROOT)} korrigiert (Sicherung {os.path.basename(backup)})"
          + ("; jetzt npm run portrait -- " + o.projekt + " neu" if portrait_da else ""))
