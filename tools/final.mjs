/**
 * Die Vollversion: rendert in voller Größe (ein Durchgang), normalisiert die Lautheit auf -14 LUFS (zwei Durchgänge,
 * True Peak -1 dB) und schreibt zwei Kopien zum Weitergeben.
 *
 *   npm run final -- <Komposition>
 *
 * Ergebnis in out/final/:
 *   <id>.mp4         das Master (CRF 18)
 *   <id>-post.mp4    für Instagram/TikTok: bis 5 Mbit/s, bei langen Videos weniger, damit es unter 47 MB bleibt
 *                    (das behält Instagram nach der eigenen Kompression ohnehin ungefähr)
 *   <id>-chat.mp4    unter 29 MB (zwei Durchgänge), zum Verschicken im Chat
 * Danach: npm run checks -- out/final/<id>.mp4 (Ausreißer-Frames, Lautheit, Tonlöcher, Effekte unter der Stimme).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { cpus } from "node:os";

const id = process.argv[2];
if (!id) {
  console.error("Aufruf: npm run final -- <Komposition>");
  process.exit(1);
}
mkdirSync("out/final", { recursive: true });
const master = `out/final/${id}.mp4`;
// erst Matroska mit PCM-Ton: Remotions AAC legt ~43 ms Stille an den Anfang, die Lautheits-Stufe trug sie mit, der Ton
// lag 1,3 Frames hinter dem Bild. AAC entsteht so nur einmal, in der Lautheits-Stufe.
const raw = `out/final/${id}.roh.mkv`;
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} fehlgeschlagen`);
};

const t0 = Date.now();
run(process.execPath, ["node_modules/@remotion/cli/remotion-cli.js", "render", id, raw, "--codec=h264-mkv", `--concurrency=${Math.max(1, Math.min(4, cpus().length))}`, "--crf=18", "--log=error"]);
console.log(`gerendert in ${Math.round((Date.now() - t0) / 1000)} s`);

// Lautheit: zwei Durchgänge (messen, dann linear anpassen), Bild wird nur kopiert
const probe = spawnSync(
  "ffmpeg",
  ["-hide_banner", "-nostats", "-i", raw, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"],
  { encoding: "utf8" },
);
// der Messwert ist der letzte {...}-Block mit "input_i"; neuere ffmpeg schreiben danach noch Zeilen
const m = JSON.parse(probe.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/g).pop());
run("ffmpeg", [
  "-v", "error", "-y", "-i", raw, "-c:v", "copy",
  "-af", `loudnorm=I=-14:TP=-1:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
  "-ar", "48000", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", master,
]);
rmSync(raw, { force: true });
console.log(`Lautheit: ${m.input_i} LUFS -> -14 LUFS`);

const seconds = Number(
  execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", master], {
    encoding: "utf8",
  }),
);
// Post-Version: höchstens 5 Mbit/s, bei langen Videos so viel, dass 47 MB reichen
const kbps = Math.min(5000, Math.floor((47 * 8 * 1000) / seconds) - 192);
run("ffmpeg", [
  "-v", "error", "-y", "-i", master, "-c:v", "libx264", "-preset", "slow", "-crf", "20",
  "-maxrate", `${kbps}k`, "-bufsize", `${2 * kbps}k`, "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", `out/final/${id}-post.mp4`,
]);
// Chat-Version: unter 29 MB. Passt die Post-Version schon, wird sie übernommen; sonst zwei Durchgänge auf ~28,5 MB
const post = `out/final/${id}-post.mp4`;
const chat = `out/final/${id}-chat.mp4`;
if (statSync(post).size < 29e6) {
  copyFileSync(post, chat);
} else {
  const vb = Math.floor((28.5 * 8 * 1024 * 1024) / seconds / 1000) - 130;
  const log = `out/final/${id}-2pass`;
  run("ffmpeg", ["-v", "error", "-y", "-i", master, "-c:v", "libx264", "-preset", "slow", "-b:v", `${vb}k`,
    "-pass", "1", "-passlogfile", log, "-an", "-f", "null", "-"]);
  run("ffmpeg", ["-v", "error", "-y", "-i", master, "-c:v", "libx264", "-preset", "slow", "-b:v", `${vb}k`,
    "-pass", "2", "-passlogfile", log, "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart", chat]);
  for (const f of [`${log}-0.log`, `${log}-0.log.mbtree`]) rmSync(f, { force: true });
}

for (const f of [master, post, chat])
  console.log(`${f}: ${(statSync(f).size / 1e6).toFixed(1)} MB`);
console.log(`Länge ${seconds.toFixed(1)} s. Jetzt: npm run checks -- ${master} --stems ${id}`);
