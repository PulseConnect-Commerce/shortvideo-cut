/**
 * Format FACE, Serie "E-Commerce einfach erklärt", E08 · Upselling vs. Cross-Selling. Veröffentlichung laut Kalender
 * Mo 07.12.2026 14:00. Look wie E06/E07 (src/projekte/clv, src/projekte/warenkorb): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md, aktives Wort #00E090), als Erklär-Bilder (karten-aufbau.md "Visuelle Metaphern",
 * Vorlage src/projekte/pagebuilder): Upselling vs. Cross-Selling am Warenkorb, Demo-Shop "Kaffeemaschine 129 €",
 * Upsell 129 € → 159 € (+30 €), Cross-Sell 129 € + Bohnen 15 € = 144 €, zwei Methoden für den Bestellwert, Puzzle
 * "passt?", falsches Beispiel Profi-Maschine 600 € mit Warnzeichen, Pop-up-Stapel (Schema), eine Empfehlung mit klarem
 * Nutzen, passende Paare, Gegenüberstellung AOV / Conversion / Marge, Shop-Mock-up Produktauswahl / Warenkorb, Schluss
 * "Die Empfehlung soll passen, nicht stören." (Briefing), zum Schluss nur das Folgen-Symbol. Alle Preise als DEMO.
 * Hook-Titel seit Runde 2 (Pauls Wunsch 30.10.: "Mir fehlt hier leider eine Titel-Hook über meinem Kopf zu Beginn. Einfach nur
 * kurz und prägnant. 'Unterschied zwischen Upselling und Cross Selling'"): Design "verlauf" wie E06, "UNTERSCHIED ZWISCHEN" /
 * "UPSELLING UND CROSS-SELLING" während des ersten Satzes bis nach "Cross-Selling", an der Kartenposition unter Kopf und
 * Pille (über dem Kopf ist bei Kopfoberkante ~315 keine sichere Fläche); die erste Karte (K1) kommt erst danach.
 * Keine Quelle groß: die Briefing-Seite (Shopify-Hilfe "Marketing und Werbeaktionen") sagt nichts zu Upselling oder
 * Cross-Selling, es gibt keinen Satz zu belegen (offene Frage in der Übergabekarte).
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: "erst ab Hüfthöhe"): sitzende Aufnahme,
 * gemessen im Take an 415 Zeitpunkten alle 0,25 s über alle Schnittstücke: Kopfoberkante (RVM-Maske) Median y 690
 * (p5 672, max 718), Augen Median x 593 / y 893, Kinn (YuNet) Median 1117 (p95 1230), Hüftlinie (oberste Zeile der
 * türkisblauen Jeans neben dem T-Shirt) frühestens y 1792 (p5 1802, Median 1828) → scale 1.5, hoch 720, x 80:
 * Kopfoberkante ~315, Augen ~620 mittig, Kinn ~955; der untere Bildrand zeigt Take-y 1760 (mit dem Zoom-in weniger), die
 * Hüftlinie liegt damit mindestens ~48 px unter dem Rand.
 * Sanfte Gamma-Kurve (dunkle Aufnahme) und sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel
 * (y 1080), Karte (y 1140-1490), alles über der Instagram-Zone (ab 1500).
 * Karten als transparentes WebM aus hyperframes/upselling-skizzen (public/broll/upselling/skizzen.webm), Zeiten und Töne
 * in karten.json. Kein B-Roll aus alten Videos, keine Folgennummer.
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
export const meta = { id: "Upselling", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 593, y 893 → im Bild x 540, y 620; Kopf Median 690 → 315; Bildunterkante = Take y 1760
 * (Hüftlinie im Take frühestens 1792: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.5, hoch: 720, x: 80 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 620;

/** Die Aufnahme ist dunkel (Gesicht im Take 0,41, nach npm run farbe mit Gamma 1,04 und sanftem Grade im Bild 0,46; Soll
 * ~0,55-0,57, Regel 5b). brightness() hätte die helle Wand ausgefressen (0,9 · 1,2 > 1), darum eine sanfte Gamma-Kurve in
 * sRGB (SVG-Filter, Exponent GAMMA): Mitten und Gesicht heller, Lichter bleiben (Wand 0,90 → ~0,92), danach der sanfte
 * Grade wie immer. Gemessen an Standbildern wie npm run pruefen.
 * Schärfe (Regel 0c): die Aufnahme ist im Gesicht deutlich weicher als E07 (Laplace-Varianz im Gesichtsausschnitt des
 * Takes Median 28 statt 120), darum vorher eine leichte Unscharfmaske wie `unsharp=5:5:0.8` (Original + 0,8 · (Original −
 * Weichzeichnung σ 1)), im Bild statt im Take (kein Platz auf der Platte für einen neuen Take und ein neues Porträt). */
const GAMMA = 0.75;
const SCHAERFE = 0.8;
const GRADE = `url(#upselling-gamma) ${STIL.gradeSanft}`;
const GammaFilter: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="upselling-gamma" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={1} edgeMode="duplicate" result="weich" />
      <feComposite in="SourceGraphic" in2="weich" operator="arithmetic" k1={0} k2={1 + SCHAERFE} k3={-SCHAERFE} k4={0} result="scharf" />
      <feComponentTransfer in="scharf">
        <feFuncR type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
        <feFuncG type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
        <feFuncB type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
      </feComponentTransfer>
    </filter>
  </svg>
);

/** Hook-Titel bis nach "Cross-Selling" (endet ~2,9 s), ganz weg bei ~3,13 s; K1 kommt bei 3,15 s auf "direkt" */
const HOOK_ENDE = Math.round(2.92 * C.FPS);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn (Median ~955), über der Karte (Karte x 80-900, oben bei y 1140) */
const PILLE = { x: 490, y: 1080 };

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
      <GammaFilter />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px ${AUGEN_Y}px` }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={GRADE}
        />
      </AbsoluteFill>

      {/* Hook-Titel im easyJet-Stil (Design "verlauf", wie E06), an der Kartenposition unter Kopf und Pille: oben bei y 1140
          (Pille endet bei ~1116), x 94-886, wie Karte und Pille um x 490 zentriert, nichts in der TikTok-Leiste rechts (ab x 900) */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 888px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="UNTERSCHIED ZWISCHEN" line2="UPSELLING UND CROSS-SELLING" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/upselling-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/upselling/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...PILLE} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
