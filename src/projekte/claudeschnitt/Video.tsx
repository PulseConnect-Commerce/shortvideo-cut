/**
 * Format HERO, Reihe K "KI allgemein", K02 · Videos schneiden mit Claude Code (Opus 5.5). Veröffentlichung laut Briefing
 * Sa 31.10.2026 19:00 (Folgevideo zu K01, src/projekte/claudetools).
 * Look wie K01: helle Karten unter dem Kopf als Erklär-Bilder (karten-aufbau.md "Visuelle Metaphern"), Pill-Untertitel
 * (aktives Wort #00E090), Farbwelt PulseConnect-Verlauf #00D088 → #31ADEC, sanfter Grade, ein ruhiges Zoom-in (3 %), kein
 * Punch-in.
 * Herzstück nach Pauls Wunsch (30.10.): der Prompt tippt sich auf seinen Wörtern in ein stilisiertes Eingabefenster
 * ("Illustration"), danach Spracherkennung / Schnitt-Werkzeuge / Untertitel & Grafiken mit Haken, die Onboarding-Fragen
 * (Marke, Farben, Beispiel-Videos, Stil) als Chat-Karten mit Auswahl-Chips → "Dein Schnittprofil" → "gespeichert als Skills",
 * dann der Alltag (Handy → Drive-Ordner "Rohclips" → Termin braun → grün → Startsignal → Checkliste → Metricool).
 * Hook-Titel (Pauls Regel 30.10.: kurz und prägnant): "KEINE ZEIT" / "ZUM SCHNEIDEN?" im Design "verlauf" an der
 * Kartenposition unter dem Kopf, bis "das Schneiden" (7,7 s); dort kommt die erste Karte.
 * Ende: Kommentar-Karte „Schnitt“ (169,6 s) und die große Folgen-Karte mit TikTok-Plus (Tippen auf "Follow", 172,2 s).
 * Bild (Pauls Vorgaben 25.10.: Kopf höher, Untertitel und Karten darunter; 27.10.: erst ab Hüfthöhe): sitzend, im Take an 94
 * Zeitpunkten gemessen (alle 2 s über alle Schnittstücke, YuNet-Kopfkasten mit Haar und Kinn): Kopfmitte x Median 578 (p5 402
 * im Profil, p95 663), Kopfkasten oben Median 467 (Haaransatz ~530), unten Median 1091 (p95 1164); Hüftlinie (Hosenbund unter
 * dem Pulli, Standbilder an 13 Stellen) frühestens bei Take-y ~1770 → scale 1.35, hoch 400, x 50: Kopfoberkante ~y 300-330,
 * Augen ~626, Kinn ~950 (Profil bis ~1040); der untere Bildrand zeigt Take-y 1719 (mit dem Zoom-in weniger), die Hüftlinie
 * liegt also mindestens ~50 px (Take) unter dem Rand. Von oben: Gesicht, Kinn, Pill-Untertitel (y 1072), Karte
 * (y 1120-1470), alles über der Instagram-Zone (ab y 1500).
 * Originale (Pauls Vorgabe 30.10. abends: "originale Logos und originale Screenshotaufnahmen von Claude verwenden. Es muss dabei
 * nicht in das CI und die Farben passen"): "Quelle groß, er klein in der Ecke" (src/lib/quelle-gross.tsx) mit echten, öffentlichen
 * Seiten (Playwright ohne Login, 30.10.2026, hyperframes/claudeschnitt-hg/QUELLE.txt): claude.com/product/claude-code (Kopf mit
 * Claude-Logo) auf "Ich mache das einfach mit Claude Code", anthropic.com/claude-opus-5-5 auf "dem Modell Opus 5.5", und das
 * Terminal-Bild derselben Seite auf "du öffnest Claude Code …": dort tippt sich der Beispiel-Prompt in die Eingabezeile des
 * echten Bilds (eingefügt, darum klein als "Beispiel-Prompt · Illustration" markiert). In den Karten das echte Claude-Zeichen
 * (claude.com/icon.svg). Für Pauls eigene Onboarding-Screenshots sind die Fenster in ONBOARDING_SCREENS vorbereitet.
 * Farbe: die gemessene Kette von `npm run farbe -- claudeschnitt --nur-ansehen` (colorchannelmixer 0.9984/0.9957/1.0064,
 * Gamma 1/0.962, Vibrance 0.08) liegt in einem Durchgang mit dem Schwärzen der ungenutzten Take-Teile auf dem Take (Speicher
 * knapp); im Bild der sanfte Grade mit brightness (Gesicht-Ziel 0,55-0,57).
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
export const meta = { id: "ClaudeSchnitt", durationInFrames: C.DURATION, fps: C.FPS };

/** Haaransatz im Take ~530 → im Bild ~315; Kopfmitte (Median x 578) → x 540; Bildunterkante = Take-y 1719 (Hüftlinie im
 * Take frühestens ~1770: alles darunter bleibt draußen, Pauls Regel 2026-10-27) */
const BILD = { scale: 1.35, hoch: 400, x: 50 };
/** Augenhöhe im Bild (Take ~760): Ursprung für das Zoom-in, damit die Augen beim Zoomen auf derselben Höhe bleiben */
const AUGEN_Y = 626;

/** Sanfter Grade (Regel 5b, freigegebener Look) plus brightness wie K01 (gleicher Raum, gleiches Licht; K01 lag ohne bei
 * 0,624, Ziel 0,55-0,57) */
const GRADE = `brightness(0.9) ${STIL.gradeSanft}`;

const fs = (s: number) => Math.round(s * C.FPS);
/** Hook-Titel "KEINE ZEIT / ZUM SCHNEIDEN?" bis "das Schneiden" (7,73 s), ganz weg bei ~7,65 s; die erste Karte kommt auf
 * "Schneiden" (7,66 s) */
const HOOK_ENDE = fs(7.45);

/** Während der Prompt sich in die Eingabezeile tippt (57,5-61,4 s), zeigt das Bild seine Worte: dort keine Pille */
const OHNE_PILLE: [number, number][] = [[fs(57.46), fs(61.42)]];

/** Terminal-Bild von claude.com/product/claude-code: so liegt es auf dem Schirm (Oberkante bei y -790, "Welcome to Claude Code!" unter der Quellenzeile), die Eingabezeile
 * ("> ") steht dann bei y ~907-993 über der Bubble (ab y 1010) */
const TERMINAL_Y = -790;
const CODE = "claude.com/product/claude-code";

/** Quelle groß, er als Bubble (Sekunden im Schnitt; Bilder scharf aus hyperframes/claudeschnitt-hg, nur zugeschnitten) */
const SEITEN: QuelleFenster[] = [
  // "Ich mache das einfach mit Claude Code" → Kopf der Produktseite: Claude-Logo, "Claude Code"
  { von: 39.13, bis: 40.87, bild: "broll/claudeschnitt/quelle-code-kopf.jpg", y: 290, fokus: [[280, 1000]], seite: "#FAF9F5" },
  // "und dem Modell Opus 5.5." → Ankündigung "Claude Opus 5.5", September 22, 2026
  { von: 40.87, bis: 43.13, bild: "broll/claudeschnitt/quelle-opus.jpg", y: 100, label: "anthropic.com/claude-opus-5-5", seite: "#0B0C0E" },
  // "du öffnest Claude Code und gibst einfach einen einzigen Prompt erst einmal ein. Zum Beispiel: „Richte …“" → das
  // Terminal-Bild der Produktseite, der Prompt tippt sich in seine Eingabezeile (PromptImTerminal), Enter bei 61,4 s
  { von: 52.5, bis: 61.95, bild: "broll/claudeschnitt/quelle-code-terminal.jpg", y: TERMINAL_Y, label: CODE, seite: "#FAF9F5" },
];

/** Platz für Pauls eigene Onboarding-Screenshots (Regie 30.10.: "K02 · Screen …" im Drive-Ordner Rohclips). Kommen sie, hier
 * je ein Fenster eintragen (Bild 1080 breit nach public/broll/claudeschnitt/, y so, dass die Frage zwischen y ~330 und ~1000
 * steht; die Karte darunter blendet von selbst aus), Klick-Ton in karten.json. Passende Stellen (Sekunden im Schnitt):
 *   Marke "Wie heißt deine Marke und wofür steht sie?"        77.36-80.16
 *   Farben "Welche Farben gehören zum Beispiel zu dir?"       80.16-82.36
 *   Beispiel-Videos "Dann gibst du noch zwei, drei …"         82.36-89.53 (danach "keine eigenen" bis 94.06)
 *   Stil "Untertitel / wie schnell / Effekte"                 94.06-100.00
 *   Schnittprofil "gespeichert in sogenannten Skills"         100.00-104.56 */
const ONBOARDING_SCREENS: QuelleFenster[] = [];

const QUELLEN: QuelleFenster[] = [...SEITEN, ...ONBOARDING_SCREENS].sort((a, b) => a.von - b.von);

/** Der Beispiel-Prompt, Wort für Wort mit seiner Stimme (Sekunden im Schnitt aus cut.json, 2 Frames Vorlauf) */
const PROMPT: [string, number, number][] = [
  ["Richte", 57.53, 57.8], ["mir", 57.9, 58.03], ["meinen", 58.33, 58.5], ["Videoschnitt", 58.53, 59.0], ["ein", 59.1, 59.27],
  ["und", 59.6, 59.7], ["frag", 59.73, 59.93], ["mich", 60.0, 60.1], ["danach", 60.13, 60.43], ["nach", 60.5, 60.6],
  ["meinem", 60.7, 61.0], ["Stil.", 61.07, 61.33],
];
const ENTER = 61.4;
const BEISPIEL_AB = 56.26;

/** Der Prompt in der Eingabezeile des echten Terminal-Bilds (Bild-y 1697-1783, Text ab x 266), mit derselben ruhigen Fahrt
 * (2 %) wie QuelleGross, damit er auf dem Bild stehen bleibt */
const PromptImTerminal: React.FC<{ fr: number }> = ({ fr }) => {
  const f = SEITEN[2];
  const a = f.von * C.FPS;
  const b = f.bis * C.FPS;
  if (fr < a || fr >= b) return null;
  const t = fr / C.FPS;
  const vor = 2 / C.FPS;
  let text = "";
  PROMPT.forEach(([w, s0, s1], i) => {
    const z = (i ? " " : "") + w;
    const von = s0 - vor;
    const bis = Math.max(von + 0.05, s1 - vor);
    if (t >= von) text += z.slice(0, Math.min(z.length, Math.floor(((t - von) / (bis - von)) * z.length) + 1));
  });
  const gesendet = t >= ENTER + 0.05;
  const blink = Math.floor((fr - a) / 15) % 2 === 0 || (t > PROMPT[0][1] - vor && t < ENTER);
  const kb = 1 + 0.02 * interpolate(fr, [a, b], [0, 1], clamp);
  const y = (bildY: number) => (f.y ?? 0) + bildY;
  const hinweis = interpolate(t, [BEISPIEL_AB, BEISPIEL_AB + 0.2], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: `scale(${kb})`, transformOrigin: "540px 960px" }}>
      <div
        style={{
          position: "absolute",
          left: 268,
          top: y(1709),
          width: 700,
          fontFamily: "Geist Mono, monospace",
          fontSize: 24,
          lineHeight: "28px",
          color: "#EDEDED",
          whiteSpace: "normal",
        }}
      >
        {gesendet ? "" : text}
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 24,
            marginLeft: 2,
            verticalAlign: -4,
            background: "#EDEDED",
            opacity: blink ? 0.9 : 0,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 213,
          top: y(1795),
          opacity: hinweis,
          padding: "4px 12px 6px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
          color: "#D6D6D6",
          fontFamily: "Geist, system-ui, sans-serif",
          fontWeight: 600,
          fontSize: 20,
          whiteSpace: "nowrap",
        }}
      >
        Beispiel-Prompt · Illustration
      </div>
    </AbsoluteFill>
  );
};

/** Soundeffekte der Karten (Sekunden im Schnitt, aus karten.json) */
const TOENE = karten.karten.flatMap((k) => k.sfx);

/** Pill-Untertitel unter dem Kinn, über der Karte (Karte x 80-900, oben bei y 1120) */
const PILLE = { x: 490, y: 1072 };

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
      <PromptImTerminal fr={fr} />
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

      {/* Hook-Titel (Pauls Regel 30.10.: kurz und prägnant, Thema in wenigen Worten; Design verlauf wie easyJet/K01), an der
          Kartenposition unter dem Kopf (oben ~1120), wie Karte und Pille um x 490 zentriert, damit nichts in die TikTok-Leiste
          rechts (ab x 900) ragt */}
      <DesignRahmen design="verlauf">
        <AbsoluteFill style={{ transform: "translate(-50px, 868px) scale(0.9)", transformOrigin: "50% 0%" }}>
          <HookTitle fr={fr} line1="KEINE ZEIT" line2="ZUM SCHNEIDEN?" outAt={HOOK_ENDE} />
        </AbsoluteFill>
      </DesignRahmen>

      {/* Erklär-Bilder aus HyperFrames (hyperframes/claudeschnitt-skizzen), helle Karten unter dem Kopf */}
      <Sequence from={0} durationInFrames={C.DURATION} layout="none">
        <OffthreadVideo
          src={staticFile("broll/claudeschnitt/skizzen.webm")}
          transparent
          muted
          style={{ position: "absolute", inset: 0, width: 1080, height: 1920, opacity: kartenSicht(q.p) }}
        />
      </Sequence>
      {sfx && TOENE.map((t, i) => <Sfx key={i} file={t.datei} at={Math.round(t.at * C.FPS)} volume={t.volume} />)}

      {untertitel && <PillUntertitel C={C} fr={fr} {...quellePille(q.p, PILLE)} off={OHNE_PILLE} farbe="#00E090" />}

      {musik && <Musik C={C} datei={musik} />}
      {raster && <Raster />}
    </AbsoluteFill>
  );
};
