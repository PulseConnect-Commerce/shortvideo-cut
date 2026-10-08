/**
 * "5 Dinge, bevor du bei einem unbekannten Onlineshop bestellst". Talking Head im Vollbild, fester Ausschnitt ohne
 * Hose (1,17 ab der Oberkante), ein durchgehendes langsames Zoom-in und vier kleine Akzente, Hook-Satz oben, und
 * über dem Kopf pro Thema eine Bildkarte (B-Roll, broll.tsx), deren Teile auf ihrem Wort erscheinen.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { Raster } from "../../lib/raster";
import { createCut, typedSync } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import {
  between,
  chip,
  IconBattery,
  IconBin,
  IconBookmark,
  IconBox,
  IconBuilding,
  IconCard,
  IconCash,
  IconCoin,
  IconEye,
  IconImage,
  IconMail,
  IconPin,
  IconPlug,
  IconPrice,
  IconShield,
  IconStopwatch,
  IconText,
  IconWarn,
  Pop,
  Row,
  SaleTag,
  SearchBar,
  Szene,
  Tag,
} from "./broll";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Shopcheck", durationInFrames: C.DURATION, fps: C.FPS };

/** fester Bildausschnitt: die Jeans beginnt in beiden Takes frühestens bei y 1690, das Bild endet so bei ~1640 */
const CROP = 1.17;

/* Zeitpunkte: jede Szene und jedes Element auf seinem Wort */
const F = C.cue;
const T = (() => {
  const zeit = F("das", C.W("dinge"));
  const s1 = F("erstens");
  const s2 = F("zweitens");
  const s3 = F("drittens");
  const cookies = F("und", C.W("agb"));
  const s4 = F("viertens");
  const s5 = F("fünftens");
  const rabatt = F("undvor");
  const zweimal = F("immer", C.W("geboten", rabatt));
  const cta = F("und", C.W("hinschauen"));
  return { zeit, s1, s2, s3, cookies, s4, s5, rabatt, zweimal, cta };
})();

/** ein durchgehendes, langsames Zoom-in über das ganze Video (100 % → 110 %), ohne Sprünge an den Schnitten */
const zoomAt = (fr: number) => 1 + 0.1 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);

/** wenige kleine Akzente an den wichtigsten Stellen: [von, bis] in Frames, sanft auf AKZENT heran (8 Frames), halten
 * bis zum Ende der Phrase, sanft zurück (10 Frames). Anker 50 % 42 % (zwischen Augen und Kinn). */
const AKZENT = 1.08;
const AKZENTE: [number, number][] = [
  [F("viel", T.zeit), C.WE("ersparen") + 4],
  [F("widerrufs-button"), C.WE("widerrufs-button") + 4],
  [F("vorsicht"), C.WE("geboten", F("vorsicht")) + 4],
  [F("viel", T.rabatt), C.WE("sein", F("wahr")) + 4],
];
const akzentAt = (fr: number) =>
  AKZENTE.reduce(
    (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, AKZENT, AKZENT, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
    1,
  );

/** raster: Platzierungsraster mit sicherer Fläche und den Zonen von TikTok/Instagram (nur für Standbilder) */
export const Video: React.FC<{ voice?: boolean; sfx?: boolean; raster?: boolean }> = ({ voice = true, sfx = true, raster = false }) => {
  const fr = useCurrentFrame();
  const googeln = typedSync(C.spoken("Firma + Adresse", C.W("firma")), fr);
  const bm = interpolate(fr, [F("speichere") + 4, F("speichere") + 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: STIL.paper }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`scale(${CROP})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>

      <HookTitle fr={fr} line1="Bevor du im Onlineshop bestellst:" line2="Check diese 5 Dinge." outAt={T.zeit - 8} />

      {/* 2 Minuten, viel Ärger gespart */}
      <Szene fr={fr} at={T.zeit} until={T.s1 - 2} title="5 Checks vor dem Kauf" photo="broll/shopcheck/zeit.jpg">
        <Pop fr={fr} at={F("zwei")} x={24} y={122}>
          <div style={{ ...chip, display: "inline-flex", alignItems: "center", gap: 14, padding: "8px 28px 8px 12px" }}>
            <IconStopwatch size={76} turn={interpolate(fr, [F("zwei"), F("zwei") + 40], [0, 0.85], clamp)} />
            <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: "-0.03em" }}>max. 2 Minuten</div>
          </div>
        </Pop>
        <Pop fr={fr} at={F("ärger")} x={24} y={244}>
          <Tag kind="ok">spart viel Ärger</Tag>
        </Pop>
      </Szene>

      {/* 1: der Shop als Ganzes */}
      <Szene fr={fr} at={T.s1} until={T.s2 - 2} nr={1} title="Der Shop als Ganzes" photo="broll/shopcheck/shop.jpg">
        <Pop fr={fr} at={F("professionell")} until={F("passen")} x={500} y={130}>
          <Tag>professionell?</Tag>
        </Pop>
        <Pop fr={fr} at={F("texte")} x={24} y={118}>
          <Row icon={<IconText />} text="Texte" mark="ok" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("bilder")} x={24} y={210}>
          <Row icon={<IconImage />} text="Bilder" mark="ok" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("preise")} x={24} y={302}>
          <Row icon={<IconPrice />} text="Preise" mark="ok" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("schnell")} x={430} y={316}>
          <Tag kind="warn" size={44}>
            zusammengebaut?
          </Tag>
        </Pop>
      </Szene>

      {/* 2: Impressum, im Zweifel googeln */}
      <Szene fr={fr} at={T.s2} until={T.s3 - 2} nr={2} title="Ins Impressum schauen" photo="broll/shopcheck/impressum.jpg">
        <div style={{ opacity: 1 - interpolate(fr, [F("zweifel") - 7, F("zweifel") - 1], [0, 1], clamp) }}>
          <Pop fr={fr} at={F("unternehmen")} x={24} y={118}>
            <Row icon={<IconBuilding />} text="Unternehmen" mark="ok" width={600} onPhoto />
          </Pop>
          <Pop fr={fr} at={F("anschrift")} x={24} y={210}>
            <Row icon={<IconPin />} text="Anschrift" mark="ok" width={600} onPhoto />
          </Pop>
          <Pop fr={fr} at={F("kontaktieren")} x={24} y={302}>
            <Row icon={<IconMail />} text="Kontakt" mark="ok" width={600} onPhoto />
          </Pop>
        </div>
        <Pop fr={fr} at={F("zweifel")} x={40} y={150} w={810}>
          <SearchBar fr={fr} text={googeln} x={0} y={0} w={810} />
        </Pop>
        <Pop fr={fr} at={F("googeln")} x={40} y={290}>
          <Tag>kurz googeln</Tag>
        </Pop>
      </Szene>

      {/* 3: rechtliche Seiten */}
      <Szene fr={fr} at={T.s3} until={T.cookies - 2} nr={3} title="Rechtliche Seiten" photo="broll/shopcheck/recht.jpg">
        <Pop fr={fr} at={F("datenschutzerklärung")} x={24} y={122}>
          <Row text="Datenschutz" mark="ok" width={400} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("widerruf")} x={430} y={122}>
          <Row text="Widerruf" mark="ok" width={340} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("widerrufs-button")} x={24} y={250}>
          <div
            style={{
              display: "inline-block",
              padding: "18px 34px",
              borderRadius: 18,
              background: STIL.yellow,
              fontSize: 46,
              fontWeight: 800,
              boxShadow: "0 8px 20px rgb(20 22 26 / 0.25)",
              transform: `scale(${1 - 0.06 * between(fr, F("widerrufs-button") + 10, F("widerrufs-button") + 14, 3)})`,
            }}
          >
            Widerrufs-Button
          </div>
        </Pop>
        <Pop fr={fr} at={F("agb")} x={560} y={254}>
          <Row text="AGB" mark="ok" width={250} onPhoto />
        </Pop>
      </Szene>

      {/* 3: Tracking, Cookies, Einwilligung */}
      <Szene fr={fr} at={T.cookies} until={T.s4 - 2} nr={3} title="Tracking & Cookies" photo="broll/shopcheck/cookies.jpg">
        <Pop fr={fr} at={F("einwilligung")} x={300} y={118}>
          <div style={{ ...chip, display: "inline-block", padding: "10px 24px", fontSize: 50, fontWeight: 800 }}>Einwilligung?</div>
        </Pop>
        <Pop fr={fr} at={F("einwilligung") + 6} x={300} y={212}>
          <div style={{ display: "flex", gap: 18 }}>
            {["Akzeptieren", "Ablehnen"].map((t) => (
              <div key={t} style={{ ...chip, padding: "14px 26px", borderRadius: 14, border: `4px solid ${STIL.ink}`, fontSize: 42, fontWeight: 700 }}>
                {t}
              </div>
            ))}
          </div>
        </Pop>
        <Pop fr={fr} at={F("sauber")} x={300} y={318}>
          <Tag kind="ok">sauber umgesetzt</Tag>
        </Pop>
      </Szene>

      {/* 4: Zahlungsmethoden */}
      <Szene fr={fr} at={T.s4} until={T.s5 - 2} nr={4} title="Zahlungsmethoden" photo="broll/shopcheck/zahlung.jpg">
        <Pop fr={fr} at={F("vorkasse")} x={24} y={118}>
          <Row icon={<IconCash />} text="Vorkasse" mark="no" width={400} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("krypto")} x={24} y={210}>
          <Row icon={<IconCoin />} text="Krypto" mark="no" width={400} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("dubiose")} until={F("vorsicht") - 8} x={24} y={316}>
          <Tag kind="ink" size={44}>
            dubios?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("vorsicht")} x={24} y={316}>
          <Tag kind="warn">Vorsicht!</Tag>
        </Pop>
        <Pop fr={fr} at={F("etablierte")} x={470} y={118}>
          <Row icon={<IconCard />} text="etabliert" width={380} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("käuferschutz")} x={470} y={210}>
          <Row icon={<IconShield />} text="Käuferschutz" width={380} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("gutes")} x={470} y={316}>
          <Tag kind="ok">gutes Zeichen</Tag>
        </Pop>
      </Szene>

      {/* 5: Realitätscheck */}
      <Szene fr={fr} at={T.s5} until={T.rabatt - 2} nr={5} title="Realitätscheck" photo="broll/shopcheck/technik.jpg">
        <Pop fr={fr} at={F("elektrogeräte")} x={24} y={118}>
          <Row icon={<IconPlug />} text="Elektrogeräte" width={400} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("händler")} x={480} y={126}>
          <Tag size={44}>für Händler</Tag>
        </Pop>
        <Pop fr={fr} at={F("gesetzliche")} until={F("händler") - 8} x={480} y={126}>
          <Tag kind="ink" size={44}>
            Pflichten
          </Tag>
        </Pop>
        {(
          [
            ["weee", <IconBin key="b" size={76} />, "WEEE-Nr."],
            ["battg", <IconBattery key="a" size={76} />, "BattG"],
            ["verpackungsregister", <IconBox key="v" size={76} />, "Verpackung"],
          ] as const
        ).map(([w, icon, label], i) => (
          <Pop key={w} fr={fr} at={F(w)} x={24 + i * 283} y={226} w={272} style={{ transformOrigin: "center" }}>
            <div style={{ ...chip, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 10px" }}>
              {icon}
              <div style={{ fontSize: 42, fontWeight: 800, whiteSpace: "nowrap" }}>{label}</div>
            </div>
          </Pop>
        ))}
      </Szene>

      {/* vor allem: 70 oder 80 % reduziert, zu gut um wahr zu sein, zweimal hinschauen */}
      <Szene
        fr={fr}
        at={T.rabatt}
        until={T.cta - 2}
        title="Fast alles reduziert?"
        titleAt={F("fast", T.rabatt)}
        photo="broll/shopcheck/rabatt.jpg"
      >
        <Pop fr={fr} at={F("70")} x={36} y={130} style={{ transformOrigin: "center" }}>
          <SaleTag text="-70 %" rot={-6} />
        </Pop>
        <Pop fr={fr} at={F("80")} x={300} y={150} style={{ transformOrigin: "center" }}>
          <SaleTag text="-80 %" rot={5} />
        </Pop>
        <Pop fr={fr} at={F("gut", T.rabatt)} until={T.zweimal - 7} x={28} y={330}>
          <Tag kind="ink">zu gut, um wahr zu sein?</Tag>
        </Pop>
        <Pop fr={fr} at={F("vorsicht", T.rabatt)} x={700} y={104} style={{ transformOrigin: "center" }}>
          <IconWarn size={130} />
        </Pop>
        <Pop fr={fr} at={F("vorsicht", T.rabatt) + 4} x={660} y={244}>
          <Tag kind="warn" size={42}>
            Vorsicht
          </Tag>
        </Pop>
        <Pop fr={fr} at={T.zweimal} x={28} y={318}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...chip, borderRadius: 999, display: "flex", gap: 6, padding: "4px 14px" }}>
              <IconEye size={70} />
              <IconEye size={70} />
            </div>
            <Tag>2× hinschauen</Tag>
          </div>
        </Pop>
      </Szene>

      {/* Aufruf: Video speichern */}
      <Szene fr={fr} at={T.cta} until={Infinity} title="Video speichern">
        <Pop fr={fr} at={F("speichere")} x={60} y={130} style={{ transformOrigin: "center" }}>
          <IconBookmark size={220} fill={bm} />
        </Pop>
        <Pop fr={fr} at={F("nächsten", F("speichere"))} x={320} y={170} w={520}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>für deinen nächsten Online-Einkauf</div>
        </Pop>
      </Szene>

      <Captions C={C} fr={fr} />

      {sfx && (
        <>
          {[T.zeit, T.s1, T.s2, T.s3, T.cookies, T.s4, T.s5, T.rabatt, T.cta].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.8} />
          ))}
          {[F("texte"), F("bilder"), F("preise"), F("unternehmen"), F("anschrift"), F("kontaktieren"), F("datenschutzerklärung"), F("widerruf"), F("agb"), F("weee"), F("battg"), F("verpackungsregister")].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} />
          ))}
          {[F("70"), F("80"), F("speichere") + 4].map((at) => (
            <Sfx key={`p${at}`} file="pop.mp3" at={at} />
          ))}
          {[F("vorkasse"), F("krypto"), F("vorsicht", T.rabatt)].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} />
          ))}
          {[F("sauber"), F("gutes")].map((at) => (
            <Sfx key={`o${at}`} file="success.mp3" at={at} />
          ))}
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
