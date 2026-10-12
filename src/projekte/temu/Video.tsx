/**
 * Format NEWS (Skill stil-news), Design nacht-gruen. "Temu, Shein und AliExpress verlieren in Deutschland über ein Drittel
 * ihres Umsatzes", Hauptaufnahme ist sein zweiter, letzter Durchgang im Clip (seine Vorgabe).
 * Quelle: n-tv, "Deutschland-Umsatz von Temu, Shein und Co. bricht ein", 9. Okt. 2026 (Zahlen vom bevh). Sie steht als
 * Hintergrund hinter ihm (Greenscreen, npm run portrait --hintergrund): nach der Hook die Schlagzeile (etwa drei
 * Sekunden), dann die markierte Stelle "um 35,5 Prozent auf 566 Millionen Euro zurück" mit groß "−35,5 % Umsatz", beim
 * Zoll-Satz die markierte Stelle "pro Warengruppe eine Pauschale von 3 Euro" mit "3 € pro Warenkategorie". Die Zölle
 * sind nur ein möglicher Grund ("können … sein"), keine Einblendung behauptet mehr. Der Rest läuft direkt in die Kamera
 * mit kurzen Titeln; der Folgen-Aufruf läuft ohne Einblendung.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ausgabeFrames, Bodenblende, Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { BOX, Pop, Row, Szene, Tag, tagBreite } from "../../lib/broll";
import { DesignRahmen, type DesignName, Toenung, useDesign } from "../../lib/design";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Temu", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage (seine Vorgabe, 2026-10-12): das Gesicht im unteren Teil des oberen Drittels, auch vor der Quelle
 * (Greenscreen); Einblendungen nicht am oberen Rand, sondern direkt über dem Kopf. Die markierte Artikelstelle liegt
 * darüber (y ~150-330), die Einblendung zur Quelle bei y 340. */
const OBEN = { scale: 1.2, hoch: 384 };
/** während der Hook liegt das Bild tiefer (Kopf ab y ~500), damit die zweizeilige Hook über dem Kopf Platz hat; der
 * Wechsel fällt mit dem Schnitt auf die Quelle zusammen */
const HOOK_LAGE = { scale: 1.2, hoch: 300 };
const MITTE = OBEN;
/** Einblendungen zur Quelle: direkt über dem Kopf */
const QY = 255;
/** Hook, Szenen-Titel und Begriffe stehen über dem Kopf (Haar bei y ~400, seine Vorgabe 2026-10-12: "Jetzt liegen die
 * Einblendungen leider direkt auf meinem Kopf"): der Hook kleiner (y ~200-395), die Szenen 60 px höher (Titel
 * y ~230-360); die Begriffe stehen in derselben Zeile und ersetzen den Titel, sobald der erste erscheint. */
const HOCH = -80;
const titelBis = (at: number, ersterBegriff: number) => Math.min(TITEL, ersterBegriff - at - 8);
/** Untertitel klein bei y 1260; Hinweise bei y 1350, die Quellen-Pille klein unten rechts bei y 1440. Ohne
 * eingebrannte Untertitel (er legt sie in TikTok ins untere Drittel) bleibt das untere Drittel frei: keine Hinweise,
 * die Quellen-Pille bei y 1190. */
const UT = { top: 1260, size: 64 };
const HOSE = 1725;
/** Szenen-Titel nur kurz einblenden (seine Vorgabe 2026-10-12) */
const TITEL = 75;
/** die Greenscreen-Stellen im Take (wie bei npm run portrait --hintergrund) */
const QUELLE = [
  ...ausgabeFrames(C, 45.1, 49.95),
  ...ausgabeFrames(C, 50.5, 53.5),
  ...ausgabeFrames(C, 59.05, 65.55),
  ...ausgabeFrames(C, 66.1, 75.7),
];
const mitte = (fr: number) => QUELLE.some(([a, b]) => fr >= a && fr < b);

const F = C.cue;
const T = (() => {
  const gs1 = F("und", C.WE("umsatzes"));
  const zahlen = F("denn", C.WE("davon"));
  const zoll = F("und", C.WE("zuvor"));
  const trifft = F("und", C.WE("fällig"));
  const spannend = F("aber", C.WE("kanal"));
  const shops = F("denn", C.WE("profitieren", C.W("automatisch")));
  const meinung = F("meine");
  const frage = F("aber", C.WE("verkaufsstrategie"));
  return { gs1, zahlen, zoll, trifft, spannend, shops, meinung, frage };
})();
const MINUS = F("355", T.zahlen);
const DREI = F("3", C.W("150"));
const QUELLE_ENDE = C.WE("fällig") + 4;

/** ein langsames Zoom-in über das ganze Video und zwei sanfte Akzente auf den stärksten Stellen */
const zoomAt = (fr: number) => 1 + 0.03 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENTE: [number, number][] = [
  [F("nur", T.spannend), C.WE("profitieren", T.spannend) + 6],
  [F("weniger", T.meinung), C.WE("verkaufsstrategie") + 8],
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
  const lage = fr < T.gs1 ? HOOK_LAGE : mitte(fr) ? MITTE : OBEN;
  // eine Zeile Begriffe als Ganzes mittig in der Karte (seine Vorgabe 2026-10-12): Startpunkte der einzelnen Chips
  const reihe = (texte: string[], size: number) => {
    const ws = texte.map((t) => tagBreite(D, t, size));
    let x = (BOX.width - ws.reduce((a, b) => a + b, 0) - 22 * (ws.length - 1)) / 2;
    return ws.map((w) => {
      const x0 = x;
      x += w + 22;
      return x0;
    });
  };
  const S = 40;
  const [x1, x2, x3, x4] = reihe(["Produkte", "Vertrauen", "Preise", "guter Shop"], S);
  const [m1, m2] = reihe(["Weniger Konkurrenz", "≠ Verkaufsstrategie"], 44);
  const [f1, f2] = reihe(["Mehr bei deutschen Shops?", "Oder weniger?"], 44);
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
        <HookTitle fr={fr} line1="Temu verliert" line2="35 % Umsatz?!" outAt={T.gs1 - 4} />
      </AbsoluteFill>

      {/* Quelle hinter ihm (Greenscreen im Take): Schlagzeile, dann die markierten Stellen */}
      <Pop fr={fr} at={T.gs1} until={QUELLE_ENDE} x={60} y={untertitel ? 1440 : 1190} w={890} style={{ textAlign: "right", transformOrigin: "right center" }}>
        <Tag kind="ink" size={28}>
          Quelle: n-tv, 9. Okt. 2026 · Zahlen: bevh
        </Tag>
      </Pop>

      {/* Die Zahlen: −35,5 % */}
      {untertitel && (
      <Pop fr={fr} at={F("plattformen", T.zahlen)} until={T.zoll - 4} x={0} w={1080} style={{ textAlign: "center", transformOrigin: "center center" }} y={1350}>
        <Tag kind="ink" size={42}>
          Shein, Temu, AliExpress · 3. Quartal
        </Tag>
      </Pop>
      )}
      <Pop fr={fr} at={MINUS} until={T.zoll - 4} x={0} w={1080} style={{ textAlign: "center", transformOrigin: "center center" }} y={QY}>
        <Tag kind="wichtig" size={56}>
          −35,5 % Umsatz
        </Tag>
      </Pop>

      {/* Ein möglicher Grund: der neue EU-Zoll */}
      <Pop fr={fr} at={F("eu-zölle")} until={DREI - 4} x={0} w={1080} style={{ textAlign: "center", transformOrigin: "center center" }} y={QY}>
        <Tag kind="ok" size={44}>
          Möglicher Grund: EU-Zoll
        </Tag>
      </Pop>
      <Pop fr={fr} at={DREI} until={T.trifft - 4} x={0} w={1080} style={{ textAlign: "center", transformOrigin: "center center" }} y={QY}>
        <Tag kind="wichtig" size={56}>
          3 € pro Warenkategorie
        </Tag>
      </Pop>
      {untertitel && (
      <Pop fr={fr} at={F("juli")} until={T.trifft - 4} x={0} w={1080} style={{ textAlign: "center", transformOrigin: "center center" }} y={1350}>
        <Tag kind="ink" size={42}>
          seit Juli · Sendungen unter 150 €
        </Tag>
      </Pop>
      )}

      {/* Das Spannende: Temu verkauft weniger, deutsche Shops gewinnen nicht automatisch */}
      <AbsoluteFill style={{ transform: `translateY(${HOCH}px)` }}>
      <Szene fr={fr} at={T.spannend} until={T.shops - 2} title="Das Spannende" frei mittig titelDauer={titelBis(T.spannend, F("weniger", T.spannend))}>
        <Pop fr={fr} at={F("weniger", T.spannend)} until={F("automatisch", T.spannend) - 4} x={(BOX.width - 720) / 2} y={10}>
          <Row text="Temu & Co. verkaufen weniger" mark="ok" width={720} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("automatisch", T.spannend)} x={(BOX.width - 760) / 2} y={10}>
          <Row text="Shops gewinnen nicht automatisch" mark="no" width={760} onPhoto />
        </Pop>
      </Szene>
      </AbsoluteFill>

      {/* Womit Shops überzeugen */}
      <AbsoluteFill style={{ transform: `translateY(${HOCH}px)` }}>
      <Szene fr={fr} at={T.shops} until={T.meinung - 2} title="So überzeugst du Kunden" frei mittig titelDauer={titelBis(T.shops, F("produkten"))}>
        <Pop fr={fr} at={F("produkten")} x={x1} y={10}>
          <Tag kind="ok" size={S}>
            Produkte
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("vertrauen")} x={x2} y={10}>
          <Tag kind="ok" size={S}>
            Vertrauen
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("preisen")} x={x3} y={10}>
          <Tag kind="ok" size={S}>
            Preise
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("funktioniert")} x={x4} y={10}>
          <Tag kind="ok" size={S}>
            guter Shop
          </Tag>
        </Pop>
      </Szene>
      </AbsoluteFill>

      {/* Seine Meinung */}
      <AbsoluteFill style={{ transform: `translateY(${HOCH}px)` }}>
      <Szene fr={fr} at={T.meinung} until={T.frage - 2} title="Meine Meinung" frei mittig titelDauer={titelBis(T.meinung, F("konkurrenz", T.meinung))}>
        <Pop fr={fr} at={F("konkurrenz", T.meinung)} x={m1} y={10}>
          <Tag kind="ok" size={44}>
            Weniger Konkurrenz
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("verkaufsstrategie")} x={m2} y={10}>
          <Tag kind="wichtig" size={44}>
            ≠ Verkaufsstrategie
          </Tag>
        </Pop>
      </Szene>
      </AbsoluteFill>

      {/* Frage an die Community */}
      <AbsoluteFill style={{ transform: `translateY(${HOCH}px)` }}>
      <Szene fr={fr} at={T.frage} until={Infinity} title="Was glaubt ihr?" frei mittig titelDauer={titelBis(T.frage, F("deutschen", T.frage))}>
        <Pop fr={fr} at={F("deutschen", T.frage)} x={f1} y={10}>
          <Tag kind="ok" size={44}>
            Mehr bei deutschen Shops?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("bestellen", T.frage)} x={f2} y={10}>
          <Tag kind="ok" size={44}>
            Oder weniger?
          </Tag>
        </Pop>
      </Szene>
      </AbsoluteFill>

      {untertitel && <Captions C={C} fr={fr} top={UT.top} size={UT.size} />}

      {sfx && (
        <>
          {/* sparsam (seine Vorgabe 2026-10-12: Effekte "nicht zu oft"): fünf Effekte in gut einer Minute */}
          <Sfx file="kamera.mp3" at={T.gs1} volume={STIL.sfx * 0.7} />
          {[MINUS, DREI].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          {[T.spannend, T.meinung].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.6} />
          ))}
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
