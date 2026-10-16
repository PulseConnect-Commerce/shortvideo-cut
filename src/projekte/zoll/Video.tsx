/**
 * Format NEWS/Reaction im schlichten Test-Stil (seine Vorgabe 2026-10-16: "schlichte Untertitel und keine B-Rolls …
 * sehr natürlich … mit wenigen Schnitten"). "Zollkontrollen in der EU": nur 65 Zollinterventionen pro Million
 * Einfuhrartikel 2025 (DIHK/HDE-Impulspapier vom 14.10.2026, Prüfquote 0,0065 %, Bericht der DG TAXUD), Artikel auf
 * onlinemarktplatz.de vom 15.10.2026. Sein Plan: direkt mit der Zahl "65 von 1.000.000" starten, danach die
 * Originalüberschrift zeigen, bei den Händlerpflichten schnelle Texteinblendungen, am Ende er mit der Frage.
 * Schlicht umgesetzt: die Zahl oben über dem Kopf, die Schlagzeile als Screenshot auf der Brust, die Pflichten als
 * weiße Zeilen; keine Zooms, keine Soundeffekte, keine Musik, Fassung B (ohne "fordere ich …").
 */
import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, Sfx, Takes } from "../../lib/bausteine";
import { EditorialUntertitel } from "../../lib/editorial";
import { autoPunch } from "../../lib/kit";
import { STIL } from "../../lib/stil";
import { DesignRahmen } from "../../lib/design";
import { Raster } from "../../lib/raster";
import { SchlichterText, SchlichteUntertitel } from "../../lib/schlicht";
import { createCut } from "../../lib/schnitt";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Zoll", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

/** Bildlage nach seinem Referenzvideo: Augen bei y ~740, Kopf ab ~400, Brust ab ~1090 */
const BILD = { scale: 1.3, hoch: 581, x: 65 };
const UT_TOP = 1405;

const HOOK_ENDE = C.WE("überrascht") + 6;
const SCHLAGZEILE = F("schaut");
const SCHLAGZEILE_ENDE = C.WE("artikel", F("million")) + 10;
const PFLICHTEN = [
  { at: F("produkt"), text: "Produktsicherheit" },
  { at: F("kennzeichnungen"), text: "Kennzeichnung" },
  { at: F("verpackungspflichten"), text: "Verpackungspflichten" },
  { at: F("steuern"), text: "Steuern" },
];
const PFLICHTEN_ENDE = F("gleichzeitig") - 4;

/** "editorial": Look nach seinem Referenzvideo vom 2026-10-16 (Untertitel oben, betonte Wörter in Serifen-Kursive,
 * weites/enges Bild im Wechsel bei jedem Schnitt, leise Klicks auf Einblendungen); "schlicht": Test vom 2026-10-16 */
type Props = { voice?: boolean; raster?: boolean; untertitel?: boolean; look?: "schlicht" | "editorial"; hook?: "a" | "c" };

/** während der Hook (das erste Schnittstück) liegt das Bild etwas tiefer, damit die zweizeilige Hook über dem Kopf
 * Platz hat; der Wechsel fällt mit dem ersten Schnitt zusammen */
const HOOK_TIEFER = 130;
const SERIF = { fontFamily: '"Playfair Display", serif', fontWeight: 900, fontStyle: "italic" } as const;
const ANTON = { fontFamily: "Anton, sans-serif", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.01em" } as const;
const HookZoll: React.FC<{ fr: number; v: "a" | "c" }> = ({ fr, v }) => {
  const o = interpolate(fr, [0, 4, HOOK_ENDE, HOOK_ENDE + 5], [1, 1, 1, 0], clamp);
  const zeile = (at: number) => interpolate(fr, [at, at + 6], [0, 1], clamp);
  const box: React.CSSProperties = { position: "absolute", left: 0, width: 1080, textAlign: "center", color: "#fff", textShadow: "0 3px 6px rgb(0 0 0 / 0.55), 0 0 26px rgb(0 0 0 / 0.35)", opacity: o, whiteSpace: "nowrap" };
  return v === "a" ? (
    <>
      <div style={{ ...box, ...SERIF, top: 250, fontSize: 168, lineHeight: 1, color: "#00F090", opacity: o * zeile(0) }}>Nur 65</div>
      <div style={{ ...box, ...ANTON, top: 432, fontSize: 54, lineHeight: 1, opacity: o * zeile(8) }}>von 1.000.000 Importen kontrolliert</div>
    </>
  ) : (
    <>
      <div style={{ ...box, ...ANTON, top: 262, fontSize: 64, lineHeight: 1, opacity: o * zeile(0) }}>Der Zoll kontrolliert nur</div>
      <div style={{ ...box, ...SERIF, top: 330, fontSize: 176, lineHeight: 1, color: "#00F090", opacity: o * zeile(8) }}>0,0065 %</div>
    </>
  );
};

const BETONT = ["zoll", "überrascht", "meldung", "65", "million", "0,0065", "vorschriften", "steuern", "milliarden", "sinn", "diskussionswürdig", "regeln", "illegal", "kontrollen", "temu"];
const FARBIG = ["65", "0,0065", "illegal"];
const ERSTER_SCHNITT = C.SPANS[1]?.at ?? C.DURATION;
const PUNCH = autoPunch(C, { low: 1, high: 1.08 });
const punchAt = (fr: number) => PUNCH.reduce((z, [at, v]) => (fr >= at ? v : z), 1);

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, raster = false, untertitel = true, look = "editorial", hook = "a" }) => {
  const fr = useCurrentFrame();
  const ed = look === "editorial";
  const karte = interpolate(fr, [SCHLAGZEILE, SCHLAGZEILE + 5, SCHLAGZEILE_ENDE, SCHLAGZEILE_ENDE + 5], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${ed ? punchAt(fr) : 1})`, transformOrigin: "540px 740px" }}>
        <Takes C={C} voice={voice} transform={`translate(${-BILD.x}px, ${-(BILD.hoch - (ed && fr < ERSTER_SCHNITT ? HOOK_TIEFER : 0))}px) scale(${BILD.scale})`} transformOrigin="50% 0%" />
      </AbsoluteFill>

      {/* direkt mit der Zahl starten */}
      {ed ? (
        <HookZoll fr={fr} v={hook} />
      ) : (
        <SchlichterText fr={fr} at={0} until={HOOK_ENDE} top={262} size={92} style={{ whiteSpace: "nowrap", left: 40, width: 1000 }}>
          65 von 1.000.000
        </SchlichterText>
      )}

      {/* Originalüberschrift (onlinemarktplatz.de, 15.10.2026) */}
      {karte > 0 && (
        <Img
          src={staticFile("broll/zoll/schlagzeile.png")}
          style={{
            position: "absolute",
            left: 170,
            top: 1025,
            width: 720,
            borderRadius: 18,
            boxShadow: "0 14px 34px rgb(0 0 0 / 0.4)",
            opacity: karte,
          }}
        />
      )}

      {/* Händlerpflichten: schnelle schlichte Zeilen */}
      {PFLICHTEN.map((x, i) => (
        <SchlichterText key={x.text} fr={fr} at={x.at} until={PFLICHTEN_ENDE} top={1085 + i * 76} size={ed ? 66 : 58} style={ed ? { fontFamily: "Anton, sans-serif", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.01em" } : undefined}>
          {x.text}
        </SchlichterText>
      ))}

      {untertitel && !ed && <SchlichteUntertitel C={C} fr={fr} top={UT_TOP} />}
      {untertitel && ed && (
        <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={330} off={[[0, HOOK_ENDE + 4]]} />
      )}
      {ed && (
        <>
          <Sfx file="klick.mp3" at={SCHLAGZEILE} volume={STIL.sfx * 0.35} />
          {PFLICHTEN.map((x) => (
            <Sfx key={x.text} file="klick.mp3" at={x.at} volume={STIL.sfx * 0.3} />
          ))}
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
