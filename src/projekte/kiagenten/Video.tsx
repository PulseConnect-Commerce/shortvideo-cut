/**
 * Format FACE (Skill stil-face). "KI-Agenten im Onlineshop – sinnvoll oder völliger Hype?" Meinungsvideo direkt in
 * die Kamera: Bild ab der Hüfte, ruhig geschnitten (wenige Schnitte, zwei sanfte Zooms), große Untertitel, Hook als Balken,
 * Bildkarten über dem Kopf wie HERO (src/lib/broll.tsx), am Ende Kommentar-Blase und Folgen-Knopf mit Plus.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, type HookStil, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import {
  chip,
  IconBrowser,
  IconCard,
  IconCoin,
  IconEye,
  IconMail,
  IconStopwatch,
  Pop,
  Row,
  Szene,
  Tag,
} from "../../lib/broll";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "KiAgenten", durationInFrames: C.DURATION, fps: C.FPS };

/** fester Bildausschnitt ab der Hüfte: die Hose beginnt frühestens bei y 1640, das Bild endet so bei 1600 */
const CROP = 1.2;

/* Zeitpunkte: jede Szene und jedes Element auf seinem Wort */
const F = C.cue;
const T = (() => {
  const hype = F("angeblich");
  const basics = F("denn");
  const auto = F("und", C.W("können"));
  const tipp = F("tipp");
  const cta = F("aber", C.W("agenten", F("antwort")));
  return { hype, basics, auto, tipp, cta };
})();

/** ruhig (FACE, nach seinem Feedback): ein ganz langsames Zoom-in über das ganze Video und nur zwei sanfte Akzente
 * auf den stärksten Stellen (8 Frames heran, halten bis zum Ende der Phrase, 10 Frames zurück) */
const zoomAt = (fr: number) => 1 + 0.06 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENT = 1.06;
const AKZENTE: [number, number][] = [
  [F("aber"), C.WE("wirklich") + 4],
  [F("welche"), C.WE("onlineshop", F("welche")) + 4],
];
const akzentAt = (fr: number) =>
  AKZENTE.reduce(
    (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, AKZENT, AKZENT, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
    1,
  );

/** Untertitel FACE: größer als HERO (100 px), Oberkante y 1320. Varianten nur für den Stilabgleich (Standbilder) */
const UNTERTITEL = { face: { top: 1320, size: 100 }, hero: { top: STIL.captionY, size: STIL.captionSize }, aus: null };

/** Sprechblase für "Deine Meinung" (Kommentare) */
const Blase: React.FC = () => (
  <svg width={86} height={78} viewBox="0 0 86 78">
    <path d="M10 6 h66 a8 8 0 0 1 8 8 v36 a8 8 0 0 1 -8 8 h-38 l-18 16 v-16 h-10 a8 8 0 0 1 -8 -8 v-36 a8 8 0 0 1 8 -8 z" fill={STIL.yellow} />
    <circle cx="26" cy="32" r="5" fill={STIL.ink} />
    <circle cx="43" cy="32" r="5" fill={STIL.ink} />
    <circle cx="60" cy="32" r="5" fill={STIL.ink} />
  </svg>
);

/** Folgen-Knopf mit Plus (TikTok-Rot), wird auf "Plus" angetippt und zu "Gefolgt" */
const FolgenKnopf: React.FC<{ fr: number; tapAt: number }> = ({ fr, tapAt }) => {
  const tapped = fr >= tapAt + 2;
  const press = interpolate(fr, [tapAt - 4, tapAt + 2, tapAt + 12], [1, 0.9, 1], clamp);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 34px",
        borderRadius: 999,
        background: tapped ? STIL.accent2 : STIL.hook.kern,
        color: tapped ? STIL.ink : "#fff",
        fontSize: 52,
        fontWeight: 900,
        transform: `scale(${press})`,
        boxShadow: "0 10px 26px rgb(20 22 26 / 0.25)",
      }}
    >
      <span style={{ fontSize: 64, lineHeight: 1 }}>{tapped ? "✓" : "+"}</span>
      {tapped ? "Gefolgt" : "Folgen"}
    </div>
  );
};

/** raster: Platzierungsraster (nur Standbilder); hookStil, untertitel: Varianten zum Vergleichen als Standbild */
export const Video: React.FC<{
  voice?: boolean;
  sfx?: boolean;
  raster?: boolean;
  hookStil?: HookStil;
  untertitel?: keyof typeof UNTERTITEL;
}> = ({ voice = true, sfx = true, raster = false, hookStil = "balken", untertitel = "face" }) => {
  const fr = useCurrentFrame();
  const ut = UNTERTITEL[untertitel];
  return (
    <AbsoluteFill style={{ backgroundColor: STIL.paper }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`scale(${CROP})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>

      <HookTitle fr={fr} line1="KI-AGENTEN:" line2="GENIAL ODER BULLSHIT?" outAt={T.hype - 8} stil={hookStil} />

      {/* Überall KI-Agenten: wofür angeblich */}
      <Szene fr={fr} at={T.hype} until={T.basics - 2} title="Überall KI-Agenten" photo="broll/kiagenten/hype.jpg">
        <Pop fr={fr} at={F("onlineshop")} x={24} y={118}>
          <Row icon={<IconBrowser />} text="Onlineshop" width={400} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("kundenservice")} x={24} y={210}>
          <Row icon={<IconMail />} text="Kundenservice" width={440} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("marketing")} x={24} y={302}>
          <Row icon={<IconEye />} text="Marketing" width={380} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("wirklich")} x={500} y={126}>
          <Tag size={42}>Wirklich nötig?</Tag>
        </Pop>
      </Szene>

      {/* Wenn die Basics fehlen, rettet auch kein Agent */}
      <Szene fr={fr} at={T.basics} until={T.auto - 2} title="Wenn die Basics fehlen" photo="broll/kiagenten/leer.jpg">
        <Pop fr={fr} at={F("besucher")} x={24} y={118}>
          <Row icon={<IconEye />} text="keine Besucher" mark="no" width={470} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("produktseite")} x={24} y={210}>
          <Row icon={<IconBrowser />} text="schwache Produktseite" mark="no" width={600} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("checkout")} x={24} y={302}>
          <Row icon={<IconCard />} text="Checkout kaputt" mark="no" width={480} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("retten")} x={530} y={290}>
          <div style={{ background: STIL.red, color: "#fff", borderRadius: 22, padding: "10px 22px", fontSize: 40, fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.01em", boxShadow: "0 8px 20px rgb(20 22 26 / 0.18)" }}>
            Da hilft auch
            <br />
            kein KI-Agent
          </div>
        </Pop>
      </Szene>

      {/* Automatisierung ja, Hype nein */}
      <Szene fr={fr} at={T.auto} until={T.tipp - 2} title="Echtes Problem oder Hype?" photo="broll/kiagenten/automatisierung.jpg">
        <Pop fr={fr} at={F("automatisierung")} x={24} y={126}>
          <Tag size={44}>Automatisierung</Tag>
        </Pop>
        <Pop fr={fr} at={F("spannend")} x={444} y={126}>
          <Tag kind="ok" size={44}>
            extrem spannend
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("wichtig")} until={F("unterschied") - 8} x={24} y={226}>
          <Tag kind="ok" size={44}>
            und sehr wichtig
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("unterschied")} until={F("problem") - 8} x={24} y={226}>
          <Tag kind="ink" size={44}>
            der Unterschied:
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("problem")} x={24} y={218}>
          <Row text="echtes Problem lösen" mark="ok" width={560} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("ki-tool")} x={24} y={310}>
          <Row text="Tool, nur weil alle drüber reden" mark="no" width={800} onPhoto />
        </Pop>
      </Szene>

      {/* Mein Tipp: welche Aufgabe kostet Zeit oder Geld? */}
      <Szene fr={fr} at={T.tipp} until={T.cta - 2} nr={1} title="Mein Tipp vor dem Kauf" photo="broll/kiagenten/zeitgeld.jpg">
        <Pop fr={fr} at={F("welche")} x={24} y={118}>
          <div style={{ ...chip, display: "inline-block", padding: "10px 24px", fontSize: 46, fontWeight: 800 }}>Welche Aufgabe kostet mich …</div>
        </Pop>
        <Pop fr={fr} at={F("zeit", F("welche"))} x={24} y={214}>
          <Row icon={<IconStopwatch size={64} />} text="Zeit?" width={260} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("geld", F("welche"))} x={300} y={214}>
          <Row icon={<IconCoin size={64} />} text="Geld?" width={260} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("antwort")} until={F("keine", F("antwort")) - 8} x={24} y={322}>
          <Tag kind="ink" size={44}>
            Keine Antwort?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("keine", F("antwort"))} x={24} y={322}>
          <Tag kind="warn" size={44}>
            Dann brauchst du keinen Agenten
          </Tag>
        </Pop>
      </Szene>

      {/* Aufruf: Meinung in die Kommentare, auf das Plus drücken */}
      <Szene fr={fr} at={T.cta} until={Infinity} title="Genial oder Bullshit?">
        <Pop fr={fr} at={F("sinnvoll")} x={40} y={120}>
          <Tag kind="ok" size={48}>
            sinnvoll?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("überhyptes")} x={330} y={120}>
          <Tag kind="warn" size={48}>
            überhypt?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("meinung")} x={40} y={214}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Blase />
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>Schreib mir deine Meinung</div>
          </div>
        </Pop>
        <Pop fr={fr} at={F("vergiss")} x={40} y={316}>
          <FolgenKnopf fr={fr} tapAt={F("plus")} />
        </Pop>
      </Szene>

      {ut && <Captions C={C} fr={fr} top={ut.top} size={ut.size} />}

      {sfx && (
        <>
          {[T.hype, T.basics, T.auto, T.tipp, T.cta].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.6} />
          ))}
          {[F("onlineshop"), F("kundenservice"), F("marketing"), F("zeit", F("welche")), F("geld", F("welche"))].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
          {[F("besucher"), F("produktseite"), F("checkout"), F("ki-tool")].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          {[F("problem"), F("plus") + 2].map((at) => (
            <Sfx key={`o${at}`} file="success.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          {[F("meinung"), F("vergiss")].map((at) => (
            <Sfx key={`p${at}`} file="pop.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
