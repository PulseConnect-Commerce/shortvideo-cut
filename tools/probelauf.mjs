/**
 * Probelauf: schneidet den Beispielclip beispiel/probe.mp4 einmal komplett durch, mit denselben Werkzeugen wie ein
 * echtes Video (vorbereiten, transkribieren, ausrichten, nach Text schneiden, Vorschau, Vollversion, Prüfungen).
 * Läuft er durch, ist die Einrichtung in Ordnung.
 *
 *   npm run probelauf
 *
 * Ergebnis: out/final/Probelauf.mp4 (das fertige Video zum Ansehen). Das Projekt "probelauf" bleibt liegen und kann
 * gelöscht werden (src/projekte/probelauf, public/projekte/probelauf).
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
process.chdir(root);
const steps = [];
const step = (name, cmd, args) => {
  const t = Date.now();
  console.log(`\n▶ ${name}`);
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  const s = Math.round((Date.now() - t) / 1000);
  steps.push(`${r.status === 0 ? "✓" : "✗"} ${name} (${s} s)`);
  if (r.status !== 0) {
    console.log(`\n${steps.join("\n")}\n\nDer Probelauf ist bei "${name}" hängen geblieben. Siehe Meldung oben; npm run doktor hilft.`);
    process.exit(1);
  }
};
const node = (script, ...a) => [process.execPath, [script, ...a]];
const py = (tool, ...a) => node("tools/py.mjs", tool, ...a);

step("Clip vorbereiten, transkribieren, ausrichten", ...py("intake.py", "beispiel/probe.mp4", "probelauf", "t1", "--namen", "faber-cut, Claude, Clip"));

// Die gewählte Fassung als Text, so wie Claude sie sonst nach deiner Wahl schreibt. Was fehlt, fliegt raus: das "Ähm"
// (Whisper hängt es an das "und" davor, darum fängt Satz 2 bei "Claude" an) und die Pausen.
const FASSUNG = [
  "Du filmst dich mit dem Handy.",
  "Claude schneidet das Video.",
  "Füllwörter und Pausen fliegen raus.",
  "Die Untertitel laufen Wort für Wort mit.",
  "Und jede Grafik kommt genau auf dem Wort.",
  "Wenn du das hier siehst, ist alles bereit für dein erstes Video.",
];
const norm = (s) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const tr = JSON.parse(readFileSync("public/projekte/probelauf/edit/transcripts/t1.aligned.json", "utf8")).words;
let pos = 0;
const saetze = FASSUNG.map((text) => {
  // "ab" = kurz vor dem ersten Wort des Satzes im Transkript (gesucht nach dem vorigen Satz)
  const first = norm(text.split(" ")[0]);
  const k = tr.findIndex((w, i) => i >= pos && norm(w.text) === first);
  const at = k >= 0 ? tr[k].start : tr[Math.min(pos, tr.length - 1)].start;
  if (k >= 0) pos = k + 1;
  return { take: "t1", ab: Math.max(0, +(at - 0.12).toFixed(2)), text };
});
mkdirSync("src/projekte/probelauf", { recursive: true });
writeFileSync(
  "src/projekte/probelauf/schnitt.json",
  JSON.stringify(
    {
      projekt: "probelauf",
      sprache: "de",
      fps: 30,
      pausen: { min_gap: 0.3, pre: 0.04, post: 0.06 },
      saetze,
      ende: { bis: +(tr[tr.length - 1].end + 0.6).toFixed(2) },
      korrekturen: [],
    },
    null,
    1,
  ),
);
// eigene Komposition für das Beispiel (zeigt, was faber-cut kann); deine Videos starten von src/projekte/_vorlage/
writeFileSync("src/projekte/probelauf/Video.tsx", readFileSync("beispiel/Probelauf.tsx", "utf8"));
console.log(`\nSchnitt: ${saetze.length} Sätze, ohne Füllwörter und Pausen`);

step("Schnitt nach Text", ...py("schnitt.py", "src/projekte/probelauf/schnitt.json"));
step("Vorschau (halbe Größe)", ...node("tools/preview.mjs", "Probelauf", "--all"));
step("Vollversion (-14 LUFS, Post- und Chat-Kopie)", ...node("tools/final.mjs", "Probelauf"));
step("Prüfungen (Ausreißer, Lautheit, Effekte unter der Stimme)", ...py("checks.py", "out/final/Probelauf.mp4", "--stems", "Probelauf"));

console.log(`\n${steps.join("\n")}\n\nProbelauf bestanden. Das fertige Video: out/final/Probelauf.mp4`);
