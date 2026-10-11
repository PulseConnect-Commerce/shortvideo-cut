/**
 * Format FACE (Skill stil-face), Design nacht (die drei Leuchtfarben werden an diesem Video getestet). "Warum zahlst
 * du für so viele Shopify-Apps?" Hot Take aus dem Agenturalltag: Bild ab der Hüfte, Titel oben, Kopf darunter, ruhig
 * geschnitten, die vier Einblendungen aus seinem Skript als große Titel (Reviews → Judge.me, Newsletter → Shopify
 * Messaging, KI-Verkauf + Support → MyStoreBuddy, Designänderung = Extra-App?!), dazu wenige Chips, am Ende die Frage
 * mit Kommentar-Blase. MyStoreBuddy ist seine eigene App: das steht im Bild ("unsere eigene App").
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Bodenblende, Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { Pop, Row, Szene, Tag, tagBreite } from "../../lib/broll";
import { DesignRahmen, type DesignName, schriftCss, Toenung, useDesign } from "../../lib/design";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "ShopifyApps", durationInFrames: C.DURATION, fps: C.FPS };

/** Bildlage (seine Vorgabe, 2026-10-11): Titel und Einblendungen oben, der Kopf direkt darunter (1,2fach, 348 px nach
 * oben; Haaransatz ~y 550-580), die Untertitel unten. Pro Szene nur der Titel und eine Zeile Begriffe, weitere Begriffe
 * ersetzen die vorherigen. Die Hose beginnt im Take frühestens bei y ~1700, die Bodenblende deckt sie ab. */
const CROP = 1.2;
const HOCH = 348;
const HOSE = 1700;

const F = C.cue;
const T = (() => {
  const sammeln = F("wenn");
  const reviews = F("nehmen");
  const newsletter = F("oder", C.W("tarif"));
  const service = F("und", C.W("aus", C.W("e-mail-kontingent")));
  const design = F("und", C.W("plan"));
  const kosten = F("und", C.W("umsetzen"));
  const fazit = F("versteht");
  const frage = F("aber", C.W("app-check"));
  return { sammeln, reviews, newsletter, service, design, kosten, fazit, frage };
})();

/** ruhig (FACE): ein ganz langsames Zoom-in und nur zwei sanfte Akzente */
const zoomAt = (fr: number) => 1 + 0.06 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);
const AKZENTE: [number, number][] = [
  [F("kann"), C.WE("installieren") + 4],
  [F("aber", C.W("sinnvoll", T.fazit)), C.WE("app-check") + 6],
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

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; design?: DesignName };

export const Video: React.FC<Props> = ({ design = "nacht", ...p }) => (
  <DesignRahmen design={design}>
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false }) => {
  const D = useDesign();
  const fr = useCurrentFrame();
  const tagX = (text: string, size: number, x0 = 24) => x0 + tagBreite(D, text, size) + 22;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`translateY(${-HOCH}px) scale(${CROP})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>
      <Toenung />
      <Bodenblende ab={HOSE * CROP - HOCH} />

      <HookTitle fr={fr} line1="Zu viele" line2="Shopify-Apps?!" outAt={T.sammeln - 6} />

      {/* Apps sammeln sich an und kosten jeden Monat */}
      <Szene fr={fr} at={T.sammeln} until={T.reviews - 2} title="App-Friedhof im Shop?!" frei>
        <Pop fr={fr} at={F("ansammeln")} until={F("monat") - 4} x={24} y={118}>
          <Tag kind="warn" size={44}>
            Apps sammeln sich an
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("monat")} x={24} y={118}>
          <Tag kind="warn" size={44}>
            jeden Monat Kosten
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("kostenlose")} x={tagX("jeden Monat Kosten", 44)} y={118}>
          <Tag kind="ok" size={44}>
            gratis geht oft
          </Tag>
        </Pop>
      </Szene>

      {/* 1. Reviews → Judge.me */}
      <Szene fr={fr} at={T.reviews} until={T.newsletter - 2} title="Reviews → Judge.me" titleAt={F("judge.me")} frei>
        <Pop fr={fr} at={F("produktbewertungen")} until={F("judge.me") - 4} x={24} y={0}>
          <Tag kind="accent" size={52}>
            Produktbewertungen
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("review-app")} until={F("kostenlosen", T.reviews) - 4} x={24} y={118}>
          <Row text="Review-App: sinnvoll" mark="ok" width={560} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("kostenlosen", T.reviews)} x={24} y={118}>
          <Tag kind="ok" size={44}>
            kostenloser Tarif
          </Tag>
        </Pop>
      </Szene>

      {/* 2. Newsletter → Shopify Messaging */}
      <Szene fr={fr} at={T.newsletter} until={T.service - 2} title="Newsletter → Shopify Messaging" titleAt={F("shopify-messaging")} frei>
        <Pop fr={fr} at={F("newsletter-abonnenten")} until={F("kostenlosen", T.newsletter) - 4} x={24} y={118}>
          <Row text="30 Abonnenten" width={420} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("teures")} until={F("kostenlosen", T.newsletter) - 4} x={tagX("30 Abonnenten", 44, 24) + 60} y={118}>
          <Row text="teures Tool?" mark="no" width={380} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("kostenlosen", T.newsletter)} x={24} y={118}>
          <Tag kind="ok" size={44}>
            Gratis-Kontingent
          </Tag>
        </Pop>
      </Szene>

      {/* 3. KI-Verkauf + Support → MyStoreBuddy (seine eigene App) */}
      <Szene fr={fr} at={T.service} until={T.design - 2} title="KI-Verkauf + Support → MyStoreBuddy" titleAt={F("mystorebuddy")} frei>
        <Pop fr={fr} at={F("kundenchat")} until={F("mystorebuddy") - 4} x={24} y={0}>
          <Tag kind="warn" size={48}>
            App 1: Kundenchat
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("ki-verkaufsberater")} until={F("mystorebuddy") - 4} x={24} y={92}>
          <Tag kind="warn" size={48}>
            App 2: KI-Verkauf
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("entwickelt")} x={24} y={118}>
          <Tag kind="ink" size={44}>
            unsere eigene App
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("free")} x={tagX("unsere eigene App", 44)} y={118}>
          <Tag kind="ok" size={44}>
            mit Free Plan
          </Tag>
        </Pop>
      </Szene>

      {/* 4. Designänderung = Extra-App?! */}
      <Szene fr={fr} at={T.design} until={T.kosten - 2} title="Designänderung = Extra-App?!" titleAt={F("designänderungen")} frei>
        <Pop fr={fr} at={F("produktbundles")} until={F("designänderungen") - 4} x={24} y={0}>
          <Tag kind="accent" size={48}>
            Bundles
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("buttons")} until={F("designänderungen") - 4} x={tagX("Bundles", 48)} y={0}>
          <Tag kind="accent" size={48}>
            Buttons
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("theme")} x={24} y={118}>
          <Row text="oft direkt im Theme" mark="ok" width={560} onPhoto />
        </Pop>
      </Szene>

      {/* Was jede App kostet */}
      <Szene fr={fr} at={T.kosten} until={T.fazit - 2} title="Jede App kostet" frei>
        <Pop fr={fr} at={F("geld", T.kosten)} x={24} y={118}>
          <Tag kind="warn" size={44}>
            Geld
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("abhängigkeiten")} x={tagX("Geld", 44)} y={118}>
          <Tag kind="warn" size={44}>
            Abhängigkeiten
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("ladezeit")} x={tagX("Abhängigkeiten", 44, tagX("Geld", 44))} y={118}>
          <Tag kind="warn" size={44}>
            Ladezeit
          </Tag>
        </Pop>
      </Szene>

      {/* Fazit: App-Check statt neuer App */}
      <Szene fr={fr} at={T.fazit} until={T.frage - 2} title="App-Check statt neue App!" titleAt={F("aber", C.W("sinnvoll", T.fazit))} frei>
        <Pop fr={fr} at={F("gute")} until={F("aber", C.W("sinnvoll", T.fazit)) - 4} x={24} y={0}>
          <Row text="gute Apps: absolut sinnvoll" mark="ok" width={700} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("app-check")} x={24} y={118}>
          <Row text="ordentlicher App-Check" mark="ok" width={620} onPhoto />
        </Pop>
      </Szene>

      {/* Frage an die Community */}
      <Szene fr={fr} at={T.frage} until={Infinity} title="Wie viele Apps hast du?" frei>
        <Pop fr={fr} at={F("meinung")} x={24} y={118}>
          <div style={{ ...D.chip, color: D.chipText, display: "flex", alignItems: "center", gap: 18, padding: "6px 30px 6px 14px" }}>
            <Blase />
            <div style={{ ...schriftCss(D.text), fontSize: 48, whiteSpace: "nowrap" }}>Schreib mir deine Meinung</div>
          </div>
        </Pop>
      </Szene>

      <Captions C={C} fr={fr} top={1360} size={100} />

      {sfx && (
        <>
          {[T.sammeln, T.reviews, T.newsletter, T.service, T.design, T.kosten, T.fazit, T.frage].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.6} />
          ))}
          {[F("judge.me"), F("shopify-messaging"), F("mystorebuddy"), F("designänderungen")].map((at) => (
            <Sfx key={`p${at}`} file="pop.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
          {[F("review-app"), F("theme"), F("app-check")].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} volume={STIL.sfx * 0.7} />
          ))}
          {[F("teures"), F("ladezeit")].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} volume={STIL.sfx * 0.5} />
          ))}
          <Sfx file="riser.mp3" at={F("aber", C.W("sinnvoll", T.fazit)) - 48} volume={STIL.sfx * 0.6} />
          <Sfx file="pop.mp3" at={F("meinung")} volume={STIL.sfx * 0.7} />
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
