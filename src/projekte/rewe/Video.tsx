/**
 * Format NEWS/Reaction, Editorial-Look (wie Zoll und easyShop): "REWE × Lieferando" (Cutter-Briefing im Kalender,
 * 17.10.2026; Veröffentlichung 17.10. 18:00). REWE und Lieferando liefern in Hamburg aus fünf Märkten, laut
 * Ankündigung in rund 45 Minuten, 5.000 bis 9.000 Produkte je nach Markt (neuhandeln.de vom 15.10.2026,
 * Pressemitteilungen von REWE und Lieferando). Die 45 Minuten stehen als angekündigtes Versprechen da, nicht als
 * garantierte Lieferzeit (Claim-Check im Briefing).
 * Untertitel oben (Editorial), Hook im alten Titel-Stil, leichter Porträt-Modus, weit/eng im Wechsel bei jedem Schnitt,
 * leise Klicks nur auf Einblendungen, keine Musik. Die Schlagzeile als Screenshot-Ausschnitt auf der Brust, die Fakten
 * als schlichte Zeilen in Anton.
 */
import type React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { autoPunch } from "../../lib/kit";
import { Raster } from "../../lib/raster";
import { SchlichterText } from "../../lib/schlicht";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Rewe", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

/** Bildlage wie bei Zoll und easyShop: Augen bei y ~740 (im Take bei ~850) */
const BILD = { scale: 1.3, hoch: 365, x: 65 };
const HOOK_TIEFER = 130;
const ERSTER_SCHNITT = C.SPANS[1]?.at ?? C.DURATION;
const HOOK_ENDE = C.WE("ecke") + 8;

const SCHLAGZEILE = F("schaut");
const SCHLAGZEILE_ENDE = F("hamburg") - 4;
const FAKTEN = [
  { at: F("hamburg"), text: "Hamburg" },
  { at: F("fünf"), text: "5 REWE-Märkte" },
  { at: F("45"), text: "≈ 45 Minuten (angekündigt)" },
  { at: F("5000"), text: "5.000–9.000 Artikel" },
];
const FAKTEN_ENDE = F("rewe-mitarbeiter") - 4;
const ABLAUF = [
  { at: F("rewe-mitarbeiter"), text: "Zusammenstellen: REWE" },
  { at: F("lieferando", F("rewe-mitarbeiter")), text: "Zustellung: Lieferando" },
];
const ABLAUF_ENDE = F("und", F("zustellung")) - 4;
const FILIALE = F("filiale");
const REICHWEITE = F("reichweite");
const EINORDNUNG_ENDE = F("natürlich") - 4;
const PROFIT = F("profitabel");
const ONLINE = F("online", PROFIT);
const PROFIT_ENDE = ONLINE - 4;
const ONLINE_ENDE = F("aber", ONLINE) - 4;

const BETONT = ["konkurrent", "supermarkt", "meldung", "hamburg", "fünf", "45", "5000", "9000", "zustellung", "spannend", "versandlager", "reichweite", "profitabel", "stationär", "meinung", "stunde", "normalität", "ausnahme"];
const FARBIG = ["fünf", "45", "5000", "9000", "profitabel"];
const PUNCH = autoPunch(C, { low: 1, high: 1.08 });
const punchAt = (fr: number) => PUNCH.reduce((z, [at, v]) => (fr >= at ? v : z), 1);

const ANTON: React.CSSProperties = { fontFamily: "Anton, sans-serif", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.01em", left: 180, width: 720 };

/** musik und neu: nur für die Beispiele vom 2026-10-17 (veröffentlicht wurde ohne beides). neu = der Stil ab 2026-10-17:
 * Skizzen aus HyperFrames (hyperframes/rewe-skizzen, transparent) statt der Textzeilen, Untertitel unter dem Kopf, nur
 * ein ruhiges Zoom-in statt weit/eng bei jedem Schnitt, Soundeffekte auf den Zeichnungen, Musik "news" */
type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false; neu?: boolean };

/** Sekunden im Video, an denen die Skizzen erscheinen (wie in hyperframes/rewe-skizzen/index.html) */
const SKIZZEN = [1.45, 7.25, 10.45, 13.55, 17.45];
const SKIZZEN_ENDE = 23;

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = false, neu = false }) => {
  const fr = useCurrentFrame();
  const karte = interpolate(fr, [SCHLAGZEILE, SCHLAGZEILE + 5, SCHLAGZEILE_ENDE, SCHLAGZEILE_ENDE + 5], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${neu ? 1 + 0.03 * (fr / C.DURATION) : punchAt(fr)})`, transformOrigin: "540px 740px" }}>
        <Takes C={C} voice={voice} transform={`translate(${-BILD.x}px, ${-(BILD.hoch - (fr < ERSTER_SCHNITT ? HOOK_TIEFER : 0))}px) scale(${BILD.scale})`} transformOrigin="50% 0%" />
      </AbsoluteFill>

      {/* Hook im alten Titel-Stil (Briefing: großes Keyword "45 MINUTEN?!") */}
      <DesignRahmen design="nacht-gruen">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="REWE liefert in" line2="45 Minuten?!" outAt={HOOK_ENDE - 4} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Originalüberschrift (neuhandeln.de, 15.10.2026) */}
      {karte > 0 && (
        <>
          <Img
            src={staticFile("broll/rewe/schlagzeile.png")}
            style={{ position: "absolute", left: neu ? 220 : 170, top: neu ? 990 : 1030, width: neu ? 640 : 720, borderRadius: 18, boxShadow: "0 14px 34px rgb(0 0 0 / 0.4)", opacity: karte }}
          />
          <SchlichterText fr={fr} at={SCHLAGZEILE} until={SCHLAGZEILE_ENDE} top={neu ? 1368 : 1462} size={neu ? 26 : 28} weight={500} style={{ opacity: 0.85 * karte }}>
            Quelle: neuhandeln.de, 15.10.2026
          </SchlichterText>
        </>
      )}

      {/* neu: Skizzen aus HyperFrames (transparentes WebM) statt der Textzeilen */}
      {neu && (
        <Sequence from={0} durationInFrames={Math.round(SKIZZEN_ENDE * C.FPS)} layout="none">
          <OffthreadVideo src={staticFile("broll/rewe/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
        </Sequence>
      )}

      {/* Fakten laut Meldung, schnell nacheinander */}
      {!neu && FAKTEN.map((x, i) => (
        <SchlichterText key={x.text} fr={fr} at={x.at} until={FAKTEN_ENDE} top={1085 + i * 76} size={62} style={ANTON}>
          {x.text}
        </SchlichterText>
      ))}

      {/* wer was macht */}
      {!neu && ABLAUF.map((x, i) => (
        <SchlichterText key={x.text} fr={fr} at={x.at} until={ABLAUF_ENDE} top={1120 + i * 80} size={58} style={ANTON}>
          {x.text}
        </SchlichterText>
      ))}

      {/* Einordnung */}
      <SchlichterText fr={fr} at={FILIALE} until={EINORDNUNG_ENDE} top={1090} size={62} style={ANTON}>
        Filiale = lokales Versandlager
      </SchlichterText>
      <SchlichterText fr={fr} at={REICHWEITE} until={EINORDNUNG_ENDE} top={1250} size={58} style={ANTON}>
        Reichweite über Lieferando
      </SchlichterText>

      {/* kritischer Punkt */}
      <SchlichterText fr={fr} at={PROFIT} until={PROFIT_ENDE} top={1130} size={62} style={ANTON}>
        Schnelle Lieferung ≠ <span style={{ color: "#00F090" }}>automatisch profitabel</span>
      </SchlichterText>
      <SchlichterText fr={fr} at={ONLINE} until={ONLINE_ENDE} top={1130} size={62} style={ANTON}>
        Online + stationär wachsen zusammen
      </SchlichterText>

      {untertitel && !neu && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={330} off={[[0, HOOK_ENDE + 4]]} />}
      {untertitel && neu && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={1470} gross={104} klein={46} />}

      {sfx && neu && (
        <>
          {SKIZZEN.map((s) => (
            <Sfx key={s} file="pop.mp3" at={s * C.FPS} volume={STIL.sfx * 0.4} />
          ))}
          <Sfx file="tick.mp3" at={11.72 * C.FPS} volume={STIL.sfx * 0.35} />
          <Sfx file="pop.mp3" at={8.84 * C.FPS} volume={STIL.sfx * 0.3} />
          <Sfx file="pop.mp3" at={15.8 * C.FPS} volume={STIL.sfx * 0.3} />
          <Sfx file="success.mp3" at={22.28 * C.FPS} volume={STIL.sfx * 0.35} />
        </>
      )}
      {sfx && <Sfx file="klick.mp3" at={SCHLAGZEILE} volume={STIL.sfx * 0.35} />}
      {sfx && !neu && [...FAKTEN, ...ABLAUF].map((x) => (
        <Sfx key={x.text} file="klick.mp3" at={x.at} volume={STIL.sfx * 0.3} />
      ))}
      {sfx && [FILIALE, REICHWEITE, PROFIT, ONLINE].map((at) => (
        <Sfx key={at} file="klick.mp3" at={at} volume={STIL.sfx * 0.3} />
      ))}
      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
