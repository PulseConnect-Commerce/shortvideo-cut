/**
 * Format HERO, Serie M "Marken-Story", M08 · Huel. Kalender: 📣 Di 22.12.2026 19:00; Regie (Pauls Vorgabe 30.10.: mindestens zwei
 * Videos pro Tag, neue Schnitte in die Lücken): vorgezogen auf Mi 04.11.2026 19:00.
 * Look wie M02 PURELEI und M09 ooia (src/projekte/purelei, src/projekte/ooia) mit Pauls neueren Regeln: er steht oben
 * (Kopfoberkante ~320, Vorgabe 25.10.), Pill-Untertitel (aktives Wort #00E090) und helle Karten darunter; Marken-Shops als
 * Hintergrund (karten-aufbau.md, 25.10.): an elf Stellen steht er freigestellt vor echten Seiten von de.huel.com (deutsche Seite)
 * und der offiziellen Karriereseite careers.huel.com (HG unten, in den Take gerechnet von npm run portrait -- huel --ausschnitt
 * 1.55,685,62 --hintergrund …), dazwischen vor seinem weichgezeichneten Zimmer.
 * Quelle groß, er klein in der Ecke (Regel 28.10.): ein Fenster mit der Shopify-Fallstudie aus dem Briefing (Überschrift "… Huel
 * onboards staff 9X faster" und zwei Punkte der Liste markiert).
 * Erklär-Bilder (Marke, hinter dem Shop, international, Märkte/Zugänge/Team, Kennzahl 9×, Einordnung, Eisberg), die drei
 * Händler-Learnings als Checkliste "Dokumentation" / "Rechte" / "Automation", KI-Karte, sensible Berechtigungen, Learning, am Ende
 * die große mittige Folgen-Karte mit dem TikTok-Plus, getippt auf "Plus". Das originale Huel-Logo (Seitenkopf de.huel.com,
 * unverändert) kommt auf "Und die Marke nennt sich Huel" (7,3 s) in der Karte.
 * Hook-Titel (Markenname, starke Zahl; karten-hell.md): "HUEL" / "9× SCHNELLER IM ONBOARDING", Design "verlauf", an der
 * Kartenposition unter dem Gesicht, mit Quellenzeile darunter (skizzen.webm), weg vor der ersten Karte.
 * Bild (Pauls Regeln 25.10. Kopf oben, 27.10. ab Hüfthöhe): sitzend; im Take an 52 Zeitpunkten gemessen: Augen Median x 580 /
 * y 852, Kopfoberkante ~645; hellblaue Jeans in den genutzten Stücken frühestens bei Take-y 1753 (228 Bilder alle 0,5 s) →
 * scale 1.55, hoch 685, x 62: Kopfoberkante ~327 (Median über den Schnitt), Augen ~636, Kinn ~1019, waagrecht mittig; der untere
 * Bildrand zeigt Take-y 1681 (mit dem Zoom-in weniger), die Hüftlinie liegt also mindestens ~72 Take-px (~110 px im Bild) unter dem
 * Rand. Von oben: Gesicht, Kinn, Pille (y 1110), Karte (y 1158-1494), Instagram-Zone ab 1500.
 * Farbe: npm run farbe gemessen (Kanäle 0,9869/0,9991/1,0156, Gamma 1/1,042, Vibrance 0,08) und in einem Durchgang mit leichtem
 * Nachschärfen (Regel 0c, Gesichtsdetail halb so hoch wie bei M09) und dem Schwärzen ungenutzter Take-Teile auf den Take gelegt;
 * im Bild der sanfte Grade.
 * Karten als transparentes WebM aus hyperframes/huel-skizzen (public/broll/huel/skizzen.webm), Zeiten und Töne in karten.json.
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
export const meta = { id: "Huel", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 580, y 852 → im Bild x 540, y 636; Kopf ~645 → ~315; Bildunterkante = Take-y 1681 (Jeans im Take
 * frühestens ~1753: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.55, hoch: 685, x: 62 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 636;

/** Sanfter Grade (Regel 5b, freigegebener Look) plus brightness(0.965): in der ersten Vorschau lag das Gesicht nach Farbe und
 * Porträt bei 0,58 (gemessen wie npm run pruefen, 24 Zeitpunkte); wie bei M02/M09 im Grade ausgeglichen, Ziel ~0,56 */
const GRADE = `${STIL.gradeSanft} brightness(0.965)`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "beschleunigt." (6,71-7,2 s), ganz weg bei ~7,2 s; die erste Karte (Logo) kommt auf "Und" (7,25 s) */
const HOOK_ENDE = fs(7.0);

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/huel/), alle am
 * 31.10.2026 ohne Login aufgenommen (QUELLE.txt); Wechsel an Satzgrenzen, in Sprechpausen oder an Schnitten */
export const HG: [string, number, number][] = [
  ["hg-produkte", 1.195, 8.955], // Hook: Startseite de.huel.com, Produkte (Beutel, Flaschen) und Kategorien
  ["hg-bestseller", 26.565, 30.45], // "Und die Marke nennt sich Huel. Die hast du bestimmt schon auch einmal gehört." (Huel Bestseller)
  ["hg-sortiment", 30.45, 34.655], // "Das sind unkomplizierte Mahlzeiten ..." (Alle Produkte)
  ["hg-teams", 39.845, 44.915], // "... hinter dem Online-Shop." (Karriereseite "Our Workspaces": London, Milton Keynes Factory, Global HQ)
  ["hg-laender", 49.595, 54.795], // "sobald eine Marke international verkauft ..." (Länderauswahl "Alle Läden")
  ["hg-standorte", 97.135, 110.3], // "verschiedene Märkte, mehrere Shopzugänge und Mitarbeiter ..." und Quelle (Karte der Standorte, NYC, Germany, London)
  ["hg-recruiting", 110.3, 115.1], // "Und das Onboarding neuer Mitarbeitender ..." (Karriereseite: offene Stellen mit Produktfotos)
  ["hg-neu", 170.125, 179.755], // "... über Ads ... Produkte und Umsatzrekorde." (Alle Produkte: Reihe mit NEU)
  ["hg-logistik", 183.325, 189.5], // "Aber oft entscheiden ... die Prozesse im Hintergrund ..." (Our Teams: Logistics, Manufacturing, Product Supply)
  ["hg-marke", 286.685, 294.1], // "Aber mein wichtigstes Learning aus dieser E-Commerce-Marke Huel ..." (Über uns: Produkte; Bestseller Bundle)
  ["hg-backoffice", 294.1, 298.0], // "meistens eben im Backoffice ..." (Karriereseite "Our Workspaces": Büro mit Huel-Logo)
];

/** Quelle groß, er als Bubble (Sekunden im Schnitt): die Shopify-Fallstudie aus dem Briefing ("With the new Shopify Plus Admin, Huel
 * onboards staff 9X faster", https://www.shopify.com/de/case-studies/huel; ohne Datum auf der Seite, Zahlen im Text von 2020),
 * Handy-Ansicht 432 css-px @2,5, nur zugeschnitten (hyperframes/huel-hg/quelle.py), Überschrift und zwei Punkte der Liste grün
 * markiert, dünne Linie = ausgelassene Stelle. Breite 0,72 × 1080 ab x 20, damit der Text links der TikTok-Leiste (ab x 900) bleibt
 * und über der Bubble (ab y 1010) endet. fokus: die markierten Stellen auf dem Schirm, der Rest unter hellem Schleier */
const QUELLEN: QuelleFenster[] = [
  // "Laut einer Shopify-Plus-Fallstudie hat aber Huel die Verwaltung dieser Zugänge tatsächlich stark vereinfacht."
  {
    von: 28.5,
    bis: 34.4,
    bild: "broll/huel/quelle-fallstudie.jpg",
    y: 345,
    x: 20,
    zoom: 0.72,
    fokus: [
      [358, 594],
      [668, 778],
      [828, 990],
    ],
    label: "Shopify-Fallstudie · Stand 2020",
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

      {/* Hook-Titel (Marke Huel in Zeile 1, Design verlauf wie easyJet), an der Kartenposition unter Kopf und Pille (oben
          ~1150), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 906px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="HUEL" line2="9× SCHNELLER IM ONBOARDING" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder, Checkliste, Kennzahl, Quellenzeile des Hooks und Folgen-Karte aus HyperFrames (hyperframes/huel-skizzen),
          helle Karten unter dem Kopf */}
      {skizzen && (
        <Sequence from={0} durationInFrames={C.DURATION} layout="none">
          <OffthreadVideo
            src={staticFile("broll/huel/skizzen.webm")}
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
