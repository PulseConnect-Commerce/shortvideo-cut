/* Holt das Shopify-Logo aus dem Seitenkopf von shopify.com (offizielle Quelle, ohne Login) als SVG.
     node logo.cjs <ziel-ordner> */
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [out] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const page = await ctx.newPage();
  const r = await page.goto('https://www.shopify.com/de', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  console.log(page.url(), r && r.status(), await page.title());
  const d = await page.evaluate(() => {
    const kopf = document.querySelector('header') || document.body;
    const svgs = [...kopf.querySelectorAll('svg')].map((s) => ({ aria: s.getAttribute('aria-label') || '', title: (s.querySelector('title') || {}).textContent || '', a: (s.closest('a') || {}).href || '', aAria: (s.closest('a') || {}).ariaLabel || '', w: s.getBoundingClientRect().width, h: s.getBoundingClientRect().height, html: s.outerHTML }));
    const icons = [...document.querySelectorAll('link[rel*=icon]')].map((l) => l.href);
    return { svgs, icons };
  });
  d.svgs.slice(0, 8).forEach((s, i) => console.log(i, s.aria, s.title, s.a, s.aAria, Math.round(s.w) + 'x' + Math.round(s.h), s.html.length));
  console.log(d.icons);
  fs.writeFileSync(`${out}/shopify-kopf.json`, JSON.stringify({ url: page.url(), status: r && r.status(), datum: new Date().toISOString(), ...d }, null, 1));
  await page.screenshot({ path: `${out}/shopify-kopf.png`, clip: { x: 0, y: 0, width: 1280, height: 120 } });
  await browser.close();
})().catch((e) => { console.error('FEHLER', e.message); process.exit(1); });
