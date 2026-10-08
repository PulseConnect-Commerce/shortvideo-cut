/**
 * "5 Dinge, bevor du bei einem unbekannten Onlineshop bestellst". Talking Head im Vollbild, fester Ausschnitt ohne
 * Hose (1,17 ab der Oberkante), langsame Zoom-ins pro Bildstück (abwechselnd 1 und 1,045, so wirken die Jump-Cuts wie
 * Kamerawechsel), Hook-Satz oben, und über dem Kopf pro Thema eine Bildkarte (B-Roll, broll.tsx), deren Teile auf
 * ihrem Wort erscheinen.
 */
import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import { Raster } from "../../lib/raster";
import { createCut, typedSync } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import {
  between,
  IconBattery,
  IconBin,
  IconBookmark,
  IconBox,
  IconBuilding,
  IconCard,
  IconCash,
  IconCoin,
  IconCookie,
  IconDoc,
  IconEye,
  IconImage,
  IconMail,
  IconPin,
  IconPlug,
  IconPrice,
  IconSearch,
  IconShield,
  IconStopwatch,
  IconText,
  IconWarn,
  Pop,
  Row,
  SaleTag,
  SearchBar,
  ShopMock,
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

/** leichte Zoom-ins: in jedem Bildstück fährt das Bild langsam um 3 % heran, die Stufe wechselt an jedem Schnitt */
const zoomAt = (fr: number) => {
  const i = C.SPANS.findIndex((s) => fr >= s.at && fr < s.at + s.len);
  const k = i < 0 ? C.SPANS.length - 1 : i;
  const s = C.SPANS[k];
  return (k % 2 ? 1.045 : 1) + interpolate(fr, [s.at, s.at + s.len], [0, 0.03], clamp);
};

/** raster: Platzierungsraster mit sicherer Fläche und den Zonen von TikTok/Instagram (nur für Standbilder) */
export const Video: React.FC<{ voice?: boolean; sfx?: boolean; raster?: boolean }> = ({ voice = true, sfx = true, raster = false }) => {
  const fr = useCurrentFrame();
  const googeln = typedSync(C.spoken("Firma + Adresse", C.W("firma")), fr);
  const bm = interpolate(fr, [F("speichere") + 4, F("speichere") + 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: STIL.paper }}>
      <SplitPerson split={0} zoom={zoomAt(fr)}>
        <Takes C={C} voice={voice} transform={`scale(${CROP})`} transformOrigin="50% 0%" />
      </SplitPerson>

      <HookTitle fr={fr} line1="Bevor du im Onlineshop bestellst:" line2="Check diese 5 Dinge." outAt={T.zeit - 8} />

      {/* 2 Minuten, viel Ärger gespart */}
      <Szene fr={fr} at={T.zeit} until={T.s1 - 2} title="5 Checks vor dem Kauf">
        <Pop fr={fr} at={F("zwei")} x={50} y={130}>
          <IconStopwatch size={200} turn={interpolate(fr, [F("zwei"), F("zwei") + 40], [0, 0.85], clamp)} />
        </Pop>
        <Pop fr={fr} at={F("zwei")} x={290} y={150}>
          <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: "-0.03em" }}>max. 2 Minuten</div>
        </Pop>
        <Pop fr={fr} at={F("ärger")} x={290} y={270}>
          <Tag kind="ok">spart viel Ärger</Tag>
        </Pop>
      </Szene>

      {/* 1: der Shop als Ganzes */}
      <Szene fr={fr} at={T.s1} until={T.s2 - 2} nr={1} title="Der Shop als Ganzes">
        <ShopMock
          x={34}
          y={122}
          w={470}
          h={280}
          wonky={interpolate(fr, [F("schnell"), F("schnell") + 10], [0, 1], clamp)}
          hi={fr >= F("preise") ? "preis" : fr >= F("bilder") ? "bild" : fr >= F("texte") ? "text" : null}
        />
        <Pop fr={fr} at={F("professionell")} until={F("passen")} x={110} y={235}>
          <Tag>professionell?</Tag>
        </Pop>
        <Pop fr={fr} at={F("schnell")} x={70} y={312}>
          <Tag kind="warn" size={44}>
            zusammengebaut?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("texte")} x={530} y={128}>
          <Row icon={<IconText />} text="Texte" mark="ok" width={330} />
        </Pop>
        <Pop fr={fr} at={F("bilder")} x={530} y={222}>
          <Row icon={<IconImage />} text="Bilder" mark="ok" width={330} />
        </Pop>
        <Pop fr={fr} at={F("preise")} x={530} y={316}>
          <Row icon={<IconPrice />} text="Preise" mark="ok" width={330} />
        </Pop>
      </Szene>

      {/* 2: Impressum, im Zweifel googeln */}
      <Szene fr={fr} at={T.s2} until={T.s3 - 2} nr={2} title="Ins Impressum schauen">
        <div style={{ opacity: 1 - interpolate(fr, [F("zweifel"), F("zweifel") + 6], [0, 1], clamp) }}>
          <Pop fr={fr} at={F("unternehmen")} x={40} y={128}>
            <Row icon={<IconBuilding />} text="Unternehmen" mark="ok" width={600} />
          </Pop>
          <Pop fr={fr} at={F("anschrift")} x={40} y={222}>
            <Row icon={<IconPin />} text="Anschrift" mark="ok" width={600} />
          </Pop>
          <Pop fr={fr} at={F("kontaktieren")} x={40} y={316}>
            <Row icon={<IconMail />} text="Kontakt" mark="ok" width={600} />
          </Pop>
          <Pop fr={fr} at={T.s2} x={680} y={140}>
            <IconDoc size={180} />
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
      <Szene fr={fr} at={T.s3} until={T.cookies - 2} nr={3} title="Rechtliche Seiten">
        <Pop fr={fr} at={F("datenschutzerklärung")} x={40} y={135}>
          <Row text="Datenschutz" mark="ok" width={400} />
        </Pop>
        <Pop fr={fr} at={F("widerruf")} x={490} y={135}>
          <Row text="Widerruf" mark="ok" width={340} />
        </Pop>
        <Pop fr={fr} at={F("widerrufs-button")} x={40} y={262}>
          <div
            style={{
              display: "inline-block",
              padding: "18px 34px",
              borderRadius: 18,
              background: STIL.yellow,
              fontSize: 46,
              fontWeight: 800,
              boxShadow: "0 8px 20px rgb(20 22 26 / 0.18)",
              transform: `scale(${1 - 0.06 * between(fr, F("widerrufs-button") + 10, F("widerrufs-button") + 14, 3)})`,
            }}
          >
            Widerrufs-Button
          </div>
        </Pop>
        <Pop fr={fr} at={F("agb")} x={600} y={268}>
          <Row text="AGB" mark="ok" width={250} />
        </Pop>
      </Szene>

      {/* 3: Tracking, Cookies, Einwilligung */}
      <Szene fr={fr} at={T.cookies} until={T.s4 - 2} nr={3} title="Tracking & Cookies">
        <Pop fr={fr} at={F("cookies")} x={50} y={140}>
          <IconCookie size={200} />
        </Pop>
        <Pop fr={fr} at={F("einwilligung")} x={290} y={140}>
          <div style={{ fontSize: 50, fontWeight: 800 }}>Einwilligung?</div>
        </Pop>
        <Pop fr={fr} at={F("einwilligung") + 6} x={290} y={220}>
          <div style={{ display: "flex", gap: 18 }}>
            {["Akzeptieren", "Ablehnen"].map((t) => (
              <div key={t} style={{ padding: "14px 26px", borderRadius: 14, border: `4px solid ${STIL.ink}`, fontSize: 42, fontWeight: 700 }}>
                {t}
              </div>
            ))}
          </div>
        </Pop>
        <Pop fr={fr} at={F("sauber")} x={290} y={318}>
          <Tag kind="ok">sauber umgesetzt</Tag>
        </Pop>
      </Szene>

      {/* 4: Zahlungsmethoden */}
      <Szene fr={fr} at={T.s4} until={T.s5 - 2} nr={4} title="Zahlungsmethoden">
        <Pop fr={fr} at={F("vorkasse")} x={40} y={130}>
          <Row icon={<IconCash />} text="Vorkasse" mark="no" width={400} />
        </Pop>
        <Pop fr={fr} at={F("krypto")} x={40} y={224}>
          <Row icon={<IconCoin />} text="Krypto" mark="no" width={400} />
        </Pop>
        <Pop fr={fr} at={F("vorsicht")} x={40} y={322}>
          <Tag kind="warn">Vorsicht!</Tag>
        </Pop>
        <Pop fr={fr} at={F("etablierte")} x={480} y={130}>
          <Row icon={<IconCard />} text="etabliert" width={380} />
        </Pop>
        <Pop fr={fr} at={F("käuferschutz")} x={480} y={224}>
          <Row icon={<IconShield />} text="Käuferschutz" width={380} />
        </Pop>
        <Pop fr={fr} at={F("gutes")} x={480} y={322}>
          <Tag kind="ok">gutes Zeichen</Tag>
        </Pop>
      </Szene>

      {/* 5: Realitätscheck */}
      <Szene fr={fr} at={T.s5} until={T.rabatt - 2} nr={5} title="Realitätscheck">
        <Pop fr={fr} at={F("elektrogeräte")} x={40} y={130}>
          <Row icon={<IconPlug />} text="Elektrogeräte" width={400} />
        </Pop>
        <Pop fr={fr} at={F("gesetzliche")} x={470} y={138}>
          <Tag kind="ink" size={44}>
            Pflichten
          </Tag>
        </Pop>
        {(
          [
            ["weee", <IconBin key="b" size={84} />, "WEEE-Nr."],
            ["battg", <IconBattery key="a" size={84} />, "BattG"],
            ["verpackungsregister", <IconBox key="v" size={84} />, "Verpackung"],
          ] as const
        ).map(([w, icon, label], i) => (
          <Pop key={w} fr={fr} at={F(w)} x={40 + i * 280} y={238} w={250} style={{ transformOrigin: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {icon}
              <div style={{ fontSize: 44, fontWeight: 800, whiteSpace: "nowrap" }}>{label}</div>
            </div>
          </Pop>
        ))}
      </Szene>

      {/* vor allem: 70 oder 80 % reduziert, zu gut um wahr zu sein, zweimal hinschauen */}
      <Szene fr={fr} at={T.rabatt} until={T.cta - 2} title="Fast alles reduziert?" titleAt={F("fast", T.rabatt)}>
        <Pop fr={fr} at={F("70")} x={36} y={140} style={{ transformOrigin: "center" }}>
          <SaleTag text="-70 %" rot={-6} />
        </Pop>
        <Pop fr={fr} at={F("80")} x={300} y={160} style={{ transformOrigin: "center" }}>
          <SaleTag text="-80 %" rot={5} />
        </Pop>
        <Pop fr={fr} at={F("gut", T.rabatt)} until={T.zweimal} x={40} y={330}>
          <Tag kind="ink">zu gut, um wahr zu sein?</Tag>
        </Pop>
        <Pop fr={fr} at={F("vorsicht", T.rabatt)} x={700} y={112} style={{ transformOrigin: "center" }}>
          <IconWarn size={130} />
        </Pop>
        <Pop fr={fr} at={F("vorsicht", T.rabatt) + 4} x={660} y={250}>
          <Tag kind="warn" size={42}>
            Vorsicht
          </Tag>
        </Pop>
        <Pop fr={fr} at={T.zweimal} x={40} y={322}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <IconEye size={80} />
            <IconEye size={80} />
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
