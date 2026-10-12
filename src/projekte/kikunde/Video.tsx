/**
 * Format NEWS (Skill stil-news), Design nacht-gruen. "Was, wenn dein nächster Kunde deinen Onlineshop gar nicht mehr
 * selbst besucht – sondern seine KI für ihn einkauft?"
 * News-Reaction: Bild ab der Hüfte, Titel oben, der Kopf direkt darunter, die Quelle (IT Boltwise, 29. Sep. 2026) als
 * Hintergrund hinter ihm (Greenscreen, von npm run portrait mit --hintergrund in den Take gerechnet): erst die
 * Schlagzeile, dann die markierte Stelle "Kataloge durchsuchen, Waren in den Warenkorb legen und den Checkout
 * anstoßen". Die Entwicklung stammt aus August 2026 und wird nicht als tagesaktuell bezeichnet (seine Vorgabe): darum
 * der Chip "seit August". Hook "DEIN NÄCHSTER KUNDE IST EINE KI?!", am Ende die Frage mit Kommentar-Blase; der
 * Folgen-Aufruf läuft ohne Einblendung.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ausgabeFrames, Bodenblende, Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { Pop, Row, Szene, Tag, tagBreite } from "../../lib/broll";
import { DesignRahmen, type DesignName, mass, schriftCss, Toenung, useDesign } from "../../lib/design";
import { fitSize } from "../../lib/messen";
import { Raster } from "../../lib/raster";
import { createCut, typedSync } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "KiKunde", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage (seine Vorgabe, 2026-10-11): Titel und Einblendungen oben, der Kopf direkt darunter ("OBEN"), die Untertitel
 * unten; pro Szene nur der Titel und eine Zeile Begriffe, weitere Begriffe ersetzen die vorherigen. Nur solange die
 * Quelle hinter ihm steht (Greenscreen), liegt er tiefer ("MITTE"), damit der Artikel lesbar ist. */
const OBEN = { scale: 1.2, hoch: 348 };
const MITTE = { scale: 1.2, hoch: 160 };
/** Untertitel: klein und ruhig (seine Vorgabe 2026-10-11) und höher bei y 1260, damit der Beschreibungstext der App sie
 * nicht verdeckt; Quellen-Pille und Hinweise liegen darunter bei y 1350 */
const UT = { top: 1260, size: 64 };
const HOSE = 1700;
/** Szenen-Titel nur kurz einblenden (seine Vorgabe 2026-10-12: "Den Titel kannst du aber kürzer einblenden") */
const TITEL = 75;
/** die Greenscreen-Stellen im Take (wie bei npm run portrait --hintergrund) */
const QUELLE = [...ausgabeFrames(C, 61.95, 68.1), ...ausgabeFrames(C, 68.85, 74.1), ...ausgabeFrames(C, 76.7, 78.7)];
const mitte = (fr: number) => QUELLE.some(([a, b]) => fr >= a && fr < b);

const F = C.cue;
const T = (() => {
  const klingt = F("klingt");
  const gs1 = F("denn");
  const gs2 = F("und", C.W("bereitgestellt"));
  const vor = F("nun");
  const punkt = F("und", C.W("davon"));
  const heisst = F("und", C.W("aufgebaut"));
  const meinung = F("noch", C.W("preise"));
  const frage = F("aber", C.W("weiterentwickelt"));
  return { klingt, gs1, gs2, vor, punkt, heisst, meinung, frage };
})();

/** ein langsames Zoom-in über das ganze Video und drei sanfte Akzente auf den stärksten Stellen */
const zoomAt = (fr: number) => 1 + 0.08 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENTE: [number, number][] = [
  [F("übernimmt"), C.WE("davon") + 6],
  [F("entscheidende"), C.WE("punkt") + 8],
  [F("würdet"), C.WE("anvertrauen") + 6],
];
const akzentAt = (fr: number) =>
  AKZENTE.reduce(
    (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, 1.06, 1.06, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
    1,
  );

/** Sprechblase für die Kommentare, in der Leuchtfarbe des Designs */
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

/** Chat mit der KI: der Auftrag wird Wort für Wort mit seiner Stimme getippt (so groß, wie der ganze Satz passt) */
const Chat: React.FC<{ fr: number; text: string; voll: string }> = ({ fr, text, voll }) => {
  const D = useDesign();
  const [w, sp, fam] = mass(D.text);
  // nie unter 42 px (Mindestgröße für Text in Grafiken)
  const fs = fitSize(`„${voll}“`, 790, 46, w, sp, 42, fam);
  return (
    <div style={{ ...D.chip, display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 24px 12px 16px", color: D.chipText }}>
      <svg width={44} height={40} viewBox="0 0 86 78" style={{ flex: "none" }}>
        <path d="M10 6 h66 a8 8 0 0 1 8 8 v36 a8 8 0 0 1 -8 8 h-38 l-18 16 v-16 h-10 a8 8 0 0 1 -8 -8 v-36 a8 8 0 0 1 8 -8 z" fill={D.ok} />
      </svg>
      <div style={{ ...schriftCss(D.text), fontSize: fs, whiteSpace: "nowrap" }}>
        „{text}
        <span style={{ opacity: Math.floor(fr / 8) % 2 ? 0 : 1, color: D.ok }}>|</span>“
      </div>
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
  const auftrag = typedSync(C.spoken("Such mir mal Schuhe unter 100 Euro", T.vor), fr);
  const tagX = (text: string, size: number, x0 = 24) => x0 + tagBreite(D, text, size) + 22;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`translateY(${-lage.hoch}px) scale(${lage.scale})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>
      <Toenung />
      <Bodenblende ab={HOSE * lage.scale - lage.hoch} />

      <HookTitle fr={fr} line1="Dein nächster Kunde" line2="ist eine KI?!" outAt={T.klingt - 4} />

      {/* Zukunftsmusik? */}
      <Szene fr={fr} at={T.klingt} until={T.gs1 - 6} title="Zukunftsmusik?" frei titelDauer={TITEL}>
        <Pop fr={fr} at={F("shopify")} x={24} y={118}>
          <Tag kind="accent" size={44}>
            Schau, was Shopify macht
          </Tag>
        </Pop>
      </Szene>

      {/* Quelle hinter ihm (Greenscreen im Take): Schlagzeile, dann die markierte Stelle; nicht tagesaktuell */}
      <Pop fr={fr} at={T.gs1} until={T.vor - 4} x={60} y={1440} w={890} style={{ textAlign: "right", transformOrigin: "right center" }}>
        <Tag kind="ink" size={28}>
          Quelle: IT Boltwise, 29. Sep. 2026
        </Tag>
      </Pop>
      <Pop fr={fr} at={T.gs2} until={T.vor - 4} x={60} y={1350}>
        <Tag kind="ink" size={42}>
          Seit August in Shopify-Shops aktiv
        </Tag>
      </Pop>

      {/* Stell dir vor: der Auftrag an die KI */}
      <Szene fr={fr} at={T.vor} until={T.punkt - 2} title="Stell dir vor …" frei titelDauer={TITEL}>
        <Pop fr={fr} at={F("such", T.vor)} until={F("vergleichen") - 4} x={-30} y={118}>
          <Chat fr={fr} text={auftrag} voll="Such mir mal Schuhe unter 100 Euro" />
        </Pop>
        <Pop fr={fr} at={F("vergleichen")} until={F("übernimmt") - 4} x={24} y={118}>
          <Row text="nicht selbst 5 Shops vergleichen" mark="no" width={760} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("übernimmt")} x={24} y={118}>
          <Row text="die KI übernimmt einen Teil" mark="ok" width={680} onPhoto />
        </Pop>
      </Szene>

      {/* Der entscheidende Punkt: Shops müssen auch für KI verständlich sein */}
      <Szene fr={fr} at={T.punkt} until={T.heisst - 2} title="Der entscheidende Punkt" frei titelDauer={TITEL}>
        <Pop fr={fr} at={F("menschen")} x={24} y={118}>
          <Tag kind="ok" size={44}>
            für Menschen
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("verständlich")} x={tagX("für Menschen", 44)} y={118}>
          <Tag kind="wichtig" size={44}>
            + für KI verständlich
          </Tag>
        </Pop>
      </Szene>

      {/* Was die KI braucht */}
      <Szene fr={fr} at={T.heisst} until={T.meinung - 2} title="Das braucht die KI" frei titelDauer={TITEL}>
        <Pop fr={fr} at={F("produktdaten")} x={24} y={118}>
          <Tag kind="ok" size={44}>
            Produktdaten
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("beschreibungen")} x={tagX("Produktdaten", 44)} y={118}>
          <Tag kind="ok" size={44}>
            Beschreibungen
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("aktuelle")} x={tagX("Beschreibungen", 44, tagX("Produktdaten", 44))} y={118}>
          <Tag kind="ok" size={44}>
            Preise
          </Tag>
        </Pop>
      </Szene>

      {/* Seine Meinung */}
      <Szene fr={fr} at={T.meinung} until={T.frage - 2} title="Meine Meinung" frei titelDauer={TITEL}>
        <Pop fr={fr} at={F("einkaufsalltag")} until={F("spannend") - 4} x={24} y={118}>
          <Tag kind="warn" size={44}>
            noch nicht Alltag
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("spannend")} x={24} y={118}>
          <Row text="die Richtung: extrem spannend" mark="ok" width={720} onPhoto />
        </Pop>
      </Szene>

      {/* Frage an die Community; der Folgen-Aufruf danach läuft ohne Einblendung */}
      <Szene fr={fr} at={T.frage} until={Infinity} title="KI als Einkäufer?" frei titelDauer={TITEL}>
        <Pop fr={fr} at={F("meint")} x={24} y={118}>
          <div style={{ ...D.chip, color: D.chipText, display: "flex", alignItems: "center", gap: 18, padding: "6px 30px 6px 14px" }}>
            <Blase />
            <div style={{ ...schriftCss(D.text), fontSize: 48, whiteSpace: "nowrap" }}>Schreib mir deine Meinung</div>
          </div>
        </Pop>
      </Szene>

      <Captions C={C} fr={fr} top={UT.top} size={UT.size} />

      {sfx && (
        <>
          <Sfx file="kamera.mp3" at={T.gs1} volume={STIL.sfx * 0.7} />
          {[T.klingt, T.gs2, T.vor, T.punkt, T.heisst, T.meinung, T.frage].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.6} />
          ))}
          <Sfx file="riser.mp3" at={T.meinung - 48} volume={STIL.sfx * 0.6} />
          {[F("übernimmt"), F("menschen"), F("verständlich"), F("produktdaten"), F("beschreibungen"), F("aktuelle"), F("spannend")].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
          {[F("vergleichen"), F("einkaufsalltag")].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          <Sfx file="pop.mp3" at={F("meint")} volume={STIL.sfx * 0.7} />
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
