/**
 * Format FACE, A-Reihe "Eine Shopify-App, ein Problem", A04 · Klaviyo. Veröffentlichung laut Kalender Sa 14.11.2026 14:00.
 * Aktueller Look wie A03 (src/projekte/judgeme) und S04 (src/projekte/shopifyflow): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26): Besucher sieht ein Produkt und
 * geht wieder, Klaviyo verbindet Shop-Daten mit E-Mail, Anmeldungen sammeln und in Gruppen sortieren, E-Mail-Strecke als Kette
 * = Willkommensserie, passende Nachricht nach dem Kauf, E-Mail nur mit Einwilligung, Automation-Schalter ohne automatischen
 * Verkaufssprung, gezielt statt an alle, Folgen-Plus; höchstens 1-3 Wörter, ein handschriftliches Akzentwort.
 * Hook-Titel (Marke Klaviyo, darum mit Hook; Design "verlauf", easyJet-Stil): "KLAVIYO: DIESE APP" / "AUTOMATISIERT DEIN
 * E-MAIL-MARKETING" (Briefing-Text wörtlich, mit der Marke in der ersten Zeile), an der Kartenposition unter dem Kopf, danach
 * die Reihen-Einblendung. Keine Folgennummer.
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter): scale 1.4, hoch 440, x 97 (Take: Kopfoberkante
 * Median y 539 mit der Porträt-Maske, Augen Median x 609 / y 719, Kinn ~894, über alle Schnittstücke alle 0,5 s gemessen) →
 * Kopfoberkante ~315, Augen ~567, mittig; unten endet das Bild an der Hüfte (Take y ~1685, kein Rand). Sanfter Grade, ein
 * ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Von oben: Gesicht, Kinn (~812), Pill-Untertitel (y 895), Karte (ab
 * y 950, bis 1310), alles über der Instagram-Zone (ab y 1500).
 * Marken-Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund"): an sieben Stellen steht er freigestellt vor echten
 * Seiten von klaviyo.com, dem Klaviyo Help Center und dem Klaviyo-Eintrag im Shopify App Store (HG unten, in den Take
 * gerechnet von npm run portrait --ausschnitt 1.4,440,97 --hintergrund …); Hook, Problem, Meinung und Aufruf vor seinem
 * weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/klaviyo-skizzen (public/broll/klaviyo/skizzen.webm), Zeiten und Töne in
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
export const meta = { id: "Klaviyo", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 609, y 719 → im Bild x 540, y 567; Haar ~539 → 315; Bildunterkante = Take y 1685 */
const BILD = { scale: 1.4, hoch: 440, x: 97 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 567;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/klaviyo/) */
export const HG: [string, number, number][] = [
  ["hg-app", 18.38, 20.9], // "Genau hier kann Klaviyo interessant werden." (Shopify App Store: Klaviyo E-Mail-Marketing & SMS)
  ["hg-daten", 20.9, 24.5], // "Denn die App verbindet E-Mail-Marketing mit Daten aus deinem Shopify-Shop." (klaviyo.com: "Alle Daten ... an einem Ort")
  ["hg-segment", 28.3, 35.6], // "... Newsletter-Anmeldungen sammeln, Zielgruppen segmentieren ..." (klaviyo.com Segmentierung, Namen anonymisiert)
  ["hg-welcome", 66.25, 69.65], // "Zum Beispiel eine Willkommensserie ..." (Help Center: Welcome-Serie im Flow-Builder)
  ["hg-kauf", 70.45, 75.45], // "... Nachrichten direkt an Kunden, die bereits etwas bei dir gekauft haben ..." (klaviyo.com: Flow "Einmal bestellt")
  ["hg-optin", 75.45, 78.95], // "Natürlich musst du dabei immer auf die richtigen Einwilligungen achten." (Help Center: Double-Opt-in-Verfahren)
  ["hg-gezielt", 112.08, 114.85], // "Aber du kannst ... deine Kunden deutlich gezielter ansprechen." (klaviyo.com: detaillierte Kundensegmentierung)
  ["hg-gezielt", 119.3, 122.7], // "Und genau darum geht es ... in einem guten E-Mail-Marketing." (dieselbe Seite)
];

/** Sanfter Grade plus 3 % dunkler: das Gesicht liegt im Take (nach npm run farbe) bei 0,570, mit dem sanften Grade allein
 *  im fertigen Video bei ~0,58 (über 0,57, seine Vorgabe 2026-10-18 "zu hell"); S04 kam von 0,584 mit brightness 0,95 auf
 *  0,559, hier reichen 0,97 für ~0,556. */
const GRADE = `brightness(0.97) ${STIL.gradeSanft}`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis kurz vor "unbedingt" (3,70 s), ganz weg bei ~3,5 s; danach kommt die Reihen-Einblendung (3,67 s) */
const HOOK_ENDE = fs(3.3);

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
          grade={GRADE}
        />
      </AbsoluteFill>

      {/* Hook-Titel (Marke Klaviyo, Text aus dem Briefing), easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~950),
          wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 698px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="KLAVIYO: DIESE APP" line2="AUTOMATISIERT DEIN E-MAIL-MARKETING" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/klaviyo-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/klaviyo/skizzen.webm")}
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
