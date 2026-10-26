/**
 * Format FACE, Serie S (ID "Shopify in 30 Sekunden", Inhalt bewusst substanzieller), S02 · Metafelder. Veröffentlichung
 * laut Kalender Mi 28.10.2026 14:00.
 * Aktueller Look: helle Karten unter dem Kopf mit Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten
 * (freigegeben 2026-10-26, Vorlagen P04 src/projekte/pagebuilder und A03 src/projekte/judgeme): jede Karte zeigt den
 * Gedanken als Bild (immer derselbe Fließtext, Etiketten am T-Shirt, Standardfelder + eigene Felder, Weg in den
 * Einstellungen, Feldtyp in der Fassung, Wert je Produkt, Theme mit dynamischen Quellen, Block mit Kabel am Metafeld, eine
 * Vorlage für viele Seiten, Aufwand schrumpft, ein Feld für viele Produkte, Lupe über zwei Seiten, unsichtbare Felder),
 * höchstens 1-3 Wörter, ein handschriftliches Akzentwort.
 * Hook-Titel (Marke Shopify im ersten Satz, darum mit Hook; Design "verlauf", easyJet-Stil): "SHOPIFY-METAFELDER" /
 * "STATT FLIESSTEXT", an der Kartenposition unter dem Kopf, bis vor die erste Karte (2,9 s). Keine Reihen-Einblendung
 * (Briefing: "Shopify in 30 Sekunden" ist nur die Serien-ID), keine Folgennummer.
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter): scale 1.38, hoch 686, x 32 (Take: Haar
 * ~y 725, Augen Median x 563 / y 884, über alle Schnittstücke alle 0,25 s gemessen) → Kopfoberkante ~315, Augen ~534,
 * mittig; unten endet das Bild bei Take y ~1888 (kein Rand). Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein
 * Punch-in. Von oben: Gesicht, Kinn (~756), Pill-Untertitel (y 895), Karte (ab y 950, bis 1310), alles über der
 * Instagram-Zone (ab y 1500).
 * Marken-Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund"): an den Stellen über Metafelder, Definitionen,
 * Feldtyp, Werte, Theme-Editor und Produktvorlage steht er freigestellt vor echten Seiten des Shopify Help Center (HG
 * unten, in den Take gerechnet von npm run portrait --ausschnitt 1.38,686,32 --hintergrund …); Hook, Fließtext-Vergleich,
 * Pflegeaufwand, Aufruf, Tipp und Schluss vor seinem weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/metafelder-skizzen (public/broll/metafelder/skizzen.webm), Zeiten und Töne
 * in karten.json.
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
export const meta = { id: "Metafelder", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 563, y 884 → im Bild x 540, y 534; Haar ~725 → 315; Bildunterkante = Take y 1888 */
const BILD = { scale: 1.38, hoch: 686, x: 32 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 534;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/metafelder/) */
export const HG: [string, number, number][] = [
  ["hg-beispiel", 64.8, 72.7], // "Nehmen wir … Onlineshop für Bekleidung … Pflegehinweise …" (Hilfe-Center "Metafelder", Warum Metafelder verwenden)
  ["hg-metafelder", 78.78, 84.2], // "Statt … Fließtext … eigene Metafelder an." (Hilfe-Center "Metafelder", Kopf)
  ["hg-definitionen", 101.3, 106.1], // "In Shopify findest du das Ganze unter Einstellungen …" (Hilfe-Center "Hinzufügen von Metafeld-Definitionen")
  ["hg-schritt1", 106.1, 110.35], // "Dort kannst du … ein Metafeld für die Pflegeanleitung anlegen." (Tutorial Schritt 1)
  ["hg-typen", 111.05, 114.4], // "Wichtig dabei ist, dass du einen passenden Feldtyp auswählst." (Hilfe-Center "Inhaltstypen und Werte")
  ["hg-typen", 118.7, 122.2], // "Also zum Beispiel einen Text …"
  ["hg-schritt2", 132.35, 141.45], // "Und danach gehst du … in die Produkte und trägst dort den konkreten Wert ein …" (Tutorial Schritt 2)
  ["hg-anzeigen", 156.1, 160.25], // "Denn wenn ein Theme dynamische Quellen unterstützt … im Theme-Editor" (Hilfe-Center "Metafelder in deinem Onlineshop anzeigen")
  ["hg-schritt3", 160.25, 166.15], // "einen passenden Block, zum Beispiel eine einklappbare Zeile, … verbinden." (Tutorial Schritt 3)
  ["hg-vorlage", 183.15, 190.4], // "Denn dann nutzt du eine Produktvorlage … Ist das nicht cool?" (Tutorial, letzter Absatz)
];

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis "Information" (~2,6 s), ganz weg bei ~2,85 s; die erste Karte kommt bei 2,90 s ("mühsam") */
const HOOK_ENDE = fs(2.65);

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

      {/* Hook-Titel (Marke Shopify), easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~950), wie Karte und Pille um
          x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 698px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SHOPIFY-METAFELDER" line2="STATT FLIESSTEXT" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/metafelder-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/metafelder/skizzen.webm")}
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
