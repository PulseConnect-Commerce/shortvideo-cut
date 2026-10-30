/* Holt das PURELEI-Logo aus dem Seitenkopf von purelei.com (offizielle Quelle, ohne Login): SVG bzw. Bild des Logo-Links
   und die Favicons.  node logo.cjs <ziel-ordner> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [out] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const page = await ctx.newPage();
  const r = await page.goto('https://purelei.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  console.log(page.url(), r && r.status(), await page.title());
  const d = await page.evaluate(() => {
    const kopf = document.querySelector('header') || document.body;
    const svgs = [...kopf.querySelectorAll('svg')].map((s) => ({ aria: s.getAttribute('aria-label') || '', title: (s.querySelector('title') || {}).textContent || '', a: (s.closest('a') || {}).href || '', cls: s.getAttribute('class') || '', w: s.getBoundingClientRect().width, h: s.getBoundingClientRect().height, html: s.outerHTML }));
    const imgs = [...kopf.querySelectorAll('img')].map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, a: (i.closest('a') || {}).href || '', w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height }));
    const icons = [...document.querySelectorAll('link[rel*=icon]')].map((l) => l.href);
    return { svgs, imgs, icons };
  });
  d.svgs.slice(0, 12).forEach((s, i) => console.log('svg', i, s.aria, s.title, s.a, s.cls, Math.round(s.w) + 'x' + Math.round(s.h), s.html.length));
  d.imgs.forEach((s, i) => console.log('img', i, s.src, s.alt, s.a, Math.round(s.w) + 'x' + Math.round(s.h)));
  console.log(d.icons);
  fs.writeFileSync(`${out}/purelei-kopf.json`, JSON.stringify({ url: page.url(), status: r && r.status(), datum: new Date().toISOString(), ...d }, null, 1));
  await page.screenshot({ path: `${out}/purelei-kopf.png`, clip: { x: 0, y: 0, width: 1280, height: 160 } });
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
