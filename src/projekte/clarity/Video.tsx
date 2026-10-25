/**
 * Format FACE, A-Reihe "Eine Shopify-App, ein Problem" (A02 · Microsoft Clarity), freigegebener Look ab 2026-10-17,
 * helle Karten ab 2026-10-22, Aufbau und Bausteine wie A01 (src/projekte/billbee). Veröffentlichung laut Kalender
 * 31.10.2026 14:00.
 * Hook-Titel (Design "verlauf", easyJet-Stil) laut Briefing: "DIESE KOSTENLOSE APP ZEIGT, / WO KUNDEN ABSPRINGEN".
 * Bild (Pauls Vorgaben 2026-10-25: "Oder du packst meinen Kopf höher und lässt die Motion Captions unter dem Kopf" und
 * "etwas weiter reinzoomen, sodass man mich erst ab Hüfthöhe sieht"): scale 1.62, unten endet das Bild an der Hüfte
 * (Take y ~1760), Kopfoberkante bei y ~300-340 (Take 760-784), Augen bei ~609, mittig (Augen im Take x 604); sanfter
 * Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Unter dem Kopf: Kinn ~867, Pill-Untertitel ~950,
 * Hook-Titel und Karten ab y 1000 (über der Instagram-Zone ab 1500).
 * PROBE nach .claude/skills/faber-cut/karten-aufbau.md (Pauls Referenz 2026-10-24): helle Aufbau-Karten auf
 * Brusthöhe (x 80-900, ab y 1000), Kacheln auf ihrem Wort, Zustände (✓, ✕, Durchstreichen, ≠), Schlusszeilen, zwei
 * Sticker-Wörter, Umfrage-Karte als CTA; Untertitel als dunkle Pillen (src/lib/pillen.tsx) direkt über der Karte.
 * Karten kommen als transparentes WebM aus hyperframes/clarity-skizzen (public/broll/clarity/skizzen.webm), Zeiten
 * und Töne in karten.json. Keine Clarity-Oberflächen (kein echtes Material), nur Icons und Text.
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
export const meta = { id: "Clarity", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take bei x 604, y 951 → im Bild x 540, y 609; Bildunterkante = Take y 1760 (Hüfte) */
const BILD = { scale: 1.62, hoch: 931, x: 104 };

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "hängen bleiben" (Ausgabe 6,07 s), danach gehört der Platz oben den Karten (Reihe ab 6,5 s) */
const HOOK_ENDE = fs(6.3);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json): whoosh pro Kartenwechsel, tick pro Kachel */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel: unter dem Kinn (~867), über der Karte (x 80-900, oben bei y 1000) */
const PILLE = { x: 490, y: 950 };

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
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 609px" }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={STIL.gradeSanft}
        />
      </AbsoluteFill>

      {/* Hook-Titel laut Briefing, easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~1000) */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translateY(748px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="DIESE KOSTENLOSE APP ZEIGT," line2="WO KUNDEN ABSPRINGEN" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Karten aus HyperFrames (hyperframes/clarity-skizzen), helle Karten über dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/clarity/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} x={PILLE.x} y={PILLE.y} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
