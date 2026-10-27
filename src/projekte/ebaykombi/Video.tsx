/**
 * Format NEWS, N09 · eBay-Kombirabatte: Mehr Warenkorb oder weniger Marge? Veröffentlichung laut Kalender Mi 28.10.2026 09:00
 * (News-Slot). Aktueller Look wie N06 (src/projekte/amazonbgh): helle Karten unter dem Kopf mit Pill-Untertiteln
 * (karten-aufbau.md, aktives Wort #00E090), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlage P04): Geschenk
 * "−15 %" und Rechner, echte Quelle Händlerbund (26.10.2026), Warenkorb füllt sich, Stufen 2 / 3 / 4+ Artikel −5 / −10 / −15 %
 * als BEISPIEL, gleiche und verschiedene Artikel, Rabatt automatisch im Warenkorb, Schalter "selbst aktivieren", Ø Warenkorbwert
 * steigt, "MEHR WARENKORB ≠ MEHR GEWINN" (Umsatz steigt, Marge schrumpft, Rabatt frisst sie), Einkauf / eBay-Gebühren / Versand /
 * Retouren knabbern am Deckungsbeitrag, echte Quelle eBay-Hilfe (Rückgaben), "TEILRETOURE? RABATT WIRD NEU BERECHNET", Tipp
 * (passende Produkte mit Marge, nicht das ganze Sortiment), Umfrage "Würdest du das nutzen?" mit Folgen-Plus.
 * Hook-Titel laut Regie und Briefing (Marke eBay, News, darum mit Hook; Design "verlauf", easyJet-Stil): "NEU BEI EBAY:" /
 * "KOMBI-RABATTE", an der Kartenposition unter dem Kopf, bis vor die erste Karte (3,5 s).
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): scale 1.6,
 * hoch 817, x 72 (Take: Kopfoberkante Median y 701 mit der Porträt-Maske, Augen Median x 585 / y 916, Kinn ~1129, Hüftlinie
 * (oberste Jeans-Zeile) frühestens y 1743, Median 1775, an 178 Zeitpunkten alle 0,5 s über alle Schnittstücke gemessen) →
 * Kopfoberkante ~305, Augen ~649, Kinn ~988, mittig; der untere Bildrand zeigt Take-y 1711 (mit dem Zoom-in bis ~1688), also
 * liegt die Hüftlinie mindestens 32 px unter dem Bildrand. Sanfter Grade plus brightness(0.985), ein ruhiges Zoom-in (3 %)
 * um die Augen, kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1068), Karte (y 1118-1468), alles über der
 * Instagram-Zone (ab y 1500).
 * Hintergründe (karten-aufbau.md "Marken-Shops als Hintergrund", stil-news "Quelle als Hintergrund"): an sieben Stellen steht er
 * freigestellt vor echten Seiten (fünfmal die eBay-Hilfe "Kombirabatte für Verkäufer", zweimal die Händlerbund-Meldung; HG unten,
 * in den Take gerechnet von npm run portrait --ausschnitt 1.6,817,72 --hintergrund …). Rest vor seinem weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/ebaykombi-skizzen (public/broll/ebaykombi/skizzen.webm), Zeiten und Töne in
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
export const meta = { id: "EbayKombi", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 585, y 916 → im Bild x 540, y 649; Kopf Median 701 → 305; Bildunterkante = Take y 1711
 * (Hüftlinie im Take frühestens 1743: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.6, hoch: 817, x: 72 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 649;

/** Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/ebaykombi/) */
export const HG: [string, number, number][] = [
  ["hg-ebay-kopf", 7.9, 14.3], // "eBay hat eine neue Rabattfunktion, aber bevor du jetzt 15 % verschenkst, …" (eBay-Hilfe, Kopf)
  ["hg-hb-stufen", 40.1, 47.5], // "Du kannst bis zu drei Stufen festlegen. Zum Beispiel …" (Händlerbund: "Möglich sind bis zu drei Stufen")
  ["hg-ebay-einrichten", 47.5, 50.0], // "Die Prozentsätze bestimmst du selbst." (eBay-Hilfe: "Wählen Sie danach den Rabattprozentsatz …")
  ["hg-ebay-intro", 50.2, 56.4], // "Und das funktioniert nicht nur, wenn jemand denselben Artikel …" (eBay-Hilfe, Einleitung)
  ["hg-ebay-funktion", 59.7, 62.55], // "Der Rabatt wird dann automatisch im Warenkorb berücksichtigt." (eBay-Hilfe: "Sie selbst müssen den Rabatt nicht berechnen …")
  ["hg-hb-aktiv", 62.55, 69.0], // "Aktivieren musst du ihn aber leider selbst. Standardmäßig …" (Händlerbund: "nicht standardmäßig aktiv")
  ["hg-ebay-rueckgabe", 108.4, 115.25], // "Und eine Sache ist hier noch wichtig, bei Teilretouren …" (eBay-Hilfe: "So funktionieren Rückgaben")
];

/** Sanfter Grade (STIL.gradeSanft) plus brightness(0.985): das Gesicht lag im ersten fertigen Video bei 0,575 (gemessen wie
 * npm run pruefen, 12 Zeitpunkten), Regie: "Liegt das Gesicht über 0,57, im Grade ausgleichen" → ~0,566 */
const GRADE = `${STIL.gradeSanft} brightness(0.985)`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis "verschenkst" (3,60 s), ganz weg bei 3,5 s; die erste Karte kommt bei 3,53 s */
const HOOK_ENDE = fs(3.3);

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

      {/* Hook-Titel (Regie und Briefing: "NEU BEI EBAY: KOMBI-RABATTE", Marke in Zeile 1, Design verlauf), an der Kartenposition
          unter dem Kopf (oben ~1118), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 866px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="NEU BEI EBAY:" line2="KOMBI-RABATTE" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder und Quellen-Karten aus HyperFrames (hyperframes/ebaykombi-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/ebaykombi/skizzen.webm")}
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
