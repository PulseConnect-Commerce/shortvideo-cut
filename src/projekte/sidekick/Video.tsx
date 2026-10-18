/**
 * Format HERO / Face-Up mit Screenshots, freigegebener Look ab 2026-10-17 (Vorlage: src/projekte/googleads/Video.tsx).
 * "Shopify Sidekick + Drittanbieter-Apps" (N04, Cutter-Briefing im Kalender, Veroeffentlichung So 18.10.2026 21:00).
 * Faktenstatus: Sidekick App Extensions seit 17.06.2026 (Shopify App Store), NICHT als heutige Neuankuendigung.
 * Infinity-Loop: Hook "Shopify Sidekick kann jetzt auch ..." als erster Satz, Schluss "Und genau deshalb solltest du jetzt
 * eben wissen:" als letztes Segment, kein Outro. Skizzen aus HyperFrames (hyperframes/sidekick-skizzen), nur Text und Icons.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Sidekick", durationInFrames: C.DURATION, fps: C.FPS };

const BILD = { scale: 1.3, hoch: 205, x: 65 };
const HOOK_ENDE = C.W("und") - 2;

const BETONT = ["shopify", "sidekick", "apps", "extensions", "klaviyo", "matrixify", "kampagnen", "daten", "abläufe", "direkt", "nicht", "jede", "wissen:", "entwickelt.", "drittanbieter-"];
const FARBIG = ["sidekick", "klaviyo", "matrixify", "nicht", "wissen:"];

/** Sekunden im Video, an denen die Karten erscheinen (wie in hyperframes/sidekick-skizzen/index.html) */
const SKIZZEN = [3.3, 13.95, 18.3, 22.3, 26.65];
const AKZENTE: [string, number, number][] = [
  ["tick.mp3", 6.93, 0.3], ["success.mp3", 12.55, 0.3], ["tick.mp3", 14.89, 0.3], ["tick.mp3", 18.76, 0.3],
  ["tick.mp3", 23.79, 0.3], ["tick.mp3", 28.32, 0.3], ["tick.mp3", 31.43, 0.3],
];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
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

      <DesignRahmen design="nacht-mint">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SHOPIFY SIDEKICK" line2="+ ANDERE APPS?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/sidekick/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={1400} />}

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
