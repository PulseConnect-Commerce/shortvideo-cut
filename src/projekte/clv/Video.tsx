/**
 * Format FACE, Serie "E-Commerce einfach erklärt", E06 · Customer Lifetime Value. Veröffentlichung laut Kalender
 * Mo 23.11.2026 14:00. Look wie E05 (src/projekte/deckungsbeitrag): helle Karten unter dem Kopf mit Pill-Untertiteln
 * (karten-aufbau.md), hier als Erklär-Bilder (karten-aufbau.md "Visuelle Metaphern", Vorlage src/projekte/pagebuilder):
 * C-L-V entfaltet sich, Zeitstrahl des Beispiels (50 € heute, zwei Jahre, bis zu fünf weitere Bestellungen ohne Betrag),
 * der Blick weitet sich von der ersten Bestellung auf alle, Münzen über der Kundenbeziehung, Umsatz / Ergebnisbeitrag,
 * Nachkauf-Kreislauf, zum Schluss nur das Folgen-Symbol.
 * Hook-Titel (Design "verlauf", easyJet-Stil) mit dem Cover-Text aus dem Briefing: "CLV –" / "WAS IST EIN KUNDE
 * LANGFRISTIG WERT?" (er spricht ihn als ersten Satz), an der Kartenposition unter dem Kopf, bis vor die erste Karte.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: "erst ab Hüfthöhe"): sitzende Aufnahme,
 * gemessen im Take an 214 Zeitpunkten alle 0,25 s über alle Schnittstücke: Kopfoberkante (Mütze) Median y 736 (min 692),
 * Augen Median x 572 / y 944, Kinn Median 1138 (p95 1197), Hüftlinie (oberste Jeans-Zeile neben dem Pullover) frühestens
 * y 1848 → scale 1.5, hoch 792, x 48: Kopfoberkante ~312, Augen ~624 mittig, Kinn ~915; der untere Bildrand zeigt Take-y
 * 1808 (mit dem Zoom-in höchstens ~1782), die Hüftlinie liegt damit mindestens ~60 px unter dem Rand (Bild 0: 1848 → 1980).
 * Sanfter Grade plus brightness(0.83) (helle Aufnahme), ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1062),
 * Karte (y 1120-1480), alles über der Instagram-Zone (ab 1500).
 * Karten als transparentes WebM aus hyperframes/clv-skizzen (public/broll/clv/skizzen.webm), Zeiten und Töne in karten.json.
 * Kein B-Roll aus alten Videos, keine Folgennummer, keine Quelle (nur sein Beispiel).
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
export const meta = { id: "Clv", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 572, y 944 → im Bild x 540, y 624; Mütze Median 736 → 312; Bildunterkante = Take y 1808 (Hüfte ab 1848) */
const BILD = { scale: 1.5, hoch: 792, x: 48 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 624;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "wert?" (endet 3,83 s), ganz weg bei ~4,1 s; die erste Karte kommt bei 4,12 s */
const HOOK_ENDE = fs(3.9);

/** Sanfter Grade (STIL.gradeSanft) plus brightness(0.83): die Aufnahme ist hell (Gesicht nach npm run farbe, das höchstens
 * ±4 % korrigiert, im Bild noch ~0,675, gemessen wie npm run pruefen an 11 Standbildern), Soll ~0,55-0,57 (Regel 5b, seine
 * Vorgabe 2026-10-18 "zu hell"); wie bei MyStoreBuddy (0,68 → brightness 0,83) */
const GRADE = `brightness(0.83) ${STIL.gradeSanft}`;

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn (Median ~915, p95 ~1004), über der Karte (Karte x 80-900, oben bei y 1120) */
const PILLE = { x: 490, y: 1062 };

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
          grade={GRADE}
        />
      </AbsoluteFill>

      {/* Hook-Titel mit dem Cover-Text aus dem Briefing, easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~1120), wie
          Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 868px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="CLV –" line2="WAS IST EIN KUNDE LANGFRISTIG WERT?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/clv-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/clv/skizzen.webm")}
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
