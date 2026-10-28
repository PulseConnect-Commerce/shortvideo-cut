/**
 * Format HERO, Serie M "Marken-Story", M06 · FIVE Skincare. Veröffentlichung laut Kalender Di 08.12.2026 19:00.
 * Erste Folge im Editorial-Stil (PROBE ab M06, karten-aufbau.md "Marken-Story im Editorial-Stil"): über dem Kopf große,
 * kurze Kennzahlen und Schlagzeilen (Instrument Serif und Geist im Wechsel, Akzent im PulseConnect-Verlauf, ein Strich
 * zeichnet sich auf dem Wort), echte freigestellte Fotos von fiveskincare.de neben dem Kopf (Shea Cream im Hook, Anna Pfeiffer
 * von der Presseseite), darunter die Pill-Untertitel und die Erklär-Bilder bzw. die Quellen-Karte
 * (Shopify-Interview 2020) auf der hellen Karte.
 * Hook-Titel (Marke FIVE, darum mit Hook; Design "verlauf"): "FIVE SKINCARE:" / "MAX. 5 INHALTSSTOFFE PRO PRODUKT"
 * (Briefing 0-5 s "MAX. 5 INHALTSSTOFFE", Fakten-Grenze "pro Produkt"), an der Kartenposition unter dem Kopf.
 * Bild erst ab Hüfthöhe (Pauls Regel 2026-10-27: "erst ab Hüfthöhe bei einer sitzenden Aufnahme erst zu zeigen. Alles
 * unterhalb der Hüfthöhe sollte abgeschnitten werden"): scale 1.54, hoch 505, x -30 (vorher 1.2 / 270 / -26, da sah man
 * unten Schoß und Jeans). Take: Hüftlinie (oberste Zeile mit Jeans, links und rechts neben dem Hemd) frühestens y ~1580,
 * Median ~1620; Kopfoberkante Median y 632 (p5 617), Augen Median x 526 / y 829, Kinn Median ~1028 (p80 1063), an
 * 445 Zeitpunkten alle 0,25 s über alle Stücke gemessen. Der untere Bildrand zeigt Take-y 1575 (0 s, ohne Zoom), ab 3 s
 * mit dem ruhigen Zoom-in höchstens 1565, am Ende 1553: die Hüftlinie liegt überall mindestens ~20 px unter dem Rand.
 * Im Bild: Kopfoberkante ~468 (p5 445), Augen ~772, Kinn ~1078, mittig. Von oben: Kennzahl (Band oben 0,9-fach, y
 * ~284-450, auf hellem Schleier), Kopf, Kinn, Pill-Untertitel (y 1168), Karte (Band unten 0,81-fach, y 1216-1500),
 * alles über der Instagram-Zone (ab 1500). Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in (die
 * Kennzahlen über dem Kopf und die Striche auf den Shop-Hintergründen sitzen fest).
 * Marken-Hintergründe (karten-aufbau.md "Marken-Shops als Hintergrund"): an zehn Stellen steht er freigestellt vor echten
 * Seiten von fiveskincare.de (HG unten, in den Take gerechnet von npm run portrait --ausschnitt 1.54,505,-30
 * --hintergrund …); Hook, Interview, Meinung, Tipp 1 und 3, KI und Aufruf vor seinem weichgezeichneten Zimmer.
 * Kennzahlen, Fotos und Karten als transparentes WebM aus hyperframes/five-skizzen (public/broll/five/skizzen.webm),
 * Zeiten und Töne in karten.json.
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
export const meta = { id: "Five", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 526, y 829 → im Bild x 548, y 772; Haar ~632 → 468; Bildunterkante = Take y ~1575
 *  (mit dem Zoom-in ab 3 s ≤ 1565), Hüftlinie im Take frühestens ~1580 */
const BILD = { scale: 1.54, hoch: 505, x: -30 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 772;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/five/) */
export const HG: [string, number, number][] = [
  ["hg-home", 10.9, 14.45], // "Denn genau das ist die Story von FIVE Skincare." (Startseite, Folie "Hallo Shea Cream")
  ["hg-zutaten", 15.2, 19.1], // "Die Marke setzt nämlich auf maximal fünf Inhaltsstoffe pro Produkt." (Shea Cream: "Mit nur 5 Inhaltsstoffen")
  ["hg-alle", 28.2, 34.35], // "Und der Name erklärt ... das Versprechen ..." (Kategorie "Produkte": FIVE-Flakons)
  ["hg-story", 45.9, 52.3], // "Die Gründerin Anna Pfeiffer wollte ..." ("Unsere Story")
  ["hg-presse", 52.3, 56.85], // "... bei „Die Höhle der Löwen“ bekannt." (Presseseite "Auf einen Blick": Sept. 2017)
  ["hg-usp", 136.6, 142.15], // "Mach den USP im Shop einfach sichtbar. Nicht irgendwo ganz unten ..." (Produktseite: "Nur 5 Inhaltsstoffe")
  ["hg-favoriten", 142.15, 148.35], // "... wo die Kunden das Produkt zum ersten Mal sehen." (Startseite: "Maximal 5 Inhaltsstoffe" über den Favoriten)
  ["hg-geheimnisse", 172.45, 177.7], // "... transparente Inhaltsstoffe ..." (5 Gründe: "Keine Geheimnisse")
  ["hg-shea", 204.1, 208.75], // "... muss natürlich immer auch erst mal das Produkt beweisen." (Produktseite Shea Cream)
  ["hg-gruende", 213.75, 220.3], // "Weniger kann eine ziemlich starke Positionierung sein." (5 Gründe: "... Wir kommen mit maximal 5 aus.")
];

/** Sanfter Grade (STIL.gradeSanft); Helligkeit am Gesicht nach dem ersten Render gemessen (Ziel ~0,55-0,57) */
const GRADE = STIL.gradeSanft;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis zum Ende des Hook-Satzes ("weniger?" 6,30-6,7 s); danach die erste Shop-Seite (6,80 s) */
const HOOK_ENDE = fs(6.5);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 158-822, oben bei y 1216) */
const PILLE = { x: 490, y: 1168 };

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

      {/* Hook-Titel (Marke FIVE, Text aus dem Briefing), an der Kartenposition unter dem Kopf (oben ~1216), wie Karte
          und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 964px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="FIVE SKINCARE:" line2="MAX. 5 INHALTSSTOFFE PRO PRODUKT" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Kennzahlen, Fotos und Erklär-Bilder aus HyperFrames (hyperframes/five-skizzen) */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/five/skizzen.webm")}
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
