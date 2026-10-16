/**
 * Editorial-Look (sein Referenzvideo 2026-10-16, @mymiasocial: "Können wir unseren Videoschnitt (gerade die
 * Untertitel und den Schnittstil mit den Soundeffekten) auf diesen Stil … anpassen? … Unsere Farben können hier
 * natürlich nach wie vor als Highlight verwendet werden, gerade für Titel."):
 * - Untertitel oben über dem Kopf, nur 1-3 Wörter auf einmal, schmale Großbuchstaben (Anton) in Weiß, eher klein.
 * - Betonte Wörter groß in einer kräftigen Serifen-Kursive (Playfair Display Black Italic), in Weiß oder in unserer
 *   Leuchtfarbe; die anderen Wörter der Seite stehen klein daneben ("WEIL die Strategie", "EIGENEN Weintrauben").
 * - Wörter blenden weich ein (4 Frames, leichte Unschärfe), kein Kasten, kein springendes Wort.
 * Schnitt dazu: bei jedem Schnitt abwechselnd weites und enges Bild (autoPunch), kurze leise Klicks nur auf
 * Einblendungen, keine Musik, keine Whooshes.
 */
import type React from "react";
import { interpolate } from "remotion";
import { clamp } from "./bausteine";
import { textWidth } from "./messen";
import type { createCut } from "./schnitt";

type Cut = ReturnType<typeof createCut>;
type Wort = Cut["PAGES"][number][number];

const SCHATTEN = "0 2px 6px rgb(0 0 0 / 0.45)";
const norm = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}%]/gu, "");

/** Seiten mit höchstens `max` Wörtern; ein betontes Wort beendet seine Seite (es steht nie mitten drin) */
export const kurzeSeiten = (C: Cut, betont: Set<string>, max = 3): Wort[][] => {
  const out: Wort[][] = [];
  for (const page of C.PAGES) {
    let cur: Wort[] = [];
    for (const w of page) {
      cur.push(w);
      const satzende = /[.?!:]$/.test(w.text);
      if (cur.length >= max || betont.has(norm(w.text)) || satzende) {
        out.push(cur);
        cur = [];
      }
    }
    if (cur.length) out.push(cur);
  }
  return out;
};

export const EditorialUntertitel: React.FC<{
  C: Cut;
  fr: number;
  /** betonte Wörter (klein geschrieben, ohne Satzzeichen) */
  betont: string[];
  /** Wörter, die zusätzlich in der Leuchtfarbe stehen (Teilmenge von betont) */
  farbig?: string[];
  farbe?: string;
  /** Mitte der Zeile (y) */
  y: number;
  klein?: number;
  gross?: number;
  breite?: number;
  off?: [number, number][];
}> = ({ C, fr, betont, farbig = [], farbe = "#00F090", y, klein = 50, gross = 118, breite = 780, off = [] }) => {
  if (off.some(([a, b]) => fr >= a && fr < b)) return null;
  const B = new Set(betont.map(norm));
  const Fa = new Set(farbig.map(norm));
  const seiten = kurzeSeiten(C, B);
  const starts = seiten.map((p) => p[0].a - 1);
  const i = starts.findIndex((s, k) => {
    const next = starts[k + 1] ?? Infinity;
    const last = seiten[k][seiten[k].length - 1].b;
    return fr >= s && fr < Math.min(next, last + 10);
  });
  if (i < 0) return null;
  const seite = seiten[i];
  // Breite messen und notfalls alles kleiner setzen (eine Zeile, nie umbrechen)
  const teile = seite.map((w) => ({ w, gross: B.has(norm(w.text)) }));
  const breiteBei = (f: number) =>
    teile.reduce(
      (n, t) =>
        n +
        (t.gross
          ? textWidth(t.w.text, gross * f, 900, 0, "Playfair Display") * 1.05
          : textWidth(t.w.text.toUpperCase(), klein * f, 400, 0, "Anton")),
      0,
    ) +
    (teile.length - 1) * klein * f * 0.3;
  const f = Math.min(1, breite / Math.max(1, breiteBei(1)));
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - breite) / 2,
        width: breite,
        top: y - gross * f * 0.62,
        height: gross * f * 1.24,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: `${klein * f * 0.3}px`,
        whiteSpace: "nowrap",
        color: "#fff",
        textShadow: SCHATTEN,
      }}
    >
      {teile.map(({ w, gross: g }, k) => {
        const t = interpolate(fr, [w.a - 2, w.a + 3], [0, 1], clamp);
        return (
          <span
            key={`${i}-${k}`}
            style={{
              fontFamily: g ? '"Playfair Display", serif' : "Anton, sans-serif",
              fontWeight: g ? 900 : 400,
              fontStyle: g ? "italic" : "normal",
              fontSize: (g ? gross : klein) * f,
              lineHeight: 1,
              textTransform: g ? "none" : "uppercase",
              letterSpacing: g ? "-0.01em" : "0.01em",
              color: g && Fa.has(norm(w.text)) ? farbe : "#fff",
              opacity: t,
              filter: `blur(${(1 - t) * 6}px)`,
              transform: `translateY(${(1 - t) * 8}px)`,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
