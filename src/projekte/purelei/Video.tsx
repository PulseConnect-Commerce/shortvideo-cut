/**
 * Format HERO, Serie M "Marken-Story", M02 · PURELEI. Kalender: 📣 Di 15.12.2026 19:00; Regie (Pauls Vorgabe 30.10.: mindestens zwei
 * Videos pro Tag, neue Schnitte in die Lücken): vorgezogen auf So 01.11.2026 19:00.
 * Look wie die M-Folgen M06 FIVE und M07 Gymshark mit Pauls neueren Regeln: er steht oben (Kopfoberkante ~315, Vorgabe 25.10.),
 * Pill-Untertitel (aktives Wort #00E090) und helle Karten darunter; Marken-Shops als Hintergrund (karten-aufbau.md, 25.10.): an
 * zwölf Stellen steht er freigestellt vor echten Seiten von purelei.com (HG unten, in den Take gerechnet von
 * npm run portrait -- purelei --ausschnitt 1.45,500,36 --hintergrund …), dazwischen vor seinem weichgezeichneten Zimmer.
 * Quelle groß, er klein in der Ecke (Regel 28.10.): drei Fenster mit dem Shopify-Beitrag aus dem Briefing (10. Feb. 2021).
 * Editorial-Kennzahlen "2017" und "600.000+" (Stand 2021, historisch) auf der Karte, Erklär-Bilder, drei nummerierte Learnings,
 * am Ende die große mittige Folgen-Karte mit dem TikTok-Plus. Das originale PURELEI-Logo (Seitenkopf purelei.com, unverändert)
 * kommt auf "PURELEI" (5,2 s) in der Karte.
 * Hook-Titel (Markenname, karten-hell.md): "PURELEI" / "VOM SCHMUCK ZUR COMMUNITY", Design "verlauf", an der Kartenposition unter
 * dem Gesicht, weg vor der ersten Karte.
 * Bild (Pauls Regeln 25.10. Kopf oben, 27.10. ab Hüfthöhe): sitzend; im Take an 113 Zeitpunkten (alle 1 s über alle Stücke)
 * gemessen: Augen Median x 565 / y 782, Kinn (Gesichtsbox unten) Median 1006 (p95 1080), Kopfoberkante ~565 (min ~540);
 * Hosenbund/Jeans frühestens bei Take-y ~1730 → scale 1.45, hoch 500, x 36: Kopfoberkante ~320, Augen ~634, Kinn ~959 (p95
 * ~1066), waagrecht mittig; der untere Bildrand zeigt Take-y 1669 (mit dem Zoom-in weniger), die Hüftlinie liegt also mindestens
 * ~60 Take-px (~88 px im Bild) unter dem Rand. Von oben: Gesicht, Kinn, Pille (y 1088), Karte (y 1140-1490), Instagram-Zone ab 1500.
 * Farbe: npm run farbe gemessen (Kanäle 0,9965/0,9982/1,0058, Gamma 1/0,962, Vibrance 0,074) und in einem Durchgang mit dem
 * Schwärzen ungenutzter Take-Teile auf den Take gelegt; im Bild der sanfte Grade.
 * Karten als transparentes WebM aus hyperframes/purelei-skizzen (public/broll/purelei/skizzen.webm), Zeiten und Töne in karten.json.
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
export const meta = { id: "Purelei", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 565, y 782 → im Bild x 540, y 634; Kopf ~565 → ~320; Bildunterkante = Take-y 1669 (Hüftlinie im
 * Take frühestens ~1730: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.45, hoch: 500, x: 36 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 634;

/** Sanfter Grade (Regel 5b, freigegebener Look) plus brightness(0.89): in der Vorschau lag das Gesicht nach Farbe und Porträt
 * bei 0,634 (gemessen wie npm run pruefen, 24 Zeitpunkte); wie bei M07 Gymshark (0,61 → brightness 0.93) im Grade ausgeglichen,
 * Ziel ~0,56 */
const GRADE = `${STIL.gradeSanft} brightness(0.89)`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "Community?" (4,57-5,0 s), ganz weg bei ~5,0 s; die erste Karte (Logo) kommt auf "PURELEI" (5,15 s) */
const HOOK_ENDE = fs(4.8);

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/purelei/), alle
 * am 31.10.2026 ohne Login aufgenommen (QUELLE.txt); Wechsel in Sprechpausen bzw. an Schnitten */
export const HG: [string, number, number][] = [
  ["hg-lei", 1.6, 7.8], // Hook: "Über die LEI", Hand mit Charm-Armreif (große Schmuckaufnahme)
  ["hg-sand", 10.4, 13.37], // "PURELEI ist dafür ... ein super Beispiel." (Über uns: PURELEI in den Sand geschrieben)
  ["hg-hawaii", 28.885, 33.785], // ab dem Ausgang der Quelle (17,0 s): "Lebensgefühl ... Onlineshop und die Marke." (Über die LEI: Blüten und Armreif, Abschnitt Hawaii)
  ["hg-aloha", 33.785, 37.685], // "Aloha, Lifestyle ..." (Über uns: "ALOHA! Schön, dass du da bist.")
  ["hg-grid", 37.685, 44.385], // "2017 ... nicht einfach nur Schmuckbilder gepostet" (LEI Collection, Produktkacheln)
  ["hg-kette", 44.385, 47.9], // "... gehofft, dass jemand diese bestellt," (Produktseite LEI Charm Kette)
  ["hg-community", 57.995, 62.5], // ab dem Ausgang der Quelle (39,1 s): "Menschen eingebunden, die zur Markenwelt passen." (Blog: "Mit unserer Community kreiert")
  ["hg-ketten", 101.545, 106.145], // "bei Schmuck ... Produktkategorie" (Kategorie Ketten)
  ["hg-markenwelt", 120.455, 125.255], // Learning 1 "Markenwelt ... ohne Logo erkennbar" (Über uns: Ringe und Kette auf Holz)
  ["hg-goetze", 130.055, 134.855], // Learning 2 "Creator" (Festive Collection by Ann-Kathrin Götze)
  ["hg-karo", 134.855, 140.1], // Learning 2 "Zielgruppe ... Inhalte ... passen" (Adventskalender x @karokauer)
  ["hg-club", 144.995, 150.3], // Learning 3 "Menschen in den Shop ... langfristige Kundenbeziehung" (Mahina Club, Schmuck-Abo)
  ["hg-hawaii", 158.8, 163.6], // "Menschen etwas ganz Bestimmtes damit verbinden." (Über die LEI, wie oben)
];

/** Quelle groß, er als Bubble (Sekunden im Schnitt): der Shopify-Beitrag aus dem Briefing ("Von Hawaii nach Mannheim: Wie
 * PURELEI Social Commerce und Influencer-Marketing erfolgreich umsetzt", Caroline Dohrmann, 10. Feb. 2021), Handy-Ansicht 432 css-px
 * @2,5, nur zugeschnitten (hyperframes/purelei-hg/quelle.py), die Sätze grün markiert. Breite 0,84 × 1080 ab x 20, damit der Text
 * links der TikTok-Leiste (ab x 900) bleibt. fokus: die markierten Sätze auf dem Schirm, der Rest unter hellem Schleier */
const SHOPIFY = "Shopify-Blog · 10. Feb. 2021";
const QUELLEN: QuelleFenster[] = [
  // "Denn die Gründerin hat sich nämlich zum Beispiel damals von Hawaii inspirieren lassen." → "Nachdem Alisa Maria Jahnke 2013
  // ein Auslandssemester auf Hawaii absolviert hatte, wollte die paradiesische Insel sie nicht mehr loslassen."
  { von: 13.98, bis: 17.5, bild: "broll/purelei/quelle-hawaii.jpg", y: 360, x: 20, zoom: 0.84, fokus: [[436, 582]], label: SHOPIFY },
  // "sondern sie hat tatsächlich damals früh über Instagram und auch Influencer kommuniziert" → "Wir haben von Anfang an sehr viel
  // Wert auf Influencer-Marketing gelegt, was für die Marke PURELEI tatsächlich super gut funktioniert hat."
  { von: 35.46, bis: 39.6, bild: "broll/purelei/quelle-influencer.jpg", y: 350, x: 20, zoom: 0.84, fokus: [[350, 556], [740, 888]], label: SHOPIFY },
  // "Laut einem Shopify-Beitrag hatte PURELEI 2021 bereits mehr als 600.000 Follower" → Titel, Teaser "... dem mittlerweile mehr
  // als 600.000 Menschen auf Instagram folgen." und "10. Feb. 2021" (danach die Kennzahl mit "2021 · historische Zahl")
  { von: 43.03, bis: 46.3, bild: "broll/purelei/quelle-600k.jpg", y: 290, x: 20, zoom: 0.84, fokus: [[290, 1002], [1042, 1120]] },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1140) */
const PILLE = { x: 490, y: 1088 };

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

      {/* Hook-Titel (Marke PURELEI in Zeile 1, Design verlauf wie easyJet), an der Kartenposition unter Kopf und Pille (oben
          ~1140), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 888px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="PURELEI" line2="VOM SCHMUCK ZUR COMMUNITY" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Kennzahlen, Erklär-Bilder und Folgen-Karte aus HyperFrames (hyperframes/purelei-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/purelei/skizzen.webm")}
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
