#!/usr/bin/env bash
# Einmalige Einrichtung (macOS oder Linux). Braucht: ffmpeg, Node.js 20+, Python 3.10-3.12.
#   bash setup.sh
# Installiert: Node-Pakete (Remotion), eine Python-Umgebung in .venv (faster-whisper, torch, transformers, OpenCV),
# DeepFilterNet (Stimme entrauschen) und das YuNet-Gesichtsmodell (Platzierungsraster). Alles läuft danach lokal;
# beim ersten Transkribieren/Ausrichten lädt es die Modelle (~1,5 GB Whisper medium, ~1,2 GB wav2vec2).
set -euo pipefail
cd "$(dirname "$0")"
ok() { printf "  ✓ %s\n" "$1"; }
for c in ffmpeg ffprobe node npm python3; do
  command -v "$c" >/dev/null || { echo "Fehlt: $c (macOS: brew install ffmpeg node python@3.12)"; exit 1; }
done
ok "ffmpeg, node, python3 gefunden"

npm install --no-audit --no-fund >/dev/null
ok "Node-Pakete (Remotion)"

if command -v uv >/dev/null; then
  uv venv -q .venv --python 3.12 2>/dev/null || uv venv -q .venv
  PIP=(uv pip install -q --python .venv/bin/python)
else
  python3 -m venv .venv
  PIP=(.venv/bin/pip install -q)
fi
if [ "$(uname)" = "Linux" ]; then
  "${PIP[@]}" torch --index-url https://download.pytorch.org/whl/cpu
else
  "${PIP[@]}" torch
fi
"${PIP[@]}" -r requirements.txt
ok "Python-Umgebung .venv"

mkdir -p "$HOME/.local/bin" "$HOME/.cache/faber-cut"
if ! command -v deep-filter >/dev/null && [ ! -x "$HOME/.local/bin/deep-filter" ]; then
  case "$(uname)-$(uname -m)" in
    Linux-x86_64) asset=deep-filter-0.5.6-x86_64-unknown-linux-musl ;;
    Darwin-arm64) asset=deep-filter-0.5.6-aarch64-apple-darwin ;;
    Darwin-x86_64) asset=deep-filter-0.5.6-x86_64-apple-darwin ;;
    *) asset="" ;;
  esac
  if [ -n "$asset" ] && curl -sSfL -o "$HOME/.local/bin/deep-filter" \
      "https://github.com/Rikorose/DeepFilterNet/releases/download/v0.5.6/$asset"; then
    chmod +x "$HOME/.local/bin/deep-filter"
    ok "DeepFilterNet (Stimme entrauschen)"
  else
    echo "  - DeepFilterNet nicht installiert: Takes werden ohne Entrauschen vorbereitet"
  fi
else
  ok "DeepFilterNet schon da"
fi
if [ ! -s "$HOME/.cache/faber-cut/yunet.onnx" ]; then
  curl -sSfL -o "$HOME/.cache/faber-cut/yunet.onnx" \
    https://huggingface.co/opencv/face_detection_yunet/resolve/main/face_detection_yunet_2023mar.onnx && ok "YuNet-Gesichtsmodell"
fi
.venv/bin/python -c "import faster_whisper, transformers, torch, cv2; print('  ✓ Python-Pakete importierbar')"
echo
echo "Fertig. Lege deinen ersten Clip ab und sag Claude: \"Schneide mir dieses Video\" (siehe README)."
