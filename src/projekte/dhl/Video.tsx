/**
 * Format NEWS/Reaction, freigegebener Look ab 2026-10-17 (Vorlage: src/projekte/googleads/Video.tsx, rewe Variante `neu`):
 * "DHL-News 2027" (Cutter-Briefing im Kalender, Veröffentlichung Do 22.10.2026 18:00).
 * Fachartikel OnlinehändlerNews, 20.10.2026: "Post-Änderungen 2027: Porto steigt, Päckchen bekommen Sendungsverfolgung".
 * Keine konkrete Preiserhöhung behauptet; Päckchen-Neuerungen (Tracking, Haftung bis 20 EUR, max. 1 kg) getrennt von Geschäftskundenpreisen.
 *
 * Bild: Augen bei ~900-915 (scale 1.3), sanfte Farbe (nur STIL.gradeSanft, kein zusätzliches brightness), nur ein ruhiges Zoom-in (3 %),
 * kein Zoom-Wechsel. Oben: Hook-Titel (nacht-gruen), Quellenkarte, Skizzen aus HyperFrames (hyperframes/dhl-skizzen, heller Karten-Look), eine Leuchtfarbe #00F090.
 * Untertitel unter dem Kopf (y 1400).
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
export const meta = { id: "Dhl", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

/** Bildlage: Augen bei ~900-925 (im Take bei ~866); transformOrigin 50 % 0 %, daher x 65 wie bei REWE (Kopf mittig, rechts kein schwarzer Rand) */
const BILD = { scale: 1.3, hoch: 350, x: 65 };

const HOOK_ENDE = C.W("onlinehändler") - 2;

/** Kopf des Fachartikels (OnlinehändlerNews, 20.10.2026) über dem Kopf, Quellenzeile direkt darunter */
const SCHLAGZEILE = F("meldung");
const SCHLAGZEILE_ENDE = C.W("preise") - 4;
const DATUM = F("hier");
const QUELLE = { w: 600, bild: 1070 / 300 };

const BETONT = ["dhl", "versandbedingungen", "onlinehändler", "teuer", "meldung", "januar", "2027", "geschäftskundenpakete", "preise", "päckchen", "sendungsverfolgung", "haftung", "20", "kilogramm", "versandkalkulation", "e-commerce", "preisänderungen", "geld", "versandverträge", "konditionen", "versandkosten", "utopisch", "meinung", "follow"];
const FARBIG = ["2027", "20", "kilogramm", "teuer", "geld", "versandkosten"];

/** Sekunden im Video, an denen die Skizzen erscheinen (wie in hyperframes/dhl-skizzen/index.html) */
const SKIZZEN = [3.45, 11.1, 13.3, 18.75, 24.47, 27.4, 32.9, 38.1, 44.6, 49.2, 59.45];
/** leise Akzente auf einzelnen Zeichnungen: Datei, Sekunde, Lautstärke (Anteil von STIL.sfx) */
const AKZENTE: [string, number, number][] = [
  ["tick.mp3", 5.12, 0.3], ["tick.mp3", 16.46, 0.3], ["success.mp3", 23.15, 0.35], ["tick.mp3", 26.71, 0.3],
  ["tick.mp3", 35.2, 0.3], ["success.mp3", 43.55, 0.3], ["tick.mp3", 47.98, 0.3], ["tick.mp3", 54.49, 0.3],
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

      {/* Hook im alten Titel-Stil (Briefing: "DHL 2027: WAS ÄNDERT SICH?") */}
      <DesignRahmen design="nacht-gruen">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="DHL 2027:" line2="WAS ÄNDERT SICH?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Kopf des Fachartikels (OnlinehändlerNews, 20.10.2026): Kategorie/Datum und Überschrift im Wortlaut der Seite */}
      {karte > 0 && (
        <>
          <div style={{ position: "absolute", left: links, top: 300, width: QUELLE.w, height: bildH, opacity: karte, borderRadius: 18, overflow: "hidden", boxShadow: "0 14px 34px rgb(0 0 0 / 0.4)" }}>
            <Img src={staticFile("broll/dhl/schlagzeile.png")} style={{ width: QUELLE.w, height: bildH, display: "block" }} />
            {/* grüne Markierung um das Datum */}
            <svg viewBox="0 0 1070 300" width={QUELLE.w} height={bildH} style={{ position: "absolute", left: 0, top: 0, opacity: fr >= DATUM ? 1 : 0 }}>
              <rect x={448} y={12} width={310} height={52} rx={12} fill="none" stroke="#00F090" strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={datum} />
            </svg>
          </div>
          <SchlichterText fr={fr} at={SCHLAGZEILE} until={SCHLAGZEILE_ENDE} top={300 + bildH + 14} size={26} weight={500} style={{ opacity: 0.85 * karte }}>
            Quelle: OnlinehändlerNews, 20.10.2026
          </SchlichterText>
        </>
      )}

      {/* Skizzen aus HyperFrames (transparentes WebM) */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo src={staticFile("broll/dhl/skizzen.webm")} transparent muted style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }} />
      </Sequence>

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={1400} farbe="#00E090" />}

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
