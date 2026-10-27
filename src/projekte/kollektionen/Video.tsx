/**
 * Format FACE, Serie S (ID "Shopify in 30 Sekunden", Inhalt laut Briefing bewusst substanzieller), S03 · Automatische
 * Kollektionen. Veröffentlichung laut Kalender Mi 04.11.2026 14:00.
 * Aktueller Look wie S02 (src/projekte/metafelder): helle Karten unter dem Kopf mit Pill-Untertiteln (karten-aufbau.md),
 * Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlagen P04 src/projekte/pagebuilder und S02): jede Karte zeigt
 * den Gedanken als Bild (Produkte von Hand in die Kollektion ziehen, Demo-Shop mit Kollektion "Schwarze T-Shirts", jedes
 * neue Produkt von Hand, manuell gegen automatisiert, Weg Produkte → Kollektionen → neue Kollektion, Kollektionstyp
 * Manuell → Intelligent, Trichter mit zwei Bedingungen, alle gegen irgendeine, Simulation der Kollektion, einheitliche
 * gegen uneinheitliche Tags, Lupe über der Kollektion, neuer Artikel landet von selbst in der Kollektion, Folgen-Plus),
 * höchstens 1-3 Wörter, ein handschriftliches Akzentwort. Beispielwerte als BEISPIEL bzw. SIMULATION gekennzeichnet.
 * Hook-Titel (Marke Shopify im ersten Satz, darum mit Hook; Design "verlauf", easyJet-Stil): "SHOPIFY-KOLLEKTIONEN" /
 * "AUTOMATISCH STATT VON HAND", an der Kartenposition unter dem Kopf, bis vor die erste Karte (3,47 s). Keine
 * Reihen-Einblendung (Briefing: "Shopify in 30 Sekunden" ist nur die Serien-ID), keine Folgennummer.
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter): scale 1.38, hoch 703, x 61 (Take: Haar
 * Median y 738, Augen Median x 584 / y 900, über alle Schnittstücke alle 0,5 s gemessen) → Kopfoberkante ~315, Augen
 * ~539, mittig; unten endet das Bild bei Take y ~1901 (kein Rand). Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen,
 * kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 895), Karte (ab y 950, bis 1310), alles über der
 * Instagram-Zone (ab y 1500).
 * Marken-Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund"): an den Stellen über Kollektionen, intelligente
 * Kollektionen, Schritte, Kollektionstyp, Bedingungen, alle/irgendeine, Tags, Hinweis zu Tags, Produkte nach dem
 * Speichern und Zeitersparnis steht er freigestellt vor echten Seiten des Shopify Help Center (HG unten, in den Take
 * gerechnet von npm run portrait --ausschnitt 1.38,703,61 --hintergrund …); Hook, "wichtiges Detail" und der Aufruf am
 * Schluss vor seinem weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/kollektionen-skizzen (public/broll/kollektionen/skizzen.webm), Zeiten und
 * Töne in karten.json.
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
export const meta = { id: "Kollektionen", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 584, y 900 → im Bild x 540, y 539; Haar ~738 → 315; Bildunterkante = Take y 1901 */
const BILD = { scale: 1.38, hoch: 703, x: 61 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 539;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/kollektionen/) */
export const HG: [string, number, number][] = [
  ["hg-beispiele", 10.1, 15.13], // "Denn stell dir vor, du verkaufst … Kleidung … Kollektion für schwarze T-Shirts." (Hilfe-Center "Kollektionen", Beispiele)
  ["hg-manuell", 22.57, 28.5], // "Wenn du … alle Produkte manuell hinzufügst …" ("Kollektionen", automatisch / manuell hinzufügen)
  ["hg-intelligent", 73.92, 78.98], // "Und in Shopify kannst du … eine automatisierte Kollektion …" ("Intelligente Kollektion erstellen")
  ["hg-schritte", 80.8, 87.09], // "Dafür gehst du … zu Produkte, dann zu Kollektionen …" (Schritte: Produkte > Kollektionen)
  ["hg-typ", 87.09, 91.5], // "Dort wählst du … die automatische Zuordnung …" (Kollektionstyp Intelligent, allen / beliebigen Bedingung)
  ["hg-bedingungen", 94.33, 100.61], // "Zum Beispiel … Produkttyp ist T-Shirt und Produkt-Tag ist dann schwarz." ("Bedingungen für Kollektionen verstehen")
  ["hg-mehrere", 112.57, 117.83], // "Denn du kannst … einstellen, ob alle Bedingungen …" ("Verwendung mehrerer Auswahlbedingungen")
  ["hg-mehrere", 118.92, 121.75], // "Das geht mit der Und-oder-Bedingung."
  ["hg-irgendeine", 121.75, 129.53], // "Wenn du aber … irgendeine auswählst …" ("Wenn du Irgendeine Bedingung muss erfüllt sein …")
  ["hg-alle", 131.44, 134.13], // "Und das willst du aber natürlich nicht, oder?"
  ["hg-alle", 133.68, 138.18], // "Mit allen Bedingungen wird die Auswahl … genauer." ("Wenn du Alle Bedingungen müssen erfüllt sein …")
  ["hg-tags", 138.18, 142.29], // "Mein zweiter Tipp … einheitlichen Tag-Struktur." ("Bedingungen basierend auf Produkt-Tags festlegen")
  ["hg-tags", 149.0, 151.79], // "Denn wenn du … bei einem Produkt schwarz hinschreibst …"
  ["hg-hinweis", 151.79, 159.97], // "… Black … black-shirt … unzuverlässig." (Hinweis: Sonderzeichen in Tags)
  ["hg-speichern", 181.09, 189.62], // "… kontrolliere … die Produkte der Kollektion …" ("Klicke auf Speichern. Im angezeigten Abschnitt Produkte …")
  ["hg-zeit", 204.9, 211.65], // "Denn dann musst du … neue Artikel nur noch sauber einpflegen …" ("… ohne manuelle Verwaltung automatisch … Zeit spart")
];

/** Sanfter Grade plus 5 % dunkler: die Aufnahme ist etwas hell (Gesicht im Take 0,579, mit dem sanften Grade im
 *  fertigen Video ~0,59 statt ~0,55-0,57, seine Vorgabe 2026-10-18 "zu hell"; npm run farbe hebt höchstens ±4 %). Wie bei
 *  S02 im Grade ausgeglichen; S02 brauchte 0,88 (Take 0,636), hier reicht 0,95. */
const GRADE = `brightness(0.95) ${STIL.gradeSanft}`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis kurz vor "Hand" (3,63 s), ganz weg bei ~3,45 s; die erste Karte kommt bei 3,47 s */
const HOOK_ENDE = fs(3.25);

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

      {/* Hook-Titel (Marke Shopify), easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~950), wie Karte und Pille um
          x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 698px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SHOPIFY-KOLLEKTIONEN" line2="AUTOMATISCH STATT VON HAND" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/kollektionen-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/kollektionen/skizzen.webm")}
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
