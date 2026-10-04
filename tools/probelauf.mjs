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

step("Clip vorbereiten, transkribieren, ausrichten", ...py("intake.py", "beispiel/probe.mp4", "probelauf", "t1", "--namen", "faber-cut, Clip"));

// Schnitt aus dem Transkript: jeder Satz ohne Füllwörter (genau so schreibt Claude sonst die gewählte Variante)
const tr = JSON.parse(readFileSync("public/projekte/probelauf/edit/transcripts/t1.aligned.json", "utf8")).words;
const filler = /^(äh+m?|öh+m?|hm+|uh+m?|um+)[,.!?]*$/i;
const saetze = [];
let cur = null;
for (const w of tr) {
  if (filler.test(w.text.trim())) continue;
  if (!cur) cur = { take: "t1", ab: Math.max(0, +(w.start - 0.15).toFixed(2)), text: "" };
  cur.text = `${cur.text} ${w.text.trim()}`.trim();
  if (/[.!?]$/.test(w.text.trim())) {
    saetze.push(cur);
    cur = null;
  }
}
if (cur) saetze.push(cur);
const fehlt = ["probelauf", "funktioniert"].filter((x) => !JSON.stringify(tr).toLowerCase().includes(x));
if (fehlt.length) console.log(`Hinweis: im Transkript fehlt ${fehlt.join(", ")}; die Transkription klingt ungewöhnlich.`);
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
      ende: { bis: +(tr[tr.length - 1].end + 0.5).toFixed(2) },
      korrekturen: [],
    },
    null,
    1,
  ),
);
const vorlage = readFileSync("src/projekte/_vorlage/Video.tsx", "utf8")
  .replace('id: "Vorlage"', 'id: "Probelauf"')
  .replace('kicker="MEINE SERIE · TAG 1"', 'kicker="FABER-CUT · PROBELAUF"')
  .replace('line1="Dein Hook in einer Zeile"', 'line1="Wenn du das siehst,"')
  .replace('line2="mit dem Kern in Gelb."', 'line2="läuft alles."');
writeFileSync("src/projekte/probelauf/Video.tsx", vorlage);
console.log(`\nSchnitt: ${saetze.length} Sätze, ohne Füllwörter`);

step("Schnitt nach Text", ...py("schnitt.py", "src/projekte/probelauf/schnitt.json"));
step("Vorschau (halbe Größe)", ...node("tools/preview.mjs", "Probelauf", "--all"));
step("Vollversion (-14 LUFS, Post- und Chat-Kopie)", ...node("tools/final.mjs", "Probelauf"));
step("Prüfungen (Ausreißer, Lautheit, Effekte unter der Stimme)", ...py("checks.py", "out/final/Probelauf.mp4", "--stems", "Probelauf"));

console.log(`\n${steps.join("\n")}\n\nProbelauf bestanden. Das fertige Video: out/final/Probelauf.mp4`);
