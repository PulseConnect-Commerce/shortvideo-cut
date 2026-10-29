/**
 * Format FACE, Serie S (ID "Shopify in 30 Sekunden", keine Serien-Erwähnung im Video), S05 · Produktbilder und Alt-Texte mit KI.
 * Veröffentlichung laut Kalender Do 05.11.2026 14:00.
 * Aktueller Look wie S02/S03 (src/projekte/metafelder, src/projekte/kollektionen): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md, aktives Wort #00E090), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlage P04
 * src/projekte/pagebuilder): Stoppuhr "keine Zeit", Demo-Shop mit uneinheitlichen Flaschenbildern ("Viele Produkte = viel
 * Bildpflege"), KI nimmt Arbeit ab, unruhiger Hintergrund, Vorher/Nachher einfarbig, einheitlich ohne Photoshop/Canva, leeres
 * Alt-Text-Feld, Bild in Worten, Suchmaschine "kann helfen", KI-Vorschlag übernehmen/bearbeiten, schlechter gegen guter Alt-Text,
 * Material?/Farbe/Eigenschaft prüfen, KI-Bild mit erfundenem Detail, wichtigste Seiten zuerst, Dreischritt "Bilder
 * vereinheitlichen → Alt-Text prüfen → erst dann skalieren" bis zum Schluss (mit Bordmitteln und Folgen-Plus). Die Flaschen sind
 * gezeichnete Beispiele (DEMO/BEISPIEL/SCHEMA), keine fingierte Shopify-Oberfläche.
 * Kein Hook-Titel (Briefing: "ohne großes Hook-Overlay").
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, src/lib/quelle-gross.tsx): an vier Stellen (fünf Bilder) stehen die
 * echten Seiten des Shopify Help Center scharf über das ganze Bild (Mediengenerierung im Datei-Editor: Kopf mit Abo-Anforderung und
 * "Farbhintergrund"; Alt-Text zu Medien hinzufügen; Den Medien-Editor verwenden: KI-Vorschläge und "überprüfe ihn"), er läuft als
 * Bubble unten rechts weiter, die Pille links daneben. Keine Quellen-Hintergründe hinter ihm.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): sitzend,
 * scale 1.62, hoch 822, x 73 (Take: Kopfoberkante Median y 702 mit der Porträt-Maske, Augen Median x 585 / y 916, Kinn ~1134,
 * Hüftlinie (oberste Zeile mit Jeans) frühestens y 1722, 5-%-Wert 1757, Median 1816, an 320 Zeitpunkten alle 0,5 s über alle
 * Schnittstücke gemessen) → Kopfoberkante ~315, Augen ~662, Kinn ~1015, mittig; der untere Bildrand zeigt Take-y 1693 (mit dem
 * Zoom-in ~1680), die Hüftlinie liegt also mindestens 29 Take-px (47 px im Bild) unter dem Bildrand. Die Aufnahme war weich
 * (Gesichtsdetail 37 statt ~100), darum vor dem Porträt leicht nachgeschärft (unsharp 0,8, Regel 0c). Sanfter Grade mit Gamma-
 * Anhebung der Mitten (GRADE), ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Keine Sticker-Wörter: der Kopf füllt bei
 * 1,62-facher Vergrößerung die Breite, ein Sticker läge auf dem Gesicht. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1095), Karte (y 1145-1485), alles über
 * der Instagram-Zone (ab y 1500).
 * Karten als transparentes WebM aus hyperframes/alttexte-skizzen (public/broll/alttexte/skizzen.webm), Zeiten und Töne in
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
export const meta = { id: "AltTexte", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 585, y 916 → im Bild x 540, y 662; Kopf Median 702 → 315; Bildunterkante = Take y 1693
 * (Hüftlinie im Take frühestens 1722: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.62, hoch: 822, x: 73 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 662;

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus hyperframes/alttexte-hg/screenshots, Handy-Ansicht
 * 412 css-px, 2,62-fach, am 28.10.2026 aufgenommen, nur zugeschnitten; QUELLE.txt). Breite 0,86 × 1080, damit der Text links
 * der TikTok-Leiste (ab x 900) bleibt. fokus: die markierten Sätze auf dem Schirm, der Rest unter hellem Schleier */
const QUELLEN: QuelleFenster[] = [
  // "Im Shopify Medien-Editor kannst du dann zum Beispiel mit der KI" → Kopf "Mediengenerierung im Datei-Editor", Abo-Anforderung
  { von: 34.2, bis: 36.95, bild: "broll/alttexte/quelle-mediagen-kopf.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[360, 550], [600, 855]],
    label: "Shopify Help Center · Mediengenerierung" },
  // "den Hintergrund verändern oder auch beispielsweise eben direkt durch" → "Farbhintergrund: Ersetze den Hintergrund eines Bildes
  // durch eine einfarbige Fläche …" (danach die Vorher/Nachher-Karte auf "einfarbigen")
  { von: 36.95, bis: 39.95, bild: "broll/alttexte/quelle-mediagen-farbe.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[780, 970]],
    label: "Shopify Help Center · Mediengenerierung" },
  // "Also das ist vor allem für Menschen natürlich wichtig, die jetzt zum Beispiel Screenreader benutzen." → "Alt-Text … beschreibt
  // ein Medienelement", "Er wird auch von unterstützenden Technologien verwendet, um Kund:innen mit Sehbehinderung ein Bild zu beschreiben."
  { von: 59.4, bis: 63.45, bild: "broll/alttexte/quelle-alttext.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[360, 550], [600, 970]],
    label: "Shopify Help Center · Alt-Text" },
  // "Wenn du jetzt ein Produktbild im Medien-Editor öffnest, dann kann Shopify dir tatsächlich …" → "Der Medien-Editor schlägt
  // möglicherweise Alt-Text für Bilder vor … mithilfe von KI generiert … annehmen, bearbeiten oder ersetzen."
  { von: 72.3, bis: 76.2, bild: "broll/alttexte/quelle-editor-vorschlag.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[350, 505], [750, 990]],
    label: "Shopify Help Center · Medien-Editor" },
  // "Wichtig dabei ist es aber, übernimm bitte diese KI-Texte nicht einfach nur blind." → "Wenn ein Alt-Text vorgeschlagen wird,
  // überprüfe ihn und klicke auf Akzeptieren, um ihn zu verwenden, oder bearbeite ihn bei Bedarf."
  { von: 95.3, bis: 99.75, bild: "broll/alttexte/quelle-editor-pruefen.jpg", y: 340, x: 26, zoom: 0.86, fokus: [[795, 992]],
    label: "Shopify Help Center · Medien-Editor" },
];

/** Sanfter Grade (STIL.gradeSanft) plus eine Gamma-Anhebung nur der Mitten: das Gesicht lag nach npm run farbe (höchstens
 * ±4 %) im Bildausschnitt noch bei ~0,47 (gemessen wie npm run pruefen an 13 Zeitpunkten), Ziel ~0,55-0,57 (Regel 5b). Gamma
 * statt brightness(), damit die helle Wand und die Lichter nicht ausfressen und das Bild nicht kontrastreicher wird. */
const GAMMA = 0.8;
const GRADE = `url(#alttexte-gamma) ${STIL.gradeSanft}`;

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
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
        <filter id="alttexte-gamma" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
            <feFuncG type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
            <feFuncB type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
          </feComponentTransfer>
        </filter>
      </svg>
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

      {/* Erklär-Bilder aus HyperFrames (hyperframes/alttexte-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/alttexte/skizzen.webm")}
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
