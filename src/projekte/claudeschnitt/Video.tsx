/**
 * Format HERO, Reihe K "KI allgemein", K02 · Videos schneiden mit Claude Code (Opus 5.5). Veröffentlichung laut Briefing
 * Sa 31.10.2026 19:00 (Folgevideo zu K01, src/projekte/claudetools).
 * Look wie K01: helle Karten unter dem Kopf als Erklär-Bilder (karten-aufbau.md "Visuelle Metaphern"), Pill-Untertitel
 * (aktives Wort #00E090), Farbwelt PulseConnect-Verlauf #00D088 → #31ADEC, sanfter Grade, ein ruhiges Zoom-in (3 %), kein
 * Punch-in.
 * Herzstück nach Pauls Wunsch (30.10.): der Prompt tippt sich auf seinen Wörtern in ein stilisiertes Eingabefenster
 * ("Illustration"), danach Spracherkennung / Schnitt-Werkzeuge / Untertitel & Grafiken mit Haken, die Onboarding-Fragen
 * (Marke, Farben, Beispiel-Videos, Stil) als Chat-Karten mit Auswahl-Chips → "Dein Schnittprofil" → "gespeichert als Skills",
 * dann der Alltag (Handy → Drive-Ordner "Rohclips" → Termin braun → grün → Startsignal → Checkliste → Metricool).
 * Hook-Titel (Pauls Regel 30.10.: kurz und prägnant): "KEINE ZEIT" / "ZUM SCHNEIDEN?" im Design "verlauf" an der
 * Kartenposition unter dem Kopf, bis "das Schneiden" (7,7 s); dort kommt die erste Karte.
 * Ende: Kommentar-Karte „Schnitt“ (169,6 s) und die große Folgen-Karte mit TikTok-Plus (Tippen auf "Follow", 172,2 s).
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe): sitzend, im Take an 94
 * Zeitpunkten gemessen (alle 2 s über alle Schnittstücke, YuNet-Kopfkasten mit Haar und Kinn): Kopfmitte x Median 578 (p5 402
 * im Profil, p95 663), Kopfkasten oben Median 467 (Haaransatz ~530), unten Median 1091 (p95 1164); Hüftlinie (Hosenbund unter
 * dem Pulli, Standbilder an 13 Stellen) frühestens bei Take-y ~1770 → scale 1.35, hoch 400, x 50: Kopfoberkante ~y 300-330,
 * Augen ~626, Kinn ~950 (Profil bis ~1040); der untere Bildrand zeigt Take-y 1719 (mit dem Zoom-in weniger), die Hüftlinie
 * liegt also mindestens ~50 px (Take) unter dem Rand. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1072), Karte
 * (y 1120-1470), alles über der Instagram-Zone (ab y 1500).
 * Farbe: die gemessene Kette von `npm run farbe -- claudeschnitt --nur-ansehen` (colorchannelmixer 0.9984/0.9957/1.0064,
 * Gamma 1/0.962, Vibrance 0.08) liegt in einem Durchgang mit dem Schwärzen der ungenutzten Take-Teile auf dem Take (Speicher
 * knapp); im Bild der sanfte Grade mit brightness (Gesicht-Ziel 0,55-0,57).
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
export const meta = { id: "ClaudeSchnitt", durationInFrames: C.DURATION, fps: C.FPS };

/** Haaransatz im Take ~530 → im Bild ~315; Kopfmitte (Median x 578) → x 540; Bildunterkante = Take-y 1719 (Hüftlinie im
 * Take frühestens ~1770: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.35, hoch: 400, x: 50 };
/** Augenhöhe im Bild (Take ~760): Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 626;

/** Sanfter Grade (Regel 5b, freigegebener Look) plus brightness wie K01 (gleicher Raum, gleiches Licht; K01 lag ohne bei
 * 0,624, Ziel 0,55-0,57) */
const GRADE = `brightness(0.9) ${STIL.gradeSanft}`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel "KEINE ZEIT / ZUM SCHNEIDEN?" bis "das Schneiden" (7,73 s), ganz weg bei ~7,65 s; die erste Karte kommt auf
 * "Schneiden" (7,66 s) */
const HOOK_ENDE = fs(7.45);

/** Während der Prompt sich im Fenster tippt (57,5-61,4 s), zeigt das Fenster seine Worte: dort keine Pille */
const OHNE_PILLE: [number, number][] = [[fs(57.46), fs(61.42)]];

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1120) */
const PILLE = { x: 490, y: 1072 };

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

      {/* Hook-Titel (Pauls Regel 30.10.: kurz und prägnant, Thema in wenigen Worten; Design verlauf wie easyJet/K01), an der
          Kartenposition unter dem Kopf (oben ~1120), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste
          rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 868px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="KEINE ZEIT" line2="ZUM SCHNEIDEN?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/claudeschnitt-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/claudeschnitt/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={Math.round(t.at * C.FPS)} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} x={PILLE.x} y={PILLE.y} off={OHNE_PILLE} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
