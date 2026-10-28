/**
 * Format FACE, A-Reihe "Eine Shopify-App, ein Problem", A05 · MyStoreBuddy. Veröffentlichung laut Kalender Sa 21.11.2026 14:00.
 * Keine Serien-Erwähnung im Video (Briefing "AKTUELLES SKRIPT"), darum anders als A03/A04 keine Reihen-Einblendung.
 * Aktueller Look wie A03 (src/projekte/judgeme) und A04 (src/projekte/klaviyo): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26).
 * Hook: laut Briefing kein großer Hook-Titel, sondern ein kleiner dezenter Schriftzug "MyStoreBuddy" (0-6,9 s, in den Karten).
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): sitzend,
 * scale 1.55, hoch 817, x 26 (Take: Kopfoberkante mit Mütze Median y 730 mit der Porträt-Maske, Augen Median x 557 / y 942,
 * Kinn ~1135, Oberkante der Jeans frühestens y 1812, Median 1845, an 161 Zeitpunkten alle 0,5 s über alle Schnittstücke
 * gemessen) → Kopfoberkante ~315, Augen ~643, Kinn ~942, mittig; der untere Bildrand zeigt Take-y 1766 (mit dem Zoom-in bis
 * ~1752), also liegt die Hüftlinie mindestens 71 px (im Median 123 px) unter dem Bildrand. Ein ruhiges Zoom-in (3 %) um die
 * Augen, kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1050), Karte (y 1100-1484), alles über der
 * Instagram-Zone (ab y 1500).
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, karten-aufbau.md, src/lib/quelle-gross.tsx): an drei Stellen steht
 * die echte Quelle scharf über das ganze Bild (App-Store-Eintrag mit Kopf und Kurzbeschreibung, das offizielle Chat-Bild aus
 * dem App-Store-Eintrag, der Preisbereich mit dem markierten Free-Plan "bis zu 50 Beratungsgespräche im Monat"), er läuft als
 * Bubble unten rechts weiter, die Pille links daneben. Keine Hintergründe hinter ihm (MyStoreBuddy ist keine bekannte Marke,
 * Lesetext gehört seit 2026-10-28 in "Quelle groß"); er steht sonst vor seinem weichgezeichneten Zimmer.
 * Kennzeichnung: Laut App-Store-Eintrag ist der Entwickler "PulseConnect UG"; darum oben links die Kennzeichnung
 * "EIGENWERBUNG" (Briefing: "Bei geschäftlicher Verbindung Werbung/Eigenwerbung kenntlich machen"), abschaltbar mit der Prop
 * kennzeichnung=false (offene Frage an Paul in der Übergabekarte).
 * Karten als transparentes WebM aus hyperframes/mystorebuddy-skizzen (public/broll/mystorebuddy/skizzen.webm), Zeiten und
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
export const meta = { id: "MyStoreBuddy", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 557, y 942 → im Bild x 540, y 643; Kopf Median 730 → 315; Bildunterkante = Take y 1766
 * (Jeans im Take frühestens 1812: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.55, hoch: 817, x: 26 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 643;

/** Sanfter Grade (STIL.gradeSanft) plus brightness: die Aufnahme ist hell (Gesicht im farbkorrigierten Take ~0,68,
 * npm run farbe hebt bzw. senkt höchstens ±4 %), Ziel im fertigen Video 0,55-0,57 (Regel 5b, wie googleads 0,8 und fba 0,82) */
const GRADE = `brightness(0.83) ${STIL.gradeSanft}`;

const QUELLE_APP = "apps.shopify.com/mystorebuddy · 28.10.2026";

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder aus hyperframes/mystorebuddy-hg, nur zugeschnitten, QUELLE.txt).
 * fokus: die Sätze, um die es geht, auf dem Schirm; der Rest unter hellem Schleier */
const QUELLEN: QuelleFenster[] = [
  // "Die App nennt sich MyStoreBuddy." → App-Store-Eintrag oben: Icon, Name, Preisgestaltung, Bewertung, Entwickler
  { von: 6.95, bis: 8.78, bild: "broll/mystorebuddy/quelle-kopf.jpg", y: 150, fokus: [[365, 740]], label: QUELLE_APP },
  // "Und stell dir vor, jemand besucht …" → Kurzbeschreibung und "MyStoreBuddy verkauft wie dein bester Fachverkäufer …"
  { von: 8.78, bis: 10.45, bild: "broll/mystorebuddy/quelle-kurz.jpg", y: 290, fokus: [[332, 682]], label: QUELLE_APP },
  // "Mit MyStoreBuddy kann jetzt aber der User stattdessen direkt im Shop mit einem KI-Berater chatten." → offizielles Bild
  { von: 21.45, bis: 26.4, bild: "broll/mystorebuddy/quelle-chat.jpg", y: 0, label: "Offizielles Bild aus dem App-Store-Eintrag" },
  // "schau mal hier: Du kannst MyStoreBuddy … kostenlos mit bis zu 50 Beratungsgesprächen pro Monat ausprobieren."
  {
    von: 59.25,
    bis: 65.75,
    bild: "broll/mystorebuddy/quelle-preis.jpg",
    y: -20,
    x: -20,
    zoom: 1.25,
    fokus: [[440, 650], [822, 905]],
    label: "apps.shopify.com/mystorebuddy · Preisgestaltung",
  },
];

/** Rahmen um die markierte Zeile "bis zu 50 Beratungsgespräche im Monat" auf "50" (Briefing: gut lesbar markieren) */
const RING = { fenster: 3, x: 124, y: 826, w: 730, h: 76, wort: "50" };

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1100) */
const PILLE = { x: 490, y: 1050 };

type Props = {
  voice?: boolean;
  sfx?: boolean;
  raster?: boolean;
  untertitel?: boolean;
  musik?: string | false;
  kennzeichnung?: boolean;
};

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

/** Rahmen auf "50": zeichnet sich in 8 Frames, fährt mit dem ruhigen Heranfahren der Quelle mit */
const Ring: React.FC<{ fr: number }> = ({ fr }) => {
  const f = QUELLEN[RING.fenster];
  const a = f.von * C.FPS;
  const b = f.bis * C.FPS;
  const at = C.cue(RING.wort);
  if (fr < at || fr >= b) return null;
  const p = interpolate(fr, [at, at + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const aus = interpolate(fr, [b - 0.35 * C.FPS, b - 0.2 * C.FPS], [1, 0], clamp);
  const kb = 1 + 0.02 * interpolate(fr, [a, b], [0, 1], clamp);
  const mitte = (f.fokus![0][0] + f.fokus![f.fokus!.length - 1][1]) / 2;
  return (
    <AbsoluteFill style={{ transform: `scale(${kb})`, transformOrigin: `540px ${mitte}px`, opacity: aus }}>
      <div
        style={{
          position: "absolute",
          left: RING.x,
          top: RING.y,
          width: RING.w,
          height: RING.h,
          borderRadius: 16,
          border: "5px solid #00E090",
          boxShadow: "0 0 0 4px rgb(0 224 144 / 0.18)",
          opacity: p,
          transform: `scale(${1.04 - 0.04 * p})`,
        }}
      />
    </AbsoluteFill>
  );
};

const Inhalt: React.FC<Props> = ({
  voice = true,
  sfx = true,
  raster = false,
  untertitel = true,
  musik = "ruhig.mp3",
  kennzeichnung = true,
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
      {q.f === QUELLEN[RING.fenster] && <Ring fr={fr} />}
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

      {/* Erklär-Bilder aus HyperFrames (hyperframes/mystorebuddy-skizzen), helle Karten unter dem Kopf; der Schriftzug
          "MyStoreBuddy" am Anfang liegt mit darin */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/mystorebuddy/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: kartenSicht(q.p) }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {/* Kennzeichnung oben links neben dem Kopf (in den Quellen-Fenstern steht dort die Quellenzeile) */}
      {kennzeichnung && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 292,
            opacity: kartenSicht(q.p) * interpolate(fr, [0, 4], [0, 1], clamp),
            background: "rgba(10, 12, 14, 0.72)",
            color: "#FFFFFF",
            borderRadius: 12,
            padding: "6px 14px 7px",
            fontFamily: "Geist, system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 23,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          EIGENWERBUNG
        </div>
      )}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
