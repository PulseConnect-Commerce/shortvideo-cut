/**
 * Serie "E-Commerce einfach erklärt", E01 Conversion Rate. Format FACE (Skill stil-face, Face-Up, One-Take, minimaler
 * Schnitt), Design nacht. Skript aus seinem Kalender-Termin (Batch-Aufnahme 14.10.2026); pro Satz der letzte saubere
 * Anlauf. Vorlage: src/projekte/_serie/Serie.tsx.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Conversion", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const gutSchlecht = F("aber", C.WE("abschließen"));
const vorteil = F("dein", C.WE("zeichen"));
const cta = F("und", C.WE("einkaufen"));

export const Video = serienVideo(
  C,
  { line1: "Conversion Rate:", line2: "Was bedeutet das?", scale: 0.9 },
  [
    {
      at: F("denn"),
      title: "Ein Beispiel",
      chips: [],
      skizze: [
        { at: F("100"), icon: "personen", text: "100 Besucher" },
        { at: F("zwei"), zeichen: "→", icon: "wagen", text: "2 kaufen" },
        { at: F("sogenannte"), zeichen: "=", text: "2 % CR", ergebnis: true },
      ],
    },
    {
      at: gutSchlecht,
      title: "Gut oder schlecht?",
      chips: [
        { at: F("produkt"), text: "Produkt" },
        { at: F("zielgruppe"), text: "Zielgruppe" },
        { at: F("traffic"), text: "Traffic-Quelle" },
      ],
    },
    {
      at: F("beobachte"),
      title: "Das zählt",
      chips: [{ at: F("steigt"), text: "Steigt sie? Gutes Zeichen", wichtig: true }],
      skizze: [{ at: F("zeitverlauf"), icon: "kurve", text: "Verlauf beobachten" }],
    },
    {
      at: vorteil,
      title: "Dein Vorteil",
      chips: [
        { at: F("bestellungen"), text: "Mehr Bestellungen", wichtig: true },
        { at: F("traffic", vorteil), text: "ohne mehr Traffic" },
      ],
    },
    {
      at: cta,
      title: "Meine Follow-Rate?",
      chips: [{ at: F("folge"), text: "Folg mir für mehr E-Commerce-Wissen" }],
    },
  ],
  [
    [F("sogenannte"), C.WE("rate", F("sogenannte")) + 6],
    [F("follow", cta), C.WE("follow", cta) + 10],
  ],
  { scale: 1.4, hoch: 462, x: 118 },
  { einblendungen: 800, untertitel: 1460, whoosh: false },
);
