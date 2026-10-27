/**
 * Format FACE (wie P04), P-Serie, P09 · Zu viele KI-Tools. Veröffentlichung laut Kalender So 08.11.2026 19:00.
 * Aktueller Look wie S03 (src/projekte/kollektionen) und P04 (src/projekte/pagebuilder): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26): jede Karte zeigt den
 * Gedanken als Bild (zehn KI-Tools und ein Tacho, der ins Minus fällt; ein Shop mit immer mehr Apps; ein Browser mit einem
 * Tab pro Aufgabe, der überläuft; eine Waage Zeitersparnis gegen Aufwand; Wechseln, Prüfen, Kopieren zwischen drei Tools;
 * dieselbe Waage kippt zu "mehr Arbeit"; die KI ändert den Shop, ohne dass du es merkst; Berechtigungsmaske Daten/Aktionen
 * mit Freigabe-Schloss; die falsche Frage "Wie viele KI-Tools?"; Zeit pro Prozess mit Engpass; genau dieser Ablauf wird
 * kürzer, eine KI dockt an), höchstens 1-3 Wörter, ein handschriftliches Akzentwort. Beispiele als BEISPIEL gekennzeichnet.
 * Hook-Titel (starke Zahl im ersten Satz, darum mit Hook; Design "verlauf", easyJet-Stil): "10 KI-TOOLS" / "NICHT
 * AUTOMATISCH EFFIZIENTER" (sein erster Satz), an der Kartenposition unter dem Kopf, ab dem ersten Frame (für den Loop).
 * LOOP (Briefing): das Video endet 0,29 s nach "... und dafür eben eine KI in dem Shop einsetzen." und läuft nahtlos in
 * "10 KI-Tools machen leider deinen Online-Shop nicht automatisch effizienter." (eine KI → zehn KI-Tools). "Denn am Ende
 * gilt:" ist im Take nicht gesprochen; der gesprochene Folgen-Aufruf am Schluss bricht den Loop und ist darum nicht drin,
 * auch kein Folgen-Plus (siehe Übergabekarte). Die letzte Karte bleibt bis zum letzten Frame stehen.
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter): scale 1.25, hoch 468, x 0 (Take: Haar Median
 * y 626, Augen Median x 539 / y 864, Kinn ~1086, über alle Schnittstücke alle 0,25 s gemessen) → Kopfoberkante ~315, Augen
 * ~612, Kinn ~890, mittig; unten endet das Bild bei Take y ~1910 (kein Rand; 1,25 ist das kleinste scale ohne Rand, weil er
 * nah an der Kamera sitzt). Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen, kein Punch-in. Von oben: Gesicht, Kinn,
 * Pill-Untertitel (y 990), Karte (y 1045-1405), alles über der Instagram-Zone (ab y 1500).
 * Marken-Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund"; Shopify-Quelle aus dem Briefing): an den Stellen
 * über Zeitersparnis, Wechseln/Prüfen/Kopieren, KI ändert selbst, Daten/Aktionen/Freigabe und "wie viele KI-Tools ich
 * integrieren kann" steht er freigestellt vor der echten Seite "KI-gestützte Tools" des Shopify Help Center (HG unten, in
 * den Take gerechnet von npm run portrait --ausschnitt 1.25,468,0 --hintergrund …); Hook, Apps, Tools und der Schluss
 * (Loop in den Hook) vor seinem weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/kitools-skizzen (public/broll/kitools/skizzen.webm), Zeiten und Töne in
 * karten.json.
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
export const meta = { id: "KiTools", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 539, y 864 → im Bild x 540, y 612; Haar ~626 → 315; Bildunterkante = Take y 1910 */
const BILD = { scale: 1.25, hoch: 468, x: 0 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 612;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/kitools/) */
export const HG: [string, number, number][] = [
  ["hg-kopf", 41.5, 45.6], // "Natürlich klingt es … Zeitersparnis." (Help Center "KI-gestützte Tools", Kopf: "Du kannst KI-gestützte Tools nutzen …")
  ["hg-bessere", 60.4, 67.5], // "Aber wenn du ständig … wechseln … überprüfst … kopierst," ("Bessere Ergebnisse …", "Änderungen überprüfen, bevor du sie übernimmst")
  ["hg-bessere", 69.8, 72.2], // "kann natürlich auch daraus schnell mehr Arbeit entstehen."
  ["hg-vorsicht", 76.0, 82.2], // "Und noch kritischer … KI selbstständig Änderungen … merkst." ("Vorsicht: KI-Ergebnisse können Fehler enthalten. Überprüfe daher alles …")
  ["hg-kontrolle", 82.2, 84.6], // "Denn dann solltest du genau festlegen," ("Du kontrollierst, worauf jedes Tool … zugreifen darf und welche Aktionen …")
  ["hg-kontrolle", 90.7, 95.4], // "welche Daten sie verwenden darf und welche Aktionen überhaupt die Freigabe brauchen."
  ["hg-extern", 95.8, 99.5], // "Ich würde deshalb nicht fragen, wie viele KI-Tools ich integrieren kann," ("Externe KI-Tools verbinden")
];

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "effizienter." (Ausgabe ~3,58 s), ganz weg bei ~3,95 s; die erste Karte kommt bei 4,20 s */
const HOOK_ENDE = fs(3.75);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1045) */
const PILLE = { x: 490, y: 990 };

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
          grade={STIL.gradeSanft}
        />
      </AbsoluteFill>

      {/* Hook-Titel (starke Zahl, sein erster Satz), easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~1045), wie Karte
          und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt; ab Frame 0 sichtbar (Loop) */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 793px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="10 KI-TOOLS" line2="NICHT AUTOMATISCH EFFIZIENTER" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/kitools-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/kitools/skizzen.webm")}
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
