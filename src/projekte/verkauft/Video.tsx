/**
 * "Ich habe ein E-Commerce-Business verkauft – und das ist meine wichtigste Erkenntnis" (Paul, 15.10.2026).
 * Format FACE im Serien-Look (Vorlage _serie/Serie.tsx, Design nacht). Er steht; nur hier ist links unten ein Stuhl im
 * Bild, darum ein engerer Ausschnitt ab dem Oberkörper (1,4-fach ab der Oberkante, Stuhl außerhalb), seine Vorgabe.
 * Der Skript-Hook ("Anfang dieses Jahres ... Umsatz ist nicht gleich Erfolg") ist nicht aufgenommen; der Hook steht
 * darum als Einblendung, gesprochen beginnt es mit 2016. Wiederholungen gekürzt (~91 s), Einblendungen nach seinem Plan.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Verkauft", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const weg = F("seitdem");
const aussen = F("in", C.WE("verkaufen"));
const seite = F("denn", C.WE("nicht", F("shopify")));
const ki = F("heute");
const kanal = F("genau", C.WE("gutes"));
const cta = F("und", C.WE("praxis"));

export const Video = serienVideo(
  C,
  { line1: "2026:", line2: "Unternehmen verkauft", scale: 1.05 },
  [
    {
      at: weg,
      title: "Mein Weg",
      chips: [
        { at: weg, text: "2016 → Dropshipping" },
        { at: F("amazon", weg), text: "Shopify | Amazon | eBay | Kaufland", neu: true },
        { at: F("2026", weg), text: "2026: Unternehmen verkauft", wichtig: true, neu: true, stempel: true },
      ],
    },
    {
      at: aussen,
      title: "Von außen vs. innen",
      chips: [
        { at: F("werbekosten"), text: "Werbekosten" },
        { at: F("retouren"), text: "Retouren" },
        { at: F("gebühren"), text: "Gebühren" },
        { at: F("shopify", aussen), text: "Shop gebaut ≠ Business", neu: true },
      ],
    },
    {
      at: seite,
      title: "Die andere Seite",
      chips: [
        { at: F("umsatz", seite), text: "Umsatz ≠ Gewinn", wichtig: true, stempel: true },
        { at: F("marge", seite), text: "Marge zu klein", neu: true },
      ],
    },
    {
      at: ki,
      title: "Künstliche Intelligenz",
      chips: [
        { at: F("produkttexten"), text: "Produkttexte" },
        { at: F("kundenservice"), text: "Kundenservice" },
        { at: F("automatisierungen"), text: "Automatisierung" },
        { at: F("aber", F("zahlen")), text: "KI rettet kein schlechtes Business", wichtig: true, neu: true },
      ],
    },
    {
      at: kanal,
      title: "Aus der Praxis",
      chips: [{ at: F("shopify", kanal), text: "E-Commerce • Shopify • KI" }],
    },
    { at: cta, title: "Folg mir", chips: [{ at: F("folge", cta), text: "E-Commerce • Shopify • KI → Folgen", wichtig: true }] },
  ],
  [
    [F("umsatz", seite), C.WE("klein", seite) + 8],
    [F("folge", cta), C.WE("reise", cta) + 10],
  ],
  { scale: 1.4, hoch: 0 },
);
