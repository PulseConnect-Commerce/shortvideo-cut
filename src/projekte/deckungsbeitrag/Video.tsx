/**
 * Format FACE, Serie "E-Commerce einfach erklärt", E05 · Deckungsbeitrag (Folge 5). Aktueller Look: helle Karten
 * (karten-hell.md) als Aufbau-Karten mit Pill-Untertiteln (karten-aufbau.md, Vorlagen src/projekte/clarity und
 * src/projekte/waterdrop), nicht der alte dunkle Serien-Look von E02-E04. Veröffentlichung laut Kalender Mo 09.11.2026
 * 14:00.
 * Hook-Titel (Design "verlauf", easyJet-Stil) mit dem Cover-Text aus dem Briefing: "DECKUNGSBEITRAG –" / "WAS BLEIBT VON
 * DEINEM UMSATZ ÜBRIG?", an der Kartenposition unter dem Kopf.
 * Bild (Pauls Vorgabe 25.10.: "Oder du packst meinen Kopf höher und lässt die Motion Captions unter dem Kopf"): er steht
 * höher, Kopfoberkante im Median bei y ~315 (Take: Haar Median y 622, Augen Median x 515 / y 833 über alle
 * Schnittstücke gemessen) → scale 1.3, hoch 494, x -33: Augen bei ~589, mittig; unten endet das Bild an der Hüfte
 * (Take y ~1857). Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Von oben: Gesicht, Kinn,
 * Pill-Untertitel (y 1025), Karte (ab y 1075, Zahlenkarte bis 1483), alles über der Instagram-Zone (ab y 1500).
 * Karten als transparentes WebM aus hyperframes/deckungsbeitrag-skizzen (public/broll/deckungsbeitrag/skizzen.webm),
 * Zeiten und Töne in karten.json. Kein B-Roll aus alten Videos (Briefing über die Regie), Verweis auf E04 nur als Kicker
 * "Letzte Folge: ROAS".
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
export const meta = { id: "Deckungsbeitrag", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 515, y 833 → im Bild x 540, y 589; Haar Median 622 → 315; Bildunterkante = Take y 1857 */
const BILD = { scale: 1.3, hoch: 494, x: -33 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 589;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "übrig?" (Ausgabe 3,51 s), ganz weg bei 3,65 s; die Serien-Karte kommt bei 3,63 s */
const HOOK_ENDE = fs(3.45);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1075); unter dem tiefsten Kinn (Take ~1140 → ~996, wenn er sich vorbeugt) */
const PILLE = { x: 490, y: 1025 };

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
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px ${AUGEN_Y}px` }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={STIL.gradeSanft}
        />
      </AbsoluteFill>

      {/* Hook-Titel mit dem Cover-Text aus dem Briefing, easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~1075) */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translateY(823px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="DECKUNGSBEITRAG –" line2="WAS BLEIBT VON DEINEM UMSATZ ÜBRIG?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Karten aus HyperFrames (hyperframes/deckungsbeitrag-skizzen), helle Aufbau-Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/deckungsbeitrag/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} x={PILLE.x} y={PILLE.y} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
