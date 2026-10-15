/**
 * Vorlage für die Serie "E-Commerce einfach erklärt" (Format FACE, Skill stil-face, Design nacht/Neon): Face-Up,
 * One-Take, minimaler Schnitt. Bildlage wie Temu/Produkthaftung (1,2-fach, Bild bis unten gefüllt, Kopf ab y ~440,
 * in der Hook etwas tiefer), Hook oben, danach pro Gedanke ein kurzer Titel und eine mittige Zeile weißer Chips
 * direkt über dem Kopf (der Titel macht dem ersten Chip Platz), höchstens ein Chip pro Szene in der Leuchtfarbe.
 * Wenige Effekte (Whoosh bei neuen Szenen, ein Stempel auf der Kernzahl), kein Riser.
 * Liegt in "_serie", damit Root.tsx sie nicht als eigene Komposition anmeldet.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { BOX, Pop, Szene, Tag, tagBreite } from "../../lib/broll";
import { DesignRahmen, type DesignName, Toenung, useDesign } from "../../lib/design";
import { Raster } from "../../lib/raster";
import type { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";

type Cut = ReturnType<typeof createCut>;

/** ein Chip: erscheint auf `at`; `neu` beginnt eine neue Zeile (die vorherigen Chips gehen) */
export type Chip = { at: number; text: string; wichtig?: boolean; neu?: boolean; stempel?: boolean };
export type SerienSzene = { at: number; title: string; chips: Chip[] };

/** Tabu-Zonen (seine Vorgabe 2026-10-14, src/lib/zonen.json): oben bis y 280, rechts ab x 900, unten ab y 1560.
 * Hook, Titel und Chips stehen in y 280-560, der Kopf beginnt bei y ~600 (Bild 1,2-fach, bis unten gefüllt). */
const OBEN = { scale: 1.2, hoch: 204 };
const HOOK_LAGE = OBEN;
const HOCH = 0;
const UT = { top: 1260, size: 64 };
const TITEL = 75;

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; design?: DesignName };

export const serienVideo = (
  C: Cut,
  /** scale: Größe der Hook (Standard 0,8; größer nur, wo über dem Kopf Platz ist) */
  hook: { line1: string; line2: string; scale?: number },
  szenen: SerienSzene[],
  akzente: [number, number][],
  /** eigener Bildausschnitt (z. B. enger, damit ein Stuhl aus dem Bild fällt); Standard wie die Serie */
  bild: { scale: number; hoch: number } = OBEN,
  /** Lage der Einblendungen (Verschiebung der Szenen in px) und der Untertitel; Standard wie die Serie */
  layout: { einblendungen?: number; untertitel?: number } = {},
) => {
  const ende = szenen.length ? szenen[0].at : C.DURATION;
  const zoomAt = (fr: number) => 1 + 0.03 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
  const akzentAt = (fr: number) =>
    akzente.reduce(
      (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, 1.03, 1.03, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
      1,
    );

  const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true }) => {
    const D = useDesign();
    const fr = useCurrentFrame();
    const lage = bild === OBEN && fr < ende ? HOOK_LAGE : bild;
    const S = 46;
    // Chips in Zeilen gruppieren (eine neue Zeile ersetzt die vorige) und jede Zeile als Ganzes mitteln
    const zeilen = (chips: Chip[]) => {
      const out: { chip: Chip; x: number; until: number; size: number }[] = [];
      const gruppen: Chip[][] = [];
      for (const c of chips) (c.neu || !gruppen.length ? gruppen.push([c]) : gruppen[gruppen.length - 1].push(c));
      gruppen.forEach((g, gi) => {
        const size = g.length === 1 ? 48 : S;
        const ws = g.map((c) => tagBreite(D, c.text, size));
        let x = (BOX.width - ws.reduce((a, b) => a + b, 0) - 22 * (g.length - 1)) / 2;
        const until = gi + 1 < gruppen.length ? gruppen[gi + 1][0].at - 4 : Infinity;
        g.forEach((c, i) => {
          out.push({ chip: c, x, until, size });
          x += ws[i] + 22;
        });
      });
      return out;
    };
    return (
      <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
        <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
          <SplitPerson split={0} zoom={zoomAt(fr)}>
            <Takes C={C} voice={voice} transform={`translateY(${-lage.hoch}px) scale(${lage.scale})`} transformOrigin="50% 0%" />
          </SplitPerson>
        </AbsoluteFill>
        <Toenung />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgb(6 7 10 / 0) 1640px, rgb(6 7 10 / 0.55) 1920px)" }} />

        <AbsoluteFill style={{ transform: `translateY(56px) scale(${hook.scale ?? 0.8})`, transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1={hook.line1} line2={hook.line2} outAt={ende - 4} />
        </AbsoluteFill>

        {szenen.map((sz, i) => {
          const until = i + 1 < szenen.length ? szenen[i + 1].at - 2 : Infinity;
          const erster = sz.chips.length ? sz.chips[0].at : sz.at + TITEL;
          return (
            <AbsoluteFill key={sz.at} style={{ transform: `translateY(${layout.einblendungen ?? HOCH}px)` }}>
              <Szene fr={fr} at={sz.at} until={until} title={sz.title} frei mittig titelDauer={Math.min(TITEL, erster - sz.at - 8)}>
                {zeilen(sz.chips).map(({ chip, x, until: u, size }) => (
                  <Pop key={`${chip.at}-${chip.text}`} fr={fr} at={chip.at} until={u} x={x} y={10}>
                    <Tag kind={chip.wichtig ? "wichtig" : "ok"} size={size}>
                      {chip.text}
                    </Tag>
                  </Pop>
                ))}
              </Szene>
            </AbsoluteFill>
          );
        })}

        {untertitel && <Captions C={C} fr={fr} top={layout.untertitel ?? UT.top} size={UT.size} />}

        {sfx && (
          <>
            {szenen.slice(1).map((sz) => (
              <Sfx key={`w${sz.at}`} file="whoosh.mp3" at={sz.at} volume={STIL.sfx * 0.5} />
            ))}
            {szenen.flatMap((sz) => sz.chips.filter((c) => c.stempel)).map((c) => (
              <Sfx key={`s${c.at}`} file="stamp.mp3" at={c.at} volume={STIL.sfx * 0.5} />
            ))}
          </>
        )}
        {raster && <Raster />}
      </AbsoluteFill>
    );
  };

  const Video: React.FC<Props> = ({ design = "nacht", ...p }) => (
    <DesignRahmen design={design}>
      <Inhalt {...p} />
    </DesignRahmen>
  );
  return Video;
};
