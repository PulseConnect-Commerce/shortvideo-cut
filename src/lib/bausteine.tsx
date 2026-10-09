/**
 * Bausteine für jedes Video: Takes (Ton pro Stück, Bild mit J-Cuts), Untertitel, Hook-Titel, Pillen, Karten,
 * Soundeffekte, Punch-in-Zooms und Splitscreen. Farben, Schrift und Maße stehen in STIL (stil.ts) und sind dein
 * Schnittstil: ändere sie dort, nicht hier.
 */
import { Audio, Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile } from "remotion";
import { fitSize, textWidth } from "./messen";
import type { Cut } from "./schnitt";
import { STIL } from "./stil";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 0 → 1 über `len` Frames ab Frame `a` */
export const ramp = (x: number, a: number, len = 8, ease = Easing.out(Easing.cubic)) =>
  interpolate(x, [a, a + len], [0, 1], { ...clamp, easing: ease });
/** Pop-in: 0,6 → 1,06 → 1 in 8 Frames (sichtbar ab dem ersten Frame, darum "auf dem Wort") */
export const popS = (fr: number, at: number) => interpolate(fr - at, [0, 4, 8], [0.6, 1.06, 1], clamp);

/** Pfad eines Takes: "<projekt>/<take>" → public/projekte/<projekt>/takes/<take>.mp4 */
export const takeFile = (src: string) => {
  const [projekt, take] = src.split("/");
  return staticFile(`projekte/${projekt}/takes/${take}.mp4`);
};

/** Überblendung an jedem Tonschnitt (Frames je Seite): die Stücke überlappen sich und blenden mit gleicher Leistung
 * ineinander über, so fällt an keinem Schnitt der Raumklang weg (ein Loch aus digitaler Stille hört man als Sprung) */
export const XFADE = 3;

/** Ton (pro Schnittstück, mit Überblendung zum Nachbarn; das letzte Stück blendet 0,4 s aus) und Bild (J-Cuts). */
export const Takes: React.FC<{
  C: Cut;
  voice?: boolean;
  /** CSS-Transform für das Bild, z. B. ein Zoom (punch) oder das Verschieben im Splitscreen */
  transform?: string;
  transformOrigin?: string;
}> = ({ C, voice = true, transform, transformOrigin = "50% 30%" }) => (
  <>
    <AbsoluteFill style={{ transform, transformOrigin }}>
      {C.SPANS.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={s.len} name={`Bild ${s.src} ${s.trimBefore}`}>
          <Video
            src={takeFile(s.src)}
            trimBefore={s.trimBefore}
            trimAfter={s.trimBefore + s.len}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: STIL.grade }}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
    {voice &&
      C.KEEPS.map((k, i) => {
        const last = i === C.KEEPS.length - 1;
        // Überhang in den Nachbarn: bis XFADE Frames, aber nur so weit dort freier Raumklang ist (kein Wort anspielen)
        const pre = i === 0 ? 0 : Math.min(XFADE, C.f(k.from), Math.floor((k.vor ?? 0.1) * C.FPS));
        const post = last ? 0 : Math.min(XFADE, Math.floor((k.nach ?? 0.1) * C.FPS));
        const len = k.len + pre + post;
        // Ausblenden am Schluss: höchstens 12 Frames, aber nur in der Stille nach dem letzten Wort (Ende auf dem Wort)
        const tailFade = Math.max(2, Math.min(12, k.at + k.len - C.LAST));
        const up = (n: number) => Math.sin((Math.PI / 2) * Math.min(1, Math.max(0, n)));
        // "stumm": leise statt geschnitten (-34 dB, Raumklang bleibt, kein Loch), 2 Frames Blende an jeder Seite
        const quiet = (x: number) => {
          const t = k.from + (x - pre) / C.FPS;
          return (k.stumm ?? []).reduce((g, [a, b]) => {
            const d = Math.max(a - t, t - b, 0) * C.FPS;
            return Math.min(g, 0.02 + 0.98 * Math.min(1, d / 2));
          }, 1);
        };
        return (
          <Sequence key={i} from={k.at - pre} durationInFrames={len} layout="none" name={`Ton ${k.src} ${k.from}`}>
            <Audio
              src={takeFile(k.src)}
              trimBefore={C.f(k.from) - pre}
              trimAfter={C.f(k.to) + post}
              volume={(x) =>
                quiet(x) *
                Math.min(
                  pre ? up((x + 0.5) / (2 * pre)) : up((x + 0.5) / 2),
                  last ? Math.min(1, (len - 1 - x) / tailFade) : post ? up((len - x - 0.5) / (2 * post)) : up((len - x - 0.5) / 2),
                )
              }
            />
          </Sequence>
        );
      })}
  </>
);

/** Soundeffekt, immer deutlich unter der Stimme (STIL.sfx ≈ 0,08-0,12; checks.py misst ≥ 6 dB Abstand) */
export const Sfx: React.FC<{ file: string; at: number; volume?: number }> = ({ file, at, volume = STIL.sfx }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${file}`)} volume={volume} />
  </Sequence>
);

/** Text auf dem Video: Geist, dünne Kontur unter der Füllung, weicher Schatten */
export const onVideo = {
  fontFamily: STIL.font,
  color: "#fff",
  WebkitTextStroke: "6px rgb(20 22 26 / 0.9)",
  paintOrder: "stroke fill",
  textShadow: "0 4px 18px rgb(0 0 0 / 0.45)",
} as const;

/** Untertitel: Seiten aus der cut.json, das gesprochene Wort gelb; `top` = y-Position (Vollbild 1340, im Split 872) */
export const Captions: React.FC<{
  C: Cut;
  fr: number;
  top?: number;
  size?: number;
  /** Frames, in denen eine große Grafik die gesprochenen Worte zeigt: dann keine Untertitel */
  off?: [number, number][];
}> = ({ C, fr, top = STIL.captionY, size = STIL.captionSize, off = [] }) => {
  if (off.some(([a, b]) => fr >= a && fr < b)) return null;
  const starts = C.PAGES.reduce<number[]>((acc, p, i) => {
    acc.push(Math.max(p[0].a - 1, i ? acc[i - 1] + 4 : 0));
    return acc;
  }, []);
  const i = starts.findIndex((s, k) => {
    const next = starts[k + 1] ?? Infinity;
    const last = C.PAGES[k][C.PAGES[k].length - 1].b;
    return fr >= s && fr < Math.min(next, last + 12);
  });
  if (i < 0) return null;
  const page = C.PAGES[i];
  const pop = interpolate(fr, [starts[i], starts[i] + 3], [0.94, 1], clamp);
  // eine Seite, die breiter wäre als die sichere Fläche (ein langes Kompositum), wird kleiner statt umzubrechen
  const text = page.map((w) => w.text.replace(/,$/, "")).join(" ");
  const fs = Math.min(size, Math.floor((size * STIL.safe.width) / Math.max(1, textWidth(text, size, 700, -0.02))));
  return (
    <div
      style={{
        ...onVideo,
        position: "absolute",
        left: STIL.safe.left,
        width: STIL.safe.width,
        top,
        textAlign: "center",
        transform: `scale(${pop})`,
        fontWeight: 700,
        fontSize: fs,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {page.map((w, k, pg) => {
        const on = fr >= w.a - 1 && fr < (pg[k + 1]?.a ?? w.b + 12) - 1;
        return (
          <span key={`${i}-${k}`} style={{ color: on ? STIL.yellow : "#fff" }}>
            {w.text.replace(/,$/, "")}{" "}
          </span>
        );
      })}
    </div>
  );
};

/** Hook-Titel oben: ab Frame 0 fest stehend, kleine Zeile darüber (Serie/Tag), verschwindet ab `outAt` */
/** Hook-Stile zum Durchprobieren (er wählt pro Video): je Zeile Schriftfarbe und entweder eine Kontur oder ein Balken
 * dahinter. Nie in der Farbe der Untertitel (Blau). "kontur" ist der Stil aus STIL.hook (weiß/rot). */
type HookZeile = { farbe: string; kontur?: string; balken?: string };
export const HOOK_STILE = {
  kontur: { z1: { farbe: STIL.hook.text, kontur: STIL.hook.rand }, z2: { farbe: STIL.hook.kern, kontur: STIL.hook.kernRand } },
  balken: { z1: { farbe: STIL.ink, balken: "#FFFFFF" }, z2: { farbe: "#FFFFFF", balken: STIL.hook.kern } },
  rot: { z1: { farbe: "#FFFFFF", balken: STIL.hook.kern }, z2: { farbe: "#FFFFFF", balken: STIL.hook.kern }, kippen: -3 },
  schwarzgruen: { z1: { farbe: "#FFFFFF", balken: STIL.ink }, z2: { farbe: STIL.accent2, balken: STIL.ink } },
  gelb: { z1: { farbe: "#FFFFFF", kontur: STIL.ink }, z2: { farbe: STIL.ink, balken: STIL.save } },
  gruen: { z1: { farbe: "#FFFFFF", kontur: STIL.ink }, z2: { farbe: STIL.accent2, kontur: STIL.ink } },
} satisfies Record<string, { z1: HookZeile; z2: HookZeile; kippen?: number }>;
export type HookStil = keyof typeof HOOK_STILE;

export const HookTitle: React.FC<{
  fr: number;
  kicker?: string;
  line1: string;
  line2?: string;
  outAt: number;
  stil?: HookStil;
}> = ({ fr, kicker, line1, line2, outAt, stil = "kontur" }) => {
  const o = ramp(fr, outAt, 6, Easing.in(Easing.cubic));
  if (o >= 1) return null;
  // so groß, wie die Zeile in die Breite passt (gemessene Breite von Geist 900, abzüglich Kontur oder Balken),
  // höchstens 104 px. Höchstens STIL.hookBreite breit und zentriert: am Rand bleibt ein Streifen frei (dort nie Inhalte).
  const width = STIL.hookBreite;
  const S: { z1: HookZeile; z2: HookZeile; kippen?: number } = HOOK_STILE[stil];
  const zeile = (text: string, z: HookZeile) => {
    const size = fitSize(text, width - (z.balken ? 90 : 18), 104, 900, -0.035);
    return (
      <div style={{ marginTop: z.balken ? 10 : 0 }}>
        <div
          style={{
            display: "inline-block",
            fontSize: size,
            whiteSpace: "nowrap",
            color: z.farbe,
            ...(z.kontur ? { WebkitTextStroke: `10px ${z.kontur}` } : {}),
            ...(z.balken
              ? {
                  background: z.balken,
                  padding: "0.1em 0.3em 0.14em",
                  borderRadius: "0.16em",
                  WebkitTextStroke: "0px transparent",
                  textShadow: "none",
                  boxShadow: "0 10px 26px rgb(20 22 26 / 0.28)",
                }
              : {}),
          }}
        >
          {text}
        </div>
      </div>
    );
  };
  return (
    <div
      style={{
        ...onVideo,
        position: "absolute",
        left: (1080 - width) / 2,
        top: STIL.safe.top,
        width,
        textAlign: "center",
        opacity: 1 - o,
        transform: `translateY(${-40 * o}px) rotate(${S.kippen ?? 0}deg)`,
      }}
    >
      {kicker && (
        <div style={{ fontWeight: 800, fontSize: 38, letterSpacing: "0.12em", WebkitTextStroke: "5px rgb(20 22 26 / 0.9)" }}>
          {kicker}
        </div>
      )}
      <div style={{ marginTop: 14, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.0 }}>
        {zeile(line1, S.z1)}
        {line2 && zeile(line2, S.z2)}
      </div>
    </div>
  );
};

/** Pille (Begriff, Tool, Aufruf) */
export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number }> = ({
  children,
  bg = STIL.ink,
  color = "#fff",
  size = 34,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: STIL.font,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
      boxShadow: "0 8px 20px rgb(20 22 26 / 0.16)",
    }}
  >
    {children}
  </div>
);

/** Weiße Karte mit weichem Schatten (für Dokumente, Listen, Fenster) */
export const card = {
  background: "#fff",
  borderRadius: 28,
  boxShadow: "0 2px 0 rgb(20 22 26 / 0.06), 0 14px 34px rgb(20 22 26 / 0.12)",
  fontFamily: STIL.font,
  color: STIL.ink,
} as const;

/** Etwas, das auf seinem Wort aufpoppt und bis `until` bleibt */
export const PopOn: React.FC<{
  fr: number;
  at: number;
  until?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ fr, at, until = Infinity, style, children }) => {
  if (fr < at || fr >= until) return null;
  return <div style={{ position: "absolute", transform: `scale(${popS(fr, at)})`, ...style }}>{children}</div>;
};

/**
 * Punch-in-Zooms auf betonte Wörter (nur im Vollbild): [[frame, scale], …] aufsteigend, z. B.
 * [[0, 1], [C.cue("wichtig"), 1.08], [C.cue("weil"), 1]]. Höchstens 1,1; 4 Frames Übergang.
 */
export const punchAt = (steps: [number, number][], fr: number) => {
  const i = steps.reduce((n, [at], k) => (fr >= at ? k : n), 0);
  const from = i ? steps[i - 1][1] : 1;
  return interpolate(fr, [steps[i][0], steps[i][0] + 4], [from, steps[i][1]], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
};

/**
 * Splitscreen: oben die Bühne für Grafiken (y 0-960), unten die Person. `splits` sind [von, bis]-Frames, in denen
 * geteilt wird (dazwischen Vollbild); split(fr) gibt 0 (Vollbild) bis 1 (geteilt) zurück, mit 12 Frames Fahrt.
 */
export const SEAM = 960;
export const splitAt = (splits: [number, number][], fr: number, slide = 12) =>
  Math.max(
    0,
    ...splits.map(
      ([a, b]) =>
        ramp(fr, a, slide, Easing.inOut(Easing.cubic)) * (1 - ramp(fr, b, slide, Easing.inOut(Easing.cubic))),
    ),
  );
/** Die Person: im Split ab y 960, zeigt ihr Bild ab `lift` px (Kopf, Brust, Hände) */
export const SplitPerson: React.FC<{ split: number; lift?: number; zoom?: number; children: React.ReactNode }> = ({
  split,
  lift = 250,
  zoom = 1,
  children,
}) => (
  <AbsoluteFill style={{ clipPath: `inset(${SEAM * split}px 0 0 0 round ${28 * split}px ${28 * split}px 0 0)` }}>
    <AbsoluteFill
      style={{
        transform: `translateY(${(SEAM - lift) * split}px) scale(${1 + (zoom - 1) * (1 - split)})`,
        transformOrigin: "50% 30%",
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);
/** Die Bühne: Papier mit Punktraster, fährt mit dem Split von oben herein */
export const Stage: React.FC<{ split: number; children?: React.ReactNode }> = ({ split, children }) => (
  <>
    <AbsoluteFill
      style={{
        height: SEAM,
        backgroundColor: STIL.paper,
        backgroundImage: `radial-gradient(${STIL.line} 2px, transparent 2px)`,
        backgroundSize: "36px 36px",
        transform: `translateY(${(split - 1) * SEAM}px)`,
      }}
    />
    {split > 0.01 && (
      <AbsoluteFill
        style={{
          opacity: interpolate(split, [0.6, 1], [0, 1], clamp),
          transform: `translateY(${(split - 1) * 120}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    )}
  </>
);
