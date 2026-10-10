/**
 * B-Roll für HERO-Videos (Skill stil-hero): Bildkarten über dem Kopf (die freie Wand oben, y 262-692), pro Thema eine
 * Szene mit Icons und Begriffen, die auf ihrem Wort erscheinen. Alle Zeitpunkte kommen aus C.cue("wort").
 */
import type React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import { clamp, popS, ramp } from "./bausteine";
import { chip, type Design, mass, schriftCss, setze, useDesign } from "./design";
import { fitSize, textWidth } from "./messen";
import { STIL } from "./stil";

/** Platz für die Bildkarte: über dem Kopf, mittig (links und rechts je 95 px frei). Unten rechts ragt nur das Foto
 * in TikToks Knopfspalte (ab x 960, y 620): dort nie einen Begriff hinsetzen (Karte x < 865, wenn y > 358). */
export const BOX = { left: 95, top: 262, width: 890, height: 430 };

const leave = (fr: number, until: number, len = 6) => (Number.isFinite(until) ? ramp(fr, until, len, Easing.in(Easing.cubic)) : 0);

/** Weißer Chip mit Schatten: hält Text und Icons auf einem Foto lesbar (der Chip von "pulse"; im Design: D.chip) */
export { chip };

/** Die Bildkarte einer Szene: poppt auf ihrem Wort auf, Kopfzeile mit Nummer (1-5) und Titel, geht ab `until`.
 * `photo` (Pfad in public/, z. B. von npm run bild): füllt die Karte und fährt langsam heran (100 % → 106 %); der
 * Titel liegt dann als weißer Chip darauf. `vollbild`: das Foto füllt oben die ganze Breite bis zum oberen Rand
 * (0-1080, 0-752), ohne Rahmen und Ecken; Titel und Begriffe bleiben, wo sie sonst liegen (in der sicheren Fläche).
 * `frei`: keine Karte und kein Foto, Titel und Begriffe stehen als weiße Chips direkt über dem Kopf im Bild. */
export const Szene: React.FC<{
  fr: number;
  at: number;
  until: number;
  nr?: number;
  title: string;
  titleAt?: number;
  photo?: string;
  vollbild?: boolean;
  frei?: boolean;
  children?: React.ReactNode;
}> = ({ fr, at, until, nr, title, titleAt = at, photo, vollbild = false, frei = false, children }) => {
  const D = useDesign();
  if (fr < at || fr >= until + 6) return null;
  const o = leave(fr, until);
  const [tw, tsp, tfam] = mass(D.titel);
  const titel = setze(D.titel, title);
  const size = fitSize(titel, BOX.width - (nr ? 150 : 70), 52, tw, tsp, 24, tfam);
  const push = Number.isFinite(until) ? interpolate(fr, [at, until], [1, 1.06], clamp) : 1;
  // Vollbild: die Fläche reicht von oben bis zur Unterkante der Karte; der Inhalt sitzt an der gewohnten Stelle
  // (60 px mehr nach unten, damit auch die untersten Begriffe Abstand zur Unterkante des Bildes haben)
  const outer = vollbild ? { left: 0, top: 0, width: 1080, height: BOX.top + BOX.height + 60 } : BOX;
  const inner = vollbild ? { left: BOX.left, top: BOX.top } : { left: 0, top: 0 };
  return (
    <div
      style={{
        ...D.karte,
        ...(vollbild ? { borderRadius: 0, boxShadow: "none", border: "none" } : {}),
        ...(frei ? { background: "transparent", boxShadow: "none", border: "none", overflow: "visible" } : {}),
        position: "absolute",
        left: outer.left,
        top: outer.top,
        width: outer.width,
        height: outer.height,
        overflow: "hidden",
        opacity: vollbild ? Math.min(ramp(fr, at, 5), 1 - o) : 1 - o,
        transform: vollbild ? `translateY(${-30 * (1 - ramp(fr, at, 6)) - 30 * o}px)` : `scale(${popS(fr, at) - 0.04 * o})`,
        transformOrigin: "50% 100%",
      }}
    >
      {photo && (
        <Img
          src={staticFile(photo)}
          style={{ position: "absolute", left: 0, top: 0, width: outer.width, height: outer.height, objectFit: "cover", transform: `scale(${push})` }}
        />
      )}
      <div style={{ position: "absolute", left: inner.left, top: inner.top, width: BOX.width, height: BOX.height }}>
      <div
        style={{
          position: "absolute",
          left: photo ? 22 : 34,
          top: photo ? 20 : 28,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: ramp(fr, titleAt, 4),
          ...(photo || frei ? { ...D.titelChip, padding: nr !== undefined ? "8px 30px 8px 8px" : "10px 30px" } : {}),
        }}
      >
        {nr !== undefined && (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 99,
              flex: "none",
              display: "grid",
              placeItems: "center",
              background: D.nummer.background,
              ...(D.name === "pulse" ? { fontWeight: 900 } : schriftCss(D.titel)),
              fontSize: 46,
              color: D.nummer.color,
            }}
          >
            {nr}
          </div>
        )}
        <div style={{ ...schriftCss(D.titel), fontSize: size, whiteSpace: "nowrap" }}>{titel}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: BOX.width, height: BOX.height }}>{children}</div>
      </div>
    </div>
  );
};

/** Ein Element der Szene (Koordinaten in der Karte), poppt auf seinem Wort auf */
export const Pop: React.FC<{
  fr: number;
  at: number;
  until?: number;
  x: number;
  y: number;
  w?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ fr, at, until = Infinity, x, y, w, style, children }) => {
  if (fr < at || fr >= until + 5) return null;
  const o = leave(fr, until, 5);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: 1 - o,
        transform: `scale(${popS(fr, at) - 0.06 * o})`,
        transformOrigin: "left center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Zeile: Icon und Begriff (≥ 46 px), rechts optional ein Haken oder ein Kreuz; auf einem Foto als weißer Chip
 * (`onPhoto`, so breit wie der Inhalt) */
export const Row: React.FC<{
  icon?: React.ReactNode;
  text: string;
  mark?: "ok" | "no";
  size?: number;
  width?: number;
  color?: string;
  onPhoto?: boolean;
}> = ({ icon, text, mark, size = 46, width = 400, color, onPhoto = false }) => {
  const D = useDesign();
  const [w, sp, fam] = mass(D.text);
  const t = setze(D.text, text);
  const fs = fitSize(t, width - (icon ? 92 : 0) - (mark ? 70 : 0), size, w, sp, 24, fam);
  return (
    <div
      style={{
        display: onPhoto ? "inline-flex" : "flex",
        alignItems: "center",
        gap: 18,
        width: onPhoto ? undefined : width,
        ...(onPhoto ? { ...D.chip, padding: icon ? "6px 20px 6px 8px" : "12px 22px" } : {}),
      }}
    >
      {icon && <div style={{ width: 74, height: 74, flex: "none", display: "grid", placeItems: "center" }}>{icon}</div>}
      <div style={{ ...schriftCss(D.text), fontSize: fs, whiteSpace: "nowrap", color: color ?? (onPhoto ? D.chipText : D.kartenText), flex: onPhoto ? "none" : 1 }}>{t}</div>
      {mark && <Mark ok={mark === "ok"} size={54} />}
    </div>
  );
};

/** grüner Haken oder rotes Kreuz im Kreis */
export const Mark: React.FC<{ ok: boolean; size?: number }> = ({ ok, size = 54 }) => {
  const D = useDesign();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flex: "none" }}>
      <circle cx="24" cy="24" r="22" fill={ok ? D.ok : D.warn} />
      {ok ? (
        <path d="M14 25 l7 7 l13 -15" stroke={D.okZeichen} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M16 16 L32 32 M32 16 L16 32" stroke={D.warnZeichen} strokeWidth="5" strokeLinecap="round" />
      )}
    </svg>
  );
};

/** Pille auf der Karte (Akzent, Warnung, ok) */
export const Tag: React.FC<{ children: React.ReactNode; kind?: "accent" | "warn" | "ok" | "ink"; size?: number }> = ({ children, kind = "accent", size = 46 }) => {
  const D = useDesign();
  const { background: bg, color } = D.tags[kind];
  const pulse = D.name === "pulse";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: `${size * 0.32}px ${size * 0.62}px`,
        borderRadius: 999,
        background: bg,
        color,
        ...(pulse ? { fontWeight: 800, letterSpacing: "-0.01em" } : schriftCss(D.titel)),
        fontSize: size,
        whiteSpace: "nowrap",
        ...D.tag,
      }}
    >
      {typeof children === "string" ? setze(D.titel, children) : children}
    </div>
  );
};

/** Breite einer Pille (Tag) in px im Design D: um die nächste Pille daneben zu setzen */
export const tagBreite = (D: Design, text: string, size = 46) => {
  const [w, sp, fam] = D.name === "pulse" ? ([800, -0.01, "Geist"] as const) : mass(D.titel);
  return Math.ceil(textWidth(setze(D.titel, text), size, w, sp, fam) + 2 * 0.62 * size);
};

/** Breite einer Zeile als Chip (`<Row onPhoto>`) in px im Design D: um etwas rechts daneben zu setzen */
export const rowBreite = (D: Design, text: string, { icon = false, mark = false, size = 46, width = 400 } = {}) => {
  const [w, sp, fam] = mass(D.text);
  const t = setze(D.text, text);
  const fs = fitSize(t, width - (icon ? 92 : 0) - (mark ? 70 : 0), size, w, sp, 24, fam);
  const rand = D.chip.border ? 4 : 0;
  return Math.ceil((icon ? 8 + 74 + 18 + 20 : 44) + textWidth(t, fs, w, sp, fam) + (mark ? 18 + 54 : 0) + rand);
};

/* ---------- Icons (SVG, Linien in Tinte, Akzent in der Akzentfarbe) ---------- */

const ink = STIL.ink;
const sw = 4;
type IconP = { size?: number; color?: string };

export const IconStopwatch: React.FC<IconP & { turn?: number }> = ({ size = 74, turn = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="27" y="4" width="10" height="7" rx="2" fill={ink} />
    <circle cx="32" cy="36" r="22" fill="#fff" stroke={ink} strokeWidth={sw} />
    <path d={`M32 36 L32 ${36 - 15}`} stroke={STIL.yellow} strokeWidth="5" strokeLinecap="round" transform={`rotate(${turn * 360} 32 36)`} />
    <circle cx="32" cy="36" r="3.5" fill={ink} />
  </svg>
);
export const IconBrowser: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="6" y="10" width="52" height="44" rx="6" fill="#fff" stroke={ink} strokeWidth={sw} />
    <path d="M6 22 H58" stroke={ink} strokeWidth={sw} />
  </svg>
);
export const IconText: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M12 16 H52 M12 28 H52 M12 40 H44 M12 52 H36" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
  </svg>
);
export const IconImage: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="8" y="12" width="48" height="40" rx="6" fill="#fff" stroke={ink} strokeWidth={sw} />
    <circle cx="22" cy="25" r="5" fill={STIL.yellow} />
    <path d="M10 48 L26 34 L36 42 L44 34 L54 44" stroke={ink} strokeWidth={sw} fill="none" strokeLinejoin="round" />
  </svg>
);
export const IconPrice: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M30 8 H54 V32 L30 56 L8 34 Z" fill="#fff" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <circle cx="44" cy="18" r="4" fill={STIL.yellow} stroke={ink} strokeWidth="2" />
  </svg>
);
export const IconBuilding: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="14" y="8" width="36" height="50" rx="3" fill="#fff" stroke={ink} strokeWidth={sw} />
    {[18, 28, 38].map((y) => [22, 36].map((x) => <rect key={`${x}${y}`} x={x} y={y} width="6" height="6" fill={ink} />))}
    <rect x="28" y="46" width="8" height="12" fill={STIL.yellow} stroke={ink} strokeWidth="2" />
  </svg>
);
export const IconPin: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 58 C32 58 12 38 12 25 A20 20 0 0 1 52 25 C52 38 32 58 32 58 Z" fill={STIL.yellow} stroke={ink} strokeWidth={sw} />
    <circle cx="32" cy="25" r="7" fill="#fff" stroke={ink} strokeWidth={sw} />
  </svg>
);
export const IconMail: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="8" y="14" width="48" height="36" rx="5" fill="#fff" stroke={ink} strokeWidth={sw} />
    <path d="M10 18 L32 36 L54 18" stroke={ink} strokeWidth={sw} fill="none" strokeLinejoin="round" />
  </svg>
);
export const IconSearch: React.FC<IconP> = ({ size = 74, color = ink }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="27" cy="27" r="16" fill="none" stroke={color} strokeWidth="5" />
    <path d="M39 39 L54 54" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);
export const IconDoc: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M14 6 H40 L52 18 V58 H14 Z" fill="#fff" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M40 6 V18 H52" fill="none" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M22 30 H44 M22 39 H44 M22 48 H36" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);
export const IconCookie: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 6 A26 26 0 1 0 58 34 A9 9 0 0 1 46 22 A9 9 0 0 1 32 6 Z" fill="#E9C58F" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    {[[22, 24], [36, 38], [20, 42], [44, 48], [30, 52]].map(([x, y]) => (
      <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" fill={ink} />
    ))}
  </svg>
);
export const IconCash: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="6" y="16" width="52" height="32" rx="5" fill="#fff" stroke={ink} strokeWidth={sw} />
    <circle cx="32" cy="32" r="8" fill="none" stroke={ink} strokeWidth={sw} />
  </svg>
);
export const IconCoin: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="24" fill="#F2B544" stroke={ink} strokeWidth={sw} />
    {/* das Bitcoin-Zeichen selbst gezeichnet (₿ fehlt in Geist): ein B mit zwei Strichen oben und unten */}
    <text x="33" y="43" textAnchor="middle" fontFamily="Geist, sans-serif" fontWeight="900" fontSize="30" fill={ink}>
      B
    </text>
    <path d="M29 14 V20 M35 14 V20 M29 44 V50 M35 44 V50" stroke={ink} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
export const IconShield: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 5 L54 13 V30 C54 45 44 54 32 59 C20 54 10 45 10 30 V13 Z" fill={STIL.accent2} stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M21 32 l8 8 l14 -16" stroke={ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconCard: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="6" y="14" width="52" height="36" rx="5" fill="#fff" stroke={ink} strokeWidth={sw} />
    <path d="M6 24 H58" stroke={ink} strokeWidth="7" />
    <rect x="12" y="36" width="14" height="6" rx="2" fill={STIL.yellow} />
  </svg>
);
export const IconWarn: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 6 L60 56 H4 Z" fill="#F2B544" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M32 24 V40" stroke={ink} strokeWidth="6" strokeLinecap="round" />
    <circle cx="32" cy="48" r="3.5" fill={ink} />
  </svg>
);
export const IconPlug: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M24 6 V18 M40 6 V18" stroke={ink} strokeWidth="5" strokeLinecap="round" />
    <path d="M14 18 H50 V30 C50 40 42 46 32 46 C22 46 14 40 14 30 Z" fill={STIL.yellow} stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M32 46 V58" stroke={ink} strokeWidth="5" strokeLinecap="round" />
  </svg>
);
/** Die durchgestrichene Mülltonne (Kennzeichen nach WEEE/ElektroG) */
export const IconBin: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M16 16 H48 M28 10 H36" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
    <path d="M19 18 L22 50 H42 L45 18" fill="#fff" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <circle cx="25" cy="54" r="4" fill={ink} />
    <path d="M8 8 L56 58 M56 8 L8 58" stroke={ink} strokeWidth="4" strokeLinecap="round" />
  </svg>
);
export const IconBattery: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x="6" y="18" width="46" height="28" rx="5" fill="#fff" stroke={ink} strokeWidth={sw} />
    <rect x="52" y="26" width="6" height="12" rx="2" fill={ink} />
    <rect x="11" y="23" width="24" height="18" rx="2" fill={STIL.accent2} />
  </svg>
);
export const IconBox: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M32 6 L56 18 V46 L32 58 L8 46 V18 Z" fill="#D9B98C" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M8 18 L32 30 L56 18 M32 30 V58" fill="none" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
  </svg>
);
export const IconEye: React.FC<IconP> = ({ size = 74 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M4 32 C14 16 50 16 60 32 C50 48 14 48 4 32 Z" fill="#fff" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <circle cx="32" cy="32" r="9" fill={STIL.yellow} stroke={ink} strokeWidth={sw} />
  </svg>
);
export const IconBookmark: React.FC<IconP & { fill?: number }> = ({ size = 74, fill = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <defs>
      <clipPath id="bm">
        <path d="M16 6 H48 V58 L32 46 L16 58 Z" />
      </clipPath>
    </defs>
    <path d="M16 6 H48 V58 L32 46 L16 58 Z" fill="#fff" />
    <rect x="0" y={64 - 64 * fill} width="64" height="64" fill={STIL.save} clipPath="url(#bm)" />
    <path d="M16 6 H48 V58 L32 46 L16 58 Z" fill="none" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
  </svg>
);

/** Mini-Shop im Browserfenster: Kopf, drei Produkte (Bild, Titelzeile, Preis); `wonky` 0-1 bringt alles durcheinander */
export const ShopMock: React.FC<{ x: number; y: number; w: number; h: number; wonky?: number; hi?: "text" | "bild" | "preis" | null }> = ({
  x,
  y,
  w,
  h,
  wonky = 0,
  hi = null,
}) => {
  const tile = (w - 60) / 3;
  const ring = (on: boolean) => (on ? `0 0 0 5px ${STIL.yellow}` : "none");
  const colors = ["#C9D7E8", "#E8D6C3", "#D3E5D0"];
  const tilt = [-7, 5, -4];
  const drop = [18, -10, 26];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, border: `4px solid ${ink}`, background: "#fff", overflow: "hidden" }}>
      <div style={{ height: 44, borderBottom: `4px solid ${ink}`, display: "flex", alignItems: "center", gap: 10, paddingLeft: 16 }}>
        {[STIL.red, "#F2B544", STIL.accent2].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c }} />
        ))}
        <div style={{ marginLeft: 12, height: 18, width: w * 0.5, borderRadius: 9, background: STIL.line }} />
      </div>
      <div style={{ display: "flex", gap: 15, padding: 15 }}>
        {colors.map((c, i) => (
          <div
            key={c}
            style={{
              width: tile,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              transform: `translateY(${drop[i] * wonky}px) rotate(${tilt[i] * wonky}deg)`,
            }}
          >
            <div style={{ height: h * 0.42, borderRadius: 10, background: c, boxShadow: ring(hi === "bild") }} />
            <div style={{ height: 14, width: "90%", borderRadius: 7, background: STIL.muted, boxShadow: ring(hi === "text") }} />
            <div style={{ height: 14, width: "60%", borderRadius: 7, background: STIL.line, boxShadow: ring(hi === "text") }} />
            <div style={{ height: 26, width: "55%", borderRadius: 8, background: ink, boxShadow: ring(hi === "preis") }} />
          </div>
        ))}
      </div>
    </div>
  );
};

/** Suchfeld, in dem Text getippt wird (mit Cursor) */
export const SearchBar: React.FC<{ fr: number; text: string; x: number; y: number; w: number }> = ({ fr, text, x, y, w }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 92,
      borderRadius: 999,
      background: "#fff",
      border: `4px solid ${ink}`,
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 28px",
      boxSizing: "border-box",
      boxShadow: "0 10px 26px rgb(20 22 26 / 0.18)",
    }}
  >
    <IconSearch size={54} />
    <div style={{ fontSize: 46, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden" }}>
      {text}
      <span style={{ opacity: Math.floor(fr / 8) % 2 ? 0 : 1, color: STIL.yellow }}>|</span>
    </div>
  </div>
);

/** Rabatt-Schild */
export const SaleTag: React.FC<{ text: string; rot?: number }> = ({ text, rot = 0 }) => (
  <div
    style={{
      display: "inline-block",
      padding: "18px 34px",
      borderRadius: 18,
      background: STIL.red,
      color: "#fff",
      fontWeight: 900,
      fontSize: 92,
      letterSpacing: "-0.03em",
      transform: `rotate(${rot}deg)`,
      boxShadow: "0 12px 30px rgb(20 22 26 / 0.25)",
    }}
  >
    {text}
  </div>
);

/** sanftes Ein- und Ausblenden eines Werts (0-1) zwischen zwei Frames */
export const between = (fr: number, a: number, b: number, len = 8) =>
  interpolate(fr, [a, a + len, b, b + len], [0, 1, 1, 0], clamp);
