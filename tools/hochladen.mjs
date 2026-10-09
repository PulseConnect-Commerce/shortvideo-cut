/**
 * Lädt ein fertiges Video in deinen Drive-Ordner, in einen Unterordner mit dem Titel des Videos:
 *
 *   npm run hochladen -- <datei> "<Titel>" [<dateiname in Drive>]
 *
 * Braucht den Upload-Helfer (tools/drive-upload.gs, einmal in deinem Google-Konto eingerichtet) und seine
 * Web-App-Adresse in DRIVE_UPLOAD_URL (Umgebungsvariable der Cloud-Umgebung oder Datei .env). Der Helfer legt den
 * Ordner an und gibt eine Upload-Adresse zurück; das Video geht dann per curl direkt zu Google Drive.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const [datei, titel, name] = process.argv.slice(2);
const fail = (s) => {
  console.error(`\n  ✗ ${s}\n`);
  process.exit(1);
};
if (!datei || !titel) fail('Aufruf: npm run hochladen -- <datei> "<Titel>" [<dateiname in Drive>]');
if (!existsSync(datei)) fail(`Datei fehlt: ${datei}`);

const envFile = join(root, ".env");
let url = process.env.DRIVE_UPLOAD_URL?.trim();
if (!url && existsSync(envFile))
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const [k, ...v] = line.split("=");
    if (k.trim() === "DRIVE_UPLOAD_URL" && v.join("=").trim()) url = v.join("=").trim().replace(/^["']|["']$/g, "");
  }
if (!url) fail("DRIVE_UPLOAD_URL fehlt: die Web-App-Adresse des Upload-Helfers (tools/drive-upload.gs) in die Umgebung oder in .env");

const ziel = name ?? `${titel}${extname(datei)}`;
const mime = { ".mp4": "video/mp4", ".mov": "video/quicktime", ".jpg": "image/jpeg", ".png": "image/png" }[extname(datei).toLowerCase()] ?? "application/octet-stream";
const curl = (args) => execFileSync("curl", ["-sS", "--fail-with-body", "--retry", "3", ...args], { encoding: "utf8", maxBuffer: 1 << 24 });

let antwort;
try {
  antwort = JSON.parse(curl(["-L", "-H", "Content-Type: application/json", "--data-binary", JSON.stringify({ ordner: titel, name: ziel, mime }), url]));
} catch (e) {
  fail(`Upload-Helfer antwortet nicht wie erwartet (Adresse richtig, Bereitstellung "Jeder"?): ${String(e.stdout ?? e.message).slice(0, 300)}`);
}
if (!antwort.upload) fail(`Keine Upload-Adresse vom Helfer: ${JSON.stringify(antwort).slice(0, 300)}`);
const mb = (statSync(datei).size / 1e6).toFixed(1);
console.log(`Lade ${basename(datei)} (${mb} MB) nach Drive: ${titel}/${ziel} …`);
const datei_info = JSON.parse(curl(["-X", "PUT", "-H", `Content-Type: ${mime}`, "--upload-file", datei, antwort.upload]));
console.log(`✓ ${datei_info.name} in Drive: ${datei_info.webViewLink ?? ""}\n  Ordner: ${antwort.ordner}`);
