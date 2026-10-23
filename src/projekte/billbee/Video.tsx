/**
 * Format HERO, A-Reihe "Eine Shopify-App, ein Problem" (A01 · Billbee + Lexware Office), freigegebener Look ab 2026-10-17,
 * helle Karten ab 2026-10-22 (Vorlage: src/projekte/fba/Video.tsx). Veröffentlichung Sa 24.10.2026 14:00.
 * Hook-Titel (Design "verlauf") laut Briefing: "DIESE 2 APPS SOLLTE / JEDER SHOPIFY-HÄNDLER KENNEN".
 * Bild: Augen bei ~810-840 (scale 1.3, hoch 450, x 25 wie Katalog), sanfter Grade, ein ruhiges Zoom-in (3 %).
 * Karten (Reihen-Einblendung, Billbee/Lexware, Kette Shopify-Bestellung -> Billbee-Rechnung -> Lexware Office) kommen als
 * transparentes WebM aus hyperframes/billbee-skizzen und werden hier nachträglich eingesetzt (Platzhalter unten).
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Billbee", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage wie Katalog: Augen bei ~810-840 */
const BILD = { scale: 1.3, hoch: 400, x: 50 };

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "auf dem Schirm haben" (Ausgabe ~4,6 s), danach gehört der Platz oben den Karten */
const HOOK_ENDE = fs(5.2);

const BETONT = ["billbee", "lexware", "shopify", "buchhaltung", "auftragsabwicklung", "buchhaltungssystem", "oss", "steuerberater", "testbestellungen", "mausklick", "daten", "zeit"];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %), kein Punch-in
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

      {/* Hook-Titel laut Briefing */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="DIESE 2 APPS SOLLTE" line2="JEDER SHOPIFY-HÄNDLER KENNEN" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Karten aus HyperFrames (baut ein eigener Agent), Platzhalter bis broll/billbee/skizzen.webm da ist:
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/billbee/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>
      */}

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={[]} y={1400} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
