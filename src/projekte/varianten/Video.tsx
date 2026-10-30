/**
 * Format FACE (Erklärvideo), Serie S (ID "Shopify in 30 Sekunden", keine Serien-Erwähnung im Video), S07 · Produktvarianten
 * strukturieren. Veröffentlichung: Regie zieht es vor auf So 01.11.2026 14:00 (Kalender: Mi 02.12.2026 14:00).
 * Look wie S06 (src/projekte/rabattcodes) und E08 (src/projekte/upselling): helle Karten unter dem Kopf als Erklär-Bilder
 * (karten-aufbau.md "Visuelle Metaphern"), Pill-Untertitel (aktives Wort #00E090), Farbwelt PulseConnect-Verlauf, sanfter Grade,
 * Porträt-Modus, ein ruhiges Zoom-in (3 %), kein Punch-in, Musik ruhig.
 * Hook-Titel (Pauls Regel 30.10.: bei Erklärvideos immer, kurz und prägnant): "PRODUKTVARIANTEN" / "RICHTIG ANLEGEN" im Design
 * "verlauf" an der Kartenposition unter Kopf und Pille, dazu das originale Shopify-Logo (Seitenkopf von shopify.com, unverändert,
 * auf Schwarz wie dort) auf "Shopify"; beides weg, bevor die erste Karte kommt (4,33 s).
 * Originale (Pauls Vorgabe 30.10.): echte Seiten des Shopify Help Center groß über das ganze Bild, er als Bubble unten rechts
 * (src/lib/quelle-gross.tsx), aufgenommen 30.10.2026 ohne Login (hyperframes/varianten-hg/aufnahme.cjs, QUELLE.txt): "Varianten"
 * (Option Größe/Farbe, jede Kombination = Variante; Inventarbestand je Variante), "Bilder zu Produktvarianten hinzufügen",
 * "Varianten hinzufügen" (bis zu 2.048 Varianten, bis zu drei Optionen). Die Hilfe-Seiten enthalten keine Admin-Screenshots,
 * eine Bildschirmaufnahme "S07 · Screen …" liegt nicht im Drive: Produkt, Bestände und Auswahl sind darum gezeichnete,
 * gekennzeichnete Schemata (BEISPIEL/SCHEMA), keine nachgebaute Shopify-Oberfläche.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe): sitzend, im Take an 271
 * Zeitpunkten alle 0,5 s über alle Schnittstücke gemessen (YuNet): Augen Median x 542 / y 800 (p5 751, p95 861), Kinn Median
 * 1028 (p95 1106), Kopfoberkante Median ~562 (min 546); Hüftlinie (Hosenbund/Jeans unter dem Pulli, Standbilder an 84 Stellen)
 * frühestens bei Take-y ~1780 → scale 1.4, hoch 469, x 3: Kopfoberkante ~315, Augen ~651, Kinn ~970 (p95 ~1079), waagrecht
 * mittig; der untere Bildrand zeigt Take-y 1706 (mit dem Zoom-in weniger), die Hüftlinie liegt also mindestens ~74 px (Take)
 * unter dem Rand. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1080), Karte (y 1130-1480), alles über der Instagram-Zone (ab 1500).
 * Farbe und Schärfe: die gemessene Kette von `npm run farbe -- varianten --nur-ansehen` (colorchannelmixer 0.9878/0.9975/1.0162,
 * Gamma 1/1.042, Vibrance 0.043) und eine leichte Unscharfmaske (unsharp 5:5:0.8, Regel 0c: Gesichtsdetail 31 statt ~100) liegen
 * in einem Durchgang mit dem Schwärzen der ungenutzten Take-Teile auf dem Take (Speicher knapp); im Bild der sanfte Grade mit
 * leichter Gamma-Anhebung der Mitten (GRADE).
 * Karten als transparentes WebM aus hyperframes/varianten-skizzen (public/broll/varianten/skizzen.webm), Zeiten und Töne in
 * karten.json.
 */
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
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
export const meta = { id: "Varianten", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 542, y 800 → im Bild x 540, y 651; Kopf ~562 → ~315; Bildunterkante = Take-y 1706 (Hüftlinie im
 * Take frühestens ~1780: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.4, hoch: 469, x: 3 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 651;

/** Sanfter Grade (Regel 5b, freigegebener Look) mit einer leichten Gamma-Anhebung der Mitten: in der ersten Vorschau lag das
 * Gesicht (gemessen wie npm run pruefen) bei 0,508, Ziel ~0,55-0,57. brightness() würde die helle Wand mit anheben, darum eine
 * sanfte Gamma-Kurve in sRGB (SVG-Filter, Exponent GAMMA, wie E08 src/projekte/upselling): Mitten und Gesicht heller, Lichter
 * bleiben fast, wo sie sind (Wand 0,90 → ~0,91). */
const GAMMA = 0.87;
const GRADE = `url(#varianten-gamma) ${STIL.gradeSanft}`;
const GammaFilter: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="varianten-gamma" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
        <feFuncG type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
        <feFuncB type="gamma" amplitude={1} exponent={GAMMA} offset={0} />
      </feComponentTransfer>
    </filter>
  </svg>
);

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel "PRODUKTVARIANTEN / RICHTIG ANLEGEN" bis "Varianten" (3,57 s), ganz weg bei ~4,15 s; die erste Karte kommt auf
 * "eine" (4,33 s) */
const HOOK_ENDE = fs(3.95);
/** Shopify-Logo auf "Shopify" (0,70 s), 2 Frames davor */
const LOGO_AN = C.cue("Shopify");

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus hyperframes/varianten-hg/screenshots, Handy-Ansicht 412 css-px
 * @2,62, nur zugeschnitten, die Sätze grün markiert). Breite 0,84 × 1080 ab x 20, damit der Text links der TikTok-Leiste (ab x 900)
 * bleibt; die markierten Sätze zwischen y ~440 und ~760. fokus: die markierten Sätze auf dem Schirm, der Rest unter hellem Schleier */
const HILFE = "Shopify Help Center";
const QUELLEN: QuelleFenster[] = [
  // "Ich würde dafür normalerweise mein Produkt erstmal mit Optionen, Größen oder Farben anlegen," → "Du kannst Varianten zu einem
  // Produkt hinzufügen, das mehr als eine Option hat (z. B. Größe oder Farbe). Jede Kombination von Optionswerten für ein Produkt
  // kann eine Variante dieses Produkts sein."
  { von: 14.95, bis: 19.55, bild: "broll/varianten/quelle-varianten.jpg", y: 420, x: 20, zoom: 0.84, fokus: [[436, 627]], label: HILFE + " · Varianten" },
  // "Deshalb würde ich hier tatsächlich immer empfehlen, die Bestände pro Variante einzeln zu prüfen." → "Du kannst auch den
  // Inventarbestand für jede Variante auf der Seite Inventar verwalten."
  { von: 44.1, bis: 48.6, bild: "broll/varianten/quelle-inventar.jpg", y: 420, x: 20, zoom: 0.84, fokus: [[465, 611]], label: HILFE + " · Varianten" },
  // "Und ich würde jetzt mal unterschiedliche Variantenbilder hinterlegen," → "Du kannst Bilder zu deinen Produktvarianten
  // hinzufügen, damit deine Kundschaft jede Produktvariante ansehen kann." (stößt an das Fenster davor: er bleibt klein)
  { von: 48.6, bis: 51.45, bild: "broll/varianten/quelle-bilder.jpg", y: 440, x: 20, zoom: 0.84, fokus: [[460, 606]], label: HILFE + " · Variantenbilder" },
  // "Denn drei Optionen mit jeweils vielen Werten" → "Du kannst bis zu 2.048 Varianten für ein Produkt erstellen." und "Jedes
  // Produkt kann bis zu drei Optionen haben." (Faktencheck: Grenzen laut Shopify, keine pauschale Garantie)
  { von: 89.35, bis: 92.85, bild: "broll/varianten/quelle-optionen.jpg", y: 420, x: 20, zoom: 0.84, fokus: [[591, 758]], label: HILFE + " · Varianten hinzufügen" },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1130) */
const PILLE = { x: 490, y: 1080 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

/** Das originale Shopify-Logo (Tasche und Schriftzug, wie im Seitenkopf von shopify.com: weiß auf Schwarz), unter dem Hook-Titel */
const ShopifyLogo: React.FC<{ fr: number }> = ({ fr }) => {
  const an = interpolate(fr, [LOGO_AN, LOGO_AN + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const aus = interpolate(fr, [HOOK_ENDE, HOOK_ENDE + 6], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const o = Math.min(an, aus);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 490 - 150,
        top: 1352,
        width: 300,
        height: 92,
        borderRadius: 24,
        background: "#000000",
        boxShadow: "0 14px 36px rgb(0 0 0 / 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: o,
        transform: `translateY(${(1 - an) * 10}px) scale(${0.96 + 0.04 * an})`,
      }}
    >
      <Img src={staticFile("broll/varianten/shopify-logo.svg")} style={{ height: 62, width: "auto" }} />
    </div>
  );
};

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %), kein Punch-in
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  // Quelle groß: 0 = normal, 1 = Quelle über das ganze Bild, er als Bubble unten rechts
  const q = quelleZustand(QUELLEN, fr, C.FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <GammaFilter />
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

      {/* Hook-Titel (Pauls Regel 30.10.: Erklärvideos immer, kurz und prägnant; Design verlauf wie easyJet), an der Kartenposition
          unter Kopf und Pille (oben ~1130), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab
          x 900) ragt; darunter das originale Shopify-Logo */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 878px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="PRODUKTVARIANTEN" line2="RICHTIG ANLEGEN" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>
      <ShopifyLogo fr={fr} />

      {/* Erklär-Bilder aus HyperFrames (hyperframes/varianten-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/varianten/skizzen.webm")}
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
