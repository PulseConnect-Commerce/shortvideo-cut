/**
 * Format HERO, Serie M "Marken-Story" (M05 · Marken-Story waterdrop), freigegebener Look ab 2026-10-17, helle Karten ab
 * 2026-10-22, Grafik-Stil nach .claude/skills/faber-cut/karten-aufbau.md (wie A02 Clarity, von Paul abgenommen).
 * Veröffentlichung laut Kalender So 25.10.2026 19:00 (Slot Hero/Marken).
 * Hook-Titel im easyJet-Stil (Design "verlauf"), die Marke in Zeile 1: "WATERDROP: 140 MIO. €" / "UMSATZ 2024 MIT
 * WÜRFELN" (Briefing: 0-6 s 140 Mio. € Umsatz, klar "2024").
 * Bild: Gesicht mittig, Augen bei ~815 (Augen im Take Median x 551, y 828 → scale 1.3, hoch 262, x 14), sanfter Grade,
 * ein ruhiges Zoom-in (3 %), dazu zwei Punch-ins (1,15) auf Schnitten ohne Karte auf Brusthöhe: Schnitt 6 ("Diese Zahl
 * stammt … nicht von heute") und Schnitt 11 (Schlussaussage), jeweils zurück auf weit beim nächsten Schnitt.
 * Karten als transparentes WebM aus hyperframes/waterdrop-skizzen (public/broll/waterdrop/skizzen.webm), Zeiten und Töne
 * in karten.json; echte Screenshots der Shopify-Fallstudie (public/broll/waterdrop/fallstudie/). Untertitel als dunkle
 * Pillen (src/lib/pillen.tsx) direkt über der Karte.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { PillUntertitel } from "../../lib/pillen";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";
import karten from "./karten.json";

const C = createCut(cut);
export const meta = { id: "Waterdrop", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median über das fertige Video gemessen) bei x 551, y 828 → im Bild x 540, y 815 */
const BILD = { scale: 1.3, hoch: 262, x: 14 };

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "auflösen kannst." (Ausgabe 5,2 s), danach gehört der Platz oben der Reihe (ab 6,26 s) */
const HOOK_ENDE = fs(5.75);

/** Punch-ins (1,15) auf zwei Schnitten ohne Karte auf Brusthöhe: vom Bild-Schnitt bis zum nächsten Bild-Schnitt */
const PUNCH: [number, number][] = [
  [C.SPANS[5].at, C.SPANS[6].at],
  [C.SPANS[10].at, C.SPANS[11].at],
];
const PUNCH_ZOOM = 1.15;

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel: Mitte über der Aufbau-Karte (Karte x 80-900, oben bei y 1100) */
const PILLE = { x: 490, y: 1050 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %), dazu die zwei Punch-ins auf ihren Schnitten
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const punch = PUNCH.some(([a, b]) => fr >= a && fr < b) ? PUNCH_ZOOM : 1;
  const zoom = (1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION))) * punch;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 815px" }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={STIL.gradeSanft}
        />
      </AbsoluteFill>

      {/* Hook-Titel im easyJet-Stil, die Marke in Zeile 1 */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="WATERDROP: 140 MIO. €" line2="UMSATZ 2024 MIT WÜRFELN" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Karten aus HyperFrames (hyperframes/waterdrop-skizzen) */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/waterdrop/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} x={PILLE.x} y={PILLE.y} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
