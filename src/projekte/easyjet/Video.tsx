/**
 * "Der easyJet-Gründer will jetzt Amazon Konkurrenz machen!" (Paul, 15.10.2026, Veröffentlichung 16.10. 09:00).
 * Format NEWS, Design nacht-gruen, Bildlage nach seinem Referenzvideo (Augen bei y ~700, Texthook oben, Einblendungen
 * auf der Brust, Untertitel darunter). Er steht; Ausschnitt 1,8-fach, leicht nach links verschoben (er steht rechts
 * der Mitte). Der Satz "Jetzt schaut euch mal diese Meldung hier an" fällt weg (keine Quelle im Bild), CTA = seine Frage.
 */
import { createCut } from "../../lib/schnitt";
import { serienVideo } from "../_serie/Serie";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Easyjet", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

const start = F("ein", C.WE("angreifen"));
const modell = F("und", C.WE("deutschland"));
const vorteile = F("und", C.WE("antreten"));
const haken = F("aber", C.WE("berechnet"));
const meinung = F("ich", C.WE("klar"));
const frage = F("aber", C.WE("werden"));

export const Video = serienVideo(
  C,
  { line1: "Amazon bekommt", line2: "Konkurrenz von easyJet!", scale: 0.9 },
  [
    {
      at: start,
      title: "Neuer Marktplatz",
      chips: [
        { at: F("easyshop", start), text: "EasyShop" },
        { at: F("21", start), text: "21 Länder in Europa", neu: true },
        { at: F("deutschland", start), text: "auch in Deutschland", wichtig: true, neu: true, stempel: true },
      ],
    },
    {
      at: modell,
      title: "Das Geschäftsmodell",
      chips: [
        { at: F("keine", modell), text: "verkauft selbst nichts" },
        { at: F("händler", F("gegen", modell)), text: "keine Konkurrenz für Händler", wichtig: true, neu: true },
      ],
    },
    {
      at: vorteile,
      title: "Für Händler",
      chips: [
        { at: F("account"), text: "1 Account" },
        { at: F("21", vorteile), text: "21 Länder" },
        { at: F("umsatzsteuer"), text: "Umsatzsteuer automatisch", neu: true },
      ],
    },
    {
      at: haken,
      title: "Der Haken",
      chips: [
        { at: F("kunden", haken), text: "Ohne Kunden kein Nutzen", wichtig: true },
        { at: F("reichweite"), text: "Reichweite? Kosten? Unklar", neu: true },
      ],
    },
    {
      at: meinung,
      title: "Meine Meinung",
      chips: [{ at: F("wettbewerb"), text: "Mehr Wettbewerb zu Amazon", wichtig: true }],
    },
    {
      at: frage,
      title: "Was glaubt ihr?",
      chips: [{ at: F("chance"), text: "Chance gegen Amazon?", wichtig: true }],
    },
  ],
  [
    [F("deutschland", start), C.WE("deutschland", start) + 10],
    [F("chance"), C.WE("amazon", F("chance")) + 10],
  ],
  { scale: 1.8, hoch: 650, x: 170 },
  { einblendungen: 800, untertitel: 1460, design: "nacht-gruen" },
);
