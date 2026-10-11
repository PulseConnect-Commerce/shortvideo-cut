/**
 * Format NEWS (Skill stil-news), Design nacht-gruen. "65 % wollen KI beim Weihnachtsshopping nutzen"
 * News-Reaction: Bild ab der Hüfte, Titel oben, der Kopf direkt darunter, die Quelle (Shopify Holiday-Report) als Hintergrund hinter
 * ihm (Greenscreen, von npm run portrait mit --hintergrund in den Take gerechnet): erst die Schlagzeile, dann die
 * markierte 65-%-Stelle. "~33 %" groß auf "jeder Dritte". Große knackige Titel, große Untertitel, am Ende die Frage mit
 * Kommentar-Blase. Der Folgen-Aufruf läuft bewusst ohne Einblendung (sein Wunsch).
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ausgabeFrames, Bodenblende, Captions, clamp, HookTitle, popS, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { Pop, Row, Szene, Tag, tagBreite } from "../../lib/broll";
import { DesignRahmen, type DesignName, mass, schriftCss, Toenung, useDesign } from "../../lib/design";
import { textWidth } from "../../lib/messen";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "KiWeihnachten", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage (seine Vorgabe, 2026-10-11): Titel und Einblendungen oben, der Kopf direkt darunter ("OBEN"), die Untertitel
 * unten; pro Szene nur der Titel und eine Zeile Begriffe, weitere Begriffe ersetzen die vorherigen. Nur solange die
 * Quelle hinter ihm steht (Greenscreen), liegt er tiefer ("MITTE"), damit der Artikel lesbar ist. Die Hose beginnt im
 * Take frühestens bei y ~1700; die Bodenblende deckt sie in beiden Lagen ab. */
const OBEN = { scale: 1.2, hoch: 348 };
const MITTE = { scale: 1.2, hoch: 160 };
/** Untertitel: klein und ruhig, damit sie nicht wie Titel wirken (seine Vorgabe 2026-10-11) */
const UT = { top: 1400, size: 64 };
const HOSE = 1700;
const QUELLE = [...ausgabeFrames(C, 113.95, 116.8), ...ausgabeFrames(C, 117.25, 124.5)];
const mitte = (fr: number) => QUELLE.some(([a, b]) => fr >= a && fr < b);

const F = C.cue;
const T = (() => {
  const gsA = F("shopify", C.W("aus"));
  const gsB = F("und", C.W("veröffentlicht"));
  const beispiel = F("zum");
  const spannend = F("aber", C.W("vergleichen"));
  const stehen = F("und", C.W("einkauft"));
  const frage1 = F("und", C.W("einkäufer"));
  const klar = F("klare");
  const uebrigens = F("und", C.W("wichtiger"));
  const folgen = F("du", C.W("deutschland"));
  const meinung = F("denn", C.W("kanal"));
  const frage = F("aber", C.W("leider"));
  return { gsA, gsB, beispiel, spannend, stehen, frage1, klar, uebrigens, folgen, meinung, frage };
})();

/** ein langsames Zoom-in über das ganze Video und drei sanfte Akzente auf den stärksten Stellen */
const zoomAt = (fr: number) => 1 + 0.08 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENTE: [number, number][] = [
  [F("dritte"), C.WE("einkauft") + 6],
  [F("einkäufer") - 6, C.WE("einkäufer") + 8],
  [F("wer", T.meinung), C.WE("ki", C.W("leider")) + 6],
];
const akzentAt = (fr: number) =>
  AKZENTE.reduce(
    (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, 1.06, 1.06, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
    1,
  );

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

/** große Zahl in der Leuchtfarbe (z. B. "~33 %"), poppt auf ihrem Wort auf; so groß, dass sie über dem Kopf bleibt */
const ZAHL = 112;
const GrosseZahl: React.FC<{ fr: number; at: number; text: string }> = ({ fr, at, text }) => {
  const D = useDesign();
  return (
    <div
      style={{
        ...schriftCss(D.titel),
        fontSize: ZAHL,
        lineHeight: 1,
        color: D.ok,
        textShadow: `0 0 40px ${D.ok}66, 0 8px 30px rgb(0 0 0 / 0.6)`,
        WebkitTextStroke: "0.03em rgb(6 8 12 / 0.9)",
        paintOrder: "stroke fill",
        transform: `scale(${popS(fr, at)})`,
        transformOrigin: "left center",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; design?: DesignName };

export const Video: React.FC<Props> = ({ design = "nacht-gruen", ...p }) => (
  <DesignRahmen design={design}>
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false }) => {
  const D = useDesign();
  const fr = useCurrentFrame();
  const lage = mitte(fr) ? MITTE : OBEN;
  const tagX = (text: string, size: number, x0 = 24) => x0 + tagBreite(D, text, size) + 22;
  const zahlX = 24 + Math.round(textWidth("~33 %", ZAHL, ...mass(D.titel))) + 36;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`translateY(${-lage.hoch}px) scale(${lage.scale})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>
      <Toenung />
      <Bodenblende ab={HOSE * lage.scale - lage.hoch} />

      <HookTitle fr={fr} line1="65 % shoppen" line2="mit KI?!" outAt={T.gsA - 6} />

      {/* Quelle hinter ihm (Greenscreen im Take): Schlagzeile, dann die markierte 65-%-Stelle */}
      <Pop fr={fr} at={T.gsA} until={T.beispiel - 4} x={60} y={1228}>
        <Tag kind="ink" size={42}>
          Quelle: Shopify, 6. Okt. 2026
        </Tag>
      </Pop>

      {/* Wofür sie KI nutzen wollen */}
      <Szene fr={fr} at={T.beispiel} until={T.spannend - 2} title="KI als Berater" frei>
        <Pop fr={fr} at={F("geschenkideen")} until={F("vergleichen") - 4} x={24} y={118}>
          <Row text="Geschenkideen finden" mark="ok" width={600} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("vergleichen")} x={24} y={118}>
          <Row text="Produkte vergleichen" mark="ok" width={600} onPhoto />
        </Pop>
      </Szene>

      {/* Der spannende Teil: nur jeder Dritte lässt die KI einkaufen */}
      <Szene fr={fr} at={T.spannend} until={T.stehen - 2} title="Der spannende Teil" frei>
        <Pop fr={fr} at={F("dritte")} x={24} y={114} style={{ transform: "none" }}>
          <GrosseZahl fr={fr} at={F("dritte")} text="~33 %" />
        </Pop>
        <Pop fr={fr} at={F("eigenständig")} x={zahlX} y={126}>
          <Tag kind="warn" size={44}>
            lassen KI einkaufen
          </Tag>
        </Pop>
      </Szene>

      {/* Berater ja, Einkäufer (noch) nein */}
      <Szene fr={fr} at={T.stehen} until={T.frage1 - 2} title="Berater ja, Einkäufer nein" frei>
        <Pop fr={fr} at={F("einkaufsberater")} until={F("einkäufer") - 4} x={24} y={118}>
          <Row text="KI als Einkaufsberater" mark="ok" width={620} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("einkäufer")} x={24} y={118}>
          <Row text="KI als Einkäufer" mark="no" width={520} onPhoto />
        </Pop>
      </Szene>

      {/* Versteht eine KI, was du verkaufst? */}
      <Szene fr={fr} at={T.frage1} until={T.klar - 2} title="Versteht KI deinen Shop?" frei>
        <Pop fr={fr} at={F("stichpunkten")} until={F("schwierig") - 4} x={24} y={118}>
          <Row text="nur 3 Stichpunkte" mark="no" width={520} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("schwierig")} x={24} y={118}>
          <Tag kind="warn" size={44}>
            schwierig für die KI
          </Tag>
        </Pop>
      </Szene>

      {/* Was immer wichtiger wird */}
      <Szene fr={fr} at={T.klar} until={T.uebrigens - 2} title="Das braucht die KI" frei>
        <Pop fr={fr} at={F("produktnamen")} until={F("eigenschaften") - 4} x={24} y={118}>
          <Tag kind="ok" size={44}>
            klare Produktnamen
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("eigenschaften")} x={24} y={118}>
          <Tag kind="ok" size={44}>
            alle Eigenschaften
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("beschreibungen")} x={tagX("alle Eigenschaften", 44)} y={118}>
          <Tag kind="ok" size={44}>
            Beschreibungen
          </Tag>
        </Pop>
      </Szene>

      {/* Einordnung der 65 % */}
      <Szene fr={fr} at={T.uebrigens} until={T.folgen - 2} title="Gut zu wissen" frei>
        <Pop fr={fr} at={F("umfrage", T.uebrigens)} until={F("prognose") - 4} x={24} y={118}>
          <Row text="65 % = Umfrage" width={520} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("prognose")} x={24} y={118}>
          <Row text="keine Prognose für Deutschland" mark="no" width={780} onPhoto />
        </Pop>
      </Szene>

      {/* Folgen-Aufruf: bewusst ohne Einblendung */}

      {/* Seine Meinung */}
      <Szene fr={fr} at={T.meinung} until={T.frage - 2} title="Meine Meinung" frei>
        <Pop fr={fr} at={F("produktdaten", T.meinung)} until={F("kunden", T.meinung) - 4} x={24} y={118}>
          <Tag kind="warn" size={44}>
            Produktdaten vernachlässigt?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("kunden", T.meinung)} x={24} y={118}>
          <Row text="schwer für Kunden und KI" mark="no" width={660} onPhoto />
        </Pop>
      </Szene>

      {/* Frage an die Community */}
      <Szene fr={fr} at={T.frage} until={Infinity} title="KI als Weihnachtsmann?" frei>
        <Pop fr={fr} at={F("würdet")} x={24} y={118}>
          <div style={{ ...D.chip, color: D.chipText, display: "flex", alignItems: "center", gap: 18, padding: "6px 30px 6px 14px" }}>
            <Blase />
            <div style={{ ...schriftCss(D.text), fontSize: 48, whiteSpace: "nowrap" }}>Schreib mir deine Meinung</div>
          </div>
        </Pop>
      </Szene>

      <Captions C={C} fr={fr} top={UT.top} size={UT.size} />

      {sfx && (
        <>
          <Sfx file="kamera.mp3" at={T.gsA} volume={STIL.sfx * 0.7} />
          {[T.gsB, T.beispiel, T.spannend, T.stehen, T.frage1, T.klar, T.uebrigens, T.meinung, T.frage].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.6} />
          ))}
          <Sfx file="riser.mp3" at={F("meinung", T.meinung) - 48} volume={STIL.sfx * 0.6} />
          {[F("geschenkideen"), F("vergleichen"), F("einkaufsberater"), F("produktnamen"), F("eigenschaften"), F("beschreibungen")].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
          {[F("einkäufer"), F("stichpunkten"), F("prognose"), F("kunden", T.meinung)].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          <Sfx file="impact.mp3" at={F("dritte")} volume={STIL.sfx * 0.6} />
          <Sfx file="pop.mp3" at={F("würdet")} volume={STIL.sfx * 0.7} />
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
