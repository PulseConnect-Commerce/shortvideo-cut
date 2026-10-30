/**
 * Format HERO, neue Reihe K "KI allgemein", K01 · Claude: 6 Werkzeuge, die die meisten nicht kennen. Veröffentlichung laut
 * Kalender Sa 31.10.2026 19:00 (Slot 3, Hero / Marke / Meinung).
 * Look wie die freigegebenen Videos (E08 src/projekte/upselling, A06 src/projekte/matrixify, N08 src/projekte/etsyki): helle
 * Karten unter dem Kopf als Erklär-Bilder (karten-aufbau.md "Visuelle Metaphern"), Pill-Untertitel (aktives Wort #00E090),
 * Farbwelt PulseConnect-Verlauf #00D088 → #31ADEC, Zähler "1 von 6 … 6 von 6" auf den Karten (Briefing).
 * Hook-Titel (Briefing, starke Zahl): "CLAUDE:" / "6 WERKZEUGE" im easyJet-Stil (Design "verlauf", karten-hell.md), an der
 * Kartenposition unter dem Kopf, bis "sechs" (7,6 s); dort kommt die erste Karte mit den sechs Werkzeugen.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): sitzend,
 * gemessen im Take an 173 Zeitpunkten (jede Sekunde über alle Schnittstücke, YuNet): Augen Median x 585 / y 802 (p5 756, p95
 * 869), Kinn Median 1017 (p95 1087), Haaransatz/Kopfoberkante ~575 (Standbilder); Hüftlinie (oberste Jeans-Zeile neben dem
 * Pulli, Standbilder an 17 Stellen) frühestens bei y ~1625 → scale 1.6, hoch 630, x 72: Kopfoberkante ~290, Augen ~653,
 * Kinn ~997, waagrecht mittig; der untere Bildrand zeigt Take-y 1594 (mit dem Zoom-in weniger), die Hüftlinie liegt also
 * mindestens ~30 px (Take) bzw. ~50 px (Video) unter dem Rand. Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein
 * Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1072), Karte (y 1120-1470), alles über der Instagram-Zone (ab y 1500).
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, src/lib/quelle-gross.tsx) für die drei echten Seiten aus dem
 * Briefing: claude.com/claude-in-chrome (zwei Fenster), anthropic.com/news/claude-design-anthropic-labs (Kopf mit Datum, Absatz
 * "Export anywhere"), claude.com/pricing (Free und Pro, Preise weichgezeichnet). Bilder in hyperframes/claudetools-hg (QUELLE.txt).
 * Karten als transparentes WebM aus hyperframes/claudetools-skizzen (public/broll/claudetools/skizzen.webm), Zeiten und Töne in
 * karten.json.
 * Farbe: die gemessene Filterkette von `npm run farbe` (colorchannelmixer 0.9984/0.9942/1.0079, Gamma 1/0.962, Vibrance 0.08)
 * wurde in einem Durchgang mit dem Schwärzen der ungenutzten Take-Teile auf den Take gelegt (Speicher knapp, keine Sicherung).
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { PillUntertitel } from "../../lib/pillen";
import { kartenSicht, QuelleBubble, type QuelleFenster, QuelleGross, quellePille, quelleZustand } from "../../lib/quelle-gross";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";
import karten from "./karten.json";

const C = createCut(cut);
export const meta = { id: "ClaudeTools", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 585, y 802 → im Bild x 540, y 653; Kopf ~575 → ~290; Bildunterkante = Take y 1594
 * (Hüftlinie im Take frühestens ~1625: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.6, hoch: 630, x: 72 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 653;

/** Sanfter Grade (Regel 5b, freigegebener Look) */
const GRADE = STIL.gradeSanft;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel "CLAUDE: 6 WERKZEUGE" bis "Es sind inzwischen einfach mindestens" (7,6 s), ganz weg bei ~7,55 s; die erste Karte
 * (die sechs Werkzeuge) kommt auf "sechs" (7,6 s) */
const HOOK_ENDE = fs(7.35);

const CHROME = "claude.com/claude-in-chrome";
const PREISE = "claude.com/pricing";

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus hyperframes/claudetools-hg/screenshots, nur
 * zugeschnitten und grün markiert, Preise weichgezeichnet). fokus: die Sätze, um die es geht, auf dem Schirm. */
const QUELLEN: QuelleFenster[] = [
  // "und Claude arbeitet dann tatsächlich direkt einfach in deinem Browser mit," → Kopf der Seite "Claude in Chrome / Hilfe für alle
  // Ihre Registerkarten"
  { von: 65.6, bis: 68.95, bild: "broll/claudetools/quelle-chrome.jpg", y: -144, fokus: [[350, 815]], label: CHROME },
  // "liest dann Seiten und klickt sich einfach durch die Seiten durch." → markiert "liest die Seite", "klickt sich durch"
  { von: 68.95, bis: 72.25, bild: "broll/claudetools/quelle-chrome.jpg", y: -710, fokus: [[330, 790]], label: CHROME },
  // "Und fünftens ist Claude Design. Das kennen tatsächlich immer noch sehr wenige." → Ankündigung, Published Apr 17, 2026
  // (der Ausschnitt endet vor dem Absatz mit den Plänen: keine Plan-Zuordnung für Design, Faktencheck)
  { von: 76.93, bis: 80.55, bild: "broll/claudetools/quelle-design-kopf.jpg", y: -16, fokus: [[320, 740]], label: "anthropic.com · Ankündigung" },
  // "… als PDF oder als PowerPoint oder auch einfach nach Canva direkt exportieren" → "Export anywhere … Canva, PDF, PPTX" markiert
  { von: 90.4, bis: 95.7, bild: "broll/claudetools/quelle-design-export.jpg", y: 34, fokus: [[395, 650]], label: "anthropic.com · Claude Design" },
  // "Chat und Projekte kannst du natürlich kostenlos ausprobieren." → Free-Plan, markiert "Im Web, auf dem Desktop und mobil chatten"
  {
    von: 122.87,
    bis: 126.05,
    bild: "broll/claudetools/quelle-preise.jpg",
    y: -827,
    x: 27,
    zoom: 0.95,
    fokus: [
      [335, 455],
      [600, 655],
      [925, 1048],
    ],
    label: PREISE + " · Free",
  },
  // "Für Claude Code und Claude in Chrome oder auch Claude in Excel und PowerPoint brauchst du aber immer mindestens das Pro-Abo."
  // → Pro "Alles in Free, plus:", markiert "Claude Code", "Claude in Chrome und Microsoft 365"
  {
    von: 126.05,
    bis: 132.75,
    bild: "broll/claudetools/quelle-preise.jpg",
    y: -2712,
    x: 75,
    zoom: 0.86,
    fokus: [
      [352, 412],
      [648, 716],
      [942, 1006],
    ],
    label: PREISE + " · Pro",
  },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1120) */
const PILLE = { x: 490, y: 1072 };

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
  // Quelle groß: 0 = normal, 1 = Quelle über das ganze Bild, er als Bubble unten rechts
  const q = quelleZustand(QUELLEN, fr, C.FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <QuelleGross fenster={QUELLEN} fr={fr} fps={C.FPS} />
      <QuelleBubble p={q.p}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px ${AUGEN_Y}px` }}>
          <Takes
            C={C}
            voice={voice}
            transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
            transformOrigin="50% 0%"
            grade={GRADE}
          />
        </AbsoluteFill>
      </QuelleBubble>

      {/* Hook-Titel (Briefing: "CLAUDE: 6 WERKZEUGE", starke Zahl; Design verlauf wie easyJet), an der Kartenposition unter dem
          Kopf (oben ~1120), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 868px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="CLAUDE:" line2="6 WERKZEUGE" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/claudetools-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/claudetools/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: kartenSicht(q.p) }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={Math.round(t.at * C.FPS)} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
