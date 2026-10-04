"""Platzierungsraster für 1080x1920: wohin eine Grafik darf, ohne das Gesicht zu verdecken.

  npm run raster -- <video.mp4> <raster.jpg> t1,t2,...     (Sekunden im Video)
  npm run raster -- <bild.png> <raster.jpg>

Jedes Bild bekommt ein 60-px-Raster (beschriftet alle 120 px), die sichere Fläche (grün), das Untertitel-Band (gelb),
die Bereiche, die TikTok (türkis) und Instagram (pink) mit Knöpfen und Text überdecken (src/lib/zonen.json), den Kopf (rot: erkanntes Gesicht, erweitert auf Kappe, Haare, Kinn) mit Pixelwerten und die freien Standard-Felder
A-F (blau). Pro Bild steht im Terminal der Kopf und welche Felder frei sind, damit Grafiken nach Zahlen platziert
werden und nicht geschätzt. Braucht das YuNet-Modell (npm run setup lädt es nach .tools/yunet.onnx).
"""
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZONEN = json.load(open(os.path.join(ROOT, "src", "lib", "zonen.json"), encoding="utf-8"))
SAFE = tuple(ZONEN["sicher"])
CAPTION = tuple(ZONEN["untertitel"])
APPS = {"TikTok": ((37, 244, 238), ZONEN["tiktok"]), "Instagram": ((255, 60, 142), ZONEN["instagram"])}
# standard overlay slots (x0, y0, x1, y1), checked against the head box per frame
SLOTS = {
    "A top band": (60, 250, 950, 470),
    "B left column": (60, 470, 400, 1300),
    "C right column": (680, 470, 950, 1300),
    "D chest left": (60, 980, 560, 1300),
    "E chest right": (500, 980, 950, 1300),
    "F chest wide": (60, 1000, 950, 1300),
}
MODEL = os.path.join(ROOT, ".tools", "yunet.onnx")  # OpenCV YuNet (Apache 2.0), von npm run setup geladen


def font(size):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            pass
    return ImageFont.load_default()


def head_box(img):
    """Largest face, widened to the head: +35 % up (cap, hair), +20 % to each side, +12 % down (chin)."""
    bgr = cv2.cvtColor(np.array(img.convert("RGB").resize((540, 960))), cv2.COLOR_RGB2BGR)
    det = cv2.FaceDetectorYN.create(MODEL, "", (540, 960), 0.7, 0.3, 5000)
    _, faces = det.detect(bgr)
    if faces is None or len(faces) == 0:
        return None
    x, y, w, h = (v * 2 for v in max(faces, key=lambda f: f[2] * f[3])[:4])
    return (int(x - 0.2 * w), int(y - 0.35 * h), int(x + 1.2 * w), int(y + 1.12 * h))


def overlaps(a, b):
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def draw(img, label):
    img = img.convert("RGB").resize((W, H))
    head = head_box(img)
    d = ImageDraw.Draw(img, "RGBA")
    f, fb = font(22), font(30)
    for x in range(0, W + 1, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 110 if x % 120 == 0 else 45), width=1)
        if x % 120 == 0:
            d.text((x + 3, 4), str(x), fill=(255, 255, 0, 255), font=f)
    for y in range(0, H + 1, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 110 if y % 120 == 0 else 45), width=1)
        if y % 120 == 0:
            d.text((4, y + 3), str(y), fill=(255, 255, 0, 255), font=f)
    for app, (rgb, zones) in APPS.items():
        for name, r in zones.items():
            d.rectangle(tuple(r), outline=rgb + (230,), width=3, fill=rgb + (38,))
        r = zones["rechts"]
        d.text((r[0] + 4, r[1] + 10) if app == "TikTok" else (zones["unten"][0] + 70, zones["unten"][1] + 20), app[:3] if app == "TikTok" else app,
               fill=rgb + (255,), font=fb)
    d.rectangle(SAFE, outline=(60, 220, 120, 255), width=4)
    d.rectangle(CAPTION, outline=(255, 222, 40, 255), width=3, fill=(255, 222, 40, 40))
    free = []
    for name, r in SLOTS.items():
        if (head is None or not overlaps(r, head)) and not overlaps(r, CAPTION):
            free.append(name)
            d.rectangle(r, outline=(70, 140, 255, 220), width=3, fill=(70, 140, 255, 35))
            d.text((r[0] + 8, r[1] + 8), name.split()[0], fill=(70, 140, 255, 255), font=fb)
    if head:
        d.rectangle(head, outline=(255, 60, 60, 255), width=5)
        d.text((head[0] + 6, head[3] + 6), f"head {head[0]},{head[1]}-{head[2]},{head[3]}", fill=(255, 60, 60, 255),
               font=f)
    d.text((W - 260, H - 50), label, fill=(255, 255, 255, 255), font=fb)
    print(f"{label}: head {head} free {free}")
    return img


def frames(src, times):
    cap = cv2.VideoCapture(src)
    for t in times:
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, fr = cap.read()
        if ok:
            yield f"{t:.2f}s", Image.fromarray(cv2.cvtColor(fr, cv2.COLOR_BGR2RGB))


def main():
    src, out = sys.argv[1], sys.argv[2]
    scale = float(sys.argv[sys.argv.index("--scale") + 1]) if "--scale" in sys.argv else 0.5
    if src.lower().endswith((".png", ".jpg", ".jpeg")):
        tiles = [draw(Image.open(src), "still")]
    else:
        times = [float(t) for t in sys.argv[3].split(",")]
        tiles = [draw(img, label) for label, img in frames(src, times)]
    tw, th = int(W * scale), int(H * scale)
    sheet = Image.new("RGB", (tw * len(tiles), th))
    for i, t in enumerate(tiles):
        sheet.paste(t.resize((tw, th)), (i * tw, 0))
    sheet.save(out, quality=85)


if __name__ == "__main__":
    main()
