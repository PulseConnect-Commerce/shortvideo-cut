/**
 * "Dein Shopify-Shop braucht nicht mehr Besucher!" (Paul, 15.10.2026). Format FACE im Look der Serie
 * "E-Commerce einfach erklärt" (Vorlage _serie/Serie.tsx, Design nacht), eigener Clip ohne Folgennummer.
 * One-Take, pro Satz der letzte saubere Anlauf; der Satz zu Meta-/Google-Werbung fällt für die Länge (~81 s) weg.
 * Inhalt: Hook, 10.000 Besucher x 1 % = 100 vs. x 2 % = 200, drei Prüfpunkte, Fazit, CTA zur Serie.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Besucher", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const beispiel = F("aber");
const opt = F("optimierst");
const pruefen = F("deshalb");
const fazit = F("fazit");
const cta = F("und", C.WE("passiert"));

export const Video = serienVideo(
  C,
  { line1: "Mehr Besucher?", line2: "Brauchst du vielleicht nicht" },
  [
    {
      at: F("warum"),
      title: "Warum kauft keiner?",
      chips: [{ at: F("traffic"), text: "„Wir brauchen mehr Traffic!“" }],
    },
    {
      at: beispiel,
      title: "Rechenbeispiel",
      chips: [
        { at: F("10000", beispiel), text: "10.000 Besucher" },
        { at: F("1", F("rate", beispiel)), text: "× 1 % = 100 Bestellungen" },
        { at: F("2", F("rate", opt)), text: "× 2 % = 200 Bestellungen", wichtig: true, neu: true, stempel: true },
        { at: F("dafür"), text: "0 zusätzliche Besucher", neu: true },
      ],
    },
    {
      at: pruefen,
      title: "Prüf diese 3 Dinge",
      chips: [
        { at: F("produktseiten"), text: "Produktseiten" },
        { at: F("vertrauen"), text: "Vertrauen" },
        { at: F("checkout"), text: "Checkout" },
      ],
    },
    {
      at: fazit,
      title: "Mein Fazit",
      chips: [{ at: F("verstehen", fazit), text: "Erst Besucher verstehen, dann Budget", wichtig: true }],
    },
    { at: cta, title: "Folg mir", chips: [{ at: F("serie", cta), text: "E-Commerce einfach erklärt" }] },
  ],
  [
    [F("2", F("rate", opt)), C.WE("100", opt) + 8],
    [F("serie", cta), C.WE("erklärt", cta) + 10],
  ],
);
