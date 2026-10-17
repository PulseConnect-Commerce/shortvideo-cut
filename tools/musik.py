"""Baut rechtefreie Hintergrundmusik selbst (Synthese mit numpy, nichts aus fremden Bibliotheken), wie die Effekte in
public/sfx/. Seine Vorgabe 2026-10-17: "Bitte füge ebenfalls zu jedem Video ganz leicht Hintergrund Musik ohne
Musikrechte hinzu, aber so, dass man mich immer noch sehr gut versteht."

    npm run musik            alle Stücke neu bauen
    npm run musik -- puls    nur eins

Stücke (je ~2 min, Takt-genau schleifbar):
  ruhig  80 BPM, Cmaj7-Am7-Fmaj7-G6, weiche Fläche, E-Piano-Arpeggio, Bass, ohne Schlagzeug (HERO, FACE)
  puls   92 BPM, Am7-Fmaj7-Cmaj7-G, E-Piano-Akkorde, Bass, leises Lo-Fi-Schlagzeug (FACE, NEWS)
  news  108 BPM, Dm-Bb-F-C, pulsierende Achtel, Fläche, leiser Viertel-Kick (NEWS/Reaction)

Der Sprachbereich 1-4 kHz ist im Mix abgesenkt und oben ab ~7 kHz weich abgeschnitten, damit die Stimme frei bleibt.
Ausgabe: public/musik/<name>.mp3 auf -20 LUFS; wie laut sie im Video liegt, regelt <Musik> (src/lib/bausteine.tsx).
"""
import os
import subprocess
import sys
import tempfile

import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "musik")


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n, a, d, sustain=0.0, r=0.0):
    """Hüllkurve: Anstieg a s, exponentielles Abklingen mit Zeitkonstante d s auf sustain, Ausklang r s"""
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * (sustain + (1 - sustain) * np.exp(-t / max(d, 1e-4)))
    if r > 0:
        k = int(r * SR)
        e[-k:] *= np.linspace(1, 0, k) ** 2
    return e


def piano(m, dur, vel, rng):
    """E-Piano: Sinus mit leiser werdenden Obertönen, kurzer Anschlag, leichtes Tremolo"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m) * (1 + rng.uniform(-0.0006, 0.0006))
    s = np.zeros(n)
    for h, (amp, dec) in enumerate([(1, 1.6), (0.35, 0.7), (0.12, 0.35), (0.05, 0.2)], start=1):
        s += amp * np.sin(2 * np.pi * f * h * t) * np.exp(-t / dec)
    s *= 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t)
    return vel * s * env(n, 0.004, 10, r=min(0.25, dur / 3))


def pad(ms, dur):
    """Fläche: je Ton drei leicht verstimmte, obertonarme Sägezähne, langsamer Anstieg"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in ms:
        for det in (-0.12, 0.0, 0.12):
            f = hz(m) * 2 ** (det / 12)
            for h in range(1, 7):
                s += np.sin(2 * np.pi * f * h * t + h) / (h * h)
    return s * env(n, 0.5, 100, r=1.3) / (len(ms) * 3)


def bass(m, dur, vel):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return vel * s * env(n, 0.01, 0.9, sustain=0.25, r=0.08)


def kick(vel):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 45 + 75 * np.exp(-t / 0.035)
    return vel * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def hat(vel, rng):
    n = int(0.08 * SR)
    x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))  # Hochpass
    return vel * 0.25 * x * np.exp(-np.arange(n) / SR / 0.018)


def snare(vel, rng):
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-t / 0.05) * 0.5 + np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.04)
    return vel * 0.5 * x


def add(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if i < len(buf):
        buf[i:j] += sig[: j - i]


def eq(x):
    """Mix-EQ im Frequenzraum: Hochpass 45 Hz, Absenkung im Sprachbereich, weicher Tiefpass ab ~7 kHz"""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    g *= 1 / (1 + (45 / np.maximum(f, 1)) ** 4)
    g *= 1 / (1 + (f / 7000) ** 4)
    g *= 1 - 0.5 * np.exp(-((np.log2(np.maximum(f, 1) / 2000)) ** 2) / (2 * 0.6**2))  # bis -6 dB um 2 kHz
    return np.fft.irfft(X * g, len(x))


STUECKE = {
    "ruhig": dict(bpm=80, takte=40, akkorde=[[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]],
                  baesse=[48, 45, 41, 43], art="arpeggio", drums=None),
    "puls": dict(bpm=92, takte=46, akkorde=[[57, 60, 64, 67], [53, 57, 60, 64], [60, 64, 67, 71], [55, 59, 62, 67]],
                 baesse=[45, 41, 48, 43], art="akkorde", drums="lofi"),
    "news": dict(bpm=108, takte=54, akkorde=[[62, 65, 69], [58, 62, 65], [53, 57, 60, 65], [60, 64, 67]],
                 baesse=[50, 46, 41, 48], art="achtel", drums="viertel"),
}


def baue(name):
    p = STUECKE[name]
    rng = np.random.default_rng(7)
    beat = 60 / p["bpm"]
    takt = 4 * beat
    total = p["takte"] * takt
    mus = np.zeros(int(total * SR) + SR)
    drum = np.zeros_like(mus)
    for k in range(p["takte"]):
        t0 = k * takt
        ch = p["akkorde"][k % 4]
        add(mus, 0.55 * pad(ch, takt + 1.3), t0 - 0.15 if k else t0)
        b = p["baesse"][k % 4]
        for i, (off, ln) in enumerate([(0, 1.5), (1.5, 1), (2.5, 1.5)] if p["art"] != "achtel" else [(0, 2), (2, 2)]):
            add(mus, bass(b, ln * beat, 0.5 if i == 0 else 0.38), t0 + off * beat)
        if p["art"] == "arpeggio":
            tones = ch + [ch[1] + 12, ch[2] + 12]
            for i in range(8):
                m = tones[(i * 2 + k) % len(tones)] + 12
                add(mus, piano(m, beat * 1.5, 0.22 * rng.uniform(0.8, 1.0), rng), t0 + i * beat / 2 + rng.uniform(0, 0.01))
        elif p["art"] == "akkorde":
            for off in (0, 1.5, 2.5) if k % 2 == 0 else (0, 2):
                for m in ch:
                    add(mus, piano(m, beat * 1.4, 0.16 * rng.uniform(0.85, 1.0), rng), t0 + off * beat + rng.uniform(0, 0.012))
        else:  # achtel
            for i in range(8):
                vel = 0.15 if i % 2 == 0 else 0.1
                for m in ch[:2]:
                    add(mus, piano(m + 12, beat * 0.45, vel, rng), t0 + i * beat / 2)
        if p["drums"] == "lofi" and k >= 1:
            swing = beat * 0.08
            for b4 in range(4):
                if b4 in (0, 2):
                    add(drum, kick(0.55), t0 + b4 * beat)
                if b4 in (1, 3):
                    add(drum, snare(0.28, rng), t0 + b4 * beat)
                add(drum, hat(0.35, rng), t0 + b4 * beat)
                add(drum, hat(0.22, rng), t0 + b4 * beat + beat / 2 + swing)
            if k % 2:
                add(drum, kick(0.35), t0 + 2.5 * beat + swing)
        elif p["drums"] == "viertel" and k >= 2:
            for b4 in range(4):
                add(drum, kick(0.4), t0 + b4 * beat)
                add(drum, hat(0.25, rng), t0 + b4 * beat + beat / 2)
    mix = eq(mus + 0.8 * drum)[: int(total * SR)]
    mix /= np.max(np.abs(mix)) + 1e-9
    mix *= 0.7
    os.makedirs(OUT, exist_ok=True)
    tmp = os.path.join(tempfile.mkdtemp(), f"{name}.f32")
    np.stack([mix, mix], axis=1).astype(np.float32).tofile(tmp)
    dst = os.path.join(OUT, f"{name}.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", tmp,
                    "-af", "aecho=0.8:0.6:45|90:0.18|0.1,loudnorm=I=-20:TP=-2:LRA=7", "-ar", "44100", "-b:a", "192k", dst],
                   check=True)
    print(f"✓ {os.path.relpath(dst, ROOT)}  ({total:.0f} s, {p['bpm']} BPM)")


for name in (sys.argv[1:] or list(STUECKE)):
    baue(name)
