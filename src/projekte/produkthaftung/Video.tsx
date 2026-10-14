/**
 * Format NEWS (Skill stil-news), Design nacht-gruen. "Produkthaftung News": Wer Produkte aus China oder anderen
 * Nicht-EU-Ländern verkauft, kann nach der Reform des Produkthaftungsrechts stärker haften.
 * Quelle: Onlinehändler News (Händlerbund), "Produkthaftung neu geregelt: Das ändert sich für den Online-Handel",
 * 13. Okt. 2026 (Bundestag hat beschlossen, gilt ab 9. Dez. 2026). Sie steht als Hintergrund hinter ihm (Greenscreen):
 * erst die Schlagzeile, dann markiert "wenn Ware aus Ländern wie China oder den USA verkauft wird", beim Beispiel
 * markiert "Fängt etwa der Akku einer gekauften Powerbank Feuer" (keine Brandbilder, seine Vorgabe).
 * Aufbau nach seinem Plan: Hook, groß "PRODUKTHAFTUNG 2026", Fachartikel, Powerbank-Beispiel, seine Einordnung und
 * der Tipp, am Ende die Frage. Effekte sparsam (vier), Einblendungen mittig über dem Kopf.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ausgabeFrames, Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { BOX, Pop, Row, Szene, Tag, tagBreite } from "../../lib/broll";
import { DesignRahmen, type DesignName, Toenung, useDesign } from "../../lib/design";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Produkthaftung", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage wie Temu (stil-news): 1,2-fach, Bild bis unten gefüllt, Kopf ab y ~440; in der Hook etwas tiefer */
const OBEN = { scale: 1.2, hoch: 384 };
const HOOK_LAGE = { scale: 1.2, hoch: 300 };
/** Einblendungen zur Quelle direkt über dem Kopf (die markierte Stelle endet bei y ~300) */
const QY = 320;
/** Szenen 80 px höher (Titel y ~210-340), Begriffe in derselben Zeile, der Titel macht dem ersten Begriff Platz */
const HOCH = -80;
const UT = { top: 1260, size: 64 };
const TITEL = 75;
const titelBis = (at: number, ersterBegriff: number) => Math.min(TITEL, ersterBegriff - at - 8);
const MITTE_ABS = { x: 0, w: 1080, style: { textAlign: "center" as const, transformOrigin: "center center" } };

/** die Greenscreen-Stellen im Take (wie bei npm run portrait --hintergrund) */
const QUELLE = [...ausgabeFrames(C, 24.3, 28.45), ...ausgabeFrames(C, 30.75, 37.4), ...ausgabeFrames(C, 46.15, 57.3)];

const F = C.cue;
const T = (() => {
  const recht = F("denn");
  const artikel = F("onlinehändler");
  const bundestag = F("der", C.WE("veröffentlicht"));
  const powerbank = F("stell");
  const einordnung = F("und", C.WE("schaden"));
  const tipp = F("mein", C.WE("verantwortlich"));
  const frage = F("aber", C.WE("unterschätzen"));
  return { recht, artikel, bundestag, powerbank, einordnung, tipp, frage };
})();
const QUELLE_ENDE = C.WE("schaden") + 4;

/** sehr leichtes Zoom-in, Akzente höchstens 1,03 (nie stärker als 1,2-fach insgesamt, sonst unscharf) */
const zoomAt = (fr: number) => 1 + 0.03 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENTE: [number, number][] = [
  [F("produkthaftungsrecht"), C.WE("änderungen") + 6],
  [F("import"), C.WE("unterschätzen") + 8],
];
const akzentAt = (fr: number) =>
  AKZENTE.reduce(
    (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, 1.03, 1.03, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
    1,
  );

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; design?: DesignName };

export const Video: React.FC<Props> = ({ design = "nacht-gruen", ...p }) => (
  <DesignRahmen design={design}>
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true }) => {
  const D = useDesign();
  const fr = useCurrentFrame();
  const lage = fr < T.recht ? HOOK_LAGE : OBEN;
  // eine Zeile Begriffe als Ganzes mittig in der Karte
  const reihe = (texte: string[], size: number) => {
    const ws = texte.map((t) => tagBreite(D, t, size));
    let x = (BOX.width - ws.reduce((a, b) => a + b, 0) - 22 * (ws.length - 1)) / 2;
    return ws.map((w) => {
      const x0 = x;
      x += w + 22;
      return x0;
    });
  };
  const S = 34;
  const [t1, t2, t3] = reihe(["Lieferanten", "EU-Verantwortliche", "Haftungsrisiken"], S);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`translateY(${-lage.hoch}px) scale(${lage.scale})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>
      <Toenung />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgb(6 7 10 / 0) 1640px, rgb(6 7 10 / 0.55) 1920px)" }} />

      <AbsoluteFill style={{ transform: "translateY(40px) scale(0.68)", transformOrigin: "50% 0%" }}>
        <HookTitle fr={fr} line1="Produkte aus China?" line2="Dann pass auf!" outAt={T.recht - 4} />
      </AbsoluteFill>

      {/* groß: PRODUKTHAFTUNG 2026 */}
      <Pop fr={fr} at={F("produkthaftungsrecht")} until={T.artikel - 4} {...MITTE_ABS} y={300}>
        <Tag kind="wichtig" size={84}>
          Produkthaftung 2026
        </Tag>
      </Pop>

      {/* Quelle hinter ihm (Greenscreen im Take) */}
      <Pop fr={fr} at={T.artikel} until={QUELLE_ENDE} x={60} y={untertitel ? 1440 : 1190} w={890} style={{ textAlign: "right", transformOrigin: "right center" }}>
        <Tag kind="ink" size={28}>
          Quelle: Onlinehändler News, 13. Okt. 2026
        </Tag>
      </Pop>

      {/* Reform beschlossen: Händler können haften */}
      <Pop fr={fr} at={F("beschlossen")} until={F("haftung", T.bundestag) - 4} {...MITTE_ABS} y={QY}>
        <Tag kind="ok" size={48}>
          Bundestag: Reform beschlossen
        </Tag>
      </Pop>
      <Pop fr={fr} at={F("haftung", T.bundestag)} until={T.powerbank - 4} {...MITTE_ABS} y={QY}>
        <Tag kind="wichtig" size={56}>
          Händler können haften
        </Tag>
      </Pop>
      {untertitel && (
        <Pop fr={fr} at={F("voraussetzungen")} until={T.powerbank - 4} {...MITTE_ABS} y={1350}>
          <Tag kind="ink" size={42}>
            gilt ab 9. Dezember 2026
          </Tag>
        </Pop>
      )}

      {/* Beispiel Powerbank: nicht nur der Kaufpreis */}
      <Pop fr={fr} at={F("powerbank")} until={F("kaufpreis") - 4} {...MITTE_ABS} y={QY}>
        <Tag kind="ok" size={48}>
          Beispiel: Powerbank
        </Tag>
      </Pop>
      <Pop fr={fr} at={F("kaufpreis")} until={F("schaden") - 4} {...MITTE_ABS} y={QY}>
        <Tag kind="ok" size={48}>
          Nicht nur der Kaufpreis …
        </Tag>
      </Pop>
      <Pop fr={fr} at={F("schaden")} until={QUELLE_ENDE} {...MITTE_ABS} y={QY}>
        <Tag kind="wichtig" size={56}>
          … sondern der ganze Schaden
        </Tag>
      </Pop>

      {/* Seine Einordnung */}
      <AbsoluteFill style={{ transform: `translateY(${HOCH}px)` }}>
        <Szene fr={fr} at={T.einordnung} until={T.tipp - 2} title="Meine Einordnung" frei mittig titelDauer={titelBis(T.einordnung, F("mehr", T.einordnung))}>
          <Pop fr={fr} at={F("mehr", T.einordnung)} until={F("pflichten") - 4} x={(BOX.width - 820) / 2} y={10}>
            <Row text="E-Commerce ist mehr als Produkte online stellen" mark="ok" width={820} onPhoto />
          </Pop>
          <Pop fr={fr} at={F("pflichten")} x={(BOX.width - 640) / 2} y={10}>
            <Row text="Du hast viele Pflichten" mark="ok" width={640} onPhoto />
          </Pop>
        </Szene>
      </AbsoluteFill>

      {/* Sein Tipp */}
      <AbsoluteFill style={{ transform: `translateY(${HOCH}px)` }}>
        <Szene fr={fr} at={T.tipp} until={T.frage - 2} title="Mein Tipp" frei mittig titelDauer={titelBis(T.tipp, F("lieferanten"))}>
          <Pop fr={fr} at={F("lieferanten")} until={F("import") - 4} x={t1} y={10}>
            <Tag kind="ok" size={S}>
              Lieferanten
            </Tag>
          </Pop>
          <Pop fr={fr} at={F("unternehmen", T.tipp)} until={F("import") - 4} x={t2} y={10}>
            <Tag kind="ok" size={S}>
              EU-Verantwortliche
            </Tag>
          </Pop>
          <Pop fr={fr} at={F("produkthaftungsrisiken")} until={F("import") - 4} x={t3} y={10}>
            <Tag kind="ok" size={S}>
              Haftungsrisiken
            </Tag>
          </Pop>
          <Pop fr={fr} at={F("import")} x={-BOX.left} w={1080} y={10} style={{ textAlign: "center", transformOrigin: "center center" }}>
            <Tag kind="wichtig" size={48}>
              Beim Import nicht unterschätzen
            </Tag>
          </Pop>
        </Szene>
      </AbsoluteFill>

      {/* Frage an die Community */}
      <AbsoluteFill style={{ transform: `translateY(${HOCH}px)` }}>
        <Szene fr={fr} at={T.frage} until={Infinity} title="Was meinst du?" frei mittig titelDauer={titelBis(T.frage, F("kommentare"))}>
          <Pop fr={fr} at={F("kommentare")} x={-BOX.left} w={1080} y={10} style={{ textAlign: "center", transformOrigin: "center center" }}>
            <Tag kind="ok" size={44}>
              Schreib's in die Kommentare
            </Tag>
          </Pop>
        </Szene>
      </AbsoluteFill>

      {untertitel && <Captions C={C} fr={fr} top={UT.top} size={UT.size} />}

      {sfx && (
        <>
          {/* sparsam (seine Vorgabe 2026-10-12): vier Effekte */}
          <Sfx file="stamp.mp3" at={F("produkthaftungsrecht")} volume={STIL.sfx * 0.5} />
          <Sfx file="kamera.mp3" at={T.artikel} volume={STIL.sfx * 0.7} />
          <Sfx file="whoosh.mp3" at={T.einordnung} volume={STIL.sfx * 0.6} />
          <Sfx file="stamp.mp3" at={F("import")} volume={STIL.sfx * 0.5} />
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
