/**
 * Schnelle Vorschau mit Cache: das Video wird in 10-s-Stücken gerendert (zwei gleichzeitig, halbe Größe), die Stücke
 * bleiben in out/vorschau/<id>/ liegen und werden ohne Neukodieren zusammengesetzt. Nach einer Änderung werden nur
 * die Stücke neu gerendert, die sie berühren (Day 4: 94 s beim ersten Mal, 39 s nach einer lokalen Änderung).
 *
 *   npm run vorschau -- <Komposition> [--changed a-b[,c-d]] [--from N] [--all] [--chunk 10] [--scale 0.5]
 *
 *   (ohne Option)  rendert jedes Stück, das noch nicht im Cache ist
 *   --changed a-b  Frames a..b haben sich an Ort und Stelle geändert (Grafik, Zoom, Untertitel)
 *   --from N       die Zeitachse ab Frame N hat sich verschoben (ein Schnitt dazu oder raus)
 *   --all          Cache verwerfen, alles neu
 * Ergebnis: out/vorschau/<id>.mp4. Nie mehr als zwei Renders gleichzeitig (drei bringen kleine Rechner zum Absturz).
 */
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const [id, ...rest] = process.argv.slice(2);
if (!id) {
  console.error(
    "Aufruf: npm run vorschau -- <Komposition> [--changed a-b] [--from N] [--all]",
  );
  process.exit(1);
}
const opt = (name, def) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : def;
};
const FPS = 30;
const chunkFrames = Math.round(Number(opt("--chunk", "10")) * FPS);
const scale = opt("--scale", "0.5");
const dir = `out/vorschau/${id}`;
mkdirSync(dir, { recursive: true });

// "Tag5   30   1080x1920   3135 (104.50 sec)" aus `remotion compositions`
const line = execFileSync("npx", ["remotion", "compositions"], { encoding: "utf8" })
  .split("\n")
  .find((l) => l.trim().split(/\s+/)[0] === id);
if (!line) {
  console.error(`Komposition ${id} nicht gefunden`);
  process.exit(1);
}
const meta = { durationInFrames: Number(line.trim().split(/\s+/)[3]) };
const total = meta.durationInFrames;
const key = JSON.stringify({ total, chunkFrames, scale });
const keyFile = `${dir}/key.json`;
if (
  rest.includes("--all") ||
  !existsSync(keyFile) ||
  readFileSync(keyFile, "utf8") !== key
) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  writeFileSync(keyFile, key);
}

const chunks = [];
for (let a = 0; a < total; a += chunkFrames)
  chunks.push([a, Math.min(total, a + chunkFrames) - 1]);
const file = (i) => `${dir}/chunk-${String(i).padStart(3, "0")}.mp4`;
const dirty = new Set();
for (const r of (opt("--changed", "") || "").split(",").filter(Boolean)) {
  const [a, b] = r.split("-").map(Number);
  chunks.forEach(([s, e], i) => {
    if (s <= b && e >= a) dirty.add(i);
  });
}
const from = opt("--from", null);
if (from !== null) chunks.forEach(([, e], i) => e >= Number(from) && dirty.add(i));
chunks.forEach((_, i) => !existsSync(file(i)) && dirty.add(i));

const render = (i) =>
  new Promise((resolve, reject) => {
    const [a, b] = chunks[i];
    const p = spawn(
      "npx",
      [
        "remotion",
        "render",
        id,
        file(i),
        `--scale=${scale}`,
        "--crf=28",
        "--concurrency=2",
        "--x264-preset=ultrafast",
        `--frames=${a}-${b}`,
        "--log=error",
      ],
      { stdio: "ignore" },
    );
    p.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`chunk ${i} failed (${code})`)),
    );
  });

const t0 = Date.now();
const todo = [...dirty].sort((x, y) => x - y);
const queue = [...todo];
const worker = async () => {
  while (queue.length) await render(queue.shift());
};
await Promise.all([worker(), worker()]); // zwei gleichzeitig
// der AAC-Ton jedes Stücks läuft ~48 ms über sein Bild hinaus; "outpoint" schneidet jedes Stück auf seine Bildlänge,
// damit der Ton von Stück zu Stück nicht gegen das Bild wandert
const list = chunks
  .map(
    ([a, b], i) =>
      `file '${process.cwd()}/${file(i)}'\noutpoint ${((b - a + 1) / FPS).toFixed(6)}`,
  )
  .join("\n");
writeFileSync(`${dir}/list.txt`, list);
execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  `${dir}/list.txt`,
  "-c",
  "copy",
  `out/vorschau/${id}.mp4`,
]);
console.log(
  `${id}: ${todo.length}/${chunks.length} Stücke gerendert in ${Math.round((Date.now() - t0) / 1000)} s ` +
    `-> out/vorschau/${id}.mp4`,
);
