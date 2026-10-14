/**
 * Serie "E-Commerce einfach erklärt", E03 Customer Acquisition Cost. Format FACE (Face-Up, One-Take, minimaler
 * Schnitt), Design nacht. Skript aus seinem Kalender-Termin (Batch-Aufnahme 14.10.2026); pro Satz der letzte saubere
 * Anlauf, die zweite Frage "Was kostet dich ein neuer Kunde?" nur einmal (im Hook). Vorlage: _serie/Serie.tsx.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Cac", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const beispiel = F("gibst");
const vorteil = F("dein");
const cta = F("neue", C.WE("einsetzen"));

export const Video = serienVideo(
  C,
  { line1: "CAC:", line2: "Was kostet ein Neukunde?" },
  [
    {
      at: F("letztes"),
      title: "Letztes Mal",
      chips: [
        { at: F("bestellwert"), text: "AOV: der Bestellwert" },
        { at: F("kundengewinnung"), text: "Heute: Kosten pro Neukunde", wichtig: true, neu: true },
      ],
    },
    {
      at: beispiel,
      title: "Ein Beispiel",
      chips: [
        { at: F("1000"), text: "1.000 € Budget" },
        { at: F("20", beispiel), text: "20 neue Kunden" },
        { at: F("50", beispiel), text: "CAC = 50 € pro Neukunde", wichtig: true, neu: true, stempel: true },
      ],
    },
    {
      at: F("je"),
      title: "Was zählt dazu?",
      chips: [
        { at: F("anzeigenkosten"), text: "Anzeigen" },
        { at: F("marketing"), text: "Marketing" },
        { at: F("vertriebskosten"), text: "Vertrieb" },
      ],
    },
    {
      at: F("entscheidend"),
      title: "Entscheidend",
      chips: [{ at: F("verdienst"), text: "Verdienst du mehr, als er kostet?", wichtig: true }],
    },
    {
      at: vorteil,
      title: "Dein Vorteil",
      chips: [
        { at: F("kennst"), text: "CAC kennen" },
        { at: F("senkst"), text: "sinnvoll senken" },
        { at: F("budget"), text: "Budget effizienter einsetzen", wichtig: true, neu: true },
      ],
    },
    { at: cta, title: "Kunden kosten Geld", chips: [{ at: F("follow", cta), text: "Ein Follow kostet nichts" }] },
  ],
  [
    [F("50", beispiel), C.WE("neukunde", beispiel) + 8],
    [F("follow", cta), C.WE("follow", cta) + 10],
  ],
);
