/**
 * Designs: der Look eines Videos (Schrift, Farben, Untertitel, Hook, Chips und Karten, Farbstimmung). Das Format
 * (HERO, FACE, NEWS) legt fest, wie geschnitten wird; das Design, wie es aussieht. Beides wird pro Video gewählt.
 *
 * - "pulse": der Look der ersten Videos (Geist, Blau, weiße Chips, Hook aus HOOK_STILE); die Werte aus stil.ts.
 * - "nacht", "nacht-gruen", "nacht-mint": dunkel und laut, Anton in Großbuchstaben, das gesprochene Wort in einer
 *   leuchtenden Box, dunkle Glas-Chips. Die drei Varianten unterscheiden sich nur in der Leuchtfarbe (LEUCHT).
 *
 * Ein Video wählt sein Design mit <DesignRahmen design="nacht"> um alles herum; ohne Rahmen gilt "pulse". Die Bausteine
 * (Untertitel, Hook, Szene, Row, Tag, Mark, Takes) lesen es mit useDesign(). Er wählt das Design anhand von
 * Standbildern aus seinem Clip (Skill faber-cut, stil.md).
 */
import type React from "react";
import { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";
import { STIL } from "./stil";

/** Weiße Karte mit weichem Schatten (für Dokumente, Listen, Fenster): die Bildkarte von "pulse" */
export const card = {
  background: "#fff",
  borderRadius: 28,
  boxShadow: "0 2px 0 rgb(20 22 26 / 0.06), 0 14px 34px rgb(20 22 26 / 0.12)",
  fontFamily: STIL.font,
  color: STIL.ink,
} as const;

/** Weißer Chip mit Schatten: hält Text und Icons auf einem Foto lesbar (der Chip von "pulse") */
export const chip: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  boxShadow: "0 6px 18px rgb(20 22 26 / 0.22)",
};

/** Eine Schrift: Familie (CSS), Gewicht, in Großbuchstaben, Laufweite (em), Zeilenhöhe (`zeile`; Anton hat von sich
 * aus sehr viel Luft über und unter der Schrift, Chips würden zu hoch). Gemessen wird mit messen.ts. */
export type Schrift = { family: string; weight: number; caps?: boolean; spacing?: number; zeile?: number };
/** Gewicht, Laufweite und Familie für textWidth/fitSize */
export const mass = (s: Schrift) => [s.weight, s.spacing ?? 0, s.family] as const;
/** CSS einer Schrift (die Familie mit Geist als Rückfall) */
export const schriftCss = (s: Schrift): React.CSSProperties => ({
  fontFamily: s.family === "Geist" ? STIL.font : `"${s.family}", ${STIL.font}`,
  fontWeight: s.weight,
  letterSpacing: `${s.spacing ?? 0}em`,
  ...(s.zeile ? { lineHeight: s.zeile } : {}),
});
/** Text so, wie die Schrift ihn zeigt (Großbuchstaben) */
export const setze = (s: Schrift, text: string) => (s.caps ? text.toUpperCase() : text);

/** eine Zeile des Hooks: Schrift, Größe (höchstens), Farbe, optional Fläche (mit Ecken und Innenabstand), Kontur und
 * Schatten (auf einer Fläche ihr Leuchten) */
export type HookZeile = {
  schrift: Schrift;
  max: number;
  farbe: string;
  flaeche?: string;
  schatten?: string;
  kontur?: string;
  radius?: string;
  padding?: string;
};

export type Design = {
  name: DesignName;
  /** Farbstimmung der Takes (CSS-Filter) */
  grade: string;
  /** Untertitel: "farbe" = das gesprochene Wort in der Farbe `wort`, "box" = das Wort in einer Box der Farbe `wort` */
  untertitel: {
    schrift: Schrift;
    /** Größe relativ zur Größe des Formats (FACE 100 px, HERO 76 px) */
    faktor: number;
    farbe: string;
    kontur?: string;
    schatten: string;
    modus: "farbe" | "box";
    wort: string;
    wortText?: string;
  };
  /** Hook-Titel (fehlt bei "pulse": dort gilt der Stil aus HOOK_STILE) */
  hook?: { z1: HookZeile; z2: HookZeile; abstand: number };
  /** Bildkarte (mit Foto oder Icons) und ihre Schriftfarbe */
  karte: React.CSSProperties;
  kartenText: string;
  /** Chip auf einem Foto oder frei im Bild, und seine Schriftfarbe */
  chip: React.CSSProperties;
  chipText: string;
  /** Begriffe (Zeilen, Pillen) und Titel der Szene */
  text: Schrift;
  titel: Schrift;
  /** der Titel einer Szene als Chip (frei oder auf einem Foto) */
  titelChip: React.CSSProperties;
  nummer: { background: string; color: string };
  /** Pillen: Farben je Art, dazu ihre Form (Ecken, Schatten) */
  tags: Record<"accent" | "warn" | "ok" | "ink", { background: string; color: string }>;
  tag: React.CSSProperties;
  /** Haken und Kreuz */
  ok: string;
  okZeichen: string;
  warn: string;
  warnZeichen: string;
  /** Folgen-Knopf (vorher, nachher) und Sprechblase am Ende */
  folgen: { vorher: string; vorherText: string; nachher: string; nachherText: string; extra?: React.CSSProperties };
  blase: string;
  /** Schicht über dem Bild, unter den Grafiken (Abdunkeln, Vignette) */
  toenung?: React.FC;
};

const PULSE: Design = {
  name: "pulse",
  grade: STIL.grade,
  untertitel: {
    schrift: { family: "Geist", weight: 700, spacing: -0.02 },
    faktor: 1,
    farbe: "#fff",
    kontur: "6px rgb(20 22 26 / 0.9)",
    schatten: "0 4px 18px rgb(0 0 0 / 0.45)",
    modus: "farbe",
    wort: STIL.yellow,
  },
  karte: card,
  kartenText: STIL.ink,
  chip,
  chipText: STIL.ink,
  text: { family: "Geist", weight: 700, spacing: -0.01 },
  titel: { family: "Geist", weight: 800, spacing: -0.02 },
  titelChip: { ...chip, borderRadius: 999 },
  nummer: { background: STIL.yellow, color: STIL.ink },
  tags: {
    accent: { background: STIL.yellow, color: STIL.ink },
    warn: { background: STIL.red, color: "#fff" },
    ok: { background: STIL.accent2, color: STIL.ink },
    ink: { background: STIL.ink, color: "#fff" },
  },
  tag: { borderRadius: 999, boxShadow: "0 8px 20px rgb(20 22 26 / 0.18)" },
  ok: STIL.accent2,
  okZeichen: STIL.ink,
  warn: STIL.red,
  warnZeichen: "#fff",
  folgen: { vorher: STIL.hook.kern, vorherText: "#fff", nachher: STIL.accent2, nachherText: STIL.ink },
  blase: STIL.yellow,
};

/* ---------- NACHT: dunkel, Leuchtfarbe, Großbuchstaben (drei Varianten, die sich nur in der Leuchtfarbe unterscheiden) ---------- */

/** die Leuchtfarben der drei Varianten: Neon-Gelbgrün (Variante 1, "genau richtig"), das Hellgrün vom rechten Ende
 * des PulseConnect-Logos (Variante 2) und ein helles Mint-Türkis aus der Mitte des Logo-Verlaufs, aufgehellt (Variante 3) */
export const LEUCHT = { nacht: "#CCFF00", "nacht-gruen": "#00F090", "nacht-mint": "#40E8E0" } as const;
const NACHT_PINK = "#FF3B5C";
const NACHT_TINTE = "#0B0C0E";
const GLAS = "rgb(12 14 18 / 0.86)";
const anton: Schrift = { family: "Anton", weight: 400, caps: true, spacing: 0.01, zeile: 1.2 };
const space: Schrift = { family: "Space Grotesk", weight: 700, spacing: -0.01, zeile: 1.25 };
/** Leuchten in der Farbe `hex` (#RRGGBB) mit Deckkraft `a` */
const leuchten = (hex: string, blur: number, a: number) =>
  `0 0 ${blur}px rgb(${parseInt(hex.slice(1, 3), 16)} ${parseInt(hex.slice(3, 5), 16)} ${parseInt(hex.slice(5, 7), 16)} / ${a})`;

/** oben und unten abdunkeln, an den Rändern eine Vignette: die Leuchtfarbe strahlt, Texte bleiben lesbar */
const NachtToenung: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgb(4 6 10 / 0.62) 0%, rgb(4 6 10 / 0.18) 38%, rgb(4 6 10 / 0) 55%, rgb(4 6 10 / 0.35) 100%), radial-gradient(ellipse 85% 70% at 50% 45%, rgb(0 0 0 / 0) 55%, rgb(0 0 0 / 0.45) 100%)",
    }}
  />
);

const nacht = (name: keyof typeof LEUCHT): Design => {
  const neon = LEUCHT[name];
  return {
    name,
    grade: "contrast(1.12) saturate(0.88) brightness(0.9) hue-rotate(-6deg)",
    untertitel: {
      schrift: anton,
      faktor: 1.12,
      farbe: "#fff",
      kontur: "0.07em rgb(6 8 12 / 0.95)",
      schatten: "0 6px 22px rgb(0 0 0 / 0.55)",
      modus: "box",
      wort: neon,
      wortText: NACHT_TINTE,
    },
    hook: {
      z1: { schrift: anton, max: 128, farbe: "#fff", kontur: "0.07em rgb(6 8 12 / 0.95)", schatten: "0 8px 30px rgb(0 0 0 / 0.6)" },
      z2: { schrift: anton, max: 128, farbe: NACHT_TINTE, flaeche: neon, padding: "0.02em 0.16em 0.04em", radius: "0.06em", schatten: leuchten(neon, 44, 0.45) },
      abstand: 14,
    },
    karte: { background: GLAS, borderRadius: 18, boxShadow: "0 16px 40px rgb(0 0 0 / 0.45)", border: "2px solid rgb(255 255 255 / 0.12)", fontFamily: `"Space Grotesk", ${STIL.font}`, color: "#fff" },
    kartenText: "#fff",
    chip: { background: GLAS, borderRadius: 16, boxShadow: "0 10px 26px rgb(0 0 0 / 0.4)", border: "2px solid rgb(255 255 255 / 0.12)" },
    chipText: "#fff",
    text: space,
    titel: anton,
    titelChip: { background: neon, color: NACHT_TINTE, borderRadius: 10, boxShadow: leuchten(neon, 34, 0.35) },
    nummer: { background: NACHT_TINTE, color: neon },
    tags: {
      accent: { background: "#fff", color: NACHT_TINTE },
      warn: { background: NACHT_PINK, color: "#fff" },
      ok: { background: neon, color: NACHT_TINTE },
      ink: { background: GLAS, color: "#fff" },
    },
    tag: { borderRadius: 12, boxShadow: "0 10px 26px rgb(0 0 0 / 0.4)" },
    ok: neon,
    okZeichen: NACHT_TINTE,
    warn: NACHT_PINK,
    warnZeichen: "#fff",
    folgen: { vorher: NACHT_PINK, vorherText: "#fff", nachher: neon, nachherText: NACHT_TINTE, extra: { borderRadius: 14 } },
    blase: neon,
    toenung: NachtToenung,
  };
};

export const DESIGNS = { pulse: PULSE, nacht: nacht("nacht"), "nacht-gruen": nacht("nacht-gruen"), "nacht-mint": nacht("nacht-mint") } satisfies Record<
  string,
  Design
>;
export type DesignName = keyof typeof DESIGNS;

const Ctx = createContext<Design>(PULSE);
/** das Design des Videos (ohne <DesignRahmen> "pulse") */
export const useDesign = () => useContext(Ctx);

/** setzt das Design für alles darin */
export const DesignRahmen: React.FC<{ design?: DesignName; children: React.ReactNode }> = ({ design = "pulse", children }) => (
  <Ctx.Provider value={DESIGNS[design]}>{children}</Ctx.Provider>
);

/** die Tönung des Designs: über dem Bild der Person, unter den Grafiken einsetzen */
export const Toenung: React.FC = () => {
  const D = useDesign();
  return D.toenung ? <D.toenung /> : null;
};
