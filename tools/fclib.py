"""Gemeinsame Bausteine für den Schnitt: Takes laden, nach Text schneiden, Pausen entfernen, Untertitel-Seiten bauen.

Ein Take ist ein Clip unter public/projekte/<projekt>/takes/<take>.mp4; seine Wörter liegen in
public/projekte/<projekt>/edit/transcripts/<take>.aligned.json (aus align.py, auf den Frame genau) oder, falls es die
noch nicht gibt, in <take>.json (faster-whisper). Take-IDs sind "<projekt>/<take>".
"""
import json
import os
import re
import subprocess

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJEKTE = os.path.join(ROOT, "public", "projekte")
SR = 16000

FILLERS = {"uh", "um", "umm", "uhm", "uhh", "hmm", "mhm", "mm", "äh", "ähm", "öh", "ähh", "hm"}
# im Deutschen ist "um" ein Wort ("um die Serie weiterzuführen") und kein Füllwort
NOT_FILLERS = {"de": {"um"}}
# eine Untertitel-Seite soll nicht auf so einem Wort enden
STOP_END = {
    "en": {"a", "an", "the", "to", "of", "and", "but", "or", "in", "on", "for", "with", "at", "by", "than", "that",
           "if", "as", "so", "my", "your", "our", "from", "into", "about", "because", "when", "what", "how", "it's",
           "i'm", "i", "is", "i've", "i'd"},
    "de": {"der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "und", "oder", "aber", "mit",
           "von", "zu", "zum", "zur", "im", "in", "an", "auf", "für", "bei", "wie", "wenn", "dass", "weil", "ich",
           "du", "er", "sie", "es", "wir", "ihr", "mein", "dein", "sein", "ist", "bin", "hat", "hab", "habe", "so"},
}


def norm(s):
    return re.sub(r"[^a-z0-9%äöüß']", "", s.lower())


def take_paths(tid):
    projekt, take = tid.split("/")
    base = os.path.join(PROJEKTE, projekt)
    return (os.path.join(base, "takes", take + ".mp4"),
            os.path.join(base, "edit", "transcripts", take + ".json"),
            os.path.join(base, "edit", "transcripts", take + ".aligned.json"))


class Take:
    _cache = {}

    def __init__(self, tid):
        self.id = tid
        self.path, tj, aj = take_paths(tid)
        self.aligned = os.path.exists(aj)
        src = aj if self.aligned else tj
        if not os.path.exists(src):
            raise SystemExit(f"Kein Transkript für {tid}: erst tools/transcribe.py (und tools/align.py) laufen lassen")
        ws = [w for w in json.load(open(src, encoding="utf-8"))["words"] if w.get("type", "word") == "word"]
        self.words = []
        for i, w in enumerate(ws):
            t = w["text"].strip()
            if not norm(t):          # reine Satzzeichen ("...") hängen am Wort davor, sonst trennen sie Sätze
                if self.words and t:
                    self.words[-1]["text"] = self.words[-1]["text"].strip() + t
                continue
            nxt = ws[i + 1]["text"].strip(".,!?;:").lower() if i + 1 < len(ws) else None
            if nxt and t.strip(".,!?;:").lower() == nxt and w["end"] - w["start"] < 0.08:
                continue   # Whisper-Stotterer: ein Duplikat des nächsten Worts ohne Länge
            if (t in ("%", "%.", "%,") or (t.startswith("-") and len(t) > 1)) and self.words:
                self.words[-1]["text"] = self.words[-1]["text"].strip() + t   # "%" und "-weiß" gehören zum Wort davor
                self.words[-1]["end"] = w["end"]
            else:
                self.words.append(dict(w, text=t))
        self._audio = None
        self._db = None

    @classmethod
    def get(cls, tid):
        if tid not in cls._cache:
            cls._cache[tid] = cls(tid)
        return cls._cache[tid]

    def audio(self):
        if self._audio is None:
            raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", self.path, "-vn", "-ac", "1", "-ar", str(SR),
                                  "-f", "f32le", "-"], capture_output=True, check=True).stdout
            self._audio = np.frombuffer(raw, np.float32)
        return self._audio

    def db(self):
        """Pegel in 10-ms-Fenstern (dB)."""
        if self._db is None:
            x = self.audio()
            hop = SR // 100
            n = len(x) // hop
            self._db = 20 * np.log10(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1) + 1e-10))
        return self._db


def is_filler(raw, lang):
    n = norm(raw)
    if n in FILLERS and n not in NOT_FILLERS.get(lang, set()):
        return True
    return n == "like" and raw.strip().endswith(",")   # das gesprochene "like," ist ein Tic, kein Verb


def _snap(take, t, lo, hi, win=0.15):
    """Schiebt einen Schnittpunkt auf die leiseste Stelle (10 ms) in ±win, nie aus [lo, hi] heraus."""
    db = take.db()
    a, b = max(lo, t - win), min(hi, t + win)
    if b <= a:
        return round(t, 3)
    i0, i1 = int(a * 100), max(int(a * 100) + 1, int(b * 100))
    seg = db[i0:i1]
    if not len(seg):
        return round(t, 3)
    return round((i0 + int(np.argmin(seg))) / 100 + 0.005, 3)


def ranges_for(tid, text, lang, start=0.0, pre=0.08, post=0.12):
    """Schnitt nach Text: richtet den gewählten Text Wort für Wort am Transkript aus und gibt die Quellbereiche zurück.
    Wörter, die im Text fehlen (Füllwörter, Versprecher, ein weggelassenes "Dann,"), werden zu Schnitten. Ein Wort,
    das im Text steht, aber nicht im Transkript, bricht ab (Verhörer: im Transkript mit fixes korrigieren)."""
    tk = Take.get(tid)
    ws = tk.words
    toks = [norm(t) for t in text.split() if norm(t) and not is_filler(t, lang)]
    idx = []
    j = next((k for k, w in enumerate(ws) if w["start"] >= start - 0.05), len(ws))
    for t in toks:
        while j < len(ws) and (norm(ws[j]["text"]) != t or is_filler(ws[j]["text"], lang)):
            j += 1
        if j >= len(ws):
            raise SystemExit(f"Schnitt: Wort {t!r} nicht in {tid} gefunden (ab {start:.2f} s). Verhörer? Satzanfang 'start' prüfen.")
        idx.append(j)
        j += 1
    runs, cur = [], [idx[0]]
    for k in idx[1:]:
        if k == cur[-1] + 1:
            cur.append(k)
        else:
            runs.append(cur)
            cur = [k]
    runs.append(cur)
    out = []
    for r in runs:
        w0, w1 = ws[r[0]], ws[r[-1]]
        a, b = w0["start"] - pre, w1["end"] + post
        lo_a = ws[r[0] - 1]["end"] if r[0] > 0 else 0.0                    # nie in das weggelassene Wort davor
        hi_b = ws[r[-1] + 1]["start"] if r[-1] + 1 < len(ws) else b + 0.3   # und nie in das danach
        a = max(a, (lo_a + w0["start"]) / 2) if r[0] > 0 else max(0.0, a)
        b = min(b, (w1["end"] + hi_b) / 2) if r[-1] + 1 < len(ws) else b
        sa = _snap(tk, a, lo_a, w0["start"] + 0.03)
        sb = _snap(tk, b, w1["end"] - 0.03, hi_b)
        out.append((sa, sb, [ws[k] for k in r]))
    return out


def tight(tid, a, b, lang, min_gap=0.3, pre=0.04, post=0.06, merge=0.12):
    """Teilbereiche von [a, b] ohne Pausen ab min_gap (gemessen am echten Pegel). Der Anfang jedes Worts ist geschützt
    (nur wo dort wirklich Stimme ist), kein Stück endet auf einem Bindewort, wenn die Pause klein ist."""
    tk = Take.get(tid)
    db = tk.db()
    i0, i1 = int(a * 100), int(b * 100)
    seg = db[i0:i1]
    if len(seg) < 3:
        return [(round(a, 3), round(b, 3))]
    voiced = seg > np.percentile(seg, 90) - 24
    raw = voiced.copy()
    for w in tk.words:
        o = w["start"]
        if a - 0.1 <= o < b:
            j0 = max(0, int((o - a) * 100))
            j1 = max(0, int((o + min(0.16, max(0.08, w["end"] - o)) - a) * 100))
            if raw[max(0, j0 - 10):j1 + 20].any():
                voiced[j0:j1] = True
    runs, s = [], None
    for i, v in enumerate(voiced):
        if v and s is None:
            s = i
        if not v and s is not None:
            runs.append([s, i])
            s = None
    if s is not None:
        runs.append([s, len(voiced)])
    merged = []
    for r in runs:
        if merged and (r[0] - merged[-1][1]) * 0.01 < min_gap:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    out = []
    for r in merged:
        ra, rb = a + r[0] * 0.01 - pre, a + r[1] * 0.01 + post
        if out and ra - out[-1][1] < merge:
            out[-1][1] = rb
        else:
            out.append([max(a, ra), min(b, rb)])
    out = [[u, v] for u, v in out if v - u > 0.12] or [[a, b]]
    # keine Mini-Jump-Cuts: ein Stück unter 0,8 s wird mit dem näheren Nachbarn verbunden (die Pause bleibt drin),
    # solange die Pause unter 0,8 s liegt; ein Satz wird lieber mit kurzer Pause gezeigt als zerhackt
    i = 0
    while len(out) > 1 and i < len(out):
        u, v = out[i]
        if v - u >= 0.8:
            i += 1
            continue
        gl = u - out[i - 1][1] if i > 0 else 9
        gr = out[i + 1][0] - v if i + 1 < len(out) else 9
        if min(gl, gr) >= 0.8:
            i += 1
        elif gl <= gr:
            out[i - 1][1] = v
            del out[i]
        else:
            out[i + 1][0] = u
            del out[i]
    stop = STOP_END.get(lang, set())
    i = 0
    while i < len(out) - 1:
        ws = [w for w in tk.words if out[i][0] - 0.02 <= w["start"] < out[i][1] - 0.02]
        if ws and ws[-1]["text"].strip(".,!?;:").lower() in stop and ws[-1]["text"][-1:] not in ".,!?" \
                and out[i + 1][0] - out[i][1] < 0.25:
            out[i][1] = out[i + 1][1]
            del out[i + 1]
        else:
            i += 1
    return [(round(u, 3), round(v, 3)) for u, v in out]


def _width(page, size):
    # Breite in px, geschätzt für Geist Bold (ohne Font-Datei): ~0.56 em pro Zeichen plus Wortabstand
    return sum(len(w["text"]) * size * 0.56 for w in page) + (len(page) - 1) * size * 0.28


def build_pages(words, lang, max_words=3, gap=0.35, size=76, max_w=890):
    """Untertitel-Seiten: an Satzzeichen und echten Pausen getrennt, dann in 2-3 Wörter geteilt, ohne einzelne
    Waisen-Wörter und möglichst nicht auf einem Bindewort endend. words: [{text, t0, t1}] in Ausgabe-Sekunden."""
    stop = STOP_END.get(lang, set())
    clauses, cur = [], []
    for w in words:
        if cur and w["t0"] - cur[-1]["t1"] > gap:
            clauses.append(cur)
            cur = []
        cur.append(w)
        if w["text"][-1:] in ".,!?;:":
            clauses.append(cur)
            cur = []
    if cur:
        clauses.append(cur)
    pages = []
    for ws in clauses:
        n = len(ws)
        best = {0: (0.0, [])}
        for i in range(1, n + 1):
            cand = None
            for k in range(1, max_words + 2):
                j = i - k
                if j < 0 or j not in best:
                    continue
                page = ws[j:i]
                chars = sum(len(x["text"]) for x in page) + k - 1
                if k > max_words and chars > 24:
                    continue
                cost = best[j][0] + {1: 3.0, 2: 0.4, 3: 0.0, 4: 0.6}.get(k, 0.0)
                over = _width(page, size) / max_w
                if over > 1.0:
                    cost += 40.0 * (over - 1.0) + 8.0
                if i < n and page[-1]["text"].strip(".,!?;:").lower() in stop:
                    cost += 3.5
                if i == n and k == 1 and n > 1:
                    cost += 2.0
                if cand is None or cost < cand[0]:
                    cand = (cost, best[j][1] + [page])
            best[i] = cand
        pages += best[n][1]
    out, i = [], 0
    while i < len(pages):
        pg = pages[i]
        if len(pg) == 1 and pg[0]["text"][-1:] not in ".!?;:" and i + 1 < len(pages) \
                and len(pages[i + 1]) <= max_words - 1 and _width(pg + pages[i + 1], size) <= max_w:
            out.append(pg + pages[i + 1])
            i += 2
        else:
            out.append(pg)
            i += 1
    return out
