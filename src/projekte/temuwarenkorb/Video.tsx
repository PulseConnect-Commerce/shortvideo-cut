/**
 * Format NEWS, N07 · Temu-Warenkorb in DE 59 % teurer als CH (1 Test). Veröffentlichung laut Briefing noch ohne Datum (News, bald;
 * die Regie plant ein). Look wie N09 (src/projekte/ebaykombi): helle Karten unter dem Kopf mit Pill-Untertiteln
 * (karten-aufbau.md, aktives Wort #00E090), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlage P04): echte Quellen
 * neuhandeln.de (26.10.2026) und Carpathia-Blog (25.10.2026), zwei Warenkörbe DE 126,94 € / CH ~80 €, "EINFUHRABGABEN ERKLÄREN
 * NUR EINEN TEIL" (21,42 €, davon trägt Temu 6,42 €, ohne sie 111,94 €), Puzzle "Woran liegt's?" mit Aktionspreisen als Vermutung,
 * "EIN TEST – KEINE GESAMTSTUDIE", Tipp: eigene Wettbewerbsprodukte und Endpreise prüfen, Umfrage "Temu immer am günstigsten?"
 * mit Folgen-Plus (keine Folgennummer).
 * Hook-Titel laut Regie und Briefing (Marke Temu, News, starke Zahl; Design "verlauf", easyJet-Stil): "TEMU: 59 % TEURER" /
 * "IN DEUTSCHLAND?", klein darunter "ein getesteter Warenkorb", an der Kartenposition unter dem Kopf, bis zum Ende des ersten Satzes.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): scale 1.6,
 * hoch 790, x 61 (Take: Kopfoberkante Median y 686 (660-708) mit der Porträt-Maske, Augen Median x 578 / y 910, Kinn ~1111,
 * Hüftlinie (oberste Jeans-Zeile) frühestens y 1717, Median 1766, an 119 Zeitpunkten alle 0,5 s über alle Schnittstücke gemessen)
 * → Kopfoberkante ~308, Augen ~666, Kinn ~988, mittig; der untere Bildrand zeigt Take-y 1694 (mit dem Zoom-in bis ~1673), also
 * liegt die Hüftlinie mindestens 23 px unter dem Bildrand. Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in.
 * Von oben: Gesicht, Kinn, Pill-Untertitel (y 1068), Karte (y 1118-1468), alles über der Instagram-Zone (ab y 1500).
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, karten-aufbau.md, src/lib/quelle-gross.tsx): an zwei Stellen
 * steht die echte Quelle scharf über das ganze Bild, er läuft als Bubble unten rechts weiter, die Pille links daneben
 * (QUELLEN unten): 4,36-10,76 s neuhandeln.de (Überschrift, dann das markierte Zitat "Ein identischer Warenkorb …") und der
 * Carpathia-Blog ("… einen identischen Warenkorb mit Topsellern …"), statt der Quellen-Karten q1/q2; 32,45-35,97 s Carpathia
 * "Denkbar sind Schweiz-spezifische Aktionspreise". Die sieben Quellen-Hintergründe hinter ihm sind aus dem Take genommen
 * (npm run portrait neu, ohne --hintergrund), sonst verdeckte sein Kopf dort den Text; dort steht er vor seinem
 * weichgezeichneten Zimmer, die Erklär-Karten bleiben. Karten als transparentes WebM aus hyperframes/temuwarenkorb-skizzen
 * (public/broll/temuwarenkorb/skizzen.webm), Zeiten und Töne in karten.json.
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
export const meta = { id: "TemuWarenkorb", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 578, y 910 → im Bild x 540, y 666; Kopf Median 686 → 308; Bildunterkante = Take y 1694
 * (Hüftlinie im Take frühestens 1717: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.6, hoch: 790, x: 61 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 666;

/** Hintergründe im Take: seit 2026-10-28 keine mehr (alle sieben waren Quellen mit Lesetext; Porträt neu ohne
 * --hintergrund). Die Quellen stehen jetzt groß (QUELLEN). */
export const HG: [string, number, number][] = [];

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus hyperframes/temuwarenkorb-hg/screenshots, nur
 * zugeschnitten, keine Artikelbilder im Fokus). Aneinanderstoßende Fenster: er bleibt klein, nur die Seite wechselt. */
const QUELLEN: QuelleFenster[] = [
  // "Zumindest bei einem getesteten Warenkorb …": neuhandeln.de, Überschrift und Datum
  { von: 4.36, bis: 6.0, bild: "broll/temuwarenkorb/quelle-nh-kopf.jpg", y: 0, fokus: [[340, 818]] },
  // "… wurde das hier gefunden. Schaut euch das mal an.": markiert "Ein identischer Warenkorb kostet … 59 Prozent mehr …"
  { von: 6.0, bis: 8.66, bild: "broll/temuwarenkorb/quelle-nh-zitat.jpg", y: -60, fokus: [[325, 531]],
    label: "neuhandeln.de · 26.10.2026" },
  // "Eine Schweizer E-Commerce-Beratung …": Carpathia, markiert "… einen identischen Warenkorb mit Topsellern …"
  { von: 8.66, bis: 10.76, bild: "broll/temuwarenkorb/quelle-cp-warenkorb.jpg", y: 45, fokus: [[345, 765]],
    label: "Carpathia-Blog · 25.10.2026" },
  // "Es können noch einfach unterschiedliche Aktionspreise eine Rolle spielen.": "Denkbar sind Schweiz-spezifische Aktionspreise"
  { von: 32.45, bis: 35.97, bild: "broll/temuwarenkorb/quelle-cp-aktion.jpg", y: 150, fokus: [[350, 708]],
    label: "Carpathia-Blog · 25.10.2026" },
];

/** Erklär-Karten aus (Sekunden im Schnitt): im WebM laufen hier noch die alten Quellen-Karten q1/q2 (ersetzt durch QUELLEN)
 * und das Ende der Puzzle-Karte k3 (bis 35,97 s); beim Ein- bzw. Ausgang der Fenster schienen sie sonst 3-4 Frames halb
 * durch (Standbilder 28.10.). Die nächste Karte (k1 bei 10,76 s, k4 bei 35,97 s) beginnt genau am Fensterende. */
const KARTEN_AUS: [number, number][] = [
  [4.36, 10.76],
  [34.2, 35.97],
];

/** Sanfter Grade (STIL.gradeSanft) plus brightness(0.94): das Gesicht lag in den ersten Standbildern bei 0,598 (Median aus 10,
 * gemessen wie npm run pruefen); Regie: "Liegt das Gesicht über 0,57, gleich das im Grade aus" → Ziel ~0,56 */
const GRADE = `${STIL.gradeSanft} brightness(0.94)`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis zum Ende des ersten Satzes ("Schweiz." 3,90-4,2 s), ganz weg bei 4,15 s; die erste Karte kommt bei 4,36 s */
const HOOK_ENDE = fs(3.95);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1118) */
const PILLE = { x: 490, y: 1068 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

/** klein unter dem Hook-Titel (Briefing: klein "ein getesteter Warenkorb"), blendet mit dem Hook aus */
const HookZusatz: React.FC<{ fr: number }> = ({ fr }) => {
  const o = interpolate(fr, [HOOK_ENDE, HOOK_ENDE + 6], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (o >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 980,
        top: 1340,
        textAlign: "center",
        opacity: 1 - o,
        transform: `translateY(${-40 * o}px)`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: STIL.font,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: "0.01em",
          color: "#fff",
          padding: "6px 22px 9px",
          borderRadius: 14,
          background: "rgb(10 12 14 / 0.78)",
        }}
      >
        ein getesteter Warenkorb
      </span>
    </div>
  );
};

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "news.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %), kein Punch-in
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  // Quelle groß: 0 = normal, 1 = Quelle über das ganze Bild, er als Bubble unten rechts
  const q = quelleZustand(QUELLEN, fr, C.FPS);
  const karteO = KARTEN_AUS.some(([a, b]) => fr >= fs(a) && fr < fs(b)) ? 0 : kartenSicht(q.p);
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

      {/* Hook-Titel (Regie und Briefing: "TEMU: 59 % TEURER IN DEUTSCHLAND?", Marke in Zeile 1, Design verlauf), an der
          Kartenposition unter dem Kopf (oben ~1118), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste
          rechts (ab x 900) ragt; klein darunter "ein getesteter Warenkorb" */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 866px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="TEMU: 59 % TEURER" line2="IN DEUTSCHLAND?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>
      <HookZusatz fr={fr} />

      {/* Erklär-Bilder und Quellen-Karten aus HyperFrames (hyperframes/temuwarenkorb-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/temuwarenkorb/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: karteO }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
