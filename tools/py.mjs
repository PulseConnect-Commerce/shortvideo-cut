/**
 * Startet ein Python-Werkzeug mit der Python-Umgebung des Repos, auf Windows, macOS und Linux gleich:
 *
 *   node tools/py.mjs <werkzeug.py> [argumente …]      (die npm-Skripte in package.json rufen das auf)
 *
 * Findet .venv/bin/python (macOS, Linux) oder .venv\Scripts\python.exe (Windows) und schaltet die Ausgabe auf
 * UTF-8, damit Umlaute und ✓ auch in der Windows-Konsole ankommen.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
export const python =
  process.platform === "win32"
    ? join(root, ".venv", "Scripts", "python.exe")
    : join(root, ".venv", "bin", "python");

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [tool, ...args] = process.argv.slice(2);
  if (!existsSync(python)) {
    console.error("Die Python-Umgebung fehlt noch. Einmal einrichten: npm run setup");
    process.exit(1);
  }
  const r = spawnSync(python, [join(root, "tools", tool), ...args], {
    stdio: "inherit",
    env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" },
  });
  process.exit(r.status ?? 1);
}
