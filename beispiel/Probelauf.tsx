/**
 * Das Beispiel-Video des Probelaufs (npm run probelauf kopiert es nach src/projekte/probelauf/Video.tsx). Es zeigt, was
 * faber-cut kann, ohne Gesicht: der Rohclip wird kürzer, Füllwörter und Pausen fliegen raus, Untertitel laufen Wort für
 * Wort, ein Terminal tippt mit der Stimme, Grafiken landen auf dem Wort, am Ende die Prüfungen. Jede Zahl im Bild kommt
 * aus dem echten Schnitt (cut.json), jede Grafik sitzt mit C.cue() auf ihrem Wort.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, popS, punchAt, ramp, Sfx, Takes } from "../../lib/bausteine";
import { createCut, typedSync } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Probelauf", durationInFrames: C.DURATION };

/** Wort-Stichwort mit Rückfall (falls die Transkription ein Wort anders schreibt, läuft das Video trotzdem) */
const q = (word: string, after = 0, frac = 0.5) => {
  try {
    return C.cue(word, after);
  } catch {
    return Math.round(C.DURATION * frac);
  }
};
const T = (() => {
  const handy = q("handy", 0, 0.08);
  const claude = q("claude", handy, 0.18);
  const schneidet = q("schneidet", claude, 0.22);
  const fuell = q("füllwörter", schneidet, 0.3);
  const pausen = q("pausen", fuell, 0.34);
  const raus = q("raus", pausen, 0.4);
  const untertitel = q("untertitel", raus, 0.46);
  const grafik = q("grafik", untertitel, 0.62);
  const genau = q("genau", grafik, 0.68);
  const wortEnd = q("wort", genau, 0.74);
  const wenn = q("wenn", wortEnd, 0.8);
  const bereit = q("bereit", wenn, 0.9);
  return { handy, claude, schneidet, fuell, pausen, raus, untertitel, grafik, genau, wortEnd, wenn, bereit };
})();

/** echte Zahlen aus dem Schnitt */
const keeps = [...cut.keeps].sort((a, b) => a.from - b.from);
const RAW0 = Math.min(...keeps.map((k) => k.from));
const RAW1 = Math.max(...keeps.map((k) => k.to));
const RAW = RAW1 - RAW0;
const CUT = C.DURATION / C.FPS;
const GAPS = keeps.slice(1).map((k, i) => [keeps[i].to, k.from] as const).filter(([a, b]) => b - a > 0.05);
const de = (x: number) => x.toFixed(1).replace(".", ",");

const W = 890; // Breite der sicheren Fläche
const X = STIL.safe.left;
const dark = "#111317";
const panel = "#1C1F25";
const edge = "rgb(255 255 255 / 0.08)";
const sans = { fontFamily: STIL.font, letterSpacing: "-0.02em" } as const;
const mono = { fontFamily: STIL.mono } as const;
const ease = Easing.out(Easing.cubic);

/** blendet ein Element zwischen a und b ein/aus (Pop-in auf dem Wort, kurzer Fade raus) */
const life = (fr: number, a: number, b = Infinity) => ({
  opacity: Math.min(ramp(fr, a, 3), 1 - ramp(fr, b, 6)),
  scale: popS(fr, a),
  gone: fr < a || fr >= b + 6,
});

/** 1. Das Handy (ab Frame 0, mit dem Hook): REC läuft, Pegel tanzt */
const Phone: React.FC<{ fr: number }> = ({ fr }) => {
  const out = ramp(fr, T.claude - 4, 6, Easing.in(Easing.cubic));
  if (out >= 1) return null;
  const pulse = interpolate(fr - T.handy, [0, 4, 10], [1, 1.05, 1], clamp);
  const sec = Math.floor(fr / C.FPS);
  return (
    <div
      style={{
        position: "absolute",
        left: X + W / 2 - 230,
        top: 480,
        width: 460,
        height: 800,
        borderRadius: 64,
        background: "#0B0C0E",
        border: "10px solid #2A2E36",
        boxShadow: "0 40px 80px rgb(0 0 0 / 0.5)",
        transform: `scale(${pulse * (1 - 0.15 * out)})`,
        opacity: 1 - out,
        overflow: "hidden",
      }}
    >
      {/* du, als Umriss */}
      <div style={{ position: "absolute", left: 150, top: 200, width: 150, height: 150, borderRadius: 999, background: "#3A3F48" }} />
      <div style={{ position: "absolute", left: 75, top: 375, width: 300, height: 300, borderRadius: "150px 150px 0 0", background: "#3A3F48" }} />
      <div style={{ ...mono, position: "absolute", left: 30, top: 38, fontSize: 34, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 18, height: 18, borderRadius: 99, background: STIL.red, opacity: Math.floor(fr / 15) % 2 ? 0.35 : 1 }} />
        REC 00:{String(sec).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 48, height: 80, display: "flex", alignItems: "center", gap: 6 }}>
        {Array.from({ length: 22 }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: 6,
              background: STIL.yellow,
              height: 12 + 60 * Math.abs(Math.sin(fr * 0.35 + i * 0.9) * Math.cos(fr * 0.11 + i * 0.4)),
            }}
          />
        ))}
      </div>
    </div>
  );
};

/** 2. Der Rohclip als Streifen: auf "schneidet" klappen die Lücken (Pausen, Ähms) zu, die Länge zählt herunter */
const Strip: React.FC<{ fr: number }> = ({ fr }) => {
  const l = life(fr, T.claude, T.untertitel);
  if (l.gone) return null;
  const k = ramp(fr, T.schneidet, 14, Easing.inOut(Easing.cubic));
  const sec = RAW - (RAW - CUT) * k;
  const total = RAW - (RAW - CUT) * k;
  const px = (W - 80) / RAW; // Pixel pro Sekunde im Rohzustand
  const parts: { len: number; gap: boolean }[] = [];
  keeps.forEach((kp, i) => {
    if (i) {
      const g = kp.from - keeps[i - 1].to;
      if (g > 0.05) parts.push({ len: g, gap: true });
    }
    parts.push({ len: kp.to - kp.from, gap: false });
  });
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: 520,
        width: W,
        padding: 40,
        borderRadius: 36,
        background: panel,
        border: `2px solid ${edge}`,
        opacity: l.opacity,
        transform: `scale(${l.scale})`,
        ...sans,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", color: "#fff" }}>
        <span style={{ fontSize: 52, fontWeight: 700 }}>{k < 0.5 ? "Rohclip" : "Geschnitten"}</span>
        <span style={{ ...mono, fontSize: 64, fontWeight: 600, color: k > 0.99 ? STIL.yellow : "#fff" }}>{de(sec)} s</span>
      </div>
      <div style={{ display: "flex", height: 130, marginTop: 30, borderRadius: 14, overflow: "hidden", width: total * px }}>
        {parts.map((p, i) => (
          <div
            key={i}
            style={{
              width: p.gap ? p.len * px * (1 - k) : p.len * px,
              height: "100%",
              background: p.gap ? STIL.red : "#E8E4DA",
              borderRight: p.gap ? undefined : `3px solid ${panel}`,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 26, fontSize: 44, color: "rgb(255 255 255 / 0.7)", fontWeight: 600 }}>
        <span style={{ color: STIL.red }}>■</span> {GAPS.length} Pausen und Ähms
        <span style={{ float: "right", color: STIL.yellow, opacity: ramp(fr, T.schneidet + 12, 4) }}>
          −{de(RAW - CUT)} s
        </span>
      </div>
    </div>
  );
};

/** 3. Füllwörter und Pausen: zwei Begriffe, durchgestrichen auf ihrem Wort, fliegen auf "raus" weg */
const Struck: React.FC<{ fr: number; at: number; label: string; y: number }> = ({ fr, at, label, y }) => {
  const l = life(fr, at, T.untertitel);
  if (l.gone) return null;
  const strike = ramp(fr, at + 5, 7);
  const fly = ramp(fr, T.raus, 10, Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: y,
        width: W,
        textAlign: "center",
        opacity: l.opacity * (1 - fly),
        transform: `translateX(${fly * 700}px) scale(${l.scale}) rotate(${fly * 8}deg)`,
      }}
    >
      <span style={{ position: "relative", display: "inline-block", ...sans, fontWeight: 800, fontSize: 120, color: "#fff" }}>
        {label}
        <span
          style={{
            position: "absolute",
            left: -12,
            top: "52%",
            height: 12,
            borderRadius: 6,
            background: STIL.red,
            width: `calc(${strike * 100}% + ${24 * strike}px)`,
          }}
        />
      </span>
    </div>
  );
};

/** 4. Untertitel: das gesprochene Wort groß in der Mitte, die Untertitel-Zeile bekommt einen Rahmen */
const BigWord: React.FC<{ fr: number }> = ({ fr }) => {
  const l = life(fr, T.untertitel, T.grafik - 4);
  if (l.gone) return null;
  const w = [...C.WORDS].reverse().find((x) => x.a - 1 <= fr);
  const fresh = w ? interpolate(fr - (w.a - 1), [0, 3], [0.9, 1], clamp) : 1;
  const frame = ramp(fr, T.untertitel + 4, 8);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: X,
          top: 720,
          width: W,
          textAlign: "center",
          ...sans,
          fontWeight: 800,
          fontSize: 190,
          color: STIL.yellow,
          opacity: l.opacity,
          transform: `scale(${l.scale * fresh})`,
        }}
      >
        {w?.text.replace(/[.,!?]$/, "")}
      </div>
      <div
        style={{
          position: "absolute",
          left: X - 10,
          top: STIL.captionY - 26,
          width: W + 20,
          height: 140,
          borderRadius: 26,
          border: `5px solid ${STIL.yellow}`,
          clipPath: `inset(0 ${100 - frame * 100}% 0 0)`,
          opacity: l.opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: X,
          top: STIL.captionY - 100,
          ...sans,
          fontWeight: 700,
          fontSize: 42,
          color: STIL.ink,
          background: STIL.yellow,
          padding: "6px 18px",
          borderRadius: 12,
          opacity: l.opacity * frame,
        }}
      >
        Wort für Wort
      </div>
    </>
  );
};

/** 5. Terminal, das mit der Stimme tippt, und eine Tonspur mit der Grafik auf dem Laut */
const Terminal: React.FC<{ fr: number }> = ({ fr }) => {
  const l = life(fr, T.grafik, T.wenn - 2);
  if (l.gone) return null;
  const typed = typedSync(C.spoken("jede Grafik kommt genau auf dem Wort", T.grafik - 12), fr);
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: 440,
        width: W,
        borderRadius: 32,
        background: "#0C0D10",
        border: `2px solid ${edge}`,
        boxShadow: "0 30px 60px rgb(0 0 0 / 0.45)",
        opacity: l.opacity,
        transform: `scale(${l.scale})`,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 12, padding: "20px 26px", background: "#16181D", alignItems: "center" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 20, height: 20, borderRadius: 99, background: c }} />
        ))}
        <span style={{ ...mono, fontSize: 34, color: "rgb(255 255 255 / 0.5)", marginLeft: 16 }}>claude</span>
      </div>
      <div style={{ ...mono, padding: "34px 38px 44px", fontSize: 56, lineHeight: 1.3, color: "#fff", minHeight: 230 }}>
        <span style={{ color: STIL.yellow }}>› </span>
        {typed}
        <span style={{ opacity: Math.floor(fr / 8) % 2 ? 0 : 1, color: STIL.yellow }}>▍</span>
      </div>
    </div>
  );
};

const Wave: React.FC<{ fr: number }> = ({ fr }) => {
  const l = life(fr, T.grafik + 6, T.wenn - 2);
  if (l.gone) return null;
  const w = C.WORDS.find((x) => x.a >= T.genau);
  const onset = w ? w.a : T.genau + 2;
  const span = 60; // Frames, die die Spur zeigt
  const x0 = onset - 30;
  const pos = (f: number) => ((f - x0) / span) * (W - 80);
  const flag = ramp(fr, T.genau, 4);
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: 880,
        width: W,
        padding: 40,
        borderRadius: 36,
        background: panel,
        border: `2px solid ${edge}`,
        opacity: l.opacity,
        transform: `scale(${l.scale})`,
        ...sans,
      }}
    >
      <div style={{ position: "relative", height: 190 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, height: 190 }}>
          {Array.from({ length: 60 }, (_, i) => {
            const f = x0 + i;
            const word = C.WORDS.some((x) => f >= x.a && f <= x.b);
            const h = word ? 36 + 120 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) : 8;
            return <div key={i} style={{ flex: 1, height: h, borderRadius: 4, background: f <= fr ? "#E8E4DA" : "#4A4F59" }} />;
          })}
        </div>
        <div style={{ position: "absolute", top: -10, bottom: -10, left: pos(T.genau), width: 6, borderRadius: 3, background: STIL.yellow, opacity: flag }} />
        <div
          style={{
            position: "absolute",
            top: -64,
            left: pos(T.genau) - 8,
            ...sans,
            fontWeight: 700,
            fontSize: 42,
            color: STIL.ink,
            background: STIL.yellow,
            padding: "4px 16px",
            borderRadius: 10,
            opacity: flag,
            transform: `translateY(${(1 - flag) * -20}px)`,
          }}
        >
          Grafik
        </div>
      </div>
      <div style={{ marginTop: 26, fontSize: 44, fontWeight: 600, color: "rgb(255 255 255 / 0.75)" }}>
        Grafik <span style={{ color: STIL.yellow }}>2 Frames</span> vor dem ersten Laut
      </div>
    </div>
  );
};

/** 6. Die Prüfungen, eine nach der anderen, dann "Bereit." */
const Checks: React.FC<{ fr: number }> = ({ fr }) => {
  if (fr < T.wenn) return null;
  const rows = [
    ["Geschnitten", `−${de(RAW - CUT)} s`],
    ["Untertitel", `${C.WORDS.length} Wörter`],
    ["Grafiken", "auf dem Wort"],
    ["Lautheit", "−14 LUFS"],
  ];
  const step = Math.max(5, Math.floor((T.bereit - T.wenn) / 4));
  const done = ramp(fr, T.bereit, 4);
  return (
    <div style={{ position: "absolute", left: X, top: 450, width: W, ...sans }}>
      {rows.map(([a, b], i) => {
        const at = T.wenn + i * step;
        if (fr < at) return null;
        return (
          <div
            key={a}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "30px 34px",
              marginBottom: 20,
              borderRadius: 28,
              background: panel,
              border: `2px solid ${edge}`,
              transform: `scale(${popS(fr, at)})`,
              color: "#fff",
            }}
          >
            <span
              style={{
                width: 70,
                height: 70,
                borderRadius: 99,
                background: STIL.green,
                display: "grid",
                placeItems: "center",
                fontSize: 40,
                fontWeight: 800,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: 56, fontWeight: 700, flex: 1 }}>{a}</span>
            <span style={{ ...mono, fontSize: 46, color: "rgb(255 255 255 / 0.7)" }}>{b}</span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 34,
          textAlign: "center",
          fontWeight: 800,
          fontSize: 150,
          color: STIL.yellow,
          opacity: done,
          transform: `scale(${interpolate(fr - T.bereit, [0, 5, 10], [1.4, 0.96, 1], clamp)})`,
        }}
      >
        Bereit.
      </div>
    </div>
  );
};

export const Video: React.FC<{ voice?: boolean; sfx?: boolean }> = ({ voice = true, sfx = true }) => {
  const fr = useCurrentFrame();
  const zoom = punchAt([[0, 1], [T.genau, 1.05], [T.wortEnd + 8, 1]], fr);
  return (
    <AbsoluteFill style={{ backgroundColor: dark }}>
      <Takes C={C} voice={voice} />
      <AbsoluteFill
        style={{
          backgroundColor: dark,
          backgroundImage: "radial-gradient(rgb(255 255 255 / 0.06) 2px, transparent 2px)",
          backgroundSize: "40px 40px",
        }}
      />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
        <Phone fr={fr} />
        <Strip fr={fr} />
        <Struck fr={fr} at={T.fuell} label="Füllwörter" y={980} />
        <Struck fr={fr} at={T.pausen} label="Pausen" y={1130} />
        <BigWord fr={fr} />
        <Terminal fr={fr} />
        <Wave fr={fr} />
        <Checks fr={fr} />
      </AbsoluteFill>
      <HookTitle fr={fr} line1="Claude schneidet" line2="deine Videos." outAt={T.claude - 2} />
      <div
        style={{
          position: "absolute",
          left: X,
          top: STIL.safe.top + 20,
          width: W,
          textAlign: "center",
          ...sans,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: "0.14em",
          color: "rgb(255 255 255 / 0.55)",
          opacity: ramp(fr, T.claude + 4, 8),
        }}
      >
        FABER-CUT · PROBELAUF
      </div>
      <Captions C={C} fr={fr} />
      {sfx && (
        <>
          <Sfx file="pop.mp3" at={T.handy} />
          <Sfx file="whoosh.mp3" at={T.claude} />
          <Sfx file="stamp.mp3" at={T.schneidet + 4} />
          <Sfx file="pop.mp3" at={T.fuell} />
          <Sfx file="pop.mp3" at={T.pausen} />
          <Sfx file="whoosh.mp3" at={T.raus} />
          <Sfx file="tick.mp3" at={T.untertitel} />
          <Sfx file="pop.mp3" at={T.grafik} />
          <Sfx file="stamp.mp3" at={T.genau} />
          <Sfx file="tick.mp3" at={T.wenn} />
          <Sfx file="success.mp3" at={T.bereit} />
        </>
      )}
    </AbsoluteFill>
  );
};
