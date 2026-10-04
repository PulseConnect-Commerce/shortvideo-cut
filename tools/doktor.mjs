/**
 * Prüft, ob alles für faber-cut bereit ist, und sagt bei jedem Problem, wie man es behebt:
 *
 *   npm run doktor
 *
 * ✓ = in Ordnung, ! = optional oder Hinweis, ✗ = muss behoben werden (Exit-Code 1).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statfsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { python } from "./py.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
process.chdir(root);
const win = process.platform === "win32";
const mac = process.platform === "darwin";
const cloud = process.env.CLAUDE_CODE_REMOTE === "true";
let bad = 0;
const ok = (s) => console.log(`  ✓ ${s}`);
const warn = (s) => console.log(`  ! ${s}`);
const no = (s, fix) => {
  bad++;
  console.log(`  ✗ ${s}\n      → ${fix}`);
};
const quiet = (cmd, a, env) => spawnSync(cmd, a, { encoding: "utf8", env: { ...process.env, ...env } });

console.log(`faber-cut Doktor (${process.platform}, ${process.arch}${cloud ? ", Cloud-Sitzung" : ""})\n`);

// Einstellungen aus dem Onboarding
let cfg = null;
try {
  cfg = JSON.parse(readFileSync("faber-cut.json", "utf8"));
  ok(`Onboarding erledigt (${cfg.modus}, Sprache ${cfg.sprache}, eingerichtet ${cfg.eingerichtet})`);
} catch {
  warn('Noch kein Onboarding (faber-cut.json fehlt): sag Claude "Richte faber-cut für mich ein"');
}

// Programme
const [major] = process.versions.node.split(".").map(Number);
major >= 20 ? ok(`Node.js ${process.versions.node}`) : no(`Node.js ${process.versions.node} ist zu alt`, "Node.js 20 oder neuer installieren (nodejs.org)");
const ff = quiet("ffmpeg", ["-hide_banner", "-filters"]);
if (ff.error || quiet("ffprobe", ["-version"]).error)
  no("ffmpeg fehlt", win ? "winget install --id Gyan.FFmpeg -e, danach ein neues Terminal" : mac ? "brew install ffmpeg" : "sudo apt install -y ffmpeg");
else if (!["loudnorm", "deesser", "ebur128"].every((f) => ff.stdout.includes(` ${f} `)))
  no("ffmpeg ohne die nötigen Filter (loudnorm, deesser, ebur128)", "ein vollständiges ffmpeg installieren (siehe README)");
else ok("ffmpeg");
existsSync("node_modules/@remotion/cli/remotion-cli.js") ? ok("Remotion") : no("Remotion fehlt", "npm run setup");

// Python
if (!existsSync(python)) no("Python-Umgebung .venv fehlt", "npm run setup");
else {
  const r = quiet(python, ["-c", "import faster_whisper, transformers, torch, cv2; print(torch.__version__)"]);
  r.status === 0 ? ok(`Python-Pakete (torch ${r.stdout.trim()})`) : no("Python-Pakete fehlen oder sind kaputt", "npm run setup");
  const m = quiet(
    python,
    [
      "-c",
      "from huggingface_hub import scan_cache_dir\nids={r.repo_id for r in scan_cache_dir().repos}\n" +
        "print(','.join(k for k,v in [('whisper','Systran/faster-whisper-medium'),('de','jonatasgrosman/wav2vec2-large-xlsr-53-german'),('en','jonatasgrosman/wav2vec2-large-xlsr-53-english')] if v in ids))",
    ],
    { PYTHONUTF8: "1" },
  );
  const have = (m.stdout || "").trim().split(",").filter(Boolean);
  const lang = cfg?.sprache === "en" ? "en" : "de";
  have.includes("whisper") && have.includes(lang)
    ? ok("Modelle für Transkription und Ausrichtung sind geladen")
    : warn("Modelle noch nicht geladen: das erste Video lädt sie (~3 GB), oder vorab: npm run setup");
}
existsSync(join(".tools", win ? "deep-filter.exe" : "deep-filter"))
  ? ok("DeepFilterNet (Stimme entrauschen)")
  : warn("DeepFilterNet fehlt: die Stimme wird nicht entrauscht (npm run setup versucht es erneut)");
existsSync(join(".tools", "yunet.onnx")) ? ok("YuNet (Platzierungsraster)") : warn("YuNet fehlt: npm run setup");

// Platz
try {
  const s = statfsSync(root);
  const gb = (s.bavail * s.bsize) / 1e9;
  gb >= 5 ? ok(`${gb.toFixed(0)} GB frei`) : gb >= 2 ? warn(`nur ${gb.toFixed(1)} GB frei: alte Takes in public/projekte/ löschen`) : no(`nur ${gb.toFixed(1)} GB frei`, "Platz schaffen: alte Takes in public/projekte/ und out/ löschen");
} catch {
  /* statfs gibt es nicht überall */
}

// Gemini (optional)
let key = process.env.GEMINI_API_KEY?.trim();
if (!key && existsSync(".env"))
  for (const line of readFileSync(".env", "utf8").replace(/^﻿/, "").split(/\r?\n/)) {
    const [k, ...v] = line.split("=");
    if (k.trim() === "GEMINI_API_KEY" && v.join("=").trim()) key = v.join("=").trim().replace(/^["']|["']$/g, "");
  }
if (!key) cfg?.gemini ? no("Gemini ist gewählt, aber kein Schlüssel gefunden", cloud ? "GEMINI_API_KEY in den Umgebungsvariablen der Cloud-Umgebung eintragen, dann eine neue Sitzung starten" : "den Schlüssel in die Datei .env eintragen: GEMINI_API_KEY=…") : warn("Gemini-Prüfung nicht eingerichtet (optional)");
else {
  const r = quiet("curl", ["-s", "-o", process.platform === "win32" ? "NUL" : "/dev/null", "-w", "%{http_code}", "-H", `x-goog-api-key: ${key}`, "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1"]);
  r.stdout === "200"
    ? ok("Gemini-Schlüssel gültig")
    : no(`Gemini-Schlüssel wird nicht angenommen (HTTP ${r.stdout || "?"})`, "Schlüssel in Google AI Studio prüfen und neu eintragen (aistudio.google.com/apikey)");
}

// Online: Google Drive
if (cfg?.modus === "online") {
  cfg.drive?.id ? ok(`Drive-Ordner "${cfg.drive.ordner}"`) : no("Kein Drive-Ordner eingetragen", "Onboarding-Schritt Google Drive wiederholen");
  const r = quiet("curl", ["-s", "-o", win ? "NUL" : "/dev/null", "-w", "%{http_code}", "https://drive.usercontent.google.com/download?id=0"]);
  ["200", "303", "400", "404"].includes(r.stdout)
    ? ok("drive.usercontent.google.com erreichbar")
    : no(`drive.usercontent.google.com nicht erreichbar (HTTP ${r.stdout || "?"})`, "in der Cloud-Umgebung unter Network access die Domain erlauben (siehe Onboarding)");
}

console.log(bad ? `\n${bad} Problem(e): bitte beheben und npm run doktor noch einmal starten.` : "\nAlles bereit.");
process.exit(bad ? 1 : 0);
