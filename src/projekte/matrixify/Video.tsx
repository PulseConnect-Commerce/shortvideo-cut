/**
 * Format FACE, A-Reihe "Eine Shopify-App, ein Problem", A06 · Matrixify. Veröffentlichung laut Kalender Sa 28.11.2026 14:00.
 * Keine Serien-Erwähnung im Video (Briefing), darum keine Reihen-Einblendung.
 * Aktueller Look wie A05 (src/projekte/mystorebuddy) und A03 (src/projekte/judgeme): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlage P04 pagebuilder).
 * Hook: laut Briefing keine künstliche Hook; statt Hook-Titel ein dezenter Schriftzug "Matrixify" mit dem offiziellen App-Icon
 * in der Kopfzeile der ersten Karte (0-7,45 s, in den Karten).
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): sitzend,
 * scale 1.25, hoch 445, x 24 (Take: Kopfoberkante Median y 600 mit der Porträt-Maske, Augen Median x 560 / y 865, Kinn Median
 * 1140, an 216 Zeitpunkten alle 0,5 s über alle Schnittstücke gemessen) → Kopfoberkante ~305, Augen ~636, Kinn ~980, mittig.
 * Hüftlinie: Im ganzen Take ist unten nur Pulli und Hände zu sehen (die Hüfte liegt unter dem Bildrand des Takes); der untere
 * Bildrand zeigt Take-y 1892 (mit dem Zoom-in bis ~1862, im Punch-in ~1782), die Hüftlinie liegt also immer mindestens 35 px (Video) unter dem
 * Rand. Ein ruhiges Zoom-in (3 %) um die Augen; ein Punch-in (1,1) von "dann kann natürlich ein strukturierter Import" bis
 * "würde ich aber" (zwei Schnitte im Satz werden so zu Kamerawechseln). Von oben: Gesicht, Kinn, Pill-Untertitel (y 1040),
 * Karte (y 1085-1495), alles über der Instagram-Zone (ab y 1500).
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, karten-aufbau.md, src/lib/quelle-gross.tsx): App-Store-Eintrag
 * (Kopf mit Name, kostenlosem Plan, Bewertung, Entwickler; Kurzbeschreibung mit "Excel, CSV oder Google Sheets"), zwei
 * offizielle Bilder aus dem Eintrag (Export, Import-Ergebnis) und der Preisbereich mit dem kostenlosen Plan "Demo"; er läuft als
 * Bubble unten rechts weiter, die Pille links daneben. Keine Hintergründe hinter ihm (Matrixify ist keine Konsumentenmarke,
 * Lesetext gehört seit 2026-10-28 in "Quelle groß"); sonst steht er vor seinem weichgezeichneten Zimmer.
 * Keine Werbekennzeichnung: Entwickler laut App-Store-Eintrag ITissible, keine geschäftliche Verbindung erkennbar.
 * Karten als transparentes WebM aus hyperframes/matrixify-skizzen (public/broll/matrixify/skizzen.webm), Zeiten und Töne in
 * karten.json.
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
export const meta = { id: "Matrixify", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 560, y 865 → im Bild x 540, y 636; Kopf Median 600 → 305; Bildunterkante = Take y 1892 (mit Zoom-in bis 1862, im Punch-in 1782) */
const BILD = { scale: 1.25, hoch: 445, x: 24 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 636;
/** Punch-in (1,1) über die beiden Schnitte "umziehst, | dann kann" und "würde ich aber | niemals": an Schnittstück 7 rein, an 8
 * wieder raus; Ursprung zwischen Augen und Kinn, damit das Kinn über der Pille bleibt */
const PUNCH = { von: C.KEEPS[7].at, bis: C.KEEPS[8].at, s: 1.1, y: 790 };

/** Sanfter Grade (Regel 5b, freigegebener Look) plus brightness: im ersten Render lag das Gesicht bei 0,585, Ziel 0,55-0,57 */
const GRADE = `brightness(0.96) ${STIL.gradeSanft}`;

const QUELLE_APP = "apps.shopify.com/excel-export-import · 29.10.2026";
const OFFIZIELL = "Offizielles Bild aus dem App-Store-Eintrag";

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder aus hyperframes/matrixify-hg, nur zugeschnitten, QUELLE.txt).
 * fokus: die Sätze, um die es geht, auf dem Schirm; der Rest unter hellem Schleier */
const QUELLEN: QuelleFenster[] = [
  // "… Matrixify nutzen. Das ist eine Shopify-App, mit der du tatsächlich" → Kopf des Eintrags: Name, kostenloser Plan, Entwickler
  { von: 27.15, bis: 29.8, bild: "broll/matrixify/quelle-kopf.jpg", y: 150, fokus: [[300, 700]], label: QUELLE_APP },
  // "Shop-Daten als Excel oder als CSV-Datei" → Kurzbeschreibung mit markiertem "Excel, CSV oder Google Sheets" und Funktionsliste
  { von: 29.8, bis: 32.3, bild: "broll/matrixify/quelle-kurz.jpg", y: 240, fokus: [[335, 520], [710, 935]], label: QUELLE_APP },
  // "Nehmen wir mal das Beispiel. Du exportierst deine Produkte," → offizielles Bild "Export data, download as Excel file"
  { von: 35.85, bis: 39.05, bild: "broll/matrixify/quelle-export.jpg", y: 330, seite: "#202E78", label: OFFIZIELL },
  // "prüfen, ob die richtigen" → offizielles Bild "Control what happens during import", ganz
  { von: 70.7, bis: 72.2, bild: "broll/matrixify/quelle-import.jpg", y: 330, seite: "#202E78", label: OFFIZIELL },
  // "Datensätze aktualisiert wurden" → dasselbe Bild 2,5-fach: Import-Ergebnis "Products New: 2 · Updated: 5 · Warnings: 1"
  {
    von: 72.2,
    bis: 73.55,
    bild: "broll/matrixify/quelle-import.jpg",
    y: -182,
    x: -1350,
    zoom: 2.5,
    seite: "#202E78",
    fokus: [[585, 815]],
    label: OFFIZIELL,
  },
  // "Matrixify hat natürlich auch einen kostenlosen Einstieg. Also welche Datenmengen …" → Preisbereich, Plan "Demo": "Kostenlos",
  // "Pro Datei: 10 Produkte, 10 Kategorien" (markiert)
  {
    von: 82.4,
    bis: 89.1,
    bild: "broll/matrixify/quelle-preis.jpg",
    y: 290,
    fokus: [
      [620, 765],
      [890, 990],
    ],
    label: "apps.shopify.com/excel-export-import · Preisgestaltung",
  },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1085) */
const PILLE = { x: 490, y: 1040 };

type Props = {
  voice?: boolean;
  sfx?: boolean;
  raster?: boolean;
  untertitel?: boolean;
  musik?: string | false;
};

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %)
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  const punch = fr >= PUNCH.von && fr < PUNCH.bis ? PUNCH.s : 1;
  // Quelle groß: 0 = normal, 1 = Quelle über das ganze Bild, er als Bubble unten rechts
  const q = quelleZustand(QUELLEN, fr, C.FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <QuelleGross fenster={QUELLEN} fr={fr} fps={C.FPS} />
      <QuelleBubble p={q.p}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px ${AUGEN_Y}px` }}>
          <AbsoluteFill style={{ transform: `scale(${punch})`, transformOrigin: `540px ${PUNCH.y}px` }}>
            <Takes
              C={C}
              voice={voice}
              transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
              transformOrigin="50% 0%"
              grade={GRADE}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      </QuelleBubble>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/matrixify-skizzen), helle Karten unter dem Kopf; der Schriftzug
          "Matrixify" am Anfang liegt mit darin */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/matrixify/skizzen.webm")}
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
