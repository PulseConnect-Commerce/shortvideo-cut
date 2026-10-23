/**
 * Format NEWS/Reaction, freigegebener Look ab 2026-10-17, helle Karten ab 2026-10-22 (Vorlage: src/projekte/dhl/Video.tsx).
 * "AMAZON erhöht FBA-Zuschlag auf 2 %" (Cutter-Briefing, Veröffentlichung Fr 23.10.2026 16:00).
 * Quelle: OnlinehändlerNews / Händlerbund, Tina Plewinski, 19.10.2026 (Artikel "Amazon erhöht Logistik-Zuschlag – das
 * erwartet Händler"); Amazon Seller-Central-Mitteilung. Zahlen geprüft: FBA ab 02.11.2026 (DE, BE, FR, IE, IT, NL, PL,
 * SE, ES, UK), MCF ab 19.11.2026 (DE, FR, IT, ES, UK), 2 % auf die Versandgebühr, im Schnitt rund 2 Cent pro Einheit.
 *
 * Bild: Augen bei ~800-830 (scale 1.3, hoch 350, wie DHL). Farbe: STIL.gradeSanft plus brightness(0.82), weil das
 * Gesicht im Rohclip bei ~0,69 lag (Ziel 0,55-0,57, Briefing). Zoom: ein Punch-in (1,15) auf "Pointe" bei 47,4 s,
 * nie über einer Karte. Karten und Skizzen liegen im Overlay (hyperframes/fba-skizzen, Zeiten aus cut.json).
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
export const meta = { id: "Fba", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage wie DHL: Augen bei ~800-830 (höher als in den alten Skill-Zahlen) */
const BILD = { scale: 1.3, hoch: 350, x: 65 };
/** Farbe: sanfter Grade plus etwas weniger Helligkeit (Gesicht Rohclip ~0,69 -> Ziel 0,55-0,57) */
const GRADE = `brightness(0.82) ${STIL.gradeSanft}`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook bis kurz vor der ersten Karte (Quelle bei 6,95 s) */
const HOOK_ENDE = fs(6.9);
/** Punch-in 1,15 auf die Pointe "auch Amazon hinterher" (Karte Frage endet vorher bei 47,2 s) */
const PUNCH = { ein: fs(47.38), voll: fs(48.4), aus: fs(50.2), ende: fs(50.8) };

/** Skizzen-Overlay (hyperframes/fba-skizzen): Zeiten der Karten, Akzente auf dem Wort */
const KARTEN = [6.95, 10.6, 14.3, 17.45, 20.7, 24.6, 31.3, 39.2, 44.7];

const BETONT = ["amazon", "fba", "mcf", "2%", "versandgebühr", "verkaufspreis", "cent", "november", "relevant", "tipp", "follow", "preise", "teurer", "deutschland"];
const FARBIG = ["2%", "1", "5", "cent", "02.11", "19", "november", "2"];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "news.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %) plus ein Punch-in auf der Pointe (1,15), nur auf dem Bild
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ruhig = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  const punch = interpolate(fr, [PUNCH.ein, PUNCH.voll, PUNCH.aus, PUNCH.ende], [1, 1.15, 1.15, 1], clamp);
  const zoom = ruhig * punch;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 740px" }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={GRADE}
        />
      </AbsoluteFill>

      {/* Hook im Titel-Stil; die Marke vorne (Erfolgsformel NEWS, Vorgabe 2026-10-23) */}
      <DesignRahmen design="nacht-gruen">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="AMAZON ERHÖHT" line2="FBA-KOSTEN!" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Karten aus HyperFrames (transparentes WebM): Quelle, Zahlen, Daten, Shop, 2 %, Ø 2 Cent, Tipp, Frage */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/fba/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={1400} farbe="#00E090" />}

      {sfx && (
        <>
          <Sfx file="klick.mp3" at={fs(KARTEN[0])} volume={STIL.sfx * 0.35} />
          <Sfx file="pop.mp3" at={fs(KARTEN[1] + 0.1)} volume={STIL.sfx * 0.4} />
          <Sfx file="whoosh.mp3" at={fs(KARTEN[2])} volume={STIL.sfx * 0.4} />
          <Sfx file="whoosh.mp3" at={fs(KARTEN[4])} volume={STIL.sfx * 0.35} />
          <Sfx file="success.mp3" at={fs(KARTEN[5] + 0.1)} volume={STIL.sfx * 0.4} />
          <Sfx file="pop.mp3" at={fs(KARTEN[6] + 0.1)} volume={STIL.sfx * 0.35} />
          <Sfx file="tick.mp3" at={fs(KARTEN[7])} volume={STIL.sfx * 0.35} />
          <Sfx file="whoosh.mp3" at={fs(PUNCH.ein)} volume={STIL.sfx * 0.3} />
        </>
      )}
      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
