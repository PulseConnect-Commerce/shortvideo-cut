/**
 * Fertige Grafik-Bausteine für wiederkehrende Stellen: ein Terminal, das tippt, Schritte (Liste oder Schiene), eine
 * Zahl, die hochzählt, die Follow-Karte für den Aufruf, ein Screenshot oder eine Bildschirmaufnahme mit Zoom, und
 * automatische Punch-in-Zooms auf den sichtbaren Schnitten. Jeder Baustein bekommt seine Frames von C.cue("wort"),
 * nie geschätzt. Farben, Schrift und Maße kommen aus STIL (stil.ts): ändere sie dort, nicht hier.
 *
 *   <Terminal fr={fr} at={C.cue("terminal")} until={C.cue("danach")} lines={[
 *     { text: "npm run vorschau", at: C.cue("vorschau") },
 *     { text: "fertig", kind: "ok", at: C.cue("fertig") },
 *   ]} />
 *   <StepList fr={fr} at={…} until={…} items={[{ text: "Clips rein", at: C.cue("clips") }, …]} />
 *   <CountUp fr={fr} a={C.cue("250") - 20} b={C.cue("250")} to={250} label="Downloads" />
 *   <Follow fr={fr} at={C.cue("folg")} tapAt={C.cue("rein")} name="Dein Name" sub="jeden Tag ein Video" avatar="DN" />
 *   const PUNCH = autoPunch(C, { base: [[0, 1], [C.cue("wichtig"), 1.08]], skip: SPLITS });
 */
import { Video } from "@remotion/media";
import type React from "react";
import { Easing, Img, interpolate, Sequence, staticFile } from "remotion";
import { card, clamp, popS, ramp } from "./bausteine";
import type { Cut } from "./schnitt";
import { STIL } from "./stil";

/** Abgang ab `until` (0 → 1); ohne Ende (Infinity) bleibt es stehen */
const leave = (fr: number, until: number, len = 6) =>
  Number.isFinite(until) ? ramp(fr, until, len, Easing.in(Easing.cubic)) : 0;

/** Auftritt auf dem Wort (Pop-in) und weicher Abgang ab `until`: { on, style } für den äußeren Container */
export const appear = (fr: number, at: number, until = Infinity, out = 6) => {
  const o = leave(fr, until, out);
  return {
    on: fr >= at && fr < until + out,
    style: {
      opacity: 1 - o,
      transform: `scale(${popS(fr, at) - 0.04 * o})`,
    } as React.CSSProperties,
  };
};

const box = (x: number, y: number, width: number): React.CSSProperties => ({ position: "absolute", left: x, top: y, width });

/* ---------- Terminal ---------- */

export type TermLine = {
  text: string;
  /** Frame, an dem die Zeile beginnt (C.cue("wort")) */
  at: number;
  /** cmd: getippt, mit "$" davor; out: Ausgabe, erscheint ganz; ok: Ausgabe mit grünem Haken */
  kind?: "cmd" | "out" | "ok";
  /** Frames zum Tippen eines Befehls (Standard: 1,5 Zeichen pro Frame, höchstens bis zur nächsten Zeile) */
  len?: number;
  /** getippt mit der Stimme statt gleichmäßig: C.spoken("der Text", C.W("wort")) */
  parts?: { t: string; a: number; b: number }[];
};

/** Terminal-Fenster: Befehle werden getippt (mit Cursor), Ausgaben erscheinen auf ihrem Frame. */
export const Terminal: React.FC<{
  fr: number;
  at: number;
  until?: number;
  lines: TermLine[];
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
}> = ({ fr, at, until = Infinity, lines, title = "", x = STIL.safe.left, y = 420, width = STIL.safe.width, size = STIL.minText }) => {
  const e = appear(fr, at, until);
  if (!e.on) return null;
  const visible = lines.filter((l) => fr >= l.at);
  const typedText = (l: TermLine, i: number) => {
    if (l.parts) {
      return l.parts
        .map(({ t, a, b }, k) => {
          const n = Math.round(interpolate(fr, [a, Math.max(a + 1, b)], [0, t.length], clamp));
          return (k && fr >= a ? " " : "") + t.slice(0, n);
        })
        .join("");
    }
    const next = lines[i + 1]?.at ?? Infinity;
    const len = Math.max(1, Math.min(l.len ?? Math.ceil(l.text.length / 1.5), next - l.at - 2));
    return l.text.slice(0, Math.round(interpolate(fr, [l.at, l.at + len], [0, l.text.length], clamp)));
  };
  const blink = Math.floor(fr / 15) % 2 === 0;
  return (
    <div style={{ ...box(x, y, width), ...e.style }}>
      <div
        style={{
          background: STIL.ink,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 14px 34px rgb(20 22 26 / 0.28)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 26px", borderBottom: "1px solid rgb(255 255 255 / 0.08)" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 18, height: 18, borderRadius: 99, background: c }} />
          ))}
          {title && <span style={{ fontFamily: STIL.mono, fontSize: 30, color: "rgb(255 255 255 / 0.5)", marginLeft: 12 }}>{title}</span>}
        </div>
        <div style={{ fontFamily: STIL.mono, padding: "20px 28px 24px", fontSize: size, lineHeight: 1.3, color: "#fff", minHeight: size * 1.3 }}>
          {visible.map((l, i) => {
            const kind = l.kind ?? "cmd";
            const last = i === visible.length - 1;
            if (kind === "cmd")
              return (
                <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  <span style={{ color: STIL.yellow }}>$ </span>
                  {typedText(l, lines.indexOf(l))}
                  {last && <span style={{ opacity: blink ? 1 : 0 }}>▍</span>}
                </div>
              );
            return (
              <div key={i} style={{ whiteSpace: "pre-wrap", color: kind === "ok" ? "#fff" : "rgb(255 255 255 / 0.62)", transform: `scale(${popS(fr, l.at)})`, transformOrigin: "left center" }}>
                {kind === "ok" && <span style={{ color: STIL.green }}>✓ </span>}
                {l.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- Schritte ---------- */

export type Step = { text: string; at: number };

/** der Schritt, der gerade dran ist (-1 vor dem ersten) */
const current = (items: Step[], fr: number) => items.reduce((n, s, i) => (fr >= s.at ? i : n), -1);

/** Nummerierte Schritte untereinander: jeder erscheint auf seinem Wort, der gesprochene ist gelb, erledigte haben
 * einen Haken. Für 2-5 Schritte, die er nacheinander nennt. */
export const StepList: React.FC<{
  fr: number;
  at: number;
  until?: number;
  items: Step[];
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
}> = ({ fr, at, until = Infinity, items, title, x = STIL.safe.left, y = 420, width = STIL.safe.width, size = 46 }) => {
  const e = appear(fr, at, until);
  if (!e.on) return null;
  const cur = current(items, fr);
  return (
    <div style={{ ...box(x, y, width), ...e.style }}>
      <div style={{ ...card, padding: "30px 34px", display: "flex", flexDirection: "column", gap: 20 }}>
        {title && <div style={{ fontSize: size * 0.8, fontWeight: 800, color: STIL.muted, letterSpacing: "-0.01em" }}>{title}</div>}
        {items.map((s, i) => {
          if (fr < s.at) return null;
          const on = i === cur;
          const done = i < cur;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, transform: `scale(${popS(fr, s.at)})`, transformOrigin: "left center" }}>
              <span
                style={{
                  width: size * 1.3,
                  height: size * 1.3,
                  borderRadius: 99,
                  flex: "none",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: size * 0.75,
                  background: on ? STIL.yellow : done ? STIL.green : STIL.paper,
                  color: done ? "#fff" : STIL.ink,
                }}
              >
                {done ? "✓" : i + 1}
              </span>
              <span style={{ fontSize: size, fontWeight: on ? 800 : 600, lineHeight: 1.3, color: on ? STIL.ink : STIL.muted, letterSpacing: "-0.01em" }}>
                {s.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Schritt-Schiene: Punkte auf einer Linie, die Linie füllt sich bis zum aktuellen Schritt, der aktuelle ist
 * ausgeschrieben. Für einen Ablauf, der über längere Zeit oben mitläuft (3-6 Schritte, kurze Namen). */
export const StepRail: React.FC<{
  fr: number;
  at: number;
  until?: number;
  items: Step[];
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  /** Farben der Schiene: auf Papier (Standard) oder auf Video/dunkel */
  dark?: boolean;
}> = ({ fr, at, until = Infinity, items, x = STIL.safe.left + 40, y = 280, width = STIL.safe.width - 80, size = STIL.minText, dark = false }) => {
  if (fr < at || fr >= until + 7) return null;
  const o = Math.min(ramp(fr, at, 6), 1 - leave(fr, until, 7));
  const cur = current(items, fr);
  const n = Math.max(1, items.length - 1);
  const fill = cur < 0 ? 0 : (cur + ramp(fr, items[cur].at, 12)) / n;
  const track = dark ? "rgb(255 255 255 / 0.18)" : STIL.line;
  return (
    <div style={{ ...box(x, y, width), height: size * 1.6, opacity: o, fontFamily: STIL.font }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.8 - 2, height: 4, borderRadius: 4, background: track }} />
      <div style={{ position: "absolute", left: 0, top: size * 0.8 - 2, height: 4, borderRadius: 4, width: `${Math.min(1, fill) * 100}%`, background: STIL.yellow }} />
      {items.map((s, i) => {
        const on = i === cur;
        const done = i < cur;
        // der ausgeschriebene Schritt bleibt in der Breite: am Rand nach innen versetzt
        const shift = !on ? -50 : i === 0 ? -15 : i === items.length - 1 ? -85 : -50;
        return (
          <div key={i} style={{ position: "absolute", left: (i / n) * width, top: size * 0.8, zIndex: on ? 2 : 1, transform: `translate(${shift}%, -50%)` }}>
            <span
              style={{
                display: "inline-grid",
                placeItems: "center",
                whiteSpace: "nowrap",
                fontWeight: 900,
                height: on ? size * 1.55 : 30,
                minWidth: on ? size * 1.55 : 30,
                padding: on ? `0 ${size * 0.6}px` : 0,
                borderRadius: 99,
                fontSize: size,
                background: on ? STIL.yellow : done ? (dark ? "#fff" : STIL.ink) : track,
                color: STIL.ink,
                transform: `scale(${on ? popS(fr, s.at) : 1})`,
              }}
            >
              {on ? s.text : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Zahl ---------- */

/** Eine Zahl zählt von `from` auf `to` zwischen Frame a und b (landet auf dem Wort, das sie sagt: b = C.cue("250"))
 * und blitzt beim Ankommen kurz auf. Nur gesprochene oder gemessene Zahlen. */
export const CountUp: React.FC<{
  fr: number;
  a: number;
  b: number;
  to: number;
  from?: number;
  until?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  color?: string;
}> = ({
  fr,
  a,
  b,
  to,
  from = 0,
  until = Infinity,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  x = STIL.safe.left,
  y = 760,
  width = STIL.safe.width,
  size = 220,
  color = STIL.yellow,
}) => {
  if (fr < a || fr >= until + 6) return null;
  const v = from + (to - from) * interpolate(fr, [a, Math.max(a + 1, b)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flash = interpolate(fr, [b, b + 3, b + 12], [0, 1, 0], clamp);
  const o = 1 - leave(fr, until);
  const text = `${prefix}${v.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  return (
    <div style={{ ...box(x, y, width), textAlign: "center", fontFamily: STIL.font, opacity: Math.min(ramp(fr, a, 4), o), transform: `scale(${1 + 0.06 * flash})` }}>
      <div
        style={{
          fontSize: size,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.05em",
          fontVariantNumeric: "tabular-nums",
          color,
          WebkitTextStroke: "8px rgb(20 22 26 / 0.9)",
          paintOrder: "stroke fill",
          textShadow: "0 8px 30px rgb(0 0 0 / 0.4)",
        }}
      >
        {text}
      </div>
      {label && (
        <div style={{ display: "inline-block", marginTop: 18, padding: "14px 30px", borderRadius: 999, background: STIL.ink, color: "#fff", fontSize: 46, fontWeight: 700, whiteSpace: "nowrap" }}>
          {label}
        </div>
      )}
    </div>
  );
};

/* ---------- Follow ---------- */

/** Follow-Karte für den Aufruf: Avatar, Name, Unterzeile, Knopf; auf `tapAt` (dem Wort, mit dem er sagt "folg mir")
 * tippt ein Finger-Ring auf den Knopf und er wechselt auf "gefolgt". `avatar`: Bild (Pfad in public/) oder 1-2 Buchstaben. */
export const Follow: React.FC<{
  fr: number;
  at: number;
  tapAt: number;
  name: string;
  sub?: string;
  avatar?: string;
  until?: number;
  x?: number;
  y?: number;
  width?: number;
  labels?: [string, string];
}> = ({ fr, at, tapAt, name, sub, avatar, until = Infinity, x = STIL.safe.left, y = 1040, width = STIL.safe.width, labels = ["+ Folgen", "✓ Gefolgt"] }) => {
  const e = appear(fr, at, until);
  if (!e.on) return null;
  const tapped = fr >= tapAt + 2;
  const press = interpolate(fr, [tapAt - 4, tapAt + 2, tapAt + 12], [0, 1, 0], clamp);
  const ring = interpolate(fr, [tapAt + 2, tapAt + 12], [0.4, 1.6], clamp);
  const isImg = !!avatar && /\.(png|jpe?g|webp|svg|gif)$/i.test(avatar);
  return (
    <div style={{ ...box(x, y, width), ...e.style }}>
      <div style={{ ...card, padding: "22px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        {avatar && (
          <span style={{ width: 96, height: 96, borderRadius: 26, flex: "none", display: "grid", placeItems: "center", overflow: "hidden", background: STIL.ink, color: "#fff", fontSize: 42, fontWeight: 900 }}>
            {isImg ? <Img src={staticFile(avatar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : avatar}
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 46, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.03em" }}>{name}</div>
          {sub && <div style={{ fontSize: STIL.minText, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: STIL.muted }}>{sub}</div>}
        </div>
        <span style={{ position: "relative", flex: "none" }}>
          <span
            style={{
              display: "inline-block",
              padding: "16px 22px",
              borderRadius: 20,
              fontSize: 44,
              fontWeight: 800,
              whiteSpace: "nowrap",
              background: tapped ? STIL.paper : STIL.yellow,
              color: STIL.ink,
              transform: `scale(${tapped ? popS(fr, tapAt + 2) : 1 - 0.06 * press})`,
            }}
          >
            {tapped ? labels[1] : labels[0]}
          </span>
          {fr >= tapAt - 4 && fr < tapAt + 18 && (
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 90,
                height: 90,
                marginLeft: -45,
                marginTop: -45,
                borderRadius: 99,
                border: "5px solid rgb(20 22 26 / 0.55)",
                background: "rgb(20 22 26 / 0.12)",
                opacity: fr < tapAt + 2 ? press : 1 - ramp(fr, tapAt + 2, 16),
                transform: `scale(${fr < tapAt + 2 ? 0.7 : ring})`,
              }}
            />
          )}
        </span>
      </div>
    </div>
  );
};

/* ---------- Screenshot / Bildschirmaufnahme ---------- */

export type ZoomTo = {
  /** Ausschnitt in Pixeln des Bildes, wie es im Rahmen angezeigt wird (0,0 = oben links) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Frame, an dem der Zoom beginnt (C.cue("wort")); 14 Frames Fahrt */
  at: number;
};

/** Ein Screenshot (png/jpg/webp) oder eine Bildschirmaufnahme (mp4/webm, stumm) aus public/, in einer Karte oder
 * in einem Handy-Rahmen; fährt auf seinen Wörtern an Ausschnitte heran (`zoom`). Nur echtes Material, nie
 * nachgebaut. */
export const Shot: React.FC<{
  fr: number;
  at: number;
  until?: number;
  src: string;
  frame?: "card" | "phone";
  zoom?: ZoomTo[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}> = ({ fr, at, until = Infinity, src, frame = "card", zoom = [], x, y = 380, width, height }) => {
  const e = appear(fr, at, until);
  if (!e.on) return null;
  const phone = frame === "phone";
  const w = width ?? (phone ? 420 : STIL.safe.width);
  const h = height ?? (phone ? 860 : 620);
  const left = x ?? STIL.safe.left + (STIL.safe.width - w) / 2;
  // zum letzten Ausschnitt, dessen Frame erreicht ist, vom vorigen (oder dem ganzen Bild) aus
  const steps = [{ x: 0, y: 0, w, h, at: -Infinity }, ...zoom].filter((z, i) => i === 0 || fr >= z.at - 1);
  const to = steps[steps.length - 1];
  const prev = steps.length > 1 ? steps[steps.length - 2] : to;
  const k = steps.length > 1 ? ramp(fr, to.at, 14, Easing.inOut(Easing.cubic)) : 1;
  const mix = (p: number, q: number) => p + (q - p) * k;
  const zx = mix(prev.x, to.x);
  const zy = mix(prev.y, to.y);
  const zw = mix(prev.w, to.w);
  const zh = mix(prev.h, to.h);
  const s = Math.min(w / zw, h / zh);
  const tx = -zx * s + (w - zw * s) / 2;
  const ty = -zy * s + (h - zh * s) / 2;
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  const media: React.CSSProperties = { width: w, height: h, objectFit: "cover", objectPosition: "top", display: "block" };
  return (
    <div style={{ ...box(left, y, w), ...e.style }}>
      <div
        style={{
          ...card,
          width: w,
          height: h,
          overflow: "hidden",
          borderRadius: phone ? 56 : 28,
          border: phone ? `14px solid ${STIL.ink}` : undefined,
          boxSizing: "content-box",
        }}
      >
        <div style={{ width: w, height: h, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
          {isVideo ? (
            <Sequence from={at} layout="none">
              <Video src={staticFile(src)} muted style={media} />
            </Sequence>
          ) : (
            <Img src={staticFile(src)} style={media} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Automatische Zooms ---------- */

/**
 * Punch-in-Stufen für punchAt(): deine eigenen Stufen (`base`, auf betonten Wörtern) plus ein Wechsel auf jedem
 * sichtbaren Schnitt, abwechselnd `low` und `high` (so wirkt ein Jump-Cut wie ein Kamerawechsel statt wie ein
 * Sprung). `skip`: Bereiche [von, bis] in Frames ohne Auto-Zoom (Splitscreen, Vollbild-Grafiken).
 */
export const autoPunch = (
  C: Cut,
  { base = [[0, 1]], skip = [], low = 1, high = 1.07 }: { base?: [number, number][]; skip?: [number, number][]; low?: number; high?: number } = {},
): [number, number][] => {
  const cuts = C.SPANS.map((s) => s.at).filter((at) => at > 0 && !skip.some(([a, b]) => at >= a && at < b));
  const AUTO = 0;
  return [...base, ...cuts.map((at): [number, number] => [at, AUTO])]
    .sort((p, q) => p[0] - q[0])
    .reduce<[number, number][]>((acc, [at, z]) => {
      const prev = acc.length ? acc[acc.length - 1][1] : low;
      acc.push([at, z === AUTO ? (prev >= (low + high) / 2 ? low : high) : z]);
      return acc;
    }, []);
};
