/* Bühnenbilder für M02 · PURELEI im M-Aufbau "oben der Inhalt, unten er" (Pauls Vorgabe 31.10.2026, karten-aufbau.md
   "Marken-Story: oben der Inhalt, unten er"): je Bild ein scharfer Ausschnitt 1080 x 640 aus einer ganzen Seite von
   purelei.com (aufgenommen mit aufnahme.cjs, Handy-Ansicht 432 css-px @2,5 = 1080 px breit, am 31.10.2026 ohne Login).
   Nur zugeschnitten (ffmpeg crop), bei Text-Abschnitten oben mit der Seitenfarbe aufgefüllt (pad), damit Überschriften
   unter der Suchleiste von TikTok (bis y ~260) heraus in den sicheren Bereich (ab y 280) rutschen; nichts abgedunkelt,
   nichts weichgezeichnet, nichts dazugemalt.

     node hyperframes/purelei-hg/buehne.cjs <ordner-ganze-seiten> public/broll/purelei

   seite: Bild der ganzen Seite (<seite>.png), y: Seiten-px (= css-y x 2,5) der Oberkante des Ausschnitts, oben: so viel px
   mit der Seitenfarbe darüber (der Ausschnitt ist dann 640 - oben hoch). Zeiten im Video: src/projekte/purelei/Video.tsx BILDER. */
const { execFileSync } = require('child_process');
const path = require('path');

const B = 640;
const BILDER = {
  'b-lei': { seite: 'lei', y: 700 },                  // Über die LEI: Hände mit Charm-Armreif (Kopfbild)
  'b-sand': { seite: 'aloha', y: 5300 },              // Über PURELEI: "PURELEI" in den Sand geschrieben
  'b-hawaii': { seite: 'lei', y: 7600 },              // Über die LEI, Abschnitt Hawaii: Armreif mit Blüten
  'b-aloha': { seite: 'aloha', y: 1000 },             // Über PURELEI: "ALOHA! Schön, dass du da bist."
  'b-collection': { seite: 'grid', y: 1300 },         // LEI Collection: Produktkacheln mit Name und Preis
  'b-neuheiten': { seite: 'home', y: 5100, oben: 200 }, // Startseite: "Shoppe unsere Neuheiten"
  'b-community': { seite: 'community', y: 5880 },     // Blog: "Created with the Community" / "Mit unserer Community kreiert"
  'b-ketten': { seite: 'ketten', y: 0, oben: 120 },   // Kategorie Ketten: Überschrift, Text, Unterkategorien
  'b-werte': { seite: 'aloha', y: 3360, oben: 150 },  // Über PURELEI: LIVE ALOHA / PURE / CONNECTED / AUTHENTIC
  'b-markenwelt': { seite: 'aloha', y: 15450 },       // Über PURELEI, Abschnitt "Was PURELEI dir bietet": Ringe und Kette auf Holz
  'b-lookgrid': { seite: 'lei', y: 5680, oben: 250 }, // Über die LEI: "Entdecke die LEI Collection" (einheitliche Produktbilder)
  'b-goetze': { seite: 'goetze', y: 0, oben: 120 },   // Festive Collection by Ann-Kathrin Götze
  'b-karo': { seite: 'karo', y: 700 },                // Adventskalender x @karokauer: "Karos Favoriten-Adventskalender"
  'b-clubpreis': { seite: 'kette', y: 1960, oben: 240 }, // Produktseite: PURELEI Club Preis, Club Member in der App
  'b-club': { seite: 'club', y: 1830, oben: 250 },    // Mahina Club (Schmuck-Abo): "Exklusive Designs treffen auf Deine persönliche Auswahl"
  'b-ohrringe': { seite: 'home', y: 6600 },           // Startseite: LEI Charm Ohrringe am Ohr (Produktfoto)
  'b-bedeutung': { seite: 'lei', y: 6940, oben: 170 }, // Über die LEI: "Inspiriert von Hawaii / Die Bedeutung einer Lei"
};

const [quelle, ziel] = process.argv.slice(2);
if (!quelle || !ziel) { console.error('Aufruf: node buehne.cjs <ordner-ganze-seiten> <ziel-ordner>'); process.exit(1); }
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'pipe', 'inherit'] });
for (const [name, b] of Object.entries(BILDER)) {
  const src = path.join(quelle, b.seite + '.png');
  const oben = b.oben || 0;
  // Seitenfarbe für das Auffüllen: der Pixel links oben im Ausschnitt
  const px = ff(['-i', src, '-vf', `crop=1:1:4:${b.y},format=rgb24`, '-f', 'rawvideo', '-']);
  const farbe = '0x' + [...px.subarray(0, 3)].map((v) => v.toString(16).padStart(2, '0')).join('');
  const vf = `crop=1080:${B - oben}:0:${b.y}` + (oben ? `,pad=1080:${B}:0:${oben}:${farbe}` : '');
  ff(['-i', src, '-vf', vf, '-q:v', '3', path.join(ziel, name + '.jpg')]);
  console.log(name, b.seite, b.y, oben ? `oben ${oben} (${farbe})` : '');
}
