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
 * Quelle groß, er klein in der Ecke (Pauls Regel 2026-10-28, karten-aufbau.md, src/lib/quelle-gross.tsx): an zwei Stellen
 * steht die echte Quelle scharf über das ganze Bild, er läuft als Bubble unten rechts weiter, die Pille links daneben
 * (QUELLEN unten): 9,5-14,75 s OnlinehändlerNews (Überschrift mit Datum, "Seit dem 22. Oktober 2026 …", "Jedes Angebot
 * braucht künftig mindestens ein Foto …"; statt der Quellen-Karte q1) und 30,97-33,45 s Etsy-Hilfe "KI-generierte
 * Funktionsanleitungen …" (statt q2). Die acht Quellen-Hintergründe hinter ihm sind aus dem Take genommen (npm run portrait
 * neu, ohne --hintergrund), sonst verdeckte sein Kopf dort den Text; dort steht er vor seinem weichgezeichneten Zimmer, die
 * Erklär-Karten bleiben. Karten als transparentes WebM aus hyperframes/etsyki-skizzen
 * (public/broll/etsyki/skizzen.webm), Zeiten und Töne in karten.json.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
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
export const meta = { id: "EtsyKi", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 569, y 909 → im Bild x 540, y 658; Kopf Median 694 → 309; Bildunterkante = Take y 1688
 * (Hüftlinie im Take frühestens 1722: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.62, hoch: 815, x: 47 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 658;

/** Hintergründe im Take: seit 2026-10-28 keine mehr (alle acht waren Quellen mit Lesetext; Porträt neu ohne
 * --hintergrund). Die Quellen stehen jetzt groß (QUELLEN). */
export const HG: [string, number, number][] = [];

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus hyperframes/etsyki-hg/screenshots, nur zugeschnitten,
 * das Artikelbild von OnlinehändlerNews nie im Bild). Aneinanderstoßende Fenster: er bleibt klein, nur die Seite wechselt. */
const QUELLEN: QuelleFenster[] = [
  // "Schaut euch mal diese Meldung hier an.": Überschrift "Etsy-Shop unter Druck: Neue KI-Regeln zwingen zum Foto-Marathon", 26.10.2026
  { von: 9.5, bis: 11.45, bild: "broll/etsyki/quelle-ohn-kopf.jpg", y: 60, fokus: [[385, 830]] },
  // "Seit dem 22. Oktober": markiert "Seit dem 22. Oktober 2026 gelten neue Regeln für Produktfotos, …"
  { von: 11.45, bis: 12.95, bild: "broll/etsyki/quelle-ohn-seit.jpg", y: 320, fokus: [[350, 797]],
    label: "OnlinehändlerNews · 26.10.2026" },
  // "verlangt Etsy bei vielen Angeboten mindestens ein echtes …": "1. Pflicht", markiert "Jedes Angebot braucht künftig …"
  { von: 12.95, bis: 14.75, bild: "broll/etsyki/quelle-ohn-pflicht.jpg", y: 230, fokus: [[340, 1000]],
    label: "OnlinehändlerNews · 26.10.2026" },
  // "Was aber außerdem neu ist, KI-generierte …": Etsy-Hilfe, markiert "KI-generierte Funktionsanleitungen, …"
  { von: 30.97, bis: 33.45, bild: "broll/etsyki/quelle-etsy-ki.jpg", y: 108, fokus: [[345, 797]],
    label: "Etsy-Hilfe · Was kann ich auf Etsy verkaufen?" },
];

/** Sanfter Grade (STIL.gradeSanft); Helligkeit am Gesicht nach den ersten Standbildern prüfen (Regie: über 0,57 ausgleichen) */
const GRADE = STIL.gradeSanft;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis zum Ende des ersten Satzes ("Grenzen." endet bei 5,36 s), ganz weg bei 5,6 s; die erste Karte kommt bei 5,96 s */
const HOOK_ENDE = fs(5.4);

/** Erklär-Karten aus (Sekunden im Schnitt): im WebM laufen hier noch die alten Quellen-Karten q1/q2 (ersetzt durch QUELLEN);
 * beim Ein- bzw. Ausgang der Fenster schienen sie sonst 3-4 Frames halb durch (Standbilder 28.10.). Danach beginnt k1 genau
 * am Ende von q1 (14,72 s); k4 (ab 32,92 s) läuft im zweiten Fenster schon und blendet beim Ausgang ein. */
const KARTEN_AUS: [number, number][] = [
  [9.5, 14.72],
  [30.97, 32.92],
];

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json). Der whoosh von k4 (32,92 s) läge mitten im zweiten
 * Quellen-Fenster, wo sich im Bild nichts ändert: er kommt auf den Ausgang des Fensters, wenn er zurückwächst und k4
 * einblendet (33,27 s). */
const TOENE = karten.karten.flatMap((k) => k.sfx).map((t) => (t.at === 32.92 ? { ...t, at: 33.27 } : t));

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
  // Quelle groß: 0 = normal, 1 = Quelle über das ganze Bild, er als Bubble unten rechts
  const q = quelleZustand(QUELLEN, fr, C.FPS);
  const karteO = KARTEN_AUS.some(([a, b]) => fr >= fs(a) && fr < fs(b)) ? 0 : kartenSicht(q.p);
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
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: karteO }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={t.at * C.FPS} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
