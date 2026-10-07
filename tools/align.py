"""Wortzeiten auf den Frame genau: richtet die Wörter des Transkripts per CTC-Forced-Alignment (wav2vec2) am Ton aus.

    npm run ausrichten -- <projekt> <take> [--sprache de] [--modell <huggingface-id>]

Warum: faster-whisper schätzt Wortzeiten aus der Attention und liegt 0,1-0,3 s daneben (zwei Wörter können sogar
denselben Start haben). Grafiken, die auf so eine Zeit gesetzt werden, kommen zu früh oder zu spät. Der Text bleibt
der von Whisper, nur start/end werden neu gesetzt. Zahlen ("250", "1,5", "30 %") werden für die Ausrichtung als Wörter
gesprochen ("zweihundertfünfzig"), damit auch die Beweis-Zahl im Hook auf dem Frame sitzt; Wörter ohne ausrichtbare
Buchstaben behalten ihre Zeit.
Schreibt <take>.aligned.json neben das Transkript ("w_start" = Whispers Start, zum Vergleich). ~1 min für 2:20 Ton.
"""
import argparse
import json
import os
import re
import subprocess
import time

import numpy as np
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

MODELS = {"de": "jonatasgrosman/wav2vec2-large-xlsr-53-german",
          "en": "jonatasgrosman/wav2vec2-large-xlsr-53-english"}
ap = argparse.ArgumentParser()
ap.add_argument("projekt"); ap.add_argument("take")
ap.add_argument("--sprache", default="de"); ap.add_argument("--modell")
o = ap.parse_args()
model_id = o.modell or MODELS.get(o.sprache)
if not model_id:
    raise SystemExit(f"Kein Ausrichtungs-Modell für {o.sprache!r}: --modell <wav2vec2-CTC-Modell> angeben")
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
base = os.path.join(root, "public", "projekte", o.projekt)
src = os.path.join(base, "takes", f"{o.take}.mp4")
tdir = os.path.join(base, "edit", "transcripts")
words = json.load(open(os.path.join(tdir, f"{o.take}.json"), encoding="utf-8"))["words"]
t0 = time.time()

SR = 16000
pcm = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, dtype=np.float32)
proc = Wav2Vec2Processor.from_pretrained(model_id)
model = Wav2Vec2ForCTC.from_pretrained(model_id).eval()
torch.set_num_threads(os.cpu_count() or 4)
vocab = proc.tokenizer.get_vocab()
BLANK = proc.tokenizer.pad_token_id
SEP = vocab.get("|")
HOP = 0.02   # ein CTC-Frame = 320 Samples


DE_1 = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf",
        "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"]
DE_10 = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"]
EN_1 = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
        "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
EN_10 = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]


def zahl_de(n):
    if n < 20:
        return DE_1[n]
    if n < 100:
        e, z = n % 10, DE_10[n // 10]
        return z if not e else ("ein" if e == 1 else DE_1[e]) + "und" + z
    if n < 1000:
        h, r = divmod(n, 100)
        return ("" if h == 1 else DE_1[h]) + "hundert" + (zahl_de(r) if r else "")
    if n < 1_000_000:
        t, r = divmod(n, 1000)
        return ("" if t == 1 else zahl_de(t)) + "tausend" + (zahl_de(r) if r else "")
    m, r = divmod(n, 1_000_000)
    return ("eine million" if m == 1 else zahl_de(m) + " millionen") + (" " + zahl_de(r) if r else "")


def zahl_en(n):
    if n < 20:
        return EN_1[n]
    if n < 100:
        return EN_10[n // 10] + ("" if n % 10 == 0 else " " + EN_1[n % 10])
    if n < 1000:
        return EN_1[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + zahl_en(n % 100))
    if n < 1_000_000:
        return zahl_en(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + zahl_en(n % 1000))
    return zahl_en(n // 1_000_000) + " million" + ("" if n % 1_000_000 == 0 else " " + zahl_en(n % 1_000_000))


ZEICHEN = {"de": {"%": " prozent", "€": " euro", "$": " dollar", "+": " plus"},
           "en": {"%": " percent", "€": " euros", "$": " dollars", "+": " plus"}}


def gesprochen(text, sprache):
    """Ziffern als gesprochene Wörter: "250" → "zweihundertfünfzig", "1,5" → "eins komma fünf", "30 %" → "dreißig
    prozent". Tausenderpunkte ("1.000") zählen als eine Zahl; Jahreszahlen werden wie Zahlen gesprochen."""
    if not any(c.isdigit() for c in text):
        return text
    zahl, komma = (zahl_de, "komma") if sprache == "de" else (zahl_en, "point")

    def ganz(m):
        d = m.group(0).replace(".", "") if sprache == "de" else m.group(0).replace(",", "")
        return " " + zahl(int(d)) + " " if len(d) <= 9 else m.group(0)

    sep = "," if sprache == "de" else "."
    out = re.sub(rf"(\d+)\{sep}(\d+)", lambda m: f" {zahl(int(m.group(1)))} {komma} "
                 + " ".join(zahl(int(c)) for c in m.group(2)) + " ", text)
    out = re.sub(r"\d{1,3}(?:[.,]\d{3})+|\d+", ganz, out)
    for z, w in ZEICHEN.get(sprache, {}).items():
        out = out.replace(z, w)
    return out


def letters(w):
    return [c for c in gesprochen(w, o.sprache).lower() if c in vocab and c != "|"]


def align(emis, tokens):
    """Viterbi über das CTC-Gitter (blank / bleiben / nächstes Zeichen): Frame jedes Zeichens."""
    T, N = emis.shape[0], len(tokens)
    tr = torch.full((T + 1, N + 1), -float("inf"))
    tr[0, 0] = 0
    tr[1:, 0] = torch.cumsum(emis[:, BLANK], 0)
    for t in range(T):
        tr[t + 1, 1:] = torch.maximum(tr[t, 1:] + emis[t, BLANK], tr[t, :-1] + emis[t, tokens])
    spans, j, t = [None] * N, N, T
    while j > 0 and t > 0:
        if tr[t - 1, j - 1] + emis[t - 1, tokens[j - 1]] > tr[t - 1, j] + emis[t - 1, BLANK]:
            spans[j - 1] = (t - 1, t)
            j -= 1
        t -= 1
    return spans


# Abschnitte: Wörter ohne Lücke über 0,6 s, höchstens ~14 s, mit 0,25 s Luft auf beiden Seiten
chunks, cur = [], []
for w in words:
    if cur and (w["start"] - cur[-1]["end"] > 0.6 or w["end"] - cur[0]["start"] > 14):
        chunks.append(cur)
        cur = []
    cur.append(w)
if cur:
    chunks.append(cur)

out, moved = [], []
for ch in chunks:
    a = max(0.0, ch[0]["start"] - 0.25)
    b = min(len(audio) / SR, ch[-1]["end"] + 0.25)
    with torch.no_grad():
        inp = proc(audio[int(a * SR):int(b * SR)], sampling_rate=SR, return_tensors="pt").input_values
        emis = torch.log_softmax(model(inp).logits[0], -1)
    tokens, owner = [], []
    for i, w in enumerate(ch):
        ls = letters(w["text"])
        if not ls:
            continue
        if tokens and SEP is not None:
            tokens.append(SEP)
            owner.append(None)
        for c in ls:
            tokens.append(vocab[c])
            owner.append(i)
    spans = align(emis, torch.tensor(tokens)) if tokens else []
    first, last = {}, {}
    for sp, i in zip(spans, owner):
        if i is None or sp is None:
            continue
        first.setdefault(i, sp[0])
        last[i] = sp[1]
    for i, w in enumerate(ch):
        n = dict(w, w_start=w["start"])
        if i in first:
            n["start"] = round(a + first[i] * HOP, 3)
            n["end"] = round(a + last[i] * HOP, 3)
            # mehr als 0,7 s Verschiebung: eher ein Ausrichtungsfehler als ein Whisper-Fehler, Whisper behalten
            if abs(n["start"] - w["start"]) > 0.7:
                n["start"], n["end"] = w["start"], w["end"]
            else:
                moved.append(n["start"] - w["start"])
        out.append(n)
# Reihenfolge erzwingen: ein Wort vor seinem Vorgänger bekommt Whispers Zeit zurück
for p, n in zip(out, out[1:]):
    if n["start"] < p["start"]:
        n["start"], n["end"] = n["w_start"], max(n["end"], n["w_start"] + 0.04)

json.dump({"words": out, "aligned": model_id}, open(os.path.join(tdir, f"{o.take}.aligned.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
m = np.abs(np.array(moved)) if moved else np.zeros(1)
print(f"{o.take}: {len(out)} Wörter ausgerichtet in {time.time() - t0:.0f} s; Verschiebung Median "
      f"{np.median(m) * 1000:.0f} ms, p90 {np.percentile(m, 90) * 1000:.0f} ms, max {m.max() * 1000:.0f} ms")
