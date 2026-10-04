"""Gemini schaut und hört sich das Video an und beantwortet einen Kritiker-Prompt (Probleme mit Timecodes, Noten).

  python tools/gemini-review.py <video.mp4> <prompt.md>

Braucht GEMINI_API_KEY (https://aistudio.google.com/apikey). Das Video geht über die Files-API zu Google und wird
direkt nach der Antwort gelöscht. Achtung: beim kostenlosen Schlüssel darf Google die Inhalte zur Verbesserung seiner
Produkte nutzen; für echte Gesichter und Stimmen ist ein bezahlter Schlüssel die sauberere Wahl.
Gemini ist launisch: immer zweimal laufen lassen und nur glauben, was beide sagen oder was du nachprüfen kannst.
"""

import json
import mimetypes
import os
import sys
import time
import urllib.request

MODEL = os.environ.get("GEMINI_REVIEW_MODEL", "gemini-3-flash-preview")
BASE = "https://generativelanguage.googleapis.com"
args = [a for a in sys.argv[1:] if not a.startswith("--")]
if len(args) < 2:
    sys.exit(__doc__)
video, prompt_file, clips = args[0], args[1], args[2:]
key = os.environ.get("GEMINI_API_KEY") or sys.exit("GEMINI_API_KEY fehlt (siehe README)")


def call(method, url, body=None, headers=None, raw=False):
    h = {"x-goog-api-key": key, **(headers or {})}
    data = body if isinstance(body, bytes) or body is None else json.dumps(body).encode()
    if data is not None and not isinstance(body, bytes):
        h.setdefault("Content-Type", "application/json")
    resp = urllib.request.urlopen(urllib.request.Request(url, data=data, headers=h, method=method), timeout=600)
    return resp if raw else json.load(resp) if resp.length != 0 else {}


blob = open(video, "rb").read()
mime = mimetypes.guess_type(video)[0] or "video/mp4"
start = call("POST", f"{BASE}/upload/v1beta/files", {"file": {"display_name": os.path.basename(video)}},
             {"X-Goog-Upload-Protocol": "resumable", "X-Goog-Upload-Command": "start",
              "X-Goog-Upload-Header-Content-Length": str(len(blob)), "X-Goog-Upload-Header-Content-Type": mime}, raw=True)
upload_url = start.headers["x-goog-upload-url"]
f = call("POST", upload_url, blob, {"X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize",
                                    "Content-Type": mime})["file"]
try:
    while f.get("state") == "PROCESSING":
        time.sleep(3)
        f = call("GET", f"{BASE}/v1beta/{f['name']}")
    if f.get("state") != "ACTIVE":
        sys.exit(f"upload failed: {f.get('state')}")
    parts = [{"file_data": {"mime_type": mime, "file_uri": f["uri"]}}]
    for i, clip in enumerate(clips):
        import base64
        parts.append({"text": f"Audio clip {chr(88 + i)}:"})
        parts.append({"inline_data": {"mime_type": mimetypes.guess_type(clip)[0] or "audio/mpeg",
                                      "data": base64.b64encode(open(clip, "rb").read()).decode()}})
    parts.append({"text": open(prompt_file).read()})
    for attempt in range(6):
        try:
            out = call("POST", f"{BASE}/v1beta/models/{MODEL}:generateContent", {"contents": [{"parts": parts}]})
            break
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 503) or attempt == 5:
                raise
            time.sleep(10 * (attempt + 1))
    print("".join(p.get("text", "") for p in out["candidates"][0]["content"]["parts"]))
    print("\n---\nmodel:", MODEL, "| key:", "free" if "--free" in sys.argv else "paid", "| usage:", json.dumps(out.get("usageMetadata", {})))
finally:
    call("DELETE", f"{BASE}/v1beta/{f['name']}")
    print("uploaded file deleted:", f["name"])
