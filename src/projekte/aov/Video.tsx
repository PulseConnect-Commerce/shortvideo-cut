/**
 * Serie "E-Commerce einfach erklärt", E02 Average Order Value. Format FACE (Face-Up, One-Take, minimaler Schnitt),
 * Design nacht. Skript aus seinem Kalender-Termin (Batch-Aufnahme 14.10.2026); viele Anläufe, pro Satz der letzte
 * saubere (die Begrüßung aus dem ersten Anlauf, weil er im letzten "Willkommen im" sagt). Vorlage: _serie/Serie.tsx.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Aov", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const letztes = F("im");
const beispiel = F("machen");
const steigern = F("zusatzprodukte");
const vorteil = F("dein", C.WE("leidet"));
const cta = F("du", C.WE("marge", vorteil));

export const Video = serienVideo(
  C,
  { line1: "AOV?", line2: "Schon mal gehört?" },
  [
    { at: F("mehr"), title: "Mehr Umsatz?!", chips: [{ at: F("besucher"), text: "ohne mehr Besucher" }] },
    {
      at: letztes,
      title: "Letztes Mal",
      chips: [
        { at: F("conversion", letztes), text: "Conversion Rate: wie viele kaufen?" },
        { at: F("bestellen", letztes), text: "AOV: wie viel sie bestellen", wichtig: true, neu: true },
      ],
    },
    {
      at: beispiel,
      title: "Ein Beispiel",
      chips: [
        { at: F("10", beispiel), text: "10.000 € Umsatz" },
        { at: F("100", beispiel), text: "100 Bestellungen" },
        { at: F("euro", beispiel), text: "AOV = 100 €", wichtig: true, neu: true, stempel: true },
      ],
    },
    {
      at: steigern,
      title: "So steigt dein AOV",
      chips: [
        { at: steigern + 2, text: "Zusatzprodukte" },
        { at: F("bundles"), text: "Bundles" },
        { at: F("marge"), text: "Aber: Marge im Blick", wichtig: true, neu: true },
      ],
    },
    {
      at: vorteil,
      title: "Dein Vorteil",
      chips: [
        { at: F("umsatz", vorteil), text: "Gleiche Bestellungen, mehr Umsatz", wichtig: true },
        { at: F("achte"), text: "Marge beachten", neu: true },
      ],
    },
    { at: cta, title: "Dein Wissens-AOV?", chips: [{ at: F("folg"), text: "Folg mir für mehr Kennzahlen" }] },
  ],
  [
    [F("euro", beispiel), C.WE("euro", beispiel) + 8],
    [F("folg"), C.WE("folg") + 10],
  ],
);
