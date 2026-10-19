/**
 * E01 "Conversion Rate" (Serie "E-Commerce einfach erklärt"), Neuschnitt im freigegebenen Look ab 2026-10-17.
 * Format FACE, Design nacht (Leuchtfarbe #CCFF00). Schnitt unverändert aus ../conversion/cut.json. Skizzen aus
 * HyperFrames (hyperframes/conversion-skizzen). Vorlage: src/projekte/simgym/Video.tsx.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "../conversion/cut.json";

const C = createCut(cut);
export const meta = { id: "ConversionV2", durationInFrames: C.DURATION, fps: C.FPS };

const BILD = { scale: 1.3, hoch: 300, x: 0 };
const HOOK_ENDE = Math.round(5.0 * C.FPS);

const BETONT = ["conversion", "rate", "100", "zwei", "2%", "gut", "schlecht", "produkt", "zielgruppe", "traffic-quelle", "zeitverlauf", "steigt", "zeichen", "vorteil", "bestellungen", "traffic", "testfrage", "follow"];
const FARBIG = ["100", "2%", "gut", "schlecht", "zeitverlauf", "steigt", "vorteil", "bestellungen", "follow"];

/** Sekunden im Video, an denen die Karten erscheinen (wie in hyperframes/sidekick-skizzen/index.html) */
const SKIZZEN = [5.2, 9.2, 16.65, 21.7, 30.8, 36.1, 40.8, 49.9];
const AKZENTE: [string, number, number][] = [
  ["tick.mp3", 7.56, 0.3], ["tick.mp3", 11.63, 0.3], ["tick.mp3", 14.31, 0.3], ["success.mp3", 15.19, 0.3], ["tick.mp3", 19.01, 0.3],
  ["success.mp3", 20.73, 0.3], ["tick.mp3", 24.07, 0.3], ["tick.mp3", 27.35, 0.3], ["tick.mp3", 27.99, 0.3], ["tick.mp3", 29.39, 0.3],
  ["tick.mp3", 34.8, 0.3], ["tick.mp3", 37.94, 0.3], ["success.mp3", 39.7, 0.3], ["tick.mp3", 45.75, 0.3], ["tick.mp3", 47.1, 0.3],
  ["klick.mp3", 53.97, 0.3],
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
          grade={`${STIL.gradeSanft} brightness(0.8)`}
        />
      </AbsoluteFill>

      <DesignRahmen design="nacht">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="CONVERSION RATE:" line2="WAS BEDEUTET DAS?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/conversion/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
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
