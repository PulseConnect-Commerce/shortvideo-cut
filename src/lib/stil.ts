/**
 * Die Zahlen des Stils HERO (Erklär- und Expertenvideos, Skill stil-hero): Farben, Maße, Lautstärke der Effekte.
 * Andere Formate (FACE, NEWS) bekommen beim Stilabgleich eigene Abweichungen; diese Werte bleiben HERO.
 * Sag Claude, was anders sein soll, dann trägt es den Wunsch hier und im Skill des Formats ein.
 */
import zonen from "./zonen.json";

const [sx0, sy0, sx1, sy1] = zonen.sicher;

export const STIL = {
  /** Schrift (Geist liegt in public/fonts, Lizenz: SIL OFL) */
  font: "Geist, system-ui, sans-serif",
  mono: "Geist Mono, ui-monospace, monospace",
  /** Akzent für das gesprochene Wort und Hervorhebungen (heißt aus Kompatibilität "yellow", ist mein Blau) */
  yellow: "#31ADEC",
  /** zweite Akzentfarbe: das Hellgrün von PulseConnect (pulseconnect.de), für alles Positive (Haken, "ok", Schutz);
   * darauf immer dunkle Schrift (ink), weiße hat zu wenig Kontrast */
  accent2: "#00E090",
  /** das Gelb des Speichern-Lesezeichens wie in TikTok, für den Speichern-Aufruf am Ende */
  save: "#FACE15",
  /** Hook-Titel: nie in der Farbe der Untertitel. Erste Zeile weiß mit roter Kontur, der Kern rot mit weißer Kontur */
  hook: { text: "#FFFFFF", rand: "#E4222C", kern: "#E4222C", kernRand: "#FFFFFF" },
  /** Hook-Titel höchstens so breit (zentriert): links und rechts je 100 px frei, nichts im Randstreifen (~3 mm) */
  hookBreite: 880,
  ink: "#14161A",
  green: "#1F9D6B",
  red: "#E5484D",
  paper: "#F4F1EA",
  line: "#D9D4CA",
  muted: "#6B675F",
  /** ein Grade für alle Takes (CSS-Filter); kein Angleichen pro Schnitt */
  grade: "contrast(1.05) saturate(1.08) brightness(1.02)",
  /** sichere Fläche (1080x1920): alles, was etwas bedeutet, liegt hier, frei von den Knöpfen von TikTok und Instagram
   * (die Zonen stehen in zonen.json; npm run raster und <Raster /> zeichnen sie ein) */
  safe: { left: sx0, top: sy0, width: sx1 - sx0, bottom: sy1 },
  /** Untertitel: y im Vollbild, Größe */
  captionY: 1340,
  captionSize: 76,
  /** Untertitel im Splitscreen (auf der Naht) */
  captionYSplit: 872,
  captionSizeSplit: 64,
  /** Lautstärke der Soundeffekte (immer deutlich unter der Stimme) */
  sfx: 0.16,
  /** kleinste Schrift in Grafiken (px): darunter ist es auf dem Handy nicht lesbar */
  minText: 42,
};
