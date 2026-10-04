/**
 * Das Platzierungsraster als Ebene über dem Video: 60-px-Raster (beschriftet alle 120 px), die sichere Fläche (grün),
 * das Untertitel-Band (gelb) und die Bereiche, die TikTok (türkis) und Instagram (pink) mit Knöpfen und Text
 * überdecken. Die Maße stehen in zonen.json, dieselben liest tools/grid.py.
 *
 *   {raster && <Raster />}     in Video.tsx; Standbild mit Raster:
 *   npm run still -- <Komposition> out/raster.jpg --frame=120 --scale=0.5 --props='{"raster":true}'
 *
 * `p` (0-1) blendet es ein, z. B. für eine Erklär-Szene.
 */
import type React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { STIL } from "./stil";
import zonen from "./zonen.json";

const W = 1080;
const H = 1920;
const TIKTOK = "#25F4EE";
const INSTA = "#FF3C8E";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Rect = number[];
const box = (r: Rect): React.CSSProperties => ({
  position: "absolute",
  left: r[0],
  top: r[1],
  width: r[2] - r[0],
  height: r[3] - r[1],
});
const hatch = (c: string) =>
  `repeating-linear-gradient(135deg, ${c}55 0 10px, transparent 10px 22px)`;

export const Raster: React.FC<{ p?: number; tiktok?: number; instagram?: number; labels?: boolean }> = ({
  p = 1,
  tiktok = 1,
  instagram = 1,
  labels = true,
}) => {
  const grid = interpolate(p, [0, 0.6], [0, 1], clamp);
  const lines = [];
  for (let x = 0; x <= W; x += 60)
    lines.push(
      <div
        key={`x${x}`}
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: x % 120 ? 1 : 2,
          height: H * grid,
          background: `rgb(255 255 255 / ${x % 120 ? 0.14 : 0.3})`,
        }}
      />,
    );
  for (let y = 0; y <= H; y += 60)
    lines.push(
      <div
        key={`y${y}`}
        style={{
          position: "absolute",
          top: y,
          left: 0,
          height: y % 120 ? 1 : 2,
          width: W * grid,
          background: `rgb(255 255 255 / ${y % 120 ? 0.14 : 0.3})`,
        }}
      />,
    );
  const label = (text: string, color: string, style: React.CSSProperties) =>
    labels && (
      <div
        style={{
          position: "absolute",
          fontFamily: STIL.font,
          fontWeight: 700,
          fontSize: 42,
          color: STIL.ink,
          background: color,
          padding: "4px 14px",
          borderRadius: 10,
          whiteSpace: "nowrap",
          ...style,
        }}
      >
        {text}
      </div>
    );
  const zone = (r: Rect, c: string, o: number) => (
    <div style={{ ...box(r), background: hatch(c), border: `3px solid ${c}`, opacity: o }} />
  );
  return (
    <AbsoluteFill style={{ opacity: interpolate(p, [0, 0.2], [0, 1], clamp) }}>
      {lines}
      {labels &&
        [120, 240, 360, 480, 600, 720, 840, 960].map((x) => (
          <div key={`lx${x}`} style={{ position: "absolute", left: x + 4, top: 136, fontFamily: STIL.mono, fontSize: 24, color: STIL.yellow, opacity: grid }}>
            {x}
          </div>
        ))}
      {labels &&
        [240, 480, 720, 960, 1200, 1440, 1680].map((y) => (
          <div key={`ly${y}`} style={{ position: "absolute", left: 6, top: y + 4, fontFamily: STIL.mono, fontSize: 24, color: STIL.yellow, opacity: grid }}>
            {y}
          </div>
        ))}
      {Object.values(zonen.tiktok).map((r, i) => <div key={`t${i}`}>{zone(r, TIKTOK, tiktok)}</div>)}
      {Object.values(zonen.instagram).map((r, i) => <div key={`i${i}`}>{zone(r, INSTA, instagram)}</div>)}
      <div style={{ ...box(zonen.sicher), border: "5px solid #3CDC78", borderRadius: 6, opacity: grid }} />
      <div style={{ ...box(zonen.untertitel), border: `3px solid ${STIL.yellow}`, background: `${STIL.yellow}22`, opacity: grid }} />
      {label("TikTok", TIKTOK, { left: zonen.tiktok.rechts[0] - 150, top: zonen.tiktok.rechts[1] + 340, opacity: tiktok })}
      {label("Instagram", INSTA, { left: zonen.instagram.unten[0] + 70, top: zonen.instagram.unten[1] + 30, opacity: instagram })}
      {label("sichere Fläche", "#3CDC78", { left: zonen.sicher[0] + 10, top: zonen.sicher[1] + 10, opacity: grid })}
    </AbsoluteFill>
  );
};
