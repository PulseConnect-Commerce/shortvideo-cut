/**
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, .claude/skills/faber-cut/karten-aufbau.md): "Kannst du bitte
 * beim Einblenden der News oder anderen Zitaten von Quellen meinen Kopf weiter nach unten schieben, damit man auch die
 * Quelle lesen kann? Oder ansonsten einfach mein Video in dem Moment kleiner machen und in Ecke schieben?"
 *
 * Solange eine Quelle oder ein Zitat gezeigt wird, steht der echte Screenshot groß über das ganze Bild (die markierten
 * Sätze klar, der Rest unter einem hellen Schleier), und er läuft als Facecam-Bubble unten rechts weiter (Kopf und
 * Schultern, abgerundet, leichter Schatten, über der Instagram-Zone und links der TikTok-Leiste). Ein- und Ausgang
 * 0,35 s: er schrumpft in die Ecke und wächst wieder zurück, kein harter Schnitt. Die Erklär-Karten blenden in dieser
 * Zeit aus, die Pill-Untertitel rücken links neben die Bubble.
 *
 * Nutzung in einer Komposition (Ebenen von unten nach oben):
 *
 *   const QUELLEN: QuelleFenster[] = [{ von: 6.1, bis: 9.24, bild: "broll/<projekt>/quelle-x.jpg", y: 90, fokus: [[430, 860]] }];
 *   const q = quelleZustand(QUELLEN, fr, C.FPS);
 *   <QuelleGross fenster={QUELLEN} fr={fr} fps={C.FPS} />           // unter ihm: der Screenshot
 *   <QuelleBubble p={q.p}> …Takes wie bisher… </QuelleBubble>         // er: Vollbild → Bubble
 *   <OffthreadVideo … style={{ opacity: kartenSicht(q.p) }} />         // Karten (skizzen.webm) blenden aus
 *   <PillUntertitel … {...quellePille(q.p, { x: 490, y: 1068 })} />   // Pille wandert neben die Bubble
 *
 * Takes und Ton bleiben unverändert (ein einziges Takes-Element, nur umrahmt); kein neues Porträt nötig. Steht hinter
 * ihm im Take ein Quellen-Hintergrund (npm run portrait --hintergrund), sollte der im Fenster liegen oder aus dem Take
 * heraus, sonst verdeckt sein Kopf außerhalb der Fenster wieder den Text.
 */
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { clamp } from "./bausteine";

export type QuelleFenster = {
  /** Sekunden im Schnitt: ab `von` schrumpft er, bis `bis` ist er wieder ganz da (Übergänge liegen innerhalb) */
  von: number;
  bis: number;
  /** Bild unter public/ (echter Screenshot, Breite 1080 * zoom), z. B. "broll/<projekt>/quelle-x.jpg" */
  bild: string;
  /** Lage auf dem Schirm: Oberkante des Bildes (px, auch negativ), x-Versatz und Maßstab (1 = 1080 breit) */
  y?: number;
  x?: number;
  zoom?: number;
  /** Bänder auf dem Schirm (y von, bis), die klar bleiben (die markierten Sätze); ohne Angabe bleibt alles klar */
  fokus?: [number, number][];
  /** kleine Herkunftszeile oben links (28 px wie seine Quellenangabe 2026-10-11), z. B. "Händlerbund · 26.10.2026"; nur, wenn
   * der Ausschnitt den Kopf der Seite nicht zeigt */
  label?: string;
  /** Seitenfarbe für Ränder, Standard weiß */
  seite?: string;
};

/** Bubble auf dem Schirm: unten rechts, x 520-900 (TikTok-Leiste ab x 900), y 1010-1480 (Instagram-Zone ab y 1500) */
export const BUBBLE = { x: 520, y: 1010, w: 380, h: 470, r: 40 };
/** Ausschnitt im Vollbild (Video-Koordinaten), der in der Bubble steht: Kopf und Schultern (Kopf ~y 305-990) */
export const AUSSCHNITT = { x: 90, y: 200, w: 900 };
/** Pille im Quellen-Modus: links neben der Bubble, im unteren Drittel */
export const PILLE_KLEIN = { x: 296, y: 1250, breite: 436 };
/** Dauer von Ein- und Ausgang in Sekunden */
export const UEBERGANG = 0.35;

const weich = Easing.inOut(Easing.cubic);

/** Zustand im Frame `fr`. p: 0 = normal, 1 = Quelle groß (weicher Ein- und Ausgang); f: das aktive Fenster.
 * Stoßen zwei Fenster aneinander (bis = von), bleibt er klein und nur das Bild wechselt (vor: das Fenster davor). */
export const quelleZustand = (fenster: QuelleFenster[], fr: number, fps: number) => {
  const d = UEBERGANG * fps;
  const stoesst = (x: number, y: number) => Math.abs(x - y) * fps < 1;
  for (const f of fenster) {
    const a = f.von * fps;
    const b = f.bis * fps;
    if (fr >= a && fr < b) {
      const vor = fenster.find((g) => g !== f && stoesst(g.bis, f.von)) ?? null;
      const nach = fenster.some((g) => g !== f && stoesst(g.von, f.bis));
      const pin = vor ? 1 : interpolate(fr, [a, a + d], [0, 1], clamp);
      const pout = nach ? 1 : interpolate(fr, [b - d, b], [1, 0], clamp);
      return { p: weich(Math.min(pin, pout)), f, a, b, vor };
    }
  }
  return { p: 0, f: null as QuelleFenster | null, a: 0, b: 0, vor: null as QuelleFenster | null };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deckkraft der Erklär-Karten (skizzen.webm): in der ersten Hälfte des Eingangs weg, in der zweiten Hälfte des
 * Ausgangs wieder da, damit beim Schrumpfen keine halbe Karte über der Quelle steht */
export const kartenSicht = (p: number) => 1 - Math.min(1, 2 * p);

/** Lage der Pill-Untertitel: normal → links neben der Bubble */
export const quellePille = (p: number, normal: { x: number; y: number; breite?: number }, klein = PILLE_KLEIN) => ({
  x: lerp(normal.x, klein.x, p),
  y: lerp(normal.y, klein.y, p),
  breite: lerp(normal.breite ?? 780, klein.breite, p),
});

/** Eine Seite: Screenshot, heller Schleier außerhalb der markierten Sätze, Herkunftszeile */
const Seite: React.FC<{ f: QuelleFenster; fr: number; a: number; b: number; opacity?: number }> = ({ f, fr, a, b, opacity = 1 }) => {
  const zoom = f.zoom ?? 1;
  const fokus = [...(f.fokus ?? [])].sort((u, v) => u[0] - v[0]);
  // ruhiges Heranfahren (2 %) um die Mitte der markierten Sätze, damit das Bild nie steht
  const mitte = fokus.length ? (fokus[0][0] + fokus[fokus.length - 1][1]) / 2 : 960;
  const kb = 1 + 0.02 * interpolate(fr, [a, b], [0, 1], clamp);
  const schleier: [number, number][] = [];
  let y0 = 0;
  for (const [u, v] of fokus) {
    if (u > y0) schleier.push([y0, u]);
    y0 = Math.max(y0, v);
  }
  if (fokus.length && y0 < 1920) schleier.push([y0, 1920]);
  const labelO = interpolate(fr, [a + 4, a + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: f.seite ?? "#FFFFFF", opacity }}>
      <AbsoluteFill style={{ transform: `scale(${kb})`, transformOrigin: `540px ${mitte}px` }}>
        <Img
          src={staticFile(f.bild)}
          style={{ position: "absolute", left: f.x ?? 0, top: f.y ?? 0, width: 1080 * zoom, height: "auto" }}
        />
        {schleier.map(([u, v], i) => (
          <div
            key={i}
            style={{ position: "absolute", left: 0, right: 0, top: u, height: v - u, background: "rgba(255,255,255,0.58)" }}
          />
        ))}
      </AbsoluteFill>
      {f.label && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 286,
            opacity: labelO,
            background: "rgba(10, 12, 14, 0.86)",
            color: "#FFFFFF",
            borderRadius: 14,
            padding: "8px 16px 9px",
            fontFamily: "Geist, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 18px rgb(0 0 0 / 0.18)",
          }}
        >
          <span style={{ color: "#00E090", fontWeight: 700 }}>QUELLE</span>
          {"  " + f.label}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Der Screenshot groß über das ganze Bild (liegt unter ihm; sichtbar, sobald er schrumpft). Bei aneinanderstoßenden
 * Fenstern blendet das neue Bild in 0,2 s über das alte. */
export const QuelleGross: React.FC<{ fenster: QuelleFenster[]; fr: number; fps: number }> = ({ fenster, fr, fps }) => {
  const q = quelleZustand(fenster, fr, fps);
  if (!q.f || q.p <= 0) return null;
  const blende = Math.round(0.2 * fps);
  const vorO = q.vor && fr < q.a + blende;
  return (
    <AbsoluteFill>
      {vorO && q.vor && <Seite f={q.vor} fr={fr} a={q.vor.von * fps} b={q.vor.bis * fps} />}
      <Seite
        f={q.f}
        fr={fr}
        a={q.a}
        b={q.b}
        opacity={q.vor ? interpolate(fr, [q.a, q.a + blende], [0, 1], clamp) : 1}
      />
    </AbsoluteFill>
  );
};

/** Er: bei p = 0 Vollbild wie immer, bei p = 1 Facecam-Bubble unten rechts (Kopf und Schultern aus AUSSCHNITT) */
export const QuelleBubble: React.FC<{
  p: number;
  bubble?: typeof BUBBLE;
  ausschnitt?: typeof AUSSCHNITT;
  children: React.ReactNode;
}> = ({ p, bubble = BUBBLE, ausschnitt = AUSSCHNITT, children }) => {
  // immer derselbe Aufbau (bei p = 0 Vollbild ohne Rahmen), damit die Videos beim Wechsel nicht neu laden
  // sichtbares Rechteck auf dem Schirm: Vollbild → Bubble
  const R = { x: lerp(0, bubble.x, p), y: lerp(0, bubble.y, p), w: lerp(1080, bubble.w, p), h: lerp(1920, bubble.h, p) };
  // Ausschnitt im Vollbild, der darin steht: ganzes Bild → Kopf und Schultern
  const cx = lerp(0, ausschnitt.x, p);
  const cy = lerp(0, ausschnitt.y, p);
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
      </div>
    </AbsoluteFill>
  );
};
