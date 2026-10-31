/**
 * Format HERO, Serie M "Marken-Story", M10 · SI BEAU. Kalender: 📣 Di 05.01.2027 19:00; Regie (Pauls Vorgabe 30.10.: mindestens zwei
 * Videos pro Tag, neue Schnitte in die Lücken): vorgezogen auf Do 05.11.2026 19:00.
 * Look wie M08 Huel, M09 ooia und M02 PURELEI (src/projekte/huel, ooia, purelei) mit Pauls neueren Regeln: er steht oben (Kopfoberkante
 * ~320, Vorgabe 25.10.), Pill-Untertitel (aktives Wort #00E090) und helle Karten darunter.
 * Marken-Hintergründe (karten-aufbau.md, 25.10.): die offiziellen Seiten von SI BEAU sind nicht mehr erreichbar (si-beau.com ohne
 * Verbindung, sibeau-women.com abgelaufen und geparkt), darum steht er an sechs Stellen freigestellt vor echten Markenfotos (Produkte,
 * Kollektion; Pressefoto der Kultur- und Kreativpiloten und Bilder aus dem Shopify-Beitrag, © Uwe Duettmann, ohne Gesichter
 * beschnitten; HG unten, in den Take gerechnet von npm run portrait -- sibeau --ausschnitt 1.62,814,44 --hintergrund …), dazwischen
 * vor seinem weichgezeichneten Zimmer.
 * Quelle groß, er klein in der Ecke (Regel 28.10.): der Shopify-Beitrag aus dem Briefing (6. Jan. 2020): Überschrift und Datum, dann die
 * markierten Sätze zur Fokusgruppe (etwa 500 Frauen) und zur Shopify-Seite als Landingpage.
 * Erklär-Bilder (Kennzahl ≈500 mit Quelle und Jahr, Marke, Waage professionell/bequem, eigener Geschmack vs. Zielgruppe,
 * Fragebogen/Schnitte/Farben und Vorlaunch-Seite als gekennzeichnete Schemata, "andersherum", Pfeil verfehlt die Zielgruppe), die
 * drei Händler-Learnings als Leiste "Gespräche" / "Probleme" / "Testen" (mit eigener Beispiel-Landingpage), KI-Karte, echte
 * Gespräche, Erkenntnis in drei Stufen, am Ende die große mittige Folgen-Karte mit dem TikTok-Plus, getippt auf "Plus".
 * Kein Logo: ein originales SI-BEAU-Logo aus offizieller Quelle war nicht zu bekommen (Seiten offline); der Name steht als Text.
 * Hook-Titel (Markenname, starke Zahl; karten-hell.md): "SI BEAU" / "500 FRAUEN VOR DEM START" (Bildplan 0-6 s), Design "verlauf", an
 * der Kartenposition unter dem Gesicht, mit Quellenzeile darunter (skizzen.webm), weg vor der ersten Karte.
 * Bild (Pauls Regeln 25.10. Kopf oben, 27.10. ab Hüfthöhe): sitzend; im Take an 59 Zeitpunkten gemessen: Augen Median x 567 / y 912,
 * Kopfoberkante ~700; hellblaue Jeans in den genutzten Stücken frühestens bei Take-y ~1730 (bei 388-395 s, Hände im Schoß) →
 * scale 1.62, hoch 814, x 44: Kopfoberkante ~320, Augen ~663, waagrecht mittig; der untere Bildrand zeigt Take-y 1688 (mit dem
 * Zoom-in weniger), die Hüftlinie liegt also mindestens ~40 Take-px (~65 px im Bild) unter dem Rand. Von oben: Gesicht, Kinn, Pille
 * (y 1110), Karte (y 1158-1494), Instagram-Zone ab 1500.
 * Farbe: wie npm run farbe gemessen, aber nur am genutzten zweiten Durchgang (Kanäle 1,0124/0,9839/1,0045, Gamma 1,027, keine
 * Vibrance) und in einem Durchgang mit leichtem Nachschärfen (Regel 0c) und dem Schwärzen ungenutzter Take-Teile auf den Take gelegt;
 * im Bild der sanfte Grade.
 * Karten als transparentes WebM aus hyperframes/sibeau-skizzen (public/broll/sibeau/skizzen.webm), Zeiten und Töne in karten.json.
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
export const meta = { id: "SiBeau", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 567, y 912 → im Bild x 540, y 663; Kopf ~700 → ~320; Bildunterkante = Take-y 1688 (Jeans im Take
 * frühestens ~1730: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.62, hoch: 814, x: 44 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 663;

/** Sanfter Grade (Regel 5b, freigegebener Look) plus brightness(0.955): in der ersten Vorschau lag das Gesicht nach Farbe und
 * Porträt bei 0,586 (gemessen wie npm run pruefen, 24 Zeitpunkte); wie bei M08/M09 im Grade ausgeglichen, Ziel ~0,56 */
const GRADE = `${STIL.gradeSanft} brightness(0.955)`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "sollen." (5,0-5,3 s), ganz weg bei ~5,27 s; die erste Karte (Kennzahl) kommt auf "Und" (5,37 s) */
const HOOK_ENDE = fs(5.07);

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/sibeau/), Bilder am
 * 31.10.2026 geladen (QUELLE.txt); Wechsel an Satzgrenzen oder in Sprechpausen */
export const HG: [string, number, number][] = [
  ["hg-produkt", 237.6, 243.575], // Hook: Pressefoto "Produkt" (Kultur- und Kreativpiloten), dunkler Anzug, gestreifter Stuhl
  ["hg-studio", 243.575, 248.325], // "Und erst danach ... die Produkte dazu zu entwickeln." (Studio, Anzüge, Dampfglätter; Shopify-Beitrag)
  ["hg-blazer", 248.325, 251.975], // "Die Marke nennt sich SI BEAU. Vielleicht hast du sie ja schon einmal gehört." (Anzug Debeauvoir)
  ["hg-detail", 251.975, 258.625], // "Die Gründerinnen wollten hier Businesskleidung ... bequem ist." (Pressefoto, Hosenbein, Schuh, Stuhl)
  ["hg-kollektion", 274.505, 279.7], // "Und diese Frauen konnten ... bei Schnitten und auch Farben mitreden." (Titelbild: Jumpsuits schwarz und rot)
  ["hg-produkt", 388.0, 396.05], // "Das war für mich auch hier tatsächlich die wichtigste Erkenntnis ..." (Pressefoto "Produkt")
];

/** Quelle groß, er als Bubble (Sekunden im Schnitt): der Shopify-Beitrag aus dem Briefing (https://www.shopify.com/de/blog/
 * kultur-und-kreativpilotenpreis-si-beau, 6. Jan. 2020), Handy-Ansicht 432 css-px @2,5, nur zugeschnitten (hyperframes/sibeau-hg/
 * quelle.py), Sätze grün markiert, dünne Linie = ausgelassene Stelle. Breite 0,8 bzw. 0,78 × 1080 ab x 20, damit der Text links der
 * TikTok-Leiste (ab x 900) bleibt und über der Bubble (ab y 1010) endet. fokus: die markierten Stellen auf dem Schirm, der Rest unter
 * hellem Schleier. Die beiden ersten Fenster stoßen aneinander (er bleibt klein, nur das Bild wechselt). */
const BEITRAG = "Shopify-Blog · 6. Jan. 2020";
const QUELLEN: QuelleFenster[] = [
  // "Laut einem historischen Shopify-Interview gab es hierzu tatsächlich ..." → Überschrift und Datum des Beitrags
  { von: 30.4, bis: 33.45, bild: "broll/sibeau/quelle-kopf.jpg", y: 345, x: 20, zoom: 0.8, label: BEITRAG },
  // "... eine digitale Fokusgruppe mit ungefähr 500 Frauen." → "Die digitale Fokusgruppe aus etwa 500 Frauen entstand kurz nach der Gründung."
  {
    von: 33.45,
    bis: 36.4,
    bild: "broll/sibeau/quelle-fokusgruppe.jpg",
    y: 335,
    x: 20,
    zoom: 0.78,
    fokus: [[402, 500]],
    label: BEITRAG,
  },
  // "Und die Marke nutzte hier tatsächlich ihre eigene Shopify-Seite bereits dafür, um ..." → "Unsere Shopify-Seite haben wir während
  // dieser Zeit als Landingpage genutzt, um weitere Interessentinnen zu sammeln."
  {
    von: 41.0,
    bis: 45.0,
    bild: "broll/sibeau/quelle-fokusgruppe.jpg",
    y: 335,
    x: 20,
    zoom: 0.78,
    fokus: [[534, 675]],
    label: BEITRAG,
  },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1158) */
const PILLE = { x: 490, y: 1110 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false; skizzen?: boolean };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({
  voice = true,
  sfx = true,
  raster = false,
  untertitel = true,
  musik = "ruhig.mp3",
  skizzen = true,
}) => {
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

      {/* Hook-Titel (Marke SI BEAU in Zeile 1, Design verlauf wie easyJet), an der Kartenposition unter Kopf und Pille (oben
          ~1150), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 906px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SI BEAU" line2="500 FRAUEN VOR DEM START" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder, Learnings, Kennzahl, Quellenzeile des Hooks und Folgen-Karte aus HyperFrames (hyperframes/sibeau-skizzen),
          helle Karten unter dem Kopf */}
      {skizzen && (
        <Sequence from={0} durationInFrames={C.DURATION} layout="none">
          <OffthreadVideo
            src={staticFile("broll/sibeau/skizzen.webm")}
            transparent
            muted
            style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: kartenSicht(q.p) }}
          />
        </Sequence>
      )}
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={Math.round(t.at * C.FPS)} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
