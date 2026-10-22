/**
 * E02 "Average Order Value" (Serie "E-Commerce einfach erklärt"), Neuschnitt im freigegebenen Look ab 2026-10-17.
 * Format FACE, Design nacht (Leuchtfarbe #CCFF00). Schnitt unverändert aus ../aov/cut.json. Skizzen aus
 * HyperFrames (hyperframes/aov-skizzen). Vorlage: src/projekte/conversion-v2/Video.tsx.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "../aov/cut.json";

const C = createCut(cut);
export const meta = { id: "AovV2", durationInFrames: C.DURATION, fps: C.FPS };

const BILD = { scale: 1.3, hoch: 255, x: 0 };
const HOOK_ENDE = Math.round(5.5 * C.FPS);

const BETONT = ["aov", "average", "order", "value", "bestellwert", "umsatz", "10.000", "100", "euro", "bundles", "zusatzprodukte", "erhöhen", "marge", "leidet", "vorteil", "steigerst", "besucher", "wissens-aov", "folg", "kennzahlen"];
const FARBIG = ["aov", "10.000", "100", "euro", "marge", "vorteil", "wissens-aov", "kennzahlen"];

/** Sekunden im Video, an denen die Karten erscheinen (wie in hyperframes/aov-skizzen/index.html) */
const SKIZZEN = [5.78, 9.87, 14.87, 19.33, 22.39, 30.95, 35.5, 38.33, 47.91, 50.05];
const AKZENTE: [string, number, number][] = [
  ["tick.mp3", 10.07, 0.3], ["success.mp3", 13.68, 0.18], ["tick.mp3", 16.18, 0.3], ["tick.mp3", 18.0, 0.3], ["success.mp3", 18.95, 0.18],
  ["tick.mp3", 24.0, 0.3], ["tick.mp3", 25.21, 0.3], ["success.mp3", 29.71, 0.18], ["tick.mp3", 31.5, 0.3], ["tick.mp3", 33.82, 0.3],
  ["tick.mp3", 36.96, 0.3], ["tick.mp3", 40.25, 0.3], ["tick.mp3", 43.43, 0.3], ["tick.mp3", 46.25, 0.3], ["tick.mp3", 52.7, 0.3],
  ["klick.mp3", 53.87, 0.3],
];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="nacht">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "puls.mp3" }) => {
  const fr = useCurrentFrame();
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 740px" }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={STIL.gradeSanft}
        />
      </AbsoluteFill>

      <DesignRahmen design="nacht">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="AOV?" line2="SCHON MAL GEHÖRT?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/aov/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} farbe="#CCFF00" y={1400} />}

      {sfx && (
        <>
          {SKIZZEN.map((s) => (
            <Sfx key={s} file="pop.mp3" at={(s + 0.1) * C.FPS} volume={STIL.sfx * 0.4} />
          ))}
          {AKZENTE.map(([file, s, v]) => (
            <Sfx key={`${file}${s}`} file={file} at={s * C.FPS} volume={STIL.sfx * v} />
          ))}
        </>
      )}
      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
