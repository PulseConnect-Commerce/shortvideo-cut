"""Abschlussprüfung der Vollversion, gemessen statt gefühlt.

    npm run checks -- out/final/<id>.mp4 [--stems <Komposition>]

  1. Ausreißer-Frames: ein einzelner Frame, der sich von beiden Nachbarn unterscheidet, während die sich gleichen
     (weiße Blitze, ein falscher Frame an einem Schnitt);
  2. Lautheit: -14 LUFS (±0,5) und True Peak höchstens -1 dB;
  3. Tonlöcher: digitale Stille (unter -90 dB) mitten im Video hört man als Sprung, auch wenn sie nur 10 ms dauert
     (ein Schnitt ohne Überblendung, ein Stück mit AAC-Vorlauf); nur die letzte halbe Sekunde darf still sein;
  4. mit --stems: rendert Stimme und Effekte getrennt (nur Ton, schnell) und prüft, dass jeder Effekt in seinen
     lautesten 100 ms mindestens 6 dB unter dem Sprech-Pegel bleibt.
Gibt am Ende OK oder die Liste der Probleme aus (Exit-Code 1).
"""
import argparse
import os
import re
import subprocess
import tempfile

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--stems")
o = ap.parse_args()
problems = []

# 1. Ausreißer-Frames
raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", o.video, "-vf", "scale=135:240,format=gray", "-f", "rawvideo", "-"],
                     capture_output=True, check=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, 240, 135).astype(np.int16)
d = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))
nb = np.abs(f[2:] - f[:-2]).mean(axis=(1, 2))
spikes = [i + 1 for i in range(len(nb)) if d[i] > 8 and d[i + 1] > 8 and nb[i] < d[i] * 0.35]
print(f"Frames: {len(f)}, Ausreißer: {spikes or 'keine'}")
if spikes:
    problems.append(f"Ausreißer-Frames bei {spikes} (Frame / fps = Sekunde): ansehen")

# 2. Lautheit
r = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-nostats", "-i", o.video, "-af", "ebur128=peak=true", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])
peak = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r)[-1])
print(f"Lautheit: {lufs:.1f} LUFS, True Peak {peak:.1f} dB")
if abs(lufs + 14) > 0.5:
    problems.append(f"Lautheit {lufs:.1f} LUFS statt -14 (npm run final normalisiert)")
if peak > -0.9:
    problems.append(f"True Peak {peak:.1f} dB über -1 dB")

# 3. Tonlöcher (5-ms-Fenster)
pcm = np.frombuffer(subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", o.video, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"],
                                   capture_output=True, check=True).stdout, np.float32)
n = len(pcm) // 240
db = 20 * np.log10(np.sqrt((pcm[: n * 240].reshape(n, 240).astype(np.float64) ** 2).mean(1)) + 1e-10)
holes = sorted({round(float(i) * 0.005, 2) for i in np.where(db[: max(0, n - 100)] < -90)[0]})
runs = [t for i, t in enumerate(holes) if i == 0 or t - holes[i - 1] > 0.02]
print(f"Tonlöcher: {runs or 'keine'}")
if runs:
    problems.append(f"Tonlöcher (digitale Stille) bei {runs} s: Schnitt ohne Überblendung? anhören")


# 4. Effekte unter der Stimme
def load(path):
    pcm = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32)


if o.stems:
    tmp = tempfile.mkdtemp()
    for name, props in [("stimme", '{"sfx":false}'), ("effekte", '{"voice":false}')]:
        subprocess.run(["node", os.path.join(ROOT, "node_modules", "@remotion", "cli", "remotion-cli.js"), "render", o.stems, os.path.join(tmp, f"{name}.wav"), "--codec=wav",
                        f"--props={props}", "--log=error"], check=True)
    v, s = load(os.path.join(tmp, "stimme.wav")), load(os.path.join(tmp, "effekte.wav"))
    win = 4800
    n = min(len(v), len(s)) // win
    vdb = np.array([20 * np.log10(np.sqrt(np.mean(v[i * win:(i + 1) * win] ** 2)) + 1e-9) for i in range(n)])
    sdb = np.array([20 * np.log10(np.sqrt(np.mean(s[i * win:(i + 1) * win] ** 2)) + 1e-9) for i in range(n)])
    speech = np.median(vdb[vdb > -40]) if (vdb > -40).any() else -20
    hits = [i for i in range(1, n - 1) if sdb[i] > -60 and sdb[i] >= sdb[i - 1] and sdb[i] >= sdb[i + 1]]
    loud = sorted(((sdb[i] - speech, i / 10) for i in hits), reverse=True)[:3]
    print(f"Sprech-Pegel {speech:.1f} dB; lauteste Effekte gegen die Stimme: "
          + ", ".join(f"{dv:+.1f} dB bei {t:.1f} s" for dv, t in loud))
    for dv, t in loud:
        if dv > -6:
            problems.append(f"Effekt bei {t:.1f} s nur {-dv:.1f} dB unter der Stimme (Ziel ≥ 6 dB): volume senken")

print("OK" if not problems else "\n".join("PROBLEM: " + p for p in problems))
raise SystemExit(1 if problems else 0)
