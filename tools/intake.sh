#!/usr/bin/env bash
# Bereitet einen Rohclip als Take vor:  bash tools/intake.sh <rohclip> <projekt> <take> [--sprache de]
#
#  - Stimme: entrauscht mit DeepFilterNet (falls installiert, siehe setup.sh), dann eine leichte Stimm-Kette
#    (Hochpass, etwas Präsenz, De-Esser, sanfte Kompression, Limiter);
#  - Bild: wird kopiert, nicht neu kodiert. Ist der Clip breiter als 1080 (4K), wird eine 1080x1920-Arbeitskopie
#    gerechnet: zwei parallele Vorschau-Renders mit 4K-Quellen haben den Browser abstürzen lassen, und kein Zoom geht
#    über 110 %;
#  - startet parallel die Transkription und danach die Wort-Ausrichtung.
# Ergebnis: public/projekte/<projekt>/takes/<take>.mp4 und public/projekte/<projekt>/edit/transcripts/<take>.(aligned.)json
set -euo pipefail
in="${1:?Rohclip}"
projekt="${2:?Projektname}"
take="${3:?Take-Name, z. B. t1}"
sprache="de"
[ "${4:-}" = "--sprache" ] && sprache="${5:?Sprache}"
here="$(cd "$(dirname "$0")/.." && pwd)"
py="$here/.venv/bin/python"
[ -x "$py" ] || py="python3"
dir="$here/public/projekte/$projekt"
mkdir -p "$dir/takes" "$dir/edit/transcripts"
out="$dir/takes/$take.mp4"
tmp="$(mktemp -d)"
trap 'rm -rf "${tmp:?}"' EXIT

ffmpeg -v error -y -i "$in" -map 0:a:0 -ac 1 -ar 16000 "$tmp/16k.wav"
echo "Transkription läuft im Hintergrund …"
("$py" "$here/tools/transcribe.py" "$tmp/16k.wav" "$projekt" "$take" --sprache "$sprache" > "$tmp/tr.log" 2>&1; echo $? > "$tmp/tr.rc") &
trpid=$!

ffmpeg -v error -y -i "$in" -map 0:a:0 -ac 1 -ar 48000 "$tmp/voice.wav"
voice="$tmp/voice.wav"
df="$(command -v deep-filter || true)"
[ -z "$df" ] && [ -x "$HOME/.local/bin/deep-filter" ] && df="$HOME/.local/bin/deep-filter"
if [ -n "$df" ]; then
  "$df" -D -a 18 -o "$tmp/dn" "$tmp/voice.wav" >/dev/null 2>&1 && voice="$tmp/dn/voice.wav" && echo "Stimme entrauscht (DeepFilterNet)"
else
  echo "Hinweis: deep-filter nicht gefunden, Stimme ohne Entrauschen (setup.sh installiert es)"
fi
chain="highpass=f=75,equalizer=f=200:t=q:w=0.9:g=1.5,equalizer=f=3200:t=q:w=1.2:g=-2.5,equalizer=f=6500:t=q:w=1.5:g=-1.5,deesser=i=0.3,acompressor=threshold=-24dB:ratio=2:attack=15:release=200:knee=6:makeup=3,alimiter=limit=0.89:level=false"
w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$in")
fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$in")
if [ "$w" -le 1080 ] && [ "$fps" = "30/1" ]; then
  vopt=(-c:v copy)
else
  # 4K oder nicht 30 fps: 1080x1920-Arbeitskopie mit 30 fps (Remotion rechnet in 30 fps)
  vopt=(-vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" -c:v libx264 -preset fast -crf 16 -g 30 -pix_fmt yuv420p)
  echo "Bild: ${w}px / ${fps} -> 1080x1920 @ 30 fps (dauert bei 4K ein paar Minuten)"
fi
ffmpeg -v error -y -i "$in" -i "$voice" -map 0:v:0 -map 1:a:0 "${vopt[@]}" -af "$chain" \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart "$out"
echo "Take fertig: ${out#$here/}"

wait $trpid || true
cat "$tmp/tr.log"
[ "$(cat "$tmp/tr.rc")" = "0" ] || { echo "Transkription fehlgeschlagen" >&2; exit 1; }
"$py" "$here/tools/align.py" "$projekt" "$take" --sprache "$sprache" || echo "Hinweis: Ausrichtung fehlgeschlagen, Whisper-Zeiten bleiben"
