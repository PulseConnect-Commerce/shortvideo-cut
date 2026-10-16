"""Zweite Kontrolle vor dem Upload: hört das fertige Video neu ab und vergleicht jeden gesprochenen Satz mit dem Text,
den der Schnitt behalten wollte (Pauls Regel 2026-10-15: "diese Regel der zweiten Kontrolle alle gesprochenen Sätze vor
dem Upload berücksichtigen").

  npm run kontrolle -- out/final/<Komposition>.mp4 <projekt> [--modell medium]

Warum: Die Ausrichtung streckt ein Wort manchmal über einen abgebrochenen ersten Anlauf ("Amazon" 4,7-6,9 s, darin
"Amazon will…" und der Neuansatz), dann bleibt der Anlauf im Schnitt und doppelt/fillerscan sehen ihn nicht (so
passiert bei easyJet 2026-10-15: "Amazon will…" und "Und außerdem sollen…" doppelt). Whisper hört hier das fertige
Video ohne Stille-Filter und Bündelung, also auch Anläufe, und vergleicht Wort für Wort. Es hört in Abschnitten von
etwa 8 s (geteilt in Pausen), denn über das ganze Video verschluckt Whisper gern einen Anlauf ganz am Anfang.

Meldet (mit Zeit im fertigen Video):
  - DOPPELT: eine Wortfolge (ab 2 Wörtern), die kurz hintereinander zweimal gesprochen wird, im Plan aber nur einmal steht
  - ZUSÄTZLICH: gehörte Wörter, die nicht im Plan stehen (ab 2 Wörtern; einzelne sind meist Hörfehler)
  - FEHLT: geplante Wörter, die nicht zu hören sind (ab 3 Wörtern)
  - UNGEHÖRT: Sprache im Ton zwischen zwei gehörten Wörtern (ab 0,4 s), dort hat Whisper einen Anlauf verschluckt
  - GEDEHNT: ein gehörtes Wort, das viel länger dauert als seine Buchstaben brauchen (darin steckt oft ein Anlauf)
Jede Meldung anhören bzw. im Take nachsehen und im Schnitt beheben, bevor das Video hochgeladen wird. Exit-Code 1,
wenn etwas gemeldet wurde. KONTROLLE_DEBUG=1 zeigt dazu alle gehörten Wörter mit Zeit.
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import sys

from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("projekt")
ap.add_argument("--sprache", default="de"); ap.add_argument("--modell", default="medium")
o = ap.parse_args()
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cut = json.load(open(os.path.join(root, "src", "projekte", o.projekt, "cut.json"), encoding="utf-8"))


def norm(t):
    return re.sub(r"[^\wäöüß%]", "", t.lower())


# cut["words"] steht schon in der Reihenfolge des Videos (auch bei mehreren Takes oder umgestellten Sätzen)
plan = [norm(w["text"]) for w in cut["words"]]
plan = [w for w in plan if w]

model = WhisperModel(o.modell, device="cpu", compute_type="int8", cpu_threads=os.cpu_count() or 4)
# Abschnitte von ~12 s, jeweils in der Mitte einer Pause geteilt
err = subprocess.run(["ffmpeg", "-hide_banner", "-i", o.video, "-af", "silencedetect=n=-35dB:d=0.15", "-vn", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
dauer = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", err).group(3)) + 60 * int(re.search(r"Duration: (\d+):(\d+)", err).group(2))
pausen = [(float(a) + float(b)) / 2 for a, b in zip(re.findall(r"silence_start: ([\d.]+)", err), re.findall(r"silence_end: ([\d.]+)", err))]
grenzen = [0.0]
for p in pausen:
    if p - grenzen[-1] >= 8 and dauer - p > 4:
        grenzen.append(p)
grenzen.append(dauer)
gehoert = []
for a, b in zip(grenzen, grenzen[1:]):
    segs, _ = model.transcribe(o.video, language=o.sprache, word_timestamps=True, beam_size=5, vad_filter=False,
                               condition_on_previous_text=False, clip_timestamps=[a, b])
    gehoert += [(norm(w.word), w.start, w.end, w.word.strip()) for s in segs for w in (s.words or []) if a - 0.2 <= w.start < b]
gehoert = [g for g in gehoert if g[0]]
toks = [g[0] for g in gehoert]

meldungen = []
# 1) doppelt: n-Gramm (2-6 Wörter) zweimal kurz hintereinander, im Plan nicht doppelt
plan_txt = " " + " ".join(plan) + " "
gemeldet = set()
for n in range(6, 1, -1):
    for i in range(len(toks) - n):
        a = toks[i:i + n]
        for j in range(i + 1, min(i + n + 4, len(toks) - n + 1)):
            if toks[j:j + n] == a and gehoert[j][1] - gehoert[i][1] < 8 and i not in gemeldet:
                if (" " + " ".join(a + a) + " ") in plan_txt or plan_txt.count(" " + " ".join(a) + " ") > 1:
                    continue
                gemeldet.update(range(i, j + n))
                meldungen.append(f"DOPPELT    {gehoert[i][1]:6.1f} s  \"{' '.join(g[3] for g in gehoert[i:j + n])}\"")
# 3) Sprache zwischen zwei gehörten Wörtern (Whisper glättet einen Neuansatz manchmal weg)
import numpy as np
SR = 16000
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", o.video, "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                     capture_output=True).stdout
x = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
win = SR // 50
db = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(win) / win, mode="valid")[::win]) + 1e-9)
ref = np.percentile(db, 90)
for (_, s0, e0, w0), (_, s1, e1, w1) in zip(gehoert, gehoert[1:]):
    if s1 - e0 < 0.6:
        continue
    seg = db[int((e0 + 0.08) * 50):int((s1 - 0.08) * 50)]
    laut = float((seg > ref - 20).sum()) / 50
    if laut >= 0.4:
        meldungen.append(f"UNGEHÖRT   {e0:6.1f} s  {laut:.1f} s Sprache zwischen \"{w0}\" und \"{w1}\"")
for g, s0, e0, w0 in gehoert:
    if e0 - s0 > max(1.0, 0.1 * len(g) + 0.5):
        meldungen.append(f"GEDEHNT    {s0:6.1f} s  \"{w0}\" dauert {e0 - s0:.1f} s")
# 2) Vergleich mit dem Plan
sm = difflib.SequenceMatcher(a=plan, b=toks, autojunk=False)
for op, a0, a1, b0, b1 in sm.get_opcodes():
    if op in ("insert", "replace") and b1 - b0 >= 2 and not set(range(b0, b1)) <= gemeldet:
        if op == "replace" and abs((b1 - b0) - (a1 - a0)) < 2:
            continue  # gleich lang ersetzt: meist verhört, kein Anlauf
        meldungen.append(f"ZUSÄTZLICH {gehoert[b0][1]:6.1f} s  \"{' '.join(g[3] for g in gehoert[b0:b1])}\""
                         + (f"  (Plan: \"{' '.join(plan[a0:a1])}\")" if a1 > a0 else ""))
    if op == "delete" and a1 - a0 >= 3:
        t = gehoert[min(b0, len(gehoert) - 1)][1] if gehoert else 0
        meldungen.append(f"FEHLT      {t:6.1f} s  \"{' '.join(plan[a0:a1])}\"")

print(f"{os.path.basename(o.video)}: {len(toks)} Wörter gehört, {len(plan)} geplant, "
      f"Übereinstimmung {sm.ratio() * 100:.0f} %")
for m in sorted(meldungen, key=lambda m: float(m.split("s")[0].split()[-1])):
    print("  " + m)
print("  ✓ keine Doppler oder Anläufe gefunden" if not meldungen else f"  {len(meldungen)} Stelle(n) prüfen")
if os.environ.get("KONTROLLE_DEBUG"):
    print(grenzen); print(" ".join(f"{g[3]}@{g[1]:.1f}" for g in gehoert))
sys.exit(1 if meldungen else 0)
