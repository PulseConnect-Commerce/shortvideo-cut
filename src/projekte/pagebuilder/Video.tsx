/**
 * Format HERO (kurz), P-Reihe, P04 · Brauchst du einen Page Builder? Veröffentlichung laut Kalender So 01.11.2026 19:00.
 * Aktueller Look: helle Karten unter dem Kopf mit Pill-Untertiteln (karten-aufbau.md), hier als PROBE "Visuelle
 * Metaphern statt Wortkarten" (Pauls Vorgabe 2026-10-25): jede Karte zeigt den Gedanken als Bild (Weggabelung, App-Stapel,
 * Seite aus Blöcken, KI erzeugt Blöcke, Prompt → Block, Regler einfach/komplex, Code mit Fehlerzeile, Theme-Kopie aufs
 * Handy, Abo gestrichen), höchstens 1-3 Wörter, ein handschriftliches Akzentwort.
 * Hook-Titel (Design "verlauf", easyJet-Stil; Marke Shopify, darum mit Hook): "BRAUCHST DU FÜR SHOPIFY" / "EINEN PAGE
 * BUILDER?" (Titel des Kalendertermins), an der Kartenposition unter dem Kopf, bis vor die erste Karte (2,7 s).
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter): scale 1.3, hoch 522, x 12 (Take: Haar Median
 * y 642, Augen Median x 549 / y 851, über alle Schnittstücke alle 0,25 s gemessen) → Kopfoberkante ~313, Augen ~585,
 * mittig; unten endet das Bild an der Hüfte (Take y ~1878). Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein
 * Punch-in. Von oben: Gesicht, Kinn (Median ~873), Pill-Untertitel (y 1030), Karte (ab y 1085, bis höchstens 1465),
 * alles über der Instagram-Zone (ab y 1500).
 * Marken-Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund"): an den Stellen über Theme-Editor,
 * Sidekick/Magic, KI-Code und Theme-Kopie steht er freigestellt vor echten Shopify-Seiten (HG unten, in den Take
 * gerechnet von npm run portrait --ausschnitt 1.3,522,12 --hintergrund …); Hook, "einfache Anpassungen", Page Builder,
 * Abo und CTA vor seinem weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/pagebuilder-skizzen (public/broll/pagebuilder/skizzen.webm), Zeiten und
 * Töne in karten.json.
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
export const meta = { id: "PageBuilder", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 549, y 851 → im Bild x 540, y 585; Haar Median 642 → 313; Bildunterkante = Take y 1878 */
const BILD = { scale: 1.3, hoch: 522, x: 12 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 585;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/pagebuilder/) */
export const HG: [string, number, number][] = [
  ["hg-abschnitte", 16.0, 22.65], // "Dabei bietet Shopify … Theme-Editor … Seitenvorlagen." (Hilfe-Center: Abschnitte und Blöcke)
  ["hg-sidekick", 22.65, 25.6], // "Und inzwischen … mit Shopify Sidekick bzw." (shopify.com/de/sidekick)
  ["hg-magic", 25.6, 29.6], // "Shopify Magic sogar eigene Theme-Blöcke per KI generieren lassen." (Hilfe-Center: Theme-Blöcke generieren)
  ["hg-blockgen", 31.6, 36.45], // "Du beschreibst … passenden Block." (Editions Sommer '25: BLÖCKE GENERIEREN)
  ["hg-hinweise", 46.4, 49.85], // "Denn KI-generierter Code ist … nicht automatisch fehlerfrei." (Hilfe-Center: Wichtige Hinweise)
  ["hg-perfekt", 49.85, 56.0], // "Denn es kann … Barrierefreiheit verursachen." (Hilfe-Center: "nicht immer perfekt")
  ["hg-duplizieren", 75.8, 83.0], // "Deshalb … Theme-Kopie … Smartphone." (Hilfe-Center: Themes duplizieren)
];

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "installierst," (Ausgabe ~2,6 s), ganz weg bei 2,67 s; die erste Karte kommt bei 2,70 s */
const HOOK_ENDE = fs(2.47);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1085) */
const PILLE = { x: 490, y: 1030 };

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

      {/* Hook-Titel (Titel des Kalendertermins), easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~1085), wie Karte und
          Pille um x 490 zentriert, damit die erste Zeile nicht in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 833px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="BRAUCHST DU FÜR SHOPIFY" line2="EINEN PAGE BUILDER?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Metaphern-Karten aus HyperFrames (hyperframes/pagebuilder-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/pagebuilder/skizzen.webm")}
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
