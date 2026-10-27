/**
 * Format FACE, Serie S (ID "Shopify in 30 Sekunden", Inhalt laut Briefing bewusst substanzieller), S04 · Shopify Flow.
 * Veröffentlichung laut Kalender Mi 11.11.2026 14:00.
 * Aktueller Look wie S02 (src/projekte/metafelder) und S03 (src/projekte/kollektionen): helle Karten unter dem Kopf mit
 * Pill-Untertiteln (karten-aufbau.md), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26): komplizierte
 * KI-Automatisierung gegen eine regelmäßige Aufgabe, Beispiel-Bestellung über 300 € mit interner Nachricht ans Team, die drei
 * Bausteine Auslöser → Bedingung → Aktion als Kette, die Aktion schickt die interne E-Mail ans Team, Zahnräder = Shopify Flow
 * (Wenn-Dann-Baukasten), Vorlagen gegen "von null", Schalter "Workflow aktivieren" mit Fragezeichen, Testen → Prüfen →
 * Aktivieren mit Demo-Testbestellung, drei riskante Abläufe, KI entwirft den Workflow und die Lupe zeigt die Aktion, Treppe
 * "erst klein, dann weiter", Folgen-Plus; höchstens 1-3 Wörter, ein handschriftliches Akzentwort. Beispielwerte als BEISPIEL
 * bzw. DEMO gekennzeichnet.
 * Hook-Titel (Marke Shopify im ersten Satz, darum mit Hook; Design "verlauf", easyJet-Stil): "SHOPIFY FLOW" / "KLEIN
 * ANFANGEN, SICHER TESTEN", an der Kartenposition unter dem Kopf, bis vor die erste Karte (3,6 s). Keine Reihen-Einblendung
 * (Briefing: "Shopify in 30 Sekunden" ist nur die Serien-ID), keine Folgennummer.
 * Bild (Pauls Vorgabe 25.10.: Kopf höher, Untertitel und Karten darunter): scale 1.38, hoch 687, x 69 (Take: Haar Median
 * y 726 mit der Porträt-Maske, Augen Median x 590 / y 885, über alle Schnittstücke gemessen) → Kopfoberkante ~315, Augen
 * ~534, mittig; unten endet das Bild bei Take y ~1889 (kein Rand). Sanfter Grade, ein ruhiges Zoom-in (3 %) um die Augen,
 * kein Punch-in. Von oben: Gesicht, Kinn (~790), Pill-Untertitel (y 895), Karte (ab y 950, bis 1310), alles über der
 * Instagram-Zone (ab y 1500).
 * Marken-Hintergründe (karten-aufbau.md, "Marken-Shops als Hintergrund"): an 14 Stellen steht er freigestellt vor echten
 * Seiten des Shopify Help Center zu Shopify Flow (HG unten, in den Take gerechnet von npm run portrait --ausschnitt
 * 1.38,687,69 --hintergrund …); Hook und der Tipp mit Aufruf am Schluss vor seinem weichgezeichneten Zimmer.
 * Karten als transparentes WebM aus hyperframes/shopifyflow-skizzen (public/broll/shopifyflow/skizzen.webm), Zeiten und Töne
 * in karten.json.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { PillUntertitel } from "../../lib/pillen";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";
import karten from "./karten.json";

const C = createCut(cut);
export const meta = { id: "ShopifyFlow", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 590, y 885 → im Bild x 540, y 534; Haar ~726 → 315; Bildunterkante = Take y 1889 */
const BILD = { scale: 1.38, hoch: 687, x: 69 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 534;

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/shopifyflow/) */
export const HG: [string, number, number][] = [
  ["hg-aufgaben", 12.1, 16.9], // "Ich würde hier erst einmal eine Aufgabe nehmen …" ("Erste Schritte": mühsame und repetitive Aufgaben)
  ["hg-beispiel", 37.1, 43.4], // "… intern … Nachricht bekommen, wenn … Bestellung über 300 Euro …" ("Workflows für Bestellungen": dein Team benachrichtigen)
  ["hg-drei", 74.9, 77.85], // "… nur drei Dinge." ("Erste Schritte": 3 Arten von Schritten, Trigger, Bedingungen, Aktionen)
  ["hg-trigger", 77.85, 81.05], // "Einmal den Auslöser, zum Beispiel eine Bestellung wird erstellt." (Trigger "Bestellung erstellt")
  ["hg-bedingung", 87.3, 92.6], // "Dann als zweites … die Bedingung …" ("Bedingungen in Shopify Flow verstehen")
  ["hg-aktion", 92.6, 99.95], // "… die Aktion … verschickt also intern Benachrichtigungen an dein Team." ("Aktionen verstehen": E-Mail an dein Team)
  ["hg-flow", 102.65, 107.6], // "… aus solchen Auslösern, Bedingungen oder Aktionen besteht … Shopify Flow." ("Shopify Flow": Auslöser, Bedingungen und Aktionen)
  ["hg-vorlage", 108.4, 116.15], // "… mit fertigen Workflow-Vorlagen starten …" ("Einen Workflow mithilfe einer Vorlage erstellen")
  ["hg-testen", 116.9, 123.8], // "… nicht nur einfach aktivieren …" ("Einen Workflow in Shopify Flow testen": testen, bevor du ihn aktivierst)
  ["hg-testbestellung", 187.3, 194.85], // "… mit einer Testbestellung starten und prüfen …" ("Ereignisse aufzeichnen": selbst eine echte Bestellung erstellen)
  ["hg-aktionen", 237.25, 241.5], // "… Bestellungen verändern, Zahlungsinformationen betreffen …" ("Aktionen in Shopify Flow": Änderungen im Shop, HTTP-Anfragen)
  ["hg-plan", 241.5, 247.0], // "… Kundendaten an andere Dienste schicken …" ("Plananforderung": HTTP-Anfrage senden nur Grow, Advanced, Plus)
  ["hg-ki", 247.0, 250.75], // "KI kann dir … helfen, diesen Workflow … zu planen." ("Einen Workflow mit Sidekick generieren")
  ["hg-ki-pruefen", 265.8, 271.85], // "Trotzdem … genauestens zu verstehen …" ("Du solltest den generierten Workflow gründlich überprüfen und testen")
];

/** Sanfter Grade plus 5 % dunkler: die Aufnahme ist etwas hell (Gesicht im Take ~0,578, mit dem sanften Grade im fertigen
 *  Video sonst ~0,59 statt ~0,55-0,57, seine Vorgabe 2026-10-18 "zu hell"; npm run farbe hebt höchstens ±4 %). Wie bei S03
 *  (Take 0,579, brightness 0,95 → 0,563) im Grade ausgeglichen. */
const GRADE = `brightness(0.95) ${STIL.gradeSanft}`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis kurz vor "KI-Automatisierung" (3,67 s), ganz weg bei ~3,5 s; die erste Karte kommt bei 3,6 s */
const HOOK_ENDE = fs(3.3);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 950) */
const PILLE = { x: 490, y: 895 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %), kein Punch-in
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px ${AUGEN_Y}px` }}>
        <Takes
          C={C}
          voice={voice}
          transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
          transformOrigin="50% 0%"
          grade={GRADE}
        />
      </AbsoluteFill>

      {/* Hook-Titel (Marke Shopify), easyJet-Stil, an der Kartenposition unter dem Kopf (oben ~950), wie Karte und Pille um
          x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 698px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SHOPIFY FLOW" line2="KLEIN ANFANGEN, SICHER TESTEN" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/shopifyflow-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/shopifyflow/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} x={PILLE.x} y={PILLE.y} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
