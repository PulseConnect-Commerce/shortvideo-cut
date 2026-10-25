"""Gestaltet die Hintergründe für P04 (1080x1920, Video-Koordinaten) aus echten Screenshots offizieller Shopify-Seiten
und zeigt eine Vorschau mit ihm (freigestellt) davor.

  python gestalte.py <screenshots-ordner> <ziel-ordner> [--vorschau <take.mp4> <sekunde> <rvm.torchscript>]

Je Bild: Ausschnitt (Quell-y oben), Maßstab, leicht abgedunkelt und minimal weichgezeichnet, nach unten (hinter Pille
und Karte) etwas dunkler, damit er, die Untertitel-Pille und die helle Karte lesbar bleiben. Nichts dazugemalt.
"""
import sys, os, json
import numpy as np, cv2

BILD = dict(scale=1.3, hoch=522, x=12)   # wie in src/projekte/pagebuilder/Video.tsx
HG = {
    # name: (datei, quelle_y_oben, maßstab, x_versatz, abdunkeln); Überschrift jeweils oben im Streifen über dem Kopf
    "hg-abschnitte": ("abschnitte.png", 262, 0.9, 0, 0.92),
    "hg-sidekick": ("sidekick-voll.png", 1795, 0.85, 81, 1.0),
    "hg-magic": ("gen-top.png", 430, 0.58, 227, 0.92),
    "hg-blockgen": ("editions.png", 325, 0.6, 216, 1.0),
    "hg-hinweise": ("gen-hinweise.png", 1158, 0.85, 0, 0.92),
    "hg-perfekt": ("gen-perfekt.png", 580, 0.9, 0, 0.92),
    "hg-duplizieren": ("duplizieren.png", 262, 0.9, 0, 0.92),
}


def gestalte(src, y0, s, dx, dim):
    img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
    h, w = img.shape[:2]
    out = np.zeros((1920, 1080, 3), np.float32)
    m = np.float32([[s, 0, dx], [0, s, -y0 * s]])
    out = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    out = cv2.GaussianBlur(out, (0, 0), 1.1)
    # leicht abdunkeln, nach unten (hinter Pille und Karte, ab y ~950) etwas mehr
    yy = np.linspace(0, 1, 1920)[:, None, None]
    ramp = np.clip((yy * 1920 - 900) / 500, 0, 1)
    out = out * (dim - 0.12 * ramp)
    return np.clip(out, 0, 255).astype(np.uint8)


def vorschau(bg, take, t, rvm):
    import subprocess, torch
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", str(t), "-i", take, "-frames:v", "1", "-f", "rawvideo",
                          "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    img = np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3)
    model = torch.jit.load(rvm).eval()
    small = cv2.resize(img, (540, 960), interpolation=cv2.INTER_AREA)
    with torch.no_grad():
        _, pha, *_ = model(torch.from_numpy(small.copy()).permute(2, 0, 1)[None].float() / 255, None, None, None, None, 0.4)
    a = cv2.resize(pha[0, 0].numpy(), (1080, 1920))
    s, hoch, bx = BILD["scale"], BILD["hoch"], BILD["x"]
    m = np.float32([[s, 0, 540 - 540 * s - bx], [0, s, -hoch]])
    fg = cv2.warpAffine(img, m, (1080, 1920), flags=cv2.INTER_LINEAR)
    al = cv2.warpAffine(a, m, (1080, 1920), flags=cv2.INTER_LINEAR)[..., None]
    b = cv2.cvtColor(bg, cv2.COLOR_BGR2RGB).astype(np.float32)
    comp = al * fg + (1 - al) * b
    comp = cv2.cvtColor(np.clip(comp, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
    ov = comp.copy()
    cv2.rectangle(ov, (190, 990), (790, 1062), (20, 20, 20), -1)          # Pille (ungefähr)
    cv2.rectangle(ov, (80, 1085), (900, 1470), (245, 245, 245), -1)       # Karte
    comp = cv2.addWeighted(ov, 0.75, comp, 0.25, 0)
    for y in (260, 280):
        cv2.line(comp, (0, y), (1080, y), (0, 0, 255), 1)
    return comp


if __name__ == "__main__":
    src_dir, ziel = sys.argv[1], sys.argv[2]
    os.makedirs(ziel, exist_ok=True)
    nur = os.environ.get("NUR")
    for name, (datei, y0, s, dx, dim) in HG.items():
        if nur and name not in nur.split(","):
            continue
        p = os.path.join(src_dir, datei)
        if not os.path.exists(p):
            print("fehlt", p); continue
        bg = gestalte(p, y0, s, dx, dim)
        cv2.imwrite(os.path.join(ziel, name + ".png"), bg)
        if "--vorschau" in sys.argv:
            i = sys.argv.index("--vorschau")
            take, t, rvm = sys.argv[i + 1], float(sys.argv[i + 2]), sys.argv[i + 3]
            v = vorschau(bg, take, t, rvm)
            cv2.imwrite(os.path.join(ziel, "vorschau-" + name + ".jpg"), cv2.resize(v, (540, 960)))
        print("ok", name)
