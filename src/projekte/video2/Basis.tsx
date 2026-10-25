/**
 * Video 2 "Meine E-Commerce-Story" (Format FACE), gemeinsamer Körper der drei Hook-Fassungen A, B, C.
 * Helle Karten (karten-hell.md), Skizzen aus hyperframes/video2-skizzen (5 Karten, in 47,5 s zusammengelegt:
 * jede Karte spielt ab ihrem Stück der Datei, gestartet auf ihrem Wort). Hook-Titel nacht-gruen, Untertitel #00E090.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { Raster } from "../../lib/raster";
import type { createCut } from "../../lib/schnitt";
import kartenSpec from "./karten.json";
import { STIL } from "../../lib/stil";

type Cut = ReturnType<typeof createCut>;
const BILD = { scale: 1.3, hoch: 395, x: 65 };
const FARBE = "#00E090";
const BETONT = ["2026", "verkauft", "verkaufen", "umsatz", "dropshipping", "2016", "cent", "corona", "papa", "lieferengpässe", "profitabel", "prozesse", "personen", "follow", "10"];
const FARBIG = ["2026", "verkauft", "verkaufen", "umsatz", "2016", "corona", "papa", "profitabel", "follow"];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

/** Karten aus karten.json (cue = Wort, auf dem die Karte erscheint); skizzen.webm spielt die Karten nacheinander ab */
const karten = (C: Cut): { von: number; ab: number; dauer: number; ton: number[] }[] =>
  (kartenSpec as { cue: string; nach: string | null; ab: number; dauer: number; ton: number[] }[]).map((k) => ({
    von: Math.round(C.cue(k.cue, k.nach ? C.W(k.nach) : 0)),
    ab: k.ab,
    dauer: k.dauer,
    ton: k.ton,
  }));

/** B-Roll aus älteren Videos (stumm, in heller Karte über dem Kopf) */
// beide Ausschnitte raus (seine Rüge 2026-10-23: alte Grafiken im Ausschnitt, alte Leuchtfarbe passt nicht zum Look)
const BROLL: { file: string; cue: string; nach: string; dauer: number; text: string }[] = [];
/** Zoom-Schnitte (Sekunden im Video, jeweils auf einem Schnitt) */
const ZOOM = [[184.3, 189.7], [243.8, 999]];

export const makeVideo = (C: Cut, hook: { line1: string; line2: string } | null): React.FC<Props> => {
  const K = karten(C);
  const B = BROLL.map((b) => ({ ...b, von: Math.round(C.cue(b.cue, b.nach ? C.W(b.nach) : 0)) }));
  const HOOK_ENDE = C.cue("2016");
  const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "puls.mp3" }) => {
    const fr = useCurrentFrame();
    const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const zoom0 = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
    const zi = ZOOM.reduce((m, [a, b]) => (fr >= a * C.FPS && fr < b * C.FPS ? interpolate(fr, [a * C.FPS, a * C.FPS + 8], [1, 1.15], { ...clamp, easing: Easing.out(Easing.cubic) }) : m), 1);
    const zoom = zoom0 * zi;
    return (
      <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 740px" }}>
          <Takes C={C} voice={voice} transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`} transformOrigin="50% 0%" grade={STIL.gradeSanft} />
        </AbsoluteFill>
        {hook && (
          <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
            <HookTitle fr={fr} line1={hook.line1} line2={hook.line2} outAt={HOOK_ENDE} />
          </AbsoluteFill>
        )}
        {K.map((k) => (
          <Sequence key={k.von} from={k.von} durationInFrames={Math.round(k.dauer * C.FPS)} layout="none">
            <OffthreadVideo
              src={staticFile("broll/video2/skizzen.webm")}
              startFrom={Math.round(k.ab * C.FPS)}
              transparent
              muted
              style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
            />
          </Sequence>
        ))}
        {B.map((b) => {
          const o = interpolate(fr, [b.von, b.von + 8, b.von + b.dauer * C.FPS - 8, b.von + b.dauer * C.FPS], [0, 1, 1, 0], clamp);
          return o > 0 ? (
            <div key={b.file}>
              <div style={{ position: "absolute", left: 110, top: 285, width: 860, height: 240, borderRadius: 36, overflow: "hidden", background: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.08)", opacity: o, transform: `translateY(${(1 - o) * 28}px)` }}>
                <Sequence from={b.von} layout="none">
                  <OffthreadVideo src={staticFile(`broll/video2/${b.file}`)} muted style={{ width: 860, height: 240, objectFit: "cover" }} />
                </Sequence>
              </div>
              <div style={{ position: "absolute", left: 110, top: 540, opacity: o, fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 30, color: "#0B0C0E", background: "rgba(255,255,255,0.96)", borderRadius: 999, padding: "8px 24px" }}>{b.text}</div>
            </div>
          ) : null;
        })}
        {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} farbe={FARBE} y={1400} />}
        {sfx && (
          <>
            {B.map((b) => (
              <Sfx key={`b${b.file}`} file="wusch-gross.mp3" at={b.von} volume={0.055} />
            ))}
            {K.map((k) => (
              <Sfx key={`p${k.von}`} file="whoosh.mp3" at={k.von + 2} volume={0.055} />
            ))}
            {K.flatMap((k) => k.ton.map((t) => <Sfx key={`t${k.von}${t}`} file="tick.mp3" at={k.von + Math.round(t * C.FPS)} volume={0.045} />))}
          </>
        )}
        {musik && <Musik C={C} datei={musik} />}
        {raster && <Raster />}
      </AbsoluteFill>
    );
  };
  const Video: React.FC<Props> = (p) => (
    <DesignRahmen design="verlauf">
      <Inhalt {...p} />
    </DesignRahmen>
  );
  return Video;
};
