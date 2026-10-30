/* Erkundet eine öffentliche Seite (ohne Login): Titel, Überschriften, Bilder, Logo-SVG im Seitenkopf.
     node probe.cjs <url> <ziel-ordner> <name> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [URL, out, name] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const page = await ctx.newPage();
  const r = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const d = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2')].slice(0, 12).map((h) => h.tagName + ': ' + h.textContent.trim().slice(0, 90));
    const imgs = [...document.querySelectorAll('img, video, picture source')].slice(0, 40).map((i) => ({ tag: i.tagName, src: (i.currentSrc || i.src || i.srcset || '').slice(0, 200), alt: (i.alt || '').slice(0, 80), w: i.naturalWidth || i.videoWidth || 0, h: i.naturalHeight || i.videoHeight || 0 }));
    const kopf = document.querySelector('header, nav');
    const svg = kopf ? kopf.querySelector('a svg, svg') : null;
    const icons = [...document.querySelectorAll('link[rel*=icon]')].map((l) => l.href);
    return { titel: document.title, hs, imgs, logo: svg ? svg.outerHTML : null, logoAria: svg ? (svg.closest('a') || {}).ariaLabel || (svg.closest('a') || {}).textContent : null, icons };
  });
  fs.writeFileSync(`${out}/${name}.probe.json`, JSON.stringify({ url: page.url(), status: r && r.status(), datum: new Date().toISOString(), ...d }, null, 1));
  console.log(page.url(), r && r.status(), d.titel); console.log(d.hs.join('\n')); console.log(JSON.stringify(d.imgs.filter(i=>i.src), null, 0).slice(0, 3000)); console.log('LOGO', d.logo ? d.logo.slice(0, 300) : null, d.icons);
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
