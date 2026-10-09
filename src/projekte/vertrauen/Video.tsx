/**
 * Format HERO (Skill stil-hero). "5 Dinge, die Vertrauen in deinen Onlineshop schaffen" (für Shopbetreiber).
 * Talking Head im Vollbild, fester Ausschnitt ohne Hose (1,17 ab der Oberkante), ein durchgehendes langsames Zoom-in
 * und vier kleine Akzente, Hook-Satz oben, und über dem Kopf pro Thema eine Bildkarte mit Foto (src/lib/broll.tsx),
 * deren Teile auf ihrem Wort erscheinen.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Captions, clamp, HookTitle, type HookStil, Sfx, SplitPerson, Takes } from "../../lib/bausteine";
import {
  chip,
  IconBattery,
  IconBin,
  IconBookmark,
  IconBox,
  IconBrowser,
  IconBuilding,
  IconCard,
  IconDoc,
  IconImage,
  IconMail,
  IconPin,
  IconPlug,
  IconStopwatch,
  IconText,
  IconWarn,
  Pop,
  Row,
  SaleTag,
  Szene,
  Tag,
} from "../../lib/broll";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Vertrauen", durationInFrames: C.DURATION, fps: C.FPS };

/** fester Bildausschnitt: die Jeans beginnt in beiden Takes frühestens bei y 1704, das Bild endet so bei ~1640 */
const CROP = 1.17;

/* Zeitpunkte: jede Szene und jedes Element auf seinem Wort */
const F = C.cue;
const T = (() => {
  const intro = F("deshalb");
  const s1 = F("erstens");
  const s2 = F("zweitens");
  const s3 = F("drittens");
  const cookies = F("und", C.W("passen"));
  const s4 = F("viertens");
  const s5 = F("fünftens");
  const rabatt = F("und", C.W("hinterlegen"));
  const cta = F("und", C.W("gegenteil"));
  return { intro, s1, s2, s3, cookies, s4, s5, rabatt, cta };
})();

/** ein durchgehendes, langsames Zoom-in über das ganze Video (100 % → 110 %), ohne Sprünge an den Schnitten */
const zoomAt = (fr: number) => 1 + 0.1 * interpolate(fr, [0, C.DURATION], [0, 1], clamp);

/** wenige kleine Akzente an den wichtigsten Stellen: [von, bis] in Frames, sanft auf AKZENT heran (8 Frames), halten
 * bis zum Ende der Phrase, sanft zurück (10 Frames). Anker 50 % 42 % (zwischen Augen und Kinn). */
const AKZENT = 1.08;
const AKZENTE: [number, number][] = [
  [F("dann"), C.WE("nicht", F("trotzdem")) + 4],
  [F("ob", T.s1), C.WE("nicht", F("seriös")) + 4],
  [F("eindeutig"), C.WE("vertrauen", F("eindeutig")) + 4],
  [F("sondern"), C.WE("gegenteil") + 4],
];
const akzentAt = (fr: number) =>
  AKZENTE.reduce(
    (z, [a, b]) => Math.max(z, interpolate(fr, [a, a + 8, b, b + 10], [1, AKZENT, AKZENT, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })),
    1,
  );

/** raster: Platzierungsraster mit sicherer Fläche und den Zonen von TikTok/Instagram (nur für Standbilder) */
/** hookStil: einer aus HOOK_STILE (src/lib/bausteine.tsx); hook1/hook2: andere Hook-Zeilen. Zum Vergleichen als Standbild */
export const Video: React.FC<{ voice?: boolean; sfx?: boolean; raster?: boolean; hookStil?: HookStil; hook1?: string; hook2?: string }> = ({
  voice = true,
  sfx = true,
  raster = false,
  hookStil = "kontur",
  hook1 = "Bester Onlineshop der Welt?",
  hook2 = "Ohne Vertrauen kauft keiner.",
}) => {
  const fr = useCurrentFrame();
  const bm = interpolate(fr, [F("speichere") + 4, F("speichere") + 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: STIL.paper }}>
      <AbsoluteFill style={{ transform: `scale(${akzentAt(fr)})`, transformOrigin: "50% 42%" }}>
        <SplitPerson split={0} zoom={zoomAt(fr)}>
          <Takes C={C} voice={voice} transform={`scale(${CROP})`} transformOrigin="50% 0%" />
        </SplitPerson>
      </AbsoluteFill>

      <HookTitle fr={fr} line1={hook1} line2={hook2} outAt={T.intro - 8} stil={hookStil} />

      {/* 5 Dinge, die ich überprüfen würde */}
      <Szene fr={fr} at={T.intro} until={T.s1 - 2} title="5 Dinge für mehr Vertrauen" photo="broll/vertrauen/vertrauen.jpg">
        <Pop fr={fr} at={F("fünf")} x={24} y={130}>
          <div style={{ ...chip, display: "inline-flex", alignItems: "center", gap: 16, padding: "8px 28px 8px 14px" }}>
            <div style={{ fontSize: 96, fontWeight: 900, color: STIL.yellow, lineHeight: 1 }}>5</div>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.03em" }}>Checks</div>
          </div>
        </Pop>
        <Pop fr={fr} at={F("überprüfen")} x={24} y={276}>
          <Tag kind="ok">für deinen Shop</Tag>
        </Pop>
      </Szene>

      {/* 1: der erste Eindruck */}
      <Szene fr={fr} at={T.s1} until={T.s2 - 2} nr={1} title="Der erste Eindruck" photo="broll/vertrauen/eindruck.jpg">
        <Pop fr={fr} at={F("produktbilder")} x={24} y={118}>
          <Row icon={<IconImage />} text="Produktbilder" mark="ok" width={460} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("texte")} x={24} y={210}>
          <Row icon={<IconText />} text="Texte" mark="ok" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("design")} x={24} y={302}>
          <Row icon={<IconBrowser />} text="einheitliches Design" mark="ok" width={560} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("fehler")} until={F("kürzester") - 8} x={560} y={126}>
          <Tag kind="warn" size={44}>
            keine Fehler
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("kürzester")} x={560} y={118}>
          <div style={{ ...chip, display: "inline-flex", alignItems: "center", gap: 12, padding: "6px 22px 6px 10px" }}>
            <IconStopwatch size={64} turn={interpolate(fr, [F("kürzester"), F("kürzester") + 30], [0, 0.4], clamp)} />
            <div style={{ fontSize: 44, fontWeight: 800 }}>Sekunden</div>
          </div>
        </Pop>
        <Pop fr={fr} at={F("seriös")} x={600} y={222}>
          <Tag>seriös?</Tag>
        </Pop>
      </Szene>

      {/* 2: Unternehmen nicht verstecken */}
      <Szene fr={fr} at={T.s2} until={T.s3 - 2} nr={2} title="Zeig dein Unternehmen" photo="broll/vertrauen/impressum.jpg">
        <Pop fr={fr} at={F("impressum")} x={24} y={118}>
          <Row icon={<IconDoc />} text="Impressum" mark="ok" width={420} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("anschrift")} x={24} y={210}>
          <Row icon={<IconPin />} text="echte Anschrift" mark="ok" width={530} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("kontaktmöglichkeit")} x={24} y={302}>
          <Row icon={<IconMail />} text="Kontakt" mark="ok" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("kontaktformular")} until={F("vertrauen", T.s2) - 8} x={372} y={310}>
          <Tag size={40}>Kontaktformular</Tag>
        </Pop>
        <Pop fr={fr} at={F("vertrauen", T.s2)} x={372} y={310}>
          <Tag kind="ok" size={42}>schafft Vertrauen</Tag>
        </Pop>
      </Szene>

      {/* 3: rechtliche Seiten */}
      <Szene fr={fr} at={T.s3} until={T.cookies - 2} nr={3} title="Rechtliche Seiten" photo="broll/vertrauen/recht.jpg">
        <Pop fr={fr} at={F("datenschutzerklärungen")} x={24} y={122}>
          <Row text="Datenschutz" mark="ok" width={400} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("widerrufsinformationen")} x={430} y={122}>
          <Row text="Widerruf" mark="ok" width={340} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("agbs")} x={24} y={226}>
          <Row text="AGB" mark="ok" width={250} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("passen")} x={24} y={322}>
          <Tag kind="ok">passend zu deinem Shop</Tag>
        </Pop>
      </Szene>

      {/* 3: Tracking und Cookie-Einwilligung */}
      <Szene fr={fr} at={T.cookies} until={T.s4 - 2} nr={3} title="Tracking & Cookies" photo="broll/shopcheck/cookies.jpg">
        <Pop fr={fr} at={F("einwilligungspflichtiges")} x={300} y={118}>
          <div style={{ ...chip, display: "inline-block", padding: "10px 24px", fontSize: 50, fontWeight: 800 }}>Einwilligung?</div>
        </Pop>
        <Pop fr={fr} at={F("cookie-einwilligung")} x={300} y={212}>
          <div style={{ display: "flex", gap: 18 }}>
            {["Akzeptieren", "Ablehnen"].map((t) => (
              <div key={t} style={{ ...chip, padding: "14px 26px", borderRadius: 14, border: `4px solid ${STIL.ink}`, fontSize: 42, fontWeight: 700 }}>
                {t}
              </div>
            ))}
          </div>
        </Pop>
        <Pop fr={fr} at={F("sauberer")} x={300} y={318}>
          <Tag kind="ok" size={40}>sauberer Cookie-Banner</Tag>
        </Pop>
      </Szene>

      {/* 4: Zahlungsmethoden, denen Kunden vertrauen */}
      <Szene fr={fr} at={T.s4} until={T.s5 - 2} nr={4} title="Zahlungsmethoden" photo="broll/vertrauen/zahlung.jpg">
        <Pop fr={fr} at={F("vertrauen", T.s4)} x={24} y={126}>
          <Tag kind="ok">Vertrauen</Tag>
        </Pop>
        <Pop fr={fr} at={F("unbekannter")} until={F("wichtiger") - 8} x={24} y={226}>
          <Tag kind="ink" size={44}>
            unbekannte Marke?
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("wichtiger")} x={24} y={226}>
          <Tag size={44}>umso wichtiger</Tag>
        </Pop>
        <Pop fr={fr} at={F("paypal")} x={520} y={118}>
          <Row icon={<IconCard />} text="PayPal" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("klarna")} x={520} y={210}>
          <Row icon={<IconCard />} text="Klarna" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("kreditkarten")} x={520} y={302}>
          <Row icon={<IconCard />} text="Kreditkarte" width={330} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("checkout")} x={24} y={322}>
          <Tag kind="ok">beim Checkout</Tag>
        </Pop>
      </Szene>

      {/* 5: Pflichten hinter dem Shop */}
      <Szene fr={fr} at={T.s5} until={T.rabatt - 2} nr={5} title="Pflichten hinter dem Shop" photo="broll/vertrauen/pflichten.jpg">
        <Pop fr={fr} at={F("vergiss")} until={F("elektronik") - 8} x={24} y={126}>
          <Tag kind="warn" size={44}>
            nicht vergessen
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("elektronik")} x={24} y={118}>
          <Row icon={<IconPlug />} text="Elektronik" width={360} onPhoto />
        </Pop>
        <Pop fr={fr} at={F("deutschland")} until={F("impressum", T.s5) - 8} x={480} y={126}>
          <Tag kind="ink" size={44}>
            Versand nach DE
          </Tag>
        </Pop>
        <Pop fr={fr} at={F("impressum", T.s5)} x={480} y={126}>
          <Tag kind="ok" size={44}>
            ins Impressum
          </Tag>
        </Pop>
        {(
          [
            ["weee", <IconBin key="b" size={76} />, "WEEE"],
            ["batterievorgaben", <IconBattery key="a" size={76} />, "Batterie"],
            ["lucid", <IconBox key="v" size={76} />, "LUCID-ID"],
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

      {/* noch ein Punkt: künstliche Rabatte */}
      <Szene fr={fr} at={T.rabatt} until={T.cta - 2} title="Künstliche Rabatte?" titleAt={F("künstlichen")} photo="broll/vertrauen/rabatt.jpg">
        <Pop fr={fr} at={F("übertreib")} until={F("gegenteil") - 8} x={28} y={322}>
          <Tag kind="ink">übertreib es nicht</Tag>
        </Pop>
        <Pop fr={fr} at={F("70")} x={36} y={130} style={{ transformOrigin: "center" }}>
          <SaleTag text="-70 %" rot={-6} />
        </Pop>
        <Pop fr={fr} at={F("70") + 6} x={300} y={150} style={{ transformOrigin: "center" }}>
          <SaleTag text="-80 %" rot={5} />
        </Pop>
        <Pop fr={fr} at={F("unbedingt")} x={700} y={104} style={{ transformOrigin: "center" }}>
          <IconWarn size={130} />
        </Pop>
        <Pop fr={fr} at={F("gegenteil")} x={28} y={322}>
          <Tag kind="warn">genau das Gegenteil</Tag>
        </Pop>
      </Szene>

      {/* Aufruf: Video speichern und die 5 Punkte im eigenen Shop prüfen */}
      <Szene fr={fr} at={T.cta} until={Infinity} title="Video speichern">
        <Pop fr={fr} at={F("speichere")} x={60} y={130} style={{ transformOrigin: "center" }}>
          <IconBookmark size={220} fill={bm} />
        </Pop>
        <Pop fr={fr} at={F("punkte", T.cta)} x={320} y={170} w={520}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}>5 Punkte im eigenen Shop prüfen</div>
        </Pop>
      </Szene>

      <Captions C={C} fr={fr} />

      {sfx && (
        <>
          {[T.intro, T.s1, T.s2, T.s3, T.cookies, T.s4, T.s5, T.rabatt, T.cta].map((at) => (
            <Sfx key={`w${at}`} file="whoosh.mp3" at={at} volume={STIL.sfx * 0.8} />
          ))}
          {[F("produktbilder"), F("texte"), F("design"), F("impressum"), F("anschrift"), F("kontaktmöglichkeit"), F("datenschutzerklärungen"), F("widerrufsinformationen"), F("agbs"), F("paypal"), F("klarna"), F("kreditkarten"), F("weee"), F("batterievorgaben"), F("lucid")].map((at) => (
            <Sfx key={`t${at}`} file="tick.mp3" at={at} />
          ))}
          {[F("fünf"), F("70"), F("70") + 6, F("speichere") + 4].map((at) => (
            <Sfx key={`p${at}`} file="pop.mp3" at={at} />
          ))}
          {[F("fehler"), F("unbedingt")].map((at) => (
            <Sfx key={`s${at}`} file="stamp.mp3" at={at} />
          ))}
          {[F("vertrauen", T.s2), F("sauberer"), F("checkout")].map((at) => (
            <Sfx key={`o${at}`} file="success.mp3" at={at} />
          ))}
        </>
      )}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
