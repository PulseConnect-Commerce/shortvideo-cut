/**
 * Vorlage für ein neues Video. Claude kopiert sie nach src/projekte/<projekt>/Video.tsx und baut darin die Grafiken
 * des Videos. Alles, was auf ein Wort gehört, wird mit C.cue("wort") gesetzt (2 Frames vor dem ersten Laut), nie mit
 * geschätzten Frames. Die Vorlage zeigt: Hook-Titel, Untertitel, eine Pille auf einem Wort, einen Punch-in-Zoom, einen
 * Splitscreen-Abschnitt mit einer getippten Zeile und Soundeffekte.
 */
import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  Captions,
  card,
  HookTitle,
  Pill,
  PopOn,
  punchAt,
  Sfx,
  SplitPerson,
  splitAt,
  Stage,
  Takes,
} from "../../lib/bausteine";
import { Raster } from "../../lib/raster";
import { createCut, typedSync } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Vorlage", durationInFrames: C.DURATION, fps: C.FPS };

/* Zeitpunkte: jedes Wort, auf das etwas fällt (ersetze die Wörter durch die aus deinem Schnitt) */
const T = (() => {
  const first = C.WORDS[0]?.a ?? 0;
  return {
    first,
    split: C.WORDS[Math.min(8, C.WORDS.length - 1)]?.a ?? 30, // Beispiel: ab dem 9. Wort geteilt
  };
})();
const SPLITS: [number, number][] = [[T.split - 4, T.split + 150]];
const PUNCH: [number, number][] = [[0, 1]];

/** raster: Platzierungsraster mit sicherer Fläche und den Zonen von TikTok/Instagram (nur für Standbilder) */
export const Video: React.FC<{ voice?: boolean; sfx?: boolean; raster?: boolean }> = ({
  voice = true,
  sfx = true,
  raster = false,
}) => {
  const fr = useCurrentFrame();
  const split = splitAt(SPLITS, fr);
  const typed = C.spoken(C.WORDS.slice(8, 14).map((w) => w.text).join(" "), T.split);
  return (
    <AbsoluteFill style={{ backgroundColor: STIL.paper }}>
      <Stage split={split}>
        <div style={{ ...card, position: "absolute", left: 60, top: 410, width: 890, padding: "28px 34px" }}>
          <div style={{ fontFamily: STIL.mono, fontSize: 30, color: STIL.muted }}>Beispiel: getippt mit der Stimme</div>
          <div style={{ fontFamily: STIL.mono, fontSize: 42, marginTop: 14 }}>{typedSync(typed, fr)}</div>
        </div>
      </Stage>
      <SplitPerson split={split} zoom={punchAt(PUNCH, fr)}>
        <Takes C={C} voice={voice} />
      </SplitPerson>

      <HookTitle fr={fr} kicker="MEINE SERIE · TAG 1" line1="Dein Hook in einer Zeile" line2="mit dem Kern in Gelb." outAt={T.split - 8} />
      <PopOn fr={fr} at={T.first + 30} until={T.split - 6} style={{ left: 60, top: 1000, width: 890, textAlign: "center" }}>
        <Pill bg={STIL.yellow} color={STIL.ink} size={46}>
          Pille auf einem Wort
        </Pill>
      </PopOn>
      <Captions
        C={C}
        fr={fr}
        top={split > 0.5 ? STIL.captionYSplit : STIL.captionY}
        size={split > 0.5 ? STIL.captionSizeSplit : STIL.captionSize}
      />

      {sfx && (
        <>
          <Sfx file="pop.mp3" at={T.first + 30} />
          <Sfx file="whoosh.mp3" at={SPLITS[0][0]} />
          <Sfx file="whoosh.mp3" at={SPLITS[0][1]} />
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
