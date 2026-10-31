/**
 * Format HERO, Serie M "Marken-Story", M02 · PURELEI. Kalender: 📣 Di 15.12.2026 19:00; Regie (Pauls Vorgabe 30.10.: mindestens zwei
 * Videos pro Tag, neue Schnitte in die Lücken): vorgezogen auf So 01.11.2026 19:00.
 *
 * NEUER M-AUFBAU ab 31.10.2026 (Pauls Vorgabe zu diesem Video: "Ich finde in dem M02 Video verdecke ich sehr oft den Text oder
 * die Bilder mit meinem Kopf. Bitte versuche mich häufiger klein unten links oder unten mittig zu setzen oder sogar einfach nur
 * den gesamten unteren Bereich für meine Kamera und den oberen Bereich für den Content zu nutzen."; karten-aufbau.md "Marken-Story:
 * oben der Inhalt, unten er"; Baustein src/lib/buehne.tsx). Schnitt, Wortzeiten, Untertitel, Töne, Musik, Karteninhalte und
 * -zeiten, Hook-Text, Quellen-Inhalte und Länge wie in der eingeplanten Fassung; geändert ist nur der Aufbau:
 *  - Bühne oben (y 0-1000, heller ruhiger Grund): im Bildfeld (y 0-640) 17 scharfe Ausschnitte echter Seiten von purelei.com
 *    (am 31.10.2026 ohne Login neu aufgenommen, hyperframes/purelei-hg/aufnahme.cjs, zugeschnitten mit buehne.cjs, nichts
 *    abgedunkelt oder weichgezeichnet), Wechsel nach Inhalt alle ~3,5-6 s; darunter die Karten (KARTE_UNTEN, y 615-965), ohne
 *    Bild mittig (KARTE_MITTE, y 455-805: OMR-Erinnerung, Kennzahl 600.000+, 1 2 3 Learnings, Folgen-Karte). Hook-Titel auf der
 *    Bühne unter dem Hook-Bild.
 *  - Kamera unten (y 1000-1920): er über die volle Breite vor seinem weichgezeichneten Zimmer (npm run portrait -- purelei, ohne
 *    --hintergrund), Kopfoberkante ~1090, Hüfte weit unter dem Bildrand.
 *  - Pill-Untertitel an der Naht (Mitte y 1030), über seinem Kopf.
 *  - Quelle groß (drei Fenster mit dem Shopify-Beitrag aus dem Briefing, 10. Feb. 2021): die Seite über das ganze Bild, er als
 *    Bubble unten links (BUBBLE_UNTEN_LINKS), die Pille rechts daneben; Bühne und Karten blenden in dieser Zeit aus.
 * Bild: der Take kommt neu aus dem Rohclip (Drive 1nInKJyxkhdXbdVy66ihcBcPpA19CnHmQ), Intake mit derselben Zeitachse (Ton bitgleich
 * mit der eingeplanten Fassung, Wortzeiten gleich), Farbe mit denselben Werten wie vorher (npm run farbe gemessen: Kanäle
 * 0,9965/0,9982/1,0058, Gamma 1/0,962, Vibrance 0,074; zusammen mit dem Schwärzen ungenutzter Take-Teile in einem Durchgang),
 * dann npm run portrait -- purelei (nur Weichzeichnen). Im Take gemessen (113 Zeitpunkte über alle Stücke): Augen Median
 * x 565 / y 782, Kopfoberkante ~565, Kinn ~1006 (p95 1080), Hosenbund/Jeans frühestens bei Take-y ~1730. Mit scale 1,06 und
 * Kopfoberkante 1090 zeigt der untere Bildrand Take-y ~1348 (mit dem Zoom-in weniger): die Hüftlinie liegt ~380 Take-px unter dem
 * Rand (Pauls Regel 2026-10-27).
 * Karten als transparentes WebM aus hyperframes/purelei-skizzen (public/broll/purelei/skizzen.webm), Zeiten und Töne in karten.json.
 */
import type React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, HookTitle, Musik, Sfx, Takes } from "../../lib/bausteine";
import {
  Buehne,
  type BuehnenBild,
  KameraUnten,
  kameraBild,
  PILLE_NAHT,
  PILLE_NEBEN_BUBBLE,
} from "../../lib/buehne";
import { DesignRahmen } from "../../lib/design";
import { PillUntertitel } from "../../lib/pillen";
import { kartenSicht, type QuelleFenster, QuelleGross, quellePille, quelleZustand } from "../../lib/quelle-gross";
import { Raster } from "../../lib/raster";
import { createCut } from "../../lib/schnitt";
import { STIL } from "../../lib/stil";
import cut from "./cut.json";
import karten from "./karten.json";

const C = createCut(cut);
export const meta = { id: "Purelei", durationInFrames: C.DURATION, fps: C.FPS };

/** Im Take gemessen (Median über alle Stücke): Augen x 565 / y 782, Kopfoberkante ~565. scale 1,06: das Bild füllt die Breite
 * auch mit den Augen waagrecht mittig (Versatz 25 px) */
const BILD = { scale: 1.06, kopfX: 565, kopfOben: 565, augenY: 782 };

/** Sanfter Grade (Regel 5b, freigegebener Look) plus Ausgleich der Helligkeit (vorher brightness 0.89 bei Gesicht 0,634 in der
 * Vorschau); nach dem neuen Intake gemessen, siehe Übergabekarte */
const GRADE = `${STIL.gradeSanft} brightness(0.89)`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel bis nach "Community?" (4,57-5,0 s), ganz weg bei ~5,0 s; die erste Karte (Logo) kommt auf "PURELEI" (5,15 s) */
const HOOK_ENDE = fs(4.8);

/** Bühnenbilder (Sekunden im Schnitt): scharfe Ausschnitte von purelei.com, 1080 x 640, aufgenommen am 31.10.2026 ohne Login
 * (hyperframes/purelei-hg/aufnahme.cjs, zugeschnitten mit hyperframes/purelei-hg/buehne.cjs, Liste mit URL in
 * public/broll/purelei/QUELLE.txt). Jedes Bild steht über der ganzen Karte, zu der es gehört; Karten ohne Bild stehen mittig. */
const BILDER: BuehnenBild[] = [
  { von: 0, bis: 5.15, bild: "broll/purelei/b-lei.jpg", fokusY: 480 }, // Hook: Hände mit Charm-Armreif (Über die LEI)
  { von: 5.15, bis: 8.7, bild: "broll/purelei/b-sand.jpg" }, // "PURELEI ist dafür ... ein super Beispiel" (Über uns: PURELEI im Sand)
  // 8,72-14,1 Karte "Meine Erinnerung" (OMR) mittig, 13,98-17,5 Quelle Hawaii
  { von: 17.0, bis: 22.3, bild: "broll/purelei/b-hawaii.jpg" }, // "Lebensgefühl ... Onlineshop und die Marke" (Armreif mit Blüten)
  { von: 22.3, bis: 26.02, bild: "broll/purelei/b-aloha.jpg" }, // "Aloha, Lifestyle ... Look" (Über uns: "ALOHA! Schön, dass du da bist.")
  { von: 26.02, bis: 31.06, bild: "broll/purelei/b-collection.jpg" }, // "2017 ist PURELEI ... gestartet" (LEI Collection)
  { von: 31.06, bis: 35.46, bild: "broll/purelei/b-neuheiten.jpg" }, // "Schmuckbilder gepostet ... bestellt" (Startseite: Neuheiten)
  // 35,46-39,6 Quelle Influencer-Marketing
  { von: 39.3, bis: 43.03, bild: "broll/purelei/b-community.jpg" }, // "Menschen eingebunden" (Blog: Mit unserer Community kreiert)
  // 43,03-46,3 Quelle 600.000, 46,3-53,1 Kennzahl mittig
  { von: 53.46, bis: 58.6, bild: "broll/purelei/b-ketten.jpg" }, // "bei Schmuck ... Produktkategorie" (Kategorie Ketten)
  { von: 58.6, bis: 64.66, bild: "broll/purelei/b-werte.jpg" }, // "warum ... deine Marke" (Über uns: LIVE ALOHA / PURE / CONNECTED / AUTHENTIC)
  // 64,66-67,55 "1 2 3 Learnings" mittig
  { von: 67.55, bis: 72.43, bild: "broll/purelei/b-markenwelt.jpg", fokusY: 340 }, // Learning 1 Markenwelt (Ringe und Kette)
  { von: 72.43, bis: 77.16, bild: "broll/purelei/b-lookgrid.jpg" }, // "Farben, Bildsprache ... Botschaft" (Entdecke die LEI Collection)
  { von: 77.16, bis: 82.0, bild: "broll/purelei/b-goetze.jpg" }, // Learning 2 "Creator" (Festive Collection by Ann-Kathrin Götze)
  { von: 82.0, bis: 86.75, bild: "broll/purelei/b-karo.jpg" }, // "Zielgruppe ... Inhalte ... Produkt" (Adventskalender x @karokauer)
  { von: 86.75, bis: 92.5, bild: "broll/purelei/b-clubpreis.jpg" }, // Learning 3 "Menschen in den Shop holst" (Club-Preis, App)
  { von: 92.5, bis: 96.37, bild: "broll/purelei/b-club.jpg" }, // "langfristige Kundenbeziehung" (Mahina Club, Schmuck-Abo)
  { von: 96.37, bis: 100.0, bild: "broll/purelei/b-ohrringe.jpg", fokusY: 420 }, // "Produkte schön fotografierst" (Ohrringe am Ohr)
  { von: 100.0, bis: 103.65, bild: "broll/purelei/b-bedeutung.jpg" }, // "Menschen etwas ganz Bestimmtes damit verbinden" (Die Bedeutung einer Lei)
  // 103,65-Ende Folgen-Karte mittig
];

/** Quelle groß, er als Bubble unten links (Sekunden im Schnitt): der Shopify-Beitrag aus dem Briefing ("Von Hawaii nach Mannheim:
 * Wie PURELEI Social Commerce und Influencer-Marketing erfolgreich umsetzt", Caroline Dohrmann, 10. Feb. 2021), Handy-Ansicht
 * 432 css-px @2,5, nur zugeschnitten (hyperframes/purelei-hg/quelle.py), die Sätze grün markiert. fokus: die markierten Sätze auf
 * dem Schirm (alle über der Bubble, die bei y 1090 beginnt), der Rest unter hellem Schleier */
const SHOPIFY = "Shopify-Blog · 10. Feb. 2021";
const QUELLEN: QuelleFenster[] = [
  // "Denn die Gründerin hat sich nämlich zum Beispiel damals von Hawaii inspirieren lassen." → "Nachdem Alisa Maria Jahnke 2013
  // ein Auslandssemester auf Hawaii absolviert hatte, wollte die paradiesische Insel sie nicht mehr loslassen."
  { von: 13.98, bis: 17.5, bild: "broll/purelei/quelle-hawaii.jpg", y: 360, x: 20, zoom: 0.84, fokus: [[436, 582]], label: SHOPIFY },
  // "sondern sie hat tatsächlich damals früh über Instagram und auch Influencer kommuniziert" → "Wir haben von Anfang an sehr viel
  // Wert auf Influencer-Marketing gelegt, was für die Marke PURELEI tatsächlich super gut funktioniert hat."
  { von: 35.46, bis: 39.6, bild: "broll/purelei/quelle-influencer.jpg", y: 350, x: 20, zoom: 0.84, fokus: [[350, 556], [740, 888]], label: SHOPIFY },
  // "Laut einem Shopify-Beitrag hatte PURELEI 2021 bereits mehr als 600.000 Follower" → Titel, Teaser "... dem mittlerweile mehr
  // als 600.000 Menschen auf Instagram folgen." und "10. Feb. 2021"; auf 0,8 verkleinert, damit das Datum (y ~1022-1058) über der
  // Bubble steht
  { von: 43.03, bis: 46.3, bild: "broll/purelei/quelle-600k.jpg", y: 270, x: 20, zoom: 0.8, fokus: [[270, 948], [986, 1062]] },
];

/** Soundeffekte der Karten und Quellen (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

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
  // Quelle groß: 0 = Bühne oben, er unten; 1 = Quelle über das ganze Bild, er als Bubble unten links
  const q = quelleZustand(QUELLEN, fr, C.FPS);
  const sicht = kartenSicht(q.p);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0C0E" }}>
      <QuelleGross fenster={QUELLEN} fr={fr} fps={C.FPS} />

      <Buehne bilder={BILDER} fr={fr} fps={C.FPS} sicht={sicht}>
        {/* Hook-Titel (Marke PURELEI in Zeile 1, Design verlauf wie easyJet) auf der Bühne unter dem Hook-Bild (oben ~680),
            wie die Karten um x 490 zentriert */}
        <DesignRahmen design="verlauf">
          <AbsoluteFill style={{ transform: "translate(-50px, 430px) scale(0.9)", transformOrigin: "50% 0%" }}>
            <HookTitle fr={fr} line1="PURELEI" line2="VOM SCHMUCK ZUR COMMUNITY" outAt={HOOK_ENDE} />
          </AbsoluteFill>
        </DesignRahmen>

        {/* Kennzahlen, Erklär-Bilder und Folgen-Karte aus HyperFrames (hyperframes/purelei-skizzen), auf der Bühne */}
        <Sequence from={0} durationInFrames={C.DURATION} layout="none">
          <OffthreadVideo
            src={staticFile("broll/purelei/skizzen.webm")}
            transparent
            muted
            style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}
          />
        </Sequence>
      </Buehne>

      <KameraUnten p={q.p}>
        <Takes C={C} voice={voice} transform={kameraBild(BILD, zoom)} transformOrigin="0 0" grade={GRADE} />
      </KameraUnten>

      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={Math.round(t.at * C.FPS)} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE_NAHT, PILLE_NEBEN_BUBBLE)} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
