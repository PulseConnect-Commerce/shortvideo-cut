/**
 * Format FACE, Serie S (ID "Shopify in 30 Sekunden", keine Serien-Erwähnung im Video), S06 · Rabattcodes richtig konfigurieren.
 * Veröffentlichung laut Kalender Mi 25.11.2026 14:00.
 * Aktueller S-Look wie S05 (src/projekte/alttexte) und S03 (src/projekte/kollektionen): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md, aktives Wort #00E090), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlage P04
 * src/projekte/pagebuilder): Code-Formular "nicht einfach so", Marge behalten, T-Shirt-Shop mit 40-€-Shirt und dezentem
 * Beispiel-Code WELCOME10, "Gilt für" alle Produkte oder ausgewählte Kollektionen, nur T-Shirts statt teurer Jacken,
 * Mindestbestellwert 80 € mit zwei Warenkörben (40 € / 80 €), Kombinationen als Puzzle, Wasserfall 100 € → −20 € → 80 € → −8 €
 * (10 %) → 72 € "28 € weniger" (als BEISPIEL und "nur wenn kombinierbar" gekennzeichnet), Kombinationen prüfen, Nutzungsgrenze und
 * Zeitraum, Testmatrix "muss funktionieren / darf nicht funktionieren", Verkäufe fördern statt Kalkulation kaputt, zum Schluss die
 * Checkliste mit drei Punkten und das Folgen-Plus. Formular, Auswahl und Einstellungen sind vereinfachte Schemata (SCHEMA), keine
 * fingierte Shopify-Oberfläche; es gibt keine Demo-Shop-Aufnahme im Rohmaterial.
 * Kein Hook-Titel (Briefing: "realer Nutzwert statt künstlichem Clickbait").
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, src/lib/quelle-gross.tsx): an fünf Stellen stehen die echten Seiten des
 * Shopify Help Center scharf über das ganze Bild (Betragsrabatte: Schritte "Rabatte" → "Rabatt erstellen"; Rabatte kombinieren:
 * Rabattklassen, Reihenfolge der Rabattanwendung, Arten von Rabattkombinationen, Rabattkombinationen testen), er läuft als Bubble
 * unten rechts weiter, die Pille links daneben. Keine Quellen-Hintergründe hinter ihm.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): sitzend,
 * scale 1.62, hoch 822, x 144 (Take, an 250 Zeitpunkten alle 0,5 s über alle Schnittstücke gemessen: Augen Median x 629 / y 913,
 * Kopfoberkante ~697, Kinn ~1127, Hüftlinie (oberste Zeile mit Jeans) frühestens y 1726, 5-%-Wert 1730, Median 1810) → Kopfoberkante
 * ~307, Augen ~657, Kinn ~1004, mittig; der untere Bildrand zeigt Take-y 1693 (mit dem Zoom-in am Ende ~1670), die Hüftlinie liegt
 * also mindestens 33 Take-px (54 px im Bild) unter dem Bildrand. Die Aufnahme ist etwas weich (Gesichtsdetail 67-71 statt ~117 bei
 * S03), darum vor dem Porträt leicht nachgeschärft (unsharp 0,3, Regel 0c). Sanfter Grade (STIL.gradeSanft), ein ruhiges Zoom-in
 * (3 %) um die Augen, kein Punch-in. Keine Sticker-Wörter: der Kopf füllt bei 1,62-facher Vergrößerung die Breite. Von oben:
 * Gesicht, Kinn, Pill-Untertitel (y 1095), Karte (y 1145-1485), alles über der Instagram-Zone (ab y 1500).
 * Karten als transparentes WebM aus hyperframes/rabattcodes-skizzen (public/broll/rabattcodes/skizzen.webm), Zeiten und Töne in
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
export const meta = { id: "Rabattcodes", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 629, y 913 → im Bild x 540, y 657; Kopf ~697 → 307; Bildunterkante = Take y 1693
 * (Hüftlinie im Take frühestens 1726: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.62, hoch: 822, x: 144 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 657;

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus Playwright-Aufnahmen der Hilfe-Seiten, Handy-Ansicht
 * 412 css-px, 2,62-fach, am 29.10.2026 aufgenommen, nur zugeschnitten; QUELLE.txt). Breite 0,86 × 1080, damit der Text links
 * der TikTok-Leiste (ab x 900) bleibt. fokus: die markierten Sätze auf dem Schirm, der Rest unter hellem Schleier */
const QUELLEN: QuelleFenster[] = [
  // "Gehe dafür zunächst einmal in Shopify zu „Rabatte“, dann erstelle einen Rabattcode" → Schritte "Gehe in deinem
  // Shopify-Adminbereich zu „Rabatte“." / "Klicke auf der Seite „Rabatte“ auf Rabatt erstellen."
  { von: 20.0, bis: 23.95, bild: "broll/rabattcodes/quelle-schritte.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[606, 816]],
    label: "Shopify Help Center · Betragsrabattcode erstellen" },
  // "Darf sich zum Beispiel der Code auch mit anderen Rabatt-, Bestell- oder Versandvarianten kombinieren?" → Rabattklassen
  // "Produktrabatte …", "Bestellrabatte …", "Versandrabatte …"
  { von: 56.13, bis: 60.85, bild: "broll/rabattcodes/quelle-klassen.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[464, 736]],
    label: "Shopify Help Center · Rabatte kombinieren" },
  // "Wenn der zusätzlich ein Bestellrabatt von 10 % zulässig ist," → "Bestellrabatte werden auf die angepasste Zwischensumme nach
  // den Produktrabatten angewendet." (danach rechnet die Karte −8 € von 80 €)
  { von: 67.17, bis: 70.33, bild: "broll/rabattcodes/quelle-reihenfolge.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[654, 802]],
    label: "Shopify Help Center · Rabatte kombinieren" },
  // "Und nicht jede Kombination ist in jedem Shop tatsächlich auch möglich." → "Produktrabatte mit Bestellrabatten (nur für
  // berechtigte Händler:innen verfügbar)"
  { von: 82.47, bis: 85.75, bild: "broll/rabattcodes/quelle-arten.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[766, 870]],
    label: "Shopify Help Center · Rabatte kombinieren" },
  // "Aber bevor du tatsächlich den Code öffentlich teilst, teste erst einmal zwei Warenkörbe." → "Wenn du deine
  // Rabattkombinationen testest, teste gleichzeitig auch alle Rabattbeschränkungen. Versuche beispielsweise, sowohl Produkte
  // hinzuzufügen, für die deine Rabattcodes gelten, als auch Produkte, die vom Rabatt ausgeschlossen sind, …"
  { von: 100.0, bis: 104.45, bild: "broll/rabattcodes/quelle-testen.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[368, 692]],
    label: "Shopify Help Center · Rabattkombinationen testen" },
];

/** Sanfter Grade (Regel 5b, STIL.gradeSanft): die Farbkorrektur von npm run farbe hat das Gesicht schon sanft auf ~0,55 gesetzt */
const GRADE = STIL.gradeSanft;

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1145) */
const PILLE = { x: 490, y: 1095 };

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

      {/* Erklär-Bilder aus HyperFrames (hyperframes/rabattcodes-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/rabattcodes/skizzen.webm")}
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
