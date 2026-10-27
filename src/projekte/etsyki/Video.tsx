/**
 * Format NEWS, N08 · Etsy: Neue KI-Regeln. Veröffentlichung laut Briefing noch ohne Datum (News, bald; die Regie plant ein).
 * Look wie N07 (src/projekte/temuwarenkorb) und N09 (src/projekte/ebaykombi): helle Karten unter dem Kopf mit Pill-Untertiteln
 * (karten-aufbau.md, aktives Wort #00E090), Erklär-Bilder statt Wortkarten (freigegeben 2026-10-26, Vorlage P04): Shop mit alten
 * Produktbildern, echte Quellen OnlinehändlerNews/Händlerbund (26.10.2026) und Etsy-Hilfe (help.etsy.com, abgerufen 27.10.2026;
 * das Etsy Seller Handbook sperrt automatisierte Browser und wurde nicht umgangen), "1 ECHTES, UNBEARBEITETES FOTO", weitere
 * Bilder dürfen bearbeitet sein, "AUSNAHMEN JE NACH PRODUKT", "KI-ANLEITUNGEN: NICHT ERLAUBT", "BOT-LISTINGS: NICHT ERLAUBT",
 * "AUCH ALTE LISTINGS PRÜFEN", seine Einschätzung (Vertrauen, echte Handarbeit), Tipp (Bilder und Anleitungen prüfen), Umfrage
 * "Listings schon geprüft?" mit Folgen-Plus (keine Folgennummer). Nirgends "verboten" im Bild (Briefing).
 * Hook-Titel laut Regie (Marke Etsy, News; Design "verlauf", easyJet-Stil): "ETSY:" / "NEUE KI-REGELN!", an der Kartenposition
 * unter dem Kopf, bis zum Ende des ersten Satzes.
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe, nichts darunter): scale 1.62,
 * hoch 815, x 47 (Take: Kopfoberkante (Kappe) Median y 694 (652-710) mit der Porträt-Maske, Augen Median x 569 / y 909, Mund
 * höchstens y 1096, Kinn ~1095, Hüftlinie (oberste Jeans-Zeile) frühestens y 1722, Median 1744, an 136 Zeitpunkten alle 0,5 s über
 * alle Schnittstücke gemessen) → Kopfoberkante ~309, Augen ~658, Kinn ~959, mittig; der untere Bildrand zeigt Take-y 1688 (mit dem
 * Zoom-in bis ~1665), also liegt die Hüftlinie mindestens 34 px unter dem Bildrand. Sanfter Grade, ein ruhiges Zoom-in (3 %) um
 * die Augen, kein Punch-in. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1068), Karte (y 1118-1468/1496), alles über der
 * Instagram-Zone (ab y 1500).
 * Hintergründe (karten-aufbau.md "Marken-Shops als Hintergrund", stil-news "Quelle als Hintergrund"; Regie: beide Quellen als
 * Quellen-Karte und als Hintergrund): an acht Stellen steht er freigestellt vor den echten Seiten (drei OnlinehändlerNews, fünf
 * Etsy-Hilfe; HG unten, in den Take gerechnet von npm run portrait --ausschnitt 1.62,815,47 --hintergrund …). Hook, Einschätzung,
 * Tipp und Aufruf vor seinem weichgezeichneten Zimmer. Karten als transparentes WebM aus hyperframes/etsyki-skizzen
 * (public/broll/etsyki/skizzen.webm), Zeiten und Töne in karten.json.
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
export const meta = { id: "EtsyKi", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 569, y 909 → im Bild x 540, y 658; Kopf Median 694 → 309; Bildunterkante = Take y 1688
 * (Hüftlinie im Take frühestens 1722: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.62, hoch: 815, x: 47 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 658;

/** Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/etsyki/). Jedes Bild reicht
 * mindestens 0,25 s über das Ende seines Schnittstücks (J-Cut: das Bild läuft 3 Frames länger als der Ton) */
export const HG: [string, number, number][] = [
  ["hg-ohn-intro", 23.75, 27.95], // "Und wenn du jetzt dort verkaufst, …" (OHN: "Wer auf Etsy verkauft, muss seine Listings prüfen – auch die bestehenden.")
  ["hg-ohn-kopf", 30.45, 34.1], // "Schaut euch mal diese Meldung hier an. Seit dem 22. Oktober" (OHN: Überschrift, 26.10.2026)
  ["hg-etsy-foto", 34.1, 40.45], // "verlangt Etsy bei vielen Angeboten mindestens ein echtes …" (Etsy-Hilfe: "Etsy schreibt für die meisten Artikel mindestens ein unbearbeitetes Foto vor.")
  ["hg-etsy-weitere", 44.4, 53.35], // "Das heißt jetzt aber natürlich nicht, … Weitere Bilder dürfen …" (Etsy-Hilfe: "Für weitere Bilder kannst du Bildbearbeitungsprogramme nutzen, auch solche mit KI, …")
  ["hg-etsy-ausnahmen", 53.35, 56.9], // "Und für manche Produkte gibt es tatsächlich sogar auch Ausnahmen." (Etsy-Hilfe: "Die Anforderungen können je nachdem, was du verkaufst, unterschiedlich sein:")
  ["hg-etsy-anleitungen", 58.65, 64.45], // "Was aber außerdem neu ist, KI-generierte Anleitungen, …" (Etsy-Hilfe: "KI-generierte Funktionsanleitungen, wie zum Beispiel Bastelvorlagen, Rezepte und Anleitungen")
  ["hg-etsy-bots", 64.45, 69.75], // "Und komplett automatisch erstellte Angebote ohne menschliche Beteiligung …" (Etsy-Hilfe: "Von Bots erstellte Inhalte")
  ["hg-ohn-bestehende", 81.75, 86.95], // "Und das betrifft aber leider nicht nur die neuen Listings, …" (OHN: "Die neuen Regeln gelten nicht nur für neue Angebote. …")
];

/** Sanfter Grade (STIL.gradeSanft); Helligkeit am Gesicht nach den ersten Standbildern prüfen (Regie: über 0,57 ausgleichen) */
const GRADE = STIL.gradeSanft;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis zum Ende des ersten Satzes ("Grenzen." endet bei 5,36 s), ganz weg bei 5,6 s; die erste Karte kommt bei 5,96 s */
const HOOK_ENDE = fs(5.4);

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1118) */
const PILLE = { x: 490, y: 1068 };

type Props = { voice?: boolean; sfx?: boolean; raster?: boolean; untertitel?: boolean; musik?: string | false };

export const Video: React.FC<Props> = (p) => (
  <DesignRahmen design="pulse">
    <Inhalt {...p} />
  </DesignRahmen>
);

const Inhalt: React.FC<Props> = ({ voice = true, sfx = true, raster = false, untertitel = true, musik = "news.mp3" }) => {
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

      {/* Hook-Titel (Regie: "ETSY: NEUE KI-REGELN!", Marke in Zeile 1, Design verlauf), an der Kartenposition unter dem Kopf
          (oben ~1118), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 866px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="ETSY:" line2="NEUE KI-REGELN!" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder und Quellen-Karten aus HyperFrames (hyperframes/etsyki-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/etsyki/skizzen.webm")}
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
