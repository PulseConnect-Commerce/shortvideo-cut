/**
 * Format NEWS/Reaction, freigegebener Look ab 2026-10-17 (Vorlage: src/projekte/rewe/Video.tsx, Variante `neu`):
 * "Google Ads ändert Budgetsteuerung" (Cutter-Briefing im Kalender, Veröffentlichung So 18.10.2026 18:00).
 * Google Ads führt seit dem 15.10.2026 schrittweise Kanal-Prioritäten und prozentuale Budgetanteile ein (Fachartikel
 * webmaster.de vom 15.10.2026; Primärquellen: Google Blog 14.10.2026, Google Ads Hilfe). Die Budgetanteile sind
 * "best effort", kein hartes Tageslimit; das GESAMTE Kampagnenbudget wird nicht als überschritten dargestellt.
 *
 * Bild: Augen bei ~900-915 (scale 1.3), sanfte Farbe (STIL.gradeSanft), nur ein ruhiges Zoom-in (3 %, in den ersten
 * 3 s etwas schneller = der "leichte Push-in" aus dem Briefing), kein Zoom-Wechsel. Oben: Hook-Titel (nacht-gruen),
 * Quellen-Screenshot, Skizzen aus HyperFrames (hyperframes/googleads-skizzen). Untertitel unter dem Kopf (y 1400).
 */
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import { SchlichterText } from "../../lib/schlicht";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "GoogleAds", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

/** Bildlage: Augen bei ~900-925 (im Take bei ~866); transformOrigin 50 % 0 %, daher x 65 wie bei REWE (Kopf mittig, rechts kein schwarzer Rand) */
const BILD = { scale: 1.3, hoch: 205, x: 65 };

const HOOK_ENDE = C.W("beispiel") - 2;

/** Originalüberschrift (webmaster.de, 15.10.2026) über dem Kopf, Quellenzeile direkt darunter */
const SCHLAGZEILE = F("hier");
const SCHLAGZEILE_ENDE = C.W("du", C.W("einstellungen")) - 4;
const DATUM = F("oktober");
const QUELLE = { w: 600, bild: 1070 / 230 };

const BETONT = ["google", "werbebudget", "onlineshop", "meldung", "15", "oktober", "kanälen", "budget", "shopping", "pmax", "haken", "budgetgrenzen", "verbindlich", "überschreiten", "freigeschaltet", "blind", "aktivieren", "geld", "umsatz", "kontrolle", "meinung", "folgen"];
const FARBIG = ["15", "werbebudget", "budgetgrenzen", "umsatz", "pmax"];

/** Sekunden im Video, an denen die Skizzen erscheinen (wie in hyperframes/googleads-skizzen/index.html) */
const SKIZZEN = [4.2, 13.3, 21.0, 26.1, 29.45, 33.0, 36.3, 40.1, 46.7];
/** leise Akzente auf einzelnen Zeichnungen: Datei, Sekunde, Lautstärke (Anteil von STIL.sfx) */
const AKZENTE: [string, number, number][] = [
  ["tick.mp3", 15.3, 0.3], ["success.mp3", 22.36, 0.35], ["tick.mp3", 24.68, 0.3], ["tick.mp3", 31.45, 0.3],
  ["success.mp3", 35.22, 0.3], ["tick.mp3", 45.55, 0.3], ["tick.mp3", 50.85, 0.3],
];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "news.mp3" }) => {
  const fr = useCurrentFrame();
  const karte = interpolate(fr, [SCHLAGZEILE, SCHLAGZEILE + 5, SCHLAGZEILE_ENDE, SCHLAGZEILE_ENDE + 5], [0, 1, 1, 0], clamp);
  // ruhiges Zoom-in über das ganze Video (3 %); in den ersten 3 s etwas schneller (leichter Push-in aus dem Briefing)
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  const bildH = QUELLE.w / QUELLE.bild;
  const links = (1080 - QUELLE.w) / 2;
  const datum = interpolate(fr, [DATUM, DATUM + 14], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 740px" }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={STIL.gradeSanft}
        />
      </AbsoluteFill>

      {/* Hook im alten Titel-Stil (Briefing: "GOOGLE ÄNDERT DEIN WERBEBUDGET!") */}
      <DesignRahmen design="nacht-gruen">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="GOOGLE ÄNDERT" line2="DEIN WERBEBUDGET!" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Originalüberschrift des Fachartikels (webmaster.de, 15.10.2026), echter Ausschnitt der Seite */}
      {karte > 0 && (
        <>
          <div style={{ position: "absolute", left: links, top: 300, width: QUELLE.w, height: bildH, opacity: karte, borderRadius: 18, overflow: "hidden", boxShadow: "0 14px 34px rgb(0 0 0 / 0.4)" }}>
            <Img src={staticFile("broll/googleads/schlagzeile.png")} style={{ width: QUELLE.w, height: bildH, display: "block" }} />
            {/* grüne Markierung um das Datum, auf dem Wort "Oktober" */}
            <svg viewBox="0 0 1070 230" width={QUELLE.w} height={bildH} style={{ position: "absolute", left: 0, top: 0, opacity: fr >= DATUM ? 1 : 0 }}>
              <rect x={146} y={10} width={256} height={46} rx={12} fill="none" stroke="#00F090" strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={datum} />
            </svg>
          </div>
          <SchlichterText fr={fr} at={SCHLAGZEILE} until={SCHLAGZEILE_ENDE} top={300 + bildH + 14} size={26} weight={500} style={{ opacity: 0.85 * karte }}>
            Quelle: webmaster.de, 15.10.2026
          </SchlichterText>
        </>
      )}

      {/* Skizzen aus HyperFrames (transparentes WebM) */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/googleads/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={1400} />}

      {sfx && (
        <>
          {SKIZZEN.map((s) => (
            <Sfx key={s} file="pop.mp3" at={(s + 0.1) * C.FPS} volume={STIL.sfx * 0.4} />
          ))}
          {AKZENTE.map(([file, s, v]) => (
            <Sfx key={`${file}${s}`} file={file} at={s * C.FPS} volume={STIL.sfx * v} />
          ))}
          <Sfx file="klick.mp3" at={SCHLAGZEILE} volume={STIL.sfx * 0.35} />
        </>
      )}
      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
