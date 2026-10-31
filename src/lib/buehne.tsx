/**
 * Bühne oben, Kamera unten: der M-Aufbau für Marken-Storys (Pauls Vorgabe 2026-10-31 zu M02 PURELEI,
 * .claude/skills/faber-cut/karten-aufbau.md "Marken-Story: oben der Inhalt, unten er"): "Ich finde in dem M02 Video
 * verdecke ich sehr oft den Text oder die Bilder mit meinem Kopf. Bitte versuche mich häufiger klein unten links oder
 * unten mittig zu setzen oder sogar einfach nur den gesamten unteren Bereich für meine Kamera und den oberen Bereich für
 * den Content zu nutzen."
 *
 * Aufteilung (1080 x 1920):
 *  - Bühne y 0 bis NAHT (~1000): ein ruhiger heller Grund; darauf oben das Bildfeld (y 0-640) mit scharfen Marken-
 *    Screenshots (wechseln nach Inhalt alle 4-7 s, weich überblendet, ruhiges Heranfahren 3 %, unten 80 px Verlauf in den
 *    Grund), darunter die Karten (skizzen.webm aus HyperFrames): neben einem Bild an der Lage KARTE_UNTEN (y 615-965), ohne
 *    Bild mittig an KARTE_MITTE (y 455-805). Lesbares zwischen y 280 und ~980, x 80 bis 900. Hook-Titel, Kennzahlen,
 *    Erklär-Karten und Folgen-Karte stehen auf der Bühne.
 *  - Kamera y NAHT bis 1920: er über die volle Breite vor seinem weichgezeichneten Zimmer (Porträt ohne --hintergrund),
 *    Kopfoberkante ~1090, nie etwas unter der Hüfte. An der Naht eine klare Kante mit kurzem Schatten.
 *  - Pill-Untertitel an der Naht (Mitte y ~1030), über seinem Kopf (PILLE_NAHT).
 *  - Quelle groß (src/lib/quelle-gross.tsx: QuelleGross, quelleZustand, kartenSicht, quellePille): die Seite über das ganze
 *    Bild, er schrumpft aus dem Kamerafeld in eine Bubble unten links (BUBBLE_UNTEN_LINKS), die Pille rechts daneben
 *    (PILLE_NEBEN_BUBBLE). Bühne und Karten blenden in dieser Zeit aus (sicht = kartenSicht(q.p)).
 *
 * Nutzung in einer Komposition (Ebenen von unten nach oben; Vorlage src/projekte/purelei/Video.tsx):
 *
 *   const BILDER: BuehnenBild[] = [{ von: 0, bis: 5.15, bild: "broll/<projekt>/b-x.jpg" }, …];
 *   const q = quelleZustand(QUELLEN, fr, C.FPS);
 *   <QuelleGross fenster={QUELLEN} fr={fr} fps={C.FPS} />                 // Quelle groß (unter allem)
 *   <Buehne bilder={BILDER} fr={fr} fps={C.FPS} sicht={kartenSicht(q.p)}>  // Grund, Bilder und darüber z. B.
 *     <OffthreadVideo src={staticFile("broll/<projekt>/skizzen.webm")} transparent muted … />   // die Karten
 *   </Buehne>
 *   <KameraUnten p={q.p}>                                                  // er: Kamerafeld → Bubble
 *     <Takes C={C} transform={kameraBild(BILD, zoom)} transformOrigin="0 0" grade={…} />
 *   </KameraUnten>
 *   <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE_NAHT, PILLE_NEBEN_BUBBLE)} />
 *
 * Bildlage messen: im Take Kopfoberkante, Augen (x, y) und Hüftlinie (npm run raster auf dem Take); dann
 * kameraBild({ scale, kopfX, kopfOben }) setzt die Augenlinie waagrecht mittig und die Kopfoberkante auf KOPF_OBEN. Die
 * Unterkante zeigt Take-y (1920 - ty) / scale: sie muss über der Hüftlinie liegen (Pauls Regel 2026-10-27).
 */
import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { clamp } from "./bausteine";

/** Grenze zwischen Bühne (oben) und Kamera (unten) */
export const NAHT = 1000;
/** Bildfeld der Bühne: Screenshots oben über die volle Breite, unten weicher Verlauf in den Grund */
export const BILDFELD = { hoehe: 640, verlauf: 80 };
/** Lage der Karten auf der Bühne (Oberkante bei 820 x 350; in HyperFrames als CSS top) */
export const KARTE_UNTEN = 615;
export const KARTE_MITTE = 455;
/** Kopfoberkante im Kamerafeld */
export const KOPF_OBEN = 1090;
/** Ruhiger heller Grund der Bühne (Pauls Wunsch heller Grund, karten-hell.md) */
export const GRUND = "linear-gradient(180deg, #F3F4F6 0%, #ECEEF1 100%)";
/** Überblendung zwischen zwei Bildern (Sekunden) */
export const BILD_BLENDE = 0.3;

/** Pille an der Naht, über seinem Kopf */
export const PILLE_NAHT = { x: 540, y: 1030, breite: 820 };
/** Bubble unten links (nicht mehr unten rechts, Vorgabe 31.10.): x 80-410 (links frei von der TikTok-Leiste), y 1090-1490
 * (über der Instagram-Zone ab y 1500) */
export const BUBBLE_UNTEN_LINKS = { x: 80, y: 1090, w: 330, h: 400, r: 40 };
/** Ausschnitt des Kamerafelds (Video-Koordinaten), der in der Bubble steht: Kopf und Schultern (Kopf ~1090-1560) */
export const AUSSCHNITT_KAMERA = { x: 200, y: 1030, w: 680 };
/** Pille im Quellen-Modus: rechts neben der Bubble (x 440-890), auf Höhe der Bubble */
export const PILLE_NEBEN_BUBBLE = { x: 665, y: 1290, breite: 440 };

export type BuehnenBild = {
  /** Sekunden im Schnitt; das Bild blendet ab `von` ein und steht bis `bis` (folgt direkt ein Bild, blendet das darüber) */
  von: number;
  bis: number;
  /** 1080 x 640 unter public/, z. B. "broll/<projekt>/b-x.jpg" (scharfer Ausschnitt einer echten Seite) */
  bild: string;
  /** Mitte des ruhigen Heranfahrens (y im Bildfeld), Standard 360 */
  fokusY?: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Transform für <Takes transformOrigin="0 0">: Augen waagrecht mittig, Kopfoberkante bei KOPF_OBEN, `zoom` (ruhiges
 * Zoom-in) um die Augen. kopfX/kopfOben/augenY: im Take gemessen. */
export const kameraBild = (
  b: { scale: number; kopfX: number; kopfOben: number; augenY: number },
  zoom = 1,
  kopfOben = KOPF_OBEN,
) => {
  const tx = 540 - b.kopfX * b.scale;
  const ty = kopfOben - b.kopfOben * b.scale;
  // Zoom um die Augen: Punkt P bleibt, alles andere wächst um `zoom`
  const ay = ty + b.augenY * b.scale;
  const s = b.scale * zoom;
  return `translate(${540 + (tx - 540) * zoom}px, ${ay + (ty - ay) * zoom}px) scale(${s})`;
};

/** Deckkraft eines Bildes im Frame `fr` (mit Überblendung über das vorige, wenn es direkt anschließt) */
const bildSicht = (bilder: BuehnenBild[], i: number, fr: number, fps: number) => {
  const b = bilder[i];
  const d = BILD_BLENDE * fps;
  const a = b.von * fps;
  const e = b.bis * fps;
  const folgt = bilder.some((x) => Math.abs(x.von - b.bis) * fps < 1.5);
  const vorher = bilder.some((x) => Math.abs(x.bis - b.von) * fps < 1.5);
  // schließt ein Bild an, bleibt dieses voll stehen, bis das nächste ganz eingeblendet ist
  const ende = folgt ? e + d : e;
  if (fr < a || fr >= ende) return 0;
  const ein = a === 0 && !vorher ? 1 : interpolate(fr, [a, a + d], [0, 1], clamp);
  const aus = folgt ? 1 : interpolate(fr, [e - d, e], [1, 0], clamp);
  return Math.min(ein, aus);
};

/** Die Bühne: Grund, Bildfeld mit den Screenshots, darüber `children` (Karten, Hook-Titel). `sicht` blendet alles aus
 * (Quelle groß). */
export const Buehne: React.FC<{
  bilder: BuehnenBild[];
  fr: number;
  fps: number;
  sicht?: number;
  naht?: number;
  children?: React.ReactNode;
}> = ({ bilder, fr, fps, sicht = 1, naht = NAHT, children }) => {
  if (sicht <= 0) return null;
  const maske = `linear-gradient(180deg, #000 0px, #000 ${BILDFELD.hoehe - BILDFELD.verlauf}px, transparent ${BILDFELD.hoehe}px)`;
  return (
    <AbsoluteFill style={{ opacity: sicht }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: naht, overflow: "hidden", background: GRUND }}>
        {bilder.map((b, i) => {
          const o = bildSicht(bilder, i, fr, fps);
          if (o <= 0) return null;
          // ruhiges Heranfahren (3 % über das Fenster), damit das Bild nie steht
          const t = interpolate(fr, [b.von * fps, (b.bis + BILD_BLENDE) * fps], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 1080,
                height: BILDFELD.hoehe,
                opacity: o,
                overflow: "hidden",
                WebkitMaskImage: maske,
                maskImage: maske,
              }}
            >
              <Img
                src={staticFile(b.bild)}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1080,
                  height: BILDFELD.hoehe,
                  transform: `scale(${1 + 0.03 * t})`,
                  transformOrigin: `540px ${b.fokusY ?? 360}px`,
                }}
              />
            </div>
          );
        })}
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Er im Kamerafeld unten (p = 0) bzw. als Bubble (p = 1, Quelle groß). `children`: das ganze Bild 1080 x 1920 mit den
 * Takes (Bildlage über kameraBild); gezeigt wird nur der Teil unter der Naht bzw. AUSSCHNITT_KAMERA. */
export const KameraUnten: React.FC<{
  p?: number;
  naht?: number;
  bubble?: typeof BUBBLE_UNTEN_LINKS;
  ausschnitt?: typeof AUSSCHNITT_KAMERA;
  children: React.ReactNode;
}> = ({ p = 0, naht = NAHT, bubble = BUBBLE_UNTEN_LINKS, ausschnitt = AUSSCHNITT_KAMERA, children }) => {
  // sichtbares Rechteck: Kamerafeld → Bubble; Ausschnitt im Bild: Feld unter der Naht → Kopf und Schultern
  const R = { x: lerp(0, bubble.x, p), y: lerp(naht, bubble.y, p), w: lerp(1080, bubble.w, p), h: lerp(1920 - naht, bubble.h, p) };
  const cx = lerp(0, ausschnitt.x, p);
  const cy = lerp(naht, ausschnitt.y, p);
  const cw = lerp(1080, ausschnitt.w, p);
  const s = R.w / cw;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: R.x,
          top: R.y,
          width: R.w,
          height: R.h,
          overflow: "hidden",
          borderRadius: lerp(0, bubble.r, p),
          boxShadow: p > 0 ? `0 ${14 * p}px ${36 * p}px rgb(0 0 0 / ${0.3 * p})` : "none",
          outline: p > 0 ? `${3 * p}px solid rgb(255 255 255 / ${0.92 * p})` : "none",
          backgroundColor: "#0B0C0E",
        }}
      >
        {/* immer derselbe Aufbau, damit die Videos beim Wechsel nicht neu laden */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 1920,
            transform: `translate(${-cx * s}px, ${-cy * s}px) scale(${s})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
        {/* klare Kante an der Naht: kurzer Schatten der Bühne auf das Kamerafeld */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: 34,
            opacity: 1 - p,
            background: "linear-gradient(180deg, rgb(0 0 0 / 0.28) 0%, rgb(0 0 0 / 0) 100%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
