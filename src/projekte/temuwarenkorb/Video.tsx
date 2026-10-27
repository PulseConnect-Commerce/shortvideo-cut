/**
 * Format NEWS, N07 · Temu-Warenkorb in DE 59 % teurer als CH (1 Test). Veröffentlichung laut Briefing noch ohne Datum (News, bald;
 * die Regie plant ein). Look wie N09 (src/projekte/ebaykombi): helle Karten unter dem Kopf mit Pill-Untertiteln
 * (karten-aufbau.md, aktives Wort #00E090), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlage P04): echte Quellen
 * neuhandeln.de (26.10.2026) und Carpathia-Blog (25.10.2026), zwei Warenkörbe DE 126,94 € / CH ~80 €, "EINFUHRABGABEN ERKLÄREN
 * NUR EINEN TEIL" (21,42 €, davon trägt Temu 6,42 €, ohne sie 111,94 €), Puzzle "Woran liegt's?" mit Aktionspreisen als Vermutung,
 * "EIN TEST – KEINE GESAMTSTUDIE", Tipp: eigene Wettbewerbsprodukte und Endpreise prüfen, Umfrage "Temu immer am günstigsten?"
 * mit Folgen-Plus (keine Folgennummer).
 * Hook-Titel laut Regie und Briefing (Marke Temu, News, starke Zahl; Design "verlauf", easyJet-Stil): "TEMU: 59 % TEURER" /
 * "IN DEUTSCHLAND?", klein darunter "ein getesteter Warenkorb", an der Kartenposition unter dem Kopf, bis zum Ende des ersten Satzes.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): scale 1.6,
 * hoch 790, x 61 (Take: Kopfoberkante Median y 686 (660-708) mit der Porträt-Maske, Augen Median x 578 / y 910, Kinn ~1111,
 * Hüftlinie (oberste Jeans-Zeile) frühestens y 1717, Median 1766, an 119 Zeitpunkten alle 0,5 s über alle Schnittstücke gemessen)
 * → Kopfoberkante ~308, Augen ~666, Kinn ~988, mittig; der untere Bildrand zeigt Take-y 1694 (mit dem Zoom-in bis ~1673), also
 * liegt die Hüftlinie mindestens 23 px unter dem Bildrand. Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in.
 * Von oben: Gesicht, Kinn, Pill-Untertitel (y 1068), Karte (y 1118-1468), alles über der Instagram-Zone (ab y 1500).
 * Hintergründe (karten-aufbau.md "Marken-Shops als Hintergrund", stil-news "Quelle als Hintergrund"; Regie: die zwei Quellen als
 * Quellen-Karte und als Hintergrund): an sieben Stellen steht er freigestellt vor den echten Artikeln (drei neuhandeln.de, vier
 * Carpathia-Blog; HG unten, in den Take gerechnet von npm run portrait --ausschnitt 1.6,790,61 --hintergrund …). Hook, "Ein Test"
 * und Tipp vor seinem weichgezeichneten Zimmer. Karten als transparentes WebM aus hyperframes/temuwarenkorb-skizzen
 * (public/broll/temuwarenkorb/skizzen.webm), Zeiten und Töne in karten.json.
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
export const meta = { id: "TemuWarenkorb", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 578, y 910 → im Bild x 540, y 666; Kopf Median 686 → 308; Bildunterkante = Take y 1694
 * (Hüftlinie im Take frühestens 1717: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.6, hoch: 790, x: 61 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 666;

/** Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/temuwarenkorb/) */
export const HG: [string, number, number][] = [
  ["hg-nh-kopf", 20.6, 24.9], // "Zumindest bei einem getesteten Warenkorb wurde das hier gefunden. Schaut euch das mal an." (neuhandeln.de, Überschrift)
  ["hg-cp-kopf", 31.0, 36.4], // "Eine Schweizer E-Commerce-Beratung hat tatsächlich dieselben Produkte …" (Carpathia-Blog, Überschrift)
  ["hg-cp-tabelle", 36.4, 43.85], // "Und in Deutschland lag dabei tatsächlich der Preis bei knapp 127 Euro, …" (Carpathia: Tabelle EUR 126.94 / EUR 80.0)
  ["hg-cp-abgaben", 43.85, 46.3], // "Ein Teil davon sind natürlich Einfuhrabgaben." (Carpathia: "EUR 21.42 an Einfuhrabgaben …")
  ["hg-nh-abgaben", 46.3, 51.1], // "Aber selbst wenn man jetzt trotzdem diese herausrechnet, …" (neuhandeln.de: "… mit 111,94 Euro noch deutlich …")
  ["hg-nh-ursache", 61.35, 65.25], // "Aber woran das jetzt tatsächlich genau liegt, …" (neuhandeln.de: "Belege für diese Vermutungen liefert der Vergleich allerdings nicht.")
  ["hg-cp-aktion", 72.7, 76.2], // "Es können noch einfach unterschiedliche Aktionspreise eine Rolle spielen." (Carpathia: "Denkbar sind Schweiz-spezifische Aktionspreise")
];

/** Sanfter Grade (STIL.gradeSanft); Regie: "Liegt das Gesicht über 0,57, gleich das im Grade aus" */
const GRADE = `${STIL.gradeSanft}`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis zum Ende des ersten Satzes ("Schweiz." 3,90-4,2 s), ganz weg bei 4,15 s; die erste Karte kommt bei 4,36 s */
const HOOK_ENDE = fs(3.95);

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

/** klein unter dem Hook-Titel (Briefing: klein "ein getesteter Warenkorb"), blendet mit dem Hook aus */
const HookZusatz: React.FC<{ fr: number }> = ({ fr }) => {
  const o = interpolate(fr, [HOOK_ENDE, HOOK_ENDE + 6], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (o >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 980,
        top: 1340,
        textAlign: "center",
        opacity: 1 - o,
        transform: `translateY(${-40 * o}px)`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: STIL.font,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: "0.01em",
          color: "#fff",
          padding: "6px 22px 9px",
          borderRadius: 14,
          background: "rgb(10 12 14 / 0.78)",
        }}
      >
        ein getesteter Warenkorb
      </span>
    </div>
  );
};

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
          grade={GRADE}
        />
      </AbsoluteFill>

      {/* Hook-Titel (Regie und Briefing: "TEMU: 59 % TEURER IN DEUTSCHLAND?", Marke in Zeile 1, Design verlauf), an der
          Kartenposition unter dem Kopf (oben ~1118), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste
          rechts (ab x 900) ragt; klein darunter "ein getesteter Warenkorb" */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 866px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="TEMU: 59 % TEURER" line2="IN DEUTSCHLAND?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>
      <HookZusatz fr={fr} />

      {/* Erklär-Bilder und Quellen-Karten aus HyperFrames (hyperframes/temuwarenkorb-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/temuwarenkorb/skizzen.webm")}
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
