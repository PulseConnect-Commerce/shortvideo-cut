/**
 * Format NEWS/Reaction im schlichten Test-Stil (seine Vorgabe 2026-10-16: "schlichte Untertitel und keine B-Rolls …
 * sehr natürlich … mit wenigen Schnitten"). "Zollkontrollen in der EU": nur 65 Zollinterventionen pro Million
 * Einfuhrartikel 2025 (DIHK/HDE-Impulspapier vom 14.10.2026, Prüfquote 0,0065 %, Bericht der DG TAXUD), Artikel auf
 * onlinemarktplatz.de vom 15.10.2026. Sein Plan: direkt mit der Zahl "65 von 1.000.000" starten, danach die
 * Originalüberschrift zeigen, bei den Händlerpflichten schnelle Texteinblendungen, am Ende er mit der Frage.
 * Schlicht umgesetzt: die Zahl oben über dem Kopf, die Schlagzeile als Screenshot auf der Brust, die Pflichten als
 * weiße Zeilen; keine Zooms, keine Soundeffekte, keine Musik, Fassung B (ohne "fordere ich …").
 */
import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { Raster } from "../../lib/raster";
import { SchlichterText, SchlichteUntertitel } from "../../lib/schlicht";
import { createCut } from "../../lib/schnitt";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Zoll", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

/** Bildlage nach seinem Referenzvideo: Augen bei y ~740, Kopf ab ~400, Brust ab ~1090 */
const BILD = { scale: 1.3, hoch: 581, x: 65 };
const UT_TOP = 1405;

const HOOK_ENDE = C.WE("überrascht") + 6;
const SCHLAGZEILE = F("schaut");
const SCHLAGZEILE_ENDE = C.WE("artikel", F("million")) + 10;
const PFLICHTEN = [
  { at: F("produkt"), text: "Produktsicherheit" },
  { at: F("kennzeichnungen"), text: "Kennzeichnung" },
  { at: F("verpackungspflichten"), text: "Verpackungspflichten" },
  { at: F("steuern"), text: "Steuern" },
];
const PFLICHTEN_ENDE = F("gleichzeitig") - 4;

type Props = { voice?: boolean; raster?: boolean; untertitel?: boolean };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, raster = false, untertitel = true }) => {
  const fr = useCurrentFrame();
  const karte = interpolate(fr, [SCHLAGZEILE, SCHLAGZEILE + 5, SCHLAGZEILE_ENDE, SCHLAGZEILE_ENDE + 5], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <Takes C={C} voice={voice} transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`} transformOrigin="50% 0%" />

      {/* direkt mit der Zahl starten */}
      <SchlichterText fr={fr} at={0} until={HOOK_ENDE} top={262} size={92} style={{ whiteSpace: "nowrap", left: 40, width: 1000 }}>
        65 von 1.000.000
      </SchlichterText>

      {/* Originalüberschrift (onlinemarktplatz.de, 15.10.2026) */}
      {karte > 0 && (
        <Img
          src={staticFile("broll/zoll/schlagzeile.png")}
          style={{
            position: "absolute",
            left: 170,
            top: 1025,
            width: 720,
            borderRadius: 18,
            boxShadow: "0 14px 34px rgb(0 0 0 / 0.4)",
            opacity: karte,
          }}
        />
      )}

      {/* Händlerpflichten: schnelle schlichte Zeilen */}
      {PFLICHTEN.map((x, i) => (
        <SchlichterText key={x.text} fr={fr} at={x.at} until={PFLICHTEN_ENDE} top={1085 + i * 72} size={58}>
          {x.text}
        </SchlichterText>
      ))}

      {untertitel && <SchlichteUntertitel C={C} fr={fr} top={UT_TOP} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
