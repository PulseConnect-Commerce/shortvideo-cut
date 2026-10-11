/**
 * Format NEWS (Skill stil-news), Design nacht-gruen. "Shopify Canvas – Brauchen wir bald keine Webdesigner mehr?"
 * News-Reaction: Bild ab der Hüfte, Titel oben, der Kopf direkt darunter, die Quelle (offizielle Shopify-Seite) als Hintergrund hinter
 * ihm (Greenscreen, von npm run portrait mit --hintergrund in den Take gerechnet), große knackige Titel über dem Kopf,
 * große Untertitel, am Ende die Frage mit Kommentar-Blase. Der Folgen-Aufruf läuft ohne Einblendung.
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
export const meta = { id: "ShopifyCanvas", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage (seine Vorgabe, 2026-10-11): Titel und Einblendungen oben, der Kopf direkt darunter (so hoch wie möglich),
 * die Untertitel unten. "OBEN": 1,2fach, 348 px nach oben (Haaransatz ~y 550, Kinn ~y 1000); pro Szene stehen deshalb
 * nur der Titel und eine Zeile Begriffe über ihm, weitere Begriffe ersetzen die vorherigen. Nur solange die Quelle hinter ihm steht
 * (Greenscreen), liegt er tiefer ("MITTE": 1,2fach, 160 px; so ist der Artikel über dem Kopf lesbar). Die Hose beginnt
 * im Take frühestens bei y 1680; die Bodenblende deckt sie in beiden Lagen ab. */
const OBEN = { scale: 1.2, hoch: 348 };
const MITTE = { scale: 1.2, hoch: 160 };
/** Untertitel: klein und ruhig, damit sie nicht wie Titel wirken (seine Vorgabe 2026-10-11) */
const UT = { top: 1400, size: 64 };
const HOSE = 1680;
/** die Greenscreen-Stellen im Take (wie bei npm run portrait --hintergrund) */
const QUELLE = [...ausgabeFrames(C, 12.8, 17.85), ...ausgabeFrames(C, 27.9, 34.2)];
const mitte = (fr: number) => QUELLE.some(([a, b]) => fr >= a && fr < b);

const F = C.cue;
const T = (() => {
  const gs1 = F("das");
  const gs2 = F("du", C.W("canvas"));
  const sidekick = F("einzelne");
  const folgen = F("und", C.W("umsetzen"));
  const punkt = F("aber", C.W("relevant"));
  const verkauft = F("denn", C.W("verkaufen"));
  const bauen = F("einen", C.W("aussieht"));
  const hinweis = F("canvas", C.W("sache"));
  const frage = F("aber", C.W("verfügbar"));
  return { gs1, gs2, sidekick, folgen, punkt, verkauft, bauen, hinweis, frage };
})();

/** ein langsames Zoom-in über das ganze Video (wie HERO) und drei sanfte Akzente auf den stärksten Stellen */
const zoomAt = (fr: number) => 1 + 0.08 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENTE: [number, number][] = [
  [F("punkt"), C.WE("punkt") + 6],
  [F("verkaufen"), C.WE("verkaufen") + 6],
  [F("meint", T.frage), C.WE("lassen", T.frage) + 4],
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

/** Chat mit Sidekick: der Prompt wird Wort für Wort mit seiner Stimme getippt (so groß, wie der ganze Satz in die
 * sichere Fläche passt) */
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
  const prompt = typedSync(C.spoken("Mach meine Startseite moderner", C.W("zum")), fr);
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

      <HookTitle fr={fr} line1="Shopify baut" line2="deinen Shop mit KI?!" outAt={T.gs1 - 6} />

      {/* Quelle hinter ihm (Greenscreen im Take): nur die Quellenangabe dazu */}
      <Pop fr={fr} at={T.gs1} until={T.sidekick - 4} x={60} y={1228}>
        <Tag kind="ink" size={42}>
          Quelle: Shopify, 1. Okt. 2026
        </Tag>
      </Pop>

      {/* Sidekick: sagen, was du willst, die KI setzt es im Theme um */}
      <Szene fr={fr} at={T.sidekick} until={T.folgen - 2} title="Sag's einfach der KI!" frei>
        <Pop fr={fr} at={F("sidekick")} until={F("zum") - 6} x={24} y={118}>
          <Row text="Sidekick = Shopifys KI-Assistent" width={760} onPhoto />
        </Pop>
        {/* der ganze Satz ist breit: der Chip beginnt am linken Rand der sicheren Fläche (x 65), so endet er vor x 950 */}
        <Pop fr={fr} at={F("zum")} until={F("produktdarstellung") - 4} x={-30} y={118}>
          <Chat fr={fr} text={prompt} voll="Mach meine Startseite moderner" />
        </Pop>
        <Pop fr={fr} at={F("produktdarstellung")} until={F("theme") - 4} x={24} y={118}>
          <Tag kind="accent" size={44}>
            Produkte neu
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("farben")} until={F("theme") - 4} x={tagX("Produkte neu", 44)} y={118}>
          <Tag kind="accent" size={44}>
            Farben = Marke
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("theme")} x={24} y={118}>
          <Row text="direkt im Theme umgesetzt" mark="ok" width={640} onPhoto />
        </Pop>
      </Szene>

      {/* Der entscheidende Punkt: schön heißt nicht verkauft */}
      <Szene fr={fr} at={T.punkt} until={T.verkauft - 2} title="Der entscheidende Punkt" frei>
        <Pop fr={fr} at={F("schön", T.punkt)} until={F("verkaufen") - 4} x={24} y={118}>
          <Row text="schöner Shop in kurzer Zeit" mark="ok" width={680} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("verkaufen")} x={24} y={118}>
          <Row text="verkauft er deshalb?" mark="no" width={560} onPhoto />
        </Pop>
      </Szene>

      {/* Was wirklich verkauft */}
      <Szene fr={fr} at={T.verkauft} until={T.bauen - 2} title="Was wirklich verkauft" frei>
        <Pop fr={fr} at={F("produktseiten")} until={F("vertrauen", T.verkauft) - 4} x={24} y={118}>
          <Tag kind="ok" size={44}>
            Produktseiten
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("nutzerführung")} until={F("vertrauen", T.verkauft) - 4} x={tagX("Produktseiten", 44)} y={118}>
          <Tag kind="ok" size={44}>
            Nutzerführung
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("vertrauen", T.verkauft)} x={24} y={118}>
          <Tag kind="ok" size={44}>
            Vertrauen
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("conversion-rate")} x={tagX("Vertrauen", 44)} y={118}>
          <Tag kind="ok" size={44}>
            Conversion-Rate
          </Tag>
        </Pop>
      </Szene>

      {/* Bauen ist leicht, verkaufen nicht */}
      <Szene fr={fr} at={T.bauen} until={T.hinweis - 2} title="Bauen ≠ verkaufen" frei>
        <Pop fr={fr} at={F("einfacher")} until={F("verkauft", T.bauen) - 4} x={24} y={118}>
          <Row text="Shop bauen: immer einfacher" mark="ok" width={700} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("verkauft", T.bauen)} x={24} y={118}>
          <Tag kind="warn" size={44}>
            Shop, der verkauft: andere Sache
          </Tag>
        </Pop>
      </Szene>

      {/* Hinweis: noch nicht für alle */}
      <Szene fr={fr} at={T.hinweis} until={T.frage - 2} title="Noch nicht für alle!" frei>
        <Pop fr={fr} at={F("jeden", T.hinweis)} x={24} y={118}>
          <Row text="Canvas: nicht in jedem Shopify-Shop" mark="no" width={820} onPhoto />
        </Pop>
      </Szene>

      {/* Frage an die Community */}
      <Szene fr={fr} at={T.frage} until={Infinity} title="KI als Shop-Designer?" frei>
        <Pop fr={fr} at={F("meint", T.frage)} x={24} y={118}>
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
          {[T.gs2, T.sidekick, T.punkt, T.verkauft, T.bauen, T.hinweis, T.frage].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.6} />
          ))}
          <Sfx file="riser.mp3" at={F("punkt") - 48} volume={STIL.sfx * 0.6} />
          {[F("sidekick"), F("produktdarstellung"), F("farben"), F("produktseiten"), F("nutzerführung"), F("vertrauen", T.verkauft), F("conversion-rate"), F("einfacher")].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
          {[F("verkaufen"), F("jeden", T.hinweis)].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          <Sfx file="success.mp3" at={F("theme")} volume={STIL.sfx * 0.5} />
          <Sfx file="pop.mp3" at={F("meint", T.frage)} volume={STIL.sfx * 0.7} />
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
