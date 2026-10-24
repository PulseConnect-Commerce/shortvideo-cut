/**
 * Pill-Untertitel (PROBE nach Pauls Referenz 2026-10-24, .claude/skills/faber-cut/karten-aufbau.md, Punkt 8): kurze
 * Phrasen von 2-4 Wörtern in einer dunklen, abgerundeten Pille (rgba(10,12,14,0.82), Geist 700, ~44 px, weiß), das
 * gerade gesprochene Wort im PulseConnect-Grün #00E090. Sitzt direkt über der Aufbau-Karte (ohne Karte auf Brusthöhe).
 * Eigener Baustein neben editorial.tsx, damit die bestehenden Projekte unverändert bleiben.
 *
 *   <PillUntertitel C={C} fr={fr} x={490} y={1075} />
 */
import type React from "react";
import { interpolate } from "remotion";
import { clamp } from "./bausteine";
import { textWidth } from "./messen";
import type { createCut, Word } from "./schnitt";

type Cut = ReturnType<typeof createCut>;
type Phrase = { words: Word[]; von: number; bis: number };

const LEAD = 2;

/** Wörter zu kurzen Phrasen: höchstens `max` Wörter und `zeichen` Buchstaben; ein Satzzeichen oder eine Pause ab
 * `pause` Frames beendet die Phrase. Eine Phrase steht vom ersten Wort bis zur nächsten Phrase (nach einer längeren
 * Pause höchstens `nach` Frames über ihr letztes Wort hinaus). */
export const phrasen = (C: Cut, max = 4, zeichen = 22, pause = 12, nach = 10): Phrase[] => {
  const W = C.WORDS;
  const out: Word[][] = [];
  let cur: Word[] = [];
  W.forEach((w, i) => {
    const next = W[i + 1];
    const laenge = [...cur, w].map((x) => x.text).join(" ").length;
    if (cur.length && (cur.length >= max || laenge > zeichen)) {
      out.push(cur);
      cur = [];
    }
    cur.push(w);
    const satz = /[.,;:!?]$/.test(w.text);
    const luecke = next ? next.a - w.b > pause : true;
    if (satz || luecke) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  // einzelne kurze Wörter am Phrasenanfang nicht allein stehen lassen: an die nächste Phrase hängen, wenn Platz ist
  const merged: Word[][] = [];
  for (let i = 0; i < out.length; i++) {
    const p = out[i];
    const n = out[i + 1];
    if (p.length === 1 && n && n.length < max && !/[.,;:!?]$/.test(p[0].text) && n[0].a - p[0].b <= pause) {
      out[i + 1] = [...p, ...n];
      continue;
    }
    merged.push(p);
  }
  return merged.map((words, i) => {
    const naechste = merged[i + 1];
    const von = Math.round(words[0].a) - LEAD;
    const ende = Math.round(words[words.length - 1].b) + nach;
    const bis = naechste ? Math.min(Math.round(naechste[0].a) - LEAD, Math.max(ende, von + 8)) : ende;
    return { words, von, bis };
  });
};

export const PillUntertitel: React.FC<{
  C: Cut;
  fr: number;
  /** Mitte der Pille (x, y) */
  x?: number;
  y?: number;
  size?: number;
  /** größte Breite der Pille; sonst wird die Schrift kleiner */
  breite?: number;
  farbe?: string;
  max?: number;
  off?: [number, number][];
}> = ({ C, fr, x = 540, y = 1075, size = 44, breite = 780, farbe = "#00E090", max = 4, off = [] }) => {
  if (off.some(([a, b]) => fr >= a && fr < b)) return null;
  const P = phrasen(C, max);
  const p = P.find((q) => fr >= q.von && fr < q.bis);
  if (!p) return null;
  const text = p.words.map((w) => w.text).join(" ");
  const pad = 22;
  const w0 = textWidth(text, size, 700, -0.01);
  const s = Math.min(size, Math.floor((size * (breite - 2 * pad)) / Math.max(1, w0)));
  const o = interpolate(fr, [p.von, p.von + 3], [0, 1], clamp);
  const dy = interpolate(fr, [p.von, p.von + 3], [6, 0], clamp);
  // aktives Wort: das zuletzt begonnene (bleibt grün, bis das nächste beginnt)
  let aktiv = -1;
  p.words.forEach((w, i) => {
    if (fr >= Math.round(w.a) - 1) aktiv = i;
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateY(${dy}px)`,
        opacity: o,
        background: "rgba(10, 12, 14, 0.82)",
        borderRadius: 18,
        padding: `${Math.round(s * 0.2)}px ${pad}px ${Math.round(s * 0.24)}px`,
        fontFamily: "Geist, system-ui, sans-serif",
        fontWeight: 700,
        fontSize: s,
        letterSpacing: "-0.01em",
        lineHeight: 1.15,
        color: "#FFFFFF",
        whiteSpace: "nowrap",
        boxShadow: "0 8px 22px rgb(0 0 0 / 0.25)",
      }}
    >
      {p.words.map((w, i) => (
        <span key={i} style={{ color: i === aktiv ? farbe : "#FFFFFF" }}>
          {(i ? " " : "") + w.text}
        </span>
      ))}
    </div>
  );
};
