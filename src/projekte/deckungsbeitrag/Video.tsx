/**
 * Format FACE, Serie "E-Commerce einfach erklärt", E05 · Deckungsbeitrag. Aktueller Look: helle Karten
 * (karten-hell.md) als Aufbau-Karten mit Pill-Untertiteln (karten-aufbau.md, Vorlagen src/projekte/clarity und
 * src/projekte/waterdrop), nicht der alte dunkle Serien-Look von E02-E04. Veröffentlichung laut Kalender Mo 09.11.2026
 * 14:00.
 * Hook-Titel (Design "verlauf", easyJet-Stil) mit dem Cover-Text aus dem Briefing: "DECKUNGSBEITRAG –" / "WAS BLEIBT VON
 * DEINEM UMSATZ ÜBRIG?", an der Kartenposition unter dem Kopf.
 * Bild (Pauls Vorgaben 25.10.: "Oder du packst meinen Kopf höher und lässt die Motion Captions unter dem Kopf", und
 * 27.10.: "erst ab Hüfthöhe bei einer sitzenden Aufnahme erst zu zeigen. Alles unterhalb der Hüfthöhe sollte
 * abgeschnitten werden"): Kopfoberkante im Median bei y ~310 (Take: Haar Median y 622, Augen Median x 516 / y 834,
 * Kinn Median ~1050, über alle Schnittstücke alle 0,25 s gemessen) → scale 1.63, hoch 704, x -39 (bis 28.10.: 1.3 /
 * 494 / -33, da sah man unten Schoß und Jeans): Augen bei ~655, mittig; der untere Bildrand zeigt Take-y ~1610 (mit
 * dem Zoom-in ~1590), die Hüftlinie (Jeans neben dem Hemd) liegt im Take frühestens bei ~1640, also unsichtbar.
 * Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Von oben: Gesicht, Kinn (Median ~1015),
 * Pill-Untertitel (y 1150), Karte (ab y 1200, Zahlenkarte 0,72-fach bis 1494), alles über der Instagram-Zone (ab 1500).
 * Karten als transparentes WebM aus hyperframes/deckungsbeitrag-skizzen (public/broll/deckungsbeitrag/skizzen.webm),
 * Zeiten und Töne in karten.json. Kein B-Roll aus alten Videos (Briefing über die Regie), Verweis auf E04 nur als Kicker
 * "Im letzten Video: ROAS" (seine Worte). Keine Folgennummern im Bild; zum Schluss nur das Folgen-Symbol
 * (Pauls Korrektur 2026-10-25).
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

/** Augen im Take (Median) bei x 516, y 834 → im Bild x 540, y 655; Haar Median 622 → 310; Bildunterkante = Take y ~1610 (Hüfte ab ~1640) */
const BILD = { scale: 1.63, hoch: 704, x: -39 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 655;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "übrig?" (Ausgabe 3,51 s), ganz weg bei 3,65 s; die Serien-Karte kommt bei 3,63 s */
const HOOK_ENDE = fs(3.45);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn (Median ~1015), über der Karte (Karte x 80-900, oben bei y 1200); die Pille reicht von
 * ~1115 bis ~1185. Beugt er sich weit vor (Kinn im Take über ~1110, etwa jedes sechste Bild), reicht das Kinn an die
 * Pille, der Mund (höchstens ~1046) bleibt frei */
const PILLE = { x: 490, y: 1150 };

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

      {/* Hook-Titel mit dem Cover-Text aus dem Briefing, easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~1200) */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translateY(948px) scale(0.9)", transformOrigin: "50% 0%" }}>
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
