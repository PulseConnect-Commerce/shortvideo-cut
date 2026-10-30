/**
 * Format FACE, Serie "E-Commerce einfach erklärt", E07 · Warenkorbabbruch. Veröffentlichung laut Kalender Mo 30.11.2026 14:00.
 * Look wie E05/E06 (src/projekte/deckungsbeitrag, src/projekte/clv): helle Karten unter dem Kopf mit Pill-Untertiteln
 * (karten-aufbau.md, aktives Wort #00E090), als Erklär-Bilder (karten-aufbau.md "Visuelle Metaphern", Vorlage
 * src/projekte/pagebuilder): Reflex Rabattcode, Kaufweg mit "Wo?", fiktive Produktseite "Jacke 89 €" und Checkout
 * "+ 7 € Versand" (DEMO), zweiter Besucher mit M und L "Noch im Vergleich", Warenkorb- ≠ Checkout-Abbruch, Trichter
 * 100 → 60 → 30 als BEISPIEL mit −40 und −30, Mobile-Checkout (DEMO) mit Versand, Zahlungsart, Formularen nacheinander,
 * pauschaler Rabatt "−10 %" und Marge, Signal statt hektischem Retargeting, Schluss "−10 %" durchgestrichen und
 * "Ursache vor Gutschein" (Briefing), zum Schluss nur das Folgen-Symbol.
 * Kein Hook-Titel: das Briefing sagt "kein übergroßer Hook-Titel nötig", keine Marke, keine News (karten-hell.md).
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: "erst ab Hüfthöhe"): sitzende Aufnahme,
 * gemessen im Take an 407 Zeitpunkten alle 0,25 s über alle Schnittstücke: Kopfoberkante (RVM-Maske) Median y 742
 * (p5 720), Augen Median x 538 / y 906, Kinn Median 1081 (p95 1148), Hüftlinie (oberste Zeile der hellblauen Hose)
 * frühestens y 1694 (Median 1726) → scale 1.75, hoch 993, x 0: Kopfoberkante ~306, Augen ~592 mittig, Kinn ~899; der untere
 * Bildrand zeigt Take-y 1665 (mit dem Zoom-in weniger), die Hüftlinie liegt damit mindestens ~52 px unter dem Rand.
 * Sanfter Grade plus brightness (helle Aufnahme, Gesicht nach npm run farbe ~0,70), ein ruhiges Zoom-in (3 %) um die
 * Augen, kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1062), Karte (y 1120-1480), alles über der
 * Instagram-Zone (ab 1500).
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, src/lib/quelle-gross.tsx): 70,35-73,27 s die Shopify-Hilfe
 * (Wiederherstellung abgebrochener Checkouts) zu "Erinnerungen", er als Bubble unten rechts, die Pille links daneben.
 * Karten als transparentes WebM aus hyperframes/warenkorb-skizzen (public/broll/warenkorb/skizzen.webm), Zeiten und Töne in
 * karten.json. Kein B-Roll aus alten Videos, keine Folgennummer.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { PillUntertitel } from "../../lib/pillen";
import { kartenSicht, QuelleBubble, type QuelleFenster, QuelleGross, quellePille, quelleZustand } from "../../lib/quelle-gross";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";
import karten from "./karten.json";

const C = createCut(cut);
export const meta = { id: "Warenkorb", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 538, y 906 → im Bild x 537, y 592; Kopf Median 742 → 306; Bildunterkante = Take y 1665
 * (Hüftlinie im Take frühestens 1694: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.75, hoch: 993, x: 0 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 592;

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bild scharf aus hyperframes/warenkorb-hg/screenshots, nur
 * zugeschnitten). fokus: der markierte Satz auf dem Schirm, der Rest unter hellem Schleier */
const QUELLEN: QuelleFenster[] = [
  // "würde ich tatsächlich über Erinnerungen oder Gutscheine nachdenken" → "Du kannst Kund:innen automatisch eine E-Mail
  // senden, nachdem sie ihren Checkout abgebrochen haben."
  {
    von: 70.35,
    bis: 73.27,
    bild: "broll/warenkorb/quelle-shopify-mail.jpg",
    y: 0,
    fokus: [[545, 668]],
    label: "Shopify-Hilfe · abgebrochene Checkouts",
  },
];

/** Sanfter Grade (STIL.gradeSanft) plus brightness: die Aufnahme ist hell (Gesicht im Take 0,646, nach npm run farbe, das
 * Weißpunkt und Gamma nur sanft korrigiert, noch heller), Soll im fertigen Video ~0,55-0,57 (Regel 5b, seine Vorgabe
 * 2026-10-18 "zu hell"); mit brightness(0.8) an vier Standbildern 0,58-0,61, darum 0,76; wie bei CLV und MyStoreBuddy */
const GRADE = `brightness(0.76) ${STIL.gradeSanft}`;

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn (Median ~899, p95 ~1016), über der Karte (Karte x 80-900, oben bei y 1120) */
const PILLE = { x: 490, y: 1062 };

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

      {/* Erklär-Bilder aus HyperFrames (hyperframes/warenkorb-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/warenkorb/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: kartenSicht(q.p) }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
