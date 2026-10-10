/**
 * Format FACE (Skill stil-face). "KI-Agenten im Onlineshop – sinnvoll oder völliger Hype?" Meinungsvideo direkt in
 * die Kamera: Bild ab der Hüfte, ruhig geschnitten (wenige Schnitte, zwei sanfte Zooms), große Untertitel, Hook als Balken,
 * Bildkarten über dem Kopf wie HERO (src/lib/broll.tsx), am Ende Kommentar-Blase und Folgen-Knopf mit Plus.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, type HookStil, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import {
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
  rowBreite,
  tagBreite,
} from "../../lib/broll";
import { DesignRahmen, type DesignName, schriftCss, Toenung, useDesign } from "../../lib/design";
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

/** Sprechblase für "Deine Meinung" (Kommentare), in der Farbe des Designs */
const Blase: React.FC = () => {
  const D = useDesign();
  return (
    <svg width={86} height={78} viewBox="0 0 86 78">
      <path d="M10 6 h66 a8 8 0 0 1 8 8 v36 a8 8 0 0 1 -8 8 h-38 l-18 16 v-16 h-10 a8 8 0 0 1 -8 -8 v-36 a8 8 0 0 1 8 -8 z" fill={D.blase} />
      <circle cx="26" cy="32" r="5" fill={STIL.ink} />
      <circle cx="43" cy="32" r="5" fill={STIL.ink} />
      <circle cx="60" cy="32" r="5" fill={STIL.ink} />
    </svg>
  );
};

/** Folgen-Knopf mit Plus (TikTok-Rot), wird auf "Plus" angetippt und zu "Gefolgt" */
const FolgenKnopf: React.FC<{ fr: number; tapAt: number }> = ({ fr, tapAt }) => {
  const D = useDesign();
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
        background: tapped ? D.folgen.nachher : D.folgen.vorher,
        color: tapped ? D.folgen.nachherText : D.folgen.vorherText,
        fontSize: 52,
        ...(D.name === "pulse" ? { fontWeight: 900 } : schriftCss(D.titel)),
        transform: `scale(${press})`,
        boxShadow: "0 10px 26px rgb(20 22 26 / 0.25)",
        ...D.folgen.extra,
      }}
    >
      <span style={{ fontSize: 64, lineHeight: 1 }}>{tapped ? "✓" : "+"}</span>
      {D.titel.caps ? (tapped ? "GEFOLGT" : "FOLGEN") : tapped ? "Gefolgt" : "Folgen"}
    </div>
  );
};

type Props = {
  voice?: boolean;
  sfx?: boolean;
  raster?: boolean;
  hookStil?: HookStil;
  untertitel?: keyof typeof UNTERTITEL;
  /** "oben": Gesicht im oberen Drittel (etwas mehr Ausschnitt), Bildkarten auf der Brust statt über dem Kopf */
  layout?: "standard" | "oben";
  /** Bildkarten: "foto" (Karte mit Foto über dem Kopf), "vollbild" (Foto randlos oben), "frei" (ohne Karte und Foto,
   * nur die Chips über dem Kopf). Er mochte "vollbild" weniger als "foto" und wollte "frei" sehen (2026-10-09). */
  karte?: "foto" | "vollbild" | "frei";
  /** Design (src/lib/design.tsx): "pulse" ist der Look dieses Videos; die anderen nur zum Vergleich als Standbild */
  design?: DesignName;
};

/** raster: Platzierungsraster (nur Standbilder); hookStil, untertitel, layout, karte, design: Varianten zum
 * Vergleichen als Standbild */
export const Video: React.FC<Props> = ({ design = "pulse", ...p }) => (
  <DesignRahmen design={design}>
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, hookStil = "balken", untertitel = "face", layout = "standard", karte = "frei" }) => {
  const D = useDesign();
  const oben = layout === "oben";
  const fr = useCurrentFrame();
  const ut = UNTERTITEL[untertitel];
  return (
    <AbsoluteFill style={{ backgroundColor: STIL.paper }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={oben ? "translateY(-772px) scale(1.65)" : `scale(${CROP})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>
      <Toenung />

      <HookTitle
        fr={fr}
        line1={D.name === "pulse" ? "KI-AGENTEN:" : "KI-Agenten:"}
        line2={D.name === "pulse" ? "GENIAL ODER BULLSHIT?" : "Genial oder Bullshit?"}
        outAt={T.hype - 8}
        stil={hookStil}
      />

      {/* Überall KI-Agenten: wofür angeblich */}
      <AbsoluteFill style={{ transform: oben ? "translateY(640px)" : undefined }}>
      <Szene fr={fr} at={T.hype} until={T.basics - 2} title="Überall KI-Agenten" photo={karte === "frei" ? undefined : "broll/kiagenten/hype.jpg"} vollbild={karte === "vollbild"} frei={karte === "frei"}>
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
      <Szene fr={fr} at={T.basics} until={T.auto - 2} title="Wenn die Basics fehlen" photo={karte === "frei" ? undefined : "broll/kiagenten/leer.jpg"} vollbild={karte === "vollbild"} frei={karte === "frei"}>
        <Pop fr={fr} at={F("besucher")} x={24} y={118}>
          <Row icon={<IconEye />} text="keine Besucher" mark="no" width={470} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("produktseite")} x={24} y={210}>
          <Row icon={<IconBrowser />} text="schwache Produktseite" mark="no" width={600} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("checkout")} x={24} y={302}>
          <Row icon={<IconCard />} text="Checkout kaputt" mark="no" width={480} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("retten")} x={D.name === "pulse" ? 530 : 24 + rowBreite(D, "Checkout kaputt", { icon: true, mark: true, width: 480 }) + 22} y={290}>
          {D.name === "pulse" ? (
            <div style={{ background: STIL.red, color: "#fff", borderRadius: 22, padding: "10px 22px", fontSize: 40, fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.01em", boxShadow: "0 8px 20px rgb(20 22 26 / 0.18)" }}>
              Da hilft auch
              <br />
              kein KI-Agent
            </div>
          ) : (
            <div style={{ ...D.tag, ...D.tags.warn, ...schriftCss(D.titel), borderRadius: 18, padding: "10px 22px", fontSize: 40, lineHeight: 1.12 }}>
              {D.titel.caps ? "DA HILFT AUCH" : "Da hilft auch"}
              <br />
              {D.titel.caps ? "KEIN KI-AGENT" : "kein KI-Agent"}
            </div>
          )}
        </Pop>
      </Szene>

      {/* Automatisierung ja, Hype nein */}
      <Szene fr={fr} at={T.auto} until={T.tipp - 2} title="Echtes Problem oder Hype?" photo={karte === "frei" ? undefined : "broll/kiagenten/automatisierung.jpg"} vollbild={karte === "vollbild"} frei={karte === "frei"}>
        <Pop fr={fr} at={F("automatisierung")} x={24} y={126}>
          <Tag size={44}>Automatisierung</Tag>
        </Pop>
        <Pop fr={fr} at={F("spannend")} x={D.name === "pulse" ? 444 : 24 + tagBreite(D, "Automatisierung", 44) + 22} y={126}>
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
      <Szene fr={fr} at={T.tipp} until={T.cta - 2} nr={1} title="Mein Tipp vor dem Kauf" photo={karte === "frei" ? undefined : "broll/kiagenten/zeitgeld.jpg"} vollbild={karte === "vollbild"} frei={karte === "frei"}>
        <Pop fr={fr} at={F("welche")} x={24} y={118}>
          <div style={{ ...D.chip, color: D.chipText, display: "inline-block", padding: "10px 24px", ...(D.name === "pulse" ? { fontWeight: 800 } : schriftCss(D.text)), fontSize: 46 }}>
            Welche Aufgabe kostet mich …
          </div>
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
      <Szene fr={fr} at={T.cta} until={Infinity} title="Genial oder Bullshit?" vollbild={karte === "vollbild"} frei={karte === "frei"}>
        <Pop fr={fr} at={F("sinnvoll")} x={40} y={120}>
          <Tag kind="ok" size={48}>
            sinnvoll?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("überhyptes")} x={D.name === "pulse" ? 330 : 40 + tagBreite(D, "sinnvoll?", 48) + 22} y={120}>
          <Tag kind="warn" size={48}>
            überhypt?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("meinung")} x={40} y={214}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, ...(karte === "frei" ? { ...D.chip, color: D.chipText, borderRadius: D.name === "pulse" ? 999 : D.chip.borderRadius, padding: "6px 30px 6px 14px" } : {}) }}>
            <Blase />
            <div style={{ ...(D.name === "pulse" ? { fontWeight: 800, letterSpacing: "-0.02em" } : schriftCss(D.text)), fontSize: 48, whiteSpace: "nowrap" }}>Schreib mir deine Meinung</div>
          </div>
        </Pop>
        <Pop fr={fr} at={F("vergiss")} x={40} y={316}>
          <FolgenKnopf fr={fr} tapAt={F("plus")} />
        </Pop>
      </Szene>

      </AbsoluteFill>

      {ut && <Captions C={C} fr={fr} top={oben ? 1350 : ut.top} size={ut.size} />}

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
