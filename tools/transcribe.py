"""Transkribiert einen Take lokal mit faster-whisper (gebündelt mit VAD: ein 4-Minuten-Take in ~2:40 statt ~12 min).

    npm run transkribieren -- <audio oder video> <projekt> <take> [--sprache de] [--modell medium] [--namen "Claude, Remotion"]
    npm run transkribieren -- <take.mp4> <projekt> <take> --genau [--ab 95]

--genau: ohne Bündelung und ohne Stille-Filter (langsamer). Nimm es, wenn das schnelle Transkript Sprache verschluckt
hat (letztes Wort lange vor dem Ende des Tons, oder ein kurzer Take mit fast keinen Wörtern).
--ab SEK: nur ab dieser Sekunde neu transkribieren; die Wörter davor bleiben, die danach werden ersetzt.

--namen: Produkt- und Eigennamen, die Whisper sonst verhört (z. B. "Remotion", "Claude", "Hyperframes").
Schreibt public/projekte/<projekt>/edit/transcripts/<take>.json ({"words": [{text, start, end, prob}]}).
Prüfe danach die letzten 20 s gegen die Audiolänge: Whisper verschluckt manchmal einen Schluss-Satz.
"""
import argparse
import json
import os
import time

from faster_whisper import BatchedInferencePipeline, WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("projekt"); ap.add_argument("take")
ap.add_argument("--sprache", default="de"); ap.add_argument("--modell", default="medium")
ap.add_argument("--namen", default="")
ap.add_argument("--genau", action="store_true"); ap.add_argument("--ab", type=float, default=0.0)
o = ap.parse_args()
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dst = os.path.join(root, "public", "projekte", o.projekt, "edit", "transcripts")
os.makedirs(dst, exist_ok=True)

t0 = time.time()
model = WhisperModel(o.modell, device="cpu", compute_type="int8", cpu_threads=os.cpu_count() or 4)
if o.genau:
    segs, info = model.transcribe(o.src, language=o.sprache, word_timestamps=True, beam_size=5, vad_filter=False,
                                  condition_on_previous_text=False, initial_prompt=o.namen or None,
                                  clip_timestamps=[o.ab] if o.ab else "0")
else:
    pipe = BatchedInferencePipeline(model=model)
    segs, info = pipe.transcribe(o.src, language=o.sprache, word_timestamps=True, batch_size=8, beam_size=5,
                                 initial_prompt=o.namen or None)
words = [{"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "prob": round(w.probability, 3)}
         for s in segs for w in (s.words or [])]
out = os.path.join(dst, f"{o.take}.json")
if o.ab and os.path.exists(out):
    keep = [w for w in json.load(open(out, encoding="utf-8"))["words"] if w["end"] <= o.ab]
    words = keep + [w for w in words if w["start"] >= o.ab - 0.05]
json.dump({"words": words}, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
last = words[-1]["end"] if words else 0
print(f"{o.take}: {len(words)} Wörter in {time.time() - t0:.0f} s; letztes Wort endet bei {last:.1f} s "
      f"von {info.duration:.1f} s Audio")
