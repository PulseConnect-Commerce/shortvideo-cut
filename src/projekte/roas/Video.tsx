/**
 * Serie "E-Commerce einfach erklärt", E04 Return on Ad Spend. Format FACE (Face-Up, One-Take, minimaler Schnitt),
 * Design nacht. Skript aus seinem Kalender-Termin (Batch-Aufnahme 14.10.2026); pro Satz der letzte saubere Anlauf,
 * beim Vorteil der erste (der spätere sagt "ihm"). Vorlage: _serie/Serie.tsx.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Roas", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const beispiel = F("also");
const ob = F("ob");
const cta = F("ein", C.WE("margen"));

export const Video = serienVideo(
  C,
  { line1: "ROAS:", line2: "Klingt gut – sagt alles?", scale: 0.9 },
  [
    {
      at: F("der", C.WE("aussagt")),
      title: "Was heißt ROAS?",
      chips: [{ at: F("return"), text: "Return on Ad Spend" }],
    },
    {
      at: beispiel,
      title: "Ein Beispiel",
      chips: [],
      skizze: [
        { at: F("1000", beispiel), icon: "megafon", text: "1.000 € Werbung" },
        { at: F("4000", beispiel), zeichen: "→", icon: "geld", text: "4.000 € Umsatz" },
        { at: F("4", F("liegt")), zeichen: "=", text: "ROAS 4", ergebnis: true },
      ],
    },
    {
      at: F("davon"),
      title: "Davon geht ab",
      chips: [],
      skizze: [
        { at: F("wareneinsatz"), icon: "paket", text: "Ware" },
        { at: F("versand"), zeichen: "−", icon: "lkw", text: "Versand" },
        { at: F("zahlungsgebühren"), zeichen: "−", icon: "karte", text: "Gebühren" },
      ],
    },
    {
      at: F("deshalb"),
      title: "Gut oder zu niedrig?",
      chips: [
        { at: F("gut", F("deshalb")), text: "Shop A: gut" },
        { at: F("niedrig"), text: "Shop B: zu niedrig", wichtig: true },
      ],
    },
    {
      at: F("dein"),
      title: "Dein Vorteil",
      chips: [
        { at: F("vergleichen"), text: "Werbung vergleichen" },
        { at: F("steuern"), text: "gezielter steuern" },
      ],
    },
    {
      at: ob,
      title: "Profitabel?",
      chips: [
        { at: F("kosten", ob), text: "Kosten" },
        { at: F("margen"), text: "Margen", wichtig: true },
      ],
    },
    { at: cta, title: "ROAS ≠ Gewinn", chips: [{ at: F("follow", cta), text: "Ein Follow ist immer Gewinn" }] },
  ],
  [
    [F("4", F("liegt")), C.WE("4", F("liegt")) + 12],
    [F("follow", cta), C.WE("follow", cta) + 10],
  ],
  { scale: 1.4, hoch: 462, x: 118 },
  { einblendungen: 800, untertitel: 1460, whoosh: false },
);
