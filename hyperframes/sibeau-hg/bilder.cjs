/* Listet die Bilder im Shopify-Beitrag aus dem Briefing (Quelle, Alt-Text, Größe, Lage) für M10 · SI BEAU.  node bilder.cjs <ziel-json> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true, locale: 'de-DE' });
  const page = await ctx.newPage();
  await page.goto('https://www.shopify.com/de/blog/kultur-und-kreativpilotenpreis-si-beau', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(5000);
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(200); }
  const imgs = await page.evaluate(() => [...document.querySelectorAll('article img, main img')].map((i) => { const r = i.getBoundingClientRect(); return { src: i.currentSrc || i.src, alt: i.alt, w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY), nw: i.naturalWidth, nh: i.naturalHeight }; }).filter((i) => i.w > 100));
  fs.writeFileSync(process.argv[2], JSON.stringify(imgs, null, 1));
  imgs.forEach((i) => console.log(i.y, i.w + 'x' + i.h, i.nw + 'x' + i.nh, JSON.stringify(i.alt), i.src.slice(0, 140)));
  await browser.close();
})();
