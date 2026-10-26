/**
 * Format FACE, A-Reihe "Eine Shopify-App, ein Problem", A03 · Judge.me. Veröffentlichung laut Kalender Sa 07.11.2026 14:00.
 * Aktueller Look: helle Karten unter dem Kopf mit Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten
 * (freigegeben 2026-10-26, Vorlage P04 src/projekte/pagebuilder): jede Karte zeigt den Gedanken als Bild (Kunden hinter einer
 * Wand, das fehlende Puzzleteil, Kauf → Anfrage → Sterne, Bewertung fliegt in den Shop, Besucher mit Fragezeichen, Brücke aus
 * Bewertungen, Lupe, Waage Badges gegen Bewertungen), höchstens 1-3 Wörter, ein handschriftliches Akzentwort.
 * Hook-Titel laut Briefing (Marke Shopify/Judge.me im Video, darum mit Hook; Design "verlauf", easyJet-Stil):
 * "DIESE APP BAUT" / "VERTRAUEN IM SHOP AUF", an der Kartenposition unter dem Kopf, danach die Reihen-Einblendung.
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter; Zoom bis Hüfthöhe): scale 1.4, hoch 495, x 84
 * (Take: Kopfoberkante Median y 586, Augen Median x 600 / y 741, über alle Schnittstücke alle 0,25 s gemessen) →
 * Kopfoberkante ~325, Augen ~542, mittig; unten endet das Bild an der Hüfte (Take y ~1725). Im letzten Stück (Aufruf) steht
 * er näher an der Kamera, die Kopfoberkante liegt dort bei ~230. Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein
 * Punch-in. Von oben: Gesicht, Kinn (Median ~752), Pill-Untertitel (y 895), Karte (ab y 950, bis höchstens 1330), alles
 * über der Instagram-Zone (ab y 1500).
 * Marken-Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund"): an den Stellen über die App, die Anfrage, das
 * Anzeigen im Shop und Sterne/Bewertungsbereich steht er freigestellt vor echten Judge.me-Seiten und offiziellen Bildern des
 * App-Store-Eintrags (HG unten, in den Take gerechnet von npm run portrait --ausschnitt 1.4,495,84 --hintergrund …);
 * Hook, Meinung und Aufruf vor seinem weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/judgeme-skizzen (public/broll/judgeme/skizzen.webm), Zeiten und Töne in
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
export const meta = { id: "JudgeMe", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 600, y 741 → im Bild x 540, y 542; Kopf Median 586 → 325; Bildunterkante = Take y 1725 */
const BILD = { scale: 1.4, hoch: 495, x: 84 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 542;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/judgeme/) */
export const HG: [string, number, number][] = [
  ["hg-listing", 17.25, 21.0], // "… eine App, die genau perfekt dafür ist. Die App nennt sich Judge.me." (App-Store-Eintrag)
  ["hg-anfrage", 23.35, 27.3], // "Und damit kannst du Kunden … um eine Produktbewertung bitten." (App-Store-Bild "Sammeln Sie automatisch Bewertungen")
  ["hg-promo", 27.3, 30.75], // "Und die Bewertung … in deinem Shopify-Shop anzeigen," (App-Store-Bild mit Judge.me-Logo)
  ["hg-widgets", 47.15, 51.95], // "zum Beispiel mit den Sternen … Bewertungsbereich." (judge.me, "16+ widgets")
];

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis "Onlineshop" (3,37 s), ganz weg bei ~3,33 s; danach kommt die Reihen-Einblendung (3,36 s) */
const HOOK_ENDE = fs(3.13);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 950) */
const PILLE = { x: 490, y: 895 };

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

      {/* Hook-Titel laut Briefing, easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~950), wie Karte und Pille um
          x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 698px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="DIESE APP BAUT" line2="VERTRAUEN IM SHOP AUF" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/judgeme-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/judgeme/skizzen.webm")}
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
