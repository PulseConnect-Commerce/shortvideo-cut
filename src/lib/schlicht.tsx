/**
 * Schlichter Look (seine Vorgabe 2026-10-16: "schlichte Untertitel und keine B-Rolls … Es soll sehr natürlich wirken"):
 * Untertitel als eine ruhige weiße Zeile mit weichem Schatten, ohne Kasten, ohne farbiges Wort, ohne Pop-Animation,
 * und schlichter Text für die wenigen Einblendungen (Hook-Zahl, kurze Begriffe). Gilt für News/Reaction, FACE und HERO
 * außerhalb der Serie (Stil-Skills, Abschnitt "Test ab 2026-10-16").
 */
import type React from "react";
import { interpolate } from "remotion";
import { clamp } from "./bausteine";
import { textWidth } from "./messen";
import type { createCut } from "./schnitt";
import { STIL } from "./stil";

type Cut = ReturnType<typeof createCut>;

const SCHATTEN = "0 2px 4px rgb(0 0 0 / 0.55), 0 0 18px rgb(0 0 0 / 0.35)";

/** eine Zeile pro Untertitel-Seite, wird kleiner statt umzubrechen (höchstens 760 px breit) */
export const SchlichteUntertitel: React.FC<{ C: Cut; fr: number; top: number; size?: number; breite?: number }> = ({
  C,
  fr,
  top,
  size = 54,
  breite = 760,
}) => {
  const starts = C.PAGES.reduce<number[]>((acc, p, i) => {
    acc.push(Math.max(p[0].a - 1, i ? acc[i - 1] + 4 : 0));
    return acc;
  }, []);
  const i = starts.findIndex((s, k) => {
    const next = starts[k + 1] ?? Infinity;
    const last = C.PAGES[k][C.PAGES[k].length - 1].b;
    return fr >= s && fr < Math.min(next, last + 12);
  });
  if (i < 0) return null;
  const text = C.PAGES[i].map((w) => w.text).join(" ");
  const fs = Math.min(size, Math.floor((size * breite) / Math.max(1, textWidth(text, size, 600))));
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - breite) / 2,
        width: breite,
        top,
        textAlign: "center",
        fontFamily: STIL.font,
        fontWeight: 600,
        fontSize: fs,
        lineHeight: 1.15,
        color: "#fff",
        whiteSpace: "nowrap",
        textShadow: SCHATTEN,
      }}
    >
      {text}
    </div>
  );
};

/** schlichter Text, blendet in 4 Frames ein und aus (kein Pop, kein Kasten) */
export const SchlichterText: React.FC<{
  fr: number;
  at: number;
  until: number;
  top: number;
  size: number;
  weight?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ fr, at, until, top, size, weight = 800, children, style }) => {
  if (fr < at || fr >= until + 4) return null;
  const o = interpolate(fr, [at, at + 4, until, until + 4], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        width: 780,
        top,
        textAlign: "center",
        fontFamily: STIL.font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.1,
        color: "#fff",
        textShadow: SCHATTEN,
        opacity: o,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
