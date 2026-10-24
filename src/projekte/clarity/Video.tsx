/**
 * Format FACE, A-Reihe "Eine Shopify-App, ein Problem" (A02 · Microsoft Clarity), freigegebener Look ab 2026-10-17,
 * helle Karten ab 2026-10-22, Aufbau und Bausteine wie A01 (src/projekte/billbee). Veröffentlichung laut Kalender
 * 31.10.2026 14:00.
 * Hook-Titel (Design "verlauf", easyJet-Stil) laut Briefing: "DIESE KOSTENLOSE APP ZEIGT, / WO KUNDEN ABSPRINGEN".
 * Bild: Gesicht mittig, Augen bei ~815 (Augen im Take x 604, y 951 → scale 1.3, hoch 421, x 83), sanfter Grade,
 * ein ruhiges Zoom-in (3 %), kein Punch-in (oben stehen durchgehend Karten).
 * Karten kommen als transparentes WebM aus hyperframes/clarity-skizzen (public/broll/clarity/skizzen.webm),
 * 14 Karten, Zeiten und Töne in karten.json. Keine Clarity-Oberflächen (kein echtes Material), nur Icons und Text.
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
import karten from "./karten.json";

const C = createCut(cut);
export const meta = { id: "Clarity", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take bei x 604, y 951 → im Bild x 540, y 815 */
const BILD = { scale: 1.3, hoch: 421, x: 83 };

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "hängen bleiben" (Ausgabe 6,07 s), danach gehört der Platz oben den Karten (Reihe ab 6,5 s) */
const HOOK_ENDE = fs(6.3);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json): whoosh pro Karte, tick auf Teilen und Häkchen */
const TOENE = karten.karten.flatMap((k) => k.sfx);

const BETONT = ["clarity", "heatmaps", "heatmap", "sitzungsaufzeichnungen", "shopify", "frustriert", "produktseiten", "landingpages", "kennzahlen", "datenschutz", "einwilligung", "konfiguration", "handy", "problem", "optimierung", "nutzerverhalten"];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %), kein Punch-in
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
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

      {/* Hook-Titel laut Briefing, easyJet-Stil */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="DIESE KOSTENLOSE APP ZEIGT," line2="WO KUNDEN ABSPRINGEN" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Karten aus HyperFrames (hyperframes/clarity-skizzen), helle Karten über dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/clarity/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={[]} y={1400} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
