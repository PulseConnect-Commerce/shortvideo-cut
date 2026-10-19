/**
 * Format HERO / Face-Up, freigegebener Look ab 2026-10-17 (Vorlage: src/projekte/sidekick/Video.tsx).
 * "Shopify SimGym - KI-Kaeufer testen deinen Shop" (N05, Cutter-Briefing im Kalender, Veroeffentlichung Mo 19.10.2026 10:00).
 * Infinity-Loop: Hook "Shopify hat eine neue KI-App ..." als erster Satz, Schluss "Und genau deshalb ist es nämlich
 * interessant, denn" als letztes Segment, kein Outro. Skizzen aus HyperFrames (hyperframes/simgym-skizzen), nur Text und
 * Icons in HERO-Mint #40E8E0. Keine echte Test-Demo behauptet.
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
export const meta = { id: "SimGym", durationInFrames: C.DURATION, fps: C.FPS };

const BILD = { scale: 1.3, hoch: 300, x: 0 };
const HOOK_ENDE = Math.round(4.1 * C.FPS);

const BETONT = ["shopify", "simgym", "ki-app,", "ki-käufern", "simulierten", "vorher", "änderungen", "theme", "shopify-theme", "navigieren", "warenkorb", "hinweise", "probleme", "achtung,", "simulationen", "keine", "testphase", "geld", "kosten.", "praxistest", "interessant,", "online-shop"];
const FARBIG = ["simgym", "ki-käufern", "vorher", "warenkorb", "probleme", "achtung,", "keine", "testphase", "geld", "praxistest"];

/** Sekunden im Video, an denen die Karten erscheinen (wie in hyperframes/sidekick-skizzen/index.html) */
const SKIZZEN = [4.2, 8.15, 17.15, 25.0, 29.05, 41.9];
const AKZENTE: [string, number, number][] = [
  ["klick.mp3", 5.7, 0.3], ["tick.mp3", 5.0, 0.3], ["tick.mp3", 11.73, 0.3], ["tick.mp3", 15.41, 0.3], ["tick.mp3", 21.59, 0.3],
  ["tick.mp3", 23.62, 0.3], ["success.mp3", 24.05, 0.3], ["tick.mp3", 27.73, 0.3], ["tick.mp3", 32.43, 0.3],
  ["tick.mp3", 36.57, 0.3], ["tick.mp3", 40.45, 0.3],
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
          <HookTitle fr={fr} line1="KI TESTET DEINEN" line2="SHOPIFY-SHOP?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/simgym/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} farbe="#40E8E0" y={1400} />}

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
