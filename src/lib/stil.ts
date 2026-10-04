/**
 * Dein Schnittstil in Zahlen. Das hier ist der Stil, mit dem die Videos von Marketing Faber geschnitten werden:
 * ändere ihn, bis es deiner ist (oder sag Claude, was anders sein soll, dann trägt es den Wunsch hier und in
 * .claude/skills/faber-cut/stil.md ein).
 */
export const STIL = {
  /** Schrift (Geist liegt in public/fonts, Lizenz: SIL OFL) */
  font: "Geist, system-ui, sans-serif",
  mono: "Geist Mono, ui-monospace, monospace",
  /** Akzent für das gesprochene Wort und Hervorhebungen */
  yellow: "#FFDE28",
  ink: "#14161A",
  green: "#1F9D6B",
  red: "#E5484D",
  paper: "#F4F1EA",
  line: "#D9D4CA",
  muted: "#6B675F",
  /** ein Grade für alle Takes (CSS-Filter); kein Angleichen pro Schnitt */
  grade: "contrast(1.05) saturate(1.08) brightness(1.02)",
  /** sichere Fläche (1080x1920): alles, was etwas bedeutet, liegt hier; oben ~250 px und rechts die App-Knöpfe frei */
  safe: { left: 60, top: 250, width: 890, bottom: 1500 },
  /** Untertitel: y im Vollbild, Größe */
  captionY: 1340,
  captionSize: 76,
  /** Untertitel im Splitscreen (auf der Naht) */
  captionYSplit: 872,
  captionSizeSplit: 64,
  /** Lautstärke der Soundeffekte (immer deutlich unter der Stimme) */
  sfx: 0.1,
  /** kleinste Schrift in Grafiken (px): darunter ist es auf dem Handy nicht lesbar */
  minText: 42,
};
