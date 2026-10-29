/**
 * Format FACE (wie P09 und P04), P-Serie, P06 · Schöner Shop, aber wenig Verkäufe. Veröffentlichung laut Kalender
 * So 15.11.2026 19:00. Aktueller Look wie P09 (src/projekte/kitools) und P04 (src/projekte/pagebuilder): helle Karten unter
 * dem Kopf mit Pill-Untertiteln (karten-aufbau.md, aktives Wort #00E090), Erklär-Bilder statt Wortkarten (freigegeben
 * 2026-10-26): schöner Demo-Shop mit flacher Verkaufslinie; Zeit fließt ins perfekte Design (Farben, Animationen, Schriften,
 * immer mehr Seiten); KI wirft Designs noch schneller aus; schön ≠ Kauf; beim Prüfen zählt eine andere Frage; die vier
 * Prüffragen als Markierungen auf einer Beispielseite (Angebot, Nutzen, Versand & Retoure, Vertrauen; Briefing "Markierung
 * Produktnutzen/Versand/Vertrauen"); KI ordnet Texte und findet Lücken; ein Haus (Fundament Klarheit, Wände Vertrauen, Dach
 * Design, "schön ≠ gut"); Folgen-Plus. Beispielseiten als BEISPIEL gekennzeichnet, keine Sterne, Bewertungen, Garantien
 * oder Zahlen (Briefing: "Keine fingierten Reviews oder Garantien").
 * Kein Hook-Titel (karten-hell.md "Hook-Titel nur, wenn er etwas bringt": persönliche Meinung, der erste Satz trägt allein;
 * Regie: "eher weglassen"); das erste Erklär-Bild kommt auf "Shopify-Shop" (0,27 s).
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, src/lib/quelle-gross.tsx): auf "Aber sie sollten eben auch
 * keine Produktvorteile, Bewertungen oder auch Garantien erfinden." steht die offizielle Quelle aus dem Briefing scharf über
 * das ganze Bild (Shopify Help Center, "Automatische Erstellung von Inhalten im Theme-Editor", Kasten "Achtung"), er läuft
 * als Bubble unten rechts weiter, die Pille links daneben. Keine Hintergründe hinter ihm (kein Marken-Video; Lesetext hinter
 * dem Kopf ist seit 28.10. nicht mehr erlaubt).
 * Bild: siehe BILD unten (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe).
 * Sanfter Grade plus brightness(0.91) (GRADE), ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in.
 * Karten als transparentes WebM aus hyperframes/schoenershop-skizzen (public/broll/schoenershop/skizzen.webm), Zeiten und
 * Töne in karten.json.
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
export const meta = { id: "SchoenerShop", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildausschnitt, über alle Schnittstücke alle 0,5 s gemessen (142 Zeitpunkte, Take-Koordinaten): Kopfoberkante (Porträt-
 * Maske) Median y 705 (683-724), Augen Median x 624 / y 915, Kinn Median 1121, Hüftlinie (oberste Jeans-Zeile neben dem
 * Pulli) frühestens y 1696, p5 1706, Median 1776 → im Bild Kopfoberkante ~315, Augen ~664, Kinn ~1006, mittig. Der untere
 * Bildrand zeigt Take-y 1672 (Frame 0; mit dem Zoom-in danach weniger), die Hüftlinie liegt also überall mindestens ~40 px
 * unter dem Bildrand (Pauls Regel 2026-10-27: erst ab Hüfthöhe, nichts darunter) */
const BILD = { scale: 1.66, hoch: 855, x: 140 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 664;

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bild scharf aus hyperframes/schoenershop-hg/screenshots/de-ganz.png,
 * nur zugeschnitten (y 1100-2400), QUELLE.txt). fokus: die zwei markierten Stellen auf dem Schirm, der Rest unter hellem
 * Schleier; Kasten "Achtung" oben ab y ~310, die Markierungen bei y ~700-790 und ~900-990 (über der Bubble ab y 1010),
 * Textspalte x ~80-880 (links der TikTok-Leiste), Schrift ~42 px */
const QUELLEN: QuelleFenster[] = [
  // "Aber sie sollten eben auch keine Produktvorteile, Bewertungen oder auch Garantien erfinden." → "z. B. Produktvorteile,
  // die du nicht auflistest, oder Fakten über ähnliche Produkte." und "Produktgarantien wie „garantiert bis zu 1000 Wäschen“"
  {
    von: 49.65,
    bis: 53.8,
    bild: "broll/schoenershop/quelle-achtung.jpg",
    y: 207,
    x: -60,
    zoom: 0.95,
    fokus: [[694, 800], [892, 1000]],
    label: "Shopify Help Center · Theme-Editor",
  },
];

/** Sanfter Grade (STIL.gradeSanft) plus brightness(0.91): das Gesicht lag in der ersten Vollversion bei 0,626 (gemessen wie
 * npm run pruefen, 12 Zeitpunkte; Soll ~0,55-0,57, über 0,60 zu hell, karten-hell.md), wie N09 im Grade ausgeglichen */
const GRADE = `${STIL.gradeSanft} brightness(0.91)`;

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1135) */
const PILLE = { x: 490, y: 1085 };

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

      {/* Erklär-Bilder aus HyperFrames (hyperframes/schoenershop-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/schoenershop/skizzen.webm")}
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
