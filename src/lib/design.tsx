/**
 * Designs: der Look eines Videos (Schrift, Farben, Untertitel, Hook, Chips und Karten, Farbstimmung). Das Format
 * (HERO, FACE, NEWS) legt fest, wie geschnitten wird; das Design, wie es aussieht. Beides wird pro Video gewählt.
 *
 * - "pulse": der Look der ersten Videos (Geist, Blau, weiße Chips, Hook aus HOOK_STILE); die Werte aus stil.ts.
 * - "nacht": dunkel und laut, Anton in Großbuchstaben, das gesprochene Wort in einer neongrünen Box, dunkle Glas-Chips.
 * - "magazin": ruhig und edel, Serifenschrift (Instrument Serif), warmes Orange, cremefarbene Papier-Chips, Filmkorn.
 * - "sticker": verspielt, Bricolage Grotesque, schwarze Ränder mit hartem Schatten, Gelb, Pink, Mint.
 *
 * Ein Video wählt sein Design mit <DesignRahmen design="nacht"> um alles herum; ohne Rahmen gilt "pulse". Die Bausteine
 * (Untertitel, Hook, Szene, Row, Tag, Mark, Takes) lesen es mit useDesign(). Er wählt das Design anhand von
 * Standbildern aus seinem Clip (Skill faber-cut, stil.md).
 */
import type React from "react";
import { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
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

/** Eine Schrift: Familie (CSS), Gewicht, kursiv, in Großbuchstaben, Laufweite (em), Größe gegenüber Geist (`faktor`,
 * z. B. 1,2 für eine Serifenschrift mit kleinen Kleinbuchstaben), Zeilenhöhe (`zeile`; Anton hat von sich aus sehr
 * viel Luft über und unter der Schrift, Chips würden zu hoch). Gemessen wird mit messen.ts. */
export type Schrift = { family: string; weight: number; italic?: boolean; caps?: boolean; spacing?: number; faktor?: number; zeile?: number };
/** Schlüssel für textWidth/fitSize: Familie und Gewicht ("400i" = kursiv) */
export const mass = (s: Schrift) => [s.italic ? `${s.weight}i` : s.weight, s.spacing ?? 0, s.family] as const;
/** CSS einer Schrift (die Familie mit Geist als Rückfall) */
export const schriftCss = (s: Schrift): React.CSSProperties => ({
  fontFamily: s.family === "Geist" ? STIL.font : `"${s.family}", ${STIL.font}`,
  fontWeight: s.weight,
  fontStyle: s.italic ? "italic" : "normal",
  letterSpacing: `${s.spacing ?? 0}em`,
  ...(s.zeile ? { lineHeight: s.zeile } : {}),
});
/** Text so, wie die Schrift ihn zeigt (Großbuchstaben) */
export const setze = (s: Schrift, text: string) => (s.caps ? text.toUpperCase() : text);

/** eine Zeile des Hooks: Schrift, Größe (höchstens), Farbe, optional Fläche, Rand, Schatten, Neigung, Leuchten */
export type HookZeile = {
  schrift: Schrift;
  max: number;
  farbe: string;
  flaeche?: string;
  rand?: string;
  schatten?: string;
  kontur?: string;
  kippen?: number;
  radius?: string;
  padding?: string;
};

export type Design = {
  name: DesignName;
  /** Farbstimmung der Takes (CSS-Filter) */
  grade: string;
  /** Untertitel: "farbe" = das gesprochene Wort in der Farbe `wort` (optional unterstrichen), "box" = das Wort in
   * einer Box der Farbe `wort`, "sticker" = das Wort als gekippter Aufkleber mit Rand und hartem Schatten */
  untertitel: {
    schrift: Schrift;
    /** Größe relativ zur Größe des Formats (FACE 100 px, HERO 76 px) */
    faktor: number;
    farbe: string;
    kontur?: string;
    schatten: string;
    modus: "farbe" | "box" | "sticker";
    wort: string;
    wortText?: string;
    /** Rand und harter Schatten des Aufklebers ("sticker") */
    wortRand?: string;
    unterstrich?: boolean;
  };
  /** Hook-Titel (fehlt bei "pulse": dort gilt der Stil aus HOOK_STILE) */
  hook?: { z1: HookZeile; z2: HookZeile; abstand: number; box?: React.CSSProperties };
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
  nummer: { background: string; color: string; border?: string };
  /** Pillen: Farben je Art, dazu ihre Form (Rand, Schatten) */
  tags: Record<"accent" | "warn" | "ok" | "ink", { background: string; color: string }>;
  tag: React.CSSProperties;
  /** Haken und Kreuz */
  ok: string;
  okZeichen: string;
  warn: string;
  warnZeichen: string;
  markRand?: string;
  /** Folgen-Knopf (vorher, nachher) und Sprechblase am Ende */
  folgen: { vorher: string; vorherText: string; nachher: string; nachherText: string; extra?: React.CSSProperties };
  blase: string;
  /** Schicht über dem Bild, unter den Grafiken (Abdunkeln, Vignette, Korn) */
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

/* ---------- NACHT: dunkel, Neon, Großbuchstaben ---------- */

const NEON = "#CCFF00";
const NACHT_PINK = "#FF3B5C";
const GLAS = "rgb(12 14 18 / 0.86)";
const anton: Schrift = { family: "Anton", weight: 400, caps: true, spacing: 0.01, zeile: 1.2 };
const space: Schrift = { family: "Space Grotesk", weight: 700, spacing: -0.01, zeile: 1.25 };

/** oben und unten abdunkeln, an den Rändern eine Vignette: die Neonfarben leuchten, Texte bleiben lesbar */
const NachtToenung: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgb(4 6 10 / 0.62) 0%, rgb(4 6 10 / 0.18) 38%, rgb(4 6 10 / 0) 55%, rgb(4 6 10 / 0.35) 100%), radial-gradient(ellipse 85% 70% at 50% 45%, rgb(0 0 0 / 0) 55%, rgb(0 0 0 / 0.45) 100%)",
    }}
  />
);

const NACHT: Design = {
  name: "nacht",
  grade: "contrast(1.12) saturate(0.88) brightness(0.9) hue-rotate(-6deg)",
  untertitel: {
    schrift: anton,
    faktor: 1.12,
    farbe: "#fff",
    kontur: "0.07em rgb(6 8 12 / 0.95)",
    schatten: "0 6px 22px rgb(0 0 0 / 0.55)",
    modus: "box",
    wort: NEON,
    wortText: "#0B0C0E",
  },
  hook: {
    z1: { schrift: anton, max: 128, farbe: "#fff", kontur: "0.07em rgb(6 8 12 / 0.95)", schatten: "0 8px 30px rgb(0 0 0 / 0.6)" },
    z2: { schrift: anton, max: 128, farbe: "#0B0C0E", flaeche: NEON, padding: "0.02em 0.16em 0.04em", radius: "0.06em", schatten: `0 0 44px rgb(204 255 0 / 0.45)` },
    abstand: 14,
  },
  karte: { background: GLAS, borderRadius: 18, boxShadow: "0 16px 40px rgb(0 0 0 / 0.45)", border: "2px solid rgb(255 255 255 / 0.12)", fontFamily: `"Space Grotesk", ${STIL.font}`, color: "#fff" },
  kartenText: "#fff",
  chip: { background: GLAS, borderRadius: 16, boxShadow: "0 10px 26px rgb(0 0 0 / 0.4)", border: "2px solid rgb(255 255 255 / 0.12)" },
  chipText: "#fff",
  text: space,
  titel: anton,
  titelChip: { background: NEON, color: "#0B0C0E", borderRadius: 10, boxShadow: "0 0 34px rgb(204 255 0 / 0.35)" },
  nummer: { background: "#0B0C0E", color: NEON },
  tags: {
    accent: { background: "#fff", color: "#0B0C0E" },
    warn: { background: NACHT_PINK, color: "#fff" },
    ok: { background: NEON, color: "#0B0C0E" },
    ink: { background: GLAS, color: "#fff" },
  },
  tag: { borderRadius: 12, boxShadow: "0 10px 26px rgb(0 0 0 / 0.4)" },
  ok: NEON,
  okZeichen: "#0B0C0E",
  warn: NACHT_PINK,
  warnZeichen: "#fff",
  folgen: { vorher: NACHT_PINK, vorherText: "#fff", nachher: NEON, nachherText: "#0B0C0E", extra: { borderRadius: 14 } },
  blase: NEON,
  toenung: NachtToenung,
};

/* ---------- MAGAZIN: Serifen, Creme, warmes Orange, Filmkorn ---------- */

const CREME = "#F2EBDD";
const TINTE = "#1B1916";
const ORANGE = "#F26A2E";
const SALBEI = "#4E7B5B";
const serif: Schrift = { family: "Instrument Serif", weight: 400, faktor: 1.2, zeile: 1.15 };
const serifKursiv: Schrift = { family: "Instrument Serif", weight: 400, italic: true, faktor: 1.1, zeile: 1.0 };

/** feines Filmkorn (wandert jeden Frame) und eine weiche, warme Vignette */
const KORN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1'/></filter><rect width='240' height='240' filter='url(#n)'/></svg>",
)}")`;
const MagazinToenung: React.FC = () => {
  const fr = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 75% at 50% 45%, rgb(0 0 0 / 0) 50%, rgb(30 18 8 / 0.42) 100%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: KORN,
          backgroundSize: "240px 240px",
          backgroundPosition: `${(fr * 37) % 240}px ${(fr * 91) % 240}px`,
          opacity: 0.09,
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
};

const MAGAZIN: Design = {
  name: "magazin",
  grade: "contrast(1.04) saturate(0.84) sepia(0.12) brightness(1.03)",
  untertitel: {
    schrift: serif,
    faktor: 1.06,
    farbe: "#fff",
    schatten: "0 2px 3px rgb(0 0 0 / 0.55), 0 4px 22px rgb(0 0 0 / 0.5)",
    modus: "farbe",
    wort: "#FFB07C",
    unterstrich: true,
  },
  hook: {
    z1: { schrift: { family: "Geist", weight: 700, caps: true, spacing: 0.2 }, max: 40, farbe: ORANGE },
    z2: { schrift: serifKursiv, max: 124, farbe: TINTE },
    abstand: 6,
    box: { background: CREME, padding: "30px 46px 34px", borderRadius: 6, boxShadow: "0 18px 44px rgb(20 12 4 / 0.32)" },
  },
  karte: { background: CREME, borderRadius: 6, boxShadow: "0 16px 40px rgb(20 12 4 / 0.28)", fontFamily: `"Instrument Serif", ${STIL.font}`, color: TINTE },
  kartenText: TINTE,
  chip: { background: CREME, borderRadius: 6, boxShadow: "0 8px 22px rgb(20 12 4 / 0.28)" },
  chipText: TINTE,
  text: serif,
  titel: serifKursiv,
  titelChip: { background: TINTE, color: CREME, borderRadius: 6, boxShadow: "0 10px 26px rgb(20 12 4 / 0.32)" },
  nummer: { background: ORANGE, color: CREME },
  tags: {
    accent: { background: TINTE, color: CREME },
    warn: { background: ORANGE, color: "#fff" },
    ok: { background: SALBEI, color: CREME },
    ink: { background: CREME, color: TINTE },
  },
  tag: { borderRadius: 6, boxShadow: "0 8px 22px rgb(20 12 4 / 0.28)" },
  ok: SALBEI,
  okZeichen: CREME,
  warn: ORANGE,
  warnZeichen: "#fff",
  folgen: { vorher: TINTE, vorherText: CREME, nachher: SALBEI, nachherText: CREME, extra: { borderRadius: 6 } },
  blase: ORANGE,
  toenung: MagazinToenung,
};

/* ---------- STICKER: Aufkleber mit schwarzem Rand und hartem Schatten ---------- */

const SCHWARZ = "#111111";
const GELB = "#FFE14D";
const PINK = "#FF5FA2";
const MINT = "#3DDC97";
const BLAU = "#6C9BFF";
const RAND = `4px solid ${SCHWARZ}`;
const HART = `6px 6px 0 ${SCHWARZ}`;
const bricolage: Schrift = { family: "Bricolage Grotesque", weight: 800, spacing: -0.02, zeile: 1.2 };
/** Titel und Pillen etwas kleiner: Bricolage ist breiter als Geist, und Rand und Schatten brauchen Platz */
const bricolageTitel: Schrift = { ...bricolage, faktor: 0.9 };

const STICKER: Design = {
  name: "sticker",
  grade: "contrast(1.06) saturate(1.18) brightness(1.03)",
  untertitel: {
    schrift: bricolage,
    faktor: 0.96,
    farbe: "#fff",
    kontur: `0.1em ${SCHWARZ}`,
    schatten: `0 5px 0 ${SCHWARZ}`,
    modus: "sticker",
    wort: GELB,
    wortText: SCHWARZ,
    wortRand: SCHWARZ,
  },
  hook: {
    z1: { schrift: bricolage, max: 104, farbe: SCHWARZ, flaeche: "#fff", rand: RAND, schatten: `8px 8px 0 ${SCHWARZ}`, kippen: -2.5, radius: "0.18em", padding: "0.06em 0.3em 0.12em" },
    z2: { schrift: bricolage, max: 104, farbe: SCHWARZ, flaeche: PINK, rand: RAND, schatten: `8px 8px 0 ${SCHWARZ}`, kippen: 2, radius: "0.18em", padding: "0.06em 0.3em 0.12em" },
    abstand: 22,
  },
  karte: { background: "#fff", borderRadius: 22, border: RAND, boxShadow: `8px 8px 0 ${SCHWARZ}`, fontFamily: `"Bricolage Grotesque", ${STIL.font}`, color: SCHWARZ },
  kartenText: SCHWARZ,
  chip: { background: "#fff", borderRadius: 18, border: RAND, boxShadow: HART },
  chipText: SCHWARZ,
  text: { family: "Bricolage Grotesque", weight: 700, spacing: -0.01, zeile: 1.25 },
  titel: bricolageTitel,
  titelChip: { background: GELB, color: SCHWARZ, borderRadius: 999, border: RAND, boxShadow: HART, transform: "rotate(-1.5deg)" },
  nummer: { background: PINK, color: SCHWARZ, border: `3px solid ${SCHWARZ}` },
  tags: {
    accent: { background: BLAU, color: SCHWARZ },
    warn: { background: PINK, color: SCHWARZ },
    ok: { background: MINT, color: SCHWARZ },
    ink: { background: SCHWARZ, color: "#fff" },
  },
  tag: { borderRadius: 999, border: RAND, boxShadow: HART },
  ok: MINT,
  okZeichen: SCHWARZ,
  warn: PINK,
  warnZeichen: SCHWARZ,
  markRand: SCHWARZ,
  folgen: { vorher: PINK, vorherText: SCHWARZ, nachher: MINT, nachherText: SCHWARZ, extra: { border: RAND, boxShadow: HART } },
  blase: GELB,
};

export const DESIGNS = { pulse: PULSE, nacht: NACHT, magazin: MAGAZIN, sticker: STICKER } satisfies Record<string, Design>;
export type DesignName = "pulse" | "nacht" | "magazin" | "sticker";

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
