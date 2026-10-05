/**
 * Der Google-Drive-Ordner für den Online-Modus, ohne Drive-Verbindung (Connector): der Ordner ist "Jeder, der über den
 * Link verfügt" freigegeben, also lässt er sich über seine öffentliche Ansicht auflisten und jede Datei in voller Größe
 * laden. Läuft über curl (auf Windows 10/11, macOS und Linux dabei, und es nutzt den Proxy einer Cloud-Sitzung).
 *
 *   npm run drive -- liste [<ordner-link oder -id>]           Dateien im Ordner: Name, Datum, ID
 *   npm run drive -- laden <name oder id> [<ziel-ordner>]      eine Datei laden (Standard: eingang/)
 *
 * Ohne Ordner-Angabe gilt `drive.id` aus faber-cut.json. Braucht im Netz drive.google.com und
 * drive.usercontent.google.com (siehe skill-onboarding, Internet freigeben).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const [cmd, ...args] = process.argv.slice(2);
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

/** "https://drive.google.com/drive/folders/<id>?usp=sharing", "…open?id=<id>" oder die ID selbst */
const folderId = (s) => {
  if (!s) {
    const cfg = existsSync("faber-cut.json") ? JSON.parse(readFileSync("faber-cut.json", "utf8")) : {};
    s = cfg.drive?.id;
    if (!s) fail("Kein Ordner: npm run drive -- liste <ordner-link>, oder drive.id in faber-cut.json eintragen");
  }
  const m = s.match(/folders\/([\w-]{10,})/) || s.match(/[?&]id=([\w-]{10,})/) || s.match(/^([\w-]{10,})$/);
  if (!m) fail(`Das sieht nicht nach einem Drive-Ordner aus: ${s}`);
  return m[1];
};

const curl = (a) =>
  execFileSync("curl", ["-sSL", "--fail", "-m", "600", ...a], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "pipe"] });

const unescape = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

/** Die öffentliche Ordner-Ansicht: jede Datei ist ein flip-entry mit ID, Titel und Änderungsdatum */
const list = (id) => {
  let page;
  try {
    page = curl([`https://drive.google.com/embeddedfolderview?id=${id}`]);
  } catch {
    fail(
      "Der Ordner ist nicht erreichbar. Entweder ist er nicht \"Jeder, der über den Link verfügt\" freigegeben, " +
        "oder das Netz dieser Sitzung sperrt drive.google.com (Cloud-Umgebung: Netzwerkzugriff).",
    );
  }
  const files = [];
  const re =
    /class="flip-entry" id="entry-([\w-]+)"[\s\S]*?class="flip-entry-title">([\s\S]*?)<\/div>[\s\S]*?class="flip-entry-last-modified"><div>([\s\S]*?)<\/div>/g;
  for (const m of page.matchAll(re)) files.push({ id: m[1], name: unescape(m[2].trim()), geaendert: m[3].trim() });
  return files;
};

if (cmd === "liste") {
  const files = list(folderId(args[0]));
  if (!files.length) {
    console.log("Der Ordner ist leer (oder nicht freigegeben: dann zeigt Drive auch eine leere Liste).");
  } else {
    for (const f of files) console.log(`${f.name.padEnd(40)} ${f.geaendert.padEnd(12)} ${f.id}`);
    console.log(`${files.length} Dateien`);
  }
} else if (cmd === "laden") {
  const [what, dir = "eingang"] = args;
  if (!what) fail("Aufruf: npm run drive -- laden <name oder id> [<ziel-ordner>]");
  let file = { id: what, name: what };
  if (!/^[\w-]{25,}$/.test(what)) {
    const hit = list(folderId()).find((f) => f.name === what);
    if (!hit) fail(`${what} ist nicht im Ordner (npm run drive -- liste zeigt, was drin ist)`);
    file = hit;
  }
  mkdirSync(dir, { recursive: true });
  const out = join(dir, file.name);
  curl(["-o", out, `https://drive.usercontent.google.com/download?id=${file.id}&export=download&confirm=t`]);
  const size = statSync(out).size;
  if (size < 100_000) {
    fail(
      `${out} ist nur ${size} Byte groß: das ist keine Videodatei, sondern eine Drive-Seite. ` +
        "Der Ordner ist vermutlich nicht \"Jeder, der über den Link verfügt\" freigegeben.",
    );
  }
  console.log(`${out}: ${(size / 1e6).toFixed(1)} MB`);
} else {
  fail(
    "Aufruf:\n  npm run drive -- liste [<ordner-link oder -id>]\n  npm run drive -- laden <name oder id> [<ziel-ordner>]",
  );
}
