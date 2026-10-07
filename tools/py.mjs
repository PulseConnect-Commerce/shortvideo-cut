/**
 * Startet ein Python-Werkzeug mit der Python-Umgebung des Repos, auf Windows, macOS und Linux gleich:
 *
 *   node tools/py.mjs <werkzeug.py> [argumente …]      (die npm-Skripte in package.json rufen das auf)
 *
 * Findet .venv/bin/python (macOS, Linux) oder .venv\Scripts\python.exe (Windows) und schaltet die Ausgabe auf
 * UTF-8, damit Umlaute und ✓ auch in der Windows-Konsole ankommen.
 *
 * Offline, wenn die Modelle schon da sind: faster-whisper und transformers fragen bei jedem Laden den Hugging Face
 * Hub, auch wenn das Modell im Cache liegt. Das war gemessen der größte Teil der Zeit (Intake eines 32-s-Clips 310 s
 * statt 34 s, Ausrichtung 106 s statt 8 s). Liegen Modelle im Cache, läuft das Werkzeug darum mit HF_HUB_OFFLINE=1;
 * fehlt eines (z. B. beim ersten Mal in einer anderen Sprache), bricht es schnell ab und läuft gleich noch einmal
 * online. HF_HUB_OFFLINE=0 in der Umgebung schaltet das ab.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
export const python =
  process.platform === "win32"
    ? join(root, ".venv", "Scripts", "python.exe")
    : join(root, ".venv", "bin", "python");

const hub =
  process.env.HF_HUB_CACHE ??
  join(process.env.HF_HOME ?? join(homedir(), ".cache", "huggingface"), "hub");
const cached = () => {
  try {
    return readdirSync(hub).some((d) => d.startsWith("models--"));
  } catch {
    return false;
  }
};
// so melden huggingface_hub und transformers ein Modell, das offline nicht im Cache liegt
const MISSING =
  /LocalEntryNotFound|outgoing traffic has been disabled|couldn't find them in the cached files|in offline mode/i;

/** ein Lauf; die Fehlerausgabe geht live durch und wird zugleich auf ein fehlendes Modell geprüft */
const run = (args, offline) =>
  new Promise((resolve) => {
    const p = spawn(python, args, {
      stdio: ["inherit", "inherit", "pipe"],
      env: {
        ...process.env,
        PYTHONUTF8: "1",
        PYTHONIOENCODING: "utf-8",
        // ausdrücklich, damit ein offline gesetztes HF_HUB_OFFLINE aus der Umgebung den Neustart nicht blockiert
        ...(offline
          ? { HF_HUB_OFFLINE: "1", TRANSFORMERS_OFFLINE: "1" }
          : { HF_HUB_OFFLINE: "0", TRANSFORMERS_OFFLINE: "0" }),
      },
    });
    let missing = false;
    let tail = "";
    p.stderr.on("data", (b) => {
      process.stderr.write(b);
      tail = (tail + b.toString("utf8")).slice(-4000);
      if (offline && MISSING.test(tail)) missing = true;
    });
    p.on("error", (e) => {
      console.error(e.message);
      resolve({ code: 1, missing: false });
    });
    p.on("close", (code) => resolve({ code: code ?? 1, missing }));
  });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [tool, ...args] = process.argv.slice(2);
  if (!existsSync(python)) {
    console.error("Die Python-Umgebung fehlt noch. Einmal einrichten: npm run setup");
    process.exit(1);
  }
  const argv = [join(root, "tools", tool), ...args];
  const offline = process.env.HF_HUB_OFFLINE !== "0" && cached();
  let r = await run(argv, offline);
  if (r.code !== 0 && r.missing) {
    console.error("Modell noch nicht im Cache: lade es online …");
    r = await run(argv, false);
  }
  process.exit(r.code);
}
