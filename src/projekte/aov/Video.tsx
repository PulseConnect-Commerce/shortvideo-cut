/**
 * Serie "E-Commerce einfach erklärt", E02 Average Order Value. Format FACE, Design nacht. Überarbeitet 2026-10-15 nach
 * seinem Feedback ("viel zu viele Schnitte und Soundeffekte, wirkt unnatürlich"; "kleine Erklär-B-Rolls, ggf. Skizzen"):
 * nur 6 Stücke aus den langen sauberen Anläufen (Pausen bis 0,9 s bleiben), kein Whoosh mehr, ein Stempel; Bildlage nach
 * seinem Referenzvideo (Augen bei y ~700, Einblendungen auf der Brust); zwei Skizzen erklären AOV und Bundles.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Aov", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const letztes = F("im");
const beispiel = F("machen");
const steigern = F("passende");
const marge = F("aber", C.WE("erhöhen"));
const vorteil = F("dein", C.WE("leidet"));
const cta = F("du", C.WE("marge", vorteil));

export const Video = serienVideo(
  C,
  { line1: "AOV?", line2: "Schon mal gehört?", scale: 0.9 },
  [
    {
      at: F("average"),
      title: "Average Order Value",
      chips: [{ at: F("durchschnittlichen"), text: "= durchschnittlicher Bestellwert", wichtig: true }],
    },
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
      chips: [],
      skizze: [
        { at: F("10", beispiel), icon: "geld", text: "10.000 € Umsatz" },
        { at: F("100", beispiel), zeichen: "÷", icon: "paket", text: "100 Bestellungen" },
        { at: F("euro", beispiel), zeichen: "=", text: "100 € AOV", ergebnis: true },
      ],
    },
    {
      at: steigern,
      title: "So steigt dein AOV",
      chips: [],
      skizze: [
        { at: steigern + 4, icon: "wagen", text: "Produkt" },
        { at: F("zusatzprodukte") + 6, zeichen: "+", icon: "paket", text: "Zusatz / Bundle" },
        { at: F("erhöhen"), zeichen: "=", text: "AOV ↑", ergebnis: true },
      ],
    },
    { at: marge, title: "Aber", chips: [{ at: F("marge", marge), text: "Die Marge darf nicht leiden", wichtig: true }] },
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
  [[F("euro", beispiel), C.WE("euro", beispiel) + 8]],
  { scale: 1.4, hoch: 462, x: 118 },
  { einblendungen: 800, untertitel: 1460, whoosh: false },
);
