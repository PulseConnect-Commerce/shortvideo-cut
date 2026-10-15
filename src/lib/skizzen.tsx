/**
 * Kleine Erklär-Skizzen für die Serie (Pauls Wunsch 2026-10-15: "mehr kleine Grafiken, die die Begriffe noch besser
 * verständlich machen", "kleine Erklär-B-Rolls, ggf. kleine Skizzen"). Eine Skizze ist eine Rechnung oder Kette aus
 * Gliedern: Icon (mit Kreide-Linien gezeichnet, die Linie läuft sich ein) plus kurzer Text darunter, dazwischen
 * Zeichen wie ÷ = → −. Jedes Glied erscheint auf seinem Wort; das Ergebnis leuchtet in der Leuchtfarbe des Designs.
 * Steht auf einer dunklen Glaskarte im Bereich der Einblendungen (Brust, y ~1080-1400), höchstens 760 px breit.
 */
import type React from "react";
import { Easing, interpolate } from "remotion";
import { clamp } from "./bausteine";
import { useDesign } from "./design";

export type SkizzenIcon =
  | "person"
  | "personen"
  | "wagen"
  | "paket"
  | "geld"
  | "muenze"
  | "megafon"
  | "lkw"
  | "karte"
  | "prozent"
  | "trichter"
  | "plus"
  | "kurve";

export type Glied = { at: number; icon?: SkizzenIcon; text: string; zeichen?: string; ergebnis?: boolean };

/** Pfade der Icons (viewBox 0 0 64 64), als Linien gezeichnet */
const PFADE: Record<SkizzenIcon, string[]> = {
  person: ["M32 12 a8 8 0 1 0 0.01 0", "M16 54 C16 40 24 34 32 34 C40 34 48 40 48 54"],
  personen: [
    "M22 16 a7 7 0 1 0 0.01 0",
    "M42 16 a7 7 0 1 0 0.01 0",
    "M8 52 C8 40 14 34 22 34 C30 34 36 40 36 52",
    "M30 40 C33 36 37 34 42 34 C50 34 56 40 56 52",
  ],
  wagen: ["M6 12 H14 L20 40 H50 L56 20 H17", "M24 50 a4 4 0 1 0 0.01 0", "M46 50 a4 4 0 1 0 0.01 0"],
  paket: ["M10 22 L32 12 L54 22 V46 L32 56 L10 46 Z", "M10 22 L32 32 L54 22", "M32 32 V56"],
  geld: ["M6 18 H58 V46 H6 Z", "M32 24 a8 8 0 1 0 0.01 0", "M12 24 V40", "M52 24 V40"],
  muenze: ["M32 10 a22 22 0 1 0 0.01 0", "M38 24 C35 20 26 20 26 26 C26 32 38 30 38 38 C38 44 28 44 25 40", "M32 16 V48"],
  megafon: ["M8 26 H18 L44 12 V52 L18 38 H8 Z", "M18 38 L22 52 H28 L26 40", "M50 24 L56 20", "M50 40 L56 44", "M52 32 H58"],
  lkw: ["M4 18 H38 V44 H4 Z", "M38 26 H50 L58 34 V44 H38", "M14 48 a5 5 0 1 0 0.01 0", "M48 48 a5 5 0 1 0 0.01 0"],
  karte: ["M6 16 H58 V48 H6 Z", "M6 26 H58", "M14 38 H28"],
  prozent: ["M48 14 L16 50", "M18 16 a6 6 0 1 0 0.01 0", "M46 38 a6 6 0 1 0 0.01 0"],
  trichter: ["M6 12 H58 L38 34 V54 L26 48 V34 Z"],
  plus: ["M32 12 V52", "M12 32 H52"],
  kurve: ["M6 54 H58", "M6 54 V8", "M10 46 L24 36 L34 40 L54 14", "M46 14 H54 V22"],
};

const SkizzenIconSvg: React.FC<{ icon: SkizzenIcon; t: number; farbe: string; size: number }> = ({ icon, t, farbe, size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ overflow: "visible" }}>
    {PFADE[icon].map((d, i) => (
      <path
        key={i}
        d={d}
        pathLength={1}
        fill="none"
        stroke={farbe}
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - interpolate(t, [i * 0.18, i * 0.18 + 0.6], [0, 1], clamp)}
      />
    ))}
  </svg>
);

export const Skizze: React.FC<{ fr: number; glieder: Glied[]; until?: number; y?: number }> = ({ fr, glieder, until = Infinity, y = 1090 }) => {
  const D = useDesign();
  if (!glieder.length || fr < glieder[0].at - 2 || fr >= until + 8) return null;
  const leucht = D.tags.wichtig.background;
  // feste Größen: Icon 110 px, Text 40 px (darf umbrechen), Spalte höchstens 210 px; bei vier Gliedern etwas kleiner
  const n = glieder.length;
  const size = n > 3 ? 92 : 110;
  const spalte = n > 3 ? 160 : 210;
  const raus = Number.isFinite(until) ? interpolate(fr, [until, until + 8], [0, 1], clamp) : 0;
  const rein = interpolate(fr, [glieder[0].at - 2, glieder[0].at + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: `translateX(-50%) translateY(${(1 - rein) * 24 + raus * 16}px)`,
        opacity: rein * (1 - raus),
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "22px 26px 18px",
        maxWidth: 760,
        borderRadius: 26,
        background: "rgb(10 12 16 / 0.72)",
        border: "2px solid rgb(255 255 255 / 0.16)",
        boxShadow: "0 18px 40px rgb(0 0 0 / 0.35)",
        backdropFilter: "blur(8px)",
      }}
    >
      {glieder.map((g, i) => {
        const t = interpolate(fr, [g.at, g.at + 16], [0, 1], clamp);
        const sichtbar = fr >= g.at;
        const farbe = g.ergebnis ? leucht : "#fff";
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            {g.zeichen && (
              <div
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: 78,
                  lineHeight: `${size}px`,
                  color: "#fff",
                  opacity: sichtbar ? 1 : 0,
                }}
              >
                {g.zeichen}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: g.icon ? spalte : undefined,
                opacity: sichtbar ? 1 : 0,
                transform: `scale(${sichtbar ? interpolate(t, [0, 0.4, 0.7], [0.7, 1.08, 1], clamp) : 0.7})`,
              }}
            >
              {g.icon ? (
                <SkizzenIconSvg icon={g.icon} t={t} farbe={farbe} size={size} />
              ) : (
                <div style={{ height: 0 }} />
              )}
              <div
                style={{
                  marginTop: g.icon ? 10 : size * 0.3,
                  fontFamily: "Anton, sans-serif",
                  fontSize: g.icon ? (n > 3 ? 34 : 40) : n > 3 ? 48 : 58,
                  lineHeight: 1.05,
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                  whiteSpace: g.icon ? "normal" : "nowrap",
                  color: g.ergebnis ? "#0B0C0E" : "#fff",
                  background: g.ergebnis ? leucht : "transparent",
                  padding: g.ergebnis ? "2px 12px 4px" : 0,
                  borderRadius: 10,
                  boxShadow: g.ergebnis ? `0 0 28px ${leucht}66` : "none",
                }}
              >
                {g.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
