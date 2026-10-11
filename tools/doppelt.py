"""npm run doppelt -- <projekt>

Findet versteckte Sprache im Schnitt: Lücken zwischen zwei behaltenen Wörtern innerhalb eines Schnittstücks, in denen
der Pegel Sprache zeigt (> -32 dB für >= 0,25 s). Dort steckt meist ein Wort, das die Transkription verschluckt hat
(Neuansatz, doppelt gesprochen)."""
import json, subprocess, sys, numpy as np
proj = sys.argv[1]
c = json.load(open(f"src/projekte/{proj}/cut.json"))
words = sorted(c["words"], key=lambda w: w["start"])
t = 0
for k in c["keeps"]:
    take = k["src"].split("/")[1]
    ws = [w for w in words if k["from"] <= w["start"] < k["to"]]
    src = f"public/projekte/{proj}/takes/{take}.orig.mp4"
    for a, b in zip(ws, ws[1:]):
        g0, g1 = a["end"] + 0.05, b["start"] - 0.05
        if g1 - g0 < 0.3: continue
        raw = subprocess.run(["ffmpeg","-v","error","-ss",str(g0),"-t",str(g1-g0),"-i",src,"-vn","-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
        x = np.frombuffer(raw, dtype=np.int16).astype(float)/32768
        n = 320; db = [20*np.log10(np.sqrt((x[i:i+n]**2).mean())+1e-9) for i in range(0, len(x)-n, n)]
        laut = sum(1 for v in db if v > -32) * 0.02
        if laut >= 0.25:
            print(f"Ausgabe {t + a['end'] - k['from']:6.1f} s | Quelle {g0:7.2f}-{g1:6.2f} | {laut:.2f} s Sprache zwischen '{a['text']}' und '{b['text']}'")
    t += k["to"] - k["from"]
