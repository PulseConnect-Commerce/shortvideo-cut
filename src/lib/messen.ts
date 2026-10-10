/**
 * Textbreite in Geist, ohne den Browser zu fragen: die Zeichenbreiten sind einmal in Chromium gemessen
 * (geist-breiten.json, dieselbe Datei nimmt tools/fclib.py für die Untertitel-Seiten). So steht die Größe schon im
 * ersten Frame fest, auch bevor die Schrift geladen ist. Unterschneidung zählt nicht mit: eher 2-3 % zu breit.
 * Die Schriften der Designs (design.tsx) stehen in design-breiten.json, Schlüssel "<Familie>|<Gewicht>" ("400i" =
 * kursiv), ebenso in Chromium gemessen.
 */
import designBreiten from "./design-breiten.json";
import breiten from "./geist-breiten.json";

type Tabelle = Record<string, number>;
const T = breiten as unknown as Record<string, Tabelle>;
const D = designBreiten as unknown as Record<string, Tabelle>;

/** Breite in px; spacing = letter-spacing in em (z. B. -0.02); font = Familie einer Design-Schrift (sonst Geist) */
export const textWidth = (text: string, size: number, weight: number | string = 700, spacing = 0, font = "Geist") => {
  const t = (font === "Geist" ? T[String(weight)] : D[`${font}|${weight}`]) ?? T["700"];
  let w = 0;
  for (const c of text) w += (t[c] ?? 0.6) + spacing;
  return w * size;
};

/** die größte Schrift bis `max`, bei der der Text in `width` passt (nie kleiner als `min`) */
export const fitSize = (
  text: string,
  width: number,
  max: number,
  weight: number | string = 700,
  spacing = 0,
  min = 24,
  font = "Geist",
) => Math.max(min, Math.min(max, Math.floor((max * width) / Math.max(1, textWidth(text, max, weight, spacing, font)))));
