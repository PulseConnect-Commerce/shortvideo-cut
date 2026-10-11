/**
 * Format NEWS (Skill stil-news), Design nacht-gruen. "Claude verschenkt KI an Gründer?!"
 * News-Reaction: Bild ab der Hüfte, Titel oben, der Kopf direkt darunter, die Quelle (Anthropics Ankündigung vom
 * 6. Okt. 2026) als Hintergrund hinter ihm (Greenscreen, von npm run portrait mit --hintergrund in den Take gerechnet).
 * Einblendungen nach seinem Schnittplan: Hook "CLAUDE 1 JAHR KOSTENLOS?!", "1 JAHR CLAUDE TEAM + 1.000 $ API", "AUCH
 * OHNE INVESTOREN!" (mit Sprechpause vor dem "Nein"), am Schluss "BEWERBUNG: LINK IN BESCHREIBUNG". Der
 * Folgen-Aufruf läuft ohne Einblendung. Am Ende ein Hinweis zum Stand (seine Wahl 2026-10-11): laut FAQ der
 * Programmseite ist Anthropic beim Team-Jahr und den 1.000 $ derzeit überlastet und prüft Bewerbungen neu.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ausgabeFrames, Bodenblende, Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { Pop, Row, Szene, Tag } from "../../lib/broll";
import { DesignRahmen, type DesignName, schriftCss, Toenung, useDesign } from "../../lib/design";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "ClaudeStartups", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage (seine Vorgabe, 2026-10-11): Titel und Einblendungen oben, der Kopf direkt darunter ("OBEN"), die Untertitel
 * unten; pro Szene nur der Titel und eine Zeile Begriffe, weitere Begriffe ersetzen die vorherigen. Nur solange die
 * Quelle hinter ihm steht (Greenscreen), liegt er tiefer ("MITTE"), damit die Schlagzeile lesbar ist. */
const OBEN = { scale: 1.2, hoch: 348 };
const MITTE = { scale: 1.2, hoch: 160 };
/** Untertitel: klein und ruhig, damit sie nicht wie Titel wirken (seine Vorgabe 2026-10-11) */
const UT = { top: 1400, size: 64 };
const HOSE = 1700;
/** die Greenscreen-Stelle im Take (wie bei npm run portrait --hintergrund): "Anthropic … erweitert. Und das Angebot …" */
const QUELLE = ausgabeFrames(C, 35.55, 44.95);
const mitte = (fr: number) => QUELLE.some(([a, b]) => fr >= a && fr < b);

const F = C.cue;
const T = (() => {
  const gs = F("anthropic");
  const angebot = F("denn");
  const invest = F("jetzt");
  const voraus = F("voraussetzung");
  const wichtig = F("wichtig");
  const folgen = F("wenn", C.W("gratis-abo"));
  const spannend = F("was", C.W("verpassen"));
  const meinung = F("meine");
  const link = F("ich", C.W("darauf", meinung));
  return { gs, angebot, invest, voraus, wichtig, folgen, spannend, meinung, link };
})();

/** ein langsames Zoom-in über das ganze Video und drei sanfte Akzente auf den stärksten Stellen */
const zoomAt = (fr: number) => 1 + 0.08 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENTE: [number, number][] = [
  [F("kostenlos"), C.WE("kostenlos") + 6],
  [F("nein") - 4, C.WE("nein") + 10],
  [F("definitiv"), C.WE("anschauen") + 6],
];
const akzentAt = (fr: number) =>
  AKZENTE.reduce(
    (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, 1.06, 1.06, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
    1,
  );

/** kleiner Hinweis-Kasten über den Untertiteln (wie die Quellen-Pille, aber zweizeilig) */
const Hinweis: React.FC<{ fr: number; at: number }> = ({ fr, at }) => {
  const D = useDesign();
  return (
    <Pop fr={fr} at={at} x={60} y={1206}>
      <div style={{ ...D.chip, color: D.chipText, width: 880, padding: "14px 24px", boxSizing: "border-box" }}>
        <div style={{ ...schriftCss(D.text), fontSize: 34, lineHeight: 1.25 }}>
          <span style={{ color: D.warn }}>Stand 11.10.:</span> Team-Jahr und 1.000 $ sind laut Anthropic derzeit
          überlastet, Bewerbungen werden neu geprüft.
        </div>
      </div>
    </Pop>
  );
};

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; design?: DesignName };

export const Video: React.FC<Props> = ({ design = "nacht-gruen", ...p }) => (
  <DesignRahmen design={design}>
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false }) => {
  const fr = useCurrentFrame();
  const lage = mitte(fr) ? MITTE : OBEN;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`translateY(${-lage.hoch}px) scale(${lage.scale})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>
      <Toenung />
      <Bodenblende ab={HOSE * lage.scale - lage.hoch} />

      <HookTitle fr={fr} line1="Claude 1 Jahr" line2="kostenlos?!" outAt={T.gs - 6} />

      {/* Quelle hinter ihm (Greenscreen im Take): die Schlagzeile der Ankündigung */}
      <Pop fr={fr} at={T.gs} until={T.angebot - 4} x={60} y={1228}>
        <Tag kind="ink" size={42}>
          Quelle: Anthropic, 6. Okt. 2026
        </Tag>
      </Pop>

      {/* Was es gibt (seine Einblendung "1 JAHR CLAUDE TEAM + 1.000 $ API") */}
      <Szene fr={fr} at={T.angebot} until={T.invest - 2} title="1 Jahr Claude Team + 1.000 $ API" titleAt={F("ganzes", T.angebot)} frei>
        <Pop fr={fr} at={F("angenommen")} until={F("ganzes", T.angebot) - 4} x={24} y={0}>
          <Tag kind="accent" size={52}>
            Startup angenommen?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("kostenlos")} until={F("rabatte") - 4} x={24} y={118}>
          <Row text="kostenlos für bis zu 5 Nutzer" mark="ok" width={700} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("rabatte")} x={24} y={118}>
          <Row text="+ Rabatte bei Partnern wie ElevenLabs" mark="ok" width={860} onPhoto />
        </Pop>
      </Szene>

      {/* Auch ohne Investoren (seine Einblendung "AUCH OHNE INVESTOREN!", die Pause vor dem "Nein" bleibt im Schnitt) */}
      <Szene fr={fr} at={T.invest} until={T.voraus - 2} title="Auch ohne Investoren!" titleAt={F("nein")} frei>
        <Pop fr={fr} at={F("millionen")} until={F("nein") - 4} x={24} y={0}>
          <Tag kind="warn" size={52}>
            Millionen von Investoren?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("eigenfinanziert")} x={24} y={118}>
          <Row text="auch komplett eigenfinanziert" mark="ok" width={720} onPhoto />
        </Pop>
      </Szene>

      {/* Wer sich bewerben kann */}
      <Szene fr={fr} at={T.voraus} until={T.wichtig - 2} title="Wer kann sich bewerben?" frei>
        <Pop fr={fr} at={F("gegründet")} until={F("finanziert", T.voraus) - 4} x={24} y={118}>
          <Row text="gegründet in den letzten 5 Jahren" mark="ok" width={800} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("finanziert", T.voraus)} x={24} y={118}>
          <Row text="oder finanziert in den letzten 2 Jahren" mark="ok" width={860} onPhoto />
        </Pop>
      </Szene>

      {/* Für wen es gedacht ist */}
      <Szene fr={fr} at={T.wichtig} until={T.folgen - 2} title="Wichtig!" frei>
        <Pop fr={fr} at={F("startups", T.wichtig)} until={F("gratis-abo") - 4} x={24} y={118}>
          <Row text="für Startups, die mit Claude bauen" mark="ok" width={820} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("gratis-abo")} x={24} y={118}>
          <Row text="kein Gratis-Abo für jede Firma" mark="no" width={760} onPhoto />
        </Pop>
      </Szene>

      {/* Folgen-Aufruf: ohne Einblendung */}

      {/* Was er spannend findet */}
      <Szene fr={fr} at={T.spannend} until={T.meinung - 2} title="Das finde ich spannend" frei>
        <Pop fr={fr} at={F("leistungsfähiger")} until={F("gründer", C.W("anbieter")) - 4} x={24} y={118}>
          <Row text="KI-Modelle werden immer stärker" mark="ok" width={760} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("gründer", C.W("anbieter"))} x={24} y={118}>
          <Tag kind="warn" size={44}>
            Anbieter werben früh um Gründer
          </Tag>
        </Pop>
      </Szene>

      {/* Seine Meinung */}
      <Szene fr={fr} at={T.meinung} until={T.link - 2} title="Meine Meinung" frei>
        <Pop fr={fr} at={F("startup", T.meinung)} until={F("bewerbung", T.meinung) - 4} x={24} y={118}>
          <Tag kind="accent" size={44}>
            Startup im Aufbau?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("bewerbung", T.meinung)} x={24} y={118}>
          <Row text="Bewerbung anschauen!" mark="ok" width={560} onPhoto />
        </Pop>
      </Szene>

      {/* Schluss (seine Einblendung "BEWERBUNG: LINK IN BESCHREIBUNG") */}
      <Szene fr={fr} at={T.link} until={Infinity} title="Bewerbung: Link in Beschreibung" frei>
        <Pop fr={fr} at={F("offiziellen")} x={24} y={118}>
          <Tag kind="ink" size={44}>
            claude.com/programs/startups
          </Tag>
        </Pop>
      </Szene>

      {/* Hinweis zum Stand des Angebots, bis zum Schluss */}
      <Hinweis fr={fr} at={T.meinung} />

      <Captions C={C} fr={fr} top={UT.top} size={UT.size} />

      {sfx && (
        <>
          <Sfx file="kamera.mp3" at={T.gs} volume={STIL.sfx * 0.7} />
          {[T.angebot, T.invest, T.voraus, T.wichtig, T.spannend, T.meinung, T.link].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.6} />
          ))}
          <Sfx file="riser.mp3" at={F("meinung", T.meinung) - 48} volume={STIL.sfx * 0.6} />
          {[F("kostenlos"), F("rabatte"), F("eigenfinanziert"), F("gegründet"), F("finanziert", T.voraus), F("startups", T.wichtig), F("leistungsfähiger"), F("bewerbung", T.meinung)].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
          {[F("nein"), F("gratis-abo")].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          <Sfx file="pop.mp3" at={F("offiziellen")} volume={STIL.sfx * 0.7} />
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
