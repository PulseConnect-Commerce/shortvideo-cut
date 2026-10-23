/**
 * Format NEWS/Reaction: "Shopify öffnet Produktkatalog für KI-Agenten" (Veröffentlichung Sa 24.10.2026, 09:00).
 * Quelle: The Verge, 13.10.2026 (Screenshot in hyperframes/katalog-skizzen/assets/verge-schlagzeile.png, wird von der Karten-Agentin eingebaut).
 *
 * Bild wie DHL: scale 1.3, hoch 450, x 25 (Augen ~800-830), sanfte Farbe (gradeSanft), nur ruhiges Zoom-in (3 %), kein Zoom-Wechsel.
 * Hook: DesignRahmen "verlauf" (line1 groß weiß, line2 auf Verlaufsbalken). Untertitel unter dem Kopf (y 1400), Akzent #00E090.
 * Karten (HyperFrames, hell): Platzhalter unten, auskommentiert, bis hyperframes/katalog-skizzen -> public/broll/katalog/skizzen.webm existiert.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
// import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { clamp, HookTitle, Musik, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Katalog", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage wie DHL (hoch 450 statt 350, Augen ~820): Augen bei ~800-830 */
const BILD = { scale: 1.3, hoch: 450, x: 25 };

/** Hook bis "Denn Shopify öffnet" (~4,1 s); danach Quelle The Verge oben (Karten-Agentin) */
const HOOK_ENDE = C.W("denn") - 2;

const BETONT = ["shopify", "krass", "produktkatalog", "ki-agenten", "einkauf", "shoppay", "10", "rucksack", "100", "euro", "produktdaten", "empfehlen", "richtung", "fazit", "meinung", "folge"];
const FARBIG = ["10", "100", "euro"];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, raster = false, untertitel = true, musik = "news.mp3" }) => {
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

      {/* Hook: Marke vorne (Erfolgsformel NEWS) */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SHOPIFY ÖFFNET" line2="KATALOG FÜR KI-AGENTEN" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Karten aus HyperFrames (Quelle The Verge, Skizzen, "PRODUKTDATEN WERDEN WICHTIGER"): erst einschalten, wenn die Datei da ist
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/katalog/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence> */}

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={1400} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
