/**
 * Format NEWS, N06 · Amazon-Preiskontrollen vor dem BGH. Veröffentlichung laut Kalender Di 27.10.2026 09:00 (News-Slot).
 * Aktueller Look: helle Karten unter dem Kopf mit Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten
 * (freigegeben 2026-10-26, Vorlage P04 src/projekte/pagebuilder): Waage Amazon / Bundeskartellamt, echte Quelle
 * (ecommerce-watchblog.de), Preise unter Amazons Grenze, Angebot fällt aus der Buy Box, "BUY BOX = SICHTBARKEIT",
 * Zeitstrahl Feb 2026 → "BGH-TERMIN: 26.01.2027", Eilverfahren statt Urteil, Preis-Spirale frisst die Marge, ein Marktplatz
 * gegen eigene Kunden und eigenen Shop, Plattform und Händlerpreis, Umfrage "Darf Amazon mitreden?" mit Folgen-Plus.
 * Hook-Titel laut Regie und Briefing (Marke Amazon, darum mit Hook; Design "verlauf", easyJet-Stil): "DARF AMAZON" /
 * "DEINEN PREIS BESTIMMEN?", an der Kartenposition unter dem Kopf, bis vor die erste Karte (3,4 s).
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter): scale 1.35, hoch 655, x 27 (Take: Kopfoberkante
 * Median y 720, Augen Median x 560 / y 886, Kinn ~1076, über alle Schnittstücke alle 0,5 s gemessen) → Kopfoberkante ~317,
 * Augen ~541, Kinn ~798, mittig; unten endet das Bild bei Take y ~1907 (kein Rand). Sanfter Grade plus brightness(0.87) (die
 * Aufnahme ist hell: Gesicht 0,651 im ersten Render, Soll ~0,55-0,57; wie bei googleads), ein ruhiges Zoom-in
 * (3 %) um die Augen, kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 925), Karte (ab y 995, bis höchstens 1385),
 * alles über der Instagram-Zone (ab y 1500).
 * Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund", und stil-news "Quelle als Hintergrund"): an den Stellen
 * über Amazons Preisprüfung, die Buy Box, das Bundeskartellamt, den BGH-Termin und das Eilverfahren steht er freigestellt vor
 * echten Seiten (sell.amazon.de, Bundesnetzagentur, ecommerce-watchblog.de, Bundesgerichtshof; HG unten, in den Take
 * gerechnet von npm run portrait --ausschnitt 1.35,655,27 --hintergrund …). amazon.de selbst zeigt Playwright eine
 * Bot-Abfrage, darum keine Produktseite mit Buy Box (Karte). Hook, Händler-Tipps, Meinung und Aufruf vor seinem
 * weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/amazonbgh-skizzen (public/broll/amazonbgh/skizzen.webm), Zeiten und Töne in
 * karten.json.
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
export const meta = { id: "AmazonBgh", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 560, y 886 → im Bild x 540, y 541; Kopf Median 720 → 317; Bildunterkante = Take y 1907 */
const BILD = { scale: 1.35, hoch: 655, x: 27 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 541;

/** Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/amazonbgh/) */
export const HG: [string, number, number][] = [
  ["hg-verkaeufer", 32.0, 35.35], // "Hintergrund ist, Amazon prüft natürlich die Preise von Marktplatzhändlern." (sell.amazon.de)
  ["hg-verkaeufer", 43.2, 46.12], // "Und wenn ein Preis einfach nach Amazons System gerade zu hoch ist," (sell.amazon.de)
  ["hg-buybox", 46.12, 51.7], // "dann kann … aus der sogenannten Buy Box verschwinden oder sogar ganz deaktiviert werden." (Bundesnetzagentur)
  ["hg-kartellamt", 77.6, 84.6], // "Und das Bundeskartellamt hat … im Februar beanstandet und … untersagt." (ecommerce-watchblog.de)
  ["hg-bgh", 92.0, 98.5], // "Und Amazon wehrt sich … BGH einen Termin für den 26. Januar 2027 angesetzt." (Bundesgerichtshof, Terminhinweis)
  ["hg-eil", 123.5, 127.4], // "Erst einmal geht es hier natürlich um ein Eilverfahren …" (ecommerce-watchblog.de)
];

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "verkaufst?" (endet ~3,0 s), ganz weg bei 3,4 s; die erste Karte kommt bei 3,40 s */
const HOOK_ENDE = fs(3.2);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 995) */
const PILLE = { x: 490, y: 925 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "news.mp3" }) => {
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
          grade={`${STIL.gradeSanft} brightness(0.87)`}
        />
      </AbsoluteFill>

      {/* Hook-Titel (Regie und Briefing), easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~995), wie Karte und Pille um
          x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 743px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="DARF AMAZON" line2="DEINEN PREIS BESTIMMEN?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/amazonbgh-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/amazonbgh/skizzen.webm")}
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
