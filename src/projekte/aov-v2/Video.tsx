/**
 * E02 "Average Order Value" (Serie "E-Commerce einfach erklärt"), Neuschnitt im freigegebenen Look ab 2026-10-17.
 * Format FACE, Design nacht (Leuchtfarbe #CCFF00; Paul: "E02 bleibt so", Look unverändert). Schnitt aus ../aov/cut.json.
 * Skizzen aus HyperFrames (hyperframes/aov-skizzen). Vorlage: src/projekte/conversion-v2/Video.tsx.
 * Korrektur Runde 2 (2026-10-25): Fehlstart "Heute…" nach "Paul." und "hier aber" nach "Dein Vorteil ist" raus
 * (Zeiten der Karten und Töne auf den neuen Schnitt umgerechnet). Bildlage nach Pauls Vorgabe 2026-10-25 ("Oder du
 * packst meinen Kopf höher und lässt die Motion Captions unter dem Kopf", karten-aufbau.md): er steht höher, nur
 * verschoben, nicht weiter gezoomt (scale 1.3 wie vorher): Augen im Take Median x 591, y 833 → im Bild x 540, y 593,
 * Kopfoberkante bei y ~316 (Take ~620), Kinn ~875. Darunter von oben: Untertitel (Mitte y 995), Karte bzw. Hook-Titel
 * (ab y 1100, bis ~1433), alles über der Instagram-Zone (ab y 1500) und links der TikTok-Leiste (x 900).
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "../aov/cut.json";

const C = createCut(cut);
export const meta = { id: "AovV2", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take bei x 591, y 833 → im Bild x 540, y 593 (vorher hoch 255, x 0: Augen bei ~830, rechts versetzt) */
const BILD = { scale: 1.3, hoch: 490, x: 66 };
/** Augenhöhe im Bild: Ursprung des ruhigen Zoom-ins, damit die Augen auf derselben Höhe bleiben */
const AUGEN_Y = 593;
/** Hook-Titel bis kurz nach "mit Paul." (endet 3,99 s), ganz weg vor der ersten Karte (4,1 s, "Heute") */
const HOOK_ENDE = Math.round(3.85 * C.FPS);
/** Untertitel unter dem Kinn (Mitte der Zeile), Karte und Hook-Titel darunter ab y 1100; beides 40 px nach links,
 * damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */
const UNTERTITEL_Y = 995;
const LINKS = -40;

const BETONT = ["aov", "average", "order", "value", "bestellwert", "umsatz", "10.000", "100", "euro", "bundles", "zusatzprodukte", "erhöhen", "marge", "leidet", "vorteil", "steigerst", "besucher", "wissens-aov", "folg", "kennzahlen"];
const FARBIG = ["aov", "10.000", "100", "euro", "marge", "vorteil", "wissens-aov", "kennzahlen"];

/** Sekunden im Video, an denen die Karten erscheinen (wie in hyperframes/aov-skizzen/index.html) */
const SKIZZEN = [4.1, 8.17, 13.17, 17.63, 20.69, 29.25, 33.8, 36.8, 45.84, 47.98];
const AKZENTE: [string, number, number][] = [
  ["tick.mp3", 8.37, 0.3], ["success.mp3", 11.98, 0.18], ["tick.mp3", 14.48, 0.3], ["tick.mp3", 16.3, 0.3], ["success.mp3", 17.25, 0.18],
  ["tick.mp3", 22.3, 0.3], ["tick.mp3", 23.51, 0.3], ["success.mp3", 28.01, 0.18], ["tick.mp3", 29.8, 0.3], ["tick.mp3", 32.12, 0.3],
  ["tick.mp3", 35.26, 0.3], ["tick.mp3", 38.18, 0.3], ["tick.mp3", 41.36, 0.3], ["tick.mp3", 44.18, 0.3], ["tick.mp3", 50.63, 0.3],
  ["klick.mp3", 51.8, 0.3],
];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="nacht">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "puls.mp3" }) => {
  const fr = useCurrentFrame();
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

      {/* Hook-Titel an der Kartenposition unter dem Kopf (Zeilen ab y ~1100) */}
      <DesignRahmen design="nacht">
        <AbsoluteFill style={{ transform: `translate(${LINKS}px, ${1100 - STIL.safe.top * 0.9}px) scale(0.9)`, transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="AOV?" line2="SCHON MAL GEHÖRT?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/aov/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {untertitel && (
        <AbsoluteFill style={{ transform: `translateX(${LINKS}px)` }}>
          <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} farbe="#CCFF00" y={UNTERTITEL_Y} />
        </AbsoluteFill>
      )}

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
