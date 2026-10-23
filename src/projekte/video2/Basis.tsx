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
import { STIL } from "../../lib/stil";

type Cut = ReturnType<typeof createCut>;
const BILD = { scale: 1.3, hoch: 255, x: 0 };
const FARBE = "#00E090";
const BETONT = ["2026", "verkauft", "verkaufen", "umsatz", "dropshipping", "2016", "cent", "corona", "papa", "lieferengpässe", "profitabel", "prozesse", "personen", "follow", "10"];
const FARBIG = ["2026", "verkauft", "verkaufen", "umsatz", "2016", "corona", "papa", "profitabel", "follow"];

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

/** Karten: [Startframe, Sekunden in skizzen.webm, Dauer in s, Ton-Offsets (s ab Kartenstart)] */
const karten = (C: Cut): { von: number; ab: number; dauer: number; ton: number[] }[] => {
  const i = (x: number) => Math.round(x);
  const k5 = C.cue("umsatz", C.W("spannend"));
  return [
    { von: C.cue("2016"), ab: 0, dauer: 6.2, ton: [] },
    { von: C.cue("corona"), ab: 7, dauer: 10, ton: [] },
    { von: C.cue("2024"), ab: 18, dauer: 7.2, ton: [] },
    { von: C.cue("alles", C.W("möglichkeit")), ab: 26, dauer: 6.8, ton: [] },
    { von: i(k5), ab: 34, dauer: 13, ton: [4.3, 7.2, 10.1] },
  ];
};

export const makeVideo = (C: Cut, hook: { line1: string; line2: string }): React.FC<Props> => {
  const K = karten(C);
  const HOOK_ENDE = C.cue("aber");
  const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "puls.mp3" }) => {
    const fr = useCurrentFrame();
    const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
    return (
      <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 740px" }}>
          <Takes C={C} voice={voice} transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`} transformOrigin="50% 0%" grade={STIL.gradeSanft} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1={hook.line1} line2={hook.line2} outAt={HOOK_ENDE} />
        </AbsoluteFill>
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
        {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} farbe={FARBE} y={1400} />}
        {sfx && (
          <>
            {K.map((k) => (
              <Sfx key={`p${k.von}`} file="pop.mp3" at={k.von + 3} volume={STIL.sfx * 0.4} />
            ))}
            {K.flatMap((k) => k.ton.map((t) => <Sfx key={`t${k.von}${t}`} file="tick.mp3" at={k.von + Math.round(t * C.FPS)} volume={STIL.sfx * 0.3} />))}
          </>
        )}
        {musik && <Musik C={C} datei={musik} />}
        {raster && <Raster />}
      </AbsoluteFill>
    );
  };
  const Video: React.FC<Props> = (p) => (
    <DesignRahmen design="nacht-gruen">
      <Inhalt {...p} />
    </DesignRahmen>
  );
  return Video;
};
