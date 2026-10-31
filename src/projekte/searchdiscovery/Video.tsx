/**
 * Format FACE (Erklärvideo), Serie S (ID "Shopify in 30 Sekunden", keine Serien-Erwähnung im Video), S08 · Search & Discovery.
 * Veröffentlichung: Regie zieht es vor auf Di 03.11.2026 14:00 (Kalender: Mi 09.12.2026 14:00).
 * Look wie S07 (src/projekte/varianten): helle Karten unter dem Kopf als Erklär-Bilder (karten-aufbau.md "Visuelle Metaphern"),
 * Pill-Untertitel (aktives Wort #00E090), Farbwelt PulseConnect-Verlauf, sanfter Grade, Porträt-Modus, ein ruhiges Zoom-in (3 %),
 * kein Punch-in, Musik ruhig.
 * Hook-Titel (Pauls Regel 30.10.: bei Erklärvideos immer, kurz und prägnant): "SEARCH & DISCOVERY" / "FILTER STATT NEUER APP" im
 * Design "verlauf" an der Kartenposition unter Kopf und Pille, darunter das originale Symbol der App Search & Discovery (Shopify App
 * Store) und das originale Shopify-Logo (Seitenkopf shopify.com) auf Schwarz; alles weg, bevor die erste Karte kommt (7,17 s).
 * Originale (Pauls Vorgabe 30.10.): echte Seiten groß über das ganze Bild, er als Bubble unten rechts (src/lib/quelle-gross.tsx),
 * aufgenommen 31.10.2026 ohne Login (hyperframes/searchdiscovery-hg/aufnahme.cjs, public/broll/searchdiscovery/QUELLE.txt): der
 * App-Eintrag im Shopify App Store, die offiziellen App-Screenshots aus diesem Eintrag (Filter, Synonymgruppe, ergänzende Produkte)
 * und das Shopify Help Center (Storefront-Suche; Filter hinzufügen: Anforderungen und Filterwerte gruppieren). Eine
 * Bildschirmaufnahme "S08 · Screen …" liegt nicht im Drive: Shop, Filter im Frontend, Suchfeld und Empfehlungen sind darum
 * gezeichnete, gekennzeichnete Beispiele/Schemata (BEISPIEL/SCHEMA), keine nachgebaute Shopify-Oberfläche.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe): sitzend, im Take an 273
 * Zeitpunkten alle 0,5 s über alle Schnittstücke gemessen (YuNet): Augen Median x 548 / y 792 (p5 745, p95 843), Kinn (Box unten)
 * Median 1007 (p95 1071), Kopfoberkante ~554; Hüftlinie (Hosenbund/Jeans unter dem Pulli, Standbilder an 76 Stellen) frühestens bei
 * Take-y ~1700 → scale 1.451, hoch 489, x 12: Kopfoberkante ~315, Augen ~660, Kinn ~972 (p95 ~1065), waagrecht mittig; der untere
 * Bildrand zeigt Take-y 1660 (mit dem Zoom-in weniger), die Hüftlinie liegt also mindestens ~40 px (Take) unter dem Rand.
 * Farbe: die gemessene Kette von `npm run farbe -- searchdiscovery --nur-ansehen` (colorchannelmixer 0.9981/0.9943/1.0081, Gamma
 * 1/1.040, Vibrance 0.078) liegt mit dem Schwärzen der ungenutzten Take-Teile und dem Höhen-EQ (Regel 0b) in einem Durchgang auf dem
 * Take (Speicher knapp); im Bild der sanfte Grade (GRADE).
 * Karten als transparentes WebM aus hyperframes/searchdiscovery-skizzen (public/broll/searchdiscovery/skizzen.webm), Zeiten und Töne
 * in karten.json.
 */
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import { DesignRahmen } from "../../lib/design";
import { PillUntertitel } from "../../lib/pillen";
import { kartenSicht, QuelleBubble, type QuelleFenster, QuelleGross, quellePille, quelleZustand } from "../../lib/quelle-gross";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";
import karten from "./karten.json";

const C = createCut(cut);
export const meta = { id: "SearchDiscovery", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 548, y 792 → im Bild x 540, y 660; Kopf ~554 → ~315; Bildunterkante = Take-y 1660 (Hüftlinie im
 * Take frühestens ~1700: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.451, hoch: 489, x: 12 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 660;

/** Sanfter Grade (Regel 5b, freigegebener Look) */
const GRADE = STIL.gradeSanft;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel "SEARCH & DISCOVERY / FILTER STATT NEUER APP" über den ersten Satz bis "Ich würde nämlich beim" (6,85 s), ganz weg
 * bei ~7,05 s; die erste Karte kommt auf "Shopify-Shop" (7,17 s) */
const HOOK_ENDE = fs(6.85);
const LOGO_AN = fs(0.3);

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus hyperframes/searchdiscovery-hg/screenshots: Handy-Ansicht
 * 412 css-px @2,62 bzw. die offiziellen App-Screenshots 1600 x 900 aus dem App-Store-Eintrag, nur zugeschnitten; die Sätze der
 * Hilfe-Seiten grün markiert). fokus: die markierten Sätze bzw. Zeilen auf dem Schirm, der Rest unter hellem Schleier */
const QUELLEN: QuelleFenster[] = [
  // "Schau dir erst einmal hier Search & Discovery an." → App-Eintrag (Symbol und Name), auf "Vermutlich kennst du die App schon."
  // kommt die Zeile mit Preisgestaltung und Entwickler dazu (stößt an: nur der Schleier wechselt)
  { von: 12.02, bis: 14.45, bild: "broll/searchdiscovery/quelle-app.jpg", y: 330, x: 0, zoom: 1, fokus: [[540, 700]] },
  { von: 14.45, bis: 15.8, bild: "broll/searchdiscovery/quelle-app.jpg", y: 330, x: 0, zoom: 1, fokus: [[540, 700], [750, 875]] },
  // "Die App von Shopify kann nämlich ziemlich viel." → Help Center "Storefront-Suche": Filter, Produkte hervorheben, Empfehlungen
  { von: 15.8, bis: 18.27, bild: "broll/searchdiscovery/quelle-funktionen.jpg", y: 340, x: 20, zoom: 0.84, fokus: [[382, 566], [572, 670], [780, 920]], label: "Shopify Help Center · Storefront-Suche" },
  // "Mit passenden Filtern kann er tatsächlich genau die richtige Auswahl treffen," → App-Screenshot "Add Filters": Product options Color, Size
  { von: 30.95, bis: 34.36, bild: "broll/searchdiscovery/quelle-filter.jpg", y: 360, x: 0, zoom: 1, fokus: [[440, 525], [680, 760]], label: "Shopify App Store · Screenshot Filter" },
  // "In Search & Discovery in der App kannst du aber solche Unterschiede tatsächlich mit Filterwerten" → Help Center "Filterwerte
  // gruppieren" (Shopifys eigenes Beispiel: Onyx, Ebony und Midnight unter "Schwarz")
  { von: 51.95, bis: 55.4, bild: "broll/searchdiscovery/quelle-gruppieren.jpg", y: 330, x: 0, zoom: 1, fokus: [[460, 786]], label: "Shopify Help Center · Filter hinzufügen" },
  // "können tatsächlich passende Suchsynonyme durchaus helfen." → App-Screenshot "Create synonym group"
  { von: 72.34, bis: 75.0, bild: "broll/searchdiscovery/quelle-synonyme.jpg", y: 360, x: 0, zoom: 1, fokus: [[372, 446], [852, 928]], label: "Shopify App Store · Screenshot Synonyme" },
  // "Und bei Produktempfehlungen würde ich einfach nicht wahllos" → App-Screenshot "Add complementary products" (stößt an das Fenster
  // davor: er bleibt klein)
  { von: 75.0, bis: 77.47, bild: "broll/searchdiscovery/quelle-empfehlungen.jpg", y: 360, x: 0, zoom: 1, fokus: [[355, 425], [580, 850]], label: "Shopify App Store · Screenshot Empfehlungen" },
  // "Ganz wichtig hier zu erwähnen ist tatsächlich, dass die Filter wirklich zu deinem Theme" → Help Center "Anforderungen": "Wenn dein
  // Theme keine Filter unterstützt, [...] sie werden deinen Kund:innen aber nicht angezeigt."
  { von: 112.61, bis: 116.09, bild: "broll/searchdiscovery/quelle-theme.jpg", y: 330, x: 20, zoom: 0.84, fokus: [[735, 920]], label: "Shopify Help Center · Filter hinzufügen" },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1130) */
const PILLE = { x: 490, y: 1080 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

/** Die Originale unter dem Hook-Titel: Symbol der App Search & Discovery (Shopify App Store) und Shopify-Logo (Seitenkopf
 * shopify.com, weiß auf Schwarz wie dort), beides unverändert */
const Originale: React.FC<{ fr: number }> = ({ fr }) => {
  const an = interpolate(fr, [LOGO_AN, LOGO_AN + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const aus = interpolate(fr, [HOOK_ENDE, HOOK_ENDE + 6], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const o = Math.min(an, aus);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 490 - 200,
        top: 1352,
        width: 400,
        height: 92,
        borderRadius: 24,
        background: "#000000",
        boxShadow: "0 14px 36px rgb(0 0 0 / 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        opacity: o,
        transform: `translateY(${(1 - an) * 10}px) scale(${0.96 + 0.04 * an})`,
      }}
    >
      <Img src={staticFile("broll/searchdiscovery/app-icon.png")} style={{ height: 62, width: 62, borderRadius: 14 }} />
      <Img src={staticFile("broll/searchdiscovery/shopify-logo.svg")} style={{ height: 58, width: "auto" }} />
    </div>
  );
};

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "ruhig.mp3" }) => {
  const fr = useCurrentFrame();
  // ruhiges Zoom-in über das ganze Video (3 %), kein Punch-in
  const push = interpolate(fr, [0, 90], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const zoom = 1 + 0.03 * (0.45 * push + 0.55 * (fr / C.DURATION));
  // Quelle groß: 0 = normal, 1 = Quelle über das ganze Bild, er als Bubble unten rechts
  const q = quelleZustand(QUELLEN, fr, C.FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <QuelleGross fenster={QUELLEN} fr={fr} fps={C.FPS} />
      <QuelleBubble p={q.p}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `540px ${AUGEN_Y}px` }}>
          <Takes
            C={C}
            voice={voice}
            transform={`translate(${-BILD.x}px, ${-BILD.hoch}px) scale(${BILD.scale})`}
            transformOrigin="50% 0%"
            grade={GRADE}
          />
        </AbsoluteFill>
      </QuelleBubble>

      {/* Hook-Titel (Pauls Regel 30.10.: Erklärvideos immer, kurz und prägnant; Design verlauf wie easyJet), an der Kartenposition
          unter Kopf und Pille (oben ~1130), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab
          x 900) ragt; darunter die Originale (App-Symbol und Shopify-Logo) */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 878px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="SEARCH & DISCOVERY" line2="FILTER STATT NEUER APP" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>
      <Originale fr={fr} />

      {/* Erklär-Bilder aus HyperFrames (hyperframes/searchdiscovery-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/searchdiscovery/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: kartenSicht(q.p) }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={Math.round(t.at * C.FPS)} volume={t.volume} />)}

      {/* max 3 Wörter je Phrase: sonst hängt die Pille ein langes Einzelwort an die nächste Phrase ("Produktempfehlungen würde ich
          einfach") und wird neben der Bubble (Breite 436) zu klein */}
      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" max={3} />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
