"""Rohschnitt: der Schnitt aus der cut.json in Sekunden als Video, ohne Grafiken (nur ffmpeg, kein Remotion).

    npm run rohschnitt -- src/projekte/<projekt>/cut.json [--out out/vorschau/<projekt>-roh.mp4] [--hoehe 960]

Setzt die Schnittstücke aus den Takes aneinander (halbe Größe), legt die "stumm"-Stellen leise und brennt die
Untertitel-Seiten ein (das gesprochene Wort gelb, wie im fertigen Video) und oben links die Sekunde. Damit gibt der
Nutzer den Schnitt frei (Reihenfolge, Länge, Wortwahl), bevor die Grafiken gebaut werden: eine Notiz zum Schnitt
kostet dann einen neuen Rohschnitt (Sekunden) statt einer neuen Vorschau (Minuten). Ton ohne Überblendung an den
Schnitten (das macht erst die Remotion-Vorschau); Lautheit wird nicht angeglichen.
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

from fclib import ROOT, take_paths

YELLOW = "&H0028DEFF"  # ASS: &HAABBGGRR, das Gelb aus STIL (#FFDE28)
WHITE = "&H00FFFFFF"
INK = "&H001A1614"


def ts(s):
    s = max(0.0, s)
    return f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"


def ass_text(t):
    return t.replace("\\", "\\\\").replace("{", "(").replace("}", ")")


def has_filter(name):
    """Ob das installierte ffmpeg einen Filter kennt (ffmpeg -filters)."""
    try:
        out = subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True).stdout
    except OSError:
        return False
    return any(len(line.split()) > 1 and line.split()[1] == name for line in out.splitlines())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cut")
    ap.add_argument("--out")
    ap.add_argument("--hoehe", type=int, default=960)
    o = ap.parse_args()

    cut = json.load(open(o.cut, encoding="utf-8"))
    fps = cut.get("fps", 30)
    f = lambda s: round(s * fps)  # wie createCut: Stücke auf ganze Frames
    keeps, at = [], 0
    for k in cut["keeps"]:
        n = f(k["to"]) - f(k["from"])
        keeps.append({**k, "at": at / fps, "len": n / fps})
        at += n
    total = at / fps
    if not keeps:
        sys.exit("FEHLER: die cut.json hat keine Schnittstücke")

    # Ausgabe-Sekunde eines Worts (wie out() in schnitt.ts)
    def out(src, t):
        for k in keeps:
            if k["src"] == src and k["from"] - 0.03 <= t <= k["to"] + 0.06:
                return k["at"] + min(t, k["to"]) - k["from"]
        return None

    words = [{**w, "a": out(w["src"], w["start"]), "b": out(w["src"], w["end"])} for w in cut["words"]]
    pages, i = [], 0
    for n in cut["pages"]:
        page = [w for w in words[i:i + n] if w["a"] is not None and w["text"]]
        i += n
        if page:
            pages.append(page)

    # Untertitel als ASS auf 1080x1920 (libass skaliert auf die Ausgabegröße): Seite für Seite, Wort für Wort gelb
    ev = []
    for p, page in enumerate(pages):
        end_page = pages[p + 1][0]["a"] if p + 1 < len(pages) else page[-1]["b"] + 0.4
        end_page = min(end_page, page[-1]["b"] + 0.4)
        for k, w in enumerate(page):
            a = max(page[0]["a"], w["a"]) if k else page[0]["a"] - 0.03
            b = page[k + 1]["a"] if k + 1 < len(page) else end_page
            if b <= a:
                continue
            txt = " ".join(
                (f"{{\\c{YELLOW}}}" if j == k else f"{{\\c{WHITE}}}") + ass_text(x["text"].rstrip(","))
                for j, x in enumerate(page))
            ev.append(f"Dialogue: 0,{ts(a)},{ts(b)},Cap,,0,0,0,,{txt}")
    for s in range(int(total) + 1):
        ev.append(f"Dialogue: 1,{ts(s)},{ts(min(total, s + 1))},Zeit,,0,0,0,,{s} s")
    ass = "\n".join([
        "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "WrapStyle: 2", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, "
        "Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, "
        "MarginR, MarginV, Encoding",
        f"Style: Cap,Geist,76,{WHITE},{WHITE},{INK},&H80000000,-1,0,0,0,100,100,0,0,1,6,2,8,60,60,1340,1",
        f"Style: Zeit,Geist Mono,40,{WHITE},{WHITE},{INK},&H80000000,0,0,0,0,100,100,0,0,3,10,0,7,40,40,40,1",
        "", "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text", *ev, ""])

    projekt = cut.get("projekt") or os.path.basename(os.path.dirname(os.path.abspath(o.cut)))
    dst = o.out or os.path.join("out", "vorschau", f"{projekt}-roh.mp4")
    dst = os.path.join(ROOT, dst) if not os.path.isabs(dst) else dst
    os.makedirs(os.path.dirname(dst), exist_ok=True)

    h = o.hoehe - o.hoehe % 2
    w = round(h * 9 / 16 / 2) * 2
    args, chains = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error"], []
    for n, k in enumerate(keeps):
        path = take_paths(k["src"])[0]
        if not os.path.exists(path):
            sys.exit(f"FEHLER: Take fehlt: {path}")
        # Frame-genau wie Remotion: Start und Länge in ganzen Frames
        start, dur = f(k["from"]) / fps, k["len"]
        args += ["-ss", f"{start:.4f}", "-t", f"{dur:.4f}", "-i", path]
        vol = "".join(f",volume=0.02:enable='between(t,{a - start:.3f},{b - start:.3f})'"
                      for a, b in k.get("stumm") or [])
        chains.append(
            f"[{n}:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps={fps},setsar=1,"
            f"trim=duration={dur:.4f},setpts=PTS-STARTPTS[v{n}];"
            f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=duration={dur:.4f},asetpts=PTS-STARTPTS,"
            f"apad=whole_dur={dur:.4f},afade=t=in:d=0.01,afade=t=out:st={max(0, dur - 0.01):.4f}:d=0.01{vol}[a{n}];")

    with_subs = has_filter("subtitles")
    if not with_subs:
        print("HINWEIS: Dein ffmpeg kann keine Untertitel einbrennen (Filter \"subtitles\"/libass fehlt). "
              "Der Rohschnitt kommt ohne Untertitel; der Schnitt selbst ist derselbe.")
    with tempfile.TemporaryDirectory() as tmp:
        sub = os.path.join(tmp, "roh.ass")
        open(sub, "w", encoding="utf-8").write(ass)
        fonts = os.path.join(ROOT, "public", "fonts")
        # Pfade im Filter doppelt maskieren: einmal für die Option (\ ' :), einmal für den Filtergraphen
        # (\ ' [ ] , ;). Anführungszeichen allein reichen nicht: der Graph entfernt sie, bevor der Filter
        # die Option liest (macOS-CI: "No option name near …roh.ass:fontsdir=…").
        def esc(p):
            p = p.replace("\\", "/")
            for c in "\\':":
                p = p.replace(c, "\\" + c)
            for c in "\\'[],;":
                p = p.replace(c, "\\" + c)
            return p
        graph = "".join(chains) + "".join(f"[v{n}][a{n}]" for n in range(len(keeps)))
        graph += f"concat=n={len(keeps)}:v=1:a=1[vc][ac];"
        # Untertitel brauchen den subtitles-Filter (libass). Das ffmpeg von Homebrew bringt ihn nicht mit: dann
        # kommt der Rohschnitt ohne eingebrannte Untertitel, statt abzubrechen.
        if with_subs:
            graph += f"[vc]subtitles=filename={esc(sub)}:fontsdir={esc(fonts)}[vo]"
        else:
            graph += "[vc]null[vo]"
        args += ["-filter_complex", graph, "-map", "[vo]", "-map", "[ac]", "-c:v", "libx264", "-preset", "veryfast",
                 "-crf", "26", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", dst]
        r = subprocess.run(args)
    if r.returncode:
        sys.exit("FEHLER: ffmpeg ist abgebrochen (Meldung oben)")
    subs = f"{sum(len(p) for p in pages)} Wörter in {len(pages)} Untertitel-Seiten" if with_subs else "ohne Untertitel"
    print(f"✓ Rohschnitt: {os.path.relpath(dst, ROOT)}  ({total:.1f} s, {len(keeps)} Stücke, {subs})")


if __name__ == "__main__":
    main()
