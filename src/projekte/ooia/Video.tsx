/**
 * Format HERO, Serie M "Marken-Story", M09 · ooia. Kalender: 📣 Di 29.12.2026 19:00; Regie (Pauls Vorgabe 30.10.: mindestens zwei
 * Videos pro Tag, neue Schnitte in die Lücken): vorgezogen auf Mo 02.11.2026 19:00.
 * Look wie M02 PURELEI (src/projekte/purelei) mit Pauls neueren Regeln: er steht oben (Kopfoberkante ~320, Vorgabe 25.10.),
 * Pill-Untertitel (aktives Wort #00E090) und helle Karten darunter; Marken-Shops als Hintergrund (karten-aufbau.md, 25.10.): an
 * elf Stellen steht er freigestellt vor echten, sachlichen Seiten von ooia.de und dem Hilfe-Center (HG unten, in den Take
 * gerechnet von npm run portrait -- ooia --ausschnitt 1.45,500,59 --hintergrund …), dazwischen vor seinem weichgezeichneten
 * Zimmer. Sensibles Produkt (Briefing): keine Körperbilder, keine Gesundheits- oder Wirkversprechen.
 * Quelle groß, er klein in der Ecke (Regel 28.10.): zwei Fenster mit dem Shopify-Beitrag aus dem Briefing (2. Juli 2019).
 * Erklär-Bilder, Checkliste der drei Tipps ("10 Fragen" / "Antwort am Kaufpunkt" / "Fakten prüfen"), KI-FAQ-Grafik mit Hinweis
 * auf fachliche Prüfung, am Ende die große mittige Folgen-Karte mit dem TikTok-Plus, getippt auf "Plus". Das originale
 * ooia-Logo (Seitenkopf ooia.de, unverändert) kommt auf "ooia" (6,4 s) in der Karte.
 * Hook-Titel (Markenname, karten-hell.md): "OOIA" / "AUFKLÄRUNG ALS MARKENSTRATEGIE", Design "verlauf", an der Kartenposition
 * unter dem Gesicht, weg vor der ersten Karte.
 * Bild (Pauls Regeln 25.10. Kopf oben, 27.10. ab Hüfthöhe): sitzend wie bei PURELEI; im Take an 109 Zeitpunkten (alle 2 s)
 * gemessen: Augen Median x 581 / y 790, Kinn (Gesichtsbox unten) Median 1021 (p95 1089), Gesicht oben Median 627; Hosenbund/
 * Jeans frühestens bei Take-y ~1780 → scale 1.45, hoch 500, x 59: Kopfoberkante ~320, Augen ~646, Kinn ~980, waagrecht mittig;
 * der untere Bildrand zeigt Take-y 1669 (mit dem Zoom-in weniger), die Hüftlinie liegt also mindestens ~110 Take-px (~160 px im
 * Bild) unter dem Rand. Von oben: Gesicht, Kinn, Pille (y 1088), Karte (y 1140-1490), Instagram-Zone ab 1500.
 * Farbe: npm run farbe gemessen (Kanäle 0,9976/0,9955/1,0075, Gamma 1/0,962, Vibrance 0,08) und in einem Durchgang mit dem
 * Schwärzen ungenutzter Take-Teile auf den Take gelegt; im Bild der sanfte Grade.
 * Karten als transparentes WebM aus hyperframes/ooia-skizzen (public/broll/ooia/skizzen.webm), Zeiten und Töne in karten.json.
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
export const meta = { id: "Ooia", durationInFrames: C.DURATION, fps: C.FPS };

/** Augen im Take (Median) bei x 581, y 790 → im Bild x 540, y 646; Kopf ~565 → ~320; Bildunterkante = Take-y 1669 (Hüftlinie im
 * Take frühestens ~1780: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.45, hoch: 500, x: 59 };
/** Augenhöhe im Bild: Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 646;

/** Sanfter Grade (Regel 5b, freigegebener Look) plus brightness(0.89): in der Vorschau lag das Gesicht nach Farbe und Porträt
 * bei 0,627 (gemessen wie npm run pruefen, 24 Zeitpunkte); wie bei M02 PURELEI (0,634 → brightness 0.89) im Grade ausgeglichen,
 * Ziel ~0,56 */
const GRADE = `${STIL.gradeSanft} brightness(0.89)`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "E-Commerce-Marke?" (4,95-5,6 s), ganz weg bei ~6,1 s; die erste Karte (Logo) kommt auf "ooia" (6,30 s) */
const HOOK_ENDE = fs(5.9);

/** Marken-Hintergründe im Take (Sekunden), wie beim Aufruf von npm run portrait --hintergrund (public/broll/ooia/), alle am
 * 31.10.2026 ohne Login aufgenommen (QUELLE.txt); Wechsel in Sprechpausen, an Schnitten oder in einem Quellen-Fenster */
export const HG: [string, number, number][] = [
  ["hg-produkte", 1.605, 8.055], // Hook: Startseite, Kategorien PERIODE / EVERYDAY / BRA / MOMS (Produktbilder ohne Körper)
  ["hg-leine", 8.055, 11.795], // "ooia hat ... mit den Periodenunterwäschen gemacht." (Pflege: ooias an der Wäscheleine, nur Produkte)
  ["hg-hilfe", 25.595, 30.995], // ab dem Ausgang der Quelle: "Kundinnen haben ... sehr viele Fragen." (Hilfe-Center)
  ["hg-faq", 30.995, 37.495], // die vier Fragen (Ratgeber: "Häufig gestellte Fragen")
  ["hg-kauf", 37.495, 41.795], // "... des Markenauftritts, nicht nur Verkauf," (Produktseite: Farbe, Größe, In den Warenkorb)
  ["hg-magazin", 41.795, 49.595], // "sondern eben auch Erklärungen und vor allem die Aufklärung." und Quelle 2 (ooia Cycle Magazin)
  ["hg-pflege", 49.595, 51.925], // "Informationen zugänglich gemacht," (Pflegehinweise)
  ["hg-pflege", 54.925, 57.965], // "die Menschen vor einer Kaufentscheidung brauchen." (Pflegehinweise)
  ["hg-hilfe2", 72.235, 80.055], // Tipp 1: Support, Kommentare, Retourengründe (Hilfe-Center: Reklamation/Retouren, FAQs, Kontakt)
  ["hg-kauf", 84.855, 91.485], // Tipp 2: "Auf Produktseiten, in Größentabellen, ... FAQs." (Produktseite mit "Größentabelle")
  ["hg-produkte", 172.615, 178.045], // "das wichtigste Learning ... aus dem Onlineshop von ooia" (Startseite, Kategorien)
  ["hg-mission", 181.685, 187.985], // "dass Aufklärung ... Teil deiner Markenstrategie" (Mission & Werte: "Dafür steht ooia")
];

/** Quelle groß, er als Bubble (Sekunden im Schnitt): der Shopify-Beitrag aus dem Briefing ("Tabus überwinden: Wie zwei Gründerinnen
 * den deutschen Damenhygiene-Markt auf den Kopf stellen", Inara Muradowa, 2. Juli 2019), Handy-Ansicht 432 css-px @2,5, nur
 * zugeschnitten (hyperframes/ooia-hg/quelle.py), die Sätze grün markiert; bei der zweiten Quelle zwei Ausschnitte derselben Seite
 * untereinander (dünne Linie = ausgelassene Stelle). Breite 0,84 bzw. 0,80 × 1080 ab x 20, damit der Text links der TikTok-Leiste (ab x 900) bleibt und
 * über der Bubble (ab y 1010) endet. fokus: die markierten Sätze auf dem Schirm, der Rest unter hellem Schleier */
const SHOPIFY = "Shopify-Blog · 2. Juli 2019";
const QUELLEN: QuelleFenster[] = [
  // "haben tatsächlich verstanden, dass sie nicht einfach nur ein neues Produkt online stellen können." → Kati im Interview: "Dazu
  // kommt, dass es sich bei uns um ein Produkt handelt, das erklärt werden muss und das in Deutschland tabu-behaftet ist."
  { von: 12.5, bis: 16.6, bild: "broll/ooia/quelle-erklaeren.jpg", y: 345, x: 20, zoom: 0.84, fokus: [[345, 392], [748, 892]], label: SHOPIFY },
  // "ooia hat nämlich dabei über Social Media einfach Gespräche angestoßen" → Frage zur Aufklärungsarbeit, "Wir haben eine sehr
  // ausführliche FAQ-Sektion auf unserer Webseite." | "Außerdem betreiben wir einen interaktiven Instagram-Channel, auf dem wir über
  // das Produkt und über uns in regelmäßigen Live-Sessions berichten. Wir bekommen unglaublich viele Fragen"
  { von: 36.05, bis: 39.95, bild: "broll/ooia/quelle-aufklaerung.jpg", y: 350, x: 20, zoom: 0.8, fokus: [[350, 742], [765, 993]], label: SHOPIFY },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1140) */
const PILLE = { x: 490, y: 1088 };

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

      {/* Hook-Titel (Marke ooia in Zeile 1, Design verlauf wie easyJet), an der Kartenposition unter Kopf und Pille (oben
          ~1140), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 888px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="OOIA" line2="AUFKLÄRUNG ALS MARKENSTRATEGIE" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder, Checkliste, KI-FAQ und Folgen-Karte aus HyperFrames (hyperframes/ooia-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/ooia/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: kartenSicht(q.p) }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={Math.round(t.at * C.FPS)} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
