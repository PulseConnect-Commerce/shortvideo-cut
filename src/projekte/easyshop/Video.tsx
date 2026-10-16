/**
 * Format NEWS/Reaction, Teil 2 zum easyJet/easyShop-Video: "easyShop im Händlercheck – Lohnt sich die
 * Amazon-Alternative für Händler?" (Cutter-Briefing im Kalender, 16.10.2026; Veröffentlichung 17.10. 10:00).
 * Look wie das Zoll-Video (Editorial-Untertitel oben, Hook im alten Titel-Stil, leichter Porträt-Modus, Wechsel
 * weit/eng bei jedem Schnitt, leise Klicks nur auf Einblendungen, keine Musik).
 * Infinity-Loop (Briefing): Paul hat den Schluss-Satz "Und genau deshalb stelle ich mir die Frage:" am Anfang des
 * Takes direkt vor die Eingangsfrage gesprochen; der Schnitt setzt ihn ans Ende, das Video beginnt direkt mit
 * "easyShop will eine Alternative zu Amazon sein, aber lohnt sich das überhaupt für Händler?". Weil beide Sätze im
 * Take direkt hintereinander stehen, geht das Ende nahtlos in den Anfang über (kein Ausklang, kein Outro).
 * Fakten laut OnCommerce-Preisliste (oncommerce.com/gb/pricing, abgerufen 16.10.2026): Standard £25 p/m;
 * Verkaufsgebühr 7 % oder 15 % je Kategorie, auf den Gesamtpreis inkl. Versand; dazu Mindest-, Erstattungs- und
 * Streitfallgebühren. Shopify steht auf oncommerce.com/gb/sell unter den Integrationen (kein eigener Test).
 */
import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { EditorialUntertitel } from "../../lib/editorial";
import { autoPunch } from "../../lib/kit";
import { Raster } from "../../lib/raster";
import { SchlichterText } from "../../lib/schlicht";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";

const C = createCut(cut);
export const meta = { id: "Easyshop", durationInFrames: C.DURATION, fps: C.FPS };
const F = C.cue;

/** Bildlage wie beim Zoll-Video: Augen bei y ~740, Kopf ab ~430 */
const BILD = { scale: 1.3, hoch: 274, x: 65 };
const HOOK_TIEFER = 130;
const ERSTER_SCHNITT = C.SPANS[1]?.at ?? C.DURATION;
const HOOK_ENDE = C.WE("händler") + 6;

const ONC = F("oncommerce");
const ONC_ENDE = F("interessant") - 4;
const SHOPIFY = F("shopify-integration");
const SHOPIFY_ENDE = F("aber", SHOPIFY) - 4;
const ABO = F("25");
const PROV = F("15");
const KOSTEN_ENDE = F("das", F("dazukommen")) - 4;

const BETONT = ["amazon", "händler", "oncommerce", "marktplätze", "shopify-integration", "kosten", "25", "28", "15", "gebühren", "kostenloser", "kunden", "bestellungen", "frage"];
const FARBIG = ["25", "15"];
const PUNCH = autoPunch(C, { low: 1, high: 1.08 });
const punchAt = (fr: number) => PUNCH.reduce((z, [at, v]) => (fr >= at ? v : z), 1);

const ANTON: React.CSSProperties = { fontFamily: "Anton, sans-serif", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.01em" };

type Props = { voice?: boolean; raster?: boolean; untertitel?: boolean };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, raster = false, untertitel = true }) => {
  const fr = useCurrentFrame();
  const karte = interpolate(fr, [ONC, ONC + 5, ONC_ENDE, ONC_ENDE + 5], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${punchAt(fr)})`, transformOrigin: "540px 740px" }}>
        <Takes C={C} voice={voice} transform={`translate(${-BILD.x}px, ${-(BILD.hoch - (fr < ERSTER_SCHNITT ? HOOK_TIEFER : 0))}px) scale(${BILD.scale})`} transformOrigin="50% 0%" />
      </AbsoluteFill>

      {/* Hook im alten Titel-Stil, mit "Teil 2" als Rückbezug auf das erste easyShop-Video */}
      <DesignRahmen design="nacht-gruen">
        <AbsoluteFill style={{ transform: "translateY(40px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="easyShop für Händler:" line2="Lohnt sich das?" outAt={HOOK_ENDE - 4} />
        </AbsoluteFill>
      </DesignRahmen>

      <SchlichterText fr={fr} at={0} until={HOOK_ENDE - 4} top={528} size={40} style={{ ...ANTON, color: "#00F090" }}>
        Teil 2
      </SchlichterText>

      {/* Händleranbindung über OnCommerce: Ausschnitt der offiziellen Händlerseite */}
      {karte > 0 && (
        <>
          <Img
            src={staticFile("broll/easyshop/oncommerce.png")}
            style={{ position: "absolute", left: 170, top: 1040, width: 720, borderRadius: 18, boxShadow: "0 14px 34px rgb(0 0 0 / 0.4)", opacity: karte }}
          />
          <SchlichterText fr={fr} at={ONC + 8} until={ONC_ENDE} top={1340} size={46} style={ANTON}>
            Händleranbindung: OnCommerce
          </SchlichterText>
        </>
      )}

      <SchlichterText fr={fr} at={SHOPIFY} until={SHOPIFY_ENDE} top={1120} size={52} style={ANTON}>
        Shopify-Integration genannt
      </SchlichterText>

      {/* Konditionen laut Preisliste */}
      <SchlichterText fr={fr} at={ABO} until={KOSTEN_ENDE} top={1085} size={54} style={ANTON}>
        Standard-Abo: £25 / Monat
      </SchlichterText>
      <SchlichterText fr={fr} at={PROV} until={KOSTEN_ENDE} top={1160} size={54} style={ANTON}>
        Verkaufsgebühr: meist 15 %
      </SchlichterText>
      <SchlichterText fr={fr} at={PROV + 12} until={KOSTEN_ENDE} top={1236} size={34} weight={600}>
        auf den Produktpreis inkl. Versand
      </SchlichterText>
      <SchlichterText fr={fr} at={ABO} until={KOSTEN_ENDE} top={1330} size={28} weight={500} style={{ opacity: 0.85 }}>
        Quelle: OnCommerce-Preisliste, Stand 16.10.2026
      </SchlichterText>

      {untertitel && <EditorialUntertitel C={C} fr={fr} betont={BETONT} farbig={FARBIG} y={330} off={[[0, HOOK_ENDE + 4]]} />}

      <Sfx file="klick.mp3" at={ONC} volume={STIL.sfx * 0.35} />
      <Sfx file="klick.mp3" at={SHOPIFY} volume={STIL.sfx * 0.3} />
      <Sfx file="klick.mp3" at={ABO} volume={STIL.sfx * 0.3} />
      <Sfx file="klick.mp3" at={PROV} volume={STIL.sfx * 0.3} />
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
