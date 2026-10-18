"""Technische Prüfung für den Prüfer der Pipeline (Cutter -> Prüfer -> Planer, seine Vorgabe 2026-10-18; Ablauf in
.claude/skills/faber-cut/pipeline.md). Ein Lauf, ein Bericht:

    npm run pruefen -- <Komposition> <projekt> [--format news|face|hero] [--schnell]

Prüft das fertige Video out/final/<Komposition>.mp4:
  - Datei und Technik: 1080x1920, Bildrate wie cut.json, H.264 4:2:0, AAC 48 kHz, Post-Fassung unter 47 MB;
  - Länge: passt zum Schnitt (cut.json) und zum Format (NEWS 45-80 s, FACE 40-75 s, HERO 55-180 s; über 180 s nimmt
    YouTube es nicht als Short);
  - Schwarzbilder (blackdetect) und stehendes Bild (freezedetect);
  - Helligkeit des Gesichts (Regel 5b: ~0,55-0,57, Warnung über 0,60 oder unter 0,48);
  - npm run checks --stems (Ausreißer, Lautheit -14 LUFS, Tonlöcher, Effekte und Musik unter der Stimme) und
    npm run kontrolle (Untertitel bzw. geplanter Text gegen das, was im Ton zu hören ist); --schnell lässt beide weg;
  - die Übergabekarte src/projekte/<projekt>/uebergabe.md: vorhanden, nichts mehr mit "…", Titel nicht zu lang.
Schreibt out/pruefung/<Komposition>.md und .json und einen Bilderbogen out/pruefung/<Komposition>-bogen.jpg (Hook bei
0,5/1,5/2,9 s, danach alle 4 s, mit den Zonen von TikTok rot und Instagram pink aus src/lib/zonen.json) zum Ansehen. Status je Punkt: OK, WARNUNG, PRÜFEN
(der Prüfer entscheidet, z. B. jede Meldung der Kontrolle) oder FEHLER. Exit-Code 1 bei einem FEHLER.
"""
import argparse
import json
import os
import re
import subprocess
import sys

os.environ.setdefault("OPENCV_LOG_LEVEL", "ERROR")
import cv2  # noqa: E402
import numpy as np  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(ROOT, ".tools", "yunet.onnx")
LAENGE = {"news": (45, 80), "face": (40, 75), "hero": (55, 180)}

ap = argparse.ArgumentParser()
ap.add_argument("komposition")
ap.add_argument("projekt")
ap.add_argument("--format", choices=list(LAENGE))
ap.add_argument("--schnell", action="store_true", help="ohne checks --stems und kontrolle")
o = ap.parse_args()

video = os.path.join(ROOT, "out", "final", f"{o.komposition}.mp4")
post = os.path.join(ROOT, "out", "final", f"{o.komposition}-post.mp4")
pdir = os.path.join(ROOT, "src", "projekte", o.projekt)
karte = os.path.join(pdir, "uebergabe.md")
odir = os.path.join(ROOT, "out", "pruefung")
os.makedirs(odir, exist_ok=True)
erg = []


def punkt(bereich, name, status, detail=""):
    erg.append({"bereich": bereich, "punkt": name, "status": status, "detail": detail})
    print(f"  {status:8s} {bereich} · {name}" + (f": {detail}" if detail else ""), flush=True)


def ff(*args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True).stderr


if not os.path.exists(video):
    punkt("Datei", "Master", "FEHLER", f"{os.path.relpath(video, ROOT)} fehlt (npm run final -- {o.komposition})")
    json.dump(erg, open(os.path.join(odir, f"{o.komposition}.json"), "w"), ensure_ascii=False, indent=1)
    sys.exit(1)

# Format aus der Übergabekarte, wenn nicht angegeben
text_karte = open(karte).read() if os.path.exists(karte) else ""
fmt = o.format
if not fmt:
    m = re.search(r"\*\*Format[^:]*:\*\*\s*(NEWS|FACE|HERO)", text_karte, re.I)
    fmt = m.group(1).lower() if m else None

# 1. Technik
j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                               "stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_aspect_ratio,sample_rate,channels:format=duration",
                               "-of", "json", video], capture_output=True, text=True).stdout)
v = next((s for s in j["streams"] if s["codec_type"] == "video"), {})
a = next((s for s in j["streams"] if s["codec_type"] == "audio"), {})
dauer = float(j["format"]["duration"])
cut = json.load(open(os.path.join(pdir, "cut.json")))
fps_soll = cut.get("fps", 30)
print(f"Prüfung {o.komposition} ({o.projekt}, Format {fmt.upper() if fmt else '?'})")
punkt("Technik", "Auflösung", "OK" if (v.get("width"), v.get("height")) == (1080, 1920) else "FEHLER",
      f"{v.get('width')}x{v.get('height')} (Soll 1080x1920, 9:16)")
fps = eval(v.get("r_frame_rate", "0/1"))
punkt("Technik", "Bildrate", "OK" if abs(fps - fps_soll) < 0.01 else "FEHLER", f"{fps:g} fps (Soll {fps_soll})")
# Remotion schreibt yuvj420p (voller Bereich); beides nehmen TikTok, Instagram und YouTube an
ok_codec = v.get("codec_name") == "h264" and v.get("pix_fmt") in ("yuv420p", "yuvj420p") and v.get("sample_aspect_ratio", "1:1") in ("1:1", "N/A")
punkt("Technik", "Video-Codec", "OK" if ok_codec else "FEHLER",
      f"{v.get('codec_name')}, {v.get('pix_fmt')}, SAR {v.get('sample_aspect_ratio', '?')}")
punkt("Technik", "Ton", "OK" if a.get("codec_name") == "aac" and a.get("sample_rate") == "48000" else "FEHLER",
      f"{a.get('codec_name')}, {a.get('sample_rate')} Hz, {a.get('channels')} Kanäle" if a else "keine Tonspur")
if os.path.exists(post):
    mb = os.path.getsize(post) / 1e6
    punkt("Technik", "Post-Fassung", "OK" if mb < 47 else "FEHLER", f"{mb:.1f} MB (unter 47 MB)")
else:
    punkt("Technik", "Post-Fassung", "FEHLER", "out/final/<id>-post.mp4 fehlt")

# 2. Länge
schnitt = sum(k["to"] - k["from"] for k in cut["keeps"])
punkt("Länge", "passt zum Schnitt", "OK" if abs(dauer - schnitt) < 1.0 else "FEHLER",
      f"Video {dauer:.1f} s, Schnitt {schnitt:.1f} s")
if dauer > 180:
    punkt("Länge", "Format", "FEHLER", f"{dauer:.1f} s: über 180 s kein YouTube Short")
elif fmt:
    lo, hi = LAENGE[fmt]
    punkt("Länge", "Format", "OK" if lo <= dauer <= hi else "WARNUNG", f"{dauer:.1f} s ({fmt.upper()}: {lo}-{hi} s)")
else:
    punkt("Länge", "Format", "PRÜFEN", f"{dauer:.1f} s, Format unbekannt (--format oder Übergabekarte)")

# 3. Schwarzbilder und stehendes Bild
schwarz = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", ff("-i", video, "-vf", "blackdetect=d=0.05:pic_th=0.98:pix_th=0.10", "-an", "-f", "null", "-"))
punkt("Bild", "Schwarzbilder", "FEHLER" if schwarz else "OK",
      ", ".join(f"{float(s):.2f}-{float(e):.2f} s" for s, e in schwarz) or "keine")
steht = re.findall(r"freeze_start: ([\d.]+).*?freeze_end: ([\d.]+)", ff("-i", video, "-vf", "freezedetect=n=-60dB:d=1.5", "-an", "-f", "null", "-"), re.S)
punkt("Bild", "stehendes Bild (über 1,5 s)", "WARNUNG" if steht else "OK",
      ", ".join(f"{float(s):.1f}-{float(e):.1f} s" for s, e in steht) or "keins")


def frame(t, w=540, h=960):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", video, "-frames:v", "1", "-vf", f"scale={w}:{h}",
                          "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(h, w, 3).copy() if len(raw) == w * h * 3 else None


# 4. Helligkeit des Gesichts
werte = []
if os.path.exists(MODEL):
    det = cv2.FaceDetectorYN.create(MODEL, "", (540, 960), 0.7, 0.3, 5000)
    for i in range(12):
        im = frame(dauer * (i + 0.5) / 12)
        if im is None:
            continue
        _, faces = det.detect(im)
        if faces is None or len(faces) == 0:
            continue
        x, y, w, h = (int(q) for q in max(faces, key=lambda f: f[2] * f[3])[:4])
        haut = cv2.cvtColor(im[y + int(0.25 * h):y + int(0.8 * h), x + int(0.2 * w):x + int(0.8 * w)], cv2.COLOR_BGR2GRAY)
        if haut.size:
            werte.append(float(haut.mean()) / 255)
if werte:
    hell = float(np.median(werte))
    punkt("Bild", "Helligkeit Gesicht", "OK" if 0.48 <= hell <= 0.60 else "WARNUNG",
          f"{hell:.3f} (Soll ~0,55-0,57; über 0,60 zu hell, seine Vorgabe 2026-10-18)")
else:
    punkt("Bild", "Helligkeit Gesicht", "PRÜFEN", "kein Gesicht gefunden")

# 5. Bilderbogen mit den Zonen der Apps aus src/lib/zonen.json (TikTok rot, Instagram pink, wie npm run raster)
zonen = json.load(open(os.path.join(ROOT, "src", "lib", "zonen.json")))
rahmen = [(r, (40, 40, 230)) for r in zonen["tiktok"].values()] + [(r, (200, 80, 230)) for r in zonen["instagram"].values()]
zeiten = [0.5, 1.5, 2.9] + [t for t in np.arange(4.0, dauer - 0.3, 4.0)] + [dauer - 0.4]
kacheln = []
for t in zeiten:
    im = frame(t, 270, 480)
    if im is None:
        continue
    s = 270 / 1080
    for (x0, y0, x1, y1), farbe in rahmen:
        cv2.rectangle(im, (int(x0 * s), int(y0 * s)), (int(x1 * s) - 1, int(y1 * s) - 1), farbe, 1)
    cv2.putText(im, f"{t:.1f} s", (6, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
    kacheln.append(im)
if kacheln:
    spalten = 6
    while len(kacheln) % spalten:
        kacheln.append(np.zeros_like(kacheln[0]))
    bogen = np.vstack([np.hstack(kacheln[i:i + spalten]) for i in range(0, len(kacheln), spalten)])
    bogen_pfad = os.path.join(odir, f"{o.komposition}-bogen.jpg")
    cv2.imwrite(bogen_pfad, bogen, [cv2.IMWRITE_JPEG_QUALITY, 85])
    punkt("Bild", "Bilderbogen", "PRÜFEN", f"{os.path.relpath(bogen_pfad, ROOT)} ansehen (Hook, Untertitel, nichts in den Zonen, keine leere Karte)")


def npm(*args):
    r = subprocess.run(["node", os.path.join(ROOT, "tools", "py.mjs"), *args], capture_output=True, text=True, cwd=ROOT)
    return r.returncode, [l for l in (r.stdout + r.stderr).splitlines() if l.strip() and not l.startswith(("[ WARN", ">"))]


# 6. Ton und Text
if o.schnell:
    punkt("Ton", "checks --stems", "PRÜFEN", "übersprungen (--schnell)")
    punkt("Text", "Untertitel gegen Ton (kontrolle)", "PRÜFEN", "übersprungen (--schnell)")
else:
    code, zeilen = npm("checks.py", os.path.relpath(video, ROOT), "--stems", o.komposition)
    punkt("Ton", "checks --stems", "OK" if code == 0 else "FEHLER", " | ".join(zeilen[-6:]))
    code, zeilen = npm("kontrolle.py", os.path.relpath(video, ROOT), o.projekt)
    m = re.search(r"Übereinstimmung (\d+) %", " ".join(zeilen))
    quote = int(m.group(1)) if m else 0
    meldungen = [l.strip() for l in zeilen if re.match(r"\s*(DOPPELT|ZUSÄTZLICH|FEHLT|UNGEHÖRT|GEDEHNT)", l)]
    status = "FEHLER" if quote < 85 else ("PRÜFEN" if meldungen else "OK")
    punkt("Text", "Untertitel gegen Ton (kontrolle)", status,
          f"Übereinstimmung {quote} %" + ("; " + " | ".join(meldungen) if meldungen else ", keine Meldungen"))

# 7. Übergabekarte
if not text_karte:
    punkt("Karte", "Übergabekarte", "FEHLER", f"{os.path.relpath(karte, ROOT)} fehlt (npm run uebergabe)")
else:
    ohne_kommentare = re.sub(r"<!--.*?-->", "", text_karte, flags=re.S)
    offen = [l.strip() for l in ohne_kommentare.splitlines() if "…" in l]
    punkt("Karte", "ausgefüllt", "FEHLER" if offen else "OK", " | ".join(offen[:6]) + (" …" if len(offen) > 6 else ""))
    if "fehlt noch" in text_karte or f"out/final/{o.komposition}.mp4" not in text_karte:
        punkt("Karte", "technischer Block", "FEHLER", f"veraltet: npm run uebergabe -- {o.projekt} {o.komposition}")
    for name, rx, n in (("TikTok-Titel", r"TikTok-Titel[^:]*:\s*(.+)", 90), ("YouTube-Titel", r"Titel \(max\. 100 Zeichen\):\s*(.+)", 100)):
        m = re.search(rx, ohne_kommentare)
        if m and "…" not in m.group(1):
            t = m.group(1).strip()
            punkt("Karte", name, "OK" if len(t) <= n else "FEHLER", f"{len(t)} Zeichen: {t}")
    for plattform in ("TikTok", "Instagram", "YouTube"):
        m = re.search(rf"### {plattform}.*?```\n(.*?)\n```", ohne_kommentare, re.S)
        punkt("Karte", f"Caption {plattform}", "OK" if m and m.group(1).strip() and "…" not in m.group(1) else "FEHLER",
              f"{len(m.group(1))} Zeichen" if m else "fehlt")

fehler = [e for e in erg if e["status"] == "FEHLER"]
pruefen = [e for e in erg if e["status"] in ("PRÜFEN", "WARNUNG")]
fazit = "TECHNIK OK" if not fehler else f"TECHNIK: {len(fehler)} FEHLER"
fazit += f", {len(pruefen)} Punkt(e) für den Prüfer" if pruefen else ""
json.dump({"komposition": o.komposition, "projekt": o.projekt, "format": fmt, "dauer": round(dauer, 2), "fazit": fazit,
           "punkte": erg}, open(os.path.join(odir, f"{o.komposition}.json"), "w"), ensure_ascii=False, indent=1)
with open(os.path.join(odir, f"{o.komposition}.md"), "w") as f:
    f.write(f"# Technische Prüfung {o.komposition}\n\n**{fazit}**\n\n| Status | Bereich | Punkt | Detail |\n|---|---|---|---|\n")
    for e in erg:
        f.write(f"| {e['status']} | {e['bereich']} | {e['punkt']} | {e['detail'].replace('|', '/')} |\n")
print(f"\n{fazit}\nBericht: out/pruefung/{o.komposition}.md")
sys.exit(1 if fehler else 0)
