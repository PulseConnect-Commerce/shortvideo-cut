/**
 * Textbreite in Geist, ohne den Browser zu fragen: die Zeichenbreiten sind einmal in Chromium gemessen
 * (geist-breiten.json, dieselbe Datei nimmt tools/fclib.py für die Untertitel-Seiten). So steht die Größe schon im
 * ersten Frame fest, auch bevor die Schrift geladen ist. Unterschneidung zählt nicht mit: eher 2-3 % zu breit.
 */
import breiten from "./geist-breiten.json";

type Tabelle = Record<string, number>;
const T = breiten as unknown as Record<string, Tabelle>;

/** Breite in px; spacing = letter-spacing in em (z. B. -0.02) */
export const textWidth = (text: string, size: number, weight: 700 | 800 | 900 = 700, spacing = 0) => {
  const t = T[String(weight)] ?? T["700"];
  let w = 0;
  for (const c of text) w += (t[c] ?? 0.6) + spacing;
  return w * size;
};

/** die größte Schrift bis `max`, bei der der Text in `width` passt (nie kleiner als `min`) */
export const fitSize = (
  text: string,
  width: number,
  max: number,
  weight: 700 | 800 | 900 = 700,
  spacing = 0,
  min = 24,
) => Math.max(min, Math.min(max, Math.floor((max * width) / Math.max(1, textWidth(text, max, weight, spacing)))));
