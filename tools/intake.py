"""Bereitet einen Rohclip als Take vor (Windows, macOS, Linux):

    npm run intake -- <rohclip> <projekt> <take> [--sprache de] [--namen "Claude, Remotion"]

 - Stimme: entrauscht mit DeepFilterNet (falls installiert, siehe npm run setup), dann eine leichte Stimm-Kette
   (Hochpass, etwas Präsenz, De-Esser, sanfte Kompression, Limiter);
 - Bild: wird kopiert, nicht neu kodiert. Ist der Clip breiter als 1080 (4K) oder nicht 30 fps, wird eine
   1080x1920-Arbeitskopie mit 30 fps gerechnet: zwei parallele Vorschau-Renders mit 4K-Quellen haben den Browser
   abstürzen lassen, und kein Zoom geht über 110 %;
 - transkribiert parallel dazu und richtet danach die Wortzeiten aus.
Ergebnis: public/projekte/<projekt>/takes/<take>.mp4 und public/projekte/<projekt>/edit/transcripts/<take>.(aligned.)json
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHAIN = ("highpass=f=75,equalizer=f=200:t=q:w=0.9:g=1.5,equalizer=f=3200:t=q:w=1.2:g=-2.5,"
         "equalizer=f=6500:t=q:w=1.5:g=-1.5,deesser=i=0.3,"
         "acompressor=threshold=-24dB:ratio=2:attack=15:release=200:knee=6:makeup=3,alimiter=limit=0.89:level=false")

ap = argparse.ArgumentParser()
ap.add_argument("rohclip"); ap.add_argument("projekt"); ap.add_argument("take")
ap.add_argument("--sprache", default="de"); ap.add_argument("--namen", default="")
o = ap.parse_args()
if not os.path.exists(o.rohclip):
    sys.exit(f"Rohclip nicht gefunden: {o.rohclip}")


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def probe(entry):
    return subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", f"stream={entry}",
                           "-of", "csv=p=0", o.rohclip], capture_output=True, text=True, check=True).stdout.strip()


def deep_filter():
    exe = "deep-filter.exe" if os.name == "nt" else "deep-filter"
    local = os.path.join(ROOT, ".tools", exe)
    return local if os.path.exists(local) else shutil.which("deep-filter")


base = os.path.join(ROOT, "public", "projekte", o.projekt)
os.makedirs(os.path.join(base, "takes"), exist_ok=True)
os.makedirs(os.path.join(base, "edit", "transcripts"), exist_ok=True)
out = os.path.join(base, "takes", f"{o.take}.mp4")

with tempfile.TemporaryDirectory() as tmp:
    ff("-i", o.rohclip, "-map", "0:a:0", "-ac", "1", "-ar", "16000", os.path.join(tmp, "16k.wav"))
    print("Transkription läuft im Hintergrund …", flush=True)
    log = open(os.path.join(tmp, "tr.log"), "w", encoding="utf-8")
    tr = subprocess.Popen([sys.executable, os.path.join(ROOT, "tools", "transcribe.py"), os.path.join(tmp, "16k.wav"),
                           o.projekt, o.take, "--sprache", o.sprache, "--namen", o.namen], stdout=log, stderr=log)

    voice = os.path.join(tmp, "voice.wav")
    ff("-i", o.rohclip, "-map", "0:a:0", "-ac", "1", "-ar", "48000", voice)
    df = deep_filter()
    if df:
        r = subprocess.run([df, "-D", "-a", "18", "-o", os.path.join(tmp, "dn"), voice], capture_output=True)
        if r.returncode == 0 and os.path.exists(os.path.join(tmp, "dn", "voice.wav")):
            voice = os.path.join(tmp, "dn", "voice.wav")
            print("Stimme entrauscht (DeepFilterNet)", flush=True)
        else:
            print("Hinweis: DeepFilterNet ist fehlgeschlagen, Stimme ohne Entrauschen", flush=True)
    else:
        print("Hinweis: deep-filter nicht gefunden, Stimme ohne Entrauschen (npm run setup installiert es)", flush=True)

    w, fps = int(probe("width")), probe("r_frame_rate")
    if w <= 1080 and fps == "30/1":
        vopt = ["-c:v", "copy"]
    else:
        vopt = ["-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30",
                "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-g", "30", "-pix_fmt", "yuv420p"]
        print(f"Bild: {w}px / {fps} -> 1080x1920 @ 30 fps (dauert bei 4K ein paar Minuten)", flush=True)
    ff("-i", o.rohclip, "-i", voice, "-map", "0:v:0", "-map", "1:a:0", *vopt, "-af", CHAIN,
       "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", out)
    print(f"Take fertig: {os.path.relpath(out, ROOT)}", flush=True)

    rc = tr.wait()
    log.close()
    print(open(os.path.join(tmp, "tr.log"), encoding="utf-8").read().strip())
    if rc != 0:
        sys.exit("Transkription fehlgeschlagen")

r = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "align.py"), o.projekt, o.take, "--sprache", o.sprache])
if r.returncode != 0:
    print("Hinweis: Ausrichtung fehlgeschlagen, Whisper-Zeiten bleiben")
