/**
 * Format FACE (Skill stil-face, erstes FACE-Video, Stil wird gerade festgelegt). "KI-Agenten im Onlineshop – sinnvoll
 * oder völliger Hype?" Meinungsvideo direkt in die Kamera. Ausgangspunkt HERO (src/projekte/vertrauen/), angepasst,
 * wo er es für FACE anders haben will.
 */
import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, type HookStil, SplitPerson, Takes } from "../../lib/bausteine";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "KiAgenten", durationInFrames: C.DURATION, fps: C.FPS };

/** fester Bildausschnitt ab der Hüfte: die Hose beginnt frühestens bei y 1640, das Bild endet so bei 1600 */
const CROP = 1.2;

/** ein durchgehendes, langsames Zoom-in (wie HERO, bis der Stil für FACE steht) */
const zoomAt = (fr: number) => 1 + 0.1 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);

/** Untertitel-Varianten für den Stilabgleich: wie HERO, größer auf Brusthöhe, keine */
const UNTERTITEL = { hero: { top: STIL.captionY, size: STIL.captionSize }, gross: { top: 1320, size: 100 }, aus: null };

/** raster: Platzierungsraster (nur Standbilder); hookStil, untertitel: Varianten zum Vergleichen als Standbild */
export const Video: React.FC<{
  voice?: boolean;
  sfx?: boolean;
  raster?: boolean;
  hookStil?: HookStil;
  untertitel?: keyof typeof UNTERTITEL;
}> = ({ voice = true, raster = false, hookStil = "balken", untertitel = "hero" }) => {
  const fr = useCurrentFrame();
  const ut = UNTERTITEL[untertitel];
  return (
    <AbsoluteFill style={{ backgroundColor: STIL.paper }}>
      <SplitPerson split={0} zoom={zoomAt(fr)}>
        <Takes C={C} voice={voice} transform={`scale(${CROP})`} transformOrigin="50% 0%" />
      </SplitPerson>
      <HookTitle fr={fr} line1="KI-AGENTEN:" line2="GENIAL ODER BULLSHIT?" outAt={C.cue("angeblich") - 8} stil={hookStil} />
      {ut && <Captions C={C} fr={fr} top={ut.top} size={ut.size} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
