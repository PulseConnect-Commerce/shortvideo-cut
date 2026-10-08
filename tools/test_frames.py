"""Frames der Werkzeuge = Frames der Timeline (src/lib/schnitt.ts, Math.round(s * fps)).

Läuft ohne Abhängigkeiten: python3 tools/test_frames.py. Ist Node da, wird jeder Millisekunden-Wert einer Minute bei
24, 25, 30 und 60 fps mit JavaScripts Math.round auf demselben double verglichen.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from frames import frame, js_round  # noqa: E402

# exakte Hälften: Python rundet zur geraden Zahl, Math.round nach oben
assert js_round(106.5) == 107 and round(106.5) == 106
assert js_round(2.5) == 3 and js_round(-2.5) == -2 and js_round(-2.6) == -3
assert frame(3.55, 30) == 107, frame(3.55, 30)  # 3.55 · 30 ist im double genau 106.5

if shutil.which("node"):
    for fps in (24, 25, 30, 60):
        secs = [i / 1000 for i in range(60001)]
        js = subprocess.run(
            ["node", "-e", f"const s=JSON.parse(require('fs').readFileSync(0,'utf8'));"
             f"process.stdout.write(JSON.stringify(s.map(x=>Math.round(x*{fps}))))"],
            input=json.dumps(secs), capture_output=True, text=True, check=True,
        )
        want = json.loads(js.stdout)
        got = [frame(s, fps) for s in secs]
        bad = [(s, w, g) for s, w, g in zip(secs, want, got) if w != g]
        assert not bad, f"{fps} fps: {bad[:5]}"
    print("Frames gleich: jede Millisekunde einer Minute bei 24/25/30/60 fps")
else:
    print("Node fehlt: nur die festen Fälle geprüft")
