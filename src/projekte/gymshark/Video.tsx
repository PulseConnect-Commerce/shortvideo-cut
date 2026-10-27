/**
 * Format HERO, Serie M "Marken-Story", M07 · Gymshark. Veröffentlichung laut Kalender Di 15.12.2026 19:00.
 * Editorial-Stil wie M06 FIVE (karten-aufbau.md "Marken-Story im Editorial-Stil"): über dem Kopf große, kurze Kennzahlen
 * und Schlagzeilen (Instrument Serif und Geist im Wechsel, Akzent im PulseConnect-Verlauf, ein Strich zeichnet sich auf dem
 * Wort), im Hook zwei echte freigestellte Produktfotos aus dem Gymshark-Shop neben dem Kopf (Cap, 700-ml-Flasche), darunter
 * die Pill-Untertitel und die Erklär-Bilder bzw. die Quellen-Karte (Shopify-Blog, 1. März 2026) auf der hellen Karte.
 * Hook-Titel (Marke Gymshark, darum mit Hook; Design "verlauf"): "GYMSHARK" / "MEHR ALS NUR EIN SHOP" (sein Schlusssatz
 * aus dem Skript), an der Kartenposition unter dem Kopf.
 * Bild: wie bei M06 steht er etwas tiefer, damit die Kennzahlen über dem Kopf Platz haben: scale 1.2, hoch 355, x 20
 * (Take: Kopfoberkante Median y 704 mit der Porträt-Maske, Augen Median x 557 / y 882, Kinn ~1081, an 82 Zeitpunkten über
 * alle Stücke gemessen) → Kopfoberkante ~490 (470-509), Augen ~703, mittig, Kinn ~942. Von oben: Kennzahl (y ~284-468, auf
 * hellem Schleier), Kopf, Kinn, Pill-Untertitel (y 1068), Karte (y 1118-1468), alles über der Instagram-Zone (ab 1500).
 * Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in (Kennzahlen und Shop-Hintergründe sitzen fest).
 * Marken-Hintergründe (karten-aufbau.md "Marken-Shops als Hintergrund"): an neun Stellen steht er freigestellt vor echten
 * Seiten von gymshark.com (HG unten, in den Take gerechnet von npm run portrait --ausschnitt 1.2,355,20 --hintergrund …);
 * Hook, Learning 1, Anfang Learning 2, Knopfdruck, KI und Aufruf vor seinem weichgezeichneten Zimmer.
 * Kennzahlen, Fotos und Karten als transparentes WebM aus hyperframes/gymshark-skizzen (public/broll/gymshark/skizzen.webm),
 * Zeiten und Töne in karten.json.
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
export const meta = { id: "Gymshark", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 557, y 882 → im Bild x 540, y 703; Haar ~704 → 490; Bildunterkante = Take y ~1896 */
const BILD = { scale: 1.2, hoch: 355, x: 20 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 703;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/gymshark/) */
export const HG: [string, number, number][] = [
  ["hg-story", 9.59, 13.6], // "Die Gründer haben nämlich die Fitness-Athleten und Creatorn ..." ("Die Gymshark Geschichte", 06.04.2023)
  ["hg-about", 18.2, 24.05], // "... bevor viele traditionelle Marken ... Social Media ..." (Über uns: "mehr als 12 Millionen ... Social Media Followern")
  ["hg-neu", 24.05, 29.1], // "Und statt eben einfach nur Produktfotos ..." (Kategorie "Neuheiten")
  ["hg-g66", 29.1, 31.9], // "... Fortschritte und einfach eine Community," ("Was ist #Gymshark66?")
  ["hg-g66", 33.7, 37.0], // "die sich mit demselben Lebensstil identifizieren konnte."
  ["hg-popup", 52.5, 58.4], // "Später hat dann Gymshark ... mit Events und persönlichen Treffen gestärkt." ("The Next Gymshark Pop-Up Is...", Event-Foto)
  ["hg-sulek", 63.2, 69.35], // "... dass die Creator nicht einfach nur ... Werbeflächen waren." (Kollektion "Gymshark X Sam Sulek")
  ["hg-athlet", 130.3, 136.4], // "Achte einfach mal darauf, ob sie ... zur Marke passen ..." ("Wie man zum/zur Gymshark-Athlet:in wird")
  ["hg-regent", 141.4, 148.65], // "Denn gute Kooperationen und eigene Community-Formate ..." (Gymshark London, Regent St.: Sweat Room)
  ["hg-stores", 197.0, 204.3], // "... warum ... starke Marken oft eben mehr als nur einen funktionierenden Onlineshop haben." (Stores: Regent Street "mehr als nur ein Geschäft")
];

/** Sanfter Grade (STIL.gradeSanft); Helligkeit am Gesicht nach dem ersten Render gemessen (Ziel ~0,55-0,57) */
const GRADE = STIL.gradeSanft;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach dem Hook-Satz ("sind." 6,17-6,4 s); danach die erste Shop-Seite (7,07 s) */
const HOOK_ENDE = fs(6.6);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1118) */
const PILLE = { x: 490, y: 1068 };

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

      {/* Hook-Titel (Marke Gymshark in Zeile 1, Design verlauf), an der Kartenposition unter dem Kopf (oben ~1118), wie
          Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 866px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="GYMSHARK" line2="MEHR ALS NUR EIN SHOP" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Kennzahlen, Fotos und Erklär-Bilder aus HyperFrames (hyperframes/gymshark-skizzen) */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/gymshark/skizzen.webm")}
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
