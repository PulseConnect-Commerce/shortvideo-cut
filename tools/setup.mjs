/**
 * Einmalige Einrichtung, auf Windows, macOS und Linux gleich:
 *
 *   npm run setup                    alles, inklusive der Modelle für Deutsch (~3 GB Download)
 *   npm run setup -- --sprache en    Modelle für Englisch
 *   npm run setup -- --ohne-modelle  ohne Modelle (die lädt dann das erste Video; für Cloud-Setup-Skripte)
 *
 * Vorher nötig: Node.js 20+ und ffmpeg (das Onboarding und die README erklären, wie). Python braucht es nicht:
 * setup holt sich uv (https://docs.astral.sh/uv) und damit ein eigenes Python 3.12 in .venv.
 * Installiert: Node-Pakete (Remotion), .venv (faster-whisper, PyTorch, Transformers, OpenCV), DeepFilterNet
 * (Stimme entrauschen) und das YuNet-Gesichtsmodell in .tools/, dann die Modelle für Transkription und Ausrichtung.
 * Kann jederzeit wiederholt werden: was schon da ist, wird übersprungen.
 */
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { python } from "./py.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
process.chdir(root);
const args = process.argv.slice(2);
const sprache = args.includes("--sprache") ? args[args.indexOf("--sprache") + 1] : "de";
const win = process.platform === "win32";
const mac = process.platform === "darwin";
const arch = process.arch; // x64 | arm64
const tools = join(root, ".tools");
mkdirSync(tools, { recursive: true });

const ok = (s) => console.log(`  ✓ ${s}`);
const info = (s) => console.log(`  - ${s}`);
const fail = (s) => {
  console.error(`\n  ✗ ${s}\n`);
  process.exit(1);
};
const run = (cmd, a, opts = {}) => spawnSync(cmd, a, { stdio: "inherit", ...opts }).status === 0;
const quiet = (cmd, a) => spawnSync(cmd, a, { encoding: "utf8" });
const has = (cmd) => !quiet(cmd, ["-version"]).error;
const download = (url, file) => run("curl", ["-fsSL", "--retry", "3", "-o", file, url]);
const TORCH = "torch==2.14.0"; // dieselbe Version wie getestet
const t0 = Date.now();

console.log(`faber-cut einrichten (${process.platform}, ${arch})\n`);

// 0. Systeme, für die es PyTorch und faster-whisper nicht (mehr) gibt
if (mac && arch === "x64")
  fail("Macs mit Intel-Chip werden nicht unterstützt (PyTorch gibt es dafür nicht mehr). Nimm den Online-Modus (siehe README).");
if (win && arch === "arm64")
  fail("Windows auf ARM wird nicht unterstützt (faster-whisper gibt es dafür nicht). Nimm den Online-Modus (siehe README).");

// 1. Node und ffmpeg
const [major] = process.versions.node.split(".").map(Number);
if (major < 20) fail(`Node.js ${process.versions.node} ist zu alt: bitte Node.js 20 oder neuer installieren (nodejs.org).`);
ok(`Node.js ${process.versions.node}`);
if (!has("ffmpeg") || !has("ffprobe")) {
  const how = win
    ? "winget install --id Gyan.FFmpeg -e   (danach ein NEUES Terminal öffnen)"
    : mac
      ? "brew install ffmpeg"
      : "sudo apt install -y ffmpeg";
  fail(`ffmpeg fehlt. Installieren mit:\n      ${how}\n    und dann npm run setup noch einmal starten.`);
}
const filters = quiet("ffmpeg", ["-hide_banner", "-filters"]).stdout;
const encoders = quiet("ffmpeg", ["-hide_banner", "-encoders"]).stdout;
for (const f of ["loudnorm", "deesser", "ebur128", "acompressor"])
  if (!filters.includes(` ${f} `)) fail(`Dein ffmpeg kann den Filter "${f}" nicht. Bitte ein vollständiges ffmpeg installieren.`);
if (!encoders.includes("libx264")) fail('Dein ffmpeg hat keinen H.264-Encoder (libx264). Bitte ein vollständiges ffmpeg installieren.');
ok("ffmpeg");

// 2. Node-Pakete (Remotion)
const npm = process.env.npm_execpath;
const npmCi = npm
  ? run(process.execPath, [npm, existsSync("package-lock.json") ? "ci" : "install", "--no-audit", "--no-fund"])
  : run("npm", ["ci", "--no-audit", "--no-fund"], { shell: true });
if (!npmCi) fail("npm konnte die Pakete nicht installieren (Internet? Siehe Meldung oben).");
ok("Node-Pakete (Remotion)");
if (!run(process.execPath, ["node_modules/@remotion/cli/remotion-cli.js", "browser", "ensure"], { stdio: "ignore" }))
  fail("Remotion konnte seinen Browser (Chrome Headless Shell) nicht laden (Internet? Siehe npm run doktor).");
ok("Browser für Remotion");

// 3. uv: vom System oder als einzelne Datei nach .tools/
let uv = quiet("uv", ["--version"]).status === 0 ? "uv" : join(tools, win ? "uv.exe" : "uv");
if (uv !== "uv" && !existsSync(uv)) {
  const target = win
    ? `${arch === "arm64" ? "aarch64" : "x86_64"}-pc-windows-msvc`
    : mac
      ? `${arch === "arm64" ? "aarch64" : "x86_64"}-apple-darwin`
      : `${arch === "arm64" ? "aarch64" : "x86_64"}-unknown-linux-gnu`;
  const file = join(tools, win ? "uv.zip" : "uv.tar.gz");
  const tmp = join(tools, "uv-tmp");
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp);
  if (
    download(`https://github.com/astral-sh/uv/releases/latest/download/uv-${target}.${win ? "zip" : "tar.gz"}`, file) &&
    (win
      ? run("powershell", ["-NoProfile", "-Command", `Expand-Archive -Force -Path '${file}' -DestinationPath '${tmp}'`])
      : run("tar", ["-xf", file, "-C", tmp]))
  ) {
    const find = (d) =>
      readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? find(join(d, n)) : [join(d, n)]));
    const bin = find(tmp).find((p) => p.endsWith(win ? "uv.exe" : "/uv"));
    if (bin) renameSync(bin, uv);
  }
  rmSync(tmp, { recursive: true, force: true });
  rmSync(file, { force: true });
  if (!existsSync(uv)) uv = null;
}
uv ? ok("uv (Python-Verwaltung)") : info("uv nicht verfügbar: nehme das Python des Systems");

// 4. Python-Umgebung .venv
if (!existsSync(python)) {
  let made = false;
  if (uv) for (const v of ["3.12", "3.11", "3.10"]) if ((made = run(uv, ["venv", "-q", ".venv", "--python", v]))) break;
  if (!made) {
    const sys = win ? ["py", ["-3.12"]] : ["python3", []];
    made = run(sys[0], [...sys[1], "-m", "venv", ".venv"]);
  }
  if (!made || !existsSync(python)) fail("Konnte keine Python-Umgebung anlegen (siehe Meldung oben).");
}
const pip = (...a) =>
  uv ? run(uv, ["pip", "install", "-q", "--python", python, ...a]) : run(python, ["-m", "pip", "install", "-q", ...a]);
const imports = () => quiet(python, ["-c", "import faster_whisper, transformers, torch, cv2, numpy, PIL"]).status === 0;
const hasTorch = quiet(python, ["-c", `import torch; assert torch.__version__.startswith("${TORCH.split("==")[1]}")`]).status === 0;
if (!hasTorch) info("Python-Pakete werden installiert (PyTorch ist groß, das dauert ein paar Minuten) …");
const torchOk = hasTorch || (mac ? pip(TORCH) : pip(TORCH, "--index-url", "https://download.pytorch.org/whl/cpu"));
// immer: bringt eine ältere .venv auf die getesteten Versionen (dauert nur Sekunden, wenn schon alles passt)
if (!torchOk || !pip("-r", "requirements.txt")) fail("Die Python-Pakete ließen sich nicht installieren (siehe Meldung oben).");
if (!imports()) fail("Python-Pakete installiert, aber nicht ladbar (siehe Meldung oben).");
ok(`Python-Umgebung .venv (${quiet(python, ["--version"]).stdout.trim()})`);

// 5. DeepFilterNet (optional: ohne wird die Stimme nicht entrauscht)
const df = join(tools, win ? "deep-filter.exe" : "deep-filter");
if (!existsSync(df)) {
  const asset = {
    "win32-x64": "x86_64-pc-windows-msvc.exe",
    "darwin-arm64": "aarch64-apple-darwin",
    "darwin-x64": "x86_64-apple-darwin",
    "linux-x64": "x86_64-unknown-linux-musl",
    "linux-arm64": "aarch64-unknown-linux-gnu",
  }[`${process.platform}-${arch}`];
  if (asset && download(`https://github.com/Rikorose/DeepFilterNet/releases/download/v0.5.6/deep-filter-0.5.6-${asset}`, df)) {
    if (!win) chmodSync(df, 0o755);
  } else rmSync(df, { force: true });
}
existsSync(df) && quiet(df, ["--version"]).status === 0
  ? ok("DeepFilterNet (Stimme entrauschen)")
  : info("DeepFilterNet nicht verfügbar: Takes werden ohne Entrauschen vorbereitet (geht trotzdem)");

// 6. YuNet-Gesichtsmodell für das Platzierungsraster
const yunet = join(tools, "yunet.onnx");
if (!existsSync(yunet))
  download("https://huggingface.co/opencv/face_detection_yunet/resolve/main/face_detection_yunet_2023mar.onnx", yunet) ||
    rmSync(yunet, { force: true });
existsSync(yunet) ? ok("YuNet-Gesichtsmodell") : info("YuNet nicht geladen: das Platzierungsraster zeigt keine Kopf-Box");

// 7. Modelle für Transkription und Wort-Ausrichtung vorab laden
if (!args.includes("--ohne-modelle")) {
  info(`Modelle für Transkription und Ausrichtung (${sprache}) werden geladen, ~3 GB beim ersten Mal …`);
  const code = [
    "from faster_whisper import WhisperModel",
    "from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor",
    "import sys",
    "WhisperModel('medium', device='cpu', compute_type='int8')",
    `m = {'de': 'jonatasgrosman/wav2vec2-large-xlsr-53-german', 'en': 'jonatasgrosman/wav2vec2-large-xlsr-53-english'}.get('${sprache}')`,
    "m and Wav2Vec2Processor.from_pretrained(m) and Wav2Vec2ForCTC.from_pretrained(m)",
  ].join("\n");
  if (!run(python, ["-c", code], { env: { ...process.env, PYTHONUTF8: "1" } }))
    fail("Die Modelle ließen sich nicht laden (Internet? Hugging Face erreichbar? Siehe Meldung oben).");
  ok("Modelle für Transkription und Ausrichtung");
}

console.log(`\nFertig in ${Math.round((Date.now() - t0) / 1000)} s. Prüfen: npm run doktor`);
